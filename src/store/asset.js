const asset = {
	state: {
		// ***************资产管理***************
		assetId: '',
		assetName: '',
		// ***************资产审核***************
		auditId: '',
		// ***************资产应用***************
		applyId: '',
		// ***************版本信息***************
		versionId: '',
		
		noticePageFlag: false,
	},
	mutations: {
		// 改变assetId的值
		changeAssetId(state, value){
            state.assetId = value
        },
	}
};

export default asset;