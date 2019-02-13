<template>
	<div class="panel-content border">
		<div class="panel-header">
			历史工单查询
			<div class="fr">
				<span class="el-icon-my-refresh" @click="refreshWorkOrder"></span>
			</div>
		</div>
		<div class="panel-body" style="height:279px;">
			<ul class="worksheet-query-list clearfix">
				<li v-for="item in configWorkOrderData">
					<a href="javascript:;" @click="openPage(item.orderId, item.instanceId, item.orderType)">{{ item.name }}</a>
					<span>{{ item.closeTime }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				configWorkOrderData: []
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.init();
			});
		},
		methods: {
			init() {
				this.getWorkOrderData();
			},

			// 获取历史工单
			getWorkOrderData() {
				this.$axios.post('/work/order/history', {number: 5}).then((res) => {
				 	if(res.status == 200) {
				 		this.configWorkOrderData = res.data.map((item)=>{
				 			return {
				 				name: item.theme || '无标题',
				 				closeTime: item.closeTime || '00:00',
				 				orderId: item.id,
				 				instanceId: item.processInstanceId,
				 				orderType: item.type
				 			}
				 		});
				 	}
				});
			},
			
			// 打开工单详情页
			openPage(orderId, instanceId, orderType) {
				const workOrderType = (orderType==1&&'event'||orderType==2&&'question'||orderType==3&&'change'||orderType==4&&'publish'||orderType==5&&'spare');
				const params = {
					orderId: orderId,
					instanceId: instanceId
				}
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/workOrder/orderDatail/' + workOrderType, JSON.stringify(params));
			},
			
			// 刷新历史工单
			refreshWorkOrder() {
				this.getWorkOrderData();
			}
		}
	}
</script>

<style>
</style>