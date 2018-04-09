<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>

    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      goods: {
        type: Array
      },
      food: {
        type: Object
      }
    },
    data() {
      return {
        memostr: null,    // by xiaozc
        memostrlist: null
      };
    },
    mounted() {
      var self = this;
      self.$root.eventHub.$on('postMemoProcess', function(res) {
        if (res.id === self.food.id) {    // by xiaozc. 仅对当前点击的菜品处理
          // console.log('myfood.id=' + self.food.id);
          console.log('carcontrol.mounted1.count=' + self.$root.cartControlMountedCount);
          if (self.$root.cartControlMountedCount > 0) {
            self.$root.cartControlMountedCount = 0;
            return;   // by xiaozc
          }
          self.$root.cartControlMountedCount++;

//          console.log('res=' + res);
          self.changeFoodCount();
          self.$emit('add', event.target);
        }
      });
      self.$root.eventHub.$on('emptyCart', function(res) {
//        var selectFoods = res.data;
        if (self.goods) {
          self.goods.forEach((good) => {
            good.foods.forEach((food) => {
              if (food.count) {
                food.count = 0;
                food.memostr = ''; // 清空购物车同时清除备注，避免再次点菜会一直出现备注（memorequired = 0）
              }
            });
          });

          if (self.$root.cloneFoodList) {
            for (var i = 0; i < self.$root.cloneFoodList.length; i++) {
              self.$root.cloneFoodList[i].count = 0;
            }
            self.$root.cloneFoodList = null;
          }
        }
      });
      self.$root.eventHub.$on('changeChopsticks', function(res) {     // 同步餐具数量 shopCart -> cartcontrol  by limengxu
        let ChopsticksNum;
        if (res.chopsticksJudge) {
          self.$root.peopleNum = Number(res.peopleNum);
          ChopsticksNum = self.$root.peopleNum;
        } else {
          ChopsticksNum = res.peopleNum;
        }
        // console.log('changeChopstickspeopleNum : ' + self.$root.peopleNum);
        let peopleNum = ChopsticksNum;
        if (!self.$root.baseData.hotel.chopstick) {   // 如果餐厅没有提供筷子选项，则return
          return;
        }
        if (self.food.id === self.$root.baseData.hotel.chopstick.id) {
          // console.log(self.food);
          let currentFood = self.food;
          if (!currentFood.count) {
            Vue.set(currentFood, 'count', peopleNum);
          } else {
            currentFood.count = peopleNum;
          }
          if (self.$root.peopleNum !== 0) {
            self.$root.eventHub.$emit('lastHandleFood', {'food': currentFood, 'type': '2', 'chopsticksJudge': res.chopsticksJudge}); // type = 2 同步筷子数量
            self.$emit('add', event.target);
          }
        }
      });
    },
    methods: {
      getTargetFoods () {
        let targetFoods = [];
        if (this.goods) {
          this.goods.forEach((good) => {
            good.foods.forEach((food) => {
              if (food.id === this.food.id) {
                // console.log('zzzgood.id=' + good.id + ', this.food.memostr=' + this.food.memostr + ', this.food.memostrlist.size=' + this.food.memostrlist.size + ', food.memostrlist.size=' + food.memostrlist.size);
                if (this.food.memostr && !this.food.memostrlist) {
                  food.memostr = this.food.memostr;   // by xiaozc. 解决点击推荐菜类别时备注同步的问题
                  if (food.memostrlist) {
                    food.memostrlist.push(food.memostr);
                  }
                  console.log('cartcontrol.goods.food.id=' + food.id + 'food.memorequired=' + food.memorequired + ', good.id=' + good.id + ', food.count=' + food.count + ', foodJson=' + JSON.stringify(food));
                }
                if (!food.step) {
                  food.step = 1;
                }
                targetFoods.push(food);
              }
            });
          });
        } else {
          if (!this.food.step) {
            this.food.step = 1;
          }
          targetFoods.push(this.food);
        }
        return targetFoods;
      },
      changeFoodCount() {         // 增加餐具数量
        let targetFoods = this.getTargetFoods();
        // console.log('this.$root.peopleNum:' + this.$root.peopleNum);
        let peopleNum = this.$root.peopleNum;
        console.log('targetFoods.length=' + targetFoods.length);
        for (var i = 0; i < targetFoods.length; i++) {
          var currentFood = targetFoods[i];
          if (!currentFood.count) {
            Vue.set(currentFood, 'count', currentFood.step);
            this.$emit('add', event.target);
            console.log('targetFood.add=' + currentFood.id);
          } else {
            currentFood.count += currentFood.step;
            this.$emit('add', event.target);
            // console.log('------bindChopstickeCount-------' + currentFood.count);
            let max = Math.max.apply(null, this.$root.peopleList);
            if (currentFood.count > max && this.$root.baseData.hotel.chopstick && currentFood.id === this.$root.baseData.hotel.chopstick.id) {    // 最大人数设为数组最大值
              currentFood.count = max;
              return;
            }
          }
          if (this.$root.baseData.hotel.chopstick) {
            if (peopleNum !== currentFood.count && currentFood.id === this.$root.baseData.hotel.chopstick.id) { // 当人数不等于食品的数量且当前食物是筷子时为true by limengxu
              console.log('cartcontrl-bindChopstickeCount:' + currentFood.count);
              this.$root.peopleNum = currentFood.count;
              // this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': true});  // 将勾选框勾起状态 返回给shopCart
            }
          }
        }
      },
      addCart(event) {
//        if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl
//          return;
//        }
        console.log('cartcontrol.addCart.begin');
//        console.log('this.food=' + JSON.stringify(this.food));
//        console.log('food.memorequired=' + this.food.memorequired);
//        console.log('cartcontrol.addCart.food=' + JSON.stringify(this.food));
//        console.log('cartcontrol.addCart.event=' + JSON.stringify(event));
//        this.food.memorequired = 0;

        /*
          memorequired:
            0 不是必须备注。合并菜单同类项。默认值。
            1 不是必须备注。不合并菜单同类项。
            2 必须备注。数量不限制。不合并菜单同类项。
            3 必须备注。且双拼，即必须选择2个。不合并菜单同类项
        */
        if (!this.food.memorequired || this.food.memorequired === 0) {
//          console.log('cartcontrol.addCart.changeFoodCount');
          this.changeFoodCount();
          this.$root.eventHub.$emit('lastHandleFood', {'food': this.food, 'type': '1', 'chopsticksJudge': true});    // 向goods传输，值为当前食物与操作类型，目的：同步同桌点菜功能
        }
        if (this.food.memorequired === 1 || this.food.memorequired === 2 || this.food.memorequired === 3) {
          console.log('cartcontrol.addCart.openMemo.food.memorequired=' + this.food.memorequired);
          this.$root.eventHub.$emit('openMemo', this.food);
          console.log('cartcontrol.addCart.openMemo.end.food=' + JSON.stringify(this.food));
        }
      },
      decreaseCart(event) {
//        if (!event._constructed) { // 更新vue-scroller 启用浏览器点击事件 不在从新注册 by wangl
//          return;
//        }
        this.$root.eventHub.$emit('decreaseTempMemo', this.food); // 出发decreaseTempMemo,接收端在goods.vue,用于在减菜的同时在临时备注（tempMemo）中移除该菜品备注
        let targetFoods = this.getTargetFoods();
        console.log('targetFoods.length=' + targetFoods.length);
        for (var i = 0; i < targetFoods.length; i++) {
          var currentFood = targetFoods[i];
          console.log('targetFood.food.begin.id=' + currentFood.id + ', currentFood.count=' + currentFood.count);
          if (currentFood.count) {    // by xiaozc. 购物车里当前被点中的那行菜品
            currentFood.count -= currentFood.step;
            if (this.$root.baseData.hotel.chopstick) {
              if (currentFood.id === this.$root.baseData.hotel.chopstick.id) {
                this.$root.peopleNum = currentFood.count;
                // this.$root.eventHub.$emit('bindChopstickeCount', {'chopsticksJudge': true});  // 将勾选框勾起状态 返回给shopCart
              }
            }
             this.$root.eventHub.$emit('lastHandleFood', {'food': currentFood, 'type': '-1', 'chopsticksJudge': true});    // 向goods传输，值为当前食物与操作类型，目的：同步同桌点菜功能
            if (currentFood.count === 0) { // 当购物车菜品数量减到0的时候，清除本菜品备注，避免再次点菜会一直出现备注（memorequired = 0）
              currentFood.memostr = '';
            }
            if (currentFood.rawfood) {  // by xiaozc. 从购物车里点击，且不合并点单项的情形
              currentFood.rawfood.count -= currentFood.rawfood.step;
              currentFood.decrease = true;
            }
            console.log('decreaseCart.currentFood.count=' + currentFood.count + ', currentFood.memorequired=' + currentFood.memorequired + ', currentFood.index=' + currentFood.index + ', currentFood.memostr=' + currentFood.memostr + ', currentFood.step=' + currentFood.step + ', currentFood.rawfood=' + currentFood.rawfood);
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>