<!--知识检索--知识详情 -->
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
	                               		 <div class="item">
	                               		 	<label>关键字：</label>{{knowledgeInfo.keyword}}
	                               		 </div>
	                               	</el-tooltip>
	                                <div class="item clearfix">
		                                <el-tooltip  effect="dark" :content="knowledgeInfo.authorName" placement="top-start">
	                                		 <div class="ellipsis" style="margin-top:0px;float:left;width:50%;">
	                                		 	<label>作者：</label>{{knowledgeInfo.authorName}} 
	                                		 </div>	
	                                	</el-tooltip>
	                                	<el-tooltip  effect="dark" :content="knowledgeInfo.classificationName" placement="top-start">
	                                		 <div class="ellipsis" style="margin-top:0px;float:left;width:50%;">
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
									<!--<el-tooltip  effect="dark" :content="basicInfo.title" placement="top-start">-->
                                		 <div class="item clearfix">
                                		 	<label>详情：</label>
                                		 	<div class="main-detail">{{knowledgeInfo.knowledgeDetails}}</div>
                                		 </div>	
                                	<!--</el-tooltip>
                                	<el-tooltip  effect="dark" :content="basicInfo.title" placement="top-start">-->
                                		 <div class="item clearfix">
                                		 	<label>应急方案：</label>
                                		 	<div class="main-detail">{{knowledgeInfo.emergencyPlan}}</div>
                                		 </div>	
                                	<!--</el-tooltip>
                                	<el-tooltip  effect="dark" :content="basicInfo.title" placement="top-start">-->
                                		 <div class="item clearfix">
                                		 	<label>解决方案：</label>
                                		 	<div class="main-detail">{{knowledgeInfo.solution}}</div>
                                		 </div>	
                                	<!--</el-tooltip>-->
								</div>
							</el-collapse-item>
						</el-collapse>
						<div class="tabs-panel-wrap border" style="margin-top: 10px;">
							<div class="panel-header">
								其他信息
							</div>
							<div class="panel-body other-info">
								<div class="download-container">
									<template v-for="item in knowledgeInfo.fileList">
										<el-button :key="item.id" type="normal" icon="el-icon-my-download" @click="download(item.id)">{{item.fileName}}</el-button>
									</template>
								</div>
								<div class="score-container">
									<span class="demonstration">评分：</span>
									<el-rate v-model="knowledgeInfo.score" :show-text="true" :texts="scoreText"></el-rate>
									<el-button type="normal"  @click="submitScore">提交评分</el-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>	
	</div>
</template>

<script>	
	export default {
		name: 'knowledgeDetail',
		components: {
			
		},
		data() {
			return {
				knowledgeId:'',// 当前知识id
				activeNames: ['1','2','3'],
//				changeScrollbarH: 1,				
				scoreText:['很差','较差','一般','较好','推荐'],
				knowledgeInfo:{
					title:'', // 标题
					remark:'', // 摘要
                    keyword:'', // 关键字
                    createUser:'',// 创建人
					classificationName:'',// 知识分类名称
					authorName:'',//作者名称
					assetsName:'', // 资产名称
					categoryName:'', // 资产分类名称
					manufacturer:'', // 厂商
					model:'', // 型号					
					knowledgeDetails:'',// 详情
					emergencyPlan:'', // 应急方案
					solution:'', // 解决方案
					score:0, // 评分
					fileList:[],
					workOrderId:'',
				},
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
			// 获取知识审核详情
			getDetail(){
				this.$axios.post('/itsm/knowledgeBase/search/queryById',{id:this.knowledgeId}).then( (res) => {
					if(res.status == 200) {
						for(var i in this.knowledgeInfo){
							if(res.data[i]){
								this.knowledgeInfo[i] = res.data[i];
							}
						}
					} else {
						this.$message({ type: 'error', message: res.message });
					}
				});
			},
			// 点击附件下载
			download(id){
				window.open(`/api/itsm/knowledgeBase/fileManager/download?id=${id}&Token=${this.token}`);
			},
			// 提交评分
			submitScore(){
//				console.log(this.knowledgeInfo.workOrderId);
				if(!this.knowledgeInfo.score){
					this.$message({ type: 'warning', message: "请先评分" });
					return;
				}
				this.$axios.post('/itsm/knowledgeBase/search/knowledgeMark',{userId: this.knowledgeInfo.createUser,knowledgeId:this.knowledgeId,score:this.knowledgeInfo.score,workOrderId:this.knowledgeInfo.workOrderId}).then( (res) => {
					if(res.status == 200) {
						this.$message({ type: 'success', message: res.message });
						this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
						this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/knowledgeSearch`);
					} else {
						this.$message({ type: 'error', message: res.message });
					}
				});
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
				if(this.$route.path == '/knowledgeSearch/knowledgeDetail'){
					if(this.$route.query.id !== this.knowledgeId) {
						Object.assign(this.$data, this.$options.data());
						this.init();
					}
				}
		    }
        }
	}
</script>
<style lang="less">
	
</style>
