<template>
	<div class="itsm-tabs-main form-save-page">	
        <div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div>
					<el-collapse v-model="configForm.activeNames">
						<el-collapse-item  name="1">
							<template slot="title">
								<div class="fl">
									基本信息 <i class="el-icon-my-contraction"></i>
								</div>

								<div class="fr">
									<el-button type="normal" icon="el-icon-my-add" @click.stop="fieldAdd(0)">添加字段</el-button>
								</div>
							</template>

							<el-form :model="configForm.params" ref="infoForm" class="info-form" label-width="110px">
								<el-form-item
									v-for="(item, index) in configForm.params.customInfoField"
									:label="`${item.fieldNameChina}：`"
									:key="item.fieldNameChina"
									:prop="`customInfoField.${index}.value`"
									:rules="item | fieldType"
									:class="item | fieldClass"
								>
                                    <el-input v-model="item.value" v-if="item.fieldType == 3" placeholder="" type="textarea" resize="none"></el-input>

									<el-select v-model="item.value" v-else-if="item.fieldType == 5" placeholder="" @focus="selectOnFocus">
										<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
									</el-select>

									<el-select v-model="item.value" v-else-if="item.fieldType == 6" placeholder="" multiple collapse-tags @focus="selectOnFocus">
										<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
									</el-select>
									
									<template v-else-if="item.fieldType == 7">
										<el-input placeholder="" v-model="item.value" readonly></el-input>
										<!-- 系统字段 -->
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'businessClassification'"  @click="openBusinessClass(item)"></i>
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'technicalClassification'" @click="openTechnologyClass(item)"></i>
                                        
                                        <!-- 自定义字段 -->
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'yewu'"  @click="openBusinessClass(item)"></i>
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'jishu'" @click="openTechnologyClass(item)"></i>
									</template>

									<el-date-picker v-model="item.value" v-else-if="item.fieldType == 8" type="datetime" :editable="false" placeholder="" ></el-date-picker>

                                    <template v-else-if="item.fieldType == 9">
										<el-date-picker v-model="item.value" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
									</template>

									<el-input v-model="item.value" v-else placeholder=""></el-input>

									<i v-if="!item.systemField" class="el-icon-my-tabDeleteAll del-custom-field" @click="delCustomField(item.id, 0)"></i>
								</el-form-item>
							</el-form>
						</el-collapse-item>
						
						<el-collapse-item  name="2">
							<template slot="title">
								<div class="fl">
									工单信息 <i class="el-icon-my-contraction"></i>
								</div>

								<div class="fr">
									<el-button type="normal" icon="el-icon-my-add" @click.stop="fieldAdd(1)">添加字段</el-button>
								</div>
							</template>

							<div>
								<el-form :model="configForm.params" ref="workOrderForm" class="work-order-form" label-width="110px">
									<el-form-item
										v-for="(item, index) in configForm.params.customWorkOrderField"
										:label="`${item.fieldNameChina}：`"
										:key="item.fieldNameChina"
										:prop="`customWorkOrderField.${index}.value`"
										:rules="item | fieldType"
										:class="item | fieldClass"
									>
                                        <el-input v-model="item.value" v-if="item.fieldType == 3" placeholder="" type="textarea" resize="none"></el-input>

										<el-select v-model="item.value" v-else-if="item.fieldType == 5" @focus="selectOnFocus">
											<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
										</el-select>

										<el-select v-model="item.value" v-else-if="item.fieldType == 6" placeholder="" multiple collapse-tags @focus="selectOnFocus">
											<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
										</el-select>

										<template v-else-if="item.fieldType == 7">
											<el-input placeholder="" v-model="item.value" readonly></el-input>
											<!-- 系统字段 -->
											<i class="el-icon-my-more" v-if="item.fieldCommon == 'businessClassification'"  @click="openBusinessClass(item)"></i>
											<i class="el-icon-my-more" v-if="item.fieldCommon == 'technicalClassification'" @click="openTechnologyClass(item)"></i>
											
											<!-- 自定义字段 -->
											<i class="el-icon-my-more" v-if="item.fieldCommon == 'yewu'"  @click="openBusinessClass(item)"></i>
											<i class="el-icon-my-more" v-if="item.fieldCommon == 'jishu'" @click="openTechnologyClass(item)"></i>
										</template>

										<el-date-picker v-model="item.value" v-else-if="item.fieldType == 8" type="datetime" :editable="false" placeholder="" ></el-date-picker>

										<template v-else-if="item.fieldType == 9">
											<el-date-picker v-model="item.value" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
										</template>

										<el-input v-model="item.value" v-else placeholder=""></el-input>

										<i v-if="!item.systemField" class="el-icon-my-tabDeleteAll del-custom-field" @click="delCustomField(item.id, 1)"></i>
									</el-form-item>
								</el-form>
							</div>
						</el-collapse-item>
					</el-collapse>

					<div class="submit">
						<el-button type="normal" @click="submit">&nbsp;保&nbsp;存&nbsp;</el-button>
					</div>
				</div>
			</ies-scrollbar>
		</div>

		<ies-business-classification-dialog v-model="configForm.businessClassificationDialog" v-if="configForm.businessClassificationDialog" @businessChooseHandler="businessChooseHandler"></ies-business-classification-dialog>
		<ies-technology-classification-dialog v-model="configForm.technologyClassificationDialog" v-if="configForm.technologyClassificationDialog" @technologyChooseHandler="technologyChooseHandler"></ies-technology-classification-dialog>
	    <ies-field-add-dialog :visible.sync="configFieldAddDialog.show" :filters="customFieldSum" @callback="fieldAddCallback"></ies-field-add-dialog>
	</div>
