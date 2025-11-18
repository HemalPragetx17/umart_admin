import { Button, Card, Col, FormLabel, Nav, Row, Tab } from 'react-bootstrap';
import { ReturnRequestString, OrdersDelivery } from '../../../utils/string';
import ReactDatePicker from 'react-datepicker';
import { KTSVG } from '../../../umart_admin/helpers';
import { useEffect, useState } from 'react';
import {
  PAGE_LIMIT,
  NewRequest,
  Collected,
  Arrived,
  Refunded,
  Inventory,
  ReturnRequestConst,
  View,
} from '../../../utils/constants';
import { ReturnRequestsJson } from '../../../utils/dummyJSON';
import Method from '../../../utils/methods';
import Pagination from '../../../Global/pagination';
import Loader from '../../../Global/loader';
import { useNavigate } from 'react-router-dom';
import ReasonForReturnModal from '../../modals/reason-return-modal';
import APICallService from '../../../api/apiCallService';
import { reports, returnRequestEndPoints } from '../../../api/apiEndPoints';
import { useDebounce } from '../../../utils/useDebounce';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import AllCustomerReport from '../../modals/reports/all-customers-reports';
import AllCustomerReportsModal from '../../modals/reports/all-customers-reports';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { listReturnRequest } from '../../../utils/storeString';
import { useAuth } from '../auth';
const AllReturnRequests = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [tabKey, setTabKey] = useState<any>(
    getKey(listReturnRequest.tab) || '1'
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(getKey(listReturnRequest.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listReturnRequest.limit) || PAGE_LIMIT
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(listReturnRequest.dateFilter)?.startDate
      ? new Date(getKey(listReturnRequest.dateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(listReturnRequest.dateFilter)?.endDate
      ? new Date(getKey(listReturnRequest.dateFilter)?.endDate)
      : null
  );
  const [search, setSearch] = useState<string>(
    getKey(listReturnRequest.search) || ''
  );
  const [returnRequestData, setReturnRequestData] = useState<any>([]);
  const [reason, setReason] = useState<string | undefined>('');
  const [showModal, setShowModal] = useState(false);
  const [media, setMedia] = useState<any>([]);
  const [currentItem, setCurrentItem] = useState<any>();
  const tableHeaderText: string[] = [
    '',
    ReturnRequestString.returnIniatedOn,
    ReturnRequestString.collectedOn,
    ReturnRequestString.arrivedAt,
    ReturnRequestString.refundProcessOn,
  ];
  const [showReportModal, setShowReportModal] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      if (!Method.hasModulePermission(ReturnRequestConst, currentUser)) {
        return window.history.back();
      }
      await fetchReturnRequestList(
        page,
        pageLimit,
        tabKey,
        search,
        startDate,
        endDate
      );
      setFetchLoader(false);
      setTimeout(() => {
        const pos = getKey(listReturnRequest.scrollPosition);
        window.scrollTo(0, pos);
      }, 600);
    })();
  }, []);
  const fetchReturnRequestList = async (
    pageNo: number,
    limit: number,
    status: any,
    searchTerm?: string,
    fromDate?: string,
    toDate?: string
  ) => {
    setLoading(true);
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'statusUpdatedAt',
      sortOrder: -1,
      'status[]': status,
      needCount: true,
      searchTerm: searchTerm ? searchTerm.trim() : '',
      fromDate: fromDate
        ? Method.convertDateToFormat(fromDate, 'YYYY-MM-DD')
        : '',
      toDate: toDate ? Method.convertDateToFormat(toDate, 'YYYY-MM-DD') : '',
    };
    let apiService = new APICallService(
      returnRequestEndPoints.getRequstList,
      params,
      '',
      '',
      false,
      '',
      ReturnRequestConst
    );
    const response: any = await apiService.callAPI();
    if (response) {
      if (response.records) {
        if (response.total) {
          setTotalRecords(response.total);
        } else {
          setTotalRecords(0);
        }
        setReturnRequestData(response.records);
      }
    }
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setFetchLoader(true);
    setPage(val);
    setKey(listReturnRequest.page, val);
    await fetchReturnRequestList(
      val,
      pageLimit,
      tabKey,
      search,
      startDate,
      endDate
    );
    setFetchLoader(false);
  };
  const handleNextPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val + 1);
    setKey(listReturnRequest.page, val + 1);
    await fetchReturnRequestList(
      val + 1,
      pageLimit,
      tabKey,
      search,
      startDate,
      endDate
    );
    setFetchLoader(false);
  };
  const handlePreviousPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val - 1);
    setKey(listReturnRequest.page, val - 1);
    await fetchReturnRequestList(
      val - 1,
      pageLimit,
      tabKey,
      search,
      startDate,
      endDate
    );
    setFetchLoader(false);
  };
  const handlePageLimit = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setKey(listReturnRequest.page, 1);
    setKey(listReturnRequest.limit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchReturnRequestList(
      1,
      event.target.value,
      tabKey,
      search,
      startDate,
      endDate
    );
    setFetchLoader(false);
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setPage(1);
    setKey(listReturnRequest.page, 1);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      await fetchReturnRequestList(
        1,
        pageLimit,
        tabKey,
        search,
        event[0],
        event[1]
      );
      setKey(listReturnRequest.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
      //api call
    } else if (event[0] === null && event[1] === null) {
      // apicall
      fetchReturnRequestList(1, pageLimit, tabKey, search);
      removeKey(listReturnRequest.dateFilter);
    }
    // setFetchLoader(false);
  };
  const debounce = useDebounce(fetchReturnRequestList, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    // const regex = /^(\S+( \S+)*)? ?$/;
    const regex = /^(\w+( \w+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearch(input);
    setPage(1);
    setKey(listReturnRequest.page, 1);
    if (input.trim().length > 2 && search !== input) {
      await debounce(1, pageLimit, tabKey, input, startDate, endDate);
    } else if (input.trim().length <= 2 && input.length < search.length) {
      await debounce(1, pageLimit, tabKey, input, startDate, endDate);
    }
    setKey(listReturnRequest.search, input);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleViewReason = (item: any) => {
    setShowModal(true);
    setReason(item.message);
    let tempMedia: any = [];
    item?.returnedVariants?.map((val: any) => {
      tempMedia = [...tempMedia, ...val.capturedMedia];
    });
    setMedia(tempMedia);
    setCurrentItem(item);
  };
  return (
    <>
      {showReportModal ? (
        <AllCustomerReportsModal
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
          url={reports.refundsReport}
          forRefund={true}
        />
      ) : (
        <></>
      )}
      {showModal && reason ? (
        <ReasonForReturnModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setReason(undefined);
            setCurrentItem(undefined);
          }}
          isPartial={false}
          title="Reason for return"
          background="bg-light"
          reason={reason}
          images={media}
          item={currentItem}
        />
      ) : (
        <></>
      )}
      {ReturnRequestsJson.length > 0 ? (
        <Row className="align-items-center g-md-5 g-3 mb-7">
          <Col xs>
            <h1 className="fs-22 fw-bolder">
              {ReturnRequestString.returnRequests}
            </h1>
          </Col>
          {!fetchLoader && (
            <Col xs="auto">
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => setShowReportModal(true)}
              >
                <span className="indicator-label fs-16 fw-bold">
                  {'Download report'}
                </span>
              </Button>
            </Col>
          )}
          <Col xs={12}>
            <Card className="bg-light border mb-7">
              <Card.Body className="px-7">
                <Row className="align-items-center g-5">
                  <Col
                    md={5}
                    lg={5}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark">
                      {'Search by order Id'}
                    </FormLabel>
                    <div className="d-flex align-items-center position-relative me-lg-4">
                      <KTSVG
                        path="/media/icons/duotune/general/gen021.svg"
                        className="svg-icon-3 position-absolute ms-3"
                      />
                      <input
                        type="text"
                        id="kt_filter_search"
                        className="form-control form-control-white min-h-60px form-control-lg ps-10"
                        placeholder="Search by order ID"
                        value={search}
                        onChange={(event: any) => {
                          // handleSearchTerm(event.target.value.trimStart());
                          handleSearch(event.target.value.trimStart());
                        }}
                        // onKeyUp={handleOnKeyUp}
                      />
                    </div>
                  </Col>
                  <Col
                    md={2}
                    sm={12}
                  ></Col>
                  <Col
                    md={5}
                    lg={5}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark">
                      {OrdersDelivery.filterDate}
                    </FormLabel>
                    <ReactDatePicker
                      className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-xl-300px min-w-250px min-w-lg-200px min-w-md-325px min-w-xs-288px "
                      // selected={startDate}
                      onChange={handleDateFilter}
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      showFullMonthYearPicker
                      placeholderText="Select dates"
                      isClearable={true}
                      showYearDropdown={true}
                      scrollableYearDropdown={true}
                      dropdownMode="select"
                      customInput={<CustomDateInput />}
                      // disabled={fetchLoader}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12}>
            <div className="custom-tabContainer">
              <Tab.Container
                activeKey={tabKey}
                onSelect={async (k) => {
                  setTabKey(k);
                  setKey(listReturnRequest.tab, k);
                  // setStartDate(null);
                  // setEndDate(null);
                  setTotalRecords(0);
                  setFetchLoader(true);
                  // setSearch('');
                  setPage(1);
                  setKey(listReturnRequest.page, 1);
                  // removeKey(listReturnRequest.dateFilter);
                  // removeKey(listReturnRequest.search);
                  switch (k) {
                    case '1':
                      await fetchReturnRequestList(
                        1,
                        pageLimit,
                        1,
                        search,
                        startDate,
                        endDate
                      );
                      break;
                    case '2':
                      await fetchReturnRequestList(
                        1,
                        pageLimit,
                        2,
                        search,
                        startDate,
                        endDate
                      );
                      break;
                    case '3':
                      await fetchReturnRequestList(
                        1,
                        pageLimit,
                        3,
                        search,
                        startDate,
                        endDate
                      );
                      break;
                    case '4':
                      await fetchReturnRequestList(
                        1,
                        pageLimit,
                        4,
                        search,
                        startDate,
                        endDate
                      );
                      break;
                    default:
                      break;
                  }
                  setFetchLoader(false);
                }}
              >
                <Row className="align-items-center variant-categories">
                  <Col
                    lg={'auto'}
                    className="mb-4"
                  >
                    <div className="bg-light border border-r8px p-3 px-md-6">
                      <Nav variant="pills">
                        <Nav.Item>
                          <Nav.Link
                            eventKey={1}
                            disabled={fetchLoader}
                            onClick={() => {
                              setTabKey(1);
                              setKey(listReturnRequest.tab, 1);
                            }}
                          >
                            {ReturnRequestString.newRequest}
                            {tabKey == '1'
                              ? totalRecords > 0
                                ? '(' + totalRecords + ')'
                                : ''
                              : ''}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey={2}
                            disabled={fetchLoader}
                            onClick={() => {
                              setTabKey(2);
                              setKey(listReturnRequest.tab, 2);
                            }}
                          >
                            {ReturnRequestString.collected}
                            {tabKey == '2'
                              ? totalRecords > 0
                                ? '(' + totalRecords + ')'
                                : ''
                              : ''}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey={3}
                            disabled={fetchLoader}
                            onClick={() => {
                              setTabKey(3);
                              setKey(listReturnRequest.tab, 3);
                            }}
                          >
                            {ReturnRequestString.arrivedAtWarehouse}
                            {tabKey == '3'
                              ? totalRecords > 0
                                ? '(' + totalRecords + ')'
                                : ''
                              : ''}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey={4}
                            disabled={fetchLoader}
                            onClick={() => {
                              setTabKey(4);
                              setKey(listReturnRequest.tab, 4);
                            }}
                          >
                            {ReturnRequestString.refunded}
                            {tabKey == '4'
                              ? totalRecords > 0
                                ? '(' + totalRecords + ')'
                                : ''
                              : ''}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Col>
          <Col xs={12}>
            <Tab.Content>
              <Tab.Pane
                eventKey={1}
                active={tabKey == 1}
              >
                {tabKey == 1 && !loading ? (
                  returnRequestData && returnRequestData.length ? (
                    <>
                      <Card className="border border-r10px">
                        <Card.Body className="p-0">
                          <div className="table-responsive">
                            <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                              <thead>
                                <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                  <th className="min-w-100px px-10">
                                    {ReturnRequestString.orderAndId}
                                  </th>
                                  <th className="min-w-125px text-start">
                                    {tableHeaderText[tabKey]}
                                  </th>
                                  <th className="min-w-150px text-  start">
                                    {ReturnRequestString.assignDeliveryUser}
                                  </th>
                                  <th className="min-w-90px text-start">
                                    {ReturnRequestString.returnRequestedFor}
                                  </th>
                                  <th className="min-w-25px text-end"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {returnRequestData.map(
                                  (val: any, goodIndex: number) => (
                                    <tr key={val._id}>
                                      <td>
                                        <div>
                                          <div className="fs-15 fw-600">
                                            {' '}
                                            {val?.orderDate
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.orderDate
                                                )
                                              : ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val?.orderRefKey
                                              ? '#' + val?.orderRefKey
                                              : ''}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-start">
                                          <span className="fs-15 fw-600">
                                            {val?.statusUpdatedAt
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.statusUpdatedAt
                                                )
                                              : ''}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-inline-flex align-items-center">
                                          <div className="symbol symbol-50px border border-r10px ">
                                            <img
                                              className="img-fluid border-r8px object-fit-contain"
                                              src={
                                                val?.deliveryUser?.image || ''
                                              }
                                              alt=""
                                            />
                                          </div>
                                          <span className="fs-15 fw-600 ms-3">
                                            {val?.deliveryUser?.name || 'NA'}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center fs-15 fw-600 text-dark">
                                          {` ${
                                            val?.totalReturnedVariants
                                              ? val.totalReturnedVariants < 10
                                                ? '0' +
                                                  val.totalReturnedVariants
                                                : val.totalReturnedVariants
                                              : 0
                                          }
                                           ${
                                             val?.totalReturnedVariants > 1
                                               ? ' items'
                                               : ' item'
                                           }`}
                                        </div>
                                      </td>
                                      <td className="text-end">
                                        {Method.hasPermission(
                                          ReturnRequestConst,
                                          View,
                                          currentUser
                                        ) ? (
                                          <div className="d-flex">
                                            <button
                                              type="button"
                                              className="me-2 fs-14 btn printBtn fw-600 text-primary"
                                              onClick={() => {
                                                handleViewReason(val);
                                              }}
                                              style={{
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              View reason
                                            </button>
                                            <button
                                              className="btn btn-primary fs-14 fw-600"
                                              style={{
                                                whiteSpace: 'nowrap',
                                              }}
                                              onClick={() => {
                                                setKey(
                                                  listReturnRequest.scrollPosition,
                                                  window.scrollY.toString()
                                                );
                                                navigate(
                                                  '/all-return-requests/return-request-details',
                                                  {
                                                    state: {
                                                      tab: NewRequest,
                                                      id: val._id,
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
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Card.Body>
                      </Card>{' '}
                      {!loading &&
                      returnRequestData &&
                      returnRequestData.length ? (
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
                  ) : (
                    <>
                      {startDate && endDate ? (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">No Data Found</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">
                              Customer’s return requests will be shown here.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="border border-r10px mb-6">
                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                      <Loader loading={loading || fetchLoader} />
                    </div>
                  </div>
                )}
              </Tab.Pane>
              <Tab.Pane
                eventKey={2}
                active={tabKey == 2}
              >
                {tabKey == 2 && !loading ? (
                  returnRequestData && returnRequestData.length ? (
                    <>
                      <Card className="border border-r10px">
                        <Card.Body className="p-0">
                          <div className="table-responsive">
                            <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                              <thead>
                                <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                  <th className="min-w-125px px-10">
                                    {ReturnRequestString.orderAndId}
                                  </th>
                                  <th className="min-w-125px text-start">
                                    {tableHeaderText[tabKey]}
                                  </th>
                                  <th className="min-w-150px text-start">
                                    {ReturnRequestString.assignDeliveryUser}
                                  </th>
                                  <th className="min-w-90px text-start">
                                    {ReturnRequestString.returnRequestedFor}
                                  </th>
                                  <th className="min-w-50px text-end"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {returnRequestData.map(
                                  (val: any, goodIndex: number) => (
                                    <tr key={val._id}>
                                      <td>
                                        <div>
                                          <div className="fs-15 fw-600">
                                            {' '}
                                            {val?.orderDate
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.orderDate
                                                )
                                              : ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val?.orderRefKey
                                              ? '#' + val?.orderRefKey
                                              : ''}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-start">
                                          <span className="fs-15 fw-600">
                                            {val?.statusUpdatedAt
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.statusUpdatedAt
                                                )
                                              : ''}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-inline-flex align-items-center">
                                          <div className="symbol symbol-50px border border-r10px me-1">
                                            <img
                                              className="img-fluid border-r8px object-fit-contain"
                                              src={
                                                val?.deliveryUser?.image || ''
                                              }
                                              alt=""
                                            />
                                          </div>
                                          <span className="fs-15 fw-600 ms-3">
                                            {val?.deliveryUser?.name || 'NA'}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center fs-15 fw-600 text-dark">
                                          {` ${
                                            val?.totalReturnedVariants
                                              ? val.totalReturnedVariants < 10
                                                ? '0' +
                                                  val.totalReturnedVariants
                                                : val.totalReturnedVariants
                                              : 0
                                          } ${
                                            val?.totalReturnedVariants > 1
                                              ? ' items'
                                              : ' item'
                                          }`}
                                        </div>
                                      </td>
                                      <td className="text-end">
                                        <div className="d-flex">
                                          <button
                                            type="button"
                                            className="me-2 fs-14 btn printBtn fw-600 text-primary"
                                            onClick={() => {
                                              handleViewReason(val);
                                            }}
                                            style={{
                                              whiteSpace: 'nowrap',
                                            }}
                                          >
                                            View reason
                                          </button>
                                          <button
                                            className="btn btn-primary fs-14 fw-600"
                                            style={{
                                              whiteSpace: 'nowrap',
                                            }}
                                            onClick={() => {
                                              setKey(
                                                listReturnRequest.scrollPosition,
                                                window.scrollY.toString()
                                              );
                                              navigate(
                                                '/all-return-requests/return-request-details',
                                                {
                                                  state: {
                                                    tab: Collected,
                                                    id: val._id,
                                                  },
                                                }
                                              );
                                            }}
                                          >
                                            {OrdersDelivery.viewDetails}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Card.Body>
                      </Card>{' '}
                      {!loading &&
                      returnRequestData &&
                      returnRequestData.length ? (
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
                  ) : (
                    <>
                      {startDate && endDate ? (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">No Data Found</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">
                              Customer’s return requests will be shown here.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="border border-r10px mb-6">
                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                      <Loader loading={loading || fetchLoader} />
                    </div>
                  </div>
                )}
              </Tab.Pane>
              <Tab.Pane
                eventKey={3}
                active={tabKey == 3}
              >
                {tabKey == 3 && !loading ? (
                  returnRequestData && returnRequestData.length ? (
                    <>
                      <Card className="border border-r10px">
                        <Card.Body className="p-0">
                          <div className="table-responsive">
                            <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                              <thead>
                                <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                  <th className="min-w-125px px-10">
                                    {ReturnRequestString.orderAndId}
                                  </th>
                                  <th className="min-w-125px text-start">
                                    {tableHeaderText[tabKey]}
                                  </th>
                                  <th className="min-w-150px text-  start">
                                    {ReturnRequestString.assignDeliveryUser}
                                  </th>
                                  <th className="min-w-100 text-start">
                                    {ReturnRequestString.returnedItems}
                                  </th>
                                  <th className="min-w-25px text-end"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {returnRequestData.map(
                                  (val: any, goodIndex: number) => (
                                    <tr key={val._id}>
                                      <td>
                                        <div>
                                          <div className="fs-15 fw-600">
                                            {' '}
                                            {val?.orderDate
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.orderDate
                                                )
                                              : ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val?.orderRefKey
                                              ? '#' + val?.orderRefKey
                                              : ''}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-start">
                                          <span className="fs-15 fw-600">
                                            {val?.statusUpdatedAt
                                              ? Method.convertDateToDDMMYYYYHHMMAMPM(
                                                  val.statusUpdatedAt
                                                )
                                              : ''}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-inline-flex align-items-center">
                                          <div className="symbol symbol-50px border border-r10px me-1">
                                            <img
                                              className="img-fluid border-r8px object-fit-contain"
                                              src={
                                                val?.deliveryUser?.image || ''
                                              }
                                              alt=""
                                            />
                                          </div>
                                          <span className="fs-15 fw-600 ms-3">
                                            {val?.deliveryUser?.name || 'NA'}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-start fs-15 fw-600 text-dark">
                                          {` ${
                                            val?.totalReturnedVariants
                                              ? val.totalReturnedVariants < 10
                                                ? '0' +
                                                  val.totalReturnedVariants
                                                : val.totalReturnedVariants
                                              : 0
                                          }
                                          ${
                                            val?.totalReturnedVariants > 1
                                              ? ' items'
                                              : ' item'
                                          }`}
                                        </div>
                                      </td>
                                      <td className="text-end">
                                        <Button
                                          variant="primary"
                                          className="fs-15 fw-500"
                                          style={{
                                            whiteSpace: 'nowrap',
                                          }}
                                          onClick={() => {
                                            setKey(
                                              listReturnRequest.scrollPosition,
                                              window.scrollY.toString()
                                            );
                                            navigate(
                                              '/all-return-requests/return-request-details',
                                              {
                                                state: {
                                                  tab: Arrived,
                                                  id: val._id,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {OrdersDelivery.viewDetails}
                                        </Button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Card.Body>
                      </Card>{' '}
                      {!loading &&
                      returnRequestData &&
                      returnRequestData.length ? (
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
                  ) : (
                    <>
                      {startDate && endDate ? (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">No Data Found</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">
                              Customer’s return requests will be shown here.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="border border-r10px mb-6">
                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                      <Loader loading={loading || fetchLoader} />
                    </div>
                  </div>
                )}
              </Tab.Pane>
              <Tab.Pane
                eventKey={4}
                active={tabKey == 4}
              >
                {tabKey == 4 && !loading ? (
                  returnRequestData && returnRequestData.length ? (
                    <>
                      <Card className="border border-r10px">
                        <Card.Body className="p-0">
                          <div className="table-responsive">
                            <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                              <thead>
                                <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                  <th className="min-w-125px px-10">
                                    {ReturnRequestString.orderAndId}
                                  </th>
                                  <th className="min-w-125px text-start">
                                    {tableHeaderText[tabKey]}
                                  </th>
                                  <th className="min-w-150px text-  start">
                                    {ReturnRequestString.assignDeliveryUser}
                                  </th>
                                  <th className="min-w-90px text-start">
                                    {ReturnRequestString.returnedItems}
                                  </th>
                                  <th className="min-w-25px text-end"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {returnRequestData.map(
                                  (val: any, goodIndex: number) => (
                                    <tr key={val._id}>
                                      <td>
                                        <div>
                                          <div className="fs-15 fw-600">
                                            {' '}
                                            {val?.orderDate
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.orderDate
                                                )
                                              : ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val?.orderRefKey
                                              ? '#' + val?.orderRefKey
                                              : ''}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-start">
                                          <span className="fs-15 fw-600">
                                            {val?.statusUpdatedAt
                                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                                  val.statusUpdatedAt
                                                )
                                              : ''}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-inline-flex align-items-center">
                                          <div className="symbol symbol-50px border border-r10px me-1">
                                            <img
                                              className="img-fluid border-r8px object-fit-contain"
                                              src={
                                                val?.deliveryUser?.image || ''
                                              }
                                              alt=""
                                            />
                                          </div>
                                          <span className="fs-15 fw-600 ms-3">
                                            {val?.deliveryUser?.name || 'NA'}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-start fs-15 fw-600 text-dark">
                                          {` ${
                                            val?.totalReturnedVariants
                                              ? val.totalReturnedVariants < 10
                                                ? '0' +
                                                  val.totalReturnedVariants
                                                : val.totalReturnedVariants
                                              : 0
                                          } ${
                                            val?.totalReturnedVariants > 1
                                              ? ' items'
                                              : ' item'
                                          }`}
                                        </div>
                                      </td>
                                      <td className="text-end">
                                        <Button
                                          variant="primary"
                                          className="fs-15 fw-500"
                                          style={{
                                            whiteSpace: 'nowrap',
                                          }}
                                          onClick={() => {
                                            setKey(
                                              listReturnRequest.scrollPosition,
                                              window.scrollY.toString()
                                            );
                                            navigate(
                                              '/all-return-requests/order-refund-details',
                                              {
                                                state: {
                                                  tab: Refunded,
                                                  id: val._id,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {OrdersDelivery.viewDetails}
                                        </Button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Card.Body>
                      </Card>{' '}
                      {!loading &&
                      returnRequestData &&
                      returnRequestData.length ? (
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
                  ) : (
                    <>
                      {startDate && endDate ? (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">No Data Found</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-r10px mb-6">
                          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                            <span className="fs-18 fw-500">
                              Customer’s return requests will be shown here.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="border border-r10px mb-6">
                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                      <Loader loading={loading || fetchLoader} />
                    </div>
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      ) : (
        <Row className="align-items-center g-md-5 g-3 mb-7">
          <Col xs>
            <h1 className="fs-22 fw-bolder">
              {ReturnRequestString.returnRequests}
            </h1>
          </Col>
          <Col xl={12}>
            <Card className="border border-r10px">
              <Card.Body className="p-0 min-h-275px d-flex justify-content-center align-items-center">
                <div className="fs-18 h-200px text-center mt-5">
                  <p className="fw-500 ">
                    Once the super admin or warehouse admin adds the <br />{' '}
                    goods request It will be shown here.
                  </p>
                  <Button
                    className="min-h-50px btn-lg"
                    variant="primary"
                    type="button"
                    onClick={() => {
                      navigate('/goods-requests/add-goods-request');
                    }}
                  >
                    Add goods request
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};
export default AllReturnRequests;
