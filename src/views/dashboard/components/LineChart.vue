<template>
  <!-- 准备的容器 -->
  <div :style="{ width, height }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme 只能写require
import resize from './mixins/resize'
export default {
  mixins:[resize],
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    // 传递的系列数据
    chartData:{
      type:Object,
      required :true
    },
    // y轴的名称
    yTittle:{
      type:String,
      required :true
    }
  },
  data() {
    return {
      chart: null,
    };
  },

  mounted() {
    this.initChart();
  },

  methods: {
    //初始化一个echarts实例
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOption(this.chartData);
    },

    setOption({expectedData=[],actualData=[]}) {
      this.chart.setOption({
        // 图表标题
        // title: {
        //   text: "ECharts 入门示例",
        // },
        //提示信息
        tooltip: {
          // 提示信息是十字准星
          axisPointer:{
            type:'cross' //十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
          },
          trigger:'axis' //提示信息触发的时机，坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
        },

        //图例
        legend: {
          data: ["预期", "实际"],
        },
        //x轴
        xAxis: {
          boundaryGap:false, //坐标轴两边留白策略
          data: ["周一", "周二", "周三", "周四", "周五", "周六","周日"],
        },
        //y轴 一般不需要写数据
        yAxis: {
          name:this.yTittle  //y轴的名称
        },
        //直角坐标系内绘图网格,可以控制图和容器上下左右的边距
        grid:{
          left:40,
          right:20,
          top:40,
          bottom:40
        },

        //系列
        series: [
          {
            //图形的颜色
            itemStyle:{
              color:'hotpink'
            },
            name: "预期",
            type: "line", //柱状图
            data: expectedData,
          },
          {
            name: "实际",
            itemStyle:{
              color:'skyblue'
            },
            //区域填充样式
            areaStyle:{
              color:'#aaa'
            },
            type: "line", //折线图
            data: actualData
          },
        ],
      });
    },
  },

  watch:{
    chartData:{
      deep:true,
      handler(newVal,oldVal){
        this.setOption(newVal)
      }
    }
  }
};
</script>
