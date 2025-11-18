import { Button, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import CrossRed from '../../umart_admin/assets/media/svg_uMart/cross-red.svg';
import { error } from '../../Global/toast';
import { allProductToast } from '../../utils/toast';
const RemoveVariants = (props: any) => {
  const handleRemove = (item: any, index: number) => {
    const tempGeneralData = { ...props.generalData };
    if (tempGeneralData.combinations.length > 1) {
      const tempRemoved = tempGeneralData.combinations.splice(index, 1);
      const tempSelectedVariants = tempGeneralData.selectedVariant.map(
        (val: any, index: number) => {
          const tempVal = val.options.filter((valItem: any) =>
            checkVariant(
              { id: val._id, title: valItem.title },
              tempGeneralData.combinations
            )
          );
          return {
            ...val,
            options: tempVal,
          };
        }
      );
      tempGeneralData.selectedVariant = tempSelectedVariants;
      // const tempVariants = tempGeneralData.variants.map((val: any) => {
      //   const tempVal: any = { ...val };
      //   if (tempVal?.categories[0]?.options) {
      //     const tempOptions = tempVal.categories[0].options.filter(
      //       (valItem: any) =>
      //         checkVariant(
      //           { id: val._id, title: valItem.title },
      //           tempGeneralData.combinations
      //         )
      //     );
      //     tempVal.categories[0].options = tempOptions;
      //   }
      //   return tempVal;
      // });
      // tempGeneralData.variants = tempVariants;
      props.onGeneralDataChange(tempGeneralData);
    } else {
      error(allProductToast.oneVariantRequire);
    }
  };
  const handleNext = () => {
    props.onNextTab(1, props.generalData, props.validation);
    props.onHide();
  };
  const checkVariant = (item: any, combinations: any) => {
    return combinations.some((val: any) => {
      return val.id.includes(item.id) && val.title.includes(item.title);
    });
  };
  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-600px"
        className="border-r10px"
        centered
        size="xl"
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 pb-0 text-center mx-auto">
          <img
            className="close-inner-top"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px pt-lg-3">
            Remove Variants
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 ">
          <div className="text-center mt-8">
            <div className=" mh-350px overflow-y-scroll border border-r10px p-4">
              {props?.generalData && props?.generalData?.combinations ? (
                props.generalData.combinations.map(
                  (item: any, index: number) => (
                    <>
                      {' '}
                      <div className="container-fluid">
                        <Row>
                          <Col
                            lg={12}
                            className="d-flex mb-5 mt-5 m-auto"
                          >
                            <Col lg={10}>
                              <div
                                className="d-flex  fs-20 fw-600 text-left"
                                style={{
                                  whiteSpace: 'break-spaces',
                                  overflow: 'hidden',
                                  textAlign: 'left',
                                }}
                              >
                                <span className="d-inline-block breakWord-nextLine">
                                  {item.title}
                                </span>
                              </div>
                            </Col>
                            {props.generalData.combinations[index]._id ? (
                              <Col lg={1}></Col>
                            ) : (
                              <Col lg={1}>
                                <div className="d-flex align-items-start">
                                  <span className="badge bg-e5f6de border-r4px p-3 fs-14 fw-600 text-dark me-2">
                                    New
                                  </span>
                                </div>
                              </Col>
                            )}
                            {props.generalData.combinations.length === 1 ? (
                              <></>
                            ) : (
                              <>
                                <Col lg={1}>
                                  <div className="d-flex align-items-start">
                                    <img
                                      src={CrossRed}
                                      onClick={() => {
                                        handleRemove(item, index);
                                      }}
                                    />
                                  </div>
                                </Col>
                              </>
                            )}
                          </Col>
                        </Row>
                      </div>
                      {/* <div className="d-flex  w-80 justify-content-between mb-5 m-auto align-items-center ">
                        <div className="text-center fs-20 fw-600 me-5 w-60">
                          {item.title}
                        </div>
                        {props.generalData.combinations.length === 1 ? (
                          <></>
                        ) : (
                          <div className=" d-flex justify-content-between w-100px align-items-center">
                            {props.generalData.combinations[index]._id ? (
                              <></>
                            ) : (
                              <div>
                                <span className="badge bg-e5f6de border-r4px p-3 fs-14 fw-600 text-dark me-2">
                                  New
                                </span>
                              </div>
                            )}
                            <div>
                              <img
                                src={CrossRed}
                                onClick={() => {
                                  handleRemove(item, index);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div> */}
                      {index !== props.generalData.combinations.length - 1 ? (
                        <div className="separator border my-3"></div>
                      ) : (
                        <></>
                      )}
                    </>
                  )
                )
              ) : (
                <></>
              )}
            </div>
            <div className="mt-10">
              <Button
                variant="danger"
                className="me-5"
                onClick={() => {
                  props.onHide();
                  props.onGeneralDataChange(props.generalData);
                }}
              >
                Close
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default RemoveVariants;
