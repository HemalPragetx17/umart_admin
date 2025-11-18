const Validations = {
  checkNetConnection: async () => {
    let isConnected = window.navigator.onLine;
    if (isConnected) {
      return true;
    } else {
      return false;
    }
  },
  validateEmail: (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  },
  validateObject: async (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] !== false) {
          return false; // Found a key with a value other than false
        }
      }
    }
    return true; // All keys have a value of false
  },
  validatePrice: async (value: string) => {
    const pattern = /^\d{0,5}(\.\d{0,2})?$/;
    if (pattern.test(value.trim())) {
      return true;
    } else {
      return false;
    }
  },
  allowOnlyNumbers: (value: string) => {
    const pattern = /^[0-9]+$/;
    if (pattern.test(value.trim())) {
      return true;
    } else {
      return false;
    }
  },
  allowOnlyNumbersWithEmptyString: (value: string) => {
    const pattern = /^\d*$/;
    if (pattern.test(value.trim())) {
      return true;
    } else {
      return false;
    }
  },
  allowNumberAndFloat: (value: string) => {
    const pattern = /^\s*([\d,]+(\.[\d,]*)?|\.[\d,]+)?\s*$/;
    //  const pattern = /^\s*(\d+(\.\d*)?|\.\d+)?\s*$/;
    if (pattern.test(value)) {
      return true;
    } else {
      return false;
    }
  },
  isStringEmpty: (value: string) => {
    value = value + '';
    return value.trim().length === 0;
  },
  isStringEmptyOrZero: (value: string) => {
    value = value.toString();
    return value.trim().length === 0 || value === '0';
  },
  isAlphanumeric: (value: string) => {
    value = value.toString();
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(value);
  },
};
export default Validations;
