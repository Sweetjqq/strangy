<template>
  <div id="StrategyList">
    <div class="search">
      <span class="label">标签</span>
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
      <el-button type="primary" style="background: #4778c7;border-color: #4778c7;width: 95px;margin-left: 20px" @click="Search">查询</el-button>
      <router-link to="/CreateStrategy">
        <el-button type="primary" style="background-color:#ef7955;border-color: #ef7955">新建策略</el-button>
      </router-link>
    </div>
    <div class="ListData">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="运行中" name="first">
          <el-table :data="RunningData" border>
            <el-table-column prop="StrategyType" label="策略类型">
            </el-table-column>
            <el-table-column prop="StrategyName" label="策略名">
            </el-table-column>
            <el-table-column prop="StyBeginDate" label="开始时间">
            </el-table-column>·
            <el-table-column prop="StyEndDate" label="结束时间">
            </el-table-column>
            <el-table-column prop="ReleaseStatus" label="发布状态">
            </el-table-column>
            <el-table-column label="操作" width="320">
              <template slot-scope="scope">

                <div v-if="scope.row.ReleaseStatus == '未发布'">
                  <el-button @click="EditClick(scope.row)" type="primary" size="small" style="background-color: #4b98dc">
                    修改
                  </el-button>

                  <el-button @click="LookClick(scope.row)" type="info" size="small" style="background-color: #a8a9a8;border-color: #a8a9a8">
                    查看
                  </el-button>


                  <el-button @click="release(scope.row)" type="success" size="small" style="background-color: #67c23a">
                    发布
                  </el-button>
                  <el-button @click="editChartlist(scope.row)" type="warning" size="small" >
                    编辑图文
                  </el-button>
                </div>
                <div v-else>
                      <el-button @click="LookClick(scope.row)" type="info" size="small" style="background-color: #a8a9a8;border-color: #a8a9a8">
                    查看
                  </el-button>

                  <el-button @click="cancel(scope.row)" type="success" size="small">
                    取消发布 </el-button>
                     <el-button @click="editChartlist(scope.row)" type="warning" size="small" >
                    编辑图文
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

        </el-tab-pane>
        <el-tab-pane label="已结束" name="second">
          <el-table :data="EndData" border style="width: 100%">
            <el-table-column prop="StrategyType" label="策略类型">
            </el-table-column>
            <el-table-column prop="StrategyName" label="策略名">
            </el-table-column>
            <el-table-column prop="StyBeginDate" label="开始时间">
            </el-table-column>
            <el-table-column prop="StyEndDate" label="结束时间">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="LookClick(scope.row)" type="info" size="small" style="background-color: #a8a9a8;border-color: #a8a9a8">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--已结束分页-->
          <div style="float: right;margin: 15px 15px 0 0">
            <el-pagination @current-change="handleCurrentChangeEnd" layout="prev, pager, next, jumper" :page-size="Number(m_Pagesize_End)"
              :current-page="Number(m_Pageindex_End)" :total="Number(total_End)">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>


    <div id="releasedialogBox">
  <el-dialog
  title="操作"
  :visible.sync="dialogFormVisible"
  width="30%"
>
  <span style="padding-left:60px;">是否发布策略</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="releaseSumbit()">确 定</el-button>
    <el-button @click="dialogFormVisible = false">取 消</el-button>
  </span>
</el-dialog>
</div>
  </div>
</template>


