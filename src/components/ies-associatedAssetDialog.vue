<template>
	<!-- 关联资产弹窗 -->
	<el-dialog width="800px" :visible="true" title="搜索关联资产" @close="closeDialog" :close-on-click-modal='false' v-drag>
	    <div class="tabs-panel-wrap border">
	        <div class="panel-body">
	            <el-table ref="assetTable" :data="configSlaAssetDialog.data" @selection-change="changeAssociatedAssetselection" max-height="400" stripe style="width: 100%;">
	                <el-table-column type="selection" width="55"></el-table-column>
	                <el-table-column prop="code" label="编号" width="180" show-overflow-tooltip></el-table-column>
	                <el-table-column prop="name" label="资产名称" show-overflow-tooltip></el-table-column>
	                <el-table-column prop="classificationName" label="分类" show-overflow-tooltip></el-table-column>
					<el-table-column prop="assetStatus" label="状态" show-overflow-tooltip></el-table-column>
	            </el-table>
	        </div>
	        <div class="panel-footer">
	        	<el-pagination @size-change="changePageSize" @current-change="changePageCurrent" :current-page="configSlaAssetDialog.params.pageNum" :page-size="configSlaAssetDialog.params.pageSize" :page-sizes="configSlaAssetDialog.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configSlaAssetDialog.total"></el-pagination>
	        </div>
	    </div>
	    
	    <div slot="footer">
	    	<el-button type="primary" size="normal" v-if="this.defaultConfigAssociatedAssetDialog.type == 'sla'" @click="saveSlaAssetData">导&nbsp;入</el-button>
	        <el-button type="primary" size="normal" v-if="this.defaultConfigAssociatedAssetDialog.type == 'ola'" @click="saveOlaAssetData">导&nbsp;入</el-button>
	    </div>
	</el-dialog>
</template>

