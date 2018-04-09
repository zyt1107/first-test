<template>
    <div>
      <h1 class="companyName">{{companyName}}</h1>
      <div class="report">
          <div class="report-item" v-for="(item, index) in btnGroup" @click="btnFuc(item.id)">
            <p style="margin-bottom:18px">{{item.name}}</p>
            <p style="color:red">{{item.value}}</p>
          </div>
          <div class="report-item" @click="navTo('overviewreport')">
            <p style="line-height:41px">更多数据</p>
          </div>
      </div>
      <div class="manage_content">
          <div class="nav" @click="navTo('diancai')">
            <img src="./manageimg/1.png">
            <span>下单</span>
          </div>
          <div class="nav">
            <img src="./manageimg/2.png">
            <span>收银</span>
          </div>
          <div class="nav">
            <img src="./manageimg/3.png">
            <span>记账</span>
          </div>
          <div @click="navTo('restaurantorder')" class="nav">
            <img src="./manageimg/4.png">
            <span>订单</span>
          </div>
          <div @click="navTo('reportlist')" class="nav">
            <img src="./manageimg/5.png">
            <span>报表</span>
          </div>
          <div class="nav" @click="navTo('goods')">
            <img src="./manageimg/6.png">
            <span>菜品</span>
          </div>
          <div class="nav">
            <img src="./manageimg/7.png">
            <span>外卖</span>
          </div>
          <div class="nav" @click="loadingData()">
            <img src="./manageimg/9.png">
            <span>数据同步</span>
          </div>
          <div class="nav" @click="navTo('setup')">
            <img src="./manageimg/8.png">
            <span>设置中心</span>
          </div>
      </div>
    </div>
</template>
<script type="text/javascript">
import axios from 'axios';
export default {
  data () {
    return {
      btnGroup: [],
      companyName: '', // 接口获取
      orderdetail: []
    };
  },
  created () {},
  activated() {
    axios.get('http://www.xiucan.com/api/v2/getstoreinfo/' + this.$route.params.token).then((res) => {
      this.companyName = res.data.name;
    }).catch((error) => {
      console.log(error);
    });
    this.initGroup();
    this.loadingData();
  },
  deactivated() {
    this.companyName = '';
    console.log(this.companyName);
  },
  methods: {
    btnFuc(btnValue) {},
    navTo(value) {
      if (value === 'diancai') {
        location.href = '../diancai?token=' + this.$route.params.token; // http://www.xiucan.com/diancai?token=
      } else {
        this.$router.push({name: value, params: {cid: this.$route.params.cid, token: this.$route.params.token}});
      }
    },
    initGroup() {
      this.btnGroup = [
        {id: 'IncomeToday', name: '今日收入', value: 0},
        {id: 'cash', name: '现金', value: '0.0'},
        {id: 'online', name: '在线', value: '0.0'},
        {id: 'SettlementAmount ', name: '已结算单额', value: 0},
        {id: 'SettlementAmountNum', name: '已结算订单数', value: 0}
      ];
    },
    chooseData() {
      this.orderdetail.forEach((item) => {
        item.dishinfo.forEach((dish) => {   // 计算今日收入
          this.btnGroup[0].value += parseFloat(dish.price) * dish.num;
        });
        if (item.paid === 1) {      // 计算已结算订单
          this.btnGroup[4].value += 1;   // 数目
          item.dishinfo.forEach((dish) => {
            this.btnGroup[3].value += parseFloat(dish.price) * dish.num;// 金额
          });
        }
      });
    },
    loadingData() {
      var url = 'http://www.xiucan.com/api/v2/orderdetail';
      var val = new Date((new Date()).toLocaleDateString()).valueOf();
      var data = {
        cid: this.$route.params.cid,
        starttime: parseInt(val / 1000),
        endtime: parseInt(new Date(new Date(new Date(val).getTime() + 24 * 60 * 60 * 1000 - 1)).valueOf() / 1000)
      };
      axios.post(url, data).then((res) => {
        console.log(res.data);
        if (res.data.state !== 1) {
          return;
        }
        this.orderdetail = res.data.results;
        this.chooseData();
      }).catch(() => {
        console.log('数据请求失败');
      });
      // 请求本地数据 start
      // axios.get('static/restaurantorderdata.json').then((res) => {
      //  console.log(res.data);
      //  if (res.data.state !== 1) {
      //    return;
      //  }
      //  this.orderdetail = res.data.results;
      //  this.chooseData();
      // }).catch(() => {
      //  console.log('数据请求失败');
      // });
      // // 请求本地数据 end
    }
  }
};
</script>
<style type="text/css">
  .companyName {
    text-align: center;
    font-size: 25px !important;
    background-color: #00a0dc;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
  .report{
    height: 100px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .report .report-item{
    width: 33.33%;
    padding: 13px 0;
    box-sizing: border-box;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
  }
  .report .report-item p{
    font-weight: bold;
    font-family: Microsoft YaHei;
  }
  .manage_content{
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 60%;
    display: flex;
    flex-wrap: wrap;
  }
  .manage_content .nav{
    width: 33.33%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
  }
  .manage_content .nav img{
    width: 40px;
    margin-top: 20px;
    margin-bottom: 4px;
    display: inline;
  }
</style>
