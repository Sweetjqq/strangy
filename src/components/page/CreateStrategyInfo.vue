<template>
  <div>





    <div style="min-width:1084px;padding:0px 15px 0px">

      <div class="formBox">

        <el-row>

          <!--  策略类型-->

          <el-col :span="12">

            <div class="grid-content bg-purple">

              <label for="">策略类型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>

              <el-select v-model="Type" disabled style="width:322px;" class="ml12">

                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">

                </el-option>

              </el-select>

            </div>

          </el-col>



          <!--  标签-->

          <el-col :span="12">

            <div class="grid-content bg-purple-light" style="
  
  
  
          ">

              <label for="">标签&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>

              <el-select v-model="labelvalue1" style="width:24%;height: 36.5px;" class="ml12">

                <el-option v-for="item1 in options1" :key="item1.Name" :label="item1.Name" :value="item1.Name">

                </el-option>

              </el-select>



              <el-select v-model="labelvalue2" style="width:22%;height: 36.5px;">

                <el-option v-for="item2 in options2" :key="item2.Name" :label="item2.Name" :value="item2.Name">

                </el-option>

              </el-select>



              <el-select v-model="labelvalue3" style="width:34%;height: 36.5px;">

                <el-option v-for="item3 in options3" :key="item3.Name" :label="item3.Name" :value="item3.Name">

                </el-option>

              </el-select>

            </div>

          </el-col>









        </el-row>





        <el-row>

          <!--  标签-->

          <el-col :span="12">

            <div class="grid-content bg-purple">

              <label for="">策略名称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>

              <el-input ref="Name" v-model="validate.Name" style="width:322px;" placeholder="请输入内容" class="ml12"></el-input>

            </div>

          </el-col>

          <el-col :span="12">

            <div class="grid-content bg-purple-light">

              <!--  策略编号-->

              <label for="">策略编号</label>

              <el-input style="width:322px;" placeholder="创建后自动生成" class="ml12" disabled></el-input>

            </div>

          </el-col>

        </el-row>





        <el-row>

          <el-col :span="12">

            <div class="grid-content bg-purple">

              <div class="block">

                <span class="label">开始时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

                <el-date-picker id="it" ref="StyBeginDate" style="width:280px;" @change="queryStart()" value-format="yyyy-MM-dd" v-model="validate.StyBeginDate"
                  class="ml12" type="date" placeholder="选择日期">

                </el-date-picker>

              </div>

            </div>

          </el-col>

          <el-col :span="7" style="min-width:395px;">

            <div class="grid-content bg-purple-light">

              <div class="block">

                <span class="label">结束时间</span>

                <el-date-picker ref="StyEndDate" style="width:260px;" value-format="yyyy-MM-dd" class="ml12" v-model="validate.StyEndDate"
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

              <span style="float:left" class="label">策略报告&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

              <el-upload id="upload" style="display:inline-block;margin-left:16px" class="upload-demo" :on-error="handleError" :before-upload="beforeAvatarUpload1"
                :action="action" multiple :limit="1" :on-success="handleSuccess1" :headers="myHeaders" :file-list="fileList1"
                ref="upload1">



                <el-button size="small" type="primary">点击上传</el-button>

              </el-upload>

            </div>

          </el-col>

          <el-col :span="12">

            <div class="grid-content bg-purple-light">

              <span class="label">策略状态 </span>



              <el-switch class="ml12" v-model="status" disabled>

              </el-switch>

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

              <el-input v-model="validate.StopProfit" class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>

            </div>

          </el-col>

          <el-col :span="12">

            <div class="grid-content bg-purple-light">

              <label for="">止损(BP)

              </label>

              <el-input v-model="validate.StopLoss" class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>

            </div>

          </el-col>

        </el-row>

        <!-- 止盈止损 -->



        <!-- 债券估值方法 -->

        <el-row>

          <el-col :span="12">

            <label for="">债券估值方法</label>

            <el-select v-model="bondmethod" style="width:290px;" class="ml12">

              <el-option v-for="item in bondValuationMethod" :key="item.label" :label="item.label" :value="item.label">

              </el-option>

            </el-select>

          </el-col>

        </el-row>

        <!-- 债券估值方法 -->







        <!-- 策略描述 -->

        <el-row id="strategyDesc">

          <el-form ref="form" label-width="80px">

            <el-col :span="20">
            <el-form-item label="策略描述 ">
              <el-input type="textarea" id="textarea" v-model="Description" style="margin-left: 32px;"></el-input>
            </el-form-item>
          </el-col>
  
          </el-form>

        </el-row>

        <!-- 策略描述 -->





        <!-- 策略小图 -->

        <!-- <el-row>
  
          <el-col :span="18" style="
  
      max-height:  134px;
  
  ">
  
            <div class="grid-content bg-purple">
  
              <span style="float:left" class="label">策略小图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  
              <el-upload style="display:inline-block;margin-left:16px" ref="upload2" :before-upload="beforeAvatarUpload2" :on-remove="handleRemovesmall" class="upload-demo" :on-error="handleError" :on-success="handleSuccess2" :action="action" :headers="myHeaders" :file-list="fileList2"
  
                list-type="picture">
  
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
  
              <el-upload style="display:inline-block;margin-left:16px" ref="upload3" class="upload-demo" :before-upload="beforeAvatarUpload3" :on-remove="handleRemovebig" :on-error="handleError" :on-success="handleSuccess3" :action="action" :headers="myHeaders" :file-list="fileList3"
  
                list-type="picture">
  
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
              <label for="">基准收益率&nbsp;&nbsp;&nbsp;
              </label>
              <el-input class="ml12" style="width:100px;" v-model="validate.BenchmarkROR" placeholder="请输入内容"></el-input>%
            </div>

          </el-col>

          <el-col :span="9">

            <div class="grid-content bg-purple-light">
              <label for="">基准名称&nbsp;&nbsp;&nbsp;
              </label>
              <el-input class="ml12" :maxlength="20" style="width:186px;" v-model="BenchmarkName" placeholder="请输入内容"></el-input>
            </div>

          </el-col>

          <el-col :span="9">

            <div class="grid-content bg-purple-light">
              <label for="">基准更改日期&nbsp;&nbsp;&nbsp;
              </label>
              <el-date-picker id="it" ref="StyBeginDate" style="width:280px;" @change="queryStart()" value-format="yyyy-MM-dd" v-model="Datumchange"
                class="ml12" type="date" placeholder="选择日期">

              </el-date-picker>
            </div>

          </el-col>

        </el-row>

      </div>



    </div>

  </div>
