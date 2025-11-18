import Modal from 'react-bootstrap/Modal';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { productString } from '../../utils/string';
const ProductAddedSuccessfully = (props: any) => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-590px"
        className="border-r10px"
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 pb-1 pt-lg-10 text-center mx-auto">
          <img
            className="close-inner-top-2"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <div>
            <div className="symbol symbol-160px symbol-md-168px border bg-body">
              <img
                className="img-fluid p-2 object-fit-contain"
                src={props.modalImage}
                alt=""
              />
            </div>
            <Modal.Title className="fs-26 fw-bolder mw-lg-375px mt-5">
              Product added successfully!
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-5 pb-lg-12 pb-8">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center border-r10px bg-light p-3">
                <span className="fs-18 fw-600 text-dark">
                  {/* This product is added successfully. You  <br className="br" />
                  The seller can add this product to their catalogue. */}
                  {productString.productAdded}
                </span>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ProductAddedSuccessfully;
