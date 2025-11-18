import { Modal, Button } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import { instantOrderApiJson } from '../../api/apiJSON/placeOrder';
import { success } from '../../Global/toast';
import { placeOrderToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
const InstantOrderDeliverModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const handlePlaceOrder = async () => {
    setLoading(true);
   await props.handleDeliver(props.id);
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
            Are you sure the order has been delivered successfully?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {/* <div className="row justify-content-center">
            <div className="col-lg-10">
                <div>
                    {''}
                </div>
                <div></div>
            </div>
          </div> */}
        </Modal.Body>
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {!loading && (
              <span className="indicator-label">
                Yes, mark goods as delivered
              </span>
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
        {/* {props.flag && (
        )} */}
      </Modal>
    </>
  );
};
export default InstantOrderDeliverModal;
