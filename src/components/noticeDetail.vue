<template>
	<div class="notice-detail-dialog">
		<el-dialog title="最新公告" :visible="value" custom-class="notice-detail" @close="close" width="800px" height="500px" :close-on-click-modal='false' v-drag>	
			<ies-scrollbar class="ies-scrollbar">
				<div class="notice-content">
					<div class="title">
	                    <slot name="title">{{title}}</slot>
	                </div>
					<div class="content">
	                    <slot name="content"><div v-html="content"></div></slot>
	                </div>
	                <div class="foot">
	                    <slot name="foot">
	                    	<div class="foot-priority" v-show="priorityLevel">优先级：{{priorityLevel}}</div>
	                    	<div class="foot-organization" v-show="organizationName">发布范围：{{organizationName}}</div>
	                    	<div class="foot-file" v-show="fileList.length">
	                    		活动附件：
	                    		<ul class="file-list">
									<li v-for="item in fileList" @click="download(item)">
										<i class="el-icon-document"></i>&nbsp;<a href="javascript:;">{{item.name}}</a>&nbsp;&nbsp;&nbsp;
									</li>
								</ul>
	                    	</div>
	                    </slot>
	                </div>
				</div>
			</ies-scrollbar>
			<div slot="footer" class="dialog-footer">
				<el-button type="normal" @click="close">&nbsp;关&nbsp;闭&nbsp;</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
    /**
    * 公告详情组件
    * Attributes
    * @param  { Boolean }  value      是否显示 Dialog
    * slot
    * @param  { Html }  title           标题
    * @param  { Html }  content         内容
	**/
    export default {
    	components: { 

		},
//      props: {
//          visible: {
//              type: Boolean,
//              default: false
//          }
//      },
        props:['defaultSelect', 'value'],
    	data() {
            return {
            	token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
				title: '',
				priorityLevel: '',
				organizationName: '',
				content: '',
				fileList: []
            }
        },
		mounted() {
			this.$nextTick(function () {
                //this.query();
        	});
    	},
        methods: {
        	query() {
        		this.$axios.post('/itsm/system/dailymanagement/announcement/queryAnnouncementDetail',{announcementId:this.defaultSelect}).then( (res) => {
					if(res.status == 200 && res.data) {
						this.title = res.data.title;
        				this.content = res.data.content;
        				this.priorityLevel = res.data.priorityLevel;
        				this.organizationName = res.data.organizationName.toString();
        				this.getFile(res.data.announcementFileBeanList);
					}
				});
        	},
        	getFile(list) {
				const self = this;
				this.fileList = [];
				if(list && list.length) {
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
						self.fileList.push(obj);
					});
				} 
			},
	      	// 下载附件
	      	download(file) {
	      		window.open(file.response.data.path);
	      	},
            close() {
				const self = this;
                // self.$emit('update:visible', false)
				this.$emit('input', false);
            }
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch: {
           value(v) {
			   const self = this;
			   
               v ? self.query() : Object.assign(self.$data, self.$options.data.call(self));
           }
        }
    }
</script>

<style lang="less">
    .notice-detail-dialog {
		.notice-detail {
			.el-dialog__body { 
				height: 270px; 
				.notice-content {
					padding: 40px 35px 25px 35px; word-break: break-all;
					.title {
						font-size: 15px; font-weight: bold; text-align: center; margin-bottom: 30px;
					}
					.content {
						img {
							display: inline-block; max-width: 100%;
						}
					}
					.foot {
						margin-top: 40px; font-size: 12px; color: #acacac;
						.foot-priority {
							display: inline; margin-right: 20px;
						}
						.foot-organization {
							display: inline;
						}
						.foot-file {
							ul, li {
								display: inline; 
							}
							a {
								color: #acacac;
							}
						}
					}
				}
			}
		}
		.el-table {
			.el-table__body-wrapper {
				overflow-x: hidden;
			}
		}
	}
</style>
