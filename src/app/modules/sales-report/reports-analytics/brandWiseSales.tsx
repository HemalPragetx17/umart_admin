import React, { useEffect, useState } from "react";
import { Button, Card, Col, FormLabel, Row } from "react-bootstrap";
import { useAuth } from "../../auth";
import Method from "../../../../utils/methods";
import APICallService from "../../../../api/apiCallService";
import { reports } from "../../../../api/apiEndPoints";
import {
  BrandWiseSalesPerformanceReport,
  Download,
} from "../../../../utils/constants";
import Loader from "../../../../Global/loader";
import CustomDatePicker from "../../../custom/DateRange/DatePicker";
import CustomDateInput from "../../../custom/Select/CustomDateInput";
const BrandWiseSales = () => {
  const { currentUser } = useAuth();
  const [endDate, setEndDate] = useState<any>(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );
  const [startDate, setStartDate] = useState<any>(
    new Date(new Date().setDate(new Date().getDate() - 1))
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
        ? Method.convertDateToFormat(startDate, "YYYY-MM-DD")
        : "",
      toDate: endDate ? Method.convertDateToFormat(endDate, "YYYY-MM-DD") : "",
      utcOffset: new Date().getTimezoneOffset(),
    };
    let apiService = new APICallService(
      reports.brandWiseSalesReport,
      params,
      "",
      "",
      "",
      "",
      BrandWiseSalesPerformanceReport
    );
    let response = await apiService.callAPI();
    if (response) {
      setProductData(response);
    }
  };
  const handleChange = async ([startDate, endDate]: any) => {
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate && endDate) {
      setFetchLoading(true);
      setTotalRecords(0);
      await fetchOrder(
        Method.convertDateToFormat(startDate, "YYYY-MM-DD"),
        Method.convertDateToFormat(endDate, "YYYY-MM-DD")
      );
      setFetchLoading(false);
    }
  };
  const handleDownload = async () => {
    let params: any = {
      isReport: true,
      fromDate: startDate
        ? Method.convertDateToFormat(startDate, "YYYY-MM-DD")
        : "",
      toDate: endDate ? Method.convertDateToFormat(endDate, "YYYY-MM-DD") : "",
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
      reports.brandWiseSalesReport,
      params,
      undefined,
      "blob",
      "",
      "",
      BrandWiseSalesPerformanceReport
    );
    let response = await apiService.callAPI();
    if (response) {
      const pdfBlob = new Blob([response], { type: "application/pdf" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download =
        "Brand-Wise_Sales_Performance_Report" +
        Method.convertDateToDDMMYYYY(startDate) +
        "_" +
        Method.convertDateToDDMMYYYY(endDate) +
        ".pdf";
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
              Brand-Wise Sales Performance Report
            </h1>
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
                maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                inputTextBG="bg-white"
                customInput={<CustomDateInput />}
                dayClassName={(date: Date) => {
                  return Method.dayDifference(
                    new Date(Method.getYesterDayDate()).toDateString(),
                    date.toDateString()
                  ) > 0
                    ? "date-disabled"
                    : "";
                }}
              />
            </div>
          </div>
        </Col>
        {!fetchLoading && productData.length ? (
          <>
            {Method.hasPermission(
              BrandWiseSalesPerformanceReport,
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
                      style={{ display: "block" }}
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
                  <th className="min-w-250px">Brand Name</th>
                  <th className="min-w-150px">Total Sales</th>
                  <th className="min-w-300px">Top Selling Products</th>
                  <th className="min-w-300px">Top Customers</th>
                </tr>
              </thead>
              <tbody className="fs-15 fw-600">
                {fetchLoading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="d-flex justify-content-center">
                        <Loader loading={fetchLoading} />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {productData.length ? (
                      productData.map((val: any, index: number) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td>
                              <span className="fs-15 fw-600">
                                {val.brandName || "-"}
                              </span>
                            </td>
                            <td>
                              <span className="fs-15 fw-600 text-center">
                                TSh{" "}
                                {Method.getGeneralizedAmount(val.totalSales) ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                {val.topSellingProducts.map(
                                  (product: any, index: number) => (
                                    <span
                                      key={index}
                                      className="badge rounded-pill bg-light-primary text-dark border border-secondary fs-15 fw-600 "
                                    >
                                      {product.productName}
                                    </span>
                                  )
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="fs-15 fw-600 text-center">
                                {val.topCustomers
                                  .map((val: any) => val.customerName)
                                  .join(", ")}
                              </span>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
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
export default BrandWiseSales;
