<template>
	<div style="width:100%; height:100%; position:absolute">
		<header class="restaurant-header">
			<h3>订单详细</h3>
		</header>
		<section  class="restaurant-body">
			<div style="height:100%">
				<nav>
					<div :class="{cur : status == 0}" @click="changeStatus(0)">完成</div>
					<div :class="{cur : status == 1}" @click="changeStatus(1)">未完成</div>
					<div :class="{cur : status == 2}" @click="changeStatus(2)">历史订单</div>
				</nav>
				<div class="search">
					<!-- <div class="all" @click="searchAll">全部</div> -->
					<select id="city" class="all" v-model="searchType">
				        <option value="10">堂食</option>
				        <option value="30">外卖</option>
				        <option value="50">自提</option>
				        <option value="40">预约</option>
				        <option value="20">堂食打包</option>
				        <option value="0">全部</option>
				    </select>
					<input type="text" name="" v-model="searchText" placeholder="请输入订单号">
					<div class="searchbtn" @click="searchBtn">搜索</div>
				</div>
				<div class="rest-time">
					<x-button type="primary" plain @click.native="Tstart">{{startTime === '' ? '选择时间' : startTime}}</x-button>
					<x-button type="primary" plain @click.native="seach">搜索</x-button>
				</div>
				<div class="wrapper" ref="restWrapper">
			        <ul class="content" ref="restContent">
			            <li class="rest-item" v-for="(item,index) in restorderdataclone" ref="restaurantItem" :key="index">
							<p>桌台号：<span>{{item.tablenum}}</span></p>
							<p>流水号：<span>{{item.serialNumber}}</span></p>
							<p>订单号：<span>{{item.orderid}}</span></p>
							<p>付款状态：<span>{{pesc(item.statePayment)}}</span></p>
							<p>下单时间：<span>{{item.orderTime}}</span></p>
							<p class="sum-price">
								<span>总计：</span>
								<span>{{item.sumPrice}}</span>
							</p>
							<div class="rest-btn" v-show="item.statePayment !== 1">
								<!-- <a href="javascript:;" class="weui-btn weui-btn_default" id="showAndroidDialog1">取消订单</a> -->
								<div @click="confirmdia = 0; removeOrderIndex = index">取消订单</div>
								<div @click="paySheet = 0; confirmOrderIndex = index">确认收款</div>
							</div>
						</li>
			        </ul>
			        <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
			        <div class="loading" v-show="isShow">更新中</div>
			    </div>
<!-- 				<div class="content">
					<ul>
						<li class="rest-item" v-for="item in restorderdataclone">
							<p>桌台号：<span>{{item.tablenum}}</span></p>
							<p>流水号：<span>{{item.serialNumber}}</span></p>
							<p>订单号：<span>{{item.orderid}}</span></p>
							<p>付款状态：<span>{{pesc(item.statePayment)}}</span></p>
							<p>下单时间：<span>{{item.orderTime}}</span></p>
							<p class="sum-price">
								<span>总计：</span>
								<span>{{item.sumPrice}}</span>
							</p>
							<div class="rest-btn" v-show="item.statePayment == '1'">
								<div>取消订单</div>
								<div>确认收款</div>
							</div>
						</li>
					</ul>
				</div> -->
			</div>
		</section>
		<!--BEGIN dialog1-->
        <div class="js_dialog" id="iosDialog1" v-show="confirmdia == 0">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__hd"><strong class="weui-dialog__title">提示</strong></div>
                <div class="weui-dialog__bd">确定取消订单吗？</div>
                <div class="weui-dialog__ft">
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="confirmdia = 1">取消</a>
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="removeOrder()">确认</a>
                </div>
            </div>
        </div>
        <!--END dialog1-->
        <!--START actionSheet-->
        <div class="weui-skin_android" id="androidActionsheet" v-show="paySheet == 0">
	        <div class="weui-mask"></div>
	        <div class="weui-actionsheet">
	            <div class="weui-actionsheet__menu">
	                <div class="weui-actionsheet__cell" @click="confirmMoney('weixin')">微信支付</div>
	                <div class="weui-actionsheet__cell" @click="confirmMoney('member')">会员支付</div>
	                <div class="weui-actionsheet__cell" @click="confirmMoney('weixin')">现金支付</div>
	            </div>
	        </div>
	    </div>
    	<!--END actionSheet-->
    	<!--BEGIN toast-->
	    <div id="toast" v-show="success == 0">
	        <div class="weui-mask_transparent"></div>
	        <div class="weui-toast">
	            <i class="weui-icon-success-no-circle weui-icon_toast"></i>
	            <p class="weui-toast__content">已完成</p>
	        </div>
	    </div>
	    <!--end toast-->
	</div>
