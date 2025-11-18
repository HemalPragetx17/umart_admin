import { Card, Col, Row } from 'react-bootstrap';
import { IRewardDetails } from '../../../../../types/responseIndex';
type PropTypes = {
  rewardDetails: IRewardDetails | undefined;
};
const bannerPlaceMent = [
  'Home page',
  'Category page',
  'Product page',
  'Brand page',
];
const BasicDetails = ({ rewardDetails }: PropTypes) => {
  
  return (
    <Row>
      <Col xs={12}>
        <Card className="border mb-8">
          <Card.Header className="bg-light align-items-center">
            <h3 className="fs-22 fw-bolder mb-0">Basic details</h3>
          </Card.Header>
          <Card.Body>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">Reward name:</label>
              </Col>
              <Col lg={10}>
                <span className="fw-bolder fs-16 fw-600 text-dark">
                  {rewardDetails?.title || 'NA'}
                </span>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">
                  Banner placement:
                </label>
              </Col>
              <Col lg={10}>
                <span className="fs-16 fw-600 text-dark">
                  {rewardDetails?.placement
                    ? bannerPlaceMent[rewardDetails.placement - 1]
                    : '-'}
                </span>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">
                  Applicable reward:
                </label>
              </Col>
              <Col lg={10}>
                <Row>
                  {rewardDetails?.purchaseRanges.map((item, index) => {
                    return (
                      <Col
                        lg={12}
                        className="mb-3"
                        key={index + item.coin}
                      >
                        <span className="fs-16 fw-600 text-dark">
                          {`${item.coin} coins on purchasing between ${item.minOrderValue} TSh to ${item.maxOrderValue} TSh.`}
                        </span>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">Description:</label>
              </Col>
              <Col lg={10}>
                <span className="fs-16 fw-600 text-dark">
                  {rewardDetails?.description || ''}
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default BasicDetails;
