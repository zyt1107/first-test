<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
<!--       <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">{{ $t('lang.overallRating')}}</div> 综合评分 
          <div class="rank">{{ $t('lang.HigherThanSurroundingBusinesses') }}{{seller.rankRate}}%</div> 高于周边商家 
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">{{ $t('lang.serviceAttitude') }}</span> 服务态度
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">{{ $t('lang.productRating')}}</span> 商品评分
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">{{ $t('lang.deliveryTime') }}</span><!-- 送达时间 
            <span class="delivery">{{seller.deliveryTime}}{{ $t('lang.minute') }}</span><!-- 分
          </div>
        </div>
      </div> -->
      <split></split>
<!--       <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="ratings"></ratingselect> -->
      <div>
          <div class="ratingselect">
            <div class="rating-type border-1px">
              <span @click="selectRating(2)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
                  class="count">{{ratings.length}}</span></span>
              <span @click="selectRating(0)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
                  class="count">{{positives.length}}</span></span>
              <span @click="selectRating(1)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
                  class="count">{{negatives.length}}</span></span>
            </div>
            <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
              <span class="icon-check_circle"></span>
              <span class="text">{{ $t('lang.justLookContentEvaluation') }}</span><!-- 只看有内容的评价 -->
            </div>
          </div>
      </div>
      <div class="rating-wrapper" ref="rating_wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(onlyContent, rating)">
            <div class="avatar">
              <img width="28" height="28" src="./avatar.jpg">
             </div>
           <div class="content">
              <h1 class="name">{{rating.hotel.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.hotel.commentLevel"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.hotel.deliveryTime}}</span>
              </div>
              <p class="evaluationStore">
                <ul>
                  <li v-for="item in evaluationStore(rating)" class="list">{{item}}</li>
                </ul>
              </p>
              <p class="text">{{rating.comment.evaluationStoreText}}</p>
<!--               <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div> -->
              <div class="time">
                {{timestampToTime(rating.hotel.deliverTime / 1000)}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatDate} from 'common/js/date';
  import star from 'components/star/star';
  import ratingselect from 'components/ratingselect/ratingselect';
  import split from 'components/split/split';

  import axios from 'axios';   // by xiaozc

  const ALL = 2;
//  const ERR_OK = 0;   by xiaozc

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: 2,
        onlyContent: false,
        scroll: null,
        desc: {
          all: '全部',
          positive: '良好',
          negative: '吐槽'
        }
      };
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.hotel.commentLevel >= 3;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.hotel.commentLevel < 3;
        });
      }
    },
    // activated
    activated() {
      // this.scroll = new BScroll(this.$refs.ratings, {
      //   click: true
      // });
      this.scroll = new BScroll(this.$refs.ratings, {
         click: true
      });
      this.loadData();
    },
    methods: {
      evaluationStore(rating) {
        var evaluationStore = rating.comment.evaluationStore;
        var evaluationStoreClone = [];
        for (var i = 0; i < evaluationStore[1].length; i++) {
          if (evaluationStore[1][i] === 1) {
            evaluationStoreClone.push(evaluationStore[0][i]);
          }
        }
        return evaluationStoreClone;
      },
      timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);    // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
      },
      needShow(onlyContent, rating) {
        // console.log('当前字数:' + rating.comment.evaluationStoreText.length);
        if (!onlyContent) {
          if (this.selectType === 2) {
            return true;
          }
          if (this.selectType === 0 && rating.hotel.commentLevel >= 3) {
            return true;
          }
          if (this.selectType === 1 && rating.hotel.commentLevel < 3) {
            return true;
          }
        } else if (rating.comment.evaluationStoreText.length > 0) {
          if (this.selectType === 2) {
            return true;
          }
          if (this.selectType === 0 && rating.hotel.commentLevel >= 3) {
            return true;
          }
          if (this.selectType === 1 && rating.hotel.commentLevel < 3) {
            return true;
          }
        }
        return false;
      },
      selectRating(level) {
        this.selectType = level;
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
      loadData() {
        var restUrl = 'http://www.xiucan.com/api/v2/getevaluation/' + sessionStorage.getItem('cid');   // 'static/data.json'
        console.log(restUrl);
        // var restUrl = 'static/ratings.json';
        axios.get(restUrl).then((res) => {
          console.log('评价功能：' + JSON.stringify(res));
          this.ratings = res.data.results;
  //        this.seller = res.data.seller

          // by xiaozc
          // this.ratings = [];

          // this.seller.id = res.data.hotel.id;
          // this.seller.name = res.data.hotel.name;
          // this.seller.description = '';
          // this.seller.deliveryTime = '';
          // this.seller.score = 5;
          // this.seller.serviceScore = 5;
          // this.seller.foodScore = 5;
          // this.seller.rankRate = 5;
          // this.seller.minPrice = 0;
          // this.seller.deliveryPrice = 0;
          // this.seller.ratingCount = 0;
          // this.seller.sellCount = 0;
          // this.seller.bulletin = '';
          // this.seller.supports = [];
          // this.seller.avatar = '';
          // this.seller.pics = [];
          // this.seller.infos = [];
          this.$nextTick(() => {
                this.scroll.on('scroll', (pos) => {
                  console.log('下拉刷新：' + pos.y);
                  // 下拉动作
                  if (pos.y > 50) {
                    this.loadData();
                  }
                });
            });
          });

          this.scroll.on('scroll', (pos) => {
            console.log('下拉刷新：' + pos.y);
            // 下拉动作
            if (pos.y > 50) {
              this.loadData();
            }
          });
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .evaluationStore{
    height: 20px;
    width: 100%;
  }
  .evaluationStore .list{
    border: 1px solid #949494;
    font-size: 12px;
    text-align: center;
    float: left;
    padding: 3px 4px;
    margin-right: 3px;
  }
  .ratings
    position: absolute
    top: 70px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>