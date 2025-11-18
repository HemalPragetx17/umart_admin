import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { reports } from '../../../api/apiEndPoints';
import {
  OrderCancelled,
  OrderDelivered,
  OrderFailed,
  OrderOutForDelivery,
  OrderProcessed,
  OrderSubmitted,
  PAGE_LIMIT,
  PaymentFailed,
  Reports,
} from '../../../utils/constants';
import Pagination from '../../../Global/pagination';
import { error } from '../../../Global/toast';
import Method from '../../../utils/methods';
import ReactDatePicker from 'react-datepicker';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import ArrowDown from '../../../umart_admin/assets/media/svg_uMart/down-arrow.svg';
const SalesReportV2 = () => {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<
    {
      customer: any;
      refKey: string;
      statusUpdatedAt: string;
      payment: any;
      _createdAt: string;
      _id: string;
      address: any;
      orderedQuantities: number;
      productNames: any;
      productSKUs: any;
      status: number;
      variants: any;
    }[]
  >([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [search, setSearch] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>('');
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProducts(1, pageLimit)]);
      setLoading(false);
    })();
  }, []);
  const fetchProducts = async (
    pageNo: number,
    limit: number,
    fromDate?: any,
    toDate?: any
  ) => {
    setLoading(true);
    let data: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      utcOffset: new Date().getTimezoneOffset(),
    };
    if (fromDate && toDate) {
      data.fromDate = Method.convertDateToFormat(fromDate, 'YYYY-MM-DD');
      data.toDate = Method.convertDateToFormat(toDate, 'YYYY-MM-DD');
    }
    let apiService = new APICallService(
      reports.salesReportV2,
      data,
      '',
      '',
      false,
      '',
      Reports
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(response.total);
      }
      setProductList(response.records);
    } else {
      setProductList([]);
    }
    setLoading(false);
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    let params: any = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
    };
    if (startDate && endDate) {
      params.fromDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
      params.toDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    }
    let apiService = new APICallService(
      reports.salesReportV2,
      params,
      undefined,
      'arraybuffer',
      '',
      '',
      Reports
    );
    let response = await apiService.callAPI();
    if (response) {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-report' + '.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      error('Data Not Found');
    }
    setIsDownloading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    await fetchProducts(val, pageLimit, startDate, endDate);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchProducts(val + 1, pageLimit, startDate, endDate);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchProducts(val - 1, pageLimit, startDate, endDate);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchProducts(1, event.target.value, startDate, endDate);
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setPage(1);
    if (event[0] && event[1]) {
      await fetchProducts(1, pageLimit, event[0], event[1]);
    } else if (event[0] === null && event[1] === null) {
      await fetchProducts(1, pageLimit);
    }
  };
  const getStatusText = (status: any) => {
    if (status == OrderSubmitted) {
      return 'Order Submitted';
    } else if (status == OrderProcessed) {
      return 'Processed';
    } else if (status == OrderOutForDelivery) {
      return 'Out For Delivery';
    } else if (status == OrderDelivered) {
      return 'Delivered';
    } else if (
      status == OrderCancelled ||
      status == PaymentFailed ||
      status == OrderFailed
    ) {
      return 'Cancelled';
    }
    return '-';
  };
  return (
    <Row>
      <Col>
        <h1>Sales report</h1>
      </Col>
      <Col md="auto">
        <Button
          className="fs-15 fw-600 min-h-50px"
          onClick={() => handleDownload()}
          disabled={loading || isDownloading}
        >
          {!isDownloading && (
            <span className="indicator-label fs-16 fw-bold">
              Download Excel
            </span>
          )}
          {isDownloading && (
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
      <Col
        xs={12}
        className="mt-6"
      >
        <Card className="bg-light border mb-7">
          <Card.Body className="px-7 py-4">
            <Row className="align-items-center py-3">
              <Col
                md={5}
                sm={12}
              >
                <ReactDatePicker
                  className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-xl-300px min-w-250px min-w-lg-200px min-w-md-325px min-w-xs-288px "
                  selected={startDate}
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
                  customInput={<CustomDateInput />}
                  // disabled={fetchLoader}
                />
              </Col>
              <Col
                md={4}
                sm={12}
              ></Col>
              <Col
                // lg={4}
                md={4}
                sm={12}
              >
                {/* <FormLabel className="fs-16 fw-500 text-dark  min-h-25px">
                  {''}
                </FormLabel>{' '} */}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12}>
        {' '}
        <Card className="border border-r10px mt-3">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-row-bordered datatable align-middle gs-7 gy-4 my-0">
                <thead>
                  <tr className="fs-16 fw-600 h-65px align-middle">
                    <th className="min-w-200px"> Order date & time </th>
                    <th className="min-w-100px"> Order ID </th>
                    <th className="min-w-150px"> Customer name </th>
                    <th className="min-w-150px"> Quantity </th>
                    <th className="min-w-150px">Total Value (TSh)</th>
                    <th className="min-w-150px">
                      Ready to be dispatch date and time
                    </th>
                    <th className="min-w-200px">
                      Expected Delivery Date & Time
                    </th>
                    <th className="min-w-250px">Delivery Date & Time</th>
                  </tr>
                </thead>
                <tbody className="fs-15 fw-500">
                  {loading ? (
                    <td
                      colSpan={11}
                      className="text-center"
                    >
                      <div className="w-100 d-flex justify-content-center">
                        <Loader loading={loading} />
                      </div>
                    </td>
                  ) : (
                    <>
                      {productList.length ? (
                        productList.map((item, index: number) => (
                          <>
                            <tr
                              key={item._id}
                              className="cursor-pointer h-70px"
                              onClick={() => {
                                if (selectedItem == item?._id) {
                                  setSelectedItem('');
                                } else {
                                  setSelectedItem(item?._id);
                                }
                              }}
                            >
                              <td>
                                {Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                  item?._createdAt,
                                  '-'
                                )}
                              </td>
                              <td>
                                <span className="ms-3">
                                  {item?.refKey || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {item?.customer?.name || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {item?.orderedQuantities || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {Method.formatCurrency(
                                    item?.payment?.totalCharge || 0
                                  )}
                                </span>
                              </td>
                              <td>
                                <span>-</span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {Method.getExpectedDeliveryTime(item)}
                                </span>
                              </td>
                              <td>
                                <span className="d-flex justify-content-between">
                                  <span className="ms-3">
                                    {item?.status == 4
                                      ? Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                          item?.statusUpdatedAt,
                                          '-'
                                        )
                                      : 'Not Delivered'}
                                  </span>
                                  <span className="ms-7">
                                    <img
                                      src={ArrowDown}
                                      alt="down"
                                      width={15}
                                      className={`${
                                        selectedItem === item?._id
                                          ? 'rotate-180'
                                          : ''
                                      }`}
                                    />
                                  </span>
                                </span>
                              </td>
                            </tr>
                            {selectedItem === item?._id && item?.variants ? (
                              <>
                                {item?.variants?.length > 0 ? (
                                  <tr
                                    className="bg-light"
                                    style={{
                                      marginLeft: '20px',
                                    }}
                                  >
                                    <td>
                                      <div className="ps-6">
                                        {'Product name'}
                                      </div>
                                    </td>
                                    <td>
                                      <span className="">{'Sku Number'}</span>
                                    </td>
                                    <td>
                                      <span className="">Unit Price (TSh)</span>
                                    </td>
                                    <td>
                                      <span className="ps-3">Quantity</span>
                                    </td>
                                    <td>
                                      <span className="ps-3">
                                        Total Value (TSh)
                                      </span>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                ) : (
                                  <></>
                                )}
                                {item?.variants?.map((product: any) => {
                                  return (
                                    <tr
                                      key={product?.name}
                                      className="bg-light"
                                      style={{
                                        marginLeft: '20px',
                                      }}
                                    >
                                      <td>
                                        <div className="ps-6">
                                          {product?.variant?.title || '-'}
                                        </div>
                                      </td>
                                      <td>
                                        <span className="">
                                          {product?.variant?.skuNumber || '-'}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="">
                                          {product?.amount
                                            ? Method.formatCurrency(
                                                product?.amount
                                              )
                                            : '-'}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="ps-3">
                                          {product?.stockCount
                                            ? product?.stockCount
                                            : '-'}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="ps-3">
                                          {Method.formatCurrency(
                                            product?.totalAmount || 0
                                          ) || '-'}
                                        </span>
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  );
                                })}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7}>
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
        {!loading && productList.length > 0 ? (
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
      </Col>
    </Row>
  );
};
export default SalesReportV2;
