<template>
	<div>
		<header class="reportList-header">
			<h3>报 表</h3>
		</header>
		<section>
			<div class="weui-cells">
	            <div class="weui-cell weui-cell_access" @click="navTo('timereport')">
	                <div class="weui-cell__bd">
	                    <p>经营日/月/年/任意时间报表</p>
	                </div>
	                <div class="weui-cell__ft">
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_access" @click="navTo('commodityreport')">
	                <div class="weui-cell__bd">
	                    <p>商品类报表</p>
	                </div>
	                <div class="weui-cell__ft">
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_access" @click="navTo('ordercondition')">
	                <div class="weui-cell__bd">
	                    <p>点单情况报表</p>
	                </div>
	                <div class="weui-cell__ft">
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_access" @click="navTo('ordertypereport')">
	                <div class="weui-cell__bd">
	                    <p>外卖食堂报表</p>
	                </div>
	                <div class="weui-cell__ft">
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_access" @click="navTo('paytypereport')">
	                <div class="weui-cell__bd">
	                    <p>支付方式报表</p>
	                </div>
	                <div class="weui-cell__ft">
	                </div>
	            </div>
	        </div>
		</section>
	</div>
</template>
<script type="text/javascript">
export default{
	data() {
		return {
			a: 1
		};
	},
	methods: {
		navTo(value) {
			this.$router.push({name: value, params: {cid: this.$route.params.cid, token: this.$route.params.token}});
		}
	}
};
</script>
<style type="text/css">
	.reportList-header{
		background: #00a0dc;
        height: 50px;
        line-height: 50px;
	}
	.reportList-header h3{
		text-align: center;
		color: #fff;
		font-size: 20px;
	}
</style>