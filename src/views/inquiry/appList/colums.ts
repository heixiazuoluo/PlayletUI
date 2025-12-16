import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface ListData {
  /** 配置项ID */
  Id: number;
  /** 应用名称 */
  name: string;
  /** 微信小程序AppID */
  appId: string;
  /** 用户链接ID */
  ulinkid: string;
  /** 应用版本号 */
  app_version: string;
  /** 状态：1-启用，0-禁用 */
  status: number;

  /** 公告内容（HTML格式） */
  announcementContent?: string | any;
  /** 公告状态：1-启用，0-禁用 */
  announcementStatus?: 1 | 0;

  /** 风控开启状态 */
  fkStatus?: number;
  /** 微信最多几台手机 */
  fkMaxWeiXin?: number;
  /** IP最多几台手机 */
  fkMaxIp?: number;

  kfQQ?: string;
  enableDualScreenAD?: number;
  /** 小程序密钥（部分隐藏） */
  appSecret?: string;
  /** 账户名称 */
  acName?: string;
  /** 添加时间 */
  addTime?: string;
  /** AES加密密钥 */
  aesKey?: string;
  /** AES加密IV */
  aesIV?: string;
  /** 游戏签名 */
  gameSign?: string;
  /** 游戏URL */
  gameurl?: string;
  /** 下载URL */
  downurl?: string;
  /** Logo图片URL */
  imgLogoUrl?: string;

  /** 应用下载链接 */
  downloadAppUrl?: string;
  /** 用户协议链接 */
  agreement?: string;
  /** 隐私政策链接 */
  privicy?: string;
  /** 备注 */
  remark?: string;
  /** 图标 */
  icon?: string;
  /** 微信AppID */
  weixinAppID?: string;
  /** 微信App密钥 */
  weixinAppSecret?: string;
  /** 微信支付回调URL */
  weixinNotify_url?: string;
  /** 微信证书路径 */
  weixinCerPath?: string;
  /** 微信商户号 */
  weixinMchid?: string;
  /** 微信序列号 */
  weixinSerialNo?: string;
  /** 微信应用名称 */
  weixinAppName?: string;
  /** 微信APIv3密钥 */
  weixinAPIV3?: string;
  /** 是否允许微信提现：1-是，0-否 */
  isWeiXinTiXian?: number;
  /** 最大红包金额（单位：分） */
  max_redpack_amount?: number;

  /** 最大提现次数/金额 */
  maxTiXianCount?: number;
  /** 默认比例 */
  ratioDefault?: number;
  /** csj比例 */
  ratiocsj?: number;
  /** sigmob比例 */
  ratiosigmob?: number;
  /** 小游戏免费解锁剧集数 */
  playletFreeUnlockEpisodes?: number;
  /** 观看激励广告解锁剧集数 */
  lookOneStimulateUnlockEpisodes?: number;
  /** 信息流广告调用间隔 */
  streamLoopCallInterval?: number;
  /** 横幅广告调用间隔 */
  bannerLoopCallInterval?: number;
  /** 客服QQ密钥 */
  kfQQKey?: string;
  /** ulink密钥 */
  ulinkkey?: string;
  /** sigmob广告位1 */
  sigmob1?: number;
  /** sigmob广告位2 */
  sigmob2?: number;
  /** sigmob广告位3 */
  sigmob3?: number;
  /** sigmob广告位4 */
  sigmob4?: number;
  /** sigmob广告位5 */
  sigmob5?: number;
  /** sigmob广告位6 */
  sigmob6?: number;
  /** csj广告位1 */
  csj1?: number;
  /** csj广告位2 */
  csj2?: number;
  /** csj广告位3 */
  csj3?: number;
  /** csj广告位4 */
  csj4?: number;
  /** csj广告位5 */
  csj5?: number;
  /** csj广告位6 */
  csj6?: number;
  /** 登录类型 */
  loginType?: number;
  /** 短视频最大红包金额 */
  max_redpack_amount_shorts?: number;
  /** 激励广告最大红包金额 */
  max_redpack_amount_stimulate?: number;
  /** 横幅广告最大红包金额 */
  max_redpack_amount_banner?: number;
  /** 信息流广告最大红包金额 */
  max_redpack_amount_stream?: number;
  /** 插屏广告最大红包金额 */
  max_redpack_amount_interrupt?: number;
  /** 开屏场景最大红包金额 */
  max_redpack_amount_openscene?: number;

  /** 网站URL */
  webUrl?: string;
  /** 类型ID */
  typeID?: number;
  /** 用户OpenID（可能为空） */
  openid?: string | null;
  /** 弹窗广告调用间隔 */
  popUpLoopCallInterval?: number;
  /** 是否开启其他页面弹窗 */
  isOpenOtherPagepopUp?: number;
  /** 是否开启开屏广告 */
  isOpenOpenscene?: number;
  /** 是否开启插屏广告 */
  isOpenInterrupt?: number;
  /** 是否开启信息流广告 */
  isOpenStream?: number;
  /** 是否开启横幅广告 */
  isOpenBanner?: number;
  /** 是否开启激励广告 */
  isOpenStimulate?: number;
  /** 是否开启短视频广告 */
  isOpenShorts?: number;
  /** 游戏包名 */
  gamePackBag?: string;
  /** 关联ID1 */
  Id1?: number;
  /** 客服ID */
  kfid?: number;
  /** 游戏ID */
  gid?: number;
  /** 添加时间1 */
  addTime1?: string;
  /** 创建者ID */
  CreatorId?: number;
}

export const columns: BasicColumn<ListData>[] = [
  {
    title: 'gid',
    key: 'Id',
    width: 130,
    align: 'center',
    fixed: 'left',
  },
  {
    title: '游戏名',
    key: 'name',
    align: 'center',
  },
  {
    title: '公告',
    key: 'announcementContent',
    ifShow: false,
    align: 'center',
  },
  {
    title: '公告状态',
    key: 'announcementStatus',
    ifShow: false,
    align: 'center',
  },
  {
    title: 'appid',
    key: 'appId',
    align: 'center',
  },
  {
    title: 'ulinkid',
    key: 'ulinkid',
    align: 'center',
  },
  {
    title: '版本号',
    key: 'app_version',
    align: 'center',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
    render(record) {
      return h(
        NTag,
        {
          type: record.status === 1 ? 'success' : 'error',
        },
        {
          default: () => (record.status === 1 ? '启用' : '禁用'),
        }
      );
    },
  },
];
