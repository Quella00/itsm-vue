<!--公告编辑-->
<template>
	<div class="itsm-tabs-main notice-save-page">
        <div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div class="tabs-panel-wrap border">
					<el-form :inline="true" :model="configForm.ruleForm" :rules="configForm.rules" ref="ruleForm" class="reset-form">
						<el-form-item label="公告标题：" prop="title">
							<el-input type="text" v-model="configForm.ruleForm.title" placeholder="请输入公告标题" class="reset-width"></el-input>
						</el-form-item>

						<el-form-item label="优先级别：" prop="priorityLevel" class="resetItem-style">
							<el-select v-model="configForm.ruleForm.priorityLevel" placeholder="请选择优先级别" class="reset-width" @focus="selectOnFocus">
								<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configLevel.data"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="有效时间：" prop="dateTime">
							<el-date-picker v-model="configForm.ruleForm.dateTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH" :editable="false"></el-date-picker>
						</el-form-item>

						<el-form-item label="发布范围：" prop="organizationName" class="range">
							<el-input placeholder="请选择发布范围" v-model="configForm.ruleForm.organizationName" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="configRangeDialog.show = true"></i>
						</el-form-item>

						<el-form-item label="公告内容：" prop="content" style="margin-right: 0;">
							<iframe name="ueditor" id="ueditor" src="/static/lib/utf8-jsp/index.html" width="770" height="530" frameborder="0" framespacing="0"></iframe>
						</el-form-item>

						<el-form-item>
							<span slot="label">&nbsp;&nbsp;公告附件：</span>
							<el-upload :action="upload.importUrl" multiple :data="{'createUserId':userId}" :file-list="upload.fileList" :limit="5" :on-change="handleChange" :on-exceed="handleExceed"
								:on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload" :on-remove="handleRemove" :on-preview="handlePreview" :headers="{Token:token}">
								<el-input type="text" v-model="upload.fileName" placeholder="请选择要导入的文件" class="reset-width"></el-input>&nbsp;&nbsp;&nbsp;
								<el-button type="normal" icon="el-icon-my-upload" style="width: 100px;">上传附件</el-button>
							</el-upload>
						</el-form-item>
					</el-form>

					<div style="margin: 30px 0 50px 120px;">
						<el-button @click="submitForm" type="primary" size="medium">&nbsp;提&nbsp;交&nbsp;</el-button>
						<el-button @click="cancel" type="info" size="medium">&nbsp;取&nbsp;消&nbsp;</el-button>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		<ies-organizationCheckDialog v-model="configRangeDialog.show" v-if="configRangeDialog.show" @groupChooseHandler="organizationChooseHandler" :defaultSelect='configRangeDialog.selected'></ies-organizationCheckDialog>
	</div>
</template>

