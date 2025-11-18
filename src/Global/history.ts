import secureLocalStorage from 'react-secure-storage';
export const setKey = (key: string, value: any, stringify: boolean = true) => {
  if (!secureLocalStorage) {
    return;
  }
  try {
    const lsValue = stringify ? JSON.stringify(value) : value;
    secureLocalStorage.setItem(key, lsValue);
  } catch (error) {
    console.error('LOCAL STORAGE SAVE ERROR', error);
  }
};
export const removeKey = (key: string) => {
  if (!secureLocalStorage) {
    return;
  }
  try {
    secureLocalStorage.removeItem(key);
  } catch (error) {
    console.error('LOCAL STORAGE REMOVE ERROR', error);
  }
};
export const getKey = (key: string) => {
  if (!secureLocalStorage) {
    return;
  }
  try {
    return JSON.parse(secureLocalStorage.getItem(key) + '');
  } catch (error) {
    console.error('LOCAL STORAGE FETCH ERROR', error);
  }
};
