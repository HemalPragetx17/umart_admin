import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { getCSSVariableValue } from '../../../umart_admin/assets/ts/_utils';
import '../../custom/DateRange/dateRange.css';
import APICallService from '../../../api/apiCallService';
import Method from '../../../utils/methods';
import { dashBoardEndPoints } from '../../../api/apiEndPoints';
import Loader from '../../../Global/loader';
import Chart from 'react-apexcharts';
const CategoryReportChart = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>();
  const [currentTab, setCurrentTab] = useState('');
  const baseColor = getCSSVariableValue('--bs-primary');
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchSalesData();
      setLoading(false);
    })();
  }, []);
  const fetchSalesData = async () => {
    setLoading(true);
    const apiService = new APICallService(
      dashBoardEndPoints.categoryReport,
      {}
    );
    const response = await apiService.callAPI();
    if (response) {
      setSalesData(response);
    }
    setLoading(false);
  };

  return (
    <Card className="mb-7 bg-f9f9f9">
      <Card.Header className="pt-4 border-bottom-0">
        {' '}
        <div className="card-title">
          <h2 className="fs-22 fw-bolder">{'Main categories report'}</h2>
        </div>
      </Card.Header>
      <Card.Body className="pb-0">
        {loading ? (
          <div className="w-100 d-flex justify-content-center min-h-325px align-items-center">
            <Loader loading={loading} />
          </div>
        ) : (
          <>
            {salesData?.length > 0 ? (
              <>
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
                      categories: salesData.length
                        ? salesData?.map((item: any) => item?.name || '')
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
                        hideOverlappingLabels: false,
                        trim: true,
                        // rotate: -45,
                        // rotateAlways: true,
                      },
                      tooltip: {
                        enabled: false
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
                          return Method.getGeneralizedAmount(y);
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      custom({ series, seriesIndex, dataPointIndex, w }) {
                        const totalOrders =
                          salesData[dataPointIndex].totalQuantities;
                        const totalSales = salesData[dataPointIndex].totalSales;
                        return (
                          '<div class="card fs-16 p-3 w-md-200px border-0">' +
                          '<div>' +
                          '<div class="fw-500">' +
                          'Category' +
                          '</div>' +
                          '<div>' +
                          '<span class="fw-bold">' +
                          salesData[dataPointIndex]?.name +
                          '</span>' +
                          '</div>' +
                          '</div>' +
                          '<div class="separator my-3 text-black"></div>' +
                          '<div>' +
                          '<div class="fw-500">' +
                          'Total quantities' +
                          '</div>' +
                          '<div>' +
                          '<span class="fw-bold">' +
                          Method.getGeneralizedAmount(totalOrders) +
                          ' Units' +
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
                      name: 'Total quantities',
                      data:
                        salesData?.map(
                          (item: any) => item?.totalQuantities || 0
                        ) || [],
                      color: baseColor,
                    },
                  ]}
                  height={350}
                  type="area"
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
export default CategoryReportChart;
