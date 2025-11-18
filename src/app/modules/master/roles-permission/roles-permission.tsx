import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { RolesString } from '../../../../utils/string';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDot from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import DeleteWarningModal from '../../../modals/delete-modal-warning';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import {
  Add,
  AllRecipesConst,
  BrandWiseSalesPerformanceReport,
  CategoryAndSubCategoryAnalysisReport,
  CustomerPurchaseBehaviourReport,
  Delete,
  Edit,
  FrequentCustomerPurchasePatternAnalysisReport,
  GeographicSalesInsightReport,
  InventoryStatusReport,
  Master,
  PickerConst,
  ProductSalesPerformanceReport,
  RefundReportConst,
  RevenueGenerationReport,
  RolePermissions,
  SuggestProductConst,
} from '../../../../utils/constants';
import DeleteModal from '../../../modals/delete-modal';
// const moduleName = [
//   'All Modules',
//   'Customers',
//   'Orders & delivery',
//   'All Products',
//   'Inventory',
//   'Promotion Campaign',
//   'Master',
//   'Categories',
//   'Brands',
//   'Product variants',
//   'Roles & Permissions',
//   'User Management',
//   'Warehouse Products Zone',
//   'Delivery Users',
//   'Reports',
//   'Settings',
//   'CMS Pages',
//   'Contact Enquires',
//   'Product Zone',
//   'Custom Notification',
//   'Goods In Warehouse',
//   'Goods Requests',
//   'Return Requests',
//   'Low Stock List',
//   'General Settings',
//   'Banner Management',
//   'App Settings',
//   'Sales Reports',
//   'Outward Reports',
//   'Return Product Reports'
// ];
const rolesPermissions = [
  'All',
  'View / List',
  'Add',
  'Edit',
  'Delete',
  'Download',
];
const RolesPermission = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('');
  const [currentRole, setCurrentRole] = useState<any>();
  const [error, setError] = useState<any>();
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(RolePermissions, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchRoles(2);
      setLoading(false);
    })();
  }, []);
  const fetchRoles = async (roleDepth: number = 1) => {
    setLoading(true);
    const params = {
      roleDepth: roleDepth,
    };
    const apiService = new APICallService(
      master.getRoles,
      params,
      '',
      '',
      false,
      '',
      RolePermissions
    );
    const response = await apiService.callAPI();
    if (response) {
      const tempResponse = [...response];
      setRoles(response);
      if (response.length) {
        setCurrentTab(response[0]._id);
        setCurrentRole(response[0].name);
      }
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(RolePermissions, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
            {RolesString.editRole}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(RolePermissions, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {RolesString.deleteRole}
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
      navigate('/master/roles-permission/edit-role', { state: currentTab });
    } else if (event.value === 2) {
      setShowDeleteModal(true);
    }
  };
  const handleDelete = async (id: string) => {
    const apiService = new APICallService(
      master.deleteRole,
      id,
      '',
      '',
      true,
      '',
      RolePermissions
    );
    const response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteRole);
      handleCloseDeleteModal();
      fetchRoles(2);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  function getModuleName(index: any) {
    switch (index) {
      case 0:
        return 'All Modules';
      case 1:
        return 'Customers';
      case 2:
        return 'Orders & delivery';
      case 3:
        return 'All Products';
      case 4:
        return 'Inventory';
      case 5:
        return 'Promotion Campaign';
      case 6:
        return 'Master';
      case 7:
        return 'Categories';
      case 8:
        return 'Brands';
      case 9:
        return 'Product variants';
      case 10:
        return 'Roles & Permissions';
      case 11:
        return 'User Management';
      case 12:
        return 'Warehouse Products Zone';
      case 13:
        return 'Delivery Users';
      case 14:
        return 'Reports';
      case 15:
        return 'Settings';
      case 16:
        return 'CMS Pages';
      case 17:
        return 'Contact Enquires';
      case 18:
        return 'Product Zone';
      case 19:
        return 'Custom Notification';
      case 20:
        return 'Goods In Warehouse';
      case 21:
        return 'Goods Requests';
      case 22:
        return 'Return Requests';
      case 23:
        return 'Low Stock List';
      case 24:
        return 'General Settings';
      case 25:
        return 'Banner Management';
      case 26:
        return 'App Settings';
      case 27:
        return 'Sales Reports';
      case 28:
        return 'Outward Reports';
      case 29:
        return 'Return Product Reports';
      case CustomerPurchaseBehaviourReport:
        return 'Customer Purchase Behavior Analysis Report';
      case GeographicSalesInsightReport:
        return 'Geographic Sales Insights Report';
      case FrequentCustomerPurchasePatternAnalysisReport:
        return 'Frequent Customer Purchase Pattern Analysis Report';
      case ProductSalesPerformanceReport:
        return 'Product Sales Performance Report';
      case BrandWiseSalesPerformanceReport:
        return 'Brand-Wise Sales Performance Report';
      case CategoryAndSubCategoryAnalysisReport:
        return 'Category and Sub-Category Sales Analysis Report';
      case RevenueGenerationReport:
        return 'Revenue Generation Report';
      case InventoryStatusReport:
        return 'Product Variant Inventory Status Report';
      case AllRecipesConst :
        return 'All Recipes'  
      case SuggestProductConst : 
        return 'Order Anything';  
      case PickerConst : 
        return 'Pickers';  
      case RefundReportConst:
        return  'Pending Refund Report'
      default:
        return '';
    }
  }
  return (
    <>
      {currentTab && showDeleteModal && currentRole && (
        <DeleteModal
          show={showDeleteModal}
          onHide={() => {
            setError(undefined);
            setShowDeleteModal(false);
          }}
          flag={true}
          deleteId={currentTab}
          handleDelete={handleDelete}
          title="Role"
          error={error}
          role={currentRole}
        />
      )}
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center mb-5"
        >
          <h1 className="fs-22 fw-bolder mb-0">{RolesString.title}</h1>
        </Col>
        {loading ? (
          <>
            <div className="text-center">
              <Loader />
            </div>
          </>
        ) : roles.length > 0 ? (
          <>
            <Col
              md={'auto'}
              className="text-right mb-5"
            >
              {Method.hasPermission(RolePermissions, Add, currentUser) ? (
                <Link
                  to="/master/roles-permissions/add-new-role"
                  className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
                >
                  Add new role
                </Link>
              ) : (
                <></>
              )}
            </Col>
          </>
        ) : (
          <>
            <Col
              lg={12}
              className="mt-2"
            >
              <div className="border border-r10px p-md-9 p-7">
                <h2 className="fs-22 fw-bolder">
                  {RolesString.startAddingTitle}
                </h2>
                <p className="fs-18 fw-500 mb-md-8 mb-5">
                  {RolesString.manageRoleBody}
                </p>
                <Link
                  to="/master/roles-permissions/add-new-role"
                  className="btn btn-primary btn-lg"
                >
                  {RolesString.addRole}
                </Link>
              </div>
            </Col>
          </>
        )}
        {loading ? (
          <></>
        ) : (
          !!roles.length && (
            <Col
              lg={12}
              className="custom-tabContainer"
            >
              <>
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey="1"
                >
                  <Row className="variant-categories">
                    <Col
                      sm={'auto'}
                      className="mb-8"
                    >
                      <div className="bg-light border-r8px p-3 px-md-6">
                        <Nav variant="pills">
                          {roles.map((item: any, index: number) => (
                            <Nav.Item>
                              <Nav.Link
                                eventKey={index + 1}
                                onClick={(e: any) => {
                                  setCurrentTab(item._id);
                                  setCurrentRole(item.name);
                                }}
                              >
                                {item.name}
                              </Nav.Link>
                            </Nav.Item>
                          ))}
                        </Nav>
                      </div>
                    </Col>
                  </Row>
                  
                  <Col
                    lg={12}
                    className="mb-7"
                  >
                    <Row className="align-items-center">
                      <Col sm>
                        <h3 className="fs-22 fw-bolder mb-sm-0 mb-3">
                          {RolesString.permission}
                        </h3>
                      </Col>
                      <Col sm="auto">
                        <div className="d-inline-flex">
                          <div className="my-0 pe-2">
                            {Method.hasPermission(
                              RolePermissions,
                              Edit,
                              currentUser
                            ) ||
                            Method.hasPermission(
                              RolePermissions,
                              Delete,
                              currentUser
                            ) ? (
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
                                onChange={(
                                  event: any,
                                  index: number,
                                  data: any
                                ) => {
                                  handleOption(event, index, data);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={12}>
                    <Tab.Content>
                      {roles.map((item: any, index: number) => (
                        <Tab.Pane eventKey={index + 1}>
                          <Card className="card-custom categories-card border border-r10px">
                            <Card.Body className="pt-1 py-3 px-md-12 px-8 mb-3">
                              <div className="table-responsive ">
                                <table className="table table-rounded table-row-bordered align-middle gy-3 mb-0 ">
                                  <thead>
                                    <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                                      <th className="px-0 min-w-md-160px">
                                        {RolesString.moduleName}
                                      </th>
                                      <th className="px-0 min-w-md-175px">
                                        {RolesString.permission}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.permissions?.map(
                                      (val: any, index: number) => {
                                        return (
                                          <tr key={index}>
                                            <td>
                                              <span className="fs-16 fw-600">
                                                {getModuleName(val.module)}
                                              </span>
                                            </td>
                                            <td>
                                              {val.permissions.map(
                                                (
                                                  permission: number,
                                                  permissionIndex: any
                                                ) => {
                                                
                                                  return permission !== 0 ? (
                                                    <span
                                                      key={permissionIndex}
                                                      className="badge badge-light custom-badge text-dark fs-16 fw-600 p-4"
                                                    >
                                                      {
                                                        rolesPermissions[
                                                          +permission
                                                        ]
                                                      }
                                                    </span>
                                                  ) : (
                                                    <></>
                                                  );
                                                }
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </Card.Body>
                          </Card>
                        </Tab.Pane>
                      ))}
                    </Tab.Content>
                  </Col>
                </Tab.Container>
              </>
            </Col>
          )
        )}
      </Row>
    </>
  );
};
export default RolesPermission;
