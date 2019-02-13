<!-- 知识分类弹窗 -->
<template>
    <el-dialog title="知识分类" :visible="value" custom-class="knowledge-classification" @close="knowledgeChoose" :close-on-click-modal='false' width="470px" v-drag>
        <div class="knowledge-classification-content" style="padding:20px 0 0 0;">        
            <ies-scrollbar class="ies-scrollbar">
                <div v-changeTreeH>
                    <el-tree :data="knowledgeDialog.data" :props="knowledgeDialog.defaultProps" :render-content="renderContent" :expand-on-click-node="false" 
                    	node-key="id" :default-expanded-keys="knowledgeDialog.defaultExpanded" highlight-current>
                    </el-tree>
                </div>
            </ies-scrollbar>
		</div>
        <div slot="footer">
            <el-button type="normal" @click="knowledgeChoose('confirm')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
	export default {
	    props: ['defaultSelect','value'],
	    data() {
	        return {
	            knowledgeDialog: {
	                selectNode: null,
	                selectId: '',
	                defaultExpanded: [],
	                data: [],
                    defaultProps: {
	                    label: 'classificationName',
	                    isLeaf: function(data, node) {
							return data.isParent == 1 ? false : true;
						},
						children:'childList'
	                }
	            },
	        };
	    },
	    mounted() {
	        this.$nextTick(function(){
	            this.getknowledgeTree();
	        });
	    },
	    methods: {
	        // 获取业务分类
	        getknowledgeTree() {
	            this.$nextTick(function(){
	                this.$axios.post('/itsm/knowledgeBase/classificationManager/queryMenuTree').then((res) => {
	                    if(res.status == 200) {
	                    	this.knowledgeDialog.data = res.data;
	                    	this.$nextTick(function() { 
		                        if(this.defaultSelect) {
		                            this.knowledgeDialog.defaultExpanded.push(this.defaultSelect);
		                            this.knowledgeDialog.selectId = this.defaultSelect;
		                            this.serachNode(this, this.defaultSelect, this.knowledgeDialog.data);
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
	                    self.knowledgeDialog.selectNode = item;
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
	                        attrs: { value: self.knowledgeDialog.selectId+'', label: data.id+'' },
	                        on: { input: (v) => { self.knowledgeDialog.selectId = v; self.knowledgeDialog.selectNode = data; } }
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
	        // 知识分类弹窗确定按钮方法
	        knowledgeChoose(type) {
	            if(type == 'confirm') {
	                this.knowledgeDialog.selectNode && this.$emit('knowledgeChooseHandler', this.knowledgeDialog.selectNode);
	            }
	            this.$emit('input', false);
	        }
	    }
	}
</script>
<style lang="less">
.knowledge-classification-content{
	height:280px;
	.el-tree{
		position: absolute;padding:0 20px 20px 0;
	}
}
</style>