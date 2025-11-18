import { Card, Col, Row } from 'react-bootstrap';
import { BannerString, DeliverString } from '../../../../utils/string';
import { Link, useNavigate } from 'react-router-dom';
import { CustomSelectWhite } from '../../../custom/Select/CustomSelectWhite';
import {
  Activate,
  Add,
  BannerConst,
  BrandPlacement,
  CategoryPagePlacement,
  Deactivate,
  Delete,
  Edit,
  FixedBanner,
  GeneralSettings,
  HomePagePlacement,
  PAGE_LIMIT,
  ProductPlacement,
  View,
} from '../../../../utils/constants';
import green from '../../../../umart_admin/assets/media/svg_uMart/green_dot.svg';
import gray from '../../../../umart_admin/assets/media/svg_uMart/gray_dot.svg';
import { useEffect, useState } from 'react';
import Loader from '../../../../Global/loader';
import Pagination from '../../../../Global/pagination';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import APICallService from '../../../../api/apiCallService';
import { banners } from '../../../../api/apiEndPoints';
import * as XLSX from 'xlsx';
import { error, success } from '../../../../Global/toast';
import { bannerToast } from '../../../../utils/toast';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Method from '../../../../utils/methods';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import { getKey, removeKey, setKey } from '../../../../Global/history';
import { listBanner } from '../../../../utils/storeString';
import { useAuth } from '../../auth';
const statusOptions = [
  {
    value: 0,
    name: 'All banners',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">All banners</span>
      </>
    ),
    title: 'Active',
  },
  {
    value: Activate,
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
    value: Deactivate,
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
const placementOptions = [
  {
    value: HomePagePlacement,
    name: 'Home page',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Home page</span>
      </>
    ),
    title: 'Home page',
  },
  {
    value: CategoryPagePlacement,
    name: 'Category page',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Category page</span>
      </>
    ),
    title: 'Category page',
  },
  {
    value: ProductPlacement,
    name: 'Product',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Product</span>
      </>
    ),
    title: 'Product',
  },
  {
    value: BrandPlacement,
    name: 'Brand',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Brand</span>
      </>
    ),
    title: 'Brand',
  },
];
const bannerOptions = [
  {
    value: HomePagePlacement,
    name: 'Home page',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Home page</span>
      </>
    ),
    title: 'Home page',
  },
  {
    value: CategoryPagePlacement,
    name: 'Category page',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Category page</span>
      </>
    ),
    title: 'Category page',
  },
  {
    value: BrandPlacement,
    name: 'Brand',
    label: (
      <>
        <span className="fs-16 fw-600 text-black ">Brand</span>
      </>
    ),
    title: 'Brand',
  },
];
const bannerPlaceMent = ['Home page', 'Category page', 'Product', 'Brand'];
const AllBanners = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bannersList, setBannersList] = useState<any>([]);
  const [bannerId, setBannerId] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(getKey(listBanner.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listBanner.limit) || PAGE_LIMIT
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<any>(
    getKey(listBanner.statusFilter) || 0
  );
  const [placement, setPlacement] = useState<any>(
    getKey(listBanner.placementFilter) || 0
  );
  const [currentBanner, setCurrentBanner] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [bannersSequence, setBannerSequence] = useState<
    { reference: string; refKey: number }[]
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [options, setOptions] = useState<any>();
  useEffect(() => {
    (async () => {
      setFetchLoading(true);
      setLoading(true);
      if (!Method.hasModulePermission(BannerConst, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchBanners(page, pageLimit, filterStatus, placement);
      setLoading(false);
      setFetchLoading(false);
      setTimeout(() => {
        const pos = getKey(listBanner.scrollPosition);
        window.scrollTo(0, pos);
      }, 600);
    })();
  }, []);
  const fetchBanners = async (
    pageNo: number,
    limit: number,
    status?: any,
    placement?: any
  ) => {
    setLoading(true);
    const params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'refKey',
      sortOrder: -1,
      needCount: true,
    };
    if (placement) {
      params['placement[]'] = placement;
    }
    if (status && status !== 0) {
      params['status'] = status;
    }
    const apiCallService = new APICallService(
      banners.bannersList,
      params,
      '',
      '',
      false,
      '',
      BannerConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      const tempSequence = response.records.map((item: any) => {
        return {
          reference: item._id,
          refKey: item.refKey,
        };
      });
      setBannerSequence(tempSequence);
      setBannersList(response.records);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(BannerConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4">
            {BannerString.editBanner}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(BannerConst, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {BannerString.deleteBanner}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const handleStatusFilter = async (event: any) => {
    setPage(1);
    setKey(listBanner.page, 1);
    await fetchBanners(1, pageLimit, event.value, placement);
    setFilterStatus(event.value);
    setKey(listBanner.statusFilter, event.value);
  };
  const handlePlacementChange = async (event: any) => {
    setPage(1);
    setKey(listBanner.page, 1);
    if (event) {
      await fetchBanners(1, pageLimit, filterStatus, event.value);
      setPlacement(event.value);
      setKey(listBanner.placementFilter, event.value);
    } else {
      await fetchBanners(1, pageLimit, filterStatus);
      removeKey(listBanner.placementFilter);
      setPlacement(0);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listBanner.page, val);
    await fetchBanners(val, pageLimit, filterStatus, placement);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listBanner.page, val + 1);
    await fetchBanners(val + 1, pageLimit, filterStatus, placement);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listBanner.page, val - 1);
    await fetchBanners(val - 1, pageLimit, filterStatus, placement);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listBanner.page, 1);
    setKey(listBanner.limit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchBanners(1, event.target.value, filterStatus, placement);
  };
  const handleStatus = (data: any, index: number) => {
    setShowModal(true);
    setCurrentBanner(data);
    setCurrentIndex(index);
  };
  const handleDetails = (data: any) => {
    setKey(listBanner.scrollPosition, window.scrollY.toString());
    navigate('/settings/banners/banner-details', { state: { id: data._id } });
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBanner(undefined);
    setCurrentIndex(-1);
    setErrorMsg(undefined);
  };
  const updateStatus = async (currentBanner: any, index: number) => {
    let params: any = {
      activate: currentBanner.active ? 'false' : 'true',
    };
    if (currentBanner.expired) {
      params = {
        ...params,
        startDate: Method.getTodayDate('YYYY-MM-DD'),
        endDate: Method.addDaysToDate(
          Method.getTodayDate('YYYY-MM-DD'),
          currentBanner.days,
          'YYYY-MM-DD'
        ),
      };
    }
    const apiCallService = new APICallService(
      banners.updateStatus,
      params,
      {
        id: currentBanner._id,
      },
      null,
      true,
      '',
      BannerConst
    );
    const response = await apiCallService.callAPI();
    if (response && !response.error) {
      const tempData = [...bannersList];
      tempData[index].active = !currentBanner.active;
      const message = currentBanner.active
        ? bannerToast.bannerActivated
        : bannerToast.bannerDeactivated;
      success(message);
      setBannersList(tempData);
      setErrorMsg(undefined);
      handleCloseModal();
    } else if (response && response.error) {
      setErrorMsg(response.error);
    }
  };
  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    const newBannersList = Array.from(bannersList);
    const [removed] = newBannersList.splice(source.index, 1);
    newBannersList.splice(destination.index, 0, removed);
    const tempSequence = [...bannersSequence];
    const sourceRef = tempSequence[source.index].reference;
    if (sourceIndex > destinationIndex) {
      for (let i = sourceIndex; i > destinationIndex; i--) {
        tempSequence[i].reference = tempSequence[i - 1].reference;
      }
      tempSequence[destinationIndex].reference = sourceRef;
    } else if (sourceIndex < destinationIndex) {
      for (let i = sourceIndex; i < destinationIndex; i++) {
        tempSequence[i].reference = tempSequence[i + 1].reference;
      }
      tempSequence[destinationIndex].reference = sourceRef;
    }
    setLoading(true);
    const apiCallService = new APICallService(
      banners.updateSequence,
      {
        variants: tempSequence,
      },
      '',
      '',
      false,
      '',
      BannerConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setBannerSequence(tempSequence);
      setBannersList(newBannersList);
    }
    setLoading(false);
  };
  const handleExport = () => {
    if (bannersList.length === 0) {
      error('No data to export');
      return;
    }
    const title: string = 'Banners Details';
    const data: any[] = [
      [title],
      [
        'Sr no',
        'Banner name',
        'Banner placement',
        'Banner type',
        'Impression',
        'Clicks',
        'Status',
        'Remaining days',
      ],
    ];
    bannersList.forEach((banner: any, index: number) => {
      const rowData: any = [
        index + 1,
        banner.title,
        placementOptions[banner.placement - 1]?.name,
        banner?.type === FixedBanner ? 'Fixed' : 'Dynamic',
        banner.impressions,
        banner.clicks,
        banner.active ? 'Active' : 'Deactivated',
        !banner.expired
          ? Method.dayDifference(
              Method.getTodayDate('YYYY-MM-DD'),
              banner.endDate
            ) + 1
          : '-',
      ];
      data.push(rowData);
    });
    // Convert data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data, {
      cellStyles: true,
    });
    // Merge cells A1 to G1
    worksheet['!cols'] = [
      { width: 10 },
      { width: 40 },
      { width: 25 },
      { width: 15 },
      { width: 10 },
      { width: 10 },
      { width: 15 },
      { width: 18 },
    ];
    const cellStyle = {
      font: { bold: true, sz: '12', color: { rgb: 'FFFFAA00' } },
      alignment: { horizontal: 'center' },
      border: { top: { style: 'thin', color: { rgb: 'FF000000' } } },
    };
    worksheet['A1'] = {
      v: 'Banner details',
      s: cellStyle,
    };
    worksheet['B2'] = {
      v: 'Banner name',
      t: cellStyle,
    };
    worksheet['!rows']?.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        row[key] = cellStyle;
      });
    });
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Collection Data');
    const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
    });
    const excelData: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = URL.createObjectURL(excelData);
    link.download = `banner_data_${Method.getTodayDate('DD-MM-YYYY')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleOptionChange = (event: any, data: any) => {
    if (event.value === 1) {
      setKey(listBanner.scrollPosition, window.scrollY.toString());
      navigate('/settings/banners/edit-banner', { state: { id: data._id } });
    } else if (event.value === 2) {
      setShowDeleteModal(true);
      setCurrentBanner(data);
    }
  };
  const openMenuOnClick = async (id: any) => {
    if (bannerId == id) {
      setBannerId('');
    } else {
      setBannerId(id);
    }
  };
  const onMenuOpen = async (id: any) => {
    setBannerId(id);
  };
  const handleDeleteBanner = async () => {
    const apiCallService = new APICallService(
      banners.deleteBanner,
      currentBanner._id,
      '',
      '',
      false,
      '',
      BannerConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(bannerToast.bannerDeleted);
      setShowDeleteModal(false);
      setCurrentBanner(undefined);
      await fetchBanners(page, pageLimit, filterStatus);
    }
  };
  return (
    <>
      {showModal && currentBanner ? (
        <CustomDeleteModal
          show={showModal}
          onHide={handleCloseModal}
          title={`Are you sure you want to ${
            !currentBanner.active ? 'activate' : 'deactivate'
          }
