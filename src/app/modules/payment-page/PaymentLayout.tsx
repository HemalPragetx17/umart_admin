import { Outlet } from 'react-router-dom';
import { useThemeMode } from '../../../umart_admin/partials'; 
const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];
const PaymentLayout = () => {
  const { mode } = useThemeMode();
  // useEffect(() => {
  //   BODY_CLASSES.forEach((c) => document.body.classList.add(c))
  //   document.body.style.backgroundImage =
  //     mode === 'dark'
  //       ? `url(${toAbsoluteUrl('/media/auth/bg9-dark.jpg')})`
  //       : `url(${toAbsoluteUrl('/media/auth/bg9-dark.jpg')})`
  //   return () => {
  //     BODY_CLASSES.forEach((c) => document.body.classList.remove(c))
  //     document.body.style.backgroundImage = 'none'
  //   }
  // }, [mode])
  return (
    <div className="d-flex flex-column flex-root vh-100 overflow-hidden">
      <div className="d-flex flex-column flex-center flex-column-fluid error-bg">
        <div className="d-flex flex-column flex-center text-center p-xl-15 p-lg-10 p-5">
          <div className="card card-flush min-w-200px min-h-200px min-w-lg-500px min-w-xl-700px">
            <div className="card-body py-xl-15 py-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { PaymentLayout };
