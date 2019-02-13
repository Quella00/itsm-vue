<!-- 技术分类弹窗 -->
<template>
    <el-dialog title="技术分类" :visible="value" custom-class="technology-classification" @close="technologyChoose" :close-on-click-modal='false' width="470px" v-drag>
        <div class="technology-tree-content" style="padding:20px 0 0 0;">
            <ies-scrollbar class="ies-scrollbar">
                <div v-changeTreeH>
                    <el-tree :data="technologyDialog.data" :props="technologyDialog.defaultProps" :render-content="renderContent" :expand-on-click-node="false" 
                    	node-key="id" :default-expanded-keys="technologyDialog.defaultExpanded" highlight-current>
                    </el-tree>
                </div>
            </ies-scrollbar>
        </div>

        <div slot="footer">
            <el-button type="normal" @click="technologyChoose('confirm')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
	export default {
	    props: ['defaultSelect','value'],
	    data() {
	        return {
	            technologyDialog: {
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
	            this.getTechnologyTree();
	        });
	    },
	    methods: {
	        // 获取技术分类
	        getTechnologyTree() {
	            this.$nextTick(function(){
	                this.$axios.post('/itsm/system/config/category/queryOpenAssetsCategory',{categoryId:3,isOpenFlag:true}).then((res) => {
	                    if(res.status == 200) {
	                    	this.technologyDialog.data = res.data.top;
	                    	
	                    	this.$nextTick(function() { 
		                        if(this.defaultSelect) {
		                            this.technologyDialog.defaultExpanded.push(this.defaultSelect);
		                            this.technologyDialog.selectId = this.defaultSelect;
		                            this.serachNode(this, this.defaultSelect, this.technologyDialog.data);
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
	                    self.technologyDialog.selectNode = item;
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
	                        attrs: { value: self.technologyDialog.selectId+'', label: data.id+'' },
	                        on: { input: (v) => { self.technologyDialog.selectId = v; self.technologyDialog.selectNode = data; } }
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
	        // 技术分类弹窗确定按钮方法
	        technologyChoose(type) {
	            if(type == 'confirm') {
	               this.technologyDialog.selectNode && this.$emit('technologyChooseHandler', this.technologyDialog.selectNode);
	            }
	            this.$emit('input', false);
	        }
	    }
	}
</script>
<style lang="less">
	.technology-tree-content{		
		height:280px;
		.el-tree{
			position: absolute;padding:0 20px 20px 0;
		}
	}
</style>