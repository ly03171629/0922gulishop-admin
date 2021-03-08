//这个文件目的是把所有的接口整合到一起，然后一起去暴露
//引入  暴露（对象） 之前学的
//引入并暴露
//可以理解为先引入，引入之后再暴露出去
// import trademark from './trademark'
// export trademark

//使用引入并暴露的方式，default引入的时候不能简写
export {default as trademark} from './product/trademark'
export {default as attr} from './product/attr'
export {default as category} from './product/category'
export {default as sku} from './product/sku'
export {default as spu} from './product/spu'
export {default as permission} from './acl/permission'
export {default as role} from './acl/role'
export * as user from './acl/user'


//相当于是分别暴露了 trademark和attr 对象

// 最终出去的是
// {
//   trademark,
//   attr
// }