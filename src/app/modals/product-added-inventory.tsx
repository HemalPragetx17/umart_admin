import { Modal, Row, Col } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import ProdImage from '../../umart_admin/assets/media/product/nutro.png';
import { InventoryString } from '../../utils/string';
const ProductAddedModal = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-590px"
        className="border-r10px"
        centered
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <img
            className="close-inner-top"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            <Row>
              <Col
                xs="auto"
                className="mb-1"
              >
                <div className="d-flex flex-column align-items-start">
                  <div className="symbol symbol-md-200px symbol-150px w-fit-content border bg-body  ">
                    <img
                      className="img-fluid object-fit-contain"
                      src={props.image}
                      alt=""
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="justify-content-center  mb-4 border-top-0 d-flex mx-10">
          <h2 className="fs-26 fw-bolder">Product added to the inventory!</h2>
          <div className="fs-20 text-center bg-secondary text-black p-3 rounded mt-5 bg-f9f9f9">
            <h3>{InventoryString.addedText}</h3>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ProductAddedModal;