</template>

<script>
  var fileDownload = require("js-file-download");

  // var FileSaver = require('file-saver');

  import {
    Format,
    getCookie
  } from "../../config/mUtils";

  export default {
    props: ["strategyObj"],

    data() {
      return {
        myHeaders: {
          Authorization: "bearer " + getCookie("Token")
        },
        BenchmarkName: "",
        Datumchange: "",
        action: "",

        so: "11",

        options: [], //信用债数组

        options1: [], //label数组

        options2: [], //label数组

        options3: [], //label数组

        Type: "信用债", //债类型

        validate: {
          Name: "", // 策略名称

          StyBeginDate: "", //开始时间

          StyEndDate: "", //结束时间

          StopProfit: 0, // 止损

          StopLoss: 0, //止盈

          BenchmarkROR: "" //基准收益率
        },

        bondmethod: "", //估值方法

        Description: "", //

        status: true,

        labelvalue1: "", // label值

        labelvalue2: "", // label值

        labelvalue3: "", // label值

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

        upup2: true
      };
    },

    created() {
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

          this.options1.unshift("");

          this.options2.unshift("");

          this.options3.unshift("");

          console.log(this.options1, "this.options");
        }
      });
    },

    mounted() {
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
    },

    methods: {
      //  <el-tag @click="selectThree()">3个月</el-tag>
      //         <el-tag  @click="selectSix()">6个月</el-tag>
      //         <el-tag  @click="selectYear()">1年</el-tag>

      alink() {
        axios({
            method: "post",

            url: "/v1/StrategyApi/download",

            headers: {
              Authorization: "bearer " + getCookie("Token")
            },

            params: {
              FileName: "9f41db0c-f661-48b6-9e9b-255a837c704a.pdf"
            }
          })
          .then(res => {})
          .catch(err => {
            if (err == "Error: Network Error") {
              this.$message({
                message: "上传失败"
              });
            }
          });

        // var $form = $('<form method="GET"></form>');

        //    $form.attr('action', 'http://10.21.10.167:9186/v1/StrategyApi/download?FileName=9f41db0c-f661-48b6-9e9b-255a837c704a.pdf');

        //    $form.appendTo($('body'));

        //    $form.submit();
      },

      queryStart() {
        const obj = {
          StyBeginDate: this.date(this.validate.StyBeginDate),

          StyEndDate: this.date(this.validate.StyEndDate),

          BenchmarkROR: this.validate.BenchmarkROR
        };

        return obj;
      },

      i() {
        const i = this.saveObj();

        console.log(i.CreationTime);
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

        if (this.bondmethod == "") {
          bond = 0;
        } else if (this.bondmethod == "中证估值") {
          bond = 1;
        } else if (this.bondmethod == "摊余成本") {
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

        let bigicon;

        if (this.BigIcon1 == "") {
          bigicon = "";
        } else {
          bigicon = this.BigIcon1;
        }

        let smallicon;

        if (this.SmallIcon1 == "") {
          smallicon = "";
        } else {
          smallicon = this.SmallIcon1;
        }

        const StyBeginDate = this.date(this.validate.StyBeginDate);
        const StyEndDate = this.date(this.validate.StyEndDate);
        const obj = {
          Id: 0,

          BenchmarkName: this.BenchmarkName,
          BenchmarkDate: this.date(this.Datumchange),

          CreationTime: this.date(new Date()),

          Code: "",

          Name: this.validate.Name, //

          ShortName: "xxx",

          Type: this.Type, //

          Label: label || "",

          StyBeginDate: StyBeginDate, //

          StyEndDate: StyEndDate, //

          ReportName: this.file1,

          Report: this.ReportName1,

          Status: "运行中",

          ValuationMethod: bond,

          StopProfit: this.validate.StopProfit, //

          StopLoss: this.validate.StopLoss, //

          Author: getCookie("UserId"),

          BenchmarkROR: this.validate.BenchmarkROR, //

          // SmallIconName: this.file2,

          // SmallIcon: smallicon,

          // BigIconName: this.file3,

          // BigIcon: bigicon,

          Description: this.Description, //

          Editor: null,

          AdjustTime: "2018-05-25",

          ReleaseStatus: "未发布"
        };

        console.log(obj, "obj");

        return obj;
      },

      //校验方法

      saveValiate() {
        if (this.validate.Name == "") {
          this.$message({
            message: `请输入策略名称`
          });

          return false;
        }

        if (this.validate.StyBeginDate == "") {
          this.$message({
            message: `请输入开始时间`
          });

          return false;
        }

        if (this.validate.StyBeginDate == "") {
          this.$message({
            message: `请输入结束时间`
          });

          return false;
        }

        if (this.validate.StopProfit === "") {
          this.$message({
            message: `请输入止盈`
          });

          return false;
        }

        if (this.validate.StopLoss === "") {
          this.$message({
            message: `请输入止损`
          });

          return false;
        }

        if (this.validate.BenchmarkROR == "") {
          this.$message({
            message: `请输入基准收益率`
          });

          return false;
        }

        if (this.BenchmarkName == "") {
          this.$message({
            message: `请输入基准名称`
          });

          return false;
        }

        if (this.Datumchange == "") {
          this.$message({
            message: `请输入基准更改日期`
          });

          return false;
        }

        // if (this.file2 == "") {
        //   this.$message({
        //     message: `请上传策略小图`
        //   });

        //   return false;
        // }

        // if (this.file3 == "") {
        //   this.$message({
        //     message: `请上传策略大图`
        //   });

        //   return false;
        // }

        var regu = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/; //基准收益率规则

        var regz = /^[0-9]\d*$/;

        if (!regz.test(this.validate.StopProfit) ||
          !regz.test(this.validate.StopLoss)
        ) {
          this.$message({
            message: `止盈止损必须是正整数`
          });

          return false;
        }

        if (!regu.test(this.validate.BenchmarkROR)) {
          this.$message({
            message: `请输入合法的基准收益率`
          });

          return false;
        }

        if (this.validate.StyBeginDate > this.validate.StyEndDate) {
          this.$message({
            message: `开始时间不能大于结束时间`
          });

          return false;
        }

        //返回值是校验不过的字段
      },

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
        this.validate.StyEndDate = this.timeHandle(3);
      },
      selectSix() {
        this.validate.StyEndDate = this.timeHandle(6);
      },
      selectYear() {
        this.validate.StyEndDate = this.timeHandle(12);
      },
      validateStartTime() {
        if (!this.validate.StyBeginDate) {
          this.$message({
            message: `请输入开始时间`
          });
          return false;
        } else {
          return true;
        }
      },

      //上传文件

      upload(item) {
        let formData = new FormData();

        formData.append("file", item.file);

        formData.append("type", "SKU");

        formData.append("id", this.$route.params.id);

        axios({
            method: "post",

            headers: {
              Authorization: "bearer " + getCookie("Token")
            },

            url: "/v1/StrategyApi/upload"
          })
          .then(res => {
            console.log(res, "uploadfilename.pdf");
          })
          .catch(err => {
            if (err == "Error: Network Error") {
              this.$message({
                message: "上传失败"
              });
            }
          });
      },

      beforeAvatarUpload1(file) {
        console.log(this.headers, "this.headersthis.headers");
      },

      beforeAvatarUpload2(file) {
        if (file && !/^image\/(jpeg|png)$/.test(file.type)) {
          console.log("1");

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
        console.log(err, "err");

        this.fileList = [];

        this.$message({
          message: "上传失败"
        });
      },

      // 上传成功1回调

      handleSuccess1(res, file, fileList1) {
        console.log(file.name, "file.namefile.namefile.name");

        this.file1 = file.name;

        this.ReportName1 = res.ReturnParam;

        this.fileList1 = [];

        const files = {
          name: file.name,

          url: res.data
        };

        this.fileList1.push(files);

        this.$message({
          message: "上传成功"
        });
      },

      // 上传成功2回调

      handleSuccess2(res, file, fileList2) {
        this.file2 = file.name;

        console.log(res.data, file.name);

        this.SmallIcon1 = res.ReturnParam;

        this.fileList2 = [];

        const files = {
          name: file.name,

          url: this.filepath + this.SmallIcon1
        };

        this.upup1 = true;

        this.fileList2.push(files);

        this.$message({
          message: "上传成功"
        });
      },

      //上传成功3回调

      handleSuccess3(res, file, fileList3) {
        this.file3 = file.name;

        this.BigIcon1 = res.ReturnParam;

        console.log(res.data, file.name);

        this.fileList3 = [];

        const files = {
          name: file.name,

          url: this.filepath + this.BigIcon1
        };

        console.log(files, "files");

        this.upup2 = true;

        this.fileList3.push(files);

        this.$message({
          message: "上传成功"
        });
      },

      handleRemovesmall(file, fileList) {
        if (this.beforeAvatarUpload2() && this.upup1 == true) {
          axios({
            method: "get",

            url: "/v1/StrategyApi/DeleteUploadFile",

            params: {
              AccountId: getCookie("UserId"),

              m_FileName: this.SmallIcon1
            },

            headers: {
              Authorization: "bearer " + getCookie("Token")
            }
          }).then(res => {
            console.log(res.data.ResultCode, "%%%%%");

            if (res.data.ResultCode == 200) {
              this.file2 = "";

              this.SmallIcon1 = "";

              this.fileList2 = [];

              this.$message({
                message: "删除策略小图成功"
              });
            } else {
              this.$message({
                message: "删除策略小图失败"
              });
            }
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

              m_FileName: this.BigIcon1
            }
          }).then(res => {
            if (res.data.ResultCode == 200) {
              this.file3 = "";

              this.BigIcon1 = "";

              this.fileList3 = [];

              this.$message({
                message: "删除策略大图成功"
              });
            } else {
              this.$message({
                message: "删除策略大图失败"
              });
            }
          });
        }
      },

      //上传文件

      getStr(string, str) {
        var str_before = string.split(str)[0];

        var str_after = string.split(str)[1];

        alert("前：" + str_before + " - 后：" + str_after);
      }
    }
  };

</script>


<style scoped>
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

