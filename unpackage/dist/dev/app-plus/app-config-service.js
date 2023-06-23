
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/home/index","pages/home/web","pages/login/login","pages/login/code","pages/login/registSuccess","pages/my/my","pages/my/info","pages/my/runMy","pages/communityList/communityList","pages/orderList/orderList","pages/orderList/detail","pages/orderList/details","pages/order/payState","pages/order/dmProcess","pages/store/store","pages/store/add","pages/worderManage/worderManage","pages/worderManage/detail","pages/communityList/memberList","pages/communityList/memberDetail","pages/boxManage/boxManage","pages/boxManage/add","pages/set/set","pages/set/about","pages/order/order","pages/order/add","pages/login/regist","pages/boxManage/auth","pages/boxManage/authList","pages/address/address","pages/address/receive","pages/address/edit/edit","pages/address/picking","pages/my/coupon","pages/webView/index","pages/message/message","pages/message/infoList","pages/goods/goods","pages/boxManage/bindCoupon","pages/home/search","pages/modal/modal","pages/goods/changeLink","pages/order/writeCode","pages/login/bindPhone","pages/shopping/index","pages/shopping/buyVegetables","pages/shopping/buyIndex","pages/shopping/buyWeb","pages/phoneBill/index","pages/phoneBill/record","pages/recharge/phone","pages/bindCommunit/bindCommunit","pages/bindCommunit/selectCity","pages/address/edit/editReceive"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"数字物业","navigationBarBackgroundColor":"white","backgroundColor":"#f0f0f0"},"tabBar":{"color":"#616161","selectedColor":"#F44850","borderStyle":"white","backgroundColor":"#fff","list":[{"pagePath":"pages/home/index","text":"找服务","iconPath":"/static/tabs/home.png","selectedIconPath":"/static/tabs/homes.png"},{"pagePath":"pages/recharge/phone","text":"充话费","iconPath":"/static/tabs/tab2.png","selectedIconPath":"/static/tabs/tab2s.png"},{"pagePath":"pages/shopping/buyIndex","text":"买东西","iconPath":"/static/tabs/buy.png","selectedIconPath":"/static/tabs/buys.png"},{"pagePath":"pages/my/my","text":"我的","iconPath":"/static/tabs/my.png","selectedIconPath":"/static/tabs/mys.png"}]},"darkmode":false,"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":false,"autoclose":true},"appname":"一秒到家","compilerVersion":"3.7.8","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{"navigationBarTitleText":"一秒达","navigationStyle":"custom","bounce":"none","disableScroll":true}},{"path":"/pages/home/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","navigationStyle":"custom","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/home/web","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":true}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"登录","navigationStyle":"custom","disableScroll":true}},{"path":"/pages/login/code","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom","navigationBarBackgroundColor":"#f0f0f0"}},{"path":"/pages/login/registSuccess","meta":{},"window":{"navigationBarTitleText":"注册","navigationBarBackgroundColor":"#f0f0f0","navigationStyle":"custom","disableScroll":true}},{"path":"/pages/my/my","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","navigationStyle":"custom","enablePullDownRefresh":false}},{"path":"/pages/my/info","meta":{},"window":{"navigationBarTitleText":"个人资料"}},{"path":"/pages/my/runMy","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pages/communityList/communityList","meta":{},"window":{"navigationBarTitleText":"小区信息","enablePullDownRefresh":false}},{"path":"/pages/orderList/orderList","meta":{},"window":{"navigationBarTitleText":"我的订单","navigationStyle":"custom","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/orderList/detail","meta":{},"window":{"navigationBarTitleText":"订单详情","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/orderList/details","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/order/payState","meta":{},"window":{"navigationBarTitleText":"支付","navigationStyle":"custom","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/order/dmProcess","meta":{},"window":{"navigationBarTitleText":"代购攻略","navigationStyle":"custom","enablePullDownRefresh":false}},{"path":"/pages/store/store","meta":{},"window":{"navigationBarTitleText":"订单详情","navigationStyle":"custom"}},{"path":"/pages/store/add","meta":{},"window":{"navigationBarTitleText":"添加店铺"}},{"path":"/pages/worderManage/worderManage","meta":{},"window":{"navigationBarTitleText":"跑腿人员管理","navigationStyle":"custom"}},{"path":"/pages/worderManage/detail","meta":{},"window":{"navigationBarTitleText":"人员详情","navigationBarBackgroundColor":"#ffffff"}},{"path":"/pages/communityList/memberList","meta":{},"window":{"navigationBarTitleText":"小区人员","navigationStyle":"custom"}},{"path":"/pages/communityList/memberDetail","meta":{},"window":{"navigationBarTitleText":"用户详情"}},{"path":"/pages/boxManage/boxManage","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom","disableScroll":true}},{"path":"/pages/boxManage/add","meta":{},"window":{"navigationBarTitleText":"添加设备","navigationStyle":"custom"}},{"path":"/pages/set/set","meta":{},"window":{"navigationBarTitleText":"设置","navigationStyle":"custom","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/set/about","meta":{},"window":{"navigationBarTitleText":"关于我们","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/order/order","meta":{},"window":{"navigationBarTitleText":"商品订单","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/order/add","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/login/regist","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom","enablePullDownRefresh":false,"navigationBarBackgroundColor":"#f0f0f0","disableScroll":true}},{"path":"/pages/boxManage/auth","meta":{},"window":{"navigationBarTitleText":"使用授权","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/boxManage/authList","meta":{},"window":{"navigationBarTitleText":"使用授权","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/address/address","meta":{},"window":{"navigationBarTitleText":"地址管理","enablePullDownRefresh":false}},{"path":"/pages/address/receive","meta":{},"window":{"navigationBarTitleText":"收件地址","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/address/edit/edit","meta":{},"window":{"navigationBarTitleText":"编辑地址","enablePullDownRefresh":false}},{"path":"/pages/address/picking","meta":{},"window":{"navigationBarTitleText":"哪里购买","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/my/coupon","meta":{},"window":{"navigationBarTitleText":"优惠券","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/webView/index","meta":{},"window":{"navigationBarTitleText":"协议政策","enablePullDownRefresh":false}},{"path":"/pages/message/message","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom","enablePullDownRefresh":false}},{"path":"/pages/message/infoList","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom","enablePullDownRefresh":false,"disableScroll":true}},{"path":"/pages/goods/goods","meta":{},"window":{"navigationBarTitleText":"商品","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/boxManage/bindCoupon","meta":{},"window":{"navigationBarTitleText":"绑定成功","navigationStyle":"custom","enablePullDownRefresh":false}},{"path":"/pages/home/search","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/modal/modal","meta":{},"window":{"navigationStyle":"custom","animationType":"fade-in","background":"transparent","backgroundColor":"rgba(0,0,0,0)","webviewBGTransparent":true,"mask":"none"}},{"path":"/pages/goods/changeLink","meta":{},"window":{"navigationBarTitleText":"转链"}},{"path":"/pages/order/writeCode","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pages/login/bindPhone","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pages/shopping/index","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pages/shopping/buyVegetables","meta":{},"window":{"navigationBarTitleText":"买菜"}},{"path":"/pages/shopping/buyIndex","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"买东西","navigationStyle":"custom","enablePullDownRefresh":true}},{"path":"/pages/shopping/buyWeb","meta":{},"window":{"navigationBarTitleText":"买东西","navigationStyle":"custom","enablePullDownRefresh":true}},{"path":"/pages/phoneBill/index","meta":{},"window":{"navigationBarTitleText":"","navigationStyle":"custom"}},{"path":"/pages/phoneBill/record","meta":{},"window":{"navigationBarTitleText":"充值记录"}},{"path":"/pages/recharge/phone","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"话费充值","navigationStyle":"custom","enablePullDownRefresh":false,"bounce":"none"}},{"path":"/pages/bindCommunit/bindCommunit","meta":{},"window":{"navigationBarTitleText":"绑定小区","enablePullDownRefresh":false,"navigationStyle":"custom"}},{"path":"/pages/bindCommunit/selectCity","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}},{"path":"/pages/address/edit/editReceive","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
