/* eslint-disable jsx-a11y/anchor-is-valid */
import Select from 'react-select';
const customFilterOption = (option: any, rawInput: any) => {
  const label = option.data?.title || option.data.name;
  const input = rawInput.toLowerCase();
  const text = label.toLowerCase();
  return text.includes(input);
};
const CustomSelectWhite = (props: any) => {
  return (
    <>
      <Select
        className={props.className}
        closeMenuOnSelect={props.closeMenuOnSelect}
        hideSelectedOptions={props.hideSelectedOptions}
        defaultValue={props.defaultValue}
        options={props.options}
        isSearchable={props.isSearchable}
        getOptionLabel={props.getOptionLabel}
        isClearable={props.isClearable}
        isLoading={props.loading}
        //  menuPortalTarget={document.body}
        menuPosition={'fixed'}
        filterOption={customFilterOption}
        styles={{
          placeholder: (base) => ({
            ...base,
            fontSize: '1.15rem',
            fontWeight: '500',
            color: '#9f9e9e',
          }),
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            border: `0.5px solid #f9f9f9`,
            margin: '0px',
            backgroundColor:
              (isSelected && '') || (isFocused && '#f1faff') || 'transparent',
            padding: '1rem 1.25rem',
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
            fontSize: '16px',
            fontWeight: '600',
          }),
          control: (base) => ({
            ...base,
            // border: `0.5px solid #e0e0df`,
            border: props.border
              ? '0.5px solid ' + props.border
              : '0.5px solid #e0e0df',
            background: '#ffff',
            boxShadow: 'none',
            minHeight: props.minHeight ? props.minHeight : '60px',
            borderRadius: '8px',
            padding: '6.5px 20.4px 6.5px 10px',
            fontSize: '16px',
            fontWeight: '600',
            ':hover': {
              ...base[':active'],
              border: props.border
                ? '0.5px solid ' + props.border
                : '0.5px solid #e0e0df',
            },
          }),
          multiValue: (base) => {
            return {
              ...base,
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '6px',
              backgroundColor: '#e7f1fd',
              padding: '8px 8px 8px 10px',
              color: '#1a1a1a',
            };
          },
          menu: (base) => ({
            ...base,
          }),
          indicatorSeparator: (base) => ({
            ...base,
            background: '#f9f9f9',
          }),
          indicatorsContainer: (base) => ({
            ...base,
            color: '#f9f9f9',
            strokeWidth: '5px',
          }),
          multiValueRemove: (base, { data }) => ({
            ...base,
            fontSize: '16px',
            fontWeight: '600',
            svg: {
              width: '20px',
              height: '20px',
              color: '#7c7c7c',
            },
            ':hover': {
              backgroundColor: '#e7f1fd',
            },
          }),
        }}
        isDisabled={props.isDisabled ? props.isDisabled : false}
        onChange={props.onChange}
        // menuIsOpen={true}
        onMenuScrollToBottom={props.onMenuScrollToBottom}
        isMulti={props.isMulti}
        value={props.value}
        onKeyDown={props.handleKeyDown}
        placeholder={props.placeholder}
      />
    </>
  );
};
export { CustomSelectWhite };
