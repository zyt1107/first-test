<template>
  <div>
    <!-- 开通会员提示  start-->
    <div v-if="openMemberShow">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
          <div class="weui-dialog__bd">
            <span>您未开通会员！</span>
            <p style="background:none;">请联系商家加入会员家族~</p>
          </div>
          <div class="weui-dialog__ft">
              <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click = "payMethod = 'defaultPay', openMemberShow = false">{{ $t('lang.confirm') }}</a>
          </div>
      </div>
    </div>
    <!-- 开通会员提示  end-->
   <!-- 确认下单loading start-->
    <div v-if="orderHandling">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">{{ $t('lang.orderProcessing') }}</p>
      </div>
    </div>
  <!-- 确认下单loading end-->
    <!-- 余额不足 start-->
    <div v-show="lessBalanceDialog" @click="lessBalanceDialog = false">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast" style="margin-top:20px;">
        <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;margin-top:20px;"></i>
        <p class="weui-toast__content" style="margin-top:20px;">{{ $t('lang.insufficientFunds') }}</p>
      </div>
    </div>
    <!-- 余额不足 end -->
    <!-- 选择就餐人数弹框 start -->
    <div v-show="peopleModal">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
          <div class="weui-dialog__hd"><strong class="weui-dialog__title"><strong>{{ $t('lang.chooseCustomerNum') }}</strong></strong></div>
          <!-- <div style="border-bottom:1px solid #eee" v-if=""></div> -->
          <div class="weui-dialog__bd">
            <div class="row row-centered">
              <div v-if="JSON.stringify(this.chopstick) != '{}' && this.chopstick.status != -1" style="border-top: 1px solid #eee">
                 <div class="weui-cells weui-cells_checkbox" style="margin-top:0.176471em" id="weuiClick_bd">
                    <label class="weui-cell weui-check__label" for="checkedChopsticksId" style="padding:0 15px;display:inline-flex">
                      <div class="weui-cell__hd">
                        <input type="checkbox" class="weui-check" v-model="chopsticksJudge" id="checkedChopsticksId"/>
                        <i class="weui-icon-checked"></i>
                      </div>
                      <!-- <div class="weui-cell__bd"> -->
                      <div>
                        <p class="pText" style="font-size:14px; background:#fff">{{ $t('lang.need') }}{{this.chopstickName}} <span style="color:red;font-size:12px" v-if="this.chopstickPrice > 0">({{this.chopstickPrice}}{{ $t('lang.chopstickUnit') }})</span></p>
                      <!-- </div> -->
                      </div>
                    </label>
                </div>
              </div>
              <div class="people col-xs-4" v-for="people in peopleList">
                <button type="button" class="btn btn-default peoplebutton" v-bind:class="{ peopleselected: selectedpeople[people-1] }" @click="getpeoplenum({people})">
                  <span>{{people}}{{ $t('lang.people') }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="weui-dialog__ft">
            <a href="javascript:;" @click="peoplesubmit" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
          </div>
      </div>  <!-- 选择就餐人数弹框 end -->
      <div id="loadingToast" style="display: block;" v-show="alertshow" @click="alertshow = false">
        <div class="weui-mask_transparent"></div>  <!-- 提醒选人数弹框 -->
        <div class="weui-toast" style="margin-top:20px;">
          <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;margin-top:20px;"></i>
          <p class="weui-toast__content" style="margin-top:20px;">{{ $t('lang.pleaseChoosePeople') }}</p>
        </div>
      </div>
    </div>
  <!-- 选择桌号 start -->
  <div v-if="tableModal">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title"><strong>{{ $t('lang.selectTableTitle') }}</strong></strong></div>
        <div class="weui-dialog__bd scrollMore">
          <div class="row row-centered ">
            <div class="people col-xs-4" v-for="table in this.$root.baseData.tableInfo">
              <button type="button" class="btn btn-default peoplebutton removeOutline" v-bind:id="table.code" v-on:click="gettablenum($event)" v-bind:class="{tableselected: selectedtable[table.code]}">
                <span>{{table.name}}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" @click="closetable" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
        </div>
    </div>
  </div>
  <!-- 选择桌号 end -->
    <div class="shopcart">
      <!-- 优惠活动规则 start -->
      <div class="activities" v-if="$root.baseData.activities && $root.baseData.activities.length > 0 && selectFoods.length === 0">
        <!-- <marquee direction="left"> --><!-- 文字滚动 -->
          <div class="activitiesContent">
            <span v-for="(item, index) in $root.baseData.activities">
              <span v-show="item.activityType === 1">满{{item.marketConfine}}加{{item.name}}{{item.quantity}}{{item.unit}}</span>
              <span v-show="item.activityType === 2">满{{item.marketConfine}}送{{item.name}}{{item.quantity}}{{item.unit}}</span>
              <span v-show="item.activityType === 3">满{{item.marketConfine}}减{{item.discount}}</span>
              <span v-show="index < $root.baseData.activities.length - 1">，</span>
            </span>
          </div>
        <!-- </marquee> -->
        <label class="activitiesClose" @click="activitiesClose">x</label>
      </div>
      <!-- 优惠活动规则 end -->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice.toFixed(2)}}</div>
          <div class="desc" v-if="deliveryPrice>0">{{ $t('lang.otherRequiredDeliveryFee') }}￥{{deliveryPrice}}元</div>
          <!-- 满减优惠额度显示 start-->
          <div v-show="discountPrice > 0" class="discountPrice">
            已优惠{{discountPrice}}元
          </div>
          <!-- 满减优惠额度显示 end-->
        </div>
        <div class="content-right" @click.stop.prevent="payBefore">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!-- 会员支付密码输入框 start -->
      <div class="passwordInput" v-if="passwordInput">
        <div class="weui-mask" @click="passwordInput = false"></div>
        <password-input style="width:100%;position:absolute;height:100%;" :tradeAmount="totalPrice"></password-input>
      </div>
      <!-- 会员支付密码输入框 end -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
        <!-- 外卖订单位置及时间模块  start-->
        <div class="outerSellTop" v-if="outerSellModel">
          <div class="outerSellAddress" @click="selectAddress">
            <i class="iconfont" style="font-size:20px">&#xe61e;</i>
            <!-- 这是地址栏 -->
            <div class="outerSellContent">
              <p>{{showAddress}}</p>
              <!-- <p><span style="margin-right:28px">{{ownPeopleMessage.name}}先生</span><span>123214125151</span></p> -->
            </div>
            <i class="iconfont" style="position:absolute; right:0px;">&#xe646;</i>
          </div>
          <div class="outerSellTime">
            <i class="iconfont" style="font-size:18px; float:left;">&#xe66c;</i>
