import {
  Button,
  Card,
  Col,
  Form,
  FormLabel,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import clsx from 'clsx';
import { useState } from 'react';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import Validations from '../../utils/validations';
import { success } from '../../Global/toast';
import { placeOrderToast } from '../../utils/toast';
import { Order } from '../../utils/constants';
import BlankImg from '../../umart_admin/assets/media/avatars/blank.png';
const AddNewCustomerModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<{
    name: string;
    phoneCountry: string;
    phone: string;
    email: string;
    tinNumber: string;
    vrnNumber: string;
  }>({
    name: '',
    phoneCountry: '+255',
    phone: '',
    email: '',
    tinNumber: '',
    vrnNumber: '',
  });
  const [validation, setValidation] = useState<{
    name: boolean;
    phone: boolean;
    email: boolean;
    tinNumber: boolean;
    vrnNumber: boolean;
  }>({
    name: false,
    phone: false,
    email: false,
    tinNumber: false,
    vrnNumber: false,
  });
  const handleChange = (value: string, name: string) => {
    const temp: any = { ...customerDetails };
    const tempValidation: any = { ...validation };
    if (name === 'phone') {
      value = value.split('.')[0];
      if (!Validations.allowNumberAndFloat(value)) {
        return;
      }
    }
    if (name === 'tinNumber' || name === 'vrnNumber') {
      value = value.split('.')[0];
      if (value.trim().length > 0 && !Validations.isAlphanumeric(value)) {
        return;
      }
    }
    if (value.trim().length > 0) {
      tempValidation[name] = false;
    } else if (name !== 'tinNumber' && name !== 'vrnNumber') {
      tempValidation[name] = true;
    }
    if (name === 'tinNumber' || name === 'vrnNumber') {
      tempValidation[name] = false;
    }
    temp[name] = value;
    setCustomerDetails(temp);
    setValidation(tempValidation);
  };
  const handleOnKeyPress = async (event: any) => {
    // Allow only numbers
    const key = event.key;
    let validations = await Validations.allowOnlyNumbers(key);
    if (!validations) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    const temp = { ...customerDetails };
    let tempValidation = { ...validation };
    tempValidation = {
      name: temp.name.trim().length === 0 || temp.name.trim().length > 45,
      phone: temp.phone.trim().length === 0,
      email:
        temp.email.trim().length > 0 && !Validations.validateEmail(temp.email),
      tinNumber:
        temp.tinNumber.trim().length > 0 && temp.tinNumber.trim().length !== 9,
      vrnNumber:
        temp.vrnNumber.trim().length > 0 && temp.vrnNumber.trim().length !== 9,
    };
    const valid = await Validations.validateObject(tempValidation);
    if (valid) {
      setLoading(true);
      const apiCallService = new APICallService(
        placeOrder.addCustomers,
        {
          ...temp,
          tinNumber: temp.tinNumber.trim().toUpperCase(),
          vrnNumber: temp.vrnNumber.trim().toUpperCase(),
        },
        '',
        '',
        false,
        '',
        Order
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(placeOrderToast.customerAdded);
        props.onClose();
        const tempResponse = {
          label: (
            <>
              <div className="d-flex">
                <div className="me-3 h-40px w-30px">
                  <img
                    src={response?.image || BlankImg}
                    className="object-fit-contain h-40px w-30px"
                  />
                </div>
                <div>
                  <span className="fs-16 fw-600 text-black mb-0">
                    {response?.name ? response.name : '-'}
                  </span>
                  <span className="fs-14 fw-500 text-gray-600 mb-0 d-block">
                    {response.phoneCountry + ' ' + response.phone}
                  </span>
                </div>
              </div>
            </>
          ),
          value: response._id,
          id: response._id,
          title: response?.name ? response.name : '-',
          name: response?.name || '-',
          phone: response?.phone || '',
        };
        props.setSelectedCustomer(tempResponse);
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-dialog-centered min-w-lg-794px"
      className="border-r10px"
      centered
      backdrop="static"
    >
      <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
        <img
          className="close-inner-top-2"
          width={40}
          height={40}
          src={CrossSvg}
          alt="closebutton"
          onClick={props.onHide}
        />
        <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
          Add new customer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="bg-f9f9f9 border">
          <Card.Body>
            <Row className="g-6">
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  Name
                </FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.name ? 'border-danger' : ''
                  )}
                  value={customerDetails.name}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'name');
                  }}
                  placeholder="Enter name"
                />
                {validation.name && (
                  <div className="text-danger fs-12">
                    Name is required and should not exceed 45 characters
                  </div>
                )}
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  Phone number
                </FormLabel>
                <InputGroup
                  className={clsx(
                    validation.phone ? 'border border-danger rounded-2' : ''
                  )}
                >
                  <InputGroup.Text className="bg-white border-right-0 fs-16 fw-600 text-black px-6">
                    +255
                  </InputGroup.Text>
                  <Form.Control
                    name="phoneNumber"
                    className="form-control-custom border-active-none bg-white border-left-0 ps-0"
                    aria-label="Default"
                    onChange={async (event: any) => {
                      handleChange(event.target.value, 'phone');
                    }}
                    onKeyPress={(event: any) => {
                      handleOnKeyPress(event);
                    }}
                    value={customerDetails.phone}
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="Enter phone number"
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark">Email</FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.email ? 'border-danger' : ''
                  )}
                  value={customerDetails.email}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'email');
                  }}
                  placeholder="Enter email"
                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark">
                  TIN Number
                </FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.tinNumber ? 'border-danger' : ''
                  )}
                  value={customerDetails.tinNumber}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'tinNumber');
                  }}
                  placeholder="Enter tin number"
                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark">
                  VRN Number
                </FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.vrnNumber ? 'border-danger' : ''
                  )}
                  value={customerDetails.vrnNumber}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'vrnNumber');
                  }}
                  placeholder="Enter vrn number"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="justify-content-center mb-4 border-top-0">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {!loading && <span className="indicator-label">Add customer</span>}
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
export default AddNewCustomerModal;
