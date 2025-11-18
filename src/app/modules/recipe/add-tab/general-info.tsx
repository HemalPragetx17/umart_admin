import { Col, Form, Row } from 'react-bootstrap';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import clsx from 'clsx';
import UploadImgWhite from '../../../../umart_admin/assets/media/svg_uMart/upload-img-white.svg';
import RecipeEditor from '../recipe-editor';
import { fileValidation } from '../../../../Global/fileValidation';
import CloseSvg from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import { foodTypeJSON, servingJSON } from '../../../../utils/staticJSON';
import { CreatableSelectWhite } from '../../../custom/Select/CreatableSelectWhite';
import { useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import { recipeEndpoints } from '../../../../api/apiEndPoints';
const GeneralInfo = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [recipeTypeOptions, setRecipeTypeOption] = useState<any>([]);
  const fetchRecipeTypesList = async (category: any) => {
    setLoading(true);
    const apiCallService = new APICallService(recipeEndpoints.recipeTypesList, {
      'categories[0]': category,
    });
    const response = await apiCallService.callAPI();
    if (response) {
      const temp = response.map((item: any) => {
        return {
          title: item || '',
          label: item || '',
          value: item || '',
        };
      });
      setRecipeTypeOption(temp);
    }
    setLoading(false);
  };
  const handleRecipeChange = (data: any) => {
    props.setRecipeSteps(data);
  };
  const handleImageRemove = (index: any) => {
    const temp = { ...props.recipeData };
    temp.media.splice(index, 1);
    props.handleRecipeData(temp);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const tempData = { ...props.recipeData };
    // const tempValidation = { ...validation };
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    const data: any = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      if (fileValidation(selectedFiles?.[i])) {
        const image = URL.createObjectURL(selectedFiles?.[i]);
        const imageReader = selectedFiles?.[i];
        // tempValidation.image = false;
        data.push({
          image: image,
          imageReader: imageReader,
        });
        props.handleImageChange(data);
      }
    }
    // setBannerData(tempData);
  };
  const handleCreate = (inputValue: any) => {
    const newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue,
      title: inputValue,
    };
    setRecipeTypeOption([...recipeTypeOptions, newOption]);
    props.handleChange(
      [...props?.recipeData?.recipeType, newOption],
      'recipeType'
    );
  };
  const handleOnKeyPress = (event: any, name: string) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (name === 'cookTime') {
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        event.preventDefault();
        return false;
      }
    }
    // else if (name === 'skuNumber') {
    //   if (
    //     ((charCode < 48 || charCode > 57) &&
    //       (charCode < 65 || charCode > 90) &&
    //       (charCode < 97 || charCode > 122)) ||
    //     charCode === 61
    //   ) {
    //     event.preventDefault();
    //     return false;
    //   }
    // }
    return true;
  };
  const handleSubCategoryChange = async (event: any) => {
    props.handleChange(event.value, 'subCategory');
    await fetchRecipeTypesList(event.value);
  };
  return (
    <>
      <div className="card bg-light pt-2 mb-6 mb-xl-9 border">
        <div className="card-header border-0">
          <div className="card-title">
            <h2 className="fs-22 fw-bolder">Recipe category</h2>
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Category
                  </label>
                </Col>
                <Col lg={8}>
                  <input
                    type="text"
                    className={clsx(
                      'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600'
                      // generalDataValidation.productTitle ? 'border-danger' : ''
                    )}
                    name="name"
                    disabled={true}
                    value={props?.recipeData?.category?.title}
                    placeholder="Type here…"
                    onChange={(event: any) => {
                      // handleChange(
                      //   event.target.value.trimStart(),
                      //   'productTitle'
                      // );
                    }}
                  />
                </Col>
              </Row>
            </Col>
            {/* {generalData.defaultSubCategory.length ? ( */}
            <Col
              lg={6}
              className="mb-5"
            >
              <Row className="align-items-center">
                <Col lg={4}>
                  <label
                    htmlFor=""
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Sub Category
                  </label>
                </Col>
                <Col lg={8}>
                  <CustomSelectWhite
                    border={
                      // clsx()
                      props?.validations?.subCategory ? '#e55451' : ''
                    }
                    onChange={handleSubCategoryChange}
                    options={props?.initData?.categories || []}
                    isMulti={false}
                    value={props?.initData?.categories.find(
                      (item: any) =>
                        item.value === props?.recipeData?.subCategory
                    )}
                    placeholder="Select sub category"
                  />
                </Col>
              </Row>
            </Col>
            {/* ) : (
              <></>
            )} */}
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Title
                  </label>
                </Col>
                <Col lg={10}>
                  <input
                    type="text"
                    className={clsx(
                      'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                      props?.validations?.title ? 'border-danger' : ''
                    )}
                    name="name"
                    value={props?.recipeData?.title}
                    placeholder="Enter title"
                    onChange={(event: any) => {
                      props.handleChange(
                        event.target.value.trimStart(),
                        'title'
                      );
                    }}
                  />
                  {props?.validations?.title ? (
                    <div className="text-danger fs-14 mt-1">
                      Title is required and should not exceed 200 characters.
                    </div>
                  ) : (
                    <></>
                  )}
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
                        className="fs-16 fw-400 mb-lg-0 mb-3 required"
                      >
                        Servings
                      </label>
                    </Col>
                    <Col lg={8}>
                      <CustomSelectWhite
                        border={
                          // clsx()
                          props?.validations?.serving ? '#e55451' : ''
                        }
                        onChange={(event: any) => {
                          props.handleChange(event.value + '', 'serving');
                        }}
                        options={props?.initData?.serving || []}
                        isMulti={false}
                        value={servingJSON.find(
                          (item: any) =>
                            item.value == props?.recipeData?.serving
                        )}
                        placeholder="Select servings"
                        // handleKeyDown={handleKeyDownSelect}
                        // value={generalData.currentBrand}
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
                        className="fs-16 fw-400 mb-lg-0 mb-3 required"
                      >
                        Cook time
                      </label>
                    </Col>
                    <Col lg={8}>
                      <div className="input-group input-group-solid h-60px border">
                        <input
                          type="text"
                          className={clsx(
                            'form-control form-control-lg bg-white text-black fs-16 fw-600 ps-4',
                            props.validations.cookTime
                              ? 'border-danger border-right-0'
                              : 'border-0 '
                          )}
                          placeholder="Enter cook time"
                          value={props?.recipeData?.cookTime || ''}
                          onChange={(event: any) => {
                            props.handleChange(
                              event.target.value.trimStart(),
                              'cookTime'
                            );
                          }}
                          onKeyPress={(event: any) => {
                            handleOnKeyPress(event, 'cookTime');
                          }}
                        />
                        <span
                          className={clsx(
                            'input-group-text fs-16 fw-500 text-dark bg-white p-0 pe-3',
                            props.validations.cookTime
                              ? 'border-danger border-left-0'
                              : 'border-0 '
                          )}
                          id="basic-addon1"
                        >
                          Mins
                        </span>
                      </div>
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Description
                  </label>
                </Col>
                <Col lg={10}>
                  <Form.Control
                    className={clsx(
                      'form-control-custom border bg-white',
                      props?.validations?.description ? 'border-danger' : ''
                    )}
                    placeholder="Enter description"
                    as="textarea"
                    rows={5}
                    value={props?.recipeData?.description}
                    onChange={(event: any) => {
                      props.handleChange(
                        event.target.value.trimStart(),
                        'description'
                      );
                    }}
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Recipe Type
                  </label>
                </Col>
                <Col lg={8}>
                  <CreatableSelectWhite
                    border={
                      // clsx()
                      props?.validations?.recipeType ? '#e55451' : ''
                    }
                    options={recipeTypeOptions}
                    onChange={(event: any) => {
                      props.handleChange(event, 'recipeType');
                    }}
                    value={props?.recipeData?.recipeType || []}
                    isMulti={true}
                    onCreateOption={handleCreate}
                    placeholder="Select recipe type"
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Food Type
                  </label>
                </Col>
                <Col lg={8}>
                  <CustomSelectWhite
                    border={
                      // clsx()
                      props?.validations?.foodType ? '#e55451' : ''
                    }
                    options={foodTypeJSON}
                    onChange={(event: any) => {
                      props.handleChange(event.value + '', 'foodType');
                    }}
                    value={foodTypeJSON.find(
                      (item: any) => item.value == props?.recipeData?.foodType
                    )}
                    isMulti={false}
                    placeholder="Select food type"
                  />
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Recipe
                  </label>
                </Col>
                <Col lg={10}>
                  {/* <Form.Control
                    className={clsx(
                      'form-control-custom border bg-white'
                      // generalDataValidation.description ? 'border-danger' : ''
                    )}
                    placeholder="Type here…"
                    as="textarea"
                    rows={8}
                    // value={generalData?.description}
                    onChange={(event: any) => {
                      // handleChange(
                      //   event.target.value.trimStart(),
                      //   'description'
                      // );
                    }}
                  /> */}
                  <RecipeEditor
                    data={props?.recipeSteps || ''}
                    handleDataChange={handleRecipeChange}
                    validations={props.validations}
                  />
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
                    className="fs-16 fw-400 mb-lg-0 mb-3 required"
                  >
                    Images
                  </label>
                </Col>
                <Col lg={10}>
                  <div className="d-flex flex-wrap flex-row flex-start gap-lg-6 gap-4">
                    <div
                      className={clsx(
                        'upload-btn-wrapper',
                        props?.validations?.media ? 'border border-danger' : ''
                      )}
                    >
                      {
                        //props.validations
                      }{' '}
                      <div className="symbol symbol-125px symbol-md-170px">
                        <img
                          src={UploadImgWhite}
                          alt=""
                        />
                      </div>
                      <input
                        className="w-100 h-100"
                        type="file"
                        name="myfile"
                        multiple
                        accept="image/png, image/jpeg"
                        // id={val.title}
                        onChange={(event) => {
                          handleImageChange(event);
                        }}
                        // disabled={props.loading}
                      />
                    </div>
                    {props?.recipeData.media.map(
                      (imageVal: any, index: number) =>
                        imageVal?.image && imageVal?.imageReader ? (
                          <div>
                            <div
                              className="position-relative"
                              draggable={true}
                              // id={imageVal.id}
                              // onDragOver={(ev) => ev.preventDefault()}
                              // onDragStart={handleDrag}
                              // onDrop={(event) => {
                              //   handleDrop(event, index, imageIndex);
                              // }}
                            >
                              <div className="symbol symbol-125px symbol-md-168px bg-body">
                                <img
                                  className="img-fluid p-2 object-fit-contain"
                                  src={imageVal.image}
                                  alt=""
                                />
                              </div>
                              {!props.loading ? (
                                <img
                                  className="img-fluid close-top-2"
                                  src={CloseSvg}
                                  alt=""
                                  onClick={() => {
                                    handleImageRemove(index);
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default GeneralInfo;
