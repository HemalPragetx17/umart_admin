import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import APICallService from '../../api/apiCallService';
import Loader from '../../Global/loader';
import Method from '../../utils/methods';
import { returnRequestEndPoints } from '../../api/apiEndPoints';
import { OrdersDelivery, String } from '../../utils/string';
import { success } from '../../Global/toast';
import { useNavigate } from 'react-router-dom';
import { Inventory, ReturnRequestConst } from '../../utils/constants';
const MarkAsArrivedModal = (props: any) => {
  const [fetchLoader, setFetchLoader] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleMarkASArrived = async () => {
    setLoading(true);
    const apiCallService = new APICallService(
      returnRequestEndPoints.markAsArrived,
      undefined,
      {
        id: props.details._id,
      },
      '',
      false,
      '',
      ReturnRequestConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success('Return mark as arrived successfully!');
      props.onHide();
      navigate('/all-return-requests');
    }
    setLoading(false);
  };
  const getTotalAmountForVariant = (
    val: any,
    returnString: boolean = true
  ): any => {
    const discount = val?.discount || 0;
    const stock = val?.stockCount || 0;
    const total = (val?.totalAmount || 0) - discount * stock;
    if (returnString) {
      return Method.formatCurrency(total || 0);
    } else {
      return total;
    }
  };
  return (
    <>
      <Modal
        centered
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-900px min-w-md-700px"
        className="border-r10px"
        contentClassName="p-3 px-5"
      >
        <Modal.Header className="border-bottom-0 text-center pb-2  mx-auto">
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
            Mark the return request process as completed!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-4">
          <Row className="align-items-center mb-4">
            <Col
              md={12}
              className="text-center"
            >
              <Col>
                <span className="fs-16 text-muted fw-500 text-italic">
                  {`${
                    props.details?.deliveryUser?.name || 'NA'
                  } delivered this order(#${
                    props.details.orderRefKey
                  }) at ${'Umart Warehouse'} on ${
                    props?.details?.statusUpdatedAt
                      ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeprator(
                          props.details.statusUpdatedAt
                        )
                      : ''
                  } `}
                  {/* Patrick Richards delivered this order(#00982) at warehouse
                  name on 24/03/23 - 2:30 PM */}
                </span>
              </Col>
            </Col>
          </Row>
          {!fetchLoader &&
          props.details &&
          Object.keys(props.details).length ? (
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
                          <th className="min-w-md-100px text-center">
                            Total amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="fs-15 fw-600">
                        {!fetchLoader ? (
                          props.details && Object.keys(props.details).length ? (
                            <>
                              {props.details.returnedVariants.map(
                                (val: any, index: number) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="symbol symbol-md-50px symbol-30px">
                                            <span
                                              className="symbol-label"
                                              style={{
                                                backgroundImage: `url(${
                                                  val?.variant?.media[0]?.url ||
                                                  ''
                                                })`,
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
                                      {/* <td className="text-center">
                                        <span>
                                          TSh{' '}
                                          {Method.formatCurrency(
                                            val?.amount?.toFixed(2) || 0
                                          )}
                                        </span>
                                      </td> */}
                                      <td>
                                        {val?.discount && val?.discount > 0 ? (
                                          <>
                                            <span className="fs-15 fw-500 d-block text-decoration-line-through text-gray">
                                              {String.TSh}
                                              {''}{' '}
                                              {Method.formatCurrency(
                                                val.amount || 0
                                              )}
                                            </span>
                                            <span className="fs-15 fw-500 d-block">
                                              {String.TSh}
                                              {''}{' '}
                                              {Method.formatCurrency(
                                                val.amount - val.discount || 0
                                              )}
                                            </span>
                                          </>
                                        ) : (
                                          <span className="fs-15 fw-500 d-block">
                                            {String.TSh}
                                            {''}{' '}
                                            {Method.formatCurrency(
                                              val.amount || 0
                                            )}
                                          </span>
                                        )}
                                      </td>
                                      <td className="text-center">
                                        <span>
                                          {val?.returnedStockCount || 0}{' '}
                                          {val?.returnedStockCount > 1
                                            ? 'Units'
                                            : 'Unit'}
                                        </span>
                                      </td>
                                      <td className="text-center">
                                        <span className="fs-15 fw-500">
                                          TSh{' '}
                                          {getTotalAmountForVariant(val, true)}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }
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
                                  {props.details?.returnedVariants.length
                                    ? Method.formatCurrency(
                                        props.details.returnedVariants.reduce(
                                          (acc: any, variant: any) => {
                                            return (
                                              acc +
                                              getTotalAmountForVariant(
                                                variant,
                                                false
                                              )
                                            );
                                          },
                                          0
                                        )
                                      )
                                    : 0}
                                </td>
                              </tr>
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
          <div className="fs-18 text-center my-7 px-2 d-flex align-items-center rounded bg-light-danger fw-500 h-50px">
            Ensure that you have inspected the return items from when the
            delivery user hands them over to you.
          </div>
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                handleMarkASArrived();
              }}
              className="h-60px"
              disabled={loading}
            >
              {!loading && (
                <span className="indicator-label">Mark as arrived</span>
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
        </Modal.Body>
      </Modal>
    </>
  );
};
export default MarkAsArrivedModal;
