import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { resultSuccess, doCustomTimes } from '../_util';

function createOnlineClass(count: number) {
  const result: any[] = [];
  doCustomTimes(count, (index) => {
    const category = faker.helpers.arrayElement([1, 2]);
    result.push({
      id: index + 1,
      gameName: faker.helpers.arrayElement(['消消乐', '斗地主', '跑酷大作战']),
      title: faker.lorem.sentence(),
      category,
      isHot: faker.helpers.arrayElement([0, 1]),
      coverImage: faker.image.url(),
      videoUrl: category === 1 ? faker.internet.url() : '',
      content: '<p>持续放水中 </p><p>每天7:00 12:00 00:00</p><p>这三个时间段收益最高 冲！</p>',
      readCount: faker.number.int({ min: 0, max: 10000 }),
      status: faker.helpers.arrayElement([0, 1]),
    });
  });
  return result;
}

export default defineMock({
  '/api/inquiry/online_class_list': ({ query }) => {
    const { pageIndex = 1, pageSize = 10 } = query;
    const list = createOnlineClass(Number(pageSize));
    const count = 80;
    return resultSuccess({
      page: Number(pageIndex),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
  },
});
