import { useEffect, useState } from 'react';
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
import { Product } from '../../../../utils/constants';
import Products from '../products';
const EditProduct = () => {
  const { state }: any = useLocation();
  const [sortClass, setSortClass] = useState({
    name: 1,
    position: 1,
  });
  const [fetchLoader, setFetchLoader] = useState(true);
  const [loading, setLoading] = useState(false);
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
        let tempCombinations: any = [];
        let tempCombinationValidation: any = [];
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
        let imagesTemp: any = [];
        response.product.media.map((val: any, index: number) => {
          imagesTemp.push({ ...val, id: index, order: index });
        });
        combinationTemp = {
          ...combinationTemp,
          title: response.product.title,
          units: {
            price: response.product.quantityTypes[0].amount,
            skuNumber: response.product.skuNumber,
            images: imagesTemp,
            quantityTypes: response.product.quantityTypes,
            discountByQuantitiesEnabled:
              response.product.quantityTypes[0]?.discountByQuantitiesEnabled ||
              false,
            discountQuantity:
              response.product?.quantityTypes[0]?.discountsByQuantities &&
              response.product?.quantityTypes[0]?.discountsByQuantities.length
                ? response.product?.quantityTypes[0]?.discountsByQuantities.map(
                    (item: any) => {
                      return { quantity: item.quantity };
                    }
                  )
                : [{ quantity: null }],
            discountAmount:
              response.product?.quantityTypes[0]?.discountsByQuantities &&
              response.product?.quantityTypes[0]?.discountsByQuantities.length
                ? response.product?.quantityTypes[0]?.discountsByQuantities.map(
                    (item: any) => {
                      return { amount: item.discountAmt };
                    }
                  )
                : [{ amount: null }],
          },
        };
        tempCombinations.push(combinationTemp);
        tempCombinationValidation.push(combinationValidationTemp);
        temp.combinations = tempCombinations;
        tempCombinationValidation.combinations = tempCombinationValidation;
        setGeneralDataValidation(tempValidation);
        setGeneralData(temp);
        setCurrentTab({
          name: 'Product images',
          content: (
            <ProductImages
              generalData={temp}
              handleImage={(event: any, index: any) => {
                handleImage(event, index);
              }}
              handleRemoveImage={handleRemoveImage}
              validations={tempValidation}
              onGeneralDataChange={onGeneralDataChange}
              onValidationChange={onValidationChange}
              loading={loading}
            />
          ),
          value: 1,
        });
      }
      setFetchLoader(false);
    })();
    // setDisabled(true);
  }, []);
  const navigate = useNavigate();
  const [tab, setTab] = useState([
    { name: 'Product images', content: <ProductImages />, value: 1 },
    { name: 'Price', content: <Price />, value: 2 },
  ]);
  const [disabled, setDisabled] = useState(false);
  const [generalData, setGeneralData] = useState<any>({
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
  const [priceValidation, setPriceValidation] = useState(false);
  const onGeneralDataChange = (data: any) => {
    setGeneralData(data);
  };
  const onValidationChange = (data: any) => {
    setGeneralDataValidation(data);
  };
  const [imageString, setImageString] = useState();
  const [productAsDraftmodalShow, setProductAsDraftModalShow] = useState(false);
  const [productAddedmodalShow, setProductAddedModalShow] = useState(false);
  const [productGuidelinesmodalShow, setProductGuidelinesModalShow] =
    useState(false);
  const createTabs = () => {
    const localTab = tab;
    let current = currentTab;
    const allTabs = localTab.map((tab) => {
      return (
        <li className="nav-item">
          <Link
            to={'/'}
            className={clsx(
              'nav-link  ',
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
    if (tab.value === 8) {
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
              if (data[0].length === 1) {
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
                setNavTab(tab.value, temp, validations);
              } else {
                let imageString = await combine(data);
                let updatedImageString = imageString.map((val: any) => {
                  return {
                    id: val._id,
                    title: `${generalTemp.productTitle} (${val.title})`,
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
                    units: generalTemp.combinations[index]
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
    if (tab) {
      setNavTab(tab.value, generalData, generalDataValidation);
    }
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
          if (!dis.quantity || !Validations.allowNumberAndFloat(dis.quantity) || dis.quantity <= 1 ) {
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
      let updatedObject: any = {};
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
              .split('(')[1]
              .replace(')', ' ')
              .split(',');
            selectedVariantsId.map((val: any, index: number) => {
              variantsSelected.push({
                id: val,
                title: selectedVariantsTitle[index],
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
        product.editProductVariant,
        productJSON.editProductVariant({ product: updatedObject }),
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
        // window.history.back();
        success(catalogue.updated);
      }
      setLoading(false);
    } else if (!checked && quantitySame) {
      error('Bundle quantity for same variant should be different');
    }
  };

  const combine = ([head, ...[headTail, ...tailTail]]: any): any => {
    if (!headTail) return head;
    const combined = headTail.reduce((acc: any, x: any) => {
      return acc.concat(
        head.map((h: any) => {
          let data = {
            title: `${h.title},${x.title}`,
            _id: `${h._id}-${x._id}`,
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
    name: 'Product images',
    content: (
      <ProductImages
        generalData={generalData}
        handleImage={(event: any, index: any) => {
          handleImage(event, index);
        }}
        handleRemoveImage={handleRemoveImage}
        validations={generalDataValidation}
        onGeneralDataChange={onGeneralDataChange}
        onValidationChange={onValidationChange}
        loading={loading}
      />
    ),
    value: 1,
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
      productTitle: temp.productTitle,
      isDraft: true,
      taxFree: temp.taxFree,
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
          let selectedVariantsTitle: any = combVal.title;
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
            price: combVal.units.quantityTypes[0].price,
            skuNumber: combVal.units.skuNumber,
            quantityTypes: combVal.units.quantityTypes,
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
  return (
    <>
      {currentTab.value === 1 ? (
        <ProductGuidelines
          show={productGuidelinesmodalShow}
          onHide={() => setProductGuidelinesModalShow(false)}
        />
      ) : (
        <></>
      )}
      <div className="">
        <Row className="mb-5">
          <Col sm>
            <h1 className="fs-22 fw-bolder">
              Edit {generalData.combinations[0].title} details
            </h1>
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
                  <div className="d-flex justify-content-end mt-8">
                    {currentTab.value === 1 ? (
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
