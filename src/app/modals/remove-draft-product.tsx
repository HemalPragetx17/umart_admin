import { Modal, Button } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import APICallService from '../../api/apiCallService';
import { product } from '../../api/apiEndPoints';
import { success } from '../../Global/toast';
import { allProductToast } from '../../utils/toast';
import { Product } from '../../utils/constants';
const RemoveDraftProduct = (props: any) => {
  const [loading, setLoading] = useState(false);
  const deleteDraftProduct = async () => {
    setLoading(true);
    let apiService = new APICallService(product.deleteProduct, props.deleteId,'','',false,'',Product);
    let response = await apiService.callAPI();
    if (response) {
      props.handleDraftCount();
      success(allProductToast.draftDeleted);
      props.onHide();
    }
    setLoading(false);
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
            Are you sure you want to remove {props.title}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
          <Button
            variant="danger"
            size="lg"
            onClick={deleteDraftProduct}
            disabled={loading}
          >
            {!loading && (
              <span className="indicator-label">Yes, remove from draft</span>
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
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default RemoveDraftProduct;
