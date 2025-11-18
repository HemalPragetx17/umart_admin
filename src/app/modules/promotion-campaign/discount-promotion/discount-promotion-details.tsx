import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PromotionAndCampaignString } from '../../../../utils/string';
import { CustomSelectTable } from '../../../custom/Select/CustomSelectTable';
import ThreeDot from '../../../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import clsx from 'clsx';
import Method from '../../../../utils/methods';
import Loader from '../../../../Global/loader';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomDeleteModal from '../../../modals/custom-delete-modal';
import APICallService from '../../../../api/apiCallService';
import { promotionCampaign } from '../../../../api/apiEndPoints';
import { IDiscountPromotionDetails } from '../../../../types/responseIndex';
import {
  ApplyToCart,
  Delete,
  Edit,
  FlatDiscount,
  Promotion,
} from '../../../../utils/constants';
import { success } from '../../../../Global/toast';
import { promotionCampaignToast } from '../../../../utils/toast';
import { useAuth } from '../../auth';
const bannerPlaceMent = [
  'Home page',
  'Category page',
  'Product page',
  'Brand page',
];
const promotionObj = {
  discount: 'Discount promotion',
  coupon: 'Rewards',
  reward: 'Coupon promotion',
};
const applyToTypes = ['brands', 'categories', 'products', 'cart'];
const DiscountPromotionDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location: any = useLocation();
  const id: any = location?.state?._id;
  const [loading, setLoading] = useState(true);
  const [discountDetails, setDiscountDetails] =
    useState<IDiscountPromotionDetails>();
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    if (!id) {
      return window.history.back();
    }
    (async () => {
      updateOptionWithPermission();
      await fetchDetails(id);
    })();
  }, []);
  const fetchDetails = async (id: string) => {
    setLoading(true);
    const apiService = new APICallService(
      promotionCampaign.discountPromotionDetails,
      id,
      '',
      '',
      false,
      '',
      Promotion
    );
    const response = await apiService.callAPI();
    if (response) {
      setDiscountDetails(response);
    }
    setLoading(false);
  };
  const updateOptionWithPermission = () => {
    const tempOptions: any = [];
    if (Method.hasPermission(Promotion, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4  ">
            Edit details
          </button>
        ),
        value: 1,
      });
    }
    if (Method.hasPermission(Promotion, Edit, currentUser)) {
      tempOptions.push({
        label: (
          <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4  ">
            Delete details
          </button>
        ),
        value: 2,
      });
    }
    setOptions(tempOptions);
  };
  const handleOptionChange = (event: any) => {
    if (event.value === 1) {
      navigate('/promotion-campaign/edit-discount-promotions', {
        state: { _id: id },
      });
    } else if (event.value === 2) {
      setShowModal(true);
    }
  };
  const handleDelete = async () => {
    const apiCallService = new APICallService(
      promotionCampaign.deletePromotion,
      {},
      { id: id },
      '',
      false,
      '',
      Promotion
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(promotionCampaignToast.discountDeleted);
      setShowModal(false);
      navigate('/promotion-campaign/all-promotions', { replace: true });
    }
  };
  return (
    <>
      {showModal ? (
        <CustomDeleteModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title="Are you sure you want to delete this discount promotion?"
          btnTitle="Yes, Delete"
          handleDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      <Row className="mb-7 align-items-center">
        <Col xs={12}>
          <Row className="align-items-center">
            <Col
              md
              className="mb-4"
            >
              <h1 className="fs-22 fw-bolder mb-md-0 mb-3">
                {PromotionAndCampaignString.discountPromotionDetails}
              </h1>
            </Col>
            {!loading &&
              !discountDetails?.deleted &&
              (
                Method.hasPermission(Promotion, Edit, currentUser) ||
                Method.hasPermission(Promotion, Delete, currentUser)
              ) && (
                <Col sm="auto">
                  <div className="d-inline-flex">
                    <div className="my-0 pe-2">
                      {/* {Method.hasPermission(Master, Edit, currentUser) ||
                  Method.hasPermission(Master, Delete, currentUser) ? ( */}
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
                          handleOptionChange(event);
                        }}
                      />
                      {/* ) : (
                    <></>
                  )} */}
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
                  {/* <div className="position-absolute top-0 end-0">
                  <div className="d-flex justify-content-center align-items-center bg-light-warning p-3 px-4 border-r10px">
                    {discountDetails?.expired ? (
                      <span className="ms-1 fw-600 text-black fs-15">
                        Expired
                      </span>
                    ) : (
                      <span className="ms-1 fw-600 text-black fs-15">
                        {`Display for ${discountDetails?.days || '0'} ${
                          discountDetails?.days > 1 ? 'days' : 'day'
                        }`}
                      </span>
                    )}
                  </div>
                </div> */}
                  <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
                    <div className="me-9">
                      <div className="symbol symbol-200px symbol-fixed border border-r10px position-relative  ">
                        <div className="image-input d-flex flex-center rounded w-lg-235px w-235px h-lg-135px h-150px">
                          <div
                            className="image-input-wrapper shadow-none bgi-contain bgi-position-center  border-r10px w-100 h-100  bg-image-center"
                            style={{
                              background: `url(${
                                discountDetails?.image || ''
                              })`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center flex-grow-1">
                      <div className="d-flex flex-column justify-content-between align-items-start flex-wrap mb-2">
                        <div className="d-flex flex-column">
                          <div className="d-flex ">
                            <h3 className="text-black fs-22 fw-bolder">
                              <span>
                                {discountDetails?.startDate
                                  ? Method.convertDateToDDMMYYYY(
                                      discountDetails?.startDate
                                    )
                                  : '-'}
                                {' to '}
                                {discountDetails?.endDate
                                  ? Method.convertDateToDDMMYYYY(
                                      discountDetails?.endDate
                                    )
                                  : '-'}
                              </span>
                            </h3>
                            <span
                              className={clsx(
                                'badge  border-r4px p-3 fs-14 fw-600 text-dark ms-4',
                                discountDetails?.active
                                  ? 'badge-light-success'
                                  : 'badge-light'
                              )}
                            >
                              {discountDetails?.expired
                                ? 'Expired'
                                : discountDetails?.active
                                ? Method.dayDifference(
                                    new Date().toLocaleString(),
                                    discountDetails?.startDate
                                  ) > 0
                                  ? 'Upcoming'
                                  : 'Ongoing'
                                : 'Deactivated'}
                            </span>
                          </div>
                        </div>
                        <div className="fw-500 fs-16 mb-1">
                          <span>{discountDetails?.title || 'NA'}</span>
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
                                    {discountDetails?.placement
                                      ? bannerPlaceMent[
                                          discountDetails.placement - 1
                                        ]
                                      : 'NA'}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  {/* {BannerString.bannerPlaceMent} */}
                                  Ad placement
                                </div>
                              </div>
                              <div className="bg-light border rounded  py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {!!discountDetails?.type &&
                                    discountDetails?.discountType.toString() ===
                                      '1'
                                      ? 'Flat Discount'
                                      : 'Percentage Discount'}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  {PromotionAndCampaignString.discountType}
                                </div>
                              </div>
                              <div className="bg-light border rounded py-3 px-4 me-4 mb-3 border-gray-300">
                                <div className="d-flex align-items-center">
                                  <div className="fs-22 fw-bolder">
                                    {' '}
                                    {Method.formatCurrency(
                                      discountDetails?.totalDiscount || 0
                                    )}
                                  </div>
                                </div>
                                <div className="fw-500 fs-16 text-gray">
                                  Redemption analytics
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
            <Col xs={12}>
              <Card className="border mb-8">
                <Card.Header className="bg-light align-items-center">
                  <h3 className="fs-22 fw-bolder mb-0">Basic details</h3>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-7">
                    <Col lg={2}>
                      <label className=" fs-16 fw-700 text-dark">
                        Discount value:
                      </label>
                    </Col>
                    <Col lg={10}>
                      <span className="fw-bolder fs-16 fw-600 text-dark">
                        {`${
                          discountDetails?.discountValue
                            ? discountDetails.discountValue
                            : ''
                        }${
                          discountDetails?.discountType &&
                          discountDetails?.discountType.toString() ===
                            FlatDiscount
                            ? ' TSh'
                            : '%'
                        }`}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-7">
                    <Col lg={2}>
                      <label className=" fs-16 fw-700 text-dark">
                        Minimum purchase amount:
                      </label>
                    </Col>
                    <Col lg={10}>
                      <span className="fs-16 fw-600 text-dark">
                        {discountDetails?.minimumPurchaseAmount
                          ? Method.formatCurrency(
                              discountDetails.minimumPurchaseAmount
                            ) + ' TSh'
                          : '-'}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-7">
                    <Col lg={2}>
                      <label className=" fs-16 fw-700 text-dark">
                        Description:
                      </label>
                    </Col>
                    <Col lg={10}>
                      <span className="fs-16 fw-600 text-dark">
                        {discountDetails?.description || ''}
                      </span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            {!!discountDetails?.applyDiscountTo &&
            discountDetails?.applyDiscountTo.toString() !== ApplyToCart ? (
              <Col
                xs={12}
                className="mb-6"
              >
                <Card>
                  <Card.Header className="bg-light align-items-center">
                    <h3 className="fs-22 fw-bolder mb-0">
                      {`List of added ${
                        applyToTypes[
                          parseInt(discountDetails.applyDiscountTo) - 1
                        ]
                      }`}
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-4">
                      {discountDetails?.categories &&
                        discountDetails.categories.map((item: any) => {
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
                      {discountDetails?.brands &&
                        discountDetails.brands.map((item: any) => {
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
                      {discountDetails?.variants &&
                        discountDetails.variants.map((item: any) => {
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
                                    <div className="fs-18 fw-600 w-lg-175px">
                                      {item?.reference?.title
                                        ? item?.reference?.title.length > 22
                                          ? item?.reference?.title.substring(
                                              0,
                                              22
                                            ) + '...'
                                          : item?.reference?.title
                                        : 'Na'}
                                    </div>
                                    <div className="text-gray-600 fs-15">
                                      <span>
                                        {item?.reference?.product?.category
                                          ?.title
                                          ? item?.reference?.product?.category
                                              ?.title.length > 22
                                            ? item?.reference?.product?.category?.title.substring(
                                                0,
                                                50
                                              ) + '...'
                                            : item?.reference?.product?.category
                                                ?.title
                                          : 'Na'}
                                      </span>
                                      <span className="ms-0">{', '}</span>
                                      <span>
                                        {item?.reference?.product?.subCategory
                                          ?.title
                                          ? item?.reference?.product
                                              ?.subCategory?.title.length > 22
                                            ? item?.reference?.product?.subCategory?.title.substring(
                                                0,
                                                50
                                              ) + '...'
                                            : item?.reference?.product
                                                ?.subCategory?.title
                                          : 'Na'}
                                      </span>
                                    </div>
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
            {/* <Col xs={12}>
              <Card className="border mb-8">
                <Card.Header className="bg-light align-items-center">
                  <h3 className="fs-22 fw-bolder mb-0">
                    {'List of added products'}
                  </h3>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {discountDetails?.variants &&
                      discountDetails?.variants.length &&
                      discountDetails?.variants.map((item: any) => {
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
                                      src={item?.reference?.media[0]?.url || ''}
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
                  </Row>
                </Card.Body>
              </Card>
            </Col> */}
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
export default DiscountPromotionDetails;
