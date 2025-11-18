import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomSelect } from '../../../custom/Select/CustomSelect';
import UploadImage from '../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import { Category, PAGE_LIMIT } from '../../../../utils/constants';
import Close from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import { masterToast } from '../../../../utils/toast';
import { success } from '../../../../Global/toast';
import { CategoryString, String } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { categoryJSON } from '../../../../api/apiJSON/master';
import clsx from 'clsx';
const EditSubCategories: FC = () => {
  const depth = 1;
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [primaryCategory, setPrimaryCategory] = useState([]);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subCategory, setSubCategory] = useState<{
    subCategoryName: string;
    subCategoryImage: any;
    subCategoryImageReader: any;
    primaryCategory: string;
    defaultCategory: any;
  }>({
    subCategoryName: state?.title || '',
    subCategoryImage: state?.image || '',
    subCategoryImageReader: state?.image || '',
    primaryCategory: state?.primaryCategories._id || '',
    defaultCategory: {
      label: (
        <>
          <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
            <img
              src={state?.primaryCategories.image || ''}
              className="p-1"
              alt=""
            />
          </span>
          <span className="fs-16 fw-600 text-black ">
            {state?.primaryCategories.title || ''}
          </span>
        </>
      ),
      value: state?.primaryCategories.title || '',
      _id: state?.primaryCategories._id || '',
    },
  });
  const [validation, setValidation] = useState<{
    subCategoryName: boolean;
    subCategoryImage: boolean;
    primaryCategory: boolean;
  }>({
    subCategoryName: false,
    subCategoryImage: false,
    primaryCategory: false,
  });
  useEffect(() => {
    (async () => {
      if (!state) {
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
    let apiService = new APICallService(
      master.categoryList,
      params,
      '',
      '',
      false,
      '',
      Category
    );
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
        return data.push({
          value: val.title,
          name: val.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val.image}
                  className="p-1"
                  alt=""
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
  const handleImageDiscard = () => {
    let temp = { ...subCategory };
    let validateTemp = { ...validation };
    validateTemp.subCategoryImage = true;
    temp.subCategoryImage = '';
    temp.subCategoryImageReader = {};
    setSubCategory(temp);
    setValidation(validateTemp);
  };
  const handleRemove = async (e: any, index: any) => {
    let temp = { ...subCategory };
    // temp.splice(0, 1)
    setSubCategory(temp);
  };
  const handleSubCategoryName = (value: any, index: any) => {
    let temp = { ...subCategory };
    let validateTemp = { ...validation };
    temp.subCategoryName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp.subCategoryName = false;
    }
    if (value.trimStart().length === 0 || value.trimStart().length >= 50) {
      validateTemp.subCategoryName = true;
    }
    setSubCategory(temp);
    setValidation(validateTemp);
  };
  const handlePrimaryCategoryChange = (event: any, index: any) => {
    let temp = { ...subCategory };
    let validateTemp = { ...validation };
    temp.primaryCategory = event._id;
    validateTemp.primaryCategory = false;
    setSubCategory(temp);
    setValidation(validateTemp);
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    const selectedFiles = event.target.files;
    let temp = { ...subCategory };
    let validateTemp = { ...validation };
    if (!selectedFiles) return;
    else {
      validateTemp.subCategoryImage = false;
      temp.subCategoryImage = URL.createObjectURL(selectedFiles?.[0]);
      temp.subCategoryImageReader = selectedFiles?.[0];
      setSubCategory(temp);
    }
    setValidation(validateTemp);
  };
  const handleSaveSubCategory = async () => {
    let temp = { ...subCategory };
    let validateTemp = { ...validation };
    // let length = temp.length - 1
    if (
      !temp.subCategoryName &&
      !temp.subCategoryImage &&
      !temp.primaryCategory
    ) {
      validateTemp.subCategoryName = true;
      validateTemp.subCategoryImage = true;
      validateTemp.primaryCategory = true;
    } else if (!temp.subCategoryName || temp.subCategoryName.length > 50) {
      validateTemp.subCategoryName = true;
    } else if (!temp.subCategoryImage) {
      validateTemp.subCategoryImage = true;
    } else if (!temp.primaryCategory) {
      validateTemp.primaryCategory = true;
    } else {
      setLoading(true);
      let apiService = new APICallService(
        master.editSubCategory,
        categoryJSON.editSubCategory({ subCategory: subCategory }),
        { id: state.primaryCategories._id, subCategoryId: state._id },
        '',
        false,
        '',
        Category
      );
      let response = await apiService.callAPI();
      if (response) {
        success(masterToast.editSubCategory);
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
              className="mb-5"
            >
              <h1 className="fs-22 fw-bolder">
                {CategoryString.editSubCategory}
              </h1>
            </Col>
            <Col lg={12}>
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
                            validation.subCategoryName
                              ? 'border-danger'
                              : 'border'
                          )}
                          name="name"
                          placeholder="Type here…"
                          value={subCategory.subCategoryName}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): void => handleSubCategoryName(e.target.value, 0)}
                        />
                        <div className="fv-plugins-message-container">
                          <span className="text-danger fs-12 fw-bold">
                            {validation.subCategoryName
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
                        <CustomSelect
                          isLoading={fetchLoader}
                          default={subCategory.defaultCategory}
                          options={primaryCategory}
                          loadingMessage={'Fetching Data'}
                          isMulti={false}
                          disabled={state?.primaryCategories?.isRecipe}
                          onMenuScrollToBottom={onMenuScrollToBottom}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): void => handlePrimaryCategoryChange(e, 0)}
                        />
                        <div className="fv-plugins-message-container">
                          <span className="text-danger fs-12 fw-bold">
                            {validation.primaryCategory
                              ? 'Please select primary category'
                              : ''}
                          </span>
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
                            className="border bg-white"
                            src={
                              subCategory.subCategoryImage
                                ? subCategory.subCategoryImage
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
                        />
                        <div className="fv-plugins-message-container">
                          <span className="text-danger fs-12 fw-bold">
                            {validation.subCategoryImage
                              ? 'Please upload category image'
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {subCategory.subCategoryImage && !loading ? (
                      <label
                        className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px responsive-closed "
                        data-kt-image-input-action="change"
                        title=""
                      >
                        <img
                          src={Close}
                          onClick={(): void => handleImageDiscard()}
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
                disabled={loading}
                onClick={handleSaveSubCategory}
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
export default EditSubCategories;
