<template>
	<div class="about-system">
        <div class="main">
            <el-form label-width="150px" :model="ruleForm" ref="ruleForm">
						
				<el-form-item label="当前版本：">
					{{ruleForm.version}}
				</el-form-item>
				
				<el-form-item label="授权模块：">
					<el-checkbox-group v-model="ruleForm.moduleList">
					    <el-checkbox v-for="item in moduleList" :key="item.id" :label="item.name" disabled>{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				
				<el-form-item label="授权账号数量：">
					{{ruleForm.registeredUsers}}个
				</el-form-item>
				
				<el-form-item label="授权信息：">
					{{ruleForm.copyright}}
				</el-form-item>
				
				<el-form-item label="">
					<el-button type="normal" class="regist-again-btn" @click="registAgain">重新注册</el-button>
				</el-form-item>

			</el-form>
			<i class="icon-close" @click="toLogin"></i>
        </div>
		
        <div class="footer">
            技术支持：安徽智恒信科技有限公司
        </div>
	</div>
</template>

<script>

export default {
	data () {
        let validator = this.$ies.validator;
		return {
			moduleList: [
				{ id: '系统管理', name: '系统管理' },
				{ id: '资产管理', name: '资产管理' },
				{ id: '备件管理', name: '备件管理' },
				{ id: '服务等级管理', name: '服务等级管理' },
				{ id: '流程管理', name: '流程管理' },
				{ id: '服务台', name: '服务台' },
				{ id: '工单管理', name: '工单管理' },
				{ id: '知识库', name: '知识库' },
				{ id: '报表统计', name: '报表统计' },
				{ id: '绩效管理', name: '绩效管理' }
				
			],
			ruleForm: {
				version: "", 		    // 版本
				moduleList: [], 		// 授权模块
				registeredUsers: "",	// 授权账号数量
				copyright: ""		    // 授权信息
			},
		};
	},
	mounted() {
        this.$nextTick(() => {
            this.getLicenseInfo();
        })
	},
	methods: {
		// 获取详情
        getLicenseInfo(){
        	this.$axios.post('/licenseApi/license/system/getLicenseInfo').then( (res) => {
				if(res.status == 200 && res.data) {
					this.ruleForm.version = res.data.version;
					this.ruleForm.moduleList = res.data.moduleList;
					this.ruleForm.registeredUsers = res.data.registeredUsers;
					this.ruleForm.copyright = res.data.copyright;
				} else {
					this.$message({ type: 'error', message: res.message});
				}
			});
        },
        // 重新注册
        registAgain(){
        	this.$router.push('/registAgain');
        },
        // 返回登录页
        toLogin(){
        	this.$router.push('/login');
        }
        
	}
}
</script>

<style lang="less">
    .about-system {
        height: 100%; padding-top: 12%; background: url(~@/assets/img/login/login-bg.jpg) no-repeat center center; background-size: cover;
        .main {
            width: 760px;
            height: 450px;
            margin: auto;
            background-color:rgba(0,0,0,0.1);
            border-radius: 5px;
            padding-top: 60px;
            position:relative;
            .icon-close{
            	position:absolute;width:19px;height:19px;background: url(~@/assets/img/login/icon-close.png);top:10px;right:10px;cursor: pointer;
            }
            .el-form-item__label, .el-form-item__content {
            	font-size: 16px;
            	color: #FFFFFF;
            }
            .el-checkbox__label {
            	font-size: 16px;
            	color: #FFFFFF !important;
            	font-weight: 100;
            	min-width:90px;
            }
            .el-checkbox__inner {
            	width: 15px;
            	height: 15px;
            	background-color: transparent !important;
            	border: 1px solid #fff !important;
            }
            .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
            	border-color:#fff;
            }
            .el-checkbox{
            	margin-bottom:10px;
            }
            .el-checkbox:nth-child(4n+1){
            	margin-left:0px !important;
            }
            .regist-again-btn{
            	height:40px;line-height:40px;background-color:#ff9148;border-color:#ff9148;padding:0px 22px;margin-top:15px;font-size:16px;
            }
        }
        .footer {
            position: absolute; bottom: 0; width: 100%; height: 45px; line-height: 45px; color: #ffffff; text-align: center; background-color:rgba(0,0,0,0.4); font-size: 14px;
        }        
    }
</style>