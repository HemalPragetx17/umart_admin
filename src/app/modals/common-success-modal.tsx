import { Button, Modal } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
interface IPropsTypes {
  show: boolean;
  onHide: () => void;
  error?: any;
  title: string;
  btnTitle: string;
  handleSave: () => Promise<any>;
}
const CustomSuccessModal = (props: IPropsTypes) => {
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    await props.handleSave();
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
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <img
            className="close-inner-top cursor-pointer"
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
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          {!props.error ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
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
export default CustomSuccessModal;
