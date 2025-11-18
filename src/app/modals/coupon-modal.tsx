import { Modal, Button, Col, Row, Card } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import { instantOrderApiJson } from '../../api/apiJSON/placeOrder';
import { success } from '../../Global/toast';
import { placeOrderToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Global/loader';
import Method from '../../utils/methods';
import { Order } from '../../utils/constants';
const CouponModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [couponList, setCouponList] = useState<any>([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await fetchCouponList();
    })();
  }, []);
  const fetchCouponList = async () => {
    setFetchLoading(true);
    const data = {
      buyer: props.buyer,
      state: 2,
      promotionType: 2,
      interfaceType: 'i1',
    };
    const apiCallService = new APICallService(placeOrder.getCouponList, data,'','',false,'',Order);
    const response = await apiCallService.callAPI();
    if (response) {
      setCouponList(response?.records || []);
    }
    setFetchLoading(false);
  };
  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-590px"
        className="border-r10px"
        centered
        size="lg"
        {...(loading ? { backdrop: 'static' } : {})}
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <img
            className="close-inner-top"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={() => {
              if (!loading) {
                props.onHide();
              }
            }}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            Apply a coupon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-5 pb-1">
          <Row>
            {fetchLoading ? (
              <Col xs={12}>
                <div className="d-flex justify-content-center mt-4 min-h-150px">
                  <Loader loading={fetchLoading} />
                </div>
              </Col>
            ) : (
              <Col xs={12}>
                <Card className="border border-r10px ">
                  <Card.Body className=" pb-0 pt-0">
                    <div className="table-responsive h-450px overflow-y-scroll">
                      <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0 ">
                        <thead>
                          <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-50px align-middle">
                            <th className="min-w-125px">{'Coupon'}</th>
                            <th className="min-w-160px">{'Title'}</th>
                            <th className="min-w-100px ">
                              {'Minimum purchase amount'}
                            </th>
                            <th className="min-w-100px ">{'Code'}</th>
                            <th className=""></th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <>
                              <td colSpan={6}>
                                <div className="w-100 d-flex justify-content-center">
                                  <Loader loading={loading} />
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              {couponList.length ? (
                                <>
                                  {couponList.map(
                                    (customVal: any, customIndex: number) => {
                                      return (
                                        <tr key={customVal._id}>
                                          <td className="py-2">
                                            <>
                                              <div className="symbol symbol-50px border border-r10px m .symbol-2by3 bgi-contain">
                                                <div
                                                  className="symbol-label bgi-cover w-90px"
                                                  style={{
                                                    backgroundImage: `url('${
                                                      customVal?.image || ''
                                                    }')`,
                                                  }}
                                                ></div>
                                              </div>
                                            </>
                                          </td>
                                          <td>
                                            <span className="fs-15 fw-600">
                                              {customVal?.title}
                                            </span>
                                          </td>
                                          <td>
                                            <span className="fs-15 fw-600">
                                              TSh{' '}
                                              {Method.formatCurrency(
                                                customVal?.minimumPurchaseAmount ||
                                                  0
                                              )}
                                            </span>
                                          </td>
                                          <td>
                                            <span className="fs-15 fw-600">
                                              {customVal?.couponCode}
                                            </span>
                                          </td>
                                          <td className="text-end">
                                            <div className="d-flex flex-nowrap justify-content-end justify-content-xl-center align-items-center">
                                              {props?.selectedCoupon &&
                                              props?.selectedCoupon._id ==
                                                customVal?._id ? (
                                                <button
                                                  className="btn btn-danger fs-14 fw-600 me-5"
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                  }}
                                                  onClick={() => {
                                                    props.setSelectedCoupon(
                                                      undefined
                                                    );
                                                  }}
                                                  disabled={
                                                    customVal?.minimumPurchaseAmount >
                                                    props.cartTotal
                                                  }
                                                >
                                                  Remove
                                                </button>
                                              ) : (
                                                <button
                                                  className="btn btn-primary fs-14 fw-600 me-5"
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                  }}
                                                  onClick={() => {
                                                    props.setSelectedCoupon(
                                                      customVal
                                                    );
                                                    props.onHide();
                                                  }}
                                                  disabled={
                                                    customVal?.minimumPurchaseAmount >
                                                    props.cartTotal
                                                  }
                                                >
                                                  Apply
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </>
                              ) : (
                                <tr>
                                  <td colSpan={6}>
                                    <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                      No Data Found
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Modal.Body>
        {/* <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {!loading && (
              <span className="indicator-label">Confirm, Order</span>
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
        </Modal.Footer> */}
        {/* {props.flag && (
        )} */}
      </Modal>
    </>
  );
};
export default CouponModal;
