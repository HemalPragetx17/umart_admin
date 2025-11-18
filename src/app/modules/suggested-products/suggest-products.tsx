import { Button, Card, Col, Row } from 'react-bootstrap';
import { ContactString } from '../../../utils/string';
import { KTSVG } from '../../../umart_admin/helpers';
import Method from '../../../utils/methods';
import ThreeDot from '../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import { useEffect, useState } from 'react';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import { useNavigate } from 'react-router-dom';
import ViewInquiries from '../../modals/view-inquiries';
import APICallService from '../../../api/apiCallService';
import { contactEnquiries, suggestedProduct } from '../../../api/apiEndPoints';
import {
  BuyerFeedback,
  Customer,
  Delete,
  Edit,
  GuestFeedback,
  PAGE_LIMIT,
  SuggestProductConst,
  View,
} from '../../../utils/constants';
import Loader from '../../../Global/loader';
import { success } from '../../../Global/toast';
import DeleteModalCommon from '../../modals/delete-modal-comman';
import Pagination from '../../../Global/pagination';
import { useDebounce } from '../../../utils/useDebounce';
import { ContactEnquiries as ContactEnquiriesEnum } from '../../../utils/constants';
import { useAuth } from '../auth';
import { getKey, setKey } from '../../../Global/history';
import { suggestedProductListStoreString } from '../../../utils/storeString';
import SuggestedProductModal from '../../modals/suggestProduct';
import PermissionModal from '../../modals/permission-moda';
const SuggestedProducts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showInquiries, setShowInquiries] = useState(false);
  const [currentData, setCurrentData] = useState<any>();
  const [suggestedProducts, setSuggestedProducts] = useState<any>([]);
  const [search, setSearch] = useState<string>(
    getKey(suggestedProductListStoreString.search) || ''
  );
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageLimit, setPageLimit] = useState(
    getKey(suggestedProductListStoreString.limit) || PAGE_LIMIT
  );
  const [page, setPage] = useState(
    getKey(suggestedProductListStoreString.page) || 1
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [options, setOptions] = useState([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      if (!Method.hasModulePermission(SuggestProductConst, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchEnquiries(page, pageLimit, search);
      setFetchLoading(false);
    })();
  }, []);
  const fetchEnquiries = async (
    pageNo: number,
    limit: number,
    searchTerm: string = ''
  ) => {
    setLoading(true);
    const params = {
      limit: limit,
      pageNo: pageNo,
      needCount: true,
      sortKey: '_createdAt',
      sortOrder: -1,
      searchTerm: searchTerm ? searchTerm.trim() : '',
    };
    const apiService = new APICallService(
      suggestedProduct.listSuggestedProducts,
      params,
      '',
      '',
      false,
      '',
      SuggestProductConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setSuggestedProducts(response.records);
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
    }
    setLoading(false);
  };
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const onMenuClose = async () => {
    setId(-1);
    setShow(false);
  };
  const openMenuOnClick = async (data: any) => {
    setId(id);
    setShow(true);
  };
  const onMenuOpen = async (id: any) => {
    setId(id);
    setShow(true);
  };
  const handleOption = async (event: any, index: number, data: any) => {
    if (event.value === 1) {
      if (Method.hasPermission(Customer, View, currentUser)) {
        if (data?.user?._id) {
          navigate('/customers/customer-profile', { state: data.user });
        }
      } else {
        setShowPermissionModal(true);
      }
    } else if (event.value === 2) {
      setCurrentData(data);
      setShowDeleteModal(true);
    }
  };
  const handleInquiryShow = (data: any) => {
    setCurrentData(data);
    setShowInquiries(true);
  };
  const handleClose = () => {
    setShowInquiries(!showInquiries);
    setCurrentData(undefined);
  };
  const debounce = useDebounce(fetchEnquiries, 300);
  const handleSearch = async (value: string) => {
    value = value.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    // const regex = /^(\w+( \w+)*)? ?$/;
    // const regex = /^(\S+( \S+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(value);
    if (!isValid) {
      return;
    }
    setSearch(value);
    if (value.trim().length > 2 && search !== value) {
      setPage(1);
      setKey(suggestedProductListStoreString.page, 1);
      setLoading(true);
      setTotalRecords(0);
      setSuggestedProducts([]);
      await debounce(1, pageLimit, value);
    } else if (value.trim().length <= 2 && value.length < search.length) {
      setPage(1);
      setKey(suggestedProductListStoreString.page, 1);
      setLoading(true);
      setTotalRecords(0);
      setSuggestedProducts([]);
      await debounce(1, pageLimit, value);
    }
    setKey(suggestedProductListStoreString.search, value);
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    if (input.trim().length > 2 && !isCtrlPressed) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      setSuggestedProducts([]);
      await fetchEnquiries(page, pageLimit, input);
      setLoading(false);
    } else if (
      input.trim().length <= 2 &&
      (charCode === 46 || charCode === 8)
    ) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      setSuggestedProducts([]);
      await fetchEnquiries(page, pageLimit, input);
      setLoading(false);
    }
    if (isCtrlPressed && event.key === 'x') {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      setSuggestedProducts([]);
      await fetchEnquiries(page, pageLimit, '');
      setLoading(false);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(suggestedProductListStoreString.page, val);
    await fetchEnquiries(val, pageLimit, search);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(suggestedProductListStoreString.page, val + 1);
    await fetchEnquiries(val + 1, pageLimit, search);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(suggestedProductListStoreString.page, val - 1);
    await fetchEnquiries(val + 1, pageLimit, search);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(suggestedProductListStoreString.page, 1);
    setKey(suggestedProductListStoreString.limit, parseInt(event.target.value));
    setPageLimit(+event.target.value);
    await fetchEnquiries(1, event.target.value, search);
  };
  const deleteFeedback = async (id: string) => {
    let apiService = new APICallService(
      suggestedProduct.deletedSuggestion,
      id,
      '',
      '',
      false,
      '',
      SuggestProductConst
    );
    let response = await apiService.callAPI();
    if (response) {
      success('Feedback deleted successfully!!');
      setShowDeleteModal(false);
      await fetchEnquiries(page, pageLimit, search);
    }
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(SuggestProductConst, View, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
            {ContactString.viewProfile}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(SuggestProductConst, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {'Delete details'}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  return (
    <>
      {showPermissionModal && (
        <PermissionModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          moduleName={'Customers'}
        />
      )}
      {showInquiries && currentData ? (
        <SuggestedProductModal
          show={showInquiries}
          onHide={() => {
            handleClose();
            setCurrentData(undefined);
          }}
          inquiryData={currentData}
        />
      ) : (
        <></>
      )}
      {currentData && showDeleteModal && (
        <DeleteModalCommon
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setCurrentData(undefined);
          }}
          deleteId={currentData?._id || ''}
          handleDelete={deleteFeedback}
          flag={true}
          title={'this record'}
        />
      )}
      <Row className="align-items-center">
        <Col sm>
          <h1 className="fs-22 fw-bolder">{'Order Anything'}</h1>
        </Col>
        {!fetchLoading ? (
          <>
            <Card className="border border-r10px mt-5">
              <Card.Body className="pb-0">
                <Row>
                  <Col>
                    <div className="position-relative my-1">
                      <KTSVG
                        path="/media/icons/duotune/general/gen021.svg"
                        className="svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ps-13"
                      />
                      <input
                        type="text"
                        className="form-control form-control-custom borde-r8px bg-light w-375px ps-11"
                        name="Search Team"
                        onChange={(event: any) => {
                          handleSearch(event.target.value.trimStart());
                        }}
                        value={search}
                        placeholder={ContactString.searchPlaceholder}
                        // onKeyUp={handleOnKeyUp}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="table table-rounded table-row-bordered align-middle gy-4">
                        <thead>
                          <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                            <th className="min-w-200px">
                              {ContactString.name}
                            </th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th className="min-w-200px">
                              {ContactString.receivedOn}
                            </th>
                            <th className="min-w-200px"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <>
                              <td colSpan={5}>
                                <div className="w-100 d-flex justify-content-center">
                                  <Loader loading={loading} />
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              {suggestedProducts && suggestedProducts.length ? (
                                suggestedProducts.map(
                                  (inquiryVal: any, inquiryIndex: number) => {
                                    return (
                                      <tr>
                                        <td>
                                          <span className="fs-15 fw-500">
                                            {inquiryVal?.buyerName || ''}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="fs-15 fw-500">
                                            {inquiryVal?.title || ''}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="fs-15 fw-500">
                                            {inquiryVal?.quantity || ''}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="fs-15 fw-500">
                                            {inquiryVal._createdAt
                                              ? Method.convertDateToDDMMYYYYHHMMAMPM(
                                                  inquiryVal._createdAt
                                                )
                                              : '-'}
                                          </span>
                                        </td>
                                        <td>
                                          <div className="my-0 ms-5 float-end">
                                            {Method.hasPermission(
                                              SuggestProductConst,
                                              View,
                                              currentUser
                                            ) ||
                                            Method.hasPermission(
                                              SuggestProductConst,
                                              Delete,
                                              currentUser
                                            ) ? (
                                              <CustomSelectTable
                                                marginLeft={'-110px'}
                                                width={'auto'}
                                                placeholder={
                                                  <img
                                                    className="img-fluid"
                                                    width={22}
                                                    height={6}
                                                    src={ThreeDot}
                                                    alt=""
                                                  />
                                                }
                                                options={options}
                                                backgroundColor="white"
                                                // show={show && index === id}
                                                onMenuClose={() => {
                                                  onMenuClose();
                                                }}
                                                openMenuOnClick={(
                                                  data: any
                                                ) => {
                                                  openMenuOnClick(data);
                                                }}
                                                onMenuOpen={(id: any) => {
                                                  onMenuOpen(id);
                                                }}
                                                onChange={(
                                                  event: any,
                                                  index: number,
                                                  data: any
                                                ) => {
                                                  handleOption(
                                                    event,
                                                    index,
                                                    inquiryVal
                                                  );
                                                }}
                                                isOptionDisabled={(
                                                  option: any
                                                ) =>
                                                  option.value === 2 &&
                                                  inquiryVal.type ===
                                                    GuestFeedback
                                                }
                                              />
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                          <div className="float-end">
                                            {Method.hasPermission(
                                              SuggestProductConst,
                                              View,
                                              currentUser
                                            ) ? (
                                              <Button
                                                onClick={() =>
                                                  handleInquiryShow(inquiryVal)
                                                }
                                                variant="primary"
                                                className="btn-md fs-14 fw-600"
                                              >
                                                {ContactString.viewMessage}
                                              </Button>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan={5}>
                                      <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                        No Data found
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )}{' '}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {!loading && totalRecords > 0 ? (
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
          <div className="w-100 d-flex justify-content-center">
            <Loader loading={fetchLoading} />
          </div>
        )}
      </Row>
    </>
  );
};
export default SuggestedProducts;
