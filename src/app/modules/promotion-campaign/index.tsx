import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AddDiscountPromotion from './discount-promotion/add-discount-promotion/add-discount-promotion';
import AllPromotions from './all-promotions';
import EditDiscountPromotion from './discount-promotion/edit-discount-promotion/edit-discount-promotion';
import DiscountPromotionDetails from './discount-promotion/discount-promotion-details';
import AddReward from './rewards/add-reward/add-reward';
import EditReward from './rewards/edit-reward/edit-reward';
import RewardsDetails from './rewards/reward-details/reward-details';
import AddCouponPromotion from './coupon-promotion/add-coupon-promotion/add-coupon-promotion';
import EditCouponPromotion from './coupon-promotion/edit-coupon-promotion/edit-coupon-promotion';
import CouponPromotionDetails from './coupon-promotion/coupon-promotion-details/coupon-promotion-details';
const PromotionAndCampaign = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={<AllPromotions />}
        />
        <Route
          path="add-discount-promotion"
          element={<AddDiscountPromotion />}
        />
        <Route
          path="all-promotions"
          element={<AllPromotions />}
        />
        <Route
          path="edit-discount-promotions"
          element={<EditDiscountPromotion />}
        />
        <Route
          path="discount-promotions-details"
          element={<DiscountPromotionDetails />}
        />
        <Route
          path="add-reward"
          element={<AddReward />}
        />
        <Route
          path="edit-reward"
          element={<EditReward />}
        />
        <Route
          path="reward-details"
          element={<RewardsDetails />}
        />
        <Route
          path="add-coupon-promotion"
          element={<AddCouponPromotion />}
        />
        <Route
          path="edit-coupon-promotion"
          element={<EditCouponPromotion />}
        />
        <Route
          path="coupon-promotions-details"
          element={<CouponPromotionDetails />}
        />
      </Route>
    </Routes>
  );
};
export default PromotionAndCampaign;
