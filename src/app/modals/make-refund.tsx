import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import EyeIcon from '../../umart_admin/assets/media/svg_uMart/view.svg';
import EyeGreen from '../../umart_admin/assets/media/svg_uMart/eye-green.svg';
import clsx from 'clsx';
import { useState } from 'react';
import { ReturnRequestString } from '../../utils/string';
import { PartialRefund } from '../../utils/constants';
import CoinIcon from '../../umart_admin/assets/media/coin.svg';
import Method from '../../utils/methods';
const MakeRefund = (props: any) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handlePasswordChange = (value: any) => {
    const temp = { ...props.refundData };
    temp.password = value;
    if (value.trim().length) {
      setValidation(false);
    }
    props.setRefundData(temp);
  };
  const handleSubmit = async () => {
    if (props.refundData.password.trim().length) {
      setLoading(true);
      await props.handleMakeRefund();
      setLoading(false);
    } else {
      setValidation(true);
    }
  };
  const getRefundableAmount = (variants: any) => {
    if (variants && variants.length) {
      return variants.reduce((acc: number, item: any) => {
        if (item.refundType === PartialRefund) {
          return (
            acc +
            (item.refundAmountPartial.length
              ? parseInt(item.refundAmountPartial)
              : 0)
          );
        } else {
          return (
            acc + (item.refundAmountFull ? parseInt(item.refundAmountFull) : 0)
          );
        }
      }, 0);
    }
    return 0;
  };
  return (
    <Modal
      centered
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-dialog-centered min-w-lg-700px min-w-md-700px"
      className="border-r10px"
      contentClassName="p-5"
    >
      <Modal.Header className="border-bottom-0 text-center pb-6 mx-auto">
        <div className="symbol symbol-md-40px symbol-35px close-inner-top-3">
          <img
            width={40}
            height={40}
            src={CrossSvg}
            alt=""
            onClick={props.onHide}
          />
        </div>
        <Modal.Title className="fs-26 fw-bolder mw-lg-450px  mb-0">
          <div>{`Make a refund payment of ${
            props?.details?.customer?.name || ''
          } `}</div>
          <div>{`(Order Id: #${props?.details?.orderRefKey || ''})`}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="gy-5">
          <Col md={6}>
            <Card className="border-gray-300">
              <Card.Body className="p-3 ps-6 h-85px ">
                <div className="fs-22 fw-700">
                  {props?.details?.totalReturnedUnits
                    ? props?.details?.totalReturnedUnits
                    : ''}
                  {props?.details?.totalReturnedUnits
                    ? props?.details?.totalReturnedUnits > 1
                      ? ' Units'
                      : ' Unit'
                    : ''}
                </div>
                <div className="fs-16 fw-500">
                  {ReturnRequestString.totalUnits}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-gray-300">
              <Card.Body className="p-3 ps-6 h-85px">
                <div className="fs-22 fw-700">
                  {props?.details.deliveryUser?.name || 'NA'}
                </div>
                <div className="fs-16 fw-500">
                  {ReturnRequestString.deliveryUser}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-gray-300">
              <Card.Body className="p-3 ps-6 h-85px">
                <div className="fs-22 fw-700">
                  TSh{' '}
                  {props?.refundData?.variants &&
                  props.refundData.variants.length
                    ? Method.formatCurrency(
                        getRefundableAmount(props.refundData.variants)
                      )
                    : 0}
                </div>
                <div className="fs-16 fw-500">
                  {ReturnRequestString.totalRefundableAmount}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-gray-300">
              <Card.Body className="p-3 ps-6 h-85px d-flex justify-content-between align-items-center">
                <div>
                  <div className="fs-22 fw-700">
                    {props?.refundData?.variants &&
                    props.refundData.variants.length
                      ? props?.coinValue
                        ? Method.formatCurrency(
                            getRefundableAmount(props.refundData.variants) *
                              props.coinValue
                          )
                        : 0
                      : 0}
                  </div>
                  <div className="fs-16 fw-500">
                    {ReturnRequestString.coinExchange}
                  </div>
                </div>
                <div>
                  <img
                    src={CoinIcon}
                    alt="coin"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5 gy-4">
          <Col xs={12}>
            <div className="fs-16 fw-600">
              Please enter your account password to mark as refunded.
            </div>
          </Col>
          <Col xs={6}>
            <div
              className={clsx(
                'input-group input-group-solid  border rounded  bg-light',
                {
                  'border-danger': validation,
                },
                {
                  'is-valid': validation,
                }
              )}
            >
              <input
                placeholder="Password"
                className={clsx('form-control form-control-custom')}
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                autoComplete="off"
                value={props.refundData.password}
                onChange={(event: any) =>
                  handlePasswordChange(event.target.value.trimStart())
                }
              />
              <span
                className="input-group-text fs-1 fw-500 text-dark bg-light "
                id="basic-addon1"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <>
                    <img src={EyeGreen} />
                  </>
                ) : (
                  <img src={EyeIcon} />
                )}
              </span>
            </div>
          </Col>
          <Col
            xs={12}
            className="mt-7"
          >
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  handleSubmit();
                }}
                className="h-60px"
                disabled={loading}
              >
                {!loading && (
                  <span className="indicator-label">
                    {' '}
                    {ReturnRequestString.markAsRefunded}
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
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
export default MakeRefund;
