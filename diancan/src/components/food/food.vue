<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.pic">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift" style='background:#00a0dc;padding: 5px;'></i>
          </div>
        </div>
        <div class="content">
          <div>
            <h1 class="title">{{food.name}}</h1>
            <h2 class="title2">{{food.englishname}}</h2>
          </div>
<!--           <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div> -->
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper" v-show="!chopstickesStatus && food.stock !== 0">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <div class="cartcontrol-wrapper" v-show="chopstickesStatus || food.stock === 0">
            【{{ $t('lang.soldOut') }}】      <!-- 售罄-->
          </div>
          <div class="foodMemo" @click="openMemo" v-show="food.memorequired === 0 && food.count > 0" style=""> <!-- 备注 memorequired = 0 -->
            {{ $t('lang.memo') }}   <!--备注-->
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!chopstickesStatus && (food.stock !== 0) && (!food.count || food.count===0)">
              {{ $t('lang.addShoppingCart') }}  <!--加入购物车-->
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">{{ $t('lang.menuInformation') }}</h1>  <!--商品信息-->
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">{{ $t('lang.menuReview') }}</h1>  <!--商品评价-->
          <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType"
                        :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">{{ $t('lang.noComment') }}</div> <!--暂无评价-->
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import ratingselect from 'components/ratingselect/ratingselect';
  import split from 'components/split/split';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: this.$t('lang.all'),                   // 全部
          positive: this.$t('lang.positive'),         // 推荐
          negative: this.$t('lang.negative')          // 好评
        },
        chopstickesStatus: false
      };
    },
    methods: {
      currentChopstickesStatus(ChopstickesStatus) {       // 控制其餐具状态在-1，将其购买按钮改为售罄
        // console.log('this.currentChopstickesStatus:' + ChopstickesStatus);
        this.chopstickesStatus = ChopstickesStatus;
      },
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
        this.$root.eventHub.$emit('showSearchIcon');
      },
      addFirst(event) {
        // if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl
        //   return;
        // }
        console.log('this.food.memorequired=' + this.food.memorequired);
        if (this.food.memorequired === 0 || !this.food.memorequired) { // memorequired = 0并且没有填写备注的情况下，此处获得到的memorequired为undefined
          this.$emit('add', event.target);
          Vue.set(this.food, 'count', 1);
          if (this.$root.baseData.hotel.chopstick) {
            if (this.food.id === this.$root.baseData.hotel.chopstick.id) { // 当人数不等于食品的数量且当前食物是筷子时为true by limengxu
              // console.log('changeFoodCount修改');
              this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': true});  // 将勾选框勾起状态 返回给shopCart
            }
          }
        }
        if (this.food.memorequired === 1 || this.food.memorequired === 2 || this.food.memorequired === 3) {
          this.$root.eventHub.$emit('openMemo', this.food); // memorequired = 1,2,3打开备注
        }
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      addFood(target) {
        this.$emit('add', target);
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      openMemo() {
        // console.log(JSON.stringify(this.food));
        this.$root.eventHub.$emit('openMemo', this.food); // memorequired = 0打开备注
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      ratingselect,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .foodMemo{ // 备注
    float:right;
    font-size:12px;
    border-radius:8px;
    border:1px solid #eeeeee;
    padding:4px;
    background:#fff;
    color:#000;
    margin-top:-50px;
  }
  .food .content .title{
    display: inline-block
    margin-right: 10px
  }
  .title2{
    max-width: 60%
    font-size: 10px
    color: rgb(7, 17, 27)
    line-height: 22px
    display: inline-block
    white-space: nowrap
    text-overflow: ellipsis
    overflow-x: hidden
    vertical-align: middle
  }      
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff

    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
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
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)

        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>