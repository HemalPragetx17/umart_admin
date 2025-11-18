import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  FormLabel,
  Nav,
  Popover,
  Row,
  Tab,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { KTSVG } from '../../../umart_admin/helpers';
import { OrdersDelivery, String } from '../../../utils/string';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CustomSelectTable2 } from '../../custom/Select/custom-select-table';
import AssignedDriver from '../../modals/assign-driver-orderDelivery';
import APICallService from '../../../api/apiCallService';
import {
  ordersDelivery,
  pickerEndPoints,
  placeOrder,
  product,
  routesPlanning,
} from '../../../api/apiEndPoints';
import { routesPlanningJSON } from '../../../api/apiJSON/routePlanning';
import {
  Add,
  DeliveryUser,
  Edit,
  Order,
  PAGE_LIMIT,
  View,
} from '../../../utils/constants';
import Loader from '../../../Global/loader';
import Method from '../../../utils/methods';
import Pagination from '../../../Global/pagination';
import { success } from '../../../Global/toast';
import {
  customerToast,
  ordersToast,
  placeOrderToast,
} from '../../../utils/toast';
import { CustomComponentSelect } from '../../custom/Select/CustomComponentSelect';
import { useAuth } from '../auth';
import { useDebounce } from '../../../utils/useDebounce';
import StarIcon from '../../../umart_admin/assets/media/svg_uMart/star.svg';
import ReviewRatingsModal from '../../modals/reivew-ratings';
import CustomDeleteModal from '../../modals/custom-delete-modal';
import CustomDateInput from '../../custom/Select/CustomDateInput';
import ReasonForReturnModal from '../../modals/reason-return-modal';
import OrderReportModal from '../../modals/reports/order-reports';
import InstantOrderDeliverModal from '../../modals/instant-order-deliver';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { listOrderDelivery } from '../../../utils/storeString';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { ordersTypeOptionJson } from '../../../utils/staticJSON';
import SelfPickModal from '../../modals/self-pick-modal';
import SelfOrderDeliverModal from '../../modals/self-order-deliver';
import CustomSuccessModal from '../../modals/common-success-modal';
import EditRequestDetailsModal from '../../modals/edit-request-details-modal';
const cancelledBy = ['Super admin', 'Sub admin', 'Customer'];
const AllOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(true);
  const [tabKey, setTabKey] = useState<any>(
    getKey(listOrderDelivery.tab) || '0'
  );
  const [assignedDriver, setAssignedDriver] = useState<any>(undefined);
  const [assignedDriverModal, setAssignedDriverModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [orderRoutes, setOrderRoutes] = useState<any>([]);
  const [page, setPage] = useState(getKey(listOrderDelivery.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(listOrderDelivery.limit) || PAGE_LIMIT
  );
  const [startDate, setStartDate] = useState<any>(
    getKey(listOrderDelivery.dateFilter)?.startDate
      ? new Date(getKey(listOrderDelivery.dateFilter)?.startDate)
      : null
  );
  const [endDate, setEndDate] = useState<any>(
    getKey(listOrderDelivery.dateFilter)?.endDate
      ? new Date(getKey(listOrderDelivery.dateFilter)?.endDate)
      : null
  );
  const [search, setSearch] = useState<string>(
    getKey(listOrderDelivery.search) || ''
  );
  const [orderList, setOrderList] = useState<any>([]);
  const [deliveryUsers, setDeliveryUsers] = useState<any>([]);
  const [selectedDeliveryUser, setSelectedDeliveryUser] = useState<any>(
    getKey(listOrderDelivery.deliveryUserFilter) || []
  );
  const [prevDeliveryUser, setPrevDeliveryUser] = useState<any>('');
  const [id, setId] = useState<any>();
  const [routeId, setRouteId] = useState<any>('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>();
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInstantDeliverModal, setShowInstantDeliverModal] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<any>(
    getKey(listOrderDelivery.orderTypeFilter) || ordersTypeOptionJson[0]
  );
  const [showSelfPickModal, setShowSelfPickModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [pickerList, setPickersList] = useState<any>([]);
  const [selectedPicker, setSelctedPicker] = useState<any>();
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showReqAcceptModal, setShowReqAcceptModal] = useState(false);
  const [showReqRejectModal, setShowReqRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [editableOrder, setEditableOrder] = useState<any>();
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      if (!Method.hasModulePermission(Order, currentUser)) {
        return window.history.back();
      }
      if (tabKey == 8) {
        await fetchEditedOrder(page, pageLimit);
      } else if (tabKey == 0) {
        await fetchDeliveryPlans(page, pageLimit, startDate, endDate);
      } else {
        let selectedTabIndices: any = [];
        selectedTabIndices = [parseInt(tabKey)];
        for (const tabIndex of selectedTabIndices) {
          await fetchDetails(
            page,
            pageLimit,
            getTabCategories(tabIndex),
            search,
            startDate,
            endDate,
            selectedDeliveryUser
          );
          await fetchDeliveryUsers();
        }
      }
      await fetchPickers();
      setFetchLoader(false);
      setTimeout(() => {
        const position = getKey(listOrderDelivery.orderDeliveryScrollPosition);
        window.scrollTo(0, position);
      }, 500);
    })();
  }, []);
  const fetchDeliveryPlans = async (
    pageNo: number,
    limit: number,
    fromDate?: string,
    toDate?: string
  ) => {
    setLoading(true);
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
      fromDate: fromDate
        ? Method.convertDateToFormat(fromDate, 'YYYY-MM-DD')
        : '',
      toDate: toDate ? Method.convertDateToFormat(toDate, 'YYYY-MM-DD') : '',
    };
    let apiService = new APICallService(
      routesPlanning.getPlan,
      routesPlanningJSON.listPlan(params),
      '',
      '',
      false,
      '',
      Order
    );
    let response: any = await apiService.callAPI();
    if (response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setOrderRoutes(response.records);
    }
    setLoading(false);
  };
  const fetchDetails = async (
    pageNo: number,
    limit: number,
    status?: any,
    search?: string,
    fromDate?: string,
    toDate?: string,
    deliveryUsers?: any
  ) => {
    setLoading(true);
    setFetchLoader(true);
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'statusUpdatedAt',
      sortOrder: -1,
      needCount: true,
      searchTerm: search ? search.trim() : '',
      fromDate: fromDate
        ? Method.convertDateToFormat(fromDate, 'YYYY-MM-DD')
        : '',
      toDate: toDate ? Method.convertDateToFormat(toDate, 'YYYY-MM-DD') : '',
    };
    if (status.length > 0) {
      status.map((val: any) => {
        params = { ...params, listType: val };
      });
    }
    if (deliveryUsers && deliveryUsers.length > 0 && status[0] != 5) {
      deliveryUsers.map((val: any, index: number) => {
        params = { ...params, ['deliveryUserId[' + index + ']']: val };
      });
    }
    let endpoint = ordersDelivery.list;
    let apiService = new APICallService(
      endpoint,
      params,
      '',
      '',
      false,
      '',
      Order
    );
    let response: any = await apiService.callAPI();
    if (response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setOrderList(response.records);
    }
    setLoading(false);
    setFetchLoader(false);
  };
  const fetchDeliveryUsers = async () => {
    const params = {
      date: Method.getTodayDate('YYYY-MM-DD'),
      state: 2,
    };
    const apiService = new APICallService(
      ordersDelivery.deliveryUsers,
      params,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      const temp = response.records.map((item: any) => {
        return {
          name: item.name,
          _id: item._id,
          value: item._id,
          image: item.image,
          assignedOrders: item?.assignedOrders || 0,
          label: (
            <>
              <img
                src={item.image}
                height={15}
                className="me-2"
                alt=""
              />
              <span className="fs-14 fw-500 text-black">{item.name}</span>
            </>
          ),
        };
      });
      setDeliveryUsers(temp);
    }
  };
  const fetchPickers = async () => {
    let params = {
      sortKey: 'createdAt',
      sortOrder: -1,
      state: 2,
    };
    let apiService = new APICallService(
      pickerEndPoints.listPicker,
      params,
      '',
      '',
      false,
      '',
      Order
    );
    let response = await apiService.callAPI();
    if (response) {
      const temp = response.records.map((item: any) => {
        return {
          name: item.name,
          _id: item._id,
          value: item._id,
          image: item.image,
          assignedOrders: item?.assignedOrders || 0,
          label: (
            <>
              <img
                src={item.image}
                height={15}
                className="me-2"
                alt=""
              />
              <span className="fs-14 fw-500 text-black">{item.name}</span>
            </>
          ),
        };
      });
      setPickersList(temp || []);
    }
  };
  const getTabCategories = (tabIndex: number) => {
    switch (tabIndex) {
      case 1:
        return [1];
      case 2:
        return [2];
      case 3:
        return [3];
      case 4:
        return [4];
      case 5:
        return [5];
      case 7:
        return selectedOrderType ? [selectedOrderType.value] : [8];
      default:
        return [];
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setFetchLoader(true);
    setPage(val);
    setKey(listOrderDelivery.page, val);
    if (tabKey == 8) {
      await fetchEditedOrder(val, pageLimit);
    } else if (tabKey == 0) {
      await fetchDeliveryPlans(val, pageLimit, startDate, endDate);
    } else {
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      for (const tabIndex of selectedTabIndices) {
        await fetchDetails(
          val,
          pageLimit,
          getTabCategories(tabIndex),
          search,
          startDate,
          endDate,
          selectedDeliveryUser
        );
      }
    }
    setFetchLoader(false);
  };
  const handleNextPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val + 1);
    setKey(listOrderDelivery.page, val + 1);
    await fetchDetails(val + 1, pageLimit, '');
    if (tabKey == 8) {
      await fetchEditedOrder(val + 1, pageLimit);
    } else if (tabKey == 0) {
      await fetchDeliveryPlans(val + 1, pageLimit, startDate, endDate);
    } else {
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      for (const tabIndex of selectedTabIndices) {
        await fetchDetails(
          val + 1,
          pageLimit,
          getTabCategories(tabIndex),
          search,
          startDate,
          endDate,
          selectedDeliveryUser
        );
      }
    }
    setFetchLoader(false);
  };
  const handlePreviousPage = async (val: number) => {
    setFetchLoader(true);
    setPage(val - 1);
    setKey(listOrderDelivery.page, val - 1);
    if (tabKey == 8) {
      await fetchEditedOrder(val - 1, pageLimit);
    } else if (tabKey == 0) {
      await fetchDeliveryPlans(val - 1, pageLimit, startDate, endDate);
    } else {
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      for (const tabIndex of selectedTabIndices) {
        await fetchDetails(
          val - 1,
          pageLimit,
          getTabCategories(tabIndex),
          search,
          startDate,
          endDate,
          selectedDeliveryUser
        );
      }
    }
    setFetchLoader(false);
  };
  const handlePageLimit = async (event: any) => {
    setFetchLoader(true);
    setPage(1);
    setKey(listOrderDelivery.page, 1);
    if (tabKey == 8) {
      await fetchEditedOrder(1, pageLimit);
    } else if (tabKey == 0) {
      await fetchDeliveryPlans(1, event.target.value, startDate, endDate);
    } else {
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      for (const tabIndex of selectedTabIndices) {
        await fetchDetails(
          1,
          event.target.value,
          getTabCategories(tabIndex),
          search,
          startDate,
          endDate,
          selectedDeliveryUser
        );
      }
    }
    await setPageLimit(parseInt(event.target.value));
    setKey(listOrderDelivery.limit, parseInt(event.target.value));
    setFetchLoader(false);
  };
  const handleDateFilter = async (event: any) => {
    setStartDate(event[0]);
    setEndDate(event[1]);
    setTotalRecords(0);
    setPage(1);
    setKey(listOrderDelivery.page, 1);
    const startDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[0], 'YYYY-MM-DD')
        : '';
    const endDateFormatted =
      event[0] && event[1]
        ? Method.convertDateToFormat(event[1], 'YYYY-MM-DD')
        : '';
    if (event[0] && event[1]) {
      setFetchLoader(true);
      if (tabKey == 8) {
        await fetchEditedOrder(page, pageLimit);
      } else if (tabKey == 0) {
        await fetchDeliveryPlans(
          1,
          pageLimit,
          startDateFormatted,
          endDateFormatted
        );
      } else {
        let selectedTabIndices: any = [];
        selectedTabIndices = [parseInt(tabKey)];
        for (const tabIndex of selectedTabIndices) {
          await fetchDetails(
            1,
            pageLimit,
            getTabCategories(tabIndex),
            search,
            startDateFormatted,
            endDateFormatted,
            selectedDeliveryUser
          );
        }
      }
      setKey(listOrderDelivery.dateFilter, {
        startDate: event[0],
        endDate: event[1],
        tab: tabKey,
      });
    } else if (event[0] === null && event[1] === null) {
      {
        setFetchLoader(true);
        if (tabKey == 8) {
          await fetchEditedOrder(page, pageLimit);
        } else if (tabKey == 0) {
          await fetchDeliveryPlans(
            1,
            pageLimit,
            startDateFormatted,
            endDateFormatted
          );
        } else {
          let selectedTabIndices: any = [];
          selectedTabIndices = [parseInt(tabKey)];
          for (const tabIndex of selectedTabIndices) {
            await fetchDetails(
              1,
              pageLimit,
              getTabCategories(tabIndex),
              search,
              startDateFormatted,
              endDateFormatted,
              selectedDeliveryUser
            );
          }
        }
      }
      removeKey(listOrderDelivery.dateFilter);
    }
    setFetchLoader(false);
  };
  const handleSelectDriver = (selectedDriver: any, orderVal: any) => {
    setAssignedDriver(selectedDriver);
    const temp = `${orderVal._id}/${orderVal?.routesUsers[0]?.routeUser}/${selectedDriver._id}`;
    setId(temp);
    setPrevDeliveryUser(orderVal?.routesUsers[0]?.deliveryUser.reference);
    setRouteId(orderVal?.routesUsers[0]?.route);
    setAssignedDriverModal(true);
  };
  const handleSave = async (
    id: string,
    routeId: string,
    oldDeliveryUserId: string
  ) => {
    const apiService = new APICallService(
      ordersDelivery.assignOrder,
      {
        oldDeliveryUserId: oldDeliveryUserId,
        routeId: routeId,
      },
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success(ordersToast.userAssign);
      setAssignedDriverModal(false);
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      await fetchDeliveryUsers();
      for (const tabIndex of selectedTabIndices) {
        await fetchDetails(
          page,
          pageLimit,
          getTabCategories(tabIndex),
          search,
          startDate,
          endDate
        );
      }
    }
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black border-r5px  text-white">
        <span>Under Development</span>
      </Popover.Body>
    </Popover>
  );
  const handleDeliveryUserFilter = async (event: any) => {
    const deliveryUsers: any = [];
    event.map((item: any) => {
      deliveryUsers.push(item.value);
    });
    //  setCategories(event);
    setSelectedDeliveryUser(deliveryUsers);
    setKey(listOrderDelivery.deliveryUserFilter, deliveryUsers);
    let selectedTabIndices: any = [];
    selectedTabIndices = [parseInt(tabKey)];
    setPage(1);
    setKey(listOrderDelivery.page, 1);
    for (const tabIndex of selectedTabIndices) {
      await fetchDetails(
        1,
        pageLimit,
        getTabCategories(tabIndex),
        search,
        startDate,
        endDate,
        deliveryUsers
      );
    }
    //  setIsFirst(false);
  };
  const debounce = useDebounce(fetchDetails, 300);
  const handleSearchTerm = async (input: string) => {
    input = input.trimStart();
    //const regex = /^(\w+( \w+)*)( {0,1})$/;
    const regex = /^(\w+( \w+)*)? ?$/;
    //const regex = /^(\S+( \S+)*)? ?$/;
    const isValid = regex.test(input);
    if (!isValid) {
      return;
    }
    setSearch(input);
    setPage(1);
    setKey(listOrderDelivery.page, 1);
    if (input.trim().length > 2 && search !== input) {
      setPage(1);
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      for (const tabIndex of selectedTabIndices) {
        await debounce(
          1,
          pageLimit,
          getTabCategories(tabIndex),
          input,
          startDate,
          endDate,
          selectedDeliveryUser
        );
      }
    } else if (input.trim().length <= 2 && input.length < search.length) {
      setPage(1);
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      for (const tabIndex of selectedTabIndices) {
        await debounce(
          1,
          pageLimit,
          getTabCategories(tabIndex),
          input,
          startDate,
          endDate,
          selectedDeliveryUser
        );
      }
    }
    setKey(listOrderDelivery.search, input);
  };
  const openDeleteModal = () => {
    setShowRatingModal(false);
    setShowDeleteModal(true);
  };
  const handleReviewDelete = async () => {
    const apiService = new APICallService(
      product.deleteProductRating,
      currentOrder?._id,
      '',
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success(customerToast.reviewDeleted);
      setShowDeleteModal(false);
      setPage(1);
      await fetchDetails(
        1,
        pageLimit,
        [4],
        search,
        startDate,
        endDate,
        selectedDeliveryUser
      );
    }
  };
  const handleRatingModalClose = async () => {
    setShowRatingModal(false);
    await fetchDetails(
      1,
      pageLimit,
      [4],
      search,
      startDate,
      endDate,
      selectedDeliveryUser
    );
  };
  const openActivateModal = () => {
    setShowRatingModal(false);
    setShowActivateModal(true);
  };
  const handleHideReview = async () => {
    const params = {
      activate: !currentOrder?.rating?.active ? 'true' : 'false',
    };
    const apiCallService = new APICallService(
      product.updateRatingStatus,
      params,
      { id: currentOrder?._id },
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      const message = !currentOrder?.rating?.active
        ? customerToast.reviewShows
        : customerToast.reviewHides;
      success(message);
      setShowActivateModal(false);
      setPage(1);
      await fetchDetails(
        1,
        pageLimit,
        [4],
        search,
        startDate,
        endDate,
        selectedDeliveryUser
      );
    }
  };
  const handleDeliverInstantOrder = async (id: any) => {
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
      success(placeOrderToast.orderDelivered);
      setShowInstantDeliverModal(false);
      await fetchDetails(1, pageLimit, [7], '', '', '');
    }
  };
  const handleOrderTypeChange = async (event: any) => {
    setPage(1);
    setKey(listOrderDelivery.page, 1);
    setKey(listOrderDelivery.orderTypeFilter, event);
    await fetchDetails(
      1,
      pageLimit,
      [event?.value || 7],
      search,
      startDate,
      endDate,
      ''
    );
    setSelectedOrderType(event);
  };
  const handleViewLoading = (data: any) => {
    setCurrentOrder(data);
    setShowSelfPickModal(true);
  };
  const handleSelfModalHide = () => {
    setShowSelfPickModal(false);
    // setCurrentOrder(undefined);
  };
  const handleSelfOrderDeliver = async (id: any, otp: any) => {
    const apiCallService = new APICallService(
      ordersDelivery.selftOrderDelivered,
      {
        paymentMode: 1,
        code: otp,
      },
      { id: id },
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(placeOrderToast.orderDelivered);
      setShowSelfPickModal(false);
      setCurrentOrder(undefined);
      await fetchDetails(1, pageLimit, [9], '', '', '');
      setPage(1);
    }
  };
  const handlePickerChange = (event: any, orderVal: any) => {
    setShowPickerModal(true);
    setSelctedPicker({
      name: event?.name || '',
      orderId: orderVal?._id,
      pickerId: event?._id,
    });
  };
  const handlePickerAssign = async () => {
    const apiService = new APICallService(
      ordersDelivery.assignPicker,
      {},
      {
        orderId: selectedPicker?.orderId,
        pickerId: selectedPicker?.pickerId,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiService.callAPI();
    if (response) {
      success('Assigned! Picker assigned successfully!');
      setShowPickerModal(false);
      setSelctedPicker(undefined);
      let selectedTabIndices: any = [];
      selectedTabIndices = [parseInt(tabKey)];
      await fetchPickers();
      for (const tabIndex of selectedTabIndices) {
        await fetchDetails(
          page,
          pageLimit,
          getTabCategories(tabIndex),
          search,
          startDate,
          endDate
        );
      }
    }
  };
 
  const fetchEditedOrder = async (pageNo: number, limit: number) => {
    setFetchLoader(true);
    setLoading(true);
    const params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      needCount: true,
    };
    const apiCallService = new APICallService(
      ordersDelivery.editedOrderList,
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
        if (response.total) {
          setTotalRecords(response.total);
        } else {
          setTotalRecords(0);
        }
        setOrderList(response.records);
      }
    }
    setFetchLoader(false);
    setLoading(false);
  };
  const handleAcceptEditRequest = async (id: string) => {
    const apiCallService = new APICallService(
      ordersDelivery.acceptEditOrder,
      {},
      {
        id: id,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(ordersToast.editReqAccepted);
      setShowReqAcceptModal(false);
      setEditableOrder(undefined);
      setPage(1);
      await fetchEditedOrder(1, pageLimit);
    }
  };
  const handleRejectEditRequest = async (id: string) => {
    const apiCallService = new APICallService(
      ordersDelivery.rejectEditOrder,
      {},
      {
        id: id,
      },
      '',
      false,
      '',
      Order
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(ordersToast.editReqRejected);
      setShowReqRejectModal(false);
      setEditableOrder(undefined);
      setPage(1);
      await fetchEditedOrder(1, pageLimit);
    }
  };
  return (
    <>
      {selectedOrder && (
        <EditRequestDetailsModal
          show={!!selectedOrder}
          orderDetails={selectedOrder}
          onHide={() => setSelectedOrder(undefined)}
        />
      )}
      {showReqAcceptModal && editableOrder && (
        <CustomSuccessModal
          show={showReqAcceptModal}
          btnTitle="Yes, Accept"
          handleSave={async () => {
            await handleAcceptEditRequest(editableOrder?._id);
          }}
          onHide={() => {
            setShowReqAcceptModal(false);
            setEditableOrder(undefined);
          }}
          title="Are you sure you want to accept this request ?"
        />
      )}
      {showReqRejectModal && editableOrder && (
        <CustomDeleteModal
          show={showReqRejectModal}
          onHide={() => {
            setShowReqRejectModal(false);
            setEditableOrder(undefined);
          }}
          title="Are you sure you want to reject this request ?"
          btnTitle="Yes, Reject"
          handleDelete={async () => {
            await handleRejectEditRequest(editableOrder?._id);
          }}
        />
      )}
      {showPickerModal && selectedPicker ? (
        <CustomSuccessModal
          show={showPickerModal}
          onHide={() => {
            setShowPickerModal(false);
            setSelctedPicker(undefined);
          }}
          title={`Are you sure you want assign this order to picker ${
            selectedPicker?.name || ''
          }`}
          btnTitle="Yes, Assign"
          handleSave={handlePickerAssign}
        />
      ) : (
        <></>
      )}
      {showDeliveredModal && currentOrder ? (
        <SelfOrderDeliverModal
          show={showDeliveredModal}
          onHide={() => {
            setShowDeliveredModal(false);
            setCurrentOrder(undefined);
          }}
          data={currentOrder}
          handleSubmit={handleSelfOrderDeliver}
        />
      ) : (
        <></>
      )}
      {showSelfPickModal && currentOrder ? (
        <SelfPickModal
          show={showSelfPickModal}
          onHide={handleSelfModalHide}
          data={currentOrder}
          openDeliverModal={() => {
            setShowDeliveredModal(true);
            setShowSelfPickModal(false);
          }}
        />
      ) : (
        <></>
      )}
      {showInstantDeliverModal && currentOrder ? (
        <InstantOrderDeliverModal
          show={showInstantDeliverModal}
          onHide={() => {
            setShowInstantDeliverModal(false);
            setCurrentOrder(undefined);
          }}
          id={currentOrder._id}
          handleDeliver={handleDeliverInstantOrder}
        />
      ) : (
        <></>
      )}
      {showReasonModal && currentOrder ? (
        <ReasonForReturnModal
          show={showReasonModal}
          onHide={() => setShowReasonModal(false)}
          isPartial={true}
          title="Reason of cancellation"
          reason={currentOrder?.message || ''}
          background="bg-light-danger"
        />
      ) : (
        <></>
      )}
      {showRatingModal ? (
        <ReviewRatingsModal
          show={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          title="Ratings & Review"
          openDeleteModal={openDeleteModal}
          openActivateModal={openActivateModal}
          data={currentOrder}
          onClose={handleRatingModalClose}
          fromOrdersDelivery={true}
        />
      ) : (
        <></>
      )}
      {showDeleteModal ? (
        <CustomDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          title="Are you sure you want to delete this review?"
          btnTitle="Yes,Delete"
          handleDelete={handleReviewDelete}
        />
      ) : (
        <></>
      )}
      {showActivateModal && currentOrder ? (
        <CustomDeleteModal
          show={showActivateModal}
          onHide={() => setShowActivateModal(false)}
          title={`Are you sure you want to ${
            currentOrder?.rating?.active ? 'hide' : 'show'
          } this review?`}
          btnTitle={`Yes,${currentOrder?.rating?.active ? ' Hide' : ' Show'} `}
          handleDelete={handleHideReview}
        />
      ) : (
        <></>
      )}
      {showReportModal ? (
        <OrderReportModal
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
        />
      ) : (
        <></>
      )}
      {assignedDriverModal &&
      id &&
      assignedDriver &&
      routeId &&
      prevDeliveryUser ? (
        <AssignedDriver
          selectedDriver={assignedDriver}
          show={assignedDriverModal}
          oldDeliveryUserId={prevDeliveryUser}
          routeId={routeId}
          onHide={() => {
            setAssignedDriverModal(false);
            setId(undefined);
            setPrevDeliveryUser(undefined);
            setRouteId(undefined);
          }}
          onSave={handleSave}
          loading={loading}
          id={id}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center g-md-5 g-3 mb-7">
        <Col xs>
          <h1 className="fs-22 fw-bolder">{OrdersDelivery.pageTitle}</h1>
        </Col>
        {Method.hasModulePermission(Order, currentUser) ? (
          <>
            {tabKey === '0' ? (
              <Col
                md={6}
                lg={4}
                sm={12}
                className="text-end"
              >
                <DatePicker
                  className="form-control bg-light border border-r8px min-h-60px fs-15 fw-bold text-dark min-w-xl-250px min-w-250px min-w-lg-300px min-w-md-325px min-w-xs-288px "
                  selected={startDate}
                  onChange={handleDateFilter}
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  showFullMonthYearPicker
                  placeholderText="Filter by dates"
                  isClearable={true}
                  showYearDropdown={true}
                  scrollableYearDropdown={true}
                  dropdownMode="select"
                  customInput={<CustomDateInput />}
                />
              </Col>
            ) : (
              <></>
            )}
            <Col xs="auto">
              <Button
                variant="primary"
                className="btn-lg me-3"
                onClick={() => setShowReportModal(true)}
                disabled={fetchLoader}
              >
                <span className="indicator-label fs-16 fw-bold">
                  {'Download report'}
                </span>
              </Button>
              {Method.hasPermission(Order, Add, currentUser) ? (
                <Button
                  variant="primary"
                  className="btn-lg"
                  onClick={() => navigate('add-new-order')}
                  disabled={fetchLoader}
                >
                  <span className="indicator-label fs-16 fw-bold">
                    {'Add new order'}
                  </span>
                </Button>
              ) : (
                <></>
              )}
            </Col>
            {tabKey !== '0' && tabKey !== '8' ? (
              <Col xs={12}>
                <Card className="bg-light border mb-7">
                  <Card.Body className="px-7">
                    <Row className="align-items-center g-5">
                      <Col
                        md={6}
                        lg={4}
                        sm={12}
                      >
                        <FormLabel className="fs-16 fw-500 text-dark">
                          {OrdersDelivery.searchTitle}
                        </FormLabel>
                        <div className="d-flex align-items-center position-relative me-lg-4">
                          <KTSVG
                            path="/media/icons/duotune/general/gen021.svg"
                            className="svg-icon-3 position-absolute ms-3"
                          />
                          <input
                            type="text"
                            id="kt_filter_search"
                            className="form-control form-control-white min-h-60px form-control-lg ps-10"
                            placeholder={OrdersDelivery.searchInput}
                            value={search}
                            onChange={(event: any) => {
                              handleSearchTerm(event.target.value.trimStart());
                            }}
                            // onKeyUp={handleOnKeyUp}
                          />
                        </div>
                      </Col>
                      {tabKey !== '5' && tabKey !== '7' ? (
                        <Col
                          md={6}
                          lg={4}
                          sm={12}
                        >
                          {' '}
                          <FormLabel className="fs-16 fw-500 text-dark">
                            {OrdersDelivery.filterSelect}
                          </FormLabel>
                          <CustomComponentSelect
                            isLoading={loading}
                            hideSelectedOptions={false}
                            closeMenuOnSelect={false}
                            isSearchable={true}
                            value={deliveryUsers
                              .map((val: any) => {
                                return {
                                  ...val,
                                  value: val._id,
                                  name: val.name,
                                  id: val._id,
                                  label: (
                                    <>
                                      <div className="symbol symbol-40px symbol-circle border me-2">
                                        <img
                                          src={val.image}
                                          className="object-fit-contain"
                                          alt=""
                                        />
                                      </div>
                                      <label
                                        className="form-check-label fs-16 fw-600 text-dark"
                                        htmlFor="Ex2"
                                      >
                                        {val.name}
                                      </label>
                                    </>
                                  ),
                                  title: val.name,
                                  img: val.image,
                                };
                              })
                              .filter((item: any) => {
                                return selectedDeliveryUser.length > 0
                                  ? selectedDeliveryUser.includes(item.id)
                                  : false;
                              })}
                            options={deliveryUsers.map((val: any) => {
                              return {
                                ...val,
                                value: val._id,
                                name: val.name,
                                id: val._id,
                                label: (
                                  <>
                                    <div className="symbol symbol-40px symbol-circle border me-2">
                                      <img
                                        src={val.image}
                                        className="object-fit-contain"
                                        alt=""
                                      />
                                    </div>
                                    <label
                                      className="form-check-label fs-16 fw-600 text-dark"
                                      htmlFor="Ex2"
                                    >
                                      {val.name}
                                    </label>
                                  </>
                                ),
                                title: val.name,
                              };
                            })}
                            onChange={(event: any) => {
                              handleDeliveryUserFilter(event);
                            }}
                            isMulti={true}
                          />
                        </Col>
                      ) : (
                        <></>
                      )}
                      <Col
                        md={6}
                        lg={4}
                        sm={12}
                      >
                        <FormLabel className="fs-16 fw-500 text-dark">
                          {OrdersDelivery.filterDate}
                        </FormLabel>
                        <DatePicker
                          className="form-control bg-white min-h-60px fs-15 fw-bold text-dark min-w-xl-300px min-w-250px min-w-lg-200px min-w-md-325px min-w-xs-288px "
                          selected={startDate}
                          onChange={handleDateFilter}
                          selectsRange
                          startDate={startDate}
                          endDate={endDate}
                          dateFormat="dd/MM/yyyy"
                          showFullMonthYearPicker
                          placeholderText="Filter by dates"
                          isClearable={true}
                          showYearDropdown={true}
                          scrollableYearDropdown={true}
                          dropdownMode="select"
                          customInput={<CustomDateInput />}
                          // disabled={fetchLoader}
                        />
                      </Col>
                      {tabKey === '7' ? (
                        <Col
                          md={6}
                          lg={4}
                          sm={12}
                        >
                          <FormLabel className="fs-16 fw-500 text-dark">
                            {'Filter by order type'}
                          </FormLabel>
                          <CustomSelectWhite
                            value={selectedOrderType}
                            // isDisabled={loading}
                            options={ordersTypeOptionJson}
                            onChange={(event: any) => {
                              handleOrderTypeChange(event);
                            }}
                            isSearchable={false}
                            isMulti={false}
                          />
                        </Col>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <></>
            )}
            <Col xs={12}>
              <div className="custom-tabContainer">
                <Tab.Container
                  activeKey={tabKey}
                  onSelect={async (k) => {
                    setTabKey(k);
                    setKey(listOrderDelivery.tab, k);
                    // setStartDate(null);
                    // setEndDate(null);
                    setTotalRecords(0);
                    setOrderRoutes([]);
                    setCurrentOrder(undefined);
                    setFetchLoader(true);
                    // setSearch('');
                    // setSelectedDeliveryUser([]);
                    setPage(1);
                    setKey(listOrderDelivery.page, 1);
                    // removeKey(listOrderDelivery.deliveryUserFilter);
                    // removeKey(listOrderDelivery.dateFilter);
                    switch (k) {
                      case '0':
                        await fetchDeliveryPlans(
                          1,
                          pageLimit,
                          startDate,
                          endDate
                        );
                        break;
                      case '1':
                        await fetchDetails(
                          1,
                          pageLimit,
                          [1],
                          search,
                          startDate,
                          endDate,
                          selectedDeliveryUser
                        );
                        await fetchDeliveryUsers();
                        break;
                      case '2':
                        await fetchDetails(
                          1,
                          pageLimit,
                          [2],
                          search,
                          startDate,
                          endDate,
                          selectedDeliveryUser
                        );
                        await fetchDeliveryUsers();
                        break;
                      case '3':
                        await fetchDetails(
                          1,
                          pageLimit,
                          [3],
                          search,
                          startDate,
                          endDate,
                          selectedDeliveryUser
                        );
                        await fetchDeliveryUsers();
                        break;
                      case '4':
                        await fetchDetails(
                          1,
                          pageLimit,
                          [4],
                          search,
                          startDate,
                          endDate,
                          selectedDeliveryUser
                        );
                        await fetchDeliveryUsers();
                        break;
                      case '5':
                        await fetchDetails(
                          1,
                          pageLimit,
                          [5],
                          search,
                          startDate,
                          endDate,
                          selectedDeliveryUser
                        );
                        await fetchDeliveryUsers();
                        break;
                      case '7':
                        await fetchDetails(
                          1,
                          pageLimit,
                          getTabCategories(7),
                          search,
                          startDate,
                          endDate,
                          ''
                        );
                        await fetchDeliveryUsers();
                        break;
                      case '8':
                        await fetchEditedOrder(1, pageLimit);
                        break;
                      default:
                        break;
                    }
                    setFetchLoader(false);
                  }}
                >
                  <Row className="align-items-center variant-categories">
                    <Col
                      lg={'auto'}
                      className="mb-6"
                    >
                      <div className="bg-light border border-r8px p-3 px-md-6 ">
                        <Nav
                          variant="pills"
                          className="nav-scroll pb-4"
                        >
                          <Nav.Item>
                            <Nav.Link
                              eventKey={8}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(8);
                                setKey(listOrderDelivery.tab, 8);
                              }}
                            >
                              {OrdersDelivery.editRequeset}
                              {tabKey == '8'}
                            </Nav.Link>
                            <Nav.Link
                              eventKey={0}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(0);
                                setKey(listOrderDelivery.tab, 0);
                              }}
                            >
                              {OrdersDelivery.tabDeliveries}
                              {tabKey == '0'}
                            </Nav.Link>
                            <Nav.Link
                              eventKey={1}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(1);
                                setKey(listOrderDelivery.tab, 1);
                              }}
                            >
                              {OrdersDelivery.tabNewOrder}
                              {tabKey == '1'}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={2}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(2);
                                setKey(listOrderDelivery.tab, 2);
                              }}
                            >
                              {OrdersDelivery.tabProgress}
                              {tabKey == '2'
                                ? totalRecords > 0
                                  ? '(' + totalRecords + ')'
                                  : ''
                                : ''}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={3}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(3);
                                setKey(listOrderDelivery.tab, 3);
                              }}
                            >
                              {OrdersDelivery.tabDelivery}
                              {tabKey == '3'
                                ? totalRecords > 0
                                  ? '(' + totalRecords + ')'
                                  : ''
                                : ''}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={4}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(4);
                                setKey(listOrderDelivery.tab, 4);
                              }}
                            >
                              {OrdersDelivery.tabDelivered}
                              {tabKey == '4'
                                ? totalRecords > 0
                                  ? '(' + totalRecords + ')'
                                  : ''
                                : ''}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={5}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(5);
                                setKey(listOrderDelivery.tab, 5);
                              }}
                            >
                              {OrdersDelivery.tabCancelled}
                              {tabKey == '5'
                                ? totalRecords > 0
                                  ? '(' + totalRecords + ')'
                                  : ''
                                : ''}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={7}
                              disabled={fetchLoader}
                              onClick={() => {
                                setTabKey(7);
                              }}
                            >
                              {'Other orders'}
                              {tabKey == '7'
                                ? totalRecords > 0
                                  ? '(' + totalRecords + ')'
                                  : ''
                                : ''}
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <Tab.Content>
                        <Tab.Pane
                          eventKey={0}
                          active={tabKey == 0}
                        >
                          {tabKey == 0 && !fetchLoader ? (
                            orderRoutes && orderRoutes.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px px-10">
                                              {OrdersDelivery.headingDate}
                                            </th>
                                            <th className="min-w-125px text-center">
                                              {
                                                OrdersDelivery.headingTotalOrders
                                              }
                                            </th>
                                            <th className="min-w-150px text-center">
                                              {OrdersDelivery.headingProducts}
                                            </th>
                                            <th className="min-w-100 text-center">
                                              {OrdersDelivery.headingTotalUser}
                                            </th>
                                            <th className="min-w-150px text-center">
                                              {OrdersDelivery.headingStatus}
                                            </th>
                                            <th className="min-w-25px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderRoutes.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYY(
                                                        orderVal.date
                                                      )}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="text-center">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {orderVal.totalOrders}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="text-center">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {orderVal.totalProducts}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="text-center">
                                                    <span className="fs-15 fw-600">
                                                      {
                                                        orderVal.assignedDeliveryBoyCount
                                                      }
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="text-center">
                                                    <span className="badge bg-e5f6de border-r4px p-3 fs-15 fw-600 text-dark ">
                                                      {orderVal.totalDeliveredOrders +
                                                        ' ' +
                                                        `${
                                                          orderVal.totalDeliveredOrders <=
                                                          1
                                                            ? String.singleOrderDelivered
                                                            : String.ordersDelivered
                                                        }`}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-15 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        setKey(
                                                          listOrderDelivery.orderDeliveryScrollPosition,
                                                          window.scrollY
                                                        );
                                                        navigate(
                                                          '/orders/delivery-details',
                                                          {
                                                            state: orderVal,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading &&
                                orderRoutes &&
                                orderRoutes.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        Generated Delivery plans will be shown
                                        in this section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={loading || fetchLoader} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={1}
                          active={tabKey == 1}
                        >
                          {tabKey == 1 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingDelivery}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.assignedPicker}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-12">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td>
                                                  <div className="w-175px">
                                                    <CustomSelectTable2
                                                      options={deliveryUsers}
                                                      // onChange={(e: any) => {
                                                      //   handleAssignDriver(
                                                      //     e,
                                                      //     index,
                                                      //     val._id
                                                      //   );
                                                      // }}
                                                      onChange={(
                                                        selectedOption: any,
                                                        index: any
                                                      ) =>
                                                        handleSelectDriver(
                                                          selectedOption,
                                                          orderVal
                                                        )
                                                      }
                                                      value={deliveryUsers?.find(
                                                        (item: any) =>
                                                          item._id ===
                                                          orderVal
                                                            ?.routesUsers[0]
                                                            ?.deliveryUser
                                                            .reference
                                                      )}
                                                      isMulti={false}
                                                      isDisabled={
                                                        !Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="w-175px">
                                                    <CustomSelectTable2
                                                      options={pickerList}
                                                      // onChange={(e: any) => {
                                                      //   handleAssignDriver(
                                                      //     e,
                                                      //     index,
                                                      //     val._id
                                                      //   );
                                                      // }}
                                                      onChange={(
                                                        selectedOption: any,
                                                        index: any
                                                      ) =>
                                                        handlePickerChange(
                                                          selectedOption,
                                                          orderVal
                                                        )
                                                      }
                                                      value={
                                                        pickerList?.find(
                                                          (item: any) =>
                                                            item._id ===
                                                            orderVal?.picker
                                                              ?.reference
                                                        ) || null
                                                      }
                                                      isMulti={false}
                                                      isDisabled={
                                                        !Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-14 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        navigate(
                                                          '/orders/order-details',
                                                          {
                                                            state: orderVal,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        New orders / Unprocessed orders will be
                                        shown in this section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={2}
                          active={tabKey == 2}
                        >
                          {tabKey == 2 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingDelivery}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td>
                                                  <div className="w-175px">
                                                    <CustomSelectTable2
                                                      options={deliveryUsers}
                                                      onChange={(
                                                        selectedOption: any,
                                                        index: any
                                                      ) =>
                                                        handleSelectDriver(
                                                          selectedOption,
                                                          orderVal
                                                        )
                                                      }
                                                      value={deliveryUsers?.find(
                                                        (item: any) =>
                                                          item._id ===
                                                          orderVal
                                                            ?.routesUsers[0]
                                                            ?.deliveryUser
                                                            .reference
                                                      )}
                                                      isMulti={false}
                                                      isDisabled={
                                                        !Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-14 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        navigate(
                                                          '/orders/order-details',
                                                          {
                                                            state: orderVal,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        Processed orders will be shown in this
                                        section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={3}
                          active={tabKey == 3}
                        >
                          {tabKey == 3 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingDelivery}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td>
                                                  <div className="w-175px">
                                                    <CustomSelectTable2
                                                      options={deliveryUsers}
                                                      onChange={(
                                                        selectedOption: any,
                                                        index: any
                                                      ) =>
                                                        handleSelectDriver(
                                                          selectedOption,
                                                          orderVal
                                                        )
                                                      }
                                                      value={deliveryUsers.find(
                                                        (item: any) =>
                                                          item._id ===
                                                          orderVal
                                                            ?.routesUsers[0]
                                                            ?.deliveryUser
                                                            .reference
                                                      )}
                                                      isMulti={false}
                                                      isDisabled={
                                                        !Method.hasPermission(
                                                          Order,
                                                          Edit,
                                                          currentUser
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-14 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        navigate(
                                                          '/orders/order-details',
                                                          {
                                                            state: orderVal,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        Out for delivery orders will be shown in
                                        this section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={4}
                          active={tabKey == 4}
                        >
                          {tabKey == 4 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingDelivery}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-100px">
                                              Ratings
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td>
                                                  {orderVal?.routesUsers
                                                    .length ? (
                                                    <div className="w-175px">
                                                      <img
                                                        src={
                                                          orderVal
                                                            ?.routesUsers[0]
                                                            ?.deliveryUser.image
                                                        }
                                                        height={24}
                                                        className="me-2"
                                                        alt=""
                                                      />
                                                      <span className="fs-15 fw-500 text-black">
                                                        {
                                                          orderVal
                                                            ?.routesUsers[0]
                                                            ?.deliveryUser.name
                                                        }
                                                      </span>
                                                    </div>
                                                  ) : (
                                                    <div className="w-175px">
                                                      {orderVal?.instantOrder ? (
                                                        <span className="fs-15 fw-500 text-black">
                                                          Instant Order
                                                        </span>
                                                      ) : (
                                                        <></>
                                                      )}
                                                      {orderVal?.selfPickedUp ? (
                                                        <span className="fs-15 fw-500 text-black">
                                                          Self Pickup Order
                                                        </span>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </div>
                                                  )}
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td className="text-start justify-content-between align-items-center">
                                                  {orderVal?.rating?.rate &&
                                                  !orderVal?.rating?.deleted ? (
                                                    <div className="rating">
                                                      <div
                                                        className="fs-4 fw-500 text-decoration-underline cursor-pointer me-1"
                                                        onClick={() => {
                                                          setCurrentOrder(
                                                            orderVal
                                                          );
                                                          setShowRatingModal(
                                                            true
                                                          );
                                                        }}
                                                      >
                                                        {orderVal?.rating
                                                          ?.rate + '.0'}
                                                      </div>
                                                      <div className="rating-label checked">
                                                        <KTSVG
                                                          path={StarIcon}
                                                          className="svg-icon svg-icon-1 w-30px h-40px"
                                                        />
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <span className="fs-20 fw-600 ">
                                                      -
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-14 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        navigate(
                                                          '/orders/order-details',
                                                          {
                                                            state: orderVal,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        Delivered orders will be shown in this
                                        section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={5}
                          active={tabKey == 5}
                        >
                          {tabKey == 5 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCancelBy}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td className="w-175px fs-16">
                                                  <div
                                                    className=" fw-600 text-decoration-underline cursor-pointer"
                                                    onClick={() => {
                                                      if (
                                                        !Method.hasPermission(
                                                          Order,
                                                          View,
                                                          currentUser
                                                        )
                                                      ) {
                                                        return;
                                                      }
                                                      setShowReasonModal(true);
                                                      setCurrentOrder(orderVal);
                                                    }}
                                                  >
                                                    {orderVal?.cancelledBy
                                                      ?.userType
                                                      ? cancelledBy[
                                                          orderVal?.cancelledBy
                                                            ?.userType - 1
                                                        ]
                                                      : ''}
                                                  </div>
                                                  <div className="fs-15 text-gray-600 fw-500">
                                                    {Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
                                                      orderVal.statusUpdatedAt,
                                                      '-'
                                                    )}
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-14 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        navigate(
                                                          '/orders/order-details',
                                                          {
                                                            state: orderVal,
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        Cancelled orders will be shown in this
                                        section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={7}
                          active={tabKey == 7}
                        >
                          {tabKey == 7 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-100px">
                                              {'Ratings'}
                                            </th>
                                            {/* <th className="min-w-125px text-end"></th> */}
                                            <th className="min-w-400px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td className="text-start justify-content-between align-items-center">
                                                  {orderVal?.rating?.rate &&
                                                  !orderVal?.rating?.deleted ? (
                                                    <div className="rating">
                                                      <div
                                                        className="fs-4 fw-500 text-decoration-underline cursor-pointer me-1"
                                                        onClick={() => {
                                                          setCurrentOrder(
                                                            orderVal
                                                          );
                                                          setShowRatingModal(
                                                            true
                                                          );
                                                        }}
                                                      >
                                                        {orderVal?.rating
                                                          ?.rate + '.0'}
                                                      </div>
                                                      <div className="rating-label checked">
                                                        <KTSVG
                                                          path={StarIcon}
                                                          className="svg-icon svg-icon-1 w-30px h-40px"
                                                        />
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <span className="fs-20 fw-600 ">
                                                      -
                                                    </span>
                                                  )}
                                                </td>
                                                {/* <td className="text-end">
                                                  {orderVal?.status == 4 ? (
                                                    <span className="badge bg-fff4d9 fs-16 fw-600 text-dark p-3 px-4 ms-6">
                                                      Delivered
                                                    </span>
                                                  ) : (
                                                    <Button
                                                      className="fs-15 fw-600 me-2"
                                                      variant="light-primary"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        setCurrentOrder(
                                                          orderVal
                                                        );
                                                        setShowInstantDeliverModal(
                                                          true
                                                        );
                                                      }}
                                                    >
                                                      {'Mark as delivered'}
                                                    </Button>
                                                  )}
                                                </td> */}
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <>
                                                      {selectedOrderType.value ===
                                                      9 ? (
                                                        <Button
                                                          variant="primary"
                                                          className="fs-14 fw-600 me-4 mb-1"
                                                          style={{
                                                            whiteSpace:
                                                              'nowrap',
                                                          }}
                                                          onClick={() => {
                                                            handleViewLoading(
                                                              orderVal
                                                            );
                                                          }}
                                                        >
                                                          {'View goods loading'}
                                                        </Button>
                                                      ) : (
                                                        <></>
                                                      )}
                                                      <Button
                                                        variant="primary"
                                                        className="fs-14 fw-600 mb-1"
                                                        style={{
                                                          whiteSpace: 'nowrap',
                                                        }}
                                                        onClick={() => {
                                                          navigate(
                                                            '/orders/order-details',
                                                            {
                                                              state: orderVal,
                                                            }
                                                          );
                                                        }}
                                                      >
                                                        {
                                                          OrdersDelivery.viewDetails
                                                        }
                                                      </Button>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        Other orders will be shown in this
                                        section.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                        <Tab.Pane
                          eventKey={8}
                          active={tabKey == 8}
                        >
                          {tabKey == 8 && !fetchLoader ? (
                            orderList && orderList.length ? (
                              <>
                                <Card className="border border-r10px">
                                  <Card.Body className="p-0">
                                    <div className="table-responsive">
                                      <table className="table table-rounded table-row-bordered align-middle gs-7 gy-6 mb-0">
                                        <thead>
                                          <tr className="fs-16 fw-bold text-dark border-bottom h-70px align-middle">
                                            <th className="min-w-125px">
                                              {OrdersDelivery.headingOrder}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingCustomer}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingUnits}
                                            </th>
                                            <th className="min-w-100px">
                                              {OrdersDelivery.headingAmount}
                                            </th>
                                            <th className="min-w-100px">
                                              {'Actions'}
                                            </th>
                                            <th className="min-w-125px text-end"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderList.map(
                                            (
                                              orderVal: any,
                                              goodIndex: number
                                            ) => (
                                              <tr key={orderVal._id}>
                                                <td>
                                                  <div className="d-flex align-items-center flex-row">
                                                    <span className="fs-15 fw-600 ms-3">
                                                      {Method.convertDateToDDMMYYYYHHMMAMPM(
                                                        orderVal._createdAt
                                                      )}
                                                      <br />
                                                      <span className="text-muted fw-semibold text-muted d-block fs-12">
                                                        {'#' + orderVal.refKey}
                                                      </span>
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600 ms-3">
                                                    {orderVal.customer.name}
                                                  </span>
                                                </td>
                                                <td>
                                                  <span className="fs-15 fw-600">
                                                    {`${
                                                      orderVal?.orderedQuantities ||
                                                      0
                                                    } ${
                                                      orderVal?.orderedQuantities <=
                                                      1
                                                        ? String.singleUnit
                                                        : String.unit
                                                    }`}
                                                  </span>
                                                </td>
                                                <td>
                                                  {' '}
                                                  <span className="fs-15 fw-600">
                                                    {String.TSh +
                                                      ' ' +
                                                      Method.formatCurrency(
                                                        orderVal.payment
                                                          .totalCharge
                                                      )}
                                                  </span>
                                                </td>
                                                <td>
                                                  {Method.hasPermission(
                                                    Order,
                                                    Edit,
                                                    currentUser
                                                  ) ? (
                                                    <div className="text-nowrap">
                                                      <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="fs-14 px-5 py-2 fw-400 me-4"
                                                        onClick={() => {
                                                          setShowReqAcceptModal(
                                                            true
                                                          );
                                                          setEditableOrder(
                                                            orderVal
                                                          );
                                                        }}
                                                      >
                                                        Accept
                                                      </Button>
                                                      <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="fs-14 px-5 py-2 fw-400"
                                                        onClick={() => {
                                                          setShowReqRejectModal(
                                                            true
                                                          );
                                                          setEditableOrder(
                                                            orderVal
                                                          );
                                                        }}
                                                      >
                                                        Reject
                                                      </Button>
                                                    </div>
                                                  ) : (
                                                    '-'
                                                  )}
                                                </td>
                                                <td className="text-end">
                                                  {Method.hasPermission(
                                                    Order,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="fs-14 fw-600"
                                                      style={{
                                                        whiteSpace: 'nowrap',
                                                      }}
                                                      onClick={() => {
                                                        setSelectedOrder(
                                                          orderVal
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        OrdersDelivery.viewDetails
                                                      }
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Card.Body>
                                </Card>{' '}
                                {!loading && orderList && orderList.length ? (
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
                                {startDate && endDate ? (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-r10px mb-6">
                                    <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                      <span className="fs-18 fw-500">
                                        No Data Found
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div className="border border-r10px mb-6">
                              <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
                                <Loader loading={fetchLoader || loading} />
                              </div>
                            </div>
                          )}
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </Col>
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
};
export default AllOrders;
