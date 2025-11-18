import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { PromotionAndCampaignString } from '../../../../../utils/string';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Method from '../../../../../utils/methods';
import CustomDatePicker from '../../../../custom/DateRange/DatePicker';
import CustomDateInput from '../../../../custom/Select/CustomDateInput';
import EditSVG from '../../../../../umart_admin/assets/media/svg_uMart/edit-round.svg';
import UploadSVG from '../../../../../umart_admin/assets/media/svg_uMart/upload-gray.svg';
import CrossSvg from '../../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import { ICouponData } from '../../../../../types';
import {
  ApplyToAllProducts,
  BrandPlacement,
  CategoryPagePlacement,
  FlatDiscount,
  HomePagePlacement,
  PercentageDiscount,
  ProductPlacement,
  Promotion,
} from '../../../../../utils/constants';
import Validations from '../../../../../utils/validations';
import { fileValidation } from '../../../../../Global/fileValidation';
import { CustomReportSelect } from '../../../../custom/Select/CustomReportSelect';
import { IOptionWithImage } from '../../../../../types/responseIndex';
import { useLocation, useNavigate } from 'react-router-dom';
import APICallService from '../../../../../api/apiCallService';
import { promotionCampaign } from '../../../../../api/apiEndPoints';
import Loader from '../../../../../Global/loader';
import { promotionCampaignApiJson } from '../../../../../api/apiJSON/promotionCampaign';
import { error, success } from '../../../../../Global/toast';
import { promotionCampaignToast } from '../../../../../utils/toast';
const EditCouponPromotion = () => {
  const navigate = useNavigate();
  const location: any = useLocation();
  const id: any = location?.state?._id;
  const [couponData, setCouponData] = useState<ICouponData>({
    title: '',
    startDate: null,
    endDate: null,
    image: '',
    imageReader: null,
    redemptionLimit: '',
    description: '',
    placement: HomePagePlacement.toString(),
    couponApplyTo: ApplyToAllProducts,
    couponCode: '',
    discountValue: '',
    minPurchaseAmount: '',
    type: FlatDiscount,
  });
  const [validations, setValidations] = useState<{
    title: boolean;
    startDate: boolean;
    endDate: boolean;
    image: boolean;
    redemptionLimit: boolean;
    description: boolean;
    couponCode: boolean;
    discountValue: boolean;
    minPurchaseAmount: boolean;
    // products: boolean;
  }>({
    title: false,
    startDate: false,
    endDate: false,
    image: false,
    redemptionLimit: false,
    description: false,
    couponCode: false,
    discountValue: false,
    minPurchaseAmount: false,
    // products: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<IOptionWithImage[]>(
    []
  );
  const [productList, setProductsList] = useState<IOptionWithImage[]>([]);
  const [fetchLoader, setFetchLoader] = useState(true);
  useEffect(() => {
    if (!id) {
      return window.history.back();
    }
    (async () => {
      setFetchLoader(true);
      await fetchCouponDetails(id);
      // await fetchProductList();
      setFetchLoader(false);
    })();
  }, []);
   const fetchProductList = async () => {
     setFetchLoader(true);
     let params: any = {
       'campaignRef[0]': id,
     };
     const apiCallService = new APICallService(
       promotionCampaign.listProductForPromotion,
       params,
       '',
       '',
       false,
       '',
       Promotion
     );
     const response = await apiCallService.callAPI();
     if (response) {
       const temp: IOptionWithImage[] = response.records.map((item: any) => ({
         label: (
           <>
             <img
               src={item?.media[0]?.url || ''}
               height={15}
               className=" me-2"
               alt=""
             />
             <span className="fs-14 fw-500 text-black ">
               {item?.title || ''}
             </span>
           </>
         ),
         name: item?.title || '',
         title: item?.title || '',
         value: item?._id || '',
         id: item?._id || '',
         image: item?.media[0]?.url || '',
       }));
       if (temp.length) {
         temp.unshift({
           label: (
             <>
               <span className="fs-14 fw-500 text-black ">
                 {'All Products'}
               </span>
             </>
           ),
           name: 'All Products',
           title: 'All Products',
           value: '0',
           id: '0',
           image: '',
         });
       }

       setProductsList(temp);
     }
     setFetchLoader(false);
     return response?.records || [];
   };
  const fetchCouponDetails = async (id: string) => {
    const apiCallService = new APICallService(
      promotionCampaign.couponDetails,
      id,
      '',
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const temp = {
        ...couponData,
        title: response?.title || '',
        startDate:
          response?.startDate && response?.expired === false
            ? new Date(response.startDate)
            : null,
        endDate: response?.endDate && response?.expired === false ? new Date(response.endDate) : null,
        image: response?.image || '',
        minPurchaseAmount: response?.minimumPurchaseAmount
          ? response?.minimumPurchaseAmount.toString()
          : '',
        description: response?.description || '',
        discountValue: response?.discountValue
          ? response.discountValue.toString()
          : '',
        placement: response?.placement ? response.placement.toString() : '',
        redemptionLimit: response.redemptionLimit.toString(),
        type: response.discountType.toString(),
        couponCode: response?.couponCode || '',
      };
      // const tempVariant: IOptionWithImage[] = response?.variants.map(
      //   (item: any) => {
      //     return {
      //       label: (
      //         <>
      //           <img
      //             src={item?.reference?.media[0]?.url || ''}
      //             height={15}
      //             className=" me-2"
      //             alt=""
      //           />
      //           <span className="fs-14 fw-500 text-black ">
      //             {item?.reference?.title || ''}
      //           </span>
      //         </>
      //       ),
      //       name: item?.reference?.title || '',
      //       title: item?.reference?.title || '',
      //       value: item?.reference?._id || '',
      //       id: item?.reference?._id || '',
      //       image: item?.reference?.media[0]?.url || '',
      //     };
      //   }
      // );
      // const products = await fetchProductList();      
      // if(products.length === tempVariant.length){
      //   tempVariant.unshift({
      //     label: (
      //       <>
      //         <span className="fs-14 fw-500 text-black ">{'All Products'}</span>
      //       </>
      //     ),
      //     name: 'All Products',
      //     title: 'All Products',
      //     value: '0',
      //     id: '0',
      //     image: '',
      //   });
      // }
      // setSelectedProducts(tempVariant);
      setCouponData(temp);
      return response.record;
    }
  };
   
  const handleProductChange = (event: IOptionWithImage[]) => {
    let temp = [...selectedProducts];
    let tempValidation = { ...validations };
    if (Array.isArray(event)) {
      if (event.length > selectedProducts.length) {
        if (
          event.some((item) => item.value === '0') ||
          event.length == productList.length - 1
        ) {
          temp = [...productList];
        } else {
          temp = [...event];
        }
      } else {
        if (event.some((val: any) => val.value === '0')) {
          let tempData = event.filter((val) => val.value !== '0');
          temp = tempData;
        } else if (
          !event.some((val) => val.value === '0') &&
          event.length == productList.length - 1
        ) {
          temp = [];
        } else {
          temp = event;
        }
      }
    } else {
      temp = [...event];
    }
    // if (event) {
    //   temp = [...event];
    // }
    // if (event.length === 0) {
    //   tempValidation.products = true;
    // } else {
    //   tempValidation.products = false;
    // }
    setValidations(tempValidation);
    setSelectedProducts(temp);
  };
  const handleSubmit = async () => {
    const temp = { ...couponData };
    let tempValidation = { ...validations };
    if (temp.startDate && temp.endDate) {
      const dayDifference = Method.dayDifference(
        new Date(temp.startDate).toDateString(),
        new Date(temp.endDate).toDateString()
      );
      if (dayDifference < 0) {
        return error(promotionCampaignToast.invalidEndDate);
      }
    }
    if (
      temp.type === FlatDiscount &&
      temp.discountValue.trim().length &&
      temp.minPurchaseAmount.trim().length
    ) {
      if (parseInt(temp.minPurchaseAmount) < parseInt(temp.discountValue)) {
        return error(promotionCampaignToast.invalidDiscountValue);
      }
    }
    tempValidation = {
      title: Validations.isStringEmpty(temp.title),
      startDate: !temp.startDate,
      endDate: !temp.endDate,
      image: Validations.isStringEmpty(temp.image),
      redemptionLimit: Validations.isStringEmptyOrZero(temp.redemptionLimit),
      description: Validations.isStringEmpty(temp.description),
      couponCode: Validations.isStringEmpty(temp.couponCode),
      discountValue:
        Validations.isStringEmptyOrZero(temp.discountValue) ||
        (temp.type === PercentageDiscount &&
          parseInt(temp.discountValue) > 100),
      minPurchaseAmount: Validations.isStringEmptyOrZero(temp.minPurchaseAmount),
      // products: selectedProducts.length === 0,
    };
    const isValid = await Validations.validateObject(tempValidation);
    if (isValid) {
      setLoading(true);
      const apiCallService = new APICallService(
        promotionCampaign.editCoupon,
        promotionCampaignApiJson.addCoupon(temp, []),
        { id },
        '',
        false,
        '',
        Promotion
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(promotionCampaignToast.couponUpdated);
        navigate('/promotion-campaign');
      }
      setLoading(false);
    } else {
    }
    setValidations(tempValidation);
  };
 const handleChange = async (value: string, name: keyof ICouponData) => {
   const temp = { ...couponData };
   const tempValidation: any = { ...validations };
   const updateValidation = (isValid: boolean) => {
     if (isValid) {
       temp[name] = value;
       tempValidation[name] = !isValid;
     }
   };
   switch (name) {
     case 'discountValue':
       if (temp.type === FlatDiscount) {
         updateValidation(Validations.allowOnlyNumbersWithEmptyString(value));
       } else {
         updateValidation(Validations.allowNumberAndFloat(value));
         if (
           temp.type === PercentageDiscount &&
           value.length &&
           parseInt(value) > 100
         ) {
           tempValidation['discountValue'] = true;
         }
       }
       break;
     case 'redemptionLimit':
     case 'minPurchaseAmount':
       updateValidation(Validations.allowOnlyNumbersWithEmptyString(value));
       break;

     case 'couponCode':
       temp[name] = value;
       if (value.trim().length >= 8) {
         tempValidation[name] = false;
       } else {
         tempValidation[name] = true;
       }
       break;
     default:
       temp[name] = value;
       tempValidation[name] = value.trim().length === 0;
       break;
   }

   if (name === 'couponApplyTo') {
     setSelectedProducts([]);
   }

   setValidations(tempValidation);
   setCouponData(temp);
 };
  const handleProductRemove = (event: any) => {
    let temp = [...selectedProducts];
    temp = temp
      .filter((item: any) => item.value !== event.value)
      .filter((item) => item.value !== '0');
    setSelectedProducts(temp);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  };
    const handleOnKeyPressWithFloat = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleDateChange = (date: any, name: 'startDate' | 'endDate') => {
    const temp = { ...couponData };
    const tempValidation: any = { ...validations };
    if (date) {
      name === 'startDate' ? (temp.startDate = date) : (temp.endDate = date);
      tempValidation[name] = false;
    } else {
      tempValidation[name] = true;
    }
    setValidations(tempValidation);
    setCouponData(temp);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = { ...couponData };
    const tempValidation = { ...validations };
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    if (fileValidation(selectedFiles?.[0])) {
      temp.image = URL.createObjectURL(selectedFiles[0]);
      temp.imageReader = selectedFiles[0];
      tempValidation.image = false;
    }
    setValidations(tempValidation);
    setCouponData(temp);
  };
  const generatedCouponCode = () => {
    const temp = { ...couponData };
    const tempValidation = { ...validations };
    temp.couponCode = Method.generateCode(10);
    tempValidation.couponCode = false;
    setValidations(tempValidation);
    setCouponData(temp);
  };
  return (
    <div>
      <Row className="mb-5">
        <Col sm>
          <h1 className="fs-22 fw-bolder">
            {PromotionAndCampaignString.editCouponPromotion}
          </h1>
        </Col>
      </Row>
      <Row>
        {!fetchLoader ? (
          <>
            <Col lg={12}>
              <Card className="bg-light">
                <Card.Body>
                  <Row className="justify-content-between">
                    <Col md={6}>
                      <Row className="gy-7">
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.couponType}
                              </label>
                            </Col>
                            <Col
                              xs={8}
                              className="mt-4"
                            >
                              <div className="d-flex flex-wrap gap-2 mt-2 align-items-center">
                                <div className="form-check  d-flex align-items-center ">
                                  <input
                                    className="form-check-input me-2"
                                    type="radio"
                                    id="flexRadioDefault1"
                                    disabled={true}
                                    value={FlatDiscount}
                                    checked={couponData.type === FlatDiscount}
                                    onChange={(event) =>
                                      handleChange(event.target.value, 'type')
                                    }
                                  />
                                  <label
                                    className="form-check-label text-black fs-16 fw-600"
                                    htmlFor="flexRadioDefault1"
                                  >
                                    Flat Discount
                                  </label>
                                </div>
                                <div className="form-check  d-flex align-items-center">
                                  <input
                                    className="form-check-input me-2"
                                    type="radio"
                                    id="flexRadioDefault2"
                                    value={PercentageDiscount}
                                    disabled={true}
                                    checked={
                                      couponData.type === PercentageDiscount
                                    }
                                    onChange={(event) =>
                                      handleChange(event.target.value, 'type')
                                    }
                                  />
                                  <label
                                    className="form-check-label text-black fs-16 fw-600 "
                                    htmlFor="flexRadioDefault2"
                                  >
                                    Percentage Discount
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.couponTitle}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <input
                                type="text"
                                className={clsx(
                                  'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-500  ms-1',
                                  validations.title
                                    ? 'border-danger'
                                    : 'border-gray-300'
                                )}
                                name="title"
                                value={couponData.title}
                                placeholder="Enter title here…"
                                onChange={(event: any) => {
                                  handleChange(
                                    event.target.value.trimStart(),
                                    'title'
                                  );
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.startDate}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <CustomDatePicker
                                className={clsx(
                                  'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded me-4'
                                )}
                                selected={couponData.startDate}
                                value={couponData.startDate}
                                onChange={(date: Date) =>
                                  handleDateChange(date, 'startDate')
                                }
                                dateFormat="dd/MM/yyyy"
                                showFullMonthYearPicker
                                minDate={new Date()}
                                inputTextBG="bg-white"
                                showYearDropdown={true}
                                scrollableYearDropdown={true}
                                dropdownMode="select"
                                placeholder="DD/MM/YYYY"
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
                                    inputClass={`${
                                      validations.startDate
                                        ? 'border-danger'
                                        : ''
                                    }`}
                                  />
                                }
                                //    isClearable={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.endDate}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <CustomDatePicker
                                className={clsx(
                                  'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded'
                                )}
                                selected={couponData.endDate}
                                value={couponData.endDate}
                                onChange={(date: Date) =>
                                  handleDateChange(date, 'endDate')
                                }
                                dateFormat="dd/MM/yyyy"
                                showFullMonthYearPicker
                                minDate={new Date()}
                                inputTextBG="bg-white"
                                showYearDropdown={true}
                                scrollableYearDropdown={true}
                                dropdownMode="select"
                                placeholder="DD/MM/YYYY"
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
                                    inputClass={`${
                                      validations.endDate ? 'border-danger' : ''
                                    }`}
                                  />
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                htmlFor=""
                                className="fs-16 fw-500 mb-lg-0 mb-3 required"
                              >
                                {PromotionAndCampaignString.couponCode}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <InputGroup
                                className={clsx(
                                  'min-h-40px  border border-r5px border  ms-1',
                                  validations.couponCode
                                    ? 'border-danger'
                                    : 'border-gray-300'
                                )}
                              >
                                <Form.Control
                                  className={clsx(
                                    'border fs-16 fw-500 text-dark h-60px border-right-0'
                                  )}
                                  aria-label="Default"
                                  aria-describedby=""
                                  value={couponData.couponCode}
                                  placeholder="Enter coupon code"
                                  onChange={(event: any) => {
                                    handleChange(
                                      event.target.value.trimStart(),
                                      'couponCode'
                                    );
                                  }}
                                  onKeyPress={(event: any) => {
                                    //   handleOnKeyPress(event);
                                  }}
                                />
                                <InputGroup.Text
                                  className="bg-white border-0 text-italic text-primary fs-16 cursor-pointer"
                                  id=""
                                  onClick={generatedCouponCode}
                                >
                                  Generate
                                </InputGroup.Text>
                              </InputGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                htmlFor=""
                                className="fs-16 fw-500 mb-lg-0 mb-3 required"
                              >
                                {PromotionAndCampaignString.redemptionLimit}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <InputGroup
                                className={clsx(
                                  'min-h-40px  border border-r5px border ms-1',
                                  validations.redemptionLimit
                                    ? 'border-danger'
                                    : 'border-gray-300 '
                                )}
                              >
                                <Form.Control
                                  className={clsx(
                                    'border fs-16 fw-500 text-dark h-60px border-right-0'
                                  )}
                                  aria-label="Default"
                                  aria-describedby=""
                                  value={couponData.redemptionLimit}
                                  placeholder="Enter redemption limit"
                                  onChange={(event: any) => {
                                    handleChange(
                                      event.target.value.trimStart(),
                                      'redemptionLimit'
                                    );
                                  }}
                                  onKeyPress={(event: any) => {
                                    handleOnKeyPress(event);
                                  }}
                                />
                                <InputGroup.Text
                                  className="bg-white border-0 text-italic"
                                  id=""
                                >
                                  Per User
                                </InputGroup.Text>
                              </InputGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={4}
                      className="mt-6 mt-lg-0"
                    >
                      <Card className=" border border-r10px">
                        <Card.Header className="border-bottom-0">
                          <Card.Title>
                            <h5 className="fs-22 fw-bolder">
                              {PromotionAndCampaignString.promotionImage}
                            </h5>
                          </Card.Title>
                        </Card.Header>
                        <Card.Body className="pt-0 text-lg-center">
                          {couponData?.image ? (
                            <div className="image-input image-input-outline min-w-xl-260px min-h-xl-150px border border-r10px bg-white">
                              <div
                                className="image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center"
                                style={{
                                  // backgroundImage: `url(${couponData?.image})`,
                                  backgroundRepeat: `no-repeat`,
                                }}
                              >
                                {couponData?.image && (
                                  <img
                                    width={262}
                                    height={149}
                                    src={couponData?.image}
                                    className="img-fluid mh-150px border-r10px object-fit-contain"
                                    alt=""
                                  />
                                )}
                              </div>
                              {!loading ? (
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
                                    onChange={handleImageChange}
                                  />
                                  {/* <input
                      type="hidden"
                      name="avatar_remove"
                    /> */}
                                </label>
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : (
                            <div
                              className={clsx(
                                'upload-btn-wrapper border-r10px min-w-xl-260px min-h-xl-150px border border-1 ',
                                validations.image
                                  ? 'border border-danger'
                                  : 'border-gray-300'
                              )}
                            >
                              <div className="">
                                <img
                                  src={UploadSVG}
                                  className="img-fluid object-fit-cover w-275px  h-160px"
                                  alt=""
                                />
                              </div>
                              <input
                                className="w-100 h-100"
                                type="file"
                                name="myfile"
                                onChange={handleImageChange}
                              />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                      <div className="d-flex my-5">
                        <span className="text-dark text-italic fw-600">
                          {PromotionAndCampaignString.promotionImageNote}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Col className="mt-6">
                    <Row>
                      <Col md={6}>
                        <Row className="align-items-center">
                          <Col lg={4}>
                            <label
                              htmlFor=""
                              className="fs-16 fw-500 mb-lg-0 mb-3 required"
                            >
                              {PromotionAndCampaignString.discountValue}
                            </label>
                          </Col>
                          <Col lg={8}>
                            <InputGroup
                              className={clsx(
                                'min-h-40px  border border-r5px border  ms-1',
                                validations.discountValue
                                  ? 'border-danger'
                                  : 'border-gray-300'
                              )}
                            >
                              <Form.Control
                                className={clsx(
                                  'border fs-16 fw-500 text-dark h-60px border-right-0'
                                )}
                                aria-label="Default"
                                aria-describedby=""
                                value={couponData.discountValue}
                                placeholder="Enter discount value"
                                onChange={(event: any) => {
                                  handleChange(
                                    event.target.value.trimStart(),
                                    'discountValue'
                                  );
                                }}
                                onKeyPress={(event: any) => {
                                  if (couponData.type === FlatDiscount) {
                                    handleOnKeyPress(event);
                                  } else {
                                    handleOnKeyPressWithFloat(event);
                                  }
                                }}
                              />
                              <InputGroup.Text
                                className="bg-white border-0 text-italic"
                                id=""
                              >
                                {couponData.type === FlatDiscount ? 'TSh' : '%'}
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6}>
                        <Row className="align-items-center">
                          <Col lg={4}>
                            <label
                              htmlFor=""
                              className="fs-16 fw-500 mb-lg-0 mb-3 required"
                            >
                              {PromotionAndCampaignString.minPurchaseAmount}
                            </label>
                          </Col>
                          <Col lg={8}>
                            <InputGroup
                              className={clsx(
                                'min-h-40px  border border-r5px border ms-1 ',
                                validations.minPurchaseAmount
                                  ? 'border-danger'
                                  : ' border-gray-300'
                              )}
                            >
                              <Form.Control
                                className={clsx(
                                  'border fs-16 fw-500 text-dark h-60px border-right-0'
                                )}
                                aria-label="Default"
                                aria-describedby=""
                                value={couponData.minPurchaseAmount}
                                placeholder="Enter amount"
                                onChange={(event: any) => {
                                  handleChange(
                                    event.target.value.trimStart(),
                                    'minPurchaseAmount'
                                  );
                                }}
                                onKeyPress={(event: any) => {
                                  handleOnKeyPress(event);
                                }}
                              />
                              <InputGroup.Text
                                className="bg-white border-0 text-italic"
                                id=""
                              >
                                TSh
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={12}
                    className="mt-6"
                  >
                    <Row className="justify-content-between">
                      <Col
                        lg={2}
                        className="align-self-lg-start mt-lg-2"
                      >
                        <label
                          htmlFor=""
                          className="fs-16 fw-500 mb-lg-0 mb-3 required"
                        >
                          {PromotionAndCampaignString.description}
                        </label>
                      </Col>
                      <Col lg={10}>
                        <Form.Control
                          className={clsx(
                            'form-control-custom border bg-white  ',
                            validations.description
                              ? 'border-danger'
                              : 'border-gray-300'
                          )}
                          placeholder="Enter description here…"
                          as="textarea"
                          rows={5}
                          value={couponData.description}
                          onChange={(event: any) => {
                            handleChange(
                              event.target.value.trimStart(),
                              'description'
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={12}
                    className="mt-3"
                  >
                    <Row className="justify-content-between align-items-center">
                      <Col md={2}>
                        <label
                          className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                          htmlFor="flexRadioDefault1"
                        >
                          Discount banner placement
                        </label>
                      </Col>
                      <Col
                        md={10}
                        className="mt-4"
                      >
                        <div className="d-flex flex-wrap mb-6 gap-2 mt-2 align-items-center">
                          <div className="form-check me-4 d-flex align-items-center ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioHome"
                              value={HomePagePlacement.toString()}
                              checked={
                                couponData.placement ===
                                HomePagePlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioHome"
                            >
                              Home page
                            </label>
                          </div>
                          <div className="form-check me-4 d-flex align-items-center">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioCategory"
                              value={CategoryPagePlacement.toString()}
                              checked={
                                couponData.placement ===
                                CategoryPagePlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioCategory"
                            >
                              Category page
                            </label>
                          </div>
                          <div className="form-check me-4 d-flex align-items-center ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioProduct"
                              value={ProductPlacement.toString()}
                              checked={
                                couponData.placement ===
                                ProductPlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioProduct"
                            >
                              Product page
                            </label>
                          </div>
                          <div className="form-check me-4 d-flex align-items-center ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioBrand"
                              value={BrandPlacement.toString()}
                              checked={
                                couponData.placement ===
                                BrandPlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioBrand"
                            >
                              Brand page
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* <Col
                    xs={12}
                    className=""
                  >
                    <Row className="justify-content-between align-items-start">
                      <Col
                        md={2}
                        className="mt-4"
                      >
                        <label
                          className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                          htmlFor="flexRadioDefaultApplyTo"
                        >
                          Select Products
                        </label>
                      </Col>
                      <Col
                        md={10}
                        className="mt-4"
                      >

                        <Col
                          lg={12}
                          className="ms-1"
                        >
                          <CustomReportSelect
                            backgroundColor="#ffff"
                            value={selectedProducts}
                            options={productList}
                            onChange={(event: IOptionWithImage[]) => {
                              handleProductChange(event);
                            }}
                            closeMenuOnSelect={false}
                            border={
                              validations.products ? '#e55451' : '#e0e0df'
                            }
                            isMulti={true}
                            isSearchable={true}
                            hideSelectedOptions={false}
                            text={'products selected'}
                          />
                        </Col>
                        <Col
                          xs={12}
                          className="mt-2 mh-350px overflow-y-scroll"
                        >
                          {selectedProducts.length ? (
                            <>
                              <Card.Body className="pt-0 ps-1">
                                <Row>
                                  <Col
                                    lg={12}
                                    className="mt-5"
                                  >
                                    {selectedProducts.map(
                                      (productVal, index: number) => {
                                        if (productVal.value === '0')
                                          return <></>;
                                        return (
                                          <>
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                              <div className="d-flex">
                                                <div className="symbol symbol-40px border bg-white me-2">
                                                  <img
                                                    width={40}
                                                    height={40}
                                                    src={productVal.image}
                                                    className="object-fit-contain"
                                                    alt=""
                                                  />
                                                </div>
                                                <div className="fs-14 fw-500 align-self-center ms-1 text-dark">
                                                  {productVal.title}
                                                </div>
                                              </div>
                                              {!loading ? (
                                                <Button
                                                  variant=""
                                                  className="btn btn-flush btn-icon"
                                                >
                                                  <img
                                                    height={16}
                                                    width={16}
                                                    src={CrossSvg}
                                                    onClick={() => {
                                                      handleProductRemove(
                                                        productVal
                                                      );
                                                    }}
                                                    alt=""
                                                  />
                                                </Button>
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                            {selectedProducts.length === 1 ? (
                                              <></>
                                            ) : (
                                              <div className="separator my-3"></div>
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Col>
                    </Row>
                  </Col> */}
                  {/* {couponData.couponApplyTo === ApplyToSpecificProducts ? (
                <>
                  <Col xs={12}>
                    <Row>
                      <Col md={2}></Col>
                      <Col md={10}>
                        <Row>
                          <Col xs={12}>
                            <Row className="align-items-center">
                              <Col
                                lg={3}
                                className="mb-2"
                              >
                                <Form.Label className="fs-16 fw-500 text-dark required">
                                  Select products
                                </Form.Label>
                              </Col>
                              <Col
                                lg={12}
                                className="ms-1"
                              >
                                <CustomComponentAfterSelect
                                  value={selectedProducts}
                                  options={product2JSON}
                                  onChange={(event: any) => {
                                    handleProductChange(event);
                                  }}
                                  closeMenuOnSelect={false}
                                  border={
                                    validations.products ? '#e55451' : '#e0e0df'
                                  }
                                  isMulti={true}
                                  isSearchable={true}
                                  hideSelectedOptions={false}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={12}>
                            {selectedProducts.length ? (
                              <>
                                <Card.Body className="pt-0 ps-1">
                                  <Row>
                                    <Col
                                      lg={12}
                                      className="mt-5"
                                    >
                                      {selectedProducts.map(
                                        (productVal: any, index: number) => {
                                          return (
                                            <>
                                              <div className="d-flex justify-content-between align-items-center w-100">
                                                <div className="d-flex">
                                                  <div className="symbol symbol-40px border bg-white me-2">
                                                    <img
                                                      width={40}
                                                      height={40}
                                                      src={productVal.image}
                                                      className="object-fit-contain"
                                                      alt=""
                                                    />
                                                  </div>
                                                  <div className="fs-14 fw-500 align-self-center ms-1 text-dark">
                                                    {productVal.title}
                                                  </div>
                                                </div>
                                                {!loading ? (
                                                  <Button
                                                    variant=""
                                                    className="btn btn-flush btn-icon"
                                                  >
                                                    <img
                                                      height={16}
                                                      width={16}
                                                      src={CrossSvg}
                                                      onClick={() => {
                                                        handleProductRemove(
                                                          productVal
                                                        );
                                                      }}
                                                      alt=""
                                                    />
                                                  </Button>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                              {selectedProducts.length === 1 ? (
                                                <></>
                                              ) : (
                                                <div className="separator my-3"></div>
                                              )}
                                            </>
                                          );
                                        }
                                      )}
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </>
              ) : (
                <></>
              )} */}
                </Card.Body>
              </Card>
            </Col>
            <Col className="text-end mt-5">
              <Button
                type="button"
                className={clsx(
                  loading ? 'btn btn-lg btnNext' : 'btn btn-lg h-60px px-10'
                )}
                disabled={loading}
                onClick={() => handleSubmit()}
              >
                {!loading && <span className="indicator-label">Save</span>}
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
            </Col>
          </>
        ) : (
          <Col>
            <div className="d-flex justify-content-center align-items-center">
              <Loader loading={fetchLoader} />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default EditCouponPromotion;
