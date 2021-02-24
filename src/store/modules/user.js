import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),  //用户登录成功的token
    name: '', //获取用户信息保存用户信息的名称
    avatar: '' //获取用户信息保存用户信息的头像
  }
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
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
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

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
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

