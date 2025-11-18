import { Card, Col, Row } from 'react-bootstrap';
import { CustomSelect } from '../../../custom/Select/CustomSelect';
import { operationJSON } from '../../../../utils/staticJSON';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AddedOnOrderCancellation,
  AddedOnOrderModification,
  AddedOnReturn,
  DeductedOnDamage,
  DeductedOnMissing,
  DeductedOnOrderModification,
  DeductedOnReturnToSeller,
  DeductedOnSale,
  DirectlyReceived,
  ManuallyAdded,
  ManuallyDeducted,
  PAGE_LIMIT,
  Product,
  ShipmentThroughAdded,
  Units,
} from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../custom/DateRange/dateRange.css';
import Loader from '../../../../Global/loader';
import clsx from 'clsx';
import APICallService from '../../../../api/apiCallService';
import { inventory } from '../../../../api/apiEndPoints';
import Pagination from '../../../../Global/pagination';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import { productDetailsStore } from '../../../../utils/storeString';
const ProductInventoryHistory = (props: any) => {
  const navigate = useNavigate();
  const [fetchLoader, setFetchLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>(
    getKey(productDetailsStore.historyDateFilter)?.startDate
      ? new Date(getKey(productDetailsStore.historyDateFilter).startDate)
      : null
  );
  const [history, setHistory] = useState<any>([]);
  const [endDate, setEndDate] = useState<any>(
    getKey(productDetailsStore.historyDateFilter)?.endDate
      ? new Date(getKey(productDetailsStore.historyDateFilter)?.endDate)
      : null
  );
  const [page, setPage] = useState(
    getKey(productDetailsStore.historyPage) || 1
  );
  const [pageLimit, setPageLimit] = useState(
    getKey(productDetailsStore.historyLimit) || PAGE_LIMIT
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState<any>([]);
  const [selectedOperation, setSelectedOperation] = useState(
    getKey(productDetailsStore.historyOperationFilter) || '0'
  );
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      let temp: any = [];
      switch (selectedOperation) {
        case '1':
          temp = ['c1', 'c3', 'c4'];
          break;
        case '2':
          temp = ['c2'];
          break;
        case '3':
          temp = ['d2'];
          break;
        case '4':
          temp = ['d3', 'd4', 'd5'];
          break;
        case '5':
          temp = ['d1'];
          break;
        case '6':
          temp = ['c5', 'c6', 'd6'];
          break;
        default:
          temp = [];
      }
      setSearch(temp);
      await fetchDetails(page, pageLimit, startDate, endDate, temp);
      setFetchLoader(false);
    })();
  }, []);
  const fetchDetails = async (
    pageNo: number,
    limit: number,
    fromDate?: string,
    toDate?: string,
    sourceTypes?: any
  ) => {
    setLoading(true);
    let params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      fromDate: fromDate
        ? Method.convertDateToFormat(fromDate, 'YYYY-MM-DD')
        : '',
      toDate: toDate ? Method.convertDateToFormat(toDate, 'YYYY-MM-DD') : '',
    };
    if (sourceTypes.length > 0) {
      sourceTypes.map((val: any, index: number) => {
        params = { ...params, ['sourceTypes[' + index + ']']: val };
      });
    }
    let apiService = new APICallService(
      inventory.listInventoryVarianTransaction,
      params,
      { id: props.productDetails._id },
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response?.records.length) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setHistory(response.records);
    }
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(productDetailsStore.historyPage, val);
    await fetchDetails(val, pageLimit, startDate, endDate, search);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(productDetailsStore.historyPage, val + 1);
    await fetchDetails(val + 1, pageLimit, startDate, endDate, search);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(productDetailsStore.historyPage, val - 1);
    await fetchDetails(val - 1, pageLimit, startDate, endDate, search);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(productDetailsStore.historyPage, 1);
    setPageLimit(+event.target.value);
    setKey(productDetailsStore.historyLimit, parseInt(event.target.value));
    await fetchDetails(1, event.target.value, startDate, endDate, search);
  };
  const handleChange = async ([startDate, endDate]: any) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setPage(1);
    setKey(productDetailsStore.historyPage, 1);
    const startDateFormatted =
      startDate && endDate
        ? Method.convertDateToFormat(startDate, 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      startDate && endDate
        ? Method.convertDateToFormat(endDate, 'YYYY-MM-DD')
        : '';
    setHistory([]);
    setTotalRecords(0);
    if (startDate && endDate) {
      await fetchDetails(
        1,
        pageLimit,
        startDateFormatted,
        endDateFormatted,
        search
      );
      setKey(productDetailsStore.historyDateFilter, {
        startDate: startDate,
        endDate: endDate,
      });
    } else if (startDate === null && endDate === null) {
      await fetchDetails(
        1,
        pageLimit,
        startDateFormatted,
        endDateFormatted,
        search
      );
      removeKey(productDetailsStore.historyDateFilter);
    }
  };
  const handleStatusFilter = async (value: string) => {
    let temp: any = [];
    setHistory([]);
    setTotalRecords(0);
    setPage(1);
    if (value === '1') {
      temp = ['c1', 'c3', 'c4'];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (value === '2') {
      temp = ['c2'];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (value === '3') {
      temp = ['d2'];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (value === '4') {
      temp = ['d3', 'd4', 'd5'];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (value === '5') {
      temp = ['d1'];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (value === '6') {
      temp = ['c5', 'c6', 'd6'];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (!value) {
      temp = [];
      await fetchDetails(1, pageLimit, startDate, endDate, temp);
    }
    if (value) {
      setSelectedOperation(value);
      setKey(productDetailsStore.historyOperationFilter, value);
    } else {
      setSelectedOperation('0');
      removeKey(productDetailsStore.historyOperationFilter);
    }
    setSearch(temp);
  };
  const getTypeLabel = (type: string) => {
    switch (type) {
      case ShipmentThroughAdded:
      case ManuallyAdded:
      case DirectlyReceived:
        return 'New Stock Updated';
      case AddedOnReturn:
        return 'Customer return';
      case DeductedOnSale:
        return 'New order';
      case DeductedOnReturnToSeller:
        return 'Goods return request';
      case ManuallyDeducted:
      case DeductedOnMissing:
      case DeductedOnDamage:
        return 'Missing/Damaged goods';
      case DeductedOnOrderModification:
      case AddedOnOrderCancellation:
      case AddedOnOrderModification:
        return 'Order Modified';
      default:
        return '';
    }
  };
  return (
    <>
      {fetchLoader ? (
        <>
          <Row>
            <Col xs={12}>
              <Card className="border border-r10px">
                <Card.Body className="p-0 ">
                  <Row className="align-items-center h-250px">
                    <div className="d-flex justify-content-center">
                      <Loader loading={fetchLoader} />
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col xs={12}>
              <Card className="bg-light border mb-7">
                <Card.Body className="px-7 align-items-center">
                  <Row className="align-items-center">
                    <Col
                      xl={4}
                      md={4}
                      sm={12}
                      className="mb-xl-0 mb-5 "
                    >
                      <div className="d-flex align-items-center position-relative me-lg-4 ">
                        <CustomSelect
                          className="w-100"
                          placeholder="Search by operation type..."
                          options={operationJSON}
                          value={operationJSON.find(
                            (item) => item.value == selectedOperation
                          )}
                          backgroundColor="white"
                          onChange={(event: any) => {
                            handleStatusFilter(event?.value);
                          }}
                          isClearable={true}
                        />
                      </div>
                    </Col>
                    <Col
                      xl={8}
                      md={8}
                      sm={12}
                      className=""
                    >
                      <Row className="align-items-center justify-content-md-end">
                        <Col
                          md="auto"
                          className="mb-md-0 mb-5"
                        >
                          <Row className="align-items-center">
                            <Col xs="auto">
                              <label
                                htmlFor=""
                                className="fs-16 fw-500"
                              >
                                Filter by dates
                              </label>
                            </Col>
                            <Col xs>
                              <div className="min-w-lg-300px mw-lg-300px">
                                <DatePicker
                                  className="form-control bg-white min-h-60px fs-16 fw-bold text-dark min-w-md-288px min-w-225px custom-placeholder"
                                  selected={startDate}
                                  onChange={handleChange}
                                  selectsRange
                                  startDate={startDate}
                                  endDate={endDate}
                                  dateFormat="dd/MM/yyyy"
                                  showFullMonthYearPicker
                                  maxDate={new Date()}
                                  placeholderText="Select dates"
                                  isClearable={true}
                                  showYearDropdown={true}
                                  scrollableYearDropdown={true}
                                  dropdownMode="select"
                                  customInput={<CustomDateInput />}
                                  dayClassName={(date: Date) => {
                                    return Method.dayDifference(
                                      new Date().toDateString(),
                                      date.toDateString()
                                    ) > 0
                                      ? 'date-disabled'
                                      : '';
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="border border-r10px">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table align-middle table-rounded table-row-bordered gs-7 gy-6 mb-0 no-footer">
                      <thead>
                        <tr className="text-start fw-bold fs-16 gs-0 border-bottom">
                          <th
                            className="min-w-200px"
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Date & Time
                          </th>
                          <th
                            className="min-w-125px"
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Units
                          </th>
                          <th
                            className="min-w-150px"
                            tabIndex={0}
                            rowSpan={1}
                            colSpan={1}
                          >
                            Operation type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <>
                            <td colSpan={4}>
                              <div className="w-100 d-flex justify-content-center">
                                <Loader loading={loading} />
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            {history && history.length ? (
                              <>
                                {history.map((historyVal: any) => {
                                  return (
                                    <tr
                                      key={historyVal._id}
                                      className="odd"
                                    >
                                      <td className="fs-15 fw-600">
                                        <span className="text-dark d-block">
                                          {historyVal._createdAt
                                            ? Method.convertDateToDDMMYYYYHHMMAMPM(
                                                historyVal._createdAt
                                              )
                                            : '-'}
                                        </span>
                                      </td>
                                      <td>
                                        {historyVal.quantityTypes.some(
                                          (item: any, idx: number) =>
                                            item.type === Units
                                        ) ? (
                                          <span
                                            className={clsx(
                                              'fs-15 fw-600 d-block',
                                              historyVal.source.type ===
                                                ShipmentThroughAdded ||
                                                historyVal.source.type ===
                                                  ManuallyAdded ||
                                                historyVal.source.type ===
                                                  DirectlyReceived ||
                                                historyVal.source.type ===
                                                  AddedOnReturn ||
                                                historyVal.source.type ===
                                                  AddedOnOrderCancellation ||
                                                historyVal.source.type ===
                                                  AddedOnOrderModification
                                                ? 'text-success'
                                                : '',
                                              historyVal.source.type ===
                                                ManuallyDeducted ||
                                                historyVal.source.type ===
                                                  DeductedOnMissing ||
                                                historyVal.source.type ===
                                                  DeductedOnDamage ||
                                                historyVal.source.type ===
                                                  DeductedOnReturnToSeller ||
                                                historyVal.source.type ===
                                                  DeductedOnSale ||
                                                historyVal.source.type ===
                                                  DeductedOnOrderModification
                                                ? 'text-danger'
                                                : ''
                                            )}
                                          >
                                            {historyVal.source.type ===
                                              ShipmentThroughAdded ||
                                            historyVal.source.type ===
                                              ManuallyAdded ||
                                            historyVal.source.type ===
                                              DirectlyReceived ||
                                            historyVal.source.type ===
                                              AddedOnReturn ||
                                            historyVal.source.type ===
                                              AddedOnOrderCancellation ||
                                            historyVal.source.type ===
                                              AddedOnOrderModification
                                              ? '+'
                                              : ''}
                                            {historyVal.source.type ===
                                              ManuallyDeducted ||
                                            historyVal.source.type ===
                                              DeductedOnMissing ||
                                            historyVal.source.type ===
                                              DeductedOnDamage ||
                                            historyVal.source.type ===
                                              DeductedOnReturnToSeller ||
                                            historyVal.source.type ===
                                              DeductedOnSale ||
                                            historyVal.source.type ===
                                              DeductedOnOrderModification
                                              ? '-'
                                              : ''}{' '}
                                            {
                                              historyVal.quantityTypes.find(
                                                (item: any) =>
                                                  item.type === Units
                                              ).stockCount
                                            }{' '}
                                          </span>
                                        ) : (
                                          <span className="fs-15 fw-600  d-block">
                                            -
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        <div className="badge badge-light border-r23px">
                                          <span className="fs-15 fw-600 text-dark p-3 px-4">
                                            {getTypeLabel(
                                              historyVal.source.type
                                            )}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            ) : (
                              <tr>
                                <td colSpan={4}>
                                  <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                    No Data found
                                  </div>
                                </td>
                              </tr>
                            )}{' '}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {!loading && totalRecords > 0 ? (
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
          </Row>
        </>
      )}
    </>
  );
};
export default ProductInventoryHistory;
