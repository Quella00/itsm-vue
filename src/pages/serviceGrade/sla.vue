<template>
	<div class="itsm-tabs-main slaListPage">
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar">
                <div class="tabs-panel-wrap border">
                	<div class="panel-body">
	                    <el-table :data="configSlaTable.data" border>
	                        <el-table-column align="center" prop="serviceLevelName" label="SLA级别"></el-table-column>
	
	                        <el-table-column align="center" label="*服务响应时间（分钟）">
	                            <template slot-scope="scope">
	                                <el-input v-model="scope.row.responseTime"></el-input>
	                            </template>
	                        </el-table-column>
	
	                        <el-table-column align="center" label="*服务恢复时间（分钟）">
	                            <template slot-scope="scope">
	                                <el-input v-model="scope.row.recoveryTime"></el-input>
	                            </template>
	                        </el-table-column>
	
	                        <el-table-column align="center" label="*服务解决时间（分钟）">
	                            <template slot-scope="scope">
	                                <el-input v-model="scope.row.resolutionTime"></el-input>
	                            </template>
	                        </el-table-column>
	
	                        <el-table-column align="center" label="*可用性（%）">
	                            <template slot-scope="scope">
	                                <el-input v-model="scope.row.serviceability"></el-input>
	                            </template>
	                        </el-table-column>
	
	                        <el-table-column align="center" label="*稳定运行时间（小时）">
	                            <template slot-scope="scope">
	                                <el-input v-model="scope.row.stableRunningTime"></el-input>
	                            </template>
	                        </el-table-column>
	
	                        <el-table-column align="center" label="操作">
	                            <template slot-scope="scope">
	                                <el-button type="primary" size="normal" icon="el-icon-my-guanlian" @click="openSlaSave(scope.row.serviceLevelName)">关联资产</el-button>
	                            </template>
	                        </el-table-column>
	                    </el-table>
                	</div>
                    <div class="panel-footer" style="text-align:center;">
                    	<el-button type="primary" size="normal" style="padding:0 30px;" @click="saveSlaTableData">保&nbsp;存</el-button>
                    </div>
                </div>
            </ies-scrollbar>
        </div>
	</div>
</template>

