<template>
  <div :id="id" :class="className">

  </div>
</template>

<script>
  import * as echarts from 'echarts';
  export default {
    props: ['options', 'id', 'className', 'options1'],
    data() {
      return {

      };
    },
    methods: {
      createChart() {
        if (this.options.xAxisdata && this.options.seriesdata) {
          document.getElementById(this.id).style.width = '100%';
          document.getElementById(this.id).style.height = '100%';
          var myChart = echarts.init(document.getElementById(this.id));
          myChart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: this.options.xAxisdata,
              //              axisLabel: {
              //                rotate: 45,
              //                interval :10
              //              }
            },
            yAxis: [{
              splitLine: {
                show: false
              },
              type: 'value',
              name: '单位:（万元）',
              // min: 0,
              // max: 11,


              // interval: 50,
              // axisLabel: {
              //   formatter: '{value} 万元'
              // }
            }, {
              splitLine: {
                show: false
              },
              type: 'value',
              // min: 0,
              // max: 20,

              // interval: 50,
              // axisLabel: {
              //   formatter: '{value} 万元'
              // }
            }],
            series: [{
              barWidth: 15, //柱图宽度
              data: this.options.seriesdata,
              name: '未来现金流',
              type: 'bar',
              label: {
                normal: {
                  show: false,
                  position: 'top',
                  textStyle: {
                    color: 'black'
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: function (value) {
                    if (value.data < 0) {
                      return "#bd3736"
                    } else {
                      return "#446d83"
                    }
                  }
                }
              },
            }, {
              type: 'line',
              name: '累计现金流',
              yAxisIndex: 1,
              data: this.options1.seriesdata,
            }]
          });
        }
      }
    },
    mounted() {
      this.createChart();
    }
  };

</script>
<style scoped>


</style>
