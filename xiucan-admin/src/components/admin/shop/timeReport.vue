<template>
	<div style="width:100%; height:100%; position:absolute">
		<header class="report-header">
			<h3 class="title">经营时间段报表</h3>
		</header>
		<div class="Treport-time">
			<x-button type="primary" plain @click.native="Tstart">{{startTime === '' ? '选择时间' : startTime}}</x-button>
			<span>至</span>
			<x-button type="primary" plain @click.native="Tend">{{endTime === '' ? '选择时间' : endTime}}</x-button>
			<x-button type="primary" plain @click.native="seach">搜索</x-button>
		</div>
		<table class="header reporttable" style="z-index:333">
			<thead>
				<tr>
					<td style="width:10%; min-width:41px">日期</td>
					<td style="width:28%">订单数</td>
					<td style="width:20%">到店</td>
					<td style="width:18%; min-width:69px">人数</td>
					<td style="width:15%; min-width:60px">总金额</td>
				</tr>
			</thead>
		</table>
		<div class="timewrapper" ref="timeWrapper">
			<table class="body reporttable" ref="commContent">
				<tbody class="content">
					<tr v-for="(item, index) in report"  ref="commaurantItem" :key="index">
						<td style="width:10%; min-width:41px">{{item.time}}</td>
						<td style="width:28%">{{item.orderNum}}</td>
						<td style="width:20%">{{item.comeStore}}</td>
						<td style="width:18%; min-width:69px">{{item.peopleNum}}</td>
						<td style="width:15%; min-width:60px">{{item.sumMouney}}</td>
					</tr>
					<tr ref="commaurantItem">
						<td style="width:10%; min-width:41px">总计</td>
						<td style="width:28%">{{sumData.orderNum}}</td>
						<td style="width:20%">{{sumData.comeStore}}</td>
						<td style="width:18%; min-width:69px">{{sumData.peopleNum}}</td>
						<td style="width:15%; min-width:60px">{{sumData.sumMouney}}</td>
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
			comeStore: 0,
			peopleNum: 0,
			sumMouney: 0
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
		this.initReportList();
	},
	directives: {
		TransferDom
	},
	methods: {
		initCountscroll() {
			var height = 0;
			height = this.$refs.commaurantItem.length * 30;
			console.log(height);
			this.$refs.commContent.style.minHeight = height + 'px';
			this.$refs.timeWrapper.style.height = height - 1 + 'px';
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
		countSumData() {
			this.sumData = {
				orderNum: 0,
				comeStore: 0,
				peopleNum: 0,
				sumMouney: 0
			};
			this.report.forEach((item, index) => {
				this.sumData.orderNum += item.orderNum;
				this.sumData.comeStore += item.comeStore;
				this.sumData.peopleNum += item.peopleNum;
				this.sumData.sumMouney += parseFloat(item.sumMouney);
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
			this.initReportList();
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
					console.log('plugin confirm', self.startTime);
				},
				onShow () {
					console.log('plugin show');
				},
				onHide () {
					console.log('plugin hide');
				}
			});
		},
		Tend () {
			var self = this;
			this.$vux.datetime.show({
				cancelText: '取消',
				confirmText: '确定',
				format: 'YYYY-MM-DD',
				value: (new Date()).toLocaleDateString().replace(/\//g, '-'),
				onConfirm (val) {
					self.endTime = val;
					console.log('plugin confirm', self.startTime);
				},
				onShow () {
					console.log('plugin show');
				},
				onHide () {
					console.log('plugin hide');
				}
			});
		},
		getDate (datestr) {
			var temp = datestr.split('-');
			var date = new Date(temp[0], temp[1] - 1, temp[2]);
			console.log(date);
			return date;
		},
		initReportList() {			// 初始化数组
			this.report = [];  // 获取数据前归零
			var itemData = {
				time: '',
				orderNum: 0,
				comeStore: 0,
				peopleNum: 0,
				sumMouney: 0
			};
			var i = 0;
			var startTime = this.getDate(this.startTime);
			var endTime = this.getDate(this.endTime);
			while ((endTime.getTime() - startTime.getTime()) >= 0) {
				var year = startTime.getFullYear();
				var month = (startTime.getMonth() + 1).toString().length === 1 ? '0' + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString();
				var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate();
				console.log('this.report' + this.report[i]);
				if (JSON.stringify(this.report[i]) === undefined) {
					this.report.push(JSON.parse(JSON.stringify(itemData)));
				} else {
					this.report[i] = JSON.parse(JSON.stringify(itemData));
				}
				this.report[i].time = month + '-' + day;
				// console.log(this.report[i].time);
				startTime.setDate(startTime.getDate() + 1);
				i += 1;
			}
			console.log(this.report);
		},
		chooseData() {		// 动态过滤并归类orderdetail数据
			console.log('动态归类数据');
			this.initReportList();
			this.orderdetail.forEach((item, index) => {
				var date = new Date(item.time);
				var month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
				var time = month + '-' + date.getDate();
				this.report.forEach((itemdata, index) => {
					if (time === itemdata.time) {
						itemdata.orderNum ++;
						itemdata.comeStore += item.type === 10 ? 1 : 0;
						itemdata.peopleNum += item.person_num;
						itemdata.sumMouney += parseFloat(item.dishinfo.map((food, index) => {
							return parseFloat(food.price) * food.num;
						}));
						// console.log('数据归类+' + JSON.stringify(itemdata));
					}
				});
			});
			this.countSumData(); // 对数据进行汇总统计
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
			// // 请求本地数据 end
			// this.$nextTick(() => {
			// 	this.initCountscroll();		// 重新计算高度
			// });
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
	.Treport-time{
		display: flex;
		justify-content:center;
		align-items:center;
	    height: 7%;
	    min-height: 40px;
	    z-index: 333;
	    background-color: #eeeeee;
	    position: relative;
	}
	.Treport-time button{
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