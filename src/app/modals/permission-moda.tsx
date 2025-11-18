import { Button, Modal } from 'react-bootstrap';
import CrossSvg from '../../_admin/assets/media/svg_uTrade/cross-rounded-gray.svg';

const PermissionModal = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        size="md"
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-100px"
        className="border-r10px"
        centered
        backdrop="static"
      >
        <Modal.Body className="">
          <Modal.Title className="fs-24 fw-bolder text-center p-2 m-2">
            {/* You do not have sufficient permission to access {props.moduleName} module */}
            {props.error
              ? props.error
              : `You do not have sufficient permission to access ${props.moduleName} module`}
          </Modal.Title>
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={props.onHide}
              disabled={props.loading}
            >
              {!props.loading ? (
                <span className="indicator-label fs-16 fw-bold">Ok</span>
              ) : (
                <span
                  className="indicator-progress fs-16 fw-bold"
                  style={{ display: 'block' }}
                >
                  Please Wait
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PermissionModal;
