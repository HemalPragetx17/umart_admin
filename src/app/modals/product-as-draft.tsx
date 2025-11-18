import { Modal, Button } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
function ProductAsDraft(props: any) {
  const [loading,setLoading] = useState(false);
  const handleSubmit = async ()=>{
    setLoading(true);
    await props.onSaveAsDraft();
    setLoading(false);
  }
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
            Are you sure you want to save product details as draft?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {!props.loading && (
              <span className="indicator-label fs-16 fw-bold">
                Yes, save as draft
              </span>
            )}
            {props.loading && (
              <span
                className="indicator-progress fs-16 fw-bold"
                style={{ display: 'block' }}
              >
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ProductAsDraft;
