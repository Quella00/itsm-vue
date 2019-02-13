<template>
	<div class="processSteps">
		<div class="fl arrow-left" :class="{'disabled-arrow-left': isDisabledArrowLeft}" @click="leftClickFun">
			<i class="el-icon-arrow-left"></i>
		</div>
		<div class="fr arrow-right" :class="{'disabled-arrow-right': isDisabledArrowRight}" @click="rightClickFun">
			<i class="el-icon-arrow-right"></i>
		</div>

		<div class="steps-container">
			<div class="steps-content">
				<div class="steps-box">
					<template v-if="nodeData.length">
					<template v-for="(item, index) in nodeData">
						<!--开始-->
						<div class="step-item start" v-if="index == 0">
							<span class="step-text">{{ item.processNodeName }}</span>
						</div>
						
						<!--去除头尾的节点-->
						<template v-if="configProcessStepsData.state == 'operation'">
							<div :class="['step-item', 'item-color'+index % 5]" style="cursor:pointer" v-if="index > 0 && index < nodeData.length - 1" @click="editNodeProperty(item)">
								<i class="el-icon-my-tabDelete" v-if="index > 2 && index < nodeData.length - 2" @click.stop="deleteStep(index)"></i>
								<span class="step-text">{{ item.processNodeName }}</span>
							</div>
						</template>
						<template v-else>
							<div :class="['step-item', 'item-color' + index % 5]" v-if="index > 0 && index < nodeData.length - 1">
								<span class="step-text">{{ item.processNodeName }}</span>
							</div>
						</template>
						
						<!--添加审批的+号-->
						<template v-if="configProcessStepsData.state == 'operation' && index > 1 && index < nodeData.length - 2">
							<!--<template v-if="index < nodeData.length - 1 && nodeData[index + 1].processNodeNum !== 10 && item.processNodeNum !== 10">-->
							<template v-if="index < nodeData.length - 1 && nodeData[index + 1].processNodeName !== '审核' && item.processNodeName !== '审核'">
								
								<div class="add-item" style="cursor:pointer" @click="addStep(index)"></div>
							</template>
						</template>
						
						<!--结束-->
						<div class="step-item end" v-if="index == nodeData.length-1">
							<span class="step-text">{{ item.processNodeName }}</span>
						</div>
					</template>
					</template>
				</div>
			</div>
		</div>
		
		<!--编辑属性的弹窗-->
		<stepEdit-dialog v-if="configNodePropertyDialog.show" :configNodePropertyDialog="configNodePropertyDialog" @callback="handlerStepEdit"></stepEdit-dialog>
		
	</div>

</template>

<script>
import stepEditDialog from './stepEditDialog.vue'
	
