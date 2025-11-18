import { Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Customers, DeliverString, String } from '../../../../utils/string';
import { useEffect, useState } from 'react';
import { customers } from '../../../../utils/dummyJSON';
import {
  Add,
  Delete,
  Edit,
  PAGE_LIMIT,
  PickerConst,
  View,
} from '../../../../utils/constants';
import APICallService from '../../../../api/apiCallService';
import { deliveryUser, pickerEndPoints } from '../../../../api/apiEndPoints';
import { deliveryUserJSON } from '../../../../api/apiJSON/deliveryUser';
import Loader from '../../../../Global/loader';
import Pagination from '../../../../Global/pagination';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import DeleteUserModal from '../../../modals/delete-user';
import Method from '../../../../utils/methods';
import { setKey } from '../../../../Global/history';
import { useAuth } from '../../auth';
import { DeliveryUser as DeliverUserEnum } from '../../../../utils/constants';
import { listDeliveryUsers } from '../../../../utils/storeString';
import { KTSVG } from '../../../../umart_admin/helpers';
import { useDebounce } from '../../../../utils/useDebounce';
const AllPicker = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [pickersList, setPickersList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<any>(undefined);
  const [error, setError] = useState<any>();
  const [options, setOptions] = useState<any>();
  const [isDisabled, setIsDisabled] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(PickerConst, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchPickers(page, pageLimit);
      // removeKey('deliveryUser');
      // removeKey(listDeliveryUsers.deliveriesLimit);
      // removeKey(listDeliveryUsers.deliveriesPage);
      // removeKey(listDeliveryUsers.tab);
      setLoading(false);
      // setTimeout(() => {
      //   const pos = getKey(listDeliveryUsers.scrollPosition);
      //   window.scrollTo(0, pos);
      // }, 600);
    })();
  }, []);
  const fetchPickers = async (pageNo: number, limit: number, search = '') => {
    setLoading(true);
    let params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      needCount: pageNo === 1,
      searchTerm: search || '',
    };
    let apiService = new APICallService(
      pickerEndPoints.listPicker,
      params,
      '',
      '',
      false,
      '',
      PickerConst
    );
    let response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      }
      setPickersList(response.records);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(PickerConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            {'Edit picker'}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(PickerConst, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {'Delete picker'}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const handleStatus = async (id: string, status: boolean, index: number) => {
    setIsDisabled(id);
    let temp: any = [...pickersList];
    let apiService = new APICallService(
      pickerEndPoints.updateStatus,
      deliveryUserJSON.updateStatus({ active: !status }),
      {
        id: id,
      },
      '',
      false,
      '',
      PickerConst
    );
    let response = await apiService.callAPI();
    if (response) {
      temp[index].active = !status;
      if (status) {
        success(masterToast.deactivatedPikcer);
      } else {
        success(masterToast.activatedPicker);
      }
    }
    setPickersList(temp);
    setIsDisabled('');
  };
  const handleCustomerProfile = async (customVal: any) => {
    // setKey(listDeliveryUsers.scrollPosition, window.scrollY.toString());
    navigate('/master/pickers/picker-details', {
      state: customVal._id,
    });
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    // setKey(listDeliveryUsers.page, val);
    await fetchPickers(val, pageLimit, searchTerm);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    // setKey(listDeliveryUsers.page, val + 1);
    await fetchPickers(val + 1, pageLimit, searchTerm);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    // setKey(listDeliveryUsers.page, val - 1);
    await fetchPickers(val - 1, pageLimit, searchTerm);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    // setKey(listDeliveryUsers.page, 1);
    setPageLimit(parseInt(event.target.value));
    // setKey(listDeliveryUsers.limit, parseInt(event.target.value));
    await fetchPickers(1, event.target.value, searchTerm);
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
  const handleDeleteUser = async (id: string) => {
    const apiService = new APICallService(
      pickerEndPoints.delete,
      id,
      '',
      '',
      true,
      '',
      PickerConst
    );
    const response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deletePicker);
      setShowDeleteModal(false);
      setPage(1);
      fetchPickers(1, pageLimit);
      setDeleteUser(undefined);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  const handleOption = async (event: any, index: number, data: any) => {
    if (event.value === 1) {
      setKey(listDeliveryUsers.scrollPosition, window.scrollY.toString());
      navigate('/master/pickers/edit-picker', { state: data });
    } else if (event.value === 2) {
      setDeleteUser(data);
      setShowDeleteModal(true);
    }
  };
  const debounce = useDebounce(fetchPickers, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    // const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearchTerm(input);
    setPage(1);
    if (input.trim().length > 2 && searchTerm !== input) {
      await debounce(1, pageLimit, input);
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      await debounce(1, pageLimit, input);
    }
  };
  return (
    <>
      {showDeleteModal && deleteUser && (
        <DeleteUserModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setDeleteUser(undefined);
            setError(undefined);
          }}
          deleteId={deleteUser._id}
          title={deleteUser.name}
          handleDelete={handleDeleteUser}
          error={error}
        />
      )}
      <Row className="align-items-center">
        <Col
          xs
          className="align-self-center my-6"
        >
          <h1 className="fs-22 fw-bolder mb-0">{'Pickers'}</h1>
        </Col>
        <Col
          xs={'auto'}
          className="text-right mb-5"
        >
          {Method.hasPermission(PickerConst, Add, currentUser) ? (
            <Link
              to="/master/pickers/add-picker"
              className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
            >
              {'Add new picker'}
            </Link>
          ) : (
            <></>
          )}
        </Col>
        <Col
          xs={12}
          className="mt-1"
        >
          <Card className="bg-light border mb-7">
            <Card.Body className="px-7 py-4">
              <Row className="align-items-center py-3">
                <Col
                  lg={4}
                  md={4}
                  sm={12}
                >
                  {/* <FormLabel className="fs-16 fw-500 text-dark min-h-md-25px">
                  {''}
                </FormLabel>{' '} */}
                  <div className="position-relative  mt-1">
                    <KTSVG
                      path="/media/icons/duotune/general/gen021.svg"
                      className="svg-icon-3 position-absolute ps-13 top-50 translate-middle"
                    />
                    <input
                      type="text"
                      // disabled={initLoader}
                      id="kt_filter_search"
                      className="form-control form-control-white form-control-lg min-h-60px ps-10"
                      placeholder="Search by picker name"
                      onChange={(event: any) => {
                        handleSearch(event.target.value);
                      }}
                      // onKeyUp={handleOnKeyUp}
                      value={searchTerm}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <>
            <Card className="border border-r10px">
              <Card.Body className=" pb-0">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom align-middle">
                        <th className="min-w-275px">{DeliverString.name}</th>
                        <th className="min-w-175px">
                          {DeliverString.phoneNumber}
                        </th>
                        <th className="min-w-175px text-center">
                          {DeliverString.activate} /<br />{' '}
                          {DeliverString.deactivate}
                        </th>
                        <th className="min-w-50px text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <>
                          <td colSpan={4}>
                            <div className="w-100 d-flex justify-content-center">
                              <Loader loading={loading} />
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {pickersList.length ? (
                            <>
                              {pickersList.map(
                                (customVal: any, customIndex: number) => {
                                  return (
                                    <tr key={customVal._id}>
                                      <td>
                                        <div className="d-inline-flex align-items-center">
                                          <div className="symbol symbol-40px border border-r10px me-4">
                                            <img
                                              className="img-fluid border-r8px object-fit-contain"
                                              src={customVal.image}
                                              alt=""
                                            />
                                          </div>
                                          <span className="fs-15 fw-600 ms-3">
                                            {customVal.name}
                                            <br />
                                            <span className=" fw-semibold  d-block fs-6">
                                              {customVal.email}
                                            </span>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="fs-15 fw-600">
                                          {String.countryCode +
                                            ' ' +
                                            customVal.phone}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center">
                                          <label className="form-check form-switch form-check-custom form-check-solid ">
                                            <input
                                              className="form-check-input form-check-success w-50px h-30px "
                                              type="checkbox"
                                              name="notifications"
                                              checked={customVal.active}
                                              disabled={
                                                !Method.hasPermission(
                                                  PickerConst,
                                                  Edit,
                                                  currentUser
                                                ) ||
                                                isDisabled === customVal?._id
                                              }
                                              onChange={() => {
                                                handleStatus(
                                                  customVal._id,
                                                  customVal.active,
                                                  customIndex
                                                );
                                              }}
                                            />
                                          </label>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="my-0">
                                          <div className="d-flex flex-nowrap justify-content-end align-items-center">
                                            {Method.hasPermission(
                                              PickerConst,
                                              View,
                                              currentUser
                                            ) ? (
                                              <button
                                                className="btn btn-primary fs-14 fw-600 me-5"
                                                style={{
                                                  whiteSpace: 'nowrap',
                                                }}
                                                onClick={() => {
                                                  handleCustomerProfile(
                                                    customVal
                                                  );
                                                }}
                                              >
                                                {DeliverString.viewDetails}
                                              </button>
                                            ) : (
                                              <></>
                                            )}
                                            {/* <div className="my-0 pe-2"> */}
                                            {Method.hasPermission(
                                              PickerConst,
                                              Edit,
                                              currentUser
                                            ) ||
                                            Method.hasPermission(
                                              PickerConst,
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
                                                    height={5}
                                                    src={ThreeDotMenu}
                                                    alt=""
                                                  />
                                                }
                                                options={options}
                                                backgroundColor="white"
                                                onMenuClose={() => {
                                                  onMenuClose();
                                                }}
                                                openMenuOnClick={() => {
                                                  openMenuOnClick(customIndex);
                                                }}
                                                onMenuOpen={() => {
                                                  onMenuOpen(customIndex);
                                                }}
                                                onChange={(event: any) => {
                                                  handleOption(
                                                    event,
                                                    customIndex,
                                                    customVal
                                                  );
                                                }}
                                              />
                                            ) : (
                                              <></>
                                            )}
                                            {/* </div> */}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={4}>
                                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                  {Customers.noData}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
            {!loading && pickersList.length > 0 ? (
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
        </Col>
      </Row>
    </>
  );
};
export default AllPicker;
