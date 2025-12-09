import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { doCustomTimes, resultSuccess } from '../_util';
import dayjs from 'dayjs';

const appNames = ['消消乐', '斗地主', '跑酷大作战', '开心农场', '糖果消除'];
const adTypes = [1, 2, 3, 4, 5, 6]; // 短视频、激励视频、Banner、信息流、插屏、开屏

function adRevenueList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    const ecpm = faker.number.float({ min: 5, max: 100, fractionDigits: 2 });
    const userRatio = faker.helpers.arrayElement([30, 40, 50, 60, 70]);
    result.push({
      id: faker.number.int({ min: 1000, max: 9999 }),
      userId: faker.number.int({ min: 10001, max: 99999 }),
      nickname: faker.person.firstName(),
      appName: faker.helpers.arrayElement(appNames),
      codeSlotId: `CS_${faker.string.alphanumeric(8).toUpperCase()}`,
      adType: faker.helpers.arrayElement(adTypes),
      ecpm: ecpm,
      userCoin: faker.number.int({ min: 10, max: 500 }),
      userRatio: userRatio,
      time: dayjs(faker.date.recent({ days: 30 })).format('YYYY-MM-DD HH:mm:ss'),
    });
  });
  return result;
}

export default defineMock({
  '/api/inquiry/ad_revenue_list': ({ query }) => {
    const { page = 1, pageSize = 10 } = query;
    const list = adRevenueList(Number(pageSize));
    const count = 100;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
  },
});
