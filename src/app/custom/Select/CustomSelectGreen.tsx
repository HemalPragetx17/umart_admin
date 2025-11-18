/* eslint-disable jsx-a11y/anchor-is-valid */
import Select from 'react-select';

const CustomSelectGreen = (props: any) => {
  return (
    <>
      <Select
        // defaultInputValue={props.default}
        // menuIsOpen={true}
        placeholder={props.placeholder}
        onChange={props.onChange}
        hideSelectedOptions={false}
        controlShouldRenderValue={false}
        defaultValue={props.default}
        options={props.options}
        menuPosition={'fixed'}
        menuPortalTarget={document.body}
        styles={{
          option: (base: any) => ({
            ...base,
            borderBottom: `1px solid #e0e0df`,
            ':last-child': {
              borderBottom: 'none',
            },
            margin: '0px',
            backgroundColor: 'white',
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
            color: 'black',
            fontSize: '1.154rem',
            fontWeight: '500',
          }),
          control: (base: any) => ({
            ...base,
            border: '0px',
            boxShadow: 'none',
            minHeight: props.minHeight ? props.minHeight : '46px',
            width: 'max-content',
            borderRadius: '8px',
            padding: '0px',
            fontSize: '1.231rem',
            fontWeight: '600',
            backgroundColor: '#009e60',
            color: 'white',
          }),
          menu: (base: any) => ({
            ...base,
            boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
            width: 'max-content',
          }),
          menuList: (base: any) => ({
            ...base,
            paddingTop: '0px',
            paddingBottom: '0px',
            borderRadius: '5px',
          }),
          menuPortal: (base: any, props: any) => ({
            ...base,
            zIndex: 2,
          }),
          indicatorSeparator: (base: any) => ({
            ...base,
            display: 'none',
          }),
          indicatorsContainer: (base: any) => ({
            ...base,
            color: 'white !important',
            ':active': {
              ...base[':active'],
              color: 'white !important',
            },
            ':hover': {
              ...base[':active'],
              color: 'white !important',
            },
            strokeWidth: '5px',
          }),
          multiValueRemove: (base: any, { data }: any) => ({
            ...base,
            ':hover': {
              backgroundColor: '#1b74e4',
            },
          }),
          singleValue: (base: any) => ({
            ...base,
            color: 'white',
          }),
        }}
        isMulti={props.isMulti}
        isSearchable={props.isSearchable}
      />
    </>
  );
};

export { CustomSelectGreen };
