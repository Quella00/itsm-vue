<template>
	<el-dialog title="二维码预览" :visible="true" custom-class="qrcode-view-dialog" @close="closeQrcodeView" :close-on-click-modal='false' v-drag>
		<div class="print-content">
			
			<ies-scrollbar class="ies-scrollbar">
			<!--<div class="print-body">
				<ul class="qrcode-view" style="padding: 34px 0 0 34px; list-style-type: none;">
					<li v-for="item in selectPersonDialog.selectData" style="position:relative; float:left; padding-left:70px; padding-right:5px; padding-top:10px; width:239px; height:105px; 
		background-color:#fff;border-radius:5px;margin-right:7px;list-style-type: none;">
						<div class="qrcode" style="position:absolute; top:10px; left:5px; display:inline-block; width:60px; height:60px; background-color:#333;"></div>
						<div class="text" style="position:relative; word-break:break-all;height: 32px; line-height: 16px; padding-left:60px;font-size:12px; color:#333;">
							<p style="position:absolute; left:0; top:0; width:60px; text-align:right;">资产编码：</p>{{ item.code }}
						</div>
						<div class="text" style="position:relative; word-break:break-all;height: 32px; line-height: 16px; padding-left:60px;font-size:12px; color:#333;">
							<p style="position:absolute; left:0; top:0; width:60px; text-align:right;">资产名称：</p>{{ item.name }}
						</div>
						<div class="text" style="position:relative; word-break:break-all;height: 32px; line-height: 16px; padding-left:60px;font-size:12px; color:#333;">
							<p style="position:absolute; left:0; top:0; width:60px; text-align:right;">IP地址：</p>{{ item.ip }}
						</div>
					</li>
				</ul>
			</div>-->
			<div class="print-body">
				<ul class="qrcode-view">
					<li v-for="(item, index) in selectPersonDialog.selectData">
						<div class="qrcode" :id="'qrcode' + index"></div>
						<!--<div class="text">
							<p>资产编码：</p>{{ item.code }}
						</div>
						<div class="text">
							<p>资产名称：</p>{{ item.name }}
						</div>
						<div class="text">
							<p>IP地址：</p>{{ item.ip }}
						</div>-->
					</li>
				</ul>
			</div>
			</ies-scrollbar>
			
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="normal" @click="closeQrcodeView">取&nbsp;消</el-button>
			<el-button type="normal" @click="printQrcodeView">打印</el-button>
		</div>
	</el-dialog>
</template>
		
<script>
import '../../static/js/jquery.qrcode.min.js'
//import '../../static/js/jquery.PrintArea.min.js'
import '../../static/js/jQuery.print.js'

export default {
	props:['defaultSelect'],
	data() {
        return {
        	selectPersonDialog: {
				selectData: []
			}
        }
    },
	mounted() {
    	this.$nextTick(function () {
            this.init();
    	});
	},
    methods: {
    	init() { 
    		this.selectPersonDialog.selectData = this.defaultSelect;
    		console.log( this.defaultSelect );
    		this.getQrcodeView();
    	},
    	
    	// 显示二维码预览
    	getQrcodeView(){
//  		for(var i = 0; i < 30; i++) {
//  			if(i%2 == 0){
//	    			this.selectPersonDialog.selectData.push({
//						code: '345edrdfgdfgdfg345ed',
//						name: '电饭锅的笔记本电脑额文身断发',
//						ip: '192.168.3.0'
//	    			});
//  			}else{
//	    			this.selectPersonDialog.selectData.push({
//						code: '1243345655',
//						name: '笔记本电脑',
//						ip: '192.168.23.100'
//	    			});
//  			};
//  		};
    		
    		this.$nextTick(()=>{
    			
    			this.selectPersonDialog.selectData.forEach( (item, index)=>{
					$('#qrcode' + index).qrcode({
					    //render: "canvas", //也可以替换为table
					    render: "table",
					    width: 260,
					    height: 260,
					    //text: encodeURI( 'ies,' + item.id + ',' + item.name )
					    text: encodeURI( 'ies,' + item.id )
					});
    			});
    			
    			
    			
//				$('.qrcode').qrcode({
//				    render: "canvas", //也可以替换为table
//				    //render: "table",
//				    width: 60,
//				    height: 60,
//				    //text: encodeURI("title=送")
//				    text: encodeURI("123,送达方式")
//				});
				
				//console.log( encodeURI("title=送") );
				
    		});

    	},
    	
    	// 关闭弹窗
    	closeQrcodeView(){
    		this.$emit('input', false);
    	},
    	printQrcodeView() {
            $(".print-body").print({
            	debug: false,
            	importCSS: true,
            	printContainer: true,
            	operaSupport: true
            });
            
            //$(".print-body").printArea();
    	}
    }
    	
};
</script>

<style>
	.qrcode-view-dialog{
		width:814px;
		
	}
	.print-content{
		height:600px;
		background-color:#fff;
	}
	.print-body{
		width:794px; 
		height:1123px;
		background-color:#fff;
		/*background-color:#ddd;*/
	}
	.qrcode-view{
		padding: 32px 0 0 24px;
	}
	.qrcode-view li{
		position:relative; float:left; padding-left:70px; padding-right:5px; padding-top:10px; width:240px; height:106px; 
		background-color:#fff;
		border-radius:5px;
		margin-right:11px;
	}
	.qrcode-view li .qrcode{
		position:absolute; top:10px; left:5px; display:inline-block; width:60px; height:60px; background-color:#333;
	}
	.qrcode-view li .text{
		position:relative; word-break:break-all;
		height: 32px; line-height: 16px; padding-left:60px;
		font-size:12px; color:#333; 
	}
	.qrcode-view li .text p{
		position:absolute; left:0; top:0; width:60px; text-align:right;
	}
</style>
<style media="print">
	@page { 
   		margin:0;
   	}
</style>