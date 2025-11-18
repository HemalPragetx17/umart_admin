import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SalesReportChart from './sales-report-chart';
import { useEffect, useState } from 'react';
import { Customers, String } from '../../../../utils/string';
import Loader from '../../../../Global/loader';
import APICallService from '../../../../api/apiCallService';
import { buyer } from '../../../../api/apiEndPoints';
import Method from '../../../../utils/methods';
import {
  Customer,
  Order,
  OrderCancelled,
  OrderCash,
  OrderCoin,
  OrderTigoPesa,
  View,
} from '../../../../utils/constants';
import { useAuth } from '../../auth';
import { customerDetails } from '../../../../utils/storeString';
import { setKey } from '../../../../Global/history';
import PermissionModal from '../../../modals/permission-moda';
const TabCustomerDashboard = (props: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordersLoader, setOrdersLoader] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [orders, setOrders] = useState<any>();
  const { currentUser } = useAuth();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      await fetchRecentOrder(props.profileData?.user._id || '');
    })();
  }, []);
  const fetchRecentOrder = async (id: string) => {
    setOrdersLoader(true);
    const params = {
      sortKey: '_createdAt',
      sortOrder: -1,
      listType: 6,
      customerId: id,
      limit: 5,
    };
    const apiService = new APICallService(
      buyer.buyerOrderList,
      params,
      '',
      '',
      false,
      '',
      Customer
    );
    const response = await apiService.callAPI();
    if (response) {
      setRecentOrders(response.orders);
    }
    setOrdersLoader(false);
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
      <SalesReportChart id={props.profileData?.user._id} />
      <Card className="border border-r10px mb-7">
        {
          <>
            {' '}
            <Card.Header className="min-h-77px bg-f9f9f9">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fs-22 fw-bolder">
                  {Customers.recentOrder}
                </span>
              </h3>
              {!ordersLoader ? (
                <>
                  {' '}
                  <div className="card-toolbar">
                    {Method.hasPermission(Order, View, currentUser) ? (
                      <div
                        className="btn-md fs-16 fw-700 cursor-pointer text-primary"
                        onClick={() => {
                          props.handleSelectTab(
                            { value: '3' },
                            props.profileData
                          );
                        }}
                      >
                        {Customers.viewAll}
                      </div>
                    ) : (
                      <Link
                        to="#"
                        className="btn-md fs-16 fw-700"
                        onClick={() => setShowPermissionModal(true)}
                      >
                        {Customers.viewAll}
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </Card.Header>
            {ordersLoader ? (
              <div className="d-flex justify-content-center py-4">
                <Loader loading={ordersLoader} />
              </div>
            ) : (
              <Card.Body className="pt-6">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                        <th className="min-w-215px">{Customers.orderDate}</th>
                        <th className="min-w-150px">{Customers.totalUnits}</th>
                        <th className="min-w-175px">{Customers.totalValue}</th>
                        <th className="min-w-150px">{Customers.modePayment}</th>
                        <th className="min-w-190px text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <>
                          <td colSpan={4}>
                            <div className="w-100 d-flex justify-content-center">
                              <Loader loading={loading} />
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {recentOrders.length ? (
                            <>
                              {recentOrders.map(
                                (customVal: any, customIndex: number) => {
                                  return (
                                    <tr key={customVal._id}>
                                      <td>
                                        <div className="d-flex align-items-center flex-row">
                                          <span className="fs-15 fw-600 ms-3">
                                            {Method.convertDateToDDMMYYYY(
                                              customVal._createdAt
                                            )}
                                            <br />
                                            <span className="text-muted fw-semibold text-muted d-block fs-7">
                                              #{customVal.refKey}
                                            </span>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-600 ms-3">
                                          {customVal.orderedQuantities +
                                            ' ' +
                                            `${
                                              customVal.orderedQuantities <= 1
                                                ? String.singleUnit
                                                : String.unit
                                            }`}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-600">
                                          {String.TSh +
                                            ' ' +
                                            Method.formatCurrency(
                                              customVal.payment.totalCharge
                                            )}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="badge badge-light custom-badge">
                                          {customVal.routesUsers.length > 0 ? (
                                            <>
                                              {customVal.payment?.transactions
                                                .length > 0 ? (
                                                <>
                                                  {' '}
                                                  {customVal.payment
                                                    ?.transactions[0]
                                                    ?.paymentMethod ===
                                                  OrderCash
                                                    ? customVal.routesUsers[0]
                                                        .paymentCollection
                                                        .payment
                                                        .usedWalletCoin === 0
                                                      ? 'Cash'
                                                      : 'Cash with coin'
                                                    : ''}
                                                  {customVal.payment
                                                    ?.transactions[0]
                                                    ?.paymentMethod ===
                                                  OrderTigoPesa
                                                    ? customVal.routesUsers[0]
                                                        .paymentCollection
                                                        .payment
                                                        .usedWalletCoin === 0
                                                      ? ' Online'
                                                      : 'Online with coin'
                                                    : ''}
                                                </>
                                              ) : (
                                                <>
                                                  {customVal.routesUsers
                                                    .length &&
                                                  customVal.routesUsers[0]
                                                    .paymentCollection.payment
                                                    .paymentMode === OrderCash
                                                    ? customVal.routesUsers[0]
                                                        .paymentCollection
                                                        .payment
                                                        .usedWalletCoin === 0
                                                      ? 'Cash'
                                                      : 'Cash with coin'
                                                    : ''}
                                                  {customVal.routesUsers
                                                    .length &&
                                                  customVal.routesUsers[0]
                                                    .paymentCollection.payment
                                                    .paymentMode ===
                                                    OrderTigoPesa
                                                    ? customVal.routesUsers[0]
                                                        .paymentCollection
                                                        .payment
                                                        .usedWalletCoin === 0
                                                      ? ' Online'
                                                      : 'Online with coin'
                                                    : ''}{' '}
                                                  {customVal.routesUsers
                                                    .length &&
                                                    customVal.routesUsers[0]
                                                      .paymentCollection.payment
                                                      .paymentMode ===
                                                      OrderCoin &&
                                                    'Coin'}
                                                </>
                                              )}
                                            </>
                                          ) : customVal.status ===
                                              OrderCancelled ||
                                            customVal?.instantOrder ||
                                            customVal?.selfPickedUp ||
                                            customVal?.scheduleOrder ||
                                            customVal?.orderOnNotWorkingHours ? (
                                            customVal?.payment?.paymentMode ===
                                            OrderCash ? (
                                              customVal?.payment
                                                ?.usedWalletCoin === 0 ? (
                                                'Cash'
                                              ) : (
                                                'Cash with coin'
                                              )
                                            ) : customVal?.payment
                                                ?.usedWalletCoin === 0 ? (
                                              'Online'
                                            ) : (
                                              'Online with coin'
                                            )
                                          ) : (
                                            'Failed'
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center flex-shrink-0">
                                          {/* {Method.hasPermission(
                                            Customer,
                                            View,
                                            currentUser
                                          ) ? ( */}
                                          <button
                                            className="btn btn-primary"
                                            style={{ whiteSpace: 'nowrap' }}
                                            onClick={() => {
                                              if (
                                                Method.hasPermission(
                                                  Order,
                                                  View,
                                                  currentUser
                                                )
                                              ) {
                                                setKey(
                                                  customerDetails.detailsTab,
                                                  '1'
                                                );
                                                navigate(
                                                  '/orders/order-details',
                                                  {
                                                    state: customVal,
                                                  }
                                                );
                                              } else {
                                                setShowPermissionModal(true);
                                              }
                                            }}
                                            // disabled={
                                            //   !Method.hasPermission(
                                            //     Order,
                                            //     View,
                                            //     currentUser
                                            //   )
                                            // }
                                          >
                                            {Customers.viewDetails}
                                          </button>
                                          {/* ) : (
                                            <></>
                                          )} */}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={4}>
                                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                  {Customers.noData}
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
            )}
          </>
        }
      </Card>
    </>
  );
};
export default TabCustomerDashboard;
