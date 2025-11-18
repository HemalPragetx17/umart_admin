import { Col, Row } from 'react-bootstrap';
const General = () => {
  return (
    <>
      <div className="card bg-light pt-2 mb-6 mb-xl-9 border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder">Product category</h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <Row className="align-items-center">
            <Col
              lg={6}
              className="mb-5"
            >
              <Row className="align-items-center">
                <Col lg={4}>
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3 required"
                  >
                    Primary category
                  </label>
                </Col>
                <Col lg={8}></Col>
              </Row>
            </Col>
            <Col
              lg={6}
              className="mb-5"
            >
              <Row className="align-items-center">
                <Col lg={4}>
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3 required"
                  >
                    Sub category
                  </label>
                </Col>
                <Col lg={8}></Col>
              </Row>
            </Col>
            <Col
              lg={6}
              className="mb-5"
            >
              <Row className="align-items-center">
                <Col lg={4}>
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3"
                  >
                    Group category
                  </label>
                </Col>
                <Col lg={8}></Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default General;
