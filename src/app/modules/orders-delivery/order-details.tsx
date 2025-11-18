import { Button, Card, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrdersDelivery, String } from '../../../utils/string';
import {
  OrderCancelled,
  Order,
  OrderCash,
  OrderCoin,
  OrderDelivered,
  OrderProcessed,
  OrderTigoPesa,
  PickedUp,
  Edit,
} from '../../../utils/constants';
import OrderDeliveryTimeline from './order-timeline';
import Method from '../../../utils/methods';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { ordersDelivery } from '../../../api/apiEndPoints';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import ReasonForReturnModal from '../../modals/reason-return-modal';
import CancelOrderModal from '../../modals/cancel-order-reason';
import { success } from '../../../Global/toast';
import { ordersToast } from '../../../utils/toast';
import { useAuth } from '../auth';
const menuOption = [
  {
    label: (
      <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
        Edit order
      </button>
    ),
    value: 2,
  },
  {
    label: (
      <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4 ">
        Cancel this order
      </button>
    ),
    value: 1,
  },
];
const cancelledBy = ['Super admin', 'Sub admin', 'Customer'];
const OrderDetails = () => {
  const navigate = useNavigate();
  const location: any = useLocation();
  const customVal: any = location.state;
  const [isDownloading, setIsDownloading] = useState(false);
  const [invoice, setInvoice] = useState<any>();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();
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
    }
    setFetchLoading(false);
  };
  const handleDownload = async (id: string) => {
    setIsDownloading(true);
    const apiService = new APICallService(
      ordersDelivery.downloadInvoice,
      id,
      undefined,
      'blob',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      // setInvoice(response);
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'order_' + customVal.refKey + '.pdf';
      downloadLink.click();
    }
    setIsDownloading(false);
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
  const handleOption = (event: any) => {
    if (event.value === 1) {
      setShowCancelModal(true);
    } else if (event.value == 2) {
      navigate('/orders/edit-order', { state: { _id: orderDetails?._id } });
    }
  };
  const cancelOrder = async (reason: string) => {
    const params: any = {
      message: reason,
    };
    const apiService = new APICallService(
      ordersDelivery.cancelOrder,
      params,
      {
        id: orderDetails._id,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success(ordersToast.orderCancelled);
      setShowCancelModal(false);
      await fetchOrderDetails(customVal._id);
    }
  };
  const getMenuOptions = (details: any) => {
    const isEditable =
      details?.status === 2 &&
      ((details?.routesUsers?.length &&
        details?.routesUsers[0]?.status === 1) ||
        (details?.selfPickedUpUsers?.length &&
          details?.selfPickedUpUsers[0]?.status === 1));
    if (!isEditable) {
      return menuOption.filter((item) => item.value !== 2);
    }
    return menuOption;
  };
  return (
    <>
      {showModal ? (
        <ReasonForReturnModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          isPartial={true}
          title="Reason of cancellation"
          background="bg-light-danger"
          reason={orderDetails?.message || ''}
        />
      ) : (
        <></>
      )}
      {showCancelModal ? (
        <CancelOrderModal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          customerName={orderDetails?.customer?.name || ''}
          orderRef={orderDetails?.refKey || ''}
          handleSubmit={cancelOrder}
        />
      ) : (
        <></>
      )}
      <Row className="g-8 mb-8">
        <Col md={12}>
          <Row className="align-items-center g-3">
            <Col
              xs
              className="d-flex align"
            >
              <h1 className="fs-22 fw-bolder mb-0">
                {' '}
                {OrdersDelivery.orderDetails}
              </h1>
              {orderDetails?.instantOrder ? (
                <span className="badge bg-fff4d9 fs-16 fw-600 text-dark p-3 px-4 ms-6">
                  Instant Order
                </span>
              ) : (
                <></>
              )}
              {orderDetails?.selfPickedUp ? (
                <span className="badge bg-fff4d9 fs-16 fw-600 text-dark p-3 px-4 ms-6">
                  Self Pickup Order
                </span>
              ) : (
                <></>
              )}
              {orderDetails?.scheduleOrder ? (
                <span className="badge bg-fff4d9 fs-16 fw-600 text-dark p-3 px-4 ms-6">
                  Schedule Order
                </span>
              ) : (
                <></>
              )}
            </Col>
            {!fetchLoading && (
              <Col
                xs="auto"
                className="d-flex"
              >
                <Button
                  variant="primary"
                  disabled={
                    isDownloading ||
                    (orderDetails?.routesUsers?.length === 0 &&
                      !orderDetails?.instantOrder &&
                      !orderDetails?.selfPickedUp) ||
                    orderDetails?.status === OrderCancelled
                  }
                  className="btn-lg me-3"
                  onClick={() => {
                    handleDownload(customVal._id);
                  }}
                >
                  {!isDownloading && (
                    <span className="indicator-label fs-16 fw-bold">
                      {OrdersDelivery.downloadInvoice}
                    </span>
                  )}
                  {isDownloading && (
                    <span
                      className="indicator-progress fs-16 fw-bold"
                      style={{ display: 'block' }}
                    >
                      {String.pleaseWait}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </Button>
                {orderDetails?.status === OrderProcessed &&
                orderDetails?.routeStatus !== PickedUp &&
                !orderDetails?.instantOrder &&
                Method.hasPermission(Order, Edit, currentUser) &&
                (!orderDetails?.modification ||
                  orderDetails?.modification?.status !== 1) ? (
                  <CustomSelectTable
                    marginLeft={'-80px'}
                    placeholder={
                      <img
                        className="me-3"
                        width={45}
                        height={45}
                        src={ThreeDotMenu}
                        alt=""
                      />
                    }
                    options={getMenuOptions(orderDetails)}
                    backgroundColor={'white'}
                    onChange={(event: any) => {
                      handleOption(event);
                    }}
                  />
                ) : (
                  <></>
                )}
              </Col>
            )}
          </Row>
        </Col>
        {!fetchLoading ? (
          <>
            {' '}
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
                        !orderDetails?.payment?.transactions?.length ||
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
                              {orderDetails.payment.paymentMode ===
                              OrderTigoPesa
                                ? orderDetails?.payment?.usedWalletCoin === 0
                                  ? 'Online'
                                  : 'Online with coin'
                                : ''}
                            </span>{' '}
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
                               orderDetails?.address?.houseNumber
                                 ? orderDetails?.address?.houseNumber + ', '
                                 : ''
                             }
                            ${
                              orderDetails?.address?.floorNumber
                                ? orderDetails?.address?.floorNumber + ', '
                                : ''
                            }
                            ${
                              orderDetails?.address?.buildingName
                                ? orderDetails?.address?.buildingName + ', '
                                : ''
                            }
                            ${
                              orderDetails?.address?.landmark
                                ? orderDetails?.address?.landmark + ', '
                                : ''
                            }
                            ${
                              orderDetails?.address?.addressLine1
                                ? orderDetails?.address?.addressLine1 + ' '
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
                        {orderDetails.routesUsers[0]?.deliveryUser?.name ||
                          'NA'}
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
                          <span
                            className="text-primary text-end fs-16 fw-700 text-decoration-underline me-3 cursor-pointer"
                            onClick={() => setShowModal(true)}
                          >
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
                                 orderDetails?.address?.houseNumber
                                   ? orderDetails?.address?.houseNumber + ', '
                                   : ''
                               }
                            ${
                              orderDetails?.address?.floorNumber
                                ? orderDetails?.address?.floorNumber + ', '
                                : ''
                            }
                            ${
                              orderDetails?.address?.buildingName
                                ? orderDetails?.address?.buildingName + ', '
                                : ''
                            }
                            ${
                              orderDetails?.address?.landmark
                                ? orderDetails?.address?.landmark + ', '
                                : ''
                            }
                            ${
                              orderDetails?.address?.addressLine1
                                ? orderDetails?.address?.addressLine1 + ' '
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
          </>
        ) : (
          <div className="border border-r10px mb-6">
            <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
              <Loader loading={fetchLoading} />
            </div>
          </div>
        )}
      </Row>
      {!fetchLoading && (
        <>
          {' '}
          <Col md={12}>
            <OrderDeliveryTimeline details={orderDetails} />
          </Col>
          <div className="p-3"></div>
          <Col md={12}>
            <Card className="border border-r10px">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gs-9 gy-6 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                        <th className="w-md-475px min-w-275px">
                          {OrdersDelivery.productName}
                        </th>
                        <th className="min-w-md-150px">
                          {OrdersDelivery.unitPrice}
                        </th>
                        <th className="w-md-125px">
                          {OrdersDelivery.qtyPrice}
                        </th>
                        <th className="min-w-md-100px text-end">
                          {OrdersDelivery.totalAmount}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.variants.map(
                        (product: any, index: number) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="symbol symbol-50px border">
                                  <span
                                    className="symbol-label bgi-contain"
                                    style={{
                                      backgroundImage: `url(${product.variant.media[0].url})`,
                                    }}
                                  ></span>
                                </div>
                                <div className="d-flex flex-column ms-5">
                                  <span className="text-dark fw-600 fs-15 d-block">
                                    {product?.variant?.title || ''}
                                  </span>
                                  <span className="text-dark fw-500 fs-15 d-block">
                                    {OrdersDelivery.sku}{' '}
                                    {product.variant.skuNumber}
                                  </span>
                                </div>
                              </div>
                            </td>{' '}
                            <td>
                              {product?.discount && product?.discount > 0 ? (
                                <>
                                  <span className="fs-15 fw-500 d-block text-decoration-line-through text-gray">
                                    {String.TSh}
                                    {''}{' '}
                                    {Method.formatCurrency(product.amount || 0)}
                                  </span>
                                  <span className="fs-15 fw-500 d-block">
                                    {String.TSh}
                                    {''}{' '}
                                    {Method.formatCurrency(
                                      product.amount - product.discount || 0
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="fs-15 fw-500 d-block">
                                  {String.TSh}
                                  {''}{' '}
                                  {Method.formatCurrency(product.amount || 0)}
                                </span>
                              )}
                            </td>
                            <td>
                              <span className="fs-15 fw-500">
                                {product.stockCount}{' '}
                                {`${
                                  product.stockCount <= 1
                                    ? String.singleUnit
                                    : String.unit
                                }`}
                              </span>
                            </td>
                            <td className="text-end">
                              {product?.discountByQuantitiesEnabled ? (
                                <span className="fs-15 fw-500 text-decoration-line-through text-gray d-block">
                                  {String.TSh}{' '}
                                  {Method.formatCurrency(
                                    product.amount * product.stockCount
                                  )}
                                </span>
                              ) : (
                                <></>
                              )}
                              <span className="fs-15 fw-500">
                                {String.TSh}
                                {''}{' '}
                                {Method.formatCurrency(
                                  product.totalAmount || 0
                                )}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                      {/* {details.payment.discounts.length ? ( */}
                      <tr>
                        <td
                          colSpan={3}
                          className="fs-16 fw-600 text-end"
                        >
                          {OrdersDelivery.subTotal}:
                        </td>
                        <td className="fs-16 fw-600 text-end">
                          {String.TSh}{' '}
                          {orderDetails?.payment?.subCharge
                            ? Method.formatCurrency(
                                orderDetails.payment.subCharge
                              )
                            : 0}
                        </td>
                      </tr>
                      {orderDetails?.appliedCampaign?.discountValue &&
                      orderDetails?.appliedCampaign?.discountValue > 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="fs-16 fw-600 text-end"
                          >
                            {'Total Discount'}:
                          </td>
                          <td className="fs-16 fw-600 text-end">
                            <span className="fs-20 fw-600">{'-'}</span>
                            {String.TSh}{' '}
                            {orderDetails?.appliedCampaign?.discountValue
                              ? Method.formatCurrency(
                                  orderDetails.appliedCampaign.discountValue
                                )
                              : 0}
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}
                      <tr>
                        <td
                          colSpan={3}
                          className="fs-16 fw-600 text-end"
                        >
                          {OrdersDelivery.platformFee}:
                        </td>
                        <td className="fs-16 fw-600 text-end">
                          {String.TSh}{' '}
                          {Method.formatCurrency(
                            orderDetails?.payment?.platformFee || 0
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={3}
                          className="fs-16 fw-bold text-end"
                        >
                          {OrdersDelivery.deliveryCharge}:
                        </td>
                        <td className="text-dark fs-16 fw-bold text-end">
                          {String.TSh}{' '}
                          {`${
                            orderDetails?.payment?.totalDistanceCharge
                              ? Method.formatCurrency(
                                  orderDetails?.payment.totalDistanceCharge
                                )
                              : 0
                          }`}
                        </td>
                      </tr>
                      {orderDetails?.payment?.usedWalletCoin &&
                      orderDetails?.payment?.usedWalletCoin > 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="fs-16 fw-600 text-end"
                          >
                            {'U-Mart Wallet'}:
                          </td>
                          <td className="fs-16 fw-600 text-end">
                            <span className="fs-20 fw-600">{'-'}</span>
                            {orderDetails?.payment?.usedWalletCoin
                              ? Method.formatCurrency(
                                  orderDetails.payment.usedWalletCoin
                                )
                              : 0}
                            {' Coins'}{' '}
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}
                      <tr>
                        <td
                          colSpan={3}
                          className="fs-22 fw-bold text-end"
                        >
                          {OrdersDelivery.grandTotal}:
                        </td>
                        <td className="text-dark fs-22 fw-bold text-end">
                          {String.TSh}{' '}
                          {Method.formatCurrency(
                            orderDetails?.payment?.netPayable || 0
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </>
      )}
    </>
  );
};
export default OrderDetails;
