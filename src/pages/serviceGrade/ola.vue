<template>
	<div class="itsm-tabs-main ola-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border query-area">
                <div class="panel-header">查询条件</div>
                
                <div class="panel-body" style="padding: 30px 10px 20px 50px;">
                    <el-form :inline="true" :model="configForm.ruleForm" :rules="configForm.rules" ref="ruleForm" class="reset-form">
                    	<el-row type="flex" style="height:50px">
                    		<el-col :span="10">
	                        <el-form-item label="协议名称：">
								<el-input type="text" v-model="configForm.ruleForm.olaName" placeholder="请输入协议名称" auto-complete="off" class="reset-width"></el-input>
							</el-form-item>
							</el-col>
							<el-col :span="10">
	                        <el-form-item label="对应SLA等级：">
								<el-select v-model="configForm.ruleForm.serviceLevelName" placeholder="请选择建筑" class="resetWidth" @focus="selectOnFocus">
		                            <el-option v-for="item in configOlaTable.serviceLevelData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
		                       </el-select>
                        	</el-form-item>
                        	</el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <div class="fl">
                        <el-button type="normal" icon="el-icon-my-delete" @click="deleteOlaTableData">删除</el-button>
                    </div>

                    <div class="fr">
                        <el-button type="normal" icon="el-icon-my-search" @click="queryOlaTableData">查询</el-button>
                        <el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddOlaTableData()">新增</el-button>
                    </div>
                </div>

                <div class="panel-body">
                    <el-table ref="olaTable" :data="configOlaTable.data" @selection-change="changeSelection" stripe>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="name" label="OLA名称" show-overflow-tooltip></el-table-column>
                        <el-table-column label="状态">
                        	<template slot-scope="scope">
                                {{ scope.row.validStatus == 0 ? '生效' : '失效' }}
							</template>
                        </el-table-column>
                        <el-table-column prop="createUser" label="创建人" show-overflow-tooltip>
							<template slot-scope="scope">
                                {{ scope.row.createUser ? scope.row.createUser : '--' }}
							</template>
                        </el-table-column>
                        <el-table-column prop="serviceLevelName" label="对应SLA等级" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="validityStartTime" label="生效日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="validityEndTime" label="失效日期" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openEditOlaTableData(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer">
                	<el-pagination @size-change="changeOlaTableSize" @current-change="changeOlaTableCurrent" :current-page="configOlaTable.params.pageNum" :page-size="configOlaTable.params.pageSize" :page-sizes="configOlaTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configOlaTable.total"></el-pagination>
                </div>
            </div>
	    </div>
    </div>
</template>

<script>
export default {
	name: 'ola',
	data () {
		return {
			// 查询表单
            configForm: {
                ruleForm: {     
                    olaName: '',
					serviceLevelName: ''
                }
			},
			
			// olaData数据
			configOlaTable: {
				
				selected: [],
				total: 0,
				pageSizes: [10, 20, 30, 40],
				data: [],
				
				params: {
					olaName: '',               // ola名称
					serviceLevelName: '',      // 对应SLA等级名称
                    pageNum: 1,                // 当前页
					pageSize: 10               // 每页数量
				},
				
				// 查询的对应SLA等级
				serviceLevelData: [
					{ label: '全部', value: '' },
					{ label: '一级', value: '一级' },
					{ label: '二级', value: '二级' },
					{ label: '三级', value: '三级' },
					{ label: '四级', value: '四级' },
					{ label: '五级', value: '五级' },
				]
				
			},
			
			// 删除oladata数据
			configDeleteOlaTable: {
				params: {
					deleteOlaIdList: ''     // 删除的OLA数据记录ID集合
				}
			}
		};
	},
	mounted() {
		this.$nextTick( ()=>{
			this.init();
		});
	},
	activated() {
		this.$refs.olaTable.doLayout();
	},
	methods: {
    	//解决ie9不能修改的内容都能获取焦点
    	selectOnFocus(e) {
	        e.target.blur();
	    },
		
		init() {
			//console.log('aaa');
			//console.log( this.$ies.dispatch(this, 'layout').$refs.tabsnav );
			
//			this.$ies.dispatch(this, 'layout').$refs.tabsnav.$on('clickTabs',function(){
//				console.log('触发了ola页面');
//			});
			
			this.getOlaTableData();
		},
		
		// 获取ola表格列表数据
		getOlaTableData() {
			this.$axios.post('/itsm/servicelevel/ola/queryOla', this.configOlaTable.params).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					this.configOlaTable.data = res.data.list;
					this.configOlaTable.total = res.data.total;
				}else{
					this.configOlaTable.data = [];
					this.configOlaTable.total = 0;
				}
			});
		},
		
		// 查询ola表格列表数据
		queryOlaTableData() {
			this.configOlaTable.params.pageNum = 1;
			this.$ies.syncValue(this.configOlaTable.params, this.configForm.ruleForm);
			this.getOlaTableData();
		},
		
		// 删除ola表格选中数据
		deleteOlaTableData() {
			if(!this.configOlaTable.selected.length) {
				this.$message.warning('至少选择一条数据');
				return;
			}
			
			this.$confirm('请确认是否要删除该信息？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				closeOnClickModal: false
			}).then( ()=>{
				this.configDeleteOlaTable.params.deleteOlaIdList = this.configOlaTable.selected.join();
				this.$axios.post('/itsm/servicelevel/ola/deleteOla', this.configDeleteOlaTable.params).then((res) => {
					if(res.status == 200) {
						this.configOlaTable.selected = [];
						this.getOlaTableData();
						this.$message.success( res.message );
					}
				});
			}).catch(() => {
				this.$message.info('已取消删除!');
			});
		},
		
		// checkbox选择项发生变化
		changeSelection( v ) {
            this.configOlaTable.selected = v.map(v => v.id);
		},
		
        // pageSize 改变时会触发
        changeOlaTableSize( v ) {
            this.configOlaTable.params.pageSize = v;
            this.getOlaTableData();
        },
        
        // currentPage 改变时会触发
        changeOlaTableCurrent( v ) {
            this.configOlaTable.params.pageNum = v;
            this.getOlaTableData();
        },
		
		// 新增olaTableData数据
        openAddOlaTableData(v) {
        	this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/olaSave' );
        },
        
        // 编辑olaTableData数据
        openEditOlaTableData( v ) {
        	//this.$store.state.ola.olaId = v;
        	//this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/serviceGrade/ola');
        	//this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/olaEdit' );
        	//this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/olaEdit/id:' + v);
        	//this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/olaEdit?id=' + v);
        	
        	this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/olaEdit', '{"id":' + v + '}' );
        	
//      	setTimeout(() =>{
//      		this.$ies.dispatch(this, 'layout').$refs.tabsItem.clearData();
//      	},1000);
        	
        }
        
	},
	watch: {
		// 监听事件流程管理是否需要刷新
		'$store.state.ola.pageOlaFlag'(curVal, oldVal) {
			if(curVal !== oldVal) {
				console.log('ola列表页刷新了');
				this.getOlaTableData();
			}
		}
	}
}
</script>

<style lang="less">
    /*.ola-page {
        .reset-width { 
            width: 200px;
        }
        .query-area {
            .main {
                height: 110px; overflow: hidden; font-size: 14px; color: #7e7e7e; padding: 35px 0 0 50px;
                .reset-form {
                    .el-form-item {
                        margin: 0 100px 0 60px;
                    }
                }
            }
        }
        .import-dialog-style {
            width: 420px; height: 320px;
            .content {
                padding: 100px 0 0 20px;
            }
            .el-dialog__body {
                height: 220px;
            }
        }
    }*/
</style>