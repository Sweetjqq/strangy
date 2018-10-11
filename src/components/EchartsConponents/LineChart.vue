<template>
  <div :id="id" :class="className">

  </div>
</template>

<script>
  import * as echarts from 'echarts';
  export default {
    props: ['options', 'id', 'className', 'max'],
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
          // myChart.on('click', function (params) {
          //     console.log(params);
          // })
            myChart.setOption({
              title: {
                text: ''
              },
              tooltip: {
                trigger: 'axis',
                // formatter: function (datas) {
                //   var res = datas[0].name + '<br/>',
                //     val;
                //   for (var i = 0, length = datas.length; i < length; i++) {
                //     val = (datas[i].value * 100) + '%';
                //     res += datas[i].seriesName + '：' + val + '<br/>';
                //   }
                //   return res;
                //   console.log(data, "%%%%%%%%%%%%%");
                // }
              },
              legend: {
                data: ['组合', '基准']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.options.xAxisdata
              },
              yAxis: {
                type: 'value',
                min: 1,
                max: this.max,
                interval: parseFloat(((this.max - 1) / 4).toFixed(2))
              },
              series: this.options.seriesdata
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
