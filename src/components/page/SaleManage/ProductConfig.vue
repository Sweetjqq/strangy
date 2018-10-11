<template>
  <div>
    <!-- 搜索头 -->
    <div class="select_header">
      <!-- 产品名称 -->
      <div class="select_only">
        <span class="label">产品名称</span>
        <el-select style="width:320px;" v-model="select.ProductName" :collapse-tags=true filterable remote multiple
          placeholder="请输入关键词">
          <el-option v-for="item in ProductList" :key="item.uniqueCode" :label="item.uniqueCode+'_'+item.shortName"
            :value="item.uniqueCode">
          </el-option>
        </el-select>

        <!-- <el-select v-model="select.ProductName" multiple placeholder="请选择">
          <el-option v-for="item in ProductList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
      </div>
      <!-- 销售 -->
      <div class="select_only">
        <span class="label">销售</span>
        <el-select v-model="select.ProductSale" multiple placeholder="请选择">
          <el-option v-for="item in ProductSaleList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <!-- 客服 -->
      <div class="select_only">
        <span class="label">客服</span>
        <el-select v-model="select.CustomerService" multiple placeholder="请选择">
          <el-option v-for="item in CustomerServiceList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <!-- 私行会员 -->
      <div class="select_only">
        <span class="label">私行会员</span>
        <el-autocomplete class="inline-input" v-model="select.PrivateMember" :fetch-suggestions="querySearch"
          placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
      </div>

      <!-- 产品状态 -->
      <div class="select_only">
        <span class="label">产品状态</span>
        <el-select v-model="select.ProductState" multiple placeholder="请选择">
          <el-option v-for="item in ProductStatesList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" style="background: #4778c7;border-color: #4778c7;width: 95px;margin-left: 20px" @click="search">查询</el-button>
      <el-button type="primary" style="background-color:#ef7955;width: 95px;border-color: #ef7955" @click="CreateProduct">新建</el-button>

    </div>
    <!-- 售后产品列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="productTitle" label="产品名称" width="220">
      </el-table-column>
      <el-table-column prop="salesName" label="销售姓名">
      </el-table-column>
      <el-table-column prop="serviceName" label="客服姓名">
      </el-table-column>
      <el-table-column label="私行用户">
        <template slot-scope="scope">
          <p v-for="item in scope.row.bpcmList">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="tacticsTitle" label="策略名称">
      </el-table-column>
      <el-table-column label="产品状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.productStatus==0">未知</span>
          <span v-if="scope.row.productStatus==1">建仓中</span>
          <span v-if="scope.row.productStatus==2">开户中</span>
          <span v-if="scope.row.productStatus==3">备案中</span>
          <span v-if="scope.row.productStatus==4">募集中</span>
          <span v-if="scope.row.productStatus==5">清盘中</span>
          <span v-if="scope.row.productStatus==6">已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="持有到期" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.heldToMaturity==0">否</span>
          <span v-if="scope.row.heldToMaturity==1">是</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="small" style="background-color: #4b98dc">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="float: right;margin: 15px 15px 0 0">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)"
        :current-page="Number(Pageindex)" :total="Number(total)">
      </el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="产品售后配置" top="6vh" :visible.sync="dialogFormVisible" :model="ProductConfigWindow">
      <div class="only_product">
        <label class="title">产品信息</label>
        <el-form>
          <el-form-item label="产品ID" :label-width="formLabelWidth">
            <el-autocomplete style="width: 212px;" class="inline-input" v-model="ProductConfigWindow.ID"
              :fetch-suggestions="SearchPro" placeholder="请输入内容" @select="SelectPro"></el-autocomplete>
          </el-form-item>
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input placeholder="请输入产品名称" v-model="ProductConfigWindow.ProductName" :disabled="true" style="width: 212px;">
            </el-input>
          </el-form-item>
          <el-form-item label="产品状态" :label-width="formLabelWidth">
            <el-select v-model="ProductConfigWindow.ProductState" placeholder="请选择">
              <el-option v-for="item in ProductStatesList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否持有到期" :label-width="formLabelWidth">
            <el-radio v-model="ProductConfigWindow.radio" label="1">是</el-radio>
            <el-radio v-model="ProductConfigWindow.radio" label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </div>

      <div class="only_product">
        <label class="title">销售与客服</label>
        <el-form>
          <el-form-item label="销售" :label-width="formLabelWidth">
            <el-select v-model="ProductConfigWindow.ProductSale" placeholder="请选择">
              <el-option v-for="item in ProductSaleList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客服" :label-width="formLabelWidth">
            <el-select v-model="ProductConfigWindow.CustomerService" placeholder="请选择">
              <el-option v-for="item in CustomerServiceList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="only_product">
        <label class="title">私行用户</label>
        <el-form>
          <el-form-item label="私行用户" :label-width="formLabelWidth">
            <div v-for="(item,index) in ProductConfigWindow.PrivateMember" style="margin: 5px 0" :id="'user'+item">
              <el-autocomplete style="width: 212px;" class="inline-input" v-model="ProductConfigWindow.PrivateMember[index]"
                :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
              <el-button type="primary" size="mini" @click="addUser(index)">添加</el-button>
              <el-button type="danger" size="mini" v-if="index!=0" @click="delUser(item)">删除</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="only_product">
        <label class="title">策略信息</label>
        <el-form>
          <el-form-item label="策略类型" :label-width="formLabelWidth">
            <el-select v-model="ProductConfigWindow.StrangyState" placeholder="请选择">
              <el-option v-for="item in StrangyType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="策略名称" :label-width="formLabelWidth">
            <el-select v-model="ProductConfigWindow.StrangyName" placeholder="请选择" @change="SelectStrangy">
              <el-option v-for="item in StrangyList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="WindowSave">保存</el-button>
        <el-button @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {
    setStore,
    getStore,
    getCookie,
    isPoneAvailable,
    setTitle
  } from '../../../config/mUtils'
  export default {
    components: {

    },
    data() {
      return {
        clickState: "",
        ProID: "",
        formLabelWidth: '100px',
        dialogFormVisible: false,
        Pageindex: 1,
        Pagesize: 10,
        total: "",
        select: {
          ProductName: "", //产品名称
          ProductSale: "", //销售
          CustomerService: "", //客服
          PrivateMember: "", //私行会员
          ProductState: "", //产品状态
        },
        ProductConfigWindow: {

        },
        StrangyType: [{
          value: '信用债',
          label: '信用债'
        }],
        ProductList: [],
        ProductStatesList: [], //产品状态列表
        ProductSaleList: [], //销售
        CustomerServiceList: [], //客服
        PrivateMemberList: [], //私行会员
        StrangyList: [], //策略名称
        tableData: [],
        Productid: "",
        tacticsTitle: "",
      }
    },
    methods: {
      // 点击新建产品
      CreateProduct() {
        this.clickState = "create";
        this.dialogFormVisible = true;
        this.ProductConfigWindow = {
          ID: "", //产品ID
          ProductName: '', //产品名称
          ProductState: "", //产品状态
          radio: '1', //是否持有到期
          ProductSale: "", //销售
          CustomerService: "", //客服
          PrivateMember: [""], //私行会员
          StrangyState: "", //策略类型
          StrangyName: '', //策略名称
        }
      },
      // 点击修改获取产品详情
      handleClick(row) {
        this.clickState = "edit";
        console.log(row);
        this.GetProDetail(row.id);
        this.Productid = row.id;
        this.dialogFormVisible = true;
      },
      // 通过产品id获取产品详情
      GetProDetail(id) {
        axios({
          method: "get",
          url: "/v1/afterService/getAfterService",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            id: id
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            let row = response.data.data;
            this.ProductConfigWindow = {
              ID: row.productCode, //产品ID
              ProductName: row.productTitle, //产品名称
              ProductState: row.productStatus, //产品状态
              radio: row.heldToMaturity.toString(), //是否持有到期
              ProductSale: row.salesId, //销售
              CustomerService: row.serviceId, //客服
              PrivateMember: row.bpcmList, //私行会员
              StrangyState: row.tacticsTypeName, //策略类型
              StrangyName: row.tacticsTitle, //策略名称
            }
            console.log(row, "通过产品id获取产品详情");
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 获取所有策略的接口
      GetAllStrategy() {
        axios({
          method: "get",
          url: "/v1/StrategyApi/GetStrategyAllList",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_Type: "", //策略类型
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data.ReturnParam, " 获取所有策略的接口");
            let data = response.data.ReturnParam;
            data.forEach((item, index) => {
              data[index]["value"] = data[index]["StrategyId"];
              data[index]["label"] = data[index]["ShortName"];
            });
            this.StrangyList = data;
          } else {
            this.$message({
              message: response.data.ResultMessage,
              type: "warning"
            });
          }
        });
      },

      //  获取全部青狮产品
      GetProAllData() {
        axios({
          method: "get",
          url: "/v1/FundProducts/GetAllFundProducts_CS",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {}
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            console.log(response.data, "获取全部青狮产品");
            let data = response.data.data;
            data.forEach((item, index) => {
              data[index]["value"] = data[index]["uniqueCode"];
              data[index]["label"] = data[index]["shortName"];
              // delete(item.uniqueCode);
              // delete(item.shortName);
            });
            this.restaurants1 = data;
            this.ProductList = data;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },

      // 获取产品列表数据
      GetProList() {
        axios({
          method: "get",
          url: "/v1/afterService/getAfterServiceList",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            productCode: this.select.ProductName.length > 0 ? this.select.ProductName.join(",") : "",
            salesId: this.select.ProductSale.length > 0 ? this.select.ProductSale.join(",") : "",
            serviceId: this.select.CustomerService.length > 0 ? this.select.CustomerService.join(",") : "",
            bpcm: this.select.PrivateMember,
            productStatus: this.select.ProductState.length > 0 ? this.select.ProductState.join(",") : "",
            page: this.Pageindex,
            pageSize: this.Pagesize,
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            console.log(response.data, "获取产品列表数据");
            let data = response.data.data;
            this.total = data.total;
            this.tableData = data.list;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 获取售后产品状态
      GetProStates() {
        axios({
          method: "get",
          url: "v1/afterService/getProductStatus",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {}
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            let data = response.data.data;
            data.forEach((item, index) => {
              data[index]["value"] = data[index]["id"];
              data[index]["label"] = data[index]["text"];
              delete(item.id);
              delete(item.text);
            });
            this.ProductStatesList = data;
            console.log(data, "获取售后产品状态");
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 模糊查询销售、客服、私行用户
      GetAllSearch(type) {
        // 类型type：1：销售、客服 2：私行用户
        axios({
          method: "get",
          url: "/v1/afterService/getCustomerList",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            text: '',
            type: type,
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            let data = response.data.data;
            let data1 = response.data.data;
            console.log(type, "type");
            if (type == 1) {
              data.forEach((item, index) => {
                data[index]["value"] = data[index]["id"];
                data[index]["label"] = data[index]["text"];
                delete(item.id);
                delete(item.text);
              });
              this.ProductSaleList = this.CustomerServiceList = data;
            }
            if (type == 2) {
              data1.forEach((item, index) => {
                data1[index]["value"] = data1[index]["mobile"];
              });
              this.restaurants = this.PrivateMemberList = data1;
            }
            console.log(data, "模糊查询销售、客服、私行用户");
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 查询
      search() {
        console.log(this.select, "查询条件");
        this.GetProList();
      },
      // 弹窗数据保存
      WindowSave() {
        console.log(this.ProductConfigWindow, "弹窗数据");
        this.saveAfterService();
      },

      // 创建或者编辑产品的入参控制
      saveAfterService() {
        let data;
        let PhoneArray = [];
        if (this.ProductConfigWindow.PrivateMember.length > 0) {
          this.ProductConfigWindow.PrivateMember.forEach((value) => {
            if(value.length>0){
              PhoneArray.push(isPoneAvailable(value));
            }
          })
        }
        if (this.clickState == "create") {
          console.log(this.clickState, "create");
          data = {
            productCode: this.ProductConfigWindow.ID, //产品代码
            productTitle: this.ProductConfigWindow.ProductName, //产品名称
            productStatus: this.ProductConfigWindow.ProductState, //产品状态 0：未知、1：分募集中、2：备案中、3：开户中、4：建仓中、5：清盘中、6：已结束
            heldToMaturity: this.ProductConfigWindow.radio, //持有到期 0否、1是
            salesId: this.ProductConfigWindow.ProductSale, //销售ID
            serviceId: this.ProductConfigWindow.CustomerService, //客服ID
            pbcm: this.ProductConfigWindow.PrivateMember.join(","), //私行用户手机号
            tacticsType: "1", //策略类型
            tacticsTypeName: "信用债", //策略类型名称

            tacticsId: this.ProductConfigWindow.StrangyName, //策略ID
            tacticsTitle: this.tacticsTitle, //策略名称

            operator: getCookie("UserId"),
          }
        }
        if (this.clickState == "edit") {
          console.log(this.clickState, "edit");
          data = {
            id: this.Productid,
            productCode: this.ProductConfigWindow.ID,
            productTitle: this.ProductConfigWindow.ProductName,
            productStatus: this.ProductConfigWindow.ProductState,
            heldToMaturity: this.ProductConfigWindow.radio,
            salesId: this.ProductConfigWindow.ProductSale,
            serviceId: this.ProductConfigWindow.CustomerService,
            pbcm: this.ProductConfigWindow.PrivateMember.join(","),

            tacticsType: "1",
            tacticsTypeName: "信用债",

            tacticsId: this.ProductConfigWindow.StrangyName, //策略ID
            tacticsTitle: this.tacticsTitle, //策略名称
            operator: getCookie("UserId"),
          }
        }
        console.log(data, "****添加或者编辑产品的入参data****");
        console.log(PhoneArray.indexOf(false), "私行会员手机号码合法");
        console.log(this.ProductConfigWindow.PrivateMember, "私行会员手机号码");
        if (data.id && data.id.length == 0) {
          this.$message({
            message: '请先获取需要编辑的产品',
            type: 'warning'
          });
        } else if (data.productTitle.length == 0) {
          this.$message({
            message: '请选择产品名称',
            type: 'warning'
          });
        } else if (data.productStatus.length == 0) {
          this.$message({
            message: '请选择产品的状态',
            type: 'warning'
          });
        } else if (data.salesId.length == 0) {
          this.$message({
            message: '请选择销售',
            type: 'warning'
          });
        } else if (data.serviceId.length == 0) {
          this.$message({
            message: '请选择客服',
            type: 'warning'
          });
        } else if (data.pbcm.length == 0) {
          this.$message({
            message: '请选择私行用户',
            type: 'warning'
          });
        } else if (PhoneArray.indexOf(false)> -1) {
          this.$message({
            message: '存在不合法的手机号',
            type: 'warning'
          });
        } else {
          this.SaveService(data);
        }
      },

      // 创建或者编辑产品的API
      SaveService(data) {
        axios({
          method: "post",
          url: "/v1/afterService/saveAfterService",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: data,
          transformRequest: [
            function (data) {
              let ret = "";
              for (let it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret;
            }
          ]
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            let data = response.data.data;
            console.log(data, "创建或者编辑产品");
            this.dialogFormVisible = false;
            this.$message({
              message: "恭喜你，操作成功",
              type: "success"
            });
            this.GetProList();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 添加私行用户
      addUser(index) {
        this.ProductConfigWindow.PrivateMember.push("");
      },
      // 删除私行用户
      delUser(val) {
        let index = this.ProductConfigWindow.PrivateMember.indexOf(val);
        this.ProductConfigWindow.PrivateMember.splice(index, 1);
      },
      SearchPro(queryString, cb) {
        var restaurants1 = this.restaurants1;
        var results = queryString ? restaurants1.filter(this.createFilter(queryString)) : restaurants1;
        // 调用 callback 返回建议列表的数据
        cb(results);
        console.log(results, "**************");
        if (results.length == 1) {
          console.log("cunzai");
          this.ProductConfigWindow.ProductName = results[0].shortName;
        }else{
          this.ProductConfigWindow.ProductName="";
        }

      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item, "##################");
        console.log(this.ProductConfigWindow.PrivateMember, "私行会员")
      },
      SelectPro(item) {
        console.log(item, "选择的青狮产品");
        this.ProductConfigWindow.ProductName = item.shortName;
      },
      SelectStrangy(item) {
        let id = item;
        let data = this.StrangyList;
        data.forEach((value, index) => {
          if (value.StrategyId == id) {
            console.log(value, "选择的策略");
            this.tacticsTitle = value.ShortName;
          }
        })
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.Pageindex = val;
        this.GetProList();
      },
      loadAll() {

      },
    },
    created() {
      setTitle('产品配置')
      this.GetProList();
      this.GetProStates();
      this.GetAllSearch(1);
      this.GetAllSearch(2);
      this.GetProAllData();
      this.GetAllStrategy();
    },
    mounted() {

    }
  };

</script>
<style>
  /*弹窗样式*******************/

  .el-dialog__header {
    background: #6c93d2;
    padding: 15px 20px !important;
  }

  .el-dialog__header .el-dialog__title {
    color: white !important;
    font-family: "Microsoft YaHei";
  }

  .el-dialog__footer {
    background-color: #f4f4f4;
  }

  .el-dialog__footer {
    padding: 8px 20px !important;
  }

  .saveBtn1 .el-button {
    width: 100px;
  }

  .saveBtn1 .el-button:nth-child(1) {
    background: #28b6f5;
    border-color: #28b6f5;
  }

  .saveBtn1 .el-button:nth-child(2) {
    background: #bebebe;
    border-color: #bebebe;
  }

  /***********************/

</style>
<style scoped>
  .select_only {
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 20px;
  }

  .select_only .label {
    color: #48576a;
    font-size: 14px;
    font-weight: 900;
    display: inline-block;
    padding: 5px 10px;
    box-sizing: border-box;
  }

  .select_header {
    padding: 10px 12px 1px;
    box-sizing: border-box;
    border: 1px solid #eeebeb;
    margin-bottom: 20px;
  }

  .only_product {
    border: 1px solid #eeebeb;
    padding: 5px;
    box-sizing: border-box;
    margin: 8px 0;
  }

  .only_product .title {
    display: inline-block;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 15px;
  }

</style>