export default {
	props:['configProcessStepsData'],
	components:{
		stepEditDialog,
	},
    data() {
        return {
            index: 0,          // 从左显示的第一个元素的索引
            moveW: 0,          // 移动到的距离
            boxW: 0,           // 流程盒子的总宽度
            contentW: 0,       // 可显示区域的宽度

            nodeData: [],        // 节点数据
            
            // 编辑节点
        	configNodePropertyDialog: {
        		show: false,
        		id:'',
        		data:''
        	}
        }
    },
    mounted(){
        this.$nextTick( ()=>{
        	this.init();
        })
    },
    methods:{
        init(){
        	this.getProcessStepsData();
        },
        
        // 获取节点数据
        getProcessStepsData() {
        	this.nodeData = this.configProcessStepsData.nodeData;
        	setTimeout(()=>{
        		this.setBoxW();
        	},500);
        },
        
        // 设置流程盒子的总宽度
        setBoxW() {
        	this.index = 0;
        	this.boxW = 0;
        	this.moveW = 0;
          	this.boxW = 0;
            
            for(var i = 0; i < $(".steps-box").children().length; i++){
            	this.boxW += $(".steps-box").children().eq(i).outerWidth(true);
            }
            //console.log('设置宽度');
            //console.log(this.boxW);
            
            $('.steps-box').css({
            	width: this.boxW,
				transition: '1s',
            	transform: 'translateX(' + this.moveW + 'px)'
            });
        },
        
        // 点击左箭头
        leftClickFun(){
        	if(this.moveW >= 0){
        		return;
        	}
        	
        	this.index --;
            this.moveW = this.moveW + $(".steps-box").children().eq(this.index).outerWidth(true);
            $('.steps-box').css({
            	transition: '1s',
            	transform: 'translateX(' + this.moveW + 'px)'
            });
        },
        
        // 点击右箭头
        rightClickFun(){
        	this.contentW = $(".steps-content").width();
        	if(this.boxW < this.contentW || (this.boxW + this.moveW) < this.contentW){
        		return;
        	}
            
            this.moveW -= $(".steps-box").children().eq(this.index).outerWidth(true);
            $('.steps-box').css({
            	transition: '1s',
            	transform: 'translateX(' + this.moveW + 'px)'
            });
            this.index ++;
        },
        
        // 删除节点
        deleteStep( index ) {
        	this.configProcessStepsData.stepsData.push({
        		type: 'deleteNode',
        		index: index,
        		data: this.nodeData[index]
        	});
        	
        	this.nodeData.splice(index, 1);
        	this.setBoxW();
        },
        
        // 编辑流程节点属性
        editNodeProperty( val ) {
        	var self = this, flag = true;
        	if( self.configProcessStepsData.params.processList.length ) {
	        	for( var i = 0; i < self.configProcessStepsData.params.processList.length; i++) {
	        		
	        		console.log( self.configProcessStepsData.params.processList[i].processNodeId );
	        		console.log( val.id );
	        		
	        		//if(self.configProcessStepsData.params.processList[i].processNodeId == val.id && self.configProcessStepsData.params.processList[i].processNodeSerial == val.processNodeSerial) {	
	          		if(self.configProcessStepsData.params.processList[i].processNodeId == val.id ) {	
	        			self.configNodePropertyDialog.data =  self.configProcessStepsData.params.processList[i];
	        			
	        			console.log( self.configNodePropertyDialog.data );
	        			flag = false;
	        			break;
	        		}
	          		
	        	};
        	}
        	
        	if(flag) {
        		self.configNodePropertyDialog.data = {};
        	}
        	
        	this.$nextTick( ()=>{
        		this.configNodePropertyDialog.show = true;
        	});
        	
        },
        // 返回节点编辑的数据
        handlerStepEdit( val ) {
        	var self = this;
        	
        	if( self.configProcessStepsData.params.processList.length ){
        		var flag = true;
	        	for(var i = 0; i < self.configProcessStepsData.params.processList.length; i++) {
	        		if(self.configProcessStepsData.params.processList[i].processNodeId == val.processNodeId && self.configProcessStepsData.params.processList[i].processNodeSerial == val.processNodeSerial) {
	        			self.configProcessStepsData.params.processList[i] = val;
	        			flag = false;
	        			break;
	        		};
	        	}
	        	flag && self.configProcessStepsData.params.processList.push( val );
        	}else{
        		self.configProcessStepsData.params.processList.push( val );
        	}
        },
        
        // 添加流程节点
        addStep( index ) {
        	
        	this.configProcessStepsData.stepsData.push({
        		type: 'addNode',
        		index: index,
        		data: ''
        	});
        	
					this.$axios.post('/itsm/process/manager/node/queryExamineNodes').then((res) => {
						if(res.status == 200) {
							var item = res.data;
							var processNodeSerial = new Date().getTime();
							
							this.nodeData.splice(index + 1, 0, {
								id: item.id,
								processNodeSerial: processNodeSerial,        // 审核节点的标识
								
								//processNodeName: item.processNodeName,
								//processNodeNum: item.processNodeNum,
								processNodeName: item.processNodeName,
								processNodeDescribe: item.processNodeDescribe,
								processNodeAction: item.processNodeAction
							});
							
							// 获取新增节点属性
							console.log( item.id );
							console.log( 'item.id' );
							this.getQueryAllNodeProperty( item.id,  processNodeSerial);
						}
					});
        },
        
        // 获取新增的节点属性
        getQueryAllNodeProperty( processNodeId,  processNodeSerial) {
					this.$axios.post('/itsm/process/manager/node/property/queryAllNodePropertyBaseByNodeId', {processNodeId: processNodeId}).then((res) => {
						if(res.status == 200 && res.data.length) {
							this.configProcessStepsData.nodePropertyData.push( res.data[0] );
							
							var item = res.data[0];
							this.configNodePropertyDialog.data = {
								id: item.id,
								processNodeSerial: processNodeSerial,      // 审核节点的标识
								processTemplatesId: this.configProcessStepsData.params.processTemplatesId,
								//processNodeId: item.processNodeId,
								processNodeId: item.id,
								processNodeVersionId: this.configProcessStepsData.params.id,
								
								processNodeName: item.processNodeName,        			// 节点名称
								processRoleName: item.processRoleName,                	// 流程角色
								processRoleId: Number(item.processRoleId),            	// 流程角色
								handleTime: item.handleTime,                  			// 是否计入处理时间
								closeWorkOrder: item.closeWorkOrder,          			// 是否拥有关闭工单权限
								hangUpWorkOrder: item.hangUpWorkOrder,        			// 是否可以挂起工单  
								rejectWorkOrder: item.rejectWorkOrder,                  // 是否可以回滚  
								confirmCloseWorkOrder: item.confirmCloseWorkOrder,      // 是否可以确认关闭工单
								
								acceptWorkOrder: item.acceptWorkOrder,                  // 是否有受理权限  
								appointWorkOrder: item.appointWorkOrder,                // 是有指派的权限  
								startupWorkOrder: item.startupWorkOrder,                // 是否有启动的权限  
								
								noticeNextNodeEmail: item.noticeNextNodeEmail,                   // 是否邮件通知下一个节点用户
								noticeNextNodeSms: item.noticeNextNodeSms,                       // 是否短信通知下一个节点用户
								noticeWorkOrderCreator: item.noticeWorkOrderCreator,             // 是否通知工单创建者
								noticeWorkOrderCreatorEmail: item.noticeWorkOrderCreatorEmail,   // 是否邮件通知工单创建者
								noticeWorkOrderCreatorSms: item.noticeWorkOrderCreatorSms,       // 是否短信通知工单创建者
								baseProperty: item.baseProperty                                  // 是否是基本属性
							};
							
							this.configProcessStepsData.params.processList.push(this.configNodePropertyDialog.data);
							
							this.$nextTick(()=>{
								this.configNodePropertyDialog.show = true;
							});
						}
					});
        }
        
    },
	computed: {
		// 右侧箭头按钮的是否禁用
		isDisabledArrowRight(){
			this.contentW = $(".steps-content").width();
        	if(this.boxW < this.contentW || (this.boxW + this.moveW) < this.contentW){
        		return true;
        	}
			return false;
		},
		// 右侧箭头按钮的是否禁用
		isDisabledArrowLeft(){
			if( this.moveW >= 0 ) {
				return true;
			}
			return false;
		}
	},
    watch:{
    	'configProcessStepsData.nodeData':{
    		handler(){
    			this.init();
    		},
    		deep: true
    	}
    }
}
</script>
<style lang="less">
	.processSteps {
		
	}
</style>