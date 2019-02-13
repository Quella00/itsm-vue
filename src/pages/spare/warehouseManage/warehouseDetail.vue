<!-- 新增资产 -->
<template>
    <div class="itsm-tabs-main add-edit-spare">
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
                <div class="add-edit-spare-container">
                    <div>
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    基础信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <wareBase :data="params.basic" type="show" v-if="initFlag" ></wareBase>
                            </el-collapse-item>

                            <el-collapse-item name="2">
                                <template slot="title">
                                    入库设备<i class="el-icon-my-contraction"></i>
                                </template>
                                <wareTable :data="params.device" type="show" v-if="initFlag" ></wareTable>
                            </el-collapse-item>

                        </el-collapse>
                        <div class="btn-index mb15">
                            <el-button type="normal" @click="close">关 闭</el-button>
                        </div>
                    </div>
                </div>
            </ies-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'warehouseDetail',
        data() {
            let validator = this.$ies.validator;
            return {
                initFlag: false,
                activeNames: ['1', '2'],
                // 基础信息
                params: {
                    basic:{},
                    device:{}
                },
                
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
                $('.el-date-editor--date .el-input__inner').on('focus', function (e) {
                    e.target.blur();
                });
            });
        },
        activated() {
            this.$nextTick(function () {
                this.init();
                $('.el-date-editor--date .el-input__inner').on('focus', function (e) {
                    e.target.blur();
                });
            });
        },
        deactivated() {
            this.initFlag = false;
        },
        methods: {
            selectOnFocus(e) {
                e.target.blur();
            },
            init() {
                if(this.$route.query.id){
                    this.$axios.post('/itsm/device/in/detail', {id:this.$route.query.id}).then((res) => {
                        if (res.status==200){
                            this.params.basic = res.data.basic;
                            this.params.device = res.data.device;
                            this.initFlag = true;
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }
            },
            /*
            *关闭事件
            **/
            close() {
                this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/spare/warehouseDetail');
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/warehouseManagement');
            }
        }
    }
</script>