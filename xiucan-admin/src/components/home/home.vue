<template>
  <div class="home">
      <header>
          <div class="logo">
            <img src="./xiucan.png" style="width:100%;">
          </div>
          <h1 style="text-align: center;font-size: 25px;margin-top: 15px;">秀餐餐饮管理系统</h1>
      </header>
      <div>
          <!-- <h4>我的餐厅</h4> -->
          <div class="store-list">
              <div v-if="prompting" class="promptingRegister">
                您未注册门店，<br><br>
                点击我要开店前往注册！
              </div>
              <ul v-else>
                  <li v-for="(item, index) in storeList" :key="index" @click="storeSelect(item)">
                      <div class="store-pic">
                          <img :src="item.logourl" v-if="item.logourl">
                          <div v-else style="transform: rotate(180deg)">
                            <i class="icon-arrow_lift"></i>
                          </div>
                      </div>
                      <span class="store-name">{{item.name}}</span>
                      <span class="storeAddress">{{item.city}}</span>
                  </li>
              </ul>
          </div>
      </div>
      <div style="width:90%;margin:0 auto;" @click="register = true">
        <x-button type="primary">我要开店</x-button>
      </div>
      <div v-transfer-dom>
        <loading :show="loading.isOPen" :text="loading.text"></loading>
      </div>

      <!-- 门店注册组件 -->
      <transition name="register">
        <register v-show="register" class="register"></register>
      </transition>
      <!-- 门店注册组件 -->

  </div>
</template>
<script type="text/javascript">
import axios from 'axios';
import { XButton, Loading, TransferDomDirective as TransferDom } from 'vux';
import register from 'components/admin/shop/register';
export default {
  data () {
    return {
      storeList: [],
      loading: {
        isOPen: false,
        text: '加载中'
      },
      register: false, // 门店注册组件
      prompting: false // 用于没有门店情况下的提示语
    };
  },
  activated () {
    // console.log('home.vue.activated' + sessionStorage.getItem('platformId'));
    if (sessionStorage.getItem('platformId')) {
      this.getStoreList();
    }
    this.$root.eventHub.$on('loadStore', () => { // 获取到openid后触发门店获取请求
      this.getStoreList();
    });
  },
  methods: {
    getStoreList () {
      this.loading.isOPen = true;
      // console.log('getStoreList' + sessionStorage.getItem('platformId'));
      axios.get('http://www.xiucan.com/api/v2/getCompanyInfo/' + sessionStorage.getItem('platformId')).then((res) => {
        this.storeList = res.data;
        if (this.storeList.length === 0) { // 该openid下没有门店
          this.prompting = true;
        }
        this.loading.isOPen = false;
        console.log('storeList=' + JSON.stringify(this.storeList));
      }).catch(() => {
        this.loading.isOPen = false;
      });
    },
    storeSelect (store) {
      console.log(JSON.stringify(store));
      this.$router.push({ name: 'manage', params: {cid: store.id, token: store.token} });
    }
  },
  components: {
    XButton,
    Loading,
    register
  },
  directives: {
    TransferDom
  }
};
</script>
<style type="text/css">
.home {
  background: white;
  position: absolute;
  min-height: 100%;
  width: 100%;
  padding-top: 30px;
}
.logo {
    height: 80px;
    width: 80px;
    margin: 0 auto;
    border-radius: 50%;
    background-size: cover;
}
.store-list { /*餐厅列表*/
    position: relative;
    /*min-height: 200px;*/
    height: 250px;
    margin: 20px 0;
    width: 100%;
    /*max-height: 300px;*/
    overflow-y: scroll;
}
.store-list::-webkit-scrollbar { /*隐藏滚动条*/
  display: none;
}
.store-list a {
    color: #333;
}
.store-list ul {
    margin: 0;
    padding: 0;
    list-style: none;
}
.store-list ul li {
    line-height: 40px;
    height: 60px;
    padding: 10px 0;
    border-bottom: 1px dashed #e6e6e6;
}
.toStoreManage {
    display: block;
    height: 100%;
}
.store-list ul li:last-child {
    border: none;
}
.store-pic { /*餐厅图片*/
    line-height: 40px;
    text-align: center;
    width: 40px;
    height: 40px;
    display: inline-block;
    border-radius: 5px;
    overflow: hidden;
    float: left;
    margin-left: 15px;
}
.store-pic img {
    width: 100%;
    height: 100%;
    vertical-align: baseline;
}
.store-name { /*餐厅名称*/
    float: left;
    margin-left: 15px;
}
.storeAddress { /*餐厅地址*/
    float: right;
    margin-right: 15px;
}
.promptingRegister {
    text-align: center;
    height: fit-content;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
/*门店注册组件*/
.register {
  top: 0
}
.register-enter-active, .register-leave-active {
  transition: all .5s;
}
.register-enter, .register-leave-active {
  transform: translate3d(100%, 0, 0)
}
</style>
