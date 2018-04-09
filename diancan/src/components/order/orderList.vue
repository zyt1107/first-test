<template>
<div class="has-max">
    <div class="weui_tab" style="margin-top: 25px;">
        <!--我的订单-->
        <div class="weui_navbar header-classify">
            <a href="javascript:;" class="weui_navbar_item" v-bind:class="{ weui_bar_item_on: newOrder}">
                {{ $t('lang.myOrder') }}<!-- 我的订单 -->
            </a>
        </div>
        <!-- 数据加载modal start -->
        <div v-if="loadingModal" id="loadingToast" style="display: block;">
          <div class="weui-mask_transparent"></div>
          <div class="weui-toast">
              <i class="weui-loading weui-icon_toast"></i>
              <p class="weui-toast__content">{{ $t('lang.loading') }}</p><!-- 数据加载中 -->
          </div>
        </div>
        <!-- 数据加载modal  end -->
        <!-- 未点餐提示 start-->
        <div v-if="mealDialog">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__bd">{{ $t('lang.notOrdered') }}！</div><!-- 您还未点餐 -->
                <div class="weui-dialog__ft">
                    <a href="javascript:history.back();" class="weui-dialog__btn weui-dialog__btn_primary" @click = "mealDialog = false">{{ $t('lang.confirm') }}</a>
                </div>
            </div>
        </div>
        <!-- 未点餐提示 end-->
        <div class="weui_tab_bd" v-bind:class="{koubeiorderlist: orderListTabShow}">

            <div id="tab1" class="weui_tab_bd_item weui_tab_bd_item_active">
                <div class="weui_panel weui_panel_access" style="margin-bottom: 60px;margin-top: 0">
                    <div class="weui_panel_bd" v-for="order in orderList">
                            <a class="weui_media_box weui_media_appmsg product-show-padding">
                                <div class="weui_media_hd product-show-thumb">
                                    <img class="weui_media_appmsg_thumb" src="../../../static/image/logo.jpg">
                                </div>
                                <div class="weui_media_bd">
                                    <p class="weui_media_title product-buttom">
                                        <span class="product-show-title">{{order.companyName}}</span>
                                        <span class="product-show-distance">
                                            <img src="../../../static/image/logo.jpg" class="small-icon">
                                        </span>
                                    </p>
                                    <!--人数-->
                                    <p class="weui_media_desc product-buttom">
                                        <span class="product-show-discount">
                                            {{order.person_num}}{{ $t('lang.people') }}
                                        </span>
                                    </p>
                                    <p class="weui_media_desc product-show-introduce">
                                        {{ $t('lang.orderTime')}}: {{order.time}}                <!-- 下单时间 -->
                                        <!-- <span class="product-show-dist">{{ $t('lang.viewDetails') }}</span>-->     <!-- 查看详情 -->
                                    </p>
                                    <!--总价-->
                                    <p class="weui_media_desc product-buttom">
                                        <span class="product-show-price">
                                            <font>{{ $t('lang.totalPrice') }}: ￥{{order.totalPrice}}</font>  <!-- 总价 -->
                                        </span>
                                    </p>
                                    <router-link :to="{ name:'orderDetail', params: {orderId: order.orderid} }">
                                        <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_primary" style="background-color: #1AAD19;">{{ $t('lang.viewDetails') }}</a>
                                        <!-- <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_default">{{ $t('lang.viewDetails') }}</a> -->
                                    </router-link>
                                    <router-link :to="{ name:'comment', params: {order: order} }">
                                        <a href="javascript:;" class="weui-btn weui-btn_mini weui-btn_default">评价</a>
                                    </router-link>
                                </div>
                            </a>
                        <!-- <div class="interval">12324</div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import axios from 'axios';  // by wangl
