<template>
    <div>
        <header class="table-header">
            <h1>桌台管理<span @click="beforeTableDialog('add')">新建</span></h1>
        </header>

        <!-- 筛选按钮组 start -->
        <div class="tableBtnGroup">
            <div class="tableBtnGroup-item">
                <button :class="[ btnActiveStyle.typeIndex === -1 ? btnActiveStyle.class : '' ]" @click="btnActive(-1, 'type')">全部</button>
                <button v-for="(item, index) in typeOptionList" :class="[ btnActiveStyle.typeIndex === index ? btnActiveStyle.class : '' ]" @click="btnActive(index, 'type', item)">{{item.value}}</button>
            </div>
            <div class="tableBtnGroup-item">
                <button v-for="(item, index) in stateOptionList" :class="[ btnActiveStyle.stateIndex === index ? btnActiveStyle.class : '' ]" @click="btnActive(index, 'state', item)">{{item.value}}</button>
                <button :class="[ btnActiveStyle.stateIndex === -1 ? btnActiveStyle.class : '' ]" @click="btnActive(-1, 'state')">全部</button>
            </div>
        </div>
        <!-- 筛选按钮组 end -->

        <!-- 搜索 start -->
        <div class="search">
            <x-input name="search" placeholder="输入关键字" v-model="filterValue.serarchContent"></x-input>
        </div>
        <!-- 搜索 end -->

        <!-- 桌台 start -->
        <div v-if="tableDialog.isOpen" class="handleTable">
            <div class="weui-mask"></div>
            <div class="weui-dialog dialogStyle">
                <div class="weui-dialog__hd" style="display: flex;justify-content: center;align-items: center;">
                    <img src="./qrcode.png" style="position:absolute;left:40px;" @click="qrcodeShow(tableData.qrcodelink)" v-if="tableDialog.type === 'update'">
                    <strong class="weui-dialog__title">{{tableDialog.text}}</strong>
                </div>
                <div class="weui-dialog__bd">
                    <group title="" class="">
                        <x-input title="桌名" name="name" v-model="tableData.name"></x-input>
                        <x-input title="桌号" name="code" v-model="tableData.code"></x-input>
                        <x-input title="人数" name="num" v-model="tableData.num"></x-input>
                        <selector title="类型" direction="rtl" :options="typeOptionList" v-model="tableData.type"></selector>
                        <selector title="状态" direction="rtl" :options="stateOptionList" v-model="tableData.status"></selector>
                    </group>
                </div>
                <div class="weui-dialog__ft">
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="tableDialog.isOpen = false; empty()">取消</a>
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="handleTable(tableDialog.type)">确定</a>
                </div>
            </div>
        </div>
        <!-- 桌台 end -->

        <!-- 二维码展示 start -->
        <div v-transfer-dom>
          <x-dialog :show.sync="QRcode.isShow" class="dialog-demo qr-code">
            <div class="img-box">
              <img :src="QRcode.url" style="max-width:100%">
            </div>
            <div style="margin-top:15px;">
              <img src="./close.png" @click="QRcode.isShow=false">
            </div>
          </x-dialog>
        </div>
        <!-- 二维码展示 start -->

        <scroller ref="tableScroller" lock-x :scrollbar-y=false height="-200" :pulldown-config="{downContent: '下拉刷新', upContent: '释放后更新'}" :use-pulldown=true @on-pulldown-loading="pulldownLoading">
          <div class="tableInfo" :style="{ width: tableInfoWidth + 'px' }">
            <div v-for="(item, index) in filterTableInfo" class="tableInfo-item">
                <div @click="beforeTableDialog('update', item)">
                    <span>{{item.code}}/{{item.name}}</span>
                    <span>{{tableTypeMap[item.type]}}</span>
                    <span>{{item.num}}/人</span>
                </div>
            </div>
          </div>
        </scroller>

        <toast ref="toast"></toast>
    </div>
