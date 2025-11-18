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
import APICallService from '../../../../../api/apiCallService';
import { promotionCampaign } from '../../../../../api/apiEndPoints';
import { IRewardDetails } from '../../../../../types/responseIndex';
import { success } from '../../../../../Global/toast';
import { promotionCampaignToast } from '../../../../../utils/toast';
import { getKey, setKey } from '../../../../../Global/history';
import { listPromotionCampaign } from '../../../../../utils/storeString';
import { Delete, Edit, Promotion } from '../../../../../utils/constants';
import { useAuth } from '../../../auth';
const bannerPlaceMent = ['Home page', 'Category page'];
const RewardsDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location: any = useLocation();
  const [id, setId]: any = useState(
    getKey('promotion-details') || location?.state?._id
  );
  const [loading, setLoading] = useState(true);
  const [rewardDetails, setRewardDetails] = useState<IRewardDetails>();
  const [tab, setTab] = useState([
    {
      name: 'Basic details',
      content: <BasicDetails rewardDetails={rewardDetails} />,
      value: 1,
    },
    {
      name: 'Analytics',
      content: <Analytics id={id} />,
      value: 2,
    },
  ]);
  const [currentTab, setCurrentTab] = useState(tab[0]);
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    if (!id) {
      return window.history.back();
    }
    (async () => {
      updateOptionWithPermission();
      await fetchRewardDetails(id);
    })();
  }, []);
  const fetchRewardDetails = async (id: string) => {
    setLoading(true);
    const apiService = new APICallService(
      promotionCampaign.rewardDetails,
      id,
      '',
      '',
      false,
      '',
      Promotion
    );
    const response = await apiService.callAPI();
    if (response) {
      setRewardDetails(response);
      const tempVal = getKey(listPromotionCampaign.rewardDetailsTab) || 1;
      if (tempVal == 1) {
        setCurrentTab({
          name: 'Basic details',
          content: <BasicDetails rewardDetails={response} />,
          value: 1,
        });
      } else if (tempVal == 2) {
        setCurrentTab({
          name: 'Analytics',
          content: <Analytics id={id} />,
          value: 2,
        });
      }
      setKey('promotion-details', id);
    }
    setLoading(false);
  };
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
  const handleSelectTab = (
    tab: any,
    rewardDetails: IRewardDetails | undefined
  ) => {
    if (tab.value === 1) {
      setCurrentTab({
        name: 'Basic details',
        content: <BasicDetails rewardDetails={rewardDetails} />,
        value: 1,
      });
    } else if (tab.value === 2) {
      setCurrentTab({
        name: 'Analytics',
        content: <Analytics id={id} />,
        value: 2,
      });
    }
    setKey(listPromotionCampaign.rewardDetailsTab, tab.value);
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
            onClick={() => handleSelectTab(tab, rewardDetails)}
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
      navigate('/promotion-campaign/edit-reward', { state: { _id: id } });
    } else if (event.value === 2) {
      setShowModal(true);
    }
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      promotionCampaign.deletePromotion,
      {},
      { id: id },
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(promotionCampaignToast.rewardDeleted);
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
          title="Are you sure you want to delete this reward promotion?"
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
                {PromotionAndCampaignString.rewardDetails}
              </h1>
            </Col>
            {!loading && !rewardDetails?.deleted && (
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
                    {bannerDetails?.expired ? (
                      <span className="ms-1 fw-600 text-black fs-15">
                        Expired
                      </span>
                    ) : (
                      <span className="ms-1 fw-600 text-black fs-15">
                        {`Display for ${bannerDetails?.days || '0'} ${
                          bannerDetails?.days > 1 ? 'days' : 'day'
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
                              background: `url(${rewardDetails?.image || ''})`,
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
                                {rewardDetails?.startDate
                                  ? Method.convertDateToDDMMYYYY(
                                      rewardDetails?.startDate
                                    )
                                  : '-'}
                                {' to '}
                                {rewardDetails?.endDate
                                  ? Method.convertDateToDDMMYYYY(
                                      rewardDetails?.endDate
                                    )
                                  : '-'}
                              </span>
                            </h3>
                            <span
                              className={clsx(
                                'badge  border-r4px p-3 fs-14 fw-600 text-dark ms-4',
                                rewardDetails?.active
                                  ? 'badge-light-success'
                                  : 'badge-light'
                              )}
                            >
                              {rewardDetails?.expired
                                ? 'Expired'
                                : rewardDetails?.active
                                ? Method.dayDifference(
                                    new Date().toLocaleString(),
                                    rewardDetails?.startDate
                                  ) > 0
                                  ? 'Upcoming'
                                  : 'Ongoing'
                                : 'Deactivated'}
                            </span>
                          </div>
                        </div>
                        <div className="fw-500 fs-16 mb-1">
                          <span>{rewardDetails?.title || 'NA'}</span>
                        </div>
                      </div>
                      <Col
                        lg={12}
                        className="pe-0"
                      >
                        <div className="d-flex flex-wrap flex-stack">
                          <div className="d-flex flex-column flex-grow-1">
                            <div className="d-flex flex-wrap">
                              <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">Coins</div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  {/* {BannerString.bannerPlaceMent} */}
                                  Reward type
                                </div>
                              </div>
                              <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {Method.formatCurrency(
                                      rewardDetails?.totalDiscount || 0
                                    )}{' '}
                                    coins
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Total valuation
                                </div>
                              </div>
                              {/* <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">{'0'}</div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Redemption count
                                </div>
                              </div> */}
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
