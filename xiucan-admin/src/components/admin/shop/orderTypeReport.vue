<template>
	<div style="width:100%; height:100%; position:absolute">
		<header class="report-header">
			<h3 class="title">点菜情况报表</h3>
		</header>
		<div class="orderC-time">
			<x-button type="primary" plain @click.native="Tstart">{{startTime === '' ? '选择时间' : startTime}}</x-button>
			<x-button type="primary" plain @click.native="seach">搜索</x-button>
		</div>
		<table class="header reporttable" style="z-index:333">
			<thead>
				<tr>
					<td style="width:20%; min-width:41px">订单类型</td>
					<td style="width:20%">订单数</td>
					<td style="width:20%">订单百分比</td>
					<td style="width:20%; min-width:60px">总金额</td>
					<td style="width:20%; min-width:69px">金额百分比</td>
				</tr>
			</thead>
		</table>
		<div class="timewrapper" ref="timeWrapper">
			<table class="body reporttable" ref="commContent">
				<tbody class="content">
					<tr v-for="(item, index) in report"  ref="commaurantItem" :key="index">
						<td style="width:20%; min-width:41px">{{desc(item.type)}}</td>
						<td style="width:20%">{{item.orderNum}}</td>
						<td style="width:20%">{{item.numPercent}}%</td>
						<td style="width:20%; min-width:60px">{{item.sumMouney}}</td>
						<td style="width:20%; min-width:69px">{{item.mouneyPercent}}%</td>
					</tr>
					<tr ref="commaurantItem">
						<td style="width:20%; min-width:41px">总计</td>
						<td style="width:20%">{{sumData.orderNum}}</td>
						<td style="width:20%">{{sumData.numPercent}}%</td>
						<td style="width:20%; min-width:60px">{{sumData.sumMouney}}</td>
						<td style="width:20%; min-width:69px">{{sumData.mouneyPercent}}%</td>
					</tr>
				</tbody>
				<!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
		        <div class="loading" v-show="isShow">更新中</div>	
			</table>
	    </div>
	    <!--BEGIN dialog2-->
        <div class="js_dialog" id="iosDialog2" v-show="warning == 0">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__bd">请选择时间范围</div>
                <div class="weui-dialog__ft">
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="warning = 1">知道了</a>
                </div>
            </div>
        </div>
        <!--END dialog2-->
	</div>
