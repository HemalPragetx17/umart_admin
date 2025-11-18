import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { PromotionAndCampaignString } from '../../../../../utils/string';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Method from '../../../../../utils/methods';
import CustomDatePicker from '../../../../custom/DateRange/DatePicker';
import CustomDateInput from '../../../../custom/Select/CustomDateInput';
import EditSVG from '../../../../../umart_admin/assets/media/svg_uMart/edit-round.svg';
import CloseImage from '../../../../../umart_admin/assets/media/svg_uMart/cross.png';
import UploadSVG from '../../../../../umart_admin/assets/media/svg_uMart/upload-gray.svg';
import { IRewardData } from '../../../../../types';
import {
  BrandPlacement,
  CategoryPagePlacement,
  HomePagePlacement,
  ProductPlacement,
  Promotion,
} from '../../../../../utils/constants';
import CoinSvg from '../../../../../umart_admin/assets/media/coin.svg';
import AddSvg from '../../../../../umart_admin/assets/media/svg_uMart/add-green.svg';
import { fileValidation } from '../../../../../Global/fileValidation';
import Validations from '../../../../../utils/validations';
import { IPurchaseRange } from '../../../../../types/request_data/promotionCampaign';
import { error, success } from '../../../../../Global/toast';
import APICallService from '../../../../../api/apiCallService';
import { promotionCampaign } from '../../../../../api/apiEndPoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { title } from 'process';
import Loader from '../../../../../Global/loader';
import { promotionCampaignApiJson } from '../../../../../api/apiJSON/promotionCampaign';
import { promotionCampaignToast } from '../../../../../utils/toast';
import { placements } from '@popperjs/core';
const AddDiscountPromotion = () => {
  const navigate = useNavigate();
  const location: any = useLocation();
  const id: any = location?.state?._id;
  const [rewardData, setRewardData] = useState<IRewardData>({
    title: '',
    startDate: null,
    endDate: null,
    image: '',
    imageReader: null,
    description: '',
    placement: HomePagePlacement.toString(),
    purchaseRange: [
      {
        min: '',
        max: '',
        coins: '',
      },
    ],
  });
  const [validations, setValidations] = useState<{
    title: boolean;
    startDate: boolean;
    endDate: boolean;
    image: boolean;
    description: boolean;
    purchaseRange: { min: boolean; max: boolean; coins: boolean }[];
  }>({
    title: false,
    startDate: false,
    endDate: false,
    image: false,
    description: false,
    purchaseRange: [{ min: false, max: false, coins: false }],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  useEffect(() => {
    if (!id) {
      return window.history.back();
    }
    (async () => {
      await fetchRewardDetails(id);
    })();
  }, []);
  const fetchRewardDetails = async (id: string) => {
    setFetchLoading(true);
    const apiService = new APICallService(promotionCampaign.rewardDetails, id,'','',false,'',Promotion);
    const response = await apiService.callAPI();
    if (response) {
      const tempValidation = { ...validations };
      validations.purchaseRange.pop();
      const temp = {
        ...rewardData,
        title: response?.title || '',
        startDate:
          response?.startDate && response?.expired === false
            ? new Date(response.startDate)
            : null,
        endDate:
          response?.endDate && response?.expired === false
            ? new Date(response.endDate)
            : null,
        image: response?.image || '',
        description: response?.description || '',
        placement: response?.placement + '' || '1',
      };
      if (response?.purchaseRanges?.length > 0) {
        temp.purchaseRange.pop();
        tempValidation.purchaseRange.pop();
      }
      response.purchaseRanges.forEach((item: any, index: number) => {
        temp.purchaseRange.push({
          min: item.minOrderValue,
          max: item.maxOrderValue,
          coins: item.coin,
        });
        tempValidation.purchaseRange.push({
          max: false,
          min: false,
          coins: false,
        });
      });
      setRewardData(temp);
      setValidations(tempValidation);
    }
    setFetchLoading(false);
  };
  const handleSubmit = async () => {
    const temp = { ...rewardData };
    let tempValidation = { ...validations };
    if (temp.startDate && temp.endDate) {
      const dayDifference = Method.dayDifference(
        new Date(temp.startDate).toDateString(),
        new Date(temp.endDate).toDateString()
      );
      if (dayDifference < 0) {
        return error(promotionCampaignToast.invalidEndDate);
      }
    }
    tempValidation = {
      ...tempValidation,
      title: temp.title.trim().length === 0,
      startDate: !temp.startDate,
      endDate: !temp.endDate,
      image: temp.image.trim().length === 0,
      description: temp.description.trim().length === 0,
    };
    tempValidation.purchaseRange = temp.purchaseRange.map((item) => {
      return {
        min: Validations.isStringEmpty(item.min),
        max:
          Validations.isStringEmpty(item.max) ||
          parseInt(item.min) >= parseInt(item.max),
        coins: Validations.isStringEmpty(item.coins),
      };
    });
    let isRangeValueValid = true;
    for (let i = 1; i < temp.purchaseRange.length; i++) {
      const currObj = temp.purchaseRange[i];
      const prevObj = temp.purchaseRange[i - 1];
      if (parseInt(currObj.min) <= parseInt(prevObj.max)) {
        isRangeValueValid = false;
        tempValidation.purchaseRange[i].min = true;
      }
    }
    let valueArr = Object.values(tempValidation).filter(
      (item) => item === false || item === true
    );
    let isValid = await Validations.validateObject(valueArr);
    let isRangeValid = tempValidation.purchaseRange.every((item) => {
      return !item.max && !item.min && !item.coins;
    });
    if (isValid && isRangeValid && isRangeValueValid) {
      setLoading(true);
      const apiCallService = new APICallService(
        promotionCampaign.editReward,
        promotionCampaignApiJson.addReward(temp),
        { id: id },
        '',
        false,
        '',
        Promotion
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(promotionCampaignToast.rewardUpdated);
        navigate('/promotion-campaign');
      }
      setLoading(false);
    } else {
      if (!isRangeValueValid) error('Please enter valid price range.');
    }
    setValidations(tempValidation);
  };
  const handleChange = (value: string, name: keyof IRewardData) => {
    const temp = { ...rewardData };
    const tempValidation: any = { ...validations };
    temp[name] = value;
    if (value.trim().length === 0) {
      tempValidation[name] = true;
    } else {
      tempValidation[name] = false;
    }
    setValidations(tempValidation);
    setRewardData(temp);
  };
  const handleRangeChange = (
    value: string,
    index: number,
    name: keyof IPurchaseRange
  ) => {
    const temp = { ...rewardData };
    const tempValidation = { ...validations };
    if (Validations.allowOnlyNumbersWithEmptyString(value)) {
      temp.purchaseRange[index][name] = value;
      if (Validations.isStringEmpty(value)) {
        tempValidation.purchaseRange[index][name] = true;
      } else {
        tempValidation.purchaseRange[index][name] = false;
      }
    }
    setValidations(tempValidation);
    setRewardData(temp);
  };
  const handleAddMore = () => {
    const temp = { ...rewardData };
    const tempValidation = { ...validations };
    const length = temp.purchaseRange.length;
    if (Validations.isStringEmpty(temp.purchaseRange[length - 1].max)) {
      tempValidation.purchaseRange[length - 1].max = true;
    }
    if (Validations.isStringEmpty(temp.purchaseRange[length - 1].min)) {
      tempValidation.purchaseRange[length - 1].min = true;
    }
    if (Validations.isStringEmpty(temp.purchaseRange[length - 1].coins)) {
      tempValidation.purchaseRange[length - 1].coins = true;
    }
    if (
      !tempValidation.purchaseRange[length - 1].max &&
      !tempValidation.purchaseRange[length - 1].min &&
      !tempValidation.purchaseRange[length - 1].coins
    ) {
      temp.purchaseRange.push({
        min: '',
        max: '',
        coins: '',
      });
      tempValidation.purchaseRange.push({
        min: false,
        max: false,
        coins: false,
      });
    }
    setValidations(tempValidation);
    setRewardData(temp);
  };
  const handleRemove = (index: number) => {
    const temp = { ...rewardData };
    const tempValidation = { ...validations };
    temp.purchaseRange.splice(index, 1);
    tempValidation.purchaseRange.splice(index, 1);
    setValidations(tempValidation);
    setRewardData(temp);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleDateChange = (date: any, name: 'startDate' | 'endDate') => {
    const temp = { ...rewardData };
    const tempValidation: any = { ...validations };
    if (date) {
      name === 'startDate' ? (temp.startDate = date) : (temp.endDate = date);
      tempValidation[name] = false;
    } else {
      tempValidation[name] = true;
    }
    setValidations(tempValidation);
    setRewardData(temp);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = { ...rewardData };
    const tempValidation = { ...validations };
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    if (fileValidation(selectedFiles?.[0])) {
      temp.image = URL.createObjectURL(selectedFiles[0]);
      temp.imageReader = selectedFiles[0];
      tempValidation.image = false;
    }
    setValidations(tempValidation);
    setRewardData(temp);
  };
  return (
    <div>
      <Row className="mb-5">
        <Col sm>
          <h1 className="fs-22 fw-bolder">
            {PromotionAndCampaignString.editReward}
          </h1>
        </Col>
      </Row>
      <Row>
        {!fetchLoading ? (
          <>
            <Col lg={12}>
              <Card className="bg-light">
                <Card.Body>
                  <Row className="justify-content-between">
                    <Col md={6}>
                      <Row className="gy-7">
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.discountTitle}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <input
                                type="text"
                                className={clsx(
                                  'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-500  ms-1',
                                  validations.title
                                    ? 'border-danger'
                                    : 'border-gray-300'
                                )}
                                name="title"
                                value={rewardData.title}
                                placeholder="Enter title here…"
                                onChange={(event: any) => {
                                  handleChange(
                                    event.target.value.trimStart(),
                                    'title'
                                  );
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.startDate}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <CustomDatePicker
                                className={clsx(
                                  'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded me-4'
                                )}
                                selected={rewardData.startDate}
                                value={rewardData.startDate}
                                onChange={(date: Date) =>
                                  handleDateChange(date, 'startDate')
                                }
                                dateFormat="dd/MM/yyyy"
                                showFullMonthYearPicker
                                minDate={new Date()}
                                inputTextBG="bg-white"
                                showYearDropdown={true}
                                scrollableYearDropdown={true}
                                dropdownMode="select"
                                placeholder="DD/MM/YYYY"
                                dayClassName={(date: Date) => {
                                  return Method.dayDifference(
                                    new Date().toDateString(),
                                    date.toDateString()
                                  ) < 0
                                    ? 'date-disabled'
                                    : '';
                                }}
                                customInput={
                                  <CustomDateInput
                                    inputClass={`${
                                      validations.startDate
                                        ? 'border-danger'
                                        : ''
                                    }`}
                                  />
                                }
                                //    isClearable={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col xs={4}>
                              <label
                                className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                                htmlFor="flexRadioDefault1"
                              >
                                {PromotionAndCampaignString.endDate}
                              </label>
                            </Col>
                            <Col xs={8}>
                              <CustomDatePicker
                                className={clsx(
                                  'form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-lg-200px  border rounded'
                                )}
                                selected={rewardData.endDate}
                                value={rewardData.endDate}
                                onChange={(date: Date) =>
                                  handleDateChange(date, 'endDate')
                                }
                                dateFormat="dd/MM/yyyy"
                                showFullMonthYearPicker
                                minDate={new Date()}
                                inputTextBG="bg-white"
                                showYearDropdown={true}
                                scrollableYearDropdown={true}
                                dropdownMode="select"
                                placeholder="DD/MM/YYYY"
                                dayClassName={(date: Date) => {
                                  return Method.dayDifference(
                                    new Date().toDateString(),
                                    date.toDateString()
                                  ) < 0
                                    ? 'date-disabled'
                                    : '';
                                }}
                                customInput={
                                  <CustomDateInput
                                    inputClass={`${
                                      validations.endDate ? 'border-danger' : ''
                                    }`}
                                  />
                                }
                                //    isClearable={true}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={4}
                      className="mt-6 mt-lg-0"
                    >
                      <Card className=" border border-r10px">
                        <Card.Header className="border-bottom-0">
                          <Card.Title>
                            <h5 className="fs-22 fw-bolder">
                              {PromotionAndCampaignString.promotionImage}
                            </h5>
                          </Card.Title>
                        </Card.Header>
                        <Card.Body className="pt-0 text-lg-center">
                          {rewardData?.image ? (
                            <div className="image-input image-input-outline min-w-xl-260px min-h-xl-150px border border-r10px bg-white">
                              <div
                                className="image-input-wrapper shadow-none bgi-contain w-100 h-100 bgi-position-center"
                                style={{
                                  // backgroundImage: `url(${rewardData?.image})`,
                                  backgroundRepeat: `no-repeat`,
                                }}
                              >
                                {rewardData?.image && (
                                  <img
                                    width={262}
                                    height={149}
                                    src={rewardData?.image}
                                    className="img-fluid mh-150px border-r10px object-fit-contain"
                                    alt=""
                                  />
                                )}
                              </div>
                              {!loading ? (
                                <label
                                  className="btn btn-icon btn-circle btn-active-color-primary w-50px h-50px "
                                  data-kt-image-input-action="change"
                                  title=""
                                >
                                  <img
                                    src={EditSVG}
                                    alt=""
                                    height={33}
                                    width={33}
                                  />
                                  <input
                                    type="file"
                                    name="avatar"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleImageChange}
                                  />
                                  {/* <input
                      type="hidden"
                      name="avatar_remove"
                    /> */}
                                </label>
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : (
                            <div
                              className={clsx(
                                'upload-btn-wrapper border-r10px min-w-xl-260px min-h-xl-150px border border-1 ',
                                validations.image
                                  ? ' border-danger'
                                  : 'border-gray-300'
                              )}
                            >
                              <div className="">
                                <img
                                  src={UploadSVG}
                                  className="img-fluid object-fit-cover w-275px  h-160px"
                                  alt=""
                                />
                              </div>
                              <input
                                className="w-100 h-100"
                                type="file"
                                name="myfile"
                                onChange={handleImageChange}
                              />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                      <div className="d-flex my-5">
                        <span className="text-dark text-italic fw-600">
                          {PromotionAndCampaignString.promotionImageNote}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-6">
                    <Col md={12}>
                      <Row className="align-items-center">
                        <Col lg={2}>
                          <label
                            htmlFor=""
                            className="fs-16 fw-500 mb-lg-0 mb-3 "
                          >
                            <span>Reward coins on purchase value</span>
                            <span className="d-inline-block text-gray">{`(Min to Max)`}</span>
                          </label>
                        </Col>
                        <Col lg={10}>
                          {rewardData.purchaseRange.map((item, index) => {
                            return (
                              <Row className="mb-3">
                                <Col
                                  lg={3}
                                  className="mb-3 mb-lg-0"
                                >
                                  <InputGroup
                                    className={clsx(
                                      'min-h-40px  border border-r5px border',
                                      validations.purchaseRange[index]?.min
                                        ? 'border-danger'
                                        : ' border-gray-300'
                                    )}
                                  >
                                    <Form.Control
                                      className={clsx(
                                        'border fs-16 fw-500 text-dark h-60px borderRight-0 '
                                      )}
                                      aria-label="Default"
                                      aria-describedby=""
                                      value={item.min}
                                      placeholder="Enter value here..."
                                      onChange={(event: any) => {
                                        handleRangeChange(
                                          event.target.value.trimStart(),
                                          index,
                                          'min'
                                        );
                                      }}
                                      onKeyPress={(event: any) => {
                                        handleOnKeyPress(event);
                                      }}
                                    />
                                    <InputGroup.Text
                                      className="bg-white border-0 text-italic fs-16 text-gray-600"
                                      id=""
                                    >
                                      Tsh
                                    </InputGroup.Text>
                                  </InputGroup>
                                </Col>
                                <Col
                                  lg="auto"
                                  className="d-flex align-items-center"
                                >
                                  <span className="fs-18 fw-500 ms-3">To</span>
                                </Col>
                                <Col
                                  lg={3}
                                  className="mb-3 mb-lg-0"
                                >
                                  <InputGroup
                                    className={clsx(
                                      'min-h-40px  border border-r5px border ',
                                      validations.purchaseRange[index].max
                                        ? 'border-danger'
                                        : 'border-gray-300'
                                    )}
                                  >
                                    <Form.Control
                                      className={clsx(
                                        'border fs-16 fw-500 text-dark h-60px  borderRight-0'
                                      )}
                                      aria-label="Default"
                                      aria-describedby=""
                                      value={item.max}
                                      placeholder="Enter value here..."
                                      onChange={(event: any) => {
                                        handleRangeChange(
                                          event.target.value.trimStart(),
                                          index,
                                          'max'
                                        );
                                      }}
                                      onKeyPress={(event: any) => {
                                        handleOnKeyPress(event);
                                      }}
                                    />
                                    <InputGroup.Text
                                      className="bg-white border-0 text-italic fs-16 text-gray-600"
                                      id=""
                                    >
                                      Tsh
                                    </InputGroup.Text>
                                  </InputGroup>
                                </Col>
                                <Col
                                  lg={3}
                                  className="mb-3 mb-lg-0"
                                >
                                  <InputGroup
                                    className={clsx(
                                      'min-h-40px  border border-r5px border  ',
                                      validations.purchaseRange[index].coins
                                        ? 'border-danger'
                                        : 'border-warning'
                                    )}
                                  >
                                    <Form.Control
                                      className={clsx(
                                        'border fs-16 fw-500 text-dark h-60px borderRight-0 bg-light-warning'
                                      )}
                                      aria-label="Default"
                                      aria-describedby=""
                                      value={item.coins}
                                      placeholder="Enter coin..."
                                      onChange={(event: any) => {
                                        handleRangeChange(
                                          event.target.value.trimStart(),
                                          index,
                                          'coins'
                                        );
                                      }}
                                      onKeyPress={(event: any) => {
                                        handleOnKeyPress(event);
                                      }}
                                    />
                                    <InputGroup.Text
                                      className="bg-light-warning border-0 text-italic fs-16 text-gray-600"
                                      id=""
                                    >
                                      <img
                                        src={CoinSvg}
                                        className="me-2"
                                      />
                                      <span>Coins</span>
                                    </InputGroup.Text>
                                  </InputGroup>
                                </Col>
                                <Col
                                  lg="auto"
                                  className="d-flex mb-3 mb-lg-0 align-item-center"
                                >
                                  {index ===
                                  rewardData.purchaseRange.length - 1 ? (
                                    <Button
                                      variant="link"
                                      className="btn-flush"
                                      onClick={() => {
                                        handleAddMore();
                                      }}
                                      //  disabled={loading}
                                    >
                                      <img src={AddSvg} />
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {rewardData.purchaseRange.length !== 1 ? (
                                    <Button
                                      variant="link"
                                      className="btn-flush"
                                      onClick={() => {
                                        handleRemove(index);
                                      }}
                                      //  disabled={loading}
                                    >
                                      <img
                                        className="mt-2 ms-5"
                                        height="25px"
                                        width="25px"
                                        src={CloseImage}
                                        alt=""
                                      />
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                </Col>
                              </Row>
                            );
                          })}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Col
                    xs={12}
                    className="mt-6"
                  >
                    <Row className="justify-content-between">
                      <Col
                        lg={2}
                        className="align-self-lg-start mt-lg-2"
                      >
                        <label
                          htmlFor=""
                          className="fs-16 fw-500 mb-lg-0 mb-3 "
                        >
                          {PromotionAndCampaignString.description}
                        </label>
                      </Col>
                      <Col lg={10}>
                        <Form.Control
                          className={clsx(
                            'form-control-custom border bg-white  ',
                            validations.description
                              ? 'border-danger'
                              : 'border-gray-300'
                          )}
                          placeholder="Enter description here…"
                          as="textarea"
                          rows={5}
                          value={rewardData?.description}
                          onChange={(event: any) => {
                            handleChange(
                              event.target.value.trimStart(),
                              'description'
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={12}
                    className="mt-6"
                  >
                    <Row className="justify-content-between">
                      <Col md={2}>
                        <label
                          className="form-check-label text-black fs-16 fw-500 mb-lg-0 required"
                          htmlFor="flexRadioDefault1"
                        >
                          Reward banner placement
                        </label>
                      </Col>
                      <Col
                        md={10}
                        className="mt-4"
                      >
                        <div className="d-flex flex-wrap mb-6 gap-2 mt-2 align-items-center">
                          <div className="form-check me-4 d-flex align-items-center ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioHome"
                              value={HomePagePlacement.toString()}
                              checked={
                                rewardData.placement ===
                                HomePagePlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioHome"
                            >
                              Home page
                            </label>
                          </div>
                          <div className="form-check me-4 d-flex align-items-center">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioCategory"
                              value={CategoryPagePlacement.toString()}
                              checked={
                                rewardData.placement ===
                                CategoryPagePlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioCategory"
                            >
                              Category page
                            </label>
                          </div>
                          <div className="form-check me-4 d-flex align-items-center ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioProduct"
                              value={ProductPlacement.toString()}
                              checked={
                                rewardData.placement ===
                                ProductPlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioProduct"
                            >
                              Product page
                            </label>
                          </div>
                          <div className="form-check me-4 d-flex align-items-center ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioBrand"
                              value={BrandPlacement.toString()}
                              checked={
                                rewardData.placement ===
                                BrandPlacement.toString()
                              }
                              onChange={(event) =>
                                handleChange(
                                  event.target.value + '',
                                  'placement'
                                )
                              }
                            />
                            <label
                              className="form-check-label text-black fs-16 fw-600 ms-4"
                              htmlFor="radioBrand"
                            >
                              Brand page
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
            <Col className="text-end mt-5">
              <Button
                type="button"
                className={clsx(
                  loading ? 'btn btn-lg btnNext' : 'btn btn-lg h-60px px-10'
                )}
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                {!loading && <span className="indicator-label">Save</span>}
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
          </>
        ) : (
          <Col xs={12}>
            <div className="d-flex align-items-center justify-content-center">
              <Loader loading={fetchLoading} />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default AddDiscountPromotion;
