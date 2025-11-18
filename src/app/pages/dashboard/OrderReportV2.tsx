import { useEffect, useState } from 'react';
import { getCSSVariableValue } from '../../../umart_admin/assets/ts/_utils';
import Method from '../../../utils/methods';
import DatePicker from 'react-datepicker';
import { Card, Col, FormLabel, Row } from 'react-bootstrap';
import { Customers, DashboardString } from '../../../utils/string';
import APICallService from '../../../api/apiCallService';
import { dashBoardEndPoints } from '../../../api/apiEndPoints';
import DeliveryImg from '../../../umart_admin/assets/media/fast-delivery.png';
import Loader from '../../../Global/loader';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { error } from '../../../Global/toast';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { dashboardStore } from '../../../utils/storeString';
import { Product, View, Customer } from '../../../utils/constants';
import { useAuth } from '../../modules/auth';
import PermissionModal from '../../modals/permission-moda';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { orderTypeStaticJson } from '../../../utils/staticJSON';
const OrderReportV2 = (props: any) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<any>(
    getKey(dashboardStore.ordersReportFilter)?.startDate
      ? new Date(getKey(dashboardStore.ordersReportFilter)?.startDate)
      : Method.getCurrentMonthStartDate()
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(dashboardStore.ordersReportFilter)?.endDate
      ? new Date(getKey(dashboardStore.ordersReportFilter)?.endDate)
      : Method.getCurrentMonthEndDate()
  );
  const [loading, setLoading] = useState(true);
  const [ordersReport, setOrderReport] = useState<any>({ data: [] });
  const baseColor = getCSSVariableValue('--bs-primary');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedOrdertype, setSelectedOrderType] = useState<any>(
    orderTypeStaticJson[0]
  );
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchOrderReport(startDate, endDate, 4);
      setLoading(false);
    })();
  }, []);
  const fetchOrderReport = async (
    startDate: any,
    endDate: any,
    status: any
  ) => {
    setLoading(true);
    const params: any = {
      status: status || 4,
      utcOffset: new Date().getTimezoneOffset(),
    };
    if (startDate) {
      params.startDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
    }
    if (endDate) {
      params.endDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    }
    const apiService = new APICallService(
      dashBoardEndPoints.orderReportV2,
      params
    );
    const response = await apiService.callAPI();
    if (response) {
      response.data = response.data.map((item: any) => {
        return {
          ...item,
          date: item.date.split('T')[0],
        };
      });
      setOrderReport(response);
    }
    setLoading(false);
  };
  const handleChange = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      if (Method.dayDifference(event[0], event[1]) >= 6) {
        await fetchOrderReport(
          startDateFormatted,
          endDateFormatted,
          selectedOrdertype?.value
        );
        setKey(dashboardStore.ordersReportFilter, {
          startDate: event[0],
          endDate: event[1],
        });
      } else {
        error('Please select a date range with a minimum one-week difference');
      }
    } else if (event[0] === null && event[1] === null) {
      setStartDate(Method.getCurrentMonthStartDate());
      setEndDate(Method.getCurrentMonthEndDate());
      await fetchOrderReport(
        Method.getCurrentMonthStartDate(),
        Method.getCurrentMonthEndDate(),
        selectedOrdertype?.value
      );
      removeKey(dashboardStore.ordersReportFilter);
    }
  };
  const handleOrderTypeChange = async (event: any) => {
    setSelectedOrderType(event);
    await fetchOrderReport(startDate, endDate, event?.value);
  };
  return (
    <>
      {/* {showPermissionModal ? (
        <PermissionModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          moduleName="Customers"
        />
      ) : (
        <></>
      )} */}
      <Card className="mb-7 bg-f9f9f9">
        <Card.Header className="pt-4 border-bottom-0">
          <div className="w-100">
            <div className="card-title d-flex justify-content-between w-100">
              <h2 className="fs-22 fw-bolder">
                {'Deliver/Cancelled order report'}
              </h2>
              <div className="d-flex">
                <div className="d-flex align-items-center me-3">
                  <FormLabel className="fs-16 fw-500 text-dark  me-3">
                    {'Select order type'}
                  </FormLabel>{' '}
                  <div className="d-flex justify-content-center align-items-center ">
                    <div className="">
                      <CustomSelectWhite
                        defaultValue={orderTypeStaticJson[0]}
                        value={selectedOrdertype}
                        isDisabled={loading}
                        options={orderTypeStaticJson}
                        onChange={(event: any) => {
                          handleOrderTypeChange(event);
                        }}
                        isSearchable={false}
                        isMulti={false}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <DatePicker
                    className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-md-288px min-w-225px"
                    selected={startDate}
                    onChange={handleChange}
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    showFullMonthYearPicker
                    isClearable={true}
                    showYearDropdown={true}
                    scrollableYearDropdown={true}
                    dropdownMode="select"
                    customInput={<CustomDateInput />}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="card-toolbar">
            <Row className="align-items-center w-100"></Row>
          </div> */}
        </Card.Header>
        {!loading ? (
          <>
            <Card.Body className="pb-0">
              {ordersReport?.totalSales > 0 ? (
                <>
                  {' '}
                  <Row className="align-items-center g-lg-8 g-6 mb-7">
                    <Col
                      lg={4}
                      md={6}
                      sm={4}
                    >
                      <div className="border-r8px bg-white rounded py-6 px-5 border-gray-solid">
                        <div className="d-flex align-items-center">
                          <div className="fs-22 fw-bolder">
                            {' '}
                            {`${Method.getGeneralizedAmount(
                              ordersReport?.totalOrders || 0
                            )} ${
                              ordersReport?.totalOrders > 1
                                ? ' Orders'
                                : ' Order'
                            }`}
                          </div>
                        </div>
                        <div className="fw-500 fs-16 text-muted">
                          {'Total orders'}
                        </div>
                      </div>
                    </Col>
                    <Col
                      lg={4}
                      md={6}
                      sm={4}
                    >
                      <div className="border-r8px bg-white rounded py-6 px-5 border-gray-solid">
                        <div className="d-flex align-items-center">
                          <div className="fs-22 fw-bolder">
                            {`${Method.getGeneralizedAmount(
                              ordersReport?.totalProducts || 0
                            )} ${
                              ordersReport?.totalProducts > 1
                                ? 'Products'
                                : 'Product'
                            }`}
                          </div>
                        </div>
                        <div className="fw-500 fs-16 text-muted">
                          {Customers.totalProductSold}
                        </div>
                      </div>
                    </Col>
                    <Col
                      lg={4}
                      md={6}
                      sm={4}
                    >
                      <div className="border-r8px bg-white rounded py-6 px-5 border-gray-solid">
                        <div className="d-flex align-items-center">
                          <div className="fs-22 fw-bolder">
                            {`TSh ${Method.formatCurrency(
                              ordersReport?.totalSales || 0
                            )} `}
                          </div>
                        </div>
                        <div className="fw-500 fs-16 text-muted">
                          {'Total sales'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {ordersReport?.data.length ? (
                    <Chart
                      options={{
                        chart: {
                          fontFamily: 'inherit',
                          type: 'area',
                          height: 350,
                          toolbar: {
                            show: false,
                          },
                          dropShadow: {
                            enabled: false,
                            color: '#1b74e4',
                            top: 0,
                            left: 0,
                            blur: 0,
                            opacity: 0.2,
                          },
                          zoom: {
                            enabled: false, // Disable zooming
                          },
                        },
                        dataLabels: {
                          enabled: false,
                        },
                        stroke: {
                          // curve: "straight",
                          curve: 'smooth',
                          show: true,
                          width: 3,
                          colors: [baseColor],
                        },
                        // plotOptions: {},
                        legend: {
                          show: false,
                        },
                        xaxis: {
                          categories: ordersReport?.data
                            ? ordersReport?.data?.map((item: any) =>
                                Method.convertDateToFormat(item.date, 'MMM D')
                              )
                            : [],
                          axisBorder: {
                            show: false,
                          },
                          axisTicks: {
                            show: false,
                          },
                          labels: {
                            style: {
                              colors: '#231f20',
                              fontWeight: '500',
                              fontSize: '13px',
                            },
                          },
                          tooltip: {
                            enabled: false,
                          },
                        },
                        yaxis: {
                          labels: {
                            align: 'center',
                            style: {
                              colors: '#231f20',
                              fontWeight: '500',
                              fontSize: '13px',
                            },
                            formatter: function (y) {
                              return 'Tsh ' + Method.getGeneralizedAmount(y);
                            },
                          },
                        },
                        tooltip: {
                          enabled: true,
                          custom({ series, seriesIndex, dataPointIndex, w }) {
                            const totalOrders =
                              ordersReport.data[dataPointIndex].orderCount;
                            const totalSales =
                              ordersReport.data[dataPointIndex].total;
                            return (
                              '<div class="card fs-16 p-3 w-md-200px border-0">' +
                              '<div>' +
                              '<div class="fw-500">' +
                              'Total orders' +
                              '</div>' +
                              '<div>' +
                              '<span class="fw-bold">' +
                              totalOrders +
                              `${totalOrders > 1 ? ' orders' : ' order'}` +
                              '</span>' +
                              '</div>' +
                              '</div>' +
                              '<div class="separator my-3 text-black"></div>' +
                              '<div>' +
                              '<div class="fw-500">' +
                              'Total sales' +
                              '</div>' +
                              '<div>' +
                              '<span class="fw-bold">Tsh ' +
                              Method.getGeneralizedAmount(totalSales) +
                              '</span>' +
                              '</div>' +
                              '</div>' +
                              '</div>'
                            );
                          },
                        },
                        colors: [baseColor, '#4fbf26'],
                        grid: {
                          borderColor: '#e0e0df',
                          strokeDashArray: 5,
                          yaxis: {
                            lines: {
                              show: true,
                            },
                          },
                        },
                        fill: {
                          type: 'solid',
                          opacity: 0.05,
                        },
                        markers: {
                          size: 0,
                          colors: undefined,
                          strokeColors: baseColor,
                          shape: 'circle',
                          strokeWidth: 8,
                          strokeOpacity: 1,
                          strokeDashArray: 0,
                          radius: 0,
                          onClick: undefined,
                          onDblClick: undefined,
                          showNullDataPoints: false,
                          hover: {
                            size: undefined,
                            sizeOffset: 3,
                          },
                        },
                      }}
                      series={[
                        {
                          name: 'Total sales',
                          data:
                            ordersReport?.data?.map(
                              (item: any) => item.total
                            ) || [],
                          color: baseColor,
                        },
                      ]}
                      height={350}
                      type="area"
                    />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className="d-flex justify-content-center min-h-100px  pt-2">
                  <span className="fs-18 fw-medium">
                    No details available for these dates.
                  </span>
                </div>
              )}
            </Card.Body>
          </>
        ) : (
          <Card.Body className="min-h-200px">
            <div className="w-100 d-flex justify-content-center">
              <Loader loading={loading} />
            </div>
          </Card.Body>
        )}
      </Card>
    </>
  );
};
export default OrderReportV2;
