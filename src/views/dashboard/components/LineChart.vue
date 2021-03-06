<template>
  <div :style="{ width, height }"></div>
</template>

<script>
import echarts from "echarts"; //引入echarts
require("echarts/theme/macarons"); //引入主题
import resize from './mixins/resize'
export default {
  mixins: [resize],
  name: "",
  data() {
    return {
      chart: null,
      // $_sidebarElm: null, // sizebar根元素
      // $_resizeHandler: null // 更新图表的函数
    };
  },
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    chartData: {
      type: Object,
      required: true,
    },
    yTittle: {
      type: String,
      required: true,
    },
  },
  mounted() {
    //使用echart画图的函数
    this.initChart();
    
  },

  //为啥要监视，因为数据是异步传过来的
  watch:{
    chartData:{
      deep:true,
      handler(newVal){
        this.setOption(newVal)
      }
    }
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // 销毁实例，销毁后实例无法再被使用。
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOption(this.chartData);
    },

    setOption({ expectedData = [], actualData = [] }) {
      this.chart.setOption({
        //图表的标题
        // title: {
        //   text: "ECharts 入门示例",
        // },
        //提示
        tooltip: {
          trigger:'axis',//坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
          axisPointer:{
            type:'cross' //坐标十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer
          }
        },

        //图例
        legend: {
          data: ["期望", "实际"],
        },
        //x坐标轴
        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六","周日"],
          boundaryGap:false //x轴是否两遍不留白，和边缘重合
        },
        //y坐标轴，一般不写，最多写个y名称
        yAxis: {
          name:this.yTittle
        },
        //网格，用来设置图标整体的大小的
        grid:{
          left: 10,
          right: 10,
          top: 40,
          bottom:10,
          containLabel:true   //是否包含图标的坐标轴
        },

        //系列  （图例和系列是配套的）
        series: [
          {
            name: "期望", //和图例对应的
            type: "line", //决定了图的样子  是柱状图还是线状图还是饼状图
            data: expectedData, //对应的是图的数据
            itemStyle:{
              color:'red'   //修改整个图相关的颜色 不光是线，还有提示还有图例颜色都改了
            },
            lineStyle:{
              width:4 //只能修改线的颜色宽度等等
            }
          },
          {
            name: "实际",
            type: "line",
            data: actualData,
            itemStyle:{
              color:'blue'
            },
            lineStyle:{
              width:4
            },
            areaStyle:{
              color:'hotpink'   //修改区域的颜色
            }
          },
        ],
      });
    },
  },
};
</script>

