import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

const adList: any[] = [
  {
    id: 1,
    appId: 'app_001',
    gameName: '消消乐',
    adPlatform: 1,
    status: 1,
    shortVideoAd: 'sv_001',
    rewardVideoAd: 'rv_001',
    rewardVideoAdKey: 'rvk_001',
    bannerAd: 'bn_001',
    infoFlowAd: 'if_001',
    interstitialAd: 'it_001',
    splashAd: 'sp_001',
  },
  {
    id: 2,
    appId: 'app_002',
    gameName: '斗地主',
    adPlatform: 2,
    status: 1,
    shortVideoAd: 'sv_002',
    rewardVideoAd: 'rv_002',
    rewardVideoAdKey: 'rvk_002',
    bannerAd: 'bn_002',
    infoFlowAd: 'if_002',
    interstitialAd: 'it_002',
    splashAd: 'sp_002',
  },
  {
    id: 3,
    appId: 'app_003',
    gameName: '跑酷大作战',
    adPlatform: 1,
    status: 0,
    shortVideoAd: '',
    rewardVideoAd: '',
    rewardVideoAdKey: '',
    bannerAd: '',
    infoFlowAd: '',
    interstitialAd: '',
    splashAd: '',
  },
];

export default defineMock({
  '/api/inquiry/ad_list': ({ query }) => {
    const { page = 1, pageSize = 10, gameName } = query;
    let list = [...adList];

    // 过滤游戏名称
    if (gameName) {
      list = list.filter((item) => item.gameName.includes(gameName));
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
});
