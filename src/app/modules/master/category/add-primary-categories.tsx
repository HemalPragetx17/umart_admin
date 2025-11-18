import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UploadImage from '../.../../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import { fileValidation } from '../../../../Global/fileValidation';
import { success } from '../../../../Global/toast';
import cross from '../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import Close from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import { masterToast } from '../../../../utils/toast';
import { CategoryString, String } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { categoryJSON } from '../../../../api/apiJSON/master';
import { master } from '../../../../api/apiEndPoints';
import Method from '../../../../utils/methods';
import { useAuth } from '../../auth';
import { Add, Category } from '../../../../utils/constants';
const AddPrimaryCategory: FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [primaryCategory, setPrimaryCategory] = useState<
    {
      categoryName: string;
      categoryImage: string;
      categoryImageReader: any;
      isTobacco: boolean;
    }[]
  >([
    {
      categoryName: '',
      categoryImage: '',
      categoryImageReader: '',
      isTobacco: false,
    },
  ]);
  const [validation, setValidation] = useState<
    {
      categoryName: boolean;
      categoryImage: boolean;
    }[]
  >([
    {
      categoryName: false,
      categoryImage: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (() => {
      if (!Method.hasPermission(Category, Add, currentUser)) {
        return window.history.back();
      }
    })();
  }, []);
  const handleAddMore = () => {
    if (!loading) {
      let temp = [...primaryCategory];
      let validateTemp = [...validation];
      let length = temp.length - 1;
      if (!temp[length].categoryName && !temp[length].categoryImage) {
        validateTemp[length].categoryName = true;
        validateTemp[length].categoryImage = true;
      } else if (!temp[length].categoryName) {
        validateTemp[length].categoryName = true;
      } else if (!temp[length].categoryImage) {
        validateTemp[length].categoryImage = true;
      } else {
        const allTrue = validateTemp.every(
          (obj) => obj.categoryName === false && obj.categoryImage === false
        );
        if (allTrue) {
          validateTemp.push({
            categoryName: false,
            categoryImage: false,
          });
          temp.push({
            categoryName: '',
            categoryImage: '',
            categoryImageReader: '',
            isTobacco: false,
          });
          setPrimaryCategory(temp);
        }
      }
      setValidation(validateTemp);
    }
  };
  const handleRemove = async (e: any, index: any) => {
    let temp = [...primaryCategory];
    let validateTemp = [...validation];
    validateTemp.splice(index, 1);
    temp.splice(index, 1);
    setValidation(validateTemp);
    setPrimaryCategory(temp);
  };
  const handleCategoryName = (value: any, index: any) => {
    let temp = [...primaryCategory];
    let validateTemp = [...validation];
    temp[index].categoryName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp[index].categoryName = false;
    }
    if (value.trimStart().length === 0 || value.trimStart().length > 50) {
      validateTemp[index].categoryName = true;
    }
    setPrimaryCategory(temp);
    setValidation(validateTemp);
  };
  const handleCheckBox = (value: boolean, index: any) => {
    let temp = [...primaryCategory];
    temp[index].isTobacco = value;
    setPrimaryCategory(temp);
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    const selectedFiles = event.target.files;
    let temp = [...primaryCategory];
    let validateTemp = [...validation];
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        validateTemp[index].categoryImage = false;
        temp[index].categoryImage = URL.createObjectURL(selectedFiles?.[0]);
        temp[index].categoryImageReader = selectedFiles?.[0];
        event.target.value = '';
        setPrimaryCategory(temp);
      }
    }
    setValidation(validateTemp);
  };
  const handleImageDiscard = (index: any) => {
    let temp = [...primaryCategory];
    let validateTemp = [...validation];
    validateTemp[index].categoryImage = true;
    temp[index].categoryImage = '';
    temp[index].categoryImageReader = {};
    setPrimaryCategory(temp);
    setValidation(validateTemp);
  };
  const handleSaveCategory = async () => {
    let temp = [...primaryCategory];
    let validateTemp = [...validation];
    let length = temp.length - 1;
    if (!temp[length].categoryName && !temp[length].categoryImage) {
      validateTemp[length].categoryName = true;
      validateTemp[length].categoryImage = true;
    } else if (
      !temp[length].categoryName ||
      temp[length].categoryName.trimStart().length > 50
    ) {
      validateTemp[length].categoryName = true;
    } else if (!temp[length].categoryImage) {
      validateTemp[length].categoryImage = true;
    } else {
      const allTrue = validateTemp.every(
        (obj) => obj.categoryName === false && obj.categoryImage === false
      );
      if (allTrue) {
        setLoading(true);
        let apiService = new APICallService(
          master.addCategory,
          categoryJSON.addPrimaryCategory({ primaryCategory: primaryCategory }),
          '',
          false,
          '',
          '',
          Category
        );
        let response = await apiService.callAPI();
        if (response) {
          success(masterToast.addPrimaryCategory);
          navigate('/master/categories');
        }
      }
    }
    setValidation(validateTemp);
    setLoading(false);
  };
  
  return (
    <>
      {Method.hasPermission(Category, Add, currentUser) ? (
        <>
          <Row>
            <Col
              lg={12}
              className="mb-6"
            >
              <h1 className="fs-22 fw-bolder">Add primary category</h1>
            </Col>
            <Col>
              {primaryCategory.map((val, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="border border-r10px bg-light position-relative mb-6 p-9"
                    >
                      <Row>
                        <Col
                          lg={6}
                          className="mb-6"
                        >
                          <Row className="align-items-center">
                            <Col lg={4}>
                              <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required">
                                Primary category name
                              </label>
                            </Col>
                            <Col lg={8}>
                              <input
                                type="text"
                                className={clsx(
                                  'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                                  validation[index].categoryName
                                    ? 'border-danger'
                                    : 'border'
                                )}
                                name="name"
                                placeholder="Type here…"
                                disabled={loading}
                                value={val.categoryName}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void =>
                                  handleCategoryName(e.target.value, index)
                                }
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].categoryName
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
                              <div className="fs-16 fw-500 text-dark mb-lg-0 mb-3">
                                Is the category related to tobacco ?
                              </div>
                            </Col>
                            <Col
                              lg={8}
                              className="d-flex align-items-center"
                            >
                              <div className="d-flex align-items-center me-4">
                                <span>
                                  <input
                                    className="form-check-input pt-1 h-25px w-25px  me-1"
                                    type="radio"
                                    name={'isTobaccoNo' + index}
                                    id={'isTobaccoNo' + index}
                                    checked={!val.isTobacco}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ): void => handleCheckBox(false, index)}
                                  />
                                </span>
                                <label
                                  className="form-check-label fs-16 fw-500 text-dark ms-2"
                                  htmlFor={'isTobaccoNo' + index}
                                >
                                  {'No'}
                                </label>
                              </div>
                              <div className="d-flex align-items-center">
                                <span>
                                  <input
                                    className="form-check-input pt-1 h-25px w-25px  me-1"
                                    type="radio"
                                    name={'isTobaccoYes' + index}
                                    id={'isTobaccoYes' + index}
                                    checked={val.isTobacco}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ): void => handleCheckBox(true, index)}
                                  />
                                </span>
                                <label
                                  className="form-check-label fs-16 fw-500 text-dark ms-2"
                                  htmlFor={'isTobaccoYes' + index}
                                >
                                  {'Yes'}
                                </label>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {primaryCategory.length === 1 ? (
                        <></>
                      ) : !loading ? (
                        <div className="group-categories-cross">
                          <img
                            src={cross}
                            height={16}
                            width={16}
                            onClick={(e) => {
                              handleRemove(e, index);
                            }}
                            alt=""
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Row>
                        <Col lg={2}>
                          <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 mt-lg-3 required">
                            Upload category image
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
                                    'border border-r10px bg-white',
                                    validation[index].categoryImage
                                      ? 'border-danger'
                                      : ''
                                  )}
                                  src={
                                    val.categoryImage
                                      ? val.categoryImage
                                      : UploadImage
                                  }
                                  alt=""
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
                                  {validation[index].categoryImage
                                    ? 'Please upload category image'
                                    : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          {val.categoryImage && !loading ? (
                            <label
                              className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px responsive-closed"
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
                  </>
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
              + Add new category
            </Link>
            <Row className="align-items-center mt-6 g-3 ">
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="lg"
                  className="btn-active-danger"
                  onClick={() => {
                    navigate('/master/categories');
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-fit-content"
                  onClick={handleSaveCategory}
                  disabled={
                    loading ||
                    !validation.every(
                      (obj) =>
                        obj.categoryName === false &&
                        obj.categoryImage === false
                    )
                  }
                >
                  {!loading && (
                    <span className="indicator-label fs-16 fw-bold">
                      Save category
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
export default AddPrimaryCategory;
