<template>
	<view class="content dis cl al_c">
		<u-navbar rightText="添加" title="店铺管理" :safeAreaInsetTop="true" @rightClick="addStore" @leftClick="getBack">
		</u-navbar>
		<view class="head_search dis al_c">
			<u-search :showAction="true" actionText="搜索" :animation="false"></u-search>
		</view>
		<view class="list dis cl al_c">
			<view class="item dis cl al_c" v-for="(item,index) in list" :key="index">
				<view class="top">添加时间：{{item.addDate}}</view>
				<view class="data dis al_c">
					<image :src="item.shopImageUrl[0]" mode="aspectFill"></image>
					<view class="info dis cl">
						<view class="t1">店铺名称：{{item.shopName}}</view>
						<view class="t2">店铺地址：{{item.shopAddress}}</view>
						<view class="t3">营业时间：{{item.bussinessTime}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				let info = uni.getStorageSync('userInfo')
				let data = {
					communityId: info.communityId
				}
				this.$util.request(this.$apis.getShopList, data).then(r => {
					console.log('店铺', r)
					if (r.status) {
						for(let item of r.data){
							item.shopImageUrl=item.shopImageUrl.split(';')
						}
						this.list = r.data
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
		background-color: whitesmoke;
		
	}

	.head_search {
		width: 710rpx;
		padding: 0 20rpx;
		height: 120rpx;
		position: fixed;
		left: 0;
		top: 150rpx;
		z-index: 1;
		background-color: white;
	}

	.list {
		width: 100%;
		position: relative;
		top: 300rpx;
		padding-bottom: 20rpx;
		.item {
			width: 710rpx;
			height: 300rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
			background-color: #fff;

			.top {
				width: 666rpx;
				height: 90rpx;
				font-size: 28rpx;
				line-height: 90rpx;
				border-bottom: 1rpx solid #eee;
			}

			.data {
				width: 666rpx;
				height: 150rpx;
				margin: 20rpx 0;

				image {
					width: 150rpx;
					height: 150rpx;
				}

				.info {
					justify-content: space-between;
					height: 150rpx;
					margin-left: 20rpx;

					.t1 {
						width: 450rpx;
						font-size: 30rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-weight: bold;
					}

					.t2 {
						font-size: 28rpx;
						color: #999;
					}

					.t3 {
						font-size: 28rpx;
						color: chartreuse;
					}
				}
			}
		}
	}
</style>
