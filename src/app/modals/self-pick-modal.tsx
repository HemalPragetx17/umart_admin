import { Button, Card, Col, Modal, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
import APICallService from '../../api/apiCallService';
import { ordersDelivery } from '../../api/apiEndPoints';
import Loader from '../../Global/loader';
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
  View,
  Work,
} from '../../utils/constants';
import { OrdersDelivery, String } from '../../utils/string';
import Method from '../../utils/methods';
import { useAuth } from '../modules/auth';
import unChecked from '../../umart_admin/assets/media/svg_uMart/unchecked.svg';
import greenCheck from '../../umart_admin/assets/media/svg_uMart/green_checked.svg';
import { ordersToast } from '../../utils/toast';
import { success } from '../../Global/toast';
const SelfPickModal = (props: any) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>();
  const [isDisabled, setIsDisabled] = useState<any>([]);
  useEffect(() => {
    (async () => {
      await fetchGoodsLoadingDetails(props?.data?._id || '');
    })();
  }, []);
  const fetchGoodsLoadingDetails = async (id: any) => {
    setFetchLoading(true);
    const apiCallService = new APICallService(
      ordersDelivery.selfOrderGoodsDetails,
      id,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setOrderDetails(response);
      const temp = response?.selfPickedUpUsers[0]?.variants.map(
        (item: any) => false
      );
      setIsDisabled(temp);
    }
    setFetchLoading(false);
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
  const handleStatusChange = async (
    orderId: string,
    variantId: string,
    status: any,
    variantIndex: number
  ) => {
    const tempDisabled: any = [...isDisabled];
    tempDisabled[variantIndex] = true;
    setIsDisabled(tempDisabled);
    const temp = { ...orderDetails };
    temp.selfPickedUpUsers[0].variants[variantIndex].status = status;
    const params = {
      variant: variantId,
      status: status,
    };
    const apiService = new APICallService(
      ordersDelivery.selfOrderPackUnpack,
      params,
      {
        id: orderId,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      //  setOrdersDetails(temp);
      const tempDetails = { ...orderDetails };
      tempDetails.selfPickedUpUsers[0].variants[variantIndex].status = status;
      if (status === Packed) {
        success(ordersToast.packed);
      } else {
        success(ordersToast.unpacked);
      }
      setOrderDetails(tempDetails);
    }
    tempDisabled[variantIndex] = false;
    setIsDisabled(tempDisabled);
  };
  const checkIsPacked = (): boolean => {
    let isAllPacked: boolean = orderDetails.selfPickedUpUsers[0].variants.some(
      (item: any) => item.status === NotPacked
    );
    return isAllPacked;
  };
  const handleMarkAsDispatch = async (id: any) => {
    setLoading(true);
    const apiService = new APICallService(
      ordersDelivery.selfOrderMarkDispatch,
      {},
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success(ordersToast.dispatch);
      // setoutForDelivery(false);
      // await fetchRouterUserInfo(
      //   location.state.routePlan,
      //   location.state.routeUser.reference
      // );
      await fetchGoodsLoadingDetails(props?.data?._id || '');
    }
    setLoading(false);
  };
  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-dialog-centered"
      className="border-r10px"
      centered
      size="xl"
      {...(loading ? { backdrop: 'static' } : {})}
    >
      <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
        <img
          className="cursor-pointer position-absolute"
          style={{
            left : 10
          }}
          width={40}
          height={40}
          src={CrossSvg}
          alt="closebutton"
          onClick={() => {
            if (!loading) {
              props.onHide();
            }
          }}
        />
        <Modal.Title className="fs-26 fw-bolder mw-lg-425px pt-lg-3">
          Goods Loading Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
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
            <Col
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
                                    {orderDetails?.payment?.transactions
                                      ?.length > 0 ? (
                                      <>
                                        {' '}
                                        {orderDetails?.payment?.transactions[0]
                                          ?.paymentMethod === OrderCash &&
                                          'Cash on delivery'}
                                        {orderDetails.payment?.transactions[0]
                                          ?.paymentMethod === OrderTigoPesa &&
                                          'Online'}{' '}
                                      </>
                                    ) : (
                                      <>
                                        {orderDetails?.payment?.paymentMode ===
                                          OrderCash && 'Cash on delivery '}
                                        {orderDetails?.payment?.paymentMode ===
                                          OrderTigoPesa && 'Online'}{' '}
                                      </>
                                    )}
                                  </>
                                  {`${String.TSh} ${Method.formatCurrency(
                                    // orderDetails?.routeUser?.paymentCollection
                                    //   ?.payment?.totalCharge
                                    orderDetails?.payment?.remainingCharge ||
                                      orderDetails?.payment?.receivedCharge ||
                                      0
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
                                    #{orderDetails.refKey} /{' '}
                                    {orderDetails?.customer?.name || 'NA'}
                                  </h3>
                                </div>
                                <span className="fs-18 fw-600">
                                  {getAddressType(
                                    +orderDetails.address.addressType
                                  )}{' '}
                                  | {orderDetails.address.addressLine1} |{' '}
                                  {orderDetails.address.phoneCountry +
                                    ' ' +
                                    orderDetails.address.phone}
                                </span>
                                <div className="mt-1 text-italic">
                                  <div className="d-flex flex-row justify-content-around align-items-center text-gary fs-16 fw-500">
                                    <span className="text-gary mt-1 fs-16 fw-500 text-italic">
                                      {OrdersDelivery.palacedOn +
                                        ' ' +
                                        Method.convertDateToDDMMYYYYHHMMAMPM(
                                          orderDetails._createdAt
                                        )}
                                    </span>
                                    <span className="bullet bullet-dot bg-gray-400 ms-2 me-2 h-7px w-7px mx-2"></span>
                                    <span className="text-warning">
                                      {orderDetails.status ===
                                        RouteOrderOutForDelivery &&
                                        OrdersDelivery.tabDelivery +
                                          ' ' +
                                          Method.convertDateToDDMMYYYYHHMMAMPM(
                                            orderDetails.statusUpdatedAt
                                          )}
                                      {orderDetails.status <=
                                        RouteOrderDispatched &&
                                        OrdersDelivery.orderPreparing}
                                      {orderDetails.status ===
                                        RouteOrderDelivered &&
                                        OrdersDelivery.tabDelivered +
                                          ' on ' +
                                          Method.convertDateToDDMMYYYYHHMMAMPM(
                                            orderDetails.statusUpdatedAt
                                          )}
                                    </span>
                                  </div>
                                </div>
                                {orderDetails?.picker &&
                                orderDetails?.picker?.name ? (
                                  <div className="fs-16  fw-500 text-black">
                                    Picker:{` ${orderDetails?.picker?.name}`}
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                              {/* <div className="symbol-group symbol-hover flex-nowrap flex-grow-1"></div> */}
                              <div>
                                {orderDetails.selfPickedUpUsers[0].status >=
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
                                        ) && orderDetails.status == 2 ? (
                                          <Button
                                            variant="primary"
                                            className="btn-sm min-h-43px me-3"
                                            onClick={() => {
                                              // setCurrentOrder(orderDetails);
                                              // setDeliveredModal(true);
                                              props.openDeliverModal();
                                            }}
                                          >
                                            {'Mark as delivered'}
                                          </Button>
                                        ) : (
                                          <></>
                                        )}
                                        {/* <Button
                                          variant="primary"
                                          className="btn-sm min-h-43px"
                                          onClick={() => {
                                            // setCurrentOrder(orderDetails);
                                            // setOrderedProducts(true);
                                          }}
                                        >
                                          {OrdersDelivery.viewDetails}
                                        </Button> */}
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
                                        // setCurrentOrder(orderDetails);
                                        // setoutForDelivery(true);
                                        handleMarkAsDispatch(orderDetails._id);
                                      }}
                                      disabled={
                                        loading ||
                                        orderDetails.selfPickedUpUsers[0]
                                          .status >= RouteOrderDispatched ||
                                        checkIsPacked() ||
                                        !Method.hasPermission(
                                          Order,
                                          Edit,
                                          currentUser
                                        )
                                      }
                                    >
                                      {!loading && OrdersDelivery.markDispatch}
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
                          <th className="min-w-275px w-md-450px">
                            {OrdersDelivery.productName}
                          </th>
                          {/* <th className="min-w-150px">
                            {OrdersDelivery.goods} <br className="br" />{' '}
                            {OrdersDelivery.loadingArea}
                          </th> */}
                          <th className="min-w-200px">
                            {OrdersDelivery.quantityAndBatch + ' | zones/bins'}
                          </th>
                          <th className="min-w-150px">
                            {OrdersDelivery.status}
                          </th>
                          <th className="min-w-50px w-75px text-end"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.selfPickedUpUsers[0].variants.map(
                          (detailVal: any, variantIndex: number) => {
                            return (
                              <tr key={variantIndex}>
                                <td>
                                  <div className="d-flex align-items-center flex-row">
                                    <div className="symbol symbol-50px border">
                                      <img
                                        className="img-fluid border-r8px object-fit-contain"
                                        src={detailVal.variant.media[0].url}
                                        alt=""
                                      />
                                    </div>
                                    <span className="fs-18 fw-600 ms-3">
                                      {detailVal.variant.title}
                                      <br />
                                      <span className="fs-18 fw-500 d-block text-muted">
                                        SKU: {detailVal.variant.skuNumber}
                                      </span>
                                    </span>
                                  </div>
                                </td>
                                {/* <td>
                                  {detailVal.variant.goodsLoadingArea.length
                                    ? detailVal.variant.goodsLoadingArea.map(
                                        (item: any) => {
                                          return (
                                            <span
                                              key={item.reference}
                                              className="badge badge-warning text-dark fs-20 fw-bolder px-4 min-h-36px min-w-52px me-1 mb-2"
                                            >
                                              {item.name}
                                            </span>
                                          );
                                        }
                                      )
                                    : '-'}
                                </td> */}
                                <td>
                                  {detailVal?.batches &&
                                  detailVal?.batches?.length ? (
                                    <div className="fs-18 fw-600">
                                      {/* {detailVal.stockCount +
                                                        ' ' +
                                                        `${
                                                          detailVal.stockCount <=
                                                          1
                                                            ? String.singleUnit
                                                            : String.unit
                                                        }`}{' '}
                                                      |{' '} */}
                                      {/* {OrdersDelivery.batch +
                                                        ' ' +
                                                        detailVal.batches[0]
                                                          .batch}
                                                      {detailVal?.batches[0]
                                                        ?.expiry
                                                        ? ' - ' +
                                                          Method.convertDateToDDMMYYYY(
                                                            detailVal.batches[0]
                                                              .expiry
                                                          )
                                                        : ''} */}
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
                                                      batchItem?.stockCount <= 1
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
                                                  batchItem?.goodsLoadingArea
                                                    ?.length ? (
                                                    batchItem?.goodsLoadingArea?.map(
                                                      (goodItem: any) => {
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
                                                                {`${goodItem?.name} | Sq: ${goodItem?.sequence}`}
                                                              </span>
                                                              <span className="d-flex text-nowrap">
                                                                {goodItem?.bins &&
                                                                goodItem?.bins
                                                                  ?.length ? (
                                                                  goodItem?.bins?.map(
                                                                    (
                                                                      binItem: any,
                                                                      binIndex: number
                                                                    ) => {
                                                                      return (
                                                                        <span className="ms-2 fs-18">
                                                                          {`| ${binItem?.name} | Sq: ${binItem?.sequence}`}
                                                                        </span>
                                                                      );
                                                                    }
                                                                  )
                                                                ) : (
                                                                  <></>
                                                                )}
                                                              </span>
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                    )
                                                  ) : detailVal?.variant
                                                      ?.goodsLoadingArea &&
                                                    detailVal?.variant
                                                      ?.goodsLoadingArea
                                                      ?.length ? (
                                                    <>
                                                      {detailVal?.variant?.goodsLoadingArea?.map(
                                                        (goodItem: any) => {
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
                                                                  {`${goodItem?.name} | Sq: ${goodItem?.sequence}`}
                                                                </span>
                                                                <span className="d-flex text-nowrap">
                                                                  {goodItem?.bins &&
                                                                  goodItem?.bins
                                                                    ?.length ? (
                                                                    goodItem?.bins?.map(
                                                                      (
                                                                        binItem: any,
                                                                        binIndex: number
                                                                      ) => {
                                                                        return (
                                                                          <span className="ms-2 fs-18">
                                                                            {`| ${binItem?.name} | Sq: ${binItem?.sequence}`}
                                                                          </span>
                                                                        );
                                                                      }
                                                                    )
                                                                  ) : (
                                                                    <></>
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
                                  {detailVal.status === NotPacked ? (
                                    <>
                                      {' '}
                                      <span className="badge bg-efefef text-dark fs-18 fw-600 p-3">
                                        {OrdersDelivery.notPackLabel}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {detailVal.status === NotPacked && (
                                        <span className="badge bg-efefef text-dark fs-18 fw-600 p-3">
                                          {OrdersDelivery.notPackLabel}
                                        </span>
                                      )}
                                      {detailVal.status === Packed && (
                                        <span className="badge bg-e5f6de text-dark fs-18 fw-600 p-3">
                                          {OrdersDelivery.packedLabel}
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
                                        orderDetails.selfPickedUpUsers[0]
                                          .status >= RouteOrderDispatched ||
                                        !Method.hasPermission(
                                          Order,
                                          Edit,
                                          currentUser
                                        ) ||
                                        isDisabled[variantIndex]
                                      }
                                      onClick={() => {
                                        handleStatusChange(
                                          orderDetails._id,
                                          detailVal.variant._id,
                                          detailVal.status === NotPacked
                                            ? Packed
                                            : NotPacked,
                                          variantIndex
                                        );
                                      }}
                                    >
                                      {' '}
                                      <span className="d-flex justify-content-end align-items-center">
                                        {isDisabled[variantIndex] ? (
                                          <Spinner
                                            className="border-5"
                                            animation="border"
                                            variant="primary"
                                          />
                                        ) : (
                                          <span className="symbol symbol-circle symbol-50px me-3">
                                            <img
                                              src={
                                                detailVal.status === Packed
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
          )}
        </Row>
      </Modal.Body>
      {/* <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
        <Button
          variant="primary"
          size="lg"
          //   onClick={handleSubmit}
          disabled={loading}
        >
          {!loading && (
            <span className="indicator-label">
              {' '}
              Yes, mark as ready for dispatch
            </span>
          )}
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
      </Modal.Footer> */}
    </Modal>
  );
};
export default SelfPickModal;
