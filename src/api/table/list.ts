import { Alova } from '@/utils/http/alova/index';

//获取table
export function getTableList(params) {
  return Alova.Get('/table/list', { params });
}

//获取用户table
export function getUserList(params) {
  return Alova.Get('/user/list', { params });
}

// app列表
export function getAppList(params) {
  return Alova.Get('/am/v1/data/appinfos/list', { params });
}
