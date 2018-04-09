<template>
    <div class="shopManage">
        <header class="shop-header">
            <h1>餐厅管理</h1>
        </header>
        <div class="shop-content">
            <group title="" class="shop-content-form">
                <div class="shop-content-logo">
                    <label>餐厅封面</label>
                    <div class="image" align="right">
                        <div v-if="store.logourl">
                            <img :src="store.logourl">
                            <button @click="upLoad">修改图片</button>
                        </div>
                        <div v-else class="upload" @click="upLoad">+</div><!-- upload类在upload组件 -->
                    </div>
                </div>
                <div style="clear:both;"></div>
                <x-input title="餐厅名称" name="name" v-model="store.name"></x-input>
                <x-address title="所在城市" raw-value :list="addressData" value-text-align="right" hide-district v-model="store.city" class="range-address"></x-address>
                <x-input title="详细地址" name="address" v-model="store.address"></x-input>
                <div class="range">
                    <span style="flex:1;">经纬度</span>
                    <div style="flex:1;">{{store.longitude}}</div>
                    <div style="flex:1;">{{store.latitude}}</div>
                    <div style="flex:0.5;">
                        <button>校准</button>
                    </div>
                </div>
                <x-input title="营业电话" name="tel" keyboard="number" is-type="china-mobile" v-model="store.tel"></x-input>
                <x-input title="人均消费" v-model="store.price"></x-input>
                <selector title="餐饮分类" direction="rtl" :options="optionList" v-model="store.type"></selector>
                <x-textarea title="餐厅简介" v-model="store.introduction"></x-textarea>
                <div class="timeBtn">
                    <label style="flex:1;margin:0;">营业时间</label>
                    <div style="flex:1">
                        <button type="primary" @click="timeSelect('start')">{{store.starttime}}</button>
                    </div>
                    <div style="flex:0.2">
                        --
                    </div>
                    <div style="flex:1">
                        <button type="primary" @click="timeSelect('end')">{{store.endtime}}</button>
                    </div>
                </div>
                <div class="shopmanage-handle">
                    <div class="shopmanage-handle-reset">
                        <button type="primary" @click="reset">重置</button>
                    </div>
                    <div class="shopmanage-handle-save">
                        <button type="primary" @click="save">保存</button>
                    </div>
                </div>
            </group>
        </div>
        <up-load ref="upload" @uploadFile="uploadFile"></up-load>
        <toast ref="toast"></toast>
    </div>
