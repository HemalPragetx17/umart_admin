import { Modal, Button, Row, Col } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import { instantOrderApiJson } from '../../api/apiJSON/placeOrder';
import { success } from '../../Global/toast';
import { placeOrderToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../utils/constants';
import { CustomSelectTable2 } from '../custom/Select/custom-select-table';
import CreateBins from '../modules/master/loading-area/CreateBins';
const AssignZoneModal = (props: any) => {
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
        className="border-r10px overflow-hidden"
        size="lg"
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
          <Modal.Title className="fs-24 fw-bolder pt-10  pt-lg-3 ">
            Assign zone and bins for {props.product?.title || ''}
          </Modal.Title>
        </Modal.Header>
        <div className="separator my-4"></div>
        <Modal.Body
          className="mt-2 pt-5 pb-1 fs-16 text-black fw-500 ps-5 mh-350px overflow-scroll"
          style={{
            zIndex: 9999,
          }}
        >
          {props?.product?.inventoryInfo?.reference?.batches &&
          props?.product?.inventoryInfo?.reference?.batches ? (
            props?.product?.inventoryInfo?.reference?.batches.map(
              (item: any) => {
                return (
                  <div
                    key={item?._id}
                    className="d-flex justify-content-around mt-2 align-items-center overflow-hidden"
                  >
                    <div>{`Batch : ${item?.batch}`}</div>
                    <div>
                      <CustomSelectTable2
                        isDisabled={false}
                        // isDisabled={
                        //   item.reference.length === 0 ||
                        //   hasViewPermission ||
                        //   (Method.hasPermission(
                        //     WarehouseZone,
                        //     Delete,
                        //     currentUser
                        //   ) &&
                        //     !Method.hasPermission(
                        //       WarehouseZone,
                        //       Edit,
                        //       currentUser
                        //     ) &&
                        //     !item?.isNew) ||
                        //   (Method.hasPermission(
                        //     WarehouseZone,
                        //     Add,
                        //     currentUser
                        //   ) &&
                        //     !Method.hasPermission(
                        //       WarehouseZone,
                        //       Edit,
                        //       currentUser
                        //     ) &&
                        //     !item?.isNew)
                        // }
                        options={
                          props?.loadingArea.length
                            ? props?.loadingArea.map((areaVal: any) => {
                                return {
                                  ...areaVal,
                                  title:
                                    areaVal.name + ' - ' + areaVal?.sequence,
                                  label:
                                    areaVal.name + ' - ' + areaVal?.sequence,
                                  _id: areaVal._id,
                                  value: areaVal._id,
                                };
                              })
                            : []
                        }
                        // border={
                        //   !validation[index]?.zone
                        //     ? ''
                        //     : '#e55451 !important'
                        // }
                        // backgroundColor={
                        //   !validation[index]?.zone
                        //     ? ''
                        //     : '#fcecec !important'
                        // }
                        multiValueBackground="#def2ea"
                        // onChange={(event: any) =>
                        //   handleMultiSelectChange(event, primaryIndex)
                        // }
                        // value={loadingAreaData[
                        //   primaryIndex
                        // ].zone.map((item: any) => {
                        //   return {
                        //     label: item.name,
                        //     _id: item.reference,
                        //     value: item.reference,
                        //   };
                        // })}
                        indicatorDisplay="none"
                        display="none"
                        isMulti={true}
                        menuIsOpen={false}
                        placeholder="Select product zone"
                      />
                      <div className="mt-5">
                        {/* <CreateBins
                          goodsLoadingArea={primaryVal?.goodsLoadingArea || []}
                          onRemove={(zoneIndex: number, binsIndex: number) => {
                            hanldeBinsRemove(
                              primaryIndex,
                              zoneIndex,
                              binsIndex
                            );
                          }}
                        /> */}
                      </div>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center mt-2 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {!loading && <span className="indicator-label">Save</span>}
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
export default AssignZoneModal;
