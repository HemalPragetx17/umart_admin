import { Button, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import Method from '../../utils/methods';
import { BuyerFeedback } from '../../utils/constants';
function SuggestedProductModal(props: any) {
  return (
    <>
      {props.inquiryData ? (
        <Modal
          {...props}
          show={props.show}
          onHide={props.onHide}
          dialogClassName="modal-dialog-centered min-w-lg-590px"
          className="border-r10px"
          centered
        >
          <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
            <Button variant="">
              <img
                className="close-inner-top"
                width={40}
                height={40}
                src={CrossSvg}
                alt="closebutton"
                onClick={props.onHide}
              />
            </Button>
          </Modal.Header>
          <Modal.Body className=" pt-0">
            <Row className="px-lg-6 gy-1 justify-content-center">
              <Col
                xs={12}
                className="text-center"
              >
                <h5 className="fs-26 fw-bolder">
                  {/* {props.inquiryData.name
                    ? props.inquiryData.name
                    : props.inquiryData.user.name} */}
                  {/* {props.inquiryData.type === BuyerFeedback
                    ? props.inquiryData.user
                      ? props.inquiryData.user.name
                      : '-'
                    : props.inquiryData?.name || '-'} */}
                  {props.inquiryData?.buyerName || ''}
                </h5>
                <span className="fs-18 fw-500 text-gray">
                  {/* Customer ,{' '} */}
                  {/* {props.inquiryVal._createdAt
                    ? Method.convertDateToDDMMYYYYHHMMAMPM(
                        inquiryVal._createdAt
                      )
                    : '-'} */}
                  {props.inquiryData._createdAt
                    ? Method.convertDateToDDMMYYYYHHMMAMPM(
                        props.inquiryData._createdAt
                      )
                    : '-'}
                </span>
              </Col>
              <Col
                xs={11}
                className="text-center"
              >
                <p className="fs-18 fw-500">{props.inquiryData.message}</p>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
export default SuggestedProductModal;
