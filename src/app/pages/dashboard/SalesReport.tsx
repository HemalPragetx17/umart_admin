import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCSSVariableValue } from '../../../umart_admin/assets/ts/_utils';
import '../../custom/DateRange/dateRange.css';
import { Link } from 'react-router-dom';
import { Customers, DashboardString, String } from '../../../utils/string';
import APICallService from '../../../api/apiCallService';
import Method from '../../../utils/methods';
import { dashBoardEndPoints, master } from '../../../api/apiEndPoints';
import clsx from 'clsx';
import Loader from '../../../Global/loader';
import Chart from 'react-apexcharts';
import { error } from '../../../Global/toast';
import blue from '../../../umart_admin/assets/media/svg_uMart/blue.svg';
import green from '../../../umart_admin/assets/media/svg_uMart/green_dot.svg';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { dashboardStore } from '../../../utils/storeString';
const SalesReport = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>();
  const [startDate, setStartDate] = useState<any>(
    getKey(dashboardStore.salesReportFilter)?.startDate
      ? new Date(getKey(dashboardStore.salesReportFilter)?.startDate)
      : Method.getCurrentMonthStartDate()
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(dashboardStore.salesReportFilter)?.endDate
      ? new Date(getKey(dashboardStore.salesReportFilter)?.endDate)
      : Method.getCurrentMonthEndDate()
  );
  const [currentTab, setCurrentTab] = useState('');
  const [tabs, setTabs] = useState<any>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [initLoading, setInitLoading] = useState(true);
  const [startMonthSeries, setStartMonthSeries] = useState<any>([]);
  const [endMonthSeries, setEndMonthSeries] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const baseColor = getCSSVariableValue('--bs-primary');
  useEffect(() => {
    (async () => {
      setLoading(true);
      setInitLoading(true);
      await fetchCategories();
      await fetchSalesData('', startDate, endDate);
      setInitLoading(false);
      setLoading(false);
    })();
  }, []);
  const fetchSalesData = async (id?: string, fromDate?: any, toDate?: any) => {
    setLoading(true);
    let params: any = {
      fromDate1: Method.convertDateToFormat(fromDate, 'YYYY-MM-DD'),
      toDate1: Method.convertDateToFormat(toDate, 'YYYY-MM-DD'),
      fromDate2: Method.convertToPreviousMonth(
        Method.convertDateToFormat(fromDate, 'YYYY-MM-DD'),
        'YYYY-MM-DD'
      ),
      toDate2: Method.convertToPreviousMonth(
        Method.convertDateToFormat(toDate, 'YYYY-MM-DD'),
        'YYYY-MM-DD'
      ),
      utcOffset: new Date().getTimezoneOffset(),
    };
    if (id !== undefined && id.length && id) {
      params = { ...params, ['categories[' + 0 + ']']: id };
    }
    // if (startDate) {
    //   param.startDate = startDate;
    // }
    // if (endDate) {
    //   param.endDate = endDate;
    // }
    const apiService = new APICallService(
      dashBoardEndPoints.getSalesReport,
      params
    );
    const response = await apiService.callAPI();
    // if (response) {
    //   setSalesData(response);
    // }
    if (response.line1.data.length) {
      let line1Dates: any = new Set(
        response.line1.data.map((entry: any) => entry.date)
      );
      let line2Dates: any = new Set(
        response.line2.data.map((entry: any) => entry.date)
      );
      // Find unique dates across both lines
      let allDates2 = new Set([...line1Dates, ...line2Dates]);
      // Add zero totalSales for missing dates in line1
      const fromDate1Year = new Date(fromDate).getFullYear();
      const fromDate2Year = new Date(
        Method.convertToPreviousMonth(
          Method.convertDateToFormat(fromDate, 'YYYY-MM-DD'),
          'YYYY-MM-DD'
        )
      ).getFullYear();
      allDates2.forEach((date: any) => {
        if (!line1Dates.has(date)) {
          const currDateYear = new Date(date).getFullYear();
          let tempDate = date;
          if (fromDate1Year !== currDateYear) {
            tempDate = date.replace(currDateYear, fromDate1Year);
          }
          response.line1.data.push({ date: tempDate, totalSales: 0 });
        }
      });
      // Add zero totalSales for missing dates in line2
      allDates2.forEach((date: any) => {
        if (!line2Dates.has(date)) {
          const currDateYear = new Date(date).getFullYear();
          let tempDate = date;
          if (fromDate2Year !== currDateYear) {
            tempDate = date.replace(currDateYear, fromDate2Year);
          }
          response.line2.data.push({ date: tempDate, totalSales: 0 });
        }
      });
      for (let i = 0; i < response.line1.data.length; i++) {
        response.line1.data[i].date = response.line1.data[i].date.replace(
          /-..-/,
          `-${`${Method.convertDateToFormat(fromDate, 'MM')}`}-`
        );
      }
      for (let i = 0; i < response.line2.data.length; i++) {
        response.line2.data[i].date = response.line2.data[i].date.replace(
          /-..-/,
          `-${`${Method.convertToPreviousMonth(
            Method.convertDateToFormat(fromDate, 'YYYY-MM-DD'),
            'MM'
          )}`}-`
        );
      }
      for (let lineKey in response) {
        let line = response[lineKey];
        let uniqueDates: any = {};
        line.data.forEach((item: any) => {
          let date = item.date;
          let sales = item.totalSales;
          if (
            !(date in uniqueDates) ||
            (date in uniqueDates &&
              uniqueDates[date].totalSales === 0 &&
              sales > 0)
          ) {
            uniqueDates[date] = { date, totalSales: sales };
          }
        });
        line.data = Object.values(uniqueDates);
      }
      response.line2.data = Method.populateMissingDates(
        response.line2.data,
        Method.convertToPreviousMonth(
          Method.convertDateToFormat(fromDate, 'YYYY-MM-DD'),
          'DD'
        ),
        Method.convertToPreviousMonth(
          Method.convertDateToFormat(toDate, 'YYYY-MM-DD'),
          'DD'
        )
      );
      response.line1.data = Method.populateMissingDates(
        response.line1.data,
        Method.convertDateToFormat(fromDate, 'DD'),
        Method.convertDateToFormat(toDate, 'DD')
      );
    }
    // response.line2.data = Method.populateMissingDates(response.line2.data);
    // response.line1.data = Method.populateMissingDates(response.line1.data);
    const allDatesSet = new Set([
      ...response.line1.data.map((entry: any) => entry.date),
    ]);
    const allDates: any = Array.from(allDatesSet);
    setCategories(allDates);
    setStartMonthSeries(response.line1);
    if (response?.line2?.data.length) {
      setEndMonthSeries(response.line2);
    }
    if (response?.line1?.data.length) {
      setSalesData(response);
    } else {
      setSalesData(null);
    }
    setLoading(false);
  };
  const fetchCategories = async () => {
    const apiService = new APICallService(master.categoryList, {
      needCount: true,
      categoriesDepth: 1,
    });
    const response = await apiService.callAPI();
    if (response) {
      setCurrentTab('1');
      const temp: any = {
        _id: '1',
        title: 'All Categories',
      };
      setTotalCategories(response.total);
      setTabs([temp, ...response.records]);
    }
  };
  const handleChange = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    const startMonth = Method.getMonth(
      Method.convertDateToFormat(event[0], 'YYYY-MM-DD'),
      'MM'
    );
    const endMonth = Method.getMonth(
      Method.convertDateToFormat(event[1], 'YYYY-MM-DD'),
      'MM'
    );
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    const id = currentTab.toString() === '1' ? '' : currentTab.toString();
    if (event[0] && event[1]) {
      if (
        startMonth === endMonth &&
        Method.dayDifference(event[0], event[1]) <= 31
      ) {
        if (Method.dayDifference(event[0], event[1]) >= 6) {
          await fetchSalesData(id, startDateFormatted, endDateFormatted);
          setKey(dashboardStore.salesReportFilter,{
            startDate:event[0],
            endDate:event[1]
          })
        } else {
          error(
            'Please select a date range with a minimum one-week difference'
          );
        }
      } else {
        error('Please select a date range within a single month');
      }
    } else if (event[0] === null && event[1] === null) {
      setStartDate(Method.getCurrentMonthStartDate());
      setEndDate(Method.getCurrentMonthEndDate());
      await fetchSalesData(
        id,
        Method.getCurrentMonthStartDate(),
        Method.getCurrentMonthEndDate()
      );
      removeKey(dashboardStore.salesReportFilter);
    }
  };
  const handleSelectTab = async (tab: any) => {
    setCurrentTab(tab._id);
    const id = tab._id === '1' ? '' : tab._id;
    await fetchSalesData(id, startDate, endDate);
  };
  const createTabs = () => {
    const localTab = tabs;
    let current = currentTab;
    const allTabs = localTab?.map((tab: any, index: number) => {
      return (
        <li
          key={index}
          className="nav-item scroll-item mb-3"
        >
          <Link
            to={'/'}
            className={clsx(
              'nav-link ',
              // current === tab._id
              //   ? 'active text-active-dark text-dark  border-bottom-3 border-primary'
              //   : 'border-bottom-0 ',
              // currentTab.value !== tab.value
              //   ? disabled
              //     ? 'disabled'
              //     : ''
              //   : '',
              loading ? 'disabled' : ''
            )}
            data-bs-toggle="tab"
            onClick={() => handleSelectTab(tab)}
          >
            <div
              className={clsx(
                'd-flex flex-column justify-content-center align-items-center border-r8px border-gray-solid bg-white rounded  h-125px w-125px ',
                current === tab._id ? 'border-bottom-primary' : ''
              )}
            >
              {tab?.image ? (
                <div className="d-flex align-items-center justify-content-center border-r8px  border-gray-solid bg-white rounded  p-1">
                  <img
                    src={tab.image}
                    height={50}
                    width={50}
                  />
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center border-r8px  text-primary rounded h-50px w-50px bg-light-primary p-1">
                  {totalCategories}
                </div>
              )}
              <div
                className="fs-14 w-100 px-1 fw-bold text-dark mt-4 text-center"
                style={{ whiteSpace: 'initial' }}
              >
                {tab.title}
              </div>
            </div>
          </Link>
        </li>
      );
    });
    return allTabs;
  };
  return (
    <Card className="mb-7 bg-f9f9f9">
      <Card.Header className="pt-4 border-bottom-0">
        <div className="card-title d-flex flex-column flex-sm-row align-items-md-center   justify-content-between w-100">
          <h2 className="fs-22 fw-bolder">{Customers.salesReport}</h2>
          <div className="card-toolbar">
            {!initLoading ? (
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
            ) : (
              <></>
            )}
          </div>
        </div>
        {totalCategories > 0 ? (
          <Row className="scroll-container">
            <Col sm>
              <div className="d-flex">
                <ul className="scroll-container nav nav-stretch nav-line-tabs nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-18 fw-600 border-bottom-3 border-primary ">
                  {createTabs()}
                </ul>
              </div>
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </Card.Header>
      <Card.Body className="pb-0">
        {loading ? (
          <div className="w-100 d-flex justify-content-center min-h-325px align-items-center">
            <Loader loading={loading} />
          </div>
        ) : (
          <>
            {startMonthSeries?.data?.length > 0 ? (
              <>
                {' '}
                <Row className="align-items-center g-lg-8 g-6 mb-7">
                  <Col
                    xl={4}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5 border-gray-solid">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {' '}
                          {String.TSh +
                            ' ' +
                            Method.getGeneralizedAmount2(
                              salesData?.line1?.totalSales || 0
                            )}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {DashboardString.totalSales}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xl={4}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5 border-gray-solid">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {' '}
                          {Method.getGeneralizedAmount(
                            salesData?.line1?.totalOrders || 0
                          )}{' '}
                          {salesData?.line1?.totalOrders > 1
                            ? ' Orders'
                            : ' Order'}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {DashboardString.totalDeliveredOrders}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xl={4}
                    md={6}
                    sm={4}
                  >
                    <div className="border-r8px bg-white rounded py-4 px-5 border-gray-solid">
                      <div className="d-flex align-items-center">
                        <div className="fs-22 fw-bolder">
                          {Method.getGeneralizedAmount(
                            salesData?.line1?.totalCancelledOrders || 0
                          )}{' '}
                          {salesData?.line1?.totalCancelledOrders > 1
                            ? ' Orders'
                            : ' Order'}
                        </div>
                      </div>
                      <div className="fw-500 fs-16 text-muted">
                        {Customers.totalCancel}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Chart
                  series={[
                    {
                      name: 'Total Sales end month',
                      data:
                        endMonthSeries?.data?.map(
                          (val: any) => val.totalSales
                        ) || [],
                    },
                    {
                      name: 'Total Sales start month',
                      data:
                        startMonthSeries?.data?.map(
                          (val: any) => val.totalSales
                        ) || [],
                    },
                  ]}
                  options={{
                    chart: {
                      fontFamily: 'inherit',
                      type: 'area',
                      height: '350',
                      toolbar: {
                        show: false,
                      },
                      dropShadow: {
                        enabled: false,
                        color: '#1b74e4',
                        top: 0,
                        left: 0,
                        blur: 0,
                        opacity: 0,
                      },
                      zoom: {
                        enabled: false, // Disable zooming
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stroke: {
                      curve: 'smooth',
                      show: true,
                      width: 3,
                      colors: ['#5795f7', baseColor],
                    },
                    legend: {
                      show: false,
                    },
                    xaxis: {
                      type: 'datetime',
                      categories: categories.map((item: any) => {
                        return Method.isDateValid(item, 'YYYY-MM-DD')
                          ? Method.convertDateToFormat(item, 'MMM DD')
                          : null;
                      }),
                      tickAmount: 10,
                      axisBorder: {
                        show: false,
                      },
                      axisTicks: {
                        show: false,
                      },
                      labels: {
                        style: {
                          colors: '#231f20',
                          fontWeight: 500,
                          fontSize: '13px',
                        },
                      },
                      tooltip: {
                        enabled: false,
                      },
                    },
                    yaxis: [
                      {
                        labels: {
                          show: false,
                          align: 'center',
                          style: {
                            colors: '#231f20',
                            fontWeight: 500,
                            fontSize: '13px',
                          },
                          formatter: function (y) {
                            return 'Tsh ' + Method.getGeneralizedAmount(y);
                          },
                        },
                      },
                      {
                        seriesName: 'Total Sales end month',
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
                    ],
                    // tooltip: {
                    //   enabled: true,
                    //   custom({ series, seriesIndex, dataPointIndex, w }) {
                    //     const categories = w.config.xaxis.categories;
                    //     const date1 = Method.convertDateToFormat(
                    //       categories[dataPointIndex],
                    //       'DD MMM'
                    //     );
                    //     const date2 = Method.convertDateToFormat(
                    //       Method.monthsAgoDate(categories[dataPointIndex], 1),
                    //       'DD MMM'
                    //     );
                    //     const value1 = Method.convertToMillionOrThousand(
                    //       series[0][dataPointIndex]
                    //     );
                    //     const value2 = Method.convertToMillionOrThousand(
                    //       series[1][dataPointIndex]
                    //     );
                    //     return (
                    //       '<div class="card fs-14 p-3 w-md-200px border-0">' +
                    //       '<div>' +
                    //       '<div class="fw-500">' +
                    //       date1 +
                    //       '</div>' +
                    //       '<div>' +
                    //       '<span class="d-inline-block w-10px h-10px bg-success rounded-circle me-3"></span>' +
                    //       '<span class="fw-bold">Tsh ' +
                    //       value1 +
                    //       '</span>' +
                    //       '</div>' +
                    //       '</div>' +
                    //       '<div class="separator my-3 text-black"></div>' +
                    //       '<div>' +
                    //       '<div class="fw-500">' +
                    //       date2 +
                    //       '</div>' +
                    //       '<div>' +
                    //       '<span class="d-inline-block w-10px h-10px bg-5795f7 rounded-circle me-3"></span>' +
                    //       '<span class="fw-bold">Tsh ' +
                    //       value2 +
                    //       '</span>' +
                    //       '</div>' +
                    //       '</div>' +
                    //       '</div>'
                    //     );
                    //   },
                    // },
                    tooltip: {
                      enabled: true,
                      shared: true,
                      custom: function ({
                        series,
                        seriesIndex,
                        dataPointIndex,
                        w,
                      }) {
                        const monthData = startMonthSeries.data[dataPointIndex];
                        const endMonthData =
                          endMonthSeries.data[dataPointIndex];
                        return `<div style='width:164px !important'>
                                            ${
                                              Method.convertDateToDDMMYYYY(
                                                monthData.date
                                              ) !== 'Invalid date'
                                                ? ` <div class="p-2 mb-0"><span class="fw-500 fs-16 text-dark ms-2 mb-2">${
                                                    Method.convertDateToDDMMYYYY(
                                                      monthData.date
                                                    ) !== 'Invalid date'
                                                      ? monthData.fullDate
                                                      : '-'
                                                  }</span><div class="d-flex align-items-center ms-2 mb-0 mt-2"><img src=${green}></img><span class="ms-2 fw-500 fs-16 text-dark"> TSh  ${Method.getGeneralizedAmount(
                                                    monthData.totalSales
                                                  )}</span> </div>
                                              </div>`
                                                : ''
                                            }
                                              ${
                                                endMonthData?.date &&
                                                Method.convertDateToDDMMYYYY(
                                                  endMonthData.date
                                                ) !== 'Invalid date'
                                                  ? `<div class='separator my-2'></div>
                      <div class="p-2 mb-0 ms-2 mb-2"><span class="fw-500 fs-16 text-dark">${
                        Method.convertDateToDDMMYYYY(endMonthData.date) !==
                        'Invalid date'
                          ? endMonthData.fullDate
                          : '-'
                      }</span><div class="d-flex align-items-center ms-2 mb-0 mt-2"><img src=${blue}></img><span class="ms-2 fw-500 fs-16 text-dark"> ${
                                                      Method.convertDateToDDMMYYYY(
                                                        endMonthData.date
                                                      ) !== 'Invalid date'
                                                        ? 'TSh ' +
                                                          Method.getGeneralizedAmount(
                                                            endMonthData.totalSales
                                                          )
                                                        : '-'
                                                    }
                                            </span> </div>`
                                                  : ` `
                                              }
                     </div>
                                       `;
                      },
                    },
                    colors: ['#5795f7', baseColor],
                    grid: {
                      borderColor: '#e0e0df',
                      strokeDashArray: 6,
                      yaxis: {
                        lines: {
                          show: true,
                        },
                      },
                    },
                    markers: {
                      size: 0,
                      colors: ['#5795f7', baseColor],
                      strokeColors: ['#5795f7', baseColor],
                      strokeWidth: 8,
                      strokeOpacity: 1,
                      strokeDashArray: 0,
                      fillOpacity: 1,
                      shape: 'circle',
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
                  type="area"
                  height={350}
                />
              </>
            ) : (
              <div className="d-flex flex-center min-h-100px ">
                <span className="fs-18 fw-medium">
                  No details available for these dates.
                </span>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};
export default SalesReport;
// function getChartOptions(
//   height: number,
//   data: any,
//   startDate: any,
//   endDate: any
// ): ApexOptions {
//   const labelColor = getCSSVariableValue('--bs-gray-500');
//   const borderColor = getCSSVariableValue('--bs-gray-200');
//   const baseColor = getCSSVariableValue('--bs-primary');
//   const lightColor = getCSSVariableValue('--bs-primary-light');
//   let startMonth = new Date(startDate).getUTCMonth() + 1;
//   let endMonth = new Date(endDate).getUTCMonth() + 1;
//   const seriesData: any = [];
//   while (startMonth <= endMonth) {
//     const temp = data.filter((item: any) => {
//       const currMonth = new Date(item.date).getUTCMonth() + 1;
//       return currMonth === startMonth;
//     });
//     startMonth++;
//     const tempData = {
//       name: 'Tsh',
//       data: temp.map((val: any) => Method.toFixed2(val?.total)),
//     };
//     seriesData.push(tempData);
//   }
//   return {
//     // series: [
//     //   {
//     //     name: 'Total Orders',
//     //     data: data ? data.map((item: any) => Method.toFixed2(item.total)) : [],
//     //   },
//     // ],
//     series: seriesData,
//     // series: Object.values(dataByMonth).map((monthData: any, index: number) => {
//     //   console.log(monthData);
//     //   return {
//     //     name: new Date(monthData[0].date).toLocaleString('en-us', {
//     //       month: 'short',
//     //       day: 'numeric',
//     //     }),
//     //     data: monthData.map((entry: any) => entry.total),
//     //   };
//     // }),
//     chart: {
//       fontFamily: 'inherit',
//       type: 'area',
//       height: 350,
//       toolbar: {
//         show: false,
//       },
//       dropShadow: {
//         enabled: false,
//         color: '#1b74e4',
//         top: 0,
//         left: 0,
//         blur: 0,
//         opacity: 0.2,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       // curve: "straight",
//       curve: 'smooth',
//       show: true,
//       width: 3,
//       colors: [baseColor, '#5795f7'],
//     },
//     // plotOptions: {},
//     legend: {
//       show: false,
//     },
//     xaxis: {
//       categories: data
//         ? data.map((item: any) =>
//             Method.convertDateToFormat(item.date, 'MMM D')
//           )
//         : [],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//       labels: {
//         style: {
//           colors: '#1a1a1a',
//           fontSize: '12px',
//         },
//       },
//     },
//     // xaxis: {
//     //   type: 'datetime',
//     //   categories: Object.keys(dataByMonth),
//     // },
//     yaxis: {
//       labels: {
//         align: 'center',
//         style: {
//           colors: '#7c7c7c',
//           fontSize: '12px',
//         },
//         formatter: (val) => {
//           return val?.toFixed(0);
//         },
//       },
//     },
//     // states: {
//     //     normal: {
//     //         filter: {
//     //             type: 'none',
//     //             value: 0,
//     //         },
//     //     },
//     //     hover: {
//     //         filter: {
//     //             type: 'none',
//     //             value: 0,
//     //         },
//     //     },
//     //     active: {
//     //         allowMultipleDataPointsSelection: false,
//     //         filter: {
//     //             type: 'none',
//     //             value: 0,
//     //         },
//     //     },
//     // },
//     // tooltip: {
//     //   enabled: true,
//     //   // style: {
//     //   //     fontSize: '14px',
//     //   // },
//     //   // y: {
//     //   //     formatter: function (val) {
//     //   //         return 'Tsh' + val + ' thousands'
//     //   //     },
//     //   // },
//     // },
//     tooltip: {
//       enabled: true,
//       // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
//       //   console.log(series, seriesIndex, dataPointIndex, w);
//       //   return `<div class="custom-tooltip">${w.config.xaxis.categories[dataPointIndex]}: ${series[seriesIndex][dataPointIndex]}</div>`;
//       // },
//     },
//     colors: [baseColor, '#5795f7'],
//     grid: {
//       borderColor: '#e0e0df',
//       strokeDashArray: 5,
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },
//     markers: {
//       size: 0,
//       colors: undefined,
//       strokeColors: '#1b74e4',
//       // strokeWidth: 2,
//       // strokeOpacity: 0.9,
//       // strokeDashArray: 0,
//       // fillOpacity: 1,
//       // discrete: [],
//       shape: 'circle',
//       radius: 0,
//       // offsetX: 0,
//       // offsetY: 0,
//       onClick: undefined,
//       onDblClick: undefined,
//       showNullDataPoints: false,
//       hover: {
//         size: undefined,
//         sizeOffset: 3,
//       },
//     },
//   };
// }
