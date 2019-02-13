<!--用户管理--技能管理-->
<template>
	<div class="itsm-tabs-main skill">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteSkill">删除</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-refresh" @click="refreshTableData">刷新</el-button>
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddEditSkillDialog('add')">新增</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="skill.tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
						<el-table-column label="技能编号" prop="skillCode" show-overflow-tooltip></el-table-column>
						<el-table-column label="技能名称" prop="skillName" show-overflow-tooltip></el-table-column>
						<el-table-column label="技能描述" prop="description" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openAddEditSkillDialog('edit',scope.row)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="skill.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="skill.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="skill.pagination.total">
					</el-pagination>
				</div>
			</div>
			
			<!--新增技能弹窗-->
			<el-dialog :title="addEditSkillDialog.title" width="413px" :visible.sync="addEditSkillDialog.show" class="add-edit-skill" @close="closeAddEditSkillDialog" :close-on-click-modal='false' v-drag>
				<div class="add-edit-skill-dialog-content">
					<el-form ref="addEditSkillForm" :model="addEditSkillDialog.form" :rules="addEditSkillDialog.rules" label-width="100px">
						<el-form-item label="技能编号：" prop="number">
							<el-input v-model="addEditSkillDialog.form.number" placeholder="请输入技能编号" :disabled="addEditSkillDialog.type=='edit'"></el-input>
						</el-form-item>
						<el-form-item label="技能名称：" prop="name">
							<el-input v-model="addEditSkillDialog.form.name"  placeholder="请输入技能名称"></el-input>
						</el-form-item>
						<el-form-item label="技能描述：" prop="desc">
							<el-input type="textarea" v-model="addEditSkillDialog.form.desc"  placeholder="请输入技能描述"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="normal" @click="saveAddEditSkillDialog">保存</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name:'skill',
		components: {

		},
		props: {

		},
		data() {
			let validator = this.$ies.validator;
			return {
				// 页面整体数据
				skill: {
					tableData: [],
					selected: [],
					pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				},
				// 新建/编辑组织弹窗
				addEditSkillDialog: {
					type:'',
					title:'',
					show: false,
					form: {
						number: '',
						name: '',
						desc: ''
					},
					rules: {
						number: [{validator:validator.space,trigger: 'blur',options:{max:6}},{required: true,message: '请输入编号',trigger: 'blur'},{ validator: validator.number, trigger: 'blur' }],
						name: [{validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入名称',trigger: 'blur'},{ validator: validator.name, trigger: 'blur' }],
						desc: [{validator:validator.space,trigger: 'blur',options:{max:200}},{required: true,message: '请输入描述',trigger: 'blur'}]
					}
				}
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.init();
			});
		},
		methods: {
			// 初始化
			init(){
				this.queryAllSkill();
			},
			// 获取表格数据
			queryAllSkill(){
				var params = {
					pageNum:this.skill.pagination.currentPage,
					pageSize:this.skill.pagination.pageSize
				}
				this.$axios.post('/itsm/system/permission/skill/queryAllSkill',params).then((res) => {
                    if(res.status == 200){
                    	this.skill.tableData = res.data.list;
                    	this.skill.pagination.total = res.data.total;
                    } else {
                        this.$message(res.message);
                    }
                });
			},
			// sizeChange事件
			handleSizeChange(size) {
				this.skill.pagination.pageSize = size;
                this.queryAllSkill();
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				this.skill.pagination.currentPage = currentPage;
                this.queryAllSkill();
			},
			// 刷新数据
			refreshTableData(){
				this.queryAllSkill();
			},
			/********************新增、编辑技能************************/
			// 打开新增/编辑技能弹窗
			openAddEditSkillDialog(type,row) {
				this.addEditSkillDialog.type = type;
				this.addEditSkillDialog.title = type == 'add' ? '新增技能' : '编辑技能'
				this.addEditSkillDialog.show = true;
				if(type == 'edit'){
					this.addEditSkillDialog.form.id = row.id;
					this.addEditSkillDialog.form.number = row.skillCode;
					this.addEditSkillDialog.form.name = row.skillName;
					this.addEditSkillDialog.form.desc = row.description;
				}
			},
			// 点击新增/编辑弹窗的保存按钮
			saveAddEditSkillDialog(){				
				this.$refs['addEditSkillForm'].validate((valid) => {
					if(valid){
						//新增
						this.addEditSkillDialog.type == 'add' ? this.addSkill() : this.editSkill();						
					}
				})
			},
			// 新增技能
			addSkill(){
				var params = {
					skillName :this.addEditSkillDialog.form.name,
					skillCode :this.addEditSkillDialog.form.number,
					description :this.addEditSkillDialog.form.desc
				}
				this.$axios.post('/itsm/system/permission/skill/saveSkill', params).then((res) => {
                    if (res.status == 200){
                       this.$message({message:res.message,type:'success'});
                       this.addEditSkillDialog.show = false;
                       //刷新表格数据
                       this.skill.pagination.currentPage = 1;
                       this.queryAllSkill();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    }
            	});
			},
			// 编辑技能
			editSkill(){
				var params = {
					id:this.addEditSkillDialog.form.id,
					skillCode:this.addEditSkillDialog.form.number,
					skillName:this.addEditSkillDialog.form.name,
					description:this.addEditSkillDialog.form.desc
				}
				this.$axios.post('/itsm/system/permission/skill/updateSkill', params).then((res) => {
                    if (res.status == 200){
                       this.$message({message:res.message,type:'success'});
                       this.addEditSkillDialog.show = false;
                       //刷新树和表格数据
                       this.queryAllSkill();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    } 
            	});
			},
			// 关闭新增、编辑弹窗
			closeAddEditSkillDialog(){				
				this.reset('addEditSkillForm');
				this.addEditSkillDialog.form.id = '';
				this.addEditSkillDialog.form.number = '';
				this.addEditSkillDialog.form.name = '';
				this.addEditSkillDialog.form.desc = '';
			},
			// 重置表单
			reset(ref) {
				this.$refs[ref].resetFields();
			},
			// table中的多选
			handleSelectionChange(v) {
				const self = this;
				self.skill.selected = v.map(v => v.id);
			},
			// 点击删除
			deleteSkill() {
				const self = this;
				if(self.skill.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定删除选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.post('/itsm/system/permission/skill/deleteSkill',{skillIds :self.skill.selected.join(',')}).then((res) => {
	                    if(res.status==200){
	                       self.$message({type: 'success',message:res.message});
	                       self.queryAllSkill();
	                    }else{
	                       self.$message({type: 'error',message:res.message}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消删除'});
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

<style lang="less">
	
</style>