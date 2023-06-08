<template>

	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<view class="head_v dis cl al_c">
			<view class="search_v dis al_c">
				<view class="left_icon" @click="navBack">
					<image class="u-nav-back" src="/static/icon/arrow-left.png" mode=""></image>
				</view>
				<view style="width: 624rpx;margin-left: 12rpx;">
					<u-search placeholder="搜索以下平台的商品名称或链接" font-size="32" :bold="true" searchIconColor="#707070"
						placeholderColor="#CCCCCC" bg-color="#ffffff" :focus="true" :showAction="true" v-model="keyword"
						@search="search" @change="change" @clear="clearValue" @custom="search">
					</u-search>
				</view>
			</view>
			<view class="tabs">
				<u-tabs :list="tabs" :current="current" :is-scroll="false" lineColor="#F44850" :activeStyle="{
        color: '#303133',
        fontWeight: 'bold',
        transform: 'scale(1.05)'
    }" itemStyle="width:75px;height: 40px;fontSize:32rpx" @change="changeTabs"></u-tabs>
			</view>

		</view>
		<!-- <image class="head_img" src="/static/images/search-bg.png" mode="aspectFill"></image> -->
		<view class="card dis cl al_c" v-if="!list.length" style="width: 686rpx;">
			<view class="history dis cl al_c">
				<view class="top dis al_c">
					<view>搜索历史</view>
					<image src="/static//icon/del2.png" mode="aspectFill" @click="delHistory"></image>
				</view>
				<view class="tag_list dis" v-if="history.length">
					<view class="itm" v-for="(item,index) in history" :key="index" @click="searchHistory(item)">{{item}}
					</view>
				</view>
				<view class="no_history" v-else>暂无搜索记录</view>
			</view>
		</view>

		<view class="card bg_f0 dis cl al_c" v-if="list.length">
			<scroll-view scroll-y="true" style="width:750rpx;height: 82vh;" upper-threshold="50" lower-threshold="10"
				@scrolltolower="tolower">
				<view class="goodsList dis">
					<view class="left_list dis cl">
						<view class="item" v-for="(item,index) in leftList" :key="index" @click="toDetail(item.itemId)">
							<image class="goods_img" :src="item.itemImage" mode="aspectFill"></image>
							<view class="name dis al_c">{{item.itemTitle}}</view>
							<view class="dis al_c">
								<view class="itm_coupon" v-if="item.couponMoney">
									<image src="/static/icon/coupon.png" mode="widthFix"></image>
									<view>￥{{item.couponMoney || 0}}券</view>
								</view>
								<view class="itm_coupon">
									<image style="width: 125rpx;" src="/static/icon/quan.png" mode="widthFix"></image>
									<view style="width:120rpx;color: #654200;">跑腿券x1</view>
								</view>
							</view>
							<image class="tag_img" style="top: 385rpx;" src="/static/icon/tb.png" mode="widthFix"
								v-if="current==0"></image>
							<image class="tag_img" style="top: 385rpx;" src="/static/icon/jd.png" mode="widthFix"
								v-if="current==1"></image>
							<image class="tag_img" style="top: 385rpx;" src="/static/icon/pdd.png" mode="widthFix"
								v-if="current==2"></image>

							<view class="price_v dis">
								<view class="price"><text>￥</text>{{item.strikePrice}}</view>
								<view class="old_price">{{item.itemPrice}}</view>
							</view>
						</view>
					</view>
					<view class="right_list dis cl">
						<view class="item" v-for="(item,index) in rightList" :key="index"
							@click="toDetail(item.itemId)">
							<image class="goods_img" :src="item.itemImage" mode="widthFix"></image>
							<view class="name">{{item.itemTitle}}</view>
							<view class="dis al_c">
								<view class="itm_coupon" v-if="item.couponMoney">
									<image src="/static/icon/coupon.png" mode="widthFix"></image>
									<view>￥{{item.couponMoney || 0}}券</view>
								</view>
								<view class="itm_coupon">
									<image style="width: 125rpx;" src="/static/icon/quan.png" mode="widthFix"></image>
									<view style="width:120rpx;color: #654200;">跑腿券x1</view>
								</view>
							</view>
							<image class="tag_img" style="top: 370rpx;" src="/static/icon/tb.png" mode="widthFix"
								v-if="current==0"></image>
							<image class="tag_img" style="top: 370rpx;" src="/static/icon/jd.png" mode="widthFix"
								v-if="current==1"></image>
							<image class="tag_img" style="top: 370rpx;" src="/static/icon/pdd.png" mode="widthFix"
								v-if="current==2"></image>
							<view class="price_v dis">
								<view class="price"><text>￥</text>{{item.strikePrice}}</view>
								<view class="old_price">{{item.itemPrice}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const jdkpl = uni.requireNativePlugin("FFX-Kpl")
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data() {
			return {
				keyword: '',
				pageIndex: 1,
				tbp: 1,
				current: 0,
				leftList: [],
				rightList: [],
				list: [],
				tabs: [{
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
					}
				],
				history: []
			}
		},
		onLoad(opt) {
			uni.setStorageSync('lastPage', 5)
			if (uni.getStorageSync('history')) {
				let history = uni.getStorageSync('history')
				console.log('history', history)
				this.history = history.reverse()
			}
			if (opt.current) {
				console.log('current=', opt.current)
				this.current = Number(opt.current)
			}
		},
		mounted() {
			Alibcsdk.init(result => {
				console.log('百川初始化', result)
			});

			jdkpl.initSdk((e) => {
				console.log('jdkplInit', e);
				// e=> {"code":0/1,"message":"初始化失败/成功"}
				uni.setStorageSync('jdkplInit', e)
			});
		},
		onReachBottom() {
			// this.searchGoods(this.pageIndex + 1)
		},
		methods: {
			navBack() {
				uni.navigateBack()
			},
			delHistory() {
				this.history = []
				uni.removeStorageSync('history')
			},
			change(e) {
				console.log(e)
				if (e == '') {
					this.clearValue()
				}
			},
			search() {
				plus.nativeUI.showWaiting('加载中...')
				this.searchGoods(1)
			},
			changeTabs(e) {
				console.log(e)
				this.current = e.index
				if (this.keyword) {
					plus.nativeUI.showWaiting('加载中...')
					this.pageIndex = 1
					this.searchGoods(this.pageIndex)
				}
				if (uni.getStorageSync('history')) {
					let history = uni.getStorageSync('history')
					this.history = history.reverse()
				}
			},

			clearValue() {
				this.keyword = ''
				this.pageIndex = 1
				this.leftList = []
				this.rightList = []
				this.list = []
			},
			searchHistory(keyword) {
				this.keyword = keyword
				this.pageIndex = 1
				plus.nativeUI.showWaiting()
				this.searchGoods(this.pageIndex)
			},
			searchGoods(pageIndex) {
				let {
					keyword
				} = this

				let data = {
					keyword: keyword,
					sort: 0,
					isCoupon: 0,
					minId: pageIndex,
					itemFrom: this.current,
					tbP: pageIndex == 1 ? 1 : this.tbP
				}
				console.log('data',data)
				this.$util.request(this.$apis.superSearch, data).then(res => {
					console.log('搜索结果', res)
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 300)
					if (res.status) {
						if (res.data.length) {
							
							let list = res.data
							list = list.filter(item => {
								return !this.$checkWords(item.itemTitle)
							})
							console.log('过滤结果', list)
							if (!list.length) {
								this.$toast('未搜索到结果，请换个关键词搜索试试')
							}
							let length = list.length
							this.list = list
							this.tbP = res.tbP
							if (pageIndex == 1) {
								if (res.data.length % 2 == 0) {
									this.leftList = list.slice(0, length / 2)
									this.rightList = list.slice(length / 2, list.lenght)
								} else {
									this.leftList = length > 1 ? list.slice(0, (length + 1) / 2) : list
									this.rightList = length > 1 ? list.slice((length + 1) / 2, list.lenght) : []
								}
								console.log('leftList=', this.leftList)
								console.log('rightList=', this.rightList)
							} else if (pageIndex != 1) {
								console.log('-----追加数据')
								this.pageIndex = pageIndex
								if (res.data.length % 2 == 0) {
									this.leftList = this.leftList.concat(list.slice(0, length / 2));
									this.rightList = this.rightList.concat(list.slice(length / 2));
									console.log('leftList1=', this.leftList)
									console.log('rightList1=', this.rightList)
								} else {
									this.leftList = this.leftList.concat(length > 1 ? list.slice(0, (length) /
										2) : list);
									this.rightList = this.rightList.concat(length > 1 ? list.slice((length) /
										2 + 1) : []);
									console.log('leftList2=', this.leftList)
									console.log('rightList2=', this.rightList)
								}
							}

						} else {
							if (pageIndex == 1) {
								this.list = []
								this.leftList = []
								this.rightList = []
							}
						}
					} else {
						if (pageIndex == 1) {
							this.list = []
							this.leftList = []
							this.rightList = []
						}
						this.$toast(res.statusMessage)
					}
				})
				if (uni.getStorageSync('history')) {
					let history = uni.getStorageSync('history')
					if (JSON.stringify(history).indexOf(keyword) <= -1) {
						history.push(keyword)
						uni.setStorageSync('history', history)
					}
				} else {
					let history = []
					history.push(keyword)
					uni.setStorageSync('history', history)
				}
			},
			toDetail(id) {
				if (!this.$checkLogin()) return;
				plus.nativeUI.showWaiting('加载中...')
				setTimeout(r => {
					plus.nativeUI.closeWaiting()
				}, 1000)
				if (this.current == 2) { // 拼多多判断授权
					if (!uni.getStorageSync('pddPromstatus')) {
						this.$util.request(this.$apis.queryPddMemberAuthority).then(r => {
							console.log('查询拼多多授权', r)
							if (r.resultValue != 0) {
								this.getInfo()
								this.toPddDetail(id)
								return;
							}
							this.$util.request(this.$apis.pddAuthorize).then(r => {
								console.log('生成拼多多授权', r)
								if (r.status) {
									if (plus.runtime.isApplicationExist({
											pname: 'com.xunmeng.pinduoduo',
											action: 'pinduoduo://'
										})) {
										// 应用已安装，打开相关转链页面
										plus.runtime.openURL(r.data.schemaUrl)
									} else {
										//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
										plus.runtime.openURL(r.data.url)
									}


									setTimeout(rr => {
										this.getInfo()
									}, 1000)
								}
							})
						})
					} else {
						this.toPddDetail(id)
					}
					return;
				} else if (this.current == 1) {
					let data = {
						itemFrom: this.current,
						para: id
					}


					this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
						console.log('jd转链', r.data.schemaUrl)
						if (r.status) {
							jdkpl.openUrl({
								url: r.data.schemaUrl
							}, (e) => {
								console.log(e);
								// e=> {"code":0/1,"message":"打开失败/成功"}
							});
						} else {
							this.$toast(r.statusMessage)
						}

					})

					return;
				} else if (this.current == 0) {
					if (!uni.getStorageSync('taobaoRelationId')) { // 淘宝判断授权
						Alibcsdk.login(
							result => {
								console.log(result)
								if (result.status) {

									this.$util.request(this.$apis.taobaoAuthorize).then(r => {
										console.log('tb授权接口', r)
										Alibcsdk.getpublisher({
											url: r.resultValue,
										}, result => {
											console.log('getpublisher', result)
											setTimeout(res => {
												this.getInfo()
											}, 1000)
										});

									})

								}

								// this.showMsg(JSON.stringify(result))
							}
						)
					} else {
						// 转链
						let data = {
							itemFrom: this.current,
							para: id
						}
						this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
							console.log('tb转链', r.data.schemaUrl)
							if (r.status) {
								Alibcsdk.openurl({
									url: r.data.schemaUrl,
									nativeFailedMode: 'download'
								}, result => {
									console.log('plug.openurl', result)
								});

							} else {
								this.$toast(r.statusMessage)
							}

						})
					}
				} else if (this.current == 3 || this.current == 4) {
					let data = {
						code: this.current == 3 ? 'elem' : 'meituan'
					}
					this.$util.request(this.$apis.getActivityUrl).then(r => {
						console.log('美团/饿了么', r)
						if (r.status) {
							// 应用已安装，打开相关转链页面
							plus.runtime.openURL(r.data.schemaUrl)
						}

					})
				}



			},
			toPddDetail(id) {
				// 转链
				let data = {
					itemFrom: this.current,
					para: id
				}
				this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
					console.log('pdd转链', r)
					if (r.status) {
						if (plus.runtime.isApplicationExist({
								pname: 'com.xunmeng.pinduoduo',
								action: 'pinduoduo://'
							})) {
							// 应用已安装，打开相关转链页面
							plus.runtime.openURL(r.data.schemaUrl)
						} else {
							//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
							plus.runtime.openURL(r.data.shortUrl)
						}

					} else {
						this.$toast(r.statusMessage)
					}

				})
			},
			getInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					console.log('用户信息', res)
					if (res.status) {
						uni.setStorageSync('userId', res.data.userId)
						uni.setStorageSync('taobaoRelationId', res.data.taobaoRelationId)
						uni.setStorageSync('pddPromstatus', res.data.pddPromstatus)

					}
				})
			},
			tolower() {
				console.log('bottom')
				plus.nativeUI.showWaiting('加载中...')
				this.searchGoods(this.pageIndex + 1)
			},
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;

	}

	.head_v {
		width: 750rpx;
		position: fixed;
		top: 0;
		z-index: 9999;
		// background-color: whitesmoke;

		.search_v {
			width: 750rpx;
			padding-top: 100rpx;
			z-index: 999;

			.left_icon {

				margin-left: 20rpx;
			}
		}

		.tabs {
			z-index: 999;
		}
	}

	.head_img {
		width: 750rpx;
		height: 538rpx;
		position: fixed;
		top: 0;
		z-index: 9999;
	}

	.card {
		width: 750rpx;
		min-height: 83.5vh;
		position: relative;
		margin-top: 259rpx;
		background: #FFFFFF;
		border-radius: 32rpx;
	}

	.history {
		width: 638rpx;

		.top {
			width: 100%;
			margin-top: 32rpx;
			justify-content: space-between;

			view {
				font-size: 32rpx;
				color: #333333;
			}

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}

		.tag_list {
			width: 100%;
			margin-top: 24rpx;
			flex-wrap: wrap;

			.itm {
				background: #EEEEEE;
				border-radius: 8rpx;
				padding: 12rpx 24rpx;
				font-size: 28rpx;
				color: #333333;
				margin: 0 16rpx 16rpx 0;
			}
		}
	}

	.no_history {
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		margin-top: 78rpx;
		color: #999;
	}

	.goodsList {
		width: 750rpx;
		justify-content: space-around;
		padding-top: 20rpx;
		overflow: hidden;
		position: relative;
	}

	.goodsList .item {
		width: 100%;
		min-height: 370rpx;
		border-radius: 12rpx;
		background-color: #ffffff;
		margin: 20rpx 0;
		position: relative;

	}

	.item .tag_img {
		width: 60rpx;
		height: 40rpx;
		position: absolute;
		left: 18rpx;
		top: 380rpx;
		z-index: 999;

	}

	.item .itm_coupon {
		position: relative;
		margin-left: 18rpx;

		image {

			width: 110rpx;
			height: 40rpx;
			z-index: 98rpx;
		}

		view {
			width: 100rpx;
			height: 40rpx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			font-size: 24rpx;
			color: #fff;
			z-index: 99;
			line-height: 40rpx;
		}
	}

	.item .coupon {
		position: relative;
		left: 20rpx;
		top: 2rpx;
		width: 100%;
		height: 50rpx;
		// background-color: gray;
		// image {
		// 	width: 80rpx;
		// 	height: 40rpx;
		// }

		view {
			width: 90rpx;
			height: 40rpx;
			line-height: 40rpx;
			position: absolute;

			top: 0rpx;
			z-index: 30;
			font-size: 24rpx;

			text-align: center;
			color: #fff;
		}
	}

	.item .goods_img {
		width: 100%;
		height: 360rpx;
		border-top-left-radius: 12rpx;
		border-top-right-radius: 12rpx;
		/* background-color: whitesmoke; */
	}

	.item .name {
		width: 320rpx;
		margin: 12rpx 18rpx;
		font-size: 26rpx;
		color: #333;
		text-indent: 2.5em;
		word-wrap: break-word;
		word-break: break-all;
		white-space:pre-wrap;
	}




	.item .sale {
		margin: 0 0 12rpx 18rpx;
		font-size: 24rpx;
		color: #999999;
	}

	.item .price_v {
		margin: 0 0 12rpx 18rpx;
	}

	.item .price_v .price {
		font-size: 34rpx;
		color: red;
		font-weight: 550;
		margin-right: 12rpx;
	}

	.item .price_v .price text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.item .price_v .old_price {
		font-size: 26rpx;
		color: #dcdcdc;
		margin-top: 10rpx;
		text-decoration: line-through;
	}


	.left_list,
	.right_list {
		width: 345rpx;
		/* background-color: white; */
	}

	.dis {
		display: flex;
	}

	.cl {
		flex-direction: column;
	}

	.bg_f0 {
		background-color: #f0f0f0;
	}
</style>