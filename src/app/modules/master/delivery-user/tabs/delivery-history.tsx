import { Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliverString, String } from '../../../../../utils/string';
import APICallService from '../../../../../api/apiCallService';
import { deliveryUser } from '../../../../../api/apiEndPoints';
import {
  Master,
  OrderCash,
  OrderTigoPesa,
  DeliveryUser,
  PAGE_LIMIT,
  View,
  Order,
} from '../../../../../utils/constants';
import Loader from '../../../../../Global/loader';
import Method from '../../../../../utils/methods';
import Pagination from '../../../../../Global/pagination';
import { useAuth } from '../../../auth';
import { getKey, setKey } from '../../../../../Global/history';
import { listDeliveryUsers } from '../../../../../utils/storeString';
import { DeliveryUser as DeliverUserEnum } from '../../../../../utils/constants';
import PermissionModal from '../../../../modals/permission-moda';
const DeliveryHistory = (props: any) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deliveryHistory, setDeliveryHistory] = useState<any>([]);
  const [page, setPage] = useState(
    getKey(listDeliveryUsers.deliveriesPage) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    getKey(listDeliveryUsers.deliveriesLimit) || PAGE_LIMIT
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchDeliveryHistory(page, pageLimit, props.basicDetails._id);
      setLoading(false);
    })();
  }, []);
  const fetchDeliveryHistory = async (
    pageNo: number,
    limit: number,
    id: string
  ) => {
    setLoading(true);
    const params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'statusUpdatedAt',
      sortOrder: -1,
      'deliveryUserId[0]': id,
      needCount: true,
      listType: 4,
    };
    const apiService = new APICallService(
      deliveryUser.listDeliveryHistory,
      params,
      '',
      '',
      false,
      '',
      DeliverUserEnum
    );
    const response = await apiService.callAPI();
    if (response.total) {
      setTotalRecords(response.total);
    } else {
      setTotalRecords(0);
    }
    setDeliveryHistory(response.records);
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(+val);
    setKey(listDeliveryUsers.deliveriesPage, val);
    await fetchDeliveryHistory(val, pageLimit, props.basicDetails._id);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listDeliveryUsers.deliveriesPage, val + 1);
    await fetchDeliveryHistory(val + 1, pageLimit, props.basicDetails._id);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listDeliveryUsers.deliveriesPage, val - 1);
    await fetchDeliveryHistory(val - 1, pageLimit, props.basicDetails._id);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listDeliveryUsers.deliveriesPage, 1);
    setKey(listDeliveryUsers.deliveriesLimit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchDeliveryHistory(1, event.target.value, props.basicDetails._id);
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
      <Card className="border border-custom-color mb-7 ">
        <Card.Body className="pt-6">
          <div className="table-responsive">
            <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
              <thead>
                <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                  <th className="min-w-175px">{DeliverString.dateTime}</th>
                  <th className="min-w-125px min-w-lg-150px">
                    {DeliverString.orderId}
                  </th>
                  <th className="min-w-225px min-w-lg-175px">
                    {DeliverString.address}
                  </th>
                  <th className="min-w-125px min-w-lg-175px">
                    {DeliverString.amountCollected}
                  </th>
                  <th className="min-w-200px text-lg-end"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <td colSpan={5}>
                      <div className="w-100 d-flex justify-content-center">
                        <Loader loading={loading} />
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {deliveryHistory.length ? (
                      <>
                        {deliveryHistory.map(
                          (customVal: any, customIndex: number) => {
                            return (
                              <tr key={customVal._id}>
                                <td>
                                  <div className="d-flex align-items-center flex-row">
                                    <span className="fs-15 fw-600 ms-3">
                                      {customVal.statusUpdatedAt
                                        ? Method.convertDateToDDMMYYYYHHMMAMPM(
                                            customVal.statusUpdatedAt
                                          )
                                        : '-'}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="fs-15 fw-600 ms-3">
                                    #{customVal.refKey}
                                  </span>
                                </td>
                                <td>
                                  <span className="fs-15 fw-600">
                                    {customVal.address?.addressLine1 || 'NA'}{' '}
                                    {/* {customVal.address?.addressLine2 || ''} */}
                                  </span>
                                </td>
                                <td>
                                  {customVal.routesUsers.map(
                                    (collected: any, index: number) => (
                                      <div
                                        key={index}
                                        className="text-start "
                                      >
                                        <span className="fs-15 fw-600 ">
                                          {String.TSh +
                                            ' ' +
                                            Method.formatCurrency(
                                              collected.paymentCollection
                                                .totalCashCollection
                                            )}
                                        </span>
                                        <br />
                                        <span className="text-muted fw-semibold text-muted d-block fs-7">
                                          {customVal.payment?.transactions[0]
                                            ?.paymentMethod === OrderCash &&
                                            'COD'}
                                          {customVal.payment?.transactions[0]
                                            ?.paymentMethod === OrderTigoPesa &&
                                            'Online'}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </td>
                                <td>
                                  {Method.hasPermission(
                                    DeliverUserEnum,
                                    View,
                                    currentUser
                                  ) ? (
                                    <div className="d-flex justify-content-center flex-shrink-0">
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
                                            navigate('/orders/order-details', {
                                              state: customVal,
                                            });
                                          } else {
                                            setShowPermissionModal(true);
                                          }
                                        }}
                                      >
                                        {DeliverString.viewDetails}
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
                        <td colSpan={5}>
                          <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                            {'No data found'}
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
      {!loading && totalRecords ? (
        <Pagination
          totalRecords={totalRecords}
          currentPage={page}
          handleCurrentPage={handleCurrentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          handlePageLimit={handlePageLimit}
          pageLimit={pageLimit}
        />
      ) : (
        <></>
      )}
    </>
  );
};
export default DeliveryHistory;
