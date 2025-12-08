import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

const productList: any[] = [
  {
    id: 1,
    gameName: '消消乐',
    packageName: 'com.game.xxl',
    downloadUrl: 'https://oss.example.com/apps/xxl.apk',
    icon: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    status: 1,
    uploadType: 1,
  },
  {
    id: 2,
    gameName: '斗地主',
    packageName: 'com.game.ddz',
    downloadUrl: 'https://oss.example.com/apps/ddz.apk',
    icon: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    status: 1,
    uploadType: 1,
  },
  {
    id: 3,
    gameName: '跑酷大作战',
    packageName: 'com.game.pkdzz',
    downloadUrl: 'https://oss.example.com/apps/pkdzz.apk',
    icon: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    status: 0,
    uploadType: 2,
  },
];

let idCounter = productList.length;

export default defineMock({
  '/api/dataManage/product_list': ({ query }) => {
    const { page = 1, pageSize = 10, gameName, status } = query;
    let list = [...productList];

    if (gameName) {
      list = list.filter((item) => item.gameName.includes(gameName));
    }

    if (status !== undefined && status !== null && status !== '') {
      list = list.filter((item) => item.status === Number(status));
    }

    const start = (Number(page) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const pageList = list.slice(start, end);

    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(list.length / Number(pageSize)),
      itemCount: list.length,
      list: pageList,
    });
  },

  '[POST]/api/dataManage/product_add': ({ data }) => {
    idCounter++;
    const newItem = {
      id: idCounter,
      gameName: data.gameName,
      packageName: data.packageName,
      downloadUrl: data.downloadUrl,
      icon: data.icon || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      status: data.status ?? 1,
      uploadType: data.uploadType ?? 1,
    };
    productList.unshift(newItem);
    return resultSuccess(newItem);
  },

  '[POST]/api/dataManage/product_update': ({ data }) => {
    const index = productList.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      productList[index] = { ...productList[index], ...data };
      return resultSuccess(productList[index]);
    }
    return resultSuccess(null);
  },

  '[POST]/api/dataManage/product_delete': ({ data }) => {
    const index = productList.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      productList.splice(index, 1);
    }
    return resultSuccess(null);
  },
});
