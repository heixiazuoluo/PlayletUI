import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { resultSuccess, doCustomTimes } from '../_util';

function createSettingItem(index: number) {
  const result: any[] = [];
  doCustomTimes(index, () => {
    result.push({
      id: index + 1,
      appName: faker.company.name() + 'App',
      category: faker.helpers.arrayElement([1, 2]),
      withdrawAmount: faker.number.int({ min: 10, max: 1000 }),
      dailyLimit: faker.number.int({ min: 1, max: 10 }),
      description: faker.lorem.sentence(),
      subsidyAmount: faker.number.int({ min: 0, max: 100 }),
      subsidyStartTime: faker.date.past().toISOString().slice(0, 19).replace('T', ' '),
      subsidyEndTime: faker.date.future().toISOString().slice(0, 19).replace('T', ' '),
      status: faker.helpers.arrayElement([0, 1]),
    });
  });
  return result;
}

export default defineMock({
  '/api/inquiry/withdraw_setting_list': ({ query }) => {
    const { page = 1, pageSize = 10 } = query;
    const list = createSettingItem(Number(pageSize));
    const count = 120;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
  },
});
