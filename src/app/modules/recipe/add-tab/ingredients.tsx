import clsx from 'clsx';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CustomComponentAfterSelect } from '../../../custom/Select/CustomComponentAfterSelect';
import { useState } from 'react';
import CrossSVG from '../../../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import CrossGraySVG from '../../../../umart_admin/assets/media/svg_uMart/cross-rounded-gray.svg';
import FoodImg from '../../../../umart_admin/assets/media/food/strawberry.png';
import { Link } from 'react-router-dom';
import APICallService from '../../../../api/apiCallService';
import { product, recipeEndpoints } from '../../../../api/apiEndPoints';
const Ingredients = (props: any) => {
  const [selectProducts, setSelectedProducts] = useState<any>(
    Array.from({ length: 4 })
  );
  const [loading, setLoading] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState<any>([]);
  const [productList, setProductList] = useState<any>([]);
  const handleAddMore = () => {
    const temp = { ...props.recipeData };
    const tempValidation = { ...props.validations };
    temp.ingredients.push({
      title: '',
      category: '',
      subCategory: '',
      variants: [],
      subCategoryList: [],
      products: [],
    });
    tempValidation.ingredients.push({
      title: false,
      category: false,
      subCategory: false,
      variants: false,
    });
    props.handleRecipeData(temp);
    props.handleValidations(tempValidation);
  };
  const handleRemove = (index: number) => {
    const temp = { ...props.recipeData };
    const tempValidation = { ...props.validations };
    temp.ingredients.splice(index, 1);
    tempValidation.ingredients.splice(index, 1);
    props.handleRecipeData(temp);
    props.handleValidations(tempValidation);
  };
  const handlePrimaryCategoryChange = (event: any, index: number) => {
    let subCategoryTemp = event.subCategory.map((val: any) => {
      return {
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
      };
    });
    // setSubCategoryList(subCategoryTemp);
    props.handleIngredientChanges(event._id, 'category', index);
    props.handleIngredientChanges(subCategoryTemp, 'subCategoryList', index);
    props.handleIngredientChanges([], 'variants', index);
    props.handleIngredientChanges([], 'products', index);
    // setProductList([]);
    // const tempValidation = { ...props.validations };
    // tempValidation.ingredients[index].category = false;
    // props.handleValidations(tempValidation);
  };
  const handleSubCategoryChange = async (event: any, index: number) => {
    props.handleIngredientChanges(event._id, 'subCategory', index);
    props.handleIngredientChanges([], 'variants', index);
    // setProductList([]);
    // const tempValidation = { ...props.validations };
    // tempValidation.ingredients[index].category = false;
    // props.handleValidations(tempValidation);
    await fetchProductList(
      props?.recipeData?.ingredients[index]?.category,
      event._id,
      index
    );
  };
  const fetchProductList = async (
    category: any,
    subCategory: any,
    index: number
  ) => {
    const apiCallService = new APICallService(recipeEndpoints.productList, {
      'categories[0]': category,
      'subCategories[0]': subCategory,
      state: 2,
    });
    const response = await apiCallService.callAPI();
    if (response && response?.records) {
      const temp = response?.records.map((val: any) => {
        return {
          value: val._id,
          name: val.title,
          title: val.title,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px border border-r10px me-2">
                <img
                  src={val?.media[0]?.url || ''}
                  className="p-1"
                />
              </span>
              <span className="fs-16 fw-600 text-black ">{val.title}</span>
            </>
          ),
          _id: val._id,
          image: val?.media[0]?.url,
          id: val._id,
        };
      });
      const tempRecipeData = { ...props?.recipeData };
      tempRecipeData.ingredients[index].products = temp;
      props.handleRecipeData(tempRecipeData);
      // setProductList(temp);
    } else {
      // setProductList([]);
    }
  };
  const handleRemoveProduct = (index: number, valIndex: number) => {
    const temp = { ...props.recipeData };
    temp.ingredients[index].variants = temp.ingredients[index].variants.filter(
      (item: any, i: number) => i !== valIndex
    );
    props.handleRecipeData(temp);
  };
  return (
    <>
      {props.recipeData?.ingredients.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className="card bg-light pt-6 border position-relative mb-9"
          >
            {props.recipeData?.ingredients.length !== 1 ? (
              <img
                className="position-absolute "
                height={35}
                width={35}
                src={CrossGraySVG}
                onClick={() => {
                  handleRemove(index);
                }}
                alt=""
                style={{
                  top: '-12px',
                  right: '-12px',
                }}
              />
            ) : (
              <></>
            )}
            <div className="card-body pt-0 pb-5">
              <Row className="align-items-center">
                <Col
                  lg={12}
                  className="mb-6"
                >
                  <Row className="align-items-center">
                    <Col lg={2}>
                      <label
                        htmlFor=""
                        className="fs-16 fw-400 mb-lg-0 mb-3 required"
                      >
                        Title
                      </label>
                    </Col>
                    <Col lg={10}>
                      <input
                        type="text"
                        className={clsx(
                          'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                          props?.validations?.ingredients[index].title
                            ? 'border-danger'
                            : ''
                        )}
                        name="name"
                        value={item?.title || ''}
                        placeholder="Enter title"
                        onChange={(event: any) => {
                          props.handleIngredientChanges(
                            event.target.value.trimStart(),
                            'title',
                            index
                          );
                        }}
                      />
                      {props?.validations?.ingredients[index].title ? (
                        <div className="text-danger fs-14 mt-1">
                          Title is required and should not exceed 200
                          characters.
                        </div>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col lg={12}>
                  <Row className="align-items-center">
                    <Col
                      lg={6}
                      className="mb-5"
                    >
                      <Row className="align-items-center">
                        <Col lg={4}>
                          <label
                            htmlFor=""
                            className="fs-16 fw-400 mb-lg-0 mb-3 required"
                          >
                            Category
                          </label>
                        </Col>
                        <Col lg={8}>
                          <CustomSelectWhite
                            border={
                              // clsx()
                              props?.validations?.ingredients[index].category
                                ? '#e55451'
                                : ''
                            }
                            onChange={(event: any) => {
                              handlePrimaryCategoryChange(event, index);
                            }}
                            options={props?.primaryCategory || []}
                            isMulti={false}
                            placeholder="Select category"
                          />
                        </Col>
                      </Row>
                    </Col>
                    {/* {generalData.defaultSubCategory.length ? ( */}
                    <Col
                      lg={6}
                      className="mb-5"
                    >
                      <Row className="align-items-center">
                        <Col lg={4}>
                          <label
                            htmlFor=""
                            className="fs-16 fw-400 mb-lg-0 mb-3 required"
                          >
                            Sub Category
                          </label>
                        </Col>
                        <Col lg={8}>
                          <CustomSelectWhite
                            value={
                              item.subCategoryList.length &&
                              item.subCategoryList.find((val: any) => {
                                return val._id === item.subCategory;
                              })
                                ? item.subCategoryList.find((val: any) => {
                                    return val._id === item.subCategory;
                                  })
                                : null
                            }
                            border={
                              // clsx()
                              props?.validations?.ingredients[index].subCategory
                                ? '#e55451'
                                : ''
                            }
                            onChange={(event: any) => {
                              handleSubCategoryChange(event, index);
                            }}
                            options={item?.subCategoryList || []}
                            isMulti={false}
                            placeholder="Select sub category"
                          />
                        </Col>
                      </Row>
                    </Col>
                    {/* ) : (
              <></>
            )} */}
                  </Row>
                </Col>
                <Col
                  lg={12}
                  className="mb-6"
                >
                  <Row className="align-items-center">
                    <Col
                      lg={2}
                      className="align-self-lg-start mt-lg-2"
                    >
                      <label
                        htmlFor=""
                        className="fs-16 fw-400 mb-lg-0 mb-3 required"
                      >
                        Select Products
                      </label>
                    </Col>
                    <Col lg={10}>
                      <div>
                        <CustomComponentAfterSelect
                          value={item?.variants || []}
                          options={item?.products}
                          onChange={(event: any) => {
                            props.handleIngredientChanges(
                              event,
                              'variants',
                              index
                            );
                          }}
                          closeMenuOnSelect={false}
                          border={
                            props?.validations?.ingredients[index].variants
                              ? '#e55451'
                              : '#e0e0df'
                          }
                          isMulti={true}
                          isSearchable={true}
                          hideSelectedOptions={false}
                          placeholder="Select products"
                        />
                      </div>
                      {item?.variants.length ? (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              className="mt-5"
                            >
                              {item?.variants.map(
                                (productVal: any, valIndex: number) => {
                                  return (
                                    <>
                                      <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                          <div className="symbol symbol-40px border bg-white me-2">
                                            <img
                                              width={40}
                                              height={40}
                                              src={productVal?.image}
                                              className="object-fit-contain"
                                              alt=""
                                            />
                                          </div>
                                          <div className="fs-14 fw-500 align-self-center ms-1 text-dark">
                                            {productVal?.title}
                                          </div>
                                        </div>
                                        {!loading ? (
                                          <Button
                                            variant=""
                                            className="btn btn-flush btn-icon"
                                            onClick={() => {
                                              handleRemoveProduct(
                                                index,
                                                valIndex
                                              );
                                            }}
                                          >
                                            <img
                                              height={16}
                                              width={16}
                                              src={CrossSVG}
                                              alt=""
                                            />
                                          </Button>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                      {selectProducts.length === 1 ? (
                                        <></>
                                      ) : (
                                        <div className="separator my-3"></div>
                                      )}
                                    </>
                                  );
                                }
                              )}
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        );
      })}
      <div>
        <Link
          to="#"
          className="text-primary fs-16 fw-bolder"
          onClick={handleAddMore}
        >
          + Add new ingredients
        </Link>
      </div>
    </>
  );
};
export default Ingredients;
