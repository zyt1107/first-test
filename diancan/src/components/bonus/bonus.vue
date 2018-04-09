<template>
	<div class="balance">
		<div class="balanceNow">
			<div class="balance_num">
				<span>{{ $t('lang.currentPoints') }}</span><!-- 当前积分 -->
				<span>{{bonus.bonus}}{{ $t('lang.fraction')}} </span><!-- 分 -->
			</div>
			<div class="balance_description">
				<p>{{ $t('lang.pointsRules') }}</p><!-- 积分规则：这里是积分规则 -->
				<p>{{ $t('lang.clearRules') }}</p><!-- 清零规则：这里是积分清零规则 -->
			</div>
		</div>
		<ul>
			<li v-for="(item,index) in bonus" v-if="item.id">
				<div class="left">
					<p>{{item.record_bonus}}</p>
					<p style="font-size: 14px; color: #A3A3A3;">{{item.time | toTime}}</p>
				</div>
				<div class="right">
					{{item.add_bonus | addOrSubtractNum}}
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
				bonus: []
			};
		},
		created() {},
		mounted() {
			this.bonus = this.$root.balanceData;
			// var b = JSON.stringify(this.bonus); // json转换便于观察数据
			// window.alert(b);
			console.log(this.bonus);
		},
		methods: {},
		filters: {
			// addOrSubtractText: function (value) {
			// 	return value > 0 ? '激活' : '消费';
			// },
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
		height: 120px;
		/*background: lavender;*/
		border-bottom: 1px solid lightgray;
	}
	.balance_num{
		height: 60px;
		/*background: lemonchiffon;*/
		line-height: 60px;
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