import {
  Button,
  Card,
  Col,
  Form,
  FormLabel,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { GoodsRequestString, InventoryString } from '../../../utils/string';
import { KTSVG } from '../../../umart_admin/helpers';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { useEffect, useState } from 'react';
import GrayClose from '../../../umart_admin/assets/media/svg_uMart/gray-close-dark.png';
import CustomDatePicker from '../../custom/DateRange/DatePicker';
import { wareHouseProductJSon } from '../../../utils/dummyJSON';
import { event } from 'jquery';
import {
  Add,
  GoodsRequestConst,
  Inventory,
  Units,
} from '../../../utils/constants';
import { Navigate, useNavigate } from 'react-router';
import Validations from '../../../utils/validations';
import APICallService from '../../../api/apiCallService';
import {
  goodsRequests,
  inventory,
  manageProductInventory,
} from '../../../api/apiEndPoints';
import { IGoodsRequest } from '../../../types';
import Method from '../../../utils/methods';
import { success } from '../../../Global/toast';
import { goodsRequestTaost } from '../../../utils/toast';
import clsx from 'clsx';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { useAuth } from '../auth';
const AddGoodsRequest = () => {
  const { currentUser } = useAuth();
  const [wareHouses, setWareHouses] = useState<any>([]);
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWareHouse, setSelectedWareHouse] = useState<any>('');
  const [wareHouseProduct, setWareHouseProducts] = useState<any>([]);
  const [requestData, setRequestData] = useState<IGoodsRequest>({
    name: '',
    warehouseId: '',
    records: [
      {
        variant: '',
        quantityTypes: [],
      },
    ],
    date: '',
  });
  const [validation, setValidation] = useState<any>({
    data: false,
    records: [
      {
        vairiant: false,
        quantityTypes: false,
      },
    ],
  });
  const [deliveryDate, setDeliveryDate] = useState(null);
  const navigate = useNavigate();
  // const [validation,setValidation] = useState<{records:}>({
  // })
  useEffect(() => {
    (async () => {
      setInitLoading(true);
      if (!Method.hasPermission(GoodsRequestConst, Add, currentUser)) {
        return window.history.back();
      }
      await fetchWarehouses();
      setInitLoading(false);
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
      GoodsRequestConst
    );
    const response = await apiService.callAPI();
    setWareHouses(response.records);
  };
  const fetchProducts = async () => {
    let params = {
      sortKey: 'title',
      sortOrder: 1,
      ['status[0]']: 2,
      state: 2,
    };
    const apiService = new APICallService(
      manageProductInventory.listProduct,
      params,
      '',
      '',
      false,
      '',
      GoodsRequestConst
    );
    const response = await apiService.callAPI();
    let data: any = [];
    // if (page === 1) {
    //   setTotalRecords(response.records.length);
    // } else {
    //   data = [...wareHouseProduct];
    //   let prevTotal = totalRecords;
    //   setTotalRecords(prevTotal);
    // }
    response.records.map((val: any) => {
      data.push(val);
    });
    setWareHouseProducts(data);
  };
  const handleWareHouse = async (event: any) => {
    const tempData = { ...requestData };
    tempData.warehouseId = event.value;
    tempData.name = event.title;
    setRequestData(tempData);
    setSelectedWareHouse(event.value);
    await fetchProducts();
  };
  const handleProductSelect = (event: any, index: number) => {
    const tempRequestData = { ...requestData };
    const tempValidation: any = { ...validation };
    if (
      requestData.records.length > 1 &&
      index < requestData.records.length - 1
    ) {
      tempRequestData.records[index].variant = event._id;
    } else {
      tempRequestData.records.pop();
      tempRequestData.records.push({
        variant: event._id,
        quantityTypes: [
          {
            type: 1,
            stockCount: 0,
          },
        ],
      });
      tempRequestData.records.push({
        variant: '',
        quantityTypes: [],
      });
    }
    tempValidation.records.push({
      variant: false,
      quantityTypes: false,
    });
    setRequestData(tempRequestData);
    setValidation(tempValidation);
  };
  const handleCountChange = (index: number, newValue: string) => {
    let temp = { ...requestData };
    let tempValidation = { ...validation };
    if (!/^\d*$/.test(newValue)) {
      newValue = newValue.split('.')[0];
    }
    if (newValue) {
      if (Validations.allowNumberAndFloat(newValue)) {
        if (newValue.startsWith('0')) {
          // Remove the leading '0' by slicing the string from index 1 onwards
          newValue = newValue.slice(1);
        }
        temp.records[index].quantityTypes[0].stockCount = newValue;
        tempValidation.records[index].quantityTypes = false;
      }
    } else {
      temp.records[index].quantityTypes[0].stockCount = 0;
    }
    setValidation(tempValidation);
    setRequestData(temp);
  };
  const handleRemove = (index: any) => {
    const tempRequestData = { ...requestData };
    const tempValidation = { ...validation };
    tempRequestData.records.splice(index, 1);
    tempValidation.records.splice(index, 1);
    setRequestData(tempRequestData);
    setValidation(tempValidation);
  };
  const handleDateChange = (event: any) => {
    setDeliveryDate(event);
    const tempData = { ...requestData };
    const tempValidation = { ...validation };
    const formattedDate = event
      ? Method.convertDateToFormat(event, 'YYYY-MM-DD')
      : '';
    tempData.date = formattedDate;
    if (event) {
      tempValidation.date = false;
    }
    setRequestData(tempData);
    setValidation(tempValidation);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    const tempData = { ...requestData };
    const tempValidation: any = { ...validation };
    if (tempData.date.length === 0) {
      tempValidation.date = true;
    }
    tempData.records.forEach((item, index) => {
      if (
        index !== tempData.records.length - 1 &&
        item.quantityTypes[0].stockCount === 0
      ) {
        tempValidation.records[index].quantityTypes = true;
      }
    });
    const isAllValid = tempValidation.records.some(
      (item: any, index: number) => item.quantityTypes === true
    );
    if (!tempValidation.date && !isAllValid) {
      setLoading(true);
      tempData.records.pop();
      const apiService = new APICallService(
        goodsRequests.addGoodsRequest,
        tempData,
        '',
        '',
        false,
        '',
        GoodsRequestConst
      );
      const response = await apiService.callAPI();
      if (response) {
        navigate('/goods-requests');
        success(goodsRequestTaost.requestAdded);
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  return (
    <Row className="align-items-center">
      <Col
        xs
        className="align-self-center mb-5"
      >
        <h1 className="fs-22 fw-bolder mb-0">
          {GoodsRequestString.addGoodsRequest}
        </h1>
      </Col>
      <Col xs={12}>
        <Card className="bg-light border mb-7">
          <Card.Body className="px-7">
            <Row className="align-items-center">
              <Col
                // md={6}
                // lg={3}
                xs={12}
              >
                <FormLabel className="fs-16 fw-500 text-dark">
                  {InventoryString.filterWarehouseName}
                </FormLabel>
              </Col>
              <Col
                lg={6}
                md={6}
                className="mw-375px"
              >
                <KTSVG
                  path="/media/icons/duotune/general/gen021.svg"
                  className="svg-icon-3 position-absolute ms-3"
                />
                <CustomSelectWhite
                  //   loading={initLoading}
                  options={
                    wareHouses && wareHouses.length
                      ? wareHouses.map((val: any) => {
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
                    wareHouses && wareHouses.length
                      ? wareHouses
                          .filter((item: any) => item._id === selectedWareHouse)
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
                  isClearable={false}
                  onChange={(event: any) => {
                    handleWareHouse(event);
                  }}
                  placeholder="Select warehouse"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      {!selectedWareHouse ? (
        <Row className="align-items-center">
          <Col
            xs
            className="align-self-center mb-5"
          >
            <Card className="bg-light border mb-7">
              <Card.Body className="px-7">
                <Row>
                  <Col
                    xs
                    className="align-self-center mb-5"
                  >
                    <h1 className="fs-22 fw-bolder mb-0">
                      {GoodsRequestString.prductAndQuantiry}
                    </h1>
                  </Col>
                </Row>
                <div className="fs-18 fw-500 text-center mt-5 mb-8">
                  Please select a warehouse to add goods in the warehouse.
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="align-items-center pe-0">
          <Col
            xs={12}
            className="align-self-center mb-5 pe-0 "
          >
            <Card className="bg-light border mb-7">
              <Card.Body className="px-7">
                <Row>
                  <Col
                    xs={12}
                    className="align-self-center mb-5"
                  >
                    <h1 className="fs-22 fw-bolder mb-0">
                      {GoodsRequestString.prductAndQuantiry}
                    </h1>
                  </Col>
                  <Col xs>
                    {requestData.records.map((item: any, index: number) => (
                      <Row
                        className={`mb-1  pb-4 ${
                          item.variant.length === 0
                            ? ''
                            : 'border-2 border-bottom'
                        }`}
                      >
                        <Col
                          md={6}
                          className="mw-375px mt-3"
                        >
                          <FormLabel className="fs-16 fw-500 text-dark">
                            {GoodsRequestString.selectProduct}
                          </FormLabel>
                          <div>
                            <CustomSelectWhite
                              //   loading={initLoading}
                              options={
                                wareHouseProduct && wareHouseProduct.length
                                  ? wareHouseProduct
                                      .filter(
                                        (val: any) =>
                                          !requestData.records.some(
                                            (item: any) =>
                                              item.variant === val._id
                                          )
                                      )
                                      .map((val: any) => {
                                        return {
                                          ...val,
                                          label: (
                                            <div className="d-flex">
                                              <div className="symbol symbol-30px border me-3">
                                                <img
                                                  src={
                                                    val.media[0]?.url ||
                                                    '' ||
                                                    ''
                                                  }
                                                  className="object-fit-contain "
                                                  alt=""
                                                />
                                              </div>
                                              <div>
                                                <span className="fs-16 fw-600 text-black mb-0 d-block">
                                                  {val.title.replace(
                                                    /\s*\)\s*/g,
                                                    ')'
                                                  )}
                                                </span>
                                                <span className="fs-14 fw-500 text-gray mb-0">
                                                  {`SKU: ${
                                                    val?.skuNumber || 'NA'
                                                  }`}
                                                </span>
                                              </div>
                                            </div>
                                          ),
                                          value: val._id,
                                          title: val.title.replace(
                                            /\s*\)\s*/g,
                                            ')'
                                          ),
                                        };
                                      })
                                  : []
                              }
                              value={
                                wareHouseProduct && wareHouseProduct.length
                                  ? wareHouseProduct
                                      .filter(
                                        (val: any) => val._id === item.variant
                                      )
                                      .map((val: any) => ({
                                        ...val,
                                        label: (
                                          <div className="d-flex">
                                            <div className="symbol symbol-30px border me-3">
                                              <img
                                                src={
                                                  val.media[0]?.url || '' || ''
                                                }
                                                className="object-fit-contain"
                                                alt=""
                                              />
                                            </div>
                                            <div>
                                              <span className="fs-16 fw-600 text-black mb-0 d-block">
                                                {val.title.replace(
                                                  /\s*\)\s*/g,
                                                  ')'
                                                )}
                                              </span>
                                              <span className="fs-14 fw-500 text-gray mb-0">
                                                {`SKU: ${
                                                  val?.skuNumber || 'NA'
                                                }`}
                                              </span>
                                            </div>
                                          </div>
                                        ),
                                        value: val._id,
                                        title: val.title.replace(
                                          /\s*\)\s*/g,
                                          ')'
                                        ),
                                      }))
                                  : null
                              }
                              //   isClearable={expiry ? true : false}
                              isClearable={false}
                              onChange={(event: any) => {
                                handleProductSelect(event, index);
                              }}
                              placeholder="Select product"
                            />
                          </div>
                        </Col>
                        {item.variant.length > 0 ? (
                          <Col
                            md={6}
                            className="mt-3"
                          >
                            <FormLabel className="fs-16 fw-500 text-dark">
                              {GoodsRequestString.quantity}
                            </FormLabel>
                            <div className="d-flex align-items-center">
                              <InputGroup className="w-150px">
                                <Form.Control
                                  className={clsx(
                                    'bg-white fs-14 fw-bold text-dark border-1 min-h-65px px-3 ps-5 borderRight-0',
                                    validation.records[index].quantityTypes
                                      ? 'border-danger'
                                      : ''
                                  )}
                                  //   className="form-control-custom bg-white fs-14 fw-600 w-100px
                                  //                         me-3 min-h-60px px-3 text-center"
                                  value={
                                    item.quantityTypes.find(
                                      (val: any) => val.type === Units
                                    )?.stockCount ?? 0
                                  }
                                  onChange={(e: any) => {
                                    handleCountChange(index, e.target.value);
                                  }}
                                  onKeyPress={handleOnKeyPress}
                                />
                                <InputGroup.Text
                                  className={clsx(
                                    'bg-white text-gray border-1 fs-16',
                                    validation.records[index].quantityTypes
                                      ? 'border-danger'
                                      : ''
                                  )}
                                >
                                  Units
                                </InputGroup.Text>
                              </InputGroup>
                              <div className="ms-6">
                                <Button
                                  variant="link"
                                  className="btn-flush"
                                  onClick={() => {
                                    handleRemove(index);
                                  }}
                                  // disabled={loading}
                                >
                                  <img
                                    className="w-25px h-25px border-0"
                                    src={GrayClose}
                                    alt=""
                                  />
                                </Button>
                              </div>
                            </div>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col
            md={6}
            className="mb-5 pe-0"
          >
            <Card className="bg-light border min-h-160px">
              <Card.Body className="px-7">
                <Row>
                  <Col
                    xs
                    className="align-self-center mb-5"
                  >
                    <h1 className="fs-22 fw-bolder mb-0">
                      {GoodsRequestString.expectedDeliveryDate}
                    </h1>
                  </Col>
                </Row>
                <div>
                  <CustomDatePicker
                    className={clsx(
                      'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-xl-300px min-w-250px min-w-lg-200px min-w-md-325px min-w-xs-288px'
                    )}
                    selected={deliveryDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    showFullMonthYearPicker
                    placeholder="Select date"
                    showYearDropdown={true}
                    scrollableYearDropdown={true}
                    dropdownMode="select"
                    isClearable={true}
                    dayClassName={(date: Date) => {
                      return Method.dayDifference(
                        new Date().toDateString(),
                        date.toDateString()
                      ) < 0
                        ? 'date-disabled'
                        : '';
                    }}
                    customInput={
                      <CustomDateInput
                        inputClass={`${validation.date ? 'border-danger' : ''}`}
                      />
                    }
                    // disabled={fetchLoader}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col
            md={6}
            className="mb-5 pe-0"
          >
            <Card className="bg-light border   min-h-160px">
              <Card.Body className="px-7">
                <Row>
                  <Col
                    xs
                    className="align-self-center mb-5"
                  >
                    <h1 className="fs-22 fw-bolder mb-0">
                      {GoodsRequestString.goodsDetails}
                    </h1>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between">
                  <label className="fs-16 fw-600">Units:</label>
                  <label className="fs-16 fw-600">
                    {requestData.records.reduce(
                      (preVal: any, currVal: any, index) => {
                        if (currVal.quantityTypes.length === 0) return preVal;
                        return (
                          parseInt(currVal?.quantityTypes[0]?.stockCount) +
                          parseInt(preVal)
                        );
                      },
                      0
                    )}
                  </label>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={12}>
            <div className="d-flex justify-content-end mt-6">
              <Button
                size="lg"
                className="min-h-60px"
                onClick={handleSubmit}
                disabled={loading || requestData.records.length === 1}
              >
                {!loading && (
                  <span className="indicator-label fs-16 fw-bold">
                    Confirm request
                  </span>
                )}
                {loading && (
                  <span
                    className="indicator-progress fs-16 fw-bold"
                    style={{ display: 'block' }}
                  >
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Row>
  );
};
export default AddGoodsRequest;