<script>
export default {
	props:['defaultConfigAssociatedAssetDialog','value'],
	data () {
		return {
           	// 关联sla资产查询
            configSlaAssetDialog: {
				
				//selected: [],                 
				total: 0,
				pageSizes: [10, 20, 30, 40],
				
				params: {
					serviceLevelName: '',      //服务等级名称
					
					assetName: '',               // 资产名称
					assetStatus: '',             // 资产状态
					//assetArea: '',               // 资产区域
					areaId: '',               // 资产区域ID
					//assetClassification: '',     // 资产分类
					assetClassificationId: '', // 资产分类ID
					assetCode: '',               // 资产编码
					
                    pageNum: 1,                  // 当前页
					pageSize: 10                 // 每页数量
				},
              	data: [],
              	
              	selectedAll: []         // 二维数组,第一个数组存当前页的id，第二个数组存当前页外的id

			},
           
           // 保存ola关联资产
           configSaveOlaAsset: {
           		olaId: '',                  // ola记录ID
           		deleteOlaAssetIdList: '',   // 删除的关联资产ID集合
				params: {
					olaAssetList:[]
				}
           },
           
			// 保存sla关联资产
			configSaveSlaAsset: {
				params: {
		           	serviceLevelName: '',   // 服务等级名称
		           	saveAssetIdList: ''     // 新增加的资产记录ID
				}
			}
           
        }
	},
	mounted() {
		this.$nextTick( ()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.$ies.syncValue(this.configSlaAssetDialog.params, this.defaultConfigAssociatedAssetDialog.params);
			
			if(this.defaultConfigAssociatedAssetDialog.type == 'sla') {
				this.configSlaAssetDialog.selectedAll[0] = this.defaultConfigAssociatedAssetDialog.selected;
				this.getSlaAssetData('init');
			}
			
			if(this.defaultConfigAssociatedAssetDialog.type == 'ola') {
				this.configSlaAssetDialog.selectedAll[0] = this.defaultConfigAssociatedAssetDialog.selected.map( (item)=>{
					return {id:item}
				});
				this.getOlaAssetData('init');
			}
		},
		
		// 获取SLA关联资产的列表信息
		getSlaAssetData(v) {
			v !== 'init' && this.mergeSlaCheckedData();
			
			//this.$axios.post('/itsm/servicelevel/sla/querySlaAsset', this.configSlaAssetDialog.params).then((res) => {
			this.$axios.post('/itsm/servicelevel/sla/associateAsset', this.configSlaAssetDialog.params).then((res) => {
				if(res.status == 200 && res.data && res.data.list.length) {
					this.configSlaAssetDialog.data = res.data.list;
					this.configSlaAssetDialog.total = res.data.total;
					
					this.configSlaAssetDialog.selectedAll[1] = [];
					this.configSlaAssetDialog.selectedAll[2] = [];
					this.configSlaAssetDialog.selectedAll[0].forEach( item1 => {
						var flag = true;
						this.configSlaAssetDialog.data.forEach( item2 => {
							if(item1 == item2.id) {
								flag = false;
								this.configSlaAssetDialog.selectedAll[1].push(item2);
								this.$nextTick( ()=>{
									this.$refs.assetTable.toggleRowSelection(item2);
								});
							}
						});
						flag && this.configSlaAssetDialog.selectedAll[2].push(item1);
					});
					console.log( this.configSlaAssetDialog.selectedAll[0] );
					console.log( this.configSlaAssetDialog.selectedAll[1] );
					console.log( this.configSlaAssetDialog.selectedAll[2] );
				}else{
					this.configSlaAssetDialog.data = res.data.list;
					this.configSlaAssetDialog.total = res.data.total;
					
					this.configSlaAssetDialog.selectedAll[1] = [];
					this.configSlaAssetDialog.selectedAll[2] = [];
					this.configSlaAssetDialog.selectedAll[0] = [];
				}
			});
		},
		
		// 获取OLA的关联资产数据
		getOlaAssetData(v) {
			v !== 'init' && this.mergeOlaCheckedData();
			
			//this.$axios.post('/itsm/servicelevel/sla/querySlaAsset', this.configSlaAssetDialog.params).then((res) => {
			this.$axios.post('/itsm/servicelevel/ola/associateSlaAsset', this.configSlaAssetDialog.params).then((res) => {
				if(res.status == 200 && res.data &&  res.data.list && res.data.list.length) {
					this.configSlaAssetDialog.data = res.data.list;
					this.configSlaAssetDialog.total = res.data.total;
					
					this.configSlaAssetDialog.selectedAll[1] = [];
					this.configSlaAssetDialog.selectedAll[2] = [];
					this.configSlaAssetDialog.selectedAll[0].forEach( item1 => {
						var flag = true;
						this.configSlaAssetDialog.data.forEach( item2 => {
							if(item1.id == item2.id) {
								flag = false;
								this.configSlaAssetDialog.selectedAll[1].push(item2);
								this.$nextTick( ()=>{
									this.$refs.assetTable.toggleRowSelection(item2);
								});
							}
						});
						flag && this.configSlaAssetDialog.selectedAll[2].push(item1);
					});
//					console.log( this.configSlaAssetDialog.selectedAll[0] );
//					console.log( this.configSlaAssetDialog.selectedAll[1] );
//					console.log( this.configSlaAssetDialog.selectedAll[2] );
				}else{
					this.configSlaAssetDialog.data = res.data.list;
					this.configSlaAssetDialog.total = res.data.total;
					
					this.configSlaAssetDialog.selectedAll[1] = [];
					this.configSlaAssetDialog.selectedAll[2] = [];
					this.configSlaAssetDialog.selectedAll[0] = [];
				}
				
			});
		},
		
		// 合并SLA选中的关联资产的数据
		mergeSlaCheckedData(){
			console.log('mergeSlaCheckedData');
			this.configSlaAssetDialog.selectedAll[0] = this.configSlaAssetDialog.selectedAll[1].map( (item)=>{
				return item.id
			}).concat(this.configSlaAssetDialog.selectedAll[2]);
			return this.configSlaAssetDialog.selectedAll[0];
		},
		
		// 合并OLA选中的关联资产的数据
		mergeOlaCheckedData(){
			this.configSlaAssetDialog.selectedAll[0] = this.configSlaAssetDialog.selectedAll[1].concat(this.configSlaAssetDialog.selectedAll[2]);
			return this.configSlaAssetDialog.selectedAll[0];
		},

		
		// selection 改变时会触发
		changeAssociatedAssetselection( value ) {
			this.configSlaAssetDialog.selectedAll[1] = value;
			//console.log( this.configSlaAssetDialog.selectedAll[1] );
		},
		
		// pageSize 改变时会触发
		changePageSize( value ) {
            this.configSlaAssetDialog.params.pageSize = value;
            if(this.defaultConfigAssociatedAssetDialog.type == 'sla') {
            	this.getSlaAssetData();
            }
            if(this.defaultConfigAssociatedAssetDialog.type == 'ola') {
            	this.getOlaAssetData();
            }
		},
		
		// currentPage 改变时会触发
		changePageCurrent( value ) {
            this.configSlaAssetDialog.params.pageNum = value;
            if(this.defaultConfigAssociatedAssetDialog.type == 'sla') {
            	this.getSlaAssetData();
            }
            if(this.defaultConfigAssociatedAssetDialog.type == 'ola') {
            	this.getOlaAssetData();
            }
		},
		
		// 关闭弹窗
		closeDialog() {
			this.$emit('input', false);
		},
		
		// 导入sla关联资产数据
		saveSlaAssetData() {
			this.configSaveSlaAsset.params.serviceLevelName = this.defaultConfigAssociatedAssetDialog.serviceLevelName;
			this.configSaveSlaAsset.params.saveAssetIdList = this.mergeSlaCheckedData().join();
			
			if( !this.configSaveSlaAsset.params.saveAssetIdList ){
				this.$message.warning('至少选择一条数据');
				return;
			}
			
			this.$axios.post('/itsm/servicelevel/sla/saveSlaAsset', this.configSaveSlaAsset.params ).then((res) => {
				if(res.status == 200) {
					this.$message.success(res.message);
					this.$emit('assetChooseHandler', this.configSaveSlaAsset.params.saveAssetIdList)
					this.closeDialog();
				}
			});
		},
		
		// 导入ola关联资产数据
		saveOlaAssetData() {
			this.mergeOlaCheckedData();

			for(var i = 0; i < this.configSlaAssetDialog.selectedAll[0].length; i++){
				for(var j = 0; j < this.defaultConfigAssociatedAssetDialog.selected.length; j++){
					if(this.configSlaAssetDialog.selectedAll[0][i].id == this.defaultConfigAssociatedAssetDialog.selected[j]) {
						this.configSlaAssetDialog.selectedAll[0].splice(i,1);
						this.defaultConfigAssociatedAssetDialog.selected.splice(j,1);
						i--;
						break;
					}
				}
			}
			
			this.configSaveOlaAsset.olaId = this.defaultConfigAssociatedAssetDialog.olaId;
			this.configSaveOlaAsset.deleteOlaAssetIdList = this.defaultConfigAssociatedAssetDialog.selected.join();
			
			this.configSaveOlaAsset.params.olaAssetList = this.configSlaAssetDialog.selectedAll[0].map( (item)=>({
				assetArea: item.regionOfAffiliationName,
				assetClassification: item.classificationName,
				assetCode: item.code,
				
				assetAreaId: item.regionOfAffiliation,
				assetClassificationId: item.classification,
				
				//assetId: item.assetId,
				assetId: item.id,
				assetName: item.name,
				assetStatus: item.assetStatus,
				assetUser: item.user,
				//id: item.id,
				olaId: item.olaId
			}));
			
			
			if( !this.configSaveOlaAsset.params.olaAssetList.length ){
				this.$message.warning('至少选择一条数据');
				return;
			};
			
			this.$axios.post('/itsm/servicelevel/ola/saveOlaAsset?olaId=' + this.configSaveOlaAsset.olaId + '&deleteOlaAssetIdList=' + this.configSaveOlaAsset.deleteOlaAssetIdList, this.configSaveOlaAsset.params.olaAssetList ).then((res) => {
				if(res.status == 200) {
					this.$message.success(res.message);
					this.$emit('assetChooseHandler');
					this.closeDialog();
				}else{
					this.$message.error(res.message);
				}
			});
		},
		
	}
}
	
</script>

<style>
</style>