<!--             <div style="margin-left:10px; display:inline-block">
              <span style="font-weight:bold">立即送出</span>
              <span style="font-size:15px; color:#165d9c">(大约17:27送达)</span> 
            </div>
             -->
            <div>
              <group>
                  <datetime v-model="ownPeopleMessage.servicetime" format="HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']" :minute-list="['00', '15', '30', '45']" :title="$t('lang.predeterminedTime')" class="dataTime"></datetime> 
              </group>
            </div>
            <!-- <i class="iconfont" style="position:absolute; right:0px;">&#xe612;</i> -->
          </div>
        </div>
        <!-- 外卖订单位置及时间模块  end-->
        <div v-if="!peopleShow">
          <div class="list-header" v-show="!tableShow">
            <h1 class="title">{{ $t('lang.shopCart') }}</h1>
            <span class="empty" @click="empty">{{ $t('lang.empty') }}</span>
          </div>
          <div class="list-content" ref="listContent" v-show="!tableShow">
            <ul>
              <li class="food" v-for="food in selectFoods">              
                <span class="name">{{food.name}}</span><br>
                <span class="name" v-if="food.englishname">{{food.englishname.substr(0,30)}}</span><br>
                <span class="name" style="font-size:12px;color:#9f9f9f;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:55%;display:inline-block;" v-show="food.memostr">{{food.memostr}}</span>
               <div class="price">
                  <span>￥{{food.price*food.count|fmtPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :selectFoods="selectFoods" :goods="goods" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
          <div class="container pre-scrollable" v-show="tableShow">
            <div class="row row-centered">
              <div class="col-xs-4" v-for="table in this.$root.baseData.tableInfo"><div class="item" v-bind:id="table.code" v-on:click="gettablenum($event)">{{table.name}}</div></div>
            </div>
          </div>
          <div class="list-button" @click="showpeoplelist">
            <h1 v-bind:class="this.peopleClass">{{ $t('lang.customerNum') }}</h1>
            <span class="tablenum">{{this.$root.peopleNum}}</span>
          </div>
        </div>
          <div class="list-button" @click="showtablelist" v-if="!tagModel && !outerSellModel">
            <h1 v-bind:class="this.tableClass">{{ $t('lang.selectTableDetail') }}</h1>  <!-- 选桌号 -->
            <span class="tablenum">{{this.tableNum}}</span>
          </div>
          <div class="list-button" @click="showitemChange('showNameChange')" v-if="tagModel || outerSellModel">
            <h1 v-bind:class="this.nameClass">姓名</h1>
            <span class="tablenum">{{this.ownPeopleMessage.name}}</span>
          </div>
          <div class="list-button" @click="showitemChange('showTelChange')" v-if="tagModel || outerSellModel">
            <h1 v-bind:class="this.telClass">电话</h1>
            <span class="tablenum">{{this.ownPeopleMessage.tel}}</span>
          </div>
          <div class="list-button" v-if="tagModel">
            <group>
                <datetime v-model="ownPeopleMessage.servicetime" format="HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16']" :minute-list="['00', '15', '30', '45']" :title="$t('lang.predeterminedTime')" class="dataTime"></datetime> 
            </group>
          </div>
          <div class="list-content memo"> <!-- 备注区域 -->
            <textarea v-if="this.$i18n.locale == 'zh-CN'" class="weui-textarea" rows="5" placeholder="请输入备注内容（可不填）" v-model="orderMemo" @blur="blurOrderMemo()"></textarea>
            <textarea v-if="this.$i18n.locale == 'en'" class="weui-textarea" rows="5" placeholder="Please enter the remarks (may not fill)" v-model="orderMemo" @blur="blurOrderMemo()"></textarea>
          </div>
          <!-- 支付方式 start -->
          <div class="list-button" style="height:auto;" v-show="this.$root.paymentTag">
            <h1 v-bind:class="this.tableClass" style="color:#333;padding-bottom:1px;">{{ $t('lang.payMethod') }}</h1>
            <div align="right">
              <div class="weui-cells_checkbox" style="display:inline-block; height:40px;">
                <label class="weui-cell weui-check__label payment" for="defaultPay" style="height:40px;padding:0;">
                  <div class="weui-cell__hd" style="line-height:30px; margin-right:5px">
                      <input type="radio" class="weui-check" name="payRadio" value="defaultPay" id="defaultPay" v-model="payMethod" />
                      <i class="weui-icon-checked"></i>
                  </div>
                  <div class="weui-cell__bd">
                      <p>{{payMethodText}}</p>
                  </div>
                </label>
              </div>
              <div class="weui-cells_checkbox" style="display:inline-block; height:40px;">
                <label class="weui-cell weui-check__label payment" for="memberPay" style="height:40px;padding:0;">
                  <div class="weui-cell__hd" style="line-height:30px; margin-right:5px">
                      <input type="radio" class="weui-check" name="payRadio" value="memberPay" id="memberPay" v-model="payMethod" />
                      <i class="weui-icon-checked"></i>
                  </div>
                  <div class="weui-cell__bd">
                      <p><span style="vertical-align:middle;">{{ $t('lang.member') }}</span><span style="font-size:10px;color:red;">{{memberBalance()}}</span></p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <!-- 支付方式 end -->
          <!-- 会员相关显示信息 start -->
          <div class="list-content memberInfo" v-if="payMethod === 'memberPay'">
            <ul>
              <li class="coupon" v-if="$root.member.memberBalance.consuVo">
                <span>可用优惠券</span>
                <span class="couponList">
                  <ul>
                    <li v-for="(item,index) in $root.member.memberBalance.consuVo.couponList">
                      <div>
                        <span>{{item.memberCouponName}}</span>
                        <input type="checkbox" name="couponCheckbox" :value="item.memberPromCouponId" v-model="couponChecked">
                      </div>
                    </li>
                  </ul>
                </span>
              </li>
              <li class="balance">
                可用余额
                <span>{{memberBalance()}}</span>
              </li>
            </ul>
          </div>
          <!-- 会员相关显示信息 end -->
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
    <!-- 修改姓名框 start -->
    <div v-if="showNameChange">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title">姓名</strong></div>
        <div class="weui-dialog__bd scrollMore">
          <!-- <div class="weui-cells weui-cells_form"> -->
            <div class="weui-cell">
              <div class="weui-cell__hd title"><label class="weui-label">姓名</label></div>
              <div class="weui-cell__bd">
                  <input class="weui-input" type="text" placeholder="请输入姓名" v-model="ownPeopleMessageClone.name"/>
              </div>
            </div>
        </div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" @click="confirmTag('name')" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
            <a href="javascript:;" @click="showNameChange = false" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.cancel') }}</a>
        </div>
      </div>
    </div>
    <!-- 修改姓名框 end -->
    <!-- 修改电话框 start -->
    <div v-if="showTelChange">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title">电话</strong></div>
        <div class="weui-dialog__bd scrollMore">
          <!-- <div class="weui-cells weui-cells_form"> -->
            <div class="weui-cell">
              <div class="weui-cell__hd title"><label class="weui-label">电话</label></div>
              <div class="weui-cell__bd">
                  <input class="weui-input" type="text" placeholder="请输入姓名" v-model="ownPeopleMessageClone.tel"/>
              </div>
            </div>
        </div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" @click="confirmTag('tel')" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
            <a href="javascript:;" @click="showTelChange = false" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.cancel') }}</a>
        </div>
      </div>
    </div>
    <!-- 修改电话框 end -->
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import PasswordInput from 'components/pay/passwordInput';
  import axios from 'axios';   // by xiaozc
  import VueRouter from 'vue-router'; // by wangl
  import { Group, Cell, Datetime } from 'vux'; // by limengxu
  const router = new VueRouter(); // by wangl
  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 10,
              count: 1
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      goods: {
        type: Array
        // default: null
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true,
        tableShow: false,
        tableNum: this.$root.urlParam.tablenum,
        tableClass: 'title',
        peopleClass: 'title',
        peopleShow: false,
        nameClass: 'title',
        telClass: 'title',
        addressClass: 'title',
        alertshow: false,
        peopleModal: false,
        selectedpeople: [],  // 存放人数按钮参数
        selectedtable: [],
        peopleList: this.$root.peopleList,
        tableModal: false,
        submitPaying: false,
        payMethod: 'defaultPay', // 支付方式
        payMethodText: '默认支付', // 页面具体显示支付方式（微信支付/支付宝支付）
        lessBalanceDialog: false, // 余额不足提示
        passwordInput: false, // 控制密码输入组件显示与否
        orderMemo: '', // 整单备注
        chopstick: {},  // 是否显示筷子数
        chopstickPrice: 0,   // 筷子价格
        chopstickName: null,
        foldChopsticks: false,    // 当通过食品列表添加餐具，同步更改右下角选人数-》选桌号
        chopsticksJudge: false,    // 判定默认是否勾选
        chopsticksJudgeStatus: true,   // 判定是否需要将餐具勾选框恢复为默认值
        openMemberShow: false, // 开通会员提示
        orderHandling: false, // 确认下单，订单处理中提示
        ownPeopleMessage: {},  // 个人预订信息
        ownPeopleMessageClone: {},
        tagModel: false,   // 预定状态默认是false
        showNameChange: false,
        showTelChange: false,
        outerSellModel: false, // 外卖状态判定值  by limengxu
        address: '请输入地址',
        currentDiscountArr: [], // 当前达到优惠，折扣信息
        discountPrice: 0, // 优惠额度（满减活动）
        couponChecked: [] // 选中的优惠券（会员支付）目前针对5icrm
      };
    },
    computed: {
      showAddress() {
        return this.address;
      },
      totalPrice() {
        let total = 0;
        // this.selectFoods.forEach((food) => {
        //   total += food.price * food.count;
        // });
        // return total;
        if (window.sessionStorage.getItem('handleType') === 'selectPackage') {
          this.selectFoods.forEach((food) => {
            if (total < food.packagePrice && food.packagename === 'black') {
              total = food.packagePrice;
            }
            if (total < food.packagePrice && food.packagename === 'blue') {
              total = food.packagePrice;
            }
            if (total < food.packagePrice && food.packagename === 'red') {
              total = food.packagePrice;
            }
          });
        } else {
          this.selectFoods.forEach((food) => {
            // console.log('food.price ' + food.price + ' * ' + food.count + '=' + food.count * food.price);
            total += food.price * food.count;
          });
        }
        // 计算满减活动优惠额度 start
        this.discountPrice = 0;
        for (var i = 0; i < this.currentDiscountArr.length; i++) {
          if (this.currentDiscountArr[i].activityType === 3) { // 满减
            this.discountPrice = this.currentDiscountArr[i].discount;
            total -= this.currentDiscountArr[i].discount;
            console.log('满' + this.currentDiscountArr[i].marketConfine + '减' + this.currentDiscountArr[i].discount);
          }
        }
        // 计算满减活动优惠额度 end
        // 5icrm优惠券处理 start
        if (this.couponChecked.length !== 0) {
          var couponList = this.$root.member.memberBalance.consuVo.couponList;
          this.couponChecked.forEach((coupon) => {
            for (var j = 0; j < couponList.length; j++) {
              if (couponList[j].memberPromCouponId === coupon) {
                if (couponList[j].couponType === 1) { // 代金券
                  // console.log('使用代金券');
                  if (total > couponList[j].amount) {
                    total -= couponList[j].amount;
                  } else {
                    alert('满' + couponList[j].amount + '元可使用！');
                    this.cancelChecked(couponList[j].memberPromCouponId);
                  }
                }
                if (couponList[j].couponType === 4) { // 商品券
                  // console.log('使用商品券');
                  var isCouponName = false;
                  for (var k = 0; k < this.selectFoods.length; k++) {
                    if (this.selectFoods[k].name === couponList[j].memberCouponName.split('半价券')[0]) {
                      isCouponName = true;
                      if (total > this.selectFoods[k].price / 2) {
                        total -= this.selectFoods[k].price / 2;
                      } else {
                        alert('实际价格低于半价，不能使用券！');
                        this.cancelChecked(couponList[j].memberPromCouponId);
                      }
                      break;
                    }
                  }
                  if (!isCouponName) {
                    alert('您未点' + couponList[j].memberCouponName.split('半价券')[0] + '！');
                    this.cancelChecked(couponList[j].memberPromCouponId);
                  }
                }
                break;
              }
            }
          });
        }
        // 5icrm优惠券逻辑处理 end
        return total;
      },
      activitiesArr() {
        // 优惠活动数组 start
        // ***************************
        var activitiesArr = [];
        for (var j = 0; j < this.selectFoods.length; j++) {
          var currentFood = this.selectFoods[j];
          // console.log('当前菜品' + JSON.stringify(currentFood));
          currentFood.activity.forEach((ID) => {
            // console.log('activityId=  ' + ID);
            var isActivity = activitiesArr.some((item) => {
              return item.activityId === ID;
            });
            // console.log('isactivity' + '---' + isActivity);
            if (isActivity) {
              for (var k = 0; k < activitiesArr.length; k++) {
                if (activitiesArr[k].activityId === ID) {
                  activitiesArr[k].currentPrice += currentFood.price * currentFood.count;
                  break;
                }
              }
            } else {
              var activity = {};
              activity.activityId = ID;
              activity.currentPrice = currentFood.price * currentFood.count;
              activitiesArr.push(activity);
            }
          });
        }
        // console.log('活动数组' + JSON.stringify(activitiesArr));
        return activitiesArr;
        // ***************************
        // 优惠活动数组 end
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        return '进入管理';
//         if (this.totalPrice === 0) {
// //          return `￥${this.minPrice}元起送`;
//           return this.$t('lang.startPoint');    // by xiaozc
//         } else if (this.totalPrice < this.minPrice) {
//           let diff = this.minPrice - this.totalPrice;
//           if (this.$i18n.locale === 'zh-CN') {
//             return `还差￥${diff}元起送`;
//           } else {
//             return `￥${diff}yuan less send`;
//           }
//         } else {
//           if (this.peopleClass === 'titlewarning') {
//             return this.$t('lang.selectPeopleNUm');
//           }
//           if (this.tableClass === 'titlewarning') {
//             return this.$t('lang.selectTableNUm');
//           }
//           if (this.nameClass === 'titlewarning') {
//             return '填写姓名';
//           }
//           if (this.telClass === 'titlewarning') {
//             return '填写电话';
//           }
//           if (this.addressClass === 'titlewarning') {
//             return '填写地址';
//           }
//           if (this.$root.baseData.hotel.paymode === 1) {
//             return this.$t('lang.ConfirmOrder');
//           }
//           return this.$t('lang.toSettle');
//         }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        let show = !this.fold;
        // console.log('listShow执行：' + show + ',this.foldChopsticks:' + this.foldChopsticks);
        if (show || this.foldChopsticks) {
          if (!this.tableNum && !this.tagModel && !this.outerSellModel) {   // by xiaozc && 判定是否为预定模式下this.tagModel
            this.tableClass = 'titlewarning';
          } else {
            this.tableClass = 'title';
          }
          // console.log('listShow this.$root.peopleNum:' + this.$root.peopleNum);
          if (!this.$root.peopleNum) {   // by xiaozc
            this.peopleClass = 'titlewarning';
            // console.log('this.peopleClass:' + this.peopleClass);
          } else {
            this.peopleClass = 'title';
          }
          if (!this.ownPeopleMessage.name && (this.outerSellModel || this.tagModel)) {
            this.nameClass = 'titlewarning';
          } else {
            this.nameClass = 'title';
          }
          if (!this.ownPeopleMessage.tel && (this.outerSellModel || this.tagModel)) {
            this.telClass = 'titlewarning';
          } else {
            this.telClass = 'title';
          }
          if (this.address === '请输入地址' && this.outerSellModel) {
            this.addressClass = 'titlewarning';
          } else {
            this.addressClass = 'title';
          }
          this.foldChopsticks = false;
          this.handlescroll();
        }
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        return show;
      }
    },
    created() {
      if (this.$root.clientInfo === 'AlipayClient') {       // 支付宝支付
        this.payMethodText = this.$t('lang.aliPay');
      }
      if (this.$root.clientInfo === 'MicroMessenger') {       // 微信支付
        this.payMethodText = this.$t('lang.wechatPay');
      }
    },
    mounted() {
      if (sessionStorage.getItem('outerSellModel')) {
        this.outerSellModel = true;
        this.tagModel = false;
        this.$root.eventHub.$emit('outerSellModel');   // 设置为外卖模式
        sessionStorage.setItem('outerSellModel', false);   // 将session中的outerSellModel设置为false,  by limengxu
        this.ownPeopleMessage.servicetime = (new Date()).getHours() + ':00';
        this.$root.type = 30;       // 设置为外卖标记
      }
      this.$root.eventHub.$on('tagModel', () => {   // goods -> shopCart  将修改为预定状态 by limengxu
        this.tagModel = true;
        this.outerSellModel = false;
      });
      this.$root.eventHub.$on('address', (res) => {  // selectedMap -> shopCart
        this.address = res;
        console.log('address=' + this.ownPeopleMessage.address);
      });
      this.$root.eventHub.$on('ownPeopleMessage', (res) => {    // goods -> shopCart
        this.ownPeopleMessage = res;
      });
      this.$root.eventHub.$on('cancleOrderHandling', () => { //  取消订单提示
        this.orderHandling = false;
      });
      this.$root.eventHub.$on('arriveOrderDetail', () => { // 下单成功后到达订单详情页，清空购物车并取消订单处理中提示
        this.orderHandling = false;
        this.submitPaying = false;
        this.empty();
      });
      this.$root.eventHub.$on('changePayMethod', () => {
        this.payMethod = 'memberPay'; // 更改默认选择支付方式为会员支付
      });
      this.$root.eventHub.$on('syncOrderMemo', (res) => {
        this.orderMemo = res;
      });
      this.$root.eventHub.$on('passwordCompletedInput', (password) => { // 接收密码组件传过来的会员支付密码
        console.log('password=' + password);
        this.$root.member.password = password;
        this.passwordInput = false;
        this.pay();
      });
      var self = this;
      if (this.$root.peopleNum === '1') {     // 提示默认人数为1个
        this.selectedpeople[this.$root.peopleNum - 1] = true;
      };
      this.$root.eventHub.$on('peoplenum', function(res) {
        this.$nextTick(() => {
//          console.log('就餐人数选择完成');
          self.$root.peopleNum = res;
          self.fold = false; // 显示购物车
          self.peopleShow = false;
          self.peopleClass = 'title';
          // return;
        });
      });
      self.$root.eventHub.$on('bindChopstickeCount', function(res) {    // 对餐具进行加减时同步就餐人数  by limengxu
          if (JSON.stringify(res) !== '{}') {
            self.chopsticksJudge = res.chopsticksJudge;
            self.chopsticksJudgeStatus = false;
          } else {
            self.chopsticksJudgeStatus = true;
          }
          self.foldChopsticks = true;
        // console.log('self.chopsticksJudge,self.chopsticksJudgeStatus:' + self.chopsticksJudge + ',' + self.chopsticksJudgeStatus);
        // console.log('bindChopstickeCount:' + self.$root.peopleNum);
        for (let i = 0; i < self.peopleList.length; i++) {
            self.selectedpeople[i] = false;
        }
        self.selectedpeople[self.$root.peopleNum - 1] = true;
        if (self.$root.peopleNum === 0) {
          for (let i = 0; i < self.peopleList.length; i++) {    // 清除变为空值后的样式残留
            self.selectedpeople[i] = false;
          }
          self.$root.peopleNum = '';
        }
      });
      // this.$nextTick(() => {
      //   self.chopstick = self.$root.baseData.hotel.chopstick;     // 控制是否提示需要筷子
      // });
      // setTimeout(() => {
      //   self.chopstick = self.$root.baseData.hotel.chopstick;     // 控制是否提示需要筷子
      //   console.log('self.chopstick' + self.chopstick);
      // }, 1000);
    },
    deactivated() {
      // alert('shopcart - deactivated');
    },
    beforeUpdate() {    // by limengxu
      // console.log('this.$root.baseData.hotel.chopstick' + this.$root.baseData.hotel.chopstick);
      // this.chopstick = this.$root.baseData.hotel.chopstick;     // 控制是否提示需要筷子
      if (JSON.stringify(this.chopstick) !== '{}') {
        this.chopstickPrice = this.chopstick.price; // 取出筷子价格
        this.chopstickName = this.$root.baseData.hotel.chopstick.name;
      }
    },
    watch: {
      payMethod(method) {
        // console.log('change payMethod' + method);
        // 优惠券选中记忆 start 目前针对5icrm
        if (this.couponChecked.length !== 0) {
          sessionStorage.setItem('couponChecked', JSON.stringify(this.couponChecked));
        }
        if (method === 'defaultPay') {
          this.couponChecked = [];
        } else {
          if (sessionStorage.getItem('couponChecked')) {
            this.couponChecked = JSON.parse(sessionStorage.getItem('couponChecked'));
            sessionStorage.removeItem('couponChecked');
          }
        }
        // 优惠券选中 end
        if (this.$root.member.memberLevel === 0 && method === 'memberPay') {
          // console.log('会员等级' + this.$root.member.memberLevel);
          this.openMemberShow = true; // 开通会员提示
        }
        this.$root.eventHub.$emit('exchangePrice'); // 切换支付方式，价格交换（会员价与非会员价）
      },
      activitiesArr(activitiesArr) {
        console.log('watch---------activitiesArr' + JSON.stringify(activitiesArr));
        var filterActivitiesArr = [];
        if (this.$root.baseData.activities) {
          var activities = this.$root.baseData.activities;
          for (var i = 0; i < activities.length; i++) {
            for (var j = 0; j < activitiesArr.length; j++) {
              if (activities[i].activityid === activitiesArr[j].activityId && activitiesArr[j].currentPrice >= activities[i].marketConfine) {
                filterActivitiesArr.push(activities[i]);
                console.log('满足活动ActivityID=' + activities[i].activityid);
                break;
              }
            }
          }
          if (filterActivitiesArr.length > 0) {
            var currentDiscountArr = [];
            var activityTypeArr = [];
            for (var t = 0; t < filterActivitiesArr.length; t++) {
              var isActivityType = activityTypeArr.some((item) => {
                return item === filterActivitiesArr[t].activityType;
              });
              if (!isActivityType) {
                activityTypeArr.push(filterActivitiesArr[t].activityType);
              }
            }
            activityTypeArr.forEach((activityType) => {
              currentDiscountArr.push(this.getHigherActivity(activityType, filterActivitiesArr));
            });
            console.log('活动类型activityTypeArr=' + JSON.stringify(activityTypeArr));
            this.currentDiscountArr = currentDiscountArr;
          } else {
            this.currentDiscountArr = [];
          }
        }
      }
    },
    methods: {
      memberBalance() {
        var memberBalance = this.$root.memberName === '5icrm' ? this.$root.member.balance : this.$root.member.memberBalance.CardBalance;
        return memberBalance;
      },
      getHigherActivity(activityType, filterActivitiesArr) { // 获取每种类型活动最高的优惠
        var activityArr = [];
        for (var k = 0; k < filterActivitiesArr.length; k++) {
          if (filterActivitiesArr[k].activityType === activityType) {
            activityArr.push(filterActivitiesArr[k]);
          }
        }
        if (activityArr.length > 0) {
          var currentDiscount = {};
          currentDiscount = activityArr[0];
          for (var d = 1; d < activityArr.length; d++) {
            if (activityArr[d].marketConfine > currentDiscount.marketConfine) {
              currentDiscount = activityArr[d];
            } else if (activityArr[d].marketConfine === currentDiscount.marketConfine) {
              if (activityArr[d].discount > currentDiscount.discount) {
                currentDiscount = activityArr[d];
              }
            }
          }
          // console.log('当前优惠，折扣' + JSON.stringify(currentDiscount));
          return currentDiscount;
        }
      },
      selectAddress() {
        this.$router.push('selectedMap');
      },
      confirmTag(show) {
        console.log(JSON.stringify(this.ownPeopleMessageClone));
        this.ownPeopleMessage = JSON.parse(JSON.stringify(this.ownPeopleMessageClone));
        if (show === 'tel') {
          this.showTelChange = false;
        } else if (show === 'name') {
          this.showNameChange = false;
        }
      },
      showitemChange(item) {
        switch (item) {
          case 'showNameChange': this.showNameChange = true; break;
          case 'showTelChange': this.showTelChange = true; break;
          case 'showAddressChange': this.$router.push('selectedMap'); break;
        }
        this.ownPeopleMessageClone = JSON.parse(JSON.stringify(this.ownPeopleMessage));
      },
      blurOrderMemo() {
        console.log('备注失去焦点:' + this.orderMemo);
        this.$root.eventHub.$emit('lastHandleFood', {'food': {}, 'orderMemo': this.orderMemo, 'type': '4'}); // type = 4 同步整单备注
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      empty() {
        this.couponChecked = [];
        this.orderMemo = ''; // 清除整单备注
        if (!window.localStorage.getItem('tablenum')) { // by wangl
          this.tableNum = ''; // 点击清空时桌号不清空
        }
        // this.tableNum = '';   // by xiaozc
        this.$root.peopleNum = '';   // by xiaozc
        this.chopsticksJudgeStatus = true;  // 将餐具勾选框恢复为默认值  by limengxu
        this.$root.eventHub.$emit('changeChopsticks', {'peopleNum': this.$root.peopleNum, 'chopsticksJudge': true});
        console.log('emptythis.$root.peopleNum:' + this.$root.peopleNum);
        for (var i = 0; i < this.peopleList.length; i++) { // 再次选取人数时，前一次选取的桌号会变色提示用户
          this.selectedpeople[i] = false;
        }
        // console.log(this.selectFoods.length);
        this.$root.eventHub.$emit('emptyCart', {data: this.selectFoods});   // by xiaozc. 清空购物车 -> cartcontrol.vue
        this.$root.eventHub.$emit('lastHandleFood', {'food': {}, 'type': '3'}); // type = 3 清空
      },
      showtablelist() {
        console.log('showtablelist()=' + this.$root.baseData.tableInfo.length);
        if (window.localStorage.getItem('tablenum')) { // by wangl 有桌号不再弹出选桌号弹框
          return;
        }
        this.peopleShow = false;
        // this.tableShow = !this.tableShow;
        this.tableModal = true;
        if (!this.tableShow) {
          this.handlescroll();
        }
      },
      closetable() {
        this.tableModal = false;
      },
      showpeoplelist() {
        // console.log('this.$root.baseData.hotel.chopstick:' + JSON.stringify(this.$root.baseData.hotel.chopstick));
        // this.chopstick = this.$root.baseData.hotel.chopstick;     // 控制是否提示需要筷子
        // this.peopleShow = !this.peopleShow;
        // this.tableShow = false;
        // this.$root.eventHub.$emit('showpeople');
        if (this.$root.baseData.hotel.chopstick) {
          this.chopstick = this.$root.baseData.hotel.chopstick;     // 控制是否提示需要筷子
        }
        let self = this;        // by limengxu 更改chopstick.status状态值
        // 1:默认勾选，选人数时将添加筷子到购物车
        // 2:默认不勾选
        // -1:不显示勾选项
        console.log('self.chopsticksJudgeStatus' + self.chopsticksJudgeStatus);
        if (self.chopsticksJudgeStatus) {
          if (self.chopstick && self.chopstick.status === 1) {
            // console.log('chopsticksJudge状态值为1');
            this.chopsticksJudge = true;
          }
          if (self.chopstick && self.chopstick.status === 2) {
            // console.log('chopsticksJudge状态值为1');
            this.chopsticksJudge = false;
          }
          self.chopsticksJudgeStatus = false;
          // console.log('this.chopsticksJudge状态值为：' + self.chopsticksJudge);
        }
        this.peopleModal = true;
        // if (!this.peopleShow) {
        //   this.handlescroll();
        // }
        // console.log('peopleShow==' + this.peopleShow);
        // console.log('tableShow==' + this.tableShow);
      },
      gettablenum(e) {
        this.tableNum = e.currentTarget.id;   // id存放的是桌台code
        this.tableShow = false;
        this.tableClass = 'title';
        for (var i = 0; i < this.$root.baseData.tableInfo.length; i++) {   // 再次选取桌号时，前一次选取的桌号会变色提示用户
          this.selectedtable[this.$root.baseData.tableInfo[i].code] = false;
          if (this.$root.baseData.tableInfo[i].code === this.tableNum) {
            this.selectedtable[this.$root.baseData.tableInfo[i].code] = true;
          }
        }
        // this.peopleShow = true;   // 用户选完桌号立马弹出选择人数
        this.handlescroll();
      },
      // 获取就餐人数
      getpeoplenum(e) {
        console.log('e.people :' + JSON.stringify(e.people));
        this.$root.peopleNum = JSON.stringify(e.people);
        this.alertshow = false;  // 提示界面消失
        for (var i = 0; i < this.peopleList.length; i++) { // 再次选取人数时，前一次选取的桌号会变色提示用户
          this.selectedpeople[i] = false;
        }
        // console.log('shopcart-lastHandlePeopleNum:' + this.$root.peopleNum);
        this.$root.eventHub.$emit('lastHandlePeopleNum', this.$root.peopleNum);   // 传输至 goods.vue
        if (this.$root.peopleNum) {
          this.selectedpeople[this.$root.peopleNum - 1] = true;
        }
      },
      handlescroll() {
        var self = this;
        this.$nextTick(() => {
          if (!self.scroll) {
            if (self.$refs.listContent) {   // by xiaozc. 避免选桌号后遇到的undefined错误
              console.log('handlescroll1');
              self.scroll = new BScroll(self.$refs.listContent, {
                click: true
              });
            } else {
              console.log('handlescroll2');
            }
          } else {
            console.log('handlescroll3');
            self.scroll.refresh();

            /*  v-if变成v-show后这段代码不再需要,否则导致购物车里点加数量不断倍增. by xiaozc
            if (self.$refs.listContent) {   // by xiaozc. 避免选桌号后遇到的undefined错误
              self.scroll = new BScroll(self.$refs.listContent, {   // by xiaozc. 解决点菜后直接点击购物车显示后再选择桌号订单列表无法滑动的奇怪bug. TODO: 目前是折衷办法后续找到最优办法
                  click: false
                });
            } else {
              console.log('handlescroll4');
            }
            */
          }
        });
      },
      peoplesubmit() {
        if (this.$root.peopleNum === '') {
          this.peopleModal = true;
          this.alertshow = true;
        } else {
          this.peopleModal = false;
          this.alertshow = false;
          this.fold = false;
        }
         // 显示购物车
        if (!this.tableNum) {
          // this.showtablelist();
        }
        // this.peopleShow = false;
        // this.peopleClass = 'title';
        if (JSON.stringify(this.chopstick) !== '{}' && this.$root.peopleNum !== '') {
          this.chopstickSubimit();
        } else {
          console.log('----------不存在筷子--------------');
          this.$root.eventHub.$emit('lastHandleFood', {'food': {}, 'type': '5'}); // type = 5 同步人数
        }
      },
      chopstickSubimit() {              // 提交人数时对餐具数量进行更改   by limengxu
        let chopsticksJudge = this.chopsticksJudge;
        // console.log('chopsticksJudge' + JSON.stringify(chopsticksJudge));
        if (chopsticksJudge) {
          this.$root.eventHub.$emit('changeChopsticks', {'peopleNum': this.$root.peopleNum, 'chopsticksJudge': true});
          // console.log('this.selectFoods' + JSON.stringify(this.selectFoods));
        } else {
          this.selectFoods.forEach((food) => {
            if (food.id === this.$root.baseData.hotel.chopstick.id) {
              // console.log('查到有筷子id' + JSON.stringify(food.count));
              if (food.count && food.count > 0) {
                this.$root.eventHub.$emit('changeChopsticks', {'peopleNum': 0, 'chopsticksJudge': false});
                // console.log('将餐具数量值为0');
                return;
              }
            }
          });
          this.$root.eventHub.$emit('lastHandleFood', {'food': {}, 'type': '5'}); // type = 5 同步人数
        }
      },
      payBefore() {
        this.$router.push({ name: 'manage', params: {cid: sessionStorage.getItem('cid'), token: this.$route.params.token} });
        //        if (this.totalPrice < this.minPrice) {
//           let chopsticksJudge = document.getElementsByName('chopsticksJudge')[0];
//         if (this.totalPrice < this.minPrice || this.totalPrice <= 0) {
//           console.log('请点菜');
//           return;
//         }

//         if (!this.$root.peopleNum) {
// //          this.fold = false;    // by xiaozc
//           this.peopleClass = 'titlewarning';
//           this.peopleModal = true;
//           this.showpeoplelist();
//           // if (this.$root.baseData.hotel.chopstick) {
//           //   this.chopstick = this.$root.baseData.hotel.chopstick;     // 控制是否提示需要筷子
//           // }
//           return;
//         }
//         if (!this.tableNum && !this.tagModel && !this.outerSellModel) {
//           this.fold = false;
//           this.tableClass = 'titlewarning';
//           this.showtablelist();
//           return;
//         }
//         if (!this.ownPeopleMessage.name && (this.tagModel || this.outerSellModel)) {
//           // this.fold = false;
//           this.nameClass = 'titlewarning';
//           this.showitemChange('showNameChange');
//           return;
//         }
//         if (!this.ownPeopleMessage.tel && (this.tagModel || this.outerSellModel)) {
//           // this.fold = false;
//           this.telClass = 'titlewarning';
//           this.showitemChange('showTelChange');
//           return;
//         }
//         if (this.address === '请输入地址' && this.outerSellModel) {
//           // this.fold = false;
//           this.addressClass = 'titlewarning';
//           this.showitemChange('showAddressChange');
//           return;
//         }
//         if (this.submitPaying) {
//           return;
//         }
// // ************************************支付方式判断start****************************************
//         this.chopsticksJudgeStatus = true; // 支付时将餐具勾选框设置设置为默认值 by limengxu
//         if (this.payMethod === 'defaultPay') {
//           this.$root.member.memberPay = false;
//           this.pay();
//         }
//         if (this.payMethod === 'memberPay') { // 判断支付方式为会员支付 by shaomeng
//           this.$root.member.memberPay = true;
//           if (this.$root.member.memberBalance.CardBalance < this.totalPrice) {
//               this.lessBalanceDialog = true;
//               return;
//             }
//           if (this.$root.memberName === '5icrm') {
//             console.log('他是5icrm会员，不显示密码输入');
//             this.pay();
//           } else {
//             this.passwordInput = true;
//           }
//         }
// ************************************支付方式判断end****************************************
      },
      pay() {
        console.log('支付方式' + this.payMethod);
        console.log('是否为会员支付：' + this.$root.member.memberPay);
        this.submitPaying = true;
        this.orderHandling = true;
        console.log('cid=' + this.$root.baseData.hotel.id + ', this.$root.urlParam=' + JSON.stringify(this.$root.urlParam));

//        window.alert(`支付${this.totalPrice}元`);
// 菜品code分别是：${this.selectFoods[0].code}, urlParam.tablenum=${this.tableNum}, urlParam.token=${this.$root.urlParam.token}, embedded=${this.$root.urlParam.embedded} ...

      if (window.sessionStorage.getItem('handleType') === 'selectPackage') {
          if (!window.confirm(`本订单桌号是${this.tableNum}, 订单总额是${this.totalPrice}元, 就餐人数为${this.$root.peopleNum}人,一共点了${this.selectFoods.length}个菜, 点击确定后将提交下单`)) {
            console.log('未下单1');
            this.submitPaying = false;
            return;
          }
      }
        // if (window.confirm(`本订单桌号是${this.tableNum}, 订单总额是${this.totalPrice}元, 就餐人数为${this.$root.peopleNum}人,一共点了${this.selectFoods.length}个菜, 点击确定后将提交下单`)) {
          // console.log('确定');
          var dataJson = {};
          dataJson.cmd = 'createorder';
          if (this.$root.urlParam.embedded) {   // by xiaozc.
            dataJson.cmd = 'getbill';
            console.log('dataJson.cmd = getbill');
          }
          dataJson.cid = this.$root.baseData.hotel.id;   // '1006';
          dataJson.data = {};
          dataJson.data.hotelid = dataJson.cid;
          dataJson.data.platformId = sessionStorage.getItem('platformId'); // 获取session里的platformId,避免刷新页面找不到platformId
          dataJson.data.status = '0';
          dataJson.data.employee = '';
          dataJson.data.employeecode = '';
          dataJson.data.peoplenum = this.$root.peopleNum;
          dataJson.data.client = this.$root.urlParam.token;    // 'fuwuyuan-client';   by xiaozc
          dataJson.data.desc = '';   // '秀餐测试单'
          dataJson.data.printid = '';
          dataJson.data.paytype = 'unpaid';
          dataJson.data.tablenum = this.tagModel || this.outerSellModel ? null : this.tableNum; // 在预定或外卖情况下绕过桌号不能为空判定
          dataJson.data.time = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
          dataJson.data.code = dataJson.cid + dataJson.data.time.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '') + dataJson.data.tablenum;
          dataJson.data.order = [];
          dataJson.data.paid = 0;
          dataJson.data.name = this.ownPeopleMessage.name;   // 个人预定信息 start  by limengxu
          dataJson.data.tel = this.ownPeopleMessage.tel;
          dataJson.data.couponbyscore = this.discountPrice; // 优惠额度
          if (this.outerSellModel) {
            this.ownPeopleMessage.servicetime = (new Date()).toLocaleDateString().replace(/\//g, '-') + ' ' + this.ownPeopleMessage.servicetime;   // 当为外卖模式时，返回的servicetime只有小时分钟，无日期
          }
          // console.log('this.ownPeopleMessage.servicetime=' + this.ownPeopleMessage.servicetime);
          dataJson.data.servicetime = Date.parse(new Date(this.ownPeopleMessage.servicetime)) / 1000;
          dataJson.data.address = this.address;
          dataJson.data.type = this.$root.type;   // 个人预定信息 end  by limengxu
          if (window.sessionStorage.getItem('handleType') === 'selectPackage') {
            dataJson.data.ispackage = 1;
          }
          var totalPrice = 0;
          var orderCount = 0;
          for (var i = 0; i < this.selectFoods.length; i++) {
            var item = {};
            item.id = this.selectFoods[i].id;
            item.code = this.selectFoods[i].code;
            item.name = this.selectFoods[i].name;
            item.price = this.selectFoods[i].price;
            item.count = this.selectFoods[i].count;
            totalPrice += item.price * item.count;
            orderCount += item.count;
            item.memo = this.selectFoods[i].memostr;
            item.printid = '';
            item.status = 0;
            dataJson.data.order.push(item);
          }
          dataJson.data.allmemo = this.orderMemo;
          dataJson.data.totalPrice = this.totalPrice.toFixed(2);
          dataJson.data.orderCount = orderCount;
          dataJson.data.clientInfo = this.$root.clientInfo;
          if (this.$root.clientInfo === 'AlipayClient') { // 暂时屏蔽口碑业务类型
            // dataJson.data.order_type = 'order_dish';
            // // window.alert(this.$root.urlParam);
            // dataJson.user_id = this.$root.platformId;
            // // window.alert('userid=' + this.$root.platformId);
            // dataJson.shop_id = this.$root.urlParam.shop_id;
            // // window.alert('shopid=' + this.$root.urlParam.shop_id);
          }
          if (this.$root.baseData.hotel.paymode === 1) { // 如果后台设置为后付模式 by wangl
              dataJson.data.orderChannel = 'paylater';
          }
          dataJson.data.erpTag = this.$root.baseData.hotel.erptag; // 门店软件配置信息 by wangl
          if (this.$root.urlParam.embedded) {   // by xiaozc.
            dataJson.data.rawdata = totalPrice;
            console.log('dataJson.cmd.getbill=' + dataJson.data.rawdata);
          }
          window.localStorage.setItem('orderTotalPrice', dataJson.data.totalPrice);
    /*
          var dataJson = {
            'cmd': 'createorder',
            'cid': '931',
            'data': {
              'hotelid': '931',
              'status': '0',
              'employee': '',
              'employeecode': '',
              'peoplenum': '1',
              'client': 'fuwuyuan-client',
              'desc': '',
              'printid': '',
              'type': '10',
              'paytype': 'unpaid',
              'tablenum': '0008',
              'time': '2017-04-08 16:33:00',
              'code': '931201704081633000008',
              'order': [
                {
                  'code': '00001',
                  'name': '糖醋心里美',
                  'price': 10,
                  'count': 1,
                  'printid': '',
                  'status': 0
                },
                {
                  'code': '00002',
                  'name': '老醋花生米',
                  'price': 13,
                  'count': 1,
                  'printid': '',
                  'status': 0
                },
                {
                  'code': '00003',
                  'name': '小葱豆腐',
                  'price': 10,
                  'count': 1,
                  'printid': '',
                  'status': 0
                }
              ]
            }
          }
    */

          /*
           *  {
           *  "tablenum":"101",
           *  "desc":"ZDCX 001<br>帐单编号：KT-170317-0001<br>房台编号：101<br>商品总额：0.01<br>消费总额：0.01<br>菜品个数：1<br>燕京啤酒         1瓶<br>",
           *  "status":"40",
           *  "hotelid":"1016",
           *  "code":"-1",
           *  "type":"70",
           *  "rawdata":"0.01",
           *  "order":orderJson
           *  }
          */
          // this.$root.newOrder = dataJson;
          // console.log('createorder.dataJson=' + JSON.stringify(dataJson));
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
              // window.alert('response.data1 = ' + response.data.message);
              if (response.data.status === 0) {
                // 订单号存储到localStorage,订单详情去取;
                // 存储后4位订单号
                window.localStorage.setItem('orderIdNumber', response.data.message.substr(response.data.message.length - 4));
                window.localStorage.setItem('orderId', response.data.message);
                var orderJson = {};
                if (self.$root.clientInfo === 'AlipayClient') {
                    orderJson.order_type = 'order_dish';
                    if (self.$root.baseData.hotel.paymode === 1) { // 如果后台设置为后付模式 by wangl
                      // router.push('orderDetail');
                      location.href = '#/orderDetail';
                      // window.location.reload(); // TODO:后续优化不使用跳转 by wangl
                      return;
                    }
                }
                if (self.$root.clientInfo === 'MicroMessenger') {
                    if (self.$root.baseData.hotel.paymode === 1) { // 如果后台设置为后付模式 by wangl
                      // router.push('orderDetail');
                      location.href = '#/orderDetail';
                      // window.location.reload(); // TODO:后续优化不使用跳转 by wangl
                      return;
                    }
                }
                if (self.$root.member.memberPay) { // 会员支付
                  // var memberPartner, memberChannel;
                  self.$root.baseData.payconfig.forEach((item) => {
                    if (item.paytype === 'membercard') {
                      orderJson.partner = item.partner;
                      orderJson.channel = item.channel;
                      orderJson.memberPromCouponIds = self.couponChecked; // 目前针对5icrm优惠券
                    }
                  });
                }
                // if (orderJson.companyName === '') {
                orderJson.companyName = sessionStorage.getItem('companyName');  // 店名;
                // }
                orderJson.orderId = response.data.message;
                orderJson.price = self.totalPrice.toFixed(2);
                self.$root.goPay(orderJson);

                self.submitPaying = false;
              } else {
                console.log('订单失败');
              }
            }).catch(function(error) {
              self.orderHandling = false;
              if (!self.$root.urlParam.embedded) {  // embedded嵌入第三方web
                window.alert('订单提交失败，请重试。失败原因=' + error);
              }
              self.submitPaying = false;
            });
          // }

  //         var self = this;
  //         axios({
  //           method: 'post',
  //           url: 'http://www.xiucan.com/api/v2/message/',
  //           data: dataJson,
  //           headers: {
  //             'Content-Type': 'application/json'
  //           }
  //         }).then(function(response) {
  //         response.data.pipe(fs.createWriteStream('demo.jpg'));
  //          console.log('response.data=' + JSON.stringify(response));
  //           self.empty();   // by xiaozc.
  //           if (!self.$root.urlParam.embedded) {
  //             // window.alert('订单提交完成');
  //             self.goPay(response.data);
  //           }
  //         }).catch(function(error) {
  //           if (!self.$root.urlParam.embedded) {
  //             window.alert('订单提交失败，请重试。失败原因=' + error);
  //           }
  //         });
  //       }
      },
      // 对Date的扩展，将 Date 转化为指定格式的String
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
      // (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
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
      addFood(target) {
        this.drop(target);
      },
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      activitiesClose() { // 关闭优惠活动提示
        console.log('activitiesClose');
        document.getElementsByClassName('activities')[0].style.display = 'none';
      },
      cancelChecked(memberPromCouponId) {
        for (var c = 0; c < this.couponChecked.length; c++) {
          if (this.couponChecked[c] === memberPromCouponId) {
            this.couponChecked.splice(c, 1);
            break;
          }
        }
      }
    },
    filters: {           // by xiaofei
      fmtPrice(price) {
        return price.toFixed(2);
      }
    },
    components: {
      cartcontrol,
      PasswordInput,
      Group,
      Cell,
      Datetime
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/bootstrap.css"   // by xiaozc
  @import "../../common/stylus/mixin.styl"
  @font-face {
    font-family: 'iconfont';
    src: url('../../common/fonts/iconfont.eot');
    src: url('../../common/fonts/iconfont.eot?#iefix') format('embedded-opentype'),
    url('../../common/fonts/iconfont.woff') format('woff'),
    url('../../common/fonts/iconfont.ttf') format('truetype'),
    url('../../common/fonts/iconfont.svg#iconfont') format('svg');
  }
  .iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
  .outerSellTop{
    background-color:#fff;
    width:100%;
    padding: 10px 20px;
  }
  .outerSellTop .outerSellAddress{
    border-bottom: 1px solid #d0d0d0;
    padding: 10px 0px;
    display: flex;
    align-items: Center;
    position: relative;
  }
  .outerSellTop .outerSellAddress .outerSellContent{
    margin-left: 10px;
    line-height: 26px;
  }
  .outerSellTop .outerSellAddress .outerSellContent p:nth-child(1){
    font-weight: 700;
  }
  .outerSellTop .outerSellAddress .outerSellContent p:nth-child(2){
    font-size: 14px;
    color: #6f6f6f;
  }
  .outerSellTop .outerSellTime{
    position:relative;
    height: 50px;
    line-height: 50px;
  }
  .outerSellTime .dataTime p {
    line-height: 50px;
    padding-left: 10px;
    font-weight: bold;
    color: #333!important;
  }
  .outerSellTime .weui-cell_access .weui-cell__ft:after{
    width:9px;
    height: 9px;
    border-color: #565656;
    margin-right: 3px;
  }
  .outerSellTime .vux-cell-value{
    margin-right: 5px;
  }
  .list-button .dataTime p{
    background: none!important;
    color: #07111b!important;
    font-size: 14px!important;
    font-weight: 300!important;
    line-height: 40px;
  }
  .list-button .vux-cell-value{
    color: #00a0dc;
    font-size: 14px;
  }
  .list-button .weui-cells{
    background-color:#f3f5f7;
  }
  .activities { // 优惠活动规则
    width:100%;
    background:#fffbd8;
    position:fixed;
    bottom:48px;
    opacity:0.95;
    padding:8px;
    font-size:13px;
    .activitiesContent {
      width:100%;
      display:inline-block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      text-align:center;
      vertical-align: middle;
    }
    .activitiesClose {
      position:absolute;
      right: 8px;
      margin: 0;
      top: 6px;
      font-size: 17px;
    }
  }
  .memo textarea{
    color:#333 !important;
    font-size:12px;
    margin-top:10px;
  }
  .weui-check__label:active{
    background:#fff !important;
  }
  .memo textarea::placeholder{
    color:#888;
  }
  .memberPayInput {
    width:100%;
    padding:0 !important;
    padding-top:10px !important;
    padding-bottom:10px !important;
    background:none !important;
    border:none !important;
    margin:0 auto;
  }
  .weui-dialog p{
    background: #fff;
  }
  .memberPayInput input{ 
    display:inline-block;
    border-top:1px solid #9f9f9f; 
    border-bottom:1px solid #9f9f9f; 
    border-left:1px solid #9f9f9f; 
    width: 16%; 
    height: 50px; 
    outline:none; 
    font-family: inherit; 
    font-size: 18px; 
    font-weight: inherit; 
    text-align: center; 
    line-height: 10px; 
    color: #ccc;
  } 
  .memberPayInput input:last-child { 
    border-right:1px solid #9f9f9f; 
  } 
  .peoplebutton{
    outline:none !important
    width:100%
  }
  .peoplebutton:hover{
    background-color:#ffffff;
    color:#29A72C!important;
  }
  .btn{
    color:#000 !important;
  }
  .people {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    background: white !important;
    border: 0px solid white !important;
    margin-left:-5px;
  }

  .scrollMore {  //  byxiaofei 让桌号变得可滑动 
    overflow-y: scroll;
    max-height:300px;
  }
  .removeOutline { // byuxiaofei 清楚点下去的 外边框
    outline:none !important;
  }
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
        .discountPrice
          height:48px
          display:inline-block
          font-size:12px
          line-height:48px
          padding:0 10px
          color:#fff
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-button
        height: 40px
        line-height: 18px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          line-height: 40px
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .titlewarning
          line-height: 40px
          float: left
          font-size: 14px
          color: red
        .tablenum
          float: right
          font-size: 14px
          line-height: 40px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
      .memberInfo ul
        padding: 10px 0
        li
          padding: 5px 0
          font-size: 14px
        .coupon
          .couponList
            display: inline-block
            float: right
            margin-top: -10px
            ul
              padding: 0
              li
                div
                  float: right
                  padding: 5px 0
                  input
                    margin: 0 0 0 5px
                    vertical-align: middle
        .balance
          clear: both
          span
            float: right
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)

  /* centered columns styles */
  .row-centered {
      text-align:center;
  }
  [class*="col-"] {
    padding-top:10px;
    padding-bottom:15px;
    border:1px solid lightgray;
    background:gainsboro;
  }
  .item {
    width:100%;
    height:100%;
    padding:8px 8px;
  }

  .peopleselected {  // 用于再次选人数时变色突出前一次的选择
    background-color: #ffffff;
    color: #09BB07 !important;
    border-color:#09BB07;
  }
  .tableselected {  // 用于再次选桌号时变色突出前一次的选择
    background-color: #ffffff;
    color: #09BB07 !important;
    border-color:#09BB07;
  }
</style>
