/* eslint-disable jsx-a11y/anchor-is-valid */

import CreatableSelect from "react-select/creatable";

const CreatableSelectWhite = (props: any) => {
  return (
    <>
      <CreatableSelect
        isClearable={props.isClearable}
        options={props.options}
        defaultValue={props.defaultValue}
        styles={{
          option: (base,{isSelected,isFocused}) => ({
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
            background: '#ffff',
            boxShadow: 'none',
            minHeight: '60px',
            height: 'auto',
            border: props.border
              ? '0.5px solid ' + props.border
              : '0.5px solid #e0e0df',
            ':hover': {
              ...base[':active'],
              border: props.border ? '0.5px solid ' + props.border : '0px',
            },
            borderRadius: '8px',
            padding: '6.5px 20.4px 6.5px 10px',
            fontSize: '16px',
            fontWeight: '600',
          }),
          multiValue: (base) => {
            return {
              ...base,
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '6px',
              backgroundColor: '#e7f1fd',
              padding: '8px 14px',
              color: '#1a1a1a',
            };
          },
          indicatorSeparator: (base) => ({
            ...base,
            background: '#f9f9f9',
          }),
          indicatorsContainer: (base) => ({
            ...base,
            color: '#f9f9f9',
            strokeWidth: '5px',
            display: props.display ? props.display : base.display,
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
        value={props.value}
        onCreateOption={props.onCreateOption}
        onChange={props.onChange}
        placeholder={props.placeholder}
        isMulti={props.isMulti}
        getOptionLabel={props.getOptionLabel}
        menuIsOpen={props.menuIsOpen}
        onKeyDown={props.onKeyDown}
        inputValue={props.inputValue}
        onInputChange={props.onInputChange}
        isLoading={props.loading}
      />
    </>
  );
};

export { CreatableSelectWhite };
