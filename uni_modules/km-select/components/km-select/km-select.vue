<template>
	<view 
		class="km-select" 
		:class="{
			'km-select-eff': show_picker
		}">
		<view class="picker-box">
			<view class="km-btns">
				<text @click="hide">取消</text>
				<text @click="updateInput" class="confirm">确定</text>
			</view>
			<picker-view
				class="picker-view"
				:style="{
					'height': `${height}px`
				}"
				:value="default_value"
				@change="bindChange">
				<template v-for="(item,index) in list">
					<picker-view-column 
						v-if="item.length" 
						:key="index">
						<view 
							class="item" 
							v-for="(item2,index2) in item" 
							:key="index2">{{item2[label]}}</view>
					</picker-view-column>
				</template>
			</picker-view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			option: { // 数据源
				type: Array,
				default: () => []
			},
			label: { // 显示的 key
				type: String,
				default: 'name'
			},
			concatKey: { // 列 连接 字段名
				type: String,
				default: 'children'
			},
			value: { // 绑定的值
				type: Array,
				default: () => [0, 0, 0]
			},
			height: { // 盒子高度
				type: Number,
				default: 200
			},
			valueKey: { // 自定义返回值的 key
				type: String,
				default: ''
			}
		},
		data() {
			return {
				list: [], // 数据列表
				default_value: [], // picker 绑定的值
				show_picker: false, // 是否显示
				is_value: false, // 是否自定义取值 
			}
		},
		watch: {
			option: {
				handler() {
					this.parseOption('option') // 解析数据源结构
				},
			},
			value: {
				handler(n) {
					this.default_value = n
				},
			}
		},
		mounted() {
			this.default_value = this.value.length ? this.value : [0, 0, 0]
			this.list = this.option.length ? this.option : []
			this.parseOption('mounted') // 解析数据源结构
			if(this.valueKey) {
				this.is_value = true
			}
		},
		methods: {
			// 解析数据源结构
			parseOption() {
				const _this = this
				let list = []
				this.default_value.reduce((pre, item, index, res) => {
					// console.log(`${index} => `, pre)
					let arr = pre.map(e => {
						return {
							[_this.label]: e[_this.label]
						}
					})
					list[index] = arr
					
					if(pre[res[index]] && pre[res[index]][_this.concatKey]) {
						return pre[res[index]][_this.concatKey]
					}
					else return []
				}, this.option)
				this.list = list
			},
			// 列修改
			bindChange (e) {
				const _this = this
				let value = e.detail.value
				// 将滑动之后的列置 0
				let obj = value.reduce((pre, item, index) => {
					let data = pre.data
					if(pre.flag) data[index] = 0
					else {
						if(item != _this.default_value[index]) {
							data[index] = item
							pre.flag = true
						}
						else {
							data[index] = item
						}
					}
					return {
						...pre,
						data
					}
				}, {
					flag: false, // true: 当前往后值置 0
					data: []
				})
				this.default_value = obj.data
				this.parseOption()
			},
			// 提交值
			updateInput() {
				let value = JSON.parse(JSON.stringify(this.default_value))
				this.$emit('input', value)
				if(this.is_value) { // 自定义取值
					let arr = this.getValue([], this.option, 0)
					this.$emit('change', arr)
				}
				else {
					this.$emit('change', value)
				}
				this.hide()
			},
			// 自定义获取值
			getValue(pre = [], item, index) {
				/* pre: 积累值 item: 当前数组 index: 当前取 default_value 的索引 */
				let current = item[this.default_value[index]]
				let value = current.name
				pre.push(value)
				if(index < this.default_value.length - 1
					&& current[this.concatKey]
					&& current[this.concatKey][this.default_value[index + 1]]) {
					this.getValue(pre, current[this.concatKey], index + 1)
				}
				return pre
			},
			// 显示
			show() {
				this.show_picker = true
			},
			// 隐藏
			hide() {
				this.show_picker = false
			}
		}
	}
</script>

<style scoped>
	
.km-select {
	position: fixed;
	bottom: 0;
	width: 100%;
	transition: all 0.5s;
	transform: translateY(120%);
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	opacity: 0;
	border-top: 1px solid #f1f1f1;
	box-shadow: 0 0 10px -4px #ddd;
    background: #fff;
}
.km-select-eff {
	transform: translateY(0);
	opacity: 1;
}
.km-btns {
	display: flex;
	justify-content: space-around;
	background-color: #fff;
	padding-top: 10px;
	padding-bottom: 5px;
}
.km-btns text {
	font-size: 12px;
	background-color: #fff;
	outline: none;
}
.km-btns .confirm {
	color: #2979ff;
}


.picker-view {
	text-align: center;
}
.picker-view .item {
	display: flex;
	justify-content: center;
	align-items: center;
}

</style>
