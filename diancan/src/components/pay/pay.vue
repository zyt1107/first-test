<template>
  <div class="body payContent">
      <center>
        <div id="center" class="background">
          <div class="addr">
            <router-link to="/goods">
              <span style="float:left;">
                <i class="icon-arrow_lift" style='background:#F3F3F3;vertical-align:sub;font-size:18px;font-weight:bold;'></i>
              </span>
            </router-link>
            <img style="vertical-align:sub;width:17px;" src="./map.jpg">
            <span style="color:#333;font-size:15px;">{{companyName}}</span>
            <!-- <span style="line-height:45px;">{{ $t('lang.companyAddress')}}</span> --><!-- 北京市海淀区中关村国际孵化园 -->
          </div>
          <div class="input-group" style="width: 90%;">
            <span class="input-group-addon"><strong>{{ $t('lang.orderAmount') }}</strong></span><!-- 订单金额(元) -->
            <input id="totalPriceInput" type="text" class="form-control input" placeholder="询问服务员后输入" @focus="show" data-layout="numeric" autofocus="autofocus" maxlength="8" v-model="totalPrice" readonly>
          </div>
          <div class="input-group noDiscountcontrol">
            <span class="input-group-addon noDiscount"><strong>{{ $t('lang.notParticipateDiscountAmount')}}</strong></span><!-- 不参与优惠金额(元) -->
            <input id="excludePriceInput" type="text" class="form-control input inputStylecontrol" placeholder="询问服务员后输入" @focus="show" data-layout="numeric" maxlength="8" v-model="excludePrice" readonly>
          </div><br>
          <div class="note">
            <span style="float:left;" v-if="addNote" @click="remark">{{ $t('lang.addMemo') }} </span><!-- 添加备注 -->
            <div class="input-group" style="width: 98%;" v-if="note">
              <span class="input-group-addon noteHeader"><strong>{{ $t('lang.memo') }}</strong></span>
              <input  type="text" class="form-control input noteBody" placeholder="如包房号或服务员号等" @click="noteShow" v-if="this.$i18n == 'zh-CN'">
              <input  type="text" class="form-control input noteBody" placeholder="Such as private room number or waitress number" @click="noteShow" v-if="this.$i18n == 'en'">
          </div>
          </div><br>
          <hr style="height: 5px">
          <div class="dish-item" style="width: 90%" >
            <span class="realyprice"><strong>{{ this.$t('lang.actualPayment') }}</strong></span> <!-- 实际付款(元) -->
            <span class="finalyprice" >{{totalPrice}}</span>
          </div><br>
          <div class="btn-group btn-group-justified">
            <button type="button" class="btn btn-group btn-group-justified bouttonStylecontrol" @click="submit">{{ this.$t('lang.payNow')}}</button><!-- 和店员已确认，立即买单 -->
          </div>
        </div>
      </center>
     <div class="keyboradStyle">
       <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :change="change"/>
     </div>
  </div>
</template>
<script >
  import Vue from 'vue';
  import VueTouchKeyboard from 'vue-touch-keyboard';
