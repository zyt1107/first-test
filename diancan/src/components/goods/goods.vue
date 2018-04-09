<template>
  <div>
    <!-- 加入同桌点菜提示 start-->
   <div v-if="webSocketSeq === 1 && $root.sharedOrder">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
          <div class="weui-dialog__bd">
            <span>本桌现有{{webSocketPeople - 1}}人</span>
            <p style="background:none;">是否加入同桌点餐？</p>
          </div>
          <div class="weui-dialog__ft">
              <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click = "cancelSharedOrder">否</a>
              <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click = "$root.sharedOrder = false">是</a>
          </div>
      </div>
    </div>
    <!-- 加入同桌点菜提示 end-->
  <!-- 自提情况下输入用户个人信息 start -->
    <div v-if="tagModel">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title">预定点餐信息</strong></div>
        <div class="weui-dialog__bd">
          <!-- <div class="weui-cells weui-cells_form"> -->
            <div class="weui-cell">
              <div class="weui-cell__hd title"><label class="weui-label">姓名</label></div>
              <div class="weui-cell__bd">
                  <input class="weui-input" type="text" placeholder="请输入姓名" v-model="ownPeopleMessage.name"/>
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd title">
                <label class="weui-label">手机号</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="tel" placeholder="请输入手机号" v-model="ownPeopleMessage.tel"/>
              </div>
            </div>
            <div class="weui-cell">
              <group>
                <datetime v-model="ownPeopleMessage.servicetime" format="YYYY-MM-DD HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']" :minute-list="['00', '15', '30', '45']" @on-change="change" :title="$t('lang.predeterminedTime')" class="dataTime"></datetime>  <!-- 预定时间 -->
              </group>
            </div>
            <div class="weui-cell weui-cell_switch">
              <div class="weui-cell__hd" style="width: 60px"><label for="" class="weui-label">是否打包</label></div>
              <div class="weui-cell__ft">
                  <input class="weui-switch tag-switch" type="checkbox" v-model="ownPeopleMessage.type"/>
              </div>
            </div>
          <!-- </div> -->
        </div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" @click="confirmTag" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
        </div>
      </div>
    </div>
    <!-- 自提情况下输入用户个人信息 start -->
    <!-- 用户输入信息不完全 start-->
      <div id="loadingToast" style="display: block;" v-show="nameShow" @click="nameShow = false">
        <div class="weui-mask_transparent"></div>  <!-- 提醒填姓名弹框 -->
        <div class="weui-toast" style="margin-top:20px;">
          <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;margin-top:20px;"></i>
          <p class="weui-toast__content" style="margin-top:20px;">请输入姓名</p>
        </div>
      </div>
      <div id="loadingToast" style="display: block;" v-show="telShow" @click="telShow = false">
        <div class="weui-mask_transparent"></div>  <!-- 提醒填手机号弹框 -->
        <div class="weui-toast" style="margin-top:20px;">
          <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;margin-top:20px;"></i>
          <p class="weui-toast__content" style="margin-top:20px;">请输入手机号</p>
        </div>
      </div>
    <!-- 用户输入信息不完全 end-->
    <!-- 同桌点菜信息提示 start -->
    <transition name="prompting">
      <div class="prompting" v-if="promptingMessage.messageShow">
        <div style="flex:1;">
          <img :src="promptingMessage.message.food.pic" style="width:35px;"><!-- 现在使用的是菜品图片，将来可能使用用户头像 -->
          <span>{{promptingMessage.message.info.nickName}}</span>
        </div>
        <div style="flex:2;font-size:13px;">
          <div>{{promptingMessage.message.food.name}}</div>
          <div>{{promptingMessage.message.food.englishname}}</div>
          <div v-show="promptingMessage.message.food.memostr">{{promptingMessage.message.food.memostr}}</div>
        </div>
        <div style="flex:0.5;">
          <!-- 1：加菜 ，0：修改备注，-1：减菜，2：筷子数量，3：清空，4：整单备注，5：人数 -->
          <span v-show="promptingMessage.message.type === '1'" style="float:right;">+{{promptingMessage.message.food.step}}</span>
          <span v-show="promptingMessage.message.type === '0'" style="float:right;font-size:12px;">修改备注</span>
          <span v-show="promptingMessage.message.type === '-1'" style="float:right;">-{{promptingMessage.message.food.step}}</span>
          <!-- <span v-show="promptingMessage.message.type === '2'" style="float:right;">{{promptingMessage.message.food.count}}</span> -->
          <span v-show="promptingMessage.message.type === '3'" style="float:right;font-size:12px;">清空</span>
          <span v-show="promptingMessage.message.type === '4'" style="float:right;font-size:12px;">整单备注</span>
          <span v-show="promptingMessage.message.type === '5'" style="float:right;font-size:12px;">{{promptingMessage.peopleNum}}{{ $t('lang.people') }}</span>
        </div>
      </div>
    </transition>
    <!-- 同桌点菜信息提示 end -->
<!-- 搜索框 start -->
  <div class="weui-cells weui-cells_form searchInput"  v-if="searchShow" style="">
      <div class="weui-cell " style="height:40px;">
          <div class="weui-cell__bd">
              <input class="weui-input" v-model="searchString" style="border-radius:5px"  value="请输入搜错内容" placeholder="请输入菜品名称"/>
          </div>
          <div class="weui-cell__ft">
              <i class="weui-icon-cancel" @click="searchToHidden"></i>
          </div>
      </div>
  </div>
  <i class="weui-icon-search searchIcon" @click="searchToShow" v-if="!searchShow" v-show="searchIcon" style=""></i>
  <!-- v-show=false v-if=false 隐藏搜索图标，如需要显示 v-show=searchIcon    v-if=!searchShow -->
<!-- 搜索框 end -->
        
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
    <div class="weui-mask" @click="closeMemo(-1)"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__hd" @click="selectedMemoModal = false"><strong class="weui-dialog__title">{{ $t('lang.memoTaste') }}</strong></div>
      <div class="weui-dialog__bd scrollMore" @click="selectedMemoModal = false">

        <!-- 当组里有多个备注的情况 -->
        <div role="group" v-for="(memo, memoListIndex) in memoList" style="text-align:left;" v-if="memo.name.length > 1">
          <!-- 必选备注   start-->
          <div v-if="memo.required === '1'">
            <div :class="{ memoRequired: memoActive }">
              <button type="button" class="btn btn-default marginreset" v-bind:class="{ memoselected: selectedmemo[memoListIndex][oneMemoIndex] }" @click="memoClicked(food, memoListIndex, oneMemoIndex)" v-for="(oneMemo, oneMemoIndex) in memo.name" style="outline:none;">
                <font>{{oneMemo}}</font>
              </button>
              <div class="memoText">({{ $t('lang.noteRequired') }})</div>
            </div>
            <hr class="goodsHr">
          </div>
          <!-- 必选备注   end-->

          <div v-if="memo.required !== '1'">
            <button type="button" class="btn btn-default marginreset" v-bind:class="{ memoselected: selectedmemo[memoListIndex][oneMemoIndex] }" @click="memoClicked(food, memoListIndex, oneMemoIndex)" v-for="(oneMemo, oneMemoIndex) in memo.name" style="outline:none;">
              <font>{{oneMemo}}</font>
            </button>
            <hr class="goodsHr">
          </div>
        </div>

        <!-- 当组里只有一个备注的情况 -->
        <div role="group"  style="text-align:left;" >
            <button type="button" v-for="(memo, memoListIndex) in memoList" v-if="memo.name.length === 1" class="btn btn-default square marginreset " v-bind:class="{ memoselected: selectedmemo[memoListIndex][0] }" @click="memoClicked(food, memoListIndex, 0)"  style="outline:none;">
              <font>{{memo.name[0]}}</font>
            </button>
            <hr class="goodsHr" v-if='showMemoHr()'>
        </div>

        <div class="memo"> <!-- 单品附加备注区域 -->
          <textarea class="weui-textarea" placeholder="请输入备注内容（可不填）" rows="2" style="font-size:12px;" v-model="attachMemo"></textarea>
        </div>

      </div>
      <div class="weui-dialog__ft">
          <a href="javascript:;" @click="closeMemo" class="weui-dialog__btn weui-dialog__btn_primary">{{ $t('lang.confirm') }}</a>
      </div>
    </div>
  </div>
