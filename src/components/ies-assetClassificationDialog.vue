<!-- 资产分类弹窗 -->
<template>
    <el-dialog title="资产分类" :visible="true" custom-class="subordinateAreaDialogStyle" @close="assetChoose" :close-on-click-modal='false' v-drag>
        <el-container class="queryArea">
            <el-main style="padding:20px 0 0 0;">
                <ies-scrollbar class="ies-scrollbar">
                    <div v-changeTreeH>
                        <el-tree :data="assetDialog.data" :props="assetDialog.defaultProps" :render-content="renderContent" :expand-on-click-node="false" 
                        	node-key="id" :default-expanded-keys="assetDialog.defaultExpanded" highlight-current>
                        </el-tree>
                    </div>
                </ies-scrollbar>
            </el-main>
        </el-container>

        <div slot="footer">
            <el-button type="normal" @click="assetChoose('confirm')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
	export default {
	    props: ['defaultSelect','type'],
	    data() {
	        return {
	            assetDialog: {
	                selectNode: null,
	                selectId: '',
	                defaultExpanded: [],
	                data: [],
	                defaultProps: {
	                    label: 'categoryName',
	                    children: 'children',
	                    isLeaf: 'parentFlag',
	                }
	            },
	        };
	    },
	    mounted() {
	        this.$nextTick(function(){
	            this.getAssetTree();
	        });
	    },
	    methods: {
	        // 获取资产分类
	        getAssetTree() {
	            this.$nextTick(function(){
	            	var param = {
	            		categoryId: 4
	            	};
	            	switch(this.type) {
	            		case 'search':
	            			// 全部分类(包含禁用的)
	            			param['isOpenFlag'] = false; break;
	            		default:
	            			// 非禁用下的
	            			param['isOpenFlag'] = true; break;
	            	}
	                this.$axios.post('/itsm/system/config/category/queryOpenAssetsCategory', param).then((res) => {
	                    if(res.status == 200) {
	                    	this.assetDialog.data = res.data.top;
	                    	this.$nextTick(function() { 
		                        if(this.defaultSelect) {
		                            this.assetDialog.defaultExpanded.push(this.defaultSelect);
		                            this.assetDialog.selectId = this.defaultSelect;
		                            this.serachNode(this, this.defaultSelect, this.assetDialog.data);
		                        }
		                    });
	                    } else {
	                        this.$message(res.message);
	                    }
	                });
	            });
	        },
	        serachNode(self,id,data) {
	            data && data.forEach(function(item) {
	                if(item.id == id) {
	                    self.assetDialog.selectNode = item;
	                    return item;
	                } else {
	                    self.serachNode(self,id,item.children);
	                }
	            });
	        },
	        // 树组件渲染函数
	        renderContent(h, { node, data, store }) {
	            const self = this;
	            var nodeObj = [
           			h('el-radio',
	                    { 
	                        attrs: { value: self.assetDialog.selectId+'', label: data.id+'' },
	                        on: { input: (v) => { self.assetDialog.selectId = v; self.assetDialog.selectNode = data; } }
	                    },
	                    ''
	                ),
            		h('i', 
                    	{
                        	style: { 'color': '#ffba72', 'margin-right': '8px' },
                        	class: node.childNodes.length ? 'el-icon-my-file' : 'el-icon-my-text'
                    	}, 
                    	''
                	),
                	h('span', null, node.label)
            	];
	            return h('span', null, nodeObj);
	        },
	        // 资产分类弹窗确定按钮方法
	        assetChoose(type) {
	            if(type == 'confirm') {
	                this.$emit('assetChooseHandler', this.assetDialog.selectNode);
	            }
	            this.$emit('input', false);
	        }
	    }
	}
</script>

<style lang="less">
	.subordinateAreaDialogStyle .el-tree {
	    position: absolute; padding:0 20px 20px 0;
	}
</style>