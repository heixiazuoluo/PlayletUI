import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

const adCodeList: any[] = [
  {
    id: 1,
    appName: '消消乐',
    adNetwork: 1,
    adType: 1,
    codeSlot: 'BD_SHORT_001',
    priceType: 1,
    price: 10.5,
    status: 1,
  },
  {
    id: 2,
    appName: '斗地主',
    adNetwork: 2,
    adType: 2,
    codeSlot: 'CSJ_REWARD_001',
    priceType: 2,
    price: 25.0,
    status: 1,
  },
  {
    id: 3,
    appName: '跑酷大作战',
    adNetwork: 3,
    adType: 3,
    codeSlot: 'TX_BANNER_001',
    priceType: 1,
    price: 5.0,
    status: 0,
  },
  {
    id: 4,
    appName: '消消乐',
    adNetwork: 4,
    adType: 4,
    codeSlot: 'SIG_INFO_001',
    priceType: 2,
    price: 15.0,
    status: 1,
  },
  {
    id: 5,
    appName: '斗地主',
    adNetwork: 5,
    adType: 5,
    codeSlot: 'KS_INSERT_001',
    priceType: 1,
    price: 8.0,
    status: 1,
  },
  {
    id: 6,
    appName: '跑酷大作战',
    adNetwork: 1,
    adType: 6,
    codeSlot: 'BD_SPLASH_001',
    priceType: 2,
    price: 30.0,
    status: 1,
  },
];

let idCounter = adCodeList.length;

export default defineMock({
  '/api/inquiry/ad_code_list': ({ query }) => {
    const { page = 1, pageSize = 10, codeSlot, status, priceType } = query;
    let list = [...adCodeList];

    if (codeSlot) {
      list = list.filter((item) => item.codeSlot.includes(codeSlot));
    }

    if (status !== undefined && status !== null && status !== '') {
      list = list.filter((item) => item.status === Number(status));
    }

    if (priceType !== undefined && priceType !== null && priceType !== '') {
      list = list.filter((item) => item.priceType === Number(priceType));
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

  '[POST]/api/inquiry/ad_code_add': ({ data }) => {
    idCounter++;
    const newItem = {
      id: idCounter,
      appName: '新应用',
      adNetwork: data.adNetwork,
      adType: data.adType,
      codeSlot: data.codeSlot,
      priceType: data.priceType,
      price: data.price,
      status: data.status ?? 1,
    };
    adCodeList.unshift(newItem);
    return resultSuccess(newItem);
  },

  '[POST]/api/inquiry/ad_code_update': ({ data }) => {
    const index = adCodeList.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      adCodeList[index] = { ...adCodeList[index], ...data };
      return resultSuccess(adCodeList[index]);
    }
    return resultSuccess(null);
  },

  '[POST]/api/inquiry/ad_code_delete': ({ data }) => {
    const index = adCodeList.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      adCodeList.splice(index, 1);
    }
    return resultSuccess(null);
  },
});
