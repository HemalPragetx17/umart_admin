import { Button, Card, Col, Row } from 'react-bootstrap';
import { CustomNotificationString } from '../../../utils/string';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { error, success } from '../../../Global/toast';
import APICallService from '../../../api/apiCallService';
import {
  buyer,
  dashBoardEndPoints,
  manageProductInventory,
} from '../../../api/apiEndPoints';
import { notificationJSON } from '../../../utils/staticJSON';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { CustomReportSelect } from '../../custom/Select/CustomReportSelect';
import { customNotificationsToast } from '../../../utils/toast';
import {
  Add,
  CustomNotificationConst,
  PAGE_LIMIT,
} from '../../../utils/constants';
import Method from '../../../utils/methods';
import { useAuth } from '../auth';
import Validations from '../../../utils/validations';
import DefaultImg from '../../../umart_admin/assets/media/avatars/blank.png';
const CustomNotification = () => {
  const { currentUser } = useAuth();
  const [productLoading, setProductLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    title: string;
    message: string;
    buyers: any;
    variants: any;
  }>({
    title: '',
    message: '',
    buyers: [],
    variants: [],
  });
  const [validation, setValidation] = useState<{
    title: boolean;
    message: boolean;
    buyers: boolean;
    variants: boolean;
    notifications: boolean;
  }>({
    title: false,
    message: false,
    buyers: false,
    variants: false,
    notifications: false,
  });
  const [customerList, setCustomerList] = useState<any>([]);
  const [productsList, setProductsList] = useState<any>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [sendToAllCustomer, setSendToAllCustomer] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [productInput, setProductInput] = useState('');
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(CustomNotificationConst, currentUser)) {
        return window.history.back();
      }
      await fetchCustomers(1, PAGE_LIMIT);
    })();
  }, []);
  const fetchCustomers = async (
    pageNo: number,
    limit: number = 10,
    searchTerm: string = ''
  ) => {
    setCustomerLoading(true);
    let params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      state: 1,
      needCount: true,
      searchTerm: searchTerm,
    };
    const apiService = new APICallService(
      buyer.customerList,
      params,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setTotalCustomers(response.total);
      // data.unshift({
      //   value: 0,
      //   name: 'Select All',
      //   title: 'Select All',
      //   label: (
      //     <>
      //       <span className="fs-16 fw-600 text-black ">Select All</span>
      //     </>
      //   ),
      //   id: 0,
      // });
      setCustomerList((preData: any) => {
        let data: any = [];
        response.records.map((val: any) => {
          data.push({
            value: val._id,
            name: val.name,
            title: val.name,
            label: (
              <>
                <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                  <img
                    src={val?.image || DefaultImg}
                    className="p-1"
                  />
                </span>
                <span className="fs-16 fw-600 text-black ">{val.name}</span>
              </>
            ),
            id: val._id,
          });
        });
        if (pageNo == 1) {
          return data;
        } else {
          return [...preData, ...data];
        }
      });
    }
    setCustomerLoading(false);
  };
  const fetchProducts = async () => {
    setProductLoading(true);
    let data = {
      sortKey: 'title',
      sortOrder: -1,
      state: 1,
      needCount: false,
      // ['status[0]']: ApprovedProduct,
    };
    let apiService = new APICallService(
      manageProductInventory.listProduct,
      data,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    let response = await apiService.callAPI();
    if (response.records) {
      let data: any = [];
      response.records.map((val: any) => {
        data.push({
          value: val._id,
          name: val.title,
          title: val.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val.media[0].url}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">{val.title}</span>
            </>
          ),
          id: val?._id,
          productId: val?.product?.reference,
        });
      });
      setProductsList(data);
    } else {
      setProductsList([]);
    }
    setProductLoading(false);
  };
  const fetchTopProducts = async () => {
    let params: any = {
      needTopProducts: true,
    };
    let apiService = new APICallService(
      dashBoardEndPoints.getInitData,
      params,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    let response = await apiService.callAPI();
    if (response && response.topProducts.records.length) {
      let data: any = [];
      response.topProducts.records.map((val: any) => {
        data.push({
          value: val._id,
          name: val.title,
          title: val.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val?.media[0]?.url || ''}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">{val.title}</span>
            </>
          ),
          id: val._id,
          productId: val?.product?.reference,
        });
      });
      setProductsList(data);
    } else {
      error('No products are available in the cart');
      setProductsList([]);
    }
  };
  const fetchTopCustomers = async () => {
    let params: any = {
      needTopCustomers: true,
    };
    let apiService = new APICallService(
      dashBoardEndPoints.getInitData,
      params,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    let response = await apiService.callAPI();
    if (response && response.topCustomers.length) {
      let data: any = [];
      let selectAll: any = [
        {
          value: 0,
          name: 'Select All',
          title: 'Select All',
          label: (
            <>
              <span className="fs-16 fw-600 text-black ">Select All</span>
            </>
          ),
          id: 0,
        },
      ];
      response.topCustomers.map((val: any) => {
        data.push({
          value: val._id,
          name: val.name,
          title: val.name,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val?.image || DefaultImg}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">{val.name}</span>
            </>
          ),
          id: val._id,
        });
      });
      data.unshift(...selectAll);
      setCustomerList(data);
    } else {
      error('No top customers in last month');
      setProductsList([]);
    }
  };
  const fetchBuyerCart = async (customerId: string) => {
    setProductLoading(true);
    let apiService = new APICallService(
      buyer.getBuyerCart,
      customerId,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    let response = await apiService.callAPI();
    if (response.records.length) {
      let data: any = [];
      let selectAll: any = [
        {
          value: 0,
          name: 'Select All',
          title: 'Select All',
          label: (
            <>
              <span className="fs-16 fw-600 text-black ">Select All</span>
            </>
          ),
          id: 0,
        },
      ];
      response.records.map((val: any) => {
        data.push({
          value: val?.reference._id,
          name: val?.reference.title,
          title: val?.reference.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val?.reference.media[0].image}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">
                {val?.reference.title}
              </span>
            </>
          ),
          id: val?.reference._id,
          productId: val?.reference.product?.reference,
        });
      });
      data.unshift(...selectAll);
      setProductsList(data);
    } else {
      // error('No products are available in the cart');
      setProductsList([]);
    }
    setProductLoading(false);
  };
  const fetchBuyerTopProducts = async (customerId: string) => {
    setProductLoading(true);
    let apiService = new APICallService(
      buyer.getBuyerOrderedProduct,
      customerId,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    let response = await apiService.callAPI();
    if (response.length) {
      let data: any = [];
      response.map((val: any) => {
        data.push({
          value: val?.variant?._id,
          name: val?.variant?.title,
          title: val?.variant?.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val?.variant?.media[0]?.url}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">
                {val?.variant?.title}
              </span>
            </>
          ),
          id: val?.variant?._id,
          productId: val?.variant?.product?.reference,
        });
      });
      setProductsList(data);
    } else {
      //  error('No products are available for selected customer.');
      setProductsList([]);
    }
    setProductLoading(false);
  };
  const handleInputChange = (event: any, name: string) => {
    const tempData: any = { ...notificationData };
    const tempValidation: any = { ...validation };
    tempData[name] = event.target.value;
    if (event.target.value.trim().length > 0) {
      tempValidation[name] = false;
    } else {
      tempValidation[name] = true;
    }
    if (name === 'title' && event.target.value.trim().length > 100) {
      tempValidation[name] = true;
    }
    if (name === 'message' && event.target.value.trim().length > 500) {
      tempValidation[name] = true;
    }
    setValidation(tempValidation);
    setNotificationData(tempData);
  };
  const handleCustomer = async (event: any) => {
    const tempData = { ...notificationData };
    const tempValidation = { ...validation };
    if (Array.isArray(event)) {
      if (event.length > tempData.buyers.length) {
        if (
          event.some((item) => item.value === 0) ||
          event.length == customerList.length - 1
        ) {
          tempData.buyers = customerList;
        } else {
          tempData.buyers = event;
        }
      } else {
        if (event.some((val: any) => val.value === 0)) {
          let temp = event.filter((val: any) => val.value !== 0);
          tempData.buyers = temp;
        } else if (
          !event.some((val: any) => val.value === 0) &&
          event.length == customerList.length - 1
        ) {
          tempData.buyers = [];
        } else {
          tempData.buyers = event;
        }
      }
    } else {
      tempData.buyers = [event];
    }
    if (event && selectedNotification?.value == 3) {
      // await fetchBuyerCart(event.id);
    }
    if (event && event?.value && selectedNotification?.value === 2) {
      await fetchBuyerTopProducts(event?.value);
    }
    tempValidation.buyers = false;
    setNotificationData(tempData);
    setValidation(tempValidation);
  };
  const handleProduct = async (event: any) => {
    const tempData = { ...notificationData };
    const tempValidation = { ...validation };
    // if (Array.isArray(event)) {
    //   if (event.length > tempData.variants.length) {
    //     if (
    //       event.some((item) => item.value === 0) ||
    //       event.length == productsList.length - 1
    //     ) {
    //       tempData.variants = productsList;
    //     } else {
    //       tempData.variants = event;
    //     }
    //   } else {
    //     if (event.some((val: any) => val.value === 0)) {
    //       let temp = event.filter((val: any) => val.value !== 0);
    //       tempData.variants = temp;
    //     } else if (
    //       !event.some((val: any) => val.value === 0) &&
    //       event.length == productsList.length - 1
    //     ) {
    //       tempData.variants = [];
    //     } else {
    //       tempData.variants = event;
    //     }
    //   }
    // } else {
    //   tempData.variants = [event];
    // }
    if (event.length > 10) {
      return error(
        'Products limit exceeded, You can select only 10 products at a time.'
      );
    }
    tempData.variants = event;
    tempValidation.variants = false;
    setNotificationData(tempData);
    setValidation(tempValidation);
  };
  const handleNotification = async (event: any) => {
    const temp = { ...notificationData };
    const tempValidation = { ...validation };
    temp.buyers = [];
    temp.variants = [];
    setProductsList([]);
    // setSelectedProduct([]);
    // setSelectedCustomer([]);
    setSelectedNotification(event);
    if (event.value == 4) {
      await fetchProducts();
    }
    if (event.value === 5) {
      await fetchTopProducts();
    }
    if (event.value === 6) {
      await fetchTopCustomers();
    }
    tempValidation.notifications = false;
    if (event.value == 2) {
      setSendToAllCustomer(false);
    }
    setNotificationData(temp);
    setValidation(tempValidation);
  };
  const handleSubmit = async () => {
    const tempValidation: any = JSON.parse(JSON.stringify(validation));
    const tempData: any = { ...notificationData };
    tempData.title = tempData.title.trim();
    tempData.message = tempData.message.trim();
    if (tempData.title.length === 0 || tempData.title.length > 100) {
      tempValidation.title = true;
    }
    if (tempData.message.length === 0 || tempData.message.length > 500) {
      tempValidation.message = true;
    }
    if (!selectedNotification) {
      // return error('Please select a notification type');
      tempValidation.notifications = true;
    }
    if (
      tempData.buyers.length === 0 &&
      selectedNotification &&
      selectedNotification.value != 7 &&
      sendToAllCustomer == false
    ) {
      // return error('Please select customers');
      tempValidation.buyers = true;
    } else {
      tempValidation.buyers = false;
    }
    if (
      selectedNotification &&
      (selectedNotification.value == 2 ||
        selectedNotification.value == 5 ||
        selectedNotification.value == 4) &&
      tempData.variants.length === 0
    ) {
      // return error('Please select products');
      tempValidation.variants = true;
    }
    const isValid = await Validations.validateObject(tempValidation);
    // if (!tempValidation.title && !tempValidation.message) {
    if (isValid) {
      // if (!selectedNotification) {
      //   return error('Please select a notification type');
      //   tempValidation.notifications = true;
      // }
      // if (tempData.buyers.length === 0 && selectedNotification.value != 7) {
      //   return error('Please select customers');
      //   tempValidation.buyers = true;
      // }
      // if (
      //   (selectedNotification.value == 2 ||
      //     selectedNotification.value == 5 ||
      //     selectedNotification.value == 4) &&
      //   tempData.variants.length === 0
      // ) {
      //   return error('Please select products');
      //   tempValidation.variants = true;
      // }
      if (
        selectedNotification.value !== 2 &&
        tempData.buyers.some((val: any) => val.value == 0)
      ) {
        tempData.buyers.shift();
      }
      if (
        (selectedNotification.value == 2 ||
          selectedNotification.value == 5 ||
          selectedNotification.value == 4) &&
        tempData.variants.some((val: any) => val.value === 0)
      ) {
        tempData.variants.shift();
      }
      tempData.buyers = tempData.buyers.map((item: any) => item.value);
      tempData.variants = tempData.variants.map((item: any) => {
        return {
          variantId: item.value,
          productId: item.productId,
        };
      });
      tempData.type = selectedNotification.type;
      setLoading(true);
      if (sendToAllCustomer) {
        tempData.buyers = await fetchAllCustomers();
      }
      const apiService = new APICallService(
        buyer.sendNotification,
        tempData,
        '',
        '',
        false,
        '',
        CustomNotificationConst
      );
      const response = await apiService.callAPI();
      if (response) {
        success(customNotificationsToast.notificationSent);
        tempData.title = '';
        tempData.message = '';
        tempData.buyers = [];
        tempData.variants = [];
        setNotificationData(tempData);
        setSelectedNotification(null);
        setSendToAllCustomer(false);
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  const fetchAllCustomers = async () => {
    let params = {
      sortKey: 'createdAt',
      sortOrder: -1,
      state: 1,
      needCount: false,
    };
    const apiService = new APICallService(
      buyer.customerList,
      params,
      '',
      '',
      false,
      '',
      CustomNotificationConst
    );
    const response = await apiService.callAPI();
    let data: any = [];
    if (response) {
      data = response?.records.map((item: any) => item._id);
    }
    return data;
  };
  const onMenuScrollToBottom = async () => {
    if (!(customerList.length === totalCustomers)) {
      let tempPage = page;
      tempPage = tempPage + 1;
      setPage(tempPage);
      await fetchCustomers(tempPage, PAGE_LIMIT, searchTerm);
    }
  };
  const onMenuClose = async () => {
    setSearchTerm('');
  };
  const onMenuOpen = async () => {
    setPage(1);
    await fetchCustomers(1, PAGE_LIMIT, searchTerm);
  };
  const handleSelectInputChange = async (newValue: string) => {
    setPage(1);
    setSearchTerm(newValue);
    await fetchCustomers(1, PAGE_LIMIT, newValue);
  };
  const handleProductInputChange = (newValue: string, actionMeta: any) => {
    if (
      actionMeta.action !== 'set-value' &&
      actionMeta.action !== 'input-blur'
    ) {
      setProductInput(newValue);
    }
    return newValue;
  };
  return (
    <div className="p-9">
      <Row className="g-6">
        <Col xs={12}>
          <h1 className="fs-22 fw-bolder mb-0">
            {CustomNotificationString.cutomNofication}
          </h1>
        </Col>
        <Col xs={12}>
          <Card className="bg-light border">
            <Card.Body className="p-9">
              <Row>
                <Col
                  xs={12}
                  className="mb-6 "
                >
                  <Row className="align-items-center">
                    <Col lg={2}>
                      <label
                        className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required"
                        htmlFor="title"
                      >
                        {CustomNotificationString.title}
                      </label>
                    </Col>
                    <Col lg={5}>
                      <input
                        id="title"
                        type="text"
                        required
                        className={clsx(
                          'form-control form-control-solid bg-white h-60px  form-control-lg text-dark fs-16 fw-600',
                          validation.title ? 'border-danger' : 'border-gray-300'
                        )}
                        name="title"
                        placeholder="Enter title"
                        value={notificationData.title}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ): void => handleInputChange(e, 'title')}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  lg={12}
                  className="mb-6"
                >
                  <Row className="align-items-center ">
                    <Col
                      lg={2}
                      className="d-flex align-items-start"
                    >
                      <label className="fs-16 fw-500 text-dark required">
                        {CustomNotificationString.description}
                      </label>
                    </Col>
                    <Col lg={5}>
                      <textarea
                        className={clsx(
                          'form-control form-control-solid bg-white  form-control-lg text-dark fs-16 fw-600',
                          validation.message
                            ? 'border-danger'
                            : 'border-gray-300'
                        )}
                        rows={3}
                        name="message"
                        placeholder="Enter description"
                        value={notificationData.message}
                        onChange={(e: any) => {
                          handleInputChange(e, 'message');
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  lg={12}
                  className="mb-6"
                >
                  <Row className="align-items-center ">
                    <Col
                      lg={2}
                      className="d-flex align-items-start"
                    >
                      <label className="fs-16 fw-500 text-dark required">
                        Send notification for
                      </label>
                    </Col>
                    <Col lg={5}>
                      <CustomSelectWhite
                        border={validation.notifications ? '#e55451' : ''}
                        // disabled={loading}
                        // isLoading={fetchLoader}
                        placeholder="Select notification type"
                        options={notificationJSON}
                        loadingMessage={'Fetching Data'}
                        isMulti={false}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ): any => handleNotification(e)}
                        value={selectedNotification}
                      />
                    </Col>
                  </Row>
                </Col>
                {selectedNotification && selectedNotification.value != 7 ? (
                  <Col
                    lg={12}
                    className="mb-6"
                  >
                    {selectedNotification.value == 2 ? (
                      <></>
                    ) : (
                      <Row>
                        <Col
                          lg={12}
                          className="mb-6"
                        >
                          <Row className="align-items-center ">
                            <Col
                              lg={2}
                              className="d-flex align-items-start"
                            >
                              <label className="fs-16 fw-500 text-dark">
                                Do you want to send notification to all
                                customers
                              </label>
                            </Col>
                            <Col
                              lg={5}
                              className="align-self-center d-lg-flex d-md-flex"
                            >
                              <div className="form-check form-check-custom form-check-solid me-4">
                                <input
                                  className="form-check-input "
                                  type="radio"
                                  value="0"
                                  id="singleCustomer"
                                  checked={!sendToAllCustomer}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ): void => {
                                    setSendToAllCustomer(false);
                                  }}
                                />
                                <label
                                  htmlFor="singleCustomer"
                                  className="form-check-label fs-16 fw-600 text-dark"
                                >
                                  No
                                </label>
                              </div>
                              <div className="form-check form-check-custom form-check-solid">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value="1"
                                  id="allCustomers"
                                  checked={sendToAllCustomer}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ): void => {
                                    setSendToAllCustomer(true);
                                  }}
                                />
                                <label
                                  htmlFor="allCustomers"
                                  className="form-check-label fs-16 fw-600 text-dark"
                                >
                                  Yes
                                </label>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                    {sendToAllCustomer == false && (
                      <Row className="align-items-center ">
                        <Col
                          lg={2}
                          className="d-flex align-items-start"
                        >
                          <label className="fs-16 fw-500 text-dark required">
                            Select Customer
                          </label>
                        </Col>
                        <Col lg={5}>
                          {/* <CustomReportSelect
                        backgroundColor="#ffff"
                        minHeight="60px"
                        closeMenuOnSelect={false}
                        isSearchable={true}
                        options={customerList}
                        text={'customer selected'}
                        hideSelectedOptions={false}
                        onChange={(event: any) => {
                          handleCustomer(event);
                        }}
                        value={notificationData.buyers}
                        isMulti={
                          selectedNotification
                            ? selectedNotification.value == 2 ||
                              selectedNotification.value == 3
                              ? false
                              : true
                            : true
                        }
                      />
                       */}
                          <CustomReportSelect
                            backgroundColor="#ffff"
                            className={
                              validation.buyers
                                ? 'border border-danger rounded'
                                : ''
                            }
                            border={validation.buyers ? '#e55451' : ''}
                            minHeight="60px"
                            closeMenuOnSelect={false}
                            isSearchable={true}
                            placeholder="Select customers"
                            // options={customerList}
                            options={
                              selectedNotification
                                ? selectedNotification.value == 2
                                  ? customerList.filter(
                                      (val: any) => val.value !== 0
                                    )
                                  : customerList
                                : customerList
                            }
                            text={'customer selected'}
                            hideSelectedOptions={false}
                            onChange={(event: any) => {
                              handleCustomer(event);
                            }}
                            isLoading={customerLoading}
                            // isDisabled={customerLoading}
                            value={
                              notificationData.buyers.length
                                ? notificationData.buyers
                                : []
                            }
                            defaultValue={
                              notificationData.buyers.length
                                ? notificationData.buyers
                                : []
                            }
                            isMulti={
                              selectedNotification
                                ? selectedNotification.value == 2
                                  ? false
                                  : true
                                : true
                            }
                            onMenuScrollToBottom={onMenuScrollToBottom}
                            onMenuClose={() => {
                              onMenuClose();
                            }}
                            onMenuOpen={() => {
                              onMenuOpen();
                            }}
                            onInputChange={(newValue: any, { action }: any) => {
                              if (action === 'input-change') {
                                handleSelectInputChange(newValue);
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    )}
                  </Col>
                ) : (
                  <></>
                )}
                {selectedNotification &&
                selectedNotification.value != 1 &&
                selectedNotification.value != 3 &&
                productsList.length ? (
                  <Col
                    lg={12}
                    className="mb-6"
                  >
                    <Row className="align-items-center ">
                      <Col
                        lg={2}
                        className="d-flex align-items-start"
                      >
                        <label className="fs-16 fw-500 text-dark required">
                          Select Product
                        </label>
                      </Col>
                      <Col lg={5}>
                        <CustomReportSelect
                          backgroundColor="#ffff"
                          minHeight="60px"
                          border={validation.variants ? '#e55451' : ''}
                          closeMenuOnSelect={false}
                          isSearchable={true}
                          placeholder="Select products"
                          options={productsList}
                          text={'products selected'}
                          hideSelectedOptions={false}
                          onChange={(event: any) => {
                            handleProduct(event);
                          }}
                          value={notificationData.variants}
                          isMulti={true}
                          inputValue={productInput}
                          onInputChange={handleProductInputChange}
                        />
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          {Method.hasPermission(CustomNotificationConst, Add, currentUser) ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && (
                <span
                  className="indicator-progress fs-16 fw-bold"
                  style={{ display: 'block' }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
              {!loading && <span className="indicator-label">Submit</span>}
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  );
};
export default CustomNotification;
