import { Card, Col, Row } from 'react-bootstrap';
import Pagination from '../../../../Global/pagination';
import { Link, useNavigate } from 'react-router-dom';
import { String, UserString } from '../../../../utils/string';
import { KTSVG } from '../../../../umart_admin/helpers';
import { useEffect, useState } from 'react';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import DeleteModal from '../../../modals/delete-user-modal';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import { masterToast } from '../../../../utils/toast';
import { success } from '../../../../Global/toast';
import {
  Add,
  Delete,
  Edit,
  Master,
  PAGE_LIMIT,
  UserManagement,
} from '../../../../utils/constants';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import { useDebounce } from '../../../../utils/useDebounce';
const ViewUserDetails = () => {
  const navigate = useNavigate();
  const { currentUser: currentLoginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [defaultKey, setDefault] = useState('0');
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [id, setId] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [users, setUser] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT);
  const [currentUser, setCurrentUser] = useState<any>(undefined);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(UserManagement, currentLoginUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchUser(page, pageLimit);
      setLoading(false);
    })();
  }, []);
  const fetchUser = async (
    pageNo: number,
    limit: number,
    searchTerm: string = ''
  ) => {
    setLoading(true);
    const params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      needCount: pageNo === 1,
      searchTerm: searchTerm,
    };
    let apiService = new APICallService(master.getUsers, params,'','',false,'',UserManagement);
    let response = await apiService.callAPI();
    if (response) {
      if (pageNo === 1) {
        setTotalRecords(response.total);
      } else {
        let prevTotal = totalRecords;
        setTotalRecords(prevTotal);
      }
      setUser(response.records);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(UserManagement, Edit, currentLoginUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
            {UserString.editUser}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(UserManagement, Delete, currentLoginUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {UserString.delete}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const handleToggleActivation = async (user: any, index: number) => {
    const apiService = new APICallService(
      master.updateUserStatus,
      {
        active: `${user.active === true ? 'false' : 'true'}`,
      },
      { id: user._id },
      '',
      false,
      '',
      UserManagement
    );
    const response = await apiService.callAPI();
    if (response) {
      if (user.active) {
        success(masterToast.userDeactivated);
      } else {
        success(masterToast.userActivated);
      }
      const temp: any = [...users];
      temp[index].active = !user.active;
      setUser(temp);
      // fetchUser(pageNo, limit);
    }
  };
  const handleClick = (event: any) => {
    if (event === defaultKey) {
      setDefault('');
    } else {
      setDefault(event);
    }
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
      navigate('/master/user-management/edit-new-user', { state: data });
    } else if (event.value === 2) {
      setCurrentUser(data);
      setShowDeleteModal(true);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    await fetchUser(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    await fetchUser(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    await fetchUser(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    await setPageLimit(parseInt(event.target.value));
    await fetchUser(1, event.target.value);
  };
  const debounce = useDebounce(fetchUser, 300);
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
    if (input.trim().length > 2 && searchTerm !== input) {
      await debounce(1, pageLimit, input);
      //await fetchProducts(1, pageLimit, productState, categories, input);
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      await debounce(1, pageLimit, input);
      // await fetchProducts(1, pageLimit, productState, categories, input);
    }
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    setPage(1);
    if (input.trim().length > 2 && !isCtrlPressed) {
      await fetchUser(1, pageLimit, input);
    } else if (
      input.trim().length <= 2 &&
      (charCode === 46 || charCode === 8)
    ) {
      await fetchUser(1, pageLimit, input);
    }
    if (isCtrlPressed && event.key === 'x') {
      // setSearch('');
      await fetchUser(1, pageLimit, input);
    }
  };
  const handleDelete = async (id: string) => {
    const apiService = new APICallService(master.deleteUser, id,'','',false,'',UserManagement);
    const response = await apiService.callAPI();
    if (response) {
      success(masterToast.userDeleted);
      setShowDeleteModal(false);
      fetchUser(page, pageLimit);
    }
  };
  return (
    <>
      {currentUser && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          onHide={handleCloseDeleteModal}
          // editData={editActivityData}
          handleDelete={handleDelete}
          selectedUser={currentUser}
        />
      )}
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center mb-5"
        >
          <h1 className="fs-22 fw-bolder mb-0">{UserString.title}</h1>
        </Col>
        {Method.hasModulePermission(UserManagement, currentLoginUser) ? (
          <>
            {' '}
            <Col
              md={'auto'}
              className="text-right mb-5"
            >
              {Method.hasPermission(UserManagement, Add, currentLoginUser) ? (
                <Link
                  to="/master/user-management/add-new-user"
                  className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
                >
                  {UserString.addNewUsers}
                </Link>
              ) : (
                <></>
              )}
            </Col>
            <Row className="pe-0">
              <Col lg={12}>
                <Card className="border">
                  <Card.Body>
                    <div className="position-relative my-1">
                      <KTSVG
                        path="/media/icons/duotune/general/gen021.svg"
                        className="svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ps-13"
                      />
                      <input
                        type="text"
                        className="form-control form-control-custom border-r8px bg-light w-375px ps-11"
                        name="Search Team"
                        placeholder={UserString.search}
                        value={searchTerm}
                        onChange={(event: any) => {
                          handleSearch(event.target.value);
                        }}
                        // onKeyUp={handleOnKeyUp}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                        <thead>
                          <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                            <th className="min-w-275px">{UserString.name}</th>
                            <th className="min-w-175px">
                              {UserString.phoneNumber}
                            </th>
                            <th className="min-w-175px text-center ">
                              {UserString.userRole}
                            </th>
                            <th className="min-w-175px text-center">
                              {UserString.activate} /<br />{' '}
                              {UserString.deactivate}
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
                              {users && users.length ? (
                                <>
                                  {users.map(
                                    (customVal: any, customIndex: number) => {
                                      return (
                                        <tr>
                                          <td>
                                            <div className="d-flex align-items-center flex-row">
                                              <div className="symbol symbol-50px border">
                                                <img
                                                  className="img-fluid border-r8px object-fit-contain"
                                                  src={customVal.image}
                                                  alt=""
                                                />
                                              </div>
                                              <span className="fs-15 fw-600 ms-3">
                                                {customVal.name}
                                                <br />
                                                <span className=" fw-semibold d-block fs-7">
                                                  {customVal.email}
                                                </span>
                                              </span>
                                            </div>
                                          </td>
                                          <td>
                                            <span className="fs-15 fw-600">
                                              {String.countryCode +
                                                ' ' +
                                                customVal?.phone || 'NA'}
                                            </span>
                                          </td>
                                          <td>
                                            <div className="d-flex justify-content-center">
                                              <span className="badge badge-light custom-badge">
                                                {customVal?.roleAndPermission
                                                  .name || 'NA'}
                                              </span>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex justify-content-center">
                                              <label className="form-check form-switch form-check-custom form-check-solid ">
                                                <input
                                                  className="form-check-input form-check-success w-50px h-30px "
                                                  type="checkbox"
                                                  name="notifications"
                                                  disabled={
                                                    !Method.hasPermission(
                                                      UserManagement,
                                                      Edit,
                                                      currentLoginUser
                                                    )
                                                  }
                                                  onChange={() =>
                                                    handleToggleActivation(
                                                      customVal,
                                                      customIndex
                                                    )
                                                  }
                                                  checked={customVal.active}
                                                />
                                              </label>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="my-0">
                                              {Method.hasPermission(
                                                UserManagement,
                                                Edit,
                                                currentLoginUser
                                              ) ||
                                              Method.hasPermission(
                                                UserManagement,
                                                Delete,
                                                currentLoginUser
                                              ) ? (
                                                <CustomSelectTable
                                                  marginLeft={'-110px'}
                                                  width={'auto'}
                                                  placeholder={
                                                    <img
                                                      className="img-fluid"
                                                      width={23}
                                                      height={7}
                                                      src={ThreeDotMenu}
                                                      alt=""
                                                    />
                                                  }
                                                  options={options}
                                                  backgroundColor="white"
                                                  show={
                                                    show && customIndex === id
                                                  }
                                                  onMenuClose={() => {
                                                    onMenuClose();
                                                  }}
                                                  openMenuOnClick={() => {
                                                    openMenuOnClick(
                                                      customIndex
                                                    );
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
                                      {'No data found'}
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
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
};
export default ViewUserDetails;
