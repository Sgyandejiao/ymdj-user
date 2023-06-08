<template>
	<view class="content dis cl al_c">
		<view class="itm dis al_c" style="justify-content: space-between;">
			<view class="lef dis al_c">
				<view class="title">头像</view>
				<image class="avatar" src="/static/images/default-avatar.png" mode="aspectFill"></image>
			</view>
			<image class="rig" style="width: 40rpx;height: 40rpx;" src="/static/icon/arrow-right.png" mode="widthFix"></image>
		</view>
		<view class="itm dis al_c">
			<view class="title">姓名</view>
			<view class="value">{{info.userName || '李萌'}}</view>
		</view>
		<view class="itm dis al_c">
			<view class="title">手机号</view>
			<view class="value">{{info.userMobile || '17758966555'}}</view>
		</view>
		<view class="itm dis al_c">
			<view class="title">身份证</view>
			<view class="value">33031055454545845</view>
		</view>
		<view class="itm dis al_c">
			<view class="title">使用情况</view>
			<view class="value">正常</view>
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			};
		},
		
		created() {



		},
		onLoad(opt) {
			this.info = opt
		},
		
		mounted() {

		},
		methods: {

		}

	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
		padding-bottom: 100rpx;
	}

	.itm {
		width: 750rpx;
		height: 120rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;

		.title {
			width: 120rpx;
			margin: 0 20rpx 0 30rpx;
			font-size: 30rpx;
			color: #333;
		}

		.value {
			font-size: 30rpx;
			color: #333;
		}

		.rig {
			margin-right: 30rpx;
			min-width: 40rpx;
			height: 40rpx;
			image{
				width: 40rpx;
				height: 40rpx;
			}
		}

		.avatar {
			width: 110rpx;
			height: 110rpx;
			border-radius: 50%;
		}
	}
</style>
