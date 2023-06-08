<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="添加设备" bgColor="rgba(0,0,0,0)" :placeholder="true" :safeAreaInsetTop="true" @leftClick="getBack">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back"  src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
			
		</u-navbar>
		<view class="card dis cl " style="height: 120rpx;">
			<view><text>当前设备编号：</text>{{scanCode}}</view>
		</view>

		<view class="card dis cl " style="height: 337rpx;">
			<view class="input_v dis al_c" style="margin-left: 0rpx;">
				<view>设备名称</view>
				<input v-model="deviceName" maxlength="8" placeholder="请输入设备名称" placeholder-style="color:#CCCCCC">
			</view>
			<view class="line"></view>
			<view class="input_v dis al_c" style="margin-left: 0rpx;">
				<view>用户姓名</view>
				<input v-model="name" placeholder="请输入您的姓名" placeholder-style="color:#CCCCCC">
			</view>
			<view class="line"></view>
			<view class="input_v dis al_c" style="margin-left: 0rpx;">
				<view>安装位置</view>
				<input v-model="address" placeholder="请输入安装位置" placeholder-style="color:#CCCCCC">
			</view>
		</view>
		<u-modal title="提示" :content="modalContent"  :show="isShowmodal"
			 confirmColor="#F44850" :showCancelButton="true" @cancel="isShowmodal=false"
			@confirm="confirmAdd" @close="isShowmodal=false"></u-modal>
		<view class="btn confirm" @click="add" v-if="!isConfirm">确定添加</view>
		<view class="btn none" v-else>确定添加</view>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data() {
			return {
				isConfirm: false,
				modalContent:'',
				deviceName: '',
				scanCode: '',
				userInfo: {},
				address: '',
				name: '',
				phone: uni.getStorageSync('phone'),
				isShowmodal:false
			};
		},
		onLoad(opt) {
			if (opt?.scanCode) {
				this.scanCode = opt.scanCode
			}
			let info = uni.getStorageSync('userInfo')
			this.userInfo = info
		},
		methods: {
			isCommuntBind(){
				let data = {
					deviceCode:this.scanCode
				}
				this.$util.request(this.$apis.BindDeviceValidation,data).then(r=>{
					console.log('校验管家',r)
					if(!r.status||r.statusCode!=0){
						this.isShowmodal = true
						this.modalContent = r.statusMessage
						return;
					}
					this.confirmAdd()
				})
			},
			add() {
				if (this.address == '' || this.name == '' || this.phone == '' || this.deviceName == '') {
					this.$toast('请完善信息')
					return;
				}
				let userState = uni.getStorageSync('userState')
				if(userState.indexOf('BIND_COMMUNITY')!=-1){
					this.isCommuntBind()
				}else{
					this.confirmAdd()
				}
			},
			confirmAdd(){
				console.log('modalContent=',this.modalContent)
				let userState = uni.getStorageSync('userState')
				if(this.modalContent == '设备已被绑定，请更换设备'&&userState.indexOf('BIND_COMMUNITY')!=-1){
					this.isShowmodal = false
					this.modalContent = ''
					return;
				}
				let data = {
					deviceCode: this.scanCode,
					deviceName: this.deviceName,
					deviceAddress: this.address,
					mobile: this.phone,
					realName: this.name
				}
				this.isConfirm = true
				console.log('设备绑定入参',data)
				plus.nativeUI.showWaiting('设备绑定中...')
				this.$util.request(this.$apis.BindDeviceByUser, data, 'POST').then(r => {
					console.log('添加设备', r)
					plus.nativeUI.closeWaiting()
					
					if (r.status) {
						if (r.data) {
							this.$toast('添加成功')
							setTimeout(r => {
								uni.navigateTo({
									url: '/pages/boxManage/bindCoupon'
								})
							}, 1200)
						} else {
							this.$toast(r.statusMessage)
							setTimeout(r => {
								uni.navigateBack()
							}, 1200)
						}
				
					} else {
						this.isConfirm = false
						this.$toast(r.statusMessage)
					}
				})
			},
			getBack() {
				uni.navigateBack()
			},
			addStore() {
				uni.navigateTo({
					url: './add'
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
	input{
		width: 300rpx;
	}
	.card {
		width: 686rpx;
		height: 248rpx;
		// padding: 20rpx 0;
		background-color: white;
		border-radius: 20rpx;
		margin-top: 20rpx;
		justify-content: space-around;

		text {
			color: #999999;
		}

		.line {
			width: 686rpx;
			height: 1rpx;
			border-bottom: 1rpx solid #eee;
		}

		view {
			font-size: 28rpx;
			margin-left: 20rpx;
			color: #333;
			line-height: 60rpx;
		}
	}

	.itm {
		width: 710rpx;
		text-align: left;
		margin: 40rpx;
	}

	.input_v {
		padding: 20rpx 0;
		margin-left: -20rpx;

		view {
			font-size: 32rpx;
			color: #333;
			font-weight: 500;
		}

		input {
			margin-left: 36rpx;
			font-size: 32rpx;
			color: #333;
		}
	}

	.btn {
		width: 686rpx;
		height: 88rpx;
		border-radius: 46rpx 46rpx 46rpx 46rpx;

		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		position: fixed;
		bottom: 50rpx;
		left: 32rpx;

	}

	.confirm {
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
	}

	.none {
		background-color: #CCCCCC;
		color: #fff;
	}
</style>
