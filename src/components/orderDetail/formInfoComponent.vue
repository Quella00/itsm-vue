<template>
    <div class="fill-form">
        <el-collapse :value="opentTabname">
            <el-collapse-item name="1" class="basic" style="margin-right:0">
                <template slot="title">
                    申请信息<i class="el-icon-my-contraction"></i>
                </template>
                <div class="panel-body main clearfix" style="padding: 20px 0px;">
                    <el-tooltip class="item" effect="dark" :content="applyInfo.applicant||''" placement="bottom">
                        <div class="order-item ellipsis"><label>申请人：</label>{{applyInfo.applicant||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="applyInfo.mobile||''" placement="bottom">
                        <div class="order-item ellipsis"><label>手机：</label>{{applyInfo.mobile||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="applyInfo.email||''" placement="bottom">
                        <div class="order-item ellipsis"><label>邮件：</label>{{applyInfo.email||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="applyInfo.organization||''" placement="bottom">
                        <div class="order-item ellipsis"><label>组织：</label>{{applyInfo.organization||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="applyInfo.area||''" placement="bottom">
                        <div class="order-item ellipsis"><label>区域：</label>{{applyInfo.area||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="applyInfo.contactNumber||''" placement="bottom">
                        <div class="order-item ellipsis"><label>联系电话：</label>{{applyInfo.contactNumber||''}}</div>
                    </el-tooltip>
                </div>
            </el-collapse-item>

            <el-collapse-item name="2" class="basic" style="margin-right:0">
                <template slot="title">
                    资产信息<i class="el-icon-my-contraction"></i>
                </template>
                <div class="panel-body main clearfix" style="position:relative;padding: 20px 130px 20px 0;">
                    <el-tooltip class="item" effect="dark" :content="assetInfo.code||''" placement="bottom">
                        <div class="order-item ellipsis"><label>资产编码：</label>{{assetInfo.code||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.name||''" placement="bottom">
                        <div class="order-item ellipsis"><label>资产名称：</label>{{assetInfo.name||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.regionOfAffiliationName||''" placement="bottom">
                        <div class="order-item ellipsis"><label>所属区域：</label>{{assetInfo.regionOfAffiliationName||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.buildingName||''" placement="bottom">
                        <div class="order-item ellipsis"><label>所属建筑：</label>{{assetInfo.buildingName||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.machineRoomName||''" placement="bottom">
                        <div class="order-item ellipsis"><label>所属机房：</label>{{assetInfo.machineRoomName||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.cabinetName||''" placement="bottom">
                        <div class="order-item ellipsis"><label>所属机柜：</label>{{assetInfo.cabinetName||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.model||''" placement="bottom">
                        <div class="order-item ellipsis"><label>型号：</label>{{assetInfo.model||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.serialNo||''" placement="bottom">
                        <div class="order-item ellipsis"><label>序列号：</label>{{assetInfo.serialNo||''}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="assetInfo.managementIp||''" placement="bottom">
                        <div class="order-item ellipsis"><label>管理IP：</label>{{assetInfo.managementIp||''}}</div>
                    </el-tooltip>
                    <el-button type="primary"  @click="viewAssetHandler" style="position: absolute;top: 38px;right: 5px;">查看资产详情</el-button>
                </div>

            </el-collapse-item>

            <el-collapse-item name="3" class="basic" style="margin-right:0">
                <template slot="title">
                    基本信息<i class="el-icon-my-contraction"></i>
                </template>
                <div class="panel-body main clearfix">
                    <el-form label-width="150px" :model="params"  class="pt30 pb15" ref="basicRuleForm">
                        <el-form-item v-for="(item) in baseInfo" :label="`${item.fieldNameChina}：`" :key="item.fieldNameChina" :class="item | fieldClass">

                            <el-input :disabled="true" v-model="item.fieldValue" v-if="item.fieldType == 3" type="textarea" resize="none" ></el-input>

                            <el-date-picker :disabled="true" v-model="item.fieldValue" v-else-if="item.fieldType == 8" type="datetime" :editable="false"
                                value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>

                            <template v-else-if="item.fieldType == 9">
                                <el-date-picker :disabled="true" v-model="item.fieldValue.split(',')" type="datetimerange" range-separator="至" 
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </template>

                            <el-input :disabled="true" v-model="item.fieldValue" v-else ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-collapse-item>

            <el-collapse-item name="4" class="basic" style="margin-right:0">
                <template slot="title">
                    工单信息<i class="el-icon-my-contraction"></i>
                </template>
                <div class="panel-body main clearfix">
                    <el-form label-width="150px" :model="params" class="pt30 pb15" ref="basicRuleForm">
                        <el-form-item v-for="(item) in orderInfo"  :label="`${item.fieldNameChina}：`" :key="item.fieldNameChina" :class="item | fieldClass">

                            <div @click="addContentHandler(item,$event)" v-if="item.fieldType == 3" style="display: inline-block">
                                <el-input  :disabled="!readonly" :class="'textarea'+item.customFieldId" :value="item.fieldValue | formContent('textarea'+item.customFieldId)"  type="textarea" resize="none" ></el-input>
                            </div>

                            <el-date-picker :disabled="true" v-model="item.fieldValue" v-else-if="item.fieldType == 8" type="datetime" :editable="false"
                                value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>

                            <template v-else-if="item.fieldType == 9">
                                <el-date-picker :disabled="true" v-model="item.fieldValue.split(',')" type="datetimerange" range-separator="至" 
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </template>

                            <el-input :disabled="true" v-model="item.fieldValue" v-else ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-collapse-item>

            <el-collapse-item name="5" class="basic" style="margin-right:0">
                <template slot="title">
                    关联外部用户信息<i class="el-icon-my-contraction"></i>
                </template>
                <div class="panel-body main clearfix">
                    <el-tooltip class="item" effect="dark" :content="externalUsersInfo.name" placement="bottom">
                        <div class="order-item ellipsis"><label class="w120">外部用户姓名：</label>{{externalUsersInfo.name}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="externalUsersInfo.mobile" placement="bottom">
                        <div class="order-item ellipsis"><label>手机：</label>{{externalUsersInfo.mobile}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="externalUsersInfo.email" placement="bottom">
                        <div class="order-item ellipsis"><label>邮件：</label>{{externalUsersInfo.email}}</div>
                    </el-tooltip>
                </div>
            </el-collapse-item>
        </el-collapse>
        <contentAddDialog v-model="contentAddConfig.show" v-if="contentAddConfig.show" :data="contentAddConfig.default" @saveAddContent="saveAddContent" ></contentAddDialog>
    </div>
</template>

<script>
    export default {
        props: ['data','readonly'],
        data() {
            return {
                contentAddConfig:{
                    show:false,
                    default:{

                    }
                },
                opentTabname: ['1', '2', '3', '4', '5'],
                applyInfo: {
                    applicant:"",
                    area:"",
                    contactNumber:"",
                    email:"",
                    mobile:"",
                    organization: "",
                },
                assetInfo: {
                    id: "",
                    buildingName:"",
                    cabinetName:"",
                    code:"",
                    machineRoomName:"",
                    managementIp:"",
                    model:"",
                    name:"",
                    regionOfAffiliationName:"",
                    serialNo:""
                },
                externalUsersInfo: {
                    name:"",
                    mobile:"",
                    email:"",
                },
                baseInfo: [],
                orderInfo: [],
                params:{}
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
            })
        },
        methods: {
            init() {
                if (this.data) {
                    if(this.data.applyInfo){
                        this.applyInfo = this.data.applyInfo;
                    }
                    if(this.data.assetInfo){
                        this.assetInfo = this.data.assetInfo;
                    }
                    if(this.data.externalUsersInfo){
                        this.externalUsersInfo = this.data.externalUsersInfo;
                    }
                    if(this.data.customFieldInfo){
                        this.baseInfo = this.data.customFieldInfo.filter(v => {
                            return v.baseTypeOrWorkOrder==1;
                        })
                        this.orderInfo = this.data.customFieldInfo.filter(v => {
                            return v.baseTypeOrWorkOrder==2;
                        })
                    }
                }
            },
            viewAssetHandler() {
                var query = {
                    'id':this.assetInfo.id,
                    'type':'apply'
                }
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/assetUtilization/viewAsset',JSON.stringify(query));
            },
            addContentHandler(v,e) {
                if(!this.readonly){
                    return false;
                }
                e.target.blur();
                this.contentAddConfig.default = v;
                this.contentAddConfig.show = true;
            },
            saveAddContent() {
                this.$emit('operaHandler');
            } 
        },
        watch:{
            'data':{
                handler(val){
                    this.init();
                },
                deep:true
            },
            
        },
        filters:{
            fieldClass(v) {
	            return {
					'custom-field-class-small': v.fieldType == 1,                // 文本框(小)
					'custom-field-class-big': v.fieldType == 2,                  // 文本框(大)
					'custom-field-class-domain': v.fieldType == 3,               // 文本域
					'custom-field-class-number': v.fieldType == 4,               // 数值框
					'custom-field-class-dropDown-radio': v.fieldType == 5,       // 下拉单选列表
					'custom-field-class-dropDown-checkbox': v.fieldType == 6,    // 下拉复选列表	
					'custom-field-class-tree': v.fieldType == 7,                 // 树形文本框
					'custom-field-class-time': v.fieldType == 8,                 // 单个时间
					'custom-field-class-times': v.fieldType == 9                 // 计划开始结束时间
				}
			},
	        fieldType(v) {
				let rules = [];
				if(v.notNull) {
					switch(v.fieldType){
	                    case 1:// 文本框(小)
							rules.push(
								{ validator: ies.validator.space, options: { max: 11 } },
								{ required: true, message: `请输入${v.fieldNameChina}` }
							);
						break;
	
						case 2: // 文本框(大)
							rules.push(
								{ validator: ies.validator.space, options: { max: 50 } },
								{ required: true, message: `请输入${v.fieldNameChina}` }
							);
						break;
	
						case 3:// 文本域
							rules.push(
								{ validator: ies.validator.space, options: { max: 300 } },
								{ required: true, message: `请输入${v.fieldNameChina}` }
							);
						break;
	
						case 4:// 数值框
							rules.push(
								{ validator: ies.validator.space, options: { max: 11 } },
								{ required: true, message: `请输入${v.fieldNameChina}` }, 
								{ validator: ies.validator.num }
							);
						break;
	
						case 5:// 下拉单选列表
	                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
						break;
	
						case 6:// 下拉复选列表
	                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
						break;
	
						case 7:// 树形文本框
	                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
						break;
	
						case 8:// 单个时间
	                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
						break;
	
						case 9:// 计划开始结束时间
	                        rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
						break;
						//default:
					}	
					return rules;
				}
            },
            formContent(v, e) {
                var arr = v.split('↵')
                var str = arr.join('\n ==================== \n');
                setTimeout(function(){
                    $('.'+e+' textarea').text(str);
                },200)
                return str;
            }
        }
    }

</script>