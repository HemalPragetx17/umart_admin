export interface IAddPrimaryCategory {
  primaryCategory: any;
}
export interface IAddSubCategory {
  subCategory: any;
}
export interface IAddGroupCategory {
  groupCategory: any;
}

export interface IListCategories {
  pageNo: number;
  limit: number;
  sortKey: string;
  sortOrder: number;
  categoriesDepth:number;
}
export interface IAddBrands {
  brands: any;
}
export interface IListBrands {
  pageNo: number;
  limit: number;
  sortKey: string;
  sortOrder: number;
}
export interface IEditBrands {
  title: string;
  image?: any;
  isTobacco:any;
}
export interface IAddVariants {
  variants: [
    {
      title: string;
      categories: [
        {
          category: string;
          categories: [
            {
              category: string;
              definedBy: number;
              options?: [{ title: string }];
              note?: string;
            }
          ];
        }
      ];
    }
  ];
}
export interface IVariantInfo {
  viewType: number;
}
interface IModule {
  module: number;
  permissions: number[];
}
export interface IRolesAndPermissions {
  name: string;
  permission: IModule[];
}
export interface IUserManage {
  name: string;
  email: string;
  phone: string;
  phoneCountry: string;
  image: any;
  role: string;
  prevRole:string;
}
