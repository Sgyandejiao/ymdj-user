<template>
	<view>
		<view class="content dis cl al_c">
			<headBgImg></headBgImg>
			<u-navbar title="哪里购买" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true" >
				<view class="u-nav-slot" slot="left">
					<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
				</view>
			</u-navbar>
			<scroll-view scroll-y="true" style="height: 90vh;">
				<view class="dis cl al_c" style="width: 750rpx;">
					<view class="item dis cl al_c" v-for="(item,index) in newList" :key="item.id" @click="select(item)">
						<view class="top dis al_c">
							<view class="lef">营业时间：<text>{{item.bussinessTime}}</text> </view>
							<view class="rig t1" v-if="item.isBusiness">营业中</view>
							<view class="rig t2" v-else>暂停营业</view>
						</view>
						<view class="body dis al_c">
							<image :src="item.imgList[0]" mode="aspectFill" @click.stop="previewImg(item.imgList,index)"></image>
							<view class="info dis cl">
								<view class="name">{{item.shopName}}</view>
								<view class="address">{{item.shopAddress}}</view>
							</view>
						</view>
					</view>
					<view style="margin: 50rpx; 0" v-if="newList.length">
						<u-loadmore loadmoreText="暂无更多营业店铺了.." dashed line />
					</view>
					<view class="none_data" v-if="!newList.length">暂无营业中店铺了</view>
				</view>
			</scroll-view>
			
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
				isSelect: false,
				receiveList: [],
				status: 'nomore',
				list: [],
				communitId: '',
				newList: []
			};
		},
		onShow() {


		},
		onLoad(e) {
			console.log(e)
			if (e.communitId) {
				this.communitId = e.communitId
				this.getData()
			}

		},
		methods: {
			getData() {
				let data = {
					communityId: this.communitId
				}
				this.$util.request(this.$apis.getShopList, data).then(r => {
					console.log('取货地址列表', r)
					if (r.status) {
						let newList = []
						if (r.data.length) {

							r.data.forEach(item => {
								let timeArr = item.bussinessTime.split('-')
								item['isBusiness'] = checkAuditTime(timeArr[0], timeArr[1]) ? true : false
								item['imgList'] =item.shopImageUrl!=''?item.shopImageUrl.split(';'):[];
								if (item.isBusiness) {
									newList.push(item)
								}
							})
						}
						this.newList = newList
						this.list = r.data
						console.log('newList=', this.newList)
					}
				})


				var checkAuditTime = (beginTime, endTime) => {
					var nowDate = new Date();
					var beginDate = new Date(nowDate);
					var endDate = new Date(nowDate);

					var beginIndex = beginTime.lastIndexOf("\:");
					var beginHour = beginTime.substring(0, beginIndex);
					var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
					beginDate.setHours(beginHour, beginMinue, 0, 0);

					var endIndex = endTime.lastIndexOf("\:");
					var endHour = endTime.substring(0, endIndex);
					var endMinue = endTime.substring(endIndex + 1, endTime.length);
					endDate.setHours(endHour, endMinue, 0, 0);
					return nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime();
				}

			},
			select(row) {
				console.log(row)
				if (!row.isBusiness) {
					this.$toast('该店铺已暂停营业')
					return;
				}
				row['address'] = row.shopName+'：'+row.shopAddress
				uni.removeStorageSync('pickupInfo')
				uni.setStorageSync('pickupInfo', row)
				uni.navigateBack()
			},
			previewImg(list){
				uni.previewImage({
					urls:list,
					current:0
				})
			},
		}
	}
</script>

<style lang="scss">
	.none_data {
		width: 750rpx;

		margin-top: 300rpx;
		font-size: 30rpx;
		color: #666666;
		text-align: center;
	}

	page {
		width: 750rpx;
		background-color: #f0f0f0;
	}

	.item {
		width: 686rpx;
		height: 309rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-top: 16rpx;

		.top {
			width: 638rpx;
			height: 88rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;

			.lef {
				color: #999999;
				font-size: 28rpx;

				text {
					color: #333333;
				}
			}

			.rig {
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				// color: #F44850;

			}

			.t1 {
				color: #F44850;
			}

			.t2 {
				color: #333333;
			}
		}

		.body {
			width: 638rpx;
			margin-top: 32rpx;

			image {
				width: 158rpx;
				height: 155rpx;
				background-color: #E2E2E2;
				border-radius: 16rpx;
			}

			.info {
				width: 410rpx;
				height: 155rpx;
				margin-left: 24rpx;

				.name {
					width: 410rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; // 作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 1; // 显示的行
					font-size: 32rpx;
					font-family: PingFang SC-Bold, PingFang SC;
					font-weight: bold;
					color: #333333;
				}

				.address {
					width: 410rpx;
					font-size: 28rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-top: 8rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; // 作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 2; // 显示的行
				}
			}
		}
	}
</style>
