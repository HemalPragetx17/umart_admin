import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import {
  inventory,
  master,
  ordersDelivery,
  reports,
} from '../../../api/apiEndPoints';
import {
  Inventory,
  PAGE_LIMIT,
  Product,
  Reports,
} from '../../../utils/constants';
import Pagination from '../../../Global/pagination';
import { KTSVG } from '../../../umart_admin/helpers';
import { CustomComponentSelect } from '../../custom/Select/CustomComponentSelect';
import { useDebounce } from '../../../utils/useDebounce';
import { error } from '../../../Global/toast';
import Method from '../../../utils/methods';
import { CustomReportSelect } from '../../custom/Select/CustomReportSelect';
import ReactDatePicker from 'react-datepicker';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { paymentTypeOptions } from '../../../utils/staticJSON';
import { IOption } from '../../../types/responseIndex';
const modeOfPayments = ['Cash', 'Online', 'Coin'];
const DeliveryReport = () => {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<
    {
      customer: any;
      payment: any;
      refKey: string;
      routesUsers: any;
      statusUpdatedAt: string;
      totalCharge: number;
      _createdAt: string;
      _id: string;
      address: any;
    }[]
  >([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [driverList, setDriverList] = useState<any>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<any>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProducts(1, pageLimit, ''), fetchDrivers()]);
      setLoading(false);
    })();
  }, []);
  const fetchProducts = async (
    pageNo: number,
    limit: number,
    drivers?: any,
    paymentType?: any,
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
    };
    if (drivers) {
      let tempDrivers = drivers ? JSON.parse(JSON.stringify(drivers)) : [];
      if (tempDrivers?.length > 0 && tempDrivers[0].value === 0) {
        tempDrivers.shift();
      }
      if (tempDrivers.length > 0) {
        tempDrivers.map((val: any, index: number) => {
          data = { ...data, ['driverIdList[' + index + ']']: val.id };
        });
        data.categoryDepth = 1;
      }
    }
    if (paymentType && paymentType?.value !== 0) {
      data['paymentModeList[0]'] = paymentType?.value;
    }
    if (fromDate && toDate) {
      data.fromDate = Method.convertDateToFormat(fromDate, 'YYYY-MM-DD');
      data.toDate = Method.convertDateToFormat(toDate, 'YYYY-MM-DD');
    }
    let apiService = new APICallService(
      reports.deliveryReport,
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
  const fetchDrivers = async () => {
    let apiService = new APICallService(
      ordersDelivery.deliveryUsers,
      {},
      '',
      '',
      false,
      '',
      Reports
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      let temp: any = [];
      response.records.map((val: any) => {
        temp.push({
          value: val._id,
          name: val?.name || '',
          id: val._id,
          img: val.image,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px symbol-circle border me-2">
                <img
                  src={val.image}
                  className="object-fit-cover"
                  alt=""
                />
              </span>
              <label
                className="form-check-label fs-16 fw-600 text-dark"
                htmlFor="Ex2"
              >
                {val?.name || ''}
              </label>
            </>
          ),
          title: val?.name || '',
        });
      });
      temp.unshift({
        label: (
          <>
            <span className="fs-16 fw-600 text-black mb-0"> All</span>
          </>
        ),
        value: 0,
        id: 0,
        title: 'All',
        name: 'All',
        img: '',
      });
      setDriverList(temp);
    }
  };
  const handleCategoryFilter = async (event: any) => {
    let tempCategories = [...selectedDrivers];
    if (Array.isArray(event)) {
      if (event.length > tempCategories.length) {
        if (
          event.some((item) => item.value === 0) ||
          event.length == driverList.length - 1
        ) {
          tempCategories = driverList;
        } else {
          tempCategories = event;
        }
      } else {
        if (event.some((val: any) => val.value === 0)) {
          let temp = event.filter((val: any) => val.value !== 0);
          tempCategories = temp;
        } else if (
          !event.some((val: any) => val.value === 0) &&
          event.length == driverList.length - 1
        ) {
          tempCategories = [];
        } else {
          tempCategories = event;
        }
      }
    } else {
      tempCategories = [event];
    }
    setPage(1);
    setSelectedDrivers(tempCategories);
    await fetchProducts(
      1,
      pageLimit,
      tempCategories,
      selectedPaymentType,
      startDate,
      endDate
    );
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    let params: any = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
    };
    if (selectedPaymentType && selectedPaymentType.value !== 0) {
      params['paymentModeList[0]'] = selectedPaymentType?.value;
    }
    if (startDate && endDate) {
      params.fromDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
      params.toDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    }
    if (selectedDrivers && selectedDrivers?.length) {
      const tempDrivers = selectedDrivers.filter((val: any) => val.id !== 0);
      if (tempDrivers.length > 0) {
        tempDrivers.map((val: any, index: number) => {
          params = { ...params, ['driverIdList[' + index + ']']: val.id };
        });
      }
    }
    let apiService = new APICallService(
      reports.deliveryReport,
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
      link.download = 'delivery-report' + '.xlsx';
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
    await fetchProducts(
      val,
      pageLimit,
      selectedDrivers,
      selectedPaymentType,
      startDate,
      endDate
    );
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchProducts(
      val + 1,
      pageLimit,
      selectedDrivers,
      selectedPaymentType,
      startDate,
      endDate
    );
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchProducts(
      val - 1,
      pageLimit,
      selectedDrivers,
      selectedPaymentType,
      startDate,
      endDate
    );
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchProducts(
      1,
      event.target.value,
      selectedDrivers,
      selectedPaymentType,
      startDate,
      endDate
    );
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setPage(1);
    if (event[0] && event[1]) {
      await fetchProducts(
        1,
        pageLimit,
        selectedDrivers,
        selectedPaymentType,
        event[0],
        event[1]
      );
    } else if (event[0] === null && event[1] === null) {
      await fetchProducts(1, pageLimit, selectedDrivers, selectedPaymentType);
    }
  };
  const handlePaymentTypeChange = async (event: IOption) => {
    setPage(1);
    setSelectedPaymentType(event);
    if (event) {
      await fetchProducts(
        1,
        pageLimit,
        selectedDrivers,
        event,
        startDate,
        endDate
      );
    } else {
      await fetchProducts(
        1,
        pageLimit,
        selectedDrivers,
        null,
        startDate,
        endDate
      );
    }
  };
  return (
    <Row>
      <Col>
        <h1>Delivery report</h1>
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
                lg={4}
                md={4}
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
              >
                <CustomSelectWhite
                  placeholder={'Select payment type'}
                  options={paymentTypeOptions}
                  // defaultValue={statusOptions[0]}
                  onChange={(event: IOption) => {
                    handlePaymentTypeChange(event);
                  }}
                  isSearchable={false}
                  // value={status}
                  // isClearable={Object.keys(productState).length}
                />
              </Col>
              <Col
                // lg={4}
                md={4}
                sm={12}
              >
                {/* <FormLabel className="fs-16 fw-500 text-dark  min-h-25px">
                  {''}
                </FormLabel>{' '} */}
                <div className="d-flex justify-content-center align-items-center ">
                  <div className="w-100">
                    <CustomReportSelect
                      backgroundColor="#ffff"
                      // isLoading={loading}
                      closeMenuOnSelect={false}
                      isSearchable={true}
                      options={driverList}
                      text={'drivers selected'}
                      placeholder="Select driver"
                      hideSelectedOptions={false}
                      value={selectedDrivers}
                      onChange={(event: any) => {
                        handleCategoryFilter(event);
                      }}
                      isMulti={true}
                    />
                  </div>
                </div>
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
                    <th className="min-w-300px"> Address </th>
                    <th className="min-w-100px"> District </th>
                    <th className="min-w-150px"> Driver name </th>
                    <th className="min-w-200px"> Delivery date & time</th>
                    <th className="min-w-190px">Mode of payment</th>
                    <th className="min-w-150px">Amount (TSh)</th>
                  </tr>
                </thead>
                <tbody className="fs-15 fw-500">
                  {loading ? (
                    <td
                      colSpan={9}
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
                          <tr key={item._id}>
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
                              <span className="">
                                {item?.address
                                  ? `
                            ${
                              item?.address?.floorNumber
                                ? item?.address?.floorNumber + ', '
                                : ''
                            }
                          ${
                            item?.address?.houseNumber
                              ? item?.address?.houseNumber + ', '
                              : ''
                          }
                            ${
                              item?.address?.buildingName
                                ? item?.address?.buildingName + ', '
                                : ''
                            }
                            ${
                              item?.address?.landmark
                                ? item?.address?.landmark + ', '
                                : ''
                            }
                            ${
                              item?.address?.addressLine1
                                ? item?.address?.addressLine1 + ' '
                                : ''
                            }
                            `
                                  : 'NA'}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {item?.address?.districtName || '-'}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {item?.routesUsers && item?.routesUsers?.length
                                  ? item?.routesUsers[0]?.deliveryUser?.name 
                                  : '-'}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                  item?.statusUpdatedAt,
                                  '-'
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {item?.payment?.paymentMode
                                  ? modeOfPayments[item?.payment?.paymentMode - 1]
                                  : ''}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(item?.payment?.totalCharge || 0)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9}>
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
export default DeliveryReport;
