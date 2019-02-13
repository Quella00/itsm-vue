<!--选择组织弹窗-->
<template>
	<el-dialog title="选择组织" :visible="value" width="470px" custom-class="select-organization" @close="groupChoose" :close-on-click-modal="false" v-drag>
		<div class="select-organization-content" style="padding:20px 0 0 0;">
			<ies-scrollbar class="ies-scrollbar">
                <div v-changeTreeH>
					<!--<el-tree :data="organizationDialog.data" node-key="id" :default-expanded-keys="organizationDialog.defaultExpanded" :props="organizationDialog.defaultProps" :expand-on-click-node="false"  :render-content="selectOrganizationContent"></el-tree>-->
                	<el-tree :data="organizationDialog.data" node-key="id" :default-expanded-keys="organizationDialog.defaultExpanded" :props="organizationDialog.defaultProps" :expand-on-click-node="false"  :render-content="selectOrganizationContent"></el-tree>
                	
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
				 console.log(this.defaultSelect.type);
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

                        /* 手动过滤被禁止的组织
						var tempdata = [];
						filterNode(tempdata, res.data.top );
						function filterNode(tempdata, data ){
							for(var i = 0; i < data.length; i++) {
								if(data[i].openFlag == 0) {
									
									var childrens = [];
									if(data[i].children){
										childrens = data[i].children;
										//data[i].children = [];
									}
									
									data[i].children = [];
									tempdata.push( data[i] );
									
									if(childrens && childrens.length) {
										tempdata[tempdata.length-1].children = [];
										filterNode(tempdata[tempdata.length-1].children, childrens );
									}
									
								}
							}
						}
						self.organizationDialog.data = tempdata;
						console.log(JSON.stringify(tempdata) );
						*/
						
						self.$nextTick(() => {
							//console.log( self.defaultSelect );
							//self.organizationDialog.default && self.organizationDialog.defaultExpanded.push(self.organizationDialog.default);
							self.defaultSelect.organizationId && self.organizationDialog.defaultExpanded.push(self.defaultSelect.organizationId);
							
							if(self.defaultSelect.organizationId){
								self.organizationDialog.defaultExpanded.push(self.defaultSelect.organizationId);
								self.organizationDialog.selectId = self.defaultSelect.organizationId;
								self.serachNode(self, self.defaultSelect.organizationId, self.organizationDialog.data);
							}
						});
						
					}else{
						self.$message(res.message);
					}
				});
			},
			
	        serachNode(self,id,data){
	            data && data.forEach(function(item){
	                if(item.id == id){
	                    self.organizationDialog.selectNode = item;
	                    return item;
	                } else {
	                    self.serachNode(self,id,item.children);
	                }
	            });
	        },
			
            selectOrganizationContent(h, { node, data, store }) {
				const self = this;
				
				return h('span', null, [
					h(
						'el-radio', 
//					    {
//							attrs: {
//								value: self.organizationDialog.default.toString(),
//								label: node.key.toString()
//							},
//							on: {
//								input: (v) => {
//									self.organizationDialog.default = v;
//									self.organizationDialog.selectNode = data;
//								}
//							}
//						},
//						''
						
	                    {   
	                        class: 'ies-area-dialog'+data.id,
	                        attrs: { 
	                            value: self.organizationDialog.selectId+'',
	                            label: data.id+'',
	                        },
	                        on: {
	                            input: (v) => { 
	                                self.organizationDialog.selectId = v;
	                                
	                                self.organizationDialog.selectNode = data;
	                            }
	                        }
	                    },
	                    ''
						
						
						
					),
					h(
						'i', 
					    {
							style: {
								'color': '#ffba72',
								'margin-right': '8px'
							},
							class: node.childNodes.length ? 'el-icon-my-file' : 'el-icon-my-text'
						},
						''
					),
					h('span', null, node.label)
				]);
			},
			// 保存组织
			groupChoose(type) {
				const self = this;
				if(type == 'confirm') {
					self.organizationDialog.selectNode && self.$emit('groupChooseHandler', self.organizationDialog.selectNode);
				}
				self.$emit('input', false);
				
//				self.organizationDialog.selectNode && self.$emit('groupChooseHandler', self.organizationDialog.selectNode);
//				self.$emit('input', false);
			}
        },
        watch: {

//		    value(v) {
//				const self = this;
//
//				v ? self.$nextTick(function () {
//					self.organizationDialog.default = self.defaultSelect;
//					self.getTree();
//				}) : self.organizationDialog.defaultExpanded = [];
//			}   	

        }
    }

</script>

<style lang="less">
.select-organization .el-tree {
    position: absolute;
    padding:0 20px 20px 0;
}
</style>