import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Validations from '../../../utils/validations';
import { SettingsStrings, String } from '../../../utils/string';
import APICallService from '../../../api/apiCallService';
import { settings } from '../../../api/apiEndPoints';
import Loader from '../../../Global/loader';
import { success } from '../../../Global/toast';
import {
  Add,
  Delete,
  Edit,
  GeneralSettings as GeneralSettingsEnum,
  View,
} from '../../../utils/constants';
import { useAuth } from '../auth';
import Method from '../../../utils/methods';
const GeneralSettings = () => {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isInputChange, setIsInputChange] = useState(false);
  const { currentUser } = useAuth();
  const [cost, setCost] = useState<any>({
    minimumOrder: '',
    deliverCharge: '',
    platformFee: '',
    coinValue: '',
  });
  const [costValidation, setCostValidation] = useState<any>({
    minimumOrder: false,
    deliverCharge: false,
    platformFee: false,
    coinValue: false,
  });
  const [initialCost, setInitialCost] = useState<any>({
    deliverCharge: '',
    platformFee: '',
    minimumOrder: '',
    coinValue: '',
  });
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasModulePermission(GeneralSettingsEnum, currentUser)) {
        return window.history.back();
      }
      await fetchSettings();
      setFetchLoading(false);
    })();
  }, []);
  const fetchSettings = async () => {
    setFetchLoading(true);
    const apiService = new APICallService(
      settings.getSettings,
      {},
      '',
      '',
      false,
      '',
      GeneralSettingsEnum
    );
    const response = await apiService.callAPI();
    if (response?.record) {
      const temp = {
        minimumOrder: response.record.minOrderValue + '',
        deliverCharge: response.record.deliveryCharge + '',
        platformFee: response.record.platformFee + '',
        coinValue: response.record.coinValue + '',
      };
      setCost(temp);
    }
    setFetchLoading(false);
  };
  const handleChange = async (value: string, name: string) => {
    let temp: any = { ...cost };
    let tempValidation = { ...costValidation };
    let priceValidation = await Validations.validatePrice(value.trim());
    if (priceValidation) {
      if (value.length > 0) {
        tempValidation[name] = false;
      } else {
        tempValidation[name] = true;
      }
      if (name === 'platformFee') {
        if (!/^\d*$/.test(value)) {
          value = value.split('.')[0];
        }
        temp[name] = value;
      } else if (name === 'minimumOrder') {
        const tempValue = parseInt(value);
        temp[name] = value;
        if (tempValue >= 1000) {
          tempValidation[name] = false;
        } else {
          tempValidation[name] = true;
        }
      } else if (name === 'coinValue') {
        value = value.split('.')[0];
        const tempValue = parseInt(value);
        if (tempValue <= 0) {
          tempValidation[name] = true;
        }
        temp[name] = value;
      } else {
        temp[name] = value;
      }
    }
    setIsInputChange(true);
    setCostValidation(tempValidation);
    setCost(temp);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleSave = async () => {
    let tempValidation: any = { ...costValidation };
    if (cost.minimumOrder === '') {
      tempValidation.minimumOrder = true;
    }
    if (cost.deliverCharge === '') {
      tempValidation.deliverCharge = true;
    }
    if (cost.platformFee === '') {
      tempValidation.platformFee = true;
    }
    if (cost.coinValue === '') {
      tempValidation.coinValue = true;
    }
    const allFalse = Object.values(tempValidation).every((v) => v === false);
    if (allFalse) {
      if (JSON.stringify(initialCost) !== JSON.stringify(cost)) {
        // setConfirmModal(true);
      }
      setLoading(true);
      const params = {
        minOrderValue: cost.minimumOrder,
        deliveryCharge: cost.deliverCharge,
        platformFee: cost.platformFee,
        coinValue: cost.coinValue,
      };
      const apiService = new APICallService(
        settings.addSettings,
        params,
        '',
        '',
        false,
        '',
        GeneralSettingsEnum
      );
      const response = await apiService.callAPI();
      if (response) {
        success('Settings saved successfully!');
        setIsInputChange(false);
      }
      setLoading(false);
    }
    setCostValidation(tempValidation);
  };
  return (
    <>
      <Row>
        <Col
          lg={12}
          className="mb-5"
        >
          <h1 className="fs-22 fw-bolder">{SettingsStrings.generalSettings}</h1>
        </Col>
        {fetchLoading ? (
          <div className="d-flex justify-content-center m-4 h-200px">
            <Loader loading={fetchLoading} />
          </div>
        ) : (
          <>
            {' '}
            <Card className="bg-light">
              <Card.Body>
                <Col
                  xs={12}
                  className="mb-2"
                >
                  <h3 className="fs-22 fw-bolder">
                    {SettingsStrings.setMinOrder}
                  </h3>
                  <p className="fs-16 fw-500">{SettingsStrings.minOrderBody}</p>
                </Col>
                <Col>
                  <Card className="border py-8 mb-10">
                    <Card.Body className="py-0 ">
                      <Form.Group
                        as={Row}
                        className="align-items-center"
                        controlId="formPlaintextEmail"
                      >
                        <Form.Label
                          className="fs-16 fw-500 text-dark"
                          column
                          sm="2"
                        >
                          {SettingsStrings.setMinimum} <br />{' '}
                          {SettingsStrings.orderVal}
                        </Form.Label>
                        <Col sm="auto">
                          <InputGroup
                            size="lg"
                            className={`${
                              costValidation.minimumOrder
                                ? 'border border-r8px min-h-60px  border-danger'
                                : 'border border-r8px min-h-60px'
                            } min-w-sm-300px min-w-md-340px`}
                          >
                            <InputGroup.Text
                              id=""
                              className="fs-16 fw-600 text-dark border-0"
                            >
                              {String.TSh}
                            </InputGroup.Text>
                            <Form.Control
                              className="fs-16 fw-600 text-dark bg-light border-0 ps-0 "
                              aria-label=""
                              aria-describedby=""
                              value={cost.minimumOrder}
                              onChange={(event: any) => {
                                handleChange(
                                  event.target.value.trimStart(),
                                  'minimumOrder'
                                );
                              }}
                              onKeyPress={(event: any) => {
                                handleOnKeyPress(event);
                              }}
                            />
                          </InputGroup>
                          {costValidation.minimumOrder ? (
                            <span className="text-danger fs-6">
                              Minimum order value must be greater or equal to
                              1000
                            </span>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col
                  xs={12}
                  className="mb-2"
                >
                  <h3 className="fs-22 fw-bolder">
                    {SettingsStrings.setDeliveryCharges}
                  </h3>
                  <p className="fs-16 fw-500">{SettingsStrings.deliveryBody}</p>
                </Col>
                <Col>
                  <Card className="border py-8 mb-10">
                    <Card.Body className="py-0">
                      <Form.Group
                        as={Row}
                        className="align-items-center"
                        controlId="formPlaintextEmail"
                      >
                        <Form.Label
                          className="fs-16 fw-500 text-dark"
                          column
                          sm="2"
                        >
                          {SettingsStrings.deliveryCharges}
                        </Form.Label>
                        <Col sm="auto">
                          <InputGroup
                            size="lg"
                            className={`${
                              costValidation.deliverCharge
                                ? 'border border-r8px min-h-60px  border-danger'
                                : 'border border-r8px min-h-60px'
                            } min-w-md-340px`}
                          >
                            <InputGroup.Text
                              id=""
                              className="fs-16 fw-600 text-dark border-0"
                            >
                              {String.TSh}
                            </InputGroup.Text>
                            <Form.Control
                              className="fs-16 fw-600 text-dark bg-light border-0 ps-0"
                              aria-label=""
                              aria-describedby=""
                              value={cost.deliverCharge}
                              onChange={(event: any) => {
                                handleChange(
                                  event.target.value.trimStart(),
                                  'deliverCharge'
                                );
                              }}
                              onKeyPress={(event: any) => {
                                handleOnKeyPress(event);
                              }}
                            />
                            <InputGroup.Text className="fs-14 fw-500 text-gray border-0">
                              {SettingsStrings.perKm}
                            </InputGroup.Text>
                          </InputGroup>
                        </Col>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col
                  xs={12}
                  className="mb-2"
                >
                  <h3 className="fs-22 fw-bolder">
                    {SettingsStrings.setPlatformFee}
                  </h3>
                  <p className="fs-16 fw-500">{SettingsStrings.platformBody}</p>
                </Col>
                <Col>
                  <Card className="border py-8 mb-10">
                    <Card.Body className="py-0">
                      <Form.Group
                        as={Row}
                        className="align-items-center"
                        controlId="formPlaintextEmail"
                      >
                        <Form.Label
                          className="fs-16 fw-500 text-dark"
                          column
                          sm="2"
                        >
                          {SettingsStrings.platformFee}
                        </Form.Label>
                        <Col sm="auto">
                          <InputGroup
                            size="lg"
                            className={`${
                              costValidation.platformFee
                                ? 'border border-r8px min-h-60px  border-danger'
                                : 'border border-r8px min-h-60px'
                            } min-w-md-340px`}
                          >
                            <InputGroup.Text
                              id=""
                              className="fs-16 fw-600 text-dark border-0"
                            >
                              {String.TSh}
                            </InputGroup.Text>
                            <Form.Control
                              className="fs-16 fw-600 text-dark bg-light border-0 ps-0"
                              aria-label=""
                              aria-describedby=""
                              value={cost.platformFee}
                              onChange={(event: any) => {
                                handleChange(
                                  event.target.value.trimStart(),
                                  'platformFee'
                                );
                              }}
                              onKeyPress={(event: any) => {
                                handleOnKeyPress(event);
                              }}
                            />
                            <InputGroup.Text className="fs-14 fw-500 text-gray border-0">
                              {SettingsStrings.fixed}
                            </InputGroup.Text>
                          </InputGroup>
                        </Col>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col
                  xs={12}
                  className="mb-2"
                >
                  <h3 className="fs-22 fw-bolder">
                    {SettingsStrings.setCoinValue}
                  </h3>
                  <p className="fs-16 fw-500">
                    {SettingsStrings.coinValueText}
                  </p>
                </Col>
                <Col>
                  <Card className="border py-8 mb-10">
                    <Card.Body className="py-0">
                      <Form.Group
                        as={Row}
                        className="align-items-center"
                        controlId="formPlaintextEmail"
                      >
                        <Form.Label
                          className="fs-16 fw-500 text-dark"
                          column
                          sm="2"
                        >
                          {SettingsStrings.coinValue}
                        </Form.Label>
                        <Col sm="auto">
                          <InputGroup
                            size="lg"
                            className={`${
                              costValidation.coinValue
                                ? 'border border-r8px min-h-60px  border-danger'
                                : 'border border-r8px min-h-60px'
                            } min-w-md-340px`}
                          >
                            {/* <InputGroup.Text
                              id=""
                              className="fs-16 fw-600 text-dark border-0"
                            >
                              {String.TSh}
                            </InputGroup.Text> */}
                            <Form.Control
                              className="fs-16 fw-600 text-dark bg-light border-0 ps-5"
                              aria-label=""
                              aria-describedby=""
                              value={cost.coinValue}
                              onChange={(event: any) => {
                                handleChange(
                                  event.target.value.trimStart(),
                                  'coinValue'
                                );
                              }}
                              onKeyPress={(event: any) => {
                                handleOnKeyPress(event);
                              }}
                            />
                            <InputGroup.Text className="fs-14 fw-500 text-gray border-0">
                              {SettingsStrings.perOneTsh}
                            </InputGroup.Text>
                          </InputGroup>
                        </Col>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Card.Body>
            </Card>
            <Col
              xs={12}
              className="my-9"
            >
              {Method.hasPermission(GeneralSettingsEnum, Add, currentUser) ||
              Method.hasPermission(GeneralSettingsEnum, Edit, currentUser) ||
              Method.hasPermission(GeneralSettingsEnum, Delete, currentUser) ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-fit-content"
                  onClick={handleSave}
                  disabled={loading || !isInputChange}
                >
                  {!loading && (
                    <span className="indicator-label fs-16 fw-bold">
                      {SettingsStrings.saveDetails}
                    </span>
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
          </>
        )}
      </Row>
    </>
  );
};
export default GeneralSettings;
