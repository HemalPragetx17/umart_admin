import clsx from 'clsx';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { DeliverString, String } from '../../../../utils/string';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import uploadIcon from '../../../../umart_admin/assets/media/svg_uMart/upload.svg';
import excleUpload from '../../../../umart_admin/assets/media/svg_uMart/excle-upload.svg';
import EditSVG from '../../../../umart_admin/assets/media/svg_uMart/edit-round.svg';
import CrossIcon from '../../../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
import { fileValidation } from '../../../../Global/fileValidation';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import APICallService from '../../../../api/apiCallService';
import { deliveryUser, inventory } from '../../../../api/apiEndPoints';
import { deliveryUserJSON } from '../../../../api/apiJSON/deliveryUser';
import { success } from '../../../../Global/toast';
import { Auth, masterToast } from '../../../../utils/toast';
import Validations from '../../../../utils/validations';
import CustomDatePicker from '../../../custom/DateRange/DatePicker';
import AutoComplete from '../../../custom/autoComplete';
import { APIkey, Add, Master, DeliveryUser } from '../../../../utils/constants';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { DeliveryUser as DeliverUserEnum } from '../../../../utils/constants';
const AddDeliveryUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date('2023/07/01'));
  const [deliveryData, setDeliveryData] = useState<{
    name: string;
    address: string;
    lat: string;
    lng: string;
    about: string;
    dob: any;
    vehicleNumber: string;
    image: any;
    imageReader: any;
    qrImage: any;
    qrImageReader: any;
    drivingLicense: any;
    vehicleDocument: any;
    vehicleInsurance: any;
    drivingLicenseImageReader: any;
    vehicleDocumentImageReader: any;
    vehicleInsuranceImageReader: any;
    drivingLicenseExpiryDate: any;
    vehicleDocumentExpiryDate: any;
    vehicleInsuranceExpiryDate: any;
    warehouse: string;
    phone: string;
    email: string;
    phoneCountry: string;
    lipaCountryCode: string;
    lipaNumber: string;
  }>({
    name: '',
    address: '',
    lat: '1',
    lng: '1',
    about: '',
    image: '',
    dob: '',
    qrImage: '',
    vehicleNumber: '',
    qrImageReader: null,
    imageReader: {},
    warehouse: '',
    phone: '',
    email: '',
    phoneCountry: '+255',
    lipaCountryCode: '+255',
    lipaNumber: '',
    drivingLicense: '',
    vehicleDocument: '',
    vehicleInsurance: '',
    drivingLicenseImageReader: null,
    vehicleDocumentImageReader: null,
    vehicleInsuranceImageReader: null,
    drivingLicenseExpiryDate: '',
    vehicleDocumentExpiryDate: '',
    vehicleInsuranceExpiryDate: '',
  });
  const [deliveryValidation, setDeliveryValidation] = useState<{
    name: boolean;
    address: boolean;
    about: boolean;
    image: boolean;
    phone: boolean;
    dob: boolean;
    email: boolean;
    warehouse: boolean;
    vehicleNumber: boolean;
    qrImage: boolean;
    lipaNumber: boolean;
  }>({
    name: false,
    address: false,
    about: false,
    image: false,
    phone: false,
    dob: false,
    email: false,
    warehouse: false,
    vehicleNumber: false,
    qrImage: false,
    lipaNumber: false,
  });
  const [warehouses, setWareHouses] = useState<any>([]);
  const [selectedWareHouse, setSelectedWareHouse] = useState('');
  useEffect(() => {
    (async () => {
      if (!Method.hasPermission(DeliveryUser, Add, currentUser)) {
        return window.history.back();
      }
      await fetchWarehouses();
    })();
  }, []);
  const fetchWarehouses = async () => {
    let params = {
      pageNo: 1,
      limit: 0,
      sortKey: 'name',
      sortOrder: 1,
      needCount: true,
    };
    const apiService = new APICallService(
      inventory.warehouseList,
      params,
      '',
      '',
      false,
      '',
      DeliverUserEnum
    );
    const response = await apiService.callAPI();
    setWareHouses(response.records);
  };
  const handleChange = (newStartDate: Date, name: string) => {
    const temp = { ...deliveryData };
    const tempValidation = { ...deliveryValidation };
    // temp[name] = newStartDate;
    if (name === 'dob') {
      temp.dob = newStartDate;
      tempValidation.dob = false;
    } else if (name === 'drivingLicenseExpiryDate') {
      temp.drivingLicenseExpiryDate = newStartDate;
    } else if (name === 'vehicleDocumentExpiryDate') {
      temp.vehicleDocumentExpiryDate = newStartDate;
    } else if (name === 'vehicleInsuranceExpiryDate') {
      temp.vehicleInsuranceExpiryDate = newStartDate;
    }
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleAddressChange = async (
    value: string,
    lat: string,
    lng: string
  ) => {
    let tempValidation: any = JSON.parse(
      JSON.stringify({ ...deliveryValidation })
    );
    let temp: any = { ...deliveryData };
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
                tempValidation.district = false;
                districtMatched = true;
              }
            } else if (
              component.types.includes('administrative_area_level_2')
            ) {
              if (!districtMatched) {
                temp.districtName = component.long_name;
                tempValidation.district = false;
                districtMatched = true;
              }
            } else if (
              component.types.includes('administrative_area_level_1')
            ) {
              if (!districtMatched) {
                temp.districtName = component.long_name;
                tempValidation.district = false;
                districtMatched = true;
              }
            }
            if (!districtMatched) {
              temp.districtName = '';
              tempValidation.district = true;
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    temp['address'] = value.trimStart();
    temp['lat'] = lat;
    temp['lng'] = lng;
    setDeliveryData(temp);
    if (!value.trimStart().length) {
      tempValidation.address = true;
    } else {
      tempValidation.address = false;
    }
    setDeliveryValidation(tempValidation);
  };
  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    let tempValidation: any = { ...deliveryValidation };
    let temp: any = { ...deliveryData };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        temp.image = URL.createObjectURL(selectedFiles?.[0]);
        temp.imageReader = selectedFiles?.[0];
        tempValidation.image = false;
      }
    }
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleQRImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    let tempValidation: any = { ...deliveryValidation };
    let temp: any = { ...deliveryData };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        temp.qrImage = URL.createObjectURL(selectedFiles?.[0]);
        temp.qrImageReader = selectedFiles?.[0];
        tempValidation.qrImage = false;
      }
    }
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleLicenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    let tempValidation: any = { ...deliveryValidation };
    let temp: any = { ...deliveryData };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        temp.drivingLicense = URL.createObjectURL(selectedFiles?.[0]);
        temp.drivingLicenseImageReader = selectedFiles?.[0];
      }
    }
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleVehicleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    let tempValidation: any = { ...deliveryValidation };
    let temp: any = { ...deliveryData };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        temp.vehicleDocument = URL.createObjectURL(selectedFiles?.[0]);
        temp.vehicleDocumentImageReader = selectedFiles?.[0];
      }
    }
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleInsuranceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    let tempValidation: any = { ...deliveryValidation };
    let temp: any = { ...deliveryData };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        temp.vehicleInsurance = URL.createObjectURL(selectedFiles?.[0]);
        temp.vehicleInsuranceImageReader = selectedFiles?.[0];
      }
    }
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleImgDiscard = () => {
    let temp = { ...deliveryData };
    let tempValidation: any = { ...deliveryValidation };
    temp.image = '';
    temp.imageReader = {};
    tempValidation.image = true;
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleQRImgDiscard = () => {
    let temp = { ...deliveryData };
    let tempValidation: any = { ...deliveryValidation };
    temp.qrImage = '';
    temp.qrImageReader = {};
    tempValidation.qrImage = true;
    setDeliveryValidation(tempValidation);
    setDeliveryData(temp);
  };
  const handleBasicDetailsChange = (name: string, value: string) => {
    let temp: any = { ...deliveryData };
    let tempValidation: any = { ...deliveryValidation };
    if (name === 'phone' || name === 'lipaNumber') {
      value = value.split('.')[0];
      if (!Validations.allowNumberAndFloat(value)) {
        return;
      }
    }
    temp[name] = value.trimStart();
    tempValidation[name] = false;
    if (!value.length) tempValidation[name] = true;
    if (name === 'phone' && value.length > 12) {
      tempValidation[name] = true;
    }
    if (name === 'name' && value.trimStart().length > 50) {
      tempValidation[name] = true;
    }
    if (name === 'vehicleNumber') {
      temp[name] = value.trimStart().toUpperCase();
    }
    setDeliveryData(temp);
    setDeliveryValidation(tempValidation);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    let temp: any = { ...deliveryData };
    let validateTemp: any = { ...deliveryValidation };
    if (temp.name === '' || temp.name.trimStart().length > 50) {
      validateTemp.name = true;
    }
    if (
      temp.phone === '' ||
      temp.phone.length < 9 ||
      temp.phone.length > 12 ||
      !Validations.allowOnlyNumbers(temp.phone)
    ) {
      validateTemp.phone = true;
    }
    if (
      temp.lipaNumber === '' ||
      temp.lipaNumber.length < 8 ||
      temp.lipaNumber.length > 12 ||
      !Validations.allowOnlyNumbers(temp.lipaNumber)
    ) {
      validateTemp.lipaNumber = true;
    }
    if (temp.email === '' || !Validations.validateEmail(temp.email)) {
      validateTemp.email = true;
    }
    if (temp.address === '') {
      validateTemp.address = true;
    }
    if (temp.dob === '') {
      validateTemp.dob = true;
    }
    if (temp.vehicleNumber === '') {
      validateTemp.vehicleNumber = true;
    }
    if (temp.image === '') {
      validateTemp.image = true;
    }
    if (temp.qrImage === '') {
      validateTemp.qrImage = true;
    }
    if (selectedWareHouse === '') {
      validateTemp.warehouse = true;
    }
    if (Object.values(validateTemp).every((val) => val === false)) {
      setLoading(true);
      let apiService = new APICallService(
        deliveryUser.addDeliveryUser,
        deliveryUserJSON.addDeliveryUser({
          name: temp.name,
          email: temp.email,
          phoneCountry: temp.phoneCountry,
          phone: temp.phone,
          address: temp.address,
          lat: temp.lat,
          lng: temp.lng,
          dob: temp.dob,
          warehouse: selectedWareHouse,
          vehicleNumber: temp.vehicleNumber,
          lipaNumber: temp.lipaNumber,
          lipaCountryCode: temp.lipaCountryCode,
          imageReader: temp.imageReader,
          qrImageReader: temp.qrImageReader,
          drivingLicenseReader: temp.drivingLicenseImageReader,
          vehicleDocumentReader: temp.vehicleDocumentImageReader,
          vehicleInsuranceReader: temp.vehicleInsuranceImageReader,
          drivingLicenseExpiryDate: temp.drivingLicenseExpiryDate,
          vehicleDocumentExpiryDate: temp.vehicleDocumentExpiryDate,
          vehicleInsuranceExpiryDate: temp.vehicleInsuranceExpiryDate,
        }),
        '',
        '',
        false,
        '',
        DeliverUserEnum
      );
      let response = await apiService.callAPI();
      if (response) {
        success(masterToast.addDeliveryUser);
        navigate('/master/delivery-users');
      }
      setLoading(false);
    }
    setDeliveryValidation(validateTemp);
  };
  const handleWareHouse = async (event: any) => {
    if (event) {
      setSelectedWareHouse(event.value);
      const tempValidation = { ...deliveryValidation };
      tempValidation.warehouse = false;
      setDeliveryValidation(tempValidation);
    } else {
      setSelectedWareHouse('');
    }
  };
  return (
    <>
      {Method.hasPermission(DeliveryUser, Add, currentUser) ? (
        <>
          <Row className="mb-6">
            <Col xs={12}>
              <h1 className="fs-22 fw-bolder">{DeliverString.addUser}</h1>
            </Col>
          </Row>
          <Row>
            <Col
              md={4}
              className="mb-lg-0 mb-8"
            >
              <Card className="border bg-light">
                <Card.Body>
                  <Row>
                    <Col xs={12}>
                      <h5 className="fs-22 fw-bolder mb-6">
                        {DeliverString.uploadPhoto}
                      </h5>
                    </Col>
                    {deliveryData.image ? (
                      <Col
                        xs={12}
                        className="text-md-center"
                      >
                        <div className="border border-r10px bg-white p-1  ">
                          <div className="image-input image-input-outline min-w-xl-260px min-h-xl-150px ">
                            <div
                              className=" image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center"
                              style={{
                                backgroundImage: `url(${deliveryData.image})`,
                                backgroundRepeat: `no-repeat`,
                              }}
                            >
                              {deliveryData.image && (
                                <img
                                  width={262}
                                  height={149}
                                  src={deliveryData.image}
                                  className="img-fluid mh-150px border-r10px object-fit-contain"
                                  alt=""
                                />
                              )}
                            </div>
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px my-4"
                              data-kt-image-input-action="change"
                              title=""
                            >
                              <img
                                src={CrossIcon}
                                alt=""
                                height={33}
                                width={33}
                                onClick={handleImgDiscard}
                              />
                            </label>
                          </div>
                        </div>
                      </Col>
                    ) : (
                      <Col
                        xs={12}
                        className="text-md-center"
                      >
                        <div
                          className={clsx(
                            'upload-btn-wrapper border rounded',
                            deliveryValidation.image ? 'border-danger' : ''
                          )}
                        >
                          <div className="symbol symbol-md-235px">
                            <img
                              src={uploadIcon}
                              className="img-fluid min-h-200px min-w-200px"
                              alt=""
                            />
                          </div>
                          <input
                            className="w-100 h-100"
                            type="file"
                            name="myfile"
                            onChange={(event) => {
                              handleImgChange(event);
                            }}
                          />
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
              <Card className="border bg-light mt-5">
                <Card.Body>
                  <Row>
                    <Col xs={12}>
                      <h5 className="fs-22 fw-bolder mb-6">
                        {DeliverString.uploadQRCode}
                      </h5>
                    </Col>
                    {deliveryData.qrImage ? (
                      <Col
                        xs={12}
                        className="text-md-center"
                      >
                        <div className="border border-r10px bg-white p-1  ">
                          <div className="image-input image-input-outline min-w-xl-260px min-h-xl-150px ">
                            <div
                              className=" image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center"
                              style={{
                                backgroundImage: `url(${deliveryData.qrImage})`,
                                backgroundRepeat: `no-repeat`,
                              }}
                            >
                              {deliveryData.qrImage && (
                                <img
                                  width={262}
                                  height={149}
                                  src={deliveryData.qrImage}
                                  className="img-fluid mh-150px border-r10px object-fit-contain"
                                  alt=""
                                />
                              )}
                            </div>
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px my-4"
                              data-kt-image-input-action="change"
                              title=""
                            >
                              <img
                                src={CrossIcon}
                                alt=""
                                height={33}
                                width={33}
                                onClick={handleQRImgDiscard}
                              />
                            </label>
                          </div>
                        </div>
                      </Col>
                    ) : (
                      <Col
                        xs={12}
                        className="text-md-center"
                      >
                        <div
                          className={clsx(
                            'upload-btn-wrapper border rounded',
                            deliveryValidation.qrImage ? 'border-danger' : ''
                          )}
                        >
                          <div className="symbol symbol-md-235px">
                            <img
                              src={uploadIcon}
                              className="img-fluid min-h-200px min-w-200px"
                              alt=""
                            />
                          </div>
                          <input
                            className="w-100 h-100"
                            type="file"
                            name="myfile"
                            onChange={(event) => {
                              handleQRImgChange(event);
                            }}
                          />
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              <Card className="bg-light pt-2 mb-6 mb-xl-9 border">
                <Card.Header className="border-bottom-0">
                  <Card.Title>
                    <h5 className="fs-22 fw-bolder">
                      {DeliverString.basicDetails}
                    </h5>
                  </Card.Title>
                </Card.Header>
                <Card.Body className="pt-0 pb-5">
                  <Row className="align-items-center">
                    <Col>
                      <Row>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.name}
                            </Form.Label>
                            <Form.Control
                              className={clsx(
                                'form-control-custom bg-white',
                                deliveryValidation.name ? 'border-danger' : ''
                              )}
                              type="text"
                              placeholder={String.EnterName}
                              onChange={(event: any) => {
                                handleBasicDetailsChange(
                                  'name',
                                  event.target.value
                                );
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <div className="mb-3">
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.phoneNumber}
                            </Form.Label>
                            <InputGroup>
                              <InputGroup.Text
                                className={clsx(
                                  'bg-white border-right-0 fs-16 fw-600 text-black px-6',
                                  deliveryValidation.phone
                                    ? 'border-danger'
                                    : ''
                                )}
                              >
                                {String.countryCode}
                              </InputGroup.Text>
                              <Form.Control
                                name="phoneNumber"
                                className={clsx(
                                  'form-control-custom border-active-none bg-white border-left-0 ps-0',
                                  deliveryValidation.phone
                                    ? 'border-danger'
                                    : ''
                                )}
                                aria-label="Default"
                                value={deliveryData.phone}
                                aria-describedby="inputGroup-sizing-default"
                                onChange={(event: any) => {
                                  handleBasicDetailsChange(
                                    'phone',
                                    event.target.value
                                  );
                                }}
                                onKeyPress={handleOnKeyPress}
                                placeholder={String.EnterPhone}
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.email}
                            </Form.Label>
                            <Form.Control
                              className={clsx(
                                'form-control-custom bg-white',
                                deliveryValidation.email ? 'border-danger' : ''
                              )}
                              type="text"
                              placeholder={String.EnterEmail}
                              onChange={(event: any) => {
                                handleBasicDetailsChange(
                                  'email',
                                  event.target.value
                                );
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {'Lipa Number'}
                            </Form.Label>
                            <Form.Control
                              name="lipaNumber"
                              className={clsx(
                                'form-control-custom bg-white',
                                deliveryValidation.lipaNumber
                                  ? 'border-danger'
                                  : ''
                              )}
                              aria-label="Default"
                              value={deliveryData.lipaNumber}
                              aria-describedby="inputGroup-sizing-default"
                              onChange={(event: any) => {
                                handleBasicDetailsChange(
                                  'lipaNumber',
                                  event.target.value
                                );
                              }}
                              onKeyPress={handleOnKeyPress}
                              placeholder={'Enter lipa number...'}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.dob}
                            </Form.Label>
                            <CustomDatePicker
                              className={clsx(
                                'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded border-1 '
                              )}
                              selected={deliveryData.dob}
                              value={deliveryData.dob}
                              onChange={(date: Date) =>
                                handleChange(date, 'dob')
                              }
                              dateFormat="dd/MM/yyyy"
                              showFullMonthYearPicker
                              maxDate={new Date()}
                              inputTextBG="bg-white"
                              showYearDropdown={true}
                              scrollableYearDropdown={true}
                              dropdownMode="select"
                              placeholder="DD/MM/YYYY"
                              customInput={
                                <CustomDateInput
                                  inputClass={`${
                                    deliveryValidation.dob
                                      ? 'border-danger'
                                      : ' border-gray-300'
                                  }`}
                                />
                              }
                              dayClassName={(date: Date) => {
                                return Method.dayDifference(
                                  new Date().toDateString(),
                                  date.toDateString()
                                ) > 0
                                  ? 'date-disabled'
                                  : '';
                              }}
                              //    isClearable={true}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.warehouse}
                            </Form.Label>
                            <CustomSelectWhite
                              border={clsx(
                                deliveryValidation.warehouse ? '#e55451' : ''
                              )}
                              options={
                                warehouses && warehouses.length
                                  ? warehouses.map((val: any) => {
                                      return {
                                        label: (
                                          <>
                                            <span className="fs-16 fw-600 text-black mb-0">
                                              {val.name}
                                            </span>
                                          </>
                                        ),
                                        value: val._id,
                                        title: val.name,
                                      };
                                    })
                                  : []
                              }
                              value={
                                warehouses && warehouses.length
                                  ? warehouses
                                      .filter(
                                        (item: any) =>
                                          item._id === selectedWareHouse
                                      )
                                      .map((val: any) => {
                                        return {
                                          label: (
                                            <>
                                              <span className="fs-16 fw-600 text-black mb-0">
                                                {val.name}
                                              </span>
                                            </>
                                          ),
                                          value: val._id,
                                          title: val.name,
                                        };
                                      })
                                  : null // Set to null when no match is found
                              }
                              //   isClearable={expiry ? true : false}
                              isClearable={true}
                              onChange={(event: any) => {
                                handleWareHouse(event);
                              }}
                              placeholder="Select Warehouse"
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={6}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.vehicleNumber}
                            </Form.Label>
                            <Form.Control
                              className={clsx(
                                'form-control-custom bg-white',
                                deliveryValidation.vehicleNumber
                                  ? 'border-danger'
                                  : ''
                              )}
                              type="text"
                              value={deliveryData.vehicleNumber}
                              placeholder={String.EnterVehicle}
                              onChange={(event: any) => {
                                handleBasicDetailsChange(
                                  'vehicleNumber',
                                  event.target.value
                                );
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={12}
                          className="mb-3"
                        >
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label className="fs-16 fw-500 required">
                              {DeliverString.address}
                            </Form.Label>
                            <AutoComplete
                              address={deliveryData.address}
                              handleAddressChange={handleAddressChange}
                              lat={deliveryData.lat}
                              lng={deliveryData.lng}
                              border={clsx(
                                deliveryValidation.address ? '#e55451' : ''
                              )}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}></Col>
            <Col
              md={8}
              className="mb-8"
            >
              <Card className="border bg-light">
                <Card.Header className="border-bottom-0">
                  <Card.Title>
                    <h5 className="fs-22 fw-bolder">
                      {DeliverString.documents}
                    </h5>
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col
                      xl={4}
                      sm={6}
                    >
                      <h5 className="fs-16 mb-6 mt-5">
                        {DeliverString.drivingLicence}
                      </h5>
                      {deliveryData.drivingLicense ? (
                        <Col
                          xs={12}
                          className="text-md-center"
                        >
                          <div className="image-input image-input-outline symbol symbol-md-190px border border-r10px bg-white mb-3">
                            <div className="image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center">
                              {deliveryData.drivingLicense && (
                                <img
                                  src={deliveryData.drivingLicense}
                                  width={190}
                                  height={190}
                                  className="img-fluid min-h-190px mh-190px border-r10px object-fit-contain"
                                  // className="img-fluid mh-150px border-r10px object-fit-contain"
                                  alt=""
                                />
                              )}
                            </div>
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px  "
                              data-kt-image-input-action="change"
                              title=""
                            >
                              <img
                                src={EditSVG}
                                alt=""
                                height={33}
                                width={33}
                              />
                              <input
                                type="file"
                                name="avatar"
                                accept=".png, .jpg, .jpeg"
                                onChange={(event) => {
                                  handleLicenseChange(event);
                                }}
                              />
                              <input
                                type="hidden"
                                name="avatar_remove"
                              />
                            </label>
                          </div>
                          <CustomDatePicker
                            className={clsx(
                              'form-control bg-white min-h-50px fs-15 fw-bold text-dark   border rounded'
                            )}
                            placeholder="Expiry date"
                            selected={deliveryData.drivingLicenseExpiryDate}
                            value={deliveryData.drivingLicenseExpiryDate}
                            onChange={(date: Date) =>
                              handleChange(date, 'drivingLicenseExpiryDate')
                            }
                            dateFormat="dd/MM/yyyy"
                            showFullMonthYearPicker
                            minDate={new Date()}
                            showYearDropdown={true}
                            scrollableYearDropdown={true}
                            dropdownMode="select"
                            dayClassName={(date: Date) => {
                              return Method.dayDifference(
                                new Date().toDateString(),
                                date.toDateString()
                              ) < 0
                                ? 'date-disabled'
                                : '';
                            }}
                            //  inputTextBG="bg-white"
                            //    isClearable={true}
                          />
                        </Col>
                      ) : (
                        <Col
                          xs={12}
                          className="text-md-center"
                        >
                          <div className="upload-btn-wrapper">
                            <div className="symbol symbol-md-190px mb-3">
                              <img
                                src={excleUpload}
                                className="img-fluid min-w-190px min-h-190px"
                                height={190}
                                width={190}
                                alt=""
                              />
                              <input
                                className="w-100 h-100"
                                type="file"
                                name="myfile"
                                onChange={(event) => {
                                  handleLicenseChange(event);
                                }}
                              />
                            </div>
                            <CustomDatePicker
                              className={clsx(
                                'form-control bg-white min-h-50px fs-15 fw-bold text-dark  border rounded'
                              )}
                              placeholder="Expiry date"
                              selected={deliveryData.drivingLicenseExpiryDate}
                              value={deliveryData.drivingLicenseExpiryDate}
                              onChange={(date: Date) =>
                                handleChange(date, 'drivingLicenseExpiryDate')
                              }
                              dateFormat="dd/MM/yyyy"
                              showFullMonthYearPicker
                              minDate={new Date()}
                              showYearDropdown={true}
                              scrollableYearDropdown={true}
                              dropdownMode="select"
                              dayClassName={(date: Date) => {
                                return Method.dayDifference(
                                  new Date().toDateString(),
                                  date.toDateString()
                                ) < 0
                                  ? 'date-disabled'
                                  : '';
                              }}
                              //inputTextBG="bg-white"
                              //    isClearable={true}
                            />
                          </div>
                        </Col>
                      )}
                    </Col>
                    <Col
                      xl={4}
                      sm={6}
                    >
                      <h5 className="fs-16 mb-6 mt-5">
                        {DeliverString.vehicleUpload}
                      </h5>
                      {deliveryData.vehicleDocument ? (
                        <Col
                          xs={12}
                          className="text-md-center"
                        >
                          <div className="image-input image-input-outline symbol symbol-md-190px border border-r10px bg-white mb-3">
                            <div className="image-input-wrapper shadow-none bgi-cover w-100 h-100 bgi-position-center">
                              {deliveryData.vehicleDocument && (
                                <img
                                  width={190}
                                  height={190}
                                  className="img-fluid min-h-190px mh-190px border-r10px object-fit-contain"
                                  src={deliveryData.vehicleDocument}
                                  // className="img-fluid mh-150px border-r10px object-fit-contain"
                                  alt=""
                                />
                              )}
                            </div>
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px "
                              data-kt-image-input-action="change"
                              title=""
                            >
                              <img
                                src={EditSVG}
                                alt=""
                                height={33}
                                width={33}
                              />
                              <input
                                type="file"
                                name="avatar"
                                accept=".png, .jpg, .jpeg"
                                onChange={(event) => {
                                  handleVehicleChange(event);
                                }}
                              />
                              <input
                                type="hidden"
                                name="avatar_remove"
                              />
                            </label>
                          </div>
                          <CustomDatePicker
                            className={clsx(
                              'form-control bg-white min-h-50px fs-15 fw-bold text-dark  border rounded'
                            )}
                            placeholder="Expiry date"
                            selected={deliveryData.vehicleDocumentExpiryDate}
                            value={deliveryData.vehicleDocumentExpiryDate}
                            onChange={(date: Date) =>
                              handleChange(date, 'vehicleDocumentExpiryDate')
                            }
                            dateFormat="dd/MM/yyyy"
                            showFullMonthYearPicker
                            minDate={new Date()}
                            showYearDropdown={true}
                            scrollableYearDropdown={true}
                            dropdownMode="select"
                            dayClassName={(date: Date) => {
                              return Method.dayDifference(
                                new Date().toDateString(),
                                date.toDateString()
                              ) < 0
                                ? 'date-disabled'
                                : '';
                            }}
                          />
                        </Col>
                      ) : (
                        <Col
                          xs={12}
                          className="text-md-center"
                        >
                          <div className="upload-btn-wrapper">
                            <div className="symbol symbol-md-190px mb-3">
                              <img
                                src={excleUpload}
                                className="img-fluid min-w-190px min-h-190px"
                                height={190}
                                width={190}
                                alt=""
                              />
                              <input
                                className="w-100 h-100"
                                type="file"
                                name="myfile"
                                onChange={(event) => {
                                  handleVehicleChange(event);
                                }}
                              />
                            </div>
                            <CustomDatePicker
                              className={clsx(
                                'form-control bg-white min-h-50px fs-15 fw-bold text-dark  border rounded'
                              )}
                              placeholder="Expiry date"
                              selected={deliveryData.vehicleDocumentExpiryDate}
                              value={deliveryData.vehicleDocumentExpiryDate}
                              onChange={(date: Date) =>
                                handleChange(date, 'vehicleDocumentExpiryDate')
                              }
                              dateFormat="dd/MM/yyyy"
                              showFullMonthYearPicker
                              minDate={new Date()}
                              showYearDropdown={true}
                              scrollableYearDropdown={true}
                              dropdownMode="select"
                              dayClassName={(date: Date) => {
                                return Method.dayDifference(
                                  new Date().toDateString(),
                                  date.toDateString()
                                ) < 0
                                  ? 'date-disabled'
                                  : '';
                              }}
                            />
                          </div>
                        </Col>
                      )}
                    </Col>
                    <Col
                      xl={4}
                      sm={6}
                    >
                      <h5 className="fs-16 mb-6 mt-5">
                        {DeliverString.vehicleInsurance}
                      </h5>
                      {deliveryData.vehicleInsurance ? (
                        <Col
                          xs={12}
                          className="text-md-center"
                        >
                          <div className="image-input image-input-outline symbol symbol-md-190px border border-r10px bg-white mb-3">
                            <div className="image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center">
                              {deliveryData.vehicleInsurance && (
                                <img
                                  width={190}
                                  height={190}
                                  className="img-fluid min-h-190px mh-190px border-r10px object-fit-contain"
                                  src={deliveryData.vehicleInsurance}
                                  // className="img-fluid mh-150px border-r10px object-fit-contain"
                                  alt=""
                                />
                              )}
                            </div>
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px "
                              data-kt-image-input-action="change"
                              title=""
                            >
                              <img
                                src={EditSVG}
                                alt=""
                                height={33}
                                width={33}
                              />
                              <input
                                type="file"
                                name="avatar"
                                accept=".png, .jpg, .jpeg"
                                onChange={(event) => {
                                  handleInsuranceChange(event);
                                }}
                              />
                              <input
                                type="hidden"
                                name="avatar_remove"
                              />
                            </label>
                          </div>
                          <CustomDatePicker
                            className={clsx(
                              'form-control bg-white min-h-50px fs-15 fw-bold text-dark  border rounded'
                            )}
                            placeholder="Expiry date"
                            selected={deliveryData.vehicleInsuranceExpiryDate}
                            value={deliveryData.vehicleInsuranceExpiryDate}
                            onChange={(date: Date) =>
                              handleChange(date, 'vehicleInsuranceExpiryDate')
                            }
                            dateFormat="dd/MM/yyyy"
                            showFullMonthYearPicker
                            minDate={new Date()}
                            showYearDropdown={true}
                            scrollableYearDropdown={true}
                            dropdownMode="select"
                            dayClassName={(date: Date) => {
                              return Method.dayDifference(
                                new Date().toDateString(),
                                date.toDateString()
                              ) < 0
                                ? 'date-disabled'
                                : '';
                            }}
                          />
                        </Col>
                      ) : (
                        <Col
                          xs={12}
                          className="text-md-center"
                        >
                          <div className="upload-btn-wrapper">
                            <div className="symbol symbol-md-190px mb-3">
                              <img
                                src={excleUpload}
                                className="img-fluid min-w-190px min-h-190px"
                                height={190}
                                width={190}
                                alt=""
                              />
                              <input
                                className="w-100 h-100"
                                type="file"
                                name="myfile"
                                onChange={(event) => {
                                  handleInsuranceChange(event);
                                }}
                              />
                            </div>
                            <CustomDatePicker
                              className={clsx(
                                'form-control bg-white min-h-50px fs-15 fw-bold text-dark  border rounded'
                              )}
                              placeholder="Expiry date"
                              selected={deliveryData.vehicleInsuranceExpiryDate}
                              value={deliveryData.vehicleInsuranceExpiryDate}
                              onChange={(date: Date) =>
                                handleChange(date, 'vehicleInsuranceExpiryDate')
                              }
                              dateFormat="dd/MM/yyyy"
                              showFullMonthYearPicker
                              minDate={new Date()}
                              showYearDropdown={true}
                              scrollableYearDropdown={true}
                              dropdownMode="select"
                              dayClassName={(date: Date) => {
                                return Method.dayDifference(
                                  new Date().toDateString(),
                                  date.toDateString()
                                ) < 0
                                  ? 'date-disabled'
                                  : '';
                              }}
                            />
                          </div>
                        </Col>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div className="d-flex justify-content-end ">
              {/* <Link to="seller-products"> */}
              <Button
                size="lg"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={loading}
              >
                {!loading && (
                  <span className="indicator-label fs-16 fw-bold">
                    {DeliverString.addUser}
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
              {/* </Link> */}
            </div>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default AddDeliveryUser;
