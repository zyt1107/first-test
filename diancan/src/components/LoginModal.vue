<template>
<modal name="login" transition="pop-out" :width="modalWidth" :height="250" @before-close="loginClose">
  <div class="box">
    <div class="box-part" id="bp-left">
      <div class="partition" id="partition-register">
        <div class="partition-title">{{ $t('lang.waiterLogin') }}</div><!-- 服务员登录 -->
        <div class="partition-form">
          <form autocomplete="false">

            <div class="autocomplete-fix">
              <input type="password">
            </div>

            <input id="token" name="token" type="text" placeholder="请输入正确授权码"
             v-model="token" v-bind:class="">

            <toggle-button :value="toggled" @change="onToggleChanged()"/> {{ $t('lang.RememberAuthorizationCode') }}<!-- 记住授权码 -->
          </form>

          <div style="margin-top: 42px">
          </div>

          <button class="large-btn login-btn" @click="login">{{ $t('lang.login') }}</button>
        </div>
      </div>
    </div>
  </div>
</modal>
</template>
<script>
const MODAL_WIDTH = 656;

export default {
  name: 'LoginModal',
  data () {
    return {
      modalWidth: MODAL_WIDTH,
      token: window.localStorage.getItem('token'),
      toggled: true,
      loginClicked: false
    };
  },
  created () {
    this.modalWidth = window.innerWidth < MODAL_WIDTH
      ? MODAL_WIDTH / 2
      : MODAL_WIDTH;
  },
  methods: {
    onToggleChanged() {
      this.toggled = !this.toggled;
      console.log('this.toggled=' + this.toggled);
    },
    loginClose (event) {
      if (!this.loginClicked) {
        event.stop();
        console.log('loginClose');
      } else {
        this.loginClicked = false;
      }
    },
    login() {
      var localStorage = window.localStorage;
      console.log('login.token=' + this.token);
      console.log('this.toggled=' + this.toggled);

      if (this.toggled && this.token) {
        console.log('localStorage.getItem.token=' + this.token);
        localStorage.setItem('token', this.token);
        this.token = localStorage.getItem('token');
      } else if (!this.toggled) {
        localStorage.clear();
        console.log('localStorage.clear');
      }

      if (!this.token) {
        console.log('!this.token-localStorage-token=' + localStorage.getItem('token'));
        // TODO: by xingcj. 输入授权码从灰色变成红色
      } else {
        this.loginClicked = true;
        this.$root.urlParam.token = this.token;
        console.log('login.this.$root.urlParam.token=' + this.$root.urlParam.token);
        this.$modal.hide('login');
        this.$root.eventHub.$emit('tokenRetrived');
      }
    },
    clearToken() {
      this.token = '';
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"


  ::-webkit-input-placeholder { /* WebKit browsers */
    color: red;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: red;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: red; 
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: red;
  }


.box {
  background: white;
  overflow: hidden;
  width: 656px;
  height: 400px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 0 40px black;
  color: #8b8c8d;

  .box-part {
    display: inline-block;
    position: relative;
    vertical-align: top;
    box-sizing: border-box;
    height: 100%;
    width: 50%;
  }

  .box-messages {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .box-error-message {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    height: 0;
    line-height: 32px;
    padding: 0 12px;
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: white;
    background: #F38181;
  }

  .partition {
    width: 100%;
    height: 100%;

    .partition-title {
      box-sizing: border-box;
      padding: 30px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      font-size: 20px !important;
      font-weight: 300;
    }

    .partition-form {
      padding: 0 20px;
      box-sizing: border-box;
    }
  }

  input[type=password],
  input[type=text] {
    display: block;
    box-sizing: border-box;
    margin-bottom: 15px;
    width: 100%;
    font-size: 12px;
    line-height: 2;
    border: 0;
    border-bottom: 1px solid #DDDEDF;
    padding: 4px 8px;
    font-family: inherit;
    transition: 0.5s all;
    outline: none;
  }

  button {
    background: white;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px;
    letter-spacing: 1px;
    font-family: "Open Sans", sans-serif;
    font-weight: 400;
    min-width: 140px;
    color: #8b8c8d;
    cursor: pointer;
    border: 1px solid #DDDEDF;
    text-transform: uppercase;
    transition: 0.1s all;
    font-size: 10px;
    outline: none;
    &:hover {
      border-color: mix(#DDDEDF, black, 90%);
      color: mix(#8b8c8d, black, 80%);
    }
  }

  .large-btn {
    width: 100%;
    background: white;
    height:40px;
    span {
      font-weight: 600;
    }
    &:hover {
      color: white !important;
    }
  }

  .button-set {
    margin-bottom: 8px;
  }

  #register-btn,
  #signin-btn {
    margin-left: 8px;
  }

  .login-btn {
    border-color: $login_color;
    margin-top:-15px;
    background: rgb(0, 144, 48);
    color: white;
    font-size:20px;
  }

  .autocomplete-fix {
    position: absolute;
    visibility: hidden;
    overflow: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
  }
}

.pop-out-enter-active,
.pop-out-leave-active {
  transition: all 0.5s;
}

.pop-out-enter,
.pop-out-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
</style>
