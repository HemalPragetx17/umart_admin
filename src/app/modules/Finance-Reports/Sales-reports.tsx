import { Button, Card, Col, FormLabel, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Order,
  OutWardReports,
  PAGE_LIMIT,
  View,
} from '../../../utils/constants';
import APICallService from '../../../api/apiCallService';
import { financeReports } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import Loader from '../../../Global/loader';
import CustomDatePicker from '../../custom/DateRange/DatePicker';
import { error } from '../../../Global/toast';
import { useAuth } from '../auth';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import PermissionModal from '../../modals/permission-moda';
// import PermissionModal from '../../modals/permission';
const SalesReport = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [details, setDetails] = useState<any>();
  const [type, setType] = useState<any>(true);
  const [endDate, setEndDate] = useState<any>(new Date());
  const [startDate, setStartDate] = useState<any>(new Date());
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [search, setSearch] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [orderData, setOrderData] = useState<any>([]);
  const [download, setDownload] = useState(false);
  const [salesData, setSalesData] = useState<any>([]);
  const [count, setCount] = useState({
    totalOrders: 0,
    totalAmount: 0,
  });
  const [paymentDetails, setPaymentDetails] = useState<any>([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(OutWardReports, currentUser)) {
        return window.history.back();
      }
      setFetchLoading(true);
      await fetchOrder(startDate, endDate);
      setFetchLoading(false);
    })();
  }, []);
  const fetchOrder = async (startDate: string, endDate: string) => {
    setCount({
      totalOrders: 0,
      totalAmount: 0,
    });
    let params = {
      fromDate: startDate
        ? Method.convertDateToFormat(startDate, 'YYYY-MM-DD')
        : '',
      toDate: endDate ? Method.convertDateToFormat(endDate, 'YYYY-MM-DD') : '',
      utcOffset: new Date().getTimezoneOffset(),
    };
    let apiService = new APICallService(
      financeReports.outward,
      params,
      '',
      '',
      '',
      '',
      OutWardReports
    );
    let response = await apiService.callAPI();
    if (response) {
      setOrderData(response?.orderData || []);
      setSalesData(response?.ordersSaleData || []);
      setCount({
        totalOrders: response?.totalOrders || 0,
        totalAmount: response?.totalSales || 0,
      });
    }
  };
  const handleChange = async ([startDate, endDate]: any) => {
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate && endDate) {
      setFetchLoading(true);
      setTotalRecords(0);
      await fetchOrder(
        Method.convertDateToFormat(startDate, 'YYYY-MM-DD'),
        Method.convertDateToFormat(endDate, 'YYYY-MM-DD')
      );
      setFetchLoading(false);
    }
  };
  const handleDownload = async (startDate: string, endDate: string) => {
    setDownload(true);
    let params = {
      fromDate: startDate
        ? Method.convertDateToFormat(startDate, 'YYYY-MM-DD')
        : '',
      toDate: endDate ? Method.convertDateToFormat(endDate, 'YYYY-MM-DD') : '',
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
    };
    let apiService = new APICallService(
      financeReports.outward,
      params,
      undefined,
      'arraybuffer',
      '',
      '',
      OutWardReports
    );
    let response = await apiService.callAPI();
    if (response) {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'outward' + '.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      error('Data Not Found');
    }
    setDownload(false);
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
              <h1 className="fs-22 fw-bolder">Outward Reports</h1>
            </div>
          </Col>
          <Col md="auto">
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
          </Col>
          <Col md="auto">
            <Button
              className="fs-15 fw-600 min-h-50px"
              onClick={() => handleDownload(startDate, endDate)}
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
          <Col md="auto">
            <Button
              className="fs-15 fw-600 min-h-50px"
              onClick={() => setType(!type)}
            >
              {!type ? `View Outward Report` : `Outward Grouped By Date`}
            </Button>
          </Col>
          <Row className="align-items-center mb-7 g-6">
            <Col
              xl={4}
              md={6}
              sm={4}
            >
              <div className="border-r8px bg-fbe5e5 rounded py-4 px-5">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <span className="fs-22 fw-bolder">
                      {count.totalOrders > 0 ? count.totalOrders : 0}
                    </span>
                    <span className="fw-medium fs-16">{`Total Orders`} </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              xl={4}
              md={6}
              sm={4}
            >
              <div className="border-r8px bg-c9f3d7 rounded py-4 px-5">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <span className="fs-22 fw-bolder">
                      {count.totalAmount > 0
                        ? 'TSh ' +
                          Method.getGeneralizedAmount(count.totalAmount)
                        : 0}
                    </span>
                    <span className="fw-medium fs-16">Total Sales Amount</span>
                  </div>
                </div>
              </div>
            </Col>
            {/* <Col
              xl={4}
              md={6}
              sm={4}
            >
              <div className="border-r8px bg-fbeace rounded py-4 px-5">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <span className="fs-22 fw-bolder">
                      {count.totalCommission > 0
                        ? 'TSh ' +
                          Method.getGeneralizedAmount(count.totalCommission)
                        : 0}
                    </span>
                    <span className="fw-medium fs-16">
                      Total Commission Earned
                    </span>
                  </div>
                </div>
              </div>
            </Col> */}
          </Row>
        </Row>
        {type ? (
          <>
            <Card className="border border-r10px mt-6">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                        <th className="min-w-md-175px min-w-150px">
                          Order Date & ID
                        </th>
                        <th className="min-w-md-200px min-w-125px">
                          Customer name
                        </th>
                        <th className="min-w-md-125px">Quantity</th>
                        <th className="min-w-md-125px min-w-100px">
                          Total amount
                        </th>
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
                          {orderData && orderData.length ? (
                            <>
                              {' '}
                              {orderData.map((orderVal: any, index: number) => (
                                <>
                                  <tr key={index}>
                                    <td className="fs-15 fw-500">
                                      <div className="d-flex align-items-start flex-column">
                                        <div className="d-flex flex-row">
                                          <span className="text-dark d-block">
                                            {Method.convertDateToDDMMYYYYHHMM(
                                              orderVal._createdAt,
                                              '-'
                                            )}
                                          </span>
                                        </div>
                                        <span className="text-gray d-block">
                                          {orderVal.refKey}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="fs-15 fw-500 d-block">
                                        {orderVal.customer.name}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="fs-15 fw-500">
                                        {/* {goodVal.quantity + ' items'} */}
                                        {orderVal?.orderedQuantities ||
                                          0 + ' items'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="fs-15 fw-500">
                                        {'TSh ' +
                                          Method.getGeneralizedAmount(
                                            orderVal.totalCharge
                                          )}
                                      </span>
                                    </td>
                                    <td className="text-end">
                                      {Method.hasPermission(
                                        OutWardReports,
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
                                                moduleName: OutWardReports,
                                              },
                                            })
                                          }
                                        >
                                          View details
                                        </Button>
                                      ) : (
                                        <></>
                                      )}
                                      {Method.hasPermission(
                                        OutWardReports,
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
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={5}>
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
          </>
        ) : (
          <>
            <Card className="border border-r10px mt-6">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                        <th className="min-w-md-175px min-w-150px">Date</th>
                        <th className="min-w-md-200px min-w-125px">
                          Total Orders
                        </th>
                        <th className="min-w-md-125px text-center">
                          Total Sales
                        </th>
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
                          {salesData.length ? (
                            <>
                              {' '}
                              {salesData.map((orderVal: any, index: number) => (
                                <>
                                  <tr key={index}>
                                    <td className="fs-15 fw-500">
                                      <span className="fs-15 fw-500 d-block">
                                        {Method.convertDateToDDMMYYYY(
                                          orderVal.date
                                        )}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="fs-15 fw-500 d-block">
                                        {Method.getGeneralizedAmount(
                                          orderVal.totalOrders
                                        )}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span className="fs-15 fw-500 ">
                                        {'TSh ' +
                                          Method.getGeneralizedAmount(
                                            orderVal.totalSales
                                          )}
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={5}>
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
          </>
        )}
      </div>
    </>
  );
};
export default SalesReport;
