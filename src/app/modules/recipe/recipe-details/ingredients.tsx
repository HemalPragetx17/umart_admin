import { Card, Col, Row } from 'react-bootstrap';
const Ingredients = (props:any) => {
  return (
    <Row>
      {props?.recipeData?.ingredients.map((item: any, index: number) => (
        <Col xs={12}>
          <Card className="border mb-8">
            <Card.Header className="bg-light align-items-center">
              <h3 className="fs-22 fw-bolder mb-0">{item?.title || ''}</h3>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <>
                  {' '}
                  {item?.variants &&
                    item?.variants.length &&
                    item?.variants.map((item: any) => {
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
                                    {item?.reference?.product?.category
                                      ?.title || 'NA'}
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
                </>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default Ingredients;
