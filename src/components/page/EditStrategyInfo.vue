<template>
  <div>


    <div style="min-width:1084px;padding:0px 15px 0px">
      <div class="formBox">
        <el-row class="h36">
          <!--  策略类型-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <label for="">策略类型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>

              <span class="font14" ref="Type" v-model="strategyObj.Type">{{this.strategyObj.Type}}</span>

            </div>
          </el-col>

          <!--  标签-->
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <label for="">标签&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <el-select v-model="labelvalue1" style="width:24%;" class="ml12">
                <el-option v-for="item1 in options1" :key="item1.Name" :label="item1.Name" :value="item1.Name">
                </el-option>
              </el-select>

              <el-select v-model="labelvalue2" style="width:22%;">
                <el-option v-for="item2 in options2" :key="item2.Name" :label="item2.Name" :value="item2.Name">
                </el-option>
              </el-select>

              <el-select v-model="labelvalue3" style="width:34%;">
                <el-option v-for="item3 in options3" :key="item3.Name" :label="item3.Name" :value="item3.Name">
                </el-option>
              </el-select>

              <!-- <span class="font14" ref="Label"  v-model="strategyObj.Label">{{this.strategyObj.Label}}</span> -->
            </div>
          </el-col>




        </el-row>


        <el-row class="h36">
          <!--  标签-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!-- <label for="">策略名称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <span class="font14 " ref="Name"  v-model="strategyObj.Name">{{this.strategyObj.Name}}</span> -->

              <label for="">策略名称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <el-input ref="Name" v-model="strategyObjName" style="width:322px;" class="ml12"></el-input>

            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <!--  策略编号-->
              <label for="">策略编号</label>
              <span class="font14" ref="Code" v-model="strategyObj.Code">{{this.strategyObj.Code}}</span>
            </div>
          </el-col>
        </el-row>


        <!-- <el-row  class="h36">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="block">
            <span class="label">开始时间</span>
            <span class="font14 ml12" ref="StyBeginDate"  v-model="strategyObj.StyBeginDate">{{this.strategyObj.StyBeginDate}}</span>
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <div class="block">
            <span class="label">结束时间</span>
            <span class="font14 ml12" ref="StyEndDate"  v-model="strategyObj.StyEndDate">{{this.strategyObj.StyEndDate}}</span>
            </el-date-picker>
          </div>
        </div>
      </el-col>
    </el-row> -->


        <el-row>

          <el-col :span="12">

            <div class="grid-content bg-purple">

              <div class="block">

                <span class="label">开始时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

                <el-date-picker id="it" style="width:260px;" ref="StyBeginDate" @change="queryStart()" value-format="yyyy-MM-dd" v-model="strategyObj.StyBeginDate"
                  class="ml12" type="date" placeholder="选择日期">

                </el-date-picker>

              </div>

            </div>

          </el-col>

          <el-col :span="7" style="min-width:395px;">

            <div class="grid-content bg-purple-light">

              <div class="block">

                <span class="label">结束时间</span>

                <el-date-picker style="width:260px;" ref="StyEndDate" value-format="yyyy-MM-dd" class="ml12" v-model="strategyObj.StyEndDate"
                  type="date" placeholder="选择日期">

                </el-date-picker>

              </div>

            </div>


          </el-col>
          <el-col :span="3" style="min-width:130px;line-height:36px;margin-left:-60px;width:14%;">
            <!-- <el-tag style="cursor: pointer;" @click="selectThree()">3个月</el-tag>
            <el-tag style="cursor: pointer;" @click="selectSix()">6个月</el-tag>
            <el-tag style="cursor: pointer;" @click="selectYear()">1年</el-tag> -->
            <el-button size="mini" @click="selectThree()">3个月</el-button>
            <el-button size="mini" @click="selectSix()">6个月</el-button>
            <el-button size="mini" @click="selectYear()">1年</el-button>
          </el-col>
        </el-row>


        <!-- 上传文件 -->
        <el-row>
          <el-col :span="12" style="
    max-height:  67px;
    ">
            <div class="grid-content bg-purple">
              <span style="float:left" class="label">策略报告&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-upload id="upload" style="display:inline-block;margin-left:16px" class="upload-demo" :on-error="handleError" :before-upload="beforeAvatarUpload1"
                :action="action" :headers="myHeaders" multiple :limit="1" :on-success="handleSuccess1" :file-list="fileListBigReport"
                ref="upload1">
                <!-- :onError="uploadError"
        :onSuccess="uploadSuccess"
        :beforeUpload="beforeAvatarUpload" -->
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span class="label">策略状态 </span>

              <el-switch class="ml12" ref="switch" v-if="strategyObj.Status == '运行中'" v-model="isswitch">
              </el-switch>
              <el-switch class="ml12" ref="switch" v-else v-model="noswitch">
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
              <el-input v-model="strategyObj.StopProfit" class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <label for="">止损(BP)
              </label>
              <el-input v-model="strategyObj.StopLoss" class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>
            </div>
          </el-col>
        </el-row>
        <!-- 止盈止损 -->
        <!-- 债券估值方法 -->
        <el-row>
          <el-col :span="12">
            <label for="">债券估值方法</label>
            <el-select v-if="strategyObj.ValuationMethod == '1'" ref="bondmethod" v-model="bondmethod1" style="width:290px;" class="ml12">
              <el-option v-for="item in bondValuationMethod" :key="item.label" :label="item.label" :value="item.label">
              </el-option>
            </el-select>

            <el-select v-if="strategyObj.ValuationMethod == '2'" ref="bondmethod" v-model="bondmethod2" style="width:290px;" class="ml12">
              <el-option v-for="item in bondValuationMethod" :key="item.label" :label="item.label" :value="item.label">
              </el-option>
            </el-select>

            <el-select v-if="strategyObj.ValuationMethod == '0'" ref="bondmethod" v-model="bondmethod" style="width:290px;" class="ml12">
              <el-option v-for="item in bondValuationMethod" :key="item.label" :label="item.label" :value="item.label">
              </el-option>
            </el-select>

          </el-col>
        </el-row>
        <!-- 债券估值方法 -->



        <!-- 策略描述 -->
        <el-row id="strategyDesc">
          <el-form ref="form" label-width="80px">
            <el-form-item label="策略描述">
              <el-input type="textarea" id="textarea" ref="Description" style="margin-left: 32px;" v-model="strategyObj.Description"></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 策略描述 -->


        <!-- <el-row >
  <el-col :span="12" :offset="2">
 <el-button style="width:100px;" type="primary">保存</el-button>
   <el-button style="width:100px;background-color:#bebebe;border-color:#bebebe;" type="info" >返回</el-button>
  </el-col>
