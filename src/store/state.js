const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
  showDrawer: false,
  user: {},
  saler:{},
  manager:{},
  updateFlag:false
}


export default state