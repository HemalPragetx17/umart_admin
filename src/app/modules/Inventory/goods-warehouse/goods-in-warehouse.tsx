import {
  Button,
  Card,
  Col,
  FormLabel,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import green from '../../../../umart_admin/assets/media/svg_uMart/green_dot.svg';
import gray from '../../../../umart_admin/assets/media/svg_uMart/gray_dot.svg';
import errorWarning from '../../../../umart_admin/assets/media/svg_uMart/error-warning.svg';
import { useEffect, useState } from 'react';
import { CustomSelectTable2 } from '../../../custom/Select/custom-select-table';
import React from 'react';
import {
  Actived,
  Add,
  AllProduct,
  Deactivated,
  Edit,
  GoodsInWarehouseConst,
  PAGE_LIMIT,
  Product,
  Units,
  View,
} from '../../../../utils/constants';
import APICallService from '../../../../api/apiCallService';
import clsx from 'clsx';
import Loader from '../../../../Global/loader';
import Pagination from '../../../../Global/pagination';
import {
  expiryJSON,
  expiryMonthsJSON,
  stockLastJSON,
} from '../../../../utils/staticJSON';
import Method from '../../../../utils/methods';
import { useAuth } from '../../auth';
import { InventoryString, String } from '../../../../utils/string';
import { KTSVG } from '../../../../umart_admin/helpers';
import {
  inventory,
  lowStockList,
  master,
  reports,
} from '../../../../api/apiEndPoints';
import { inventoryJSON } from '../../../../api/apiJSON/inventory';
import { IListStats } from '../../../../types/response_data/inventory';
import { QuantityType } from '../../../../types/response_data/inventory';
import { useDebounce } from '../../../../utils/useDebounce';
import { inventoryToast } from '../../../../utils/toast';
import { error, success } from '../../../../Global/toast';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import { listInventory } from '../../../../utils/storeString';
import PermissionModal from '../../../modals/permission-moda';
import ReportTypeModal from '../../../modals/report-type-modal';
const GoodsInWarehouse = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(getKey(listInventory.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listInventory.limit) || PAGE_LIMIT
  );
  const [fetchLoader, setFetchLoader] = useState(false);
  const [initLoader, setInitLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    getKey(listInventory.searchFilter) || ''
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [stats, setStatistics] = useState<IListStats>();
  const [products, setProducts] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState(
    getKey(listInventory.categoryFilter)?._id || ''
  );
  const [expiry, setExpiry] = useState(
    getKey(listInventory.expiryFilter) || ''
  );
  const [removedVariant, setRemovedVariant] = useState(false);
  const [primaryCategory, setPrimaryCategory] = useState<any>([]);
  const [totalCategory, setTotalCategory] = useState(0);
  const [pageCat, setPageCat] = useState(1);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<any>([]);
  const [forCastedDays, setForCastedDays] = useState(
    getKey(listInventory.stockDayFilter) || 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const productOptions = [
    {
      value: AllProduct,
      name: 'All products',
      label: (
        <>
          <span className="fs-16 fw-600 text-black mb-0">All products</span>
        </>
      ),
      title: 'All products',
    },
    {
      value: Actived,
      name: 'Active',
      label: (
        <>
          <img
            src={green}
            width={12}
            height={12}
            className="me-3"
            alt=""
          />
          <span className="fs-16 fw-600 text-black ">Active</span>
        </>
      ),
      title: 'Active',
    },
    {
      value: Deactivated,
      name: 'Deactivated',
      label: (
        <>
          <img
            src={gray}
            width={12}
            height={12}
            className="me-3"
            alt=""
          />
          <span className="fs-16 fw-600 text-black">Deactivated</span>
        </>
      ),
      title: 'Deactivated',
    },
  ];
  const [productState, setProductState] = useState<any>(
    getKey(listInventory.statusFilter)
      ? productOptions[getKey(listInventory.statusFilter) - 1]
      : productOptions[0]
  );
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [productZonesList, setProductZonesList] = useState<any>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedBin, setSelectedBin] = useState<any>(null);
  useEffect(() => {
    (async () => {
      setInitLoader(true);
      if (!Method.hasModulePermission(GoodsInWarehouseConst, currentUser)) {
        return window.history.back();
      }
      await Promise.all([
        fetchStats(),
        fetchInventoryProduct(
          page,
          pageLimit,
          expiry,
          productState.value,
          selectedCategory,
          removedVariant,
          searchTerm,
          forCastedDays
        ),
        fetchPrimaryCategory(1, 0, 1),
        fetchProductZones(),
      ]);
      // await fetchStats();
      // await fetchInventoryProduct(
      //   page,
      //   pageLimit,
      //   expiry,
      //   productState.value,
      //   selectedCategory,
      //   removedVariant,
      //   searchTerm,
      //   forCastedDays
      // );
      // await fetchPrimaryCategory(1, 0, 1);
      // await fetchProductZones();
      setInitLoader(false);
      setTimeout(() => {
        const pos = getKey(listInventory.inventoryScroll);
        window.scrollTo(0, pos);
      }, 600);
    })();
    removeKey('product');
  }, []);
  const fetchStats = async () => {
    let apiService = new APICallService(
      inventory.inventoryStats,
      {},
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    setStatistics(response);
  };
  const onMenuScrollToBottomCategory = async () => {
    if (!(primaryCategory.length === totalCategory)) {
      // setFetchLoader(true);
      let tempPage = pageCat;
      tempPage = tempPage + 1;
      setPageCat(tempPage);
      await fetchPrimaryCategory(tempPage, PAGE_LIMIT, 1);
    }
    setFetchLoader(false);
  };
  const fetchPrimaryCategory = async (
    pageNo: number,
    limit: number,
    categoriesDepth: number
  ) => {
    let params = {
      pageNo: pageNo,
      limit: limit,
      needCount: pageNo === 1 ? true : false,
      categoriesDepth: categoriesDepth,
    };
    let apiService = new APICallService(
      master.categoryList,
      params,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    let data: any = [...primaryCategory];
    if (response) {
      response.records.map((val: any) => {
        data.push({
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
        });
      });
      if (pageNo === 1) {
        setTotalCategory(response.total);
      } else {
        let prevTotal = totalCategory;
        setTotalCategory(prevTotal);
      }
    }
    setPrimaryCategory(data);
  };
  
  const fetchInventoryProduct = async (
    pageNo: number,
    limit: number,
    expiry: string,
    state: string,
    categories: any,
    viewRemovedOnly?: boolean,
    searchTerm?: string,
    forecastedDays?: number,
    zone?: any,
    bin?: any
  ) => {
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      state: state,
      expiry: expiry,
      categories: categories,
      viewRemovedOnly: viewRemovedOnly ? viewRemovedOnly : false,
      searchTerm: searchTerm ? searchTerm.trim() : '',
      forecastedDays: forecastedDays || 0,
    };
    if (zone) {
      params.zoneRef = zone;
    }
    if (bin) {
      params.binRef = bin;
    }
    setFetchLoader(true);
    let apiService = new APICallService(
      inventory.listInventoryProduct,
      inventoryJSON.listInventoryProduct(params),
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    if (response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      }
      setProducts(response.records);
    }
    setFetchLoader(false);
  };
  const fetchProductZones = async () => {
    setLoading(true);
    const params = {
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
    };
    const apiCallService = new APICallService(
      master.listProductZone,
      params,
      '',
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      let temp = response?.records?.map((item: any) => ({
        value: item?._id,
        label: item?.name,
        title: item?.name,
        bins: item?.bins
          ? item?.bins?.map((bin: any) => ({
              value: bin?._id,
              label: bin?.name,
              title: bin?.name,
            }))
          : [],
      }));
      setProductZonesList(temp);
    }
    setLoading(false);
  };
  useEffect(() => {
    let temp = { ...productState };
    if (temp.value === Actived) {
      temp.label = (
        <>
          <img
            src={green}
            width={12}
            height={12}
            className="me-3"
            alt=""
          />
          <span className="fs-16 fw-600 text-black mb-0">
            Active {totalRecords ? ' (' + totalRecords + ')' : ''}
          </span>
        </>
      );
    }
    if (temp.value === Deactivated) {
      temp.label = (
        <>
          <img
            src={gray}
            width={12}
            height={12}
            className="me-3"
            alt=""
          />
          <span className="fs-16 fw-600 text-black mb-0">
            Deactivated {totalRecords ? ' (' + totalRecords + ')' : ''}
          </span>
        </>
      );
    }
    setProductState(temp);
  }, [totalRecords]);
  const handleVariationShow = (variantionData: any, index: number) => {
    let temp: any = [...products];
    temp[index].showVariant = !temp[index].showVariant;
    setProducts(temp);
  };
  const debounce = useDebounce(fetchInventoryProduct, 300);
  const handleSearch = async (value: string) => {
    value = value.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    //const regex = /^(\w+( \w+)*)? ?$/;
    const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(value);
    if (!isValid) {
      return;
    }
    setSearchTerm(value);
    if (value.trim().length > 2 && searchTerm !== value) {
      setPage(1);
      setKey(listInventory.page, 1);
      setLoading(true);
      setTotalRecords(0);
      setProducts([]);
      await debounce(
        1,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        value,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
      //await fetchProducts(1, pageLimit, productState, categories, input);
    } else if (value.trim().length <= 2 && value.length < searchTerm.length) {
      setPage(1);
      setKey(listInventory.page, 1);
      setLoading(true);
      setTotalRecords(0);
      setProducts([]);
      await debounce(
        1,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        value,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
      // await fetchProducts(1, pageLimit, productState, categories, input);
    }
    setKey(listInventory.searchFilter, value);
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    if (input.trim().length > 2 && !isCtrlPressed) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      setProducts([]);
      await fetchInventoryProduct(
        page,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        input,
        forCastedDays
      );
      setLoading(false);
    } else if (
      input.trim().length <= 2 &&
      (charCode === 46 || charCode === 8)
    ) {
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      setProducts([]);
      await fetchInventoryProduct(
        page,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        input,
        forCastedDays
      );
      setLoading(false);
    }
    if (isCtrlPressed && event.key === 'x') {
      // setSearch('');
      setPage(1);
      setLoading(true);
      setTotalRecords(0);
      setProducts([]);
      await fetchInventoryProduct(
        page,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        '',
        forCastedDays
      );
      setLoading(false);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setFetchLoader(true);
    setPage(val);
    setKey(listInventory.page, val);
    await fetchInventoryProduct(
      val,
      pageLimit,
      expiry,
      productState.value,
      selectedCategory,
      removedVariant,
      searchTerm,
      forCastedDays,
      selectedZone?.value,
      selectedBin?.value
    );
    setFetchLoader(false);
  };
  const handleNextPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val + 1);
    setKey(listInventory.page, val + 1);
    await fetchInventoryProduct(
      val + 1,
      pageLimit,
      expiry,
      productState.value,
      selectedCategory,
      removedVariant,
      searchTerm,
      forCastedDays,
      selectedZone?.value,
      selectedBin?.value
    );
    setFetchLoader(false);
  };
  const handlePreviousPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val - 1);
    setKey(listInventory.page, val - 1);
    await fetchInventoryProduct(
      val - 1,
      pageLimit,
      expiry,
      productState.value,
      selectedCategory,
      removedVariant,
      searchTerm,
      forCastedDays,
      selectedZone?.value,
      selectedBin?.value
    );
    setFetchLoader(false);
  };
  const handlePageLimit = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setKey(listInventory.page, 1);
    setTotalRecords(0);
    setKey(listInventory.limit, parseInt(event.target.value));
    setProducts([]);
    await setPageLimit(parseInt(event.target.value));
    await fetchInventoryProduct(
      1,
      event.target.value,
      expiry,
      productState.value,
      selectedCategory,
      removedVariant,
      searchTerm,
      forCastedDays,
      selectedZone?.value,
      selectedBin?.value
    );
    setFetchLoader(false);
  };
  const handleExpiry = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setKey(listInventory.page, 1);
    setTotalRecords(0);
    if (event) {
      setKey(listInventory.expiryFilter, event.value);
      if (event.value === '-3') {
        setExpiry(event.value);
        setRemovedVariant(true);
        await fetchInventoryProduct(
          1,
          pageLimit,
          event.value,
          productState.value,
          selectedCategory,
          true,
          searchTerm,
          forCastedDays,
          selectedZone?.value,
          selectedBin?.value
        );
      } else {
        setRemovedVariant(false);
        setExpiry(event.value);
        await fetchInventoryProduct(
          1,
          pageLimit,
          event.value,
          productState.value,
          selectedCategory,
          removedVariant,
          searchTerm,
          forCastedDays,
          selectedZone?.value,
          selectedBin?.value
        );
      }
    } else {
      setExpiry('');
      setRemovedVariant(false);
      removeKey(listInventory.expiryFilter);
      await fetchInventoryProduct(
        1,
        pageLimit,
        '',
        productState.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
    }
    setFetchLoader(false);
  };
  const handleProductState = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setTotalRecords(0);
    setKey(listInventory.page, 1);
    setKey(listInventory.statusFilter, event.value);
    if (event) {
      setProductState(event);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        event.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
    } else {
      setProductState({});
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        '',
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
    }
    setFetchLoader(false);
  };
  const handlePrimaryCategoryChange = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setKey(listInventory.page, 1);
    setTotalRecords(0);
    if (event) {
      setSelectedCategory(event._id);
      setKey(listInventory.categoryFilter, event);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState.value,
        event._id,
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
    } else {
      setSelectedCategory('');
      removeKey(listInventory.categoryFilter);
      await fetchInventoryProduct(
        page,
        pageLimit,
        expiry,
        productState.value,
        '',
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value,
        selectedBin?.value
      );
    }
    setFetchLoader(false);
  };
  const handleExpiryRemainder = async (
    event: any,
    id: string,
    isProduct: boolean,
    index: number,
    variantIndex: number
  ) => {
    let params = {
      days: (event.value * 30).toString(),
    };
    let apiService = new APICallService(
      inventory.variantRemainder,
      inventoryJSON.updateVariantInventoryRemainder(params),
      { id: id },
      '',
      false,
      '',
      GoodsInWarehouseConst
    );
    let response = await apiService.callAPI();
    if (response) {
      let temp = [...products];
      if (isProduct) {
        temp[index].variants[0].inventoryInfo = {
          ...temp[index].variants[0].inventoryInfo,
          reference: {
            reminder: {
              active: true,
              days: event.value * 30,
            },
          },
        };
      } else {
        temp[index].variants[variantIndex].inventoryInfo = {
          ...temp[index].variants[variantIndex].inventoryInfo,
          reference: {
            reminder: {
              active: true,
              days: event.value * 30,
            },
          },
        };
      }
      setProducts(temp);
    }
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black border-r5px  text-white">
        <span>Under Development</span>
      </Popover.Body>
    </Popover>
  );
  const handleCheckboxChange = (event: any, item: any, index: number) => {
    let tempData: any = [...selectedVariants];
    if (event.target.checked) {
      const tempVariants = item.map((val: any) => val?._id);
      // tempData.push(item?.variant?._id);
      tempData = [...tempData, ...tempVariants];
    } else {
      item.map((itemVal: any) => {
        tempData = tempData.filter((val: any) => val !== itemVal?._id);
      });
    }
    setSelectedVariants(tempData);
  };
  const handleSubmitList = async () => {
    if (selectedVariants.length > 0) {
      if (forCastedDays > 0) {
        setIsSubmitting(true);
        const apiService = new APICallService(
          lowStockList.addLowStock,
          inventoryJSON.addLowStocks({
            variants: selectedVariants,
            forecastDays: forCastedDays,
          }),
          '',
          '',
          false,
          '',
          GoodsInWarehouseConst
        );
        const response = await apiService.callAPI();
        if (response) {
          success(inventoryToast.lowStockListAdded);
          navigate('/inventory/low-stock-list');
        }
        setShowCheckBox(false);
        setSelectedVariants([]);
        setIsSubmitting(false);
      } else {
        error(inventoryToast.selectForCastedDays);
      }
    } else {
      setShowCheckBox(true);
    }
  };
  const isMasterChecked = (variants: any, item: any) => {
    const temp = item.every((val: any) => variants.includes(val._id));
    return temp;
  };
  const handleForCastDaysFilter = async (event: any) => {
    setPage(1);
    setKey(listInventory.page, 1);
    setTotalRecords(0);
    if (event) {
      setKey(listInventory.stockDayFilter, event.value);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        event.value,
        selectedZone?.value,
        selectedBin?.value
      );
      setForCastedDays(event.value);
    } else {
      removeKey(listInventory.stockDayFilter);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        undefined,
        selectedZone?.value,
        selectedBin?.value
      );
      setForCastedDays(0);
    }
  };
  const handleDownload = async (downloadAsPdf: boolean) => {
    setIsDownloading(true);
    const apiService = new APICallService(
      reports.inventoryReport,
      {
        utcOffset: new Date().getTimezoneOffset(),
        reportFormatType: downloadAsPdf ? 'pdf' : 'excel',
      },
      undefined,
      'blob',
      false,
      '',
      GoodsInWarehouseConst
    );
    const response = await apiService.callAPI();
    if (response) {
      // setInvoice(response);
      let blob: Blob;
      if (downloadAsPdf) {
        blob = new Blob([response], { type: 'application/pdf' });
      } else {
        blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      }
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      let fileName = 'Inventory_report';
      if (downloadAsPdf) {
        fileName += '.pdf';
      } else {
        fileName += '.xlsx';
      }
      downloadLink.download = fileName;
      downloadLink.click();
      setShowReportModal(false);
    }
    setIsDownloading(false);
  };
  const handleZone = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setTotalRecords(0);
    setKey(listInventory.page, 1);
    setSelectedBin(null);
    // setKey(listInventory.statusFilter, event.value);
    if (event) {
      setSelectedZone(event);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState?.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays,
        event?.value
      );
    } else {
      setSelectedZone(undefined);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState?.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays
      );
    }
    setFetchLoader(false);
  };
  const handleBin = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setTotalRecords(0);
    setKey(listInventory.page, 1);
    // setKey(listInventory.statusFilter, event.value);
    if (event) {
      setSelectedBin(event);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState?.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value,
        event?.value
      );
    } else {
      setSelectedBin(null);
      await fetchInventoryProduct(
        1,
        pageLimit,
        expiry,
        productState?.value,
        selectedCategory,
        removedVariant,
        searchTerm,
        forCastedDays,
        selectedZone?.value
      );
    }
    setFetchLoader(false);
  };
  return (
    <>
      {showReportModal && (
        <ReportTypeModal
          show={showReportModal}
          onHide={() => {
            setShowReportModal(false);
          }}
          onSubmit={async (downloadAsPdf: boolean) => {
            await handleDownload(downloadAsPdf);
          }}
        />
      )}
      {showPermissionModal ? (
        <PermissionModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          moduleName="All Products"
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center">
        <Col
          xs
          className="align-self-center mb-5"
        >
          <h1 className="fs-22 fw-bolder mb-0">{InventoryString.goodsTitle}</h1>
        </Col>
        <Col
          xs={'auto'}
          className="text-right mb-5"
        >
          {Method.hasPermission(GoodsInWarehouseConst, Add, currentUser) ? (
            <Link
              to="/inventory/add-goods-in-inventory"
              className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
              state={{ requestId: undefined }}
            >
              {InventoryString.addButton}
            </Link>
          ) : (
            <></>
          )}
        </Col>
        {!initLoader && (
          <Col
            xs="auto"
            className="text-right mb-5"
          >
            <Button
              variant="primary"
              disabled={isDownloading}
              className="btn-lg"
              onClick={() => {
                // handleDownload();
                setShowReportModal(true);
              }}
            >
              {!isDownloading && (
                <span className="indicator-label fs-16 fw-bold">
                  {'Download Report'}
                </span>
              )}
              {isDownloading && (
                <span
                  className="indicator-progress fs-16 fw-bold"
                  style={{ display: 'block' }}
                >
                  {String.pleaseWait}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </Button>
          </Col>
        )}
        {!initLoader ? (
          <>
            <Col
              xs={12}
              className="mb-7"
            >
              <Row className="g-6">
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-fff4d9 rounded py-4 px-5">
                    <div className="d-flex align-items-center">
                      <div className="fs-20 fw-bolder">
                        {stats?.loadingAreaCount}
                      </div>
                    </div>
                    <div className="fw-500 fs-16">
                      {InventoryString.numLoading}
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-ccf3f0 rounded py-4 px-5">
                    <div className="d-flex align-items-center">
                      <div className="fs-20 fw-bolder">
                        {stats?.categoryCount}
                      </div>
                    </div>
                    <div className="fw-500 fs-16">
                      {InventoryString.numCategory}
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-d4e1fc rounded py-4 px-5">
                    <div className="d-flex align-items-center">
                      <div className="fs-20 fw-bolder">
                        {stats?.productObj?.products} {String.products}
                      </div>
                    </div>
                    <div className="fw-500 fs-16">
                      {InventoryString.productsAvailable}
                    </div>
                  </div>
                </Col>
                <Col
                  xl={3}
                  md={6}
                  sm={4}
                >
                  <div className="border-r8px bg-ccebfd rounded py-4 px-5">
                    <div className="d-flex align-items-center">
                      <div className="fs-20 fw-bolder">
                        {Method.formatCurrency(
                          stats?.productObj.quantityTypes.reduce(
                            (pSum: any, curr: QuantityType, index: number) =>
                              curr.stockCount + pSum,
                            0
                          ) || 0
                        )}{' '}
                        {String.unit}
                      </div>
                    </div>
                    <div className="fw-500 fs-16">
                      {InventoryString.unitsAvailable}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Card className="bg-light border mb-7">
                <Card.Body className="px-7">
                  <Row className="align-items-center g-5">
                    <Col
                      md={4}
                      lg={4}
                      xl={3}
                    >
                      <FormLabel className="fs-16 fw-500 text-dark">
                        {InventoryString.filterCategory}
                      </FormLabel>
                      <CustomSelectWhite
                        // disabled={loading}
                        placeholder={'Select category name'}
                        isLoading={fetchLoader}
                        options={primaryCategory.map((item: any) => {
                          return {
                            ...item,
                            title: item.name,
                          };
                        })}
                        value={primaryCategory
                          .map((item: any) => {
                            return {
                              ...item,
                              title: item.name,
                            };
                          })
                          .find((item: any) => item._id === selectedCategory)}
                        loadingMessage={'Fetching Data'}
                        isMulti={false}
                        onMenuScrollToBottom={onMenuScrollToBottomCategory}
                        onChange={(event: any) => {
                          handlePrimaryCategoryChange(event);
                        }}
                        isClearable={true}
                      />
                    </Col>
                    <Col
                      md={4}
                      lg={4}
                      xl={3}
                    >
                      {
                        <>
                          {' '}
                          <FormLabel className="fs-16 fw-500 text-dark">
                            {InventoryString.filterProduct}
                          </FormLabel>
                          <CustomSelectWhite
                            placeholder={'Select product status'}
                            defaultValue={[
                              {
                                value: AllProduct,
                                name: 'All products',
                                label: (
                                  <>
                                    <span className="fs-16 fw-600 text-black mb-0">
                                      All products
                                    </span>
                                  </>
                                ),
                              },
                            ]}
                            onChange={(event: any) => {
                              handleProductState(event);
                            }}
                            isSearchable={false}
                            options={productOptions}
                            value={productState}
                          />
                        </>
                      }
                    </Col>
                    <Col
                      md={4}
                      lg={4}
                      xl={3}
                    >
                      <FormLabel className="fs-16 fw-500 text-dark">
                        {InventoryString.filterExpiry}
                      </FormLabel>
                      <CustomSelectWhite
                        placeholder={'Select by expiry date'}
                        onChange={(event: any) => {
                          handleExpiry(event);
                        }}
                        isSearchable={false}
                        value={expiryJSON.find((item) => item.value === expiry)}
                        options={expiryJSON}
                        isClearable={expiry ? true : false}
                      />
                    </Col>
                    <Col
                      md={4}
                      lg={4}
                      xl={3}
                    >
                      <FormLabel className="fs-16 fw-500 text-dark">
                        {InventoryString.filterStockLastFor}
                      </FormLabel>
                      <CustomSelectWhite
                        placeholder={'Select days'}
                        onChange={(event: any) => {
                          handleForCastDaysFilter(event);
                        }}
                        value={stockLastJSON.find(
                          (item) => item.value === forCastedDays
                        )}
                        isSearchable={false}
                        options={stockLastJSON}
                        isClearable={true}
                      />
                    </Col>
                    <Col
                      md={4}
                      lg={4}
                      xl={3}
                    >
                      {
                        <>
                          {' '}
                          <FormLabel className="fs-16 fw-500 text-dark">
                            {'Filer by zones'}
                          </FormLabel>
                          <CustomSelectWhite
                            placeholder={'Select zones'}
                            onChange={(event: any) => {
                              handleZone(event);
                            }}
                            isSearchable={true}
                            options={productZonesList}
                            // value={productState}
                            isClearable={true}
                          />
                        </>
                      }
                    </Col>
                    {selectedZone && (
                      <Col
                        md={4}
                        lg={4}
                        xl={3}
                      >
                        {
                          <>
                            {' '}
                            <FormLabel className="fs-16 fw-500 text-dark">
                              {'Filer by bins'}
                            </FormLabel>
                            <CustomSelectWhite
                              placeholder={'Select bins'}
                              onChange={(event: any) => {
                                handleBin(event);
                              }}
                              isSearchable={true}
                              options={selectedZone?.bins || []}
                              value={selectedBin}
                              isClearable={true}
                            />
                          </>
                        }
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              {/* TODO remove overlay */}
              <div className="d-flex flex-column flex-md-row my-3 py-2 mb-4 justify-content-md-between align-items-md-center">
                <h2 className="fs-22 mb-5 mb-md-0 fw-700">{`${
                  totalRecords || 0
                } products available`}</h2>
                <div className="d-flex ">
                  <div className="d-flex align-items-center position-relative me-4">
                    <KTSVG
                      path="/media/icons/duotune/general/gen021.svg"
                      className="svg-icon-3 position-absolute ms-3"
                    />
                    <input
                      type="text"
                      id="kt_filter_search"
                      className="form-control form-control-white min-h-50px form-control-lg ps-10 custom-placeholder"
                      placeholder="Search by product name…"
                      onChange={(event: any) => {
                        handleSearch(event.target.value.trimStart());
                      }}
                      value={searchTerm}
                      //  onKeyUp={handleOnKeyUp}
                    />
                  </div>
                  {Method.hasPermission(
                    GoodsInWarehouseConst,
                    Add,
                    currentUser
                  ) ? (
                    <>
                      {!showCheckBox || selectedVariants.length > 0 ? (
                        <Button
                          variant="primary"
                          className="me-3  fs-16 fw-600"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          disabled={isSubmitting}
                          onClick={handleSubmitList}
                        >
                          {!isSubmitting && (
                            <span className="indicator-label fs-16 fw-bold">
                              {selectedVariants.length > 0
                                ? `Add ${selectedVariants.length} product${
                                    selectedVariants.length > 1 ? 's' : ''
                                  } to low stock list`
                                : InventoryString.addGoodsToLowStock}
                            </span>
                          )}
                          {isSubmitting && (
                            <span
                              className="indicator-progress fs-16 fw-bold"
                              style={{ display: 'block' }}
                            >
                              Please wait...
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="light"
                          className="me-3  fs-16 fw-600"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          onClick={() => setShowCheckBox(false)}
                        >
                          {'Cancel'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <Card className="border border-r10px">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table table-rounded table-row-bordered align-middle gs-7 gy-4 mb-0">
                      <thead>
                        <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                          <th className="min-w-300px">
                            {/* {showCheckBox ? (
                              <span className="me-3">
                                <input
                                  className={clsx(
                                    'form-check-input pt-1 h-30px w-30px  me-3 '
                                    // selectedVariants?.includes(
                                    //   productVal?.variants[0]?.variant?._id
                                    // )
                                    //   ? 'border border-5 border-primary'
                                    //   : ''
                                  )}
                                  type="checkbox"
                                  name="fullRefund"
                                  // checked={
                                  //   refundData.variants[index]
                                  //     .refundType ===
                                  //   FullRefund
                                  // }
                                  onChange={(event) => {
                                    // handleCheckboxChange(
                                    //   event,
                                    //   productVal.variants[0],
                                    //   index
                                    // );
                                  }}
                                />{' '}
                              </span>
                            ) : (
                              <></>
                            )} */}
                            <span>{InventoryString.tableHeadingProduct}</span>
                          </th>
                          <th className="min-w-200px">
                            {expiry === '-1'
                              ? 'Expired stock'
                              : 'Available stock'}
                          </th>
                          <th className="min-w-200px">
                            {expiry ? (
                              expiry === '-1' ? (
                                'Expired before'
                              ) : (
                                <>Expiry info</>
                              )
                            ) : (
                              <th>
                                {InventoryString.tableHeadingStock}{' '}
                                <br className="br" />{' '}
                                {InventoryString.tableHeadingNotify}
                              </th>
                            )}
                          </th>
                          <th className="min-w-225px text-end"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {!fetchLoader ? (
                          <>
                            <></>
                            {products && products.length ? (
                              <>
                                {products.map(
                                  (productVal: any, index: number) => {
                                    return (
                                      <>
                                        {productVal.variants.length > 0 && (
                                          <tr>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                {showCheckBox ? (
                                                  <div className="me-3">
                                                    <input
                                                      className={clsx(
                                                        'form-check-input pt-1 h-30px w-30px  me-3 ',
                                                        isMasterChecked(
                                                          selectedVariants,
                                                          productVal.variants
                                                        )
                                                          ? 'border border-5 border-primary'
                                                          : ''
                                                      )}
                                                      type="checkbox"
                                                      name="fullRefund"
                                                      checked={isMasterChecked(
                                                        selectedVariants,
                                                        productVal.variants
                                                      )}
                                                      onChange={(event) => {
                                                        handleCheckboxChange(
                                                          event,
                                                          productVal.variants,
                                                          index
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                ) : (
                                                  <></>
                                                )}
                                                <div
                                                  className={clsx(
                                                    'symbol symbol-50px border me-5 ',
                                                    productVal.variants
                                                      .length &&
                                                      productVal?.variants[0]
                                                        ?.inventoryInfo
                                                        ?.quantityTypes?.length
                                                      ? productVal.variants[0]
                                                          .expiryInfo
                                                          ?.expiring &&
                                                        productVal.variants[0]
                                                          .expiryInfo?.expiring
                                                          .quantityTypes.length
                                                        ? productVal.variants[0].expiryInfo?.expiring.quantityTypes.filter(
                                                            (x: any) =>
                                                              productVal.variants[0].inventoryInfo.quantityTypes.some(
                                                                (y: any) =>
                                                                  y.type ===
                                                                  x.type
                                                              )
                                                          ).length
                                                          ? 'position-relative'
                                                          : ''
                                                        : ''
                                                      : ''
                                                  )}
                                                >
                                                  {productVal.variants.length &&
                                                  productVal.variants[0]
                                                    .inventoryInfo.quantityTypes
                                                    .length ? (
                                                    productVal.variants[0]
                                                      .expiryInfo?.expiring &&
                                                    productVal.variants[0]
                                                      .expiryInfo?.expiring
                                                      .quantityTypes.length &&
                                                    Method.dayDifference(
                                                      new Date().toDateString(),
                                                      productVal.variants[0]
                                                        .expiryInfo.expiring
                                                        .minDate
                                                    ) <=
                                                      productVal?.variants[0]
                                                        ?.inventoryInfo
                                                        ?.reference?.reminder
                                                        ?.days ? (
                                                      productVal.variants[0].expiryInfo?.expiring.quantityTypes.filter(
                                                        (x: any) =>
                                                          productVal.variants[0].inventoryInfo.quantityTypes.some(
                                                            (y: any) =>
                                                              y.type === x.type
                                                          )
                                                      ).length ? (
                                                        <div className="position-absolute start-0 bottom-0 m-n2">
                                                          <img
                                                            className="error-icon"
                                                            src={errorWarning}
                                                            alt=""
                                                          />
                                                        </div>
                                                      ) : (
                                                        ''
                                                      )
                                                    ) : (
                                                      ''
                                                    )
                                                  ) : (
                                                    ''
                                                  )}
                                                  <img
                                                    src={Method.getProductMedia(
                                                      productVal,
                                                      true,
                                                      false
                                                    )}
                                                    className="object-fit-contain"
                                                    alt=""
                                                  />
                                                </div>
                                                <div className="d-flex flex-column">
                                                  <span className="fs-15 fw-600">
                                                    {productVal.title}
                                                  </span>
                                                  <span className="fs-14 fw-500">
                                                    {productVal.skuNumber}
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              {productVal.variants.length &&
                                              productVal.variants[0][
                                                'variantType'
                                              ][0] !== undefined ? (
                                                <span className="fs-20 fw-600">
                                                  -
                                                </span>
                                              ) : (
                                                <>
                                                  <OverlayTrigger
                                                    trigger="hover"
                                                    placement="bottom"
                                                    overlay={
                                                      (productVal.variants
                                                        .length &&
                                                        productVal.variants[0]
                                                          ?.expiryInfo
                                                          ?.expired &&
                                                        productVal.variants[0]
                                                          .expiryInfo?.expired
                                                          .quantityTypes
                                                          .length &&
                                                        (productVal.variants[0]
                                                          ?.expiryInfo?.expired
                                                          .maxDate ||
                                                          productVal.variants[0]
                                                            ?.expiryInfo
                                                            ?.expired
                                                            .minDate)) ||
                                                      (productVal.variants
                                                        .length &&
                                                        productVal.variants[0]
                                                          ?.expiryInfo
                                                          ?.expiring &&
                                                        productVal.variants[0]
                                                          ?.expiryInfo?.expiring
                                                          .quantityTypes
                                                          .length &&
                                                        (productVal.variants[0]
                                                          ?.expiryInfo?.expiring
                                                          .maxDate ||
                                                          productVal.variants[0]
                                                            ?.expiryInfo
                                                            ?.expiring
                                                            .minDate)) ? (
                                                        <Popover id="popover-basic">
                                                          <Popover.Body className="p-2 bg-white border-r10px text-dark">
                                                            <span>
                                                              {((productVal
                                                                .variants[0]
                                                                .expiryInfo
                                                                ?.expiring &&
                                                                productVal
                                                                  .variants[0]
                                                                  .expiryInfo
                                                                  ?.expiring
                                                                  .quantityTypes
                                                                  .length) ||
                                                                (productVal
                                                                  .variants[0]
                                                                  .expiryInfo
                                                                  ?.expired &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired
                                                                    .quantityTypes
                                                                    .length)) && (
                                                                <span className="fs-12 fw-bold text-center">
                                                                  {productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expiring &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expiring
                                                                    .quantityTypes
                                                                    .length &&
                                                                  Method.dayDifference(
                                                                    new Date().toDateString(),
                                                                    productVal
                                                                      .variants[0]
                                                                      .expiryInfo
                                                                      .expiring
                                                                      .minDate
                                                                  ) <=
                                                                    productVal
                                                                      ?.variants[0]
                                                                      ?.inventoryInfo
                                                                      ?.reference
                                                                      ?.reminder
                                                                      ?.days ? (
                                                                    <>
                                                                      <span className="text-warning">
                                                                        {productVal.variants[0]?.expiryInfo?.expiring.quantityTypes.map(
                                                                          (
                                                                            quantVal: any,
                                                                            index: number
                                                                          ) => (
                                                                            <React.Fragment
                                                                              key={
                                                                                index
                                                                              }
                                                                            >
                                                                              {index !==
                                                                              0
                                                                                ? ' , '
                                                                                : ''}
                                                                              {
                                                                                quantVal.stockCount
                                                                              }{' '}
                                                                              {quantVal.type ===
                                                                              Units
                                                                                ? quantVal.stockCount <=
                                                                                  1
                                                                                  ? String.singleUnit
                                                                                  : String.unit
                                                                                : ''}
                                                                            </React.Fragment>
                                                                          )
                                                                        )}{' '}
                                                                        {Method.dayDifference(
                                                                          productVal
                                                                            .variants[0]
                                                                            .expiryInfo
                                                                            ?.expiring
                                                                            .minDate,
                                                                          productVal
                                                                            .variants[0]
                                                                            .expiryInfo
                                                                            ?.expiring
                                                                            .maxDate
                                                                        ) > 1
                                                                          ? ` are
                                                      expiring
                                                      in between 
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[0]
                                                          .expiryInfo?.expiring
                                                          .minDate
                                                      )}
                                                      -
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[0]
                                                          .expiryInfo?.expiring
                                                          .maxDate
                                                      )}`
                                                                          : `are
                                                      expiring
                                                       on
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[0]
                                                          .expiryInfo?.expiring
                                                          .minDate
                                                      )}`}
                                                                        {'. '}
                                                                      </span>
                                                                    </>
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                  {productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired
                                                                    .quantityTypes
                                                                    .length &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expiring &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expiring
                                                                    .quantityTypes
                                                                    .length ? (
                                                                    <>
                                                                      <br />
                                                                      <div className="separator mb-3 mt-3 opacity-75"></div>
                                                                    </>
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                  {productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired
                                                                    .quantityTypes
                                                                    .length ? (
                                                                    <>
                                                                      <span className="text-danger">
                                                                        {productVal.variants[0]?.expiryInfo?.expired.quantityTypes.map(
                                                                          (
                                                                            quantVal: any,
                                                                            index: number
                                                                          ) => (
                                                                            <React.Fragment
                                                                              key={
                                                                                index
                                                                              }
                                                                            >
                                                                              {index !==
                                                                              0
                                                                                ? ' , '
                                                                                : ''}
                                                                              {
                                                                                quantVal.stockCount
                                                                              }{' '}
                                                                              {quantVal.type ===
                                                                              Units
                                                                                ? quantVal.stockCount <=
                                                                                  1
                                                                                  ? String.singleUnit
                                                                                  : String.unit
                                                                                : ''}
                                                                            </React.Fragment>
                                                                          )
                                                                        )}{' '}
                                                                        {Method.dayDifference(
                                                                          productVal
                                                                            .variants[0]
                                                                            .expiryInfo
                                                                            ?.expired
                                                                            .minDate,
                                                                          productVal
                                                                            .variants[0]
                                                                            .expiryInfo
                                                                            ?.expired
                                                                            .maxDate
                                                                        ) > 1
                                                                          ? `are
                                                      expired in
                                                      between
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[0]
                                                          .expiryInfo?.expired
                                                          .minDate
                                                      )}
                                                      -
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[0]
                                                          .expiryInfo?.expired
                                                          .maxDate
                                                      )}`
                                                                          : `are
                                                      expired on 
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[0]
                                                          .expiryInfo?.expired
                                                          .minDate
                                                      )}`}
                                                                        {'.'}
                                                                      </span>
                                                                    </>
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                </span>
                                                              )}
                                                            </span>
                                                          </Popover.Body>
                                                        </Popover>
                                                      ) : (
                                                        <></>
                                                      )
                                                    }
                                                  >
                                                    <span>
                                                      {productVal.variants
                                                        .length &&
                                                      productVal.variants[0]
                                                        ?.inventoryInfo
                                                        .quantityTypes
                                                        .length ? (
                                                        <>
                                                          {expiry !== '-1' ? (
                                                            <>
                                                              {productVal.variants[0]?.inventoryInfo.quantityTypes.map(
                                                                (
                                                                  quantVal: any,
                                                                  quantIndex: number
                                                                ) => {
                                                                  return (
                                                                    <>
                                                                      <span
                                                                        className={clsx(
                                                                          'fs-15 fw-600',
                                                                          (productVal
                                                                            .variants[0]
                                                                            .expiryInfo
                                                                            ?.expired &&
                                                                            productVal
                                                                              .variants[0]
                                                                              .expiryInfo
                                                                              ?.expired
                                                                              .quantityTypes
                                                                              .length) ||
                                                                            (productVal
                                                                              .variants[0]
                                                                              .expiryInfo
                                                                              ?.expiring &&
                                                                              productVal
                                                                                .variants[0]
                                                                                .expiryInfo
                                                                                ?.expiring
                                                                                .quantityTypes
                                                                                .length)
                                                                            ? productVal
                                                                                .variants[0]
                                                                                .expiryInfo
                                                                                ?.expired &&
                                                                              productVal.variants[0]?.expiryInfo?.expired.quantityTypes.some(
                                                                                (
                                                                                  a: any
                                                                                ) =>
                                                                                  a.type ===
                                                                                  quantVal.type
                                                                              ) &&
                                                                              expiry !==
                                                                                '0'
                                                                              ? 'text-danger'
                                                                              : productVal
                                                                                  .variants[0]
                                                                                  ?.expiryInfo
                                                                                  ?.expiring &&
                                                                                productVal.variants[0].expiryInfo?.expiring.quantityTypes.some(
                                                                                  (
                                                                                    a: any
                                                                                  ) =>
                                                                                    a.type ===
                                                                                    quantVal.type
                                                                                ) &&
                                                                                Method.dayDifference(
                                                                                  new Date().toDateString(),
                                                                                  productVal
                                                                                    .variants[0]
                                                                                    .expiryInfo
                                                                                    .expiring
                                                                                    .minDate
                                                                                ) <=
                                                                                  productVal
                                                                                    ?.variants[0]
                                                                                    ?.inventoryInfo
                                                                                    ?.reference
                                                                                    ?.reminder
                                                                                    ?.days
                                                                              ? 'text-warning'
                                                                              : ''
                                                                            : ''
                                                                        )}
                                                                      >
                                                                        {quantIndex !==
                                                                        0
                                                                          ? ', '
                                                                          : ''}
                                                                        {
                                                                          quantVal.stockCount
                                                                        }{' '}
                                                                        {quantVal.type ===
                                                                        Units
                                                                          ? quantVal.stockCount <=
                                                                            1
                                                                            ? String.singleUnit
                                                                            : String.unit
                                                                          : ''}
                                                                      </span>
                                                                    </>
                                                                  );
                                                                }
                                                              )}
                                                            </>
                                                          ) : (
                                                            <>
                                                              {((productVal
                                                                .variants[0]
                                                                .expiryInfo
                                                                ?.expiring &&
                                                                productVal
                                                                  .variants[0]
                                                                  .expiryInfo
                                                                  ?.expiring
                                                                  .quantityTypes
                                                                  .length) ||
                                                                (productVal
                                                                  .variants[0]
                                                                  .expiryInfo
                                                                  ?.expired &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired
                                                                    .quantityTypes
                                                                    .length)) && (
                                                                <span className="fs-15 fw-600">
                                                                  {productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired &&
                                                                  productVal
                                                                    .variants[0]
                                                                    .expiryInfo
                                                                    ?.expired
                                                                    .quantityTypes
                                                                    .length ? (
                                                                    <>
                                                                      <span className="text-dark">
                                                                        {productVal.variants[0]?.expiryInfo?.expired.quantityTypes.map(
                                                                          (
                                                                            quantVal: any,
                                                                            index: number
                                                                          ) => (
                                                                            <React.Fragment
                                                                              key={
                                                                                index
                                                                              }
                                                                            >
                                                                              {index !==
                                                                              0
                                                                                ? ' , '
                                                                                : ''}
                                                                              {
                                                                                quantVal.stockCount
                                                                              }{' '}
                                                                              {quantVal.type ===
                                                                              Units
                                                                                ? quantVal.stockCount <=
                                                                                  1
                                                                                  ? String.singleUnit
                                                                                  : String.unit
                                                                                : ''}
                                                                            </React.Fragment>
                                                                          )
                                                                        )}{' '}
                                                                      </span>
                                                                    </>
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                </span>
                                                              )}
                                                            </>
                                                          )}
                                                          {productVal
                                                            .variants[0]
                                                            ?.inventoryInfo
                                                            .quantityTypes[0]
                                                            ?.forecastedDays ? (
                                                            <em
                                                              className={clsx(
                                                                'fs-15 d-block fw-500'
                                                              )}
                                                            >
                                                              Stock left for
                                                              <span
                                                                className={clsx(
                                                                  productVal
                                                                    .variants[0]
                                                                    ?.inventoryInfo
                                                                    .quantityTypes[0]
                                                                    ?.forecastedDays
                                                                    ? productVal
                                                                        .variants[0]
                                                                        ?.inventoryInfo
                                                                        .quantityTypes[0]
                                                                        ?.forecastedDays <=
                                                                      forCastedDays
                                                                      ? 'text-danger'
                                                                      : ''
                                                                    : ''
                                                                )}
                                                              >
                                                                {` ${
                                                                  productVal
                                                                    .variants[0]
                                                                    ?.inventoryInfo
                                                                    .quantityTypes[0]
                                                                    ?.forecastedDays
                                                                    ? productVal
                                                                        .variants[0]
                                                                        ?.inventoryInfo
                                                                        .quantityTypes[0]
                                                                        ?.forecastedDays +
                                                                      ' days'
                                                                    : ''
                                                                }`}
                                                              </span>
                                                            </em>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </>
                                                      ) : (
                                                        <span className="fs-20 fw-600">
                                                          -
                                                        </span>
                                                      )}
                                                    </span>
                                                  </OverlayTrigger>
                                                </>
                                              )}
                                            </td>
                                            <td>
                                              {productVal.variants.length &&
                                              (productVal.variants[0][
                                                'variantType'
                                              ][0] !== undefined ||
                                                productVal.variants[0]
                                                  ?.inventoryInfo?.quantityTypes
                                                  ?.length === 0) ? (
                                                <span className="fs-20 fw-600">
                                                  -
                                                </span>
                                              ) : (
                                                <>
                                                  {!productVal.variants[0]
                                                    .expiryInfo.expired
                                                    ?.minDate &&
                                                  !productVal.variants[0]
                                                    .expiryInfo.expired
                                                    ?.maxDate &&
                                                  !productVal.variants[0]
                                                    .expiryInfo.expiring
                                                    ?.minDate &&
                                                  !productVal.variants[0]
                                                    .expiryInfo.expiring
                                                    ?.maxDate ? (
                                                    <span className="fs-15 fw-600">
                                                      No expiry
                                                    </span>
                                                  ) : (
                                                    <>
                                                      {' '}
                                                      {!expiry ? (
                                                        <div className="mw-130px">
                                                          <CustomSelectTable2
                                                            minHieight={'40px'}
                                                            backgroundColor={
                                                              '#ffff'
                                                            }
                                                            isDisabled={
                                                              !Method.hasPermission(
                                                                GoodsInWarehouseConst,
                                                                Edit,
                                                                currentUser
                                                              )
                                                            }
                                                            onChange={(
                                                              event: any
                                                            ) => {
                                                              handleExpiryRemainder(
                                                                event,
                                                                productVal
                                                                  .variants[0]
                                                                  ?._id,
                                                                true,
                                                                index,
                                                                0
                                                              );
                                                            }}
                                                            options={
                                                              expiryMonthsJSON
                                                            }
                                                            value={expiryMonthsJSON.filter(
                                                              (expVal: any) =>
                                                                productVal
                                                                  .variants[0]
                                                                  ?.inventoryInfo
                                                                  .quantityTypes
                                                                  .length
                                                                  ? productVal
                                                                      .variants[0]
                                                                      ?.inventoryInfo
                                                                      .reference
                                                                      .reminder
                                                                    ? productVal
                                                                        .variants[0]
                                                                        ?.inventoryInfo
                                                                        .reference
                                                                        .reminder
                                                                        .days /
                                                                        30 ===
                                                                      expVal.value
                                                                    : {}
                                                                  : {}
                                                            )}
                                                          />
                                                        </div>
                                                      ) : (
                                                        <>
                                                          {expiry === '0' ? (
                                                            <span className="fs-15 fw-600">
                                                              No expiry
                                                            </span>
                                                          ) : (
                                                            <span className="fs-16 fw-600">
                                                              {Method.dayDifference(
                                                                productVal
                                                                  .variants[0]
                                                                  ?.expiryInfo
                                                                  ?.expired
                                                                  .minDate,
                                                                productVal
                                                                  .variants[0]
                                                                  ?.expiryInfo
                                                                  ?.expired
                                                                  .maxDate
                                                              ) > 0
                                                                ? Method.dayDifference(
                                                                    productVal
                                                                      .variants[0]
                                                                      ?.expiryInfo
                                                                      ?.expired
                                                                      .minDate,
                                                                    productVal
                                                                      .variants[0]
                                                                      ?.expiryInfo
                                                                      ?.expired
                                                                      .maxDate
                                                                  ) + ' days'
                                                                : 'Today'}{' '}
                                                              {/* <h2>data</h2> */}
                                                            </span>
                                                          )}
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </td>
                                            <td className="fs-16 fw-600 text-end">
                                              {productVal.variants.length &&
                                              productVal.variants[0][
                                                'variantType'
                                              ][0] !== undefined ? (
                                                <span className="fs-20 fw-600">
                                                  <span
                                                    className="fs-16 fw-600 text-gray text-hover-primary cursor-pointer me-3"
                                                    onClick={() => {
                                                      handleVariationShow(
                                                        products.variants,
                                                        index
                                                      );
                                                    }}
                                                  >
                                                    {productVal.showVariant
                                                      ? 'Hide'
                                                      : 'View'}{' '}
                                                    {productVal.variants.length}{' '}
                                                    variations
                                                  </span>
                                                </span>
                                              ) : (
                                                <>
                                                  {Method.hasPermission(
                                                    GoodsInWarehouseConst,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="btn-active-light-primary fs-14 fw-600 me-5"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        if (
                                                          Method.hasPermission(
                                                            Product,
                                                            View,
                                                            currentUser
                                                          )
                                                        ) {
                                                          setKey(
                                                            listInventory.inventoryScroll,
                                                            window.scrollY.toString()
                                                          );
                                                          navigate(
                                                            '/all-products/product-details',
                                                            {
                                                              state: {
                                                                _id: productVal
                                                                  .variants[0]
                                                                  ?._id,
                                                                isMaster: true,
                                                                module:
                                                                  GoodsInWarehouseConst,
                                                              },
                                                            }
                                                          );
                                                        } else {
                                                          setShowPermissionModal(
                                                            true
                                                          );
                                                        }
                                                      }}
                                                    >
                                                      View details
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </>
                                              )}
                                            </td>
                                          </tr>
                                        )}
                                        {productVal?.showVariant ? (
                                          productVal.variants.map(
                                            (
                                              variantVal: any,
                                              variantIndex: number
                                            ) => {
                                              return (
                                                <tr className="table-active">
                                                  <td className="ps-15">
                                                    <div className="d-flex align-items-center">
                                                      {showCheckBox ? (
                                                        <div className="me-3">
                                                          <input
                                                            className={clsx(
                                                              'form-check-input pt-1 h-30px w-30px  me-3 ',
                                                              selectedVariants?.includes(
                                                                variantVal?._id
                                                              )
                                                                ? 'border border-5 border-primary'
                                                                : ''
                                                            )}
                                                            type="checkbox"
                                                            name="fullRefund"
                                                            checked={selectedVariants?.includes(
                                                              variantVal?._id
                                                            )}
                                                            onChange={(
                                                              event
                                                            ) => {
                                                              handleCheckboxChange(
                                                                event,
                                                                [variantVal],
                                                                index
                                                              );
                                                            }}
                                                          />
                                                        </div>
                                                      ) : (
                                                        <></>
                                                      )}
                                                      <div className="symbol symbol-50px border me-5">
                                                        <img
                                                          src={Method.getProductMedia(
                                                            variantVal,
                                                            false,
                                                            false
                                                          )}
                                                          className="object-fit-contain"
                                                          alt=""
                                                        />
                                                      </div>
                                                      <div className="fs-15 fw-600">
                                                        {variantVal?.title?.replace(
                                                          /\s*\)\s*/g,
                                                          ')'
                                                        )}
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td>
                                                    <>
                                                      <OverlayTrigger
                                                        trigger="hover"
                                                        placement="bottom"
                                                        overlay={
                                                          (productVal.variants[
                                                            variantIndex
                                                          ].expiryInfo
                                                            ?.expired &&
                                                            productVal.variants[
                                                              variantIndex
                                                            ].expiryInfo
                                                              ?.expired
                                                              .quantityTypes
                                                              .length &&
                                                            (productVal
                                                              .variants[
                                                              variantIndex
                                                            ].expiryInfo
                                                              ?.expired
                                                              .maxDate ||
                                                              productVal
                                                                .variants[
                                                                variantIndex
                                                              ].expiryInfo
                                                                ?.expired
                                                                .minDate)) ||
                                                          (productVal.variants[
                                                            variantIndex
                                                          ].expiryInfo
                                                            ?.expiring &&
                                                            productVal.variants[
                                                              variantIndex
                                                            ].expiryInfo
                                                              ?.expiring
                                                              .quantityTypes
                                                              .length &&
                                                            (productVal
                                                              .variants[
                                                              variantIndex
                                                            ].expiryInfo
                                                              ?.expiring
                                                              .maxDate ||
                                                              productVal
                                                                .variants[
                                                                variantIndex
                                                              ].expiryInfo
                                                                ?.expiring
                                                                .minDate)) ? (
                                                            <Popover id="popover-basic">
                                                              <Popover.Body className="p-2 bg-white border-r10px text-dark">
                                                                <span>
                                                                  {((productVal
                                                                    .variants[
                                                                    variantIndex
                                                                  ].expiryInfo
                                                                    ?.expiring &&
                                                                    productVal
                                                                      .variants[
                                                                      variantIndex
                                                                    ].expiryInfo
                                                                      ?.expiring
                                                                      .quantityTypes
                                                                      .length) ||
                                                                    (productVal
                                                                      .variants[
                                                                      variantIndex
                                                                    ].expiryInfo
                                                                      ?.expired &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired
                                                                        .quantityTypes
                                                                        .length)) && (
                                                                    <span className="fs-12 fw-bold text-center">
                                                                      {productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expiring &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expiring
                                                                        .quantityTypes
                                                                        .length &&
                                                                      Method.dayDifference(
                                                                        new Date().toDateString(),
                                                                        productVal
                                                                          ?.variants[
                                                                          variantIndex
                                                                        ]
                                                                          ?.expiryInfo
                                                                          ?.expiring
                                                                          ?.minDate
                                                                      ) <=
                                                                        productVal
                                                                          ?.variants[
                                                                          variantIndex
                                                                        ]
                                                                          ?.inventoryInfo
                                                                          ?.reference
                                                                          ?.reminder
                                                                          ?.days ? (
                                                                        <>
                                                                          <span className="text-warning">
                                                                            {productVal.variants[
                                                                              variantIndex
                                                                            ].expiryInfo?.expiring.quantityTypes.map(
                                                                              (
                                                                                quantVal: any,
                                                                                index: number
                                                                              ) => (
                                                                                <React.Fragment
                                                                                  key={
                                                                                    index
                                                                                  }
                                                                                >
                                                                                  {index !==
                                                                                  0
                                                                                    ? ' , '
                                                                                    : ''}
                                                                                  {
                                                                                    quantVal.stockCount
                                                                                  }{' '}
                                                                                  {quantVal.type ===
                                                                                  Units
                                                                                    ? quantVal.stockCount <=
                                                                                      1
                                                                                      ? String.singleUnit
                                                                                      : String.unit
                                                                                    : ''}
                                                                                </React.Fragment>
                                                                              )
                                                                            )}{' '}
                                                                            {Method.dayDifference(
                                                                              productVal
                                                                                .variants[
                                                                                variantIndex
                                                                              ]
                                                                                .expiryInfo
                                                                                ?.expiring
                                                                                .minDate,
                                                                              productVal
                                                                                .variants[
                                                                                variantIndex
                                                                              ]
                                                                                .expiryInfo
                                                                                ?.expiring
                                                                                .maxDate
                                                                            ) >
                                                                            1
                                                                              ? ` are
                                                      expiring
                                                      in between 
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[
                                                          variantIndex
                                                        ].expiryInfo?.expiring
                                                          .minDate
                                                      )}
                                                      -
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[
                                                          variantIndex
                                                        ].expiryInfo?.expiring
                                                          .maxDate
                                                      )}`
                                                                              : `are
                                                      expiring
                                                   on
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[
                                                          variantIndex
                                                        ].expiryInfo?.expiring
                                                          .minDate
                                                      )}`}
                                                                            {
                                                                              '. '
                                                                            }
                                                                          </span>
                                                                        </>
                                                                      ) : (
                                                                        <></>
                                                                      )}
                                                                      {productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired
                                                                        .quantityTypes
                                                                        .length &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expiring &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expiring
                                                                        .quantityTypes
                                                                        .length ? (
                                                                        <>
                                                                          <br />
                                                                          <div className="separator mb-3 mt-3 opacity-75"></div>
                                                                        </>
                                                                      ) : (
                                                                        <></>
                                                                      )}
                                                                      {productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired
                                                                        .quantityTypes
                                                                        .length ? (
                                                                        <>
                                                                          <span className="text-danger">
                                                                            {productVal.variants[
                                                                              variantIndex
                                                                            ].expiryInfo?.expired.quantityTypes.map(
                                                                              (
                                                                                quantVal: any,
                                                                                index: number
                                                                              ) => (
                                                                                <React.Fragment
                                                                                  key={
                                                                                    index
                                                                                  }
                                                                                >
                                                                                  {index !==
                                                                                  0
                                                                                    ? ' , '
                                                                                    : ''}
                                                                                  {
                                                                                    quantVal.stockCount
                                                                                  }{' '}
                                                                                  {quantVal.type ===
                                                                                  Units
                                                                                    ? quantVal.stockCount <=
                                                                                      1
                                                                                      ? String.singleUnit
                                                                                      : String.unit
                                                                                    : ''}
                                                                                </React.Fragment>
                                                                              )
                                                                            )}{' '}
                                                                            {Method.dayDifference(
                                                                              productVal
                                                                                .variants[
                                                                                variantIndex
                                                                              ]
                                                                                .expiryInfo
                                                                                ?.expired
                                                                                .minDate,
                                                                              productVal
                                                                                .variants[
                                                                                variantIndex
                                                                              ]
                                                                                .expiryInfo
                                                                                ?.expired
                                                                                .maxDate
                                                                            ) >
                                                                            1
                                                                              ? `are
                                                      expired in
                                                      between
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[
                                                          variantIndex
                                                        ].expiryInfo?.expired
                                                          .minDate
                                                      )}
                                                      -
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[
                                                          variantIndex
                                                        ].expiryInfo?.expired
                                                          .maxDate
                                                      )}`
                                                                              : `are
                                                      expired on 
                                                      ${Method.convertDateToDDMMYYYY(
                                                        productVal.variants[
                                                          variantIndex
                                                        ].expiryInfo?.expired
                                                          .minDate
                                                      )}`}
                                                                            {
                                                                              '.'
                                                                            }
                                                                          </span>
                                                                        </>
                                                                      ) : (
                                                                        <></>
                                                                      )}
                                                                    </span>
                                                                  )}
                                                                </span>
                                                              </Popover.Body>
                                                            </Popover>
                                                          ) : (
                                                            <></>
                                                          )
                                                        }
                                                      >
                                                        <span>
                                                          {productVal.variants[
                                                            variantIndex
                                                          ]?.inventoryInfo
                                                            .quantityTypes
                                                            .length ? (
                                                            <>
                                                              {expiry !==
                                                              '-1' ? (
                                                                <>
                                                                  {productVal.variants[
                                                                    variantIndex
                                                                  ].inventoryInfo.quantityTypes.map(
                                                                    (
                                                                      quantVal: any,
                                                                      quantIndex: number
                                                                    ) => {
                                                                      return (
                                                                        <>
                                                                          <span
                                                                            className={clsx(
                                                                              'fs-15 fw-600',
                                                                              (productVal
                                                                                .variants[
                                                                                variantIndex
                                                                              ]
                                                                                .expiryInfo
                                                                                ?.expired &&
                                                                                productVal
                                                                                  .variants[
                                                                                  variantIndex
                                                                                ]
                                                                                  .expiryInfo
                                                                                  ?.expired
                                                                                  .quantityTypes
                                                                                  .length) ||
                                                                                (productVal
                                                                                  .variants[
                                                                                  variantIndex
                                                                                ]
                                                                                  .expiryInfo
                                                                                  ?.expiring &&
                                                                                  productVal
                                                                                    .variants[
                                                                                    variantIndex
                                                                                  ]
                                                                                    .expiryInfo
                                                                                    ?.expiring
                                                                                    .quantityTypes
                                                                                    .length)
                                                                                ? productVal
                                                                                    .variants[
                                                                                    variantIndex
                                                                                  ]
                                                                                    .expiryInfo
                                                                                    ?.expired &&
                                                                                  productVal.variants[
                                                                                    variantIndex
                                                                                  ].expiryInfo?.expired.quantityTypes.some(
                                                                                    (
                                                                                      a: any
                                                                                    ) =>
                                                                                      a.type ===
                                                                                      quantVal.type
                                                                                  ) &&
                                                                                  expiry !==
                                                                                    '0'
                                                                                  ? 'text-danger'
                                                                                  : productVal
                                                                                      .variants[
                                                                                      variantIndex
                                                                                    ]
                                                                                      .expiryInfo
                                                                                      ?.expiring &&
                                                                                    productVal.variants[
                                                                                      variantIndex
                                                                                    ].expiryInfo?.expiring.quantityTypes.some(
                                                                                      (
                                                                                        a: any
                                                                                      ) =>
                                                                                        a.type ===
                                                                                        quantVal.type
                                                                                    ) &&
                                                                                    Method.dayDifference(
                                                                                      new Date().toDateString(),
                                                                                      productVal
                                                                                        .variants[
                                                                                        variantIndex
                                                                                      ]
                                                                                        .expiryInfo
                                                                                        .expiring
                                                                                        .minDate
                                                                                    ) <=
                                                                                      productVal
                                                                                        ?.variants[
                                                                                        variantIndex
                                                                                      ]
                                                                                        ?.inventoryInfo
                                                                                        ?.reference
                                                                                        ?.reminder
                                                                                        ?.days
                                                                                  ? 'text-warning'
                                                                                  : ''
                                                                                : ''
                                                                            )}
                                                                          >
                                                                            {' '}
                                                                            {quantIndex !==
                                                                            0
                                                                              ? ', '
                                                                              : ''}
                                                                            {
                                                                              quantVal.stockCount
                                                                            }{' '}
                                                                            {quantVal.type ===
                                                                            Units
                                                                              ? quantVal.stockCount <=
                                                                                1
                                                                                ? String.singleUnit
                                                                                : String.unit
                                                                              : ''}
                                                                          </span>
                                                                        </>
                                                                      );
                                                                    }
                                                                  )}
                                                                </>
                                                              ) : (
                                                                <>
                                                                  {((productVal
                                                                    .variants[
                                                                    variantIndex
                                                                  ].expiryInfo
                                                                    ?.expiring &&
                                                                    productVal
                                                                      .variants[
                                                                      variantIndex
                                                                    ].expiryInfo
                                                                      ?.expiring
                                                                      .quantityTypes
                                                                      .length) ||
                                                                    (productVal
                                                                      .variants[
                                                                      variantIndex
                                                                    ].expiryInfo
                                                                      ?.expired &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired
                                                                        .quantityTypes
                                                                        .length)) && (
                                                                    <span className="fs-15 fw-600">
                                                                      {productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired &&
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        .expiryInfo
                                                                        ?.expired
                                                                        .quantityTypes
                                                                        .length ? (
                                                                        <>
                                                                          <span className="text-dark">
                                                                            {productVal.variants[
                                                                              variantIndex
                                                                            ].expiryInfo?.expired.quantityTypes.map(
                                                                              (
                                                                                quantVal: any,
                                                                                index: number
                                                                              ) => (
                                                                                <React.Fragment
                                                                                  key={
                                                                                    index
                                                                                  }
                                                                                >
                                                                                  {index !==
                                                                                  0
                                                                                    ? ' , '
                                                                                    : ''}
                                                                                  {
                                                                                    quantVal.stockCount
                                                                                  }{' '}
                                                                                  {quantVal.type ===
                                                                                  Units
                                                                                    ? quantVal.stockCount <=
                                                                                      1
                                                                                      ? String.singleUnit
                                                                                      : String.unit
                                                                                    : ''}
                                                                                </React.Fragment>
                                                                              )
                                                                            )}{' '}
                                                                          </span>
                                                                        </>
                                                                      ) : (
                                                                        <></>
                                                                      )}
                                                                    </span>
                                                                  )}
                                                                </>
                                                              )}
                                                              {productVal
                                                                .variants[
                                                                variantIndex
                                                              ]?.inventoryInfo
                                                                .quantityTypes[0]
                                                                ?.forecastedDays ? (
                                                                <em
                                                                  className={clsx(
                                                                    'fs-15 d-block fw-500'
                                                                  )}
                                                                >
                                                                  Stock left for
                                                                  <span
                                                                    className={clsx(
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        ?.inventoryInfo
                                                                        .quantityTypes[0]
                                                                        ?.forecastedDays
                                                                        ? productVal
                                                                            .variants[
                                                                            variantIndex
                                                                          ]
                                                                            ?.inventoryInfo
                                                                            .quantityTypes[0]
                                                                            ?.forecastedDays <=
                                                                          forCastedDays
                                                                          ? 'text-danger'
                                                                          : ''
                                                                        : ''
                                                                    )}
                                                                  >
                                                                    {` ${
                                                                      productVal
                                                                        .variants[
                                                                        variantIndex
                                                                      ]
                                                                        ?.inventoryInfo
                                                                        .quantityTypes[0]
                                                                        ?.forecastedDays
                                                                        ? productVal
                                                                            .variants[
                                                                            variantIndex
                                                                          ]
                                                                            ?.inventoryInfo
                                                                            .quantityTypes[0]
                                                                            ?.forecastedDays +
                                                                          ' days'
                                                                        : ''
                                                                    }`}
                                                                  </span>
                                                                </em>
                                                              ) : (
                                                                <></>
                                                              )}
                                                            </>
                                                          ) : (
                                                            <span className="fs-20 fw-600">
                                                              -
                                                            </span>
                                                          )}
                                                        </span>
                                                      </OverlayTrigger>
                                                    </>
                                                  </td>
                                                  <td>
                                                    <>
                                                      {variantVal?.inventoryInfo
                                                        ?.quantityTypes
                                                        ?.length === 0 ? (
                                                        <span className="fs-20 fw-600">
                                                          -
                                                        </span>
                                                      ) : (
                                                        <>
                                                          {!variantVal
                                                            ?.expiryInfo
                                                            ?.expired
                                                            ?.minDate &&
                                                          !variantVal
                                                            ?.expiryInfo
                                                            ?.expired
                                                            ?.maxDate &&
                                                          !variantVal
                                                            ?.expiryInfo
                                                            ?.expiring
                                                            ?.minDate &&
                                                          !variantVal
                                                            ?.expiryInfo
                                                            ?.expiring
                                                            ?.maxDate ? (
                                                            <span className="fs-15 fw-600">
                                                              No expiry
                                                            </span>
                                                          ) : (
                                                            <>
                                                              {' '}
                                                              {!expiry ? (
                                                                <div className="mw-130px">
                                                                  <CustomSelectTable2
                                                                    minHieight={
                                                                      '40px'
                                                                    }
                                                                    backgroundColor={
                                                                      '#ffff'
                                                                    }
                                                                    isDisabled={
                                                                      !Method.hasPermission(
                                                                        GoodsInWarehouseConst,
                                                                        Edit,
                                                                        currentUser
                                                                      )
                                                                    }
                                                                    onChange={(
                                                                      event: any
                                                                    ) => {
                                                                      handleExpiryRemainder(
                                                                        event,
                                                                        variantVal._id,
                                                                        false,
                                                                        index,
                                                                        variantIndex
                                                                      );
                                                                    }}
                                                                    options={
                                                                      expiryMonthsJSON
                                                                    }
                                                                    value={expiryMonthsJSON.filter(
                                                                      (
                                                                        expVal: any
                                                                      ) =>
                                                                        productVal
                                                                          .variants[
                                                                          variantIndex
                                                                        ]
                                                                          ?.inventoryInfo
                                                                          .quantityTypes
                                                                          .length
                                                                          ? productVal
                                                                              .variants[
                                                                              variantIndex
                                                                            ]
                                                                              ?.inventoryInfo
                                                                              .reference
                                                                              .reminder
                                                                            ? productVal
                                                                                .variants[
                                                                                variantIndex
                                                                              ]
                                                                                ?.inventoryInfo
                                                                                .reference
                                                                                .reminder
                                                                                .days /
                                                                                30 ===
                                                                              expVal.value
                                                                            : {}
                                                                          : {}
                                                                    )}
                                                                  />
                                                                </div>
                                                              ) : (
                                                                <>
                                                                  {expiry ===
                                                                  '0' ? (
                                                                    <span className="fs-15 fw-600">
                                                                      No expiry
                                                                    </span>
                                                                  ) : (
                                                                    <span className="fs-16 fw-600">
                                                                      {Method.dayDifference(
                                                                        productVal
                                                                          .variants[
                                                                          variantIndex
                                                                        ]
                                                                          ?.expiryInfo
                                                                          ?.expired
                                                                          .minDate,
                                                                        productVal
                                                                          .variants[
                                                                          variantIndex
                                                                        ]
                                                                          ?.expiryInfo
                                                                          ?.expired
                                                                          .maxDate
                                                                      ) > 0
                                                                        ? Method.dayDifference(
                                                                            productVal
                                                                              .variants[
                                                                              variantIndex
                                                                            ]
                                                                              ?.expiryInfo
                                                                              ?.expired
                                                                              .minDate,
                                                                            productVal
                                                                              .variants[
                                                                              variantIndex
                                                                            ]
                                                                              ?.expiryInfo
                                                                              ?.expired
                                                                              .maxDate
                                                                          ) +
                                                                          ' days'
                                                                        : 'Today'}{' '}
                                                                      <h2></h2>
                                                                    </span>
                                                                  )}
                                                                </>
                                                              )}
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </>
                                                  </td>
                                                  <td className="text-end">
                                                    <div className="d-flex flex-nowrap justify-content-end align-items-center">
                                                      {/* <Link to="view-product-details"> */}
                                                      {Method.hasPermission(
                                                        GoodsInWarehouseConst,
                                                        View,
                                                        currentUser
                                                      ) ? (
                                                        <Button
                                                          variant="primary"
                                                          className="me-3 btn-active-light-primary fs-14 fw-600"
                                                          style={{
                                                            whiteSpace:
                                                              'nowrap',
                                                          }}
                                                          onClick={() => {
                                                            if (
                                                              Method.hasPermission(
                                                                Product,
                                                                View,
                                                                currentUser
                                                              )
                                                            ) {
                                                              setKey(
                                                                listInventory.inventoryScroll,
                                                                window.scrollY.toString()
                                                              );
                                                              navigate(
                                                                '/all-products/product-details',
                                                                {
                                                                  state: {
                                                                    _id: productVal
                                                                      .variants[
                                                                      variantIndex
                                                                    ]?._id,
                                                                    isMaster:
                                                                      false,
                                                                    module:
                                                                      GoodsInWarehouseConst,
                                                                  },
                                                                }
                                                              );
                                                            } else {
                                                              setShowPermissionModal(
                                                                true
                                                              );
                                                            }
                                                          }}
                                                        >
                                                          View details
                                                        </Button>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              <>
                                {' '}
                                <tr>
                                  <td colSpan={4}>
                                    <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                      No Data found
                                    </div>
                                  </td>
                                </tr>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <tr>
                              <td colSpan={4}>
                                <div className="w-100 d-flex justify-content-center">
                                  <Loader loading={fetchLoader} />
                                </div>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {!fetchLoader && totalRecords > 0 ? (
              <Pagination
                totalRecords={totalRecords}
                currentPage={page}
                handleCurrentPage={handleCurrentPage}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handlePageLimit={handlePageLimit}
                pageLimit={pageLimit}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center">
              <Loader loading={initLoader} />
            </div>
          </>
        )}
      </Row>
    </>
  );
};
export default GoodsInWarehouse;
