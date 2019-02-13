<template>
	<div>
		<ies-checkedAll :checkedAll="confCheckedAll">全选</ies-checkedAll>
		<ul>
			<li v-for="item in dataList">
				<template>
					<el-checkbox-group v-model="confCheckedAll.checkeds">
						<el-checkbox :label="item.id">{{ item.id }}.{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</template>
			</li>
		</ul>
		<el-button type="danger" @click="deleteData">批量删除</el-button>
		
		<ies-checkedAll :checkedAll="confCheckedAll2">点我全选</ies-checkedAll>
		<ul>
			<li v-for="item in dataList2">
				<template>
					<el-checkbox-group v-model="confCheckedAll2.checkeds">
						<el-checkbox :label="item.id">{{ item.id }}.{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</template>
			</li>
		</ul>
		
		<ies-checkedAll :checkedAll="confCheckedAll3"></ies-checkedAll>
		<ul>
			<li v-for="item in dataList3">
				<template>
					<el-checkbox-group v-model="confCheckedAll3.checkeds">
						<el-checkbox :label="item.id">{{ item.id }}.{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</template>
			</li>
		</ul>
		
		<p>
			<el-input v-focus></el-input>
		</p>
		<p>
			<input type="text" @keydown='showKeyCode($event)' />
		</p>

		
	</div>
</template>

<script>
export default {
	data () {
		return {
			
			dataList: [
				{id: 'a', name: '张三' },
				{id: 'b', name: '李四' },
				{id: 'c', name: '王五' },
				{id: 'd', name: '赵六' },
			],
			confCheckedAll: {
				isCheckedAll: false,
				data: [],
				checkeds: [],
				name: 'id',
			},
			
			dataList2: [
				{id: 'a', name: '张三' },
				{id: 'b', name: '李四' },
				{id: 'c', name: '王五' },
				{id: 'd', name: '赵六' },
			],
			confCheckedAll2: {
				isCheckedAll: false,
				data: [],
				checkeds: [],
				name: 'id',
			},
			
			dataList3: [
				{id: 'a', name: '张三' },
				{id: 'b', name: '李四' },
				{id: 'c', name: '王五' },
				{id: 'd', name: '赵六' },
			],
			confCheckedAll3: {
				isCheckedAll: false,
				data: [],
				checkeds: [],
				name: 'id',
			},
			
		};
	},
	mounted() {
		this.confCheckedAll.data = this.dataList;
		this.confCheckedAll2.data = this.dataList2;
		this.confCheckedAll3.data = this.dataList3;
	},
	methods: {
		//显示你的键盘事件
		showKeyCode(ev) {
			this.$ies.showKeyCode(ev);
			//console.log( ev.keyCode );
		},
		
		//批量删除
		deleteData( confCheckedAll, fun ) {
			this.$ies.publicDeleteData(this.confCheckedAll, function(_this){
				for(var i = 0; i < _this.confCheckedAll.checkeds.length; i++) {
					for(var j = 0; j < _this.confCheckedAll.data.length; j++) {
						if(_this.confCheckedAll.checkeds[i] == _this.confCheckedAll.data[j].id ) {
							_this.confCheckedAll.data.splice(j, 1);
							j--;
						}
					}
				}

			}, this);
		},

	}
}
</script>

<style scoped>
</style>
