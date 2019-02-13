<template>

	<div class="itsm-tabs-main">
		<div class="tabs-main">

			<div class="tabs-panel-wrap border">
				<ul class="mock-axios">
					<li>
						<p>get请求(无参数)：/yzz/showData</p>
						<p>{{ showData }}</p>
					</li>
					<li>
						<p>get请求(有参数)：/yzz/removeData</p>
						<p>{{ removeData }}</p>
					</li>
					<li>
						<p>post请求：/yzz/addData</p>
						<p>{{ addData }}</p>
					</li>
				</ul>
			</div>

		</div>
	</div>
	
</template>

<script>
export default {
	components: {
		
	},
	props: {
		
	},
	data() {
		return {
			showData: '',
			removeData: '',
			addData: '',
		};	
	},
	mounted() {
		
		this.$nextTick( ()=>{
			
			// get请求(无参数)
			this.$axios.get('/yzz/showData').then( (res) => {
				this.showData = res;
				console.log( res );
			});
			
			// get请求(有参数)
			this.$axios.get('/yzz/removeData',{
				params: {
					name: 'yzz'
				}
			}).then( (res) => {
				this.removeData = res;
				console.log( res );
			});
			
			// post请求
			this.$axios.post('/yzz/addData',{
				name: 'admin',
				pwd: '123456'
			},{
				loading: false
			}).then( (res) => {
				this.addData = res;
				console.log( res );
			});
			
		});
		
	},
	methods: {
		
	},
	filters: {
		
	},
	computed: {
		
	},
	watch: {
		
	}
}
</script>

<style lang="less" scoped>
	.mock-axios{
		padding: 10px;
		li{
			line-height: 24px; margin-bottom:20px;
		}
	}
	
</style>