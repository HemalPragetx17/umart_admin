import { useEffect, useState } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import Email from '../../../umart_admin/assets/media/svg_uMart/email.svg';
import PhoneCall from '../../../umart_admin/assets/media/svg_uMart/phone-call.svg';
import { Link, useLocation } from 'react-router-dom';
import { Customers, String } from '../../../utils/string';
import TabCustomerDashboard from './tabs/tab-customer-dashboard';
import TabBasicDetails from './tabs/tab-basic-details';
import TabOrders from './tabs/tab-orders';
import APICallService from '../../../api/apiCallService';
import { buyer } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import { IGetCustomerProfile } from '../../../types/response_data/customer';
import { getKey, removeKey, setKey } from '../../../Global/history';
import TabRefundOrders from './tabs/tab-refund';
import TabWalletHistory from './tabs/tab-wallet-history';
import CoinIcon from '../../../umart_admin/assets/media/coin.svg';
import SingleCustomerReportModal from '../../modals/reports/single-customer-report';
import { customerDetails } from '../../../utils/storeString';
import BlankImg from '../../../umart_admin/assets/media/avatars/blank.png';
import { Customer, View } from '../../../utils/constants';
import { useAuth } from '../auth';
const CustomerProfile = () => {
  const location = useLocation();
  // const customVal: any = location.state;
  const [customVal, setCustomVal] = useState<any>(
    getKey('profile') || location.state
  );
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<IGetCustomerProfile | undefined>(
    undefined
  );
  const [profileData, setProfileData] = useState<IGetCustomerProfile | any>(
    undefined
  );
  const [tab, setTab] = useState([
    {
      name: 'Dashboard',
      content: (
        <TabCustomerDashboard
          profileData={profileData}
          handleSelectTab={handleSelectTab}
        />
      ),
      value: '1',
    },
    {
      name: 'Address book',
      content: <TabBasicDetails profileData={profileData} />,
      value: '2',
    },
    {
      name: 'Orders',
      content: <TabOrders profileData={profileData} />,
      value: '3',
    },
    {
      name: 'Refunds',
      content: <TabRefundOrders profileData={profileData} />,
      value: '4',
    },
    {
      name: 'Wallet history',
      content: <TabWalletHistory profileData={profileData} />,
      value: '5',
    },
  ]);
  const [currentTab, setCurrentTab] = useState(tab[0]);
  const [showReportModal, setShowReportModal] = useState(false);
  const { currentUser } = useAuth();
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!customVal || !Method.hasPermission(Customer, View, currentUser)) {
        return window.history.back();
      }
      await fetchProfileData();
      setLoading(false);
    })();
    // return () => {
    //   removeKey('profile');
    // };
  }, []);
  function handleSelectTab(tab: any,data?:any){
    if (tab.value === '1') {
      setCurrentTab({
        name: 'Dashboard',
        content: (
          <TabCustomerDashboard
            profileData={profileData}
            handleSelectTab={handleSelectTab}
          />
        ),
        value: '1',
      });
    } else if (tab.value === '2') {
      setCurrentTab({
        name: 'Address book',
        content: <TabBasicDetails profileData={profileData} />,
        value: '2',
      });
    } else if (tab.value === '3') {
      setCurrentTab({
        name: 'Orders',
        content: <TabOrders profileData={profileData || data} />,
        value: '3',
      });
    } else if (tab.value === '4') {
      setCurrentTab({
        name: 'Refunds',
        content: <TabRefundOrders profileData={profileData} />,
        value: '4',
      });
    } else if (tab.value === '5') {
      setCurrentTab({
        name: 'Wallet history',
        content: <TabWalletHistory profileData={profileData} />,
        value: '5',
      });
    }
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
              current.value === tab.value
                ? 'nav-link active text-active-dark'
                : 'nav-link text-hover-dark'
            }
            data-bs-toggle="tab"
            onClick={() => handleSelectTab(tab)}
          >
            {tab.name}
          </Link>
        </li>
      );
    });
    return allTabs;
  };
  const fetchProfileData = async () => {
    let data: any = {};
    if (getKey('profile')) {
      data = getKey('profile');
    }
    if (location?.state) {
      setKey('profile', location?.state);
      data = location?.state;
    }
    if (!data || Object.keys(data).length === 0) {
      return window.history.back();
    }
    setCustomVal(data);
    let apiService = new APICallService(
      buyer.customerInfo,
      data._id,
      '',
      '',
      false,
      '',
      Customer
    );
    let response = await apiService.callAPI();
    if (response) {
      setProfileData(JSON.parse(JSON.stringify(response)));
      setEditData(JSON.parse(JSON.stringify(response)));
      const tabVal = getKey(customerDetails.detailsTab) || '1';
      if (data.fromDashboard || tabVal === '3') {
        setCurrentTab({
          name: 'Orders',
          content: <TabOrders profileData={response} />,
          value: '3',
        });
      } else if (tabVal === '1') {
        setCurrentTab({
          name: 'Dashboard',
          content: (
            <TabCustomerDashboard
              profileData={response}
              handleSelectTab={handleSelectTab}
            />
          ),
          value: '1',
        });
      } else if (tabVal === '4') {
        setCurrentTab({
          name: 'Refunds',
          content: <TabRefundOrders profileData={response} />,
          value: '4',
        });
      } else if (tabVal === '5') {
        setCurrentTab({
          name: 'Wallet history',
          content: <TabWalletHistory profileData={response} />,
          value: '5',
        });
      }
    }
  };
  const handleReportModalOpen = () => {
    setShowReportModal(true);
  };
  const handleReportModalClose = () => {
    setShowReportModal(false);
  };
  return (
    <>
      {showReportModal ? (
        <SingleCustomerReportModal
          show={showReportModal}
          onHide={handleReportModalClose}
          customerId={customVal?._id || ''}
        />
      ) : (
        <></>
      )}
      <Row className="mb-7 align-items-center">
        <Col xs>
          <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
            {Customers.customerProfile}
          </h1>
        </Col>
        {!loading && (
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
      {loading ? (
        <>
          <div className="d-flex justify-content-center">
            <Loader loading={loading} />
          </div>
        </>
      ) : (
        <>
          <Card className="border border-custom-color mb-7">
            <Card.Body className="pt-9 pb-0">
              <div className="position-absolute top-0 end-0">
                <div className="d-flex justify-content-center align-items-center bg-light-warning p-3 px-4 border-r10px">
                  <span className="fw-600 fs-15">{Customers.registerOn}:</span>
                  <span className="ms-1 fw-600 text-black fs-15">
                    {Method.convertDateToDDMMYYYY(
                      customVal?.createdAt || profileData?.user?.createdAt
                    ) || '-'}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
                <div className="me-9">
                  <div className="symbol symbol-200px symbol-fixed border border-r10px position-relative">
                    <div className="image-input d-flex flex-center rounded w-lg-200px w-150px h-lg-200px h-150px">
                      {/* <div
                        className="image-input-wrapper shadow-none bgi-contain bgi-position-center  border-r10px w-100 h-100 bg-image-center"
                        // style={{
                        //   background: `url(${
                        //     profileData?.user?.image || BlankImg
                        //   })`,
                        // }}
                      > */}
                        <img
                          src={profileData?.user?.image || BlankImg}
                          alt="profile"
                          className="image-input-wrapper shadow-none bgi-contain bgi-position-center  border-r10px w-100 h-100 bg-image-center"
                        />
                      {/* </div> */}
                    </div>
                  </div>
                </div>
                <div className="row align-items-center flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column mb-2">
                        <h3 className="text-black fs-22 fw-bolder">
                          {profileData?.user.name || ''}
                        </h3>
                        <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                          <div className="d-flex align-items-center text-black fs-16 fw-500 me-5 mb-2">
                            <span className="svg-icon svg-icon-4 me-2">
                              <img
                                src={PhoneCall}
                                alt="Phone number"
                              />
                            </span>{' '}
                            {/* {profileData?.user.phoneCountry}{' '}
                                {profileData?.user.phone} */}
                            {profileData?.user.phone || ''}
                          </div>
                          <div className="d-flex align-items-center text-black fs-16 fw-500 mb-2">
                            <span className="svg-icon svg-icon-4 me-2">
                              <img
                                src={Email}
                                alt="Email"
                              />
                            </span>
                            {/* {profileData?.user.email}{' '} */}
                            {profileData?.user.email || ''}
                          </div>
                        </div>
                      </div>
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
                              <div className="fs-22 fw-bolder">
                                {/* {profileData?.totalOrders} */}
                                {profileData?.user?.totalOrders || 0}
                              </div>
                            </div>
                            <div className="fw-500 fs-16">
                              {Customers.totalDeliveredOrders}
                            </div>
                          </div>
                          <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                            <div className="d-flex align-items-center">
                              <div className="fs-22 fw-bolder">
                                {/* Tsh {profileData?.totalOrderValue} */}
                                {profileData?.user?.orderFrequency ||
                                  0 + ' ' + String.days}
                              </div>
                            </div>
                            <div className="fw-600 fs-16">
                              {Customers.averageOrder}
                            </div>
                          </div>
                          <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                            <div className="d-flex align-items-center">
                              <div className="fs-22 fw-bolder">
                                {/* TSh {profileData?.totalOrderValue} */}
                                {String.TSh +
                                  ' ' +
                                  Method.formatCurrency(
                                    profileData?.user?.averageOrderValue || 0
                                  )}
                              </div>
                            </div>
                            <div className="fw-600 fs-16">
                              {Customers.averageOrderVal}
                            </div>
                          </div>
                          <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                            <div className="d-flex align-items-center">
                              <div className="fs-22 fw-bolder">
                                {/* {profileData?.user.assignedTo
                                      ? profileData?.user.assignedTo.name
                                      : 'NA'} */}
                                {String.TSh +
                                  ' ' +
                                  Method.formatCurrency(
                                    profileData?.user?.totalOrderValue || 0
                                  )}
                              </div>
                            </div>
                            <div className="fw-600 fs-16">
                              {Customers.totalOrderVal}
                            </div>
                          </div>
                          <div className="bg-light border rounded  py-3 px-4 mb-3 d-flex justify-content-between border-gray-300">
                            <div className="fw-bolder fs-22">
                              <div>
                                {Method.formatCurrency(
                                  profileData?.user?.walletBalance || 0
                                )}
                              </div>
                              <div className="fw-600 fs-16">
                                {Customers.walletCoins}
                              </div>
                            </div>
                            <div className="ms-3 mt-2">
                              <img
                                src={CoinIcon}
                                alt="coin"
                              />
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
                <div className="d-flex min-h-70px">
                  <ul className="nav nav-stretch nav-line-tabs nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-18 fw-600">
                    {createTabs()}
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
          <div
            className="tab-content"
            id="myTabContent"
          >
            <div className="tab-pane fade show active">
              <>{currentTab.content}</>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CustomerProfile;
