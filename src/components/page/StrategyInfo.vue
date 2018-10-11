<template>
<div  style="min-width:800px;">
  <div class="formBox"  v-if="type == 'create'">
    <el-row>
    <!--  策略类型-->
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">策略类型</label>
        <el-select v-model="value" style="width:322px;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </div></el-col>

          <!--  标签-->
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <label for="">标签</label>
          <el-select v-model="value" style="width:28%;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

            <el-select v-model="value" style="width:28%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

            <el-select v-model="value" style="width:28%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </div></el-col>
      </el-row>
      <el-row >
          <!--  标签-->
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">策略名称</label>
          <el-input style="width:322px;" placeholder="请输入内容" class="ml12"></el-input>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <!--  策略编号-->
      <label for="">策略编号</label>
          <el-input style="width:322px;" placeholder="请输入内容" class="ml12" disabled></el-input>
          </div></el-col>
      </el-row>


      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
        <div class="block">
            <span class="label">开始时间</span>
          <el-date-picker style="width:322px;" class="ml12"
            v-model="time1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <div class="block">
            <span class="label">结束时间</span>
          <el-date-picker style="width:322px;" class="ml12"
            v-model="time2"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
          </div></el-col>
      </el-row>


      <!-- 上传文件 -->
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
            <span style="float:left" class="label">策略报告</span>
          <el-upload style="display:inline-block;margin-left:16px"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
            <span class="label">策略状态 </span>

            <el-switch class="ml12"
        v-model="switchis"
        >
      </el-switch>
          </div></el-col>
      </el-row>
      <!-- 上传文件 -->


      <!-- 止盈止损 -->
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">止盈(BP)
          </label>
          <el-input class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <label for="">止损(BP)
          </label>
          <el-input class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>
          </div></el-col>
      </el-row>
      <!-- 止盈止损 -->

      <!-- 债券估值方法 -->
      <el-row>
        <el-col :span="12">
          <label for="">债券估值方法</label>
        <el-select v-model="value" style="width:290px;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </el-col>
      </el-row>
      <!-- 债券估值方法 -->



      <!-- 策略描述 -->
      <el-row id="strategyDesc">
        <el-form ref="form" label-width="80px">
        <el-form-item label="活动形式">
          <el-input type="textarea" ></el-input>
        </el-form-item>
        </el-form>
      </el-row>
<!-- 策略描述 -->


<!-- <el-row >
  <el-col :span="12" :offset="2">
 <el-button style="width:100px;" type="primary">保存</el-button>
   <el-button style="width:100px;background-color:#bebebe;border-color:#bebebe;" type="info" >返回</el-button>
  </el-col>
</el-row> -->

<!-- 策略小图 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
      <span style="float:left" class="label">策略小图</span>
    <el-upload style="display:inline-block;margin-left:16px"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </div></el-col>
</el-row>
<!-- 策略小图 -->


<!-- 策略大图 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
      <span style="float:left" class="label">策略大图</span>
    <el-upload style="display:inline-block;margin-left:16px"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </div></el-col>
</el-row>
<!-- 策略大图 -->


<!-- 基准收益率 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
    <label for="">基准收益率
    </label>
    <el-input class="ml12" style="width:100px;" placeholder="请输入内容"></el-input>%
    </div></el-col>
</el-row>
<!-- 基准收益率 -->

  </div>



<!-- 修改 -->
  <div v-if="type == 'update'">
 <el-row>
    <!--  策略类型-->
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">策略类型</label>
        <el-select v-model="so" style="width:322px;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </div></el-col>

          <!--  标签-->
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <label for="">标签</label>
          <el-select v-model="value" style="width:28%;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

            <el-select v-model="value" style="width:28%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

            <el-select v-model="value" style="width:28%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </div></el-col>




      </el-row>


      <el-row >
          <!--  标签-->
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">策略名称</label>
          <el-input style="width:322px;" placeholder="请输入内容" class="ml12"></el-input>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <!--  策略编号-->
      <label for="">策略编号</label>
          <el-input style="width:322px;" placeholder="请输入内容" class="ml12"></el-input>
          </div></el-col>
      </el-row>


      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
        <div class="block">
            <span class="label">开始时间</span>
          <el-date-picker style="width:322px;" class="ml12"
            v-model="time1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <div class="block">
            <span class="label">结束时间</span>
          <el-date-picker style="width:322px;" class="ml12"
            v-model="time2"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
          </div></el-col>
      </el-row>


      <!-- 上传文件 -->
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
            <span style="float:left" class="label">策略报告</span>
          <el-upload style="display:inline-block;margin-left:16px"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
            <span class="label">策略状态 </span>
            <el-switch class="ml12"
        v-model="switchis"
        >
      </el-switch>
          </div></el-col>
      </el-row>
      <!-- 上传文件 -->


      <!-- 止盈止损 -->
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">止盈(BP)
          </label>
          <el-input class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <label for="">止损(BP)
          </label>
          <el-input class="ml12" style="width:322px;" placeholder="请输入内容"></el-input>
          </div></el-col>
      </el-row>
      <!-- 止盈止损 -->

      <!-- 债券估值方法 -->
      <el-row>
        <el-col :span="12">
          <label for="">债券估值方法</label>
        <el-select v-model="value" style="width:290px;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </el-col>
      </el-row>
      <!-- 债券估值方法 -->



      <!-- 策略描述 -->
      <el-row id="strategyDesc">
        <el-form ref="form" label-width="80px">
        <el-form-item label="活动形式">
          <el-input type="textarea" ></el-input>
        </el-form-item>
        </el-form>
      </el-row>
<!-- 策略描述 -->


