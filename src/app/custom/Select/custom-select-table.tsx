/* eslint-disable jsx-a11y/anchor-is-valid */
import Select from 'react-select';
const customFilterOption = (option: any, rawInput: any) => {
  const label = option.data?.title || option.data?.name || option.data?.label;
  const input = rawInput.toLowerCase();
  const text = label.toLowerCase();
  return text.includes(input);
};
const CustomSelectTable2 = (props: any) => {
  return (
    <>
      <Select
        // isDisabled={props.isDisabled}
        // menuPosition={'fixed'}
        // menuIsOpen={true}
        className={props.className}
        value={props.value}
        placeholder={props.placeholder}
        defaultValue={props.default}
        filterOption={customFilterOption}
        isLoading={props.isLoading}
        onMenuScrollToBottom={props.onMenuScrollToBottom}
        menuPortalTarget={document.body}
        onChange={props.onChange}
        isClearable={props.isClearable}
        isDisabled={
          props.isDisabled
            ? props.isDisabled
            : props.options
            ? props.options.length === 0
            : true
        }
        options={props.options}
        styles={{
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            borderBottom: `0.5px solid #e0e0df`,
            ':last-child': {
              borderBottom: 'none',
            },
            margin: '0px',
            backgroundColor:
              (isSelected && '') || (isFocused && '#f1faff') || 'transparent',
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
            color: '#5e6278',
            fontSize: '1.077rem',
            fontWeight: '600',
          }),
          control: (base) => ({
            ...base,
            border: props.border
              ? '0.5px solid ' + props.border
              : '0.5px solid #e0e0df',
            boxShadow: 'none',
            minHeight: props.minHieight ? props.minHieight : '45px',
            height: 'auto',
            minWidth: props.minWidth ? props.minWidth : 'auto',
            width: 'auto',
            borderRadius: '5px',
            padding: '0px',
            fontSize: props.controlFontSize
              ? props.controlFontSize
              : '1.077rem',
            fontWeight: '600',
            backgroundColor: props.backgroundColor,
          }),
          menu: (base) => ({
            ...base,
            boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
            zIndex: '999',
          }),
          menuList: (base) => ({
            ...base,
            paddingTop: '0px',
            paddingBottom: '0px',
            borderRadius: '5px',
            width: 'auto',
          }),
          menuPortal: (base, props) => ({
            ...base,
            zIndex: 2,
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
            backgroundColor: props.multiValueBackground
              ? props.multiValueBackground
              : '#e0e0df',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px 5px 10px 10px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            height: '30px',
            width: 'auto',
          }),
          multiValueLabel: (base) => ({
            fontSize: '1.077rem',
            fontWeight: '600',
          }),
        }}
        isMulti={props.isMulti}
      />
    </>
  );
};
export { CustomSelectTable2 };
