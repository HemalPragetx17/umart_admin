import { createRoot } from 'react-dom/client';
// Axios
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools'
// Apps
import { CustomerServiceI18nProvider } from './umart_admin/i18n/CustomerServicei18n';
/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './umart_admin/assets/css/style.rtl.css'
 **/
import './umart_admin/assets/sass/style.scss';
import './umart_admin/assets/sass/plugins.scss';
import './umart_admin/assets/sass/style.react.scss';
import { AppRoutes } from './app/routing/AppRoutes';
import { AuthProvider } from './app/modules/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './app/modules/socket/core/Socket';
// setupAxios(axios)
Chart.register(...registerables);
const queryClient = new QueryClient();
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <CustomerServiceI18nProvider>
        <SocketProvider>
          <AuthProvider>
            <ToastContainer />
            <AppRoutes />
          </AuthProvider>
        </SocketProvider>
      </CustomerServiceI18nProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
