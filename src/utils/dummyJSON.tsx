import p1 from '../umart_admin/assets/media/product/p-1.png';
import p5 from '../umart_admin/assets/media/product/p-5.png';
import p6 from '../umart_admin/assets/media/product/p-6.png';
import p7 from '../umart_admin/assets/media/product/p-7.png';
import p8 from '../umart_admin/assets/media/product/p-8.png';
import p9 from '../umart_admin/assets/media/product/p-9.png';
import p10 from '../umart_admin/assets/media/product/p-10.png';
import p11 from '../umart_admin/assets/media/product/p-11.png';
import p12 from '../umart_admin/assets/media/product/p-12.png';
import p13 from '../umart_admin/assets/media/product/p-13.png';
import p14 from '../umart_admin/assets/media/product/p-14.png';
import p17 from '../umart_admin/assets/media/product/p-17.png';
import p18 from '../umart_admin/assets/media/product/p-18.png';
import p20 from '../umart_admin/assets/media/product/p-20.png';
import p21 from '../umart_admin/assets/media/product/p-21.png';
import p22 from '../umart_admin/assets/media/product/p-22.png';
import p23 from '../umart_admin/assets/media/product/p-23.png';
import p24 from '../umart_admin/assets/media/product/p-24.png';
import p25 from '../umart_admin/assets/media/product/p-25.png';
import p26 from '../umart_admin/assets/media/product/p-26.png';
import p27 from '../umart_admin/assets/media/product/p-27.png';
import p28 from '../umart_admin/assets/media/product/p-28.png';
import p29 from '../umart_admin/assets/media/product/p-29.png';
import p30 from '../umart_admin/assets/media/product/p-30.png';
import Nitro from '../umart_admin/assets/media/product/nutro.png';
import Avatart1 from '../umart_admin/assets/media/avatars/300-1.jpg';
import Avatart2 from '../umart_admin/assets/media/avatars/300-11.jpg';
import Avatart3 from '../umart_admin/assets/media/avatars/300-12.jpg';
import nutro from '../umart_admin/assets/media/product/nutro.png';
import {
  AllRecipesConst,
  AppSettingsConst,
  BannerConst,
  Brand,
  BrandWiseSalesPerformanceReport,
  Category,
  CategoryAndSubCategoryAnalysisReport,
  CmsPages,
  ContactEnquiries,
  CustomerPurchaseBehaviourReport,
  CustomNotificationConst,
  DeliveryUser,
  Download,
  FrequentCustomerPurchasePatternAnalysisReport,
  GeneralSettings,
  GeographicSalesInsightReport,
  GoodsInWarehouseConst,
  GoodsRequestConst,
  InventoryStatusReport,
  LowStockConst,
  NotPacked,
  OutWardReports,
  Packed,
  PickerConst,
  ProductSalesPerformanceReport,
  ProductVariant,
  ProductZoneConst,
  Promotion,
  RefundReportConst,
  Reports,
  ReturnProductReports,
  ReturnRequestConst,
  RevenueGenerationReport,
  RolePermissions,
  SalesReportsConst,
  SuggestProductConst,
  UserManagement,
  WarehouseZone,
} from './constants';
import {
  DeliveryManager,
  FinanceManager,
  InventoryManager,
  LoadingAreaManager,
  StaffMember,
  WarehouseAdmin,
} from './constants';
import {
  Add,
  All,
  Customer,
  Delete,
  Edit,
  Inventory,
  Master,
  Order,
  Product,
  View,
} from './constants';
import AppSettings from '../app/modules/settings/app-settings';
export const demo = [
  {
    name: 'demo json 1',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
  },
];
export const IMAGES = {
  downArrow: require('../umart_admin/assets/media/svg_uMart/down-arrow.svg')
    .default,
  WadsworthDistributorsLtd: require('../umart_admin/assets/media/brand/wadsworth-distributors-limited.png'),
  ElvenAgri: require('../umart_admin/assets/media/brand/elven_agri.png'),
  SuperMealsLtd: require('../umart_admin/assets/media/brand/super_meal.png'),
  CoolBlue: require('../umart_admin/assets/media/brand/cool_blue.png'),
  MacLeansBeneCIBOLtd: require('../umart_admin/assets/media/brand/macLeans.png'),
  Afribon: require('../umart_admin/assets/media/brand/afribon.png'),
  KilimoFreshFoodsAfricaLTD: require('../umart_admin/assets/media/brand/kilimo.png'),
  ZamzamStationerySupermarket: require('../umart_admin/assets/media/brand/zamzam.png'),
  NilePerchFisheriesLtd: require('../umart_admin/assets/media/brand/nile_perch.png'),
  OmrosFoods: require('../umart_admin/assets/media/brand/omros_foods.png'),
  NutroWafer: require('../umart_admin/assets/media/food/chochlate.png'),
  LatoMilk: require('../umart_admin/assets/media/food/milk.png'),
  RollGum: require('../umart_admin/assets/media/food/pop.png'),
  AmazonMonstaPops: require('../umart_admin/assets/media/food/strawberry.png'),
  FreedomPen: require('../umart_admin/assets/media/food/pen.png'),
};
export const categoryJSON = [
  {
    taxes: 0,
    _id: '646f1018711f0566eda86702',
    title: 'Electronics',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312552815_2264031971534887.png',
    commission: 10,
    categories: [
      {
        taxes: 0,
        title: 'Fridge',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1685000293815_5398482539850353.jpg',
        commission: 10,
        _id: '646f1065711f0566eda86710',
        categories: [
          {
            title: 'category with no products inside',
            commission: 10,
            taxes: 0,
            _createdAt: '2023-09-14T09:14:52.945Z',
            _updatedAt: '2023-09-20T04:35:51.283Z',
            _id: '6502cf0c6e655ea6125870bc',
          },
        ],
        _createdAt: '2023-05-25T07:38:13.911Z',
        _updatedAt: '2023-09-20T04:35:51.283Z',
      },
      {
        taxes: 0,
        title: 'Mobiles',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1693896541137_2016740118027776.png',
        commission: 10,
        categories: [
          {
            taxes: 0,
            title: 'Samsung',
            commission: 10,
            _id: '646f1260711f0566eda8675b',
            _createdAt: '2023-05-25T07:46:40.453Z',
            _updatedAt: '2023-05-25T07:46:40.453Z',
          },
          {
            title: 'oneplus',
            commission: 10,
            taxes: 0,
            _id: '64f6d0932984301e3e2fd76e',
            _createdAt: '2023-09-05T06:54:11.301Z',
            _updatedAt: '2023-09-05T06:54:11.301Z',
          },
          {
            title: 'Samsung',
            commission: 10,
            taxes: 0,
            _createdAt: '2023-09-05T18:32:34.283Z',
            _updatedAt: '2023-09-05T18:33:42.344Z',
            _id: '64f77442d3045f1f48cbe46f',
          },
          {
            title: 'Apple',
            commission: 10,
            taxes: 0,
            _createdAt: '2023-05-25T07:46:40.453Z',
            _updatedAt: '2023-09-14T09:17:16.207Z',
            _id: '646f1260711f0566eda8675a',
          },
        ],
        _createdAt: '2023-05-25T07:38:13.911Z',
        _updatedAt: '2023-09-20T04:35:51.283Z',
        _id: '646f1065711f0566eda8670f',
      },
      {
        title: 'Oven',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1693936305222_2514537689643372.png',
        commission: 10,
        taxes: 0,
        categories: [],
        _createdAt: '2023-09-05T17:49:50.698Z',
        _updatedAt: '2023-09-05T18:33:42.344Z',
        _id: '64f76a3ed3045f1f48cbe2ae',
      },
      {
        title: 'Home appliances',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1694689324604_4158141001055909.jpg',
        commission: 10,
        taxes: 0,
        _id: '6502e82c6e655ea61258737f',
        categories: [],
        _createdAt: '2023-09-14T11:02:04.747Z',
        _updatedAt: '2023-09-14T11:02:04.747Z',
      },
    ],
    _createdAt: '2023-05-25T07:36:56.772Z',
    _updatedAt: '2023-09-05T17:50:01.150Z',
    __v: 0,
  },
  {
    taxes: 0,
    _id: '648c166a303198da5b0a0fa8',
    title: 'Furniture',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312515267_1049255433391400.png',
    commission: 12,
    categories: [
      {
        taxes: 0,
        title: 'Sofas',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1686902479811_7100129906666509.jpg',
        commission: 12,
        _id: '648c16cf303198da5b0a0fbf',
        categories: [],
        _createdAt: '2023-06-16T08:01:19.955Z',
        _updatedAt: '2023-06-16T08:01:19.955Z',
      },
      {
        taxes: 0,
        title: 'Beds',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1686902479811_1349829709733139.jpg',
        commission: 12,
        _id: '648c16cf303198da5b0a0fc0',
        categories: [],
        _createdAt: '2023-06-16T08:01:19.955Z',
        _updatedAt: '2023-06-16T08:01:19.955Z',
      },
      {
        title: 'Test',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1693936341266_5897750769172430.jpg',
        commission: 12,
        taxes: 0,
        categories: [
          {
            title: 'Test',
            commission: 12,
            taxes: 0,
            _createdAt: '2023-09-05T17:52:37.707Z',
            _updatedAt: '2023-09-05T17:52:37.707Z',
            _id: '64f76ae5d3045f1f48cbe383',
          },
        ],
        _createdAt: '2023-09-05T17:52:21.336Z',
        _updatedAt: '2023-09-14T09:41:24.623Z',
        _id: '64f76ad5d3045f1f48cbe364',
      },
    ],
    _createdAt: '2023-06-16T07:59:38.848Z',
    _updatedAt: '2023-09-14T09:41:24.625Z',
    __v: 0,
  },
  {
    _id: '65055b4e523a991acbbdacf0',
    title: 'Route Planning P2',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1694849870071_188050892521155.jpg',
    commission: 50,
    taxes: 0,
    categories: [
      {
        title: 'Route Planning S1',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1694849896657_4267064001179782.jpg',
        commission: 50,
        taxes: 0,
        _id: '65055b68523a991acbbdad0c',
        categories: [
          {
            title: 'Route Planning G1',
            commission: 50,
            taxes: 0,
            _id: '65055b7a523a991acbbdad32',
            _createdAt: '2023-09-16T07:38:34.171Z',
            _updatedAt: '2023-09-16T07:38:34.171Z',
          },
        ],
        _createdAt: '2023-09-16T07:38:16.773Z',
        _updatedAt: '2023-09-16T07:38:16.773Z',
      },
      {
        title: 'Testing for sub demo1',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1695885734838_8861574794403271.jpg',
        commission: 50,
        taxes: 0,
        categories: [],
        _createdAt: '2023-09-28T07:22:14.981Z',
        _updatedAt: '2023-09-28T07:22:32.511Z',
        _id: '651529a65e362d41b0b56419',
      },
      {
        title: 'fgfh',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1695885912657_1372093030681262.jpg',
        commission: 50,
        taxes: 0,
        categories: [],
        _createdAt: '2023-09-28T07:25:12.888Z',
        _updatedAt: '2023-09-28T07:25:35.187Z',
        _id: '65152a585e362d41b0b56497',
      },
    ],
    _createdAt: '2023-09-16T07:37:50.214Z',
    _updatedAt: '2023-09-28T07:25:35.188Z',
    __v: 0,
  },
  {
    taxes: 0,
    _id: '648c2d1448c6e41e2cea0fee',
    title: 'Sports',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312415393_452452231238538.png',
    commission: 20,
    categories: [
      {
        taxes: 0,
        title: 'Sports Shoes',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1686908339728_742208888494586.jpg',
        commission: 20,
        _id: '648c2db348c6e41e2cea100d',
        categories: [],
        _createdAt: '2023-06-16T09:38:59.879Z',
        _updatedAt: '2023-06-16T09:38:59.879Z',
      },
      {
        taxes: 0,
        title: 'Sports Gears',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1686908339728_7446207165577452.jpg',
        commission: 20,
        _id: '648c2db348c6e41e2cea100e',
        categories: [
          {
            taxes: 0,
            title: 'Cricket Gears',
            commission: 20,
            _id: '648c304887b17ee149d7cbcf',
            _createdAt: '2023-06-16T09:50:00.456Z',
            _updatedAt: '2023-06-16T09:50:00.456Z',
          },
          {
            taxes: 0,
            title: 'Badminton Gears',
            commission: 20,
            _id: '648c304887b17ee149d7cbd0',
            _createdAt: '2023-06-16T09:50:00.456Z',
            _updatedAt: '2023-06-16T09:50:00.456Z',
          },
        ],
        _createdAt: '2023-06-16T09:38:59.880Z',
        _updatedAt: '2023-06-16T09:38:59.880Z',
      },
    ],
    _createdAt: '2023-06-16T09:36:20.321Z',
    _updatedAt: '2023-07-14T05:26:55.507Z',
    __v: 0,
  },
  {
    taxes: 0,
    _id: '646f1018711f0566eda86701',
    title: 'Stationary',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312454224_7995464592263689.png',
    commission: 0,
    categories: [
      {
        taxes: 0,
        title: 'Penss',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1685001251519_3507374993585794.jpg',
        commission: 0,
        _id: '646f1423711f0566eda867a0',
        categories: [],
        _createdAt: '2023-05-25T07:54:11.684Z',
        _updatedAt: '2023-09-14T12:01:12.183Z',
      },
    ],
    _createdAt: '2023-05-25T07:36:56.772Z',
    _updatedAt: '2023-07-14T05:27:34.333Z',
    __v: 0,
  },
  {
    _id: '6515298d5e362d41b0b563fb',
    title: 'Testing for demo',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1695885709343_6705931989608485.jpg',
    commission: 0,
    taxes: 0,
    categories: [],
    _createdAt: '2023-09-28T07:21:49.536Z',
    _updatedAt: '2023-09-28T07:25:35.188Z',
    __v: 0,
  },
  {
    taxes: 0,
    _id: '64b0dc48f699045269be946d',
    title: 'Tobacco',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312328885_7160240634794015.jpg',
    commission: 0,
    categories: [],
    _createdAt: '2023-07-14T05:25:28.967Z',
    _updatedAt: '2023-07-14T05:25:28.968Z',
    __v: 0,
  },
  {
    taxes: 0,
    _id: '64b0dc48f699045269be946e',
    title: 'Toiletries',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312328886_7203361051751197.jpg',
    commission: 0,
    categories: [],
    _createdAt: '2023-07-14T05:25:28.968Z',
    _updatedAt: '2023-09-14T09:41:24.625Z',
    __v: 0,
  },
  {
    _id: '6502ea856e655ea6125873b1',
    title: 'XClothing',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1694689925081_4617482431251061.jpg',
    commission: 0,
    taxes: 0,
    categories: [],
    _createdAt: '2023-09-14T11:12:05.189Z',
    _updatedAt: '2023-09-14T11:12:31.642Z',
    __v: 0,
  },
  {
    taxes: 0,
    _id: '64d60d7a029f17c0993ad8fa',
    title: 'demos',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1691749754577_3215655713244255.jpg',
    commission: 0,
    categories: [
      {
        title: 'sub',
        image:
          'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1697437570865_4523337922729026.jpg',
        commission: 0,
        taxes: 0,
        _id: '652cd782e286807dd7758dcf',
        categories: [],
        _createdAt: '2023-10-16T06:26:10.971Z',
        _updatedAt: '2023-10-16T06:26:10.971Z',
      },
    ],
    _createdAt: '2023-08-11T10:29:14.671Z',
    _updatedAt: '2023-09-14T09:13:25.791Z',
    __v: 0,
  },
  {
    _id: '652ce485e286807dd7760361',
    title: 'test',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1697440900766_4707681262592790.jpg',
    commission: 0,
    taxes: 0,
    categories: [],
    _createdAt: '2023-10-16T07:21:41.503Z',
    _updatedAt: '2023-10-16T07:21:41.503Z',
    __v: 0,
  },
];
export const primaryCategoryOption = [
  {
    value: '1',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312552815_2264031971534887.png"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Electronics
      </>
    ),
    commission: 10,
  },
  {
    value: '2',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312515267_1049255433391400.png"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Furniture
      </>
    ),
    commission: 12,
  },
  {
    value: '3',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1694849870071_188050892521155.jpg"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Route Planning P2
      </>
    ),
    commission: 10,
  },
  {
    value: '4',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312415393_452452231238538.png"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Sports
      </>
    ),
    commission: 20,
  },
  {
    value: '5',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312454224_7995464592263689.png"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Stationary
      </>
    ),
    commission: 0,
  },
  {
    value: '6',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1695885709343_6705931989608485.jpg"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Testing for demo
      </>
    ),
    commission: 0,
  },
  {
    value: '7',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312328885_7160240634794015.jpg"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Tobacco
      </>
    ),
    commission: 0,
  },
  {
    value: '8',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312328886_7203361051751197.jpg"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        Toiletries
      </>
    ),
    commission: 0,
  },
  {
    value: '9',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1694689925081_4617482431251061.jpg"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        XClothing
      </>
    ),
    commission: 0,
  },
  {
    value: '10',
    label: (
      <>
        <img
          src="http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1691749754577_3215655713244255.jpg"
          height={20}
          width={20}
          className="me-2"
          alt=""
        />
        demos
      </>
    ),
    commission: 0,
  },
];
export const brandsJSON = [
  {
    _id: '6503f6a4530afe8705071286',
    title: 'Adidas',
    lable: 'Adidas',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1694758564124_7590264616180875.jpg',
    __v: 0,
    createdAt: '2023-09-15T06:16:04.246Z',
    updatedAt: '2023-09-15T06:16:04.246Z',
  },
  {
    _id: '646f14b3711f0566eda867ca',
    title: 'Apple',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1685001395333_7871905918046674.jpg',
    __v: 0,
    createdAt: '2023-05-25T07:56:35.845Z',
    updatedAt: '2023-09-15T05:42:10.043Z',
  },
  {
    _id: '646f14dd711f0566eda867d0',
    title: 'Cello',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1685001437340_5145341545978826.jpg',
    __v: 0,
    createdAt: '2023-05-25T07:57:17.403Z',
    updatedAt: '2023-05-25T07:57:17.403Z',
  },
  {
    _id: '6503f6a4530afe8705071287',
    title: 'Crocs',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1694758564125_1805961246037941.jpg',
    __v: 0,
    createdAt: '2023-09-15T06:16:04.246Z',
    updatedAt: '2023-09-15T06:16:04.246Z',
  },
  {
    _id: '648c18eb303198da5b0a1177',
    title: 'Godrej Interior',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1686903019456_7799334021561855.jpg',
    __v: 0,
    createdAt: '2023-06-16T08:10:19.587Z',
    updatedAt: '2023-06-16T08:10:19.587Z',
  },
  {
    _id: '64cccffd4f44fbc5ebeb4a13',
    title: 'MRF',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1691144189242_8079086899620521.jpg',
    __v: 0,
    createdAt: '2023-08-04T10:16:29.367Z',
    updatedAt: '2023-08-04T10:16:29.367Z',
  },
  {
    _id: '646f4ccebfd4a22b1ab2efb7',
    title: 'OnePlus',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1685015757959_7016406623848596.jpg',
    __v: 0,
    createdAt: '2023-05-25T11:55:58.059Z',
    updatedAt: '2023-05-25T11:55:58.059Z',
  },
  {
    _id: '648c2e1c48c6e41e2cea104e',
    title: 'Puma',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1686908444612_3086331617956040.jpg',
    __v: 0,
    createdAt: '2023-06-16T09:40:44.730Z',
    updatedAt: '2023-06-16T09:40:44.730Z',
  },
  {
    _id: '65055b95523a991acbbdad4e',
    title: 'Route Planning',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1694849941638_2778375004903034.jpg',
    __v: 0,
    createdAt: '2023-09-16T07:39:01.798Z',
    updatedAt: '2023-09-16T07:39:01.798Z',
  },
  {
    _id: '646f146d711f0566eda867bb',
    title: 'Samsung',
    image:
      'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1685001324526_5884691867335089.jpg',
    __v: 0,
    createdAt: '2023-05-25T07:55:25.122Z',
    updatedAt: '2023-05-25T07:55:25.122Z',
  },
];
export const warehouseJSON = [
  {
    value: '1',
    label: 'Warehouse A',
  },
  {
    value: '2',
    label: 'Warehouse B',
  },
  {
    value: '3',
    label: 'Warehouse C',
  },
  {
    value: '4',
    label: 'Warehouse D',
  },
  {
    value: '5',
    label: 'Warehouse E',
  },
];
export const productsJSON = [
  {
    productName: { label: 'Product 1', value: 'product1' },
    loadingArea: '12',
    SKU: 'ZG211AQA',
    expiresOn: '-',
    units: 2,
  },
  {
    productName: { label: 'Product 2', value: 'product2' },
    loadingArea: '15',
    SKU: 'XYZ123',
    expiresOn: '10/25/2023',
    units: 5,
  },
];
export const productOptions = [
  { label: 'Product 1', value: 'product1' },
  { label: 'Product 2', value: 'product2' },
];
export const products = [
  {
    _id: '652ce167e286807dd775e200',
    title: 'date12',
    variants: [
      {
        variant: {
          _id: '652ce167e286807dd775e218',
          title: 'date12',
          status: 2,
          variantType: [],
          technicalInfo: [
            {
              reference: '6507fb5d232d2535596878db',
              name: 'Charger Includes',
              type: 3,
              options: [
                {
                  title: 'No',
                  _id: '6501a9c371ca69828ae8a8c3',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a4e232d2535596887cd',
              name: 'Product Warrantyy',
              type: 4,
              options: [
                {
                  title: '4 years',
                  _id: '6507fb9d232d253559687ab8',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a5c232d2535596887f0',
              name: 'Inside Boxx',
              type: 3,
              options: [
                {
                  title: 'charger',
                  _id: '6507faa9232d253559687307',
                },
              ],
              enabled: true,
            },
            {
              reference: '650d2f85f3e5ff61dd1ba9b9',
              name: 'date',
              type: 5,
              enabled: true,
              answer: '2023-10-16T12:38:22+05:30',
              options: [],
            },
            {
              reference: '651532b05e362d41b0b56e50',
              name: 'Manufacturin date',
              type: 5,
              enabled: true,
              answer: '2023-10-16T12:38:22+05:30',
              options: [],
            },
            {
              reference: '651eaea4b10f8412a3b3ac2e',
              name: 'OSs',
              type: 1,
              enabled: true,
              answer: 'd',
              options: [],
            },
            {
              reference: '651eaeb7b10f8412a3b3ac48',
              name: 'Product manual included',
              type: 2,
              enabled: true,
              answer: 's',
              options: [],
            },
            {
              reference: '65278669dd628bf2fa2b5934',
              name: 'single select',
              type: 3,
              options: [
                {
                  title: '3',
                  _id: '65278669dd628bf2fa2b5937',
                },
              ],
              enabled: true,
            },
            {
              reference: '65278669dd628bf2fa2b593a',
              name: 'single textbox',
              type: 1,
              enabled: true,
              answer: 'ds',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697440103443_3118103240029542.jpg',
              type: 1,
              index: 0,
              _id: '652ce167e286807dd775e217',
            },
          ],
          draft: false,
          active: true,
          versionKey: '652ce167e286807dd775e218_1697440103426',
          type: 'variantTemplate',
        },
      },
    ],
    draft: false,
    active: true,
    versionKey: '652ce167e286807dd775e200_1697440103426',
    type: 'productTemplate',
  },
  {
    _id: '651f9260b862638d46a8e89a',
    title: 'Tax without variation',
    variants: [
      {
        variant: {
          _id: '651f9260b862638d46a8e8a6',
          title: 'Tax without variation',
          status: 2,
          variantType: [],
          technicalInfo: [
            {
              reference: '646f1993711f0566eda8686d',
              name: 'Colors',
              type: 4,
              options: [
                {
                  title: 'black',
                  _id: '646f1993711f0566eda8686f',
                },
              ],
              enabled: true,
            },
            {
              reference: '646f1993711f0566eda86872',
              name: 'weight',
              type: 2,
              enabled: true,
              answer: 'test',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1696567904471_7403435892982588.jpg',
              type: 1,
              index: 0,
              _id: '651f9260b862638d46a8e8a5',
            },
          ],
          draft: false,
          active: true,
          versionKey: '651f9260b862638d46a8e8a6_1696567904456',
          type: 'variantTemplate',
        },
      },
    ],
    draft: false,
    active: true,
    versionKey: '651f9260b862638d46a8e89a_1696569083087',
    type: 'productTemplate',
  },
  {
    _id: '651f91edb862638d46a8e6c6',
    title: 'Tax product',
    variants: [
      {
        variant: {
          _id: '651f91edb862638d46a8e6d3',
          title: 'Tax product (greeen )',
          status: 2,
          variantType: [
            {
              reference: '646f1e39711f0566eda86916',
              option: 'greeen ',
            },
          ],
          technicalInfo: [
            {
              reference: '646f1993711f0566eda8686d',
              name: 'Colors',
              type: 4,
              options: [
                {
                  title: 'red',
                  _id: '646f1993711f0566eda8686e',
                },
                {
                  title: 'black',
                  _id: '646f1993711f0566eda8686f',
                },
              ],
              enabled: true,
            },
            {
              reference: '646f1993711f0566eda86872',
              name: 'weight',
              type: 2,
              enabled: true,
              answer: 'Test\r\nproduct\r\nFor \r\nTax',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1696567789989_5445185215884611.jpg',
              type: 1,
              index: 0,
              _id: '651f91edb862638d46a8e6d2',
            },
          ],
          draft: false,
          active: true,
          versionKey: '651f91edb862638d46a8e6d3_1696567789950',
          type: 'variantTemplate',
        },
      },
      {
        variant: {
          _id: '651f91edb862638d46a8e6d6',
          title: 'Tax product (Red )',
          status: 2,
          variantType: [
            {
              reference: '646f1e39711f0566eda86916',
              option: 'Red ',
            },
          ],
          technicalInfo: [
            {
              reference: '646f1993711f0566eda8686d',
              name: 'Colors',
              type: 4,
              options: [
                {
                  title: 'red',
                  _id: '646f1993711f0566eda8686e',
                },
                {
                  title: 'black',
                  _id: '646f1993711f0566eda8686f',
                },
              ],
              enabled: true,
            },
            {
              reference: '646f1993711f0566eda86872',
              name: 'weight',
              type: 2,
              enabled: true,
              answer: 'Test\r\nproduct\r\nFor \r\nTax',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1696567789991_1592287198837715.jpg',
              type: 1,
              index: 0,
              _id: '651f91edb862638d46a8e6d5',
            },
          ],
          draft: false,
          active: true,
          versionKey: '651f91edb862638d46a8e6d6_1696567789950',
          type: 'variantTemplate',
        },
      },
    ],
    draft: false,
    active: true,
    versionKey: '651f91edb862638d46a8e6c6_1696567789950',
    type: 'productTemplate',
  },
  {
    _id: '651ea612b10f8412a3b39e33',
    title: 'tese',
    variants: [
      {
        variant: {
          _id: '651ea909b10f8412a3b3a27c',
          title: 'tese (White )',
          status: 2,
          variantType: [
            {
              reference: '646f1e39711f0566eda86916',
              option: 'White ',
            },
          ],
          technicalInfo: [
            {
              reference: '6507fb5d232d2535596878db',
              name: 'Charger Includes',
              type: 3,
              options: [
                {
                  title: 'No',
                  _id: '6501a9c371ca69828ae8a8c3',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a4e232d2535596887cd',
              name: 'Product Warrantyy',
              type: 4,
              options: [
                {
                  title: '1 years',
                  _id: '646f1d85711f0566eda868b7',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a5c232d2535596887f0',
              name: 'Inside Boxx',
              type: 3,
              options: [
                {
                  title: 'earphones',
                  _id: '6507faa9232d253559687308',
                },
              ],
              enabled: true,
            },
            {
              reference: '650d2f85f3e5ff61dd1ba9b9',
              name: 'date',
              type: 5,
              enabled: true,
              answer: 'Thu Oct 05 2023 17:33:28 GMT+0530 (India Standard Time)',
              options: [],
            },
            {
              reference: '651532b05e362d41b0b56e50',
              name: 'Manufacturin date',
              type: 5,
              enabled: true,
              answer: '2023-10-05T12:03:03.000Z',
              options: [],
            },
            {
              reference: '651eaea4b10f8412a3b3ac2e',
              name: 'OSs',
              type: 1,
              enabled: true,
              answer: 'f',
              options: [],
            },
            {
              reference: '651eaeb7b10f8412a3b3ac48',
              name: 'Product manual included',
              type: 2,
              enabled: true,
              answer: 'f',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1696507410122_8452565035661191.jpg',
              type: 1,
              index: 0,
              _id: '651ea612b10f8412a3b39e47',
            },
          ],
          draft: false,
          active: true,
          versionKey: '651ea909b10f8412a3b3a27c_1696588963035',
          type: 'variantTemplate',
        },
      },
      {
        variant: {
          _id: '651ea909b10f8412a3b3a27f',
          title: 'tese (Black )',
          status: 2,
          variantType: [
            {
              reference: '646f1e39711f0566eda86916',
              option: 'Black ',
            },
          ],
          technicalInfo: [
            {
              reference: '6507fb5d232d2535596878db',
              name: 'Charger Includes',
              type: 3,
              options: [
                {
                  title: 'No',
                  _id: '6501a9c371ca69828ae8a8c3',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a4e232d2535596887cd',
              name: 'Product Warrantyy',
              type: 4,
              options: [
                {
                  title: '1 years',
                  _id: '646f1d85711f0566eda868b7',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a5c232d2535596887f0',
              name: 'Inside Boxx',
              type: 3,
              options: [
                {
                  title: 'cover',
                  _id: '6507faa9232d253559687309',
                },
              ],
              enabled: true,
            },
            {
              reference: '650d2f85f3e5ff61dd1ba9b9',
              name: 'date',
              type: 5,
              enabled: true,
              answer: '2023-10-14T12:03:28.000Z',
              options: [],
            },
            {
              reference: '651532b05e362d41b0b56e50',
              name: 'Manufacturin date',
              type: 5,
              enabled: true,
              answer: '2023-10-15T12:03:03.000Z',
              options: [],
            },
            {
              reference: '651eaea4b10f8412a3b3ac2e',
              name: 'OSs',
              type: 1,
              enabled: true,
              answer: 'aaa',
              options: [],
            },
            {
              reference: '651eaeb7b10f8412a3b3ac48',
              name: 'Product manual included',
              type: 2,
              enabled: true,
              answer: 'a\r\na\r\na\r\n',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1696508169458_8634676814528362.jpg',
              type: 1,
              index: 0,
              _id: '651ea909b10f8412a3b3a27e',
            },
          ],
          draft: false,
          active: true,
          versionKey: '651ea909b10f8412a3b3a27f_1696511600194',
          type: 'variantTemplate',
        },
      },
    ],
    draft: false,
    active: true,
    versionKey: '651ea612b10f8412a3b39e33_1696508169435',
    type: 'productTemplate',
  },
  {
    _id: '6527881fdd628bf2fa2b5dc1',
    title: 'h',
    variants: [
      {
        variant: {
          _id: '6527881fdd628bf2fa2b5dd9',
          title: 'h',
          status: 2,
          variantType: [],
          technicalInfo: [
            {
              reference: '6507fb5d232d2535596878db',
              name: 'Charger Includes',
              type: 3,
              options: [
                {
                  title: 'No',
                  _id: '6501a9c371ca69828ae8a8c3',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a4e232d2535596887cd',
              name: 'Product Warrantyy',
              type: 4,
              options: [
                {
                  title: '1 years',
                  _id: '646f1d85711f0566eda868b7',
                },
              ],
              enabled: true,
            },
            {
              reference: '65081a5c232d2535596887f0',
              name: 'Inside Boxx',
              type: 3,
              options: [
                {
                  title: 'earphones',
                  _id: '6507faa9232d253559687308',
                },
              ],
              enabled: true,
            },
            {
              reference: '650d2f85f3e5ff61dd1ba9b9',
              name: 'date',
              type: 5,
              enabled: true,
              answer: 'Thu Oct 12 2023 11:16:05 GMT+0530 (India Standard Time)',
              options: [],
            },
            {
              reference: '651532b05e362d41b0b56e50',
              name: 'Manufacturin date',
              type: 5,
              enabled: true,
              answer: '2023-10-09T05:45:47.000Z',
              options: [],
            },
            {
              reference: '651eaea4b10f8412a3b3ac2e',
              name: 'OSs',
              type: 1,
              enabled: true,
              answer: 'asd',
              options: [],
            },
            {
              reference: '651eaeb7b10f8412a3b3ac48',
              name: 'Product manual included',
              type: 2,
              enabled: true,
              answer: 'sad',
              options: [],
            },
            {
              reference: '65278669dd628bf2fa2b5934',
              name: 'single select',
              type: 3,
              options: [
                {
                  title: '3',
                  _id: '65278669dd628bf2fa2b5937',
                },
              ],
              enabled: true,
            },
            {
              reference: '65278669dd628bf2fa2b593a',
              name: 'single textbox',
              type: 1,
              enabled: true,
              answer: 'das',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697089567269_8067229611732043.jpg',
              type: 1,
              index: 0,
              _id: '6527881fdd628bf2fa2b5dd8',
            },
          ],
          draft: false,
          active: true,
          versionKey: '6527881fdd628bf2fa2b5dd9_1697089567249',
          type: 'variantTemplate',
        },
      },
    ],
    draft: false,
    active: true,
    versionKey: '6527881fdd628bf2fa2b5dc1_1697089567249',
    type: 'productTemplate',
  },
  {
    _id: '65278179dd628bf2fa2b574b',
    title: 'testing for master',
    variants: [
      {
        variant: {
          _id: '65278179dd628bf2fa2b575e',
          title: 'testing for master (Black )',
          status: 2,
          variantType: [
            {
              reference: '646f1e39711f0566eda86916',
              option: 'Black ',
            },
          ],
          technicalInfo: [
            {
              reference: '646f1993711f0566eda8686d',
              name: 'Colors',
              type: 4,
              options: [
                {
                  title: 'red',
                  _id: '646f1993711f0566eda8686e',
                },
                {
                  title: 'black',
                  _id: '646f1993711f0566eda8686f',
                },
              ],
              enabled: true,
            },
            {
              reference: '646f1993711f0566eda86872',
              name: 'weight',
              type: 2,
              enabled: true,
              answer:
                '100 KG weight testing long data 100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data 100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data  v 100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data ',
              options: [],
            },
            {
              reference: '652785bddd628bf2fa2b58c9',
              name: 'date',
              type: 5,
              enabled: true,
              answer: '2023-10-26T05:40:59.000Z',
              options: [],
            },
            {
              reference: '652785d5dd628bf2fa2b58e6',
              name: 'date 1',
              type: 5,
              enabled: true,
              answer: '2023-10-26T05:40:59.000Z',
              options: [],
            },
            {
              reference: '6527868bdd628bf2fa2b5980',
              name: 'single select',
              type: 3,
              options: [
                {
                  title: '4',
                  _id: '6527868bdd628bf2fa2b5984',
                },
              ],
              enabled: true,
            },
            {
              reference: '6527868bdd628bf2fa2b5986',
              name: 'single textbox',
              type: 1,
              enabled: true,
              answer:
                'single line testing single line testing single line testing single line testing single line testing single line testing single line testing single line testing ',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_6774785842345782.jpg',
              type: 1,
              index: 0,
              _id: '65278179dd628bf2fa2b575d',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865774_7965573718077090.jpg',
              type: 1,
              index: 1,
              _id: '65278179dd628bf2fa2b5759',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_5746432922685828.jpg',
              type: 1,
              index: 2,
              _id: '65278179dd628bf2fa2b575c',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865774_3177751892750105.jpg',
              type: 1,
              index: 3,
              _id: '65278179dd628bf2fa2b5758',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865774_4204659744653583.jpg',
              type: 1,
              index: 4,
              _id: '65278179dd628bf2fa2b575b',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865773_3726866187490511.jpg',
              type: 1,
              index: 5,
              _id: '65278179dd628bf2fa2b5757',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865774_4327435003185346.jpg',
              type: 1,
              index: 6,
              _id: '65278179dd628bf2fa2b575a',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697092107908_2217239251262871.jpg',
              type: 1,
              index: 7,
              _id: '6527920bdd628bf2fa2b7038',
            },
          ],
          draft: false,
          active: true,
          versionKey: '65278179dd628bf2fa2b575e_1697092107986',
          type: 'variantTemplate',
        },
      },
      {
        variant: {
          _id: '65278179dd628bf2fa2b5766',
          title: 'testing for master (Red )',
          status: 2,
          variantType: [
            {
              reference: '646f1e39711f0566eda86916',
              option: 'Red ',
            },
          ],
          technicalInfo: [
            {
              reference: '646f1993711f0566eda8686d',
              name: 'Colors',
              type: 4,
              options: [
                {
                  title: 'red',
                  _id: '646f1993711f0566eda8686e',
                },
                {
                  title: 'black',
                  _id: '646f1993711f0566eda8686f',
                },
                {
                  title: 'blue',
                  _id: '646f1993711f0566eda86870',
                },
              ],
              enabled: true,
            },
            {
              reference: '646f1993711f0566eda86872',
              name: 'weight',
              type: 2,
              enabled: true,
              answer:
                '100 KG weight testing long data 100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data 100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data  v 100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data  100 KG weight testing long data changeseee',
              options: [],
            },
            {
              reference: '652785bddd628bf2fa2b58c9',
              name: 'date',
              type: 5,
              enabled: true,
              answer: '2023-10-13T05:40:59.000Z',
              options: [],
            },
            {
              reference: '652785d5dd628bf2fa2b58e6',
              name: 'date 1',
              type: 5,
              enabled: true,
              answer: '2023-10-13T05:40:59.000Z',
              options: [],
            },
            {
              reference: '6527868bdd628bf2fa2b5980',
              name: 'single select',
              type: 3,
              options: [
                {
                  title: '1',
                  _id: '6527868bdd628bf2fa2b5981',
                },
              ],
              enabled: true,
            },
            {
              reference: '6527868bdd628bf2fa2b5986',
              name: 'single textbox',
              type: 1,
              enabled: true,
              answer:
                'single line testing single line testing single line testing single line testing single line testing single line testing single line testing single line testing  changessssss',
              options: [],
            },
          ],
          media: [
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_6195154747326676.jpg',
              type: 1,
              index: 0,
              _id: '65278179dd628bf2fa2b5761',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_7621086595283.jpg',
              type: 1,
              index: 1,
              _id: '65278179dd628bf2fa2b5764',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_7219210283539366.jpg',
              type: 1,
              index: 2,
              _id: '65278179dd628bf2fa2b5760',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_1080412633070970.jpg',
              type: 1,
              index: 3,
              _id: '65278179dd628bf2fa2b5765',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_7293309004495062.jpg',
              type: 1,
              index: 4,
              _id: '65278179dd628bf2fa2b5762',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697087865775_5109319492622723.jpg',
              type: 1,
              index: 5,
              _id: '65278179dd628bf2fa2b5763',
            },
            {
              url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1697092210244_8246077384884956.jpg',
              type: 1,
              index: 6,
              _id: '65279272dd628bf2fa2b712e',
            },
          ],
          draft: false,
          active: true,
          versionKey: '65278179dd628bf2fa2b5766_1697092210315',
          type: 'variantTemplate',
        },
      },
    ],
    draft: false,
    active: true,
    versionKey: '65278179dd628bf2fa2b574b_1697089509052',
    type: 'productTemplate',
  },
];
export const ProductDetailsJSON = {
  inventoryInfo: {
    reference: '64df0dac06b5aff78cb4123b',
    quantityTypes: [
      {
        type: 3,
        stockCount: 1000,
        reservedQty: 4,
        remainingQty: 996,
      },
    ],
  },
  product: {
    category: {
      reference: '646f1018711f0566eda86702',
      title: 'Electronics',
      image:
        'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/categories/1689312552815_2264031971534887.png',
      commission: 0,
    },
    subCategory: {
      reference: '646f1065711f0566eda8670f',
      title: 'Mobiles',
      image:
        'http://u-trade-dev.s3.af-south-1.amazonaws.com/business/sub-categories/1693896541137_2016740118027776.png',
      commission: 20,
    },
    groupCategory: {
      reference: '646f1260711f0566eda8675b',
      title: 'Samsung',
      commission: 20,
    },
    brand: {
      reference: '646f4ccebfd4a22b1ab2efb7',
      title: 'OnePlus',
      image:
        'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/brands/1685015757959_7016406623848596.jpg',
    },
    country: {
      reference: '64213836907e395c99a779c3',
      name: 'Afghanistan',
    },
    business: {
      reference: '6471dfce0c12094263285d3c',
      name: 'Ryan electronics',
      deactivated: false,
      sellingAllowedBasedOnKYC: true,
    },
    taxFree: true,
    reference: '64ccce974f44fbc5ebeb463a',
    title: 'One Plus 10',
    currency: 1,
    description: 'phone',
    owner: '6471dfce0c12094263285d3d',
  },
  approvalInfo: {
    date: '2023-08-04T10:10:55.566Z',
    user: '6403ad0afb4e3474b550a5c3',
  },
  _id: '64ccce974f44fbc5ebeb464b',
  editId: '64ccce974f44fbc5ebeb463b',
  refKey: 'V0008',
  sku: 'ZA011ED',
  title: 'one plus 10',
  status: 3,
  statusUpdatedAt: '2023-09-13T13:09:57.423Z',
  statusMessage: '',
  piecesInDozen: 2,
  dozensInCarton: 12,
  piecesInCarton: 10,
  quantityTypes: [
    {
      dimensions: {
        length: 12,
        width: 21,
        height: 21,
        weight: 12,
      },
      type: 3,
      amount: 12000,
      discountAmtEnabled: false,
      discountByQuantitiesEnabled: true,
      discountsByQuantities: [
        {
          min: 1,
          max: 5,
          discountAmt: 110,
          _id: '6501b4a571ca69828ae8bbae',
        },
        {
          min: 6,
          max: 10,
          discountAmt: 105,
          _id: '6501b4a571ca69828ae8bbaf',
        },
        {
          min: 11,
          max: 15,
          discountAmt: 100,
          _id: '6501b4a571ca69828ae8bbb0',
        },
        {
          min: 16,
          max: 20,
          discountAmt: 95,
          _id: '6501b4a571ca69828ae8bbb1',
        },
        {
          min: 21,
          max: 25,
          discountAmt: 90,
          _id: '6501b4a571ca69828ae8bbb2',
        },
        {
          min: 26,
          max: 30,
          discountAmt: 85,
          _id: '6501b4a571ca69828ae8bbb3',
        },
        {
          min: 31,
          max: 35,
          discountAmt: 80,
          _id: '6501b4a571ca69828ae8bbb4',
        },
        {
          min: 36,
          max: 40,
          discountAmt: 75,
          _id: '6501b4a571ca69828ae8bbb5',
        },
        {
          min: 41,
          max: 45,
          discountAmt: 70,
          _id: '6501b4a571ca69828ae8bbb6',
        },
        {
          min: 46,
          max: 50,
          discountAmt: 65,
          _id: '6501b4a571ca69828ae8bbb7',
        },
        {
          min: 51,
          max: 55,
          discountAmt: 60,
          _id: '6501b4a571ca69828ae8bbb8',
        },
        {
          min: 56,
          max: 60,
          discountAmt: 55,
          _id: '6501b4a571ca69828ae8bbb9',
        },
        {
          min: 61,
          max: 65,
          discountAmt: 50,
          _id: '6501b4a571ca69828ae8bbba',
        },
      ],
    },
  ],
  variantType: [],
  technicalInfo: [
    {
      reference: '646f1963711f0566eda86850',
      name: 'Inside Boxx',
      type: 2,
      enabled: false,
      answer: 'Charger',
      options: [],
    },
    {
      reference: '64703d55bfd4a22b1ab2f8a2',
      name: 'Product Warrantyy',
      type: 3,
      options: [
        {
          title: '1 years',
          _id: '646f1d85711f0566eda868b7',
        },
      ],
      enabled: false,
    },
    {
      reference: '64ccd04e4f44fbc5ebeb4a3a',
      name: 'OSs',
      type: 3,
      options: [
        {
          title: 'Android',
          _id: '64ccd04e4f44fbc5ebeb4a3c',
        },
      ],
      enabled: false,
    },
    {
      reference: '6501a8af71ca69828ae8a874',
      name: 'Charger Includes',
      type: 3,
      options: [
        {
          title: 'No',
          _id: '6501a9c371ca69828ae8a8c3',
        },
      ],
      enabled: false,
    },
    {
      reference: '6501a8c071ca69828ae8a888',
      name: 'Manufacturing datee',
      type: 1,
      enabled: false,
      answer: 'na',
      options: [],
    },
  ],
  media: [
    {
      url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1685941933374_6101393066665591.jpg',
      type: 1,
      index: 0,
      _id: '647d6ead7a27d92307287fe5',
    },
    {
      url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1686212347304_6005428021792540.jpg',
      type: 1,
      index: 1,
      _id: '64818efb7a27d9230728b089',
    },
  ],
  draft: false,
  active: true,
  versionKey: '64ccce974f44fbc5ebeb464b_1694610597423',
  _createdAt: '2023-08-04T10:10:31.405Z',
  _updatedAt: '2023-09-13T13:09:57.423Z',
  type: 'variant',
};
export const FoodCategory = [
  {
    name: 'Cooking Oil',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p5,
  },
  {
    name: 'Flour',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p6,
  },
  {
    name: 'Snacks',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p7,
  },
  {
    name: 'Sweets',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p8,
  },
  {
    name: 'Drinks',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p9,
  },
  {
    name: 'Other Foods',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p10,
  },
];
export const ToiletriesCategory = [
  {
    name: 'Soaps & Bars',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p11,
  },
  {
    name: 'Detergents',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p12,
  },
  {
    name: 'Liquids',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p13,
  },
  {
    name: 'Insecticides',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p29,
  },
  {
    name: 'Other Toiletries',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p30,
  },
];
export const BeautyCategory = [
  {
    name: 'Perfumes',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p14,
  },
  {
    name: 'Dental Care',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p30,
  },
  {
    name: 'Hair Care',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p21,
  },
  {
    name: 'Skin Care',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p23,
  },
  {
    name: 'Sanitary Pads',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p18,
  },
  {
    name: 'Other Beauty Products',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p17,
  },
];
export const AccessoriesCategory = [
  {
    name: 'Books',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p25,
  },
  {
    name: 'Watches',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p26,
  },
  {
    name: 'Bags',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p27,
  },
  {
    name: 'Footwear',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p28,
  },
];
export const BabyCategory = [
  {
    name: 'Baby Oils',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p21,
  },
  {
    name: 'Baby Jellies',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p23,
  },
  {
    name: 'Baby Diapers',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p22,
  },
  {
    name: 'Baby Creams',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p20,
  },
  {
    name: 'Baby Wipes',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p24,
  },
  {
    name: 'Baby Powders',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p21,
  },
  {
    name: 'Baby Soaps',
    definedBy: 0,
    options: [],
    value: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
    image: p24,
  },
];
export const TabData6 = {
  categories: [
    {
      name: 'Food',
      imageSrc: p8,
      subCategories: [
        {
          name: 'Lotions & Creams',
          seller: 'Seller',
          description: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
          options: [
            {
              label: 'Edit this category',
              value: 1,
            },
            {
              label: 'Delete this category',
              value: 2,
            },
          ],
        },
      ],
    },
    {
      name: 'Food',
      imageSrc: p1,
      subCategories: [
        {
          name: 'Lotions & Creams',
          seller: 'Seller',
          description: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
          options: [
            {
              label: 'Edit this category',
              value: 1,
            },
            {
              label: 'Delete this category',
              value: 2,
            },
          ],
        },
        {
          name: 'Lotions & Creams',
          seller: 'Seller',
          description: 'Please add variants like 250g, 10kg, 500ml, and 5ltr.',
          options: [
            {
              label: 'Edit this category',
              value: 1,
            },
            {
              label: 'Delete this category',
              value: 2,
            },
          ],
        },
      ],
    },
  ],
  variantType: [],
  technicalInfo: [
    {
      reference: '646f1963711f0566eda86850',
      name: 'Inside Boxx',
      type: 2,
      enabled: false,
      answer: 'Charger',
      options: [],
    },
    {
      reference: '64703d55bfd4a22b1ab2f8a2',
      name: 'Product Warrantyy',
      type: 3,
      options: [
        {
          title: '1 years',
          _id: '646f1d85711f0566eda868b7',
        },
      ],
      enabled: false,
    },
    {
      reference: '64ccd04e4f44fbc5ebeb4a3a',
      name: 'OSs',
      type: 3,
      options: [
        {
          title: 'Android',
          _id: '64ccd04e4f44fbc5ebeb4a3c',
        },
      ],
      enabled: false,
    },
    {
      reference: '6501a8af71ca69828ae8a874',
      name: 'Charger Includes',
      type: 3,
      options: [
        {
          title: 'No',
          _id: '6501a9c371ca69828ae8a8c3',
        },
      ],
      enabled: false,
    },
    {
      reference: '6501a8c071ca69828ae8a888',
      name: 'Manufacturing datee',
      type: 1,
      enabled: false,
      answer: 'na',
      options: [],
    },
  ],
  media: [
    {
      url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1685941933374_6101393066665591.jpg',
      type: 1,
      index: 0,
      _id: '647d6ead7a27d92307287fe5',
    },
    {
      url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1686212347304_6005428021792540.jpg',
      type: 1,
      index: 1,
      _id: '64818efb7a27d9230728b089',
    },
  ],
  draft: false,
  active: true,
  versionKey: '64ccce974f44fbc5ebeb464b_1694610597423',
  _createdAt: '2023-08-04T10:10:31.405Z',
  _updatedAt: '2023-09-13T13:09:57.423Z',
  type: 'variant',
};
export const historyJSON = [
  {
    source: {
      type: 'd1',
    },
    _id: '64f082268a96aefdd8b48c0f',
    quantityTypes: [
      {
        type: 1,
        stockCount: 4,
      },
    ],
    _createdAt: '2023-08-31T12:05:58.268Z',
    type: 'inv-deb',
  },
  {
    source: {
      type: 'c4',
    },
    _id: '64df0dacf3885452a62ff970',
    quantityTypes: [
      {
        type: 1,
        stockCount: 1000,
      },
    ],
    _createdAt: '2023-08-18T06:20:28.636Z',
    type: 'inv-cred',
  },
];
export const stockJSON = [
  {
    batch: 1,
    expiry: '2023-08-30T06:20:09.000Z',
    quantityTypes: [
      {
        type: 1,
        credited: 1000,
        stockCount: 1000,
      },
    ],
    _createdAt: '2023-08-18T06:20:28.636Z',
    _id: '64df0dacf3885452a62ff96d',
  },
];
export const customerImages = {
  a1: require('../umart_admin/assets/media/avatars/300-1.jpg'),
  a2: require('../umart_admin/assets/media/avatars/300-10.jpg'),
  a3: require('../umart_admin/assets/media/avatars/300-11.jpg'),
  a4: require('../umart_admin/assets/media/avatars/300-5.jpg'),
  a5: require('../umart_admin/assets/media/avatars/300-6.jpg'),
  a6: require('../umart_admin/assets/media/avatars/300-3.jpg'),
  a7: require('../umart_admin/assets/media/avatars/300-13.jpg'),
  a8: require('../umart_admin/assets/media/avatars/300-4.jpg'),
  a9: require('../umart_admin/assets/media/avatars/300-16.jpg'),
  a10: require('../umart_admin/assets/media/avatars/300-9.jpg'),
};
export const customers = [
  {
    image: customerImages.a1,
    gmail: 'kathy.clark@mail.com',
    phoneNumber: '4567890',
    name: 'Kathy Clark',
    check: 'true',
    warehouse: '1',
    totalDeliveries: '6',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1975-12-10',
    totalVal: '80.65k',
    totalOrders: '165',
    averageOrder: '4',
    averageValue: '20.16k',
    date: '06/04/2023',
    totalProducts: 500,
    cancelOrders: 10,
    role: {
      label: 'Staff member',
      value: StaffMember,
    },
  },
  {
    image: customerImages.a2,
    gmail: 'patrickrichards@mail.com',
    phoneNumber: '6542210',
    name: 'Patrick Richards',
    check: 'false',
    warehouse: '1',
    totalDeliveries: '8',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1980-05-15',
    totalVal: '800.65k',
    totalOrders: '170',
    averageOrder: '7',
    averageValue: '114.38k',
    date: '06/04/2023',
    totalProducts: 800,
    cancelOrders: 5,
    role: {
      label: 'Warehouse admin',
      value: WarehouseAdmin,
    },
  },
  {
    image: customerImages.a3,
    gmail: 'alandiaz@mail.com',
    phoneNumber: '22334455',
    name: 'Alan Diaz',
    check: 'false',
    warehouse: '1',
    totalDeliveries: '5',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1992-08-22',
    totalVal: '70.65k',
    totalOrders: '25',
    averageOrder: '2',
    averageValue: '35.32k',
    date: '06/04/2023',
    totalProducts: 250,
    cancelOrders: 2,
    role: {
      label: 'Inventory manager',
      value: InventoryManager,
    },
  },
  {
    image: customerImages.a4,
    gmail: 'nancycooper@mail.com',
    phoneNumber: '8776655',
    name: 'Nancy Cooper',
    check: 'true',
    warehouse: '1',
    totalDeliveries: '14',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1975-12-10',
    totalVal: '120.65k',
    totalOrders: '95',
    averageOrder: '6',
    averageValue: '20.11k',
    date: '06/04/2023',
    totalProducts: 750,
    cancelOrders: 15,
    role: {
      label: 'Loading area manager',
      value: LoadingAreaManager,
    },
  },
  {
    image: customerImages.a5,
    gmail: 'tylergordan@mail.com',
    phoneNumber: '4332211',
    name: 'Tyler Gordon',
    check: 'true',
    warehouse: '1',
    totalDeliveries: '25',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1992-08-22',
    totalVal: '8210.65k',
    totalOrders: '105',
    averageOrder: '9',
    averageValue: '78.01k',
    date: '06/08/2023',
    totalProducts: 1500,
    cancelOrders: 20,
    role: {
      label: 'Finance manager',
      value: FinanceManager,
    },
  },
  {
    image: customerImages.a6,
    gmail: 'matthewpowell@mail.com',
    phoneNumber: '33445566',
    name: 'Matthew Powell',
    check: 'false',
    warehouse: '1',
    totalDeliveries: '23',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1975-12-10',
    totalVal: '60.65k',
    totalOrders: '45',
    averageOrder: '3',
    averageValue: '20.22k',
    date: '06/05/2023',
    totalProducts: 300,
    cancelOrders: 5,
    role: {
      label: 'Delivery Manager',
      value: DeliveryManager,
    },
  },
  {
    image: customerImages.a7,
    gmail: 'laurel.oliver@mail.com',
    phoneNumber: '99665544',
    name: 'Laurel Oliver',
    check: 'true',
    warehouse: '1',
    totalDeliveries: '10',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    totalVal: '40.65k',
    totalOrders: '15',
    averageOrder: '2',
    averageValue: '20.32k',
    date: '10/06/2023',
    totalProducts: 200,
    cancelOrders: 10,
    role: {
      label: 'Staff member',
      value: StaffMember,
    },
  },
  {
    image: customerImages.a8,
    gmail: 'denise.jones@mail.com',
    phoneNumber: '2334455',
    name: 'Denise Jones',
    check: 'false',
    warehouse: '1',
    totalDeliveries: '14',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1975-12-10',
    totalVal: '280.65k',
    totalOrders: '155',
    averageOrder: '8',
    averageValue: '35.08k',
    date: '12/08/2023',
    totalProducts: 775,
    cancelOrders: 12,
    role: {
      label: 'Warehouse admin',
      value: WarehouseAdmin,
    },
  },
  {
    image: customerImages.a9,
    gmail: 'bianca.ross@mail.com',
    phoneNumber: '8776655',
    name: 'Bianca Ross',
    check: 'false',
    warehouse: '1',
    totalDeliveries: '23',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1980-05-15',
    totalVal: '40.65k',
    totalOrders: '65',
    averageOrder: '6',
    averageValue: '6.77k',
    date: '19/07/2023',
    totalProducts: 325,
    cancelOrders: 8,
    role: {
      label: 'Inventory manager',
      value: InventoryManager,
    },
  },
  {
    image: customerImages.a10,
    gmail: 'aryan.clark@mail.com',
    phoneNumber: '4332211',
    name: 'Aryan Clark',
    check: 'true',
    warehouse: '1',
    totalDeliveries: '11',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    dateOfBirth: '1980-05-15',
  },
];
export const orderHistory = [
  {
    dateAndTime: '25/03/23 - 21:30',
    orderId: '#654',
    address: 'Pamba House, 2nd Floor, P.O. Box: 78166, Dar Es Salaam',
    amountCollected: [{ amount: 6550, type: 'Pre paid' }],
  },
  {
    dateAndTime: '25/03/23 - 22:15',
    orderId: '#655',
    address: '123 Main Street, Anytown',
    amountCollected: [{ amount: 7325, type: 'Post paid' }],
  },
  {
    dateAndTime: '25/03/23 - 23:00',
    orderId: '#656',
    address: '456 Elm Street, Othertown',
    amountCollected: [{ amount: 2360, type: 'COD' }],
  },
  {
    dateAndTime: '26/03/23 - 09:45',
    orderId: '#657',
    address: '789 Oak Street, Anycity',
    amountCollected: [{ amount: 8435, type: 'Post paid' }],
  },
  {
    dateAndTime: '26/03/23 - 10:30',
    orderId: '#658',
    address: '321 Cedar Street, Anothercity',
    amountCollected: [{ amount: 7750, type: 'COD' }],
  },
  {
    dateAndTime: '26/03/23 - 11:15',
    orderId: '#659',
    address: '654 Birch Street, Yetanothercity',
    amountCollected: [{ amount: 90, type: 'Pre paid' }],
  },
  {
    dateAndTime: '27/03/23 - 14:30',
    orderId: '#660',
    address: '987 Pine Street, Somewhereville',
    amountCollected: [{ amount: 5235, type: 'COD' }],
  },
  {
    dateAndTime: '27/03/23 - 15:15',
    orderId: '#661',
    address: '210 Maple Street, Nowhereville',
    amountCollected: [{ amount: 6145, type: 'Pre paid' }],
  },
  {
    dateAndTime: '27/03/23 - 16:00',
    orderId: '#662',
    address: '753 Spruce Street, Anyplace',
    amountCollected: [{ amount: 2380, type: 'Pre paid' }],
  },
  {
    dateAndTime: '28/03/23 - 10:00',
    orderId: '#663',
    address: '135 Redwood Street, Anotherplace',
    amountCollected: [{ amount: 7875, type: 'Post paid' }],
  },
];
export const driverImages = {
  a1: require('../umart_admin/assets/media/avatars/300-28.jpg'),
  a2: require('../umart_admin/assets/media/avatars/300-8.jpg'),
  a3: require('../umart_admin/assets/media/avatars/300-12.jpg'),
  a4: require('../umart_admin/assets/media/avatars/300-15.jpg'),
  a5: require('../umart_admin/assets/media/avatars/300-26.jpg'),
  a6: require('../umart_admin/assets/media/avatars/300-13.jpg'),
  a7: require('../umart_admin/assets/media/avatars/300-23.jpg'),
  a8: require('../umart_admin/assets/media/avatars/300-24.jpg'),
  a9: require('../umart_admin/assets/media/avatars/300-16.jpg'),
  a10: require('../umart_admin/assets/media/avatars/300-9.jpg'),
};
export const recentOrder = [
  {
    dateAndTime: '25/03/23 - 21:30',
    orderNumber: 'ORD9087654',
    totalUnits: 50,
    totalValue: 1200.5,
    paymentMode: 'Pre-Paid',
  },
  {
    customerName: 'Kathy Clark',
    deliveryPhone: '+555-222-5678',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '12/02/23 - 14:15',
    deliveryBy: '14/02/23 - 16:30',
    orderNumber: 'ORD7654321',
    totalUnits: 30,
    totalValue: 850.25,
    paymentMode: 'COD',
  },
  {
    customerName: 'Nancy Cooper',
    deliveryPhone: '+555-333-9876',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '03/01/23 - 09:45',
    deliveryBy: '06/01/23 - 10:00',
    orderNumber: 'ORD6543210',
    totalUnits: 25,
    totalValue: 550.75,
    paymentMode: 'Post-Paid',
  },
  {
    customerName: 'Alan Diaz',
    deliveryPhone: '+555-555-3456',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '05/11/22 - 08:00',
    deliveryBy: '08/11/22 - 10:30',
    orderNumber: 'ORD5432109',
    totalUnits: 40,
    totalValue: 950.6,
    paymentMode: 'Pre-Paid',
  },
  {
    dateAndTime: '05/11/22 - 08:00',
    orderNumber: 'ORD4321098',
    totalUnits: 60,
    totalValue: 1600.3,
    paymentMode: 'Post-Paid',
  },
  {
    customerName: 'Matthew Powell',
    deliveryPhone: '+555-666-4567',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '30/10/22 - 12:45',
    deliveryBy: '03/11/22 - 13:15',
    orderNumber: 'ORD3210987',
    totalUnits: 35,
    totalValue: 750.2,
    paymentMode: 'Pre-Paid',
  },
  {
    customerName: 'Tyler Gordon',
    deliveryPhone: '+555-777-7890',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '15/09/22 - 18:30',
    deliveryBy: '17/09/22 - 20:00',
    orderNumber: 'ORD2109876',
    totalUnits: 45,
    totalValue: 1100.75,
    paymentMode: 'COD',
  },
  {
    customerName: 'Barbara Mendoza',
    deliveryPhone: '+555-888-8901',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '02/08/22 - 10:15',
    deliveryBy: '05/08/22 - 11:45',
    orderNumber: 'ORD1098765',
    totalUnits: 55,
    totalValue: 1400.9,
    paymentMode: 'Post-Paid',
  },
  {
    customerName: 'Denise Jones',
    deliveryPhone: '+555-999-0123',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '20/07/22 - 14:50',
    deliveryBy: '23/07/22 - 16:00',
    orderNumber: 'ORD0987654',
    totalUnits: 65,
    totalValue: 1800.25,
    paymentMode: 'Pre-Paid',
  },
  {
    customerName: 'Laurel Oliver',
    deliveryPhone: '+555-123-4567',
    shippingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    districtAndCity: 'Kigamboni, Dar es Salaam',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '05/06/22 - 07:05',
    deliveryBy: '08/06/22 - 09:30',
    orderNumber: 'ORD9876543',
    totalUnits: 70,
    totalValue: 2000.75,
    paymentMode: 'Post-Paid',
  },
];
export const drivers = [
  {
    name: 'John Doe',
    orders: 12,
    value: 0,
    id: 0,
    image: driverImages.a1,
    label: (
      <>
        <img
          src={driverImages.a1}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">John Doe</span>
      </>
    ),
  },
  {
    name: 'Jane Smith',
    value: 1,
    orders: 7,
    id: 1,
    image: driverImages.a2,
    label: (
      <>
        <img
          src={driverImages.a2}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">Jane Smith</span>
      </>
    ),
  },
  {
    name: 'Bob Johnson',
    value: 2,
    orders: 10,
    id: 2,
    image: driverImages.a3,
    label: (
      <>
        <img
          src={driverImages.a3}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">Bob Johnson</span>
      </>
    ),
  },
  {
    name: 'Alice Brown',
    value: 3,
    orders: 4,
    id: 3,
    image: driverImages.a4,
    label: (
      <>
        <img
          src={driverImages.a4}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">Alice Brown</span>
      </>
    ),
  },
  {
    name: 'Eve Wilson',
    value: 4,
    orders: 6,
    id: 4,
    image: driverImages.a5,
    label: (
      <>
        <img
          src={driverImages.a5}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">Eve Wilson</span>
      </>
    ),
  },
  {
    name: 'Marry Johnson',
    value: 5,
    orders: 12,
    id: 5,
    image: driverImages.a6,
    label: (
      <>
        <img
          src={driverImages.a6}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">Marry Johnson</span>
      </>
    ),
  },
  {
    name: 'David Smith',
    value: 6,
    orders: 10,
    id: 6,
    image: driverImages.a7,
    label: (
      <>
        <img
          src={driverImages.a7}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">David Smith</span>
      </>
    ),
  },
  {
    name: 'Sarah Davis',
    value: 7,
    orders: 13,
    id: 7,
    image: driverImages.a8,
    label: (
      <>
        <img
          src={driverImages.a8}
          height={15}
          className="me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black">Sarah Davis</span>
      </>
    ),
  },
];
export const ProductDetails = {
  records: [
    {
      productImage: IMAGES.NutroWafer,
      productDescription: 'Nutro Wafer Biscuits (Chocolate, 75g)',
      productCompany: 'Wadsworth Distributors Limited',
      unitPrice: '53,000',
      sku: 'ZG011AQA',
      tax: '0 %',
      quantityType: '10',
      totalAmount: '1,007,000',
      loadingArea: 'A1',
      batch: '2 - 25/03/23',
      status: Packed,
    },
    {
      productImage: IMAGES.RollGum,
      productDescription: 'Amazon Roll Gum',
      productCompany: 'Super Meals Limited',
      unitPrice: '12,000',
      sku: 'ZG011AQA',
      tax: '0 %',
      quantityType: '25',
      totalAmount: '300,000',
      loadingArea: 'A2',
      batch: '3 - 08/04/23',
      status: NotPacked,
    },
    {
      productImage: IMAGES.AmazonMonstaPops,
      productDescription: 'Amazon Monsta Pops (Strawberry)',
      productCompany: 'MacLeans BeneCIBO Limited',
      unitPrice: '9,500',
      sku: 'ZG011AQA',
      tax: '0 %',
      quantityType: '15',
      totalAmount: '142,500',
      loadingArea: 'A1',
      batch: '2 - 11/09/23',
      status: Packed,
    },
    {
      productImage: IMAGES.FreedomPen,
      productDescription: 'Freedom Ball Pen',
      productCompany: 'Afribon',
      unitPrice: '1,150',
      sku: 'ZG011AQA',
      quantityType: '100',
      totalAmount: '115,000',
      loadingArea: 'A3',
      tax: '0 %',
      batch: '2 - 24/07/23',
      status: NotPacked,
    },
  ],
  subTotal: '2,294,500',
  tax: '0',
  grandTotal: '2,404,500',
  platformFee: '110,000',
};
export const orderDetailsJSON = {
  customer: {
    business: {
      name: 'Kathy',
      district: '651d5fa8317c6e0dcdcd8fa1',
      districtName: 'UpCountry',
      types: [
        {
          reference: '64898c0adf1704f81121545d',
          title: 'Distributors',
        },
      ],
    },
    reference: '652fb630316408e5b267b034',
    name: 'Kathy',
  },
  address: {
    reference: '652fb6d9316408e5b267c5bd',
    name: 'Arusha',
    phoneCountry: '+255',
    phone: '905682365',
    addressLine1: 'Arusha Airport, Arusha, Tanzania',
    addressLine2: '',
    district: '651d5fa8317c6e0dcdcd8fa1',
    districtName: 'UpCountry',
    lat: -3.368027,
    lng: 36.6248952,
    city: 'Arusha',
  },
  placedBy: {
    user: {
      reference: '652fb630316408e5b267b034',
      userType: 1,
      name: 'Kathy',
    },
    type: 1,
  },
  payment: {
    completed: true,
    subCharge: 500,
    remainingCharge: 0,
    totalCharge: 400,
    receivedCharge: 1000,
    paymentMode: 2,
    productsDiscount: 0,
    discounts: [
      {
        type: 1,
        value: 100,
        appliedCharge: 100,
      },
    ],
    taxes: [
      {
        type: 2,
        appliedCharge: 0,
      },
    ],
    adjustmentTransactions: [
      {
        adjustor: {
          user: {
            reference: '6403ad0afb4e3474b550a5c3',
            userType: 2,
            name: 'Aunali M Abdulrazak',
          },
          type: 3,
        },
        completed: true,
        transactionId: 'O0O0O0',
        phoneCountry: '',
        phone: '',
        completedAt: '2023-10-18T12:01:12.752Z',
        charge: 600,
        paymentMethod: 2,
        _id: '652fc908316408e5b2683616',
      },
    ],
    transactions: [
      {
        completedAt: '2023-10-18T11:40:52.245Z',
        charge: 1000,
        paymentMethod: 2,
      },
    ],
    creationDateTime: '2023-10-18T11:40:51.663Z',
    transactionId: 'LNVOMGT2-19841652',
    transactionStatus: 2,
    transactionCode: 'Purchase-3008-0000-S',
    completedAt: '2023-10-18T11:40:52.245Z',
    adjustmentCharge: 600,
    adjusted: true,
  },
  commission: {
    charge: 0,
    charged: false,
  },
  _id: '652fbab6316408e5b267f22d',
  refKey: 'O4619',
  variants: [
    {
      business: '65055384523a991acbbda5c8',
      variant: {
        product: {
          business: {
            reference: '65055384523a991acbbda5c8',
            name: 'Crystal Collection',
          },
          reference: '65057191523a991acbbdc23b',
          title: 'Product with multiple color for route planning',
        },
        _id: '65057191523a991acbbdc253',
        refKey: 'V0088',
        title: 'Product with multiple color for route planning (Drak Green )',
        variantType: [
          {
            reference: '65055bf9523a991acbbdadb5',
            option: 'Drak Green ',
          },
        ],
        media: [
          {
            url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1694855569797_8814647905832629.jpg',
            type: 1,
            index: 0,
            _id: '65057191523a991acbbdc252',
          },
        ],
        type: 'variant',
      },
      quantityType: 2,
      totalWeight: 28.5,
      initialStockCount: 10,
      stockCount: 5,
      amount: 100,
      totalAmount: 500,
      taxFree: true,
      beforeTaxAmount: 0,
      commission: 0,
      commissionAmount: 0,
      originalAmount: 100,
    },
  ],
  totalProducts: 1,
  orderedQuantities: 5,
  status: 1,
  statusUpdatedAt: '2023-10-18T12:00:22.478Z',
  statusesLogs: [
    {
      status: 1,
      statusUpdatedAt: '2023-10-18T11:00:06.444Z',
      _id: '652fbab6316408e5b267f236',
    },
    {
      _id: '652fc8c7316408e5b2683586',
      status: 2,
      statusUpdatedAt: '2023-10-18T12:00:07.006Z',
    },
    {
      _id: '652fc8d6316408e5b26835db',
      status: 4,
      statusUpdatedAt: '2023-10-18T12:00:22.478Z',
    },
  ],
  currency: 1,
  version: 1,
  otp: '8331',
  _createdAt: '2023-10-18T11:00:06.444Z',
  _updatedAt: '2023-10-18T11:59:07.845Z',
  routesVehicles: [
    {
      paymentCollection: {
        payment: {
          remainingCharge: 0,
          totalCharge: 400,
          receivedCharge: 1000,
          paymentMode: 2,
          adjustmentCharge: 600,
          adjusted: false,
        },
        type: 2,
        totalCashCollection: 0,
        pendingCashCollection: 0,
      },
      route: '652fc8c6316408e5b268357a',
      routeVehicle: {
        vehicle: {
          name: 'Yash',
          number: '1212',
          image:
            'http://u-trade-dev.s3.af-south-1.amazonaws.com/vehicle/1697535746753_3019411958007814.jpg',
        },
        driver: {
          name: 'ABC Driver',
        },
        _id: '652fc8c7316408e5b2683584',
      },
      vehicle: '652e5702ee7025ad346094b5',
      status: 3,
      statusUpdatedAt: '2023-10-18T12:00:22.478Z',
      statusesLogs: [
        {
          statusUpdatedBy: {
            userType: 2,
          },
          _id: '652fc8c7316408e5b2683587',
          status: 1,
          statusUpdatedAt: '2023-10-18T12:00:07.006Z',
        },
        {
          statusUpdatedBy: {
            user: '6403ad0afb4e3474b550a5c3',
            userType: 3,
          },
          status: 2,
          statusUpdatedAt: '2023-10-18T12:00:16.613Z',
          _id: '652fc8d0316408e5b26835be',
        },
        {
          statusUpdatedBy: {
            user: '6403ad0afb4e3474b550a5c3',
            userType: 3,
          },
          _id: '652fc8d6316408e5b26835db',
          status: 3,
          statusUpdatedAt: '2023-10-18T12:00:22.478Z',
        },
      ],
      otp: '1234',
      variants: [
        {
          variant: {
            product: {
              business: {
                reference: '65055384523a991acbbda5c8',
                name: 'Crystal Collection',
              },
              reference: '65057191523a991acbbdc23b',
              title: 'Product with multiple color for route planning',
            },
            _id: '65057191523a991acbbdc253',
            refKey: 'V0088',
            title:
              'Product with multiple color for route planning (Drak Green )',
            variantType: [
              {
                reference: '65055bf9523a991acbbdadb5',
                option: 'Drak Green ',
              },
            ],
            media: [
              {
                url: 'http://u-trade-dev.s3.af-south-1.amazonaws.com/products/media/1694855569797_8814647905832629.jpg',
                type: 1,
                index: 0,
                _id: '65057191523a991acbbdc252',
              },
            ],
            type: 'variant',
          },
          quantityType: 2,
          stockCount: 5,
          amount: 100,
          originalAmount: 100,
          totalAmount: 500,
        },
      ],
      processedQuantities: 5,
    },
  ],
  modification: {
    modified: true,
    user: '6403ad0afb4e3474b550a5c3',
    userType: 2,
    date: '2023-10-18T11:59:07.845Z',
  },
  remainingVariants: [],
  hasPartialDelivery: false,
};
export const deliveriesJSON = [
  {
    driverImage: driverImages.a1,
    customerName: 'Patrick Richards',
    deliveryPhone: '+555-111-1234',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '25/03/2023',
    deliveryBy: '30/03/23 - 15:45',
    orderNumber: '9087654',
    totalUnits: 50,
    totalValue: '120,081,02',
    paymentMode: 'Tigo pesa',
    totalOrders: '79',
    status: '68',
    statusDetail: '6/8',
    totalUsers: '23',
    totalProducts: '34',
    vehicleNumber: 'T 772 BBE',
    weight: '1.0',
  },
  {
    driverImage: driverImages.a2,
    customerName: 'Kathy Clark',
    deliveryPhone: '+555-222-5678',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '12/02/2023',
    deliveryBy: '14/02/23 - 16:30',
    orderNumber: '7654321',
    totalUnits: 30,
    totalValue: '850,25,182',
    paymentMode: 'Cash',
    totalOrders: '34',
    status: '28',
    statusDetail: '2/8',
    totalUsers: '23',
    totalProducts: '45',
    vehicleNumber: 'T 940 ASW',
    weight: '0.8',
  },
  {
    driverImage: driverImages.a3,
    customerName: 'Nancy Cooper',
    deliveryPhone: '+555-333-9876',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '03/01/2023',
    deliveryBy: '06/01/23 - 10:00',
    orderNumber: '6543210',
    totalUnits: 25,
    totalValue: '550,751,121',
    paymentMode: 'Cash',
    totalOrders: '87',
    status: '85',
    statusDetail: '8/5',
    totalUsers: '9',
    totalProducts: '76',
    vehicleNumber: 'T 231 ERC',
    weight: '1.0',
  },
  {
    driverImage: driverImages.a4,
    customerName: 'Alan Diaz',
    deliveryPhone: '+555-444-2345',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '18/12/2023',
    deliveryBy: '21/12/22 - 14:15',
    orderNumber: '5432109',
    totalUnits: 40,
    totalValue: '950,621,121',
    paymentMode: 'Tigo pesa',
    totalOrders: '34',
    status: '30',
    statusDetail: '0/3',
    totalUsers: '9',
    totalProducts: '36',
    vehicleNumber: 'T 874 KYR',
    weight: '1.0',
  },
  {
    driverImage: driverImages.a5,
    customerName: 'Alan Diaz',
    deliveryPhone: '+555-555-3456',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '05/11/2023',
    deliveryBy: '08/11/22 - 10:30',
    orderNumber: '4321098',
    totalUnits: 60,
    totalValue: '16,001,312',
    paymentMode: 'Cash',
    totalOrders: '65',
    status: '60',
    statusDetail: '5/6',
    totalUsers: '15',
    totalProducts: '50',
    vehicleNumber: 'T 127 SEW',
    weight: '0.7',
  },
  {
    driverImage: driverImages.a6,
    customerName: 'Matthew Powell',
    deliveryPhone: '+555-666-4567',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '30/10/2023',
    deliveryBy: '03/11/22 - 13:15',
    orderNumber: '3210987',
    totalUnits: 35,
    totalValue: '750,122,122',
    paymentMode: 'Tigo pesa',
    totalOrders: '23',
    status: '18',
    statusDetail: '1/8',
    totalUsers: '23',
    totalProducts: '30',
    vehicleNumber: 'T 940 AGY',
    weight: '0.8',
  },
  {
    driverImage: driverImages.a7,
    customerName: 'Tyler Gordon',
    deliveryPhone: '+555-777-7890',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '15/09/2023',
    deliveryBy: '17/09/22 - 20:00',
    orderNumber: '2109876',
    totalUnits: 45,
    totalValue: '11,00,7125',
    paymentMode: 'Cash',
    totalOrders: '26',
    status: '25',
    statusDetail: '2/5',
    totalUsers: '12',
    totalProducts: '19',
    vehicleNumber: 'T 258 NIE',
    weight: '1.0',
  },
  {
    driverImage: driverImages.a8,
    customerName: 'Barbara Mendoza',
    deliveryPhone: '+555-888-8901',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '02/08/2023',
    deliveryBy: '05/08/22 - 11:45',
    orderNumber: '1098765',
    totalUnits: 55,
    totalValue: '14,00,912,12',
    paymentMode: 'Cash',
    totalOrders: '54',
    status: '48',
    statusDetail: '4/8',
    totalUsers: '23',
    totalProducts: '38',
    vehicleNumber: 'T 954 LQD',
    weight: '0.8',
  },
  {
    driverImage: driverImages.a9,
    customerName: 'Denise Jones',
    deliveryPhone: '+555-999-0123',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '20/07/2023',
    deliveryBy: '23/07/22 - 16:00',
    orderNumber: '0987654',
    totalUnits: 65,
    totalValue: '1812,00,25',
    paymentMode: 'Tigo pesa',
    totalOrders: '16',
    status: '15',
    statusDetail: '1/5',
    totalUsers: '10',
    totalProducts: '29',
    vehicleNumber: 'T 804 BBF',
    weight: '0.7',
  },
  {
    driverImage: driverImages.a10,
    customerName: 'Laurel Oliver',
    deliveryPhone: '+555-123-4567',
    billingAddress: 'Kibada St, Dar es Salaam, Tanzania',
    dateAndTime: '05/06/2023',
    deliveryBy: '08/06/22 - 09:30',
    orderNumber: '9876543',
    totalUnits: 70,
    totalValue: '20,007,225',
    paymentMode: 'Cash',
    totalOrders: '12',
    status: '10',
    statusDetail: '3/8',
    totalUsers: '10',
    totalProducts: '15',
    vehicleNumber: 'T 940 AGY',
    weight: '1.0',
  },
];
export const faqsJSON = [
  {
    question: 'What payment methods are accepted?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  },
];
export const ContactJSON = [
  {
    _id: '6486cc47717bfeee65639710',
    user: {
      name: 'Trading Business',
    },
    message: 'Can you share reason for rejection',
    type: 'bft1',
    _createdAt: '2023-06-12T07:41:59.534Z',
  },
  {
    _id: '648c27eba64cdc7175facb79',
    user: {
      name: 'Dharmesh Pandya',
    },
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    type: 'bft1',
    _createdAt: '2023-06-16T09:14:19.834Z',
  },
  {
    _id: '648c5a07fb5699f626941511',
    user: {
      name: 'Rahul',
    },
    message: 'can i know the reason',
    type: 'bft1',
    _createdAt: '2023-06-16T12:48:07.193Z',
  },
  {
    _id: '64d3915d54d458f512625582',
    user: {
      name: 'New Seller',
    },
    message: 'why my acc was rejected please recheck',
    type: 'bft1',
    _createdAt: '2023-08-09T13:15:09.867Z',
    role: {
      label: 'Loading area manager',
      value: LoadingAreaManager,
    },
  },
];
export const Brands = [
  {
    name: 'Customer',
    permission: [{ type: 'View' }],
  },
  {
    name: 'Orders & delivery',
    permission: [
      { type: 'View' },
      { type: 'Add' },
      { type: 'Edit' },
      { type: 'Delete' },
    ],
  },
  {
    name: 'All products',
    permission: [{ type: 'View' }],
  },
  {
    name: 'Inventory',
    permission: [
      { type: 'View' },
      { type: 'Add' },
      { type: 'Edit' },
      { type: 'Delete' },
    ],
  },
  {
    name: 'Master',
    permission: [{ type: 'View' }],
  },
];
export const AddRoleJSON = [
  { title: 'View', value: '1' },
  { title: 'Add', value: '2' },
  { title: 'Edit', value: '3' },
  { title: 'Delete', value: '4' },
  { title: 'All', value: '5' },
];
export const RolePermissionsJSON = [
  {
    module: 'Customer',
    permissions: [
      { title: 'View', value: '1' },
      { title: 'Add', value: '2' },
      { title: 'Edit', value: '3' },
      { title: 'Delete', value: '4' },
      { title: 'All', value: '5' },
    ],
  },
  {
    module: 'Orders',
    permissions: [
      { title: 'View', value: '1' },
      { title: 'Add', value: '2' },
      { title: 'Edit', value: '3' },
      { title: 'Delete', value: '4' },
      { title: 'All', value: '5' },
    ],
  },
  {
    module: 'Products',
    permissions: [
      { title: 'View', value: '1' },
      { title: 'Add', value: '2' },
      { title: 'Edit', value: '3' },
      { title: 'Delete', value: '4' },
      { title: 'All', value: '5' },
    ],
  },
  {
    module: 'Inventory',
    permissions: [
      { title: 'View', value: '1' },
      { title: 'Add', value: '2' },
      { title: 'Edit', value: '3' },
      { title: 'Delete', value: '4' },
      { title: 'All', value: '5' },
    ],
  },
  {
    module: 'Master',
    permissions: [
      { title: 'View', value: '1' },
      { title: 'Add', value: '2' },
      { title: 'Edit', value: '3' },
      { title: 'Delete', value: '4' },
      { title: 'All', value: '5' },
    ],
  },
];
export const rolePermissions = [
  {
    module: 'Customers',
    value: Customer,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Outward Reports',
    value: OutWardReports,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Return Product Reports',
    value: ReturnProductReports,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Pending Refund Reports',
    value: RefundReportConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Orders & delivery',
    value: Order,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'All Products',
    value: Product,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'All Recipes',
    value: AllRecipesConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Goods In Warehouse',
    value: GoodsInWarehouseConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add / Edit', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Goods Requests',
    value: GoodsRequestConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add / Edit', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Return Requests',
    value: ReturnRequestConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Low Stock List',
    value: LowStockConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Promotion Campaign',
    value: Promotion,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Categories',
    value: Category,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Brands',
    value: Brand,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Product variants',
    value: ProductVariant,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Product Zone',
    value: ProductZoneConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  // {
  //   module: 'Roles & Permission',
  //   value: RolePermissions,
  //   permissions: [
  //     { title: 'All', value: All },
  //     { title: 'View / List', value: View },
  //     { title: 'Add', value: Add },
  //     { title: 'Edit', value: Edit },
  //     { title: 'Delete', value: Delete },
  //   ],
  // },
  // {
  //   module: 'User Management',
  //   value: UserManagement,
  //   permissions: [
  //     { title: 'All', value: All },
  //     { title: 'View / List', value: View },
  //     { title: 'Add', value: Add },
  //     { title: 'Edit', value: Edit },
  //     { title: 'Delete', value: Delete },
  //   ],
  // },
  {
    module: 'Warehouse products zone',
    value: WarehouseZone,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Delivery Users',
    value: DeliveryUser,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Pickers',
    value: PickerConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Sales Reports',
    value: SalesReportsConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Customer Purchase Behavior Analysis Report',
    value: CustomerPurchaseBehaviourReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Geographic Sales Insights Report',
    value: GeographicSalesInsightReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Frequent Customer Purchase Pattern Analysis Report',
    value: FrequentCustomerPurchasePatternAnalysisReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Product Sales Performance Report',
    value: ProductSalesPerformanceReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Brand-Wise Sales Performance Report',
    value: BrandWiseSalesPerformanceReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Category and Sub-Category Sales Analysis Report',
    value: CategoryAndSubCategoryAnalysisReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Revenue Generation Report',
    value: RevenueGenerationReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Product Variant Inventory Status Report',
    value: InventoryStatusReport,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Download', value: Download },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Order Anything',
    value: SuggestProductConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'General settings',
    value: GeneralSettings,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Banner Management',
    value: BannerConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'App Settings',
    value: AppSettingsConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Custom Notification',
    value: CustomNotificationConst,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      // { title: 'Delete', value: Delete },
    ],
  },
  {
    module: 'Contact enquires',
    value: ContactEnquiries,
    permissions: [
      { title: 'All', value: All },
      { title: 'View / List', value: View },
      // { title: 'Add', value: Add },
      // { title: 'Edit', value: Edit },
      { title: 'Delete', value: Delete },
    ],
  },
];
export const wareHouseProductJSon = [
  {
    name: 'Product1',
    title: 'PRoduct1',
    _id: 'p1',
  },
  {
    name: 'Product4',
    title: 'PRoduct4',
    _id: 'p4',
  },
  {
    name: 'Product3',
    title: 'PRoduct3',
    _id: 'p3',
  },
  {
    name: 'Product2',
    title: 'PRoduct2',
    _id: 'p2',
  },
];
export const goodsRequestsJson = [
  {
    _id: '1',
    warhouse: 'U Trade warehouse',
    createdAt: '19/09/2023',
    createdBy: {
      name: 'Michle hussey',
      role: 'Sub-admin',
      userType: 2,
    },
    quntity: {
      stockCount: 150,
    },
    products: [
      {
        name: 'Good day biscuit',
        image: '',
        stockCount: 30,
      },
    ],
  },
  {
    _id: '2',
    warhouse: 'U Trade warehouse',
    createdAt: '19/09/2023',
    createdBy: {
      name: 'Michle hussey',
      role: 'Sub-admin',
      userType: 2,
    },
    quntity: {
      stockCount: 150,
    },
    products: [
      {
        name: 'Good day biscuit',
        image: '',
        stockCount: 30,
      },
    ],
  },
  {
    _id: '3',
    warhouse: 'U Trade warehouse',
    createdAt: '19/09/2023',
    createdBy: {
      name: 'Michle hussey',
      role: 'Sub-admin',
      userType: 2,
    },
    quntity: {
      stockCount: 150,
    },
    products: [
      {
        name: 'Good day biscuit',
        image: '',
        stockCount: 30,
      },
    ],
  },
  {
    _id: '4',
    warhouse: 'U Trade warehouse',
    createdAt: '19/09/2023',
    createdBy: {
      name: 'Michle hussey',
      role: 'Sub-admin',
      userType: 2,
    },
    quntity: {
      stockCount: 150,
    },
    products: [
      {
        name: 'Good day biscuit',
        image: '',
        stockCount: 30,
      },
    ],
  },
];
export const goodsRequestDetailsJson = [
  {
    variant: {
      title: 'I phone 13 edited',
      media: [
        {
          url: 'http://umart-development.s3.af-south-1.amazonaws.com/products/media/1707109230113_724615280543455.jpeg',
        },
      ],
      product: {
        title: 'I Phone 12 pro max',
      },
      skuNumber: 'DGS43654',
    },
    stockCount: 33,
  },
  {
    variant: {
      title: 'I phone 13 edited',
      skuNumber: 'DGS43654',
      media: [
        {
          url: 'http://umart-development.s3.af-south-1.amazonaws.com/products/media/1707109230113_724615280543455.jpeg',
        },
      ],
      product: {
        title: 'I Phone 12 pro max',
      },
    },
    stockCount: 335,
  },
  {
    variant: {
      title: 'I phone 13 edited',
      skuNumber: 'DGS43654',
      media: [
        {
          url: 'http://umart-development.s3.af-south-1.amazonaws.com/products/media/1707109230113_724615280543455.jpeg',
        },
      ],
      product: {
        title: 'I Phone 12 pro max',
      },
    },
    stockCount: 644,
  },
];
export const ReturnRequestsJson = [
  {
    date: '20/04/2023',
    id: '#0004',
    createdAt: '22/04/2023',
    deliveryUser: {
      name: 'Kane Williamson',
      image:
        'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    },
    items: 3,
    reason:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the re',
  },
  {
    date: '20/04/2023',
    id: '#0005',
    createdAt: '22/04/2023',
    deliveryUser: {
      name: 'Kane Williamson',
      image:
        'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    },
    items: 3,
    reason:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the re',
  },
  {
    date: '20/04/2023',
    id: '#0006',
    createdAt: '22/04/2023',
    deliveryUser: {
      name: 'Kane Williamson',
      image:
        'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    },
    items: 3,
    reason:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the re',
  },
];
export const returnDetailsJson = [
  {
    name: 'Amazon Monsta Pops (Strawberry)',
    sku: 'SKU: ZG011AQA',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    price: 1000,
    units: 33,
    batch: 'Batch 1 - 12/03/23',
  },
  {
    name: 'Amazon Monsta Pops (Strawberry)',
    sku: 'SKU: ZG011AQA',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    price: 1000,
    units: 33,
    batch: 'Batch 1 - 12/03/23',
  },
  {
    name: 'Amazon Monsta Pops (Strawberry)',
    sku: 'SKU: ZG011AQA',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    price: 1000,
    units: 33,
    batch: 'Batch 1 - 12/03/23',
  },
];
export const markAsArrivedJson = {
  customer: {
    reference: '656ebb401d54c98648a1326b',
    name: 'Keyur',
  },
  address: {
    reference: '659cdd7def0fd8ab200c2f1e',
    name: 'H',
    phoneCountry: '+255',
    phone: '888888881',
    addressLine1: 'WMQ9+29R, Moi Ave, Mombasa, Kenya',
    addressLine2: 'undefined',
    lat: -4.0623802,
    lng: 39.6683831,
    city: '',
    district: '6566f552d76c267ab914b8fc',
    districtName: 'Kinondoni',
    addressType: 1,
  },
  placedBy: {
    user: {
      reference: '656ebb401d54c98648a1326b',
      name: 'Keyur',
    },
  },
  payment: {
    completed: false,
    transactionId: '65a7afb3cd7698052fcdbe2e',
    subCharge: 1499,
    remainingCharge: 6163,
    totalCharge: 6163,
    totalDistanceCharge: 4663,
    distanceCharge: 1,
    receivedCharge: 0,
    platformFee: 1,
    paymentMode: 1,
    taxes: [
      {
        type: 2,
        appliedCharge: 29.98,
      },
    ],
    adjustmentTransactions: [],
    transactions: [],
  },
  _id: '65a7afb3cd7698052fcdbe2e',
  refKey: 'O0256',
  variants: [
    {
      variant: {
        product: {
          reference: '6566f460d76c267ab914b7f0',
          title: 'Allen Solly Shirts for men',
        },
        _id: '6566f460d76c267ab914b7f8',
        refKey: 'V0002',
        title: 'Allen Solly Shirts for men (Black)',
        variantType: [
          {
            reference: '6566f3ead76c267ab914b79f',
            option: 'Black ',
          },
        ],
        media: [
          {
            url: 'http://umart-development.s3.af-south-1.amazonaws.com/products/media/1701246048632_4657495428338631.jpg',
            type: 1,
            index: 0,
            _id: '6566f460d76c267ab914b7f7',
            thumbnailUrl: '',
          },
        ],
        skuNumber: 'ALNSLY001',
        type: 'variant',
      },
      quantityType: 1,
      stockCount: 1,
      amount: 1499,
      totalAmount: 1499,
      taxFree: false,
      productTax: 2,
      beforeTaxAmount: 29.98,
      originalAmount: 1499,
    },
  ],
  totalProducts: 1,
  orderedQuantities: 1,
  status: 2,
  statusUpdatedAt: '2024-01-17T10:45:07.134Z',
  statusesLogs: [
    {
      status: 1,
      statusUpdatedAt: '2024-01-17T10:45:07.060Z',
      _id: '65a7afb3cd7698052fcdbe38',
    },
    {
      _id: '65a7afb3cd7698052fcdbe5a',
      status: 2,
      statusUpdatedAt: '2024-01-17T10:45:07.134Z',
    },
  ],
  currency: 1,
  version: 1,
  otp: '1218',
  _createdAt: '2024-01-17T10:45:07.060Z',
  _updatedAt: '2024-02-13T21:10:01.815Z',
  returnedVariants: [],
  routesUsers: [
    {
      deliveryUser: {
        reference: '656db80f1d54c98648a09b81',
        name: 'Milan Patel',
        phone: '888888881',
        phoneCountry: '+255',
        image:
          'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1701689359174_6085689923085430.jpg',
        vehicleNumber: 'GJ01HJ2345',
      },
      statusUpdatedBy: {
        user: '65cbdaa818f936e4e8a80a38',
        userType: 2,
      },
      paymentCollection: {
        payment: {
          remainingCharge: 6163,
          totalCharge: 6163,
          receivedCharge: 0,
          paymentMode: 1,
        },
        type: 2,
        totalCashCollection: 6163,
        pendingCashCollection: 0,
      },
      partialDelivery: false,
      route: '65cbdaa818f936e4e8a80a37',
      routeUser: '65a7afb3cd7698052fcdbe58',
      status: 2,
      statusUpdatedAt: '2024-02-13T21:10:01.815Z',
      statusesLogs: [
        {
          statusUpdatedBy: {
            userType: 2,
          },
          _id: '65a7afb3cd7698052fcdbe5b',
          status: 1,
          statusUpdatedAt: '2024-01-17T10:45:07.134Z',
        },
        {
          statusUpdatedBy: {
            user: '6566eb8e336e04a4cc8d7b44',
            userType: 3,
          },
          status: 2,
          statusUpdatedAt: '2024-02-02T10:43:48.965Z',
          _id: '65bcc764ffd021114e970e10',
        },
      ],
      otp: '0493',
      variants: [
        {
          product: '6566f460d76c267ab914b7f0',
          variant: {
            product: {
              reference: '6566f460d76c267ab914b7f0',
              title: 'Allen Solly Shirts for men',
            },
            _id: '6566f460d76c267ab914b7f8',
            refKey: 'V0002',
            title: 'Allen Solly Shirts for men (Black)',
            variantType: [
              {
                reference: '6566f3ead76c267ab914b79f',
                option: 'Black ',
              },
            ],
            media: [
              {
                url: 'http://umart-development.s3.af-south-1.amazonaws.com/products/media/1701246048632_4657495428338631.jpg',
                type: 1,
                index: 0,
                _id: '6566f460d76c267ab914b7f7',
                thumbnailUrl: '',
              },
            ],
            skuNumber: 'ALNSLY001',
            type: 'variant',
          },
          quantityType: 1,
          clonedRef: '6566f460d76c267ab914b7f8_1701246048612',
          stockCount: 1,
          status: 2,
          statusUpdatedAt: '2024-02-02T10:43:44.668Z',
          statusesLogs: [
            {
              _id: '65a7afb3cd7698052fcdbe59',
              status: 1,
              statusUpdatedAt: '2024-01-17T10:45:07.134Z',
            },
            {
              status: 2,
              statusUpdatedAt: '2024-02-02T10:43:44.668Z',
              _id: '65bcc760ffd021114e970e0a',
            },
          ],
          batches: [
            {
              batch: 1,
              expiry: '2024-07-31T08:21:05.000Z',
              quantityType: 1,
              stockCount: 1,
              _createdAt: '2024-01-19T11:30:15.760Z',
            },
          ],
          fullyConsumed: true,
          amount: 1499,
          originalAmount: 1499,
          totalAmount: 1499,
        },
      ],
      orderSequence: 1,
      processedQuantities: 1,
      batchesAssigned: true,
      sequenceDate: '2024-02-14T09:52:55.158Z',
    },
  ],
  remainingVariants: [],
  hasPartialDelivery: false,
};
export const product2JSON = [
  {
    name: 'Nutro Vanilla Waffer Cream Biscuit',
    title: 'Nutro Vanilla Waffer Cream Biscuit',
    value: 0,
    id: 0,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">
          Nutro Vanilla Waffer Cream Biscuit
        </span>
      </>
    ),
  },
  {
    name: 'Nutro Orange Cream Wafers - Pack of 2',
    title: 'Nutro Orange Cream Wafers - Pack of 2',
    value: 1,
    id: 1,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={11}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">
          Nutro Orange Cream Wafers-Pack of 2
        </span>
      </>
    ),
  },
  {
    name: 'Nutro Hazelnuts Wafer Cream Biscuits',
    title: 'Nutro Hazelnuts Wafer Cream Biscuits',
    value: 2,
    id: 2,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={11}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">
          Nutro Hazelnuts Wafer Cream Biscuits
        </span>
      </>
    ),
  },
  {
    name: 'Nutro Chocolate Cream Wafers (Pack of 2)',
    title: 'Nutro Chocolate Cream Wafers (Pack of 2)',
    value: 3,
    id: 3,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={11}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">
          Nutro Chocolate Cream Wafers(Pack of 2)
        </span>
      </>
    ),
  },
];
export const bannersListJson = [
  {
    title: 'Home page',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    impression: 100,
    clicks: 33,
    active: true,
    _id: '1',
  },
  {
    title: 'Category page',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    impression: 43,
    clicks: 43,
    active: true,
    _id: '2',
  },
  {
    title: 'Home page',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    impression: 21,
    clicks: 33,
    active: false,
    _id: '3',
  },
  {
    title: 'Brand',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    impression: 45,
    clicks: 23,
    active: true,
    _id: '4',
  },
  {
    title: 'Home page',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    impression: 65,
    clicks: 33,
    active: false,
    _id: '5',
  },
  {
    title: 'Category page',
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1702535350557_2140635270114807.jpg',
    impression: 56,
    clicks: 33,
    active: true,
    _id: '6',
  },
];
export const reviewJson = [
  {
    _id: '1',
    name: 'Cathy Clark',
    review:
      'Forever acceptable and agreeable by all ages. Lots of memories attached and still building.',
    ratings: 4.5,
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1710996726342_218774159663849.jpeg',
  },
  {
    _id: '2',
    name: 'Mike hussey',
    review:
      'Experience heavenly bliss like never before with Sunfeast Dark Fantasy Choco Fills. With every bite of this delectable cookie, you’ll find yourself deeper into an indulgent fantasy. So, take a bite and you can turn on the Din Khatam, Fantasy Shuru mode. Take a trip down the indulgence lane with Dark Fantasy Choco Fills as it is a concoction of pure delight.',
    ratings: 2.0,
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1710996726342_218774159663849.jpeg',
  },
  {
    _id: '3',
    name: 'Tony starc ',
    review:
      'Forever acceptable and agreeable by all ages. Lots of memories attached and still building.',
    ratings: 4.5,
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1710996726342_218774159663849.jpeg',
  },
  {
    _id: '4',
    name: 'Tony starc ',
    review:
      'Forever acceptable and agreeable by all ages. Lots of memories attached and still building.',
    ratings: 2.1,
    image:
      'http://umart-development.s3.af-south-1.amazonaws.com/deliveryBoy/users/1710996726342_218774159663849.jpeg',
  },
];
export const promotionsJson = [
  {
    image: Nitro,
    title: 'On first purchase',
    promotionType: 1,
    endDate: '17/08/2023',
    active: true,
    _id: '1',
  },
  {
    image: Nitro,
    title: 'Summer Sale 20',
    promotionType: 3,
    endDate: '11/08/2023',
    active: true,
    _id: '2',
  },
  {
    image: Nitro,
    title: 'Snap Savings',
    promotionType: 2,
    endDate: '14/08/2023',
    active: false,
    _id: '3',
  },
  {
    image: Nitro,
    title: 'On first purchase',
    promotionType: 2,
    endDate: '21/08/2023',
    active: true,
    _id: '4',
  },
  {
    image: Nitro,
    title: 'Snap Savings',
    promotionType: 1,
    endDate: '17/08/2023',
    active: true,
    _id: '5',
  },
];
export const rewardAnalyticsJson = [
  {
    name: 'Jos Buttler',
    image: Avatart1,
    earnedOn: '10/09/2023',
    limit: 5,
    uses: 3,
    status: 1,
  },
  {
    name: 'Steve Smith',
    image: Avatart2,
    earnedOn: '12/12/2023',
    limit: 5,
    uses: 2,
    status: 2,
  },
  {
    name: 'Jofra Archer',
    image: Avatart3,
    earnedOn: '11/01/2024',
    limit: 5,
    uses: 2,
    status: 2,
  },
  {
    name: 'Pat Cummins',
    image: Avatart2,
    earnedOn: '11/09/2023',
    limit: 5,
    uses: 4,
    status: 3,
  },
  {
    name: 'Mark Wood',
    image: Avatart3,
    earnedOn: '10/09/2023',
    limit: 5,
    uses: 3,
    status: 1,
  },
];
export const categoryOptionJson = [
  {
    name: 'Sports',
    title: 'Sports',
    value: 1,
    id: 1,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">Sports</span>
      </>
    ),
  },
  {
    name: 'Food',
    title: 'Food',
    value: 2,
    id: 2,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">Food</span>
      </>
    ),
  },
  {
    name: 'Skin Care',
    title: 'Skin Care',
    value: 3,
    id: 3,
    image: nutro,
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">Skin Care</span>
      </>
    ),
  },
];
export const brandListJson = [
  {
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">Mrf</span>
      </>
    ),
    value: 1,
    id: 1,
    title: 'Mrf',
    name: 'Mrf',
  },
  {
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">Apple</span>
      </>
    ),
    value: 2,
    id: 2,
    title: 'Apple',
    name: 'Apple',
  },
  {
    label: (
      <>
        <img
          src={nutro}
          height={15}
          className=" me-2"
          alt=""
        />
        <span className="fs-14 fw-500 text-black ">Nike</span>
      </>
    ),
    value: 3,
    id: 3,
    title: 'Nike',
    name: 'Nike',
  },
];
export const recipeJson = [
  {
    title: 'Paneer Butter Tawa Masala',
    category: 'Lunch',
    type: 'Veg',
  },
  {
    title: 'Chicken Biryani',
    category: 'Dinner',
    type: 'Non-Veg',
  },
  {
    title: 'Masala Dosa',
    category: 'Breakfast',
    type: 'Veg',
  },
  {
    title: 'Egg Roll',
    category: 'Snacks',
    type: 'Non-Veg',
  },
  {
    title: 'Aloo Paratha',
    category: 'Breakfast',
    type: 'Veg',
  },
  {
    title: 'Grilled Fish',
    category: 'Dinner',
    type: 'Non-Veg',
  },
  {
    title: 'Pav Bhaji',
    category: 'Lunch',
    type: 'Veg',
  },
  {
    title: 'Paneer Tikka',
    category: 'Snacks',
    type: 'Veg',
  },
  {
    title: 'Butter Chicken',
    category: 'Dinner',
    type: 'Non-Veg',
  },
  {
    title: 'Vegetable Pulao',
    category: 'Lunch',
    type: 'Veg',
  },
];

export const zonesBinsJson = [
  {
    _id: "1001",
    sequence: 1,
    name: "A1",
    bins: [
      { name: "Bin1-1", sequence: 1 },
      { name: "Bin1-2", sequence: 2 }
    ]
  },
  {
    _id: "1002",
    sequence: 2,
    name: "A2",
    bins: [
      { name: "Bin2-1", sequence: 1 }
    ]
  },
  {
    _id: "1003",
    sequence: 3,
    name: "A3",
    bins: [
      { name: "Bin3-1", sequence: 1 },
      { name: "Bin3-2", sequence: 2 },
      { name: "Bin3-3", sequence: 3 }
    ]
  },
  {
    _id: "1004",
    sequence: 4,
    name: "A4",
    bins: [
      { name: "Bin4-1", sequence: 1 }
    ]
  },
  {
    _id: "1005",
    sequence: 5,
    name: "A5",
    bins: [
      { name: "Bin5-1", sequence: 1 },
      { name: "Bin5-2", sequence: 2 }
    ]
  },
  {
    _id: "1006",
    sequence: 6,
    name: "A6",
    bins: [
      { name: "Bin6-1", sequence: 1 }
    ]
  },
  {
    _id: "1007",
    sequence: 7,
    name: "A7",
    bins: [
      { name: "Bin7-1", sequence: 1 },
      { name: "Bin7-2", sequence: 2 }
    ]
  },
  {
    _id: "1008",
    sequence: 8,
    name: "A8",
    bins: [
      { name: "Bin8-1", sequence: 1 },
      { name: "Bin8-2", sequence: 2 },
      { name: "Bin8-3", sequence: 3 }
    ]
  },
  {
    _id: "1009",
    sequence: 9,
    name: "A9",
    bins: [
      { name: "Bin9-1", sequence: 1 }
    ]
  },
  {
    _id: "1010",
    sequence: 10,
    name: "A10",
    bins: [
      { name: "Bin10-1", sequence: 1 },
      { name: "Bin10-2", sequence: 2 }
    ]
  }
];

