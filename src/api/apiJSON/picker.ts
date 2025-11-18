import Method from '../../utils/methods';
export const pickerApiJson = {
  addPicker: (pickerData: any) => {
    const formData = new FormData();
    formData.append('name', pickerData.name);
    formData.append('email', pickerData?.email);
    formData.append('phone', pickerData?.phone);
    formData.append('phoneCountry', pickerData?.phoneCountry);
    formData.append(
      'dob',
      Method.convertDateToFormat(pickerData?.dob, 'YYYY-MM-DD')
    );
    if (pickerData?.imageReader) {
      formData.append('image', pickerData?.imageReader);
    }
    formData.append('address', pickerData?.address);
    formData.append('lat', pickerData?.lat);
    formData.append('lng', pickerData?.lng);
    return formData;
  },
  editPicker: (pickerData: any) => {
    const data: any = {
      name: pickerData?.name,
      email: pickerData?.email,
      phone: pickerData?.phone,
      phoneCountry: pickerData?.phoneCountry,
      dob: Method.convertDateToFormat(pickerData?.dob, 'YYYY-MM-DD'),
      address: pickerData?.address,
      lat: pickerData?.lat,
      lng: pickerData?.lng,
    };
    if (pickerData?.imageReader) {
      data.image = pickerData?.imageReader;
    }
    return data;
  },
};
