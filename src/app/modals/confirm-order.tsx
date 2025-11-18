import { Modal, Button } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import { instantOrderApiJson } from '../../api/apiJSON/placeOrder';
import { success } from '../../Global/toast';
import { placeOrderToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../utils/constants';
const ConfirmOrderModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handlePlaceOrder = async () => {
    setLoading(true);
    const apiCallService = new APICallService(
      placeOrder.placeNewOrder,
      instantOrderApiJson.placeOrder(
        props.selectedProducts,
        props.selectedCustomer,
        props?.checkStockResult?.reward,
        props?.campaignDetails
      ),
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(placeOrderToast.orderPlaced);
      props.onHide();
      navigate('/orders');
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
          {props.checkStockResult.emptyStockItemsList == 0 &&
          props.checkStockResult.notEnoughStockItemsList.length == 0 ? (
            <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
              Cheers! You will get{' '}
              {props?.checkStockResult?.reward?.discountValue || 0} coins on
              this order.
            </Modal.Title>
          ) : (
            <></>
          )}
        </Modal.Header>
        {props.checkStockResult.emptyStockItemsList > 0 ||
        props.checkStockResult.notEnoughStockItemsList.length > 0 ? (
          <Modal.Body className="pt-5 pb-1">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {props.error && (
                  <div className="bg-light-danger text-center border-r10px p-3">
                    <span className="fs-18 fw-500">
                      {'Stock is not available for some of ordered products.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
        ) : (
          <></>
        )}
        <Modal.Footer className="justify-content-center mt-2 mb-4 border-top-0">
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
        </Modal.Footer>
        {/* {props.flag && (
        )} */}
      </Modal>
    </>
  );
};
export default ConfirmOrderModal;
