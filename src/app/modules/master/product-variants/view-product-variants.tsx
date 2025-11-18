import { Card, Col, Nav, Row, Tab, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import ThreeDotMenuRounded from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
// Media <<
import { useEffect, useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import { variantsJSON } from '../../../../api/apiJSON/master';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import {
  Add,
  Admin,
  Delete,
  Edit,
  Master,
  ProductVariant,
  SuggestOptions,
} from '../../../../utils/constants';
import { productVariantsString } from '../../../../utils/string';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import DeleteModalCommon from '../../../modals/delete-modal-comman';
import { useAuth } from '../../auth';
import { METHODS } from 'http';
import Method from '../../../../utils/methods';
const ViewProductVariants = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tabs, setTabs] = useState([]);
  const [activeTabData, setActiveTabData] = useState<any>([]);
  const [fetchLoader, setFetchLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [id, setId] = useState<any>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [error, setError] = useState<any>();
  const [masterOptions, setMasterOptions] = useState<any>([]);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const handleActive = async (event: any, id: string) => {
    setActive(event);
    setId(id);
    await fetchActiveTabData(id);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(ProductVariant, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchTabs();
    })();
  }, []);
  const fetchTabs = async () => {
    setFetchLoader(true);
    let apiService = new APICallService(
      master.variantTiles,
      {},
      '',
      '',
      false,
      '',
      ProductVariant
    );
    let response = await apiService.callAPI();
    if (response && response.records.length) {
      setTabs(response.records);
      await fetchActiveTabData(response.records[0]._id);
      setId(response.records[0]._id);
      setActive(0);
    }
    setFetchLoader(false);
  };
  const fetchActiveTabData = async (id: string) => {
    setLoading(true);
    let apiService = new APICallService(
      master.variantInfo,
      variantsJSON.variantInfo({
        viewType: 1,
      }),
      { id: id },
      '',
      false,
      '',
      ProductVariant
    );
    let response = await apiService.callAPI();
    if (response) {
      setActiveTabData(response);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempMasterOptions: any = [];
    const tempCategoryOptions: any = [];
    if (Method.hasPermission(ProductVariant, Edit, currentUser)) {
      tempMasterOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            {productVariantsString.editCategoryVariants}
          </button>
        ),
        value: 1,
      });
      tempCategoryOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            {productVariantsString.editVariantsCategory}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(ProductVariant, Delete, currentUser)) {
      tempMasterOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-danger ms-3 p-4  ">
            {productVariantsString.deleteCategoryVariants}
          </button>
        ),
        value: 2,
      });
      tempCategoryOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-danger ms-3 p-4  ">
            {productVariantsString.deleteVariantsCategory}
          </button>
        ),
        value: 2,
      });
    }
    setMasterOptions(tempMasterOptions);
    setCategoryOptions(tempCategoryOptions);
  };
  const handleOption = async (
    event: any,
    data: any,
    index: number,
    _id: string,
    catIndex: number
  ) => {
    if (event.value === 1) {
      navigate('/master/product-variants/edit-product-variants', {
        state: { id: id, catId: activeTabData.categories[catIndex]._id },
      });
    } else if (event.value === 2) {
      const tempId = `${_id}/${data._id}/${data.categories[index]._id}`;
      setDeleteId(tempId);
      setShowDeleteModal(true);
    }
  };
  const deleteSubCategory = async (_id: string) => {
    const apiService = new APICallService(
      master.deleteSubCategoryVariants,
      _id,
      '',
      '',
      true,
      '',
      ProductVariant
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteSubcategoryVariant);
      setShowDeleteModal(false);
      await fetchActiveTabData(id);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  const deleteVariant = async (_id: string) => {
    const apiService = new APICallService(
      master.deleteVariant,
      _id,
      '',
      '',
      true,
      '',
      ProductVariant
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deletedVariant);
      //await fetchActiveTabData(id);
      setShowDeleteVariantModal(false);
      setError(undefined);
      await fetchTabs();
    } else {
      setError(response.error);
    }
  };
  const handleMasterOption = async (event: any, _id: string, index: any) => {
    if (event.value === 1) {
      navigate('/master/product-variants/edit-product-variants', {
        state: { id: id, catId: '' },
      });
    } else if (event.value === 2) {
      // data._id = category id
      // data.categories[index]._id = subcat id
      //const tempId = `${_id}/${data._id}/${data.categories[index]._id}`;
      // setDeleteId(tempId);
      setId(id);
      setShowDeleteVariantModal(true);
    }
  };
  const hasPermission = (permission: number) => {
    return (
      currentUser?.userType === Admin ||
      currentUser?.roleAndPermission.permissions
        .find((item: any) => item.module === Master)
        .permissions.includes(permission)
    );
  };
  return (
    <>
      {deleteId.length > 0 && showDeleteModal && (
        <DeleteModalCommon
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setDeleteId('');
            setError(undefined);
          }}
          flag={true}
          deleteId={deleteId}
          handleDelete={deleteSubCategory}
          title="this sub category variant"
          error={error}
        />
      )}
      {id && showDeleteVariantModal && (
        <DeleteModalCommon
          show={showDeleteVariantModal}
          onHide={() => {
            setShowDeleteVariantModal(false);
            //setId(undefined);
            setError(undefined);
          }}
          flag={true}
          deleteId={id}
          handleDelete={deleteVariant}
          title="this variant"
          error={error}
        />
      )}
      <div>
        <Row className="align-items-center g-3 mb-5">
          <Col
            xs
            className="align-self-center my-6"
          >
            <h1 className="fs-22 fw-bolder">Product Variants</h1>
          </Col>
          {fetchLoader ? (
            <></>
          ) : tabs.length > 0 ? (
            <Col
              xs="auto"
              className="text-right"
            >
              {Method.hasPermission(ProductVariant, Add, currentUser) ? (
                <Link
                  to="/master/product-variants/add-product-variants"
                  className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
                >
                  Add new variant
                </Link>
              ) : (
                <></>
              )}
            </Col>
          ) : (
            <>
              <Col
                lg={12}
                className="mt-6"
              >
                <div className="border border-r10px p-md-9 p-7">
                  <h2 className="fs-22 fw-bolder">Start adding variants!</h2>
                  <p className="fs-18 fw-500 mb-md-8 mb-5">
                    You can add different variants for the products.
                  </p>
                  <Link
                    to="/master/product-variants/add-product-variants"
                    className="btn btn-primary btn-lg"
                  >
                    Add variant
                  </Link>
                </div>
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col
            lg={12}
            className="custom-tabContainer"
          >
            {fetchLoader ? (
              <>
                <div className="d-flex justify-content-center">
                  <Loader loading={fetchLoader} />
                </div>
              </>
            ) : tabs.length > 0 ? (
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
                          {tabs.map((tabVal: any, index: number) => {
                            return (
                              <Nav.Item key={tabVal._id}>
                                <Nav.Link
                                  eventKey={index}
                                  onClick={() => {
                                    handleActive(index, tabVal._id);
                                  }}
                                  active={active === index}
                                >
                                  {tabVal.title}
                                </Nav.Link>
                              </Nav.Item>
                            );
                          })}
                        </Nav>
                      </div>
                    </Col>
                    <Col
                      lg={12}
                      className="mb-7"
                    >
                      <Row className="align-items-center">
                        <Col sm>
                          <h3 className="fs-22 fw-bolder mb-sm-0 mb-3">
                            Linked categories
                          </h3>
                        </Col>
                        <Col sm="auto">
                          <div className="d-inline-flex">
                            {Method.hasPermission(
                              ProductVariant,
                              Edit,
                              currentUser
                            ) ||
                            Method.hasPermission(
                              ProductVariant,
                              Delete,
                              currentUser
                            ) ? (
                              <CustomSelectTable
                                marginLeft={'-90px'}
                                placeholder={
                                  <img
                                    className="me-3"
                                    src={ThreeDotMenuRounded}
                                    alt=""
                                  />
                                }
                                options={masterOptions}
                                backgroundColor={'white'}
                                onChange={(event: any) => {
                                  handleMasterOption(event, id, 0);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={12}>
                      <Tab.Content>
                        {/*TAB-1*/}
                        {loading ? (
                          <>
                            <div className="d-flex justify-content-center">
                              <Loader loading={loading} />
                            </div>
                          </>
                        ) : (
                          <>
                            {' '}
                            <Tab.Pane
                              eventKey={active}
                              active={true}
                            >
                              <Card className="card-custom categories-card border border-r10px">
                                <Card.Header className="min-h-65px">
                                  <h3 className="card-title fs-16 fw-600">
                                    Categories
                                  </h3>
                                  <h3 className="card-title fs-16 fw-600">
                                    Text guide / Suggest options
                                  </h3>
                                  <h3 className="card-title fs-16 fw-600"></h3>
                                </Card.Header>
                                <Card.Body className="p-0">
                                  {activeTabData.categories.map(
                                    (activeVal: any, index: number) => (
                                      <div
                                        key={activeVal._id}
                                        className="accordion"
                                        id={'kt_accordion_' + activeVal._id}
                                      >
                                        <div className="accordion-item">
                                          <div
                                            className="accordion-header"
                                            id={'accordion_' + activeVal._id}
                                          >
                                            <Row className="align-items-center p-0">
                                              <Col xs>
                                                <button
                                                  className="accordion-button fs-16 fw-600 pe-0 border-bottom-0 collapsed"
                                                  type="button"
                                                  data-bs-toggle="collapse"
                                                  data-bs-target={
                                                    '#body_accordion_' +
                                                    activeVal._id
                                                  }
                                                  aria-expanded="false"
                                                  aria-controls={
                                                    'body_accordion_' +
                                                    activeVal._id
                                                  }
                                                >
                                                  <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                                    <img
                                                      className="img-fluid"
                                                      src={activeVal.image}
                                                      alt=""
                                                    />
                                                  </span>
                                                  <span className="w-100">
                                                    {activeVal.title}
                                                  </span>
                                                </button>
                                              </Col>
                                              <Col xs={'auto'}></Col>
                                            </Row>
                                          </div>{' '}
                                          <div
                                            id={
                                              'body_accordion_' + activeVal._id
                                            }
                                            className="accordion-collapse collapse"
                                          >
                                            <div className="d-flex justify-content-between">
                                              <div className="table-responsive-md linked-categories w-100">
                                                <Table className="align-middle border-bottom-table fs-15 fw-600 mb-0">
                                                  <thead>
                                                    <tr>
                                                      <th className="p-0 min-w-230px"></th>
                                                      <th className="p-0 min-w-100px"></th>
                                                      <th className="p-0 min-w-250px"></th>
                                                      <th className="p-0"></th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {activeVal.categories
                                                      .length > 0 &&
                                                      activeVal.categories.map(
                                                        (
                                                          subVal: any,
                                                          subIndex: number
                                                        ) => {
                                                          return (
                                                            <tr
                                                              key={subVal._id}
                                                            >
                                                              <td>
                                                                <div
                                                                  className="d-flex ps-12
                                                                  align-items-center fs-16 fw-600"
                                                                >
                                                                  <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                                                    <img
                                                                      className="img-fluid p-1"
                                                                      src={
                                                                        subVal.image
                                                                      }
                                                                      alt=""
                                                                    />
                                                                  </span>
                                                                  {subVal.title}
                                                                </div>
                                                              </td>
                                                              <td>
                                                                {subVal.variant
                                                                  .definedBy ===
                                                                SuggestOptions
                                                                  ? 'Suggest options'
                                                                  : 'Text guide'}
                                                              </td>
                                                              <td>
                                                                {subVal.variant
                                                                  .definedBy ===
                                                                  SuggestOptions}
                                                                {subVal.variant
                                                                  .definedBy ===
                                                                SuggestOptions ? (
                                                                  <div className="row gy-3">
                                                                    {subVal.variant.options.map(
                                                                      (
                                                                        optionVal: any
                                                                      ) => {
                                                                        return (
                                                                          <div
                                                                            key={
                                                                              optionVal._id
                                                                            }
                                                                            className="col-auto w-fit-content"
                                                                          >
                                                                            <div className="bg-gray-100 p-2 px-5 pills-radius">
                                                                              <span className="fw-600 text-black fs-16">
                                                                                {
                                                                                  optionVal.title
                                                                                }
                                                                              </span>
                                                                            </div>
                                                                          </div>
                                                                        );
                                                                      }
                                                                    )}
                                                                  </div>
                                                                ) : (
                                                                  subVal.variant
                                                                    .note
                                                                )}
                                                              </td>
                                                              <td className="text-end">
                                                                <div className="my-0 bg-light float-end">
                                                                  {Method.hasPermission(
                                                                    ProductVariant,
                                                                    Edit,
                                                                    currentUser
                                                                  ) ||
                                                                  Method.hasPermission(
                                                                    ProductVariant,
                                                                    Delete,
                                                                    currentUser
                                                                  ) ? (
                                                                    <CustomSelectTable
                                                                      marginLeft={
                                                                        '-90px'
                                                                      }
                                                                      placeholder={
                                                                        <img
                                                                          className="me-3"
                                                                          width={
                                                                            24
                                                                          }
                                                                          height={
                                                                            5
                                                                          }
                                                                          src={
                                                                            ThreeDotMenu
                                                                          }
                                                                          alt=""
                                                                        />
                                                                      }
                                                                      options={
                                                                        categoryOptions
                                                                      }
                                                                      backgroundColor={
                                                                        'white'
                                                                      }
                                                                      onChange={(
                                                                        event: any
                                                                      ) => {
                                                                        handleOption(
                                                                          event,
                                                                          activeVal,
                                                                          subIndex,
                                                                          id,
                                                                          index
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
                                                  </tbody>
                                                </Table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}{' '}
                                </Card.Body>
                              </Card>
                            </Tab.Pane>
                          </>
                        )}
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ViewProductVariants;
