import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
import APICallService from '../../../../api/apiCallService';
import { inventory, product } from '../../../../api/apiEndPoints';
import { WarehouseZone } from '../../../../utils/constants';
import Loader from '../../../../Global/loader';
import CreateBins from './CreateBins';
import { success } from '../../../../Global/toast';
import clsx from 'clsx';
const AssignProductZones = () => {
  const { state }: any = useLocation();
  const [productData, setProductData] = useState<any>(state);
  const [fetchLoader, setFetchLoader] = useState(true);
  const [loadingArea, setLoadingArea] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<any>([]);
  useEffect(() => {
    if (!state) {
      return window.history.back();
    }
    fetchProductZone();
  }, []);
  const fetchProductZone = async () => {
    setFetchLoader(true);
    const apiService = new APICallService(
      inventory.getLoadingArea,
      {},
      '',
      '',
      false,
      '',
      WarehouseZone
    );
    const response = await apiService.callAPI();
    if (response) {
      setLoadingArea(response.records);
      if (
        state?.inventoryInfo &&
        state?.inventoryInfo?.reference &&
        state?.inventoryInfo?.reference?.batches &&
        state?.inventoryInfo?.reference?.batches.length > 0
      ) {
        const goodsLoadingIdMap: Record<string, any> = {};
        response.records.map((item: any) => {
          goodsLoadingIdMap[item._id] = item;
        });
        const temp = {
          ...state,
          inventoryInfo: {
            reference: {
              ...state?.inventoryInfo.reference,
              batches: state?.inventoryInfo?.reference?.batches?.length
                ? state?.inventoryInfo?.reference?.batches?.map(
                    (batchVal: any) => {
                      return {
                        ...batchVal,
                        goodsLoadingArea: batchVal?.goodsLoadingArea?.length
                          ? batchVal?.goodsLoadingArea?.map((zoneVal: any) => {
                              return {
                                ...zoneVal,
                                selectedBins: JSON.parse(
                                  JSON.stringify(zoneVal?.bins || [])
                                ),
                                bins:
                                  goodsLoadingIdMap[zoneVal?.reference]?.bins ||
                                  [],
                              };
                            })
                          : [],
                      };
                    }
                  )
                : [],
            },
          },
        };
        const tempValidation = temp?.inventoryInfo?.reference?.batches?.map(
          (item: any, index: number) => {
            return {
              isInValid: false,
              bins: item?.goodsLoadingArea?.map((val: any) => {
                return {
                  isInValid: false,
                };
              }),
            };
          }
        );
        setValidation(tempValidation);
        setProductData(temp);
      }
    }
    setFetchLoader(false);
  };
  const handleMultiSelectChange = (event: any, index: number) => {
    const temp = { ...productData };
    const tempValidation = [...validation];
    temp.inventoryInfo.reference.batches[index].goodsLoadingArea = event;
    if (event?.length === 0) {
      tempValidation[index].isInValid = true;
      tempValidation[index].bins = [];
    } else {
      tempValidation[index].isInValid = false;
      tempValidation[index].bins = event.map((item: any) => {
        return {
          isInValid: false,
        };
      });
    }
    setValidation(tempValidation);
    setProductData(temp);
  };
  const handleMultiSelectBinsChange = (
    event: any,
    index: number,
    goodsIndex: number
  ) => {
    const temp = { ...productData };
    const tempValidation = [...validation];
    tempValidation[index].bins[goodsIndex].isInValid = event?.length === 0;
    temp.inventoryInfo.reference.batches[index].goodsLoadingArea[
      goodsIndex
    ].selectedBins = event;
    setProductData(temp);
    setValidation(tempValidation);
  };
  const handleSave = async () => {
    const tempValidation = [...validation];
    productData?.inventoryInfo?.reference?.batches?.forEach(
      (item: any, index: number) => {
        tempValidation[index].isInValid = item?.goodsLoadingArea?.length === 0;
        item?.goodsLoadingArea?.forEach((val: any, goodIndex: number) => {
          tempValidation[index].bins[goodIndex].isInValid = 
          (!val?.selectedBins || val?.selectedBins?.length === 0);
        });
      }
    );
    setValidation(tempValidation);
    const isValid = tempValidation.every((item: any) => {
      return (
        !item?.isInValid && item?.bins?.every((val: any) => !val?.isInValid)
      );
    });
    if (!isValid) {
      return;
    }
    setLoading(true);
    const data: any = {
      productZoneCacheType: 3,
      list: [
        {
          batches: productData?.inventoryInfo?.reference?.batches.map(
            (item: any) => {
              return {
                reference: item?._id,
                zone: item?.goodsLoadingArea
                  ? item?.goodsLoadingArea.map((goodsItem: any) => {
                      return {
                        reference: goodsItem?._id,
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
                  : [],
              };
            }
          ),
          productZoneCacheType: 3,
          reference: productData?._id,
        },
      ],
    };
    const apiCallService = new APICallService(
      product.updateLoadingArea,
      data,
      '',
      '',
      false,
      '',
      WarehouseZone
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success('Zones and bins updated successfully!');
    }
    setLoading(false);
  };
  console.log('llllll', productData, validation);
  return (
    <Row>
      <Col sm>
        <h1 className="fs-22 fw-bolder">{`Assign zone and bins for ${productData?.title}`}</h1>
      </Col>
      {!fetchLoader ? (
        <>
          <Col
            xs={12}
            className="mt-6"
          >
            {productData?.inventoryInfo?.reference?.batches &&
            productData?.inventoryInfo?.reference?.batches.length ? (
              productData?.inventoryInfo?.reference?.batches?.map(
                (productVal: any, index: number) => {
                  return (
                    <div
                      className="accordion"
                      id={'kt_accordion_' + productVal._id}
                      key={productVal._id}
                    >
                      <div className="accordion-item">
                        <div
                          className={clsx('accordion-header bg-light')}
                          id={'accordion_' + productVal._id}
                        >
                          <Row className="align-items-center p-0">
                            <Col
                              xs
                              className="pe-0 d-flex align-items-center"
                            >
                              <button
                                // className="accordion-button fs-16 fw-600 pe-0 border-bottom-0 collapsed"
                                className="fs-16 fw-600 pe-3 border-bottom-0 collapsed accordion-button accordion-button-light"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={
                                  '#body_accordion_' + productVal._id
                                }
                                aria-expanded="false"
                                aria-controls={
                                  'body_accordion_' + productVal._id
                                }
                              >
                                <span className="w-100">
                                  {`Batch ${productVal?.batch}`}
                                </span>
                              </button>
                            </Col>
                          </Row>
                        </div>
                        <div
                          // key={}
                          id={'body_accordion_' + productVal._id}
                          className="accordion-collapse collapse"
                          // aria-labelledby={'accordion_' + subVal._id}
                          // data-bs-parent={'#kt_accordion_' + subVal._id}
                        >
                          <div className="accordion-body ps-4 bg-light">
                            <div className="accordion-item border-0">
                              <div
                                className="accordion-header bg-light "
                                // id={'accordion_primary_' + subVal._id}
                              >
                                <Row className="align-items-center p-0 ">
                                  <Col xs={2}>
                                    <div className="fs-16 fw-500 text-black me-3 min-w-90px">
                                      Select zones
                                    </div>
                                  </Col>
                                  <Col
                                    xs={8}
                                    className="d-flex align-items-center ms-4"
                                  >
                                    <div className=" align-items-center d-flex">
                                      <CustomSelectTable2
                                        isDisabled={false}
                                        minWidth="600px"
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
                                                (areaVal: any) => {
                                                  return {
                                                    ...areaVal,
                                                    title: areaVal.name,
                                                    label: areaVal.name,
                                                    _id: areaVal._id,
                                                    value: areaVal._id,
                                                    reference: areaVal._id,
                                                  };
                                                }
                                              )
                                            : []
                                        }
                                        border={
                                          validation[index]?.isInValid
                                            ? '#e55451 !important'
                                            : ''
                                        }
                                        // backgroundColor={
                                        //   !validation[index]?.zone
                                        //     ? ''
                                        //     : '#fcecec !important'
                                        // }
                                        multiValueBackground="#def2ea"
                                        onChange={(event: any) =>
                                          handleMultiSelectChange(event, index)
                                        }
                                        value={productVal?.goodsLoadingArea?.map(
                                          (areaVal: any) => {
                                            return {
                                              ...areaVal,
                                              title: areaVal.name,
                                              label: areaVal.name,
                                              _id: areaVal.reference,
                                              value: areaVal.reference,
                                            };
                                          }
                                        )}
                                        indicatorDisplay="none"
                                        display="none"
                                        isMulti={true}
                                        menuIsOpen={false}
                                        placeholder="Select product zone"
                                      />
                                    </div>
                                  </Col>
                                  <Col
                                    xs="auto"
                                    className="ms-auto"
                                  >
                                    {productVal?.goodsLoadingArea?.length >
                                      0 && (
                                      <div
                                        className="fs-16 text-primary fw-500 cursor-pointer"
                                        onClick={() =>
                                          handleMultiSelectChange([], index)
                                        }
                                      >
                                        {' '}
                                        <i>Clear all</i>{' '}
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                                <>
                                  {productVal?.goodsLoadingArea?.map(
                                    (goodsItem: any, goodsIndex: number) => {
                                      return (
                                        <Row
                                          className="d-flex my-3 align-items-center p-0"
                                          key={goodsItem?._id}
                                        >
                                          <Col xs={2}>
                                            <div className="fs-16 fw-500 text-black min-w-90px text-break">
                                              {`${goodsItem?.name} bins`}
                                            </div>
                                          </Col>
                                          <Col
                                            xs={8}
                                            className="d-flex align-items-center ms-4"
                                          >
                                            <div className="align-items-center d-flex ">
                                              <CustomSelectTable2
                                                isDisabled={false}
                                                minWidth="600px"
                                                border={
                                                  validation[index]?.bins?.[
                                                    goodsIndex
                                                  ]?.isInValid
                                                    ? '#e55451 !important'
                                                    : ''
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
                                                  goodsItem?.bins?.length
                                                    ? goodsItem?.bins.map(
                                                        (areaVal: any) => {
                                                          return {
                                                            ...areaVal,
                                                            title: areaVal.name,
                                                            label: areaVal.name,
                                                            _id: areaVal._id,
                                                            value: areaVal._id,
                                                          };
                                                        }
                                                      )
                                                    : []
                                                }
                                                multiValueBackground="#def2ea"
                                                onChange={(event: any) =>
                                                  handleMultiSelectBinsChange(
                                                    event,
                                                    index,
                                                    goodsIndex
                                                  )
                                                }
                                                value={
                                                  goodsItem?.selectedBins
                                                    ? goodsItem?.selectedBins.map(
                                                        (areaVal: any) => {
                                                          return {
                                                            ...areaVal,
                                                            title: areaVal.name,
                                                            label: areaVal.name,
                                                            _id: areaVal?._id,
                                                            value: areaVal?._id,
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
                                          <Col
                                            xs="auto"
                                            className=" ms-auto"
                                          >
                                            {goodsItem?.selectedBins?.length >
                                              0 && (
                                              <div
                                                className="fs-16 text-primary fw-500 pe-2 cursor-pointer"
                                                onClick={() =>
                                                  handleMultiSelectBinsChange(
                                                    [],
                                                    index,
                                                    goodsIndex
                                                  )
                                                }
                                              >
                                                {' '}
                                                <i>Clear all</i>{' '}
                                              </div>
                                            )}
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )}
                                </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className='fs-16 fw-500 text-center mt-5 min-h-200px'> No batches available</div>
            )}
            {/* <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gy-5 mb-0 ">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                        <th className="px-0 min-w-md-100px">{'Batch'}</th>
                        <th className="px-0 min-w-200px">{'Zones'}</th>
                        <th className="px-0 min-w-200px text-center">Bins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData?.inventoryInfo?.reference?.batches &&
                      productData?.inventoryInfo?.reference?.batches.length ? (
                        productData?.inventoryInfo?.reference?.batches?.map(
                          (productVal: any, index: number) => {
                            return (
                              <tr key={productVal._id}>
                                <td>
                                  <div className="d-inline-flex align-items-center">
                                    <span className="fs-15 fw-500">
                                      {productVal?.batch}
                                    </span>
                                  </div>
                                </td>
                                <td className="">
                                  <div className="min-w-200px align-items-center d-flex">
                                    <CustomSelectTable2
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
                                          ? loadingArea.map((areaVal: any) => {
                                              return {
                                                ...areaVal,
                                                title: areaVal.name,
                                                label: areaVal.name,
                                                _id: areaVal._id,
                                                value: areaVal._id,
                                                reference: areaVal._id,
                                              };
                                            })
                                          : []
                                      }
                                      // border={
                                      //   !validation[index]?.zone
                                      //     ? ''
                                      //     : '#e55451 !important'
                                      // }
                                      // backgroundColor={
                                      //   !validation[index]?.zone
                                      //     ? ''
                                      //     : '#fcecec !important'
                                      // }
                                      multiValueBackground="#def2ea"
                                      onChange={(event: any) =>
                                        handleMultiSelectChange(event, index)
                                      }
                                      value={productVal?.goodsLoadingArea?.map(
                                        (areaVal: any) => {
                                          return {
                                            ...areaVal,
                                            title: areaVal.name,
                                            label: areaVal.name,
                                            _id: areaVal.reference,
                                            value: areaVal.reference,
                                          };
                                        }
                                      )}
                                      indicatorDisplay="none"
                                      display="none"
                                      isMulti={true}
                                      menuIsOpen={false}
                                      placeholder="Select product zone"
                                    />
                                    <div className="mt-5"></div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex  flex-column">
                                    {productVal?.goodsLoadingArea?.map(
                                      (goodsItem: any, goodsIndex: number) => {
                                        return (
                                          <div
                                            className="d-flex mb-3 align-items-center"
                                            key={goodsItem?._id}
                                          >
                                            <label className="fs-16 fw-500 text-black me-6">
                                              {`${goodsItem?.name} bins`}
                                            </label>
                                            <div className="min-w-200px">
                                              <CustomSelectTable2
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
                                                  goodsItem?.bins?.length
                                                    ? goodsItem?.bins.map(
                                                        (areaVal: any) => {
                                                          return {
                                                            ...areaVal,
                                                            title: areaVal.name,
                                                            label: areaVal.name,
                                                            _id: areaVal._id,
                                                            value: areaVal._id,
                                                          };
                                                        }
                                                      )
                                                    : []
                                                }
                                                multiValueBackground="#def2ea"
                                                onChange={(event: any) =>
                                                  handleMultiSelectBinsChange(
                                                    event,
                                                    index,
                                                    goodsIndex
                                                  )
                                                }
                                                value={
                                                  goodsItem?.selectedBins
                                                    ? goodsItem?.selectedBins.map(
                                                        (areaVal: any) => {
                                                          return {
                                                            ...areaVal,
                                                            title: areaVal.name,
                                                            label: areaVal.name,
                                                            _id: areaVal?._id,
                                                            value: areaVal?._id,
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
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center fs-16 fw-400"
                          >
                            No batches available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div> */}
          </Col>
          {productData?.inventoryInfo?.reference?.batches &&
          productData?.inventoryInfo?.reference?.batches.length ? (
            <Col
              xs={12}
              className="mt-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                disabled={loading}
              >
                {!loading && <span className="indicator-label">Save</span>}
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
            </Col>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Col
          xs={12}
          className="min-h-200px d-flex justify-content-center align-items-center"
        >
          {' '}
          <Loader loading={fetchLoader} />{' '}
        </Col>
      )}
    </Row>
  );
};
export default AssignProductZones;
