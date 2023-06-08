<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="绑定成功" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true" @leftClick="backHome">
		</u-navbar>
		<view class="top dis al_c j_c">
			<image src="/static/icon/success.png" mode="widthFix"></image>
			<view>绑定完成</view>
		</view>
		<image class="coupon" src="/static/images/bindCoupon.png" mode="widthFix" @click="toCoupon(1)"></image>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data(){
			return {
				
			}
		},
		
		methods:{
			backHome(){
				uni.switchTab({
					url:'/pages/home/index'
				})
			},
			toCoupon(){
				uni.redirectTo({
					url:'/pages/my/coupon?from=1'
				})
				
			}
		}
	}
</script>

<style lang="scss">
	page{
		width: 750rpx;
		background-color: #f0f0f0;
	}
	.top{
		width: 750rpx;
		margin-top: 199rpx;
		justify-content: center;
		image{
			width: 48rpx;
			height: 48rpx;
		}
		view{
			font-size: 40rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-left: 20rpx;
		}
	}
	.coupon{
		width: 567rpx;
		height: 566rpx;
		margin-top: 53rpx;
	}
</style>