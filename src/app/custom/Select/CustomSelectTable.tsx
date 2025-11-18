/* eslint-disable jsx-a11y/anchor-is-valid */
import Select from 'react-select';
const CustomSelectTable = (props: any) => {
  return (
    <>
      <Select
        // isDisabled={props.isDisabled}
        // menuPosition={'fixed'}
        menuIsOpen={props.menuIsOpen}
        hideSelectedOptions={false}
        controlShouldRenderValue={false}
        onMenuClose={props.onMenuClose}
        onMenuOpen={props.onMenuOpen}
        openMenuOnClick={props.openMenuOnClick}
        placeholder={props.placeholder}
        defaultValue={props.default}
        isLoading={props.isLoading}
        onMenuScrollToBottom={props.onMenuScrollToBottom}
        menuPortalTarget={document.body}
        onChange={props.onChange}
        isDisabled={props.options ? props.options.length === 0 : true}
        options={props.options}
        isOptionDisabled={props.isOptionDisabled}
        menuPlacement={'bottom'}
        styles={{
          option: (base: any) => ({
            ...base,
            borderBottom: `2px solid #e0e0df`,
            ':last-child': {
              borderBottom: 'none',
            },
            margin: '0px',
            background: '#fff',
            padding: '0px',
            boxShadow: '0 0 0 1px white',
            ':active': {
              ...base[':active'],
              backgroundColor: 'white',
            },
            ':hover': {
              ...base[':active'],
              backgroundColor: 'white',
            },
            color: '#5e6278',
            fontSize: '1.077rem',
            fontWeight: '600',
          }),
          control: (base: any) => ({
            ...base,
            border: 'none',
            borderColor: 'transparent',
            boxShadow: '1px solid #555555',
            borderRadius: '6px',
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : '#f9f9f9',
            cursor: 'pointer',
            '&:active': {
              border: 'none',
              // display: 'none',
              borderColor: 'transparent',
              backgroundColor: props.backgroundColor
                ? props.backgroundColor
                : '#f9f9f9',
              boxShadow: 'none',
            },
            '&:hover': {
              border: 'none',
              // display: 'none',
              backgroundColor: props.backgroundColor
                ? props.backgroundColor
                : '#f9f9f9',
              boxShadow: 'none',
            },
          }),
          menu: (base: any) => ({
            ...base,
            boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
            zIndex: '999',
            marginLeft: props.menuMargin ? props.menuMargin : base.marginLeft,
          }),
          menuList: (base: any) => ({
            ...base,
            paddingTop: '0px',
            paddingBottom: '0px',
            borderRadius: '8px',
            width: props.width ? props.width : '160px',
            marginLeft: props.marginLeft,
          }),
          menuPortal: (base: any, props: any) => ({
            ...base,
            zIndex: 9999,
          }),
          indicatorSeparator: (base: any) => ({
            ...base,
            display: 'none',
          }),
          indicatorsContainer: (base: any) => ({
            ...base,
            display: 'none',
          }),
          multiValueRemove: (base: any, { data }: any) => ({
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
          multiValue: (base: any) => ({
            ...base,
            backgroundColor: '#e0e0df',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px 5px 10px 10px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            height: '30px',
            width: 'auto',
          }),
          multiValueLabel: (base: any) => ({
            fontSize: '1.077rem',
            fontWeight: '600',
          }),
        }}
        isSearchable={false}
        isMulti={props.isMulti}
      />
    </>
  );
};
export { CustomSelectTable };