</el-row> -->

        <!-- 策略小图 -->
        <!-- <el-row>
  <el-col :span="18" style="
max-height:  134px;
">
    <div class="grid-content bg-purple">
      <span style="float:left" class="label">策略小图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <el-upload style="display:inline-block;margin-left:16px" ref="upload2"  :on-remove="handleRemovesmall" :before-upload="beforeAvatarUpload2" class="upload-demo" :on-error="handleError"  :on-success="handleSuccess2" :headers="myHeaders"  :action="action"  :file-list="fileListSmall" list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span style="padding-left:32px;font-size:14px;">建议尺寸：342px*154px</span>
    </div>
  </el-col>
</el-row> -->
        <!-- 策略小图 -->


        <!-- 策略大图 -->
        <!-- <el-row>
  <el-col :span="18" style="
max-height:  134px;
">
    <div class="grid-content bg-purple">
      <span style="float:left" class="label">策略大图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <el-upload style="display:inline-block;margin-left:16px" ref="upload3" class="upload-demo" :on-remove="handleRemovebig"  :on-error="handleError" :on-success="handleSuccess3" :before-upload="beforeAvatarUpload3" :headers="myHeaders"  :action="action"   :file-list="fileListBig" list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span style="padding-left:32px;font-size:14px;">建议尺寸:750px</span>
    </div>
  </el-col>
