<template>
	<el-dialog title="修改基本信息" :visible="configEditBaseInfoDialog.show" width="470px" custom-class="editBaseInfo" @close="closeDialog" :close-on-click-modal="false" v-drag>
		<div class="editBaseInfo-content" style="padding:20px 0 30px 0;">
			<el-form :model="configEditBaseInfo.form.data" :rules="configEditBaseInfo.form.rules" ref="baseInfoForm" class="search-conditions" label-width="120px">
				<el-form-item label="流程名称：" prop="processName">
					<el-input placeholder="请输入流程名称" v-model="configEditBaseInfo.form.data.processName" class="resetWidth"></el-input>
				</el-form-item>
				<el-form-item label="描述：" prop="processTemplatesDescribe">
					<el-input type="textarea" :rows="6" placeholder="请输入描述" v-model="configEditBaseInfo.form.data.processTemplatesDescribe" class="resetWidth"></el-input>
				</el-form-item>
			</el-form>
        </div>
		<div slot="footer">
			<el-button type="normal" @click="saveBaseInfo">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	props:['configEditBaseInfoDialog'],
	data() {
		let validator = this.$ies.validator;
        return {
        	// 流程管理基本信息配置
			configEditBaseInfo: {
				form: {
					data: {
						processName: '',
						processTemplatesDescribe: '',
						processType: '',
						id: ''
					},
					rules: {
						processName: [
							{ validator:validator.space, trigger:'blur, change', options:{max:32} },
							{ required: true, message: '请输入流程名称', trigger: 'blur' }
						],
						processTemplatesDescribe: [
							{ validator:validator.space, trigger:'blur, change', options:{max:200} },
						]
					}
				}
			}
        	
        }
    },
	mounted() {
    	this.$nextTick(()=>{
    		this.init();
    	});
	},
    methods: {
    	init() {
    		this.getBaseInfo();
    	},
    	
    	getBaseInfo() {
    		this.$axios.post('/itsm/process/manager/templates/queryTemplatesByid',{templatesId:this.configEditBaseInfoDialog.id}).then((res) => {
    			if(res.status == 200){
    				this.configEditBaseInfo.form.data.processName = res.data.processName;
    				this.configEditBaseInfo.form.data.processTemplatesDescribe = res.data.processTemplatesDescribe;
    			}
    		});
    	},
    	
    	// 关闭弹窗
    	closeDialog() {
    		this.configEditBaseInfoDialog.show = false;
    	},
    	
    	// 保存基本信息
    	saveBaseInfo() {
	        this.$refs.baseInfoForm.validate((valid) => {
				if (valid) {
					this.configEditBaseInfo.form.data.processType = this.configEditBaseInfoDialog.processType;
					this.configEditBaseInfo.form.data.id = this.configEditBaseInfoDialog.id;

		    		//this.$axios.post('http://192.168.3.22:9600/itsm/process/manager/templates/updateProcessTemplatesName',this.configEditBaseInfo.form.data).then((res) => {
		    		this.$axios.post('/itsm/process/manager/templates/updateProcessTemplatesName',this.configEditBaseInfo.form.data).then((res) => {
		    			if(res.status == 200){
		    				this.$message.success(res.message);
		    				this.configEditBaseInfoDialog.show = false;
		    				this.$emit('callback');
		    			}else{
		    				this.$message.error(res.message);
		    			}
		    		});
				}
			});
    	}
    }
}
</script>

<style>
</style>