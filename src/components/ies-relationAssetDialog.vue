<!--关联资产（服务台创建工单时候用）-->
<template>
	<div>
	    <el-dialog title="关联资产" :visible="value" width="1200px" custom-class="relation-asset" @close="assetChoose()" :close-on-click-modal='false' v-drag>
			<div class="relation-asset-content" style="height:645px;padding:10px;">
				<div class="tabs-panel-wrap border">
					<div class="panel-header">
						查询条件
					</div>
					<div class="panel-body" style="height:150px;">
						<el-form :inline="true" :model="relationAssetDialog.searchForm" label-width="150px" style="padding-top:20px;" ref="searchForm">
							<el-form-item label="资产名称：">
								<el-input placeholder="请输入资产名称" v-model="relationAssetDialog.searchForm.name"></el-input>
							</el-form-item>
							<el-form-item label="资产编码：">
								<el-input placeholder="请输入资产编码" v-model="relationAssetDialog.searchForm.code"></el-input>
							</el-form-item>
							<el-form-item label="资产分类：">
								<el-input placeholder="请选择资产分类" readonly v-model="relationAssetDialog.searchForm.classification"  @focus="selectOnFocus"></el-input>
								<i class="el-icon-my-more" @click="chooseRealtionAsset()"></i>
							</el-form-item>
							<el-form-item label="资产状态：">
								<el-select  v-model="relationAssetDialog.searchForm.assetStatus" placeholder="请选择资产状态" @focus="selectOnFocus">
									<el-option value="" label="请选择"></el-option>
									<el-option value="待清理" label="待清理"></el-option>
									<el-option value="借出" label="借出"></el-option>
									<el-option value="测试中" label="测试中"></el-option>
									<el-option value="使用中" label="使用中"></el-option>
									<el-option value="维护中" label="维护中"></el-option>
									<el-option value="报废" label="报废"></el-option>
									<el-option value="丢失" label="丢失"></el-option>
									<el-option value="闲置" label="闲置"></el-option>
									<el-option value="停用" label="停用"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="所属区域：">
								<el-input placeholder="请选择所属区域" readonly v-model="relationAssetDialog.searchForm.regionOfAffiliation" @focus="selectOnFocus"></el-input>
								<i class="el-icon-my-more" @click="chooseArea()"></i>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="tabs-panel-wrap border" v-autoHeight="tableH">
					<div class="panel-header">
						<div class="panel-header-right">
							<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
							<el-button type="normal" icon="el-icon-my-reset" @click="reset">重置</el-button>
						</div>
					</div>
					<div class="panel-body">
						<el-table :data="relationAssetDialog.tableData" stripe style="width: 100%;"  ref="multipleTable" :max-height="tableH">
							<el-table-column width="55" align="center">
								<template slot-scope="scope">
									<el-radio v-model="relationAssetDialog.radio" :label="JSON.stringify(scope.row)"></el-radio>
								</template>
							</el-table-column>
							<el-table-column label="资产编码" prop="code" width="180" show-overflow-tooltip></el-table-column>
							<el-table-column label="资产名称" prop="name" show-overflow-tooltip></el-table-column>
							<el-table-column label="资产分类" prop="classificationName" show-overflow-tooltip></el-table-column>
							<el-table-column label="资产状态" prop="assetStatus" show-overflow-tooltip></el-table-column>
							<el-table-column label="所属区域" prop="regionOfAffiliationName" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
					<div class="panel-footer" style="text-align: right;">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="relationAssetDialog.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
							:page-size="relationAssetDialog.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="relationAssetDialog.pagination.total">
						</el-pagination>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="normal" @click="assetChoose('confirm')">确定</el-button>
			</div>
		</el-dialog>
		<!-- 所属区域弹窗 -->
        <iesAreaDialog v-model="configAreaDialog.show" v-if="configAreaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='configAreaDialog.selectId' ></iesAreaDialog>

		<!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="configAssetDialog.show" v-if="configAssetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='configAssetDialog.selectId' type='search'></iesAssetDialog>
	</div>
</template>

