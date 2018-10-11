<template>
  <div id="Salesmanagement">
    <div class="header">
<el-row style="min-width:920px;">
  <el-col :span="8"><div class="grid-content bg-purple">
      <label style="padding-left:20px; font-size: 14px;
    font-family: '微软雅黑';
    color: #48576a;
    font-weight: 700;">手机号</label>
     <el-input ref="Name" v-model="phone" style="width:217px;" placeholder="请输入内容" class="ml12"></el-input>
    </div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple-light">
       <label style="padding-left:20px; font-size: 14px;
    font-family: '微软雅黑';
    color: #48576a;
    font-weight: 700;">销售经理</label>
     <el-input ref="Name" v-model="salesManager" style="width:217px;" placeholder="请输入内容" class="ml12"></el-input>
    </div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple">
      <el-button type="primary" @click="search()">查询</el-button>
  <el-button type="success" @click="createsales()">新建</el-button>
    </div></el-col>
</el-row>
</div>

<div class="body">
 <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="mobile"
      label="手机号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="会员名字"
      width="180">
    </el-table-column>
    <el-table-column
      prop="salesManager"
      label="销售经理">
    </el-table-column>
     <el-table-column
      prop="regDate"
      label="注册时间">
    </el-table-column>
     <el-table-column
      prop="status"
      label="状态">
            <template slot-scope="scope">
      <div v-if="scope.row.status==1">
        <el-tag  type="success">可用</el-tag>
      </div>
      <div v-else>
        <el-tag type="danger"> 冻结</el-tag>
      </div>
      </template>
    </el-table-column>
     <el-table-column
      label="操作"
      width="200"
      >
      <template slot-scope="scope">
      <div v-if="scope.row.status==1">
          <el-button @click="edithandleClick(scope.row)" size="small" type="primary">修改</el-button>
          <el-button size="small" @click="removehandleClick(scope.row)" type="danger">冻结</el-button>
      </div>
      <div v-else>
          <el-button @click="resthandleClick(scope.row)" size="small" type="success">激活</el-button>
      </div>


     
      </template>
    </el-table-column>
  </el-table>

      <div style="float: right;margin: 15px 15px 0 0">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :page-size="Number(Pagesize)"
        :current-page="Number(Pageindex)"
        :total="Number(total)">
      </el-pagination>
    </div>
</div>
<div class="footer">

</div>
<div>
 <div id="dialogBox">
    <el-dialog title="新建会员" :visible.sync="dialogFormVisible1">
  <el-form :model="create">
    <el-form-item label="手机号" :label-width="formLabelWidth">
      <el-input style="width:240px;" id="createphone"  :maxlength="11" v-model="create.phone" auto-complete="off"></el-input>
    </el-form-item>
     <el-form-item label="初始密码" :label-width="formLabelWidth">
      <el-input   style="width:240px;"  disabled v-model="randomCode" auto-complete="off"></el-input>
    </el-form-item>
        <el-form-item label="销售经理" :label-width="formLabelWidth">
      <el-select style="width:240px;" id="createsalesManagerId"  v-model="create.salesManagerId" placeholder="请选择">
    <el-option
      v-for="item in options1"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="姓名" :label-width="formLabelWidth">
      <el-input   style="width:240px;" id="createname" v-model="create.name" auto-complete="off"></el-input>
    </el-form-item>
       <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input   style="width:240px;"  id="createemail"  v-model="create.email" auto-complete="off"></el-input>
    </el-form-item>
      <el-form-item label="机构" :label-width="formLabelWidth">
      <el-select style="width:240px;"    id="createorgId" v-model="create.orgId" placeholder="请选择">
    <el-option
      v-for="item in options2"
      :key="item.id"
      :label="item.orgName"
      :value="item.id">
    </el-option>
  </el-select>
    </el-form-item>
      <el-form-item label="分支机构" :label-width="formLabelWidth">
      <el-input   style="width:240px;"  :maxlength="30"   id="createbranch" v-model="create.branch" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="createsumbit()">保存</el-button>
    <el-button @click="dialogFormVisible1 = false">取 消</el-button>
  </div>
