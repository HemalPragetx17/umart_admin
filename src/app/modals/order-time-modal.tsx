import { Button, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
function OrderTimeModal(props: any) {
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
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <Button variant="">
            <img
              className="close-inner-top"
              width={40}
              height={40}
              src={CrossSvg}
              alt="closebutton"
              onClick={props.onHide}
              style={{
                top: '4%',
              }}
            />
          </Button>
        </Modal.Header>
        <Modal.Body className=" pt-0">
          <Row className="px-lg-6 gy-1 justify-content-center">
            <Col
              xs={12}
              className="text-center"
            >
              <h5 className="fs-26 fw-bolder">Deliveries by district</h5>
            </Col>
            <Col
              xs={12}
              className="text-center mt-6"
            >
              <div className="card shadow-none">
                <div className="table-responsive">
                  <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
                    <thead>
                      <tr className="fs-16 fw-600 h-65px align-middle">
                        <th className="min-w-200px"> District name </th>
                        <th className="min-w-100px">
                          Deliveries less than 30 mins{' '}
                        </th>
                        <th className="min-w-150px">
                          {' '}
                          Deliveries more than 30 mins{' '}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="fs-15 fw-500">
                      {props?.data && props?.data?.length ? (
                        props?.data?.map((item: any, index: number) => {
                          return (
                            <tr key={item._id}>
                              <td>
                                <span>{item?.districtName || '-'}</span>
                              </td>
                              <td>
                                <span>{item?.lessThan30Count || '0'}</span>
                              </td>
                              <td>
                                <span>{item?.moreThan30Count || '0'}</span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default OrderTimeModal;
