import { Button, Col, Row } from 'react-bootstrap';
import TextEditor from './text-editor';
import { cmsString, faqString } from '../../../utils/string';
import { useEffect, useState } from 'react';
import APICallService from '../../../api/apiCallService';
import { cmsPages } from '../../../api/apiEndPoints';
import Loader from '../../../Global/loader';
import { success } from '../../../Global/toast';
import { cmsToast } from '../../../utils/toast';
import { useAuth } from '../auth';
import Method from '../../../utils/methods';
import { Add, CmsPages, Delete, Edit } from '../../../utils/constants';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { languagesJSON } from '../../../utils/staticJSON';
const TermsConditions = () => {
  const [termsData, setTermsData] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [fetchLoading, setFetchLoading] = useState(true);
    const [language, setLanguage] = useState(languagesJSON[0]);

  const handleDataChange = (data: any) => {
    setTermsData(data);
  };
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasModulePermission(CmsPages, currentUser)) {
        return window.history.back();
      }
      await fetchData(language.value);
      setFetchLoading(false);
    })();
  }, [language]);
  const fetchData = async (language:any) => {
    setLoading(true);
    const apiService = new APICallService(
      cmsPages.getTermsAndCondition,
      null,
      null,
      null,
      null,
      language
    );
    const response = await apiService.callAPI();
    if (response) {
      setTermsData(response);
    }
    setLoading(false);
  };
  const handleSave = async (data: any) => {
    setLoading(true);
    const apiService = new APICallService(cmsPages.addTermAndConditions, {
      content: data,
    },
    null,
    null,
    null,
    language.value
  );
    const response = await apiService.callAPI();
    if (response) {
      success(cmsToast.savedTermAndCond);
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
              <h1 className="fs-22 fw-bolder">{cmsString.termsTitle}</h1>
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
              data={termsData}
              handleDataChange={handleDataChange}
            />
            <Col
              xs="auto"
              className="pt-7"
            >
              {Method.hasPermission(CmsPages, Add, currentUser) ||
              Method.hasPermission(CmsPages, Edit, currentUser) ||
              Method.hasPermission(CmsPages, Delete, currentUser) ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleSave(termsData)}
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
              ) : (
                <></>
              )}
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
export default TermsConditions;
