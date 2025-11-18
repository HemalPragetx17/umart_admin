import { Card, Col, Row } from 'react-bootstrap';
import { DeliverString, String } from '../../../../utils/string';
import Method from '../../../../utils/methods';
const PickerTabBasicDetails = (props: any) => {
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
                    {props?.basicDetails?.name || ''}
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
                    {props?.basicDetails?.phoneCountry + ' ' + props?.basicDetails?.phone}
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
                    {props?.basicDetails?.email || ''}
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
                    {Method.convertDateToDDMMYYYY(props?.basicDetails?.dob)}
                  </span>
                </Col>
              </Row>
              <Row className="mb-7">
                <Col lg={2}>
                  <label className=" fs-16 fw-500 text-dark">
                    {' '}
                    {DeliverString.address}:
                  </label>
                </Col>
                <div className="col-lg-10">
                  <span className="fs-16 fw-600 text-dark">
                    {props?.basicDetails?.address || 'NA'}
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
                        {props?.basicDetails?.warehouse?.name  ||
                          'U Trade' + ' ' + String.warehouse}
                      </span>
                    </div>
                  </div>
                </div>
              </Row>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default PickerTabBasicDetails;
