import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrdersDelivery, String } from '../../../utils/string';
import { useEffect, useState } from 'react';
import APICallService from '../../../api/apiCallService';
import { routesPlanning } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import Loader from '../../../Global/loader';
import { useAuth } from '../auth';
import { Order, View } from '../../../utils/constants';
const DeliveryDetails = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location: any = useLocation();
  const customVal: any = location.state;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>();
  const [routeUsers, setRoutesUsers] = useState<any>([]);
  useEffect(() => {
    (async () => {
      if (!location.state) {
        return window.history.back();
      }
      setLoading(true);
      await fetchRouteInfo(location.state._id);
      setLoading(false);
    })();
  }, []);
  const fetchRouteInfo = async (id: string) => {
    setLoading(true);
    const apiService = new APICallService(routesPlanning.planInfo, id,'','',false,'',Order);
    const response = await apiService.callAPI();
    if (response) {
      setStats(response.record);
      setRoutesUsers(response.routeUser);
    }
    setLoading(false);
  };
  return (
    <>
      <Row>
        <Col
          xs={12}
          className="mb-6"
        >
          <h1 className="fs-22 fw-bolder">
            {OrdersDelivery.deliveriesOf}{' '}
            {/* {customVal && `${customVal.dateAndTime} orders`} */}
            {location?.state?.date
              ? `${Method.convertDateToDDMMYYYY(location?.state?.date)} orders`
              : ''}
          </h1>
        </Col>
        {loading ? (
          <div className="border border-r10px mb-6">
            <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
              <Loader loading={loading} />
            </div>
          </div>
        ) : (
          <>
            {stats && routeUsers && (
              <>
                <Col
                  xs={12}
                  className="mb-7"
                >
                  <Row className="g-6">
                    <Col
                      xl={3}
                      md={6}
                      sm={4}
                    >
                      <div className="border-r8px bg-d4e1fc rounded py-4 px-5">
                        <div className="d-flex align-items-center">
                          <div className="fs-24 fw-bolder">
                            {stats.totalDeliveryUser +
                              ' ' +
                              `${
                                (stats?.totalDeliveryUser || 0) <= 1
                                  ? OrdersDelivery.singleUser
                                  : OrdersDelivery.user
                              }`}
                          </div>
                        </div>
                        <div className="fw-500 fs-18">
                          {OrdersDelivery.cardTotalDelivery}
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
                          <div className="fs-24 fw-bolder">
                            {stats.totalOrders +
                              ' ' +
                              `${
                                (stats?.totalOrders || 0) <= 1
                                  ? OrdersDelivery.singleOrder
                                  : OrdersDelivery.order
                              }`}
                          </div>
                        </div>
                        <div className="fw-500 fs-18">
                          {OrdersDelivery.cardTotalAssigned}
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
                          <div className="fs-24 fw-bolder">
                            {' '}
                            {stats.totalProducts +
                              ' ' +
                              `${
                                (stats?.totalProducts || 0) <= 1
                                  ? OrdersDelivery.singleProduct
                                  : OrdersDelivery.product
                              }`}
                          </div>
                        </div>
                        <div className="fw-500 fs-18">
                          {OrdersDelivery.cardTotalProducts}
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
                          <div className="fs-24 fw-bolder">
                            {' '}
                            {String.TSh}{' '}
                            {Method.formatCurrency(
                              Number(stats.totalCashCollection)
                            )}
                          </div>
                        </div>
                        <div className="fw-500 fs-18">
                          {OrdersDelivery.cardTotalCash}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={12}>
                  <Card className="border">
                    <Card.Body className="pt-3">
                      <div className="table-responsive">
                        <table className="table table-rounded table-row-bordered align-middle gy-2 mb-0">
                          <thead>
                            <tr className=" fw-bold fs-18 fw-600 text-dark border-bottom h-60px align-middle">
                              <th className="min-w-250px">
                                {OrdersDelivery.deliveryUser}
                              </th>
                              <th className="min-w-175px">
                                {OrdersDelivery.assignedOrders}
                              </th>
                              <th className="min-w-175px">
                                {OrdersDelivery.status}
                              </th>
                              <th className="text-end"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <>
                                <td colSpan={4}>
                                  <div className="w-100 d-flex justify-content-center">
                                    {/* <Loader loading={fetchLoading || loading} /> */}
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                {routeUsers.length ? (
                                  <>
                                    {routeUsers.map(
                                      (detailVal: any, customIndex: number) => {
                                        return (
                                          <tr
                                            key={customIndex}
                                            className="h-80px"
                                          >
                                            <td>
                                              <div className="d-flex align-items-center flex-row">
                                                <div className="symbol symbol-50px border">
                                                  <img
                                                    className="img-fluid border-r8px object-fit-contain"
                                                    src={detailVal.image}
                                                    alt=""
                                                  />
                                                </div>
                                                <span className="fs-18 fw-600 ms-3">
                                                  {detailVal.name}
                                                  <br />
                                                  <span className="fw-600 d-block fs-18">
                                                    {detailVal?.vehicleNumber ||
                                                      'NA'}
                                                  </span>
                                                </span>
                                              </div>
                                            </td>
                                            <td>
                                              <span className="fs-18 fw-600">
                                                {detailVal.assignedOrder +
                                                  ' ' +
                                                  `${
                                                    (detailVal?.assignedOrder ||
                                                      0) <= 1
                                                      ? String.order
                                                      : String.orders
                                                  }`}
                                              </span>
                                            </td>
                                            <td>
                                              <div className="badge bg-efefef border-r4px p-3 fs-18 fw-600 text-dark ">
                                                {`${detailVal.totalPackedOrders}/${detailVal.assignedOrder}` +
                                                  ' ' +
                                                  OrdersDelivery.packed}
                                              </div>
                                            </td>
                                            <td>
                                              {Method.hasPermission(
                                                Order,
                                                View,
                                                currentUser
                                              ) ? (
                                                <div className="d-flex justify-content-center flex-shrink-0">
                                                  <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                      navigate(
                                                        '/orders/goods-loading-details',
                                                        {
                                                          state: {
                                                            routePlan:
                                                              stats._id,
                                                            routeUser:
                                                              detailVal,
                                                          },
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    {OrdersDelivery.viewDetails}
                                                  </button>
                                                </div>
                                              ) : (
                                                <></>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </>
                                ) : (
                                  <tr>
                                    <td colSpan={4}>
                                      <div className="w-100 fs-15 fw-bold d-flex justify-content-center mt-3">
                                        {'No Data Available'}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
          </>
        )}
      </Row>
    </>
  );
};
export default DeliveryDetails;
