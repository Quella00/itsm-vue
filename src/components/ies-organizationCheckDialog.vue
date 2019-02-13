<!--选择组织弹窗-->
<template>
	<el-dialog title="选择组织" :visible="value" width="470px" custom-class="select-organization" @close="groupChoose" :close-on-click-modal="false" v-drag>
		<div class="select-organization-content" style="padding:20px 0 0 0;">
			<ies-scrollbar class="ies-scrollbar">
                <div v-changeTreeH>
                	<el-tree :data="organizationDialog.data" show-checkbox node-key="id" :default-expanded-keys="[1]"
                		:props="organizationDialog.defaultProps" :expand-on-click-node="false" :render-content="selectOrganizationContent" ref="categoryTree">
                	</el-tree>
                </div>
            </ies-scrollbar>   
        </div>
		<div slot="footer">
			<el-button size="normal" @click="groupChoose">取&nbsp;消</el-button>
			<el-button type="normal" @click="groupChoose('confirm')">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
    export default {
		props:['defaultSelect', 'value'],
    	data() {
            return {
            	// 组织弹窗配置	
				organizationDialog: {
					show: true,     // 弹窗的显示/隐藏
					url: '',
					data: [],
					default: '',
					selectId: null, //选中该节点
					selectNode: null, //选中该节点
					defaultExpanded: [],
	                defaultProps: {
	                    label: 'organizationName',
	                    children: 'children',
	                }
				}
            }
        },
		mounted() {
        	this.$nextTick(function () {
				 this.getTree();
        	});
		},
        methods: {
			//获取组织数据
			getTree() {
				var self = this;
				if(this.defaultSelect.type == 'search'){
					this.organizationDialog.url = '/itsm/system/permission/organization/queryAll';
				}else{
					this.organizationDialog.url = '/itsm/system/permission/organization/queryOrganization';
				}
				self.$axios.post(self.organizationDialog.url).then((res) => {
					if(res.status == 200){
						self.organizationDialog.data = res.data.top;

						self.$nextTick(() => {
							
							if(self.defaultSelect){
								self.$refs.categoryTree.setCheckedKeys(self.defaultSelect);
							}
						});
						
					}else{
						self.$message(res.message);
					}
				});
			},
            selectOrganizationContent(h, { node, data, store }) {
				const self = this;
				
				return h('span', [
					h(
						'i', 
					    {
							style: { 'color': '#ffba72', 'margin-right': '8px' },
							class: node.childNodes.length ? 'el-icon-my-file' : 'el-icon-my-text'
						},
						''
					),
					h('span', node.label)
				]);
			},
			// 保存组织
			groupChoose(type) {
				const self = this;
				if(type == 'confirm') {
					
					var keys = this.$refs.categoryTree.getCheckedKeys();
					
					if(keys.length > 0) {
						var nodes = this.$refs.categoryTree.getCheckedNodes();
						var names = [];
						nodes.forEach(item => names.push(item.organizationName));
						self.$emit('groupChooseHandler', keys, names );
					} else {
						self.$emit('groupChooseHandler', keys, null );
					}
				}
				self.$emit('input', false);
			}
        }
    }

</script>

<style lang="less">
.select-organization .el-tree {
    position: absolute;
    padding:0 20px 20px 0;
}
</style>