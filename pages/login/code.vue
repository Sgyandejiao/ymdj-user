<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="false" @leftClick="backHome">
			<!-- <view class="u-nav-slot" slot="left">
				
			</view> -->
		</u-navbar>
		<view class="top_title">欢迎登录一秒到家</view>
		<view class="tips">未注册的手机号验证通过后将自动注册</view>
		<view class="phone_v dis al_c">
			<view>+86</view>
			<input type="number" v-model="phone" maxlength="11" placeholder="请输入手机号码" placeholder-style="color:#CCCCCC"
				@input="inputChange" />
		</view>
		<view class="phone-code dis al_c">
			<input type="number" v-model="code" maxlength="4" placeholder="请输入验证码" placeholder-style="color:#CCCCCC"
				@input="inputChange">
			<view class="text" @click="sendCode" v-if="isCanGet">获取验证码</view>
			<view class="text dis al_c" style=" color: #30303C;" @click="sendCode" v-else>
				<u-count-down :time="60*1000" format="ss" @finish="finish" @change="onChange">
					<view class="time">
						<view class="time__custom">
							<text class="time__custom__item">{{ timeData.seconds }}</text>
						</view>
					</view>
				</u-count-down>秒后可重试
			</view>
		</view>

		<div class="send_btn" @click="initLogin" v-if="!isDisabled&&isCanSubmit">登录</div>
		<div class="send_btn disabled" v-else>登录</div>
		<div class="tips dis al_c" style="margin: 52rpx 0 0 0" @click="radioChange">
			<radio-group>
				<label class="radio">
					<radio value="1" color="#F44850" style="transform:scale(0.8)" :checked="checkBox" />
				</label>
			</radio-group>
			<div class="check_text">我已阅读并同意 <span @click.stop="toAgreement('用户协议')">《用户协议》</span>与<span
					@click.stop="toAgreement('隐私政策')">《隐私政策》</span></div>
		</div>
		<view class="divider" v-if="!isShenhe">
			<u-divider text="or"></u-divider>
		</view>
		<view class="bottom-icon dis al_c" v-if="!isShenhe">
			<image src="/static/icon/login/phone.png" mode="widthFix" @click.stop="oneLogin()"></image>
			<image src="/static/icon/login/weixin.png" mode="widthFix" @click.stop="weixinLogin(1)"></image>
		</view>
		<u-modal :show="showModel" :title="modelTitle" :showCancelButton="false" :closeOnClickOverlay="false"
			:content='modelContent' @confirm="confirmModel"></u-modal>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	import VcodeInput from '@/components/vcode-input/vcode-input'
	import encrypt from '@/libs/encrypt.js'
	import keyboard from '@/components/keyboard/keyboard.vue'
	import mixin from '@/common/mixin.js'
	const univerifyManager = uni.getUniverifyManager()
	import {
		createCode,
		analysisCode
	} from '@/static/utils/jsencryptKey.js'
	export default {
		mixins: [mixin], //混入文件
		components: {
			VcodeInput,
			headBgImg,
			keyboard
		},
		data() {
			return {
				isCanGet: true,
				checkBox: false,
				phone: '',
				showCodeInput: false,
				seconds: 60,
				tips: '',
				publicKeyObj: {},
				resultKey: '',
				code: '',
				isDisabled: false,
				isGetVersion: 0,
				isConfrim: false,
				timeData: {},
				isCanSubmit: false,
				operatorName: '',
				isShenhe: true,
				modelTitle: '提示',
				modelContent: '发现新版本',
				showModel: false,
				oneLoginType: true,
				downLoadUrl: ''
			};
		},
		onLoad() {
			if (plus.os.name == 'Android') {
				// let operatorName = this.$getSimOperatorName()
				// this.operatorName = operatorName
			}
			uni.getNetworkType({
				success: (res) => {
					if (res.networkType == 'none') {
						this.oneLogin()
					} else {
						this.checkVersion()
					}
				},
				fail() {
					this.oneLogin()
				}
			})

		},
		onShow() {
			uni.$on("oneLoginEvent", async (res) => {
				console.log('监听一键登录回调', res); //我是全局事件订阅的调用方法
				uni.$off('oneLoginEvent')
				if (res == 1) {
					// 一键登录成功
					univerifyManager.close()
					// 取消订阅自定义按钮点击事件
					univerifyManager.offButtonsClick()
					// uni.closeAuthView()
					uni.switchTab({
						url: '/pages/home/index'
					})
					// uni.navigateBack()
				} else {
					setTimeout(() => {
						// 一键登录成功
						univerifyManager.close()
						// 取消订阅自定义按钮点击事件
						univerifyManager.offButtonsClick()
					}, 1000)
				}
			})

		},
		onUnload() {
			uni.$off('oneLoginEvent')
			// 取消订阅自定义按钮点击事件
			univerifyManager.offButtonsClick()
			// uni.switchTab({
			// 	url: '/pages/home/index'
			// })
		},
		methods: {
			
			backHome() {
				// uni.switchTab({
				// 	url: '/pages/home/index'
				// })
				if (uni.getStorageSync('lastPage') == 0) {
					uni.switchTab({
						url: '/pages/home/index'
					})
				} else if (uni.getStorageSync('lastPage') == 2) {
					uni.switchTab({
						url: '/pages/shopping/index'
					})
				} else{
					uni.navigateBack()
				}
			},
			onChange(e) {
				this.timeData = e
			},
			finish() {
				// console.log('倒计时结束')
				this.isCanGet = true
			},
			inputChange() {
				if (this.phone != '' && this.code != '') {
					this.isCanSubmit = true
				} else {
					this.isCanSubmit = false
				}
			},
			backspace() {
				let {
					code
				} = this
				this.code = code.substring(0, code.length - 1)
			},
			keyChange(val) {
				// console.log(val)
				if (this.code.length < 4) {
					this.code += val;
				}
			},
			radioChange() {
				this.checkBox = this.checkBox ? false : true
			},
			confirmPop() {

			},
			init() {
				plus.nativeUI.showWaiting()
				this.$util.request(this.$apis.getPublicKey).then(res => {
					// console.log('init', res)
					if (!res.status) {
						plus.nativeUI.closeWaiting()
						this.$toast(res.statusMessage)
						return;
					}
					const keyCode = res.resultValue
					const key = this.getDateInfo()
					// console.log('dateStr=', key)
					const a = encrypt.decryptByDES(keyCode, key)
					// console.log('encrypt=', a)
					this.publicKeyObj = JSON.parse(a)

					this.encryptKeyDo()
				})
			},
			getDateInfo() {
				let time = new Date()
				// console.log('time=', time)
				let year = time.getUTCFullYear()
				let month = time.getUTCMonth() + 1
				let day = time.getUTCDate()
				let hour = time.getUTCHours()
				if ((Number(hour) + 8) > 23) {
					day += 1
					let maxDay = this.get_month_days(month, year)
					// console.log('当月最大天数', maxDay)
					if (day > maxDay) {
						month += 1
						day = 1
						if (month > 12) {
							month = 1
						}
					}
				}
				day = day >= 10 ? day : '0' + day
				let monthStr = month >= 10 ? month : '0' + month
				let resultStr = `fssh${monthStr}${day}`
				console.log('time1=', resultStr)
				return resultStr
			},
			get_month_days(nowMonth, nowYear) {
				let month_arr = [1, 3, 5, 7, 8, 10, 12];
				let days = 0;
				if (nowMonth == 2) {
					if (nowYear % 4 == 0) {
						days = 29;
					} else {
						days = 28;
					}
				} else if (month_arr.indexOf(nowMonth) >= 0) {
					days = 31;
				} else {
					days = 30;
				}
				return days;
			},
			encryptKeyDo() {
				const {
					keyId,
					publicKey
				} = this.publicKeyObj
				const dataStr = createCode(publicKey)
				const opt = {
					keyId: keyId,
					data: dataStr
				}
				this.$util.request(this.$apis.getEncryptKey, opt, 'POST').then(res => {
					console.log('获取密钥key', res)
					plus.nativeUI.showWaiting()
					if (res.status) {
						const resultKey = analysisCode(res.resultValue)
						this.resultKey = resultKey
						setTimeout(() => {
							this.confirmLogin()
						}, 100)
					} else {

						this.$toast('获取登录信息失败，请重试')
					}
				})
			},
			codeChange(text) {
				this.tips = text;

			},
			sendCode() {
				if (!this.checkBox) {
					this.$toast('请阅读并同意用户协议及隐私政策内容')
					return;
				}
				if (this.isConfrim) {
					return;
				}
				// -------------模拟验证
				// this.$toast('发送验证码成功，1分钟后可重新获取')
				// this.isCanGet = false
				// return;
				// --------------end

				plus.nativeUI.showWaiting('发送验证码中...')

				this.isDisabled = true

				let {
					publicKeyObj,
					resultKey,
					phone
				} = this

				let data = {
					isWechat: 0,
					mobile: phone,
					systemCode: 'YMDJ_USER'
				}
				this.$util.request(this.$apis.sendCode, data, 'POST').then(res => {
					console.log('发送验证码', res)
					plus.nativeUI.closeWaiting()
					this.isDisabled = false
					if (res.status) {
						plus.nativeUI.toast('验证码已发送')
						this.isCanGet = false
					} else {
						this.$toast(res.statusMessage)
						this.isCanGet = true
					}
				})

			},
			end() {


			},
			start() {
				// uni.$u.toast('验证码已发送');
			},
			cancelPop() {
				this.$refs.popup.close()
			},
			initLogin() {
				if (!this.checkBox) {
					this.$toast('请阅读并同意用户协议及隐私政策内容')
					return;
				}
				this.init()
			},
			confirmLogin() {
				if (this.isConfrim) {
					return;
				}
				let {
					publicKeyObj,
					resultKey,
					phone,
					code
				} = this

				let data =
					`systemCode=YMDJ_USER&mobile=${phone}&password=${code}&logOnType=1&systemVersion=1.0.0&clientOs=Android&autoRegister=0`
				console.log('入参字符串', data)
				let resultData = encrypt.encryptByDES(data, resultKey)
				let opt = {
					data: resultData,
					keyId: publicKeyObj.keyId
				}
				// console.log('登录入参', opt)
				this.isConfrim = true

				plus.nativeUI.showWaiting('登录中...')
				this.$util.request(this.$apis.appLogin, opt, 'POST').then(res => {
					console.log('登录', res)
					plus.nativeUI.closeWaiting()

					if (res.status) {
						let ftoken = JSON.parse(encrypt.decryptByDES(res.resultValue, resultKey));
						console.log('ftoken=', ftoken)
						uni.setStorageSync('ftoken', ftoken.token)
						uni.setStorageSync('phone', phone)
						// console.log('ftoken===', uni.getStorageSync('ftoken'))
						plus.nativeUI.toast('登录成功')
						setTimeout(r => {
							this.getInfo()
							uni.switchTab({
								url: '/pages/home/index'
							})
						}, 800)
					} else {
						this.$toast(res.statusMessage)
						this.isConfrim = false
					}
				})
				this.$refs.popup.close()
			},
			getInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					// console.log('用户信息', res)
					if (res.status) {
						this.bindGeTui(res.data.userId)
					}
				})
			},
			bindGeTui(userid) {
				// 个推绑定别名
				// #ifdef APP-PLUS

				let reg1 = new RegExp("-", "g");
				let newUserId = userid.replace(reg1, "")

				let alias = 'U_' + newUserId
				console.log('alias=', alias)
				uni.setStorageSync('alias', alias)
				if (plus.os.name == 'Android') {
					// console.log('if (plus.os.name')
					let PushManager = plus.android.importClass("com.igexin.sdk.PushManager");
					// console.log('let PushManager', PushManager)
					let context = plus.android.runtimeMainActivity().getContext();
					// console.log('let context =', context)
					let Instance = PushManager.getInstance();
					// console.log('let Instance ', Instance)
					// var info = plus.push.getClientInfo();
					// console.log('绑定cid==', info.clientid)
					Instance.bindAlias(context, alias);
				} else {
					let GeTuiSdk
					GeTuiSdk = plus.ios.importClass("GeTuiSdk");
					// console.log('GeTuiSdk = ')
					GeTuiSdk.bindAliasandSequenceNum(alias, alias);
					// GeTuiSdk.setTags(tags);

				}

				// #endif 
			},
			weixinLogin(type) {
				if (type) {
					if (!this.checkBox) {
						this.$toast('请阅读并同意用户协议及隐私政策内容')
						return;
					}
					this.weiLogin()
					return;
				}
				uni.getCheckBoxState({
					success: (res) => {
						console.log('是否勾选隐私', res.state)
						if (!res.state) {
							this.$toast('请先阅读并勾选隐私政策弹框')
							return;
						}
						univerifyManager.close()
						this.oneLoginType = false
						this.weiLogin()

					},
					fail(res) {
						console.log(res.errCode)
						console.log(res.errMsg)
					}
				})

			},
			weiLogin() {
				uni.login({
					provider: "weixin",
					onlyAuthorize: true,
					success: (event) => {
						console.log('event', event)
						const {
							code
						} = event
						this.$util.request(this.$apis.isBindWechat, {
							code
						}).then(r => {
							console.log('是否绑定Weixin', r)
							if (r.status) {
								if (!r.data.blinded) {
									console.log('-----')
									plus.nativeUI.closeWaiting()
									univerifyManager.close()
									uni.navigateTo({
										url: '/pages/login/bindPhone?openId=' +
											r.data.openid
									})
								} else {
									// 微信已绑定手机号 可以登录
									this.initKey(r.data.openid, 2)
								}
							}
						})
					},
					fail: (err) => {
						console.log('err', err)
					}
				})
			},
			// 一键登录
			oneLogin() {
				this.oneLoginType = true
				let btnList = []
				if (this.isShenhe && plus.os.name == 'iOS') {
					btnList = [{
						"provider": "apple",
						"iconPath": "/static/icon/login/phone.png" // 图标路径仅支持本地图片
					}]
				} else {
					btnList = [{
							"iconPath": "/static/icon/login/phone.png" // 图标路径仅支持本地图片
						},
						{
							"iconPath": "/static/icon/login/weixin.png" // 图标路径仅支持本地图片
						}
					]
				}
				univerifyManager.preLogin({
					provider: 'univerify',
					success: (res) => {
						console.log('预登录成功', res)
						univerifyManager.login({
							provider: 'univerify',
							univerifyStyle: { // 自定义登录框样式
								//参考`univerifyStyle 数据结构`
								"fullScreen": true, // 是否全屏显示，默认值： false
								"backgroundColor": "#F4F4F4", // 授权页面背景颜色，默认值：#ffffff
								"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）  
								"icon": {
									"path": "" // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
								},
								"closeIcon": {
									"path": "static/xxx.png" // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
								},
								"phoneNum": {
									"color": "#333333", // 手机号文字颜色 默认值：#202020 
									"fontSize": "18px"
								},
								"slogan": {
									"color": "#BBBBBB" //  slogan 字体颜色 默认值：#BBBBBB  
								},
								"authButton": {
									"normalColor": "#FF4E8C", // 授权按钮正常状态背景颜色 默认值：#3479f5  
									"highlightColor": "#FF4E8C", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
									"disabledColor": "#FF4E8C", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
									"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff  
									"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”  
									"borderRadius": "24px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
								},
								"otherLoginButton": {
									"visible": false, // 是否显示其他登录按钮，默认值：true  
									"normalColor": "", // 其他登录按钮正常状态背景颜色 默认值：透明 
									"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明 
									"textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565  
									"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”  
									"borderColor": "", //边框颜色 默认值：透明（仅iOS支持）  
									"borderRadius": "0px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
								},
								"privacyTerms": {
									"defaultCheckBoxState": false, // 条款勾选框初始状态 默认值： true
									"uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
									"checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
									"checkBoxSize": 16, // 可选 条款勾选框大小，仅android支持
									"textColor": "#333333", // 文字颜色 默认值：#BBBBBB  
									"termsColor": "#F44850", //  协议文字颜色 默认值： #5496E3  
									"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
									"suffix": "", // 条款后的文案 默认值：“并使用本机号码登录”  
									"privacyItems": [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效  
										{
											"url": "https://protocol.yimiaodaojia.com/YmdjUserPrivacy.html", // 点击跳转的协议详情页面  
											"title": "《用户服务协议》" // 协议名称  
										},
										{
											"url": "https://protocol.yimiaodaojia.com/YmdjPrivacy.html", // 点击跳转的协议详情页面
											"title": "《隐私政策》" // 协议名称  
										}
									]
								},
								"buttons": { // 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
									"iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
									"list": btnList
								}
							},
							success: (res) => { // 登录成功
								console.log(res); // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
								uniCloud.callFunction({
									name: 'getPhoneNumber', // 你的云函数名称
									data: {
										'access_token': res.authResult
											.access_token, // 客户端一键登录接口返回的access_token
										'openid': res.authResult
											.openid // 客户端一键登录接口返回的openid
									}
								}).then(r => {
									console.log('云函数获取手机号回调', r)
									this.initKey(r.result.data.phoneNumber)
								}).catch(err => {
									console.log('catch', err)
								})
							},
							fail(err) { // 登录失败
								console.log('login-err', err)
								uni.$off('oneLoginEvent')
								// 取消订阅自定义按钮点击事件
								univerifyManager.offButtonsClick()
							}
						})
					},
					fail(err) {
						console.log('预登录失败', err)
						plus.nativeUI.toast('一键登录失败,请检查SIM卡网络')
						return;
					},
					complete() {
						console.log('预登录结束')
					}
				})
				univerifyManager.onButtonsClick((res) => {
					console.log('自定义按钮', res)
					// 关闭一键登录
					if (res.index == 0) {
						// 短信验证登录
						univerifyManager.close()
						if (this.$apis.env != 'dev') {
							this.oneLoginType = false
						}
					} else {
						// 微信登录
						this.weixinLogin()
					}
				})

			},
			// 用户输入的值
			vcodeInput(val) {
				// console.log(val);
				this.code = val
			},
			// 控制组件获取焦点
			setFocus() {
				this.$refs.VcodeInput.setFocus();
			},
			// 控制组件失去焦点
			setBlur() {
				this.$refs.VcodeInput.setBlur();
			},
			// 清除已输入
			clearValue() {
				this.$refs.VcodeInput.clearValue();
			},
			getBack() {
				uni.navigateBack()
			},
			toAgreement(title) {
				uni.navigateTo({
					url: '/pages/webView/index?title=' + title
				})
			},
			// isShow 是否自动检测版本
			checkVersion() {
				this.$util.request(this.$apis.lastVersion, {
					systemCode: 'YMDJ_USER'
				}).then(resault => {
					// console.log('版本内容', resault)
					plus.runtime.getProperty(plus.runtime.appid, (inf) => {
						if (plus.os.name == 'iOS') {
							// console.log('最新版本', resault.data.enabledVersion)
							// console.log('本地版本', inf.version)
							if (inf.version == resault.data.enabledVersion || resault.data
								.appleStoreStatus == 1) { // 本地版本为可用版本或非审核中
								this.isShenhe = false //规避审核内容(未审核，开放)
								uni.setStorageSync('isShenhe', 0)
								// console.log('已开放规避')
								this.oneLogin()
							}
						}else{
							uni.setStorageSync('isShenhe', 0)
							this.oneLogin()
						}
					});
				})
			},
			confirmModel() {
				// this.doUpData(this.downLoadUrl);
				// 跳转安卓应用市场更新
				let appurl = "market://details?id=uni.UNI8BF038B" //这个是通用应用市场，如果想指定某个应用商店，需要单独查这个应用商店的包名或scheme及参数
				plus.runtime.openURL(appurl)
			},

		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		background-color: #f0f0f0;
	}

	.top_title {
		width: 654rpx;
		font-size: 44rpx;
		color: #333;
		margin: 92rpx 0 0 0;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
	}

	.tips {
		width: 654rpx;
		font-size: 24rpx;
		font-family: PingFang SC-常规体, PingFang SC;
		font-weight: normal;
		color: #666666;
		margin: 24rpx 0 60rpx 0;

	}

	.phone_v {
		width: 654rpx;
		height: 112rpx;
		// background: #FFFFFF;
		// border-radius: 100rpx;
		border-bottom: 1rpx solid #D6D6D6;

		view {
			width: 78rpx;
			height: 30rpx;
			line-height: 30rpx;
			border-right: 1rpx solid #30303C;
			// text-align: center;
			font-size: 32rpx;
			color: #333;
		}

		input {
			width: 500rpx;
			height: 100%;
			padding-left: 30rpx;
			font-size: 32rpx;
			color: #333;

		}
	}

	.phone-code {
		width: 654rpx;
		height: 132rpx;
		border-bottom: 1rpx solid #D6D6D6;
		justify-content: space-between;

		input {
			width: 430rpx;
			font-size: 32rpx;
			font-family: PingFang SC-常规体, PingFang SC;
			font-weight: normal;
			color: #333;
		}

		.text {
			border-left: 1rpx solid #eee;
			padding-left: 20rpx;
			box-sizing: border-box;
			color: red;
			font-size: 32rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #30303C;
		}
	}

	.divider {
		width: 686rpx;
		margin-top: 354rpx;
	}

	// .tips {
	// 	font-size: 26rpx;
	// 	color: darkgray;

	// 	text {
	// 		color: #333;
	// 	}

	// 	margin-top:24rpx;
	// }
	.bottom-icon {
		width: 750rpx;
		margin-top: 32rpx;
		justify-content: center;

		image {
			width: 86rpx;
			width: 86rpx;
			margin: 0 64rpx;
		}
	}

	.send_btn {
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(270deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 72rpx;
		border-radius: 50rpx;
		// opacity: 0.5;

	}

	.pop_v {
		width: 640rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin: 0 0 55rpx 55rpx;

		.title {
			font-size: 34rpx;
			color: #000000;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			margin: 50rpx 0 52rpx 0;
		}

		.sub_title {
			margin-bottom: 50rpx;
			font-size: 28rpx;
			color: #666666;

			view {
				color: #000000;
			}
		}

		.btn_v {
			width: 100%;
			height: 100rpx;
			border-top: 1rpx solid #eee;
			margin-top: 80rpx;

			.cancel {
				width: 49%;
				height: 100%;
				line-height: 100rpx;
				color: #333;
				text-align: center;
				border-right: 1rpx solid #eee;
			}

			.confirm {
				width: 50%;
				height: 100%;
				line-height: 100rpx;
				color: #F44850;
				text-align: center;
			}
		}

	}

	.check_text {
		height: 30rpx;
		line-height: 30rpx;
		margin: 0 0 0 12rpx;
		font-size: 28rpx;
		color: #333;

		span {
			color: #F44850;
		}
	}

	.disabled {
		opacity: 0.5;
	}
</style>