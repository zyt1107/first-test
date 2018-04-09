<template>
	<div ontouchstart style="background-color: #f8f8f8;">
			<!--头部  star-->
        <header>
            <a onclick="window.history.back()"> <!-- wx.closeWindow()改为window.history.back() -->
                <div class="_left"><img src="Arrow_left_icon.png"></div>
                {{ $T('lang.recharge')}} <!-- 充值 -->
            </a>
        </header>
        <!--头部 end-->
        <div class="banner">
            <div class="slide" id="slide2">
                <ul>
                    <li>
                        <a href="#">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" data-src="http://www.xiucan.com/uploads/W020170228552313737952.jpg" alt="">
                        </a>
                       
                    </li>
                    <li>
                        <a href="#">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" data-src="http://www.xiucan.com/uploads/W020170612516911488521.jpg" alt="">
                        </a>
                        
                    </li>
                    <li>
                        <a href="#">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" data-src="http://www.xiucan.com/uploads/W020160714518675510927.jpg" alt="">
                        </a>
                        
                    </li>
                </ul>
                <div class="dot">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <!-- <img src="http://www.xiucan.com/uploads/W020160714518675510927.jpg" width="100%" height="100%"/> -->
        </div>
        <!--充值列表-->
        <div class="person_wallet_recharge">
            <ul class="ul">
                <li data-price="100">
                    <h2>￥100</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="200">
                    <h2>￥200</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="300">
                    <h2>￥300</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="500">
                    <h2>￥500</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="800">
                    <h2>￥800</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="1000">
                    <h2>￥1000</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="1200">
                   <h2>￥1200</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="1500">
                   <h2>￥1500</h2>
                    <div class="sel" style=""></div>
                </li>
                <li data-price="1800">
                    <h2>￥1800</h2>
                    <div class="sel" style=""></div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <!-- <div class="pic">金额：<input type="text" placeholder="金额必须为100元以上" id="txt" /></div> -->
            <div class="weui-cell" id="totel">
                <div class="weui-cell__hd" style="width:50px; line-height:30px;"><label class="weui-label" style="font-weight:normal;">{{$t('lang.price')}}：</label></div><!-- 金额 -->
                <div class="weui-cell__bd">
                    <input class="weui-input" type="text" id="txt"  placeholder="金额必须为100元以上">
                </div>
            </div>
            <!-- <input type="hidden" id='total_fee' name="total_fee" value=""> -->
            <div class="container button-sp-area">
                <a href="javascript:;" class="weui-btn weui-btn_primary botton" @click="pay" style="background:#1AAD19;">{{$t('lang.IWantToRecharge')}}</a><!-- 我要充值 -->
            </div>
            <div class="agreement"><p style="font-size:14px;">{{ $t('lang.rechargeHints')}}<a style="color:inherit">{{ $t('lang.RechargeAgreement')}}</a></p></div><!-- 《充返活动协议》 -->
        </div>
        <div class="weui_mask_transparent" style="display: none;"></div>
	</div>
</template>
<script src="https://cdn.bootcss.com/jquery/1.8.2/jquery.min.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script type="text/javascript">
	$('#slide2').swipeSlide({
        autoSwipe: true, // 自动切换默认是
        speed: 3000, // 速度默认4000
        continuousScroll: true, // 默认否
        transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)', // 过渡动画linear/ease/ease-in/ease-out/ease-in-out/cubic-bezier
        lazyLoad: true, // 懒加载默认否
        firstCallback: function(i, sum, me) {
                    me.find('.dot').children().first().addClass('cur');
                },
                callback: function(i, sum, me) {
                    me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
                }
    });
</script>
<script type="text/javascript">
	export default {
		data() {
			return {};
		},
		created() {
		var flag = false;
        var openid = '';
        var uniqueId = '';
        var btnflag = true;

        var url = location.href;// 获取当前页面url
        var searchStr = location.search; // 返回url查询部分
        var code = searchStr.split('=');// 对获得的参数字符串按照“=”进行分割
        // console.log("code=" + code);
        var redirectUri = url.split('?')[0];
        // console.log(redirect_uri);
        url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx16aad97fbd90c616&redirect_uri=' + encodeURI(redirectUri) + '&response_type=code&scope=snsapi_base&state=' + code[1] + '#wechat_redirect';
        searchStr = searchStr.substr(1); // 由于searchStr属性值包括“?”，所以除去该字符
        // console.log('searchStr=' + searchStr);
        var searchs = searchStr.split('&'); // 将searchStr字符串分割成数组，数组中的每一个元素为一个参数和参数值
        // console.log('searchs='+ searchs);
        var address = searchs[0].split('='); // 获得第一个参数和值
        // console.log('address=' + address[0]);
        // console.log('address=' + address[1]);
        switch (address[0]) {
            case 'code':
               flag = true;
                $.get('http://ceshi.xiucan.com/baseinfo.php?ceshi=1&code=' + address[1], {}, function(res) {
                    openid = res;
                    // alert(res);
                    uniquId = searchs[1].split('=')[1];
                    console.log(uniqueId);
                });
            break;
         }
         if (!flag) { window.location = url; }
            var a = 100;
            var totalFee = '';
            $('.person_wallet_recharge .ul li').click(function(e) {
                if ($(this).hasClass('current')) {
                    $(this).removeClass('current').children('.sel').hide(0);
                    totalFee = 0;
                } else {
                    $(this).addClass('current').siblings('li').removeClass('current');
                    $(this).children('.sel').show(0).parent().siblings().children('.sel').hide(0);
                    $('#price').text($(this).attr('data-price'));
                    totalFee = $(this).attr('data-price');
                }
            });
		},
		mounted() {},
		methods: {
			pay() {
				var txt = $('#txt').val();
                    var ret = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                    if (txt !== '' && txt !== 0 && ret.test(txt)) {
                            totalFee = txt;
                            $('#price').text(txt);
                    } else {
                         if (!$('.person_wallet_recharge .ul li').hasClass('current')) {
                            $('#totel').addClass('weui-cell_warn');
                            return false;
                        }
                        if (!$('.person_wallet_recharge .ul li').hasClass('current')) {
                            $('#totel').addClass('weui-cell_warn');
                            return false;
                        }
                    }
                    if (btnflag) {
                        btnflag = false;
                        if (totalFee !== 0 && totalFee !== '' && ret.test(totalFee)) {
                            $.ajax({
                                  type: 'POST',
                                  url: 'http://ceshi.xiucan.com/api/web/v2/orderrecord/pay',
                                  data: {'total_fee': totalFee, 'openid': openid, 'unique_id': uniqueId},
                                  headers: { Authorization: 'Bearer  123456' },
                                  success: function (resultStr) {
                                     btnflag = true;
                                        console.log(resultStr);
                                        var resultJson = JSON.parse(resultStr);
                                        if (resultJson.status === 200) {
                                            callpay(resultJson);
                                        } else {
                                            alert(resultStr);
                                        }
                                  },
                                  error: function (xhr) {
                                    console.log(xhr);
                                  }
                                });
                        } else {
                            alert(this.$t('lang.inputPrice'));
                             btnflag = true;
                        }
                    }
			},
			callpay (resultJson) {
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                       'appId': resultJson.data.appId,     // 公众号名称，由商户传入
                       'timeStamp': '' + resultJson.data.timeStamp + '',         // 时间戳，自1970年以来的秒数
                       'nonceStr': resultJson.data.nonceStr, // 随机串
                       'package': resultJson.data.package,
                       'signType': resultJson.data.signType,         // 微信签名方式：
                       'paySign': resultJson.data.paySign // 微信签名
                    },
                    function(res) {
                       if (res.err_msg === 'get_brand_wcpay_request:ok') {
                             window.history.back();
                             wx.closeWindow();
                       }
                    }
                );
            }
		}
	};
