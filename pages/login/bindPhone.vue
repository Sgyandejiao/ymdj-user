<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
		</u-navbar>
		<view class="top_title">绑定手机号</view>
		<view class="tips"></view>
		<view class="phone_v dis al_c">
			<view>+86</view>
			<input type="number" v-model="phone" maxlength="11" placeholder="请输入手机号码" placeholder-style="color:#CCCCCC"
				@input="inputChange" />
		</view>
		<view class="phone-code dis al_c">
			<input type="number" v-model="code" placeholder="请输入验证码" placeholder-style="color:#CCCCCC"
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
		<div class="send_btn" @click="confirmLogin" v-if="!isDisabled&&isCanSubmit">立即绑定</div>
		<div class="send_btn disabled" v-else>立即绑定</div>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	import encrypt from '@/libs/encrypt.js'
	import keyboard from '@/components/keyboard/keyboard.vue'
	import mixin from '@/common/mixin.js'
	import {
		createCode,
		analysisCode
	} from '@/static/utils/jsencryptKey.js'
	export default {
		mixins: [mixin], //混入文件
		components: {
			headBgImg,
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
			};
		},
		onLoad(opt) {
			this.openId = opt.openId
		},
		onShow() {

		},
		onUnload() {
		},
		methods: {
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
			confirmPop() {

			},
			init() {
				this.$util.request(this.$apis.getPublicKey).then(res => {
					// console.log('init', res)
					if (!res.status) {
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
				// console.log('time1=', resultStr)
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
					if (res.status) {
						const resultKey = analysisCode(res.resultValue)
						this.resultKey = resultKey
					}
				})
			},
			codeChange(text) {
				this.tips = text;

			},
			sendCode() {
				// // -------------模拟验证
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
			confirmLogin() {
				this.init()
				if (this.isConfrim) {
					return;
				}
				this.$util.request(this.$apis.isMobileBindWechat,{mobile:this.phone}).then(r=>{
					console.log('账号是否绑定微信',r)
					if(r.status){
						let data = {
							mobile:this.phone,
							openid:this.openId,
							validationCode:this.code
						}
						console.log('账号绑定微信入参',data)
						this.$util.request(this.$apis.bindWechat,data,'POST').then(r=>{
							if(r.status){
								this.initKey(this.openId,2)
							}else{
								this.$toast(r.statusMessage)
							}
						})
					}else{
						this.$toast(r.statusMessage)
					}
				})
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
			
			
			
			getBack() {
				uni.navigateBack()
			},
			toAgreement(title) {
				uni.navigateTo({
					url: '/pages/webView/index?title=' + title
				})
			}
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
	.bottom-icon{
		width: 750rpx;
		margin-top: 32rpx;
		justify-content: center;
		image{
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
