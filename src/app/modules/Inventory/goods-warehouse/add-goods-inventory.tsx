import {
  Button,
  Card,
  Col,
  Form,
  FormLabel,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { InventoryString } from '../../../../utils/string';
import { KTSVG } from '../../../../umart_admin/helpers';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import GrayClose from '../../../../umart_admin/assets/media/svg_uMart/cross_gray.svg';
import AddImg from '../../../../umart_admin/assets/media/svg_uMart/add-img.svg';
import { useEffect, useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import {
  goodsRequests,
  inventory,
  manageProductInventory,
} from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import {
  Add,
  GoodsInWarehouseConst,
  PAGE_LIMIT,
  Units,
} from '../../../../utils/constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { error, success } from '../../../../Global/toast';
import ProductAddedModal from '../../../modals/product-added-inventory';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import { inventoryToast } from '../../../../utils/toast';
import grayInfo from '../../../../umart_admin/assets/media/svg_uMart/error-warning_gray.svg';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
const AddGoodsInWarehouse = () => {
  const location: any = useLocation();
  // const requestId: any = location?.state?.requestId;
  const [requestId, setRequestId] = useState<any>(location?.state?.requestId);
  const [selectedProduct, setSelectedProduct] = useState<any>([]);
  const [wareHouses, setWareHouses] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [selectedWareHouse, setSelectedWareHouse] = useState<any>(undefined);
  const [wareHouseProduct, setWareHouseProducts] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [initData, setInitData] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [requestDetailsLoader, setRequestDetailsLoader] = useState(false);
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<
    {
      variant: string;
      quantityTypes: any;
      batch: any;
    }[]
  >([
    {
      variant: '',
      quantityTypes: [],
      batch: [],
    },
  ]);
  const [productValidation, setProductValidation] = useState<
    {
      variant: boolean;
      quantityTypes: boolean;
    }[]
  >([
    {
      variant: false,
      quantityTypes: false,
    },
  ]);
  const [productLoader, setProductLoader] = useState(false);
  const [batchValidation, setBatchValidation] = useState<
    {
      quantityTypes: boolean;
    }[]
  >([
    {
      quantityTypes: false,
    },
  ]);
  const [requestGoodsDetails, setRequestGoodsDetails] = useState<any>();
  const [loadingArea, setLoadingArea] = useState<any>([]);
  const [productIdTitleMap, setProductIdTitleMap] = useState<
    Record<string, string>
  >({});
  const [zonesValidation, setZonesValidation] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setInitLoading(true);
      if (!Method.hasPermission(GoodsInWarehouseConst, Add, currentUser)) {
        return window.history.back();
      }
      await fetchWarehouses();
      await fetchProductZone();
      if (requestId) {
        // await fetchProducts(1, PAGE_LIMIT);
        // await initialData();
        // await fetchRequestDetails(requestId);
        setRequestDetailsLoader(true);
        await setInitDataForGoodRequest();
        setRequestDetailsLoader(false);
      }
      setInitLoading(false);
    })();
  }, []);
  const fetchWarehouses = async () => {
    let params = {
      pageNo: 1,
      limit: 0,
      sortKey: 'name',
      sortOrder: 1,
      needCount: true,
    };
    const apiService = new APICallService(
      inventory.warehouseList,
      params,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiService.callAPI();
    setWareHouses(response.records);
  };
  const fetchProducts = async (page: number, limit: number) => {
    let params = {
      pageNo: page,
      limit: limit,
      sortKey: 'title',
      sortOrder: 1,
      ['status[0]']: 2,
      state: 2,
      needCount: true,
    };
    const apiService = new APICallService(
      manageProductInventory.listProduct,
      params,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiService.callAPI();
    let data: any = [];
    if (page === 1) {
      setTotalRecords(response.records.length);
    } else {
      data = [...wareHouseProduct];
      let prevTotal = totalRecords;
      setTotalRecords(prevTotal);
    }
    response.records.map((val: any) => {
      data.push(val);
    });
    const tempData: Record<string, string> = {};
    data.forEach((item: any) => {
      tempData[item?._id] = item?.title || '';
    });
    setWareHouseProducts(data);
    setProductIdTitleMap(tempData);
  };
  const fetchProductZone = async () => {
    const apiService = new APICallService(
      inventory.getLoadingArea,
      {},
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setLoadingArea(response.records);
    }
  };
  const initialData = async () => {
    let apiService = new APICallService(
      inventory.initReceivedDirectGoods,
      {},
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    setInitData(response.records);
  };
  const setInitDataForGoodRequest = async () => {
    //fetch all product
    let params = {
      sortKey: 'title',
      sortOrder: 1,
      ['status[0]']: 2,
      state: 2,
    };
    const apiService = new APICallService(
      manageProductInventory.listProduct,
      params,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiService.callAPI();
    let productsData: any = [];
    if (page === 1) {
      setTotalRecords(response.records.length);
    } else {
      productsData = [...wareHouseProduct];
      let prevTotal = totalRecords;
      setTotalRecords(prevTotal);
    }
    response.records.map((val: any) => {
      productsData.push(val);
    });
    setWareHouseProducts(productsData);
    // fetch initial data
    let apiServiceInit = new APICallService(
      inventory.initReceivedDirectGoods,
      {},
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let responseInit = await apiServiceInit.callAPI();
    const tempInitData = responseInit.records;
    setInitData(responseInit.records);
    //fetch request details
    const apiServiceRequest = new APICallService(
      goodsRequests.goodsRequestInfo,
      requestId,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const responseRequest = await apiServiceRequest.callAPI();
    if (responseRequest) {
      setRequestGoodsDetails(responseRequest);
      setSelectedWareHouse({
        id: responseRequest.warehouse.reference,
        name: responseRequest.warehouse.name,
      });
      // const tempProduct:any = {...products};
      const tempProducts: any = [];
      const tempSelectedProductsArray: any = [...selectedProduct];
      responseRequest?.variants.map((item: any, index: number) => {
        const filteredArray: any = productsData.find(
          (obj: any) => obj._id === item.variant._id
        );
        if (filteredArray) {
          const batchQuantityType = item.quantityTypes.map((quantVal: any) => ({
            type: quantVal.type,
            stockCount: quantVal.stockCount,
          }));
          const findObject = findObjectById(tempInitData, filteredArray._id);
          const batchData = {
            batch: findObject?.batch || 1,
            expiry: null,
            quantityTypes: batchQuantityType,
            goodsLoadingArea: [],
          };
          const tempQuantityType: any = {
            ...filteredArray.quantityTypes[0],
            stockCount: item.quantityTypes[0].stockCount,
          };
          const tempItem: any = {};
          tempItem.quantityTypes = [tempQuantityType];
          tempItem.variant = item.variant._id;
          tempItem.batch = [batchData];
          tempProducts.push(tempItem);
          const tempSelectedProduct = productsData.find(
            (val: any) => val._id === item.variant._id
          );
          tempSelectedProductsArray.push(tempSelectedProduct);
          setSelectedProductId(item.variant._id);
        }
      });
      setSelectedProduct(tempSelectedProductsArray);
      setProducts(tempProducts);
    }
  };
  const fetchRequestDetails = async (id: string) => {
    // setFetchLoading(true);
    const apiService = new APICallService(
      goodsRequests.goodsRequestInfo,
      id,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setRequestGoodsDetails(response);
      setSelectedWareHouse({
        id: response.warehouse.reference,
        name: response.warehouse.name,
      });
      // const tempProduct:any = {...products};
      response?.variants.map((item: any, index: number) => {
        handleProductSelect(item.variant._id, index);
      });
    }
    // setFetchLoading(false);
  };
  const handleWareHouse = async (event: any) => {
    if (event) {
      if (event.value !== selectedWareHouse?.id) {
        setProductLoader(true);
        setProducts([
          {
            variant: '',
            quantityTypes: [],
            batch: [],
          },
        ]);
        setProductValidation([
          {
            variant: false,
            quantityTypes: false,
          },
        ]);
        setSelectedWareHouse({
          id: event.value,
          name: event.title,
        });
        setZonesValidation([
          {
            batch: [],
          },
        ]);
        await fetchProducts(1, PAGE_LIMIT);
        await initialData();
        setProductLoader(false);
      }
      setSelectedWareHouse({
        id: event.value,
        name: event.title,
      });
      // setBusinessActivationDate(event.creationDate);
      await fetchProducts(1, PAGE_LIMIT);
      await initialData();
      setProductLoader(false);
    } else {
      setSelectedWareHouse(undefined);
    }
  };
  const findObjectById = (array: any, targetId: string) => {
    for (const item of array) {
      if (item.variant === targetId) {
        return item;
      }
    }
    return null; // Return null if no match is found
  };
  const handleProductSelect = async (event: any, index: number) => {
    const filteredArray: any = wareHouseProduct.find(
      (obj: any) => obj._id === event.value
    );
    if (filteredArray) {
      const batchQuantityType = filteredArray.quantityTypes.map(
        (quantVal: any) => ({
          type: quantVal.type,
          stockCount: 0,
        })
      );
      const findObject = findObjectById(initData, filteredArray._id);
      const batchData = {
        batch: findObject?.batch || 1,
        expiry: null,
        quantityTypes: batchQuantityType,
        goodsLoadingArea: [],
      };
      setProducts((prevProducts) => {
        const temp = [...prevProducts];
        temp[index].quantityTypes = filteredArray.quantityTypes;
        temp[index].variant = event.value;
        temp[index].batch = [batchData];
        return temp;
      });
      const temp = [...selectedProduct, event];
      setSelectedProductId(event.value);
      setSelectedProduct(temp);
      setZonesValidation((prevData: any) => {
        const temp = [...prevData];
        temp[index].batch = [
          {
            isInvalid: false,
            goodsLoadingArea: [],
          },
        ];
        return temp;
      });
    }
  };
  const handleQuantityChange = (
    value: string,
    index: number,
    quantityIndex: number,
    type: number
  ) => {
    let productTemp = [...products];
    let productValidationTemp = [...productValidation];
    productValidationTemp[index].quantityTypes = true;
    productTemp[index].quantityTypes[quantityIndex]['stockCount'] = value;
    productTemp[index].quantityTypes[quantityIndex]['type'] = type;
    if (parseInt(value) > 0) {
      productValidationTemp[index].quantityTypes = false;
    }
    setProducts(productTemp);
    setProductValidation(productValidationTemp);
  };
  const onMenuScrollToBottom = async () => {
    if (!(wareHouseProduct && wareHouseProduct.length === totalRecords)) {
      let tempPage = page;
      tempPage = tempPage + 1;
      setPage(tempPage);
      await fetchProducts(tempPage, PAGE_LIMIT);
    }
  };
  const handleExpiryChange = (index: number, batchIndex: number, date: any) => {
    let temp = [...products];
    temp[index].batch[batchIndex] = {
      ...temp[index].batch[batchIndex],
      expiry: date,
    };
    setProducts(temp);
  };
  const handleCountChange = (
    index: number,
    batchIndex: number,
    quantityIndex: number,
    newValue: string
  ) => {
    let temp: any = [...products];
    if (!/^\d*$/.test(newValue)) {
      newValue = newValue.split('.')[0];
    }
    if (newValue) {
      if (newValue.startsWith('0')) {
        // Remove the leading '0' by slicing the string from index 1 onwards
        newValue = newValue.slice(1);
      }
      temp[index].batch[batchIndex].quantityTypes[quantityIndex].stockCount =
        newValue;
    } else {
      temp[index].batch[batchIndex].quantityTypes[quantityIndex].stockCount = 0;
    }
    updateStockCounts(temp[index]);
    setProducts(temp);
  };
  const getPreviousBatchQuantityType = (obj: any) => {
    const lastBatch = obj.batch[obj.batch.length - 1];
    const lastQuantityType =
      lastBatch.quantityTypes[lastBatch.quantityTypes.length - 1];
    return {
      type: lastQuantityType.type,
      stockCount: '0',
    };
  };
  function updateStockCounts(product: any) {
    const quantityTypesMap = new Map();
    // Calculate the cumulative total stock count for each type across all batches
    product.batch.forEach((batch: any) => {
      batch.quantityTypes.forEach((quantityType: any) => {
        const type = quantityType.type;
        const stockCount = parseInt(quantityType.stockCount);
        if (quantityTypesMap.has(type)) {
          const currentStockCount = quantityTypesMap.get(type);
          quantityTypesMap.set(type, currentStockCount + stockCount);
        } else {
          quantityTypesMap.set(type, stockCount);
        }
      });
    });
    // Update the stockCount property for each quantityType based on the calculated cumulative total
    product.quantityTypes.forEach((quantityType: any) => {
      const type = quantityType.type;
      const totalStockCount = quantityTypesMap.get(type);
      const currentStockCount = parseInt(quantityType.stockCount);
      quantityType.stockCount = totalStockCount.toString();
    });
  }
  const getNextBatchNumber = (obj: any) => {
    const lastBatch = obj.batch[obj.batch.length - 1];
    return lastBatch.batch + 1;
  };
  const handleBatchAddMore = (productIndex: number) => {
    let temp = [...products];
    let batchValidationTemp = [...batchValidation];
    const tempZonesValidation = [...zonesValidation];
    if (
      requestId &&
      temp[productIndex].quantityTypes[0].stockCount >=
        requestGoodsDetails.variants[productIndex].quantityTypes[0].stockCount
    ) {
      return error('Quantity should not be greater than requested quantity');
    }
    const allObjectsHaveQuantityTypeWithStock = temp[productIndex].batch.every(
      (obj: any) =>
        obj.quantityTypes.some(
          (quantityType: any) =>
            quantityType.stockCount && quantityType.stockCount > 0
        )
    );
    if (allObjectsHaveQuantityTypeWithStock) {
      const previousBatchQuantityType = getPreviousBatchQuantityType(
        temp[productIndex]
      );
      const nextBatchNumber = getNextBatchNumber(temp[productIndex]);
      const newQuantityTypes = temp[productIndex].batch[0].quantityTypes.map(
        (quantityType: any) => ({ ...quantityType, stockCount: '0' })
      );
      temp[productIndex].batch.push({
        batch: nextBatchNumber,
        quantityTypes: newQuantityTypes,
        expiry: null,
        goodsLoadingArea: [],
      });
      temp.forEach((object: any) => {
        updateStockCounts(object);
      });
      tempZonesValidation[productIndex].batch.push({
        isInvalid: false,
        goodsLoadingArea: [],
      });
    } else {
      temp[productIndex].batch.forEach((product: any, index: number) => {
        const hasStockCountGreaterThanZero = product.quantityTypes.some(
          (quantityType: any) =>
            quantityType.stockCount !== undefined &&
            parseInt(quantityType.stockCount) > 0
        );
        if (!hasStockCountGreaterThanZero) {
          // batchValidationTemp[index].quantityTypes = true;
          error('At least one stock must have a value greater than 0.');
        }
      });
    }
    setBatchValidation(batchValidationTemp);
    setProducts(temp);
    setZonesValidation(tempZonesValidation);
  };
  const handleBatchRemove = (productIndex: number, batchIndex: number) => {
    let tempProducts: any = [...products];
    let tempBatchValidation = [...batchValidation];
    const tempZonesValidation = [...zonesValidation];
    // Remove the batch at the specified batchIndex from the product's batches array
    const deleltedBatch = tempProducts[productIndex].batch.splice(
      batchIndex,
      1
    );
    const findObject = findObjectById(
      initData,
      tempProducts[productIndex].variant
    );
    if (findObject) {
      let newBatchNumber: any = findObject.batch;
      tempProducts[productIndex].batch.forEach((batch: any) => {
        batch.batch = newBatchNumber;
        newBatchNumber++;
      });
    } else {
      tempProducts[productIndex].batch.forEach((batch: any, index: number) => {
        batch.batch = index + 1;
      });
    }
    tempProducts[productIndex].quantityTypes[0].stockCount -=
      deleltedBatch[0].quantityTypes[0].stockCount;
    tempZonesValidation[productIndex].batch.splice(batchIndex, 1);
    setProducts(tempProducts);
    setBatchValidation(tempBatchValidation);
    setZonesValidation(tempZonesValidation);
  };
  const handleRemove = (indexToRemove: number) => {
    let productTemp = [...products];
    let productValidationTemp = [...productValidation];
    const tempZonesValidation = [...zonesValidation];
    productValidation.splice(indexToRemove, 1);
    productTemp.splice(indexToRemove, 1);
    tempZonesValidation.splice(indexToRemove, 1);
    setProducts(productTemp);
    setProductValidation(productValidationTemp);
    setZonesValidation(tempZonesValidation);
  };
  const handleAddMore = () => {
    if (products.length) {
      let productTemp = [...products];
      let productValidationTemp = [...productValidation];
      const tempZonesValidation = [...zonesValidation];
      const allObjectsHaveQuantityTypeWithStock = productTemp.every(
        (obj: any) =>
          obj.quantityTypes.some(
            (quantityType: any) =>
              quantityType.stockCount && quantityType.stockCount > 0
          )
      );
      if (allObjectsHaveQuantityTypeWithStock) {
        productTemp.push({
          variant: '',
          quantityTypes: [],
          batch: [],
        });
        productValidationTemp.push({
          variant: false,
          quantityTypes: false,
        });
        tempZonesValidation.push({
          batch: [],
        });
      } else {
        productTemp.forEach((product: any, index: number) => {
          const hasStockCountGreaterThanZero = product.quantityTypes.some(
            (quantityType: any) =>
              quantityType.stockCount !== undefined &&
              quantityType.stockCount > 0
          );
          if (!hasStockCountGreaterThanZero) {
            productValidationTemp[index].quantityTypes = true;
            error('At least one stock must have a value greater than 0.');
          } else {
          }
        });
      }
      setProductValidation(productValidationTemp);
      setProducts(productTemp);
      setZonesValidation(tempZonesValidation);
    } else {
    }
  };
  const handleSubmit = async () => {
    let productTemp = [...products];
    let productValidationTemp = [...productValidation];
    const tempZonesValidation = [...zonesValidation];
    productTemp.forEach((item, index) => {
      item?.batch.map((batchVal: any, batchIndex: number) => {
        tempZonesValidation[index].batch[batchIndex].isInvalid =
          batchVal?.goodsLoadingArea
            ? batchVal?.goodsLoadingArea?.length === 0
            : true;
        batchVal?.goodsLoadingArea?.forEach(
          (goodsItem: any, goodsIndex: number) => {
            tempZonesValidation[index].batch[batchIndex].goodsLoadingArea[
              goodsIndex
            ].isInvalid = goodsItem?.selectedBins
              ? goodsItem?.selectedBins?.length === 0
              : true;
          }
        );
      });
    });
    const isBatchInValid = tempZonesValidation.some((item: any) => {
      return item.batch.some((batchItem: any) => {
        return (
          batchItem?.isInvalid ||
          batchItem?.goodsLoadingArea?.some((val: any) => val?.isInvalid)
        );
      });
    });
    if (isBatchInValid) {
      setZonesValidation(tempZonesValidation);
      return;
    }
    setLoading(true);
    const allObjectsHaveQuantityTypeWithStock =
      productTemp.every((obj: any) =>
        obj.quantityTypes.some(
          (quantityType: any) =>
            quantityType.stockCount && quantityType.stockCount > 0
        )
      ) &&
      productTemp.every((obj: any) =>
        obj.batch.every((batch: any) =>
          batch.quantityTypes.some(
            (quantityType: any) =>
              quantityType.stockCount && quantityType.stockCount > 0
          )
        )
      );
    const filteredData = productTemp.map((item: any) => {
      const filteredQuantityTypes = item.quantityTypes.filter(
        (qType: any) => qType.stockCount !== '0'
      );
      const filteredBatch = item.batch.map((batchItem: any) => ({
        ...batchItem,
        quantityTypes: batchItem.quantityTypes.filter(
          (qType: any) => qType.stockCount !== '0'
        ),
      }));
      return {
        ...item,
        quantityTypes: filteredQuantityTypes,
        batch: filteredBatch,
      };
    });
    if (allObjectsHaveQuantityTypeWithStock) {
      if (filteredData.length) {
        const hasPassArray: any = [];
        const splitBatches = splitBatchesWithVariantId(filteredData);
        filteredData.map((val: any) => {
          let hasAllExpiry = val.batch.every((item: any) => !!item.expiry);
          let hasAllExpiryNot = val.batch.every((item: any) => {
            return !item.expiry;
          });
          let hasMatchWithPrevious = val.batch.every((item: any) => {
            if (item.batch === 1) {
              return true;
            }
            const prevBatchHaveDate = checkNoExpiry(val.variant);
            if (prevBatchHaveDate) {
              return !!item.expiry;
            } else {
              return !item.expiry;
            }
          });
          const temp =
            (hasAllExpiry || hasAllExpiryNot) && hasMatchWithPrevious;
          hasPassArray.push(temp);
        });
        const isValid = hasPassArray.every((item: any) => item);
        if (isValid) {
          const tempBatches = splitBatches.map((item: any) => {
            const temp = { ...item };
            if (!temp.expiry) {
              delete temp.expiry;
            } else {
              temp.expiry = Method.convertDateToFormat(
                temp.expiry,
                'YYYY-MM-DD'
              );
            }
            temp.goodsLoadingArea = temp?.goodsLoadingArea?.length
              ? temp?.goodsLoadingArea?.map((goodsItem: any) => {
                  return {
                    reference: goodsItem?._id || goodsItem?.reference,
                    name: goodsItem?.name,
                    sequence: goodsItem?.sequence,
                    bins: goodsItem?.selectedBins
                      ? goodsItem?.selectedBins.map((bin: any) => {
                          return {
                            _id: bin?._id,
                            name: bin?.name,
                            sequence: bin?.sequence,
                          };
                        })
                      : [],
                  };
                })
              : [];
            return temp;
          });
          if (requestId) {
            const currentTotalQuntity = tempBatches.reduce(
              (prevSum: any, currVal: any, index: number) => {
                return prevSum + parseInt(currVal.quantityTypes[0].stockCount);
              },
              0
            );
            if (
              currentTotalQuntity > requestGoodsDetails.totalRequestedQuantities
            ) {
              error(
                'Total quantity should not be greater than requested quantity'
              );
            } else {
              const data = { records: tempBatches, status: 2 };
              let apiService = new APICallService(
                goodsRequests.changeStatus,
                data,
                { id: requestId },
                '',
                false,
                '',
                GoodsInWarehouseConst
              );
              let response = await apiService.callAPI();
              if (response) {
                setSelectedWareHouse(undefined);
                setWareHouseProducts([]);
                setProducts([{ variant: '', quantityTypes: [], batch: [] }]);
                setProductValidation([
                  {
                    variant: false,
                    quantityTypes: false,
                  },
                ]);
                setBatchValidation([
                  {
                    quantityTypes: false,
                  },
                ]);
                setShowModal(true);
                success('Goods added successfully');
                // window.history.back();
                // navigate('/inventory/goods-requests');
              }
            }
          } else {
            let apiService = new APICallService(
              inventory.addToInventory,
              {
                warehouseId: selectedWareHouse.id,
                name: selectedWareHouse.name,
                records: tempBatches,
              },
              '',
              '',
              false,
              '',
              GoodsInWarehouseConst
            );
            let response = await apiService.callAPI();
            if (response) {
              setSelectedWareHouse(undefined);
              setWareHouseProducts([]);
              setProducts([{ variant: '', quantityTypes: [], batch: [] }]);
              setProductValidation([
                {
                  variant: false,
                  quantityTypes: false,
                },
              ]);
              setBatchValidation([
                {
                  quantityTypes: false,
                },
              ]);
              setShowModal(true);
              success('Goods added successfully');
              // window.history.back();
              // navigate('/inventory/goods-requests');
            }
          }
        } else {
          error(inventoryToast.noDateError);
        }
      } else {
        //setCostDetails({});
      }
    } else {
      error('At least one stock must have a value greater than 0.');
    }
    setProductValidation(productValidationTemp);
    setProducts(productTemp);
    setLoading(false);
  };
  const splitBatchesWithVariantId = (data: any) => {
    const result: any = [];
    data.forEach((product: any) => {
      const { variant, batch } = product;
      batch.forEach((batchItem: any) => {
        const quantityTypes = batchItem.quantityTypes
          .map((quantityType: any) => {
            const stockCountInt = parseInt(quantityType.stockCount);
            return stockCountInt > 0
              ? { ...quantityType, stockCount: stockCountInt }
              : null;
          })
          .filter((quantityType: any) => quantityType !== null);
        const batchWithVariantId = {
          variant: variant,
          quantityTypes: quantityTypes,
          expiry: batchItem.expiry,
          batch: batchItem.batch,
          goodsLoadingArea: batchItem?.goodsLoadingArea || [],
        };
        result.push(batchWithVariantId);
      });
    });
    return result;
  };
  const checkNoExpiry = (id: any) => {
    const findObject = findObjectById(initData, id);
    if (!findObject) {
      return true;
    }
    return !!findObject?.batchExpiry;
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode === 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const popOver = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black border-r10px text-white">
        <>Leave blank if expiry date is not available</>
      </Popover.Body>
    </Popover>
  );
  const handleMultiSelectChange = (
    event: any,
    index: number,
    batchIndex: number
  ) => {
    const temp = [...products];
    const tempZonesValidation = [...zonesValidation];
    temp[index].batch[batchIndex].goodsLoadingArea = event;
    tempZonesValidation[index].batch[batchIndex].isInvalid = event
      ? event.length === 0
      : true;
    tempZonesValidation[index].batch[batchIndex].goodsLoadingArea = event
      ? event?.map((item: any) => ({
          isInvalid: false,
        }))
      : [];
    setProducts(temp);
    setZonesValidation(tempZonesValidation);
  };
  const handleMultiSelectBinsChange = (
    event: any,
    index: number,
    batchIndex: number,
    goodsIndex: number
  ) => {
    const temp = [...products];
    const tempZonesValidation = [...zonesValidation];
    temp[index].batch[batchIndex].goodsLoadingArea[goodsIndex].selectedBins =
      event;
    tempZonesValidation[index].batch[batchIndex].goodsLoadingArea[
      goodsIndex
    ].isInvalid = event ? event?.length === 0 : true;
    setProducts(temp);
    setZonesValidation(tempZonesValidation);
  };
  return (
    <>
      {showModal && selectedProduct && (
        <ProductAddedModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            if (requestId) {
              navigate('/goods-requests');
            } else {
              navigate('/inventory/goods-in-warehouse');
            }
            setRequestId(undefined);
            // window.history.back();
          }}
          image={selectedProduct[0].media[0]?.url}
        />
      )}
      <Row className="align-items-center">
        <Col
          xs
          className="align-self-center mb-5"
        >
          <h1 className="fs-22 fw-bolder mb-0">
            {InventoryString.goodsTitleAdd}
          </h1>
        </Col>
        {Method.hasPermission(GoodsInWarehouseConst, Add, currentUser) ? (
          <>
            {!initLoading ? (
              <Col xs={12}>
                <Card className="bg-light border mb-7">
                  <Card.Body className="px-7">
                    <Row className="align-items-center g-5">
                      <Col
                        md={6}
                        lg={3}
                      >
                        <FormLabel className="fs-16 fw-500 text-dark">
                          {InventoryString.filterWarehouseName}
                        </FormLabel>
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        className="mw-375px"
                      >
                        <KTSVG
                          path="/media/icons/duotune/general/gen021.svg"
                          className="svg-icon-3 position-absolute ms-3"
                        />
                        <CustomSelectWhite
                          //   onChange={(event: any) => {
                          //     handleExpiry(event);
                          //   }}
                          isDisabled={!!requestId}
                          loading={initLoading}
                          options={
                            wareHouses && wareHouses.length
                              ? wareHouses.map((val: any) => {
                                  return {
                                    label: (
                                      <>
                                        <span className="fs-16 fw-600 text-black mb-0">
                                          {val.name}
                                        </span>
                                      </>
                                    ),
                                    value: val._id,
                                    title: val.name,
                                  };
                                })
                              : []
                          }
                          value={
                            wareHouses && wareHouses.length
                              ? wareHouses
                                  .filter(
                                    (item: any) =>
                                      item._id === selectedWareHouse?.id
                                  )
                                  .map((val: any) => {
                                    return {
                                      label: (
                                        <>
                                          <span className="fs-16 fw-600 text-black mb-0">
                                            {val.name}
                                          </span>
                                        </>
                                      ),
                                      value: val._id,
                                      title: val.name,
                                    };
                                  })
                              : null // Set to null when no match is found
                          }
                          //   isClearable={expiry ? true : false}
                          isClearable={true}
                          onChange={(event: any) => {
                            handleWareHouse(event);
                          }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col xs={12}>
                <div className="fs-18 fw-500 text-center min-h-50px mt-6">
                  <Loader loading={initLoading} />
                </div>
              </Col>
            )}
            {!selectedWareHouse ? (
              <></>
            ) : (
              <>
                {productLoader || requestDetailsLoader ? (
                  <>
                    {productLoader && (
                      <Card className="border bg-f9f9f9 mb-9">
                        <Card.Body>
                          <div className="fs-18 fw-500 text-center min-h-50px">
                            <Loader loading={productLoader} />
                          </div>
                        </Card.Body>
                      </Card>
                    )}
                  </>
                ) : (
                  <>
                    {wareHouseProduct.length ? (
                      <>
                        <Card className="border border-r10px bg-light">
                          <Card.Body className="p-0">
                            <div className="table-responsive">
                              <table className="table table-rounded table-row-bordered align-middle gs-7 gy-4 mb-0">
                                <thead>
                                  <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                                    {/* <tr className="fs-16 fw-600 border-bottom"> */}
                                    <th className="min-w-275px text-start">
                                      Product name
                                    </th>
                                    {/* <th className="min-w-400px">
                                      Loading area
                                    </th> */}
                                    <th className="min-w-125px text-center">
                                      SKU
                                    </th>
                                    <th className="min-w-150px text-center ">
                                      Expires on
                                      <OverlayTrigger
                                        trigger="hover"
                                        placement="bottom-start"
                                        overlay={popOver}
                                      >
                                        <span className="ms-2">
                                          <img
                                            className="error-icon"
                                            src={grayInfo}
                                            alt=""
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    </th>
                                    <th className="w-125px text-center">
                                      Units
                                    </th>
                                    <th className="w-90px text-end"></th>
                                  </tr>
                                  {/* </tr> */}
                                </thead>
                                <tbody className="mt-10">
                                  {products.length ? (
                                    <>
                                      {products.map((val, index) => (
                                        <>
                                          <tr key={index}>
                                            <td>
                                              <div className="mw-325px">
                                                <span className="fw-600 fs-15">
                                                  <CustomSelectWhite
                                                    options={
                                                      wareHouseProduct &&
                                                      wareHouseProduct.length
                                                        ? wareHouseProduct
                                                            .filter(
                                                              (val: any) =>
                                                                !products.some(
                                                                  (item: any) =>
                                                                    item.variant ===
                                                                    val._id
                                                                )
                                                            )
                                                            .map((val: any) => {
                                                              return {
                                                                ...val,
                                                                label: (
                                                                  <>
                                                                    <div className="symbol symbol-30px border me-3">
                                                                      <img
                                                                        src={
                                                                          val
                                                                            .media[0]
                                                                            ?.url ||
                                                                          '' ||
                                                                          ''
                                                                        }
                                                                        className="object-fit-contain"
                                                                        alt=""
                                                                      />
                                                                    </div>
                                                                    <span className="fs-16 fw-600 text-black mb-0">
                                                                      {val.title.replace(
                                                                        /\s*\)\s*/g,
                                                                        ')'
                                                                      )}
                                                                    </span>
                                                                  </>
                                                                ),
                                                                value: val._id,
                                                                title:
                                                                  val.title.replace(
                                                                    /\s*\)\s*/g,
                                                                    ')'
                                                                  ),
                                                              };
                                                            })
                                                        : []
                                                    }
                                                    value={
                                                      wareHouseProduct &&
                                                      wareHouseProduct.length
                                                        ? wareHouseProduct
                                                            .filter(
                                                              (item: any) =>
                                                                item._id ===
                                                                val.variant
                                                            )
                                                            .map(
                                                              (val: any) => ({
                                                                ...val,
                                                                label: (
                                                                  <>
                                                                    <div className="symbol symbol-30px border me-3">
                                                                      <img
                                                                        src={
                                                                          val
                                                                            .media[0]
                                                                            ?.url
                                                                        }
                                                                        className="object-fit-contain"
                                                                        alt=""
                                                                      />
                                                                    </div>
                                                                    <span className="fs-16 fw-600 text-black mb-0">
                                                                      {val.title.replace(
                                                                        /\s*\)\s*/g,
                                                                        ')'
                                                                      )}
                                                                    </span>
                                                                  </>
                                                                ),
                                                                value: val._id,
                                                                title:
                                                                  val.title.replace(
                                                                    /\s*\)\s*/g,
                                                                    ')'
                                                                  ),
                                                              })
                                                            )
                                                        : null // Set to null when no match is found
                                                    }
                                                    onChange={(event: any) => {
                                                      handleProductSelect(
                                                        event,
                                                        index
                                                      );
                                                    }}
                                                    isDisabled={
                                                      loading || requestId
                                                    }
                                                    onMenuScrollToBottom={
                                                      onMenuScrollToBottom
                                                    }
                                                  />
                                                </span>
                                              </div>
                                              <div className="fs-16 fw-500 text-black mt-3">
                                                {
                                                  productIdTitleMap[
                                                    val?.variant
                                                  ]
                                                }
                                              </div>
                                            </td>
                                            {/* <td className=" px-20">
                                              {/* {selectedProduct.length
                                                ? selectedProduct
                                                    .find(
                                                      (item: any) =>
                                                        item._id === val.variant
                                                    )
                                                    ?.goodsLoadingArea.map(
                                                      (item: any) => (
                                                        <div className="bg-fcd00d border-r5px p-5 py-4 ms-4">
                                                          <span className="fw-600 fs-15">
                                                            {item.name}
                                                          </span>
                                                        </div>
                                                      )
                                                    )
                                                : '-'} 
                                            </td> */}
                                            <td className="text-center">
                                              <span className="fw-600 fs-15">
                                                {selectedProduct
                                                  ? selectedProduct.find(
                                                      (item: any) =>
                                                        item._id === val.variant
                                                    )?.skuNumber
                                                  : '-'}
                                              </span>
                                            </td>
                                            <td className="text-center">
                                              <span className="fw-600 fs-15">
                                                {selectedProduct
                                                  ? selectedProduct.expire
                                                  : '-'}
                                              </span>
                                            </td>
                                            <td className="text-center">
                                              <span className="fw-600 fs-15">
                                                <Form.Control
                                                  className="form-control-custom bg-white fs-14 fw-600 w-100px
                                                    me-3 min-h-60px px-3 text-center"
                                                  value={
                                                    requestId
                                                      ? requestGoodsDetails
                                                          .variants[index]
                                                          .quantityTypes[0]
                                                          .stockCount
                                                      : val.quantityTypes.find(
                                                          (item: any) =>
                                                            item.type === Units
                                                        )?.stockCount ?? 0
                                                  }
                                                  disabled
                                                  readOnly
                                                  onChange={(event: any) => {
                                                    handleQuantityChange(
                                                      event?.target.value.trimStart(),
                                                      index,
                                                      val.quantityTypes.findIndex(
                                                        (item: any) =>
                                                          item.type === Units
                                                      ),
                                                      val.quantityTypes.find(
                                                        (item: any) =>
                                                          item.type === Units
                                                      )?.type
                                                    );
                                                  }}
                                                />
                                              </span>
                                            </td>
                                            <td className="text-center">
                                              {products.length > 1 &&
                                              !requestId ? (
                                                <Button
                                                  variant="link"
                                                  className="btn-flush"
                                                  onClick={() => {
                                                    handleRemove(index);
                                                  }}
                                                  disabled={loading}
                                                >
                                                  <img
                                                    className="w-12px h-12px border-0"
                                                    src={GrayClose}
                                                    alt=""
                                                  />
                                                </Button>
                                              ) : (
                                                <Button
                                                  variant=""
                                                  className="btn-flush w-17px h-17px"
                                                  disabled={loading}
                                                ></Button>
                                              )}
                                            </td>
                                          </tr>
                                          <>
                                            {val.batch.length ? (
                                              <>
                                                {val.batch.map(
                                                  (
                                                    batchVal: any,
                                                    batchIndex: number
                                                  ) => {
                                                    return (
                                                      <>
                                                        <tr>
                                                          <td>
                                                            <div className="d-flex align-items-center">
                                                              <Form.Control
                                                                className="form-control-custom bg-white fs-14 fw-600 w-60px
                                                    me-3 min-h-60px px-3 text-center"
                                                                value={
                                                                  batchVal.batch
                                                                }
                                                                disabled
                                                              />
                                                              <span className="fs-15 fw-600">
                                                                Batch{' '}
                                                                {batchVal.batch}
                                                              </span>
                                                            </div>
                                                          </td>
                                                          {/* <td className="text-center"></td> */}
                                                          <td className="text-center"></td>
                                                          <td className="text-center">
                                                            {checkNoExpiry(
                                                              val.variant
                                                            ) ? (
                                                              <DatePicker
                                                                className="form-control-custom bg-white fs-14 fw-600 w-125px min-h-60px px-3 text-center"
                                                                selected={
                                                                  batchVal.expiry
                                                                }
                                                                onChange={(
                                                                  date
                                                                ) =>
                                                                  handleExpiryChange(
                                                                    index,
                                                                    batchIndex,
                                                                    date
                                                                  )
                                                                }
                                                                disabled={
                                                                  loading
                                                                }
                                                                selectsStart
                                                                minDate={new Date()}
                                                                placeholderText="Select date"
                                                                fixedHeight
                                                                dateFormat={
                                                                  'dd/MM/yyyy'
                                                                }
                                                                showYearDropdown={
                                                                  true
                                                                }
                                                                scrollableYearDropdown={
                                                                  true
                                                                }
                                                                dropdownMode="select"
                                                                dayClassName={(
                                                                  date: Date
                                                                ) => {
                                                                  return Method.dayDifference(
                                                                    new Date().toDateString(),
                                                                    date.toDateString()
                                                                  ) < 0
                                                                    ? 'date-disabled'
                                                                    : '';
                                                                }}
                                                              />
                                                            ) : (
                                                              <span className="fw-600 fs-15">
                                                                No expiry
                                                              </span>
                                                            )}
                                                          </td>
                                                          <td className="text-center">
                                                            <Form.Control
                                                              className="form-control-custom bg-white fs-14 fw-600 w-100px min-h-60px px-3 text-center"
                                                              value={
                                                                batchVal.quantityTypes.find(
                                                                  (item: any) =>
                                                                    item.type ===
                                                                      Units ||
                                                                    item.type ===
                                                                      Units
                                                                )?.stockCount ??
                                                                0
                                                              }
                                                              disabled={loading}
                                                              type="number"
                                                              onWheel={(
                                                                e: any
                                                              ) =>
                                                                e.target.blur()
                                                              }
                                                              onChange={(
                                                                event
                                                              ) => {
                                                                handleCountChange(
                                                                  index,
                                                                  batchIndex,
                                                                  batchVal.quantityTypes.findIndex(
                                                                    (
                                                                      item: any
                                                                    ) =>
                                                                      item.type ===
                                                                      Units
                                                                  ),
                                                                  event.target
                                                                    .value
                                                                );
                                                              }}
                                                              onKeyPress={
                                                                handleOnKeyPress
                                                              }
                                                            />
                                                          </td>
                                                          <td className="text-center">
                                                            {val.batch.length >
                                                              1 &&
                                                            batchIndex <
                                                              val.batch.length -
                                                                1 ? (
                                                              <>
                                                                {' '}
                                                                <Button
                                                                  variant="link"
                                                                  className="btn-flush"
                                                                  onClick={() => {
                                                                    handleBatchRemove(
                                                                      index,
                                                                      batchIndex
                                                                    );
                                                                  }}
                                                                  disabled={
                                                                    loading
                                                                  }
                                                                >
                                                                  <img
                                                                    className="w-12px h-12px"
                                                                    src={
                                                                      GrayClose
                                                                    }
                                                                    alt=""
                                                                  />
                                                                </Button>
                                                              </>
                                                            ) : (
                                                              <></>
                                                            )}
                                                            {!loading ? (
                                                              <>
                                                                {batchIndex ===
                                                                val.batch
                                                                  .length -
                                                                  1 ? (
                                                                  <>
                                                                    <div className="d-flex">
                                                                      <Link
                                                                        to="#"
                                                                        className="text-primary fs-16 fw-bolder"
                                                                        onClick={() => {
                                                                          handleBatchAddMore(
                                                                            index
                                                                          );
                                                                        }}
                                                                      >
                                                                        <span className="fw-600 fs-15">
                                                                          <img
                                                                            src={
                                                                              AddImg
                                                                            }
                                                                            height={
                                                                              35
                                                                            }
                                                                            width={
                                                                              35
                                                                            }
                                                                            alt="Add"
                                                                          />
                                                                        </span>
                                                                      </Link>
                                                                      {batchIndex >
                                                                      0 ? (
                                                                        <Button
                                                                          variant="link"
                                                                          className="btn-flush ms-5"
                                                                          onClick={() => {
                                                                            handleBatchRemove(
                                                                              index,
                                                                              batchIndex
                                                                            );
                                                                          }}
                                                                          disabled={
                                                                            loading
                                                                          }
                                                                        >
                                                                          <img
                                                                            className="w-12px h-12px"
                                                                            src={
                                                                              GrayClose
                                                                            }
                                                                            alt=""
                                                                          />
                                                                        </Button>
                                                                      ) : (
                                                                        <></>
                                                                      )}
                                                                    </div>
                                                                  </>
                                                                ) : (
                                                                  <></>
                                                                )}
                                                              </>
                                                            ) : (
                                                              <></>
                                                            )}
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td colSpan={6}>
                                                            <div className="">
                                                              <Row className="d-flex ">
                                                                <Col xs={2}>
                                                                  <label className="fs-16 fw-500 text-black">
                                                                    Select zones
                                                                  </label>
                                                                </Col>
                                                                <Col xs={8}>
                                                                  <div className="">
                                                                    <CustomSelectTable2
                                                                      border={
                                                                        zonesValidation[
                                                                          index
                                                                        ]
                                                                          ?.batch[
                                                                          batchIndex
                                                                        ]
                                                                          ?.isInvalid
                                                                          ? '#e55451 !important'
                                                                          : ''
                                                                      }
                                                                      minWidth="600px"
                                                                      isDisabled={
                                                                        false
                                                                      }
                                                                      // isDisabled={
                                                                      //   item.reference.length === 0 ||
                                                                      //   hasViewPermission ||
                                                                      //   (Method.hasPermission(
                                                                      //     WarehouseZone,
                                                                      //     Delete,
                                                                      //     currentUser
                                                                      //   ) &&
                                                                      //     !Method.hasPermission(
                                                                      //       WarehouseZone,
                                                                      //       Edit,
                                                                      //       currentUser
                                                                      //     ) &&
                                                                      //     !item?.isNew) ||
                                                                      //   (Method.hasPermission(
                                                                      //     WarehouseZone,
                                                                      //     Add,
                                                                      //     currentUser
                                                                      //   ) &&
                                                                      //     !Method.hasPermission(
                                                                      //       WarehouseZone,
                                                                      //       Edit,
                                                                      //       currentUser
                                                                      //     ) &&
                                                                      //     !item?.isNew)
                                                                      // }
                                                                      options={
                                                                        loadingArea.length
                                                                          ? loadingArea.map(
                                                                              (
                                                                                areaVal: any
                                                                              ) => {
                                                                                return {
                                                                                  ...areaVal,
                                                                                  selectedBins:
                                                                                    [],
                                                                                  title:
                                                                                    areaVal.name,
                                                                                  label:
                                                                                    areaVal.name,
                                                                                  _id: areaVal._id,
                                                                                  value:
                                                                                    areaVal._id,
                                                                                  reference:
                                                                                    areaVal?._id,
                                                                                };
                                                                              }
                                                                            )
                                                                          : []
                                                                      }
                                                                      multiValueBackground="#def2ea"
                                                                      onChange={(
                                                                        event: any
                                                                      ) =>
                                                                        handleMultiSelectChange(
                                                                          event,
                                                                          index,
                                                                          batchIndex
                                                                        )
                                                                      }
                                                                      value={
                                                                        batchVal?.goodsLoadingArea
                                                                          ? batchVal?.goodsLoadingArea.map(
                                                                              (
                                                                                areaVal: any
                                                                              ) => {
                                                                                return {
                                                                                  ...areaVal,
                                                                                  title:
                                                                                    areaVal.name,
                                                                                  label:
                                                                                    areaVal.name,
                                                                                  _id: areaVal?.reference,
                                                                                  value:
                                                                                    areaVal?.reference,
                                                                                };
                                                                              }
                                                                            )
                                                                          : []
                                                                      }
                                                                      indicatorDisplay="none"
                                                                      display="none"
                                                                      isMulti={
                                                                        true
                                                                      }
                                                                      menuIsOpen={
                                                                        false
                                                                      }
                                                                      placeholder="Select product zone"
                                                                    />
                                                                  </div>
                                                                </Col>
                                                              </Row>
                                                              {batchVal?.goodsLoadingArea?.map(
                                                                (
                                                                  goodsItem: any,
                                                                  goodsIndex: number
                                                                ) => {
                                                                  return (
                                                                    <Row
                                                                      className="mt-2 d-flex "
                                                                      key={
                                                                        goodsItem?._id
                                                                      }
                                                                    >
                                                                      <Col
                                                                        xs={2}
                                                                      >
                                                                        <label className="fs-16 fw-500 text-black mt-2 mb-2">
                                                                          {`${goodsItem?.name} bins`}
                                                                        </label>
                                                                      </Col>
                                                                      <Col
                                                                        xs={8}
                                                                      >
                                                                        <div className="">
                                                                          <CustomSelectTable2
                                                                            border={
                                                                              zonesValidation[
                                                                                index
                                                                              ]
                                                                                ?.batch[
                                                                                batchIndex
                                                                              ]
                                                                                ?.goodsLoadingArea[
                                                                                goodsIndex
                                                                              ]
                                                                                ?.isInvalid
                                                                                ? '#e55451 !important'
                                                                                : ''
                                                                            }
                                                                            minWidth="600px"
                                                                            isDisabled={
                                                                              false
                                                                            }
                                                                            // isDisabled={
                                                                            //   item.reference.length === 0 ||
                                                                            //   hasViewPermission ||
                                                                            //   (Method.hasPermission(
                                                                            //     WarehouseZone,
                                                                            //     Delete,
                                                                            //     currentUser
                                                                            //   ) &&
                                                                            //     !Method.hasPermission(
                                                                            //       WarehouseZone,
                                                                            //       Edit,
                                                                            //       currentUser
                                                                            //     ) &&
                                                                            //     !item?.isNew) ||
                                                                            //   (Method.hasPermission(
                                                                            //     WarehouseZone,
                                                                            //     Add,
                                                                            //     currentUser
                                                                            //   ) &&
                                                                            //     !Method.hasPermission(
                                                                            //       WarehouseZone,
                                                                            //       Edit,
                                                                            //       currentUser
                                                                            //     ) &&
                                                                            //     !item?.isNew)
                                                                            // }
                                                                            // options={getBinsSelectOptions(
                                                                            //   primaryVal?.goodsLoadingArea ||
                                                                            //     []
                                                                            // )}
                                                                            options={
                                                                              goodsItem
                                                                                ?.bins
                                                                                ?.length
                                                                                ? goodsItem?.bins.map(
                                                                                    (
                                                                                      areaVal: any
                                                                                    ) => {
                                                                                      return {
                                                                                        ...areaVal,
                                                                                        title:
                                                                                          areaVal.name,
                                                                                        label:
                                                                                          areaVal.name,
                                                                                        _id: areaVal._id,
                                                                                        value:
                                                                                          areaVal._id,
                                                                                      };
                                                                                    }
                                                                                  )
                                                                                : []
                                                                            }
                                                                            multiValueBackground="#def2ea"
                                                                            onChange={(
                                                                              event: any
                                                                            ) =>
                                                                              handleMultiSelectBinsChange(
                                                                                event,
                                                                                index,
                                                                                batchIndex,
                                                                                goodsIndex
                                                                              )
                                                                            }
                                                                            value={
                                                                              goodsItem?.selectedBins
                                                                                ? goodsItem?.selectedBins.map(
                                                                                    (
                                                                                      areaVal: any
                                                                                    ) => {
                                                                                      return {
                                                                                        ...areaVal,
                                                                                        title:
                                                                                          areaVal.name,
                                                                                        label:
                                                                                          areaVal.name,
                                                                                        _id: areaVal?._id,
                                                                                        value:
                                                                                          areaVal?._id,
                                                                                      };
                                                                                    }
                                                                                  )
                                                                                : []
                                                                            }
                                                                            indicatorDisplay="none"
                                                                            display="none"
                                                                            isMulti={
                                                                              true
                                                                            }
                                                                            menuIsOpen={
                                                                              false
                                                                            }
                                                                            placeholder="Select product zone"
                                                                          />
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </>
                                          {index === products.length - 1 ? (
                                            <></>
                                          ) : (
                                            <tr>
                                              <td colSpan={6}>
                                                {/* <div className="separator" /> */}
                                              </td>
                                            </tr>
                                          )}
                                        </>
                                      ))}
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            {wareHouseProduct.filter(
                              (val: any) =>
                                !products.some(
                                  (item: any) => item.variant === val._id
                                )
                            ).length ? (
                              <>
                                <div className="separator" />
                                <div className="d-flex flex-column mt-4 mb-4 ms-2">
                                  {!requestId ? (
                                    <Link
                                      to="#"
                                      className="text-primary fs-16 fw-bolder"
                                      onClick={handleAddMore}
                                    >
                                      + Add new product
                                    </Link>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </Card.Body>
                        </Card>
                        <div className="d-flex justify-content-end mt-6">
                          <Button
                            size="lg"
                            className="min-h-60px"
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            {!loading && (
                              <span className="indicator-label fs-16 fw-bold">
                                Save & add to inventory
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
                      </>
                    ) : (
                      !!selectedWareHouse && (
                        <>
                          {' '}
                          <Card className="border bg-f9f9f9 mb-9">
                            <Card.Body>
                              <div className="fs-18 fw-500 text-center min-h-50px">
                                No Products are available
                              </div>
                            </Card.Body>
                          </Card>
                        </>
                      )
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
};
export default AddGoodsInWarehouse;
