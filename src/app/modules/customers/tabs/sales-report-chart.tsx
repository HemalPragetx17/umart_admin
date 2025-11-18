/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCSSVariableValue } from '../../../../umart_admin/assets/ts/_utils';
import '../../../custom/DateRange/dateRange.css';
import { useLocation } from 'react-router-dom';
import { Customers, String } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { buyer } from '../../../../api/apiEndPoints';
import Method from '../../../../utils/methods';
import Chart from 'react-apexcharts';
import Loader from '../../../../Global/loader';
import { error } from '../../../../Global/toast';
import CustomDateInput from '../../../custom/Select/CustomDateInput';
import { Customer } from '../../../../utils/constants';
type PropsType = {
  id: any;
};
const SalesReportChart: React.FC<PropsType> = (props) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any>();
  const location = useLocation();
  const [startDate, setStartDate] = useState<any>(Method.getLastWeeksDate());
  const [endDate, setEndDate] = useState<any>(new Date());
  const baseColor = getCSSVariableValue('--bs-primary');
  const customVal: any = location.state;
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchOrderData(props.id, startDate, endDate);
      setLoading(false);
    })();
  }, []);
  const fetchOrderData = async (id: string, startDate?: any, endDate?: any) => {
    setLoading(true);
    const param: any = {
      customer: id,
    };
    if (startDate) {
      param.startDate = Method.convertDateToFormat(startDate, 'YYYY-MM-DD');
    }
    if (endDate) {
      param.endDate = Method.convertDateToFormat(endDate, 'YYYY-MM-DD');
    }
    const apiService = new APICallService(buyer.getOrderReport, param,'','',false,'',Customer);
    const response = await apiService.callAPI();
    if (response) {
      response.data = response.data.map((item: any) => {
        return {
          ...item,
          date: item.date.split('T')[0],
        };
      });
      setOrders(response);
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
        await fetchOrderData(props.id, startDateFormatted, endDateFormatted);
      } else {
        error('Please select a date range with a minimum one-week difference');
      }
    } else if (event[0] === null && event[1] === null) {
      await fetchOrderData(props.id, startDateFormatted, endDateFormatted);
    }
  };
  return (
    <Card className="mb-7 bg-f9f9f9">
      <Card.Header className="pt-4 border-bottom-0">
        <div className="card-title">
          <h2 className="fs-22 fw-bolder">{Customers.salesReport}</h2>
        </div>
        <div className="card-toolbar">
          <DatePicker
            className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-md-288px min-w-300px"
            selected={startDate}
            onChange={handleChange}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select dates"
            dateFormat="dd/MM/yyyy"
            showFullMonthYearPicker
            isClearable={true}
            customInput={<CustomDateInput />}
          />
        </div>
      </Card.Header>
      <Card.Body className="pb-0">
        {!loading ? (
          <>
            {orders?.totalSales > 0 ? (
              <>
                <Row className="align-items-center g-lg-8 g-6 mb-7">
                  <Col
                    xl={3}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {' '}
                          {orders?.totalOrders || 0}
                          {orders?.totalOrders > 1 ? ' orders' : ' order'}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {Customers.totalDeliveredOrders}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xl={3}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {orders?.totalCancelledOrders || 0}
                          {orders?.totalCancelledOrders > 1
                            ? ' orders'
                            : ' order'}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {Customers.totalCancel}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xl={3}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {orders?.totalProducts || 0}
                          {orders?.totalProducts > 1 ? ' products' : ' product'}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {Customers.totalProduct}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xl={3}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {' '}
                          {String.TSh +
                            ' ' +
                            (Method.getGeneralizedAmount(orders?.totalSales) ||
                              0)}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {Customers.totalOrderVal}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Chart
                  options={{
                    chart: {
                      fontFamily: 'inherit',
                      type: 'area',
                      height: 275,
                      zoom: {
                        enabled: false, // Disable zooming
                      },
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
                    xaxis: {
                      categories: orders?.data
                        ? orders?.data.map((item: any) =>
                            Method.convertDateToFormat(item.date, 'MMM D')
                          )
                        : [],
                      axisBorder: {
                        show: false,
                      },
                      tickAmount: 10,
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
                    legend: {
                      show: false,
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
                          return Method.getGeneralizedAmount(y);
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      custom({ series, seriesIndex, dataPointIndex, w }) {
                        const totalOrders =
                          orders.data[dataPointIndex].orderCount;
                        const totalSales = orders.data[dataPointIndex].total;
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
                    markers: {
                      size: 0,
                      colors: [baseColor, '#4fbf26'],
                      strokeColors: baseColor,
                      shape: 'circle',
                      strokeWidth: 8,
                      strokeOpacity: 1,
                      strokeDashArray: 0,
                      radius: 0,
                      // offsetX: 0,
                      // offsetY: 0,
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
                      data: orders?.data?.map((item: any) => item.total) || [],
                      color: baseColor,
                    },
                  ]}
                  type="area"
                  height={275}
                />
              </>
            ) : (
              <div className="d-flex justify-content-center min-h-100px  pt-2">
                <span className="fs-18 fw-medium">
                  No details available for these dates.
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-100 d-flex justify-content-center min-h-100px">
            <Loader loading={loading} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default SalesReportChart;
