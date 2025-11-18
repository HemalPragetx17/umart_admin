import { Col, Modal } from 'react-bootstrap';
// Media <<
import CrossSvg from '../../../umart_admin/assets/media/close.png';
import GImg1 from '../../../umart_admin/assets/media/product/guidelines/img1.png';
import GImg2 from '../../../umart_admin/assets/media/product/guidelines/img2.png';
import GImg3 from '../../../umart_admin/assets/media/product/guidelines/img3.png';
import { AllProduct } from '../../../utils/string';
function ProductGuidelines(props: any) {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        // contentClassName="py-md-5"
        dialogClassName="modal-dialog-centered min-w-lg-794px"
        className="border-r10px"
      >
        <Modal.Header className="border-bottom-0 pb-6 pt-lg-10">
          <img
            className="close-inner-top-2"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <Modal.Title className="mx-auto fs-26 fw-700">
            {AllProduct.titleProductModal}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-4">
          <div className="text-center px-lg-5 mb-6">
            <p className="fs-18 fw-600">{AllProduct.titleBody}</p>
          </div>
          <div className="details-pending green-tick-li fs-18 img-guide-border">
            <ul className="ps-0 mb-0">
              <li className="details list-group-item p-4 list-item-border d-flex">
                <div className="text-success mx-3"> ✔ </div>
                <span className="fw-600 fs-18">{AllProduct.point1}</span>
              </li>
              <li className="details list-group-item p-4 list-item-border d-flex">
                <div className="text-success mx-3"> ✔ </div>
                <span className="fw-600 fs-18"> {AllProduct.point2}</span>
              </li>
              <li className="details list-group-item p-4 d-flex">
                <div className="text-success mx-3"> ✔ </div>
                <span className="fw-600 fs-18"> {AllProduct.point3}</span>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-12 my-6 mb-4">
              <h6 className="fs-20 fw-bolder">{AllProduct.sampleImage}</h6>
            </div>
            <Col
              lg={3}
              md={4}
              xs={6}
              className="mb-5"
            >
              <img
                className="img-fluid object-fit-contain"
                src={GImg1}
                alt=""
              />
            </Col>
            <Col
              lg={3}
              md={4}
              xs={6}
              className="mb-5"
            >
              <img
                className="img-fluid object-fit-contain"
                src={GImg3}
                alt=""
              />
            </Col>
            <Col
              lg={3}
              md={4}
              xs={6}
              className="mb-5"
            >
              <img
                className="img-fluid object-fit-contain"
                src={GImg2}
                alt=""
              />
            </Col>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
// export {kycRejected}
export default ProductGuidelines;
