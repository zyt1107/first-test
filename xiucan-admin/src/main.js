import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
// xiucan-admin========================================
import register from 'components/admin/shop/register';
import guide from 'components/admin/shop/guide';
import manage from 'components/admin/shop/manage';
import food from 'components/admin/food/food';
import commodityreport from 'components/admin/shop/commodityReport.vue';
import restaurantorder from 'components/admin/shop/restaurantOrder.vue';
import setup from 'components/admin/setup/setup';
import shopmanage from 'components/admin/shop/shopManage';
import table from 'components/admin/table/table';
import print from 'components/admin/setup/print';
import reportlist from 'components/admin/shop/reportList.vue';
import timereport from 'components/admin/shop/timeReport.vue';
import ordercondition from 'components/admin/shop/orderCondition.vue';
import ordertypereport from 'components/admin/shop/orderTypeReport.vue';
import paytypereport from 'components/admin/shop/payTypeReport.vue';
import overviewreport from 'components/admin/shop/overviewReport.vue';
// xiucan-admin========================================

import goods from 'components/goods/goods';
import packages from 'components/package/package';
import pay from 'components/pay/pay';

import orderDetail from 'components/order/orderDetail.vue'; // by wangl
import home from 'components/home/home.vue'; // by wangl
import orderList from 'components/order/orderList.vue'; // by wangl

import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import success from 'components/success/success';     // by haoguozhao

import member from 'components/member/member';			// by shaomeng
import coupons from 'components/coupons/coupons';		// by shaomeng
import giftcard from 'components/giftcard/giftcard';	// by shaomeng
import balance from 'components/balance/balance';		// by shaomeng
import memberBalance from 'components/balance/memberBalance';  // by shaomeng
import bonus from 'components/bonus/bonus'; // by shaomeng
import recharge from 'components/recharge/recharge'; // by shaomeng
import shopList from 'components/shopList/shopList.vue';
import selectedMap from 'components/selectedMap/selectedMap.vue';
import comment from 'components/comment/comment.vue';
import VueI18n from 'vue-i18n';   // by limengxu
import { DatetimePlugin, CloseDialogsPlugin, ConfigPlugin, BusPlugin, LocalePlugin, DevicePlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, WechatPlugin, AjaxPlugin, AppPlugin } from 'vux';  // by limengxu

import 'common/stylus/index.styl';

import axios from 'axios'; // by wangl

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueI18n);
Vue.use(AlertPlugin);
Vue.use(ToastPlugin);
Vue.use(DatetimePlugin);

import vmodal from 'vue-js-modal';    // by chuangjing
Vue.use(vmodal);
import ToggleButton from 'vue-js-toggle-button';  // by chuangjing
Vue.use(ToggleButton);

import CircleMenu from 'vue-circle-menu';   // by wangl
Vue.component('CircleMenu', CircleMenu);   // by wangl

const routes = [{
  path: '/',
  redirect: '/home'    // by xiaozc.       /home   /goods
}, {
  // xiucan-admin---------------------------------
  path: '/home',
  component: home
}, {
  path: '/register',
  component: register
}, {
  path: '/manage/:cid/:token',
  name: 'manage',
  component: manage
}, {
  path: '/food',
  name: 'food',
  component: food
}, {
  path: '/commodityreport/:cid/:token',
  name: 'commodityreport',
  component: commodityreport
}, {
  path: '/restaurantorder/:cid/:token',
  name: 'restaurantorder',
  component: restaurantorder
}, {
  path: '/setup/:cid/:token',
  name: 'setup',
  component: setup
}, {
  path: '/shopmanage/:token',
  name: 'shopmanage',
  component: shopmanage
}, {
  path: '/table/:cid/:token',
  name: 'table',
  component: table
}, {
  path: '/print/:cid',
  name: 'print',
  component: print
}, {
  path: '/reportlist/:cid/:token',
  name: 'reportlist',
  component: reportlist
}, {
  path: '/ordercondition/:cid/:token',
  name: 'ordercondition',
  component: ordercondition
}, {
  path: '/overviewreport/:cid/:token',
  name: 'overviewreport',
  component: overviewreport
}, {
  path: '/paytypereport/:cid/:token',
  name: 'paytypereport',
  component: paytypereport
}, {
  path: '/timereport/:cid/:token',
  name: 'timereport',
  component: timereport
}, {
  path: '/ordertypereport/:cid/:token',
  name: 'ordertypereport',
  component: ordertypereport
}, {
  path: '/guide/:cid/:token',
  name: 'guide',
  component: guide
  // xiucan-admin--------------------------------
}, {
  path: '/goods/:token',
  name: 'goods',
  component: goods
}, {
  path: '/packages',
  component: packages
}, {
  path: '/pay',
  component: pay
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}, {  // by wangl
  path: '/orderDetail',
  name: 'orderDetail',
  component: orderDetail
}, {  // by wangl
  path: '/orderList',
  component: orderList
}, {  // by haoguozhao
  path: '/success',
  component: success
}, {	// by shaomeng
	path: '/member',
	component: member
}, { // by shaomeng
	path: '/coupons',
	component: coupons
}, {	// by shaomeng
	path: '/giftcard',
	component: giftcard
}, {	// by shaomeng
	path: '/balance',
	component: balance
}, {  // by shaomeng
  path: '/memberBalance',
  component: memberBalance
}, {  // by shaomeng
  path: '/bonus',
  component: bonus
}, { // by shaomeng
  path: '/recharge',
  component: recharge
}, {    // by limengxu
  path: '/shopList',
  component: shopList
}, {    // by limengxu
  path: '/selectedMap',
  component: selectedMap
}, {    // by limengxu
  path: '/comment',
  name: 'comment',
  component: comment
}];

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
});

