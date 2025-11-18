import { useEffect, useState } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../../../Global/loader';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../../../umart_admin/assets/media/svg_uMart/three-dot.svg';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import {
  Add,
  Delete,
  Edit,
  PAGE_LIMIT,
  ProductZoneConst,
} from '../../../../utils/constants';
import Pagination from '../../../../Global/pagination';
import { getKey, setKey } from '../../../../Global/history';
import { productZoneList } from '../../../../utils/storeString';
import Method from '../../../../utils/methods';
import { useAuth } from '../../auth';
const menuOptions = [];
interface IProductZoneList {
  _id: string;
  name: string;
  sequence: string;
  bins: {
    name: string;
    sequence: string;
  }[];
}
const ProductZone = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [productZones, setProductZones] = useState<IProductZoneList[]>([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentZone, setCurrentZone] = useState<IProductZoneList>();
  const [error, setError] = useState();
  const [page, setPage] = useState(getKey(productZoneList.page) || 1);
  const [pageLimit, setPageLimit] = useState(
    getKey(productZoneList.limit) || PAGE_LIMIT
  );
  const [options, setOptions] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!Method.hasModulePermission(ProductZoneConst, currentUser)) {
        return window.history.back();
      }
      updateOptionWithPermission();
      await fetchProductZones(page, pageLimit);
      setLoading(false);
      setTimeout(() => {
        const position = getKey(productZoneList.scrollPosition);
        window.scrollTo(0, position);
      }, 600);
    })();
  }, []);
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(ProductZoneConst, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-black ms-3 p-4  ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(ProductZoneConst, Delete, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-500 text-danger ms-3 p-4  ">
            Delete details
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const fetchProductZones = async (pageNo: number, limit: number) => {
    setLoading(true);
    const params = {
      pageNo: pageNo,
      limit: limit,
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
      ProductZoneConst
    );
    const response = await apiCallService.callAPI();
    if (response) {
      if (response.total) {
        setTotalRecords(response.total);
      } else {
        setTotalRecords(0);
      }
      setProductZones(response.records);
    }
    setLoading(false);
  };
  const handleOptionChange = (event: any, data: IProductZoneList) => {
    if (event.value === 1) {
      setKey(productZoneList.scrollPosition, window.scrollY.toString());
      navigate('/master/product-zones/edit-product-zone', { state: data });
    } else if (event.value === 2) {
      setShowModal(true);
      setCurrentZone(data);
    }
  };
  const handleCurrentPage = async (val: number) => {
    if (val === page || val.toString() === '...') return;
    setPage(val);
    setKey(productZoneList.page, val);
    await fetchProductZones(val, pageLimit);
  };
  const handleNextPage = async (val: number) => {
    setPage(val + 1);
    setKey(productZoneList.page, val + 1);
    await fetchProductZones(val + 1, pageLimit);
  };
  const handlePreviousPage = async (val: number) => {
    setPage(val - 1);
    setKey(productZoneList.page, val - 1);
    await fetchProductZones(val - 1, pageLimit);
  };
  const handlePageLimit = async (event: any) => {
    setPage(1);
    setKey(productZoneList.page, 1);
    setKey(productZoneList.limit, parseInt(event.target.value));
    await setPageLimit(parseInt(event.target.value));
    await fetchProductZones(1, parseInt(event.target.value));
  };
  const deleteZone = async () => {
    let apiService = new APICallService(
      master.deleteProductZone,
      currentZone?._id,
      '',
      '',
      true,
      '',
      ProductZoneConst
    );
    let response = await apiService.callAPI();
    if (response && !response.error) {
      success(masterToast.productZoneDeleted);
      setShowModal(false);
      setPage(1);
      setKey(productZoneList.page, 1);
      await fetchProductZones(1, pageLimit);
      setCurrentZone(undefined);
      setError(undefined);
    } else {
      setError(response.error);
    }
  };
  return (
    <>
      {showModal && currentZone ? (
        <CustomDeleteModal
          show={() => {
            setShowModal(true);
          }}
          onHide={() => {
            setShowModal(false);
            setCurrentZone(undefined);
            setError(undefined);
          }}
          title={`Are you sure you want to delete this product zone?`}
          btnTitle={`Yes, Delete`}
          handleDelete={deleteZone}
          error={error}
        />
      ) : (
        <></>
      )}
      <Row className="align-items-center">
        <Col
          md
          className="align-self-center my-6"
        >
          <h1 className="fs-22 fw-bolder mb-0">{'Product Zones/Bins'}</h1>
        </Col>
        {!loading ? (
          Method.hasPermission(ProductZoneConst, Add, currentUser) ? (
            <Col className="d-flex justify-content-md-end mb-4">
              <Link
                to="/master/product-zones/add-product-zone"
                className="btn btn-primary mh-md-50px btn-lg fs-16 fw-600 px-5"
              >
                {'Add new product zone'}
              </Link>
            </Col>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
        <Col lg={12}>
          {loading ? (
            <div className="d-flex justify-content-center m-4">
              <Loader loading={loading} />
            </div>
          ) : (
            <Card className="border border-r10px">
              <Card.Body className="pt-1 py-3 px-md-12 px-8 mb-3 pb-1">
                <div className="table-responsive p-0">
                  <table className="table table-rounded table-row-bordered align-middle gy-5 mb-0">
                    <thead>
                      <tr className="fs-16 fw-500 text-black">
                        <th className='min-w-150px'>Zones</th>
                        <th>Bins</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {productZones.length > 0 ? (
                        productZones.map((item) => {
                          return (
                            <tr
                              key={item._id}
                              className=""
                            >
                              <td className="fs-15 fw-500">
                                <span>{`${item?.name} ${
                                  item?.sequence ? ' - ' + item?.sequence : ''
                                }`}</span>
                              </td>
                              <td>
                                <div className='d-flex flex-wrap'>
                                  {item.bins?.map((val) => {
                                    return (
                                      <div
                                        key={val?.sequence}
                                        className="h-40px fs-15 mx-2 bg-light-primary text-black p-2 rounded-1 px-4 my-1"
                                      >{`${val?.name} ${
                                        val?.sequence
                                          ? ' - ' + val?.sequence
                                          : ''
                                      }`}</div>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="text-end w-50px">
                                <div>
                                  {Method.hasPermission(
                                    ProductZoneConst,
                                    Edit,
                                    currentUser
                                  ) ||
                                  Method.hasPermission(
                                    ProductZoneConst,
                                    Delete,
                                    currentUser
                                  ) ? (
                                    <CustomSelectTable
                                      marginLeft={'-90px'}
                                      width="auto"
                                      placeholder={
                                        <img
                                          className="img-fluid"
                                          width={22}
                                          height={5}
                                          src={ThreeDotMenu}
                                          alt="three dot menu"
                                        />
                                      }
                                      // menuIsOpen={customVal._id === bannerId}
                                      // openMenuOnClick={() => {
                                      //   openMenuOnClick(customVal._id);
                                      // }}
                                      // onMenuOpen={() => {
                                      //   onMenuOpen(customVal._id);
                                      // }}
                                      backgroundColor="transparent"
                                      // openMenuOnClick={true}
                                      options={options}
                                      onChange={(event: any) => {
                                        handleOptionChange(event, item);
                                      }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="fs-16 fw-500 text-center"
                          >
                            <span>No data available</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      {!loading && productZones?.length > 0 ? (
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
  );
};
export default ProductZone;
