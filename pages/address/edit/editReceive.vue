<template>
	<view>
		<view class="content dis cl al_c">
			<headBgImg></headBgImg>
			<u-navbar title="详细地址" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
				<view class="u-nav-slot" slot="left">
					<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
				</view>
			</u-navbar>
			<view class="card dis cl al_c">
				<view class="item dis al_c">
					<view class="lef dis al_c">
						<view class="label">绑定小区</view>
						<view class="communit">{{communit}}</view>
					</view>
					<!-- <image src="" mode=""></image> -->
				</view>
				<view class="line"> </view>
				<view class="item dis al_c">
					<view class="label">详细地址</view>
					<input class="communit" type="text" maxlength="30" v-model="address" placeholder="例：6幢1单元1301"
						placeholder-style="color:#CCCCCC">
				</view>
			</view>
			<view :class="['save-btn',address!=''?'act':'def']" @click="bind" v-if="userState=='ONLY_REGISTER'&&cummunitInfo!=''">保存地址</view>
			<view :class="['save-btn',address!=''?'act':'def']" @click="save" v-else>保存地址</view>
		</view>
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
				address: '',
				communit: '',
				cummunitInfo:'',
				userState:'',
				addressId:'',
				from:'',
				isConfirm:false
			};
		},
		onShow() {

		},
		onLoad(e) {
			
			if(uni.getStorageSync('userState')){
				console.log(uni.getStorageSync('userState'))
				let userState = uni.getStorageSync('userState')
				this.userState = userState
			}
			if (uni.getStorageSync('receiveInfo')) {
				let info = uni.getStorageSync('receiveInfo')
				this.address = info.receiveAddress
				this.addressId = info.receiveId
				this.communit = info.communityName
				console.log('info',info)
			}
			if(e.data){
				let data = JSON.parse(e.data)
				data.address = ''
				this.cummunitInfo = data
				this.communit = data.communityName
				this.addressId = data.receiveId?data.receiveId:''
				this.address =  data.receiveAddress?data.receiveAddress:''
				console.log(data)
			}
			if(e?.from=='receive'){
				this.from=e.from
			}
			console.log('e',e)
		},
		methods: {
			bind(){
				if (this.address == '' || this.isConfirm==true) {
					// this.$toast('请输入详细地址')
					return;
				}
				let data = this.cummunitInfo
				data.address = this.address
				console.log('绑定入参',data)
				// return;
				this.isConfirm = true
				this.$util.request(this.$apis.bindCommunity,data,'post').then(r=>{
					console.log('绑定小区',r)
					if(r.status){
						this.$toast('保存成功')
						setTimeout(()=>{
							if(this.from=='receive'){
								uni.navigateBack({
									delta:2
								})
							}else{
								uni.switchTab({
									url:'/pages/home/index'
								})
							}
							
						},1200)
					}else{
						this.isConfirm = false
						this.$toast(r.statusMessage)
					}
				})
			},
			save() {
				if (this.address == ''|| this.isConfirm==true) {
					this.$toast('请输入详细地址')
					return;
				}
				let data = {
					address: this.address,
					addressId: this.addressId
				}
				console.log('data=',data)
				plus.nativeUI.showWaiting()
				this.isConfirm = true
				this.$util.request(this.$apis.editUserAddress, data,'post').then(r => {
					console.log('修改地址',r)
					plus.nativeUI.closeWaiting()
					if (r.status) {
						this.$toast('保存成功')
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					} else {
						this.isConfirm = false
						this.$toast(r.statusMessage)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}

	page {
		width: 750rpx;
		// background-color: whitesmoke;
		background-color: #f0f0f0;
	}

	.card {
		width: 686rpx;
		height: 224rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 24rpx;

		.item {
			width: 662rpx;
			min-height: 112rpx;
			font-size: 32rpx;

			.label {
				width: 128rpx;
				color: #333333;
			}

			.communit,
			input {
				width: 500rpx;
				color: #333333;
				margin-left: 36rpx;
			}

		}

		.line {
			width: 662rpx;
			border-top: 1rpx solid #eee;
		}
	}

	.save-btn {
		width: 686rpx;
		height: 88rpx;
		border-radius: 46rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		position: fixed;
		bottom: 48rpx;
		left: 32rpx;
		text-align: center;
		display: flex;
		justify-content: center;
	}
	.act{
		background: linear-gradient(to left, #FF4E8C, #F73740);
	}
	.def{
		background: #CCCCCC;
	}
</style>