this banner?`}
          btnTitle={`Yes, ${!currentBanner.active ? 'Activate' : 'Deactivate'}`}
          handleDelete={() => updateStatus(currentBanner, currentIndex)}
          error={errorMsg}
        />
      ) : (
        <></>
      )}
      {showDeleteModal && currentBanner ? (
        <CustomDeleteModal
          show={() => {
            setShowDeleteModal(true);
          }}
          onHide={() => {
            setShowDeleteModal(false);
            setCurrentBanner(undefined);
          }}
          title={`Are you sure you want to delete this banner?`}
          btnTitle={`Yes, Delete`}
          handleDelete={handleDeleteBanner}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center">
        <Col
          xs
          className="align-self-center my-6"
        >
          <h1 className="fs-22 fw-bolder mb-0">
            {BannerString.bannerManagement}
          </h1>
        </Col>
        {!fetchLoading ? (
          <>
            {' '}
            <Col
              xs={'auto'}
              className="text-right "
            >
              {Method.hasPermission(BannerConst, Add, currentUser) ? (
                <Link
                  to="/settings/banners/add-banner"
                  className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600 mb-2"
                >
                  {BannerString.addNewBanner}
                </Link>
              ) : (
                <></>
              )}
            </Col>
            <Col xs="auto">
              <button
                type="button"
                className="me-2 fs-16 btn printBtn fw-bold text-primary btn-lg mb-2 "
                onClick={handleExport}
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {BannerString.downloadReport}
              </button>
            </Col>
          </>
        ) : (
          <></>
        )}
        <Col
          xs={12}
          className="mt-4"
        >
          <Card className="bg-light border mb-7">
            <Card.Body className="px-7">
              <Row className="align-items-center g-5">
                <Col
                  md={5}
                  lg={4}
                  sm={12}
                >
                  <CustomSelectWhite
                    className="min-w-100px"
                    defaultValue={[
                      {
                        value: 0,
                        name: 'All banners',
                        label: (
                          <>
                            <span className="fs-16 fw-600 text-black ">
                              All banners
                            </span>
                          </>
                        ),
                        title: 'Active',
                      },
                    ]}
                    placeholder="Filter by status"
                    options={statusOptions}
                    value={statusOptions[filterStatus]}
                    onChange={(event: any) => {
                      handleStatusFilter(event);
                    }}
                    isMulti={false}
                  />
                </Col>
                <Col
                  md={2}
                  lg={4}
                  sm={12}
                ></Col>
                <Col
                  md={5}
                  lg={4}
                  sm={12}
                >
                  <CustomSelectWhite
                    placeholder="Filter by placements"
                    options={bannerOptions}
                    onChange={(event: any) => {
                      handlePlacementChange(event);
                    }}
                    isMulti={false}
                    isClearable={true}
                    value={bannerOptions.find(
                      (item) => item.value === placement
                    )}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <>
            <Card className="border border-r10px ">
              <Card.Body className=" pb-0 pt-0">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div className="table-responsive">
                        <table
                          className="table table-rounded table-row-bordered align-middle gy-4 mb-0"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <thead>
                            <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                              <th className="min-w-125px">
                                {BannerString.banner}
                              </th>
                              <th className="min-w-160px">
                                {BannerString.bannerPlaceMent}
                              </th>
                              <th className="min-w-150px ">
                                {BannerString.impression}
                              </th>
                              <th className="min-w-120px">
                                {BannerString.clicks}
                              </th>
                              <th className="min-w-165px">
                                {DeliverString.activate} /<br />{' '}
                                {DeliverString.deactivate}
                              </th>
                              <th className="min-w-50px text-end"></th>
                              <th className="min-w-165px"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <>
                                <td colSpan={6}>
                                  <div className="w-100 d-flex justify-content-center">
                                    <Loader loading={loading} />
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                {bannersList.length ? (
                                  <>
                                    {bannersList.map(
                                      (customVal: any, customIndex: number) => {
                                        return (
                                          <Draggable
                                            key={customVal._id}
                                            draggableId={customVal._id}
                                            index={customIndex}
                                          >
                                            {(provided, snapshot) => (
                                              <tr
                                                key={customVal._id}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={
                                                  snapshot.isDragging
                                                    ? 'dragging-row'
                                                    : ''
                                                }
                                              >
                                                <td
                                                  style={{
                                                    minWidth:
                                                      snapshot.isDragging
                                                        ? '125px'
                                                        : '',
                                                  }}
                                                >
                                                  <>
                                                    <div className="symbol symbol-50px border border-r10px m .symbol-2by3 bgi-contain">
                                                      <div
                                                        className="symbol-label bgi-cover w-90px"
                                                        style={{
                                                          backgroundImage: `url('${
                                                            customVal?.image ||
                                                            ''
                                                          }')`,
                                                        }}
                                                      ></div>
                                                    </div>
                                                  </>
                                                </td>
                                                <td
                                                  style={{
                                                    minWidth:
                                                      snapshot.isDragging
                                                        ? '160px'
                                                        : '',
                                                  }}
                                                >
                                                  <span className="fs-15 fw-600">
                                                    {
                                                      bannerPlaceMent[
                                                        customVal.placement - 1
                                                      ]
                                                    }
                                                  </span>
                                                </td>
                                                <td
                                                  style={{
                                                    minWidth:
                                                      snapshot.isDragging
                                                        ? '150px'
                                                        : '',
                                                  }}
                                                >
                                                  <span className="fs-15 fw-600">
                                                    {customVal?.impressions ||
                                                      '-'}
                                                  </span>
                                                </td>
                                                <td
                                                  style={{
                                                    minWidth:
                                                      snapshot.isDragging
                                                        ? '120px'
                                                        : '',
                                                  }}
                                                >
                                                  <span className="fs-15 fw-600">
                                                    {customVal?.clicks || '-'}
                                                  </span>
                                                </td>
                                                <td
                                                  style={{
                                                    minWidth:
                                                      snapshot.isDragging
                                                        ? '165px'
                                                        : '',
                                                  }}
                                                >
                                                  <div className="d-flex justify-content-center">
                                                    <label className="form-check form-switch form-check-custom form-check-solid ">
                                                      <input
                                                        className="form-check-input form-check-success w-50px h-30px cursor-pointer"
                                                        type="checkbox"
                                                        name="notifications"
                                                        checked={
                                                          customVal.active
                                                        }
                                                        disabled={
                                                          !Method.hasPermission(
                                                            BannerConst,
                                                            Edit,
                                                            currentUser
                                                          )
                                                        }
                                                        onChange={() => {
                                                          handleStatus(
                                                            customVal,
                                                            customIndex
                                                          );
                                                        }}
                                                      />
                                                    </label>
                                                  </div>
                                                </td>
                                                <td
                                                  style={{
                                                    minWidth:
                                                      snapshot.isDragging
                                                        ? '50px'
                                                        : '',
                                                  }}
                                                >
                                                  {Method.hasPermission(
                                                    BannerConst,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <div className="my-0 ">
                                                      <div className="d-flex flex-nowrap justify-content-end align-items-center">
                                                        <button
                                                          className="btn btn-primary fs-14 fw-600 me-5"
                                                          style={{
                                                            whiteSpace:
                                                              'nowrap',
                                                          }}
                                                          onClick={() => {
                                                            handleDetails(
                                                              customVal
                                                            );
                                                          }}
                                                        >
                                                          {
                                                            DeliverString.viewDetails
                                                          }
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                                <td
                                                  onClick={() => {
                                                    if (
                                                      Method.hasPermission(
                                                        BannerConst,
                                                        Edit,
                                                        currentUser
                                                      ) ||
                                                      Method.hasPermission(
                                                        BannerConst,
                                                        Delete,
                                                        currentUser
                                                      )
                                                    ) {
                                                      openMenuOnClick(
                                                        customVal._id
                                                      );
                                                    }
                                                  }}
                                                >
                                                  {Method.hasPermission(
                                                    BannerConst,
                                                    Edit,
                                                    currentUser
                                                  ) ||
                                                  Method.hasPermission(
                                                    BannerConst,
                                                    Delete,
                                                    currentUser
                                                  ) ? (
                                                    <CustomSelectTable
                                                      marginLeft={'-100px'}
                                                      width="auto"
                                                      placeholder={
                                                        <img
                                                          className="img-fluid"
                                                          width={22}
                                                          height={5}
                                                          src={ThreeDotMenu}
                                                          alt=""
                                                        />
                                                      }
                                                      menuIsOpen={
                                                        customVal._id ===
                                                        bannerId
                                                      }
                                                      openMenuOnClick={() => {
                                                        openMenuOnClick(
                                                          customVal._id
                                                        );
                                                      }}
                                                      onMenuOpen={() => {
                                                        onMenuOpen(
                                                          customVal._id
                                                        );
                                                      }}
                                                      backgroundColor="transparent"
                                                      // openMenuOnClick={true}
                                                      options={options}
                                                      onChange={(
                                                        event: any
                                                      ) => {
                                                        handleOptionChange(
                                                          event,
                                                          customVal
                                                        );
                                                      }}
                                                    />
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )}
                                          </Draggable>
                                        );
                                      }
                                    )}
                                  </>
                                ) : (
                                  <tr>
                                    <td colSpan={6}>
                                      <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                        No Data Found
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            )}
                          </tbody>
                        </table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card.Body>
            </Card>
            {!loading && totalRecords > 0 ? (
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
        </Col>
      </Row>
    </>
  );
};
export default AllBanners;
