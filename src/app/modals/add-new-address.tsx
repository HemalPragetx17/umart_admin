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
import AutoComplete from '../custom/autoComplete';
import { CustomSelectWhite } from '../custom/Select/CustomSelectWhite';
import { useEffect, useState } from 'react';
import { APIkey, Order } from '../../utils/constants';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import Validations from '../../utils/validations';
import { success } from '../../Global/toast';
import { placeOrderToast } from '../../utils/toast';
const AddNewAddress = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<{
    name: string;
    phoneCountry: string;
    phone: string;
    addressLine1: string;
    landmark: string;
    city: string;
    district: string;
    districtName: string;
    lat: string;
    lng: string;
    houseNumber: string;
    floorNumber: string;
    buildingName: string;
  }>({
    name: props?.selectedCustomer?.name || '',
    phoneCountry: '+255',
    phone: props?.selectedCustomer?.phone || '',
    addressLine1: '',
    districtName: '',
    landmark: '',
    city: '',
    district: '',
    lat: '1',
    lng: '1',
    houseNumber: '',
    floorNumber: '',
    buildingName: '',
  });
  const [validation, setValidation] = useState<{
    name: boolean;
    phone: boolean;
    addressLine1: boolean;
    landmark: boolean;
    city: boolean;
    district: boolean;
    houseNumber: boolean;
    floorNumber: boolean;
    buildingName: boolean;
  }>({
    name: false,
    phone: false,
    addressLine1: false,
    landmark: false,
    city: false,
    district: false,
    houseNumber: false,
    floorNumber: false,
    buildingName: false,
  });
  const [districtList, setDistrictList] = useState<any>([]);
  useEffect(() => {
    (async () => {
      await fetchDistrictList();
    })();
  }, []);
  const fetchDistrictList = async () => {
    setFetchLoader(true);
    const apiCallService = new APICallService(placeOrder.getDisctricList, {},'','',false,'',Order);
    const response = await apiCallService.callAPI();
    if (response) {
      const temp = response.records.map((item: any) => ({
        value: item._id,
        title: item.name,
        label: item.name,
      }));
      setDistrictList(temp);
    }
    setFetchLoader(false);
  };
  const handleAddressChange = async (
    value: string,
    lat: string,
    lng: string
  ) => {
    let tempValidation = JSON.parse(JSON.stringify({ ...validation }));
    let temp = { ...deliveryAddress };
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${APIkey}`;
    await fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          const results = data.results[0];
          let districtMatched = false;
          // Extract city and district from the address components
          for (const component of results.address_components) {
            if (component.types.includes('administrative_area_level_3')) {
              if (!districtMatched) {
                temp.districtName = component.long_name;
                // tempValidation.district = false;
                districtMatched = true;
              }
            } else if (
              component.types.includes('administrative_area_level_2')
            ) {
              if (!districtMatched) {
                temp.districtName = component.long_name;
                // tempValidation.district = false;
                districtMatched = true;
              }
            } else if (
              component.types.includes('administrative_area_level_1')
            ) {
              if (!districtMatched) {
                temp.districtName = component.long_name;
                // tempValidation.district = false;
                districtMatched = true;
              }
            }
            if (!districtMatched) {
              // temp.districtName = '';
              // tempValidation.district = true;
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    temp.addressLine1 = value.trimStart();
    temp.lat = lat;
    temp.lng = lng;
    setDeliveryAddress(temp);
    if (!value.trimStart().length) {
      tempValidation.addressLine1 = true;
    } else {
      tempValidation.addressLine1 = false;
    }
    setValidation(tempValidation);
  };
  const handleChange = (value: string, name: string) => {
    const temp: any = { ...deliveryAddress };
    const tempValidation: any = { ...validation };
    if (value.trim().length > 0 && name !== 'landmark') {
      tempValidation[name] = false;
    } else {
      tempValidation[name] = true;
    }
    temp[name] = value;
    setDeliveryAddress(temp);
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
  const handleDistrict = async (event: any) => {
    const temp = { ...deliveryAddress };
    const tempValidation = { ...validation };
    if (event) {
      temp.district = event.value;
      temp.districtName = event.label;
      tempValidation.district = false;
    } else {
      tempValidation.district = true;
    }
    setDeliveryAddress(temp);
    setValidation(tempValidation);
  };
  const handleSubmit = async () => {
    const temp = { ...deliveryAddress };
    let tempValidation = { ...validation };
    tempValidation = {
      name: temp.name.trim().length === 0,
      addressLine1: temp.addressLine1.trim().length === 0,
      city: false,
      district: temp.district.trim().length === 0,
      phone: temp.phone.trim().length === 0,
      floorNumber: temp.floorNumber.trim().length === 0,
      buildingName: temp.buildingName.trim().length === 0,
      houseNumber: temp.houseNumber.trim().length === 0,
      landmark: false,
    };
    const valid = await Validations.validateObject(tempValidation);
    if (valid) {
      setLoading(true);
      const apiCallService = new APICallService(
        placeOrder.addNewAddress,
        {
          ...deliveryAddress,
          addressType: 1,
        },
        {
          id: props?.selectedCustomer?.value || '',
        },
        '',
        false,
        '',
        Order
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(placeOrderToast.addressAdded);
        props.setCustomerAddress((prev: any) => [...prev, response]);
        props.onHide();
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
          Add new address
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
                  value={deliveryAddress.name}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'name');
                  }}
                  placeholder="Enter name"
                />
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
                    value={deliveryAddress.phone}
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="Enter phone number"
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  Address line 1
                </FormLabel>
                <AutoComplete
                  address={deliveryAddress.addressLine1}
                  handleAddressChange={handleAddressChange}
                  lat={deliveryAddress.lat}
                  lng={deliveryAddress.lng}
                  border={clsx(validation.addressLine1 ? '#e55451' : '')}
                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  House / Flat no.
                </FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.houseNumber ? 'border-danger' : ''
                  )}
                  value={deliveryAddress.houseNumber}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'houseNumber');
                  }}
                  placeholder='Enter house / flat no.'
                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  Floor no.
                </FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.floorNumber ? 'border-danger' : ''
                  )}
                  value={deliveryAddress.floorNumber}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'floorNumber');
                  }}
                  placeholder='Enter floor no.'
                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  Building name
                </FormLabel>
                <Form.Control
                  className={clsx(
                    'form-control-custom bg-white',
                    validation.buildingName ? 'border-danger' : ''
                  )}
                  value={deliveryAddress.buildingName}
                  onChange={(event: any) => {
                    handleChange(
                      event.target.value.trimStart(),
                      'buildingName'
                    );
                  }}
                  placeholder='Enter building name'
                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark required">
                  District
                </FormLabel>
                <CustomSelectWhite
                  border={validation.district ? '#e55451' : ''}
                  disabled={loading}
                  isLoading={fetchLoader}
                  default={districtList[0] ? districtList[0] : []}
                  options={districtList}
                  loadingMessage={'Fetching Data'}
                  // onMenuScrollToBottom={onMenuScrollToBottom}
                  onChange={(e: any) => handleDistrict(e)}
                  placeholder='Select district'

                />
              </Col>
              <Col md={6}>
                <FormLabel className="fs-16 fw-500 text-dark">
                  Landmark
                </FormLabel>
                <Form.Control
                  className={clsx('form-control-custom bg-white')}
                  value={deliveryAddress.landmark}
                  onChange={(event: any) => {
                    handleChange(event.target.value.trimStart(), 'landmark');
                  }}
                  placeholder='Enter landmark'
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
          {!loading && <span className="indicator-label">Add address</span>}
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
export default AddNewAddress;