const i18n = new VueI18n({
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': require('./common/lang/zh-CN'),
    'en': require('./common/lang/en')
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App),
  data: {   // by xiaozc
    eventHub: new Vue(),
    urlParam: {},
    baseData: {},
    balanceData: [], // by shaomeng
    payConfig: [],  // by wangl
    platformId: '', // by wangl
    newOrder: {},  // by wangl
    selectedOrderId: '', // by wangl
    cid: 0, // by xcj
    orderDetailDesc: '',
    cloneFoodList: null,    // by xiaozc. 不合并点菜单项时的clone菜品列表
    qrCodeUrl: '',
    payStatus: false,
    storeinfo: {},
    showHeader: true,
    paymentTag: true, // 购物车是否显示支付方式
    peopleList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // 购物车人数选择列表
    cartControlMountedCount: 0,  // by xiaozc. TODO: 临时办法解决搜索得到空结果再点加后数量增加异常的问题(memorequire=1,2,3)
    member: { // 会员信息
      memberLevel: 0, // 会员等级（暂未启用）
      memberBalance: {}, // 会员余额信息
      memberPay: false, // 支付方式(是否为会员支付)
      password: '', // 会员支付密码
      balance: 0 // 5icrm
    },
    peopleNum: '',  // 就餐人数
    userInfo: { // 用户信息
      id: '',
      nickName: '',
      userPic: ''
    },
    sharedOrder: true, // 加入同桌点菜
    syncOrder: false, // 是否开启同桌点菜
    type: 10,    // 10: 堂食   20:堂食打包  30:外卖  40:预约   50: 自提
    memberName: ''  // 餐厅会员名称
  },
  methods: {
    getPayConfig(paytype) { // by wangl
      // window.alert('this.$root.payConfig.main = ' + JSON.stringify(this.$root.payConfig));
      // window.alert('this.$root.payConfig.length = ' + this.$root.payConfig.length);
      // window.alert('this.$root.payConfig.main = ' + JSON.stringify(this.$root.payConfig.length));
      // window.alert('this.$root.payConfig.main.this.$root.clientInfo = ' + this.$root.clientInfo);
      // if (this.$root.payConfig.length === 0 && paytype === 'alipay') { // 暂时屏蔽口碑支付，逻辑后台处理
      //   var payConfigJsonStr = {};
      //   payConfigJsonStr.partner = 'xunka';
      //   payConfigJsonStr.channel = 'ali_create';
      //   return payConfigJsonStr;
      // }
      // window.alert('this.$root.payConfig.main = ' + JSON.stringify(this.$root.payConfig));
      for (var i = 0; i < this.$root.payConfig.length; i++) {
        if (this.$root.payConfig[i].paytype === paytype) {
          // if (this.$root.payConfig[i].paytype === 'alipay') { // 暂时屏蔽口碑支付，逻辑后台处理
          //   this.$root.payConfig[i].partner = 'xunka';
          //   this.$root.payConfig[i].channel = 'ali_create';
          // }
          return this.$root.payConfig[i];
        }
      }
      return {};
    },
    goPay(orderJson) { // TODO: 未来将参数改成活数据 // by wangl
      if (!orderJson.order_type) {
        orderJson.order_type = '';
      }
      if (!this.$root.urlParam.shop_id) {
        this.$root.urlParam.shop_id = '';
      }
      if (this.$root.urlParam.shop_id.indexOf('orderDetail')) {
        this.$root.urlParam.shop_id = this.$root.urlParam.shop_id.replace('#/orderDetail', '');
      }
      // window.alert('this.$root.clientInfo=' + this.$root.clientInfo);
      var payTypeMap = { AlipayClient: 'alipay', MicroMessenger: 'wechatpay' };
      // console.log('payTypeMap = ' + payTypeMap[this.$root.clientInfo]);
      var payConfigJson = JSON.parse(JSON.stringify(this.getPayConfig(payTypeMap[this.$root.clientInfo])));
      // console.log('payConfigJson = ' + JSON.stringify(payConfigJson));
      // window.alert('payConfigJson.orderJson.order_type = ' + orderJson.order_type);
      // window.alert('payConfigJson.channel = ' + payConfigJson.channel);
      // window.alert('payConfigJson.partner = ' + payConfigJson.partner);
      // window.alert('self.$root.platformId = ' + this.$root.platformId);
      console.log('orderJson.partner=' + orderJson.partner);
      console.log('orderJson.channel=' + orderJson.channel);
      console.log('this.$root.platformId=' + this.$root.platformId);
      if (orderJson.hasOwnProperty('partner')) { // 判断orderJson 是否含有partner属性；
           if (orderJson.partner !== 'undefined' && orderJson.channel !== 'undefined') { // 待修改
          payConfigJson.channel = orderJson.channel;
          payConfigJson.partner = orderJson.partner;
          this.$root.platformIdNew = this.$root.platformId;
          this.$root.platformId = '';
        }
      }
      var self = this;
      var data = {
        channel: payConfigJson.channel,
        partner: payConfigJson.partner,
        WIDout_trade_no: orderJson.orderId,
        WIDsubject: orderJson.companyName,
        WIDtotal_amount: orderJson.price,    // orderJson.price,
        WIDbody: '详情',
        orderInfo: orderJson.dishinfo,
        openid: sessionStorage.getItem('platformId'),
        order_type: orderJson.order_type,
        shop_id: self.$root.urlParam.shop_id,
        user_id: self.$root.platformId,
        ali_returnUrl: window.location.href.split('#')[0] + '&orderId=' + orderJson.orderId + '&user_id=' + self.$root.platformId + '#/orderDetail',
        goods_tag: '',
        cid: sessionStorage.getItem('cid') // 门店id
      };
      // console.log('支付前data=' + JSON.stringify(data));
      if (orderJson.partner === '5icrm') {    // 此处判定应用orderJson.partner判定，待后台补好，再改
        console.log('执行5icrm会员支付');
        data = {
          partner: orderJson.partner,
          codeType: '3',
          memberId: String(self.$root.member.memberBalance.consuVo.consuDetailList[0].memberId),
          cashPayType: '4',
          payType: '1',
          payCash: '0',
          amount: String(localStorage.getItem('orderTotalPrice')),
          rewardAmount: '0',
          score: '0',
          memberPromCouponIds: String(orderJson.memberPromCouponIds),
          AmountDetail: String(self.$root.member.memberBalance.consuVo.consuDetailList[0].memberCardListVo[0].id) + ',' + Number(orderJson.price).toFixed() // 会员卡号 + , + 金额
        };
        // console.log('5icrm请求值=' + JSON.stringify(data));
        axios.post('http://www.xiucan.com/api/v2/memberpay', data).then((res) => {
          console.log('5icrm返回值=' + JSON.stringify(res.data) + '\ntype:' + typeof res.data);
           if (self.$root.member.memberPay) { // 支付方式为会员支付
              if (res.data.consuPrintVo === null) {
                self.$root.eventHub.$emit('cancleOrderHandling'); // 取消订单处理中提示
                alert(res.data.result.msg + ',请重试');
                return;
              }
            }
            router.push('orderDetail');
        });
      } else {
        if (self.$root.member.memberPay) { // 会员支付请求数据
          // window.alert('memberPay' + orderJson.orderId);
          var amount = Number(orderJson.price).toFixed(0);
          data = {
              partner: orderJson.partner,
              channel: orderJson.channel,
              CardNO: self.$root.member.memberBalance.CardNO,
              CardPSW: self.$root.member.password,
              OpenID: self.$root.member.memberBalance.OpenID,
              OrderNO: orderJson.orderId,
              Amount: amount
          };
        }
        console.log(data);
        axios.post('http://www.xiucan.com/payservice/util/charge.php', data).then(function (res) {
            var response = res.data;
            // window.alert('goPay.then.response = ' + JSON.stringify(res));
            if (self.$root.member.memberPay) { // 支付方式为会员支付
              if (response.ResponseText && response.ResponseText !== '交易成功') {
                self.$root.eventHub.$emit('cancleOrderHandling'); // 取消订单处理中提示
                alert(response.ResponseText + ',请重试');
                return;
              }
            }
            console.log('goPay.then.response = ' + JSON.stringify(res));
            if (payConfigJson.partner === 'wxpay_zjtb') {
                    if (payConfigJson.channel === 'wx_pub') {
                        // return;
                        window.location.href = 'http://payment.chinatongpay.com/Payment/Trade?' + response;
                    }
                    if (payConfigJson.channel === 'ali_wap') {
                        return;
                        // window.location.href=response;
                    }
            }
            if (payConfigJson.partner === 'chulian') { // 触联
                if (payConfigJson.channel === 'membercard') {
                  router.push('orderDetail');
                  // window.location.reload(); // TODO:后续优化不使用跳转 by wangl
                }
                if (payConfigJson.channel === 'wx_pub') {
                    // alert('chulian.response = ' + response);
                    // 异步地址在触联那边 需要触联配置
                    // console.log("chulian.resultJson1=" + response);
                    self.callpay(response);
                }
                if (payConfigJson.channel === 'ali_wap') {
                    return;
                    // window.location.href=response;
                }
            };
            if (payConfigJson.partner === 'xingye') {
                if (payConfigJson.channel === 'wx_pub') {
                    window.location.href = 'https://pay.swiftpass.cn/pay/jspay?token_id= ' + response + '&showwxtitle=1';
                }
                if (payConfigJson.channel === 'ali_wap') {
                    window.location.href = response;
                }
            };
            if (payConfigJson.partner === 'xunka') {
                if (payConfigJson.channel === 'wx_pub') {
                    return;
                    // console.log(response);
                    // console.log("resultJson1=" + response);
                    // self.callpay(response);
                }
                if (payConfigJson.channel === 'ali_create') {
                    // window.alert(orderJson.order_type);
                    self.tradePay(response.trade_no, orderJson.order_type);
                    return;
                }
            };
            if (payConfigJson.partner === 'wxpay_xc') { // 秀餐
                if (payConfigJson.channel === 'wx_pub') {
                    // console.log(response);
                    // console.log("resultJson1=" + response);
                    self.callpay(response);
                }
                if (payConfigJson.channel === 'ali_qr' || payConfigJson.channel === 'wx_qr') {
                    self.$nextTick(() => {
                      self.qrCodeUrl = 'http://qr.liantu.com/api.php?w=200&m=0&text=' + response;
                    });
                }
                if (payConfigJson.channel === 'ali_wap') {
                    window.location.href = response;
                }
            };
            if (payConfigJson.partner === 'weichengshi') { // 微城市
                if (payConfigJson.channel === 'wx_pub') {
                    self.callpay(response);
                }
            };
            if (payConfigJson.partner === 'weishouyin') { // 微收银
                if (payConfigJson.channel === 'wx_pub') {
                    self.callpay(response);
                }
            };
        });
      }
    },
    callpay(resultJson) {  // by wangl
        if (typeof WeixinJSBridge === 'undefined') {
             if (document.addEventListener) {
                 document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
             } else if (document.attachEvent) {
                 document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                 document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
             }
        } else {
          this.onBridgeReady(resultJson);
        }
    },
    onBridgeReady(responseJSON) {
      // payservice end   by wanglei
      this.$root.eventHub.$emit('cancleOrderHandling'); // 取消订单处理中提示
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', responseJSON, function(res) {
          // window.alert(JSON.stringify(res));
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // window.alert('支付成功');
            // window.localStorage.removeItem('orderId'); // 清空localStorage
            // router.push('success');
            router.push('orderDetail'); // 微信支付成功跳转到订单详情页
            // window.location.reload();
          }
        }
      );
    },
    tradePay(tradeNO, orderType) {  // by wangl
      this.ready(function() {
           // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
          window.AlipayJSBridge.call('tradePay', {
                tradeNO: tradeNO
           }, function (data) {
              // window.alert('data = ' + JSON.stringify(data));
              // window.alert('data = ' + JSON.stringify(data.resultCode));
               console.log(JSON.stringify(data));
               if (data.resultCode === '9000') {
                // window.alert('支付成功');
                // console.log("支付成功");
                if (orderType === 'online_pay') {
                  window.AlipayJSBridge.call('closeWebview');
                } else {
                   router.push('orderDetail');
                    // window.location.reload();
                }
               }
           });
      });
    },
    ready(callback) { // by wangl
      if (window.AlipayJSBridge) {
         callback && callback();
      } else {
         document.addEventListener('AlipayJSBridgeReady', callback, false);
      }
    },
    getJSONLength(obj) { // 计算JSON数组长度 by wangl
      var size = 0;
      var key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }
  }
});
