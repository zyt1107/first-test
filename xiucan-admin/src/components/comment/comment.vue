<template>
  <div style="position: absolute;top: -0.5%;width:100%; z-index:99999; ">
     <div class="page__hd" style="position: fixed;width: 100%;height: 50px;z-index: 88;line-height:50px; background-color:rgb(99, 105, 111);">
     		<router-link to="goods">
	     		<i class="iconfont" style="color:#fff; margin: 0 10px">&#xe61d;</i>
	        <span class="page__title" style=" color:#fff; font-size:20px">评论列表</span>
     		</router-link>
    </div>
    <div style="background-color: rgb(238, 238, 238);width:100%;height:50px;"></div>
    <div class="page__bd" style="width:100%; height:100%; background-color:#fff">
      <div class="weui-panel weui-panel_access">
          <div class="weui-panel__bd scrollMore" style="max-height:100%">
          	<div class="weui-panel__hd weui-media-box weui-media-box_appmsg" style="margin-bottom:10px">
	          	<div class="weui-media-box__hd" style="width:40px; height:40px">
	                <img class="weui-media-box__thumb" src="./default.png" alt="">
	             </div>
	              <div class="weui-media-box__bd">
	                  <h4 class="weui-media-box__title">{{orderMessage.hotel.name}}</h4>
	              </div>
          	</div>
	         	<div class="page__bd">
	         		<div>
	         		  <div class="weui-media-box weui-media-box_text commentStyle" style="padding-bottom:0px">
                    <p class="weui-media-box__title">
                    	<span style="font-weight:bold">评价商品</span>
                    	<span style="font-size:12px;color:#b5b5b5">(至少完整评价一个)</span>
                    </p>
			         			<div style="padding:0px 8px">
	                    <p class="weui-media-box__title" v-for="(item,index) in orderMessage.order">
	                    	<span style="font-size:15px"  class="span_title">{{item.name}}</span>
	                    	<span class="icon">
		                    	<i class="iconfont" @click="item.commentLevel = 1" :class="{curCommentFace: item.commentLevel == 1}">&#xe654;</i>
		                    	<i class="iconfont" @click="item.commentLevel = 2" :class="{curCommentFace: item.commentLevel == 2}">&#xe782;</i>
		                    	<i class="iconfont" @click="item.commentLevel = 3" :class="{curCommentFace: item.commentLevel == 3}">&#xe8db;</i>
	                    	</span>
	                    </p>
	                    <button 
	                    	type="button" 
	                    	class="btn commentbtn" 
	                    	v-for="(item, index) in orderMessage.comment.evaluationGoods[0]" 
	                    	:class="{curCommentBtn: orderMessage.comment.evaluationGoods[1][index]}"
	                    	@click="selectedbtn('goods', index)">
				                <span>{{item}}</span>
			             </button>
		                 <textarea class="weui-textarea commenttea" placeholder="请输入文本" rows="4" v-model="orderMessage.comment.evaluationGoodsText"></textarea>
		                    <!-- <div class="weui-textarea-counter"><span>0</span>/200</div> -->
	            		</div>
                </div>

	         		</div>
	         		<div>
	         		  <div class="weui-media-box weui-media-box_text commentStyle" style="padding-bottom:0px">
                    <p class="weui-media-box__title">
                    	<span style="font-weight:bold">评价店家服务</span>
                    	<!-- <span style="font-size:12px;color:#b5b5b5">(至少完整评价一个)</span> -->
                    	<span class="icon">
	                    	<i class="iconfont" @click="orderMessage.hotel.commentLevel = 1" :class="{curCommentFace: orderMessage.hotel.commentLevel == 1}">&#xe654;</i>
		                    <i class="iconfont" @click="orderMessage.hotel.commentLevel = 2" :class="{curCommentFace: orderMessage.hotel.commentLevel == 2}">&#xe782;</i>
		                    <i class="iconfont" @click="orderMessage.hotel.commentLevel = 3" :class="{curCommentFace: orderMessage.hotel.commentLevel == 3}">&#xe8db;</i>
	                    </span>
                    </p>
			         			<div style="padding:0px 8px">
	                    <button 
	                    	type="button" 
	                    	class="btn commentbtn" 
	                    	v-for="(item, index) in orderMessage.comment.evaluationStore[0]" 
	                    	:class="{curCommentBtn: orderMessage.comment.evaluationStore[1][index]}"
	                    	@click="selectedbtn('store', index)">
				                <span>{{item}}</span>
				        </button>
		                 <textarea class="weui-textarea commenttea" placeholder="请输入文本" rows="4" v-model="orderMessage.comment.evaluationStoreText"></textarea>
		                    <!-- <div class="weui-textarea-counter"><span>0</span>/200</div> -->
	            		</div>
                </div>
	         		</div>
	         		<div style="height:50px;"></div>
	          </div>
          </div>
    		</div>
    </div>
    <div class="page__ft" style="position:fixed; width:100%; bottom:0px;">
    	<a href="javascript:;" class="weui-btn weui-btn_primary commentsub">提交</a>
    </div>
  </div>
