/* eslint-disable jsx-a11y/anchor-is-valid */
import Select, { components } from 'react-select';
import { IMAGES } from '../../../utils/staticJSON';
const CaretDownIcon = () => {
  return (
    <img
      className="img-fluid pe-1"
      src={IMAGES.downArrow}
      alt=""
    />
  );
};
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownIcon />
    </components.DropdownIndicator>
  );
};
const CustomSelect = (props: any) => {
  return (
    <>
      <Select
        // menuIsOpen={true}
        className={props.className}
        isOptionDisabled={props.isOptionDisabled}
        components={{ DropdownIndicator }}
        hideSelectedOptions={props.hideSelectedOptions}
        value={props.value}
        menuPosition={'fixed'}
        isClearable={props.isClearable}
        menuPortalTarget={document.body}
        placeholder={props.placeholder}
        defaultValue={props.default}
        isLoading={props.isLoading}
        onChange={props.onChange}
        onMenuScrollToBottom={props.onMenuScrollToBottom}
        isDisabled={
          props?.disabled
          // props.options ? props.options.length === 0 : true || props.disabled
        }
        options={props.options}
        isSearchable={props.isSearchable}
        styles={{
          placeholder: (base) => ({
            ...base,
            fontWeight: '500',
            color: '#9f9e9e',
          }),
          option: (base) => ({
            ...base,
            borderBottom: `1px solid #e0e0df`,
            ':last-child': {
              borderBottom: 'none',
            },
            margin: '0px',
            background: 'white',
            padding: '16px',
            ':active': {
              ...base[':active'],
              color: '#1b74e4',
              background: '#f1faff',
            },
            ':hover': {
              ...base[':active'],
              color: '#1b74e4',
              background: '#f1faff',
            },
            color: '#1a1a1a',
            fontSize: '1.154rem',
            fontWeight: '500',
          }),
          control: (base) => ({
            ...base,
            border: props.border
              ? '0.5px solid ' + props.border
              : '0.5px solid #e0e0df',
            boxShadow: 'none',
            minHeight: props.minHeight ? props.minHeight : '60px',
            height: 'auto',
            minWidth: props.minWidth ? props.minWidth : '220px',
            width: 'auto',
            borderRadius: props.radiusTable ? props.radiusTable : '8px',
            padding: '0px',
            fontSize: '1.231rem',
            fontWeight: '600',
            backgroundColor: props.backgroundColor,
            ':hover': {
              ...base[':hover'],
              border: props.border
                ? '0.5px solid ' + props.border
                : '0.5px solid #e0e0df',
            },
          }),
          menu: (base) => ({
            ...base,
            boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
            color: '#1a1a1a',
          }),
          menuList: (base) => ({
            ...base,
            paddingTop: '0px',
            paddingBottom: '0px',
            borderRadius: '5px',
            width: 'auto',
            color: '#1a1a1a',
          }),
          menuPortal: (base, props) => ({
            ...base,
            zIndex: 9999,
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: 'none',
          }),
          indicatorsContainer: (base) => ({
            ...base,
            color: '#f9f9f9',
            strokeWidth: '5px',
          }),
          multiValueRemove: (base, { data }) => ({
            ...base,
            height: '12px',
            ':hover': {
              backgroundColor: '#e7f1fd',
            },
            svg: {
              height: '22px',
              width: '22px',
              fill: '#7c7c7c',
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#e7f1fd',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '11px 14px',
            borderRadius: '6px',
            fontSize: '1.231rem',
            fontWeight: '600',
            height: '42px',
            width: 'auto',
          }),
          multiValueLabel: (base) => ({
            fontSize: '1.231rem',
            fontWeight: '600',
          }),
        }}
        isMulti={props.isMulti}
      />
    </>
  );
};
export { CustomSelect };
