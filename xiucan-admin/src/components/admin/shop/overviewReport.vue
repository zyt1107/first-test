<template>
	<div class="overview">
		<header>
			<div class="title">经营数据</div>
			<div class="body">
				<div class="sumMouney" ref = "sumMouneyB">
					<p>总收入</p>
					<p @click="Tstart">2018-4-4<span style="transform:rotate(90deg); display:inline-block"><i class="iconfont">&#xe646;</i></span></p>
					<p>￥{{reportData.todayIncome}}</p>
				</div>
			</div>
			<div class="footer">
				<div class="zhifu">
					<p>现金支付</p>
					<p>{{reportData.cash}}</p>
				</div>
				<div class="zhifu">
					<p>微信支付</p>
					<p>{{reportData.weixin}}</p>
				</div>
				<div class="zhifu">
					<p>支付宝支付</p>
					<p>{{reportData.zhifubao}}</p>
				</div>
			</div>
		</header>
		<section>
			<div class="overview_content">
	          <div class="nav">
	            <span>今日支出</span>
	            <span>{{reportData.todayExpend}}</span>
	          </div>
	          <div class="nav">
	            <span>今日利润</span>
	            <span>{{reportData.todayProfit}}</span>
	          </div>
	          <div class="nav">
	            <span>点餐人数</span>
	            <span>{{reportData.mealNum}}</span>
	          </div>
	          <div class="nav">
	            <span>今日订单</span>
	            <span>{{reportData.todayOrder}}</span>
	          </div>
	          <div class="nav">
	            <span>堂食订单</span>
	            <span>{{reportData.dineOrder}}</span>
	          </div>
	          <div class="nav">
	            <span>外卖订单</span>
	            <span>{{reportData.takeoutOrder}}</span>
	          </div>
	          <div class="nav">
	            <span>在线支付</span>
	            <span>{{reportData.onlineOrder}}</span>
	          </div>
	          <div class="nav">
	            <span>在线微信</span>
	            <span>{{reportData.weixin}}</span>
	          </div>
	          <div class="nav">
	            <span>在线支付宝</span>
	            <span>{{reportData.zhifubao}}</span>
	          </div>
	      </div>
		</section>
	</div>
</template>
<script type="text/javascript">
	import axios from 'axios';
	import { DatetimeView, XButton, Popup, TransferDom, Datetime, Group } from 'vux';
	export default{
		data() {
			return {
				startTime: '',
				endTime: '',
				reportData: {
					todayExpend: 0,
					todayProfit: 0,
					mealNum: 0,
					todayOrder: 0,
					dineOrder: 0,
					takeoutOrder: 0,
					onlineOrder: 0,
					weixin: 0,
					zhifubao: 0,
					todayIncome: 0,
					cash: 0
				},
				orderdetail: []
			};
		},
		activated() {
			this.$refs.sumMouneyB.style.width = this.$refs.sumMouneyB.offsetHeight + 'px';
			console.log(this.$refs.sumMouneyB.offsetWidth);
			this.loadingData();
		},
		methods: {
			Tstart () {
				var self = this;
				this.$vux.datetime.show({
					cancelText: '取消',
					confirmText: '确定',
					format: 'YYYY-MM-DD',
					value: (new Date()).toLocaleDateString().replace(/\//g, '-'),
					onConfirm (val) {
						self.startTime = val;
						self.endTime = new Date(new Date(val).getTime() + 24 * 60 * 60 * 1000 - 1);  // 获取当天24:59:59时间
						self.loadingData();
						console.log('plugin confirm', self.startTime + ' ---  ' + self.endTime);
					},
					onShow () {
						console.log('plugin show');
					},
					onHide () {
						console.log('plugin hide');
					}
				});
			},
			initReportData() {
				this.reportData = {
					todayExpend: 0,
					todayProfit: 0,
					mealNum: 0,
					todayOrder: 0,
					dineOrder: 0,
					takeoutOrder: 0,
					onlineOrder: 0,
					weixin: 0,
					zhifubao: 0,
					todayIncome: 0,
					cash: 0
				};
			},
			chooseData() {
				this.initReportData();
				this.orderdetail.forEach((item, index) => {
					this.reportData.todayExpend = 0;
					item.dishinfo.forEach((item, index) => {
						this.reportData.mealNum += parseFloat(item.num);
						this.reportData.todayIncome += parseFloat(item.price * item.num);
						this.reportData.todayOrder += 1;
						this.reportData.dineOrder += (item.type === 10 ? 1 : 0);
						this.reportData.takeoutOrder += (item.type === 30 ? 1 : 0);
						this.reportData.onlineOrder = 0;  // 无相关字段
						this.reportData.weixin += (item.pay_type === 'weixin' ? 1 : 0);
						this.reportData.zhifubao += (item.pay_type === 'zhifubao' ? 1 : 0);// 该字段暂无
						this.reportData.cash += (item.pay_type === 'cash' ? 1 : 0);// 该字段暂无
					});
					this.reportData.todayProfit = this.reportData.todayIncome - this.reportData.todayExpend;
				});
				console.log(JSON.stringify(this.reportData));
			},
			loadingData() {
				var url = 'http://www.xiucan.com/api/v2/orderdetail';
				var val = new Date((new Date()).toLocaleDateString()).valueOf();
				var data = {
					cid: this.$route.params.cid,
					starttime: parseInt(val / 1000),
					endtime: parseInt(new Date(new Date(new Date(val).getTime() + 24 * 60 * 60 * 1000 - 1)).valueOf() / 1000)
				};
				axios.post(url, data).then((res) => {
					console.log(res.data);
					if (res.data.state !== 1) {
						return;
					}
					this.orderdetail = res.data.results;
					this.chooseData();
				}).catch(() => {
					console.log('数据请求失败');
				});
				// 请求本地数据 start
					// axios.get('static/restaurantorderdata.json').then((res) => {
					// console.log(res.data);
					// if (res.data.state !== 1) {
					// 	return;
					// }
					// this.orderdetail = res.data.results;
					// this.chooseData();
					// }).catch(() => {
					// 	console.log('数据请求失败');
					// });
				// // 请求本地数据 end
				}
		},
		components: {
			DatetimeView,
			XButton,
			Popup,
			Datetime,
			Group
		}
	};
</script>
<style type="text/css">
	.overview{
		position: absolute;
		height: 100%;
		width: 100%;
	}
	.overview header{
		height: 45%;
		background-color: #00a0dc;
		position: relative;
	}
	.overview header .title{
		font-size: 20px;
		color: #fff;
		line-height: 50px;
		text-align: center;
	}
	.overview header .body{
	    height: 100%;
		display: flex;
		justify-content: center;
		margin: 5px 0;
	}
	.overview header .body .sumMouney{
		height: 55%;
		border: 5px solid #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.overview header .body .sumMouney p{
		color: #fff;
		line-height: 20px;
	}
	.overview header .body .sumMouney p:last-child{
		font-size: 20px;
	}
	.overview header .footer{
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		bottom: 0px;
		width: 100%;
	}
	.overview header .footer .zhifu{
		color: #fff;
		text-align: center;
		width: 33.333%
	}
	.overview .overview_content{
	    position: absolute;
	    bottom: 0px;
	    width: 100%;
	    height: 50%;
	    display: flex;
	    flex-wrap: wrap;
	  }
	.overview .overview_content .nav{
	    width: 33.33%;
	    box-sizing: border-box;
	    border: 1px solid #ddd;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    background-color: #fff;
	    justify-content: center;
	  }
	.overview .overview_content .nav span:last-child{
		margin-top: 5px;
		color: #00a0dc;
	}
</style>