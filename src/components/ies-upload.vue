<template>
	<div class="ies-upload">
		<div class="upload-content">
	        <form id="ajaxForm" enctype="multipart/form-data" class="upload-form">
	            <input type="file" :name="name" class="input-file" @click="handlerBeforeChange($event)" @change="handlerChange($event)" />
	        </form>
			<!--<button id="btnButton" type="button" @click="submit">最终提交</button>-->
			<div class="input-body">
				<slot></slot>
			</div>
		</div>
		<div class="upload-list">
			<!--<ul>
				<li class="upload-list-item" v-for="item in fileList">
					<a class="item-name" href="javascript:;" @click="handlerPreview(item)">{{ item.name }}</a>
					<i class="item-remove" @click="handlerRemove(item)">×</i>
				</li>
			</ul>-->
			
			
			
			
			<ul class="el-upload-list el-upload-list--text">
				<li class="el-upload-list__item is-success" v-for="item in fileList">
					<a class="el-upload-list__item-name" href="javascript:;" @click="handlerPreview(item)">
						<i class="el-icon-document"></i>{{ item.name }}
					</a>
					<label class="el-upload-list__item-status-label">
						<i class="el-icon-upload-success el-icon-circle-check"></i>
					</label>
					<i class="el-icon-close" @click="handlerRemove(item)"></i>
					<!--<i class="el-icon-close-tip">按 delete 键可删除</i>-->
				</li>
			</ul>
			
			
			
			
			
			
		</div>
	</div>
	
	
	<!--<div class="my-upload">
		<input type="file" :name="name" class="input-file" id="my-upload" @change="addFile($event)" :multiple="multiple" />
		<div class="input-body">
			<slot></slot>
		</div>
	</div>-->
	
	
</template>

<script>
	export default {
		data() {
			return {
				file: ''
			}
		},
		props: {
			
			
			
			
//			name: String,
//			action: {
//				type: String,
//				required: true
//			},
//			fileList: {
//				type: Array,
//				default: []
//			},
//			headers: Object,
//			data: Object,
//			multiple: Boolean,
//			limit: Number,
//			onChange: Function,
//			onBefore: Function,
//			onProgress: Function,
//			onSuccess: Function,
//			onFailed: Function,
//			onFinished: Function
			
			name: String,
			action: {
				type: String,
				required: true
			},
			fileList: {
				type: Array,
				default: []
			},
			headers: Object,
			data: Object,
			
			beforeUpload: Function,
			onChange: Function,
			onSuccess: Function,
			onError: Function,
			autoUpload: {
				type: Boolean,
				default: true
			},
			
			limit: Number,
			onExceed: Function,
			
			onPreview: Function,
			onRemove: Function
		},
		mounted() {
			this.$nextTick(() => {
				//init();
			});
		},
		methods: {
			handlerBeforeChange(event) {
				var self = this;
				console.log( self.limit );
				
				if( self.limit && self.limit <= self.fileList.length ){
					//alert('最多上传'+ self.limit +'个');
					this.onExceed && this.onExceed();
					event.preventDefault();
				}
			},
			handlerChange(event) {
				var self = this;
				console.log('handlerChange');
				//console.log( event.target.value.length );
				
				if( event.target.value.length == 0){
					self.file = {};
				}else if( event.target.files && event.target.files[0] ){  // ie9以上
					self.file = event.target.files[0];
				}else{
					var index = event.target.value.lastIndexOf('\\'); // ie9
					self.file = {
						name: event.target.value.substring(index + 1),
					};
				}
				//console.log( self.file );
				this.onChange( self.file, self.fileList );
				this.autoUpload && this.submit();
			},
			
			
			handlerPreview(file){
				this.onPreview( file );
			},
			handlerRemove(file){
				var self = this;
				var index = self.fileList.indexOf( file );
				var fileList = self.fileList.splice(index, 1);
				this.onRemove( file, fileList );
			},

			submit() {
				var self = this;
				var newData;
				if( self.headers ){
					if( self.data) {
						newData = Object.assign(self.data, self.headers);
					}else{
						newData = self.headers
					}
				}else{
					newData = self.data
				};
				
				var options = {
					type: 'post',
					//dataType : 'json',
					//dataType : 'text',
					url: self.action,
					headers : self.headers,
					data: newData,
					
					//url: "/api/itsm/servicelevel/uc/importUcByExcel",
					//url: "/upapi/uev/banner/uploadImage",
					//url: "indexAjax.aspx",

					beforeSubmit: function(){
						return self.beforeUpload( self.file );
					},
					success: function(data) {
						console.log('成功');
//						console.log(data);

						self.fileList.push( data.data );
						self.onSuccess(data, self.file, self.fileList);
					},
					error: function(data) {
						console.log('错误');
//						console.log(data);
						self.onError(data, self.file, self.fileList)
					},
					// clearForm: true,              // 成功提交后，清除所有表单元素的值
					resetForm: true,              // 成功提交后，重置所有表单元素的值
					timeout: 60000                // 限制请求的时间，当请求大于3秒后，跳出请求
				};
				$('#ajaxForm').ajaxSubmit( options );
				return false;
				
			}
			
			
			
			
			
			
		}
	}




</script>

<style>
	.ies-upload {
		display: inline-block;
	}
	
	.ies-upload .upload-content{
		position: relative;
		display:inline-block;
		height: 30px;
	}
	
	.ies-upload .upload-form {
		width: 100%;
		height: 100%;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}
	
	.ies-upload .input-file {
		display: block;
		width: 100%;
		height: 100%;
		cursor:pointer;
	}
	
	.ies-upload .input-body {
		width: 100%;
		height: 100%;
		position:relative;
		z-index: 9;
	}
	.ies-upload .item-remove{
		display:inline-block;
		width:16px;
		height:16px;
		line-height:16px;
		border-radius:50%;
		font-size:14px;
		color:#fff;
		text-align:center;
		background-color:#ccc;
	}
	.ies-upload .item-remove:hover{
		background-color:#666;
	}
</style>