<!-- <el-row >
  <el-col :span="12" :offset="2">
 <el-button style="width:100px;" type="primary">保存</el-button>
   <el-button style="width:100px;background-color:#bebebe;border-color:#bebebe;" type="info" >返回</el-button>
  </el-col>
</el-row> -->


<!-- 策略小图 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
      <span style="float:left" class="label">策略小图</span>
    <el-upload style="display:inline-block;margin-left:16px"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </div></el-col>
</el-row>
<!-- 策略小图 -->


<!-- 策略大图 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
      <span style="float:left" class="label">策略大图</span>
    <el-upload style="display:inline-block;margin-left:16px"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </div></el-col>
</el-row>
<!-- 策略大图 -->


<!-- 基准收益率 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
    <label for="">基准收益率
    </label>
    <el-input class="ml12" style="width:100px;" placeholder="请输入内容"></el-input>%
    </div></el-col>
</el-row>
<!-- 基准收益率 -->
  </div>

<!-- 查看 -->
  <div v-if="type == 'review'">
 <el-row>
    <!--  策略类型-->
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">策略类型</label>
        <el-select v-model="so" style="width:322px;" class="ml12" disabled>
          <el-option
            :value="so">
          </el-option>
        </el-select>
          </div></el-col>

          <!--  标签-->
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <label for="">标签</label>
          <el-select v-model="value" style="width:28%;" class="ml12" disabled>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

            <el-select v-model="value" style="width:28%;" disabled>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

            <el-select v-model="value" style="width:28%;" disabled>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </div></el-col>




      </el-row>


      <el-row >
          <!--  标签-->
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">策略名称</label>
          <el-input style="width:322px;" placeholder="请输入内容" v-model="so" class="ml12" disabled></el-input>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <!--  策略编号-->
      <label for="">策略编号</label>
          <el-input style="width:322px;" placeholder="请输入内容" v-model="so" class="ml12" disabled></el-input>
          </div></el-col>
      </el-row>


      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
        <div class="block">
            <span class="label">开始时间</span>
          <el-date-picker style="width:322px;" class="ml12" disabled
            v-model="time1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <div class="block">
            <span class="label">结束时间</span>
          <el-date-picker style="width:322px;" class="ml12" disabled
            v-model="time2"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
          </div></el-col>
      </el-row>


      <!-- 上传文件 -->
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
            <span style="float:left" class="label">策略报告</span>
          <el-upload style="display:inline-block;margin-left:16px"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <!-- <el-button size="small" type="primary" disabled>点击上传</el-button> -->
      </el-upload>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
            <span class="label">策略状态 </span>
            <el-switch class="ml12" disabled
        v-model="switchis"
        >
      </el-switch>
          </div></el-col>
      </el-row>
      <!-- 上传文件 -->


      <!-- 止盈止损 -->
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <label for="">止盈(BP)
          </label>
          <el-input class="ml12" style="width:322px;" placeholder="请输入内容" v-model="so" disabled></el-input>
          </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <label for="">止损(BP)
          </label>
          <el-input class="ml12" style="width:322px;" placeholder="请输入内容" v-model="so" disabled></el-input>
          </div></el-col>
      </el-row>
      <!-- 止盈止损 -->

      <!-- 债券估值方法 -->
      <el-row>
        <el-col :span="12">
          <label for="">债券估值方法</label>
        <el-select disabled v-model="so" style="width:290px;" class="ml12">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
          </el-col>
      </el-row>
      <!-- 债券估值方法 -->



      <!-- 策略描述 -->
      <el-row id="strategyDesc">
        <el-form ref="form" label-width="80px">
        <el-form-item label="活动形式">
          <el-input type="textarea" disabled v-model="so"></el-input>
        </el-form-item>
        </el-form>
      </el-row>
<!-- 策略描述 -->


<!-- <el-row >
  <el-col :span="12" :offset="2">
 <el-button style="width:100px;" type="primary">保存</el-button>
   <el-button style="width:100px;background-color:#bebebe;border-color:#bebebe;" type="info" >返回</el-button>
  </el-col>
</el-row> -->


<!-- 策略小图 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
      <span style="float:left" class="label">策略小图</span>
    <el-upload style="display:inline-block;margin-left:16px"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
</el-upload>
    </div></el-col>
</el-row>
<!-- 策略小图 -->


<!-- 策略大图 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
      <span style="float:left" class="label">策略大图</span>
    <el-upload style="display:inline-block;margin-left:16px"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
</el-upload>
    </div></el-col>
</el-row>
<!-- 策略大图 -->


<!-- 基准收益率 -->
<el-row>
  <el-col :span="12"><div class="grid-content bg-purple">
    <label for="">基准收益率
    </label>
    <el-input class="ml12" style="width:100px;" placeholder="请输入内容" disabled></el-input>%
    </div></el-col>
</el-row>
<!-- 基准收益率 -->
  </div>
<!-- 查看 -->



</div>




</template>

<script>
export default {
  data() {
    return {
      so: "11",
      switchis: "",
      type: "review",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      value: "",
      time1: "",
      time2: "",
      fileList: []
    };
  },
  created() {
    //截取对象  获取对象type 新建 修改 查看
    // switch (this.type) {
    //   case create:
    //     this.type = create;
    //     break;
    //   case update:
    //     this.type = update;
    //     break;
    //   case review:
    //     this.type = review;
    //     break;
    // }
  },

  methods: {up() {
        this.$emit('upup','hehe'); //主动触发upup方法，'hehe'为向父组件传递的数据
    },
    //上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }

    //上传文件
  }
};
</script>


<style scoped>
.formBox {
  margin-top: 40px;
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
