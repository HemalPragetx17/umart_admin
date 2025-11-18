import './dateRange.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
const CustomDatePicker = (props: any) => {
  return (
    <>
      <DatePicker
        className={props.className + ' form-control border border-r8px '}
        placeholderText={props.placeholder}
        selected={props.selected}
        onChange={props.onChange}
        startDate={props.startDate}
        endDate={props.endDate}
        dateFormat={props.dateFormat}
        selectsRange={props.selectsRange}
        showFullMonthYearPicker={props.showFullMonthYearPicker}
        maxDate={props.maxDate}
        isClearable={props.isClearable}
        minDate={props.minDate}
        disabled={props.disabled}
        // showYearDropdown={props.showYearDropdown}
        showYearDropdown={true}
        scrollableYearDropdown={true}
        dropdownMode="select"
        dayClassName={props.dayClassName}
        showIcon={props.showIcon}
        customInput={props.customInput}
      />
    </>
  );
};
export default CustomDatePicker;
