<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="消息中心" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true" >
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
		</u-navbar>
		<view class="card dis cl al_c" v-if="list.length">
			<view class="item dis al_c" v-for="(item,index) in list" :key="item.id" @click="toDetail(item.messageType)">
				<view class="lef">
					<view class="top dis">
						<view class="img">
							<image src="/static/icon/msg/icon1.png" mode="widthFix" v-if="item.messageType=='订单通知'"></image>
							<image src="/static/icon/msg/icon5.png" mode="widthFix" v-else-if="item.messageType=='账户通知'"></image>
							<image src="/static/icon/msg/icon3.png" mode="widthFix" v-else-if="item.messageType=='优惠券通知'"></image>
							<image src="/static/icon/msg/icon4.png" mode="widthFix" v-else></image>
							<u-badge class="badge" numberType="overflow"  :type="type" max="99" :value="item.count"></u-badge>
						</view>
						<view class="title">{{item.messageType}}</view>
					</view>
					<view class="text">{{item.messageContent}}</view>
				</view>
				<view class="rig">{{item.informDate.substring(5,16) || ''}}</view>
			</view>
		</view>
		<view class="no_data dis cl al_c" v-else>
			<image src="/static/images/no-data.png" mode="widthFix"></image>
			<view>暂无任何消息</view>
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
				list: [],
				type: "error",
				value: 100
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.getList()
		},
		methods: {
			toDetail(type) {
				console.log('----')
				uni.navigateTo({
					url: './infoList?type=' + type
				})
			},
			getList() {
				this.$util.request(this.$apis.messageInformType).then(r => {
					console.log('消息类型', r)
					if (r.status) {
						this.list = r.data
					}
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

	.card {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 24rpx;
		.item {
			width: 638rpx;
			height: 144rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;
			position: relative;
			z-index: 99;
			.lef {
				.top {
					image {
						width: 48rpx;
						height: 48rpx;
					}

					.img {
						position: relative;
					}

					.title {
						font-size: 28rpx;
						margin-left: 23rpx;
						color: #333333;
					}

					.badge {
						position: absolute;
						top:-18rpx;
						right:-28rpx;

					}
				}

				.text {
					width: 550rpx;
					font-size: 28rpx;
					color: #666666;
					margin: -12rpx 0 0 71rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; // 作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 1; // 显示的行
				}
			}

			.rig {
				position: absolute;
				font-size: 24rpx;
				color: #666666;
				margin-bottom: 70rpx;
				z-index: 10;
				right: 0rpx;
			}

		}

		.item:last-child {
			border-bottom: 1rpx solid #ffffff;
		}
	}
	.no_data{
		width: 750rpx;
		margin-top: 300rpx;
		image{
			width: 407rpx;
			height: 238rpx;
		}
		view{
			font-size: 32rpx;
			margin-top: 28rpx;
		}
	}
</style>