</script>
<style type="text/css" scoped="scoped">
	/*@import 'https://res.wx.qq.com/open/libs/weui/1.1.2/weui.css';*/
header{
	background: #1AAD19;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    font-size: 0.9rem;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 97;
}
header a{
	color: #FFFFFF;
}
header ._left {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
}
header ._left img {
    height: 1rem;
    margin: 0.75rem 0 0 0.6rem;
}
.banner{
	width: 100%;
	background:pink;
	margin-top: 2.5rem;
	margin-bottom: 0.5rem;
}
.person_wallet_recharge{
	width: 95%;
	height: auto;
	margin: 0 auto;
	margin-top: -68px;
}
.person_wallet_recharge .ul li{
	float: left;
    width: 27%;
    height: 2.2rem;
    text-align: center;
    border: 1px solid #CCCCCC;
    border-radius: 0.2rem;
    line-height: 2.2rem;
    margin: 0px 1% 0.4rem 4%;
    box-sizing: border-box;
    color: #525252;
    position: relative;
}
.person_wallet_recharge .sel{
	background: url(iconfont-dagouxuanzhong.png);
	background-size: cover;
	height: 1rem;
    width: 1rem;
    position: absolute;
    right: 0;
    bottom: 0;
    display: none;
}
.person_wallet_recharge .ul li.current{
	color: #ff4c4c;
    border: #ff4c4c 1px solid;
}
.person_wallet_recharge .ul li:nth-child(1) .sel{
	display: none;
}
/*.person_wallet_recharge .botton{
	text-align: center;
    background: #19b5ff;
    color: #fff;
    border-radius: 0.2rem;
    line-height: 2.4rem;
    height: 2.4rem;
    width: 91%;
    margin: 0 auto;
    font-size: 0.85rem;
}*/
.person_wallet_recharge .pic{
	background: #FFFFFF;
	padding-left: 3%;
	line-height: 2.2rem;
	height: 2.2rem;
	color: #333333;
    font-size:0.75rem;
    margin-bottom: 0.5rem;
}
.person_wallet_recharge .pic input{
	border: none;
	padding-left: 1%;
	color: #CCCCCC;
	font-size: 0.75rem;
}
.person_wallet_recharge .agreement{
	height: 2rem;
	padding-left: 3%;
	line-height: 2rem;
}
.person_wallet_recharge .agreement p{
	color: #CCCCCC;
}
.nav{
	width:95%;
	height: 1rem;
	margin: 0 auto;
	text-align: center;
}
.nav ul li{
	float: left;
	line-height: 1rem;
	padding: 0px 4%;
	margin: 0px 2% 0px 4%;
	border-right:1px solid #CCCCCC;
}
.f-overlay{
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0,0,0,0.5);
	width: 100%;
	height: 100%;
	z-index: 99;
	display: none;
}
.addvideo{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	background: #FFFFFF;
}
.addvideo h3{
	text-align: center;
	height: 2.2rem;
	line-height: 2.2rem;
	font-size: 1rem;
	margin-bottom: 0.8rem;
}
.addvideo h3 span{
	color: red;
}
.addvideo ul li{
	background: #fff;
    height: 2.2rem;
    line-height: 2.2rem;
    font-size: 0.75rem;
    color: #333;
    text-align: center;
    margin-bottom: 0.8rem;
}
.addvideo ul li a{
	width: 90%;
	border: 1px solid red;
	display: block;
	margin: 0 auto;
	border-radius: 0.5rem;
	color: red;
}
.addvideo ul li.cal{
	width: 90%;
}
.layui-m-layer0 .layui-m-layerchild{
	width: 30% !important;
}
.layui-m-layercont{
	padding: 10px 20px !important;
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
</style>