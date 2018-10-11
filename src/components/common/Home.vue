<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar style="background-color:#32373d;"></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
       
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        }
    }
</script>

<style media="screen">
  .wrapper{
    min-width: 928px;
  }
</style>
