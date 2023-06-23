<template>
	<view>
		<view class="content dis cl al_c">
			<!-- <headBgImg></headBgImg> -->
			<!-- <view class="search_v dis al_c" :style="{'background':'rgba(255,255,255,'+opacity+')'}"> -->
			<view class="search_v dis al_c"
				:style="{'background':'linear-gradient(to bottom,rgba(255,99,55,' +opacity+'), rgba(247,55,64,' +opacity+'))'}">
				<view style="width: 614rpx;margin-left: 32rpx;" @click="toSearch">
					<!-- <u-search placeholder="搜索商品名称" :disabled="true" borderColor="" searchIconColor="#707070" placeholderColor="#CCCCCC"
						searchIconSize="26" bgColor="#ffffff" :showAction="false" v-model="keyword"></u-search> -->
					<view class="search dis al_c">
						<image src="/static/icon/search.png" mode="widthFix"></image>
						<input type="text" maxlength="20" v-model="keyword" placeholder="搜索商品名称"
							placeholderColor="#CCCCCC" :disabled="true">
					</view>

				</view>
				<view class="rig_img dis cl al_c" @click="toOrder(0)">
					<image class="rig_icon" src="/static/icon/buyOrder.png" mode="widthFix"></image>
					<view class="title" :style="{'color':opacity==1?'#fff':' #999'}">我的订单</view>
				</view>
			</view>
			<!-- <view class="zhanwei"></view> -->
			<view class="bg-view" v-if="bannerList.length">
				<image class="banner-bgImg" :src="bannerList[swipCurrent].ancillaryImg" mode=""></image>
				<view class="bg-content dis cl al_c">
					<view class="swiper">
						<u-swiper :list="bannerList" :current="swipCurrent" keyName="masterImg" interval="3500"
							duration="1000" :circular="true" @click="swiperTap"></u-swiper>
					</view>
					<view class="from-view dis al_c">
						<image :src="item.image" v-for="(item,index) in topItems" :key="index" mode="widthFix" :lazy-load="true">
						</image>
					</view>
					<view class="killing-activity">
						<image class="bg-img" src="/static/images/buyIndex/img12.png" mode="widthFix"></image>
						<view class="top dis al_c">
							<view class="lef">
								<image src="/static/images/buyIndex/img13.png" mode="widthFix"></image>
								<view style="margin-top: -10rpx;">
									<u-count-down :time="30 * 60 * 60 * 1000" format="HH:mm:ss" autoStart
										@change="onChange">
										<view class="time">
											<view class="time__custom">
												<text
													class="time__custom__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}</text>
											</view>
											<text class="time__doc">:</text>
											<view class="time__custom">
												<text class="time__custom__item">{{ timeData.minutes }}</text>
											</view>
											<text class="time__doc">:</text>
											<view class="time__custom">
												<text class="time__custom__item">{{ timeData.seconds }}</text>
											</view>
										</view>
									</u-count-down>
								</view>
							</view>
							<view class="rig dis al_c">
								<view class="time-itm dis cl al_c" v-for="(item,index) in fastBuyList" :key="index"
									v-if="fastBuyList.length>0">
									<view class="time-num">{{item.time}}</view>
									<view :class="['text',index==0?'act':'']">{{index==0?'抢购中':'即将开抢'}}</view>
								</view>
							</view>
						</view>
						<view class="data dis al_c" v-if="fastBuyList.length>0">
							<view class="itm" v-for="(item,index) in fastBuyList[0].itemList" :key="index"
								@click="toDetail(item.itemId,item.itemFrom)">
								<image class="itm-img" :src="item.itemImage" mode="widthFix"></image>
								<view class="btn dis al_c">
									<image src="/static/images/buyIndex/img14.png" mode="widthFix" :lazy-load="true"></image>
									<view><text>￥</text>{{item.itemPrice}}</view>
								</view>
							</view>

						</view>
					</view>
				</view>
			</view>

			<view class="activity dis al_c">
				<view class="itm" @click="toWeb(highItems)">
					<view class="top dis al_c">
						<image src="/static/images/buyIndex/img10.png" mode="widthFix"></image>
						<view>超高返佣</view>
					</view>
					<view class="dis al_c" style="margin-left:20rpx;">
						<image class="goods-img" :src="item" mode="widthFix" v-for="(item,index) in highItems.image" 
							:key="index" :lazy-load="true"></image>
					</view>
				</view>
				<view class="itm" @click="toWeb(lowPricePinkageData)">
					<view class="top dis al_c">
						<image src="/static/images/buyIndex/img11.png" mode="widthFix"></image>
						<view>包邮送到家</view>
					</view>
					<view class="dis al_c" style="margin-left:20rpx;">
						<image class="goods-img" :src="item" mode="widthFix"
							v-for="(item,index) in lowPricePinkageData.image" :key="index" :lazy-load="true"></image>
					</view>
				</view>
			</view>
			<view class="brand-activity dis cl al_c">
				<image class="top-img" :src="tbLiveItemData.image" mode="widthFix" @click="toWeb(tbLiveItemData)">
				</image>
				<view class="dis al_c">
					<view class="left">
						<view class="brand-view dis cl al_c" @click="toWeb({url:brandDataUrl})">
							<image class="bg-img" src="/static/images/buyIndex/img3.png" mode="widthFix"></image>
							<image class="bg-top" src="/static/images/buyIndex/img2.png" mode="widthFix"></image>
							<view class="info" v-if="brandData.brandName!=''">
								<view class="brand-info dis al_c">
									<image :src="brandData.brandLogo" mode="widthFix"></image>
									<view class="text">
										<view class="name">{{brandData.brandName}}</view>
										<view class="introduce">{{brandData.introduce}}</view>
									</view>
								</view>
								<block v-if="brandData.items.length">
									<view class="goods-item dis al_c" v-for="(item,index) in brandData.items"
										:key="index" @click.stop="toDetail(item.itemId,item.itemFrom)">
										<image class="goods-img" :src="item.itemImage" mode="widthFix" :lazy-load="true"></image>
										<view class="data">
											<view class="price dis al_c">￥{{item.activityPrice}}
												<text style="text-decoration: line-through;">￥{{item.itemPrice}}</text>
											</view>
											<view class="sale">已售{{item.itemSale}}件</view>
											<view class="coupon">
												<image src="/static/icon/coupon3.png" mode="widthFix"></image>
												<view>{{item.couponMoney}}元</view>
											</view>
										</view>
									</view>
								</block>
							</view>
						</view>
						<image class="btm-img" :src="freeShippingData.image" mode="widthFix" :lazy-load="true" @click="toWeb(freeShippingData)"></image>
					</view>
					<view class="right">
						<image class="btm-img" :src="maoChaoData.image" mode="widthFix"
							style="margin-top: -20rpx;margin-bottom: 10rpx;" :lazy-load="true" @click="toWeb(maoChaoData)"></image>
						<view class="brand-view dis cl al_c" style="margin-top: 0rpx;" @click="toWeb({url:handSampleDataUrl})">
							<image class="bg-img" src="/static/images/buyIndex/img8.png" mode="widthFix"></image>
							<image class="bg-top" src="/static/images/buyIndex/img9.png" mode="widthFix"
								style="margin-bottom: 0"></image>
							<view class="info" style="margin-top: margin-top:21rpx;">
								<view class="goods-item dis" style="height: 176rpx;margin-top:0rpx;margin-bottom:12rpx;"
									v-for="(item,index) in handSampleDataList" :key="index" @click.stop="toDetail(item.itemId,item.itemFrom)">
									<image class="goods-img" :src="item.itemImage" mode="widthFix" :lazy-load="true">
									</image>
									<view class="data">
										<view class="name">{{item.itemTitle}}</view>
										<view class="remark">{{item.itemShortTitle}}</view>
										<view class="price dis al_c"><text
												style="font-size: 18rpx;color:#FA2C18;">抢购价</text>￥{{item.activityPrice}}
											<text style="text-decoration: line-through;">￥{{item.itemPrice}}</text>
										</view>
									</view>
									<view class="store dis al_c">
										<image src="/static/images/buyIndex/store.png" mode="widthFix"></image>
										<view>{{item.shopname}}</view>
									</view>
								</view>

							</view>
						</view>

					</view>
				</view>
			</view>
			<view class="tabs-view" :style="{top:stickyTop+'rpx'}">
				<view class="tabs"> <u-tabs :current="navCurrent" :list="tabs"
						itemStyle=" height: 54px;width:120rpx;padding:0 15px;"></u-tabs></view>
				<view class="nav_v dis al_c">
					<view class="item dis al_c" @click="changetType(0)">
						<image class="na_img0" src="/static/icon/home/tb.png" mode="widthFix"></image>
						<view class="title">淘宝</view>
					</view>
					<view class="item dis al_c" @click="changetType(1)">
						<image class="na_img0" src="/static/icon/home/jd.png" mode=""></image>
						<view class="title">京东</view>
					</view>
					<view class="item dis al_c" @click="changetType(2)">
						<image class="na_img0" src="/static/icon/home/pdd.png" mode=""></image>
						<view class="title">拼多多</view>
					</view>
					<view class="item dis al_c" @click="buyVeget" v-if="!isShenhe">
						<image class="na_img0" src="/static/icon/home/mc.png" mode=""></image>
						<view class="title">买菜</view>
					</view>

				</view>

				<view class="tabs_v">
					<u-tabs :list="tabList" :current="tabsCurrent" lineColor="#F5F5F5" :duration="200" :activeStyle="{
		    color: '#303133',
		    fontWeight: 'bold'
		}" itemStyle="height: 80rpx;background:rgba(0,0,0,0);fontSize:26rpx;" @click="click"></u-tabs>
				</view>
			</view>

			<view class="list_v">
				<view class="page_content dis">
					<view class="left_list dis cl">
						<view class="item" v-for="(item,index) in leftList" :key="index" @click="toDetail(item.itemId)">
							<image class="goods_img" :src="item.itemImage" mode="aspectFill"></image>
							<view class="name dis al_c">{{item.itemTitle}}</view>
							<view class="dis al_c">
								<view class="itm_coupon" v-if="item.couponMoney">
									<image src="/static/icon/coupon.png" mode="widthFix"></image>
									<view>￥{{item.couponMoney}}券</view>
								</view>
								<view class="itm_coupon">
									<image style="width: 125rpx;" src="/static/icon/quan.png" mode="widthFix">
									</image>
									<view style="width:120rpx;color: #654200;">跑腿券x1</view>
								</view>
							</view>
							<image class="tag_img" src="/static/icon/tb.png" mode="widthFix" v-if="fromType==0">
							</image>
							<image class="tag_img" src="/static/icon/jd.png" mode="widthFix" v-if="fromType==1">
							</image>
							<image class="tag_img" style="top: 391rpx;" src="/static/icon/pdd.png" mode="widthFix"
								v-if="fromType==2"></image>
							<view class="price_v dis">
								<view class="price"><text>￥</text>{{item.strikePrice}}</view>
								<view class="old_price">{{item.itemPrice}}</view>
							</view>
						</view>
					</view>
					<view class="right_list dis cl">
						<view class="item" v-for="(item,index) in rightList" :key="index"
							@click="toDetail(item.itemId)">
							<image class="goods_img" :src="item.itemImage" mode="aspectFill"></image>
							<view class="name">{{item.itemTitle}}</view>
							<view class="dis al_c">
								<view class="itm_coupon" v-if="item.couponMoney">
									<image src="/static/icon/coupon.png" mode="widthFix"></image>
									<view>￥{{item.couponMoney}}券</view>
								</view>
								<view class="itm_coupon">
									<image style="width: 125rpx;" src="/static/icon/quan.png" mode="aspectFill">
									</image>
									<view style="width:120rpx;color: #654200;">跑腿券x1</view>
								</view>
							</view>
							<image class="tag_img" src="/static/icon/tb.png" mode="widthFix" v-if="fromType==0">
							</image>
							<image class="tag_img" src="/static/icon/jd.png" mode="widthFix" v-if="fromType==1">
							</image>
							<image class="tag_img" style="top: 391rpx;" src="/static/icon/pdd.png" mode="widthFix"
								v-if="fromType==2"></image>
							<view class="price_v dis">
								<view class="price"><text>￥</text>{{item.strikePrice}}</view>
								<view class="old_price">{{item.itemPrice}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="no_data dis cl al_c" v-if="!leftList.length&&!rightList.length">
					<image src="/static/images/no-order.png" mode="widthFix"></image>
					<view>暂无商品</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const jdkpl = uni.requireNativePlugin("FFX-Kpl")
	import headBgImg from '@/components/headBgImg.vue'
	import tool from '@/components/tool.vue'
	let maskView = null,
		maskView1 = null
	export default {
		mixins: [tool],
		components: {
			headBgImg
		},
		data() {
			return {
				stickyTop: 210,
				keyword: '',
				tabList: [],
				fromType: 0, // 0淘宝;1京东;2拼多多
				tabsCurrent: 0,
				navCurrent: 0,
				leftList: [],
				rightList: [],
				pageIndex: 1,
				minId: '',
				tbP: '',
				scrollTop: 0,
				isShenhe: true,
				isJump: false,
				timeData: {},
				topItems: [{
					title: '淘宝',
					image: '/static/images/buyIndex/img15.png',
					url: ''
				}, {
					title: '京东',
					image: '/static/images/buyIndex/img16.png',
					url: ''
				}, {
					title: '拼多多',
					image: '/static/images/buyIndex/img17.png',
					url: ''
				}, {
					title: '抖音',
					image: '/static/images/buyIndex/img18.png',
					url: ''

				}],
				tabs: [{
					name: '淘宝'
				}, {
					name: '京东'
				}, {
					name: '拼多多'
				}, {
					name: '买菜'
				}],
				bannerList: [],
				swipCurrent: 0,
				list1: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],
				fastBuyList: [],
				highItems: [],
				lowPricePinkageData: [],
				opacity: 0,
				oldTop: 0,
				tbLiveItemData: {},
				brandData: {
					brandName: '',
					items: []
				},
				handSampleDataList: [],
				freeShippingData: {
					image: '/static/images/buyIndex/img4.png'
				},
				maoChaoData: {
					image: '/static/images/buyIndex/img7.png'
				},
				handSampleDataUrl:'',
				brandDataUrl:''
			};
		},
		onShow() {
			uni.setStorageSync('lastPage', 5)
			if (uni.getStorageSync('isShenhe') == 0) {
				this.isShenhe = false
			}
			this.closeWebview()
			this.isJump = false
			if (!uni.getStorageSync('ftoken') || !uni.getStorageSync('phone')) {
				this.showTabMask()
			}
		},

		onLoad() {
		uni.navigateTo({
			url:'/pages/shopping/buyWeb'
		})
			// this.tabsCurrent = 0
			// this.getAllData()

		},
		onHide() {
			setTimeout(() => {
				this.isJump = false
				this.hideMask()
			}, 300)
		},
		mounted() {
			Alibcsdk.init(result => {
				// console.log('百川初始化', result)
			});
			jdkpl.initSdk((e) => {
				// console.log('京东开普勒初始化', e);
				uni.setStorageSync('jdkplInit', e)
			});
		},

		methods: {

			getAllData() {
				plus.nativeUI.showWaiting()
				this.getIndexData()

			},
			onChange(e) {
				// console.log(e)
				this.timeData = e
			},
			buyVeget() {
				uni.navigateTo({
					url: '/pages/shopping/buyVegetables'
				})
			},
			changeTab() {

			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/home/search'
				})
			},
			click(e) {
				this.tabsCurrent = e.index
				this.pageIndex = 1
				plus.nativeUI.showWaiting()
				this.getGoodsList(this.tabList[this.tabsCurrent].id, 1, 1)
			},
			tolower() {
				plus.nativeUI.showWaiting()
				this.getGoodsList(this.tabList[this.tabsCurrent].id, this.minId, this.tbP)
			},
			rightClick() {

				uni.navigateTo({
					url: '/pages/home/search?current=' + this.fromType
				})
			},
			changetType(index) {
				if (index == this.fromType) {
					return
				}
				plus.nativeUI.showWaiting()
				this.fromType = index
				this.tabsCurrent = 0
				this.pageIndex = 1
				this.navCurrent = index
				this.getTab()
			},
			async getIndexData() {
				this.$util.request(this.$apis.getBannerInfo, '', 'POST').then(r => {
					console.log('广告图', r)
					if (r.status) {
						this.bannerList = r.data
					}
				})
				this.$util.request(this.$apis.mainAggregate).then(r => {
					console.log('聚合数据', r)
					if (r.status) {
						// this.topItems = r.data.topItems	
						r.data.fastBuyList.forEach(item => {
							item['time'] = item.dateTime.substr(11, 5)
						}) // 秒杀列表
						this.fastBuyList = r.data.fastBuyList
						r.data.highItems['image'] = r.data.highItems.image.indexOf(';') != -1 ? r.data
							.highItems
							.image.split(';') : r.data.highItems.image;
						r.data.lowPricePinkageData['image'] = r.data.lowPricePinkageData.image.indexOf(';') !=
							-1 ?
							r.data.lowPricePinkageData.image.split(';') : r.data.lowPricePinkageData.image;
						this.highItems = r.data.highItems
						this.lowPricePinkageData = r.data.lowPricePinkageData
						this.tbLiveItemData = r.data.tbLiveItemData
						this.brandData = r.data.brandData
						this.handSampleDataList = r.data.handSampleDataList
						this.freeShippingData = r.data.freeShippingData
						this.maoChaoData = r.data.maoChaoData
						this.brandDataUrl = r.data.brandDataUrl
						this.handSampleDataUrl = r.data.handSampleDataUrl
					} else {
						this.$toast(r.statusMessage)
					}
					this.getTab()
				})
			},
			toChangeLink(url) {
				this.changeLink(url, 'page')
			},
			toDetail(id, fromType) {
				fromType = fromType ? fromType : this.fromType
				if (!this.$checkLogin()) return;
				plus.nativeUI.showWaiting()
				setTimeout(r => {
					plus.nativeUI.closeWaiting()
				}, 1000)
				if (fromType == 2) { // 拼多多判断授权
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
									plus.share.getServices(res => {
										this.sweixin = res.find(i => i.id === 'weixin')
										if (this.sweixin) {
											// 分享跳转到微信小程序
											this.sweixin.launchMiniProgram({
												id: r.data
													.user_name, // 	关联微信小程序的原始ID（"g_"开头的字符串）
												path: r.data
													.page_path, //	打开小程序的页面路径，不传默认跳转首页
												type: 0 // 	微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
											}, res => {
												// console.log('成功唤起微信小程序');
											}, err => {
												// console.log('失败');
											})
										} else {
											// 没有获取到微信分享服务
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
										}
									}, err => {
										// 获取分享服务列表失败
										if (plus.runtime.isApplicationExist({
												pname: 'com.xunmeng.pinduoduo',
												action: 'pinduoduo://'
											})) {
											// 应用已安装，打开相关转链页面
											plus.runtime.openURL(r.data.schemaUrl)
										} else {
											//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
											plus.runtime.openURL(r.data.url)
											setTimeout(rr => {
												uni.navigateTo({
													url: '/pages/home/web'
												})
											}, 100)
										}
									});
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
				} else if (fromType == 1) {
					let data = {
						itemFrom: fromType,
						para: id
					}
					this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
						console.log('jd转链', r.data)
						if (r.status) {
							if (plus.runtime.isApplicationExist({
									pname: 'com.jingdong.app.mall',
									action: 'openApp.jdMobile://'
								})) {
								jdkpl.openUrl({
									url: r.data.schemaUrl
								}, (e) => {
									// console.log(e);
									// e=> {"code":0/1,"message":"打开失败/成功"}
								});
							} else {
								//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
								this.$toast('应用未安装，请先安装应用')
								// console.log("应用未安装");
							}

						} else {
							this.$toast(r.statusMessage)
						}

					})

					return;
				} else if (fromType == 0) {
					if (!uni.getStorageSync('taobaoRelationId')) { // 淘宝判断授权
						Alibcsdk.login(
							result => {
								// console.log(result)
								if (result.status) {
									this.$util.request(this.$apis.taobaoAuthorize).then(r => {
										console.log('tb授权接口返回', r)
										Alibcsdk.getpublisher({
											url: r.resultValue,
										}, result => {
											setTimeout(res => {
												this.getInfo()
											}, 1000)
										});

									})

								}
							}
						)
					} else {
						// 转链
						let data = {
							itemFrom: fromType,
							para: id
						}
						this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
							console.log('tb转链', r)
							if (r.status) {
								Alibcsdk.openurl({
									url: r.data.schemaUrl,
									nativeFailedMode: 'download'
								}, result => {});

							} else {
								this.$toast(r.statusMessage)
							}

						})
					}
				} else if (fromType == 3 || fromType == 4) {
					let data = {
						code: fromType == 3 ? 'elem' : 'meituan'
					}
					this.$util.request(this.$apis.getActivityUrl).then(r => {
						// console.log('美团/饿了么', r)
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
					itemFrom: this.fromType,
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
					// console.log('用户信息', res)
					if (res.status) {
						uni.setStorageSync('userId', res.data.userId)
						uni.setStorageSync('taobaoRelationId', res.data.taobaoRelationId)
						uni.setStorageSync('pddPromstatus', res.data.pddPromstatus)

					}
				})
			},
			async getTab() {
				let data = {
					itemFrom: this.fromType
				}
				this.$util.request(this.$apis.getProductCategory, data).then(r => {
					console.log('类目', r)
					if (r.status) {
						this.tabList = r.data
						this.getGoodsList(r.data[0].id, this.pageIndex)
					} else {
						plus.nativeUI.closeWaiting()
						this.$toast(r.statusMessage)
					}

				})
			},
			getGoodsList(id, pageIndex, tbP) {
				let data = {
					cid: id,
					itemFrom: Number(this.fromType),
					minId: pageIndex,
					tbP: tbP
				}
				// console.log('列表data=', data)
				this.$util.request(this.$apis.itemList, data).then(res => {
					// console.log('列表', res)
					if (res.data.length) {
						let length = res.data.length
						let list = res.data
						this.minId = res.minId
						this.tbP = res.tbP
						if (pageIndex == 1) {
							if (res.data.length % 2 == 0) {
								this.leftList = list.slice(0, length / 2)
								this.rightList = list.slice(length / 2, list.lenght)
							} else {
								this.leftList = length > 1 ? list.slice(0, (length + 1) / 2) : list
								this.rightList = length > 1 ? list.slice((length + 1) / 2, list.lenght) : []
							}
						} else if (pageIndex != 1) {
							if (res.data.length % 2 == 0) {
								this.leftList = this.leftList.concat(list.slice(0, length / 2))
								this.rightList = this.rightList.concat(list.slice(length / 2))

							} else {
								this.leftList = this.leftList.concat(length > 1 ? list.slice(0, (length) /
									2) : list)
								this.rightList = this.rightList.concat(length > 1 ? list.slice((length) /
									2 + 1) : [])
							}
							this.pageIndex = pageIndex
						}
					}
					plus.nativeUI.closeWaiting()
				})
			},
			toOrder() {
				if (!this.$checkLogin()) return;
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			toWeb(e) {
				if (!this.$checkLogin()) return;
				uni.setStorageSync('webData', e)
				uni.navigateTo({
					url: '/pages/shopping/buyWeb'
				})
			},
			swiperTap(e) {
				// console.log(e)
				this.toChangeLink(this.bannerList[e].linkUrl)
			},
			closeWebview() {
				plus.webview.close('test');
			},
			jumpDestination(e) {
				// console.log('--------')
				if (this.isJump) return;
				this.isJump = true
				if (!this.$checkLogin()) return;
			},

			hideMask() {
				if (maskView) {
					maskView.hide()
					maskView1.hide()
				}
			},
			showTabMask() {
				// console.log('-----------')
				if (!maskView) {
					maskView = new plus.nativeObj.View('test', {
						bottom: '0px',
						left: '25%',
						height: '7%',
						width: '25%'
					});
					maskView1 = new plus.nativeObj.View('test', {
						bottom: '0px',
						left: '76%',
						height: '7%',
						width: '25%'
					});
					maskView.drawRect({
						color: 'rgba(255, 255, 255, 0)'
					})
					maskView1.drawRect({
						color: 'rgba(255, 255, 255, 0)'
					})
					maskView.addEventListener('click', () => {
						this.jumpDestination()
					}, false)
					maskView1.addEventListener('click', () => {
						this.jumpDestination()
					}, false)
					maskView.show()
					maskView1.show()
				} else {
					maskView.show()
					maskView1.show()
					// console.log('22222222')
				}

			}
		},

		onPullDownRefresh() {
			console.log('refresh')
			uni.stopPullDownRefresh()
			this.getAllData()
		},
		onReachBottom() {
			plus.nativeUI.showWaiting()
			this.getGoodsList(this.tabList[this.tabsCurrent].id, this.minId, this.tbP)
		},
		created() {

		},
		onPageScroll(e) {
			let scroll = e.scrollTop
			let opacity = this.opacity
			let intScroll = Number.parseInt(scroll / 5)
			// console.log('scroll', scroll)
			// console.log('intScroll', intScroll)
			if (scroll > 0) {
				if (scroll <= 10) {
					this.opacity = 0
				} else if (scroll > 10 && scroll < 20) {
					this.opacity = 0.1
				} else if (scroll > 20 && scroll < 30) {
					this.opacity = 0.2
				} else if (30 < scroll && scroll <= 40) {
					this.opacity = 0.3
				} else if (40 < scroll && scroll <= 50) {
					this.opacity = 0.4
				} else if (50 < scroll && scroll <= 60) {
					this.opacity = 0.5
				} else if (60 < scroll && scroll <= 70) {
					this.opacity = 0.6
				} else if (70 < scroll && scroll <= 80) {
					this.opacity = 0.7
				} else if (80 < scroll && scroll <= 90) {
					this.opacity = 0.8
				} else if (90 < scroll && scroll <= 100) {
					this.opacity = 0.9
				} else if (scroll > 110) {
					this.opacity = 1
				}
			}


		},
	}
