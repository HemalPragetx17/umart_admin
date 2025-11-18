import { Card, Col, Row } from 'react-bootstrap';
import { BannerString } from '../../../../utils/string';
import { useEffect, useState } from 'react';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDot from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import APICallService from '../../../../api/apiCallService';
import { banners } from '../../../../api/apiEndPoints';
import Loader from '../../../../Global/loader';
import {
  BannerConst,
  BrandPlacement,
  CategoryPagePlacement,
  Delete,
  Edit,
  FixedBanner,
  GeneralSettings,
} from '../../../../utils/constants';
import { success } from '../../../../Global/toast';
import { bannerToast } from '../../../../utils/toast';
import Method from '../../../../utils/methods';
import clsx from 'clsx';
import { useAuth } from '../../auth';
const bannerPlaceMent = ['Home page', 'Category page', 'Product', 'Brand'];
const BannerDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location: any = useLocation();
  const [bannerDetails, setBannerDetails] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [options, setOptions] = useState<any>([]);
  const id: any = location?.state?.id;
  useEffect(() => {
    if (!id) {
      return window.history.back();
    }
    (async () => {
      updateOptionWithPermission();
      await fetchBannerDetails(id);
    })();
  }, []);
  const fetchBannerDetails = async (id: string) => {
    setLoading(true);
    const apiService = new APICallService(
      banners.bannerInfo,
      id,
      '',
      '',
      false,
      '',
      BannerConst
    );
    const response = await apiService.callAPI();
    if (response) {
      setBannerDetails(response);
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
  const handleOptionChange = (event: any, data: any) => {
    if (event.value === 1) {
      navigate('/settings/banners/edit-banner', { state: { id: id } });
    } else if (event.value === 2) {
      setShowDeleteModal(true);
    }
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      banners.deleteBanner,
      id,
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
      navigate('/settings/banners');
    }
  };
  return (
    <>
      {showDeleteModal ? (
        <CustomDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          title="Are you sure you want to delete
this banner?"
          btnTitle="Yes, Delete"
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      <Row className="mb-7 align-items-center">
        <Col xs={12}>
          <Row>
            <Col
              md
              className="mb-4"
            >
              <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
                {BannerString.bannerDetails}
              </h1>
            </Col>
            {!loading && (
              <Col sm="auto">
                <div className="d-inline-flex">
                  <div className="my-0 pe-2">
                    {Method.hasPermission(BannerConst, Edit, currentUser) ||
                    Method.hasPermission(BannerConst, Delete, currentUser) ? (
                      <CustomSelectTable
                        marginLeft={'-110px'}
                        width={'auto'}
                        placeholder={
                          <img
                            className="img-fluid"
                            width={45}
                            height={6}
                            src={ThreeDot}
                            alt=""
                          />
                        }
                        options={options}
                        backgroundColor="white"
                        onChange={(event: any, index: number, data: any) => {
                          handleOptionChange(event, {});
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Col>
        {!loading ? (
          <>
            <Col
              xs={12}
              className="mt-6"
            >
              <Card className="border border-custom-color mb-7">
                <Card.Body className="pt-9 pb-0">
                  <div className="position-absolute top-0 end-0">
                    <div className="d-flex justify-content-center align-items-center bg-light-warning p-3 px-4 border-r10px">
                      {bannerDetails?.expired ? (
                        <span className="ms-1 fw-600 text-black fs-15">
                          Expired
                        </span>
                      ) : (
                        <span className="ms-1 fw-600 text-black fs-15">
                          {`Display for ${bannerDetails?.days || '0'} ${
                            bannerDetails?.days > 1 ? 'days' : 'day'
                          }`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
                    <div className="me-9">
                      <div className="symbol symbol-200px ymbol-fixed border border-r10px position-relative  ">
                        <div className="image-input d-flex flex-center rounded w-lg-235px w-235px h-lg-135px h-150px ">
                          <div
                            className="image-input-wrapper shadow-none bgi-contain bgi-position-center  border-r10px w-100 h-100  bg-image-center"
                            style={{
                              background: `url(${bannerDetails?.image || ''})`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center flex-grow-1">
                      <div className="d-flex flex-column justify-content-between align-items-start flex-wrap mb-2">
                        <div className="d-flex flex-column">
                          <div className="d-flex mb-1">
                            <h3 className="text-black fs-22 fw-bolder">
                              {bannerDetails?.title || ''}
                            </h3>
                            <span
                              className={clsx(
                                'badge  border-r4px p-3 fs-14 fw-600 text-dark ms-4',
                                bannerDetails.active
                                  ? 'badge-light-success'
                                  : 'badge-light'
                              )}
                            >
                              {bannerDetails.active ? 'Active' : 'Deactivated'}
                            </span>
                          </div>
                        </div>
                        <div className="fw-500 fs-16 text-gray mb-1">
                          <span>
                            {Method.convertDateToDDMMYYYY(
                              bannerDetails?.startDate
                            )}
                            {' to '}
                            {Method.convertDateToDDMMYYYY(
                              bannerDetails?.endDate
                            )}
                          </span>
                        </div>
                      </div>
                      <Col
                        lg={12}
                        className="pe-0"
                      >
                        <div className="d-flex flex-wrap flex-stack">
                          <div className="d-flex flex-column flex-grow-1">
                            <div className="d-flex flex-wrap">
                              <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {bannerDetails?.placement
                                      ? bannerPlaceMent[
                                          bannerDetails.placement - 1
                                        ]
                                      : 'NA'}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  {BannerString.bannerPlaceMent}
                                </div>
                              </div>
                              <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    Products
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  <span className="me-1">
                                    {bannerDetails?.variants?.length || 0}
                                  </span>
                                  <span>
                                    {bannerDetails?.variants?.length === 0
                                      ? '(No products)'
                                      : `(${
                                          bannerDetails?.variants?.length > 1
                                            ? 'Multiple'
                                            : 'Single'
                                        })`}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {bannerDetails?.impressions || '0'}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Total impressions
                                </div>
                              </div>
                              <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {bannerDetails?.clicks || '0'}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Total clicks
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {bannerDetails?.placement === CategoryPagePlacement ||
            bannerDetails.placement === BrandPlacement ? (
              <Col
                xs={12}
                className="mb-6"
              >
                <Card>
                  <Card.Header className="bg-light align-items-center">
                    <h3 className="fs-22 fw-bolder mb-0">
                      {`List of added ${
                        bannerDetails.placement === CategoryPagePlacement
                          ? 'categories'
                          : 'brands'
                      }`}
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-4">
                      {bannerDetails?.categories &&
                        bannerDetails.categories.map((item: any) => {
                          return (
                            <Col
                              md={6}
                              lg={4}
                              xl={3}
                              key={item._id}
                            >
                              <div className="border border-r8px p-5 py-4 border-1 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="me-5 position-relative">
                                    <div className="symbol symbol-50px border">
                                      <img
                                        src={item?.image || ''}
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="fs-18 fw-600 w-lg-175px">
                                      {item?.title
                                        ? item?.title.length > 22
                                          ? item?.title.substring(0, 22) + '...'
                                          : item?.title
                                        : 'Na'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      {bannerDetails?.brands &&
                        bannerDetails.brands.map((item: any) => {
                          return (
                            <Col
                              md={6}
                              lg={4}
                              key={item._id}
                            >
                              <div className="border border-r8px p-5 py-6 border-1 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="me-5 position-relative">
                                    <div className="symbol symbol-50px border">
                                      <img
                                        src={item?.image || ''}
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="fs-18 fw-600 w-lg-175px">
                                      {item?.title
                                        ? item?.title.length > 22
                                          ? item?.title.substring(0, 22) + '...'
                                          : item?.title
                                        : 'Na'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <></>
            )}
            <Col xs={12}>
              <Card className="border mb-8">
                <Card.Header className="bg-light align-items-center">
                  <h3 className="fs-22 fw-bolder mb-0">
                    {'List of added products'}
                  </h3>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {bannerDetails?.type === FixedBanner ? (
                      <Col xs={12}>
                        <p className="fs-18 fw-600 text-center">
                          The banner is fixed, meaning it doesn’t change or
                          feature any products.
                        </p>
                      </Col>
                    ) : (
                      <>
                        {' '}
                        {bannerDetails?.variants &&
                          bannerDetails?.variants.length &&
                          bannerDetails?.variants.map((item: any) => {
                            return (
                              <Col
                                md={6}
                                lg={4}
                                key={item._id}
                              >
                                <div className="border border-r8px p-5 py-6 border-1 border-gray-300">
                                  <div className="d-flex align-items-center">
                                    <div className="me-5 position-relative">
                                      <div className="symbol symbol-50px border">
                                        <img
                                          src={
                                            item?.reference?.media[0]?.url || ''
                                          }
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <span className="fs-18 fw-600 w-lg-175px">
                                        {item?.reference?.title
                                          ? item?.reference?.title.length > 22
                                            ? item.reference?.title.substring(
                                                0,
                                                22
                                              ) + '...'
                                            : item?.reference?.title
                                          : 'Na'}
                                      </span>
                                      <div className="fs-16 fw-500 text-gray">
                                        <span className="me-3">
                                          {item?.reference?.product?.category
                                            ?.title || 'NA'}
                                        </span>
                                        <span>
                                          {item?.reference?.product?.subCategory
                                            ?.title || 'NA'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                      </>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </>
        ) : (
          <div className="border border-r10px mb-6">
            <div className="d-flex justify-content-center text-center align-items-center min-h-160px px-3">
              <Loader loading={loading} />
            </div>
          </div>
        )}
      </Row>
    </>
  );
};
export default BannerDetails;
