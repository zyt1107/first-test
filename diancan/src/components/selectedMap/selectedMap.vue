<template>
  <div style="position: absolute;top: -0.5%;width:100%; height:100%; z-index:99999" >
     <div class="page__hd" style="position: fixed;width: 100%;height: 50px;z-index: 88;">
        <h1 class="page__title" style="line-height:48px; background-color:rgb(99, 105, 111); color:#fff">地图</h1>
    </div>
    <div style="width:100%; height:58px; background-color:#fff"></div>
    <div style="width:100%; height:100px; background-color: rgb(238, 238, 238); position:absolute"></div>
    <div class="page__bd">
      <div class="weui-panel weui-panel_access">
        <div class="weui-cell weui-cell_vcode" style="height:50px">
            <div class="weui-cell__hd" style="width:80px">
                <label class="weui-label">请输入地址</label>
            </div>
            <div class="weui-cell__bd">
                <input class="weui-input" type="text" placeholder="请输入地址" v-model="address"/>
            </div>
        </div>
<!--         <div class="weui-cell">
          <div class="weui-cell__hd title"><label class="weui-label">姓名</label></div>
          <div class="weui-cell__bd">
              <input class="weui-input" type="text" placeholder="请输入姓名"/>
          </div>
        </div> -->
          <!-- <div class="weui-panel__bd scrollMore" style="max-height:100%"></div> -->
      </div>
    </div>
    <div class="page__ft selectedMap" style="position:absolute; bottom:0px; width:100%">
      <a href="javascript:;" class="weui-btn weui-btn_primary selectedMapButton" @click="confirm">确定</a>
    </div>
    <div id="loadingToast" style="display: block;" v-show="addressShow" @click="addressShow = false">
      <div class="weui-mask_transparent"></div>  <!-- 提醒填地址弹框 -->
      <div class="weui-toast" style="margin-top:20px;">
        <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;margin-top:20px;"></i>
        <p class="weui-toast__content" style="margin-top:20px;">请输入地址</p>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        address: '',
        addressShow: false
      };
    },
    methods: {
      confirm() {
        if (this.address.length === 0) {
          this.addressShow = true;
        } else {
          this.$root.eventHub.$emit('address', this.address);  // selectedMap -> shopCart
          this.address = '';
          // console.log(this.address);
          this.$router.push('goods');
        }
      }
    }
  };
</script>
<style type="text/css">
  .selectedMap .selectedMapButton{
    background: #1AAD19;
  }
</style>