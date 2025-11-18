import { Button, Modal } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
const DeleteModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const deleteModal = async () => {
    setLoading(true);
    await props.handleDelete(props.selectedUser._id);
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
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            {` Are you sure you want to delete ${props.selectedUser.name}?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          {/* <Button
            variant="light-primary"
            size="lg"
            onClick={props.onHide}
          >
            NO
          </Button> */}
          <Button
            variant="danger"
            size="lg"
            onClick={deleteModal}
            disabled={loading}
          >
            {!loading && <span className="indicator-label">Remove user</span>}
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
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteModal;