</template>
<script type="text/javascript">
import BScroll from 'better-scroll';
import axios from 'axios';
import { DatetimeView, XButton, Popup, TransferDom, Datetime, Group } from 'vux';
export default{
	data() {
		return {
		report: [],
		orderdetail: [],
		commScroll: null,
		startTime: '',
		endTime: '',
		isShow: false,
		warning: 1,
		sumData: {
			orderNum: 0,
			numPercent: 0,
			sumMouney: 0,
			mouneyPercent: 0
		}
      };
	},
	activated() {
		this.initCountscroll();
		this.commScroll = new BScroll(this.$refs.timeWrapper, {
			probeType: 3,
			click: true,
			pullUpLoad: {
				// 配置上拉加载
				threshold: -30 //  上啦80px的时候加载
			},
			mouseWheel: {
				// pc端同样能滑动
				speed: 20,
				invert: false
			},
			useTransition: false // 防止iphone微信滑动卡顿
		});
		this._initScroll();
			this.commScroll.on('pullingDown', () => {
			this.isShow = true;
			this.loadingData();
		});
		this.commScroll.on('pullingUp', () => {
			this.isShow = true;
			this.loadingData();
			setTimeout(() => {
				this.$nextTick(() => {
					this.isShow = false;
					this.commScroll.finishPullUp();
					this.commScroll.refresh();
				});
			}, 1000);
		});
	},
	directives: {
		TransferDom
	},
	methods: {
		desc(type) {
			switch (type) {
				case 0: return '全部';
				case 10: return '堂食';
				case 20: return '堂食打包';
				case 30: return '外卖';
				case 40: return '预约';
				case 50: return '自提';
			}
		},
		initCountscroll() {
			if (this.$refs.commaurantItem instanceof Array) {
				var height = 0;
				this.$refs.commaurantItem.forEach((item) => {
					height += item.offestHeight;
				});
				console.log(height);
				this.$refs.commContent.style.minHeight = height + 'px';
				this.$refs.timeWrapper.style.height = height - 1 + 'px';
			} else {
				this.$refs.commContent.style.minHeight = this.report.length * 30 + 'px';
				this.$refs.timeWrapper.style.height = this.report.length * 30 - 1 + 'px';
			}
		},
		warningicon() {
			this.warning = 0;
			setTimeout(() => {
				this.warning = 1;
			}, 1500);
		},
		_initScroll() {
			// 上拉加载数据
			this.commScroll.on('pullingUp', () => {
				this.scrollFinish = false;
				// 防止一次上拉触发两次事件,不要在ajax的请求数据完成事件中调用下面的finish方法,否则有可能一次上拉触发两次上拉事件
				this.commScroll.finishPullUp();
				// 加载数据
				// this.getIncomeDetail(this.nextPage);
			});
			this.commScroll.on('scroll', (pos) => {
				// console.log(pos.x + '~' + pos.y)
			});
		},
		seach () {
			console.log('查询');
			var startdate = new Date(this.startTime);
			var endTime = new Date(this.endTime);
			// this.reportClone = this.report.filter((item) => {
			// 	if (item.orderTime >= startdate && item.endTime <= endTime) {
			// 		return item;
			// 	}
			// });
			if (this.startTime === '' || this.endTime === '' || new Date(this.startTime).valueOf() > new Date(this.endTime).valueOf()) {
				this.warningicon();
				return;
			}
			this.loadingData();
		},
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
		initReportlist() { // 初始化数组
			var reportList = [];
			var reportItem = {};
			for (var i = 10; i < 60; i += 10) {		// 目前写死订单类型，待优化
				reportItem.type = i;
				reportItem.numPercent = 0;
				reportItem.orderNum = 0;
				reportItem.sumMouney = 0;
				reportItem.mouneyPercent = 0;
				reportList.push(JSON.parse(JSON.stringify(reportItem)));
			}
			// console.log('initReportlist+' + reportList);
			return reportList;
		},
		allOrder() {
			this.sumData = {
				type: 'sum',
				orderNum: 0,
				numPercent: 0,
				sumMouney: 0,
				mouneyPercent: 0
			};
			this.sumData.orderNum += this.orderdetail.length;
			var sumMouney = 0;
			this.orderdetail.forEach((item, index) => {
				console.log('过滤操作：' + JSON.stringify(item));
				sumMouney += item.dishinfo.map((dish, dishindex) => {
						return (parseFloat(dish.price) * dish.num);
					})[item.dishinfo.length - 1];
			});
			this.sumData.sumMouney = sumMouney;
			this.sumData.numPercent = 100;
			this.sumData.mouneyPercent = 100;
			console.log('allOrder' + this.sumData);
		},
		chooseData() {		// 动态过滤并归类orderdetail数据
			console.log('动态归类数据');
			this.report = this.initReportlist();
			this.allOrder(); // 获取总数量
			var n = 0;
			this.orderdetail.forEach((item, index) => {
				switch (item.type) {
					case 10: this.report.splice(0, 1, this.addReportItem(item, 0)); break;
					case 20: this.report.splice(1, 1, this.addReportItem(item, 1)); break;
					case 30: this.report.splice(2, 1, this.addReportItem(item, 2)); break;
					case 40: this.report.splice(3, 1, this.addReportItem(item, 3)); break;
					case 50: this.report.splice(4, 1, this.addReportItem(item, 4)); break;
				}
			});
			console.log('chooseData=' + this.report);
			this.$nextTick(() => {
				this.initCountscroll();
			});
		},
		addReportItem (item, type) {
			var reportItem = {};
				if (JSON.stringify(this.report[type]) === '{}') {
					reportItem = {
						type: item.type,
						orderNum: 0,
						numPercent: 0,
						sumMouney: 0,
						mouneyPercent: 0
					};
				} else {
					reportItem = {
						type: item.type,
						orderNum: this.report[type].orderNum,
						numPercent: this.report[type].numPercent,
						sumMouney: this.report[type].sumMouney,
						mouneyPercent: this.report[type].mouneyPercent
					};
				}
			reportItem.orderNum += 1;
			reportItem.sumMouney += item.dishinfo.map((dish, index) => {
				return (parseFloat(dish.price) * dish.num);
			})[item.dishinfo.length - 1];
			reportItem.numPercent = (reportItem.orderNum * 100 / this.sumData.orderNum).toFixed(1);
			reportItem.mouneyPercent = (reportItem.sumMouney * 100 / this.sumData.sumMouney).toFixed(1);
			console.log('addReportItem' + JSON.stringify(reportItem));
			return reportItem;
		},
		loadingData() {			// 发起异步请求
			var url = 'http://www.xiucan.com/api/v2/orderdetail';
			var data = {
				cid: this.$route.params.cid,
				starttime: parseInt(new Date(this.startTime).valueOf() / 1000),
				endtime: parseInt(new Date(this.endTime).valueOf() / 1000)
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
			// 	console.log(res.data);
			// 	if (res.data.state !== 1) {
			// 		return;
			// 	}
			// 	console.log('----');
			// 	this.orderdetail = res.data.results;
			// 	this.chooseData();
			// }).catch(() => {
			// 	console.log('数据请求失败');
			// });
			// 请求本地数据 end
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
	.timewrapper{
		max-height: 80%;
	}
	.report-header{
		height: 7%;
		width: 100%;
		background: #00a0dc;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 333;
		position: relative;
	}
	.report-header .title{
		text-align: center;
		font-size: 17px;
		color: #fff;
		line-height: 50px;
	}
	.reporttable{
		width: 100%;
		text-align: center;
		line-height: 29px;
		font-size: 12px;
	    height: 6%;
	}
	.header thead tr{
		background-color: #00a0dc;
		color: #fff;
	}
	.header thead tr td{
		border-right: 1px solid #909090;
	}
	.header thead tr td:last-child{
		border-right:0;
	}
	.body tr td{
		border:1px solid #909090;
		border-top: 0px;
	}
	.orderC-time{
		display: flex;
		justify-content:center;
		align-items:center;
	    height: 7%;
	    min-height: 40px;
	    z-index: 333;
	    background-color: #eeeeee;
	    position: relative;
	}
	.orderC-time button{
		width: 90px !important;
	    height: 36px;
	    line-height: 34px;
	    font-size: 12px;
	    padding: 0px;
	    display: inline-block;
	    border-color: #fff;
	    background-color: #fff !important;
	    color: #695959;
	    margin-top: 0px !important;
	}
	.orderC-time button:first-child{
		width: 200px !important;
	}
	.timewrapper .loading{
	    position: fixed;
	    bottom: 0;
	    width: 80px;
	    height: 30px;
	    line-height: 30px;
	    text-align: center;
	    background-color: #5d5d5d;
	    color: #fff;
	    opacity: 0.6;
	    margin: 0 auto;
	    left: 50%;
	    margin-left: -40px;
	}
</style>