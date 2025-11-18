import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../../../Global/loader';
import Pagination from '../../../../Global/pagination';
// Media
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import APICallService from '../../../../api/apiCallService';
import {
  Add,
  Admin,
  Brand,
  Category,
  Delete,
  Edit,
  Master,
  PAGE_LIMIT,
} from '../../../../utils/constants';
import { brandsString } from '../../../../utils/string';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import { master } from '../../../../api/apiEndPoints';
import { brandJSON } from '../../../../api/apiJSON/master';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import DeleteModalCommon from '../../../modals/delete-modal-comman';
import { useAuth } from '../../auth';
import Method from '../../../../utils/methods';
import { getKey, setKey } from '../../../../Global/history';
import { listBrands } from '../../../../utils/storeString';
const Brands = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [page, setPage] = useState(getKey(listBrands.page) || 1);
  const [pageLimit, setPageLimit] = useState(getKey(listBrands.limit) || PAGE_LIMIT);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>();
  const [error, setError] = useState<any>();
  const { currentUser } = useAuth();
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(Brand, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchBrands(page, pageLimit);
      setLoading(false);
         setTimeout(() => {
           const pos = getKey(listBrands.scrollPosition);
           window.scrollTo(0, pos);
         }, 600);
    })();
  }, []);
  const fetchBrands = async (pageNo: number, limit: number) => {
    setLoading(true);
    let params = {
      pageNo: pageNo,
      limit: limit,
      sortKey: 'createdAt',
      sortOrder: -1,
    };
    let apiService = new APICallService(
      master.listBrands,
      brandJSON.listBrands(params),
      '',
      '',
      false,
      '',
      Brand
    );
    let response = await apiService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } 
      setBrands(response.records);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Brand, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            {brandsString.editBrands}
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(Brand, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            {brandsString.deleteBrands}
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const openMenuOnClick = async (data: any) => {
    setId(id);
    setShow(true);
  };
  const onMenuClose = async () => {
    setId(-1);
    setShow(false);
  };
  const onMenuOpen = async (id: any) => {
    setId(id);
    setShow(true);
  };
  const handleOption = async (event: any, index: number, data: any) => {
    if (event.value === 1) {
       setKey(listBrands.scrollPosition, window.scrollY.toString());
      navigate('/master/brands/edit-brand', { state: data });
    } else if (event.value === 0) {
    }
    if (event.value === 2) {
      setSelectedBrand(data);
      setDeleteModalOpen(true);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(listBrands.page,val);
    await fetchBrands(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(listBrands.page, val+1);
    await fetchBrands(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(listBrands.page, val - 1);
    await fetchBrands(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(listBrands.page,1);
    setPageLimit(+event.target.value);
    setKey(listBrands.limit,+event.target.value);
    await fetchBrands(1, event.target.value);
  };
  const handleEditBrand = async (data: any) => {
    setBrands(data);
  };
  const deleteBrand = async (id: string) => {
    let apiService = new APICallService(master.deleteBrand, id, '', '', true,'',Brand);
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.deleteBrand);
      setDeleteModalOpen(false);
      await fetchBrands(page, pageLimit);
      setSelectedBrand(undefined);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  return (
    <>
      {selectedBrand && deleteModalOpen && (
        <DeleteModalCommon
          show={deleteModalOpen}
          onHide={() => {
            setDeleteModalOpen(false);
            setError(undefined);
            setSelectedBrand(undefined);
          }}
          deleteId={selectedBrand._id}
          handleDelete={deleteBrand}
          flag={true}
          title={selectedBrand.title}
          error={error}
        />
      )}
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center my-6"
        >
          <h1 className="fs-22 fw-bolder mb-0">{brandsString.brands}</h1>
        </Col>
        {loading ? (
          <></>
        ) : brands.length > 0 ? (
          <Col
            md={'auto'}
            className="text-right mb-5"
          >
            {Method.hasPermission(Brand, Add, currentUser) ? (
              <Link
                to="/master/brands/add-brand"
                className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600"
              >
                {brandsString.addNewBrand}
              </Link>
            ) : (
              <></>
            )}
          </Col>
        ) : (
          <>
            <Col
              lg={12}
              className="mt-2"
            >
              <div className="border border-r10px p-md-9 p-7">
                <h2 className="fs-22 fw-bolder">{brandsString.startAdding}</h2>
                <p className="fs-18 fw-500 mb-md-8 mb-5">
                  {brandsString.manageBrands}
                </p>
                <Link
                  to="/master/brands/add-brand"
                  className="btn btn-primary btn-lg"
                >
                  {brandsString.addBrand}
                </Link>
              </div>
            </Col>
          </>
        )}
        <Col lg={12}>
          {loading ? (
            <div className="d-flex justify-content-center m-4">
              <Loader loading={loading} />
            </div>
          ) : (
            <>
              {brands.length > 0 ? (
                <>
                  <Card className="border border-r10px">
                    <Card.Body className="pt-1 py-3 px-md-12 px-8 mb-3">
                      <div className="table-responsive">
                        <table className="table table-rounded table-row-bordered align-middle gy-5 mb-0 ">
                          <thead>
                            <tr className="fw-bold fs-16 fw-600 text-dark border-bottom h-70px align-middle">
                              <th className="px-0 min-w-md-300px">
                                {brandsString.brands}
                              </th>
                              <th className="px-0 min-w-50px">&nbsp;</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brands.map((brandVal: any, index: number) => {
                              return (
                                <tr key={brandVal._id}>
                                  <td>
                                    <div className="d-inline-flex align-items-center">
                                      <div className="symbol symbol-40px border border-r10px me-4">
                                        <img
                                          className="img-fluid border-r10px object-fit-contain align-self-center"
                                          src={brandVal.image}
                                          alt=""
                                          // onClick={() => handleImage(certVal.image)}
                                        />
                                      </div>
                                      <span className="fs-15 fw-500">
                                        {brandVal.title}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="text-end">
                                    <div className="my-0 pe-2">
                                      {Method.hasPermission(
                                        Brand,
                                        Edit,
                                        currentUser
                                      ) ||
                                      Method.hasPermission(
                                        Brand,
                                        Delete,
                                        currentUser
                                      ) ? (
                                        <CustomSelectTable
                                          marginLeft={'0px'}
                                          width={'auto'}
                                          placeholder={
                                            <img
                                              className="img-fluid"
                                              width={22}
                                              height={5}
                                              src={ThreeDotMenu}
                                              alt=""
                                            />
                                          }
                                          options={options}
                                          backgroundColor="white"
                                          show={show && index === id}
                                          onMenuClose={() => {
                                            onMenuClose();
                                          }}
                                          openMenuOnClick={() => {
                                            openMenuOnClick(index);
                                          }}
                                          onMenuOpen={() => {
                                            onMenuOpen(index);
                                          }}
                                          onChange={(event: any) => {
                                            handleOption(
                                              event,
                                              index,
                                              brandVal
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
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </Col>
        {totalRecords > 0 && !loading ? (
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
      </Row>
    </>
  );
};
export default Brands;
