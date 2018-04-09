<template>
	<div class="weui-tab couponsTab">
        <div class="weui-navbar" style="">
        	<div v-for="(item, index) in items" v-on:click="tab(index)" class="weui-navbar__item" v-bind:class="{'weui-bar__item_on': activeIndex === index}">
        		{{item.title}}
        	</div>
        </div>
        <div class="weui-tab__panel">
			<div class="myCardList" v-show="activeIndex === 0">
				<p align="center" style="font-size:14px; color:#757575">{{ $t('lang.allCoupons')} }</p>  <!--全部优惠券-->
				<ul>
					<li v-for="(item,index) in cardsList" v-if="item.status === 1">
						<div class="top">
							<div class="left">
								¥<span class="">{{item.reduce_cost}}</span>.00
							</div><div class="right">
								<p class="first">{{item.title}}</p>
								<p class="second">{{ $t('lang.full') }}<span style="color:red">{{item.least_cost}}</span>{{ $t('lang.available') }}</p> <!--可用-->
								<p class="third">{{item.begin_timestamp | toTime}}-{{item.end_timestamp | toTime}}</p>
							</div>
							<div class="top-left"></div>
							<div class="top-right"></div>
						</div>
						<div class="bottom">
							{{ $t('lang.useImmediately') }}   <!--立即使用-->
						</div>
					</li>
				</ul>
			</div>
			<div class="used" v-show="activeIndex === 1">
				<p align="center" style="font-size:14px; color:#757575">{{ $t('lang.CouponsHaveBeenUsed')}}</p>  <!-- 已使用优惠券 -->
				<li v-for="(item,index) in cardsList" v-if="item.status === 0">
						<div class="top">
							<div class="left">
								¥<span class="">{{item.reduce_cost}}</span>.00
							</div><div class="right">
								<p class="first">{{item.title}}</p>
								<p class="second">{{ $t('lang.full') }}<span style="color:red">{{item.least_cost}}</span>{{ $t('lang.available') }}</p>
								<p class="third">{{item.begin_timestamp | toTime}}-{{item.end_timestamp | toTime}}</p>
							</div>
							<div class="top-left"></div>
							<div class="top-right"></div>
						</div>
						<div class="bottom">
							{{ $t('lang.useImmediately') }}   <!--立即使用-->
						</div>
					</li>
			</div>
			<div class="expired" v-show="activeIndex === 2">
				<p align="center" style="font-size:14px; color:#757575">{{ $t('lang.expiredCoupons') }}</p>  <!-- 已过期优惠券 -->
				<li v-for="(item,index) in cardsList" v-if="item.status === -1">
						<div class="top">
							<div class="left">
								¥<span class="">{{item.reduce_cost}}</span>.00
							</div><div class="right">
								<p class="first">{{item.title}}</p>
								<p class="second">{{ $t('lang.full') }}<span style="color:red">{{item.least_cost}}</span>{{ $t('lang.available') }}</p>
								<p class="third">{{item.begin_timestamp | toTime}}-{{item.end_timestamp | toTime}}</p>
							</div>
							<div class="top-left"></div>
							<div class="top-right"></div>
						</div>
						<div class="bottom">
							{{ $t('lang.useImmediately') }}   <!--立即使用-->
						</div>
					</li>
			</div>
        </div>
	</div>
</template>
<script type="text/javascript">
	import axios from 'axios';
	export default {
		data() {
			return {
				activeIndex: 0,
				items: [
					{title: this.$t('lang.myCoupons'), content: this.$t('lang.allCoupons')},		// 我的券 全部优惠券
					{title: this.$t('lang.used'), content: this.$t('lang.CouponsHaveBeenUsed')},    // 已使用 已使用优惠券
					{title: this.$t('lang.expired'), content: this.$t('lang.expiredCoupons')}       // 已过期 已过期优惠券
                    ],
				cardsList: [
//					{
//						card_type: 'CASH',
//						cardId: 'pREW7s3FFmFUIWamKENgYkmUh8fc',
//						code: '444455556666',
//						least_cost: 20,
//						reduce_cost: 3,
//						begin_timestamp: '2017.07.01',
//						end_timestamp: '2017.08.20',
//						description: '全场通用'
//					}
				]
			};
		},
		mounted() {
			// var cardId = this.getQueryString('card_id'); // this.$root.urlparam.card_id;
			// var openid = this.getQueryString('openid');
			var resUrl = 'http://ceshi.xiucan.com/api/web/v2/couponrecord?openid=' + this.$root.platformId;
			var self = this;
			axios.get(resUrl, {
				headers: {'Authorization': 'Bearer 123456'}
			}).then((res) => {
				// console.log('res=' + JSON.stringify(res.data));
				self.cardsList = res.data;
			});
		},
		methods: {
			tab(index) {
                this.activeIndex = index;
            }
		},
		filters: {
			toTime(time) {
				return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
			}
		}
	};
</script>
<style type="text/css" scoped="scoped">
.couponsTab {
    background-color: #EEEEEE;
    top: -67px;
}
.myCardList li{
	margin: 10px auto;
	overflow: hidden;width: 90%;
}
.top{
	width: 100%;
	height: 75px;
	background: #FFFFFF;
	margin: 0 auto;
	border-bottom: 1px dashed lightslategray;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
}
.left{
	display: inline-block;
	width: 40%;
	height: 70px;
	margin: 0 auto;
	text-align: center;
	line-height: 70px;
	vertical-align: top;
	color: red;
}
.left span{
	font-size: 40px;
}
.top .top-left{
	width: 20px;
	height: 20px;
	background: #eeeeee;
	border-radius: 20px;
	float: left;
	vertical-align: bottom;
	position: relative;
	top: -7px;
	left: -10px;
}
.top .top-right{
	width: 20px;
	height: 20px;
	background: #eeeeee;
	border-radius: 20px;
	float: right;
	vertical-align: bottom;
	position: relative;
	top: -7px;
	left: 10px;
}
.right{
	display: inline-block;
	width: 60%;
	height: 70px;
	line-height: 19px;
}
.first{
	font-size: 16px;
	margin-top: 10px;
	color: #000000;
}
.second{
	font-size: 12px;
}
.third{
	font-size: 10px;
}
.bottom{
	margin-top: 1px !important;
	width: 100%;
	height: 30px;
	margin: 0 auto;
	color: #00A0DC;
	background: #FFFFFF;
	text-align: center;
	line-height: 30px;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
