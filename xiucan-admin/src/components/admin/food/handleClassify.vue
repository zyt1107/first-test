<template>
    <div class="classify-content">
        <!-- <h1 class="foodEdit-title">分类</h1> -->
        <group title="基本信息" class="classifyForm">
            <x-input title="" name="name" placeholder="分类名称" v-model="classify.name"></x-input>
            <!-- <x-input title="" name="name" placeholder="排序" v-model="classify.sort"></x-input> -->
        </group>
        <group title="&nbsp;" class="foodForm"></group>
    </div>
</template>
<script type="text/javascript">
import axios from 'axios';
import { XInput, Group, XButton, Selector } from 'vux';
export default {
  data () {
    return {
      classify: {
        name: ''
      }
    };
  },
  mounted () {
    console.log('classify.vue.mounted');
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
.classify-content {
  background: white;
  width: 100%;
  min-height: 100%;
}
.classifyForm .weui-cells {
  background: none !important;
}
.classifyForm .weui-cells:after {
  z-index: auto;
}
.classifyForm .weui-cell .weui-cell__hd {
  display: none;
}
.classifyForm .weui-cell:before {
  z-index: auto;
  right: 15px;
}
.classifyForm .weui-cells:before {
  border-top: 1px solid;
}
.classifyForm .vux-cell-box:not(:first-child):before{
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
