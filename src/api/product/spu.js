/* 
包含spu管理相关接口请求函数
*/
import request from '@/utils/request'

export default {
  /* 
  获取所有的销售属性列表
  GET /admin/product/baseSaleAttrList
  */
  getSaleAttrList () {
    return request.get('/admin/product/baseSaleAttrList')
  },

  /* 
  删除指定的SPU
  DELETE /admin/product/deleteSpu/{spuId}
  */
  remove(spuId) {
    return request.delete(`/admin/product/deleteSpu/${spuId}`)
  },

  /* 
  根据id获取SPU详情信息
  GET /admin/product/getSpuById/{spuId}
  spuList: 包含多个spu简单信息的数组，数组里面放了很多spu对象，但是每个spu对象里面信息不全
  spuInfo: 包含一个spu详细信息的对象，信息比较详细的

  */
  get (spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  },

  /* 
  添加SPU详情信息
  POST /admin/product/saveSpuInfo
  POST /admin/product/updateSpuInfo
  */
  addUpdate(spuInfo) {
    // return request.post(`/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
    return request({
      url: `/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
      method: 'POST',
      data: spuInfo
    })
  },

  /* 
  获取spu的分页列表数据
  GET /admin/product/{page}/{limit}
    query参数: category3Id
  */
  getList (page, limit, category3Id) {
    // return request.get(`/admin/product/${page}/${limit}`, {params: {category3Id}})

    return request({
      url: `/admin/product/${page}/${limit}`,
      method: 'GET',
      params: {category3Id}
    })
  },

}