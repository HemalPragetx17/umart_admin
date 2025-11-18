import { Col, Row } from 'react-bootstrap';
import { DashboardString } from '../../../utils/string';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductImg from '../../../umart_admin/assets/media/box.png';
import OrdersImg from '../../../umart_admin/assets/media/Icon.png';
import LoginOrder from '../../../umart_admin/assets/media/dashboard/login_order.svg';
import StoppedOrder from '../../../umart_admin/assets/media/dashboard/stopped-order.svg';
import CustomersImg from '../../../umart_admin/assets/media/people.png';

const TodayDashboard = () => {
  const { state }: any = useLocation();
  const [countersData, setCountersData] = useState<any>(state);
  return (
    <Row className="align-items-center">
      <Col
        xs
        className="align-self-center mb-5"
      >
        <h1 className="fs-22 fw-bolder mb-0">
          {DashboardString.todayAnalytics}
        </h1>
      </Col>
      <Col
        xs={12}
        className="mb-7 mt-3"
      >
        <Row className="g-10">
          <Col
            xl={3}
            md={6}
            sm={4}
          >
            <div className="border-r8px bg-fff4d9 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
              <div>
                <div className="d-flex align-items-center">
                  <div className="fs-22 fw-bolder">
                    {countersData?.customersRegisteredToday || 0}
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
                    {countersData?.ordersPlacedToday || 0}
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
                    {countersData?.ordersDeliveredToday || 0}
                  </div>
                </div>
                <div className="fw-500 fs-16">{'Order delivered today'}</div>
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
                    {countersData?.ordersCancelledToday || 0}
                  </div>
                </div>
                <div className="fw-500 fs-16">{'Order cancelled today'}</div>
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
                    {countersData?.skusSoldToday || 0}
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
    </Row>
  );
};
export default TodayDashboard;
