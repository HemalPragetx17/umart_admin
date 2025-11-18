import { Button, Col, Modal, Row } from 'react-bootstrap';
import CrossSvg from '../../umart_admin/assets/media/close.png';
import { String } from '../../utils/string';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { faqString } from './../../utils/string';
import { CreatableSelectWhite } from '../custom/Select/CreatableSelectWhite';
import APICallService from '../../api/apiCallService';
import { product } from '../../api/apiEndPoints';
import { Product } from '../../utils/constants';
import { success } from '../../Global/toast';
import { allProductToast } from '../../utils/toast';
interface IProps {
  show: boolean;
  onHide: () => void;
  data: any;
  onClose: () => Promise<any>;
}
const EditSearchTags = (props: IProps) => {
  const [searchTags, setSearchTags] = useState<{
    inputValue: string;
    options: { value: string; label: string; title: string }[];
  }>({ inputValue: '', options: [] });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const { data } = props;
    if (data?.searchTag?.length > 0) {
      setSearchTags({
        inputValue: '',
        options: data?.searchTag?.map((item: any) => createOption(item)),
      });
    }
  }, [props.data]);
  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      searchTag: searchTags.options.map((item) => item.title),
    };
    const apiCallService = new APICallService(
      product.updateSearchTags,
      params,
      { id: props.data?._id },
      '',
      false,
      '',
      Product
    );
    const response = await apiCallService.callAPI();
    if (response) {
      success(allProductToast.searchTagsUpdated);
      await props.onClose();
    }
    setLoading(false);
  };
  const createOption = (label: string) => ({
    label,
    value: label,
    title: label,
  });
  const handleMultiSelectSearchTags = (inputValue: string) => {
    let temp = { ...searchTags };
    const newOption = createOption(inputValue);
    temp.options = [...temp.options, newOption];
    setSearchTags(temp);
  };
  const handleInputChangeSearchTags = (inputValue: string) => {
    let temp = { ...searchTags };
    temp.inputValue = inputValue;
    setSearchTags(temp);
  };
  const handleKeyDownSearchTags = (event: any) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (event.target.value.trimStart().length > 0) {
          const newOption = createOption(event.target.value);
          let temp = { ...searchTags };
          temp.options = [...temp.options, newOption];
          temp.inputValue = '';
          setSearchTags(temp);
        }
        event.preventDefault();
    }
  };
  const handleMultiSelectChangeSearchTag = (inputValue: any) => {
    let temp = JSON.parse(JSON.stringify({ ...searchTags }));
    temp.options = inputValue;
    setSearchTags(temp);
  };
  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        dialogClassName="modal-dialog-centered min-w-lg-600px"
        className="border-r10px"
      >
        <Modal.Header className="border-bottom-0 pb-6 text-center mx-auto">
          <img
            className="close-inner-top-3 my-4 mx-2"
            width={40}
            height={40}
            src={CrossSvg}
            alt="closebutton"
            onClick={props.onHide}
          />
          <Modal.Title className="fs-26 fw-bolder mw-lg-375px mt-8">
            {`Edit ${props?.data?.title} search tags`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="align-items-center mx-4">
            <Col>
              <CreatableSelectWhite
                getOptionLabel={(option: any) => {
                  return <>{option.title}</>;
                }}
                inputValue={searchTags.inputValue}
                placeholder="Type here..."
                options={searchTags.options}
                isMulti={true}
                onCreateOption={(event: any) => {
                  handleMultiSelectSearchTags(event);
                }}
                border={'#e0e0df'}
                onChange={(newValue: any) => {
                  handleMultiSelectChangeSearchTag(newValue);
                }}
                onInputChange={(newValue: any) =>
                  handleInputChangeSearchTags(newValue)
                }
                value={searchTags.options}
                indicatorDisplay="none"
                display="none"
                menuIsOpen={false}
                onKeyDown={(event: any, newValue: any) =>
                  handleKeyDownSearchTags(event)
                }
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center pt-1 mb-4 border-top-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {!loading && (
              <span className="indicator-label fs-16 fw-bold">
                {faqString.save}
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
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EditSearchTags;