</template>
<script type="text/javascript">
	import Vue from 'vue';        // by xiaozc
	import axios from 'axios'; // by wangl
	export default {
		data() {
			return {
				orderMessage: {
					hotel: {
						id: 1276,
						name: '吉野家',
						src: '',
						commentLevel: 1
					},
					comment: {
						evaluationGoods: [
							['干净卫生', '食材新鲜', '分量足', '味道好', '包装精美'],
							[0, 1, 0, 1, 0]
						],
						evaluationGoodsText: '',
						evaluationStore: [
							['配送快', '准时到达', '送货上门', '餐品保存完整', '主动联系'],
							[1, 0, 0, 0, 0]
						],
						evaluationStoreText: ''
					},
					order: []
					// {
					// 	id: 205145,
					// 	code: '',
					// 	name: '黑椒鸡排特价套餐',
					// 	price: 38,
					// 	num: 1,
					// 	printid: '',
					// 	commentLevel: 2,		// 1 2 3 满意度三个等级
					// 	status: 0
					// }, {
					// 	id: 205145,
					// 	code: '',
					// 	name: '蔬菜牛肉',
					// 	price: 38,
					// 	num: 1,
					// 	printid: '',
					// 	commentLevel: 2,
					// 	status: 0
					// }
				}
			};
		},
		mounted() {
			this.orderMessage.hotel.name = this.$route.params.order.companyName;
			var restUrl = 'http://www.xiucan.com/api/v2/getorderdetail/' + this.$route.params.order.orderid;
			var self = this;
			axios.get(restUrl).then((res) => { // 请求成功
				// console.log(res);
				var orderDetail = res.data; // 订单数据
				// self.orderMessage.order = orderDetail.dishinfo;
				// self.orderMessage.order.forEach((item) => {
				// 	item.commentLevel = 2;
				// });
				// console.log('order:' + JSON.stringify(self.orderMessage.order));
				var order = {};
				orderDetail.dishinfo.forEach((item, index) => {
					order.id = item.id;
					order.name = item.name;
					order.price = item.price;
					order.num = item.num;
					order.commentLevel = 2;
					self.orderMessage.order.push(JSON.parse(JSON.stringify(order)));
				});
			});
		},
		computed: {
			orderMessage() {
				return this.orderMessage;
			}
		},
		methods: {
			selectedbtn(obj, index) {
				console.log(obj + '=' + index);
				if (obj === 'goods') {
					let state = this.orderMessage.comment.evaluationGoods[1][index] === 1 ? 0 : 1;
					this.orderMessage.comment.evaluationGoods[1].splice(index, 1, state);
					// console.log(this.orderMessage.commentLevel.evaluationGoods[1][index]);
				} else {
					let state = this.orderMessage.comment.evaluationStore[1][index] === 1 ? 0 : 1;
					this.orderMessage.comment.evaluationStore[1].splice(index, 1, state);
					// console.log(this.orderMessage.commentLevel.evaluationStore[1][index]);
				}
			}
		}
	};
</script>
<style type="text/css">
	body {
    /*height: 100%;*/
    overflow-x: hidden;
}
	.commentbtn{
		border-radius: 0px;
		margin: 5px;
		padding: 5px 8px;
		color: #b5b5b5!important;
		font-size: 12px;
		background-color: #fff;
		border: 1px solid #b5b5b5
		/*pointer-events: none;*/
	}
	.commentStyle p{
		line-height: 30px;
	}
	.commentStyle .span_title{
		display: inline-block;
		/*width: 200px;*/
		width: 66.6666666666%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
	}
	.commentStyle .iconfont{
		font-size: 1.2rem;
		margin-left:0.1rem;
		float: right;
	}
	.commentStyle .btn:focus{
		outline:none;
	}
	.commentStyle .icon{
		float: right;
		width: 33.3333333333%;
	}
	.commenttea{
		border: 1px solid #dadada;
		padding: 8px;
    background-color: #f7f7f7;
    margin: 6px 1px;
	}
	.commenttea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #cecece; opacity:1; 
	}

	.commenttea::-moz-placeholder { /* Mozilla Firefox 19+ */
	    color: #cecece;opacity:1;
	}

	.commenttea:-ms-input-placeholder{
	    color: #cecece;opacity:1;
	}

	.commenttea::-webkit-input-placeholder{
	    color: #cecece;opacity:1;
	}
	.commentsub{
		background-color: #1AAD19;
	}
	.curCommentBtn{
		background-color: #29A72C;
		color: #fff!important;
		border-color: #29A72C;
	}
/*	.commentbtn:hover{
		color: #b5b5b5;
		border-color: #eeeeee!important;
		background: none!important;
	}*/
	.curCommentFace{
		color: #ff8708d4;
	}
</style>