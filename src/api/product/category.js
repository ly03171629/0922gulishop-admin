//这个文件里面是和三级联动相关的接口请求函数
import request from '@/utils/request'

export default {
  //获取一级分类列表
  // GET  /admin/product/getCategory1
  getCategory1(){
    return request.get('/admin/product/getCategory1')
  },
  
  //根据一级分类id获取2级分类列表
  // GET /admin/product/getCategory2/{category1Id}
  getCategory2(category1Id){
    return request.get(`/admin/product/getCategory2/${category1Id}`)
  },

  //根据二级分离id获取3级分类列表
  // GET /admin/product/getCategory3/{category2Id}
  getCategory3(category2Id){
    return request.get(`/admin/product/getCategory3/${category2Id}`)
  }
}


