# km-select
基于 picker-view 的多列选择
> 空明组件-表单系列-多列选择

## props
|  参数  | 类型 | 默认值 | 可选值 | 说明 |
| ------------- | ------------- |
| option | Array<(Object)> | [] | | 数据源，是一个数据对象 |
| v-model  | Array  | [0, 0, 0] | | 默认绑定应该列的索引（从 0 开始）,建议有多少列，其数组长度就为多少列。默认3列 |
| label | String | name | | 该参数是显示 key 值 |
| concatKey | String | children | | 第一列选择之后，第二列显示的内容...以此类推 |
| height | Number | 150 | | 组件高度 |
| valueKey | String | | | 不设值该值，确定选择之后返回索引。设置该值则返回以该值为 key 的值。如 ['早上', '8: 00'] |
| @change | Function | | |  确定选择之后触发，参数是当前选择的索引，如[1, 0]|

## 使用
```
<km-select ref="km-select"></km-select>

// js

// 打开弹框
this.$refs['km-select'].show()

// 关闭弹框
this.$refs['km-select'].hide()
```


## PS: 

1. 插件符合 easycom 规范，可以直接在页面中使用
2. 建议先下载示例项目运行查看

<br>
**欢迎各位大佬指正**