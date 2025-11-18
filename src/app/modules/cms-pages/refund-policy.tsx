import { Button, Col, Row } from 'react-bootstrap';
import TextEditor from './text-editor';
import { cmsString, faqString } from '../../../utils/string';
import { useEffect, useState } from 'react';
import APICallService from '../../../api/apiCallService';
import { cmsPages } from '../../../api/apiEndPoints';
import Loader from '../../../Global/loader';
import { cmsToast } from '../../../utils/toast';
import { success } from '../../../Global/toast';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { languagesJSON } from '../../../utils/staticJSON';
const RefundPolicy = () => {
  const [refundData, setRefundData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [language, setLanguage] = useState(languagesJSON[0]);
  const handleDataChange = (data: any) => {
    setRefundData(data);
  };
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      await fetchData(language.value);
      setFetchLoading(false);
    })();
  }, [language]);
  const fetchData = async (language: any) => {
    setLoading(true);
    const apiService = new APICallService(
      cmsPages.getRefundPolicy,
      null,
      null,
      null,
      null,
      language
    );
    const response = await apiService.callAPI();
    if (response) {
      setRefundData(response);
    }
    setLoading(false);
  };
  const handleSave = async (data: any) => {
    setLoading(true);
    const apiService = new APICallService(
      cmsPages.addRefundPolicy,
      {
        content: data,
      },
      null,
      null,
      null,
      language.value
    );
    const response = await apiService.callAPI();
    if (response) {
      success(cmsToast.savedRefund);
    }
    setLoading(false);
  };
  const handleLanguageChange = (event: any) => {
    setLanguage(event);
  };
  return (
    <>
      <Row className="align-items-center">
        <Col
          xs={12}
          className=" align-self-center align-items-center mb-5"
        >
          <Row className="d-flex align-items-center pe-5">
            <Col
              xs={12}
              md={6}
            >
              <h1 className="fs-22 fw-bolder">{cmsString.refundTitle}</h1>
            </Col>
            <Col md={3}></Col>
            <Col
              xs={12}
              md={3}
              className="mt-3 mt-md-0"
            >
              <div>
                <CustomSelectWhite
                  isSearchable={true}
                  options={languagesJSON}
                  //   text={'sellers selected'}
                  value={language}
                  placeholder="Select Language"
                  onChange={(event: any) => {
                    handleLanguageChange(event);
                  }}
                  isDisabled={loading}
                />
              </div>
            </Col>
          </Row>
        </Col>
        {fetchLoading ? (
          <div className="d-flex justify-content-center m-4">
            <Loader loading={fetchLoading} />
          </div>
        ) : (
          <>
            {' '}
            <TextEditor
              data={refundData}
              handleDataChange={handleDataChange}
            />
            <Col
              xs="auto"
              className="pt-7"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleSave(refundData)}
                disabled={loading}
              >
                {!loading && (
                  <span className="indicator-label">{faqString.save}</span>
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
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
export default RefundPolicy;
