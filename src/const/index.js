
const isApp = false

const url = {
  baseUrl: 'https://p-huohuodai.jxstudio.cn',
  upload: '/File/Upload',
  ChangePassword: '/api/services/app/Profile/ChangePassword',
  // .修改用户资料
  UpdateUserinfo: '/api/services/client/Customer/UpdateCurrentCustomerProfile',
  // 图片上传
  UploadProfilePicture: '/Profile/UploadProfilePicture',
  // 裁剪
  UploadProfilePicture2: '/api/services/app/Profile/UpdateProfilePicture',
  // .获取用户资料
  getUserinfo: '/api/services/app/Profile/GetCurrentUserProfileForEdit',
  // .推广页面
  register: '/h5/register.html?RefereeId=',
  // .账号登录
  Authenticate: '/api/TokenAuth/Authenticate',
  // .快速认证
  AuthenticateBySms: '/api/TokenAuth/AuthenticateBySms',
  // .极验验证码
  InitGeetest: '/api/services/app/Geetest/InitGeetest',
  // .获取用户头像
  GetProfilePicture: '/Profile/GetProfilePicture',

  // 是否收藏
  IsProductFavorite: '/api/services/client/Favorite/IsProductFavorite',
  // 添加收藏
  AddProductFavorite: '/api/services/client/Favorite/AddProductFavorite',
  // 取消收藏
  CancelProductFavorite: '/api/services/client/Favorite/CancelProductFavorite',
  // 获取收藏列表
  GetProductFavorites: '/api/services/client/Favorite/GetProductFavorites',
  // .获取产品列表
  productsUrl: '/api/services/client/Market/GetProducts',
  // .获取产品详情
  GetProduct: '/api/services/client/Market/GetProduct',
  // 获取产品详细信息
  LoanProduct: '/api/services/client/Loan/GetProduct',
  // .刷新token
  RefreshToken: '/api/TokenAuth/RefreshToken',
  // 借款计算
  LoanCalculate: '/api/services/client/Loan/Calculate',
  // 创建订单
  CreateOrder: '/api/services/client/Loan/CreateOrder',
  // 获取订单列表
  GetOrders: '/api/services/client/Loan/GetOrders',
  // 获取订单详情
  GetOrderDetail: '/api/services/client/Loan/GetOrder',
  // 取消订单
  CancelOrder: '/api/services/client/Loan/CancelOrder',
  // 获取借款产品信息(仅续期)
  GetProductRenewals: '/api/services/client/Loan/GetRenewals',
  // 借款续期
  RenewalOrder: '/api/services/client/Loan/RenewalOrder',
  // 取消未完成的借款续期
  CancelRenewalOrder: '/api/services/client/Loan/CancelRenewalOrder',
  // 常见问题
  GetProjectContentByTag: '/api/services/client/ProjectContent/GetProjectContentByTag',
  // .采集
  HandAppAndPhoneInfo: '/api/services/client/CustomerInfoAuthentication/HandAppAndPhoneInfo',
  UserVerify: {
    // 借款
    IsAuthBaseInfo: '/api/services/client/UserVerify/IsAuthBaseInfo',
    // 设置收款银行卡
    AuthBaseInfo: '/api/services/client/UserVerify/AuthBaseInfo',
    AuthIdCard: '/api/services/client/UserVerify/AuthIdCard',
    AuthZhiMa: '/api/services/client/UserVerify/AuthZhiMa',
    createOrUpdateContact: '/api/services/client/UserVerify/CreateOrUpdateContact',
    GetAuthList: '/api/services/client/UserVerify/GetAuthList',
    AuthOperatorRequest: '/api/services/client/UserVerify/AuthOperatorRequest',
    AuthOperatorSubmit: '/api/services/client/UserVerify/AuthOperatorSubmit',
    GetUserContactList: '/api/services/client/UserVerify/GetUserContactList',
    DeleteContact: '/api/services/client/UserVerify/DeleteContact'
  },
  ProjectContent: {
    GetContentList: '/api/services/client/ProjectContent/GetContentList'
  }
}
export {
  url,
  isApp
}
