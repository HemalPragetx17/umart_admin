import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterToast } from '../../../../utils/toast';
import { success } from '../../../../Global/toast';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import CrossGray from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import uploadIcon from '../../../../umart_admin/assets/media/svg_uMart/upload.svg';
import clsx from 'clsx';
import { String, UserString } from '../../../../utils/string';
import { fileValidation } from '../../../../Global/fileValidation';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { userManagementJson } from '../../../../api/apiJSON/master';
import Validations from '../../../../utils/validations';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import { Add, Master, UserManagement } from '../../../../utils/constants';
import Loader from '../../../../Global/loader';
const AddNewUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [roles, setRoles] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userDetails, setuserDetails] = useState<{
    name: string;
    phoneCountry: string;
    phone: string;
    email: string;
    role: string;
    image: string;
    imageReader: any;
  }>({
    name: '',
    phone: '',
    phoneCountry: '+255',
    email: '',
    role: '',
    image: '',
    imageReader: {},
  });
  const [validation, setValidation] = useState<{
    name: boolean;
    phone: boolean;
    email: boolean;
    image: boolean;
    role: boolean;
  }>({
    name: false,
    phone: false,
    email: false,
    image: false,
    role: false,
  });
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasPermission(UserManagement, Add, currentUser)) {
        return window.history.back();
      }
      await fetchRoles(1);
      setFetchLoading(false);
    })();
  }, []);
  const fetchRoles = async (roleDepth: number = 1) => {
    setFetchLoading(true);
    const params = {
      roleDepth: roleDepth,
    };
    const apiService = new APICallService(master.getRoles, params,'','',false,'',UserManagement);
    const response = await apiService.callAPI();
    if (response) {
      setRoles(response);
    }
    setFetchLoading(false);
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let temp: any = { ...userDetails };
    let tempValidation: any = { ...validation };
    tempValidation[event.target.name] = false;
    if (event.target.value.trimStart() === '') {
      tempValidation[event.target.name] = true;
    }
    if (event.target.name === 'phone' && event.target.value.length > 12) {
      tempValidation[event.target.name] = true;
    }
    if (event.target.name === 'name' && event.target.value.length > 50) {
      tempValidation[event.target.name] = true;
    }
    temp[event.target.name] = event.target.value.trimStart();
    setuserDetails(temp);
    setValidation(tempValidation);
  };
  const handleRole = (event: any) => {
    let temp = { ...userDetails };
    let tempValidation: any = { ...validation };
    let role = event.value;
    temp.role = role;
    tempValidation.role = false;
    setValidation(tempValidation);
    setuserDetails(temp);
  };
  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    let tempValidation: any = { ...validation };
    let temp = { ...userDetails };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        temp.image = URL.createObjectURL(selectedFiles?.[0]);
        temp.imageReader = selectedFiles?.[0];
        tempValidation.image = false;
      }
    }
    setValidation(tempValidation);
    setuserDetails(temp);
  };
  const handleImgDiscard = () => {
    let temp = { ...userDetails };
    let tempValidation: any = { ...validation };
    temp.image = '';
    temp.imageReader = {};
    tempValidation.image = true;
    setValidation(tempValidation);
    setuserDetails(temp);
  };
  const handleOnKeyPress = (event: any) => {
    const key = event.key.toLowerCase();
    // Allow only alphabets
    if (!/[a-z ]/i.test(key)) {
      event.preventDefault();
    }
  };
  const handleSubmit = async () => {
    let temp: any = { ...userDetails };
    let tempValidation: any = { ...validation };
    if (temp.name === '' || temp.name.trimStart().length > 50) {
      tempValidation.name = true;
    }
    if (temp.image === '') {
      tempValidation.image = true;
    }
    if (
      temp.phone === '' ||
      temp.phone.length > 12 ||
      !Validations.allowNumberAndFloat(temp.phone)
    ) {
      tempValidation.phone = true;
    }
    if (temp.email === '' || !Validations.validateEmail(temp.email)) {
      tempValidation.email = true;
    }
    if (!temp.role.length) {
      tempValidation.role = true;
    }
    let allTrue = Object.values(tempValidation).every((el) => el === false);
    if (allTrue) {
      setLoading(true);
      let apiService = new APICallService(
        master.addUser,
        userManagementJson.addUser({ ...temp, image: temp.imageReader }),
        '',
        '',
        false,
        '',
        UserManagement
      );
      let response: any = await apiService.callAPI();
      if (response) {
        navigate('/master/user-management');
        success(masterToast.addUserManagement);
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  const handleOnKeyPressPhone = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  return (
    <>
      {Method.hasPermission(UserManagement, Add, currentUser) ? (
        <Row className="g-6">
          <Col xs={12}>
            <h1 className="fs-22 fw-bolder">{UserString.addNewUser}</h1>
          </Col>
          {fetchLoading ? (
            <Col
              xs={12}
              className=" text-center"
            >
              <Loader />
            </Col>
          ) : (
            <>
              {' '}
              <Col xs={12}>
                <Card className="bg-light border border-r10px">
                  <Card.Body className="p-9">
                    <Row className="gx-lg-9 gx-6 gy-6">
                      <Col md={6}>
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label
                              htmlFor=""
                              className="fs-16 fw-500"
                            >
                              {UserString.name}
                            </label>
                          </Col>
                          <Col xs={8}>
                            <Form.Control
                              className={clsx(
                                'form-control-custom bg-white',
                                validation.name ? 'border-danger' : ''
                              )}
                              type="text"
                              placeholder={String.EnterName}
                              name="name"
                              value={userDetails.name}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ): void => handleInputChange(e)}
                              onKeyPress={(event: any) => {
                                handleOnKeyPress(event);
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label
                              htmlFor=""
                              className="fs-16 fw-500"
                            >
                              {String.EnterPhone}
                            </label>
                          </Col>
                          <Col xs={8}>
                            <InputGroup
                              size="lg"
                              className={clsx(
                                'border border-r8px',
                                validation.phone ? 'border-danger' : ''
                              )}
                            >
                              <InputGroup.Text
                                id="inputGroup-sizing-lg"
                                className="border-0 fs-16 fw-500 text-dark bg-white pe-2"
                              >
                                {String.countryCode}
                              </InputGroup.Text>
                              <Form.Control
                                className="form-control-custom bg-white border-0"
                                type="number"
                                aria-label="Large"
                                aria-describedby="inputGroup-sizing-sm"
                                placeholder={String.EnterPhone}
                                name="phone"
                                value={userDetails.phone}
                                onKeyPress={handleOnKeyPressPhone}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void => handleInputChange(e)}
                              />
                            </InputGroup>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label
                              htmlFor=""
                              className="fs-16 fw-500"
                            >
                              {UserString.email}
                            </label>
                          </Col>
                          <Col xs={8}>
                            <Form.Control
                              type="text"
                              className={clsx(
                                'form-control-custom bg-white',
                                validation.email ? 'border-danger' : ''
                              )}
                              placeholder={String.EnterEmail}
                              name="email"
                              value={userDetails.email}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ): void => handleInputChange(e)}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label
                              htmlFor=""
                              className="fs-16 fw-500"
                            >
                              {UserString.assignRole}
                            </label>
                          </Col>
                          <Col xs={8}>
                            <CustomSelectWhite
                              options={roles.map((item: any) => {
                                return {
                                  label: item.name,
                                  title: item.name,
                                  value: item._id,
                                };
                              })}
                              border={validation.role ? '#e55451' : ''}
                              onChange={handleRole}
                              isDisabled={fetchLoading}
                              placeholder="Select role"
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row className="g-5">
                          <Col
                            xs={4}
                            md={4}
                          >
                            <label
                              htmlFor=""
                              className="fs-16 fw-500 mt-md-2"
                            >
                              {UserString.uploadPhoto}
                            </label>
                          </Col>
                          <Col xs={8}>
                            {userDetails.image ? (
                              <div className="symbol symbol-168px">
                                <div className="position-relative">
                                  <img
                                    className="border-r10px object-fit-cover border"
                                    height={168}
                                    width={168}
                                    src={
                                      userDetails.image
                                        ? userDetails.image
                                        : uploadIcon
                                    }
                                    alt=""
                                  />
                                  <Button
                                    variant="link"
                                    className="btn-flush close-top-2"
                                    onClick={(): void => handleImgDiscard()}
                                  >
                                    <img
                                      src={CrossGray}
                                      alt=""
                                    />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="upload-btn-wrapper ">
                                <div
                                  className={clsx(
                                    'symbol symbol-168px border ',
                                    validation.image ? 'border-danger' : ''
                                  )}
                                >
                                  <img
                                    src={uploadIcon}
                                    className="img-fluid border-r10px h-100 w-100"
                                    alt=""
                                  />
                                </div>
                                <input
                                  className="w-100 h-100"
                                  type="file"
                                  name="image"
                                  accept=".png, .jpg, .jpeg"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ): void => handleImgChange(e)}
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                lg={12}
                className="pt-3"
              >
                <Row className="justify-content-end justify-content-md-start g-3">
                  <Col xs="auto">
                    <Button
                      variant="danger"
                      size="lg"
                      className="btn-active-danger"
                      onClick={() => navigate('/master/user-management')}
                    >
                      {UserString.cancel}
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="primary"
                      className="btn-lg"
                      onClick={handleSubmit}
                      disabled={loading}
                      //   onClick={() => setManagerAlreadyAssigned(true)}
                    >
                      {!loading && (
                        <span className="indicator-label fs-16 fw-bold">
                          {UserString.addUser}
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
              </Col>
            </>
          )}
        </Row>
      ) : (
        <></>
      )}
    </>
  );
};
export default AddNewUser;
