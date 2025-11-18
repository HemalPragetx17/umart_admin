import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AllProduct } from '../../../utils/string';
const Products = () => {
  return (
    <Row>
      <Col
        lg={12}
        className="mb-6"
      >
        <h1 className="fs-22 fw-bolder">{AllProduct.allProduct}</h1>
      </Col>
      <Col lg={12}>
        <div className="border border-r10px p-md-9 p-7">
          <h2 className="fs-22 fw-bolder">{AllProduct.startAdding}</h2>
          <p className="fs-18 fw-500 mb-md-8 mb-5">{AllProduct.productBody}</p>
          <Link
            to="add-new-product"
            className="btn btn-primary btn-lg"
          >
            {AllProduct.newProduct}
          </Link>
          <Link
            to="view-all-products"
            className="btn btn-primary btn-lg ms-5"
          >
            {AllProduct.newProduct2}
          </Link>
        </div>
      </Col>
    </Row>
  );
};
export default Products;