<!-- 菜品备注弹框 end -->
<!-- 菜品备注不符合要求提示 start-->
  <div v-show="selectedMemoModal" @click="selectedMemoModal = false">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast" style="margin-top:20px;">
      <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;margin-top:20px;"></i>
      <p class="weui-toast__content" style="margin-top:20px;">{{selectedMemoModalText}}</p>
    </div>
  </div>
<!-- 菜品备注不符合要求提示 end-->
<!--菜单和菜品  -->
    <div class="goods1" v-bind:class="{ koubei: goodsTabShow}" v-if="layout == 0">
      <div class="menu-wrapper" ref="menuWrapper">
      <scroller :on-refresh="refresh" :on-infinite="infinite" ref="menuScroller" style='left:0 !important;'>
        <ul>
          <li v-for="(item,index) in this.$root.baseData.userDish" class="menu-item" :class="{'current':listIndex===index}" @click="selectMenu(index,$event)">
           <div class="weui-cell__hd text border-1px" style="position: relative;padding:5px 0px;">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
              <p style="font-size: 13px;color: #333;"> {{item.name}}</p>
              <p style="font-size: 8px; color: #9E9F9F; line-height:12px;margin-top:2px">{{item.englishname}}</p>
              <span class="weui-badge" style="position: absolute;z-index:999;top: .4em;right: -1em;" v-if="menuCounts[index] !== undefined && menuCounts[index].count>0">
               {{menuCounts[index].count}}
              </span>
          </div>
          </li>
        </ul>
        </scroller>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
          <ul>
            <li v-for="(item,goodIndex) in goods" class="food-list" ref="foodList">
              <h1 class="title" v-if="menuShowControl(goodIndex)&&munuShowList[goodIndex]">
                <span>{{item.name}}</span>
                <span v-if="item.englishname">/ {{item.englishname}}</span>
              </h1>
              <ul class="">
                <li v-for="food in searchFor(item.foods,searchString)" class="food-item border-1px">
                  <div class="icon" v-if="imgtype == 0">
                   <img width="57" height="57" :src="food.pic" @click="selectFood(food,$event)">
                  </div>
                  <div class="content">
                    <h2 class="name" style = 'display: inline-block' v-if="food.stock !== 0"> {{food.name}}<br><span style="font-size:10px;">{{food.englishname}}</span></h2>
                    <h2 class="name" style = 'display: inline-block;color:#9E9F9F' v-if="food.stock === 0"> {{food.name}}<br><span style="font-size:10px;">{{food.englishname}}</span></h2>
                    <h2 class="memo" @click="getMemoList(food)" v-show="(food.memo && selectedFoodMemoShow[food.id]) ? true: false">
                      <button type="button" class="btn btn-default btn-xs" style="color: #f01414;margin-top:-2px;margin-right:-0px;outline:none;">备注</button>
                    </h2>
                    <p class="desc">{{food.description}}</p>
                    <!-- <div class="extra"> -->
                      <!-- <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span> -->
                    <!-- </div> -->
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span v-if="food.rawprice>=0" :class="{deletingLine : changeHadFoodRawPrice(food.rawprice)}">￥{{food.rawprice}}</span>
                      <!-- <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span> -->
                    </div>
                    <div class="cartcontrol-wrapper" v-if="!currentChopstickesStatus(food.id) && food.stock !== 0">
                      <cartcontrol @add="addFood" @openMemo="openMemo" :goods="goods" :food="food"></cartcontrol>
                    </div>
                    <div class="cartcontrol-wrapper" style="color:#9E9F9F" v-if="currentChopstickesStatus(food.id) || food.stock === 0">
                      【{{ $t('lang.soldOut') }}】
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </scroller>
      </div>
<!-- 购物车模块start -->
    <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice">
    </shopcart>
    </div>
<!-- 购物车模块end -->    
<!-- layout = 2 start -->
    <div class="goods2" v-bind:class="{ koubei: goodsTabShow}" v-if="layout == 2">
      <div class="wrapper" ref="wrapper">
        <ul class="content" ref="content">
          <li ref="goods2rowScroller" v-for="(item,index) in this.$root.baseData.userDish" class="menu-item" :class="{'current':listIndex===index}" @click="selectMenu(index,$event)">
           <div class="weui-cell__hd text border-1px" style="position: relative;padding:5px 0px;height:54px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
              <span>
                <img src="./logo1.png" style="width:25px; margin-bottom:2px">
              </span>
              <p style="font-size: 12px;color: #333;"> {{item.name}}</p>
              <!-- <p style="font-size: 8px; color: #9E9F9F; line-height:12px;margin-top:2px">{{item.englishname}}</p> -->
              <span class="weui-badge" style="position: absolute;z-index:999;top: .4em;right: -1em;" v-if="menuCounts[index] !== undefined && menuCounts[index].count>0">
               {{menuCounts[index].count}}
              </span>
          </div>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="scroller">
          <ul>
            <li v-for="(item,goodIndex) in goods" class="food-list" ref="foodList">
              <h1 class="title" v-if="menuShowControl(goodIndex)&&munuShowList[goodIndex]">
                <span>{{item.name}}</span>
                <span v-if="item.englishname">/ {{item.englishname}}</span>
              </h1>
              <ul>
                <li v-for="food in searchFor(item.foods,searchString)" class="food-item border-1px">
                  <div class="icon" v-if="imgtype == 0">
                   <img width="100" height="70" :src="food.pic" @click="selectFood(food,$event)" style="border-radius:10px">
                  </div>
                  <div class="content">
                    <h2 class="name" style = 'display: inline-block;' v-if="food.stock !== 0"> {{food.name}}<br><span style="font-size:10px;">{{food.englishname}}</span></h2>
                    <h2 class="name" style = 'display: inline-block;color:#9E9F9F' v-if="food.stock === 0"> {{food.name}}<br><span style="font-size:10px;">{{food.englishname}}</span></h2>
                    <h2 class="memo" @click="getMemoList(food)" v-show="(food.memo && selectedFoodMemoShow[food.id]) ? true: false">
                      <button type="button" class="btn btn-default btn-xs" style="color: #f01414;margin-top:-2px;margin-right:-0px;outline:none;">备注</button>
                    </h2>
                    <p class="desc">{{food.description}}</p>
                    <!-- <div class="extra"> -->
                      <!-- <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span> -->
                    <!-- </div> -->
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span v-if="food.rawprice>=0" :class="{deletingLine : changeHadFoodRawPrice(food.rawprice)}">￥{{food.rawprice}}</span>
                      <!-- <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span> -->
                    </div>
                    <div class="cartcontrol-wrapper" v-if="!currentChopstickesStatus(food.id) && food.stock !== 0">
                      <cartcontrol @add="addFood" @openMemo="openMemo" :goods="goods" :food="food"></cartcontrol>
                    </div>
                    <div class="cartcontrol-wrapper" style="color:#9E9F9F" v-if="currentChopstickesStatus(food.id) || food.stock === 0">
                      【{{ $t('lang.soldOut') }}】
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li class="foods-warpper-list"></li>
          </ul>
        </scroller>
      </div>
