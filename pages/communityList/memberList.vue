<template>
	<view class="content dis cl al_c">
		<u-navbar title="小区用户" :safeAreaInsetTop="true" @leftClick="getBack">
		</u-navbar>
		<view class="head_search dis al_c">
			<u-search :showAction="true" actionText="搜索" :animation="false"></u-search>
		</view>
		<view class="list dis cl al_c">
			<view class="item dis cl al_c" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<view class="top dis al_c">
					<view class="t1">注册时间：{{item.createOn}}</view>
					<view class="t2"></view>
				</view>
				<view class="data dis al_c">
					<view class="info dis cl">
						<view class="t1"><text>用户姓名</text>{{item.userName || '李萌'}}<text
								style="margin-left: 20rpx;">{{item.userMobile || '17758966555'}}</text></view>
						<view class="t2"><text>设备地址</text>{{item.deviceAddress || '银丰花苑1幢1单元'}}</view>
						<view class="t2"><text>设备编号</text>{{item.deviceCode}}</view>
						<view class="t3"><text>状态</text>正常</view>
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
				list:[]
			};
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData() {
				console.log('info=====', uni.getStorageSync('userInfo'))
				let info = uni.getStorageSync('userInfo')
				let data = {
					communityId: info.communityId
				}
				this.$util.request(this.$apis.getUserList, data).then(r => {
					console.log('小区用户', r)
					if (r.status) {
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
			},
			toDetail(item) {
				uni.navigateTo({
					url: './memberDetail?info='+item
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

		.item {
			width: 710rpx;
			height: 391rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
			background-color: #fff;

			.top {
				width: 666rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-bottom: 1rpx solid #eee;
				justify-content: space-between;

				.t1 {
					font-size: 28rpx;
					color: #333333;

				}

				.t2 {
					font-size: 28rpx;
					color: chartreuse;
				}
			}

			.data {
				width: 666rpx;
				height: 301rpx;
				margin: 20rpx 0;

				image {
					width: 150rpx;
					height: 150rpx;
				}

				.info {
					justify-content: space-between;
					height: 261rpx;
					// margin-left: 10rpx;
					background-color: #fff;

					.t1,
					.t2,
					.t3 {

						text {
							display: inline-block;
							width: 150rpx;
							color: #999999;
						}
					}

					.t1 {
						font-size: 28rpx;
						color: #333;
					}

					.t2 {
						font-size: 28rpx;
						color: #999;
					}

					.t3 {
						font-size: 28rpx;
						color: #457FF3;

						text {

							color: #999999;
						}
					}
				}
			}
		}
	}
</style>
