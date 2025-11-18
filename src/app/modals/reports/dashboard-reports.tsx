import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CrossSvg from '../../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
import { buyer, master, reports } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import APICallService from '../../../api/apiCallService';
import CustomDatePicker from '../../custom/DateRange/DatePicker';
import { error } from '../../../Global/toast';
import clsx from 'clsx';
import { CustomReportSelect } from '../../custom/Select/CustomReportSelect';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { CustomComponentSelect } from '../../custom/Select/CustomComponentSelect';
const DashboardReport = (props: any) => {
  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate() - 1);
  const previousDayDate = new Date(todayDate);
  previousDayDate.setDate(todayDate.getDate() - 1);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<any>(false);
  const [startDate, setStartDate] = useState<any>(
    new Date(Method.monthsAgoDate(todayDate.toDateString(), 1).toString())
  );
  const [endDate, setEndDate] = useState<any>(todayDate);
  const [primaryCategories, setPrimaryCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [downloadAsPdf, setDownloadAsPdf] = useState(true);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      await fetchPrimaryCategory();
      setFetchLoader(false);
    })();
  }, []);
  const fetchPrimaryCategory = async () => {
    let params = {
      categoriesDepth: 1,
    };
    let apiService = new APICallService(master.categoryList, params);
    let response = await apiService.callAPI();
    if (response) {
      let data: any = [];
      response.records.map((val: any) => {
        data.push({
          value: val._id,
          name: val.title,
          title: val.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val.image}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">{val.title}</span>
            </>
          ),
          _id: val._id,
          id: val._id,
        });
      });
      data.unshift({
        value: 0,
        name: ' All',
        title: ' All',
        label: <span className="fs-16 fw-600 text-black "> All</span>,
        _id: 0,
        id: 0,
      });
      setPrimaryCategories(data);
    }
  };
  console.log(selectedCategories);
  const handleCategory = async (event: any) => {
    let tempCategories = [...selectedCategories];
    if (Array.isArray(event)) {
      if (event.length > tempCategories.length) {
        if (
          event.some((item) => item.value === 0) ||
          event.length == primaryCategories.length - 1
        ) {
          tempCategories = primaryCategories;
        } else {
          tempCategories = event;
        }
      } else {
        if (event.some((val: any) => val.value === 0)) {
          let temp = event.filter((val: any) => val.value !== 0);
          tempCategories = temp;
        } else if (
          !event.some((val: any) => val.value === 0) &&
          event.length == primaryCategories.length - 1
        ) {
          tempCategories = [];
        } else {
          tempCategories = event;
        }
      }
    } else {
      tempCategories = [event];
    }
    setSelectedCategories(tempCategories);
    setValidation(false);
    if (!event.length) {
      setValidation(true);
    }
  };
  const handleSubmit = async (downloadAsPdf: boolean) => {
    if (selectedCategories.length && startDate && endDate) {
      if (Method.dayDifference(startDate, endDate) < 0) {
        return error('Please select a valid date range');
      }
      let categories: any = [];
      selectedCategories.map((val: any) => {
        categories.push(val.value);
      });
      let params: any = {};
      if (startDate && endDate) {
        params = {
          ...params,
          fromDate: Method.convertDateToFormat(startDate, 'YYYY-MM-DD'),
          toDate: Method.convertDateToFormat(endDate, 'YYYY-MM-DD'),
          utcOffset: new Date().getTimezoneOffset(),
          reportFormatType: downloadAsPdf ? 'pdf' : 'excel',
        };  
      }
      const data = {
        categories: categories.filter((val: any) => val !== 0),
      };
      setLoading(true);
      let apiService = new APICallService(
        reports.salesReport,
        data,
        params,
        'blob'
      );
      let response = await apiService.callAPI();
      if (response) {
        let blob: Blob;
        if (downloadAsPdf) {
          blob = new Blob([response], { type: 'application/pdf' });
        } else {
          blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
        }
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        let fileName =
          'Sales_report' +
          Method.convertDateToDDMMYYYY(startDate) +
          '_' +
          Method.convertDateToDDMMYYYY(endDate);
        if (downloadAsPdf) {
          fileName += '.pdf';
        } else {
          fileName += '.xlsx';
        }
        downloadLink.download = fileName;
        downloadLink.click();
        props.onHide();
      } else {
        error('Whoops! Sorry, no records found');
        // props.onHide();
      }
    } else if (selectedCategories.length === 0) {
      setValidation(true);
    }
    setLoading(false);
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-690px"
        className="border-r10px"
        contentClassName="p-5"
        size="lg"
        backdrop={loading ? 'static' : true}
      >
        <Modal.Header className="border-bottom-0 text-center pb-6 mx-auto">
          {!loading ? (
            <div className="symbol symbol-md-40px symbol-35px close-inner-top">
              <img
                width={40}
                height={40}
                src={CrossSvg}
                alt=""
                onClick={props.onHide}
              />
            </div>
          ) : (
            <></>
          )}
          <Modal.Title className="fs-30 fw-bolder mw-lg-350px">
            Download report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-5">
          <Row className="align-items-center g-3">
            <Col md={12}>
              <div className="d-flex align-items-center mb-2">
                <div className="fs-18 fw-500">Download Report for </div>
              </div>
              <CustomReportSelect
                border={validation ? '#e55451' : '#e0e0df'}
                backgroundColor="#ffff"
                isDisabled={fetchLoader}
                placeholder="Select category"
                minHeight="60px"
                isLoading={fetchLoader}
                closeMenuOnSelect={false}
                isSearchable={true}
                options={
                  primaryCategories && primaryCategories.length
                    ? primaryCategories
                    : []
                }
                value={selectedCategories}
                text={'categories selected'}
                hideSelectedOptions={false}
                onChange={(event: any) => {
                  handleCategory(event);
                }}
                // isClearable={selectedSeller ? true : false}
                isMulti={true}
              />
            </Col>
          </Row>
          <Row className="align-items-center g-3 mt-4">
            <Col md={12}>
              <div className="d-flex align-items-center mb-2">
                <div className="fs-18 fw-500">Select date </div>
              </div>
            </Col>
            <Col md={5}>
              <CustomDatePicker
                className={clsx(
                  'form-control bg-white min-h-60px fs-16 fw-bold ',
                  !startDate ? 'border-danger' : ''
                )}
                onChange={(event: any) => {
                  setStartDate(event);
                }}
                selected={startDate}
                startDate={startDate}
                dateFormat="dd/MM/yyyy"
                showFullMonthYearPicker={true}
                maxDate={todayDate}
                inputTextBG="bg-white"
                customInput={<CustomDateInput />}
                dayClassName={(date: Date) => {
                  return Method.dayDifference(
                    todayDate.toDateString(),
                    date.toDateString()
                  ) > 0
                    ? 'date-disabled'
                    : '';
                }}
              />
            </Col>
            <Col md={2}>
              <div className="d-flex justify-content-center mb-2">
                <div className="fs-48 fw-400">- </div>
              </div>
            </Col>
            <Col md={5}>
              <CustomDatePicker
                className={clsx(
                  'form-control bg-white min-h-60px fs-16 fw-bold ',
                  !endDate ? 'border-danger' : ''
                )}
                onChange={(event: any) => {
                  setEndDate(event);
                }}
                selected={endDate}
                selectsRange={false}
                startDate={endDate}
                dateFormat="dd/MM/yyyy"
                showFullMonthYearPicker={true}
                maxDate={todayDate}
                inputTextBG="bg-white"
                customInput={<CustomDateInput />}
                dayClassName={(date: Date) => {
                  return Method.dayDifference(
                    todayDate.toDateString(),
                    date.toDateString()
                  ) > 0
                    ? 'date-disabled'
                    : '';
                }}
              />
            </Col>
          </Row>
          <Row className="align-items-center mt-5 mb-2">
            <Col
              xs={12}
              className="d-flex  gap-6"
            >
              <div className="fs-18 fw-500 me-3">Download as</div>
              <div className="form-check  d-flex align-items-center me-3 ">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id={`pdf`}
                  value={0}
                  checked={downloadAsPdf}
                  onChange={() => setDownloadAsPdf(true)}
                />
                <label
                  className="form-check-label text-black fs-16 fw-600"
                  htmlFor={`pdf`}
                >
                  Pdf
                </label>
              </div>
              <div className="form-check  d-flex align-items-center me-3 ">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id={`excel`}
                  value={0}
                  checked={!downloadAsPdf}
                  onChange={() => setDownloadAsPdf(false)}
                />
                <label
                  className="form-check-label text-black fs-16 fw-600"
                  htmlFor={`excel`}
                >
                  Excel
                </label>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center pt-0 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              handleSubmit(downloadAsPdf);
            }}
            disabled={loading}
          >
            {!loading && (
              <span className="indicator-label">Download report</span>
            )}
            {loading && (
              <span
                className="indicator-progress"
                style={{ display: 'block' }}
              >
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DashboardReport;