<!-- 购物车模块start -->
    <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice">
    </shopcart>
    </div>
<!-- 购物车模块end --> 
<!-- layout = 2 end -->


    <div class="goods0" v-bind:class="{ koubei: goodsTabShow}" v-if="layout == 1">

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
            <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
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
  import { Group, Cell, Datetime } from 'vux'; // by limengxu
  import BScroll from 'better-scroll';  // by limengxu
  Vue.use(VueScroller);
//  const ERR_OK = 0;   // by xiaozc

  var initialDishCount = 5; // 第一次加载的菜品数量;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        currentIndex: 0,
        currentCategoryIndex: 0,
        currentItemIndex: 0,
        // listHeight: [],
        listIndex: 0,
        scrollY: 0,
        selectedFood: {},
        selectedFoodMemoShow: {},   // by xiaozc
        layout: null,  // 0: 左侧侧边栏显示  2： 上侧横向显示
        // layout: 2,
        memoList: [],
        menuList: [], // by shaomeng 存放selectmenu数目
        food: {},
        selectedmemo: null,
        memoModal: false,
        goodsTabShow: false,
        loadingModal: true,
        dishLength: 0,
        scrollTopArray: [], // by shaomeng 存放菜品模块高度
        scrollListener: true, // by shaomeng 滚动监听
        searchString: '', // by shaomeng 搜索model
        munuShowList: [],
        searchShow: false, // by xiaofei 搜索框
        searchIcon: true, // 搜索icon
        selectedMemoCount: 0, // by shaomeng 选择菜品备注数量
        selectedMemoModal: false, // by shaomeng 菜品备注选择提示 例如：（该菜品为双拼，该菜品必须有备注）
        selectedMemoModalText: '', // by shaomeng 菜品备注提示文字
        tempMemo: [], // 临时变量，存储备注
        attachMemo: '', // 单品附加备注
        memoActive: false, // 备注是否选中,备注必选红框提示(memorequired = 2)
        promptingMessage: {
          messageShow: false,
          message: {},
          peopleNum: ''
        }, // 同桌点菜信息提示
        webSocketPeople: 0, // websocket云端在线人数
        webSocketSeq: 0, // websocket云端标志位，判断是否有人在线
        tagModel: false,
        ownPeopleMessage: {
          name: '',
          type: false,
          servicetime: (new Date()).toLocaleDateString().replace(/\//g, '-') + ' 09:00',
          tel: ''
        },
        // ownPeopleMessageConfirm: {},      // 暂时存放在goods，如有需要将移到他处
        nameShow: false,            // 判断存在tag时，goods弹窗中name未填写警告，下同
        telShow: false,
        imgtype: 0,    // 1 无图模式，  0 有图模式
        rowMenuLength: 0,
        betterScroll: null
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
      menuCounts() {  // 推荐菜数量 by xiaofei
        var list = [];
        this.goods.forEach((good) => {
          var obj = {};
          obj.id = 'id' + good.id;
          obj.count = 0;
          list.push(obj);
        });
        list.forEach((item) => {
          this.goods.forEach((good) => {
          if (item.id === 'id' + good.id) {
            good.foods.forEach((food) => {
                if (food.count) {
                  item.count += food.count;
              }
            });
          }
          });
        });
        return list;
      },
      selectFoods() {
//        console.log('selectFoods');
        var self = this;
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (good.id >= 0) {   // by xiaozc. id为整数
              if (food.count) {
                if (!food.memorequired || food.memorequired === 0) {
                  console.log('selectFoods.memorequired0.food.id=' + food.id);
                  foods.push(food);
//                  this.selectedFoodMemoShow[food.id] = true;
                  Vue.set(this.selectedFoodMemoShow, food.id, true);
//                  console.log('selectFoods.selectedFoodMemoShow.id=' + food.id + ', result=' + this.selectedFoodMemoShow[food.id]);
                } else {    // food.memorequired === 1, 2, 3
                  console.log('selectFoods.memorequired123.food.id=' + food.id + ', food.count=' + food.count + ', food.step=' + food.step);
                  if (!self.$root.cloneFoodList) {
                    self.$root.cloneFoodList = [];
                  }
                  for (var j = 0; j < self.$root.cloneFoodList.length; j++) {
                    var tmpCloneFood = self.$root.cloneFoodList[j];
                    if (tmpCloneFood.id === food.id && tmpCloneFood.decrease === true) {    // 来自购物车里的减操作
                      food.memostrlist.push(food.memostr); // 解决点完菜然后从购物车里删除再次选菜没有备注（必需备注菜品）
                      console.log('tmpCloneFood.food.id=' + tmpCloneFood.id + ', tmpCloneFood.index=' + tmpCloneFood.index + ', tmpCloneFood.count=' + tmpCloneFood.count + ', tmpCloneFood.memostr=' + tmpCloneFood.memostr + ', tmpCloneFood.decrease=' + tmpCloneFood.decrease);
                      if (!tmpCloneFood.count) {
                        console.log('tmpCloneFood.index=' + tmpCloneFood.index + '###');
                        food.memostrlist.splice(tmpCloneFood.index, 1);
                      }
                      tmpCloneFood.decrease = null;
                    }
                  }
                  for (j = 0; j < self.$root.cloneFoodList.length; j++) {   // 清理掉，对应后面逻辑的再加上
                    if (self.$root.cloneFoodList[j].id === food.id) {
                      self.$root.cloneFoodList.splice(j, 1);   // by xiaozc. 触发vuejs的对于数组的双向绑定机制.  TODO: splice数组删除导致数组长度变化可能引发bug
                    }
                  }
                  if (food.memostrlist) {
                    food.memostrlist.length = food.count / food.step;   // by xiaozc. 减数量后保持同步
                  }
                  // 解决搜索框引起的数量问题 start
                  // console.log('selectFoods.memostrlist0=' + JSON.stringify(food.memostrlist));
                  var memostrlistSize = food.memostrlist.length;
                  for (var k = memostrlistSize - 1; k >= 0; k--) {
                    if (food.memostrlist[k] === undefined) { // 去除memostrlist里的null，留下有效备注，splice数组删除的时候for循环倒着执行解决数组长度变化引起的潜在bug
                      // console.log('cloneFood.memostrlist.null=' + food.memostrlist[k]);
                      food.memostrlist.splice(k, 1);
                    }
                    // console.log('cloneFood.memostrlist=' + food.memostrlist[k]);
                  }
                  console.log('selectFoods.memostrlist=' + JSON.stringify(food.memostrlist));
                  food.count = food.memostrlist.length; // food.count = memostrlist 实际备注长度
                  // 解决搜索框引起的数量问题 end
                  for (var i = 0; i < food.memostrlist.length; i++) {
                    console.log('selectFoods.CYCLE=' + i);
                    var cloneFood = JSON.parse(JSON.stringify(food));    // by xiaozc. 深度拷贝原json对象
                    cloneFood.count = food.step;
                    cloneFood.rawfood = food;
                    cloneFood.index = i;    // by xiaozc. 顺序序号标记
                    self.$root.cloneFoodList.push(cloneFood);

                    if (food.memostrlist) {
                      cloneFood.memostr = food.memostrlist[i];
                      if (!cloneFood.memostr) {
                        cloneFood.memostr = '';
                      }
                    }
                    console.log('cloneFood.memostr.' + i + '=' + cloneFood.memostr + ', cloneFood.count=' + cloneFood.count);
                    foods.push(cloneFood);
                  }
                }
              } else {
//                this.selectedFoodMemoShow[food.id] = false;
                Vue.set(this.selectedFoodMemoShow, food.id, false);
                food.memostrlist = [];
              }
            }
          });
        });
        console.log('临时备注' + JSON.stringify(this.tempMemo));
        return foods;
      }
