import { Modal, Button, Col, Form, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import clsx from 'clsx';
import { useState } from 'react';
function MissingProductModal(props: any) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (value: any) => {
    setDescription(value);
  };
  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-650px"
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
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            Are you sure you want to mark goods as missing goods?
          </Modal.Title>
          <div className="fs-18 fw-semibold mt-3">{props.text}</div>
        </Modal.Header>
        <Row className="d-flex justify-content-center mt-4">
          <Col lg={10}>
            <Form.Control
              className={clsx(
                'form-control-custom border bg-white'
                //   generalDataValidation.description ? 'border-danger' : ''
              )}
              placeholder="Please type the reason here..."
              as="textarea"
              rows={5}
              value={description}
              onChange={(event: any) => {
                handleChange(event.target.value.trimStart());
              }}
            />
          </Col>
        </Row>
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          <Button
            variant="primary"
            disabled={loading}
            size="lg"
            onClick={async () => {
              setLoading(true);
              const temp: any = {
                ...props.data,
                reason: props.data.missing,
                note: description,
              };
              await props.handleSubmit(temp);
              setLoading(false);
            }}
          >
            {!loading && (
              <span className="indicator-label fs-16 fw-bold">
                Yes, mark as missing
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
export default MissingProductModal;
