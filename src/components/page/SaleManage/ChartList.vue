<template>
  <div style="padding-left:15px;padding-right:15px;min-width:966px;">
      <div style="text-align:left;padding-left:20px;display:inline-block; margin-top:20px;min-width:1046px;">
        <label style="font-family: 'Microsoft YaHei';font-weight: 700;font-size:14px;color: #48576a;">产品</label>
        <!-- <el-select v-model="productCode" change filterable placeholder="请选择" @keyup.13="searchproductCode()">
          <el-option v-for="item in productoptions" :key="item.uniqueCode" :label="item.fullName" :value="item.uniqueCode">
          </el-option>
        </el-select> -->
          <!-- :remote-method="searchproductCode" -->
        <div style="position: relative;display: inline;">
        <el-select style="width:320px;" 
          v-model="productCode"
          :collapse-tags = true
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
        >
             <el-option
            v-for="item in productoptions"
            :key="item.uniqueCode"
            :label="item.uniqueCode+'_'+item.shortName"
            :value="item.uniqueCode">
          </el-option>
        </el-select>
          <img src="../../../../static/images/close-circle.png" id="resetProduct" @click="resetProductBtn()" alt="">
       </div>

      <div style="text-align:left;padding-left:20px;display:inline-block;    position: relative;">
        <label style="font-family: 'Microsoft YaHei';font-weight: 700;font-size:14px;color: #48576a;">文章作者</label>
        <!-- <el-select v-model="author" filterable placeholder="请选择">
          <el-option v-for="item in authoroptions" :key="item.label" :label="item.label" :value="item.label">
          </el-option>
        </el-select> -->
           <el-select 
          v-model="author"
          :collapse-tags = true
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
        >
             <el-option
            v-for="item in authoroptions"
            :key="item.label"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
         <img src="../../../../static/images/close-circle.png" id="resetAuth" @click="resetAuthorBtn()" alt="">
      </div>


      <div style="text-align:left;padding-left:20px;display:inline-block;">
        <label style="font-family: 'Microsoft YaHei';font-weight: 700;font-size:14px;color: #48576a;">发布状态</label>
        <el-select v-model="status" placeholder="请选择">
          <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div style="text-align:left;padding-left:20px;display:inline-block;">
        <el-button type="primary" @click="search()">查询</el-button>
      </div>
    </div>


    <div id="voiceTable" style=" margin-top:20px;">
      <div style="text-align:left;padding-bottom:20px;display:inline-block;">
        <el-button type="primary" @click="createChartList()">新建图文</el-button>
      </div>
      <template>
        <el-table border :data="tableData"  id="textChartTable">
          <el-table-column prop="status" label="文章状态" width="90">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status == 1">未发布</el-tag>
              <el-tag type="success" v-else-if="scope.row.status == 2">已发布</el-tag>
              <el-tag type="warning" v-else-if="scope.row.status == 3">已撤回</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="releaseTime" label="发布时间" min-width='180'>
            <template slot-scope="scope">
              <div v-if="scope.row.status == 1 && !scope.row.releaseTime">
                  未发布
              </div>
              <div v-else>
                {{ scope.row.releaseTime}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="releaser" label="发布人" >
             <template slot-scope="scope">
              <div v-if="scope.row.status == 1 && !scope.row.releaser">
                  未发布
              </div>
              <div v-else>
                {{ scope.row.releaser}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="最新修改时间" >
          </el-table-column>
          <el-table-column prop="updateUser" label="最新修改人" >
          </el-table-column>
          <el-table-column prop="title" label="文章名称"  :title="title" >
          </el-table-column>
          <el-table-column prop="author" label="文章作者">
          </el-table-column>
          <el-table-column prop="imageTextQingshi" label="对应产品" width="160">
            <template slot-scope="scope" v-if="scope.row.imageTextQingshi">
              <div  v-for="(item,i) in scope.row.imageTextQingshi" :key="i">
                <el-tag type="success" style="margin-top:10px;">{{item.productTitle}}</el-tag>
              </div>
              <div style="margin-bottom:10px;"></div>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" >

            <template slot-scope="scope" v-if="scope.row.tags">
              <div  v-for="(item,i) in scope.row.tags.split('；')" :key="i">
                <el-tag style="background:#409eff;margin-top:5px;margin-bottom:5px;margin-right:10px;">{{item}}</el-tag>
              </div>

            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.status==1">
                <el-button size="small" @click="handleRelease(scope.row)">发布</el-button>
                <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </div>
              <div v-else-if="scope.row.status==2">
                <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
                <el-button size="small" @click="handleWithdraw(scope.row)">撤回</el-button>
              </div>
              <div v-else-if="scope.row.status==3">
                <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div id="pageBox" style="text-align:right; margin-top:20px;  margin-bottom:20px;">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)" :current-page="Number(Pageindex)"
        :total="Number(total)">
      </el-pagination>
    </div>


    <div id="removedialogBox">
      <el-dialog title="删除" :visible.sync="dialogFormVisible3" width="30%">
        <span style="padding-left:60px;">是否确认删除?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="removeSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>


    <div id="withdrawdialogBox">
      <el-dialog title="撤回" :visible.sync="dialogFormVisible4" width="30%">
        <span style="padding-left:60px;">是否确认撤回?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="withdrawSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible4 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <div id="releasedialogBox" >
      <el-dialog title="发布" :visible.sync="dialogFormVisible5" width="30%">
        <div style="padding-left:100px;">
          <div style="">图文标题:&nbsp;&nbsp;&nbsp;&nbsp;
            <span ref="Name">{{title}}</span>
          </div>
          <div style="padding-top:15px;">图文作者:&nbsp;&nbsp;&nbsp;&nbsp;
            <span ref="Name">{{editauthor}}</span>
          </div>
          <div style="padding-top:15px;">持仓截取日期:&nbsp;&nbsp;&nbsp;&nbsp;
            <span ref="Name">{{deadline}}</span>
          </div>
          <div style="padding-top:15px;">是否包含封面图片:&nbsp;&nbsp;&nbsp;&nbsp;
            <span ref="Name" v-if="coverImg">是</span>
            <span ref="Name" v-else>否</span>
          </div>
          <div style="padding-top:15px;">文章标签:&nbsp;&nbsp;&nbsp;&nbsp;
            <span ref="Name">{{tags}}</span>
          </div>
          <div style="padding-top:15px;">选择对应产品:&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- <el-select v-model="associatedValue" multiple collapse-tags style="margin-left: 20px;" placeholder="请选择" @change="selectProduct()">
              <el-option v-for="item in productoptions" :key="item.uniqueCode" :label="item.shortName" :value="item.uniqueCode">
              </el-option>
            </el-select> -->

          <el-select style="width:320px;" v-model="itemProductName" :collapse-tags=true filterable remote multiple
          placeholder="请输入关键词">
          <el-option v-for="item in productoptions" :key="item.uniqueCode" :label="item.shortName"
            :value="item.uniqueCode">
          </el-option>
        </el-select>
          </div>
          <div style="padding-top:15px;padding-borrom:40px;">已选{{itemProductName.length}}个产品:&nbsp;&nbsp;&nbsp;&nbsp;
            <span v-for="(item,i) in handlevalue()" :key="i">
              <el-tag type="success" style="margin-right:10px;margin-top:10px;">{{item.shortName}}</el-tag>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="releaseSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible5 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { authLoaction } from "../../../config/authKey.js";
import {
  setStore,
  getStore,
  getCookie,
  enterAuthValited,
  setTitle
} from "../../../config/mUtils";
import loadding from "../../common/loadding.vue";
export default {
  components: {
    loadding
  },
  data() {
    return {
      ProductListItem: [],
      itemProductName:'',
      productCode: "全部",
      author: "全部",
      status: "",
      removeId: "",
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogFormVisible5: false,
      valueproductoptions: [],
      productoptions: [],
      authoroptions: [],
      statusoptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "未发布"
        },
        {
          value: "2",
          label: "已发布"
        },
        {
          value: "3",
          label: "已撤回"
        }
      ],
      Pagesize: 10,
      Pageindex: 1,
      total: Number,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      fileList3: [],
      title: "",
      editauthor: "",
      deadline: "",
      coverImg: "",
      tags: "",
      withdrawId: "",
      row: {},
      page: 1,
      pushValue: {}
    };
  },
  created() {
    setTitle('图文列表')
    enterAuthValited("512", authLoaction, this.authMsg);
    this.query({
      productCode: "",
      author: "",
      status: "",
      page: 1,
      limit: 10
    });
    this.queryProductList();
    this.queryAuthors();
  },
  methods: {
    resetAuthorBtn(){
      this.author= "";
      this.queryAuthors();
    },
    resetProductBtn(){
      this.productCode= "";
      this.queryProductList();
    },
    selectProduct() {},
    createChartList() {
      this.$router.push("/CreateProChart");
    },
    search() {
      this.query({
        productCode: this.productCode,
        author: this.author,
        status: this.status,
        page: 1,
        limit: 10
      });
    },
    queryAuthors() {
      axios({
        method: "get",
        url: "/v1/imageText/getAuthorList",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          author: ""
        }
      }).then(res => {
        console.log(res,'fasdfads')
        if(res.data.status == 200){
          let Arr = [];
          let obj = {};
          res.data.data.map((item, i) => {
            Arr.push({
              label: item,
              value: i
            });
          });
          this.authoroptions = Arr;
          console.log(this.authoroptions, "this.authoroptions");
        }else{

        }
      });
    },
    handlevalue() {
      let arr = [];
      if(this.itemProductName.length){
      this.productoptions.map(item => {
          this.itemProductName.map(items => {
            if (items == item.uniqueCode) {
              arr.push(item);
            }
          });
        });
      }
      return arr;
    },
    authMsg() {
      this.$message({
        message: "没有权限，请联系管理员"
      });
      this.$router.push("/StrategyList");
    },
    query(obj) {
      if (this.productCode == "全部") {
        obj.productCode = "";
      }
      if (this.author == "全部") {
        obj.author = "";
      }
      axios({
        method: "get",
        url: "/v1/imageText/getImageTextList",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          productCode: obj.productCode,
          author: obj.author,
          status: obj.status,
          page: obj.page,
          limit: obj.limit
        }
      }).then(res => {
        if(res.data.status == 200){

        console.log(res.data.data, "res");
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
        this.Pageindex = obj.page;
        // this.queryAuthors();
        // this.queryProductList();
        }else{
            this.$message({
              message: "查询失败"
            });
        }
      });
    },
    //查询所有
    queryProductList() {
      axios({
        method: "get",
        url: "/v1/FundProducts/GetAllFundProducts_CS",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {}
      }).then(res => {
        if (res.data.status == 200) {
          this.productoptions = res.data.data;
        }else{
            this.$message({
              message: "查询失败"
            });
        }
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.query({
        productCode: this.productCode,
        author: this.author,
        status: this.status,
        page: page,
        limit: 10
      });
    },
    handleEdit(row) {
      this.$router.push("/EditProChart?id=" + row.id + "&status=" + row.status);
    },
    handleRelease(row) {
      this.dialogFormVisible5 = true;
      this.itemProductName = [];
      console.log(row, "row");
      this.row = row;
      this.title = row.title;
      this.editauthor = row.author;
      this.deadline = row.deadline;
      this.coverImg = row.coverImg;
      this.tags = row.tags;
    },
    releaseSumbit() {
      this.productoptions.map(item => {
        console.log(this.itemProductName, "产品mingc");
        this.itemProductName.map(items => {
          console.log(items, "code");
          if (items == item.uniqueCode) {
            this.pushValue[items] = item.shortName;
          }
        });
      });
      console.log(this.pushValue,'....');
      if (this.itemProductName.length == 0) {
        this.$message({
          message: "请选择关联产品"
        });
      } else {
        axios({
          method: "post",
          url: "/v1/imageText/publishImageText",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            imageTextId: this.row.id,
            productJson: JSON.stringify(this.pushValue),
            updateUser: getCookie("UserId")
          }
        }).then(res => {
          console.log(res.data, "res");
          if (res.data.status == 200) {
            this.$message({
              message: "发布成功"
            });
          } else {
            this.$message({
              message: `${res.data.msg}`
            });
          }
          this.query({
            productCode: "",
            author: "",
            status: "",
            page: this.page,
            limit: 10
          });
          this.dialogFormVisible5 = false;
        });
      }
    },
    handleWithdraw(row) {
      this.dialogFormVisible4 = true;
      this.withdrawId = row.id;
    },
    withdrawSumbit() {
      axios({
        method: "post",
        url: "/v1/imageText/withdrawImageText",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          id: this.withdrawId,
          updateUser: getCookie("UserId")
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.$message({
            message: "撤回成功"
          });
          this.dialogFormVisible4 = false;
          this.query({
            productCode: "",
            author: "",
            status: "",
            page: this.page,
            limit: 10
          });
        } else {
          this.$message({
            message: "撤回失败"
          });
        }
      });
    },
    handleDelete(scope) {
      console.log(scope);
      this.dialogFormVisible3 = true;
      this.removeId = scope.id;
    },
    removeSumbit() {
      axios({
        method: "post",
        url: "/v1/imageText/deleteImageText",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          id: this.removeId,
          updateUser: getCookie("UserId")
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.$message({
            message: "删除成功"
          });
          this.dialogFormVisible3 = false;
        } else {
          this.$message({
            message: "删除失败"
          });
        }
      });
      this.query({
        productCode: "",
        author: "",
        status: "",
        page: this.page,
        limit: 10
      });
    }
  }
};
</script>

<style scoped>
#releasedialogBox {
  min-width: 560px;
}

#resetProduct {
    position: absolute;
    right: 10px;
    width: 18px;
    top: 0px;
}

#resetAuth {
      position: absolute;
    right: 6px;
    width: 18px;
    top: 10px;
}
</style>
