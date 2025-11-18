import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { fileValidation } from '../../../Global/fileValidation';
import Loader from '../../../Global/loader';
import { error, success } from '../../../Global/toast';
import APICallService from '../../../api/apiCallService';
import { product } from '../../../api/apiEndPoints';
import { productJSON } from '../../../api/apiJSON/product';
import { catalogue } from '../../../utils/toast';
import ProductGuidelines from '../../custom/modals/ProductGuidelines';
import General from './General';
import ProductImages from './product-images';
import Price from './price';
import ProductAsDraft from '../../modals/product-as-draft';
import { AllProduct } from '../../../utils/string';
import ProductAddedSuccessfully from '../../modals/product-added-successfully';
import { useAuth } from '../auth';
import Method from '../../../utils/methods';
import { Add, Product } from '../../../utils/constants';
import Validations from '../../../utils/validations';
import RemoveVariants from '../../modals/remove-variants';
export const AddNewProduct = () => {
  const { currentUser } = useAuth();
  const [dragId, setDragId] = useState();
  const [modalImage, setModalImage] = useState('');
  const [categories, setCategories] = useState<any>();
  const [variants, setVariants] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [brands, setBrands] = useState<any>();
  const [fetchLoader, setFetchLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialVariants, setInitialVariant]: any = useState<any>([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [productsList, setProductsList] = useState<any>([]);
  const location: any = useLocation();
  const params = useParams();
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      const tempProductList = await fetchProductList();
      if (!Method.hasPermission(Product, Add, currentUser)) {
        return window.history.back();
      }
      let apiService = new APICallService(
        product.initProduct,
        {},
        '',
        '',
        false,
        '',
        Product
      );
      let response = await apiService.callAPI();
      if (response.defaultItems) {
        let catTemp: any = [];
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
              generalData={generalData}
              categories={catTemp}
              countries={response.defaultItems.countries}
              variants={response.defaultItems.variants}
              brands={response.defaultItems.brands}
              validations={generalDataValidation}
              onValidationChange={onValidationChange}
              productList={tempProductList}
            />
          ),
          value: 0,
        });
      }
      setFetchLoader(false);
    })();
    //setDisabled(true);
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
    currentBrand: null,
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
    searchTag: {
      inputValue: '',
      options: [],
    },
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
  const [productAsDraftmodalShow, setProductAsDraftModalShow] = useState(false);
  const [productAddedModalShow, setProductAddedModalShow] = useState(false);
  const [productGuidelinesmodalShow, setProductGuidelinesModalShow] =
    useState(false);
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
  const handleSelectTab = async (tab: any) => {
    let generalTemp = JSON.parse(JSON.stringify({ ...generalData }));
    if (tab.value === 1 && currentTab?.value === 0) {
      let generalTabValidations = await checkGeneralTabValidation(generalTemp);
      const isNameValid = productsList.find(
        (item: any) =>
          item.label.toLowerCase() === generalData.productTitle.toLowerCase()
      );
      if (isNameValid) {
        setGeneralDataValidation((pre: any) => {
          return {
            ...pre,
            productTitle: true,
          };
        });
        return error('Product name already exists.');
      }
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
              temp.push({
                title: optionVal.title,
                _id: variantVal._id,
                varId: optionVal._id,
              });
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
                    title: `${generalTemp.productTitle} (${val.title})`,
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
                //setNavTab(tab.value, temp, validations);
              } else {
                let imageString = await combine(data);
                let updatedImageString = imageString.map((val: any) => {
                  return {
                    id: val._id,
                    title: `${generalTemp.productTitle} (${val.title})`,
                    varIds: val.varId,
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
                    varIds: val.varIds,
                    units: generalTemp.combinations[index]
                      ? generalTemp.combinations[index].units
                      : {
                          price: null,
                          skuNumber: null,
                          images: [],
                          imageReader: [],
                          discountByQuantitiesEnabled: false,
                          discountQuantity: [{ quantity: null }],
                          discountAmount: [{ amount: null }],
                        },
                    validation: false,
                  });
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
              //  setNavTab(tab.value, temp, validations);
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
          tempData.push({
            title: generalTemp.productTitle,
            units: generalTemp.combinations[0].units,
          });
          validTemp.push({
            title: false,
            units: generalDataValidation.combinations[0].units,
            validation: false,
          });
          validations.combinations = validTemp;
          generalTemp.combinations = tempData;
          setGeneralDataValidation(validations);
          setNavTab(tab.value, generalTemp, validations);
        }
      }
    } else if (tab.value === 2) {
      let imageValidation = await checkImageValidation(generalTemp);
      if (!imageValidation) {
        setGeneralData(generalTemp);
        setGeneralDataValidation(generalDataValidation);
        setNavTab(tab.value, generalTemp, generalDataValidation);
      }
    } else if (tab.value === 0) {
      setNavTab(tab.value, generalTemp, generalDataValidation);
    } else {
      setNavTab(tab.value, generalTemp, generalDataValidation);
    }
  };
  const checkGeneralTabValidation = async (generalDataTemp: any) => {
    let generalValidationTemp = JSON.parse(
      JSON.stringify({ ...generalDataValidation })
    );
    let valid = [];
    if (generalDataTemp.primaryCategory === '') {
      generalValidationTemp.primaryCategory = true;
      valid.push(true);
    }
    if (generalDataTemp.taxFree === false) {
      if (generalDataTemp.productTax === '') {
        generalValidationTemp.productTax = true;
        valid.push(true);
      }
    }
    if (generalDataTemp.subCategory === '') {
      generalValidationTemp.subCategory = true;
      valid.push(true);
    }
    if (generalDataTemp.productTitle === '') {
      valid.push(true);
      generalValidationTemp.productTitle = true;
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
  const checkImageValidation = async (generalDataTemp: any) => {
    let generalTempValidation = JSON.parse(
      JSON.stringify({ ...generalDataValidation })
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
            temp2.combinations[index].units.images.push({
              url: URL.createObjectURL(selectedFiles?.[i]),
              obj: data,
              order: i,
              id: i,
            });
          });
        }
      }
      //event.target.value = '';
      await setGeneralData(temp2);
      generalValidationTemp.combinations[index].units.images = false;
      await setGeneralDataValidation(generalValidationTemp);
    }
  };
  const handleDrag = async (ev: any) => {
    await setDragId(ev.currentTarget.id);
  };
  const handleDrop = async (event: any, index: number, imageIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    const dragBox = temp.combinations[index].units.images.find((box: any) => {
      return box.id == dragId;
    });
    const dropBox = temp.combinations[index].units.images.find(
      (box: any) => box.id == event.currentTarget.id
    );
    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;
    const newBoxState = temp.combinations[index].units.images.map(
      (box: any) => {
        if (box.id == dragId) {
          box.order = dropBoxOrder;
        }
        if (box.id == event.currentTarget.id) {
          box.order = dragBoxOrder;
        }
        return box;
      }
    );
    temp.combinations[index].units.images = newBoxState;
    await setGeneralData(temp);
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
            quantitySet.add(dis.quantity);
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
        updatedObject = { ...updatedObject, groupCategory: temp.groupCategory };
      if (temp.brand) updatedObject = { ...updatedObject, brand: temp.brand };
      if (temp.description)
        updatedObject = { ...updatedObject, description: temp.description };
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
      if (!temp.taxFree)
        updatedObject = { ...updatedObject, productTax: temp.productTax };
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
            const innerText = extractTextWithinParentheses(combVal.title);
            const selectedVariantsTitle = innerText.split(',');
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
      let modalImageTemp = updatedObject.combinations[0].images[0].url;
      setModalImage(modalImageTemp);
      let apiService = new APICallService(
        product.addProduct,
        productJSON.addProduct({ product: updatedObject }),
        '',
        '',
        false,
        '',
        Product
      );
      let response = await apiService.callAPI();
      if (response) {
        success(catalogue.added);
        setProductAddedModalShow(true);
      }
      setLoading(false);
    } else if (!checked && quantitySame) {
      error('Bundle quantity for same variant should be different');
    }
  };
  function extractTextWithinParentheses(str: string): string {
    // let depth = 0
    // let result = ''
    // let withinParentheses = false
    // for (let i = 0; i < str.length; i++) {
    //   if (str[i] === '(') {
    //     if (!withinParentheses) {
    //       result += '(' // Include '(' if it's the start of innermost parentheses
    //     }
    //     depth++
    //     withinParentheses = true
    //   } else if (str[i] === ')') {
    //     depth--
    //     if (depth === 0) {
    //       return result // Return the result if we reach the end of innermost parentheses
    //     }
    //   } else if (withinParentheses) {
    //     result += str[i]
    //   }
    // }
    // return result
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
  const combine = ([head, ...[headTail, ...tailTail]]: any): any => {
    if (!headTail) return head;
    const combined = headTail.reduce((acc: any, x: any) => {
      return acc.concat(
        head.map((h: any) => {
          let data = {
            title: `${h.title},${x.title}`,
            _id: `${h._id}-${x._id}`,
            varId: `${h.varId}-${x.varId}`,
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
              productList={productsList}
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
              onValidationChange={onValidationChange}
              onGeneralDataChange={onGeneralDataChange}
              loading={loading}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
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
        productList={productsList}
      />
    ),
    value: 0,
  });
  useEffect(() => {
    setNavTab(currentTab.value, generalData, generalDataValidation);
  }, [generalData]);
  useEffect(() => {
    setNavTab(currentTab.value, generalData, generalDataValidation);
  }, [generalDataValidation]);
  const onSaveAsDraft = async () => {
    setLoading(true);
    let temp: any = { ...generalData };
    let updatedObject: any = {
      primaryCategory: temp.primaryCategory,
      subCategory: temp.subCategory,
      productTitle: Method.replaceSpaceWithCustom(temp.productTitle, ')'),
      isDraft: true,
      taxFree: temp.taxFree,
      searchTag: temp.searchTag,
    };
    if (temp.country)
      updatedObject = { ...updatedObject, country: temp.country };
    if (temp.groupCategory)
      updatedObject = { ...updatedObject, groupCategory: temp.groupCategory };
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
          let selectedVariantsTitle: any = combVal.title
            .split('(')
            .reduce((preVal: any, currVal: any, index: number) => {
              if (index > 1) {
                return preVal + '(' + currVal;
              } else if (index === 1) {
                return currVal;
              } else {
                return '';
              }
            }, '')
            .replace(')', '')
            .split(',');
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
          };
          combinationTemp.push(innerTemp);
        }
      });
      updatedObject = { ...updatedObject, combinations: combinationTemp };
    }
    let apiService = new APICallService(
      product.addProduct,
      productJSON.addProduct({ product: updatedObject }),
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response) {
      navigate('/all-products/view-all-products');
      success(catalogue.draft);
      setProductAsDraftModalShow(false);
    }
    setLoading(false);
  };
  const handleDraftModal = () => {
    if (
      generalData.isReturnable &&
      (generalData.returnHours === '' || generalData.returnHours === '0')
    ) {
      error('Item return period must be greater than 0.');
    } else {
      setProductAsDraftModalShow(true);
    }
  };
  const fetchProductList = async () => {
    const apiCallService = new APICallService(
      product.getProductTitles,
      {},
      '',
      '',
      false,
      '',
      Product
    );
    const response = await apiCallService.callAPI();
    let temp = [];
    if (response) {
      // setProductsList()
      temp = response?.records?.map((item: any) => {
        return {
          label: item?.title,
          value: item?.title,
        };
      });
      setProductsList(temp);
    }
    return temp;
  };
  console.log('vvvvvvvvv', productsList);
  return (
    <>
      <ProductAsDraft
        show={productAsDraftmodalShow}
        onHide={() => setProductAsDraftModalShow(false)}
        onSaveAsDraft={onSaveAsDraft}
        loading={loading}
      />
      <ProductAddedSuccessfully
        show={productAddedModalShow}
        onHide={() => {
          setProductAddedModalShow(false);
          navigate('/all-products');
        }}
        modalImage={modalImage}
      />
      {showVariantModal && (
        <RemoveVariants
          show={showVariantModal}
          onHide={() => {
            setShowVariantModal(false);
          }}
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
            <h1 className="fs-22 fw-bolder">{AllProduct.newProduct}</h1>
          </Col>
          {!fetchLoader ? (
            <Col sm={'auto'}>
              <Button
                variant="white"
                className="btn-flush text-gray"
                type="button"
                disabled={
                  generalData.primaryCategory === '' ||
                  generalData.subCategory === '' ||
                  generalData.productTitle === ''
                    ? true
                    : false
                }
                onClick={() => {
                  handleDraftModal();
                }}
              >
                {AllProduct.saveDraft}
              </Button>
            </Col>
          ) : (
            <></>
          )}
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
                  <Row className="align-items-center mt-8">
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
                                    (val: any) => val.value === currentTab.value
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
                    </Col>
                  </Row>
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
export default AddNewProduct;