//       selectFoodsBeforeFilter() {
//         let foods = [];
//         this.goods.forEach((good) => {
//           good.foods.forEach((food) => {
//             if (food.count) {
//               foods.push(food);
//               Vue.set(this.selectedFoodMemoShow, food.id, true);
//             } else {
//               Vue.set(this.selectedFoodMemoShow, food.id, false);
//             }
//           });
//         });
//         return foods;
//       }
    },
    watch: {
      loadingModal() { // 数据加载完毕，添加滑动事件监听
        this.listenScroller();
        if (this.layout === 2) {
          this.menuRowScroller();
        }
      }
    },
    created() {
      this.$root.eventHub.$on('showSearchIcon', () => { // 显示搜索框图标
        this.searchIcon = true;
      });
      this.$root.eventHub.$on('decreaseTempMemo', (res) => { // 减菜的同时把本菜品备注从临时备注（tempMemo）中移除
        // console.log('food.id=' + res.id);
        for (var i = 0; i < this.tempMemo.length; i++) {
          if (res.id === this.tempMemo[i].id) {
            this.tempMemo.splice(i, 1);
          }
        }
      });
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
      this.$root.eventHub.$on('setLocalStorageGoods', () => {    // cartcontrol => goods 同步goods到localstorage
        var goodsKey = 'goods_' + sessionStorage.getItem('cid');
        localStorage.setItem(goodsKey, JSON.stringify(this.goods));
      });
      // this.$root.eventHub.$on('changeTagModel', () => {
      //   console.log('修改tagModel');
      //   this.tagModel = true;
      // });
      if (sessionStorage.getItem('tagModel')) {
        this.tagModel = sessionStorage.getItem('tagModel');
        this.$root.eventHub.$emit('tagModel');  // goods -> shopCart  将修改为预定状态
        console.log('this.tagModel' + this.tagModel);
      }
      this.$root.eventHub.$on('exchangePrice', () => { // 切换支付方式，价格交换（会员价与非会员价）
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.rawprice) {
              var price = food.price;
              food.price = food.rawprice;
              food.rawprice = price;
            }
          });
        });
      });
      this.$root.eventHub.$on('lastHandleFood', (data) => {     // 接收cartcontrol.vue数据  by limengxu
        // console.log(JSON.stringify(data));
        var syncData = {};
        if (data.food) {
          syncData.lastHandleFood = data;
          syncData.lastHandleFood.info = this.$root.userInfo;
        }
        syncData.goods = this.goods;
        syncData.peopleNum = this.$root.peopleNum;
        // console.log('goods - lastHandleFood:' + JSON.stringify(syncData.lastHandleFood.food));
        syncData.tablenum = this.$root.urlParam.tablenum;
        syncData.people = this.webSocketPeople;
        // console.log('syncorderdata:' + JSON.stringify(syncData));
        // console.log('------------lastHandleFood-----------');
        this.$root.eventHub.$emit('syncorder', syncData);   // 向app.vue传输，内容已经组装完成 目的：同步同桌点菜
      });
      this.$root.eventHub.$on('syncSelectFoods', (res) => {     // 接收app.vue从云端同步的数据，在桌号相同情况下同步本地数据  by limengxu
        // console.log('syncSelectFoods:' + JSON.stringify(res));
        if (JSON.stringify(res) === '{}') {
          console.log('云端数据为空');
          return;
        }
        // console.log('websocket.people=' + res.people);
        this.webSocketPeople = res.people;
        this.webSocketSeq = res.seq;
        this.promptingMessage.peopleNum = res.peopleNum;
        if (res.tablenum === this.$root.urlParam.tablenum) {
          if (res.goods) {
            this.goods = res.goods;
          }
          // console.log('currentfood:' + JSON.stringify(res.lastHandleFood.food));
          if (res.lastHandleFood) {   // 判断上次修改菜品是否为餐具
            // promptingMessage start
            if (res.lastHandleFood.info.id !== this.$root.userInfo.id) { // 判断用户userid，自己不接收发出去的消息
              this.promptingMessage.messageShow = true;
              this.promptingMessage.message = res.lastHandleFood;
              console.log(JSON.stringify(this.promptingMessage.message));
              setTimeout(() => {
                this.promptingMessage.messageShow = false;
              }, 2000);
            }
            // promptingMessage end
            // 如果在食品列表中增加餐具使人数修改start-------------------------
            this.$root.eventHub.$emit('syncOrderMemo', res.lastHandleFood.orderMemo);
            if (res.lastHandleFood.food.count > 0 && this.$root.baseData.hotel.chopstick && res.lastHandleFood.food.id === this.$root.baseData.hotel.chopstick.id) {
              // console.log('--------执行餐具修改人数-----------');
              this.$root.peopleNum = res.lastHandleFood.food.count;
              // console.log('goods-syncSelectFoods-food.count:' + res.lastHandleFood.food.count);
              // console.log('goods-syncSelectFoods-peopleNum:' + this.$root.peopleNum);
              this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': true});  // 如果在餐具上返回的人数：将修改后的数量返回给shopCart同步数量
              return;
            }
            // 如果在食品列表中增加餐具使人数修改end-------------------------
         }
         // 如果在人数选择框上修改人数start-------------------
          this.$root.peopleNum = res.peopleNum;
          if (this.$root.baseData.hotel.chopstick && res.lastHandleFood) {
            if (this.$root.baseData.hotel.chopstick.id === -1) {
              this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': false}); // 当状态值为-1时，将默认勾选置位false
            } else {
              this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': res.lastHandleFood.chopsticksJudge});
            }
          } else {
            this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': false});    // 如果在选择人数上修改人数：将修改后的数量返回给shopCart同步数量、
          }
          // 如果在人数选择框上修改人数end-------------------
        }
      });
      // if (this.$root.clientInfo === 'MicroMessenger') {
      //   if (!this.$root.urlParam.code) {
      //     return;
      //   }
      // }
      // console.log('goods.mounted');
      if (!this.$root.urlParam.code) {  //  ali and wechat code 是统一的
        if (this.$root.clientInfo === 'MicroMessenger') {
          // console.log('goods.mounted is MicroMessengers');
          if (!this.$root.urlParam.openid && !sessionStorage.getItem('platformId')) {
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
      if (!this.$root.showHeader) { // 订单详情页面返回展示header  by wangl
        this.$root.showHeader = true;
      }
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      var self = this;

      self.$root.eventHub.$on('openMemo', function(food) {
        if (food.memorequired === 0) { // 点击大图（food.vue） 备注
          console.log('getMemoList');
          self.getMemoList(food);
        }
        self.openMemo(food);
      });

      self.$root.eventHub.$on('layoutRetrived', function(msg) {
        self.layout = msg;
       // console.log('header.vue--this.layout=====' + self.layout);
        return;
      });

      // var localStorage = window.localStorage;  //暂时屏蔽
      self.$root.eventHub.$on('tokenRetrived', function() {
        // console.log('goods1.vue.tokenRetrived');

        var restUrl = '';
        console.log('goods.mounted.enter=' + (new Date()).getTime());

        if (self.$root.urlParam.shop_id) {
          // 如果是口碑下面按钮进入点餐会携带shop_id   没有token  by wangl
          restUrl = 'http://www.xiucan.com/api/v2/getcloudbasedatabykoubei/' + self.$root.urlParam.shop_id; // 'static/data.json';
        }
        if (self.$root.urlParam.token) {
          // console.log('goods.get.token=' + self.$root.urlParam.token);
          restUrl = 'http://www.xiucan.com/api/v2/getcloudbasedata/' + self.$root.urlParam.token; // 'static/data.json';
        }
        restUrl = 'static/data.json';
        axios.get(restUrl).then((res) => {
          // console.log('goods.res=' + JSON.stringify(res.data));
          document.title = res.data.hotel.name;
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
          self.layout = res.data.hotel.layout;
          self.imgtype = res.data.hotel.imgtype;
          sessionStorage.setItem('companyName', res.data.hotel.name);
// *******************************
// 判断是否开启同桌点菜功能 start
          if (res.data.hotel.syncOrder === 1) {
            for (var i = 0; i < res.data.tableInfo.length; i++) {
              if (res.data.tableInfo[i].code === localStorage.getItem('tablenum') && res.data.tableInfo[i].syncOrder === 1) {
                console.log('开启同桌点');
                self.$root.syncOrder = true;
                break;
              }
            }
          }
// 判断是否开启同桌点菜功能 end
// ********************************
// 如果绑定收银台，则跳转直接付款 start
          var isZJZF = false;
          for (var k = 0; k < res.data.tableInfo.length; k++) {
            if (res.data.tableInfo[k].code === localStorage.getItem('tablenum') && res.data.tableInfo[k].name === '收银台') {
              console.log('收银台');
              isZJZF = true;
              break;
            }
          }
          if (isZJZF) {
            location.href = '#/pay';
          }
// 如果绑定收银台，则跳转直接付款 end
          self.loadGoods(res);
        }).catch(function (error) {
          console.log(error);
          self.handleTokenError();
        });
      });

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
      if (this.layout === 0) { // layout === 0  ref = 'menuScroller'
        this.$refs.menuScroller.finishInfinite(true);
      }
    },
    methods: {
      getlocalstroglegoods() {
        var goodsKey = 'goods_' + sessionStorage.getItem('cid');
        if (localStorage.getItem(goodsKey)) {
              // alert('数据同步');
              this.goods = JSON.parse(localStorage.getItem(goodsKey));
          }
      },
      rowScroller() {
        // console.log(-75 * this.listIndex);
        // this.$refs.content.setAttribute('style', 'transform: translate(' + -75 * this.listIndex + 'px,0px)');
        // console.log('betterScroll位置：' + this.listIndex);
        // console.log(this.$refs.goods2rowScroller[this.listIndex]);
        var liIndex = this.$refs.goods2rowScroller[this.listIndex];
        // console.log(this.rowMenuLength);
        // console.log(-77 * this.listIndex);
        if (this.listIndex < 3) {
          this.betterScroll.scrollTo(0, 0, 1);
        } else if (this.listIndex >= 3 && this.listIndex < this.rowMenuLength - 3) {
          this.betterScroll.scrollTo(-77 * (this.listIndex - 2), 0, 1);
        } else if (this.listIndex >= this.rowMenuLength - 3) {
          // console.log('最后阶段：' + -77 * (this.rowMenuLength - 5));
          this.betterScroll.scrollTo(-77 * (this.rowMenuLength - 5), 0, 1);
        }
      },
      change (value) {
        console.log('change', value);
      },
      confirmTag() {
        if (this.ownPeopleMessage.name === '') {
          this.nameShow = true;
        } else if (this.ownPeopleMessage.tel === '') {
          this.telShow = true;
        } else {
          this.tagModel = false;
          sessionStorage.removeItem('tagModel');
          if (this.ownPeopleMessage.type) {
            this.$root.type = 50;   // 自提
            // this.ownPeopleMessage.type = 50;
          } else {
            this.$root.type = 40;   // 预定
            // this.ownPeopleMessage.type = 40;
          }
          this.$root.eventHub.$emit('ownPeopleMessage', this.ownPeopleMessage);  // goods -> shopCart.vue
          console.log('this.ownPeopleMessage:' + JSON.stringify(this.ownPeopleMessage));
        }
      },
      loadGoods(res) {
        var self = this;
          self.$root.eventHub.$emit('sendToWebsocket', self.$root.baseData.hotel.cloudWebSocket); // 拿到basedata数据后触发websocket的send() App.vue
          if (self.$root.baseData.hotel.paymode === 1) { // by wangl 后付模式
            self.$nextTick(() => {
              self.$root.paymentTag = false;
            });
          }
          // window.localStorage.setItem('repasterptag', self.$root.baseData.hotel.erptag);
          self.$root.payConfig = res.data.payconfig;
          self.$root.cid = res.data.hotel.id;
// 计算菜品数量决定初始化加载数量 start
          var count = 0;
          for (var i = 0; i < res.data.userDish.length; i++) {
            for (var j = 0; j < res.data.userDish[i].items.length; j++) {
              count++;
            }
          }
          if (count <= 5) { // 如果菜品数量小于等于5个，初始化加载count-1个
            initialDishCount = count - 1;
          }
// 计算菜品数量决定初始化加载数量 end
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
            // self._initScroll(); // 初始化scroll
            // self._calculateHeight(); // 初始化列表高度列表
            // console.log('goods.scroll.load.success=' + (new Date()).getTime());
            self.getlocalstroglegoods();
          });
          // console.log('goods.end=' + (new Date()).getTime());
          self.loadingModal = false;
      },
      showMemoHr() {
        for (let i = 0; i < this.memoList.length; i++) {
          if (this.memoList[i].name.length === 1) {
            return true;
          }
        }
        return false;
      },
      currentChopstickesStatus(id) {
        if (this.$root.baseData.hotel.chopstick) {
          let status = this.$root.baseData.hotel.chopstick.status;
          if (id !== this.$root.baseData.hotel.chopstick.id) {
            return false;
          }
          if (status === -1) {
            return true;
          }
        }
        return false;
      },
      changeHadFoodRawPrice(rawfood) {    // 控制是否是优惠视频价格 by limengxu
        if (rawfood) {
          return true;
        }
        return false;
      },
      openMemo(food) { // 点击加号立即弹出备注框
//        this.$root.openMemo = true;   // by xiaozc. 区分是购物车点击加过来的，还是菜品列表界面点击加过来的
        var memorequired = food.memorequired;
        if (memorequired === 1 || memorequired === 2 || memorequired === 3) {
          this.$root.cartControlMountedCount = 0;   // by xiaozc
          this.selectedMemoCount = 0;
          if (food.memostr) {
            food.memostr = '';
          }
          // console.log('food' + JSON.stringify(food));
          this.getMemoList(food);
        }
      },
      searchToShow() { // by xiaofei
        this.searchShow = true;
      },
      searchToHidden() { // by xiaofei
        this.searchShow = false;
        this.searchString = '';
      },
      menuShowControl(index) { // by xiaofei
        var currentFoods = this.goods[index].foods;
        if (!this.searchString) {
          this.munuShowList[index] = true;
          } else {
            for (var i = 0; i < currentFoods.length; i++) {
               if (currentFoods[i].name.toLowerCase().indexOf(this.searchString) !== -1) {
               this.munuShowList[index] = true;
               break;
            } else {
              this.munuShowList[index] = false;
            }
          }
         }
          // console.log(index + '%c====>' + this.munuShowList[index], 'color:blue');
          // if (index === 9) {
          //    console.log('%c*****************', 'color:red;font-size:30px');
          // }
          return true;
        },
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
          console.log('setGoodsBegin' + (new Date()).getTime());
          var menuList = this.$root.baseData.userDish;
          this.menuList = this.$root.baseData.userDish;
          for (var i = this.currentCategoryIndex; i < menuList.length; i++) {
            var menuCategory = {};
            var menuCategoryItemList = [];

            menuCategory.id = menuList[i].id;
            // console.log('menuCategory.id =' + menuCategory.id);
            menuCategory.name = menuList[i].name;
            menuCategory.englishname = menuList[i].englishname;
            // console.log('menuCategory.name =' + menuCategory.name);
            menuCategory.type = -1;

            for (var j = this.currentItemIndex; j < menuList[i].items.length; j++) {
              this.currentIndex++;
              if (this.currentIndex >= endIndex + 1) { // 第一次进入页面加载指定菜品然后跳出循环, 同时记录打断位置
                this.currentCategoryIndex = i;
                this.currentItemIndex = j;
                // console.log('break.currentCategoryIndex=' + this.currentCategoryIndex + ', currentItemIndex=' + this.currentItemIndex);
                // console.log('menuList[i].items.length=' + menuList[i].items.length);
                // console.log('menuList[i].items[j].name=' + menuList[i].items[j].name);
                // console.log('break.this.goods =' + JSON.stringify(this.goods));
                break;
              }
//              if (menuList[i].items[j].stock === 0) {
//                continue;
//              }
              var item = {};
              item.id = menuList[i].items[j].id;
              item.code = menuList[i].items[j].code;
              item.name = menuList[i].items[j].name;
              item.englishname = menuList[i].items[j].englishname;
              // 正常价格（非会员价）
              if (menuList[i].items[j].rawprice) {
                item.price = menuList[i].items[j].rawprice;
                item.rawprice = menuList[i].items[j].price;
              } else {
                item.price = menuList[i].items[j].price;
              }
              // 正常价格（非会员价）
              item.unit = menuList[i].items[j].unit;
              item.pic = menuList[i].items[j].pic;
              item.step = menuList[i].items[j].step;
              item.stock = menuList[i].items[j].stock;    // by xiaozc
              if (menuList[i].items[j].memo) {     // 菜品备注 by wangl
                item.memo = menuList[i].items[j].memo;
                item.memorequired = menuList[i].items[j].memorequired;
              };
              item.oldPrice = '';
              item.description = '';
              item.sellCount = '';
              item.rating = '';
              item.info = '';
              item.ratings = [];
              item.icon = '';
              item.image = '';
              item.activity = menuList[i].items[j].activity;
              menuCategoryItemList.push(item);
              // console.log('menuCategoryItemList=' + JSON.stringify(menuCategoryItemList));
            }
            if (menuCategoryItemList.length > 0) {
              var needMerge = false;
              if ((beginIndex > 0) && (i === this.currentCategoryIndex) && (this.currentItemIndex < menuList[i].items.length) && (this.currentItemIndex > 0)) {
                // 如果开始位置是大于零 && 当前分类索引 && 满足菜品索引小于分类下菜品长度 && 菜品索引不是第一个大于零
                needMerge = true;
                // console.log('needMerge.beginIndex=' + beginIndex + ', currentCategoryIndex=' + i + ', currentItemIndex=' + this.currentItemIndex);
              }
              menuCategory.foods = menuCategoryItemList;
              if (needMerge) { //  如果是第二次进入加载 那么当前循环进行合并（同时游标重置）  后面循环进行push;
                // console.log('needMerge = true.enter');
                // console.log('length =' + menuCategoryItemList.length);
                // console.log('this.currentCategoryIndex =' + this.currentCategoryIndex);

               // console.log('this.goods[this.currentCategoryIndex]=' + JSON.stringify(this.goods[this.currentCategoryIndex]));
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
          // console.log('this.goods.last=' + JSON.stringify(this.goods));
          console.log('setGoodsEnd' + (new Date()).getTime());
      },
      selectMenu(index, event) {
        if (this.searchShow) { // 如果搜索框处于显示状态，关闭搜索框并滚动到当前分类（TODO：延迟执行获取到滚动长度，待优化）
          this.searchToHidden();
          setTimeout(() => {
            this.scrollListener = false; // 取消滚动监听 双列表滑动onscroll监听方案
            clearInterval(this.timer); // 清除定时器 双列表滑动定时器方案
            this.listIndex = index;
            var length = 0;
            for (var i = 0; i < index; i++) { // 循环索引查找菜品模块计算高度  by wangl
              length = length + this.$refs.foodList[i].clientHeight;
            }
            this.dishLength = length;
            // 如果所在位置不是第一个菜品 已有高度 by wangl
            this.dishLength = this.dishLength - this.$refs.scroller.getPosition().top;
            this.$refs.scroller.scrollBy(0, this.dishLength, true);
            // console.log('settimeouttoplength=' + this.dishLength);
            // if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl 原来的selectMenu
            //   return;
            // }
            // let foodList = this.$refs.foodList;
            // let el = foodList[index];
            // this.foodsScroll.scrollToElement(el, 100); // 300.  TODO:左侧导航滑动时间 by wangl
          }, 10);
        } else {
          // console.log('click');
          this.scrollListener = false; // 取消滚动监听 双列表滑动onscroll监听方案
          clearInterval(this.timer); // 清除定时器 双列表滑动定时器方案
          this.listIndex = index;
          var length = 0;
          for (var i = 0; i < index; i++) { // 循环索引查找菜品模块计算高度  by wangl
            length = length + this.$refs.foodList[i].clientHeight;
          }
          this.dishLength = length;
          // 如果所在位置不是第一个菜品 已有高度 by wangl
          this.dishLength = this.dishLength - this.$refs.scroller.getPosition().top;
          this.$refs.scroller.scrollBy(0, this.dishLength, true);
          // console.log('toplength=' + this.dishLength);
          // if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl 原来的selectMenu
          //   return;
          // }
          // let foodList = this.$refs.foodList;
          // let el = foodList[index];
          // this.foodsScroll.scrollToElement(el, 100); // 300.  TODO:左侧导航滑动时间 by wangl
          }
      },
      selectFood(food, event) {
        // if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl
        //   return;
        // }
        this.selectedFood = food;
        this.$refs.food.show();
        var ChopstickesStatus = this.currentChopstickesStatus(food.id);
        this.$refs.food.currentChopstickesStatus(ChopstickesStatus);
        this.searchIcon = false;
      },
      addFood(target) {
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
          this.memoList.push(food.memo[k]);
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
//          this.selectedmemo = this.food.selectedmemo;   // by xiaozc. 备注记忆功能

          // by xiaozc. 暂时不需要备注记忆功能
          this.selectedmemo = [];
          for (i = 0; i < food.memo.length; i++) {
            for (j = 0; j < food.memo[i].name.length; j++) {
              this.selectedmemo[i] = [];
              this.selectedmemo[i][j] = false;
              console.log('this.selectedmemo[' + i + '][' + j + '].value=' + this.selectedmemo[i][j]);
            }
          }
          this.food.selectedmemo = this.selectedmemo;
        }

        console.log('this.memoList=' + JSON.stringify(this.memoList));

        this.memoModal = true;
      },
      handleSelectedMemo (food) { // by xiaozc. 处理选中备注信息，包括选中数量及备注字符串累加等
        this.selectedMemoCount = 0;
        food.memostr = '';
        var firstOne = true;
        for (var k = 0; k < this.selectedmemo.length; k++) {
          for (var j = 0; j < this.selectedmemo[k].length; j++) {
            if (this.selectedmemo[k][j] === true) {
              this.selectedMemoCount++;
              if (firstOne === true) {
                food.memostr += food.memo[k].name[j];
                firstOne = false;
              } else {
                food.memostr += ';' + food.memo[k].name[j];
              }
            }
          }
        }
      },
      memoClicked(food, memoListIndex, oneMemoIndex) {
        var self = this;
        this.$nextTick(() => {
          console.log('memoListIndex=' + memoListIndex + ', oneMemoIndex=' + oneMemoIndex);
          if (self.selectedmemo[memoListIndex][oneMemoIndex] === true) {    // by xiaozc. 为真则反选
            self.selectedmemo[memoListIndex][oneMemoIndex] = false;
            self.selectedmemo.splice(memoListIndex, 1, self.selectedmemo[memoListIndex]);   // by xiaozc. 触发vuejs的对于数组的双向绑定机制
            self.handleSelectedMemo(food);
            console.log('food.selectedMemoCount0=' + this.selectedMemoCount + ', food.memostr=' + food.memostr);
            return;
          }
          for (var i = 0; i < self.selectedmemo[memoListIndex].length; i++) {
            self.selectedmemo[memoListIndex][i] = false;
          }
          self.selectedmemo[memoListIndex][oneMemoIndex] = true;
          self.selectedmemo.splice(memoListIndex, 1, self.selectedmemo[memoListIndex]);   // by xiaozc. 触发vuejs的对于数组的双向绑定机制
          self.handleSelectedMemo(food);
          console.log('memoListIndex=' + memoListIndex + ', oneMemoIndex=' + oneMemoIndex + ', result=' + self.selectedmemo[memoListIndex][oneMemoIndex]);

          console.log('food.selectedmemo=' + JSON.stringify(self.selectedmemo));
          console.log('food.selectedMemoCount1=' + this.selectedMemoCount + ', food.memostr=' + food.memostr);
        });
      },
      closeMemo(option) { // 判断momorequired并做相应处理
        console.log('closeMemo.option=' + option);
        if (option && option === -1) {   // by xiaozc. 点击灰色遮罩层不做任何处理直接关闭
          this.memoModal = false;
          this.memoActive = false; // 取消备注提示（红色边框 memorequired = 2）
          this.attachMemo = '';
          if (this.tempMemo.length) {
            for (var i = 0; i < this.tempMemo.length; i++) {
              if (this.tempMemo[i].id === this.food.id) {
                // console.log('上次备注' + this.tempMemo[i].memostr);
                this.food.memostr = this.tempMemo[i].memostr; // 如果点击的是灰色遮罩层而不是确定按钮，则备注还是上次选中的备注
              } else {
                console.log('not found');
                this.food.memostr = '';
              }
            }
          } else {
            // console.log('tempMemo为空');
            this.food.memostr = '';
          }
          return;
        }
        if (this.food.memorequired === 3) {
          if (this.selectedMemoCount !== 2) {
            this.selectedMemoModal = true;
            this.selectedMemoModalText = this.$t('lang.doubleDishes');      // 双拼菜品,请选择两个选项
            return;
          }
          this.memoModal = false;
        }
        if (this.food.memorequired === 2) {
          var selectedMemoCount = 0;
          var selectedmemo = this.selectedmemo;
          for (var k = 0; k < selectedmemo.length; k++) {
            // console.log('-------------------------');
            // console.log(selectedmemo[k].length + selectedmemo[k]);
            // console.log(JSON.stringify(this.food.memo[k]) + this.food.memo[k].required);
            if (this.food.memo[k].required === '1') { // 必选备注
              console.log('mustMemo');
              selectedmemo[k].forEach((memo) => {
                if (memo === true) {
                  selectedMemoCount++;
                }
              });
              if (selectedMemoCount === 0) {
                this.memoActive = true; // 红色边框提示
                // this.selectedMemoModal = true;
                // this.selectedMemoModalText = '本菜品必须选择备注~';
                return;
              }
            }
          }
          // console.log('selectedMemoCount=' + selectedMemoCount);
          if (this.selectedMemoCount === 0) {
            this.memoActive = true; // 红色边框提示
            this.selectedMemoModal = true;
            this.selectedMemoModalText = this.$t('lang.mustSelectMemo');     // 本菜品必须选择备注
            return;
          }
          this.memoModal = false;
          this.memoActive = false; // 取消红色边框提示
        }
        if (!this.food.memostr) { // 如果没有备注，令备注为空，避免出现undefined
          this.food.memostr = '';
        }
        if (this.attachMemo) { // 存在单品附加备注的话，拼接字符串时加上（），便于区分
          this.attachMemo = '（' + this.attachMemo + '）';
        }
        this.food.memostr += this.attachMemo; // 加上附加备注
        this.attachMemo = '';
        if (this.food.memorequired === 3 || this.food.memorequired === 2 || this.food.memorequired === 1) {
          console.log('goods.selectFoods=' + JSON.stringify(this.selectFoods));
          // console.log('goods.food.memostr=' + this.food.memostr);
          if (!this.food.memostrlist) {
            this.food.memostrlist = [];
          }
          if (this.food.rawfood) {    // 购物车里点击加过来的，且不合并点单项的情形
            this.food.rawfood.memostrlist.push(this.food.memostr);
            console.log('rawfood.memostrlist=' + JSON.stringify(this.food.rawfood.memostrlist));
          } else {
              if (!this.food.memostr) { // 如果没有选择备注点击确定，push''（memorequired = 1）
                this.food.memostrlist.push('');
              } else {
                this.food.memostrlist.push(this.food.memostr);
              }
            console.log('memostrlist=' + JSON.stringify(this.food.memostrlist));
          }
          this.$root.eventHub.$emit('postMemoProcess', this.food);
          this.$root.eventHub.$emit('lastHandleFood', {'food': this.food, 'type': '1'});    // 加菜行为触发同桌点菜
          this.$root.eventHub.$emit('setLocalStorageGoods');
          // 当存在备注时，因点击加号为增加菜品但却已经执行setitem('goods')，因此该goods为修改数据之前goods，需要在点击备注确认时再次存入goods
        } else {
          this.$root.eventHub.$emit('lastHandleFood', {'food': this.food, 'type': '0'}); // 修改备注行为触发同桌点菜
        }
        console.log('this.food.memostr=' + this.food.memostr);
        this.tempMemo.push({'id': this.food.id, 'memostr': this.food.memostr}); // 关闭备注框的同时临时存储该备注到tempMemo
        this.memoModal = false;
      },
      searchFor(value, searchString) {  // 实时搜索
        var result = [];
        if (!searchString) {
          return value;
        }
        searchString = searchString.trim().toLowerCase();
        result = value.filter(function(item) {
          if (item.name.toLowerCase().indexOf(searchString) !== -1) {
            return item;
          }
        });
        return result;
      },
      cancelSharedOrder() { // 不加入同桌点菜（否）
        this.$root.syncOrder = false;
        this.$root.sharedOrder = false;
        this.$root.eventHub.$emit('emptyCart'); // 清空购物车
        this.$root.peopleNum = '';
        var initSynOrderData = {};
        initSynOrderData.status = -2;
        initSynOrderData.tablenum = this.$root.urlParam.tablenum;
        this.$root.eventHub.$emit('syncorder', initSynOrderData);
      },
      listenScroller() { // 双列表滑动监听
        console.log('listenScroller');
        // **************************************scroll_start**********************************************************
      // this.$refs.foodsWrapper.addEventListener('touchstart', () => { // 菜品滚动监听
      //   // console.log('toucstart');
      //   this.scrollListener = true;
      // }, false);
      //   this.$refs.scroller.$on('onScroll', res => {   // by xiaozc
      //     if (!this.scrollListener) {
      //       return;
      //     }
      //   // console.log('onScroll.res=' + JSON.stringify(res));
      //     var scrollTop = JSON.stringify(res.top);
      //     let length = 0;
      //     for (var i = 0; i < this.menuList.length; i++) { // 将菜品模块高度存放在数组
      //       console.log('this.$refs.foodList[i].i=' + i);
      //       console.log('this.$refs.foodList[i].clientHeight=' + this.$refs.foodList[i].clientHeight);
      //       length = length + this.$refs.foodList[i].clientHeight;
      //       this.scrollTopArray[i] = length;
      //     }
      //     for (var k = 0; k < this.menuList.length; k++) { // 判断position，让相对应的selectmenu高亮显示
      //         if (scrollTop - this.scrollTopArray[k] < 10) {
      //           // console.log('this.scrollTop=' + this.scrollTopArray[k] + 'this.$refs.scroller.getPosition().top=' + this.$refs.scroller.getPosition().top + ' ' + k);
      //           this.listIndex = k;
      //           break;
      //         }
      //     }
      //   });
      // **************************************scroll_end**************************************************************
        setTimeout(() => {
          // console.log(this.$refs.foodsWrapper);
          if (this.$refs.foodsWrapper) {
            this.$refs.foodsWrapper.addEventListener('touchmove', (event) => { // 监听touchmove事件
              clearInterval(this.timer); // 清除定时器
              // console.log('touchmove');
              var currentPosition = 0;
              let length = 0;
              for (var i = 0; i < this.menuList.length; i++) { // 将菜品模块高度存放在数组
                length = length + this.$refs.foodList[i].clientHeight;
                this.scrollTopArray[i] = length;
                // console.log('length' + i + '=' + length)
              }
              this.timer = setInterval(() => {
                // console.log('getPosition=' + this.$refs.scroller.getPosition().top + '------' + currentPosition);
                if (currentPosition === this.$refs.scroller.getPosition().top) { // 如果滚动停止
                  clearInterval(this.timer); // 清除定时器
                }
                currentPosition = this.$refs.scroller.getPosition().top;
                for (var k = 0; k < this.menuList.length; k++) { // 判断position，让相对应的selectmenu高亮显示
                    if (this.$refs.scroller.getPosition().top - this.scrollTopArray[k] < 10) {
                      // console.log('this.scrollTop=' + this.scrollTopArray[k] + 'this.$refs.scroller.getPosition().top=' + this.$refs.scroller.getPosition().top + ' ' + k);
                      this.listIndex = k;
                      if (this.layout === 2) {
                        this.rowScroller();
                      }
                      break;
                    }
                }
              }, 50);
            }, false);
          }
        });
      },
      menuRowScroller() { // 顶部分类横向滚动值
        this.$nextTick(() => {
          if (this.$refs.goods2rowScroller) {
            this.rowMenuLength = this.$refs.goods2rowScroller.length;
            this.$refs.content.style.width = this.rowMenuLength * 77 + 'px';
            // ul被上层wrapper宽度限制，无法滚动，使用dom操作解决，待优化
            this.betterScroll = new BScroll(this.$refs.wrapper, {
              click: true,
              scrollX: true,
              scrollY: false,
              listenScroll: true
            });
          }
        });
      }
    },
    filters: {},
    components: {
      shopcart,
      cartcontrol,
      food,
      LoginModal,
      Group,
      Cell,
      Datetime
    }
  };
