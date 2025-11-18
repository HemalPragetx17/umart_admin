import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import InventorIcon from '../../../umart_admin/assets/media/product-inventory.svg';
import {
  Delete,
  Edit,
  GoodsInWarehouseConst,
  Inventory,
  Product,
  Units,
} from '../../../utils/constants';
import cartoon from '../../../umart_admin/assets/media/product/cartoon.png';
import TabProductDetails from './tabs/tab-product-details';
import ProductInventoryHistory from './tabs/tab-product-inventory';
import ProductStockDetails from './tabs/tab-product-stock-details';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import APICallService from '../../../api/apiCallService';
import { product, reports } from '../../../api/apiEndPoints';
import { success } from '../../../Global/toast';
import { String, productString } from '../../../utils/string';
import DeleteModalCommon from '../../modals/delete-modal-comman';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { useAuth } from '../auth';
import Method from '../../../utils/methods';
import TabRatingReview from './tabs/tab-ratings';
import { productDetailsStore } from '../../../utils/storeString';
import ReportTypeModal from '../../modals/report-type-modal';
const ProductDetails = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location = useLocation();
  const temp: any = location.state;
  const [state, setState] = useState<any>(getKey('product') || temp);
  const [stateData, setStateData] = useState<any>();
  const [fetchLoader, setFetchLoader] = useState(false);
  const [productDetails, setProductDetails] = useState<any>();
  const [deleteProductId, setDeleteProductId] = useState<string | undefined>(
    ''
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState<any>();
  const [isDownloading, setIsDownloading] = useState(false);
  const [tab, setTab] = useState([
    {
      name: 'Product details',
      content: <TabProductDetails productDetails={productDetails} />,
    },
    {
      name: 'History of inventory',
      content: <ProductInventoryHistory productDetails={productDetails} />,
    },
    {
      name: 'Stock details',
      content: <ProductStockDetails productDetails={productDetails} />,
    },
    {
      name: 'Ratings and reviews',
      content: <TabRatingReview productDetails={productDetails} />,
    },
  ]);
  const [currentTab, setCurrentTab] = useState(tab[0]);
  const [options, setOptions] = useState<any>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  useEffect(() => {
    (async () => {
      setFetchLoader(true);
      if (!state) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchProductDetails();
      setFetchLoader(false);
    })();
    // return () => {
    //   removeKey('product');
    // };
  }, []);
  const fetchProductDetails = async () => {
    let data: any = {};
    if (getKey('product')) {
      data = getKey('product');
    } else {
      setKey('product', state);
      data = state;
    }
    setStateData(data);
    let apiService = new APICallService(
      product.productVariantInof,
      data._id,
      '',
      '',
      false,
      '',
      temp?.module || Product
    );
    let response = await apiService.callAPI();
    setProductDetails(response);
    let tempTab = [
      {
        name: 'Product details',
        content: <TabProductDetails productDetails={response} />,
      },
      {
        name: 'History of inventory',
        content: <ProductInventoryHistory productDetails={response} />,
      },
      {
        name: 'Stock Details',
        content: <ProductStockDetails productDetails={response} />,
      },
      {
        name: 'Ratings and reviews',
        content: <TabRatingReview productDetails={response} />,
      },
    ];
    setTab(tempTab);
    const name = getKey(productDetailsStore.tab) || '';
    if (name) {
      const matchTab = tempTab.find((item) => item.name === name);
      if (matchTab) {
        setCurrentTab(matchTab);
      }
    } else {
      setCurrentTab({
        name: 'Product details',
        content: <TabProductDetails productDetails={response} />,
      });
    }
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Product, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(GoodsInWarehouseConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
            Edit stock count
          </button>
        ),
        value: 2,
      });
    }
    if (Method.hasPermission(Product, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4 ">
            Delete this product
          </button>
        ),
        value: 3,
      });
    }
    setOptions(tempOptions);
  };
  const handleSelectTab = (tab: any) => {
    setCurrentTab(tab);
  };
  const createTabs = () => {
    const localTab = tab;
    let current = currentTab;
    const allTabs = localTab.map((tab: any, index: number) => {
      return (
        <li
          key={index}
          className="nav-item"
        >
          <Link
            to={'/'}
            className={
              current.name === tab.name
                ? 'nav-link active text-active-dark'
                : 'nav-link text-hover-dark'
            }
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
  const deleteProduct = async (id: string) => {
    let apiService = new APICallService(
      product.deleteProduct,
      id,
      '',
      '',
      true,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(productString.productDeleted);
      setDeleteProductId(undefined);
      setDeleteModalOpen(false);
      setError(undefined);
      navigate('/all-products');
    } else {
      setError(response.error);
    }
  };
  const handleOption = async (event: any) => {
    if (event.value === 1) {
      if (!stateData.isMaster) {
        navigate('/all-products/edit-product-variant', {
          state: {
            _id: stateData._id,
          },
        });
      } else {
        navigate('/all-products/edit-product', {
          state: {
            _id: productDetails.product.reference,
          },
        });
      }
      setKey(productDetailsStore.tab, currentTab.name);
    } else if (event.value === 2) {
      navigate('/all-products/edit-stock-count', {
        state: {
          _id: productDetails._id,
        },
      });
      setKey(productDetailsStore.tab, currentTab.name);
    } else if (event.value === 3) {
      setDeleteModalOpen(true);
      if (!stateData.isMaster) {
        setDeleteProductId(
          `${productDetails.product.reference}/${stateData._id}`
        );
      } else {
        setDeleteProductId(productDetails.product.reference);
      }
    }
  };
  const handleDownload = async (id: string,downloadAsPdf:boolean) => {
    // setIsDownloading(true);
    const apiService = new APICallService(
      reports.singleProductsReport,
      {
        utcOffset: new Date().getTimezoneOffset(),
        reportFormatType: downloadAsPdf ? 'pdf' : 'excel',
      },
      { id: id },
      'blob',
      false,
      '',
      Product
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
      let fileName = productDetails?.title + '_report';
      if(downloadAsPdf){
        fileName += '.pdf';
      }else{
        fileName += '.xlsx';
      }

      downloadLink.download = fileName
      downloadLink.click();
      setShowReportModal(false);
    }
    // setIsDownloading(false);
  };
  const popOverRemainingStock = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black rounded-1 text-white fs-14">
        <>Remaining stock</>
      </Popover.Body>
    </Popover>
  );
  const popOverReserveStock = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black text-white rounded-1 fs-14">
        <>Reserved stock</>
      </Popover.Body>
    </Popover>
  );
  const popOverTotalStock = (
    <Popover id="popover-basic">
      <Popover.Body className="p-2 bg-black text-white rounded-1 fs-14">
        <>Total stock</>
      </Popover.Body>
    </Popover>
  );
  return (
    <>
      {showReportModal && (
        <ReportTypeModal
          show={showReportModal}
          onHide={() => {
            setShowReportModal(false);
          }}
          onSubmit={async(downloadAsPdf:boolean)=>{
          await handleDownload(productDetails?._id || stateData?._id,downloadAsPdf);
          }}
        />
      )}
      {deleteProductId && deleteModalOpen && (
        <DeleteModalCommon
          show={deleteModalOpen}
          onHide={() => {
            setDeleteProductId(undefined);
            setDeleteModalOpen(false);
            setError(undefined);
          }}
          flag={true}
          deleteId={deleteProductId}
          handleDelete={deleteProduct}
          title={stateData.isMaster ? 'this Product' : 'this Product variant'}
          error={error}
        />
      )}
      <Row className="align-items-center mb-7">
        <Col sm>
          <h1 className="fs-22 fw-bolder mb-sm-0 mb-3">Product details</h1>
        </Col>
        {!fetchLoader && (
          <Col xs="auto">
            <Button
              variant="primary"
              disabled={isDownloading}
              className="btn-lg"
              onClick={() => {
                setShowReportModal(true);
                // handleDownload(productDetails?._id || stateData?._id);
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
        {fetchLoader ? (
          <></>
        ) : (
          <Col sm={'auto'}>
            <div className="float-end">
              {Method.hasPermission(Product, Edit, currentUser) ||
              Method.hasPermission(Product, Delete, currentUser) ||
              Method.hasPermission(GoodsInWarehouseConst, Edit, currentUser) ? (
                <CustomSelectTable
                  marginLeft={'-110px'}
                  placeholder={
                    <img
                      className="me-3"
                      width={45}
                      height={45}
                      src={ThreeDotMenu}
                      alt=""
                    />
                  }
                  options={options}
                  backgroundColor={'white'}
                  onChange={(event: any) => {
                    handleOption(event);
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
        )}
      </Row>
      <Row>
        {fetchLoader ? (
          <></>
        ) : (
          <>
            {productDetails && Object.keys(productDetails).length ? (
              <>
                <Col sm={12}>
                  <Card className="border border-custom-color mb-5 mb-xl-10">
                    <Card.Body className="pt-9 pb-0 position-relative">
                      {productDetails?.inventoryInfo?.quantityTypes.length &&
                      productDetails?.inventoryInfo?.quantityTypes[0]
                        ?.forecastedDays ? (
                        <div className="fs-15 fw-600 position-absolute top-0 end-0  bg-light-success text-primary p-3 py-4 rounded-end rounded-bottom">
                          <img
                            src={InventorIcon}
                            alt="inventory-icon"
                          />
                          <em>
                            {' '}
                            {`Stock left for ${
                              productDetails?.inventoryInfo?.quantityTypes[0]
                                ?.forecastedDays || 0
                            } days`}
                          </em>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="d-flex flex-wrap flex-sm-nowrap mb-3 mt-5">
                        <div className="me-9 mb-4">
                          <div className="symbol symbol-200px symbol-lg-200px symbol-fixed border position-relative">
                            <div className="image-input d-flex flex-center rounded w-200px h-200px">
                              <div
                                className="image-input-wrapper shadow-none bgi-contain bgi-position-center w-100 h-100"
                                style={{
                                  backgroundImage: `url(${
                                    productDetails.media[0]?.url || ''
                                  })`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                            <div className="d-flex flex-column">
                              <div className="d-flex flex-column mb-2">
                                <h3 className="text-black fs-22 fw-700">
                                  {productDetails.title}
                                  {productDetails.active ? (
                                    <span className="badge badge-light-success border-r4px p-3 fs-14 fw-600 text-dark ms-2">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="badge badge-light border-r4px p-3 fs-14 fw-600 text-dark ms-2">
                                      Deactivated
                                    </span>
                                  )}
                                </h3>
                                {/* TODO have to set sku number */}
                                <span className="fs-16 fw-500">
                                  Product ID: {productDetails.refKey} / SKU:{' '}
                                  {productDetails?.skuNumber}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* TODO have to set order in last month and in sotck */}
                          <Col lg={12}>
                            <div className="d-flex flex-wrap flex-stack">
                              <div className="d-flex flex-column flex-grow-1 pe-8">
                                <div className="d-flex flex-wrap">
                                  <div className="bg-light border rounded min-w-125px py-3 px-4 me-6 mb-3">
                                    <div className="d-flex align-items-center">
                                      <div className="fs-22 fw-bold">
                                        {productDetails?.orderCount || 0}
                                      </div>
                                    </div>
                                    <div className="fw-500 fs-16">
                                      Total Orders
                                    </div>
                                  </div>
                                  {productDetails.inventoryInfo.quantityTypes &&
                                  productDetails.inventoryInfo.quantityTypes
                                    .length ? (
                                    <>
                                      {productDetails.inventoryInfo.quantityTypes.map(
                                        (quantVal: any, index: number) => {
                                          return (
                                            <div
                                              key={index}
                                              className="bg-light border rounded min-w-125px py-3 px-4 me-6 mb-3"
                                            >
                                              <div className="d-flex align-items-center">
                                                <div className="fs-2 fw-bolder">
                                                  <OverlayTrigger
                                                    trigger="hover"
                                                    placement="bottom-start"
                                                    overlay={
                                                      popOverRemainingStock
                                                    }
                                                  >
                                                    <span>
                                                      {quantVal?.remainingQty ||
                                                        0}
                                                    </span>
                                                  </OverlayTrigger>
                                                  {' + '}
                                                  <OverlayTrigger
                                                    trigger="hover"
                                                    placement="bottom-start"
                                                    overlay={
                                                      popOverReserveStock
                                                    }
                                                  >
                                                    <span>
                                                      {quantVal?.reservedQty ||
                                                        0}
                                                    </span>
                                                  </OverlayTrigger>
                                                  {' = '}
                                                  <OverlayTrigger
                                                    trigger="hover"
                                                    placement="bottom-start"
                                                    overlay={popOverTotalStock}
                                                  >
                                                    <span>
                                                      {(quantVal?.remainingQty ||
                                                        0) +
                                                        (quantVal?.reservedQty ||
                                                          0)}
                                                    </span>
                                                  </OverlayTrigger>{' '}
                                                  <img
                                                    src={cartoon}
                                                    width={20}
                                                    height={19}
                                                    alt=""
                                                  />
                                                </div>
                                              </div>
                                              <div className="fw-500 fs-16">
                                                {quantVal.type === Units
                                                  ? 'Units'
                                                  : ''}{' '}
                                                in stock
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <div className="bg-light border rounded min-w-125px py-3 px-4 me-6 mb-3">
                                      <div className="d-flex align-items-center">
                                        <div className="fs-2 fw-bolder">
                                          {0}
                                          <img
                                            src={cartoon}
                                            width={20}
                                            height={19}
                                            alt=""
                                          />
                                        </div>
                                      </div>
                                      <div className="fw-500 fs-16">
                                        {' Units in stock'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </div>
                      </div>
                    </Card.Body>
                    <Row className="align-items-center px-lg-9 px-6">
                      <Col sm>
                        <div className="d-flex h-70px">
                          <ul className="nav nav-stretch nav-line-tabs nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-18 fw-600">
                            {createTabs()}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </Row>
      <div
        className="tab-content"
        id="myTabContent"
      >
        <div className="tab-pane fade show active">
          <>{currentTab.content}</>
        </div>
      </div>
    </>
  );
};
export default ProductDetails;
