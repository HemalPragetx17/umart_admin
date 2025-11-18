import React, { useEffect, useState } from 'react';
import { Button, Card, Col, FormLabel, Row } from 'react-bootstrap';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import APICallService from '../../../../api/apiCallService';
import { reports } from '../../../../api/apiEndPoints';
import { Download, InventoryStatusReport } from '../../../../utils/constants';
import ReactDatePicker from 'react-datepicker';
import Loader from '../../../../Global/loader';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
const ProductVariantReport = () => {
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState<any>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<any>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [productData, setProductData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      await fetchOrder(startDate, endDate);
      setFetchLoading(false);
    })();
  }, []);
  const fetchOrder = async (startDate: string, endDate: string) => {
    let params = {
      fromDate: startDate
        ? Method.convertDateToFormat(startDate, 'YYYY-MM-DD')
        : '',
      toDate: endDate ? Method.convertDateToFormat(endDate, 'YYYY-MM-DD') : '',
      utcOffset: new Date().getTimezoneOffset(),
    };
    let apiService = new APICallService(
      reports.productVariantInventoryReport,
      params,
      '',
      '',
      '',
      '',
      InventoryStatusReport
    );
    let response = await apiService.callAPI();
    if (response) {
      setProductData(response);
    }
  };
  const handleChange = async (date: Date) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
  const handleDownload = async () => {
    let params: any = {
      isReport: true,
      fromDate: startDate
        ? Method.convertDateToFormat(startDate, 'YYYY-MM-DD')
        : '',
      toDate: endDate ? Method.convertDateToFormat(endDate, 'YYYY-MM-DD') : '',
      utcOffset: new Date().getTimezoneOffset(),
    };
    //   if (startDate && endDate) {
    //     params = {
    //       ...params,
    //       fromDate: Method.convertDateToFormat(startDate, 'YYYY-MM-DD'),
    //       toDate: Method.convertDateToFormat(endDate, 'YYYY-MM-DD'),
    //     };
    //   }
    setLoading(true);
    let apiService = new APICallService(
      reports.productVariantInventoryReport,
      params,
      undefined,
      'blob',
      '',
      '',
      InventoryStatusReport
    );
    let response = await apiService.callAPI();
    if (response) {
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download =
        'Product_Variant_Inventory_Status_Report' +
        Method.convertDateToDDMMYYYY(startDate) +
        '_' +
        Method.convertDateToDDMMYYYY(endDate) +
        '.pdf';
      downloadLink.click();
    } else {
    }
    setLoading(false);
  };
  return (
    <div className="">
      <Row className="g-4">
        <Col md>
          <div className="d-flex align-items-center mt-4">
            <h1 className="fs-22 fw-bolder">
              Product Variant Inventory Status Report
            </h1>
          </div>
        </Col>
        <Col md="auto">
          <div className="d-flex align-items-center">
            <FormLabel className="fs-16 fw-500">Filter by month</FormLabel>
            <div className="ms-5">
              <ReactDatePicker
                className="form-control custom-month bg-white min-h-30px fs-16 fw-bold text-dark min-w-md-288px min-w-175px"
                onChange={handleChange}
                selected={startDate}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                maxDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                }
                customInput={<CustomDateInput />}
                dayClassName={(date: Date) => {
                  return Method.dayDifference(
                    new Date(Method.getYesterDayDate()).toDateString(),
                    date.toDateString()
                  ) > 0
                    ? 'date-disabled'
                    : '';
                }}
              />
            </div>
          </div>
        </Col>
        {!fetchLoading && productData.length ? (
          <>
            {Method.hasPermission(
              InventoryStatusReport,
              Download,
              currentUser
            ) ? (
            <Col sm="auto">
              <Button
                variant=""
                size="lg"
                className="text-primary  bg-light-primary ms-3"
                onClick={() => handleDownload()}
                disabled={loading}
              >
                {!loading && (
                  <span className="indicator-label">Download report</span>
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
            </Col>
             ) : (
              <></>
            )} 
          </>
        ) : (
          <></>
        )}
      </Row>
      <Card className="border border-r10px mt-6">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
              <thead>
                <tr className="fs-16 fw-600 h-65px align-middle">
                  <th className="min-w-150px">Product Name</th>
                  <th className="min-w-250px">Inventory (Previous Month)</th>
                  <th className="min-w-200px">Inventory (This Month)</th>
                  <th className="min-w-200px">Inventory Change</th>
                </tr>
              </thead>
              <tbody className="fs-15 fw-600">
                {fetchLoading ? (
                  <>
                    <tr>
                      <td colSpan={4}>
                        <div className="d-flex justify-content-center">
                          <Loader loading={fetchLoading} />
                        </div>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {productData.length ? (
                      <>
                        {productData?.map((val: any, index: number) => (
                          <>
                            <tr key={index}>
                              <td>{val.title || '-'} </td>
                              <td>
                                <span className="fs-15 fw-600">
                                  {val.previousMonth}
                                </span>
                              </td>
                              <td>
                                <span className="fs-15 fw-600">
                                  {val.currentMonth}
                                </span>
                              </td>
                              <td>
                                <span className="fs-15 fw-600">
                                  {val.inventoryChange}
                                </span>
                              </td>
                            </tr>
                          </>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={4}>
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
    </div>
  );
};
export default ProductVariantReport;
