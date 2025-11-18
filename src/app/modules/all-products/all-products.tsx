import { useEffect, useState } from 'react';
import { Button, Card, Col, FormLabel, Row } from 'react-bootstrap';
import { KTSVG } from '../../../umart_admin/helpers';
import { CustomSelectWhite } from '../../custom/Select/CustomSelectWhite';
import { CustomComponentSelect } from '../../custom/Select/CustomComponentSelect';
import gray from '../../../umart_admin/assets/media/svg_uMart/gray_dot.svg';
import green from '../../../umart_admin/assets/media/svg_uMart/green_dot.svg';
import APICallService from '../../../api/apiCallService';
import { master, product } from '../../../api/apiEndPoints';
import { productJSON } from '../../../api/apiJSON/product';
import Loader from '../../../Global/loader';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../Global/pagination';
import StarIcon from '../../../umart_admin/assets/media/svg_uMart/star.svg';
import {
  Actived,
  Add,
  AllProduct,
  Deactivated,
  Delete,
  Edit,
  PAGE_LIMIT,
  Product,
  View,
} from '../../../utils/constants';
import { productString } from '../../../utils/string';
import ThreeDotMenu from '../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import { CustomSelectTable } from '../../custom/Select/CustomSelectTable';
import DraftProducts from '../../modals/draft-products';
import { success } from '../../../Global/toast';
import DeleteModalCommon from '../../modals/delete-modal-comman';
import RemoveDraftProduct from '../../modals/remove-draft-product';
import { useAuth } from '../auth';
import Method from '../../../utils/methods';
import { useDebounce } from '../../../utils/useDebounce';
import AllProductReportModal from '../../modals/reports/all-product-reports';
import { getKey, removeKey, setKey } from '../../../Global/history';
import { listProducts, productDetailsStore } from '../../../utils/storeString';
import EditSearchTags from '../../modals/edit-search-tags';
const AllProducts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
  const [filterProducts, setFilterProducts] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [initialProduct, setInitialProduct] = useState<any>([]);
  const [draftCount, setDraftCount] = useState<number>(0);
  const [fetchLoader, setFetchLoader] = useState(true);
  const [showDraftProducts, setShowDraftProducts] = useState(false);
  const [showRemoveDraftProduct, setShowRemoveDraftProduct] = useState(false);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [totalRecords, setTotalRecords] = useState(-1);
  const [page, setPage] = useState(getKey(listProducts.page) || 1);
  const [productState, setProductState] = useState(
    getKey(listProducts.statusFilter) || AllProduct
  );
  const [pageLimit, setPageLimit] = useState(
    getKey(listProducts.limit) || PAGE_LIMIT
  );
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any>(
    getKey(listProducts.categoryFilter) || []
  );
  const [search, setSearch] = useState<string>(
    getKey(listProducts.searchFilter) || ''
  );
  const [show, setShow] = useState(false);
  const [defaultValue, setDefaultValue] = useState<any>();
  const [initLoader, setInitLoader] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState<String | undefined>(
    ''
  );
  const [deleteVariantId, setDeleteVariantId] = useState<String | undefined>(
    ''
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState<any>();
  const [options, setOptions] = useState<any>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>();
  const [showSearchTagModal, setShowSearchTagModal] = useState(false);
  useEffect(() => {
    (async () => {
      setInitLoader(true);
      setFetchLoader(true);
      if (!Method.hasModulePermission(Product, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchInitialProducts(
        page,
        pageLimit,
        productState,
        categories,
        search
      );
      setInitLoader(false);
      await fetchDraftCount();
      await fetchCategory();
      setDefaultValue({
        label: (
          <img
            className="img-fluid"
            width={24}
            height={5}
            src={ThreeDotMenu}
            alt=""
          />
        ),
        value: (
          <img
            className="img-fluid"
            width={24}
            height={5}
            src={ThreeDotMenu}
            alt=""
          />
        ),
      });
      removeKey('product');
      removeKey(productDetailsStore.tab);
      removeKey(productDetailsStore.historyLimit);
      removeKey(productDetailsStore.historyPage);
      removeKey(productDetailsStore.historyOperationFilter);
      removeKey(productDetailsStore.historyDateFilter);
      removeKey(productDetailsStore.ratingLimit);
      removeKey(productDetailsStore.ratingPage);
      setFetchLoader(false);
      setTimeout(() => {
        const pos = getKey(listProducts.productScroll);
        window.scrollTo(0, pos);
      }, 500);
    })();
  }, []);
  const fetchCategory = async () => {
    let apiService = new APICallService(
      master.categoryList,
      {
        categoriesDepth: 1,
      },
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      let temp: any = [];
      response.records.map((val: any) => {
        temp.push({
          value: val.title,
          name: val.title,
          id: val._id,
          img: val.image,
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
      setFilterProducts(temp);
    }
  };
  const fetchProducts = async (
    pageNo: number,
    limit: number,
    state: number,
    categories: any,
    search: string
  ) => {
    setLoading(true);
    let data = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      searchTerm: search ? search.trim() : '',
      state: state,
      needCount: true,
    };
    if (categories.length > 0) {
      categories.map((val: any, index: number) => {
        data = { ...data, ['categories[' + index + ']']: val.id };
      });
    }
    let apiService = new APICallService(
      product.listProduct,
      data,
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(response.total);
      }
      setProducts(response.records);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };
  const fetchInitialProducts = async (
    pageNo: number,
    limit: number,
    state: number,
    categories: any,
    search: string
  ) => {
    setLoading(true);
    let data = {
      pageNo: pageNo,
      limit: limit,
      sortKey: '_createdAt',
      sortOrder: -1,
      searchTerm: search,
      state: state,
      needCount: true,
    };
    if (categories.length > 0) {
      categories.map((val: any, index: number) => {
        data = { ...data, ['categories[' + index + ']']: val.id };
      });
    }
    let apiService = new APICallService(
      product.listProduct,
      data,
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response && response.records) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(response.total);
      }
      setProducts(response.records);
      setInitialProduct(response.records);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };
  const fetchDraftCount = async () => {
    let apiService = new APICallService(
      product.draftCount,
      {},
      '',
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response.count) {
      setDraftCount(response.count);
    }
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Product, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            Edit product
          </button>
        ),
        value: 1,
      });
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            Edit search tags
          </button>
        ),
        value: 3,
      });
    }
    if (Method.hasPermission(Product, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-danger ms-3 p-4  ">
            Delete Product
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const handleVariationShow = (variantionData: any, index: number) => {
    let temp: any = [...products];
    temp[index].showVariant = !temp[index].showVariant;
    setProducts(temp);
  };
  const handleShowRemoveDraftProduct = (id: string, title: string) => {
    setShowDraftProducts(false);
    setId(id);
    setTitle(title);
    setShowRemoveDraftProduct(true);
  };
  const handleHideRemoveDraftProduct = () => {
    setShowRemoveDraftProduct(false);
    setId('');
    setTitle('');
  };
  const handleDraftCount = () => {
    let temp = draftCount;
    temp = temp - 1;
    setDraftCount(temp);
  };
  const updateProductState = async (
    state: boolean,
    id: string,
    isProduct: boolean,
    productIndex: number,
    variantIndex: number
  ) => {
    setIsDisabled(true);
    let temp = [...products];
    let apiService = new APICallService(
      product.updateProductState,
      productJSON.updateProductState({ activate: !state }),
      {
        id: id,
      },
      '',
      false,
      '',
      Product
    );
    let response = await apiService.callAPI();
    if (response) {
      temp[productIndex].variants[variantIndex].variant.active = !state;
      if (state) {
        success(productString.deactivated);
      } else {
        success(productString.activated);
      }
    }
    if (productState !== AllProduct) {
      temp.splice(productIndex, 1);
    }
    setProducts(temp);
    setIsDisabled(false);
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listProducts.page, val);
    await fetchProducts(val, pageLimit, productState, categories, search);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listProducts.page, val + 1);
    await fetchProducts(val + 1, pageLimit, productState, categories, search);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listProducts.page, val - 1);
    await fetchProducts(val - 1, pageLimit, productState, categories, search);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setPageLimit(+event.target.value);
    setKey(listProducts.page, 1);
    setKey(listProducts.limit, parseInt(event.target.value));
    await fetchProducts(
      1,
      event.target.value,
      productState,
      categories,
      search
    );
  };
  const handleProductStateChange = async (event: any) => {
    await fetchProducts(1, pageLimit, event.value, categories, search);
    setProductState(event.value);
    setPage(1);
    setKey(listProducts.page, 1);
    setKey(listProducts.statusFilter, event.value);
  };
  const handleCategoryFilter = async (event: any) => {
    setCategories(event);
    setPage(1);
    setKey(listProducts.page, 1);
    await fetchProducts(1, pageLimit, productState, event, search);
    setKey(listProducts.categoryFilter, event);
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
    setPage(1);
    setKey(listProducts.page, 1);
    if (input.trim().length > 2 && search !== input) {
      await debounce(1, pageLimit, productState, categories, input);
    } else if (input.trim().length <= 2 && input.length < search.length) {
      await debounce(1, pageLimit, productState, categories, input);
    }
    setKey(listProducts.searchFilter, input);
  };
  const handleOnKeyUp = async (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    const input = event.target.value;
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    if (input[input.length - 1] === ' ' && charCode === 32) return;
    setPage(1);
    if (input.trim().length > 2 && !isCtrlPressed) {
      await fetchProducts(1, pageLimit, productState, categories, input);
    } else if (
      input.trim().length <= 2 &&
      (charCode === 46 || charCode === 8)
    ) {
      await fetchProducts(1, pageLimit, productState, categories, input);
    }
    if (isCtrlPressed && event.key === 'x') {
      await fetchProducts(1, pageLimit, productState, categories, '');
    }
  };
  const openMenuOnClick = async (id: any) => {
    setId(id);
    setShow(true);
    // navigate('/master/edit-business-certificates', { state: data })
  };
  const onMenuClose = async () => {
    setId('');
    setShow(false);
  };
  const onMenuOpen = async (id: any) => {
    setId(id);
    setShow(true);
  };
  const handleOption = async (event: any, data: any, index: number) => {
    if (event.value === 1) {
      setKey(listProducts.productScroll, window.scrollY.toString());
      navigate('/all-products/edit-product', {
        state: {
          _id: data,
          isMaster: false,
        },
      });
    } else if (event.value === 2) {
      setDeleteProductId(data);
      setDeleteModalOpen(true);
    } else if (event.value === 3) {
      setCurrentProduct(products[index]);
      setShowSearchTagModal(true);
    }
  };
  const handleVariantOption = async (
    event: any,
    data: any,
    index: number,
    productId: any
  ) => {
    if (event.value === 1) {
      setKey(listProducts.productScroll, window.scrollY.toString());
      navigate('/all-products/edit-product-variant', {
        state: {
          _id: data,
          isMaster: false,
        },
      });
    } else if (event.value === 2) {
      setDeleteVariantId(`${productId}/${data}`);
      setDeleteModalOpen(true);
    }
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
      await fetchProducts(page, pageLimit, productState, categories, search);
      await fetchInitialProducts(
        page,
        pageLimit,
        productState,
        categories,
        search
      );
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  const handleSearchTagModalClose = () => {
    setShowSearchTagModal(false);
    setCurrentProduct(undefined);
  };
  return (
    <>
      {showReportModal ? (
        <AllProductReportModal
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
        />
      ) : (
        <></>
      )}
      {showRemoveDraftProduct && (
        <RemoveDraftProduct
          show={showRemoveDraftProduct}
          onHide={() => {
            handleHideRemoveDraftProduct();
          }}
          deleteId={id}
          title={title}
          handleDraftCount={handleDraftCount}
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
          title="this Product"
          error={error}
        />
      )}
      {deleteVariantId && deleteModalOpen && (
        <DeleteModalCommon
          show={deleteModalOpen}
          onHide={() => {
            setDeleteVariantId(undefined);
            setDeleteModalOpen(false);
            setError(undefined);
          }}
          flag={true}
          deleteId={deleteVariantId}
          handleDelete={deleteProduct}
          title="this Product Variant"
          error={error}
        />
      )}
      {showDraftProducts && (
        <DraftProducts
          show={showDraftProducts}
          onHide={() => setShowDraftProducts(false)}
          handleShowRemoveDraftProduct={(id: string, title: string) => {
            handleShowRemoveDraftProduct(id, title);
          }}
          deleteId={id}
          title={title}
          handleHideRemoveDraftProduct={handleHideRemoveDraftProduct}
          handleDraftCount={handleDraftCount}
        />
      )}
      {currentProduct && (
        <EditSearchTags
          show={showSearchTagModal}
          onHide={handleSearchTagModalClose}
          data={currentProduct}
          onClose={async () => {
            setShowSearchTagModal(false);
            await fetchInitialProducts(
              page,
              pageLimit,
              productState,
              categories,
              search
            );
          }}
        />
      )}
      <>
        {Method.hasModulePermission(Product, currentUser) ? (
          <>
            {' '}
            <Row className="align-items-center mb-7">
              <>
                <Col
                  xs={6}
                  md
                >
                  <h1 className="fs-22 fw-bolder">All Products</h1>
                </Col>
                {draftCount > 0 ? (
                  <Col
                    xs={6}
                    md={'auto'}
                    className="text-end"
                  >
                    {Method.hasPermission(Product, View, currentUser) ? (
                      <Button
                        variant="white"
                        type="button"
                        className="btn-flush text-primary fs-16 fw-bold"
                        onClick={() => setShowDraftProducts(true)}
                      >
                        {draftCount} draft products
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Col>
                ) : (
                  <></>
                )}
                <Col xs={'auto'}>
                  {Method.hasPermission(Product, Add, currentUser) ? (
                    <Button
                      className="min-h-50px btn-lg mb-3 mb-sm-0"
                      variant="primary"
                      type="button"
                      onClick={() => {
                        navigate('/all-products/add-new-product');
                      }}
                    >
                      Add new product
                    </Button>
                  ) : (
                    <></>
                  )}
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    className="btn-lg min-h-50px mb-3 mb-sm-0"
                    onClick={() => setShowReportModal(true)}
                    disabled={fetchLoader}
                  >
                    <span className="indicator-label fs-16 fw-bold">
                      {'Download report'}
                    </span>
                  </Button>
                </Col>
              </>
            </Row>
            <Card className="bg-light border mb-7">
              <Card.Body className="px-7 py-4">
                <Row className="align-items-center">
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark min-h-md-25px">
                      {''}
                    </FormLabel>{' '}
                    <div className="position-relative my-1 ">
                      <KTSVG
                        path="/media/icons/duotune/general/gen021.svg"
                        className="svg-icon-3 position-absolute ps-13 top-50 translate-middle"
                      />
                      <input
                        type="text"
                        disabled={initLoader}
                        id="kt_filter_search"
                        className="form-control form-control-white form-control-lg min-h-60px ps-10"
                        placeholder="Search by product name…"
                        onChange={(event: any) => {
                          handleSearch(event.target.value);
                        }}
                        // onKeyUp={handleOnKeyUp}
                        value={search}
                      />
                    </div>
                  </Col>
                  <Col
                    // lg={4}
                    md={5}
                    sm={12}
                    className="pt-2"
                  >
                    <FormLabel className="fs-16 fw-500 text-dark  min-h-25px">
                      {'Filter by category'}
                    </FormLabel>{' '}
                    <div className="d-flex justify-content-center align-items-center ">
                      <div className="w-100">
                        <CustomComponentSelect
                          backgroundColor="#ffff"
                          // isLoading={loading}
                          closeMenuOnSelect={false}
                          isSearchable={true}
                          options={filterProducts}
                          //   text={'sellers selected'}
                          placeholder="Select category name"
                          hideSelectedOptions={false}
                          value={categories}
                          onChange={(event: any) => {
                            handleCategoryFilter(event);
                          }}
                          isMulti={true}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col
                    // lg={4}
                    md={3}
                    sm={12}
                  >
                    <FormLabel className="fs-16 fw-500 text-dark min-h-md-25px">
                      {''}
                    </FormLabel>{' '}
                    <CustomSelectWhite
                      // className="w-100"
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
                      isDisabled={initLoader}
                      options={productOptions}
                      value={productOptions[productState - 1]}
                      onChange={(event: any) => {
                        handleProductStateChange(event);
                      }}
                      isMulti={false}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="border border-r10px">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-rounded table-row-bordered align-middle gs-7 gy-4">
                    <thead>
                      <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                        <th className="min-w-400px ">Product name</th>
                        <th className="min-w-125px">Ratings</th>
                        <th className="min-w-100px ">Activate / Deactivate</th>
                        <th className="min-w-225px  text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {loading ? (
                          <>
                            <tr>
                              <td colSpan={4}>
                                <div className="w-100 fs-15 fw-bold d-flex justify-content-center">
                                  <Loader loading={loading} />
                                </div>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            {products.length ? (
                              <>
                                {products.map(
                                  (productVal: any, index: number) => {
                                    return (
                                      <>
                                        <tr>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div className="symbol symbol-50px me-5">
                                                <img
                                                  src={Method.getProductMedia(
                                                    productVal,
                                                    true,
                                                    true
                                                  )}
                                                  className="object-fit-contain"
                                                  alt=""
                                                />
                                              </div>
                                              <div className="fs-15 fw-600">
                                                {productVal.title.replace(
                                                  /\s*\)\s*/g,
                                                  ')'
                                                )}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="text-start justify-content-between align-items-center">
                                            {(productVal.variants.length &&
                                              productVal.variants[0].variant[
                                                'variantType'
                                              ][0] !== undefined) ||
                                            !productVal?.variants[0]?.variant
                                              ?.rating ? (
                                              <span className="fs-20 fw-600 ">
                                                -
                                              </span>
                                            ) : (
                                              <div className="rating">
                                                <div className="fs-4 fw-500  me-1">
                                                  {
                                                    productVal?.variants[0]
                                                      ?.variant?.rating
                                                  }
                                                </div>
                                                <div className="rating-label checked">
                                                  <KTSVG
                                                    path={StarIcon}
                                                    className="svg-icon svg-icon-1 w-30px h-40px"
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </td>
                                          <td>
                                            {productVal.variants.length &&
                                            productVal.variants[0].variant[
                                              'variantType'
                                            ][0] !== undefined ? (
                                              <span className="fs-20 fw-600">
                                                -
                                              </span>
                                            ) : (
                                              <label className="form-check form-switch form-check-custom form-check-solid ">
                                                <input
                                                  className="form-check-input form-check-success w-50px h-30px"
                                                  type="checkbox"
                                                  name="notifications"
                                                  value={
                                                    productVal.variants[0]
                                                      .variant['_id']
                                                  }
                                                  checked={
                                                    productVal.variants[0]
                                                      .variant.active
                                                  }
                                                  disabled={
                                                    !Method.hasPermission(
                                                      Product,
                                                      Edit,
                                                      currentUser
                                                    ) || isDisabled
                                                  }
                                                  onChange={() => {
                                                    updateProductState(
                                                      productVal.variants[0]
                                                        .variant.active,
                                                      productVal.variants[0]
                                                        .variant['_id'],
                                                      true,
                                                      index,
                                                      0
                                                    );
                                                  }}
                                                />
                                              </label>
                                            )}
                                          </td>
                                          <td className="text-end">
                                            <div className="d-flex flex-nowrap justify-content-end align-items-center">
                                              {productVal.variants.length &&
                                              productVal.variants[0].variant[
                                                'variantType'
                                              ][0] != undefined ? (
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
                                              ) : (
                                                <>
                                                  {Method.hasPermission(
                                                    Product,
                                                    View,
                                                    currentUser
                                                  ) ? (
                                                    <Button
                                                      variant="primary"
                                                      className="btn-active-light-primary fs-14 fw-600 me-5"
                                                      onClick={() => {
                                                        setKey(
                                                          listProducts.productScroll,
                                                          window.scrollY.toString()
                                                        );
                                                        navigate(
                                                          '/all-products/product-details',
                                                          {
                                                            state: {
                                                              _id: productVal
                                                                .variants[0]
                                                                .variant['_id'],
                                                              isMaster: true,
                                                              module: Product,
                                                            },
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      View details
                                                    </Button>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </>
                                              )}
                                              {Method.hasPermission(
                                                Product,
                                                Edit,
                                                currentUser
                                              ) ||
                                              Method.hasPermission(
                                                Product,
                                                Delete,
                                                currentUser
                                              ) ? (
                                                <CustomSelectTable
                                                  // backgroundColor="#e0e0df"
                                                  marginLeft={'-102px'}
                                                  placeholder={
                                                    <img
                                                      className="img-fluid"
                                                      width={18}
                                                      height={5}
                                                      src={ThreeDotMenu}
                                                      alt=""
                                                    />
                                                  }
                                                  backgroundColor="white"
                                                  default={defaultValue}
                                                  options={options}
                                                  show={
                                                    show &&
                                                    productVal._id === id
                                                  }
                                                  onMenuClose={() => {
                                                    onMenuClose();
                                                  }}
                                                  openMenuOnClick={() => {
                                                    openMenuOnClick(
                                                      productVal._id
                                                    );
                                                  }}
                                                  onMenuOpen={() => {
                                                    onMenuOpen(productVal._id);
                                                  }}
                                                  onChange={(event: any) => {
                                                    handleOption(
                                                      event,
                                                      productVal._id,
                                                      index
                                                    );
                                                  }}
                                                />
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                        {productVal.showVariant ? (
                                          productVal.variants.map(
                                            (
                                              variantVal: any,
                                              variantIndex: number
                                            ) => {
                                              return (
                                                <tr className="table-active ms-6">
                                                  <td className="ps-15">
                                                    <div className="d-flex align-items-center">
                                                      <div className="symbol symbol-50px border me-5">
                                                        <img
                                                          src={Method.getProductMedia(
                                                            variantVal,
                                                            false,
                                                            true
                                                          )}
                                                          className="object-fit-contain"
                                                          alt=""
                                                        />
                                                      </div>
                                                      <div className="fs-15 fw-600">
                                                        {variantVal.variant.title.replace(
                                                          /\s*\)\s*/g,
                                                          ')'
                                                        )}
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="text-start justify-content-between align-items-center">
                                                    {variantVal?.variant
                                                      ?.rating ? (
                                                      <div className="rating">
                                                        <div className="fs-4 fw-500  me-1">
                                                          {
                                                            variantVal?.variant
                                                              ?.rating
                                                          }
                                                        </div>
                                                        <div className="rating-label checked">
                                                          <KTSVG
                                                            path={StarIcon}
                                                            className="svg-icon svg-icon-1 w-30px h-40px"
                                                          />
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <span className="fs-20 fw-600">
                                                        -
                                                      </span>
                                                    )}
                                                  </td>
                                                  <td>
                                                    <label className="form-check form-switch form-check-custom form-check-solid ">
                                                      <input
                                                        className="form-check-input form-check-success w-50px h-30px"
                                                        type="checkbox"
                                                        name="notifications"
                                                        value={
                                                          variantVal.variant._id
                                                        }
                                                        disabled={
                                                          !Method.hasPermission(
                                                            Product,
                                                            Edit,
                                                            currentUser
                                                          ) || isDisabled
                                                        }
                                                        checked={
                                                          variantVal.variant
                                                            .active
                                                        }
                                                        onChange={() => {
                                                          updateProductState(
                                                            variantVal.variant
                                                              .active,
                                                            variantVal.variant
                                                              ._id,
                                                            false,
                                                            index,
                                                            variantIndex
                                                          );
                                                        }}
                                                      />
                                                    </label>
                                                  </td>
                                                  <td className="text-end">
                                                    <div className="d-flex flex-nowrap justify-content-end align-items-center">
                                                      {/* <Link to="view-product-details"> */}
                                                      {Method.hasPermission(
                                                        Product,
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
                                                            setKey(
                                                              listProducts.productScroll,
                                                              window.scrollY.toString()
                                                            );
                                                            navigate(
                                                              '/all-products/product-details',
                                                              {
                                                                state: {
                                                                  _id: productVal
                                                                    .variants[
                                                                    variantIndex
                                                                  ].variant[
                                                                    '_id'
                                                                  ],
                                                                  isMaster:
                                                                    false,
                                                                  module:
                                                                    Product,
                                                                },
                                                              }
                                                            );
                                                          }}
                                                        >
                                                          View details
                                                        </Button>
                                                      ) : (
                                                        <></>
                                                      )}
                                                      {Method.hasPermission(
                                                        Product,
                                                        Edit,
                                                        currentUser
                                                      ) ||
                                                      Method.hasPermission(
                                                        Product,
                                                        Delete,
                                                        currentUser
                                                      ) ? (
                                                        <CustomSelectTable
                                                          // backgroundColor="#e0e0df"
                                                          marginLeft={'-102px'}
                                                          placeholder={
                                                            <img
                                                              className="img-fluid"
                                                              width={18}
                                                              height={5}
                                                              src={ThreeDotMenu}
                                                              alt=""
                                                            />
                                                          }
                                                          default={defaultValue}
                                                          options={options.filter(
                                                            (item: any) =>
                                                              item.value != 3
                                                          )}
                                                          show={
                                                            show &&
                                                            variantVal.variant
                                                              ._id === id
                                                          }
                                                          onMenuClose={() => {
                                                            onMenuClose();
                                                          }}
                                                          openMenuOnClick={() => {
                                                            openMenuOnClick(
                                                              variantVal.variant
                                                                ._id
                                                            );
                                                          }}
                                                          onMenuOpen={() => {
                                                            onMenuOpen(
                                                              variantVal.variant
                                                                ._id
                                                            );
                                                          }}
                                                          onChange={(
                                                            event: any
                                                          ) => {
                                                            handleVariantOption(
                                                              event,
                                                              variantVal.variant
                                                                ._id,
                                                              index,
                                                              productVal._id
                                                            );
                                                          }}
                                                        />
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
                        )}
                      </>
                    </tbody>
                  </table>
                </div>
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
        ) : (
          <></>
        )}
      </>
    </>
  );
};
export default AllProducts;
