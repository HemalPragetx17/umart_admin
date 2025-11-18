import { useEffect, useState } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import clsx from 'clsx';
import { CreatableSelectWhite } from '../../../custom/Select/CreatableSelectWhite';
import Validations from '../../../../utils/validations';
const General = (props: any) => {
  const [generalData, setGeneralData] = useState<any>(props.generalData);
  const [generalDataValidation, setGeneralDataValidation] = useState<any>(
    props.validations
  );
  const [disabled, setDisabled] = useState(generalData.noneSelected);
  const [inputValue, setInputValue] = useState('');
  const handleChange = (value: any, name: string) => {
    let temp: any = { ...generalData };
    let tempValidation: any = { ...generalDataValidation };
    if (name === 'productTax') {
      if (Validations.allowNumberAndFloat(value)) {
        temp[name] = value;
        tempValidation[name] = false;
      }
    } else {
      temp[name] = value;
      tempValidation[name] = false;
    }
    if (name === 'returnHours') {
      value = value.split('.')[0];
      if (!Validations.allowNumberAndFloat(value)) {
        return;
      }
      temp[name] = value;
      tempValidation[name] = false;
    }
    setGeneralDataValidation(tempValidation);
    props.onValidationChange(tempValidation);
    props.onGeneralDataChange(temp);
    setGeneralData(temp);
  };
  const handleProductTax = () => {
    let temp: any = { ...generalData };
    let tempValidation: any = { ...generalDataValidation };
    temp['taxFree'] = !temp['taxFree'];
    if (temp['taxFree']) {
      tempValidation['productTax'] = false;
      temp['productTax'] = '0';
    }
    setGeneralDataValidation(tempValidation);
    props.onValidationChange(tempValidation);
    props.onGeneralDataChange(temp);
    setGeneralData(temp);
  };
  const handlePrimaryCategory = (event: any, val: any) => {
    let temp: any = { ...generalData };
    let tempValidation: any = { ...generalDataValidation };
    let variants: any = [];
    tempValidation['primaryCategory'] = false;
    tempValidation['subCategory'] = false;
    tempValidation.variants = false;
    if (temp['primaryCategory'] !== val) {
      tempValidation['filterTechnicalValidation'] = [];
      temp['defaultTechnicalFields'] = [];
    }
    if (!temp['variants'].length) {
      temp['noneSelected'] = true;
    }
    temp['primaryCategory'] = val;
    temp['defaultSubCategory'] = event.categories;
    temp['subCategory'] = event.categories[0]._id;
    let subCategoryVariant: any = [];
    props.variants.map(function (el: any) {
      let catTemp: any = [];
      el.categories.map((cat: any) => {
        if (
          cat.category === temp.primaryCategory &&
          cat.subCategory === event.categories[0]._id
        ) {
          catTemp.push(cat);
        }
      });
      if (catTemp.length) {
        el = {
          ...el,
          categories: catTemp,
          isSelected: false,
          selectors: [],
          name: [],
        };
        variants.push(el);
        subCategoryVariant.push(el);
      }
    });
    // props.setInitialVariant(variants);
    temp['variants'] = variants;
    if (!temp['variants'].length) {
      temp['noneSelected'] = true;
    }
    if (event.categories[0].categories.length) {
      temp['defaultGroupCategory'] = event.categories[0].categories;
      temp['groupCategory'] = event.categories[0].categories[0]._id;
    } else {
      temp['defaultGroupCategory'] = [];
      temp['groupCategory'] = '';
    }
    temp.combinations = [];
    props.onValidationChange(tempValidation);
    props.onGeneralDataChange(temp);
    setGeneralDataValidation(tempValidation);
    setGeneralData(temp);
  };
  const handleSubCategory = async (event: any, val: any) => {
    let temp: any = { ...generalData };
    let tempValidation: any = { ...generalDataValidation };
    let variants: any = [];
    props.variants.map(function (el: any) {
      let catTemp: any = [];
      el.categories.map((cat: any) => {
        if (cat.category === temp.primaryCategory && cat.subCategory === val) {
          catTemp.push(cat);
        }
      });
      if (catTemp.length) {
        el = {
          ...el,
          categories: catTemp,
          isSelected: false,
          selectors: [],
          name: [],
        };
        variants.push(el);
      }
    });
    temp['variants'] = variants;
    if (!temp['variants'].length) {
      temp['noneSelected'] = true;
    }
    temp['subCategory'] = val;
    tempValidation['subCategory'] = false;
    if (event.categories.length) {
      temp['defaultGroupCategory'] = event.categories;
      temp['groupCategory'] = event.categories[0]._id;
    } else {
      temp['defaultGroupCategory'] = [];
      temp['groupCategory'] = '';
    }
    setGeneralDataValidation(tempValidation);
    props.onValidationChange(tempValidation);
    props.onGeneralDataChange(temp);
    setGeneralData(temp);
  };
  const handleVariant = (event: any, variantIndex: number) => {
    let temp: any = { ...generalData };
    let tempValidation: any = { ...generalDataValidation };
    if (variantIndex === -1) {
      if (disabled === true) {
        setDisabled(false);
        temp.noneSelected = false;
        let someTrue = temp.variants.some((el: any) => {
          return el.isSelected === true;
        });
        if (someTrue) {
          tempValidation.variants = false;
        } else {
          tempValidation.variants = true;
        }
      } else {
        setDisabled(true);
        let data: any = [];
        temp.variants.map((val: any) => {
          data.push({ ...val, isSelected: false });
        });
        tempValidation.variants = false;
        temp.noneSelected = true;
        temp.variants = data;
      }
      setGeneralData(temp);
    } else {
      temp.variants[variantIndex].isSelected =
        !temp.variants[variantIndex].isSelected;
      let someTrue = temp.variants.some((el: any) => {
        return el.isSelected === true;
      });
      if (someTrue) {
        tempValidation.variants = false;
      } else {
        tempValidation.variants = true;
      }
      // Reset variants options after select / deselect ( same as initial state)
      const tempVar = props.initialVariants.find(
        (item: any) => item._id === generalData.variants[variantIndex]._id
      );
      const tempCategories = tempVar?.categories.filter(
        (item: any) =>
          item.category === temp.primaryCategory &&
          item.subCategory === temp.subCategory
      );
      temp.variants[variantIndex].categories = tempCategories || [];
      if (event.target.checked) {
        tempValidation.selectedVariants[variantIndex] = false;
      }
      setGeneralData(temp);
    }
    props.onValidationChange(tempValidation);
    setGeneralDataValidation(tempValidation);
    props.onGeneralDataChange(temp);
  };
  const createOption = (label: string) => ({
    label,
    value: label,
    title: label,
  });
  const handleMultiSelect = (inputValue: string, variantIndex: number) => {
    let temp = { ...generalData };
    const newOption = createOption(inputValue);
    temp.variants[variantIndex].categories[0].options = [
      ...temp.variants[variantIndex].categories[0].options,
      newOption,
    ];
    setGeneralData(temp);
    props.onGeneralDataChange(temp);
  };
  const handleInputChange = (inputValue: string, variantIndex: number) => {
    let temp = { ...generalData };
    temp.variants[variantIndex].inputValue = inputValue;
    setGeneralData(temp);
    props.onGeneralDataChange(temp);
    props.setIsVariantChange(true);
  };
  const handleMultiSelectChange = (inputValue: any, variantIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    temp.variants[variantIndex].categories[0].options = inputValue;
    let tempValidation: any = { ...generalDataValidation };
    if (inputValue.length > 0) {
      tempValidation.selectedVariants[variantIndex] = false;
    } else {
      tempValidation.selectedVariants[variantIndex] = true;
    }
    setGeneralData(temp);
    // props.onGeneralDataChange(temp);
    setGeneralDataValidation(tempValidation);
    // props.onValidationChange(tempValidation);
  };
  const handleKeyDown = (event: any, variantIndex: number) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (event.target.value.trimStart().length > 0) {
          const newOption = createOption(event.target.value);
          let tempValidation: any = { ...generalDataValidation };
          let temp = { ...generalData };
          temp.variants[variantIndex].categories[0].options = [
            ...temp.variants[variantIndex].categories[0].options,
            newOption,
          ];
          if (temp.variants[variantIndex].categories[0].options.length > 0) {
            tempValidation.selectedVariants[variantIndex] = false;
          } else {
            tempValidation.selectedVariants[variantIndex] = true;
          }
          setGeneralDataValidation(tempValidation);
          props.onValidationChange(tempValidation);
          temp.variants[variantIndex].inputValue = '';
          setGeneralData(temp);
          props.onGeneralDataChange(temp);
          props.setIsVariantChange(true);
        }
        event.preventDefault();
    }
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleCheckboxChange = (event: any) => {
    const temp = { ...generalData };
    if (event.target.name === 'refundable') {
      if (event.target.checked) {
        temp.isReturnable = true;
      }
    } else if (event.target.name === 'notRefundable') {
      if (event.target.checked) {
        temp.isReturnable = false;
      }
    }
    props.onGeneralDataChange(temp);
    setGeneralData(temp);
  };
  useEffect(() => {
    setGeneralData(generalData);
    setDisabled(generalData.noneSelected);
  }, [generalData]);
  useEffect(() => {
    setGeneralDataValidation(props.validations);
  }, [generalDataValidation, props.validations]);
  const handleMultiSelectSearchTags = (inputValue: string) => {
    let temp = { ...generalData };
    const newOption = createOption(inputValue);
    temp.searchTag.options = [...temp.searchTag.options, newOption];
    setGeneralData(temp);
  };
  const handleInputChangeSearchTags = (inputValue: string) => {
    let temp = { ...generalData };
    temp.searchTag.inputValue = inputValue;
    setGeneralData(temp);
  };
  const handleKeyDownSearchTags = (event: any) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (event.target.value.trimStart().length > 0) {
          const newOption = createOption(event.target.value);
          let temp = { ...generalData };
          temp.searchTag.options = [...temp.searchTag.options, newOption];
          temp.searchTag.inputValue = '';
          setGeneralData(temp);
          props.onGeneralDataChange(temp);
        }
        event.preventDefault();
    }
  };
  const handleMultiSelectChangeSearchTag = (inputValue: any) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    temp.searchTag.options = inputValue;
    setGeneralData(temp);
    props.onGeneralDataChange(temp);
  };
  return (
    <>
      <div className="card bg-light pt-2 mb-6 mb-xl-9 border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder">Product category</h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <Row className="align-items-center">
            <Col
              lg={6}
              className="mb-5"
            >
              <Row className="align-items-center">
                <Col lg={4}>
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3 required"
                  >
                    Primary category
                  </label>
                </Col>
                <Col lg={8}>
                  <CustomSelectWhite
                    border={clsx(
                      generalDataValidation.primaryCategory ? '#e55451' : ''
                    )}
                    defaultValue={
                      props.categories &&
                      props.categories
                        .filter(
                          (val: any) => val._id === generalData.primaryCategory
                        )
                        .map((val: any) => ({
                          label: (
                            <>
                              <div className="symbol symbol-30px border me-3">
                                <img
                                  src={val.image}
                                  className="object-fit-contain"
                                  alt=""
                                />
                              </div>
                              <span className="fs-16 fw-600 text-black mb-0">
                                {val.title}
                              </span>
                            </>
                          ),
                          value: val._id,
                          categories: val.categories,
                          title: val.title,
                          _id: val._id,
                        }))
                    }
                    onChange={(event: any) => {
                      handlePrimaryCategory(event, event._id);
                    }}
                    options={
                      props.categories &&
                      props.categories
                        .filter(
                          (item: any) =>
                            item._id !== generalData.primaryCategory
                        )
                        .map((val: any) => ({
                          label: (
                            <>
                              <div className="symbol symbol-30px border me-3">
                                <img
                                  src={val.image}
                                  className="object-fit-contain"
                                  alt=""
                                />
                              </div>
                              <span className="fs-16 fw-600 text-black mb-0">
                                {val.title}
                              </span>
                            </>
                          ),
                          value: val._id,
                          categories: val.categories,
                          title: val.title,
                          _id: val._id,
                        }))
                    }
                    isMulti={false}
                  />
                </Col>
              </Row>
            </Col>
            {generalData.defaultSubCategory.length ? (
              <Col
                lg={6}
                className="mb-5"
              >
                <Row className="align-items-center">
                  <Col lg={4}>
                    <label
                      htmlFor=""
                      className="fs-16 fw-500 mb-lg-0 mb-3 required"
                    >
                      Sub category
                    </label>
                  </Col>
                  <Col lg={8}>
                    <CustomSelectWhite
                      defaultValue={
                        generalData.defaultSubCategory &&
                        generalData.defaultSubCategory
                          .filter(
                            (val: any) => val._id === generalData.subCategory
                          )
                          .map((val: any) => ({
                            label: (
                              <>
                                <div className="symbol symbol-30px border me-3">
                                  <img
                                    src={val.image}
                                    className="object-fit-contain"
                                    alt=""
                                  />
                                </div>
                                <span className="fs-16 fw-600 text-black mb-0">
                                  {val.title}
                                </span>
                              </>
                            ),
                            value: val._id,
                            categories: val.categories,
                            title: val.title,
                            _id: val._id,
                          }))
                      }
                      value={
                        generalData.defaultSubCategory &&
                        generalData.defaultSubCategory
                          .filter(
                            (val: any) => val._id === generalData.subCategory
                          )
                          .map((val: any) => ({
                            label: (
                              <>
                                <div className="symbol symbol-30px border me-3">
                                  <img
                                    src={val.image}
                                    className="object-fit-contain"
                                    alt=""
                                  />
                                </div>
                                <span className="fs-16 fw-600 text-black mb-0">
                                  {val.title}
                                </span>
                              </>
                            ),
                            value: val._id,
                            categories: val.categories,
                            title: val.title,
                            _id: val._id,
                          }))
                      }
                      border={clsx(
                        generalDataValidation.subCategory ? '#e55451' : ''
                      )}
                      onChange={(event: any) => {
                        handleSubCategory(event, event._id);
                      }}
                      options={
                        generalData.defaultSubCategory &&
                        generalData.defaultSubCategory
                          .filter(
                            (item: any) =>
                              item._id !== generalData.defaultSubCategory
                          )
                          .map((val: any) => ({
                            label: (
                              <>
                                <div className="symbol symbol-30px border me-3">
                                  <img
                                    src={val.image}
                                    className="object-fit-contain"
                                    alt=""
                                  />
                                </div>
                                <span className="fs-16 fw-600 text-black mb-0">
                                  {val.title}
                                </span>
                              </>
                            ),
                            value: val._id,
                            categories: val.categories,
                            title: val.title,
                            _id: val._id,
                          }))
                      }
                      isMulti={false}
                    />
                  </Col>
                </Row>
              </Col>
            ) : (
              <></>
            )}
            {generalData.defaultGroupCategory.length ? (
              <Col
                lg={6}
                className="mb-5"
              >
                <Row className="align-items-center">
                  <Col lg={4}>
                    <label
                      htmlFor=""
                      className="fs-16 fw-500 mb-lg-0 mb-3"
                    >
                      Group category
                    </label>
                  </Col>
                  <Col lg={8}>
                    <CustomSelectWhite
                      defaultValue={
                        generalData.defaultGroupCategory &&
                        generalData.defaultGroupCategory
                          .filter(
                            (val: any) => val._id === generalData.groupCategory
                          )
                          .map((val: any) => ({
                            label: (
                              <>
                                <span className="fs-16 fw-600 text-black mb-0">
                                  {val.title}
                                </span>
                              </>
                            ),
                            value: val._id,
                            categories: val.categories,
                            title: val.title,
                            _id: val._id,
                          }))
                      }
                      value={
                        generalData.defaultGroupCategory &&
                        generalData.defaultGroupCategory
                          .filter(
                            (val: any) => val._id === generalData.groupCategory
                          )
                          .map((val: any) => ({
                            label: (
                              <>
                                <span className="fs-16 fw-600 text-black mb-0">
                                  {val.title}
                                </span>
                              </>
                            ),
                            value: val._id,
                            categories: val.categories,
                            title: val.title,
                            _id: val._id,
                          }))
                      }
                      onChange={(event: any) => {
                        handleChange(event._id, 'groupCategory');
                      }}
                      options={
                        generalData.defaultGroupCategory &&
                        generalData.defaultGroupCategory
                          .filter(
                            (item: any) =>
                              item._id !== generalData.defaultGroupCategory
                          )
                          .map((val: any) => ({
                            label: (
                              <>
                                <span className="fs-16 fw-600 text-black mb-0">
                                  {val.title}
                                </span>
                              </>
                            ),
                            value: val._id,
                            categories: val.categories,
                            title: val.title,
                            _id: val._id,
                          }))
                      }
                      isMulti={false}
                    />
                  </Col>
                </Row>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </div>
      </div>
      <div className="card bg-light pt-2 mb-6 mb-xl-9 border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder">Basic details</h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <Row className="align-items-center">
            <Col
              lg={12}
              className="mb-6"
            >
              <Row className="align-items-center">
                <Col lg={2}>
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3 required"
                  >
                    Product title
                  </label>
                </Col>
                <Col lg={10}>
                  <input
                    type="text"
                    className={clsx(
                      'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                      generalDataValidation.productTitle ? 'border-danger' : ''
                    )}
                    name="name"
                    value={generalData?.productTitle}
                    placeholder="Type here…"
                    onChange={(event: any) => {
                      handleChange(
                        event.target.value.trimStart(),
                        'productTitle'
                      );
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={12}>
              <Row className="align-items-center">
                <Col
                  lg={6}
                  className="mb-5"
                >
                  <Row className="align-items-center">
                    <Col lg={4}>
                      <label
                        htmlFor=""
                        className="fs-16 fw-500 mb-lg-0 mb-3 required"
                      >
                        Brand
                      </label>
                    </Col>
                    <Col lg={8}>
                      <CustomSelectWhite
                        defaultValue={
                          props.brands &&
                          props.brands
                            .filter((val: any) => {
                              return val._id === generalData.brand;
                            })
                            .map((val: any) => ({
                              label: val.title,
                              value: val._id,
                              title: val.title,
                              _id: val._id,
                            }))
                        }
                        value={
                          props.brands &&
                          props.brands
                            .filter((val: any) => {
                              return val._id === generalData.brand;
                            })
                            .map((val: any) => ({
                              label: val.title,
                              value: val._id,
                              title: val.title,
                              _id: val._id,
                            }))
                        }
                        border={clsx(
                          generalDataValidation.brand ? '#e55451' : ''
                        )}
                        onChange={(event: any) => {
                          handleChange(event._id, 'brand');
                        }}
                        options={
                          props.brands &&
                          props.brands.map((val: any) => ({
                            label: val.title,
                            value: val._id,
                            title: val.title,
                            _id: val._id,
                          }))
                        }
                        isMulti={false}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  lg={6}
                  className="mb-5"
                >
                  <Row className="align-items-center">
                    <Col lg={4}>
                      <label
                        htmlFor=""
                        className="fs-16 fw-500 mb-lg-0 mb-3 required"
                      >
                        Country of origin
                      </label>
                    </Col>
                    <Col lg={8}>
                      <CustomSelectWhite
                        defaultValue={
                          props.countries &&
                          props.countries
                            .filter((val: any) => {
                              return val._id === generalData.country;
                            })
                            .map((val: any) => ({
                              label: val.name,
                              value: val._id,
                              title: val.name,
                              _id: val._id,
                            }))
                        }
                        value={
                          props.countries &&
                          props.countries
                            .filter((val: any) => {
                              return val._id === generalData.country;
                            })
                            .map((val: any) => ({
                              label: val.name,
                              value: val._id,
                              title: val.name,
                              _id: val._id,
                            }))
                        }
                        border={clsx(
                          generalDataValidation.country ? '#e55451' : ''
                        )}
                        options={
                          props.countries &&
                          props.countries.map((val: any) => ({
                            label: val.name,
                            value: val._id,
                            title: val.name,
                            _id: val._id,
                          }))
                        }
                        onChange={(event: any) => {
                          handleChange(event._id, 'country');
                        }}
                        isMulti={false}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col
              lg={12}
              className="mb-6"
            >
              <Row className="align-items-center">
                <Col
                  lg={2}
                  className="align-self-lg-start mt-lg-2"
                >
                  <label
                    htmlFor=""
                    className="fs-16 fw-500 mb-lg-0 mb-3 required"
                  >
                    Product description
                  </label>
                </Col>
                <Col lg={10}>
                  <Form.Control
                    className={clsx(
                      'form-control-custom border bg-white',
                      generalDataValidation.description ? 'border-danger' : ''
                    )}
                    placeholder="Type here…"
                    as="textarea"
                    rows={5}
                    value={generalData?.description}
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
            {generalData.taxFree ? (
              <></>
            ) : (
              <Col
                lg={6}
                className="mb-5"
              >
                <Row className="align-items-center">
                  <Col lg={4}>
                    <label
                      htmlFor=""
                      className="fs-16 fw-500 mb-lg-0 mb-3"
                    >
                      Set tax in percentage
                    </label>
                  </Col>
                  <Col lg={8}>
                    <InputGroup
                      className={clsx(
                        'min-h-40px  border border-r5px',
                        generalDataValidation.productTax ? 'border-danger' : ''
                      )}
                    >
                      <Form.Control
                        className={clsx(
                          'border-0 fs-14 fw-600 text-dark h-60px'
                        )}
                        aria-label="Default"
                        aria-describedby=""
                        value={generalData.productTax}
                        placeholder="Type here"
                        onChange={(event: any) => {
                          handleChange(
                            event.target.value.trimStart(),
                            'productTax'
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
                        %
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </div>
      </div>
      <div className="card bg-light pt-2 mb-6 mb-xl-9 border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder">Product search tags</h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <Row>
            <Col>
              <CreatableSelectWhite
                getOptionLabel={(option: any) => {
                  return <>{option.title}</>;
                }}
                inputValue={generalData.searchTag.inputValue}
                placeholder="Type here..."
                options={generalData.searchTag.options}
                isMulti={true}
                onCreateOption={(event: any) => {
                  handleMultiSelectSearchTags(event);
                }}
                border={'#e0e0df'}
                onChange={(newValue: any) => {
                  handleMultiSelectChangeSearchTag(newValue);
                }}
                onInputChange={(newValue: any) =>
                  handleInputChangeSearchTags(newValue)
                }
                value={generalData?.searchTag.options}
                indicatorDisplay="none"
                display="none"
                menuIsOpen={false}
                onKeyDown={(event: any, newValue: any) =>
                  handleKeyDownSearchTags(event)
                }
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="card bg-light pt-2 mb-6 mb-xl-9 border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder">
              Does this product is returnable?
            </h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <Row className="align-items-center">
            <Col xs={12}>
              <span className="me-8">
                <input
                  className={clsx(
                    'form-check-input pt-1 h-30px w-30px  me-3',
                    generalData.isReturnable
                      ? 'border border-5 border-primary'
                      : ''
                  )}
                  type="checkbox"
                  name="refundable"
                  checked={generalData.isReturnable}
                  onChange={(event) => {
                    handleCheckboxChange(event);
                  }}
                />
                <label className="form-check-label fs-16 fw-500 text-dark ms-2">
                  {'Yes'}
                </label>
              </span>
              <span className="me-8">
                <input
                  className={clsx(
                    'form-check-input pt-1 h-30px w-30px  me-3',
                    !generalData.isReturnable
                      ? 'border border-5 border-primary'
                      : ''
                  )}
                  type="checkbox"
                  name="notRefundable"
                  checked={!generalData.isReturnable}
                  onChange={(event) => {
                    handleCheckboxChange(event);
                  }}
                  value={0}
                  id={``}
                />
                <label className="form-check-label fs-16 fw-500 text-dark ms-2">
                  {'No'}
                </label>
              </span>
            </Col>
            {generalData.isReturnable ? (
              <>
                <Col
                  xs={12}
                  className="mt-6"
                >
                  {' '}
                  <div className="d-flex flex-wrap mb-6 gap-2">
                    <div className="bg-gray-dark border-r8px p-5  mb-3">
                      <span className="fs-16 fw-600 text-black px-1">
                        Note: You can set the post-delivery return window and
                        can process partial or full refunds, contingent upon the
                        condition of the returned product.
                      </span>
                    </div>
                  </div>
                </Col>
                <Col
                  lg={6}
                  className="mb-5"
                >
                  <Row className="align-items-center">
                    <Col lg={4}>
                      <label
                        htmlFor=""
                        className="fs-16 fw-500 mb-lg-0 mb-3"
                      >
                        Set time period
                      </label>
                    </Col>
                    <Col lg={8}>
                      <InputGroup
                        className={clsx(
                          'min-h-40px  border border-r5px',
                          generalDataValidation.returnHours
                            ? 'border-danger'
                            : ''
                        )}
                      >
                        <Form.Control
                          className={clsx(
                            'border-0 fs-14 fw-600 text-dark h-60px'
                          )}
                          aria-label="Default"
                          aria-describedby=""
                          value={generalData.returnHours}
                          placeholder="Type here"
                          onChange={(event: any) => {
                            handleChange(
                              event.target.value.trimStart(),
                              'returnHours'
                            );
                          }}
                          onKeyPress={(event: any) => {
                            handleOnKeyPress(event);
                          }}
                        />
                        <InputGroup.Text
                          className="bg-white border-0 fs-16"
                          id=""
                        >
                          Hours
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
              </>
            ) : (
              <></>
            )}
          </Row>
        </div>
      </div>
      <div className="card pt-4 bg-light border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder text-dark">
              Does your product have variants?
            </h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          <form
            className="form"
            action="#"
            id="kt_ecommerce_customer_profile"
          >
            {generalData.primaryCategory === '' ||
            generalData.subCategory === '' ? (
              <div className="d-flex flex-wrap mb-6 gap-2">
                <div className="bg-gray-dark border-r8px p-5  mb-3">
                  <span className="fs-16 fw-600 text-black px-1">
                    Please select category on the left to view the variants.
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="d-flex flex-wrap mb-6 gap-2">
                  <div className="form-check form-check-custom form-check-solid me-6 mb-lg-0">
                    <input
                      className={clsx(
                        'form-check-input h-30px w-30px h-md-35px w-md-35px',
                        generalDataValidation.variants
                          ? 'border border-danger'
                          : ''
                      )}
                      type="checkbox"
                      value={-1}
                      name={'None'}
                      checked={generalData.noneSelected}
                      onChange={(event: any) => {
                        handleVariant(event, -1);
                      }}
                    />
                    <label className="form-check-label text-dark fs-16 fw-600 ms-3">
                      None
                    </label>
                  </div>
                  {generalData.variants.map(
                    (val: any, variantIndex: number) => {
                      return (
                        <>
                          <div className="form-check form-check-custom form-check-solid me-6 mb-lg-0 ">
                            <input
                              className={clsx(
                                'form-check-input h-30px w-30px h-md-35px w-md-35px',
                                generalDataValidation.variants
                                  ? 'border border-danger'
                                  : ''
                              )}
                              type="checkbox"
                              value={val.title}
                              name={val.title}
                              checked={disabled ? false : val.isSelected}
                              onChange={(event: any) => {
                                handleVariant(event, variantIndex);
                              }}
                              disabled={generalData.noneSelected}
                            />
                            <label className="form-check-label text-dark fs-16 fw-600 ms-3">
                              {val.title}
                            </label>
                          </div>
                        </>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </form>
        </div>
        <>
          {generalData.variants.map((variantVal: any, variantIndex: number) => {
            return variantVal.isSelected ? (
              <>
                <div className="separator"></div>
                <div className="card-body">
                  <div className="row row-cols-1 row-cols-md-2">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label
                          htmlFor=""
                          className="mb-3 fs-16 fw-500 required"
                        >
                          {variantVal.title}
                        </label>
                        <CreatableSelectWhite
                          getOptionLabel={(option: any) => {
                            return <>{option.title}</>;
                          }}
                          inputValue={variantVal.inputValue}
                          placeholder="Type here..."
                          // defaultValue={generalData.variant.Flavour.selectors}
                          options={variantVal.categories[0].options}
                          isMulti={true}
                          onCreateOption={(event: any) => {
                            handleMultiSelect(event, variantIndex);
                          }}
                          border={
                            generalDataValidation.selectedVariants[variantIndex]
                              ? '#e55451 !important'
                              : '#e0e0df'
                          }
                          onChange={(newValue: any) =>
                            handleMultiSelectChange(newValue, variantIndex)
                          }
                          onInputChange={(newValue: any) =>
                            handleInputChange(newValue, variantIndex)
                          }
                          value={
                            variantVal.categories[0].options &&
                            variantVal.categories[0].options.map(
                              (optionVal: any, optionIndex: number) => {
                                return {
                                  title: optionVal.title,
                                  label: optionVal.title,
                                  value: optionVal.title,
                                  _id: optionVal._id,
                                };
                              }
                            )
                          }
                          indicatorDisplay="none"
                          display="none"
                          menuIsOpen={false}
                          onKeyDown={(event: any, newValue: any) =>
                            handleKeyDown(event, variantIndex)
                          }
                        />
                      </div>
                    </div>{' '}
                    {variantVal.categories[0].note &&
                    variantVal.categories[0].note !== '' ? (
                      <Col lg={12}>
                        <span className="fs-14 fw-600 text-italic text-gray">
                          Note: {variantVal.categories[0].note}
                        </span>
                      </Col>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            );
          })}
        </>
      </div>
    </>
  );
};
export default General;
