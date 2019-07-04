// /userinfo/2144/id => ['/userinfo','/userinfo/2144,'/userinfo/2144/id']
// eslint-disable-next-line import/prefer-default-export
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}
