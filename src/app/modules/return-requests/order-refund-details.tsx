import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ReturnRequestString,
  OrdersDelivery,
  String,
  Customers,
} from '../../../utils/string';
import Loader from '../../../Global/loader';
// import { RequestPending } from '../../../utils/constants';
import { returnDetailsJson } from '../../../utils/dummyJSON';
import {
  Arrived,
  Collected,
  Inventory,
  Order,
  PartialRefund,
  ReturnRequestConst,
  View,
} from '../../../utils/constants';
import MarkAsArrivedModal from '../../modals/mark-as-arrived';
import Method from '../../../utils/methods';
import ReasonForReturnModal from '../../modals/reason-return-modal';
import APICallService from '../../../api/apiCallService';
import { returnRequestEndPoints } from '../../../api/apiEndPoints';
import RequestTimeline from './request-timeline';
import { useAuth } from '../auth';
import PermissionModal from '../../modals/permission-moda';
const OrderRefundDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location: any = useLocation();
  const tab: any = location.state?.tab;
  const id: any = location?.state?.id;
  const [fetchLoading, setFetchLoading] = useState(true);
  const [returnRequestsDetails, setReturnRequestDetails] =
    useState<any>(returnDetailsJson);
  const [showModal, setShowModal] = useState(false);
  const [refundReason, setRefundReason] = useState<string>('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!id) {
        return navigate('/all-return-requests', { replace: true });
      }
      await fetchRequestDetails();
      setFetchLoading(false);
    })();
  }, []);
  const fetchRequestDetails = async () => {
    setFetchLoading(true);
    const apiService = new APICallService(
      returnRequestEndPoints.returnRequestDetails,
      id,
      '',
      '',
      false,
      '',
      ReturnRequestConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setReturnRequestDetails(response.record);
    }
    setFetchLoading(false);
  };
  const getTotalAmountForVariant = (
    val: any,
    returnString: boolean = true
  ): any => {
    const discount = val?.discount || 0;
    const stock = val?.stockCount || 0;
    const total = (val?.totalAmount || 0) - discount * stock;
    if (returnString) {
      return Method.formatCurrency(total || 0);
    } else {
      return total;
    }
  };
  return (
    <>
      {showPermissionModal ? (
        <PermissionModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          moduleName="Orders & Delivery"
        />
      ) : (
        <></>
      )}
      {showModal && refundReason.length ? (
        <ReasonForReturnModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setRefundReason('');
          }}
          isPartial={true}
          title="Partial refund"
          background="bg-light-danger"
          reason={refundReason}
        />
      ) : (
        <></>
      )}
      <Row className="g-8 mb-8">
        <Col md={12}>
          <Row className="align-items-center g-3">
            <Col xs>
              <h1 className="fs-22 fw-bolder mb-0">
                {' '}
                {ReturnRequestString.orderRefundDetails}
              </h1>
            </Col>
          </Row>
        </Col>
        {!fetchLoading && returnRequestsDetails ? (
          <Col xs>
            <Card className="border">
              <Card.Header className="bg-light align-items-center">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <Card.Title className="d-flex justify-content-between w-100">
                    <div className="fs-22 fw-bolder">
                      {OrdersDelivery.basicDetails}
                    </div>
                    {Method.hasPermission(Order, View, currentUser) ? (
                      <div className="fs-16 text-primary fw-bold">
                        <Link
                          to="/orders/order-details"
                          state={{
                            _id: returnRequestsDetails.order,
                            refKey: returnRequestsDetails.orderRefKey,
                          }}
                        >
                          View order details
                        </Link>
                      </div>
                    ) : (
                      <div className="fs-16 text-primary fw-bold">
                        <Link
                          to="#"
                          onClick={() => setShowPermissionModal(true)}
                        >
                          View order details
                        </Link>
                      </div>
                    )}
                  </Card.Title>
                </div>
              </Card.Header>
              <Card.Body className="pb-3">
                <Row>
                  <Col md={6}>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.customerName}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.customer?.name || 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.totalItems}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.totalReturnedVariants || 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.requestId}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.refKey
                            ? '#' + returnRequestsDetails.refKey
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
                          {ReturnRequestString.orderDate}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.orderDate
                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                returnRequestsDetails.orderDate
                              )
                            : ''}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {/* {dateText[tab]}: */}
                          {ReturnRequestString.requestInitiateOn}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?._createdAt
                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                returnRequestsDetails._createdAt
                              )
                            : ''}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.assignDeliveryUser}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.deliveryUser?.name || 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.pickupAddress}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {/* {returnRequestsDetails?.address?.addressLine1 || 'NA'} */}
                          {returnRequestsDetails?.address
                            ? `
                            ${
                              returnRequestsDetails?.address?.floorNumber
                                ? returnRequestsDetails?.address?.floorNumber +
                                  ', '
                                : ''
                            }
                          ${
                            returnRequestsDetails?.address?.houseNumber
                              ? returnRequestsDetails?.address?.houseNumber +
                                ', '
                              : ''
                          }
                            ${
                              returnRequestsDetails?.address?.buildingName
                                ? returnRequestsDetails?.address?.buildingName +
                                  ', '
                                : ''
                            }
                            ${
                              returnRequestsDetails?.address?.landmark
                                ? returnRequestsDetails?.address?.landmark +
                                  ', '
                                : ''
                            }
                            ${
                              returnRequestsDetails?.address?.addressLine1
                                ? returnRequestsDetails?.address?.addressLine1 +
                                  ' '
                                : ''
                            }
                            `
                            : ''}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <div className="border border-r10px mb-6">
            <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
              <Loader loading={fetchLoading} />
            </div>
          </div>
        )}
        {!fetchLoading && returnRequestsDetails && (
          <>
            <Col md={12}>
              <RequestTimeline details={returnRequestsDetails} />
            </Col>
            <Col md={12}>
              <Card className="border border-r10px">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table table-rounded table-row-bordered align-middle gs-9 gy-6 mb-0">
                      <thead>
                        <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                          <th className="w-md-390px min-w-275px ">
                            {OrdersDelivery.productName}
                          </th>
                          <th className="min-w-md-100px">
                            {Customers.totalUnits}
                          </th>
                          <th className="min-w-md-100px">
                            {OrdersDelivery.unitPrice}
                          </th>
                          <th className="min-w-md-100px">
                            {ReturnRequestString.totalPrice}
                          </th>
                          <th className="min-w-md-100px">
                            {ReturnRequestString.refundedAmount}
                          </th>
                          <th className="min-w-md-100px text-center">
                            {ReturnRequestString.batchAndExpiry}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnRequestsDetails?.returnedVariants.map(
                          (product: any, index: number) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="symbol symbol-50px border">
                                    <span
                                      className="symbol-label bgi-contain"
                                      style={{
                                        backgroundImage: `url(${
                                          product?.variant?.media[0]?.url || ''
                                        })`,
                                      }}
                                    ></span>
                                  </div>
                                  <div className="d-flex flex-column ms-5">
                                    <span className="text-dark fw-600 fs-15 d-block">
                                      {product?.variant?.title || ''}
                                    </span>
                                    <span className="text-gray fw-500 fs-15 d-block">
                                      {OrdersDelivery.sku}
                                      {': '}
                                      {product?.variant?.skuNumber || ''}
                                    </span>
                                  </div>
                                </div>
                              </td>{' '}
                              <td>
                                <span className="fs-15 fw-500">
                                  {product?.returnedStockCount
                                    ? product.returnedStockCount < 10
                                      ? '0' + product.returnedStockCount
                                      : product.returnedStockCount
                                    : 0}{' '}
                                </span>
                              </td>
                              {/* <td>
                                <span className="fs-15 fw-500">
                                  {`TSh ${
                                    product?.amount
                                      ? Method.formatCurrency(product?.amount)
                                      : 0
                                  }`}
                                </span>
                              </td> */}
                              <td>
                                {product?.discount && product?.discount > 0 ? (
                                  <>
                                    <span className="fs-15 fw-500 d-block text-decoration-line-through text-gray">
                                      {String.TSh}
                                      {''}{' '}
                                      {Method.formatCurrency(
                                        product.amount || 0
                                      )}
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
                                  {`TSh ${getTotalAmountForVariant(product)}`}
                                </span>
                              </td>
                              <td>
                                <span className="fs-15 fw-500">
                                  {`TSh ${
                                    product?.refundAmount
                                      ? Method.formatCurrency(
                                          product?.refundAmount
                                        )
                                      : 0
                                  }`}
                                </span>
                                {product?.refundType === PartialRefund ? (
                                  <em
                                    className="d-block fs-15 fw-500 text-gray text-decoration-underline"
                                    onClick={() => {
                                      setShowModal(true);
                                      setRefundReason(product.message);
                                    }}
                                  >
                                    Partial refund
                                  </em>
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td className="text-center">
                                <span className="fs-15 fw-500">
                                  {product?.batches[0]?.batch
                                    ? `Batch ${product.batches[0].batch} `
                                    : ''}
                                  {product?.batches[0]?.expiry
                                    ? ` - ${Method.convertDateToDDMMYYYY(
                                        product.batches[0].expiry
                                      )} `
                                    : ' - No expiry'}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td
                            colSpan={5}
                            className="fs-20 fw-bold text-end"
                          >
                            {OrdersDelivery.grandTotal}:
                          </td>
                          <td className="text-dark fs-20 fw-bold text-end ">
                            {String.TSh}{' '}
                            {returnRequestsDetails?.returnedVariants.length
                              ? Method.formatCurrency(
                                  returnRequestsDetails.returnedVariants.reduce(
                                    (acc: any, variant: any) => {
                                      return acc + variant.refundAmount;
                                    },
                                    0
                                  )
                                )
                              : 0}
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
      </Row>
    </>
  );
};
export default OrderRefundDetails;
