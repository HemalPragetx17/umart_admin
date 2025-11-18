import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Edit,
  Order,
  PAGE_LIMIT,
  RefundReportConst,
  View,
} from '../../../utils/constants';
import APICallService from '../../../api/apiCallService';
import { financeReports } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import Loader from '../../../Global/loader';
import { error, success } from '../../../Global/toast';
import { useAuth } from '../auth';
import PermissionModal from '../../modals/permission-moda';
import Pagination from '../../../Global/pagination';
import { ordersToast } from '../../../utils/toast';
import { IPendingRefundReport } from '../../../types/responseIndex';
// import PermissionModal from '../../modals/permission';
const RefundReport = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refundData, setRefundData] = useState<IPendingRefundReport[]>([]);
  const [download, setDownload] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [refundId, setRefundId] = useState("");
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(RefundReportConst, currentUser)) {
        return window.history.back();
      }
      await fetchRefundData(page, pageLimit);
    })();
  }, []);

  const fetchRefundData = async (pageNo: number, limit: number) => {
    setFetchLoading(true);
    let params = {
      utcOffset: new Date().getTimezoneOffset(),
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      needCount: pageNo === 1,
    };
    let apiService = new APICallService(
      financeReports.refundReport,
      params,
      '',
      '',
      '',
      '',
      RefundReportConst
    );
    let response = await apiService.callAPI();
    if (response) {
      setRefundData(response?.records);
      if (pageNo === 1) {
        setTotalRecords(response?.total);
      }
    }
    setFetchLoading(false);
  };
  const handleDownload = async () => {
    setDownload(true);
    let params = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
    };
    let apiService = new APICallService(
      financeReports.refundReport,
      params,
      undefined,
      'arraybuffer',
      '',
      '',
      RefundReportConst
    );
    let response = await apiService.callAPI();
    if (response) {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pending-refund-report' + '.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      error('Data Not Found');
    }
    setDownload(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    await fetchRefundData(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchRefundData(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchRefundData(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(parseInt(event.target.value));
    await fetchRefundData(1, event.target.value);
  };
  const handleRefund = async (id: string) => {
    setRefundId(id);
    const apiCallService = new APICallService(
      financeReports.markAsRefund,
      {},
      { id: id },
      '',
      'false',
      '',
      RefundReportConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(ordersToast.markedAsRefund);
      setPage(1);
      await fetchRefundData(1, pageLimit);
    }
    setRefundId("");
  };
  return (
    <>
      {showPermissionModal && (
        <PermissionModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          moduleName={'Orders & Delivery'}
        />
      )}
      <div className="p-0">
        <Row className="g-4">
          <Col md>
            <div className="d-flex align-items-center mt-4">
              <h1 className="fs-22 fw-bolder">Pending Refund Report</h1>
            </div>
          </Col>
          {/* <Col md="auto">
            <div className="d-flex align-items-center">
              <FormLabel className="fs-16 fw-500">Filter by dates</FormLabel>
              <div className="ms-5">
                <CustomDatePicker
                  className="form-control bg-white min-h-30px fs-16 fw-bold text-dark min-w-md-288px min-w-175px"
                  onChange={handleChange}
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  showFullMonthYearPicker={true}
                  maxDate={new Date()}
                  inputTextBG="bg-white"
                  dayClassName={(date: Date) => {
                    return Method.dayDifference(
                      new Date().toDateString(),
                      date.toDateString()
                    ) > 0
                      ? 'date-disabled'
                      : '';
                  }}
                  customInput={<CustomDateInput />}
                />
              </div>
            </div>
          </Col> */}
          <Col md="auto">
            <Button
              className="fs-15 fw-600 min-h-50px"
              onClick={() => handleDownload()}
              disabled={fetchLoading || download}
            >
              {!download && (
                <span className="indicator-label fs-16 fw-bold">
                  Download Excel
                </span>
              )}
              {download && (
                <span
                  className="indicator-progress fs-16 fw-bold"
                  style={{ display: 'block' }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </Button>
          </Col>
        </Row>
        <Card className="border border-r10px mt-6">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
                <thead>
                  <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                    <th className="min-w-150px">Order ID</th>
                    <th>Customer name</th>
                    <th>Phone</th>
                    <th>Total amount</th>
                    <th className="min-w-150px text-end"></th>
                  </tr>
                </thead>
                <tbody className="fs-15 fw-600">
                  {fetchLoading ? (
                    <>
                      <tr>
                        <td colSpan={5}>
                          <div className="d-flex justify-content-center">
                            <Loader loading={fetchLoading} />
                          </div>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {refundData.length ? (
                        <>
                          {' '}
                          {refundData.map((orderVal, index: number) => (
                            <>
                              <tr key={index}>
                                <td className="fs-15 fw-500">
                                  <div className="d-flex align-items-start flex-column">
                                    <span className="text-black d-block">
                                      {orderVal?.refKey || ''}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="fs-15 fw-500 d-block">
                                    {orderVal?.customer?.name || ''}
                                  </span>
                                </td>
                                <td>
                                  <span className="fs-15 fw-500 d-block">
                                    {`${
                                      orderVal?.address?.phoneCountry || ''
                                    } ${orderVal?.address?.phone || ''}`}
                                  </span>
                                </td>
                                <td>
                                  <span className="fs-15 fw-500 d-block">
                                    {`TSh ${Method.formatCurrency(
                                      orderVal?.payment?.totalCharge || 0
                                    )}`}
                                  </span>
                                </td>
                                <td className="text-end">
                                  <div className="d-flex justify-content-end">
                                    {Method.hasPermission(
                                      RefundReportConst,
                                      Edit,
                                      currentUser
                                    ) && (
                                      <Button
                                        className="fs-14 fw-600 me-3"
                                        onClick={() => {
                                          handleRefund(orderVal._id);
                                        }}
                                        disabled={refundId == orderVal._id}
                                        style={{
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {refundId != orderVal._id && (
                                          <span className="indicator-label">
                                            Mark as refund
                                          </span>
                                        )}
                                        {refundId == orderVal._id && (
                                          <span
                                            className="indicator-progress"
                                            style={{ display: 'block' }}
                                          >
                                            Please wait...
                                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                          </span>
                                        )}
                                      </Button>
                                    )}
                                    {Method.hasPermission(
                                      RefundReportConst,
                                      View,
                                      currentUser
                                    ) &&
                                    Method.hasPermission(
                                      Order,
                                      View,
                                      currentUser
                                    ) ? (
                                      <Button
                                        className="fs-14 fw-600"
                                        onClick={() =>
                                          navigate('/orders/order-details', {
                                            state: {
                                              _id: orderVal._id,
                                              moduleName: RefundReportConst,
                                            },
                                          })
                                        }
                                        style={{
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        View details
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                    {Method.hasPermission(
                                      RefundReportConst,
                                      View,
                                      currentUser
                                    ) &&
                                    !Method.hasPermission(
                                      Order,
                                      View,
                                      currentUser
                                    ) ? (
                                      <Button
                                        className="fs-14 fw-600"
                                        onClick={() => {
                                          setShowPermissionModal(true);
                                        }}
                                      >
                                        View details
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={7}>
                            <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                              No Data found
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
        {!fetchLoading && totalRecords > 0 ? (
          <Pagination
            totalRecords={totalRecords}
            currentPage={page}
            handleCurrentPage={handleCurrentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            handlePageLimit={handlePageLimit}
            pageLimit={pageLimit}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default RefundReport;
