/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import Select, { components } from 'react-select';
const CustomComponentAfterSelect = (props: any) => {
  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    ...rest
  }: any) => {
    const [isActive, setIsActive] = useState(false);
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);
    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
    };
    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        <div className="d-flex justify-content-between">
          <div className="">{children}</div>
          <div className="form-check form-check-custom form-check-solid form-check-lg">
            <input
              className="form-check-input me-4"
              type="checkbox"
              value=""
              checked={isSelected}
            />
          </div>
        </div>
      </components.Option>
    );
  };
  const customFilterOption = (option: any, rawInput: any) => {
    const label = option.data.title;
    const input = rawInput.toLowerCase();
    const text = label.toLowerCase();
    return text.includes(input);
  };
  return (
    <>
      <Select
        closeMenuOnSelect={props.closeMenuOnSelect}
        hideSelectedOptions={props.hideSelectedOptions}
        defaultValue={props.defaultValue}
        value={props.value}
        options={props.options}
        isSearchable={props.isSearchable}
        getOptionLabel={props.getOptionLabel}
        filterOption={customFilterOption}
        styles={{
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
            border: props.border
              ? '0.5px solid ' + props.border
              : '0.5px solid #e0e0df',
            background: '#ffff',
            boxShadow: 'none',
            minHeight: '60px',
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
            // width: '300px',
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
        onChange={props.onChange}
        // menuIsOpen={true}
        isDisabled={props.isDisabled ? props.isDisabled : false}
        isMulti={props.isMulti}
        components={{
          Option: InputOption,
          MultiValueContainer: ({ selectProps, data }) => {
            const values = selectProps.value;
            if (values) {
              let name_ =
                values[values.length - 1].id === data.id
                  ? values.length === 1
                    ? data.label
                    : data.name
                  : data.name + ', ';
              if (values.length > 2 && name_.length > 20) {
                // Trim the name and add '...' at the end
                name_ = name_.substring(0, 20) + '...';
              }
              return values[values.length - 1].id === data.id ? (
                values.length === 1 ? (
                  name_
                ) : (
                  ''
                )
              ) : (
                <div className="d-flex align-items-center">
                  {values[values.length - values.length].id === data.id ? (
                    <div className="symbol symbol-40px symbol-circle me-3">
                      <div className="symbol-label fs-20 fw-600 bg-light-primary text-primary">
                        {values.length}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <h6 className="fs-16 fw-600 text-black mb-0">
                    {' '}
                    {name_.length > 5
                      ? values[values.length - values.length].id === data.id
                        ? name_.substring(0, 20) + '...'
                        : ''
                      : name_}
                  </h6>
                </div>
              );
            }
          },
        }}
        isLoading={props.loading ? props.loading : false}
        placeholder={props.placeholder}
        inputValue={props?.inputValue}
        onInputChange={props.onInputChange}
      />
    </>
  );
};
export { CustomComponentAfterSelect };
