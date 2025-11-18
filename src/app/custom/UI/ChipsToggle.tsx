type PropsTypes = {
  title: string;
  onClick: () => void;
  active: boolean;
};
const ChipsToggle = ({ title, onClick, active }: PropsTypes) => {
  return (
    <button
      onClick={onClick}
      className={` fw-400 fs-16 border border-1 rounded-pill mx-4  py-2 px-5 ${
        active
          ? 'text-primary border-primary printBtn'
          : 'text-gray-600 border-gray-600 bg-white'
      }`}
    >
      {title}
    </button>
  );
};
export default ChipsToggle;
