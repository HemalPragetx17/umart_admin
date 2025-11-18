import { Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../../Global/loader';
import { reviewJson } from '../../../../utils/dummyJSON';
import { useEffect, useState } from 'react';
import { KTSVG } from '../../../../umart_admin/helpers';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import StarIcon from '../../../../umart_admin/assets/media/svg_uMart/star.svg';
import StarEmptyIcon from '../../../../umart_admin/assets/media/svg_uMart/empty-star.svg';
import HalfStarIcon from '../../../../umart_admin/assets/media/svg_uMart/star-half.svg';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import { useNavigate } from 'react-router-dom';
import APICallService from '../../../../api/apiCallService';
import { success } from '../../../../Global/toast';
import { customerToast } from '../../../../utils/toast';
import BlankImg from '../../../../umart_admin/assets/media/avatars/blank.png';
import {
  Customer,
  Delete,
  Edit,
  PAGE_LIMIT,
  Product,
  View,
} from '../../../../utils/constants';
import { reviewAndRatings } from '../../../../api/apiEndPoints';
import Method from '../../../../utils/methods';
import Pagination from '../../../../Global/pagination';
import { getKey, setKey } from '../../../../Global/history';
import { productDetailsStore } from '../../../../utils/storeString';
import { useAuth } from '../../auth';
const TabRatingReview = (props: any) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reviewList, setReviewList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isHideOption, setIsHideOptions] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [currentRating, setCurrentRating] = useState<any>();
  const [page, setPage] = useState(getKey(productDetailsStore.ratingPage) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(productDetailsStore.ratingLimit) || PAGE_LIMIT
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      updateOptionWithPermission();
      await fetchReviewList(page, pageLimit);
      setLoading(false);
    })();
  }, []);
  const fetchReviewList = async (pageNo: number, limit: number) => {
    const params = {
      pageNo,
      limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      variantId: props?.productDetails?._id || '',
    };
    setLoading(true);
    const apiService = new APICallService(
      reviewAndRatings.reviewList,
      params,
      '',
      '',
      false,
      '',
      Product
    );
    const response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setReviewList(response.records);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Customer, View, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
            View profile
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(Customer, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
            Hide this review
          </button>
        ),
        value: 2,
      });
    }
    if (Method.hasPermission(Customer, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4 ">
            Delete this review
          </button>
        ),
        value: 3,
      });
    }
    setOptions(tempOptions);
  };
  const renderRatings = (rating: any) => {
    const intValue = rating.toString().split('.')[0];
    let pointValue = rating.toString().split('.')[1];
    const ratingsElement: any = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= intValue) {
        ratingsElement.push(
          <div
            className="rating-label checked"
            key={i}
          >
            <KTSVG
              path={StarIcon}
              className="svg-icon svg-icon-1 w-30px h-40px"
            />
          </div>
        );
      } else if (pointValue) {
        ratingsElement.push(
          <div
            className="rating-label checked"
            key={i}
          >
            <KTSVG
              path={HalfStarIcon}
              className="svg-icon svg-icon-1 w-30px h-40px"
            />
          </div>
        );
        pointValue = 0;
      } else {
        ratingsElement.push(
          <div
            className="rating-label"
            key={i}
          >
            <KTSVG
              path={StarEmptyIcon}
              className="svg-icon svg-icon-1 w-30px h-40px"
            />
          </div>
        );
      }
    }
    return ratingsElement;
  };
  const handleOption = (event: any, item: any, index: number) => {
    if (event.value == 1) {
      navigate('/customers/customer-profile', {
        state: { _id: item?.customer?.reference },
      });
      setKey(productDetailsStore.tab, 'Ratings and reviews');
    } else if (event.value === 2) {
      setCurrentRating(item);
      setShowActivateModal(true);
      // handleUpdateStatus(item._id, !item.active, index);
    } else if (event.value === 3) {
      setCurrentRating(item);
      setShowDeleteModal(true);
    }
  };
  const handleUpdateStatus = async (id: any, activate: boolean) => {
    const params = {
      activate: !currentRating?.active ? 'true' : 'false',
    };
    const apiService = new APICallService(
      reviewAndRatings.updateStatus,
      params,
      { id: currentRating?._id }
    );
    const response = await apiService.callAPI();
    if (response) {
      const message = activate
        ? customerToast.reviewShows
        : customerToast.reviewHides;
      success(message);
      // const tempData = [...reviewList];
      // tempData[index].active = activate;
      // setReviewList(tempData);
      setShowActivateModal(false);
      await fetchReviewList(1, pageLimit);
    }
  };
  const handleDeleteReview = async () => {
    const apiCallService = new APICallService(
      reviewAndRatings.deleteReview,
      currentRating?._id
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(customerToast.reviewDeleted);
      setShowDeleteModal(false);
      await fetchReviewList(1, pageLimit);
    }
  };
  const handleCurrentPage = async (val: number) => {
    setPage(val);
    setKey(productDetailsStore.ratingPage, val);
    await fetchReviewList(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(productDetailsStore.ratingPage, val + 1);
    await fetchReviewList(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(productDetailsStore.ratingPage, val - 1);
    await fetchReviewList(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    setKey(productDetailsStore.ratingPage, 1);
    setKey(productDetailsStore.ratingLimit, parseInt(event.target.value));
    await fetchReviewList(1, event.target.value);
  };
  return (
    <>
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
      {showActivateModal && currentRating ? (
        <CustomDeleteModal
          show={showActivateModal}
          onHide={() => setShowActivateModal(false)}
          title={`Are you sure you want to ${
            currentRating?.active ? 'hide' : 'show'
          } this review?`}
          btnTitle={`Yes,${currentRating?.active ? ' Hide' : ' Show'} `}
          handleDelete={handleUpdateStatus}
        />
      ) : (
        <></>
      )}
      <Row>
        <Card className="border mb-8">
          <Card.Header className="bg-light align-items-center">
            <h3 className="fs-22 fw-bolder mb-0">Ratings and reviews</h3>
          </Card.Header>
          <Card.Body>
            {!loading ? (
              reviewList.length ? (
                reviewList.map((item: any, index: number) => {
                  return (
                    <>
                      <div className="py-4 mt-3">
                        <div className="d-flex justify-content-between">
                          <div className="d-inline-flex align-items-center">
                            <div className="symbol symbol-50px border border-r10px me-4">
                              <img
                                className="img-fluid border-r8px object-fit-contain"
                                src={item?.customer?.image || BlankImg}
                                alt=""
                              />
                            </div>
                            <span className="fs-16 fw-600 ms-3">
                              {item?.customer?.name || ''}
                              <br />
                              <span className=" fw-semibold  d-block fs-6">
                                {' '}
                                <div className="rating">
                                  {renderRatings(item?.variant?.rate)}
                                </div>
                              </span>
                            </span>
                            {!item?.active ? (
                              <span className="badge bg-gray-200 border-r4px p-3 fs-14 fw-600 text-dark ms-5">
                                Disabled
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>
                          {Method.hasPermission(Customer, View, currentUser) ||
                          Method.hasPermission(Customer, Edit, currentUser) ||
                          Method.hasPermission(
                            Customer,
                            Delete,
                            currentUser
                          ) ? (
                            <div>
                              <CustomSelectTable
                                marginLeft={'-110px'}
                                placeholder={
                                  <img
                                    className="me-3"
                                    width={45}
                                    height={45}
                                    src={ThreeDotMenu}
                                    alt=""
                                  />
                                }
                                options={options.map(
                                  (optionVal: any, index: number) => {
                                    if (optionVal.value === 2) {
                                      return {
                                        ...optionVal,
                                        label: (
                                          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
                                            {`${
                                              item.active ? 'Hide' : 'Show'
                                            } this review`}
                                          </button>
                                        ),
                                      };
                                    } else {
                                      return optionVal;
                                    }
                                  }
                                )}
                                backgroundColor={'white'}
                                onChange={(event: any) => {
                                  handleOption(event, item, index);
                                }}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="mt-4">
                          <p className="fs-16 fw-500 lh-base">
                            {item?.variant?.message || ''}
                          </p>
                        </div>
                        <div className="fs-14 text-gray fw-500">
                          {Method.convertDateToDDMMYYYY(item?._createdAt)}
                        </div>
                      </div>
                      {index !== reviewJson.length - 1 && (
                        <div className="separator"></div>
                      )}
                    </>
                  );
                })
              ) : (
                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                  No Data Available
                </div>
              )
            ) : (
              <div className="w-50 m-auto text-center">
                <Loader loading={loading} />
              </div>
            )}
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
      </Row>
    </>
  );
};
export default TabRatingReview;
