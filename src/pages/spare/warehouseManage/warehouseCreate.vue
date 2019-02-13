<!-- 新增资产 -->
<template>
    <div class="itsm-tabs-main add-edit-spare">
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
                <div class="add-edit-spare-container">
                    <div>
                        <el-collapse v-model="activeNames" >
                            <el-collapse-item name="1">
                                <template slot="title">
                                    基础信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <wareBase ref="wareBase"></wareBase>
                            </el-collapse-item>

                            <el-collapse-item name="2">
                                <template slot="title">
                                    入库设备<i class="el-icon-my-contraction"></i>
                                </template>
                                <wareTable type="edit" ref="wareTable" ></wareTable>
                            </el-collapse-item>

                        </el-collapse>
                        <div class="btn-index mb15">
                            <el-button type="normal" @click="submit">保存</el-button>
                        </div>
                    </div>
                </div>
            </ies-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            let validator = this.$ies.validator;
            return {
                activeNames: ['1', '2'],
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
            });
        },
        methods: {
            selectOnFocus(e) {
                e.target.blur();
            },
            init() {

            },
            submit() {
                this.$refs.wareBase.$refs.baseForm.validate((valid) => {
                    if(valid){
                        let idList = this.$refs.wareTable.tableConfig.cacheData.map(v=> v.id);
                        if(idList.length == 0){
                            this.$message.warning('请至少添加一个返库设备！');
                            return false;
                        }
                        let params = Object.assign({},this.$refs.wareBase.params,{deviceIdList: idList.join(',')});
                        this.$axios.post('/itsm/device/in/add', params).then((res) => {
                            if (res.status==200){
                                this.$message.success(res.message);
                                this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/spare/warehouseCreate');
                                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/warehouseManagement');
                            } else {
                                this.$message.error(res.message);
                            }
                        });
                    }
                })
            }
        }
    }
</script>