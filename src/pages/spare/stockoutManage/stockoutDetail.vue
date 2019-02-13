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
                                <stockBase :data="params.basic" type="show" v-if="initFlag"></stockBase>
                            </el-collapse-item>

                            <el-collapse-item name="2">
                                <template slot="title">
                                    出库设备<i class="el-icon-my-contraction"></i>
                                </template>
                                <stockTable :data="params.device" type="show" v-if="initFlag"></stockTable>
                            </el-collapse-item>
                        </el-collapse>
                        <div class="btn-index mb15">
                            <el-button type="normal" @click='close'>关 闭</el-button>
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
                    this.$axios.post('/itsm/device/out/detail', {id:this.$route.query.id}).then((res) => {
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
            close() {
                this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/spare/stockoutDetail');
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/stockoutManagement');
            }
        }
    }
</script>