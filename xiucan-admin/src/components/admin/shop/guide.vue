<template>
    <div class="guide">
        <div class="success">恭喜您开通成功！ID：{{$route.params.cid}}</div>
        <!-- <div class="btnGroup">
            <div class="weui-btn weui-btn_primary" v-for="(item, index) in btnGroup" @click="btnFuc(item.id)">{{item.name}}</div>
        </div> -->

        <!-- 步骤条 start -->
        <div class="step">
          <step v-model="step" background-color='#fbf9fe' gutter="20px">
            <step-item></step-item>
            <step-item></step-item>
            <step-item></step-item>
          </step>
        </div>
        <!-- 步骤条 end -->
        <div class="guideFormTitle">
          <div :class="{cur: step == 0}">
            <span>创建桌台</span>
          </div>
          <div :class="{cur: step == 1}">
            <span>打印机配置</span>
          </div>
          <div :class="{cur: step == 2}">
            <span>添加菜品</span>
          </div>
        </div>
        <!-- 创建桌台  start -->
        <div v-if="step === 0">
            <group title="" class="guideForm">
                <x-input title="" name="name" placeholder="名称" v-model="tableData.name"></x-input>
                <x-input title="" name="code" placeholder="编码" v-model="tableData.tablecode"></x-input>
            </group>
            <div class="btn_wrap">
              <x-button type="primary" @click.native="save" class="btnStyle">保存</x-button>
            </div>
            <div class="btn_wrap" style="display:flex; justify-content: center;">
              <x-button type="primary" @click.native="prevStep" class="btnStyle" style="width: 40% !important; display:inline-block">上一步</x-button>
              <x-button type="primary" @click.native="nextStep" class="btnStyle" style="width: 40% !important; display:inline-block">下一步</x-button>
            </div>
            <div class="QR-code" style="text-align: center;">
              <ul>
                <li v-for="item in tableInfo">
                    <div>
                      <img :src="item.qrcodelink" style="width: 50px;">
                    </div>
                    <div style="font-size: 10px;">
                      <span style="vertical-align: middle;">{{item.code}}</span>
                      <span>
                        <a :href="item.eqimgurl" :download="item.id">
                          <icon type="download" style="font-size:inherit;"></icon>
                        </a>
                      </span>
                    </div>
                </li>
              </ul>
            </div>
        </div>
        <!-- 创建桌台  end -->

      <!-- 打印配置  start -->
        <div v-if="step === 1">
            <group title="" class="guideForm">
                <!-- <x-input title="" name="name" placeholder="打印机名称" v-model="printData.name"></x-input> -->
                <x-input title="" name="PrintID" placeholder="打印机编码" v-model="printData.code"></x-input>
            </group>
            <div class="btn_wrap">
              <x-button type="primary" @click.native="save" class="btnStyle">保存</x-button>
            </div>
            <div class="btn_wrap" style="display:flex; justify-content: center;">
              <x-button type="primary" @click.native="prevStep" class="btnStyle" style="width: 40% !important; display:inline-block">上一步</x-button>
              <x-button type="primary" @click.native="nextStep" class="btnStyle" style="width: 40% !important; display:inline-block">下一步</x-button>
            </div>
        </div>
      <!-- 打印配置  end -->

      <!-- loading start  -->
      <div v-show="toast.loading">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-loading weui-icon_toast" style="margin-left:0 !important;"></i>
            <p class="weui-toast__content">loading</p>
        </div>
      </div>
      <!-- loading   end   -->

      <!-- 成功提示    start -->
      <div v-show="toast.success" @click = "toast.success = false">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-icon-success-no-circle weui-icon_toast"></i>
            <p class="weui-toast__content">成功</p>
        </div>
      </div>
      <!-- 成功提示    end -->

      <!-- 失败提示   start -->
      <div v-show="toast.fail" @click = "toast.fail = false">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;padding:3px;margin-top:22px;"></i>
            <p class="weui-toast__content">失败</p>
            <p class="weui-toast__content">{{toast.failResult}}</p>
        </div>
      </div>
      <!-- 失败提示   end -->

    </div>
