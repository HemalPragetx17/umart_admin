import moment from 'moment';
import {
  Admin,
  All,
  AllModules,
  AllRecipesConst,
  AppSettingsConst,
  BannerConst,
  Brand,
  Category,
  CmsPages,
  ContactEnquiries,
  Customer,
  CustomNotificationConst,
  DeliveryUser,
  GeneralSettings,
  GoodsInWarehouseConst,
  GoodsRequestConst,
  Inventory,
  LowStockConst,
  Master,
  Order,
  OutWardReports,
  PickerConst,
  Product,
  ProductVariant,
  ProductZoneConst,
  Promotion,
  RefundReportConst,
  Reports,
  ReturnProductReports,
  ReturnRequestConst,
  RolePermissions,
  SalesReportsConst,
  SuggestOptions,
  SuggestProductConst,
  UserManagement,
  WarehouseZone,
} from './constants';
const Method = {
  convertDateToDDMMYYYY: (date: string) => {
    return moment(date).local().format('DD/MM/YYYY ');
  },
  convertDateToFormat: (date: any, format: string) => {
    return moment(date).local().format(format);
  },
  convertDateToDDMMYYYYHHMM: (date: string, seperator?: string) => {
    if (!seperator) return moment(date).local().format('DD/MM/YYYY hh:mm ');
    else {
      let format = 'DD/MM/YYYY [' + seperator + ']  hh:mm';
      return moment(date).local().format(format);
    }
  },
  convertDateToDDMMYYYYHHMMAMPM: (date: string) => {
    return moment(date).local().format('DD/MM/YYYY hh:mm A');
  },
  convertDateToDDMMYYYYHHMMAMPMWithSeperator: (
    date: string,
    seperator?: string
  ) => {
    if (!seperator) return moment(date).local().format('DD/MM/YYYY hh:mm A');
    else {
      let format = 'DD/MM/YYYY [' + seperator + ']  hh:mm A';
      return moment(date).local().format(format);
    }
  },
  convertDateToDDMMYYYYHHMMAMPMWithSeprator: (date: string) => {
    return moment(date).local().format('DD/MM/YYYY - hh:mm A');
  },
  convertDateToDDMMYYYYHOURS: (date: string) => {
    return moment(date).local().format('DD/MM/YYYY [,] HH:mm ');
  },
  checkisSameOrAfter: (date1: string, date2: string) => {
    return moment(date2).isSameOrAfter(date1);
  },
  checkIsBefore: (date1: string, date2: string) => {
    return moment(date2).isBefore(date1);
  },
  checkAfter: (date1: string, date2: string) => {
    return moment(date2).isAfter(date1);
  },
  checkAfterTime: (date1: string, date2: string) => {
    return moment(date2).isAfter(date1, 'minutes');
  },
  checkSameDate: (date1: string, date2: string) => {
    return moment(date2).isSame(date1, 'date');
  },
  getMonth: (date: string, format: any) => {
    return moment(moment(date).month().toString()).format(format);
  },
  getYear: (date: string) => {
    return moment(date).format('YYYY');
  },
  monthsAgoDate: (date: string, month: number) => {
    return moment(date).subtract(month, 'months');
  },
  addMonthsToDate: (date: string, month: number) => {
    return moment(date).add(month, 'months');
  },
  dayDifference: (date1: string, date2: string) => {
    return moment(date2).diff(date1, 'days');
  },
  currentLocalDateTime: () => {
    return moment().format();
  },
  getTodayDate: (format: string) => {
    return moment().format(format);
  },
  addDaysToDate: (startDate: any, days: number, format: string) => {
    return moment(startDate).add(days, 'days').format(format);
  },
  toFixed2: (number: any) => {
    return new Number(number).toFixed(2);
  },
  convertToPreviousMonth: (date: string, format: string) => {
    return moment(date).subtract(1, 'month').local().format(format);
  },
  getLastWeeksDate: () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  },
  getYesterDayDate: () => {
    return moment().subtract(1, 'days').toDate();
  },
  getCurrentMonthStartDate: () => {
    return new Date(moment().startOf('month').format('YYYY-MM-DD'));
  },
  getCurrentMonthEndDate: () => {
    return new Date(moment().endOf('month').format('YYYY-MM-DD'));
  },
  formatCurrency: (currency: any) => {
    // const value = new Number(currency).toFixed(2);
    // const val = new Intl.NumberFormat('en-IN').format(+value);
    // return val;
    return currency.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  },
  hasPermission: (module: number, permission: number, currentUser: any) => {
    if (currentUser?.userType === Admin) return true;
    const permissionsArray =
      currentUser?.roleAndPermission &&
      currentUser?.roleAndPermission.permissions?.find(
        (item: any) => item.module === module
      )?.permissions;
    if (permissionsArray && permissionsArray.length) {
      return permissionsArray
        ? permissionsArray.includes(All) ||
            permissionsArray.includes(permission)
        : true;
    } else {
      return false;
    }
  },
  hasModulePermission: (module: number, currentUser: any) => {
    const allModules = [
      Customer,
      Order,
      Product,
      Promotion,
      Category,
      Brand,
      ProductVariant,
      RolePermissions,
      UserManagement,
      WarehouseZone,
      DeliveryUser,
      SalesReportsConst,
      GeneralSettings,
      CmsPages,
      ContactEnquiries,
      ProductZoneConst,
      CustomNotificationConst,
      GoodsInWarehouseConst,
      GoodsRequestConst,
      ReturnRequestConst,
      LowStockConst,
      BannerConst,
      AppSettingsConst,
      OutWardReports,
      ReturnProductReports,
      AllRecipesConst,
      SuggestProductConst,
      PickerConst,
      RefundReportConst
    ];
    const permissionModules =
      currentUser?.roleAndPermission &&
      currentUser?.roleAndPermission.permissions.length > 0
        ? currentUser?.roleAndPermission.permissions.includes(AllModules)
          ? allModules
          : currentUser.roleAndPermission.permissions.map(
              (item: any) => item.module
            )
        : allModules;
    return permissionModules.includes(module);
  },
  convertToMillions: (number: any) => {
    if (isNaN(number)) {
      return '';
    }
    if (number < 1000000) {
      return number.toString();
    }
    const millions = (number / 1000000).toFixed(2);
    return millions + 'M';
  },
  convertToThousand: (number: any) => {
    if (isNaN(number)) {
      return '';
    }
    if (number < 1000) {
      return number.toString();
    }
    const thousand = (number / 1000).toFixed(2);
    return thousand + 'K';
  },
  // getGeneralizedAmount: (amount: any) => {
  //   if (amount)
  //     return amount.toLocaleString('en-US', {
  //       minimumFractionDigits: 0,
  //       maximumFractionDigits: 3,
  //     });
  //   return 0;
  // },
  convertToMillionOrThousand: (number: any, afterPoint: number = 2) => {
    if (isNaN(number)) {
      return '';
    }
    if (number > 1000 && number < 1000000) {
      const thousand = (number / 1000).toFixed(2);
      return thousand + 'K';
    } else if (number >= 1000000) {
      const millions = (number / 1000000).toFixed(2);
      const thousand = (number / 1000).toFixed(afterPoint);
      return millions + 'M';
    } else if (number >= 1000000) {
      const millions = (number / 1000000).toFixed(afterPoint);
      return millions + 'M';
    } else {
      return number.toString();
    }
  },
  getGeneralizedAmount2: (amount: any) => {
    if (amount)
      return amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      });
    return 0;
  },
  getGeneralizedAmount: (amount: any) => {
    // return new Number(amount).toLocaleString('en-US', {
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 20,
    // });
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!isNaN(numericAmount) && numericAmount) {
      // Format the number using toLocaleString
      const formattedAmount = numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 20,
      });
      return formattedAmount;
    } else {
      return amount; // Return the original input as is
    }
  },
  replaceSpaceWithCustom: (value: any, replaceWith: string) => {
    return value.replace(/\s*\)\s*/g, replaceWith);
  },
  getProductMedia: (val: any, isMaster: boolean, isProductPage: boolean) => {
    if (isProductPage) {
      if (isMaster) {
        return val?.variants[0]?.variant?.media[0]?.url || '';
      } else {
        return val?.variant?.media[0]?.url || '';
      }
    } else {
      if (isMaster) {
        return val?.variants[0]?.media[0]?.url || '';
      } else {
        return val?.media[0]?.url || '';
      }
    }
  },
  isDateValid: (date: string, format: string) => {
    return moment(date, format, true).isValid();
  },
  previousMonthStartDate: (date: string, format: string) => {
    return moment(date)
      .subtract(1, 'month')
      .startOf('month')
      .local()
      .format(format);
  },
  previousMonthEndDate: (date: string, format: string) => {
    return moment(date)
      .subtract(1, 'month')
      .endOf('month')
      .local()
      .format(format);
  },
  populateMissingDates: (dataObject: any, startDate?: any, endDate?: any) => {
    dataObject = dataObject.sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );
    let lowestIndex = 0; // Initialize with the first index as the lowest
    let lowestDate = dataObject[0].date; // Initialize with the first date as the lowest
    let highestIndex = 0; // Initialize with the first index as the highest
    let highestDate = dataObject[0].date; // Initialize with the first date as the highest
    for (let i = 1; i < dataObject.length; i++) {
      if (dataObject[i].date < lowestDate) {
        lowestIndex = i;
        lowestDate = dataObject[i].date;
      }
      if (dataObject[i].date > highestDate) {
        highestIndex = i;
        highestDate = dataObject[i].date;
      }
    }
    let temp = [...dataObject];
    const allDates = Array.from(new Set(temp.map((entry: any) => entry.date)));
    // Get the unique months from the dataObject
    const uniqueMonths = Array.from(
      new Set(allDates.map((date: any) => date.slice(0, 7)))
    );
    // Populate missing dates for each month in the dataObject with zeros
    uniqueMonths.forEach((month) => {
      const monthDates = allDates.filter((date: any) => date.startsWith(month));
      let Start = moment(lowestDate).format('DD');
      let end = moment(highestDate).format('DD');
      for (let i = parseInt(startDate); i <= parseInt(endDate); i++) {
        let monthString = '';
        switch (parseInt(month.slice(5, 7))) {
          case 1:
            monthString = 'Jan';
            break;
          case 2:
            monthString = 'Feb';
            break;
          case 3:
            monthString = 'Mar';
            break;
          case 4:
            monthString = 'Apr';
            break;
          case 5:
            monthString = 'May';
            break;
          case 6:
            monthString = 'Jun';
            break;
          case 7:
            monthString = 'July';
            break;
          case 8:
            monthString = 'Aug';
            break;
          case 9:
            monthString = 'Sep';
            break;
          case 10:
            monthString = 'Oct';
            break;
          case 11:
            monthString = 'Nov';
            break;
          case 12:
            monthString = 'Dec';
            break;
        }
        const day = i < 10 ? `0${i}` : `${i}`;
        const date = `${month}-${day}`;
        const dateString = `${monthString} ${day}`;
        if (!monthDates.includes(date)) {
          temp.push({
            date: date,
            totalSales: 0,
            totalOrders: 0,
            fullDate: dateString,
            customers: 0,
            sellers: 0,
          });
        } else {
          const existingEntryIndex = temp.findIndex(
            (entry: any) => entry.date == date
          );
          if (existingEntryIndex !== -1) {
            // Add fullDate if it's not already present
            if (!temp[existingEntryIndex].fullDate) {
              temp[existingEntryIndex].fullDate = dateString;
            }
          }
        }
      }
    });
    // Sort dataObject based on dates
    return temp.sort((a: any, b: any) => a.date.localeCompare(b.date));
  },
  generateCode: (length: number): string => {
    const values = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 1; i <= length; i++) {
      const random = Math.floor(Math.random() * values.length);
      code += values[random];
    }
    return code;
  },
  getAppliedCartDiscount: (cartList: any, cartValue: any) => {
    const first = cartList[0];
    const last = cartList[cartList.length - 1];
    if (cartValue < first.minimumPurchaseAmount) return undefined;
    let low = 0;
    let high = cartList.length - 1;
    let result = -1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (cartList[mid].minimumPurchaseAmount <= cartValue) {
        result = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return result === -1 ? undefined : cartList[result];
  },
  getTimeWithAMPM: (hour: any) => {
    let mins = hour.split(':')[1];
    hour = parseInt(hour.split(':')[0]);
    if (!mins) {
      mins = '00';
    }
    if (hour == 0 || hour == 24) {
      return `12:${mins} AM`;
    } else if (hour == 12) {
      return `12:${mins} PM`;
    } else if (hour > 0 && hour < 12) {
      return `${hour}:${mins} AM`;
    } else if (hour > 12) {
      return `${hour - 12}:${mins} PM`;
    }
    return `${hour}:${mins} PM`;
  },
  handleOnKeyPress: (event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  },
  getOneMonthAheadData: () => {
    return moment().add(1, 'month').toDate();
  },
  getExpectedDeliveryTime: (record: any) => {
    if (!record) return '-';
    let expectedDeliveryDateTime;
    if (record?.slot) {
      const scheduledDateTimeStr = `${record?.slot?.dateStr}T${record?.slot?.startTime}:00`;
      expectedDeliveryDateTime = new Date(scheduledDateTimeStr);
    } else {
      const createdDate = new Date(record?._createdAt);
      expectedDeliveryDateTime = new Date(
        createdDate.getTime() + 30 * 60 * 1000
      );
    }
    console.log('cxxxxxxxxxx', record, expectedDeliveryDateTime);
    // const expectedDeliveryDateTimeStr = Util.formatToDdMmYyyyWithTime(
    //   expectedDeliveryDateTime,
    //   utcOffset
    // );
    if (expectedDeliveryDateTime) {
      return Method.convertDateToDDMMYYYYHHMMAMPMWithSeperator(
        expectedDeliveryDateTime.toLocaleString(),
        '-'
      );
    } else {
      return '-';
    }
  },
  getPluralize: (count: number, singular: string, plural: string) => {
    return count === 1 ? singular : plural;
  },
  checkIsValidBatch: (expiryDateStr: any, daysToAdd: number) => {
    if (!expiryDateStr) return true;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysToAdd);
    const expiryDate = new Date(expiryDateStr);
    return futureDate < expiryDate;
  },
};
export default Method;
