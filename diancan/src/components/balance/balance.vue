<template>
	<div class="balance">
		<div class="balanceNow">
			<div class="balance_num">
				<span>{{ $t('lang.currentBalance') }}</span><!-- 当前余额 -->
				<span>{{balance.balance}}{{ $t('lang.yuan') }}</span>
			</div>
			<!--<div class="balance_description">
				<p>积分规则</p>
				<p>积分清零</p>
			</div>-->
		</div>
		<ul>
			<li v-for="(item,index) in balance" v-if="item.add_balance">
				<div class="left">
					<p>{{item.add_balance | addOrSubtractText}}</p>
					<p style="font-size: 14px; color: #A3A3A3;">{{item.time | toTime}}</p>
				</div>
				<div class="right">
					{{item.add_balance | addOrSubtractNum}}{{ $t('lang.yuan') }}
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import axios from 'axios';
	export default{
		data() {
			return {
				balance: [
//					{
//						'id': 1,
//						'code': 763881235254,
//						'card_id': 'pWeqBtxhjREKtcLzl8t34HwtkKes',
//						'background_pic_url': 123,
//						'add_bonus': 1,
//						'record_bonus': '消费0.01元，获得1积分',
//						'add_balance': 0.01,
//						'record_balance': '持白金会员卡到店消费，可享8折优惠',
//						'custom_field_value1': 0.13,
//						'openid': 'oWeqBtwAGJnh83nt938j-5MdNhPs'
//					},
//					{
//						'id': 1,
//						'code': 763881235254,
//						'card_id': 'pWeqBtxhjREKtcLzl8t34HwtkKes',
//						'background_pic_url': 123,
//						'add_bonus': 1,
//						'record_bonus': '消费0.01元，获得1积分',
//						'add_balance': 0.02,
//						'record_balance': '持白金会员卡到店消费，可享8折优惠',
//						'custom_field_value1': 0.13,
//						'openid': 'oWeqBtwAGJnh83nt938j-5MdNhPs'
//					}
				]
			};
		},
		created() {},
		mounted() {
			var encryptcode = this.$root.urlParam.encrypt_code;
			// var openid = this.getQueryString('openid');
			encryptcode = encodeURI(encryptcode).replace(/\+/g, '%2B');
			var self = this;
			var resUrl = 'http://ceshi.xiucan.com/api/web/v2/memberrecord?encrypt_code=' + encryptcode;
			axios.get(resUrl, {
				headers: {'Authorization': 'Bearer 123456'}
			}).then((res) => {
				var data = JSON.parse(res.data);
				// window.alert(data);
				console.log(data);
				var dataRes = data.data;
				console.log(dataRes);
				self.balance = dataRes;
			});
		},
		methods: {},
		filters: {
			addOrSubtractText: function (value) {
				return value > 0 ? this.$t('lang.recharge') : this.$t('lang.consumption'); // 充值  消费
			},
			addOrSubtractNum: function (value) {
				return value > 0 ? '+' + value : value;
			},
			toTime(time) {
				return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
			}
		}
	};
</script>

<style scoped="scoped">
	.balance{
		width: 100%;
		background: white;
		position: absolute;
    	top: 0px;
	}
	.balanceNow{
		width: 90%;
		margin: 0 auto;
		height: 80px;
		/*background: lavender;*/
		border-bottom: 1px solid lightgray;
	}
	.balance_num{
		height: 80px;
		/*background: lemonchiffon;*/
		line-height: 80px;
	}
	.balance_num span:first-child{
		float: left;
	}
	.balance_num span:last-child{
		float: right;
		font-size: 25px;
	}
	.balance_description{
		line-height: 25px;
		font-size: 14px;
		color: #A3A3A3;
	}
	.balance li{
		width: 90%;
		margin: 0 auto;
		height: 60px;
		/*background: lightcoral;*/
		border-bottom: 1px solid lightgray;
	}
	.balance li .left{
		float: left;
		line-height: 30px;
	}
	.balance li .right{
		float: right;
		line-height: 60px;
		color: #737373;
	}
</style>