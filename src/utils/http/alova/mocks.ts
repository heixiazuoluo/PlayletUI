// 这里按需导入 mock 文件，只有在这里导入并导出，才会执行 mock 拦截
// 跟根据实际开发情况配置
import UserMock from '../../../../mock/user';
import MenusMock from '../../../../mock/user/menus';
import ConsoleMock from '../../../../mock/dashboard/console';
import TableMock from '../../../../mock/table/list';
import UserTableMock from '../../../../mock/table/userList';
import SystemMenuMock from '../../../../mock/system/menu';
import SystemRoleMock from '../../../../mock/system/role';
import UserManageMock from '../../../../mock/inquiry/userManage';
import ProfitMock from '../../../../mock/inquiry/profit';
import ProductRecommendMock from '../../../../mock/dataManage/productRecommend';
import AdManageMock from '../../../../mock/inquiry/adManage';
import AdCodeManageMock from '../../../../mock/inquiry/adCodeManage';
import CoinRecordMock from '../../../../mock/inquiry/coinRecord';
import AdRevenueMock from '../../../../mock/inquiry/adRevenue';
import AbnormalDataMock from '../../../../mock/inquiry/abnormalData';
import WithdrawRecordMock from '../../../../mock/inquiry/withdrawRecord';
import WithdrawFlowMock from '../../../../mock/inquiry/withdrawFlow';
import WithdrawAuditMock from '../../../../mock/inquiry/withdrawAudit';

export default [
  UserMock,
  MenusMock,
  TableMock,
  ConsoleMock,
  SystemMenuMock,
  SystemRoleMock,
  UserTableMock,
  UserManageMock,
  ProfitMock,
  ProductRecommendMock,
  AdManageMock,
  AdCodeManageMock,
  CoinRecordMock,
  AdRevenueMock,
  AbnormalDataMock,
  WithdrawRecordMock,
  WithdrawFlowMock,
  WithdrawAuditMock,
];
