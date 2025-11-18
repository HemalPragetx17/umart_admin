/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import Select, { components } from 'react-select';
const customFilterOption = (option: any, rawInput: any) => {
  const label = option.data?.title || option.data.name;
  const input = rawInput.toLowerCase();
  const text = label.toLowerCase();
  return text.includes(input);
};
const CustomComponentSelect = (props: any) => {
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
        <div className="form-check form-check-custom form-check-solid form-check-md">
          <input
            className="form-check-input me-4"
            type="checkbox"
            value=""
            checked={isSelected}
          />
          {children}
          {/* <input type="checkbox" checked={isSelected} /> */}
        </div>
      </components.Option>
    );
  };
  return (
    <>
      <Select
        closeMenuOnSelect={props.closeMenuOnSelect}
        hideSelectedOptions={props.hideSelectedOptions}
        value={props.value}
        defaultValue={props.defaultValue}
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
            border: `0.5px solid #e0e0df`,
            background: '#ffff',
            boxShadow: 'none',
            minHeight: '60px',
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
        placeholder={props.placeholder}
        // menuIsOpen={true}
        isDisabled={props.isDisabled ? props.isDisabled : false}
        isLoading={props.isLoading}
        isMulti={props.isMulti}
        components={{
          Option: InputOption,
          MultiValueContainer: ({ selectProps, data }) => {
            const values = selectProps.value;
            if (values) {
              let name_ =
                values[values.length - 1].id === data.id ? (
                  values.length === 1 ? (
                    data.name.length > 11 ? (
                      <>
                        {data?.img ? (
                          <span className="symbol symbol-xl-40px symbol-35px border symbol-circle  me-2">
                            <img
                              src={data.img}
                              className="p-1"
                            />
                          </span>
                        ) : (
                          <></>
                        )}
                        <span className="fs-16 fw-600 text-black ">
                          {data.name.substring(0, 8) + '...'}
                        </span>
                      </>
                    ) : (
                      <>
                        {data?.img ? (
                          <span className="symbol symbol-xl-40px symbol-35px border symbol-circle  me-2">
                            <img
                              src={data.img}
                              className="p-1"
                            />
                          </span>
                        ) : (
                          <></>
                        )}
                        <span className="fs-16 fw-600 text-black ">
                          {data.name}
                        </span>
                      </>
                    )
                  ) : (
                    data.name
                  )
                ) : (
                  data.name + ', '
                );
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
                    {name_.length > 5
                      ? values[values.length - values.length].id === data.id
                        ? name_.substring(0, 8) + '...'
                        : ''
                      : name_}
                  </h6>
                </div>
              );
            } else return '';
          },
        }}
      />
    </>
  );
};
export { CustomComponentSelect };
