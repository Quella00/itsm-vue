<template>
	<div class="itsm-tabs-main form-version-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">表单版本 - {{ title }}</div>

                <div class="panel-body">
                    <el-table :data="configTable.data" stripe>
                        <el-table-column width="60"></el-table-column>
                        <el-table-column prop="formVersion" label="版本号"></el-table-column>
						<el-table-column prop="updateUser" label="最近修改人"></el-table-column>
						<el-table-column prop="updateTime" label="最近修改时间"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-radio v-model="configTable.selectId" :label="scope.row.id" @change="changeVersion">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="tableAddEdit(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer">
                	<el-pagination @size-change="changeTableSize" @current-change="changeTableCurrent" :current-page="configTable.params.pageNum" :page-size="configTable.params.pageSize" :page-sizes="configTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
                </div>
            </div>
	    </div>
    </div>
</template>

<script>
export default {
	data () {
		return {
            title: '',
			// 列表数据
			configTable: {
                url: '/ahies/autoform/manager/content/queryContent',
				data: [],
                selectId: '',
				total: 0,
				pageSizes: [10, 20, 30, 40],
				params: {
                    formmanageId: '',    // 表单管理类型的 ID 
                    pageNum: 1,                                      // 当前页
					pageSize: 10                                     // 每页数量
                },
                urlUpdate: '/ahies/autoform/manager/content/base/updateFormStatus',
                paramsUpdate:{
                    formmanageId: '',    // 表单版本 ID
                    formId: ''           // 表单管理 ID
                }
            }
		};
	},
	mounted() {
        this.$nextTick(this.init);
    },
    activated () {

    },
	methods: {
        changeVersion() {
            const self = this;

            self.configTable.paramsUpdate.formId = self.configTable.params.formmanageId;
            self.configTable.paramsUpdate.formmanageId = self.configTable.selectId;

            self.$axios.post(self.configTable.urlUpdate, self.configTable.paramsUpdate).then((res) => {
                /*
                if(res.status == 200) {
                    self.configTable.params.pageNum = 1;
                    self.getTableData();
                }
                */
                self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message });
            });
        },
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

            self.configTable.params.formmanageId = self.$route.query.formmanageId || self.$route.query.formFormManageId;
            
            self.configTable.params.formmanageId == 1 && (self.title = '事件');
            self.configTable.params.formmanageId == 2 && (self.title = '问题');
            self.configTable.params.formmanageId == 3 && (self.title = '变更');
            self.configTable.params.formmanageId == 4 && (self.title = '发布');
            self.configTable.params.formmanageId == 5 && (self.title = '备件');
            
			self.$axios.post(self.configTable.url, self.configTable.params).then((res) => {
                if(res.status == 200) {
                    if(res.data) {
                        self.configTable.data = res.data.list;
                        self.configTable.total = res.data.total;

                        const openStatus = res.data.list.filter(v => v.openStatus);
                        self.configTable.selectId = openStatus.length ? openStatus[0].id : '';
                    }else {
                        self.configTable.data = [];
                        self.configTable.selectId = '';
                    }
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
        tableAddEdit(v) {
            const self = this;

            let { id, formFormManageId } = v, url;
            /*
            formFormManageId == 1 && (url = 'formSaveEvent');
            formFormManageId == 2 && (url = 'formSaveProblem');
            formFormManageId == 3 && (url = 'formSaveChange');
            formFormManageId == 4 && (url = 'formSaveRelease');
            formFormManageId == 5 && (url = 'formSaveSpareParts');
            */

            if(formFormManageId == 1) {
                url = 'formSaveEvent';
                self.$store.commit('changeFormVersion', { type: 'event', id: id });
            }

            if(formFormManageId == 2) {
                url = 'formSaveProblem';
                self.$store.commit('changeFormVersion', { type: 'problem', id: id });
            }

            if(formFormManageId == 3) {
                url = 'formSaveChange';
                self.$store.commit('changeFormVersion', { type: 'change', id: id });
            }

            if(formFormManageId == 4) {
                url = 'formSaveRelease';
                self.$store.commit('changeFormVersion', { type: 'release', id: id });
            }

            if(formFormManageId == 5) {
                url = 'formSaveSpareParts';
                self.$store.commit('changeFormVersion', { type: 'spareParts', id: id });
            }
            
            self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/process/formManagement/${url}?formContentmanageId=${id}&formFormManageId=${formFormManageId}`);
        },
        // 提交保存
        submit() {
            const self = this;

            self.configSaveEdit.show = false;
        }
    },
    watch: {
		'$store.state.process.formType'(v) {
            this.init();
		}
	}
}
</script>

<style lang="less">
    .form-version-page {
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