//  import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css'; // load default style
  import axios from 'axios';
  Vue.use(VueTouchKeyboard);

  export default {
    data() {
      return {
        addNote: true,
        note: false,
        visible: false,   // From here for keyboard component
        layout: 'numeric',
        totalPrice: '',
        excludePrice: '',
        input: null,
        options: {
          useKbEvents: false
        },
        dotFlag: false,
        companyName: sessionStorage.getItem('companyName')
      };
    },
    mounted () {
      // this.showHeader(false);
      // console.log('mounted.pay.showHeader=' + this.showHeader);
      this.$root.eventHub.$on('arriveOrderDetail', () => {
        this.totalPrice = '';
        this.excludePrice = '';
      });
    },
    methods: {
      noteShow() {
        this.hide();
      },
      remark() {
        this.addNote = false;
        this.note = true;
      },
      submit() {
        if (this.totalPrice === '') {
          alert('请输入金额~');
          return;
        }
        var dataJson = {};
        dataJson.cmd = 'createorder';
        if (this.$root.urlParam.embedded) {   // by xiaozc.
          dataJson.cmd = 'getbill';
          console.log('dataJson.cmd = getbill');
        }
        dataJson.cid = sessionStorage.getItem('cid');
        dataJson.data = {};
        dataJson.data.hotelid = dataJson.cid;
        dataJson.data.platformId = sessionStorage.getItem('platformId');
        dataJson.data.status = '0';
        dataJson.data.employee = '';
        dataJson.data.employeecode = '';
        dataJson.data.peoplenum = '1'; // 人数
        dataJson.data.isZJZF = '1'; // 等同于type=70，标志为直接付款，todo：后续不使用
        dataJson.data.client = this.$root.urlParam.token;    // 'fuwuyuan-client';   by xiaozc
        dataJson.data.desc = '';   // '秀餐测试单'
        dataJson.data.printid = '';
        dataJson.data.type = '70';   // 直接付款
        dataJson.data.paytype = 'unpaid';
        dataJson.data.tablenum = localStorage.getItem('tablenum'); // 桌号
        dataJson.data.time = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        dataJson.data.code = dataJson.cid + dataJson.data.time.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '') + dataJson.data.tablenum;
        dataJson.data.order = []; // 订单菜品
        dataJson.data.paid = 0;
        dataJson.data.totalPrice = Number(this.totalPrice);
        dataJson.data.orderCount = 0; // 菜品数量
        if (this.$root.urlParam.embedded) {   // by xiaozc.
          dataJson.data.rawdata = Number(this.totalPrice);
          console.log('dataJson.cmd.getbill=' + dataJson.data.rawdata);
        }
        console.log('pay.vue.submit.dataJson=' + JSON.stringify(dataJson));
        var self = this;
        axios({
          method: 'post',
          url: 'http://www.xiucan.com/api/v2/createorder',
          data: dataJson,
          headers: {
            'Content-Type': 'application/json'
          }
          }).then(function(response) {
            console.log('response.data=' + JSON.stringify(response.data));
            if (response.data.status === 0) {
              // 订单号存储到localStorage,订单详情去取;
              window.localStorage.setItem('orderId', response.data.message);
              var orderJson = {};
              orderJson.companyName = sessionStorage.getItem('companyName');  // 店名;
              orderJson.orderId = response.data.message;
              orderJson.price = Number(self.totalPrice).toFixed(2);
              var payConfigJson = JSON.parse(sessionStorage.getItem('payConfigJson'));
              orderJson.partner = payConfigJson.partner;
              orderJson.channel = payConfigJson.channel;
              self.$root.goPay(orderJson);
            }
          }).catch(function(error) {
            if (!self.$root.urlParam.embedded) {  // embedded嵌入第三方web
            window.alert(self.$t('lang.orderSubmissionFailed') + error);
            }
          });
      },
      formatDate(date, fmt) {
        var o = {
          'M+': date.getMonth() + 1,               // 月份
          'd+': date.getDate(),                    // 日
          'h+': date.getHours(),                   // 小时
          'm+': date.getMinutes(),                 // 分
          's+': date.getSeconds(),                 // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds()             // 毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
          }
        }
        return fmt;
      },
      accept(text) {   // From here for keyboard component
        // this.hide();
        this.submit();
        // console.log('accept.totalPrice=' + this.totalPrice);
      },
      show(e) {
        this.input = e.target;
        this.layout = e.target.dataset.layout;

        if (!this.visible) {
          this.visible = true;
        }
        // console.log('e.target.id=' + e.target.id);
      },
      hide() {
        this.visible = false;
      },
      change(text) {
         // this.totalPrice = this.input.
        // console.log('this.input.id=' + this.input.id + ', change.text=' + text);
        if (this.input.id === 'totalPriceInput') {
          this.totalPrice = text;
          this.totalPrice = String(text).replace(/^(.*\..{2}).*$/, '$1');
          // console.log('text.substr=' + text.substr(-1));
          // console.log('text[0]=' + text[0]);
          // console.log(111);
          if (text[0] === '0' && text[1] >= 1 && text[1] <= 9) {
            this.totalPrice = text[1];
          };
          if (text[0] === '0' && text[1] === '0') {
            this.totalPrice = 0;
          };
          if (text[0] === '.') {
            this.totalPrice = '0.';
          };
          if (text[text.length - 3] === '.' && text[text.length - 1] === '.') {
            // console.log('text.substring(0, text.length - 1)=' + text.substring(0, text.length - 1));
            this.totalPrice = text.substring(0, text.length - 1);
          };
          if (text[text.length - 2] === '.' && text[text.length - 1] === '.') {
            // console.log('text.substring(0, text.length - 1)=' + text.substring(0, text.length - 1));
            this.totalPrice = text.substring(0, text.length - 1);
          };
          // console.log('text2=' + this.dotFlag);
        }
        if (this.input.id === 'excludePriceInput') {
          this.excludePrice = text;
          this.excludePrice = String(text).replace(/^(.*\..{2}).*$/, '$1');
          // console.log('text.substr=' + text.substr(-1));
          // console.log('text[0]=' + text[0]);
          // console.log(111);
          if (text[0] === '0' && text[1] >= 1 && text[1] <= 9) {
            this.excludePrice = text[1];
          };
          if (text[0] === '0' && text[1] === '0') {
            this.excludePrice = 0;
          };
          if (text[0] === '.') {
            this.excludePrice = '0.';
          };
          if (text[text.length - 3] === '.' && text[text.length - 1] === '.') {
            // console.log('text.substring(0, text.length - 1)=' + text.substring(0, text.length - 1));
            this.excludePrice = text.substring(0, text.length - 1);
          };
          if (text[text.length - 2] === '.' && text[text.length - 1] === '.') {
            // console.log('text.substring(0, text.length - 1)=' + text.substring(0, text.length - 1));
            this.excludePrice = text.substring(0, text.length - 1);
          };
        }
      }
    }
  };
