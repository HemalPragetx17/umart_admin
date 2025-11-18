import { Button, Card, Col, Row } from 'react-bootstrap';
import { KTSVG } from '../../../../umart_admin/helpers';
import { faqString } from '../../../../utils/string';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import { useEffect, useState } from 'react';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import { useNavigate } from 'react-router-dom';
import AddFaqs from '../../../modals/add-faqs';
import APICallService from '../../../../api/apiCallService';
import { cmsPages } from '../../../../api/apiEndPoints';
import {
  Add,
  CmsPages,
  Delete,
  Edit,
  PAGE_LIMIT,
} from '../../../../utils/constants';
import Loader from '../../../../Global/loader';
import Pagination from '../../../../Global/pagination';
import DeleteModalCommon from '../../../modals/delete-modal-comman';
import { success } from '../../../../Global/toast';
import { cmsToast } from '../../../../utils/toast';
import { useDebounce } from '../../../../utils/useDebounce';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
const Faqs = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [faqModal, setShowFaqModal] = useState(false);
  const [faqModalTitle, setFaqModalTitle] = useState('');
  const [search, setSearch] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [faqsData, setFaqsData] = useState<any>([]);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(1);
  const [currentFaq, setCurrentFaq] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [options, setOptions] = useState<any>([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasModulePermission(CmsPages, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchFaq(1, pageLimit, search);
      setFetchLoading(false);
    })();
  }, []);
  const fetchFaq = async (
    pageNo: number,
    limit: number,
    search: string = ''
  ) => {
    setLoading(true);
    const params = {
      page: pageNo,
      limit: limit,
      needCount: pageNo === 1,
      searchTerm: search,
      sortKey: '-1',
      sortOrder: '_createdAt',
    };
    const apiService = new APICallService(cmsPages.getFaqList, params);
    const response = await apiService.callAPI();
    if (response && response.records) {
      if (pageNo === 1) {
        // if (totalRecords === -1) {
        //   setIsFirst(false);
        // }
        setTotalRecords(response.total);
      } else {
        let prevTotal = totalRecords;
        setTotalRecords(prevTotal);
      }
      setFaqsData(response.records);
    } else {
      setFaqsData([]);
    }
    setLoading(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    await fetchFaq(val, pageLimit, search);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchFaq(val + 1, pageLimit, search);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchFaq(val - 1, pageLimit, search);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(event.target.value);
    await fetchFaq(1, event.target.value, search);
  };
  const openMenuOnClick = async (data: any) => {
    setId(id);
    setShow(true);
  };
  const onMenuClose = async () => {
    setId(-1);
    setShow(false);
  };
  const onMenuOpen = async (id: any) => {
    setId(id);
    setShow(true);
  };
  const handleOption = async (event: any, index: number, data: any) => {
    if (event.value === 1) {
      setCurrentFaq(data);
      setShowFaqModal(true);
      setFaqModalTitle('Edit');
      //   navigate('', { state: data });
    } else if (event.value === 2) {
      setCurrentFaq(data);
      setShowDeleteModal(true);
    }
  };
  const debounce = useDebounce(fetchFaq, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    //const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearch(input);
    if (input.trim().length > 2 && search !== input) {
      setPage(1);
      await debounce(1, pageLimit, input);
    } else if (input.trim().length <= 2 && input.length < search.length) {
      setPage(1);
      await debounce(1, pageLimit, input);
    }
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    setPage(1);
    if (input.trim().length > 2 && !isCtrlPressed) {
      await fetchFaq(1, pageLimit, input);
    } else if (
      input.trim().length <= 2 &&
      (charCode === 46 || charCode === 8)
    ) {
      await fetchFaq(1, pageLimit, input);
    }
    if (isCtrlPressed && event.key === 'x') {
      await fetchFaq(1, pageLimit, input);
    }
  };
  const deleteFaq = async (id: string) => {
    let apiService = new APICallService(cmsPages.deleteFaq, id);
    let response = await apiService.callAPI();
    if (response) {
      success(cmsToast.faqDeleted);
      setCurrentFaq(undefined);
      setShowDeleteModal(false);
      await fetchFaq(page, pageLimit, search);
    }
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(CmsPages, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            {faqString.edit}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(CmsPages, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {faqString.delete}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  return (
    <>
      {faqModal && (
        <AddFaqs
          show={faqModal}
          title={faqModalTitle}
          question={currentFaq?.question || ''}
          answer={currentFaq?.answer || ''}
          id={currentFaq?._id || ''}
          handleClose={() => {
            setShowFaqModal(false);
            setCurrentFaq(undefined);
          }}
          onHide={async () => {
            setShowFaqModal(false);
            setCurrentFaq(undefined);
            await fetchFaq(1, pageLimit, search);
          }}
        />
      )}
      {showDeleteModal && currentFaq && (
        <DeleteModalCommon
          show={showDeleteModal}
          onHide={() => {
            setCurrentFaq(undefined);
            setShowDeleteModal(false);
          }}
          deleteId={currentFaq._id}
          handleDelete={deleteFaq}
          title="this Faq"
        />
      )}
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center mb-5"
        >
          <h1 className="fs-22 fw-bolder">{faqString.faq}</h1>
        </Col>
        {!fetchLoading ? (
          <Col
            md={'auto'}
            className="text-right mb-5"
          >
            {Method.hasPermission(CmsPages, Add, currentUser) ? (
              <Button
                onClick={() => {
                  setShowFaqModal(true);
                  setFaqModalTitle('Add');
                }}
                className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
              >
                {faqString.addMoreFaq}
              </Button>
            ) : (
              <></>
            )}
          </Col>
        ) : (
          <></>
        )}
        <Row>
          <Col
            lg={12}
            className="mt-2"
          >
            {!fetchLoading ? (
              <>
                <Card className="border">
                  <Card.Body>
                    <div className="position-relative my-1">
                      <KTSVG
                        path="/media/icons/duotune/general/gen021.svg"
                        className="svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ps-13"
                      />
                      <input
                        type="text"
                        className="form-control form-control-custom borde-r8px bg-light w-lg-375px w-md-375px w-sm-150px ps-11"
                        name="Search Team"
                        placeholder={faqString.search}
                        onChange={(e: any) => handleSearch(e.target.value)}
                        //  onKeyUp={handleOnKeyUp}
                        value={search}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                        <thead>
                          <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                            <th className="min-w-425px">
                              {faqString.question}
                            </th>
                            <th className="min-w-425px">{faqString.answer}</th>
                            <th className="w-75px text-end"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={3}>
                                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                  <Loader loading={loading} />
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <>
                              {faqsData.length ? (
                                <>
                                  {faqsData.map((faqVal: any, index: any) => (
                                    <tr>
                                      <td>
                                        <span className="fs-15 fw-500">
                                          {faqVal.question}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-500">
                                          {faqVal.answer}
                                        </span>
                                      </td>
                                      <td className="text-end">
                                        {Method.hasPermission(
                                          CmsPages,
                                          Edit,
                                          currentUser
                                        ) ||
                                        Method.hasPermission(
                                          CmsPages,
                                          Delete,
                                          currentUser
                                        ) ? (
                                          <div className="my-0 pe-2">
                                            <CustomSelectTable
                                              marginLeft={'-100px'}
                                              width={'auto'}
                                              placeholder={
                                                <img
                                                  className="img-fluid"
                                                  width={23}
                                                  height={6}
                                                  src={ThreeDotMenu}
                                                  alt=""
                                                />
                                              }
                                              options={options}
                                              backgroundColor="white"
                                              //   show={show && index === id}
                                              onMenuClose={() => {
                                                onMenuClose();
                                              }}
                                              openMenuOnClick={() => {
                                                // openMenuOnClick(index);
                                              }}
                                              onMenuOpen={() => {
                                                // onMenuOpen(index);
                                              }}
                                              onChange={(event: any) => {
                                                handleOption(
                                                  event,
                                                  index,
                                                  faqVal
                                                );
                                              }}
                                              // isOptionDisabled={(option: any) =>
                                              //   option.value === 2
                                              // }
                                            />
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <tr>
                                    <td colSpan={3}>
                                      <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                        No Data found
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
                {totalRecords > 0 ? (
                  <Pagination
                    totalRecords={totalRecords}
                    currentPage={page}
                    handleCurrentPage={handleCurrentPage}
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                    handlePageLimit={handlePageLimit}
                    pageLimit={pageLimit}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                <Loader loading={fetchLoading} />
              </div>
            )}
          </Col>
        </Row>
      </Row>
    </>
  );
};
export default Faqs;
