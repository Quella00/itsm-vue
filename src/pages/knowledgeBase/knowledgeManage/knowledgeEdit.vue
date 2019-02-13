<!--编辑知识-->
<template>
   <div class="itsm-tabs-main to-knowledge">	
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar">
				<div>
					<div class="tabs-panel-wrap border">
						<div class="panel-header">基本信息</div>
						<div class="panel-body">
							<el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-width="130px" class="top-form">
								<el-form-item label="标题：" prop="title" class="normal">
								    <el-input v-model="basicForm.title"  placeholder="请输入标题"></el-input>
								</el-form-item>
								<el-form-item label="摘要：" prop="remark" class="normal">
								    <el-input v-model="basicForm.remark"  placeholder="请输入摘要"></el-input>
								</el-form-item>
								<el-form-item label="关键字：" prop="keyword" class="normal">
								    <el-input v-model="basicForm.keyword" placeholder="请输入关键字,单个关键字不能超过7位，关键字之间使用英文逗号“，”隔开"></el-input>
								</el-form-item>
								<el-form-item label="作者："  prop="authorName" class="author">
									<el-tooltip  effect="dark" :content="basicForm.authorName" placement="top-start">
										<el-input   v-model="basicForm.authorName" @focus="selectOnFocus" :disabled="true"></el-input>
									</el-tooltip>
								</el-form-item><el-form-item label="关联资产："  prop="assetsName" class="asset">
									<el-tooltip  effect="dark" :content="basicForm.assetsName" placement="top-start">
									<el-input   v-model="basicForm.assetsName" @focus="selectOnFocus" :disabled="true"></el-input>
									</el-tooltip>
								</el-form-item>
								<div style="overflow: hidden;">
									<el-form-item label="知识分类：" prop="classificationName" class="knowledgeClassification">
										<el-input placeholder="请选择知识分类" readonly v-model="basicForm.classificationName" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="selectKnowledgeClassification"></i>
									</el-form-item>	
								</div>
							</el-form>
						</div>
					</div>
					<div class="tabs-panel-wrap border">
						<div class="panel-header">知识详情</div>
						<div class="panel-body">
							<el-form ref="orderForm" :model="orderForm" :rules="orderRules" label-width="130px" class="bottom-form">
								<el-form-item label="详情：" prop="knowledgeDetails">
								   <el-input v-model="orderForm.knowledgeDetails"  type="textarea" resize="none" placeholder="请输入详情"></el-input>
								</el-form-item>
								<el-form-item label="应急方案：" prop="emergencyPlan">
								   <el-input v-model="orderForm.emergencyPlan"  type="textarea" resize="none" placeholder="请输入应急方案"></el-input>
								</el-form-item>
								<el-form-item label="解决方案：" prop="solution">
								    <el-input v-model="orderForm.solution"  type="textarea" resize="none" placeholder="请输入解决方案"></el-input>
								</el-form-item>														
							</el-form>
							<div class="upload-content">
								<el-upload ref="upload" class="upload-demo" action="/uploadApi/itsm/knowledgeBase/fileManager/upload" :limit="3" list-type="picture" :headers="{Token:token}"
	                            :on-change="handleChange" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handlerError"  :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :on-progress="onProgress">
	                                <span> 上传文件：</span><el-input style="width: 200px;" placeholder="最多上传三个附件" v-model="fileName" readonly></el-input> 
	                                <el-button type="normal" slot="trigger" style="height:27px; line-height: 27px; margin-left: 5px;">选择文件(不超过500M)</el-button>
	                            </el-upload>
	                        </div>
						</div>
					</div>
					<div class="button-group">
						<el-button type="normal" @click="saveKnowledge('submit')">提交审核</el-button>
						<el-button type="normal" @click="saveKnowledge('save')">保存</el-button>
					</div>
				</div>
			</ies-scrollbar> 
		</div>
   		<!-- 选择知识分类弹窗 -->
		<ies-knowledgeClassificationDialog v-model="selectKnowledgeClassificationDialog.show" v-if="selectKnowledgeClassificationDialog.show" @knowledgeChooseHandler="knowledgeClassificationChooseHandler" :defaultSelect='selectKnowledgeClassificationDialog.defaultSelectId'></ies-knowledgeClassificationDialog>	 
   </div>
</template>

