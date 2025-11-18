import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import clsx from 'clsx';
import { AllProduct, PAGE_LIMIT } from '../../../utils/constants';
import { searchTermsTypesOptions } from '../../../utils/staticJSON';
import APICallService from '../../../api/apiCallService';
import { master } from '../../../api/apiEndPoints';
import { error } from '../../../Global/toast';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import Loader from '../../../Global/loader';
import Method from '../../../utils/methods';
import Pagination from '../../../Global/pagination';
const SearchTagList = () => {
  const [loading, setLoading] = useState(true);
  const [searchTagsList, setSearchTagsList] = useState<
    {
      _id: string;
      term: string;
      emptySearch: boolean;
      searchCount: number;
    }[]
  >([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [isDownloading, setIsDownloading] = useState(false);
  const [status, setStatus] = useState<any>(searchTermsTypesOptions[0]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchSearchTags(page, pageLimit, 0);
      setLoading(false);
    })();
  }, []);
  const fetchSearchTags = async (
    pageNo: number,
    limit: number,
    status: number = 0
  ) => {
    setLoading(true);
    let data: any = {
      pageNo: pageNo,
      limit: limit,
      needCount: true,
      status: status || 0,
    };
    let apiService = new APICallService(
      master.listSearchTags,
      data,
      '',
      '',
      false,
      '',
      AllProduct
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(response.total);
      }
      setSearchTagsList(response.records);
    } else {
      setSearchTagsList([]);
    }
    setLoading(false);
  };
  const handleSearchTermChange = async (event: any) => {
    setStatus(event);
    setPage(1);
    await fetchSearchTags(1, pageLimit, event?.value);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    await fetchSearchTags(val, pageLimit, status?.value);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchSearchTags(val + 1, pageLimit, status?.value);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchSearchTags(val - 1, pageLimit, status?.value);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchSearchTags(1, event.target.value, status?.value);
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    let params = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
      status: status?.value || 0,
    };
    let apiService = new APICallService(
      master.listSearchTags,
      params,
      undefined,
      'arraybuffer',
      '',
      '',
      AllProduct
    );
    let response = await apiService.callAPI();
    if (response) {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SearchTags' + '.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      error('Data Not Found');
    }
    setIsDownloading(false);
  };
  return (
    <Row>
      <Col>
        <h1>Search Tags</h1>
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
                // lg={4}
                md={4}
                sm={12}
                className="pt-2"
              >
                {/* <FormLabel className="fs-16 fw-500 text-dark  min-h-25px">
                  {''}
                </FormLabel>{' '} */}
                <div className="d-flex justify-content-center align-items-center ">
                  <div className="w-100">
                    <CustomSelectWhite
                      backgroundColor="#ffff"
                      // isLoading={loading}
                      closeMenuOnSelect={true}
                      //   isSearchable={true}
                      options={searchTermsTypesOptions}
                      //   text={'sellers selected'}
                      placeholder="Select type"
                      hideSelectedOptions={false}
                      value={status}
                      onChange={(event: any) => {
                        handleSearchTermChange(event);
                      }}
                      isMulti={false}
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
                    <th className="min-w-300px"> Search Terms </th>
                    <th className="min-w-160px"> Search Count </th>
                    <th className="min-w-160px"> Empty Search </th>
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
                      {searchTagsList.length ? (
                        searchTagsList.map((item, index: number) => (
                          <tr key={item._id}>
                            <td>
                              <div>{item?.term || ''}</div>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(item?.searchCount || 0)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={clsx(
                                  'badge  border-r4px p-3 fs-14 fw-600 text-dark ms-3 px-7',
                                  item?.emptySearch
                                    ? 'badge-light-success'
                                    : 'badge-light'
                                )}
                              >
                                {item?.emptySearch ? 'Yes' : 'No'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3}>
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
        {!loading && searchTagsList.length > 0 ? (
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
export default SearchTagList;
