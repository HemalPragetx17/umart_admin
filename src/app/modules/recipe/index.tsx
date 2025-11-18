import { Outlet, Route, Routes } from 'react-router-dom';
import AllRecipes from './all-recipes';
import AddRecipe from './add-recipe';
import EditRecipe from './edit-recipe/edit-recipe';
import RecipeDetails from './recipe-details/recipe-details';
const Recipe = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={<AllRecipes />}
        />
        <Route
          path="/"
          element={<AllRecipes />}
        />
        <Route
          path="add-recipe"
          element={<AddRecipe />}
        />
        <Route
          path="edit-recipe"
          element={<EditRecipe />}
        />
        <Route
          path="recipe-details"
          element={<RecipeDetails />}
        />
      </Route>
    </Routes>
  );
};
export default Recipe;
