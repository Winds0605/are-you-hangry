import * as types from './mutation-types'

const mutations = {
  [types.SET_SHOWDRAWER](state, flag) {
    state.showDrawer = flag

  },
  [types.SET_USER](state,user){
    state.user = user
  },
  [types.SET_SALER](state,saler){
    state.saler = saler
  },
  [types.SET_MANAGER](state,manager){
    state.manager = manager
  },
  [types.SET_UPDATEFLAG](state,flag){
    state.updateFlag = flag
  }
}

export default mutations