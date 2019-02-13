<!--知识审核详情 -->
<template>
	<div class="itsm-tabs-main knowledge-detail">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div class="knowledge-detail-container">
					<div>
						<el-collapse v-model="activeNames">
							<el-collapse-item name="1">
								<template slot="title">
									基本信息<i class="el-icon-my-contraction"></i>
								</template>
								<div class="collapse-content basic-info">	
									<el-tooltip  effect="dark" :content="knowledgeInfo.title" placement="top-start">
	                                	<div class="item"><label>标题：</label>{{knowledgeInfo.title}}</div>	  
	                                </el-tooltip>
	                                <el-tooltip  effect="dark" :content="knowledgeInfo.remark" placement="top-start">
	                                	<div class="item"><label>摘要：</label>{{knowledgeInfo.remark}}</div>	
	                                </el-tooltip>
	                                <el-tooltip  effect="dark" :content="knowledgeInfo.keyword" placement="top-start">
	                               		 <div class="item"><label>关键字：</label>{{knowledgeInfo.keyword}}</div>
	                               	</el-tooltip>
	                                <div class="item">
		                                <el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-width="130px" class="top-form" style="display: inline-block;">
		                                	<el-form-item label="作者："  prop="authorName" class="author" style="display: inline-block;">
												<el-tooltip  effect="dark" :content="basicForm.authorName" placement="top-start">
													<el-input placeholder="请选择作者" readonly v-model="basicForm.authorName" @focus="selectOnFocus"></el-input>
												</el-tooltip>
												<i class="el-icon-my-more" @click="chooseAuthor"></i>
											</el-form-item>
		                                </el-form>
	                                	<el-tooltip  effect="dark" :content="knowledgeInfo.classificationName" placement="top-start">
	                                		 <div class="ellipsis" style="margin-top:0px;display: inline-block;max-width:550px;line-height: 1;">
	                                		 	<label>知识分类：</label>{{knowledgeInfo.classificationName}} 
	                                		 </div>	
	                                	</el-tooltip>
									</div>
                                </div>
							</el-collapse-item>
							<el-collapse-item name="2">
								<template slot="title">
									关联资产<i class="el-icon-my-contraction"></i>
								</template>
								<div class="collapse-content relation-asset clearfix">
									<el-tooltip  effect="dark" :content="knowledgeInfo.assetsName" placement="top-start">
                                		 <div class="item ellipsis">
                                		 	<label>资产名称：</label>{{knowledgeInfo.assetsName}}
                                		 </div>	
                                	</el-tooltip>
                                	<el-tooltip  effect="dark" :content="knowledgeInfo.categoryName" placement="top-start">
                                		 <div class="item ellipsis">
                                		 	<label>资产分类：</label>{{knowledgeInfo.categoryName}} 
                                		 </div>	
                                	</el-tooltip>
                                	<el-tooltip  effect="dark" :content="knowledgeInfo.manufacturer" placement="top-start">
                                		 <div class="item ellipsis">
                                		 	<label>厂商：</label>{{knowledgeInfo.manufacturer}} 
                                		 </div>	
                                	</el-tooltip>
                                	<el-tooltip  effect="dark" :content="knowledgeInfo.model" placement="top-start">
                                		 <div class="item ellipsis">
                                		 	<label>型号：</label>{{knowledgeInfo.model}} 
                                		 </div>	
                                	</el-tooltip>
								</div>	
							</el-collapse-item>
							<el-collapse-item name="3">
								<template slot="title">
									正文<i class="el-icon-my-contraction"></i>
								</template>	
								<div class="collapse-content main">
                            		 <div class="item clearfix">
                            		 	<label>详情：</label>
                            		 	<div class="main-detail">
                            		 		{{knowledgeInfo.knowledgeDetails}}
                            		 	</div>
                            		 </div>	
                            		 <div class="item clearfix">
                            		 	<label>应急方案：</label>
                            		 	<div class="main-detail">
                            		 		{{knowledgeInfo.emergencyPlan}} 
                            		 	</div>
                            		 </div>	
                            		 <div class="item clearfix">
                            		 	<label>解决方案：</label>
                            		 	<div class="main-detail">
                            		 		{{knowledgeInfo.solution}}
                            		 	</div>
                            		 </div>	
								</div>
							</el-collapse-item>
							<el-collapse-item name="3">
								<template slot="title">
									其他信息<i class="el-icon-my-contraction"></i>
								</template>	
								<div class="collapse-content main other-information">
									<div v-for="(item,index) in attachmentList" :key="index" class="item">
										<img :src="item.url" :title="item.name" />
										<br />
										<span class="ellipsis" :title="item.name" @click="downLoadFile(item.id)">{{item.name}}</span>
									</div>
								</div>
							</el-collapse-item>
						</el-collapse>
						<div class="tabs-panel-wrap border" style="margin-top: 10px;">
							<div class="panel-header">
								审核备注
							</div>
							<div class="panel-body audit-container">
								<el-form label-width="130px" :model="remarkForm" :rules="remarkRules" ref="remarkForm" style="margin-top: 20px;">
									<el-form-item label="审核：" prop="status">
										<el-select v-model="remarkForm.status" @focus="selectOnFocus">
											<el-option label="审核通过" value="2"></el-option>
											<el-option label="审核不通过" value="3"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="备注：" prop="auditOpinion">
										<el-input type="textarea" v-model="remarkForm.auditOpinion" placeholder="请输入备注" resize="none"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button type="normal" @click="audit">保存</el-button>
									</el-form-item>
								</el-form>
							</div>
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		<!--选择作者弹窗-->
		<ies-personCheckDialog v-model="selectPersonCheckboxDialog.show"  v-if="selectPersonCheckboxDialog.show" @selectPersonCheckboxHandler="selectPersonCheckboxHandler" :defaultSelect='selectPersonCheckboxDialog.data'></ies-personCheckDialog>	
	</div>