</el-dialog>
</div>

 <div id="editdialogBox">
    <el-dialog title="修改会员" :visible.sync="dialogFormVisible2">
  <el-form :model="create">
    <el-form-item label="手机号" :label-width="formLabelWidth">
      <el-input style="width:240px;"  id="editphone" :maxlength="11" v-model="edit.phone" auto-complete="off"></el-input>
    </el-form-item>
        <el-form-item label="销售经理" :label-width="formLabelWidth">
      <el-select  style="width:240px;" v-model="edit.salesManagerId" >
    <el-option
      v-for="item in options1"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="姓名" :label-width="formLabelWidth">
      <el-input   style="width:240px;"  id="editname"  v-model="edit.name" auto-complete="off"></el-input>
    </el-form-item>
       <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input   style="width:240px;"  id="editemail"   v-model="edit.email" auto-complete="off"></el-input>
    </el-form-item>
      <el-form-item label="机构" :label-width="formLabelWidth">
      <el-select style="width:240px;"  v-model="edit.orgId"     id="editeorgId"  :maxlength="30"  >
    <el-option
      v-for="item in options2"
      :key="item.id"
      :label="item.orgName"
      :value="item.id">
    </el-option>
  </el-select>
    </el-form-item>
      <el-form-item label="分支机构" :label-width="formLabelWidth">
      <el-input   style="width:240px;" id="editbranch"    v-model="edit.branch" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="editsumbit()">保存</el-button>
    <el-button @click="dialogFormVisible2 = false">取 消</el-button>
  </div>
</el-dialog>
</div>

</div>

 <div id="removedialogBox">
  <el-dialog
  title="操作"
  :visible.sync="dialogFormVisible3"
  width="30%"
>
  <span style="padding-left:60px;">是否冻结该用户？</span>  
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="removeSumbit()">确 定</el-button>
    <el-button @click="dialogFormVisible3 = false">取 消</el-button>
  </span>
</el-dialog>
</div>


 <div id="restdialogBox">
  <el-dialog
  title="操作"
  :visible.sync="dialogFormVisible4"
  width="30%"
>
  <span style="padding-left:60px;">是否激活该用户？</span>  
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="restSumbit()">确 定</el-button>
    <el-button @click="dialogFormVisible4 = false">取 消</el-button>
  </span>
</el-dialog>
</div>


  </div>
</template>

