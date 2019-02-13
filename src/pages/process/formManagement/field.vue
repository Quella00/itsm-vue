<template>
	<div class="itsm-tabs-main field-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border query-area">
                <div class="panel-header">查询条件</div>
                
                <div class="panel-body main">
                    <el-form :inline="true" :model="configForm.ruleForm" ref="ruleForm" class="reset-form">
                        <el-form-item label="字段名称：">
							<el-input type="text" v-model="configForm.ruleForm.fieldNameChina" placeholder="请输入字段名称" auto-complete="off" class="reset-width" ></el-input>
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
                    <div class="fl">
                        <el-button type="normal" icon="el-icon-my-delete" @click="deleteTableData">删除</el-button>
                    </div>

                    <div class="fr">
                        <el-button type="normal" icon="el-icon-my-search" @click="queryTableData">查询</el-button>
                        <el-button type="normal" icon="el-icon-my-circleAdd" @click="tableAddEdit()">新增</el-button>
                    </div>
                </div>

                <div class="panel-body">
                    <el-table :data="configTable.data" @selection-change="changeSelection" stripe>
                        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                        <el-table-column prop="fieldNameChina" label="字段名称"></el-table-column>
                        <el-table-column prop="fieldTypeChina" label="字段类型"></el-table-column>
                        <el-table-column label="是否必填">
                            <template slot-scope="scope">
                                {{ scope.row.notNull ? '是' : '否' }}
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

        <!-- 新增 / 编辑 -->
        <el-dialog :title="configSaveEdit.title" :visible.sync="configSaveEdit.show" @close="closeDialog" width="440px" custom-class="dialog" :close-on-click-modal="false" v-drag>
            <div class="con">
                <el-form :model="configSaveEdit.params" :rules="configSaveEdit.rules" ref="saveForm" class="resetForm">
                    <el-form-item label="字段名称：" prop="fieldNameChina">
                        <el-input type="text" v-model="configSaveEdit.params.fieldNameChina" placeholder="请输入字段名称" auto-complete="off" class="reset-width"></el-input>
                    </el-form-item>

                    <el-form-item label="字段类型：" prop="fieldTypeChina">
                        <el-select v-model="configSaveEdit.params.fieldTypeChina" class="resetWidth" @change="changeType" @focus="selectOnFocus">
                            <el-option v-for="item in configTypeDropDown" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="configSaveEdit.conShow" ref="fieldCommon" label="字段内容：" prop="fieldCommon" class="fr" style="height: 190px; background: #fafafa; margin-right: -12px; margin-top: -5px; padding: 12px 27px 0 15px;">
                        <el-input type="textarea" placeholder="单个字段不能超过11位，字段数量可添加10个，字段之间使用英文逗号“，”隔开" v-model="configSaveEdit.params.fieldCommon" :rows="8" style="width: 200px;"></el-input>
                    </el-form-item>

                    <el-form-item v-if="configSaveEdit.con2Show" label="组件内容：" prop="fieldCommon" class="fr" style="height: 190px; background: #fafafa; margin-right: -12px; margin-top: -5px; padding: 12px 27px 0 15px;">
                        <el-input type="textarea" placeholder="请输入组件标识" v-model="configSaveEdit.params.fieldCommon" :rows="8" style="width: 200px;"></el-input>
                    </el-form-item>

                    <el-form-item class="fl" style="margin-left: 90px; margin-top: 5px;">
                        <el-checkbox v-model="configSaveEdit.params.notNull">是否必填</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer">
                <el-button type="normal" @click="submit">确定</el-button>
            </div>
        </el-dialog>
        <!--</template>-->
    </div>
</template>

