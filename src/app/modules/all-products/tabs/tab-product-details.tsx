import { Card, Col, Row } from 'react-bootstrap';
import Method from '../../../../utils/methods';
import carton from '../../../../umart_admin/assets/media/product/cartoon.png';
import Loader from '../../../../Global/loader';
const TabProductDetails = (props: any) => {
  if (!props.productDetails)
    return (
      <Row className=" d-flex justify-content-center">
        <Col>
          <div className="w-50 m-auto text-center">
            <Loader />
          </div>
        </Col>
      </Row>
    );
  return (
    <>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">Basic details</h3>
        </Card.Header>
        <Card.Body>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">Product title:</label>
            </Col>
            <Col lg={10}>
              <span className="fw-bolder fs-16 fw-600 text-dark">
                {props.productDetails?.title}{' '}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">
                Product added on:
              </label>
            </Col>
            <Col lg={10}>
              <span className="fs-16 fw-600 text-dark">
                {Method.convertDateToDDMMYYYYHHMMAMPM(
                  props.productDetails?._createdAt
                )}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">Brand:</label>
            </Col>
            <Col lg={10}>
              <span className="fs-16 fw-600 text-dark">
                {props.productDetails.product.brand.title}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">
                Country of origin:
              </label>
            </Col>
            <Col lg={10}>
              <span className="fs-16 fw-600 text-dark">
                {props.productDetails.product.country.name}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">
                Product Description:
              </label>
            </Col>
            <div className="col-lg-10">
              <span className="fs-16 fw-600 text-dark">
                {props.productDetails.product.description}
              </span>
            </div>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">Return policy:</label>
            </Col>
            <div className="col-lg-10">
              <span className="fs-16 fw-600 text-dark">
                {' '}
                {props?.productDetails?.isReturnable
                  ? `This item is returnable within ${props.productDetails?.returnHours} hours of delivery.`
                  : `This item is not returnable.`}
              </span>
            </div>
          </Row>
          <Row className="mb-7 align-items-center">
            <Col lg={2}>
              <label className="fs-16 fw-700 text-dark">
                Product category:
              </label>
            </Col>
            <div className="col-lg-10">
              <div className="d-flex align-items-center">
                <div className="d-flex justify-content-center align-items-center w-fit-content bg-gray-100 p-4 px-4 pills-radius me-3">
                  <span className="fw-600 text-black fs-16">
                    Primary category:{' '}
                    {props.productDetails.product.category.title}
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center w-fit-content bg-gray-100 p-4 px-4 pills-radius me-3">
                  <span className="fw-600 text-black fs-16">
                    Sub category:{' '}
                    {props.productDetails.product.subCategory.title}
                  </span>
                </div>
                {props.productDetails.product.groupCategory ? (
                  <div className="d-flex justify-content-center align-items-center w-fit-content bg-gray-100 p-4 px-4 pills-radius me-3">
                    <span className="fw-600 text-black fs-16">
                      Group category:{' '}
                      {props.productDetails.product?.groupCategory?.title}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Row>
          {props.productDetails.product.taxFree ? (
            <></>
          ) : (
            <>
              {props.productDetails.product.productTax ? (
                <Row className="mb-7 align-items-center">
                  <Col lg={2}>
                    <label className="fs-16 fw-700 text-dark">
                      Product tax:
                    </label>
                  </Col>
                  <div className="col-lg-10">
                    <div className="d-flex align-items-center">
                      <div className="d-flex justify-content-center align-items-center w-fit-content p-4 px-4 me-3">
                        <span className="fw-bolder fs-16 fw-600 text-dark">
                          {props.productDetails.product.productTax} %
                        </span>
                      </div>
                    </div>
                  </div>
                </Row>
              ) : (
                <></>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">Product images</h3>
        </Card.Header>
        <Card.Body className="pb-4">
          <Row>
            {props.productDetails.media.map((mediaVal: any, index: number) => {
              return (
                <Col
                  key={index}
                  xs="auto"
                  className="mb-6"
                >
                  <div className="symbol symbol-md-200px symbol-150px w-fit-content border bg-body">
                    <img
                      className="img-fluid object-fit-contain"
                      src={mediaVal.url}
                      alt=""
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">
            {' '}
            <span>
              <img
                src={carton}
                width={27}
                height={24}
                alt=""
              />
            </span>
            {' Unit price details'}
          </h3>
          <Col sm="auto">
            <span className="fs-22 fw-600">
              TSh{' '}
              {Method.formatCurrency(
                props.productDetails.quantityTypes[0].amount
              )}
            </span>
          </Col>
        </Card.Header>
        <Card.Body>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-700 text-dark">Original price:</label>
            </Col>
            <Col lg={10}>
              <span className="fw-bold fs-16 fw-600 text-dark">
                TSh{' '}
                {Method.formatCurrency(
                  props.productDetails.quantityTypes[0].amount
                )}{' '}
                / {'Piece'}
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default TabProductDetails;
