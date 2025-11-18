import { useEffect, useInsertionEffect, useState, useTransition } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { OrdersDelivery } from '../../../utils/string';
import {
  DiscountCampaign,
  Order,
  OrderCancelled,
  OrderCash,
  OrderCoin,
  OrderDelivered,
  OrderTigoPesa,
} from '../../../utils/constants';
import Method from '../../../utils/methods';
import APICallService from '../../../api/apiCallService';
import { ordersDelivery } from '../../../api/apiEndPoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import Loader from '../../../Global/loader';
import RemoveImg from '../../../umart_admin/assets/media/svg_uMart/cross_gray.svg';
import { success } from '../../../Global/toast';
import { ordersToast } from '../../../utils/toast';
import ChipsToggle from '../../custom/UI/ChipsToggle';
const cancelledBy = ['Super admin', 'Sub admin', 'Customer'];
const stockDecreasedReason = ['Damaged', 'Missing', 'Out of Stock'];
const stockIncreasedReason = ['Customer wants more'];
const EditOrder = () => {
  const { currentUser } = useAuth();
  const location: any = useLocation();
  const customVal: any = location.state;
  const [orderDetails, setOrderDetails] = useState<any>();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editData, setEditData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (!location.state || !Method.hasModulePermission(Order, currentUser)) {
        return window.history.back();
      }
      setFetchLoading(true);
      await fetchOrderDetails(customVal._id);
      setFetchLoading(false);
    })();
  }, []);
  const fetchOrderDetails = async (id: string) => {
    setFetchLoading(true);
    const apiService = new APICallService(
      ordersDelivery.orderInfo,
      id,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      setOrderDetails(response.record);
      const temp = response?.record?.variants.map((item: any) => {
        return {
          ...item,
          maxStock:
            item?.variant?.inventoryInfo?.quantityTypes &&
            item?.variant?.inventoryInfo?.quantityTypes?.length
              ? item?.variant?.inventoryInfo?.quantityTypes[0]?.remainingQty +
                  item?.stockCount || 0
              : item?.stockCount,
          originalStockCount: item?.stockCount,
        };
      });
      setEditData(temp || []);
    }
    setFetchLoading(false);
  };
  const getStatusDate = (status: number) => {
    const log = orderDetails.statusesLogs.find(
      (log: any) => log.status === status
    );
    if (log && log.statusUpdatedAt) {
      const date = Method.convertDateToDDMMYYYYHHMMAMPM(log.statusUpdatedAt);
      return date;
    }
    return '';
  };
  const getTotalItemAmount = (product: any) => {
    const stockCount = product?.stockCount || 0;
    if (product?.discountByQuantitiesEnabled) {
      const bundlePrice = product?.totalAmount / product?.totalBundle;
      const totalBundle = stockCount / product?.bundleSize;
      return totalBundle * bundlePrice;
    } else {
      const amount = product?.amount || 0;
      const discount = product?.discount || 0;
      const newPrice = amount - discount;
      return newPrice * stockCount;
    }
  };
  const handleQuantityChange = (
    stockCount: number,
    index: number,
    productVal: any
  ) => {
    const temp = [...editData];
    stockCount = stockCount || 0;
    if (temp.length === 1 && stockCount === 0) {
      return;
    }
    if (stockCount < 0 || stockCount > productVal.maxStock) return;
    temp[index].stockCount = parseInt(stockCount + '');
    // if (stockCount === 0) {
    //   temp.splice(index, 1);
    // }
    if (stockCount > temp[index].originalStockCount) {
      temp[index].reason = stockIncreasedReason[0];
    } else if (stockCount < temp[index].originalStockCount) {
      temp[index].reason = stockDecreasedReason[0];
    }
    setEditData(temp);
  };
  const getTotalOrderValue = (data: any) => {
    return data.reduce((sum: any, item: any) => {
      return sum + getTotalItemAmount(item);
    }, 0);
  };
  const getGrandTotal = () => {
    const itemSum = getTotalOrderValue(editData);
    return (
      itemSum +
      (orderDetails?.payment?.totalDistanceCharge || 0) +
      (orderDetails?.payment?.platformFee || 0)
    );
  };
  const handleRemove = (index: number) => {
    const temp = [...editData];
    temp.splice(index, 1);
    setEditData(temp);
  };
  const handleSave = async () => {
    let data: any = [];
    editData.forEach((item: any) => {
      if (item?.stockCount !== item?.originalStockCount) {
        data.push({
          variant: item?.variant?._id,
          stockCount: item?.originalStockCount || 0,
          updatedStockCount: item?.stockCount || 0,
          stockUpdateReason: item?.reason || '',
        });
      }
    });
    if (data.length === 0) {
      return;
    }
    setLoading(true);
    const apiCallService = new APICallService(
      ordersDelivery.editOrder,
      {
        variants: data,
      },
      { id: customVal?._id },
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const apiCallService2 = new APICallService(
        ordersDelivery.acceptEditOrder,
        {},
        { id: customVal?._id },
        '',
        false,
        '',
        Order
      );
      const response2 = await apiCallService2.callAPI();
      success(ordersToast.orderUpdated);
      navigate(-1 as any, { replace: true });
    }
    setLoading(false);
  };
  console.log('eeee', editData);
  const handleReasonSelect = (index: number, text: string) => {
    const temp = [...editData];
    temp[index].reason = text;
    setEditData(temp);
  };
  return (
    <Row className="g-8 mb-8">
      <Col
        xs={12}
        className="d-flex align"
      >
        <h1 className="fs-22 fw-bolder mb-0"> {'Edit Order'}</h1>
      </Col>
      {!fetchLoading ? (
        <>
          <Col md={6}>
            <Card className="border">
              <Card.Header className="bg-light align-items-center">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <Card.Title className="fs-22 fw-bolder">
                    {OrdersDelivery.basicDetails}
                  </Card.Title>
                </div>
              </Card.Header>
              <Card.Body className="pb-3">
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.customerName}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {orderDetails.customer.name}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.orderId}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      #{orderDetails.refKey}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.orderPlaced}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                        orderDetails._createdAt
                      )}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.paymentMethod}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    {orderDetails.payment.completed ? (
                      orderDetails.payment.transactions[0]?.paymentMethod ===
                      orderDetails.payment.paymentMode ? (
                        <span className="fw-bold fs-16 fw-600 text-dark text-decoration">
                          {orderDetails.payment.paymentMode === OrderCash
                            ? orderDetails?.payment?.usedWalletCoin === 0
                              ? 'Cash'
                              : 'Cash with coin'
                            : ''}
                          {orderDetails.payment.paymentMode === OrderTigoPesa
                            ? orderDetails?.payment?.usedWalletCoin === 0
                              ? 'Online'
                              : 'Online with coin'
                            : ''}
                          {orderDetails.payment.paymentMode === OrderCoin
                            ? 'Coin'
                            : ''}
                        </span>
                      ) : (
                        <>
                          <span className="fw-bold fs-16 fw-600 text-gray text-decoration-line-through">
                            {orderDetails.payment.paymentMode === OrderCash
                              ? orderDetails?.payment?.usedWalletCoin === 0
                                ? 'Cash'
                                : 'Cash with coin'
                              : ''}
                            {orderDetails.payment.paymentMode === OrderTigoPesa
                              ? orderDetails?.payment?.usedWalletCoin === 0
                                ? 'Online'
                                : 'Online with coin'
                              : ''}
                          </span>
                          {''}
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {orderDetails.payment.transactions[0]
                              ?.paymentMethod === OrderCash
                              ? orderDetails?.payment?.usedWalletCoin === 0
                                ? 'Cash'
                                : 'Cash with coin'
                              : ''}
                            {orderDetails.payment.transactions[0]
                              ?.paymentMethod === OrderTigoPesa
                              ? orderDetails?.payment?.usedWalletCoin === 0
                                ? 'Online'
                                : 'Online with coin'
                              : ''}
                            {orderDetails.payment.paymentMode === OrderCoin
                              ? 'Coin'
                              : ''}
                            {/* {orderDetails.payment.paymentMode === OrderMPesa
                                      ? 'MPesa'
                                      : ''}
                                    {orderDetails.payment.paymentMode === OrderCard
                                      ? 'Card'
                                      : ''} */}
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {orderDetails.payment.paymentMode === OrderCash
                            ? orderDetails.payment.usedWalletCoin === 0
                              ? 'Cash'
                              : 'Cash with coin'
                            : ''}
                          {orderDetails.payment.paymentMode === OrderTigoPesa
                            ? orderDetails.payment.usedWalletCoin === 0
                              ? 'Online'
                              : 'Online with coin'
                            : ''}
                          {/* {orderDetailsJSON.payment.paymentMode === OrderMPesa
                                    ? 'MPesa'
                                    : ''}
                                  {orderDetailsJSON.payment.paymentMode === OrderCard
                                    ? 'Card'
                                    : ''} */}
                        </span>
                      </>
                    )}
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.phoneNum}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {!orderDetails?.selfPickedUp
                        ? (orderDetails?.address?.phoneCountry || '') +
                          ' ' +
                          (orderDetails?.address?.phone || '')
                        : 'NA'}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.billingAdd}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {!orderDetails?.selfPickedUp
                        ? `
                                  ${
                                    orderDetails?.address?.floorNumber
                                      ? orderDetails?.address?.floorNumber +
                                        ', '
                                      : ''
                                  }
                                ${
                                  orderDetails?.address?.houseNumber
                                    ? orderDetails?.address?.houseNumber + ', '
                                    : ''
                                }
                                  ${
                                    orderDetails?.address?.buildingName
                                      ? orderDetails?.address?.buildingName +
                                        ', '
                                      : ''
                                  }
                                  ${
                                    orderDetails?.address?.landmark
                                      ? orderDetails?.address?.landmark + ', '
                                      : ''
                                  }
                                  ${
                                    orderDetails?.address?.addressLine1
                                      ? orderDetails?.address?.addressLine1 +
                                        ' '
                                      : ''
                                  }
                                  `
                        : 'NA'}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={5}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.distCity}:
                    </label>
                  </Col>
                  <Col
                    md={7}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {!orderDetails?.selfPickedUp
                        ? orderDetails?.address
                          ? (orderDetails?.address?.districtName || '') +
                            ' ' +
                            (orderDetails?.address?.city || '')
                          : 'NA'
                        : 'NA'}
                    </span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border">
              <Card.Header className="bg-light align-items-center">
                <Card.Title className="fs-22 fw-bolder">
                  {OrdersDelivery.deliveryDetails}
                </Card.Title>
              </Card.Header>
              <Card.Body className="pb-3">
                <Row className="mb-5">
                  <Col
                    md={4}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {' '}
                      {OrdersDelivery.deliveryUser}:
                    </label>
                  </Col>
                  <Col
                    md={8}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {orderDetails.routesUsers[0]?.deliveryUser?.name || 'NA'}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={4}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.phoneNum}:
                    </label>
                  </Col>
                  <Col
                    md={8}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {orderDetails.routesUsers[0]?.deliveryUser
                        ?.phoneCountry || 'NA'}{' '}
                      {orderDetails.routesUsers[0]?.deliveryUser?.phone || ''}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={4}
                    xs={4}
                  >
                    {orderDetails.status === OrderCancelled ? (
                      <label className=" fs-16 fw-500 text-dark">
                        {OrdersDelivery.headingCancelBy}:
                      </label>
                    ) : (
                      <label className=" fs-16 fw-500 text-dark">
                        {orderDetails.statusesLogs.find(
                          (log: any) => log.status === OrderDelivered
                        )
                          ? OrdersDelivery.deliverOn
                          : OrdersDelivery.deliverBy}
                        :
                      </label>
                    )}
                  </Col>
                  <Col
                    md={8}
                    xs={8}
                  >
                    {orderDetails.status === OrderCancelled ? (
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {orderDetails?.cancelledBy?.userType
                            ? cancelledBy[
                                orderDetails?.cancelledBy?.userType - 1
                              ]
                            : 'NA'}
                        </span>
                        <span className="text-primary text-end fs-16 fw-700 text-decoration-underline me-3 cursor-pointer">
                          View reason
                        </span>
                      </div>
                    ) : (
                      <span className="fw-bold fs-16 fw-600 text-dark">
                        {orderDetails.routesUsers.length > 0 ||
                        orderDetails?.instantOrder ||
                        orderDetails?.selfPickedUp
                          ? getStatusDate(orderDetails.status)
                          : 'NA'}
                      </span>
                    )}
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={4}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.shippingAdd}:
                    </label>
                  </Col>
                  <Col
                    md={8}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {!orderDetails.selfPickedUp
                        ? `
                                  ${
                                    orderDetails?.address?.floorNumber
                                      ? orderDetails?.address?.floorNumber +
                                        ', '
                                      : ''
                                  }
                                ${
                                  orderDetails?.address?.houseNumber
                                    ? orderDetails?.address?.houseNumber + ', '
                                    : ''
                                }
                                  ${
                                    orderDetails?.address?.buildingName
                                      ? orderDetails?.address?.buildingName +
                                        ', '
                                      : ''
                                  }
                                  ${
                                    orderDetails?.address?.landmark
                                      ? orderDetails?.address?.landmark + ', '
                                      : ''
                                  }
                                  ${
                                    orderDetails?.address?.addressLine1
                                      ? orderDetails?.address?.addressLine1 +
                                        ' '
                                      : ''
                                  }
                                  `
                        : 'NA'}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    md={4}
                    xs={4}
                  >
                    <label className=" fs-16 fw-500 text-dark">
                      {OrdersDelivery.distCity}:
                    </label>
                  </Col>
                  <Col
                    md={8}
                    xs={8}
                  >
                    <span className="fw-bold fs-16 fw-600 text-dark">
                      {!orderDetails?.selfPickedUp
                        ? orderDetails?.address
                          ? (orderDetails?.address?.districtName || '') +
                            ' ' +
                            (orderDetails?.address?.city || '')
                          : 'NA'
                        : 'NA'}
                    </span>
                  </Col>
                </Row>
                {orderDetails?.scheduleOrder && orderDetails?.slot ? (
                  <Row className="mb-5">
                    <Col
                      md={4}
                      xs={4}
                    >
                      <label className=" fs-16 fw-500 text-dark">
                        {'Scheduled Delivery'}:
                      </label>
                    </Col>
                    <Col
                      md={8}
                      xs={8}
                    >
                      <span className="fw-bold fs-16 fw-600 text-dark">
                        {`${Method.convertDateToFormat(
                          orderDetails?.slot?.date,
                          'DD-MM-YYYY'
                        )} , ${Method.getTimeWithAMPM(
                          orderDetails?.slot?.startTime
                        )}`}
                      </span>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col
            xs={12}
            className="mt-8"
          >
            {editData && editData?.length ? (
              <>
                <Card className="border border-1 border-gray-300 bg-f9f9f9 mb-7">
                  <Card.Header className="border-bottom-0">
                    <Card.Title className="fs-20 fw-bolder">
                      Products
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="pt-0">
                    <div className="table-responsive">
                      <table className="table table-rounded table-row-bordered align-middle gs-9 gy-4 mb-0">
                        <thead>
                          <tr className="fs-16 fw-bold text-dark h-70px align-middle">
                            <th className="min-w-150px">Product name</th>
                            <th className="min-w-125px">Unit price</th>
                            <th className="min-w-175px">Quantity</th>
                            <th className="min-w-125px">Total amount</th>
                            <th className="min-w-50px text-end"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {editData?.map((productVal: any, index: number) => {
                            return (
                              <>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="symbol symbol-50px border me-5">
                                        <img
                                          src={
                                            productVal?.variant?.media[0]
                                              ?.url || ''
                                          }
                                          className="object-fit-contain"
                                          alt=""
                                        />
                                      </div>
                                      <div className="fs-15 fw-600">
                                        {productVal?.variant?.title.replace(
                                          /\s*\)\s*/g,
                                          ')'
                                        )}
                                        <br />
                                        <span className="fs-14 fw-500 text-gray">
                                          {productVal?.discountByQuantitiesEnabled &&
                                          productVal?.bundleSize
                                            ? productVal?.bundleSize +
                                              ' Units Bunch'
                                            : ''}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {productVal?.discountByQuantitiesEnabled &&
                                    productVal?.bundleSize ? (
                                      <div className="fs-15 fw-600">
                                        {' '}
                                        TSh{' '}
                                        {Method.formatCurrency(
                                          productVal?.totalAmount /
                                            productVal?.totalBundle
                                        )}
                                      </div>
                                    ) : (
                                      <>
                                        {' '}
                                        {productVal?.discount > 0 ? (
                                          <>
                                            <div className="fs-15 fw-600 text-decoration-line-through text-gray">
                                              {' '}
                                              TSh{' '}
                                              {Method.formatCurrency(
                                                productVal?.amount || 0
                                              )}
                                            </div>
                                            <div className="fs-15 fw-600">
                                              {' '}
                                              TSh{' '}
                                              {Method.formatCurrency(
                                                productVal?.amount -
                                                  productVal?.discount
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="fs-15 fw-600">
                                            {' '}
                                            TSh{' '}
                                            {Method.formatCurrency(
                                              productVal?.amount || 0
                                            )}
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {/* <div className="fs-15 fw-600">
                                                TSh{' '}
                                                {Method.formatCurrency(
                                                  productVal?.quantityTypes?.length
                                                    ? productVal?.quantityTypes[0]
                                                        .amount || 0
                                                    : 0
                                                )}
                                              </div> */}
                                  </td>
                                  <td>
                                    <div className="stepperInput">
                                      <Button
                                        size="sm"
                                        className="button button--addOnLeft bg-primary"
                                        onClick={() => {
                                          let currentStockCount = parseInt(
                                            productVal.stockCount !== undefined
                                              ? productVal.stockCount
                                              : 0
                                          );
                                          if (
                                            productVal.discountByQuantitiesEnabled
                                          ) {
                                            currentStockCount -=
                                              productVal?.bundleSize;
                                          } else {
                                            currentStockCount--;
                                          }
                                          handleQuantityChange(
                                            currentStockCount,
                                            index,
                                            productVal
                                          );
                                        }}
                                      >
                                        -
                                      </Button>
                                      <input
                                        type="number"
                                        className="input stepperInput__input form-control"
                                        // value={
                                        //   productVal?.isDiscountByQuantity &&
                                        //   productVal?.bunchObj
                                        //     ? productVal?.quantityTypes[0][
                                        //         'discountsByQuantities'
                                        //       ][productVal.bunchObj.index]
                                        //         ?.stockCount || 0
                                        //     : productVal?.stockCount || 0
                                        // }
                                        value={productVal?.stockCount || 0}
                                        onChange={(event: any) => {
                                          handleQuantityChange(
                                            event.target.value,
                                            index,
                                            productVal
                                          );
                                        }}
                                        onKeyPress={(event: any) => {
                                          Method.handleOnKeyPress(event);
                                        }}
                                        disabled={
                                          productVal?.discountByQuantitiesEnabled
                                        }
                                      />
                                      <Button
                                        size="sm"
                                        className="button button--addOnRight bg-primary"
                                        onClick={() => {
                                          let currentStockCount = parseInt(
                                            productVal.stockCount !== undefined
                                              ? productVal.stockCount
                                              : 0
                                          );
                                          if (
                                            productVal?.discountByQuantitiesEnabled
                                          ) {
                                            currentStockCount +=
                                              productVal?.bundleSize;
                                          } else {
                                            currentStockCount++;
                                          }
                                          handleQuantityChange(
                                            currentStockCount,
                                            index,
                                            productVal
                                          );
                                        }}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="fs-15 fw-600">
                                      TSh{' '}
                                      {productVal?.isDiscountByQuantity &&
                                      productVal?.bunchObj
                                        ? Method.formatCurrency(
                                            (productVal?.quantityTypes[0][
                                              'discountsByQuantities'
                                            ][productVal.bunchObj.index]
                                              ?.stockCount || 0) *
                                              (productVal?.bunchObj
                                                ?.discountAmt || 0)
                                          )
                                        : // getTotalAmount(productVal)
                                          Method.formatCurrency(
                                            getTotalItemAmount(productVal)
                                          )}
                                    </div>
                                  </td>
                                  <td>
                                    {/* <div className="cursor-pointer">
                                      {editData?.length > 1 && (
                                        <img
                                          src={RemoveImg}
                                          alt="remove"
                                          onClick={() => handleRemove(index)}
                                        />
                                      )}
                                    </div> */}
                                  </td>
                                </tr>
                                {productVal?.stockCount !=
                                  productVal?.originalStockCount && (
                                  <tr className="border-top-0">
                                    <td colSpan={5}>
                                      <div>
                                        {productVal?.stockCount <
                                        productVal?.originalStockCount ? (
                                          stockDecreasedReason.map((item) => (
                                            <ChipsToggle
                                              key={item}
                                              title={item}
                                              onClick={() => {
                                                handleReasonSelect(index, item);
                                              }}
                                              active={
                                                productVal?.reason &&
                                                productVal?.reason === item
                                              }
                                            />
                                          ))
                                        ) : (
                                          <></>
                                        )}
                                        {productVal?.stockCount >
                                        productVal?.originalStockCount ? (
                                          stockIncreasedReason.map((item) => (
                                            <ChipsToggle
                                              key={item}
                                              title={item}
                                              onClick={() => {
                                                handleReasonSelect(index, item);
                                              }}
                                              active={
                                                productVal?.reason &&
                                                productVal?.reason === item
                                              }
                                            />
                                          ))
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="border mt-4">
                  <Card.Header className="bg-light align-items-center pe-0">
                    <div className="d-flex align-items-center  w-100">
                      <Card.Title className="fs-20 fw-bolder d-flex justify-content-between w-100 pe-0">
                        <div>{'Order Price Details'}</div>
                        {/* <button
                          type="button"
                          className="me-2  btn printBtn text-primary btn-lg"
                          onClick={() => setShowCouponModal(true)}
                          disabled={!props.buyer}
                        >
                          <span className="indicator-label fs-16 fw-bold">
                            View Coupons
                          </span>
                        </button> */}
                      </Card.Title>
                    </div>
                  </Card.Header>
                  <Card.Body className="pb-3">
                    <Row>
                      <Col xs={12}>
                        <div className="d-flex justify-content-between">
                          <span className="fs-18 fw-500">
                            TSh {`(${editData?.length} items) :`}
                          </span>
                          <span className="">
                            <div className="fs-18 fw-500">
                              TSh{' '}
                              {Method.formatCurrency(
                                getTotalOrderValue(editData) || 0
                              )}
                            </div>
                            {/* <div className="text-decoration-line-through fs-14 text-gray-500 text-end">
                              TSh{' '} */}
                            {/* {Method.formatCurrency(
                                getRealTotalOrderValue(
                                  props.selectedProducts
                                ) || 0
                              )} */}
                            {/* 44445
                            </div> */}
                          </span>
                        </div>
                      </Col>
                      {/* {editData?.selectedCoupon ? (
                        <Col
                          xs={12}
                          className="my-1"
                        >
                          <div className="d-flex justify-content-between">
                            <span className="fs-18 fw-500">
                              Coupon savings :
                            </span>
                            <span className="fs-18 fw-500 text-primary">
                              - TSh{' '}
                              {Method.formatCurrency(
                                // getCartDiscount(props.selectedCoupon) || 0
                                3232
                              )}
                            </span>
                          </div>
                        </Col>
                      ) : orderDetails?.appliedCartDiscount ? (
                        <Col
                          xs={12}
                          className="my-1"
                        >
                          <div className="d-flex justify-content-between">
                            <span className="fs-18 fw-500">
                              Cart value discount :
                            </span>
                            <span className="fs-18 fw-500 text-primary">
                              - TSh{' '}
                              {Method.formatCurrency(
                                // getCartDiscount(props.appliedCartDiscount) || 0
                                3432
                              )}
                            </span>
                          </div>
                        </Col>
                      ) : (
                        <></>
                      )} */}
                  
                      <Col
                        xs={12}
                        className="my-3"
                      >
                        <div className="d-flex justify-content-between">
                          <span className="fs-18 fw-500">Platform fees:</span>
                          <span className="fs-18 fw-500">
                            TSh{' '}
                            {Method.formatCurrency(
                              orderDetails?.payment?.platformFee || 0
                            )}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={12}
                        className="my-3"
                      >
                        <div className="d-flex justify-content-between">
                          <span className="fs-18 fw-500">
                            Delivery Charges:
                          </span>
                          <span className="fs-18 fw-500">
                            TSh{' '}
                            {Method.formatCurrency(
                              orderDetails?.payment?.totalDistanceCharge || 0
                            )}
                          </span>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="d-flex justify-content-between">
                          <span className="fs-20 fw-500">Total Amount:</span>
                          <span className="fs-20 fw-500">
                            TSh{' '}
                            {/* {Method.formatCurrency(
                              getTotalOrderValue(props.selectedProducts) +
                                (props.initData?.platformFee || 0) -
                                (props?.appliedCartDiscount ||
                                props?.selectedCoupon
                                  ? getCartDiscount(
                                      props?.selectedCoupon ||
                                        props.appliedCartDiscount
                                    )
                                  : 0)
                            )} */}
                            {Method.formatCurrency(getGrandTotal())}
                          </span>
                        </div>
                        {/* {props?.checkStockResult?.reward?.discountValue ? (
                          <div className="mt-3 text-bg-primary-light my-3 mt-5">
                            <span className="me-2 bg-light-primary text-primary px-5 fs-15 fw-500 py-2 rounded-1">
                              {`🎉 Cheers! Customer will get ${props?.checkStockResult?.reward?.discountValue} coins on this order.`}
                            </span>
                          </div>
                        ) : (
                          <></>
                        )} */}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <></>
            )}
          </Col>
          <Col
            xs={12}
            className="mt-7"
          >
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {!loading && <span className="indicator-label">Save</span>}
              {loading && (
                <span
                  className="indicator-progress"
                  style={{ display: 'block' }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </Button>
          </Col>
        </>
      ) : (
        <Col
          xs={12}
          className="h-200px d-flex justify-content-center align-items-center"
        >
          <Loader loading={fetchLoading} />
        </Col>
      )}
    </Row>
  );
};
export default EditOrder;
