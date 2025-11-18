import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
const DeliveredOrderModal = (props: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const id = `${props.routeUser}/${props.route}`;
    await props.handleSubmit(id, props.order);
    setLoading(false);
  };
  return (
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
          className="close-inner-top cursor-pointer"
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
        <Modal.Title className="fs-26 fw-bolder mw-lg-425px pt-lg-3">
          Are you sure you want to deliver this order?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {!loading && (
            <span className="indicator-label"> Yes, deliver this order</span>
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
      </Modal.Footer>
    </Modal>
  );
};
export default DeliveredOrderModal;
