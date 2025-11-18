import Modal from 'react-bootstrap/Modal';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { LowStocksString, productString } from '../../utils/string';
import { Button } from 'react-bootstrap';
import APICallService from '../../api/apiCallService';
import { lowStockList } from '../../api/apiEndPoints';
import { useState } from 'react';
import { success } from '../../Global/toast';
import { lowStockListToast } from '../../utils/toast';
import { Inventory, LowStockConst } from '../../utils/constants';
const LowStockModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const apiService = new APICallService(
      lowStockList.markAsOrdered,
      undefined,
      { id: props.item._id },
      '',
      false,
      '',
      LowStockConst
    );
    const response = await apiService.callAPI();
    if (response) {
      success(lowStockListToast.productOrdered);
      await props.onClose();
    }
    setLoading(false);
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-600px"
        className="border-r10px"
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 pb-1 pt-lg-10 text-center mx-auto">
          <img
            className="close-inner-top-2"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <div>
            <div className="symbol symbol-md-200px symbol-150px w-fit-content border bg-body">
              <img
                className="img-fluid p-2 object-fit-contain"
                src={props.modalImage}
                alt=""
              />
            </div>
            <Modal.Title className="fs-26 fw-bolder mw-lg-375px mt-5">
              {props?.item?.variant?.title || ''}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-5 pb-lg-12 pb-8">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center border-r10px bg-light p-3">
                <span className="fs-18 fw-600 text-dark">
                  {/* This product is added successfully. You  <br className="br" />
                  The seller can add this product to their catalogue. */}
                  {LowStocksString.modalText}
                </span>
              </div>
            </div>
            <div className="text-center mt-9">
              <Button
                variant="primary"
                className="min-h-60px"
                disabled={loading}
                onClick={() => handleSubmit()}
              >
                {!loading && (
                  <span className="indicator-label">
                    {`Yes, ${LowStocksString.orderedThisProduct}`}
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
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default LowStockModal;
