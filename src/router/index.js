import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Register from '@/components/Register'
import notFound from '@/components/404'

import Index from '@/components/Index'
import Home from '@/components/index/Home'
import Order from '@/components/index/Order'
import MeiShi from '@/components/index/Meishi'
import ShopDetail from '@/components/index/ShopDetail'


// 管理组件
import Manage from '@/components/Manage'
// 管理员
import Manager from '@/components/manage/manager'
import GoodsManage from '@/components/manage/manager/goodsManage'
// 商家
import Saler from '@/components/manage/Saler'
import SalerInfo from '@/components/manage/saler/salerInfo'
import GoodsList from '@/components/manage/saler/goodsList'
import RecOrders from '@/components/manage/saler/recOrders'
import MissedOrder from '@/components/manage/saler/missedOrder'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'order',
          name: 'order',
          component: Order
        },
        {
          path: 'meishi',
          name: 'MeiShi',
          component: MeiShi
        },
        {
          path: 'shopdetail',
          name: 'ShopDetail',
          component: ShopDetail
        }
      ]
    },
    {
      path: '/manage',
      component: Manage,
      children: [
        {
          path: 'saler',
          component: Saler,
          children: [
            {
              path: '',
              redirect: 'salerinfo'
            },
            {
              path: 'salerinfo',
              component: SalerInfo
            },
            {
              path: 'goodslist',
              component: GoodsList
            },
            {
              path: 'recorders',
              component: RecOrders
            },
            {
              path: 'missedorder',
              component: MissedOrder
            }
          ]
        },
        {
          path: 'manager',
          component: Manager,
          children:[
            {
              path: '',
              redirect: 'goodsmanage'
            },
            {
              path: 'goodsmanage',
              component: GoodsManage
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '*',
      name: 'notFound',
      component: notFound
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = sessionStorage.ayhToken ? true : false;
  if (to.path == '/login' || to.path == '/register' || to.path == '/index') {
    next();
  } else {
    isLogin ? next() : next('/login');
  }
})


export default router