<template>
    <div class="print">
        <header class="print-header">
            <h1>打印机设置</h1>
        </header>
        <div class="print-content">
            <label>前台打印</label>
            <div class="print-item">
                <ul>
                    <li @click="printConfig">打印配置<i class="icon-arrow_lift"></i></li>
                    <li @click="dialog.useSet = true;">通用设置<i class="icon-arrow_lift"></i></li>
                </ul>
            </div>
        </div>
        <div class="print-content">
            <label>后厨打印</label>
            <div class="print-item">
                <ul>
                    <li>打印配置<i class="icon-arrow_lift"></i></li>
                    <li>通用设置<i class="icon-arrow_lift"></i></li>
                </ul>
            </div>
        </div>

        <!-- 打印配置  start -->
        <div v-if="dialog.print" class="">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__hd"><strong class="weui-dialog__title">打印配置</strong></div>
                <div class="weui-dialog__bd">
                    <group title="">
                        <!-- <x-input title="" name="name" placeholder="打印机名称" v-model="printData.name"></x-input> -->
                        <x-input title="" name="PrintID" placeholder="打印机编码" v-model="tempPrintData.code"></x-input>
                    </group>
                </div>
                <div class="weui-dialog__ft">
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="dialog.print = false;">取消</a>
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="printSave">确定</a>
                </div>
            </div>
        </div>
        <!-- 打印配置  end -->
      
        <!-- 通用设置 start -->
        <div v-if="dialog.useSet" class="">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__hd"><strong class="weui-dialog__title">通用设置</strong></div>
                <div class="weui-dialog__bd">
                    <div class="useSet">
                        <span>字体</span>
                        <div class="weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="small" style="margin:0;padding:0;">
                                <div >
                                    <input type="radio" class="weui-check" name="font" id="small"/>
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <p style="font-size:14px;">小字</p>
                            </label>
                        </div>
                        <div class="weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="big" style="margin:0;padding:0;">
                                <div >
                                    <input type="radio" class="weui-check" name="font" id="big"/>
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <p style="font-size:14px;">大字</p>
                            </label>
                        </div>
                    </div>
                    <div class="useSet">
                        <span>打印张数</span>
                        <input name="PrintID" v-model="tempPrintData.code"></input>
                    </div>
                    <div class="useSet">
                        <span>打印位置</span>
                        <div class="weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="head" style="margin:0;padding:0;">
                                <div >
                                    <input type="radio" class="weui-check" name="print" id="head"/>
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <p style="font-size:14px;">票头</p>
                            </label>
                        </div>
                        <div class="weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="foot" style="margin:0;padding:0;">
                                <div >
                                    <input type="radio" class="weui-check" name="print" id="foot"/>
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <p style="font-size:14px;">票尾</p>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="weui-dialog__ft">
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="dialog.useSet = false;">取消</a>
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="dialog.useSet = false;">确定</a>
                </div>
            </div>
        </div>
        <!-- 通用设置 end -->

        <toast ref="toast"></toast>
    </div>
</template>
<script type="text/javascript">
    import { Group, XInput, CheckIcon } from 'vux';
    import toast from 'components/toast/toast';
    import axios from 'axios';
    export default {
        components: {
            Group,
            XInput,
            toast,
            CheckIcon
        },
        data() {
            return {
                printData: {
                    // name: '',
                    code: ''
                },
                tempPrintData: {}, // 临时克隆数据
                dialog: {
                    print: false,
                    useSet: false
                }
            };
        },
        activated() {
            this.getPrintData();
        },
        methods: {
            getPrintData() {
                var cid = this.$route.params.cid;
                axios.get('http://www.xiucan.com/api/v2/getcloudprinter/' + cid).then((res) => {
                    console.log('getPrintData' + JSON.stringify(res.data));
                    if (res.data.state === 1) {
                        this.printData.code = res.data.code;
                    }
                }).catch((error) => {
                    console.log('getPrintData' + error);
                });
            },
            printConfig() { // 打印机配置dialog
                this.tempPrintData = JSON.parse(JSON.stringify(this.printData));  // 数据克隆
                this.dialog.print = true;
            },
            printSave() { // 打印机配置或修改
                this.$refs.toast.loading('处理中');
                var data = {};
                data.cid = this.$route.params.cid;
                data.code = this.tempPrintData.code;
                console.log(JSON.stringify(data));
                axios.post('http://www.xiucan.com/api/v2/cloudprinter', data).then((res) => {
                    console.log('printSave' + JSON.stringify(res.data));
                    this.$refs.toast.closeLoading();
                    if (res.data.state === 1) {
                        // 成功
                        this.printData.code = data.code;
                        this.dialog.print = false;
                        this.$refs.toast.toastShow('success', '成功');
                    } else {
                        // 失败
                        this.$refs.toast.toastShow('fail', '失败');
                        alert(res.data.message);
                    }
                }).catch((error) => {
                    this.$refs.toast.closeLoading();
                    this.$refs.toast.toastShow('fail');
                    console.log('printSave' + error);
                });
            }
        }
    };
</script>
<style type="text/css" scoped>
    .print label {
        font-weight: normal;
        padding: 10px;
    } 
    .print-header {
        background: #00a0dc;
        height: 50px;
        line-height: 50px;
    }
    .print-header h1 {
        color: white;
        text-align: center;
        font-size: 20px;
    }
    .print-item {
        background: white;
        padding: 0 10px;
    }
    .print-item li {
        padding: 15px 0;
        border-bottom: 1px solid #999;
    }
    .print-item li i {
        float:right;
        color:#333;
        transform:rotate(180deg);
    }
    .print-item li:last-child {
        border: none;
    }
    .print-content {
        margin: 10px 0;
    }
    .useSet {
        display: flex;
        align-items: center;
        padding: 10px 0;
        justify-content: space-between;
    }
    .useSet span {
        display: block;
        width: 100px;
        text-align: left;
    }
    .useSet input {
        outline: none;
        width: 50%;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
    }
</style>