</script>
<style>
  /*@import "../../../static/css/bootstrap.css"   // by xiaozc*/
  @import "../../../static/css/vue-touch-keyboard.css";
	.payContent{		/*by shaomeng隐藏pay页面顶部*/
		position: relative;
		top: -68px;
	}
  input { 
    font-size:20px; 
  }
  .oneheader {
    height: 45px;
    width: 90%;
  }
  .back {
    color:#1FA7FA !important;
    float: left;
    line-height: 47px;
    padding-left:8px;
  }
  .btn{
  color:#F3F3F3; 
  border-radius:8px;
  text-align:center;
  }
  .input-group-addon {
    background-color:#FFFFFF !important;
    border-left:none !important; 
    border-right:none !important;
    border-top:none !important;
    border-radius:5px 0px 0px 0px !important;
    font-size:13px !important;
    height: 53px !important;
    cursor: pointer !important;
  }
  .form-control {
    border-left:none !important;
    border-right:none !important;
    border-top:none !important;
    height: 53px !important;
    border-radius:0px 5px 0px 0px !important;
    text-align:right !important;
    font-size:25px !important;
    background-color:#FFFFFF !important;
  }
  .noDiscountcontrol {
    width: 90%;
    border:none;
  }
  .noDiscount {
    border:none;
    border-radius:0px 0px 0px 5px !important;
  }
  .inputStylecontrol {
    border:none !important;
    border-radius:0px 0px 5px 0px !important;
  }
  .noteHeader {
    height:35px !important;
    border-radius:5px 0px 0px 5px !important;
    border:none !important;
  }
  .noteBody {
    color:#000;
    height:35px !important;
    border-radius:0px 5px 5px 0px !important;
    border:none !important;
    font-size:10px !important;
  }
  .note {
    color:#B8B8B8;
    font-size:13px;
    width: 90%;
    line-height:55px;
    height: 15px;
  }
  .addNote {
    font-size:12px;
    width: 95%;
    line-height:0px;
    height: 35px;
    background-color: #FFFFFF; 
  }
  .bouttonStylecontrol {
    width:90% !important;
    height:43px !important;
    font-size:16px !important;
    background-color:#FC3B40;
    color:#F3F3F3 !important;
  }
  .keyboradStyle {
    position:fixed;
    bottom:0;
    width:100%;
  }
  .realyprice {
    float:left;
    font-size:15px;
    height: 50px;
  }
  .finalyprice {
    font-size:28px;
    float:right;
    color:#FC3B40;
    line-height: 10px;
  }
  .null {
    background-color:#F3F3F3;
    height: 20px;
  }
  .background {
    background-color:#F3F3F3;
    color:#000;
    height: 100%;
  }
  .addr {
    color:#B8B8B8;
    font-size:12px;
    text-align:center;
    height: 35px;
    line-height: 35px;
    width: 90%;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */ 
    font-size:11px;
    color: #A3A3A3;
  } 
  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
    font-size:11px;
  } 
  input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
    font-size:11px;
  } 
  input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
    font-size:11px;
  }
</style>













