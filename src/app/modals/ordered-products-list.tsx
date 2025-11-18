import { Card, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
// import { ordersDelivery } from '../../api/apiEndPoints';
import APICallService from '../../api/apiCallService';
// import {
//   Piece,
//   CartonWithDozens,
//   CartonWithPieces,
//   Dozen,
//   RouteOrderOutForDelivery,
//   RouteOrderLoadingInitiated,
//   RouteOrderNotDispatched,
//   RouteOrderCancelled,
//   RouteOrderDelivered,
//   RouteOrderCustomerNotAvailable,
//   RouteOrderDispatched,
//   RouteOrderMovedToPendingOrder,
//   RouteVehicleOrderDelivered,
// } from '../../utils/constants';
import Loader from '../../Global/loader';
import Method from '../../utils/methods';
import { ordersDelivery } from '../../api/apiEndPoints';
import { OrdersDelivery, String } from '../../utils/string';
import { Order } from '../../utils/constants';
const OrderedProductsList = (props: any) => {
  const [fetchLoader, setFetchLoader] = useState(true);
  const [details, setDetails] = useState<any>();
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      await fetchDetails();
      setFetchLoader(false);
    })();
  }, []);
  const fetchDetails = async () => {
    let apiService = new APICallService(
      ordersDelivery.orderInfo,
      props.orderDetails._id,
      '',
      '',
      false,
      '',
      Order
    );
    let response = await apiService.callAPI();
    if (response) {
      setDetails(response.record);
    }
  };
  const handleShow = (index: number) => {
    let temp = { ...details };
    temp.routesVehicles[index].isOpen = !temp.routesVehicles[index].isOpen;
    setDetails(temp);
  };
  return (
    <>
      <Modal
        centered
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-900px min-w-md-700px"
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
            Ordered products & quantities
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-5">
          <Row className="align-items-center g-6 mb-6">
            <Col
              md={12}
              className="text-center"
            >
              <span className="fs-18 fw-500">
                # {props.orderDetails.refKey} /{' '}
                {props.orderDetails.customer.name}
                {/* {props.orderDetails.refKey} / {props.orderDetails.customer.name} */}
              </span>
              <Col>
                <span className="fs-16 text-muted fw-semibold text-italic">
                  This order is placed by Customer on{' '}
                  {Method.convertDateToDDMMYYYYHHMMAMPM(
                    props.orderDetails._createdAt
                  )}
                </span>
              </Col>
            </Col>
            {/* <Col
            md={9}
            className="mx-auto "
          >
            <div className="text-center p-6 fs-18 fw-600 bg-e5f6de border-r10px">
              You have made changes in the order details.{' '}
              <br className="br" />
              The customer will have to pay additional TSh 255,000 at the time
              of delivery.
            </div>
          </Col> */}
          </Row>
          {!fetchLoader && details && Object.keys(details).length ? (
            <>
              <Card className="flex-row-fluid overflow-hidden border">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table align-middle border table-rounded table-bordered gy-5 gs-5 mb-0">
                      <thead>
                        <tr className="fs-16 fw-600 align-middle">
                          <th className="min-w-175px text-start">
                            Product name
                          </th>
                          <th className="min-w-70px text-center">Unit price</th>
                          <th className="min-w-100px text-center">
                            Total Units
                          </th>
                          {/* <th className="w-md-125px">Tax(%)</th> */}
                          {/* <th className="min-w-md-100px ">Tax amount</th> */}
                          <th className="min-w-md-100px text-center">
                            Total amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="fs-15 fw-600">
                        {!fetchLoader ? (
                          details && Object.keys(details).length ? (
                            <>
                              {details.variants.map(
                                (val: any, index: number) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="symbol symbol-md-50px symbol-30px">
                                            <span
                                              className="symbol-label"
                                              style={{
                                                backgroundImage: `url(${val.variant.media[0].url})`,
                                              }}
                                            ></span>
                                          </div>
                                          <div className="ms-3">
                                            <span>
                                              {val.variant.title.replace(
                                                /\s*\)\s*/g,
                                                ')'
                                              )}
                                            </span>
                                            <div className="fs-14 fw-500 text-dark">
                                              SKU: {val.variant.skuNumber}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <span>
                                          TSh{' '}
                                          {Method.formatCurrency(
                                            val?.amount?.toFixed(2) || 0
                                          )}
                                        </span>
                                      </td>
                                      <td className="text-center">
                                        <span>{val.stockCount}</span>
                                      </td>
                                      {/* <td>
                                    <span className="fs-15 fw-500">
                                      {val.productTax
                                        ? val.productTax + '%'
                                        : '0%'}
                                    </span>
                                  </td> */}
                                      {/* <td className="text-end">
                                    <span className="fs-15 fw-500">
                                      TSh{' '}
                                      {val.productTax
                                        ? val.beforeTaxAmount
                                        : '0'}
                                    </span>
                                  </td> */}
                                      <td className="text-center">
                                        {val?.discountByQuantitiesEnabled ? (
                                          <span className="fs-15 fw-500 text-decoration-line-through text-gray d-block">
                                            {String.TSh}{' '}
                                            {Method.formatCurrency(
                                              val.amount * val.stockCount
                                            )}
                                          </span>
                                        ) : (
                                          <></>
                                        )}
                                        <span className="fs-15 fw-500">
                                          TSh{' '}
                                          {Method.formatCurrency(
                                            val?.totalAmount || 0
                                          )}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                              <tr>
                                <td
                                  colSpan={3}
                                  className="fs-16 fw-600 text-end"
                                >
                                  {OrdersDelivery.subTotal} :
                                </td>
                                <td className="fs-16 fw-600 text-center">
                                  TSh{' '}
                                  {Method.formatCurrency(
                                    details.payment.subCharge
                                  )}
                                </td>
                                {/* <td
                                colSpan={1}
                                className="fs-16 fw-600 text-end"
                              >
                                TSh{' '}
                                {details.variants.reduce((p: any, c: any) => {
                                  let actualCharge =
                                    c.stockCount * c.originalAmount;
                                  return p + actualCharge;
                                }, 0)}
                              </td> */}
                              </tr>
                              {details?.payment?.discountValue &&
                              details?.payment?.discountValue > 0 ? (
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="fs-16 fw-600 text-end"
                                  >
                                    {'Total Discount'}:
                                  </td>
                                  <td className="fs-16 fw-600 text-center">
                                    <span className="fs-20 fw-600">{'-'}</span>
                                    {String.TSh}{' '}
                                    {details?.payment?.discountValue
                                      ? Method.formatCurrency(
                                          details.payment.discountValue
                                        )
                                      : 0}
                                  </td>
                                </tr>
                              ) : (
                                <></>
                              )}

                              <tr>
                                <td
                                  colSpan={3}
                                  className="fs-16 fw-600 text-end"
                                >
                                  {OrdersDelivery.platformFee}:
                                  {/* Tax ({details.payment.taxes[0].value === 2 ? '2%' : ''} */}
                                  {/* ): */}
                                </td>
                                <td className="fs-16 fw-600 text-center">
                                  {String.TSh}{' '}
                                  {details.payment.platformFee
                                    ? Method.formatCurrency(
                                        details.payment?.platformFee || 0
                                      )
                                    : 0}
                                  {/* TSh {details.payment.taxes[0].appliedCharge} */}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan={3}
                                  className="fs-16 fw-bold text-end"
                                >
                                  {OrdersDelivery.deliveryCharge}:
                                </td>
                                <td className="text-dark fs-16  text-center">
                                  {String.TSh}{' '}
                                  {`${
                                    details?.payment?.totalDistanceCharge
                                      ? Method.formatCurrency(
                                          details?.payment.totalDistanceCharge
                                        )
                                      : 0
                                  }`}
                                  {/* TSh {details.payment.totalCharge} */}
                                </td>
                              </tr>
                              {details?.payment?.usedWalletCoin &&
                              details?.payment?.usedWalletCoin > 0 ? (
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="fs-16 fw-600 text-end"
                                  >
                                    {'U-Mart Wallet'}:
                                  </td>
                                  <td className="fs-16 fw-600 text-center">
                                    <span className="fs-20 fw-600">{'-'}</span>
                                    {details?.payment?.usedWalletCoin
                                      ? Method.formatCurrency(
                                          details.payment.usedWalletCoin
                                        )
                                      : 0}
                                    {' Coins'}{' '}
                                  </td>
                                </tr>
                              ) : (
                                <></>
                              )}
                              <tr>
                                <td
                                  colSpan={3}
                                  className="fs-20 fw-bold text-end"
                                >
                                  {OrdersDelivery.grandTotal}:
                                </td>
                                <td className="text-dark fs-20 fw-bold text-center">
                                  {String.TSh}{' '}
                                  {Method.formatCurrency(
                                    details.payment?.totalCharge || 0
                                  )}
                                  {/* {details.variants.reduce(
                        (p: any, c: any) => p + c.commissionAmount,
                        0
                      )} */}
                                </td>
                              </tr>
                              {/* {details.payment.discounts.length ? (
                              <>
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="fs-16 fw-600 text-left"
                                  >
                                    UTrade special discount:
                                  </td>
                                  <td
                                    colSpan={1}
                                    className="fs-16 fw-600 text-end"
                                  >
                                    TSh - {details.payment.discounts[0].value}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <></>
                            )} */}
                              {/* {details.variants.reduce((p: any, c: any) => {
                              let actualCharge =
                                c.stockCount * c.originalAmount;
                              let discountedCharge = c.stockCount * c.amount;
                              return p + actualCharge - discountedCharge;
                            }, 0) > 0 ? (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="fs-16 fw-600 text-end"
                                >
                                  Product Discount:
                                </td>
                                <td
                                  colSpan={1}
                                  className="fs-16 fw-600 text-end"
                                >
                                  - TSh{' '}
                                  {details.variants.reduce(
                                    (p: any, c: any) => {
                                      let actualCharge =
                                        c.stockCount * c.originalAmount;
                                      let discountedCharge =
                                        c.stockCount * c.amount;
                                      return (
                                        p + actualCharge - discountedCharge
                                      );
                                    },
                                    0
                                  )}
                                </td>
                              </tr>
                            ) : (
                              <></>
                            )} */}
                              {/* {details.payment.taxes.length ? (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="fs-16 fw-600 text-end"
                                >
                                  {' '}
                                  Tax
                                  {details.payment.taxes[0].value === 2
                                    ? '(2%)'
                                    : ''}
                                  :
                                </td>
                                <td
                                  colSpan={1}
                                  className="fs-16 fw-600 text-end"
                                >
                                  TSh{' '}
                                  {details.payment.taxes.reduce(
                                    (p: any, c: any) => p + c.appliedCharge,
                                    0
                                  )}
                                </td>
                              </tr>
                            ) : (
                              <></>
                            )} */}
                              {/* <tr>
                              <td
                                colSpan={5}
                                className="fs-22 fw-bold text-end"
                              >
                                Grand Total:
                              </td>
                              <td
                                colSpan={1}
                                className="text-dark fs-22 fw-bold text-end"
                              >
                                TSh {details.payment.totalCharge}
                              </td>
                            </tr>
                            {details.variants.reduce(
                              (p: any, c: any) => p + c.commissionAmount,
                              0
                            ) ? (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="fs-16 fw-600 text-end"
                                >
                                  U-Trade Commission:
                                </td>
                                <td
                                  colSpan={1}
                                  className="fs-16 fw-600 text-end"
                                >
                                  TSh{' '}
                                  {details.variants.reduce(
                                    (p: any, c: any) =>
                                      p + c.commissionAmount,
                                    0
                                  )}
                                </td>
                              </tr>
                            ) : (
                              <></>
                            )}{' '} */}
                            </>
                          ) : (
                            <></>
                          )
                        ) : (
                          <>
                            <tr>
                              <td colSpan={4}>
                                <div className="d-flex justify-content-center">
                                  <Loader loading={fetchLoader} />
                                </div>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <Loader loading={fetchLoader} />
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default OrderedProductsList;
