import { Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { RequestCompleted, RequestPending } from '../../utils/constants';
const RequestedProductModal = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        show={props.data && props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered"
        className="border-r10px "
        centered
        size="lg"
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto position-relative w-100">
          <img
            className="position-absolute left-0"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3 m-auto">
            {' '}
            {props.data && props?.data?.variants.length} product
            {props.data.variants.length > 1 ? 's' : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mb-3">
          <Row className="px-lg-6 gy-6">
            {props?.data?.variants && props.data.variants.length ? (
              <>
                {props.data.variants.map((productVal: any) => {
                  return (
                    <Col md={6}>
                      <div className="border border-r8px p-5 py-9">
                        <div className="d-flex align-items-center">
                          <div className="me-5 position-relative">
                            <div className="symbol symbol-50px border">
                              <img
                                src={productVal.variant.media[0].url}
                                alt=""
                              />
                            </div>
                          </div>
                          <div>
                            <span className="fs-18 fw-600 w-lg-175px">
                              {productVal.variant.title.replace(
                                /\s*\)\s*/g,
                                ')'
                              )}
                            </span>
                            <div className="fs-15 fw-500 text-gray">
                              <em>
                                {`${productVal.quantityTypes[0].stockCount} ${
                                  productVal.quantityTypes[0].stockCount > 1
                                    ? 'Units'
                                    : 'Unit'
                                }`}
                              </em>
                              {props.tab === RequestCompleted &&
                              productVal.quantityTypes[0].stockCount >
                                productVal.quantityTypes[0]
                                  .arrivedStockCount ? (
                                <span className="fs-15 fw-500 text-danger ">
                                  <em>
                                    {
                                      <span className="fs-15 fw-500 text-gray">
                                        {' / '}
                                      </span>
                                    }
                                    {productVal.quantityTypes[0].stockCount -
                                      productVal.quantityTypes[0]
                                        .arrivedStockCount +
                                      ' Units yet to receive'}
                                  </em>
                                </span>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default RequestedProductModal;
