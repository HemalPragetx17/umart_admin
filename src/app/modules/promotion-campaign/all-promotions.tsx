import { Card, Col, FormLabel, Row } from 'react-bootstrap';
import { CustomSelectGreen } from '../../custom/Select/CustomSelectGreen';
import {
  DeliverString,
  PromotionAndCampaignString,
} from '../../../utils/string';
import { Link, useNavigate } from 'react-router-dom';
import { KTSVG } from '../../../umart_admin/helpers';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import {
  Add,
  Delete,
  Edit,
  PAGE_LIMIT,
  Promotion,
  View,
} from '../../../utils/constants';
import CustomDatePicker from '../../custom/DateRange/DatePicker';
import { promotionTypeJSON } from '../../../utils/staticJSON';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import Loader from '../../../Global/loader';
import { useEffect, useState } from 'react';
import CustomDeleteModal from '../../modals/custom-delete-modal';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { promotionCampaign } from '../../../api/apiEndPoints';
import APICallService from '../../../api/apiCallService';
import { IOption, IPromotionCampaign } from '../../../types/responseIndex';
import Method from '../../../utils/methods';
import Pagination from '../../../Global/pagination';
import { useDebounce } from '../../../utils/useDebounce';
import { success } from '../../../Global/toast';
import { promotionCampaignToast } from '../../../utils/toast';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { listPromotionCampaign } from '../../../utils/storeString';
import { useAuth } from '../auth';
const placement = ['Discount promotion', 'Coupon promotion', 'Rewards'];
const statusOptions = [
  {
    value: '1',
    label: 'All',
    title: 'All',
  },
  ,
  {
    value: '2',
    label: 'Active',
    title: 'Active',
  },
  {
    value: '3',
    label: 'Deactivated',
    title: 'Deactivated',
  },
  {
    value: '4',
    label: 'Deleted',
    title: 'Deleted',
  },
];
const promotionObj = {
  discount: 'Discount promotion',
  coupon: 'Coupon promotion',
  reward: 'Rewards',
};
const AllPromotions = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [promotionList, setPromotionList] = useState<IPromotionCampaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [currenPromotion, setCurrentPromotion] = useState<IPromotionCampaign>();
  const [page, setPage] = useState(getKey(listPromotionCampaign.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listPromotionCampaign.limit) || PAGE_LIMIT
  );
  const [searchTerm, setSearchTerm] = useState(
    getKey(listPromotionCampaign.search) || ''
  );
  const [status, setStatus] = useState<IOption>(
    getKey(listPromotionCampaign.statusFilter) || {
      value: '1',
      label: 'All',
      title: 'All',
    }
  );
  const [promotionType, setPromotionType] = useState<IOption>(
    getKey(listPromotionCampaign.promotionFilter) || promotionTypeJSON[0]
  );
  const [startDate, setStartDate] = useState<Date | null>(
    getKey(listPromotionCampaign.dateFilter)?.startDate
      ? new Date(getKey(listPromotionCampaign.dateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    getKey(listPromotionCampaign.dateFilter)?.endDate
      ? new Date(getKey(listPromotionCampaign.dateFilter)?.endDate)
      : null
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [currIndex, setCurrentIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(Promotion, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchPromotionList(
        page,
        pageLimit,
        searchTerm,
        status.value,
        promotionType?.value,
        startDate,
        endDate
      );
      removeKey('promotion-details');
      removeKey(listPromotionCampaign.rewardTabLimit);
      removeKey(listPromotionCampaign.rewardTabPage);
      removeKey(listPromotionCampaign.rewardDetailsTab);
      removeKey(listPromotionCampaign.rewardTabSearch);
      removeKey(listPromotionCampaign.rewardTabDateFilter);
      removeKey('promotion-coupon-details');
      removeKey(listPromotionCampaign.couponDetailsTab);
      removeKey(listPromotionCampaign.couponTabFilter);
      removeKey(listPromotionCampaign.couponTabPage);
      removeKey(listPromotionCampaign.couponTabLimit);
    })();
  }, []);
  const fetchPromotionList = async (
    page: number,
    pageLimit: number,
    searchTerm: string = '',
    state: string = '1',
    promotionType: string = '0',
    fromDate?: any,
    toDate?: any
  ) => {
    setLoading(true);
    let params: any = {
      pageNo: page,
      limit: pageLimit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      searchTerm: searchTerm || '',
      state: state,
      promotionType: promotionType,
    };
    if (fromDate && toDate) {
      params = {
        ...params,
        fromDate: Method.convertDateToFormat(fromDate, 'YYYY-MM-DD'),
        toDate: Method.convertDateToFormat(toDate, 'YYYY-MM-DD'),
      };
    }
    const apiCallService = new APICallService(
      promotionCampaign.listPromotions,
      params,
      '',
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setTotalRecords(response.total);
      setPromotionList(response.records);
    }
    setLoading(false);
    setTimeout(() => {
      const pos = getKey(listPromotionCampaign.scrollPosition);
      window.scrollTo(0, pos);
    }, 700);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Promotion, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(Promotion, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-danger ms-3 p-4  ">
            Delete details
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const debounce = useDebounce(fetchPromotionList, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    // const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearchTerm(input);
    setPage(1);
    setKey(listPromotionCampaign.page, 1);
    if (input.trim().length > 2 && searchTerm !== input) {
      await debounce(
        1,
        pageLimit,
        input,
        status.value,
        promotionType?.value,
        startDate,
        endDate
      );
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      await debounce(
        1,
        pageLimit,
        input,
        status.value,
        promotionType?.value,
        startDate,
        endDate
      );
    }
    setKey(listPromotionCampaign.search, input);
  };
  const handleOptionChange = (event: any, data: IPromotionCampaign) => {
    if (event.value === 1) {
      setKey(listPromotionCampaign.scrollPosition, window.scrollY.toString());
      if (data.type === 'discount') {
        navigate('/promotion-campaign/edit-discount-promotions', {
          state: data,
        });
      } else if (data.type === 'reward') {
        navigate('/promotion-campaign/edit-reward', { state: data });
      } else {
        navigate('/promotion-campaign/edit-coupon-promotion', {
          state: data,
        });
      }
    } else if (event.value === 2) {
      setCurrentPromotion(data);
      setShowModal(true);
    }
  };
  const handleDetails = (event: IPromotionCampaign) => {
    setKey(listPromotionCampaign.scrollPosition, window.scrollY.toString());
    if (event.type === 'discount') {
      navigate('/promotion-campaign/discount-promotions-details', {
        state: event,
      });
    } else if (event.type === 'reward') {
      navigate('/promotion-campaign/reward-details', {
        state: event,
      });
    } else {
      navigate('/promotion-campaign/coupon-promotions-details', {
        state: event,
      });
    }
  };
  const handleModalClose = () => {
    setCurrentPromotion(undefined);
    setShowModal(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listPromotionCampaign.page, val);
    await fetchPromotionList(
      val,
      pageLimit,
      searchTerm,
      status?.value,
      promotionType?.value,
      startDate,
      endDate
    );
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listPromotionCampaign.page, val + 1);
    await fetchPromotionList(
      val + 1,
      pageLimit,
      searchTerm,
      status?.value,
      promotionType?.value,
      startDate,
      endDate
    );
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listPromotionCampaign.page, val - 1);
    await fetchPromotionList(
      val - 1,
      pageLimit,
      searchTerm,
      status?.value,
      promotionType?.value,
      startDate,
      endDate
    );
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listPromotionCampaign.page, 1);
    setKey(listPromotionCampaign.limit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchPromotionList(
      1,
      event.target.value,
      searchTerm,
      status?.value,
      promotionType?.value,
      startDate,
      endDate
    );
  };
  const handleStatusChange = async (event: IOption) => {
    setStatus(event);
    setPage(1);
    setKey(listPromotionCampaign.page, 1);
    await fetchPromotionList(
      1,
      pageLimit,
      searchTerm,
      event.value,
      promotionType?.value,
      startDate,
      endDate
    );
    setKey(listPromotionCampaign.statusFilter, event);
  };
  const handlePromotionType = async (event: IOption) => {
    setPromotionType(event);
    setPage(1);
    setKey(listPromotionCampaign.page, 1);
    await fetchPromotionList(
      1,
      pageLimit,
      searchTerm,
      status.value,
      event.value,
      startDate,
      endDate
    );
    setKey(listPromotionCampaign.promotionFilter, event);
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setPage(1);
    setKey(listPromotionCampaign.page, 1);
    if (event[0] && event[1]) {
      await fetchPromotionList(
        1,
        pageLimit,
        searchTerm,
        status.value,
        promotionType?.value,
        event[0],
        event[1]
      );
      setKey(listPromotionCampaign.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      await fetchPromotionList(
        1,
        pageLimit,
        searchTerm,
        status.value,
        promotionType?.value
      );
      removeKey(listPromotionCampaign.dateFilter);
    }
  };
  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    setCurrentPromotion(undefined);
    setCurrentIndex(-1);
    setErrorMsg('');
  };
  const handleUpdateStatus = async (
    event: IPromotionCampaign,
    index: number
  ) => {
    setCurrentPromotion(event);
    const params = {
      activate: !event.active,
    };
    const apiCallService = new APICallService(
      promotionCampaign.updatePromotionStatus,
      params,
      {
        id: event._id,
      },
      null,
      true,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response && !response.error) {
      if (event.active) {
        success(promotionCampaignToast.campaignDeactivated);
      } else {
        success(promotionCampaignToast.campaignActivated);
      }
      const temp = [...promotionList];
      temp[index].active = !event.active;
      setPromotionList(temp);
      handleStatusModalClose();
    } else if (response && response.error) {
      setErrorMsg(response.error);
    }
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      promotionCampaign.deletePromotion,
      {},
      { id: currenPromotion?._id },
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(promotionCampaignToast.promotionDeleted);
      handleModalClose();
      await fetchPromotionList(
        page,
        pageLimit,
        searchTerm,
        status?.value,
        promotionType?.value,
        startDate,
        endDate
      );
    }
  };
  const handleChange = (event: any) => {
    if (event.value === '0') {
      navigate('/promotion-campaign/add-discount-promotion');
    }
    if (event.value === '1') {
      navigate('/promotion-campaign/add-coupon-promotion');
    }
    if (event.value === '2') {
      navigate('/promotion-campaign/add-reward');
    }
  };
  return (
    <>
      {showStatusModal && currenPromotion && currIndex !== -1 ? (
        <CustomDeleteModal
          show={showStatusModal}
          onHide={handleStatusModalClose}
          title={`Are you sure you want to ${
            !currenPromotion.active ? 'activate' : 'deactivate'
          }
this promotion campaign?`}
          btnTitle={`Yes, ${
            !currenPromotion.active ? 'Activate' : 'Deactivate'
          }`}
          handleDelete={() => handleUpdateStatus(currenPromotion, currIndex)}
          error={errorMsg}
        />
      ) : (
        <></>
      )}
      {currenPromotion && showModal ? (
        <CustomDeleteModal
          show={showModal}
          onHide={handleModalClose}
          title={`Are you sure you want to delete this ${
            promotionObj[currenPromotion.type]
          } promotion?`}
          btnTitle="Yes, Delete"
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center my-6"
        >
          <h1 className="fs-22 fw-bolder mb-0">{'Promotion & Campaign'}</h1>
        </Col>
        <Col sm="auto">
          {Method.hasPermission(Promotion, Add, currentUser) ? (
            <div className="border border-r10px w-fit-content text-white cursor-pointer">
              <CustomSelectGreen
                minHeight={'50px'}
                marginLeft={'-150px'}
                isSearchable={false}
                placeholder={
                  <>
                    <span className="fs-16 fw-bolder text-white ps-3">
                      {PromotionAndCampaignString.addPromotion}
                    </span>
                  </>
                }
                default={{
                  value: 'AddPrimaryCategoryDefault',
                  name: 'AddPrimaryCategoryDefault',
                  label: (
                    <>
                      <div className="fs-16 fw-600 ">
                        {PromotionAndCampaignString.discountPromotion}
                      </div>
                    </>
                  ),
                }}
                options={[
                  {
                    value: '0',
                    name: 'Add discount promotion',
                    label: (
                      <>
                        <div className="fs-14 text-active-white text-black cursor-pointer">
                          <span>
                            {PromotionAndCampaignString.discountPromotion}
                          </span>
                        </div>
                      </>
                    ),
                  },
                  {
                    value: '1',
                    name: 'Add coupon promotion',
                    label: (
                      <>
                        <div className="fs-14 text-active-white text-black cursor-pointer">
                          <span>
                            {PromotionAndCampaignString.couponPromotion}
                          </span>
                        </div>
                      </>
                    ),
                  },
                  {
                    value: '2',
                    name: 'Add reward',
                    label: (
                      <>
                        <div className="fs-14 text-active-white text-black cursor-pointer">
                          <span>{PromotionAndCampaignString.rewards}</span>
                        </div>
                      </>
                    ),
                  },
                ]}
                isMulti={false}
                onChange={handleChange}
              />
            </div>
          ) : (
            <></>
          )}
        </Col>
        <Col
          xs={12}
          className="mt-5"
        >
          <Card className="bg-light border mb-7">
            <Card.Body className="px-7">
              <Row className="align-items-center g-5">
                <Col
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <FormLabel className="fs-16 fw-500 text-dark">
                    {'Search'}
                  </FormLabel>
                  <div className="d-flex align-items-center position-relative me-lg-4">
                    <KTSVG
                      path="/media/icons/duotune/general/gen021.svg"
                      className="svg-icon-3 position-absolute ms-3"
                    />
                    <input
                      type="text"
                      id="kt_filter_search"
                      className="form-control form-control-white min-h-60px form-control-lg ps-10 custom-placeholder"
                      placeholder="Search by promotion title"
                      onChange={(event: any) => {
                        handleSearch(event.target.value.trimStart());
                      }}
                      value={searchTerm}
                    />
                  </div>
                </Col>
                <Col
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <FormLabel className="fs-16 fw-500 text-dark">
                    {PromotionAndCampaignString.filterByPromotion}
                  </FormLabel>
                  <CustomSelectWhite
                    // disabled={loading}
                    // isLoading={fetchLoader}
                    options={promotionTypeJSON}
                    defaultValue={promotionTypeJSON[0]}
                    loadingMessage={'Fetching Data'}
                    isMulti={false}
                    onChange={(event: IOption) => {
                      handlePromotionType(event);
                    }}
                    placeholder="Filter by placement type"
                    value={promotionType}
                  />
                </Col>
                <Col
                  md={4}
                  lg={4}
                  xl={3}
                >
                  {
                    <>
                      {' '}
                      <FormLabel className="fs-16 fw-500 text-dark">
                        {'Filter by status'}
                      </FormLabel>
                      <CustomSelectWhite
                        placeholder={'Select product status'}
                        options={statusOptions}
                        defaultValue={statusOptions[0]}
                        onChange={(event: IOption) => {
                          handleStatusChange(event);
                        }}
                        isSearchable={false}
                        value={status}
                        // isClearable={Object.keys(productState).length}
                      />
                    </>
                  }
                </Col>
                <Col
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <FormLabel className="fs-16 fw-500 text-dark">
                    {PromotionAndCampaignString.filterByEndDates}
                  </FormLabel>
                  <CustomDatePicker
                    className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-md-288px min-w-225px border-1 border-gray-300"
                    selected={startDate}
                    onChange={handleDateFilter}
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    showFullMonthYearPicker
                    placeholder="DD/MM/YYYY"
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
        </Col>
        <Col lg={12}>
          <>
            <Card className="border border-r10px ">
              <Card.Body className=" pb-0 pt-0">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-50px align-middle">
                        <th className="min-w-125px">
                          {PromotionAndCampaignString.promotionBanner}
                        </th>
                        <th className="min-w-160px">
                          {PromotionAndCampaignString.promotionTitle}
                        </th>
                        <th className="min-w-100px ">
                          {PromotionAndCampaignString.promotionType}
                        </th>
                        <th className="min-w-120px">
                          {PromotionAndCampaignString.endDate}
                        </th>
                        <th className="min-w-165px">
                          {PromotionAndCampaignString.activate} /<br />{' '}
                          {PromotionAndCampaignString.deactivate}
                        </th>
                        <th className="min-w-225px ps-14">
                          {PromotionAndCampaignString.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <>
                          <td colSpan={6}>
                            <div className="w-100 d-flex justify-content-center">
                              <Loader loading={loading} />
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {promotionList.length ? (
                            <>
                              {promotionList.map(
                                (customVal, customIndex: number) => {
                                  return (
                                    <tr key={customVal._id}>
                                      <td className="py-2">
                                        <>
                                          <div className="symbol symbol-50px border border-r10px m .symbol-2by3 bgi-contain">
                                            <div
                                              className="symbol-label bgi-cover w-90px"
                                              style={{
                                                backgroundImage: `url('${
                                                  customVal?.image || ''
                                                }')`,
                                              }}
                                            ></div>
                                          </div>
                                        </>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-600">
                                          {customVal?.title}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center align-items-center w-fit-content bg-gray-100 py-3  pills-radius me-1 px-3">
                                          <span className="fw-600 text-black fs-16 text-center">
                                            {promotionObj[customVal.type]}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-600">
                                          {Method.convertDateToDDMMYYYY(
                                            customVal?.endDate
                                          ) || '-'}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center">
                                          {customVal.deleted ? (
                                            <span className="text-danger fs-16 fw-500">
                                              Deleted
                                            </span>
                                          ) : (
                                            <label className="form-check form-switch form-check-custom form-check-solid ">
                                              <input
                                                className="form-check-input form-check-success w-50px h-30px "
                                                type="checkbox"
                                                name="notifications"
                                                checked={customVal.active}
                                                disabled={
                                                  !Method.hasPermission(
                                                    Promotion,
                                                    Edit,
                                                    currentUser
                                                  )
                                                }
                                                onChange={() => {
                                                  setShowStatusModal(true);
                                                  setCurrentIndex(customIndex);
                                                  setCurrentPromotion(
                                                    customVal
                                                  );
                                                  setErrorMsg('');
                                                }}
                                              />
                                            </label>
                                          )}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex flex-nowrap justify-content-end justify-content-xl-center align-items-center">
                                          {Method.hasPermission(
                                            Promotion,
                                            View,
                                            currentUser
                                          ) ? (
                                            <button
                                              className="btn btn-primary fs-14 fw-600 me-5"
                                              style={{
                                                whiteSpace: 'nowrap',
                                              }}
                                              onClick={() => {
                                                handleDetails(customVal);
                                              }}
                                            >
                                              {DeliverString.viewDetails}
                                            </button>
                                          ) : (
                                            <></>
                                          )}
                                          {Method.hasPermission(
                                            Promotion,
                                            Edit,
                                            currentUser
                                          ) ||
                                          Method.hasPermission(
                                            Promotion,
                                            Delete,
                                            currentUser
                                          ) ? (
                                            <div
                                              className={`${
                                                customVal.deleted
                                                  ? 'invisible'
                                                  : ''
                                              }`}
                                            >
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
                                                backgroundColor="transparent"
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
                                  No Data Found
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
            {!loading && totalRecords > 0 ? (
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
        </Col>
      </Row>
    </>
  );
};
export default AllPromotions;
