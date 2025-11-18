import { useEffect, useState } from 'react';
import { Button, Card, Col, FormLabel, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Loader from '../../../Global/loader';
import { KTSVG } from '../../../umart_admin/helpers';
import Method from '../../../utils/methods';
import { Customers, String } from './../../../utils/string';
import APICallService from '../../../api/apiCallService';
import { buyer, reports } from '../../../api/apiEndPoints';
import { Edit, PAGE_LIMIT, Customer, View } from '../../../utils/constants';
import { customerJSON } from '../../../api/apiJSON/customer';
import Pagination from '../../../Global/pagination';
import { IGetCustomers } from '../../../types/response_data/customer';
import DatePicker from 'react-datepicker';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { success } from '../../../Global/toast';
import { customerToast } from '../../../utils/toast';
import { useAuth } from '../auth';
import { useDebounce } from '../../../utils/useDebounce';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import AllCustomerReportsModal from '../../modals/reports/all-customers-reports';
import { getKey, removeKey, setKey } from '../../../Global/history';
import {
  customerDetails,
  customerProfileOrderTab,
  customerProfileRefundTab,
  customerProfileWalletTab,
  listCustomers,
} from '../../../utils/storeString';
import BlankImg from '../../../umart_admin/assets/media/avatars/blank.png';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import EditCustomerModal from '../../modals/edit-customer';
const ordersNumberOptions = [
  {
    // value: AllProduct,
    value: '0-',
    name: 'All ',
    label: (
      <>
        <span className="fs-16 fw-600 text-black mb-0">All</span>
      </>
    ),
    id: 0,
  },
  {
    // value: AllProduct,
    value: '0-50',
    name: '0 - 50 orders',
    label: (
      <>
        <span className="fs-16 fw-600 text-black mb-0">0 - 50 orders</span>
      </>
    ),
    id: 1,
  },
  {
    value: '51-100',
    name: '51 - 100 orders',
    label: (
      <>
        <span className="fs-16 fw-600 text-black mb-0">51 - 100 orders</span>
      </>
    ),
    id: 2,
  },
  {
    value: '101-200',
    name: '101 - 200 orders',
    label: (
      <>
        <span className="fs-16 fw-600 text-black mb-0">101 - 200 orders</span>
      </>
    ),
    id: 3,
  },
  {
    value: '201-500',
    name: '201 - 500 orders',
    label: (
      <>
        <span className="fs-16 fw-600 text-black mb-0">201 - 500 orders</span>
      </>
    ),
    id: 4,
  },
  {
    value: '500-',
    name: '500+ orders',
    label: (
      <>
        <span className="fs-16 fw-600 text-black mb-0">500+ orders</span>
      </>
    ),
    id: 5,
  },
];
const options = [
  {
    label: (
      <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4">
        {'Edit customer'}
      </button>
    ),
    value: 1,
  },
];
const ViewCustomers = () => {
  const navigate = useNavigate();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(getKey(listCustomers.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listCustomers.limit) || PAGE_LIMIT
  );
  const [customers, setCustomers] = useState<IGetCustomers | any>([]);
  const [searchTerm, setSearchTerm] = useState(
    getKey(listCustomers.search) || ''
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(listCustomers.dateFilter)?.startDate
      ? new Date(getKey(listCustomers.dateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(listCustomers.dateFilter)?.endDate
      ? new Date(getKey(listCustomers.dateFilter)?.endDate)
      : null
  );
  const [fromOrders, setFromOrders] = useState<any>('0');
  const [toOrders, setToOrders] = useState<any>(Number.MAX_SAFE_INTEGER);
  const { currentUser } = useAuth();
  const [isDisabled, setIsDisabled] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(
    getKey(listCustomers.ordersFilter) || 0
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectCustomer, setSelectedCustomer] = useState<any>();
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasModulePermission(Customer, currentUser)) {
        return window.history.back();
      }
      let tempFrom = fromOrders;
      let tempTo = toOrders;
      let val = getKey(listCustomers.ordersFilter);
      let obj = ordersNumberOptions[val];
      if (obj) {
        const range = obj.value.split('-');
        tempFrom = range[0];
        tempTo = range[1] || '';
        if (tempTo.length === 0) {
          tempTo = Number.MAX_SAFE_INTEGER;
        }
      }
      setFromOrders(tempFrom);
      setToOrders(tempTo);
      await fetchCustomerList(
        page,
        pageLimit,
        searchTerm,
        startDate,
        endDate,
        tempFrom,
        tempTo
      );
      removeKey('profile');
      removeKey(customerDetails.detailsTab);
      removeKey(customerProfileOrderTab.page);
      removeKey(customerProfileOrderTab.limit);
      removeKey(customerProfileOrderTab.search);
      removeKey(customerProfileOrderTab.orderStatusFilter);
      removeKey(customerProfileOrderTab.dateFilter);
      removeKey(customerProfileRefundTab.ordersFilter);
      removeKey(customerProfileRefundTab.page);
      removeKey(customerProfileRefundTab.limit);
      removeKey(customerProfileWalletTab.dateFilter);
      removeKey(customerProfileWalletTab.page);
      removeKey(customerProfileWalletTab.limit);
      setFetchLoading(false);
      setTimeout(() => {
        const pos = getKey(listCustomers.scrollPosition);
        window.scrollTo(0, pos);
      }, 600);
    })();
  }, []);
  const fetchCustomerList = async (
    pageNo: number,
    limit: number,
    search: string,
    startDate?: any,
    endDate?: any,
    fromOrders?: any,
    toOrders?: any
  ) => {
    setFetchLoading(true);
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      searchTerm: search ? search.trim() : '',
      state: 1,
      registeredFrom: startDate,
      registeredTo: endDate,
    };
    if (fromOrders && toOrders) {
      params = {
        ...params,
        orderCountFrom: fromOrders,
        toOrders: toOrders,
      };
    }
    let apiService = new APICallService(
      buyer.customerList,
      customerJSON.listCustomers(params),
      '',
      '',
      false,
      '',
      Customer
    );
    let response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      }
      setCustomers(response.records);
    }
    setFetchLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setLoading(true);
    setPage(val);
    setKey(listCustomers.page, val);
    await fetchCustomerList(
      val,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      fromOrders,
      toOrders
    );
    setLoading(false);
  };
  const handleNextPage = async (val: number) => {
    setLoading(true);
    setPage(val + 1);
    setKey(listCustomers.page, val + 1);
    await fetchCustomerList(
      val + 1,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      fromOrders,
      toOrders
    );
    setLoading(false);
  };
  const handlePreviousPage = async (val: number) => {
    setLoading(true);
    setPage(val - 1);
    setKey(listCustomers.page, val - 1);
    await fetchCustomerList(
      val - 1,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      fromOrders,
      toOrders
    );
    setLoading(false);
  };
  const handlePageLimit = async (event: any) => {
    setLoading(true);
    setPage(1);
    setKey(listCustomers.page, 1);
    await setPageLimit(parseInt(event.target.value));
    setKey(listCustomers.limit, parseInt(event.target.value));
    await fetchCustomerList(
      1,
      event.target.value,
      searchTerm,
      startDate,
      endDate,
      fromOrders,
      toOrders
    );
    setLoading(false);
  };
  const handleToggleActivation = async (index: any, id: string) => {
    setIsDisabled(true);
    const temp = [...customers];
    const currStatus = temp[index].active;
    const params = {
      status: !currStatus,
    };
    const apiCallService = new APICallService(
      buyer.updateStatus,
      params,
      {
        id: id,
      },
      '',
      false,
      '',
      Customer
    );
    const response = await apiCallService.callAPI();
    if (response) {
      temp[index].active = !currStatus;
      setCustomers(temp);
      if (currStatus) {
        success(customerToast.deactivated);
      } else {
        success(customerToast.activated);
      }
    }
    setIsDisabled(false);
  };
  const handleDateChange = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setLoading(true);
    setPage(1);
    setKey(listCustomers.page, 1);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      setTotalRecords(0);
      await fetchCustomerList(
        1,
        pageLimit,
        searchTerm,
        startDateFormatted,
        endDateFormatted,
        fromOrders,
        toOrders
      );
      setKey(listCustomers.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      setTotalRecords(0);
      await fetchCustomerList(
        1,
        pageLimit,
        searchTerm,
        startDateFormatted,
        endDateFormatted,
        fromOrders,
        toOrders
      );
      removeKey(listCustomers.dateFilter);
    }
    setLoading(false);
  };
  const handleCustomerProfile = (customVal: any) => {
    navigate('/customers/customer-profile', { state: customVal });
  };
  const debounce = useDebounce(fetchCustomerList, 400);
  const handleSearch = async (value: string) => {
    value = value.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    //const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(value);
    if (!isValid) {
      return;
    }
    setSearchTerm(value);
    if (value.trim().length > 2 && searchTerm !== value) {
      setPage(1);
      setKey(listCustomers.page, 1);
      setLoading(true);
      setTotalRecords(0);
      await debounce(
        1,
        pageLimit,
        value,
        startDate,
        endDate,
        fromOrders,
        toOrders
      );
      setLoading(false);
      //await fetchProducts(1, pageLimit, productState, categories, input);
    } else if (value.trim().length <= 2 && value.length < searchTerm.length) {
      setPage(1);
      setKey(listCustomers.page, 1);
      setLoading(true);
      setTotalRecords(0);
      await debounce(
        1,
        pageLimit,
        value,
        startDate,
        endDate,
        fromOrders,
        toOrders
      );
      setLoading(false);
      // await fetchProducts(1, pageLimit, productState, categories, input);
    }
    setKey(listCustomers.search, value);
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    // if (charCode === 17) return;
    if (input.trim().length >= 3) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      // setProducts([]);
      await fetchCustomerList(
        page,
        pageLimit,
        input,
        startDate,
        endDate,
        fromOrders,
        toOrders
      );
      setLoading(false);
    } else if (
      input.trim().length <= 3 &&
      (charCode === 46 || charCode === 8)
    ) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      //     setProducts([]);
      await fetchCustomerList(
        page,
        pageLimit,
        input,
        startDate,
        endDate,
        fromOrders,
        toOrders
      );
      setLoading(false);
    } else if (
      input.trim().length === 0 &&
      (charCode === 17 || charCode === 88)
    ) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      // setProducts([]);
      await fetchCustomerList(
        page,
        pageLimit,
        input,
        startDate,
        endDate,
        fromOrders,
        toOrders
      );
      setLoading(false);
    }
  };
  const handleOrdersNumberChange = async (event: any) => {
    const range = event.value.split('-');
    const fromOrder = range[0];
    let toOrder = range[1] || '';
    if (toOrder.length === 0) {
      toOrder = Number.MAX_SAFE_INTEGER;
    }
    setFromOrders(fromOrder);
    setToOrders(toOrder);
    setLoading(true);
    setPage(1);
    setSelectedOrder(event.id);
    setKey(listCustomers.page, 1);
    setKey(listCustomers.ordersFilter, event.id);
    // setSearchTerm('');
    setTotalRecords(0);
    await fetchCustomerList(
      1,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      fromOrder,
      toOrder
    );
    setLoading(false);
  };
  const handleReportModalOpen = () => {
    setShowReportModal(true);
  };
  const handleReportModalClose = () => {
    setShowReportModal(false);
  };
  const handleOptionChange = (event: any, data: any) => {
    if (event.value == 1) {
      setShowEditModal(true);
      setSelectedCustomer(data);
    }
  };
  const handleEditModalClose = async () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
    await fetchCustomerList(
      page,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      fromOrders,
      toOrders
    );
  };
  return (
    <>
      {showEditModal && selectCustomer ? (
        <EditCustomerModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
          }}
          data={selectCustomer}
          onClose={handleEditModalClose}
        />
      ) : (
        <></>
      )}
      {showReportModal ? (
        <AllCustomerReportsModal
          show={showReportModal}
          onHide={handleReportModalClose}
          url={reports.allCustomerReports}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center mb-7">
        <Col xs>
          <h1 className="fs-22 fw-bolder mb-sm-0 mb-3">
            {Customers.titleCustomer}
          </h1>
        </Col>
        {!fetchLoading && (
          <Col xs="auto">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={handleReportModalOpen}
            >
              <span className="indicator-label fs-16 fw-bold">
                {'Download report'}
              </span>
            </Button>
          </Col>
        )}
      </Row>
      {Method.hasModulePermission(Customer, currentUser) ? (
        <Row>
          <Col lg={12}>
            <Card className="bg-light mb-7">
              <Card.Body className="px-7">
                <Row className="align-items-center g-lg-8 g-6">
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark">
                      {'Search customer'}
                    </FormLabel>{' '}
                    <div className="position-relative my-1">
                      <KTSVG
                        path="/media/icons/duotune/general/gen021.svg"
                        className="svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ps-13"
                      />
                      <input
                        type="text"
                        className="form-control form-control-custom border-r8px bg-white ps-11"
                        name="Search Team"
                        placeholder={Customers.search}
                        value={searchTerm}
                        onChange={(event: any) => {
                          handleSearch(event.target.value);
                        }}
                        // onKeyUp={handleOnKeyUp}
                      />
                    </div>
                  </Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark  ">
                      {'Filter by orders'}
                    </FormLabel>{' '}
                    <div className="d-flex justify-content-center align-items-center ">
                      <div className="w-100">
                        <CustomSelectWhite
                          defaultValue={[
                            {
                              // value: AllProduct,
                              value: '0-50',
                              name: '0 - 50 orders',
                              label: (
                                <>
                                  <span className="fs-16 fw-600 text-black mb-0">
                                    0 - 50 orders
                                  </span>
                                </>
                              ),
                            },
                          ]}
                          value={ordersNumberOptions[selectedOrder]}
                          isDisabled={loading}
                          options={ordersNumberOptions}
                          onChange={(event: any) => {
                            handleOrdersNumberChange(event);
                          }}
                          isSearchable={false}
                          isMulti={false}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark">
                      {'Filter by registration date'}
                    </FormLabel>{' '}
                    <DatePicker
                      className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-md-288px min-w-225px"
                      selected={startDate}
                      onChange={handleDateChange}
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      showFullMonthYearPicker
                      placeholderText="Filter by dates"
                      isClearable={true}
                      showYearDropdown={true}
                      scrollableYearDropdown={true}
                      dropdownMode="select"
                      customInput={<CustomDateInput />}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="border">
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                        <th className="min-w-225px min-w-xl-250px">
                          {Customers.customerName}
                        </th>
                        <th className="min-w-130px">{Customers.totalOrders}</th>
                        <th className="min-w-125px">{Customers.totalValue}</th>
                        <th className="min-w-125px min-w-xl-125px">
                          {Customers.registerOn}
                        </th>
                        <th className="min-w-80px min-w-xl-80px">
                          {Customers.activateDeactivate}
                        </th>
                        <th className="min-w-200px text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchLoading ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="w-100 d-flex justify-content-center mt-2">
                              <Loader loading={fetchLoading} />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {customers.length ? (
                            <>
                              {customers.map(
                                (customVal: any, customIndex: number) => {
                                  return (
                                    <tr key={customVal._id}>
                                      <td>
                                        <div className="d-flex align-items-center flex-row">
                                          <div className="symbol symbol-50px border">
                                            <img
                                              className="img-fluid border-r8px object-fit-contain"
                                              src={customVal?.image || BlankImg}
                                              alt=""
                                            />
                                          </div>
                                          <span className="fs-15 fw-600 ms-3">
                                            {customVal.name}
                                            <br />
                                            <span className="text-muted fw-semibold text-muted d-block fs-7">
                                              {customVal.email}
                                            </span>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="badge badge-light custom-badge">
                                          {`${
                                            customVal.totalOrders
                                              ? customVal.totalOrders
                                              : 0
                                          }` +
                                            ' ' +
                                            `${
                                              customVal?.totalOrders > 1
                                                ? String.orders
                                                : String.order
                                            }`}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-600">
                                          {String.TSh +
                                            ' ' +
                                            Method.formatCurrency(
                                              customVal?.totalOrdersValue || 0
                                            )}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-500">
                                          {Method.convertDateToDDMMYYYY(
                                            customVal.createdAt
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center">
                                          <label className="form-check form-switch form-check-custom form-check-solid ">
                                            <input
                                              className="form-check-input form-check-success w-50px h-30px "
                                              type="checkbox"
                                              name="notifications"
                                              disabled={
                                                !Method.hasPermission(
                                                  Customer,
                                                  Edit,
                                                  currentUser
                                                ) || isDisabled
                                              }
                                              onChange={() =>
                                                handleToggleActivation(
                                                  customIndex,
                                                  customVal._id
                                                )
                                              }
                                              checked={customVal.active}
                                            />
                                          </label>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-between">
                                          {Method.hasPermission(
                                            Customer,
                                            View,
                                            currentUser
                                          ) ? (
                                            <div className="d-flex justify-content-center flex-shrink-0 me-2">
                                              <button
                                                className="btn btn-primary"
                                                style={{ whiteSpace: 'nowrap' }}
                                                onClick={() => {
                                                  setKey(
                                                    listCustomers.scrollPosition,
                                                    window.scrollY.toString()
                                                  );
                                                  handleCustomerProfile(
                                                    customVal
                                                  );
                                                }}
                                              >
                                                {Customers.viewDetails}
                                              </button>
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                          {Method.hasPermission(
                                            Customer,
                                            Edit,
                                            currentUser
                                          ) ? (
                                            <div className="">
                                              <CustomSelectTable
                                                marginLeft={'-100px'}
                                                width="auto"
                                                placeholder={
                                                  <img
                                                    className="img-fluid"
                                                    width={22}
                                                    height={5}
                                                    src={ThreeDotMenu}
                                                    alt=""
                                                  />
                                                }
                                                // menuIsOpen={customVal._id === bannerId}
                                                // openMenuOnClick={() => {
                                                //   openMenuOnClick(customVal._id);
                                                // }}
                                                // onMenuOpen={() => {
                                                //   onMenuOpen(customVal._id);
                                                // }}
                                                backgroundColor="#transparent"
                                                // openMenuOnClick={true}
                                                options={options}
                                                onChange={(event: any) => {
                                                  handleOptionChange(
                                                    event,
                                                    customVal
                                                  );
                                                }}
                                              />
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={6}>
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
            {!fetchLoading ? (
              <>
                {customers.length ? (
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
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </>
  );
};
export default ViewCustomers;
