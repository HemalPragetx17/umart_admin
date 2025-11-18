import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { reports } from '../../../api/apiEndPoints';
import { Inventory, PAGE_LIMIT, Reports } from '../../../utils/constants';
import Pagination from '../../../Global/pagination';
import { KTSVG } from '../../../umart_admin/helpers';
import { useDebounce } from '../../../utils/useDebounce';
import { error } from '../../../Global/toast';
import Method from '../../../utils/methods';
const NoOrder15DayReport = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<
    {
      name: string;
      email: string;
      phone: string;
      phoneCountry: string;
      _id: string;
      lastOrderAt: any;
    }[]
  >([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  useEffect(() => {
    (async () => {
      await fetchProducts(1, pageLimit, '');
    })();
  }, []);
  const fetchProducts = async (
    pageNo: number,
    limit: number,
    search: string = ''
  ) => {
    setLoading(true);
    let data: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      searchTerm: search ? search.trim() : '',
      needCount: true,
    };
    let apiService = new APICallService(
      reports.noOrderLast15DaysReport,
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
      setReportData(response.records);
    } else {
      setReportData([]);
    }
    setLoading(false);
  };
  const debounce = useDebounce(fetchProducts, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    // const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearch(input);
    setPage(1);
    if (input.trim().length > 2 && search !== input) {
      await debounce(1, pageLimit, input);
    } else if (input.trim().length <= 2 && input.length < search.length) {
      await debounce(1, pageLimit, input);
    }
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    let params: any = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
      searchTerm: search ? search.trim() : '',
    };
    let apiService = new APICallService(
      reports.noOrderLast15DaysReport,
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
      link.download = 'no-order-last-15days-report' + '.xlsx';
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
    await fetchProducts(val, pageLimit, search);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchProducts(val + 1, pageLimit, search);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchProducts(val - 1, pageLimit, search);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchProducts(1, event.target.value, search);
  };
  return (
    <Row>
      <Col>
        <h1>No orders from last 15 days report</h1>
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
                {/* <FormLabel className="fs-16 fw-500 text-dark min-h-md-25px">
                  {''}
                </FormLabel>{' '} */}
                <div className="position-relative  mt-1">
                  <KTSVG
                    path="/media/icons/duotune/general/gen021.svg"
                    className="svg-icon-3 position-absolute ps-13 top-50 translate-middle"
                  />
                  <input
                    type="text"
                    // disabled={initLoader}
                    id="kt_filter_search"
                    className="form-control form-control-white form-control-lg min-h-60px ps-10"
                    placeholder="Search by name"
                    onChange={(event: any) => {
                      handleSearch(event.target.value);
                    }}
                    // onKeyUp={handleOnKeyUp}
                    value={search}
                  />
                </div>
              </Col>
              <Col
                lg={3}
                md={3}
                sm={12}
              ></Col>
              <Col
                // lg={4}
                md={5}
                sm={12}
                className="pt-2"
              ></Col>
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
                    <th className="min-w-200px"> Customer Name </th>
                    <th className="min-w-160px"> Phone </th>
                    <th className="min-w-160px"> Last Ordered Date </th>
                  </tr>
                </thead>
                <tbody className="fs-15 fw-500">
                  {loading ? (
                    <td
                      colSpan={3}
                      className="text-center"
                    >
                      <div className="w-100 d-flex justify-content-center">
                        <Loader loading={loading} />
                      </div>
                    </td>
                  ) : (
                    <>
                      {reportData.length ? (
                        reportData.map((item, index: number) => (
                          <tr key={item._id}>
                            <td>
                              <div className="d-flex">
                                <div>{item?.name || '-'}</div>
                              </div>
                            </td>
                            <td>
                              <span className="">
                                {item?.phone
                                  ? item?.phoneCountry + ' ' + item?.phone
                                  : '-'}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.lastOrderAt
                                  ? Method.convertDateToDDMMYYYY(
                                      item?.lastOrderAt
                                    )
                                  : '-'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2}>
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
        {!loading && reportData.length > 0 ? (
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
export default NoOrder15DayReport;
