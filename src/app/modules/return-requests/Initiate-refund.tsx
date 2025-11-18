import { useEffect, useState } from 'react';
import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ReturnRequestString,
  OrdersDelivery,
  String,
} from '../../../utils/string';
// import { RequestPending } from '../../../utils/constants';
import { FullRefund, Inventory, PartialRefund, ReturnRequestConst } from '../../../utils/constants';
import clsx from 'clsx';
import MakeRefund from '../../modals/make-refund';
import ReturnProductsModal from '../../modals/return-product-modal';
import Method from '../../../utils/methods';
import { IRefundDataType } from '../../../types';
import APICallService from '../../../api/apiCallService';
import { returnRequestEndPoints } from '../../../api/apiEndPoints';
import { returnRequestJson } from '../../../api/apiJSON/returnRequest';
import { error, success } from '../../../Global/toast';
import ReasonForReturnModal from '../../modals/reason-return-modal';
import Validations from '../../../utils/validations';
const InitiateRefund = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const requestDetails = location?.state?.details;
  const [returnRequestsDetails, setReturnRequestDetails] =
    useState<any>(requestDetails);
  const [coinValue, setCoinValue] = useState(location?.state?.coinValue || 0);
  const [refundData, setRefundData] = useState<IRefundDataType>({
    password: '',
    variants: [],
  });
  const [validation, setValidation] = useState<any>([]);
  useEffect(() => {
    if (!requestDetails) {
      return navigate('/all-return-requests', { replace: true });
    }
    const tempRefudnData = { ...refundData };
    const tempValidation: any = [...validation];
    requestDetails?.returnedVariants?.map((item: any) => {
      tempRefudnData.variants.push({
        refundAmountFull: getTotalAmountForVariant(item,false),
        refundAmountPartial: '',
        variant: item?.variant._id,
        refundType: FullRefund,
        message: '',
        name: item?.variant?.title || '',
      });
      tempValidation.push({
        refundAmountPartial: false,
        message: false,
      });
    });
    setRefundData(tempRefudnData);
    setValidation(tempValidation);
  }, [requestDetails]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReturnProductModal, setShowReturnProductModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currProduct, setCurrentProduct] = useState<any>();
  const [media, setMedia] = useState<any>([]);
  const handleCheckboxChange = (event: any, index: number) => {
    const tempRefundData = { ...refundData };
    if (event.target.name === 'partialRefund') {
      if (event.target.checked) {
        tempRefundData.variants[index].refundType = PartialRefund;
      }
    } else {
      if (event.target.checked) {
        tempRefundData.variants[index].refundType = FullRefund;
        tempRefundData.variants[index].message = '';
      }
    }
    setRefundData(tempRefundData);
  };
  function getTotalAmountForVariant(val: any, returnString: boolean = true) {
    const discount = val?.discount || 0;
    const stock = val?.stockCount || 0;
    const total = (val?.totalAmount || 0) - discount * stock;
    if (returnString) {
      return Method.formatCurrency(total || 0);
    } else {
      return total;
    }
  }
  const handleChange = (value: any, name: string, index: number) => {
    const temp = { ...refundData };
    const tempValidation: any = [...validation];
    if (name === 'PartialRefund') {
      value = value.split('.')[0];
      if (!Validations.allowNumberAndFloat(value)) {
        return;
      }
      temp.variants[index].refundAmountPartial = value;
      if (value.length) {
        tempValidation[index].refundAmountPartial = false;
      }
    } else if (name === 'FullRefund') {
      temp.variants[index].refundAmountFull = value;
    } else {
      if (temp.variants[index].refundType === PartialRefund)
        temp.variants[index].message = value;
      if (value.length) {
        tempValidation[index].message = false;
      }
    }
    setRefundData(temp);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleMakeRefund = async () => {
    const apiCallService = new APICallService(
      returnRequestEndPoints.makeRefund,
      returnRequestJson.makeRefundJson(refundData),
      { id: requestDetails._id },
      '',
      false,
      '',
      ReturnRequestConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setShowRefundModal(false);
      success('Refunded successfully!');
      navigate('/all-return-requests', { replace: true });
    }
  };
  const handleRefundModal = () => {
    const tempValidation: any = [...validation];
    let hasZeroAmount = false;
    let isPartialAmountLarge = false;
    refundData.variants.map((item, index) => {      
      if (item.refundType === PartialRefund) {
        if (item.refundAmountPartial === '0') {
          hasZeroAmount = true;
        }
        if (item.refundAmountPartial.length === 0) {
          tempValidation[index].refundAmountPartial = true;
        }
        if (item.message?.length === 0) {
          tempValidation[index].message = true;
        }
        if (
          item.refundAmountPartial &&
          +item.refundAmountFull < parseInt(item.refundAmountPartial)
        ) {
          isPartialAmountLarge = true;
        }
      } else {
        tempValidation[index].refundAmountPartial = false;
        tempValidation[index].message = false;
      }
    });
    const isValid = tempValidation.every((item: any) => {
      return !item.message && !item.refundAmountPartial;
    });
    if (isValid) {
      if (hasZeroAmount) {
        return error('Refund amount should be greater than 0.');
      } else if (isPartialAmountLarge) {
        return error('Partial Refund amount should be less than total amount.');
      }
      setShowRefundModal(true);
    }
    setValidation(tempValidation);
  };
  const handleViewReason = (item: any) => {
    setShowReasonModal(true);
    let tempMedia: any = [];
    requestDetails?.returnedVariants?.map((val: any) => {
      tempMedia = [...tempMedia, ...val.capturedMedia];
    });
    setMedia(tempMedia);
    // setCurrentProduct(item);
  };
  return (
    <>
      {showRefundModal ? (
        <MakeRefund
          show={showRefundModal}
          onHide={() => setShowRefundModal(false)}
          refundData={refundData}
          setRefundData={setRefundData}
          details={requestDetails}
          handleMakeRefund={handleMakeRefund}
          coinValue={coinValue}
          //   title="Are you sure you want to cancel this request?"
          //   btnTitle="Yes,Cancel"
        />
      ) : (
        <></>
      )}
      {showReturnProductModal ? (
        <ReturnProductsModal
          show={showReturnProductModal}
          onHide={() => {
            setShowReturnProductModal(false);
            setCurrentProduct(undefined);
          }}
          product={currProduct}
        />
      ) : (
        <></>
      )}
      {showReasonModal ? (
        <ReasonForReturnModal
          show={showReasonModal}
          onHide={() => {
            setShowReasonModal(false);
            // setCurrentItem(undefined);
          }}
          isPartial={false}
          title="Reason for return"
          background="bg-light"
          reason={requestDetails?.message}
          images={media}
          item={requestDetails}
        />
      ) : (
        <></>
      )}
      <Row className="g-8 mb-8">
        <Col md={12}>
          <Row className="align-items-center g-3">
            <Col xs>
              <h1 className="fs-22 fw-bolder mb-0">
                {' '}
                {ReturnRequestString.initateRefund}
              </h1>
            </Col>
            <Col xs="auto">
              <button
                type="button"
                className="me-2 fs-16 btn printBtn fw-bold text-primary btn-lg"
                onClick={handleViewReason}
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                View reason
              </button>
            </Col>
          </Row>
        </Col>
        {requestDetails ? (
          <Col xs>
            <Card className="border">
              <Card.Header className="bg-light align-items-center">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <Card.Title className="d-flex justify-content-between w-100">
                    <div className="fs-22 fw-bolder">
                      {OrdersDelivery.basicDetails}
                    </div>
                    <div className="fs-16 text-primary fw-bold">
                      <Link to="#">View order details</Link>
                    </div>
                  </Card.Title>
                </div>
              </Card.Header>
              <Card.Body className="pb-3">
                <Row>
                  <Col md={6}>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.customerName}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.customer?.name || 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.totalItems}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.totalReturnedVariants || 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.requestId}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.refKey
                            ? '#' + returnRequestsDetails.refKey
                            : 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.orderDate}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.orderDate
                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                returnRequestsDetails.orderDate
                              )
                            : ''}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {/* {dateText[tab]}: */}
                          {ReturnRequestString.requestInitiateOn}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?._createdAt
                            ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                                returnRequestsDetails._createdAt
                              )
                            : ''}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.assignDeliveryUser}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.deliveryUser?.name || 'NA'}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-5">
                      <Col
                        md={5}
                        xs={4}
                      >
                        <label className=" fs-16 fw-500 text-dark">
                          {ReturnRequestString.pickupAddress}
                        </label>
                      </Col>
                      <Col
                        md={7}
                        xs={8}
                      >
                        <span className="fw-bold fs-16 fw-600 text-dark">
                          {returnRequestsDetails?.address?.addressLine1 || 'NA'}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <></>
        )}
        {requestDetails && refundData.variants.length && (
          <Col md={12}>
            <Card className="border border-r10px">
              <Card.Body className="p-0 pb-2">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gs-9 gy-6 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                        <th className="w-md-650px min-w-275px">
                          {OrdersDelivery.productName}
                        </th>
                        <th className="min-w-md-150px">
                          {OrdersDelivery.unitPrice}
                        </th>
                        <th className="w-md-125px">
                          {ReturnRequestString.totalUnits}
                        </th>
                        <th className="min-w-md-125px text-center">
                          {ReturnRequestString.totalPrice}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnRequestsDetails?.returnedVariants?.map(
                        (product: any, index: number) => (
                          <>
                            <tr
                              key={index}
                              className="border-0"
                            >
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="symbol symbol-50px border"
                                    onClick={() => {
                                      setShowReturnProductModal(true);
                                      setCurrentProduct(product);
                                    }}
                                  >
                                    <span
                                      className="symbol-label bgi-contain"
                                      style={{
                                        backgroundImage: `url(${
                                          product?.variant?.media[0]?.url || ''
                                        })`,
                                      }}
                                    ></span>
                                  </div>
                                  <div className="d-flex flex-column ms-5">
                                    <span className="text-dark fw-600 fs-15 d-block">
                                      {product?.variant?.title || ''}
                                    </span>
                                    <span className=" fw-500 fs-15 d-block">
                                      {OrdersDelivery.sku}
                                      {': '}
                                      {product?.variant?.skuNumber || ''}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-9 ">
                                  <div className="fs-16 fw-600">
                                    How the refund will be processed?
                                  </div>
                                  <div className="mt-5 ">
                                    <span className="me-8">
                                      <input
                                        className={clsx(
                                          'form-check-input pt-1 h-30px w-30px  me-3',
                                          refundData.variants[index]
                                            .refundType === FullRefund
                                            ? 'border border-5 border-primary'
                                            : ''
                                        )}
                                        type="checkbox"
                                        name="fullRefund"
                                        checked={
                                          refundData.variants[index]
                                            .refundType === FullRefund
                                        }
                                        onChange={(event) => {
                                          handleCheckboxChange(event, index);
                                        }}
                                      />
                                      <label className="form-check-label fs-16 fw-500 text-dark ms-2">
                                        {'Full refund'}
                                      </label>
                                    </span>
                                    <span className="me-8">
                                      <input
                                        className={clsx(
                                          'form-check-input pt-1 h-30px w-30px  me-3',
                                          refundData.variants[index]
                                            .refundType === PartialRefund
                                            ? 'border border-5 border-primary'
                                            : ''
                                        )}
                                        type="checkbox"
                                        name="partialRefund"
                                        checked={
                                          refundData.variants[index]
                                            .refundType === PartialRefund
                                        }
                                        onChange={(event) => {
                                          handleCheckboxChange(event, index);
                                        }}
                                        value={0}
                                        id={``}
                                      />
                                      <label className="form-check-label fs-16 fw-500 text-dark ms-2">
                                        {'Partial refund'}
                                      </label>
                                    </span>
                                  </div>
                                </div>
                              </td>{' '}
                              {/* <td className="">
                                <span className="fs-15 fw-500 ">
                                  {`TSh ${
                                    product?.amount
                                      ? Method.formatCurrency(product.amount)
                                      : 0
                                  }`}
                                </span>
                              </td> */}
                              <td>
                                {product?.discount && product?.discount > 0 ? (
                                  <>
                                    <span className="fs-15 fw-500 d-block text-decoration-line-through text-gray">
                                      {String.TSh}
                                      {''}{' '}
                                      {Method.formatCurrency(
                                        product.amount || 0
                                      )}
                                    </span>
                                    <span className="fs-15 fw-500 d-block">
                                      {String.TSh}
                                      {''}{' '}
                                      {Method.formatCurrency(
                                        product.amount - product.discount || 0
                                      )}
                                    </span>
                                  </>
                                ) : (
                                  <span className="fs-15 fw-500 d-block">
                                    {String.TSh}
                                    {''}{' '}
                                    {Method.formatCurrency(product.amount || 0)}
                                  </span>
                                )}
                              </td>
                              <td className="">
                                <span className="fs-15 fw-500">
                                  {product?.returnedStockCount
                                    ? product.returnedStockCount < 10
                                      ? '0' + product.returnedStockCount
                                      : product.returnedStockCount
                                    : 0}{' '}
                                  {product?.returnedStockCount
                                    ? product?.returnedStockCount > 1
                                      ? 'Units'
                                      : 'Unit'
                                    : ''}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="fs-15 fw-500">
                                  {`TSh ${
                                   getTotalAmountForVariant(product)
                                  }`}
                                </span>
                              </td>
                            </tr>
                            <tr className="border-0">
                              <td
                                colSpan={4}
                                className="py-0 border-0"
                              >
                                {refundData.variants[index].refundType ===
                                PartialRefund ? (
                                  <div
                                    className={clsx(
                                      'd-flex py-4 pb-6',
                                      index !== returnRequestsDetails.length - 1
                                        ? ' bottom-border'
                                        : ''
                                    )}
                                  >
                                    <InputGroup
                                      className={clsx(
                                        'min-h-40px  border border-r5px w-md-450px me-5'
                                      )}
                                    >
                                      <Form.Control
                                        className={clsx(
                                          'border-1 fs-14 fw-500 text-dark h-60px bg-light form-placeholder borderRight-0',
                                          {
                                            'border-danger':
                                              validation[index]
                                                ?.refundAmountPartial,
                                          }
                                        )}
                                        aria-label="Default"
                                        aria-describedby=""
                                        value={
                                          refundData?.variants[index]
                                            ?.refundAmountPartial
                                        }
                                        placeholder="Partial refund amount"
                                        onChange={(event: any) => {
                                          handleChange(
                                            event.target.value.trimStart(),
                                            'PartialRefund',
                                            index
                                          );
                                        }}
                                        onKeyPress={(event: any) => {
                                          handleOnKeyPress(event);
                                        }}
                                      />
                                      <InputGroup.Text
                                        className={clsx(
                                          'bg-light border-1 text-gray h-60px',
                                          {
                                            'border-danger':
                                              validation[index]
                                                ?.refundAmountPartial,
                                          }
                                        )}
                                        id=""
                                      >
                                        <em>Partial refund</em>
                                      </InputGroup.Text>
                                    </InputGroup>
                                    <Form.Control
                                      as="textarea"
                                      className={clsx(
                                        'form-control-custom border-1 bg-light fw-500 form-placeholder',
                                        {
                                          'border-danger':
                                            validation[index]?.message,
                                        }
                                      )}
                                      rows={1}
                                      placeholder="Type here the reason for partial refund…"
                                      onChange={(event: any) => {
                                        handleChange(
                                          event.target.value.trimStart(),
                                          'message',
                                          index
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={clsx(
                                      'd-flex py-4 pb-6',
                                      index !== returnRequestsDetails.length - 1
                                        ? ' bottom-border'
                                        : ''
                                    )}
                                  >
                                    <InputGroup
                                      className={clsx(
                                        'min-h-40px  border border-r5px w-md-300px me-5'
                                      )}
                                    >
                                      <Form.Control
                                        className={clsx(
                                          'border-1 fs-14 fw-500 text-gray-700 h-60px bg-light form-placeholder borderRight-0'
                                        )}
                                        aria-label="Default"
                                        aria-describedby=""
                                        value={
                                          refundData.variants[index]
                                            .refundAmountFull
                                        }
                                        disabled={true}
                                        readOnly
                                        placeholder="Full refund amount"
                                        onChange={(event: any) => {
                                          handleChange(
                                            event.target.value.trimStart(),
                                            'FullRefund',
                                            index
                                          );
                                        }}
                                        onKeyPress={(event: any) => {
                                          handleOnKeyPress(event);
                                        }}
                                      />
                                      <InputGroup.Text
                                        className="bg-light border-1 text-gray h-60px"
                                        id=""
                                      >
                                        <em>Full refund</em>
                                      </InputGroup.Text>
                                    </InputGroup>
                                  </div>
                                )}
                              </td>
                            </tr>
                          </>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
            <div className="mt-7">
              <button
                className="btn btn-primary fs-16 fw-bold fw-600 btn-lg h-60px"
                style={{
                  whiteSpace: 'nowrap',
                }}
                onClick={() => {
                  handleRefundModal();
                  // navigate('/all-return-requests/return-request-details', {
                  //   state: { tab: NewRequest },
                  // });
                }}
              >
                {'Make refund'}
              </button>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};
export default InitiateRefund;
