<template>
    <div>
        <header class="setup-header">
            <h1>设置中心</h1>
        </header>
        <div class="setup-content">
            <ul>
                <li @click="setUpSelect('shopmanage')">
                    <span>餐厅管理</span>
                    <i class="icon-arrow_lift"></i>
                </li>
                <li @click="setUpSelect('table')">
                    <span>桌台管理</span>
                    <i class="icon-arrow_lift"></i>
                </li>
                <li @click="setUpSelect('print')">
                    <span>打印机设置</span>
                    <i class="icon-arrow_lift"></i>
                </li>
                <!-- <li>
                    <span>二维码下载</span>
                    <i class="icon-arrow_lift"></i>
                </li> -->
            </ul>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        data () {
            return {

            };
        },
        methods: {
            setUpSelect(value) {
                this.$router.push({name: value, params: {cid: this.$route.params.cid, token: this.$route.params.token}});
            }
        }
    };
</script>
<style type="text/css">
    .setup-header {
        background: #00a0dc;
        height: 50px;
        line-height: 50px;
    }
    .setup-header h1 {
        color: white;
        text-align: center;
        font-size: 20px;
    }
    .setup-content {
        width: 90%;
        padding: 0 5px;
        border: 1px solid #c8c8cd;
        margin: 15px auto;
        border-radius: 5px;
        background: white;
    }
    .setup-content a {
        color: #333;
    }
    .setup-content ul li {
        padding: 15px;
        border-bottom: 1px solid #c8c8cd !important;
    }
    .setup-content ul li:last-child {
        border: none !important;
    }
    .setup-content ul li i {
        float:right;
        color:#333;
        transform:rotate(180deg);
    }
</style>