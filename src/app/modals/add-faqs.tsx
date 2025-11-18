import { Button, Form, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import clsx from 'clsx';
import { String } from '../../utils/string';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { faqString } from './../../utils/string';
import APICallService from '../../api/apiCallService';
import { cmsPages } from '../../api/apiEndPoints';
import { success } from '../../Global/toast';
import { cmsToast } from '../../utils/toast';
const AddFaqs = (props: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [faqData, setFaqData] = useState<{
    question: string;
    answer: string;
  }>({
    question: props.question || '',
    answer: props.answer || '',
  });
  const [faqValidation, setFaqValidation] = useState<{
    question: boolean;
    answer: boolean;
  }>({
    question: false,
    answer: false,
  });
  const handleChange = (value: string, name: string) => {
    const temp: any = { ...faqData };
    const tempValidation: any = { ...faqValidation };
    if (value.length === 0) {
      tempValidation[name] = true;
    } else {
      tempValidation[name] = false;
    }
    temp[name] = value;
    setFaqData(temp);
    setFaqValidation(tempValidation);
  };
  const handleSubmit = async () => {
    const temp = { ...faqData };
    const tempValidation = { ...faqValidation };
    if (temp.question.trim().length === 0) {
      tempValidation.question = true;
    }
    if (temp.answer.trim().length === 0) {
      tempValidation.answer = true;
    }
    if (!tempValidation.answer && !tempValidation.question) {
      setLoading(true);
      const data = {
        question: faqData.question,
        answer: faqData.answer,
      };
      let endPoint;
      let params: any = undefined;
      if (props.title === 'Add') {
        endPoint = cmsPages.addFaq;
      }
      if (props.title === 'Edit') {
        endPoint = cmsPages.editFaq;
        params = {
          _id: props.id,
        };
      }
      const apiService = new APICallService(endPoint, faqData, params);
      const response = await apiService.callAPI();
      if (response) {
        if (props.title === 'Add') {
          success(cmsToast.faqAdded);
        } else if (props.title === 'Edit') {
          success(cmsToast.faqUpdated);
        }
        props.onHide();
      }
      setLoading(false);
    }
    setFaqValidation(tempValidation);
  };
  return (
    <>
      <Modal
        {...props}
        show={props.show}
        title={props.title}
        onHide={props.handleClose}
        dialogClassName="modal-dialog-centered min-w-lg-600px"
        className="border-r10px"
      >
        <Modal.Header className="border-bottom-0 pb-6 text-center mx-auto">
          <img
            className="close-inner-top-3 my-4 mx-2"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.handleClose}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px mt-8">
            {props.title} {faqString.modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="align-items-center mx-4 my-3">
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="fs-16 fw-500">
                {faqString.question}
              </Form.Label>
              <Form.Control
                className={clsx(
                  'form-control-custom bg-light',
                  faqValidation.question ? 'border-danger' : 'border'
                )}
                value={faqData.question}
                onChange={(event: any) =>
                  handleChange(event.target.value.trimStart(), 'question')
                }
                // disabled={loading}
                placeholder="Type here..."
              />
              {/* {validation.vendorCategory && (
              <div className="fv-plugins-message-container">
                <span className="text-danger fs-12 fw-bold">
                  {validationError?.message}
                </span>
              </div>
            )} */}
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="pt-7 fs-16 fw-500">
                {faqString.answer}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                className={clsx(
                  'form-control-custom bg-light',
                  faqValidation.answer ? 'border-danger' : 'border'
                )}
                value={faqData.answer}
                onChange={(event: any) =>
                  handleChange(event.target.value.trimStart(), 'answer')
                }
                // disabled={loading}
                placeholder="Type here..."
              />
              {/* {validation.vendorCategory && (
              <div className="fv-plugins-message-container">
                <span className="text-danger fs-12 fw-bold">
                  {validationError?.message}
                </span>
              </div>
            )} */}
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center pt-1 mb-4 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {!loading && (
              <span className="indicator-label fs-16 fw-bold">
                {faqString.save}
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
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddFaqs;
