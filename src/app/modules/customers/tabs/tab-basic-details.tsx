import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Customers } from '../../../../utils/string';
import { Home, Office, Other } from '../../../../utils/constants';
const TabBasicDetails = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const customVal: any = location.state;
  const { profileData }: any = props;
  return (
    <>
      <div className="card table-out">
        <div className="card-header bg-light border-2 pt-2">
          <h3 className="card-title card-label fs-22 fw-bolder fw-bold text-dark">
            {Customers.deliveryAddress}
          </h3>
        </div>
        <div className="card-body">
          <Row>
            {!!profileData.user.deliveryAddresses.length &&
              profileData.user.deliveryAddresses.map(
                (item: any, index: number) => (
                  <Col
                    key={index}
                    lg={6}
                    className="pt-2"
                  >
                    <Card>
                      <div className="d-flex align-items-center mb-8 customer">
                        <div className="flex-grow-1 ms-5 pt-5 ">
                          <span className=" fw-bold fs-16">{item?.name} </span>
                          <span className=" fw-bold fs-16 d-block">
                            {/* {item?.addressLine1 &&
                            customVal?.address[0] &&
                            customVal?.address[0].home} */}
                            {/* {item.addressLine1} */}
                            {/* {item.addressLine2} */}
                            {`
                              ${
                                item?.floorNumber ? item?.floorNumber + ', ' : ''
                              }
                            ${item?.houseNumber ? item?.houseNumber + ', ' : ''}
                              ${
                                item?.buildingName
                                  ? item?.buildingName + ', '
                                  : ''
                              }
                              ${item?.landmark ? item?.landmark + ', ' : ''}
                              ${
                                item?.addressLine1
                                  ? item?.addressLine1 + ' '
                                  : ''
                              }
                              `}
                          </span>
                          {item?.phone ? (
                            <span className=" fw-bold fs-16">
                              {`Phone : ${item?.phoneCountry} ${item?.phone}`}
                            </span>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="flex-grow-3 ms-5 text-align-center">
                          <span className="badge badge-light custom-badge text-dark-800 fw-bold fs-6 d-center-block">
                            {item.addressType === Home && Customers.badgeHome}
                            {item.addressType === Office && Customers.badgeWork}
                            {item.addressType === Other && Customers.badgeOther}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              )}
          </Row>
        </div>
      </div>
    </>
  );
};
export default TabBasicDetails;