</el-row> -->
        <!-- 策略大图 -->

        <!-- 基准收益率 -->
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <label for="">基准收益率&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <el-input class="ml12" style="width:100px;" ref="BenchmarkROR" @keyup="editBenchmarkROR()" v-model="strategyObj.BenchmarkROR"
                placeholder="请输入内容"></el-input>%
            </div>
          </el-col>
          <el-col :span="9">

            <div class="grid-content bg-purple-light">
              <label for="">基准名称&nbsp;&nbsp;&nbsp;
              </label>
              <el-input class="ml12" :maxlength="20" style="width:186px;" v-model="strategyObj.BenchmarkName" placeholder="请输入内容"></el-input>
            </div>

          </el-col>

          <el-col :span="9">

            <div class="grid-content bg-purple-light">
              <label for="">基准更改日期&nbsp;&nbsp;&nbsp;
              </label>
              <el-date-picker id="it" ref="StyBeginDate" style="width:280px;" @change="queryStart()" value-format="yyyy-MM-dd" v-model="strategyObj.BenchmarkDate"
                class="ml12" type="date" placeholder="选择日期">

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
        strategyObjName: "",
        action: "",
        hasR: false,
        has1: false,
        has2: false,
        myHeaders: {
          Authorization: "bearer " + getCookie("Token")
        },
        isswitch: true,
        noswitch: false,
        so: "11",
        options: [], //信用债数组
        options1: [], //label数组
        options2: [], //label数组
        options3: [], //label数组
        labelvalue1: "", // label值

        labelvalue2: "", // label值

        labelvalue3: "", // label值
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

        fileList1: [], //上传文件数组
        fileList2: [], //上传文件数组
        fileList3: [], //上传文件数组
        bondValuationMethod: [], //债券估值方法数组
        ReportName1: "",
        BigIcon1: "",
        SmallIcon1: "",
        file1: "",
        file2: "",
        file3: "",
        filepath: "",
        upup1: true,
        upup2: true,
        BenchmarkName: "",
        Datumchange: "",
      };
    },
    computed: {
      fileListBigReport() {
        if (this.strategyObj.Report == "") {
          return (this.fileList1 = []);
        } else {
          if (this.hasR) {
            return (this.fileList1 = [{
              name: this.file1,
              url: this.filepath + this.ReportName1
            }]);
          } else {
            return (this.fileList1 = [{
              name: this.strategyObj.ReportName,
              url: this.strategyObj.Report
            }]);
          }
        }
      },
      fileListSmall() {
        if (this.has1) {
          return (this.fileList2 = []);
        } else {
          if (
            this.strategyObj.SmallIconName == "" ||
            this.strategyObj.SmallIcon == ""
          ) {
            return (this.fileList2 = []);
          } else {
            return (this.fileList2 = [{
              name: this.strategyObj.SmallIconName,
              url: this.filepath + this.strategyObj.SmallIcon
            }]);
          }
        }
      },
      fileListBig() {
        if (this.has2) {
          return (this.fileList3 = []);
        } else {
          if (
            this.strategyObj.BigIconName == "" ||
            this.strategyObj.BigIcon == ""
          ) {
            return (this.fileList2 = []);
          } else {
            return (this.fileList3 = [{
              name: this.strategyObj.BigIconName,
              url: this.filepath + this.strategyObj.BigIcon
            }]);
          }
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
      } else if (HOST == "https://api.fw-fintech.com") {
        //prod
        this.action = HOST + "/v1/StrategyApi/upload";
        this.filepath = "https://imgs.fw-fintech.com/";
      }
      //债券估值方法赋值
      this.bondValuationMethod = [{
          id: 1,
          value: "选项1",
          label: "中证估值"
        },
        {
          id: 2,
          value: "选项2",
          label: "摊余成本"
        }
      ];
      //请求标签接口
      axios({
        method: "get",

        headers: {
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

          setTimeout(() => {
            console.log(
              this.strategyObj.Report,
              "2222222222222222222222222222222d"
            );
            this.options1.map(item => {
              this.strategyObj.Label.split(";").map(arritem => {
                if (item.Name == arritem) {
                  this.labelvalue1 = item.Name;
                }
              });
            });

            this.options2.map(item => {
              this.strategyObj.Label.split(";").map(arritem => {
                if (item.Name == arritem) {
                  this.labelvalue2 = item.Name;
                }
              });
            });

            this.options3.map(item => {
              this.strategyObj.Label.split(";").map(arritem => {
                if (item.Name == arritem) {
                  this.labelvalue3 = item.Name;
                }
              });
            });

            this.strategyObjName = this.strategyObj.Name;

            document.title = this.strategyObj.Name;
          }, 1000);

          this.options1.unshift("");

          this.options2.unshift("");

          this.options3.unshift("");

          console.log(this.options1, "this.options");
        }
      });
    },
    mounted() {},
    methods: {
      timeHandle(time) {
        let a;
        a = document
          .getElementById("it")
          .getElementsByClassName("el-input__inner")[0].value;
        a = new Date(a);
        var yy1, mm1, dd1;
        if (this.validateStartTime()) {
          a.setMonth(a.getMonth() + time);
          yy1 = a.getFullYear();
          mm1 = a.getMonth() + 1;
          dd1 = a.getDate();
          if (mm1 < 10) {
            mm1 = "0" + mm1;
          }
          if (dd1 < 10) {
            dd1 = "0" + dd1;
          }
          return yy1 + "-" + mm1 + "-" + dd1;
        }
      },
      selectThree() {
        this.strategyObj.StyEndDate = this.timeHandle(3);
      },
      selectSix() {
        this.strategyObj.StyEndDate = this.timeHandle(6);
      },
      selectYear() {
        this.strategyObj.StyEndDate = this.timeHandle(12);
      },
      validateStartTime() {
        if (!this.strategyObj.StyBeginDate) {
          this.$message({
            message: `请输入开始时间`
          });
          return false;
        } else {
          return true;
        }
      },
      queryStart() {
        const obj = {
          StyBeginDate: this.date(this.strategyObj.StyBeginDate),
          StyEndDate: this.date(this.strategyObj.StyEndDate),
          BenchmarkROR: Number(this.strategyObj.BenchmarkROR)
        };
        return obj;
      },
      i() {
        console.log(this.saveObj(), "saveObj");
      },
      //时间转换
      date(dateParms) {
        // 对传入的时间参数进行判断
        if (dateParms instanceof Date) {
          var datetime = dateParms;
        }
        //判断是否为字符串
        if (typeof dateParms == "string" && dateParms.constructor == String) {
          //将字符串日期转换为日期格式
          var datetime = new Date(Date.parse(dateParms.replace(/-/g, "/")));
        }
        //获取年月日时分秒
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minutes = datetime.getMinutes();
        var second = datetime.getSeconds();

        //月，日，时，分，秒 小于10时，补0
        if (month < 10) {
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (second < 10) {
          second = "0" + second;
        }
        //拼接日期格式【例如：yyyymmdd】
        var time = year + "-" + month + "-" + date;
        //或者：其他格式等
        //var time = year+"年"+month+"月"+date+"日"+hour+":"+minutes+":"+second;
        //返回处理结果
        return time;
      },
      //策略名称传递
      saveObj() {
        var bond;
        if (this.$refs.bondmethod.value == "") {
          bond = 0;
        } else if (this.$refs.bondmethod.value == "中证估值") {
          bond = 1;
        } else if (this.$refs.bondmethod.value == "摊余成本") {
          bond = 2;
        }

        let label;
        if (
          `${this.labelvalue1};${this.labelvalue2};${this.labelvalue3};` == ";;;"
        ) {
          label = "";
        } else {
          label = `${this.labelvalue1};${this.labelvalue2};${this.labelvalue3};`;
        }
        console.log(label, "labellabellabellabel");

        let status;
        if (this.$refs.switch.value) {
          status = "运行中";
        } else {
          status = "已结束";
        }

        const StyBeginDate = this.date(this.strategyObj.StyBeginDate);
        const StyEndDate = this.date(this.strategyObj.StyEndDate);
        console.log(
          Number(this.strategyObj.StopProfit),
          Number(this.strategyObj.StopLoss),
          " Number(this.strategyObj.StopLoss)"
        );
        const obj = {
          BenchmarkDate: this.date(this.strategyObj.BenchmarkDate),
          BenchmarkName: this.strategyObj.BenchmarkName,
          Id: this.strategyObj.Id,
          CreationTime: this.strategyObj.CreationTime,
          Code: this.strategyObj.Code,
          Name: this.strategyObjName, //
          ShortName: this.$refs.Name.textContent,
          Type: this.$refs.Type.textContent, //
          Label: label || "",
          StyBeginDate: StyBeginDate, //
          StyEndDate: StyEndDate, //
          ReportName: this.strategyObj.ReportName,
          Report: this.strategyObj.Report,
          Status: status,
          ValuationMethod: bond,
          StopProfit: Number(this.strategyObj.StopProfit), //
          StopLoss: Number(this.strategyObj.StopLoss), //
          Author: this.strategyObj.Author,
          BenchmarkROR: Number(this.strategyObj.BenchmarkROR), //
          // SmallIconName: this.strategyObj.SmallIconName,
          // SmallIcon: this.strategyObj.SmallIcon,
          // BigIconName: this.strategyObj.BigIconName,
          // BigIcon: this.strategyObj.BigIcon,
          Description: this.strategyObj.Description, //
          Editor: getCookie("UserId"),
          AdjustTime: this.strategyObj.AdjustTime,
          ReleaseStatus: this.strategyObj.ReleaseStatus
          // console.log(this.$refs.whateverName.strategyType)   //类型
          // console.log(`${this.labelvalue1},${this.labelvalue2},${this.labelvalue3}`)
          // console.log(this.$refs.whateverName.validate.strategyName)   //名称
          // //id
          // console.log(this.$refs.whateverName.validate.startTime)//开始时间
          // console.log(this.$refs.whateverName.validate.endTime)//结束时间
          // //策略报告名，url
          // console.log(this.$refs.whateverName.status)//状态
          // console.log(this.$refs.whateverName.validate.StopProfit)// 止盈
          // console.log(this.$refs.whateverName.validate.stopLoss)//止损
          // console.log(this.$refs.whateverName.validate)// 债券估值方法
          // console.log(this.$refs.whateverName.desc)//活动形式
          // //策略小图名，url
          // //策略大图名，url
          // console.log(this.$refs.whateverName.Benchmark) //基准收益率
        };
        console.log(obj, "@@@@@@@@@@@@");
        return obj;
      },
      //校验方法
      saveValiate() {
        console.log(
          this.strategyObj.StopProfit,
          "this.strategyObj.StopProfitthis.strategyObj.StopProfit"
        );
        if (this.strategyObj.StopProfit === "") {
          this.$message({
            message: `请输入止盈`
          });
          return false;
        }

        if (this.strategyObj.StopLoss === "") {
          this.$message({
            message: `请输入止损`
          });
          return false;
        }

        if (this.strategyObj.BenchmarkROR == "") {
          this.$message({
            message: `请输入基准收益率`
          });
          return false;
        }

        
        if (this.strategyObj.BenchmarkName == "") {
          this.$message({
            message: `请输入基准名称`
          });

          return false;
        }

        if (this.strategyObj.Datumchange == "") {
          this.$message({
            message: `请输入基准更改日期`
          });

          return false;
        }

        // if (this.strategyObj.SmallIcon == "") {
        //   console.log("11");
        //   this.$message({
        //     message: `请上传策略小图`
        //   });
        //   return false;
        // }

        // if (this.strategyObj.BigIcon == "") {
        //   this.$message({
        //     message: `请上传策略大图`
        //   });
        //   return false;
        // }
        var regu = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/; //基准收益率规则
        var regz = /^[0-9]\d*$/;
        if (!regz.test(this.strategyObj.StopProfit) ||
          !regz.test(this.strategyObj.StopLoss)
        ) {
          this.$message({
            message: `止盈止损必须是整数`
          });
          return false;
        }
        if (!regu.test(this.strategyObj.BenchmarkROR)) {
          this.$message({
            message: `请输入合法的基准收益率`
          });
          return false;
        }
        //返回值是校验不过的字段
      },
      //校验格式
      validator() {
        const msg = {
          Name: "策略名称",
          StyBeginDate: "开始时间",
          StyEndDate: "结束时间",
          StopProfit: "止盈",
          StopLoss: "止损",
          BenchmarkROR: "基准收益率"
        };

        for (let key in this.validate) {
          if (this.validate[key] == "") {
            return msg[key];
          }
        }
      },

      //上传文件
      beforeAvatarUpload1(file) {
        console.log(this.headers, "this.headersthis.headers");
      },
      beforeAvatarUpload2(file) {
        if (file && !/^image\/(jpeg|png)$/.test(file.type)) {
          event.preventDefault();
          this.$refs.upload2.abort();
          this.$message({
            message: "上传图片格式只能为png,jpg"
          });
          this.upup1 = false;
          return false;
        } else {
          return true;
        }
      },
      beforeAvatarUpload3(file) {
        if (file && !/^image\/(jpeg|png)$/.test(file.type)) {
          event.preventDefault();
          this.$refs.upload2.abort();
          this.$message({
            message: "上传图片格式只能为png,jpg"
          });
          this.upup2 = false;
          return false;
        } else {
          return true;
        }
      },
      handleError(err, file, fileList) {
        this.$message({
          message: "上传失败"
        });
      },
      // 上传成功1回调
      handleSuccess1(res, file, fileList1) {
        console.log(res, "res");
        this.file1 = file.name;
        this.strategyObj.Report = res.ReturnParam;
        this.strategyObj.ReportName = file.name;
        this.hasR = true;
        this.$message({
          message: "上传成功"
        });
      },
      // 上传成功2回调
      handleSuccess2(res, file, fileList2) {
        this.strategyObj.SmallIcon = res.ReturnParam;
        this.strategyObj.SmallIconName = file.name;
        this.upup1 = true;
        this.$message({
          message: "上传成功"
        });
      },
      //上传成功3回调
      handleSuccess3(res, file, fileList3) {
        this.strategyObj.BigIcon = res.ReturnParam;
        this.strategyObj.BigIconName = file.name;
        this.upup2 = true;
        this.$message({
          message: "上传成功"
        });
      },
      handleRemovesmall(file, fileList) {
        if (this.beforeAvatarUpload2() && this.upup1 == true) {
          axios({
            method: "get",
            url: "/v1/StrategyApi/DeleteUploadFile",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId"),
              m_FileName: this.getStr(this.strategyObj.SmallIcon, "?FileName=")
            }
          }).then(res => {
            this.strategyObj.SmallIcon = "";
            this.strategyObj.SmallIconName = "";
            this.fileList2 = [];
            this.has1 = true;
            this.$message({
              message: "删除策略小图成功"
            });
          });
        }
      },
      handleRemovebig(file, fileList) {
        if (this.beforeAvatarUpload3() && this.upup2 == true) {
          axios({
            method: "get",
            url: "/v1/StrategyApi/DeleteUploadFile",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId"),
              m_FileName: this.getStr(this.strategyObj.BigIcon, "?FileName=")
            }
          }).then(res => {
            this.strategyObj.BigIcon = "";
            this.strategyObj.BigIconName = "";
            this.fileList3 = [];
            this.has2 = true;
            this.$message({
              message: "删除策略大图成功"
            });
          });
        }
      },
      //上传文件
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

