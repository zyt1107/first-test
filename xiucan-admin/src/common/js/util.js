/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
  // http://www.xiucan.com/diancaitest/?orderId=xiucan_7VA1498187378&token=t825&tablenum=0010&platformId=2088302511469061
  // window.alert('href=' + window.location.href); // 完整的 URL // by wangl
  // window.alert('hash=' + window.location.hash); // 从井号 (#) 开始的 URL（锚） #/orderDetail&srcSpm=a13.b43.c2567.2&
  // window.alert('search=' + window.location.search); // 从问号 (?) 开始的 URL（查询部分）. ?orderId=xiucan_7VA1498187378&token=t825&tablenum=0010&platformId=2088302511469061
  // var regPart = /&srcSpm=.+&/g;
  // var res = window.location.hash.match(regPart);
  // console.log('res=' + res);
  // var searchPart = window.location.search.replace('?', '?' + res);
  // console.log('searchPart=' + searchPart);
  // var hashPart = window.location.hash.replace(res, '');
  // console.log('hashPart=' + hashPart);
  // var searchStr = searchPart + hashPart;    // window.location.search + window.location.hash; // by wangl
  var searchStr = window.location.search + window.location.hash; // by wangl
  // console.log('searchStr=' + searchStr);
  searchStr = searchStr.replace(/#\/goods/, ''); // by wangl
  // window.alert('searchStr=' + searchStr);
  // let url = window.location.search;
  let url = searchStr; // by wangl
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);

      if (val.indexOf('#') > -1) { // 如果参数取值错误进行过滤 by wangl
       val = val.substr(0, val.indexOf('#'));
      }
      obj[key] = val;
    });
  }
  return obj;
};
