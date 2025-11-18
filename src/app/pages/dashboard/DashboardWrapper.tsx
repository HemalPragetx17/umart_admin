/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../umart_admin/layout/core';
import { Button, Col, Row } from 'react-bootstrap';
import { DashboardString } from '../../../utils/string';
import WareHouseImg from '../../../umart_admin/assets/media/store.png';
import ProductImg from '../../../umart_admin/assets/media/box.png';
import CustomersImg from '../../../umart_admin/assets/media/people.png';
import OrdersImg from '../../../umart_admin/assets/media/Icon.png';
import ActiveCustomersChart from './ActiveCustomersChart';
import OrderReport from './OrderReport';
import APICallService from '../../../api/apiCallService';
import { dashBoardEndPoints } from '../../../api/apiEndPoints';
import SalesReport from './SalesReport';
import Loader from '../../../Global/loader';
import DashboardReport from '../../modals/reports/dashboard-reports';
import MobileDownload from '../../../umart_admin/assets/media/dashboard/people2.svg';
import Method from '../../../utils/methods';
import { useAuth } from '../../modules/auth';
import LoginOrder from '../../../umart_admin/assets/media/dashboard/login_order.svg';
import OneOrder from '../../../umart_admin/assets/media/dashboard/one-order.svg';
import StoppedOrder from '../../../umart_admin/assets/media/dashboard/stopped-order.svg';
import { useNavigate } from 'react-router-dom';
import OrderReportV2 from './OrderReportV2';
import CategoryReportChart from './CategoryReport';
const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { saveCurrentUser, currentUser }: any = useAuth();
  const [loading, setLoading] = useState(true);
  const [initData, setInitData] = useState<any>();
  const [showReportModal, setShowReportModal] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchInitData();
      setLoading(false);
    })();
  }, []);
  const fetchInitData = async () => {
    setLoading(true);
    const params = {
      needStats: true,
      needCategories: true,
      needTopCustomers: true,
      needTopProducts: true,
      needCustomersWithNoOrdersFrom15Days: true,
      needCustomersOneOrder: true,
      needCustomersWithLoginNoOrders: true,
      needCustomersRegisteredToday: true,
      needOrdersPlacedToday: true,
      needOrdersCancelledToday: true,
      needOrdersDeliveredToday: true,
      needAverageOrderValue: true,
      needAverageSKUsPerOrder: true,
      needEngagedCustomers: true,
      needOnlineAndCODOrders: true,
      needSKUsSoldToday: true,
      needOnTimeDeliveryRate: true,
      needTotalReturnedOrders: true,
      needOnTimeActualDeliveredOrderRate: true,
      needAvgTimePerDelivery: true,
      needReturnedSKUs: true,
    };
    const apiService = new APICallService(
      dashBoardEndPoints.getInitData,
      params
    );
    const response = await apiService.callAPI();
    if (response) {
      const tempResponse = { ...response };
      tempResponse.topCustomers = response?.topCustomers.slice(0, 5);
      tempResponse.topProducts = response?.topProducts.records.slice(0, 5);
      setInitData(tempResponse);
      if (!currentUser || currentUser?._id !== response?.user?._id) {
        saveCurrentUser(response?.user);
      }
    }
    setLoading(false);
  };
  const fetchCategoryReportData = async () => {
    const apiCallService = new APICallService(
      dashBoardEndPoints.categoryReport
    );
    const response = await apiCallService.callAPI();
    if (response) {
    }
  };
  return (
    <>
      {showReportModal ? (
        <DashboardReport
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center">
        <Col
          xs
          className="align-self-center mb-5"
        >
          <h1 className="fs-22 fw-bolder mb-0">
            {DashboardString.dashBoardTitle}
          </h1>
        </Col>
        {!loading && (
          <Col
            xs="auto"
            className="align-self-center mb-5"
          >
         
            <Button
              variant="primary"
              className="btn-lg me-2"
              onClick={() =>
                navigate('/supply-chain-dashboard', {
                  state: {
                    onTimeDeliveryRate: initData?.onTimeDeliveryRate || 0,
                    totalReturnedOrders: initData?.totalReturnedOrders || 0,
                    onTimeDeliveredOrderRate:
                      initData?.onTimeDeliveredOrderRate || 0,
                    avgTimePerDelivery: initData?.avgTimePerDelivery || 0,
                    returnedSKUs: initData?.returnedSKUs || {},
                  },
                })
              }
            >
              <div className="indicator-label fs-16 fw-bold">
                {'Supply Chain Dashboard'}
              </div>
            </Button>
            <Button
              variant="primary"
              className="btn-lg"
              onClick={() => setShowReportModal(true)}
            >
              <div className="indicator-label fs-16 fw-bold">
                {'Download report'}
              </div>
            </Button>
          </Col>
        )}
        {loading ? (
          <div className="w-100 d-flex justify-content-center">
            <Loader loading={loading} />
          </div>
        ) : (
          <>
            {' '}
            <Col
              xs={12}
              className="mb-7"
            >
              <Row className="g-10">
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-c9f3d7 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px p-20">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.stats?.totalWarehouses || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {DashboardString.totalWareHouses}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={WareHouseImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.stats?.totalBuyers || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {DashboardString.totalCustomers}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={CustomersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-c6e4fb rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.stats?.totalListedProducts || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {DashboardString.totalProduct}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={ProductImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-d5d5f2 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.stats?.totalOrders || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {DashboardString.totalOrders}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={OrdersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-dcccda rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px p-20 flex-wrap">
                    <div className="">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {Method.convertToMillionOrThousand(
                            initData?.stats?.totalAppInstalled &&
                              initData?.stats?.totalAppInstalled[0]
                              ? initData?.stats?.totalAppInstalled[0]
                                  ?.installedDevices || 0
                              : 0
                          )}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Android'}</div>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {Method.convertToMillionOrThousand(
                            initData?.stats?.totalAppInstalled &&
                              initData?.stats?.totalAppInstalled[1]
                              ? initData?.stats?.totalAppInstalled[1]
                                  ?.installedDevices || 0
                              : 0
                          )}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'iOS'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={MobileDownload} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div
                    className="border-r8px bg-ade8f4 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px cursor-pointer"
                    onClick={() => navigate('/login-not-order-place-order')}
                    role="link"
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.customersWithLoginNoOrders || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Login & not placed order'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={LoginOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div
                    className="border-r8px  bg-c9f3d7 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px cursor-pointer"
                    onClick={() => navigate('/placed-one-order-report')}
                    role="link"
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.customersWithOneOrder || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Placed one order'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={OneOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div
                    className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px cursor-pointer"
                    onClick={() => navigate('/no-order-last-15day-report')}
                    role="link"
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.customersWithNoOrdersFrom15Days || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'No orders from last 15 days'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={StoppedOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col>
                {/* <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.customersRegisteredToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Customer registered today'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={CustomersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-d5d5f2 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.ordersPlacedToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Order placed today'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={OrdersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-ade8f4 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px ">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.ordersDeliveredToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Order delivered today'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={LoginOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.ordersCancelledToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Order cancelled today'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={StoppedOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col> */}
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-d5d5f2 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {Method.formatCurrency(
                            initData?.averageOrderValue || 0
                          )}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Avg order value (TSh)'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={OrdersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-c6e4fb rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.averageSKUsPerOrder || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Avg SKUs per order'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={ProductImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.engagedCustomers || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Engaged customers in last one month'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={CustomersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-c9f3d7 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px p-20 flex-wrap">
                    <div className="">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {Method.formatCurrency(
                            initData?.onlineAndCODOrders?.Online || 0
                          )}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Online'}</div>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {Method.formatCurrency(
                            initData?.onlineAndCODOrders?.COD || 0
                          )}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Cash/Wallet'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={WareHouseImg} />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={12}
              className="mb-12 mt-8"
            >
              <Row className="g-10">
                <Col xs={12} className='mb-0 pb-0'>
                  <h2 className="fs-22 fw-bolder mb-0">
                    {'Today`s Analytics'}
                  </h2>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.customersRegisteredToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Customer registered today'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={CustomersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-d5d5f2 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.ordersPlacedToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'Order placed today'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={OrdersImg} />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-ade8f4 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px ">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.ordersDeliveredToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Order delivered today'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={LoginOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.ordersCancelledToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">
                        {'Order cancelled today'}
                      </div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img
                        src={StoppedOrder}
                        height={22}
                      />
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-c6e4fb rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {initData?.skusSoldToday || 0}
                        </div>
                      </div>
                      <div className="fw-500 fs-16">{'SKUs sold today'}</div>
                    </div>
                    <div className="bg-white  rounded-circle w-50px h-50px d-flex align-items-center justify-content-center">
                      <img src={ProductImg} />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={12}
              className="mb-7"
            >
              <SalesReport />
            </Col>
            <Col
              xs={12}
              className="mb-2"
            >
              <ActiveCustomersChart />
            </Col>
            <Col
              xs={12}
              className="mb-7"
            >
              <OrderReport
                customers={initData?.topCustomers || []}
                products={initData?.topProducts || []}
              />
            </Col>
            <Col
              xs={12}
              className="mb-7"
            >
              <OrderReportV2 />
            </Col>
            <Col
              xs={12}
              className="mb-7"
            >
              <CategoryReportChart />
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};
export { DashboardWrapper };
