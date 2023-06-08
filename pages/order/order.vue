<template>
	<view>
		<headBgImg></headBgImg>
		<u-navbar title="商品订单" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon//arrow-left.png"  mode="widthFix"></image>
			</view>
		</u-navbar>
		<view class="tabs_v">
			<u-tabs :list="tabList" active-color="#2979ff" @click="click" lineColor="#F44850" :activeStyle="{
			    color: '#222222',
			    fontWeight: 'bold',
			    transform: 'scale(1.05)'
			}" itemStyle="width:70px;height: 50px;"></u-tabs>
		</view>
	
		<scroll-view scroll-y="true" style="width: 750rpx;height: 83vh;padding-top: 100rpx;">
			<view class="list dis cl al_c" v-if="orderList.length">
				<view class="card order dis cl al_c" v-for="(item,index) in orderList" :key="item.orderCode">
					<view class="top dis al_c">
						<view class="t1 dis al_c">
							<view class="text">订单号:{{item.orderId}}</view>
							<view class="copy" @click="paste(item.orderId)">复制</view>
						</view>
						<view class="order_num"> </view>
					</view>
			
					<view class="info dis al_c">
						<image :src="item.itemImage" mode="widthFix"></image>
						<view class="content dis cl">
							<view class="title">{{item.itemTitle}}</view>
							<view class="num_v dis al_c">
								<view class="price">￥{{item.itemPrice}}</view>
								<view class="num dis al_c">X{{item.itemNum}}</view>
							</view>
							<view class="from">商家：{{item.orderType}}</view>
						</view>
						<image class="tag_img" src="/static/icon/tb.png" mode="widthFix"
							v-if="current==1||item.orderType=='聚划算'||item.orderType=='淘宝'||item.orderType=='天猫'"></image>
						<image class="tag_img" src="/static/icon/jd.png" mode="widthFix" v-if="item.orderType=='京东'">
						</image>
						<image class="tag_img" style="left:225rpx;width: 80rpx;" src="/static/icon/pdd.png" mode="widthFix"
							v-if="item.orderType=='拼多多'"></image>
						<image class="tag_img" style="left:230rpx;width: 90rpx;" src="/static/icon/elem.png" mode="widthFix"
							v-if="item.orderType=='饿了么'"></image>
						<image class="tag_img" src="/static/icon/meituan.png" mode="widthFix" v-if="item.orderType=='美团'">
						</image>
					</view>
				</view>
				<view style="margin-top: 50rpx;">
					<u-loadmore loadmoreText="暂无更多订单数据" dashed line />
				</view>
			</view>
			<view class="no_data dis cl al_c" v-if="!orderList.length">
				<image src="/static/images/no-order.png" mode="widthFix"></image>
				<view>暂无订单</view>
			</view>
		</scroll-view>
		
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
				tabList: [{
						id: -1,
						name: '全部'
					},
					{
						id: 0,
						name: '淘宝'
					},
					{
						id: 1,
						name: '京东'
					},
					{
						id: 2,
						name: '拼多多'
					},
					// {
					// 	id: 3,
					// 	name: '饿了么'
					// },
					// {
					// 	id: 4,
					// 	name: '美团外卖'
					// }
				],
				current: 0,
				orderList: [],
				pageIndex: 0,
				pageSize: 10
			};
		},
		onLoad() {
			this.getData(this.pageIndex)
		},
		onReachBottom() {
			this.getData(this.pageIndex + 1)
		},
		methods: {
			getData(pageIndex) {
				let data = {
					orderFrom: this.tabList[this.current].id,
					orderListType: 0,
					orderStatus: -1,
					pageIndex: pageIndex,
					pageSize: this.pageSize
				}
				this.$util.request(this.$apis.getThirdOrderList, data).then(r => {
					console.log('订单列表', r)
					if (r.status) {
						if (pageIndex == 0) {
							this.orderList = r.data
						} else if (pageIndex > this.pageIndex) {
							this.orderList = this.orderList.concat(r.data)
							this.pageIndex = pageIndex
						}
					}
				})
			},
			click(e) {
				this.current = e.index
				this.pageIndex = 0
				this.getData(this.pageIndex)
			},
			paste(e) {
				uni.setClipboardData({
					data: e,
					success: (r) => {

					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		// padding-bottom: 50rpx;
		background-color: #f0f0f0;
	}

	.copy {
		width: 80rpx;
		height: 40rpx;
		border-radius: 50rpx;
		background-color: crimson;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
		margin-left: 12rpx;
	}

	.tabs_v {
		width: 750rpx;
		// background-color: #fff;
		// margin-top: 36rpx;
		
	}

	.info .tag_img {
		width: 60rpx;
		height: 40rpx;
		position: absolute;
		left: 230rpx;
		top: 8rpx;
		z-index: 9999;
	}

	.info {
		width: 666rpx;
		margin: 20rpx 0;
		position: relative;

		image {
			width: 220rpx;
			height: 220rpx;
			background: whitesmoke;
		}

		.content {
			height: 240rpx;
			margin-left: 12rpx;
			width: 440rpx;
			justify-content: space-between;

			// background-color: whitesmoke;
			.title {
				width: 400rpx;
				font-size: 30rpx;
				color: #333;
				text-indent: 2.8rem;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; // 作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 2; // 显示的行

			}

			.num_v {
				width: 440rpx;
				justify-content: space-between;
			}
		}

		.from {
			font-size: 28rpx;
			color: #999;
			margin-bottom: 10rpx;
		}
	}

	.no_data {
		width: 750rpx;
		margin-top: 300rpx;

		image {
			width: 220rpx;
			height: 220rpx;
		}

		view {
			font-size: 28rpx;
			color: #333;
			margin-top: 16rpx;
		}
	}

	.tabs_v {
		position: fixed;
		left: 0;
		top: 140rpx;
		z-index: 999;
		width: 750rpx;
		// height: 120rpx;
		// background-color: #fff;
		// margin-top: 36rpx;
	}

	.list {
		width: 750rpx;
		// margin-top: 120rpx;
	}

	.card {
		width: 710rpx;
		// height: 450rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.order {
		margin-top: 20rpx;

		.top {
			width: 666rpx;
			height: 70rpx;
			// justify-content: space-between;
			border-bottom: 1rpx solid #eee;

			.t1 {
				.text {
					max-width: 550rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 28rpx;
					color: #999;
					white-space: nowrap;
				}
			}


			.order_num {
				font-size: 28rpx;
				color: red;
			}
		}

		.address1,
		.address2 {
			width: 600rpx;
			font-size: 28rpx;
			margin: 30rpx 0 0 0;
		}

	}
</style>
