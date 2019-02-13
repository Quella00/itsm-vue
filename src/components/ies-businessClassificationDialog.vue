<!-- 业务分类弹窗 -->
<template>
    <el-dialog title="业务分类" :visible="value" custom-class="business-classification" @close="businessChoose" :close-on-click-modal='false' width="470px" v-drag>
        <div class="business-classification-content" style="padding:20px 0 0 0;">        
            <ies-scrollbar class="ies-scrollbar">
                <div v-changeTreeH>
                    <el-tree :data="businessDialog.data" :props="businessDialog.defaultProps" :render-content="renderContent" :expand-on-click-node="false" 
                    	node-key="id" :default-expanded-keys="businessDialog.defaultExpanded" highlight-current>
                    </el-tree>
                </div>
            </ies-scrollbar>
		</div>
        <div slot="footer">
            <el-button type="normal" @click="businessChoose('confirm')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
	export default {
	    props: ['defaultSelect','value'],
	    data() {
	        return {
	            businessDialog: {
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
	            this.getBusinessTree();
	        });
	    },
	    methods: {
	        // 获取业务分类
	        getBusinessTree() {
	            this.$nextTick(function(){
	                this.$axios.post('/itsm/system/config/category/queryOpenAssetsCategory',{categoryId:2,isOpenFlag:true}).then((res) => {
	                    if(res.status == 200) {
	                    	this.businessDialog.data = res.data.top;
	                    	
	                    	this.$nextTick(function() { 
		                        if(this.defaultSelect) {
		                            this.businessDialog.defaultExpanded.push(this.defaultSelect);
		                            this.businessDialog.selectId = this.defaultSelect;
		                            this.serachNode(this, this.defaultSelect, this.businessDialog.data);
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
	                    self.businessDialog.selectNode = item;
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
	                        attrs: { value: self.businessDialog.selectId+'', label: data.id+'' },
	                        on: { input: (v) => { self.businessDialog.selectId = v; self.businessDialog.selectNode = data; } }
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
	        // 业务分类弹窗确定按钮方法
	        businessChoose(type) {
	            if(type == 'confirm') {
	                this.businessDialog.selectNode && this.$emit('businessChooseHandler', this.businessDialog.selectNode);
	            }
	            this.$emit('input', false);
	        }
	    }
	}
</script>
<style lang="less">
.business-classification-content{
	height:280px;
	.el-tree{
		position: absolute;padding:0 20px 20px 0;
	}
}
</style>