import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取登录验证码（返回图片blob）
 */
export async function getCode(): Promise<string> {
  const response = await fetch('/api/am/v1/account/captcha', {
    method: 'GET',
    credentials: 'include',
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return Alova.Post<InResult>(
    '/am/v1/account/login',
    {
      ...params,
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/admin_info', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, params);
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/login/logout', {
    params,
  });
}
