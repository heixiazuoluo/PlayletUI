import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { resultSuccess, doCustomTimes } from '../_util';

function createBlacklistUser(count: number) {
  const result: any[] = [];
  doCustomTimes(count, (index) => {
    result.push({
      id: index + 1,
      userId: faker.string.numeric(8),
      nickname: faker.person.firstName(),
      masterId: faker.string.numeric(8),
      masterName: faker.person.firstName(),
      isBlacklist: 1,
      avatar: faker.image.avatar(),
      registerTime: faker.date.past().toISOString().slice(0, 19).replace('T', ' '),
      loginTime: faker.date.recent().toISOString().slice(0, 19).replace('T', ' '),
      loginIp: faker.internet.ip(),
      coins: faker.number.int({ min: 0, max: 100000 }),
      remark: faker.helpers.arrayElement(['异常操作', '恶意刷金币', '多账号作弊', '使用外挂', '']),
      banCount: faker.number.int({ min: 1, max: 10 }),
      banOperator: faker.person.fullName(),
    });
  });
  return result;
}

export default defineMock({
  '/api/inquiry/blacklist_user_list': ({ query }) => {
    const { pageIndex = 1, pageSize = 10 } = query;
    const list = createBlacklistUser(Number(pageSize));
    const count = 120;
    const data = resultSuccess({
      page: Number(pageIndex),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
    console.log(data);
    return data;
  },
});
