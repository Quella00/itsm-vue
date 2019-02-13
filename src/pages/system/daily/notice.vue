<template>
	<div class="itsm-tabs-main notice-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border query-area">
                <div class="panel-header">
                    查询条件
                </div>
                
                <div class="panel-body main" style="min-height: 130px;">
                    <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="reset-form" label-width="70px">
                        <el-form-item label="关键字：" prop="title">
                            <el-input type="text" v-model="ruleForm.title" placeholder="请输入关键字" auto-complete="off"></el-input>
                        </el-form-item>
                    
                        <el-form-item label="创建人：" prop="createUserName">
                            <el-input type="text" v-model="ruleForm.createUserName" placeholder="请选择创建人" readonly auto-complete="off" @focus="selectOnFocus"></el-input>
                            <i class="el-icon-my-more" style="width: 21px;" @click="personRadioDialog.show = true"></i>
                        </el-form-item>
                    
                        <el-form-item label="优先级别：" prop="priorityLevel">
                            <el-select v-model="ruleForm.priorityLevel" placeholder="请选择优先级别" @focus="selectOnFocus">
                                <el-option v-for="item in configLevel.data" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态：" prop="effectiveStatus">
                            <el-select v-model="ruleForm.effectiveStatus" placeholder="请选择状态" @focus="selectOnFocus">
                                <el-option v-for="item in configState.data" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border table-area" v-autoHeight>
                <div class="panel-header">
                    <div class="fl">
                        <el-button type="normal" icon="el-icon-my-delete" @click="handleDelete">删除</el-button>
                    </div>

                    <div class="fr">
                        <el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
                        <el-button type="normal" icon="el-icon-my-reset" @click="resetForm">重置</el-button>
                        <el-button type="normal" icon="el-icon-my-add" @click="openNoticeSave()">新增</el-button>
                    </div>
                </div>

                <div class="panel-body">
                    <el-table ref="noticeTable" :data="configTable.data" @selection-change="handleSelectionChange" stripe>
                        <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="title" label="公告标题"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="priorityLevel" label="优先级别"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="userName" label="创建人"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="effectiveStatus" label="状态">
                        	<template slot-scope="scope">
                        		{{scope.row.effectiveStatus == 1 ? "有效" : "失效"}}
							</template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openNoticeEdit(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer footer">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="configTable.pageNum" :page-sizes="[10, 20, 30, 40]" 
                    	:page-size="configTable.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
                </div>
            </div>
	    </div>
	    <!-- 选择人员(单选) -->
        <ies-personRadioDialog v-model="personRadioDialog.show" v-if="personRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect="personRadioDialog.selectData"></ies-personRadioDialog>
    </div>
</template>

<script>
export default {
	data() {
		return {
            ruleForm: {
                title: '',
				createUser: '',
				createUserName: '',
                priorityLevel: '',
                effectiveStatus: ''
            },
            searchConditions: {
                title: '',
				createUser: '',
                priorityLevel: '',
                effectiveStatus: ''
            },
            rules: {},
            // 查询条件 -> 优先级别下拉配置
            configLevel: {
                data: [    // 数据源
                	{ value: '', label: '请选择' },
                    { value: '一级（最高）', label: '一级（最高）' },
                    { value: '二级（高）', label: '二级（高）' },
                    { value: '三级（中）', label: '三级（中）' },
                    { value: '四级（低）', label: '四级（低）' },
                    { value: '五级（最低）', label: '五级（最低）' }
                ]
            },
            // 查询条件 -> 状态下拉配置
            configState: {
                data: [    // 数据源
                    { value: '', label: '全部' },
                    { value: '1', label: '有效' },
                    { value: '0', label: '失效' }
                ]
            },
            // 数据列表配置
            configTable: {
                selected: [],   // 选中的 id 集合
                pageNum: 1, 	// 当前页码
                pageSize: 10,
                total: 0,
                data: []
            },
            // 单选(选择人弹窗)
			personRadioDialog: {	
				show: false,
				selectData: {
					id: '',
					type: 'search'
				}
			},
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.query();
		});
	},
	activated() {
//		this.$nextTick(this.query);
		this.$refs.noticeTable.doLayout();
	},
	methods: {
		selectOnFocus(e) {
			e.target.blur();
		},
		query() {
			var param = {
				pageNum: this.configTable.pageNum,
				pageSize: this.configTable.pageSize,
				title: this.searchConditions.title,
				createUser: this.searchConditions.createUser,
				priorityLevel: this.searchConditions.priorityLevel,
				effectiveStatus: this.searchConditions.effectiveStatus,
			}
			this.$axios.post('/itsm/system/dailymanagement/announcement/queryAnnouncement',param).then( (res) => {
				if(res.status == 200) {
					if(res.data == null) {
						this.configTable.data = [];
						this.configTable.total = 0;
					} else {
						this.configTable.data = res.data.list;
						this.configTable.total = res.data.total;
					}
				}
			});
		},
        handleSelectionChange(v) {
            this.configTable.selected = v.map(v => v.id);
        },
        // pageSize 改变时会触发
        handleSizeChange(v) {
        	this.configTable.pageSize = v;
        	this.query();
        },
        // currentPage 改变时会触发
        handleCurrentChange(v) {
        	this.configTable.pageNum = v;
        	this.query();
        },
        // 查询
        search() {
        	this.configTable.pageNum = 1;
        	this.searchConditions.title = this.ruleForm.title;
			this.searchConditions.createUser = this.ruleForm.createUser;
			this.searchConditions.priorityLevel = this.ruleForm.priorityLevel;
			this.searchConditions.effectiveStatus = this.ruleForm.effectiveStatus;
        	this.query();
        },
        // 重置
        resetForm() {
        	this.ruleForm.createUser = '';
        	this.personRadioDialog.selectData.id = "";
        	this.$refs['ruleForm'].resetFields();
        },
        // 选择人员(单选)回调
      	selectPersonRadioHandler(data) {
      		var id = JSON.parse(data).id;
      		var name = JSON.parse(data).userName;
      		this.ruleForm.createUserName = name;
      		this.ruleForm.createUser = id;
      		this.personRadioDialog.selectData.id = id;
      	},
        // 新增
        openNoticeSave() {
            this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/system/noticeAdd" );
        },
        // 编辑
        openNoticeEdit(v) {
            this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/system/noticeEdited?id=" + v );
        },
        // 删除
        handleDelete() {
            const self = this;
            if(!self.configTable.selected.length){
                self.$message({ message: '请至少选择一条数据！', type: 'warning' });
                return;
            }

            self.$confirm('请确认是否要删除该信息?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                var param = {
                	announcementIdList: self.configTable.selected.toString()
                }
                self.$axios.post('/itsm/system/dailymanagement/announcement/deleteAnnouncement', param ).then( (res) => {
					if(res.status == 200 && res.message == "删除成功.") {
						self.query();
						self.$message({ type: 'success', message: '删除成功!' });
					} else {
						self.$message({ type: 'warning', message: '删除失败' });
					}
				});
                
            }).catch(() => {
                self.$message({ type: 'info', message: '已取消操作' });      
            });
        }
	},
	watch: {
		// 新增后刷新页面
		'$store.state.asset.noticePageFlag'(curVal, oldVal) {
			if(curVal !== oldVal) {
				this.configTable.pageNum = 1;
				this.query();
			}
		}
	}
}
</script>