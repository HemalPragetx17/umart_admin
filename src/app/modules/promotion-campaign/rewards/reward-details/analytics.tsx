import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { KTSVG } from '../../../../../umart_admin/helpers';
import {
  Customers,
  PromotionAndCampaignString,
} from '../../../../../utils/string';
import Loader from '../../../../../Global/loader';
import {
  PAGE_LIMIT,
  Promotion,
  View,
  Customer,
} from '../../../../../utils/constants';
import CustomDatePicker from '../../../../custom/DateRange/DatePicker';
import CustomDateInput from '../../../../custom/Select/CustomDateInput';
import APICallService from '../../../../../api/apiCallService';
import { promotionCampaign } from '../../../../../api/apiEndPoints';
import Method from '../../../../../utils/methods';
import { IAnalytics } from '../../../../../types/responseIndex';
import Pagination from '../../../../../Global/pagination';
import { useDebounce } from '../../../../../utils/useDebounce';
import { getKey, removeKey, setKey } from '../../../../../Global/history';
import { listPromotionCampaign } from '../../../../../utils/storeString';
import { useAuth } from '../../../auth';
import PermissionModal from '../../../../modals/permission-moda';
const Analytics = (props: { id: string }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(
    getKey(listPromotionCampaign.rewardTabPage) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    getKey(listPromotionCampaign.limit) || PAGE_LIMIT
  );
  const [searchTerm, setSearchTerm] = useState(
    getKey(listPromotionCampaign.rewardTabSearch) || ''
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(listPromotionCampaign.rewardTabDateFilter)?.startDate
      ? new Date(getKey(listPromotionCampaign.rewardTabDateFilter).startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(listPromotionCampaign.rewardTabDateFilter)?.endDate
      ? new Date(getKey(listPromotionCampaign.rewardTabDateFilter)?.endDate)
      : null
  );
  const [analyticsData, setAnalyticsData] = useState<IAnalytics[]>([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      if (!props.id) {
        return window.history.back();
      }
      await fetchAnalytics(
        props.id,
        page,
        pageLimit,
        searchTerm,
        startDate,
        endDate
      );
    })();
  }, []);
  const fetchAnalytics = async (
    id: string,
    page: number,
    pageLimit: number,
    searchTerm: string = '',
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
      campaignType: 3,
      campaignRef: id,
    };
    if (fromDate && toDate) {
      params.fromDate = Method.convertDateToFormat(fromDate, 'YYYY-MM-DD');
      params.toDate = Method.convertDateToFormat(toDate, 'YYYY-MM-DD');
    }
    const apiCallService = new APICallService(
      promotionCampaign.getAnalytics,
      params,
      '',
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setAnalyticsData(response.records);
    }
    setLoading(false);
  };
  const debounce = useDebounce(fetchAnalytics, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    // const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setPage(1);
    setKey(listPromotionCampaign.rewardTabPage, 1);
    setSearchTerm(input);
    if (input.trim().length > 2 && searchTerm !== input) {
      await debounce(props.id, 1, pageLimit, input, startDate, endDate);
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      await debounce(props.id, 1, pageLimit, input, startDate, endDate);
    }
    setKey(listPromotionCampaign.rewardTabSearch, input);
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setPage(1);
    setKey(listPromotionCampaign.rewardTabPage, 1);
    if (event[0] && event[1]) {
      await fetchAnalytics(
        props.id,
        1,
        pageLimit,
        searchTerm,
        event[0],
        event[1]
      );
      setKey(listPromotionCampaign.rewardTabDateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      await fetchAnalytics(
        props.id,
        1,
        pageLimit,
        searchTerm,
        event[0],
        event[1]
      );
      removeKey(listPromotionCampaign.rewardTabDateFilter);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listPromotionCampaign.rewardTabPage, val);
    await fetchAnalytics(
      props.id,
      val,
      pageLimit,
      searchTerm,
      startDate,
      endDate
    );
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listPromotionCampaign.rewardTabPage, val + 1);
    await fetchAnalytics(
      props.id,
      val + 1,
      pageLimit,
      searchTerm,
      startDate,
      endDate
    );
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listPromotionCampaign.rewardTabPage, val - 1);
    await fetchAnalytics(
      props.id,
      val - 1,
      pageLimit,
      searchTerm,
      startDate,
      endDate
    );
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listPromotionCampaign.rewardTabPage, 1);
    setKey(listPromotionCampaign.limit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchAnalytics(
      props.id,
      1,
      event.target.value,
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
          moduleName="Customers"
        />
      ) : (
        <></>
      )}
      <Card className="bg-light border mb-7">
        <Card.Body className="px-7">
          <Row className="align-items-center g-lg-8 g-6 justify-content-between">
            <Col
              lg={5}
              md={5}
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
                  placeholder={'Search by customer name'}
                  value={searchTerm}
                  onChange={(event) =>
                    handleSearch(event.target.value.trimStart())
                  }
                />
              </div>
            </Col>
            {/* <Col
              lg={4}
              md={4}
              sm={12}
            >
              <div className="d-flex justify-content-center align-items-center">
                <CustomSelectWhite
                  className="w-100"
                  defaultValue={rewardUsesJson[0]}
                  isDisabled={loading}
                  options={rewardUsesJson}
                  onChange={(event: any) => {
                    // handleOrderTypeChange(event);
                  }}
                  isSearchable={false}
                  isMulti={false}
                />
              </div>
            </Col> */}
            <Col
              lg={5}
              md={5}
              sm={12}
            >
              <CustomDatePicker
                className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-md-288px min-w-225px"
                selected={startDate}
                onChange={handleDateFilter}
                selectsRange
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                showFullMonthYearPicker
                placeholder="Filter by dates"
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
        <Card.Body className="pt-3">
          <div className="table-responsive">
            <table className="table  table-rounded table-row-bordered align-middle gy-4 mb-0">
              <thead>
                <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-50px align-middle py-0">
                  <th className="min-w-300px">{'Customer name'}</th>
                  <th className="min-w-100px">
                    {PromotionAndCampaignString.rewardEarnedOn}
                  </th>
                  <th className="min-w-175px">
                    {PromotionAndCampaignString.totalEarnedCoins}
                  </th>
                  <th className="min-w-190px text-end"></th>
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
                    {analyticsData.length ? (
                      <>
                        {analyticsData.map((customVal, customIndex: number) => {
                          return (
                            <tr key={customVal._id}>
                              <td>
                                <div className="d-inline-flex align-items-center">
                                  <div className="symbol symbol-50px border border-r10px me-3">
                                    <img
                                      className="img-fluid border-r8px object-fit-contain"
                                      src={customVal?.customer?.image || ''}
                                      alt=""
                                    />
                                  </div>
                                  <span className="fs-15 fw-600 ms-3">
                                    {customVal?.customer?.name || ''}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="fs-15 fw-600 ms-3">
                                  {customVal._createdAt
                                    ? Method.convertDateToDDMMYYYY(
                                        customVal._createdAt
                                      )
                                    : '-'}
                                </span>
                              </td>
                              <td>
                                <span className="fs-15 fw-600">
                                  {customVal?.discountValue
                                    ? Method.formatCurrency(
                                        customVal.discountValue
                                      )
                                    : '0'}{' '}
                                  coins
                                </span>
                              </td>
                              <td>
                                <div className="d-flex justify-content-end flex-shrink-0">
                                  {Method.hasPermission(
                                    Promotion,
                                    View,
                                    currentUser
                                  ) ? (
                                    <button
                                      className="btn btn-primary"
                                      style={{ whiteSpace: 'nowrap' }}
                                      onClick={() => {
                                        if (
                                          Method.hasPermission(
                                            Customer,
                                            View,
                                            currentUser
                                          )
                                        ) {
                                          navigate(
                                            '/customers/customer-profile',
                                            {
                                              state: {
                                                _id: customVal.customer
                                                  .reference,
                                              },
                                            }
                                          );
                                        } else {
                                          setShowPermissionModal(true);
                                        }
                                      }}
                                    >
                                      {Customers.viewDetails}
                                    </button>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={5}>
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
          {totalRecords > 0 ? (
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
export default Analytics;
