<template>
  <div style="position: absolute;top: -4%;width:100%;">
      <!-- 数据加载modal start -->
    <div v-if="loadingModal" id="loadingToast" style="display: block;">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">{{ $t('lang.loading') }}</p>
      </div>
    </div>
    <!-- 数据加载modal  end -->

    <div class="weui-cells" v-show="!orderDetailShow">
      <h1 class="page__title orderContent">{{ $t('lang.orderDetails') }}</h1><!-- 订单详情 -->
      <div class="spaceControl">&nbsp;</div>
      <div class="order-no">
      {{desc}}
      </div>
    </div>
      <div class="weui-cells" v-show="orderDetailShow">
        <h1 class="page__title orderContent">{{orderDetail.companyName}}</h1>
        <div class="weui-cell" style="background-color: #f8f8f8;padding:5px;"></div>
        <div>
          <div class="weui-cell ">
              <div class="weui-cell__bd">
                  <p >{{ $t('lang.orderTime')}}: </p>
              </div>
              <div class="weui-cell__ft">{{orderDetail.time}}</div>
          </div>
          <div class="weui-cell ">
              <div class="weui-cell__bd">
                  <p>{{ $t('lang.tableNum')}}: </p> <!-- 桌号 -->
              </div>
              <div class="weui-cell__ft" >{{tablenum}}{{ $t('lang.table') }}</div>
          </div>
          <!-- 优惠 -->
          <div class="weui-cell ">
              <div class="weui-cell__bd">
                  <p>{{ $t('lang.discountedPrice') }}: </p><!-- 优惠金额 -->
              </div>
              <div class="weui-cell__ft" >{{orderDetail.couponbyscore}}{{ $t('lang.yuan') }}</div>
          </div>
          <div v-if="orderDetail.name">
            <div class="weui-cell ">
                <div class="weui-cell__bd">
                    <p>姓名 </p><!-- 姓名 -->
                </div>
                <div class="weui-cell__ft" >{{orderDetail.name}}</div>
            </div>
            <div class="weui-cell ">
                <div class="weui-cell__bd">
                    <p>电话 </p><!-- 电话 -->
                </div>
                <div class="weui-cell__ft" >{{orderDetail.tel}}</div>
                <!-- <div class="weui-cell__ft" >13784896489</div> -->
            </div>
            <div class="weui-cell ">
                <div class="weui-cell__bd">
                    <p>预约时间 </p><!-- 预约时间 -->
                </div>
                <div class="weui-cell__ft" >{{orderDetail.servicetime}}</div>
                <!-- <div class="weui-cell__ft" >2018-1-3-11:00</div> -->
            </div>
            <div class="weui-cell" v-if="orderDetail.address !== '请输入地址'">
                <div class="weui-cell__bd">
                    <p>预约地址 </p><!-- 预约时间 -->
                </div>
                <div class="weui-cell__ft" >{{orderDetail.address}}</div>
            </div>
          </div>
          <div class="weui-cell ">
                <div class="weui-cell__bd">
                    <p>订单类型 </p><!-- 订单类型 -->
                </div>
                <!-- <div class="wseui-cell__ft">堂食</div> -->
                <div class="wseui-cell__ft" >{{orderDetailType}}</div>
            </div>
        </div>


      <div v-if="qrShow">    <!-- 二维码 -->
        <div class="weui-dialog">
          <div class="weui-dialog__hd"></div>
              <div class="weui-dialog__bd">
                <div class="row row-centered">
                  <div style="background-color:#fff;">
                    <img style="cursor:pointer;" v-bind:src="this.$root.qrCodeUrl" width="200" height="200"/>
                  </div>
                </div>
              </div>
              <div class="weui-dialog__ft">
                  <a href="javascript:;" @click="qrShow = false" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
              </div>
        </div>
      </div>
      <div class="weui-cell" style="background-color: #f8f8f8;padding:5px;"></div>
        <!-- 总价 -->
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p v-if="this.$i18n.locale == 'zh-CN'">共{{dishlength}}个菜品</p>
                <p v-if="this.$i18n.locale == 'en'">A total of {{dishlength}} dishes</p>
            </div>

            <div class="weui-cell__ft">
              <b style="color:#333;">{{payMethod}}{{ $t('lang.total') }}: {{orderDetail.price}} {{ $t('lang.yuan') }}</b>
            </div> <!-- 合计多少元 -->
        </div>
        <!-- 菜品 -->
        <div class="backgroundcontrol">
         <div class="placeControl">
           <div v-for="(item,index) in orderDetail.dishinfo" class='dishlist' v-show="index < 6">
            <table class="tableBd">
              <tr>
                  <td width="50%">
                    {{item.name}}
                  </td>
                  <td width="20%">x{{item.num}}</td>
                  <td width="30%" align='right' style = "padding-right:5px;">{{Number(item.price).toFixed(2) * item.num}} {{ $t('lang.yuan') }}</td>
              </tr>
              <tr>
                <p style="font-size:12px;">{{item.memo}}</p>
              </tr>
            </table>
           </div>
           <div v-for="(item,index) in orderDetail.dishinfo" class='dishlist' v-show="index >= 6 && moreDetail">
            <table class="tableBd">
              <tr>
                  <td width="50%">
                    {{item.name}}
                  </td>
                  <td width="20%">x{{item.num}}</td>
                  <td width="30%" align='right' style = "padding-right:5px;">{{Number(item.price).toFixed(2) * item.num}} 元</td>
              </tr>
              <tr>
                <p style="font-size:12px;">{{item.memo}}</p>
              </tr>
            </table>
           </div>
           <center v-if="dishlength > 6">
             <span class="heightsetting" @click="showMore" v-show="cancelDetail">{{ $t('lang.expandMore') }}▼</span> <!-- 展开更多 -->
             <span class="heightsetting" @click="collect" v-show="moreDetail">{{ $t('lang.putAway') }}▲</span>   <!-- 收起 -->
           </center>
         </div>
       </div>

        <div class="backgroundcontrol" style="padding:5px 0;font-size:14px;"> <!-- 整单备注 -->
          <p style="color:#a0a0a0">{{ $t('lang.memo') }}：{{orderDetail.allmemo}}</p>
        </div>
        <div class="weui-cell" style="background-color: #eee;padding:5px;"></div>

        <!-- 加菜 start -->
        <div style="background:#eeeeee;" v-if="orderDetail.paid === 0 && repasterptag">
          <a class="weui-btn weui-btn_primary" style="background:#1aad19;width:90%;" @click="foodAdd">加菜</a>
        </div>
        <!-- 加菜 end -->

        <div class="backgroundcontrol" v-if="invoiceShow">
          <div class="placeControl">
            <div class="weui-cell weui-cell_switch">
              <div class="weui-cell__bd">{{titleShow}}</div>
              <div class="weui-cell__ft" v-show="invoiceSwitchShow">
                  <label for="invoiceSwitch" class="weui-switch-cp">
                      <input id="invoiceSwitch"  class="weui-switch-cp__input" type="checkbox" @click="switchInvoice">
                      <div class="weui-switch-cp__box"></div>
                  </label>
              </div>
            </div>

            <div class="js_dialog" id="androidDialog2" v-show="personInformation">
                <div class="weui-mask"></div>
                <div class="weui-dialog weui-skin_android">
                    <div class="weui-dialog__bd">
                        <div v-for="(o, index) in 4" style="margin:5px 0px 5px 0px;">
                          <div @click="personInformation = false">
                            <span style="font-size:15px;">{{ $t('lang.companyName') }}<i class="weui-icon-info weui-icon_msg" style="font-size:20px;float:right;"></i></span><br>
                            <span style="font-size:13px;color:#7E7E7C;">{{ $t('lang.taxpayerIdentificationNumber') }}:</span><!-- 纳税人识别号 -->
                            <hr style="margin:3px 0px 3px 0px;">
                          </div>
                        </div>
                        <center><span @click="personInformation = false">{{ $t('lang.cancel') }}</span></center>
                    </div>
                </div>
            </div>

            <div v-show="invoiceTagShow">    <!-- 用v-show解决复选框当成单选框使用问题 -->
              <div class="weui-cells weui-cells_checkbox">
                  <label class="weui-cell weui-check__label" for="person" v-show="personInvoice">
                      <div class="weui-cell__hd">
                          <input type="checkbox" class="weui-check" name="checkboxInvoice" id="person" checked="checked" disabled="true">
                          <i class="weui-icon-checked"></i>
                      </div>
                      <div class="weui-cell__bd">
                          <p>{{ $t('lang.personalInvoice') }}</p><!-- 个人发票 -->
                      </div>
                  </label>
                  <label class="weui-cell weui-check__label companyInvoiceStyle" for="company" v-show="personInvoice" @click="invoiceCompanyChange">
                      <div class="weui-cell__hd">
                          <input type="checkbox" name="checkboxInvoice" class="weui-check" id="company" disabled="true">
                          <i class="weui-icon-checked"></i>
                      </div>
                      <div class="weui-cell__bd">
                          <p>{{ $t('lang.companyInvoice') }}</p><!-- 公司发票 -->
                      </div>
                  </label>
                  <label class="weui-cell weui-check__label" for="person" v-show="companyIvoiceShow" @click="invoiceChange">
                      <div class="weui-cell__hd">
                          <input type="checkbox" class="weui-check" name="checkboxInvoice" id="person" disabled="true">
                          <i class="weui-icon-checked"></i>
                      </div>
                      <div class="weui-cell__bd">
                          <p>{{ $t('lang.personalInvoice') }}</p><!-- 个人发票 -->
                      </div>
                  </label>
                  <label class="weui-cell weui-check__label companyInvoiceStyle" for="company" v-show="companyIvoiceShow">
                      <div class="weui-cell__hd">
                          <input type="checkbox" name="checkboxInvoice" class="weui-check" id="company" checked="checked" disabled="true">
                          <i class="weui-icon-checked"></i>
                      </div>
                      <div class="weui-cell__bd">
                          <p>{{ $t('lang.companyInvoice') }}</p><!-- 公司发票 -->
                      </div>
                  </label>
              </div>
            </div>
            <div class="weui-cell" v-show="inputShow" v-if="invoiceTagShow">
                <div class="weui-cell__bd">
                    <input class="weui-input" type="text" placeholder="请输入发票抬头" style="background-color:#EEEEEE;margin:3px 0px 3px 0px; width:80%;">
                    <div style="margin-left:270px;margin-top:-30px;">
                      <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_default" @click="personInformation = true">{{ $t('lang.select')}}</a><!-- 选择 -->
                    </div>
                    <input class="weui-input" type="text" placeholder="请输入纳税人识别码" style="background-color:#EEEEEE;margin:3px 0px 3px 0px;">
                </div>
            </div>
            <div class="weui-cell" v-show="inputSelectShow">
                <div class="weui-cell__bd">
                    <input class="weui-input" type="text" placeholder="请输入发票抬头" style="background-color:#EEEEEE;margin:3px 0px 3px 0px;" disabled="true">
                    <input class="weui-input" type="text" placeholder="请输入纳税人识别码" style="background-color:#EEEEEE;margin:3px 0px 3px 0px;" disabled="true">
                </div>
            </div>
          </div>
        </div>
        <label for="weuiAgree" class="weui-agree labelbackground" v-show='weuiAgree'>
            <span class="weui-agree__text">
                {{desc}}
                <a class="description" href="javascript:void(0);">
                  {{description}}
                </a>
            </span>
        </label>
    <div style="line-height:90px;background-color:#EEEEEE;">&nbsp</div>
    <!-- <div style="line-height:90px;" v-show="inputShow">&nbsp</div> -->
    <div class="quit" v-if="orderDetail.orderChannel == 'miaodan' && orderDetail.paid == 0">{{ $t('lang.paymentTips') }}</div><!-- 支付时请确保服务员在您身边，方便确认您成功买单 -->

    </div>
    <!-- <button class="buttonsetting" @click="submit"><span style="font-size:25px;">¥20</span>&nbsp微信买单</button> -->
    <a href="javascript:;" v-if="back_show" class="weui-btn weui-btn_primary back_menu" @click="back">{{ $t('lang.returnToOrder') }}</a><!-- 返回点菜 -->

    <router-link to="/pay" class="weui-btn weui-btn_plain-default toPay" v-if="onlinePayShow">{{ $t('lang.directPayment') }}</router-link><!-- 直接付款 -->
    <!-- <a href="javascript:;" v-if="!orderDetailShow" class="weui-btn weui-btn_primary back_menu" @click="back">前去点餐</a> -->
    <a href="javascript:;" v-if="(orderDetail.orderChannel == 'miaodan' || orderDetail.orderChannel == 'paylater') && orderDetail.paid == 0 && repasterptag" v-bind:class="{back_menu_more: payTabShow}" class="weui-btn weui-btn_primary back_menu buttonsetting" @click="miaoDanToPay" style="background:#00A0DC">{{orderDetail.price}}{{ $t('lang.yuan') }} {{ $t('lang.confirmPay') }}</a><!-- 确认买单 -->
    
    <div v-if="this.$root.payStatus" style="z-index:6000;">    <!-- 弹出层 -->
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast" style="margin-top: 55px;">
        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
        <p class="weui-toast__content">{{ $t('lang.alreadyPaid') }}</p> <!-- 已支付 -->
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
      return {
        repasterptag: true,
        invoiceShow: false, // 发票信息
        weuiAgree: true,
        tablenum: window.localStorage.getItem('tablenum'),
        orderDetailShow: window.localStorage.getItem('orderId'),
        orderDetail: {},
        invoiceTagShow: false,
        invoiceRadio: '1',
        inputShow: false,
        invoice: '',
        invoiceid: '',
        moreDetail: false,
        moredesc: '展开更多▼',
        cancelDetail: true,
        desc: '',
        loadingModal: true,
        dishlength: 0, // 菜品列表长度
        qrShow: false,
        payTabShow: false,
        titleShow: this.$t('lang.invoice'),      // 开具发票
        invoiceSwitchShow: true,
        inputSelectShow: false,
        personInvoice: true,
        personInformation: false,
        companyIvoiceShow: false,
        back_show: false,
        onlinePayShow: false,
        qrCodeUrl: '',
        // description: '温馨提示：下单后换坐请与服务员沟通，以免找不到人',
        description: '',
        order: [], // 菜品列表
        payMethod: '' // 支付方式
      };
    },
    computed: {
      orderDetailType() {
        switch (this.orderDetail.type) {
          case 10: return '堂食';
          case 30: return '外卖';
          case 40: return '预约';
          case 50: return '自提';
          case 70: return '直接付款';
          default: return '无';
        }
      }
    },
    created() {
      console.log('this is create 261 orderdetail');
    },
    mounted() {},
    activated() {
      console.log('orderDetail.activated=' + (new Date()).getTime());
      var self = this;
      if (self.$root.urlParam.biz_type === 'online_pay' && self.$root.urlParam.method === 'koubei.catering.order.pay.return') {
        self.weuiAgree = false;
        // from koubei online_pay button by wangl
        axios.post('http://www.xiucan.com/api/v2/online_pay',
        {
          method: self.$root.urlParam.method,
          shop_id: self.$root.urlParam.shop_id,
          table_num: self.$root.urlParam.table_num,
          user_id: self.$root.urlParam.user_id
        })
        .then(function (res) { // 请求成功
          self.$nextTick(() => {
            self.orderDetailShow = true;
            self.titleShow = self.$t('lang.invoiceInformation');       // 发票信息
            self.invoiceSwitchShow = false;
            self.inputSelectShow = true;
            self.orderDetail = res.data;
            self.dishlength = self.orderDetail.dishinfo.length;
            // self.reGroupDishList();
            self.loadingModal = false;
            window.localStorage.setItem('orderId', self.orderDetail.orderid);
            // window.alert('self.orderDetail=' + JSON.stringify(self.orderDetail));
            self.orderDetail.price = Number(self.orderDetail.price).toFixed(2);
            // self.orderDetail.price = '0.01';
          });
        }).catch(function(error) {
            self.$nextTick(() => {
              // 查询失败 兜底页面展示  by wangl
              self.orderDetailShow = false;
              self.loadingModal = false;
              self.onlinePayShow = true;
              self.desc = self.$t('lang.UnableGetOrder');// 抱歉，暂时无法获取您的菜品订单
            });
            console.log('订单查询失败，请重试。失败原因=' + error);
            console.log('self.desc=' + self.desc);
        });
        return;
      }

      if ((window.localStorage.getItem('repasterptag') === 'ricard') || (self.$root.urlParam.channel === 'wechatPublic')) {
        self.repasterptag = false;
      }
      if (window.localStorage.getItem('repasterptag') === 'ricard') {
        self.invoiceShow = false;
      }
      if (self.$root.urlParam.orderId) { // 公众号消息推送进入
      // window.localStorage.setItem('orderId', this.$root.urlParam.orderId);
        localStorage.setItem('orderId', self.$root.urlParam.orderId);
      }
        if (self.$route.params.orderId) { // 订单列表传过来的orderId（路由传参）
          localStorage.setItem('orderId', self.$route.params.orderId);
        }
        var restUrl = 'http://www.xiucan.com/api/v2/getorderdetail/' + localStorage.getItem('orderId');
        // var restUrl = 'http://www.xiucan.com/api/v2/getorderdetailinfo/' + sessionStorage.getItem('platformId') + '/' + sessionStorage.getItem('cid');
        // var restUrl = 'static/orderdetail.json';
        // console.log(restUrl);
        axios.get(restUrl).then((res) => { // 请求成功
          self.$nextTick(() => {
            self.orderDetailShow = true;
            self.titleShow = self.$t('lang.invoiceInformation');    // 发票信息
            self.invoiceSwitchShow = false;
            self.inputSelectShow = true;
            self.orderDetail = res.data; // 订单数据
            self.dishlength = self.orderDetail.dishinfo.length;
            self.loadingModal = false;
            self.tablenum = self.orderDetail.tablecode; // 订单数据
            self.$root.eventHub.$emit('arriveOrderDetail', res.data.paid); // 下单成功后到达订单详情页，清空购物车并取消订单处理中提示(shopcart.vue)
            // if (self.orderDetail.paid === 1 && orderDetail.orderChannel === 'miaodan') {

            // }
            if (res.data.paid === 0 && localStorage.getItem('repasterptag') !== 'ricard') {
              sessionStorage.setItem('orderId', res.data.id);
              this.$root.foodAdd = true;
            }
            console.log('self.orderDetail=' + JSON.stringify(self.orderDetail));
            // self.orderDetail.price = '0.01';
            self.checkOnlinePay(self.orderDetail);
            // self.reGroupDishList();
            // console.log('self.orderDetail.dishinfo.order=' + JSON.stringify(self.order));
            self.weuiAgree = false;
            self.orderDetail.price = Number(self.orderDetail.price).toFixed(2);
            // 支付方式及支付状态 start
            var payTypeMap = { member: '（会员支付）', ali: '（支付宝支付）', weixin: '（微信支付）', unpaid: '（未支付）' };
            self.payMethod = payTypeMap[self.orderDetail.paytype];
            // 支付方式及支付状态 end
          });
        }).catch(function(error) { // 请求失败
          self.$nextTick(() => {
            self.loadingModal = false;
            self.orderDetailShow = false;
            self.onlinePayShow = false;
            self.desc = self.$t('lang.UnableGetOrder');  // '抱歉，暂时无法获取您的菜品订单'
          });
          console.log('订单查询失败，请重试。失败原因=' + error);
        });
    },
    deactivated() {
      console.log('orderDetail      deactivated');
      this.loadingModal = true;
      this.orderDetail = []; // 初始化orderDetail
    },
    methods: {
      checkOnlinePay(orderJson) {
          if (orderJson.order_type === 'online_pay') {
            this.back_show = false;
          }
      },
      // reGroupDishList() {
      //   for (var item in this.orderDetail.dishinfo) { // 循环菜品信息 从新排列
      //     // console.log('this.orderDetail.dishinfo.item=' + JSON.stringify(item) + ', value=' + JSON.stringify(this.orderDetail.dishinfo[item]));
      //     var orderItem = {};
      //     orderItem.code = this.orderDetail.dishinfo[item].did;
      //     orderItem.id = this.orderDetail.dishinfo[item].did;
      //     orderItem.name = this.orderDetail.dishinfo[item].name;
      //     orderItem.price = Number(this.orderDetail.dishinfo[item].price).toFixed(2);
      //     orderItem.count = this.orderDetail.dishinfo[item].num;
      //     orderItem.memo = this.orderDetail.dishinfo[item].memo; // 菜品备注（单个菜品）
      //     orderItem.printid = '';
      //     orderItem.status = '0';
      //     this.order.push(orderItem);
      //   }
      // },
      switchInvoice() {
        if (this.invoiceTagShow === false) {
         this.invoiceTagShow = true;
        } else {
          this.invoiceTagShow = false;
        }
      },
      invoiceChange() {
        this.personInvoice = true;
        this.companyIvoiceShow = false;
        this.inputShow = false;
      },
      invoiceCompanyChange() {
        this.personInvoice = false;
        this.companyIvoiceShow = true;
        this.inputShow = true;
      },
      miaoDanToPay() { // 秒付
        var orderJson = {};
        // this.qrShow = true;
        if (this.$root.clientInfo === 'AlipayClient') {
          orderJson.order_type = 'online_pay'; // 订单类型
        } else {
          orderJson.order_type = ''; // 订单类型
        }
        // window.alert('this.orderDetail.paymode=' + this.orderDetail.paymode);
        if (this.orderDetail.pay_mode === 1) {
          orderJson.partner = JSON.parse(sessionStorage.getItem('payConfigJson')).partner; // 合伙人
          if (this.$root.clientInfo === 'AlipayClient') {
            orderJson.order_type = 'order_dish'; // 订单类型
            orderJson.channel = 'ali_qr';
          } else {
            orderJson.order_type = ''; // 订单类型
            orderJson.channel = 'wx_qr';
          }
          orderJson.channel = JSON.parse(sessionStorage.getItem('payConfigJson')).channel;
        }
        orderJson.companyName = this.orderDetail.companyName; // 店铺名称
        orderJson.orderId = this.orderDetail.orderid; // 订单号
        orderJson.price = this.orderDetail.price; // 订单金额
        orderJson.dishinfo = this.orderDetail.dishinfo; // 订单菜品
        // window.alert('去支付');
        // console.log('invoice=' + this.invoice);
        // console.log('invoiceid=' + this.invoiceid);
        if (this.invoice !== '' && this.invoiceid !== '') {
            var self = this;
             axios.post('http://www.xiucan.com/api/v2/addInvoice',
            {
              orderid: self.orderDetail.orderid,
              Invoice: self.invoice, // 发票title
              InvoiceId: self.invoiceid // 发票识别码
            })
            .then(function (res) {
              if (res.data.status === 'success') { // 订单增加发票信息成功
                if (orderJson.channel === 'ali_qr' || orderJson.channel === 'wx_qr') {
                  self.$root.goPay(orderJson);
                  self.$root.qrShow = true;
                } else {
                   self.$root.goPay(orderJson);
                }
              }
            }).catch(function(error) {
                // window.alert('发票信息填写错误');
                console.log('error=' + error);
                // self.$nextTick(() => {
                //   // 查询失败 兜底页面展示  by wangl
                //   self.orderDetailShow = false;
                //   self.onlinePayShow = true;
                //   self.desc = '抱歉，暂时无法获取您的菜品订单';
                // });
                // console.log('订单查询失败，请重试。失败原因=' + error);
                // console.log('self.desc=' + self.desc);
            });
        } else {
          if (orderJson.channel === 'ali_qr' || orderJson.channel === 'wx_qr') {
                  this.$root.goPay(orderJson);
                  this.qrShow = true;
          } else {
            this.$root.goPay(orderJson);
          }
        }
      },
      back() {
        var url = 'http://www.xiucan.com/diancai/?token=' + window.localStorage.getItem('token') + '&tablenum=' + window.localStorage.getItem('tablenum');
        window.location.href = url;
      },
      showMore() {
        this.moreDetail = true;
        this.cancelDetail = false;
       },
       collect() {
        this.moreDetail = false;
        this.cancelDetail = true;
       },
      foodAdd() {
        this.$router.push('goods');
      }
    },
    components: {}
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/weui.min.css"   // by wangl
  body {
    background-color:#f8f8f8;
  }
  .createqrCode {
    margin-top:22px;
    bottom:100px;
    border-radius:0px;
    line-height:50px;
  }
  .orderContent {
    line-height:40px;
    background-color:white;
  }
  .spaceControl {
    background-color: #f8f8f8;
    line-height:30px;
  }
  .labelBackground {
    background-color: #f8f8f8;
    text-align: center;
  }
  .weui-cell-one {
    margin-bottom: 30px;
  }
  .weui-cell {
    margin:25px,10px;
  }
  .back_menu {
    /*position: relative;*/
    bottom: -50px;
    width: 90%;
  }
  .back_menu_more {
    left: 5% !important;
    position: absolute !important;
    bottom: 10% !important;
  }
  .dishlist {
    border-bottom: 1px solid gainsboro;
  }
  .page__title {
    text-align: center;
    font-size: 22px;
    padding: 5px 0;
  }
  .weui-cell:before {
    z-index:-1;
  }
  .weui-cells:after {
    z-index:-1;
  }
  .weui-cell_price {
    margin-right:7%;
  }
  .description {
    display: block;
    color: red !important;
    text-align: center;
    background-color: rgb(248, 248, 248);
    margin-top: 7px;
  }
  .order-no {
    text-align: center;
  }
  .toPay {
    margin-top: 20%;
    width: 70%;
  }
  .weui-check__label{
    display:inline_block !important;
  }
  .backgroundcontrol {
    background-color: #fff;
    margin-top:0px !important;
    margin-left:10px !important;
  }
  .placeControl {
    margin:0px !important;
  }
  .quit {
    position: fixed !important;
    bottom: 50px;
    width:100%;
    font-size:13px;
    text-align: center;
    color:#4D4D4B;
    background-color:#FAEDB9;
    height:25px;
    line-height:25px;
  }
  .buttonsetting {
    position: fixed !important;
    bottom: 0px;
    background-color:#01CC01;
    border:none;
    line-height:50px;
    width:100%;
    font-size:20px;
    color:#fff;
    border-radius:0px;
  }
  .backgroundcontrol {
    background-color: #fff;
    margin-top: 10px;
  }
  .placeControl {
    margin: 20px;
  }
  .wordDetail {
    position:absolute;
    right:50px;
    line-height:30px;
    color:#9B9B9B;
    font-size:13px;
  }
  .borderStyle {
    color:#000;
    margin:5px;
    width:160%;
  }
  .receiptsContent {
    font-size:15px;
  }
  .heightsetting {
    line-height:30px;
  }
  .tableBd {
    width: 100%;
    margin:5px 0;
    color:#A0A0A0;
    font-size:14px;
  }
  .companyInvoiceStyle {
    margin-top:-50px;
    margin-left:130px;
  }
  .weui-cells:before {
    border-top: 0px solid #e5e5e5;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-size:15px;
    color: #A3A3A3;
  }
  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size:15px;
  }
  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size:15px;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size:15px;
  }
</style>
