import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

// 生成随机IP
function randomIP() {
  return [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  ].join('.');
}

// 生成随机日期
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 格式化日期
function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 用户昵称列表
const nicknames = [
  '小明',
  '大白',
  '阿花',
  '小李',
  '王五',
  '张三',
  '李四',
  '赵六',
  '钱七',
  '孙八',
  '周九',
  '吴十',
  '郑冬',
  '王夏',
  '陈秋',
];

// 生成Mock用户数据
function generateUserList(count: number) {
  const list: any[] = [];
  for (let i = 1; i <= count; i++) {
    const hasMaster = Math.random() > 0.3;
    const hasLeader = Math.random() > 0.4;
    const masterIndex = Math.floor(Math.random() * nicknames.length);
    const leaderIndex = Math.floor(Math.random() * nicknames.length);

    list.push({
      userId: 10000 + i,
      nickname: nicknames[Math.floor(Math.random() * nicknames.length)] + i,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      userLevel: Math.floor(Math.random() * 4) + 1,
      masterId: hasMaster ? 10000 + masterIndex : null,
      masterNickname: hasMaster ? nicknames[masterIndex] : '',
      leaderId: hasLeader ? 10000 + leaderIndex : null,
      leaderNickname: hasLeader ? nicknames[leaderIndex] : '',
      totalCoins: Math.floor(Math.random() * 100000),
      totalWithdraw: Math.floor(Math.random() * 10000) / 100,
      availableCoins: Math.floor(Math.random() * 50000),
      status: Math.random() > 0.2 ? 1 : 0,
      registerTime: formatDate(randomDate(new Date(2023, 0, 1), new Date())),
      loginTime: formatDate(randomDate(new Date(2024, 0, 1), new Date())),
      loginIp: randomIP(),
      banCount: Math.floor(Math.random() * 5),
    });
  }
  return list;
}

const userList = generateUserList(100);

export default defineMock({
  // 获取用户管理列表
  '/api/inquiry/user_manage_list': ({ query }) => {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    // 筛选
    let filteredList = [...userList];

    if (query.userId) {
      filteredList = filteredList.filter((item) => item.userId === Number(query.userId));
    }
    if (query.nickname) {
      filteredList = filteredList.filter((item) => item.nickname.includes(query.nickname));
    }
    if (query.masterId) {
      filteredList = filteredList.filter((item) => item.masterId === Number(query.masterId));
    }
    if (query.leaderId) {
      filteredList = filteredList.filter((item) => item.leaderId === Number(query.leaderId));
    }
    if (query.status !== undefined && query.status !== '') {
      filteredList = filteredList.filter((item) => item.status === Number(query.status));
    }

    const total = filteredList.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredList.slice(start, end);

    return resultSuccess({
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
      list,
      total,
    });
  },

  // 加入黑名单
  '[POST]/inquiry/add_blacklist': () => {
    return resultSuccess(null);
  },

  // 修改团长信息
  '[POST]/inquiry/update_leader': () => {
    return resultSuccess(null);
  },
});
