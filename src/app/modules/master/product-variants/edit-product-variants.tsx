import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreatableSelectTable } from '../../../custom/Select/CreatableSelectTable';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { ProductVariant, Skip, SuggestOptions, TextGuide } from '../../../../utils/constants';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import clsx from 'clsx';
import { variantsJSON } from '../../../../api/apiJSON/master';
const EditProductVariant = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [category, setCategory] = useState<any>([]);
  const [categoryValidations, setCategoryValidations] = useState<any>([]);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const option = [
    {
      value: Skip,
      name: 'SkipNoNeed',
      label: (
        <>
          <span className="fs-16 fw-600">Skip (Not needed)</span>
        </>
      ),
    },
    {
      value: SuggestOptions,
      name: 'SuggestOptions',
      label: (
        <>
          <span className="fs-16 fw-600">Suggest options</span>
        </>
      ),
    },
    {
      value: TextGuide,
      name: 'TextGuide',
      label: (
        <>
          <span className="fs-16 fw-600">Text guide</span>
        </>
      ),
    },
  ];
  const [variant, setVariant] = useState<{
    title: string;
  }>({
    title: '',
  });
  const [validation, setValidation] = useState<{
    title: boolean;
  }>({
    title: false,
  });
  useEffect(() => {
    (async () => {
      if (!state) {
        return window.history.back();
      }
      await fetchTabs();
    })();
  }, []);
  const fetchTabs = async () => {
    setFetchLoader(true);
    let apiService = new APICallService(
      master.variantInfo,
      { viewType: 2 },
      { id: state?.id },
      '',
      false,
      '',
      ProductVariant
    );
    let response = await apiService.callAPI();
    if (response.categories) {
      let data: any = [];
      let validationData: any = [];
      await response.categories.map((val: any) => {
        let catTemp: any = {};
        let catValidationTemp: any = {};
        if (val.categories.length) {
          let subTemp: any = [];
          let subValidationTemp: any = [];
          val.categories.map((subVal: any) => {
            if (subVal.variant) {
              subTemp.push({
                category: subVal._id,
                name: subVal.title,
                image: subVal.image,
                definedBy: subVal.variant.definedBy,
                options: subVal.variant.options,
                note: subVal.variant.note,
              });
            } else {
              subTemp.push({
                category: subVal._id,
                name: subVal.title,
                image: subVal.image,
                definedBy: -1,
                options: [],
                note: '',
              });
            }
            subValidationTemp.push({
              note: false,
              options: false,
            });
          });
          catTemp = {
            category: val._id,
            name: val.title,
            image: val.image,
            categories: subTemp,
          };
          catValidationTemp = {
            categories: subValidationTemp,
          };
          validationData.push(catValidationTemp);
          data.push(catTemp);
        }
      });
      setCategoryValidations(validationData);
      const index = data.findIndex((item: any) => {
        return item.category === state.catId;
      });
      if (index != -1) {
        setActive(index);
      }
      setCategory(data);
    }
    setVariant({ title: response.title });
    setFetchLoader(false);
  };
  const handleVariantName = (value: any) => {
    let temp = { ...variant };
    let validateTemp = { ...validation };
    temp.title = value;
    if (value.length > 0) {
      validateTemp.title = false;
      setDisabled(false);
    } else {
      validateTemp.title = true;
    }
    setVariant(temp);
    setValidation(validateTemp);
  };
  const handleCategorySelect = (
    event: any,
    activeIndex: number,
    index: number
  ) => {
    let temp = JSON.parse(JSON.stringify([...category]));
    let categoryValidationsTemp = [...categoryValidations];
    if (event.value === TextGuide) {
      temp[activeIndex]['categories'][index].options = [];
      categoryValidationsTemp[activeIndex]['categories'][index].options = false;
      setDisabled(false);
    } else if (event.value === SuggestOptions) {
      temp[activeIndex]['categories'][index].note = '';
      categoryValidationsTemp[activeIndex]['categories'][index].note = false;
      setDisabled(false);
    } else {
      temp[activeIndex]['categories'][index].note = '';
      temp[activeIndex]['categories'][index].options = [];
      categoryValidationsTemp[activeIndex]['categories'][index].options = false;
      categoryValidationsTemp[activeIndex]['categories'][index].note = false;
      setDisabled(false);
    }
    temp[activeIndex]['categories'][index].definedBy = event.value;
    setCategoryValidations(categoryValidationsTemp);
    setCategory(temp);
  };
  const createOption = (label: string) => ({
    label,
    value: label,
    title: label,
  });
  const handleMultiSelect = (
    inputValue: string,
    activeIndex: number,
    index: number
  ) => {
    let temp = JSON.parse(JSON.stringify([...category]));
    let categoryValidationsTemp = [...categoryValidations];
    const newOption = createOption(inputValue);
    let optionTemp = [
      ...temp[activeIndex]['categories'][index].options,
      newOption,
    ];
    temp[activeIndex]['categories'][index].options = optionTemp;
    setCategoryValidations(categoryValidationsTemp);
    setCategory(temp);
  };
  const handleInputChange = (
    inputValue: string,
    activeIndex: number,
    index: number
  ) => {
    let temp = JSON.parse(JSON.stringify([...category]));
    let categoryValidationsTemp = [...categoryValidations];
    setCategoryValidations(categoryValidationsTemp);
    temp[activeIndex]['categories'][index].inputValue = inputValue;
    setCategory(temp);
  };
  const handleKeyDown = (event: any, activeIndex: number, index: number) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (event.target.value.trimStart().length > 0) {
          let temp = JSON.parse(JSON.stringify([...category]));
          const newOption = createOption(event.target.value.trimStart());
          temp[activeIndex]['categories'][index].options = [
            ...temp[activeIndex]['categories'][index].options,
            newOption,
          ];
          let validationTemp = [...categoryValidations];
          if (temp[activeIndex]['categories'][index].options.length > 0) {
            validationTemp[activeIndex]['categories'][index].options = false;
          } else {
            validationTemp[activeIndex]['categories'][index].options = true;
          }
          temp[activeIndex]['categories'][index].inputValue = '';
          setCategory(temp);
          setCategoryValidations(validationTemp);
          setDisabled(false);
        }
        event.preventDefault();
    }
  };
  const handleMultiSelectChange = (
    inputValue: string,
    activeIndex: number,
    index: number
  ) => {
    let temp = JSON.parse(JSON.stringify([...category]));
    let categoryValidationsTemp = [...categoryValidations];
    temp[activeIndex]['categories'][index].options = inputValue;
    if (inputValue.length > 0) {
      categoryValidationsTemp[activeIndex]['categories'][index].options = false;
    } else {
      categoryValidationsTemp[activeIndex]['categories'][index].options = true;
    }
    setCategoryValidations(categoryValidationsTemp);
    setCategory(temp);
  };
  const handleCategoryChange = (
    value: any,
    activeIndex: number,
    index: number
  ) => {
    let temp = JSON.parse(JSON.stringify([...category]));
    let categoryValidationsTemp = [...categoryValidations];
    categoryValidationsTemp[activeIndex]['categories'][index].note = true;
    if (value.length > 0) {
      categoryValidationsTemp[activeIndex]['categories'][index].note = false;
      setDisabled(false);
    }
    setCategoryValidations(categoryValidationsTemp);
    temp[activeIndex]['categories'][index].note = value;
    setCategory(temp);
  };
  const handleSaveVariants = async () => {
    let temp = { ...variant };
    let validateTemp = { ...validation };
    Validations();
    setLoading(true);
    if (!temp.title) {
      validateTemp.title = true;
    } else {
      let result = checkValidations();
      if (result) {
        let data: any = {
          title: temp.title,
          categories: [],
        };
        category.map((catVal: any) => {
          let temp: any = [];
          catVal.categories.map((val: any) => {
            if (val.definedBy === SuggestOptions) {
              if (val.options.length) {
                delete val.note;
                temp.push(val);
              }
            } else if (val.definedBy === TextGuide) {
              if (val.note.length) {
                delete val.options;
                temp.push(val);
              }
            }
          });
          if (temp.length) {
            data.categories.push({
              category: catVal.category,
              categories: temp,
            });
          }
        });
        let apiService = new APICallService(
          master.editVariants,
          variantsJSON.addVariants({
            variants: data,
          }),
          { id: state?.id },
          '',
          false,
          '',
          ProductVariant
        );
        let response = await apiService.callAPI();
        if (response) {
          navigate('/master/product-variants');
          success(masterToast.editVariant);
        }
      }
    }
    setLoading(false);
    setValidation(validateTemp);
  };
  const checkValidations = () => {
    let categoryValidationsTemp = [...categoryValidations];
    let temp = [...category];
    let result = temp.every((val: any, index: number) => {
      return val.categories.every((catVal: any, idx: number) => {
        if (catVal.definedBy === -1 || catVal.definedBy === Skip) {
          return (
            categoryValidationsTemp[index]['categories'][idx].note === false ||
            categoryValidationsTemp[index]['categories'][idx].options === false
          );
        } else {
          if (catVal.definedBy === SuggestOptions) {
            return (
              categoryValidationsTemp[index]['categories'][idx].options ===
              false
            );
          } else if (catVal.definedBy === TextGuide) {
            return (
              categoryValidationsTemp[index]['categories'][idx].note === false
            );
          }
        }
      });
    });
    return result;
  };
  const Validations = () => {
    let categoryValidationsTemp = [...categoryValidations];
    let temp = [...category];
    temp.map((val: any, index: number) => {
      val.categories.map((catVal: any, idx: number) => {
        if (catVal.definedBy === -1) {
          categoryValidationsTemp[index]['categories'][idx].note = false;
          categoryValidationsTemp[index]['categories'][idx].options = false;
        } else {
          if (catVal.definedBy === SuggestOptions) {
            categoryValidationsTemp[index]['categories'][idx].options = true;
            if (catVal.options.length) {
              categoryValidationsTemp[index]['categories'][idx].options = false;
            }
          } else if (catVal.definedBy === TextGuide) {
            categoryValidationsTemp[index]['categories'][idx].note = true;
            if (catVal.note.length) {
              categoryValidationsTemp[index]['categories'][idx].note = false;
            }
          }
        }
      });
    });
    setCategoryValidations(categoryValidationsTemp);
  };
  useEffect(() => {
    let temp = [...category];
    if (temp.length > 0) {
      let data = temp.map((val: any, index: number) => {
        return val.categories.some((e: any) => {
          return e.options.length > 0 || e.note !== '';
        });
      });
      let result = data.some((el) => el === true);
      //setDisabled(!result);
    }
  }, [category]);
  const customSelectBlue = {
    control: (base: any, state: any) => ({
      ...base,
      background: '#023950',
    }),
  };
  const handleActive = (event: any) => {
    setActive(event);
  };
  return (
    <>
      {/* ADD VARIANT */}
      {fetchLoader ? (
        <Row>
          <Col
            lg={12}
            className="mb-6"
          >
            <h1 className="fs-22 fw-bolder">Edit variant</h1>
          </Col>
          <>
            <div className="d-flex justify-content-center">
              <Loader loading={fetchLoader} />
            </div>
          </>
        </Row>
      ) : category.length ? (
        <>
          <Row>
            <Col
              lg={12}
              className="mb-6"
            >
              <h1 className="fs-22 fw-bolder">Edit variant</h1>
            </Col>
            <Col
              lg={12}
              className="mb-8"
            >
              <div className="custom-form border border-r10px bg-light p-6 py-9">
                <Row className="align-items-center">
                  <Col md="auto">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Variant name
                    </label>
                  </Col>
                  <Col md={6}>
                    <input
                      type="text"
                      className={clsx(
                        'form-control form-control-custom form-control-lg bg-white',
                        validation.title ? 'border-danger' : ''
                      )}
                      id="exampleFormControlInput1"
                      placeholder=""
                      value={variant.title}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => handleVariantName(e.target.value.trimStart())}
                    />
                    {validation.title ? (
                      <label className="form-label text-danger mt-2">
                        Please enter variant name
                      </label>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              className="mb-4"
            >
              <h2 className="fs-22 fw-bolder">
                Link this variant to categories
              </h2>
            </Col>{' '}
            <Col
              lg={12}
              className="custom-tabContainer"
            >
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={active}
              >
                <Row className="variant-categories">
                  <Col
                    lg={'auto'}
                    className="mb-9"
                  >
                    <div className="bg-light border-r8px p-3 px-md-6">
                      <Nav variant="pills">
                        {category.map((catVal: any, index: number) => {
                          return (
                            <Nav.Item key={catVal._id}>
                              <Nav.Link
                                className={clsx(
                                  categoryValidations[index] &&
                                    categoryValidations[index].categories.some(
                                      (e: any) => {
                                        return (
                                          e.note === true || e.options == true
                                        );
                                      }
                                    )
                                    ? 'error'
                                    : '',
                                  category[index].categories.some((e: any) => {
                                    if (e.definedBy === SuggestOptions) {
                                      return e.options.length > 0;
                                    } else if (e.definedBy === TextGuide) {
                                      return e.note !== '';
                                    }
                                  })
                                    ? 'check-after'
                                    : ''
                                )}
                                eventKey={index}
                                onClick={() => {
                                  handleActive(index);
                                }}
                              >
                                {catVal.name}
                              </Nav.Link>
                            </Nav.Item>
                          );
                        })}
                      </Nav>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <Tab.Content>
                      {/*TAB-1*/}
                      <Tab.Pane
                        eventKey={active}
                        active={true}
                      >
                        <Card className="biz-certificate mb-5">
                          <Card.Body className="pb-1 overflow-hidden">
                            <div className="table-responsive">
                              <table className="table align-middle gs-0 gy-4">
                                <thead>
                                  <tr className="fs-16 fw-600 align-middle h-55px">
                                    <th className="p-0 min-w-175px">
                                      Category
                                    </th>
                                    <th className="p-0 min-w-215px">
                                      Text guide / Suggest options
                                    </th>
                                    <th className="p-0 min-w-lg-500px min-w-300px"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {category[active].categories.map(
                                    (subVal: any, index: any) => {
                                      return (
                                        <tr key={subVal._id}>
                                          <td>
                                            <div className="d-inline-flex align-items-center">
                                              <div className="symbol symbol-40px border border-r10px me-3">
                                                <span className="symbol-label border-r10px bg-white">
                                                  <img
                                                    src={subVal.image}
                                                    className="img-fluid align-self-center"
                                                    alt=""
                                                  />
                                                </span>
                                              </div>
                                              <span className="fs-15 fw-600">
                                                {subVal.name}
                                              </span>
                                            </div>
                                          </td>
                                          <td>
                                            <CustomSelectTable2
                                              backgroundColor={'#f9f9f9'}
                                              options={option}
                                              onChange={(e: any) => {
                                                handleCategorySelect(
                                                  e,
                                                  active,
                                                  index
                                                );
                                              }}
                                              value={option.map(
                                                (optionVal: any) => {
                                                  return optionVal.value ===
                                                    subVal.definedBy
                                                    ? optionVal
                                                    : false;
                                                }
                                              )}
                                              isMulti={false}
                                            />
                                          </td>
                                          <td>
                                            <></>
                                            {subVal.definedBy === TextGuide ? (
                                              <div className="border-r5px">
                                                <input
                                                  type="text"
                                                  className={clsx(
                                                    'form-control form-control-custom px-3 min-h-45px bg-white fs-15 fw-600',
                                                    categoryValidations[active]
                                                      .categories[index]['note']
                                                      ? 'border-danger'
                                                      : ''
                                                  )}
                                                  id="exampleFormControlInput1"
                                                  placeholder="Type here..."
                                                  value={subVal.note}
                                                  onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                  ): void =>
                                                    handleCategoryChange(
                                                      e.target.value.trimStart(),
                                                      active,
                                                      index
                                                    )
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <></>
                                            )}
                                            {subVal.definedBy ===
                                            SuggestOptions ? (
                                              <CreatableSelectTable
                                                getOptionLabel={(
                                                  option: any
                                                ) => {
                                                  return <>{option.title}</>;
                                                }}
                                                inputValue={subVal.inputValue}
                                                placeholder="Type here..."
                                                // defaultValue={generalData.variant.Flavour.selectors}
                                                options={subVal.options}
                                                isMulti={true}
                                                onCreateOption={(
                                                  event: any
                                                ) => {
                                                  handleMultiSelect(
                                                    event,
                                                    active,
                                                    index
                                                  );
                                                }}
                                                border={
                                                  categoryValidations[active]
                                                    .categories[index][
                                                    'options'
                                                  ]
                                                    ? '#e55451'
                                                    : '#e0e0df'
                                                }
                                                onChange={(newValue: any) =>
                                                  handleMultiSelectChange(
                                                    newValue,
                                                    active,
                                                    index
                                                  )
                                                }
                                                onInputChange={(
                                                  newValue: any
                                                ) =>
                                                  handleInputChange(
                                                    newValue,
                                                    active,
                                                    index
                                                  )
                                                }
                                                value={
                                                  subVal.options &&
                                                  subVal.options.map(
                                                    (
                                                      optionVal: any,
                                                      optionIndex: number
                                                    ) => {
                                                      return {
                                                        title: optionVal.title,
                                                        label: optionVal.title,
                                                        value: optionVal.title,
                                                      };
                                                    }
                                                  )
                                                }
                                                indicatorDisplay="none"
                                                display="none"
                                                menuIsOpen={false}
                                                onKeyDown={(
                                                  event: any,
                                                  newValue: any
                                                ) =>
                                                  handleKeyDown(
                                                    event,
                                                    active,
                                                    index
                                                  )
                                                }
                                              />
                                            ) : (
                                              <></>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Col>
          </Row>
          <Row className="justify-content-end justify-content-md-start g-3">
            <Col xs="auto">
              <Button
                variant="danger"
                size="lg"
                className="btn-active-danger"
                onClick={() => navigate('/master/product-variants')}
              >
                {' '}
                Cancel
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                size="lg"
                disabled={disabled || loading}
                onClick={handleSaveVariants}
              >
                {!loading && (
                  <span className="indicator-label fs-16 fw-bold">
                    Save variant
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
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default EditProductVariant;