</script>

<style lang="scss">
	@import '~@/common/scss/mixins.scss';

	page {
		// position: fixed;
		width: 750rpx;
		background-color: #F5F5F5;
		padding-bottom: 100rpx;
	}

	.search_v {
		width: 750rpx;
		height: 120rpx;
		padding-top: 100rpx;
		position: fixed;
		top: 0;
		z-index: 1001;

		// background-color: #f4f4f4;
		.search {
			width: 589rpx;
			height: 68rpx;
			background: linear-gradient(to bottom, #FFDED3, #FFFFFF, #FFFFFF);
			border-radius: 50rpx;

			image {
				@include setBox(32rpx, 32rpx);
				margin-left: 30rpx;
			}

			input {
				width: 428rpx;
				height: 100%;
				margin-left: 12rpx;
				font-size: 28rpx;
			}
		}

		.rig_icon {
			width: 48rpx;
			height: 48rpx;

		}

		.rig_img {
			position: relative;
			margin-left: 20rpx;

			.title {
				font-size: 20rpx;
				color: #999;
			}

			.box {
				// width: 50rpx;
				// height: 50rpx;
				border-radius: 50rpx;
			}

			.badge {
				position: absolute;
				top: -18rpx;
				right: -28rpx;

			}

		}
	}

	.tabs {
		width: 710rpx;
		height: 90rpx;
		position: relative;
		z-index: 0;
	}

	.nav_v {
		width: 710rpx;
		height: 80rpx;
		justify-content: space-around;
		// margin-top: 197rpx;
		background: #FFFFFF;
		border: 2rpx solid #FFFFFF;
		border-radius: 20rpx;
		margin-top: -80rpx;
		position: relative;
		z-index: 10;
		margin-left: 20rpx;

		// margin-top: 28rpx;
		.item {
			.na_img0 {
				width: 30rpx;
				height: 30rpx;
			}

			view {
				font-size: 30rpx;
				margin-left: 8rpx;
			}
		}
	}



	.tabs_v {
		width: 750rpx;
		background-color: #f5f5f5;
		// position: relative;
		// top: 370rpx;
		// left: 0;
		// z-index: 999;
	}

	.list_v {
		// position: relative;
		// top: 370rpx;
		// z-index: 10;
	}

	.page_content {
		width: 750rpx;
		justify-content: space-around;
		overflow: hidden;
		// position: relative;
		// z-index: 1;
	}

	.page_content .item {
		width: 100%;
		min-height: 370rpx;
		border-radius: 12rpx;
		background-color: white;
		margin: 20rpx 0;
		position: relative;

	}

	.item .tag_img {
		width: 60rpx;
		height: 40rpx;
		position: absolute;
		left: 18rpx;
		top: 383rpx;
		z-index: 100;
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


	.item .goods_img {
		width: 100%;
		height: 360rpx;
		border-top-left-radius: 12rpx;
		border-top-right-radius: 12rpx;
		// /* background-color: whitesmoke; */
	}

	.item .name {
		width: 320rpx;
		margin: 12rpx 18rpx;
		font-size: 26rpx;
		color: #333;
		text-indent: 2.5em;
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-wrap;
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

	.tabs_v {
		width: 750rpx;
		// height: 80rpx;
		// background-color: #f0f0f0;
		// margin-top: 36rpx;
		// position: fixed;
		// top: 140rpx;
		// left: 0;
		// z-index: 999;
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

	.zhanwei {
		width: 100%;
		height: 200rpx;
	}

	.brand-activity {
		width: 100%;
		margin-top: 20rpx;

		.top-img {
			width: 710rpx;
			height: 180rpx;
			margin-bottom: 20rpx;
		}

		.brand-view {
			width: 345rpx;
			position: relative;

			.bg-img {
				width: 345rpx;
				height: 468rpx;
			}

			.bg-top {
				width: 214rpx;
				height: 52rpx;
				position: absolute;
				top: 0;
				left: 62rpx;
				z-index: 10;
			}

			.info {
				position: absolute;
				left: 0;
				top: 0;

				.brand-info {
					width: 345rpx;
					margin-top: 78rpx;

					image {
						width: 80rpx;
						height: 80rpx;
						margin-left: 12rpx;
					}

					.text {
						height: 80rpx;
						justify-content: space-around;
						margin-left: 10rpx;

						.name {
							width: 50rpx;
							@include textOverHidden(1);
							font-weight: 500;
							font-size: 24rpx;
							color: #FFFFFF;
						}

						.introduce {
							width: 240rpx;
							font-size: 19rpx;
							color: #FFFFFF;
							@include textOverHidden(2)
						}
					}
				}

				.goods-item {
					@include setBox(325rpx, 130rpx);
					background-color: #fff;
					border-radius: 12rpx;
					margin: 18rpx 0 0 10rpx;

					.goods-img {
						@include setBox(110rpx, 110rpx);
						margin-left: 13rpx;
					}

					.data {
						height: 120rpx;
						margin-left: 12rpx;

						.price {
							font-size: 26rpx;
							font-family: DIN Alternate-Bold, DIN Alternate;
							font-weight: bold;
							color: #FA2C18;

							text {
								font-size: 18rpx;
								font-family: PingFang SC-Regular, PingFang SC;
								font-weight: 400;
								color: #999999;
								margin-left: 4rpx;

							}
						}

						.sale {
							font-size: 20rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							margin-top: 2rpx;
						}

						.coupon {
							@include setBox(83rpx, 27rpx);
							position: relative;
							margin-top: 15rpx;

							image {
								@include setBox(83rpx, 27rpx);
							}

							view {
								height: 27rpx;
								line-height: 27rpx;
								position: absolute;
								top: 10rpx;
								left: 32rpx;
								font-size: 18rpx;
								color: #FA2C18;

							}
						}
					}
				}
			}
		}

		.btm-img {
			margin: 0;
			padding: 0;
			width: 345rpx;
			height: 180rpx;
			margin-top: 20rpx;
			border-radius: 20rpx;
			background-color: #f5f5f5;
		}

		.right {
			margin-left: 20rpx;

			.btm-img {
				margin: 0 0 20rpx 0;
			}

			.bg-top {
				@include setBox(266rpx, 42rpx);
				position: absolute;
				top: 21rpx;
				left: 20rpx;
				z-index: 10;
			}

			.info {
				top: 84rpx;
			}

			.goods-item {
				position: relative;
				width: 325rpx;
				height: 176rpx;
				background-color: #999999;
				margin: 18rpx 0 0 10rpx;
				.goods-img,
				.data {
					
					margin-top: 10rpx;
				}

				.name {
					font-size: 24rpx;
					color: #333333;
					width: 181rpx;
					font-weight: 550;
					@include textOverHidden(1)
				}

				.remark {
					min-width: 125rpx;
					max-width: 151rpx;
					height: 27rpx;
					border-radius: 50rpx;
					text-align: center;
					line-height: 27rpx;
					font-size: 18rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #FA2C18;
					background: rgba(250, 44, 24, 0.05);
					margin-top: 8rpx;
					@include textOverHidden(1)
				}

				.price {
					width: 181rpx;
					@include textOverHidden(1);
					margin: 14rpx 0 0 0;
				}

				.store {
					position: absolute;
					top: 135rpx;
					left: 10rpx;
					z-index: 10;
					min-width: 166rpx;
					height: 30rpx;
					background: linear-gradient(to right, rgba(250, 44, 24, 0.2), rgba(255, 255, 255, 0));
					border-radius: 50rpx;

					image {
						@include setBox(24rpx, 24rpx);
						margin-left: 10rpx;
					}

					view {
						font-size: 21rpx;
						color: #FA2C18;
						margin-left: 6rpx;
					}
				}
			}
		}
	}

	.activity {
		width: 710rpx;
		margin-top: 300rpx;
		justify-content: space-between;

		.itm {
			@include setBox(345rpx, 220rpx);
			background: linear-gradient(to bottom, #FFEFEA, #FFFFFF);
			border-radius: 20rpx;

			.top {
				margin: 20rpx 0 0 20rpx;

				image {
					@include setBox(134rpx, 38rpx);
				}

				view {
					font-size: 23rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #777777;
					margin-left: 4rpx;
				}
			}

			.goods-img {
				@include setBox(150rpx, 150rpx);
				margin-right: 5rpx;
				margin-top: 12rpx;
			}
		}
	}

	.killing-activity {
		width: 750rpx;
		height: 373rpx;
		position: relative;
		margin-top: 20rpx;

		.bg-img {
			width: 750rpx;
			height: 373rpx;

		}

		.top {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 10;
			width: 710rpx;
			margin-left: 30rpx;

			.lef {
				image {
					@include setBox(140rpx, 39rpx);
					margin-top: 20rpx;
				}
			}

			.rig {
				margin-left: 80rpx;
				// width: 400rpx;
				// background-color: #999;
				justify-content: space-around;

				.time-itm {
					margin-right: 25rpx;

					.time-num {
						font-size: 38rpx;
						font-weight: 500;
						color: #FFFFFF;
					}

					.text {
						@include setBox(82rpx, 28rpx);
						text-align: center;
						line-height: 28rpx;
						font-size: 18rpx;
						margin-top: 4rpx;
						border-radius: 50rpx;
					}

					.act {
						background: #FFFFFF;
						color: #FF4C20;
					}
				}
			}
		}

		.data {
			position: absolute;
			left: 30rpx;
			top: 130rpx;
			z-index: 10;
			width: 710rpx;

			.itm {
				width: 220rpx;
				position: relative;
				margin: 0 50rpx 0 0;
				border-radius: 20rpx;

				.itm-img {
					@include setBox(195rpx, 195rpx);
					border-radius: 20rpx;
					background-color: #fff;
				}

				.btn {
					position: absolute;
					left: 21rpx;
					top: 192rpx;
					@include setBox(157rpx, 40rpx);
					border-radius: 50rpx;
					background: linear-gradient(to bottom, #FF6337, #F73740);

					image {
						@include setBox(51rpx, 100rpx);
						// margin-left: 16rpx;
						position: absolute;
						top: -15rpx;
						left: 6rpx;
						z-index: 20;
					}

					view {
						font-size: 30rpx;
						font-family: DIN Alternate-Bold, DIN Alternate;
						font-weight: bold;
						color: #FFFFFF;
						margin-left: 50rpx;

						text {
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}

	.from-view {
		width: 710rpx;
		margin-top: 20rpx;
		justify-content: space-between;

		image {
			@include setBox(164rpx, 182rpx);
		}
	}

	.swiper {
		@include setBox(750rpx, 260rpx);
		margin-top: 20rpx;
	}

	.bg-color {
		background: #F74637 linear-gradient(to bottom, #FF992C, #FF5023, #FF3C15);
	}

	.bg-view {
		width: 750rpx;
		height: 805rpx;
		position: relative;
		left: 0;
		top: 0;
		z-index: 0;

		.banner-bgImg {
			position: relative;
			left: 0;
			top: 0;
			z-index: 100;
			@include setBox(750rpx, 805rpx);

		}

		.bg-content {
			width: 750rpx;
			position: absolute;
			top: 200rpx;
			left: 0;
			z-index: 200;
		}
	}

	.time {
		@include flex;
		align-items: center;

		&__custom {
			margin-top: 4px;
			width: 36rpx;
			height: 36rpx;
			background-color: #333333;
			border-radius: 10rpx;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;

			&__item {
				color: #fff;
				font-size: 12px;
				text-align: center;
			}
		}

		&__doc {
			color: #333;
			padding: 0px 2px;
		}

		&__item {
			color: #606266;
			font-size: 18rpx;
			margin-right: 2px;
		}
	}

	.tabs-view {
		position: sticky;
		z-index: 999;
		background-color: #f5f5f5;
		padding-top: 10rpx;
	}
</style>