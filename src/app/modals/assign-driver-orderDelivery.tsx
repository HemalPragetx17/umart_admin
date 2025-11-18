import Modal from 'react-bootstrap/Modal';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { Button, Col, Row } from 'react-bootstrap';
import { OrdersDelivery, String } from '../../utils/string';
import { useState } from 'react';
const AssignedDriver = (props: any) => {
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    await props.onSave(props.id, props.routeId, props.oldDeliveryUserId);
    setLoading(false);
  };
  console.log(props);
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-590px "
        className="border-r10px"
      >
        {props.show ? (
          <>
            {' '}
            <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
              <img
                className="close-inner-top"
                width={40}
                height={40}
                src={CrossSvg}
                alt="closebutton"
                onClick={props.onHide}
              />
              <Modal.Title className="fs-26 fw-bolder mw-lg-395px pt-12">
                {`Are you sure you want to assign this delivery to ${props.selectedDriver.name}?`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-5">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="bg-light-danger text-center border-r10px p-3">
                    <span className="fs-18 fw-500">
                      {`${props.selectedDriver.assignedOrders} orders already assigned`}{' '}
                    </span>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="pt-0 pb-8 mb-4 border-top-0">
              <Row className="align-items-center justify-content-center g-3 w-100">
                <Col xs="auto">
                  <Button
                    variant="success"
                    size="lg"
                    className="btn-lg"
                    onClick={() => {
                      handleSave();
                    }}
                    disabled={loading}
                  >
                    {!loading && (
                      <span className="indicator-label fs-16 fw-bold">
                        {OrdersDelivery.modalDriver}
                      </span>
                    )}
                    {loading && (
                      <span
                        className="indicator-progress fs-16 fw-bold"
                        style={{ display: 'block' }}
                      >
                        {String.pleaseWait}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </Button>
                </Col>
              </Row>
            </Modal.Footer>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};
export default AssignedDriver;
