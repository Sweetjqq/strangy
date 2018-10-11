<template>
  <div style="padding-left:15px;padding-right:15px;">
    <div id="createBox">
      <span class="tips">大小不超过5M</span>
      <el-upload class="upload-demo" :action="action" :headers="myHeaders" :before-upload="beforeAvatarUpload"
                 :on-success="uploadSuccess" :on-error="uploadError" accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP">
        <div>
          <el-button size="small" type="primary">上传</el-button>
        </div>
      </el-upload>
    </div>
    <div id="voiceTable">
      <template>
        <el-table border :data="tableData">
          <el-table-column label="名称" style="position: relative">
            <template slot-scope="scope">
              <div class="img" :style="{backgroundImage: 'url(' + scope.row.url + ')'}"></div>
              <p>{{scope.row.title}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div id="pageBox">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)" :current-page="Number(Pageindex)" :total="Number(total)">
      </el-pagination>
    </div>
    <!--删除弹窗-->
    <div id="removedialogBox">
      <el-dialog title="删除" :visible.sync="dialogFormVisible3" width="30%">
        <span class="tips">确定删除此图片?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="removeSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    authLoaction
  } from "../../../config/authKey.js";
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
        //设置上传图片请求头部
        myHeaders: {
          Authorization: "bearer " + getCookie("Token")
        },
        //设置上传请求地址
        action:"",
        Pagesize: 10,
        Pageindex: 1,
        total: Number,
        dialogFormVisible3: false,
        tableData: [],
        removeId: "",
        filePath: '',
        backgroundImage:""
      };
    },
    created() {
      setTitle('图片管理')
      this.HOST = HOST;
      if (HOST == "http://10.21.10.192:80") {
        this.action = "http://10.21.10.192/v1/StrategyApi/uploadpicture";
        this.filepath = "http://10.21.10.170:19001/";
      } else if (HOST == "http://192.168.10.91:80") {
        this.action = "http://192.168.10.91/v1/StrategyApi/uploadpicture";
        this.filepath = "http://192.168.10.94:8090/";
      } else if (HOST == "https://api.fw-fintech.com") {
        this.action = HOST + "/v1/StrategyApi/uploadpicture";
        this.filepath = "https://imgs.fw-fintech.com/";
        console.log(this.action, this.filepath, "#########");
      }
      enterAuthValited("512", authLoaction, this.authMsg);
      this.query({
        pageindex: 1,
        pagesize: 10
      });
    },
    methods: {
      authMsg() {
        this.$message({
          message: "没有权限，请联系管理员"
        });
        this.$router.push("/StrategyList");
      },
      query(obj) {
        //请求后台，每次跳转页面或者当前页面下标改变都要走后台重新请求
        axios({
          method: "get",
          url: "/v1/OperateFile/GetPicturesByPaged",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_PageIndex: obj.pageindex,
            m_PageSize: obj.pagesize
          }
        }).then(res => {
          if(res.status == 200){
            this.tableData = res.data.ReturnParam.PagedColle;
            this.tableData.forEach((value,index)=>{
              value.url=this.filepath+value.url;
            });
            this.total = res.data.ReturnParam.Count;
            this.Pageindex = obj.pageindex;
          }
        });
      },
      handleCurrentChange(obj) {
        this.Pageindex = obj;
        this.query({
          pageindex: obj,
          pagesize: 10
        });
      },
      //上传成功
      uploadSuccess (res, file, fileList){
        console.log(this.Pageindex);
        //上传成功之后将返回的数据再重新赋值给表格tableData
        if (res.ResultCode == 200) {
          this.$message({
            message: '上传图片成功',
            type: 'success'
          });
          this.query({
            pageindex: this.Pageindex,
            pagesize: 10
          });
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      },
      uploadError (err, file, fileList){
        this.$message.error(err);
      },
      beforeAvatarUpload(file) {
        if (file.size > 5 * 1024 * 1024) {
          this.$message({
            message: '图片大小不能超过5M',
            type: 'warning'
          });
          return false;
        } else {
          return file;
        }
      },
      //删除
      handleDelete(scope) {
        this.removeId = scope.id;
        this.dialogFormVisible3 = true;
      },
      removeSumbit() {
        axios({
          method: "get",
          url: "/v1/OperateFile/LogicalDeletionPicturesById",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_Id: this.removeId
          }
        }).then (res => {
          if(res.status == 200){
            this.$message({
              message: "删除成功"
            });
            this.dialogFormVisible3 = false;
            this.query({
              pageindex: this.Pageindex,
              pagesize: 10
            });
          }else {
            this.$message({
              message: "删除失败"
            })
          }
        });
      }
    }
  };

</script>

<style scoped>
  #createBox{
    margin-top:20px;height:60px;border:1px solid #dfe6ec;text-align:right;line-height:60px;padding-right:30px;
  }
  #createBox .tips{
    font-size: 14px;font-family: 'Microsoft YaHei';font-weight: 700;padding-right:10px;
  }
  #voiceTable{
    margin-top:20px;
  }
  #voiceTable img{
    width: 160px;
    height: 160px;
    margin-top: 9px;
    margin-bottom: 6px;
    margin-left: 30px;
    overflow: hidden;
  }
  #voiceTable .img{
    width: 150px;
    height: 150px;
    margin-top: 6px;
    margin-bottom: 6px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  #voiceTable p{
    position: absolute;
    left: 200px;
    top: 45%;
  }
  .upload-demo{
    display: inline-block;
  }
  #pageBox{
    text-align:right; margin-top:20px;
  }
  #removedialogBox .tips{
    padding-left:60px;
  }
  .el-table_1_column_3 .cell{
    text-align: center;
  }
</style>
