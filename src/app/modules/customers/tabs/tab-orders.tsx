import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Customers, String } from '../../../../utils/string';
import { KTSVG } from '../../../../umart_admin/helpers';
import APICallService from '../../../../api/apiCallService';
import { buyer, product } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import {
  Customer,
  Order,
  OrderCancelled,
  OrderCash,
  OrderCoin,
  OrderTigoPesa,
  PAGE_LIMIT,
  View,
} from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import Pagination from '../../../../Global/pagination';
import { useAuth } from '../../auth';
import { useDebounce } from '../../../../utils/useDebounce';
import StartIcon from '../../../../umart_admin/assets/media/svg_uMart/star.svg';
import ReviewRatingsModal from '../../../modals/reivew-ratings';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import { success } from '../../../../Global/toast';
import { customerToast } from '../../../../utils/toast';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import {
  customerDetails,
  customerProfileOrderTab,
} from '../../../../utils/storeString';
import PermissionModal from '../../../modals/permission-moda';
const TabOrders = (props: any) => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(getKey(customerProfileOrderTab.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(customerProfileOrderTab.limit) || PAGE_LIMIT
  );
  const [searchTerm, setSearchTerm] = useState(
    getKey(customerProfileOrderTab.search) || ''
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(customerProfileOrderTab.dateFilter)?.startDate
      ? new Date(getKey(customerProfileOrderTab.dateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(customerProfileOrderTab.dateFilter)?.endDate
      ? new Date(getKey(customerProfileOrderTab.dateFilter)?.endDate)
      : null
  );
  const [recentOrders, setRecentOrders] = useState<any>([]);
  const [listType, setListType] = useState<any>(
    getKey(customerProfileOrderTab.orderStatusFilter) || 6
  );
  const { currentUser } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const orderFilerOptions = [
    {
      // value: AllProduct,
      name: 'All Orders ',
      value: 6,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">All Orders </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Order placed ',
      value: 1,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">Order placed </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Ready for dispatch',
      value: 2,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">
            Ready for dispatch{' '}
          </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Out for delivery',
      value: 3,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">
            Out for delivery{' '}
          </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Delivered',
      value: 4,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">Delivered </span>
        </>
      ),
    },
    {
      // value: AllProduct,
      name: 'Cancelled',
      value: 5,
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">Cancelled </span>
        </>
      ),
    },
  ];
  const [options, setOptions] = useState<any>(orderFilerOptions);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      await fetchRecentOrder(
        props.profileData?.user?._id,
        page,
        pageLimit,
        listType,
        searchTerm,
        startDate,
        endDate
      );
    })();
  }, []);
  const fetchRecentOrder = async (
    id: string,
    page: number,
    limit: number,
    listType: any,
    search?: string,
    startDate?: any,
    endDate?: any
  ) => {
    setLoading(true);
    const params: any = {
      pageNo: page,
      limit: limit,
      needCount: true,
      searchTerm: search ? search.trim() : '',
      sortKey: '_createdAt',
      sortOrder: -1,
      listType: listType,
      customerId: id,
    };
    if (startDate) {
      params.fromDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
    }
    if (endDate) {
      params.toDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    }
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
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setRecentOrders(response.orders);
    }
    setLoading(false);
  };
  const handleChange = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setLoading(true);
    setPage(1);
    setKey(customerProfileOrderTab.page, 1);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      await fetchRecentOrder(
        props.profileData.user._id,
        page,
        pageLimit,
        listType,
        searchTerm,
        startDateFormatted,
        endDateFormatted
      );
      setKey(customerProfileOrderTab.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      await fetchRecentOrder(
        props.profileData.user._id,
        page,
        pageLimit,
        listType,
        searchTerm,
        startDateFormatted,
        endDateFormatted
      );
      removeKey(customerProfileOrderTab.dateFilter);
    }
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setLoading(true);
    setPage(val);
    setKey(customerProfileOrderTab.page, val);
    await fetchRecentOrder(
      props.profileData.user._id,
      val,
      pageLimit,
      listType,
      searchTerm,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const handleNextPage = async (val: number) => {
    setLoading(true);
    setPage(val + 1);
    setKey(customerProfileOrderTab.page, val + 1);
    await fetchRecentOrder(
      props.profileData.user._id,
      val + 1,
      pageLimit,
      listType,
      searchTerm,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const handlePreviousPage = async (val: number) => {
    setLoading(true);
    setPage(val - 1);
    setKey(customerProfileOrderTab.page, val - 1);
    await fetchRecentOrder(
      props.profileData.user._id,
      val - 1,
      pageLimit,
      listType,
      searchTerm,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const handlePageLimit = async (event: any) => {
    setLoading(true);
    setPage(1);
    setKey(customerProfileOrderTab.page, 1);
    await setPageLimit(parseInt(event.target.value));
    setKey(customerProfileOrderTab.limit, parseInt(event.target.value));
    await fetchRecentOrder(
      props.profileData.user._id,
      1,
      parseInt(event.target.value),
      listType,
      searchTerm,
      startDate,
      endDate
    );
    setLoading(false);
  };
  const debounce = useDebounce(fetchRecentOrder, 400);
  const handleSearchTerm = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    const regex = /^(\w+( \w+)*)? ?$/;
    //const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearchTerm(input);
    if (input.trim().length > 2 && searchTerm !== input) {
      setPage(1);
      setKey(customerProfileOrderTab.page, 1);
      await debounce(
        props.profileData.user._id,
        1,
        pageLimit,
        listType,
        input,
        startDate,
        endDate
      );
      //await fetchProducts(1, pageLimit, productState, caTigories, input);
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      setPage(1);
      setKey(customerProfileOrderTab.page, 1);
      await debounce(
        props.profileData.user._id,
        1,
        pageLimit,
        listType,
        input,
        startDate,
        endDate
      );
      // await fetchProducts(1, pageLimit, productState, caTigories, input);
    }
    setKey(customerProfileOrderTab.search, input);
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    setPage(1);
    if (input.trim().length >= 3 && !isCtrlPressed) {
      await fetchRecentOrder(
        props.profileData.user._id,
        1,
        pageLimit,
        listType,
        input,
        startDate,
        endDate
      );
    } else if (
      input.trim().length <= 3 &&
      (charCode === 46 || charCode === 8)
    ) {
      await fetchRecentOrder(
        props.profileData.user._id,
        1,
        pageLimit,
        listType,
        input,
        startDate,
        endDate
      );
    } else if (isCtrlPressed && event.key === 'x') {
      await fetchRecentOrder(
        props.profileData.user._id,
        1,
        pageLimit,
        listType,
        input,
        startDate,
        endDate
      );
    }
  };
  const handleOrderTypeChange = async (event: any) => {
    setListType(event.value);
    setPage(1);
    setKey(customerProfileOrderTab.page, 1);
    await fetchRecentOrder(
      props.profileData.user._id,
      1,
      pageLimit,
      event.value,
      searchTerm,
      startDate,
      endDate
    );
    setKey(customerProfileOrderTab.orderStatusFilter, event.value);
  };
  const openDeleteModal = () => {
    setShowRatingModal(false);
    setShowDeleteModal(true);
  };
  const openActivateModal = () => {
    setShowRatingModal(false);
    setShowActivateModal(true);
  };
  const handleHideReview = async () => {
    const params = {
      activate: !currentOrder?.rating?.active ? 'true' : 'false',
    };
    const apiCallService = new APICallService(
      product.updateRatingStatus,
      params,
      { id: currentOrder?._id }
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const message = !currentOrder?.rating?.active
        ? customerToast.reviewShows
        : customerToast.reviewHides;
      success(message);
      setShowActivateModal(false);
      await fetchRecentOrder(
        props.profileData.user._id,
        page,
        pageLimit,
        listType,
        searchTerm,
        startDate,
        endDate
      );
    }
  };
  const handleDeleteReview = async () => {
    const apiService = new APICallService(
      product.deleteProductRating,
      currentOrder?._id
    );
    const response = await apiService.callAPI();
    if (response) {
      success(customerToast.reviewDeleted);
      setShowDeleteModal(false);
      await fetchRecentOrder(
        props.profileData.user._id,
        page,
        pageLimit,
        listType,
        searchTerm,
        startDate,
        endDate
      );
    }
  };
  const handleRatingModalClose = async () => {
    setShowRatingModal(false);
    await fetchRecentOrder(
      props.profileData?.user?._id,
      page,
      pageLimit,
      listType,
      searchTerm,
      startDate,
      endDate
    );
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
      {showRatingModal ? (
        <ReviewRatingsModal
          show={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          title="Ratings & Review"
          openDeleteModal={openDeleteModal}
          openActivateModal={openActivateModal}
          data={currentOrder}
          onClose={handleRatingModalClose}
        />
      ) : (
        <></>
      )}
      {showDeleteModal ? (
        <CustomDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          title="Are you sure you want to delete this review?"
          btnTitle="Yes,Delete"
          handleDelete={handleDeleteReview}
        />
      ) : (
        <></>
      )}
      {showActivateModal && currentOrder ? (
        <CustomDeleteModal
          show={showActivateModal}
          onHide={() => setShowActivateModal(false)}
          title={`Are you sure you want to ${
            currentOrder?.rating?.active ? 'hide' : 'show'
          } this review?`}
          btnTitle={`Yes,${currentOrder?.rating?.active ? ' Hide' : ' Show'} `}
          handleDelete={handleHideReview}
        />
      ) : (
        <></>
      )}
      <Card className="bg-light border mb-7">
        <Card.Body className="px-7">
          <Row className="align-items-center g-lg-8 g-6">
            <Col
              lg={4}
              md={4}
              sm={12}
            >
              <div className="d-flex align-items-center position-relative">
                <KTSVG
                  path="/media/icons/duotune/general/gen021.svg"
                  className="svg-icon-3 position-absolute ms-3"
                />
                <input
                  type="text"
                  id="kt_filter_search"
                  className="form-control form-control-white form-control-lg min-h-60px ps-10"
                  placeholder={Customers.searchOrder}
                  value={searchTerm}
                  onChange={(event: any) =>
                    handleSearchTerm(event.target.value)
                  }
                  // onKeyUp={handleOnKeyUp}
                />
              </div>
            </Col>
            <Col
              lg={4}
              md={4}
              sm={12}
            >
              <div className="d-flex justify-content-center align-items-center">
                <CustomSelectWhite
                  className="w-100"
                  defaultValue={[
                    {
                      // value: AllProduct,
                      name: 'All Orders ',
                      value: 6,
                      label: (
                        <>
                          <span className="fs-16 fw-600 text-black mb-0">
                            All Orders{' '}
                          </span>
                        </>
                      ),
                    },
                  ]}
                  isDisabled={loading}
                  options={orderFilerOptions}
                  value={orderFilerOptions.find(
                    (item) => item.value == listType
                  )}
                  onChange={(event: any) => {
                    handleOrderTypeChange(event);
                  }}
                  isSearchable={false}
                  isMulti={false}
                />
              </div>
            </Col>
            <Col
              lg={4}
              md={4}
              sm={12}
            >
              <DatePicker
                className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-md-288px min-w-225px"
                selected={startDate}
                onChange={handleChange}
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
      <Card className="border border-custom-color mb-7">
        <Card.Body className="pt-6">
          <div className="table-responsive">
            <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
              <thead>
                <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                  <th className="min-w-215px">{Customers.orderDate}</th>
                  <th className="min-w-150px">{Customers.totalUnits}</th>
                  <th className="min-w-175px">{Customers.totalValue}</th>
                  <th className="min-w-150px">{Customers.modePayment}</th>
                  <th className="min-w-100px text-start">
                    {Customers.ratings}
                  </th>
                  <th className="min-w-125px"></th>
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
                                            {customVal.payment?.transactions[0]
                                              ?.paymentMethod === OrderCash
                                              ? customVal.routesUsers[0]
                                                  .paymentCollection.payment
                                                  .usedWalletCoin === 0
                                                ? 'Cash'
                                                : 'Cash with coin'
                                              : ''}
                                            {customVal.payment?.transactions[0]
                                              ?.paymentMethod === OrderTigoPesa
                                              ? customVal.routesUsers[0]
                                                  .paymentCollection.payment
                                                  .usedWalletCoin === 0
                                                ? ' Online'
                                                : 'Online with coin'
                                              : ''}
                                          </>
                                        ) : (
                                          <>
                                            {customVal.routesUsers.length &&
                                            customVal.routesUsers[0]
                                              .paymentCollection.payment
                                              .paymentMode === OrderCash
                                              ? customVal.routesUsers[0]
                                                  .paymentCollection.payment
                                                  .usedWalletCoin === 0
                                                ? 'Cash'
                                                : 'Cash with coin'
                                              : ''}
                                            {customVal.routesUsers.length &&
                                            customVal.routesUsers[0]
                                              .paymentCollection.payment
                                              .paymentMode === OrderTigoPesa
                                              ? customVal.routesUsers[0]
                                                  .paymentCollection.payment
                                                  .usedWalletCoin === 0
                                                ? 'Online'
                                                : 'Online with coin'
                                              : ''}
                                            {customVal.routesUsers.length &&
                                            customVal.routesUsers[0]
                                              .paymentCollection.payment
                                              .paymentMode === OrderCoin
                                              ? 'Coin'
                                              : ''}
                                          </>
                                        )}
                                      </>
                                    ) : customVal.status !== OrderCancelled &&
                                     ( customVal?.instantOrder ||
                                      customVal?.selfPickedUp ||
                                      customVal?.scheduleOrder ||
                                      customVal?.orderOnNotWorkingHours )? (
                                      customVal?.payment?.paymentMode === 
                                      OrderCash ? (
                                        customVal?.payment?.usedWalletCoin ===
                                        0 ? (
                                          'Cash'
                                        ) : (
                                          'Cash with coin'
                                        )
                                      ) : customVal?.payment?.usedWalletCoin ===
                                        0 ? (
                                        'Online'
                                      ) : (
                                        'Online with coin'
                                      )
                                    ) : (
                                      'Failed'
                                    )}
                                  </span>
                                </td>
                                <td className="text-start justify-content-between align-items-center">
                                  {customVal?.rating?.rate &&
                                  !customVal?.rating?.deleted ? (
                                    <div className="rating">
                                      <div
                                        className="fs-4 fw-500 text-decoration-underline cursor-pointer me-1"
                                        onClick={() => {
                                          setCurrentOrder(customVal);
                                          setShowRatingModal(true);
                                        }}
                                      >
                                        {customVal?.rating?.rate + '.0'}
                                      </div>
                                      <div className="rating-label checked">
                                        <KTSVG
                                          path={StartIcon}
                                          className="svg-icon svg-icon-1 w-30px h-40px"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="fs-20 fw-600 ">-</span>
                                  )}
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
                                            '3'
                                          );
                                          navigate('/orders/order-details', {
                                            state: customVal,
                                          });
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
      {!loading ? (
        <>
          {recentOrders.length ? (
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
export default TabOrders;
