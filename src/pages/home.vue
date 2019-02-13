<template>
	<div class="itsm-tabs-main home">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<div class="tabs-panel-wrap">
						<el-row :gutter="10">
							<el-col :span="6">
								<!--我的工作台-->
								<my-workbench></my-workbench>
							</el-col>
							<el-col :span="6">
								<!--我的待办-->
								<my-todo></my-todo>
							</el-col>
							<el-col :span="6">
								<!--最新公告-->
								<latest-announcement></latest-announcement>
							</el-col>
							<el-col :span="6">
								<!--历史工单查询-->
								<workorder-query></workorder-query>
							</el-col>
						</el-row>
					</div>

					<div class="tabs-panel-wrap">
						<el-row :gutter="10">
							<el-col :span="12">
								<!--事件工单快速登记-->
								<eventorder-create ref='eventorder'></eventorder-create>
							</el-col>
							<el-col :span="12">
								<!--资产分类统计-->
								<assetClassify-count></assetClassify-count>
							</el-col>
						</el-row>
					</div>

					<div class="tabs-panel-wrap">
						<el-row :gutter="10">
							<el-col :span="12">
								<!--运维支持能力-->
								<operation-ability ref='operationability'></operation-ability>
							</el-col>
							<el-col :span="12">
								<!--工单类型统计-->
								<workorderType-statistics></workorderType-statistics>
							</el-col>
						</el-row>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		<!--关联资产弹窗-->
		<ies-relationAssetDialog v-model="relationAssetDialog.show" v-if="relationAssetDialog.show" @relationAssetChooseHandler="relationAssetChooseHandler" :defaultSelect='relationAssetDialog.defaultSelectId'></ies-relationAssetDialog>
		<!--公告详情-->
		<ies-noticeDetail ref='notice' v-model="announcementDialog.show" v-if="announcementDialog.show" :defaultSelect='announcementDialog.defaultSelectId'></ies-noticeDetail>
	</div>
</template>

<script>
	import myTodo from './home/myTodo.vue'
	import workorderQuery from './home/workorderQuery.vue'
	import myWorkbench from './home/myWorkbench.vue'
	import latestAnnouncement from './home/latestAnnouncement.vue'
	import eventorderCreate from './home/eventorderCreate.vue'
	import assetClassifyCount from './home/assetClassifyCount.vue'
	import operationAbility from './home/operationAbility.vue'
	import workorderTypeStatistics from './home/workorderTypeStatistics.vue'
	
	export default {
		name:'home',
		components:{
			myTodo,
			workorderQuery,
			myWorkbench,
			latestAnnouncement,
			eventorderCreate,
			assetClassifyCount,
			operationAbility,
			workorderTypeStatistics
		},
		data() {
			return {
				 //关联资产弹窗
            	relationAssetDialog:{
            		show:false,
            		defaultSelectId:''
            	},
            	// 公告详情弹窗
            	announcementDialog: {
            		show: false,
            		defaultSelectId: ''
            	}
			}
		},
		mounted() {
			this.$nextTick(() => {
				
			});
		},
		methods:{
			//选择资产弹窗
            chooseAsset(){
            	this.relationAssetDialog.show = true;
            },
            //选择资产弹窗回调
            relationAssetChooseHandler(data){
            	var data = JSON.parse(data);
            	this.$refs.eventorder.form.assetName = data.name;
            	this.$refs.eventorder.form.assetId = data.id;
            	this.relationAssetDialog.defaultSelectId = data.id;
            },
            //清空选择资产回显
            clearAsset(){
            	this.relationAssetDialog.defaultSelectId  = '';
            },
            // 打开公告详情弹窗
            openAnnouncementDialog(v) {
            	const self = this;
            	this.announcementDialog.defaultSelectId = v;
            	this.announcementDialog.show = true;
            	setTimeout(function(){
            		self.$refs.notice.query();
            	},100)
            }
		}
	}
</script>