<script>
export default {
	name: 'noticeEdit',
	data() {
		let validator = this.$ies.validator;
		// 验证公告内容
		var checkContent = (rule, value, callback) => {
			if( window.ueditor.getContent() ) {
				if(window.ueditor.getContent().length > 10000) {
					return callback(new Error('字数超出最大允许值'));
				} else {
					this.configForm.ruleForm.content = window.ueditor.getContent();
					return callback();
				}
			} else {
				return callback(new Error('请输入公告内容'));
			}
		};
		return {
			token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
			userId: "",
			id: '',
			// 优先级别下拉配置
            configLevel: {
                data: [
                    { value: '一级（最高）', label: '一级（最高）' },
                    { value: '二级（高）', label: '二级（高）' },
                    { value: '三级（中）', label: '三级（中）' },
                    { value: '四级（低）', label: '四级（低）' },
                    { value: '五级（最低）', label: '五级（最低）' }
                ]
            },
            // 公告
            configForm: {
                ruleForm: {     // 数据列表字段
                    title: '',
					priorityLevel: '',
					dateTime: [],
					organizationName: '',
					selectIds: [],
					content: ''
                },
                rules: {		// 数据列表字段的验证规则
                    title: [
                    	{ validator: validator.space, trigger: 'blur', options: {max:50} },
                        { required: true, message: '请输入公告标题', trigger: 'blur' }
					],
					priorityLevel: [
                        { required: true, message: '请选择优先级别', trigger: 'change' }
					],
					dateTime: [
                        { required: true, message: '请选择有效时间', trigger: 'change' },
					],
					organizationName: [
                        { required: true, message: '请选择发布范围', trigger: 'change' }
					],
					content: [
						{ required: true, validator: checkContent, trigger: 'change' }
					]
				}
			},
			// 发布范围弹窗
            configRangeDialog: {
                show: false,
                selected: []
            },
            // 上传
            upload: {
            	importUrl: `api/zuul/files/uploadFileReturnIdAndNameAndPath`,
            	fileList: [],
            	fileName: '',
            	files: [],
            }
		};
	},
	mounted() {
		this.$nextTick(function() {
            this.init();
            $('.el-range-input').on('focus',function(e){
				e.target.blur();
			});
		});
	},
	activated() {
		this.$nextTick(this.init);
	},
	methods: {
		selectOnFocus(e) {
			e.target.blur();
		},
		// 初始化
		init() {
			const self = this;
            window['validateContent'] = function() {
				self.$refs['ruleForm'].validateField('content',(valid) => {
					if(valid) {
//						console.log("验证不通过");
					} else {
//						console.log("验证通过");
					}
				});
			};
            window['noticeDetail'] = function() {
				self.detail();
			};
			this.userId = this.$store.state.user.info.id;
			this.id = this.$route.query.id;
		},
		// 公告详情
		detail() {
			this.$axios.post('/itsm/system/dailymanagement/announcement/queryAnnouncementDetail',{announcementId:this.id}).then( (res) => {
				if(res.status == 200) {
					// 标题
					this.configForm.ruleForm.title = res.data.title;
					// 优先级
					this.configForm.ruleForm.priorityLevel = res.data.priorityLevel;
					// 有效时间
					this.configForm.ruleForm.dateTime = [];
					this.configForm.ruleForm.dateTime.push(res.data.effectiveTime);
					this.configForm.ruleForm.dateTime.push(res.data.failureTime);
					// 发布范围
					this.configForm.ruleForm.organizationName = res.data.organizationName.toString();
					this.configForm.ruleForm.selectIds = res.data.selectIds;
					this.configRangeDialog.selected = [];
					if(res.data.selectIds.indexOf(',')>-1) {
						this.configRangeDialog.selected = res.data.selectIds.split(',');
					} else {
						this.configRangeDialog.selected.push(res.data.selectIds);
					}
					// 上传文件
					this.getFile(res.data.announcementFileBeanList);
					// 公告内容
					this.configForm.ruleForm.content = res.data.content;
			        window.ueditor.setContent(res.data.content);
			        window.validateContent();
				}
			});
		},
		getFile(list) {
			const self = this;
			this.upload.fileList = [];
			this.upload.files = [];
			this.upload.fileName = "";
			if(list && list.length) {
				this.upload.files = list;
				list.forEach(function(item,index) {
					var obj = {
						name: item.fileName,
						response: {
							data: {
								fileId: item.fileId,
								fileName: item.fileName,
								name: item.fileName,
								filePath: item.filePath,
								path: item.filePath
							}
						}
					}
					self.upload.fileList.push(obj);
				});
			}
		},
		// 发布范围弹窗回调
		organizationChooseHandler(v,names) {
			this.configForm.ruleForm.organizationName = names == null ? '' : names.toString();
			this.configForm.ruleForm.selectIds = v;
			this.configRangeDialog.selected = v;
    	},
		// 提交
        submitForm() {
			this.$refs['ruleForm'].validate(valid => {
                if(valid) {
                	var param = this.$ies.deepCopy(this.configForm.ruleForm);
            		param['id'] = this.id;
                	delete param['organizationName'];
                	param['effectiveTime'] = this.configForm.ruleForm.dateTime[0];
                	param['failureTime'] = this.configForm.ruleForm.dateTime[1];
                	delete param['dateTime'];
                	param['selectIds'] = this.configForm.ruleForm.selectIds.toString();
                	if(this.upload.files && this.upload.files.length) {
                		param['announcementFile'] = JSON.stringify(this.upload.files);
                	}

                   	this.$axios.post("/itsm/system/dailymanagement/announcement/updateAnnouncement",param).then( (res) => {
						if(res.status == 200) {
							this.$message({ type: 'success', message: res.message });
							this.$store.state.asset.noticePageFlag = !this.$store.state.asset.noticePageFlag;
							this.cancel();
						} else {
							this.$message({ type: 'error', message: res.message });
						}
					});
                }
            });
		},
		// 取消
		cancel() {
			this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/system/notice' );
		},
		// 上传
		isFile(name) {
        	var suffixArr = ".txt,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.png,.gif,.jpg,.rar,.zip.pdf";
        	return suffixArr.indexOf(name.substring(name.lastIndexOf('.')));
		},
		handleSuccess(response, file, fileList) {
			this.upload.files.push({
				announcementId: this.id,
				fileId: response.data.id,
				fileName: response.data.name,
				filePath: response.data.path
			});
        	this.$message({ type: 'success', message: '上传成功!' });
        },
        handleError() {
        	this.$message({ type: 'error', message: '上传失败!' });
        },
        beforeUpload(file) {
        	if(file.size > 52428800) {
        		this.$message({ type: 'warning', message: '文件大小不能超过50M!' });
        		return false;
        	} else {
	        	if(this.isFile(file.name) < 0) {
	        		this.$message({ type: 'warning', message: '文件类型不正确,只能是以.txt,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.png,.gif,.jpg,.rar,.zip.pdf结尾' });
	        		return false;
	        	} else {
	        		return true;
	        	}
        	}
        },
        handleChange(file,fileList) {
        	if(this.isFile(file.name) >= 0) {
        		this.upload.fileName = file.name;
        	} else {
        		this.upload.fileName = "";
        	}
	    },
	    // 移除文件
	    handleRemove(file,fileList) {
	    	if(this.isFile(file.name) >= 0) {
	    		if(this.upload.fileName == file.name) {
		    		if(fileList.length <= 0) {
		    			this.upload.fileName = "";
		    		} else {
		    			this.upload.fileName = fileList[fileList.length - 1].name;
		    		}
		    	}
	    		for(var i = 0; i < this.upload.files.length; i++) {
	    			if(this.upload.files[i].fileId == file.response.data.fileId) {
	    				this.upload.files.splice(i,1);
	    				break;
	    			}
	    		}
	    	}
	    },
	    handleExceed(files, fileList) {
        	this.$message.warning(`当前限制选择 5个文件`);
      	},
      	// 点击文件下载
      	handlePreview(file) {
      		window.open(file.response.data.path);
      	}
	}
}
</script>
