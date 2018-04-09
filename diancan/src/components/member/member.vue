<template>
	<div class="memberCard">
		<div class="memberCardPic">
			pic
		</div>
		<div class="memberCardBtn">
			<ul>
				<router-link to="/bonus">
				<li>
					{{ $t('lang.integral')}}<br>
					<span>{{data.bonus}}</span>
				</li></router-link><router-link to="/memberBalance"><li>
					{{ $t('lang.myBalance')}}<br><!-- 我的余额 -->
					<span>{{data.balance}}</span>
				</li></router-link><router-link to="/coupons"><li>
					{{ $t('lang.coupons')}}<br><!-- 优惠券 -->
					<span>{{ $t('lang.find') }}</span>
				</li></router-link>
			</ul>
			<router-link to="/pay"><button class="toPayFor">{{ $t('lang.goPay') }}!</button></router-link>
			<p class="preferential">{{ $t(lang.lotOfConcessions) }}!</p><!-- 优惠多多 -->
		</div>
		<div style="width: 100%; border-bottom: 1px solid #e4e2e2;"></div>
		<div class="memberCardDetails">
			<ul>
				<li style="color:#333" @click="pay">
					{{ $t('lang.recharge') }}<!-- 充值 -->
					<span>{{ $t('lang.goRecharge') }}</span><!-- 去充值 -->
				</li>
				<router-link to="/recharge"><li>{{ $t('lang.membershipCardDetails') }}</li></router-link><!-- 会员卡详情 -->
				<li>{{ $t('lang.publicNumber') }}</li><!-- 公众号 -->
			</ul>
		</div>
	</div>
	<!-- <div class="content">
		<div class="contentMain">
			<div class="contentMainHeader">
				<div class="contentMainHeaderPic">
					<div></div>
					<p>dsggsgfsg</p>
				</div>
				<div class="contentMainHeaderCode"></div>
			</div>
			<div class="contentMainBanner"></div>
			<div></div>
		</div>
		<div class="contentBalance"></div>
	</div> -->
</template>
<script type="text/javascript">
import axios from 'axios';
	export default {
		data() {
			return {
				data: [],
				cid: 0,
				openid: 0
			};
		},
		created() {
			// this.cid = this.$root.urlParam.state.replace(/[^0-9]/ig, ''); // 获取state转换，赋予变量cid
			// this.openid = sessionStorage.getItem('openid');
			// var openid = this.$root.platformId === '' || this.$root.platformId === null ? this.openid : this.$root.platformId;
			// var resultUrl = 'http://ceshi.xiucan.com/api/web/v2/memberrecord?cid=' + this.cid + '&openid=' + openid;
			var resultUrl = 'http://ceshi.xiucan.com/api/web/v2/memberrecord?cid=' + this.$root.storeinfo.cid + '&openid=' + this.$root.platformId;
			// var resultUrl = 'http://ceshi.xiucan.com/api/web/v2/memberrecord?cid=825' + '&openid=oWeqBt5TPvhsm1RrEt4dXTfxmwa8';
			// console.log(resultUrl);
			// alert(resultUrl);
			axios.get(resultUrl, {
				params: {},
				headers: {'Authorization': 'Bearer 123456'}
			}).then((response) => {
				console.log('status' + response.status);
				// alert('status' + response.status);
				var data = JSON.parse(response.data);
				if (response.status === 200 && data.status === 200) {
					// console.log(response);
					// alert('response' + response.status + 'data' + data.status);
					this.data = data.data;
					this.$root.balanceData = data.data;
				} else if (response.status === 200 && data.status === 404) {
					var config = data.card;
					// console.log(config.url);
					// alert(config.url);
					window.location.href = config.url;
				} else {
					alert(data);
				}
			});
		},
		methods: {
			pay() {
				sessionStorage.setItem('openid', this.$root.platformId);
				// alert('sessionStorageopenid=' + sessionStorage.getItem('openid'));
				window.location.href = 'http://ceshi.xiucan.com/view/index.html';
			}
		}
	};
</script>
<style type="text/css" scoped="scoped">
.memberCard{
	position: relative;
	top: -68px;
	background: #eeeeee;
	padding-top: 30px;
}
.memberCardPic{
	height: 150px;
	width: 300px;
	border: 1px solid #e4e2e2;
	border-radius: 15px;
	margin: 0 auto;
	background: url(memberCard.jpg);
	background-size: cover;
}
.memberCardBtn{
	width: 100%;
	margin: 20px 0;
	text-align: center;
}
.memberCardBtn ul li{
	text-align: center;
	width: 33.3%;
	display: inline-block;
	height: 50px;
	line-height: 25px;
	font-size: 13px;
}
.memberCardBtn ul li span{
	color: #396ed4;
	font-size: 20px;
}
.memberCardBtn .toPayFor{ /*去买单*/
	width: 40%;
	height: 40px;
	margin-top: 20px;
	border: 1px solid #396ed4;
	border-radius: 5px;
	outline: none;
	background: #eeeeee;
}
.memberCardBtn .preferential{ /*优惠多多*/
	font-size: 13px;
	margin-top: 10px;
	color: #7a7878;
}
.memberCardDetails ul li{
	border-bottom: 1px solid #dddddd;
	width: 90%;
	height: 50px;
	line-height: 50px;
	margin: 0 auto;
}
.memberCardDetails ul li span{ /*去充值*/
	float: right;
	font-size: 13px;
	color: #7a7878;
} 
/*second    ******************************/
/*.content{
	
}
.content .contentMain{
	background: #fff;
	width: 90%;
	padding: 15px 0;
	margin: 0 auto;
}
.content .contentMainHeader .contentMainHeaderPic{
	width: 50%;
	text-align: center;
}
.content .contentMainHeader .contentMainHeaderPic div{
	width: 50px;
	height: 50px;
	border: 1px solid #000;
	border-radius: 50px;
	margin: 0 auto;
}*/
</style>
