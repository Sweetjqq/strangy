<template>
  <div style="padding-left:20px;padding-right:20px;">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane  name="first" label="策略信息">
    <StrategyInfo ref="whateverName" style="margin-top:30px;"></StrategyInfo>
  </el-tab-pane>
  <el-tab-pane name="second" label="策略建议">
  </el-tab-pane>
  </el-tabs>


  </div>
</template>


<script>
import StrategyInfo from './CreateStrategyInfo.vue'

export default {
  prop:['obj'],
  components:{
            StrategyInfo
        },
    data() {
      return {
        parentMethod:'222',
        activeName: 'first'
      };
    },
    mounted(){
     console.log(this.$refs.whateverName.strategyType)   //类型
     console.log(`${this.labelvalue1},${this.labelvalue2},${this.labelvalue3}`)
     console.log(this.$refs.whateverName.validate.strategyName)   //名称
     //id
     console.log(this.$refs.whateverName.validate.startTime)//开始时间
     console.log(this.$refs.whateverName.validate.endTime)//结束时间
     //策略报告名，url
     console.log(this.$refs.whateverName.status)//状态
     console.log(this.$refs.whateverName.validate.checkSurplus)// 止盈
     console.log(this.$refs.whateverName.validate.stopLoss)//止损
     console.log(this.$refs.whateverName.validate)// 债券估值方法
     console.log(this.$refs.whateverName.desc)//活动形式
     //策略小图名，url
     //策略大图名，url
     console.log(this.$refs.whateverName.Benchmark) //基准收益率
    },
    methods: {
      handleClick(tab, event) {
      },
    }
  };
</script>
