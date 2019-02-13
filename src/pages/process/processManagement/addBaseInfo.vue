<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					基础信息
				</div>
				<div class="panel-body">
					<el-form :model="configAddBaseInfo.form.data" :rules="configAddBaseInfo.form.rules" ref="addBaseInfoForm" class="search-conditions" label-width="120px" style="width:800px; margin:20px 0 0 50px;">
						
						<el-form-item label-width="0">
							<el-col :span="11">
								<el-form-item label="流程名称：" prop="processName">
									<el-input placeholder="请输入流程名称" v-model="configAddBaseInfo.form.data.processName"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">&nbsp;</el-col>
							<!--事件流程管理是显示-->
							<el-col :span="11" v-if="configAddBaseInfo.form.data.processType == 1">
								<el-form-item label="流程模板：" prop="processBaseTemplatesId">
									<el-select v-model="configAddBaseInfo.form.data.processBaseTemplatesId" placeholder="请选择流程模板" style="display:block;" @focus="selectOnFocus">
										<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configTemplatesIdData"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-form-item>
						<el-form-item label="描述：" prop="processTemplatesDescribe">
							<el-input type="textarea" :rows="7" placeholder="请输入描述" v-model="configAddBaseInfo.form.data.processTemplatesDescribe"></el-input>
						</el-form-item>
						
						<el-form-item>
							<el-button type="primary" size="normal" @click="nextStep">下一步</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
export default {
	data() {
		let validator = this.$ies.validator;
		return {
			// 新增流程配置
			configAddBaseInfo: {
				form: {
					data: {
						processName: '',
						processTemplatesDescribe: '',
						processType: '',
						id: '',
						processBaseTemplatesId: ''
					},
					rules: {
						processName: [
							{ validator:validator.space, trigger:'blur, change', options:{max:32} },
							{ required: true, message: '请输入流程名称', trigger: 'blur' }
						],
						processBaseTemplatesId: [
							{ validator:validator.space, trigger:'blur, change' },
							{ required: true, message: '请选择流程模板', trigger: 'blur' }
						],
						processTemplatesDescribe: [
							{ validator:validator.space, trigger:'blur, change', options:{max:200} },
						]
					},
				}
				
			},
			
			// 事件流程模板数据源
			configTemplatesIdData: []
		}
	},
	mounted(){
		this.$nextTick( ()=>{
			this.init();
		});
	},
	methods:{
    	//解决ie9不能修改的内容都能获取焦点
    	selectOnFocus(e) {
	        e.target.blur();
	    },
		
		init(){
			this.configAddBaseInfo.form.data.processType = this.$route.query.processType;
			
			this.getProcessTemplatesUuid();
			this.getProcessBaseTemplatesId();
		},
		
		// 获取流程管理的id
		getProcessTemplatesUuid() {
			this.$axios.post('/itsm/process/manager/templates/getProcessTemplatesUuid').then((res) => {
				if(res.status == 200) {
					this.configAddBaseInfo.form.data.id = res.data;
				}else{
					this.configAddBaseInfo.form.data.id = '';
				}
			});
		},
		
		// 获取流程管理的TemplatesId
		getProcessBaseTemplatesId() {
			// 事件流程管理的TemplatesId
			if( this.configAddBaseInfo.form.data.processType == 1 ) {
				this.$axios.post('/itsm/process/manager/templates/queryEventBaseTemplates').then((res) => {
					if(res.status == 200 && res.data.length) {
						this.configTemplatesIdData = res.data.map((item)=>{
							return {
								label:item.processName,
								value:item.processBaseTemplatesId
							}
						});
					}else{
						this.configTemplatesIdData = [];
					}
				});
			// 其它的流程管理的TemplatesId
			} else {
				this.$axios.post('/itsm/process/manager/templates/queryBaseTemplates', {processType:this.configAddBaseInfo.form.data.processType} ).then((res) => {
					if(res.status == 200) {
						this.configAddBaseInfo.form.data.processBaseTemplatesId = res.data.id;
					}else{
						this.configAddBaseInfo.form.data.processBaseTemplatesId = '';
					}
				});
			}
			
		},
		
		// 下一步（保存基本信息）
		nextStep(){
	        this.$refs.addBaseInfoForm.validate((valid) => {
				if (valid) {
					//this.$axios.post('http://192.168.3.22:9600/itsm/process/manager/templates/saveProcesTemplatesName', this.configAddBaseInfo.form.data ).then((res) => {
					this.$axios.post('/itsm/process/manager/templates/saveProcesTemplatesName', this.configAddBaseInfo.form.data ).then((res) => {
						if(res.status == 200) {
							//this.$message.success(res.message);
							
							var query = {
								templatesId: this.configAddBaseInfo.form.data.id,
								processType: this.configAddBaseInfo.form.data.processType,
								versionId: this.configAddBaseInfo.form.data.processBaseTemplatesId,
								operationType: 'add'
							};
							
							if(this.configAddBaseInfo.form.data.processType == 1) {
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/eventProcess/makeEventProcess', JSON.stringify(query));
							};
							if(this.configAddBaseInfo.form.data.processType == 2) {
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/problemProcess/makeProblemProcess', JSON.stringify(query));
							};
							if(this.configAddBaseInfo.form.data.processType == 3) {
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/changeProcess/makeChangeProcess', JSON.stringify(query));
							};
							if(this.configAddBaseInfo.form.data.processType == 4) {
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/releaseProcess/makeReleaseProcess', JSON.stringify(query));
							};
							if(this.configAddBaseInfo.form.data.processType == 5) {
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/spareProcess/makeSpareProcess', JSON.stringify(query));
							};
							
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