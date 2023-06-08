<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
		</u-navbar>
		<view class="top_title">输入手机号码</view>
		<view class="phone_v dis al_c">
			<view>+86</view>
			<input type="number" v-model="phone" placeholder="请输入手机号码" placeholder-style="color:#CCCCCC" />
		</view>
		<div class="tips dis " @click="radioChange">
			<radio-group>
				<label class="radio">
					<radio value="1" color="#F44850" style="transform:scale(0.85)" :checked="checkBox" />
				</label>
			</radio-group>
			<div class="check_text">我已阅读并同意 <span @click.stop="toAgreement('用户协议')">《用户协议》</span>与<span
					@click.stop="toAgreement('隐私政策')">《隐私政策》</span></div>
		</div>
		<div class="send_btn" @click="sendCode">获取验证码</div>
		<!-- <uni-popup ref="popup" type="center">
			<view class="pop_v dis cl al_c">
				<view class="title">输入验证密码</view>
				<u-toast ref="uToast"></u-toast>
				<view class="sub_title dis al_c">已发送至+86 {{phone}}
					<view style="margin-left: 16rpx;color: #2E6EEF;">
						<u-code :seconds="seconds" changeText="X秒后重新获取" @end="end" @start="start" ref="uCode"
							@change="codeChange"></u-code>
						{{tips}}
					</view>
				</view>
				<vcode-input ref="VcodeInput" :sum="4" @vcodeInput="vcodeInput"></vcode-input>
				<view class="btn_v dis al_c">
					<view class="cancel" @click="cancelPop">取消</view>
					<view class="confirm" @click="confirmPop">确定</view>
				</view>
			</view>
		</uni-popup> -->


		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<view class="pop_v dis cl al_c">
				<view class="title">输入验证码</view>
				<u-toast ref="uToast"></u-toast>
				<view class="sub_title dis al_c">已发送至+86 {{phone}}
					<view style="margin-left: 16rpx;color: #2E6EEF;" @click="sendCode">
						<u-code :seconds="seconds" changeText="X秒后重新获取" ref="uCode" @change="codeChange"></u-code>
						{{tips}}
					</view>
				</view>
				<!-- <vcode-input ref="VcodeInput" :sum="4" @vcodeInput="vcodeInput" setFocus="setFocus"></vcode-input> -->
				<u-message-input :maxlength="4" :breathe="true" value="" v-model="code" :disabled-keyboard="true"
					:dot-fill="false"></u-message-input>

				<view class="btn_v dis al_c">
					<view class="cancel" @click="cancelPop">取消</view>
					<view class="confirm" @click="confirmPop">确定</view>
				</view>
			</view>
			<keyboard @backspace="backspace" @change="keyChange" mode="number">
			</keyboard>
		</uni-popup>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	import VcodeInput from '@/components/vcode-input/vcode-input'
	import encrypt from '@/libs/encrypt.js'
	import keyboard from '@/components/keyboard/keyboard.vue'
	import {
		createCode,
		analysisCode
	} from '@/static/utils/jsencryptKey.js'
	export default {
		components: {
			VcodeInput,
			headBgImg,
			keyboard
		},
		data() {
			return {
				checkBox: false,
				phone: '',
				showCodeInput: false,
				seconds: 60,
				tips: '',
				publicKeyObj: {},
				resultKey: '',
				code: ''
			};
		},
		onLoad() {

		},
		onShow() {
			this.init()
			if (this.$refs?.VcodeInput) {
				this.$refs.VcodeInput.pageShow()
			}

		},
		methods: {
			backspace() {
				let {
					code
				} = this
				this.code = code.substring(0, code.length - 1)
			},
			keyChange(val) {
				console.log(val)
				if (this.code.length < 4) {
					this.code += val;
				}
			},
			radioChange() {
				this.checkBox = this.checkBox ? false : true
			},
			init() {
				this.$util.request(this.$apis.getPublicKey).then(res => {
					if (!res.status) {
						this.$toast(res.statusMessage)
						return;
					}
					const keyCode = res.resultValue
					const key = this.getDateInfo()
					const a = encrypt.decryptByDES(keyCode, key)
					this.publicKeyObj = JSON.parse(a)
					this.encryptKeyDo()
				})
			},
			getDateInfo() {
				let time = new Date()
				console.log('time=', time)
				let year = time.getUTCFullYear()
				let month = time.getUTCMonth() + 1
				let day = time.getUTCDate()
				let hour = time.getUTCHours()
				if ((Number(hour) + 8) > 23) {
					day += 1
					let maxDay = this.get_month_days(month, year)
					console.log('当月最大天数', maxDay)
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

				if (!this.checkBox) {
					this.$toast('请阅读并同意用户协议及隐私政策内容')
					return;
				}

				// this.$refs.popup.open()
				// setTimeout(() => {

				// 	// 通知验证码组件内部开始倒计时
				// 	this.$refs.uCode.start();
				// }, 200);
				// return;

				plus.nativeUI.showWaiting('发送验证码中...')

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
					if (res.status) {
						plus.nativeUI.toast('验证码已发送')
						this.$refs.popup.open()
						setTimeout(() => {
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}, 200);
					} else {
						this.$toast(res.statusMessage)
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
			confirmPop() {
				let {
					publicKeyObj,
					resultKey,
					phone,
					code
				} = this

				let opt = {
					"mobile": phone,
					"validationCode": code
				}
				plus.nativeUI.showWaiting('账号注册中...')
				this.$util.request(this.$apis.registerUser, opt, 'POST').then(res => {
					console.log('注册', res)
					plus.nativeUI.closeWaiting()
					if (res.status) {
						plus.nativeUI.toast('注册成功')
						uni.setStorageSync('phone', phone)
						setTimeout(r => {
							uni.redirectTo({
								url: './registSuccess'
							})
						}, 1200)
					} else {
						this.$toast(res.statusMessage)
					}

				})
				this.$refs.popup.close()
			},

			// 用户输入的值
			vcodeInput(val) {
				console.log(val);
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
		font-size: 48rpx;
		color: #333;
		margin: 109rpx 0 146rpx 0;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
	}

	.phone_v {
		width: 686rpx;
		height: 112rpx;
		background: #FFFFFF;
		border-radius: 100rpx;
		border: 1rpx solid #eee;

		view {
			width: 120rpx;
			height: 75rpx;
			line-height: 75rpx;
			border-right: 1rpx solid #F0F0F0;
			text-align: center;
			font-size: 32rpx;
			color: #333;
		}

		input {
			width: 500rpx;
			height: 100%;
			padding-left: 56rpx;
			font-size: 32rpx;
			color: #333;
		}
	}

	.tips {
		font-size: 26rpx;
		color: darkgray;

		text {
			color: #333;
		}

		margin-top:24rpx;
	}

	.send_btn {
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 166rpx;
		border-radius: 50rpx;

	}

	.pop_v {
		width: 640rpx;
		// height: 500rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin: 0 0 55rpx 55rpx;

		.title {
			font-size: 45rpx;
			color: #333;
			line-height: 80rpx;
		}

		.sub_title {
			margin-bottom: 50rpx;
			font-size: 24rpx;
			color: #999;
			line-height: 50rpx;

			view {
				color: #333;
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
		margin: 0 0 0 12rpx;
		font-size: 30rpx;
		color: #333;

		span {
			color: #F44850;
		}
	}
</style>
