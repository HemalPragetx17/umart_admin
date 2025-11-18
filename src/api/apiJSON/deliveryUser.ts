import { IAddDeliveryUser, IListDriver, IUpdateDriverState } from '../../types';
export const deliveryUserJSON = {
  addDeliveryUser: ({
    name,
    email,
    phoneCountry,
    phone,
    dob,
    warehouse,
    vehicleNumber,
    address,
    lat,
    lng,
    lipaCountryCode,
    lipaNumber,
    imageReader,
    qrImageReader,
    drivingLicenseReader,
    vehicleDocumentReader,
    vehicleInsuranceReader,
    drivingLicenseExpiryDate,
    vehicleDocumentExpiryDate,
    vehicleInsuranceExpiryDate,
  }: IAddDeliveryUser) => {
    let form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('phoneCountry', phoneCountry);
    form.append('phone', phone);
    form.append('dob', dob);
    form.append('address', address);
    form.append('warehouse', warehouse);
    form.append('vehicleNumber', vehicleNumber);
    form.append('image', imageReader);
    form.append('lat', lat);
    form.append('lng', lng);
    form.append('lipaCountryCode',lipaCountryCode);
    form.append('lipaNumber',lipaNumber);
    if (qrImageReader) {
      form.append('qrImage', qrImageReader);
    }
    if (drivingLicenseReader) {
      form.append('drivingLicense', drivingLicenseReader);
    }
    if (vehicleDocumentReader) {
      form.append('vehicleDocument', vehicleDocumentReader);
    }
    if (vehicleInsuranceReader) {
      form.append('vehicleInsurance', vehicleInsuranceReader);
    }
    if (drivingLicenseExpiryDate) {
      form.append('drivingLicenseExpiryDate', drivingLicenseExpiryDate);
    }
    if (vehicleDocumentExpiryDate) {
      form.append('vehicleDocumentExpiryDate', vehicleDocumentExpiryDate);
    }
    if (vehicleInsuranceExpiryDate) {
      form.append('vehicleInsuranceExpiryDate', vehicleInsuranceExpiryDate);
    }
    return form;
  },
  listDriver: ({
    limit,
    sortKey,
    sortOrder,
    pageNo,
    searchTerm,
    date,
  }: IListDriver) => {
    return {
      limit: limit,
      sortKey: sortKey,
      sortOrder: sortOrder,
      needCount: true,
      pageNo: pageNo,
      searchTerm: searchTerm,
      date: date,
    };
  },
  updateStatus: ({ active }: IUpdateDriverState) => {
    return { active: active };
  },
  editDeliveryUser: ({
    name,
    email,
    phoneCountry,
    phone,
    dob,
    address,
    qrImageReader,
    vehicleNumber,
    lat,
    lng,
    warehouse,
    imageReader,
    drivingLicenseReader,
    vehicleDocumentReader,
    vehicleInsuranceReader,
    drivingLicenseExpiryDate,
    vehicleDocumentExpiryDate,
    vehicleInsuranceExpiryDate,
    lipaCountryCode,
    lipaNumber
  }: IAddDeliveryUser) => {
    const data: any = {
      name: name,
      email: email,
      phone: phone,
      phoneCountry: phoneCountry,
      vehicleNumber: vehicleNumber,
      dob: dob,
      address: address,
      lat: lat,
      lng: lng,
      warehouse: warehouse,
      image: imageReader,
      lipaCountryCode: lipaCountryCode,
      lipaNumber:lipaNumber
    };
    if (qrImageReader) {
      data.qrImage = qrImageReader;
    }
    if (drivingLicenseReader) {
      data.drivingLicense = drivingLicenseReader;
    }
    if (vehicleDocumentReader) {
      data.vehicleDocument = vehicleDocumentReader;
    }
    if (vehicleInsuranceReader) {
      data.vehicleInsurance = vehicleInsuranceReader;
    }
    if (drivingLicenseExpiryDate) {
      data.drivingLicenseExpiryDate = drivingLicenseExpiryDate;
    }
    if (vehicleDocumentExpiryDate) {
      data.vehicleDocumentExpiryDate = vehicleDocumentExpiryDate;
    }
    if (vehicleInsuranceExpiryDate) {
      data.vehicleInsuranceExpiryDate = vehicleInsuranceExpiryDate;
    }
    return data;
  },
};
