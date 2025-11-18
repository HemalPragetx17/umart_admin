import { Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { DeliverString, String } from '../../../../utils/string';
import { useEffect, useState } from 'react';
import { customers } from '../../../../utils/dummyJSON';
import {
  Add,
  Delete,
  Edit,
  Master,
  PAGE_LIMIT,
  View,
} from '../../../../utils/constants';
import APICallService from '../../../../api/apiCallService';
import { deliveryUser } from '../../../../api/apiEndPoints';
import { deliveryUserJSON } from '../../../../api/apiJSON/deliveryUser';
import Loader from '../../../../Global/loader';
import Pagination from '../../../../Global/pagination';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import DeleteUserModal from '../../../modals/delete-user';
import Method from '../../../../utils/methods';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import { useAuth } from '../../auth';
import { DeliveryUser as DeliverUserEnum } from '../../../../utils/constants';
import { listDeliveryUsers } from '../../../../utils/storeString';
const DeliveryUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [deliveryUsers, setDeliveryUsers] = useState<any>([]);
  const [page, setPage] = useState(getKey(listDeliveryUsers.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listDeliveryUsers.limit) || PAGE_LIMIT
  );
  const [fetchLoader, setFetchLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [customerActivation, setCustomerActivation] = useState(
    customers.map((customer) => customer.check === 'true')
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<any>(undefined);
  const [error, setError] = useState<any>();
  const [options, setOptions] = useState<any>();
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(DeliverUserEnum, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchDeliveryUsers(page, pageLimit);
      removeKey('deliveryUser');
      removeKey(listDeliveryUsers.deliveriesLimit);
      removeKey(listDeliveryUsers.deliveriesPage);
      removeKey(listDeliveryUsers.tab);
      setLoading(false);
      setTimeout(() => {
        const pos = getKey(listDeliveryUsers.scrollPosition);
        window.scrollTo(0, pos);
      }, 600);
    })();
  }, []);
  const fetchDeliveryUsers = async (pageNo: number, limit: number) => {
    setLoading(true);
    let params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      date: Method.getTodayDate('YYYY-MM-DD'),
    };
    let apiService = new APICallService(
      deliveryUser.listDeliveryUser,
      deliveryUserJSON.listDriver(params),
      '',
      '',
      false,
      '',
      DeliverUserEnum
    );
    let response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      }
      setDeliveryUsers(response.records);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(DeliverUserEnum, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            {DeliverString.editDeliveryUser}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(DeliverUserEnum, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {DeliverString.delete}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const handleToggleActivation = (index: any) => {
    const temp: any = [...customerActivation];
    temp[index] = !temp[index];
    setCustomerActivation(temp);
  };
  const handleStatus = async (id: string, status: boolean, index: number) => {
    setIsDisabled(true);
    let temp: any = [...deliveryUsers];
    let apiService = new APICallService(
      deliveryUser.updateStatus,
      deliveryUserJSON.updateStatus({ active: !status }),
      {
        id: id,
      },
      '',
      false,
      '',
      DeliverUserEnum
    );
    let response = await apiService.callAPI();
    if (response) {
      temp[index].active = !status;
      if (status) {
        success(masterToast.deactivatedDeliveryUser);
      } else {
        success(masterToast.activatedDeliveryUser);
      }
    }
    setDeliveryUsers(temp);
    setIsDisabled(false);
  };
  const handleCustomerProfile = async (customVal: any) => {
    setKey(listDeliveryUsers.scrollPosition, window.scrollY.toString());
    navigate('/master/delivery-users/profile', {
      state: customVal._id,
    });
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listDeliveryUsers.page, val);
    await fetchDeliveryUsers(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listDeliveryUsers.page, val + 1);
    await fetchDeliveryUsers(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listDeliveryUsers.page, val - 1);
    await fetchDeliveryUsers(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listDeliveryUsers.page, 1);
    await setPageLimit(parseInt(event.target.value));
    setKey(listDeliveryUsers.limit, parseInt(event.target.value));
    await fetchDeliveryUsers(1, event.target.value);
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
      deliveryUser.deleteDeliveryUser,
      id,
      '',
      '',
      true,
      '',
      DeliverUserEnum
    );
    const response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteDeliveryUser);
      setShowDeleteModal(false);
      fetchDeliveryUsers(page, pageLimit);
      setDeleteUser(undefined);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  const handleOption = async (event: any, index: number, data: any) => {
    if (event.value === 1) {
      setKey(listDeliveryUsers.scrollPosition, window.scrollY.toString());
      navigate('/master/delivery-users/edit-delivery-user', { state: data });
    } else if (event.value === 2) {
      setDeleteUser(data);
      setShowDeleteModal(true);
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
          <h1 className="fs-22 fw-bolder mb-0">{DeliverString.title}</h1>
        </Col>
        {loading ? (
          <></>
        ) : deliveryUsers.length > 0 ? (
          <Col
            xs={'auto'}
            className="text-right mb-5"
          >
            {Method.hasPermission(DeliverUserEnum, Add, currentUser) ? (
              <Link
                to="/master/delivery-users/add-delivery-user"
                className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
              >
                {DeliverString.addNew}
              </Link>
            ) : (
              <></>
            )}
          </Col>
        ) : (
          <Col lg={12}>
            <div className="border border-r10px p-md-9 p-7">
              <h2 className="fs-22 fw-bold">Start adding drivers!</h2>
              <p className="fs-18 fw-500">
                You can add drivers and manage them.
              </p>
              <Link
                to="/master/delivery-users/add-delivery-user"
                className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
              >
                {DeliverString.addNew}
              </Link>
            </div>
          </Col>
        )}
        {loading ? (
          <div className="d-flex justify-content-center ">
            <Loader loading={loading} />
          </div>
        ) : (
          <>
            {deliveryUsers.length > 0 ? (
              <Col lg={12}>
                <>
                  <Card className="border border-r10px">
                    <Card.Body className=" pb-0">
                      <div className="table-responsive">
                        <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                          <thead>
                            <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                              <th className="min-w-275px">
                                {DeliverString.name}
                              </th>
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
                                {deliveryUsers.length ? (
                                  <>
                                    {deliveryUsers.map(
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
                                                        DeliverUserEnum,
                                                        Edit,
                                                        currentUser
                                                      ) || isDisabled
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
                                                    DeliverUserEnum,
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
                                                      {
                                                        DeliverString.viewDetails
                                                      }
                                                    </button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {/* <div className="my-0 pe-2"> */}
                                                  {Method.hasPermission(
                                                    DeliverUserEnum,
                                                    Edit,
                                                    currentUser
                                                  ) ||
                                                  Method.hasPermission(
                                                    DeliverUserEnum,
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
                                                        openMenuOnClick(
                                                          customIndex
                                                        );
                                                      }}
                                                      onMenuOpen={() => {
                                                        onMenuOpen(customIndex);
                                                      }}
                                                      onChange={(
                                                        event: any
                                                      ) => {
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
                                        {/* {Customers.noData} */}
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
                  {!loading ? (
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
            ) : (
              <></>
            )}
          </>
        )}
      </Row>
    </>
  );
};
export default DeliveryUser;
