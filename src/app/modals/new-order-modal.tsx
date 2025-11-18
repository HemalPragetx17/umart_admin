import { Button, Modal } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import Method from '../../utils/methods';
import { OrdersDelivery, String } from '../../utils/string';
import useMediaQuery from '../../utils/useMediaQuery';
const paymentTypesArray = ['Cash', 'Tigo Pesa', 'Coin'];
type IPropsType = {
  show: boolean;
  onHide: () => void;
  data: any;
  onClose: (id: string) => void;
};
const NewOrderModal = (props: IPropsType) => {
  const isTablet = useMediaQuery('(max-width: 991px)');
  const renderModalEffect = (
    length: number,
    width: number,
    level: number
  ): React.ReactElement | null => {
    if (length <= 1 || level >= 2) return null;
    return (
      <div
        className="bg-gray-100 h-20px position-relative rounded-3  mx-auto"
        style={{
          top: '-15px',
          opacity: '0.8',
          zIndex: '-1',
          width: width + 'px',
        }}
      >
        {renderModalEffect(length - 1, width - 28, level + 1)}
      </div>
    );
  };
  return (
    <div className={`custom-modal ${props.show ? 'show' : 'hide'}`}>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered w-lg-610px "
        className="rounded-4 position-absolute custom-modal-content"
        centered
        size="lg"
        // {...(loading ? { backdrop: 'static' } : {})}
      >
        {renderModalEffect(props.data.length, isTablet ? 480 : 568, 0)}
        <Modal.Header className="border-bottom-0 pb-0 ">
          <img
            className="position-absolute top-0 end-0 m-6 cursor-pointer"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={() => {
              props.onClose(props.data[0]?._id);
            }}
          />
          <Modal.Title className="fs-26 fw-bolder  text-black">
            {'New order'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`pb-0 pt-5 overflow-auto h-500px`}>
          {/* <div className="separator mt-5"></div> */}
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fs-18 fw-600 text-black">{`Order ID: ${
                  props?.data[0]?.refKey ? '#' + props?.data[0]?.refKey : ''
                }`}</div>
                <div className="fs-16 fw-400 text-7c7c7c">{`${
                  props?.data[0]?._createdAt
                    ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                        props?.data[0]?._createdAt,
                        ', '
                      )
                    : ''
                }`}</div>
              </div>
              <div className="fs-16 fw-400 text-7c7c7c">
                Ordered by{' '}
                <span className="fw-600">
                  {props?.data[0]?.customer?.name || ''}
                </span>
              </div>
            </div>
            <div className="text-black mt-5">
              <div className="table-responsive">
                <table className="table table-rounded table-row-bordered align-middle gs-9 gy-6 mb-0">
                  <thead>
                    <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                      <th className="w-md-475px min-w-200px">
                        {OrdersDelivery.productName}
                      </th>
                      <th className="min-w-md-100px">
                        {OrdersDelivery.unitPrice}
                      </th>
                      <th className="min-w-100px">{OrdersDelivery.qtyPrice}</th>
                      <th className="min-w-md-150px text-end">
                        {OrdersDelivery.totalAmount}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props?.data[0]?.variants?.map(
                      (product: any, index: number) => (
                        <tr key={product?.variant?._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="symbol symbol-50px border">
                                <span
                                  className="symbol-label bgi-contain"
                                  style={{
                                    backgroundImage: `url(${product.variant.media[0].url})`,
                                  }}
                                ></span>
                              </div>
                              <div className="d-flex flex-column ms-5">
                                <span className="text-dark fw-600 fs-15 d-block">
                                  {product?.variant?.title || ''}
                                </span>
                                <span className="text-dark fw-500 fs-15 d-block">
                                  {OrdersDelivery.sku}{' '}
                                  {product?.variant?.skuNumber || ''}
                                </span>
                              </div>
                            </div>
                          </td>{' '}
                          <td>
                            {product?.discount && product?.discount > 0 ? (
                              <>
                                <span className="fs-15 fw-500 d-block text-decoration-line-through text-gray">
                                  {String.TSh}
                                  {''}{' '}
                                  {Method.formatCurrency(product.amount || 0)}
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
                                {Method.formatCurrency(product?.amount || 0)}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="fs-15 fw-500">
                              {product.stockCount}{' '}
                              {`${
                                product.stockCount <= 1
                                  ? String.singleUnit
                                  : String.unit
                              }`}
                            </span>
                          </td>
                          <td className="text-end">
                            {product?.discountByQuantitiesEnabled ? (
                              <span className="fs-15 fw-500 text-decoration-line-through text-gray d-block">
                                {String.TSh}{' '}
                                {Method.formatCurrency(
                                  product.amount * product.stockCount
                                )}
                              </span>
                            ) : (
                              <></>
                            )}
                            <span className="fs-15 fw-500">
                              {String.TSh}
                              {''}{' '}
                              {Method.formatCurrency(product.totalAmount || 0)}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                    {/* {details.payment.discounts.length ? ( */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="separator my-5 mt-6"></div>
            <div className="px-5 mb-9">
              <div className="d-flex justify-content-between text-black mb-2">
                <div>
                  <span className="fs-16 fw-500">
                    {' '}
                    {OrdersDelivery.subTotal}:
                  </span>
                </div>
                <div className="fs-16 fw-500">
                  Tsh{' '}
                  {Method.formatCurrency(
                    props?.data[0]?.payment?.subCharge || 0
                  )}
                </div>
              </div>
              {props?.data[0]?.appliedCampaign?.discountValue ? (
                <div className="d-flex justify-content-between text-black mb-2">
                  <div>
                    <span className="fs-16 fw-500">Discount value</span>
                  </div>
                  <div className="fs-16 fw-500">
                    -Tsh{' '}
                    {Method.formatCurrency(
                      props?.data[0]?.appliedCampaign?.discountValue || 0
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="d-flex justify-content-between text-black mb-2">
                <div>
                  <span className="fs-16 fw-500">Platform fee</span>
                </div>
                <div className="fs-16 fw-500">
                  Tsh{' '}
                  {Method.formatCurrency(
                    props?.data[0]?.payment?.platformFee || 0
                  )}
                </div>
              </div>
              {props?.data[0]?.payment?.totalDistanceCharge ? (
                <div className="d-flex justify-content-between text-black mb-2">
                  <div>
                    <span className="fs-16 fw-500">Distance charge</span>
                  </div>
                  <div className="fs-16 fw-500">
                    Tsh{' '}
                    {Method.formatCurrency(
                      props?.data[0]?.payment?.totalDistanceCharge || 0
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="d-flex justify-content-between text-black">
                <div>
                  <span className="fs-18 fw-700">Grand Total</span>
                  <em className="fs-12 fw-400 ms-2 text-primary">
                    {
                      paymentTypesArray[
                        props.data[0]?.payment?.paymentMode - 1 || 0
                      ]
                    }
                  </em>
                </div>
                <div className="fs-18 fw-600">
                  Tsh{' '}
                  {Method.formatCurrency(
                    props?.data[0]?.payment?.totalCharge || 0
                  )}
                </div>
              </div>
            </div>
            <div className="text-center pb-4">
              <Button
                variant="primary"
                className="fs-16 text-white"
                onClick={() => {
                  props.onClose(props.data[0]?._id);
                }}
              >
                Okay
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default NewOrderModal;
