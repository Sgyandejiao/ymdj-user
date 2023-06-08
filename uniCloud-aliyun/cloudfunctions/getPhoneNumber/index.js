'use strict';
exports.main = async (event, context) => {
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__8BF038B', // 在manifest.json里面可以找到
		provider: 'univerify',
		apiKey: 'b4da3337dfb99c6d2fc4a136412910dd', // 在DCloud开发者中心开通一键登录基础服务时自动生成的
		apiSecret: '7cb6997bae1928c347ad2d24dda7ec4b', // 开通一键登录基础服务时自动生成的
		access_token: event.access_token,
		openid: event.openid
	});
	console.log(res, "云函数回调res"); // res里的数据格式	{ code: 0, success: true, phoneNumber: '186*****078' }
	return {
		code: 0,
		data: res,
		message: '获取手机号成功'
	}

};