</script>
<style type="text/css">
.prompting-enter-active, .prompting-leave-active {
  transition: all .5s;
}
.prompting-enter, .prompting-leave-to {
  opacity: 0;
  /*transform: scale(0);*/
}
.prompting{ /*同桌点菜信息提示框样式*/
  padding:10px;
  background:#fffbd8;
  width:100%;
  position:absolute;
  top:0;
  display:flex;
  z-index:45;
  opacity:0.95;
}
.foods-wrapper .loading-layer, .menu-wrapper .loading-layer {
  display: none;
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/weui.min.css";
  @import "../../common/stylus/mixin.styl"
.weui-icon_toast.weui-loading{
  margin-left: 40px!important;
  margin-bottom: 3px!important;
}
.foods-warpper-list{
  display: block;
  height: 7px;
}
.dataTime {
  padding: 0px!important;
}
.dataTime p {
  height: auto!important;
  background: #fff!important;
  color: #999!important;
  font-size:16px;
  font-weight:700;
}
.vux-datetime-value{
  padding-left:13px;
}
.vux-no-group-title{
  margin-top: 0px!important;
}
.weui-cell .title{
  width: 60px!important;
}
.tag-switch{
  height: 22px!important;
}
.weui-switch, .weui-switch-cp__box{
  width:44px!important;
}
.tag-switch::before{
  margin-top:-1px;
  width: 22px!important;
  height: 22px!important;
}
.tag-switch::after{
  margin-top:-1px;
  width: 22px!important;
  height: 22px!important;
}
.weui-cell .weui-cell__hd label{
  margin-bottom: 0px;
  text-align: right;
  line-height: 30px;
}
.memoRequired{
  border: 1px solid red;
}
.btn-group {
  display: -webkit-box !important;
}
.goodsHr{
  margin-top: 10px;
  margin-bottom: 10px;
}
.pull-to-refresh-layer { // 引入vue-scroller by wangl
  display:none;
}
.weui-dialog__hd{
  margin-bottom: 0.5em;
}
.memoText{
  display:block;
  width:100%;
  text-align:right;
  font-size:12px;
}
._v-container[data-v-ecaca2b0] { // 引入vue-scroller by wangl
  left: 80px !important;
  width: 80% !important;
}
.btn-default:hover{
  background-color:#fff !important;
}
.btn-default{
  margin:10px;
}
.goods1 .foods-wrapper .food-item .content .price .now{
  margin-right: 0px !important;
}
.deletingLine{
  font-size:12px;
  color:#656565;
  text-decoration: line-through;
}
.memoTip{
  box-shadow: 0 0 3px #ccc;
  margin-left:20px;
  text-align:left;
  font-size:12px;
  color:#666;
}
.marginreset{
  margin: 4px 10px !important;
}
.square {
  border-radius:0 !important;
  box-shadow: 0 0 1px #777;
}
.memoTip strong{
  color:red;
}
.searchInput{ // 搜索框
  color:#888;
  position:absolute !important;
  top:8px;
  width:100%;
  max-height:40px !important;
  // z-index:30;
  border-radius:5px;
}
.searchIcon{ // 搜索图标
  position:absolute;
  top:28px;
  right:50px;
  // z-index:30;
  font-weight:bold !important;
  font-size:20px !important;
  line-height:45px !important;
  color:white !important;
  text-shadow:0 0 2px #000;
}
.koubei{top: 28px !important}
// goods2  为有图模式layout
  .goods2
    display: flex
    position: absolute
    flex-direction: column
    top: 68px
    bottom: 46px
    width: 100%
    .wrapper
      width: 100%;
      height: 10%;
      min-height: 54px;
      background: #f3f5f7
      overflow:hidden;
      ul
        height: 54px;
        border-bottom:3px solid #d8d8d8;
      .content:after{
        content: "";
        display: block;
        clear:both;
        visibility: hidden;
      }
      ._v-container
        height: 10% !important
      .menu-item
        display: inline-block;
        overflow: hidden;
        height: 54px
        width: 77px
        padding: 0 12px
        line-height: 14px
        height: 54px;
        text-align: center;
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          border-bottom: 3px solid #00a0dc;
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
          word-break:break-all
    .foods-wrapper
      width: 100%;
      height: 90%;
      left: 0px !important;
      ._v-container[data-v-ecaca2b0]
        top: auto;
        width: 100%!important;
        left: 0px!important;
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
          padding: 4px;
          border: 1px solid #b5b5b5;
          border-radius: 10px;
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
          word-break:break-all
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