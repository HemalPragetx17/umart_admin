import clsx from 'clsx';
import { Button, Col, Row } from 'react-bootstrap';
import PlusImg from '../../../../umart_admin/assets/media/add.png';
import RemoveImg from '../../../../umart_admin/assets/media/svg_uMart/cross_gray.svg';
import { useEffect, useState } from 'react';
import { String } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { master } from '../../../../api/apiEndPoints';
import { success } from '../../../../Global/toast';
import { masterToast } from '../../../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { Add, ProductZoneConst } from '../../../../utils/constants';
import Method from '../../../../utils/methods';
import { useAuth } from '../../auth';
import { CreatableSelectWhite } from '../../../custom/Select/CreatableSelectWhite';
interface IProductZone {
  name: string;
  sequence: string;
  bins: {
    value: string;
    label: string;
    title: string;
    sequence: string;
  }[];
  inputValue: string;
}
const AddProductZone = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [productZones, setProductsZones] = useState<IProductZone[]>([
    {
      name: '',
      bins: [],
      sequence: '',
      inputValue: '',
    },
  ]);
  const [validation, setValidation] = useState<
    Array<{
      name: boolean;
      sequence: boolean;
      bins: boolean;
      binsSequence: boolean[];
    }>
  >([
    {
      name: false,
      sequence: false,
      bins: false,
      binsSequence: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (() => {
      if (!Method.hasPermission(ProductZoneConst, Add, currentUser)) {
        return window.history.back();
      }
    })();
  }, []);
  const handleAddMore = (index: number) => {
    const temp = [...productZones];
    const tempValidation = [...validation];
    const tempName =
      temp[temp.length - 1].name !== '' &&
      temp[temp.length - 1].name.trim().length > 0;
    const seq =
      temp[temp.length - 1].sequence !== '' &&
      temp[temp.length - 1].sequence.trim().length > 0;
    const binsValid =
      temp[temp.length - 1].bins && temp[temp.length - 1].bins.length > 0;
    if (tempName && seq && binsValid) {
      temp.push({
        name: '',
        bins: [],
        sequence: '',
        inputValue: '',
      });
      tempValidation.push({
        name: false,
        sequence: false,
        bins: false,
        binsSequence: [],
      });
    } else {
      tempValidation[tempValidation.length - 1].name = !tempName;
      tempValidation[tempValidation.length - 1].sequence = !seq;
      tempValidation[tempValidation.length - 1].bins = !binsValid;
    }
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleRemove = (index: number) => {
    const temp = [...productZones];
    const tempValidation = [...validation];
    temp.splice(index, 1);
    tempValidation.splice(index, 1);
    if (temp.length === 0) {
      temp.push({ name: '', bins: [], sequence: '', inputValue: '' });
      tempValidation.push({
        name: false,
        sequence: false,
        bins: false,
        binsSequence: [],
      });
    }
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleProductZoneChange = (
    value: string,
    index: number,
    name: 'name' | 'sequence'
  ) => {
    const temp = [...productZones];
    const tempValidation = [...validation];
    temp[index][name] = value;
    if (value.trim().length === 0 || value.trim().length > 30) {
      tempValidation[index][name] = true;
    } else {
      tempValidation[index][name] = false;
    }
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleSave = async () => {
    let temp = [...productZones];
    const tempValidations = [...validation];
    const data = temp.map((item, index) => {
      if (item.name.trim().length === 0 || item.name.trim().length > 30) {
        tempValidations[index].name = true;
      }
      if (item.sequence.trim().length === 0) {
        tempValidations[index].sequence = true;
      }
      if (item?.bins?.length === 0) {
        tempValidations[index].bins = true;
      } else {
        item.bins.forEach((binItem, binIndex) => {
          tempValidations[index].binsSequence[binIndex] =
            binItem.sequence.trim().length === 0;
        });
      }
      return {
        name: item.name.trim(),
        sequence: item.sequence,
        bins: item.bins.map((val, valIndex) => {
          return {
            name: val.title.trim(),
            sequence: val.sequence,
          };
        }),
      };
    });
    const isValid = tempValidations.every(
      (item) =>
        item.name === false &&
        item.sequence === false &&
        item.bins === false &&
        (item.binsSequence.length === 0 ||
          item?.binsSequence.every((binItem) => binItem == false))
    );
    if (isValid) {
      setLoading(true);
      const apiCallService = new APICallService(
        master.addProductZone,
        {
          list: data,
        },
        '',
        '',
        false,
        '',
        ProductZoneConst
      );
      const response = await apiCallService.callAPI();
      if (response) {
        navigate('/master/product-zones');
        success(masterToast.productZoneAdded);
      }
      setLoading(false);
    }
    setValidation(tempValidations);
  };
  const handleInputChange = (inputValue: string, index: number) => {
    const temp = [...productZones];
    temp[index].inputValue = inputValue;
    setProductsZones(temp);
  };
  const createOption = (label: string) => ({
    label,
    value: label,
    title: label,
    sequence: '',
  });
  const handleMultiSelect = (inputValue: string, index: number) => {
    let temp = [...productZones];
    const tempValidation = [...validation];
    const newOption = createOption(inputValue);
    temp[index].bins.push(newOption);
    tempValidation[index].bins = false;
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleMultiSelectChange = (inputValue: any, index: number) => {
    let temp = [...productZones];
    const tempValidation = [...validation];
    temp[index].bins = inputValue;
    if (inputValue && inputValue?.length) {
      tempValidation[index].bins = false;
    } else {
      tempValidation[index].bins = true;
    }
    tempValidation[index].binsSequence = inputValue
      ? inputValue.map((item: any) =>
          item.sequence ? item?.sequence.trim().length === 0 : true
        )
      : [];
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleKeyDown = (event: any, index: number) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (event.target.value.trimStart().length > 0) {
          const newOption = createOption(event.target.value);
          let temp = [...productZones];
          const tempValidation = [...validation];
          temp[index].bins.push(newOption);
          temp[index].inputValue = '';
          tempValidation[index].bins = false;
          setProductsZones(temp);
          setValidation(tempValidation);
        }
        event.preventDefault();
    }
  };
  const handleOnKeyPress = (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const handleBinSeqChange = (
    value: string,
    index: number,
    binIndex: number
  ) => {
    const temp = [...productZones];
    const tempValidation = [...validation];
    temp[index].bins[binIndex].sequence = value;
    if (value.trim().length === 0 || value.trim().length > 30) {
      tempValidation[index].binsSequence[binIndex] = true;
    } else {
      tempValidation[index].binsSequence[binIndex] = false;
    }
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  return Method.hasPermission(ProductZoneConst, Add, currentUser) ? (
    <Row>
      <Col
        lg={12}
        className="mb-6"
      >
        <h1 className="fs-22 fw-bolder">Add product zone/bins</h1>
      </Col>
      <Col xs={12}>
        <div className="border border-r10px bg-light position-relative mb-4 p-9">
          <Row>
            <Col
              xs={12}
              className="mb-6"
            >
              <Row>
                <Col
                  xs={12}
                  className="mt-4 mb-3"
                >
                  <Row>
                    <Col xs={3}>
                      {' '}
                      <label className="fs-16 fw-500 text-dark mb-lg-0  required">
                        Product zone name
                      </label>
                    </Col>
                    <Col xs={2}>
                      {' '}
                      <label className="fs-16 fw-500 text-dark mb-lg-0  required">
                        Sequence
                      </label>
                    </Col>
                    <Col xs={6}>
                      {' '}
                      <label className="fs-16 fw-500 text-dark mb-lg-0  required">
                        Bins
                      </label>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12}>
                  <Row className="d-flex">
                    {productZones.map((item, index) => (
                      <>
                        <Col
                          key={index}
                          lg={3}
                          className="d-flex align-items-center mb-4 ms-auto"
                        >
                          <input
                            type="text"
                            className={clsx(
                              'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                              validation[index].name
                                ? 'border-danger'
                                : 'border'
                            )}
                            name="name"
                            placeholder="Enter product zone name"
                            disabled={loading}
                            value={item.name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ): void =>
                              handleProductZoneChange(
                                e.target.value.trimStart(),
                                index,
                                'name'
                              )
                            }
                          />
                        </Col>
                        <Col
                          key={index}
                          lg={2}
                          className="d-flex align-items-center mb-4 ms-auto"
                        >
                          <input
                            type="text"
                            className={clsx(
                              'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                              validation[index].sequence
                                ? 'border-danger'
                                : 'border'
                            )}
                            name="name"
                            placeholder="Enter sequence"
                            disabled={loading}
                            value={item.sequence}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ): void =>
                              handleProductZoneChange(
                                e.target.value.trimStart(),
                                index,
                                'sequence'
                              )
                            }
                            onKeyPress={handleOnKeyPress}
                          />
                        </Col>
                        <Col
                          xs={6}
                          className="mb-4"
                        >
                          {' '}
                          <CreatableSelectWhite
                            getOptionLabel={(option: any) => {
                              return <>{option.title}</>;
                            }}
                            inputValue={item.inputValue}
                            placeholder="Enter bins"
                            options={item.bins}
                            isMulti={true}
                            onCreateOption={(event: any) => {
                              handleMultiSelect(event, index);
                            }}
                            border={
                              validation[index].bins ? '#e55451' : '#e0e0df'
                            }
                            onChange={(newValue: any) => {
                              handleMultiSelectChange(newValue, index);
                            }}
                            onInputChange={(newValue: any) =>
                              handleInputChange(newValue, index)
                            }
                            value={item.bins}
                            indicatorDisplay="none"
                            display="none"
                            menuIsOpen={false}
                            onKeyDown={(event: any, newValue: any) =>
                              handleKeyDown(event, index)
                            }
                          />
                        </Col>
                        <Col className="d-flex align-items-center mb-4">
                          <div className="d-flex align-items-center">
                            {productZones.length - 1 === index ? (
                              <>
                                {productZones.length > 1 ? (
                                  <span className="me-5 cursor-pointer">
                                    <img
                                      src={RemoveImg}
                                      width={19}
                                      height={19}
                                      onClick={() => handleRemove(index)}
                                    />
                                  </span>
                                ) : (
                                  <></>
                                )}
                                <span className="cursor-pointer">
                                  <img
                                    src={PlusImg}
                                    width={22}
                                    height={22}
                                    onClick={() => handleAddMore(index)}
                                  />
                                </span>
                              </>
                            ) : (
                              <span className="me-5 cursor-pointer">
                                <img
                                  src={RemoveImg}
                                  width={19}
                                  height={19}
                                  onClick={() => handleRemove(index)}
                                />
                              </span>
                            )}
                          </div>
                        </Col>
                        {item?.bins && item?.bins.length ? (
                          <Col xs={12} className='mb-6'>
                            <Row>
                              <Col xs={12}>
                                <div className="fs-16 fw-500 text-black">
                                  Selcted bins
                                </div>
                              </Col>
                              {item?.bins.map(
                                (binVal: any, binIndex: number) => {
                                  return (
                                    <Col xs={12}>
                                      <Col
                                        xs={6}
                                        className="my-3 d-flex align-items-center justify-content-between"
                                      >
                                        <div className="fs-16 fw-500 text-black">
                                          {binVal?.title}
                                        </div>
                                        <div>
                                          <input
                                            type="text"
                                            className={clsx(
                                              'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                                              validation[index].binsSequence[
                                                binIndex
                                              ]
                                                ? 'border-danger'
                                                : 'border'
                                            )}
                                            name="name"
                                            placeholder="Enter sequence"
                                            disabled={loading}
                                            value={binVal?.sequence}
                                            onChange={(
                                              e: React.ChangeEvent<HTMLInputElement>
                                            ): void =>
                                              handleBinSeqChange(
                                                e.target.value.trimStart(),
                                                index,
                                                binIndex
                                              )
                                            }
                                            onKeyPress={handleOnKeyPress}
                                          />
                                        </div>
                                      </Col>
                                    </Col>
                                  );
                                }
                              )}
                            </Row>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
      <Col
        xs="auto"
        className="ms-auto mt-2"
      >
        <Button
          variant="primary"
          size="lg"
          className="w-fit-content"
          onClick={handleSave}
          disabled={loading}
        >
          {!loading && (
            <span className="indicator-label fs-16 fw-bold">
              Save product zones
            </span>
          )}
          {loading && (
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
    </Row>
  ) : (
    <></>
  );
};
export default AddProductZone;
