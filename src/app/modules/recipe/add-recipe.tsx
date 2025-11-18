import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Loader from '../../../Global/loader';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import GeneralInfo from './add-tab/general-info';
import Ingredients from './add-tab/ingredients';
import APICallService from '../../../api/apiCallService';
import { master, recipeEndpoints } from '../../../api/apiEndPoints';
import { Add, AllRecipesConst, Category } from '../../../utils/constants';
import Validations from '../../../utils/validations';
import { recipeApiJson } from '../../../api/apiJSON/recipeJSON';
import { recipeToast } from '../../../utils/toast';
import { success } from '../../../Global/toast';
import Method from '../../../utils/methods';
import { useAuth } from '../auth';
const AddRecipe = () => {
  const navigate = useNavigate();
  const [fetchLoader, setFetchLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState<any>();
  const [recipeData, setRecipeData] = useState<any>({
    category: {
      title: initData?.title || '',
      id: initData?._id || '',
    },
    subCategory: '',
    title: '',
    serving: '',
    cookTime: '',
    description: '',
    foodType: '',
    media: [],
    recipeType: [],
    ingredients: [
      {
        title: '',
        category: '',
        subCategory: '',
        variants: [],
        subCategoryList: [],
        products: []
      },
    ],
  });
  const [validations, setValidations] = useState<{
    subCategory: boolean;
    title: boolean;
    serving: boolean;
    description: boolean;
    foodType: boolean;
    media: boolean;
    recipeType: boolean;
    cookTime: boolean;
    recipeSteps: boolean;
    ingredients: [
      {
        title: boolean;
        category: boolean;
        subCategory: boolean;
        variants: boolean;
      }
    ];
  }>({
    subCategory: false,
    title: false,
    serving: false,
    description: false,
    foodType: false,
    media: false,
    recipeType: false,
    cookTime: false,
    recipeSteps: false,
    ingredients: [
      {
        title: false,
        category: false,
        subCategory: false,
        variants: false,
      },
    ],
  });
  const [recipeSteps, setRecipeSteps] = useState<any>('');
  const [primaryCategory, setPrimaryCategory] = useState<any>([]);
  const [tab, setTab] = useState([
    {
      name: 'General info',
      content: (
        <GeneralInfo
          initData={initData}
          recipeData={recipeData}
          recipeSteps={recipeSteps}
          setRecipeSteps={handleRecipeSteps}
          handleRecipeData={handleRecipeData}
          validations={validations}
        />
      ),
      value: 0,
    },
    {
      name: 'Ingredients',
      content: (
        <Ingredients
          recipeData={recipeData}
          handleRecipeData={handleRecipeData}
          handleIngredientChanges={handleIngredientChanges}
          primaryCategory={primaryCategory}
          validations={validations}
          handleValidations={validationChange}
        />
      ),
      value: 1,
    },
  ]);
  const [currentTab, setCurrentTab] = useState<any>({
    name: 'General info',
    content: (
      <GeneralInfo
        initData={initData}
        recipeData={recipeData}
        recipeSteps={recipeSteps}
        setRecipeSteps={handleRecipeSteps}
        handleRecipeData={handleRecipeData}
        validations={validations}
      />
    ),
    value: 0,
  });
  const [disabled, setDisabled] = useState(false);
  const { currentUser } = useAuth();
  useEffect(() => {
    (async () => {
      if (!Method.hasPermission(AllRecipesConst, Add, currentUser)) {
        return window.history.back();
      }
      setFetchLoader(true);
      await fetchInitData();
      await fetchPrimaryCategory(2);
      setFetchLoader(false);
    })();
  }, []);
  useEffect(() => {
    setNavTab(currentTab.value, recipeData, validations);
  }, [recipeData, recipeSteps]);
  useEffect(() => {
    setNavTab(currentTab.value, recipeData, validations);
  }, [validations]);
  const fetchInitData = async () => {
    setFetchLoader(true);
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
      const temp: any = {};
      temp.categories = response.category[0].categories.map((item: any) => {
        return {
          label: item?.title || '',
          title: item?.title || '',
          value: item?._id || '',
        };
      });
      temp.serving = response.serving.map((item: any) => {
        return {
          label: item?.serving.toString() || '',
          title: item?.serving.toString() || '',
          value: item?.serving.toString() || '',
        };
      });
      const tempRecipeData = {
        ...recipeData,
      };
      tempRecipeData.category.title = response?.category[0]?.title;
      tempRecipeData.category.id = response?.category[0]?._id;
      setCurrentTab({
        name: 'General info',
        content: (
          <GeneralInfo
            initData={temp}
            recipeData={tempRecipeData}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            recipeSteps={recipeSteps}
            setRecipeSteps={handleRecipeSteps}
            handleRecipeData={handleRecipeData}
            validations={validations}
          />
        ),
        value: 0,
      });
      setInitData(temp);
      setRecipeData(tempRecipeData);
    }
    setFetchLoader(false);
  };
  const fetchPrimaryCategory = async (categoriesDepth: number) => {
    let params = {
      needCount: true,
      categoriesDepth: categoriesDepth,
    };
    let apiService = new APICallService(
      master.categoryList,
      params,
      '',
      '',
      false,
      '',
      AllRecipesConst
    );
    let response = await apiService.callAPI();
    if (response) {
      let data: any = [...primaryCategory];
      // if (pageNo === 1) {
      //   setTotalRecords(response.total);
      // } else {
      //   let prevTotal = totalRecords;
      //   setTotalRecords(prevTotal);
      // }
      await response.records.map((val: any) => {
        if (val.categories.length) {
          data.push({
            value: val.title,
            name: val.title,
            label: (
              <>
                <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                  <img
                    src={val.image}
                    className="p-1"
                  />
                </span>
                <span className="fs-16 fw-600 text-black ">{val.title}</span>
              </>
            ),
            _id: val._id,
            subCategory: val.categories,
          });
        }
      });
      // setSelectedSubCategory(data[0].subCategory[0]);
      setPrimaryCategory(data);
    }
  };
  const createTabs = () => {
    const localTab = tab;
    let current = currentTab;
    const allTabs = localTab.map((tab: any, index: number) => {
      return (
        <li
          key={index}
          className="nav-item "
        >
          <Link
            to={'/'}
            className={clsx(
              'nav-link ',
              current.name === tab.name
                ? 'active text-active-dark text-dark border-bottom-3 border-primary'
                : 'border-bottom-0 ',
              currentTab.value !== tab.value
                ? disabled
                  ? 'disabled'
                  : ''
                : '',
              loading ? 'disabled' : ''
            )}
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
  function handleRecipeSteps(data: any) {
    setRecipeSteps(data);
    const temp = { ...validations };
    if (data.trim().length === 0 || data == '<p><br></p>') {
      temp.recipeSteps = true;
    } else {
      temp.recipeSteps = false;
    }
    setValidations(temp);
  }
  const handleSelectTab = async (tab: any) => {
    if (tab.value === 0) {
      setNavTab(0, recipeData, validations);
    } else if (tab.value === 1) {
      // const { ingredients,...data } = { ...recipeData };
      const tempValidation: any = {
        ...validations,
        subCategory: recipeData.subCategory.trim().length === 0,
        title: recipeData.title.trim().length === 0 || recipeData.title.trim().length > 200,
        serving: recipeData.serving.trim().length === 0,
        description: recipeData.description.trim().length === 0,
        foodType: recipeData.foodType.length === 0,
        media: recipeData.media.length === 0,
        recipeType: recipeData.recipeType.length === 0,
        cookTime: recipeData?.cookTime.trim().length === 0,
        recipeSteps:
          recipeSteps.trim().length === 0 || recipeSteps == '<p><br></p>',
      };
      const { ingredients, ...data } = tempValidation;
      const isValid = await Validations.validateObject(data);
      if (isValid) {
        setNavTab(1, recipeData, tempValidation);
      }
      setValidations(tempValidation);
    }
  };
  const setNavTab = (value: any, data?: any, newValidations?: any) => {
    let tabTemp = [...tab];
    let currentTab = {};
    switch (value) {
      case 0:
        currentTab = {
          name: 'General info',
          content: (
            <GeneralInfo
              initData={initData}
              recipeData={data}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              handleRecipeData={handleRecipeData}
              validations={newValidations}
              recipeSteps={recipeSteps}
              setRecipeSteps={handleRecipeSteps}
            />
          ),
          value: 0,
        };
        break;
      case 1:
        currentTab = {
          name: 'Ingredients',
          content: (
            <Ingredients
              recipeData={data}
              handleRecipeData={handleRecipeData}
              handleIngredientChanges={handleIngredientChanges}
              primaryCategory={primaryCategory}
              validations={newValidations}
              handleValidations={validationChange}
            />
          ),
          value: 1,
        };
        break;
    }
    setCurrentTab(currentTab);
    setTab(tabTemp);
  };
  const handlePreviousSelectTab = async (tab: any) => {
    setNavTab(tab.value, recipeData, validations);
  };
  const handleSubmit = async () => {
    const tempValidation: any = {
      ...validations,
      subCategory: recipeData.subCategory.trim().length === 0,
      title:
        recipeData.title.trim().length === 0 ||
        recipeData.title.trim().length > 200,
      serving: recipeData.serving.trim().length === 0,
      description: recipeData.description.trim().length === 0,
      foodType: recipeData.foodType.length === 0,
      media: recipeData.media.length === 0,
      recipeType: recipeData.recipeType.length === 0,
      recipeSteps:
        recipeSteps.trim().length === 0 || recipeSteps == '<p><br></p>',
      ingredients: recipeData.ingredients.map((item: any) => {
        return {
          title:
            item.title.trim().length === 0 || item.title.trim().length > 200,
          category: item.category.trim().length === 0,
          subCategory: item.subCategory.trim().length === 0,
          variants: item.variants.length === 0,
        };
      }),
    };
    const { ingredients, ...data } = tempValidation;
    const isValidGeneralInfo = await Validations.validateObject(data);
    const isValidIngredients = ingredients.some(
      (item: any) =>
        item.title || item.category || item.subCategory || item.variants
    );
    if (isValidGeneralInfo && !isValidIngredients) {
      // alert('submit');
      setLoading(true);
      const apiCallService = new APICallService(
        recipeEndpoints.addRecipe,
        recipeApiJson.addRecipe({
          ...recipeData,
          recipeSteps,
        }),
        '',
        '',
        false,
        '',
        AllRecipesConst
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(recipeToast.recipeAdded);
        navigate('/all-recipes');
      }
      setLoading(false);
    }
    setValidations(tempValidation);
  };
  function handleChange(value: any, name: string) {
    const temp = { ...recipeData };
    const tempValidation: any = { ...validations };
    if (name === 'recipeType') {
      temp.recipeType = [...value];
      if (value.length > 0) {
        tempValidation.recipeType = false;
      }
      // else {
      //   tempValidation.recipeType = true;
      // }
    } else {
      temp[name] = value;
      if (value && value.trim().length) {
        tempValidation[name] = false;
      } else {
        tempValidation[name] = true;
      }
    }
    if (name === 'subCategory') {
      temp.recipeType = [];
    }
    setValidations(tempValidation);
    setRecipeData(temp);
  }
  function handleImageChange(data: any) {
    const temp = { ...recipeData };
    const tempValidation = { ...validations };
    // temp.media[index].image = image;
    // temp.media[index].imageReader = imageReader;
    temp.media = [...temp.media, ...data];
    tempValidation.media = false;
    setRecipeData(temp);
    setValidations(tempValidation);
  }
  function handleRecipeData(data: any) {
    setRecipeData(data);
  }
  function handleIngredientChanges(data: any, name: any, index: number) {
    const temp = { ...recipeData };
    const tempValidation: any = { ...validations };
    if (
      name !== 'variants' &&
      name !== 'subCategoryList' &&
      name !== 'products'
    ) {
      temp.ingredients[index][name] = data;
      if (data.trim().length) {
        tempValidation.ingredients[index][name] = false;
      } else {
        tempValidation.ingredients[index][name] = true;
      }
    } else {
      temp.ingredients[index][name] = [...data];
      if (data.length) {
        tempValidation.ingredients[index].variants = false;
      }
      //  else {
      //   tempValidation.ingredients[index].variants = true;
      // }
    }
    // if (name !== 'subCategoryList') {
    //   temp.ingredients[index][name] = [...data];
    // }
    setRecipeData(temp);
    setValidations(tempValidation);
  }
  function validationChange(data: any) {
    setValidations(data);
  }
  return (
    <div>
      {Method.hasPermission(AllRecipesConst, Add, currentUser) ? (
        <>
          <Row className="mb-5">
            <Col sm>
              <h1 className="fs-22 fw-bolder">{'Add new recipe'}</h1>
            </Col>
          </Row>
          {!fetchLoader ? (
            <Row>
              <Col lg={12}>
                <div className="border border-r10px px-lg-9 px-6 mb-8">
                  <Row className="align-items-center">
                    <Col sm>
                      <div className="d-flex flex-md-row h-lg-70px h-md-60px">
                        <ul className="nav nav-stretch nav-line-tabs nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-18 fw-600">
                          {createTabs()}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div
                  className="tab-content"
                  id="myTabContent"
                >
                  <div className="tab-pane fade show active">
                    <>{currentTab.content}</>
                    <Row className="align-items-center mt-8 justify-content-end">
                      <Col xs="auto">
                        {currentTab.value === 0 ? (
                          <></>
                        ) : loading ? (
                          <></>
                        ) : (
                          <>
                            <Button
                              type="button"
                              className="btn btn-lg btn-light btnPrev btn-active-light-primary"
                              onClick={() => {
                                handlePreviousSelectTab(
                                  tab[
                                    tab.findIndex(
                                      (val: any) =>
                                        val.value === currentTab.value
                                    ) - 1
                                  ]
                                );
                              }}
                            >
                              Previous
                            </Button>
                          </>
                        )}
                        <Button
                          type="button"
                          className={clsx(
                            loading ? 'btn btn-lg btnNext' : 'btn btn-lg h-50px'
                          )}
                          onClick={() => {
                            currentTab.value !== 1
                              ? handleSelectTab(
                                  tab[
                                    tab.findIndex(
                                      (val: any) =>
                                        val.value === currentTab.value
                                    ) + 1
                                  ]
                                )
                              : handleSubmit();
                          }}
                          disabled={loading}
                        >
                          {!loading && (
                            <span className="indicator-label">
                              {currentTab.value === 1 ? 'Finish' : 'Next'}
                            </span>
                          )}
                          {loading && (
                            <span
                              className="indicator-progress fs-16 fw-bold"
                              style={{ display: 'block' }}
                            >
                              Please wait...
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <div className="d-flex justify-content-center">
              <Loader loading={fetchLoader} />
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default AddRecipe;
