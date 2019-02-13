<!--待回访工单-->
<template>
	<div class="itsm-tabs-main wait-order">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form label-width="150px" :model="returnVisit.ruleForm" :rules="returnVisit.rules" ref="ruleForm" :inline="true" class="search-conditions">
						
						<el-form-item label="工单关闭时间 ：" class="time"  prop="time">					
							<el-date-picker  v-model="returnVisit.ruleForm.time"  type="daterange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
						</el-form-item>	
						
						<el-form-item label="状态 ：" prop="state">
							<el-select v-model="returnVisit.ruleForm.visitStatus" placeholder="请选择状态"  @focus="selectOnFocus">
								<el-option v-for="item in returnVisit.visitStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">					
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="reset">重置</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table ref="returnVisitTable" :data="returnVisit.tableData"  :fit="true" stripe  style="width: 100%;">
						<el-table-column prop="theme" label="工单主题" show-overflow-tooltip>
							<template slot-scope="scope">
								<a href="javascript:;" @click="openOrderDetail(scope.row.id,scope.row.processInstanceId)">{{scope.row.theme}}</a>
							</template>
						</el-table-column>
						<el-table-column prop="priority" label="优先级" show-overflow-tooltip></el-table-column>
						<el-table-column prop="visitUserName" label="处理人" show-overflow-tooltip></el-table-column>
						<el-table-column prop="returnVisitStatus" label="是否已回访" show-overflow-tooltip :formatter="changeStatus"></el-table-column>
						<el-table-column prop="createTime" label="工单创建时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="closeTime" label="关闭时间" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="returnVisit.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
						:page-size="returnVisit.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="returnVisit.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'returnVisitOrder',
		data() {
			return {
				returnVisit:{
					//查询条件
					ruleForm:{	
						time:'',           //时间
						visitStatus:''     //状态						
					},
					searchCondition:{
						time:'',           //时间
						closeTimeBegin:'',
						closeTimeEnd:'',
						visitStatus:''     //状态
					},
					visitStatus:[
						{ value: '', label: '全部' },
						{ value: '1', label: '未回访' },
						{ value: '2', label: '已回访' },							
					],
					tableData:[],
					pagination: {		   //分页
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				}	
			};
		},
		activated () {
	        this.$nextTick(this.init);
	    },
		mounted() {
			this.$nextTick( ()=>{
				this.init();
				$('.el-range-input').on('focus',function(e){
					 e.target.blur();
				})
			});
		},
		methods: {
			init(){
				this.getTableData();
			},
			//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
			//获取表格数据
			getTableData(){
				var params = {
					closeTimeBegin:this.returnVisit.searchCondition.closeTimeBegin,
					closeTimeEnd:this.returnVisit.searchCondition.closeTimeEnd,
					visitStatus:this.returnVisit.searchCondition.visitStatus,
					pageNum:this.returnVisit.pagination.currentPage,
					pageSize :this.returnVisit.pagination.pageSize
				}
				this.$axios.post('/work/order/visit',params).then( (res) => {
					if(res.status == 200) {
						this.returnVisit.tableData = res.data.list;
						this.returnVisit.pagination.total = res.data.total;
					}
				});
			},
			//sizeChange事件
			handleSizeChange(size){
				this.returnVisit.pagination.pageSize = size;
				this.getTableData();
			},
			//currentChange事件
			handleCurrentChange(currentPage){
				this.returnVisit.pagination.currentPage = currentPage;
				this.getTableData();
			},
			//打开工单详情
			openOrderDetail(id,instanceId){
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( `/serviceDesk/returnVisit/orderDetail?id=${id}&instanceId=${instanceId}`);				
			},			
			//搜索
			search(){
				this.returnVisit.pagination.currentPage = 1;
				this.returnVisit.searchCondition.closeTimeBegin = (this.returnVisit.ruleForm.time && this.returnVisit.ruleForm.time.length > 0) ? this.returnVisit.ruleForm.time[0] : '';
				this.returnVisit.searchCondition.closeTimeEnd = (this.returnVisit.ruleForm.time && this.returnVisit.ruleForm.time.length > 0) ? this.returnVisit.ruleForm.time[1] : '';
				this.returnVisit.searchCondition.visitStatus = this.returnVisit.ruleForm.visitStatus;
				this.getTableData();
			},
			//转换状态
			changeStatus(row, column, cellValue){
				switch(row.returnVisitStatus){
                    case '1':
						return '未回访'	
					break;
					case '2':
						return '已回访'	
					break;
					default:
						return ''
				}
			},
			reset(){
				this.$refs['ruleForm'].resetFields();
				this.returnVisit.ruleForm.visitStatus = '';
				this.returnVisit.searchCondition.visitStatus = '';
				this.returnVisit.ruleForm.time = '';
//				this.returnVisit.searchCondition.closeTimeBegin = '';
//				this.returnVisit.searchCondition.closeTimeEnd = '';
			}
		}
	}
</script>

<style lang="less">
	.wait-order{
		.el-table a{color:#57a9fd;}
		.el-form{margin-top:25px;
			.time{
	            .el-input__inner{
	                width:400px;
	            }
	            .el-date-editor .el-range-separator{
	                line-height: 1;
	            }
	            .el-date-editor .el-range__close-icon,.el-date-editor .el-range__icon{
	                line-height: 1;
	            }
	        }
		}
	}
</style>