<template>
	<div class="panel-content border">
		<div class="panel-header">
			最新公告
			<div class="fr">
				<span class="el-icon-my-refresh" @click="latestAnnouncement"></span>
			</div>
		</div>
		<div class="panel-body" style="height:279px;">
			<ul class="notice-list clearfix">
				<li v-for="item in change(announcement)">
					<a href="#" @click="announcementDetail(item.id)">
						<i v-bind:style="item.color">{{item.level}}</i>{{item.title}}
					</a>
					<span>{{item.updateTime == null ? item.createTime : item.updateTime}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			announcement: [],	// 最新公告
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.latestAnnouncement();
		},
		// 最新公告
		latestAnnouncement() {
			this.$axios.post('/itsm/system/dailymanagement/announcement/queryIndexAnnouncement', {
				userId: this.$store.state.user.info.id
			} ).then( (res) => {
				if(res.status == 200) {
					this.announcement = res.data == null ? [] : res.data;
				}
			});
		},
		// 公告详情
		announcementDetail(v) {
			const self = this;
			this.$axios.post('/itsm/system/notice/readX',{xId:v,type:0}).then((res) => {
				console.log('未读改为已读');
				// 刷新小铃铛
				this.$ies.dispatch(this, 'layout').$refs.header.queryUnReadCount();
			});
			
			this.$ies.dispatch(this, 'home').openAnnouncementDialog(v);
		},
		change(items) {
			return items.filter(function (item) {
				switch(item.priorityLevel) {
					case '一级（最高）':
						item['level'] = 1; item['color'] = {'background-color':'#f1473d'}; break;
					case '二级（高）':
						item['level'] = 2; item['color'] = {'background-color':'#ff9933'}; break;
					case '三级（中）':
						item['level'] = 3; item['color'] = {'background-color':'#ffce24'}; break;
					case '四级（低）':
						item['level'] = 4; item['color'] = {'background-color':'#57c136'}; break;
					case '五级（最低）':
						item['level'] = 5; item['color'] = {'background-color':'#50ac34'}; break;
				}
      			return item;
    		});
		}
	}
}
</script>

<style>
</style>