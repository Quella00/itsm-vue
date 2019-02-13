<template>
	<div class="panel-content border">
		<div class="panel-header">
			我的待办
			<div class="fr">
				<span class="el-icon-my-refresh" @click="refreshMyTodo"></span>
			</div>
		</div>
		<div class="panel-body" style="height:224px;">
			<ul class="todo-list clearfix">
				<li v-for="item in configTodoData">
					<a href="javascript:;" @click="openOrderDatail(item.orderId, item.instanceId, item.orderType)">{{ item.name }}</a>
					<span>{{ item.updateTime }}</span>
				</li>
			</ul>
		</div>
		<div class="panel-footer">
			<el-button type="primary" size="normal" @click="openTodoAll">查看更多 >></el-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			configTodoData: []
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.getTodoData();
		},
		
		// 获取待办
		getTodoData() {
			this.$axios.post('/work/order/home/todo', {number: 5}).then((res) => {
			 	if(res.status == 200 && res.data && res.data.length) {
			 		this.configTodoData = res.data.splice(0,5).map((item)=>{
			 			return {
			 				name: item.theme,
			 				updateTime: item.updateTime,
			 				orderId: item.id,
			 				instanceId: item.processInstanceId,
			 				orderType: item.type
			 			}
			 		});
			 	}else{
			 		this.configTodoData = [];
			 	}
			});
		},
		
		// 打开工单详情页
		openOrderDatail(orderId, instanceId, orderType) {
			this.$axios.post('/itsm/system/notice/readX',{xId:orderId,type:3}).then((res) => {
				console.log('未读改为已读');
				// 刷新小铃铛
				this.$ies.dispatch(this, 'layout').$refs.header.queryUnReadCount();
			});
			
			const workOrderType = (orderType==1&&'event'||orderType==2&&'question'||orderType==3&&'change'||orderType==4&&'publish'||orderType==5&&'spare');
			const params = {
				orderId: orderId,
				instanceId: instanceId
			}
			
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/workOrder/orderDatail/' + workOrderType, JSON.stringify(params));
		},
		
		// 打开待办工单列表页
		openTodoAll() {
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/workOrder/orderTable/all');
		},
		
		// 刷新组件数据
		refreshMyTodo() {
			this.getTodoData();
		}
	}
}
</script>

<style>
</style>