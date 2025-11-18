import { useEffect, useRef, useState } from 'react';
import General from './general';
import Price from './price';
import ProductImages from './product-images';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { error, success } from '../../../../Global/toast';
import { catalogue } from '../../../../utils/toast';
import ProductGuidelines from '../../../custom/modals/ProductGuidelines';
import clsx from 'clsx';
import APICallService from '../../../../api/apiCallService';
import { product } from '../../../../api/apiEndPoints';
import { productJSON } from '../../../../api/apiJSON/product';
import Loader from '../../../../Global/loader';
import { fileValidation } from '../../../../Global/fileValidation';
import Validations from '../../../../utils/validations';
import { option } from 'yargs';
import RemoveVariants from '../../../modals/remove-variants';
import Method from '../../../../utils/methods';
import { Product } from '../../../../utils/constants';
const EditProduct = () => {
  const { state }: any = useLocation();
  const [categories, setCategories] = useState<any>();
  const [variants, setVariants] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [brands, setBrands] = useState<any>();
  const [fetchLoader, setFetchLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialVariants, setInitialVariant]: any = useState<any>([]);
  const [isVariantChange, setIsVariantChange] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const generalDataRef = useRef();
  const [initialGeneralData, setInitialGeneralData] = useState<any>({
    primaryCategory: '',
    subCategory: '',
    defaultSubCategory: [],
    defaultGroupCategory: [],
    groupCategory: '',
    productTitle: '',
    taxFree: false,
    productTax: '',
    country: '',
    brand: '',
    description: '',
    variants: [],
    noneSelected: false,
    productName: '',
    isDraft: false,
    combinations: [
      {
        title: '',
        units: {
          isOpen: false,
          price: null,
          skuNumber: null,
          images: [],
          imageReader: [],
          quantityTypes: [],
          discountByQuantitiesEnabled: false,
          discountQuantity: [{ quantity: null }],
          discountAmount: [{ amount: null }],
        },
      },
    ],
    searchTag: {
      inputValue: '',
      options: [],
    },
  });
  useEffect(() => {
    (async () => {
      if (!state) {
        return window.history.back();
      }
      setFetchLoader(true);
      let apiService = new APICallService(
        product.initProduct,
        {
          product: state._id,
        },
        '',
        '',
        false,
        '',
        Product
      );
      let response = await apiService.callAPI();
      let temp = { ...generalData };
      let tempValidation = { ...generalDataValidation };
      if (response.defaultItems) {
        let catTemp: any = [];
        let defaultSubCategory: any = [];
        response.defaultItems.categories.map((catVal: any) => {
          if (catVal._id === response.product.category.reference) {
            defaultSubCategory = catVal.categories;
          }
        });
        let defaultGroupCategory: any = [];
        defaultSubCategory.map((catVal: any) => {
          if (catVal._id === response.product.subCategory.reference) {
            defaultGroupCategory = catVal.categories;
          }
        });
        temp.primaryCategory = response.product.category.reference;
        temp.searchTag = {
          inputValue: '',
          options: response?.product?.searchTag
            ? response?.product?.searchTag.map((item: any) => {
                return {
                  value: item,
                  label: item,
                  title: item,
                };
              })
            : [],
        };
        temp.taxFree = response.product.taxFree;
        temp.productTax = response.product.productTax;
        tempValidation.primaryCategory = false;
        temp.subCategory = response.product.subCategory.reference;
        temp.isReturnable = response?.product?.isReturnable;
        temp.returnHours = response?.product?.returnHours
          ? response?.product?.returnHours + ''
          : '';
        tempValidation.returnHours = false;
        tempValidation.subCategory = false;
        temp.defaultSubCategory = defaultSubCategory;
        temp.defaultGroupCategory = defaultGroupCategory;
        temp.groupCategory = response.product.groupCategory
          ? response.product.groupCategory.reference
          : '';
        tempValidation.groupCategory = false;
        temp.productTitle = response.product.title;
        tempValidation.productTitle = false;
        temp.country = response.product.country
          ? response.product.country.reference
          : '';
        tempValidation.country = false;
        temp.brand = response.product.brand
          ? response.product.brand.reference
          : '';
        tempValidation.brand = false;
        temp.description = response.product.description
          ? response.product.description
          : '';
        tempValidation.description = false;
        temp.variants = [];
        temp.noneSelected = false;
        tempValidation.noneSelected = false;
        tempValidation.minimumCombinations = false;
        temp.clonedRef = response.product._id;
        let tempCombinations: any = [];
        let tempCombinationValidation: any = [];
        let variantsUsingSeparateInfo = response.product['variants'].filter(
          (a: any) => a.variant.techInfoSeparated
        );
        temp.variantsUsingSeparateInfo = variantsUsingSeparateInfo;
        const variantsOfCategory = response.defaultItems.variants.filter(
          (item: any) => {
            const currCatId = response.product.category.reference;
            const currSubCatId = response.product.subCategory.reference;
            const hasCat = item?.categories.find(
              (val: any) =>
                val.category === currCatId && val.subCategory === currSubCatId
            );
            // const subCatId = item.categories[0]?.subCategory;
            // return catId === currCatId && subCatId === currSubCatId;
            return hasCat ? true : false;
          }
        );
        //  if (response.product['variants'][0]) {
        if (
          response.product['variants'].length &&
          !response.product['variants'][0]['variant']['variantType'].length
        ) {
          temp.noneSelected = true;
        }
        if (response.product['variants'].length === 0) {
          temp.noneSelected = true;
        }
        let tempVariants: any = [];
        response.product['definedVariantsTypes'].map((selectVal: any) => {
          let options: any = [];
          selectVal.options.map((optionVal: any) => {
            if (
              checkVariant(response.product.variants, {
                option: optionVal,
                reference: selectVal.reference,
              })
            ) {
              options.push({ title: optionVal });
            }
            // options.push({ title: optionVal });
          });
          tempVariants.push({
            ...selectVal,
            isSelected: true,
            categories: [
              {
                options: options,
              },
            ],
            _id: selectVal.reference,
          });
        });
        variantsOfCategory.map((item: any) => {
          const currCatId = response.product.category.reference;
          const currSubCatId = response.product.subCategory.reference;
          const category = item.categories.filter(
            (val: any) =>
              val.category === currCatId && val.subCategory === currSubCatId
          );
          const tempOptions: any = {
            categories: category[0]?.options,
            isSelected: false,
            options: category[0]?.options,
            reference: item._id,
            _id: item._id,
            title: item.title,
          };
          if (
            !tempVariants.find(
              (value: any) => value.reference === tempOptions.reference
            )
          ) {
            tempVariants.push(tempOptions);
          }
        });
        if (tempVariants.length) {
          let variantTemp: any = [];
          tempVariants.map(() => {
            tempValidation.selectedVariants.push(false);
            variantTemp.push(false);
          });
          tempValidation.variants = false;
        }
        //Code adds variant types in tempVariants, that are in variants(combinations) and not in defined variant.
        if (response?.product['variants']?.length) {
          response?.product['variants'].map(
            (variantItem: any, variantItemIndex: number) => {
              const valVariantsTypes = variantItem?.variant?.variantType || [];
              valVariantsTypes.forEach((varType: any) => {
                const tempVarIndex = tempVariants.findIndex(
                  (tempVar: any) => tempVar.reference === varType?.reference
                );
                if (tempVarIndex !== -1) {
                  const isExist = tempVariants[
                    tempVarIndex
                  ].categories[0].options.find(
                    (opVal: any) => opVal.title === varType?.option
                  );
                  if (!isExist) {
                    tempVariants[tempVarIndex].categories[0]?.options.push({
                      title: varType?.option,
                    });
                  }
                }
              });
            }
          );
        }
        
        temp.variants = tempVariants;
        if (response.product['variants'].length) {
          response.product['variants'].map(
            (variantVal: any, variantIndex: number) => {
              let key = '';
              let option = '';
              variantVal.variant.variantType.forEach(
                (val: any, index: number) => {
                  option += val.option;
                  key += val.reference;
                  if (index < variantVal.variant.variantType.length - 1) {
                    key += '-'; // Add underscore for key
                    option += ','; // Add comma for option
                  }
                }
              );
              let combinationTemp: any = {
                _id: variantVal.variant._id,
                combinationKey: option + '_' + key,
              };
              let combinationValidationTemp: any = {
                title: false,
                units: {
                  isOpen: false,
                  price: false,
                  skuNumber: false,
                  images: false,
                  quantityTypes: false,
                  discountQuantity: [false],
                  discountAmount: [false],
                },
                validation: false,
              };
              let imagesTemp: any = [];
              variantVal.variant.media.map((val: any, index: number) => {
                imagesTemp.push({ ...val, id: index, order: index });
              });
              combinationTemp = {
                ...combinationTemp,
                title: variantVal.variant.title,
                units: {
                  price: variantVal.variant.quantityTypes[0]?.amount || '',
                  skuNumber: variantVal.variant?.skuNumber || '',
                  images: imagesTemp,
                  quantityTypes: variantVal.variant.quantityTypes,
                  discountByQuantitiesEnabled:
                    variantVal.variant.quantityTypes[0]
                      ?.discountByQuantitiesEnabled || false,
                  discountQuantity:
                    variantVal?.variant?.quantityTypes[0]
                      ?.discountsByQuantities &&
                    variantVal?.variant?.quantityTypes[0]?.discountsByQuantities
                      .length
                      ? variantVal?.variant?.quantityTypes[0]?.discountsByQuantities.map(
                          (item: any) => {
                            return { quantity: item.quantity };
                          }
                        )
                      : [{ quantity: null }],
                  discountAmount:
                    variantVal?.variant?.quantityTypes[0]
                      ?.discountsByQuantities &&
                    variantVal?.variant?.quantityTypes[0]?.discountsByQuantities
                      .length
                      ? variantVal?.variant?.quantityTypes[0]?.discountsByQuantities.map(
                          (item: any) => {
                            return { amount: item.discountAmt };
                          }
                        )
                      : [{ amount: null }],
                },
              };
              response.product['variants'][variantIndex]['variant'][
                'combinationKey'
              ] = option + '_' + key;
              tempCombinations.push(combinationTemp);
              tempCombinationValidation.push(combinationValidationTemp);
            }
          );
          temp.isDraft = response.product.draft;
          temp.combinations = tempCombinations;
          tempValidation.combinations = tempCombinationValidation;
        } else {
          let combinationTemp: any = {};
          let combinationValidationTemp: any = {
            title: false,
            units: {
              isOpen: false,
              price: false,
              skuNumber: false,
              images: false,
              quantityTypes: false,
              discountQuantity: [false],
              discountAmount: [false],
            },
            validation: false,
          };
          combinationTemp = {
            title: '',
            combinationKey: '',
            units: {
              isOpen: false,
              price: null,
              skuNumber: null,
              images: [],
              imageReader: [],
              quantityTypes: [],
              discountByQuantitiesEnabled: false,
              discountQuantity: [{ quantity: null }],
              discountAmount: [{ amount: null }],
            },
          };
          tempCombinations.push(combinationTemp);
          tempCombinationValidation.push(combinationValidationTemp);
          temp.isDraft = response.product.draft;
          temp.combinations = tempCombinations;
          tempValidation.combinations = tempCombinationValidation;
        }
        generalDataRef.current = temp;
        setGeneralDataValidation(tempValidation);
        setGeneralData(temp);
        setInitialGeneralData(response.product);
        response.defaultItems.categories.map((catVal: any) => {
          if (catVal.categories.length) {
            catTemp.push(catVal);
          }
        });
        setCategories(catTemp);
        setVariants(response.defaultItems.variants);
        setCountries(response.defaultItems.countries);
        setBrands(response.defaultItems.brands);
        setCurrentTab({
          name: 'General info',
          content: (
            <General
              initialVariants={initialVariants}
              setInitialVariant={setInitialVariant}
              onGeneralDataChange={onGeneralDataChange}
              generalData={temp}
              categories={catTemp}
              countries={response.defaultItems.countries}
              variants={response.defaultItems.variants}
              brands={response.defaultItems.brands}
              validations={tempValidation}
              onValidationChange={onValidationChange}
              isVariantChange={isVariantChange}
              setIsVariantChange={setIsVariantChange}
            />
          ),
          value: 0,
        });
        setInitialVariant(response.defaultItems.variants);
      }
      setFetchLoader(false);
    })();
    // setDisabled(true);
  }, []);
  const navigate = useNavigate();
  const [tab, setTab] = useState([
    {
      name: 'General info',
      content: <General />,
      value: 0,
    },
    { name: 'Product images', content: <ProductImages />, value: 1 },
    { name: 'Price', content: <Price />, value: 2 },
  ]);
  const [disabled, setDisabled] = useState(false);
  const [generalData, setGeneralData] = useState<any>({
    primaryCategory: '',
    subCategory: '',
    defaultSubCategory: [],
    defaultGroupCategory: [],
    groupCategory: '',
    productTitle: '',
    taxFree: false,
    productTax: '',
    country: '',
    brand: '',
    description: '',
    isReturnable: false,
    returnHours: '',
    variants: [],
    noneSelected: false,
    productName: '',
    isDraft: false,
    combinations: [
      {
        title: '',
        units: {
          isOpen: false,
          price: null,
          skuNumber: null,
          images: [],
          imageReader: [],
          quantityTypes: [],
          discountByQuantitiesEnabled: false,
          discountQuantity: [{ quantity: null }],
          discountAmount: [{ amount: null }],
        },
      },
    ],
  });
  const [generalDataValidation, setGeneralDataValidation] = useState<any>({
    primaryCategory: false,
    subCategory: false,
    groupCategory: false,
    productTitle: false,
    country: false,
    brand: false,
    description: false,
    returnHours: false,
    variants: false,
    noneSelected: false,
    productName: false,
    productTax: false,
    isDraft: false,
    minimumCombinations: false,
    selectedVariants: [],
    combinations: [
      {
        title: false,
        units: {
          isOpen: false,
          price: false,
          skuNumber: false,
          images: false,
          quantityTypes: false,
          discountQuantity: [false],
          discountAmount: [false],
        },
        validation: false,
      },
    ],
  });
  const onGeneralDataChange = (data: any) => {
    setGeneralData(data);
  };
  const onValidationChange = (data: any) => {
    setGeneralDataValidation(data);
  };
  const [imageString, setImageString] = useState();
  const [productGuidelinesmodalShow, setProductGuidelinesModalShow] =
    useState(false);
  const createTabs = () => {
    const localTab = tab;
    let current = currentTab;
    const allTabs = localTab.map((tab, index) => {
      return (
        <li className="nav-item">
          <Link
            to={'/'}
            className={clsx(
              'nav-link  ',
              current.name === tab.name
                ? 'active text-active-dark text-dark border-bottom-3 border-primary'
                : 'border-bottom-0',
              currentTab.value !== tab.value
                ? disabled
                  ? 'disabled'
                  : ''
                : '',
              loading ? 'disabled' : '',
              tab.value === 2 && isVariantChange ? 'disabled' : ''
            )}
            data-bs-toggle="tab"
            // onClick={() => handleSelectTab(tab)}
          >
            {tab.name}
          </Link>
        </li>
      );
    });
    return allTabs;
  };
  const handleSelectTab = async (tab: any) => {
    let generalTemp = JSON.parse(JSON.stringify({ ...generalData }));
    if (tab.value === 1 && currentTab?.value === 0) {
      let generalTabValidations = await checkGeneralTabValidation(generalTemp);
      if (!generalTabValidations) {
        let selectedVariant: any = [];
        let data: any = [];
        let validations = JSON.parse(
          JSON.stringify({ ...generalDataValidation })
        );
        generalTemp.variants.map((variantVal: any) => {
          if (variantVal.isSelected === true) {
            let temp: any = [];
            variantVal.categories[0].options.map((optionVal: any) => {
              temp.push({ title: optionVal.title, _id: variantVal._id });
            });
            selectedVariant.push({
              options: variantVal.categories[0].options,
              _id: variantVal._id,
            });
            data.push(temp);
          }
        });
        if (!generalTemp.noneSelected) {
          let temp = { ...generalTemp };
          if (selectedVariant.length) {
            temp.selectedVariant = selectedVariant;
            if (data.length) {
              if (data[0].length === 0) {
                let imageString: any = [];
                data[0].map((val: any) =>
                  imageString.push({
                    title: `${generalTemp.productTitle} (${val.title.trim()})`,
                    id: val._id,
                  })
                );
                let tempData: any = [];
                let validTemp: any = [];
                imageString.map((val: any) => {
                  validTemp.push({
                    title: false,
                    validation: false,
                    units: validations.combinations[0].units,
                  });
                  return tempData.push({
                    title: val.title,
                    id: val.id,
                    units: generalTemp.combinations[0].units,
                  });
                });
                validations.combinations = validTemp;
                temp.combinations = tempData;
                setGeneralData(temp);
                setGeneralDataValidation(validations);
                // setNavTab(tab.value, temp, validations);
              } else {
                let imageString = await combine(data);
                let updatedImageString = imageString.map((val: any) => {
                  return {
                    ...val,
                    id: val._id,
                    title: `${generalTemp.productTitle} (${val.title.trim()})`,
                  };
                });
                let tempData: any = [];
                let validTemp: any = [];
                updatedImageString.map((val: any, index: any) => {
                  validTemp.push({
                    title: false,
                    units: generalDataValidation.combinations[0].units,
                  });
                  const matchedVariant = initialGeneralData.variants.find(
                    (variant: any) => {
                      return (
                        // variant.variant.title.replace(/\s/g, '') ==
                        // val.title.replace(/\s/g, '')
                        variant.variant.combinationKey == val.combinationKey
                      );
                    }
                  );
                  if (
                    matchedVariant &&
                    Object.keys(matchedVariant).length &&
                    generalTemp.combinations.find(
                      (item: any) => item._id === matchedVariant.variant._id
                    )
                  ) {
                    generalTemp.combinations.map(
                      (combVal: any, combIndex: number) => {
                        if (combVal._id == matchedVariant.variant._id) {
                          return tempData.push({
                            title: val.title,
                            id: val.id,
                            _id: generalTemp.combinations[combIndex]
                              ? generalTemp.combinations[combIndex]._id
                                ? generalTemp.combinations[combIndex]._id
                                : null
                              : null,
                            units: generalTemp.combinations[combIndex]
                              ? generalTemp.combinations[combIndex].units
                              : {
                                  price: null,
                                  skuNumber: null,
                                  images: [],
                                  imageReader: [],
                                  quantityTypes: [],
                                  discountByQuantitiesEnabled: false,
                                  discountQuantity: [{ quantity: null }],
                                  discountAmount: [{ amount: null }],
                                },
                            validation: false,
                          });
                        }
                      }
                    );
                  } else {
                    return tempData.push({
                      title: val.title,
                      id: val.id,
                      _id: null,
                      units: {
                        price: null,
                        skuNumber: null,
                        images: [],
                        imageReader: [],
                        quantityTypes: [],
                        discountByQuantitiesEnabled: false,
                        discountQuantity: [{ quantity: null }],
                        discountAmount: [{ amount: null }],
                      },
                      validation: false,
                    });
                  }
                  // return tempData.push({
                  //   title: val.title,
                  //   id: val.id,
                  //   units: generalTemp.combinations[index]
                  //     ? generalTemp.combinations[index].units
                  //     : {
                  //         price: null,
                  //         skuNumber: null,
                  //         images: [],
                  //         imageReader: [],
                  //         quantityTypes: [],
                  //       },
                  //   validation: false,
                  // });
                });
                temp.combinations = tempData;
                validations.combinations = validTemp;
                setGeneralData(temp);
                setGeneralDataValidation(validations);
                // setNavTab(tab.value, temp, validations);
              }
            } else {
              let tempData: any = [];
              let validTemp: any = [];
              tempData.push({
                title: generalTemp.productTitle,
                id: '',
                units: generalTemp.combinations[0].units,
              });
              validTemp.push({
                title: false,
                units: generalDataValidation.combinations[0].units,
                validation: false,
              });
              temp.combinations = tempData;
              validations.combinations = validTemp;
              setGeneralDataValidation(validations);
              // setNavTab(tab.value, temp, validations);
            }
            if (tab.value > currentTab.value) {
              setShowVariantModal(true);
            } else {
              setNavTab(tab.value, temp, validations);
            }
          }
        } else {
          let validations = { ...generalDataValidation };
          let tempData: any = [];
          let validTemp: any = [];
          if (generalTemp.combinations.length > 0) {
            tempData.push({
              title: generalTemp.productTitle,
              units: generalTemp.combinations[0]?.units,
            });
          } else {
            tempData.push({
              title: generalTemp.productTitle,
              units: {
                imageReader: [],
                images: [],
                price: null,
                quantityTypes: [],
                skuNumber: null,
                discountByQuantitiesEnabled: false,
                discountQuantity: [{ quantity: null }],
                discountAmount: [{ amount: null }],
              },
            });
          }
          validTemp.push({
            title: false,
            units: generalDataValidation.combinations[0]?.units,
            validation: false,
          });
          validations.combinations = validTemp;
          generalTemp.combinations = tempData;
          setGeneralDataValidation(validations);
          setNavTab(tab.value, generalTemp, validations);
        }
      }
    } else if (tab.value === 2) {
      let generalTabValidations = await checkGeneralTabValidation(generalTemp);
      let imageValidation = await checkImageValidation(
        generalTemp,
        generalDataValidation
      );
      if (!imageValidation) {
        setGeneralDataValidation(generalDataValidation);
        // setNavTab(tab.value, generalTemp, generalDataValidation);
      } else {
        return;
      }
      if (!generalTabValidations && currentTab.value === 0) {
        let selectedVariant: any = [];
        let data: any = [];
        let validations = JSON.parse(
          JSON.stringify({ ...generalDataValidation })
        );
        generalTemp.variants.map((variantVal: any) => {
          if (variantVal.isSelected === true) {
            let temp: any = [];
            variantVal.categories[0].options.map((optionVal: any) => {
              temp.push({ title: optionVal.title, _id: variantVal._id });
            });
            selectedVariant.push({
              options: variantVal.categories[0].options,
              _id: variantVal._id,
            });
            data.push(temp);
          }
        });
        if (!generalTemp.noneSelected) {
          let temp = { ...generalTemp };
          if (selectedVariant.length) {
            temp.selectedVariant = selectedVariant;
            if (data.length) {
              if (data[0].length === 1) {
                let imageString: any = [];
                data[0].map((val: any) =>
                  imageString.push({
                    title: `${generalTemp.productTitle} (${val.title.trim()})`,
                    id: val._id,
                  })
                );
                let tempData: any = [];
                let validTemp: any = [];
                imageString.map((val: any) => {
                  validTemp.push({
                    title: false,
                    validation: false,
                    units: validations.combinations[0].units,
                  });
                  return tempData.push({
                    title: val.title,
                    id: val.id,
                    units: generalTemp.combinations[0].units,
                  });
                });
                validations.combinations = validTemp;
                temp.combinations = tempData;
                const isValidImage = await checkImageValidation(
                  temp,
                  validations
                );
                if (isValidImage) {
                  return;
                }
                setGeneralData(temp);
                setGeneralDataValidation(validations);
                setNavTab(tab.value, temp, validations);
              } else {
                let imageString = await combine(data);
                let updatedImageString = imageString.map((val: any) => {
                  return {
                    id: val._id,
                    title: `${generalTemp.productTitle} (${val.title.trim()})`,
                  };
                });
                let tempData: any = [];
                let validTemp: any = [];
                updatedImageString.map((val: any, index: any) => {
                  validTemp.push({
                    title: false,
                    units: generalDataValidation.combinations[0].units,
                  });
                  return tempData.push({
                    title: val.title,
                    id: val.id,
                    _id: generalTemp?.combinations[index]
                      ? generalTemp?.combinations[index]?._id
                      : null,
                    units: generalTemp?.combinations[index]
                      ? generalTemp.combinations[index].units
                      : {
                          price: null,
                          skuNumber: null,
                          images: [],
                          imageReader: [],
                          quantityTypes: [],
                          discountByQuantitiesEnabled: false,
                          discountQuantity: [{ quantity: null }],
                          discountAmount: [{ amount: null }],
                        },
                    validation: false,
                  });
                });
                temp.combinations = tempData;
                validations.combinations = validTemp;
                const isValidImage = await checkImageValidation(
                  temp,
                  validations
                );
                if (isValidImage) {
                  return;
                }
                setGeneralData(temp);
                setGeneralDataValidation(validations);
                setNavTab(tab.value, temp, validations);
              }
            } else {
              let tempData: any = [];
              let validTemp: any = [];
              tempData.push({
                title: generalTemp.productTitle,
                id: '',
                units: generalTemp.combinations[0].units,
              });
              validTemp.push({
                title: false,
                units: generalDataValidation.combinations[0].units,
                validation: false,
              });
              temp.combinations = tempData;
              validations.combinations = validTemp;
              const isValidImage = await checkImageValidation(
                temp,
                validations
              );
              if (isValidImage) {
                return;
              }
              setGeneralDataValidation(validations);
              setNavTab(tab.value, temp, validations);
            }
          }
        } else {
          let validations = { ...generalDataValidation };
          let tempData: any = [];
          let validTemp: any = [];
          tempData.push({
            title: generalTemp.productTitle,
            units: generalTemp.combinations[0]?.units,
          });
          validTemp.push({
            title: false,
            units: generalDataValidation.combinations[0]?.units,
            validation: false,
          });
          validations.combinations = validTemp;
          generalTemp.combinations = tempData;
          const isValidImage = await checkImageValidation(
            generalTemp,
            validations
          );
          if (isValidImage) {
            return;
          }
          setGeneralDataValidation(validations);
          setNavTab(tab.value, generalTemp, validations);
        }
      } else {
        setNavTab(tab.value, generalTemp, generalDataValidation);
      }
    } else {
      setNavTab(tab.value, generalTemp, generalDataValidation);
    }
  };
  function extractTextWithinParentheses(str: string): string {
    let depth = 0;
    let result = '';
    let withinParentheses = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '(') {
        if (depth > 0) {
          result += '('; // Include '(' if it's inside the innermost parentheses
        }
        depth++;
        withinParentheses = true;
      } else if (str[i] === ')') {
        depth--;
        if (depth === 0) {
          withinParentheses = false;
        }
        if (depth > 0) {
          result += ')'; // Include ')' if it's inside the innermost parentheses
        }
      } else if (withinParentheses) {
        result += str[i];
      }
    }
    return result;
  }
  const checkGeneralTabValidation = async (generalDataTemp: any) => {
    let generalValidationTemp = JSON.parse(
      JSON.stringify({ ...generalDataValidation })
    );
    let valid = [];
    if (generalDataTemp.primaryCategory === '') {
      generalValidationTemp.primaryCategory = true;
      valid.push(true);
    }
    if (generalDataTemp.subCategory === '') {
      generalValidationTemp.subCategory = true;
      valid.push(true);
    }
    if (generalDataTemp.productTitle === '') {
      valid.push(true);
      generalValidationTemp.productTitle = true;
    }
    if (generalDataTemp.taxFree === false) {
      if (
        generalDataTemp.productTax === '' ||
        generalDataTemp.productTax === undefined
      ) {
        generalValidationTemp.productTax = true;
        valid.push(true);
      }
    }
    if (generalDataTemp.country === '') {
      generalValidationTemp.country = true;
      valid.push(true);
    }
    if (generalDataTemp.brand === '') {
      valid.push(true);
      generalValidationTemp.brand = true;
    }
    if (generalDataTemp.description === '') {
      valid.push(true);
      generalValidationTemp.description = true;
    }
    if (
      generalDataTemp.isReturnable &&
      (generalDataTemp.returnHours === '' ||
        generalDataTemp.returnHours === '0')
    ) {
      valid.push(true);
      generalValidationTemp.returnHours = true;
    }
    let selectedVariant: any = [];
    let data: any = [];
    let validations = JSON.parse(JSON.stringify({ ...generalDataValidation }));
    generalDataTemp.variants.map((variantVal: any) => {
      if (variantVal.isSelected === true) {
        let temp: any = [];
        variantVal.categories[0].options.map((optionVal: any) => {
          temp.push({ title: optionVal.title, _id: variantVal._id });
        });
        selectedVariant.push({
          options: variantVal.categories[0].options,
          _id: variantVal._id,
        });
        validations.selectedVariants.push(false);
        data.push(temp);
      }
    });
    if (!generalDataTemp.noneSelected) {
      if (selectedVariant.length) {
        let selectValTemp: any = [];
        selectedVariant.map((selectVal: any) => {
          if (selectVal.options.length) {
            selectValTemp.push(false);
          } else {
            valid.push(true);
            selectValTemp.push(true);
          }
        });
        generalValidationTemp.selectedVariants = selectValTemp;
      } else {
        valid.push(true);
        generalValidationTemp.variants = true;
      }
    } else {
    }
    setGeneralDataValidation(generalValidationTemp);
    let validationResult = valid.some((el) => {
      return el === true;
    });
    return validationResult;
  };
  const checkImageValidation = async (
    generalDataTemp: any,
    generalTempValidation: any
  ) => {
    generalTempValidation = JSON.parse(
      JSON.stringify({ ...generalTempValidation })
    );
    const valid: any = [];
    generalDataTemp.combinations.map((comb: any, index: number) => {
      if (comb.units.images.length === 0) {
        generalTempValidation.combinations[index].units.images = true;
        valid.push(true);
      } else {
        generalTempValidation.combinations[index].units.images = false;
      }
    });
    setGeneralDataValidation(generalTempValidation);
    return valid.some((item: any) => item === true);
  };
  const handlePreviousSelectTab = async (tab: any) => {
    setNavTab(tab.value, generalData, generalDataValidation);
  };
  const handleImage = async (event: any, index: number) => {
    const selectedFiles = event.target.files;
    let temp = { ...generalData };
    if (!selectedFiles) return;
    else {
      let temp2 = JSON.parse(JSON.stringify(temp));
      let generalValidationTemp = JSON.parse(
        JSON.stringify({ ...generalDataValidation })
      );
      let imageTemp: any = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        if (fileValidation(selectedFiles?.[i])) {
          await toBase64(selectedFiles?.[i]).then((data) => {
            temp2.combinations[index].dimensions.images.push({
              url: URL.createObjectURL(selectedFiles?.[i]),
              obj: data,
            });
          });
        }
      }
      await setGeneralData(temp2);
      generalValidationTemp.combinations[index].dimensions.images = false;
      await setGeneralDataValidation(generalValidationTemp);
    }
  };
  const toBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleRemoveImage = (index: number, productIndex: number) => {
    let temp = { ...generalData };
    let generalValidationTemp = { ...generalDataValidation };
    let data = temp.combinations[index];
    let updatedImage = data.units.images.filter(
      (e: any, i: number) => i !== productIndex
    );
    let updatedImageReader = data.units.imageReader.filter(
      (e: any, i: number) => i !== productIndex
    );
    if (!updatedImage.length) {
      generalValidationTemp.combinations[index].units.images = true;
    }
    data.units.images = updatedImage;
    data.units.imageReader = updatedImageReader;
    setGeneralDataValidation(generalValidationTemp);
    setGeneralData(temp);
  };
  const handleSubmit = async () => {
    let temp: any = { ...generalData };
    let generalValidationTemp = { ...generalDataValidation };
    let valid: any = [];
    let quantitySet = new Set();
    let isSameQuantity: any = [];
    temp.combinations.map((combVal: any, index: number) => {
      quantitySet.clear();
      if (!combVal.units.images.length) {
        generalValidationTemp.combinations[index].units.images = true;
        valid.push(true);
      }
      if (
        !combVal.units.price ||
        !Validations.allowNumberAndFloat(combVal.units.price)
      ) {
        generalValidationTemp.combinations[index].units.price = true;
        generalValidationTemp.combinations[index].units.quantityTypes = true;
        valid.push(true);
      }
      if (!combVal.units.skuNumber) {
        generalValidationTemp.combinations[index].units.skuNumber = true;
        valid.push(true);
      }
      if (combVal.units.discountByQuantitiesEnabled) {
        combVal.units.discountQuantity.map((dis: any, disIndex: number) => {
          if (
            !dis.quantity ||
            !Validations.allowNumberAndFloat(dis.quantity) ||
            dis.quantity <= 1
          ) {
            generalValidationTemp.combinations[index].units.discountQuantity[
              disIndex
            ] = true;
            valid.push(true);
          } else {
            quantitySet.add(dis.quantity + '');
          }
        });
        let tempValid =
          quantitySet.size !== combVal.units.discountQuantity.length;
        isSameQuantity.push(tempValid);
        combVal.units.discountAmount.map((dis: any, disIndex: number) => {
          if (!dis.amount || !Validations.allowNumberAndFloat(dis.amount)) {
            generalValidationTemp.combinations[index].units.discountAmount[
              disIndex
            ] = true;
            valid.push(true);
          }
        });
      }
    });
    setGeneralDataValidation(generalValidationTemp);
    let checked = valid.some((el: any) => {
      return el === true;
    });
    let quantitySame = isSameQuantity.some((el: any) => {
      return el === true;
    });
    if (!checked && !quantitySame) {
      setLoading(true);
      let updatedObject: any = {
        primaryCategory: temp.primaryCategory,
        subCategory: temp.subCategory,
        productTitle: Method.replaceSpaceWithCustom(temp.productTitle, ')'),
        isDraft: false,
        taxFree: temp.taxFree,
        searchTag: temp.searchTag,
      };
      if (temp.country)
        updatedObject = { ...updatedObject, country: temp.country };
      if (temp.groupCategory)
        updatedObject = {
          ...updatedObject,
          groupCategory: temp.groupCategory,
        };
      if (temp.brand) updatedObject = { ...updatedObject, brand: temp.brand };
      if (temp.description)
        updatedObject = { ...updatedObject, description: temp.description };
      if (!temp.taxFree)
        updatedObject = { ...updatedObject, productTax: temp.productTax };
      if (temp.isReturnable) {
        updatedObject = {
          ...updatedObject,
          isReturnable: temp.isReturnable,
          returnHours: temp.returnHours,
        };
      }
      if (!temp.isReturnable) {
        updatedObject = {
          ...updatedObject,
          isReturnable: false,
        };
      }
      if (temp.selectedVariant && temp.selectedVariant.length) {
        updatedObject = {
          ...updatedObject,
          selectedVariant: temp.selectedVariant,
        };
      }
      if (temp.combinations.length) {
        let combinationTemp: any = [];
        temp.combinations.map((combVal: any, combIndex: number) => {
          let innerTemp: any = {
            units: combVal.units,
          };
          let variantsSelected: any = [];
          if (combVal.id) {
            let selectedVariantsId: any = combVal.id.split('-');
            const innerText = extractTextWithinParentheses(combVal.title);
            const selectedVariantsTitle = innerText.split(',');
            // let selectedVariantsTitle: any = combVal.title
            //   .split('(')
            //   .reduce((preVal: any, currVal: any, index: number) => {
            //     if (index > 1) {
            //       return preVal + '(' + currVal;
            //     } else if (index === 1) {
            //       return currVal;
            //     } else {
            //       return '';
            //     }
            //   }, '')
            //   .replace(')', '')
            //   .split(',');
            selectedVariantsId.map((val: any, index: number) => {
              variantsSelected.push({
                id: val,
                title: selectedVariantsTitle,
              });
            });
          }
          if (Object.keys(innerTemp).length) {
            innerTemp = {
              ...innerTemp,
              images: combVal.units.images,
              imageReader: combVal.units.imageReader,
              selectedCombinations: variantsSelected,
              price: combVal.units.price,
              skuNumber: combVal.units.skuNumber,
              quantityTypes: combVal.units.quantityTypes,
              discountByQuantitiesEnabled:
                combVal.units.discountByQuantitiesEnabled,
              discountQuantity: combVal.units.discountQuantity,
              discountAmount: combVal.units.discountAmount,
            };
            combinationTemp.push(innerTemp);
          }
        });
        updatedObject = { ...updatedObject, combinations: combinationTemp };
      }
      // let modalImageTemp = updatedObject.combinations[0].images[0].url;
      // setModalImage(modalImageTemp);
      let apiService = new APICallService(
        product.editProduct,
        productJSON.addProduct({ product: updatedObject }),
        {
          id: state._id,
        },
        '',
        false,
        '',
        Product
      );
      let response = await apiService.callAPI();
      if (response) {
        navigate('/all-products');
        //window.history.back();
        success(catalogue.updated);
      }
      setLoading(false);
    } else if (!checked && quantitySame) {
      error('Bundle quantity for same variant should be different');
    }
  };
  const combine = ([head, ...[headTail, ...tailTail]]: any): any => {
    if (!headTail) {
      // Generate a unique key for single elements
      let temp = head.map((item: any) => {
        return {
          ...item,
          combinationKey: `${item.title}_${item._id}`,
        };
      });
      return temp;
    }
    const combined = headTail.reduce((acc: any, x: any) => {
      return acc.concat(
        head.map((h: any) => {
          let data = {
            title: `${h.title},${x.title}`,
            _id: `${h._id}-${x._id}`,
            combinationKey: `${h.title}_${h._id}_${x.title}_${x._id}`,
          };
          return data;
        })
      );
    }, []);
    return combine([combined, ...tailTail]);
  };
  const setNavTab = (value: any, data?: any, validations?: any) => {
    let tabTemp = [...tab];
    let currentTab = {};
    switch (value) {
      case 0:
        currentTab = {
          name: 'General info',
          content: (
            <General
              initialVariants={initialVariants}
              setInitialVariant={setInitialVariant}
              onGeneralDataChange={onGeneralDataChange}
              generalData={generalData}
              categories={categories}
              countries={countries}
              variants={variants}
              brands={brands}
              validations={validations}
              onValidationChange={onValidationChange}
              isVariantChange={isVariantChange}
              setIsVariantChange={setIsVariantChange}
            />
          ),
          value: 0,
        };
        break;
      case 1:
        currentTab = {
          name: 'Product images',
          content: (
            <ProductImages
              generalData={data}
              handleImage={(event: any, index: any) => {
                handleImage(event, index);
              }}
              handleRemoveImage={handleRemoveImage}
              validations={validations}
              onGeneralDataChange={onGeneralDataChange}
              onValidationChange={onValidationChange}
              loading={loading}
              setIsVariantChange={setIsVariantChange}
            />
          ),
          value: 1,
        };
        break;
      case 2:
        currentTab = {
          name: 'Price',
          content: (
            <Price
              onGeneralDataChange={onGeneralDataChange}
              generalData={data}
              validations={validations}
              onValidationChange={onValidationChange}
              generalDataRef={generalDataRef}
            />
          ),
          value: 2,
        };
        break;
      default:
        break;
    }
    setCurrentTab(currentTab);
    setTab(tabTemp);
  };
  const [currentTab, setCurrentTab] = useState<any>({
    name: 'General info',
    content: (
      <General
        initialVariants={initialVariants}
        setInitialVariant={setInitialVariant}
        onGeneralDataChange={onGeneralDataChange}
        generalData={generalData}
        categories={categories}
        countries={countries}
        variants={variants}
        brands={brands}
        validations={generalDataValidation}
        onValidationChange={onValidationChange}
        isVariantChange={isVariantChange}
        setIsVariantChange={setIsVariantChange}
      />
    ),
    value: 0,
  });
  const checkVariant = (variants: any, currentVariant: any) => {
    const tempVariant = variants.find((item: any) => {
      return item?.variant?.variantType?.find(
        (val: any) =>
          val.option === currentVariant.option &&
          val.reference === currentVariant.reference
      );
    });
    return tempVariant;
  };
  useEffect(() => {
    setNavTab(currentTab.value, generalData, generalDataValidation);
  }, [generalData]);
  useEffect(() => {
    setNavTab(currentTab.value, generalData, generalDataValidation);
  }, [generalDataValidation]);
  return (
    <>
      {/* <ProductAddedSuccessfully
        show={productAddedmodalShow}
        onHide={() => {
          setProductAddedModalShow(false);
        }}
        modalImage={modalImage}
        onSaveAsDraft={() => {
          // navigate('/products/master-products');
          window.history.back();
          setProductAddedModalShow(false);
        }}
      /> */}
      {showVariantModal && (
        <RemoveVariants
          show={showVariantModal}
          onHide={() => setShowVariantModal(false)}
          generalData={generalData}
          onGeneralDataChange={onGeneralDataChange}
          validation={generalDataValidation}
          onNextTab={(tab: any, data: any, validation: any) => {
            setNavTab(tab, data, validation);
          }}
        />
      )}
      {currentTab.value === 1 ? (
        <ProductGuidelines
          show={productGuidelinesmodalShow}
          onHide={() => setProductGuidelinesModalShow(false)}
        />
      ) : (
        <></>
      )}
      <div>
        <Row className="mb-5">
          <Col sm>
            <h1 className="fs-22 fw-bolder">Edit details</h1>
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
                  {currentTab.value === 1 ? (
                    <Col sm={'auto'}>
                      <Button
                        variant=""
                        type="button"
                        className="btn btn-flush"
                        onClick={() => setProductGuidelinesModalShow(true)}
                      >
                        <span className="fs-18 fw-600 text-primary">
                          View image guideline
                        </span>
                      </Button>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
              </div>
              <div
                className="tab-content"
                id="myTabContent"
              >
                <div className="tab-pane fade show active">
                  <>{currentTab.content}</>
                  <div className="d-flex  mt-8 ">
                    {currentTab.value === 0 ? (
                      <></>
                    ) : loading ? (
                      <></>
                    ) : (
                      <div>
                        <Button
                          type="button"
                          className="btn btn-lg btn-light btnPrev btn-active-light-primary h-100"
                          onClick={() => {
                            handlePreviousSelectTab(
                              tab[
                                tab.findIndex(
                                  (val: any) => val.value === currentTab.value
                                ) - 1
                              ]
                            );
                          }}
                          // disabled={loading}
                        >
                          Previous
                        </Button>
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        className={clsx(
                          loading ? 'btn btn-lg btnNext' : 'btn btn-lg'
                        )}
                        onClick={() => {
                          currentTab.value !== 2
                            ? handleSelectTab(
                                tab[
                                  tab.findIndex(
                                    (val: any) => val.value === currentTab.value
                                  ) + 1
                                ]
                              )
                            : handleSubmit();
                        }}
                        disabled={loading}
                      >
                        {!loading && (
                          <span className="indicator-label">
                            {currentTab.value === 2 ? 'Finish' : 'Next'}
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
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <div className="d-flex justify-content-center">
              <Loader loading={fetchLoader} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default EditProduct;
