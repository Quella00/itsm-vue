<!-- 版本:查看资产 -->
<template>
	<div class="itsm-tabs-main add-edit-asset">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:changeScrollbarH}">
				<div class="add-edit-asset-container">
					<div>
						<asset-top ref="assetTop"></asset-top>
					</div>
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	import assetTop from './assetTop.vue'

	export default {
		name: 'viewVersion',
		components: {
			assetTop
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