<script>
export default {
	name: 'sla',
	data () {
		return {
            // sla配置数据
            configSlaTable: {
            	data: [],        // 数据源
            	initData: []     // 初始数据
            },
            
            // 保存的数据
            configSaveSlaTable: {
            	changeServiceLevelNameList: '',  // 修改的服务等级名称
            	data: []         // 修改的数据
            }
            
		};
    },
    mounted() {
    	this.$nextTick( ()=>{
    		this.init();
    	})
    },
	methods: {
		init() {
			this.getSlaTableData();
		},
		
		// 获取sla配置数据
		getSlaTableData() {
			this.configSaveSlaTable.data = [];
			
			this.$axios.post('/itsm/servicelevel/sla/querySla').then((res) => {
				if(res.status == 200) {
					this.configSlaTable.data = res.data;
					this.configSlaTable.initData = JSON.parse(JSON.stringify(this.configSlaTable.data));
				}
			});
		},
		
		// 保存sla配置数据
		saveSlaTableData() {
			// 数据合法性判断
			for(var i = 0; i < this.configSlaTable.data.length; i++){
				if( !(/^[1-9]\d*$/.test(this.configSlaTable.data[i].responseTime)) || this.configSlaTable.data[i].responseTime.length > 6 ){
					this.$message.error('时间输入框的值必须为正整数,且位数不超过6位');
					return;
				}
				if( !(/^[1-9]\d*$/.test(this.configSlaTable.data[i].recoveryTime)) || this.configSlaTable.data[i].recoveryTime.length > 6 ){
					this.$message.error('时间输入框的值必须为正整数,且位数不超过6位');
					return;
				}
				if( !(/^[1-9]\d*$/.test(this.configSlaTable.data[i].resolutionTime)) || this.configSlaTable.data[i].resolutionTime.length > 6 ){
					this.$message.error('时间输入框的值必须为正整数,且位数不超过6位');
					return;
				}
				if( !(/^[1-9]\d*$/.test(this.configSlaTable.data[i].serviceability)) || Number(this.configSlaTable.data[i].serviceability) > 100 ){
					this.$message.error('可用性输入框的值必须为正整数且不能大于100');
					return;
				}
				if( !(/^[1-9]\d*$/.test(this.configSlaTable.data[i].stableRunningTime)) || this.configSlaTable.data[i].stableRunningTime.length > 6 ){
					this.$message.error('时间输入框的值必须为正整数,且位数不超过6位');
					return;
				}
				
				this.configSlaTable.data[i].responseTime = Number( this.configSlaTable.data[i].responseTime );
				this.configSlaTable.data[i].recoveryTime = Number( this.configSlaTable.data[i].recoveryTime );
				this.configSlaTable.data[i].resolutionTime = Number( this.configSlaTable.data[i].resolutionTime );
				this.configSlaTable.data[i].serviceability = Number( this.configSlaTable.data[i].serviceability );
				this.configSlaTable.data[i].stableRunningTime = Number( this.configSlaTable.data[i].stableRunningTime );
			}
			
			//console.log( this.configSlaTable.data );
			
			// 数据合法性判断(竖向逻辑判断)
			for(var i = 0; i < 4; i++) {
				if( this.configSlaTable.data[i].responseTime > this.configSlaTable.data[i+1].responseTime ) {
					this.$message.error('当前SLA服务响应时间配置有误，请按照一级≤二级≤三级≤四级≤五级合理的填写数字');
					return;
				}
				if( this.configSlaTable.data[i].recoveryTime > this.configSlaTable.data[i+1].recoveryTime ) {
					this.$message.error('当前SLA服务恢复时间配置有误，请按照一级≤二级≤三级≤四级≤五级合理的填写数字');
					return;
				}
				if( this.configSlaTable.data[i].resolutionTime > this.configSlaTable.data[i+1].resolutionTime ) {
					this.$message.error('当前SLA服务解决时间配置有误，请按照一级≤二级≤三级≤四级≤五级合理的填写数字');
					return;
				}
				if( this.configSlaTable.data[i].serviceability < this.configSlaTable.data[i+1].serviceability ) {
					this.$message.error('当前SLA可用性配置有误，请按照一级≥二级≥三级≥四级≥五级合理的填写数字');
					return;
				}
				if( this.configSlaTable.data[i].stableRunningTime < this.configSlaTable.data[i+1].stableRunningTime ) {
					this.$message.error('当前SLA稳定运行时间配置有误，请按照一级≥二级≥三级≥四级≥五级合理的填写数字');
					return;
				}
			}
			
			// 数据合法性判断(横向逻辑判断)
			for(var i = 0; i < this.configSlaTable.data.length; i++) {
				if( !(this.configSlaTable.data[i].responseTime < this.configSlaTable.data[i].recoveryTime && this.configSlaTable.data[i].recoveryTime < this.configSlaTable.data[i].resolutionTime) ){
					this.$message.error('当前SLA等级('+this.configSlaTable.data[i].serviceLevelName+')配置有误，请按照服务响应时间＜服务恢复时间＜服务解决时间合理的填写数字');
					return;
				}
			}
			
			// 确定哪一行数据有改动
			this.configSaveSlaTable.data = [];
			for(var i = 0; i < this.configSlaTable.data.length; i++) {
				this.configSlaTable.initData[i].responseTime = Number( this.configSlaTable.initData[i].responseTime );
				this.configSlaTable.initData[i].recoveryTime = Number( this.configSlaTable.initData[i].recoveryTime );
				this.configSlaTable.initData[i].resolutionTime = Number( this.configSlaTable.initData[i].resolutionTime );
				this.configSlaTable.initData[i].serviceability = Number( this.configSlaTable.initData[i].serviceability );
				this.configSlaTable.initData[i].stableRunningTime = Number( this.configSlaTable.initData[i].stableRunningTime );
				
				if( JSON.stringify(this.configSlaTable.initData[i]) !== JSON.stringify(this.configSlaTable.data[i]) ) {
					this.configSaveSlaTable.data.push( this.configSlaTable.data[i] );
				}
			}
			
			if(!this.configSaveSlaTable.data.length){
				this.$message.warning('请先修改数据后再保存');
				return;
			}else{
				this.changeServiceLevelNameList = this.configSaveSlaTable.data.map( (item)=>{
					return item.serviceLevelName;
				}).join();
			}
			
			this.$confirm('由于您调整了SLA（'+ this.changeServiceLevelNameList +'），保存后与对应等级SLA关联的OLA即将失效！','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then( ()=>{
				
				this.$axios.post('/itsm/servicelevel/sla/saveSla', this.configSaveSlaTable.data ).then((res) => {
					if(res.status == 200) {
						this.$message.success(res.message);
						this.configSaveSlaTable.data = [];
						this.getSlaTableData();
					}
				});
				
			}).catch(() => {
				this.$message.info('已取消保存!');
			});

		},
		
        openSlaSave(value) {
            var query = {
            	serviceLevelName: value
            };
            this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/slaAssetSave', JSON.stringify(query) );
        },
	}
}
</script>

<style lang="less">

</style>