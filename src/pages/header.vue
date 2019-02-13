<template>
	<div class="header">
		<div class="header-left">
			<router-link to="/" class="logo">
				<img src="../assets/img/header/header-logo.png" alt="logo" />
			</router-link>
		</div>
		<div class="header-title">
			<img src="../assets/img/header/header-title.png" alt="header-title" />
		</div>
		<div class="header-right">
			<ul class="clearfix">
				<li>
					<a href="javascript:;">
						<i class="el-icon-my-message" @click="openPage('/userCenter/noticeAll')" ref="message">
							<span v-if="msgNum">{{ msgNum }}</span>
						</i>
					</a>
				</li>
				<li style="margin-left:36px;">
					<!--<router-link to="/examples">-->
						<i class="el-icon-my-help"></i>
					<!--</router-link>-->
				</li>
				<li style="margin-left:36px;">
					<el-dropdown trigger="click">
						<p class="el-dropdown-link">
							<span>
								<!--<img src="../assets/img/header/user-img.png" alt="用户头像"/>-->
								<img :src="this.imgUrl" style="border-radius: 100%;" onerror="this.src='../../static/img/user/user-img.png'" />
							</span>
							{{userName}}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</p>
						<el-dropdown-menu slot="dropdown" class="header-dropdown-menu">
							<el-dropdown-item>
								<a href="javascript:;" @click="openPage('/userCenter/personalInfo')">
									个人信息
								</a>
							</el-dropdown-item>
							<el-dropdown-item>
								<a href="javascript:;" @click="openPage('/userCenter/modifyPassword')">
									修改密码
								</a>
							</el-dropdown-item>
							<el-dropdown-item>
								<a href="javascript:;" @click="logOut">退出登录</a>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			msgNum: 0,
			//选择人员弹窗（多选）
			//系统通知
			selectPersonCheckboxDialog:{
				show:false,
				data:{}
			},
			imgUrl: '',
			userName: ''
		};
	},
	beforeMount() {
		
	},
	mounted() {
		this.$nextTick(function() {
			if(this.$store.state.user.info != null) {
				// 实时更新用户信息，避免多终端操作数据不是最新
                this.$axios.post('/itsm/system/sso/index/userInfoDetail',{ id: this.$store.state.user.info.id}).then( (res) => {
					if(res.status == 200) {
						this.$store.commit('changeUserInfo', res.data);
					}
				});

				this.imgUrl = this.$store.state.user.info.imagePath;
				this.userName = this.$store.state.user.info.userName;
			} else {
				this.imgUrl = "../../static/img/user/user-img.png";
				this.userName = "Admin";
			}

			this.init();
		});
	},
	methods: {
		init() {
			const self = this;

			self.queryUnReadCount();
			
			
			try{
				//var websocket = new WebSocket(`ws://192.168.3.22:9909/websocket/${self.userId}`);
				var websocket = new WebSocket(`${self.$axios.socketURL}/websocket/${self.userId}`);
	
				websocket.onopen = function(evnt) {
					console.log("websocket连接上");
				};
				websocket.onmessage = function(evnt) {
					//self.msgNum = 
					console.log('收到新消息');
					//console.log(evnt.data);
					self.queryUnReadCount();
				};
				websocket.onerror = function(evnt) {
					console.log("websocket错误");
				};
				websocket.onclose = function(evnt) {
					console.log("websocket关闭");
				}
			}
			catch(err){
				console.log('websocket出错')
			}
			

			
			

			self.$root.$on('message-update', id => {
				if(self.msgNum) {
					self.msgNum--;
					!self.msgNum && self.$refs.message.classList.remove('animation');
				}
			});
		},
		// 打开页面
		openPage( path ) {
			this.$parent.$refs.sidebar.openPage( path )
		},
		
		// // 系统通知
		// selectPersonCheckboxShow() {
		// 	this.selectPersonCheckboxDialog.show = true;
		// },
		
		// 系统通知回调
		selectPersonCheckboxHandler(data){
			
		},
		
		// 退出登录
		logOut() {
			this.$confirm('确定退出系统吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
				if(this.$store.state.user.info != null) {
					this.$axios.post('/itsm/system/permission/shiroToLogin/loginOut', {loginName:this.$store.state.user.info.loginName} ).then( (res) => {
						if(res.status == 200) {
							this.$parent.$refs.tabsnav.deleteTabsAll();
                            this.$nextTick(() => {
								this.$router.push('/login');
								this.$store.commit('changeUser', null);
							});
						} else {
							this.$message({ type: 'warning', message: res.message });
						}
					});
				} else {
					this.$message({ type: 'warning', message: '当前未登录' });
				}
			}).catch(() => {
				this.$message({ type: 'info', message: '已取消操作' });
			});
		},
		queryUnReadCount() {
			const self = this;

			self.$axios.post('/itsm/system/notice/queryUnReadCount', { userId: self.userId }).then(res => {
				if(res.status == 200) {
					if(res.data) {
						self.msgNum = res.data;
						self.$refs.message.classList.add('animation');
					}
				}
			});
		}
	},
	watch: {
		'$store.state.user.info.imagePath': {
			handler(val,oldVal) {
				this.imgUrl = this.$store.state.user.info == null ? '' :this.$store.state.user.info.imagePath;
			},
			deep:true
		},
		'$store.state.user.info.userName': {
			handler(val,oldVal) {
				this.userName = this.$store.state.user.info == null ? '' :this.$store.state.user.info.userName;
			},
			deep:true
		}
	},
	computed: {
		userId() {
			return this.$store.state.user.info ? this.$store.state.user.info.id : ''
		}
	}
}
</script>

<style lang="less">
    @-webkit-keyframes swing {  
		10% {  
			transform: rotate(15deg);  
		}  
		20% {  
			transform: rotate(-10deg);  
		}  
		30% {  
			transform: rotate(5deg);  
		}  
		40% {  
			transform: rotate(-5deg);  
		}  
		50%,100% {  
			transform: rotate(0deg);  
		}  
	}  
	@-moz-keyframes swing {  
		10% {  
			transform: rotate(15deg);  
		}  
		20% {  
			transform: rotate(-10deg);  
		}  
		30% {  
			transform: rotate(5deg);  
		}  
		40% {  
			transform: rotate(-5deg);  
		}  
		50%,100% {  
			transform: rotate(0deg);  
		}  
	}  
	@-o-keyframes swing {  
		10% {  
			transform: rotate(15deg);  
		}  
		20% {  
			transform: rotate(-10deg);  
		}  
		30% {  
			transform: rotate(5deg);  
		}  
		40% {  
			transform: rotate(-5deg);  
		}  
		50%,100% {  
			transform: rotate(0deg);  
		}  
	}  
	@keyframes swing {  
		10% {  
			transform: rotate(15deg);  
		}  
		20% {  
			transform: rotate(-10deg);  
		}  
		30% {  
			transform: rotate(5deg);  
		}  
		40% {  
			transform: rotate(-5deg);  
		}  
		50%,100% {  
			transform: rotate(0deg);  
		}
	}

	.el-icon-my-message
	{
		&.animation {
			animation: swing 2s .15s linear infinite;  
			-moz-animation: swing 2s .15s linear infinite; /* Firefox */  
			-webkit-animation: swing 2s .15s linear infinite; /* Safari and Chrome */  
			-o-animation: swing 2s .15s linear infinite; /* Opera */ 
		}
	}
</style>