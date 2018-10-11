<template>
  <div class="tac">
    <div style="height:66px;">
      <img src="../../assets/login/logo.png" alt="">
    </div>
    <el-row style="
    width: 200px;background-color:#32373d;
">
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#32373d"
               text-color="627587">
        <el-submenu index="11" v-if="auth11">
          <!-- v-if="auth11" -->
          <template slot="title">
            <span>我的空间</span>
          </template>
          <el-submenu index="111" v-if="auth111">
            <template slot="title">
              <img style="padding-right:6px;" src="../../assets/login/lodo.png" alt="">信用债空间</template>
            <router-link to="StrategyList">
              <el-menu-item index="1112" v-if="auth1112">我的策略</el-menu-item>
            </router-link>
          </el-submenu>
        </el-submenu>
        <el-submenu index="21" v-if="auth21">
          <template slot="title">策略管理</template>
          <router-link to="allStrategyList">
            <el-menu-item index="211">信用债策略</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="31" v-if="auth31">
          <template slot="title">权限分配</template>
          <router-link to="account">
            <el-menu-item index="311" v-if="auth311">用户管理</el-menu-item>
          </router-link>
          <router-link to="role">
            <el-menu-item index="312" v-if="auth312">角色管理</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="41" v-if="auth41">
          <template slot="title">会员管理</template>
          <router-link to="Salesmanagement">
            <el-menu-item index="411" v-if="auth411">销售管理</el-menu-item>
          </router-link>
          <router-link to="Membermanagement">
            <el-menu-item index="412" v-if="auth412">会员管理</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="51" v-if="auth51">
          <template slot="title">素材管理</template>
          <router-link to="SoundManagement">
            <el-menu-item index="511"  v-if="auth511">语音管理</el-menu-item>
          </router-link>
          <router-link to="ImageManagement">
            <el-menu-item index="512"  v-if="auth512">图片管理</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="61"  v-if="auth61">
          <template slot="title">售后管理</template>
          <router-link to="ProductConfig">
            <el-menu-item index="611"  v-if="auth611">产品配置</el-menu-item>
          </router-link>
          <router-link to="ChartList">
            <el-menu-item index="612"  v-if="auth612">图文列表</el-menu-item>
          </router-link>
        </el-submenu>
      </el-menu>
    </el-row>
  </div>
