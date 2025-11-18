export const recipeApiJson = {
  addRecipe: (recipeData: any) => {
    const formData = new FormData();
    formData.append('category', recipeData.category.id);
    formData.append('subCategory', recipeData.subCategory);
    formData.append('title', recipeData.title);
    formData.append('description', recipeData.description);
    formData.append('serving', recipeData.serving);
    formData.append('cookTime', recipeData.cookTime);
    formData.append('foodType', recipeData.foodType);
    formData.append('recipeSteps', recipeData.recipeSteps);
    recipeData.recipeType.forEach((item: any, index: number) => {
      formData.append(`recipeType[${index}][option]`, item.value);
    });
    recipeData.media.forEach((item: any, index: number) => {
      formData.append(`media[${index}][index]`, index.toString());
      if (item?.reference) {
        formData.append(`media[${index}][reference]`, item.reference);
      }
      if (item?.imageReader) {
        formData.append(`media[${index}][file]`, item.imageReader);
      }
    });
    recipeData.ingredients.forEach((item: any, index: number) => {
      formData.append(`ingredients[${index}][title]`, item.title);
      formData.append(`ingredients[${index}][category]`, item.category);
      formData.append(`ingredients[${index}][subCategory]`, item.subCategory);
      item.variants.forEach((val: any, valIndex: number) => {
        formData.append(
          `ingredients[${index}][variants][${valIndex}][reference]`,
          val.value
        );
      });
    });
    return formData;
  },
};