<script>
    export default {
    	name:'knowledgeEdit',
    	components:{ 

		},        
        props:{
    		
    	},
    	data() {
    		// 验证关键字
			var checkKeyword = (rule, value, callback) => {
				const vArray = value.split(',');
				if(!/^[\u4e00-\u9fa50-9A-Za-z\,]+$/.test(value)) {
                    callback('字段之间使用英文逗号“，”隔开');
                    return;
                }
                if(this.arrRepeat(vArray)) {
                    callback('字段内容不能重复');
                    return;
                }
                if(vArray.some(item => item.length > 7)) {
                    callback('单个字段不能超过7位');
                    return;
                }
                if(vArray.some(item => !item)) {
                    callback('字段内容不能为空');
                    return;
                }
                if(vArray.length > 50) {
                    callback('关键字数量不能超过50个');
                    return;
                }
                callback();
			};   
            return {
            	knowledgeId:'',           // 知识id
            	basicForm:{
            		title:'',
            		remark:'',
            		keyword:'',
            		authorName:'',
            		authorId:'',
            		classificationName:'',// 知识分类名称
            		classificationId:'',  // 知识分类id
            		assetsName:'',        // 资产名称
            		assetCode:'',         // 资产编码
            	},
            	basicRules:{
            		title:[{required: true,message: '请输入标题',trigger: 'blur'},{validator:ies.validator.space,trigger: 'blur',options:{max:50}}],
            		remark: [{required: true,message: '请输入摘要',trigger: 'blur'},{validator:ies.validator.space,trigger: 'blur',options:{max:50}}],
            		keyword: [{required: true,message: '请输入关键字,单个关键字不能超过7位，关键字之间使用英文逗号“,”隔开',trigger: 'blur'},{validator:checkKeyword,trigger: 'blur'}],
            		classificationName: [{required: true,message: '请选择知识分类',trigger: 'change'}]            		
            	},
            	orderForm:{
            		knowledgeDetails:'',
            		emergencyPlan:'',
            		solution:''
            	},
            	orderRules:{
            		knowledgeDetails:[{required: true,message: '请输入详情',trigger: 'blur'},{validator:ies.validator.space,trigger: 'blur',options:{max:500}}],
            		emergencyPlan:[{required: true,message: '请输入应急方案',trigger: 'blur'},{validator:ies.validator.space,trigger: 'blur',options:{max:500}}],
            		solution:[{required: true,message: '请输入解决方案',trigger: 'blur'},{validator:ies.validator.space,trigger: 'blur',options:{max:500}}],
            	},
            	fileName: '',
	            fileList: [],
	            // 选择作者（多选）
				selectPersonCheckboxDialog:{
					show:false,
					data:{
						type:'rolePerson', // 选择作者人数没限制
						selected:[]
					}
				},
				// 选择知识分类弹窗
				selectKnowledgeClassificationDialog:{
					show:false,
					data:{}
				},
				// 关联资产弹窗
            	relationAssetDialog:{
            		show:false,
            		defaultSelectId:''
            	},
            	percent:100, // 上传进度
            }
       },
		mounted() {
        	this.$nextTick(function () {
				this.init();
        	});
    	},
        methods: {
        	// 初始化
        	init(){
        		this.knowledgeId = this.$route.query.id;
        		this.getDetail();
        	},
        	// 判断数组中有无重复项
        	arrRepeat(arr) {
		        　　	var hash = {}; 
				for(var i in arr) { 
					if(hash[arr[i]]) 
					return true; 
					hash[arr[i]] = true; 
				} 
				return false; 
		    },
        	// 获取知识详情
        	getDetail(){
        		this.$axios.post('/itsm/knowledgeBase/knowledgeManager/queryById',{id:this.knowledgeId}).then((res) => {
                    if(res.status == 200){
						for(var i in this.basicForm) {
							if(res.data[i]) {
								this.basicForm[i] = res.data[i];
							} else {
								this.basicForm[i] = '';
							}
						}
						for(var i in this.orderForm) {
							if(res.data[i]) {
								this.orderForm[i] = res.data[i];
							} else {
								this.orderForm[i] = '';
							}
						}
						this.selectKnowledgeClassificationDialog.defaultSelectId = this.basicForm.classificationId;
						this.fileList =  res.data.fileList ? res.data.fileList.map(v=>{
	                        var index = v.fileName.lastIndexOf('.');
	                        let format = v.fileName.substring(index+1);
	                        if(['png','gif','jpg'].indexOf(format)!=-1){//图片
	                            var url = 'jpg';
	                        } else if (['doc','docx'].indexOf(format)!=-1) {//word
	                            var url = 'word';
	                        } else if (['rar','zip','pdf'].indexOf(format)!=-1) {//压缩包
	                            var url = 'zip';
	                        } else if (['ppt','pptx'].indexOf(format)!=-1) {//ppt
	                            var url = 'ppt';
	                        } else if (['xlsx','xls'].indexOf(format)!=-1) {//excel
	                            var url = 'excel';
	                        } else if (format == 'txt'){//txt
	                            var url = 'txt';
	                        } else if (format == 'pdf'){//pdf
	                            var url = 'pdf';
	                        }
	                        return {
	                            id:v.id,
	                            name:v.fileName,
	                            url:'/static/img/upload/'+url+'.png'
	                        }
                    	}) : [];
                    }else{
                        this.$message.error(res.message);
                    }
                });
        	},
        	// 选择知识分类
        	selectKnowledgeClassification(){
        		this.selectKnowledgeClassificationDialog.show = true;
        	},
        	// 知识分类弹窗关闭回调
        	knowledgeClassificationChooseHandler(data){
        		this.basicForm.classificationName = data.classificationName;
        		this.selectKnowledgeClassificationDialog.defaultSelectId = data.id;
        		this.basicForm.classificationId = data.id;
        	},
        	// 保存或提交知识
            saveKnowledge(type){
            	console.log(this.percent);
				var flag = true;
				this.$refs['basicForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				this.$refs['orderForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				if(this.percent < 100){
            		this.$message.warning("文件上传中，请稍后");
            		flag = false;
            	}
				if(flag) {
					var params = $.extend({},this.basicForm,this.orderForm);
					params.fileId = this.fileList.map( v => v.id).toString();
					params.fileName = this.fileList.map( v => v.name).toString();
					delete params.classificationName;
					delete params.assetsName;
					params.id = this.knowledgeId;
					for(var i in params){
						if(params[i] == ''){
							delete params[i]
						}
					}
					type == 'submit' ? this.submit(params) : this.save(params);
				}
            },
            // 保存
            save(params){
            	this.$axios.post('/itsm/knowledgeBase/knowledgeManager/update',params).then((res) => {
                    if(res.status==200){
						this.$message.success(res.message);
						this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
						this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/knowledgeManage`);
                    }else{
                        this.$message.error(res.message);
                    }
                });	
            },
            // 提交审核
            submit(params){
            	this.$axios.post('/itsm/knowledgeBase/knowledgeManager/updateAudit',params).then((res) => {
                    if(res.status==200){
						this.$message.success(res.message);
						this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
						this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/knowledgeManage`);
                    }else{
                        this.$message.error(res.message);
                    }
                });	
            },
             /**************上传附件****************/
	        beforeUpload(file){
	        	//console.log( file );
	            var flag = true;
	             if(file.size >524288000){
	                 this.$message.error('附件超过500M无法上传');
	                 flag = false;
	             }
	             return flag;
	        },
	        handleRemove(file, fileList) {
	        	if(file.name == this.fileName){
					this.fileName = "";
				}
	            this.fileList = fileList.map(v=>{
	                return {
	                    id:v.response?v.response.data:v.id,
	                    name:v.name,
	                    url:v.url
	                }
	            });
	        },
	        downLoadFile (options) {
	            var config = $.extend(true, { method: 'post' }, options);
	            var $iframe = $('<iframe id="down-file-iframe" />');
	            var $form = $('<form targrt="down-file-iframe" action="/api/itsm/knowledgeBase/fileManager/download"  method="' + config.method + '" />');
	            for (var key in config.data) {
	                $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
	            }
	            $iframe.append($form);
	            $(document.body).append($iframe);
	            $form[0].submit();
	            $iframe.remove();
	        },
	        handlePreview(file) {
	            if(file.id){
	                this.downLoadFile({
	                    data:{
	                        id:file.id,
	                        Token: this.token
	                    }
	                });
	            }
	        },
	        handleSuccess(response, file, fileList){
	            $(".el-upload-list__item .el-icon-close-tip").remove();
	            this.fileList = fileList.map(v=>{
	                return {
	                    //id:v.response?v.response.data.id:v.id,
	                    id: v.response?v.response.data.data.id:v.id,
	                    name:v.name,
	                    url:v.url
	                }
	            });
	            this.$message.success(response.message);
	        },
	        handlerError() {
	            this.$message.error('上传失败');
	        },
	        handleChange(file, fileList){
	        	
	        	//console.log(file);
	        	//console.log(fileList);
	        	
	            var index = file.name.lastIndexOf('.');
	            var fileFormat = ['txt','doc','docx','xlsx','xls','ppt','pptx','png','gif','jpg','rar','zip','pdf'],format = file.name.substring(index+1);
	            if(fileFormat.indexOf(format)!=-1){
	                this.fileName = file.status == 'fail'?"":file.name;
	                if(['png','gif','jpg'].indexOf(format)!=-1){//图片
	                    // var url = 'jpg';
	                } else if (['doc','docx'].indexOf(format)!=-1) {//word
	                    file.url = '/static/img/upload/word.png';
	                } else if (['rar','zip','pdf'].indexOf(format)!=-1) {//压缩包
	                    file.url = '/static/img/upload/zip.png';
	                } else if (['ppt','pptx'].indexOf(format)!=-1) {//ppt
	                    file.url = '/static/img/upload/ppt.png';
	                } else if (['xlsx','xls'].indexOf(format)!=-1) {//excel
	                    file.url = '/static/img/upload/excel.png';
	                } else if (format == 'txt'){//txt
	                    file.url = '/static/img/upload/txt.png';
	                } else if (format == 'pdf'){//pdf
	                    file.url = '/static/img/upload/pdf.png';
	                }
	            }else{
	                fileList.pop()
	                this.$message.error('文件格式错误');
	            }
	        },
	        onProgress(event, file, fileList){
		    	this.percent = event.percent;
		    },
            // 解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
        },
        filters:{
        	
        },
        computed:{
        	token() {
				return this.$store.state.user.info ? this.$store.state.user.info.token : ''
			}
        },
        watch:{
        	$route(){
				if(this.$route.path == '/knowledgeManage/knowledgeEdit'){
					if(this.$route.query.id !== this.knowledgeId) {
//						Object.assign(this.$data, this.$options.data());
						this.fileName = "";
						this.init();
					}
				}
		    }
        }
    }

</script>

<style lang="less">
	
</style>