import { Card, Col, Row } from 'react-bootstrap';
import FoodImage from '../../../../umart_admin/assets/media/food/roll.png';
const GeneralInfo = (props: any) => {
  return (
    <div>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">Basic details</h3>
        </Card.Header>
        <Card.Body>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-600 text-dark"> Title:</label>
            </Col>
            <Col lg={10}>
              <span className="fw-bolder fs-16 fw-600 text-dark">
                {props?.recipeData?.title || ''}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-500 text-dark">Description:</label>
            </Col>
            <Col lg={10}>
              <span className="fs-16 fw-600 text-dark">
                {props?.recipeData?.description || ''}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-500 text-dark">Ingredients:</label>
            </Col>
            <Col lg={10}>
              <span className="fs-16 fw-600 text-dark">
                {props?.recipeData?.ingredients.map(
                  (item: any, index: number) =>
                    index !== props?.recipeData?.ingredients.length - 1
                      ? item?.title + ' , '
                      : item?.title
                )}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-500 text-dark">Servings:</label>
            </Col>
            <Col lg={10}>
              <span className="fs-16 fw-600 text-dark">
                {props?.recipeData?.serving || 0}
              </span>
            </Col>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-500 text-dark">Cook time:</label>
            </Col>
            <div className="col-lg-10">
              <span className="fs-16 fw-600 text-dark">
                {props?.recipeData?.cookTime || 0} min
              </span>
            </div>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-500 text-dark">Type:</label>
            </Col>
            <div className="col-lg-10">
              <span className="fs-16 fw-600 text-dark">
                {' '}
                {props?.recipeData?.recipeType.map((item: any, index: number) =>
                  index !== props?.recipeData?.recipeType.length - 1
                    ? item?.option + ' , '
                    : item?.option
                )}
              </span>
            </div>
          </Row>
          <Row className="mb-7">
            <Col lg={2}>
              <label className=" fs-16 fw-500 text-dark">Recipe:</label>
            </Col>
            <div className="col-lg-10">
              <div
                className="fs-16 fw-600 text-dark"
                dangerouslySetInnerHTML={{
                  __html: props?.recipeData?.recipeSteps,
                }}
              />
            </div>
          </Row>
        </Card.Body>
      </Card>
      <Card className="border mb-8">
        <Card.Header className="bg-light align-items-center">
          <h3 className="fs-22 fw-bolder mb-0">Recipe images</h3>
        </Card.Header>
        <Card.Body className="pb-4 ">
          <Row className='d-flex gx-3'>
            {props.recipeData.media.map((mediaVal: any, index: number) => {
              return (
                <Col
                  key={index}
                  xs="auto"
                  className="mb-6"
                >
                  <div className="symbol symbol-md-180px symbol-150px w-fit-content border bg-body">
                    <img
                      className="img-fluid object-fit-contain"
                      src={mediaVal?.url || ''}
                      alt=""
                    />
                  </div>
                </Col>
              );
            })}
            {/* <Col
              key={1}
              xs="auto"
              className="mb-6"
            >
              <div className="symbol symbol-md-200px symbol-150px w-fit-content border bg-body">
                <img
                  className="img-fluid object-fit-contain"
                  src={FoodImage}
                  alt=""
                />
              </div>
            </Col>
            <Col
              key={2}
              xs="auto"
              className="mb-6"
            >
              <div className="symbol symbol-md-200px symbol-150px w-fit-content border bg-body">
                <img
                  className="img-fluid object-fit-contain"
                  src={FoodImage}
                  alt=""
                />
              </div>
            </Col> */}
          
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
export default GeneralInfo;
