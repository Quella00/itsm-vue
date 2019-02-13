<template>
    <el-collapse value="1" class="mb15">
        <el-collapse-item name="1" class="basic">
            <template slot="title">
                进度状态<i class="el-icon-my-contraction"></i>
            </template>
            <div class="progress-component">
                <div class="fl arrow-left">
                    <i class="el-icon-arrow-left" @click="leftClickFun"></i>
                </div>
                <div class="progress-box">
                    
                    <div v-if='dataArray&&dataArray.length>0' class="progressSteps" :style="{width:167*dataArray.length+'px',transform:'translateX('+index*167+'px)'}">
                        <div class="step-box" v-for="(item,index) in dataArray">
                            <div class="step-content" @click="openComplain(item,index)" :style="{'background-color': item.color,'border': '4px solid '+item.border}">
                                <span class="before-line"></span>
                                <span class="step-title ellipsis">{{item.logTypeDesc||'暂无信息'}}</span>
                                <span class="after-line"></span>
                            </div>
                            <div v-show="showIndex == index" class="complain-box">
                                <el-tooltip effect="dark" :content="item.currentNodeName" placement="bottom-start">
                                    <div class="complain-description ellipsis">
                                        <label>节点：</label> {{item.currentNodeName||'暂无信息'}}
                                    </div>
                                </el-tooltip>
                                <el-tooltip effect="dark" :content="item.content" placement="bottom-start">
                                    <div class="complain-description ellipsis">
                                        <label>意见：</label>{{item.content||'暂无信息'}}
                                    </div>
                                </el-tooltip>
                                <el-button v-if="config&&config.indexOf('complain')!=-1" type="primary" size="normal" @click="complainHandler(item)" class="complain-btn">投诉</el-button>
                            </div>
                            <el-tooltip effect="dark" :content="item.currentUserName" placement="bottom-start">
                                <div class="step-description ellipsis">{{item.currentUserName||'暂无信息'}}</div>
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="item.createTime" placement="bottom-start">
                                <div class="step-description ellipsis">{{item.createTime||'暂无信息'}}</div>
                            </el-tooltip>
                        </div>
                    </div>

                    <div v-else  class="progressSteps" style="width:100%;text-align:center;position: absolute;left: 0px;top: 80px;">
                        <span>暂无数据</span>
                    </div>
                </div>
                <div class="fr arrow-right">
                    <i class="el-icon-arrow-right" @click="rightClickFun"></i>
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    export default {
        props: ['data', 'config'],
        data() {
            return {
                index: 0,
                showIndex: -1,
                colorArray: ['#2ac0f8', '#6088ff', '#9d91f8', '#dc91f8', '#f891c1', '#91a9f8', '#91a9f8', '#ffbf7a'],
                borderArray: ['#d4f2fe', '#dfe7ff', '#ebe9fe', '#f8e9fe', '#fee9f3', '#e9eefe', '#e6f7e5', '#fff2e4'],
                dataArray: []
            }
        },
        mounted() {
            const self = this;
            this.$nextTick(function () {
                self.init();
            })
        },
        methods: {
            init() {
                this.dataArray = this.data;
                for (var i = 0, len = this.data.length; i < len; i++) {
                    var index = i % 8;
                    if (!this.data[i].color) {
                        this.$set(this.dataArray, 'color', '');
                        this.$set(this.dataArray, 'border', '');
                    }
                    this.dataArray[i].color = this.colorArray[index];
                    this.dataArray[i].border = this.borderArray[index];
                }
                setTimeout(function(){
                    $(".progressSteps").css({ transition: '1s' });
                },1000)
            },
            rightClickFun() {
                var boxWidth = $(".progress-box").width(), num = -this.dataArray.length + boxWidth / 167;
                if (boxWidth < 167 * this.dataArray.length && this.index > num) {
                    this.index--;
                }
            },
            leftClickFun() {
                var boxWidth = $(".progress-box").width();
                if (boxWidth < 167 * this.dataArray.length && this.index < 0) {
                    this.index++;
                }
            },
            openComplain(item, index) {
                if (this.showIndex == index) {
                    this.showIndex = -1;
                } else {
                    this.showIndex = index;
                }
            },
            complainHandler(v) {
                this.$emit('complainHandler', 'orderComplain', v);
            }
        },
        watch: {
            'data': {
                handler(v, o) {
                    this.dataArray = v;
                    for (var i = 0, len = v.length; i < len; i++) {
                        var index = i % 8;
                        if (!v[i].color) {
                            this.$set(this.dataArray, 'color', '');
                            this.$set(this.dataArray, 'border', '');
                        }
                        this.dataArray[i].color = this.colorArray[index];
                        this.dataArray[i].border = this.borderArray[index];
                    }
                },
                deep: true
            }
        }
    }

</script>