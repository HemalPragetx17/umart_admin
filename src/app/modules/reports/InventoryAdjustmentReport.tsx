import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { reports } from '../../../api/apiEndPoints';
import { PAGE_LIMIT, Reports } from '../../../utils/constants';
import Pagination from '../../../Global/pagination';
import { error } from '../../../Global/toast';
import Method from '../../../utils/methods';
import ArrowDown from '../../../umart_admin/assets/media/svg_uMart/down-arrow.svg';
const InventoryAdjustmentReport = () => {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [search, setSearch] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState('');
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
    // if (fromDate && toDate) {
    //   data.fromDate = Method.convertDateToFormat(fromDate, 'YYYY-MM-DD');
    //   data.toDate = Method.convertDateToFormat(toDate, 'YYYY-MM-DD');
    // }
    let apiService = new APICallService(
      reports.inventoryAdjustmentReport,
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
    // if (startDate && endDate) {
    //   params.fromDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
    //   params.toDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    // }
    let apiService = new APICallService(
      reports.inventoryAdjustmentReport,
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
      link.download = 'inventory-adjustment-report' + '.xlsx';
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
    await fetchProducts(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchProducts(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchProducts(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchProducts(1, event.target.value);
  };
  const getSalebleQuantity = (item: any) => {
    const isValidBatch = Method.checkIsValidBatch(item?.expiry, 7);
    return isValidBatch
      ? Method.formatCurrency(item?.quantityTypes[0]?.stockCount)
      : 0;
  };
  const getUnSalebleQuantity = (item: any) => {
    const isValidBatch = Method.checkIsValidBatch(item?.expiry, 7);
    return !isValidBatch
      ? Method.formatCurrency(item?.quantityTypes[0]?.stockCount)
      : 0;
  };
  return (
    <Row>
      <Col>
        <h1>Inventory adjustment report</h1>
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
      <Col xs={12}>
        {' '}
        <Card className="border border-r10px mt-3">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-row-bordered datatable  gs-7 gy-4 my-0">
                <thead>
                  <tr className="fs-16 fw-600 h-65px align-middle">
                    <th className="min-w-250px"> Product name </th>
                    <th className="min-w-100px"> SKU </th>
                    <th className="min-w-150px"> Lost Inventory </th>
                    <th className="min-w-150px"> Total Available Inventory</th>
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
                        productList.map((item: any, index: number) => (
                          <>
                            <tr
                              key={item._id}
                              className="cursor-pointer"
                              onClick={() => {
                                if (selectedItem === item._id) {
                                  setSelectedItem('');
                                } else {
                                  setSelectedItem(item?._id);
                                }
                              }}
                            >
                              <td>
                                <div className="d-flex">
                                  <span>
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
                                  <span className="ms-6">
                                    {item?.title || '-'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="">
                                  {item?.skuNumber || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {Method.formatCurrency(
                                    item?.totalMissing || 0
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="">
                                  {Method.formatCurrency(
                                    item?.availableStock || 0
                                  )}
                                </span>
                              </td>
                              {/* <td>
                              {item?.inventoryBatches &&
                              item?.inventoryBatches?.length ? (
                                <span className="">
                                  {item?.inventoryBatches.map((val: any) => {
                                    return (
                                      <div className="mt-2">{`Batch : ${
                                        val?.batch
                                      }, Batch creation date : ${Method.convertDateToDDMMYYYY(
                                        val?._createdAt
                                      )}, Batch Inventory Stock Count : ${
                                        val?.quantityTypes &&
                                        val?.quantityTypes?.length
                                          ? val?.quantityTypes[0]?.stockCount
                                          : ''
                                      } Batch expiry : ${
                                        val?.expiry
                                          ? Method.convertDateToDDMMYYYY(
                                              val?.expiry
                                            )
                                          : 'No expiry'
                                      }`}</div>
                                    );
                                  })}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td> */}
                            </tr>
                            {selectedItem === item._id ? (
                              <>
                                {(item?.inwardData &&
                                  item?.inwardData?.length) ||
                                (item?.outwardData &&
                                  item?.outwardData?.length) ? (
                                  <tr className="bg-light">
                                    <td>
                                      <span className="ps-6">
                                        {'Inventory Adjustment'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="">{'Inward Date'}</span>
                                    </td>
                                    <td>
                                      <span className="">
                                        {'Inward Batch Number'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="">
                                        {'Inward Batch Expiry Date'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="">{'Stock'}</span>
                                    </td>
                                    <td>
                                      <span className="">
                                        {'Outward Order Number'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="">
                                        {'Customer Name'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="">
                                        {'Outward Order Batch Number'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="">
                                        {'Outward Order Batch Expiry'}
                                      </span>
                                    </td>
                                  </tr>
                                ) : (
                                  <></>
                                )}
                                {item?.inwardData ? (
                                  item?.inwardData.map(
                                    (valItem: any, valIndex: number) => {
                                      return valItem && valItem?.batches
                                        ? valItem?.batches.map(
                                            (batchItem: any) => {
                                              return (
                                                <tr
                                                  key={valItem?._id}
                                                  className="bg-light"
                                                >
                                                  <td>
                                                    <span className="ps-6">
                                                      Inward
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span className="">
                                                      {valItem?._createdAt
                                                        ? Method.convertDateToDDMMYYYY(
                                                            valItem?._createdAt
                                                          )
                                                        : '-'}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span className="ps-3">
                                                      <span>
                                                        {batchItem?.batch
                                                          ? `Batch : ${batchItem?.batch}`
                                                          : '-'}
                                                      </span>
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span className="">
                                                      {batchItem?.expiry
                                                        ? Method.convertDateToDDMMYYYY(
                                                            batchItem?.expiry
                                                          )
                                                        : '-'}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span className="">
                                                      {valItem?.quantityTypes
                                                        ? Method.formatCurrency(
                                                            valItem
                                                              ?.quantityTypes
                                                              ?.stockCount || 0
                                                          )
                                                        : '-'}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span className="">-</span>
                                                  </td>
                                                  <td>
                                                    <span className="">-</span>
                                                  </td>
                                                  <td>
                                                    <span className="">-</span>
                                                  </td>
                                                  <td>
                                                    <span className="">-</span>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )
                                        : [];
                                    }
                                  )
                                ) : (
                                  <></>
                                )}
                                {item?.outwardData ? (
                                  item?.outwardData.map(
                                    (valItem: any, valIndex: number) => {
                                      return valItem?.batches ? (
                                        valItem?.batches?.map(
                                          (batchItem: any) => {
                                            return (
                                              <tr
                                                key={valItem?._id}
                                                className="bg-light"
                                              >
                                                <td>
                                                  <span className="ps-6">
                                                    Outward
                                                  </span>
                                                </td>
                                                <td>
                                                  <span className="">-</span>
                                                </td>
                                                <td>
                                                  <span className="">-</span>
                                                </td>
                                                <td>
                                                  <span className="">
                                                    {/* {valItem?.quantityTypes
                                                  ? Method.formatCurrency(
                                                      valItem?.quantityTypes
                                                        ?.stockCount || 0
                                                    )
                                                  : '-'} */}
                                                    -
                                                  </span>
                                                </td>
                                                <td>
                                                  <span className="">
                                                    {batchItem?.stockCount
                                                      ? Method.formatCurrency(
                                                          batchItem?.stockCount ||
                                                            0
                                                        )
                                                      : '-'}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span className="">
                                                    {valItem?.source?.refKey ||
                                                      '-'}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span
                                                    className=""
                                                    style={{
                                                      whiteSpace: 'nowrap',
                                                    }}
                                                  >
                                                    {valItem?.customerName ||
                                                      '-'}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span
                                                    className=""
                                                    style={{
                                                      whiteSpace: 'nowrap',
                                                    }}
                                                  >
                                                    {batchItem?.batch
                                                      ? `Batch : ${batchItem?.batch}`
                                                      : '-'}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span
                                                    className=""
                                                    style={{
                                                      whiteSpace: 'nowrap',
                                                    }}
                                                  >
                                                    {batchItem?.expiry
                                                      ? Method.convertDateToDDMMYYYY(
                                                          batchItem?.expiry
                                                        )
                                                      : '-'}
                                                  </span>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )
                                      ) : (
                                        <></>
                                      );
                                    }
                                  )
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
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
export default InventoryAdjustmentReport;
