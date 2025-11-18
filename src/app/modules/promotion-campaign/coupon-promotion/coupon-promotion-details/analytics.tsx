import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Customers,
  PromotionAndCampaignString,
} from '../../../../../utils/string';
import Loader from '../../../../../Global/loader';
import { useAuth } from '../../../auth';
import {
  Customer,
  PAGE_LIMIT,
  Promotion,
  View,
} from '../../../../../utils/constants';
import { rewardAnalyticsJson } from '../../../../../utils/dummyJSON';
import { IAnalytics } from '../../../../../types/responseIndex';
import Method from '../../../../../utils/methods';
import APICallService from '../../../../../api/apiCallService';
import { promotionCampaign } from '../../../../../api/apiEndPoints';
import { useDebounce } from '../../../../../utils/useDebounce';
import Pagination from '../../../../../Global/pagination';
import { CustomSelectWhite } from '../../../../custom/Select/CustomSelectWhite';
import { rewardUsesJson } from '../../../../../utils/staticJSON';
import { getKey, setKey } from '../../../../../Global/history';
import { listPromotionCampaign } from '../../../../../utils/storeString';
import PermissionModal from '../../../../modals/permission-moda';
const rewardStatus = ['Partially redeemed', 'Fully redeemed', 'Not redeemed'];
const Analytics = (props: { id: string }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(
    getKey(listPromotionCampaign.couponTabPage) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    getKey(listPromotionCampaign.couponTabLimit) || PAGE_LIMIT
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<IAnalytics[]>([]);
  const [selectedRedemption, setSelectedRedemption] = useState(
    getKey(listPromotionCampaign.couponTabFilter) || 1
  );
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
        endDate,
        selectedRedemption
      );
    })();
  }, []);
  const fetchAnalytics = async (
    id: string,
    page: number,
    pageLimit: number,
    searchTerm: string = '',
    fromDate?: any,
    toDate?: any,
    redeemedType: number = 1
  ) => {
    setLoading(true);
    let params: any = {
      pageNo: page,
      limit: pageLimit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: page === 1,
      searchTerm: searchTerm || '',
      campaignType: 2,
      campaignRef: id,
      redemptionType: redeemedType,
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
    setSearchTerm(input);
    setPage(1);
    setKey(listPromotionCampaign.couponTabPage, 1);
    if (input.trim().length > 2 && searchTerm !== input) {
      await debounce(props.id, 1, pageLimit, input, startDate, endDate);
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      await debounce(props.id, 1, pageLimit, input, startDate, endDate);
    }
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setPage(1);
    if (event[0] && event[1]) {
      await fetchAnalytics(
        props.id,
        1,
        pageLimit,
        searchTerm,
        event[0],
        event[1]
      );
    } else if (event[0] === null && event[1] === null) {
      await fetchAnalytics(
        props.id,
        1,
        pageLimit,
        searchTerm,
        event[0],
        event[1]
      );
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listPromotionCampaign.couponTabPage, val);
    await fetchAnalytics(
      props.id,
      val,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      selectedRedemption
    );
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listPromotionCampaign.couponTabPage, val + 1);
    await fetchAnalytics(
      props.id,
      val + 1,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      selectedRedemption
    );
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listPromotionCampaign.couponTabPage, val - 1);
    await fetchAnalytics(
      props.id,
      val - 1,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      selectedRedemption
    );
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listPromotionCampaign.couponTabPage, 1);
    setKey(listPromotionCampaign.couponTabLimit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchAnalytics(
      props.id,
      1,
      event.target.value,
      searchTerm,
      startDate,
      endDate,
      selectedRedemption
    );
  };
  const handleFilterChange = async (event: any) => {
    setPage(1);
    setKey(listPromotionCampaign.couponTabPage, 1);
    setSelectedRedemption(event.value);
    setKey(listPromotionCampaign.couponTabFilter, event.value);
    await fetchAnalytics(
      props.id,
      1,
      pageLimit,
      searchTerm,
      startDate,
      endDate,
      event.value
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
      <Row>
        <Col
          md={4}
          className="ms-auto mb-3"
        >
          <div className="d-flex justify-content-center align-items-center">
            <CustomSelectWhite
              className="w-100"
              defaultValue={rewardUsesJson[0]}
              value={
                rewardUsesJson.find(
                  (item) => item.value == selectedRedemption
                ) || null
              }
              isDisabled={loading}
              options={rewardUsesJson}
              onChange={(event: any) => {
                handleFilterChange(event);
              }}
              isSearchable={false}
              isMulti={false}
            />
          </div>
        </Col>
        <Col xs={12}>
          <Card className="border border-custom-color mb-7">
            <Card.Body className="pt-3">
              <div className="table-responsive">
                <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                  <thead>
                    <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-50px align-middle">
                      <th className="min-w-200px">Customer name</th>
                      <th className="min-w-175px">
                        {PromotionAndCampaignString.redemptionUses}
                      </th>
                      <th className="min-w-150px">{'Status'}</th>
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
                        {analyticsData.length ? (
                          <>
                            {analyticsData.map(
                              (customVal, customIndex: number) => {
                                return (
                                  <tr key={customVal._id}>
                                    <td>
                                      <div className="d-inline-flex align-items-center">
                                        <div className="symbol symbol-45px border border-r10px me-3">
                                          <img
                                            className="img-fluid border-r8px object-fit-contain"
                                            src={
                                              customVal?.customer?.image || ''
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <span className="fs-15 fw-600 ms-3">
                                          {customVal?.customer?.name || ''}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="fs-15 fw-600">
                                        {`${customVal.totalRedemptions}/${customVal.redemptionLimit} times`}
                                      </span>
                                    </td>
                                    <td className="fs-15 fw-600">
                                      <span className="badge badge-light custom-badge py-4">
                                        {customVal.redemptionLimit ===
                                        customVal.totalRedemptions
                                          ? 'Fully redeemed'
                                          : 'Partially redeemed'}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-center flex-shrink-0">
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
                              }
                            )}
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
        </Col>
      </Row>
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