</template>
<script type="text/javascript">
	import BScroll from 'better-scroll';
	import axios from 'axios';
	import { DatetimeView, XButton, Popup, TransferDom, Datetime, Group } from 'vux';
	export default{
		data() {
			return {
				restorderdata: [],
				restorderdataclone: [],
				searchText: '',
				isShow: false,
				status: 0,   //  0 完成  1未完成  2历史订单
				startTime: (new Date()).toLocaleDateString().replace(/\//g, '-'),
				endTime: new Date(new Date((new Date()).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
				searchType: '0',
				paySheet: 1,
				confirmdia: 1,
				success: 1,
				removeOrderIndex: null,
				confirmOrderIndex: null
			};
		},
		// {	// 假数据
		// 	tablenum: '1',		// 桌号
		// 	serialNumber: '12314521512',	// 流水号
		// 	orderid: '1111111',		// 订单号
		// 	statePayment: 0,		// 订单类型  1 完成  0 未支付
		// 	orderTime: '2017-10-25 10:00',		// 订单时间
		// 	sumPrice: '28.00',	// 总价
		// 	orderType: 10 // 0.全部  10堂食 20堂食打包 30 外卖 40预约 50自提
		// }, {
		// 	tablenum: '1',
		// 	serialNumber: '12314521512',
		// 	orderid: '1112222',
		// 	statePayment: 0,
		// 	orderTime: '2017-10-25 10:00',
		// 	sumPrice: '28.00',
		// 	orderType: 20
		// }, {
		// 	tablenum: '1',
		// 	serialNumber: '12314521512',
		// 	orderid: '2222222',
		// 	statePayment: 1,
		// 	orderTime: '2017-10-25 10:00',
		// 	sumPrice: '28.00',
		// 	orderType: 30
		// }
		activated() {
			this.restorderdataclone = JSON.parse(JSON.stringify(this.restorderdata));
			this.changeStatus(this.status);
			// this.$refs.restContent.style.minHeight = this.restorderdataclone.length * 202 + 'px';
			this.orderScroll = new BScroll(this.$refs.restWrapper, {
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
				this.orderScroll.on('pullingDown', () => {
				this.isShow = true;
				console.log(1);
			});
			this.orderScroll.on('pullingUp', () => {
				this.isShow = true;
				this.loadingData();
					setTimeout(() => {
						this.$nextTick(() => {
							this.isShow = false;
							this.orderScroll.finishPullUp();
							this.orderScroll.refresh();
						});
					}, 1000);
			});
			this.loadingData();
			// var url = 'static/restaurantorderdata.json';  // 本地测试
			// axios.get(url).then((res) => {
			// 	console.log(res);
			// 	if (res.data.state !== 1) {
			// 		return;
			// 	}
			// 	res.data.results.forEach((item, index) => {
			// 		this.restorderdata[index].tablenum = item.tableid;
			// 		this.restorderdata[index].orderid = item.orderid;
			// 		this.restorderdata[index].statePayment = item.paid;
			// 		this.restorderdata[index].orderTime = item.servicetime;
			// 		this.restorderdata[index].sumPrice = item.price;
			// 		this.restorderdata[index].orderType = item.type;
			// 	});
			// 	// this.restorderdata = res.results
			// });
		},
		watch: {
			restorderdataclone() {
				this.$refs.restContent.style.minHeight = this.restorderdataclone.length * 202 + 'px';
				console.log('重新计算restcontent高度');
			},
			searchType() {
				var self = this;
				switch (self.searchType) {
					case '0': self.changeSearchType(0); break;
					case '10': self.changeSearchType(10); break;
					case '20': self.changeSearchType(20); break;
					case '30': self.changeSearchType(30); break;
					case '40': self.changeSearchType(40); break;
					case '50': self.changeSearchType(50); break;
				}
			}
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
			_initScroll() {
				// 上拉加载数据
				this.orderScroll.on('pullingUp', () => {
					this.scrollFinish = false;
					// 防止一次上拉触发两次事件,不要在ajax的请求数据完成事件中调用下面的finish方法,否则有可能一次上拉触发两次上拉事件
					this.orderScroll.finishPullUp();
					// 加载数据
					// this.getIncomeDetail(this.nextPage);
				});
				this.orderScroll.on('scroll', (pos) => {
					// console.log(pos.x + '~' + pos.y)
				});
			},
			pesc(statePayment) {
				switch (statePayment) {
					case 0: return '未付款';
					case 1: return '已完成';
				}
			},
			changeStatus(status) {
				this.status = status;
				switch (status) {
					case 0: this.restorderdataclone = this.restorderdata.filter((item) => {
						return item.statePayment === 1;
					});
					break;
					case 1: this.restorderdataclone = this.restorderdata.filter((item) => {
						return item.statePayment === 0;
					});
					break;
					case 2: this.restorderdataclone = this.restorderdata;
				}
			},
			changeSearchType(type) {
				console.log('type' + type);
				this.changeStatus(this.status);
				if (type === 0) {
					return;
				}
				this.restorderdataclone = this.restorderdataclone.filter((item) => {
					return item.orderType === parseInt(type);
				});
			},
			searchBtn() {
				this.changeStatus(this.status);
				var restdata = [];
				let n = 0;
				for (let i = 0; i < this.restorderdataclone.length; i++) {
					if (this.restorderdataclone[i].orderid.indexOf(this.searchText) !== -1) {
						restdata[n++] = this.restorderdataclone[i];
					}
				}
				this.restorderdataclone = restdata;
			},
			searchAll() {
				this.restorderdataclone = JSON.parse(JSON.stringify(this.restorderdata));
			},
			loadingData() {
				var url = 'http://www.xiucan.com/api/v2/orderdetail';
				var data = {
					cid: this.$route.params.cid,
					starttime: parseInt(new Date(this.startTime).valueOf() / 1000),
					endtime: parseInt(new Date(this.endTime).valueOf() / 1000)
				};
				console.log(JSON.stringify(data));
				axios.post(url, data).then((res) => {
					console.log(res);
					if (res.data.state !== 1) {
						return false;
					}
					var restorderItem = {};
					this.restorderdata = [];
					res.data.results.forEach((item, index) => {
						restorderItem.tablenum = item.tableid;
						// this.restorderdata[index].serialNumber = '12314521512';
						restorderItem.orderid = item.orderid;
						restorderItem.statePayment = item.paid;
						restorderItem.orderTime = item.servicetime;
						restorderItem.sumPrice = item.price;
						restorderItem.orderType = item.typ;
						this.$set(this.restorderdata, index, JSON.parse(JSON.stringify(restorderItem)));
					});
					this.changeStatus(this.status);
					return true;
				});
				return false;
			},
			removeOrder(index) {
				this.confirmdia = 1;
				this.restorderdataclone.splice(this.removeOrderIndex, 1);
				this.restorderdata.splice(this.removeOrderIndex, 1);
				this.removeOrderIndex = null;
				this.changeStatus(this.status);
				this.successIco();
				// 删除订单 发送请求 暂未添加
			},
			seach() {
				this.loadingData();
			},
			confirmMoney(type) {
				this.paySheet = 1;
				var url = 'http://www.xiucan.com/api/v2/updateorder';
				var orderid = this.restorderdataclone[this.confirmOrderIndex].orderid;
				var data = {
					orderid: orderid,
					paytype: type
				};
				console.log('修改订单：' + JSON.stringify(data));
				axios.post(url, data).then((res) => {
					console.log(res.data);
					if 	(res.data === 'successsuccess') {
						this.restorderdata[this.confirmOrderIndex].statePayment = 1;
						this.changeStatus(this.status);
						this.successIco();
					} else {
						alert('数据修改失败');
					}
				});
			},
			successIco() {		// 成功提示小表示控制
				this.success = 0;
				setTimeout(() => {
					this.success = 1;
				}, 1000);
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
	.restaurant-header{
		height: 50px;
		width: 100%;
		background: #00a0dc;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.restaurant-header h3{
		color: #fff;
		font-size: 20px;
	}
	.restaurant-body{
		height: 90%;
	}
	.restaurant-body nav{
		height: 7%;
		line-height: 30px;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		background-color: #fff;
	}
	.restaurant-body nav div{
		width: 33.3333%;
		text-align: center;
	}
	.restaurant-body nav div.cur{
		color: #00a0dc;
	}
	.restaurant-body .search{
		height: 7%;
		min-height: 37px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.restaurant-body .search .all{
		width: 18%;
		height: 30px;
		font-size: 12px;
		border-bottom-left-radius: 4px;
		border-top-left-radius: 4px;
		background-color: #00a0dc;
		color: #fff;
		display: inline-block;
		text-align: center;
		line-height: 30px;
	}
	.restaurant-body .search input{
		width: 60%;
		height: 30px;
		border: 0;
		background-color: #fff;
		display: inline-block;
		font-size: 12px;
		padding-left: 30px;
	}
	.restaurant-body .rest-time{
		display: flex;
		 justify-content:center;
		 align-items:center;
		 height: 7%;
		 min-height: 40px;
	}
	.restaurant-body .rest-time button{
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
	.restaurant-body .rest-time button:first-child{
		width: 200px !important;
	}
	.restaurant-body .search .searchbtn{
		width: 18%;
		height: 30px;
		font-size: 12px;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background-color: #00a0dc;
		color: #fff;
		display: inline-block;
		text-align: center;
		line-height: 30px;
	}
	.restaurant-body .wrapper{
		min-height: 340px;
		height: 82%;
		overflow: hidden;
	}
	.restaurant-body .loading{
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
	.restaurant-body .content .rest-item{
		width: 90%;
		margin: 0px auto;
		border-top: 3px solid #00a0dc;
		padding: 5px;
		background-color: #fff;
	}
	.restaurant-body .content .rest-item p{
		line-height: 25px;
		font-size: 13px;
	}
	.restaurant-body .content .rest-item .sum-price{
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
	}
	.restaurant-body .content .rest-item .rest-btn{
		height: 40px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.restaurant-body .content .rest-item .rest-btn div{
		width: 40%;
		height: 30px;
		text-align: center;
		line-height: 30px;
		display: inline-block;
		margin:0 5px;
	}
	.restaurant-body .content .rest-item .rest-btn div:first-child{
		background-color: #ddd;
		color: #3e3e3e;
	}
	.restaurant-body .content .rest-item .rest-btn div:last-child{
		background-color: #00a0dc;
		color: #fff;
	}
</style>