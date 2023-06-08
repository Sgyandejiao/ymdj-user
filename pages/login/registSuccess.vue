<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="注册" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
		</u-navbar>
		<image class="icon" src="/static/icon/success.png" mode="widthFix"></image>
		<view class="successText">注册完成</view>
		<view class="text1 btn" @click="navToHome" v-if="isLogin">进入首页</view>
	</view>
</template>

<script>
	import encrypt from '@/libs/encrypt.js'
	import {
		createCode,
		analysisCode
	} from '@/static/utils/jsencryptKey.js'
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data(){
			return{
				publicKeyObj: {},
				resultKey: '',
				code: '',
				isLogin:false
			}
		},
		onLoad() {
			this.init()
		},
		methods:{
			init() {
				this.$util.request(this.$apis.getPublicKey).then(res => {
					console.log('init',res)
					if(!res.status){
						this.$toast(res.statusMessage)
						return;
					}
					const keyCode = res.resultValue
					const key = this.getDateInfo()
					console.log('dateStr=',key)
					const a = encrypt.decryptByDES(keyCode, key)
					this.publicKeyObj = JSON.parse(a)
					this.encryptKeyDo()
				})
			},
			getDateInfo() {
				let time = new Date()
				console.log('time=',time)
				let month = time.getUTCMonth() + 1
				let monthStr = month >= 10 ? month : '0' + month
				let day = time.getUTCDate()
				day = day >= 10 ? day : '0' + day
				let resultStr = `fssh${monthStr}${day}`
				console.log('time1=',resultStr)
				return resultStr
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
						this.toHome()
					}
				})
			},
			toBind(){
				uni.redirectTo({
					url:'/pages/boxManage/boxManage'
				})
			},
			toHome(){
				let {
					publicKeyObj,
					resultKey,
					code
				} = this
				let phone = uni.getStorageSync('phone')
				let data =
					`systemCode=YMDJ_USER&mobile=${phone}&password=5005&ignoreCode=1&logOnType=1&systemVersion=1.0.0&clientOs=Android&autoRegister=0`
				console.log('入参字符串', data)
				let resultData = encrypt.encryptByDES(data, resultKey)
				let opt = {
					data: resultData,
					keyId: publicKeyObj.keyId
				}
				console.log('登录入参',opt)
				this.$util.request(this.$apis.appLogin, opt, 'POST').then(res => {
					console.log('登录', res)
					if (res.status) {
						let ftoken = JSON.parse(encrypt.decryptByDES(res.resultValue, resultKey));
						console.log('ftoken=', ftoken)
						uni.setStorageSync('ftoken', ftoken.token)
						uni.setStorageSync('phone', phone)
						console.log('ftoken===',uni.getStorageSync('ftoken'))
						this.isLogin = true
						this.getInfo()
					} else {
						this.$toast(res.statusMessage)
					}
				
				})
				
				
			},
			getInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					console.log('用户信息', res)
					if (res.status) {
						this.bindGeTui(res.data.userId)
					}
				})
			},
			navToHome(){
				if(!uni.getStorageSync('ftoken')){
					this.$toast('登录信息获取失败，请重新登录')
					setTimeout(r=>{
						uni.redirectTo({
							url:'/pages/login/login'
						})
					},1000)
				}else{
					this.$toast('登录成功')
					setTimeout(r=>{
						uni.switchTab({
							url:'/pages/home/index'
						})
					},1000)
				}
				
									
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
					console.log('if (plus.os.name')
					let PushManager = plus.android.importClass("com.igexin.sdk.PushManager");
					console.log('let PushManager', PushManager)
					let context = plus.android.runtimeMainActivity().getContext();
					console.log('let context =', context)
					let Instance = PushManager.getInstance();
					console.log('let Instance ', Instance)
					var info = plus.push.getClientInfo();
					console.log('绑定cid==', info.clientid)
					Instance.bindAlias(context, alias);
				} else {
					let GeTuiSdk
					GeTuiSdk = plus.ios.importClass("GeTuiSdk");
					console.log('GeTuiSdk = ')
					GeTuiSdk.bindAliasandSequenceNum(alias, alias);
					console.log('绑定cid==')
					// GeTuiSdk.setTags(tags);
				}
			
				// #endif 
			},
		}
	}
</script>

<style lang="scss">
	.icon{
		width: 120rpx;
		height: 120rpx;
		margin-top: 114rpx;
	}
	.successText{
		font-size: 40rpx;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		color: #333333;
		margin-top: 40rpx;
	}
	.btn{
		width: 686rpx;
		height: 88rpx;
		border-radius: 46rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 32rpx;
	}
	.text1{
		margin-top: 360rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
	}
	.text2{
		border: 2rpx solid #999999;
		color:#333333 ;
		margin-top: 24rpx;
	}
</style>