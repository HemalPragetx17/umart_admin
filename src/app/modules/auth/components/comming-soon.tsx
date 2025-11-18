import { useNavigate } from 'react-router-dom';
import ComingsoonImage from '../../../../umart_admin/assets/media/comingsoon.png';
export function ComingSoon() {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex flex-column flex-root bg-white"
      style={{ height: '100vh' }}
    >
      <img
        className="img-fluid"
        src={ComingsoonImage}
      />
    </div>
  );
}
