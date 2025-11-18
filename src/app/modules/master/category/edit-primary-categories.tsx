import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadImage from '../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import { fileValidation } from '../../../../Global/fileValidation';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import Close from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import { CategoryString, String } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { categoryJSON } from '../../../../api/apiJSON/master';
import { Category } from '../../../../utils/constants';
const EditPrimaryCategory: FC = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();  
  const [primaryCategory, setPrimaryCategory] = useState<{
    categoryName: string;
    categoryImage: string;
    categoryImageReader: any;
    isTobacco: boolean;
  }>({
    categoryName: state?.title || '',
    categoryImage: state?.image || '',
    categoryImageReader: state?.image || '',
    isTobacco: state?.isTobacco || false
  });
  const [validation, setValidation] = useState<{
    categoryName: boolean;
    categoryImage: boolean;
  }>({
    categoryName: false,
    categoryImage: false,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!state) {
      window.history.back();
    }
  }, []);
  const handleCategoryName = (value: any, index: any) => {
    let temp = { ...primaryCategory };
    let validateTemp = { ...validation };
    temp.categoryName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp.categoryName = false;
    }
    if (value.trimStart().length === 0 || value.trimStart().length > 50) {
      validateTemp.categoryName = true;
    }
    setPrimaryCategory(temp);
    setValidation(validateTemp);
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    const selectedFiles = event.target.files;
    let temp = { ...primaryCategory };
    let validateTemp = { ...validation };
    if (!selectedFiles) return;
    else {
      if (fileValidation(selectedFiles?.[0])) {
        validateTemp.categoryImage = false;
        temp.categoryImage = URL.createObjectURL(selectedFiles?.[0]);
        temp.categoryImageReader = selectedFiles?.[0];
        event.target.value = '';
        setPrimaryCategory(temp);
      }
    }
    setValidation(validateTemp);
  };
  const handleImageDiscard = (index: any) => {
    let temp = { ...primaryCategory };
    let validateTemp = { ...validation };
    validateTemp.categoryImage = true;
    temp.categoryImage = '';
    temp.categoryImageReader = {};
    setPrimaryCategory(temp);
    setValidation(validateTemp);
  };
  const handleCheckBox = (value: boolean) => {
    let temp = {...primaryCategory}
    temp.isTobacco = value;
    setPrimaryCategory(temp);
  };
  const handleSaveCategory = async () => {
    let temp = { ...primaryCategory };
    let validateTemp = { ...validation };
    if (!temp.categoryName && !temp.categoryImage) {
      validateTemp.categoryName = true;
      validateTemp.categoryImage = true;
    } else if (
      !temp.categoryName ||
      temp.categoryName.trimStart().length > 50
    ) {
      validateTemp.categoryName = true;
    } else if (!temp.categoryImage) {
      validateTemp.categoryImage = true;
    } else {
      setLoading(true);
      let apiService = new APICallService(
        master.editCategory,
        categoryJSON.editPrimaryCategory({ primaryCategory: primaryCategory },state?.isRecipe || false),
        { _id: state._id },
        '',
        false,
        '',
        Category
      );
      let response = await apiService.callAPI();
      if (response) {
        success(masterToast.editPrimaryCategory);
        navigate('/master/categories');
      }
    }
    setValidation(validateTemp);
    setLoading(false);
  };
  return (
    <>
      {state ? (
        <div>
          <Row>
            <Col
              lg={12}
              className="mb-6"
            >
              <h1 className="fs-22 fw-bolder">{CategoryString.editPrimary}</h1>
            </Col>
            <Col xs={12}>
              <Card className="border border-r10px bg-light position-relative mb-6">
                <Card.Body className="p-9">
                  <Row>
                    <Col
                      lg={6}
                      className="mb-6"
                    >
                      <Row className="align-items-center">
                        <Col lg={4}>
                          <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required">
                            {CategoryString.primaryCategoryName}
                          </label>
                        </Col>
                        <Col lg={8}>
                          <input
                            type="text"
                            className={clsx(
                              'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                              validation.categoryName ? 'border-danger' : ''
                            )}
                            name="name"
                            placeholder="Type here…"
                            value={primaryCategory.categoryName}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ): void => handleCategoryName(e.target.value, 0)}
                            disabled={loading}
                          />
                          <div className="fv-plugins-message-container">
                            <span className="text-danger fs-12 fw-bold">
                              {validation.categoryName
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
                                name={'isTobaccoNo'}
                                id={'isTobaccoNo'}
                                checked={!primaryCategory.isTobacco}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void => handleCheckBox(false)}
                              />
                            </span>
                            <label
                              className="form-check-label fs-16 fw-500 text-dark ms-2"
                              htmlFor={'isTobaccoNo'}
                            >
                              {'No'}
                            </label>
                          </div>
                          <div className="d-flex align-items-center">
                            <span>
                              <input
                                className="form-check-input pt-1 h-25px w-25px  me-1"
                                type="radio"
                                name={'isTobaccoYes'}
                                id={'isTobaccoYes'}
                                checked={primaryCategory.isTobacco}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void => handleCheckBox(true)}
                              />
                            </span>
                            <label
                              className="form-check-label fs-16 fw-500 text-dark ms-2"
                              htmlFor={'isTobaccoYes'}
                            >
                              {'Yes'}
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
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
                                validation.categoryImage ? 'border-danger' : ''
                              )}
                              src={
                                primaryCategory.categoryImage
                                  ? primaryCategory.categoryImage
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
                            ): void => handleImageChange(e, 0)}
                            disabled={loading}
                          />
                          <div className="fv-plugins-message-container">
                            <span className="text-danger fs-12 fw-bold">
                              {validation.categoryImage
                                ? 'Please upload category image'
                                : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      {primaryCategory.categoryImage && !loading ? (
                        <label
                          className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px responsive-closed "
                          data-kt-image-input-action="change"
                          title=""
                        >
                          <img
                            src={Close}
                            onClick={(): void => handleImageDiscard(0)}
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-end justify-content-md-start g-3">
            <Col xs="auto">
              <Button
                variant="danger"
                size="lg"
                className="btn-active-danger"
                onClick={() => navigate('/master/categories')}
              >
                {CategoryString.cancel}
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSaveCategory}
                disabled={loading}
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
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default EditPrimaryCategory;
