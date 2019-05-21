import PageTransition from '../views/PageTransition'
const Home = (resolve) => {
  import('../views/home/Home.vue').then((module) => {
    resolve(module)
  })
}
const Product = (resolve) => {
  import('../views/product/Product.vue').then((module) => {
    resolve(module)
  })
}
const Find = (resolve) => {
  import('../views/find/Find.vue').then((module) => {
    resolve(module)
  })
}
const UserInfo = (resolve) => {
  import('../views/UserInfo.vue').then((module) => {
    resolve(module)
  })
}
const Mine = (resolve) => {
  import('../views/mine/Mine.vue').then((module) => {
    resolve(module)
  })
}
const LoanProduct = (resolve) => {
  import('../views/LoanProduct.vue').then((module) => {
    resolve(module)
  })
}
const CreateOrder = (resolve) => {
  import('../views/create-order/CreateOrder.vue').then((module) => {
    resolve(module)
  })
}
const Message = (resolve) => {
  import('../views/message/list/Message').then((module) => {
    resolve(module)
  })
}
const Login = (resolve) => {
  import('../views/Login.vue').then((module) => {
    resolve(module)
  })
}
const Verify = (resolve) => {
  import('../views/verify/Verify.vue').then((module) => {
    resolve(module)
  })
}
const MyOrders = (resolve) => {
  import('../views/my-orders/MyOrder.vue').then((module) => {
    resolve(module)
  })
}
const EditPwd = (resolve) => {
  import('../views/EditPwd.vue').then((module) => {
    resolve(module)
  })
}
const DetailOrder = (resolve) => {
  import('../views/detail-order/DetailOrder.vue').then((module) => {
    resolve(module)
  })
}
const FQuestion = (resolve) => {
  import('../views/FQuestion.vue').then((module) => {
    resolve(module)
  })
}
const Share = (resolve) => {
  import('../views/Share.vue').then((module) => {
    resolve(module)
  })
}
const Setting = (resolve) => {
  import('../views/setting/Setting.vue').then((module) => {
    resolve(module)
  })
}
const Browser = (resolve) => {
  import('../views/Browser.vue').then((module) => {
    resolve(module)
  })
}
const Favorite = (resolve) => {
  import('../views/Favorite.vue').then((module) => {
    resolve(module)
  })
}
const routes = [
  {
    path: '',
    component: PageTransition,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
          isKeepAlive: true
        }
      },
      {
        path: '/find',
        name: 'find',
        component: Find,
        meta: {
          isKeepAlive: true
        }
      },
      {
        path: '/filter-find',
        name: 'filter-find',
        component: Find
      },
      {
        path: '/message',
        name: 'message',
        component: Message,
        meta: {
          isKeepAlive: true
        }
      },
      {
        path: '/mine',
        name: 'mine',
        component: Mine,
        meta: {
          isKeepAlive: true
        }
      },
      {
        path: '/product',
        name: 'product',
        component: Product
      },
      {
        path: '/loan-product',
        name: 'loan-product',
        component: LoanProduct
      },
      {
        path: '/create-order',
        name: 'create-order',
        component: CreateOrder
      },
      {
        path: '/user-info',
        name: 'user-info',
        component: UserInfo
      },
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting
      },
      {
        path: '/verify',
        name: 'verify',
        component: Verify
      },
      {
        path: '/my-orders',
        name: 'my-orders',
        component: MyOrders
      },
      {
        path: '/detail-order',
        name: 'detail-order',
        component: DetailOrder
      },
      {
        path: '/fquestion',
        name: 'fquestion',
        component: FQuestion
      },
      {
        path: '/share',
        name: 'share',
        component: Share
      },
      {
        path: '/edit-pwd',
        name: 'edit-pwd',
        component: EditPwd
      },
      {
        path: '/browser',
        name: 'browser',
        component: Browser
      },
      {
        path: '/favorite',
        name: 'favorite',
        component: Favorite
      },
      {
        path: '/bank-card-verify',
        name: 'bankCardVerify',
        component: (resolve) => {
          import('../views/bank-card-verify/BankCardVerify').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/id-card-verify',
        name: 'idCardVerify',
        component: (resolve) => {
          import('../views/id-card-verify/IdCardVerify').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/zhima-credit',
        name: 'zhimeCredit',
        component: (resolve) => {
          import('../views/zhima-credit/ZhimeCredit').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/add-or-update-user-contacts',
        name: 'addOrUpdateUserContacts',
        component: (resolve) => {
          import('../views/link-user-contacts/add-or-update/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/link-user-contacts',
        name: 'linkUserContacts',
        component: (resolve) => {
          import('../views/link-user-contacts/list/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/phone-verify',
        name: 'phoneVerify',
        component: (resolve) => {
          import('../views/phone-verify/Index').then((module) => {
            resolve(module)
          })
        }
      }
    ]
  }
]
export default routes
