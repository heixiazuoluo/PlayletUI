import { Alova } from '@/utils/http/alova/index';

/**
 * @description: app列表
 */
export function getAppList(params) {
  return Alova.Get('/am/v1/data/appinfos/list', { params });
}
/**
 * @description: 编辑app
 */
export function updateApp(params) {
  return Alova.Post('/am/v1/data/appinfos/update', params);
}

/**
 * @description: 新增app
 */
export function createApp(params) {
  return Alova.Post('/am/v1/data/appinfos/create', params);
}
