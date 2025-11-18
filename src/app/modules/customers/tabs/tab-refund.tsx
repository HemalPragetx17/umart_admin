import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { useEffect, useState } from 'react';
import {
  Customers,
  OrdersDelivery,
  ReturnRequestString,
  String,
} from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { buyer } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import {
  Customer,
  PAGE_LIMIT,
  ReturnRequestConst,
  View,
} from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import Pagination from '../../../../Global/pagination';
import { useAuth } from '../../auth';
import clsx from 'clsx';
import { customerJSON } from '../../../../api/apiJSON/customer';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import { CustomSelect } from '../../../custom/Select/CustomSelect';
import {
  customerDetails,
  customerProfileRefundTab,
} from '../../../../utils/storeString';
import { getKey, setKey } from '../../../../Global/history';
import PermissionModal from '../../../modals/permission-moda';
const TabRefundOrders = (props: any) => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(getKey(customerProfileRefundTab.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(customerProfileRefundTab.limit) || PAGE_LIMIT
  );
  const [refundOrders, setRefundOrders] = useState<any>([]);
  const [status, setStatus] = useState<any>([]);
  const { currentUser } = useAuth();
  const orderFilerOptions = [
    {
      // value: AllProduct,
      name: 'All Orders ',
      value: 5,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">{`All orders`} </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Not refunded',
      value: 1,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">Not refunded </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Refunded',
      value: 4,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">Refunded</span>
        </>
      ),
    },
  ];
  const [options, setOptions] = useState<any>(orderFilerOptions);
  const [selectedOrderType, setSelectedOrderType] = useState(
    getKey(customerProfileRefundTab.ordersFilter) || 5
  );
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      let tempStatus: any = [];
      if (selectedOrderType == 5) {
        tempStatus = [];
      } else if (selectedOrderType == 4) {
        tempStatus.push(4);
        setStatus(tempStatus);
      } else if (selectedOrderType == 1) {
        tempStatus = [1, 2, 3];
        setStatus(tempStatus);
      }
      await fetchRefundedOrder(
        props.profileData.user._id,
        page,
        pageLimit,
        tempStatus
      );
    })();
  }, []);
  const fetchRefundedOrder = async (
    id: string,
    page: number,
    limit: number,
    status?: any
  ) => {
    setLoading(true);
    const params: any = {
      pageNo: page,
      limit: limit,
      needCount: true,
      sortKey: '_createdAt',
      sortOrder: -1,
      customerId: id,
      status: status && status.length ? status : [],
    };
    const apiService = new APICallService(
      buyer.orderRefundsList,
      customerJSON.listRefundOrders(params),
      '',
      '',
      false,
      '',
      Customer
    );
    const response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setRefundOrders(response.records);
    }
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setLoading(true);
    setPage(val);
    setKey(customerProfileRefundTab.page, val);
    await fetchRefundedOrder(
      props.profileData.user._id,
      val,
      pageLimit,
      status
    );
    setLoading(false);
  };
  const handleNextPage = async (val: number) => {
    setLoading(true);
    setPage(val + 1);
    setKey(customerProfileRefundTab.page, val + 1);
    await fetchRefundedOrder(
      props.profileData.user._id,
      val + 1,
      pageLimit,
      status
    );
    setLoading(false);
  };
  const handlePreviousPage = async (val: number) => {
    setLoading(true);
    setPage(val - 1);
    setKey(customerProfileRefundTab.page, val - 1);
    await fetchRefundedOrder(
      props.profileData.user._id,
      val - 1,
      pageLimit,
      status
    );
    setLoading(false);
  };
  const handlePageLimit = async (event: any) => {
    setLoading(true);
    setPage(1);
    setPageLimit(parseInt(event.target.value));
    setKey(customerProfileRefundTab.page, 1);
    setKey(customerProfileRefundTab.limit, parseInt(event.target.value));
    await fetchRefundedOrder(
      props.profileData.user._id,
      1,
      parseInt(event.target.value),
      status
    );
    setLoading(false);
  };
  const handleOrderTypeChange = async (event: any) => {
    setPage(1);
    setKey(customerProfileRefundTab.page, 1);
    let tempStatus: any = [];
    if (event.value === 5) {
      setStatus(tempStatus);
    } else if (event.value === 4) {
      tempStatus.push(4);
      setStatus(tempStatus);
    } else if (event.value === 1) {
      tempStatus = [1, 2, 3];
      setStatus(tempStatus);
    }
    // setStatus(event.value);
    await fetchRefundedOrder(
      props.profileData.user._id,
      1,
      pageLimit,
      tempStatus
    );
    setSelectedOrderType(event.value);
    setKey(customerProfileRefundTab.ordersFilter, event.value);
  };
  const handleNavigate = (val: any) => {
    if (!Method.hasPermission(ReturnRequestConst, View, currentUser)) {
      setShowPermissionModal(true);
      return;
    }
    setKey(customerDetails.detailsTab, '4');
    if (val.status === 4) {
      navigate('/all-return-requests/order-refund-details', {
        state: {
          tab: val.status,
          id: val._id,
        },
      });
    } else {
      navigate('/all-return-requests/return-request-details', {
        state: {
          tab: val.status,
          id: val._id,
        },
      });
    }
  };
  return (
    <>
      {showPermissionModal ? (
        <PermissionModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          moduleName="Return Requests"
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center  mb-5">
        <Col
          xl={4}
          md={4}
          sm={12}
          className="mb-xl-0 mb-5 "
        >
          <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
            {Customers.orderRefunds}
          </h1>
        </Col>
        <Col
          xl={8}
          md={8}
          sm={12}
          className=""
        >
          <Row className="align-items-center justify-content-md-end">
            <Col
              md="auto"
              className="mb-md-0 mb-5"
            >
              <Row className="align-items-center">
                <Col xs="auto">
                  <label
                    htmlFor=""
                    className="fs-16 fw-500"
                  >
                    Filter orders
                  </label>
                </Col>
                <Col xs>
                  <div className="min-w-lg-250px mw-lg-300px">
                    <CustomSelectTable2
                      backgroundColor="#f9f9f9"
                      default={orderFilerOptions[0]}
                      isDisabled={loading}
                      options={orderFilerOptions}
                      onChange={(event: any) => {
                        handleOrderTypeChange(event);
                      }}
                      value={
                        orderFilerOptions.find(
                          (item) => item.value == selectedOrderType
                        ) || null
                      }
                      isSearchable={false}
                      isMulti={false}
                      minHieight="50px"
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Card className="border border-custom-color mb-7">
        <Card.Body className="pt-6">
          <div className="table-responsive">
            <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
              <thead>
                <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                  <th className="min-w-190px">{Customers.orderDate}</th>
                  <th className="min-w-190px ">
                    {Customers.returnRequestedOn}
                  </th>
                  <th className="min-w-115px ">{Customers.totalOrderVal}</th>
                  <th className="min-w-90px">
                    {ReturnRequestString.returnRequestedFor}
                  </th>
                  <th className="min-w-200px">{OrdersDelivery.status}</th>
                  <th className="text-end"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <td colSpan={6}>
                      <div className="w-100 d-flex justify-content-center">
                        <Loader loading={fetchLoading || loading} />
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {refundOrders.length ? (
                      <>
                        {refundOrders.map(
                          (customVal: any, customIndex: number) => {
                            return (
                              <tr key={customVal._id}>
                                <td>
                                  <div className="d-flex align-items-center flex-row">
                                    <span className="fs-15 fw-600 ms-3">
                                      {customVal.orderDate
                                        ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                            customVal.orderDate
                                          )
                                        : 'NA'}
                                      <br />
                                      <span className="text-muted fw-semibold text-muted d-block fs-15">
                                        #{customVal?.orderRefKey || ''}
                                      </span>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="fs-15 fw-600 ms-3">
                                    {customVal._createdAt
                                      ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                          customVal._createdAt
                                        )
                                      : 'NA'}
                                  </span>
                                </td>
                                <td>
                                  <span className="fs-15 fw-600">
                                    {String.TSh +
                                      ' ' +
                                      Method.formatCurrency(
                                        customVal?.totalCharge || 0
                                      )}
                                  </span>
                                </td>
                                <td>
                                  <span className="fs-15 fw-600">
                                    {customVal?.totalReturnedVariants || 0}
                                    {customVal?.totalReturnedVariants &&
                                    customVal.totalReturnedVariants > 1
                                      ? ' items'
                                      : ' item'}
                                  </span>
                                </td>
                                <td className="fs-14 fw-600">
                                  <span
                                    className={clsx(
                                      'px-3 py-2 rounded',
                                      customVal?.status === 4
                                        ? 'bg-light-success'
                                        : 'bg-fff4d9'
                                    )}
                                  >
                                    {customVal?.status === 4
                                      ? customVal?.statusUpdatedAt
                                        ? 'Refunded on ' +
                                          Method.convertDateToDDMMYYYY(
                                            customVal.statusUpdatedAt
                                          )
                                        : 'NA'
                                      : 'Not refunded'}
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
                                        handleNavigate(customVal);
                                      }}
                                      // disabled={
                                      //   !Method.hasPermission(
                                      //     ReturnRequestConst,
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
      </Card>
      {!loading ? (
        <>
          {refundOrders.length ? (
            <Pagination
              totalRecords={totalRecords}
              currentPage={page}
              handleCurrentPage={(event: any) => {
                handleCurrentPage(event);
              }}
              handleNextPage={(event: any) => {
                handleNextPage(event);
              }}
              handlePreviousPage={(event: any) => {
                handlePreviousPage(event);
              }}
              pageLimit={pageLimit}
              handlePageLimit={(event: any) => {
                handlePageLimit(event);
              }}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default TabRefundOrders;
