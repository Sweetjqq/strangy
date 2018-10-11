<template>
  <div id="StrategyList">
    <div class="ListData">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="策略信息" name="first">
          <EditStrategyInfo ref="whateverName" :strategyObj="strategyObj"></EditStrategyInfo>
        </el-tab-pane>
        <el-tab-pane label="策略建议" name="second">
          <el-form label-width="80px" style="padding:20px 30px ">
            <el-form-item label="建议日期">
              <el-date-picker v-model="defaultTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="timeChange">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="投资金额" style="display: inline-block">
              <el-input style="width: 100px" size="small" placeholder="请输入内容" v-model='ComMoney'>
              </el-input>&nbsp;&nbsp;&nbsp;万
            </el-form-item>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="资金成本" style="display: inline-block">
              <el-input style="width: 100px" size="small" placeholder="请输入内容" v-model='ComAmount'>
              </el-input>&nbsp;&nbsp;&nbsp;%
            </el-form-item>
            <el-form-item>
              <el-button plain size="small" style="color: #28b6f5;border-color: #28b6f5" @click="AddBond()">添加债券</el-button>
              <el-button type="info" size="small" style="background: #a8a9a8;border-color: #a8a9a8" @click="showEchart()">生成图表</el-button>
            </el-form-item>
          </el-form>

          <!--债权列表-->
          <el-table :data="StrategyData" border show-summary :summary-method="getSummaries" style="width: 100%">
            <el-table-column type="index" width="80">
            </el-table-column>
            <el-table-column prop="ShortName" label="简称" min-width="180">
            </el-table-column>
            <el-table-column prop="Code" label="代码" min-width="150">
            </el-table-column>
            <el-table-column prop="FaceValue" label="面值（万）" min-width="150">
            </el-table-column>
            <el-table-column prop="Ratio" label="比例%" min-width="150">
            </el-table-column>
            <el-table-column prop="ROR" label="收益率" min-width="150">
            </el-table-column>
            <el-table-column prop="Coupon" label="票息" min-width="150">
            </el-table-column>
            <el-table-column prop="DebtRating" label="债项评级" min-width="150">
            </el-table-column>
            <el-table-column prop="BodyRating" label="主体评级" min-width="150">
            </el-table-column>
            <el-table-column prop="ShowTTM" label="剩余期限" min-width="150">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="EditClick(scope.row)" type="primary" size="small" style="background-color: #4b98dc">
                  编辑
                </el-button>
                <el-button @click="DelClick(scope.row)" type="primary" size="small" style="background-color: #ef7955;border-color: #ef7955">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="AllEchart" v-if="showState">
            <!--组合信息-->
            <div class="combination">
              <div class="left">
                组合信息
              </div>
              <div class="right">
                <div class="content_head">
                  <span>票息</span>
                  <span>收益率</span>
                  <span>久期</span>
                  <span>杠杆率</span>
                  <span>剩余期限</span>
                </div>
                <div class="main_content">
                  <ul>
                    <li>
                      {{FloatTwo(GetCombinationStatic.Coupon)}}
                    </li>
                    <li>
                      {{FloatTwo(GetCombinationStatic.YTM)}}
                    </li>
                    <li>
                      {{GetCombinationStatic.Duration}}
                    </li>
                    <li>
                      {{GetCombinationStatic.Lever}}
                    </li>
                    <li>
                      {{GetCombinationStatic.TTM}}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!--收益图-->
            <div>
              <span class="sty_sm_title">收益图</span>
              <div class="only_echart">
                <div class="echart_left">
                  <LineChart id="Profit" :options='ProfitData' class="echarts" ref="c1" :max='max'></LineChart>
                </div>
                <div class="text_msg">
                  <textarea v-model="Distributes.BenchmarkDistributeDesp" placeholder="请输入信息" autocomplete>
                  </textarea>
                </div>
              </div>
            </div>
            <!--持仓分布-->
            <div>
              <span class="sty_sm_title">持仓分布</span>
              <div class="only_echart">
                <div class="echart_left">
                  <PieChart id="Position" :options='PositionData' class="echarts" ref="c2"></PieChart>
                </div>
                <div class="text_msg">
                  <textarea v-model="Distributes.PosDistributeDesp" placeholder="请输入信息" autocomplete>
                  </textarea>
                </div>
              </div>
            </div>
            <!--到期时间分布-->
            <div>
              <span class="sty_sm_title" style="display: inline-block">到期时间分布</span>
              <div style="display: inline-block;margin-left: 50px">
                <el-select v-model="ExpiryDataTime" placeholder="请选择" @change='DataTime' size='small' style="width: 100px">
                  <el-option v-for="item in selectTime" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <div class="only_echart">
                <div class="echart_left" style="position: relative">
                  <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" :class="{'none':!ExpiryState}">
                    <PieChart id="Expiry" :options='ExpiryData' class="echarts" ref="c3"></PieChart>
                  </div>

                  <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" :class="{'none':ExpiryState}">
                    <PieChart id="Expiry1" :options='ExpiryData1' class="echarts" ref="c33"></PieChart>
                  </div>
                </div>
                <div class="text_msg">
                  <textarea v-model="Distributes.DueTimeDesp" placeholder="请输入信息" autocomplete>
                  </textarea>
                </div>
              </div>
            </div>



            <!--主体行业分布-->
            <div>
              <span class="sty_sm_title">主体行业分布</span>
              <div class="only_echart">
                <div class="echart_left">
                  <PieChart id="MainIndustry" :options='MainIndustryData' class="echarts" ref="c4"></PieChart>
                </div>
                <div class="text_msg">
                  <textarea v-model="Distributes.IndustryDistributeDesp" placeholder="请输入信息" autocomplete>
                  </textarea>
                </div>
              </div>
            </div>
            <!--现金流到期分布-->
            <div>
              <span class="sty_sm_title" style="display: inline-block">现金流到期分布</span>
              <div style="display: inline-block;margin-left: 50px">
                <el-select v-model="ExpiryDataTime1" placeholder="请选择" @change='DataTime1' size='small' style="width: 100px">
                  <el-option v-for="item in selectTime" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="only_echart">
                <div class="echart_left" style="position: relative">
                  <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" :class="{'none1':!ExpiryState1}">
                    <BarChart id="Cash" :options='CashData' :options1='CashData1' class="echarts" ref="c5"></BarChart>
                  </div>
                  <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" :class="{'none1':ExpiryState1}">
                    <BarChart id="Cash1" :options='CashData2' :options1='CashData3' class="echarts" ref="c55"></BarChart>
                  </div>


                </div>
                <div class="text_msg">
                  <textarea v-model="Distributes.CashFlowDistributeDesp" placeholder="请输入信息" autocomplete>
                  </textarea>
                </div>
              </div>
            </div>
            <!--评级分布-->
            <div>
              <span class="sty_sm_title">评级分布</span>
              <div class="only_echart">
                <div class="echart_left">
                  <div style="width: 47%;display: inline-block;height: 100%;border-right: 1px solid #dce6ef;margin-right:5% ">
                    <PieChart id="Debt" :options='DebtData' ref="c6" :text='text'></PieChart>
                  </div>
                  <div style="width: 47%;display: inline-block;height: 100%">
                    <PieChart id="Debt1" :options='DebtData1' ref="c7" :text='text1'></PieChart>
                  </div>

                </div>
                <div class="text_msg">
                  <textarea v-model="Distributes.DebtRatDistributeDesp" placeholder="请输入信息" autocomplete>
                  </textarea>
                </div>
              </div>
            </div>

            <!--风险分析-->
            <div>
              <span class="sty_sm_title">风险分析</span>
              <div class="textArea">
                <el-input resize="none" type="textarea" :autosize="{ minRows: 2,}" placeholder="请输入内容" v-model="Distributes.VentureAnalysis">
                </el-input>
              </div>

            </div>
            <!--收益分析-->
            <div>
              <span class="sty_sm_title">收益分析</span>
              <div class="textArea">
                <el-input resize="none" type="textarea" :autosize="{ minRows: 2,}" placeholder="请输入内容" v-model="Distributes.IncomeAnalysis">
                </el-input>
              </div>

            </div>
            <!--总结及展望-->
            <div>
              <span class="sty_sm_title">总结及展望</span>
              <div class="textArea">
                <el-input resize="none" type="textarea" :autosize="{ minRows: 2,}" placeholder="请输入内容" v-model="Distributes.PositionAnalysis">
                </el-input>
              </div>

            </div>
            <!--修改理由-->
            <div>
              <span class="sty_sm_title">修改理由</span>
              <div class="textArea">
                <el-input resize="none" type="textarea" :autosize="{ minRows: 2,}" placeholder="请输入内容" v-model="Distribute.ChangeReason">
                </el-input>
              </div>

            </div>
          </div>
          <div class="saveBtn">
            <el-row>
              <el-button type="warning" @click="SaveStrage">保存</el-button>
              <el-button type="danger" @click="SaveBack">返回</el-button>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--债券弹窗-->
    <BondWindow :title="title" :ControlWindouw="ControlWindouw" :form="form" @Bond="ShowMsgFromChild" @Back="Back" :states="states"
      @BondMsg="BondMsg"></BondWindow>

    <loadding v-if="showLoadding" :loaddingMsg="loaddingMsg"></loadding>
    <!--删除提示-->
    <el-dialog title="温馨提示" :visible.sync="centerDialogVisible" :show-close="false" width="10%" center>
      <span style="color: red;">确定要删除此交易数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import PieChart from '../EchartsConponents/PieChart.vue'
  import BarChart from '../EchartsConponents/BarChart.vue'
  import LineChart from '../EchartsConponents/LineChart.vue'
  import BondWindow from '../PageConponents/BondWindow.vue'
  import EditStrategyInfo from './EditStrategyInfo.vue'
  import loadding from '../common/loadding.vue'


  import {
    format
  } from '../../config/mUtils'
  import {
    IpUrl
  } from '../../config/IpUrl'
  import {
    setStore,
    getStore,
    getCookie
  } from '../../config/mUtils'
  export default {
    components: {
      PieChart,
      BarChart,
      LineChart,
      EditStrategyInfo,
      BondWindow,
      loadding
    },
    data() {
      return {
        ExpiryState: true,
        ExpiryState1: true,
        showLoadding: false,
        loaddingMsg: "",
        ControlWindouw: false,
        title: "推荐债券",
        form: {},
        Distributes: {},
        Distribute: {},
        showState: false,
        m_StrategyDbEntity: {},
        WindouData: {},
        ProfitData: {
          xAxisdata: [],
          seriesdata: []
        }, //收益图数据
        PositionData: {
          legenddata: [],
          seriesdata: []
        }, //持仓分布数据
        ExpiryData: {
          legenddata: [],
          seriesdata: []
        }, //到期时间分布（到期日）
        ExpiryData1: {
          legenddata: [],
          seriesdata: []
        }, //到期时间分布（行权日）
        CashData: {
          xAxisdata: [],
          seriesdata: [],
        }, //现金流数据
        CashData1: {
          xAxisdata: [],
          seriesdata: [],
        }, //现金流数据
        CashData2: {
          xAxisdata: [],
          seriesdata: [],
        }, //现金流数据
        CashData3: {
          xAxisdata: [],
          seriesdata: [],
        }, //现金流数据
        MainIndustryData: {
          legenddata: [],
          seriesdata: []
        }, //主体分部数据
        DebtData: {
          legenddata: [],
          seriesdata: []
        }, //债项评级数据
        DebtData1: {
          legenddata: [],
          seriesdata: []
        }, //主体评级数据
        riskData: '', //风险分析数据
        textarea: '',
        activeName: 'first',
        defaultTime: '',
        m_EndDate: "",
        m_BenchmarkROR: "",
        StrategyData: [], //债券列表数据，
        states: "create",
        StrategyId: "", //策略ID
        strategyObj: {}, //组件传输的数据
        GetCombinationStatic: {},
        centerDialogVisible: false, //控住删除弹窗提示显隐
        rowCode: "",
        oldform: {},
        statesOK: false,
        max: "",
        selectTime: [{
          value: '到期日',
          label: '到期日'
        }, {
          value: '行权日',
          label: '行权日'
        }],
        ExpiryDataTime: '到期日',
        ExpiryDataTime1: '到期日',
        text: '债项评级',
        text1: '主体评级',
        e1: false,
        e2: false,
        e3: false,
        e4: false,
        e5: false,
        e6: false,
        e7: false,
        ComMoney: 3000,
        ComAmount: 3.5,
      }
    },
    methods: {
      // 判断是不是浮点数字
      isNumber(val) {
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        if (regPos.test(val)) {
          return true;
        } else {
          return false;
        }
      },

      // 判断是不是数字
      isIntNum(val) {
        if (val === "" || val == null) {
          return false;
        }
        if (!isNaN(val)) {
          return true;
        } else {
          return false;
        }
      },
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        const values = [];
        columns.forEach((column, index) => {
          if (index == 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.property == 'FaceValue' || column.property == 'Ratio') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (column.property == 'Ratio') {
              let Num = 0;
              // 获取面值总和
              for (let value of this.StrategyData) {
                Num += parseFloat(value.FaceValue);
              }
              sums[index] = ((Num / this.ComMoney) * 100).toFixed(2);
            }
          } else {
            sums[index] = '--';
          }
        })
        return sums;
      },
      DataTime(value) {
        console.log(value, '到期时间分布');
        if (value == '到期日') {
          this.ExpiryState = true;
        } else {
          this.ExpiryState = false;
        }
      },
      DataTime1(value) {
        console.log(value, "现金流到期分布");
        if (value == '到期日') {
          this.ExpiryState1 = true;
        } else {
          this.ExpiryState1 = false;
        }
      },
      SaveBack() {
        this.$router.push('/StrategyList');
      },
      //去左右空格;
      trim(s) {
        if (s) {
          return s.replace(/(^\s*)|(\s*$)/g, "");
        }
      },
      // 添加比例计算逻辑
      AddRatio() {
        let Num = 0;
        // 获取面值总和
        for (let value of this.StrategyData) {
          Num += parseFloat(value.FaceValue);
        }
        // 计算每条债券比例
        for (let value of this.StrategyData) {
          let onlyRatio = ((parseFloat(value.FaceValue) / (this.ComMoney)) * 100).toFixed(2);
          value.Ratio = onlyRatio;
        }
      },
      //通过策略Id获取策略的详细信息
      GetStrategyById() {
        axios({
          method: 'get',
          url: '/v1/StrategyApi/GetStrategyById',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          params: {
            "m_StrategyId": this.StrategyId,
            "AccountId": getCookie("UserId"),
          },
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          this.showLoadding = false;
          if (response.data.ResultCode == 200) {
            this.strategyObj = response.data.ReturnParam.StrategyMasterRecord;
            this.ComMoney = this.strategyObj.InvestmentAmount;
            this.ComAmount = this.strategyObj.CapitalCost;
            this.defaultTime = this.strategyObj.OfferDay;
            this.StrategyData = response.data.ReturnParam.StyUSRecord;
            console.log(response.data, "通过策略Id获取策略的详细信息");
            console.log(this.defaultTime, "this.defaultTime");
            this.Distributes = response.data.ReturnParam.StrategyDespRecord;
            this.GetCombination();
            this.AddRatio();
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //点击添加债券获取债券信息
      getBondInfo() {
        this.showLoadding = true;
        this.loaddingMsg = "正在获取相关的债券信息，请稍等";
        axios({
          method: 'get',
          url: '/v1/StrategyApi/GetBondInfo',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          params: {
            "AccountId": getCookie("UserId"),
            "m_BodnCode": this.trim(this.form.Code),
            "m_TargetDay": this.defaultTime,
            "m_IsProlong": true
          },
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          this.showLoadding = false;
          if (response.data.ResultCode == 200) {
            console.log(response.data, "点击添加债券获取债券信息");
            this.form = response.data.ReturnParam;
            this.statesOK = true;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取收益率曲线图数据
      GetStrategyYTMListData() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.timeChange();
        this.e1 = false;
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetStrategyYTMListData',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId,
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_EndDate": this.m_EndDate
              },
              {
                "m_BenchmarkROR": this.m_BenchmarkROR
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }, {
                "m_InvestmentAmount": this.ComMoney,
              },
              {
                "m_CapitalCost": this.ComAmount,
              }
            ]
          },
        }).then(response => {
          this.showLoadding = false;
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取收益率曲线图数据");
            this.ProfitData.xAxisdata = response.data.ReturnParam.x_Title;
            this.ProfitData.seriesdata = [{
                name: '组合',
                type: 'line',
                data: response.data.ReturnParam.OneLineData
              },
              {
                name: '基准',
                type: 'line',
                data: response.data.ReturnParam.TwoLineData
              }
            ];

            let a = response.data.ReturnParam.OneLineData.sort((a, b) => {
              return a - b;
            });

            let b = response.data.ReturnParam.TwoLineData.sort((a, b) => {
              return a - b;
            });
            let maxA = a[a.length - 1];
            let maxB = b[b.length - 1];
            this.max = maxA < maxB ? Math.ceil(maxB / 0.02) * 0.02 : Math.ceil(maxA / 0.02) * 0.02;
            console.log(this.max, "%%%%%%%%%%%%%%%%");
            setTimeout(() => {
              this.$refs.c1.createChart();
            }, 10);
            this.e1 = true;

          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取持仓数据图表
      GetStrategyPosList() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.e2 = false;
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetStrategyPosList',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId,
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }
            ]
          },
        }).then(response => {
          this.showLoadding = false;
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取持仓数据图表");
            let keyArray = [];
            let valueArr = [];
            for (let key of response.data.ReturnParam) {
              keyArray.push(key.name);
              console.log(key, "key");
              key.value = (key.value * 100).toFixed(2);
            }
            this.PositionData.seriesdata = response.data.ReturnParam;
            this.PositionData.legenddata = keyArray;
            this.$refs.c2.createChart();
            this.e2 = true;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取债项评级数据图表
      GetBondRatingData() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.e3 = false;
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetBondRatingData',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }
            ]
          },
        }).then(response => {
          this.showLoadding = false;
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取债项评级数据图表");
            // 债项评级
            let keyArray = [];
            let valueArr = [];
            for (let key of response.data.ReturnParam[0]) {
              keyArray.push(key.name);
              console.log(key, "key");
              key.value = (key.value * 100).toFixed(2);
            }
            this.DebtData.seriesdata = response.data.ReturnParam[0];
            this.DebtData.legenddata = keyArray;

            // 主体评级
            let keyArray1 = [];
            let valueArr1 = [];
            for (let key of response.data.ReturnParam[1]) {
              keyArray1.push(key.name);
              key.value = (key.value * 100).toFixed(2);
            }
            this.DebtData1.seriesdata = response.data.ReturnParam[1];
            this.DebtData1.legenddata = keyArray;


            setTimeout(() => {
              this.$refs.c6.createChart();
              this.$refs.c7.createChart();
            }, 10)
            this.e3 = true;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取到期时间分布数据图表
      GetDateDistribution() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.e4 = false;
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetStrategyDueDateDistribution',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }
            ]
          },
        }).then(response => {
          this.showLoadding = false;
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取到期时间分布数据图表");
            // 到期时间分布（到期日）
            let keyArray = [];
            let valueArr = [];
            for (let key of response.data.ReturnParam[0]) {
              keyArray.push(key.name);
              console.log(key, "key");
              key.value = (key.value * 100).toFixed(2);
            }
            this.ExpiryData.seriesdata = response.data.ReturnParam[0];
            this.ExpiryData.legenddata = keyArray;


            // 到期时间分布（行权日）
            let keyArray1 = [];
            let valueArr1 = [];
            for (let key of response.data.ReturnParam[1]) {
              keyArray1.push(key.name);
              key.value = (key.value * 100).toFixed(2);
            }
            this.ExpiryData1.seriesdata = response.data.ReturnParam[1];
            this.ExpiryData1.legenddata = keyArray1;
            setTimeout(() => {
              this.$refs.c3.createChart();
              this.$refs.c33.createChart();
            }, 10)

          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取主体行业分布
      GetBondIssuerBodyIndustryData() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.e5 = false;
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetBondIssuerBodyIndustryData',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }
            ]
          },
        }).then(response => {
          this.showLoadding = false;
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取主体行业分布");
            let keyArray = [];
            let valueArr = [];
            for (let key of response.data.ReturnParam) {
              keyArray.push(key.name);
              console.log(key, "key");
              key.value = (key.value * 100).toFixed(2);
            }
            this.MainIndustryData.seriesdata = response.data.ReturnParam;
            this.MainIndustryData.legenddata = keyArray;
            this.$refs.c4.createChart();
            this.e5 = true;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //现金流到期分布
      GetBondCashFlowDueData() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.e6 = false;
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetBondCashFlowDueData',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }
            ]
          },
        }).then(response => {
          this.showLoadding = false;
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {

            // 现金流到期分布（到期日）
            console.log(response.data, "现金流到期分布");
            let keyArray = [];
            let valueArr = [];
            for (let key of response.data.ReturnParam[0]) {
              keyArray.push(key.name);
              console.log(key, "key");
              key.value = (key.value).toFixed(2);
            }
            this.CashData.seriesdata = response.data.ReturnParam[0];
            this.CashData.xAxisdata = keyArray;

            let keyArray1 = [];
            let valueArr1 = [];
            for (let key of response.data.ReturnParam[1]) {
              keyArray1.push(key.name);
              key.value = (key.value).toFixed(2);
            }
            this.CashData1.seriesdata = response.data.ReturnParam[1];
            this.CashData1.xAxisdata = keyArray;
            // 现金流到期分布（行权日）
            let keyArray2 = [];
            let valueArr2 = [];
            for (let key of response.data.ReturnParam[2]) {
              keyArray2.push(key.name);
              key.value = (key.value).toFixed(2);
            }
            this.CashData2.seriesdata = response.data.ReturnParam[2];
            this.CashData2.xAxisdata = keyArray;

            let keyArray3 = [];
            let valueArr3 = [];
            for (let key of response.data.ReturnParam[3]) {
              keyArray3.push(key.name);
              key.value = (key.value).toFixed(2);
            }
            this.CashData3.seriesdata = response.data.ReturnParam[3];
            this.CashData3.xAxisdata = keyArray;


            let config0 = [];
            let config1 = [];
            let config2 = [];
            let config3 = [];
            for (let item of response.data.ReturnParam[0]) {
              config0.push(item.value);
            }
            for (let item of response.data.ReturnParam[1]) {
              config1.push(item.value);
            }
            for (let item of response.data.ReturnParam[2]) {
              config2.push(item.value);
            }
            for (let item of response.data.ReturnParam[3]) {
              config3.push(item.value);
            }

            // let a = this.Rate.seriesdata[1].data.sort((a, b) => {
            //   return a - b;
            // });



            setTimeout(() => {
              this.$refs.c5.createChart();
              this.$refs.c55.createChart();
            }, 10)

            this.e6 = true;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取描述信息
      GetDescription() {
        axios({
          method: 'get',
          url: '/v1/StrategyApi/GetStrategyDescription',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          params: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId
              },
              {
                "m_BuildTime": this.strategyObj.AdjustTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": this.StrategyData
              }
            ]
          },
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取描述信息");
            this.Distributes = response.data.ReturnParam;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //获取组合票息数据
      GetCombination() {
        this.e7 = false;
        let newJson = this.StrategyData;
        for (let i = 0; i < newJson.length; i++) {
          delete newJson[i].DueTime;
          delete newJson[i].Cash;
          delete newJson[i].CashDate;
          delete newJson[i].BodyIndustry;
          delete newJson[i].BenchmarkROR;
          delete newJson[i].BuildTime;
          delete newJson[i].StrategyId;
          delete newJson[i].OfferDay;
        }
        axios({
          method: 'post',
          url: '/v1/StrategyApi/GetCombinationStatic',
          headers: {
            'Authorization': "bearer " + getCookie("Token"),
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_StrategyId": this.StrategyId
              },
              {
                "m_BuildTime": this.defaultTime
              },
              {
                "m_StrategyUnderlyingSecuritiesDbEntityArray": newJson
              },
              {
                "m_InvestmentAmount": this.ComMoney,
              },
              {
                "m_CapitalCost": this.ComAmount,
              }
            ]
          },
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data, "获取组合票息数据");
            this.GetCombinationStatic = response.data.ReturnParam;
            this.e7 = true;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
      },
      //编辑策略
      CreateStrategy() {
        let newJson = this.StrategyData;
        for (let i = 0; i < newJson.length; i++) {
          delete newJson[i].BenchmarkROR;
        }
        for (let value of newJson) {
          value.OfferDay = this.defaultTime;
          value.BuildTime = this.m_StrategyDbEntity.AdjustTime;
          value.StrategyId = this.StrategyId;
        }
        this.m_StrategyDbEntity.OfferDay = this.defaultTime;
        this.m_StrategyDbEntity.InvestmentAmount = this.ComMoney;
        this.m_StrategyDbEntity.CapitalCost = this.ComAmount;
        console.log(newJson, "编辑要是用的债券数据");
        if (newJson.length == 0) {
          this.$message({
            message: " 请添加债券，谢谢！",
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: '/v1/StrategyApi/SetStrategy',
            headers: {
              'Authorization': "bearer " + getCookie("Token"),
            },
            data: {
              "AccountId": getCookie("UserId"),
              "Token": getCookie("Token"),
              "SubParam": [{
                  "m_StrategyDbEntity": this.m_StrategyDbEntity,
                },
                {
                  "m_StrategyUnderlyingSecuritiesDbEntityArray": newJson
                },
                {
                  "m_StrategyDescriptionDbEntity": {
                    "BuildTime": this.m_StrategyDbEntity.AdjustTime,
                    "StrategyId": this.StrategyId,
                    "PosDistributeDesp": this.Distributes.PosDistributeDesp,
                    "DueTimeDesp": this.Distributes.DueTimeDesp,
                    "IndustryDistributeDesp": this.Distributes.IndustryDistributeDesp,
                    "CashFlowDistributeDesp": this.Distributes.CashFlowDistributeDesp,
                    "DebtRatDistributeDesp": this.Distributes.DebtRatDistributeDesp,
                    "BenchmarkDistributeDesp": this.Distributes.BenchmarkDistributeDesp,
                    "VentureAnalysis": this.Distributes.VentureAnalysis,
                    "IncomeAnalysis": this.Distributes.IncomeAnalysis,
                    "PositionAnalysis": this.Distributes.PositionAnalysis,
                    "ChangeReason": this.Distributes.ChangeReason,
                  }
                }
              ]
            },
          }).then(response => {
            if (response.data.status == 401) {
              this.$message({
                message: "Token已经过期"
              });
              this.$router.push("/Login");
            }
            if (response.data.ResultCode == 200) {
              console.log(response.data, "编辑策略");
              this.$message({
                message: "编辑策略成功",
                type: 'success'
              });
              setTimeout(() => {
                this.$router.push("/StrategyList");
              }, 2000)
            } else {
              this.$message({
                message: response.data.ResultMessage,
                type: 'warning'
              });
            }
          })
        }
      },
      //保存策略
      SaveStrage() {
        if (this.$refs.whateverName.saveValiate() == undefined) {
          console.log(this.$refs.whateverName.saveObj());
          this.m_StrategyDbEntity = this.$refs.whateverName.saveObj();
          if (this.showState == false) {
            this.$message({
              message: "请生成图表，谢谢！",
              type: 'warning'
            });
          } else {
            console.log(this.Distributes.ChangeReason, "this.Distributes.ChangeReason");
            if (this.Distribute.ChangeReason == null || this.trim(this.Distribute.ChangeReason).length == 0) {
              this.$message({
                message: "请填写策略修改理由",
                type: 'warning'
              });
            } else {
              this.Distributes.ChangeReason = this.Distribute.ChangeReason;
              this.CreateStrategy();
            }
          }
        }
      },
      // 失去焦点获取相关的债券的值
      BondMsg(data) {
        if (data.Code) {
          this.getBondInfo();
        }
        console.log(data, "失去焦点获取相关的债券的值");
      },
      //关于弹窗的控制
      ShowMsgFromChild(data) {
        console.log(data, "from Child");
        console.log(this.states, "this.states");
        if (data.FaceValue > 0) {
          console.log(data, "from Child");
          //添加债券
          if (this.states == "create" && this.statesOK) {
            if (this.StrategyData.length == 0) {
              this.StrategyData.push(data);
              this.ControlWindouw = false;
              this.form = {};
              this.statesOK = false;
            } else {
              let CodeArray = [];
              for (let value of this.StrategyData) {
                CodeArray.push(value.Code);
              }
              if (CodeArray.indexOf(data.Code) >= 0) {
                this.$message({
                  message: "该债券已经存在，请勿重复添加",
                  type: 'warning'
                });
              } else {
                this.StrategyData.push(data);
                this.WindouData = data;
                this.ControlWindouw = false;
                this.form = {};
                this.statesOK = false;
              }
            }
          }
          //编辑债券
          if (this.states == "edit") {
            for (let value of this.StrategyData) {
              if (value.Code == data.Code) {
                value.FaceValue = data.FaceValue;
                this.ControlWindouw = false;
                this.form = {};
              }
              //              else{
              //                this.$message({
              //                  message: "债券面值要大于0",
              //                  type: 'warning'
              //                });
              //              }
            }

          }


        } else {
          this.$message({
            message: "债券面值要大于0",
            type: 'warning'
          });
        }

        this.AddRatio();

      },
      Back(data) {
        this.ControlWindouw = false;
        console.log(this.states, "点击了组建中的返回按钮");
        this.form = {};
      },
      AddBond() {
        this.ControlWindouw = true;
        this.states = "create";
      },
      EditClick(row) {
        console.log(row);
        this.oldform = row;
        this.form = row;
        this.states = "edit";
        this.ControlWindouw = true;
      },
      dateToMs(date) {
        let result = new Date(date).getTime();
        return result;
      },
      handleClick(tab, event) {
        // let date = new Date(this.$refs.whateverName.queryStart().StyBeginDate);
        let date = new Date(this.strategyObj.OfferDay);
        console.log(this.$refs.whateverName.queryStart(), "**********************");
        let time = this.dateToMs(date);
        if (time) {
          let month = date.getMonth() + 1;
          let strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          this.defaultTime = date.getFullYear() + '-' + month + '-' + strDate;
        } else {
          // this.defaultTime = format(new Date());
        }


        let date1 = new Date(this.$refs.whateverName.queryStart().StyEndDate);
        let time1 = this.dateToMs(date);
        if (time1) {
          let month = date1.getMonth() + 1;
          let strDate = date1.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          this.m_EndDate = date1.getFullYear() + '-' + month + '-' + strDate;
        } else {
          this.m_EndDate = format(new Date());
        }

        this.m_BenchmarkROR = this.$refs.whateverName.queryStart().BenchmarkROR;
        console.log(tab, this.m_EndDate);
        console.log(tab, this.defaultTime);
        console.log(tab, this.m_BenchmarkROR);


        this.showState = true;
        //        this.GetDescription();
        this.GetStrategyPosList();
        this.GetBondRatingData();
        this.GetDateDistribution();
        this.GetStrategyYTMListData();
        this.GetBondIssuerBodyIndustryData();
        this.GetBondCashFlowDueData();
        this.GetCombination();
      },
      delOK() {
        this.StrategyData = this.StrategyData.filter(obj => obj.Code != this.rowCode);
        this.centerDialogVisible = false;
        this.AddRatio();
      },
      DelClick(row) {
        this.centerDialogVisible = true;
        this.rowCode = row.Code;
        console.log(row.Code);
      },
      showEchart() {
        if (this.$refs.whateverName.saveValiate() == undefined) {
          console.log(this.ComMoney, "this.ComMoney");
          console.log(Number.isInteger(this.ComMoney), "this.ComMoney");
          console.log(this.isIntNum(this.ComMoney), "this.isIntNum");
          if (!this.isIntNum(this.ComMoney)) {
            this.$message({
              message: "投资金额必须为整数",
              type: 'warning'
            });
          } else if (this.ComMoney < 1000) {
            this.$message({
              message: "投资金额最小值必须为1000万的整数",
              type: 'warning'
            });
          } else {
            if (this.StrategyData.length > 0) {
              let Num = 0;
              // 获取面值总和
              for (let value of this.StrategyData) {
                Num += parseFloat(value.FaceValue);
              }
              if (Num < this.ComMoney) {
                this.$message({
                  message: "债券总面值不能小于投资金额",
                  type: 'warning'
                });
              } else {
                if (this.isNumber(this.ComAmount)) {
                  this.AddRatio();
                  this.GetStrategyPosList();
                  this.GetBondRatingData();
                  this.GetDateDistribution();
                  this.GetStrategyYTMListData();
                  this.GetBondIssuerBodyIndustryData();
                  this.GetBondCashFlowDueData();
                  this.GetCombination();
                } else {
                  this.$message({
                    message: "资金成本为浮点型的正数",
                    type: 'warning'
                  });
                }

              }
            } else {
              this.$message({
                message: "请添加债券",
                type: 'warning'
              });
            }

          }
        }
      },
      FloatTwo(value) {
        if (value) {
          return value;
        }
      },
      timeChange() {
        var date = new Date(this.defaultTime);
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }

        this.defaultTime = date.getFullYear() + '-' + month + '-' + strDate;
        console.log(this.defaultTime, "time/cahnge");
      }
    },
    created: function () {
      this.StrategyId = window.location.href.split("=")[1];
      console.log(this.StrategyId, "this.StrategyId");
    },
    mounted: function () {
      this.GetStrategyById();
    }
  }

