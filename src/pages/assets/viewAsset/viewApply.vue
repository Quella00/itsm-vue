<!-- 资产应用:查看资产 -->
<template>
	<div class="itsm-tabs-main add-edit-asset">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:changeScrollbarH}">
				<div class="add-edit-asset-container">

					<div>
						<asset-top ref="assetTop"></asset-top>
					</div>

					<div>
						<asset-bottom ref="assetBottom"></asset-bottom>
					</div>
					
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	import assetTop from './assetTop.vue'
	import assetBottom from './assetBottom.vue'

	export default {
		name: 'viewApply',
		components: {
			assetTop, assetBottom
		},
		data() {
			return {
				changeScrollbarH: 1
			}
		},
		mounted() {
			this.$nextTick(function() {
				
			});
		},
		methods: {
			
		}
	}
</script>