/* eslint-disable jsx-a11y/anchor-is-valid */
import { Route, Routes } from 'react-router-dom'
import { Error500 } from './components/Error500'
import { Maintanance } from './components/Maintanance'
import { Error404 } from './components/Error404'
import { ErrorsLayout } from './ErrorsLayout'

const ErrorsPage = () => (
  <Routes>
    <Route element={<ErrorsLayout />}>
      <Route path="404" element={<Error404 />} />
      <Route path="network" element={<Error500 />} />
      <Route path="maintanance" element={<Maintanance />} />
      <Route index element={<Error404 />} />
    </Route>
  </Routes>
)

export { ErrorsPage }
