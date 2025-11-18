import clsx from 'clsx';
import { Button, Col, Row } from 'react-bootstrap';
import { RolesString, String } from '../../../../utils/string';
import { rolePermissions } from '../../../../utils/dummyJSON';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { rolesJSON } from '../../../../api/apiJSON/master';
import { error, success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import {
  Add,
  All,
  ContactEnquiries,
  Customer,
  Delete,
  Download,
  Edit,
  GeneralSettings,
  Master,
  Order,
  OutWardReports,
  ReturnProductReports,
  RolePermissions,
  SalesReportsConst,
  View,
} from '../../../../utils/constants';
const AddNewRole = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [role, setRole] = useState<{
    name: string;
    permission: {
      module: number;
      permissions: number[];
    }[];
  }>({
    name: '',
    permission: [],
  });
  const [validation, setValidation] = useState<{
    name: boolean;
    permission: boolean[];
  }>({
    name: false,
    permission: [false],
  });
  useEffect(() => {
    (() => {
      if (!Method.hasPermission(RolePermissions, Add, currentUser)) {
        return window.history.back();
      }
    })();
  }, []);
  const checkPermissionValid = (permissions: any) => {
    if (permissions.length === 0) return false;
  };
  const handleSubmit = async () => {
    const tempValidation = { ...validation };
    const tempRole = { ...role };
    if (tempRole.name.trim().length === 0) {
      tempValidation.name = true;
    }
    if (!tempValidation.name && tempRole.permission.length === 0) {
      error(masterToast.selectRoles);
    }
    if (!tempValidation.name && tempRole.permission.length > 0) {
      setLoading(true);
      const apiService = new APICallService(
        master.addRoles,
        rolesJSON.addRoles(tempRole),
        '',
        '',
        false,
        '',
        RolePermissions
      );
      const response = await apiService.callAPI();
      if (response) {
        success(masterToast.addRoles);
        navigate('/master/roles-permissions');
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  const handleCheckboxChange = (
    event: any,
    module: number,
    permission: any
  ) => {
    let { value, checked } = event.target;
    value = parseInt(value);
    let tempRole = { ...role };
    const rolesItem = tempRole.permission.findIndex((item: any) => {
      return item.module === module;
    });
    const modulePermissionLength: any = rolePermissions.find(
      (item) => item.value === module
    )?.permissions.length;
    if (rolesItem !== -1) {
      if (checked) {
        const tempPermission = tempRole.permission;
        if (value === All) {
          tempPermission[rolesItem].permissions = permission.map(
            (item: any) => item.value
          );
        } else if (!tempPermission[rolesItem].permissions.includes(All)) {
          tempPermission[rolesItem].permissions.push(+value);
        }
        if (
          tempPermission[rolesItem].permissions.length ===
          permission.length - 1
        ) {
          tempPermission[rolesItem].permissions = permission.map(
            (item: any) => item.value
          );
        }
        tempRole.permission = tempPermission;
      } else {
        let tempPermission = tempRole.permission;
        const permissionIndex = tempPermission[rolesItem].permissions.findIndex(
          (item: any) => item === +value
        );
        if (
          value === View &&
          (tempPermission[rolesItem].permissions.includes(Add) ||
            tempPermission[rolesItem].permissions.includes(Edit) ||
            tempPermission[rolesItem].permissions.includes(Delete) ||
            tempPermission[rolesItem].permissions.includes(Download))
        ) {
          return;
        }
        tempPermission[rolesItem].permissions.splice(permissionIndex, 1);
        if (
          value !== All &&
          tempPermission[rolesItem].permissions.includes(All)
        ) {
          tempPermission[rolesItem].permissions.shift();
        }
        if (parseInt(value) === All) {
          tempPermission[rolesItem].permissions = [];
        }
        if (tempPermission[rolesItem].permissions.length === 0) {
          tempPermission.splice(rolesItem, 1);
        }
        tempRole.permission = tempPermission;
      }
    } else {
      if (parseInt(value) === All) {
        tempRole.permission.push({
          module: module,
          permissions: permission.map((item: any) => item.value),
        });
      } else {
        let tempArr;
        if (parseInt(value) !== View) {
          tempArr = [View, +value];
          if (tempArr.length === permission.length - 1) {
            tempArr = permission.map((item: any) => item.value);
          }
        } else {
          tempArr = [+value];
        }
        if (
          module === OutWardReports ||
          module === ReturnProductReports ||
          module === SalesReportsConst
        ) {
          tempArr = [All, +value];
        }
        tempRole.permission.push({
          module: module,
          permissions: tempArr,
        });
      }
    }
    setRole(tempRole);
  };
  const handleName = (value: string) => {
    const tempRole = { ...role };
    tempRole.name = value;
    const tempValidation = { ...validation };
    if (value.length === 0) {
      tempValidation.name = true;
    } else {
      tempValidation.name = false;
    }
    setValidation(tempValidation);
    setRole(tempRole);
  };
  const isChecked = (
    roles: any,
    moduleData: any,
    index: number,
    value: number
  ): boolean => {
    const temp = roles.permission.find((item: any) => {
      return item.module === moduleData.value;
    });
    if (temp) {
      if (
        temp.permissions.length === moduleData.permissions.length ||
        temp.permissions.includes(All)
      ) {
        return true;
      } else {
        const result =
          temp.permissions.includes(value) || temp.permissions.includes(All);
        return result;
      }
      //return false;
    }
    return false;
  };
  const isDisabled = (roles: any, moduleData: any, index: any) => {
    const temp = roles.permission.find((item: any) => {
      return item.module === moduleData.value;
    });
    // if (temp) {
    //   return temp.permissions.includes(0);
    // }
    return false;
  };
  return (
    <>
      {Method.hasPermission(RolePermissions, Add, currentUser) ? (
        <>
          <Row>
            <Col
              lg={12}
              className="mb-6"
            >
              <h1 className="fs-22 fw-bolder">{RolesString.addNewRole}</h1>
            </Col>
            <Col
              lg={12}
              className="mb-8"
            >
              <div className="custom-form border border-r10px bg-light p-6 py-9 mb-8">
                <Row className="align-items-center">
                  <Col md="12">
                    <label className="form-label fs-16 fw-500">
                      {RolesString.roleName}
                    </label>
                  </Col>
                  <Col
                    md={6}
                    className="pt-1"
                  >
                    <input
                      type="text"
                      className={clsx(
                        'form-control form-control-custom form-control-lg bg-white',
                        validation.name ? 'border-danger' : ''
                      )}
                      id=""
                      placeholder={RolesString.namePlaceholder}
                      value={role.name}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => handleName(e.target.value.trimStart())}
                    />
                    {validation.name ? (
                      <label className="form-label text-danger mt-2">
                        Please enter role name
                      </label>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="custom-form border border-r10px bg-light p-6 py-9">
                <Row className="align-items-center">
                  <Col
                    md="12"
                    className="mb-3"
                  >
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label fs-22 fw-bolder "
                    >
                      {RolesString.setPermission}
                    </label>
                  </Col>
                  <>
                    {rolePermissions.map((moduleData) => (
                      <Row
                        className="mb-5"
                        key={moduleData.module}
                      >
                        <Col md="4">
                          <label className="form-label fs-16 ms-4">
                            {moduleData.module}
                          </label>
                        </Col>
                        <Col md="8">
                          <div className="d-flex flex-wrap">
                            {moduleData.permissions.map(
                              (checkbox: any, index: number) => (
                                <div
                                  key={checkbox.value}
                                  className="me-8 mb-2"
                                >
                                  {/* Add clsx condition for white bg */}
                                  <input
                                    className={clsx(
                                      'form-check-input pt-1 h-25px w-25px  ',
                                      `${
                                        isChecked(
                                          role,
                                          moduleData,
                                          index,
                                          checkbox.value
                                        )
                                          ? 'border border-5 border-primary'
                                          : ''
                                      }`
                                    )}
                                    type="checkbox"
                                    value={checkbox.value}
                                    defaultChecked={false}
                                    // disabled={
                                    //   index !== 4 &&
                                    //   isDisabled(role, moduleData, index)
                                    // }
                                    checked={isChecked(
                                      role,
                                      moduleData,
                                      index,
                                      checkbox.value
                                    )}
                                    onChange={(event) => {
                                      handleCheckboxChange(
                                        event,
                                        moduleData.value,
                                        moduleData.permissions
                                      );
                                    }}
                                    id={``}
                                  />
                                  <label className="form-check-label fs-16 fw-500 text-dark ms-2">
                                    {checkbox.title}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </>
                </Row>
              </div>
            </Col>
          </Row>
          <Col lg={12}>
            <Row className="justify-content-end justify-content-md-start g-3">
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="lg"
                  className="btn-active-danger"
                  onClick={() => navigate('/master/roles-permissions')}
                >
                  {RolesString.cancel}
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {!loading && (
                    <span className="indicator-label fs-16 fw-bold">
                      {RolesString.addRole}
                    </span>
                  )}
                  {loading && (
                    <span
                      className="indicator-progress fs-16 fw-bold"
                      style={{ display: 'block' }}
                    >
                      {String.pleaseWait}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </Button>
              </Col>
            </Row>
          </Col>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default AddNewRole;
