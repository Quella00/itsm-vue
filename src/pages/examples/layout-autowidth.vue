<template>

	<div class="itsm-tabs-main autowidth">

		<div class="tabs-left border">
			<ies-scrollbar class="ies-scrollbar">
				<div class="tabs-panel-wrap">
					<div style="height:1000px; background-color:#fff;">树结构</div>
				</div>
			</ies-scrollbar>
		</div>

		<div class="tabs-right">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							查询条件
						</div>
						<div class="panel-body" style="padding: 30px 10px 20px;">
							<!--面板主体-->
							<el-form :inline="true" :model="configForm.ruleForm" :rules="configForm.rules" ref="ruleForm" class="reset-form" label-width="80px" label-position="left">
								<el-row type="flex" justify="space-between">
									<el-col :span="7">
										<el-form-item label="库房名称：" prop="name" >
											<el-input type="text" v-model="configForm.ruleForm.name" placeholder="请输入库房名称" auto-complete="off" class="reset-width" size="medium"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="7">
										<el-form-item label="库房类型：" prop="type" class="resetItem-style">
				                            <el-select v-model="configForm.ruleForm.type" placeholder="请选择库房类型" class="reset-width">
				                                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configWareHouse.data"></el-option>
				                            </el-select>
				                        </el-form-item>
									</el-col>
									<el-col :span="7">
										<el-form-item label="所属区域：" prop="area" class="range">
				                            <el-input placeholder="请选择所属区域" v-model="configForm.ruleForm.area" auto-complete="off" readonly></el-input>
				                            <i class="el-icon-my-more" @click="openAreaDialog"></i>
				                        </el-form-item>
									</el-col>
								</el-row>
							</el-form>	

						</div>
					</div>

					<div class="tabs-panel-wrap border">
						<div style="height:100px; background-color:#fff; ">面板2</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>

	</div>

</template>

<script>
	export default {
		data() {
			return {
	            configForm: {
	                ruleForm: {     // 数据列表字段
	                    name: '',
						type: '',
	                    area: ''
	                }
	                /*
	                rules: {    // 数据列表字段的验证规则
	                    name: [
	                        { required: true, message: '请输入库房名称', trigger: 'blur' }
						],
						type: [
	                        { required: true, message: '请选择库房类型', trigger: 'change' }
						],
	                    area: [
	                        { required: true, message: '请选择所属区域', trigger: 'change' }
						]
					}
	                */
				},
				
	            // 查询条件 -> 库房类型下拉配置
	            configWareHouse: {
	                data: [    // 数据源
	                    { value: '1', label: '通用库房' },
	                    { value: '2', label: '专用库房' },
	                    { value: '3', label: '中转库房' }
	                ]
	            },
				
				
			};
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style lang="less">
.autowidth{
	.grid-content{
		height:20px; background-color:#333;
	}
	.el-col{
		/*background-color:#eee;*/
	}
	.el-form-item{
		padding-left:80px; position:relative; width:100%; max-width:320px;
		label{
			position:absolute; top:0; left:0;
		}
		.el-form-item__content{
			width:100%;
		}
		.el-form-item__label{
			padding: 0;
		}
		
		.el-select{
			width:100%; max-width:320px;
		}
	}
}

</style>