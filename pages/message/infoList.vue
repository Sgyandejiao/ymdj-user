<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar :title="navTitle" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true" >
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
		</u-navbar>
		<scroll-view scroll-y="true" style="height: 90vh;">
			<view class="dis cl al_c" style="width: 750rpx;padding-bottom:50rpx;">
				<view class="card dis cl al_c">
					<view class="item dis al_c" v-for="(item,index) in list" :key="item.id" @click="toDetail(item)">
						<view class="lef">
							<view class="top dis">
								<image src="/static/icon/msg/icon1.png" mode="widthFix" v-if="item.messageType=='订单通知'"></image>
								<image src="/static/icon/msg/icon5.png" mode="widthFix" v-else-if="item.messageType=='账户通知'"></image>
								<image src="/static/icon/msg/icon3.png" mode="widthFix" v-else-if="item.messageType=='优惠券通知'"></image>
								<image src="/static/icon/msg/icon4.png" mode="widthFix" v-else></image>
								<view>{{item.messageHeadline}}</view>
							</view>
							<view class="text">{{item.messageContent}}</view>
						</view>
						<view class="rig">{{item.informDate.substring(5,16) || ''}}</view>
					</view>
				</view>
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
				list: [],
				messageType:'',
				navTitle:'',
				pageIndex:1,
				pageSize:20
			};
		},
		onLoad(opt) {
			this.messageType = opt.type
			this.navTitle = opt.type
			this.getList(this.pageIndex)
			this.readAll()
		},
		onReachBottom() {
			this.getList(this.pageIndex+1)
		},
		methods:{
			
			toDetail(item){
				if(item.messageType=='订单通知'){
					uni.navigateTo({
						url:'/pages/orderList/detail?orderCode='+item.businessId
					})
				}
			},
			getList(pageIndex){
				let data = {
					messageType:this.messageType,
					pageIndex:pageIndex,
					pageSize:this.pageSize
				}
				this.$util.request(this.$apis.messageInformList,data).then(r=>{
					console.log('消息',r)
					if(r.status){
						if(pageIndex==1){
							this.list = r.data
						}else if(pageIndex>this.pageIndex){
							this.list = this.list.concat(r.data)
							this.pageIndex = pageIndex
						}
					}
				})
			},
			readAll(){
				let data = {
					messageType:this.messageType
				}
				this.$util.request(this.$apis.readAll,data,'POST').then(r=>{
					console.log('全部已读',r)
					if(r.status){
						
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

			.lef {
				.top {
					image {
						width: 48rpx;
						height: 48rpx;
					}

					view {
						font-size: 28rpx;
						margin-left: 23rpx;
						color: #333333;
					}
				}

				.text {
					width: 550rpx;
					font-size: 28rpx;
					color: #666666;
					margin: 5rpx 0 0 71rpx;
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
				margin-bottom: 50rpx;
				z-index: 10;
				right: 50rpx;
			}

		}
		.item:last-child {
			border-bottom: 1rpx solid #ffffff;
		}
	}
</style>
