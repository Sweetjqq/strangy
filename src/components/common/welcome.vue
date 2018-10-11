<template>
  <div class="tips">
    欢迎进入策略系统，若您还未添加菜单权限，请让管理员为您分配！
  </div>
</template>

<script>
import { setTitle} from "../../config/mUtils";
export default {
  created () {
    setTitle('欢迎页');
  }
}
</script>

<style scoped>
  .tips{
    font-size: 18px;
    text-align: center;
    margin-top: 100px;
  }
</style>
