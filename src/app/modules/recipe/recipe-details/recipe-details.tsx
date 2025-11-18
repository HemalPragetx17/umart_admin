import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Loader from '../../../../Global/loader';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import GeneralInfo from './general-info';
import Ingredients from './ingredients';
import APICallService from '../../../../api/apiCallService';
import { recipeEndpoints } from '../../../../api/apiEndPoints';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDot from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import { success } from '../../../../Global/toast';
import { recipeToast } from '../../../../utils/toast';
import { AllRecipesConst, Delete, Edit } from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import { useAuth } from '../../auth';
const RecipeDetails = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const [fetchLoader, setaFetchLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState<any>();
  const [options, setOptions] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState([
    {
      name: 'General info',
      content: <GeneralInfo recipeData={recipeData} />,
      value: 0,
    },
    {
      name: 'Ingredients',
      content: <Ingredients recipeData={recipeData} />,
      value: 1,
    },
  ]);
  const [currentTab, setCurrentTab] = useState<any>({
    name: 'General info',
    content: <GeneralInfo recipeData={recipeData} />,
    value: 0,
  });
  const [disabled, setDisabled] = useState(false);
  const [id, setId] = useState(location?.state?.id || '');
  const {currentUser} = useAuth();
  useEffect(() => {
    (async () => {
     if (!location?.state) {
       return window.history.back();
     }
      setaFetchLoader(true);
      await fetchRecipeDetails();
      updateOptionWithPermission();
      setaFetchLoader(false);
    })();
  }, []);
  const fetchRecipeDetails = async () => {
    const apiCallService = new APICallService(
      recipeEndpoints.recipeDetails,
      location?.state?.id || id,
      '',
      '',
      false,
      '',
      AllRecipesConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setRecipeData(response);
      setCurrentTab({
        name: 'General info',
        content: <GeneralInfo recipeData={response} />,
        value: 0,
      });
    }
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(AllRecipesConst, Edit, currentUser)) {
    tempOptions.push({
      label: (
        <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
          {'Edit recipe'}
        </button>
      ),
      value: 1,
    });
    }
    if (Method.hasPermission(AllRecipesConst, Delete, currentUser)) {
    tempOptions.push({
      label: (
        <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
          {'Delete recipe'}
        </button>
      ),
      value: 2,
    });
    }
    setOptions(tempOptions);
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
  const handleSelectTab = (tab: any) => {
    if (tab.value === 0) {
      setNavTab(0);
    } else if (tab.value === 1) {
      setNavTab(1);
    }
  };
  const setNavTab = (value: any) => {
    let tabTemp = [...tab];
    let currentTab = {};
    switch (value) {
      case 0:
        currentTab = {
          name: 'General info',
          content: <GeneralInfo recipeData={recipeData} />,
          value: 0,
        };
        break;
      case 1:
        currentTab = {
          name: 'Ingredients',
          content: <Ingredients recipeData={recipeData} />,
          value: 1,
        };
        break;
    }
    setCurrentTab(currentTab);
    setTab(tabTemp);
  };
  const handleSubmit = async () => {};
  const handleOptionChange = (event: any) => {
    if (event.value === 1) {
      // setKey(listPromotionCampaign.scrollPosition, window.scrollY.toString());
      navigate('/all-recipes/edit-recipe', {
        state: {
          id: id,
        },
      });
    } else if (event.value === 2) {
      setShowModal(true);
    }
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      recipeEndpoints.deleteRecipeDetails,
      id,
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
      navigate('/all-recipes');
    }
  };
  return (
    <div>
      {showModal ? (
        <CustomDeleteModal
          show={showModal}
          onHide={handleModalClose}
          title={`Are you sure you want to delete ${recipeData?.title || ''}`}
          btnTitle="Yes, Delete"
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      {!fetchLoader ? (
        <>
          <Row className="mb-5">
            <Col sm>
              <h1 className="fs-22 fw-bolder">{recipeData?.title || ''}</h1>
            </Col>
            <Col sm="auto">
              <div className="d-inline-flex">
                <div className="my-0 pe-2">
                  {Method.hasPermission(AllRecipesConst, Edit, currentUser) ||
                  Method.hasPermission(AllRecipesConst, Delete, currentUser) ? (
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
                    onChange={(event: any, index: number, data: any) => {
                      handleOptionChange(event);
                    }}
                  />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Col>
          </Row>
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
                </div>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <div className="d-flex justify-content-center">
          <Loader loading={fetchLoader} />
        </div>
      )}
    </div>
  );
};
export default RecipeDetails;
