/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import CreatableSelect from "react-select/creatable";

const CreatableSelectTable = (props: any) => {
  // useEffect(() => {}, [props]);
  return (
    <>
      <CreatableSelect
        // isDisabled={props.isDisabled}
        // menuPosition={'fixed'}
        // menuIsOpen={true}
        isClearable={props.isClearable}
        options={props.options}
        placeholder={props.placeholder}
        defaultValue={props.default}
        onMenuScrollToBottom={props.onMenuScrollToBottom}
        menuPortalTarget={document.body}
        isDisabled={props.isDisabled ? props.isDisabled : false}
        onChange={props.onChange}
        value={props.value}
        onCreateOption={props.onCreateOption}
        isMulti={props.isMulti}
        getOptionLabel={props.getOptionLabel}
        menuIsOpen={props.menuIsOpen}
        onKeyDown={props.onKeyDown}
        inputValue={props.inputValue}
        onInputChange={props.onInputChange}
        styles={{
          option: (base) => ({
            ...base,
            borderBottom: `1px solid #e0e0df`,
            ":last-child": {
              borderBottom: "none",
            },
            margin: "0px",
            background: "#fff",
            padding: "16px",
            ":active": {
              ...base[":active"],
              color: "#1b74e4",
              background: "#f1faff",
            },
            ":hover": {
              ...base[":active"],
              color: "#1b74e4",
              background: "#f1faff",
            },
            color: "#5e6278",
            fontSize: "1.077rem",
            fontWeight: "600",
          }),
          control: (base) => ({
            ...base,
            border: props.border
              ? "0.5px solid " + props.border
              : "0.5px solid #e0e0df",
            boxShadow: "none",
            minHeight: "45px",
            height: "auto",
            width: "auto",
            borderRadius: "5px",
            padding: "0px",
            fontSize: "1.077rem",
            fontWeight: "600",
            backgroundColor: props.backgroundColor,
            ":hover": {
              ...base[":active"],
              border: props.border
                ? "0.5px solid " + props.border
                : "0.5px solid #e0e0df",
            },
          }),
          menu: (base) => ({
            ...base,
            boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.1)",
          }),
          menuList: (base) => ({
            ...base,
            paddingTop: "0px",
            paddingBottom: "0px",
            borderRadius: "5px",
            width: "auto",
          }),
          menuPortal: (base, props) => ({
            ...base,
            zIndex: 2,
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: "none",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            color: "#f9f9f9",
            strokeWidth: "5px",
            display: props.display ? props.display : base.display,
          }),
          multiValueRemove: (base, { data }) => ({
            ...base,
            height: "12px",
            ":hover": {
              backgroundColor: "#e7f1fd",
            },
            svg: {
              height: "18px",
              width: "18px",
              fill: "#7c7c7c",
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#e7f1fd",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 5px 10px 10px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            height: "30px",
            width: "auto",
          }),
          multiValueLabel: (base) => ({
            fontSize: "1.077rem",
            fontWeight: "600",
          }),
        }}
      />
    </>
  );
};

export { CreatableSelectTable };
