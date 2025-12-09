import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

const coinRecordList: any[] = [
  {
    id: 1,
    userId: 10001,
    nickname: '张三',
    coin: 100,
    coinBefore: 500,
    coinAfter: 600,
    time: '2025-12-09 10:30:00',
    content: 'banner收益',
    type: 1,
    sourceType: 1,
  },
  {
    id: 2,
    userId: 10002,
    nickname: '李四',
    coin: 50,
    coinBefore: 300,
    coinAfter: 350,
    time: '2025-12-09 11:20:00',
    content: '插屏收益',
    type: 1,
    sourceType: 1,
  },
  {
    id: 3,
    userId: 10003,
    nickname: '王五',
    coin: 200,
    coinBefore: 1000,
    coinAfter: 800,
    time: '2025-12-09 12:00:00',
    content: '提现扣除',
    type: 2,
    sourceType: 2,
  },
  {
    id: 4,
    userId: 10001,
    nickname: '张三',
    coin: 80,
    coinBefore: 600,
    coinAfter: 680,
    time: '2025-12-09 14:15:00',
    content: 'banner收益',
    type: 1,
    sourceType: 3,
  },
  {
    id: 5,
    userId: 10004,
    nickname: '赵六',
    coin: 120,
    coinBefore: 200,
    coinAfter: 320,
    time: '2025-12-09 15:30:00',
    content: '激励视频收益',
    type: 1,
    sourceType: 1,
  },
  {
    id: 6,
    userId: 10005,
    nickname: '钱七',
    coin: 60,
    coinBefore: 450,
    coinAfter: 510,
    time: '2025-12-09 16:00:00',
    content: '插屏收益',
    type: 1,
    sourceType: 1,
  },
];

export default defineMock({
  '/api/inquiry/coin_record_list': () => {
    return resultSuccess({
      page: 1,
      pageSize: 10,
      pageCount: 1,
      list: coinRecordList,
    });
  },
});
