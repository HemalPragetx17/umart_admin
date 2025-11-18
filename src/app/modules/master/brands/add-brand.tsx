import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UploadImage from '../.../../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import { success } from '../../../../Global/toast';
import cross from '../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import Close from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import APICallService from '../../../../api/apiCallService';
import { brandsString } from '../../../../utils/string';
import { masterToast } from '../../../../utils/toast';
import { master } from '../../../../api/apiEndPoints';
import { brandJSON } from '../../../../api/apiJSON/master';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import { Add, Brand, Master } from '../../../../utils/constants';
const AddBrand: FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState<
    {
      brandName: string;
      brandImage: string;
      brandImageReader: any;
      isTobacco: boolean;
    }[]
  >([
    {
      brandName: '',
      brandImage: '',
      brandImageReader: '',
      isTobacco:false
    },
  ]);
  const [validation, setValidation] = useState<
    {
      brandName: boolean;
      brandImage: boolean;
    }[]
  >([
    {
      brandName: false,
      brandImage: false,
    },
  ]);
  useEffect(() => {
    (() => {
      if (!Method.hasPermission(Brand, Add, currentUser)) {
        return window.history.back();
      }
    })();
  }, []);
  const handleAddMore = () => {
    if (!loading) {
      let temp = [...brand];
      let validateTemp = [...validation];
      let length = temp.length - 1;
      if (!temp[length].brandName && !temp[length].brandImage) {
        validateTemp[length].brandName = true;
        validateTemp[length].brandImage = true;
      } else if (!temp[length].brandName) {
        validateTemp[length].brandName = true;
      } else if (!temp[length].brandImage) {
        validateTemp[length].brandImage = true;
      } else {
        const allTrue = validateTemp.every(
          (obj) => obj.brandName === false && obj.brandImage === false
        );
        if (allTrue) {
          validateTemp.push({
            brandName: false,
            brandImage: false,
          });
          temp.push({
            brandName: '',
            brandImage: '',
            brandImageReader: '',
            isTobacco:false
          });
          setBrand(temp);
        }
      }
      setValidation(validateTemp);
    }
  };
  const handleRemove = async (e: any, index: any) => {
    let temp = [...brand];
    let validateTemp = [...validation];
    validateTemp.splice(index, 1);
    temp.splice(index, 1);
    setValidation(validateTemp);
    setBrand(temp);
  };
  const handleCategoryName = (value: any, index: any) => {
    let temp = [...brand];
    let validateTemp = [...validation];
    temp[index].brandName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp[index].brandName = false;
    } else {
      validateTemp[index].brandName = true;
    }
    setBrand(temp);
    setValidation(validateTemp);
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    const selectedFiles = event.target.files;
    let temp = [...brand];
    let validateTemp = [...validation];
    if (!selectedFiles) return;
    else {
      validateTemp[index].brandImage = false;
      temp[index].brandImage = URL.createObjectURL(selectedFiles?.[0]);
      temp[index].brandImageReader = selectedFiles?.[0];
      event.target.value = '';
      setBrand(temp);
    }
    setValidation(validateTemp);
  };
  const handleImageDiscard = (index: any) => {
    let temp = [...brand];
    let validateTemp = [...validation];
    validateTemp[index].brandImage = true;
    temp[index].brandImage = '';
    temp[index].brandImageReader = {};
    setBrand(temp);
    setValidation(validateTemp);
  };
    const handleCheckBox = (value: boolean, index: any) => {
      let temp = [...brand];
      temp[index].isTobacco = value;
      setBrand(temp);
    };
  const handleSaveCategory = async () => {
    let temp = [...brand];
    let validateTemp = [...validation];
    let length = temp.length - 1;
    if (!temp[length].brandName && !temp[length].brandImage) {
      validateTemp[length].brandName = true;
      validateTemp[length].brandImage = true;
    } else if (!temp[length].brandName) {
      validateTemp[length].brandName = true;
    } else if (!temp[length].brandImage) {
      validateTemp[length].brandImage = true;
    } else {
      const allTrue = validateTemp.every(
        (obj) => obj.brandName === false && obj.brandImage === false
      );
      if (allTrue) {
        setLoading(true);
        let apiService = new APICallService(
          master.addBrands,
          brandJSON.addBrands({ brands: brand }),
          '',
          '',
          false,
          '',
          Brand
        );
        let response = await apiService.callAPI();
        if (response) {
          navigate('/master/brands');
          success(masterToast.addBrand);
        }
      }
    }
    setValidation(validateTemp);
    setLoading(false);
  };
  return (
    <>
      {Method.hasPermission(Brand, Add, currentUser) ? (
        <Row className="g-6">
          <Col xs={12}>
            <h1 className="fs-22 fw-bolder mb-0">{brandsString.addBrand}</h1>
          </Col>
          {brand.map((val, index) => {
            return (
              <>
                <Col
                  key={index}
                  xs={12}
                >
                  <Card className="bg-light border">
                    <Card.Body className="p-9">
                      <Row>
                        <Col
                          lg={6}
                          className="mb-6"
                        >
                          <Row className="align-items-center">
                            <Col lg={4}>
                              <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3">
                                {brandsString.brandName}
                              </label>
                            </Col>
                            <Col lg={8}>
                              <input
                                type="text"
                                className={clsx(
                                  'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                                  validation[index].brandName
                                    ? 'border-danger'
                                    : ''
                                )}
                                name="name"
                                placeholder="Type here…"
                                value={val.brandName}
                                disabled={loading}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ): void =>
                                  handleCategoryName(e.target.value, index)
                                }
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].brandName
                                    ? 'Please enter brand name'
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
                                Is the brand related to tobacco ?
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
                      {brand.length === 1 ? (
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
                          <label className="fs-16 fw-500 text-dark mb-lg-0 mb-3 mt-lg-3">
                            {brandsString.upload} <br />
                            {brandsString.brandLogo}
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
                                    'border border-r10px bg-white object-fit-contain',
                                    validation[index].brandImage
                                      ? 'border-danger'
                                      : 'border'
                                  )}
                                  src={
                                    val.brandImage
                                      ? val.brandImage
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
                                ): void => {
                                  handleImageChange(e, index);
                                }}
                              />
                              <div className="fv-plugins-message-container">
                                <span className="text-danger fs-12 fw-bold">
                                  {validation[index].brandImage
                                    ? 'Please upload brand logo'
                                    : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          {val.brandImage && !loading ? (
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
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            );
          })}
          <div className="d-flex flex-column">
            <Link
              to="#"
              className="text-primary fs-16 fw-bolder"
              onClick={handleAddMore}
            >
              {brandsString.more}
            </Link>
            <Row className="align-items-center mt-6 g-3">
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="lg"
                  className="btn-active-danger"
                  onClick={() => navigate('/master/brands')}
                >
                  {brandsString.cancel}
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
                    <span className="indicator-label">
                      {brandsString.saveBrand}
                    </span>
                  )}
                  {loading && (
                    <span
                      className="indicator-progress"
                      style={{ display: 'block' }}
                    >
                      Please wait...
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </Button>
              </Col>
            </Row>
          </div>
        </Row>
      ) : (
        <></>
      )}
    </>
  );
};
export default AddBrand;