</template>
<script type="text/javascript">
    import { XButton, Group, XInput, Selector, Scroller, XDialog, TransferDomDirective as TransferDom } from 'vux';
    import toast from 'components/toast/toast';
    import axios from 'axios';
    export default {
        directives: {
            TransferDom
        },
        components: {
            XButton,
            Group,
            XInput,
            Selector,
            Scroller,
            XDialog,
            toast
        },
        data() {
            return {
                tableTypeMap: { 1: '包间', 0: '大厅', 2: '其他' },
                tableStateMap: { 0: '空闲', 1: '占用', 2: '停用' },
                typeOptionList: [ // 餐桌类型
                    {key: 1, value: '包间'},
                    {key: 0, value: '大厅'},
                    {key: 2, value: '其他'}
                ],
                stateOptionList: [ // 餐桌状态
                    {key: 0, value: '空闲'},
                    {key: 1, value: '占用'},
                    {key: 2, value: '停用'}
                ],
                tableData: {
                    name: '',
                    code: '',
                    num: '',
                    type: '',
                    status: ''
                },
                tableInfo: [{
                    name: '',
                    code: '',
                    num: '',
                    type: '',
                    status: ''
                }],  // 该门店下桌台信息
                tableDialog: {
                    isOpen: false,
                    text: String,
                    type: String
                },
                btnActiveStyle: { // 按钮选中样式
                    typeIndex: Number,
                    stateIndex: Number,
                    class: 'btnActiveClass'
                },
                filterValue: { // 筛选过滤
                    serarchContent: '', // 搜索
                    tableType: -1,
                    tableState: -1
                },
                tableInfoWidth: Number, // tableInfo盒子宽度
                QRcode: { // 桌台二维码展示
                    url: '',
                    isShow: false
                }
            };
        },
        computed: {
            filterTableInfo() {
                var tableInfo = this.tableInfo;
                var tableType = this.filterValue.tableType;
                var tableState = this.filterValue.tableState;
                var serarchContent = this.filterValue.serarchContent;
                // console.log(tableType + '--' + tableState + '--' + serarchContent);
                // 过滤餐桌状态
                if (tableState !== -1) {
                    tableInfo = tableInfo.filter((item) => {
                        return item.status === tableState;
                    });
                }
                // 过滤餐桌类型
                if (tableType !== -1) {
                    tableInfo = tableInfo.filter((item) => {
                        return item.type === tableType;
                    });
                }
                // 过滤搜索内容
                if (serarchContent) {
                    tableInfo = tableInfo.filter((item) => {
                        if (item.name.indexOf(serarchContent.trim()) !== -1) {
                            return item;
                        }
                    });
                }
                return tableInfo;
            }
        },
        mounted() {
            // 计算tableInfo盒子宽度 start
            // tableInfo子元素盒子(桌台卡片信息展示)宽100，margin：10，共120
            var numbers = parseInt(document.documentElement.clientWidth / 120);
            this.tableInfoWidth = 120 * numbers;
            window.addEventListener('resize', () => {
                numbers = parseInt(document.documentElement.clientWidth / 120);
                this.tableInfoWidth = 120 * numbers;
            });
            // 计算tableInfo盒子宽度 end
        },
        activated() {
            this.getTableInfo();
            // console.log(this.tableInfoWidth);
        },
        methods: {
            beforeTableDialog(value, data) { // tableDialog
                // console.log(value);
                this.tableDialog.isOpen = true;
                if (value === 'add') {
                    this.tableDialog.text = '新增桌台';
                    this.tableDialog.type = 'add';
                }
                if (value === 'update') {
                    this.tableDialog.text = '更新桌台';
                    this.tableData = JSON.parse(JSON.stringify(data));
                    this.tableDialog.type = 'update';
                }
            },
            handleTable(type) { // 新增桌台
                this.$refs.toast.loading('处理中');
                console.log(type);
                var tableData = this.tableData;
                var requestUrl;
                var data = {};
                data.cid = this.$route.params.cid;
                var dataChild = {};
                // 根据所需字段转换
                dataChild.name = tableData.name; // 桌名
                dataChild.status = tableData.status; // 状态
                dataChild.num = tableData.num; // 人数
                dataChild.isbox = tableData.type; // 类型
                if (type === 'add') {
                    requestUrl = 'http://www.xiucan.com/api/v2/addtable';
                    dataChild.tablecode = tableData.code; // 桌号
                }
                if (type === 'update') {
                    requestUrl = 'http://www.xiucan.com/api/v2/updatetable';
                    data.id = tableData.id;
                }
                data.data = dataChild;
                console.log('handleTable' + JSON.stringify(data));
                axios.post(requestUrl, data).then((res) => {
                    console.log(JSON.stringify(res));
                    this.$refs.toast.closeLoading();
                    if (res.data.state === 1) {
                        // 成功
                        this.tableDialog.isOpen = false;
                        this.empty();
                        this.$refs.toast.toastShow('success', '成功');
                    } else {
                        this.$refs.toast.toastShow('fail', '失败');
                    }
                }).catch((error) => {
                    console.log(error);
                    this.$refs.toast.closeLoading();
                    this.$refs.toast.toastShow('fail', '失败');
                });
            },
            btnActive(index, value, item) { // 筛选
                if (value === 'type') { // 类型
                    this.btnActiveStyle.typeIndex = index;
                    if (item) {
                        this.filterValue.tableType = item.key;
                    } else {
                        this.filterValue.tableType = -1;
                    }
                }
                if (value === 'state') { // 状态
                    this.btnActiveStyle.stateIndex = index;
                    if (item) {
                        this.filterValue.tableState = item.key;
                    } else {
                        this.filterValue.tableState = -1;
                    }
                }
            },
            getTableInfo(value) {
                this.$refs.toast.loading('加载中');
                var requestUrl = 'http://www.xiucan.com/api/v2/getcloudbasedata/' + this.$route.params.token;
                // requestUrl = 'static/data.json';
                axios.get(requestUrl).then((res) => {
                    this.$refs.toast.closeLoading();
                    // console.log(JSON.stringify(res.data.tableInfo));
                    this.tableInfo = res.data.tableInfo;
                    if (value === 'pulldown') {
                        this.$refs.tableScroller.reset({top: 0});
                    }
                }).catch((error) => {
                    this.$refs.toast.closeLoading();
                    if (value === 'pulldown') {
                        this.$refs.tableScroller.reset({top: 0});
                    }
                    console.log('getTableInfo' + error);
                });
            },
            empty() {
                this.tableData = {};
            },
            pulldownLoading() {
                console.log('下拉刷新');
                this.getTableInfo('pulldown');
            },
            qrcodeShow(url) { // 二维码展示
                this.tableDialog.isOpen = false;
                this.QRcode.isShow = true;
                this.QRcode.url = url;
            }
        }
    };
