import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useRef, useState } from 'react';
import OtpInput from '../custom/otp-input/otp-input';
const SelfOrderDeliverModal = (props: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState<any>([]);
  const handleSubmit = async () => {
    setLoading(true);
    await props.handleSubmit(props.data._id, otp.join(''));
    setLoading(false);
  };
  const onChange = (value: string) => {
    setOtp(value);
  };
  const isOtpEmpty = otp.length === 4;
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
          Please enter otp to deliver this order?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap mb-2 justify-content-center">
          <div className="d-flex flex-wrap ">
            <OtpInput
              value={otp}
              valueLength={4}
              onChange={onChange}
              inputRefs={inputRefs}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={loading || otp.join('').trim().length !== 4}
        >
          {!loading && (
            <span className="indicator-label">Deliver this order</span>
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
export default SelfOrderDeliverModal;
