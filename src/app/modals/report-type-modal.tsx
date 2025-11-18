import { Modal, Button, Row, Col } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
type PropsType = {
  show: boolean;
  onHide: () => void;
  onSubmit: (downloadAsPdf: boolean) => Promise<any>;
};
const ReportTypeModal = (props: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [downloadAsPdf, setDownloadAsPdf] = useState(true);
  const handleSubmit = async () => {
    setLoading(true);
    await props.onSubmit(downloadAsPdf);
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
          <div className="symbol symbol-md-40px symbol-35px close-inner-top-3">
            <img
              width={40}
              height={40}
              src={CrossSvg}
              alt="closebutton"
              onClick={() => {
                //   if (!loading) {
                props.onHide();
                //   }
              }}
            />
          </div>
          <Modal.Title className=" mw-lg-450px  mb-0 fs-24 fw-bolder">
            <div>{'Download report as'}</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1 pb-1">
          <Row className="align-items-center mt-6 mb-2">
            <Col
              xs={12}
              className="d-flex  gap-6 justify-content-center"
            >
              {/* <div className="fs-18 fw-500 me-3">Download as</div> */}
              <div className="form-check  d-flex align-items-center me-3 ">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id={`pdf`}
                  value={0}
                  checked={downloadAsPdf}
                  onChange={() => setDownloadAsPdf(true)}
                />
                <label
                  className="form-check-label text-black fs-16 fw-600"
                  htmlFor={`pdf`}
                >
                  Pdf
                </label>
              </div>
              <div className="form-check  d-flex align-items-center me-3 ">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id={`excel`}
                  value={0}
                  checked={!downloadAsPdf}
                  onChange={() => setDownloadAsPdf(false)}
                />
                <label
                  className="form-check-label text-black fs-16 fw-600"
                  htmlFor={`excel`}
                >
                  Excel
                </label>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center  mb-4 border-top-0">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {!loading && <span className="indicator-label">Download</span>}
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
export default ReportTypeModal;
