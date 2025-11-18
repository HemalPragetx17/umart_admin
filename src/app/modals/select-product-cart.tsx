import { Button, Card, Modal, Row, Col, FormLabel } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { useEffect, useState } from 'react';
import APICallService from '../../api/apiCallService';
import { placeOrder } from '../../api/apiEndPoints';
import Loader from '../../Global/loader';
import { error } from '../../Global/toast';
import Method from '../../utils/methods';
import {
  DiscountCampaign,
  FlatDiscount,
  Order,
  PercentageDiscount,
} from '../../utils/constants';
const SelectProductCart = (props: any) => {
  const loading = false;
  const [fetchLoader, setFetchLoader] = useState(true);
  const [productData, setProductData] = useState<any>([]);
  const [selectedVariantType, setSelectedVariantType] = useState<any>([]);
  const [variants, setVariants] = useState([]);
  const [selectedOption, setSelectedOptions] = useState(
    JSON.parse(
      JSON.stringify(
        props.selectedVariant.map((val: any) => {
          return { ...val, available: true };
        })
      )
    )
  );
  const [selectedVariants, setSelectedVariants] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<any>();
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      await fetchInfo(props.variantId);
      setFetchLoader(false);
    })();
  }, [props.show]);
  const fetchInfo = async (variantId: string) => {
    let apiService = new APICallService(
      placeOrder.sellableProductInfo,
      variantId,
      '',
      '',
      false,
      '',
      Order
    );
    let response = await apiService.callAPI();
    let productObj = response;
    let definedVariantsTypes = productObj['definedVariantsTypes'] || [];
    let variantList = productObj['variants'] || [];
    let variantIdValueMap = variantList.reduce((p: any, c: any) => {
      c = c['variant'];
      p[getVariantTypeKey(c['variantType'])] = c;
      return p;
    }, {});
    setVariants(variantList);
    if (definedVariantsTypes.length === 0) {
      setSelectedVariantType({
        ...productObj.variants[0].variant,
        quantityTypes: productObj.variants[0].variant.quantityTypes.map(
          (item: any) => {
            return {
              ...item,
              valId: productObj.variants[0].variant._id + '_' + '0',
              discountsByQuantities: item.discountsByQuantities.map(
                (valItem: any) => {
                  return {
                    ...valItem,
                    valId:
                      productObj.variants[0].variant._id +
                      '_' +
                      valItem.quantity,
                  };
                }
              ),
            };
          }
        ),
        category: response.category,
        subCategory: response.subCategory,
        groupCategory: response.groupCategory,
        taxFree: response.taxFree,
        productTax: response.productTax,
      });
    } else {
      // Display variant types and options
      let selectedKey = getVariantTypeKey(props?.selectedVariant || []);
      let variantInfo = variantIdValueMap[selectedKey];
      if (variantInfo !== undefined) {
        setSelectedVariantType({
          ...variantInfo,
          quantityTypes: variantInfo.quantityTypes.map((item: any) => {
            return {
              ...item,
              valId: variantInfo._id + '_' + '0',
              discountsByQuantities:
                item?.discountsByQuantities ? item?.discountsByQuantities.map(
                  (valItem: any) => {
                    return {
                      ...valItem,
                      valId: variantInfo._id + '_' + valItem.quantity,
                    };
                  }
                ) : [],
            };
          }),
          category: response.category,
          subCategory: response.subCategory,
          groupCategory: response.groupCategory,
          taxFree: response.taxFree,
          productTax: response.productTax,
        });
      } else {
      }
    }
    setProductData(response);
  };
  function getVariantTypeKey(variantTypesList: any) {
    let refList = [];
    let optionList = [];
    for (let c of variantTypesList) {
      refList.push(c['reference'].trim());
      optionList.push(c['option'].trim());
    }
    refList.sort();
    optionList.sort();
    return [...refList, ...optionList].join('_').trim();
  }
  const handleVariantChange = (
    reference: string,
    option: string,
    index: number
  ) => {
    // let selectedKey = getVariantTypeKey(props.selectedVariant);
    let temp = [...selectedOption];
    // temp[index] = { ...temp[index], option: option.trim() };
    let tempArrKey = [...selectedOption];
    tempArrKey[index] = { ...tempArrKey[index], option: option.trim() };
    let variantIdValueMap = variants.reduce((p: any, c: any) => {
      c = c['variant'];
      p[getVariantTypeKey(c['variantType'])] = c;
      return p;
    }, {});
    let variantInfo = variantIdValueMap[getVariantTypeKey(tempArrKey)];
    if (variantInfo !== undefined) {
      temp[index] = { ...temp[index], option: option.trim(), available: true };
      setSelectedVariantType({
        ...variantInfo,
        quantityTypes: variantInfo.quantityTypes.map((item: any) => {
          return {
            ...item,
            valId: variantInfo._id + '_' + '0',
            discountsByQuantities:
              item?.discountsByQuantities ? item.discountsByQuantities.map(
                (valItem: any) => {
                  return {
                    ...valItem,
                    valId: variantInfo._id + '_' + valItem.quantity,
                  };
                }
              ) : [],
          };
        }),
        category: productData.category,
        subCategory: productData.subCategory,
        groupCategory: productData.groupCategory,
        taxFree: productData.taxFree,
        productTax: productData.productTax,
      });
    } else {
      // temp[index] = { ...temp[index], option: option.trim(), available: false };
      error('Selected variant not available');
    }
    setSelectedOptions(temp);
  };
  const handleAddProduct = async () => {
    if (selectedVariants.length == 0) {
      return error('Quantity must be greater than 0');
    }
    const selectedProducts: any = [];
    for (const item of selectedVariants) {
      const temp = { ...item };
      temp.quantityTypes.forEach((quantityType: any) => {
        if (quantityType.stockCount > 0) {
          const selectedProductCopy = { ...temp };
          selectedProductCopy.quantityTypes = [quantityType];
          selectedProducts.push(selectedProductCopy);
        }
        if (quantityType?.discountByQuantitiesEnabled) {
          quantityType.discountsByQuantities.forEach((item: any) => {
            if (item.stockCount > 0) {
              const selectedProductCopy = { ...temp };
              selectedProductCopy.quantityTypes = [quantityType];
              selectedProducts.push(selectedProductCopy);
            }
          });
        }
      });
    }
    if (selectedProducts.length > 0) {
      setIsLoading(true);
      await props.onAddProduct(selectedProducts);
      setIsLoading(false);
      props.onHide();
    } else {
      error('Quantity must be greater than 0');
    }
  };
  const handleQuantityChange = (
    value: any,
    index: number,
    isBunchAdded: boolean = false,
    bunchIndex: number = 0
  ) => {
    const temp = { ...selectedVariantType };
    const availableStock = selectedVariantType?.inventoryInfo?.quantityTypes
      ?.length
      ? selectedVariantType?.inventoryInfo?.quantityTypes[0]?.remainingQty || 0
      : 0;
    if (value < 0 || value > availableStock) {
      return;
    }
    let tempVariant: any = [...selectedVariants];
    const tempList = [...variants];
    if (!isBunchAdded) {
      temp.quantityTypes[index]['stockCount'] = value;
      temp.quantityTypes[index]['isDisabled'] = false;
      const pos = tempVariant.findIndex((item: any) => item._id == temp._id);
      if (pos == -1) {
        tempVariant.push(temp);
      } else {
        tempVariant[pos].quantityTypes = [temp.quantityTypes[index]];
      }
      if (value == 0) {
        tempVariant = tempVariant.filter((item: any) => item._id != temp._id);
      }
      // setActiveInput(temp.quantityTypes[index].valId);
      temp.quantityTypes[index]['discountsByQuantities'] = temp.quantityTypes[
        index
      ]['discountsByQuantities'].map((item: any) => ({
        ...item,
        isDisabled: value == 0 ? false : true,
      }));
    } else {
      const discountQuantity =
        temp.quantityTypes[index]['discountsByQuantities'][bunchIndex][
          'quantity'
        ];
      const totalQuantity = value * discountQuantity;
      if (totalQuantity > availableStock) {
        return;
      }
      temp.quantityTypes[index]['isDisabled'] = value == 0 ? false : true;
      temp.quantityTypes[index]['discountsByQuantities'][bunchIndex][
        'stockCount'
      ] = value;
      temp.quantityTypes[index]['discountsByQuantities'] = temp.quantityTypes[
        index
      ]['discountsByQuantities'].map((item: any, index: number) => ({
        ...item,
        isDisabled: index === bunchIndex || value == 0 ? false : true,
      }));
      const pos = tempVariant.findIndex(
        (item: any) => item._id == temp._id + '_' + discountQuantity
      );
      if (pos == -1) {
        tempVariant.push({
          ...temp,
          isDiscountByQuantity: true,
          bunchObj: {
            ...temp.quantityTypes[index]['discountsByQuantities'][bunchIndex],
            index: bunchIndex,
          },
        });
      } else {
        tempVariant[pos].quantityTypes = [temp.quantityTypes[index]];
      }
    }
    tempList.forEach((item: any) => {
      if (item.variant._id == temp._id) {
        item.variant.quantityTypes = [temp.quantityTypes[index]];
      }
    });
    setSelectedVariants(tempVariant);
    setSelectedVariantType(temp);
    setVariants(tempList);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const getTotalAmount = (val: any) => {
    const discountValue = getDiscountValue(val);
    const total = (discountValue || 0) * (val?.stockCount || 0);
    return Method.formatCurrency(total || 0);
  };
  const getDiscountValue = (product: any) => {
    const type = product?.discountType;
    let total = product?.amount;
    let discountValue = product?.discountValue || 0;
    if (type == FlatDiscount) {
      total -= discountValue;
    } else if (type == PercentageDiscount) {
      total -= total * (discountValue / 100);
      total = Math.round(total);
    }
    return total;
  };
  const isStockAvailable = (selectedVariantType: any) => {
    const availableStock = selectedVariantType?.inventoryInfo?.quantityTypes
      ?.length
      ? selectedVariantType?.inventoryInfo?.quantityTypes[0]?.remainingQty || 0
      : 0;
    return availableStock > 0;
  };
  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-dialog-centered min-w-lg-794px"
      className="border-r10px"
      centered
    >
      <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
        <img
          className="close-inner-top-2 cursor-pointer"
          style={{
            zIndex: 2,
          }}
          width={40}
          height={40}
          src={CrossSvg}
          alt="closebutton"
          onClick={(e) => {
            props.onHide();
          }}
        />
        {!fetchLoader ? (
          <div>
            <Row className="text-center">
              <Col xs={12}>
                <div
                  id="kt_carousel_1_carousel"
                  className="carousel carousel-custom text-center"
                  data-bs-ride="carousel"
                  data-bs-interval="5000"
                >
                  <div className="carousel-inner  h-200px mw-275px mx-auto">
                    {selectedVariantType &&
                      selectedVariantType?.media.map(
                        (media: any, index: number) => (
                          <div
                            className={`carousel-item h-100 ${
                              index === 0 ? 'active' : ''
                            }`}
                            key={media._id}
                          >
                            <div className="border h-200px w-20">
                              <img
                                className="mh-275px h-100 w-100 object-fit-contain"
                                src={media.url} // Assuming 'url' contains the media URL for the variant
                                alt=""
                              />
                            </div>
                          </div>
                        )
                      )}
                  </div>
                  <ol className="p-0 m-0 carousel-indicators carousel-indicators-dots">
                    {selectedVariantType &&
                      selectedVariantType?.media.map(
                        (media: any, index: number) => (
                          <li
                            key={media._id}
                            data-bs-target="#kt_carousel_1_carousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? 'active' : ''}
                          ></li>
                        )
                      )}
                  </ol>
                </div>
              </Col>
              <Col xs={12}>
                <span className="fs-22 fw-bolder">
                  {selectedVariantType.title.replace(/\s*\)\s*/g, ')')}
                </span>
                <h3 className="fs-26 fw-bolder"></h3>
                <span className="fs-18 fw-500 text-gray">
                  Brand: {productData.brand.title}
                </span>
                {!productData.taxFree && productData.productTax ? (
                  <>
                    <h3 className="fs-26 fw-bolder"></h3>
                    <span className="fs-18 fw-500 text-gray">
                      Tax: {productData.productTax}%
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </div>
        ) : (
          <></>
        )}
      </Modal.Header>
      <Modal.Body>
        <Row>
          {fetchLoader ? (
            <Col
              xs={12}
              className="min-h-200px"
            >
              <div className="d-flex justify-content-center mt-4 align-items-center">
                <Loader loading={fetchLoader} />
              </div>
            </Col>
          ) : (
            <>
              <Col xs={12}>
                <div className="separator"></div>
                {productData.definedVariantsTypes &&
                productData.definedVariantsTypes.length ? (
                  <Row className="g-5">
                    {productData.definedVariantsTypes.map(
                      (variantVal: any, index: number) => {
                        return (
                          <Col
                            md={
                              productData.definedVariantsTypes.length === 1
                                ? 12
                                : 6
                            }
                          >
                            <FormLabel className="fs-18 fw-500">
                              {variantVal.title}:
                            </FormLabel>
                            <div className="d-flex flex-row flex-wrap gap-3">
                              {variantVal.options.map((optionVal: any) => {
                                const isActive =
                                  selectedOption[index].option.trim() ===
                                  optionVal.trim();
                                return (
                                  <Button
                                    variant="link"
                                    className={`badge   border-r23px fs-16 fw-600  ${
                                      isActive
                                        ? selectedOption[index].available
                                          ? 'badge-primary btn-primary'
                                          : 'badge-secondary btn-secondary'
                                        : 'badge-secondary btn-secondary'
                                    }`}
                                    onClick={(event) => {
                                      handleVariantChange(
                                        variantVal.reference,
                                        optionVal.trim(),
                                        index
                                      );
                                    }}
                                    // disabled={!isActive} // Disable the button if already selected
                                    key={optionVal}
                                  >
                                    <span className="px-4">{optionVal}</span>
                                  </Button>
                                );
                              })}
                            </div>
                          </Col>
                        );
                      }
                    )}{' '}
                  </Row>
                ) : (
                  <></>
                )}
              </Col>
              <Col
                xs={12}
                className="mt-5"
              >
                <div className="separator my-3"></div>
                <FormLabel className="fs-18 fw-500">
                  Select Quantity
                  {/* (Coffee / 100g) */}
                </FormLabel>
                <Row className="g-5">
                  {selectedVariantType.quantityTypes.map(
                    (quantVal: any, quantIndex: number) => {
                      return (
                        <>
                          <Col md={8}>
                            <div className="bg-f9f9f9 border border-r8px p-6">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex flex-column">
                                  {quantVal?.campaignType ==
                                  DiscountCampaign ? (
                                    <>
                                      <div className="fs-15 fw-600 text-decoration-line-through text-gray">
                                        {' '}
                                        TSh{' '}
                                        {Method.formatCurrency(
                                          quantVal?.amount || 0
                                        )}
                                      </div>
                                      <div className="fs-15 fw-600">
                                        <span>
                                          {' '}
                                          TSh{' '}
                                          {Method.formatCurrency(
                                            getDiscountValue(quantVal)
                                          )}
                                        </span>
                                        <span className="ms-1">/ Unit</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="fs-15 fw-600">
                                      <span>
                                        {' '}
                                        TSh{' '}
                                        {Method.formatCurrency(
                                          quantVal?.amount || 0
                                        )}
                                      </span>
                                      <span className="ms-1">/ Unit</span>
                                    </div>
                                  )}
                                  {/* <span className="fs-16 fw-600">
                                  TSh {quantVal?.amount || 0}
                                </span> */}
                                  <span
                                    className="fs-16 fw-700"
                                    style={{
                                      marginTop: '10px',
                                    }}
                                  >
                                    TSh {getTotalAmount(quantVal)}{' '}
                                  </span>
                                </div>
                                <div className="stepperInput">
                                  <Button
                                    size="sm"
                                    className="button button--addOnLeft bg-primary"
                                    onClick={() => {
                                      const currentStockCount = parseInt(
                                        quantVal.stockCount !== undefined
                                          ? quantVal.stockCount
                                          : 0
                                      );
                                      if (currentStockCount > 0) {
                                        handleQuantityChange(
                                          currentStockCount - 1,
                                          quantIndex
                                        );
                                      }
                                    }}
                                    disabled={
                                      !isStockAvailable(selectedVariantType) ||
                                      quantVal.isDisabled
                                    }
                                  >
                                    -
                                  </Button>
                                  <input
                                    type="text"
                                    value={
                                      quantVal.stockCount !== undefined
                                        ? quantVal.stockCount
                                        : 0
                                    }
                                    className="input stepperInput__input form-control"
                                    onChange={(event: any) => {
                                      handleQuantityChange(
                                        event.target.value,
                                        quantIndex
                                      );
                                    }}
                                    onKeyPress={(event: any) => {
                                      handleOnKeyPress(event);
                                    }}
                                    disabled={
                                      !isStockAvailable(selectedVariantType) ||
                                      quantVal.isDisabled
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    className="button button--addOnRight bg-primary"
                                    onClick={() => {
                                      handleQuantityChange(
                                        parseInt(
                                          quantVal.stockCount !== undefined
                                            ? quantVal.stockCount
                                            : 0
                                        ) + 1,
                                        quantIndex
                                      );
                                    }}
                                    disabled={
                                      !isStockAvailable(selectedVariantType) ||
                                      quantVal.isDisabled
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Col>
                          {quantVal?.discountsByQuantities.map(
                            (item: any, itemIndex: number) => {
                              return (
                                <Col md={8}>
                                  <div className="bg-f9f9f9 border border-r8px p-6">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="d-flex flex-column">
                                        {/* {quantVal?.campaignType ==
                                      DiscountCampaign ? (
                                        <>
                                          <div className="fs-15 fw-600 text-decoration-line-through text-gray">
                                            {' '}
                                            TSh{' '}
                                            {Method.formatCurrency(
                                              quantVal?.amount || 0
                                            )}
                                          </div>
                                          <div className="fs-15 fw-600">
                                            <span>
                                              {' '}
                                              TSh{' '}
                                              {Method.formatCurrency(
                                                getDiscountValue(quantVal)
                                              )}
                                            </span>
                                            <span className="ms-1">/ Unit</span>
                                          </div>
                                        </>
                                      ) : ( */}
                                        <div className="fs-15 fw-600">
                                          <span>
                                            {' '}
                                            TSh{' '}
                                            {Method.formatCurrency(
                                              item?.discountAmt || 0
                                            )}
                                          </span>
                                          <span className="ms-1">
                                            / {item?.quantity || 0} Unit
                                          </span>
                                        </div>
                                        {/* )} */}
                                        {/* <span className="fs-16 fw-600">
                                  TSh {quantVal?.amount || 0}
                                </span> */}
                                        <span
                                          className="fs-16 fw-700"
                                          style={{
                                            marginTop: '10px',
                                          }}
                                        >
                                          TSh{' '}
                                          {Method.formatCurrency(
                                            (item?.stockCount || 0) *
                                              item?.discountAmt
                                          )}{' '}
                                        </span>
                                      </div>
                                      <div className="stepperInput">
                                        <Button
                                          size="sm"
                                          className="button button--addOnLeft bg-primary"
                                          onClick={() => {
                                            const currentStockCount = parseInt(
                                              item.stockCount !== undefined
                                                ? item.stockCount
                                                : 0
                                            );
                                            if (currentStockCount > 0) {
                                              handleQuantityChange(
                                                currentStockCount - 1,
                                                quantIndex,
                                                true,
                                                itemIndex
                                              );
                                            }
                                          }}
                                          disabled={
                                            !isStockAvailable(
                                              selectedVariantType
                                            ) || item.isDisabled
                                          }
                                        >
                                          -
                                        </Button>
                                        <input
                                          type="text"
                                          value={
                                            item.stockCount !== undefined
                                              ? item.stockCount
                                              : 0
                                          }
                                          className="input stepperInput__input form-control"
                                          onChange={(event: any) => {
                                            handleQuantityChange(
                                              event.target.value,
                                              quantIndex,
                                              true,
                                              itemIndex
                                            );
                                          }}
                                          onKeyPress={(event: any) => {
                                            handleOnKeyPress(event);
                                          }}
                                          disabled={
                                            !isStockAvailable(
                                              selectedVariantType
                                            ) || item.isDisabled
                                          }
                                        />
                                        <Button
                                          size="sm"
                                          className="button button--addOnRight bg-primary"
                                          onClick={() => {
                                            handleQuantityChange(
                                              parseInt(
                                                item.stockCount !== undefined
                                                  ? item.stockCount
                                                  : 0
                                              ) + 1,
                                              quantIndex,
                                              true,
                                              itemIndex
                                            );
                                          }}
                                          disabled={
                                            !isStockAvailable(
                                              selectedVariantType
                                            ) || item.isDisabled
                                          }
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              );
                            }
                          )}
                        </>
                      );
                    }
                  )}
                </Row>
              </Col>
            </>
          )}
        </Row>
      </Modal.Body>
      {!fetchLoader ? (
        <Modal.Footer className="justify-content-center mb-4 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddProduct}
            disabled={isLoading}
          >
            {!isLoading && <span className="indicator-label">Add Product</span>}
            {isLoading && (
              <span
                className="indicator-progress"
                style={{ display: 'block' }}
              >
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </Button>
        </Modal.Footer>
      ) : (
        <></>
      )}
    </Modal>
  );
};
export default SelectProductCart;
