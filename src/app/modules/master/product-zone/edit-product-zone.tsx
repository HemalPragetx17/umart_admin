import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import APICallService from '../../../../api/apiCallService';
import { success } from '../../../../Global/toast';
import { master } from '../../../../api/apiEndPoints';
import { masterToast } from '../../../../utils/toast';
import { Button, Col, Row } from 'react-bootstrap';
import clsx from 'clsx';
import { String } from '../../../../utils/string';
import { ProductZoneConst } from '../../../../utils/constants';
import Method from '../../../../utils/methods';
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
  _id: string;
}
const EditProductZone = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [productZones, setProductsZones] = useState<IProductZone>({
    name: state?.name || '',
    _id: state?._id || '',
    bins:
      state?.bins && state?.bins?.length
        ? state?.bins.map((item: any) => {
            return {
              label: item?.name,
              value: item?.name,
              title: item?.name,
              sequence: item?.sequence ? item?.sequence + '' : '',
            };
          })
        : [],
    sequence: state?.sequence || '',
    inputValue: '',
  });
  const [validation, setValidation] = useState<{
    name: boolean;
    sequence: boolean;
    bins: boolean;
    binSequence: boolean[];
  }>({
    name: false,
    sequence: false,
    bins: false,
    binSequence:
      state?.bins && state?.bins?.length
        ? state?.bins.map((item: any) => {
            return false;
          })
        : [],
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (() => {
      if (!state) {
        return window.history.back();
      }
    })();
  }, []);
  const handleProductZoneChange = (
    value: string,
    name: 'name' | 'sequence'
  ) => {
    const temp = { ...productZones };
    let tempValidation = { ...validation };
    temp[name] = value;
    if (value.trim().length === 0 || value.trim().length > 30) {
      tempValidation[name] = true;
    } else {
      tempValidation[name] = false;
    }
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleSave = async () => {
    let temp = { ...productZones };
    let tempValidation = { ...validation };
    if (temp.name.trim().length === 0 || temp.name.trim().length > 30) {
      tempValidation.name = true;
    }
    if (temp.sequence == '') {
      tempValidation.sequence = true;
    }
    if (temp.bins.length === 0) {
      tempValidation.bins = true;
    } else {
      temp.bins.forEach((item, index) => {
        tempValidation.binSequence[index] = item?.sequence.trim().length === 0;
      });
    }
    const data = {
      name: temp.name.trim(),
      sequence: temp.sequence?.toString().trim(),
      bins: temp.bins.map((val, index) => {
        return {
          name: val?.title?.trim(),
          sequence: val.sequence,
        };
      }),
    };
    if (
      !tempValidation.name &&
      !tempValidation.sequence &&
      !tempValidation.bins &&
      (tempValidation.binSequence.length === 0 ||
        tempValidation.binSequence.every((item) => item == false))
    ) {
      setLoading(true);
      const apiCallService = new APICallService(
        master.updateProductZone,
        data,
        { id: temp._id },
        '',
        false,
        '',
        ProductZoneConst
      );
      const response = await apiCallService.callAPI();
      if (response) {
        success(masterToast.productZoneUpdated);
        navigate('/master/product-zones');
      }
      setLoading(false);
    }
    setValidation(tempValidation);
  };
  const handleInputChange = (inputValue: string) => {
    const temp = { ...productZones };
    temp.inputValue = inputValue;
    setProductsZones(temp);
  };
  const createOption = (label: string) => ({
    label,
    value: label,
    title: label,
    sequence: '',
  });
  const handleMultiSelect = (inputValue: string) => {
    let temp = { ...productZones };
    const tempValidation = { ...validation };
    const newOption = createOption(inputValue);
    temp.bins.push(newOption);
    tempValidation.bins = false;
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleMultiSelectChange = (inputValue: any) => {
    let temp = { ...productZones };
    const tempValidation = { ...validation };
    temp.bins = inputValue;
    if (inputValue && inputValue?.length) {
      tempValidation.bins = false;
    } else {
      tempValidation.bins = true;
    }
    tempValidation.binSequence = inputValue
      ? inputValue.map((item: any) =>
          item.sequence ? item?.sequence.trim().length === 0 : true
        )
      : [];
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  const handleKeyDown = (event: any) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (event.target.value.trimStart().length > 0) {
          const newOption = createOption(event.target.value);
          let temp = { ...productZones };
          const tempValidation = { ...validation };
          temp.bins.push(newOption);
          temp.inputValue = '';
          tempValidation.bins = false;
          setProductsZones(temp);
          setValidation(tempValidation);
        }
        event.preventDefault();
    }
  };
  const handleBinSeqChange = (value: string, binIndex: number) => {
    const temp = { ...productZones };
    const tempValidation = { ...validation };
    temp.bins[binIndex].sequence = value;
    if (value.trim().length === 0 || value.trim().length > 30) {
      tempValidation.binSequence[binIndex] = true;
    } else {
      tempValidation.binSequence[binIndex] = false;
    }
    setProductsZones(temp);
    setValidation(tempValidation);
  };
  return (
    <Row>
      <Col
        lg={12}
        className="mb-6"
      >
        <h1 className="fs-22 fw-bolder">Edit product zone</h1>
      </Col>
      {state ? (
        <>
          <Col xs={12}>
            <div className="border border-r10px bg-light position-relative mb-4 p-9">
              <Row>
                <Col md={6}>
                  <Row>
                    {' '}
                    <Col
                      lg={5}
                      className="mt-4 mb-3"
                    >
                      <label className="fs-16 fw-500 text-dark mb-lg-0  required">
                        Product zone name
                      </label>
                    </Col>
                    <Col lg={7}>
                      <input
                        type="text"
                        className={clsx(
                          'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                          validation.name ? 'border-danger' : 'border'
                        )}
                        name="name"
                        placeholder="Enter product zone name"
                        disabled={loading}
                        value={productZones.name}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ): void =>
                          handleProductZoneChange(
                            e.target.value.trimStart(),
                            'name'
                          )
                        }
                      />
                    </Col>
                  </Row>{' '}
                </Col>
                <Col md={6}>
                  <Row>
                    {' '}
                    <Col
                      lg={4}
                      className="mt-4 mb-3"
                    >
                      <label className="fs-16 fw-500 text-dark mb-lg-0  required">
                        Sequence
                      </label>
                    </Col>
                    <Col lg={8}>
                      <input
                        type="text"
                        className={clsx(
                          'form-control form-control-solid bg-white h-60px border form-control-lg text-dark fs-16 fw-600',
                          validation.sequence ? 'border-danger' : 'border'
                        )}
                        name="name"
                        placeholder="Enter sequence"
                        disabled={loading}
                        value={productZones.sequence}
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ): void =>
                          handleProductZoneChange(
                            e.target.value.trimStart(),
                            'sequence'
                          )
                        }
                        onKeyPress={Method.handleOnKeyPress}
                      />
                    </Col>
                  </Row>{' '}
                </Col>
                <Col
                  xs={12}
                  className="d-flex align-items-center mt-4"
                >
                  <Row className="w-100">
                    <Col xs={2}>
                      {' '}
                      <label className="fs-16 fw-500 text-dark mb-lg-0 ">
                        Bins
                      </label>
                    </Col>
                    <Col
                      xs={9}
                      className="ms-13"
                    >
                      {' '}
                      <div className="w-100">
                        <CreatableSelectWhite
                          getOptionLabel={(option: any) => {
                            return <>{option.title}</>;
                          }}
                          inputValue={productZones.inputValue}
                          placeholder="Enter bins"
                          options={productZones.bins}
                          isMulti={true}
                          onCreateOption={(event: any) => {
                            handleMultiSelect(event);
                          }}
                          border={validation.bins ? '#e55451' : '#e0e0df'}
                          onChange={(newValue: any) => {
                            handleMultiSelectChange(newValue);
                          }}
                          onInputChange={(newValue: any) =>
                            handleInputChange(newValue)
                          }
                          value={productZones.bins}
                          indicatorDisplay="none"
                          display="none"
                          menuIsOpen={false}
                          onKeyDown={(event: any, newValue: any) =>
                            handleKeyDown(event)
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                {productZones.bins && productZones?.bins.length ? (
                  <Col xs={12}>
                    <Row>
                      <Col xs={12}>
                        <div className="fs-16 fw-500 text-black">
                          Selcted bins
                        </div>
                      </Col>
                      {productZones?.bins.map(
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
                                      validation.binSequence[binIndex]
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
                                        binIndex
                                      )
                                    }
                                    onKeyPress={Method.handleOnKeyPress}
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
                  Save product zone
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
        </>
      ) : (
        <></>
      )}
    </Row>
  );
};
export default EditProductZone;
