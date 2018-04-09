<template>
  <div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">
  import {urlParse} from 'common/js/util';
  import header from 'components/header/header.vue';
  import axios from 'axios';
  import VueRouter from 'vue-router'; // by wangl
  const router = new VueRouter(); // by wangl
  // import fastclick from 'fastclick';  // by wangl

//  const ERR_OK = 0;   by xiaozc
  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.cid;
          })()
        },
        urlParam: urlParse(),
        layout: !window.localStorage.getItem('layout') ? 1 : window.localStorage.getItem('layout'), // 菜品图片是否显示  0: 无图模式  1: 有图模式  TODO：未来可扩展
        wechatCodeUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
        aliCodeUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?',
        jsApiData: '',
        clientInfo: '',  // 客户端浏览器类型
        tabShow: true,  //  header 是否显示
        MyInfo: false,  //  我的信息弹窗
        timeout: false,  // 秒付转圈圈
        redirectUri: '', // 重定向路径
        companyData: {},
        aliInfo: {
            // 支付宝应用唯一标识
            // appId: '2016090501851527',
            appId: '',
            // 授权后重定向的回调链接地址(填当前页)
            redirectUri: 'http://www.xiucan.com/diancai/',
            // 应用授权作用域，auth_base （不弹出授权页面，直接跳转，只能获取用户openid）
            scope: 'auth_base',
            // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
            state: 'alipay'
        },
        wechatInfo: {
            // 公众号的唯一标识
            appId: '',
            // appId: 'wxe5b1bb8f2ae60d6c',
            // 授权后重定向的回调链接地址(填当前页)
            redirectUri: 'http://www.xiucan.com/diancai/',
            // 返回类型，请填写code
            responseType: 'code',
            // 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
            scope: 'snsapi_base',
            // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
            state: 'wechat',
            // 必须带此参数
            wechatRedirect: '#wechat_redirect'
        },
        pcClientList: []    // by xiaozc. 秀餐中间件客户端的websocket client json
      };
    },
    created() {
      this.redirectUri = 'http://www.xiucan.com/admin/';    // window.location.href.split('?')[0];
      if (!this.urlParam.token) {
        this.urlParam.token = 't1276';
      }
      if (this.urlParam.token) {
        window.localStorage.setItem('token', this.urlParam.token);
      }
      if (this.urlParam.tablenum) {   // by xiaozc
        window.localStorage.setItem('tablenum', this.urlParam.tablenum);
      }
      if (this.urlParam.openid) {
        sessionStorage.setItem('platformId', this.urlParam.openid);
        location.href = this.redirectUri + '?token=' + localStorage.getItem('token') + '&tablenum=' + localStorage.getItem('tablenum');
      }
      console.log('app.created=' + (new Date()).getTime());
      // fastclick.attach(document.body);
      // by xiaozc
      this.seller.id = '';
      this.seller.name = this.$t('lang.welcomeToOurStore');
      this.seller.description = this.$t('lang.fastest');
      this.seller.deliveryTime = this.$t('lang.fraction');
/*
      this.seller.score = 5;
      this.seller.serviceScore = 5;
      this.seller.foodScore = 5;
      this.seller.rankRate = 5;
      this.seller.minPrice = 0;
      this.seller.deliveryPrice = 0;;
      this.seller.ratingCount = 0;
      this.seller.sellCount = 0;
      this.seller.bulletin = '';
      this.seller.supports = [];
      this.seller.avatar = '';
      this.seller.pics = [];
      this.seller.infos = [];
*/
//      console.log('this.seller.name=' + this.seller.name);
      // window.alert(navigator.userAgent.indexOf('AlipayClient'));
      if (this.urlParam.state && !this.urlParam.token) {
        this.urlParam.token = this.urlParam.state;
        this.urlParam.tablenum = window.localStorage.getItem('tablenum');
      }
      this.$root.urlParam = this.urlParam;
      // window.alert('this.$root.urlParam = ' + JSON.stringify(this.$root.urlParam));
      // console.log('this.$root.urlParam = ' + JSON.stringify(this.$root.urlParam));
      if (!this.$root.urlParam.token) {
        // console.log('no token');
        if (!this.$root.urlParam.shop_id) { // 如果是口碑下面按钮进入点餐会携带shop_id  by wangl
          // console.log('no shopid');
          return;
        }
      }
      if (this.$root.urlParam.lang) {
        this.$i18n.locale = this.$root.urlParam.lang;
        // console.log('this.urlParam.lang:' + this.urlParam.lang);
      }
      if (this.$root.urlParam.table_num) {
        this.$root.urlParam.tablenum = this.$root.urlParam.table_num;
      }
      if (this.$root.urlParam.tablenum) {
        window.localStorage.setItem('tablenum', this.$root.urlParam.tablenum);
      } else {
        window.localStorage.removeItem('tablenum');
      }
      if (navigator.userAgent.indexOf('AlipayClient') >= 0) {
        // window.alert('tabShow');
        this.tabShow = false;
        this.$root.clientInfo = 'AlipayClient';
      }
      if (navigator.userAgent.indexOf('MicroMessenger') >= 0) {
        this.$root.clientInfo = 'MicroMessenger';
      }
      // window.alert(this.tabShow);
      if (!sessionStorage.getItem('platformId')) {
        this.getPlatformId();
      }
    },
    mounted () {
      if (this.$root.urlParam.tag) {
        console.log('------切换至shopList------' + this.$root.urlParam.tag);
        // router.push({path: '/shopList'});
        window.location.href = '#/shopList';
      }
      // console.log('app.mounted.start=' + (new Date()).getTime());
      if (this.$root.urlParam.srcSpm || this.$root.urlParam.bizScenario) {    // from koubei order_dish button
        if (this.$root.urlParam.biz_type === 'online_pay' && this.$root.urlParam.method === 'koubei.catering.order.pay.return') {
          // from koubei online_pay button
            return;
          }
        if (window.location.hash.indexOf('orderDetail') >= 0) {
            router.push('orderDetail');
            // window.location.reload();
        }
        if (window.location.hash.indexOf('goods') >= 0) {
          var url = this.redirectUri + '?table_num=' + this.$root.urlParam.table_num + '&user_id=' + this.$root.urlParam.user_id + '&shop_id=' + this.$root.urlParam.shop_id + '&merchant_pid=' + this.$root.urlParam.merchant_pid + '#/goods';
            window.location.href = url;
            return;
            // router.push('goods');
            // window.location.reload();
        }
      }
      this.$root.eventHub.$on('sendToWebsocket', (res) => { // roomId需要拿到basedata数据的id（cid）
        var url = res; // 'ws://www.xiucan.com:7272'
        // console.log('webSocketUrl=' + url);
        this.connect(url);
      });
      // console.log('app.mounted.end=' + (new Date()).getTime());
    },
    methods: {
      changLanguage(lang) {  // 切换语言
        console.log('切换语言：' + lang);
        this.$i18n.locale = lang;
      },
      miaofu() {
        this.timeout = true;
        // this.connect();   // by xcj
      },
      onOpen(event) {
//        console.log('webSocket.onOpen');
      },
      onMessage(event) {
  //      console.log('webSocket.testOnMessage=' + event.data)
      },
      // 对应于php中htmlspecialchars_decode函数, 对str进行解码操作
      decodeHtmlSpecialChars(str) {
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&quot;/g, '"');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        return str;
      },
      // 对应于php中htmlspecialchars函数, 对str进行编码操作
      encodeHtmlSpecialChars(str) {
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        return str;
      },
      createContentData(cmdStr, rawJsonData) {
        var jsonData = {};
        jsonData['cmd'] = cmdStr;
        if (rawJsonData != null) {
          jsonData['data'] = rawJsonData;
        }
        var jsonString = JSON.stringify(jsonData);
//        jsonString = encodeURI(jsonString)    // by xiaozc. 目前不用encodeURI方式,虽然体积更小,主要是为了兼容以前云端代码
        jsonString = this.encodeHtmlSpecialChars(jsonString);
        return jsonString;
      },
      createSendData(type, toClientId, toClientName, contentData) {   // 都是string类型的参数
        var sendDataString = '{"type":"say","to_client_id":"' + toClientId + '","to_client_name":"' + toClientName + '","content":"' + contentData + '"}';
        // var sendDataString = '{"type":"say","to_client_id":"all","to_client_name":"所有人","content":"' + contentData + '"}';
        return sendDataString;
      },
      deltimeout() {
        console.log('deltimeout');
        if (this.timeout) {
          console.log('if-deltimeout');
        }
      },
      connect(url) {
        console.log('connect');
        var self = this;
       // console.log('time=' + (new Date()).getTime() + '  App.vue.websocket')
        var webSocket = new WebSocket(url);   // by xiaozc. Cloud websocket is 'ws://119.254.103.14:7272'
        webSocket.onopen = function (event) {
          self.onOpen(event);

        // var login_data = '{"type":"login","client_name":"'+name+'","room_id":"'+tableid+'150"}';
        // console.log("websocket握手成功，发送登录数据:"+login_data);
          var roomId = self.$root.baseData.hotel.id;
          console.log('roomId' + roomId);
          var loginData = '{"type":"login","client_name":"web-client-diancai-user3","room_id":' + roomId + '}';
          webSocket.send(loginData);
        };
        self.$root.eventHub.$on('syncorder', function (orderInfoJson) {   // 接收goods.vue并将数据发送至websocket
          // console.log('orderInfoJson=' + JSON.stringify(orderInfoJson));
          if (self.$root.syncOrder || orderInfoJson.status === -2) { // -2表示用户取消加入同桌点菜
            var contentData = self.createContentData('syncorder', orderInfoJson);
            var sendData = self.createSendData('say', 'all', '所有人', contentData);
            webSocket.send(sendData);
          }
        });
        webSocket.onerror = function (event) {
          console.log('webSocket.onerror');
          self.connect(url);    // by xiaozc. websocket连接失败时自动重连,尝试重连的时间间隔默认为5秒
        };
        webSocket.onclosed = function (event) {
          console.log('webSocket.onclosed');
        };
        webSocket.onmessage = function (event) {
          // console.log('onmessage' + event.data);
          // console.log('onmessage执行');
          self.onMessage(event);
//          console.log('time=' + (new Date()).getTime() + ' event.data=' + event.data)
          if (event.data === null || event.data === '') {
            return;
          }
          var jsonData = JSON.parse(event.data);
          if (jsonData.type === 'login' && jsonData.reply === '1') {   // reply为1表示登录成功
            console.log('login-jsonData=' + JSON.stringify(jsonData));
            // webSocket初始化传入数据（用户第一次进入点菜界面）
            if (self.$root.syncOrder) {
              var initSynOrderData = {};
              initSynOrderData.status = -1;
              initSynOrderData.tablenum = self.$root.urlParam.tablenum;
              self.$root.eventHub.$emit('syncorder', initSynOrderData);
              console.log('initSynOrderData' + JSON.stringify(initSynOrderData));
            }
            var clientListObject = jsonData.client_list;

            // 遍历用户列表 找出pc-client 信息 by xcj
            for (var clientId in clientListObject) {
              var clientName = clientListObject[clientId];
              console.log('clientName==' + clientName);
              if (clientListObject[clientId] === 'pc-client') {
                console.log('pc-client clientId==' + clientId);
                var tmpPcClient = {};
                tmpPcClient.id = clientId;
                tmpPcClient.name = clientName;
                self.pcClientList.push(tmpPcClient);
              }
            }
// **********************
// 暂时注释 start
// **********************
            // if (self.pcClientList.length > 0) {
            //   var rawJsonData = {};
            //   rawJsonData.hotelid = self.$root.cid;
            //   rawJsonData.type = '70';
            //   rawJsonData.code = '-1';
            //   rawJsonData.tablenum = self.$root.urlParam.tablenum;

            //   // window.alert('openid=' + self.$root.platformId);
            //   console.log('tablenum=' + self.$root.urlParam.tablenum);
            //   console.log('hotelid=' + self.$root.cid);

            //   var contentData = self.createContentData('createorder', rawJsonData);
            //   console.log('contentData' + JSON.stringify(contentData));
            //   for (var k = 0; k < self.pcClientList.length; k++) {
            //     var pcClient = self.pcClientList[k];
            //     console.log('pcClient=' + pcClient);
            //     var sendData = self.createSendData('say', pcClient.id, pcClient.name, contentData);
            //     console.log('sendData-key.' + k + '=' + JSON.stringify(sendData));

            //     webSocket.send(sendData);
            //     self.pcClientList.splice(0, self.pcClientList.length); // 清空数组 防止push累加
            //   }
            // } else {
            //   // TODO: 中间件不在线的提示信息
            //   self.timeout = false; // 秒付转圈圈停止
            //   self.$root.orderDetailDesc = '中间件不在线';
            //   console.log('app-orderdetaildesc=' + self.$root.orderDetailDesc);
            //   console.log('中间件不在线');
            // }
// **********************
// 暂时注释 end
// **********************
            // var timeoutid = setTimeout(self.deltimeout(), 5000);
            // console.log('timeoutid=' + timeoutid);
            console.log('time=' + (new Date()).getTime() + '  jsonData.content=login success');

            // var timeoutid = setTimeout(self.deltimeout(), 5000);
            // console.log('timeoutid=' + timeoutid);
          }
          if (jsonData.type === 'say') {
            // jsonData.content = JSON.parse(self.decodeHtmlSpecialChars(jsonData.content));
            jsonData.content = self.decodeHtmlSpecialChars(jsonData.content);
            jsonData.content = jsonData.content.replace(/\r\n/g, '');
            // jsonData.content = jsonData.content.replace(/\\"/g, '"');
            // console.log('jsonData.content=' + jsonData.content);
            var jsonDataObject = JSON.parse(jsonData.content);
            // console.log('jsonDataObject=' + JSON.stringify(jsonDataObject));
// **************************
// 暂时屏蔽秒付订单逻辑 start
// **************************
            // for (var item in jsonDataObject) {
            //   // 判断对象中是否存在某个属性
            //   if (jsonDataObject[item].hasOwnProperty('desc')) {
            //     self.timeout = false; // 秒付转圈圈停止
            //     console.log(jsonDataObject[item]);
            //     if (window.localStorage.getItem('orderId')) {
            //       // self.timeout = false; // 秒付转圈圈停止
            //       router.push('orderDetail');
            //     } else {
            //       // window.alert('App.342line.platformId=' + self.$root.platformId);
            //       axios.post('http://www.xiucan.com/api/v2/miaodan/miaodan.php',
            //       {
            //         data: jsonData.content,
            //         openid: self.$root.platformId,
            //         orderChannel: 'miaodan'
            //       }).then(function (res) {
            //         // self.timeout = false; // 秒付转圈圈停止
            //         var response = res.data;
            //         console.log('response1==' + JSON.stringify(response));

            //         if (response.status === 0) {
            //           window.localStorage.setItem('orderId', response.message);
            //           router.push('orderDetail');
            //           console.log('秒付订单号==' + response.message);
            //         } else {
            //           console.log('秒付订单创建失败');
            //         }
            //       }).catch(function(error) {
            //         console.log(jsonData.content);
            //         console.log('秒付订单创建失败，请重试。失败原因=' + error);
            //       });
            //     }
            //   } else {
            //     self.timeout = false; // 秒付转圈圈停止
            //     // console.log('未能查询到相应订单');
            //   }
            // }
// **************************
// 暂时屏蔽秒付订单逻辑 end
// **************************

            // if (jsonData.content.cmd) {
            // console.log('jsonDataObject:' + JSON.stringify(jsonDataObject));
            if (jsonDataObject.cmd) {
              console.log('cmd==cmd');
              var cmdReply = jsonDataObject.cmd;
              console.log('cmsReply==' + cmdReply);
              switch (cmdReply) {   // 从websocket server端回来的消息是在原消息的cmd基础上补加reply字符
                case 'getbasedatareply':
                  self.$root.baseData = jsonData;     // jsonData定义为完整的json数据(type:say的websocket完整格式)
                  self.$root.eventHub.$emit(cmdReply, {data: self.$root.baseData});
                  break;
                case 'confirmpay':
                  console.log('enter');
                  console.log(window.localStorage.getItem('orderId'));
                  console.log('jsonDataObject.data.orderid==' + jsonDataObject.data.orderid);
                  console.log('jsonDataObject.data.status==' + jsonDataObject.data.status);
                  if (jsonDataObject.data.orderid === window.localStorage.getItem('orderId')) {
                      console.log('orderId');
                    if (jsonDataObject.data.status === '1') {
                      console.log('success');
                        self.$root.payStatus = true;
                    }
                  }
                  break;
                case 'syncorderreply':
                  // console.log('jsonDataObject=' + jsonDataObject);
                  if (self.$root.syncOrder) {
                    self.$root.eventHub.$emit('syncSelectFoods', jsonDataObject.data);    // 发送至goods.vue，同步客户端goods JSON
                  }
                  break;
                default:
                  ;
              }
            }
            // console.log('time=' + (new Date()).getTime() + '  App.vue.webSocket.seller=' + self.seller)
          }
        };
      },
      getMyInfo() {
        this.MyInfo = true;
        this.toggleCircleMenu();
      },
      closeInfo() {
        this.MyInfo = false;
      },
      toggleCircleMenu() { // by wangl
        // console.log('app.toggleCircleMenu:ok');
        this.$root.eventHub.$emit('toggleCircleMenu');
      },
      showHeader(option) {
        this.$root.showHeader = option;   // by xiaozc. option is true or false
      },
      getAliCodeUrl() { // by wangl
        return this.aliCodeUrl + 'app_id=' + this.aliInfo.appId + '&scope=' + this.aliInfo.scope + '&redirect_uri=' + encodeURI(this.redirectUri) + '&state=' + this.$root.urlParam.token;
      },
      getWechatCodeUrl() { // by wangl
          return this.wechatCodeUrl + 'appid=' + this.wechatInfo.appId + '&redirect_uri=' + encodeURI(this.redirectUri) + '&response_type=' + this.wechatInfo.responseType + '&scope=' + this.wechatInfo.scope + '&state=' + this.$root.urlParam.token + this.wechatInfo.wechatRedirect;
      },
      getPlatformId() { // by wangl
        if (this.$root.clientInfo === 'AlipayClient') {
          // 标识是口碑秒付进入
          if (this.$root.urlParam.biz_type === 'online_pay' && this.$root.urlParam.method === 'koubei.catering.order.pay.return') {
            // window.alert('app.getPlatformId = enter koubei online_pay');
            this.$root.platformId = this.$root.urlParam.user_id;
          }
          // 用户服务窗进入会带用户标识by wangl
          if (this.$root.urlParam.platformId && this.$root.urlParam.orderId) {
            // window.alert('app.getPlatformId = server port enter');
            this.$root.platformId = this.$root.urlParam.platformId;
            // window.alert('App.419_line.platformId=' + this.$root.platformId);
          }
          if (this.$root.urlParam.shop_id && this.$root.urlParam.user_id) {
            // window.alert(' from koubei ');
            this.$root.platformId = this.$root.urlParam.user_id;
          }
          if (!this.$root.platformId) {
            // window.alert('app.getPlatformId = no platformId');
            this.getAliUserId();
          }
          // window.alert('app.platformId=' + this.$root.platformId);
        }
        if (this.$root.clientInfo === 'MicroMessenger') {
          if (this.$root.urlParam.openid) { // 1.0扫码进入 不在重复获取openid; by wangl
              this.$root.platformId = this.$root.urlParam.openid;
              if (this.$root.platformId.length > 28) {
                this.$root.platformId = this.$root.platformId.substr(0, 28);
              }
          }
          // 用户服务窗进入会带用户标识by wangl
          if (this.$root.urlParam.platformId && this.$root.urlParam.orderId) {
            this.$root.platformId = this.$root.urlParam.platformId;
          }
          if (!this.$root.platformId) {
            this.getOpenId();
          }
        }
        if (this.$root.clientInfo === '') {
          // TODO: 普通浏览器客户端也能支持
        }
      },
      getAliUserId() { // by wangl
        // window.alert('enter getAliUserId');
        var self = this;
        // window.alert('enter getAliUserId');
        // 判断url是否已经有auth_code，有则不获取，没有就去获取
        if (!self.urlParam.auth_code) {
          // window.alert('没有auth_code');
          var restUrl = 'http://www.xiucan.com/api/v2/getcloudbasedata/' + self.$root.urlParam.token;    // 'static/data.json'     // TODO: 未来改为专门的获取支付配置的接口. by xiaozc
          axios.get(restUrl).then((res) => {
            // console.log('xiucan.res.data=' + JSON.stringify(res.data));
            self.$root.payConfig = res.data.payconfig;
            window.localStorage.setItem('payConfig', res.data.payconfig);
            // self.aliInfo.appId = '2016090501851527'; // 口碑市场应用appid 扫码点菜
            self.aliInfo.appId = '2015123101057360'; // 口碑市场应用appid 码上付
            // window.alert('self.aliInfo.appId = ' + self.aliInfo.appId);
            // 重定向去支付宝来获取auth_code
            window.location = self.getAliCodeUrl();
          });
          return;
        }
        // window.alert('有auth_code');
        self.$root.urlParam.code = self.urlParam.auth_code;  // 统一微信支付宝授权code

        axios.get('http://www.xiucan.com/payservice/util/baseinfo.php?auth_code=' + self.urlParam.auth_code + '&app_id=2015123101057360')
          .then(function (res) {
              // window.alert('请求成功');
              self.$root.platformId = res.data;
              sessionStorage.setItem('platformId', res.data); // 页面初次加载存储platformId(aliuserid)，避免刷新页面获取不到（TODO：待优化
              // window.alert('self.$root.platformId=' + self.$root.platformId);
              // window.alert('self.$root.urlParam = ' + JSON.stringify(self.$root.urlParam));
          }, function(error) {
              console.log(JSON.stringify(error));
          });
      },
      getOpenId() { // by wangl
        var self = this;
        if (!self.urlParam.code) {
          self.$root.urlParam.token = 't1276';
          var restUrl = 'http://www.xiucan.com/api/v2/getcloudbasedata/' + self.$root.urlParam.token;   // TODO: 未来改为专门的获取支付配置的接口. by xiaozc
          // var restUrl = 'static/data.json';
          axios.get(restUrl).then((res) => {
            sessionStorage.setItem('cid', res.data.hotel.id); // å­˜å‚¨cidåˆ°sessionStorage
             // [{"wechatpay":{"channel":"wx_pub","partner":"wxpay_zjtb","appid":"wxe5b1bb8f2ae60d6c"}},{"alipay":{"channel":"ali_wap","partner":"xingye","appid":"wxe5b1bb8f2ae60d6c"}}]
            self.$root.payConfig = res.data.payconfig;
            // console.log('app.openid=' + JSON.stringify(self.$root.payConfig));
            var payTypeMap = { AlipayClient: 'alipay', MicroMessenger: 'wechatpay' };
            // console.log('payTypeMap =' + payTypeMap[self.$root.clientInfo]);
            var payConfigJson = self.$root.getPayConfig(payTypeMap[self.$root.clientInfo]);
            self.wechatInfo.appId = payConfigJson.appid;
            sessionStorage.setItem('payConfigJson', JSON.stringify(payConfigJson)); // 存储payconfigjson
// ************************
// 决定是否请求会员接口 start
// ************************
            var memberConfig = res.data.payconfig.some((item) => { // 判断门店是否配置会员支付
              // console.log(item + item.paytype);
              return item.paytype === 'membercard';
            });
            sessionStorage.setItem('memberConfig', memberConfig); // 存储到session 布尔类型
            sessionStorage.setItem('payMode', res.data.hotel.paymode); // 存储到session（先付或者后付模式）
// ************************
// 决定是否请求会员接口 end
// ************************
            // console.log('appId1 = ' + JSON.stringify(payConfigJson.appid));
            // window.alert('appId2 = ' + self.wechatInfo.appId);
            // return;
            // 重定向去微信来获取code
            if (payConfigJson.partner === 'weishouyin') {
              location.href = 'http://www.xiucan.com/payservice/partner/weishouyin/GetOpenid.php';
            } else {
              window.location = self.getWechatCodeUrl();
            }
          });
          return;
        }
        axios.get('http://www.xiucan.com/payservice/util/baseinfo.php?code=' + self.urlParam.code + '&cid=' + sessionStorage.getItem('cid'))
          .then(function (res) {
            // alert('数据：' + JSON.stringify(res));
            self.$root.platformId = res.data;
            self.$root.userInfo.id = res.data;
            if (!sessionStorage.getItem('platformId')) {
              sessionStorage.setItem('platformId', res.data); // 页面初次加载存储platformId(openid)，避免刷新页面获取不到（TODO：待优化
            }
            self.$root.eventHub.$emit('loadStore'); // 加载门店列表（home.vue）
            if (sessionStorage.getItem('memberConfig') === 'true' && sessionStorage.getItem('payMode') === '0') { // 如果有配置会员支付并且先付模式
              // 查询是否为会员  strat ********************
              for (var i = 0; i < self.$root.baseData.payconfig.length; i++) {
                if (self.$root.baseData.payconfig[i].paytype === 'membercard') {
                  self.$root.memberName = self.$root.baseData.payconfig[i].partner;
                  break;
                }
              }
              var rest = '';
              rest = 'http://www.xiucan.com/api/v2/memberinfo/' + self.$root.memberName + '/' + sessionStorage.getItem('platformId');
              // rest = 'http://www.xiucan.com/api/v2/memberinfo/' + self.$root.memberName + '/odn6QuOCf7IOno1ZlMb-b_fcQVfg';  // 触联
              // rest = 'http://www.xiucan.com/api/v2/memberinfo/' + self.$root.memberName + '/owvpLt3W75rYCNYgHtjcznzFnRx4';  // 5icrm
              axios.get(rest).then((response) => { // 请求触联会员接口查询是否为会员
                var resData = response.data;
                console.log('会员查询结果' + JSON.stringify(resData));
                if (resData.CardBalance || (resData.result && resData.result.code === 0)) {
                  self.$root.member.memberLevel = 1;
                  self.$root.eventHub.$emit('changePayMethod'); // 更改默认选择支付方式为会员支付
                }
                if (resData.result && resData.result.code === 0) { // 5icrm
                  self.$root.member.balance = resData.consuVo.consuDetailList[0].memberAmount;
                }
                // self.$root.member.memberBalance.CardNO = resData.consuVo !== null ? resData.consuVo.consuDetailList[0].memberId : null;
                self.$root.member.memberBalance = resData;
              });
              // 查询是否为会员  end ********************
            }
          }, function(error) {
            console.log(JSON.stringify(error));
          });
      },
      // 无图，有图模式切换 by chuangjing
      changeLayout() {
        console.log('切换layout');
        if (window.localStorage.getItem('layout') === '0') {
          console.log('this.layout === 1');
          this.layout = 1;
        } else {
          console.log('this.layout === 0');
          this.layout = 0;
        }
        // 采用localStorage 记住 当前模式 增加用户体验 by chuangjing
        window.localStorage.setItem('layout', this.layout);
        this.$root.eventHub.$emit('layoutRetrived', window.localStorage.getItem('layout'));
        console.log('window.localStorage.getItem(layout)==' + this.layout);
      },
      circleMenu() { // 控制悬浮菜单文字的display
        var mask = document.getElementsByClassName('oy-mask-black');
        var navMenuText = document.getElementsByClassName('mysty');
        var navMenu = document.getElementsByClassName('circle_img');
        for (var i = 0; i < navMenuText.length; i++) {
          if (navMenuText[i].style.display === 'none') {
            navMenuText[i].style.display = 'block';
            mask[0].addEventListener('click', function () {
              for (var k = 0; k < navMenuText.length; k++) {
                navMenuText[k].style.display = 'none';
              }
            });
            for (var g = 0; g < navMenu.length; g++) {
              navMenu[g].addEventListener('click', function () {
                for (var j = 0; j < navMenuText.length; j++) {
                  navMenuText[j].style.display = 'none';
                }
              });
            }
          } else {
            navMenuText[i].style.display = 'none';
          }
        }
      }
    },
    components: {
      'v-header': header
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>

<style>
  .button_menu {
    position: relative;
    width: 28px;
    left: -5px;
    top: -3px;
  }
  .circle_img {
  }
  .mysty {
    position: relative;
    display: block;
    right: 80px;
    width: 80px;
    color: white;
    top: -51px;
    font-size: 12px;
  }
  .mymenu {
    height: 48px;
    position: fixed;
    right: -20px;
    z-index: 10;
  }
  .middle-around .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_1 {
    right: 84px !important;
    top: -35px !important;
  }
  .middle-around .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_2 {
    left: -30px !important;
    top: 80px !important;
  }
  .middle-around .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_3 {
    left: -84px !important;
    top: 35px !important;
  }
  .middle-around .oy-menu-group.open .btn-list .oy-menu-item.oy-menu-item_4 {
    left: 50px !important;
    top: 0px !important;
  }
  .blue {
    background-color:#F1BC4C !important;
  }
  .purple {
    background-color: #757575 !important;
  }
  .yellow {
    background-color: #7ECDF4 !important;
  }
  .green {
    background-color: #FF6600 !important;
  }
  .pink {
    background-color: #3391DD !important;
  }
  .myInfoModal {
    opacity: 1 !important;
    display: block !important;
  }
  .changLanguage{ /*中英文切换*/
    float:left;
    background:rgb(101, 107, 113);
    height:28px;
    line-height:28px;
  }
  .changLanguage span{
    display: inline-block;
    background: #f3f5f7;
    width: 35px;
    text-align: center;
  }
  .paydirectly{ /*直接付款*/
    background:#00a0dc;
    width:77px;
    text-align:center;
    color:#fff;
    font-size: 12px;
  }
</style>