<script>
    export default {
    	components:{ 
	
		},        
        props:['defaultSelect', 'value'],
    	data() {
            return {
            	tableH:'',//表格高度
            	relationAssetDialog:{
            		searchForm:{
            			code: "", 					// 资产编码
						name: "", 					// 资产名称
						classification: "", 		// 资产分类
						classificationId:"",
						assetStatus: "", 			// 资产状态
						regionOfAffiliation: "", 	// 所属区域
						regionOfAffiliationId:""
            		},
            		searchCondition:{
            			code: "", 					// 资产编码
						name: "", 					// 资产名称
						classification: "", 		// 资产分类
						assetStatus: "", 			// 资产状态
						regionOfAffiliation: "", 	// 所属区域
            		},
            		tableData:[],
            		pagination:{
            			pageSize:10,
            			currentPage:1,
            			total:0
            		},
            		radio:''
            	},
            	// 所属区域弹窗配置
	            configAreaDialog: {
	                show: false,     // 弹窗的显示/隐藏
	                selectId: '',    // 选中的区域节点id  
	            },
	            
				// 资产分类弹窗配置
				configAssetDialog: {
					show: false,       // 弹窗的显示/隐藏
					selectId: ''   // 选中的区域节点node
				},
            }
        },
		mounted() {
        	this.$nextTick(function () {
				this.getTableData();
        	});
    	},
        methods: {  
        	//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
        	getTableData(){
        		const self = this;
        		var params = {
        			code:self.relationAssetDialog.searchCondition.code,
        			name:self.relationAssetDialog.searchCondition.name,
        			classification:self.relationAssetDialog.searchCondition.classification,
        			assetStatus:self.relationAssetDialog.searchCondition.assetStatus,
        			regionOfAffiliation:self.relationAssetDialog.searchCondition.regionOfAffiliation,
        			pageNum: self.relationAssetDialog.pagination.currentPage,
	        		pageSize: self.relationAssetDialog.pagination.pageSize,
        		}
        		for(var key in params) {
        			if(!params[key]) {
        				delete params[key];
        			}
        		}
        		self.$axios.post('/assets/apply/query',params).then( (res) => {
	        		if(res.status == 200) {
	        			self.relationAssetDialog.tableData = res.data.list;
	        			self.relationAssetDialog.pagination.total = res.data.total;
	        			self.relationAssetDialog.radio = '';
	        			self.$nextTick(function () {	        				
							self.defaultSelect && self.relationAssetDialog.tableData.forEach(function(val, index) {	
								if (val.id == self.defaultSelect) {
	                       			self.relationAssetDialog.radio = JSON.stringify(val);
	                       	  	}							
							});
			        	});
	        		}
				});
        	},
        	handleCurrentChange(currentChange){
        		this.relationAssetDialog.pagination.currentPage = currentChange;
        		this.getTableData();
        	},
        	handleSizeChange(pageSize){
        		this.relationAssetDialog.pagination.pageSize = pageSize;
        		this.getTableData();
        	},
        	//查询
           	search(){
           		this.relationAssetDialog.searchCondition.code = this.relationAssetDialog.searchForm.code;
           		this.relationAssetDialog.searchCondition.name = this.relationAssetDialog.searchForm.name;
           		this.relationAssetDialog.searchCondition.classification = this.relationAssetDialog.searchForm.classificationId;
           		this.relationAssetDialog.searchCondition.assetStatus = this.relationAssetDialog.searchForm.assetStatus;
           		this.relationAssetDialog.searchCondition.regionOfAffiliation = this.relationAssetDialog.searchForm.regionOfAffiliationId;
           		this.relationAssetDialog.pagination.currentPage = 1;
           		this.getTableData();
           	},
           	reset(){
           		this.relationAssetDialog.searchForm = {
        			code: "", 					// 资产编码
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					classificationId:"",
					assetStatus: "", 			// 资产状态
					regionOfAffiliation: "", 	// 所属区域
					regionOfAffiliationId:""
            	},
            	this.relationAssetDialog.searchCondition = {
        			code: "", 					// 资产编码
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					assetStatus: "", 			// 资产状态
					regionOfAffiliation: "", 	// 所属区域
            	},
            	this.configAssetDialog.selectId = '';
            	this.configAreaDialog.selectId = '';
           		this.$refs['searchForm'].resetFields();
           	},
          	//关闭弹窗
            assetChoose(type){
            	if(type == 'confirm'){
            		this.relationAssetDialog.radio && this.$emit('relationAssetChooseHandler',this.relationAssetDialog.radio);
            	}
           		this.$emit('input', false);
            },
            /*****************************资产分类弹窗*************************/
            //打开选择资产分类弹窗
            chooseRealtionAsset(){
           		this.configAssetDialog.show = true;
            },
            //关闭选择资产分类弹窗
            assetChooseHandler(node){
            	if(node) {
            		this.configAssetDialog.selectId = node.id;
	            	this.relationAssetDialog.searchForm.classificationId = node.id;
	            	this.relationAssetDialog.searchForm.classification = node.categoryName;
            	}           	
            },
            /*****************************选择区域弹窗************************/
            //打开选择区域弹窗
            chooseArea(){
            	this.configAreaDialog.show = true;
            },
            //关闭选择区域弹窗
            areaChooseHandler(node){
            	if(node) {
            		this.configAreaDialog.selectId = node.id;
	           		this.relationAssetDialog.searchForm.regionOfAffiliationId = node.id;
	            	this.relationAssetDialog.searchForm.regionOfAffiliation = node.areaName;
            	}
           }
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch:{
        	
        }
    }

</script>

<style lang="less">
	.relation-asset-content .el-radio__label{display: none;}
	.relation-asset-content .el-form-item{margin-bottom:30px;}
</style>