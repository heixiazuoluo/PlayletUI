import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { doCustomTimes, resultSuccess } from '../_util';
import dayjs from 'dayjs';

const userLevels = [1, 2, 3];
const withdrawTypes = [1, 2, 3];
const auditStatuses = [1, 2, 3, 4, 5];

function withdrawAuditList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: faker.number.int({ min: 1000, max: 9999 }),
      userId: faker.number.int({ min: 10001, max: 99999 }),
      nickname: faker.person.firstName(),
      userLevel: faker.helpers.arrayElement(userLevels),
      masterId: faker.number.int({ min: 10001, max: 99999 }),
      masterNickname: faker.person.firstName(),
      withdrawTime: dayjs()
        .subtract(faker.number.int({ min: 1, max: 30 }), 'day')
        .format('YYYY-MM-DD HH:mm:ss'),
      registerTime: dayjs()
        .subtract(faker.number.int({ min: 30, max: 365 }), 'day')
        .format('YYYY-MM-DD HH:mm:ss'),
      remark: faker.lorem.sentence(),
      auditor: faker.person.lastName(),
      withdrawType: faker.helpers.arrayElement(withdrawTypes),
      withdrawAmount: faker.number.int({ min: 1000, max: 100000 }),
      subsidyAmount: faker.number.int({ min: 0, max: 5000 }),
      totalWithdraw: faker.number.int({ min: 10000, max: 500000 }),
    });
  });
  return result;
}

function auditRecordList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: faker.number.int({ min: 1000, max: 9999 }),
      userId: faker.number.int({ min: 10001, max: 99999 }),
      nickname: faker.person.firstName(),
      withdrawAmount: faker.number.int({ min: 1000, max: 50000 }),
      withdrawTime: dayjs()
        .subtract(faker.number.int({ min: 1, max: 30 }), 'day')
        .format('YYYY-MM-DD HH:mm:ss'),
      status: faker.helpers.arrayElement(auditStatuses),
    });
  });
  return result;
}

export default defineMock({
  '/api/inquiry/withdraw_audit_list': ({ query }) => {
    const { page = 1, pageSize = 10 } = query;
    const list = withdrawAuditList(Number(pageSize));
    const count = 80;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: Math.ceil(count / Number(pageSize)),
      itemCount: count,
      list,
    });
  },
  '/api/inquiry/audit_record_list': () => {
    const list = auditRecordList(10);
    return resultSuccess({
      list,
    });
  },
  '[POST]/api/inquiry/audit_withdraw': () => {
    return resultSuccess(null);
  },
});
