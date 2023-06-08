<template>
	<view>
		<view class="content dis cl al_c">
			<view class="list" v-if="addressList.length">
				<view class="row" v-for="(row,index) in addressList" :key="index" @tap="select(row)">

					<view class="center">
						<view class="name-tel">
							<view class="name">{{row.linkName}}</view>
							<view class="tel">{{row.linkMobile}}</view>
							<view class="default" v-if="row.isDefault">
								默认
							</view>
						</view>
						<view class="address">
							{{row.provinceName}}{{row.districtName}}{{row.cityName}}

						</view>
					</view>

				</view>

			</view>
			<view class="no_page dis cl al_c" v-if="!addressList.length">
				<image src="/static/icon/noAddress.png" mode="widthFix"></image>
				<view>您还未增加地址</view>
				<!-- <view class="btn" @tap="add">新增地址</view> -->
			</view>
		</view>

		<button class="btn1" @click="add">新增地址</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isSelect: false,
				addressList: []
			};
		},
		onShow() {
			this.getData()
			// uni.getStorage({
			// 	key: 'delAddress',
			// 	success: (e) => {
			// 		let len = this.addressList.length;
			// 		if (e.data.hasOwnProperty('id')) {
			// 			for (let i = 0; i < len; i++) {
			// 				if (this.addressList[i].id == e.data.id) {
			// 					this.addressList.splice(i, 1);
			// 					break;
			// 				}
			// 			}
			// 		}
			// 		uni.removeStorage({
			// 			key: 'delAddress'
			// 		})
			// 	}
			// })
			// uni.getStorage({
			// 	key: 'saveAddress',
			// 	success: (e) => {
			// 		let len = this.addressList.length;
			// 		if (e.data.hasOwnProperty('id')) {
			// 			for (let i = 0; i < len; i++) {
			// 				if (this.addressList[i].id == e.data.id) {
			// 					this.addressList.splice(i, 1, e.data);
			// 					break;
			// 				}
			// 			}
			// 		} else {
			// 			let lastid = this.addressList[len - 1];
			// 			lastid++;
			// 			e.data.id = lastid;
			// 			this.addressList.push(e.data);
			// 		}
			// 		uni.removeStorage({
			// 			key: 'saveAddress'
			// 		})
			// 	}
			// })
		},
		onLoad(e) {

			if (e.type == 'select') {
				this.isSelect = true;
			}

		},
		methods: {
			getData() {
				console.log('1----')
				this.$util.request(this.$apis.userAddress).then(r => {
					console.log('地址列表', r)
					if (r.status && r.data) {
						this.addressList = r.data
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
			add() {
				uni.navigateTo({
					url: "edit/edit?type=add"
				})
			},
			select(row) {
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if (!this.isSelect) {
					return;
				}
				uni.setStorage({
					key: 'selectAddress',
					data: row,
					success() {
						uni.navigateBack();
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
			width: 380rpx;
			height: 100rpx;
			display: flex;
			justify-content: center;
			line-height: 100rpx;
			color: #fff;
			border-radius: 46rpx 46rpx 46rpx 46rpx;
			background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
			text-align: center;
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
		height: 120rpx;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0rpx 5rpx 10rpx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80rpx;
			border-radius: 80rpx;
			background-color: #f06c7a;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30rpx;
		}
	}

	.list {
		flex-wrap: wrap;

		.row {
			width: 720rpx;
			border-bottom: 1rpx solid #eee;

			.left {
				width: 90rpx;
				flex-shrink: 0;
				align-items: center;

				.head {
					width: 70rpx;
					height: 70rpx;
					background: linear-gradient(to right, #ccc, #aaa);
					color: #fff;
					justify-content: center;
					align-items: center;
					border-radius: 60rpx;
					font-size: 35rpx;
				}
			}

			.center {
				width: 100%;
				flex-wrap: wrap;
				margin-left: 20rpx;

				.name-tel {
					width: 100%;
					align-items: baseline;

					.name {
						font-size: 34rpx;
					}

					.tel {
						margin-left: 30rpx;
						font-size: 28rpx;
						color: #777;
					}

					.default {

						font-size: 22rpx;

						background-color: #f06c7a;
						color: #fff;
						padding: 0 18rpx;
						border-radius: 24rpx;
						margin-left: 20rpx;
					}
				}

				.address {
					width: 100%;
					font-size: 28rpx;
					align-items: baseline;
					color: #777;
					margin-top: 10rpx;
				}
			}

			.right {
				flex-shrink: 0;
				align-items: center;
				margin-left: 20rpx;

				.icon {
					justify-content: center;
					align-items: center;
					width: 80rpx;
					height: 60rpx;
					border-left: solid 1rpx #aaa;
					font-size: 40rpx;
					color: #777;
				}
			}
		}
	}

	.btn1 {
		position: fixed;
		bottom: 100rpx;
		left: 30rpx;
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 26rpx;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		z-index: 10;
	}
</style>
