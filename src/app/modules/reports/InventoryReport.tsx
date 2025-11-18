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
const InventoryReport = () => {
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
      reports.inventoryReportV2,
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
      reports.inventoryReportV2,
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
      link.download = 'inventory-report' + '.xlsx';
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
        <h1>Inventory report</h1>
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
                    <th className="min-w-200px"> Product name </th>
                    <th>Zones/Bins</th>
                    <th className="min-w-100px"> SKU </th>
                    <th className="min-w-150px"> Category </th>
                    <th className="min-w-150px"> Sub category</th>
                    <th className="min-w-250px">
                      {' '}
                      Total inventory (saleable + unsaleable)
                    </th>
                    <th className="min-w-150px"> Saleable Qty</th>
                    <th className="min-w-150px"> Unsalable Qty</th>
                    <th className="min-w-100px"> Reserved Qty</th>
                    {/* <th className="min-w-200px">Expiry date</th> */}
                    <th className="min-w-150px">MRP (TSh)</th>
                    <th className="min-w-150px"> Total Sales (TSh)</th>
                    <th className="min-w-150px"> Batch Creation date</th>
                    <th className="min-w-150px"> Batch Expirty date</th>
                    {/* <th className="min-w-350px"> Zones / Bins</th> */}
                  </tr>
                </thead>
                <tbody className="fs-15 fw-500">
                  {loading ? (
                    <td
                      colSpan={12}
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
                                <span className="">{item?.title || '-'}</span>
                              </td>
                              <td>-</td>

                              <td>
                                <span className="">
                                  {item?.skuNumber || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="">
                                  {item?.product?.category?.title || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="">
                                  {item?.product?.subCategory?.title || '-'}
                                </span>
                              </td>
                              <td>
                                <span className="">
                                  {Method.formatCurrency(
                                    item?.totalSaleableAndUnsaleableQuantity ||
                                      0
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {Method.formatCurrency(
                                    item?.saleableQuantity || 0
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {Method.formatCurrency(
                                    item?.unsaleableQuantity || 0
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="">
                                  {Method.formatCurrency(
                                    item?.reservedQuantity || 0
                                  )}
                                </span>
                              </td>
                              {/* <td>
                              <span className="">
                                {Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                  item?.statusUpdatedAt,
                                  '-'
                                )}
                              </span>
                            </td> */}
                              <td>
                                <span className="ms-3">
                                  {Method.formatCurrency(item?.amount || 0)}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {Method.formatCurrency(item?.totalValue || 0)}
                                </span>
                              </td>
                              <td>
                                <span className="">-</span>
                              </td>
                              <td className="">
                                <div className="d-flex justify-content-between">
                                  <span className="">-</span>
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
                                </div>
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
                              item?.inventoryBatches &&
                              item?.inventoryBatches.map(
                                (valItem: any, valIndex: number) => {
                                  return (
                                    <tr
                                      key={valItem?._id}
                                      className="bg-light"
                                    >
                                      <td>
                                        <span className="">
                                          {`Batch : ${valItem?.batch || ''}`}
                                        </span>
                                      </td>
                                      <td>
                                        {valItem?.goodsLoadingArea &&
                                        valItem?.goodsLoadingArea?.length
                                          ? valItem?.goodsLoadingArea?.map(
                                              (goodItem: any) => {
                                                return (
                                                  <div className="mt-2">
                                                    <span
                                                      key={goodItem?.reference}
                                                      className="badge badge-warning text-dark fs-16 fw-600 px-4 min-h-36px min-w-52px me-1 mb-2"
                                                    >
                                                      <span>
                                                        {' '}
                                                        {`${goodItem?.name} - Sq: ${goodItem?.sequence}`}
                                                      </span>
                                                      <span className="d-flex text-nowrap">
                                                        {goodItem?.bins &&
                                                        goodItem?.bins
                                                          ?.length ? (
                                                          goodItem?.bins?.map(
                                                            (
                                                              binItem: any,
                                                              binIndex: number
                                                            ) => {
                                                              return (
                                                                <span className="ms-2 fs-16">
                                                                  {`| ${binItem?.name} - Sq: ${binItem?.sequence}`}
                                                                </span>
                                                              );
                                                            }
                                                          )
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </span>
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          : '-'}
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
                                        <span className="">
                                          {valItem?.quantityTypes &&
                                          valItem?.quantityTypes?.length
                                            ? Method.formatCurrency(
                                                valItem?.quantityTypes[0]
                                                  ?.stockCount || 0
                                              )
                                            : 0}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="ps-2">
                                          {valItem?.quantityTypes &&
                                          valItem?.quantityTypes?.length
                                            ? getSalebleQuantity(valItem)
                                            : 0}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="ps-2">
                                          {valItem?.quantityTypes &&
                                          valItem?.quantityTypes?.length
                                            ? getUnSalebleQuantity(valItem)
                                            : 0}
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
                                        <span className="">
                                          {valItem?._createdAt
                                            ? Method.convertDateToDDMMYYYY(
                                                valItem?._createdAt
                                              )
                                            : '-'}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="">
                                          {valItem?.expiry
                                            ? Method.convertDateToDDMMYYYY(
                                                valItem?.expiry
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
export default InventoryReport;
