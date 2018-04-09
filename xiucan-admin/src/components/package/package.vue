<template>
  <div>
    <!-- 数据加载modal start -->
    <div v-if="loadingModal" id="loadingToast" style="display: block;">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">{{ $t('lang.loading') }}</p>
      </div>
    </div>
    <!-- 数据加载modal  end -->
  <!-- 菜品备注弹框 start -->
  <div v-if="memoModal">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{ $t('lang.memoTaste') }}</strong></div><!-- 备注口味 -->
        <div class="weui-dialog__bd">
          <div class="btn-group" role="group" v-for="(memo, memoListIndex) in memoList">
              <button type="button" class="btn btn-default" v-bind:class="{ memoselected: selectedmemo[memoListIndex][oneMemoIndex] }" @click="memoClicked(food, memoListIndex, oneMemoIndex)" v-for="(oneMemo, oneMemoIndex) in memo.name">
                <font>{{oneMemo}}</font>
              </button>
          </div>
        </div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" @click="closeMemo" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
        </div>
    </div>
  </div>
  <!-- 菜品备注弹框 end -->
    <div class="goods1" v-bind:class="{ koubei: goodsTabShow}" v-if="layout == 1">
      <div class="menu-wrapper" ref="menuWrapper">
      <scroller :on-refresh="refresh" :on-infinite="infinite" ref="menuScroller" style='left:0 !important;'>
        <ul>
          <li v-for="(item,index) in this.$root.baseData.userDish" class="menu-item" :class="{'current':listIndex===index}"
              @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
        </scroller>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
          <ul>
            <li v-for="item in goods" class="food-list" ref="foodList">
              <h1 class="title">{{item.name}}</h1>
              <ul>
                <li v-for="food in item.foods" class="food-item border-1px">
                  <div class="icon">
                   <img width="57" height="57" :src="food.pic" @click="selectFood(food,$event)">
                  </div>
                  <div class="content">
                    <h2 class="name"><font :color="food.packagename">{{food.name}}</font></h2>

                    <h2 class="memo" @click="getMemoList(food)" v-show="(food.memo && selectedFoodMemoShow[food.id]) ? true: false">
                      <button type="button" class="btn btn-default btn-xs" style="color: #f01414;margin-top:-2px;margin-right:-0px;">{{ $t('lang.memo') }}</button>
                    </h2>
                    <p class="desc">{{food.description}}</p>
                    <div class="extra" v-if="this.$i18n == 'zh-CN'">
                      <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="extra" v-if="this.$i18n == 'en'">
                      <span class="count">{{food.sellCount}} copies per month</span><span>Favorable rate of {{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol @add="addFood" :food="food"></cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </scroller>
      </div>
      <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
                :minPrice="seller.minPrice"></shopcart>
    </div>
    <div class="goods0" v-bind:class="{ koubei: goodsTabShow}" v-if="layout == 0">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
              @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <!-- <div class="foods-wrapper" ref="foodsWrapper"> -->
     <!--  <scroller :on-refresh="refresh" :on-infinite="infinite" style="padding-top: 44px;" class="foods-wrapper" ref="foodsWrapper" >
        <ul>
          <li v-for="item in goods" class="food-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px">
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                    <h2 class="memo" @click="getMemoList(food)" v-if="food.memo ? true: false">
                      <button type="button" class="btn btn-default btn-xs" style="color: #f01414;">备注</button>
                    </h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old"
                                                                  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </scroller> -->
      <!-- </div> -->
            <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
                :minPrice="seller.minPrice"></shopcart>
    </div>
    <food @add="addFood" :food="selectedFood" ref="food"></food>

    <login-modal ref="loginModal"/>
  </div>
</template>

<script type="text/ecmascript-6">
  // import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  import axios from 'axios';    // by xiaozc
  import Vue from 'vue';        // by xiaozc

  import LoginModal from 'components/LoginModal.vue';   // by chuangjing
  import VueScroller from 'vue-scroller'; // by wangl
  Vue.use(VueScroller);
//  const ERR_OK = 0;   // by xiaozc

  const initialDishCount = 10; // 第一次加载的菜品数量;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        packageList: [],
        currentIndex: 0,
        currentCategoryIndex: 0,
        currentItemIndex: 0,
        // listHeight: [],
        listIndex: 0,
        scrollY: 0,
        selectedFood: {},
        selectedFoodMemoShow: {},   // by xiaozc
        layout: !window.localStorage.getItem('layout') ? 1 : window.localStorage.getItem('layout'),  // 菜品图片是否显示  0: 无图模式  1: 有图模式  TODO：未来可扩展
        memoList: [],
        food: {},
        selectedmemo: null,
        memoModal: false,
        goodsTabShow: false,
        loadingModal: true,
        dishLength: 0
      };
    },
    computed: {
      // currentIndex() {
      //   return this.listIndex;
      //   // for (let i = 0; i < this.listHeight.length; i++) {
      //   //   let height1 = this.listHeight[i];
      //   //   let height2 = this.listHeight[i + 1];
      //   //   if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
      //   //     console.log('i=' + i);
      //   //     return i;
      //   //   }
      //   // }
      //   // return 0;
      // },
      selectFoods() {
//        console.log('selectFoods');
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
//              this.selectedFoodMemoShow[food.id] = true;
              Vue.set(this.selectedFoodMemoShow, food.id, true);
              // console.log('selectFoods.selectedFoodMemoShow.id=' + food.id + ', result=' + this.selectedFoodMemoShow[food.id]);
            } else {
//              this.selectedFoodMemoShow[food.id] = false;
              Vue.set(this.selectedFoodMemoShow, food.id, false);
            }
          });
        });
        return foods;
      }
    },
    created() {
      // console.log('goods.created');
      // this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      // var localToken = window.localStorage.getItem('token');
      // if (localToken) {
      //   this.$root.urlParam.token = localToken;
      // }
      // if (this.$root.urlParam.token) {
      //   this.$root.eventHub.$emit('tokenRetrived');
      // } else {
      //   this.showLogin();
      // }
    },
    mounted() {
      // console.log('package.mounted.enter=' + (new Date()).getTime());
      // if (this.$root.clientInfo === 'MicroMessenger') {
      //   if (!this.$root.urlParam.code) {
      //     return;
      //   }
      // }
      // console.log('goods.mounted');
      if (!this.$root.urlParam.code) {  //  ali and wechat code 是统一的
        if (this.$root.clientInfo === 'MicroMessenger') {
          // console.log('goods.mounted is MicroMessengers');
          if (!this.$root.urlParam.openid) {
            // console.log('no openid');
            return;
          }
          // console.log('has openid');
        }
        if (this.$root.clientInfo === 'AlipayClient') {
          // console.log('goods.mounted is AlipayClient');
          if (!this.$root.urlParam.shop_id && !this.$root.urlParam.user_id) {
            return;
          }
        }
      }
      // console.log('goods.mounted.ok');
      if (this.$root.clientInfo === 'AlipayClient') {
        this.goodsTabShow = true;
        // if (!this.$root.urlParam.auth_code) {
        //   return;
        // }
      }
      if (!this.$root.showHeader) { // 订单详情页面返回展示header  by wanglei
        this.$root.showHeader = true;
      }
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      var self = this;

      this.$root.eventHub.$on('layoutRetrived', function(msg) {
        self.layout = msg;
       // console.log('header.vue--this.layout=====' + self.layout);
        return;
      });

      // var localStorage = window.localStorage;  //暂时屏蔽
      this.$root.eventHub.$on('tokenRetrived', function() {
        // console.log('goods1.vue.tokenRetrived');

        var restUrl = '';
        console.log('goods.mounted.enter=' + (new Date()).getTime());

        if (self.$root.urlParam.shop_id) {
          // 如果是口碑下面按钮进入点餐会携带shop_id   没有token  by wangl
          restUrl = 'http://www.xiucan.com/api/v2/getcloudbasedatabykoubei/' + self.$root.urlParam.shop_id; // 'static/data.json';
        }
        if (self.$root.urlParam.token) {
          restUrl = 'http://www.xiucan.com/api/v2/getcloudbasedata/' + self.$root.urlParam.token; // 'static/data.json';
        }
        // var restUrl = 'static/data.json';
        axios.get(restUrl).then((res) => {
//        this.goods = res.data.goods
//        console.log('showme.before=' + JSON.stringify(res.data));
//        console.log('res.data.hotel.id=' + res.data.hotel.id);
          console.log('goods.getcloudbasedata.success=' + (new Date()).getTime());

          if (!res.data) {
            // console.log('showme');
            self.handleTokenError();
            return;
          }

          if (!self.$root.urlParam.token) {
            self.$root.urlParam.token = res.data.hotel.token;
          }
          self.$root.baseData = res.data;
          self.$root.payConfig = res.data.payconfig;
          self.$root.cid = res.data.hotel.id;
          // window.localStorage.setItem('token', self.$root.urlParam.token);
          // console.log('localStorage-token=' + localStorage.getItem('token'));
          self.setGoods(0, initialDishCount);
          // by xiaozc
          // var loadCountThreashold = 20;
          // var currentIndex = 0;
          // var menuList = res.data.userDish;
          // for (var i = 0; i < menuList.length; i++) {
          //   var menuCategory = {};
          //   menuCategory.id = menuList[i].id;
          //   menuCategory.name = menuList[i].name;
          //   menuCategory.type = -1;
          //   var menuCategoryItemList = [];
          //   for (var j = 0; j < menuList[i].items.length; j++) {
          //     currentIndex++;
          //     console.log('currentIndex=' + currentIndex);
          //     if (self.loadingModal) {
          //         if (currentIndex > loadCountThreashold) {
          //           // window.alert('currentIndex');
          //           // self.$nextTick(() => {
          //             // self.loadingModal = false;
          //             break;
          //           // });
          //           // window.alert('self.loadingModal=' + self.loadingModal);
          //           // window.alert('end');
          //         }
          //     }
          //     var item = {};
          //     item.id = menuList[i].items[j].id;
          //     item.code = menuList[i].items[j].code;
          //     item.name = menuList[i].items[j].name;
          //     item.price = menuList[i].items[j].price;
          //     item.unit = menuList[i].items[j].unit;
          //     item.pic = menuList[i].items[j].pic;
          //     if (menuList[i].items[j].memo) {     // by wangl
          //       item.memo = menuList[i].items[j].memo;
          //     };
          //     item.oldPrice = '';
          //     item.description = '';
          //     item.sellCount = '';
          //     item.rating = '';
          //     item.info = '';
          //     item.ratings = [];
          //     item.icon = '';
          //     item.image = '';
          //     menuCategoryItemList.push(item);
          //   }
          //   menuCategory.foods = menuCategoryItemList;
          //   self.goods.push(menuCategory);
          //   if (currentIndex > loadCountThreashold) {
          //     break;
          //   }
          // }
          // console.log('self.goods=' + JSON.stringify(self.goods));
          // console.log('goods.getcloudbasedata.load.success=' + (new Date()).getTime());
          self.$nextTick(() => { //  当浏览器渲染完毕 在执行后续菜品追加;
            self.setGoods(initialDishCount + 1, 99999);
            self.setPackage();
            // self._initScroll(); // 初始化scroll
            // self._calculateHeight(); // 初始化列表高度列表
            // console.log('goods.scroll.load.success=' + (new Date()).getTime());
          });
          // console.log('goods.end=' + (new Date()).getTime());
          self.loadingModal = false;
        }).catch(function (error) {
          console.log(error);
          self.handleTokenError();
        });
      });

      if (this.$root.urlParam.token) {
        console.log('this.$root.urlParam.token && this.urlParam.token != localToken');
        window.localStorage.setItem('token', this.$root.urlParam.token);
      }
      console.log('token=' + this.$root.urlParam.token);

      var localToken = window.localStorage.getItem('token');
      if (localToken) {
        this.$root.urlParam.token = localToken;
      }
      if (this.$root.urlParam.token || this.$root.urlParam.shop_id) { // 如果存在token
        if (this.$root.urlParam.code || this.$root.platformId) {  // 如果存在platformId 或者授权回调完毕存在code
          console.log('this1.$root.urlParam.token');
          this.$root.eventHub.$emit('tokenRetrived');
        } else {    // 普通浏览器打开
          this.$root.eventHub.$emit('tokenRetrived');
        }
      } else {
        this.showLogin();
      }
      this.$refs.menuScroller.finishInfinite(true);
      // console.log('package.mounted.end=' + (new Date()).getTime());
    },
    methods: {
      refresh: function (done) { // vue-scroll 自动加载、滑动事件 暂时未启用
          // console.log('refresh:=' + this.$refs.scroller.getPosition().top);
          // var self = this;
          // setTimeout(function () {
          //   var start = self.top - 1;
          //   for (var i = start; i > start - 10; i--) {
          //     self.goods.splice(0, 0, i + ' - keep walking, be 2 with you.');
          //   }
          //   self.top = self.top - 10;
          done(); // 滑动无数据自动返回原位置;
          // }, 1500);
      },
      infinite: function (done) { // vue-scroll 自动加载、滑动事件 暂时未启用
          // console.log('goods.infinite:=');
          // console.log('infinite:=' + this.$refs.scroller.getPosition().top);
          // var self = this;
          // setTimeout(function () {
          //   var start = self.bottom + 1;
          //   for (var i = start; i < start + 10; i++) {
          //     self.goods.push(i + ' - keep walking, be 2 with you.');
          //   }
          //   self.bottom = self.bottom + 10;
          //   done();
          // }, 1500);
      },
      setGoods(beginIndex, endIndex) {    // by xiaozc. 选取从beginIndex(含)到endIndex(含)的菜品数据
         // console.log('package.setGoods.enter=' + (new Date()).getTime());
          var menuList = this.$root.baseData.userDish;
          for (var i = this.currentCategoryIndex; i < menuList.length; i++) {
            var menuCategory = {};
            var menuCategoryItemList = [];

            menuCategory.id = menuList[i].id;
            menuCategory.name = menuList[i].name;
            menuCategory.type = -1;

            for (var j = this.currentItemIndex; j < menuList[i].items.length; j++) {
              this.currentIndex++;
              if (this.currentIndex >= endIndex + 1) { // 第一次进入页面加载指定菜品然后跳出循环, 同时记录打断位置
                this.currentCategoryIndex = i;
                this.currentItemIndex = j;
                console.log('break.currentCategoryIndex=' + this.currentCategoryIndex + ', currentItemIndex=' + this.currentItemIndex);
                break;
              }

              var item = {};
              item.id = menuList[i].items[j].id;
              item.code = menuList[i].items[j].code;
              item.name = menuList[i].items[j].name;
              item.price = menuList[i].items[j].price;
              item.unit = menuList[i].items[j].unit;
              item.pic = menuList[i].items[j].pic;
              if (menuList[i].items[j].memo) {     // 菜品备注 by wangl
                item.memo = menuList[i].items[j].memo;
              };

              if (menuList[i].items[j].package) {     // 判断是否套餐
                item.package = menuList[i].items[j].package;   // json
                this.packageList.push(item);
                continue;
              };

              item.oldPrice = '';
              item.description = '';
              item.sellCount = '';
              item.rating = '';
              item.info = '';
              item.ratings = [];
              item.icon = '';
              item.image = '';
              menuCategoryItemList.push(item);
              // console.log('menuCategoryItemList=' + JSON.stringify(menuCategoryItemList));
            }
            if (menuCategoryItemList.length > 0) {
              var needMerge = false;
              if ((beginIndex > 0) && (i === this.currentCategoryIndex) && (this.currentItemIndex < menuList[i].items.length - 1)) {
                needMerge = true;
                // console.log('needMerge.beginIndex=' + beginIndex + ', currentCategoryIndex=' + i + ', currentItemIndex=' + this.currentItemIndex);
              }
              menuCategory.foods = menuCategoryItemList;
              if (needMerge) { //  如果是第二次进入加载 那么当前循环进行合并（同时游标重置）  后面循环进行push;
                // console.log('needMerge = true.enter');
                for (var k = 0; k < menuCategoryItemList.length; k++) {
                  this.goods[this.currentCategoryIndex].foods.push(menuCategoryItemList[k]);
                }
                this.currentItemIndex = 0;
              } else {
                this.goods.push(menuCategory);
                // console.log('this.goods.push(menuCategory)');
              }
            }
            if (this.currentIndex >= endIndex + 1) { // 第一次进入页面加载指定菜品然后跳出循环
              break;
            }
          }
          // console.log('this.goods=' + JSON.stringify(this.goods));
      },
      setPackage() {
        // console.log('package.setPackage.enter=' + (new Date()).getTime());
        if (this.packageList.length > 0 && this.goods.length > 0) {
        for (var l = 0; l < this.goods.length; l++) {
          var dishMenuCategory = this.goods[l];
          var dishMenuCategoryItemList = dishMenuCategory.foods;
          for (var m = 0; m < dishMenuCategoryItemList.length; m++) {
            var dishItem = dishMenuCategoryItemList[m];
            var found = false;
            for (var n = 0; n < this.packageList.length; n++) {
              var packageItem = this.packageList[n];
              for (var o = 0; o < packageItem.package.length; o++) {
                if (dishItem.id === packageItem.package[o].id) {
                  dishItem.packagename = packageItem.name;   // 'black' 'blue' 'red'
                  dishItem.packagePrice = packageItem.price;   // 套餐价格 by wangl

                  found = true;
                  break;
                }
              }
              if (found) {
                break;
              }
            }
          }
        }
        // console.log('goodsnew111=' + JSON.stringify(this.goods));
      }
      // console.log('package.setPackage.end=' + (new Date()).getTime());
    },
      selectMenu(index, event) {
        // console.log('click');
        this.listIndex = index;
        let length = 0;
        for (var i = 0; i < index; i++) { // 循环索引查找菜品模块计算高度  by wangl
          length = length + this.$refs.foodList[i].clientHeight;
        }
        this.dishLength = length;
        // 如果所在位置不是第一个菜品 已有高度 by wangl
        this.dishLength = this.dishLength - this.$refs.scroller.getPosition().top;
        this.$refs.scroller.scrollBy(0, this.dishLength, true);
        // if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl 原来的selectMenu
        //   return;
        // }
        // let foodList = this.$refs.foodList;
        // let el = foodList[index];
        // this.foodsScroll.scrollToElement(el, 100); // 300.  TODO:左侧导航滑动时间 by wangl
      },
      selectFood(food, event) {
        // if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl
        //   return;
        // }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      addFood(target) {
        // console.log('enter click');
        this._drop(target);
      },
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      _initScroll() { // TDDO: 弃用better-scroll插件(better-scroll功能暂时屏蔽 最后会移除) by wangl;
        // this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        //   click: true
        // });

        // this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        //   click: true,
        //   probeType: 3
        // });

        // this.foodsScroll.on('scroll', (pos) => {
        //   this.scrollY = Math.abs(Math.round(pos.y));
        // });
      },
      _calculateHeight() { // TDDO: 弃用better-scroll插件(better-scroll功能暂时屏蔽 最后会移除) by wangl;
        // let foodList = this.$refs.foodList;
        // let height = 0;
        // this.listHeight.push(height);
        // for (let i = 0; i < foodList.length; i++) {
        //   let item = foodList[i];
        //   height += item.clientHeight;
        //   this.listHeight.push(height);
        // }
      },
      showLogin() {
        this.$nextTick(() => {
          console.log('goods.vue.login');
          this.$modal.show('login');
          this.loadingModal = false;
        });
      },
      handleTokenError() {
        this.showLogin();
        console.log('handleTokenError.begin');
        window.localStorage.clear();
//        this.$refs.login.clearToken();
//        this.$refs.loginModal.clearToken();
        this.$refs.loginModal.clearToken();
        console.log('handleTokenError');
      },
      getMemoList(food) {
        console.log('getMemoList.food.emit=' + JSON.stringify(food));
        // this.$root.eventHub.$emit('showmemo', food);
//        this.$refs.memoModal.$modal.show('memo');
        this.food = food;
        this.memoList = [];

        for (var k = 0; k < food.memo.length; k++) {
          console.log('enter');
          this.memoList.push(food.memo[k]);
          console.log('end');
        }

        if (!this.food.selectedmemo) {
          this.selectedmemo = [];
          for (var i = 0; i < food.memo.length; i++) {
            for (var j = 0; j < food.memo[i].name.length; j++) {
              this.selectedmemo[i] = [];
              this.selectedmemo[i][j] = false;
              console.log('this.selectedmemo[' + i + '][' + j + '].value=' + this.selectedmemo[i][j]);
            }
          }
          this.food.selectedmemo = this.selectedmemo;
        } else {
          this.selectedmemo = this.food.selectedmemo;
        }

        console.log('this.memoList=' + JSON.stringify(this.memoList));

        this.memoModal = true;
      },
      memoClicked(food, memoListIndex, oneMemoIndex) {
        var self = this;
        this.$nextTick(() => {
          console.log('memoListIndex=' + memoListIndex + ', oneMemoIndex=' + oneMemoIndex);
          for (var i = 0; i < self.selectedmemo[memoListIndex].length; i++) {
            self.selectedmemo[memoListIndex][i] = false;
          }
          self.selectedmemo[memoListIndex][oneMemoIndex] = true;
          self.selectedmemo.splice(memoListIndex, 1, self.selectedmemo[memoListIndex]);   // by xiaozc. 触发vuejs的对于数组的双向绑定机制
          console.log('memoListIndex=' + memoListIndex + ', oneMemoIndex=' + oneMemoIndex + ', result=' + self.selectedmemo[memoListIndex][oneMemoIndex]);

          console.log('food.selectedmemo=' + JSON.stringify(self.selectedmemo));
        });
      },
      closeMemo() {
        this.memoModal = false;
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food,
      LoginModal
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/weui.min.css";
  @import "../../common/stylus/mixin.styl"
.btn-group {
  display: -webkit-box !important;
}
.pull-to-refresh-layer { // 引入vue-scroller by wangl
  display:none;
}
._v-container[data-v-ecaca2b0] { // 引入vue-scroller by wangl
  left: 80px !important;
  width: 80% !important;
}
.memoselected {
  border:1px solid #09BB07 !important;
  background-color: #fff;
  color: #09bb07 !important;
}
.nameblack {
  color:black !important;
}
.namered {
  color:red !important;
}
.nameblue {
  color:blue !important;
}
.btn-default{
  margin:10px;
}
.koubei{top: 28px !important}
// goods1  为有图模式layout
  .goods1
    display: flex
    position: absolute
    top: 68px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 77px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 5px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .memo             // by  wangl
            position:relative
            //height: 14px
            line-height: 14px
            font-size: 14px
            color: red
            float: right
            top: -35px  // -24px
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
  //--------------有图模式layoutcss结束
  //
  // goods0 为无图模式layout
  .goods0
    display: flex
    position: absolute
    top: 68px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 77px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 5px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .memo               // by  wangl
            position:relative
            //height: 14px
            line-height: 14px
            font-size: 14px
            color: red
            float:right
            top:-24px
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>