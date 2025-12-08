import { Alova } from '@/utils/http/alova/index';

// 获取产品列表
export function getProductList(params: any) {
  return Alova.Get('/dataManage/product_list', { params });
}

// 新增产品
export function addProduct(data: any) {
  return Alova.Post('/dataManage/product_add', data);
}

// 更新产品
export function updateProduct(data: any) {
  return Alova.Post('/dataManage/product_update', data);
}

// 删除产品
export function deleteProduct(data: any) {
  return Alova.Post('/dataManage/product_delete', data);
}
