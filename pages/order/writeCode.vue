<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="添加快递信息" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
		</u-navbar>
		<scroll-view scroll-y="true" style="width:750rpx;height: 82vh;">
			<view class="list dis cl al_c">
				<view class="item dis cl al_c" v-for="(item,index) in list" :key="item.id">
					<view class="top dis al_c">
						<view class="lef dis al_c">
							<image src="/static/logo.png" mode="widthFix"></image>
							<view class="name">{{item.name}}</view>
						</view>
						<view class="rig"></view>
					</view>
					<view class="input_itm dis al_c" v-for="(son,sonIndex) in item.codeList" :key="son.id">
						<view class="lef dis al_c">
							<view class="label">取件码{{sonIndex+1}}</view>
							<input type="text" maxlength="10" v-model="son['code'+index+sonIndex]"
								@blur="blurInput($event,index,sonIndex)" >
						</view>
						<view class="rig dis al_c j_c" @click="del(index,sonIndex)">
							<image src="/static/icon/del3.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="add" @click="addCode(index)">+ 添加取件码</view>
				</view>
				<view class="no_data" v-if="!list.length">暂无驿站快递柜信息</view>
			</view>
		</scroll-view>
		<view class="btm_v">
			<view class="save_btn" @click="save">保存</view>
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
				pickCommunitId: '',
				code: ''
			};
		},
		onLoad(opt) {
			if (uni.getStorageSync('saveList') && uni.getStorageSync('codeSum')) {
				let list = uni.getStorageSync('saveList')
				let lastList = uni.getStorageSync('codeList')
				console.log('lastList', lastList)
				if (lastList && lastList.length) {
					list.forEach((item, index) => {
						lastList.forEach((son, sonIndex) => {
							if (item.name == son.name) {
								console.log('son===', son)
								let newCodelist = []
								son.codeList.forEach((son1,sonIndex1)=>{
									let itm = {}
									itm['code'+index+sonIndex1] = son1['code'+son1.index1+son1.index2]
									itm['index1'] = index
									itm['index2'] = sonIndex1
									newCodelist.push(itm)
								})
								son.codeList = newCodelist
								list[index] = son
							}
						})
					})
					console.log('对比数据=', list)
					this.list = list
				} else {
					this.list = uni.getStorageSync('saveList')
				}
				return;
			}
			if (opt.pickCommunitId) {
				this.pickCommunitId = opt.pickCommunitId
				this.getPickList()
			}
		},
		methods: {
			addCode(index) {
				let list = JSON.parse(JSON.stringify(this.list))
				let codeList = list[index].codeList
				let itm = {}
				let idx = index
				let idx1 = codeList.length
				itm['code' + idx + idx1] = ''
				itm['index1'] = idx
				itm['index2'] = idx1
				itm['id'] = (Date.now()).toString()
				codeList.push(itm)
				list[index].codeList = codeList
				console.log('list=', list)
				this.list = list
			},
			del(index, sonIndex) {
				let list = JSON.parse(JSON.stringify(this.list))
				console.log('list=',list)
				console.log('index=',index)
				console.log('sonIndex=',sonIndex)
				
				list[index].codeList.splice(sonIndex, 1)
				
				let newCodelist = []
				list[index].codeList.forEach((son,sonIndex)=>{
					let itm = {}
					itm['code'+index+sonIndex] = son['code'+son.index1+son.index2]
					itm['index1'] = index
					itm['index2'] = sonIndex
					newCodelist.push(itm)
				})
				
				list[index].codeList = newCodelist
				console.log('list1======', list)
				this.$nextTick(()=>{
					this.list = list
				})
			},
			getPickList() {
				let data = {
					communityId: this.pickCommunitId
				}
				this.$util.request(this.$apis.getPickupAddressList, data).then(r => {
					console.log('驿站快递柜列表', r)
					if (r.status) {
						r.data = r.data ? r.data : [],
							r.data.forEach(item => {
								item['codeList'] = []
							})
						this.list = r.data ? r.data : []
					}
				})
			},

			confirm() {
				if (this.payState) {
					uni.switchTab({
						url: '/pages/orderList/orderList'
					})
				} else {
					uni.navigateBack()
				}
			},

			blurInput(e, index, sonIndex) {
				console.log('e=', e)
				console.log('index=', index)
				console.log('sonIndex=', sonIndex)
				let list = JSON.parse(JSON.stringify(this.list))
				list[index].codeList[sonIndex]['code' + index + sonIndex] = e.target.value
				console.log('list=', list)
				this.list = list
			},
			save() {
				let list = this.list
				let codeSum = 0
				let newList = []
				let saveList = []
				list.forEach((item, index) => {
					item.codeList.forEach((son, sonIndex) => {
						console.log('code========', son)
						console.log('code111========', son['code' + index + sonIndex])
						let str = son['code' + index + sonIndex]
						str = str.replace(/\s*/g, "");
						if (str !== '') {
							son['index1'] = index
							son['index2'] = sonIndex
							codeSum += 1
						} else {
							item.codeList.splice(sonIndex, 1)
						}
					})
					if (item.codeList.length) {
						newList.push(item)
					}
					saveList.push(item)
				})
				// console.log('newList=', newList)
				// console.log('codeSum=', codeSum)
				// return

				uni.setStorageSync('codeList', newList) // 上一页需要（不保留空驿站）
				uni.setStorageSync('saveList', saveList) // 本页修改需要 
				uni.setStorageSync('codeSum', codeSum)
				uni.navigateBack()
			}

		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;
		padding-bottom: 140rpx;
	}

	.list {
		width: 750rpx;
		position: relative;
		z-index: 10;

		.item {
			width: 686rpx;
			background-color: #fff;
			border-radius: 24rpx;
			margin-top: 20rpx;
			padding: 10rpx 0 30rpx 0;

			.top {
				width: 638rpx;
				height: 96rpx;
				justify-content: space-between;
				border-bottom: 1rpx solid #F0F0F0;

				.lef {
					image {
						width: 48rpx;
						height: 48rpx;
						margin-right: 16rpx;
					}

					view {
						font-size: 32rpx;
						font-family: PingFang SC-中黑体, PingFang SC;
						font-weight: normal;
						color: #333333;
					}
				}

				.rig {
					font-size: 28rpx;
					color: #F44850;
				}
			}

			.input_itm {
				width: 638rpx;
				margin-top: 20rpx;
				justify-content: space-between;

				.lef {
					width: 542rpx;
					height: 80rpx;
					background: #F8F8F8;
					border-radius: 8rpx;
					// .label{
					// 	max-width: 120rpx;
					// }
					view {
						font-size: 32rpx;
						font-family: PingFang SC-常规体, PingFang SC;
						font-weight: normal;
						color: #666666;
						margin-left: 44rpx;
					}

					input {
						max-width: 340rpx;
						height: 70rpx;
						font-size: 32rpx;
						font-family: PingFang SC-中黑体, PingFang SC;
						font-weight: normal;
						color: #333333;
						// border: 1rpx solid #eee;
						padding-left: 12rpx;
						margin-left: 16rpx;
						// border-radius: 12rpx;
					}
				}

				.rig {
					width: 80rpx;
					height: 80rpx;
					background: #F8F8F8;
					border-radius: 8rpx;
					opacity: 1;
					justify-content: center;

					image {
						width: 36rpx;
						height: 36rpx;
					}
				}

			}

			.add {
				width: 638rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 8rpx;
				background: #F8F8F8;
				font-size: 32rpx;
				font-family: PingFang SC-常规体, PingFang SC;
				font-weight: normal;
				color: #333333;
				margin-top: 24rpx;
			}
		}
	}

	.no_data {
		width: 750rpx;
		text-align: center;
		margin-top: 300rpx;
		font-style: 28rpx;
		color: #999;
	}

	.btm_v {
		width: 750rpx;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		height: 120rpx;
		background-color: #fff;
		z-index: 20;
	}

	.save_btn {
		position: fixed;
		bottom: 16rpx;
		left: 32rpx;
		width: 686rpx;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 28rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		border-radius: 46rpx;
	}
</style>