</template>
<script type="text/javascript">
    import { XInput, Group, XAddress, ChinaAddressV4Data, XButton, CheckIcon, Selector, Value2nameFilter as value2name, Loading, TransferDomDirective as TransferDom
    , XTextarea, Datetime} from 'vux';
    import UpLoad from 'components/admin/upload/upload';
    import axios from 'axios';
    import toast from 'components/toast/toast';
    export default {
        components: {
            XInput,
            Group,
            XAddress,
            XButton,
            CheckIcon,
            Selector,
            Loading,
            XTextarea,
            Datetime,
            UpLoad,
            toast
        },
        directives: {
            TransferDom
        },
        data () {
            return {
                addressData: ChinaAddressV4Data,
                optionList: [
                    {key: 0, value: '中餐'}
                ],
                store: {}, // 门店信息
                tempStore: {},
                formData: new FormData()
            };
        },
        activated() {
            this.getStoreInfo();
        },
        deactivated() {
            this.store = {};
        },
        methods: {
            timeSelect(timeline) {
                var self = this;
                self.$vux.datetime.show({
                    cancelText: '取消',
                    confirmText: '确定',
                    format: 'HH:mm',
                    value: '', // 客户端时间
                    onConfirm (val) {
                      console.log('plugin confirm', val);
                      if (timeline === 'start') {
                        self.store.starttime = val;
                      }
                      if (timeline === 'end') {
                        self.store.endtime = val;
                      }
                    },
                    onShow () {
                      console.log('plugin show');
                    },
                    onHide () {
                      console.log('plugin hide');
                    }
                });
            },
            upLoad() {
                this.$refs.upload.inputFocus();
            },
            uploadFile(formData) {
                console.log(formData.get('file'));
                this.store.logourl = window.URL.createObjectURL(formData.get('file'));
                this.formData = formData;
            },
            getStoreInfo() {
                this.$refs.toast.loading('加载中');
                var token = this.$route.params.token;
                axios.get('http://www.xiucan.com/api/v2/getstoreinfo/' + token).then((res) => {
                    this.$refs.toast.closeLoading();
                    console.log('getStoreInfo' + JSON.stringify(res.data));
                    this.store = res.data;
                    this.store.city = [this.store.city.split(' ')[0], this.store.city.split(' ')[1]];
                    this.tempStore = JSON.parse(JSON.stringify(this.store)); // 副本
                }).catch((error) => {
                    console.log('getStoreInfo' + error);
                    this.$refs.toast.closeLoading();
                });
            },
            save() {
                this.$refs.toast.loading('处理中');
                var requestUrl = 'http://www.xiucan.com/api/v2/updateCompanyInfo';
                var data = JSON.parse(JSON.stringify(this.store));
                if (data.city) {
                    data.city = value2name(data.city, ChinaAddressV4Data);
                }
                var now = new Date();
                // 时间戳转换
                if (data.starttime) {
                    data.starttime = now.setHours(data.starttime.split(':')[0], data.starttime.split(':')[1], 0, 0) / 1000;
                }
                if (data.endtime) {
                    data.endtime = now.setHours(data.endtime.split(':')[0], data.endtime.split(':')[1], 0, 0) / 1000;
                }
                var requestData = this.formData;
                requestData.set('store', JSON.stringify(data));
                console.log('门店更新' + requestData.get('store'));
                axios({
                    method: 'post',
                    url: requestUrl,
                    data: requestData,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then((res) => {
                    console.log('shopmanage-save' + JSON.stringify(res.data));
                    this.$refs.toast.closeLoading();
                    if (res.data.status === 1) {
                        // 执行成功
                        this.getStoreInfo();
                        this.$refs.toast.toastShow('success', '成功');
                        this.formData = new FormData();
                    } else {
                        // 执行失败
                        this.$refs.toast.toastShow('fail', '失败');
                        // alert(res.data.msg + '，请重试！');
                    }
                }).catch((error) => {
                    console.log('shopmanage-save' + error);
                    this.$refs.toast.closeLoading();
                    this.$refs.toast.toastShow('fail', '失败');
                });
            },
            reset() {
                // console.log('reset' + JSON.stringify(this.tempStore));
                this.store = JSON.parse(JSON.stringify(this.tempStore));
            }
        }
    };
</script>
<style type="text/css">
    .shop-content-form .weui-input {
        text-align: right;
    }
    .shop-content-form .weui-cells {
        background: none !important;
    }
    .shop-content-form .weui-cell .weui-cell__hd label {
        font-weight: normal;
        text-align: left;
    }
    .shop-content-form .weui-cell:before {
        right: 15px;
    }
    .shop-content-form .weui-cells:before {
        border-top: 1px solid;
    }
    .shop-content-form .vux-cell-box:not(:first-child):before{
         width: auto;
    }
    .shop-content-form .weui-textarea {
        background: #e5e5e5;
        border-radius: 10px;
        padding: 5px;
    }
    /*---------------------------*/
    .shopManage {
        position: absolute;
        width: 100%;
        background: white;
        min-height: 100%;
    }
    .shop-header {
        background: #00a0dc;
        height: 50px;
        line-height: 50px;
    }
    .shop-header h1 {
        color: white;
        text-align: center;
        font-size: 20px;
    }
    .shop-content {
        padding: 0 5px;
        border-radius: 5px;
        background: white;
        z-index: 1;
        position: relative;
    }
    .timeBtn {
        display: flex;
        margin: 0 15px;
        border-top: 1px solid #e5e5e5;
        align-items:center;
        padding: 10px 0;
    }
    .timeBtn label {
        font-weight: normal;
    }
    .timeBtn div {
        display: flex;
        justify-content: center;
    }
    .timeBtn button {
        width: 70%;
        border: none;
        outline: none;
        border-radius: 5px;
        font-size: 14px;
        padding: 2px 0;
        min-height: 24px;
    }
    .shop-content-logo {
        margin: 0 15px;
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between
    }
    .shop-content-logo label {
        font-weight: normal;
        margin-bottom: 0;
    }
    .shop-content-logo .image {
        display: inline-block;
    }
    .shop-content-logo .image img {
        height: 50px;
        width: 50px;
        display: block;
        border-radius: 5px;
    }
    .shop-content-logo .image button {
        display: block;
        font-size: 10px;
        border-radius: 5px;
        border: none;
        outline: none;
        background: #00a0dc;
        color: white;
        padding: 2px 5px;
        margin-top: 5px;
    }
    .shopmanage-handle {
        text-align: center;
        padding: 10px;
        display: flex;
    }
    .shopmanage-handle div {
        flex: 1;
    }
    .shopmanage-handle button {
        border: none;
        outline: none;
        background: #00a0dc;
        color: white;
        padding: 5px 0;
        border-radius: 5px;
        width: 80%;
    }
    .range {
        position: relative;
        padding: 10px 15px;
        display: flex;
    }
    .range div {
        display: flex;
        justify-content: center;
    }
    .range:before, .range-address:before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 15px;
        height: 1px;
        border-top: 1px solid #e5e5e5;
        color: #e5e5e5;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        left: 15px;
        z-index: 2;
    }
    .range button {
        border:none;
        outline:none;
        border-radius:5px;
        font-size:12px;
        padding:2px 5px;
        display:table;
        float:right;
    }
</style>