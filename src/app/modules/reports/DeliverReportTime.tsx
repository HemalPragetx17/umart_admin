import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import APICallService from '../../../api/apiCallService';
import { reports } from '../../../api/apiEndPoints';
import { PAGE_LIMIT, Reports } from '../../../utils/constants';
import Pagination from '../../../Global/pagination';
import { error } from '../../../Global/toast';
import Method from '../../../utils/methods';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { deliveryTimeStaticJson } from '../../../utils/staticJSON';
import { IOption } from '../../../types/responseIndex';
import OrderTimeModal from '../../modals/order-time-modal';
const modeOfPayments = ['Cash', 'Online', 'Coin'];
const DeliveryReportTime = () => {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>(
    deliveryTimeStaticJson[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [districtData, setDistrictData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProducts(1, pageLimit, '')]);
      setLoading(false);
    })();
  }, []);
  const fetchProducts = async (pageNo: number, limit: number, time: any) => {
    setLoading(true);
    let data: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      type: time?.value || 1,
    };
    let apiService = new APICallService(
      reports.deliveryTimeReport,
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
    setDistrictData(response?.counter || []);
    setLoading(false);
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    let params: any = {
      download: true,
      utcOffset: new Date().getTimezoneOffset(),
      type: selectedTime?.value || 1,
    };
    let apiService = new APICallService(
      reports.deliveryTimeReport,
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
      link.download = 'delivery-time-report' + '.xlsx';
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
    await fetchProducts(val, pageLimit, selectedTime);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchProducts(val + 1, pageLimit, selectedTime);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchProducts(val - 1, pageLimit, selectedTime);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    await fetchProducts(1, event.target.value, selectedTime);
  };
  const handleTimeChange = async (event: IOption) => {
    setPage(1);
    setSelectedTime(event);
    if (event) {
      await fetchProducts(1, pageLimit, event);
    } else {
    }
  };
  return (
    <>
      {showModal ? (
        <OrderTimeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          data={districtData}
        />
      ) : (
        <></>
      )}
      <Row>
        <Col>
          <h1>Delivery report by time</h1>
        </Col>
        <Col md="auto">
          <Button
            className="fs-15 fw-600 min-h-50px me-3"
            onClick={() => {
              setShowModal(true);
            }}
            disabled={loading}
          >
            View District Wise{' '}
          </Button>
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
                  md={4}
                  sm={12}
                >
                  <label className="fs-16 fw-500 text-black mb-2">
                    Filter by delivery time
                  </label>
                  <CustomSelectWhite
                    placeholder={'Select time'}
                    options={deliveryTimeStaticJson}
                    // defaultValue={statusOptions[0]}
                    onChange={(event: IOption) => {
                      handleTimeChange(event);
                    }}
                    isSearchable={false}
                    value={selectedTime}
                    // isClearable={Object.keys(productState).length}
                  />
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
                      <th className="min-w-150px"> Driver name </th>
                      <th className="min-w-190px">Mode of payment</th>
                      <th className="min-w-150px">Amount (TSh)</th>
                      <th className="min-w-175px">Out for deliver at</th>
                      <th className="min-w-200px"> Delivery date & time</th>
                      <th className="min-w-150px">Duration (min)</th>
                    </tr>
                  </thead>
                  <tbody className="fs-15 fw-500">
                    {loading ? (
                      <td
                        colSpan={10}
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
                                  {item?.routesUsers?.length
                                    ? item?.routesUsers[0]?.deliveryUser
                                        ?.name || '-'
                                    : '-'}
                                </span>
                              </td>
                              <td>
                                <span className="ms-3">
                                  {item?.payment?.paymentMode
                                    ? modeOfPayments[
                                        item?.payment?.paymentMode - 1
                                      ]
                                    : ''}
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
                                <span>
                                  {Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                    item?.outForDeliveryAt,
                                    '-'
                                  )}
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
                                  {(item?.durationMinutes || 0).toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={10}>
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
    </>
  );
};
export default DeliveryReportTime;
