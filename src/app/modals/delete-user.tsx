import { Modal, Button } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
const DeleteUserModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const deleteDraftProduct = async () => {
    setLoading(true);
    await props.handleDelete(props.deleteId);
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
        {...(loading ? { backdrop: 'static' } : {})}
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <img
            className="close-inner-top"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={() => {
              if (!loading) {
                props.onHide();
              }
            }}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            Are you sure you want to remove {props.title}?
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
            <>
              {' '}
              <Button
                variant="success"
                size="lg"
                onClick={props.onHide}
                disabled={loading}
              >
                No
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={deleteDraftProduct}
                disabled={loading}
              >
                {!loading && <span className="indicator-label">Delete</span>}
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
            </>
          ) : (
            <></>
          )}
        </Modal.Footer>
        {/* {props.flag && (
        )} */}
      </Modal>
    </>
  );
};
export default DeleteUserModal;
