<template>
	<div class="weui-msg headerHide">
		<div class="weui-icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
		<div class="weui-textarea">
			<h3 class="weui_msg__title">{{ $t('lang.payment successful') }}</h3><!-- 支付成功 -->
		</div>
		<div class="weui-cells">
			<div class="weui-cell">
				<div class="weui-cell__bd weui-cell_primary wordShow" >
					<p>{{ $t('lang.paymentAmount') }}</p><!-- 付款金额 -->
				</div>
				<div class="weui-cell__ft">
					￥{{totalPrice}}
				</div>
			</div>
			<div class="weui-cell">
				<div class="weui-cell__bd weui-cell_primary wordShow">
					<p>{{ $t('lang.afterOrderFour') }}</p><!-- 订单后四位 -->
				</div>
				<div class="weui-cell__ft">
					{{orderId}}
				</div>
			</div>
		</div>
		<div class="weui_opr_area">
			<p class="weui-btn-area">
				<a href="javascript:;" class="weui-btn weui-btn_primary" @click="back">{{ $t('lang.returnToMerchant') }}</a><!-- 返回商家 -->
			</p>
		</div>
		<div class="advert-page weui-panel" v-if="imgPath">
			<a :href="url">
				<img  class="advert-img" :src="imgPath" />
			</a>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
			totalPrice: '',
			orderId: '',
			imgPath: '',
			url: '',
			desc: ''
		};
	},
	created() {
		var self = this;
		//            self.$root.tabShow = false;
		//            console.log(self.$root.tabShow);
		//  支付成功后获取广告信息;
		self.totalPrice = window.localStorage.getItem('orderTotalPrice');
		self.orderId = window.localStorage.getItem('orderIdNumber'); // 存储后4位订单号
		// console.log(self.orderId);
		// self.$root.platformId = self.$root.platformId ? self.$root.platformId : 'oMSbzt6_xy2rccWyiF4_9cOd8-f4';
        axios.get('http://www.xiucan.com/Advert/advert.php?openId=' + self.$root.platformId)
			.then(function(response) {
				console.log(response);
//					response.data = JSON.parse(response.data);
//					JSON.parse(response.data);
					// console.log(response.data);
				console.log('response.data=' + response.data);// string
                console.log('response.data.code=' + response.data.code);
				if (response.data.code === 200) {
                    self.imgPath = response.data.data.imgPath;
                    self.url = response.data.data.url;
                    self.desc = response.data.data.desc;
				} else if (response.data.code === 404) {
					console.log('未获取广告');
				} else {
					console.log('未知错误,请反馈我们，谢谢。');
				}
			}).catch(function(error) {
				console.log('error=' + error);
			});
	},
    methods: {
      back() {
        var url = 'http://www.xiucan.com/diancaitest/?token=' + window.localStorage.getItem('token') + '&tablenum=' + window.localStorage.getItem('tablenum');
        window.location.href = url;
      }
    }
};
</script>
<style>
	.headerHide { /*隐藏头信息*/
		background-color: #EEEEEE;
		position: relative;
		top: -68px;
	}
	.advert-page{
		margin-top:1.6rem;
		text-align: center;
	}
	.advert-img{
		width:98% !important;
	}
	.wordShow {
	  text-align: left;
	}
</style>









