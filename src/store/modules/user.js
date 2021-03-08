import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { allAsyncRoutes, resetRouter, anyRoute, constantRoutes } from '@/router'
import router from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),  //用户登录成功的token
    name: '', //获取用户信息保存用户信息的名称
    avatar: '', //获取用户信息保存用户信息的头像

    //权限相关的数据
    buttons:[],// 和按钮权限相关的权限数据
    roles:[],//和用户角色相关的权限数据

    routes:[],//和用户相关的所有路由配置数组 这个数组是后期用户形成的最终路由数组，里面是路由对象，不是字符串数据
    asyncRoutes:[],//和用户相关的所有异步路由数组，这个数组里面也是路由对象，不是字符串数据
  }
}


//这个函数专门根据用户返回的routes路由name字符串数组过滤出用户真正的异步路由数组
function filterMyAsyncRoutes(allAsyncRoutes,routeNames){
  const myAsyncRoutes =  allAsyncRoutes.filter(item => {
    //判断一级路由
    if(routeNames.indexOf(item.name) !== -1){
      //判断二级路由，使用递归去操作
      if(item.children && item.children.length){
        //递归查找符合条件的二级路由，然后把二级路由整体改为符合条件的二级路由
        item.children = filterMyAsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })
  return myAsyncRoutes
}



const state = getDefaultState()

// const state = {
//   token: getToken(),
//   name: '',
//   avatar: ''
// }

const mutations = {
  RESET_STATE: (state) => {
    //  Object.assign合并后面的对象的属性 到 前面的对象当中
    Object.assign(state, getDefaultState())
    // state
    // {
    //   token: getToken(),  //用户登录成功的token
    //   name: 'admin', //获取用户信息保存用户信息的名称
    //   avatar: 'xxx' //获取用户信息保存用户信息的头像
    // }
    // getDefaultState()
    // {
    //   token: getToken(),  //用户登录成功的token
    //   name: '', //获取用户信息保存用户信息的名称
    //   avatar: '' //获取用户信息保存用户信息的头像
    // }

    // state:{
    //   token: getToken(),  //用户登录成功的token
    //   name: '', //获取用户信息保存用户信息的名称
    //   avatar: '' //获取用户信息保存用户信息的头像
    // }
    
    //退出登录后把state当中的token及用户信息清空，上面一行代码就是这样
    // state.token = ''
    // state.name = ''
    // state.avatar = ''
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_USERINFO(state,userInfo){
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },

  SET_ROUTES(state,myAsyncRoutes){
    state.asyncRoutes = myAsyncRoutes  //把过滤出来自己的异步路由保存起来
    state.routes = constantRoutes.concat(myAsyncRoutes,anyRoute) 
    //使用常量路由拼接自己的异步路由和任意路由，形成自己最终的所有路由数组
    
    
    //现在目前的路由当中只有常量路由，目前我们需要将路由器当中配的路由动态的改变成，我们最终的路由
    //动态往路由器注册添加新的路由
    //目前我们的路由配置当中已经有了常量路由，我们需要把用户自己的异步路由和任意路由给动态添加
    router.addRoutes([...myAsyncRoutes,anyRoute]) //动态的把自己的异步路由和任意路由注册到路由器内部的路由数组
  }
}

const actions = {
  // user login
  // 我们之前写的async和await 它没有用，直接.then和.catch
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token) //原来咱们是把获取到的token保存在localStorage，而这里它是保存在cookies当中
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  async login({commit},userInfo){
    const result = await login(userInfo)
    if(result.code === 20000){
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)

        commit('SET_USERINFO',data)

        //还要去根据用户信息返回来的routes（和路由name相关的字符串数组），从所有的异步路由数组当中过滤出用户自己的所有异步路由数组
        // data.routes  它是字符串数组 字符串都是路由的name值组成的   ['Trademark','Attr']
        commit('SET_ROUTES',filterMyAsyncRoutes(allAsyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },




  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 把cookies内部的token删除掉
        resetRouter() // 退出之后重置路由器
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true, 
  // 命名空间 可以让所有的模块在写mutation action及 getters的时候重名
  // 如果没有命名空间
  // user模块当中写了一个action  叫getInfo
  // app模块当中也写了一个action 也叫getInfo
  // 这两个getInfo最终都会合并到总的store的actions当中，那么必须发生冲突，就会覆盖

  // 如果有了命名空间
  // user模块当中写了一个action  叫getInfo 但是用的时候必须写成 user/getInfo
  // app模块当中也写了一个action 也叫getInfo 用的时候必须写成 app/getInFo
  // 这两个action在总的actions当中就不会有冲突了
  // 在vue当中 要dispatch就得写为  this.$store.dispatch('user/getInfo')
  state,
  mutations,
  actions
}

