import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import { CategoryString } from '../../../../utils/string';
import { CustomSelectGreen } from '../../../custom/Select/CustomSelectGreen';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import DeleteModal from '../../../modals/delete-modal';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { Category, PAGE_LIMIT } from '../../../../utils/constants';
import Pagination from '../../../../Global/pagination';
import { categoryJSON } from '../../../../api/apiJSON/master';
import { useAuth } from '../../auth';
import { Add, Admin, Delete, Edit, Master } from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import { getKey, setKey } from '../../../../Global/history';
import { listCategories } from '../../../../utils/storeString';
const AllCategories = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const depth = 3;
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [subId, setSubId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState<any>();
  const [page, setPage] = useState(getKey(listCategories.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listCategories.limit) || PAGE_LIMIT
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(undefined);
  const [selectedGroupCategory, setSelectedGroupCategory] = useState<
    string | undefined
  >(undefined);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(Category, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchCategory(depth, page, pageLimit);
    })();
  }, []);
  const fetchCategory = async (
    categoriesDepth: number,
    pageNo: number,
    limit: number
  ) => {
    setLoading(true);
    let params = {
      sortKey: '_createdAt',
      sortOrder: -1,
      pageNo: pageNo,
      limit: limit,
      categoriesDepth: categoriesDepth,
    };
    let apiService = new APICallService(
      master.categoryList,
      categoryJSON.listCategory(params),
      '',
      '',
      false,
      '',
      Category
    );
    let response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      }
      setCategory(response.records);
    }
    setLoading(false);
    setTimeout(() => {
      const pos = getKey(listCategories.scrollPosition);
      window.scrollTo(0, pos);
    }, 600);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Category, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
            {CategoryString.editDetails}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(Category, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4 ">
            {CategoryString.deleteCategory}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const openMenuOnClick = async (id: any) => {
    setId(id);
  };
  const onMenuClose = async () => {
    setId('');
  };
  const onMenuOpen = async (id: any) => {
    setId(id);
  };
  const handleOption = async (event: any, data: any) => {
    if (event.value === 1) {
      setKey(listCategories.scrollPosition, window.scrollY.toString());
      data['categories'] = data['categories'].map((val: any) => {
        return {
          label: val.title,
          value: val.title,
          _id: val._id,
          isTobacco: val?.isTobacco || false
        };
      });
      navigate('/master/edit-primary-categories', {
        state: data,
      });
    }
    if (event.value === 2) {
      setSelectedCategory(data._id);
      setDeleteModalOpen(true);
    }
  };
  const openSecondaryMenuOnClick = async (id: any) => {
    setSubId(id);
  };
  const onSecondaryMenuClose = async () => {
    setSubId('');
  };
  const onSecondaryMenuOpen = async (id: any) => {
    setSubId(id);
  };
  const handleSecondaryOption = async (
    event: any,
    data: any,
    primaryVal: any
  ) => {
    if (event.value === 1) {
      setKey(listCategories.scrollPosition, window.scrollY.toString());
      data['primaryCategories'] = {
        image: primaryVal.image,
        title: primaryVal.title,
        _id: primaryVal._id,
        isTobacco: primaryVal?.isTobacco || false,
        isRecipe : primaryVal?.isRecipe || false
      };
      navigate('/master/edit-sub-categories', {
        state: data,
      });
    }
    if (event.value === 2) {
      data['primaryCategories'] = primaryVal._id;
      setSelectedSubCategory(`${data.primaryCategories}/${data._id}`);
      setDeleteModalOpen(true);
    }
  };
  const openGroupMenuOnClick = async (id: any) => {
    setGroupId(id);
  };
  const onGroupMenuClose = async () => {
    setGroupId('');
  };
  const onGroupMenuOpen = async (id: any) => {
    setGroupId(id);
  };
  const handleGroupOption = async (
    event: any,
    data: any,
    primaryCategory: any,
    subCategory: any
  ) => {
    if (event.value === 1) {
      data['primaryCategory'] = {
        image: primaryCategory.image,
        title: primaryCategory.title,
        _id: primaryCategory._id,
      };
      data['subCategory'] = {
        image: subCategory.image,
        title: subCategory.title,
        _id: subCategory._id,
      };
      navigate('/master/edit-group-categories', {
        state: data,
      });
    }
    if (event.value === 2) {
      data['primaryCategory'] = primaryCategory._id;
      data['subCategory'] = subCategory._id;
      setSelectedGroupCategory(
        `${data.primaryCategory}/${data.subCategory}/${data._id}`
      );
      setDeleteModalOpen(true);
    }
  };
  const handleChange = (event: any) => {
    if (event.value === '0') {
      navigate('/master/add-primary-categories');
    }
    if (event.value === '1') {
      navigate('/master/add-sub-categories');
    }
    if (event.value === '2') {
      navigate('/master/add-group-categories');
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listCategories.page, val);
    await fetchCategory(depth, val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listCategories.page, val + 1);
    await fetchCategory(depth, val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listCategories.page, val - 1);
    await fetchCategory(depth, val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listCategories.page, 1);
    setPageLimit(+event.target.value);
    setKey(listCategories.limit, +event.target.value);
    await fetchCategory(depth, 1, event.target.value);
  };
  const deletePrimaryCategory = async (id: string) => {
    let apiService = new APICallService(
      master.deleteCategory,
      id,
      '',
      '',
      true,
      '',
      Category
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteCategory);
      setSelectedCategory(undefined);
      setDeleteModalOpen(false);
      await fetchCategory(depth, page, pageLimit);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  const deleteSubCategory = async (id: string) => {
    let apiService = new APICallService(
      master.deleteSubCategory,
      id,
      '',
      '',
      true,
      '',
      Category
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteCategory);
      setSelectedSubCategory(undefined);
      setDeleteModalOpen(false);
      await fetchCategory(depth, page, pageLimit);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  const deleteGroupCategory = async (id: string) => {
    let apiService = new APICallService(
      master.deleteGroupCategory,
      id,
      '',
      '',
      true,
      '',
      Category
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteCategory);
      setSelectedGroupCategory(undefined);
      setDeleteModalOpen(false);
      await fetchCategory(depth, page, pageLimit);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  return (
    <>
      {selectedCategory && deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          onHide={() => {
            setSelectedCategory(undefined);
            setError(undefined);
            setDeleteModalOpen(false);
          }}
          flag={true}
          deleteId={selectedCategory}
          handleDelete={deletePrimaryCategory}
          title="Category"
          deleteText1={CategoryString.deleteFlag1}
          error={error}
        />
      )}
      {selectedSubCategory && deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          onHide={() => {
            setSelectedSubCategory(undefined);
            setError(undefined);
            setDeleteModalOpen(false);
          }}
          flag={true}
          deleteId={selectedSubCategory}
          handleDelete={deleteSubCategory}
          title="Subcategory"
          deleteText1={CategoryString.deleteFlag1}
          error={error}
        />
      )}
      {selectedGroupCategory && deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          onHide={() => {
            setSelectedGroupCategory(undefined);
            setError(undefined);
            setDeleteModalOpen(false);
          }}
          flag={true}
          deleteId={selectedGroupCategory}
          handleDelete={deleteGroupCategory}
          title="Group category"
          deleteText1={CategoryString.deleteFlag1}
          error={error}
        />
      )}
      <Row className="align-items-center ">
        <Col
          md
          className="align-self-center my-6"
        >
          <h1 className="fs-22 fw-bolder mb-0">{CategoryString.title}</h1>
        </Col>
        {loading ? (
          <></>
        ) : category && category.length > 0 ? (
          <Col sm="auto">
            {Method.hasPermission(Category, Add, currentUser) ? (
              <div className="border border-r10px w-fit-content text-white">
                <CustomSelectGreen
                  minHeight={'50px'}
                  marginLeft={'-150px'}
                  isSearchable={false}
                  placeholder={
                    <>
                      <span className="fs-16 fw-bolder text-white">
                        {CategoryString.addNew}
                      </span>
                    </>
                  }
                  default={{
                    value: 'AddPrimaryCategoryDefault',
                    name: 'AddPrimaryCategoryDefault',
                    label: (
                      <>
                        <span className="fs-16 fw-600 ">
                          {CategoryString.addPrimaryCategory}
                        </span>
                      </>
                    ),
                  }}
                  options={[
                    {
                      value: '0',
                      name: 'AddPrimaryCategory',
                      label: (
                        <>
                          <Link
                            to="/master/add-primary-categories"
                            className="fs-14 text-active-white text-black"
                          >
                            <span>{CategoryString.addPrimaryCategory}</span>
                          </Link>
                        </>
                      ),
                    },
                    {
                      value: '1',
                      name: 'AddSubCategory',
                      label: (
                        <>
                          <Link
                            to="/master/add-sub-categories"
                            className="fs-14 text-active-white text-black"
                          >
                            <span>{CategoryString.addSubCategory}</span>
                          </Link>
                        </>
                      ),
                    },
                    {
                      value: '2',
                      name: 'AddGroupCategory',
                      label: (
                        <>
                          <Link
                            to="/master/add-group-categories"
                            className="fs-14 text-active-white text-black"
                          >
                            <span>{CategoryString.addGroupCategory}</span>
                          </Link>
                        </>
                      ),
                    },
                  ]}
                  isMulti={false}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <></>
            )}
          </Col>
        ) : (
          <>
            <Col
              lg={12}
              className="mt-5"
            >
              <div className="border border-r10px p-md-9 p-7">
                <h2 className="fs-22 fw-bolder">
                  {CategoryString.startAdding}
                </h2>
                <p className="fs-18 fw-500">{CategoryString.bodyTitle}</p>
                <Link
                  to="/master/add-primary-categories"
                  className="btn btn-primary btn-lg fs-16 fw-600"
                >
                  {CategoryString.addPrimaryCategory}
                </Link>
              </div>
            </Col>
          </>
        )}
        <Col lg={12}>
          {loading ? (
            <>
              <div className="d-flex justify-content-center m-4 ">
                <Loader loading={loading} />
              </div>
            </>
          ) : (
            <>
              {category && category.length > 0 ? (
                <>
                  <Card className="card-custom categories-card border border-r10px">
                    <Card.Header className="min-h-65px">
                      <h3 className="card-title fs-16 fw-600">
                        {CategoryString.allCategory}
                      </h3>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {!loading ? (
                        category.length > 0 &&
                        category.map(
                          (primaryVal: any, primaryIndex: number) => {
                            return (
                              <div
                                className="accordion"
                                id={'kt_accordion_' + primaryVal._id}
                                key={primaryVal._id}
                              >
                                <div className="accordion-item">
                                  <div
                                    className={clsx(
                                      primaryVal.categories.length
                                        ? 'accordion-header'
                                        : ' accordion-header accordion-header-white'
                                    )}
                                    id={'accordion_' + primaryVal._id}
                                  >
                                    <Row className="align-items-center p-0">
                                      <Col
                                        xs
                                        className="pe-0"
                                      >
                                        <button
                                          // className="accordion-button fs-16 fw-600 pe-0 border-bottom-0 collapsed"
                                          className={clsx(
                                            primaryVal.categories.length
                                              ? 'accordion-button'
                                              : 'accordion-button accordion-button-white',
                                            'fs-16 fw-600 pe-0 border-bottom-0 collapsed'
                                          )}
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target={
                                            '#body_accordion_' + primaryVal._id
                                          }
                                          aria-expanded="false"
                                          aria-controls={
                                            'body_accordion_' + primaryVal._id
                                          }
                                        >
                                          <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                            <img
                                              className="img-fluid"
                                              src={primaryVal.image}
                                              alt=""
                                            />
                                          </span>
                                          <span className="w-100">
                                            {primaryVal.title}
                                          </span>
                                        </button>
                                      </Col>
                                      <Col xs="auto">
                                        <div className="my-0 float-end">
                                          {Method.hasPermission(
                                            Category,
                                            Edit,
                                            currentUser
                                          ) ||
                                          Method.hasPermission(
                                            Category,
                                            Delete,
                                            currentUser
                                          ) ? (
                                            <CustomSelectTable
                                              marginLeft={'-110px'}
                                              placeholder={
                                                <img
                                                  className="me-3"
                                                  width={24}
                                                  height={5}
                                                  src={ThreeDotMenu}
                                                  alt=""
                                                />
                                              }
                                              backgroundColor={
                                                primaryVal.categories.length
                                                  ? '#f9f9f9'
                                                  : '#fff'
                                              }
                                              options={
                                                primaryVal?.isRecipe
                                                  ? options.filter(
                                                      (item: any) =>
                                                        item.value != 2
                                                    )
                                                  : options
                                              }
                                              show={primaryVal._id === id}
                                              onMenuClose={() => {
                                                onMenuClose();
                                              }}
                                              openMenuOnClick={() => {
                                                openMenuOnClick(primaryVal._id);
                                              }}
                                              onMenuOpen={() => {
                                                onMenuOpen(primaryVal._id);
                                              }}
                                              onChange={(event: any) => {
                                                handleOption(event, primaryVal);
                                              }}
                                            />
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  {primaryVal.categories.length > 0 &&
                                    primaryVal.categories.map(
                                      (subVal: any, subIndex: number) => {
                                        return (
                                          <div
                                            key={subVal._id}
                                            id={
                                              'body_accordion_' + primaryVal._id
                                            }
                                            className="accordion-collapse collapse"
                                            aria-labelledby={
                                              'accordion_' + subVal._id
                                            }
                                            data-bs-parent={
                                              '#kt_accordion_' + subVal._id
                                            }
                                          >
                                            <div className="accordion-body p-0">
                                              <div className="accordion-item">
                                                {/* {subVal.categories.length > 0 ?} */}
                                                <div
                                                  className={clsx(
                                                    subVal.categories.length
                                                      ? 'accordion-header'
                                                      : ' accordion-header accordion-header-white'
                                                  )}
                                                  id={
                                                    'accordion_primary_' +
                                                    subVal._id
                                                  }
                                                >
                                                  <Row className="align-items-center p-0">
                                                    <Col xs>
                                                      <button
                                                        className={clsx(
                                                          subVal.categories
                                                            .length
                                                            ? 'accordion-button'
                                                            : 'accordion-button accordion-button-white',
                                                          'fs-16 fw-600 pe-0 border-top-0 border-bottom-0 ps-18 collapsed'
                                                        )}
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={
                                                          '#body_accordion_primary_' +
                                                          subVal._id
                                                        }
                                                        aria-expanded="false"
                                                        aria-controls={
                                                          'body_accordion_primary_' +
                                                          subVal._id
                                                        }
                                                      >
                                                        <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                                          <img
                                                            className="img-fluid"
                                                            src={subVal.image}
                                                            alt=""
                                                          />
                                                        </span>
                                                        <span className="w-100">
                                                          {subVal.title}
                                                        </span>
                                                      </button>
                                                    </Col>
                                                    <Col
                                                      xs="auto"
                                                      className="ps-0"
                                                    >
                                                      {/* begin::Menu */}
                                                      <div className="my-0 float-end">
                                                        {Method.hasPermission(
                                                          Category,
                                                          Edit,
                                                          currentUser
                                                        ) ||
                                                        Method.hasPermission(
                                                          Category,
                                                          Delete,
                                                          currentUser
                                                        ) ? (
                                                          <CustomSelectTable
                                                            marginLeft={
                                                              '-110px'
                                                            }
                                                            placeholder={
                                                              <img
                                                                className="me-3"
                                                                width={24}
                                                                height={5}
                                                                src={
                                                                  ThreeDotMenu
                                                                }
                                                                alt=""
                                                              />
                                                            }
                                                            backgroundColor={
                                                              subVal.categories
                                                                .length
                                                                ? '#f9f9f9'
                                                                : '#fff'
                                                            }
                                                            options={options}
                                                            show={
                                                              subVal._id ===
                                                              subId
                                                            }
                                                            onMenuClose={() => {
                                                              onSecondaryMenuClose();
                                                            }}
                                                            openMenuOnClick={() => {
                                                              openSecondaryMenuOnClick(
                                                                subVal._id
                                                              );
                                                            }}
                                                            onMenuOpen={() => {
                                                              onSecondaryMenuOpen(
                                                                subVal._id
                                                              );
                                                            }}
                                                            onChange={(
                                                              event: any
                                                            ) => {
                                                              handleSecondaryOption(
                                                                event,
                                                                subVal,
                                                                primaryVal
                                                              );
                                                            }}
                                                          />
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </div>
                                                {subVal.categories.length > 0 &&
                                                  subVal.categories.map(
                                                    (
                                                      groupVal: any,
                                                      groupIndex: number
                                                    ) => {
                                                      return (
                                                        <div
                                                          key={groupVal._id}
                                                          id={
                                                            'body_accordion_primary_' +
                                                            subVal._id
                                                          }
                                                          className="accordion-collapse collapse "
                                                          aria-labelledby={
                                                            'accordion_primary_' +
                                                            subVal._id
                                                          }
                                                          data-bs-parent={
                                                            '#kt_accordion_primary_' +
                                                            subVal._id
                                                          }
                                                        >
                                                          <div
                                                            className={clsx(
                                                              'accordion-body border-bottom ps-20 p-3'
                                                            )}
                                                          >
                                                            <div
                                                              className={clsx(
                                                                'd-flex justify-content-between h-58px pe-0'
                                                              )}
                                                            >
                                                              <div className="d-flex align-items-center fs-16 fw-600  ms-6">
                                                                <div className="symbol symbol-35px">
                                                                  <div className="symbol-label bg-body border fs-16 fw-600 text-gray me-3">
                                                                    {groupIndex +
                                                                      1}
                                                                  </div>
                                                                </div>
                                                                <span className="w-100">
                                                                  {
                                                                    groupVal.title
                                                                  }
                                                                </span>
                                                              </div>
                                                              <div className="d-flex align-items-center fs-16 fw-600 ml-5">
                                                                <div className="d-flex  align-items-center  fs-16 fw-600">
                                                                  {Method.hasPermission(
                                                                    Category,
                                                                    Edit,
                                                                    currentUser
                                                                  ) ||
                                                                  Method.hasPermission(
                                                                    Category,
                                                                    Delete,
                                                                    currentUser
                                                                  ) ? (
                                                                    <CustomSelectTable
                                                                      marginLeft={
                                                                        '-110px'
                                                                      }
                                                                      placeholder={
                                                                        <img
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
                                                                      backgroundColor="white"
                                                                      options={
                                                                        options
                                                                      }
                                                                      show={
                                                                        groupVal._id ===
                                                                        groupId
                                                                      }
                                                                      onMenuClose={() => {
                                                                        onGroupMenuClose();
                                                                      }}
                                                                      openMenuOnClick={() => {
                                                                        openGroupMenuOnClick(
                                                                          groupVal._id
                                                                        );
                                                                      }}
                                                                      onMenuOpen={() => {
                                                                        onGroupMenuOpen(
                                                                          groupVal._id
                                                                        );
                                                                      }}
                                                                      onChange={(
                                                                        event: any
                                                                      ) => {
                                                                        handleGroupOption(
                                                                          event,
                                                                          groupVal,
                                                                          primaryVal,
                                                                          subVal
                                                                        );
                                                                      }}
                                                                    />
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="d-flex justify-content-center m-4">
                          <Spinner
                            animation="border"
                            variant="primary"
                          />
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </Col>
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
      </Row>
    </>
  );
};
export default AllCategories;
