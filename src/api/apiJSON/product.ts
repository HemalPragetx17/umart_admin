import { IAddProduct, IUpdateProductState } from '../../types';
import { Units } from '../../utils/constants';
export const productJSON = {
  addProduct: ({ product }: IAddProduct) => {
    let form = new FormData();
    form.append('isDraft', product.isDraft);
    form.append('category', product.primaryCategory);
    form.append('subCategory', product.subCategory);
    form.append('title', product.productTitle);
    form.append('taxFree', product.taxFree);
    if (product.groupCategory)
      form.append('groupCategory', product.groupCategory);
    if (!product.taxFree) form.append('productTax', product.productTax);
    if (product.brand) form.append('brand', product.brand);
    if (product.country) form.append('country', product.country);
    if (product.description) form.append('description', product.description);
    if (product.tax) form.append('productTax', product.tax);
    if (product.isReturnable) {
      form.append('isReturnable', product.isReturnable);
    } else {
      form.append('isReturnable', product.isReturnable);
    }
    if (product.isReturnable && product.returnHours)
      form.append('returnHours', product.returnHours);
    if (product.selectedVariant && product.selectedVariant.length) {
      product.selectedVariant.map((variantVal: any, variantIndex: number) => {
        form.append(
          'definedVariantsTypes[' + variantIndex + '][reference]',
          variantVal._id
        );
        variantVal.options.map((optionVal: any, optionIndex: number) => {
          form.append(
            'definedVariantsTypes[' +
              variantIndex +
              '][options][' +
              optionIndex +
              ']',
            optionVal.title
          );
        });
      });
    }
    if (product.combinations.length) {
      product.combinations.map((combVal: any, index: number) => {
        let i = 0;
        if (
          combVal.selectedCombinations &&
          combVal.selectedCombinations.length
        ) {
          combVal.selectedCombinations.map(
            (selectVal: any, selectIndex: number) => {
              form.append(
                'variants[' +
                  index +
                  '][variantType][' +
                  selectIndex +
                  '][reference]',
                selectVal.id
              );
              form.append(
                'variants[' +
                  index +
                  '][variantType][' +
                  selectIndex +
                  '][option]',
                selectVal.title[selectIndex]
              );
            }
          );
        }
        if (combVal.images && combVal.images.length > 0) {
          combVal.images.map((imageVal: any, imageIndex: number) => {
            if (imageVal.obj) {
              let arr: any = imageVal.obj.split(',');
              let mime = arr[0].match(/:(.*?);/)[1];
              let bstr = atob(arr[1]);
              let n = bstr.length;
              let u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              let tempImage = new File([u8arr], product.productTitle + '.png', {
                type: 'image/png',
              });
              form.append(
                'variants[' + index + '][media][' + imageIndex + '][file]',
                tempImage
              );
            }
            if (imageVal._id) {
              form.append(
                'variants[' + index + '][media][' + imageIndex + '][reference]',
                imageVal._id
              );
            }
            form.append(
              'variants[' + index + '][media][' + imageIndex + '][index]',
              imageIndex.toString()
            );
          });
        }
        if (combVal.price) {
          form.append(
            'variants[' + index + '][quantityTypes][0][type]',
            Units.toString()
          );
          form.append(
            'variants[' + index + '][quantityTypes][0][amount]',
            combVal.price
          );
        }
        if (combVal.skuNumber) {
          form.append('variants[' + index + '][skuNumber]', combVal.skuNumber);
        }
        if (
          combVal.discountByQuantitiesEnabled ||
          combVal.discountByQuantitiesEnabled === false
        ) {
          form.append(
            'variants[' +
              index +
              '][quantityTypes][0][discountByQuantitiesEnabled]',
            combVal.discountByQuantitiesEnabled
          );
        }
        if (combVal.discountByQuantitiesEnabled) {
          combVal.discountAmount.map((item: any, itemIndex: number) => {
            form.append(
              'variants[' +
                index +
                '][quantityTypes][0][discountsByQuantities][' +
                itemIndex +
                '][discountAmt]',
              item.amount
            );
          });
          combVal.discountQuantity.map((item: any, itemIndex: number) => {
            form.append(
              'variants[' +
                index +
                '][quantityTypes][0][discountsByQuantities][' +
                itemIndex +
                '][quantity]',
              item.quantity
            );
          });
        }
      });
    }
    if (product?.searchTag?.options?.length) {
      product?.searchTag?.options.forEach((item: any, index: number) => {
        form.append(`searchTag[${index}]`, item?.title );
      });
    }
    return form;
  },
  updateProductState: ({ activate }: IUpdateProductState) => {
    return { activate: activate };
  },
  editProductVariant: ({ product }: IAddProduct) => {
    let form = new FormData();
    if (product.combinations.length) {
      product.combinations.map((combVal: any, index: number) => {
        let i = 0;
        if (combVal.images && combVal.images.length > 0) {
          combVal.images.map((imageVal: any, imageIndex: number) => {
            if (imageVal.obj) {
              let arr: any = imageVal.obj.split(',');
              let mime = arr[0].match(/:(.*?);/)[1];
              let bstr = atob(arr[1]);
              let n = bstr.length;
              let u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              let tempImage = new File([u8arr], product.productTitle + '.png', {
                type: 'image/png',
              });
              form.append('media[' + imageIndex + '][file]', tempImage);
            }
            if (imageVal._id) {
              form.append('media[' + imageIndex + '][reference]', imageVal._id);
            }
            form.append(
              'media[' + imageIndex + '][index]',
              imageIndex.toString()
            );
          });
          form.append('quantityTypes[' + index + '][type]', Units.toString());
          form.append('quantityTypes[' + index + '][amount]', combVal.price);
          if (
            combVal.discountByQuantitiesEnabled ||
            combVal.discountByQuantitiesEnabled === false
          ) {
            form.append(
              'quantityTypes[' + index + '][discountByQuantitiesEnabled]',
              combVal.discountByQuantitiesEnabled
            );
          }
          if (combVal.discountByQuantitiesEnabled) {
            combVal.discountAmount.map((item: any, itemIndex: number) => {
              form.append(
                'quantityTypes[' +
                  index +
                  '][discountsByQuantities][' +
                  itemIndex +
                  '][discountAmt]',
                item.amount
              );
            });
            combVal.discountQuantity.map((item: any, itemIndex: number) => {
              form.append(
                'quantityTypes[' +
                  index +
                  '][discountsByQuantities][' +
                  itemIndex +
                  '][quantity]',
                item.quantity
              );
            });
          }
        }
      });
    }
    return form;
  },
};
