import CalendarIcon from '../../../umart_admin/assets/media/calendar-icon.png';
const CustomDateInput = ({ value, onClick, placeholder, inputClass }: any) => {
  return (
    <button
      className={`form-control bg-white min-h-60px bg-danger d-flex justify-content-between align-items-center ms-1 min-w-lg-200px  ${
        value ? 'text-black fw-bold' : ''
      } ${inputClass ? inputClass : ''}`}
      onClick={onClick}
    >
      {value || placeholder}
      <img
        className="ms-4"
        src={CalendarIcon}
        height={18}
        width={18}
      />
    </button>
  );
};
export default CustomDateInput;
