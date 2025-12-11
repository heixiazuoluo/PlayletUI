import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { resultSuccess, doCustomTimes } from '../_util';

function createFissionRecord(count: number) {
  const result: any[] = [];
  doCustomTimes(count, (index) => {
    result.push({
      id: index + 1,
      userId: faker.string.numeric(8),
      nickname: faker.person.firstName(),
      userLevel: faker.helpers.arrayElement([1, 2, 3]),
      subUserId: faker.string.numeric(8),
      subNickname: faker.person.firstName(),
      subLevel: faker.helpers.arrayElement([1, 2, 3]),
      subWithdrawAmount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      commissionIncome: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
      commissionType: faker.helpers.arrayElement([1, 2]),
      relation: faker.helpers.arrayElement([1, 2]),
      commissionRate: faker.helpers.arrayElement([5, 10, 15, 20]),
      withdrawTime: faker.date.recent().toISOString().slice(0, 19).replace('T', ' '),
    });
  });
  return result;
}

export default defineMock({
  '/api/inquiry/fission_record_list': ({ query }) => {
    const { pageIndex = 1, pageSize = 10 } = query;
    const list = createFissionRecord(Number(pageSize));
    const count = 120;
    return resultSuccess({
      page: Number(pageIndex),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
  },
});
