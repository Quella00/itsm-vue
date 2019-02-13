<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">

			<div class="tabs-panel-wrap border">
				<div class="panel-body">
					
					<el-form label-width="100px" style="width:500px; padding:20px 0 0 0">
						<el-form-item label="主键id">
							<el-input v-model="params.id"></el-input>
						</el-form-item>
						<el-form-item label="父资源id">
							<el-input v-model="params.parentResourceId"></el-input>
						</el-form-item>
						<el-form-item label="资源名称">
							<el-input v-model="params.resourceName"></el-input>
						</el-form-item>
						<el-form-item label="资源url">
							<el-input v-model="params.resourceUrl"></el-input>
						</el-form-item>
						<el-form-item label="资源描述">
							<el-input v-model="params.description"></el-input>
						</el-form-item>
						<el-form-item label="是否父节点">
							<el-radio-group v-model="params.parentFlag">
								<el-radio label="0">不是</el-radio>
								<el-radio label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="资源权限url ">
							<el-input v-model="params.permissionUrl"></el-input>
						</el-form-item>
						
						
						<el-form-item>
							<el-button type="primary" size="normal" @click="addData">修改数据</el-button>
						</el-form-item>
					</el-form>

				</div>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	components: {

	},
	props: {
		
	},
	data() {
		return {
			params: {
				resourceName: '',
				resourceUrl: '',
				description: '',
				parentResourceId: '',
				parentFlag: '',
				
				permissionUrl: ''
			}
		};	
	},
	mounted() {
		
	},
	methods: {
		addData() {
			
			for(var key in this.params){
				if( !this.params[key] ){
					delete this.params[key];
				}
			}
			
			this.$axios.post('/itsm/system/permission/resource/updateResource', this.params).then( (res) => {
				
				console.log( res );
				if(res.status == 200){
					this.$message.success( res.message );
				}
				
			});
		}
	},
	filters: {
		
	},
	computed: {
		
	},
	watch: {
		
	}
}
</script>

<style>
</style>