import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import cross from '../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import { Add, Category, Master, PAGE_LIMIT } from '../../../../utils/constants';
import { masterToast } from '../../../../utils/toast';
import { success } from '../../../../Global/toast';
import clsx from 'clsx';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { String } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { categoryJSON } from '../../../../api/apiJSON/master';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
const AddGroupCategories: FC = () => {
  const depth = 2;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [primaryCategory, setPrimaryCategory] = useState([]);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<
    {
      groupCategoryName: boolean;
      primaryCategory: boolean;
      subCategory: boolean;
    }[]
  >([
    {
      groupCategoryName: false,
      primaryCategory: false,
      subCategory: false,
    },
  ]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState();
  const [groupCategory, setGroupCategory] = useState<
    {
      groupCategoryName: any;
      primaryCategory: string;
      subCategoryDefault: any;
      subCategory: string;
    }[]
  >([
    {
      groupCategoryName: '',
      primaryCategory: '',
      subCategory: '',
      subCategoryDefault: null,
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
      await response.records.map((val: any) => {
        if (val.categories.length) {
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
            subCategory: val.categories,
          });
        }
      });
      setSelectedSubCategory(data[0].subCategory[0]);
      setPrimaryCategory(data);
    }
  };
  const handleAddMore = () => {
    if (!loading) {
      let temp = [...groupCategory];
      let validateTemp = [...validation];
      let length = temp.length - 1;
      if (
        !temp[length].groupCategoryName &&
        !temp[length].primaryCategory &&
        !temp[length].subCategory
      ) {
        validateTemp[length].groupCategoryName = true;
        validateTemp[length].primaryCategory = true;
        validateTemp[length].subCategory = true;
      } else if (!temp[length].groupCategoryName) {
        validateTemp[length].groupCategoryName = true;
      } else if (!temp[length].primaryCategory) {
        validateTemp[length].primaryCategory = true;
      } else if (!temp[length].subCategory) {
        validateTemp[length].subCategory = true;
      } else {
        validateTemp.push({
          groupCategoryName: false,
          primaryCategory: false,
          subCategory: false,
        });
        temp.push({
          groupCategoryName: '',
          primaryCategory: '',
          subCategory: '',
          subCategoryDefault: null,
        });
        setGroupCategory(temp);
      }
      setValidation(validateTemp);
    }
  };
  const handleRemove = async (e: any, index: any) => {
    let temp = [...groupCategory];
    let validateTemp = [...validation];
    validateTemp.splice(index, 1);
    temp.splice(index, 1);
    setGroupCategory(temp);
    setValidation(validateTemp);
  };
  const handleCategoryName = (value: any, index: any) => {
    let temp = [...groupCategory];
    // temp[index].groupCategoryName = value
    // setGroupCategory(temp)
    let validateTemp = [...validation];
    temp[index].groupCategoryName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp[index].groupCategoryName = false;
    }
    if (value.trimStart().length === 0 || value.trimStart().length > 50) {
      validateTemp[index].groupCategoryName = true;
    }
    setGroupCategory(temp);
    setValidation(validateTemp);
  };
  const handlePrimaryCategoryChange = (event: any, index: any) => {
    let temp = [...groupCategory];
    let validateTemp = [...validation];
    temp[index].primaryCategory = event._id;
    validateTemp[index].primaryCategory = false;
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
              />
            </span>
            <span className="fs-16 fw-600 text-black ">{val.title}</span>
          </>
        ),
        _id: val._id,
        subCategory: val.categories,
      };
    });
    temp[index].subCategoryDefault = subCategoryTemp[0];
    temp[index].subCategory = subCategoryTemp[0]._id;
    const validationTemp = { ...validation };
    validationTemp[index].subCategory = false;
    setValidation(validateTemp);
    setSubCategory(subCategoryTemp);
    setGroupCategory(temp);
  };
  const handleSubCategoryChange = (event: any, index: any) => {
    let temp = [...groupCategory];
    let validateTemp = [...validation];
    temp[index].subCategory = event._id;
    temp[index].subCategoryDefault = event;
    validateTemp[index].subCategory = false;
    setSelectedSubCategory(event);
    setGroupCategory(temp);
  };
  const handleSaveGroupCategory = async () => {
    let temp = [...groupCategory];
    let validateTemp = [...validation];
    let length = temp.length - 1;
    if (
      !temp[length].groupCategoryName &&
      !temp[length].primaryCategory &&
      !temp[length].subCategory
    ) {
      validateTemp[length].groupCategoryName = true;
      validateTemp[length].primaryCategory = true;
      validateTemp[length].subCategory = true;
    }
    if (
      !temp[length].groupCategoryName ||
      temp[length].groupCategoryName.trimStart().length > 50
    ) {
      validateTemp[length].groupCategoryName = true;
    }
    if (!temp[length].primaryCategory) {
      validateTemp[length].primaryCategory = true;
    }
    if (!temp[length].subCategory) {
      validateTemp[length].subCategory = true;
    }
    if (
      !validateTemp[length].groupCategoryName &&
      !validateTemp[length].primaryCategory &&
      !validateTemp[length].subCategory
    ) {
      setLoading(true);
      let apiService = new APICallService(
        master.addGroupCategory,
        categoryJSON.addGroupCategory({ groupCategory: groupCategory }),
        '',
        '',
        false,
        '',
        Category
      );
      let response = await apiService.callAPI();
      if (response) {
        success(masterToast.addGroupCategory);
        navigate('/master/categories');
      }
      setLoading(false);
    }
    setValidation(validateTemp);
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
              <h1 className="fs-22 fw-bolder">Add group category</h1>
            </Col>
            <Col>
              {groupCategory.map((val, index) => {
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
                                Group category name
                              </label>
                            </Col>
                            <Col lg={8}>
                              <input
                                type="text"
                                className={clsx(
                                  'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600 ',
                                  validation[index].groupCategoryName
                                    ? 'border-danger'
                                    : ''
                                )}
                                name="name"
                                placeholder="Type here…"
                                disabled={loading}
                                value={val.groupCategoryName}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void =>
                                  handleCategoryName(e.target.value, index)
                                }
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].groupCategoryName
                                    ? 'Please enter valid group category name'
                                    : ''}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {groupCategory.length === 1 ? (
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
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <Row className="align-items-center">
                        <Col
                          lg={6}
                          className="mb-6"
                        >
                          <Row className="align-items-center">
                            <Col lg={4}>
                              <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required">
                                Primary category
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
                                options={primaryCategory.map((item: any) => {
                                  return {
                                    ...item,
                                    title: item.name,
                                  };
                                })}
                                loadingMessage={'Fetching Data'}
                                isMulti={false}
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
                        <Col
                          lg={6}
                          className="mb-6"
                        >
                          <Row className="align-items-center">
                            <Col lg={4}>
                              <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 required">
                                Sub category
                              </label>
                            </Col>
                            <Col lg={8}>
                              <CustomSelectWhite
                                border={
                                  validation[index].subCategory ? '#e55451' : ''
                                }
                                isLoading={fetchLoader}
                                options={subCategory.map((item: any) => {
                                  return {
                                    ...item,
                                    title: item.name,
                                  };
                                })}
                                //  options={subCategory}
                                value={groupCategory[index].subCategoryDefault}
                                loadingMessage={'Fetching Data'}
                                isMulti={false}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void => handleSubCategoryChange(e, index)}
                                disabled={loading}
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].subCategory
                                    ? 'Please select sub category'
                                    : ''}
                                </span>
                              </div>
                            </Col>
                          </Row>
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
              + Add new category
            </Link>
            <Row className="align-items-center mt-6 g-3 ">
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="lg"
                  className="w-fit-content btn-active-danger"
                  onClick={() => {
                    navigate('/master/categories');
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs="auto">
                {' '}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-fit-content"
                  onClick={handleSaveGroupCategory}
                  disabled={
                    loading ||
                    !validation.every(
                      (obj) =>
                        obj.groupCategoryName === false &&
                        obj.primaryCategory === false &&
                        obj.subCategory === false
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
export default AddGroupCategories;
