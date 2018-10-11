<!-- 
  债券详情弹窗
  Created by Sunhongchao
 -->
<template>
  <el-dialog
    :title=title
    :show-close="false"
    :visible.sync="ControlWindouw"
    :close-on-click-modal="false"
  >
    <el-form :model="form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="代码" :label-width="formLabelWidth">
            <div v-if="states=='create'">
              <el-input v-model="form.Code" auto-complete="off"  @blur="getBondMsg"></el-input>
            </div>
            <div v-if="states=='edit'">
              <el-input v-model="form.Code" auto-complete="off" disabled  @blur="getBondMsg"></el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="简称" :label-width="formLabelWidth">
            <el-input v-model="form.ShortName" auto-complete="off" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面值(万元)" :label-width="formLabelWidth">
            <el-input v-model="form.FaceValue" auto-complete="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="票息%" :label-width="formLabelWidth">
            <el-input v-model="form.Coupon" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收益率%" :label-width="formLabelWidth">
            <el-input v-model="form.ROR" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="剩余期限" :label-width="formLabelWidth">
            <el-input v-model="form.ShowTTM" auto-complete="off" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="债项评级" :label-width="formLabelWidth">
            <el-input v-model="form.DebtRating" auto-complete="off" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主体评级" :label-width="formLabelWidth">
            <el-input v-model="form.BodyRating" auto-complete="off" id="one" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="saveBtn1">
        <el-row>
          <el-button type="warning" @click="SaveBond()">保存</el-button>
          <el-button type="danger" @click="BackBond()">返回</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    //title为弹窗的标题，ControlWindouw控制显隐，form为表单的数据
    props: ['title','ControlWindouw',"form","states"],
    data() {
      return {
        formLabelWidth: '80px',
      };
    },
    computed:{
      // changeCoupon(){
      //   if(this.form.Coupon){
      //     return this.form.Coupon;
      //   }
      // }
    },
    methods: {
//      失去焦点获取对应的债券信息
      getBondMsg(){
        let data=this.form;
        this.$emit("BondMsg",data);
      },
      //保存债券，绑定保存按钮，传值给父组件
      SaveBond(){
        let data=this.form;
        this.$emit("Bond",data);
      },
//      点击返回按钮
      BackBond(){
        this.$emit("Back","1");
      }
    },
    created(){

    },
    mounted () {

    }
  };
</script>
<style>
  /*弹窗样式*******************/
  .el-dialog__header{
    background: #6c93d2;
    padding: 15px 20px !important;
  }
  .el-dialog__header .el-dialog__title{
    color: white!important;
    font-family: "Microsoft YaHei";
  }
  .el-dialog__footer{
    background-color: #f4f4f4;
  }
  .el-dialog__footer{
    padding: 8px 20px !important;
  }
  .saveBtn1 .el-button{
    width: 100px;
  }
  .saveBtn1 .el-button:nth-child(1){
    background: #28b6f5;
    border-color: #28b6f5;
  }
  .saveBtn1 .el-button:nth-child(2){
    background: #bebebe;
    border-color: #bebebe;
  }
  /***********************/
</style>
