<template>
  <div>


    <div style="min-width:800px;padding:0px 15px 0px">
      <div class="formBox">
        <el-row class="h36">
          <!--  策略类型-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <label for="">策略类型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>

              <span class="font14" ref="Type" v-model="strategyObj.Type">{{this.strategyObj.Type}}</span>

            </div>
          </el-col>

          <!--  标签-->
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <label for="">标签&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <!-- <el-select v-model="this.strategyObj.Label" disabled style="width:24%;" class="ml12">
            <el-option v-for="item1 in options1" :key="item1.Name" :label="item1.Name" :value="item1.Name">
            </el-option>
          </el-select>

          <el-select v-model="labelvalue2" disabled style="width:22%;">
            <el-option v-for="item2 in options2" :key="item2.Name" :label="item2.Name" :value="item2.Name">
            </el-option>
          </el-select>

          <el-select v-model="labelvalue3" disabled style="width:34%;">
            <el-option v-for="item3 in options3" :key="item3.Name" :label="item3.Name" :value="item3.Name">
            </el-option>
          </el-select> -->

              <span class="font14" ref="Label" v-model="strategyObj.Label">{{this.strategyObj.Label}}</span>
            </div>
          </el-col>




        </el-row>


        <el-row class="h36">
          <!--  标签-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <label for="">策略名称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <span class="font14 " ref="Name" v-model="strategyObj.Name">{{this.strategyObj.Name}}</span>


            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <!--  策略编号-->
              <label for="">策略编号</label>
              <span class="font14 ml12" ref="Code" v-model="strategyObj.Code">{{this.strategyObj.Code}}</span>
            </div>
          </el-col>
        </el-row>


        <el-row class="h36">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="block">
                <span class="label">开始时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="font14 ml12" ref="StyBeginDate" v-model="strategyObj.StyBeginDate">{{this.strategyObj.StyBeginDate}}</span>
                </el-date-picker>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <div class="block">
                <span class="label">结束时间</span>
                <span class="font14 ml12" ref="StyEndDate" v-model="strategyObj.StyEndDate">{{this.strategyObj.StyEndDate}}</span>
                </el-date-picker>
              </div>
            </div>
          </el-col>
        </el-row>


        <!-- 上传文件 -->
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <span style="float:left" class="label">策略报告&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-upload v-if="strategyObj.ReportName" style="display:inline-block;margin-left:16px;margin-top: -30px;" class="upload-demo"
                action="" multiple :limit="1" :file-list="fileListBigReport">
                <!-- :onError="uploadError"
        :onSuccess="uploadSuccess"
        :beforeUpload="beforeAvatarUpload" -->
              </el-upload>
              <el-button size="small" v-if="strategyObj.ReportName" style="
    top: -1px;
    position:  absolute; margin-left:10px;" @click="download()">下载文件</el-button>



            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span class="label">策略状态 </span>

              <el-switch class="ml12" ref="switch" v-if="strategyObj.Status == '运行中'" v-model="isswitch" disabled>
              </el-switch>
              <el-switch class="ml12" ref="switch" v-else v-model="noswitch" disabled>
              </el-switch>
              <!--
          <el-switch class="ml12"  v-else v-model='false'   >
          </el-switch> -->
            </div>
          </el-col>
        </el-row>
        <!-- 上传文件 -->


        <!-- 止盈止损 -->
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <label for="">止盈(BP)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <span class="font14 ml12" ref="StopProfit" v-model="strategyObj.StopProfit">{{this.strategyObj.StopProfit}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <label for="">止损(BP)
              </label>
              <span class="font14 ml12" ref="StopLoss" v-model="strategyObj.StopLoss">{{this.strategyObj.StopLoss}}</span>
            </div>
          </el-col>
        </el-row>
        <!-- 止盈止损 -->

        <!-- 债券估值方法 -->

        <el-row>
          <el-col :span="12">
            <label for="">债券估值方法</label>

            <span class="font14 ml12" v-if="strategyObj.ValuationMethod == '1'" ref="bondmethod" v-model="bondmethod1">{{bondmethod1}}</span>

            <span class="font14 ml12" v-if="strategyObj.ValuationMethod == '2'" ref="bondmethod" v-model="bondmethod2">{{bondmethod2}}</span>

            <span class="font14 ml12" v-if="strategyObj.ValuationMethod == '0'" ref="bondmethod" v-model="bondmethod">{{bondmethod}}</span>


          </el-col>
        </el-row>
        <!-- 债券估值方法 -->



        <!-- 策略描述 -->
        <el-row id="strategyDesc">
          <el-form ref="form" label-width="80px">
            <el-form-item label="策略描述">
              <span class="font14 ml12" ref="Description" style="margin-left:32px;" v-model="strategyObj.Description">{{strategyObj.Description}}</span>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 策略描述 -->


        <!-- 策略小图 -->
        <!-- <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <span style="float:left" class="label">策略小图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-upload style="display:inline-block;margin-left:16px;margin-top: -30px;" class="upload-demo" action="" :file-list="fileListSmall" list-type="picture">
            </el-upload>
          </div>
        </el-col>
      </el-row> -->
        <!-- 策略小图 -->

        <!-- 策略大图 -->
        <!-- <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <span style="float:left" class="label">策略大图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-upload style="display:inline-block;margin-left:16px;margin-top: -30px;" class="upload-demo" action="" :file-list="fileListBig" list-type="picture">
            </el-upload>
          </div>
        </el-col>
      </el-row> -->
        <!-- 策略大图 -->


        <!-- 基准收益率 -->
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <label for="">基准收益率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <span class="font14 ml12" ref="BenchmarkROR" @keyup="editBenchmarkROR()" v-model="strategyObj.BenchmarkROR">{{strategyObj.BenchmarkROR}}%</span>

            </div>
          </el-col>

          <el-col :span="9">

            <div class="grid-content bg-purple-light">
              <label for="">基准名称&nbsp;&nbsp;&nbsp;
              </label>
              <span class="font14 ml12" ref="BenchmarkROR" v-model="strategyObj.BenchmarkName">{{strategyObj.BenchmarkName}}</span>
            </div>

          </el-col>

          <el-col :span="9">

            <div class="grid-content bg-purple-light">
              <label for="">基准更改日期&nbsp;&nbsp;&nbsp;
              </label>
              <span class="font14 ml12" ref="BenchmarkROR" v-if="strategyObj.BenchmarkDate" v-model="strategyObj.BenchmarkDate">{{strategyObj.BenchmarkDate.substr(0, 11)}}</span>
              </el-date-picker>
            </div>

          </el-col>
        </el-row>
        <!-- 基准收益率 -->
      </div>

    </div>


  </div>
</template>

<script>
  import {
    Format,
    getCookie
  } from "../../config/mUtils";
  export default {
    props: ["strategyObj"],
    data() {
      return {
        isswitch: true,
        noswitch: false,
        so: "11",
        options: [], //信用债数组
        options1: [], //label数组
        options2: [], //label数组
        options3: [], //label数组
        Type: "信用债", //债类型
        Code: "",
        validate: {
          strategyName: "", // 策略名称
          StyBeginDate: "", //开始时间
          StyEndDate: "", //结束时间
          StopProfit: "", // 止损
          StopLoss: "", //止盈
          BenchmarkROR: "" //基准收益率
        },
        bondmethod: "", //估值方法
        bondmethod1: "中证估值",
        bondmethod2: "摊余成本",
        Description: "", //
        status: true,
        labelvalue1: "", // label值
        labelvalue2: "", // label值
        labelvalue3: "", // label值
        fileList1: [], //上传文件数组
        fileList2: [], //上传文件数组
        fileList3: [], //上传文件数组
        bondValuationMethod: [], //债券估值方法数组
        filepath: ""
      };
    },
    computed: {
      fileListBig() {
        if (this.strategyObj.BigIcon) {
          return (this.fileList3 = [{
            name: this.strategyObj.BigIconName,
            url: this.filepath + this.strategyObj.BigIcon
          }]);
        }
      },
      fileListSmall() {
        if (this.strategyObj.BigIcon) {
          return (this.fileList3 = [{
            name: this.strategyObj.SmallIconName,
            url: this.filepath + this.strategyObj.SmallIcon
          }]);
        }
      },
      fileListBigReport() {
        if (this.strategyObj.BigIcon) {
          return (this.fileList3 = [{
            name: this.strategyObj.ReportName,
            url: this.strategyObj.Report
          }]);
        }
      }
    },
    created() {
      //sit
      if (HOST == "http://10.21.10.192:80") {
        this.action = "http://10.21.10.192:80/v1/StrategyApi/upload";
        this.filepath = "http://10.21.10.170:80/";
      } else if (HOST == "http://192.168.10.91:80") {
        //uat
        this.action = "http://192.168.10.91/v1/StrategyApi/upload";
        this.filepath = "http://192.168.10.94:9187/";
        // this.action=HOST+'/v1/StrategyApi/upload';
        // this.filepath=HOST+'/v1/StrategyApi/download?FileName=';
      } else if (HOST == "https://api.fw-fintech.com") {
        //prod
        // this.action='http://192.168.10.94:9187/v1/StrategyApi/upload';
        // this.filepath='http://192.168.10.94:9187/v1/StrategyApi/download?FileName=';
        console.log("1");
        this.action = HOST + "/v1/StrategyApi/upload";
        this.filepath = "https://imgs.fw-fintech.com/";
        console.log(this.action, this.filepath, "#########");
      }
      console.log(this.strategyObj.Label, "strategyObj");
      //债券估值方法赋值
      this.bondValuationMethod = [{
          value: "选项1",
          label: "中证估值"
        },
        {
          value: "选项2",
          label: "摊余成本"
        }
      ];
      //请求标签接口
      axios({
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + getCookie("Token")
        },
        url: "/v1/StrategyApi/GetStrategyLabels",
        params: {
          AccountId: getCookie("UserId"),
          m_Type: "0"
        }
      }).then(res => {
        console.log(res, "$$$");
        if (res.data.status == 401) {
          this.$message({
            message: "token过期"
          });
        }
        if (res.data.ReturnParam) {
          this.options1 = res.data.ReturnParam.LabelOneList;
          this.options2 = res.data.ReturnParam.LabelTwoList;
          this.options3 = res.data.ReturnParam.LabelThreeList;
          console.log(this.options1, "this.options");
        }
        setTimeout(() => {
          console.log(this.strategyObj.Name);
          document.title = this.strategyObj.Name;
        }, 1000);
      });
    },
    mounted() {},
    methods: {
      download() {
        const FileName = this.strategyObj.Report;
        axios({
          method: "get",
          url: HOST + "/v1/StrategyApi/download",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            FileName: FileName,
            FriendlyName: this.strategyObj.ReportName
          },
          responseType: "blob"
        }).then(response => {
          console.log(
            "http://192.168.10.94:9187/v1/StrategyApi/download?FileName=" +
            this.strategyObj.Report +
            "&FriendlyName=" +
            this.strategyObj.ReportName
          );
          console.log(response.data);
          if (response.status !== 200) {
            this.$message({
              message: "下载出错"
            });
          }
          this.download1(response.data);
        });
        // location.href = HOST +'/v1/StrategyApi/download?FileName=' +FileName +'&FriendlyName='+this.strategyObj.ReportName
        // http://10.21.10.170:9187/v1/StrategyApi/download?FileName=3bab1578-488e-4894-9017-7a43e2976383.pdf&FriendlyName=sfdsfds.pdf
      },
      download1(content) {
        const blob = new Blob([content]);
        const fileName = this.strategyObj.ReportName;
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      },
      getStr(string, str) {
        var str_before = string.split(str)[0];
        var str_after = string.split(str)[1];
        return str_after;
      }
    }
  };

</script>


<style scoped>
  .h36 {
    height: 36px;
  }

  .font14 {
    padding-left: 10px;
    font-size: 14px;
  }

  .formBox {
    margin-top: 20px;
  }

  .el-row {
    margin-bottom: 22px;
  }

  #strategyDesc {
    margin-left: -12px;
  }

  label,
  .label {
    font-size: 14px;
    color: #48576a;
  }

  .ml12 {
    margin-left: 12px;
  }

</style>

