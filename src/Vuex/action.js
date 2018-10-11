export default {
  getParamSync(context, Object) {
    context.commit('getParam', Object)
  },
  changetitleSync(context, title){
    context.commit('changetitle', title)
  }
  
}
