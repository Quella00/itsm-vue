<template>
    <!-- 所属区域弹窗 -->
    <el-dialog :visible="true" :close-on-click-modal='false' custom-class="subordinateAreaDialogStyle" @close="areaChoose" v-drag>
        <span slot="title" style="color:#666666;">选择区域</span>

        <el-container class="queryArea">
            <el-main style="padding:20px 0 0 0;">
                <ies-scrollbar class="ies-scrollbar">
                    <div v-changeTreeH>
                        <el-tree :data="configAreaDialog.data" :expand-on-click-node="false" node-key="id" :default-expanded-keys="configAreaDialog.defaultExpanded"
                            :props="configAreaDialog.defaultProps" :render-content="renderAreaContent" highlight-current></el-tree>
                    </div>
                </ies-scrollbar>
            </el-main>
        </el-container>

        <div slot="footer">
            <el-button type="primary" size="normal"  @click="areaChoose('confirm')">确&nbsp;定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props:['defaultSelect','value'],
    data (){
        return {
            // 所属区域弹窗配置
            configAreaDialog: {
                selectId: null, //选中该节点
                selectNode: null, //选中该节点
                defaultExpanded: [],
                data:[],
                defaultProps: {
                    label: 'areaName',
                    children: 'children',
                    isLeaf: 'parentFlag',
                }
            },
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.init();
        })
    },
    methods:{
        init(){
            const self = this;
            
            this.getAreaTree();
        },
         //获取所属区域树
        getAreaTree() {
            var self = this;
            this.$axios.post('/itsm/system/config/area/queryAll').then((res) => {
                if(res.status==200){
                    this.configAreaDialog.data = res.data.top;
                    this.$nextTick(function(){
                        if(this.defaultSelect){
                            this.configAreaDialog.defaultExpanded.push(this.defaultSelect);
                            this.configAreaDialog.selectId = this.defaultSelect;
                            this.serachNode(this,this.defaultSelect,this.configAreaDialog.data);
                        }
                    });
                }else{
                    this.$message(res.message);
                }
            });
        },
        serachNode(self,id,data){
            data && data.forEach(function(item){
                if(item.id == id){
                    self.configAreaDialog.selectNode = item;
                    return item;
                } else {
                    self.serachNode(self,id,item.children);
                }
            });
        },
        //树组件渲染函数
        renderAreaContent(h, { node, data, store }) {
            const self = this;
            return h('span', null, [
                h('el-radio',
                    {   
                        class: 'ies-area-dialog'+data.id,
                        attrs: { 
                            value: self.configAreaDialog.selectId+'',
                            label: data.id+'',
                        },
                        on: {
                            input: (v) => { 
                                self.configAreaDialog.selectId = v;
                                
                                self.configAreaDialog.selectNode = data;
                            }
                        }
                    },
                    ''
                ),
                h('i', 
                    {
                        style: {
                            'color': '#ffba72',
                            'margin-right': '8px'
                        },
                        class: 'el-icon-document'
                    }, 
                    ''
                ),
                h('span', null, node.label)
            ]);
        },
        // 所属区域弹窗确定按钮方法
        areaChoose(type) {
            if (type=='confirm'){
                this.$emit('areaChooseHandler', this.configAreaDialog.selectNode)
            }
            this.$emit('input', false);
        },
    },
}
</script>
<style lang="less">
.subordinateAreaDialogStyle .el-tree {
    position: absolute;
    padding:0 20px 20px 0;
}
</style>
