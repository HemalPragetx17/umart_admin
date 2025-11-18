import { Button, Modal } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
const CustomDeleteModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const deleteModal = async () => {
    setLoading(true);
    await props.handleDelete();
    setLoading(false);
  };
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
            onClick={!loading ? props.onHide : () => {}}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            {props.title}
          </Modal.Title>
        </Modal.Header>
        {props.error && (
          <Modal.Body className="pt-5 pb-1">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {props.error && (
                  <div className="bg-light-danger text-center border-r10px p-3">
                    <span className="fs-18 fw-500">{props.error}</span>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
        )}
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          {!props.error ? (
            <Button
              variant="danger"
              size="lg"
              onClick={deleteModal}
              disabled={loading}
            >
              {!loading && (
                <span className="indicator-label">{props.btnTitle}</span>
              )}
              {loading && (
                <span
                  className="indicator-progress"
                  style={{ display: 'block' }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </Button>
          ) : (
            <></>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CustomDeleteModal;
