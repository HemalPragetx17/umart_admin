import { Button, Card, Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import { KTSVG } from '../../../../umart_admin/helpers';
import { useEffect, useState } from 'react';
import Loader from '../../../../Global/loader';
import RemoveImg from '../../../../umart_admin/assets/media/svg_uMart/cross_gray.svg';
import {
  DiscountCampaign,
  FlatDiscount,
  Order,
  PAGE_LIMIT,
  PercentageDiscount,
} from '../../../../utils/constants';
import APICallService from '../../../../api/apiCallService';
import { buyer, master, placeOrder } from '../../../../api/apiEndPoints';
import Method from '../../../../utils/methods';
import { useDebounce } from '../../../../utils/useDebounce';
import SelectProductCart from '../../../modals/select-product-cart';
import Validations from '../../../../utils/validations';
import { placeOrderToast } from '../../../../utils/toast';
import { error, success } from '../../../../Global/toast';
import { instantOrderApiJson } from '../../../../api/apiJSON/placeOrder';
import ConfirmOrderModal from '../../../modals/confirm-order';
import CartPage from './cart-page';
import AddNewCustomerModal from '../../../modals/add-new-customer';
import BlankImg from '../../../../umart_admin/assets/media/avatars/blank.png';
import { useNavigate } from 'react-router-dom';
const AddNewOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [totalRecords, setTotalRecords] = useState(0);
  const [active, setActive] = useState(0);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [subCategoryList, setSubCategoryList] = useState<any>([]);
  const [groupCategoryList, setGroupCategoryList] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedGroupCategory, setSelectedGroupCategory] = useState<any>('');
  const [fetchLoader, setFetchLoader] = useState(false);
  const [fetchCustomerLoader, setFetchCustomerLoader] = useState(false);
  const [fetchCategoryLoader, setFetchCategoryLoader] = useState(false);
  const [fetchAddressLoader, setFetchAddressLoader] = useState(false);
  const [productLoader, setProductLoader] = useState(false);
  const [productList, setProductList] = useState<any>([]);
  const [selectProducts, setSelectedProduct] = useState<any>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>();
  const [addressModal, setAddressModal] = useState(false);
  const [search, setSearch] = useState('');
  const [variantId, setVariantId] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>([]);
  const [initData, setInitData] = useState<{
    currency: number;
    deliveryCharge: number;
    minOrderValue: number;
    platformFee: number;
    taxes: any;
  }>({
    currency: 0,
    deliveryCharge: 0,
    minOrderValue: 0,
    platformFee: 0,
    taxes: [],
  });
  const [validation, setValidation] = useState<{
    customer: boolean;
    product: boolean;
  }>({
    customer: false,
    product: false,
  });
  const [checkStockResult, setCheckStockResult] = useState<any>();
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(undefined);
  const [appliedCartDiscount, setAppliedCartDiscount] =
    useState<any>(undefined);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<any>(undefined);
  const [cartDiscountList, setCartDiscountList] = useState<any>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      await fetchCustomers(1, 0);
      setFetchLoader(false);
      await fetchCategory();
      await fetchInitData();
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (
        selectedCoupon &&
        selectedCoupon?.minimumPurchaseAmount >
          getTotalOrderValue(selectProducts || [])
      ) {
        setSelectedCoupon(undefined);
      }
      setIsDisabled(true);
      await fetchCartDiscounts(selectProducts);
      await fetchStockResult(selectProducts);
      setIsDisabled(false);
    })();
  }, [selectProducts]);
  const fetchCustomers = async (
    pageNo: number,
    limit: number,
    search: string = ''
  ) => {
    setFetchCustomerLoader(true);
    const params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
      searchTerm: search ? search.trim() : '',
      needCount: true,
      state: 1,
    };
    const apiCallService = new APICallService(
      buyer.customerList,
      params,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      const temp = response.records.map((val: any) => {
        return {
          label: (
            <>
              <div className="d-flex">
                <div className="me-3 h-40px w-30px">
                  <img
                    src={val?.image || BlankImg}
                    className="object-fit-contain h-40px w-30px"
                  />
                </div>
                <div>
                  <span className="fs-16 fw-600 text-black mb-0">
                    {val?.name ? val.name : '-'}
                  </span>
                  <span className="fs-14 fw-500 text-gray-600 mb-0 d-block">
                    {val.phoneCountry + ' ' + val.phone}
                  </span>
                </div>
              </div>
            </>
          ),
          value: val._id,
          id: val._id,
          title: val?.name ? val.name : '-',
          name: val?.name || '-',
          phone: val?.phone || '',
        };
      });
      setCustomers(temp);
    }
    setFetchCustomerLoader(false);
  };
  const fetchCategory = async () => {
    setFetchCategoryLoader(true);
    let apiService = new APICallService(
      master.categoryList,
      {
        categoriesDepth: 3,
      },
      '',
      '',
      false,
      '',
      Order
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      let temp: any = [];
      response.records.map((val: any) => {
        temp.push({
          value: val._id,
          name: val.title,
          id: val._id,
          img: val.image,
          categories: val.categories,
          label: (
            <>
              <span className="symbol symbol-xl-40px symbol-35px symbol-circle border me-2">
                <img
                  src={val.image}
                  className="object-fit-cover"
                  alt=""
                />
              </span>
              <label
                className="form-check-label fs-16 fw-600 text-dark"
                htmlFor="Ex2"
              >
                {val.title}
              </label>
            </>
          ),
          title: val.title,
        });
      });
      setCategoryList(temp);
    }
    setFetchCategoryLoader(false);
  };
  const fetchProducts = async (
    page: number,
    limit: number,
    category?: string,
    subCategory?: string,
    groupCategory?: string,
    search?: string
  ) => {
    setProductLoader(true);
    let params = {
      page: page,
      limit: limit,
      sortKey: 'orderCount',
      sortOrder: -1,
      needCount: true,
      category: groupCategory || subCategory || category || '',
      categoryDepth: groupCategory ? 3 : subCategory ? 2 : 1,
      searchTerm: search || '',
    };
    const apiCallService = new APICallService(
      placeOrder.sellableProduct,
      params,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      if (response.records) {
        setProductList(response.records);
      }
    }
    setProductLoader(false);
  };
  const fetchInitData = async () => {
    const apiCallService = new APICallService(
      placeOrder.getInitData,
      {},
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setInitData(response);
    }
  };
  const fetchCartDiscounts = async (selectedProducts: any) => {
    // setFetchLoader(true);
    const apiCallService = new APICallService(
      placeOrder.getCartDiscount,
      {},
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setCartDiscountList(response?.records || []);
      if (response.records.length) {
        const totalOrderValue = getTotalOrderValue(selectedProducts) || 0;
        const appliedCart = Method.getAppliedCartDiscount(
          response.records,
          totalOrderValue
        );
        setAppliedCartDiscount(appliedCart);
      } else {
        setAppliedCartDiscount(undefined);
      }
    }
    // setFetchLoader(false);
  };
  const handleCustomerChange = async (event: any) => {
    const tempValidation = { ...validation };
    setSelectedCustomer(event);
    // await fetchCustomerAddress(event.value);
    if (event) {
      tempValidation.customer = false;
    } else {
      tempValidation.customer = true;
    }
    setValidation(tempValidation);
  };
  const handleCategoryChange = async (event: any) => {
    if (event) {
      let temp: any = [];
      let subCategoryTemp = event?.categories?.map((val: any) => {
        return {
          value: val._id,
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
      setSelectedCategory(event);
      setSubCategoryList(subCategoryTemp);
      await fetchProducts(1, 0, event.value);
    } else {
      setSelectedCategory(null);
      setSubCategoryList([]);
      setProductList([]);
    }
    setSelectedSubCategory(null);
    setGroupCategoryList([]);
  };
  const handleSubCategory = async (event: any) => {
    if (event) {
      setSelectedSubCategory(event);
      setGroupCategoryList(event?.subCategory || []);
      await fetchProducts(1, 0, undefined, event.value);
    } else {
      setSelectedSubCategory(null);
      setGroupCategoryList([]);
      await fetchProducts(1, 0, selectedCategory.value);
    }
  };
  const handleActive = async (index: number, id: string) => {
    setActive(index);
    setSelectedGroupCategory(id);
    await fetchProducts(
      1,
      0,
      selectedCategory?.value,
      selectedSubCategory?.value,
      id,
      search
    );
  };
  const debounce = useDebounce(fetchProducts, 300);
  const handleSearch = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    // const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearch(input);
    if (input.trim().length > 2 && search !== input) {
      await debounce(
        1,
        0,
        selectedCategory?.value,
        selectedSubCategory?.value,
        selectedGroupCategory,
        input
      );
    } else if (input.trim().length <= 2 && input.length < search.length) {
      if (input.trim().length === 0 && !selectedCategory) {
        setProductList([]);
        return;
      }
      await debounce(
        1,
        0,
        selectedCategory?.value,
        selectedSubCategory?.value,
        selectedGroupCategory,
        input
      );
    }
  };
  const handleSelect = (productVal: any) => {
    setVariantId(productVal?.product?.reference);
    setShowCardModal(true);
  };
  //  const handleAddProduct = async (newProducts: any) => {
  //   console.log('newj',newProducts);
  //   newProducts.map((product: any) => {
  //     let temp = [...selectProducts];
  //     console.log('dfkldjslfj',product)
  //     for (const obj of product) {
  //       console.log('obj',obj);
  //       const matchObj = temp.findIndex((val) => val._id === obj._id);
  //       if (matchObj != -1) {
  //         temp[matchObj].quantityTypes[0].stockCount +=
  //           obj.quantityTypes[0].stockCount || 0;
  //       } else {
  //         temp.push(obj);
  //       }
  //     }
  //     setValidation({ ...validation, product: false });
  //     setSelectedProduct(temp);
  //     fetchStockResult(temp);
  //   });
  //   // setShowCardModal(false);
  // };
  const handleAddProduct = async (product: any) => {
    let temp = [...selectProducts];
    for (const obj of product) {
      const matchObj = temp.findIndex((val) => val._id === obj._id);
      if (matchObj != -1) {
        const availableStock = temp[matchObj]?.inventoryInfo?.quantityTypes
          ?.length
          ? temp[matchObj]?.inventoryInfo?.quantityTypes[0]?.remainingQty || 0
          : 0;
        let value =
          (temp[matchObj].quantityTypes[0].stockCount || 0) +
          (obj.quantityTypes[0].stockCount || 0);
        if (value > availableStock) {
          temp[matchObj].quantityTypes[0].stockCount = availableStock;
        } else {
          temp[matchObj].quantityTypes[0].stockCount +=
            obj.quantityTypes[0].stockCount || 0;
        }
      } else {
        temp.push(obj);
      }
    }
    setValidation({ ...validation, product: false });
    setSelectedProduct(temp);
    fetchStockResult(temp);
    // setShowCardModal(false);
  };
  const handleQuantityChange = (value: any, index: number, productVal: any) => {
    const temp = [...selectProducts];
    const tempVal = temp[index];
    const availableStock = tempVal?.inventoryInfo?.quantityTypes?.length
      ? tempVal?.inventoryInfo?.quantityTypes[0]?.remainingQty || 0
      : 0;
    if (value < 0 || value > availableStock) {
      return;
    }
    if (productVal?.isDiscountByQuantity && productVal?.bunchObj) {
      const totalQuantity = value * productVal?.bunchObj?.quantity || 0;
      if (totalQuantity > availableStock) {
        return;
      }
      temp[index].quantityTypes[0]['discountsByQuantities'][
        productVal?.bunchObj?.index
      ]['stockCount'] = value;
    } else {
      temp[index].quantityTypes[0]['stockCount'] = value;
    }
    setSelectedProduct(temp);
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleRemove = (index: number) => {
    let temp: any = [...selectProducts];
    temp.splice(index, 1);
    if (!temp.length) {
      setValidation({ ...validation, product: true });
    }
    setSelectedProduct(temp);
  };
  const getTotalAmount = (productVal: any) => {
    const unitPrice = getDiscountValue(productVal);
    const quantity = productVal?.quantityTypes[0]?.stockCount || 0;
    return Method.formatCurrency(unitPrice * quantity);
  };
  const getTotalOrderValue = (products: any) => {
    let total = 0;
    products.forEach((productVal: any) => {
      if (productVal?.isDiscountByQuantity && productVal?.bunchObj) {
        total +=
          productVal.quantityTypes[0]['discountsByQuantities'][
            productVal?.bunchObj?.index
          ]['stockCount'] * productVal?.bunchObj?.discountAmt;
      } else {
        const unitPrice = getDiscountValue(productVal);
        const quantity = productVal?.quantityTypes[0]?.stockCount || 0;
        total += unitPrice * quantity;
      }
    });
    return total || 0;
  };
  const handleDeliverOrder = async (id: any) => {
    const apiCallService = new APICallService(
      placeOrder.deliverOrder,
      {},
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(placeOrderToast.orderPlaced);
      navigate('/orders');
    }
  };
  const handlePlaceOrder = async () => {
    const tempValidation = {
      ...validation,
      customer: !selectedCustomer,
      product: selectProducts.length === 0,
    };
    setValidation(tempValidation);
    if (!selectedCustomer) {
      error(placeOrderToast.selectCustomer);
      return;
    }
    if (selectProducts.length === 0) {
      error(placeOrderToast.selectProduct);
      return;
    }
    const total = getTotalOrderValue(selectProducts);
    if (total < initData.minOrderValue) {
      return error(
        `Order value must be greater than equal to ${initData.minOrderValue}`
      );
    }
    const isValid = await Validations.validateObject(tempValidation);
    if (isValid) {
      // if (currentTab == 1) {
      //   setSelectedCoupon(undefined);
      //   setAppliedCartDiscount(undefined);
      //   setCurrentTab(2);
      // } else {
      setLoading(true);
      // const data = {
      //   variants: selectProducts.map((item: any) => ({
      //     variant: item._id,
      //     quantityType: item?.quantityTypes[0]?.type,
      //     stockCount: item?.quantityTypes[0]?.stockCount,
      //   })),
      //   cartValue: getTotalOrderValue(selectProducts),
      // };
      // const apiCallService = new APICallService(placeOrder.checkStock, data);
      // const response = await apiCallService.callAPI();
      // if (response) {
      //   setCheckStockResult(response);
      //   // setShowConfirmOrderModal(true);
      // }
      const tempCampaign = getCampaignDetails(
        selectedCoupon || appliedCartDiscount
      );
      const apiCallService = new APICallService(
        placeOrder.placeNewOrder,
        instantOrderApiJson.placeOrder(
          selectProducts,
          selectedCustomer,
          checkStockResult?.reward,
          tempCampaign
        ),
        '',
        '',
        false,
        '',
        Order
      );
      const response = await apiCallService.callAPI();
      if (response) {
        if (response?.record?._id)
          await handleDeliverOrder(response?.record?._id);
      }
      setLoading(false);
      // }
    }
  };
  const getDiscountValue = (product: any) => {
    const type = product?.quantityTypes[0]?.discountType;
    let total = product?.quantityTypes[0]?.amount;
    let discountValue = product?.quantityTypes[0]?.discountValue || 0;
    if (type == FlatDiscount) {
      total -= discountValue;
    } else if (type == PercentageDiscount) {
      total -= total * (discountValue / 100);
      total = Math.round(total);
    }
    return total;
  };
  const getCartDiscount = (discountObj: any) => {
    if (discountObj.discountType == FlatDiscount) {
      return discountObj.discountValue;
    } else {
      return Math.round(
        (discountObj.discountValue / 100) * getTotalOrderValue(selectProducts)
      );
    }
  };
  const handleAddCustomerClose = async () => {
    setShowAddCustomerModal(false);
    // setCustomerAddress([]);
    setSelectedCustomer(null);
    await fetchCustomers(1, 0);
  };
  const getCampaignDetails = (obj: any) => {
    if (obj) {
      let campaign = {
        campaignType: obj.type == 'discount' ? 1 : 2,
        discountValue: getCartDiscount(selectedCoupon || appliedCartDiscount),
        campaignRef: obj._id,
      };
      return campaign;
    }
    return undefined;
  };
  const handleProductSelectModalClose = async (data: any) => {
    await fetchCartDiscounts(data);
  };
  const fetchStockResult = async (selectProducts: any) => {
    const data = {
      variants: selectProducts.map((item: any) => ({
        variant: item._id,
        quantityType: item?.quantityTypes[0]?.type,
        stockCount:
          item?.isDiscountByQuantity && item?.bunchObj
            ? item.quantityTypes[0]['discountsByQuantities'][
                item?.bunchObj?.index
              ]['stockCount'] * item?.bunchObj?.quantity
            : item?.quantityTypes[0]?.stockCount,
      })),
      cartValue: getTotalOrderValue(selectProducts),
    };
    const apiCallService = new APICallService(
      placeOrder.checkStock,
      data,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setCheckStockResult(response);
      // setShowConfirmOrderModal(true);
    }
  };
  return (
    <div>
      {showAddCustomerModal ? (
        <AddNewCustomerModal
          show={showAddCustomerModal}
          onHide={() => setShowAddCustomerModal(false)}
          onClose={handleAddCustomerClose}
          setSelectedCustomer={setSelectedCustomer}
        />
      ) : (
        <></>
      )}
      {checkStockResult && showConfirmOrderModal ? (
        <ConfirmOrderModal
          show={showConfirmOrderModal}
          onHide={() => setShowConfirmOrderModal(false)}
          // onSaveAddress={handleSaveAddress}
          checkStockResult={checkStockResult}
          selectedProducts={selectProducts}
          selectedCustomer={selectedCustomer}
          campaignDetails={getCampaignDetails(
            selectedCoupon || appliedCartDiscount
          )}
        />
      ) : (
        <></>
      )}
      {showCardModal ? (
        <SelectProductCart
          show={showCardModal}
          onHide={() => {
            setShowCardModal(false);
          }}
          // onSaveAddress={handleSaveAddress}
          variantId={variantId}
          selectedVariant={selectedVariant}
          onAddProduct={handleAddProduct}
        />
      ) : (
        <></>
      )}
      <Row>
        {currentTab == 1 ? (
          <Col
            xs={12}
            className="d-flex justify-content-between align-items-center"
          >
            <h1 className="fs-22 fw-bolder">{'Add new order'}</h1>
            <button
              type="button"
              className="me-2  btn btn-primary btn-lg"
              onClick={() => setShowAddCustomerModal(true)}
              disabled={fetchLoader}
            >
              <span className="indicator-label fs-16 fw-bold">
                Add Customer
              </span>
            </button>
          </Col>
        ) : (
          <></>
        )}
        {currentTab == 1 ? (
          <>
            {' '}
            {fetchLoader ? (
              <Col xs={12}>
                <div className="d-flex justify-content-center mt-4">
                  <Loader loading={fetchLoader} />
                </div>
              </Col>
            ) : (
              <>
                {' '}
                <Col
                  xs={12}
                  className="mt-5"
                >
                  <Card className="border border-1 border-gray-300 bg-f9f9f9 mb-7">
                    <Card.Body>
                      <Row>
                        <Col
                          xs={12}
                          md={6}
                        >
                          <Row className="align-items-center">
                            <Col md={4}>
                              <Form.Label className="fs-16 fw-500">
                                Customer name
                              </Form.Label>
                            </Col>
                            <Col>
                              <CustomSelectWhite
                                backgroundColor="#ffff"
                                isDisabled={fetchCustomerLoader}
                                minHeight="60px"
                                loading={fetchCustomerLoader}
                                closeMenuOnSelect={true}
                                value={selectedCustomer}
                                isSearchable={true}
                                placeholder="Select customer"
                                options={
                                  customers && customers.length ? customers : []
                                }
                                onChange={handleCustomerChange}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col
                  xs={12}
                  className="mt-0"
                >
                  <Card className="border border-1 border-gray-300 bg-f9f9f9 mb-7">
                    <Card.Body className="pt-6">
                      <Row>
                        <Col xs={12}>
                          <h3 className="fs-20 fw-bolder">Select Products</h3>
                        </Col>
                        <Col
                          xs={12}
                          className="mt-4"
                        >
                          <Tab.Container
                            id="left-tabs-example"
                            defaultActiveKey={active}
                            // onSelect={handleSelect}
                          >
                            <Row>
                              <Col
                                md={2}
                                className="d-flex pt-5"
                              >
                                <div className="fs-16 fw-500">
                                  Filter by categories
                                </div>
                              </Col>
                              <Col md={10}>
                                <Row>
                                  <Col
                                    md={4}
                                    className="mt-3 mt-md-0"
                                  >
                                    <CustomSelectWhite
                                      backgroundColor="#ffff"
                                      isDisabled={fetchCategoryLoader}
                                      minHeight="60px"
                                      isLoading={fetchCategoryLoader}
                                      closeMenuOnSelect={true}
                                      isSearchable={true}
                                      value={selectedCategory}
                                      isClearable={true}
                                      placeholder="Select category"
                                      options={
                                        categoryList && categoryList.length
                                          ? categoryList
                                          : []
                                      }
                                      onChange={(event: any) => {
                                        handleCategoryChange(event);
                                      }}
                                    />
                                  </Col>
                                  <Col
                                    md={3}
                                    className="my-2 my-md-0"
                                  >
                                    {selectedCategory &&
                                    subCategoryList.length ? (
                                      <CustomSelectWhite
                                        backgroundColor="#ffff"
                                        isDisabled={fetchCategoryLoader}
                                        minHeight="60px"
                                        isLoading={fetchCategoryLoader}
                                        closeMenuOnSelect={true}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder="Select sub category"
                                        options={
                                          subCategoryList &&
                                          subCategoryList.length
                                            ? subCategoryList
                                            : []
                                        }
                                        onChange={(event: any) => {
                                          handleSubCategory(event);
                                        }}
                                        value={selectedSubCategory}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                  </Col>
                                  <Col md={5}>
                                    <div className="d-flex align-items-center position-relative me-lg-4">
                                      <KTSVG
                                        path="/media/icons/duotune/general/gen021.svg"
                                        className="svg-icon-3 position-absolute ms-3"
                                      />
                                      <input
                                        type="text"
                                        id="kt_filter_search"
                                        className="form-control form-control-white min-h-60px form-control-lg ps-10"
                                        placeholder={
                                          'Search by product name...'
                                        }
                                        value={search}
                                        onChange={(event: any) => {
                                          handleSearch(
                                            event.target.value.trimStart()
                                          );
                                        }}
                                        // disabled={!selectedCategory}
                                      />
                                    </div>
                                  </Col>
                                  <Col
                                    xs={12}
                                    className="mt-4"
                                  >
                                    <div className="d-flex g-2">
                                      <Nav
                                        variant="pills"
                                        className="gap-3"
                                      >
                                        {groupCategoryList &&
                                        groupCategoryList.length ? (
                                          <Nav.Item>
                                            <Nav.Link
                                              eventKey="0"
                                              onClick={() => {
                                                handleActive(0, '');
                                              }}
                                              active={active === 0}
                                              className={`pills-radius fs-16 fw-500 border rounded-pill ${
                                                active !== 0
                                                  ? 'bg-gray-dark text-gray-700 fw-600'
                                                  : ''
                                              }`}
                                            >
                                              {' '}
                                              All products{' '}
                                            </Nav.Link>
                                          </Nav.Item>
                                        ) : (
                                          <></>
                                        )}
                                        {
                                          <>
                                            {groupCategoryList.map(
                                              (item: any, index: number) => (
                                                <Nav.Item>
                                                  <Nav.Link
                                                    eventKey={index}
                                                    onClick={() => {
                                                      handleActive(
                                                        index + 1,
                                                        item._id
                                                      );
                                                    }}
                                                    active={
                                                      active === index + 1
                                                    }
                                                    className={`pills-radius fs-16 fw-500 border rounded-pill ${
                                                      active !== index + 1
                                                        ? 'bg-gray-dark text-gray-700 fw-600'
                                                        : ''
                                                    }`}
                                                  >
                                                    {item.title}
                                                  </Nav.Link>
                                                </Nav.Item>
                                              )
                                            )}
                                          </>
                                        }
                                      </Nav>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col
                                xs={12}
                                className="mt-5"
                              >
                                <Tab.Content>
                                  <Tab.Pane
                                    eventKey={active}
                                    active={true}
                                  >
                                    <div className="table-responsive h-lg-315px h-275px overflow-y-auto border-top border-bottom">
                                      <table className="table table-row-bordered align-middle gs-7 gy-4 mb-0 border-2">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark h-70px align-middle">
                                            <th className="min-w-150px">
                                              Product name
                                            </th>
                                            <th className="min-w-150px">
                                              Unit price
                                            </th>
                                            <th className="min-w-125px text-end">
                                              Discount{' '}
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {productLoader ? (
                                            <tr>
                                              <td colSpan={4}>
                                                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                                  <Loader
                                                    loading={productLoader}
                                                  />
                                                </div>
                                              </td>
                                            </tr>
                                          ) : (
                                            <>
                                              {productList &&
                                              productList.length ? (
                                                productList.map(
                                                  (
                                                    productVal: any,
                                                    index: number
                                                  ) => {
                                                    return (
                                                      <tr>
                                                        <td>
                                                          <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-50px border me-5">
                                                              <img
                                                                src={
                                                                  productVal
                                                                    ?.media[0]
                                                                    ?.url || ''
                                                                }
                                                                className="object-fit-contain"
                                                                alt=""
                                                              />
                                                            </div>
                                                            <div className="fs-15 fw-600">
                                                              {productVal?.title ||
                                                                ''}
                                                              <br />
                                                              <span className="fs-14 fw-500 text-gray">
                                                                {/* {
                                                            productVal?.skuNumber
                                                          } */}
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </td>
                                                        <td>
                                                          {productVal
                                                            ?.quantityTypes[0]
                                                            ?.campaignType ==
                                                          DiscountCampaign ? (
                                                            <>
                                                              <div className="fs-15 fw-600 text-decoration-line-through text-gray">
                                                                {' '}
                                                                TSh{' '}
                                                                {Method.formatCurrency(
                                                                  productVal
                                                                    ?.quantityTypes[0]
                                                                    ?.amount ||
                                                                    0
                                                                )}
                                                              </div>
                                                              <div className="fs-15 fw-600">
                                                                {' '}
                                                                TSh{' '}
                                                                {Method.formatCurrency(
                                                                  getDiscountValue(
                                                                    productVal
                                                                  )
                                                                )}
                                                              </div>
                                                            </>
                                                          ) : (
                                                            <div className="fs-15 fw-600">
                                                              {' '}
                                                              TSh{' '}
                                                              {Method.formatCurrency(
                                                                productVal
                                                                  ?.quantityTypes[0]
                                                                  ?.amount || 0
                                                              )}
                                                            </div>
                                                          )}
                                                        </td>
                                                        <td className="text-end fs-15 fw-600 ">
                                                          {productVal
                                                            ?.quantityTypes[0]
                                                            ?.campaignType ==
                                                            DiscountCampaign &&
                                                          productVal
                                                            ?.quantityTypes[0]
                                                            ?.discountType ==
                                                            PercentageDiscount ? (
                                                            <div className="fs-15 fw-600">
                                                              {productVal
                                                                ?.quantityTypes[0]
                                                                ?.discountValue ||
                                                                0}
                                                              %
                                                            </div>
                                                          ) : (
                                                            <div className="fs-15 fw-600">
                                                              {' - '}
                                                            </div>
                                                          )}
                                                        </td>
                                                        <td className="text-end">
                                                          <Button
                                                            variant="primary"
                                                            className="fs-14 fw-600"
                                                            onClick={() => {
                                                              handleSelect(
                                                                productVal
                                                              );
                                                              setSelectedVariant(
                                                                productVal.variantType
                                                              );
                                                              // setVariantId(
                                                              //   productVal.product
                                                              //     .reference
                                                              // );
                                                              // setSelectOfferModal(true);
                                                            }}
                                                          >
                                                            Select
                                                          </Button>
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td colSpan={4}>
                                                    <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                                      No Data found
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}
                                            </>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Tab.Pane>
                                </Tab.Content>
                              </Col>
                            </Row>
                          </Tab.Container>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col
                  xs={12}
                  className="mt-0"
                >
                  {selectProducts && selectProducts.length ? (
                    <Card className="border border-1 border-gray-300 bg-f9f9f9 mb-7">
                      <Card.Header className="border-bottom-0">
                        <Card.Title className="fs-20 fw-bolder">
                          Added products
                        </Card.Title>
                      </Card.Header>
                      <Card.Body className="pt-0">
                        <div className="table-responsive">
                          <table className="table table-rounded table-row-bordered align-middle gs-9 gy-4 mb-0">
                            <thead>
                              <tr className="fs-16 fw-bold text-dark h-70px align-middle">
                                <th className="min-w-150px">Product name</th>
                                <th className="min-w-125px">Unit price</th>
                                <th className="min-w-150px">Quantity</th>
                                <th className="min-w-125px">Total amount</th>
                                <th className="min-w-50px text-end"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectProducts.map(
                                (productVal: any, index: number) => {
                                  return (
                                    <tr>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="symbol symbol-50px border me-5">
                                            <img
                                              src={
                                                productVal?.media[0]?.url || ''
                                              }
                                              className="object-fit-contain"
                                              alt=""
                                            />
                                          </div>
                                          <div className="fs-15 fw-600">
                                            {productVal?.title.replace(
                                              /\s*\)\s*/g,
                                              ')'
                                            )}
                                            <br />
                                            <span className="fs-14 fw-500 text-gray">
                                              {productVal?.isDiscountByQuantity &&
                                              productVal?.bunchObj
                                                ? productVal?.bunchObj
                                                    .quantity + ' Units Bunch'
                                                : ''}
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        {productVal?.isDiscountByQuantity &&
                                        productVal?.bunchObj ? (
                                          <div className="fs-15 fw-600">
                                            {' '}
                                            TSh{' '}
                                            {Method.formatCurrency(
                                              productVal?.bunchObj
                                                ?.discountAmt || 0
                                            )}
                                          </div>
                                        ) : (
                                          <>
                                            {' '}
                                            {productVal?.quantityTypes[0]
                                              ?.campaignType ==
                                            DiscountCampaign ? (
                                              <>
                                                <div className="fs-15 fw-600 text-decoration-line-through text-gray">
                                                  {' '}
                                                  TSh{' '}
                                                  {Method.formatCurrency(
                                                    productVal?.quantityTypes[0]
                                                      ?.amount || 0
                                                  )}
                                                </div>
                                                <div className="fs-15 fw-600">
                                                  {' '}
                                                  TSh{' '}
                                                  {Method.formatCurrency(
                                                    getDiscountValue(productVal)
                                                  )}
                                                </div>
                                              </>
                                            ) : (
                                              <div className="fs-15 fw-600">
                                                {' '}
                                                TSh{' '}
                                                {Method.formatCurrency(
                                                  productVal?.quantityTypes[0]
                                                    ?.amount || 0
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        <div className="stepperInput">
                                          <Button
                                            size="sm"
                                            className="button button--addOnLeft bg-primary"
                                            onClick={() => {
                                              const currentStockCount =
                                                productVal?.isDiscountByQuantity &&
                                                productVal?.bunchObj
                                                  ? parseInt(
                                                      productVal
                                                        .quantityTypes[0][
                                                        'discountsByQuantities'
                                                      ][
                                                        productVal?.bunchObj
                                                          ?.index
                                                      ]['stockCount'] || 0
                                                    )
                                                  : parseInt(
                                                      productVal
                                                        .quantityTypes[0]
                                                        .stockCount !==
                                                        undefined
                                                        ? productVal
                                                            .quantityTypes[0]
                                                            .stockCount
                                                        : 0
                                                    );
                                              if (currentStockCount > 0) {
                                                handleQuantityChange(
                                                  currentStockCount - 1,
                                                  index,
                                                  productVal
                                                );
                                              }
                                            }}
                                          >
                                            -
                                          </Button>
                                          <input
                                            type="number"
                                            className="input stepperInput__input form-control"
                                            value={
                                              productVal?.isDiscountByQuantity &&
                                              productVal?.bunchObj
                                                ? productVal?.quantityTypes[0][
                                                    'discountsByQuantities'
                                                  ][productVal.bunchObj.index]
                                                    ?.stockCount || 0
                                                : productVal?.quantityTypes
                                                    ?.length
                                                ? productVal?.quantityTypes[0]
                                                    ?.stockCount || 0
                                                : 0
                                            }
                                            onChange={(event: any) => {
                                              handleQuantityChange(
                                                event.target.value,
                                                index,
                                                productVal
                                              );
                                            }}
                                            onKeyPress={(event: any) => {
                                              handleOnKeyPress(event);
                                            }}
                                          />
                                          <Button
                                            size="sm"
                                            className="button button--addOnRight bg-primary"
                                            onClick={() => {
                                              const currentStockCount =
                                                productVal?.isDiscountByQuantity &&
                                                productVal?.bunchObj
                                                  ? parseInt(
                                                      productVal
                                                        .quantityTypes[0][
                                                        'discountsByQuantities'
                                                      ][
                                                        productVal?.bunchObj
                                                          ?.index
                                                      ]['stockCount'] || 0
                                                    )
                                                  : parseInt(
                                                      productVal
                                                        .quantityTypes[0]
                                                        .stockCount !==
                                                        undefined
                                                        ? productVal
                                                            .quantityTypes[0]
                                                            .stockCount
                                                        : 0
                                                    );
                                              handleQuantityChange(
                                                currentStockCount + 1,
                                                index,
                                                productVal
                                              );
                                            }}
                                          >
                                            +
                                          </Button>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="fs-15 fw-600">
                                          TSh{' '}
                                          {productVal?.isDiscountByQuantity &&
                                          productVal?.bunchObj
                                            ? Method.formatCurrency(
                                                (productVal?.quantityTypes[0][
                                                  'discountsByQuantities'
                                                ][productVal.bunchObj.index]
                                                  ?.stockCount || 0) *
                                                  (productVal?.bunchObj
                                                    ?.discountAmt || 0)
                                              )
                                            : getTotalAmount(productVal)}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="cursor-pointer">
                                          <img
                                            src={RemoveImg}
                                            alt="remove"
                                            onClick={() => handleRemove(index)}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Card.Body>
                    </Card>
                  ) : (
                    <></>
                  )}
                </Col>
                {/* {selectedCustomer ? (
                  <Col
                    xs={12}
                    md={8}
                  >
                    <Card className="border border-1 border-gray-300 bg-f9f9f9 mb-7">
                      <Card.Header className="border-0">
                        <Card.Title className="fs-20 fw-bolder">
                          Delivery address
                        </Card.Title>
                      </Card.Header>
                      <Card.Body className="pt-6">
                        <Row className="align-items-center g-5">
                          {selectedCustomer && customerAddress.length ? (
                            customerAddress.map((val: any, index: number) => {
                              return (
                                <Col
                                  md={12}
                                  key={index}
                                >
                                  <div className="border bg-white border-r8px p-6">
                                    <Row className="align-items-center">
                                      <Col xs="auto">
                                        <div className="symbol symbol-40px">
                                          <Button
                                            variant=""
                                            onClick={() => {
                                              setValidation({
                                                ...validation,
                                                address: false,
                                              });
                                              setSelectedAddress(val._id);
                                            }}
                                          >
                                            <img
                                              src={
                                                selectedAddress === val._id
                                                  ? GreenCheck
                                                  : UnCheck
                                              }
                                              alt=""
                                            />
                                          </Button>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className="d-flex flex-column">
                                          <span className="fs-18 fw-600">
                                            {val?.name || ''} /{' '}
                                            {val?.phoneCountry || ''}{' '}
                                            {val?.phone || ''}
                                          </span>
                                          <span className="fs-16 fw-500">
                                            {val?.addressLine1 || ''}
                                            {', '}
                                            {val?.landmark
                                              ? val.landmark + ' ,'
                                              : ''}{' '}
                                            {val?.city || ''}
                                            {val?.districtName || ''}
                                          </span>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              );
                            })
                          ) : (
                            <></>
                          )}
                          <Col
                            md={12}
                            className="justify-content-start"
                          >
                            <Button
                              variant="link"
                              className="btn-flush text-primary fs-16 fw-bold"
                              onClick={() => setAddressModal(true)}
                            >
                              + Add new address
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : (
                  <></>
                )} */}
                {/* {selectProducts && selectProducts.length > 0 ? (
                  <Col
                    xs={12}
                    md={4}
                  >
                    <Card className="border border-1 border-gray-300 bg-f9f9f9 mb-7">
                      <Card.Header className="border-0">
                        <Card.Title className="fs-20 fw-bolder">
                          Order totals
                        </Card.Title>
                      </Card.Header>
                      <Card.Body className="pt-6">
                        <Row>
                          <Col xs={12}>
                            <div className="d-flex justify-content-between">
                              <span className="fs-18 fw-500">
                                TSh {`(${selectProducts.length} items)`}
                              </span>
                              <span className="fs-18 fw-500">
                                TSh{' '}
                                {Method.formatCurrency(
                                  getTotalOrderValue(selectProducts) || 0
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={12}
                            className="my-3"
                          >
                            <div className="d-flex justify-content-between">
                              <span className="fs-18 fw-500">
                                Platform fees:
                              </span>
                              <span className="fs-18 fw-500">
                                TSh {initData?.platformFee || 0}
                              </span>
                            </div>
                          </Col>
                          <Col xs={12}>
                            <div className="d-flex justify-content-between">
                              <span className="fs-20 fw-500">
                                Total Amount:
                              </span>
                              <span className="fs-20 fw-500">
                                TSh{' '}
                                {Method.formatCurrency(
                                  getTotalOrderValue(selectProducts) +
                                    (initData?.platformFee || 0)
                                )}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : (
                  <></>
                )} */}
                {selectProducts && selectProducts.length > 0 ? (
                  <Col>
                    <CartPage
                      selectedProducts={selectProducts}
                      initData={initData}
                      buyer={selectedCustomer?.value}
                      appliedCartDiscount={appliedCartDiscount}
                      setAppliedCartDiscount={(data: any) =>
                        setAppliedCartDiscount(data)
                      }
                      selectedCoupon={selectedCoupon}
                      setSelectedCoupon={(data: any) => setSelectedCoupon(data)}
                      checkStockResult={checkStockResult}
                    />
                  </Col>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </Row>
      {!fetchLoader ? (
        <div className="d-flex justify-content-start mt-3">
          {/* {currentTab == 2 ? (
            !loading ? (
              <Button
                className="me-3"
                size="lg"
                onClick={() => setCurrentTab(1)}
                disabled={loading}
              >
                {!loading && <span className="indicator-label"> Back</span>}
              </Button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )} */}
          <Button
            size="lg"
            onClick={() => handlePlaceOrder()}
            disabled={loading || isDisabled}
          >
            {!loading && (
              <span className="indicator-label"> {'Place order'}</span>
            )}
            {loading && (
              <span
                className="indicator-progress"
                style={{ display: 'block' }}
              >
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default AddNewOrder;