<script>
export default {
	data () {
        let validator = this.$ies.validator;
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
                // { label: '树形文本框', value: '7_树形文本框' }, 徐东说先隐藏
                { label: '单个时间', value: '8_单个时间' },
                { label: '计划开始结束时间', value: '9_计划开始结束时间' }
            ],
			// 列表数据配置
			configTable: {
                url: '/ahies/autoform/field/queryField',
                urlDel: '/ahies/autoform/field/delField',
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
            },
            
            // 新增 / 编辑字段配置
            configSaveEdit: {
                show: false,
                conShow: false,
                title: '',
                urlSave: '/ahies/autoform/field/save',
                urlEdit: '/ahies/autoform/field/updateField',
                systemField: '',     // 字段类型（0：自定义字段，1：系统默认字段）
                selectEditID: '',    // 编辑选中的ID
                params: {
                    fieldNameChina: '',    // 字段名称
                    fieldTypeChina: '',    // 字段类型
                    notNull: false,        // 是否必填
                    fieldCommon: ''        // 字段内容
                },
                rules: {
                    fieldNameChina: [
                        { validator: validator.space, trigger: 'blur', options: { max: 11 } },
                        { required: true, message: '请输入字段名称', trigger: 'blur' },
                        { validator: (r, v, c) => {
                            if(/^\d+?.*$/.test(v)) {
                                c('不能以数字开头');
                            }else {
                                /[~#^$@%&!?%*]/gi.test(v) ? c('字段名称不能包含特殊字符') : c();
                            }
                        }, trigger: 'change' }
                    ],
                    fieldTypeChina: [
                        { required: true, message: '请选择字段类型', trigger: 'change' }
                    ],
                    fieldCommon: [
                        { validator: validator.space, trigger: 'blur' },
                        { required: true, message: '请输入字段内容', trigger: 'change' },
                        { validator: (r, v, c) => {
                            const vArray = v.split(',');

                            if(this.arrRepeat(vArray)) {
                                c('字段内容不能重复');
                                return;
                            }

                            if(vArray.some(item => item.length > 11)) {
                                c('单个字段不能超过11位');
                                return;
                            }

                            if(vArray.length > 10) {
                                c('字段数量超过上限');
                                return;
                            }

                            if(vArray.some(item => !item)) {
                                c('字段内容不能为空');
                                return;
                            }

                            if(!/^[\u4e00-\u9fa50-9A-Za-z\,]+$/.test(v)) {
                                c('字段之间使用英文逗号“，”隔开');
                                return;
                            }

                            c();
                        }, trigger: 'change' }
                    ]
                }
            }
		};
	},
	mounted() {	
		this.$nextTick(this.init);
	},
	methods: {
		init() {
			this.getTableData();
        },
        arrRepeat(arr) {
        　　let hash = {};
        　　for(var i in arr) {
        　　　　if(hash[arr[i]])
        　　　　return true;
        　　　　hash[arr[i]] = true;
        　　}
        　　return false;
        },
		// 获取表格列表数据
		getTableData() {
            const self = this;

			self.$axios.post(self.configTable.url, self.configTable.params).then((res) => {
				if(res.status == 200) {
					self.configTable.data = res.data ? res.data.list : [];
					self.configTable.total = res.data ? res.data.total : 0;
				}
            });
		},
		// 查询表格列表数据
		queryTableData() {
            const self = this;

            self.configTable.params.fieldNameChina = self.configForm.ruleForm.fieldNameChina;
            self.configTable.params.fieldType = self.configForm.ruleForm.fieldType;
            self.configTable.params.pageNum = 1;

			self.getTableData();
        },
        // 用来过滤系统字段和自定义字段的勾选框
        selectable(row, index) {
            return row.systemField ? false : true;
        },
		// 删除表格选中数据
		deleteTableData() {
            const self = this;

			if(!self.configTable.selected.length) {
                self.$message({ type: 'warning', message: '至少选择一条数据' });
				return;
			}
			
			self.$confirm('请确认是否要删除该信息？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then( ()=>{
				self.$axios.post(self.configTable.urlDel, { ids: self.configTable.selected.join() }).then((res) => {
					if(res.status == 200) {
						self.configTable.selected = [];
						self.getTableData();
                    }
                    
                    self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
				});
			}).catch(() => {
				self.$message({ type: 'info', message: '已取消删除' });
			});
		},
		// checkbox选择项发生变化
		changeSelection(v) {
            this.configTable.selected = v.map(v => v.id);
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

            self.configSaveEdit.show = true;
            self.configSaveEdit.title = v ? '修改字段' : '新增字段';
            self.configSaveEdit.conShow = false;
            self.configSaveEdit.con2Show = false;
            self.configSaveEdit.params.fieldNameChina = '';
            self.configSaveEdit.params.fieldTypeChina = '';
            self.configSaveEdit.params.notNull = false;
            self.configSaveEdit.params.fieldCommon = '';

            if(v) {
                self.changeType(v.fieldTypeChina);
                self.configSaveEdit.systemField = v.systemField;
                self.configSaveEdit.selectEditID = v.id;
                self.configSaveEdit.params.fieldNameChina = v.fieldNameChina;
                self.configSaveEdit.params.fieldTypeChina = self.configTypeDropDown.filter(item => item.value.split('_')[0] == v.fieldType)[0].value;
                self.configSaveEdit.params.notNull = v.notNull;
                self.configSaveEdit.params.fieldCommon = v.fieldCommon;
            }
        },
        changeType(v) {
            const self = this;

            self.configSaveEdit.conShow = /下拉/.test(v);
            self.configSaveEdit.con2Show = /树形/.test(v);
            self.$refs['fieldCommon'] && self.$refs['fieldCommon'].resetField();
        },
        closeDialog() {
            const self = this;

            Object.assign(self.$data.configSaveEdit.params, self.$options.data.call(self).configSaveEdit.params);
            self.$refs['saveForm'].resetFields();
        },
        // 提交保存
        submit() {
            const self = this;

            if(self.configSaveEdit.systemField) {
                self.$message({ type: 'info', message: '系统字段不允许编辑' });
                return;
            }

            self.$refs['saveForm'].validate(valid => {
               if(valid) {
                   if(self.configSaveEdit.title == '新增字段') {
                       delete self.configSaveEdit.params['id'];

                        self.$axios.post(self.configSaveEdit.urlSave, self.configSaveEdit.params).then((res) => {
                            if(res.status == 200) {
                                self.configTable.params.pageNum = 1;
                                self.getTableData();
                                self.configSaveEdit.show = false;
                            }
                            
                            self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
                        });
                   }else {
                        self.configSaveEdit.params['id'] = self.configSaveEdit.selectEditID;

                        self.$axios.post(self.configSaveEdit.urlEdit, self.configSaveEdit.params).then((res) => {
                            if(res.status == 200) {
                                self.getTableData();
                                self.configSaveEdit.show = false;
                            }
                            
                            self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
                        });
                   }
               }
            })
        },
        selectOnFocus(e) {
            e.target.blur();
        }
	}
}
</script>

<style lang="less">
    .field-page {
        .reset-width {
            width: 200px;
        }
        .dialog {
            .con {
                width: 305px;
                overflow: hidden;
                margin: auto;
                padding: 45px 0 0 0;
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