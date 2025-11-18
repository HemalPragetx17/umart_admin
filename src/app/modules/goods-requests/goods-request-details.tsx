import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  GoodsRequestString,
  OrdersDelivery,
  String,
} from '../../../utils/string';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import Loader from '../../../Global/loader';
import {
  Add,
  Delete,
  Edit,
  GoodsInWarehouseConst,
  GoodsRequestConst,
  Inventory,
  RequestCancelled,
  RequestCompleted,
  RequestPending,
} from '../../../utils/constants';
import CustomDeleteModal from '../../modals/custom-delete-modal';
import { goodsRequestDetailsJson } from '../../../utils/dummyJSON';
import APICallService from '../../../api/apiCallService';
import { goodsRequests } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import { success } from '../../../Global/toast';
import { goodsRequestTaost } from '../../../utils/toast';
import { useAuth } from '../auth';
import PermissionModal from '../../modals/permission-moda';
const GoodsRequestDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location: any = useLocation();
  const tab: any = location.state?.tab;
  const id: any = location.state?.id;
  const [fetchLoading, setFetchLoading] = useState(true);
  const [requestGoodsDetails, setRequestGoodsDetails] = useState<any>();
  const [showDeleteModal, setShowDeletModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!id) {
        return navigate('/goods-requests', { replace: true });
      }
      updateOptionWithPermission();
      await fetchRequestDetails(id);
      setFetchLoading(false);
    })();
  }, []);
  const fetchRequestDetails = async (id: string) => {
    setFetchLoading(true);
    const apiService = new APICallService(
      goodsRequests.goodsRequestInfo,
      id,
      '',
      '',
      false,
      '',
      GoodsRequestConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setRequestGoodsDetails(response);
    }
    setFetchLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(GoodsRequestConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(GoodsRequestConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            Delete details
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const dateText: string[] = [
    GoodsRequestString.expectedDeliveryDate,
    GoodsRequestString.dateOfCompletion,
    GoodsRequestString.dateOfCancellation,
  ];
  const handleOption = async (event: any, data: any) => {
    if (event.value === 1) {
      navigate('/goods-requests/edit-goods-request', { state: { id: id } });
      // navigate('/all-products/edit-product', {
      //   state: {
      //     _id: data,
      //     isMaster: false,
      //   },
      // });
    } else if (event.value === 2) {
      setShowDeletModal(true);
    }
  };
  const handleCancel = async () => {
    const apiService = new APICallService(
      goodsRequests.changeStatus,
      {
        status: RequestCancelled,
      },
      {
        id: id,
      },
      '',
      false,
      '',
      GoodsRequestConst
    );
    const response = await apiService.callAPI();
    if (response) {
      success(goodsRequestTaost.requestCancel);
      setShowDeletModal(false);
      navigate('/goods-requests');
    }
  };
  const handleDownloadReport = async (id: string) => {
    setIsDownloading(true);
    const apiService = new APICallService(
      goodsRequests.downloadReport,
      id,
      undefined,
      'blob',
      false,
      '',
      GoodsRequestConst
    );
    const response = await apiService.callAPI();
    if (response) {
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download =
        `goods-request-` + requestGoodsDetails.refKey + '.pdf';
      downloadLink.click();
    }
    setIsDownloading(false);
  };
  return (
    <>
      {showDeleteModal ? (
        <CustomDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeletModal(false)}
          title="Are you sure you want to cancel this request?"
          btnTitle="Yes,Cancel"
          handleDelete={handleCancel}
        />
      ) : (
        <></>
      )}
      <Row className="g-8 mb-8">
        <Col md={12}>
          <Row className="align-items-center g-3">
            <Col xs>
              <h1 className="fs-22 fw-bolder mb-0">
                {' '}
                {GoodsRequestString.goodsRequestDetails}
              </h1>
            </Col>
            {!fetchLoading &&
              (tab === RequestPending ? (
                <Col xs="auto">
                  <button
                    type="button"
                    className="me-2  btn printBtn text-primary btn-lg"
                    disabled={isDownloading || fetchLoading}
                    onClick={() => handleDownloadReport(id)}
                  >
                    {!isDownloading && (
                      <span className="indicator-label fs-16 fw-bold">
                        Print
                      </span>
                    )}
                    {isDownloading && (
                      <span
                        className="indicator-progress fs-16 fw-bold"
                        style={{ display: 'block' }}
                      >
                        {String.pleaseWait}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                  {Method.hasPermission(
                    GoodsInWarehouseConst,
                    Add,
                    currentUser
                  ) ? (
                    <Button
                      variant="primary"
                      //   disabled={
                      //   }
                      className="btn-lg"
                      onClick={() => {
                        navigate('/inventory/add-goods-in-inventory', {
                          state: { requestId: id },
                        });
                      }}
                    >
                      {GoodsRequestString.addGoodsToInventory}
                    </Button>
                  ) : (
                    <></>
                  )}
                  {Method.hasPermission(GoodsRequestConst, Edit, currentUser) ||
                  Method.hasPermission(
                    GoodsRequestConst,
                    Delete,
                    currentUser
                  ) ? (
                    <div className="d-inline-flex">
                      <CustomSelectTable
                        marginLeft={'-110px'}
                        width={'auto'}
                        placeholder={
                          <img
                            className=""
                            width={45}
                            height={45}
                            src={ThreeDotMenu}
                            alt=""
                          />
                        }
                        options={options}
                        backgroundColor={'white'}
                        onChange={(event: any) => {
                          handleOption(event, '');
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </Col>
              ) : (
                <></>
              ))}
          </Row>
        </Col>
        {!fetchLoading ? (
          requestGoodsDetails ? (
            <Col xs>
              <Card className="border">
                <Card.Header className="bg-light align-items-center">
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <Card.Title className="fs-22 fw-bolder">
                      {OrdersDelivery.basicDetails}
                    </Card.Title>
                  </div>
                </Card.Header>
                <Card.Body className="pb-3">
                  <Row>
                    <Col md={6}>
                      <Row className="mb-5">
                        <Col
                          md={5}
                          xs={4}
                        >
                          <label className=" fs-16 fw-500 text-dark">
                            {GoodsRequestString.warehouseName}:
                          </label>
                        </Col>
                        <Col
                          md={7}
                          xs={8}
                        >
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {requestGoodsDetails?.warehouse?.name || ''}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mb-5">
                        <Col
                          md={5}
                          xs={4}
                        >
                          <label className=" fs-16 fw-500 text-dark">
                            {GoodsRequestString.requestId}:
                          </label>
                        </Col>
                        <Col
                          md={7}
                          xs={8}
                        >
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {'#' + requestGoodsDetails?.refKey || ''}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mb-5">
                        <Col
                          md={5}
                          xs={4}
                        >
                          <label className=" fs-16 fw-500 text-dark">
                            {GoodsRequestString.requestInitiateOn}:
                          </label>
                        </Col>
                        <Col
                          md={7}
                          xs={8}
                        >
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {requestGoodsDetails._createdAt
                              ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                  requestGoodsDetails._createdAt,
                                  '-'
                                )
                              : ''}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row className="mb-5">
                        <Col
                          md={5}
                          xs={4}
                        >
                          <label className=" fs-16 fw-500 text-dark">
                            {dateText[tab - 1]}:
                          </label>
                        </Col>
                        <Col
                          md={7}
                          xs={8}
                        >
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {tab === RequestPending
                              ? Method.convertDateToDDMMYYYY(
                                  requestGoodsDetails.expectedDate
                                )
                              : ''}
                            {tab === RequestCompleted ||
                            tab === RequestCancelled
                              ? Method.convertDateToDDMMYYYY(
                                  requestGoodsDetails.statusUpdatedAt
                                )
                              : ''}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mb-5">
                        <Col
                          md={5}
                          xs={4}
                        >
                          <label className=" fs-16 fw-500 text-dark">
                            {GoodsRequestString.totalUnits}:
                          </label>
                        </Col>
                        <Col
                          md={7}
                          xs={8}
                        >
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {`${requestGoodsDetails.totalRequestedQuantities} ${
                              requestGoodsDetails.totalRequestedQuantities > 1
                                ? 'Units'
                                : 'Unit'
                            }`}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mb-5">
                        <Col
                          md={5}
                          xs={4}
                        >
                          <label className=" fs-16 fw-500 text-dark">
                            {GoodsRequestString.requestedBy}:
                          </label>
                        </Col>
                        <Col
                          md={7}
                          xs={8}
                        >
                          <span className="fw-bold fs-16 fw-600 text-dark">
                            {requestGoodsDetails?.createdBy?.name}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <></>
          )
        ) : (
          <div className="border border-r10px mb-6">
            <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
              <Loader loading={fetchLoading} />
            </div>
          </div>
        )}
        {!fetchLoading && requestGoodsDetails && (
          <Col md={12}>
            <Card className="border border-r10px">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gs-9 gy-6 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                        <th className="w-md-475px min-w-275px">
                          {OrdersDelivery.productName}
                        </th>
                        <th className="min-w-md-100px text-end">{'Units'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestGoodsDetails?.variants.map(
                        (product: any, index: number) => (
                          <tr key={index}>
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
                                    {product.variant.title}
                                  </span>
                                  {tab === RequestPending ? (
                                    <span className="text-gray fw-500 fs-15 d-block">
                                      {OrdersDelivery.sku}
                                      {': '}
                                      {product.variant.skuNumber}
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                  {tab === RequestCompleted &&
                                  product.quantityTypes[0].stockCount >
                                    product.quantityTypes[0]
                                      .arrivedStockCount ? (
                                    <span className="fs-15 fw-500 text-danger d-block">
                                      <em>
                                        {product.quantityTypes[0].stockCount -
                                          product.quantityTypes[0]
                                            .arrivedStockCount +
                                          ' Units yet to receive'}
                                      </em>
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </td>{' '}
                            <td className="text-end">
                              <span className="fs-15 fw-500">
                                {/* {product?.quantityTypes[0]?.stockCount}{' '} */}
                                {tab === RequestCompleted
                                  ? product.quantityTypes[0].arrivedStockCount
                                  : product.quantityTypes[0].stockCount}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};
export default GoodsRequestDetails;