<script>
import { setStore, getStore, getCookie , setTitle } from "../../config/mUtils";
export default {
  components: {},
  data() {
    return {
      dialogFormVisible: false,
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
      m_Status: "运行中",
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
      releaseRow: ""
    };
  },
  methods: {
    releaseSumbit() {
      axios({
        method: "get",
        url: "/v1/StrategyApi/SetStrategyReleaseStatus",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_StrategyId: this.releaseRow.StrategyId,
          m_ReleaseStatus: "已发布"
        }
      }).then(res => {
        console.log(res, "res");
        if (res.data.ResultCode == 200) {
          this.$message({
            message: "发布成功"
          });
          this.getLabel();
          this.GetTotals();
          this.dialogFormVisible = false;
        } else if (res.data.ResultCode == 400) {
          this.$message({
            message: "Token已经过期"
          });
          this.dialogFormVisible = false;
        }
      });
    },
    editChartlist(row) {
      this.$router.push("/EditStrategyText?id=" + row.StrategyId);
    },
    //发布验证
    releaseValidate(params) {
      axios({
        method: "get",
        url: "/v1/StrategyApi/ValidateStrategyGraphic",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_StrategyId: params
        }
      }).then(res => {
        if (res.data.ResultCode == 200) {
          this.dialogFormVisible = true;
        } else {
          this.$message({
            message: res.data.ResultMessage
          });
        }
      });
    },
    //发布
    release(row) {
      this.releaseValidate(row.StrategyId);
      console.log(row.StrategyId);
      this.releaseRow = row;
    },
    //取消发布
    cancel(row) {
      console.log(row.StrategyId);
      axios({
        method: "get",
        url: "/v1/StrategyApi/SetStrategyReleaseStatus",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_StrategyId: row.StrategyId,
          m_ReleaseStatus: "未发布"
        }
      }).then(res => {
        console.log(res, "res");
        if (res.data.ResultCode == 200) {
          this.getLabel();
          this.GetTotals();
        } else {
          this.$message({
            message: "Token已经过期"
          });
        }
      });
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
    Search() {
      this.m_Pageindex_Running = 1;
      this.m_Pageindex_End = 1;
      this.GetTotals();
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
      }).then(response => {
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
      });
    },
    //      获取总条数
    GetTotals() {
      let m_LabelStr = [this.TypeLabel, this.TimeLabel, this.ChartLabel].join(
        ","
      );
      axios({
        method: "get",
        url: "/v1/StrategyApi/GetStrategyAmountByLabel",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_LabelStr: m_LabelStr,
          m_StrategyType: "信用债",
          m_Status: this.m_Status
        }
      }).then(response => {
        if (response.data.status == 401) {
          this.$message({
            message: "Token已经过期"
          });
          this.$router.push("/Login");
        }
        if (response.data.ResultCode == 200) {
          console.log(response.data, "获取总条数");
          if (this.m_Status == "运行中") {
            this.total_Running = response.data.ReturnParam;
          } else {
            this.total_End = response.data.ReturnParam;
          }
          this.SearchStr();
        } else {
          this.$message({
            message: response.data.ResultMessage,
            type: "warning"
          });
        }
      });
    },
    //搜索获取策略列表数据
    SearchStr() {
      let m_LabelStr = [this.TypeLabel, this.TimeLabel, this.ChartLabel].join(
        ","
      );
      let m_Pagesize;
      let m_Pageindex;
      if (this.m_Status == "运行中") {
        m_Pagesize = this.m_Pagesize_Running;
        m_Pageindex = this.m_Pageindex_Running;
      } else {
        m_Pagesize = this.m_Pagesize_End;
        m_Pageindex = this.m_Pageindex_End;
      }

      axios({
        method: "get",
        url: "/v1/StrategyApi/GetStrategyPagedByLabel",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          AccountId: getCookie("UserId"),
          m_LabelStr: m_LabelStr,
          m_StrategyType: "信用债",
          m_Status: this.m_Status,
          m_PageSize: m_Pagesize,
          m_PageNum: m_Pageindex
        }
      }).then(response => {
        if (response.data.status == 401) {
          this.$message({
            message: "Token已经过期"
          });
          this.$router.push("/Login");
        }
        if (response.data.ResultCode == 200) {
          if (this.m_Status == "运行中") {
            this.RunningData = response.data.ReturnParam;
          } else {
            this.EndData = response.data.ReturnParam;
          }
          console.log(response.data, "搜索获取策略列表数据");
        } else {
          this.$message({
            message: response.data.ResultMessage,
            type: "warning"
          });
        }
      });
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
      console.log(this.activeName, "this.activeName");
      if (tab.name == "first") {
        this.m_Status = "运行中";
      } else {
        this.m_Status = "已结束";
      }
      this.GetTotals();
    },
    EditClick(row) {
      console.log(row);
      this.$router.push("/EditStrategy?Id=" + row.StrategyId);
    },
    LookClick(row) {
      console.log(row);
      this.$router.push("/LookStrategy?Id=" + row.StrategyId);
    },
    handleCurrentChangeEnd(val) {
      this.m_Pageindex_End = val;
      console.log(`当前页: ${val}`);
      this.GetTotals();
    },
    handleCurrentChange(val) {
      this.m_Pageindex_Running = val;
      console.log(`当前页: ${val}`);
      this.GetTotals();
    }
  },
  created () {
    setTitle('策略列表');
  },
  mounted: function() {
    this.getLabel();
    this.GetTotals();
    setTimeout(() => {
      document.title = "我的策略";
    }, 1000);
  }
};
</script>

<style scoped>
.search {
  padding: 35px;
  box-sizing: border-box;
  padding-bottom: 0;
}

.search .label {
  font-size: 14px;
  font-family: "Microsoft YaHei";
  font-weight: 700;
}

.el-input__icon .el-input__inner {
  padding-right: 0px !important;
}

.ListData {
  margin-top: 15px;
  padding-left: 10px;
  box-sizing: border-box;
}
</style>
