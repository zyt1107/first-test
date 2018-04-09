<template>
	<div style="width:100%; height:100%; position:absolute">
		<header class="report-header">
			<h3 class="title">商品详情</h3>
		</header>
		<div class="report-time">
			<x-button type="primary" plain @click.native="Tstart">{{startTime === '' ? '选择时间' : startTime}}</x-button>
			<x-button type="primary" plain @click.native="seach">搜索</x-button>
		</div>
		<table class="header reporttable" style="z-index:333">
			<thead>
				<tr>
					<td @click="idSort" style="width:10%; min-width:41px">序号<span style="transform: rotate(90deg);display:inline-block;font-size: 12px;"><i class="iconfont">&#xe646;</i></span></td>
					<td style="width:28%">菜品名称</td>
					<td style="width:20%">类别</td>
					<td  @click="numSort" style="width:18%; min-width:69px">销售数量<span style="transform: rotate(90deg);display:inline-block;font-size: 12px;"><i class="iconfont">&#xe646;</i></span></td>
					<td  @click="saleSort" style="width:15%; min-width:60px">销售额<span style="transform: rotate(90deg);display:inline-block;font-size: 12px;"><i class="iconfont">&#xe646;</i></span></td>
				</tr>
			</thead>
		</table>
		<div class="commwrapper" ref="commWrapper">
			<table class="body reporttable" ref="commContent">
				<tbody class="content">
					<tr v-for="(item, index) in reportClone"  ref="commaurantItem" :key="index">
						<td style="width:10%; min-width:41px">{{item.id}}</td>
						<td style="width:28%">{{item.name}}</td>
						<td style="width:20%">{{item.class}}</td>
						<td style="width:18%; min-width:69px">{{item.num}}</td>
						<td style="width:15%; min-width:60px">{{item.SalesValue}}</td>
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
                <div class="weui-dialog__bd">请选择时间</div>
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
import { DatetimeView, XButton, Popup, TransferDom, Datetime, Group } from 'vux';
import axios from 'axios';
export default{
	data() {
      return {
        report: [],
        reportClone: [],
        idSortdir: true,
        saleSortdir: true,
        numSortdir: true,
        commScroll: null,
		startTime: '',
		endTime: '',
		isShow: false,
		warning: 1
      };
	},
	activated() {
		// this.$nextTick(() => {
		// 	this.scroll = new BScroll(this.$refs.wrapper, {
		// 		click: true,
		// 		scrollX: false,
		// 		scrollY: true,
		// 		listenScroll: true
		// 	});
		// });
		// this.$refs.wrapper.addEventListener('touchmove', (event) => {
		// 	let moveY = event.touches[0].pageY;
		// 	console.log(moveY);
		// 	this.scroll.scrollTo(0, moveY);
		// });
		this.reportClone = this.report;
		this.initCountscroll();
		this.commScroll = new BScroll(this.$refs.commWrapper, {
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
			console.log(1);
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
		initCountscroll() {
			this.$refs.commContent.style.minHeight = this.report.length * 30 + 'px';
			this.$refs.commWrapper.style.height = this.report.length * 30 - 1 + 'px';
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
			if (this.startTime === '') {
				this.warningicon();
				return;
			}
			var startTime = new Date(this.startTime).valueOf();
			var endTime = new Date(this.endTime).valueOf();
			// console.log(startTime + '---' + endTime);
			// this.reportClone = this.report.filter((item) => {
			// 	if (item.orderTime >= startTime && item.endTime <= endTime) {
			// 		return item;
			// 	}
			// });
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
					self.endTime = new Date(new Date(val).getTime() + 24 * 60 * 60 * 1000 - 1);// 获取当天24:59:59时间
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
		idSort() {
			if (this.idSortdir) {
				this.reportClone = this.report.sort((a, b) => {
					return a.id - b.id;
				});
			} else {
				this.reportClone = this.report.sort((a, b) => {
					return b.id - a.id;
				});
			}
			this.idSortdir = !this.idSortdir;
			// console.log(this.reportClone);
		},
		saleSort() {
			if (this.saleSortdir) {
				this.reportClone = this.report.sort((a, b) => {
					return parseFloat(a.SalesValue) - parseFloat(b.SalesValue);
				});
			} else {
				this.reportClone = this.report.sort((a, b) => {
					return parseFloat(b.SalesValue) - parseFloat(a.SalesValue);
				});
			}
			this.saleSortdir = !this.saleSortdir;
			// console.log(this.reportClone);
		},
		numSort() {
			if (this.numSortdir) {
				this.reportClone = this.report.sort((a, b) => {
					return parseInt(a.num) - parseInt(b.num);
				});
			} else {
				this.reportClone = this.report.sort((a, b) => {
					return parseInt(b.num) - parseInt(a.num);
				});
			}
			this.numSortdir = !this.numSortdir;
			// console.log(this.reportClone);
		},
		chooseList (data) {
			var foodList = [];
			var results = data.map((item) => {
				return item.items.map((food) => {
					food.className = item.name;
					return food;
				});
			});
			// console.log('results=' + JSON.stringify(results));
			results.forEach((item) => {
				// console.log(JSON.stringify(item));
				foodList.push.apply(foodList, item);
			});
			// console.log('foodList=' + JSON.stringify(foodList));
			var report = {};
			foodList.forEach((item, index) => {
				report.id = item.id;
				report.name = item.name;
				report.class = item.className;
				report.num = parseFloat(item.sum);
				report.SalesValue = parseFloat(item.price) * parseInt(item.sum);
				this.$set(this.report, index, JSON.parse(JSON.stringify(report)));
			});
			return report;
		},
		loadingData() {
			var urlHeader = 'http://www.xiucan.com/api/v2/indexTest.php/getdishsuminfo/';
			var urlfood = this.$route.params.cid + '/' + parseInt(new Date(this.startTime).valueOf() / 1000) + '/ ' + parseInt(new Date(this.endTime).valueOf() / 1000);
			var url = urlHeader + urlfood;
			// var url = 'static/commodityReport.json';
			axios.get(url).then((res) => {
				// console.log(JSON.stringify(res.data));
				if (res.data.state !== 0) {
					return;
				}
				this.chooseList(res.data.results);
				console.log(this.report);
			});
			this.$nextTick(() => {
				this.initCountscroll();		// 重新计算高度
			});
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
	.commwrapper{
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
	.report-time{
		display: flex;
		justify-content:center;
		align-items:center;
	    height: 7%;
	    min-height: 40px;
	    z-index: 333;
	    background-color: #eeeeee;
	    position: relative;
	}
	.report-time button{
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
	.report-time button:first-child{
		width: 65% !important;
	}
	.commwrapper .loading{
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