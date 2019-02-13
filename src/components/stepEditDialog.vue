<template>
    <!-- 流程节点编辑 -->
    <el-dialog :visible="configNodePropertyDialog.show" :close-on-click-modal='false' custom-class="stepEditDialog" :modal-append-to-body='false' @close="closeDialog" v-drag>
        <span slot="title" style="color:#666666;">设置流程节点</span>
		
		<div style="height:350px;">
		<ies-scrollbar class="ies-scrollbar">
        <el-form label-width="220px" ref="orderHandupId" :model="configEditNode.form.data" :rules="configEditNode.form.rules" >
            <el-form-item label="节点名称 ：">
            	{{configEditNode.form.data.processNodeName}}
            </el-form-item>
            <el-form-item label="流程角色 ：">
            	{{configEditNode.form.data.processRoleName}}
            </el-form-item>
            <el-form-item label="是否计入处理时间 ：" v-if="configEditNode.form.data.handleTime !== -1">
				<el-radio-group v-model="configEditNode.form.data.handleTime">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否拥有关闭工单权限 ：" v-if="configEditNode.form.data.closeWorkOrder !== -1">
				<el-radio-group v-model="configEditNode.form.data.closeWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可以挂起工单 ：" v-if="configEditNode.form.data.hangUpWorkOrder !== -1">
				<el-radio-group v-model="configEditNode.form.data.hangUpWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可以回滚 ：" v-if="configEditNode.form.data.rejectWorkOrder !== -1">
				<el-radio-group v-model="configEditNode.form.data.rejectWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            
            <!--<el-form-item label="是否可以确认关闭工单 ：" v-if="configEditNode.form.data.confirmCloseWorkOrder !== -1">
				<el-radio-group v-model="configEditNode.form.data.confirmCloseWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有受理权限 ：" v-if="configEditNode.form.data.acceptWorkOrder !== -1">
				<el-radio-group v-model="configEditNode.form.data.acceptWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有指派的权限 ：" v-if="configEditNode.form.data.appointWorkOrder !== -1">
				<el-radio-group v-model="configEditNode.form.data.appointWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有启动的权限 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.startupWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            
            <el-form-item label="是否邮件通知下一个节点用户 ：" v-if="configEditNode.form.data.noticeNextNodeEmail !== -1">
				<el-radio-group v-model="configEditNode.form.data.noticeNextNodeEmail">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否短信通知下一个节点用户 ：" v-if="configEditNode.form.data.noticeNextNodeSms !== -1">
				<el-radio-group v-model="configEditNode.form.data.noticeNextNodeSms">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否通知工单创建者 ：" v-if="configEditNode.form.data.noticeWorkOrderCreator !== -1">
				<el-radio-group v-model="configEditNode.form.data.noticeWorkOrderCreator">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否邮件通知工单创建者 ：" v-if="configEditNode.form.data.noticeWorkOrderCreatorEmail !== -1">
				<el-radio-group v-model="configEditNode.form.data.noticeWorkOrderCreatorEmail">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否短信通知工单创建者 ：" v-if="configEditNode.form.data.noticeWorkOrderCreatorSms !== -1">
				<el-radio-group v-model="configEditNode.form.data.noticeWorkOrderCreatorSms">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否是基本属性 ：" v-if="configEditNode.form.data.baseProperty !== -1">
				<el-radio-group v-model="configEditNode.form.data.baseProperty">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>-->
            
            
            <el-form-item label="是否可以确认关闭工单 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.confirmCloseWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            
            <el-form-item label="是否有受理权限 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.acceptWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有指派的权限 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.appointWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有启动的权限 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.startupWorkOrder">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            
            <el-form-item label="是否邮件通知下一个节点用户 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.noticeNextNodeEmail">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否短信通知下一个节点用户 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.noticeNextNodeSms">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否通知工单创建者 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.noticeWorkOrderCreator">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否邮件通知工单创建者 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.noticeWorkOrderCreatorEmail">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否短信通知工单创建者 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.noticeWorkOrderCreatorSms">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            <el-form-item label="是否是基本属性 ：" v-if="false">
				<el-radio-group v-model="configEditNode.form.data.baseProperty">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="0">否</el-radio>
			   </el-radio-group>
            </el-form-item>
            
        </el-form>
		</ies-scrollbar>
		</div>
		
        <div slot="footer">
            <el-button type="primary" size="normal" @click="saveNodeProperty">保&nbsp;存</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
	props: ['configNodePropertyDialog'],
	data() {
		return {
			configEditNode: {
				form: {
					data: {},
					rules: {}
				},
				
				processRoleData: []  // 流程角色数据源
			}
		}
	},
	mounted() {
		this.$nextTick( ()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.getNodeProperty();
		},
		
		// 获取节点的属性
		getNodeProperty(){
			this.configEditNode.form.data = this.$ies.deepCopy(this.configNodePropertyDialog.data);
		},
		
		// 保存节点属性
		saveNodeProperty() {
			this.$emit('callback', this.configEditNode.form.data);
			this.configNodePropertyDialog.show = false;
		},
		
		closeDialog() {
			this.configNodePropertyDialog.show = false;
		}
	}
}
</script>

<style lang="less">
	.stepEditDialog{
		width: 460px; 
		.el-form{
			padding:30px 30px 20px 20px;
		}
	}
</style>