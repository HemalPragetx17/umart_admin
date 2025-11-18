import { IAddBanner } from '../../types';
export const bannerJson = {
  addBanner: (bannerData: IAddBanner) => {
    const formData = new FormData();
    formData.append('title', bannerData.title);
    formData.append('days', bannerData.days);
    if (bannerData.imageReader) {
      formData.append('image', bannerData.imageReader);
    }
    formData.append('placement', bannerData.placement);
    formData.append('type', bannerData.type);
    formData.append('startDate', bannerData.startDate);
    formData.append('endDate', bannerData.endDate);
    formData.append('productType', bannerData.productType);
    bannerData.variants.forEach((item: any, index: number) => {
      formData.append(`variants[${index}][reference]`, item);
    });
    bannerData.categories.forEach((item: any, index: number) => {
      formData.append(`categories[${index}][reference]`, item);
    });
    bannerData.brands.forEach((item: any, index: number) => {
      formData.append(`brands[${index}][reference]`, item);
    });
    return formData;
  },
  updateBanner: (bannerData: IAddBanner) => {
    const tempData: any = {
      title: bannerData.title,
      days: bannerData.days,
      placement: bannerData.placement,
      type: bannerData.type,
      productType: bannerData.productType,
      startDate: bannerData.startDate,
      endDate: bannerData.endDate,
    };
    if (bannerData.imageReader) {
      tempData.image = bannerData.imageReader;
    }
    bannerData.variants.forEach((variant: any, index: number) => {
      tempData[`variants[${index}][reference]`] = variant;
    });
    bannerData.categories.forEach((variant: any, index: number) => {
      tempData[`categories[${index}][reference]`] = variant;
    });
    bannerData.brands.forEach((variant: any, index: number) => {
      tempData[`brands[${index}][reference]`] = variant;
    });
    return tempData;
  },
};
