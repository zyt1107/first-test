<template>
 <div class="banner">
        <div class="slide" id="slide2">
            <ul>
                <li>
                    <a href="#">
                        <img src="http://www.xiucan.com/uploads/W020170228552313737952.jpg" alt="">
                    </a>

                </li>
                <li>
                    <a href="#">
                        <img src="http://www.xiucan.com/uploads/W020170612516911488521.jpg" alt="">
                    </a>

                </li>
                <li>
                    <a href="#">
                        <img src="http://www.xiucan.com/uploads/W020160714518675510927.jpg" alt="">
                    </a>

                </li>
            </ul>
            <div class="dot">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
             <!--<img src="http://www.xiucan.com/uploads/W020160714518675510927.jpg" width="100%" height="100%"/>-->
        <div class="tab-item">
           	<div class="weui-btn weui-btn_primary" @click="startstatue=true" style="margin-top: 15px; width: 90%;">开始点餐</div>
        </div>
        <div class="weui-cells">
        	<router-link to="/orderList">
				<a class="weui-cell homeList weui-cell_access" href="javascript:;">
	                <div class="weui-cell__hd orders"></div>
	                <div class="weui-cell__bd">
	                    <p>我的订单</p>
	                </div>
	                <div class="weui-cell__ft">查看订单</div>
            	</a>
             </router-link>
            <router-link to="/member">
            	<a class="weui-cell homeList weui-cell_access" href="javascript:;">
                <div class="weui-cell__hd member"></div>
                <div class="weui-cell__bd">
                    <p>会员卡</p>
                </div>
                <div class="weui-cell__ft">查看会员卡</div>
            	</a>
            </router-link>
            <router-link to="coupons">
            	<a class="weui-cell homeList weui-cell_access" href="javascript:;">
                <div class="weui-cell__hd coupons"></div>
                <div class="weui-cell__bd">
                    <p>优惠券</p>
                </div>
                <div class="weui-cell__ft">更多优惠券</div>
            </a>
            </router-link>
            <router-link to="giftcard">
            	<a class="weui-cell homeList weui-cell_access" href="javascript:;">
                <div class="weui-cell__hd gift"></div>
                <div class="weui-cell__bd">
                    <p>礼品卡</p>
                </div>
                <div class="weui-cell__ft">购买礼品卡</div>
            </a>
            </router-link>
        </div>
        <div class="js_dialog" id="iosDialog2" v-bind:class="{startstatue: startstatue}" style="display: none;">
            <div class="weui-mask" @click="startstatue=false"></div>
            <div class="weui-dialog" v-show="startstatue">
            	<p>请选择就餐形式</p>
               <div class="weui-dialog__ft take-out" align="left" @click="removeSession">
                   	<router-link to="/goods">
                    	<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">
							<span class="pc-take-out"></span>
                    			外卖
                    		<span>进入选择配送门店</span>
                    	</a>
                    </router-link>
                </div>
                <div class="weui-dialog__ft eat-in" align="left" @click="removeSession">
                    <router-link to="/goods">
	                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">
	                    	<span class="pc-eat-in"></span>
	                    		堂食
	                    	<span>扫桌号二维码开始点菜</span>
	                    </a>
                    </router-link>
                </div>
                 <div class="weui-dialog__ft eat-in" align="left" @click="packageDish">
                    <router-link to="/packages" style = 'margin-top: -15px !important;'>
                      <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">
                        <span class="pc-eat-in"></span>
                          套餐
                        <span>扫桌号二维码开始点菜</span>
                      </a>
                    </router-link>
                </div>
            </div>
        </div>
 </div>
