import { Modal } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { KTSVG } from '../../umart_admin/helpers';
import StarIcon from '../../umart_admin/assets/media/svg_uMart/star.svg';
import StarEmptyIcon from '../../umart_admin/assets/media/svg_uMart/empty-star.svg';
import { CustomSelectTable } from '../custom/Select/CustomSelectTable';
import ThreeDotMenu from '../../umart_admin/assets/media/svg_uMart/three-dot-round.svg';
import { useEffect, useState } from 'react';
import Method from '../../utils/methods';
import BlankImg from '../../umart_admin/assets/media/avatars/blank.png';
import { Delete, Edit, Order } from '../../utils/constants';
import { useAuth } from '../modules/auth';
const ReviewRatingsModal = (props: any) => {
  const { currentUser } = useAuth();
  const [options, setOptions] = useState<any>([
    {
      label: (
        <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
          Hide this review
        </button>
      ),
      value: 1,
    },
    {
      label: (
        <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4 ">
          Delete this review
        </button>
      ),
      value: 2,
    },
  ]);
  useEffect(() => {
    (() => {
      updateOptionWithPermission();
    })();
  }, []);
  const updateOptionWithPermission = () => {
    if (props.fromOrdersDelivery) {
      const tempOptions: any = [];
      if (Method.hasPermission(Order, Edit, currentUser)) {
        tempOptions.push({
          label: (
            <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
              Hide this review
            </button>
          ),
          value: 1,
        });
      }
      if (Method.hasPermission(Order, Delete, currentUser)) {
        tempOptions.push({
          label: (
            <button className="btn btn-link fs-14 fw-600 text-danger ms-3 p-4 ">
              Delete this review
            </button>
          ),
          value: 2,
        });
      }

      setOptions(tempOptions);
    }
  };
  const renderRatings = (rating: number) => {
    const ratingsElement: any = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        ratingsElement.push(
          <div
            className="rating-label checked"
            key={i}
          >
            <KTSVG
              path={StarIcon}
              className="svg-icon svg-icon-1 w-30px h-40px"
            />
          </div>
        );
      } else {
        ratingsElement.push(
          <div
            className="rating-label"
            key={i}
          >
            <KTSVG
              path={StarEmptyIcon}
              className="svg-icon svg-icon-1 w-30px h-40px"
            />
          </div>
        );
      }
    }
    return ratingsElement;
  };
  const handleOption = (event: any) => {
    if (event.value === 1) {
      props.openActivateModal();
    } else if (event.value === 2) {
      props.openDeleteModal();
    }
  };
  return (
    <Modal
      centered
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-dialog-centered min-w-lg-695px min-w-md-600px"
      className="border-r10px"
      contentClassName="p-5"
    >
      <Modal.Header className="border-bottom-0 text-center pb-6 mx-auto">
        <div className="symbol symbol-md-40px symbol-35px close-inner-top-3">
          <img
            width={40}
            height={40}
            src={CrossSvg}
            alt=""
            onClick={props.onHide}
          />
        </div>
        <Modal.Title className=" mw-lg-450px  mb-0 fs-26 fw-bolder">
          <div>{props?.title}</div>
          <div>{`#${props?.data?.refKey} / ${props?.data?.customer?.name}`}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-5">
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-inline-flex align-items-center">
              <div className="symbol symbol-50px border border-r10px me-4">
                <img
                  className="img-fluid border-r8px object-fit-contain"
                  src={props?.data?.customer?.image || BlankImg}
                  alt=""
                />
              </div>
              <span className="fs-18 fw-600 ms-3">
                {props?.data?.rating?._createdAt
                  ? Method.convertDateToDDMMYYYY(
                      props?.data?.rating?._createdAt
                    )
                  : ''}
                <br />
                <span className=" fw-semibold  d-block fs-6">
                  {' '}
                  <div className="rating">
                    {renderRatings(props?.data.rating.rate)}
                  </div>
                </span>
              </span>
              {!props.data.rating.active ? (
                <span className="badge bg-gray-200 border-r4px p-3 fs-14 fw-600 text-dark ms-5">
                  Disabled
                </span>
              ) : (
                <></>
              )}
            </div>
            {options.length > 0 ? (
              <div>
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
                  options={options.map((item: any, index: number) => {
                    if (item.value === 1) {
                      return {
                        ...item,
                        label: (
                          <button className="btn btn-link fs-14 fw-600 text-black ms-3 p-4 ">
                            {`${
                              props.data.rating.active ? 'Hide' : 'Show'
                            } this review`}
                          </button>
                        ),
                      };
                    } else {
                      return item;
                    }
                  })}
                  backgroundColor={'white'}
                  onChange={(event: any) => {
                    handleOption(event);
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-4">
            <em className="fs-16 fw-500 lh-base text-center">
              {props?.data?.rating?.message || ''}
            </em>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ReviewRatingsModal;
