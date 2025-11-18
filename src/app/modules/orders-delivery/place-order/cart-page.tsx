import { Card, Col, Row } from 'react-bootstrap';
import Method from '../../../../utils/methods';
import {
  FlatDiscount,
  Order,
  PercentageDiscount,
} from '../../../../utils/constants';
import { useEffect, useState } from 'react';
import CouponModal from '../../../modals/coupon-modal';
import APICallService from '../../../../api/apiCallService';
import { placeOrder, product } from '../../../../api/apiEndPoints';
type PropType = {
  selectedProducts: any;
  initData: any;
  buyer: any;
  appliedCartDiscount: any;
  setAppliedCartDiscount: any;
  selectedCoupon: any;
  setSelectedCoupon: any;
  checkStockResult: any;
};
const CartPage = (props: PropType) => {
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(true);
  // useEffect(() => {
  //   (async () => {
  //     await fetchCartDiscounts();
  //   })();
  // }, []);
  const getTotalAmount = (productVal: any) => {
    const unitPrice = getDiscountValue(productVal);
    const quantity = productVal?.quantityTypes[0]?.stockCount || 0;
    return Method.formatCurrency(unitPrice * quantity);
  };
  const getRealTotalOrderValue = (products: any) => {
    let total = 0;
    products.forEach((productVal: any) => {
      if (productVal?.isDiscountByQuantity && productVal?.bunchObj) {
        total +=
          productVal.quantityTypes[0]['discountsByQuantities'][
            productVal?.bunchObj?.index
          ]['stockCount'] * productVal?.bunchObj?.discountAmt;
      } else {
        const unitPrice = productVal?.quantityTypes[0]?.amount || 0;
        const quantity = productVal?.quantityTypes[0]?.stockCount || 0;
        total += unitPrice * quantity;
      }
    });
    return total || 0;
  };
  const getTotalOrderValue = (products: any) => {
    let total = 0;
    products.forEach((productVal: any) => {
      if (productVal?.isDiscountByQuantity && productVal?.bunchObj) {
        total +=
          productVal.quantityTypes[0]['discountsByQuantities'][
            productVal?.bunchObj?.index
          ]['stockCount'] * productVal?.bunchObj?.discountAmt;
      } else {
        const unitPrice = getDiscountValue(productVal);
        const quantity = productVal?.quantityTypes[0]?.stockCount || 0;
        total += unitPrice * quantity;
      }
    });
    return total || 0;
  };
  const getDiscountValue = (product: any) => {
    const type = product?.quantityTypes[0]?.discountType;
    let total = product?.quantityTypes[0]?.amount;
    let discountValue = product?.quantityTypes[0]?.discountValue || 0;
    if (type == FlatDiscount) {
      total -= discountValue;
    } else if (type == PercentageDiscount) {
      total -= total * (discountValue / 100);
      total = Math.round(total);
    }
    return total;
  };
  const getCartDiscount = (discountObj: any) => {
    if (discountObj.discountType == FlatDiscount) {
      return discountObj.discountValue;
    } else {
      return Math.round(
        (discountObj.discountValue / 100) *
          getTotalOrderValue(props.selectedProducts)
      );
    }
  };
  return (
    <>
      {showCouponModal && props.buyer ? (
        <CouponModal
          show={showCouponModal}
          onHide={() => setShowCouponModal(false)}
          buyer={props.buyer}
          setSelectedCoupon={props.setSelectedCoupon}
          selectedCoupon={props.selectedCoupon}
          cartTotal={getTotalOrderValue(props.selectedProducts) || 0}
        />
      ) : (
        <></>
      )}
      <div>
        <Row className="g-8 mb-8 ">
          <Col xs={12}>
            <Card className="border">
              <Card.Header className="bg-light align-items-center pe-0">
                <div className="d-flex align-items-center  w-100">
                  <Card.Title className="fs-20 fw-bolder d-flex justify-content-between w-100 pe-0">
                    <div>{'Order Details'}</div>
                    <button
                      type="button"
                      className="me-2  btn printBtn text-primary btn-lg"
                      onClick={() => setShowCouponModal(true)}
                      disabled={!props.buyer}
                    >
                      <span className="indicator-label fs-16 fw-bold">
                        View Coupons
                      </span>
                    </button>
                  </Card.Title>
                </div>
              </Card.Header>
              <Card.Body className="pb-3">
                <Row>
                  <Col xs={12}>
                    <div className="d-flex justify-content-between">
                      <span className="fs-18 fw-500">
                        TSh {`(${props.selectedProducts.length} items) :`}
                      </span>
                      <span className="">
                        <div className="fs-18 fw-500">
                          TSh{' '}
                          {Method.formatCurrency(
                            getTotalOrderValue(props.selectedProducts) || 0
                          )}
                        </div>
                        <div className="text-decoration-line-through fs-14 text-gray-500 text-end">
                          TSh{' '}
                          {Method.formatCurrency(
                            getRealTotalOrderValue(props.selectedProducts) || 0
                          )}
                        </div>
                      </span>
                    </div>
                  </Col>
                  {props.selectedCoupon ? (
                    <Col
                      xs={12}
                      className="my-1"
                    >
                      <div className="d-flex justify-content-between">
                        <span className="fs-18 fw-500">Coupon savings :</span>
                        <span className="fs-18 fw-500 text-primary">
                          - TSh{' '}
                          {Method.formatCurrency(
                            getCartDiscount(props.selectedCoupon) || 0
                          )}
                        </span>
                      </div>
                    </Col>
                  ) : props.appliedCartDiscount ? (
                    <Col
                      xs={12}
                      className="my-1"
                    >
                      <div className="d-flex justify-content-between">
                        <span className="fs-18 fw-500">
                          Cart value discount :
                        </span>
                        <span className="fs-18 fw-500 text-primary">
                          - TSh{' '}
                          {Method.formatCurrency(
                            getCartDiscount(props.appliedCartDiscount) || 0
                          )}
                        </span>
                      </div>
                    </Col>
                  ) : (
                    <></>
                  )}
                  <Col
                    xs={12}
                    className="my-3"
                  >
                    <div className="d-flex justify-content-between">
                      <span className="fs-18 fw-500">Platform fees:</span>
                      <span className="fs-18 fw-500">
                        TSh {props.initData?.platformFee || 0}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="d-flex justify-content-between">
                      <span className="fs-20 fw-500">Total Amount:</span>
                      <span className="fs-20 fw-500">
                        TSh{' '}
                        {Method.formatCurrency(
                          getTotalOrderValue(props.selectedProducts) +
                            (props.initData?.platformFee || 0) -
                            (props?.appliedCartDiscount || props?.selectedCoupon
                              ? getCartDiscount(
                                  props?.selectedCoupon ||
                                    props.appliedCartDiscount
                                )
                              : 0)
                        )}
                      </span>
                    </div>
                    {props?.checkStockResult?.reward?.discountValue ? (
                      <div className="mt-3 text-bg-primary-light my-3 mt-5">
                        <span className="me-2 bg-light-primary text-primary px-5 fs-15 fw-500 py-2 rounded-1">
                          {`🎉 Cheers! Customer will get ${props?.checkStockResult?.reward?.discountValue} coins on this order.`}
                        </span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default CartPage;