</script>

<style scoped>
  .advance_title {
    padding: 10px 0 10px 30px;
    box-sizing: border-box;
  }

  .advance_title span {
    font-weight: 700;
    font-size: 14px;
    font-family: "Microsoft YaHei";
  }

  .combination {
    margin-top: 20px;
    width: 650px;
    height: 100px;
    border: 1px solid #dce6ef;
    overflow: hidden;
  }

  .combination .left {
    border-right: 1px solid #dce6ef;
    background: #eef1f6;
    width: 15%;
    height: 100%;
    float: left;
    line-height: 100px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
  }

  .combination .right {
    width: 551px;
    height: 100%;
    float: left;
  }

  .content_head {
    width: 100%;
    height: 40px;
    background: #eef1f6;
    border-bottom: 1px solid #dce6ef;
  }

  .content_head span {
    display: inline-block;
    width: 100px;
    height: 100%;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }

  .main_content {
    width: 100%;
    height: 60px;
  }

  .none {
    top: 100000px !important;
    left: 100000000px !important;
  }

  .none1 {
    top: 100000px !important;
    left: 100000000px !important;
  }

  .main_content li {
    list-style: none;
    float: left;
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
  }

  .main_content li:nth-child(1) {
    border-bottom: 1px solid #dce6ef;
    border-right: 1px solid #dce6ef;
  }

  .main_content li:nth-child(2) {
    border-bottom: 1px solid #dce6ef;
  }

  .main_content li:nth-child(3) {
    border-left: 1px solid #dce6ef;
  }

  .main_content li:nth-child(4) {
    border-left: 1px solid #dce6ef;
  }

  .main_content li:nth-child(5) {
    border-left: 1px solid #dce6ef;
    width: 140px;
  }

  .sty_sm_title {
    display: block;
    padding: 0px 8px;
    box-sizing: border-box;
    font-size: 14px;
    color: #666;
    border-left: 4px solid #1a8cd3;
    height: 16px;
    line-height: 16px;
    margin: 20px 10px 10px;
    font-weight: 700;
  }

  .only_echart {
    width: 98%;
    height: 320px;
    margin: 20px 10px;
    border: 1px solid #dce6ef;
  }

  .echart_left {
    width: 60%;
    height: 100%;
    border-right: 1px solid #dce6ef;
    display: inline-block;
  }

  .text_msg {
    width: 39%;
    height: 100%;
    display: inline-block;
  }

  .text_msg textarea {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-size: 14px;
    line-height: 20px;
    font-family: "Microsoft YaHei";
    resize: none;
  }

  .textArea {
    padding: 0 10px;
    box-sizing: border-box;
  }

  .textArea textarea {
    font-size: 14px !important;
    font-family: "Microsoft YaHei";
  }

  .saveBtn {
    margin: 20px 0px;
    text-align: right;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .saveBtn .el-button {
    width: 100px;
  }

  .saveBtn .el-button:nth-child(1) {
    background: #28b6f5;
    border-color: #28b6f5;
  }

  .saveBtn .el-button:nth-child(2) {
    background: #bebebe;
    border-color: #bebebe;
  }

  .textArea textarea {
    background-color: #f7f7f7 !important;
  }

</style>
