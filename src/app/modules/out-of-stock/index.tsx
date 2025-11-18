import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { inventory, master } from '../../../api/apiEndPoints';
import { Inventory, PAGE_LIMIT, Product } from '../../../utils/constants';
import Pagination from '../../../Global/pagination';
import { KTSVG } from '../../../umart_admin/helpers';
import { CustomComponentSelect } from '../../custom/Select/CustomComponentSelect';
import { useDebounce } from '../../../utils/useDebounce';
import { error } from '../../../Global/toast';
import Method from '../../../utils/methods';
import { CustomReportSelect } from '../../custom/Select/CustomReportSelect';
const OutOfStock = () => {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<
    {
      media: any[];
      skuNumber: string;
      title: string;
      _id: string;
      totalSoldUnits: number;
      totalSoldUnitsLast7Days: number;
      totalSoldUnitsLast15Days: number;
      totalValue: number;
      totalValueLast7Days: number;
      totalValueLast15Days: number;
      lastDebitedAt: string | null;
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
      setLoading(true);
      await Promise.all([fetchProducts(1, pageLimit, '', ''), fetchCategory()]);
      setLoading(false);
    })();
  }, []);
  const fetchProducts = async (
    pageNo: number,
    limit: number,
    categories: any,
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
    let tempCategory = categories ? JSON.parse(JSON.stringify(categories))  : [];
    if (tempCategory?.length > 0 && tempCategory[0].value === 0) {
      tempCategory.shift();
    }
    if (tempCategory.length > 0) {
      tempCategory.map((val: any, index: number) => {
        data = { ...data, ['category[' + index + ']']: val.id };
      });
      data.categoryDepth = 1;
    }
    let apiService = new APICallService(
      inventory.outOfStockProducts,
      data,
      '',
      '',
      false,
      '',
      Inventory
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
  const fetchCategory = async () => {
    let apiService = new APICallService(
      master.categoryList,
      {
        categoriesDepth: 1,
      },
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      let temp: any = [];
      response.records.map((val: any) => {
        temp.push({
          value: val.title,
          name: val.title,
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
                {val.title}
              </label>
            </>
          ),
          title: val.title,
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
        name : 'All',
        img : ''
      });
      setCategoryList(temp);
    }
  };
  const handleCategoryFilter = async (event: any) => {
    let tempCategories = [...selectedCategories];
    if (Array.isArray(event)) {
      if (event.length > tempCategories.length) {
        if (
          event.some((item) => item.value === 0) ||
          event.length == categoryList.length - 1
        ) {
          tempCategories = categoryList;
        } else {
          tempCategories = event;
        }
      } else {
        if (event.some((val: any) => val.value === 0)) {
          let temp = event.filter((val: any) => val.value !== 0);
          tempCategories = temp;
        } else if (
          !event.some((val: any) => val.value === 0) &&
          event.length == categoryList.length - 1
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
    setSelectedCategories(tempCategories);
    await fetchProducts(1, pageLimit, tempCategories, search);
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
      await debounce(1, pageLimit, selectedCategories, input);
    } else if (input.trim().length <= 2 && input.length < search.length) {
      await debounce(1, pageLimit, selectedCategories, input);
    }
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    let params: any = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
      searchTerm: search ? search.trim() : '',
    };
    let tempCategory = selectedCategories
      ? JSON.parse(JSON.stringify(selectedCategories))
      : [];
      
    if (tempCategory?.length > 0 && tempCategory[0].value === 0) {
      tempCategory.shift();
    }
    if (tempCategory.length > 0) {
      tempCategory.map((val: any, index: number) => {
        params = { ...params, ['category[' + index + ']']: val.id };
      });
      params.categoryDepth = 1;
    }
    let apiService = new APICallService(
      inventory.outOfStockProducts,
      params,
      undefined,
      'arraybuffer',
      '',
      '',
      Inventory
    );
    let response = await apiService.callAPI();
    if (response) {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Out-of-stock' + '.xlsx';
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
    await fetchProducts(val, pageLimit, selectedCategories, search);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchProducts(val + 1, pageLimit, selectedCategories, search);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchProducts(val - 1, pageLimit, selectedCategories, search);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchProducts(1, event.target.value, selectedCategories, search);
  };
  return (
    <Row>
      <Col>
        <h1>Out of stock products</h1>
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
                    placeholder="Search by product name…"
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
                      options={categoryList}
                        text={'categories selected'}
                      placeholder="Select category name"
                      hideSelectedOptions={false}
                      value={selectedCategories}
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
                    <th className="min-w-300px"> Product Name </th>
                    <th className="min-w-160px"> Out of Stock Since </th>
                    <th className="min-w-150px"> Total Sales (Qty) </th>
                    <th className="min-w-150px"> Total Sales (TSh) </th>
                    <th className="min-w-200px"> Sales Last 7 Days (Qty)</th>
                    <th className="min-w-200px">Sales Last 7 Days (TSh)</th>
                    <th className="min-w-200px">Sales Last 15 Days (Qty)</th>
                    <th className="min-w-200px">Sales Last 15 Days (TSh)</th>
                  </tr>
                </thead>
                <tbody className="fs-15 fw-500">
                  {loading ? (
                    <td
                      colSpan={8}
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
                              <div className="d-flex">
                                <div className="symbol symbol-50px border border-r10px me-4">
                                  <img
                                    className="img-fluid border-r8px object-fit-contain"
                                    src={item?.media[0]?.url || ''}
                                  />
                                </div>
                                <div>
                                  <div>{item?.title || ''}</div>
                                  <div className="fs-14 text-gray">
                                    {item?.skuNumber || ''}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="ms-3">
                                {item?.lastDebitedAt
                                  ? Method.convertDateToDDMMYYYY(
                                      item.lastDebitedAt
                                    )
                                  : '-'}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(item?.totalSoldUnits)}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(item?.totalValue)}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(
                                  item?.totalSoldUnitsLast7Days
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(
                                  item?.totalValueLast7Days
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(
                                  item?.totalSoldUnitsLast15Days
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="ms-3">
                                {Method.formatCurrency(
                                  item?.totalValueLast15Days
                                )}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8}>
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
export default OutOfStock;
