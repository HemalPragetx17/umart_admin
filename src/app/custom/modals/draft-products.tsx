import { useEffect, useState } from 'react';
import { Modal, Button, Card, ListGroup } from 'react-bootstrap';
import CrossSvg from '../../../umart_admin/assets/media/close.png';
import p1 from '../../../umart_admin/assets/media/product/default.svg';
import crossRed from '../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import RemoveDraftProduct from './remove-draft-product';
import APICallService from '../../../api/apiCallService';
import { product } from '../../../api/apiEndPoints';
import Loader from '../../../Global/loader';
import Method from '../../../utils/methods';
import { useNavigate } from 'react-router-dom';
const DraftProducts = (props: any) => {
  const navigate = useNavigate();
  const [fetchLoader, setFetchLoader] = useState(false);
  const [draftProducts, setDraftProducts] = useState<any>([]);
  useEffect(() => {
    (async () => {
      if (props.show) {
        setFetchLoader(true);
        await fetchDraftProducts();
        setFetchLoader(false);
      }
    })();
  }, [props.show]);
  const fetchDraftProducts = async () => {
    let apiService = new APICallService(product.draftList, {
      sortKey: 'title',
      sortOrder: -1,
    });
    let response = await apiService.callAPI();
    if (response.records) {
      setDraftProducts(response.records);
    }
  };
  return (
    <>
      <RemoveDraftProduct
        show={props.showRemoveDraftProduct}
        onHide={() => {
          props.handleHideRemoveDraftProduct();
        }}
        deleteId={props.deleteId}
        title={props.title}
        handleDraftCount={props.handleDraftCount}
      />
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-690px"
        className="border-r10px"
        centered
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <img
            className="close-inner-top"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            Draft products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-6">
          <Card className="pb-6">
            {fetchLoader ? (
              <div className="d-flex flex-wrap justify-content-center align-items-center p-2 py-3">
                <div className="d-md-flex">
                  <Loader loading={fetchLoader} />
                </div>
              </div>
            ) : (
              <>
                {' '}
                <ListGroup className="mx-5">
                  {draftProducts.map((productVal: any, index: number) => {
                    return (
                      <ListGroup.Item>
                        <div className="d-flex flex-wrap justify-content-between align-items-center p-2 py-3">
                          <div className="d-md-flex">
                            <div className="symbol symbol-50px border me-5">
                              {productVal.variants.length > 0 &&
                              productVal.variants[0]['variant']['media']
                                .length ? (
                                <img
                                  src={
                                    productVal.variants[0]['variant'][
                                      'media'
                                    ][0].url
                                  }
                                  className="object-fit-contain"
                                  alt=""
                                />
                              ) : (
                                <>
                                  <img
                                    src={p1}
                                    width={14}
                                    height={14}
                                    alt=""
                                  />
                                </>
                              )}
                            </div>
                            <div className="d-flex justify-content-start flex-column">
                              <span className="fs-18 fw-500 text-dark">
                                {productVal.title}
                              </span>
                              <span className="d-block fs-15 fw-500 text-gray">
                                Drafted on{' '}
                                {Method.convertDateToDDMMYYYY(
                                  productVal.draftedAt
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end align-items-center flex-row mt-lg-0 mt-5">
                            <Button
                              type="button"
                              variant="primary"
                              className="fs-14 fw-600 btn-sm min-h-40px me-1"
                              onClick={() => {
                                navigate('/products/edit-product', {
                                  state: {
                                    _id: productVal._id,
                                    isDraft: true,
                                  },
                                });
                              }}
                            >
                              Continue adding details
                            </Button>
                            <button
                              type="button"
                              className="btn btn-icon btn-sm"
                              onClick={() =>
                                props.handleShowRemoveDraftProduct(
                                  productVal._id,
                                  productVal.title
                                )
                              }
                            >
                              <img
                                src={crossRed}
                                width={16}
                                height={16}
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </>
            )}
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default DraftProducts;
