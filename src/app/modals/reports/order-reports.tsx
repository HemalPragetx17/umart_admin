import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CrossSvg from '../../../umart_admin/assets/media/close.png';
import { useState } from 'react';
import { reports } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import APICallService from '../../../api/apiCallService';
import CustomDatePicker from '../../custom/DateRange/DatePicker';
import { error } from '../../../Global/toast';
import clsx from 'clsx';
import CustomDateInput from '../../custom/Select/CustomDateInput';
const OrderReportModal = (props: any) => {
  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate() - 1);
  const previousDayDate = new Date(todayDate);
  previousDayDate.setDate(todayDate.getDate() - 1);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>(
    new Date(Method.monthsAgoDate(todayDate.toDateString(), 1).toString())
  );
  const [endDate, setEndDate] = useState<any>(todayDate);
  const [downloadAsPdf, setDownloadAsPdf] = useState(true);
  const handleSubmit = async () => {
    if (startDate && endDate) {
      if (Method.dayDifference(startDate, endDate) < 0) {
        return error('Please select a valid date range');
      }
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
      setLoading(true);
      let apiService = new APICallService(
        reports.orderReport,
        params,
        undefined,
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
          'orders_report_' +
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
        error('Whoops! Sorry, no records found for selected dates.');
      }
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
              handleSubmit();
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
export default OrderReportModal;
