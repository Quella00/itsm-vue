<!-- 资产审核:查看资产 -->
<template>
	<div class="itsm-tabs-main add-edit-asset">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:changeScrollbarH}">
				<div class="add-edit-asset-container">

					<div>
						<asset-top ref="assetTop"></asset-top>
					</div>

					<div>
						<asset-bottom ref="assetBottom"></asset-bottom>
					</div>
					
					<div>
						<div class="tabs-panel-wrap border" style="margin-top: 10px;">
							<div class="panel-header">
								审核备注
							</div>
							<div class="panel-body">
								<el-form label-width="130px" :model="remarkForm" :rules="remarkRules" ref="remarkForm" style="margin-top: 20px;">
									<el-form-item label="审核：" prop="audit">
										<el-select v-model="remarkForm.audit" @focus="selectOnFocus">
											<el-option label="审核通过" value="true"></el-option>
											<el-option label="审核不通过" value="false"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="备注：" prop="remark" style="width: 510px;" class="remark-textarea">
										<el-input type="textarea" v-model="remarkForm.remark" placeholder="请输入备注"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button type="normal" @click="audit">保存</el-button>
									</el-form-item>
								</el-form>
							</div>
						</div>
					</div>
					
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	import assetTop from './assetTop.vue'
	import assetBottom from './assetBottom.vue'

	export default {
		name: 'viewAudit',
		components: {
			assetTop, assetBottom
		},
		data() {
			let validator = this.$ies.validator;
			return {
				changeScrollbarH: 1,
				remarkForm: {
					audit: "true", 	// 审核
					remark: "" 		// 备注
				},
				remarkRules: {
					remark: [
						{ validator: validator.space, trigger: 'blur', options: {max:200} },
					]
				}
			}
		},
		mounted() {
			this.$nextTick(function() {
				
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 资产审核
			audit() {
				this.$refs['remarkForm'].validate((valid) => {
					if(valid) {
						var param = {
							idList: this.$route.query.id,
							approved: this.remarkForm.audit,
							remark: this.remarkForm.remark
						}
						this.$axios.post('/assets/management/batchAudit',param).then( (res) => {
							if(res.status == 200 && res.data) {
								this.$message({ type: 'success', message: '审核成功!' });
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/assetAudit/viewAsset?id='+this.$route.query.id);
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/assetAudit' );
							} else {
								this.$message({ type: 'error', message: '审核失败' });
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.add-edit-asset-container {
		.remark-textarea {
			textarea {
				min-height: 68px !important;
				min-width: 510px !important;
			}
		}
	}
</style>