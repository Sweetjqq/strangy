<template>
  <div :id="id" :class="className">

  </div>

</template>

<script>
  import * as echarts from 'echarts';
  export default {
    props: ['options', 'id', 'className','text'],
    data() {
      return {

      };
    },
    methods: {
      createChart() {
        if (this.options.legenddata && this.options.seriesdata) {
          document.getElementById(this.id).style.width = '100%';
          document.getElementById(this.id).style.height = '100%';
          var myChart = echarts.init(document.getElementById(this.id));
          myChart.setOption({
            title: {
              text:this.text,
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{b}: {c}%"
            },
            color: ['#bd3736', '#304553', '#639da4', '#cf8068', "#90c3ac", "#759b81", "#c4822e", "#b99f98",
              "#6e7074", "#c7ccd0", "#e0e0e0",
              "#e9bdbd", "#bbc2c6", "#ccdfe1", "#efd5cd", "#daebe4", "#d2ded5", "#ecd6ba", "#e8dfdd", "#cfd0d1",
              "#c7ccd0"
            ],
            legend: {
              orient: 'vertical',
              x: 'left',
              data: this.options.legenddata,
            },
            series: [{
              name: '',
              type: 'pie',
              radius: ['50%', '70%'],
              label: {
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'bold'
                  }
                }
              },
              data: this.options.seriesdata
            }]
          });
        }
      }
    },
    created() {

    },
    mounted() {
      this.createChart();
    }
  };

</script>
<style scoped>


</style>
