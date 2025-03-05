import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const globalurl = process.env.PAYMENT_TRANSACTIONS;


axios.defaults.baseURL = globalurl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const getAuthToken = () => {
  return process.env.TOKEN;
};

export const Request =  (method, url, data) => {
  let headers = {};

    if (getAuthToken()) {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    console.log(headers);
    console.log(data);
    return axios({
      method: method,
      url: globalurl.concat(url),
      headers: headers,
      data: data,
      withCredentials: true,
    });
};

export const RequestParams =  (method, url,params) => {
  let headers = {};
  // console.log(data)
    if (getAuthToken()) {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    return axios({
      method: method,
      url: globalurl.concat(url),
      headers: headers,
      withCredentials: true,
      params:params,
    });
};

export const  getJwtCookie=()=>{
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
  console.log(document.cookie)
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === 'jwt') {
        return cookieValue;
      }
    }
  
    return null;
  };