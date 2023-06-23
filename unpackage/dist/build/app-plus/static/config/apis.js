let env = 'dev'
// let env = 'pro'

let isChannel = 1 // 渠道包（审核使用）
// let isChannel = 0 // 非渠道包（服务器使用）

const apiUrl = env == 'pro' ? 'https://gateway.fanssh.com' : 'https://gateway-test.fanssh.com'
const webUrl = env == 'pro' ? 'https://cms-app.fanssh.com' : 'https://192.168.1.167:8080'

const upImgUrl = env == 'pro' ? 'https://img.fanssh.com' : 'https://imgtest.fanssh.com'
const appSecret = env == 'pro' ? '7939319066d5411ca7c1fc687b13ccd9' : '1da7d942afc24d7db9fccca0d9121b30'
const bucket = env == 'pro' ? 'fsshimg' : 'fsshimgtest'
module.exports = {
	env,
	isChannel,
	appSecret,
	apiUrl,
	webUrl,
	upImgUrl,
	getLogin: apiUrl + '/cms-service/staff-repair/staff-login', //登录
	// getPublicKey: apiUrl + '/cms-service/encrypt/publicKey', //加密第一步
	// getEncryptKey: apiUrl + '/cms-service/encrypt/encryptKey', //加密第二部
	lastVersion: apiUrl + '/fanslife-user-service/version/last', // 最新版本信息
	appLogin: apiUrl + '/user-service/login/appLogin', // 验证码登录
	registerUser: apiUrl + '/ymdj-user-service/ymdjUser/registerUser', // 验证码注册
	getUserType: apiUrl + '/ymdj-app-service/bussinessType/getUserType', // 获取人员类型系统编号
	sendCode: apiUrl + '/user-service/validationCode/send', //发送短信验证码
	isBindWechat: apiUrl + '/ymdj-user-service/ymdjUser/isBindWechat', //微信是否绑定用户
	bindWechat: apiUrl + '/ymdj-user-service/ymdjUser/bindWechat', //账号绑定微信
	isMobileBindWechat: apiUrl + '/ymdj-user-service/ymdjUser/isMobileBindWechat', //手机号是否已经绑定过微信
	getPublicKey: apiUrl + '/user-service/encrypt/publicKey', //加密第一步
	getEncryptKey: apiUrl + '/user-service/encrypt/encryptKey', //加密第二部
	isCompleteInfo: apiUrl + '/ymdj-app-service/bussinessType/isCompleteInfo', //判断服务人员信息是否完善
	// getUserInfo: apiUrl + '/ymdj-user-service/ymdjBussinessUser/getUserInfo', // 一秒到家用户信息通过手机号
	uploadImg: apiUrl + '/image-service/image/upload/' + bucket, // 图片上传
	completeInfo: apiUrl + '/ymdj-user-service/ymdjBussinessUser/completeInfo', // 完善一秒到家管家信息
	completeInfoPT: apiUrl + '/ymdj-user-service/ymdjErrandUser/completeInfo', // 完善一秒到家跑腿人员信息
	getExpenseSetting: apiUrl + '/ymdj-app-service/bussinessExpenseSetting/getExpenseSetting', // 获取小区收费配置信息
	getUserList: apiUrl + '/ymdj-app-service/bussinessUser/getUserList', // 管家查看当前小区的用户列表
	getDeviceList: apiUrl + '/ymdj-app-service/bussinessUser/getDeviceList', // 查看当前小区的设备列表
	addDevice: apiUrl + '/ymdj-app-service/device/addDevice', // 管家添加小区设备
	bindAccount: apiUrl + '/ymdj-user-service/ymdjBussinessUser/bindAccount', // 管家绑定支付宝账户
	getShopList: apiUrl + '/ymdj-app-service/communityShop/getShopList', // 获取店铺列表
	addShop: apiUrl + '/ymdj-app-service/communityShop/addShop', // 管家添加店铺
	// getDeviceAuthStatus: apiUrl + '/ymdj-app-service/bussinessUser/getDeviceAuthStatus', // 服务人员（管家、跑腿）获取设备操作状态
	setExpenseSetting: apiUrl + '/ymdj-app-service/bussinessExpenseSetting/setExpenseSetting', // 设置小区收费配置信息
	getBussinessHomeData: apiUrl + '/ymdj-app-service/homeData/getBussinessHomeData', // 用户绑定设备
	deleteDeviceByUser: apiUrl + '/ymdj-app-service/user/deleteDeviceByUser', // 用户移除绑定设备
	getAdSpaceAd: apiUrl + '/fanslife-user-service/ad/getAdSpaceAd', // 获取广告位广告

	
	// 消息
	messageInformType:apiUrl + '/ymdj-app-service/messageInform/messageInformType', // 收到的消息通知类型列表
	messageInformList:apiUrl + '/ymdj-app-service/messageInform/messageInformList', // 一秒到家消息通知表列表
	readAll:apiUrl + '/ymdj-app-service/messageInform/readAll', // 全部已读
	messageDelete:apiUrl + '/ymdj-app-service/MessageInform/delete/', // 删除
	messageUnread:apiUrl + '/ymdj-app-service/messageInform/unread', // 未读数


	// 用户部分
	getUserInfo: apiUrl + '/ymdj-user-service/ymdjUser/getUserInfo', // 一秒到家用户信息获取
	BindDeviceByUser: apiUrl + '/ymdj-app-service/user/BindDeviceByUser', // 一秒到家用户信息获取
	getUserBindDevice: apiUrl + '/ymdj-app-service/user/getUserBindDevice', // 用户首页绑定设备信息状态获取
	getDeviceList: apiUrl + '/ymdj-app-service/user/getDeviceList', // 用户查看已经绑定的设备列表
	addAuthInfo: apiUrl + '/ymdj-app-service/userAuth/addAuthInfo', // 用户添加设备授权
	getAuthList: apiUrl + '/ymdj-app-service/userAuth/getAuthList', // 获取用户设备授权列表
	getDeviceAuthStatus: apiUrl + '/ymdj-app-service/user/getDeviceAuthStatus', // 用户获取设备操作状态
	userAddress: apiUrl + '/ymdj-app-service/userAddress/getAddressList', // 获取用户地址列表
	getExpense: apiUrl + '/ymdj-app-service/order/getExpense', // 获取代取商品的订单价格
	getWeightEnum: apiUrl + '/ymdj-app-service/order/getWeightEnum', // 获取重量区间设置
	getCommunitySetting: apiUrl + '/ymdj-app-service/order/getCommunitySetting', //获取小区相关配置
	placeExpressOrder: apiUrl + '/ymdj-app-service/order/placeExpressOrder', 		 	// 用户下单(代取快递-二期)
	placeAnOrder: apiUrl + '/ymdj-app-service/order/placeAnOrder', 		 	// 用户下单(代取快递外卖)
	bugGoodsAnOrder: apiUrl + '/ymdj-app-service/order/bugGoodsAnOrder', 	// 用户下单(代购商品)
	agentAnythingOrder: apiUrl + '/ymdj-app-service/order/agentAnythingOrder', // 用户下单（万能帮）
	deliveryExpressOrder: apiUrl + '/ymdj-app-service/order/deliveryExpressOrder', // 用户下单（代寄快递）
	// getReceiveAddressList: apiUrl + '/ymdj-app-service/order/getReceiveAddressList', // 获取用户收件地址列表
	getReceiveAddressList: apiUrl + '/ymdj-app-service/user/getUserAddress', // 获取用户收件地址列表新
	getPickupAddressList: apiUrl + '/ymdj-app-service/order/getPickupAddressList', // 获取用户取件地址列表（管家维护的周边设施列表）
	getCouponList: apiUrl + '/ymdj-app-service/userCoupon/getCouponList', // 获取优惠券列表
	getUserOrderList: apiUrl + '/ymdj-app-service/order/getUserOrderList', // 用户查看订单列表
	getOrderDetail: apiUrl + '/ymdj-app-service/order/getOrderDetailByUser', // 管家查看订单详情
	addAddress: apiUrl + '/ymdj-app-service/userAddress/addAddress', // 添加用户地址
	// getDeviceBindStatus: apiUrl + '/ymdj-app-service/userAddress/getAddressList', // 获取用户地址列表
	cancelOrder: apiUrl + '/ymdj-app-service/order/cancelOrder', // 用户取消订单
	repalacementPay: apiUrl + '/ymdj-app-service/order/repalacementPay', // 用户补单支付
	operate: apiUrl + '/ymdj-app-service/deviceOperateRecord/operate', // 增加设备使用记录
	deviceOperateRecord_list: apiUrl + '/ymdj-app-service/deviceOperateRecord/list', // 设备使用记录
	getTypeSetting: apiUrl + '/ymdj-app-service/order/getTypeSetting', // 万能帮相关类型
	ymdjAdvertisement: apiUrl + '/ymdj-app-service/common/ymdjAdvertisement', // 获取开锁广告图地址
	getUserStatus: apiUrl + '/ymdj-app-service/common/getUserStatus', // 获取用户状态 (是否绑定设备/小区)
	// getCommunityList: apiUrl + '/ymdj-app-service/user/getCommunityList', // 获取可以绑定的小区列表
	getCommunityData: apiUrl + '/ymdj-app-service/common/getCommunityData', // 获取可以绑定的小区列表
	validateIsBind: apiUrl + '/ymdj-app-service/user/validateIsBind', // 获取可以绑定的小区列表
	bindCommunity: apiUrl + '/ymdj-app-service/user/bindCommunity', // 用户绑定小区
	BindDeviceValidation: apiUrl + '/ymdj-app-service/user/BindDeviceValidation', // 用户绑定设备校验
	editUserAddress: apiUrl + '/ymdj-app-service/user/editUserAddress', // 编辑用户收件地址
	
	


	// 淘京拼接口
	generatePddPromUrl: apiUrl + '/recharge-service/api/welfare/generatePddPromUrl', // 生成拼多多授权链接
	queryPddMemberAuthority: apiUrl + '/recharge-service/api/welfare/queryPddMemberAuthority', // 查询拼多多是否授权
	getProductCategory: apiUrl + '/ymdj-app-service/api/index/getProductCategory', // 类目
	itemList: apiUrl + '/ymdj-app-service/api/index/itemList', // 获取商品列表
	deleteAuthInfo: apiUrl + '/ymdj-app-service/userAuth/deleteAuthInfo', // 删除用户授权信息
	taobaoAuthorize: apiUrl + '/ymdj-app-service/api/index/taobaoAuthorize', // 淘宝授权
	pddAuthorize: apiUrl + '/ymdj-app-service/api/index/pddAuthorize', // 拼多多授权
	postHighComission: apiUrl + '/ymdj-app-service/api/index/postHighComission', // 淘京拼转链高佣转链接口
	getThirdOrderList: apiUrl + '/ymdj-app-service/order/getThirdOrderList', // 用户查询淘京拼订单列表
	getActivityUrl: apiUrl + '/ymdj-app-service/api/index/getActivityUrl', // 获取活动链接 (饿了么（elem）,美团（meituan）)
	superSearch: apiUrl + '/ymdj-app-service/api/index/superSearch', // 商品超级搜索

	
	// 话费充值接口
	getMetadata: apiUrl + '/ymdj-app-service/mobileRecharge/getMetadata', // 获取充值配置数据
	phoneOrderSubmit: apiUrl + '/ymdj-app-service/mobileRecharge/orderSubmit', // 话费订单提交
	getRechargeOrderList: apiUrl + '/ymdj-app-service/mobileRecharge/getRechargeOrderList', // 话费充值记录获取
	rechargeOrderPay: apiUrl + '/ymdj-app-service/mobileRecharge/rechargeOrderPay', // 话费订单支付
	rechargeCancleOrder: apiUrl + '/ymdj-app-service/mobileRecharge/rechargeCancleOrder', // 话费订单取消
	
	//设备类型
	getDeviceType: apiUrl + '/ymdj-app-service/common/getDeviceType', // 获取小区设备类型

}
