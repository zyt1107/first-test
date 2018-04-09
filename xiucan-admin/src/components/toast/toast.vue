<template>
    <div>
        <!-- loading start  -->
        <div v-show="toast.loading">
          <div class="weui-mask_transparent"></div>
          <div class="weui-toast">
              <i class="weui-loading weui-icon_toast" style="margin-left:0 !important;"></i>
              <p class="weui-toast__content">{{toast.toastText}}</p>
          </div>
        </div>
        <!-- loading   end   -->

        <!-- 成功提示    start -->
        <div v-show="toast.success">
          <div class="weui-mask_transparent"></div>
          <div class="weui-toast">
              <i class="weui-icon-success-no-circle weui-icon_toast"></i>
              <p class="weui-toast__content">{{toast.toastText}}</p>
          </div>
        </div>
        <!-- 成功提示    end -->

        <!-- 失败提示   start -->
        <div v-show="toast.fail">
          <div class="weui-mask_transparent"></div>
          <div class="weui-toast">
              <i class="weui-icon-warn weui-icon_msg" style="font-size:50px;padding:3px;margin-top:22px;"></i>
              <p class="weui-toast__content">{{toast.toastText}}</p>
          </div>
        </div>
        <!-- 失败提示   end -->
    </div>
</template>
<script type="text/javascript">
    export default {
        data() {
            return {
                toast: {
                  loading: false,
                  success: false,
                  fail: false,
                  toastText: ''
                }
            };
        },
        methods: {
            toastShow(value, text) {
                this.toast.toastText = text;
                if (value === 'success') {
                  this.toast.success = true;
                  setTimeout(() => {
                    this.toast.success = false;
                    this.toast.toastText = '';
                  }, 300);
                }
                if (value === 'fail') {
                  this.toast.fail = true;
                  setTimeout(() => {
                    this.toast.fail = false;
                    this.toast.toastText = '';
                  }, 300);
                }
            },
            loading(text) {
                this.toast.toastText = text;
                this.toast.loading = true;
            },
            closeLoading() {
                this.toast.loading = false;
                this.toast.toastText = '';
            }
        }
    };
</script>