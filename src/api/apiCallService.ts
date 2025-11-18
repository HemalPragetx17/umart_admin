import { toast } from 'react-toastify';
import * as constants from '../utils/constants';
import { Error } from '../utils/string';
import GlobalValidations from '../utils/validations';
import * as apiEndpoints from './apiEndPoints';
import axios from 'axios';
import { getAuth } from '../app/modules/auth';
import Validations from '../utils/validations';
import secureLocalStorage from 'react-secure-storage';
class APICallService {
  public url: any;
  public apiType: any;
  public apiName: any;
  public params: any;
  public path: any;
  public listApi: any;
  public settings: any;
  public type: any;
  public isDelete: any;
  public language: any;
  public module :any
  constructor(
    apiname: any,
    params?: any,
    path?: any,
    type: any = 'application/json',
    isDelete: any = false,
    language: any = 'en',
    module: any = 0,
  ) {    
    this.url = constants.BASE_URL;
    if (apiname.constructor === Array) {
      this.apiType = [];
      this.apiName = [];
      this.params = [];
      this.path = [];
      this.type = type;
      this.isDelete = isDelete;
      this.module = module;
      apiname.forEach((item: any, index: number) => {
        var arr = item.toString().split(' ');
        this.apiType[index] = arr[1];
        this.apiName[index] = arr[0];
        this.params[index] = params[index];
        this.path[index] = path[index];
        this.type[index] = type[index];
        this.isDelete[index] = isDelete[index];
        this.language[index] = language[index];
        this.module[index] = module[index];
      });
    } else {
      var arr = apiname.toString().split(' ');
      this.apiType = arr[1];
      this.apiName = arr[0];
      this.params = params;
      this.path = path;
      this.type = type;
      this.isDelete = isDelete;
      this.language = language;
      this.module = module;
    }
    this.listApi = [apiEndpoints.LOGIN];
  }
  async findSettings(
    apiName: any,
    apiType: any,
    params: any,
    path: any,
    type?: any,
    isDelete?: any,
    language: any = 'en',
    module:any = 0
  ) {
    
    const resourceURL = `${this.url}${apiName}`;
    var myHeaders: any = {
      'ngrok-skip-browser-warning': '69420',
    };
    try {
      var mainAPIName = apiName + ' ' + apiType;
      let token = getAuth();
      if (!this.listApi.includes(mainAPIName)) {
        myHeaders = { ...myHeaders, Authorization: 'Bearer ' + token };
      }
    } catch (error) {
      console.log(error, 'PREF_TOKEN error');
    }
    myHeaders = { ...myHeaders, platform: 'web' };
    myHeaders = { ...myHeaders, appVersion: '1.0' };
    myHeaders = { ...myHeaders, 'accept-language': language };
    myHeaders = {...myHeaders, module : module}
    var settings = {
      redirect: 'follow',
      url: resourceURL,
      headers: myHeaders,
      method: '',
      responseType: type,
      data: {},
    };
    switch (apiType) {
      case constants.GET:
        settings.method = 'GET';
        break;
      case constants.GET_ID_PARAMS:
        settings.method = 'GET';
        settings.url = resourceURL + '/' + params;
        break;
      case constants.GET_URL_PARAMS:
        settings.method = 'GET';
        settings.url = resourceURL + '?' + this.objToQueryString(params);
        if (params && params.pageNo) {
          settings.url =
            resourceURL +
            '?' +
            this.objToQueryString({
              ...params,
              skip:
                parseInt(params.pageNo) * parseInt(params.limit) -
                  parseInt(params.limit) || 0,
              limit: params.limit,
              searchTerm: params.searchTerm
                ? encodeURIComponent(params.searchTerm)
                : '',
            });
        }
        if (params && params.pageNo) {
          delete params.pageNo;
          delete params.limit;
          settings.data = params;
        }
        break;
      case constants.GET_URL_ID_PARAMS:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        settings.headers = myHeaders;
        settings.method = 'GET';
        if (params) {
          settings.url =
            resourceURL +
            '/' +
            this.objToUrlParams(path) +
            '?' +
            this.objToQueryString({
              ...params,
              skip:
                parseInt(params.pageNo) * parseInt(params.limit) -
                  parseInt(params.limit) || 0,
              limit: params.limit,
              searchTerm: params.searchTerm ? params.searchTerm : '',
            });
        }
        if (params && params.pageNo) {
          delete params.pageNo;
          delete params.limit;
          settings.data = params;
        }
        break;
      case constants.GET_URL_ENCODED:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        settings.headers = myHeaders;
        settings.method = 'GET';
        settings.data = this.objToURLEncodedString(params);
        break;
      case constants.POST:
        settings.headers = myHeaders;
        settings.method = 'POST';
        break;
      case constants.POST_ID_PARAMS:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = params;
        break;
      case constants.POST_RAW:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = JSON.stringify(params);
        break;
      case constants.POST_FORM:
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = params;
        break;
      case constants.POST_URL_PARAMS_WITH_DATA:
        myHeaders = {
          ...myHeaders,
        };
        settings.url = resourceURL + '?' + this.objToQueryString(path);
        settings.method = 'POST';
        settings.data = params;
        break;
      case constants.MULTI_PART_ID_POST:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = params;
        break;
      case constants.POST_URL_PARAMS:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/json',
        };
        settings.method = 'POST';
        if (params && params.pageNo) {
          settings.url =
            resourceURL +
            '?' +
            this.objToQueryString({
              skip:
                parseInt(params.pageNo) * parseInt(params.limit) -
                  parseInt(params.limit) || 0,
              limit: params.limit,
              searchTerm: params.searchTerm ? params.searchTerm : '',
            });
        }
        if (params && params.pageNo) {
          delete params.pageNo;
          delete params.limit;
          settings.data = params;
        }
        break;
      case constants.POST_URL_ENCODED:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = this.objToURLEncodedString(params);
        break;
      case constants.POST_URL_ENCODED_ID_PARAMS:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = this.objToURLEncodedString(params);
        break;
      case constants.PATCH:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = JSON.stringify(params);
        break;
      case constants.PATCH_ID:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = params;
        break;
      case constants.PATCH_FORM_ID:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = this.objToFormData(params);
        break;
      case constants.PATCH_FORM:
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = this.objToFormData(params);
        break;
      case constants.PATCH_FORM_ID_URL_ENCODED:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = params;
        break;
      case constants.PATCH_URL_ENCODED:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = this.objToURLEncodedString(params);
        break;
      case constants.PATCH_ID_URL_ENCODED:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = this.objToURLEncodedString(params);
        break;
      case constants.DELETE:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'DELETE';
        settings.data = JSON.stringify(params);
        break;
      case constants.DELETE_ID_PARAMS:
        settings.method = 'DELETE';
        settings.url = resourceURL + '/' + params;
        break;
      case constants.DELETE_URL_PARAMS:
        settings.method = 'DELETE';
        settings.url = resourceURL + '?' + this.objToQueryString(params);
        break;
      case constants.DELETE_URL_ENCODED:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        };
        settings.headers = myHeaders;
        settings.method = 'DELETE';
        settings.data = this.objToURLEncodedString(params);
        break;
      case constants.MULTI_PART_POST:
        myHeaders = {
          ...myHeaders,
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        };
        settings.headers = myHeaders;
        settings.method = 'POST';
        settings.data = params;
        break;
      case constants.MULTI_PART_ID_PATCH:
        settings.url = resourceURL + '/' + this.objToUrlParams(path);
        settings.headers = myHeaders;
        settings.method = 'PATCH';
        settings.data = params;
        break;
      default:
        settings.method = 'GET';
        break;
    }
    return settings;
  }
  objToQueryString = (obj: any) => {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(key + '=' + obj[key]);
    }
    return keyValuePairs.join('&');
  };
  objToUrlParams = (obj: any) => {
    return Object.values(obj).join('/');
  };
  objToURLEncodedString = (obj: any) => {
    var formdata: any = [];
    for (var property in obj) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(obj[property]);
      if (obj[property].constructor === Array) {
        obj[property].forEach(
          // eslint-disable-next-line
          (obj: any) =>
            formdata.push(encodedKey + '=' + encodeURIComponent(obj))
        );
      } else formdata.push(encodedKey + '=' + encodedValue);
    }
    formdata = formdata.join('&');
    return formdata;
  };
  objToFormData = (obj: any) => {
    const form = new FormData();
    for (const key in obj) {
      form.append(key, obj[key]);
    }
    return form;
  };
  async callAPI() {
    const mObj = await GlobalValidations.checkNetConnection();
    if (!mObj) {
      let temp: any = window;
      temp.location =
        temp.location.protocol + '//' + temp.location.host + '/error/network';
      return 0;
    } else {      
      this.settings = await this.findSettings(
        this.apiName,
        this.apiType,
        this.params,
        this.path,
        this.type,
        this.isDelete,
        this.language,
        this.module
      );
      console.log('this.settings', this.settings);
      console.log('URL=> ' + JSON.stringify(this.settings.url));
      console.log('ApiType=> ' + this.apiType);
      console.log('Header=> ' + JSON.stringify(this.settings.headers));
      console.log('Params=> ' + this.settings.data);
      return axios(this.settings.url, this.settings)
        .then(async (res) => {
          return res.data ? res.data : 1;
        })
        .catch((err) => {
          console.log(this.isDelete, err.response);
          if (this.isDelete) {
            return err.response.data;
          }
          if (err?.response?.status === constants.ResponseFail) {
            toast.error(err.response.data.error, {
              // hideProgressBar: true,
              autoClose: 3500,
              theme: 'colored',
            });
            return 0;
          } else if (err?.response?.status === constants.AuthError) {
            secureLocalStorage.removeItem('auth-admin');
            secureLocalStorage.removeItem('auth-admin-v');
            secureLocalStorage.removeItem('PAGE_LIMIT');
            let temp: any = window;
            temp.location =
              temp.location.protocol +
              '//' +
              temp.location.host +
              '/auth/login';
          } else {
            let temp: any = window;
            temp.location =
              temp.location.protocol +
              '//' +
              temp.location.host +
              '/error/network';
            return 0;
          }
        });
    }
  }
}
export default APICallService;
