import { useEffect, useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import Email from '../../../../umart_admin/assets/media/svg_uMart/email.svg';
import PhoneCall from '../../../../umart_admin/assets/media/svg_uMart/phone-call.svg';
import defaultImg from '../../../../umart_admin/assets/media/default.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DeliverString, String } from '../../../../utils/string';
import Loader from '../../../../Global/loader';
import DeliveryUserDetails from './tabs/delivery-user-details';
import DeliveryHistory from './tabs/delivery-history';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDot from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import APICallService from '../../../../api/apiCallService';
import { deliveryUser } from '../../../../api/apiEndPoints';
import DeleteUserModal from '../../../modals/delete-user';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import { DeliveryUser as DeliverUserEnum } from '../../../../utils/constants';
import {
  Delete,
  Edit,
  Master,
  DeliveryUser,
} from '../../../../utils/constants';
import { listDeliveryUsers } from '../../../../utils/storeString';
const DeliveryProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const location: any = useLocation();
  const [stateData, setStateData] = useState<any>(
    getKey('deliveryUser') || location.state
  );
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [userDetails, setUserDetails] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tab, setTab] = useState([
    {
      name: 'Basic details',
      content: <DeliveryUserDetails basicDetails={userDetails} />,
      value: '1',
    },
    {
      name: 'Delivery history',
      content: <DeliveryHistory basicDetails={userDetails} />,
      value: '2',
    },
  ]);
  const [deleteUserId, setDeleteUserId] = useState('');
  const [currentTab, setCurrentTab] = useState(tab[0]);
  const [totalDelivery, setTotalDelivery] = useState<any>(0);
  const [options, setOptions] = useState<any>();
  const [error, setError] = useState<any>();
  useEffect(() => {
    (async () => {
      let data: any = '';
      if (getKey('deliveryUser')) {
        data = getKey('deliveryUser');
      } else {
        setKey('deliveryUser', location.state);
        data = location.state;
      }
      if (!data) {
        return window.history.back();
      }
      updateOptionWithPermission();
      setStateData(data);
      updateOptionWithPermission();
      setLoading(true);
      await fetchUserDetail(data);
      await fetchDeliveryHistory(data);
      setLoading(false);
    })();
    // return () => {
    //   removeKey('deliveryUser');
    // };
  }, []);
  const fetchUserDetail = async (id: string) => {
    setLoading(true);
    const apiService = new APICallService(
      deliveryUser.userDetails,
      id,
      '',
      '',
      false,
      '',
      DeliverUserEnum
    );
    const response = await apiService.callAPI();
    if (response) {
      setUserDetails(response);
      const tabVal = getKey(listDeliveryUsers.tab) || '1';
      if (tabVal === '1') {
        setCurrentTab({
          name: 'Basic details',
          content: <DeliveryUserDetails basicDetails={response} />,
          value: '1',
        });
      } else if (tabVal === '2') {
        setCurrentTab({
          name: 'Delivery history',
          content: <DeliveryHistory basicDetails={response} />,
          value: '2',
        });
      }
    }
    setLoading(false);
  };
  const fetchDeliveryHistory = async (id: string) => {
    setLoading(true);
    const params = {
      pageNo: 1,
      limit: 10,
      'deliveryUserId[0]': id,
      needCount: true,
      listType: 4,
    };
    const apiService = new APICallService(
      deliveryUser.listDeliveryHistory,
      params,
      '',
      '',
      false,
      '',
      DeliverUserEnum
    );
    const response = await apiService.callAPI();
    if (response) {
      setTotalDelivery(response.total);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(DeliveryUser, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
            {DeliverString.editUser}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(DeliveryUser, Delete, currentUser)) {
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
  const handleSelectTab = (tab: any) => {
    if (tab.value === '1') {
      setCurrentTab({
        name: 'Basic details',
        content: <DeliveryUserDetails basicDetails={userDetails} />,
        value: '1',
      });
    } else if (tab.value === '2') {
      setCurrentTab({
        name: 'Delivery history',
        content: <DeliveryHistory basicDetails={userDetails} />,
        value: '2',
      });
    }
    setKey(listDeliveryUsers.tab, tab.value);
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
  const deleteUser = async (id: string) => {
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
      navigate('/master/delivery-users');
      setError(undefined);
      setDeleteUserId('');
    } else {
      setError(response.error);
    }
  };
  const handleOption = async (event: any, index: number, data: any) => {
    if (event.value === 1) {
      navigate('/master/delivery-users/edit-delivery-user', { state: data });
    } else if (event.value === 2) {
      setDeleteUserId(data._id);
      setShowDeleteModal(true);
    }
  };
  const createTabs = () => {
    const localTab = tab;
    let current = currentTab;
    const allTabs = localTab.map((tab: any, index: number) => {
      return (
        <li
          key={index}
          className="nav-item"
        >
          <Link
            to={'/'}
            className={
              current.value === tab.value
                ? 'nav-link active text-active-dark'
                : 'nav-link text-hover-dark'
            }
            data-bs-toggle="tab"
            onClick={() => handleSelectTab(tab)}
          >
            {tab.name}
          </Link>
        </li>
      );
    });
    return allTabs;
  };
  return (
    <>
      {/* {location.state ? ( */}
      <>
        {showDeleteModal && deleteUserId && (
          <DeleteUserModal
            show={showDeleteModal}
            onHide={() => {
              setShowDeleteModal(false);
              setDeleteUserId('');
              setError(undefined);
            }}
            deleteId={deleteUserId}
            title={userDetails.name}
            handleDelete={deleteUser}
            error={error}
          />
        )}
        <Row className="mb-7 align-items-center">
          <Col md>
            <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
              {DeliverString.deliveryProfile}
            </h1>
          </Col>
          {!loading && (
            <Col sm="auto">
              <div className="d-inline-flex">
                <div className="my-0 pe-2">
                  {Method.hasPermission(DeliveryUser, Edit, currentUser) ||
                  Method.hasPermission(DeliveryUser, Delete, currentUser) ? (
                    <CustomSelectTable
                      marginLeft={'-110px'}
                      width={'auto'}
                      placeholder={
                        <img
                          className="img-fluid"
                          width={45}
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
                      openMenuOnClick={(data: any) => {
                        openMenuOnClick(data);
                      }}
                      onMenuOpen={(id: any) => {
                        onMenuOpen(id);
                      }}
                      onChange={(event: any, index: number, data: any) => {
                        handleOption(event, index, userDetails);
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Col>
          )}
        </Row>
        {loading ? (
          <>
            <div className="d-flex justify-content-center">
              <Loader loading={loading} />
            </div>
          </>
        ) : (
          <>
            <Card className="border border-custom-color mb-7">
              <Card.Body className="pt-9 pb-0">
                <div className="position-absolute top-0 end-0"></div>
                <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
                  <div className="me-9">
                    <div className="symbol symbol-200px symbol-fixed border border-r10px position-relative">
                      <div className="image-input d-flex flex-center rounded w-lg-200px w-150px h-lg-200px h-150px">
                        <div
                          className="image-input-wrapper shadow-none bgi-contain bgi-position-center border-r10px w-100 h-100"
                          style={{
                            background: `url(${
                              userDetails?.image || defaultImg
                            })`,
                            //TODO please se if working or not
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-column mb-2">
                          <h3 className="text-black fs-22 fw-bolder">
                            {userDetails?.name}
                          </h3>
                          <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                            <div className="d-flex align-items-center text-black fs-16 fw-500 me-5 mb-2">
                              <span className="svg-icon svg-icon-4 me-2">
                                <img
                                  src={PhoneCall}
                                  alt="Phone number"
                                />
                              </span>{' '}
                              {String.countryCode + ' ' + userDetails?.phone}
                            </div>
                            <div className="d-flex align-items-center text-black fs-16 fw-500 mb-2">
                              <span className="svg-icon svg-icon-4 me-2">
                                <img
                                  src={Email}
                                  alt="Email"
                                />
                              </span>
                              {userDetails?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Col lg={12}>
                      <div className="d-flex flex-wrap flex-stack">
                        <div className="d-flex flex-column flex-grow-1 pe-8">
                          <div className="d-flex flex-wrap">
                            <div className="bg-light border rounded min-w-125px py-3 px-4 me-6 mb-3">
                              <div className="d-flex align-items-center">
                                <div className="fs-22 fw-bolder">
                                  {userDetails?.warehouse ||
                                    1 + ' ' + String.warehouse}
                                </div>
                              </div>
                              <div className="fw-500 fs-16">
                                {DeliverString.assignedWarehouse}
                              </div>
                            </div>
                            <div className="bg-light border rounded min-w-175px py-3 px-4 me-6 mb-3">
                              <div className="d-flex align-items-center">
                                <div className="fs-22 fw-bolder">
                                  {totalDelivery}
                                </div>
                              </div>
                              <div className="fw-500 fs-16">
                                {DeliverString.totalDeliveries}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </div>
                </div>
              </Card.Body>
              <Row className="align-items-center px-lg-9 px-6">
                <Col sm>
                  <div className="d-flex h-70px">
                    <ul className="nav nav-stretch nav-line-tabs nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-18 fw-600">
                      {createTabs()}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
            <div
              className="tab-content"
              id="myTabContent"
            >
              <div className="tab-pane fade show active">
                <>{currentTab.content}</>
              </div>
            </div>
          </>
        )}
      </>
      {/* ) : (
        <></>
      )} */}
    </>
  );
};
export default DeliveryProfile;