</template>
<script>
  import { MenuKey } from "../../config/authKey.js";
  import {getCaption, getCookie, setCookie ,childRoute} from "../../config/mUtils.js";
  export default {
    data() {
      return {
        auth: [],
        arr:[],
        auth11: false,
        auth111: false,
        auth1112: false,
        auth21: false,
        auth31: false,
        auth311: false,
        auth312: false,
        auth41: false,
        auth411: false,
        auth412: false,
        auth51: false,
        auth511: false,
        auth512: false,
        auth61: false,
        auth611: false,
        auth612: false
      };
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace("/", "");
      }
    },
    created() {
      if (getCookie("UserType") == 9) {
        this.auth11 = true;
        this.auth111 = true;
        this.auth1112 = true;
        this.auth21 = true;
        this.auth21 = true;
        this.auth31 = true;
        this.auth311 = true;
        this.auth312 = true;
        this.auth41 = true;
        this.auth411 = true;
        this.auth412 = true;
        this.auth51 = true;
        this.auth511 = true;
        this.auth512 = true;
        this.auth61 = true;
        this.auth611 = true;
        this.auth612 = true;
        if(getCaption(location.href) == "Welcome" || getCaption(location.href) == "Tipspower"){
          this.$router.push("/StrategyList");
        }
      } else {
        axios({
          method: "get",
          url: "/GetPUserPrivilegeConfigByUserId",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_UserId: getCookie("UserId"),
            m_SystemId: "StrategySysIdentifier"
          }
        }).then(res => {
          if (res.data.ResultCode == 200) {
            this.auth = JSON.parse(
              res.data.ReturnParam.$values[0].Privilege
            ).echo;
            setCookie("auth", this.auth);
            this.handleShow(this.auth);
            this.handleAuth();
          }
        });
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleAuth() {
        for (let i = 0; i < this.auth.length; i++) {
          switch (this.auth[i]) {
            case 11:
              this.auth11 = true;
              break;
            case 111:
              this.auth111 = true;
              break;
            case 1112:
              this.auth1112 = true;
              break;

            case 21:
              this.auth21 = true;
              break;
            case 211:
              this.auth21 = true;
              this.auth21 = true;
              break;

            case 31:
              this.auth31 = true;
              break;
            case 311:
              this.auth31 = true;
              this.auth311 = true;
              break;
            case 312:
              this.auth31 = true;
              this.auth312 = true;
              break;

            case 41:
              this.auth41 = true;
              break;
            case 411:
              this.auth41 = true;
              this.auth411 = true;
              break;
            case 412:
              this.auth41 = true;
              this.auth412 = true;
              break;

            case 51:
              this.auth51 = true;
              break;
            case 511:
              this.auth51 = true;
              this.auth511 = true;
              break;
            case 512:
              this.auth51 = true;
              this.auth512 = true;
              break;

            case 61:
              this.auth61 = true;
              break;
            case 611:
              this.auth61 = true;
              this.auth611 = true;
              break;
            case 612:
              this.auth61 = true;
              this.auth612 = true;
              break;

            default:
              break;
          }
        }
      },
      handleShow (show){
        let name = getCaption(location.href);
        let arr = [];
        let arr2 = [];
        if(show.length > 0){
          arr2 = show.filter(item => parseInt(item)>100);
          arr2.forEach((val,n)=>{
            MenuKey.forEach((value,index) => {
              value.children.forEach((item,key) => {
                let m = item.href.lastIndexOf('/');
                let src = item.href.substring(m+1,item.href.length);
                if(item.id == val){
                  arr.push(src);
                }
              });
            });
          });
          if(name == "Welcome" || name == "Tipspower"){
            this.$router.push(arr[0]);
          } else if(arr.indexOf(name) > -1){
            this.$router.push(name);
          }else{
            let editname = name.indexOf("?") > -1 ? name.split("?")[0] :  name;
            let flag = false;
            for(let i=0;i <= childRoute.length;i++){
              let k = childRoute[i];
              if(flag) break;
              if(flag) return;
              if(i != childRoute.length && flag == false){
                for(let n of this.auth){
                  if(flag) break;
                  if(flag) return;
                  if(n == k.id){
                    for(let d of k.arry){
                      if(editname == d){
                        flag = true;
                        break;
                      }
                    }
                  }
                }
              }else{
                this.$message({
                  showClose: true,
                  message: '没有权限，请联系管理员',
                  type: 'warning'
                });
                this.$router.push("/Tipspower");
              }
            }
          }
        }else {
          this.$message({
            showClose: true,
            message: '没有权限，请联系管理员',
            type: 'warning'
          });
          this.$router.push("/Welcome");
        }
      }
    }
  };
</script>
<style scoped>
  .el-submenu__title:focus,
  .el-submenu__title:hover,
  .el-submenu__title,
  .el-submenu,
  .el-menu,
  .el-menu-item:hover,
  .el-submenu__title:hover,
  .el-menu-item-group,
  .is-opened,
  .el-menu-item {
    background-color: #32373d;
  }

  .tac {
    display: block;
    position: absolute;
    width: 200px;
    left: 0;
    top: 0px;
    bottom: 0;
    color: #697a8e;
    font-weight: 700;
  }

  .el-menu {
    border: 0px;
  }

  .sidebar > ul {
    height: 100%;
  }

  .el-menu-item,
  .el-submenu__title {
    font-size: 14px;
  }

  .material-icons {
    font-size: 12px;
  }
</style>
