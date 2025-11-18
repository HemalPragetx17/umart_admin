import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import clsx from 'clsx';
import arrowDown from '../../../../umart_admin/assets/media/svg_uMart/down-arrow.svg';
import arrowUp from '../../../../umart_admin/assets/media/svg_uMart/up-arrow.svg';
import Validations from '../../../../utils/validations';
import Method from '../../../../utils/methods';
import AddIcon from '../../../../umart_admin/assets/media/add.png';
import RemoveIcon from '../../../../umart_admin/assets/media/svg_uMart/cross_gray.svg';
const Price = (props: any) => {
  const [generalData, setGeneralData] = useState(
    JSON.parse(JSON.stringify(props.generalData))
  );
  const [prices, setPrices] = useState<any>(
    props.generalData.combinations.map((item: any, index: number) => {
      return {
        price: Method.getGeneralizedAmount(item.units.price),
      };
    })
  );
  const [accindex, setAccIndex] = useState('-1');
  const [generalDataValidation, setGeneralDataValidation] = useState<any>(
    props.validations
  );
  useEffect(() => {
    props.onGeneralDataChange(generalData);
  }, [generalData]);
  useEffect(() => {
    props.onValidationChange(generalDataValidation);
  }, [generalDataValidation]);
  const handleChange = async (
    value: any,
    combinationIndex: number,
    name: string,
    itemIndex: number = 0
  ) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    let tempPrices = [...prices];
    // temp.combinations[combinationIndex].units[name] = value;
    if (name === 'price') {
      value = value.split('.')[0];
      if (Validations.allowNumberAndFloat(value)) {
        const lastCharIsDot = value.slice(-1) === '.';
        value = value.replace(/,/g, '');
        temp.combinations[combinationIndex].units[name] = value;
        const formattedValue = Method.getGeneralizedAmount(value);
        const newValue = lastCharIsDot ? formattedValue + '.' : formattedValue;
        tempPrices[combinationIndex].price = newValue;
        setPrices(tempPrices);
      }
    } else if (name === 'skuNumber') {
      temp.combinations[combinationIndex].units[name] = value;
    } else if (name === 'discountAmount') {
      value = value.split('.')[0];
      if (Validations.allowNumberAndFloat(value)) {
        const lastCharIsDot = value.slice(-1) === '.';
        value = value.replace(/,/g, '');
        temp.combinations[combinationIndex].units[name][itemIndex].amount =
          value;
      }
    } else if (name === 'discountQuantity') {
      value = value.split('.')[0];
      if (Validations.allowNumberAndFloat(value)) {
        const lastCharIsDot = value.slice(-1) === '.';
        value = value.replace(/,/g, '');
        temp.combinations[combinationIndex].units[name][itemIndex].quantity =
          value;
      }
    }
    setGeneralData(temp);
    await checkValidation(temp, name, combinationIndex, itemIndex);
  };
  const checkValidation = async (
    generalTemp: any,
    name: string,
    combinationIndex: number,
    itemIndex: number = 0
  ) => {
    let tempValidation = { ...generalDataValidation };
    if (name === 'price') {
      if (
        generalTemp.combinations[combinationIndex].units[name] === '' ||
        generalTemp.combinations[combinationIndex].units[name] === 0
      ) {
        tempValidation.combinations[combinationIndex].units[name] = true;
        tempValidation.combinations[combinationIndex].units['quantityTypes'] =
          true;
      } else {
        tempValidation.combinations[combinationIndex].units[name] = false;
      }
    } else if (name === 'skuNumber') {
      const skuLength =
        generalTemp.combinations[combinationIndex].units[name].trim().length;
      if (skuLength === 0) {
        tempValidation.combinations[combinationIndex].units[name] = true;
      } else {
        tempValidation.combinations[combinationIndex].units[name] = false;
      }
    } else if (name === 'discountQuantity') {
      if (
        generalTemp.combinations[combinationIndex].units[name][itemIndex]
          .quantity === '' ||
        generalTemp.combinations[combinationIndex].units[name][itemIndex]
          .quantity === 0
      ) {
        tempValidation.combinations[combinationIndex].units[name][itemIndex] =
          true;
      } else {
        tempValidation.combinations[combinationIndex].units[name][itemIndex] =
          false;
      }
    } else if (name === 'discountAmount') {
      if (
        generalTemp.combinations[combinationIndex].units[name][itemIndex]
          .amount === '' ||
        generalTemp.combinations[combinationIndex].units[name][itemIndex]
          .amount === 0
      ) {
        tempValidation.combinations[combinationIndex].units[name][itemIndex] =
          true;
      } else {
        tempValidation.combinations[combinationIndex].units[name][itemIndex] =
          false;
      }
    }
    setGeneralDataValidation(tempValidation);
  };
  const handleOnKeyPress = (
    event: any,
    combinationIndex: number,
    name: string
  ) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (name === 'price') {
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        event.preventDefault();
        return false;
      }
    } else if (name === 'skuNumber') {
      if (
        ((charCode < 48 || charCode > 57) &&
          (charCode < 65 || charCode > 90)) ||
        charCode === 61
      ) {
        event.preventDefault();
        return false;
      }
    }
    return true;
  };
  const handleAccordion = (combinationIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    temp.combinations[combinationIndex].units.isOpen =
      !temp.combinations[combinationIndex].units.isOpen;
    setGeneralData(temp);
  };
  const handleRadioChange = (value: any, combinationIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    temp.combinations[combinationIndex].units.discountByQuantitiesEnabled =
      value;
    setGeneralData(temp);
  };
  const handleAddMore = (combinationIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    let tempValidation = { ...generalDataValidation };
    const isValidQuantity = temp.combinations[
      combinationIndex
    ].units.discountQuantity.every((item: any, index: number) => {
      if (item.quantity == null) {
        tempValidation.combinations[combinationIndex].units.discountQuantity[
          index
        ] = true;
        return false;
      }
      return true;
    });
    const isValidAmount = temp.combinations[
      combinationIndex
    ].units.discountAmount.every((item: any, index: number) => {
      if (item.amount == null) {
        tempValidation.combinations[combinationIndex].units.discountAmount[
          index
        ] = true;
        return false;
      }
      return true;
    });
    if (isValidAmount && isValidQuantity) {
      temp.combinations[combinationIndex].units.discountQuantity.push({
        quantity: null,
      });
      temp.combinations[combinationIndex].units.discountAmount.push({
        amount: null,
      });
      tempValidation.combinations[combinationIndex].units.discountQuantity.push(
        false
      );
      tempValidation.combinations[combinationIndex].units.discountAmount.push(
        false
      );
      setGeneralData(temp);
    }
    setGeneralDataValidation(tempValidation);
  };
  const handleRemove = (itemIndex: number, combinationIndex: number) => {
    let temp = JSON.parse(JSON.stringify({ ...generalData }));
    let tempValidation = { ...generalDataValidation };
    temp.combinations[combinationIndex].units.discountQuantity =
      temp.combinations[combinationIndex].units.discountQuantity.filter(
        (item: any, index: number) => index !== itemIndex
      );
    temp.combinations[combinationIndex].units.discountAmount =
      temp.combinations[combinationIndex].units.discountAmount.filter(
        (item: any, index: number) => index !== itemIndex
      );
    tempValidation.combinations[combinationIndex].units.discountQuantity =
      tempValidation.combinations[
        combinationIndex
      ].units.discountQuantity.filter(
        (item: any, index: number) => index !== itemIndex
      );
    tempValidation.combinations[combinationIndex].units.discountAmount =
      tempValidation.combinations[combinationIndex].units.discountAmount.filter(
        (item: any, index: number) => index !== itemIndex
      );
    setGeneralData(temp);
    setGeneralDataValidation(tempValidation);
  };
  return (
    <>
      {props.generalData &&
        props.generalData.combinations.map((val: any, index: number) => {
          return (
            <>
              <Card className="p-0 mb-6">
                <Card.Header
                  className={clsx(
                    'border min-h-95px ',
                    val?.units?.isOpen ? '' : 'border-r10px',
                    generalDataValidation.combinations[index] &&
                      generalDataValidation.combinations[index].validation
                      ? 'border-danger'
                      : ''
                  )}
                >
                  <Row
                    className="fs-16 fw-600 align-items-center w-100"
                    onClick={() => {
                      handleAccordion(index);
                    }}
                  >
                    <Col
                      md
                      className="mb-md-0 mb-5 text-start"
                    >
                      <Button
                        className="btn-flush btn-white w-100 text-start"
                        variant=""
                      >
                        <span className={clsx('fs-28 fw-bolder text-dark')}>
                          {val.title.replace(/\s*\)\s*/g, ')')}
                        </span>
                      </Button>
                    </Col>
                    <Col md="auto">
                      {val.units?.isOpen ? (
                        <Button
                          variant="link"
                          className="btn-flush"
                          onClick={() => {
                            handleAccordion(index);
                          }}
                        >
                          <img
                            src={arrowUp}
                            alt=""
                          />
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          className="btn-flush"
                          onClick={() => {
                            handleAccordion(index);
                          }}
                        >
                          <img
                            src={arrowDown}
                            alt=""
                          />
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Header>
                {val.units?.isOpen === true ? (
                  <>
                    <Card.Body
                      className={clsx(
                        'border border-top-0 bg-light p-0',
                        generalDataValidation.combinations[index].validation
                          ? 'border-danger'
                          : ''
                      )}
                    >
                      <Row className="p-6">
                        <h2 className="fs-24 fw-bolder text-black mb-6">
                          Add unit details
                        </h2>
                        <Col lg={12}>
                          <Row className="align-items-center">
                            <Col md="auto">
                              <div className="symbol symbol-125px symbol-md-168px bg-body">
                                <img
                                  className="img-fluid p-2 object-fit-contain"
                                  src={val.units.images[0].url}
                                  alt=""
                                />
                              </div>
                            </Col>
                            <Col md={9}>
                              <Row className="align-items-center mt-md-0 mt-5">
                                <Col lg={12}>
                                  <Row>
                                    <Col md={6}>
                                      <Row className="align-items-center">
                                        <Col
                                          lg={4}
                                          className="mb-3"
                                        >
                                          <label
                                            htmlFor=""
                                            className="fs-16 fw-500 mb-lg-0 mb-3 required"
                                          >
                                            Original price of a unit
                                          </label>
                                        </Col>
                                        <Col
                                          lg={8}
                                          className="mb-3"
                                        >
                                          <div className="input-group input-group-solid h-60px border">
                                            <span
                                              className={clsx(
                                                'input-group-text fs-16 fw-600 text-dark bg-white p-0 ps-3 ',
                                                generalDataValidation
                                                  .combinations[index].units
                                                  .price
                                                  ? 'border-danger border-right-0'
                                                  : 'border-0 '
                                              )}
                                              id="basic-addon1"
                                            >
                                              TSh
                                            </span>
                                            <input
                                              type="text"
                                              className={clsx(
                                                'form-control form-control-lg bg-white text-black fs-16 fw-600 ps-4',
                                                generalDataValidation
                                                  .combinations[index].units
                                                  .price
                                                  ? 'border-danger border-left-0'
                                                  : 'border-0 '
                                              )}
                                              placeholder="Original price"
                                              value={prices[index].price}
                                              onChange={(event: any) => {
                                                handleChange(
                                                  event.target.value,
                                                  index,
                                                  'price'
                                                );
                                              }}
                                              onKeyPress={(event: any) => {
                                                handleOnKeyPress(
                                                  event,
                                                  index,
                                                  'price'
                                                );
                                              }}
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col md={6}>
                                      <Row className="align-items-center">
                                        <Col
                                          lg={4}
                                          className="mb-3"
                                        >
                                          <label
                                            htmlFor=""
                                            className="fs-16 fw-500 required"
                                          >
                                            SKU number
                                          </label>
                                        </Col>
                                        <Col
                                          lg={8}
                                          className="mb-3"
                                        >
                                          <div className="input-group input-group-solid h-60px border">
                                            <input
                                              type="text"
                                              disabled={true}
                                              className={clsx(
                                                'form-control form-control-lg bg-white text-black fs-16 fw-600',
                                                generalDataValidation
                                                  .combinations[index].units
                                                  .skuNumber
                                                  ? 'border-danger border-left-0'
                                                  : 'border-0 '
                                              )}
                                              value={val.units.skuNumber}
                                              placeholder="SKU number"
                                              onChange={(event: any) => {
                                                handleChange(
                                                  event.target.value,
                                                  index,
                                                  'skuNumber'
                                                );
                                              }}
                                              onKeyPress={(event: any) => {
                                                handleOnKeyPress(
                                                  event,
                                                  index,
                                                  'skuNumber'
                                                );
                                              }}
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      xs={12}
                                      className="mt-4"
                                    >
                                      <Row className="align-items-center">
                                        <Col
                                          lg={12}
                                          className="mb-3"
                                        >
                                          <label
                                            htmlFor=""
                                            className="fs-16 fw-500 required"
                                          >
                                            Do you want to bundle products by
                                            quantities ?
                                          </label>
                                        </Col>
                                        <Col
                                          md={8}
                                          className="mt-0"
                                        >
                                          <div className="d-flex flex-wrap mb-6  mt-2 align-items-center">
                                            <div className="form-check  d-flex align-items-center me-3 ">
                                              <input
                                                className="form-check-input me-2"
                                                type="radio"
                                                id="flexRadioDefault1"
                                                value={0}
                                                checked={
                                                  !val.units
                                                    .discountByQuantitiesEnabled
                                                }
                                                onChange={(event) =>
                                                  handleRadioChange(
                                                    false,
                                                    index
                                                  )
                                                }
                                              />
                                              <label
                                                className="form-check-label text-black fs-16 fw-600"
                                                htmlFor="flexRadioDefault1"
                                              >
                                                No
                                              </label>
                                            </div>
                                            <div className="form-check  d-flex align-items-center me-3">
                                              <input
                                                className="form-check-input me-2"
                                                type="radio"
                                                id="flexRadioDefault2"
                                                value={1}
                                                checked={
                                                  val.units
                                                    .discountByQuantitiesEnabled
                                                }
                                                onChange={(event) =>
                                                  handleRadioChange(true, index)
                                                }
                                              />
                                              <label
                                                className="form-check-label text-black fs-16 fw-600 "
                                                htmlFor="flexRadioDefault2"
                                              >
                                                Yes
                                              </label>
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                    </Col>
                                    {val.units.discountByQuantitiesEnabled ? (
                                      <>
                                        {val.units.discountQuantity.map(
                                          (item: any, itemIndex: number) => (
                                            <>
                                              {' '}
                                              <Col md={5}>
                                                <Row className="align-items-center">
                                                  <Col
                                                    lg={4}
                                                    className="mb-3"
                                                  >
                                                    <label
                                                      htmlFor=""
                                                      className="fs-16 fw-500 mb-lg-0 mb-3 required"
                                                    >
                                                      Quantity
                                                    </label>
                                                  </Col>
                                                  <Col
                                                    lg={8}
                                                    className="mb-3"
                                                  >
                                                    <div className="input-group input-group-solid h-60px border">
                                                      <span
                                                        className={clsx(
                                                          'input-group-text fs-16 fw-600 text-dark bg-white p-0 ps-3 pe-1',
                                                          generalDataValidation
                                                            .combinations[index]
                                                            .units
                                                            .discountQuantity[
                                                            itemIndex
                                                          ]
                                                            ? 'border-danger border-right-0'
                                                            : 'border-0 '
                                                        )}
                                                        id="basic-addon1"
                                                      >
                                                        Units
                                                      </span>
                                                      <input
                                                        type="text"
                                                        className={clsx(
                                                          'form-control form-control-lg bg-white text-black fs-16 fw-600 ps-4',
                                                          generalDataValidation
                                                            .combinations[index]
                                                            .units
                                                            .discountQuantity[
                                                            itemIndex
                                                          ]
                                                            ? 'border-danger border-left-0'
                                                            : 'border-0 '
                                                        )}
                                                        placeholder="Enter quantity"
                                                        // value={val.units.price}
                                                        value={
                                                          val.units
                                                            .discountQuantity[
                                                            itemIndex
                                                          ].quantity
                                                        }
                                                        onChange={(
                                                          event: any
                                                        ) => {
                                                          handleChange(
                                                            event.target.value,
                                                            index,
                                                            'discountQuantity',
                                                            itemIndex
                                                          );
                                                        }}
                                                        onKeyPress={(
                                                          event: any
                                                        ) => {
                                                          handleOnKeyPress(
                                                            event,
                                                            index,
                                                            'price'
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <Col md={5}>
                                                <Row className="align-items-center">
                                                  <Col
                                                    lg={4}
                                                    className="mb-3"
                                                  >
                                                    <label
                                                      htmlFor=""
                                                      className="fs-16 fw-500 mb-lg-0 mb-3 required"
                                                    >
                                                      Price
                                                    </label>
                                                  </Col>
                                                  <Col
                                                    lg={8}
                                                    className="mb-3"
                                                  >
                                                    <div className="input-group input-group-solid h-60px border">
                                                      <span
                                                        className={clsx(
                                                          'input-group-text fs-16 fw-600 text-dark bg-white p-0 ps-3',
                                                          generalDataValidation
                                                            .combinations[index]
                                                            .units
                                                            .discountAmount[
                                                            itemIndex
                                                          ]
                                                            ? 'border-danger border-right-0'
                                                            : 'border-0 '
                                                        )}
                                                        id="basic-addon1"
                                                      >
                                                        TSh
                                                      </span>
                                                      <input
                                                        type="text"
                                                        className={clsx(
                                                          'form-control form-control-lg bg-white text-black fs-16 fw-600 ps-4',
                                                          generalDataValidation
                                                            .combinations[index]
                                                            .units
                                                            .discountAmount[
                                                            itemIndex
                                                          ]
                                                            ? 'border-danger border-left-0'
                                                            : 'border-0 '
                                                        )}
                                                        placeholder="Enter price"
                                                        // value={val.units.price}
                                                        value={
                                                          val.units
                                                            .discountAmount[
                                                            itemIndex
                                                          ].amount
                                                        }
                                                        onChange={(
                                                          event: any
                                                        ) => {
                                                          handleChange(
                                                            event.target.value,
                                                            index,
                                                            'discountAmount',
                                                            itemIndex
                                                          );
                                                        }}
                                                        onKeyPress={(
                                                          event: any
                                                        ) => {
                                                          handleOnKeyPress(
                                                            event,
                                                            index,
                                                            'price'
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <Col
                                                md={2}
                                                className="d-flex align-items-center pb-3 "
                                              >
                                                {val.units.discountQuantity
                                                  .length == 1 ? (
                                                  <img
                                                    className="cursor-pointer me-4"
                                                    src={AddIcon}
                                                    alt="add"
                                                    height={25}
                                                    width={25}
                                                    onClick={() =>
                                                      handleAddMore(index)
                                                    }
                                                  />
                                                ) : (
                                                  <>
                                                    {itemIndex ==
                                                      val.units.discountQuantity
                                                        .length -
                                                        1 && (
                                                      <img
                                                        className="cursor-pointer me-4"
                                                        src={AddIcon}
                                                        alt="add"
                                                        height={25}
                                                        width={25}
                                                        onClick={() =>
                                                          handleAddMore(index)
                                                        }
                                                      />
                                                    )}
                                                    <img
                                                      className="cursor-pointer"
                                                      src={RemoveIcon}
                                                      alt="add"
                                                      height={20}
                                                      width={20}
                                                      onClick={() =>
                                                        handleRemove(
                                                          itemIndex,
                                                          index
                                                        )
                                                      }
                                                    />
                                                  </>
                                                )}
                                                {/* {itemIndex !== 0 ? (
                                                <img
                                                  className="cursor-pointer"
                                                  src={RemoveIcon}
                                                  alt="add"
                                                  height={20}
                                                  width={20}
                                                  onClick={() =>
                                                    handleRemove(
                                                      itemIndex,
                                                      index
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <></>
                                              )} */}
                                              </Col>
                                            </>
                                          )
                                        )}{' '}
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </>
                ) : (
                  <></>
                )}
              </Card>
            </>
          );
        })}
    </>
  );
};
export default Price;