</template>

<script>
export default {
	data () {
		return {
			configFieldAddDialog: {
				show: false,    // 弹窗的 显示 / 隐藏
				position: ''    // 弹窗的发起位置（0：基本信息，1：工单信息）
			},
			// 表单信息配置
            configForm: {
				activeNames: ['1','2'],                                            // 折叠面板 
				urlQuery: '/ahies/autoform/manager/content/base/queryMessage',     // 查询自定义字段
				urlQueryParams: {
					formContentmanageId: '',                                       // 表单版本 ID
					formType: 1                                                    // 表单类型 1：代表基础信息 2：代表工单信息
				},
				urlSave: '/ahies/autoform/manager/content/base/save',
                params: {
					// 自定义字段（基本信息）
					customInfoField: [],
					customInfoFieldOld: [],    // 备份数据进行对比
					
					// 自定义字段（工单信息）
					customWorkOrderField: [],
					customWorkOrderFieldOld: []    // 备份数据进行对比
				},
				// 业务分类弹窗
				businessClassificationDialog: false,
				// 业务分类选中的数据行
				businessClassificationSelect: '',
				// 技术分类弹窗
				technologyClassificationDialog: false,
				// 技术分类选中的数据行
				technologyClassificationSelect: ''
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

			self.configForm.urlQueryParams.formContentmanageId = self.$route.query.formContentmanageId || self.$store.state.process.formVersion;

			self.configForm.urlQueryParams.formType = 1;
			self.$axios.post(self.configForm.urlQuery, self.configForm.urlQueryParams).then((res) => {
				if(res.status == 200) {
					if(res.data) {
						// 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
						res.data.forEach(item => { self.$set(item, 'value', item.fieldType == 6 ? [] : '') });
						self.configForm.params.customInfoField = res.data;
						self.configForm.params.customInfoFieldOld = res.data;
					}else {
						self.configForm.params.customInfoField = [];
						self.configForm.params.customInfoFieldOld = [];
					}
				}
			});
			
			self.configForm.urlQueryParams.formType = 2;
			self.$axios.post(self.configForm.urlQuery, self.configForm.urlQueryParams).then((res) => {
				if(res.data) {
					// 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
					res.data.forEach(item => { self.$set(item, 'value', item.fieldType == 6 ? [] : '') });
					self.configForm.params.customWorkOrderField = res.data;
					self.configForm.params.customWorkOrderFieldOld = res.data;
				}else {
					self.configForm.params.customWorkOrderField = [];
					self.configForm.params.customWorkOrderFieldOld = [];
				}
			});
		},
		// 业务分类
		openBusinessClass(item) {
			const self = this;
            
			self.configForm.businessClassificationDialog = true;
			self.configForm.businessClassificationSelect = item;
		},
		businessChooseHandler(v) {
			const self = this;

            //self.configForm.params.businessClass = v.categoryName;
			self.configForm.businessClassificationDialog = false;
			self.$set(self.configForm.businessClassificationSelect, 'value', v.categoryName);
		},
		
		// 技术分类
		openTechnologyClass(item) {
			const self = this;

			self.configForm.technologyClassificationDialog = true;
			self.configForm.technologyClassificationSelect = item;
		},
		technologyChooseHandler(v) {
			const self = this;

            //self.configForm.params.technology = v.categoryName;
			self.configForm.technologyClassificationDialog = false;
			self.$set(self.configForm.technologyClassificationSelect, 'value', v.categoryName);
		},
		
		// 添加自定义字段（0：基本信息，1：工单信息）
		fieldAdd(v) {
			const self = this;

			self.configFieldAddDialog.position = v;  // 记录弹窗发起位置
            self.configFieldAddDialog.show = true;
		},
		fieldAddCallback(v) {
			const self = this;

			if(v){
                if(self.configFieldAddDialog.position == 0 && self.configForm.params.customInfoField.concat(v).filter(v => !v.systemField).length > 5) {
					self.$message({ type: 'warning', message: '基本信息自定义字段最多不能超过 5 个' });
					return;
				}

				if(self.configFieldAddDialog.position == 1 && self.configForm.params.customWorkOrderField.concat(v).filter(v => !v.systemField).length > 5) {
					self.$message({ type: 'warning', message: '工单信息自定义字段最多不能超过 5 个' });
					return;
				}
				
                // 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
				v.length && v.forEach(item => { self.$set(item, 'value', item.fieldType == 6 ? [] : '') });

				self.configFieldAddDialog.position == 0
				? self.configForm.params.customInfoField = self.configForm.params.customInfoField.concat(v)
				: self.configForm.params.customWorkOrderField = self.configForm.params.customWorkOrderField.concat(v);
			}
		},
		// 删除自定义字段（0：基本信息，1：工单信息）
		delCustomField(id, position) {
			const self = this;
			
			position == 0 
			? self.configForm.params.customInfoField = self.configForm.params.customInfoField.filter(v => v.id != id)
			: self.configForm.params.customWorkOrderField = self.configForm.params.customWorkOrderField.filter(v => v.id != id);
		},

		submit() {
			const self = this;

			if(self.customFieldSum.equals(self.customFieldSumOld)) {
				self.$message({ type: 'warning', message: '您没有对表单进行有效编辑，无法保存为新版本' });
				return;
			}

			const params = {
				formContentmanageId: self.$route.query.formContentmanageId,
				baseMessage: self.configForm.params.customInfoField.map(v => v.id).join(),
				workOrder: self.configForm.params.customWorkOrderField.map(v => v.id).join()
			}

			self.$axios.post(self.configForm.urlSave, params).then((res) => {
                if(res.status == 200) {
					self.$root.$emit('form-update');
					self.$ies.dispatch(self, 'layout').$refs.tabsnav.closePage(self.$route.fullPath);
					self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage('/process/formManagement/form');
				}
				
				self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message });
			});
		},
		selectOnFocus(e) {
			e.target.blur();
		}
	},
	computed: {
		customFieldSum() {
			const self = this;

			return self.configForm.params.customInfoField.concat(self.configForm.params.customWorkOrderField).map(v => v.id);
		},
		customFieldSumOld() {
			const self = this;

			return self.configForm.params.customInfoFieldOld.concat(self.configForm.params.customWorkOrderFieldOld).map(v => v.id);
		}
	},
	filters: {
        fieldClass(v) {
            return {
				'custom-field-class-small': v.fieldType == 1,                // 文本框(小)
				'custom-field-class-big': v.fieldType == 2,                  // 文本框(大)
				'custom-field-class-domain': v.fieldType == 3,               // 文本域
				'custom-field-class-number': v.fieldType == 4,               // 数值框
				'custom-field-class-dropDown-radio': v.fieldType == 5,       // 下拉单选列表
				'custom-field-class-dropDown-checkbox': v.fieldType == 6,    // 下拉复选列表
				'custom-field-class-tree': v.fieldType == 7,                 // 树形文本框
				'custom-field-class-time': v.fieldType == 8,                 // 单个时间
				'custom-field-class-times': v.fieldType == 9                 // 计划开始结束时间
			}
		},
        fieldType(v) {
			let rules = [];
			if(v.notNull) {
				switch(v.fieldType){
                    case 1:
						rules.push(
							{ validator: ies.validator.space, options: { max: 11 } },
							{ required: true, message: `请输入${v.fieldNameChina}` }
						);
					break;

					case 2:
						rules.push(
							{ validator: ies.validator.space, options: { max: 50 } },
							{ required: true, message: `请输入${v.fieldNameChina}` }
						);
					break;

					case 3:
						rules.push(
							{ validator: ies.validator.space, options: { max: 300 } },
							{ required: true, message: `请输入${v.fieldNameChina}` }
						);
					break;

					case 4:
						rules.push(
							{ validator: ies.validator.space, options: { max: 11 } },
							{ required: true, message: `请输入${v.fieldNameChina}` }, 
							{ validator: ies.validator.num }
						);
					break;

					case 5:
                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
					break;

					case 6:
                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
					break;

					case 7:
                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
					break;

					case 8:
                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
					break;

					case 9:
                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
					break;
					//default:
				}

				return rules;
			}
		}
	}
}
</script>

<style lang="less">
    @import '~@/assets/less/process/formSavePage.less';
</style>