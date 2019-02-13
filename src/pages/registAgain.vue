<template>
	<div class="regist-again">
        <div class="main">
            <div class="title">ITSM授权管理</div>
            <div>
            	<p>申请ITSM License的步骤 :</p>
            	<p>1、下载ITM产品标示数据文件。<a href="javascript:;" @click="downloadFile">点击下载</a></p>
            	<p>2、将ITSM产品标识数据文件发送给本公司为您服务的销售人</p>
            	<p>3、上传导入License文件</p>
            </div>
            <div>
            	<p>
            		<el-upload ref="upload" action="/licenseApi/license/system/importLicenseFile" :on-change="handleChange" :on-success="onSuccess" :on-error="onError" :before-upload="beforeupload" :show-file-list="false" :auto-upload="false" :multiple="false" class="upload-btn">
						<el-button slot="trigger" type="normal" class="choose-file">选取文件</el-button>
					</el-upload>
					<span>{{configUpload.fileName}}</span>
            	</p>
            	<p>
            		<el-button type="normal" class="import-file" @click="submitUpload">导入授权文件</el-button>
            		<el-button type="normal" class="to-prePage" @click="toPrePage">返回上一页</el-button>
            	</p>
            </div>
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
			configUpload:{
				fileName:'',
				loading:'',
			}
		};
	},
	mounted() {
        this.$nextTick(() => {

        })
	},
	methods: {
		// 点击下载
		downloadFile(){
			window.open('/licenseApi/license/system/outputIdentityFile');
		},
		// 手动上传文件
		submitUpload() {
			if(!this.configUpload.fileName) {				
				this.$message.error('请选择上传的文件');
				return;
			}
			this.$refs.upload.submit();
		},
		// 
        onError(res, file, fileList) {
        	this.$message.error(res.message);
        },
        onSuccess(res, file, fileList) {
        	this.$nextTick(() => {
				this.configUpload.loading.close();
			});
        	if(res.status == 200){
        		const self = this;
        		this.importSuccess();
			}else{
				this.$message.error(res.message);
			}
        },
        // 导入成功，请求的接口
		importSuccess() {
			const self = this;
			this.$axios.post('/licenseApi/license/system/importValidaLicence').then( (res) => {
				if(res.status == 200) {
					this.$message.success(res.message);
					setTimeout(function(){
        				self.$router.push('/login');
        			},3000);
				} else {
					this.$message.error(res.message);
				}
			});
		},
		handleChange(file, fileList) {
			this.configUpload.fileName = file.name;
		},
		beforeupload(file) {
			this.configUpload.loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(255, 255, 255, 0.5)'
			});
			return true;
		},
        // 返回登录页
        toLogin(){
        	this.$router.push('/login');
        },
        // 返回上一页
        toPrePage(){
        	this.$router.push('/aboutSystem');
        }
        
	},
	computed:{
    	token() {
//			return this.$store.state.user.info ? this.$store.state.user.info.token : ''
		}
    },
}
</script>

<style lang="less">
    .regist-again {
        height: 100%; padding-top: 12%; background: url(~@/assets/img/login/login-bg.jpg) no-repeat center center; background-size: cover;
        .main {
            width: 760px;
            height: 450px;
            margin: auto;
            background-color:rgba(0,0,0,0.1);
            border-radius: 5px;
            padding-top: 50px;
            padding-left:120px;
            position:relative;
            color:#fff;
            font-size:16px;
            .icon-close{
            	position:absolute;width:19px;height:19px;background: url(~@/assets/img/login/icon-close.png);top:10px;right:10px;cursor: pointer;
            }
            .title{
            	font-weight: bold;margin-bottom:45px;
            }
            p{
            	margin-bottom:25px;
            	a{
            		color:#ffae78;
            	}
            	.upload-btn{
            		display: inline-block;margin-right:20px;
            	}
            	.choose-file{
            		background:transparent;border-color:#ffae78;color:#ffae78;margin-left:25px;padding:0px 17px;font-size: 16px;
            	}
            	.import-file{
            		background:#ff9148;border-color:#ff9148;height:40px;line-height: 40px;font-size: 16px;margin-left:10px;padding:0px 19px;
            	}
            	.to-prePage{
            		background:#48abff;border-color:#48abff;height:40px;line-height: 40px;padding:0px 19px;margin-left:40px;font-size: 16px;
            	}
            }
        }
        .footer {
            position: absolute; bottom: 0; width: 100%; height: 45px; line-height: 45px; color: #ffffff; text-align: center; background-color:rgba(0,0,0,0.4); font-size: 14px;
        }        
    }
</style>