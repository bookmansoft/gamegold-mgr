/**
 * 获取权限设定信息
 * @description 使用 sessionStorage 在窗口生命期内缓存权限设定信息。注意如果使用 localStorage 将使得权限设定拥有长效期
 * @param {*} str could be 'admin', ['admin', 'user']
 */
export function getAuthority(str) {
  let authority = str || sessionStorage.getItem('currentAuthority') || 'guest';

  if(typeof authority === 'string') {
    try {
      //猜测其形式有可能是 '["admin", "user"]' | "["admin"]"
      authority = JSON.parse(authority);
    } catch(e) {
      //猜测其形式有可能是 'admin, user' | 'admin'
      authority = authority.split(',');
    }
  }

  authority = !Array.isArray(authority) ? [authority] : authority;
  return authority;
}

/**
 * 设置权限设定信息
 * @param {*} authority 
 */
export function setAuthority(authority) {
  //防止 authority 为 null
  authority = authority || 'guest'; 

  if(typeof authority === 'string') {
    try {
      //猜测其形式有可能是 '["admin", "user"]' | "["admin"]"
      authority = JSON.parse(authority);
    } catch(e) {
      //猜测其形式有可能是 'admin, user' | 'admin'
      authority = authority.split(',');
    }
  }

  const proAuthority = !Array.isArray(authority) ? [authority] : authority;
  return sessionStorage.setItem('currentAuthority', JSON.stringify(proAuthority));
}
