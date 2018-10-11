<template>
  <div id="StrategyList" style="min-width:1050px;">
    <el-row style="margin-top:20px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="form" label-width="80px">
            <el-form-item label="策略名" style="margin-bottom:0px;  font-size: 14px; font-weight: 700;">
              <el-input v-model="StrategyName" style="width:217px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6" :offset="1" style="
    min-width: 275px;
">
        <div class="grid-content bg-purple-light">
          <span class="label" style="
      font-weight: 700;
      font-size: 14px;
      color: #48576a;
  ">创建人</span>
          <el-select v-model="foundervalue" placeholder="请选择">
            <el-option v-for="item in founderOptions" :key="item.UserId" :label="item.UserId" :value="item.UserId">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="6" style="
    min-width: 275px;
">
        <div class="grid-content bg-purple">
          <span class="label" style="
      font-weight: 700;
      font-size: 14px;
      color: #48576a;
  ">状态</span>
          <el-select v-model="statusvalue" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

      </el-col>




    </el-row>
    </el-form>
    <div class="search">

      <el-row style="min-width:1100px;">
        <el-col :span="13" style="min-width:706px;">
          <span class="label" style="padding-right:12px;">标签</span>
          <el-select v-model="TypeValue" placeholder="请选择" @change="getTypeLabel">
            <el-option v-for="item in OptionsType" :key="item.Name" :label="item.Name" :value="item.Name">
            </el-option>
          </el-select>
          <el-select v-model="TimeValue" placeholder="请选择" @change="getTimeLabel">
            <el-option v-for="item in OptionsTime" :key="item.Name" :label="item.Name" :value="item.Name">
            </el-option>
          </el-select>
          <el-select v-model="ChartValue" placeholder="请选择" @change="getChartLabel">
            <el-option v-for="item in OptionsChart" :key="item.Name" :label="item.Name" :value="item.Name">
            </el-option>
          </el-select>

        </el-col>
              <el-col :span="5"  style="
    min-width: 290px;
">
        <div class="grid-content bg-purple">
          <span class="label" style="
      font-weight: 700;
      font-size: 14px;
      color: #48576a;
  ">发布状态</span>
          <el-select v-model="releasestatusvalue" placeholder="请选择">
            <el-option v-for="item in releasestatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

      </el-col>
        

      </el-row>

      <el-row>
        <el-col :span="8" style="padding-top:20px;">

          <el-button type="primary" style="background: #4778c7;border-color: #4778c7;width: 95px;margin-left: 20px" @click="Search">查询</el-button>
          <el-button type="danger" style="width: 95px;margin-left: 20px" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="ListData">
      <el-table :data="RunningData" border style="width: 100%">
        <el-table-column prop="StrategyCode" label="策略编号">
        </el-table-column>
        <el-table-column prop="StrategyName" label="策略名">
        </el-table-column>

        <!-- prop="StrategyLabel" -->
        <el-table-column prop="StrategyLabel" label="标签" width="280">

        </el-table-column>

        <el-table-column prop="Author" label="创建人">
        </el-table-column>
        <el-table-column prop="StyBeginDate" label="开始时间">
        </el-table-column>
        <el-table-column prop="StyEndDate" label="结束时间">
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="80">
        </el-table-column>
        
        <el-table-column prop="ReleaseStatus" label="发布状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button @click="LookClick(scope.row)" type="primary" size="small" style="background-color: #4b98dc">查看
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--运行中分页-->
      <div style="float: right;margin: 15px 15px 0 0">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(m_Pagesize_Running)"
          :current-page="Number(m_Pageindex_Running)" :total="Number(total_Running)">
        </el-pagination>
      </div>

    </div>
  </div>
</template>


