import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { PromotionAndCampaignString } from '../../../../../utils/string';
import { useEffect, useState } from 'react';
import { CustomSelectWhite } from '../../../../custom/Select/CustomSelectWhite';
import { discountTypeJson } from '../../../../../utils/staticJSON';
import clsx from 'clsx';
import Method from '../../../../../utils/methods';
import CustomDatePicker from '../../../../custom/DateRange/DatePicker';
import CustomDateInput from '../../../../custom/Select/CustomDateInput';
import EditSVG from '../../../../../umart_admin/assets/media/svg_uMart/edit-round.svg';
import UploadSVG from '../../../../../umart_admin/assets/media/svg_uMart/upload-gray.svg';
import { IDiscountData } from '../../../../../types';
import {
  Add,
  ApplyToBrand,
  ApplyToCart,
  ApplyToCategory,
  ApplyToProduct,
  BrandPlacement,
  CategoryPagePlacement,
  FlatDiscount,
  HomePagePlacement,
  PercentageDiscount,
  ProductPlacement,
  Promotion,
} from '../../../../../utils/constants';
import { CustomComponentAfterSelect } from '../../../../custom/Select/CustomComponentAfterSelect';
import CrossSvg from '../../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import Validations from '../../../../../utils/validations';
import { fileValidation } from '../../../../../Global/fileValidation';
import APICallService from '../../../../../api/apiCallService';
import { master, promotionCampaign } from '../../../../../api/apiEndPoints';
import { IOption, IOptionWithImage } from '../../../../../types/responseIndex';
import { promotionCampaignApiJson } from '../../../../../api/apiJSON/promotionCampaign';
import { error, success } from '../../../../../Global/toast';
import { promotionCampaignToast } from '../../../../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth';
const AddDiscountPromotion = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [discountData, setDiscountData] = useState<IDiscountData>({
    discountType: '',
    title: '',
    startDate: null,
    endDate: null,
    image: '',
    imageReader: null,
    minPurchaseAmount: '',
    description: '',
    discountValue: '',
    placement: HomePagePlacement.toString(),
    applyDiscountTo: ApplyToCart,
  });
  const [validation, setValidation] = useState<{
    discountType: boolean;
    title: boolean;
    startDate: boolean;
    endDate: boolean;
    image: boolean;
    minPurchaseAmount: boolean;
    description: boolean;
    discountValue: boolean;
    placement: boolean;
    applyDiscountTo: boolean;
    brand: boolean;
    category: boolean;
    products: boolean;
    productCategory: boolean;
  }>({
    discountType: false,
    title: false,
    startDate: false,
    endDate: false,
    image: false,
    minPurchaseAmount: false,
    description: false,
    discountValue: false,
    placement: false,
    applyDiscountTo: false,
    brand: false,
    category: false,
    products: false,
    productCategory: false,
  });
  const [brandList, setBrandList] = useState<IOptionWithImage[]>([]);
  const [categoryList, setCategoryList] = useState<IOptionWithImage[]>([]);
  const [categoryListSimple, setCategoryListSimple] = useState<
    IOptionWithImage[]
  >([]);
  const [productsList, setProductsList] = useState<IOptionWithImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<IOptionWithImage[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    IOptionWithImage[]
  >([]);
  const [selectedCategorySimple, setSelectedCategorySimple] = useState<
    IOption[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<IOptionWithImage[]>(
    []
  );
  const [productInput, setProductInput] = useState("");
  useEffect(() => {
    (() => {
      if (!Method.hasPermission(Promotion, Add, currentUser)) {
        return window.history.back();
      }
    })();
  }, []);
  const fetchBrands = async () => {
    setFetchLoader(true);
    const apiCallService = new APICallService(
      master.listBrands,
      {},
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
              src={item?.image || ''}
              height={15}
              className=" me-2"
              alt=""
            />
            <span className="fs-14 fw-500 text-black ">{item?.title}</span>
          </>
        ),
        name: item?.title || '',
        title: item?.title || '',
        value: item?._id || '',
        id: item?._id || '',
        image: item?.image || '',
      }));
      setBrandList(temp);
    }
    setFetchLoader(false);
  };
  const fetchCategories = async () => {
    setFetchLoader(true);
    const apiCallService = new APICallService(
      master.categoryList,
      {
        categoriesDepth: 1,
      },
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
              src={item?.image || ''}
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
        image: item?.image || '',
      }));
      // const tempSimple: IOption[] = response.records.map((item: any) => ({
      //   title: item?.title || '',
      //   value: item?._id || '',
      //   label: item?.title || '',
      // }));
      setCategoryList(temp);
      setCategoryListSimple(temp);
    }
    setFetchLoader(false);
  };
  const fetchProductsByCategory = async (categories: IOptionWithImage[]) => {
    setFetchLoader(true);
    let params: any = {};
    categories.map((item, index) => {
      params[`categories[${index}]`] = item.value;
    });
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
      let tempSelected = [...selectedProducts];
      if (tempSelected.length) {
        const allProductMap: any = {};
        temp.forEach((item) => {
          allProductMap[`${item.value}`] = true;
        });
        tempSelected = tempSelected.filter(
          (item) => !!allProductMap[item.value]
        );
        setSelectedProducts(tempSelected);
      }
      setProductsList(temp);
    }
    setFetchLoader(false);
  };
  const fetchAllLists = async () => {
    setFetchLoader(true);
    await fetchBrands();
    await fetchCategories();
    setFetchLoader(false);
  };
  const handleSubmit = async () => {
    let tempValidation = { ...validation };
    const temp = { ...discountData };
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
      temp.discountType === FlatDiscount &&
      temp.discountValue.trim().length &&
      temp.minPurchaseAmount.trim().length
    ) {
      if (parseInt(temp.minPurchaseAmount) < parseInt(temp.discountValue)) {
        return error(promotionCampaignToast.invalidDiscountValue);
      }
    }
    tempValidation = {
      applyDiscountTo: temp.applyDiscountTo.trim().length === 0,
      title: temp.title.trim().length === 0,
      description: temp.description.trim().length === 0,
      discountType: temp.discountType.trim().length === 0,
      startDate: !temp.startDate,
      endDate: !temp.endDate,
      image: temp.image.trim().length === 0,
      minPurchaseAmount:
        (temp.discountType === FlatDiscount ||
          (temp.discountType === PercentageDiscount &&
            discountData.applyDiscountTo === ApplyToCart)) &&
        Validations.isStringEmptyOrZero(temp.minPurchaseAmount),
      discountValue:
        Validations.isStringEmptyOrZero(temp.discountValue) ||
        (temp.discountType === PercentageDiscount &&
          parseInt(temp.discountValue) > 100),
      placement: temp.placement.trim().length === 0,
      brand:
        temp.discountType === PercentageDiscount &&
        temp.applyDiscountTo === ApplyToBrand &&
        selectedBrands.length === 0,
      category:
        temp.discountType === PercentageDiscount &&
        temp.applyDiscountTo === ApplyToCategory &&
        selectedCategories.length === 0,
      products:
        temp.discountType === PercentageDiscount &&
        temp.applyDiscountTo === ApplyToProduct &&
        selectedProducts.length === 0,
      productCategory:
        temp.discountType === PercentageDiscount &&
        temp.applyDiscountTo === ApplyToProduct &&
        selectedCategorySimple.length === 0,
    };
    const isValid = await Validations.validateObject(tempValidation);
    if (isValid) {
      setLoading(true);
      const apiCallService = new APICallService(
        promotionCampaign.addDiscountPromotion,
        promotionCampaignApiJson.addDiscountPromotion(
          discountData,
          selectedBrands,
          selectedCategories,
          selectedProducts,
          selectedCategorySimple
        ),
        '',
        '',
        false,
        '',
        Promotion
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(promotionCampaignToast.discountPromotionAdded);
        navigate('/promotion-campaign');
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  const handleChange = (value: string, name: keyof IDiscountData) => {
    const temp = { ...discountData };
    const tempValidation: any = { ...validation };
    if (name === 'discountValue' || name === 'minPurchaseAmount') {
      if (
        name === 'discountValue' &&
        discountData.discountType === PercentageDiscount &&
        Validations.allowNumberAndFloat(value)
      ) {
        temp[name] = value;
        if (value.trim().length === 0) {
          tempValidation[name] = true;
        } else {
          tempValidation[name] = false;
        }
      } else if (Validations.allowOnlyNumbersWithEmptyString(value)) {
        temp[name] = value;
        if (value.trim().length === 0) {
          tempValidation[name] = true;
        } else {
          tempValidation[name] = false;
        }
      }
    } else {
      temp[name] = value;
      if (value.trim().length === 0) {
        tempValidation[name] = true;
      } else {
        tempValidation[name] = false;
      }
    }
    if (name === 'applyDiscountTo' || name === 'discountType') {
      setSelectedBrands([]);
      setSelectedCategories([]);
      setSelectedProducts([]);
      setSelectedCategorySimple([]);
    }
    if (name === 'discountType' && value === PercentageDiscount) {
      fetchAllLists();
    }
    if (
      name === 'discountValue' &&
      temp.discountType === PercentageDiscount &&
      value.length &&
      parseInt(value) > 100
    ) {
      tempValidation['discountValue'] = true;
    }
    setValidation(tempValidation);
    setDiscountData(temp);
  };
  const handleBrandChange = (event: IOptionWithImage[]) => {
    let temp = [...selectedBrands];
    let tempValidation = { ...validation };
    if (event) {
      temp = [...event];
      tempValidation.brand = false;
    }
    if (event.length === 0) {
      tempValidation.brand = true;
    }
    setValidation(tempValidation);
    setSelectedBrands(temp);
  };
  const handleProductChange = (event: IOptionWithImage[]) => {
    let temp = [...selectedProducts];
    let tempValidation = { ...validation };
    if (event) {
      temp = [...event];
      tempValidation.products = false;
    }
    if (event.length === 0) {
      tempValidation.products = true;
    }
    setValidation(tempValidation);
    setSelectedProducts(temp);
  };
  const handleCategoriesChange = (event: IOptionWithImage[]) => {
    let temp = [...selectedCategories];
    let tempValidation = { ...validation };
    if (event) {
      temp = [...event];
      tempValidation.category = false;
    }
    if (event.length === 0) {
      tempValidation.category = true;
    }
    setValidation(tempValidation);
    setSelectedCategories(temp);
  };
  const handleSimpleCategoryChange = async (event: IOptionWithImage[]) => {
    let temp = [...selectedCategorySimple];
    let tempValidation = { ...validation };
    if (event) {
      temp = [...event];
      tempValidation.productCategory = false;
    }
    if (event.length === 0) {
      tempValidation.productCategory = true;
      setSelectedProducts([]);
      setProductsList([]);
    }
    setSelectedCategorySimple(temp);
    setValidation(tempValidation);
    if (event.length) {
      await fetchProductsByCategory(event);
    }
  };
  const handleBrandRemove = (event: IOptionWithImage) => {
    let temp = [...selectedBrands];
    temp = temp.filter((item: any) => item.value !== event.value);
    setSelectedBrands(temp);
  };
  const handleCategoryRemove = (event: IOptionWithImage) => {
    let temp = [...selectedCategories];
    temp = temp.filter((item: any) => item.value !== event.value);
    setSelectedCategories(temp);
  };
  const handleProductRemove = (event: IOptionWithImage) => {
    let temp = [...selectedProducts];
    temp = temp.filter((item: any) => item.value !== event.value);
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
    const temp = { ...discountData };
    const tempValidation: any = { ...validation };
    if (date) {
      name === 'startDate' ? (temp.startDate = date) : (temp.endDate = date);
      tempValidation[name] = false;
    } else {
      tempValidation[name] = true;
    }
    setValidation(tempValidation);
    setDiscountData(temp);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = { ...discountData };
    const tempValidation = { ...validation };
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    if (fileValidation(selectedFiles?.[0])) {
      temp.image = URL.createObjectURL(selectedFiles[0]);
      temp.imageReader = selectedFiles[0];
      tempValidation.image = false;
    }
    setValidation(tempValidation);
    setDiscountData(temp);
  };
  const handleProductInputChange = (newValue: string, actionMeta: any) => {
    console.log('vvvvvvvvvv',actionMeta);
    if (
      actionMeta.action !== 'set-value' &&
      actionMeta.action !== 'input-blur'
    ) {
      setProductInput(newValue);
    }
    return newValue;
  };
  return (
    <div>
      <Row className="mb-5">
        <Col sm>
          <h1 className="fs-22 fw-bolder">
            {PromotionAndCampaignString.addDiscountPromotions}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card className="bg-light">
            <Card.Body>
              <Row className="justify-content-between">
                <Col md={8}>
                  <Row className="gy-5">
                    <Col xs={12}>
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <label
                            className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                            htmlFor="flexRadioDefault1"
                          >
                            {PromotionAndCampaignString.discountType}
                          </label>
                        </Col>
                        <Col
                          xs={8}
                          className="ps-4"
                        >
                          <CustomSelectWhite
                            border={validation.discountType ? '#e55451' : ''}
                            placeholder="Select discount type"
                            options={discountTypeJson}
                            loadingMessage={'Fetching Data'}
                            isMulti={false}
                            onChange={(event: any) => {
                              handleChange(event.value, 'discountType');
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    {discountData.discountType === PercentageDiscount ? (
                      <>
                        {discountData.discountType === PercentageDiscount ? (
                          <Col xs={12}>
                            <Row className=" d-flex align-items-center">
                              <Col md={4}>
                                <label
                                  className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                  htmlFor="flexRadioDefault1"
                                >
                                  Apply % discount to
                                </label>
                              </Col>
                              <Col
                                md={8}
                                className="mt-4"
                              >
                                <div
                                  className="d-flex flex-wrap mb-6  mt-2 align-items-center
                                 justify-content-lg-between"
                                >
                                  <div className="form-check  d-flex align-items-center me-3 ">
                                    <input
                                      className="form-check-input me-2"
                                      type="radio"
                                      id="flexRadioDefault1"
                                      value={ApplyToBrand}
                                      checked={
                                        discountData.applyDiscountTo ===
                                        ApplyToBrand
                                      }
                                      onChange={(event) =>
                                        handleChange(
                                          event.target.value,
                                          'applyDiscountTo'
                                        )
                                      }
                                    />
                                    <label
                                      className="form-check-label text-black fs-16 fw-600"
                                      htmlFor="flexRadioDefault1"
                                    >
                                      Brand
                                    </label>
                                  </div>
                                  <div className="form-check  d-flex align-items-center me-3">
                                    <input
                                      className="form-check-input me-2"
                                      type="radio"
                                      id="flexRadioDefault2"
                                      value={ApplyToCategory}
                                      checked={
                                        discountData.applyDiscountTo ===
                                        ApplyToCategory
                                      }
                                      onChange={(event) =>
                                        handleChange(
                                          event.target.value,
                                          'applyDiscountTo'
                                        )
                                      }
                                    />
                                    <label
                                      className="form-check-label text-black fs-16 fw-600 "
                                      htmlFor="flexRadioDefault2"
                                    >
                                      Category
                                    </label>
                                  </div>
                                  <div className="form-check  d-flex align-items-center me-3">
                                    <input
                                      className="form-check-input me-2"
                                      type="radio"
                                      id="flexRadioDefault3"
                                      value={ApplyToProduct}
                                      checked={
                                        discountData.applyDiscountTo ===
                                        ApplyToProduct
                                      }
                                      onChange={(event) =>
                                        handleChange(
                                          event.target.value,
                                          'applyDiscountTo'
                                        )
                                      }
                                    />
                                    <label
                                      className="form-check-label text-black fs-16 fw-600"
                                      htmlFor="flexRadioDefault3"
                                    >
                                      Product
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                      className="form-check-input me-2"
                                      type="radio"
                                      id="flexRadioDefault4"
                                      value={ApplyToCart}
                                      checked={
                                        discountData.applyDiscountTo ===
                                        ApplyToCart
                                      }
                                      onChange={(event) =>
                                        handleChange(
                                          event.target.value,
                                          'applyDiscountTo'
                                        )
                                      }
                                    />
                                    <label
                                      className="form-check-label text-black fs-16 fw-600"
                                      htmlFor="flexRadioDefault4"
                                    >
                                      Cart Value
                                    </label>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        ) : (
                          <></>
                        )}
                        {discountData.applyDiscountTo === ApplyToBrand ? (
                          <>
                            <Col xs={12}>
                              <Row className="align-items-start">
                                <Col
                                  lg={4}
                                  className="mb-2"
                                >
                                  <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                                    Select brand
                                  </Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <div className="ms-1">
                                    <CustomComponentAfterSelect
                                      value={selectedBrands}
                                      options={brandList}
                                      loading={fetchLoader}
                                      onChange={(event: any) => {
                                        handleBrandChange(event);
                                      }}
                                      closeMenuOnSelect={false}
                                      border={
                                        validation.brand ? '#e55451' : '#e0e0df'
                                      }
                                      isMulti={true}
                                      isSearchable={true}
                                      hideSelectedOptions={false}
                                    />
                                    <div>
                                      {selectedBrands.length ? (
                                        <>
                                          <Card.Body className="pt-0 ps-1 pe-0">
                                            <Row>
                                              <Col
                                                lg={12}
                                                className="mt-5"
                                              >
                                                {selectedBrands.map(
                                                  (
                                                    productVal,
                                                    index: number
                                                  ) => {
                                                    return (
                                                      <>
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                          <div className="d-flex">
                                                            <div className="symbol symbol-40px border bg-white me-2">
                                                              <img
                                                                width={40}
                                                                height={40}
                                                                src={
                                                                  productVal.image
                                                                }
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
                                                                  handleBrandRemove(
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
                                                        {selectedBrands.length ===
                                                        1 ? (
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
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        ) : (
                          <></>
                        )}
                        {discountData.applyDiscountTo === ApplyToCategory ? (
                          <>
                            <Col xs={12}>
                              <Row>
                                <Col
                                  lg={4}
                                  className="mb-2"
                                >
                                  <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                                    Select category
                                  </Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <div className="ms-1">
                                    <CustomComponentAfterSelect
                                      value={selectedCategories}
                                      options={categoryList}
                                      onChange={(event: any) => {
                                        handleCategoriesChange(event);
                                      }}
                                      loading={fetchLoader}
                                      closeMenuOnSelect={false}
                                      border={
                                        validation.category
                                          ? '#e55451'
                                          : '#e0e0df'
                                      }
                                      isMulti={true}
                                      isSearchable={true}
                                      hideSelectedOptions={false}
                                    />
                                  </div>
                                  <div>
                                    {selectedCategories.length ? (
                                      <>
                                        <Card.Body className="pt-0 ps-1 pe-0">
                                          <Row>
                                            <Col
                                              lg={12}
                                              className="mt-5"
                                            >
                                              {selectedCategories.map(
                                                (productVal, index: number) => {
                                                  return (
                                                    <>
                                                      <div className="d-flex justify-content-between align-items-center w-100">
                                                        <div className="d-flex">
                                                          <div className="symbol symbol-40px border bg-white me-2">
                                                            <img
                                                              width={40}
                                                              height={40}
                                                              src={
                                                                productVal.image
                                                              }
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
                                                                handleCategoryRemove(
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
                                                      {selectedCategories.length ===
                                                      1 ? (
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
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        ) : (
                          <></>
                        )}
                        {discountData.applyDiscountTo === ApplyToProduct ? (
                          <Col xs={12}>
                            <Row className="align-items-center">
                              <Col
                                lg={4}
                                className="mb-2"
                              >
                                <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                                  Select category
                                </Form.Label>
                              </Col>
                              <Col lg={8}>
                                <div className="ms-1">
                                  <CustomComponentAfterSelect
                                    value={selectedCategorySimple}
                                    options={categoryListSimple}
                                    onChange={(event: IOptionWithImage[]) => {
                                      handleSimpleCategoryChange(event);
                                    }}
                                    loading={fetchLoader}
                                    closeMenuOnSelect={false}
                                    border={
                                      validation.productCategory
                                        ? '#e55451'
                                        : '#e0e0df'
                                    }
                                    isMulti={true}
                                    isSearchable={true}
                                    hideSelectedOptions={false}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-6">
                              <Col
                                lg={4}
                                className="mb-2"
                              >
                                <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                                  Select products
                                </Form.Label>
                              </Col>
                              <Col lg={8}>
                                <div className="ms-1">
                                  <CustomComponentAfterSelect
                                    value={selectedProducts}
                                    options={productsList}
                                    onChange={(event: IOptionWithImage[]) => {
                                      handleProductChange(event);
                                    }}
                                    loading={fetchLoader}
                                    closeMenuOnSelect={false}
                                    border={
                                      validation.products
                                        ? '#e55451'
                                        : '#e0e0df'
                                    }
                                    isMulti={true}
                                    isSearchable={true}
                                    hideSelectedOptions={false}
                                    inputValue={productInput}
                                    onInputChange={handleProductInputChange}
                                  />
                                </div>
                                <div>
                                  {selectedProducts.length ? (
                                    <>
                                      <Card.Body className="pt-0 ps-1 pe-0">
                                        <Row>
                                          <Col
                                            lg={12}
                                            className="mt-5"
                                          >
                                            {selectedProducts.map(
                                              (
                                                productVal: any,
                                                index: number
                                              ) => {
                                                return (
                                                  <>
                                                    <div className="d-flex justify-content-between align-items-center w-100">
                                                      <div className="d-flex">
                                                        <div className="symbol symbol-40px border bg-white me-2">
                                                          <img
                                                            width={40}
                                                            height={40}
                                                            src={
                                                              productVal.image
                                                            }
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
                                                    {selectedProducts.length ===
                                                    1 ? (
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
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    <Col xs={12}>
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <label
                            className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                            htmlFor="flexRadioDefault1"
                          >
                            {PromotionAndCampaignString.discountTitle}
                          </label>
                        </Col>
                        <Col xs={8}>
                          <input
                            type="text"
                            className={clsx(
                              'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-500  ms-1',
                              validation.title
                                ? 'border-danger'
                                : 'border-gray-300'
                            )}
                            name="title"
                            // value={generalData?.productTitle}
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
                            value={discountData.startDate}
                            selected={discountData.startDate}
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
                                  validation.startDate ? 'border-danger' : ''
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
                            selected={discountData.endDate}
                            value={discountData.endDate}
                            onChange={(date: Date) =>
                              handleDateChange(date, 'endDate')
                            }
                            dateFormat="dd/MM/yyyy"
                            showFullMonthYearPicker
                            minDate={
                              discountData?.startDate
                                ? discountData.startDate
                                : new Date()
                            }
                            inputTextBG="bg-white"
                            showYearDropdown={true}
                            scrollableYearDropdown={true}
                            dropdownMode="select"
                            placeholder="DD/MM/YYYY"
                            dayClassName={(date: Date) => {
                              return Method.dayDifference(
                                discountData?.startDate
                                  ? new Date(
                                      discountData.startDate
                                    ).toDateString()
                                  : new Date().toDateString(),
                                date.toDateString()
                              ) < 0
                                ? 'date-disabled'
                                : '';
                            }}
                            customInput={
                              <CustomDateInput
                                inputClass={`${
                                  validation.endDate ? 'border-danger' : ''
                                }`}
                              />
                            }
                            //    isClearable={true}
                          />
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
                      {discountData?.image ? (
                        <div className="image-input image-input-outline min-w-xl-260px min-h-xl-150px border border-r10px bg-white">
                          <div
                            className="image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center"
                            style={{
                              // backgroundImage: `url(${discountData?.image})`,
                              backgroundRepeat: `no-repeat`,
                            }}
                          >
                            {discountData?.image && (
                              <img
                                width={262}
                                height={149}
                                src={discountData?.image}
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
                            validation.image
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
              <Row className="mt-6">
                <Col md={8}>
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
                          validation.discountValue
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
                          value={discountData.discountValue}
                          placeholder="Enter discount value here..."
                          onChange={(event: any) => {
                            handleChange(
                              event.target.value.trimStart(),
                              'discountValue'
                            );
                          }}
                          onKeyPress={(event: any) => {
                            if (discountData.discountType === FlatDiscount) {
                              handleOnKeyPress(event);
                            } else {
                              handleOnKeyPressWithFloat(event);
                            }
                          }}
                        />
                        <InputGroup.Text
                          className="bg-white border-0"
                          id=""
                        >
                          {discountData.discountType === '1' || ''
                            ? 'Tsh'
                            : '%'}
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md={4}></Col>
              </Row>
              {discountData.discountType === FlatDiscount ||
              (discountData.discountType === PercentageDiscount &&
                discountData.applyDiscountTo === ApplyToCart) ? (
                <Row className="mt-6">
                  <Col md={8}>
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
                            'min-h-40px  border border-r5px border  ms-1',
                            validation.minPurchaseAmount
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
                            value={discountData.minPurchaseAmount}
                            placeholder="Enter discount value here..."
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
                            className="bg-white border-0"
                            id=""
                          >
                            TSh
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col></Col>
                </Row>
              ) : (
                <></>
              )}
              <Row className="mt-6 justify-content-between">
                <Col
                  lg={2}
                  className="align-self-lg-start mt-lg-2 align-self-md-start"
                >
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3 required"
                  >
                    {PromotionAndCampaignString.description}
                  </label>
                </Col>
                <Col
                  lg={9}
                  className="p-0 description-margin"
                >
                  <Form.Control
                    className={clsx(
                      'form-control-custom border bg-white',
                      validation.description
                        ? 'border-danger'
                        : 'border-gray-300'
                    )}
                    placeholder="Enter description here…"
                    as="textarea"
                    rows={5}
                    // value={generalData?.description}
                    onChange={(event: any) => {
                      handleChange(
                        event.target.value.trimStart(),
                        'description'
                      );
                    }}
                  />
                </Col>
              </Row>
              <Col
                xs={12}
                className="mt-6"
              >
                <Row className="justify-content-between">
                  <Col md={2}>
                    <label
                      className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                      htmlFor="flexRadioDefault1"
                    >
                      Discount banner placement
                    </label>
                  </Col>
                  <Col
                    md={9}
                    className="mt-4 me-9"
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
                            discountData.placement ===
                            HomePagePlacement.toString()
                          }
                          onChange={(event) =>
                            handleChange(event.target.value + '', 'placement')
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
                            discountData.placement ===
                            CategoryPagePlacement.toString()
                          }
                          onChange={(event) =>
                            handleChange(event.target.value + '', 'placement')
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
                            discountData.placement ===
                            ProductPlacement.toString()
                          }
                          onChange={(event) =>
                            handleChange(event.target.value + '', 'placement')
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
                            discountData.placement === BrandPlacement.toString()
                          }
                          onChange={(event) =>
                            handleChange(event.target.value + '', 'placement')
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
            {!loading && <span className="indicator-label">Add</span>}
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
      </Row>
    </div>
  );
};
export default AddDiscountPromotion;
