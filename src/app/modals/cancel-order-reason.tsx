import { Modal, Button, Col, Form, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import clsx from 'clsx';
import { useState } from 'react';
interface IPropsType {
  show: boolean;
  onHide: () => void;
  customerName: string;
  orderRef: string;
  handleSubmit: any;
}
function CancelOrderModal(props: IPropsType) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const handleChange = (value: string) => {
    if (value.trim().length === 0) {
      setValidation(true);
    } else {
      setValidation(false);
    }
    setReason(value);
  };
  const handleSubmit = async () => {
    const tempValidation = reason.trim().length === 0;
    if (!tempValidation) {
      setLoading(true);
      await props.handleSubmit(reason);
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  const handleClose = () => {
    if (loading) return;
    props.onHide();
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-600px"
        className="border-r10px"
        centered
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto d-flex flex-column">
          <img
            className="close-inner-top"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={handleClose}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            Are you sure you want to cancel this order of?
          </Modal.Title>
          <div className="fs-18 fw-semibold mt-3">
            {`#${props?.orderRef} / ${props?.customerName}`}
          </div>
        </Modal.Header>
        <Row className="d-flex justify-content-center mt-4">
          <Col lg={10}>
            <Form.Control
              className={clsx(
                'form-control-custom border bg-gray',
                validation ? 'border-danger' : ''
              )}
              placeholder="Please type the reason here..."
              as="textarea"
              rows={5}
              value={reason}
              onChange={(event: any) => {
                handleChange(event.target.value.trimStart());
              }}
            />
          </Col>
        </Row>
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          <Button
            variant="danger"
            disabled={loading}
            size="lg"
            onClick={handleSubmit}
          >
            {!loading && (
              <span className="indicator-label fs-16 fw-bold">
                Yes, cancel this order
              </span>
            )}
            {loading && (
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
export default CancelOrderModal;