</template>
<script type="text/javascript">
import { Step, StepItem, XButton, Group, XInput, Icon } from 'vux';
import axios from 'axios';
export default {
  components: {
    Step,
    StepItem,
    XButton,
    Group,
    XInput,
    Icon
  },
  data () {
    return {
      tableData: {
        name: '',
        tablecode: ''
      },
      foodData: {
        name: '',
        price: Number,
        classify: ''
      },
      printData: {
        code: '',
        cid: 0
      },
      toast: {
        loading: false,
        success: false,
        fail: false,
        failResult: ''
      },
      step: 0,
      tableInfo: [] // 桌台二维码信息
    };
  },
  created () {},
  watch: {},
  methods: {
    save() {
      console.log('save' + this.step);
      switch (this.step) {
        case 0: if (this.tableData.name.length === 0) {
          console.log(this.tableData.name.length + ',' + this.tableData.name);
          this.toast.fail = true;
          this.toast.failResult = '桌号名称必填';
        }
        break;
        case 1: if (this.printData.code.length === 0) {
          this.toast.fail = true;
          this.toast.failResult = '打印机编码必填';
        }
        break;
      }
      this.toast.loading = true;
      if (this.step === 0) {
        // 创建桌台
        var tableUrl = 'http://www.xiucan.com/api/v2/addtable';
        var tableData = this.tableData;
        this.saveRequest(tableUrl, tableData);
      }
      if (this.step === 1) {
        // 打印配置
        var printUrl = 'http://www.xiucan.com/api/v2/indexTest.php/cloudprinter';
        this.printData.cid = this.$route.params.cid;
        var printData = this.printData;
        this.saveRequest(printUrl, printData);
      }
    },
    empty() {
      this.tableData = {};
      this.foodData = {};
      this.printData = {};
    },
    closeDialog() {
      this.dialogActive = '';
    },
    saveRequest(url, data) {
      var requestData = {};
      requestData.cid = this.$route.params.cid;
      if (this.step === 1) { // 打印配置数据
        requestData.code = data.code;
        requestData.name = data.name;
      } else {
        requestData.data = data;
      }
      console.log('saveRequest=' + url + JSON.stringify(requestData));
      axios.post(url, requestData).then((res) => {
        this.toast.loading = false;
        if (res.data.state === 1) {
          // 执行成功----------------
          this.toast.success = true;
          setTimeout(() => {
            this.toast.success = false;
          }, 300);
          this.empty();
          this.closeDialog();
          axios.get('http://www.xiucan.com/api/v2/getcloudbasedata/t' + requestData.cid + '').then((res) => {
            if (!res.data) {
              // console.log('showme');
              return;
            }
            this.$root.baseData = res.data;
            this.tableInfo = JSON.parse(JSON.stringify(res.data.tableInfo));
          });
        } else {
          // 执行失败----------------
          // this.toast.fail = true;
          // setTimeout(() => {
          //   this.toast.fail = false;
          // }, 1000);
          // alert(res.data.message);
        }
      }).catch(() => {
        this.toast.loading = false;
        this.toast.fail = true;
        setTimeout(() => {
          this.toast.fail = false;
        }, 1000);
      });
    },
    nextStep () {
      // 下一步
      this.step ++;
      if (this.step === 2) {
        this.$router.push({ name: 'goods', params: {token: this.$route.params.token} });
      }
    },
    prevStep () {
      // 上一步
      this.step --;
      if (this.step <= 0) {
        this.step = 0;
      }
    }
  }
};
</script>
<style type="text/css">
  .btnGroup {
    width: 90%;
    margin: 0 auto;
  }
  .btnStyle {
    width: 90% !important;
    margin: 15px 0;
  }
  .step {
    margin: 25px;
    margin-bottom: 10px;
  }
  .success {
    text-align: center;
    margin-bottom: 25px;
  }
  .dialogStyle label {
    max-width: none !important;
    width: max-content;
    font-weight: normal;
  }
  .guide {
    background: white;
    position: absolute;
    min-height: 100%;
    width: 100%;
    padding: 25px 0;
  }
  .guideForm {
    margin-top: 50px;
  }
  .guideForm .weui-cells {
  background: none !important;
  }
  .guideForm .weui-cell .weui-cell__hd {
    display: none;
  }
  .guideForm .weui-cell:before {
    right: 15px;
    z-index: auto;
  }
  .guideForm .weui-cells:before {
    border-top: 1px solid;
  }
  .guideForm .vux-cell-box:not(:first-child):before{
    width: auto;
  }
  .guideForm .weui-cells__title {
    text-align: center;
    margin-bottom: 15px;
  }
  .guideForm .weui-cells:after {
    z-index: auto;
  }
  .guideFormTitle{
    display: flex;
    padding: 0px 10px;
    justify-content: space-between;
    color: #929292;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .guideFormTitle .cur{
    color: #1aad19;
  }
  .QR-code {
    width: 90%;
    margin: 0 auto;
  }
  .Qr-code ul {
    display: flex;
    flex-wrap: wrap;
  }
  .QR-code li {
    margin: 5px;
    display: inline-block;
  }
</style>
