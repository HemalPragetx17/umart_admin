import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { settings } from '../../../api/apiEndPoints';
import { success } from '../../../Global/toast';
import { appSettingsToast } from '../../../utils/toast';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { appTypeJSON } from '../../../utils/staticJSON';
import {
  AppSettingsConst,
  Edit,
  GeneralSettings,
} from '../../../utils/constants';
import { useAuth } from '../auth';
import Method from '../../../utils/methods';
const AppSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(appTypeJSON[0]);
  const [formData, setFormData] = useState({
    androidVersion: '',
    iOSVersion: '',
    androidForceUpdate: false,
    iOSForceUpdate: false,
    iOSUnderMaintenance: false,
    androidUnderMaintenance: false,
    interface: selectedApp.value,
  });
  const [validation, setValidation] = useState({
    androidVersion: false,
    iOSVersion: false,
  });
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasModulePermission(AppSettingsConst, currentUser)) {
        return window.history.back();
      }
      await fetchData(selectedApp.value);
      setFetchLoading(false);
    })();
  }, []);
  const fetchData = async (selectedAppValue: any) => {
    setFetchLoading(true);
    const apiService = new APICallService(
      settings.getAppSettings,
      {
        interface: selectedAppValue,
      },
      '',
      '',
      false,
      '',
      AppSettingsConst
    );
    const response = await apiService.callAPI();
    if (response) {
      const tempData: any = {
        androidForceUpdate: response.androidForceUpdate,
        iOSForceUpdate: response.iOSForceUpdate,
        iOSUnderMaintenance: response.iOSUnderMaintenance,
        androidUnderMaintenance: response.androidUnderMaintenance,
        interface: selectedAppValue,
        androidVersion: response?.androidVersion || '',
        iOSVersion: response?.iOSVersion || '',
      };
      setFormData(tempData);
    }
    setFetchLoading(false);
  };
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    if (name === 'iOSVersion') {
      const isValid = /^\d+(\.\d*)?$/.test(value);
      setValidation((prevValidation) => ({
        ...prevValidation,
        iOSVersion: !isValid,
      }));
    } else if (name === 'androidVersion') {
      const isValid = /^\d+(\.\d+(\.\d*)?)?$/.test(value);
      setValidation((prevValidation) => ({
        ...prevValidation,
        androidVersion: !isValid,
      }));
    }
  };
  const handleSave = async (data: any) => {
    const tempValidation = { ...validation };
    if (
      formData.iOSVersion.trim().length === 0 ||
      formData.iOSVersion === '0'
    ) {
      tempValidation.iOSVersion = true;
    }
    if (
      formData.androidVersion.trim().length === 0 ||
      formData.androidVersion === '0'
    ) {
      tempValidation.androidVersion = true;
    }
    if (!tempValidation.androidVersion && !tempValidation.iOSVersion) {
      setLoading(true);
      const apiService = new APICallService(
        settings.addAppSettings,
        data,
        '',
        '',
        false,
        '',
        AppSettingsConst
      );
      const response = await apiService.callAPI();
      if (response) {
        success(appSettingsToast.appSettingsUpdated);
      }
      setLoading(false);
    } else {
      console.error('Validation failed. Cannot save data.');
    }
    setValidation(tempValidation);
  };
  const handleAppTypeChange = async (event: any) => {
    setFormData((prevData) => ({
      ...prevData,
      interface: event.value,
    }));
    setSelectedApp(event);
    await fetchData(event.value);
  };
  return (
    <div>
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center mb-5"
        >
          <Row className="align-items-center">
            <Col
              lg={8}
              md={6}
            >
              <h1 className="fs-22 fw-bolder">App Settings</h1>
            </Col>
            <Col
              lg={4}
              md={6}
              className="mt-3 mt-md-0"
            >
              <CustomSelectWhite
                isSearchable={true}
                options={appTypeJSON}
                value={selectedApp}
                placeholder="Select app type"
                onChange={(event: any) => {
                  handleAppTypeChange(event);
                }}
                isDisabled={fetchLoading || loading}
              />
            </Col>
          </Row>
        </Col>
        {fetchLoading ? (
          <div className="d-flex justify-content-center m-4">
            <Loader loading={fetchLoading} />
          </div>
        ) : (
          <>
            <Col xs={12}>
              <Card className="bg-light border mb-7">
                <Card.Body className="px-7">
                  <Row className="gx-6 gy-6 gx-lg-10">
                    <Col
                      md={7}
                      lg={6}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label className="fs-16 fw-500">
                          Android Version
                        </Form.Label>
                        <Form.Control
                          className={`form-control-custom bg-white ${
                            validation.androidVersion ? 'border-danger' : ''
                          }`}
                          type="text"
                          placeholder="Type here..."
                          name="androidVersion"
                          value={formData.androidVersion}
                          onChange={handleInputChange}
                        />
                        {validation.androidVersion && (
                          <div className="text-danger fs-12 fw-bold">
                            Android version should not be empty, zero and up to
                            two dots (.) are allowed.
                          </div>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fs-16 fw-500">
                          iOS Version
                        </Form.Label>
                        <Form.Control
                          className={`form-control-custom bg-white ${
                            validation.iOSVersion ? 'border-danger' : ''
                          }`}
                          type="text"
                          placeholder="Type here..."
                          name="iOSVersion"
                          value={formData.iOSVersion}
                          onChange={handleInputChange}
                        />
                        {validation.iOSVersion && (
                          <div className="text-danger fs-12 fw-bold">
                            Ios version should not be empty, zero and only one
                            dot (.) is allowed.
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col
                      md={5}
                      lg={6}
                    >
                      <div className=" d-flex flex-column flex-wrap gap-5">
                        <div className="form-check form-check-custom form-check-solid form-check-lg">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                            id="androidForceUpdate"
                            name="androidForceUpdate"
                            checked={formData.androidForceUpdate}
                            onChange={handleInputChange}
                          />
                          <label
                            className="form-check-label fs-16 fw-600 text-black ms-3"
                            htmlFor="androidForceUpdate"
                          >
                            Android force update
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid form-check-lg">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                            id="iOSForceUpdate"
                            name="iOSForceUpdate"
                            checked={formData.iOSForceUpdate}
                            onChange={handleInputChange}
                          />
                          <label
                            className="form-check-label fs-16 fw-600 text-black ms-3"
                            htmlFor="iOSForceUpdate"
                          >
                            iOS force update
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid form-check-lg">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                            id="iOSUnderMaintenance"
                            name="iOSUnderMaintenance"
                            checked={formData.iOSUnderMaintenance}
                            onChange={handleInputChange}
                          />
                          <label
                            className="form-check-label fs-16 fw-600 text-black ms-3"
                            htmlFor="iOSAppMaintenance"
                          >
                            iOS App Maintenance
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid form-check-lg">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                            id="androidUnderMaintenance"
                            name="androidUnderMaintenance"
                            checked={formData.androidUnderMaintenance}
                            onChange={handleInputChange}
                          />
                          <label
                            className="form-check-label fs-16 fw-600 text-black ms-3"
                            htmlFor="androidAppMaintenance"
                          >
                            Android App Maintenance
                          </label>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Row>
                <Col xs={3}>
                  {Method.hasPermission(AppSettingsConst, Edit, currentUser) ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => handleSave(formData)}
                      disabled={loading}
                    >
                      {!loading && (
                        <span className="indicator-label">Update</span>
                      )}
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
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};
export default AppSettings;
