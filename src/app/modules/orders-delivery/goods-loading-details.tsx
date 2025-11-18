import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { OrdersDelivery, String } from '../../../utils/string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Edit,
  Home,
  NotPacked,
  Order,
  OrderCash,
  OrderTigoPesa,
  Other,
  Packed,
  RouteOrderDelivered,
  RouteOrderDispatched,
  RouteOrderOutForDelivery,
  RouteVehicleOrderDelivered,
  View,
  Work,
} from '../../../utils/constants';
import greenCheck from '../../../umart_admin/assets/media/svg_uMart/green_checked.svg';
import unChecked from '../../../umart_admin/assets/media/svg_uMart/unchecked.svg';
import OutForDelivery from '../../modals/out-for-delivery';
import OrderedProductsList from '../../modals/ordered-products-list';
import APICallService from '../../../api/apiCallService';
import { routesPlanning } from '../../../api/apiEndPoints';
import Loader from '../../../Global/loader';
import Method from '../../../utils/methods';
import { success } from '../../../Global/toast';
import { ordersToast } from '../../../utils/toast';
import { constants } from 'buffer';
import { useAuth } from '../auth';
import DeliveredOrderModal from '../../modals/deliver-order-modal';
import RealOutForDeliveryModal from '../../modals/real-out-for-delivery-modal';
import PickedUpModal from '../../modals/pick-up-modal';
const GoodsLoadingDetails = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location: any = useLocation();
  const customVal: any = location.state;
  const [loading, setLoading] = useState(false);
  const [outForDelivery, setoutForDelivery] = useState(false);
  const [orderedProducts, setOrderedProducts] = useState(false);
  const [stats, setStats] = useState<any>();
  const [ordersDetails, setOrdersDetails] = useState<any>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<any>();
  const [routerUser, setRouterUser] = useState<any>();
  const [isDisabled, setIsDisabled] = useState<any>([]);
  const [deliveredModal, setDeliveredModal] = useState(false);
  const [pickUpModal, setPickUpModal] = useState(false);
  const [showRealOutForDelivery, setShowRealOutForDelivery] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!location.state) {
        return window.history.back();
      }
      await fetchRouterUserInfo(
        location.state.routePlan,
        location.state.routeUser.reference
      );
      setFetchLoading(false);
    })();
  }, []);
  const fetchRouterUserInfo = async (routeId: string, routeUserId: string) => {
    setFetchLoading(true);
    const apiService = new APICallService(
      routesPlanning.userInfo,
      {
        forLoading: true,
      },
      {
        route: routeId,
        routerUser: routeUserId,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      setStats(response.recordDetails);
      setOrdersDetails(response.ordersDetails);
      const tempDisabled: any = [];
      response.ordersDetails?.forEach((item: any, index: number) => {
        const temp: any = [];
        item.routeUser.variants.map((val: any, valIndex: number) => {
          temp.push(false);
        });
        tempDisabled.push(temp);
      });
      setIsDisabled(tempDisabled);
    }
    setFetchLoading(false);
  };
  const handleStatusChange = async (
    orderId: string,
    variantId: string,
    routeId: string,
    routerUserId: string,
    status: any,
    orderIndex: number,
    variantIndex: number
  ) => {
    const tempDisabled: any = [...isDisabled];
    tempDisabled[orderIndex][variantIndex] = true;
    setIsDisabled(tempDisabled);
    const temp = [...ordersDetails];
    temp[orderIndex].routeUser.variants[variantIndex].status = status;
    const params = {
      order: orderId,
      variant: variantId,
      status: status,
      quantityType: 1,
    };
    const id = `${routeId}/${routerUserId}`;
    const apiService = new APICallService(
      routesPlanning.updateStatus,
      params,
      {
        id: id,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      setOrdersDetails(temp);
      if (status === Packed) {
        success(ordersToast.packed);
      } else {
        success(ordersToast.unpacked);
      }
    }
    tempDisabled[orderIndex][variantIndex] = false;
    setIsDisabled(tempDisabled);
  };
  const handleMarkAsDispatch = async (id: string, orderId: string) => {
    const apiService = new APICallService(
      routesPlanning.updateDispatch,
      { order: orderId },
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success(ordersToast.dispatch);
      setoutForDelivery(false);
      await fetchRouterUserInfo(
        location.state.routePlan,
        location.state.routeUser.reference
      );
    }
  };
  const getAddressType = (value: any) => {
    if (value === Home) {
      return 'Home';
    } else if (value === Work) {
      return 'Work';
    } else if (value === Other) {
      return 'Other';
    }
    return 'Home';
  };
  const checkIsPacked = (index: number): boolean => {
    let isAllPacked: boolean = ordersDetails[index].routeUser.variants.some(
      (item: any) => item.status === NotPacked
    );
    return isAllPacked;
  };
  const handleDeliverOrder = async (id: string, orderId: string) => {
    const apiService = new APICallService(
      routesPlanning.deliverOrder,
      { order: orderId, status: 3, paymentMode: 1 },
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success('Done! Order delivered successfully!');
      setDeliveredModal(false);
      await fetchRouterUserInfo(
        location.state.routePlan,
        location.state.routeUser.reference
      );
    }
  };
  const handlePickupOrder = async (id: string, driverId: string) => {
    const apiService = new APICallService(
      routesPlanning.orderPickedUp,
      { driver: driverId },
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success('Done! Order picked up successfully!');
      setPickUpModal(false);
      await fetchRouterUserInfo(
        location.state.routePlan,
        location.state.routeUser.reference
      );
    }
  };
  const handleOutForDelivery = async (id: string, driverId: string) => {
    const apiService = new APICallService(
      routesPlanning.outForDelivery,
      { driver: driverId },
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success('Done! Order has been out for delivery successfully!');
      setShowRealOutForDelivery(false);
      await fetchRouterUserInfo(
        location.state.routePlan,
        location.state.routeUser.reference
      );
    }
  };
  return (
    <>
      {currentOrder && showRealOutForDelivery && (
        <RealOutForDeliveryModal
          show={showRealOutForDelivery}
          onHide={() => setShowRealOutForDelivery(false)}
          handleSubmit={handleOutForDelivery}
          loading={loading}
          route={currentOrder.routeUser.route}
          routeUser={currentOrder.routeUser.routeUser}
          driver={currentOrder?.routeUser?.deliveryUser?.reference}
          order={currentOrder._id}
        />
      )}
      {currentOrder && pickUpModal && (
        <PickedUpModal
          show={pickUpModal}
          onHide={() => setPickUpModal(false)}
          handleSubmit={handlePickupOrder}
          loading={loading}
          route={currentOrder.routeUser.route}
          routeUser={currentOrder.routeUser.routeUser}
          driver={currentOrder?.routeUser?.deliveryUser?.reference}
        />
      )}
      {currentOrder && outForDelivery && (
        <OutForDelivery
          show={outForDelivery}
          onHide={() => setoutForDelivery(false)}
          handleSubmit={handleMarkAsDispatch}
          loading={loading}
          route={currentOrder.routeUser.route}
          routeUser={currentOrder.routeUser.routeUser}
          order={currentOrder._id}
        />
      )}
      {currentOrder && deliveredModal && (
        <DeliveredOrderModal
          show={deliveredModal}
          onHide={() => setDeliveredModal(false)}
          handleSubmit={handleDeliverOrder}
          loading={loading}
          route={currentOrder.routeUser.route}
          routeUser={currentOrder.routeUser.routeUser}
          order={currentOrder._id}
        />
      )}
      {currentOrder && orderedProducts && (
        <OrderedProductsList
          show={orderedProducts}
          onHide={() => setOrderedProducts(false)}
          orderDetails={currentOrder}
        />
      )}
      <Row>
        <Col
          xs={12}
          className="mb-6"
        >
          <h1 className="fs-22 fw-bolder">
            {OrdersDelivery.goodsLoadingDetails}
          </h1>
        </Col>
        <>
          {fetchLoading ? (
            <Col
              xs={12}
              className="mb-6"
            >
              {' '}
              <div className="border border-r10px mb-6">
                <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                  <Loader loading={fetchLoading} />
                </div>
              </div>
            </Col>
          ) : (
            <>
              {stats ? (
                <>
                  {' '}
                  <Col
                    xs={12}
                    className="mb-9"
                  >
                    <Row className="g-6">
                      <Col
                        xl={3}
                        md={6}
                        sm={4}
                      >
                        <div className="border-r8px bg-d4e1fc rounded py-4 px-5">
                          <div className="d-flex align-items-center">
                            <div className="fs-22 fw-bolder">
                              {/* {details.record.postProcessData.utilizedVehiclesCount}{' '} */}
                              {customVal?.routeUser?.vehicleNumber || 'NA'}
                            </div>
                          </div>
                          <div className="fw-500 fs-16">
                            {OrdersDelivery.vehicleNumber}
                          </div>
                        </div>
                      </Col>
                      <Col
                        xl={3}
                        md={6}
                        sm={4}
                      >
                        <div className="border-r8px bg-ccebfd rounded py-4 px-5">
                          <div className="d-flex align-items-center">
                             <div className="fs-22 fw-bolder">
                              {location.state.routeUser.name}
                             </div>
                             </div>
                            <div className="fw-500 fs-16">
                            {OrdersDelivery.deliveryUserName}
                          </div>
                        </div>
                      </Col>
                      <Col
                        xl={3}
                        md={6}
                        sm={4}
                      >
                        <div className="border-r8px bg-ccf3f0 rounded py-4 px-5">
                          <div className="d-flex align-items-center">
                            <div className="fs-22 fw-bolder">
                              {' '}
                              {stats.totalOrders +
                                ' ' +
                                `${
                                  (stats?.totalOrders || 0) <= 1
                                    ? String.order
                                    : String.orders
                                }`}
                            </div>
                          </div>
                          <div className="fw-500 fs-16">
                            {OrdersDelivery.headingTotalOrders}
                          </div>
                        </div>
                      </Col>
                      <Col
                        xl={3}
                        md={6}
                        sm={4}
                      >
                        <div className="border-r8px bg-fbebbc rounded py-4 px-5">
                          <div className="d-flex align-items-center">
                            <div className="fs-22 fw-bolder">
                              {' '}
                              {String.TSh}{' '}
                              {Method.formatCurrency(
                                Number(stats.totalCashCollection)
                              )}
                            </div>
                          </div>
                          <div className="fw-500 fs-16">
                            {OrdersDelivery.cardTotalCash}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {ordersDetails.length ? (
                    <>
                      {ordersDetails.map(
                        (orderVal: any, orderIndex: number) => {
                          return (
                            <Col
                              key={orderVal._id}
                              xs={12}
                              className="mt-8 mb-8"
                            >
                              <Card className="border">
                                <Card.Header className="px-0 bg-light">
                                  <div className="tab-content w-100">
                                    <div
                                      className=" p-0 tab-pane fade show active"
                                      role="tabpanel"
                                      aria-labelledby="kt_activity_today_tab"
                                    >
                                      <div className="">
                                        <></>
                                        <div className="timeline-content mt-n10">
                                          <div className="overflow-auto ">
                                            <div className="d-flex bg-f9f9f9 border-r10px min-w-750px p-8 position-relative justify-content-between align-items-center">
                                              <div className="position-absolute timeline-short-alert p-1 px-3">
                                                <span className="fs-16 fw-600">
                                                  <>
                                                    {orderVal?.payment
                                                      ?.transactions?.length >
                                                    0 ? (
                                                      <>
                                                        {' '}
                                                        {orderVal?.payment
                                                          ?.transactions[0]
                                                          ?.paymentMethod ===
                                                          OrderCash &&
                                                          'Cash on delivery'}
                                                        {orderVal.payment
                                                          ?.transactions[0]
                                                          ?.paymentMethod ===
                                                          OrderTigoPesa &&
                                                          'Online'}{' '}
                                                      </>
                                                    ) : (
                                                      <>
                                                        {orderVal?.payment
                                                          ?.paymentMode ===
                                                          OrderCash &&
                                                          'Cash on delivery '}
                                                        {orderVal?.payment
                                                          ?.paymentMode ===
                                                          OrderTigoPesa &&
                                                          'Online'}{' '}
                                                      </>
                                                    )}
                                                  </>
                                                  {`${
                                                    String.TSh
                                                  } ${Method.formatCurrency(
                                                    orderVal?.routeUser
                                                      ?.paymentCollection
                                                      ?.payment?.totalCharge
                                                  )}`}
                                                </span>
                                              </div>
                                              <div
                                                className="d-flex align-items-start flex-column max-width-50 "
                                                style={{
                                                  width: '60%',
                                                }}
                                              >
                                                <div className="d-flex flex-row">
                                                  <h3 className="fs-20 fw-bolder mb-0">
                                                    #{orderVal.refKey} /{' '}
                                                    {orderVal.placedBy.user
                                                      .name || 'NA'}
                                                  </h3>
                                                </div>
                                                <span className="fs-18 fw-600">
                                                  {getAddressType(
                                                    +orderVal.address
                                                      .addressType
                                                  )}{' '}
                                                  |{' '}
                                                  {`
                            ${
                              orderVal?.address?.floorNumber
                                ? orderVal?.address?.floorNumber + ', '
                                : ''
                            }
                          ${
                            orderVal?.address?.houseNumber
                              ? orderVal?.address?.houseNumber + ', '
                              : ''
                          }
                            ${
                              orderVal?.address?.buildingName
                                ? orderVal?.address?.buildingName + ', '
                                : ''
                            }
                            ${
                              orderVal?.address?.landmark
                                ? orderVal?.address?.landmark + ', '
                                : ''
                            }
                            ${
                              orderVal?.address?.addressLine1
                                ? orderVal?.address?.addressLine1 + ' '
                                : ''
                            }
                            `}{' '}
                                                  |{' '}
                                                  {orderVal.address
                                                    .phoneCountry +
                                                    ' ' +
                                                    orderVal.address.phone}
                                                </span>
                                                <div className="mt-1 text-italic">
                                                  <div className="d-flex flex-row justify-content-around align-items-center text-gary fs-16 fw-500">
                                                    <span className="text-gary mt-1 fs-16 fw-500 text-italic">
                                                      {OrdersDelivery.palacedOn +
                                                        ' ' +
                                                        Method.convertDateToDDMMYYYYHHMMAMPM(
                                                          orderVal._createdAt
                                                        )}
                                                    </span>
                                                    <span className="bullet bullet-dot bg-gray-400 ms-2 me-2 h-7px w-7px mx-2"></span>
                                                    <span className="text-warning">
                                                      {orderVal.status ===
                                                        RouteOrderOutForDelivery &&
                                                        OrdersDelivery.tabDelivery +
                                                          ' ' +
                                                          Method.convertDateToDDMMYYYYHHMMAMPM(
                                                            orderVal.statusUpdatedAt
                                                          )}
                                                      {orderVal.status <=
                                                        RouteOrderDispatched &&
                                                        OrdersDelivery.orderPreparing}
                                                      {orderVal.status ===
                                                        RouteOrderDelivered &&
                                                        OrdersDelivery.tabDelivered +
                                                          ' on ' +
                                                          Method.convertDateToDDMMYYYYHHMMAMPM(
                                                            orderVal.statusUpdatedAt
                                                          )}
                                                    </span>
                                                  </div>
                                                </div>
                                                {orderVal?.picker &&
                                                orderVal?.picker?.name ? (
                                                  <div className="fs-16  fw-500 text-black">
                                                    Picker:{` ${orderVal?.picker?.name}`}
                                                  </div>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                              {/* <div className="symbol-group symbol-hover flex-nowrap flex-grow-1"></div> */}
                                              <div>
                                                {orderVal.routeUser.status >=
                                                RouteOrderDispatched ? (
                                                  <div className="d-flex align-items-end ">
                                                    {Method.hasPermission(
                                                      Order,
                                                      View,
                                                      currentUser
                                                    ) ? (
                                                      <>
                                                        {Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        ) &&
                                                        orderVal.status == 3 ? (
                                                          <Button
                                                            variant="primary"
                                                            className="btn-sm min-h-43px me-3"
                                                            onClick={() => {
                                                              setCurrentOrder(
                                                                orderVal
                                                              );
                                                              setDeliveredModal(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            {
                                                              'Mark as delivered'
                                                            }
                                                          </Button>
                                                        ) : (
                                                          <></>
                                                        )}
                                                        
                                                        {Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        ) &&
                                                        orderVal?.routeStatus ==
                                                          1 ? (
                                                          <Button
                                                            variant="primary"
                                                            className="btn-sm min-h-43px me-3"
                                                            onClick={() => {
                                                              setCurrentOrder(
                                                                orderVal
                                                              );
                                                              setPickUpModal(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            {
                                                              'Mark as picked up'
                                                            }
                                                          </Button>
                                                        ) : (
                                                          <></>
                                                        )}
                                                        {Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        ) &&
                                                        orderVal?.routeStatus ==
                                                          6 ? (
                                                          <Button
                                                            variant="primary"
                                                            className="btn-sm min-h-43px me-3"
                                                            onClick={() => {
                                                              setCurrentOrder(
                                                                orderVal
                                                              );
                                                              setShowRealOutForDelivery(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            {'Out for delivery'}
                                                          </Button>
                                                        ) : (
                                                          <></>
                                                        )}
                                                        <Button
                                                          variant="primary"
                                                          className="btn-sm min-h-43px"
                                                          onClick={() => {
                                                            setCurrentOrder(
                                                              orderVal
                                                            );
                                                            setOrderedProducts(
                                                              true
                                                            );
                                                          }}
                                                        >
                                                          {
                                                            OrdersDelivery.viewDetails
                                                          }
                                                        </Button>
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="d-flex align-items-end">
                                                    <Button
                                                      variant="primary"
                                                      className="btn-sm min-h-43px"
                                                      onClick={() => {
                                                        setCurrentOrder(
                                                          orderVal
                                                        );
                                                        setoutForDelivery(true);
                                                      }}
                                                      disabled={
                                                        orderVal.routeUser
                                                          .status >=
                                                          RouteOrderDispatched ||
                                                        checkIsPacked(
                                                          orderIndex
                                                        ) ||
                                                        !Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        )
                                                      }
                                                      // onClick={() => setOrderedProducts(true)}
                                                    >
                                                      {
                                                        OrdersDelivery.markDispatch
                                                      }
                                                    </Button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card.Header>
                                <Card.Body className="pt-0">
                                  <div className="table-responsive">
                                    <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                      <thead>
                                        <tr className="fw-bold fs-18 fw-600 text-dark border-bottom h-70px align-middle">
                                          <th className="min-w-275px w-md-400px">
                                            {OrdersDelivery.productName}
                                          </th>
                                          {/* <th className="min-w-150px">
                                            {OrdersDelivery.goods}{' '}
                                            <br className="br" />{' '}
                                            {OrdersDelivery.loadingArea}
                                          </th> */}
                                          <th className="min-w-200px">
                                            {OrdersDelivery.quantityAndBatch +
                                              ' | zones/bins'}
                                          </th>
                                          <th className="min-w-150px">
                                            {OrdersDelivery.status}
                                          </th>
                                          <th className="min-w-50px w-75px text-end"></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {orderVal.routeUser.variants.map(
                                          (
                                            detailVal: any,
                                            variantIndex: number
                                          ) => {
                                            return (
                                              <tr key={variantIndex}>
                                                <td className="">
                                                  <div className="d-flex align-items-center flex-row">
                                                    <div className="symbol symbol-50px border">
                                                      <img
                                                        className="img-fluid border-r8px object-fit-contain"
                                                        src={
                                                          detailVal.variant
                                                            .media[0].url
                                                        }
                                                        alt=""
                                                      />
                                                    </div>
                                                    <span className="fs-18 fw-600 ms-3">
                                                      {detailVal.variant.title}
                                                      <br />
                                                      <span className="fs-18 fw-500 d-block text-muted">
                                                        SKU:{' '}
                                                        {
                                                          detailVal.variant
                                                            .skuNumber
                                                        }
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                      
                                                <td>
                                                  {detailVal?.batches &&
                                                  detailVal?.batches?.length ? (
                                                    <div className="fs-18 fw-600">
                                                   
                                                      {detailVal?.batches?.map(
                                                        (
                                                          batchItem: any,
                                                          batchIndex: number
                                                        ) => {
                                                          return (
                                                            <>
                                                              <Row className="mb-2">
                                                                <Col
                                                                  xs={12}
                                                                  className="mb-2"
                                                                >
                                                                  {batchItem?.stockCount +
                                                                    ' ' +
                                                                    `${
                                                                      batchItem?.stockCount <=
                                                                      1
                                                                        ? String.singleUnit
                                                                        : String.unit
                                                                    }`}{' '}
                                                                  |{' '}
                                                                  {OrdersDelivery.batch +
                                                                    ' ' +
                                                                    batchItem?.batch}
                                                                  {batchItem?.expiry
                                                                    ? ' - ' +
                                                                      Method.convertDateToDDMMYYYY(
                                                                        batchItem?.expiry
                                                                      )
                                                                    : ''}
                                                                </Col>
                                                                <Col
                                                                  xs={12}
                                                                  className=""
                                                                >
                                                                  {batchItem?.goodsLoadingArea &&
                                                                  batchItem
                                                                    ?.goodsLoadingArea
                                                                    ?.length ? (
                                                                    batchItem?.goodsLoadingArea?.map(
                                                                      (
                                                                        goodItem: any
                                                                      ) => {
                                                                        return (
                                                                          <div className="mb-2">
                                                                            <span
                                                                              key={
                                                                                goodItem?.reference
                                                                              }
                                                                              className="badge badge-warning text-dark fs-18 fw-600 px-4 min-h-36px min-w-52px me-1 mb-2"
                                                                            >
                                                                              <span>
                                                                                {' '}
                                                                                {`${goodItem?.name} - Sq: ${goodItem?.sequence}`}
                                                                              </span>
                                                                              <span className="d-flex text-nowrap">
                                                                                {goodItem?.bins &&
                                                                                goodItem
                                                                                  ?.bins
                                                                                  ?.length ? (
                                                                                  goodItem?.bins?.map(
                                                                                    (
                                                                                      binItem: any,
                                                                                      binIndex: number
                                                                                    ) => {
                                                                                      return (
                                                                                        <span className="ms-2 fs-18">
                                                                                          {`| ${binItem?.name} - Sq: ${binItem?.sequence}`}
                                                                                        </span>
                                                                                      );
                                                                                    }
                                                                                  )
                                                                                ) : (
                                                                                  <>

                                                                                  </>
                                                                                )}
                                                                              </span>
                                                                            </span>
                                                                          </div>
                                                                        );
                                                                      }
                                                                    )
                                                                  ) : detailVal
                                                                      ?.variant
                                                                      ?.goodsLoadingArea &&
                                                                    detailVal
                                                                      ?.variant
                                                                      ?.goodsLoadingArea
                                                                      ?.length ? (
                                                                    <>
                                                                      {detailVal?.variant?.goodsLoadingArea?.map(
                                                                        (
                                                                          goodItem: any
                                                                        ) => {
                                                                          return (
                                                                            <div className="mb-2">
                                                                              <span
                                                                                key={
                                                                                  goodItem?.reference
                                                                                }
                                                                                className="badge badge-warning text-dark fs-18 fw-600 px-4 min-h-36px min-w-52px me-1 mb-2"
                                                                              >
                                                                                <span>
                                                                                  {' '}
                                                                                  {`${goodItem?.name} - Sq: ${goodItem?.sequence}`}
                                                                                </span>
                                                                                <span className="d-flex text-nowrap">
                                                                                  {goodItem?.bins &&
                                                                                  goodItem
                                                                                    ?.bins
                                                                                    ?.length ? (
                                                                                    goodItem?.bins?.map(
                                                                                      (
                                                                                        binItem: any,
                                                                                        binIndex: number
                                                                                      ) => {
                                                                                        return (
                                                                                          <span className="ms-2 fs-18">
                                                                                            {`| ${binItem?.name} - Sq: ${binItem?.sequence}`}
                                                                                          </span>
                                                                                        );
                                                                                      }
                                                                                    )
                                                                                  ) : (
                                                                                    <>

                                                                                    </>
                                                                                  )}
                                                                                </span>
                                                                              </span>
                                                                            </div>
                                                                          );
                                                                        }
                                                                      )}
                                                                    </>
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                </Col>
                                                              </Row>
                                                              {/* {batchIndex <
                                                              detailVal?.batches
                                                                ?.length -
                                                                1 ? (
                                                                <div className="separator mb-5"></div>
                                                              ) : (
                                                                <></>
                                                              )} */}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <span>-</span>
                                                  )}
                                                </td>
                                                <td>
                                                  {detailVal.status ===
                                                  NotPacked ? (
                                                    <>
                                                      {' '}
                                                      <span className="badge bg-efefef text-dark fs-18 fw-600 p-3">
                                                        {
                                                          OrdersDelivery.notPackLabel
                                                        }
                                                      </span>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {detailVal.status ===
                                                        NotPacked && (
                                                        <span className="badge bg-efefef text-dark fs-18 fw-600 p-3">
                                                          {
                                                            OrdersDelivery.notPackLabel
                                                          }
                                                        </span>
                                                      )}
                                                      {detailVal.status ===
                                                        Packed && (
                                                        <span className="badge bg-e5f6de text-dark fs-18 fw-600 p-3">
                                                          {
                                                            OrdersDelivery.packedLabel
                                                          }
                                                        </span>
                                                      )}
                                                    </>
                                                  )}
                                                </td>
                                                <td>
                                                  {
                                                    <Button
                                                      variant=""
                                                      className="btn btn-flush btn-icon"
                                                      disabled={
                                                        orderVal.routeUser
                                                          .status >=
                                                          RouteOrderDispatched ||
                                                        !Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        ) ||
                                                        isDisabled[orderIndex][
                                                          variantIndex
                                                        ]
                                                      }
                                                      onClick={() => {
                                                        handleStatusChange(
                                                          orderVal._id,
                                                          detailVal.variant._id,
                                                          orderVal.routeUser
                                                            .route,
                                                          orderVal.routeUser
                                                            .routeUser,
                                                          detailVal.status ===
                                                            NotPacked
                                                            ? Packed
                                                            : NotPacked,
                                                          orderIndex,
                                                          variantIndex
                                                        );
                                                      }}
                                                    >
                                                      {' '}
                                                      <span className="d-flex justify-content-end align-items-center">
                                                        {isDisabled[orderIndex][
                                                          variantIndex
                                                        ] ? (
                                                          <Spinner
                                                            className="border-5"
                                                            animation="border"
                                                            variant="primary"
                                                          />
                                                        ) : (
                                                          <span className="symbol symbol-circle symbol-50px me-3">
                                                            <img
                                                              src={
                                                                detailVal.status ===
                                                                Packed
                                                                  ? greenCheck
                                                                  : unChecked
                                                              }
                                                              alt=""
                                                            />{' '}
                                                          </span>
                                                        )}
                                                      </span>
                                                    </Button>
                                                  }
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        }
                      )}
                    </>
                  ) : (
                    <div className="border border-r10px mb-6">
                      <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                        <span className="fs-18 fw-500">
                          No orders available
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </>
      </Row>
    </>
  );
};
export default GoodsLoadingDetails;
