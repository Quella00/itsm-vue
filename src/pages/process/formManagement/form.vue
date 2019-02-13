<template>
	<div class="itsm-tabs-main form-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-body">
                    <el-table :data="configTable.data" stripe>
                        <el-table-column width="30"></el-table-column>
                        <el-table-column prop="formName" label="表单名称"></el-table-column>
                        <el-table-column prop="formVersion" label="当前版本"></el-table-column>
						<el-table-column prop="updateUser" label="最近修改人"></el-table-column>
						<el-table-column prop="updateTime" label="最近修改时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="tableAddEdit(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- <div class="panel-footer">
                	<el-pagination @size-change="changeTableSize" @current-change="changeTableCurrent" :current-page="configTable.params.pageNum" :page-size="configTable.params.pageSize" :page-sizes="configTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
                </div> -->
            </div>
	    </div>
    </div>
</template>

<script>
export default {
	data () {
		return {
			// 列表数据
			configTable: {
                url: '/ahies/autoform/manager/queryForm',
				data: [
                    // { id: 1, name: '事件表单', version: '07', user: '超级管理员', updateTime: '2017-11-20 02:49:50'  },
					// { id: 2, name: '问题表单', version: '07', user: '超级管理员', updateTime: '2017-11-20 02:49:50'  },
					// { id: 3, name: '变更表单', version: '07', user: '超级管理员', updateTime: '2017-11-20 02:49:50'  },
					// { id: 4, name: '发布表单', version: '07', user: '超级管理员', updateTime: '2017-11-20 02:49:50'  },
					// { id: 5, name: '备件表单', version: '07', user: '超级管理员', updateTime: '2017-11-20 02:49:50'  }
                ]
                /*
				total: 0,
				pageSizes: [10, 20, 30, 40],
				params: {
                    pageNum: 1,               // 当前页
					pageSize: 10              // 每页数量
                }
                */
            }
		};
	},
	mounted() {
        this.$nextTick(this.init);
    },
    activated () {
        
    },
	methods: {
		init() {
            const self = this;

            self.getTableData();
            self.$root.$on('form-update', () => {
                self.getTableData();
            });
		},
		// 获取表格列表数据
		getTableData() {
            const self = this;
            
			self.$axios.post(self.configTable.url).then((res) => {
				if(res.status == 200) {
					self.configTable.data = res.data;
					self.configTable.total = res.data.total;
				}
            });
		},
        // pageSize 改变时会触发
        changeTableSize( val ) {
            const self = this;

            self.configTable.params.pageSize = val;
            self.getTableData();
        },
        // currentPage 改变时会触发
        changeTableCurrent(val) {
            const self = this;

            self.configTable.params.pageNum = val;
            self.getTableData();
        },	
		// 新增 / 编辑 - 数据
        tableAddEdit(id) {
            const self = this;

            self.$store.commit('changeFormType', id);
			self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/process/formManagement/formVersion?formmanageId=${id}`);
        },
        // 提交保存
        submit() {
            const self = this;

            self.configSaveEdit.show = false;
        }
	}
}
</script>

<style lang="less">
    .form-page {
        .reset-width {
            width: 200px;
        }
        .dialog {
            height: 440px;
            .con {
                width: 650px;
                height: 340px;
                margin: auto;
                padding: 50px 0 10px 0;
            }
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
    }
</style>