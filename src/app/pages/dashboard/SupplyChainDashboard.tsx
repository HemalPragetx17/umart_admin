import { Col, Row } from 'react-bootstrap';
import { DashboardString } from '../../../utils/string';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import WareHouseImg from '../../../umart_admin/assets/media/store.png';
import ProductImg from '../../../umart_admin/assets/media/box.png';
import OrdersImg from '../../../umart_admin/assets/media/Icon.png';
import LoginOrder from '../../../umart_admin/assets/media/dashboard/login_order.svg';

const SupplyChainDashboard = () => {
  const { state }: any = useLocation();
  const [countersData, setCountersData] = useState<any>(state);
  return (
    <Row className="align-items-center">
      <Col
        xs
        className="align-self-center mb-5"
      >
        <h1 className="fs-22 fw-bolder mb-0">
          {DashboardString.supplyChainDashboard}
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
            <div className="border-r8px bg-c9f3d7 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px p-20">
              <div>
                <div className="d-flex align-items-center">
                  <div className="fs-22 fw-bolder">
                    {countersData?.onTimeDeliveryRate || 0} {'%'}
                  </div>
                </div>
                <div className="fw-500 fs-16">{'On time delivery rate'}</div>
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
            <div className="border-r8px bg-c6e4fb rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
              <div>
                <div className="d-flex align-items-center">
                  <div className="fs-22 fw-bolder">
                    {countersData?.totalReturnedOrders || 0}
                  </div>
                </div>
                <div className="fw-500 fs-16">{'Total returned orders'}</div>
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
                    {countersData?.onTimeDeliveredOrderRate || 0} {'%'}
                  </div>
                </div>
                <div className="fw-500 fs-16">
                  {'On time delivered order rate'}
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
            <div className="border-r8px bg-ade8f4 rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px ">
              <div>
                <div className="d-flex align-items-center">
                  <div className="fs-22 fw-bolder">
                    {countersData?.avgTimePerDelivery || 0} {'mins'}
                  </div>
                </div>
                <div className="fw-500 fs-16">{'Avg time per delivery'}</div>
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
            <div className="border-r8px bg-c6e4fb rounded py-4 px-5 d-flex justify-content-between align-items-center h-90px">
              <div>
                <div className="d-flex align-items-center">
                  <div className="fs-22 fw-bolder">
                    {countersData?.returnedSKUs?.totalReturnedSKUs || 0}
                  </div>
                </div>
                <div className="fw-500 fs-16">{'Returned SKUs'}</div>
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
export default SupplyChainDashboard;
