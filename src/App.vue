<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
@import "../static/css/main.css";

#textarea .el-textarea__inner {
  height: 222px !important;
}
#dialogBox .el-dialog--small,
#editdialogBox .el-dialog--small,
#removedialogBox .el-dialog--small,
#restdialogBox .el-dialog--small {
  width: 520px !important;
}
#accoutRole .el-dialog.el-dialog--small {
  top: 15%;
  height: 500px;
  overflow-y: scroll;
}
#drop {
  z-index: 99999999999999 !important;
}
#createvoicedialogBox .el-dialog--small,
#editvoicedialogBox .el-dialog--small {
  min-width: 710px !important;
}
#StrategyList .el-textarea__inner {
  width: 86% !important;
}

.aplayer-controller .aplayer-time .aplayer-volume-wrap + .aplayer-icon,
.aplayer-controller .aplayer-time .aplayer-icon.inactive {
  display: none;
}

#createBox .el-upload-list.el-upload-list--text {
  display: none;
}
.aplayer-author {
  display: none !important;
}
/* #editdialogBox input::-webkit-input-placeholder {
         color: black;
       
     } */
</style>
