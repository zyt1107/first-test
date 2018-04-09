<template>
	<div class="balance">
		<div class="balanceNow">
			<div class="balance_num">
				<span>当前余额</span>
				<span>{{balance.balance}}元</span>
			</div>
		</div>
		<ul>
			<li v-for="(item,index) in balance" v-if="item.add_balance">
				<div class="left">
					<p>{{item.add_balance | addOrSubtractText}}</p>
					<p style="font-size: 14px; color: #A3A3A3;">{{item.time | toTime}}</p>
				</div>
				<div class="right">
					{{item.add_balance | addOrSubtractNum}}元
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
				balance: []
			};
		},
		created() {
			this.balance = this.$root.balanceData;
		},
		methods: {},
		filters: {
			addOrSubtractText: function (value) {
				return value > 0 ? '充值' : '消费';
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