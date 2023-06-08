<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="关于我们" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
		</u-navbar>
		<image class="logo" src="/static/logo-center.png" mode="widthFix"></image>
		<view class="card dis cl al_c">
			<view class="text" @click="callPhone"><text>客服电话</text>4000251117</view>
			<view class="line"> </view>
			<view class="text"><text>所属公司</text>杭州一秒达科技有限公司</view>
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

			}
		},
		methods: {
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: '4000251117'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;
	}

	.logo {
		width: 245rpx;
		height: 196rpx;
		margin: 122rpx 0 77rpx 0;
	}

	.text {
		width: 638rpx;
		height: 112rpx;
		line-height: 112rpx;
		font-size: 32rpx;
		// margin-bottom: 20rpx;
		
	}
	.card{
		width: 686rpx;
		height: 224rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		.line{
			width: 638rpx;
			
			border-bottom: 1rpx solid #F0F0F0;
		}
		text{
			color: #999999;
			margin-right: 36rpx;
		}
	}
</style>
