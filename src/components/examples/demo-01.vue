<template>
	<div>
		
		<p>
			{{ $store.state.testValue }}
		</p>
		
		<p>
			<el-button type="primary" icon="el-icon-edit"></el-button>
			<el-button type="primary" icon="el-icon-share"></el-button>
			<el-button type="primary" icon="el-icon-delete"></el-button>
			<el-button type="primary" icon="el-icon-search">搜索</el-button>
			<el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
			<el-button type="primary">上传<i class="el-icon-my-card el-icon--right"></i></el-button>
		</p>
		
		<div>
			<p>
				<el-input v-model="timevalue" style="width:300px;"></el-input>
			</p>
			<p>
				{{ timevalue | formatTime('yy-mm-dd hh:MM:ss') }}
			</p>
			<p>
				{{ timevalue | formatTime('yy/mm/dd hh:MM:ss') }}
			</p>
			<p>
				{{ timevalue | formatTime('yy-mm-dd AM/PM hh:MM:ss') }}
			</p>
			<p>
				{{ timevalue | formatTime('yy-mm-dd am/pm hh:MM:ss') }}
			</p>
			<p>
				<el-button @click="showTime">显示时间</el-button>
			</p>
		</div>
		
		
	</div>
</template>

<script>
export default {

	data () {
		return {
			timevalue: '1507629311688',
		};
	},
	methods: {
		showTime() {

			var time = new Date().getTime();
			var result = this.$ies.formatTime( time, 'yy-mm-dd hh:MM:ss')
			
			this.$message(result)
		}
	}
}
</script>

<style scoped>
</style>