</template>

<script>	
	export default {
		name: 'knowledgeAuditDetail',
		components: {
			
		},
		data() {
			return {
				knowledgeId:'',// 当前知识id
				activeNames: ['1','2','3'],
				changeScrollbarH: 1,
				basicForm:{
					authorName:'',
					authorId:'',
				},
				basicRules:{
					authorName: [{required: true,message: '请选择作者',trigger: 'change'}],
				},
				remarkForm: {
					status: "2", 	// 审核
					auditOpinion: "" // 备注
				},
				remarkRules: {
					auditOpinion: [
						{ validator: ies.validator.space, trigger: 'blur', options: {max:200} },
					]
				},
				knowledgeInfo:{
					title:'', // 标题
					remark:'', // 摘要
					keyword:'', // 关键字
					classificationName:'',// 知识分类名称
					assetsName:'', // 资产名称
					categoryName:'', // 资产分类名称
					manufacturer:'', // 厂商
					model:'', // 型号					
					knowledgeDetails:'',// 详情
					emergencyPlan:'', // 应急方案
					solution:'', // 解决方案
				},
				// 选择作者（多选）
				selectPersonCheckboxDialog:{
					show:false,
					data:{
						type:'knowledgeAudit',
						selected:''
					}
				},
				// 附件列表
				attachmentList: []
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.init();
			});
		},
		methods: {
			init(){
				this.knowledgeId = this.$route.query.id;
        		this.getDetail();
			},
			// 选择作者
        	chooseAuthor(){
        		this.selectPersonCheckboxDialog.show = true;				
        	},
        	// 选择作者弹窗回调
        	selectPersonCheckboxHandler(data){
        		this.basicForm.authorName = data.map(v => v.userName).toString();
        		this.basicForm.authorId = data.map(v => v.id).toString()
        		this.selectPersonCheckboxDialog.data.selected = data;
        	},
        	// 解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
				e.target.blur();
			},
			// 获取知识审核详情
			getDetail(){
				this.$axios.post('/itsm/knowledgeBase/audit/queryById',{id:this.knowledgeId}).then( (res) => {
					if(res.status == 200) {
						for(var i in this.knowledgeInfo){
							if(res.data[i]){
								this.knowledgeInfo[i] = res.data[i];
							}
						}
//						this.knowledgeInfo.solution = res.data.solution;
						this.basicForm.authorName = res.data.authorName;
						this.selectPersonCheckboxDialog.data.selected = this.toObjectArray(res.data.authorId,res.data.authorName);
						this.basicForm.authorId = res.data.authorId;
						this.attachmentList =  res.data.fileList ? res.data.fileList.map(v=>{
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
					} else {
						this.$message({ type: 'error', message: res.message });
					}
				});
			},
			// 知识审核
			audit() {
				var flag = true;
				this.$refs['basicForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				})
				this.$refs['remarkForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				})
				if(flag) {
					var param = {
						id: this.$route.query.id,
						authorId:this.basicForm.authorId.toString(),
						authorName:this.basicForm.authorName,
						status: this.remarkForm.status,
						auditOpinion: this.remarkForm.auditOpinion
					}
					this.$axios.post('/itsm/knowledgeBase/audit/auditById',param).then( (res) => {
						if(res.status == 200) {
							this.$message({ type: 'success', message: '审核成功!' });
							this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/knowledgeAudit/knowledgeAuditDetail?id='+this.$route.query.id);
							this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/knowledgeAudit' );
						} else {
							this.$message({ type: 'error', message: '审核失败' });
						}
					});
				}
			},	
			toObjectArray(id,name) {
	      		if(name.indexOf(',') >= 0) {
	      			var idArr = id.split(',');
		      		var nameArr = name.split(',');
		      		var arr = [];
		      		for(var i = 0; i < idArr.length; i++) {
		      			var obj = { id : idArr[i] , userName : "" }
		      			arr.push(obj);
		      		}
		      		for(var i = 0; i < nameArr.length; i++) {
		      			arr[i].userName = nameArr[i];
		      		}
	      			return arr;
	      		} else {
	      			if(id.indexOf(',') >= 0) {
	      				return [{id: id.split(',')[0],userName: name}];
	      			} else {
	      				return [{id: id,userName: name}];
	      			}
	      		}
	      	},
	      	downLoadFile (id) {
	      		window.open("/api//itsm/knowledgeBase/fileManager/download?id="+id);
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
				if(this.$route.path == '/knowledgeAudit/knowledgeAuditDetail'){
					if(this.$route.query.id !== this.knowledgeId) {
//						Object.assign(this.$data, this.$options.data());
						this.init();
					}
				}
		    }
        }
	}
</script>
<style lang="less">
	.audit-container{
		.el-textarea{
			textarea{
				width:510px;height:68px;
			}
		}
	}
	.other-information {
		.item {
			display: inline-block; margin-left: 40px;
			span {
				display: inline-block; width: 70px; cursor: pointer;
			}
		}
	}
</style>
