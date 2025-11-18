import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomSelect } from '../../../custom/Select/CustomSelect';
import { success } from '../../../../Global/toast';
import { Category, PAGE_LIMIT } from '../../../../utils/constants';
import { CategoryString, String } from '../../../../utils/string';
import { masterToast } from '../../../../utils/toast';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { categoryJSON } from '../../../../api/apiJSON/master';
import clsx from 'clsx';
const EditGroupCategories: FC = () => {
  const depth = 2;
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [primaryCategory, setPrimaryCategory] = useState([]);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<{
    groupCategoryName: boolean;
  }>({
    groupCategoryName: false,
  });
  const [subCategory, setSubCategory] = useState<any>();
  const [groupCategory, setGroupCategory] = useState<{
    groupCategoryName: any;
    primaryCategory: any;
    subCategory: any;
    primaryCategoryDefault: any;
    subCategoryDefault: any;
  }>({
    groupCategoryName: state?.title || '',
    // primaryCategory: '',
    primaryCategory: state?.primaryCategory._id || '',
    primaryCategoryDefault: {
      label: (
        <>
          <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
            <img
              src={state?.primaryCategory.image || ''}
              className="p-1"
              alt=""
            />
          </span>
          <span className="fs-16 fw-600 text-black ">
            {state?.primaryCategory.title || ''}
          </span>
        </>
      ),
      value: state?.primaryCategory.title || '',
      _id: state?.primaryCategory._id || '',
    },
    subCategory: state?.subCategory._id || '',
    subCategoryDefault: {
      label: (
        <>
          <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
            <img
              src={state?.subCategory.image || ''}
              className="p-1"
              alt=""
            />
          </span>
          <span className="fs-16 fw-600 text-black ">
            {state?.subCategory.title || ''}
          </span>
        </>
      ),
      value: state?.subCategory.title || '',
      _id: state?.subCategory._id || '',
    },
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
        let temp: any = [];
        response.records.map((val: any) => {
          if (val._id == groupCategory.primaryCategory) {
            if (val.categories.length) {
              val.categories.map((subVal: any) => {
                temp.push({
                  value: subVal.title,
                  name: subVal.title,
                  label: (
                    <>
                      <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                        <img
                          src={subVal.image}
                          className="p-1"
                          alt=""
                        />
                      </span>
                      <span className="fs-16 fw-600 text-black ">
                        {subVal.title}
                      </span>
                    </>
                  ),
                  _id: subVal._id,
                });
              });
            }
          }
        });
        setSubCategory(temp);
      } else {
        let prevTotal = totalRecords;
        setTotalRecords(prevTotal);
      }
      response.records.map((val: any) => {
        if (val.categories.length)
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
            subCategory: val.categories,
          });
      });
      setPrimaryCategory(data);
    }
  };
  const handleCategoryName = (value: any, index: any) => {
    let temp = { ...groupCategory };
    let validateTemp = { ...validation };
    temp.groupCategoryName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp.groupCategoryName = false;
    }
    if (value.trimStart().length === 0 || value.trimStart().length > 50) {
      validateTemp.groupCategoryName = true;
    }
    setGroupCategory(temp);
    setValidation(validateTemp);
  };
  const handlePrimaryCategoryChange = (event: any, index: any) => {
    let temp = { ...groupCategory };
    // let validateTemp = { ...validation }
    temp.primaryCategory = event._id;
    // validateTemp[index].primaryCategory = false
    let subCategoryTemp = event.subCategory.map((val: any) => {
      return {
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
      };
    });
    temp.subCategoryDefault = subCategoryTemp[0];
    temp.subCategory = subCategoryTemp[0]._id;
    setSubCategory(subCategoryTemp);
    setGroupCategory(temp);
  };
  const handleSubCategoryChange = (event: any, index: any) => {
    let temp = { ...groupCategory };
    // let validateTemp = { ...validation }
    temp.subCategory = event._id;
    // validateTemp[index].primaryCategory = false
    temp.subCategoryDefault = event;
    setGroupCategory(temp);
  };
  const handleSaveGroupCategory = async () => {
    let temp = { ...groupCategory };
    let validateTemp = { ...validation };
    // let length = temp.length - 1
    if (
      !temp.groupCategoryName ||
      temp.groupCategoryName.trimStart().length > 50
    ) {
      validateTemp.groupCategoryName = true;
    } else {
      setLoading(true);
      let apiService = new APICallService(
        master.editGroupCategory,
        categoryJSON.editGroupCategory({ groupCategory: groupCategory }),
        {
          id: state.primaryCategory._id,
          subCategoryId: state.subCategory._id,
          groupId: state._id,
        },
        '',
        false,
        '',
        Category
      );
      let response = await apiService.callAPI();
      if (response) {
        success(masterToast.editGroupCategory);
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
                {CategoryString.editGroupCategory}
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
                          {CategoryString.groupCategoryName}
                        </label>
                      </Col>
                      <Col lg={8}>
                        <input
                          type="text"
                          className={clsx(
                            'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600 ',
                            validation.groupCategoryName ? 'border-danger' : ''
                          )}
                          name="name"
                          placeholder="Type here…"
                          value={groupCategory.groupCategoryName}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): void => handleCategoryName(e.target.value, 0)}
                          disabled={loading}
                        />
                        <div className="fv-plugins-message-container">
                          <span className="text-danger fs-12 fw-bold">
                            {validation.groupCategoryName
                              ? 'Please enter valid group category name'
                              : ''}
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="align-items-center">
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
                          default={groupCategory.primaryCategoryDefault}
                          options={primaryCategory}
                          loadingMessage={'Fetching Data'}
                          isMulti={false}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): void => handlePrimaryCategoryChange(e, 0)}
                          disabled={loading}
                          // onMenuScrollToBottom={onMenuScrollToBottom}
                          backgroundColor={'white'}
                        />
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
                          {CategoryString.subCategory}
                        </label>
                      </Col>
                      <Col lg={8}>
                        <CustomSelect
                          backgroundColor={'white'}
                          isLoading={fetchLoader}
                          default={groupCategory.subCategoryDefault}
                          value={groupCategory.subCategoryDefault}
                          options={subCategory}
                          loadingMessage={'Fetching Data'}
                          isMulti={false}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): void => handleSubCategoryChange(e, 0)}
                          disabled={loading}
                        />
                      </Col>
                    </Row>
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
                onClick={handleSaveGroupCategory}
              >
                {!loading && (
                  <span className="indicator-label fs-16 fw-bold">
                    {CategoryString.saveChanges}
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
export default EditGroupCategories;
