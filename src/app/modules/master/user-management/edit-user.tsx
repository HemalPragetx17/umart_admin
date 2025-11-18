import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import Loader from '../../../../Global/loader';
import Validations from '../../../../utils/validations';
import { UserManagement } from '../../../../utils/constants';
const EditUser: FC = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    _id: string;
    name: string;
    phoneCountry: string;
    phone: string;
    email: string;
    role: string;
    image: string;
    imageReader: any;
    roleAndPermission: any;
  }>({
    _id: '',
    name: '',
    phone: '',
    phoneCountry: '+255',
    email: '',
    roleAndPermission: {},
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
  const [prevRole, setPrevRole] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [roles, setRoles] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!state) {
        return window.history.back();
      }
      await fetchUserDetails(state._id);
      await fetchRoles(1);
      setFetchLoading(false);
    })();
  }, []);
  const fetchUserDetails = async (id: string) => {
    setFetchLoading(true);
    const apiService = new APICallService(master.getUserDetails, id,'','',false,'',UserManagement);
    const response = await apiService.callAPI();
    if (response) {
      setUserDetails({ ...response, role: response.roleAndPermission._id });
      setPrevRole(response.roleAndPermission._id);
    }
    setFetchLoading(false);
  };
  const fetchRoles = async (roleDepth: number = 1) => {
    setFetchLoading(true);
    const params = {
      roleDepth: roleDepth,
    };
    const apiService = new APICallService(
      master.getRoles,
      params,
      '',
      '',
      false,
      '',
      UserManagement
    );
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
    temp[event.target.name] = event.target.value.trimStart();
    if (event.target.name === 'name' && event.target.value.length > 50) {
      tempValidation[event.target.name] = true;
    }
    setUserDetails(temp);
    setValidation(tempValidation);
  };
  const handleRole = (event: any) => {
    let temp = { ...userDetails };
    let tempValidation: any = { ...validation };
    let role = event.value;
    temp.role = role;
    tempValidation.role = false;
    setValidation(tempValidation);
    setUserDetails(temp);
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
    setUserDetails(temp);
  };
  const handleImgDiscard = () => {
    let temp = { ...userDetails };
    let tempValidation: any = { ...validation };
    temp.image = '';
    temp.imageReader = {};
    tempValidation.image = true;
    setValidation(tempValidation);
    setUserDetails(temp);
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
      !temp.phone ||
      !Validations.validateEmail(temp.email)
    ) {
      tempValidation.phone = true;
    }
    if (temp.email === '' || !Validations.validateEmail(temp.email)) {
      tempValidation.email = true;
    }
    if (!temp.role) {
      tempValidation.role = true;
    }
    let allTrue = Object.values(tempValidation).every((el) => el === false);
    if (allTrue) {
      setLoading(true);
      let apiService = new APICallService(
        master.editUserDetails,
        userManagementJson.editUser({
          ...temp,
          phoneCountry: '+255',
          image: temp.imageReader ? temp.imageReader : temp.image,
          prevRole: prevRole,
        }),
        { id: userDetails._id },
        '',
        false,
        '',
        UserManagement
      );
      let response: any = await apiService.callAPI();
      if (response) {
        navigate('/master/user-management', { replace: true });
        success(masterToast.userUpdated);
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
      <Row className="g-6">
        <Col xs={12}>
          <h1 className="fs-22 fw-bolder">{UserString.editUser}</h1>
        </Col>
        {fetchLoading ? (
          <>
            <Col
              xs={12}
              className=" text-center"
            >
              <Loader />
            </Col>
          </>
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
                            {UserString.phoneNumber}
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
                                value: item._id,
                                title: item.name,
                              };
                            })}
                            border={validation.role ? '#e55451' : ''}
                            onChange={handleRole}
                            defaultValue={{
                              label: userDetails.roleAndPermission.name,
                              value: userDetails.roleAndPermission._id,
                            }}
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
                                  alt={userDetails.image}
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
                            <div className="upload-btn-wrapper">
                              <div
                                className={clsx(
                                  'symbol symbol-168px border',
                                  validation.image ? 'border-danger' : ''
                                )}
                              >
                                <img
                                  src={
                                    userDetails.image
                                      ? userDetails.image
                                      : uploadIcon
                                  }
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
                  >
                    {!loading && (
                      <span className="indicator-label fs-16 fw-bold">
                        {UserString.saveUser}
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
    </>
  );
};
export default EditUser;
