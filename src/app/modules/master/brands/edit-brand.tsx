import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadImage from '../.../../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import APICallService from '../../../../api/apiCallService';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import Close from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import { brandsString } from '../../../../utils/string';
import { master } from '../../../../api/apiEndPoints';
import { brandJSON } from '../../../../api/apiJSON/master';
import { Brand } from '../../../../utils/constants';
const EditBrand: FC = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState<{
    brandName: string;
    brandImage: string;
    brandImageReader: any;
    isTobacco: boolean;
  }>({
    brandName: state?.title || '',
    brandImage: state?.image || '',
    brandImageReader: state?.image || '',
    isTobacco: state?.isTobacco || false,
  });
  const [validation, setValidation] = useState<{
    brandName: boolean;
    brandImage: boolean;
  }>({
    brandName: false,
    brandImage: false,
  });
  useEffect(() => {
    if (!state) {
      window.history.back();
    }
  }, []);
  const handleCategoryName = (value: any) => {
    let temp = { ...brand };
    let validateTemp = { ...validation };
    temp.brandName = value.trimStart();
    if (value.trimStart().length > 0) {
      validateTemp.brandName = false;
    } else {
      validateTemp.brandName = true;
    }
    setBrand(temp);
    setValidation(validateTemp);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    let temp = { ...brand };
    let validateTemp = { ...validation };
    if (!selectedFiles) return;
    else {
      validateTemp.brandImage = false;
      temp.brandImage = URL.createObjectURL(selectedFiles?.[0]);
      temp.brandImageReader = selectedFiles?.[0];
      event.target.value = '';
      setBrand(temp);
    }
    setValidation(validateTemp);
  };
  const handleImageDiscard = () => {
    let temp = { ...brand };
    let validateTemp = { ...validation };
    validateTemp.brandImage = true;
    temp.brandImage = '';
    temp.brandImageReader = {};
    setBrand(temp);
    setValidation(validateTemp);
  };
  const handleCheckBox = (value: boolean) => {
    let temp = { ...brand };
    temp.isTobacco = value;
    setBrand(temp);
  };
  const handleSaveCategory = async () => {
    let temp = { ...brand };
    let validateTemp = { ...validation };
    if (!temp.brandName && !temp.brandImage) {
      validateTemp.brandName = true;
      validateTemp.brandImage = true;
    } else if (!temp.brandName) {
      validateTemp.brandName = true;
    } else if (!temp.brandImage) {
      validateTemp.brandImage = true;
    } else {
      setLoading(true);
      let apiService = new APICallService(
        master.editBrands,
        brandJSON.editBrands({
          title: brand.brandName,
          image: brand.brandImageReader,
          isTobacco: brand.isTobacco,
        }),
        { _id: state._id },
        '',
        false,
        '',
        Brand
      );
      let response = await apiService.callAPI();
      if (response) {
        navigate('/master/brands');
        success(masterToast.editBrand);
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
              <h1 className="fs-22 fw-bolder">{brandsString.editBrands}</h1>
            </Col>
            <Col xs={12}>
              <Card className="border bg-light position-relative mb-6">
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
                              validation.brandName ? 'border-danger' : ''
                            )}
                            name="name"
                            placeholder="Type here…"
                            value={brand.brandName}
                            disabled={loading}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ): void => handleCategoryName(e.target.value)}
                          />
                          <div className="fv-plugins-message-container">
                            <span className="text-danger fs-12 fw-bold">
                              {validation.brandName
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
                                name={'isTobaccoNo'}
                                id={'isTobaccoNo'}
                                checked={!brand.isTobacco}
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
                                checked={brand.isTobacco}
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
                                'border bg-white object-fit-contain',
                                validation.brandImage
                                  ? 'border-danger'
                                  : 'border'
                              )}
                              src={
                                brand.brandImage
                                  ? brand.brandImage
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
                            ): void => handleImageChange(e)}
                          />
                          <div className="fv-plugins-message-container">
                            <span className="text-danger fs-12 fw-bold">
                              {validation.brandImage
                                ? 'Please upload brand logo'
                                : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      {brand.brandImage && !loading ? (
                        <label
                          className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px responsive-closed"
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
                    {brandsString.saveChanges}
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
      ) : (
        <></>
      )}
    </>
  );
};
export default EditBrand;
