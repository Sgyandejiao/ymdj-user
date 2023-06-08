<template>
	<view class="content dis cl al_c">
		<view class="item dis al_c" style="margin-top: 20rpx;">
			<view class="title">头像</view>
			<image src="/static/512.png" mode=""></image>
		</view>
		<view class="item dis al_c">
			<view class="title">性别</view>
			<view class="value">男</view>
		</view>
		<view class="item dis al_c">
			<view class="title">手机号</view>
			<view class="value">188254235425</view>
		</view>
		<view class="item dis al_c">
			<view class="title">身份证号</view>
			<view class="value">3100054545542545</view>
		</view>
		<view class="image_v dis cl al_c">
			<view class="title">证件照</view>
			<view class="dis al_c">
				<image src="/static/512.png" mode=""></image>
				<image src="/static/512.png" mode=""></image>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
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
		background-color: whitesmoke;
	}
	.item{
		width: 750rpx;
		height: 120rpx;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		.title{
			font-size: 30rpx;
			margin-left: 30rpx;
		}
		image{
			width: 80rpx;
			height: 80rpx;
			margin-right: 30rpx;
		}
		.value{
			font-size: 30rpx;
			margin-right: 30rpx;
		}
	}
	.image_v{
		width: 710rpx;
		.title{
			width: 100%;
			text-align: left;
			font-size: 30rpx;
			color: #333;
		}
		image{
			width: 320rpx;
			height: 250rpx;
			margin: 20rpx;
		}
	}
</style>
