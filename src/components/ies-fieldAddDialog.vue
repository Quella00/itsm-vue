<template>
	<el-dialog title="添加字段" v-if="visible" :visible="visible" custom-class="select-person" width="800px" @close="personChoose()" :close-on-click-modal='false' v-drag>
		<div class="select-person-content">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>

				<div class="panel-body" style="height: 80px;">
					<el-form :inline="true" :model="configForm.ruleForm" label-width="105px">
						<el-form-item label="字段名称：">
							<el-input type="text" v-model="configForm.ruleForm.fieldNameChina" placeholder="请输入字段名称" auto-complete="off"></el-input>
						</el-form-item>

                        <el-form-item label="字段类型：">
						    <el-select v-model="configForm.ruleForm.fieldType" class="resetWidth" @focus="selectOnFocus">
	                            <el-option v-for="item in configTypeDropDown" :key="item.value" :label="item.label" :value="item.value" ></el-option>
	                        </el-select>
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
					<el-table :data="configTable.data" @selection-change="changeSelection" ref="multipleTable" stripe>
                        <el-table-column type="selection" width="120"></el-table-column>
                        <el-table-column prop="fieldNameChina" label="字段名称"></el-table-column>
                        <el-table-column prop="fieldTypeChina" label="字段类型"></el-table-column>
                    </el-table>
				</div>

				<div class="panel-footer" style="text-align: right;">
					<el-pagination @size-change="changeTableSize" @current-change="changeTableCurrent" :current-page="configTable.params.pageNum" :page-size="configTable.params.pageSize" :page-sizes="configTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
				</div>
			</div>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button size="normal" @click="personChoose()">取&nbsp;消</el-button>
			<el-button type="normal" @click="personChoose(true)">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
    /**
	* 表单添加字段组件
	* @param  { Boolean }  visible      是否显示 Dialog，支持 .sync 修饰符自动关闭弹出框
	* @param  { Array }    filters      要过滤的数据（例：[ 11, 22, 33, 44, 55 ]）
    * @return { Object }   callback     保存后的回调（返回 false 表示弹窗是被取消或者关闭的）
	**/
    export default {
    	components: { 

		},
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            filters: {
                type: Array,
                default() {
                    return [];
                }
			}
        },
    	data() {
            return {
				// 搜索表单配置
				configForm: {
					ruleForm: {
						fieldNameChina: '',    // 字段名称
						fieldType: ''          // 字段类型
					}
				}, 
				// 字段类型下拉配置
				configTypeDropDown: [
					{ label: '全部', value: '' },
					{ label: '文本框(小)', value: '1_文本框(小)' },
					{ label: '文本框(大)', value: '2_文本框(大)' },
					{ label: '文本域', value: '3_文本域' },
					{ label: '数值框', value: '4_数值框' },
					{ label: '下拉单选列表', value: '5_下拉单选列表' },
					{ label: '下拉复选列表', value: '6_下拉复选列表' },
					{ label: '树形文本框', value: '7_树形文本框' },
					{ label: '单个时间', value: '8_单个时间' },
					{ label: '计划开始结束时间', value: '9_计划开始结束时间' }
				],
            	// 列表数据配置
				configTable: {
					url: '/ahies/autoform/field/queryField',
					data: [],
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					params: {
						fieldNameChina: '',    // 查询 - 字段名称
						fieldType: '',         // 查询 - 字段类型
						pageNum: 1,            // 当前页
						pageSize: 10           // 每页数量
					}
				}
            }
        },
		mounted() {

    	},
        methods: {
        	// 获取表格数据
        	getTableData(){
				const self = this;

        		self.$axios.post(self.configTable.url, self.configTable.params).then((res) => {
					if(res.status == 200) {
						//self.configTable.data = res.data ? res.data.list.filter(v => !self.filters.includes(v.id)) : [];
						self.configTable.data = res.data ? res.data.list : [];
						self.configTable.total = res.data ? res.data.total : 0;

						self.$nextTick(() => {
                            self.configTable.data.forEach(v => {
								if(self.filters.includes(v.id)) {
                                    self.$refs.multipleTable.toggleRowSelection(v);
								}
							})
						});
					}
				});
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

				self.configTable.params.fieldNameChina = self.configForm.ruleForm.fieldNameChina;
				self.configTable.params.fieldType = self.configForm.ruleForm.fieldType;
				self.configTable.params.pageNum = 1;

				self.getTableData();
			},
			rowClass({ row, index }) {
				const self = this;

				return self.filters.includes(row.id) ? 'checkbox-box-d' : '';
			},
			// 用来过滤已选中的字段
			selectable(row, index) {
				const self = this;

				return !self.filters.includes(row.id);
			},
			// 关闭或者点击保存
            personChoose(state){
				const self = this;

				self.configTable.selected = self.configTable.selected.filter(v => !self.filters.includes(v.id))

				self.$emit('callback', state ? self.configTable.selected : false);
                self.$emit('update:visible', false);
			},
			selectOnFocus(e) {
				e.target.blur();
			}
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch: {
           visible(v) {
               const self = this;

               v && (Object.assign(self.$data, self.$options.data()), self.getTableData());
           }
        }
    }
</script>

<style lang="less">
    .checkbox-box-d{
		.el-checkbox{
			.el-checkbox__inner{
				// border-color: #0190fe;
				// background:url(~@/assets/img/icon-checked-n.jpg) no-repeat;
				display: none;
			}
		}
	}
</style>
