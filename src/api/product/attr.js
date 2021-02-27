//attr属性相关的api接口
import request from '@/utils/request'
export default {
  //属性的增删改查接口
  //根据选中的123及分类id获取属性列表
  // GET  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },


  //根据属性id删除某个属性
  // DELETE /admin/product/deleteAttr/{attrId}
  delete(id){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },


  //增加或者修改属性
  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo',attr)
  }

  // {
  //   tmName,
  //   logoUrl
  // }


  // attr = {
  //   "attrName": "string",
  //   "attrValueList": [
  //     {
  //       "attrId": 0,
  //       "id": 0,
  //       "valueName": "string"
  //     }
  //   ],
  //   "categoryId": 0,
  //   "categoryLevel": 0,
  //   "id": 0
  // }
}