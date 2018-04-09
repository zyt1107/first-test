<template>
  <div class="register-content">
    <h1 class="register-title">
      <i class="icon-arrow_lift" style="float:left;color:#333;" @click="$parent.register = false"></i>
      <span>创建门店</span>
    </h1>
    <group title="" class="storeForm">
      <x-input title="" name="name" placeholder="门店名称" v-model="store.name"></x-input>
      <x-input title="" name="tel" placeholder="手机号码" type="number" is-type="china-mobile" v-model="store.tel"></x-input>
      <div class="checkVcode">
        <div class="checkVcode-input">
          <x-input title="" name="vcode" type="number" placeholder="验证码" v-model="store.checkVcode"></x-input>
        </div>
        <div class="checkVcode-btn">
          <button @click="getVcode" ref="vcode">获取验证码</button>
        </div>
      </div>
      <x-address title="" raw-value :list="addressData" value-text-align="left" hide-district placeholder="所在城市"
                 v-model="store.city" class="store-address"></x-address>
      <x-input title="" name="address" placeholder="门店地址" v-model="store.address"></x-input>
      <!-- <selector ref="defaultValueRef" title="" :options="optionList" v-model="store.option"></selector>

      <x-input title="" name="userid" placeholder="分支登录账号" v-model="store.userid"></x-input>
      <x-input title="" name="password" placeholder="分支登录密码" v-model="store.password"></x-input>
      -->
      <x-input title="" name="BDname" placeholder="BD联系人" v-model="store.BDname"></x-input>
    </group>
    <br>
    <!-- <div class="checkIcon">
        <check-icon :value.sync="store.wxpay_xc">南京秀餐网络科技有限公司</check-icon>
    </div> -->
    <div class="btnSubmit">
      <x-button type="primary" @click.native="handleSubmit">提交</x-button>
    </div>
    <div v-transfer-dom>
      <loading :show="toast.loading.isOpen" :text="toast.loading.text"></loading>
    </div>

    <!-- loading start  -->
    <div v-show="toast.loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast" style="margin-left:0 !important;"></i>
        <p class="weui-toast__content">注册中</p>
      </div>
    </div>
    <!-- loading   end   -->

    <!-- 成功提示    start -->
    <div v-show="toast.success">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
        <p class="weui-toast__content">成功</p>
      </div>
    </div>
    <!-- 成功提示    end -->

    <!-- 失败提示   start -->
    <div v-show="toast.fail">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;padding:3px;margin-top:22px;"></i>
        <p class="weui-toast__content">失败</p>
      </div>
    </div>
    <!-- 失败提示   end -->

  </div>
</template>
<script type="text/javascript">
  import axios from 'axios';
  import {
    XInput,
    Group,
    XAddress,
    ChinaAddressV4Data,
    XButton,
    CheckIcon,
    Selector,
    Value2nameFilter as value2name,
    Loading,
    TransferDomDirective as TransferDom
  } from 'vux';

  export default {
    data() {
      return {
        addressData: ChinaAddressV4Data,
        optionList: [
          {key: 'xiucandiancai', value: '秀餐点菜'}
        ],
        store: {
          name: '',
          tel: '',
          address: '',
          city: [],
          option: 'xiucandiancai',
          logourl: '',
          userid: '',
          password: '',
          BDname: '',
          wxpay_xc: true,
          vCode: '',
          checkVcode: ''
        },
        toast: {
          loading: false,
          success: false,
          fail: false
        }
      };
    },
    mounted() {
      console.log('register.vue.mounted');
    },
    methods: {
      handleSubmit() {
        let userCode = this.store.checkVcode;
        let vCode = this.store.vCode;
        // console.log(typeof userCode);
        if (Number(userCode) !== vCode) {
          alert('验证码不正确');
          this.$refs.vcode.innerText = '获取验证码';
          return;
        }
        this.toast.loading = true;
        var data = JSON.parse(JSON.stringify(this.store));
        this.$root.companyData = data;
        data.openid = sessionStorage.getItem('platformId');
        data.city = value2name(data.city, ChinaAddressV4Data);
        data.wxpay_xc = data.wxpay_xc ? 1 : 0;
        console.log('register.data=' + JSON.stringify(data));
        axios.post('http://www.xiucan.com/api/v2/singlecompanyadd', data).then((res) => {
          console.log('register.store' + JSON.stringify(res));
          this.toast.loading = false;
          if (res.data.status === -1) {
            // 门店创建失败
            this.toast.fail = true;
            setTimeout(() => {
              this.toast.fail = false;
            }, 300);
            return;
          }
          if (res.data.status === 1) {
            // 门店创建成功
          }
          if (res.data.status === 2) { // 门店创建成功并且token更新成功
            console.log('门店创建成功并且token更新成功');
            this.toast.success = true;
            setTimeout(() => {
              this.toast.success = false;
            }, 300);
            sessionStorage.setItem('cid', res.data.cid);
            sessionStorage.setItem('token', res.data.token);
            this.$router.push({name: 'guide', params: {cid: res.data.cid, token: res.data.token}});
          }
        }).catch((error) => {
          this.toast.loading = false;
          console.log('error' + error); // TODO: 后续加上弹窗
        });
      },
      getVcode(event) {
        var data = {};
        data.mobile = this.store.tel;
        console.log('mobile' + JSON.stringify(data));
        axios.post('http://www.xiucan.com/api/v2/mobileauthcode', data).then((res) => {
          console.log(JSON.stringify(res.data));
          if (res.data.result === 0) {
            this.store.vCode = res.data.code;
            alert('发送成功');
          } else {
            alert('发送失败,请保证输入正确的手机号码!');
          }
        }).catch((error) => {
          console.log('mobileauthcode' + error);
        });
      }
    },
    components: {
      XInput,
      Group,
      XAddress,
      XButton,
      CheckIcon,
      Selector,
      Loading
    },
    directives: {
      TransferDom
    }
  };
</script>
<style type="text/css" scoped>
  .register-content {
    background: white;
    position: absolute;
    z-index: 1;
    width: 100%;
    min-height: 100%;
  }

  .storeForm .weui-cells {
    background: none !important;
  }

  .storeForm .weui-cell .weui-cell__hd {
    display: none;
  }

  .storeForm .weui-cell:before {
    right: 15px;
    z-index: auto !important;
  }

  .storeForm {
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }

  .storeForm .weui-cells:before {
    border-top: 1px solid;
    z-index: auto;
  }

  .storeForm .vux-cell-box:not(:first-child):before {
    width: auto;
  }

  .register-title {
    font-size: 25px;
    font-weight: normal;
    text-align: center;
    margin: 25px;
  }

  /*--------------------------------------*/
  .checkIcon {
    margin: 25px;
    text-align: center;
  }

  .checkIcon .weui-icon-success {
    font-size: inherit;
  }

  .store-address:before {
    right: 15px;
  }

  .btnSubmit {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 25px;
  }

  /*===========================*/
  .checkVcode {
    display: flex;
    align-items: center;
    position: relative;
  }
  .checkVcode-input {
    width: 100%;
  }
  .checkVcode-btn {
    display: flex;
  }
  .checkVcode-btn button {
    border: none;
    outline: none;
    font-size: 14px;
    padding: 5px;
    border-radius: 5px;
    width: 80px;
    height: 30px;
    margin-right: 15px;
  }
  .checkVcode:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
    right: 15px;
  }
</style>
le>
