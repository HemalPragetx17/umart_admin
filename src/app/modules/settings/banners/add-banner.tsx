import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { BannerString } from '../../../../utils/string';
import {
  Add,
  BannerConst,
  BrandPlacement,
  CategoryPagePlacement,
  DynamicBanner,
  FixedBanner,
  GeneralSettings,
  HomePagePlacement,
} from '../../../../utils/constants';
import { CustomComponentAfterSelect } from '../../../custom/Select/CustomComponentAfterSelect';
import { useEffect, useState } from 'react';
import CrossSVG from '../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import EditSVG from '../../../../umart_admin/assets/media/svg_uMart/edit-round.svg';
import UploadSVG from '../../../../umart_admin/assets/media/svg_uMart/upload.svg';
import { fileValidation } from '../../../../Global/fileValidation';
import APICallService from '../../../../api/apiCallService';
import {
  banners,
  manageProductInventory,
  master,
} from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import clsx from 'clsx';
import Method from '../../../../utils/methods';
import { bannerJson } from '../../../../api/apiJSON/banner';
import { error, success } from '../../../../Global/toast';
import { bannerToast } from '../../../../utils/toast';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '../../../custom/DateRange/DatePicker';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { useAuth } from '../../auth';
const AddBanner = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [brands, setBrands] = useState<any>([]);
  const [selectedBrands, setSelectedBrands] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<any>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [bannerData, setBannerData] = useState<{
    title: string;
    image: any;
    imageReader: any;
    placement: any;
    type: any;
    variants: string[];
    categories: string[];
    brands: string[];
    startDate: any;
    endDate: any;
  }>({
    title: '',
    image: null,
    imageReader: null,
    placement: HomePagePlacement.toString(),
    type: FixedBanner.toString(),
    variants: [],
    categories: [],
    brands: [],
    startDate: null,
    endDate: null,
  });
  const [validation, setValidation] = useState<{
    title: boolean;
    image: boolean;
    variants: boolean;
    categories: boolean;
    brands: boolean;
    startDate: boolean;
    endDate: boolean;
  }>({
    title: false,
    image: false,
    variants: false,
    categories: false,
    brands: false,
    startDate: false,
    endDate: false,
  });
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (newValue: string, actionMeta: any) => {
    if (
      actionMeta.action !== 'set-value' &&
      actionMeta.action !== 'input-blur'
    ) {
      setInputValue(newValue);
    }
    return newValue;
  };
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasPermission(BannerConst, Add, currentUser)) {
        return window.history.back();
      }
      await fetchProducts();
      await fetchCategories();
      await fetchBrands();
      setFetchLoading(false);
    })();
  }, []);
  const fetchProducts = async () => {
    setFetchLoading(true);
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
      BannerConst
    );
    const response = await apiService.callAPI();
    let data: any = [];
    response.records.map((val: any) => {
      data.push({
        id: val._id,
        skuNumber: val.skuNumber,
        image: val.media[0]?.url,
        name: val.title.replace(/\s*\)\s*/g, ')'),
        label: (
          <div className="d-flex">
            <div className="symbol symbol-30px border me-3">
              <img
                src={val.media[0]?.url || '' || ''}
                className="object-fit-contain "
                alt=""
              />
            </div>
            <div>
              <span className="fs-16 fw-600 text-black mb-0 d-block">
                {val.title.replace(/\s*\)\s*/g, ')')}
              </span>
              <span className="fs-14 fw-500 text-gray mb-0">
                {`SKU: ${val?.skuNumber || 'NA'}`}
              </span>
            </div>
          </div>
        ),
        value: val._id,
        title: val.title.replace(/\s*\)\s*/g, ')'),
      });
    });
    setProductList(data);
    setFetchLoading(false);
  };
  const fetchCategories = async () => {
    let params = {
      sortKey: 'title',
      sortOrder: 1,
      categoriesDepth: 1,
    };
    let apiService = new APICallService(
      master.categoryList,
      params,
      '',
      '',
      false,
      '',
      BannerConst
    );
    const response = await apiService.callAPI();
    if (response) {
      let tempCategories = response.records.map((val: any) => ({
        value: val._id,
        title: val.title.replace(/\s*\)\s*/g, ')'),
        image: val.image,
        name: val.title.replace(/\s*\)\s*/g, ')'),
        id: val._id,
        label: (
          <div className="d-flex">
            <div className="symbol symbol-30px border me-3">
              <img
                src={val.image}
                className="object-fit-contain "
                alt=""
              />
            </div>
            <div>
              <span className="fs-16 fw-600 text-black mb-0 d-block">
                {val.title.replace(/\s*\)\s*/g, ')')}
              </span>
            </div>
          </div>
        ),
      }));
      // response.records.map((item: any) => {
      //   if (item.categories.length) {
      //     tempCategories = [...tempCategories, ...item.categories];
      //   }
      // });
      // const tempSubCategories = tempCategories.map((val: any) => {
      //   return {
      //     value: val._id,
      //     title: val.title.replace(/\s*\)\s*/g, ')'),
      //     image: val.image,
      //     name: val.title.replace(/\s*\)\s*/g, ')'),
      //     id: val._id,
      //     label: (
      //       <div className="d-flex">
      //         <div className="symbol symbol-30px border me-3">
      //           <img
      //             src={val.image}
      //             className="object-fit-contain "
      //             alt=""
      //           />
      //         </div>
      //         <div>
      //           <span className="fs-16 fw-600 text-black mb-0 d-block">
      //             {val.title.replace(/\s*\)\s*/g, ')')}
      //           </span>
      //         </div>
      //       </div>
      //     ),
      //   };
      // });
      setCategories(tempCategories);
    }
  };
  const fetchBrands = async () => {
    let params = {
      sortKey: 'title',
      sortOrder: 1,
    };
    let apiService = new APICallService(
      master.listBrands,
      params,
      '',
      '',
      false,
      '',
      BannerConst
    );
    const response = await apiService.callAPI();
    if (response) {
      const tempBrands = response.records.map((val: any) => ({
        value: val._id,
        title: val.title.replace(/\s*\)\s*/g, ')'),
        image: val.image,
        name: val.title.replace(/\s*\)\s*/g, ')'),
        id: val._id,
        label: (
          <div className="d-flex">
            <div className="symbol symbol-30px border me-3">
              <img
                src={val.image}
                className="object-fit-contain "
                alt=""
              />
            </div>
            <div>
              <span className="fs-16 fw-600 text-black mb-0 d-block">
                {val.title.replace(/\s*\)\s*/g, ')')}
              </span>
            </div>
          </div>
        ),
      }));
      setBrands(tempBrands);
    }
  };
  const handleChange = (event: any, name: string) => {
    let value = event.target.value;
    const tempData = { ...bannerData };
    const tempValidation = { ...validation };
    if (name === 'title') {
      value = value.trimStart();
      tempData.title = value;
      if (value.length === 0 || value === '') {
        tempValidation.title = true;
      } else {
        tempValidation.title = false;
      }
    } else if (name === 'placement') {
      tempData.placement = value;
    } else if (name === 'bannerType') {
      tempData.type = value;
    }
    setBannerData(tempData);
    setValidation(tempValidation);
  };
  const handleDateChange = (date: Date, name: string) => {
    const tempData: any = { ...bannerData };
    const tempValidation: any = { ...validation };
    if (date) {
      tempData[name] = date;
      tempValidation[name] = false;
    }
    setValidation(tempValidation);
    setBannerData(tempData);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = { ...bannerData };
    const tempValidation = { ...validation };
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    if (fileValidation(selectedFiles?.[0])) {
      tempData.image = URL.createObjectURL(selectedFiles?.[0]);
      tempData.imageReader = selectedFiles?.[0];
      tempValidation.image = false;
    }
    setValidation(tempValidation);
    setBannerData(tempData);
  };
  const handleDropdownChange = (event: any, name: string) => {
    const tempData: any = { ...bannerData };
    const tempValidation: any = { ...validation };
    if (event.length) {
      const data = event.map((item: any) => item.value);
      tempData[name] = data;
      tempValidation[name] = false;
    } else {
      tempData[name] = [];
      tempValidation[name] = true;
    }
    if (name === 'variants') {
      setFilteredProducts(event);
    } else if (name === 'categories') {
      setSelectedCategories(event);
    } else if (name === 'brands') {
      setSelectedBrands(event);
    }
    setBannerData(tempData);
    setValidation(tempValidation);
  };
  const handleRemove = (index: number, name: string) => {
    let tempFilterData: any;
    if (name === 'variants') {
      tempFilterData = [...filteredProducts];
    } else if (name === 'categories') {
      tempFilterData = [...selectedCategories];
    } else if (name === 'brands') {
      tempFilterData = [...selectedBrands];
    }
    const tempBannerData: any = { ...bannerData };
    const tempValidation: any = { ...validation };
    const updatedFilterData = tempFilterData.filter(
      (item: any, i: number) => i !== index
    );
    const updatedVariants = tempBannerData[name].filter(
      (item: any, i: number) => i !== index
    );
    if (updatedVariants.length === 0) {
      tempValidation[name] = true;
    }
    tempBannerData[name] = updatedVariants;
    setBannerData(tempBannerData);
    setValidation(tempValidation);
    if (name === 'variants') {
      setFilteredProducts(updatedFilterData);
    } else if (name === 'categories') {
      setSelectedCategories(updatedFilterData);
    } else if (name === 'brands') {
      setSelectedBrands(updatedFilterData);
    }
  };
  const handleSubmit = async () => {
    const tempValidation = { ...validation };
    if (bannerData.title.length === 0) {
      tempValidation.title = true;
    }
    if (!bannerData.image || bannerData.image.length === 0) {
      tempValidation.image = true;
    }
    if (
      bannerData.type === DynamicBanner.toString() &&
      bannerData.variants.length === 0
    ) {
      tempValidation.variants = true;
    } else {
      tempValidation.variants = false;
    }
    if (
      bannerData.placement === CategoryPagePlacement.toString() &&
      bannerData.categories.length === 0
    ) {
      tempValidation.categories = true;
    } else {
      tempValidation.categories = false;
    }
    if (
      bannerData.placement === BrandPlacement.toString() &&
      bannerData.brands.length === 0
    ) {
      tempValidation.brands = true;
    } else {
      tempValidation.brands = false;
    }
    if (!bannerData.startDate) {
      tempValidation.startDate = true;
    }
    if (!bannerData.endDate) {
      tempValidation.endDate = true;
    }
    if (!Object.values(tempValidation).includes(true)) {
      if (Method.dayDifference(bannerData.startDate, bannerData.endDate) < 0) {
        return error(bannerToast.validEndDate);
      }
      setLoading(true);
      const tempData: any = { ...bannerData };
      if (tempData.type === FixedBanner.toString()) {
        tempData.productType = 3;
        tempData.variants = [];
      } else {
        tempData.productType = tempData.variants.length === 1 ? 1 : 2;
      }
      if (tempData.placement !== CategoryPagePlacement.toString()) {
        tempData.categories = [];
      }
      if (tempData.placement !== BrandPlacement.toString()) {
        tempData.brands = [];
      }
      tempData.startDate = Method.convertDateToFormat(
        bannerData.startDate,
        'YYYY-MM-DD'
      );
      tempData.endDate = Method.convertDateToFormat(
        bannerData.endDate,
        'YYYY-MM-DD'
      );
      tempData.days =
        Method.dayDifference(tempData.startDate, tempData.endDate) + 1;
      const apiCallService = new APICallService(
        banners.addBanner,
        bannerJson.addBanner(tempData),
        '',
        '',
        false,
        '',
        BannerConst
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(bannerToast.bannerAdded);
        navigate('/settings/banners');
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  return (
    <Row>
      <Col
        xs={12}
        className="mb-5"
      >
        <h1 className="fs-22 fw-bolder">{BannerString.addBanner}</h1>
      </Col>
      {!fetchLoading ? (
        <>
          {' '}
          <Col lg={8}>
            <Card className="bg-light border border-r10px mb-5 mb-xl-7">
              <Card.Header className="border-0">
                <div className="card-title">
                  <h2 className="fs-22 fw-bolder">Basic details</h2>
                </div>
              </Card.Header>
              <Card.Body className="pt-0 pb-5">
                <Row className="align-items-center">
                  <Col
                    lg={12}
                    className="mb-6"
                  >
                    <label
                      htmlFor=""
                      className="fs-16 fw-500 mb-3 required"
                    >
                      {BannerString.bannerName}
                    </label>
                    <input
                      type="text"
                      id="kt_filter_search"
                      className={clsx(
                        'form-control form-control-white min-h-60px form-control-lg ps-4 border  text-black fs-16',
                        validation.title
                          ? 'border-1 border-danger'
                          : 'border-gray-300'
                      )}
                      placeholder="Enter banner name"
                      value={bannerData.title}
                      onChange={(event: any) => {
                        handleChange(event, 'title');
                      }}
                      // onKeyUp={handleOnKeyUp}
                    />
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className="fs-16 fw-500 required">
                            {BannerString.startDate}
                          </Form.Label>
                          <CustomDatePicker
                            className={clsx(
                              'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded border-1',
                              validation.startDate
                                ? 'border-danger'
                                : ' border-gray-300'
                            )}
                            selected={bannerData.startDate}
                            value={bannerData.startDate}
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
                            placeholder="Select start date"
                            customInput={
                              <CustomDateInput
                                inputClass={`${
                                  validation.startDate
                                    ? 'border-danger'
                                    : ' border-gray-300'
                                }`}
                              />
                            }
                            dayClassName={(date: Date) => {
                              return Method.dayDifference(
                                new Date().toDateString(),
                                date.toDateString()
                              ) < 0
                                ? 'date-disabled'
                                : '';
                            }}
                            //    isClearable={true}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className="fs-16 fw-500 required">
                            {BannerString.endDate}
                          </Form.Label>
                          <CustomDatePicker
                            className={clsx(
                              'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded border-1 ',
                              validation.endDate
                                ? 'border-danger'
                                : 'border-gray-300'
                            )}
                            selected={bannerData.endDate}
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
                            placeholder="Select end date"
                            customInput={
                              <CustomDateInput
                                inputClass={`${
                                  validation.startDate
                                    ? 'border-danger'
                                    : ' border-gray-300'
                                }`}
                              />
                            }
                            dayClassName={(date: Date) => {
                              return Method.dayDifference(
                                new Date().toDateString(),
                                date.toDateString()
                              ) < 0
                                ? 'date-disabled'
                                : '';
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="bg-light border border-r10px mb-5 mb-xl-7">
              {/* <Card.Header className="border-0">
            <Card.Title>
            </Card.Title>
          </Card.Header> */}
              <Card.Body className="pt-8 pb-2 border-bottom px-0">
                <Row className="p-0">
                  <Col
                    xs={12}
                    className="ps-12"
                  >
                    <h2 className="fs-22 fw-bolder text-dark">
                      {BannerString.bannerPlaceMent}
                    </h2>
                  </Col>
                  <Col
                    xs={12}
                    className="mt-4 ps-12"
                  >
                    <div className="d-flex flex-wrap mb-6 gap-2 mt-2 align-items-center">
                      <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value={HomePagePlacement.toString()}
                          checked={
                            bannerData.placement ===
                            HomePagePlacement.toString()
                          }
                          onChange={(event) => handleChange(event, 'placement')}
                        />
                        <label
                          className="form-check-label text-black fs-16 fw-600 ms-2"
                          htmlFor="flexRadioDefault1"
                        >
                          Home page
                        </label>
                      </div>
                      <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value={CategoryPagePlacement.toString()}
                          checked={
                            bannerData.placement ===
                            CategoryPagePlacement.toString()
                          }
                          onChange={(event) => handleChange(event, 'placement')}
                        />
                        <label
                          className="form-check-label text-black fs-16 fw-600 ms-2"
                          htmlFor="flexRadioDefault1"
                        >
                          Category page
                        </label>
                      </div>
                      {/* <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value={ProductPlacement.toString()}
                          checked={
                            bannerData.placement === ProductPlacement.toString()
                          }
                          onChange={(event) => handleChange(event, 'placement')}
                        />
                        <label
                          className="form-check-label text-black fs-16 fw-600 ms-2"
                          htmlFor="flexRadioDefault1"
                        >
                          Product
                        </label>
                      </div> */}
                      <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value={BrandPlacement.toString()}
                          checked={
                            bannerData.placement === BrandPlacement.toString()
                          }
                          onChange={(event) => handleChange(event, 'placement')}
                        />
                        <label
                          className="form-check-label text-black fs-16 fw-600 ms-2"
                          htmlFor="flexRadioDefault1"
                        >
                          Brand
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {bannerData.placement === CategoryPagePlacement.toString() ? (
              <Card className="bg-light border border-r10px mb-6 mb-xl-9">
                <Card.Header className="border-0">
                  <Card.Title>
                    <h2 className="fs-22 fw-bolder">Category selection</h2>
                  </Card.Title>
                </Card.Header>
                <Card.Body className="pt-0 border-bottom">
                  <Row className="align-items-center">
                    <Col
                      lg={12}
                      className="mb-6"
                    >
                      <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                        Select categories for banner
                      </Form.Label>
                    </Col>
                    <Col lg={12}>
                      <CustomComponentAfterSelect
                        value={selectedCategories}
                        options={categories}
                        onChange={(event: any) => {
                          handleDropdownChange(event, 'categories');
                        }}
                        closeMenuOnSelect={false}
                        border={validation.categories ? '#e55451' : '#e0e0df'}
                        isMulti={true}
                        isSearchable={true}
                        hideSelectedOptions={false}
                      />
                    </Col>
                  </Row>
                </Card.Body>
                {selectedCategories.length ? (
                  <>
                    <Card.Header className="border-0">
                      <Card.Title>
                        <h5 className="fs-22 fw-bolder">
                          Added categories for advertisement
                        </h5>
                      </Card.Title>
                    </Card.Header>
                    <Card.Body className="pt-0">
                      <Row>
                        <Col
                          lg={12}
                          className="mt-5"
                        >
                          {selectedCategories.map(
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
                                        {productVal.name}
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
                                          src={CrossSVG}
                                          onClick={() => {
                                            handleRemove(index, 'categories');
                                          }}
                                          alt=""
                                        />
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  {selectedCategories.length === 1 ? (
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
              </Card>
            ) : (
              <></>
            )}
            {bannerData.placement === BrandPlacement.toString() ? (
              <Card className="bg-light border border-r10px mb-6 mb-xl-9">
                <Card.Header className="border-0">
                  <Card.Title>
                    <h2 className="fs-22 fw-bolder">Brand selection</h2>
                  </Card.Title>
                </Card.Header>
                <Card.Body className="pt-0 border-bottom">
                  <Row className="align-items-center">
                    <Col
                      lg={12}
                      className="mb-6"
                    >
                      <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                        Select brands for banner
                      </Form.Label>
                    </Col>
                    <Col lg={12}>
                      <CustomComponentAfterSelect
                        value={selectedBrands}
                        options={brands}
                        onChange={(event: any) => {
                          handleDropdownChange(event, 'brands');
                        }}
                        closeMenuOnSelect={false}
                        border={validation.brands ? '#e55451' : '#e0e0df'}
                        isMulti={true}
                        isSearchable={true}
                        hideSelectedOptions={false}
                      />
                    </Col>
                  </Row>
                </Card.Body>
                {selectedBrands.length ? (
                  <>
                    <Card.Header className="border-0">
                      <Card.Title>
                        <h5 className="fs-22 fw-bolder">
                          Added brands for advertisement
                        </h5>
                      </Card.Title>
                    </Card.Header>
                    <Card.Body className="pt-0">
                      <Row>
                        <Col
                          lg={12}
                          className="mt-5"
                        >
                          {selectedBrands.map(
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
                                        {productVal.name}
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
                                          src={CrossSVG}
                                          onClick={() => {
                                            handleRemove(index, 'brands');
                                          }}
                                          alt=""
                                        />
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  {selectedBrands.length === 1 ? (
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
              </Card>
            ) : (
              <></>
            )}
            <Card className="bg-light border border-r10px mb-6 mb-xl-9">
              <Card.Body className="pt-8 pb-2 border-bottom px-0">
                <Row className="p-0">
                  <Col
                    xs={12}
                    className="ps-12 mt-4"
                  >
                    <h2 className="fs-22 fw-bolder text-dark">
                      {BannerString.bannerType}
                    </h2>
                  </Col>
                  <Col
                    xs={12}
                    className="mt-4 ps-12"
                  >
                    <div className="d-flex flex-wrap mb-6 gap-2 mt-2 align-items-center">
                      <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault3"
                          value={FixedBanner.toString()}
                          checked={bannerData.type === FixedBanner.toString()}
                          onChange={(event) =>
                            handleChange(event, 'bannerType')
                          }
                        />
                        <label
                          className="form-check-label text-black fs-16 fw-600 ms-2"
                          htmlFor="flexRadioDefault2"
                        >
                          Fixed banner
                        </label>
                      </div>
                      <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault3"
                          value={DynamicBanner.toString()}
                          checked={bannerData.type === DynamicBanner.toString()}
                          onChange={(event) =>
                            handleChange(event, 'bannerType')
                          }
                        />
                        <label
                          className="form-check-label text-black fs-16 fw-600 ms-2"
                          htmlFor="flexRadioDefault3"
                        >
                          Dynamic banner
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {bannerData.type === DynamicBanner.toString() ? (
              <Card className="bg-light border border-r10px mb-6 mb-xl-9">
                <Card.Header className="border-0">
                  <Card.Title>
                    <h2 className="fs-22 fw-bolder">Product selection</h2>
                  </Card.Title>
                </Card.Header>
                <Card.Body className="pt-0 border-bottom">
                  <Row className="align-items-center">
                    <Col
                      lg={12}
                      className="mb-6"
                    >
                      <Form.Label className="fs-16 fw-500 mb-2 text-dark required">
                        Select products for banner
                      </Form.Label>
                    </Col>
                    <Col lg={12}>
                      <CustomComponentAfterSelect
                        value={filteredProducts}
                        options={productList}
                        onChange={(event: any) => {
                          handleDropdownChange(event, 'variants');
                        }}
                        closeMenuOnSelect={false}
                        border={validation.variants ? '#e55451' : '#e0e0df'}
                        isMulti={true}
                        isSearchable={true}
                        hideSelectedOptions={false}
                        inputValue={inputValue}
                        onInputChange={handleInputChange}   
                      />
                    </Col>
                  </Row>
                </Card.Body>
                {filteredProducts.length ? (
                  <>
                    <Card.Header className="border-0">
                      <Card.Title>
                        <h5 className="fs-22 fw-bolder">
                          Added products for advertisement
                        </h5>
                      </Card.Title>
                    </Card.Header>
                    <Card.Body className="pt-0">
                      <Row>
                        <Col
                          lg={12}
                          className="mt-5"
                        >
                          {filteredProducts.map(
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
                                      <div>
                                        <div className="fs-14 fw-500 align-self-center ms-1 text-dark">
                                          {productVal.name}
                                        </div>
                                        <div className="fs-14 fw-500 text-gray mb-0">
                                          SKU: {productVal.skuNumber}
                                        </div>
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
                                          src={CrossSVG}
                                          onClick={() => {
                                            handleRemove(index, 'variants');
                                          }}
                                          alt=""
                                        />
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  {filteredProducts.length === 1 ? (
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
              </Card>
            ) : (
              <></>
            )}
          </Col>
          <Col lg={4}>
            <Card className="bg-light border border-r10px">
              <Card.Header className="border-bottom-0">
                <Card.Title>
                  <h5 className="fs-22 fw-bolder">
                    {BannerString.bannerImage}
                  </h5>
                </Card.Title>
              </Card.Header>
              <Card.Body className="pt-0">
                {bannerData?.image ? (
                  <div className="image-input image-input-outline min-w-xl-260px min-h-xl-150px border border-r10px bg-white">
                    <div
                      className="image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center"
                      style={{
                        backgroundImage: `url(${bannerData?.image})`,
                        backgroundRepeat: `no-repeat`,
                      }}
                    >
                      {bannerData?.image && (
                        <img
                          width={262}
                          height={149}
                          src={bannerData?.image}
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
                      'upload-btn-wrapper border-r10px min-w-xl-260px min-h-xl-150px',
                      validation.image ? 'border border-danger' : ''
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
              <span className="text-gray text-italic">
                {BannerString.bannerImageNote}
              </span>
            </div>
          </Col>
          <Col xs={12}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                handleSubmit();
              }}
              disabled={loading}
            >
              {!loading && (
                <span className="indicator-label fs-16 fw-bolder">
                  {BannerString.publicBanner}
                </span>
              )}
              {loading && (
                <span
                  className="indicator-progress indicator-label fs-16 fw-600"
                  style={{ display: 'block' }}
                >
                  Please wait...{' '}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}{' '}
            </Button>
          </Col>
        </>
      ) : (
        <div className="border border-r10px mb-6">
          <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
            <Loader loading={fetchLoading} />
          </div>
        </div>
      )}
    </Row>
  );
};
export default AddBanner;
