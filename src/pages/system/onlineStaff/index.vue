<template>
	<div class="itsm-tabs-main online-staff-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border query-area">
                <div class="panel-header">
                   	查询条件
                </div>
                
                <div class="panel-body main">
                    <div class="content">
                        	登录ID：
                        <el-input placeholder="请输入登录ID" class="reset-width" v-model="loginName"></el-input>
                    </div>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <div class="fr">
                        <el-button type="normal" icon="el-icon-search" @click="search">查询</el-button>
                    </div>
                </div>
                
                <div class="panel-body">
                    <el-table :data="configTable.data" stripe>
                        <el-table-column width="20"></el-table-column>
                        <el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="loginName" label="登录ID" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="lastLoginTime" label="登录时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="clientDigest" label="登录类型" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-offline" title="强制下线" @click="handleClick(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="configTable.currentPage" 
                    	:page-sizes="[10, 20, 30, 40]" :page-size="configTable.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total">
                    </el-pagination>
                </div>
            </div>
	    </div>
    </div>	
</template>

<script>
export default {
	data() {
		return {
			loginName: '',		// 查询条件,登录id
			searchConditions: {
                loginName: '',
            },
            // 数据列表配置
            configTable: {
                selected: [],   // 选中的 id集合
                currentPage: 1, // 当前页码
                pageSize: 10,	// 每页大小
                total: 0,		// 总条数
                data: []
            }
		};
	},
	mounted() {
		this.$nextTick( ()=>{
			this.query();
		});
	},
	methods: {
		query() {
			var param = {
				pageNum: this.configTable.currentPage,
				pageSize: this.configTable.pageSize,
				loginName: this.searchConditions.loginName
			}
			this.$axios.post('/itsm/system/permission/onlineUserManage/onlineUserPage',param).then( (res) => {
				if(res.status == 200) {
					this.configTable.data = res.data.list;
					this.configTable.total = res.data.total;
				}
			});
		},
		// 查询
		search() {
			this.configTable.currentPage = 1;
			this.searchConditions.loginName = this.loginName;
			this.query();
		},
        // pageSize 改变时会触发
        handleSizeChange(v) {
        	this.configTable.pageSize = v;
        	this.query();
        },
        // currentPage 改变时会触发
        handleCurrentChange(v) {
        	this.configTable.currentPage = v;
        	this.query();
        },
        // 操作
        handleClick(v) {
        	const self = this;
        	
        	if(v.loginName == this.$store.state.user.info.loginName) {
        		
        		// 当前登录用户
        		self.$confirm('确定将当前登录用户强制下线？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
					self.$axios.post('/itsm/system/permission/onlineUserManage/forcingLoginOut', {loginName:v.loginName} ).then( (res) => {
						if(res.status == 200) {
							this.$store.commit('changeUser', null);
							this.$parent.$refs.tabsnav.deleteTabsAll();
		                    this.$nextTick(() => {
		                        this.$router.push('/login');
							});
						} else {
							self.$message({ type: 'error', message: res.message });
						}
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消操作' });
				});
        	} else {
        		
        		// 非当前登录用户
        		self.$confirm('确定将该名用户强制下线？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
					self.$axios.post('/itsm/system/permission/onlineUserManage/forcingLoginOut', {loginName:v.loginName} ).then( (res) => {
						if(res.status == 200) {
							self.$message({ type: 'success', message: res.message });
							self.query();
						} else {
							self.$message({ type: 'error', message: res.message });
						}
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消操作' });
				});
        	}
       }
	}
}
</script>

<style lang="less">
    .online-staff-page {
        .query-area {
            .main {
                height: 110px; overflow: hidden; font-size: 14px; color: #7e7e7e; padding-top: 35px;
                .content { 
                    float: left; width: 280px; margin-right: 150px; margin-left: 50px; 
                }
            }
        }
        .reset-width { 
            width: 200px;
        }
    }
</style>