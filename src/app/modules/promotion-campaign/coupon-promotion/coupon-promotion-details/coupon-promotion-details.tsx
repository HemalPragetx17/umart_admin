import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PromotionAndCampaignString } from '../../../../../utils/string';
import { CustomSelectTable } from '../../../../custom/Select/CustomSelectTable';
import ThreeDot from '../../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import clsx from 'clsx';
import Method from '../../../../../utils/methods';
import Loader from '../../../../../Global/loader';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BasicDetails from './basic-details';
import Analytics from './analytics';
import CustomDeleteModal from '../../../../modals/custom-delete-modal';
import { promotionCampaign } from '../../../../../api/apiEndPoints';
import APICallService from '../../../../../api/apiCallService';
import { ICouponDetails } from '../../../../../types/responseIndex';
import {
  Delete,
  Edit,
  FlatDiscount,
  Promotion,
} from '../../../../../utils/constants';
import { success } from '../../../../../Global/toast';
import { promotionCampaignToast } from '../../../../../utils/toast';
import { getKey, setKey } from '../../../../../Global/history';
import { listPromotionCampaign } from '../../../../../utils/storeString';
import { useAuth } from '../../../auth';
const bannerPlaceMent = ['Home page', 'Category page'];
const RewardsDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location: any = useLocation();
  const [id, setId]: any = useState(
    getKey('promotion-coupon-details') || location?.state?._id
  );
  const [loading, setLoading] = useState(true);
  const [couponDetails, setCouponDetails] = useState<ICouponDetails>();
  const [tab, setTab] = useState([
    {
      name: 'Basic details',
      content: <BasicDetails couponDetails={couponDetails} />,
      value: 1,
    },
    {
      name: 'Analytics',
      content: <Analytics id={id} />,
      value: 2,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(tab[0]);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    if (!id) {
      return window.history.back();
    }
    (async () => {
      updateOptionWithPermission();
      await fetchCouponDetails(id);
      setKey('promotion-coupon-details', id);
    })();
  }, []);
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Promotion, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(Promotion, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            Delete details
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const fetchCouponDetails = async (id: string) => {
    setLoading(true);
    const apiCallService = new APICallService(
      promotionCampaign.couponDetails,
      id,
      '',
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const temp: ICouponDetails = {
        ...couponDetails,
        title: response?.title || '',
        startDate: response?.startDate || '',
        endDate: response?.endDate || '',
        image: response?.image || '',
        minimumPurchaseAmount: response?.minimumPurchaseAmount
          ? response?.minimumPurchaseAmount.toString()
          : '',
        description: response?.description || '',
        discountValue: response?.discountValue
          ? response.discountValue.toString()
          : '',
        placement: response?.placement || 1,
        redemptionLimit: response?.redemptionLimit.toString(),
        type: response?.type.toString(),
        _id: response?._id,
        active: response?.active,
        applyDiscountTo: response?.applyDiscountTo || '',
        deleted: response.deleted,
        discountType: response?.discountType || 0,
        expired: response?.expired,
        variants: response?.variants || [],
        totalDiscount: response?.totalDiscount || 0,
      };
      setCouponDetails(temp);
      const tabVal = getKey(listPromotionCampaign.couponDetailsTab) || 1;
      if (tabVal == 1) {
        setCurrentTab({
          name: 'Basic details',
          content: <BasicDetails couponDetails={temp} />,
          value: 1,
        });
      } else if (tabVal == 2) {
        setCurrentTab({
          name: 'Analytics',
          content: <Analytics id={id} />,
          value: 2,
        });
      }
    }
    setLoading(false);
  };
  const handleSelectTab = (
    tab: any,
    couponDetails: ICouponDetails | undefined
  ) => {
    if (tab.value === 1) {
      setCurrentTab({
        name: 'Basic details',
        content: <BasicDetails couponDetails={couponDetails} />,
        value: 1,
      });
    } else if (tab.value === 2) {
      setCurrentTab({
        name: 'Analytics',
        content: <Analytics id={id} />,
        value: 2,
      });
    }
    setKey(listPromotionCampaign.couponDetailsTab, tab.value);
  };
  const createTabs = () => {
    const localTab = tab;
    let current = currentTab;
    const allTabs = localTab.map((tab: any, index: number) => {
      return (
        <li
          key={index}
          className="nav-item"
        >
          <Link
            to={'/'}
            className={
              current.name === tab.name
                ? 'nav-link active text-active-dark'
                : 'nav-link text-hover-dark'
            }
            data-bs-toggle="tab"
            onClick={() => handleSelectTab(tab, couponDetails)}
          >
            {tab.name}
          </Link>
        </li>
      );
    });
    return allTabs;
  };
  const handleOptionChange = (event: any) => {
    if (event.value === 1) {
      navigate('/promotion-campaign/edit-coupon-promotion', {
        state: { _id: id },
      });
    } else if (event.value === 2) {
      setShowModal(true);
    }
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      promotionCampaign.deletePromotion,
      {},
      { id: id }
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(promotionCampaignToast.couponDeleted);
      setShowModal(false);
      navigate('/promotion-campaign/all-promotions', { replace: true });
    }
  };
  return (
    <>
      {showModal ? (
        <CustomDeleteModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title="Are you sure you want to delete this coupon promotion?"
          btnTitle="Yes, Delete"
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      <Row className="mb-7 align-items-center">
        <Col xs={12}>
          <Row className="align-items-center">
            <Col
              md
              className="mb-4"
            >
              <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
                {PromotionAndCampaignString.couponPromotionDetailsPage}
              </h1>
            </Col>
            {!loading && !couponDetails?.deleted && (
              <Col sm="auto">
                <div className="d-inline-flex">
                  <div className="my-0 pe-2">
                    {Method.hasPermission(Promotion, Edit, currentUser) ||
                    Method.hasPermission(Promotion, Delete, currentUser) ? (
                      <CustomSelectTable
                        marginLeft={'-110px'}
                        width={'auto'}
                        placeholder={
                          <img
                            className="img-fluid"
                            width={45}
                            height={6}
                            src={ThreeDot}
                            alt=""
                          />
                        }
                        options={options}
                        backgroundColor="white"
                        onChange={(event: any, index: number, data: any) => {
                          handleOptionChange(event);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Col>
        {!loading ? (
          <>
            <Col
              xs={12}
              className="mt-6"
            >
              <Card className="border border-custom-color mb-7">
                <Card.Body className="pt-9 pb-0">
                  {/* <div className="position-absolute top-0 end-0">
                  <div className="d-flex justify-content-center align-items-center bg-light-warning p-3 px-4 border-r10px">
                    {couponDetails?.expired ? (
                      <span className="ms-1 fw-600 text-black fs-15">
                        Expired
                      </span>
                    ) : (
                      <span className="ms-1 fw-600 text-black fs-15">
                        {`Display for ${couponDetails?.days || '0'} ${
                          couponDetails?.days > 1 ? 'days' : 'day'
                        }`}
                      </span>
                    )}
                  </div>
                </div> */}
                  <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
                    <div className="me-9">
                      <div className="symbol symbol-200px ymbol-fixed border border-r10px position-relative  ">
                        <div className="image-input d-flex flex-center rounded w-lg-235px w-235px h-lg-135px h-150px ">
                          <div
                            className="image-input-wrapper shadow-none bgi-contain bgi-position-center  border-r10px w-100 h-100  bg-image-center"
                            style={{
                              background: `url(${couponDetails?.image || ''})`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center flex-grow-1">
                      <div className="d-flex flex-column justify-content-between align-items-start flex-wrap mb-2">
                        <div className="d-flex flex-column">
                          <div className="d-flex ">
                            <h3 className="text-black fs-22 fw-bolder">
                              <span>
                                {couponDetails?.startDate
                                  ? Method.convertDateToDDMMYYYY(
                                      couponDetails?.startDate
                                    )
                                  : '-'}
                                {' to '}
                                {couponDetails?.endDate
                                  ? Method.convertDateToDDMMYYYY(
                                      couponDetails?.endDate
                                    )
                                  : '-'}
                              </span>
                            </h3>
                            <span
                              className={clsx(
                                'badge  border-r4px p-3 fs-14 fw-600 text-dark ms-4',
                                couponDetails?.active
                                  ? 'badge-light-success'
                                  : 'badge-light'
                              )}
                            >
                              {couponDetails?.expired
                                ? 'Expired'
                                : couponDetails?.active
                                ? Method.dayDifference(
                                    new Date().toLocaleString(),
                                    couponDetails?.startDate
                                  ) > 0
                                  ? 'Upcoming'
                                  : 'Ongoing'
                                : 'Deactivated'}
                            </span>
                          </div>
                        </div>
                        <div className="fw-500 fs-16 mb-1">
                          <span>{couponDetails?.title || 'NA'}</span>
                        </div>
                      </div>
                      <Col
                        lg={12}
                        className="pe-0"
                      >
                        <div className="d-flex flex-wrap flex-stack">
                          <div className="d-flex flex-column flex-grow-1">
                            <div className="d-flex flex-wrap">
                              <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {couponDetails?.discountType.toString() ===
                                    FlatDiscount
                                      ? 'Flat Discount '
                                      : 'Percentage Discount'}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Discount type
                                </div>
                              </div>
                              <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {Method.formatCurrency(
                                      couponDetails?.totalDiscount || 0
                                    )}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Redemption analytics
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </div>
                  </div>
                </Card.Body>
                <Row className="align-items-center px-lg-9 px-6">
                  <Col sm>
                    <div className="d-flex h-70px">
                      <ul className="nav nav-stretch nav-line-tabs nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-18 fw-600">
                        {createTabs()}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <div
              className="tab-content"
              id="myTabContent"
            >
              <div className="tab-pane fade show active">
                <>{currentTab.content}</>
              </div>
            </div>
          </>
        ) : (
          <div className="border border-r10px mb-6">
            <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
              <Loader loading={loading} />
            </div>
          </div>
        )}
      </Row>
    </>
  );
};
export default RewardsDetails;
