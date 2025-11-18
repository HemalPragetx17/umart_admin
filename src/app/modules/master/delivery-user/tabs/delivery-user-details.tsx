import { Card, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { DeliverString, String } from '../../../../../utils/string';
import Method from '../../../../../utils/methods';
import { DeliveryUser as DeliverUserEnum } from '../../../../../utils/constants';
const DeliveryUserDetails = (props: any) => {
  const [technicalInfo, setTechnicalInfo] = useState<any>([]);
  const [media, setMedia] = useState<any>([]);
  useEffect(() => {
    let temp: any = [];
    let tempMedia: any = [];
    if (props.basicDetails.drivingLicense) {
      tempMedia.push({
        title: 'Driving license',
        url: props.basicDetails.drivingLicense,
        expireDate: props.basicDetails.drivingLicenseExpiryDate
          ? Method.convertDateToDDMMYYYY(
              props.basicDetails.drivingLicenseExpiryDate
            )
          : 'NA',
      });
    }
    if (props.basicDetails.vehicleDocument) {
      tempMedia.push({
        title: 'Vehicle Document',
        url: props.basicDetails.vehicleDocument,
        expireDate: props.basicDetails.vehicleDocumentExpiryDate
          ? Method.convertDateToDDMMYYYY(
              props.basicDetails.vehicleDocumentExpiryDate
            )
          : 'NA',
      });
    }
    if (props.basicDetails.vehicleInsurance) {
      tempMedia.push({
        title: 'Vehicle Insurance',
        url: props.basicDetails.vehicleInsurance,
        expireDate: props.basicDetails.vehicleInsuranceExpiryDate
          ? Method.convertDateToDDMMYYYY(
              props.basicDetails.vehicleInsuranceExpiryDate
            )
          : 'NA',
      });
    }
    setMedia(tempMedia);
    setTechnicalInfo(temp);
  }, [props.basicDetails]);
  //   });
  return (
    <>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">{DeliverString.basicDetails}</h3>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column flex-lg-row">
            <Row>
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {DeliverString.name}:
                  </label>
                </Col>
                <Col lg={10}>
                  <span className="fw-bolder fs-16 fw-600 text-dark">
                    {props.basicDetails.name}
                  </span>
                </Col>
              </Row>
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {' '}
                    {DeliverString.phoneNumber}:
                  </label>
                </Col>
                <Col lg={10}>
                  <span className="fs-16 fw-600 text-dark">
                    {String.countryCode + ' ' + props.basicDetails.phone}
                  </span>
                </Col>
              </Row>
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {' '}
                    {DeliverString.email}:
                  </label>
                </Col>
                <Col lg={10}>
                  <span className="fs-16 fw-600 text-dark">
                    {props.basicDetails.email}
                  </span>
                </Col>
              </Row>
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {' '}
                    {DeliverString.dob}:
                  </label>
                </Col>
                <Col lg={10}>
                  <span className="fs-16 fw-600 text-dark">
                    {Method.convertDateToDDMMYYYY(props.basicDetails.dob)}
                  </span>
                </Col>
              </Row>
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {' '}
                    {DeliverString.vehicleNumber}:
                  </label>
                </Col>
                <Col lg={10}>
                  <span className="fs-16 fw-600 text-dark">
                    {props.basicDetails?.vehicleNumber || 'NA'}
                  </span>
                </Col>
              </Row>
              {props?.basicDetails?.lipaCountryCode ? (
                <Row className="mb-7">
                  <Col lg={2}>
                    <label className=" fs-16 fw-500 text-dark">
                      {' '}
                      {'Lipa Number'}:
                    </label>
                  </Col>
                  <Col lg={10}>
                    <span className="fs-16 fw-600 text-dark">
                      {/* {(props?.basicDetails?.lipaCountryCode || '') +
                        ' ' + */}
                      {props?.basicDetails?.lipaNumber || ''}
                    </span>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {' '}
                    {DeliverString.address}:
                  </label>
                </Col>
                <div className="col-lg-10">
                  <span className="fs-16 fw-600 text-dark">
                    {props.basicDetails.address || 'NA'}
                  </span>
                </div>
              </Row>
              <Row className="mb-7 align-items-center">
                <Col lg={2}>
                  <label className="fs-16 fw-500 text-dark">
                    {DeliverString.warehouse}:
                  </label>
                </Col>
                <div className="col-lg-10">
                  <div className="d-flex align-items-center">
                    <div className="d-flex justify-content-center align-items-center w-fit-content bg-gray-100 p-4 px-4 pills-radius me-3">
                      <span className="fw-600 text-black fs-16">
                        {props.basicDetails.warehouse ||
                          'U Trade' + ' ' + String.warehouse}
                      </span>
                    </div>
                  </div>
                </div>
              </Row>
            </Row>
            <Row>
              <div className="me-9 ">
                <h3 className="text-black fs-22 fw-bolder mb-4 ps-4">
                  {'QR Code'}
                </h3>
                <div className="symbol symbol-200px symbol-fixed border border-r10px position-relative">
                  <div className="image-input d-flex flex-center rounded w-lg-200px w-150px h-lg-200px h-150px">
                    <div
                      className="image-input-wrapper shadow-none bgi-contain bgi-position-center border-r10px w-100 h-100"
                      style={{
                        background: `url(${props.basicDetails?.qrImage || ''})`,
                        //TODO please se if working or not
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Row>
          </div>
        </Card.Body>
      </Card>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">{DeliverString.documents}</h3>
        </Card.Header>
        <Card.Body className="pb-4">
          <Row>
            {media.length > 0 &&
              media.map((mediaVal: any, index: number) => {
                return (
                  <Col
                    key={index}
                    xs="auto"
                    className="mb-6"
                  >
                    <div className="d-flex flex-column align-items-start gap-3 ">
                      <span className="fs-16 text-black">{mediaVal.title}</span>
                      <div className="symbol symbol-md-200px symbol-150px w-fit-content border bg-body  ">
                        <img
                          className="img-fluid object-fit-contain"
                          src={mediaVal.url}
                          alt=""
                        />
                      </div>
                      <span className="fs-16 text-black">{`Expiry Date : ${mediaVal.expireDate}`}</span>
                    </div>
                  </Col>
                );
              })}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default DeliveryUserDetails;
