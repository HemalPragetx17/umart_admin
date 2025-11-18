import {
  Button,
  Card,
  Col,
  FormLabel,
  Nav,
  OverlayTrigger,
  Popover,
  Row,
  Tab,
} from 'react-bootstrap';
import { GoodsRequestString, OrdersDelivery } from '../../../utils/string';
import { auto } from '@popperjs/core';
import ReactDatePicker from 'react-datepicker';
import { KTSVG } from '../../../umart_admin/helpers';
import { useEffect, useState } from 'react';
import {
  Add,
  Admin,
  GoodsRequestConst,
  PAGE_LIMIT,
  RequestCancelled,
  RequestCompleted,
  RequestPending,
  View,
} from '../../../utils/constants';
import { goodsRequestsJson } from '../../../utils/dummyJSON';
import Method from '../../../utils/methods';
import Pagination from '../../../Global/pagination';
import Loader from '../../../Global/loader';
import { useNavigate } from 'react-router-dom';
import RequestedProductModal from '../../modals/RequestedProductModal';
import InfoWarning from '../../../umart_admin/assets/media/info-warning.png';
import APICallService from '../../../api/apiCallService';
import { goodsRequests } from '../../../api/apiEndPoints';
import { useDebounce } from '../../../utils/useDebounce';
import warehouseImg from '../../../umart_admin/assets/media/warehouse.png';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { listGoodsRequest } from '../../../utils/storeString';
import { useAuth } from '../auth';
const AllRequests = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(true);
  const [tabKey, setTabKey] = useState<any>(
    getKey(listGoodsRequest.tab) || '1'
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(getKey(listGoodsRequest.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listGoodsRequest.limit) || PAGE_LIMIT
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(listGoodsRequest.dateFilter)?.startDate
      ? new Date(getKey(listGoodsRequest.dateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(listGoodsRequest.dateFilter)?.endDate
      ? new Date(getKey(listGoodsRequest.dateFilter)?.endDate)
      : null
  );
  const [search, setSearch] = useState<string>(
    getKey(listGoodsRequest.search) || ''
  );
  const [goodsRequestData, setGoodsRequestData] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(undefined);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      if (!Method.hasModulePermission(GoodsRequestConst, currentUser)) {
        return window.history.back();
      }
      await fetchRequests(page, pageLimit, tabKey, search, startDate, endDate);
      setFetchLoader(false);
      setTimeout(() => {
        const pos = getKey(listGoodsRequest.scrollPosition);
        window.scrollTo(0, pos);
      }, 600);
    })();
  }, []);
  const fetchRequests = async (
    pageNo: number,
    limit: number,
    status?: any,
    search?: string,
    fromDate?: string,
    toDate?: string
  ) => {
    setLoading(true);
    setFetchLoader(true);
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      searchTerm: search ? search.trim() : '',
      fromDate: fromDate
        ? Method.convertDateToFormat(fromDate, 'YYYY-MM-DD')
        : '',
      toDate: toDate ? Method.convertDateToFormat(toDate, 'YYYY-MM-DD') : '',
    };
    params['status[]'] = status;
    const apiService = new APICallService(
      goodsRequests.listGoodsRequest,
      params,
      '',
      '',
      false,
      '',
      GoodsRequestConst
    );
    const response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setGoodsRequestData(response.records);
    }
    setLoading(false);
    setFetchLoader(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setFetchLoader(true);
    setPage(val);
    setKey(listGoodsRequest.page, val);
    await fetchRequests(val, pageLimit, tabKey, search, startDate, endDate);
    setFetchLoader(false);
  };
  const handleNextPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val + 1);
    setKey(listGoodsRequest.page, val + 1);
    await fetchRequests(val + 1, pageLimit, tabKey, search, startDate, endDate);
    setFetchLoader(false);
  };
  const handlePreviousPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val - 1);
    setKey(listGoodsRequest.page, val - 1);
    await fetchRequests(val - 1, pageLimit, tabKey, search, startDate, endDate);
    setFetchLoader(false);
  };
  const handlePageLimit = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setKey(listGoodsRequest.page, 1);
    setKey(listGoodsRequest.limit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchRequests(
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
    setKey(listGoodsRequest.page, 1);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      setFetchLoader(true);
      //api call
      await fetchRequests(
        1,
        pageLimit,
        tabKey,
        search,
        startDateFormatted,
        endDateFormatted
      );
      setKey(listGoodsRequest.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      // apicall
      await fetchRequests(1, pageLimit, tabKey, search);
      removeKey(listGoodsRequest.dateFilter);
    }
    setFetchLoader(false);
  };
  const debounce = useDebounce(fetchRequests, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearch(input);
    setPage(1);
    setKey(listGoodsRequest.page, 1);
    if (input.trim().length > 2 && search !== input) {
      // await debounce(1, pageLimit, productState, categories, input);
      await debounce(1, pageLimit, tabKey, input, startDate, endDate);
    } else if (input.trim().length <= 2 && input.length < search.length) {
      // await debounce(1, pageLimit, productState, categories, input);
      await debounce(1, pageLimit, tabKey, input, startDate, endDate);
    }
    setKey(listGoodsRequest.search, input);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const gerArrivedQuantity = (item: any) => {
    return item.variants.reduce((preSum: any, currVal: any, index: number) => {
      return preSum + currVal.quantityTypes[0].arrivedStockCount;
    }, 0);
  };
  return (
    <>
      {selectedRequest && showModal ? (
        <RequestedProductModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedRequest(undefined);
          }}
          data={selectedRequest}
          tab={parseInt(tabKey)}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center g-md-5 g-3 mb-7">
        <Col xs>
          <h1 className="fs-22 fw-bolder">
            {GoodsRequestString.goodsRequests}
          </h1>
        </Col>
        {Method.hasPermission(GoodsRequestConst, Add, currentUser) ? (
          <Col xs={auto}>
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
          </Col>
        ) : (
          <></>
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
                    {'Search by warehouse'}
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
                      placeholder="Search by warehouse name…"
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
                    className="form-control ms-2 bg-white min-h-60px fs-15 fw-bold text-dark min-w-xl-300px min-w-250px min-w-lg-200px min-w-md-275px min-w-xs-288px "
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
                setKey(listGoodsRequest.tab, k);
                // setStartDate(null);
                // setEndDate(null);
                setTotalRecords(0);
                setFetchLoader(true);
                // setSearch('');
                // removeKey(listGoodsRequest.search);
                setPage(1);
                setKey(listGoodsRequest.page, 1);
                // removeKey(listGoodsRequest.dateFilter);
                // removeKey(listGoodsRequest.search);
                //  setSelected(false);
                // setSelectedId([]);
                // setSelectLoading(false);
                // setEnableSelectAll(false);
                // setDeliveryRoutesPlanningModal(false);
                switch (k) {
                  case '1':
                    await fetchRequests(
                      1,
                      pageLimit,
                      1,
                      search,
                      startDate,
                      endDate
                    );
                    break;
                  case '2':
                    await fetchRequests(
                      1,
                      pageLimit,
                      2,
                      search,
                      startDate,
                      endDate
                    );
                    break;
                  case '3':
                    await fetchRequests(
                      1,
                      pageLimit,
                      3,
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
                  className="mb-6"
                >
                  <div className="bg-light border border-r8px p-3 px-md-6">
                    <Nav variant="pills">
                      <Nav.Item>
                        <Nav.Link
                          eventKey={1}
                          disabled={fetchLoader}
                          onClick={() => {
                            setTabKey(1);
                            setKey(listGoodsRequest.tab, 1);
                          }}
                        >
                          {GoodsRequestString.pendingText}
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
                            setKey(listGoodsRequest.tab, 2);
                          }}
                        >
                          {GoodsRequestString.completedText}
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
                            setKey(listGoodsRequest.tab, 3);
                          }}
                        >
                          {GoodsRequestString.canceledText}
                          {tabKey == '3'
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
              {tabKey == 1 && !fetchLoader ? (
                goodsRequestData && goodsRequestData.length > 0 ? (
                  <>
                    <Card className="border border-r10px">
                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                            <thead>
                              <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                <th className="min-w-125px px-10">
                                  {GoodsRequestString.warehouseName}
                                </th>
                                <th className="min-w-125px text-start">
                                  {GoodsRequestString.requestInitiateOn}
                                </th>
                                <th className="min-w-150px text-start">
                                  {GoodsRequestString.requestInitiateBy}
                                </th>
                                <th className="min-w-100 text-start">
                                  {GoodsRequestString.quantity}
                                </th>
                                <th className="min-w-25px text-end"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {goodsRequestData.map(
                                (val: any, goodIndex: number) => (
                                  <tr key={val._id}>
                                    <td>
                                      <div className="d-flex align-items-center flex-row">
                                        <span className="symbol symbol-50px border">
                                          <img
                                            src={warehouseImg}
                                            className="img-fluid object-fit-contain"
                                            alt=""
                                          />
                                        </span>
                                        <span className="fs-16 fw-600 ms-3">
                                          {val?.warehouse?.name || ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start">
                                        <span className="fs-16 fw-600 ms-3">
                                          {val?._createdAt
                                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                                val._createdAt,
                                                '-'
                                              )
                                            : ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start">
                                        <div>
                                          <div className="fs-16 fw-600 ">
                                            {' '}
                                            {val?.createdBy?.name || ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val?.createdBy?.userType === Admin
                                              ? 'Super-admin'
                                              : 'Sub-admin'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      {Method.hasPermission(
                                        GoodsRequestConst,
                                        View,
                                        currentUser
                                      ) ? (
                                        <div className="text-start fs-16 fw-600 text-dark">
                                          <div>
                                            {`${
                                              val?.totalRequestedQuantities
                                            } ${
                                              val?.totalRequestedQuantities > 1
                                                ? 'Units'
                                                : 'Unit'
                                            }`}
                                          </div>
                                          <div
                                            className="text-decoration-underline cursor-pointer"
                                            onClick={() => {
                                              handleShowModal();
                                              setSelectedRequest(val);
                                            }}
                                          >
                                            View products
                                          </div>
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {Method.hasPermission(
                                        GoodsRequestConst,
                                        View,
                                        currentUser
                                      ) ? (
                                        <Button
                                          variant="primary"
                                          className="fs-15 fw-600"
                                          style={{
                                            whiteSpace: 'nowrap',
                                          }}
                                          onClick={() => {
                                            setKey(
                                              listGoodsRequest.scrollPosition,
                                              window.scrollY.toString()
                                            );
                                            navigate(
                                              '/goods-requests/goods-request-details',
                                              {
                                                state: {
                                                  tab: RequestPending,
                                                  id: val?._id,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {OrdersDelivery.viewDetails}
                                        </Button>
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
                    {!loading && goodsRequestData && goodsRequestData.length ? (
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
                            Goods requests will be shown in this section.
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
              {tabKey == 2 && !fetchLoader ? (
                goodsRequestData && goodsRequestData.length ? (
                  <>
                    <Card className="border border-r10px">
                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                            <thead>
                              <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                <th className="min-w-125px px-10">
                                  {GoodsRequestString.warehouseName}
                                </th>
                                <th className="min-w-125px text-start">
                                  {GoodsRequestString.requestCompletedOn}
                                </th>
                                <th className="min-w-150px text-start">
                                  {GoodsRequestString.requestInitiateBy}
                                </th>
                                <th className="min-w-100 text-start">
                                  {GoodsRequestString.quantity}
                                </th>
                                <th className="min-w-25px text-end"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {goodsRequestData.map(
                                (val: any, goodIndex: number) => (
                                  <tr key={val._id}>
                                    <td>
                                      <div className="d-flex align-items-center flex-row">
                                        <span className="symbol symbol-50px border">
                                          <img
                                            src={warehouseImg}
                                            className="img-fluid object-fit-contain"
                                            alt=""
                                          />
                                        </span>
                                        <span className="fs-15 fw-600 ms-3">
                                          {val?.warehouse?.name || ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start">
                                        <span className="fs-15 fw-600 ms-3">
                                          {val?._createdAt
                                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                                val._createdAt,
                                                '-'
                                              )
                                            : ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start">
                                        <div>
                                          <div className="fs-16 fw-600 ">
                                            {' '}
                                            {val?.createdBy?.name || ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val.createdBy.userType === Admin
                                              ? 'Super-admin'
                                              : 'Sub-admin'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start fs-15 fw-600 text-dark">
                                        <div>
                                          <span>
                                            {`${val.totalRequestedQuantities} ${
                                              val.totalRequestedQuantities > 1
                                                ? 'Units'
                                                : 'Unit'
                                            }`}
                                          </span>
                                          {val.totalRequestedQuantities >
                                          gerArrivedQuantity(val) ? (
                                            <OverlayTrigger
                                              trigger="hover"
                                              placement="bottom-start"
                                              overlay={
                                                <Popover id="popover-basic">
                                                  <Popover.Body className="p-2 border-r10px text-warning fs-14 fw-bold">
                                                    <>{`${
                                                      val.totalRequestedQuantities -
                                                      gerArrivedQuantity(val)
                                                    } Units yet to receive`}</>
                                                  </Popover.Body>
                                                </Popover>
                                              }
                                            >
                                              <span className="ms-2">
                                                <img src={InfoWarning} />
                                              </span>
                                            </OverlayTrigger>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                        {Method.hasPermission(
                                          GoodsRequestConst,
                                          View,
                                          currentUser
                                        ) ? (
                                          <div
                                            className="text-decoration-underline cursor-pointer"
                                            onClick={() => {
                                              handleShowModal();
                                              setSelectedRequest(val);
                                            }}
                                          >
                                            View products
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      {Method.hasPermission(
                                        GoodsRequestConst,
                                        View,
                                        currentUser
                                      ) ? (
                                        <Button
                                          variant="primary"
                                          className="fs-15 fw-600"
                                          style={{
                                            whiteSpace: 'nowrap',
                                          }}
                                          onClick={() => {
                                            setKey(
                                              listGoodsRequest.scrollPosition,
                                              window.scrollY.toString()
                                            );
                                            navigate(
                                              '/goods-requests/goods-request-details',
                                              {
                                                state: {
                                                  tab: RequestCompleted,
                                                  id: val._id,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {OrdersDelivery.viewDetails}
                                        </Button>
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
                    {!loading && goodsRequestData && goodsRequestData.length ? (
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
                            Goods requests will be shown in this section.
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
              {tabKey == 3 && !fetchLoader ? (
                goodsRequestData && goodsRequestData.length ? (
                  <>
                    <Card className="border border-r10px">
                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                            <thead>
                              <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                <th className="min-w-125px px-10">
                                  {GoodsRequestString.warehouseName}
                                </th>
                                <th className="min-w-125px text-start">
                                  {GoodsRequestString.requestCancelledOn}
                                </th>
                                <th className="min-w-150px text-start">
                                  {GoodsRequestString.requestInitiateBy}
                                </th>
                                <th className="min-w-100 text-start">
                                  {GoodsRequestString.quantity}
                                </th>
                                <th className="min-w-25px text-end"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {goodsRequestData.map(
                                (val: any, goodIndex: number) => (
                                  <tr key={val._id}>
                                    <td>
                                      <div className="d-flex align-items-center flex-row">
                                        <span className="symbol symbol-50px border">
                                          <img
                                            src={warehouseImg}
                                            className="img-fluid object-fit-contain"
                                            alt=""
                                          />
                                        </span>
                                        <span className="fs-15 fw-600 ms-3">
                                          {val?.warehouse?.name || ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start">
                                        <span className="fs-15 fw-600 ms-3">
                                          {val?._createdAt
                                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                                val._createdAt,
                                                '-'
                                              )
                                            : ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start">
                                        <div>
                                          <div className="fs-16 fw-600 ">
                                            {' '}
                                            {val?.createdBy?.name || ''}
                                          </div>
                                          <div className="text-gray fs-14 fw-500 text-start">
                                            {val?.createdBy?.userType === Admin
                                              ? 'Super-admin'
                                              : 'Sub-admin'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-start fs-15 fw-600 text-dark">
                                        <div>
                                          {`${val.totalRequestedQuantities} ${
                                            val.totalRequestedQuantities > 1
                                              ? 'Units'
                                              : 'Unit'
                                          }`}
                                        </div>
                                        {Method.hasPermission(
                                          GoodsRequestConst,
                                          View,
                                          currentUser
                                        ) ? (
                                          <div
                                            className="text-decoration-underline cursor-pointer"
                                            onClick={() => {
                                              handleShowModal();
                                              setSelectedRequest(val);
                                            }}
                                          >
                                            View products
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      {Method.hasPermission(
                                        GoodsRequestConst,
                                        View,
                                        currentUser
                                      ) ? (
                                        <Button
                                          variant="primary"
                                          className="fs-15 fw-600"
                                          style={{
                                            whiteSpace: 'nowrap',
                                          }}
                                          onClick={() => {
                                            setKey(
                                              listGoodsRequest.scrollPosition,
                                              window.scrollY.toString()
                                            );
                                            navigate(
                                              '/goods-requests/goods-request-details',
                                              {
                                                state: {
                                                  tab: RequestCancelled,
                                                  id: val._id,
                                                },
                                              }
                                            );
                                          }}
                                        >
                                          {OrdersDelivery.viewDetails}
                                        </Button>
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
                    {!loading && goodsRequestData && goodsRequestData.length ? (
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
                            Goods requests will be shown in this section.
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
      {/* //   <Row className="align-items-center g-md-5 g-3 mb-7">
      //     <Col xs>
      //       <h1 className="fs-22 fw-bolder">
      //         {GoodsRequestString.goodsRequests}
      //       </h1>
      //     </Col>
      //     <Col xl={12}>
      //       <Card className="border border-r10px">
      //         <Card.Body className="p-0 min-h-275px d-flex justify-content-center align-items-center">
      //           <div className="fs-18 h-200px text-center mt-5">
      //             <p className="fw-500 ">
      //               Once the super admin or warehouse admin adds the <br />{' '}
      //               goods request It will be shown here.
      //             </p>
      //             <Button
      //               className="min-h-50px btn-lg"
      //               variant="primary"
      //               type="button"
      //               onClick={() => {
      //                 navigate('/goods-requests/add-goods-request');
      //               }}
      //             >
      //               Add goods request
      //             </Button>
      //           </div>
      //         </Card.Body>
      //       </Card>
      //     </Col>
      //   </Row> */}
    </>
  );
};
export default AllRequests;
