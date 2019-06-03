import PageTransition from '../views/PageTransition'

const Product = (resolve) => {
  import('../views/product/product/Index').then((module) => {
    resolve(module)
  })
}
const Find = (resolve) => {
  import('../views/find/Index').then((module) => {
    resolve(module)
  })
}
const LoanProduct = (resolve) => {
  import('../views/loan/loan-product/Index').then((module) => {
    resolve(module)
  })
}
const CreateOrder = (resolve) => {
  import('../views/loan/create-order/Index').then((module) => {
    resolve(module)
  })
}
const Message = (resolve) => {
  import('../views/message/list/Index').then((module) => {
    resolve(module)
  })
}
const Login = (resolve) => {
  import('../views/Login.vue').then((module) => {
    resolve(module)
  })
}
const Browser = (resolve) => {
  import('../views/Browser.vue').then((module) => {
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
        component: (resolve) => {
          import('../views/home/Index').then((module) => {
            resolve(module)
          })
        },
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
        path: '/message/detail',
        name: 'message-detail',
        component: (resolve) => {
          import('../views/message/detail/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/mine',
        name: 'mine',
        component: (resolve) => {
          import('../views/mine/mine/Index').then((module) => {
            resolve(module)
          })
        },
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
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/setting',
        name: 'setting',
        component: (resolve) => {
          import('../views/setting/setting/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/edit-pwd',
        name: 'edit-pwd',
        component: (resolve) => {
          import('../views/setting/edit-pwd/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/user-info',
        name: 'user-info',
        component: (resolve) => {
          import('../views/setting/user-info/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/my-orders',
        name: 'my-orders',
        component: (resolve) => {
          import('../views/my-orders/my-orders/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/detail-order',
        name: 'detail-order',
        component: (resolve) => {
          import('../views/my-orders/detail-order/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/fquestion',
        name: 'fquestion',
        component: (resolve) => {
          import('../views/mine/f-question/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/share',
        name: 'share',
        component: (resolve) => {
          import('../views/mine/share/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/browser',
        name: 'browser',
        component: Browser
      },
      {
        path: '/favorite',
        name: 'favorite',
        component: (resolve) => {
          import('../views/mine/favorite/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify',
        name: 'verify',
        component: (resolve) => {
          import('../views/verify/verify/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify/bank-card-verify',
        name: 'bankCardVerify',
        component: (resolve) => {
          import('../views/verify/bank-card-verify/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify/id-card-verify',
        name: 'idCardVerify',
        component: (resolve) => {
          import('../views/verify/id-card-verify/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify/zhima-credit',
        name: 'zhimeCredit',
        component: (resolve) => {
          import('../views/verify/zhima-credit/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify/add-or-update-user-contacts',
        name: 'addOrUpdateUserContacts',
        component: (resolve) => {
          import('../views/verify/link-user-contacts/add-or-update/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify/link-user-contacts',
        name: 'linkUserContacts',
        component: (resolve) => {
          import('../views/verify/link-user-contacts/list/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/verify/phone-verify',
        name: 'phoneVerify',
        component: (resolve) => {
          import('../views/verify/phone-verify/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/invite',
        name: 'invite',
        component: (resolve) => {
          import('../views/mine/invite/invite/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/invite/record',
        name: 'invateRecord',
        component: (resolve) => {
          import('../views/mine/invite/record/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/invite/gold',
        name: 'inviteGold',
        component: (resolve) => {
          import('../views/mine/invite/invite-gold/Index').then((module) => {
            resolve(module)
          })
        }
      },
      {
        path: '/invite/withdraw',
        name: 'withdraw',
        component: (resolve) => {
          import('../views/mine/invite/withdraw/Index').then((module) => {
            resolve(module)
          })
        }
      }
    ]
  }
]
export default routes
