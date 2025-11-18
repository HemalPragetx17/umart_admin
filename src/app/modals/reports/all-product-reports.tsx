import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CrossSvg from '../../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
import { manageProductInventory, master, reports } from '../../../api/apiEndPoints';
import Method from '../../../utils/methods';
import APICallService from '../../../api/apiCallService';
import CustomDatePicker from '../../custom/DateRange/DatePicker';
import { error } from '../../../Global/toast';
import clsx from 'clsx';
import { CustomReportSelect } from '../../custom/Select/CustomReportSelect';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import { Product, Reports } from '../../../utils/constants';
const AllProductReportModal = (props: any) => {
  const [fetchLoader, setFetchLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<any>(false);
  const [variantsData, setVariantsData] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState<any>([]);
  const [downloadAsPdf, setDownloadAsPdf] = useState(true);

  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      await fetchProducts(1, 0);
      setFetchLoader(false);
    })();
  }, []);
  const fetchProducts = async (page: number, limit: number) => {
    let params = {
      pageNo: 1,
      limit: 0,
      sortKey: 'title',
      sortOrder: 1,
      needCount: true,
      categoriesDepth: 1,
    };
    const apiService = new APICallService(
      master.categoryList,
      params,
      '',
      '',
      false,
      '',
      Product
    );
    const response = await apiService.callAPI();
    let data: any = response.records.map((val: any) => {
      return {
        label: (
          <>
            <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
              <img
                src={val?.image || ''}
                className="p-1"
              />
            </span>
            <span className="fs-16 fw-600 text-black mb-0">
              {val?.title ? val.title : '-'}
            </span>
          </>
        ),
        value: val._id,
        id: val._id,
        title: val?.title ? val.title : '-',
      };
    });
    data.unshift({
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0"> All</span>
        </>
      ),
      value: 0,
      id: 0,
      title: 'All',
    });
    setVariantsData(data);
  };
  const handleVariants = async (event: any) => {
    let tempVariants = [...selectedVariants];
    if (Array.isArray(event)) {
      if (event.length > tempVariants.length) {
        if (
          event.some((item) => item.value === 0) ||
          event.length == variantsData.length - 1
        ) {
          tempVariants = variantsData;
        } else {
          tempVariants = event;
        }
      } else {  
        if (event.some((val: any) => val.value === 0)) {
          let temp = event.filter((val: any) => val.value !== 0);
          tempVariants = temp;
        } else if (
          !event.some((val: any) => val.value === 0) &&
          event.length == variantsData.length - 1
        ) {
          tempVariants = [];
        } else {
          tempVariants = event;
        }
      }
    } else {
      tempVariants = [event];
    }
    setSelectedVariants(tempVariants);
    setValidation(false);
    if (!event.length) {
      setValidation(true);
    }
  };
  const handleSubmit = async () => {
    if (selectedVariants.length) {
      let variants: any = [];
      selectedVariants.map((val: any) => {
        variants.push(val.id);
      });
      let params: any = {
        utcOffset: new Date().getTimezoneOffset(),
        reportFormatType: downloadAsPdf ? 'pdf' : 'excel',
      };
      const data = {
        categories: variants.filter((item: any) => item !== 0),
      };
      setLoading(true);
      let apiService = new APICallService(
        reports.allProductsReport,
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
        let fileName = 'AllProduct_Report_';
        if(downloadAsPdf){
          fileName += '.pdf';
        }else{
          fileName += '.xlsx';
        }
        downloadLink.download = fileName;
        downloadLink.click();
        props.onHide();
      } else {
        error('Whoops! Sorry, no records found for selected products.');
        // props.onHide();
      }
    } else if (selectedVariants.length === 0) {
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
                minHeight="60px"
                isLoading={fetchLoader}
                closeMenuOnSelect={false}
                isSearchable={true}
                placeholder="Select category"
                options={
                  variantsData && variantsData.length ? variantsData : []
                }
                value={selectedVariants}
                text={'categories selected'}
                hideSelectedOptions={false}
                onChange={(event: any) => {
                  handleVariants(event);
                }}
                // isClearable={selectedSeller ? true : false}
                isMulti={true}
              />
            </Col>
          </Row>
          <Row className="align-items-center mt-6 mb-2">
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
export default AllProductReportModal;
