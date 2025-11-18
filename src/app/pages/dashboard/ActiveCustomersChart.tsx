import { useEffect, useState } from 'react';
import Method from '../../../utils/methods';
import DatePicker from 'react-datepicker';
import { Card, Col, Row } from 'react-bootstrap';
import { DashboardString } from '../../../utils/string';
import APICallService from '../../../api/apiCallService';
import { dashBoardEndPoints } from '../../../api/apiEndPoints';
import Chart from 'react-apexcharts';
import Loader from '../../../Global/loader';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { dashboardStore } from '../../../utils/storeString';
const ActiveCustomersChart = () => {
  const [startDate, setStartDate] = useState<any>(
    getKey(dashboardStore.activeCustomerFilter)?.startDate
      ? new Date(getKey(dashboardStore.activeCustomerFilter)?.startDate)
      : Method.getCurrentMonthStartDate()
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(dashboardStore.activeCustomerFilter)?.endDate
      ? new Date(getKey(dashboardStore.activeCustomerFilter)?.endDate)
      : Method.getCurrentMonthEndDate()
  );
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchActiveCustomer(startDate, endDate);
      setLoading(false);
    })();
  }, []);
  const fetchActiveCustomer = async (startDate: any, endDate: any) => {
    setLoading(true);
    const params = {
      startDate: Method.convertDateToFormat(startDate, 'YYYY-MM-DD'),
      endDate: Method.convertDateToFormat(endDate, 'YYYY-MM-DD'),
    };
    const apiService = new APICallService(
      dashBoardEndPoints.getActiveCustomers,
      params
    );
    const response = await apiService.callAPI();
    if (response) {
      let totalCustomers = 0;
      const tempData = Array(12).fill({
        orders: 0,
        customers: 0,
      });
      response.map((item: any) => {
        //   return {
        //     ...item,
        //     month: new Date(item.date).getMonth(),
        //   };
        totalCustomers += item.customerCount;
        const month = new Date(item.date).getMonth();
        const temp = { ...tempData[month] };
        temp.orders = temp.orders + item.orderCount;
        temp.customers = temp.customers + item.customerCount;
        tempData[month] = temp;
      });
      setTotalCustomers(totalCustomers);
      setCustomer(tempData);
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
      await fetchActiveCustomer(startDateFormatted, endDateFormatted);
      setKey(dashboardStore.activeCustomerFilter,{
        startDate:event[0],
        endDate : event[1]
      })
    } else if (event[0] === null && event[1] === null) {
      setStartDate(Method.getCurrentMonthStartDate());
      setEndDate(Method.getCurrentMonthEndDate());
      await fetchActiveCustomer(
        Method.getCurrentMonthStartDate(),
        Method.getCurrentMonthEndDate()
      );
      removeKey(dashboardStore.activeCustomerFilter);
    }
  };
  return (
    <Card className="mb-7 bg-f9f9f9">
      <Card.Header className="pt-4 border-bottom-0">
        <div className="card-title">
          <h2 className="fs-22 fw-bolder">{DashboardString.activeCustomers}</h2>
        </div>
        <div className="card-toolbar">
          <Row className="align-items-center">
            <Col xs="auto">
              <label
                htmlFor=""
                className="fs-16 fw-500"
              >
                Filter customers by
              </label>
            </Col>
            <Col xs>
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
            </Col>
          </Row>
        </div>
      </Card.Header>
      {!loading ? (
        totalCustomers > 0 ? (
          <Card.Body className="pb-0">
            <Chart
              options={{
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '14%',
                    borderRadius: 3,
                  },
                },
                chart: {
                  fontFamily: 'inherit',
                  type: 'bar',
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
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  // curve: "straight",
                  curve: 'smooth',
                  show: true,
                  width: 3,
                  colors: ['#5795f7', '#5795f7'],
                },
                // plotOptions: {},
                legend: {
                  show: false,
                },
                xaxis: {
                  categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
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
                  // crosshairs: {
                  //     position: 'front',
                  //     stroke: {
                  //         color: baseColor,
                  //         width: 1,
                  //         dashArray: 3,
                  //     },
                  // },
                  // tooltip: {
                  //     enabled: true,
                  //     formatter: undefined,
                  //     offsetY: 0,
                  //     style: {
                  //         fontSize: '12px',
                  //     },
                  // },
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
                      if (typeof y !== 'undefined') {
                        return y.toFixed(0);
                      }
                      return y;
                    },
                  },
                },
                tooltip: {
                  enabled: true,
                  custom({ series, seriesIndex, dataPointIndex, w }) {
                    const customerCount = series[0][dataPointIndex];
                    return (
                      '<div class="card fs-15 p-3 w-md-200px border-0 py-5">' +
                      '<div>' +
                      '<div class="fw-600">' +
                      'Active customers' +
                      '</div>' +
                      '<div>' +
                      '<span class="d-inline-block w-10px h-10px bg-5795f7 rounded-circle me-3"></span>' +
                      '<span class="fw-bold"> ' +
                      customerCount +
                      '</span>' +
                      '</div>' +
                      '</div>' +
                      '</div>'
                    );
                  },
                },
                colors: ['#5795f7', '#4fbf26'],
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
                  colors: undefined,
                  strokeColors: '#1b74e4',
                  // strokeWidth: 2,
                  // strokeOpacity: 0.9,
                  // strokeDashArray: 0,
                  // fillOpacity: 1,
                  // discrete: [],
                  shape: 'circle',
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
                  name: 'Active Customers',
                  data: customer?.map((item: any) => item.customers) || [],
                },
              ]}
              type="bar"
              height={350}
            />
          </Card.Body>
        ) : (
          <Card.Body className="p-3">
            <div className="d-flex flex-center min-h-125px ">
              <span className="fs-18 fw-medium">
                No details available for these dates.
              </span>
            </div>
          </Card.Body>
        )
      ) : (
        <Card.Body className="min-h-200px">
          <div className="w-100 d-flex justify-content-center">
            <Loader loading={loading} />
          </div>
        </Card.Body>
      )}
    </Card>
  );
};
export default ActiveCustomersChart;
