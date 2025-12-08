import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { doCustomTimes, resultSuccess } from '../_util';
import dayjs from 'dayjs';
function tableList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: faker.string.numeric(4),
      name: faker.person.firstName(),
      sex: faker.person.sexType(),
      avatar: `https://picsum.photos/200/200?v=${faker.string.numeric(4)}`,
      email: faker.internet.email({ firstName: 'admin' }),
      city: faker.location.city(),
      status: faker.helpers.arrayElement(['close', 'refuse', 'pass']),
      type: faker.helpers.arrayElement(['person', 'company']),
      // createDate: faker.helpers.arrayElement(dateStrs),
      createDate: dayjs(faker.date.anytime()).format('YYYY-MM-DD HH:mm'),
    });
  });
  return result;
}

function appList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      Id: faker.string.numeric(4),
      name: faker.person.firstName(),
      appId: faker.string.alpha(),
      ulinkid: faker.string.alphanumeric(),
      status: faker.helpers.arrayElement([1, 0]),
      app_version: faker.string.nanoid(),
      announcementContent:
        '<p>持续放水中 </p><p>每天7:00 12:00 00:00</p><p>这三个时间段收益最高 冲！</p>',
      announcementStatus: faker.helpers.arrayElement([1, 0]),
      fkStatus: faker.helpers.arrayElement([1, 0]),
      fkMaxWeiXin: faker.number.int(),
      fkMaxIp: faker.number.int(),
      // createDate: faker.helpers.arrayElement(dateStrs),
      // createDate: dayjs(faker.date.anytime()).format('YYYY-MM-DD HH:mm'),
    });
  });
  return result;
}
function fkList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: faker.string.numeric(4),
      data1: faker.person.firstName(),
      data2: faker.helpers.arrayElement([1, 0, 2, 4, 6, 5]),
    });
  });
  return result;
}

export default defineMock({
  // 表格数据列表
  '/api/table/list': ({ query }) => {
    const { page = 1, pageSize = 10, name } = query;
    const list = tableList(Number(pageSize));
    // 并非真实，只是为了模拟搜索结果
    const count = name ? 30 : 60;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: count,
      itemCount: count * Number(pageSize),
      list,
    });
  },
  '/api/app/list': ({ query }) => {
    const { page = 1, pageSize = 10, name } = query;
    const list = appList(Number(pageSize));
    // 并非真实，只是为了模拟搜索结果
    const count = name ? 30 : 60;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: count,
      itemCount: count * Number(pageSize),
      list,
    });
  },
  '/api/table/record': ({ query }) => {
    const { page = 1, pageSize = 10, name } = query;
    const list = fkList(Number(pageSize));
    // 并非真实，只是为了模拟搜索结果
    const count = name ? 30 : 60;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: count,
      itemCount: count * Number(pageSize),
      list,
    });
  },
});
