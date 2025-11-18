import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Customers, OrdersDelivery } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { buyer } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import {
  CoinsAddedOnOrderCancellation,
  CoinsAddedOnReturn,
  CoinsAddedThroughReward,
  CoinsDeductedOnPlaceOrder,
  Customer,
  Order,
  PAGE_LIMIT,
  View,
} from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import Pagination from '../../../../Global/pagination';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import {
  customerDetails,
  customerProfileWalletTab,
} from '../../../../utils/storeString';
import { useAuth } from '../../auth';
import PermissionModal from '../../../modals/permission-moda';
const coinsTransferThrough: any = {
  [CoinsDeductedOnPlaceOrder]: 'New order',
  [CoinsAddedOnReturn]: 'Return',
  [CoinsAddedOnOrderCancellation]: 'Cancellation',
  [CoinsAddedThroughReward]: 'Reward',
};
const TabWalletHistory = (props: any) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(getKey(customerProfileWalletTab.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(customerProfileWalletTab.limit) || PAGE_LIMIT
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(customerProfileWalletTab.dateFilter)?.startDate
      ? new Date(getKey(customerProfileWalletTab.dateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(customerProfileWalletTab.dateFilter)?.endDate
      ? new Date(getKey(customerProfileWalletTab.dateFilter)?.endDate)
      : null
  );
  const [walletHistory, setWalletHistory] = useState<any>([]);
      const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      await fetchWalletHistory(
        props.profileData.user._id,
        page,
        pageLimit,
        startDate,
        endDate
      );
    })();
  }, []);
  const fetchWalletHistory = async (
    id: string,
    page: number,
    limit: number,
    startDate?: any,
    endDate?: any
  ) => {
    setLoading(true);
    const params: any = {
      pageNo: page,
      limit: limit,
      needCount: true,
      sortKey: '_createdAt',
      sortOrder: -1,
      customerId: id,
      needBalance: true,
    };
    if (startDate) {
      params.fromDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
    }
    if (endDate) {
      params.toDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    }
    const apiService = new APICallService(
      buyer.walletHistoryList,
      params,
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
      setWalletHistory(response.records);
    }
    setLoading(false);
  };
  const handleChange = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setLoading(true);
    setPage(1);
    setKey(customerProfileWalletTab.page, 1);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      await fetchWalletHistory(
        props.profileData.user._id,
        page,
        pageLimit,
        startDateFormatted,
        endDateFormatted
      );
      setKey(customerProfileWalletTab.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      await fetchWalletHistory(
        props.profileData.user._id,
        page,
        pageLimit,
        startDateFormatted,
        endDateFormatted
      );
      removeKey(customerProfileWalletTab.dateFilter);
    }
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setLoading(true);
    setPage(val);
    setKey(customerProfileWalletTab.page, val);
    await fetchWalletHistory(
      props.profileData.user._id,
      val,
      pageLimit,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const handleNextPage = async (val: number) => {
    setLoading(true);
    setPage(val + 1);
    setKey(customerProfileWalletTab.page, val + 1);
    await fetchWalletHistory(
      props.profileData.user._id,
      val + 1,
      pageLimit,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const handlePreviousPage = async (val: number) => {
    setLoading(true);
    setPage(val - 1);
    setKey(customerProfileWalletTab.page, val - 1);
    await fetchWalletHistory(
      props.profileData.user._id,
      val - 1,
      pageLimit,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const handlePageLimit = async (event: any) => {
    setLoading(true);
    setPage(1);
    await setPageLimit(parseInt(event.target.value));
    setKey(customerProfileWalletTab.page, 1);
    setKey(customerProfileWalletTab.limit, parseInt(event.target.value));
    await fetchWalletHistory(
      props.profileData.user._id,
      1,
      parseInt(event.target.value),
      startDate,
      endDate
    );
    setLoading(false);
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
      <Row className="align-items-center  mb-5">
        <Col
          xl={4}
          md={4}
          sm={12}
          className="mb-xl-0 mb-5 "
        >
          <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
            {Customers.walletHistory}
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
                    Filter by dates
                  </label>
                </Col>
                <Col xs>
                  <div className="min-w-lg-300px mw-lg-300px">
                    <DatePicker
                      className="form-control bg-white min-h-60px fs-16 fw-bold text-dark min-w-md-288px min-w-225px custom-placeholder"
                      selected={startDate}
                      onChange={handleChange}
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      showFullMonthYearPicker
                      // maxDate={new Date()}
                      placeholderText="Select dates"
                      isClearable={true}
                      showYearDropdown={true}
                      scrollableYearDropdown={true}
                      dropdownMode="select"
                      customInput={<CustomDateInput />}
                      // dayClassName={(date: Date) => {
                      //   return Method.dayDifference(
                      //     new Date().toDateString(),
                      //     date.toDateString()
                      //   ) > 0
                      //     ? 'date-disabled'
                      //     : '';
                      // }}
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
                  <th className="min-w-150px">{Customers.dateAndTime}</th>
                  <th className="min-w-150px">{OrdersDelivery.orderId}</th>
                  <th className="min-w-125px">{Customers.numberOfCoin}</th>
                  <th className="min-w-125px text-end">
                    {Customers.transactionThrough}
                  </th>
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
                    {walletHistory.length ? (
                      <>
                        {walletHistory.map(
                          (customVal: any, customIndex: number) => {
                            return (
                              <tr key={customVal._id}>
                                <td>
                                  <div className="d-flex align-items-center flex-row">
                                    <span className="fs-15 fw-600 ms-3">
                                      {customVal?._createdAt
                                        ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                            customVal._createdAt
                                          )
                                        : ''}
                                      <br />
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className="fw-600 d-block fs-15 text-decoration-underline cursor-pointer"
                                    onClick={() => {
                                      if (
                                        !Method.hasPermission(
                                          Order,
                                          View,
                                          currentUser
                                        )
                                      ) {
                                        setShowPermissionModal(true);
                                        return;
                                      }
                                      setKey(customerDetails.detailsTab, '5');
                                      navigate('/orders/order-details', {
                                        state: {
                                          _id: customVal.order,
                                          refKey: customVal.refKey,
                                        },
                                      });
                                    }}
                                  >
                                    #{customVal.refKey}
                                  </span>
                                </td>
                                <td>
                                  <span className="fs-15 fw-600">
                                    {(!!customVal?.source?.type &&
                                      (customVal.source.type ===
                                        CoinsAddedOnOrderCancellation ||
                                        customVal.source.type ===
                                          CoinsAddedOnReturn)) ||
                                    customVal.source.type ===
                                      CoinsAddedThroughReward ? (
                                      <span className="text-primary">
                                        +
                                        {Method.formatCurrency(
                                          customVal.amount
                                        ) || ''}
                                        {customVal?.amount
                                          ? customVal.amount > 1
                                            ? ' Coins'
                                            : ' Coin'
                                          : ''}
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        -
                                        {Method.formatCurrency(
                                          customVal?.amount
                                        ) || ''}
                                        {customVal?.amount
                                          ? customVal.amount > 1
                                            ? ' Coins'
                                            : ' Coin'
                                          : ''}
                                      </span>
                                    )}
                                  </span>
                                </td>
                                <td className="text-end">
                                  <span className="badge badge-light custom-badge">
                                    {!!customVal?.source?.type &&
                                      coinsTransferThrough[
                                        customVal.source.type
                                      ]}
                                  </span>
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
          {walletHistory.length ? (
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
export default TabWalletHistory;
