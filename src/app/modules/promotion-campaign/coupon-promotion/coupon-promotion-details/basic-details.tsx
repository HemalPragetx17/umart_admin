import { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { ICouponDetails } from '../../../../../types/responseIndex';
import { customerJSON } from '../../../../../api/apiJSON/customer';
import Method from '../../../../../utils/methods';
import { FlatDiscount } from '../../../../../utils/constants';
type PropTypes = {
  couponDetails : ICouponDetails | undefined
}
const bannerPlaceMent = [
  'Home page',
  'Category page',
  'Product page',
  'Brand page',
];
const BasicDetails = ({couponDetails}:PropTypes) => {
    const [bannerDetails,setBannerDetails] = useState<any>();
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
                <label className=" fs-16 fw-700 text-dark">Coupon code:</label>
              </Col>
              <Col lg={10}>
                <span className="fw-bolder fs-16 fw-600 text-dark">
                  {/* {props.productDetails?.title}{' '} */}
                  GDFGDF34535
                </span>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">
                  Per user limit:
                </label>
              </Col>
              <Col lg={10}>
                <span className="fw-bolder fs-16 fw-600 text-dark">
                  {couponDetails?.redemptionLimit || '-'}
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
                <span className="fw-bolder fs-16 fw-600 text-dark">
                  {couponDetails?.placement
                    ? bannerPlaceMent[couponDetails.placement - 1]
                    : ''}
                </span>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">
                  Discount value:
                </label>
              </Col>
              <Col lg={10}>
                <span className="fw-bolder fs-16 fw-600 text-dark">
                  {`${couponDetails?.discountValue}`}
                  {`${
                    couponDetails?.discountType.toString() === FlatDiscount
                      ? ' TSh'
                      : '%'
                  }`}
                </span>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">
                  Minimum purchase amount:
                </label>
              </Col>
              <Col lg={10}>
                <span className="fs-16 fw-600 text-dark">
                  {' '}
                  {couponDetails?.minimumPurchaseAmount
                    ? Method.formatCurrency(
                        couponDetails.minimumPurchaseAmount
                      ) + ' TSh'
                    : ''}
                </span>
              </Col>
            </Row>
            <Row className="mb-7">
              <Col lg={2}>
                <label className=" fs-16 fw-700 text-dark">Description:</label>
              </Col>
              <Col lg={10}>
                <span className="fs-16 fw-600 text-dark">
                  {couponDetails?.description || ''}
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      {couponDetails?.variants && couponDetails.variants.length > 0 ? (
        <Col xs={12}>
          <Card className="border mb-8">
            <Card.Header className="bg-light align-items-center">
              <h3 className="fs-22 fw-bolder mb-0">
                {'List of added products'}
              </h3>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                {!!couponDetails?.variants &&
                  couponDetails?.variants.length &&
                  couponDetails?.variants.map((item: any) => {
                    return (
                      <Col
                        md={6}
                        lg={4}
                        key={item._id}
                      >
                        <div className="border border-r8px p-5 py-6 border-1 border-gray-300">
                          <div className="d-flex align-items-center">
                            <div className="me-5 position-relative">
                              <div className="symbol symbol-50px border">
                                <img
                                  src={item?.reference?.media[0]?.url || ''}
                                  alt=""
                                />
                              </div>
                            </div>
                            <div>
                              <span className="fs-18 fw-600 w-lg-175px">
                                {item?.reference?.title
                                  ? item?.reference?.title.length > 22
                                    ? item.reference?.title.substring(0, 22) +
                                      '...'
                                    : item?.reference?.title
                                  : 'Na'}
                              </span>
                              <div className="fs-16 fw-500 text-gray">
                                <span className="me-3">
                                  {item?.reference?.product?.category?.title ||
                                    'NA'}
                                </span>
                                <span>
                                  {item?.reference?.product?.subCategory
                                    ?.title || 'NA'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        <></>
      )}
    </Row>
  );
};
export default BasicDetails;
