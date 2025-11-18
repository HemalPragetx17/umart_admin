import {
  Button,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../custom/DateRange/dateRange.css';
import GrayClose from '../../../../umart_admin/assets/media/svg_uMart/cross_gray.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import { inventory } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import {
  GoodsInWarehouseConst,
  Product,
  Units,
} from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import { error } from '../../../../Global/toast';
import warehouseImg from '../../../../umart_admin/assets/media/warehouse.png';
import clsx from 'clsx';
import MissingProductModal from '../../../modals/missing-product-modal';
import { inventoryToast } from '../../../../utils/toast';
import grayInfo from '../../../../umart_admin/assets/media/svg_uMart/error-warning_gray.svg';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
const EditStockCount = () => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [fetchLoader, setFetchLoader] = useState(true);
  const [details, setDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [initialDetails, setInitialDetails] = useState<any>({});
  const [missing, setMissing] = useState<any>([]);
  const [count, setCount] = useState(0);
  const [isGoodsMissing, setGoodsMissing] = useState<boolean>(true);
  const [isScrapped, setIsScrapped] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [isGoodsMissingValidation, setGoodsMissingValidation] =
    useState<boolean>(false);
  const [batchValidation, setBatchValidation] = useState<
    {
      quantityTypes: boolean;
    }[]
  >([
    {
      quantityTypes: false,
    },
  ]);
  const [data, setData] = useState<any>();
  const [loadingArea, setLoadingArea] = useState<any>([]);
  const [zonesValidation, setZonesValidation] = useState<
    {
      isInvalid: boolean;
      goodsLoadingArea: any[];
    }[]
  >([]);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      if (!state) {
        return window.history.back();
      }
      await fetchDetails();
      setFetchLoader(false);
    })();
  }, []);
  const fetchDetails = async () => {
    const tempGoodsData = await fetchProductZone();
    const goodsLoadingIdMap: Record<string, any> = {};
    tempGoodsData.map((item: any) => {
      goodsLoadingIdMap[item._id] = item;
    });
    let apiService = new APICallService(
      inventory.variantUpdateInit,
      state._id,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    const temp = JSON.parse(JSON.stringify(response));
    let goodsLoadingAreaForNewBatch = getGoodsLoadingAreaForNewBatch(
      temp?.categoryInfo
    );
    goodsLoadingAreaForNewBatch = goodsLoadingAreaForNewBatch?.map(
      (item: any) => {
        return {
          ...item,
          selectedBins: JSON.parse(JSON.stringify(item?.bins || [])),
          bins: goodsLoadingIdMap[item?.reference]?.bins || [],
        };
      }
    );
    temp.inventoryDetails.batchesList = temp.inventoryDetails.batchesList?.map(
      (item: any) => {
        return {
          ...item,
          goodsLoadingArea: item?.goodsLoadingArea?.length
            ? item?.goodsLoadingArea?.map((goodItem: any) => {
                return {
                  ...goodItem,
                  selectedBins: JSON.parse(
                    JSON.stringify(goodItem?.bins || [])
                  ),
                  bins: goodsLoadingIdMap[goodItem?.reference]?.bins || [],
                };
              })
            : goodsLoadingAreaForNewBatch || [],
        };
      }
    );
    setDetails(temp);
    const arr = Array.from(
      { length: response.inventoryDetails.batchesList.length },
      (_, index) => ({
        quantityTypes: false,
      })
    );
    const tempBatchValidation = temp.inventoryDetails.batchesList?.map(
      (item: any) => {
        return {
          isInvalid: false,
          goodsLoadingArea: item?.goodsLoadingArea?.length
            ? item?.goodsLoadingArea?.map((val: any) => ({ isInvalid: false }))
            : [],
        };
      }
    );
    setBatchValidation(arr);
    setInitialDetails(JSON.parse(JSON.stringify(response)));
    setCount(response.batch);
    setZonesValidation(tempBatchValidation);
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
    return response?.records || [];
  };
  const handleChange = (index: number, date: any) => {
    let temp = { ...details };
    temp.inventoryDetails.batchesList[index] = {
      ...temp.inventoryDetails.batchesList[index],
      expiry: date,
    };
    setDetails(temp);
  };
  const handleAddMore = () => {
    let temp = { ...details };
    let batchValidationTemp = [...batchValidation];
    let quantityTypes: any = [];
    const tempZoneValidation = [...zonesValidation];
    if (temp.inventoryDetails && temp.inventoryDetails.quantityTypes) {
      const allObjectsHaveQuantityTypeWithStock =
        temp.inventoryDetails.batchesList.every((obj: any) =>
          obj.quantityTypes.some(
            (quantityType: any) =>
              quantityType.stockCount && quantityType.stockCount > 0
          )
        );
      if (allObjectsHaveQuantityTypeWithStock) {
        let goodsLoadingAreaForNewBatch = getGoodsLoadingAreaForNewBatch(
          details?.categoryInfo
        );
        const goodsLoadingIdMap: Record<string, any> = {};
        loadingArea.map((item: any) => {
          goodsLoadingIdMap[item._id] = item;
        });
        goodsLoadingAreaForNewBatch = goodsLoadingAreaForNewBatch?.map(
          (item: any) => {
            return {
              ...item,
              selectedBins: JSON.parse(JSON.stringify(item?.bins || [])),
              bins: goodsLoadingIdMap[item?.reference]?.bins || [],
            };
          }
        );
        temp.inventoryDetails.quantityTypes.map((val: any) => {
          quantityTypes.push({
            type: val.type,
            credited: 0,
            stockCount: 0,
          });
        });
        if (temp.inventoryDetails.quantityTypes.length === 0) {
          quantityTypes.push({
            type: Units,
            credited: 0,
            stockCount: 0,
          });
        }
        temp.inventoryDetails.batchesList.push({
          batch: count,
          quantityTypes: quantityTypes,
          expiry: null,
          isCustomAdded: true,
          variant: temp.record._id,
          goodsLoadingArea: JSON.parse(
            JSON.stringify(goodsLoadingAreaForNewBatch)
          ),
        });
        setCount(count + 1);
        batchValidationTemp.push({
          quantityTypes: false,
        });
        tempZoneValidation.push({
          isInvalid: false,
          goodsLoadingArea: goodsLoadingAreaForNewBatch?.map((val: any) => ({
            isInavalid: false,
          })),
        });
      } else {
        temp.inventoryDetails.batchesList.forEach(
          (product: any, index: number) => {
            const hasStockCountGreaterThanZero = product.quantityTypes.some(
              (quantityType: any) =>
                quantityType.stockCount !== undefined &&
                quantityType.stockCount > 0
            );
            if (!hasStockCountGreaterThanZero) {
              batchValidationTemp[index].quantityTypes = true;
              error('At least one stock must have a value greater than 0.');
            }
          }
        );
      }
    }
    setBatchValidation(batchValidationTemp);
    setDetails(temp);
    setZonesValidation(tempZoneValidation);
  };
  const handleRemove = (batchId: number) => {
    let temp = { ...details };
    let batchValidationTemp = [...batchValidation];
    let tempZoneValidation = [...zonesValidation];
    temp.inventoryDetails.batchesList =
      temp.inventoryDetails.batchesList.filter(
        (batch: any) => batch.batch !== batchId
      );
    let counter = initialDetails.batch;
    const customLength = temp.inventoryDetails.batchesList.filter(
      (batch: any) => batch.isCustomAdded
    ).length;
    temp.inventoryDetails.batchesList
      .filter((batch: any) => batch.isCustomAdded)
      .forEach((batch: any, index: number) => {
        if (batch.isCustomAdded) {
          batch.batch = counter;
          if (index === 0) {
          } else {
            batch.batch = counter + 1;
            counter++;
          }
          if (index === customLength - 1) {
            counter++;
          }
        }
      });
    const index = temp.inventoryDetails.batchesList.findIndex(
      (batch: any) => batch.batch === batchId
    );
    batchValidationTemp.splice(index, 1);
    tempZoneValidation.splice(index, 1);
    setBatchValidation(batchValidationTemp);
    setCount(counter);
    setDetails(temp);
    setZonesValidation(tempZoneValidation);
  };
  useEffect(() => {
    if (details.inventoryDetails && details.inventoryDetails.batchesList) {
      const stockCountsMatch = checkStockCount(details.inventoryDetails);
      setMissing(stockCountsMatch);
    }
  }, [details]);
  const checkStockCount = (data: any) => {
    const { batchesList, quantityTypes } = data;
    const stockCountMap = new Map();
    batchesList.forEach((batch: any) => {
      batch.quantityTypes.forEach((quantityType: any) => {
        const { type, stockCount } = quantityType;
        const count = stockCount === '' ? 0 : stockCount;
        const parsedStockCount = parseInt(count);
        if (!isNaN(parsedStockCount) && checkIsValidBatch(batch?.expiry, 7)) {
          if (stockCountMap.has(type)) {
            stockCountMap.set(type, stockCountMap.get(type) + parsedStockCount);
          } else {
            stockCountMap.set(type, parsedStockCount);
          }
        }
      });
    });
    const missingStock: any = quantityTypes
      .map((quantityType: any) => {
        const { type, stockCount, reservedQty } = quantityType;
        const mappedType = type === 4 ? 1 : type; // Map type 4 to type 1
        const totalStockCount = stockCountMap.get(mappedType) || 0;
        const missing = stockCount - (totalStockCount + reservedQty);
        return {
          type,
          missing: missing < 0 ? 0 : missing,
        };
      })
      .filter((item: any) => item.missing > 0); // Exclude items with missing count 0
    return missingStock;
  };
  const handleCountChange = (
    index: number,
    quantityIndex: number,
    newValue: string
  ) => {
    let temp = { ...details };
    if (!/^\d*$/.test(newValue)) {
      newValue = newValue.split('.')[0];
    }
    temp.inventoryDetails.batchesList[index].quantityTypes[
      quantityIndex
    ].stockCount = newValue;
    setDetails(temp);
  };
  const handleSubmit = async () => {
    let temp = { ...details };
    let batchValidationTemp = [...batchValidation];
    const tempZoneValidation = [...zonesValidation];
    temp.inventoryDetails.batchesList.forEach((item: any, index: number) => {
      tempZoneValidation[index].isInvalid =
        item?.goodsLoadingArea?.length === 0;
      item?.goodsLoadingArea?.forEach((val: any, valIndex: any) => {
        tempZoneValidation[index].goodsLoadingArea[valIndex].isInvalid =
          val?.selectedBins ? val?.selectedBins?.length === 0 : true;
      });
    });
    const isZonesInValid = tempZoneValidation.some((item) => {
      return (
        item.isInvalid ||
        item?.goodsLoadingArea.some((val: any) => val?.isInvalid)
      );
    });
    if (isZonesInValid) {
      setZonesValidation(tempZoneValidation);
      return;
    }
    const allObjectsHaveQuantityTypeWithStock =
      temp.inventoryDetails.batchesList.every((obj: any) =>
        obj.quantityTypes.some((quantityType: any) => {
          if (!checkIsValidBatch(obj?.expiry, 7)) {
            return true;
          }
          if (missing.length > 0) {
            return quantityType.stockCount && quantityType.stockCount >= 0;
          } else {
            return quantityType.stockCount && quantityType.stockCount > 0;
          }
        })
      );
    let valid = missing.length
      ? isGoodsMissing || isScrapped
        ? true
        : false
      : true;
    if (allObjectsHaveQuantityTypeWithStock && valid) {
      let apiTemp: any = {};
      if (isGoodsMissing) {
        apiTemp = { ...apiTemp, missing: 1 };
      } else if (isScrapped) {
        apiTemp = { ...apiTemp, missing: 2 };
      }
      const isValidExpiry = checkValidExpiryForAllBatches(
        temp?.inventoryDetails?.batchesList || []
      );
      if (!isValidExpiry) {
        return error(
          'Either all batches have expiry date or no expiry for all.'
        );
      }
      if (temp.inventoryDetails.batchesList.length) {
        apiTemp = { ...apiTemp, records: temp.inventoryDetails.batchesList };
        apiTemp.records = apiTemp.records.map((item: any) => {
          const temp = { ...item };
          if (!temp.expiry) {
            delete temp.expiry;
          } else {
            temp.expiry = Method.convertDateToFormat(temp.expiry, 'YYYY-MM-DD');
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
        if ((isGoodsMissing || isScrapped) && missing.length) {
          setData(apiTemp);
          setShowMissingModal(true);
        } else {
          const hasAllExpiry = apiTemp.records.every(
            (item: any) => !!item.expiry
          );
          const hasAllExpiryNot = apiTemp.records.every(
            (item: any) => !item.expiry
          );
          if (hasAllExpiry || hasAllExpiryNot) {
            setLoading(true);
            await handleMissingProductSubmit(apiTemp);
            setLoading(false);
          } else {
            error(inventoryToast.noDateError);
          }
          // let apiService = new APICallService(
          //   inventory.variantUpdate,
          //   apiTemp,
          //   {
          //     id: state._id,
          //   }
          // );
          // let response = await apiService.callAPI();
          // if (response) {
          //   navigate('/inventory/goods-in-warehouse');
          // }
        }
      } else {
      }
    } else {
      temp.inventoryDetails.batchesList.forEach(
        (product: any, index: number) => {
          const hasStockCountGreaterThanZero = product.quantityTypes.some(
            (quantityType: any) =>
              quantityType.stockCount !== undefined &&
              quantityType.stockCount > 0
          );
          if (!hasStockCountGreaterThanZero) {
            batchValidationTemp[index].quantityTypes = true;
            error('At least one stock must have a value greater than 0.');
          }
        }
      );
    }
    setGoodsMissingValidation(!valid);
    setBatchValidation(batchValidationTemp);
    setDetails(temp);
  };
  const handleMissingProductSubmit = async (data: any) => {
    let apiService = new APICallService(
      inventory.variantUpdate,
      data,
      {
        id: state._id,
      },
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    if (response) {
      navigate('/inventory/goods-in-warehouse');
    }
  };
  const handleModalSubmit = async (data: any) => {
    await handleMissingProductSubmit(data);
    setShowMissingModal(false);
  };
  const getMissingCount = (missing: any) =>
    missing
      .filter((item: any) => item.missing > 0)
      .map((item: any, index: number) => {
        const { type, missing } = item;
        let unit;
        if (type === Units) {
          unit = 'units';
        }
        return `${missing}`;
      });
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode === 46) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleMultiSelectChange = (event: any, index: number) => {
    const temp = { ...details };
    const tempZoneValidation = [...zonesValidation];
    temp.inventoryDetails.batchesList[index].goodsLoadingArea = event;
    tempZoneValidation[index].isInvalid = event ? event.length === 0 : true;
    tempZoneValidation[index].goodsLoadingArea = event
      ? event?.map((item: any) => ({ isInvalid: false }))
      : [];
    setDetails(temp);
    setZonesValidation(tempZoneValidation);
  };
  const handleMultiSelectBinsChange = (
    event: any,
    index: number,
    goodsIndex: number
  ) => {
    const temp = { ...details };
    const tempZoneValidation = [...zonesValidation];
    temp.inventoryDetails.batchesList[index].goodsLoadingArea[
      goodsIndex
    ].selectedBins = event;
    tempZoneValidation[index].goodsLoadingArea[goodsIndex].isInvalid = event
      ? event.length === 0
      : true;
    setDetails(temp);
    setZonesValidation(tempZoneValidation);
  };
  const checkIsValidBatch = (expiryDateStr: any, daysToAdd: number) => {
    if (!expiryDateStr) return true;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysToAdd);
    const expiryDate = new Date(expiryDateStr);
    return futureDate < expiryDate;
  };
  const popOver = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black border-r10px text-white">
        <>Leave blank if expiry date is not available</>
      </Popover.Body>
    </Popover>
  );
  const getGoodsLoadingAreaForNewBatch = (data: any) => {
    if (!data) return [];
    if (data?.goodsLoadingArea && data?.goodsLoadingArea?.length) {
      return data?.goodsLoadingArea || [];
    }
    if (data?.categories && data?.categories?.length) {
      if (
        data?.categories[0]?.goodsLoadingArea &&
        data?.categories[0]?.goodsLoadingArea?.length
      ) {
        return data?.categories[0]?.goodsLoadingArea || [];
      }
    }
    return [];
  };
  const checkValidExpiryForAllBatches = (batches: any) => {
    if (!batches || batches.length === 0) return true;
    const isAllHaveExpiry = batches.every((item: any) => item?.expiry);
    const isAllHaveNoExpiry = batches.every((item: any) => !item?.expiry);
    return isAllHaveExpiry || isAllHaveNoExpiry;
  };
  return (
    <>
      {showMissingModal && missing && missing.length > 0 && (
        <MissingProductModal
          show={showMissingModal}
          onHide={() => setShowMissingModal(false)}
          handleSubmit={handleModalSubmit}
          text={`Missing : ${getMissingCount(missing)} pieces of ${
            details.record.title
          }`}
          data={data}
          loading={loading}
        />
      )}
      <div className="">
        <div className="mb-7">
          <h1 className="fs-22 fw-bolder">Edit stock count</h1>
        </div>
        {!fetchLoader ? (
          <>
            {details !== null && details !== undefined ? (
              <>
                <div className="bg-light border border-r10px p-7 mb-7">
                  <Row className="align-items-center g-5">
                    <Col xs="auto">
                      <div className="symbol symbol-50px border">
                        <img
                          src={warehouseImg}
                          className="img-fluid object-fit-contain"
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col xs>
                      <div className="fs-20 fw-bolder d-flex align-items-center">
                        {'U Trade Warehouse'}
                      </div>
                    </Col>
                  </Row>
                </div>
                <Card className="border border-r10px mb-7">
                  <Card.Body className="py-5">
                    <div className="table-responsive">
                      <table className="table align-middle gs-0 gy-3 mb-0">
                        <thead>
                          <tr className="fs-16 fw-600 border-bottom">
                            <th className="min-w-150px text-start">
                              Product name
                            </th>
                            <th className="min-w-200px text-center">
                              {/* Loading area */}
                            </th>
                            <th className="text-center">
                              Expires on{' '}
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
                            <th className="w-100px text-center">Units</th>
                          </tr>
                        </thead>
                        <tbody className="mt-10">
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="symbol symbol-50px border me-3">
                                  <img
                                    src={details.record.media[0]?.url || ''}
                                    className="object-fit-contain"
                                    alt=""
                                  />
                                </div>
                                <span className="fs-15 fw-600">
                                  {details.record.title}
                                </span>
                              </div>
                            </td>
                            <td className="text-center">
                              {/* {details.record.goodsLoadingArea.length > 0
                                ? details.record.goodsLoadingArea.map(
                                    (item: any) => {
                                      return (
                                        <span className="bg-fcd00d border-r5px p-5 py-4 ms-4">
                                          <span className="fw-600 fs-15">
                                            {item.name}
                                          </span>
                                        </span>
                                      );
                                    }
                                  )
                                : '-'} */}
                              -
                            </td>
                            <td className="text-center">
                              <span className="fw-600 fs-15">-</span>
                            </td>
                            <td className="text-center">
                              {details.inventoryDetails.quantityTypes.some(
                                (item: any, idx: number) => item.type === Units
                              ) ? (
                                <span className="fw-600 fs-15">
                                  {
                                    details.inventoryDetails.quantityTypes.find(
                                      (item: any) => item.type === Units
                                    ).stockCount
                                  }{' '}
                                </span>
                              ) : (
                                <span className="fw-600 fs-15">-</span>
                              )}
                            </td>
                          </tr>
                          <>
                            {details.inventoryDetails.batchesList.length ? (
                              <>
                                {details.inventoryDetails.batchesList.map(
                                  (batchVal: any, index: number) => {
                                    return (
                                      <>
                                        <tr>
                                          {' '}
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div className="symbol symbol-50px border me-3">
                                                <div className="symbol-label fs-18 fw-600 text-gray">
                                                  {batchVal.batch}
                                                </div>
                                              </div>
                                              <span className="fs-15 fw-600">
                                                {batchVal.batch >=
                                                initialDetails.batch ? (
                                                  <>Batch {batchVal.batch}</>
                                                ) : (
                                                  <>
                                                    {' '}
                                                    Batch {
                                                      batchVal.batch
                                                    } -{' '}
                                                    {Method.convertDateToFormat(
                                                      batchVal._createdAt,
                                                      'DD/MM/YYYY'
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                            </div>
                                          </td>{' '}
                                          <td className="text-center">-</td>
                                          <td className="text-center">
                                            {/* {batchVal.batch >=
                                          initialDetails.batch ? (
                                            initialDetails?.inventoryDetails
                                              ?.batchesList[0]?.expiry ||
                                            initialDetails?.inventoryDetails
                                              ?.batchesList.length === 0 ? (
                                              <DatePicker
                                                className="form-control-custom fs-14 fw-600 min-w-144px min-h-45px px-3 text-center"
                                                selected={batchVal.expiry}
                                                onChange={(date) =>
                                                  handleChange(index, date)
                                                }
                                                disabled={loading}
                                                selectsStart
                                                minDate={new Date()}
                                                placeholderText="Select date"
                                                fixedHeight
                                                dateFormat={'dd/MM/yyyy'}
                                                showYearDropdown={true}
                                                scrollableYearDropdown={true}
                                                dropdownMode="select"
                                                dayClassName={(date: Date) => {
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
                                            )
                                          ) : (
                                            <span className="fw-600 fs-15">
                                              {batchVal?.expiry
                                                ? Method.convertDateToFormat(
                                                    batchVal.expiry,
                                                    'DD/MM/YYYY'
                                                  )
                                                : 'No expiry'}
                                            </span>
                                          )} */}
                                            <DatePicker
                                              className="form-control-custom fs-14 fw-600 w-125px min-h-45px px-3 text-center"
                                              selected={
                                                batchVal?.expiry
                                                  ? new Date(batchVal?.expiry)
                                                  : null
                                              }
                                              onChange={(date) =>
                                                handleChange(index, date)
                                              }
                                              disabled={loading}
                                              selectsStart
                                              minDate={new Date()}
                                              placeholderText="Select date"
                                              fixedHeight
                                              dateFormat={'dd/MM/yyyy'}
                                              showYearDropdown={true}
                                              scrollableYearDropdown={true}
                                              dropdownMode="select"
                                              dayClassName={(date: Date) => {
                                                return Method.dayDifference(
                                                 new Date().toDateString(),
                                                  date.toDateString()
                                                ) < 0
                                                  ? 'date-disabled'
                                                  : '';
                                              }}
                                            />
                                          </td>
                                          <td className="text-center">
                                            <Form.Control
                                              className="form-control-custom fs-14 fw-600 w-88px min-h-45px px-3 text-center"
                                              value={
                                                batchVal.quantityTypes.find(
                                                  (item: any) =>
                                                    item.type === Units
                                                )?.stockCount ?? 0
                                              }
                                              disabled={
                                                !batchVal.quantityTypes.some(
                                                  (item: any) =>
                                                    item.type === Units
                                                ) || loading
                                              }
                                              type="number"
                                              onWheel={(e: any) =>
                                                e.target.blur()
                                              }
                                              onChange={(event) => {
                                                handleCountChange(
                                                  index,
                                                  batchVal.quantityTypes.findIndex(
                                                    (item: any) =>
                                                      item.type === Units
                                                  ),
                                                  event.target.value
                                                );
                                              }}
                                              onKeyPress={handleOnKeyPress}
                                            />
                                          </td>
                                          {batchVal.batch >=
                                          initialDetails.batch ? (
                                            <td className="text-end">
                                              <Button
                                                variant="link"
                                                className="btn-flush"
                                                onClick={() => {
                                                  handleRemove(batchVal.batch);
                                                }}
                                              >
                                                <img
                                                  className="w-17px h-17px"
                                                  src={GrayClose}
                                                  alt=""
                                                />
                                              </Button>
                                            </td>
                                          ) : (
                                            <td className="text-end"></td>
                                          )}
                                        </tr>
                                        <tr>
                                          <td colSpan={4}>
                                            <div className="mb-3">
                                              <Row className="mb-2 d-flex">
                                                <Col xs={2}>
                                                  <label className="fs-16 fw-500 text-black mb-2 mt-2">
                                                    Select zones
                                                  </label>
                                                </Col>
                                                <Col xs={9}>
                                                  <div className="ms-4">
                                                    <CustomSelectTable2
                                                      border={
                                                        zonesValidation[index]
                                                          .isInvalid
                                                          ? '#e55451 !important'
                                                          : ''
                                                      }
                                                      minWidth="600px"
                                                      isDisabled={false}
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
                                                      onChange={(event: any) =>
                                                        handleMultiSelectChange(
                                                          event,
                                                          index
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
                                                      isMulti={true}
                                                      menuIsOpen={false}
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
                                                      className="mt-3 d-flex"
                                                      key={goodsItem?._id}
                                                    >
                                                      <Col xs={2}>
                                                        <label className="fs-16 fw-500 text-black mt-2 mb-2">
                                                          {`${goodsItem?.name} bins`}
                                                        </label>
                                                      </Col>
                                                      <Col xs={9}>
                                                        <div className="ms-4">
                                                          <CustomSelectTable2
                                                            border={
                                                              zonesValidation[
                                                                index
                                                              ]
                                                                .goodsLoadingArea[
                                                                goodsIndex
                                                              ]?.isInvalid
                                                                ? '#e55451 !important'
                                                                : ''
                                                            }
                                                            minWidth="600px"
                                                            isDisabled={false}
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
                                                              goodsItem?.bins
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
                                                            isMulti={true}
                                                            menuIsOpen={false}
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
                        </tbody>
                      </table>
                    </div>
                    <div className="my-2">
                      <Button
                        variant="link"
                        className="btn-flush fs-16 fw-bolder text-primary"
                        onClick={() => {
                          handleAddMore();
                        }}
                      >
                        + Add new batch & expiry
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                {missing && missing.length ? (
                  <div className="bg-light border border-r10px p-7 mb-9">
                    <Row className="align-items-center g-5">
                      <Col xs>
                        <span className="fs-20 fw-600">
                          {missing
                            .filter((item: any) => item.missing > 0)
                            .map((item: any, index: number) => {
                              const { type, missing } = item;
                              let unit;
                              if (type === Units) {
                                unit = 'units';
                              }
                              return `${missing} ${unit}`;
                            })
                            .join(', ')}
                          {' are missing / damaged?'}
                        </span>
                      </Col>
                      <Col className="align-self-center d-lg-flex d-md-flex">
                        <div className="form-check form-check-custom form-check-solid me-4">
                          <input
                            className="form-check-input "
                            type="radio"
                            value="0"
                            id="flexRadioChecked"
                            checked={isGoodsMissing}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                              setGoodsMissing(!isGoodsMissing);
                              setIsScrapped(false);
                            }}
                            // disabled={apiLoading}
                          />
                          <label className="form-check-label fs-16 fw-600 text-dark">
                            Mark as missing
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="1"
                            id="flexRadioChecked"
                            checked={isScrapped}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                              setIsScrapped(!isScrapped);
                              setGoodsMissing(false);
                            }}
                            // disabled={apiLoading}
                          />
                          <label className="form-check-label fs-16 fw-600 text-dark">
                            Mark as scrapped goods
                          </label>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <></>
                )}
                <div className="d-flex justify-content-end">
                  <Button
                    size="lg"
                    onClick={() => handleSubmit()}
                    disabled={loading}
                  >
                    {!loading && (
                      <span className="indicator-label fs-16 fw-bold">
                        Save details
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
              <></>
            )}
          </>
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
export default EditStockCount;
