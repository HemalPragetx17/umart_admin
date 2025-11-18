import { Button, Card, Col, FormLabel, Row } from 'react-bootstrap';
import { InventoryString, LowStocksString } from '../../../../utils/string';
import { KTSVG } from '../../../../umart_admin/helpers';
import { useEffect, useState } from 'react';
import Loader from '../../../../Global/loader';
import { stockLastJSON } from '../../../../utils/staticJSON';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
import LowStockModal from '../../../modals/low-stock-modal';
import {
  Edit,
  Inventory,
  LowStockConst,
  PAGE_LIMIT,
} from '../../../../utils/constants';
import { lowStockList } from '../../../../api/apiEndPoints';
import APICallService from '../../../../api/apiCallService';
import Method from '../../../../utils/methods';
import Pagination from '../../../../Global/pagination';
import { useDebounce } from '../../../../utils/useDebounce';
import ReactDatePicker from 'react-datepicker';
import CalendarIcon from '../../../../umart_admin/assets/media/calendar-icon.png';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import { listLowStock } from '../../../../utils/storeString';
import { useAuth } from '../../auth';
const AllLowStocks = () => {
  const { currentUser } = useAuth();
  const [stocksList, setStocksList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>();
  const [page, setPage] = useState(getKey(listLowStock.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listLowStock.limit) || PAGE_LIMIT
  );
  const [searchTerm, setSearchTerm] = useState(
    getKey(listLowStock.search) || ''
  );
  const [totalRecords, setTotalRecords] = useState(-1);
  const [date, setDate] = useState<any>(
    getKey(listLowStock.dateFilter)
      ? new Date(getKey(listLowStock.dateFilter))
      : null
  );
  const [days, setDays] = useState(
    getKey(listLowStock.stockRequireFilter) || 0
  );
  const [lowStockReport, setLowStockReport] = useState<any>();
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(LowStockConst, currentUser)) {
        return window.history.back();
      }
      await fetchLowStockList(page, pageLimit, days, date, searchTerm);
      setLoading(false);
    })();
  }, []);
  const fetchLowStockList = async (
    pageNo: number,
    limit: number,
    stockRequireFor?: number,
    date?: any,
    searchTerm?: string
  ) => {
    setLoading(true);
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
    };
    if (stockRequireFor) {
      params = { ...params, requiredStockFor: stockRequireFor };
    }
    if (date) {
      params = {
        ...params,
        date: Method.convertDateToFormat(date, 'YYYY-MM-DD'),
      };
    }
    if (searchTerm) {
      params = { ...params, searchTerm: searchTerm.trim() };
    }
    const apiService = new APICallService(
      lowStockList.listLowStock,
      params,
      '',
      '',
      false,
      '',
      LowStockConst
    );
    const response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(response.total);
      }
      setStocksList(response.records);
    }
    setLoading(false);
  };
  const fetchLowStockReport = async (
    firstDayToShow: any,
    lastDayToShow: any,
    ordered: boolean
  ) => {
    let params = {
      fromDate: firstDayToShow,
      toDate: lastDayToShow,
      ordered: ordered,
    };
    let apiService = new APICallService(
      lowStockList.lowStockReport,
      params,
      '',
      '',
      false,
      '',
      LowStockConst
    );
    let response = await apiService.callAPI();
    setLowStockReport(response.records);
  };
  const debounce = useDebounce(fetchLowStockList, 300);
  const handleSearch = async (value: string) => {
    value = value.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    //const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(value);
    if (!isValid) {
      return;
    }
    setSearchTerm(value);
    if (value.trim().length > 2 && searchTerm !== value) {
      setPage(1);
      setKey(listLowStock.page, 1);
      setLoading(true);
      setTotalRecords(0);
      await debounce(1, pageLimit, days, date, value);
    } else if (value.trim().length <= 2 && value.length < searchTerm.length) {
      setPage(1);
      setKey(listLowStock.page, 1);
      setLoading(true);
      setTotalRecords(0);
      await debounce(1, pageLimit, days, date, value);
    }
    setKey(listLowStock.search, value);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setLoading(true);
    setPage(val);
    setKey(listLowStock.page, val);
    await fetchLowStockList(val, pageLimit, days, date, searchTerm);
    setLoading(false);
  };
  const handleNextPage = async (val: number) => {
    setLoading(true);
    setPage(val + 1);
    setKey(listLowStock.page, val + 1);
    await fetchLowStockList(val + 1, pageLimit, days, date, searchTerm);
    setLoading(false);
  };
  const handlePreviousPage = async (val: number) => {
    setLoading(true);
    setPage(val - 1);
    setKey(listLowStock.page, val - 1);
    await fetchLowStockList(val - 1, pageLimit, days, date, searchTerm);
    setLoading(false);
  };
  const handlePageLimit = async (event: any) => {
    setLoading(true);
    setPage(1);
    setKey(listLowStock.page, 1);
    setTotalRecords(0);
    setKey(listLowStock.limit, parseInt(event.target.value));
    setPageLimit(parseInt(event.target.value));
    await fetchLowStockList(
      1,
      parseInt(event.target.value),
      days,
      date,
      searchTerm
    );
    setLoading(false);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setCurrentProduct(undefined);
  };
  const handleStockRequireFilter = async (event: any) => {
    setPage(1);
    setKey(listLowStock.page, 1);
    if (event) {
      await fetchLowStockList(1, pageLimit, event.value, date, searchTerm);
      setDays(event.value);
      setKey(listLowStock.stockRequireFilter, event.value);
    } else {
      await fetchLowStockList(1, pageLimit, undefined, date, searchTerm);
      setDays(0);
      removeKey(listLowStock.stockRequireFilter);
    }
  };
  const handleDateChange = async (event: any) => {
    setPage(1);
    setKey(listLowStock.page, 1);
    await fetchLowStockList(1, pageLimit, days, event, searchTerm);
    setDate(event);
    if (event) {
      setKey(listLowStock.dateFilter, event);
    } else {
      removeKey(listLowStock.dateFilter);
    }
  };
  const handleClose = async () => {
    setShowModal(false);
    await fetchLowStockList(page, pageLimit, days, date);
  };
  const handleDatePickerOpen = () => {
    const today = new Date();
    const firstVisibleDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastVisibleDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const firstDayOfWeek = firstVisibleDate.getDay();
    const lastDayOfWeek = lastVisibleDate.getDay();
    let firstDayToShow = new Date(firstVisibleDate);
    if (firstDayOfWeek !== 0) {
      firstDayToShow.setDate(firstVisibleDate.getDate() - firstDayOfWeek);
    }
    let lastDayToShow = new Date(lastVisibleDate);
    if (lastDayOfWeek !== 6) {
      lastDayToShow.setDate(lastVisibleDate.getDate() + (6 - lastDayOfWeek));
    }
    fetchLowStockReport(
      formatDate(firstDayToShow),
      formatDate(lastDayToShow),
      false
    );
  };
  const handleMonthChange = (date: Date) => {
    const firstVisibleDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastVisibleDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );
    const firstDayOfWeek = firstVisibleDate.getDay();
    const lastDayOfWeek = lastVisibleDate.getDay();
    let firstDayToShow = new Date(firstVisibleDate);
    if (firstDayOfWeek !== 0) {
      firstDayToShow.setDate(firstVisibleDate.getDate() - firstDayOfWeek);
    }
    let lastDayToShow = new Date(lastVisibleDate);
    if (lastDayOfWeek !== 6) {
      lastDayToShow.setDate(lastVisibleDate.getDate() + (6 - lastDayOfWeek));
    }
    fetchLowStockReport(
      formatDate(firstDayToShow),
      formatDate(lastDayToShow),
      false
    );
  };
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (lowStockReport) {
      const formattedDates = lowStockReport.map(
        (dateString: string) => new Date(dateString)
      );
      setHighlightedDates(formattedDates);
    }
  }, [lowStockReport]);
  return (
    <>
      {showModal && currentProduct ? (
        <LowStockModal
          show={showModal}
          onHide={handleModalClose}
          modalImage={Method.getProductMedia(currentProduct, false, true)}
          item={currentProduct}
          onClose={handleClose}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center mb-7">
        <Col sm>
          <h1 className="fs-22 fw-bolder mb-sm-0 mb-3">
            {LowStocksString.title}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card className="bg-light mb-7">
            <Card.Body className="px-7">
              <Row className="align-items-center">
                <Col
                  md={6}
                  sm={12}
                  className="mt-2"
                >
                  <Row className="d-flex align-items-center">
                    <Col md={4}>
                      {' '}
                      <FormLabel className="fs-16 fw-500 text-dark ">
                        {'Filter list by  dates'}
                      </FormLabel>{' '}
                    </Col>
                    <Col md={8}>
                      {' '}
                      <ReactDatePicker
                        className="form-control bg-white min-h-60px fs-15 fw-bold text-dark w-100 border-1 border-gray-300"
                        selected={date}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        showFullMonthYearPicker
                        placeholderText="Filter by dates"
                        isClearable={true}
                        showYearDropdown={true}
                        maxDate={new Date()}
                        scrollableYearDropdown={true}
                        dropdownMode="select"
                        onCalendarOpen={handleDatePickerOpen}
                        onMonthChange={handleMonthChange}
                        highlightDates={highlightedDates}
                        customInput={<CustomDateInput />}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  md={6}
                  sm={12}
                  className="mt-2"
                >
                  <Row className="d-flex align-items-center">
                    <Col
                      md={4}
                      className="text-md-center"
                    >
                      {' '}
                      <FormLabel className="fs-16 fw-500 text-dark">
                        {'Search products'}
                      </FormLabel>{' '}
                    </Col>
                    <Col md={8}>
                      {' '}
                      <div className="position-relative my-1">
                        <KTSVG
                          path="/media/icons/duotune/general/gen021.svg"
                          className="svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ps-13"
                        />
                        <input
                          type="text"
                          className="form-control form-control-white min-h-60px form-control-lg ps-10 w-100 "
                          name="Search Team"
                          placeholder={'Search by product name...'}
                          value={searchTerm}
                          onChange={(event: any) => {
                            handleSearch(event.target.value);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Row className="d-flex my-3 py-2 mb-4 justify-content-between align-items-center">
            <Col sm={6}>
              {!loading ? (
                <h2 className="fs-22 fw-700">{`${totalRecords} products available`}</h2>
              ) : (
                <></>
              )}
            </Col>
            <Col
              sm={6}
              className="d-flex justify-content-md-end mt-3 mt-md-0 "
            >
              <p className="fs-16 fw-500 me-4 my-auto">
                View stocks require for
              </p>
              <div>
                <CustomSelectTable2
                  className="w-150px"
                  placeholder={'Select days'}
                  onChange={(event: any) => {
                    handleStockRequireFilter(event);
                  }}
                  value={stockLastJSON.find((item) => item.value === days)}
                  isSearchable={false}
                  options={stockLastJSON}
                  isClearable={true}
                  isDisabled={loading}
                />
              </div>
            </Col>
          </Row>
          <Card className="border border-r10px">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-rounded table-row-bordered align-middle gs-7 gy-4 mb-0">
                  <thead>
                    <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                      <th className="min-w-300px">
                        {InventoryString.tableHeadingProduct}
                      </th>
                      <th className="min-w-200px">{'Available stock'}</th>
                      {days > 0 ? (
                        <th className="min-w-200px">
                          {`Stock required for ${days} days`}
                        </th>
                      ) : (
                        <></>
                      )}
                      <th className="min-w-200px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      <>
                        {stocksList && stocksList.length ? (
                          stocksList.map((item: any, index: number) => {
                            return (
                              <tr key={item._id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="symbol symbol-50px border me-5">
                                      <img
                                        src={Method.getProductMedia(
                                          item,
                                          false,
                                          true
                                        )}
                                        className="object-fit-contain"
                                        alt="Image"
                                      />
                                    </div>
                                    <div className="d-flex flex-column">
                                      <span className="fs-15 fw-600">
                                        {item?.variant?.title || ''}
                                      </span>
                                      <span className="fs-14 fw-500">
                                        {item?.variant?.skuNumber || ''}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <p className="fs-16 fw-600 mb-0">
                                    {item?.quantityTypes[0]?.stockCount || 0}{' '}
                                    Units
                                  </p>
                                  {item?.quantityTypes[0]?.forecastedDays ? (
                                    <em className="fs-15 fw-500">
                                      Stock left for
                                      <span className="text-danger">
                                        {` ${
                                          item?.quantityTypes[0]
                                            ?.forecastedDays || 0
                                        } ${
                                          item?.quantityTypes[0]?.forecastedDays
                                            ? item.quantityTypes[0]
                                                .forecastedDays > 1
                                              ? ' days'
                                              : ' day'
                                            : ' day'
                                        }`}
                                      </span>
                                    </em>
                                  ) : (
                                    <></>
                                  )}
                                </td>
                                {days > 0 ? (
                                  <td className="fs-16 fw-600">
                                    {item?.quantityTypes[0]?.requiredStock || 0}
                                    {item?.quantityTypes[0]?.requiredStock > 1
                                      ? ' Units'
                                      : ' Unit'}
                                  </td>
                                ) : (
                                  <></>
                                )}
                                {!item?.ordered ? (
                                  <td>
                                    {' '}
                                    {Method.hasPermission(
                                      LowStockConst,
                                      Edit,
                                      currentUser
                                    ) ? (
                                      <Button
                                        variant="primary"
                                        className="me-3  fs-16 fw-600"
                                        style={{
                                          whiteSpace: 'nowrap',
                                        }}
                                        onClick={() => {
                                          setCurrentProduct(item);
                                          setShowModal(true);
                                        }}
                                      >
                                        {LowStocksString.orderedThisProduct}
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                ) : (
                                  <></>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4}>
                              <div className="w-100 d-flex justify-content-center fs-16 fw-500">
                                No Data Found
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={days > 0 ? 4 : 3}>
                          <div className="w-100 d-flex justify-content-center">
                            <Loader loading={loading} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
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
        </Col>
      </Row>
    </>
  );
};
export default AllLowStocks;
