<template>
	<view>
		<view class="content dis cl al_c">
			<headBgImg></headBgImg>
			<u-navbar title="地址管理" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="false" @leftClick="select(receiveList[0])">
				<view class="u-nav-slot" slot="left">
					<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
				</view>
			</u-navbar>
			<scroll-view scroll-y="true" style="height: 90vh;"
				v-if="receiveList.length&&receiveList[0].communityId!=''">
				<view class="dis cl al_c" style="width: 750rpx;">
					<view class="list dis cl al_c">
						<view class="row" v-for="(row,index) in receiveList" :key="index" @tap="select(row)">
							<view class="center">
								<view class="name-tel dis al_c">
									<view class="name">{{row.communityName}}</view>
									<image src="/static/icon/edit.png" mode="widthFix" @click.stop="toEdit(row)">
									</image>
								</view>
								<view class="address">详细地址：{{row.receiveAddress}}</view>
							</view>

						</view>
					</view>
					<!-- <u-loadmore :status="status" line v-if="receiveList.length" /> -->
				</view>
			</scroll-view>
			<view class="no_page dis cl al_c" v-if="!receiveList.length || receiveList[0].communityId==''">
				<image src="/static/icon/noAddress.png" mode="widthFix"></image>
				<view>暂无地址</view>
				<view class="btn" @tap="add">添加地址</view>
			</view>
		</view>

		<!-- <view class="add">
			<view class="btn" @tap="add">
				<view class="icon tianjia"></view>新增地址
			</view>
		</view> -->
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
				isSelect: false,
				receiveList: [],
				status: 'nomore',
			};
		},
		onShow() {

			uni.getStorage({
				key: 'delAddress',
				success: (e) => {
					let len = this.receiveList.length;
					if (e.data.hasOwnProperty('id')) {
						for (let i = 0; i < len; i++) {
							if (this.receiveList[i].id == e.data.id) {
								this.receiveList.splice(i, 1);
								break;
							}
						}
					}
					uni.removeStorage({
						key: 'delAddress'
					})
				}
			})
			uni.getStorage({
				key: 'saveAddress',
				success: (e) => {
					let len = this.receiveList.length;
					if (e.data.hasOwnProperty('id')) {
						for (let i = 0; i < len; i++) {
							if (this.receiveList[i].id == e.data.id) {
								this.receiveList.splice(i, 1, e.data);
								break;
							}
						}
					} else {
						let lastid = this.receiveList[len - 1];
						lastid++;
						e.data.id = lastid;
						this.receiveList.push(e.data);
					}
					uni.removeStorage({
						key: 'saveAddress'
					})
				}
			})
			this.getData()
		},
		onLoad(e) {

			if (e.type == 'select') {
				this.isSelect = true;
			}
			// this.getData()
		},
		methods: {
			getData() {
				plus.nativeUI.showWaiting()
				this.$util.request(this.$apis.getReceiveAddressList).then(r => {
					console.log('用户收件地址列表', r)
					setTimeout(()=>{
						plus.nativeUI.closeWaiting()
					},200)
					if (r.status) {
						this.receiveList = r.data ? r.data : this.receiveList
					}
				})
			},
			edit(row) {
				uni.setStorage({
					key: 'address',
					data: row,
					success() {
						uni.navigateTo({
							url: "edit/edit?type=edit"
						})
					}
				});

			},
			toEdit(row) {
				uni.navigateTo({
					url: '/pages/address/edit/editReceive?data=' + JSON.stringify(row)
				})
			},
			add() {
				uni.navigateTo({
					url:'/pages/bindCommunit/bindCommunit?from=receive'
				})
			},
			select(row) {
				// uni.setStorageSync('selectAddress', row)
				// uni.setStorageSync('receiveInfo', row)
				uni.navigateBack()
				// uni.navigateTo({
				// 	url: '/pages/address/edit/editReceive'
				// })
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
		background-color: #f0f0f0;
	}

	.no_page {
		width: 750rpx;
		padding-top: 300rpx;

		image {
			width: 407rpx;
			height: 238rpx;
		}

		view {
			font-size: 32rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #666666;
			margin-top: 46rpx;
		}

		.btn {
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 68rpx;
			left:32rpx;
			width: 686rpx;
			height: 88rpx;
			background: linear-gradient(to left, #FF4E8C, #F73740);
			border-radius: 46rpx;
			text-align: center;
			line-height: 88rpx;
			font-size: 32rpx;
			color: #fff;
		}
	}

	.icon {
		// &.bianji {
		// 	&:before{content:"\e61b";}
		// }
		// &.tianjia {
		// 	&:before{content:"\e81a";}
		// }
	}

	.add {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #f06c7a;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.list {
		width: 750rpx;
		margin-bottom: 50rpx;

		// background-color: #fff;
		.row {
			width: 686rpx;
			min-height: 137rpx;
			padding-bottom: 20rpx;
			margin-bottom: 16rpx;
			background-color: #fff;
			border-radius: 16rpx;

			.left {
				width: 90upx;
				flex-shrink: 0;
				align-items: center;


				.head {
					width: 70upx;
					height: 70upx;
					background: linear-gradient(to right, #ccc, #aaa);
					color: #fff;
					justify-content: center;
					align-items: center;
					border-radius: 60upx;
					font-size: 35upx;
				}
			}

			.center {
				width: 100%;
				flex-wrap: wrap;
				margin-left: 20rpx;

				.name-tel {
					width: 100%;
					justify-content: space-between;

					image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 32rpx;
					}

					.name {
						font-size: 32rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
						margin-top: 24rpx;
					}
				}

				.address {
					width: 90%;
					font-size: 28rpx;
					color: #666666;
					// margin-top: 13rpx;
				}
			}

			.right {
				flex-shrink: 0;
				align-items: center;
				margin-left: 20upx;

				.icon {
					justify-content: center;
					align-items: center;
					width: 80upx;
					height: 60upx;
					border-left: solid 1upx #aaa;
					font-size: 40upx;
					color: #777;
				}
			}
		}
	}
</style>