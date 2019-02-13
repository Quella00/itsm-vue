<template>
	<div class="login-page">
        <div class="main">
            <div class="logo">
                <img src="~@/assets/img/login/login-logo.png">
                <a href="javascript:;" class="system-tip" @click="openPage">关于系统</a>
            </div>

            <div class="content">
                <el-form :inline="true" :model="configForm.ruleForm" :rules="configForm.rules" ref="ruleForm">
                    <el-form-item prop="loginName">
                        <el-input ref="loginName" type="text" v-model="configForm.ruleForm.loginName" placeholder="请输入用户名" auto-complete="off" @blur="blurInputHander('loginName')" @focus="focusInputhander('loginName')" :autofocus="true"></el-input>
                    	<div class="ies-placeholder" v-if="configForm.placeHolder.ie9 && configForm.placeHolder.loginName && configForm.ruleForm.loginName == ''" @click="clickPlaceholder('loginName')">请输入用户名</div>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input ref="password" type="password" v-model="configForm.ruleForm.password" placeholder="请输入密码" auto-complete="off" @blur="blurInputHander('password')" @focus="focusInputhander('password')"></el-input>
                    	<div class="ies-placeholder" v-if="configForm.placeHolder.ie9 && configForm.placeHolder.password && configForm.ruleForm.password == ''" @click="clickPlaceholder('password')">请输入密码</div>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
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
			configForm: {
                ruleForm: {
                    loginName: '',    // 用户名
					password: ''      // 密码
                },
                rules: {    // 数据列表字段的验证规则
                    loginName: [
                        { validator:validator.space, trigger: 'blur' },
                        { required: true, message: '请输入用户名', trigger: 'blur' }
					],
					password: [
                        { validator:validator.space, trigger: 'blur' },
                        { required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				placeHolder: {
					ie9: false,
					loginName: true,
					password: true
				}
			}
		};
	},
	mounted() {
        const self = this;
        


        self.$nextTick(() => {
            document.onkeydown = function (e) {
            	console.log('按钮');
                const ev = document.all ? window.event : e;
                ev.keyCode == 13 && self.login();
            };
            
            
	        var ua = navigator.userAgent.toLowerCase(),ie = ua.match(/msie ([\d.]+)/);
	        if(ie && ie[1]=="9.0"){
	            self.configForm.placeHolder.ie9 = true;
	        }
            
            
        })
	},
	methods: {
        login() {
            const self = this;

            self.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    const key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
                    const password = CryptoJS.AES.encrypt(self.configForm.ruleForm.password, key, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }).toString();

					self.$axios.post('/itsm/system/permission/shiroToLogin/login',{
                        loginName: self.configForm.ruleForm.loginName,
                        password: password
                    }).then((res) => {
                        if(res.status == 200) {
                        	if(res.data){
                        		Object.assign(res.data.user, res.data.userCredentials);
	                            self.$store.commit('changeUser', res.data.user);
	                            sessionStorage.openedPageList = '';
	                            sessionStorage.currentPage = '';
	                            self.$router.push('/');
                        	}else{
                        		self.$message({ message: res.message, type: 'error' });
                        	}
                        }else{
                            const message = self.$message({ message: res.message, type: 'error' });
                            setTimeout(function() {
                                message.close();
                            }, 3000);
                        }
                    });
                }
            });
        },
       	openPage() {
       		this.$router.push('/aboutSystem');
        },
        
        
        clickPlaceholder(v) {
        	//this.configForm.placeHolder[v] = false;
        	this.$refs[v].focus();
        },
        blurInputHander(v) {
        	this.configForm.placeHolder[v] = true;
        },
        focusInputhander(v) {
        	this.configForm.placeHolder[v] = false;
        }
	}
}
</script>

<style lang="less">
    .login-page {
        height: 100%; padding-top: 16%; background: url(~@/assets/img/login/login-bg.jpg) no-repeat center center; background-size: cover;
        // .el-input {
        //     width: 300px;
        // }
        .el-input__inner {
            width: 300px; height: 40px; color: #3f72f2; border-radius: 30px; padding-left: 20px; border: 1px solid #187ed0; box-shadow: 0 1px 1px #187ed0;
        } 
        .main {
            width: 852px; height: 195px; margin: auto;
            .logo {
                margin: auto; text-align: center; position: relative;
            }
            .content {
                width: 100%; height: 86px; margin-top: 55px; border-radius: 6px; background-color:rgba(255,255,255,0.2);
                .el-form-item {
                    margin: 23px 0 0 30px;
                    .el-button {
                        width: 130px; height: 40px; line-height: 10px; border-radius: 30px; border: none; font-size: 18px; color: #ffffff; box-shadow: 0 3px 8px #0078e1; background: url(~@/assets/img/login/login-button.jpg) repeat-x;
                    }
                }
            }
            .system-tip {
            	position: absolute;
            	right: 144px;
            	bottom: 1px;
            	display: inline-block;
            	height: 28px; 
            	line-height: 28px;
            	width: 93px; 
            	font-size: 15px;
            	background-color: rgba(7,63,159,0.25);
            	opacity: 0.85;
            	border-radius: 14px;
            	color: #FFFFFF;
            }
        }
        .footer {
            position: absolute; bottom: 0; width: 100%; height: 45px; line-height: 45px; color: #ffffff; text-align: center; background-color:rgba(0,0,0,0.4); font-size: 14px;
        }
        /* 统一重置全局输入框 placeholder 样式 */
        ::-webkit-input-placeholder { /* WebKit browsers */
            color: #3f72f2; font-size: 16px;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #3f72f2; font-size: 16px;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ but I‘m not sure about working */
            color: #3f72f2; font-size: 16px;
        }
        :-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #3f72f2; font-size: 16px;
        }
    }
    
    
    .ies-placeholder{
    	position:absolute;
    	left:0;
    	top:0;
    	width:100%;
    	height:40px;
    	line-height:40px;
    	font-size:16px;
    	color:#3f72f2;
    	padding-left:20px;
    }
</style>