<template>
    <div>
      <!-- <div style="padding:15px;">
        <load-more tip="菜品管理" :show-loading="false" background-color="#fbf9fe"></load-more>
        <x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
            <tr>
              <th>名称</th>
              <th>价格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="(goodItem, goodIndex) in baseData.userDish" :key="goodIndex">
            <tr v-for="(foodItem, foodIndex) in goodItem.items" :key="foodIndex">
              <td>{{foodItem.name}}</td>
              <td>{{foodItem.price}}</td>
              <td class="handle">
                <x-button type="primary" mini class="btn">修改</x-button>
                <x-button type="warn" mini class="btn" @click.native="handleDelete(foodItem.id)">删除</x-button>
              </td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div v-transfer-dom>
        <alert v-model="alert"></alert>
      </div> -->
      <handle-food></handle-food>
    </div>
</template>
<script type="text/javascript">
import axios from 'axios';
// import { XTable, LoadMore, XButton, Alert, AlertModule, TransferDomDirective as TransferDom } from 'vux';
import HandleFood from 'components/admin/food/handleFood';
export default {
  data () {
    return {
      baseData: {},
      alert: false
    };
  },
  mounted () {
    console.log('food.vue.mounted');
    this.getBaseData();
  },
  methods: {
    handleDelete (foodID) {
      console.log('handleDelete' + foodID);
      // AlertModule.show({
      //   title: '',
      //   content: '危险操作，确认删除？',
      //   onShow () {
      //     console.log('Module: I\'m showing');
      //   },
      //   onHide () {
      //     axios.post('').then((res) => {});
      //   }
      // });
    },
    getBaseData () {
      var resUrl = 'http://www.xiucan.com/api/v2/getcloudbasedata/' + 't1276'; // sessionStorage.getItem('token')
      resUrl = 'static/data.json';
      axios.get(resUrl).then((res) => {
        this.baseData = res.data;
      });
    }
  },
  components: {
    // XTable,
    // LoadMore,
    // XButton,
    // Alert,
    HandleFood
  }
};
</script>
<style type="text/css">
    .handle {
        line-height: 100%;
    }
    .btn {
        padding: 0 5px !important;
        font-size: 10px !important;
        margin: 0 !important;
    }
</style>
