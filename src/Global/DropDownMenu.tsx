import React from 'react';
import { Link } from 'react-router-dom';
const DropDownMenu = ({ options, width }: any) => {
  const menuStyle = {
    width: width,
  };
  return (
    <>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600"
        data-kt-menu="true"
        style={menuStyle}
      >
        {options.map((option: any, index: any) => (
          <React.Fragment key={index}>
            <div className="menu-item p-2">
              <Link
                to={option.to ? option.to : ''}
                className={`menu-link fs-16 fw-600 ${option.color} px-3`}
                onClick={option.handle}
                state={option.state}
              >
                {option.text}
              </Link>
            </div>
            {index < options.length - 1 && (
              <div
                key={`separator-${index}`}
                className="separator opacity-75"
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
export default DropDownMenu;