</template>
<script type="text/javascript">
import axios from 'axios';
import VueRouter from 'vue-router'; // by wangl
const router = new VueRouter(); // by wangl
export default {
    data() {
      return {
        startstatue: false
        // tablenum: window.localStorage.getItem('tablenum'),
        // orderDetailShow: window.localStorage.getItem('orderId'),
        // cancelDetail: true,
        // desc: '',
      };
    },
    computed: {},
    created() {
    // 使用 afterEach 钩子函数，保证路由已经跳转成功之后修改 title by wangl
    // 待测试：https://segmentfault.com/a/1190000011066120?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly
    // vue2.0 项目开发小结
    // router.afterEach((route) => {
    //   let documentTitle = 'xxx商城会员平台';
    //   route.matched.forEach((path) => {
    //     if (path.meta.title) {
    //       documentTitle += ` - ${path.meta.title}`;
    //     }
    //   });

    },
    beforeMount() {
      var restUrl = 'http://www.xiucan.com/api/v2/getstoreinfo/' + this.$root.urlParam.token;
      // var restUrl = 'static/homedata.json';
      axios.get(restUrl).then((res) => {
        document.title = res.data.name;
        this.$root.storeinfo = res.data;
        if (this.$root.storeinfo.startPage !== '') {
          router.push(this.$root.storeinfo.startPage);
        }
        console.log('home.res=' + JSON.stringify(res.data));
      }).catch(function (error) {
        console.log(error);
      });
    },
    mounted() {},
    methods: {
		toMember() {
			// console.log('toMember');
   //    var self = this;
			// var resultUrl = 'http://ceshi.xiucan.com/api/web/v2/memberrecord?cid=825&openid=' + self.$root.platformId;
			// // var cid = 1;
			// axios.get(resultUrl, {
			// 	params: {},
   //      headers: {'Authorization': 'Bearer 123456'}
			// }).then((response) => {
			// 	console.log('status' + response.status);
			// 	var data = JSON.parse(response.data);
			// 	if (response.status === 200 && data.status === 200) {
			// 		console.log(response);
			// 	} else if (response.status === 200 && data.status === 404) {
			// 		var config = data.card;
   //        console.log(config.url);
   //        window.location.href = config.url;
			// 	} else {
   //          alert(data);
   //      }
			// });
		},
      packageDish() {
        // window.localStorage.setItem('handleType', 'selectPackage');
        window.sessionStorage.setItem('handleType', 'selectPackage');
        console.log('handleType=' + window.sessionStorage.getItem('handleType'));
      },
      removeSession() {
        window.sessionStorage.removeItem('handleType');
      }
//		startGoDish() {
//			this.startstatue = true;
//		},
//		closeDish() {
//			this.startstatue = false;
//		},
	},
    components: {}
};
</script>
<style type="text/css">
.weui-cell__ft {
  font-size: 13px;
}
.banner { /*by wangl*/
    position: relative;
    top: -68px;
}
.startstatue {
/*opacity: 1 !important;*/
display: block !important;
}
.weui-btn_primary {
	background-color: #00A0DC;
}
	.slide{
    position: relative;
    max-width: 640px;
    overflow: hidden;
    margin: 0px auto;
}
.slide:after{
    content: '';
    display: block;
    width: 100%;
    padding-top: 50%;
}
.slide ul{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.slide li{
    list-style: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.slide li:first-child{
    z-index: 1;
}
.slide li img{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
}
.slide .slide-desc {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;overflow: hidden;
  padding: 5px;
  width: 100%;
  color: #fff;
  font-size: 16px;
  text-align: center;white-space: nowrap;word-break: break-all; text-overflow: ellipsis; }
.slide .dot{
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 5;
    font-size: 0;
}
#slide2 .dot{
    position: absolute;
    right:50%;
    bottom: 10px;
    z-index: 5;
    font-size: 0;text-align: center;
   margin:0 auto;
}
.slide .dot span{
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-left: 5px;
    border: 1px solid #fff;
    border-radius: 50%;
}
.slide .dot .cur{
    background-color:#04BE02;border: 1px solid #04BE02;
}
.slide .txt{overflow: hidden;text-align:center;font-size:16px; white-space: nowrap;word-break: break-all; text-overflow: ellipsis;}
.slideIn{-webkit-animation:a .2s forwards;animation:a .2s forwards}
.slideOut{-webkit-animation:b .2s forwards;animation:b .2s forwards}
.weui-slider {
  padding: 15px 18px;
  -webkit-user-select: none;
          user-select: none;
}
.weui-slider-inner {
  position: relative;
  height: 2px;
  background-color: #E9E9E9;
}
.weui-slider-track {
  height: 2px;
  background-color: #1AAD19;
  width: 0;
}
.weui-slider-handler {
  position: absolute;
  left: 0;
  top: 50%;
  width: 28px;
  height: 28px;
  margin-left: -14px;
  margin-top: -14px;
  border-radius: 50%;
  background-color: #FFFFFF;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
.weui-slider-box {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
          align-items: center;
}
.weui-slider-box .weui-slider {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
          flex: 1;
}
.weui-slider-box-value {
  margin-left: .5em;
  min-width: 24px;
  color: #888888;
  text-align: center;
  font-size: 14px;
}
.weui-badge {
  display: inline-block;
  padding: .15em .4em;
  min-width: 8px;
  border-radius: 18px;
  background-color: #E64340;
  color: #FFFFFF;
  line-height: 1.2;
  text-align: center;
  font-size: 12px;
  vertical-align: middle;
}
.weui-badge-dot {
  padding: .4em;
  min-width: 0;
}
.slidelefts {
  height: 100%;
  position: relative;
  background-color: #fff;
  transform: translateZ(0);border-bottom: 1px solid  #eee;
  -webkit-transform: translateZ(0);padding:0;
}
.slidelefts .weui_cell_bd {
  height: auto;
  overflow: hidden;
  position: relative;
  z-index: 10;
  background-color: #fff;
  padding: 10px 15px;
}
.weui_cell .weui_cell_bd.animated {
  -webkit-transition: -webkit-transform .2s ease-out;
  transition: transform .2s ease-out;
}
.weui_cell .slideleft {
  height: 100%;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
}
.weui_cell .slideleft span {
  height: 100%;
  padding: 0 10px;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
.homeList {
  height: 66px;
  border-bottom: 1px solid #EEE;
}
													/*by shaomeng*/
.weui-dialog__ft:after{
	content: none;
}
.weui-dialog p{		/*请选择就餐形式*/
	height: 40px;
	line-height: 40px;
	color: #000000;
	background: #EEEEEE;
}
.weui-dialog__ft span{
	font-size: 10px;
	color: #333;
	margin-left: 5px;
	vertical-align: middle;
}
/*by wangl 影响人数弹出窗确认按钮*/
/*.weui-dialog__ft .weui-dialog__btn{
	text-align: left;
}*/
.take-out a{
	color: #ff7830;
	width: 90%;
	margin: 0px auto;
	margin-top: 15px;
	border-radius: 5px;
	padding: 0;
}
.take-out .weui-dialog__btn{
	border: 1px solid #ff7830;
}
.take-out .weui-dialog__btn .pc-take-out{		/*外卖图标*/
	width: 30px;
	height: 30px;
	display: inline-block;
	background: url(take-out.png);
	background-size: cover;
	background: ;
	margin-right: 10px;
	margin-left: 20px;
}
.eat-in a{
	color: #00A0DC;
	width: 90%;
	margin: 0 auto;
	/*padding: 0;*/
	margin-top: 10px;
	margin-bottom: 15px;
	border-radius: 5px;
}
.eat-in .weui-dialog__btn{
	border: 1px solid #00A0DC;
}
.eat-in .weui-dialog__btn .pc-eat-in{		/*堂食图标*/
	width: 30px;
	height: 30px;
	display: inline-block;
	background: url(eat-in.png);
	background-size: cover;
	background: ;
	margin-right: 10px;
	margin-left: 20px;
}
.weui-cell .weui-cell__hd{
	background-size: cover;
	width: 30px;
	height: 30px;
	margin-right: 15px;
}
.orders{
	background: url(orders.png);		/*我的订单图标*/
}
.member{
	background: url(member.png);		/*会员卡图标*/
}
.coupons{
	background: url(coupons.png);		/*优惠券图标*/
}
.gift{
	background: url(gift.png);			/*礼品卡图标*/
}
.weui-cells .weui-cell .weui-cell__bd p{
	color: #000000;
}
</style>
