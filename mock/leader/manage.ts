import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { resultSuccess, doCustomTimes } from '../_util';

function createLeaderList(count: number) {
  const result: any[] = [];
  doCustomTimes(count, (index) => {
    result.push({
      id: index + 1,
      leaderId: `LD${faker.string.numeric(8)}`,
      leaderName: faker.person.fullName(),
      leaderLevel: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
      inviteCount: faker.number.int({ min: 0, max: 500 }),
      directCommission: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
      indirectCommission: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
      withdrawable: faker.number.float({ min: 0, max: 3000, fractionDigits: 2 }),
      totalWithdraw: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
      remark: faker.lorem.sentence(),
      status: faker.helpers.arrayElement([0, 1]),
      loginName: faker.internet.userName(),
      userId: `U${faker.string.numeric(8)}`,
      gameName: faker.helpers.arrayElement(['消消乐', '斗地主', '跑酷大作战']),
      realName: faker.person.fullName(),
      phone: faker.phone.number(),
    });
  });
  return result;
}

export default defineMock({
  '/api/leader/manage_list': ({ query }) => {
    const { pageIndex = 1, pageSize = 10 } = query;
    const list = createLeaderList(Number(pageSize));
    const count = 100;
    return resultSuccess({
      page: Number(pageIndex),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
  },
});
