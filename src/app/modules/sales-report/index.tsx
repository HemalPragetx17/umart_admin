import { useEffect, useState } from 'react';
import { salesReport } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import APICallService from '../../../api/apiCallService';
import { Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import ReactDatePicker from 'react-datepicker';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { salesReportStore } from '../../../utils/storeString';
import { error } from '../../../Global/toast';
import { String } from '../../../utils/string';
import { GoodsRequestConst, SalesReportsConst, View } from '../../../utils/constants';
import { useAuth } from '../auth';
interface ISalesReport {
  averageSales: number;
  stockCount: number;
  totalSales: number;
  totalOrders: number;
  variant: any;
}
const todayDate = new Date();
todayDate.setDate(todayDate.getDate() - 1);
let previousDayDate: any = new Date(Method.getYesterDayDate()).toString();
previousDayDate = new Date(Method.monthsAgoDate(previousDayDate, 1).toString());
const SalesReport = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [salesReportList, setSalesReportList] = useState<ISalesReport[]>([]);
  const [startDate, setStartDate] = useState<any>(
    getKey(salesReportStore.dateFilter)?.startDate
      ? new Date(getKey(salesReportStore.dateFilter).startDate)
      : previousDayDate
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(salesReportStore.dateFilter)?.endDate
      ? new Date(getKey(salesReportStore.dateFilter).endDate)
      : new Date(Method.getYesterDayDate())
  );
  const [isDownloading, setIsDownloading] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasPermission(SalesReportsConst, View, currentUser)) {
        return window.history.back();
      }
      await fetchSalesReport(startDate, endDate);
      setFetchLoading(false);
    })();
  }, []);
  const fetchSalesReport = async (startDate: any, endDate: any) => {
    const params = {
      fromDate: startDate
        ? Method.convertDateToFormat(startDate, 'YYYY-MM-DD')
        : '',
      toDate: endDate ? Method.convertDateToFormat(endDate, 'YYYY-MM-DD') : '',
    };
    setLoading(true);
    const apiCallService = new APICallService(
      salesReport.list,
      params,
      '',
      '',
      false,
      '',
      SalesReportsConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setSalesReportList(response);
    }
    setLoading(false);
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    if (event[0] && event[1]) {
      await fetchSalesReport(event[0], event[1]);
      setKey(salesReportStore.dateFilter, {
        startDate: event[0],
        endDate: event[1],
      });
    } else if (event[0] === null && event[1] === null) {
      const tempEndDate = new Date(Method.getYesterDayDate());
      setStartDate(previousDayDate);
      setEndDate(tempEndDate);
      await fetchSalesReport(previousDayDate, tempEndDate);
      removeKey(salesReportStore.dateFilter);
    }
  };
  const getGrandTotal = (data: ISalesReport[]) => {
    const total = data.reduce((acc, curr) => {
      return acc + curr?.totalSales || 0;
    }, 0);
    return total;
  };
  const downloadReport = async () => {
    let params: any = {};
    if (startDate && endDate) {
      params = {
        ...params,
        fromDate: Method.convertDateToFormat(startDate, 'YYYY-MM-DD'),
        toDate: Method.convertDateToFormat(endDate, 'YYYY-MM-DD'),
      };
    }
    setIsDownloading(true);
    let apiService = new APICallService(
      salesReport.downloadSalesReport,
      params,
      undefined,
      'blob',
      false,
      '',
      GoodsRequestConst
    );
    let response = await apiService.callAPI();
    if (response) {
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download =
        `Sales_report` +
        Method.convertDateToDDMMYYYY(startDate) +
        '_' +
        Method.convertDateToDDMMYYYY(endDate) +
        '.xlsx';
      downloadLink.click();
    } else {
      error('Whoops! Sorry, no records found on selected date');
    }
    setIsDownloading(false);
  };
  return (
    <>
      <Row className="align-items-center">
        <Col
          xs={12}
          md={3}
          className="align-self-center"
        >
          <h1 className="fs-22 fw-bolder mb-0">{'Sales Report'}</h1>
        </Col>
        <Col
          xs={12}
          md={9}
          className="px-0"
        >
          {!fetchLoading ? (
            <Row className="d-flex justify-content-md-around">
              <Col
                md={5}
                className="text-end my-5 my-lg-0"
              >
                <ReactDatePicker
                  className="form-control bg-light border border-r8px  fs-15 fw-bold text-dark min-w-xl-250px min-w-250px min-w-lg-250px min-w-md-250px min-w-xs-288px "
                  onChange={handleDateFilter}
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  showFullMonthYearPicker
                  placeholderText="Filter by dates"
                  isClearable={true}
                  showYearDropdown={true}
                  scrollableYearDropdown={true}
                  dropdownMode="select"
                  customInput={<CustomDateInput inputClass="min-h-20px" />}
                  dayClassName={(date: Date) => {
                    return Method.dayDifference(
                      todayDate.toDateString(),
                      date.toDateString()
                    ) > 0
                      ? 'date-disabled'
                      : '';
                  }}
                />
              </Col>
              <Col
                md={4}
                className="text-end d-flex align-items-center justify-content-lg-center"
              >
                <div className="d-flex justify-content-lg-center fs-18 fw-600 ">
                  <span className="me-1 ">Grand Total : </span>
                  <span> Tsh {getGrandTotal(salesReportList)}</span>
                </div>
              </Col>
              <Col
                md={3}
                className="text-end"
              >
                <button
                  type="button"
                  className="me-2 fs-16 btn btn-primary fw-bold  btn-lg mb-2 "
                  onClick={downloadReport}
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                  disabled={loading || salesReportList.length === 0}
                >
                  {!isDownloading && (
                    <span className="indicator-label fs-16 fw-bold">
                      {'Download Report'}
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
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <Card className="border border-r10px mt-8">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
              <thead>
                <tr className="fs-16 fw-600 h-65px align-middle">
                  <th className="min-w-350px"> Product Name </th>
                  <th className="min-w-150px"> Quantity</th>
                  <th className="min-w-150px">Total Orders </th>
                  <th className="min-w-150px">Average Price </th>
                  <th className="min-w-150px">Total Amount</th>
                </tr>
              </thead>
              <tbody className="fs-15 fw-500">
                {loading ? (
                  <td
                    colSpan={5}
                    className="text-center"
                  >
                    <div className="w-100 d-flex justify-content-center">
                      <Loader loading={loading} />
                    </div>
                  </td>
                ) : (
                  <>
                    {salesReportList.length ? (
                      salesReportList.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex">
                              <div className="symbol symbol-50px border border-r10px me-4">
                                <img
                                  className="img-fluid border-r8px object-fit-contain"
                                  src={item?.variant?.media[0]?.url || ''}
                                />
                              </div>
                              <div>
                                <div>{item?.variant?.title || ''}</div>
                                <div className="fs-14 text-gray">
                                  {item?.variant.skuNumber || ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>
                              {Method.formatCurrency(item?.stockCount || 0)}
                            </span>
                          </td>
                          <td>
                            <span>
                              {Method.formatCurrency(item?.totalOrders || 0)}
                            </span>
                          </td>
                          <td>
                            <span>
                              {Method.formatCurrency(item?.averageSales || 0)}
                            </span>
                          </td>
                          <td>
                            <span>
                              {Method.formatCurrency(item?.totalSales || 0)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                            No Data Found
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
  );
};
export default SalesReport;
