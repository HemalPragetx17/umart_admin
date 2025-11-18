import { Card, Col, FormLabel, Row } from 'react-bootstrap';
import {
  DeliverString,
  PromotionAndCampaignString,
} from '../../../utils/string';
import { Link, useNavigate } from 'react-router-dom';
import { KTSVG } from '../../../umart_admin/helpers';
import {
  Add,
  AllRecipesConst,
  Delete,
  Edit,
  PAGE_LIMIT,
  Veg,
  View,
} from '../../../utils/constants';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import Loader from '../../../Global/loader';
import { useEffect, useState } from 'react';
import CustomDeleteModal from '../../modals/custom-delete-modal';
import { IOption } from '../../../types/responseIndex';
import Pagination from '../../../Global/pagination';
import { getKey, setKey } from '../../../Global/history';
import { recipeListStoreString } from '../../../utils/storeString';
import { useAuth } from '../auth';
import FoodImage from '../../../umart_admin/assets/media/food/roll.png';
import APICallService from '../../../api/apiCallService';
import { recipeEndpoints } from '../../../api/apiEndPoints';
import { useDebounce } from '../../../utils/useDebounce';
import { CustomComponentSelect } from '../../custom/Select/CustomComponentSelect';
import { recipeToast } from '../../../utils/toast';
import { success } from '../../../Global/toast';
import Method from '../../../utils/methods';
const AllRecipes = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [currentRecipe, setCurrentRecipe] = useState<any>();
  const [page, setPage] = useState(getKey(recipeListStoreString.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(recipeListStoreString.limit) || PAGE_LIMIT
  );
  const [searchTerm, setSearchTerm] = useState(
    getKey(recipeListStoreString.search) || ''
  );
  const [recipeTypes, setREcipeTypes] = useState<IOption | undefined>();
  const [totalRecords, setTotalRecords] = useState(0);
  const [options, setOptions] = useState<any>([
    {
      label: (
        <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
          {'Edit details'}
        </button>
      ),
      value: 1,
    },
    {
      value: 2,
      label: (
        <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4">
          {'Delete recipe'}
        </button>
      ),
    },
  ]);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>(
    getKey(recipeListStoreString.categoryFilter) || []
  );
  const [selectedRecipeTypes, setSelectedRecipeTypes] = useState<any>(
    getKey(recipeListStoreString.recipeTypeFilter) || []
  );
  useEffect(() => {
    (async () => {
      if (!Method.hasModulePermission(AllRecipesConst, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchRecipeList(
        page,
        pageLimit,
        searchTerm,
        selectedCategories,
        selectedRecipeTypes
      );
      await fetchInitData();
      await fetchRecipeTypesList();
      setTimeout(() => {
        const pos = getKey(recipeListStoreString.scrollPosition);
        window.scrollTo(0, pos);
      }, 500);
    })();
  }, []);
  const fetchRecipeList = async (
    page: number,
    pageLimit: number,
    searchTerm: string = '',
    category?: any,
    recipeTypes?: any
  ) => {
    setLoading(true);
    let params: any = {
      pageNo: page,
      limit: pageLimit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      searchTerm: searchTerm || '',
    };
    if (category) {
      category.forEach((item: any, index: number) => {
        params[`categories[${index}]`] = item.value;
      });
    }
    if (recipeTypes) {
      recipeTypes.forEach((item: any, index: number) => {
        params[`recipeType[${index}]`] = item.value;
      });
    }
    const apiCallService = new APICallService(
      recipeEndpoints.recipeList,
      params,
      '',
      '',
      false,
      '',
      AllRecipesConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setTotalRecords(response.total);
      setRecipeList(response.records);
    }
    setLoading(false);
  };
  const fetchInitData = async () => {
    setLoading(true);
    const apiCallService = new APICallService(
      recipeEndpoints.initData,
      {},
      '',
      '',
      false,
      '',
      AllRecipesConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const temp = response.category[0].categories.map((item: any) => {
        return {
          title: item?.title || '',
          name: item?.title || '',
          value: item?._id || '',
          id: item?._id,
          _id: item?._id,
          img: item.image,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px symbol-circle border me-2">
                <img
                  src={item.image}
                  className="object-fit-cover"
                  alt=""
                />
              </span>
              <label
                className="form-check-label fs-16 fw-600 text-dark"
                htmlFor="Ex2"
              >
                {item.title}
              </label>
            </>
          ),
        };
      });
      setCategories(temp);
    }
    setLoading(false);
  };
  const fetchRecipeTypesList = async () => {
    setLoading(true);
    const apiCallService = new APICallService(
      recipeEndpoints.recipeTypesList,
      {},
      '',
      '',
      false,
      '',
      AllRecipesConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const temp = response.map((item: any) => {
        return {
          title: item || '',
          name: item || '',
          value: item || '',
          id: item,
          label: (
            <>
              <label
                className="form-check-label fs-16 fw-600 text-dark"
                htmlFor="Ex2"
              >
                {item}
              </label>
            </>
          ),
          img: '',
        };
      });
      setREcipeTypes(temp);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(AllRecipesConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(AllRecipesConst, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-danger ms-3 p-4  ">
            Delete details
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const debounce = useDebounce(fetchRecipeList, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearchTerm(input);
    setPage(1);
    setKey(recipeListStoreString.page, 1);
    if (input.trim().length > 2 && searchTerm !== input) {
      await debounce(
        1,
        pageLimit,
        input,
        selectedCategories,
        selectedRecipeTypes
      );
    } else if (input.trim().length <= 2 && input.length < searchTerm.length) {
      await debounce(
        1,
        pageLimit,
        input,
        selectedCategories,
        selectedRecipeTypes
      );
    }
    setKey(recipeListStoreString.search, input);
  };
  const handleOptionChange = (event: any, data: any) => {
    if (event.value === 1) {
      setKey(recipeListStoreString.scrollPosition, window.scrollY.toString());
      navigate('/all-recipes/edit-recipe', {
        state: {
          id: data._id,
        },
      });
    } else if (event.value === 2) {
      setShowModal(true);
      setCurrentRecipe(data);
    }
  };
  const handleDetails = (event: any) => {
    setKey(recipeListStoreString.scrollPosition, window.scrollY.toString());
    navigate('/all-recipes/recipe-details', { state: { id: event._id } });
  };
  const handleModalClose = () => {
    setCurrentRecipe(undefined);
    setShowModal(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(recipeListStoreString.page, val);
    await fetchRecipeList(
      val,
      pageLimit,
      searchTerm,
      selectedCategories,
      selectedRecipeTypes
    );
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(recipeListStoreString.page, val + 1);
    await fetchRecipeList(
      val + 1,
      pageLimit,
      searchTerm,
      selectedCategories,
      selectedRecipeTypes
    );
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(recipeListStoreString.page, val - 1);
    await fetchRecipeList(
      val - 1,
      pageLimit,
      searchTerm,
      selectedCategories,
      selectedRecipeTypes
    );
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(recipeListStoreString.page, 1);
    setKey(recipeListStoreString.limit, parseInt(event.target.value));
    setPageLimit(parseInt(event.target.value));
    await fetchRecipeList(
      1,
      event.target.value,
      searchTerm,
      selectedCategories,
      selectedRecipeTypes
    );
  };
  const handleRecipeTypeChange = async (event: IOption[]) => {
    setPage(1);
    setSelectedRecipeTypes(event);
    setKey(recipeListStoreString.page, 1);
    await fetchRecipeList(1, pageLimit, searchTerm, selectedCategories, event);
    setKey(recipeListStoreString.recipeTypeFilter, event);
  };
  const handleCategoryChange = async (event: any) => {
    setSelectedCategories(event);
    setPage(1);
    setKey(recipeListStoreString.page, 1);
    await fetchRecipeList(1, pageLimit, searchTerm, event, selectedRecipeTypes);
    setKey(recipeListStoreString.categoryFilter, event);
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      recipeEndpoints.deleteRecipeDetails,
      currentRecipe?._id,
      {},
      '',
      false,
      '',
      AllRecipesConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(recipeToast.recipeDeleted);
      handleModalClose();
      setPage(1);
      setKey(recipeListStoreString.page, 1);
      await fetchRecipeList(
        1,
        pageLimit,
        searchTerm,
        selectedCategories,
        selectedRecipeTypes
      );
    }
  };
  return (
    <>
      {currentRecipe && showModal ? (
        <CustomDeleteModal
          show={showModal}
          onHide={handleModalClose}
          title={`Are you sure you want to delete ${
            currentRecipe?.title || ''
          }`}
          btnTitle="Yes, Delete"
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center mt-0 pt-0">
        <Col
          md
          className="align-self-center my-1"
        >
          <h1 className="fs-22 fw-bolder mb-0">{'All Recipes'}</h1>
        </Col>
        <Col sm="auto">
          {Method.hasPermission(AllRecipesConst, Add, currentUser) ? (
            <Link
              to="/all-recipes/add-recipe"
              className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
            >
              {'Add new recipe'}
            </Link>
          ) : (
            <></>
          )}
        </Col>
        <Col
          xs={12}
          className="mt-5"
        >
          <Card className="bg-light border mb-7">
            <Card.Body className="px-7">
              <Row className="align-items-center g-5 ">
                <Col
                  md={4}
                  lg={4}
                  xl={4}
                >
                  {/* <FormLabel className="fs-16 fw-500 text-dark">
                    {'Search'}
                  </FormLabel> */}
                  <div className="d-flex align-items-center position-relative me-lg-4">
                    <KTSVG
                      path="/media/icons/duotune/general/gen021.svg"
                      className="svg-icon-3 position-absolute ms-3"
                    />
                    <input
                      type="text"
                      id="kt_filter_search"
                      className="form-control form-control-white min-h-60px form-control-lg ps-10 custom-placeholder"
                      placeholder="Search by title"
                      onChange={(event: any) => {
                        handleSearch(event.target.value.trimStart());
                      }}
                      value={searchTerm}
                    />
                  </div>
                </Col>
                <Col
                  md={4}
                  lg={4}
                  xl={5}
                  className="d-flex justify-content-end align-items-center"
                >
                  <FormLabel className="fs-16 fw-500 text-dark me-4 d-inline">
                    {'Filter by recipes'}
                  </FormLabel>
                  <div className='min-w-250px'>
                    <CustomComponentSelect
                      // disabled={loading}
                      // isLoading={fetchLoader}
                      closeMenuOnSelect={false}
                      options={categories || []}
                      isSearchable={true}
                      onChange={(event: any) => {
                        handleCategoryChange(event);
                      }}
                      hideSelectedOptions={false}
                      placeholder="Filter by category"
                      value={selectedCategories}
                      isMulti={true}
                    />
                  </div>
                </Col>
                <Col
                  md={4}
                  lg={4}
                  xl={3}
                >
                  {
                    <>
                      {' '}
                      {/* <FormLabel className="fs-16 fw-500 text-dark">
                        {'Filter by status'}
                      </FormLabel> */}
                      <CustomComponentSelect
                        placeholder={'Select recipe type'}
                        options={recipeTypes}
                        onChange={(event: IOption[]) => {
                          handleRecipeTypeChange(event);
                        }}
                        isSearchable={true}
                        value={selectedRecipeTypes}
                        isMulti={true}
                        hideSelectedOptions={false}
                        closeMenuOnSelect={false}
                        // isClearable={Object.keys(productState).length}
                      />
                    </>
                  }
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <>
            <Card className="border border-r10px ">
              <Card.Body className=" pb-0 pt-0">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gy-4 mb-0">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-50px align-middle">
                        <th className="min-w-200px">{'Recipes'}</th>
                        <th className="min-w-160px">{'Category'}</th>
                        <th className="min-w-100px ">{'Type'}</th>
                        <th className="min-w-100px text-center">
                          {PromotionAndCampaignString.actions}
                        </th>
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
                          {recipeList.length ? (
                            <>
                              {recipeList.map(
                                (customVal: any, customIndex: number) => {
                                  return (
                                    <tr key={customIndex}>
                                      <td className="py-2">
                                        <div className="d-flex">
                                          <div className="symbol symbol-50px border border-r10px  bgi-contain me-3">
                                            <div
                                              className="symbol-label bgi-cover w-50px"
                                              style={{
                                                backgroundImage: `url('${
                                                  customVal?.media[0]?.url ||
                                                  FoodImage
                                                }')`,
                                              }}
                                            ></div>
                                          </div>
                                          <div>
                                            <span className="fs-15 fw-600 d-block">
                                              {customVal?.title}
                                            </span>
                                            <span className="fs-15 fw-400 text-gray-600">
                                              {'Serving ' +
                                                customVal?.serving || 0}
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center align-items-center w-fit-content bg-efefef py-3 rounded-2 me-1 px-3">
                                          <span className="fw-600 text-black fs-16 text-center">
                                            {customVal?.subCategory?.title ||
                                              ''}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <span
                                          className={`fs-16 fw-600 ${
                                            customVal?.foodType == Veg
                                              ? 'text-primary'
                                              : 'text-danger'
                                          }`}
                                        >
                                          {customVal?.recipeType.map(
                                            (item: any, index: number) =>
                                              index !==
                                              customVal?.recipeType.length - 1
                                                ? item?.option + ' , '
                                                : item?.option
                                          ) || ''}
                                        </span>
                                      </td>
                                      <td className="">
                                        <div className="d-flex flex-nowrap justify-content-end justify-content-xl-end align-items-center">
                                          {Method.hasPermission(
                                            AllRecipesConst,
                                            View,
                                            currentUser
                                          ) ? (
                                            <button
                                              className="btn btn-primary fs-14 fw-600 me-5"
                                              style={{
                                                whiteSpace: 'nowrap',
                                              }}
                                              onClick={() => {
                                                handleDetails(customVal);
                                              }}
                                            >
                                              {DeliverString.viewDetails}
                                            </button>
                                          ) : (
                                            <></>
                                          )}
                                          {Method.hasPermission(
                                            AllRecipesConst,
                                            Edit,
                                            currentUser
                                          ) ||
                                          Method.hasPermission(
                                            AllRecipesConst,
                                            Delete,
                                            currentUser
                                          ) ? (
                                            <div
                                              className={`${
                                                customVal.deleted
                                                  ? 'invisible'
                                                  : ''
                                              }`}
                                            >
                                              <CustomSelectTable
                                                marginLeft={'-100px'}
                                                width="auto"
                                                placeholder={
                                                  <img
                                                    className="img-fluid"
                                                    width={22}
                                                    height={5}
                                                    src={ThreeDotMenu}
                                                    alt=""
                                                  />
                                                }
                                                // menuIsOpen={customVal._id === bannerId}
                                                // openMenuOnClick={() => {
                                                //   openMenuOnClick(customVal._id);
                                                // }}
                                                // onMenuOpen={() => {
                                                //   onMenuOpen(customVal._id);
                                                // }}
                                                backgroundColor="transparent"
                                                // openMenuOnClick={true}
                                                options={options}
                                                onChange={(event: any) => {
                                                  handleOptionChange(
                                                    event,
                                                    customVal
                                                  );
                                                }}
                                              />
                                            </div>
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
                              <td colSpan={6}>
                                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                  No Data Found
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
          </>
        </Col>
      </Row>
    </>
  );
};
export default AllRecipes;
