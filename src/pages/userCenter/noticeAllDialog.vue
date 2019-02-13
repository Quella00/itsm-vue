<template>
	<div class="itsm-tabs-main notice-all-page">	
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>

				<div class="panel-body">
					<el-form :inline="true" :model="configForm.ruleForm" label-width="105px">
						<el-form-item label="关键字：">
							<el-input type="text" v-model="configForm.ruleForm.keyword" placeholder="请输入关键字" auto-complete="off"></el-input>
						</el-form-item>

						<el-form-item label="状态：" style="margin-right: 90px;">
							<el-select v-model="configForm.ruleForm.readStatus" class="resetWidth">
								<el-option v-for="item in statusDropDown" :key="item.value" :label="item.label" :value="item.value" ></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="发布时间：" class="haha">
							<el-date-picker v-model="configForm.ruleForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="queryTableData">查询</el-button>
					</div>
				</div>

				<div class="panel-body">
					<el-table :data="configTable.data" @selection-change="changeSelection" stripe>
						<!-- <el-table-column type="selection" width="100"></el-table-column> -->
						<el-table-column width="50"></el-table-column>
						<el-table-column prop="title" label="通知名称" show-overflow-tooltip>
							<template slot-scope="scope">
								<i style="color:#409EFF;cursor:pointer;" @click="openDetail(scope.row)">{{scope.row.title}}</i>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态">
							<template slot-scope="scope">
								{{ scope.row.readStatus ? '已读' : '未读' }}
							</template>
						</el-table-column>
						<el-table-column prop="createTime" label="通知时间"></el-table-column>
					</el-table>
				</div>

				<div class="panel-footer" style="text-align: right;">
					<el-pagination @size-change="changeTableSize" @current-change="changeTableCurrent" :current-page="configTable.params.pageNum" :page-size="configTable.params.pageSize" :page-sizes="configTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
				</div>
			</div>
		</div>

		<ies-notice-detail ref="notice" v-model="detailDialog.visible" :default-select="detailDialog.defaultSelect"></ies-notice-detail>
		<!--审核弹窗-->
		<el-dialog title="审核详情" width="800px" :close-on-click-modal='false' :visible.sync="knowledgeAuditDialog.show" class="knowledge-audit" @close="closeKnowledgeAuditDialog" v-drag>
			<div class="knowledge-audit">
				<div class="audit-title">
					{{knowledgeAuditDialog.title}}
				</div>
				<div class="audit-content">
					审核意见：{{knowledgeAuditDialog.content}}
					<div><a href="javascript:;" @click="viewDetail" v-if="knowledgeAuditDialog.knowledgeStatus != 2">点击查看详情</a></div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="normal" @click="closeKnowledgeAuditDialog">关闭</el-button>
			</div>
		</el-dialog>
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
				detailDialog: {
					visible: false,
					defaultSelect: ''
				},
				// 搜索表单配置
				configForm: {
					ruleForm: {
						keyword: '',       // 关键字
						readStatus: '',    // 状态
						time: []           // 发布时间
					}
				}, 
				// 状态下拉配置
				statusDropDown: [
					{ label: '全部', value: '' },
					{ label: '未读', value: 0 },
					{ label: '已读', value: 1 }
				],
            	// 列表数据配置
				configTable: {
					url: '/itsm/system/notice/query',
					data: [],
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					params: {
						keyword: '',       // 关键字
						readStatus: '',    // 状态
						fromTime: '',      // 开始时间
						toTime: '',        // 结束时间
						pageNum: 1,        // 当前页
						pageSize: 10       // 每页数量
					}
				},
				// 知识审核/备件审核 弹窗
				knowledgeAuditDialog:{
					type: '',
					show: false,
					title:'',
					id:'',
					knowledgeStatus:''
				}
            }
        },
		mounted() {
            this.init();
		},
		activated() {
            this.init();
		},
        methods: {
			init() {
				const self = this;

				self.$nextTick(self.getTableData);
			},
        	// 获取表格数据
        	getTableData(){
				const self = this;

        		self.$axios.post(self.configTable.url, self.configTable.params).then((res) => {
					if(res.status == 200) {
						//self.configTable.data = res.data ? res.data.list.filter(v => !self.filters.includes(v.id)) : [];
						self.configTable.data = res.data ? res.data.list : [];
						self.configTable.total = res.data ? res.data.total : 0;
					}
				});
			},
			dateFormat(v, format) {
                v = new Date(v);

                const o = {
                    "M+": v.getMonth() + 1, //month
                    "d+": v.getDate(), //day
                    "h+": v.getHours(), //hour
                    "week": v.getDay(), //week
                    "am/pm": v.getHours(), //am/pm
                    "m+": v.getMinutes(), //minute
                    "s+": v.getSeconds(), //second
                    "q+": Math.floor((v.getMonth() + 3) / 3), //quarter
                    "S": v.getMilliseconds() //millisecond
                }
                if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (v.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (const k in o){
                    if (new RegExp("(" + k + ")").test(format)){
                        
                        let kk = '';
                        
                        k == 'week' && (kk = '0' + (o[k] == '00' && '周日' || o[k] == '01' && '周一' || o[k] == '02' && '周二' || o[k] == '03' && '周三' || o[k] == '04' && '周四' || o[k] == '05' && '周五' || o[k] == '06' && '周六'));     
                        
                        k == 'am/pm' && (kk = (o[k] <= 12 ? '0上午 ' : '00下午'));
                        
                        k != 'week' && k != 'am/pm' && (kk = '00' + o[k]);

                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : kk.substr(("" + o[k]).length));
                    }
                }

                return format;
            },
            // checkbox选择项发生变化
			changeSelection(v) {
				const self = this;

				this.configTable.selected = v;
			},
			// pageSize 改变时会触发
			changeTableSize(v) {
				const self = this;

				self.configTable.params.pageSize = v;
				self.getTableData();
			},
			// currentPage 改变时会触发
			changeTableCurrent(v) {
				const self = this;

				self.configTable.params.pageNum = v;
				self.getTableData();
			},
			// 查询表格列表数据
			queryTableData() {
				const self = this;
				
				if(self.computedTime.length) {
				    self.configTable.params.fromTime = self.dateFormat(self.computedTime[0], 'yyyy-MM-dd');
                    self.configTable.params.toTime = self.dateFormat(self.computedTime[1], 'yyyy-MM-dd');
				}else{
					self.configTable.params.fromTime = '';
					self.configTable.params.toTime = '';
				}

				self.configTable.params.keyword = self.configForm.ruleForm.keyword;
				self.configTable.params.readStatus = self.configForm.ruleForm.readStatus;
				self.configTable.params.pageNum = 1;

				self.getTableData();
			},
			// 用来过滤已选中的字段
			selectable(row, index) {
				const self = this;

				return !self.filters.includes(row.id);
			},
			openDetail(row) {
				const self = this, layout = self.$ies.dispatch(this, 'layout');
				
				// 设为已读
				if(!row.readStatus) {
                    self.$axios.post('/itsm/system/notice/read', { noticeId: row.id }).then((res) => {
						res.status == 200 && self.getTableData();
					});
					self.$root.$emit('message-update', row.id);
				}

                // row.type （ 0：系统公告，1：资产审核，2：UC过期，3：工单，5:知识审核，6:备件审核）
				if(row.type == 0) {
                    self.detailDialog.visible = true;
					self.detailDialog.defaultSelect = row.xid;
					return;
				}

//				if(row.type == 1) {
//                  layout.$refs.sidebar.openPage(`/assetUtilization/viewAsset?id=${row.xid}`);
//				}

                if(row.type == 2) {
                    layout.$refs.sidebar.openPage(`/serviceGrade/ucSave?ucId=${row.xid}`);
				}

				if(row.type == 3) {
					// 查询工单 实例id，type
					self.$axios.post('/itsm/system/notice/queryDetail', { noticeId: row.id }).then((res) => {
						if(res.status == 200) {
							const dt = res.data;

							const workOrderType = (dt.type == 1 && 'event') || (dt.type == 2 && 'question') || (dt.type == 3 && 'change') || (dt.type == 4 && 'publish') || (dt.type == 5 && 'spare');
							
							layout.$refs.sidebar.openPage(`/workOrder/orderDatail/${workOrderType}?orderId=${dt.id}&instanceId=${dt.processInstanceId}`);
						}
					});
				}
				if(row.type == 5 || row.type == 6 || row.type == 1) {
					self.knowledgeAuditDialog.type = row.type;
                    self.knowledgeAuditDialog.title = row.title;
                    self.knowledgeAuditDialog.content = row.content;
                    self.knowledgeAuditDialog.id = row.xid;
                    self.knowledgeAuditDialog.knowledgeStatus = row.knowledgeStatus;
					self.knowledgeAuditDialog.show = true;
				}
			},
			// 关闭弹窗
			closeKnowledgeAuditDialog(){
				this.knowledgeAuditDialog.show = false;
			},
			// 查看详情
			viewDetail(){
				this.knowledgeAuditDialog.show = false;

				if(this.knowledgeAuditDialog.type == 5) {
					// 审核未通过的进知识管理，编辑页面
					if(this.knowledgeAuditDialog.knowledgeStatus == 0){
						this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeManage/knowledgeEdit?id='+ this.knowledgeAuditDialog.id);
					} else if(this.knowledgeAuditDialog.knowledgeStatus == 1){
						// 审核通过的进知识检索，详情
					    this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeSearch/knowledgeDetail?id='+ this.knowledgeAuditDialog.id);
					}
				}

				if(this.knowledgeAuditDialog.type == 6) {
					this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/spare/spareApplyDetail?id=${this.knowledgeAuditDialog.id}`);
				}
				
				if(this.knowledgeAuditDialog.type == 1) {
					this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/assetUtilization/viewAsset?id=${this.knowledgeAuditDialog.id}`);
				}
			}
        },
        filters:{
        	
        },
        computed:{
        	computedTime() {
				const self = this;

				return self.configForm.ruleForm.time == null ? [] : self.configForm.ruleForm.time;
			}
        }
    }
</script>

<style lang="less">
    .notice-all-page {
        .reset-width {
            width: 200px;
        }
        .el-form-item {
			margin: 25px 60px 25px 0;
			&.haha {
				.el-form-item__content {
					height: 28px;
					.el-input__inner {
						width: 400px;
						input {
							width: 160px;
							height: 28px;
							min-height: 28px;
							border: none;
							background: none;
							margin-top: -4px;
						}
						.el-range__close-icon {
							position: absolute;
							top: 0;
						}
					}
					.el-date-editor .el-range-separator{
						width: 19px;
						line-height: 1;
					}
					.el-date-editor .el-range__close-icon,.el-date-editor .el-range__icon{
						line-height: 1;
					}
					.del-custom-field {
						left: 410px;
					}
				}
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
        .knowledge-audit{
        	padding: 40px 35px 25px 35px;
        	.audit-title{
        		font-size: 15px; font-weight: bold; text-align: center; margin-bottom: 30px;
        	}
        	.audit-content{
        		a{
        			color:#57a9fd;
        		}
        	}
        }
    }
</style>