export default {
    data() {
        return {
          orderList: [],
          newOrder: true,
          orderListTabShow: false,
          loadingModal: true,
          mealDialog: false // 未点餐提示
        };
    },
    computed: {},
    activated() {
        if (this.$root.clientInfo === 'AlipayClient') {
            this.orderListTabShow = true;
        }
        this.$root.showHeader = false;
        // this.orderList.companyName = '秀餐测试店';
        // this.orderList.person_num = 10;
        // sessionStorage.setItem('platformId', 'fewagfaegaerg');
        console.log('orderList.platformId = ' + sessionStorage.getItem('platformId'));
        if (sessionStorage.getItem('platformId')) {
            // var restUrl = 'http://www.xiucan.com/api/v2/getorderlist/' + this.$root.platformId + '/all/h5';
            var restUrl = 'http://www.xiucan.com/api/v2/getorderdatalist/' + sessionStorage.getItem('platformId') + '/' + sessionStorage.getItem('cid');
            // var restUrl = 'static/orderlist.json';
            // console.log(restUrl);
            var self = this;
            axios.get(restUrl).then((res) => {
                self.orderList = res.data;
                self.loadingModal = false;
                if (!self.orderList) {
                    self.mealDialog = true;
                }
              // self.orderDetail.price = Number(self.orderDetail.price).toFixed(2);
              // console.log('orderList = ' + JSON.stringify(self.orderList));
              // console.log('orderList1 = ' + self.orderList);
            }).catch(function(error) {
              console.log('您还未点餐' + error);
              self.loadingModal = false;
              // self.back();
            });
        }
    },
    deactivated() {
      console.log('orderlist      deactivated');
      this.loadingModal = true;
    },
    methods: {}
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../../static/css/weui.min1.css"   // by wangl
	@import "../../../static/css/jquery-weui.min.css"   // by wangl
    body{font-family: "微软雅黑";background-color: #eeeeee;}
    .has-max{max-width: 640px;position: relative;top: -25px;}
    /*分类*/
    .header-classify{position: fixed!important;z-index: 9;width: 100%;top: 0;max-width: 640px;margin-top: 50px;}
    .weui_navbar_item.weui_bar_item_on{
        color: #09BB07;
        background-color: #fafafa;
        font-size: 20px;
        text-decoration: none;
        border-bottom: 3px solid #09BB07;
        height: 68px;
    }
    .weui_navbar_item:after{border: 0;}
    .weui_navbar_item {padding: 20px 0;}
    .weui_grids:before{border: 0;}
    .weui_navbar:after{border: 0;}
    .weui_grid:before{border: 0;}
    .two-border{background-color: #F2F2F5;}
    .two-level{width: 25%;padding: 8px 5px;}
    .two-level:hover{text-decoration: none;}
    .two-level-name{margin-bottom: 0;border: 1px solid #fafafa;background-color: #FFFFFF;border-radius: 20px;padding: 3px;color: #888;}
    .two-active{background-color: #FF566D;color: #fff;}
    /*产品分类展示*/
    .product-show-padding{padding: 10px;}
    .product-show-thumb{width: 80px!important;height: 80px!important;}
    .product-show-title{font-size: 15px;float: left;width: 78%;overflow: hidden;text-overflow: ellipsis;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
    .product-show-distance{font-size: 12px;float: right;color: #999;}
    .product-show-introduce{-webkit-line-clamp: 1!important;color: #666!important;margin-bottom: 5px;margin-left:-2px;}
    .product-show-price{color: #000000;}
    .product-show-discount{font-size: 12px;}
    .product-buttom{margin-bottom: 5px;}
    .product-show-dist{font-size: 12px;float: right;background-color: #fff;border-radius: 2px;padding: 2px 3px; color:#09bb07;}
    .small-icon{width: 18px;}
    .small-icon2{width: 18px;margin-right: 5px;margin-top: -2px;}
    .wujiaoxing{width: 14px;}
    .small-zan{width: 15px;float: left;margin-right: 4px;}
    .interval{height: 10px;background-color: #eee;}
    .weui_navbar+.weui_tab_bd {
        padding-top: 0;
    }
    .weui_article {padding:10px 15px;}
    .weui_article h1 {margin-bottom:0;}
    .header-classify {
        margin-top:0;
    }
    .koubeiorderlist{margin-top:40px;}
</style>
















