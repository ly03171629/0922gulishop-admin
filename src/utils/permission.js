import store from '@/store'
//这个函数是用来检测用户是否有某种按钮级别的权限
export function hasBtnPermission(btnName){
  let buttons = store.getters.buttons //获取到用户返回的所有按钮级别权限数据的字符串数组
  return buttons.indexOf(btnName) !== -1
}