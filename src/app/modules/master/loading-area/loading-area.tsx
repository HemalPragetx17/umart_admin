import { useEffect, useState } from 'react';
import {
  Add,
  Delete,
  Edit,
  PAGE_LIMIT,
  SubCategoryItem,
  WarehouseZone,
} from '../../../../utils/constants';
import { Button, Card, Col, FormLabel, Row } from 'react-bootstrap';
import Loader from '../../../../Global/loader';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
import { InventoryString } from '../../../../utils/string';
import { KTSVG } from '../../../../umart_admin/helpers';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import APICallService from '../../../../api/apiCallService';
import {
  inventory,
  loadingAreaEndPoints,
  master,
  product,
} from '../../../../api/apiEndPoints';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import clsx from 'clsx';
import ArrowDown from '../../../../umart_admin/assets/media/svg_uMart/down-arrow.svg';
import CreateBins from './CreateBins';
import AssignZoneModal from '../../../modals/assign-zone-modal';
import { useNavigate } from 'react-router-dom';
const downArrow =
  'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23181c32%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e';
const GoodsLoadingArea = () => {
  const navigate = useNavigate();
  const [fetchLoader, setFetchLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [initialData, setInitialData] = useState<any>();
  const [sortKey, setSortkey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<any>();
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingArea, setLoadingArea] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const [loadingAreaData, setLoadingAreaData] = useState<any>([]);
  const [deletedItems, setDeletedItems] = useState<any>([]);
  const [openCategoryIndexes, setOpenCategoryIndexes] = useState<number[]>([]);
  const [validation, setValidation] = useState<
    {
      reference: boolean;
      zone: boolean;
    }[]
  >([
    {
      reference: false,
      zone: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedWareHouse, setSelectedWareHouse] = useState<any>();
  const [wareHouseProduct, setWareHouseProducts] = useState<any>([]);
  const [wareHouses, setWareHouses] = useState<any>([]);
  const [isDisabled, setIsDisable] = useState(true);
  const hasViewPermission = !(
    Method.hasPermission(WarehouseZone, Add, currentUser) ||
    Method.hasPermission(WarehouseZone, Edit, currentUser) ||
    Method.hasPermission(WarehouseZone, Delete, currentUser)
  );
  const [categories, setCategories] = useState<any>([]);
  const [productBatchData, setProductBatchData] = useState<any>();
  const [currentCategories, setCurrentCategories] = useState<{
    category: string;
    subCategory: string;
  }>({
    category: '',
    subCategory: '',
  });
  const [showAssignZoneModal, setShowAssignZoneModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>();
  const [loadingId, setLoadingId] = useState('');
  const [productLoader, setProductLoader] = useState(false);
  const [validations, setValidations] = useState<Record<string, any>>({});
  const [searchData, setSearchData] = useState<{
    category: string;
    product: string;
  }>({
    category: '',
    product: '',
  });
  const [categorySearchTerms, setCategorySearchTerms] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      if (!Method.hasModulePermission(WarehouseZone, currentUser)) {
        return window.history.back();
      }
      await fetchWarehouses();
      setFetchLoader(false);
    })();
  }, []);
  const toggleCategory = (index: number) => {
    setOpenCategoryIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setCurrentCategories({
      category: '',
      subCategory: '',
    });
  };
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
      WarehouseZone
    );
    const response = await apiService.callAPI();
    setWareHouses(response.records);
  };
  const fetchInitData = async (page: number, limit: number) => {
    setLoading(true);
    const tempGoodsData = await fetchProductZone();
    const goodsLoadingIdMap: Record<string, any> = {};
    tempGoodsData.map((item: any) => {
      goodsLoadingIdMap[item._id] = item;
    });
    let params = {
      sortKey: '_createdAt',
      sortOrder: -1,
      categoriesDepth: 2,
    };
    let apiServiceCategory = new APICallService(
      master.categoryList,
      params,
      '',
      '',
      false,
      '',
      WarehouseZone
    );
    let responseCategory = await apiServiceCategory.callAPI();
    const tempValidation: Record<string, any> = {};
    const temp = responseCategory?.records
      ? JSON.parse(JSON.stringify(responseCategory?.records))
      : [];
    const tempCategories = temp.map((item: any) => {
      tempValidation[item?._id] = {
        isInvalid: false,
        goodsLoadingArea: [],
      };
      return {
        ...item,
        goodsLoadingArea: item?.goodsLoadingArea.map((goodItem: any) => {
          tempValidation[item?._id].goodsLoadingArea.push({
            isInvalid: false,
          });
          return {
            ...goodItem,
            selectedBins: JSON.parse(JSON.stringify(goodItem?.bins || [])),
            bins: goodsLoadingIdMap[goodItem?.reference]?.bins || [],
          };
        }),
        categories: item?.categories?.map((subItem: any) => {
          tempValidation[subItem?._id] = {
            isInvalid: false,
            goodsLoadingArea: [],
          };
          return {
            ...subItem,
            goodsLoadingArea: subItem?.goodsLoadingArea.map((goodItem: any) => {
              tempValidation[subItem?._id].goodsLoadingArea.push({
                isInvalid: false,
              });
              return {
                ...goodItem,
                selectedBins: JSON.parse(JSON.stringify(goodItem?.bins || [])),
                bins: goodsLoadingIdMap[goodItem?.reference]?.bins || [],
              };
            }),
          };
        }),
      };
    });
    setCategories(tempCategories);
    setValidations(tempValidation);
    setCategorySearchTerms(
      Array.from({ length: tempCategories.length }).map((item: any) => '')
    );
    setLoading(false);
  };
  const fetchProductZone = async () => {
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
    }
    return response?.records || [];
  };
  const fetchProducts = async (category: any, subCategory: any) => {
    if (!category || !subCategory) return;
    setProductLoader(true);
    const params = {
      category,
      subCategory,
    };
    const apiCallService = new APICallService(
      product.getProductByCategoryForLoadingArea,
      params,
      '',
      '',
      false,
      '',
      WarehouseZone
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setProductBatchData(response?.records || []);
    }
    setProductLoader(false);
  };
  const handleWareHouse = async (event: any) => {
    if (event) {
      if (event.value !== selectedWareHouse) {
        setSelectedWareHouse(event.value);
        await fetchInitData(1, PAGE_LIMIT);
        // await fetchProductZone();
      }
      setSelectedWareHouse(event.value);
    } else {
      setSelectedWareHouse('');
    }
  };
  const handleMultiSelectChange = (event: any, index: number) => {
    const temp = [...categories];
    const tempValidation = JSON.parse(JSON.stringify(validations));
    const id = temp[index]?._id;
    temp[index].goodsLoadingArea = event;
    tempValidation[id].isInvalid = event?.length === 0;
    tempValidation[id].goodsLoadingArea = event?.map((val: any) => ({
      isInvalid: false,
    }));
    setCategories(temp);
    setValidations(tempValidation);
  };
  const handleMultiSelectChangeSubCategory = (
    event: any,
    index: number,
    subIndex: number
  ) => {
    const temp = [...categories];
    const tempValidation = JSON.parse(JSON.stringify(validations));
    temp[index].categories[subIndex].goodsLoadingArea = event;
    const id = temp[index]?.categories[subIndex]?._id;
    tempValidation[id].isInvalid = event?.length === 0;
    tempValidation[id].goodsLoadingArea = event?.map((val: any) => ({
      isInvalid: false,
    }));
    setCategories(temp);
    setValidations(tempValidation);
  };
  const handleSave = async () => {
    const temp = [...loadingAreaData];
    const tempValidation = [...validation];
    const tempLength = temp.length;
    if (temp[tempLength - 1].reference === '') {
      tempValidation[tempLength - 1].reference = true;
    }
    if (
      temp[tempLength - 1].zone.length === 0 &&
      !temp[tempLength - 1]?.isDeleted
    ) {
      tempValidation[tempLength - 1].zone = true;
    }
    const isValid = tempValidation.some((item) => item.reference || item.zone);
    setValidation(tempValidation);
    if (!isValid) {
      setIsSubmitting(true);
      const tempDeletedItems = deletedItems.filter(
        (item: any) => item.reference.length > 0
      );
      const data = {
        list: [...tempDeletedItems, ...loadingAreaData],
      };
      const apiService = new APICallService(
        loadingAreaEndPoints.addLoadingArea,
        data,
        '',
        '',
        false,
        '',
        WarehouseZone
      );
      const response = await apiService.callAPI();
      if (response) {
        success(masterToast.loadingAreaSaved);
        setIsSubmitting(false);
        await fetchInitData(1, PAGE_LIMIT);
        await fetchProductZone();
      }
    }
  };
  const getLength = (data: any) => {
    let length = 0;
    data.map((item: any) => {
      if (!item.isDeleted) {
        length++;
      }
    });
    return length;
  };
  const isLast = (data: any, item: any) => {
    const index = data.findIndex(
      (val: any) => val.reference === item.reference
    );
    let deleted = data.length - getLength(data);
    const temp = data.length - deleted - 1;
    return (
      index === loadingAreaData.length - 1 ||
      data[temp]?.reference === item.reference
    );
  };
  const hanldeBinsRemove = (
    categoryIndex: number,
    zoneIndex: number,
    binIndex: number
  ) => {
    const temp = JSON.parse(JSON.stringify(categories));
    temp[categoryIndex].goodsLoadingArea[zoneIndex].bins.splice(binIndex, 1);
    setCategories(temp);
  };
  const hanldeBinsRemoveForSubCategory = (
    categoryIndex: number,
    subCatIndex: number,
    zoneIndex: number,
    binIndex: number
  ) => {
    const temp = JSON.parse(JSON.stringify(categories));
    temp[categoryIndex].categories[subCatIndex].goodsLoadingArea[
      zoneIndex
    ].bins.splice(binIndex, 1);
    setCategories(temp);
  };
  const handleSubCategoryClick = async (category: any, subCategory: any) => {
    if (
      category == currentCategories.category &&
      subCategory == currentCategories.subCategory
    ) {
      setCurrentCategories({
        category: '',
        subCategory: '',
      });
      setProductBatchData([]);
      return;
    }
    setCurrentCategories({
      category: category,
      subCategory: subCategory,
    });
    setSearchData({
      category: '',
      product: '',
    });
    await fetchProducts(category, subCategory);
  };
  const getBinsSelectOptions = (loadingData: any) => {
    if (!loadingData || loadingData.length === 0) return [];
    let temp: any = [];
    loadingData.forEach((areaVal: any, index: number) => {
      if (!areaVal?.bins) return;
      areaVal?.bins.forEach((item: any) => {
        temp.push({
          ...item,
          title: item.name + ' - ' + item?.sequence,
          label: item.name + ' - ' + item?.sequence,
          _id: areaVal._id || '',
          value: areaVal._id || '',
          zoneIndex: index,
        });
      });
    });
    return temp;
  };
  const handleMultiSelectBinsChange = (
    event: any,
    index: number,
    goodsIndex: number
  ) => {
    const temp = [...categories];
    const tempValidation = JSON.parse(JSON.stringify(validations));
    const id = temp[index]?._id;
    temp[index].goodsLoadingArea[goodsIndex].selectedBins = event;
    tempValidation[id].goodsLoadingArea[goodsIndex].isInvalid =
      event?.length === 0;
    setCategories(temp);
    setValidations(tempValidation);
  };
  const handleMultiSelectSubCategoryBinsChange = (
    event: any,
    index: number,
    subIndex: number,
    goodsIndex: number
  ) => {
    const temp = [...categories];
    const tempValidation = JSON.parse(JSON.stringify(validations));
    const id = temp[index]?.categories[subIndex]?._id;
    temp[index].categories[subIndex].goodsLoadingArea[goodsIndex].selectedBins =
      event;
    tempValidation[id].goodsLoadingArea[goodsIndex].isInvalid =
      event?.length === 0;
    setCategories(temp);
    setValidations(tempValidation);
  };
  const handleSaveCategoryZones = async (
    categoryData: any,
    primaryCategroy?: any
  ) => {
    if (!categoryData) return;
    const tempValidation = JSON.parse(JSON.stringify(validations));
    tempValidation[categoryData?._id].isInvalid =
      categoryData?.goodsLoadingArea?.length === 0;
    tempValidation[categoryData?._id].goodsLoadingArea =
      categoryData?.goodsLoadingArea?.map((item: any) => {
        return {
          isInvalid: item?.selectedBins
            ? item?.selectedBins?.length === 0
            : true,
        };
      });
    const isInValid =
      tempValidation[categoryData?._id].isInvalid ||
      tempValidation[categoryData?._id].goodsLoadingArea.some(
        (item: any) => item?.isInvalid
      );
    setValidations(tempValidation);
    if (isInValid) {
      return;
    }
    setLoadingId(categoryData?._id);
    const data: any = {
      productZoneCacheType: primaryCategroy ? 2 : 1,
      list: [
        {
          zone: categoryData?.goodsLoadingArea
            ? categoryData?.goodsLoadingArea.map((goodsItem: any) => {
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
            : [],
          productZoneCacheType: primaryCategroy ? 2 : 1,
          reference: categoryData?._id,
          ...(primaryCategroy
            ? {
                category: primaryCategroy,
              }
            : {}),
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
    setLoadingId('');
    if (categoryData && !primaryCategroy) {
      await fetchInitData(1, PAGE_LIMIT);
    }
  };
  const hadleSearch = (value: any, type: 'category' | 'product') => {
    // if(type === 'product'){
    setSearchData((pre) => {
      return {
        ...pre,
        [type]: value.toLowerCase(),
      };
    });
    // }
  };
  const handleCategorySearch = (value: string, index: number) => {
    const temp = [...categorySearchTerms];
    temp[index] = value?.toLowerCase();
    setCategorySearchTerms(temp);
  };
  return (
    <>
      {showAssignZoneModal && currentProduct ? (
        <AssignZoneModal
          show={showAssignZoneModal}
          onHide={() => {
            setShowAssignZoneModal(false);
            setCurrentProduct(undefined);
          }}
          product={currentProduct}
          loadingArea={loadingArea}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center">
        <>
          <Col
            xs
            className="align-self-center mb-5"
          >
            <h1 className="fs-22 fw-bolder">Warehouse Product Zone</h1>
          </Col>
          <Col xs={12}>
            {Method.hasModulePermission(WarehouseZone, currentUser) ? (
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
                        loading={fetchLoader}
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
                                  (item: any) => item._id === selectedWareHouse
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
                        isClearable={false}
                        onChange={(event: any) => {
                          handleWareHouse(event);
                        }}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              <></>
            )}
          </Col>
          {!selectedWareHouse ? (
            <></>
          ) : (
            <>
              {loading ? (
                <div className="d-flex justify-content-center ">
                  <Loader loading={loading} />
                  {/* <h2>Loading...</h2> */}
                </div>
              ) : (
                <>
                  {categories.length ? (
                    <>
                      {' '}
                      <Card className="border border-r10px px-0">
                        <Card.Body className="p-0 ">
                          {categories?.map(
                            (primaryVal: any, primaryIndex: number) => {
                              if (primaryVal?.isRecipe) return <></>;
                              const searchTerm =
                                categorySearchTerms[primaryIndex]
                                  ?.trim()
                                  .toLowerCase() || '';
                              const isOpen =
                                openCategoryIndexes.includes(primaryIndex);
                              return (
                                <div
                                  className="accordion"
                                  id={'kt_accordion_' + primaryVal._id}
                                  key={primaryVal._id}
                                >
                                  <div className="accordion-item">
                                    <div
                                      className={clsx(
                                        primaryVal.categories.length
                                          ? 'accordion-header bg-light'
                                          : ' accordion-header accordion-header-white'
                                      )}
                                      id={'accordion_' + primaryVal._id}
                                    >
                                      <Row className="align-items-center p-0">
                                        <Col
                                          xs
                                          className="pe-0 d-flex align-items-center"
                                        >
                                          <button
                                            // className="accordion-button fs-16 fw-600 pe-0 border-bottom-0 collapsed"
                                            className={clsx(
                                              primaryVal.categories.length
                                                ? 'accordion-button bg-light '
                                                : 'accordion-button accordion-button-white ',
                                              'fs-16 fw-600 pe-0 border-bottom-0 collapsed no-arrow-icon'
                                            )}
                                            // style={{
                                            //   width: '30%',
                                            // }}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={
                                              '#body_accordion_' +
                                              primaryVal._id
                                            }
                                            aria-expanded="false"
                                            aria-controls={
                                              'body_accordion_' + primaryVal._id
                                            }
                                            onClick={() =>
                                              toggleCategory(primaryIndex)
                                            }
                                          >
                                            {/* <span
                                              className={clsx(
                                                'accordion-arrow me-5 ms-auto',
                                                'collapsed'
                                              )}
                                              data-bs-toggle="collapse"
                                              data-bs-target={
                                                '#body_accordion_' +
                                                primaryVal._id
                                              }
                                              aria-expanded="false"
                                              aria-controls={
                                                'body_accordion_' +
                                                primaryVal._id
                                              }
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              role="button"
                                            >
                                              <img
                                                src={ArrowDown}
                                                width={15}
                                              />
                                            </span> */}
                                            <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                              <img
                                                className="img-fluid"
                                                src={primaryVal.image}
                                                alt=""
                                              />
                                            </span>
                                            <span className="">
                                              {primaryVal.title}
                                            </span>
                                            <div className="ms-auto">
                                              <img
                                                src={downArrow}
                                                height={15}
                                                width={15}
                                                className={
                                                  isOpen ? 'rotate-180' : ''
                                                }
                                              />
                                            </div>
                                          </button>
                                        </Col>
                                        <Col xs="auto"></Col>
                                      </Row>
                                    </div>
                                    {isOpen && (
                                      <div
                                        id={`body_accordion_${primaryVal._id}`}
                                        className={`accordion-collapse ${
                                          isOpen ? 'show' : 'collapse'
                                        }`}
                                      >
                                        <div className="accordion-body p-0 ">
                                          <div className="accordion-item bg-light ps-4 pe-2">
                                            <div className="accordion-header">
                                              <Row>
                                                <Col xs={5}>
                                                  <div className="d-flex align-items-center position-relative me-4 mt-3">
                                                    <KTSVG
                                                      path="/media/icons/duotune/general/gen021.svg"
                                                      className="svg-icon-3 position-absolute ms-3"
                                                    />
                                                    <input
                                                      type="text"
                                                      id="kt_filter_search"
                                                      className="form-control form-control-white min-h-40px form-control-lg ps-10 custom-placeholder"
                                                      placeholder="Search sub category"
                                                      onChange={(
                                                        event: any
                                                      ) => {
                                                        handleCategorySearch(
                                                          event.target.value.trimStart(),
                                                          primaryIndex
                                                        );
                                                      }}
                                                      value={
                                                        categorySearchTerms[
                                                          primaryIndex
                                                        ] || ''
                                                      }
                                                      //  onKeyUp={handleOnKeyUp}
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row className="align-items-center p-0 my-4">
                                                <Col xs={2}>
                                                  <div className="fs-16 fw-500 text-black me-3 min-w-90px">
                                                    Select zones Min
                                                  </div>
                                                </Col>
                                                <Col
                                                  xs={8}
                                                  className="d-flex align-items-center ms-4"
                                                >
                                                  <div className=" align-items-center d-flex">
                                                    <CustomSelectTable2
                                                      border={
                                                        validations[
                                                          primaryVal?._id
                                                        ]?.isInvalid
                                                          ? '#e55451 !important'
                                                          : ''
                                                      }
                                                      minWidth="600px"
                                                      isDisabled={
                                                        !Method.hasPermission(
                                                          WarehouseZone,
                                                          Edit,
                                                          currentUser
                                                        )
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
                                                      onChange={(event: any) =>
                                                        handleMultiSelectChange(
                                                          event,
                                                          primaryIndex
                                                        )
                                                      }
                                                      value={
                                                        primaryVal?.goodsLoadingArea
                                                          ? primaryVal?.goodsLoadingArea.map(
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
                                                <Col
                                                  xs="auto"
                                                  className="ms-auto"
                                                >
                                                  <Button
                                                    variant="primary"
                                                    className={`h-45px ${
                                                      primaryVal?._id ==
                                                      loadingId
                                                        ? 'px-3'
                                                        : ''
                                                    }`}
                                                    disabled={
                                                      primaryVal?._id ==
                                                        loadingId ||
                                                      !Method.hasPermission(
                                                        WarehouseZone,
                                                        Edit,
                                                        currentUser
                                                      )
                                                    }
                                                    onClick={() => {
                                                      handleSaveCategoryZones(
                                                        primaryVal
                                                      );
                                                    }}
                                                    style={{
                                                      whiteSpace: 'nowrap',
                                                    }}
                                                  >
                                                    {primaryVal?._id !==
                                                      loadingId && (
                                                      <span className="indicator-label">
                                                        Save
                                                      </span>
                                                    )}
                                                    {primaryVal?._id ==
                                                      loadingId && (
                                                      <span
                                                        className="indicator-progress"
                                                        style={{
                                                          display: 'block',
                                                        }}
                                                      >
                                                        Please wait...
                                                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                      </span>
                                                    )}
                                                  </Button>
                                                </Col>
                                              </Row>
                                              {primaryVal?.goodsLoadingArea?.map(
                                                (
                                                  goodsItem: any,
                                                  goodsIndex: number
                                                ) => {
                                                  return (
                                                    <Row
                                                      className="d-flex my-4 align-items-center p-0"
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
                                                            border={
                                                              validations[
                                                                primaryVal?._id
                                                              ]
                                                                ?.goodsLoadingArea[
                                                                goodsIndex
                                                              ]?.isInvalid
                                                                ? '#e55451 !important'
                                                                : ''
                                                            }
                                                            isDisabled={
                                                              !Method.hasPermission(
                                                                WarehouseZone,
                                                                Edit,
                                                                currentUser
                                                              )
                                                            }
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
                                                                primaryIndex,
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
                                                      <Col
                                                        xs="auto"
                                                        className=" ms-auto"
                                                      >
                                                        {/* {goodsItem?.selectedBins
                                                        ?.length > 0 && (
                                                        <div className="fs-16 text-primary fw-500 pe-2 ">
                                                          {' '}
                                                          <i>Clear all</i>{' '}
                                                        </div>
                                                      )} */}
                                                      </Col>
                                                    </Row>
                                                  );
                                                }
                                              )}
                                              {primaryVal?.categories?.length >
                                                0 &&
                                                primaryVal?.categories?.map(
                                                  (
                                                    subVal: any,
                                                    subIndex: number
                                                  ) => {
                                                    const searchTerm =
                                                      categorySearchTerms[
                                                        primaryIndex
                                                      ]
                                                        ?.trim()
                                                        ?.toLowerCase();
                                                    if (
                                                      !!(
                                                        searchTerm &&
                                                        !subVal?.title
                                                          ?.toLowerCase()
                                                          ?.includes(searchTerm)
                                                      )
                                                    ) {
                                                      return null;
                                                    }
                                                    return (
                                                      <div
                                                        key={subVal._id}
                                                        id={
                                                          'body_accordion_' +
                                                          primaryVal._id
                                                        }
                                                        className={`accordion-collapse collapse ${
                                                          !searchTerm ||
                                                          subVal?.title
                                                            ?.toLowerCase()
                                                            ?.includes(
                                                              searchTerm
                                                            )
                                                            ? 'show'
                                                            : ''
                                                        }`}
                                                        aria-labelledby={
                                                          'accordion_' +
                                                          subVal._id
                                                        }
                                                        data-bs-parent={
                                                          '#kt_accordion_' +
                                                          subVal._id
                                                        }
                                                      >
                                                        <div className="accordion-item">
                                                          <div
                                                            className={clsx(
                                                              subVal?.categories
                                                                ?.length
                                                                ? 'accordion-header'
                                                                : ' accordion-header accordion-header-white bg-light'
                                                            )}
                                                            id={
                                                              'accordion_' +
                                                              subVal._id
                                                            }
                                                          >
                                                            {' '}
                                                            <Row className="align-items-center p-0">
                                                              <Col
                                                                xs
                                                                className="pe-0 d-flex align-items-center"
                                                              >
                                                                <button
                                                                  // className="accordion-button fs-16 fw-600 pe-0 border-bottom-0 collapsed"
                                                                  className={clsx(
                                                                    subVal
                                                                      ?.categories
                                                                      ?.length
                                                                      ? 'accordion-button bg-light '
                                                                      : 'accordion-button bg-light',
                                                                    'fs-16 fw-600 pe-0 border-bottom-0 collapsed no-arrow-icon'
                                                                  )}
                                                                  // style={{
                                                                  //   width: '30%',
                                                                  // }}
                                                                  type="button"
                                                                  data-bs-toggle="collapse"
                                                                  data-bs-target={
                                                                    '#body_accordion_' +
                                                                    subVal._id
                                                                  }
                                                                  aria-expanded="false"
                                                                  aria-controls={
                                                                    'body_accordion_' +
                                                                    subVal._id
                                                                  }
                                                                  onClick={(
                                                                    e
                                                                  ) => {
                                                                    e.stopPropagation();
                                                                    handleSubCategoryClick(
                                                                      primaryVal?._id,
                                                                      subVal?._id
                                                                    );
                                                                  }}
                                                                >
                                                                  <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                                                    <img
                                                                      className="img-fluid"
                                                                      src={
                                                                        subVal.image
                                                                      }
                                                                      alt=""
                                                                    />
                                                                  </span>
                                                                  <span className="w-100">
                                                                    {
                                                                      subVal.title
                                                                    }
                                                                  </span>
                                                                  <div className="ms-auto">
                                                                    <img
                                                                      src={
                                                                        downArrow
                                                                      }
                                                                      height={
                                                                        15
                                                                      }
                                                                      width={15}
                                                                      className={
                                                                        currentCategories.category ===
                                                                          primaryVal?._id &&
                                                                        currentCategories?.subCategory ===
                                                                          subVal?._id
                                                                          ? 'rotate-180'
                                                                          : ''
                                                                      }
                                                                    />
                                                                  </div>
                                                                </button>
                                                              </Col>
                                                              <Col xs="auto"></Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                        {currentCategories.category ===
                                                          primaryVal?._id &&
                                                        currentCategories?.subCategory ===
                                                          subVal?._id ? (
                                                          <div
                                                            id={
                                                              'body_accordion_' +
                                                              subVal._id
                                                            }
                                                            className={`accordion-collapse ${
                                                              currentCategories.category ===
                                                                primaryVal?._id &&
                                                              currentCategories?.subCategory ===
                                                                subVal?._id
                                                                ? 'show'
                                                                : 'collapse'
                                                            }`}
                                                          >
                                                            <div className="accordion-body p-0 ">
                                                              <div className="accordion-item bg-light ps-4 pe-2">
                                                                <div className="accordion-header">
                                                                  <Row>
                                                                    <Col xs={5}>
                                                                      <div className="d-flex align-items-center position-relative me-4 mt-2">
                                                                        <KTSVG
                                                                          path="/media/icons/duotune/general/gen021.svg"
                                                                          className="svg-icon-3 position-absolute ms-3"
                                                                        />
                                                                        <input
                                                                          type="text"
                                                                          id="kt_filter_search"
                                                                          className="form-control form-control-white min-h-40px form-control-lg ps-10 custom-placeholder"
                                                                          placeholder="Search product"
                                                                          onChange={(
                                                                            event: any
                                                                          ) => {
                                                                            hadleSearch(
                                                                              event.target.value.trimStart(),
                                                                              'product'
                                                                            );
                                                                          }}
                                                                          value={
                                                                            searchData.product
                                                                          }
                                                                          //  onKeyUp={handleOnKeyUp}
                                                                        />
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                  <Row className="align-items-center p-0 my-4">
                                                                    <Col xs={2}>
                                                                      <div className="fs-16 fw-500 text-black me-3 min-w-90px">
                                                                        Select
                                                                        zones
                                                                      </div>
                                                                    </Col>
                                                                    <Col
                                                                      xs={8}
                                                                      className="d-flex align-items-center ms-4"
                                                                    >
                                                                      <div className=" align-items-center d-flex">
                                                                        <CustomSelectTable2
                                                                          border={
                                                                            validations[
                                                                              subVal
                                                                                ?._id
                                                                            ]
                                                                              ?.isInvalid
                                                                              ? '#e55451 !important'
                                                                              : ''
                                                                          }
                                                                          minWidth="600px"
                                                                          isDisabled={
                                                                            !Method.hasPermission(
                                                                              WarehouseZone,
                                                                              Edit,
                                                                              currentUser
                                                                            )
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
                                                                            handleMultiSelectChangeSubCategory(
                                                                              event,
                                                                              primaryIndex,
                                                                              subIndex
                                                                            )
                                                                          }
                                                                          value={
                                                                            subVal?.goodsLoadingArea
                                                                              ? subVal?.goodsLoadingArea.map(
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
                                                                    <Col
                                                                      xs="auto"
                                                                      className="ms-auto"
                                                                    >
                                                                      <Button
                                                                        variant="primary"
                                                                        className={`h-45px ${
                                                                          subVal?._id ==
                                                                          loadingId
                                                                            ? 'px-3'
                                                                            : ''
                                                                        }`}
                                                                        disabled={
                                                                          subVal?._id ==
                                                                            loadingId ||
                                                                          !Method.hasPermission(
                                                                            WarehouseZone,
                                                                            Edit,
                                                                            currentUser
                                                                          )
                                                                        }
                                                                        onClick={() => {
                                                                          handleSaveCategoryZones(
                                                                            subVal,
                                                                            primaryVal?._id
                                                                          );
                                                                        }}
                                                                        style={{
                                                                          whiteSpace:
                                                                            'nowrap',
                                                                        }}
                                                                      >
                                                                        {subVal?._id !==
                                                                          loadingId && (
                                                                          <span className="indicator-label">
                                                                            Save
                                                                          </span>
                                                                        )}
                                                                        {subVal?._id ==
                                                                          loadingId && (
                                                                          <span
                                                                            className="indicator-progress"
                                                                            style={{
                                                                              display:
                                                                                'block',
                                                                            }}
                                                                          >
                                                                            Please
                                                                            wait...
                                                                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                                          </span>
                                                                        )}
                                                                      </Button>
                                                                    </Col>
                                                                  </Row>
                                                                  {subVal?.goodsLoadingArea?.map(
                                                                    (
                                                                      goodsItem: any,
                                                                      goodsIndex: number
                                                                    ) => {
                                                                      return (
                                                                        <Row
                                                                          className="d-flex my-4 align-items-center p-0"
                                                                          key={
                                                                            goodsItem?._id
                                                                          }
                                                                        >
                                                                          <Col
                                                                            xs={
                                                                              2
                                                                            }
                                                                          >
                                                                            <div className="fs-16 fw-500 text-black min-w-90px text-break">
                                                                              {`${goodsItem?.name} bins`}
                                                                            </div>
                                                                          </Col>
                                                                          <Col
                                                                            xs={
                                                                              8
                                                                            }
                                                                            className="d-flex align-items-center ms-4"
                                                                          >
                                                                            <div className="align-items-center d-flex ">
                                                                              <CustomSelectTable2
                                                                                border={
                                                                                  validations[
                                                                                    subVal
                                                                                      ?._id
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
                                                                                  !Method.hasPermission(
                                                                                    WarehouseZone,
                                                                                    Edit,
                                                                                    currentUser
                                                                                  )
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
                                                                                  handleMultiSelectSubCategoryBinsChange(
                                                                                    event,
                                                                                    primaryIndex,
                                                                                    subIndex,
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
                                                                          <Col
                                                                            xs="auto"
                                                                            className=" ms-auto"
                                                                          ></Col>
                                                                        </Row>
                                                                      );
                                                                    }
                                                                  )}
                                                                  {currentCategories.category ===
                                                                    primaryVal?._id &&
                                                                  currentCategories?.subCategory ===
                                                                    subVal?._id ? (
                                                                    !productLoader ? (
                                                                      productBatchData &&
                                                                      productBatchData.length ? (
                                                                        productBatchData.map(
                                                                          (
                                                                            productItem: any
                                                                          ) => {
                                                                            if (
                                                                              searchData.product.trim()
                                                                                .length &&
                                                                              !productItem?.title
                                                                                ?.toLowerCase()
                                                                                .includes(
                                                                                  searchData.product
                                                                                    ?.trim()
                                                                                    .toLowerCase()
                                                                                )
                                                                            ) {
                                                                              return (
                                                                                <>

                                                                                </>
                                                                              );
                                                                            }
                                                                            return (
                                                                              <div
                                                                                key={
                                                                                  productItem?._id
                                                                                }
                                                                                className="min-h-80px ps-9 border-top-1 border border-top-black border-start-0 border-end-0 d-flex align-items-center justify-content-between bg-light"
                                                                              >
                                                                                <div>
                                                                                  <span className="w-100 text-black fw-500 fs-16 ms-12">
                                                                                    {
                                                                                      productItem?.title
                                                                                    }
                                                                                  </span>
                                                                                </div>
                                                                                <Button
                                                                                  variant="primary"
                                                                                  className="h-45px me-4"
                                                                                  style={{
                                                                                    whiteSpace:
                                                                                      'nowrap',
                                                                                  }}
                                                                                  disabled={
                                                                                    !Method.hasPermission(
                                                                                      WarehouseZone,
                                                                                      Edit,
                                                                                      currentUser
                                                                                    )
                                                                                  }
                                                                                  onClick={() => {
                                                                                    navigate(
                                                                                      'assign',
                                                                                      {
                                                                                        state:
                                                                                          productItem,
                                                                                      }
                                                                                    );
                                                                                  }}
                                                                                >
                                                                                  {' '}
                                                                                  Assign
                                                                                  zones/bins
                                                                                </Button>
                                                                              </div>
                                                                            );
                                                                          }
                                                                        )
                                                                      ) : (
                                                                        <div className="bg-white min-h-80px ps-9 border-top-1 d-flex align-items-center justify-content-center fs-15 fw-500">
                                                                          No
                                                                          product
                                                                          available
                                                                        </div>
                                                                      )
                                                                    ) : (
                                                                      <div className="text-center min-h-100px">
                                                                        <Loader
                                                                          loading={
                                                                            productLoader
                                                                          }
                                                                        />
                                                                      </div>
                                                                    )
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* {primaryVal?.categories?.length > 0 &&
                                      primaryVal?.categories?.map(
                                        (subVal: any, subIndex: number) => {
                                          return (
                                            <div
                                              key={subVal._id}
                                              id={
                                                'body_accordion_' +
                                                primaryVal._id
                                              }
                                              className="accordion-collapse collapse"
                                              aria-labelledby={
                                                'accordion_' + subVal._id
                                              }
                                              data-bs-parent={
                                                '#kt_accordion_' + subVal._id
                                              }
                                            >
                                              <div className="accordion-body p-0">
                                                <div className="accordion-item">
                                                  <div
                                                    className={clsx(
                                                      subVal?.categories?.length
                                                        ? 'accordion-header'
                                                        : ' accordion-header accordion-header-white'
                                                    )}
                                                    id={
                                                      'accordion_primary_' +
                                                      subVal._id
                                                    }
                                                  >
                                                    <Row className="align-items-center p-0">
                                                      <Col
                                                        xs
                                                        className="pe-0 d-flex align-items-center"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleSubCategoryClick(
                                                            primaryVal?._id,
                                                            subVal?._id
                                                          );
                                                        }}
                                                      >
                                                        <button
                                                          className={clsx(
                                                            subVal?.categories
                                                              ?.length
                                                              ? 'accordion-button'
                                                              : 'accordion-button accordion-button-white',
                                                            'fs-16 fw-600 pe-0 border-top-0 border-bottom-0 ps-18 collapsed no-arrow-icon'
                                                          )}
                                                          style={{
                                                            width: '30%',
                                                          }}
                                                          type="button"
                                                          data-bs-toggle="collapse"
                                                          data-bs-target={
                                                            '#body_accordion_primary_' +
                                                            subVal._id
                                                          }
                                                          aria-expanded="false"
                                                          aria-controls={
                                                            'body_accordion_primary_' +
                                                            subVal._id
                                                          }
                                                        >
                                                          <span
                                                            role="button"
                                                            className="me-4"
                                                          >
                                                            <img
                                                              src={ArrowDown}
                                                              width={15}
                                                              className={`${
                                                                currentCategories.category ===
                                                                  primaryVal?._id &&
                                                                currentCategories?.subCategory ===
                                                                  subVal?._id
                                                                  ? 'rotate-180'
                                                                  : ''
                                                              }`}
                                                            />
                                                          </span>
                                                          <span className="symbol symbol-35px border bg-body border-r8px me-3">
                                                            <img
                                                              className="img-fluid"
                                                              src={subVal.image}
                                                              alt=""
                                                            />
                                                          </span>
                                                          <span className="w-100">
                                                            {subVal.title}
                                                          </span>
                                                        </button>
                                                        <div
                                                          className="my-0 me-4 d-flex justify-content-end py-3"
                                                          style={{
                                                            width: '70%',
                                                          }}
                                                          onClick={(e) =>
                                                            e.stopPropagation()
                                                          }
                                                        >
                                                          <div>
                                                            <div className="d-flex">
                                                              <label className="fs-16 fw-500 text-black me-3 mt-3">
                                                                Select zones
                                                              </label>
                                                              <div className="min-w-200px">
                                                                <CustomSelectTable2
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
                                                                    handleMultiSelectChangeSubCategory(
                                                                      event,
                                                                      primaryIndex,
                                                                      subIndex
                                                                    )
                                                                  }
                                                                  value={
                                                                    subVal?.goodsLoadingArea
                                                                      ? subVal?.goodsLoadingArea.map(
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
                                                                  menuIsOpen={
                                                                    false
                                                                  }
                                                                  placeholder="Select product zone"
                                                                />
                                                              </div>
                                                            </div>
                                                            {subVal?.goodsLoadingArea?.map(
                                                              (
                                                                goodsItem: any,
                                                                goodsIndex: number
                                                              ) => {
                                                                return (
                                                                  <div
                                                                    className="d-flex mt-3"
                                                                    key={
                                                                      goodsItem?._id
                                                                    }
                                                                  >
                                                                    <label className="fs-16 fw-500 text-black me-6 mt-3">
                                                                      {`${goodsItem?.name} bins`}
                                                                    </label>
                                                                    <div className="min-w-200px">
                                                                      <CustomSelectTable2
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
                                                                        // options=
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
                                                                          handleMultiSelectSubCategoryBinsChange(
                                                                            event,
                                                                            primaryIndex,
                                                                            subIndex,
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
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                          </div>
                                                          <Button
                                                            variant="primary"
                                                            className="ms-4 h-45px"
                                                            onClick={() => {
                                                              handleSaveCategoryZones(
                                                                subVal,
                                                                primaryVal?._id
                                                              );
                                                            }}
                                                            style={{
                                                              whiteSpace:
                                                                'nowrap',
                                                            }}
                                                            disabled={
                                                              subVal?._id ==
                                                              loadingId
                                                            }
                                                          >
                                                            {subVal?._id !==
                                                              loadingId && (
                                                              <span className="indicator-label">
                                                                Save
                                                              </span>
                                                            )}
                                                            {subVal?._id ==
                                                              loadingId && (
                                                              <span
                                                                className="indicator-progress"
                                                                style={{
                                                                  display:
                                                                    'block',
                                                                }}
                                                              >
                                                                Please wait...
                                                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                              </span>
                                                            )}
                                                          </Button>
                                                        </div>
                                                      </Col>
                                                      <Col
                                                        xs="auto"
                                                        className="ps-0"
                                                      >
                                                        <div className="my-0 float-end"></div>
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                  {currentCategories.category ===
                                                    primaryVal?._id &&
                                                  currentCategories?.subCategory ===
                                                    subVal?._id ? (
                                                    !productLoader ? (
                                                      productBatchData &&
                                                      productBatchData.length ? (
                                                        productBatchData.map(
                                                          (
                                                            productItem: any
                                                          ) => {
                                                            return (
                                                              <div
                                                                key={
                                                                  productItem?._id
                                                                }
                                                                className="bg-white min-h-80px ps-9 border-top-1 border border-top-black border-start-0 border-end-0 d-flex align-items-center justify-content-between"
                                                              >
                                                                <div>
                                                                  <span className="w-100 text-black fw-500 fs-16 ms-12">
                                                                    {
                                                                      productItem?.title
                                                                    }
                                                                  </span>
                                                                </div>
                                                                <Button
                                                                  variant="primary"
                                                                  className="h-45px me-4"
                                                                  style={{
                                                                    whiteSpace:
                                                                      'nowrap',
                                                                  }}
                                                                  onClick={() => {
                                                                    navigate(
                                                                      'assign',
                                                                      {
                                                                        state:
                                                                          productItem,
                                                                      }
                                                                    );
                                                                  }}
                                                                >
                                                                  {' '}
                                                                  Assign
                                                                  zones/bins
                                                                </Button>
                                                              </div>
                                                            );
                                                          }
                                                        )
                                                      ) : (
                                                        <div
                                                          className="bg-white min-h-80px ps-9 border-top-1 d-flex align-items-center justify-content-center fs-15 fw-500"
                                                        >
                                                          No product available
                                                        </div>
                                                      )
                                                    ) : (
                                                      <div className="text-center min-h-100px">
                                                        <Loader
                                                          loading={
                                                            productLoader
                                                          }
                                                        />
                                                      </div>
                                                    )
                                                  ) : (
                                                    <></>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )} */}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </Card.Body>
                      </Card>
                    </>
                  ) : (
                    !!selectedWareHouse.length && (
                      <>
                        {' '}
                        <Card className="border bg-f9f9f9 mb-9">
                          <Card.Body>
                            <div className="fs-18 fw-500 text-center min-h-50px">
                              No data available
                            </div>
                          </Card.Body>
                        </Card>
                      </>
                    )
                  )}
                </>
              )}
              {/* {!fetchLoader ? (
              <>
                {!loadingAreaData && loadingAreaData.length ? (
                  <Pagination
                    totalRecords={totalRecords}
                    currentPage={page}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )} */}
              {/* {!loading ? (
              <>
                {loadingAreaData && loadingAreaData.length ? (
                  <Col
                    xs={12}
                    className="pt-5"
                  >
                    <Row className="align-items-center g-3 ">
                      <Col xs="auto">
                        {Method.hasPermission(
                          WarehouseZone,
                          Add,
                          currentUser
                        ) ||
                        Method.hasPermission(
                          WarehouseZone,
                          Edit,
                          currentUser
                        ) ||
                        Method.hasPermission(
                          WarehouseZone,
                          Delete,
                          currentUser
                        ) ? (
                          <Button
                            variant="primary"
                            size="lg"
                            className="w-fit-content"
                            onClick={() => {
                              handleSave();
                            }}
                            disabled={isSubmitting || loading}
                          >
                            {!isSubmitting && (
                              <span className="indicator-label fs-16 fw-bold">
                                Save details
                              </span>
                            )}
                            {isSubmitting && (
                              <span
                                className="indicator-progress"
                                style={{ display: 'block' }}
                              >
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                              </span>
                            )}
                          </Button>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )} */}
            </>
          )}
        </>
      </Row>
    </>
  );
};
export default GoodsLoadingArea;
