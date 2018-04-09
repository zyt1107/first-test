<template>
    <div class="edit-content">
        <!-- <h1 class="foodEdit-title">更新菜品</h1> -->
        <group title="基本信息" class="editForm">
            <x-input title="" name="name" placeholder="菜品名称" v-model="food.name"></x-input>
            <x-input title="" name="price" placeholder="价格" type="number" v-model="food.price"></x-input>
            <x-input title="" name="unit" placeholder="单位" v-model="food.unit"></x-input>
            <selector ref="defaultValueRef" title="" placeholder="分类" :options="optionList" v-model="food.sid"></selector>
        </group>
        <group title="&nbsp;" class="foodForm">
            <!-- <x-input title="" name="name" placeholder="菜品名称" v-model="food.name"></x-input>
            <x-input title="" name="unit" placeholder="单位" v-model="food.unit"></x-input>
            <x-input title="" name="price" placeholder="价格" v-model="food.price"></x-input>
            <selector ref="defaultValueRef" title="" :options="optionList" v-model="food.option"></selector> -->
        </group>
    </div>
</template>
<script type="text/javascript">
import axios from 'axios';
import { XInput, Group, XButton, Selector } from 'vux';
export default {
  data () {
    return {
      optionList: [],
      food: {
        name: '',
        price: '',
        unit: '',
        sid: ''
      }
    };
  },
  mounted () {
    // console.log('handlefood.vue.mounted' + JSON.stringify(this.$parent.selectedFood));
    if (this.$parent.selectedFood.id) {
      console.log('修改菜品');
      this.food = JSON.parse(JSON.stringify(this.$parent.selectedFood));
      this.food.sid = '';
    }
    var menuList = this.$parent.menuList;
    menuList.forEach((item) => {
      if (item.items) {
        for (var i = 0; i < item.items.length; i++) {
          if (item.items[i].id === this.food.id) {
            this.food.sid = item.id;
            break;
          }
        }
      }
      this.optionList.push({key: item.id, value: item.name});
    });
    // console.log(JSON.stringify(this.food));
  },
  methods: {},
  components: {
    XInput,
    Group,
    XButton,
    Selector
  }
};
</script>
<style type="text/css">
.edit-content {
  background: white;
  width: 100%;
  min-height: 100%;
}
.editForm .weui-cells {
  background: none !important;
}
.editForm .weui-cells:after {
  z-index: auto;
}
.editForm .weui-cell .weui-cell__hd {
  display: none;
}
.editForm .weui-cell:before {
  z-index: auto;
  right: 15px;
}
.editForm .weui-cells:before {
  border-top: 1px solid;
}
.editForm .vux-cell-box:not(:first-child):before{
  width: auto;
}
.foodEdit-title {
  font-size: 25px;
  font-weight: normal;
  text-align: center;
  margin: 25px;
}
/*--------------------------------------*/
.handleSave {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 25px;
}
</style>
