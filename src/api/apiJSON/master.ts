import {
  IAddGroupCategory,
  IAddPrimaryCategory,
  IAddSubCategory,
  IListCategories,
} from '../../types/index';
import { IAddBrands, IEditBrands, IListBrands } from '../../types';
import { IAddVariants, IVariantInfo } from '../../types';
import { IRolesAndPermissions, IUserManage } from '../../types';
import {
  Add,
  Edit,
  GoodsInWarehouseConst,
  GoodsRequestConst,
} from '../../utils/constants';
export const categoryJSON = {
  listCategory: ({
    pageNo,
    limit,
    sortKey,
    sortOrder,
    categoriesDepth,
  }: IListCategories) => {
    return {
      pageNo: pageNo,
      limit: limit,
      sortKey: sortKey,
      sortOrder: sortOrder,
      needCount: true,
      categoriesDepth: categoriesDepth,
    };
  },
  addPrimaryCategory: ({ primaryCategory }: IAddPrimaryCategory) => {
    let form = new FormData();
    primaryCategory.map((val: any, index: any) => {
      form.append('list[' + [index] + '][title]', val.categoryName);
      form.append('list[' + [index] + '][image]', val.categoryImageReader);
      form.append('list[' + [index] + '][isTobacco]', val.isTobacco);
    });
    return form;
  },
  editPrimaryCategory: (
    { primaryCategory }: IAddPrimaryCategory,
    isRecipe: any
  ) => {
    let form = new FormData();
    form.append('title', primaryCategory.categoryName);
    if (primaryCategory.categoryImageReader) {
      form.append('image', primaryCategory.categoryImageReader);
    }
    form.append('isTobacco', primaryCategory.isTobacco);
    form.append('isRecipe', isRecipe);
    return form;
  },
  addSubCategory: ({ subCategory }: IAddSubCategory) => {
    let form = new FormData();
    subCategory.map((val: any, index: any) => {
      form.append('list[' + [index] + '][title]', val.subCategoryName);
      form.append('list[' + [index] + '][image]', val.subCategoryImageReader);
      form.append('list[' + [index] + '][category]', val.primaryCategory);
    });
    return form;
  },
  editSubCategory: ({ subCategory }: IAddSubCategory) => {
    let form = new FormData();
    form.append('title', subCategory.subCategoryName);
    form.append('image', subCategory.subCategoryImageReader);
    form.append('category', subCategory.primaryCategory);
    return form;
  },
  addGroupCategory: ({ groupCategory }: IAddGroupCategory) => {
    let form = new FormData();
    groupCategory.map((val: any, index: any) => {
      form.append('list[' + [index] + '][title]', val.groupCategoryName);
      form.append('list[' + [index] + '][category]', val.primaryCategory);
      form.append('list[' + [index] + '][subCategory]', val.subCategory);
    });
    return form;
  },
  editGroupCategory: ({ groupCategory }: IAddGroupCategory) => {
    return {
      title: groupCategory.groupCategoryName,
      category: groupCategory.primaryCategory,
      subCategory: groupCategory.subCategory,
    };
    // let form = new FormData();
    // form.append('title', groupCategory.groupCategoryName);
    // form.append('category', groupCategory.primaryCategory);
    // form.append('subCategory', groupCategory.subCategory);
    // return form;
  },
};
export const brandJSON = {
  addBrands: ({ brands }: IAddBrands) => {
    let form = new FormData();
    brands.map((val: any, index: any) => {
      form.append('list[' + [index] + '][title]', val.brandName);
      form.append('list[' + [index] + '][image]', val.brandImageReader);
      form.append('list[' + [index] + '][isTobacco]', val.isTobacco);
    });
    return form;
  },
  listBrands: ({ pageNo, limit, sortKey, sortOrder }: IListBrands) => {
    return {
      pageNo: pageNo,
      limit: limit,
      sortKey: sortKey,
      sortOrder: sortOrder,
      needCount: true,
    };
  },
  editBrands: ({ title, image, isTobacco }: IEditBrands) => {
    let form = new FormData();
    if (image) form.append('image', image);
    form.append('title', title);
    form.append('isTobacco', isTobacco);
    return form;
  },
};
export const variantsJSON = {
  addVariants: ({ variants }: IAddVariants) => {
    return variants;
  },
  variantInfo: ({ viewType }: IVariantInfo) => {
    return {
      viewType: viewType,
    };
  },
};
export const rolesJSON = {
  addRoles: ({ name, permission }: IRolesAndPermissions) => {
    // const tempPermission = permission.map((item: any) => {
    //   const temp = { ...item };
    //   if (temp.permissions.length >= 4) {
    //     temp.permissions = [0];
    //   }
    //   return temp;
    // });
    const tempPermission = permission.map((item) => {
      if (
        (item.module === GoodsInWarehouseConst ||
          item.module === GoodsRequestConst) &&
        item.permissions.includes(Add) &&
        !item.permissions.includes(Edit)
      ) {
        return {
          module: item.module,
          permissions: [...item.permissions, Edit],
        };
      } else if (
        (item.module === GoodsInWarehouseConst ||
          item.module === GoodsRequestConst) &&
        !item.permissions.includes(Add)
      ) {
        return {
          module: item.module,
          permissions: item.permissions.filter((item) => item !== Edit),
        };
      } else {
        return item;
      }
    });
    return {
      name: name,
      permission: tempPermission,
    };
  },
};
export const userManagementJson = {
  addUser: ({ name, phone, phoneCountry, email, role, image }: IUserManage) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('phoneCountry', phoneCountry);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('image', image);
    // formData.append('password', '12345678');
    return formData;
  },
  editUser: ({
    name,
    phone,
    phoneCountry,
    email,
    role,
    image,
    prevRole,
  }: IUserManage) => {
    return {
      name: name,
      phone: phone,
      phoneCountry: phoneCountry,
      email: email,
      role: role,
      image: image,
      isRoleUpdated: !(prevRole === role),
    };
  },
};
