import { Card, Modal } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
const ReturnProductsModal = (props: any) => {
  return (
    <Modal
      centered
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-dialog-centered min-w-lg-600px min-w-md-600px"
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
        <Modal.Title className=" mw-lg-450px  mb-0">
          <div className="fs-26 fw-bolder">
            {props?.product?.variant?.title}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-5">
        {props?.product?.variant.media && props?.product?.variant.media ? (
          <div className="mb-6 d-flex justify-content-center">
            <div
              id="kt_carousel_1_carousel"
              className="carousel carousel-custom slide w-275px"
              data-bs-ride="carousel"
              data-bs-interval="4000"
            >
              <div className="d-flex align-items-center justify-content-between flex-wrap "></div>
              <Card className="border  p-0 border-gray-300">
                <Card.Body className=" pt-0">
                  <div className="carousel-inner pt-8  h-200px mw-275px">
                    {props?.product?.variant.media.map(
                      (item: any, index: number) => (
                        <div
                          className={`carousel-item ${
                            index === 0 ? 'active' : ''
                          }`}
                        >
                          {/* <div className="symbol symbol-200px symbol-fixed  position-relative  w-100 ">
                          <div className="image-input d-flex flex-center rounded w-lg-200px w-150px h-lg-200px h-150px text-center w-100 bg-dark">
                            <div
                              className="image-input-wrapper shadow-none bgi-contain bgi-position-center border-r10px w-100 h-100 bg-danger"
                              style={{
                                background: `url(${item || ''})`,
                                //TODO please se if working or not
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                              }}
                            ></div>
                          </div>
                        </div> */}
                          <img
                            src={item.url}
                            className="h-200px w-100 object-fit-contain"
                          />
                        </div>
                      )
                    )}
                  </div>
                </Card.Body>
              </Card>
              <ol className="p-0 m-0 carousel-indicators carousel-indicators-dots">
                {props?.product?.variant?.media.map(
                  (item: any, index: number) => (
                    <li
                      data-bs-target="#kt_carousel_1_carousel"
                      data-bs-slide-to={index}
                      className={`ms-1 ${index === 0 ? 'active' : ''}`}
                    ></li>
                  )
                )}
              </ol>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default ReturnProductsModal;