</script>
<style type="text/css">
    .table-header {
        background: #00a0dc;
        height: 50px;
        line-height: 50px;
    }
    .table-header h1 {
        color: white;
        text-align: center;
        font-size: 20px;
    }
    .table-header h1 span {
        font-size: 16px;
        position: absolute;
        right: 15px;
    }
    /*新增*/
    .handleTable .weui-cell .weui-cell__hd label {
        text-align: left;
    }
    .handleTable .weui-cell {
        border-bottom: 1px dashed #e5e5e5;
    }
    .handleTable .weui-cell:last-child {
        border: none;
    }
    /*筛选按钮*/
    .tableBtnGroup {
        padding: 0 10px;
    }
    .tableBtnGroup-item {
        display: flex;
        margin: 10px 0;
    }
    .btnActiveClass {
        background: #00a0dc !important;
        color: white;
    }
    .tableBtnGroup button {
        flex: 1;
        border-radius: 5px;
        background: white;
        border: 1px solid #00a0dc;
        padding: 7px 0;
        margin: 0 5px;
        font-size: 14px;
        outline: none;
    }
    /*搜索*/
    .search {
        background: #e5e5e5;
    }
    .search .weui-input {
        background: white;
        border-radius: 5px;
        height: 35px;
        padding: 0 10px;
    }
    /*桌台展示*/
    .tableInfo {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
    }
    .tableInfo-item {
        background: #00a0dc;
        height: 100px;
        width: 100px;
        margin: 10px;
        color: white;
        text-align: center;
        display: table;
    }
    .tableInfo-item div {
        display: table-cell;
        vertical-align: middle;
    }
    .tableInfo-item span {
        display: block;
        padding: 5px 0;
    }
    .qr-code .weui-dialog {
        background: none;
    }
</style>