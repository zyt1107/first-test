<template>
  <div style="position: absolute;top: -0.5%;width:100%; z-index:99999;">
     <div v-if="loadingModal" id="loadingToast" style="display: block;">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">{{ $t('lang.loading') }}</p>
      </div>
    </div>
     <div class="page__hd" style="position: fixed;width: 100%;height: 50px;z-index: 88;">
        <h1 class="page__title" style="line-height:48px; background-color:rgb(99, 105, 111); color:#fff">餐厅列表</h1>
    </div>
    <div :class="loadingModal ? 'MaskingA' : 'MaskingB'"></div>
    <!-- <div style="width:100%; height:100%; background-color:rgb(238, 238, 238)" v-if="loadingModal"></div> -->
    <div class="page__bd">
      <div class="weui-panel weui-panel_access">
          <div class="weui-panel__bd scrollMore" style="max-height:100%">
            <ul v-for="restaurant in shopList">
              <li class="weui-media-box weui-media-box_appmsg" style="height:auto;overflow:hidden;padding-bottom:10px" v-for="item in restaurant.restaurants">
                  <div class="weui-media-box__hd" style="margin-top:-9px">
                      <img style="width: auto" class="weui-media-box__thumb" :src="item.src && item.src.length != 0 ? item.src : shop_img" alt="">
                  </div>
                  <div class="weui-media-box__bd">
                      <h4 class="weui-media-box__title">{{item.name}}</h4>
                      <p class="weui-media-box__desc">电话：{{item.tel}}</p>
                      <p class="weui-media-box__desc">地址：{{item.address}}</p>
                       <p style="margin-top:3px">
                        <span style="margin-right:10px" v-if="sellStatus">
                            <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary tagButton" @click="destine(item.token)">预定</a>
                        </span>
                        <span v-if="!sellStatus">
                          <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary tagButton" @click="outerSell(item.token)">外卖</a>
                        </span>
                      </p> 
                  </div>
              </li>
            </ul>
          </div>
<!--           <div class="weui-panel__ft">
              <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                  <div class="weui-cell__bd">查看更多</div>
                  <span class="weui-cell__ft"></span>
              </a>
          </div> -->
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios';    // by limengxu

  export default {
    data() {
      return {
        shopList: [],
        loadingModal: true,
        sellStatus: true,
        shop_img: 'http://www.xiucan.com/images/img/shop_img.png'
      };
    },
    created() {
    },
    mounted() {
      // console.log('this.$root.urlParam.tag:' + this.$root.urlParam.tag);
      let resUrl = 'http://www.xiucan.com/api/v2/getshoplist/' + this.$root.urlParam.tag;
      // let resUrl = 'static/dataShopList.json';
      axios.get(resUrl).then((res) => {
        // console.log('shopList:' + JSON.stringify(res.data));
        this.shopList = res.data;
        this.loadingModal = false;
      });
      if (this.$root.urlParam.tag === '31') {
        this.sellStatus = true;
      } else {
        this.sellStatus = false;
      }
    },
    methods: {
      destine(token) {
        sessionStorage.setItem('tagModel', true);
        // this.$root.type = 40;   // 定义为预定状态
        let diancaiUrl = window.location.pathname;
        console.log('路径部分：' + diancaiUrl);
        console.log('token:' + token);
        // if (token) {
        //   // alert('当前点击token:' + token);
        //   window.location.href = 'http://www.xiucan.com' + diancaiUrl + '?token=' + token + '#/goods';
        //   return;
        // } else {
        //   alert('未获得token,跳转失败');
        // }
        // window.location.href = 'http://www.xiucan.com/diancaitest/?token=t1276#/goods';
        window.location.href = '?token=t1276#/goods';
        // this.$router.push('goods');
      },
      outerSell(token) {
        sessionStorage.setItem('outerSellModel', true);
        // this.$root.type = 30;   // 定义为外卖状态
        let diancaiUrl = window.location.pathname;
        // if (token) {
        //   // alert('当前点击token:' + token);
        //   window.location.href = 'http://www.xiucan.com' + diancaiUrl + '?token=' + token + '#/goods';
        //   return;
        // } else {
        //   alert('未获得token,跳转失败');
        // }
        // window.location.href = 'http://www.xiucan.com/diancaitest/?token=t1276#/goods';
        window.location.href = '?token=t1276#/goods';
      }
    }
  };
</script>
<style type="text/css">
  .weui-media-box__bd p{
    line-height: 20px!important;
  }

  .weui-media-box_appmsg .weui-media-box__hd{
    width: 90px;
    height: 55.62px;
    overflow: hidden;
    text-align: center;
  }
  .weui-media-box__title{
    margin-bottom: 7px;
  }
  .thumbsUp{
    margin-right: 3px;
  }
  .tagButton{
    background-color: #1AAD19;
    width: 56px;
    font-size: 12px;
  }
  .MaskingA{
    width: 100%;
    height: 120px;
    background-color: rgb(238, 238, 238);
  }
  .MaskingB{
    width: 100%;
    height: 58px;
  }
</style>