<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="添加授权" bgColor="rgba(0,0,0,0)" :placeholder="true" :safeAreaInsetTop="true" @leftClick="getBack">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back"  src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
			
		</u-navbar>
		<view class="card dis cl al_c">
			<view class="itm dis al_c" style="height: 62rpx;"><text class="text">设备名称：</text>{{deviceName}}</view>
			<view class="itm dis al_c" style="height: 62rpx;"><text class="text">设备编号：</text>{{scanCode}}</view>
		</view>

		<view class="card dis cl al_c" >
			<view class="input_v dis al_c">
				<view>授权账号</view>
				<input v-model="phone" type="number" maxlength="11" placeholder="请输入对方的手机号码" placeholder-style="color:#CCCCCC">
			</view>
			<view class="line"></view>
			<view class="input_v dis al_c">
				<view class="dis al_c">授权方式
					<view class="dis al_c radio" >
						<view class="son dis al_c"  @click="changeRadio(0)">
							<image src="/static/icon/select.png" mode="widthFix" v-if="radio==1" ></image>
							<image src="/static/icon/selects.png" mode="widthFix" v-else></image>
							<view :class="[radio==0?'act':'def']" >永久授权</view>
						</view>
						<!-- <view class="son dis al_c" @click="changeRadio(1)">
							<image src="/static/icon/select.png" mode="widthFix" v-if="radio==0" ></image>
							<image src="/static/icon/selects.png" mode="widthFix" v-else></image>
							<view :class="[radio==1?'act':'def']" >临时一次</view>
						</view> -->
						
					</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="itm input_v dis al_c">
				<view style="font-size: 26rpx;">备注</view>
				<view class="tags dis al_c">
					<view class="u-page__tag-item" v-for="(item, index) in radios" :key="index">
						<u-tag :text="item.text" style="margin-right:15rpx" :plain="!item.checked" 
							:name="index" @click="radioClick" :bgColor="!item.checked?bgColor:bgColor1"
							:color="!item.checked?color:color1" :borderColor="!item.checked?bdColor:bdColor1">
						</u-tag>
					</view>

				</view>
			</view>
			<view class="textarea">
				<u-textarea v-model="authDesc" style="background-color:#F8F8F8;min-height: 148rpx;padding-bottom:40rpx"  maxlength="200" placeholder="自定义输入备注内容" count autoHeight ></u-textarea>
			</view>
			
			
		</view>

		<view class="btn" @click="add">确定授权</view>
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
				radio:0,
				bgColor: '#FFFFFF',
				bgColor1: '#E6EFFF',
				color: '#666666',
				color1: '#2E6EEF',
				bdColor: '#999999',
				bdColor1: '#2E6EEF',
				scanCode: '',
				deviceName: '',
				userInfo: {},
				address: '',
				name: '',
				phone: '',
				radiovalue1: '1',
				authDesc: '',
				radios: [{
						text: '管家',
						checked: false
					},
					{
						text: '跑腿',
						checked: false
					},
					{
						text: '家人',
						checked: false
					},
					{
						text: '其他',
						checked: false
					}
				],
			};
		},
		onLoad(opt) {
			if (opt?.scanCode && opt.deviceName) {
				this.scanCode = opt.scanCode
				this.deviceName = opt.deviceName
			}
			let info = uni.getStorageSync('userInfo')
			this.userInfo = info
		},
		methods: {
			changeRadio(index){
				console.log(index)
				this.radio = index
			},
			getBack() {
				uni.navigateBack()
			},
			radioClick(name) {
				this.radios.map((item, index) => {
					item.checked = index === name ? true : false
				})
				this.authDesc = this.radios[name].text
			},
			radioChange() {

			},
			add() {
				if (this.phone == '') {
					this.$toast('请完善信息')
					return;
				}
				if(!this.$checkPhone(this.phone)){
					this.$toast('请输入正确的手机号')
					return;
				}
				let data = {
					"authDesc": this.authDesc || '管家',
					"authMobile": this.phone,
					"authType": this.radio+1,
					"deviceCode": this.scanCode
				}
				plus.nativeUI.showWaiting()
				console.log('data', data)
				this.$util.request(this.$apis.addAuthInfo, data, 'POST').then(res => {
					console.log('授权设备', res)
					plus.nativeUI.closeWaiting()
					if (res.status) {
						
						this.$toast('授权成功')
						setTimeout(r => {
							uni.navigateBack()
						}, 1200)
					} else {
						this.$toast(res.statusMessage)
					}
				})
			},
			groupChange(n) {
				console.log('groupChange', n);
			},


		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		background-color: #f0f0f0;
	}
	input{
		width: 400rpx;
	}
	.card {
		width: 686rpx;
		// height: 248rpx;
		padding: 20rpx 0;
		background-color: white;
		border-radius: 20rpx;
		margin-top: 20rpx;
		
		.text {
			color: #999999;
		}

		.line {
			width: 638rpx;
			height: 1rpx;
			border-bottom: 1rpx solid #eee;
		}

		.itm {
			height: 112rpx;

		}

		.textarea {
			width: 638rpx;
			background: #F8F8F8;
			// border-radius: 8rpx;
			// font-size: 28rpx;
			// font-family: PingFang SC-Regular, PingFang SC;
			// font-weight: 400;
			// padding: 16rpx;

		}

	}

	.itm {
		width: 638rpx;
		text-align: left;

		// margin: 40rpx;
		text {
			font-size: 28rpx;
		}
	}

	.input_v {
		width: 638rpx;
		height: 112rpx;
		// padding: 20rpx 0;
		// margin-left: 20rpx;

		view {
			font-size: 26rpx;
			color: #333;
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
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		font-size: 32rpx;
		text-align: center;
		line-height: 88rpx;
		position: fixed;
		bottom: 50rpx;
		left: 32rpx;
		color: #fff;
	}

	.tags {
		// flex-wrap: wrap;
		margin-left: 60rpx;

		view {
			margin-right: 2rpx;
		}
	}
	.radio {
		position: relative;
		z-index: 999;
		.son {
			height: 80rpx;
			margin-left: 40rpx;
			background-color: #fff;
			image {
				width: 32rpx;
				height: 32rpx;
			}
	
			view {
				font-size: 32rpx;
				margin-left: 6rpx;
				
			}
		}
		.def{
			color: #333;
		}
		.act {
			color: #2E6EEF;
		}
	}
</style>