<script>
import { authLoaction } from "../../config/authKey.js";
import {
  setStore,
  getStore,
  enterAuthValited,
  getCookie
} from "../../config/mUtils";
export default {
  components: {},
  data() {
    return {
      salesManager: "",
      phone: "",
      Pagesize: 10,
      Pageindex: "",
      total: "",
      randomCode: "",
      value: "",
      Name: "",
      restaurants: [],
      state4: "",
      id: "",
      edit: {
        name: "",
        phone: "",
        email: "",
        salesManagerId: "",
        orgId: ""
      },
      currsalesManagerId: "",
      currorgId: "",
      create: {
        name: "",
        phone: "",
        email: "",
        password: "",
        salesManagerId: "",
        branch: "",
        orgId: ""
      },
      removedialogBoxMessage: "",
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      formLabelWidth: "120px",
      options1: [],
      options2: [],
      tableData: []
    };
  },
  methods: {
    authMsg() {
      this.$message({
        message: "没有权限，请联系管理员"
      });
      this.$router.push("/StrategyList");
      // this.$router.push("/Error");
    },
    getAllSalesManager() {
      axios({
        method: "get",
        url: "/v1/pcustomer/getAllSalesManagerList",
        // headers: {
        //   Authorization: "bearer " + getCookie("Token")
        // },
        params: {}
      }).then(res => {
        if (res.data.status == 200) {
          this.options1 = res.data.data;
        } else {
          this.showMsg("获取销售经理信息失败");
        }
      });
    },
    changeSalesManagerIds() {},
    getorg() {
      axios({
        method: "get",
        url: "/v1/customer/orgList",
        // headers: {
        //   Authorization: "bearer " + getCookie("Token")
        // },
        params: {}
      }).then(res => {
        console.log(res.data.data, "1111111111111");
        if (res.data.status == 200) {
          console.log(1);
          this.options2 = res.data.data;
          console.log(this.options2);
        } else {
          this.showMsg("获取机构信息失败");
        }
      });
    },
    search() {
      this.Pageindex = 1;
      if (this.phone || this.salesManager) {
        if (this.validatequery()) {
          this.query({
            mobile: $.trim(this.phone),
            name: "",
            type: 2,
            pageNum: 1,
            pageSize: 10,
            salesManager: $.trim(this.salesManager)
          });
        }
      } else {
        this.query({
          mobile: "",
          name: "",
          type: 2,
          pageNum: 1,
          pageSize: 10,
          salesManager: ""
        });
      }
    },
    validatequery() {
      let phonenNum = /^[0-9]*$/;
      if (this.phone || this.phone == "") {
        if (phonenNum.test($.trim(this.phone)) || this.phone == "") {
          console.log(true);
          return true;
        } else {
          this.showMsg("请输入正确的手机号");
          return false;
        }
      }

      // let chinese = /^[\u4E00-\u9FA5]{1,10}$/;
      // if (this.salesManager) {
      //   if (chinese.test($.trim(this.salesManager))) {
      //     console.log(true);
      //     return true;
      //   } else {
      //     this.showMsg("请输入中文");
      //     return false;
      //   }
      // }
    },
    validatecreate() {
      // 手机
      // 姓名
      // 邮箱
      // salesManagerId: this.create.salesManagerId,
      // orgId: this.create.orgId,
      // branchOrg: this.create.branch
      let errorMsg = "";
      const rule = {
        createphone: {
          require: true,
          rule: true,
          exp: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          name: "手机号"
        },
        createname: {
          rule: true,
          exp: /^[\u4E00-\u9FA5]{1,10}$/,
          name: "姓名"
        },
        createemail: {
          rule: true,
          exp: /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
          name: "邮箱"
        }
      };

      $.each(rule, key => {
        const elem = rule[key];
        if (elem.require) {
          console.log($(`#${key} input`).val());
          if (!$(`#${key} input`).val()) {
            errorMsg = `请输入${elem.name}`;
            return false;
          }
        }

        if (elem.exp) {
          console.log($(`#${key} input`).val());
          if ($(`#${key} input`).val() !== "") {
            if (!elem.exp.test($(`#${key} input`).val())) {
              errorMsg = `您的${elem.name}格式不正确，请重新输入`;
              return false;
            }
          }
        }
      });
      return errorMsg;
    },
    validateedit() {
      // 手机
      // 姓名
      // 邮箱
      let errorMsg = "";
      const rule = {
        editphone: {
          require: true,
          rule: true,
          exp: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          name: "手机号"
        },
        editname: {
          rule: true,
          exp: /^[\u4E00-\u9FA5]{1,10}$/,
          name: "姓名"
        },
        editemail: {
          rule: true,
          exp: /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
          name: "邮箱"
        }
      };

      $.each(rule, key => {
        const elem = rule[key];
        if (elem.require) {
          if (!$(`#${key} input`).val()) {
            errorMsg = `请输入${elem.name}`;
            return false;
          }
        }

        if (elem.exp) {
          if (!elem.exp.test($(`#${key} input`).val())) {
            if ($(`#${key} input`).val() !== "") {
              console.log($(`#${key} input`).val(), "name");
              errorMsg = `您的${elem.name}格式不正确，请重新输入`;
              return false;
            }
          }
        }
      });
      return errorMsg;
    },
    query(obj) {
      axios({
        method: "get",
        url: "/v1/pcustomer/getCustomerInfoList",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          mobile: obj.mobile,
          name: obj.name || "",
          type: obj.type,
          salesManager: obj.salesManager,
          pageNum: obj.pageNum,
          pageSize: obj.pageSize
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.showMsg("查询会员列表信息失败");
        }
      });
      // }
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.Pageindex = val;
      this.query({
        mobile: this.phone,
        name: "",
        type: 2,
        pageNum: val,
        pageSize: 10,
        salesManager: this.salesManager
      });
    },
    // 点击编辑按钮
    edithandleClick(scope) {
      console.log("111");
      this.dialogFormVisible2 = true;
      console.log(scope);
      this.id = scope.id;
      this.edit.name = scope.name;
      this.edit.phone = scope.mobile;
      this.edit.email = scope.email;
      this.edit.branch = scope.branchOrg;
      // salesManagerId
      // orgId
      console.log(this.options1, this.options2, "sssssssssss");
      let salesManagerId = scope.salesManagerId;
      let orgId = scope.orgId;
      console.log(salesManagerId, "salesManagerId");
      this.options1.map(item => {
        if (salesManagerId == item.value) {
          this.edit.salesManagerId = item.label;
        }
      });
      console.log("=======================");

      this.options2.map(item => {
        console.log(item);
        if (orgId == item.id) {
          console.log(item);
          this.edit.orgId = item.orgName;
        }
      });
    },
    // 点击冻结按钮
    removehandleClick(scope) {
      this.id = scope.id;
      this.dialogFormVisible3 = true;
    },
    resthandleClick(scope) {
      this.id = scope.id;
      this.dialogFormVisible4 = true;
    },
    // 激活
    restSumbit() {
      axios({
        method: "post",
        url: "/v1/pcustomer/updateStatus",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          status: 1,
          id: this.id
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.showMsg("激活用户成功");
          this.query({
            mobile: "",
            name: "",
            type: 2,
            pageNum: this.Pageindex,
            pageSize: 10,
            salesManager: ""
          });
        } else {
          this.showMsg("激活用户失败");
        }
        this.dialogFormVisible4 = false;
      });
    },
    showMsg(obj) {
      this.$message({
        message: obj
      });
    },
    // 新建
    createsumbit() {
      let obj = {
        id: "",
        name: this.create.name,
        email: this.create.email,
        mobile: this.create.phone,
        password: this.randomCode,
        type: 2,
        salesManagerId: this.create.salesManagerId,
        orgId: this.create.orgId,
        branchOrg: this.create.branch
      };
      console.log(obj, "obj");
      // 1 校验格式
      // 2 发送请求
      let msg = this.validatecreate();
      console.log(msg);
      if (msg == "") {
        this.dialogFormVisible1 = false;
        axios({
          method: "post",
          url: "v1/pcustomer/saveCustomerInfo",
          // headers: {
          //   Authorization: "bearer " + getCookie("Token")
          // },
          params: {
            id: "",
            name: this.create.name,
            email: this.create.email,
            mobile: this.create.phone,
            password: this.randomCode,
            type: 2,
            salesManagerId: this.create.salesManagerId,
            orgId: this.create.orgId,
            branchOrg: this.create.branch
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.showMsg("新建用户成功");
            this.query({
              mobile: "",
              name: "",
              type: 2,
              pageNum: this.Pageindex,
              pageSize: 10,
              salesManager: ""
            });
          } else {
            this.showMsg(res.data.msg);
          }
        });
      } else {
        this.showMsg(msg);
      }
    },
    // 提交修改
    editsumbit() {
      console.log(this.options2, "options1options1options1options1");
      this.options1.map(item => {
        if (this.edit.salesManagerId == item.label) {
          this.edit.salesManagerId = item.value;
        }
      });
      console.log("=======================");

      this.options2.map(item => {
        if (this.edit.orgId == item.orgName) {
          this.edit.orgId = item.id;
        }
      });
      let obj = {
        id: this.id,
        name: this.edit.name,
        email: this.edit.email,
        mobile: this.edit.phone,
        password: "",
        type: 2,
        salesManagerId: this.edit.salesManagerId,
        orgId: this.edit.orgId,
        branchOrg: this.edit.branch
      };
      let msg = this.validateedit();
      console.log(obj);
      if (msg == "") {
        this.dialogFormVisible2 = false;
        axios({
          method: "post",
          url: "v1/pcustomer/saveCustomerInfo",
          // headers: {
          //   Authorization: "bearer " + getCookie("Token")
          // },
          params: {
            id: this.id,
            name: this.edit.name,
            email: this.edit.email,
            mobile: this.edit.phone,
            password: "",
            type: 2,
            salesManagerId: this.edit.salesManagerId,
            orgId: this.edit.orgId,
            branchOrg: this.edit.branch
          }
        }).then(res => {
          console.log(res);
          if (res.data.status == 200) {
            this.showMsg("修改用户成功");
            this.query({
              mobile: "",
              name: "",
              type: 2,
              pageNum: this.Pageindex,
              pageSize: 10,
              salesManager: ""
            });
          } else {
            this.showMsg(res.data.msg);
          }
        });
      } else {
        this.showMsg(msg);
      }
    },
    // 冻结操作
    removeSumbit() {
      axios({
        method: "post",
        url: "/v1/pcustomer/updateStatus",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          status: 0,
          id: this.id
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.showMsg("冻结用户成功");
          this.query({
            mobile: "",
            name: "",
            type: 2,
            pageNum: this.Pageindex,
            pageSize: 10,
            salesManager: ""
          });
        } else {
          this.showMsg("冻结用户失败");
        }
        this.dialogFormVisible3 = false;
      });
    },

    // 生成6位密码
    randomNum(n) {
      var str =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var n = 6,
        s = "";
      for (var i = 0; i < n; i++) {
        var rand = Math.floor(Math.random() * str.length);
        s += str.charAt(rand);
      }
      return s;
    },
    createsales() {
      this.create.name = "";
      this.create.phone = "";
      this.create.email = "";
      this.create.salesManagerId = "";
      this.create.orgId = "";
      this.create.branch = "";
      this.dialogFormVisible1 = true;
      this.randomCode = this.randomNum(6);
    }
  },

  mounted() {
    enterAuthValited("412", authLoaction, this.authMsg);
    this.query({
      mobile: "",
      name: "",
      type: 2,
      pageNum: 1,
      pageSize: 10,
      salesManager: ""
    });
    this.getorg();
    this.getAllSalesManager();
    setTimeout(() => {
      document.title = "会员管理";
    }, 1000);
  }
};
</script>

<style scoped>
.header {
  margin-top: 20px;
  min-width: 838px;
}
.body {
  margin: 40px 15px 0 15px;
}
</style>
