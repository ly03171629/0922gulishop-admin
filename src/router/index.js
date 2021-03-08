import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由 ，不需要权限数据，就可以使用的路由，对应的菜单就可以操作，任何用户都能操作
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',  //后面我们配的所有的路由，都要配个name值 是大写字母开头
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },  
]

//存储的是需要权限数据控制的所有路由，后期需要从这个里面根据用户权限数据过滤出用户需要的路由进行动态配置
export const allAsyncRoutes = [
  //权限数据管理相关的路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: { 
      title: '权限管理', 
      icon: 'el-icon-lock' 
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: { 
          title: '用户管理', 
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: { 
          title: '角色管理', 
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: { 
          title: '菜单管理',
        },
      },
    ]
  },
  //配置商品管理相关的路由
  {
    path:'/product',  //一级路由组件只有两个要么是登录login组件  要么就是layout组件
    component: Layout, //显示一级路由组件架子，并且立马重定向二级路由组件
    name:'Product', //name必须写，而且必须写的是路径的首字母大写。因为后面权限要用
    redirect: '/product/trademark/list',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children:[
      {
        path:'trademark/list',
        component:() => import('@/views/product/trademark/List'),
        name:'Trademark',
        meta: { title: '品牌管理' }
      },
      {
        path:'attr/list',
        component:() => import('@/views/product/attr/List'),
        name:'Attr',
        meta: { title: '平台属性管理' }
      },
      {
        path:'spu/list',
        component:() => import('@/views/product/spu/List'),
        name:'Spu',
        meta: { title: 'SPU管理' }
      },
      {
        path:'sku/list',
        component:() => import('@/views/product/sku/List'),
        name:'Sku',
        meta: { title: 'SKU管理' }
      },
      {
        path:'category/list',
        component:() => import('@/views/product/category/List'),
        name:'Category',
        meta: { title: '分类管理' }
      },
      {
        path:'scoped/list',
        component:() => import('@/views/product/scoped/List'),
        name:'Scoped',
        meta: { title: 'scoped测试' }
      }
    ]
  },

  //自己添加的一个测试菜单路由
  {
    path:'/test',  //一级路由组件只有两个要么是登录login组件  要么就是layout组件
    component: Layout, //显示一级路由组件架子，并且立马重定向二级路由组件
    name:'Test', //name必须写，而且必须写的是路径的首字母大写。因为后面权限要用
    redirect: '/test/test111/list',
    meta: { title: '测试管理', icon: 'el-icon-s-tools' },
    children:[
      {
        path:'test111/list',
        component:() => import('@/views/test/test111/List'),
        name:'Test111',
        meta: { title: '测试1' }
      },
      {
        path:'test222/list',
        component:() => import('@/views/test/test222/List'),
        name:'Test222',
        meta: { title: '测试2' }
      }
      
    ]
  },

]

//任意路由，当用户随意的输入一个路径，那么应该显示404 ，任意路由必须是注册在最后一个
export const anyRoute = { path: '*', redirect: '/404', hidden: true }




const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode:'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes  
  //一开始没做权限的时候，这里面只有常量路由，要做权限操作，后面是需要动态的往这个路由配置数组当中添加用户自己的异步路由和任意路由
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