<script>
import { IpUrl } from "../../config/IpUrl";
import Aplayer from "vue-aplayer";
import {
  setStore,
  getStore,
  getCookie,
  checkpermissions,
  getCaption,
  enterAuthValited
} from "../../config/mUtils";
import { authLoaction } from "../../config/authKey.js";
export default {
  data() {
    return {
      StrategyLabelArr: [],
      foundervalue: "",
      statusvalue: "",
      founderOptions: [],
      releasestatusvalue:'',
      releasestatusOptions: [
        {
          value: "",
          label: ""
        },
        {
          value: "已发布",
          label: "已发布"
        },
        {
          value: "未发布",
          label: "未发布"
        }
      ],
      statusOptions: [
        {
          value: "",
          label: ""
        },
        {
          value: "运行中",
          label: "运行中"
        },
        {
          value: "已结束",
          label: "已结束"
        }
      ],
      dis: true,

      // 交易类型数据

      OptionsType: [],

      //交易时间数据

      OptionsTime: [],

      //交易曲线数据

      OptionsChart: [],

      TypeValue: "", //交易类型

      TimeValue: "", //交易时间

      ChartValue: "", //交易曲线

      activeName: "first",

      m_Status: "",

      //  运行中Table数据

      RunningData: [],

      //已结束Table数据

      EndData: [],

      m_Pagesize_Running: "10", //每页多少条数据,

      m_Pageindex_Running: "1", //当前第几页

      total_Running: "",

      m_Pagesize_End: "10", //每页多少条数据,

      m_Pageindex_End: "1", //当前第几页

      total_End: "",

      TypeLabel: "",

      TimeLabel: "",

      ChartLabel: "",
      StrategyName: "",
      totalValue: ""
    };
  },

  methods: {
    filterTag(value, row) {
      return row.tag === value;
    },
    reset() {
      this.releasestatusvalue = "";
      this.StrategyName = "";
      this.foundervalue = "";
      this.statusvalue = "";
      this.totalValue = "";
      this.TypeValue = "";
      this.TimeValue = "";
      this.ChartValue = "";
      this.handletotalValue();
      this.SearchStr({
        Status: this.statusvalue,
        PageNum: 1,
        ReleaseStatus:this.releasestatusvalue,
        StrategyName: this.StrategyName,
        Author: this.foundervalue,
        label: this.totalValue
      });
      this.m_Pageindex_Running = 1;
    },
    getTypeLabel(Id) {
      console.log(Id);
      this.TypeLabel = Id;
    },
    getTimeLabel(Id) {
      console.log(Id);
      this.TimeLabel = Id;
    },
    getChartLabel(Id) {
      console.log(Id);

      this.ChartLabel = Id;
    },
    handletotalValue() {
      if (!this.TypeValue) {
        this.TypeValue = "";
      }
      if (!this.TimeValue) {
        this.TimeValue = "";
      }
      if (!this.ChartValue) {
        this.ChartValue = "";
      }
      this.totalValue =
        this.TypeValue + "," + this.TimeValue + "," + this.ChartValue;
    },

    Search() {
      this.m_Pageindex_Running = 1;
      console.log(this.statusvalue, "seach");
      this.handletotalValue();

      this.SearchStr({
        Status: this.statusvalue,
        ReleaseStatus:this.releasestatusvalue,
        PageNum: 1,
        StrategyName: this.StrategyName,
        Author: this.foundervalue,
        label: this.TypeValue + "," + this.TimeValue + "," + this.ChartValue
      });
    },

    //  获取创建人
    getfoundervalue() {
      axios({
        method: "get",
        url: "/GetPUsersBySystemId",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_SysId: "StrategySysIdentifier"
        }
      })
        .then(res => {
          console.log(res.data.ReturnParam.$values, ";ss");
          this.founderOptions = res.data.ReturnParam.$values;
        })
        .catch(err => {
          this.errorHandle(err);
        });
    },
    //获取标签
    getLabel() {
      axios({
        method: "get",
        url: "/v1/StrategyApi/GetStrategyLabels",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_Type: "0"
        }
      })
        .then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });

            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取标签");
            this.OptionsType = response.data.ReturnParam.LabelOneList;
            this.OptionsTime = response.data.ReturnParam.LabelTwoList;
            this.OptionsChart = response.data.ReturnParam.LabelThreeList;
            this.OptionsType.unshift("");
            this.OptionsTime.unshift("");
            this.OptionsChart.unshift("");
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.errorHandle(err);
        });
    },
    //      获取总条数
    //搜索获取策略列表数据
    // this.SearchStr({Status:this.statusvalue,PageNum:1,StrategyName:this.StrategyName,Author:this.foundervalue});

    SearchStr(obj) {
      let m_Pagesize = "10";
      axios({
        method: "get",
        url: "/v1/StrategyApi/GetStrategyPagedByLabel3",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_LabelStr: obj.label,
          m_StrategyType: "信用债",
          m_Status: obj.Status,
          m_ReleaseStatus :obj.ReleaseStatus,
          m_PageSize: m_Pagesize,
          m_PageNum: obj.PageNum,
          m_StrategyName: obj.StrategyName,
          m_Author: obj.Author
        }
      })
        .then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            this.RunningData = response.data.ReturnParam;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.errorHandle(err);
        });

      axios({
        method: "get",
        url: "/v1/StrategyApi/GetStrategyAmountByLabel3",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          m_ReleaseStatus :obj.ReleaseStatus,
          AccountId: getCookie("UserId"),
          m_Author: obj.Author,
          m_StrategyName: obj.StrategyName,
          m_LabelStr: obj.label,
          m_StrategyType: "信用债",
          m_Status: obj.Status
        }
      })
        .then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取总条数");
            this.total_Running = response.data.ReturnParam;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.errorHandle(err);
        });
    },
    LookClick(row) {
      console.log(row);
      this.$router.push("/LookStrategy?Id=" + row.StrategyId);
    },
    handleCurrentChange(val) {
      this.m_Pageindex_Running = val;
      console.log(`当前页: ${val}`);
      this.handletotalValue();
      this.SearchStr({
        Status: this.statusvalue,
        PageNum: val,
         ReleaseStatus:this.releasestatusvalue,
        StrategyName: this.StrategyName,
        Author: this.foundervalue,
        label: this.TypeValue + "," + this.TimeValue + "," + this.ChartValue
      });
      // this.SearchStr({StrategyName:'',pageNum:val});
    },
    authMsg() {
      this.$message({
        message: "没有权限，请联系管理员"
      });
      this.$router.push("/StrategyList");
      // this.$router.push("/Error");
    },
    pass() {},
    errorHandle(error) {
      if (error == "Error: Request failed with status code 504") {
        this.$message({
          message: "服务器超时"
        });
      }
    },

    init() {
      //这边是引入了axios然后使用的get请求的一个音乐列表接口
      const getMusicList = url => axios.get(url);
      //这边url随大家更改了
      let url = "";
      let data = getMusicList(url);
      //以下就是这边对请求的一个处理，看接口了
      // if(data && data.data.showapi_res_code==0){
      //   this.musicList = data.data.showapi_res_body.pagebean.songlist;

      //   for(let i=0;i<=this.musicList.length;i++){
      //     if(i<=9){
      //       let obj={};
      //       //url=>歌曲地址 title=>头部 author=>歌手 pic=>写真图片 lrc=>歌词
      //       //其中url必须有，其他的都是非必须
      //       obj.title = this.musicList[i].songname;
      //       obj.author = this.musicList[i].singername;
      //       obj.url = this.musicList[i].url;
      //       obj.pic = this.musicList[i].albumpic_small;
      //       obj.lrc = this.musicList[i].irl;
      //       //把数据一个个push到songList数组中，在a-player标签中使用 :music="songList" 就OK了
      //       this.songList.push(obj);
      //     }
      //   }
      //   //因为是异步请求，所以一开始播放器中是没有歌曲的，所有给了个v-if不然会插件默认会先生成播放器，导致报错(这个很重要)
      //   this.flag = true;
      // };
    }
  },
  created() {},
  mounted() {
    this.getfoundervalue();
    enterAuthValited("211", authLoaction, this.authMsg);
    this.getLabel();
    this.handletotalValue();
    this.SearchStr({
      Status: this.statusvalue,
      PageNum: 1,
       ReleaseStatus:this.releasestatusvalue,
      StrategyName: this.StrategyName,
      Author: this.foundervalue,
      label: this.TypeValue + "," + this.TimeValue + "," + this.ChartValue
    });
    setTimeout(() => {
      document.title = "信用债策略";
    }, 1000);
    // this.SearchStr({StrategyName:'',pageNum:1});

    // this.init();
    // this.$refs.player.play()
  }
};
</script>

<style scoped>
.search {
  padding: 20px;
  padding-left: 35px;
  /* margin-bottom:  */
  box-sizing: border-box;

  padding-bottom: 0;
}

.search .label {
  font-size: 14px;

  font-family: "Microsoft YaHei";

  color: #48576a;

  font-weight: 700;
}

.el-input__icon .el-input__inner {
  padding-right: 0px !important;
}

.ListData {
  margin-top: 30px;

  padding-left: 10px;
  padding-right: 10px;

  box-sizing: border-box;
}
</style>
