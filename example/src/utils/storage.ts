import store from 'store2';
import qs from 'qs';
import {
  AUTO_LOGIN_KEY,
  LOGIN_INFO_STORAGE_KEY,
  REMEMBER_PASSWORD_KEY,
  REMEMBER_USER_KEY,
} from '@/utils/constant';
import { decryptAES, encryptAES } from '@/utils/encryption';

export const removeUseInfo = () => {
  store.remove(LOGIN_INFO_STORAGE_KEY);
};

export const getRememberUser = () => {
  const paw = store.get(REMEMBER_USER_KEY);
  if (paw) {
    return qs.parse(decryptAES(paw));
  }
  return {};
};

export const setRememberUser = (user) => {
  store.set(REMEMBER_USER_KEY, encryptAES(qs.stringify(user)));
};

export const removeRememberUser = () => {
  store.remove(REMEMBER_USER_KEY);
};

export const setAutoLogin = (autoLogin) => {
  store.set(AUTO_LOGIN_KEY, autoLogin);
};

export const getAutoLogin = () => {
 return  store.get(AUTO_LOGIN_KEY);
};

export const setRememberPassword = (rememberPassword) => {
  store.set(REMEMBER_PASSWORD_KEY, rememberPassword);
};

export const getRememberPassword = () => {
  return store.get(REMEMBER_PASSWORD_KEY);
};

export const setUserInfo = (userInfo) => {
  store.set(LOGIN_INFO_STORAGE_KEY, userInfo);
};
