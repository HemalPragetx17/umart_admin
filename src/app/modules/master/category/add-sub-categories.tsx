import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// Media <<
import clsx from 'clsx';
import UploadImage from '../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import { fileValidation } from '../../../../Global/fileValidation';
import { success } from '../../../../Global/toast';
import cross from '../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import Close from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import { masterToast } from '../../../../utils/toast';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { CategoryString, String } from '../../../../utils/string';
import { primaryCategoryOption } from '../../../../utils/dummyJSON';
import { master } from '../../../../api/apiEndPoints';
import { categoryJSON } from '../../../../api/apiJSON/master';
import APICallService from '../../../../api/apiCallService';
import { Add, Category, Master, PAGE_LIMIT } from '../../../../utils/constants';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
const AddSubCategories: FC = () => {
  const depth = 1;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [primaryCategory, setPrimaryCategory] = useState([]);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subCategory, setSubCategory] = useState<
    {
      subCategoryName: string;
      subCategoryImage: any;
      subCategoryImageReader: any;
      primaryCategory: string;
    }[]
  >([
    {
      subCategoryName: '',
      subCategoryImage: '',
      subCategoryImageReader: '',
      primaryCategory: '',
    },
  ]);
  const [validation, setValidation] = useState<
    {
      subCategoryName: boolean;
      subCategoryImage: boolean;
      primaryCategory: boolean;
    }[]
  >([
    {
      subCategoryName: false,
      subCategoryImage: false,
      primaryCategory: false,
    },
  ]);
  useEffect(() => {
    (async () => {
      if (!Method.hasPermission(Category, Add, currentUser)) {
        return window.history.back();
      }
      setFetchLoader(true);
      await fetchPrimaryCategory(page, PAGE_LIMIT, depth);
      setFetchLoader(false);
    })();
  }, []);
  const onMenuScrollToBottom = async () => {
    if (!(primaryCategory.length === totalRecords)) {
      setFetchLoader(true);
      let tempPage = page;
      tempPage = tempPage + 1;
      setPage(tempPage);
      await fetchPrimaryCategory(tempPage, PAGE_LIMIT, depth);
    }
    setFetchLoader(false);
  };
  const fetchPrimaryCategory = async (
    pageNo: number,
    limit: number,
    categoriesDepth: number
  ) => {
    let params = {
      needCount: pageNo === 1 ? true : false,
      categoriesDepth: categoriesDepth,
    };
    let apiService = new APICallService(master.categoryList, params
      ,'','',false,'',Category);
    let response = await apiService.callAPI();
    if (response) {
      let data: any = [...primaryCategory];
      if (pageNo === 1) {
        setTotalRecords(response.total);
      } else {
        let prevTotal = totalRecords;
        setTotalRecords(prevTotal);
      }
      response.records.map((val: any) => {
        data.push({
          value: val.title,
          name: val.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val.image}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">{val.title}</span>
            </>
          ),
          _id: val._id,
        });
      });
      setPrimaryCategory(data);
    }
  };
  const handleRemove = async (e: any, index: any) => {
    let temp = [...subCategory];
    let validateTemp = [...validation];
    validateTemp.splice(index, 1);
    temp.splice(index, 1);
    setValidation(validateTemp);
    setSubCategory(temp);
  };
  const handleSubCategoryName = (value: any, index: any) => {
    let temp = [...subCategory];
    let validateTemp = [...validation];
    temp[index].subCategoryName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp[index].subCategoryName = false;
    }
    if (value.trimStart().length === 0 || value.trimStart().length >= 50) {
      validateTemp[index].subCategoryName = true;
    }
    setSubCategory(temp);
    setValidation(validateTemp);
  };
  const handlePrimaryCategoryChange = (event: any, index: any) => {
    let temp = [...subCategory];
    let validateTemp = [...validation];
    temp[index].primaryCategory = event._id;
    validateTemp[index].primaryCategory = false;
    setSubCategory(temp);
    setValidation(validateTemp);
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    const selectedFiles = event.target.files;
    let temp = [...subCategory];
    let validateTemp = [...validation];
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        validateTemp[index].subCategoryImage = false;
        temp[index].subCategoryImage = URL.createObjectURL(selectedFiles?.[0]);
        temp[index].subCategoryImageReader = selectedFiles?.[0];
        event.target.value = '';
        setSubCategory(temp);
      }
    }
    setValidation(validateTemp);
  };
  const handleImageDiscard = (index: any) => {
    let temp = [...subCategory];
    let validateTemp = [...validation];
    validateTemp[index].subCategoryImage = true;
    temp[index].subCategoryImage = '';
    temp[index].subCategoryImageReader = {};
    setSubCategory(temp);
    setValidation(validateTemp);
  };
  const handleSaveSubCategory = async () => {
    let temp = [...subCategory];
    let validateTemp = [...validation];
    let length = temp.length - 1;
    if (
      !temp[length].subCategoryName &&
      !temp[length].subCategoryImage &&
      !temp[length].primaryCategory
    ) {
      validateTemp[length].subCategoryName = true;
      validateTemp[length].subCategoryImage = true;
      validateTemp[length].primaryCategory = true;
    }
    if (!temp[length].subCategoryName) {
      validateTemp[length].subCategoryName = true;
    }
    if (!temp[length].subCategoryImage) {
      validateTemp[length].subCategoryImage = true;
    }
    if (!temp[length].primaryCategory) {
      validateTemp[length].primaryCategory = true;
    }
    if (
      !validateTemp[length].subCategoryName &&
      !validateTemp[length].subCategoryImage &&
      !validateTemp[length].primaryCategory
    ) {
      let apiService = new APICallService(
        master.addSubCategory,
        categoryJSON.addSubCategory({ subCategory: subCategory }),
        '',
        '',
        false,
        '',
        Category
      );
      setLoading(true);
      let response = await apiService.callAPI();
      if (response) {
        success(masterToast.addSubCategory);
        navigate('/master/categories');
      }
      setLoading(false);
    }
    setValidation(validateTemp);
    setLoading(false);
  };
  const handleAddMore = () => {
    if (!loading) {
      let temp = [...subCategory];
      let validateTemp = [...validation];
      let length = temp.length - 1;
      if (
        !temp[length].subCategoryName &&
        !temp[length].subCategoryImage &&
        !temp[length].primaryCategory
      ) {
        validateTemp[length].subCategoryName = true;
        validateTemp[length].subCategoryImage = true;
        validateTemp[length].primaryCategory = true;
      } else if (!temp[length].subCategoryName) {
        validateTemp[length].subCategoryName = true;
      } else if (!temp[length].subCategoryImage) {
        validateTemp[length].subCategoryImage = true;
      } else if (!temp[length].primaryCategory) {
        validateTemp[length].primaryCategory = true;
      } else if (!temp[length].primaryCategory) {
        validateTemp[length].primaryCategory = true;
      } else {
        validateTemp.push({
          subCategoryName: false,
          subCategoryImage: false,
          primaryCategory: false,
        });
        temp.push({
          subCategoryName: '',
          subCategoryImage: '',
          subCategoryImageReader: '',
          primaryCategory: '',
        });
        setSubCategory(temp);
      }
      setValidation(validateTemp);
    }
  };
  return (
    <>
      {Method.hasPermission(Category, Add, currentUser) ? (
        <>
          <Row>
            <Col
              lg={12}
              className="mb-5"
            >
              <h1 className="fs-22 fw-bolder">{CategoryString.addTitle}</h1>
            </Col>
            <Col>
              {subCategory.map((val, index) => {
                return (
                  <Col
                    key={index}
                    lg={12}
                  >
                    <div className="border border-r10px bg-light position-relative mb-6 p-9">
                      <Row>
                        <Col
                          lg={6}
                          className="mb-6"
                        >
                          <Row className="align-items-center">
                            <Col lg={4}>
                              <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required">
                                {CategoryString.categoryName}
                              </label>
                            </Col>
                            <Col lg={8}>
                              <input
                                type="text"
                                className={clsx(
                                  'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                                  validation[index].subCategoryName
                                    ? 'border-danger'
                                    : ''
                                )}
                                name="name"
                                disabled={loading}
                                placeholder="Type here…"
                                value={val.subCategoryName}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void =>
                                  handleSubCategoryName(e.target.value, index)
                                }
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].subCategoryName
                                    ? 'Please enter valid category name'
                                    : ''}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          lg={6}
                          className="mb-6"
                        >
                          <Row className="align-items-center">
                            <Col lg={4}>
                              <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required">
                                {CategoryString.primaryCategory}
                              </label>
                            </Col>
                            <Col lg={8}>
                              <CustomSelectWhite
                                border={
                                  validation[index].primaryCategory
                                    ? '#e55451'
                                    : ''
                                }
                                disabled={loading}
                                isLoading={fetchLoader}
                                default={
                                  primaryCategoryOption[0]
                                    ? primaryCategoryOption[0]
                                    : []
                                }
                                options={primaryCategory.map((item: any) => {
                                  return {
                                    ...item,
                                    title: item.name,
                                  };
                                })}
                                loadingMessage={'Fetching Data'}
                                isMulti={false}
                                // onMenuScrollToBottom={onMenuScrollToBottom}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void =>
                                  handlePrimaryCategoryChange(e, index)
                                }
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].primaryCategory
                                    ? 'Please select primary category'
                                    : ''}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {subCategory.length === 1 ? (
                        <></>
                      ) : !loading ? (
                        <div className="sub-categories-cross">
                          <img
                            src={cross}
                            height={16}
                            width={16}
                            onClick={(e) => {
                              handleRemove(e, index);
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Row>
                        <Col lg={2}>
                          <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 mt-lg-3 required">
                            {CategoryString.uploadImage}
                          </label>
                        </Col>
                        <Col
                          lg={10}
                          className="d-flex"
                        >
                          <div className="d-flex flex-column">
                            <div className="upload-btn-wrapper">
                              <div className="symbol symbol-160px symbol-md-170px">
                                <img
                                  className={clsx(
                                    'border bg-white',
                                    validation[index].subCategoryImage
                                      ? 'border-danger'
                                      : ''
                                  )}
                                  src={
                                    val.subCategoryImage
                                      ? val.subCategoryImage
                                      : UploadImage
                                  }
                                  alt="image"
                                />
                              </div>
                              <input
                                className="w-100 h-100"
                                type="file"
                                name="myfile"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void => handleImageChange(e, index)}
                                disabled={loading}
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].subCategoryImage
                                    ? 'Please upload category image'
                                    : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          {val.subCategoryImage && !loading ? (
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px responsive-closed "
                              data-kt-image-input-action="change"
                              title=""
                            >
                              <img
                                src={Close}
                                onClick={(): void => handleImageDiscard(index)}
                                className="responsive-closed-icon-closed"
                                alt=""
                                height={33}
                                width={33}
                              />
                            </label>
                          ) : (
                            <></>
                          )}
                          <div className="d-flex flex-column ms-4 justify-content-end">
                            <span className="fs-14 fw-500 text-italic">
                              {CategoryString.imageNote1}
                            </span>
                            <span className="fs-14 fw-500 text-italic">
                              {CategoryString.imageNote2}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                );
              })}
            </Col>
          </Row>
          <div className="d-flex flex-column">
            <Link
              to="#"
              className="text-primary fs-16 fw-bolder"
              onClick={handleAddMore}
            >
              {CategoryString.addNewButton}
            </Link>
            <Row className="align-items-center mt-6 g-3 ">
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="lg"
                  className=" w-fit-content btn-active-danger"
                  onClick={() => {
                    navigate('/master/categories');
                  }}
                >
                  {CategoryString.cancel}
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-fit-content"
                  onClick={handleSaveSubCategory}
                  disabled={
                    loading ||
                    !validation.every(
                      (obj) =>
                        obj.subCategoryName === false &&
                        obj.subCategoryImage === false &&
                        obj.primaryCategory === false
                    )
                  }
                >
                  {!loading && (
                    <span className="indicator-label fs-16 fw-bold">
                      {CategoryString.save}
                    </span>
                  )}
                  {loading && (
                    <span
                      className="indicator-progress fs-16 fw-bold"
                      style={{ display: 'block' }}
                    >
                      {String.pleaseWait}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                  {/*  */}
                </Button>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default AddSubCategories;
