<template>
	<div class="content dis cl al_c">
		<headBgImg></headBgImg>
		<image class="logo" src="/static/images/logo-text.png" mode="widthFix"></image>
		<!-- <div class="phone">135*****8888</div>
		<div class="subText1">中国电信提供认证服务</div> -->
		<!-- <div class="login_btn" @click="loginIn">本机号码一键登录</div> -->
		<view class="login_btn" style="margin-top: 200rpx;" @click="sendCodeLogin">短信验证码登录</view>
		<view class="divider">
			<u-divider text="or"></u-divider>
		</view>
		<!-- <div class="orth_btn" @click="sendCodeLogin">短信验证码登录</div> -->
		<div class="orth_btn" @click="register">注册</div>
		<div class="check_box dis " @click="radioChange">
			<radio-group>
				<label class="radio">
					<radio value="1" style="transform:scale(0.85)" color="#F44850" :checked="checkBox" />
				</label>
			</radio-group>
			<div class="check_text">我已阅读并同意 <span @click.stop="userAgreement('用户协议')">《用户协议》</span>与<span
					@click.stop="userAgreement('隐私政策')">《隐私政策》</span></div>
		</div>


	</div>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data() {
			return {
				checkBox: false,
			};
		},
		onShow() {
			console.log('onshow---')
		},
		onLoad() {
			console.log('onload---')
			// uni.removeStorageSync('ftoken')
			uni.preLogin({
				provider: 'univerify',
				success: (res) => {
					console.log('预登录成功', res)
					uni.login({
						provider: 'univerify',
						univerifyStyle: { // 自定义登录框样式
							//参考`univerifyStyle 数据结构`
							"fullScreen": true, // 是否全屏显示，默认值： false
							"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
							"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）  
							"icon": {
								"path": "static/logo.png" // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
							},
							"closeIcon": {
								"path": "static/xxx.png" // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
							},
							"phoneNum": {
								"color": "#333333", // 手机号文字颜色 默认值：#202020 
								 "fontSize":"34px"
							},
							"slogan": {
								"color": "#BBBBBB" //  slogan 字体颜色 默认值：#BBBBBB  
							},
							"authButton": {
								"normalColor": "#FF4E8C", // 授权按钮正常状态背景颜色 默认值：#3479f5  
								"highlightColor": "#FF4E8C", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
								"disabledColor": "#73aaf5", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
								"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff  
								"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”  
								"borderRadius": "24px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
							},
							"otherLoginButton": {
								"visible": true, // 是否显示其他登录按钮，默认值：true  
								"normalColor": "", // 其他登录按钮正常状态背景颜色 默认值：透明 
								"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明 
								"textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565  
								"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”  
								"borderColor": "", //边框颜色 默认值：透明（仅iOS支持）  
								"borderRadius": "0px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
							},
							"privacyTerms": {
								"defaultCheckBoxState": true, // 条款勾选框初始状态 默认值： true
								"uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
								"checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
								"checkBoxSize": 12, // 可选 条款勾选框大小，仅android支持
								"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB  
								"termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3  
								"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
								"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”  
								"privacyItems": [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效  
									{
										"url": "https://", // 点击跳转的协议详情页面  
						 			"title": "用户服务协议" // 协议名称  
									}
								]
							},
							"buttons": { // 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
								"iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
								"list": [{
										"provider": "apple",
										"iconPath": "/static/apple.png" // 图标路径仅支持本地图片
									},
									{
										"provider": "weixin",
										"iconPath": "/static/wechat.png" // 图标路径仅支持本地图片
									}
								]
							}
						},
						success(res) { // 登录成功
							console.log(res); // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
						},
						fail(res) { // 登录失败
							console.log('err',res)
							// console.log(res.errMsg)
						}
					})
				}
			})

		},
		methods: {
			// 一键登录
			oneLogin(){
				console.log('一键登录')
				
			},
			register() {
				if (!this.checkBox) {
					this.$toast('请阅读并同意以下协议')
					return;
				}
				uni.navigateTo({
					url: '/pages/login/regist'
				})
			},
			userAgreement(title) {
				console.log('title', title)
				uni.navigateTo({
					url: '/pages/webView/index?title=' + title
				})
			},
			radioChange() {
				this.checkBox = this.checkBox ? false : true
			},
			loginIn() {
				uni.showLoading({
					title: '正在登录中...',
					duration: 500
				})

				setTimeout(r => {
					uni.navigateTo({
						url: '/pages/auth/index'
					})
				}, 500)
			},
			sendCodeLogin() {
				if (!this.checkBox) {
					this.$toast('请阅读并同意以下协议')
					return;
				}
				
				uni.navigateTo({
					url: '/pages/login/code'
				})
				return;
				
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 100rpx;
		background-color: #f0f0f0;
	}

	.content {
		width: 750rpx;
	}

	.logo {
		margin-top: 348rpx;
		width: 292rpx;
		height: 66rpx;
	}

	.phone {
		margin-top: 160rpx;
		font-size: 68rpx;
		font-family: DIN Alternate-Bold, DIN Alternate;
		font-weight: bold;
		color: #333333;

	}

	.subText1 {
		font-size: 32rpx;
		color: #666666;
		margin-top: 12rpx;
	}

	.login_btn {
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		font-size: 32rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 402rpx;
		border-radius: 46px 46px 46px 46px;
		font-family: PingFang SC-Bold, PingFang SC;
	}

	.divider {
		width: 686rpx;
		margin: 104rpx 0 54rpx;
	}

	.orth_btn {
		width: 686rpx;
		height: 88rpx;
		border: 1rpx solid #999999;
		color: #333;
		font-size: 32rpx;
		text-align: center;
		line-height: 88rpx;
		border-radius: 46px 46px 46px 46px;
		font-family: PingFang SC-Bold, PingFang SC;
	}

	.check_box {
		position: fixed;
		bottom: 50rpx;
		width: 686rpx;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.check_text {
			margin: 0rpx 0 0 12rpx;
			font-size: 30rpx;
			color: #333;

			span {
				color: #F44850;
			}
		}

		.radio {
			font-size: 28rpx;
			color: #333;
			width: 30rpx;
			height: 30rpx;
		}
	}
</style>
