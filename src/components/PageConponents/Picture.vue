<!-- 图片库 -->
<template>
  <el-dialog title="选择图片" :show-close="false" :visible.sync="ControlWindouw" :close-on-click-modal="false">
    <div style="text-align: right;margin-top: -25px;margin-bottom: 10px">
      <el-upload class="upload-demo" :on-success="UploadSuccess" :on-error="UploadError" :action="action"
        :show-file-list='false' :headers="myHeaders" :before-upload="BeforeUpload" accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <div class="picture">
      <div class="one_picture" v-for="(data,index) in PicData" @click="ChangeState(data.url,data)">
        <div class="pic_url">
          <img :src="data.url">
        </div>
        <span class="title">{{data.title}}</span>
        <i class="el-icon-circle-check icon" :id="'pic'+data.id"></i>
      </div>
      <div></div>
      <!-- 分页 -->
      <div style="float: right;">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)"
          :current-page="Number(Pageindex)" :total="Number(total)">
        </el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="saveBtn1">
        <el-row>
          <el-button type="warning" @click="SavePic()" :disabled="ClickDis">确定</el-button>
          <el-button type="danger" @click="BackPic()">取消</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {
    getCookie
  } from '../../config/mUtils'
  export default {
    //ControlWindouw控制显隐，
    props: ['ControlWindouw'],
    data() {
      return {
        myHeaders: {
          Authorization: "bearer " + getCookie("Token")
        },
        action: "",
        filepath: "",
        ClickDis: true,
        Pageindex: 1,
        Pagesize: 12,
        total: "",
        PicArray: [],
        HOST: "",
        PicData: []
      };
    },
    computed: {},
    methods: {
      getAllPic() {
        axios({
          method: "get",
          url: "/v1/OperateFile/GetPicturesByPaged",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_PageSize: this.Pagesize,
            m_PageIndex: this.Pageindex,
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            console.log(response.data.ReturnParam.PagedColle, "获取图片列表");
            this.total=response.data.ReturnParam.Count;
            this.PicData=response.data.ReturnParam.PagedColle;
            this.PicData.forEach((value,index)=>{
              value.url=this.filepath+value.url;
            });
            console.log(this.PicData,"******格式化后的图片**********");

          } else {
            this.$message({
              message: "获取图片资源失败",
              type: "warning"
            });
          }
        });
      },
      // 上传成功
      UploadSuccess(response, file, fileList) {
        console.log(response, "****************");
        if (response.ResultCode == 200) {
          this.$message({
            message: '上传图片成功',
            type: 'success'
          });
          this.getAllPic();
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          });
        }
      },

      // 上传失败
      UploadError(err, file, fileList) {
        this.$message.error(err);
      },
      // 点击图片勾选状态
      ChangeState(url, data) {
        let PicArray = this.PicArray;
        console.log(data, "*********************");
        if (document.getElementById('pic' + data.id).className.indexOf("show") > -1) {
          document.getElementById('pic' + data.id).classList.remove("show");
          PicArray.forEach((item, index) => {
            if (item.id == data.id) {
              PicArray.splice(index, 1);
            }
          })
        } else {
          document.getElementById('pic' + data.id).classList.add("show");
          PicArray.push(data);
        }
        this.PicArray = PicArray;
        if (this.PicArray.length > 0) {
          this.ClickDis = false;
        } else {
          this.ClickDis = true;
        }
        console.log(this.PicArray, "***********最终使用的图片数据**********");
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.Pageindex = val;
        this.getAllPic();
      },
      //点击确定按钮，获取选择的图片,传值给父组件
      SavePic() {
        if (this.PicArray.length == 0) {
          this.$message({
            message: '请选择图片',
            type: 'warning'
          });
        } else {
          let data = this.PicArray;
          this.$emit("BindSave", data);
          // 点击确定后清除选择状态
          this.PicArray.forEach((item) => {
            document.getElementById('pic' + item.id).classList.remove("show");
          })
          this.PicArray = [];
          this.ClickDis = true;
        }
      },
      //点击返回按钮
      BackPic() {
        this.$emit("Back", "1");
        if (this.PicArray.length > 0) {
          this.PicArray.forEach((item) => {
            document.getElementById('pic' + item.id).classList.remove("show");
          })
          this.PicArray = [];
          this.ClickDis = true;
        }
      },

      BeforeUpload(file) {
        console.log(file.size, "*******************");
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
    },
    created() {
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
      console.log(HOST, "*******HOST******");
    },
    mounted() {
      this.getAllPic();
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
  .one_picture {
    width: 20%;
    height: 150px;
    border: 1px solid #eeebeb;
    display: inline-block;
    margin-left: 4%;
    margin-bottom: 25px;
    position: relative;
  }

  .one_picture .pic_url {
    width: 100%;
    height: 120px;
  }

  .one_picture .pic_url img {
    width: 100%;
    height: 100%;
    border: 0;
  }

  .one_picture .title {
    height: 30px;
    display: block;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    position: absolute;
    top: 5px;
    left: 5px;
    display: none;
    color: red;
    font-size: 20px;
  }

  .show {
    display: block;
  }

</style>
