//echart饼状图（资产分类统计）
function echartPie(myId, myData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);
	
	var data = [];
	var legendData = [];
	for(var i = 0; i < myData.length; i++) {
		data.push({
			name: myData[i].name,
			value: myData[i].value,
			itemStyle: {
				normal: {
					color: myDataColor[i%5]
				}
			}	
		});
		legendData.push( myData[i].name );
	};
	
	var app = {};
	option = null;
	
	option = {
	    tooltip : {
	        trigger: 'item',
	        formatter: function(item){
	        	return item.name + "(" + item.value + ")<br/>所占百分比：" + item.percent + '%' ;
	        }
	    },
	    legend: {
	    	type: 'scroll',
	    	align: 'left',
	        orient: 'vertical',
	        
	        // 文字的位置
	        right: 10,
	        top: 10,
	        bottom: 70,
	        
	        // 文字的样式设置
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 14,
	        	color: '#7e7e7e',
	        },
	        
	        pageIconColor: '#57a9fd',
	        pageIconInactiveColor: '#7e7e7e',
	        pageIconSize: 12,
	        
	        // 文字超出长度的处理
			formatter: function (name) {
				if(name.length > 5) {
					name = name.substring(0,5) + '...';
				}
			    return name;
			},
		    tooltip: {
		        show: true
		    },

	        data: legendData
	    },
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius : '70%',
	            center: ['40%', '50%'],
	            
	            label: {
	            	normal: {
						formatter: function (item) {
							if(item.data.name.length > 5) {
								item = item.data.name.substring(0,5) + '...';
							}else{
								item = item.data.name;
							}
						    return item;
						}
	            	}
	            },
	            data: data,

	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 0,
	                    shadowOffsetX: 0,
	                }
	            }
	        }
	    ]
	};
	
	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};

//echart柱状图（运维支持能力）
function echartBar(myId, myData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);
	
	var data1 = myData[0];
	var data2 = myData[1];
	var dataColor1 = myDataColor[0];
	var dataColor2 = myDataColor[1];
	
	var app = {};
	option = null;
	
	option = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    grid: {
	    	top: 20,
	        left: '10%',
	        right: '5%',
	        //bottom: '3%'
	    },
	    legend: {
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 14,
	        	color: '#7e7e7e',
	        },
	        
	    	bottom: 'bottom',
	        data:['生成工单','解决工单']
	    },
	    xAxis: [
	        {
	        	axisLine: {
	        		show: false,
	        	},
	        	axisTick: {
	        		show: false,
	        	},
	        	axisLabel: {
	        		color: '#666'
	        	},
	        	
	            data: ['一级（高）','二级（高）','三级（中）','四级（低）','五级（极低）'],
	            axisPointer: {
	                type: 'shadow'
	            }
	        }
	    ],
	    yAxis: [
	        {
	        	name: '工单数量（个）',
	        	nameLocation: 'middle',
	        	nameTextStyle: {
	        		verticalAlign: 'middle',
	        		color: '#999'
	        		
	        	},
	        	nameRotate: 90,
	        	nameGap: 30,
	        	
	        	axisLine: {
	        		show: false,
	        	},
	        	axisTick: {
	        		show: false,
	        	},
	        	axisLabel: {
	        		color: '#999'
	        	},
	        	splitLine: {
	        		lineStyle: {
	        			type: 'dashed',
	        			color: '#ebebeb'
	        		}
	        	},
	        	
	            type: 'value',
	            min: 0,
	            axisLabel: {
	            	color: '#999',
	                formatter: '{value}'
	            }
	        }
	    ],
	    series: [
	        {
	        	itemStyle: {
	        		normal: {
	        			barBorderRadius: [3, 3, 0, 0],
	        			color: dataColor1
	        		}
	        	},
	        	
	        	barMinHeight: 2,
	            name:'生成工单',
	            type:'bar',
	            barWidth: '25%',
	            data:data1
	        },
	        {
	        	itemStyle: {
	        		normal: {
	        			barBorderRadius: [3, 3, 0, 0],
	        			color: dataColor2
	        		}
	        	},
	        	
	        	barMinHeight: 2,
	            name:'解决工单',
	            type:'bar',
	            barWidth: '25%',
	            data:data2
	        }
	    ]
	};
	
	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};


//echart堆叠柱状图（工单类型统计）
function echartStackBar2(myId, myData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);
	
	var data1 = myData[0];
	var data2 = myData[1];
	var dataColor1 = myDataColor[0];
	var dataColor2 = myDataColor[1];
	
	var app = {};
	option = null;
	
	option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {           
	            type : 'shadow'       
	        }
	    },
	    legend: {
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 14,
	        	color: '#7e7e7e',
	        },
	    	bottom: 'bottom',
	        data:['未超时','已超时']
	    },
	    grid: {
	    	top: 20,
	        left: '10%',
	        right: '5%',
	        //bottom: '3%'
	    },
	    xAxis : [
	        {
	        	axisLine: {
	        		show: false,
	        	},
	        	axisTick: {
	        		show: false,
	        	},
	        	axisLabel: {
	        		color: '#666'
	        	},
	        	
	            type : 'category',
	            data : ['事件','问题','变更','发布','备件']
	        }
	    ],
	    yAxis : [
	        {
	        	name: '工单数量（个）',
	        	nameLocation: 'middle',
	        	nameTextStyle: {
	        		verticalAlign: 'middle',
	        		color: '#999'
	        		
	        	},
	        	nameRotate: 90,
	        	nameGap: 30,
	        	
	        	axisLine: {
	        		show: false,
	        	},
	        	axisTick: {
	        		show: false,
	        	},
	        	axisLabel: {
	        		color: '#999'
	        	},
	        	splitLine: {
	        		lineStyle: {
	        			type: 'dashed',
	        			color: '#ebebeb'
	        		}
	        	},
	        	
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	        	itemStyle: {
	        		normal: {
						color: dataColor1
	        		}
	        	},
	        	
	        	barMinHeight: 2,
	            name:'未超时',
	            type:'bar',
	            barWidth: '40%',
	            stack: '同类目',
	            data: data1
	        },
	        {
	        	itemStyle: {
	        		normal: {
	        			barBorderRadius: [3, 3, 0, 0],
	        			color: dataColor2
	        		}
	        	},
	        	
	        	barMinHeight: 2,
	            name:'已超时',
	            type:'bar',
	            barWidth: '40%',
	            stack: '同类目',
	            data:data2
	        }
	    ]
	};
	
	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};



//echart线条图（绩效管理->报表统计）
function echartLine(myId, xAxisData, yAxisData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);

	var myDataColorLength = myDataColor.length;
	
//	var legendData = yAxisData.map((item)=>{
//		return item.name
//	});
	var legendData = yAxisData.map( function(item){
		return item.name
	});
	
	
	
	//console.log( legendData );
	
	var legendSelectedData = {};
	
//	legendData.slice(10).map((item)=>{
//		legendSelectedData[item] = false;
//	});
	legendData.slice(10).map(function(item){
		legendSelectedData[item] = false;
	});
	
	
	//console.log( legendSelectedData );
	
	var seriesData = yAxisData.map( function(item, index){
		return {
        	itemStyle: {
        		normal: {
        			color: myDataColor[index % myDataColorLength]
        		}
        	},
			name: item.name,
			type: 'line',
			smooth: true,
			//stack: '总量',
			data: item.data
		}
	});
	//console.log(seriesData);
	
	var app = {};
	option = null;
	
	option = {
	    tooltip: {
	        trigger: 'axis',
//	        axisPointer: {
//	            type: 'cross'
//	        }
	   },
	    legend: {
	        
	        type: 'scroll',
	        bottom: 10,
	        
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 12,
	        	color: '#7e7e7e',
	        },
	        
	        data: legendData,
//	        data:[
//	        '组织1','组织2','组织3','组织4','组织5',
//	        '组织6','组织7','组织8','组织9','组织10',
//	        '组织11','组织12','组织13','组织14','组织15'
//	        ],
			selected: legendSelectedData,
//	        selected: {
//			    '组织1': false,
//			    '组织2': false
//			}

//	        data: (function (){
//	            var list = [];
//	            for (var i = 1; i <=28; i++) {
//	                list.push(i + 2000 + '');
//	            }
//	            return list;
//	        })()


	        
	   },
	    grid: {
	    	top: 50,
	        left: '2%',
	        right: '2%',
	        bottom: 60,
	        containLabel: true
	    },
		
	    xAxis: {
        	axisLine: {
        		lineStyle: {
        			color: '#ccc'
        		}
        	},
        	axisTick: {
        		show: false,
        	},
        	axisLabel: {
        		color: '#666'
        	},
	    	
	        type: 'category',
	        boundaryGap : false,
	        //data: ['03月01日','03月02日','03月03日','03月04日','03月05日','03月06日','03月07日'],
	        data: xAxisData
	    },
	    yAxis: {
        	axisLine: {
        		lineStyle: {
        			color: '#ccc'
        		}
        	},
        	axisTick: {
        		show: false,
        	},
        	axisLabel: {
        		color: '#999'
        	},
        	splitLine: {
        		lineStyle: {
        			type: 'dashed',
        			color: '#ebebeb'
        		}
        	},
	    	
	        type: 'value'
	    },
	    series: seriesData
	};

	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};



//echart线条图（绩效管理->满意度报表）
function echartLine02(myId, xAxisData, yAxisData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);

	var myDataColorLength = myDataColor.length;
	
	var legendData = yAxisData.map( function(item){
		return item.name
	});
	console.log( legendData );
	
	var legendSelectedData = {};
	legendData.slice(10).map( function(item){
		legendSelectedData[item] = false;
	});
	console.log( legendSelectedData );
	
	var seriesData = yAxisData.map( function(item, index){
		return {
        	itemStyle: {
        		normal: {
        			color: myDataColor[index % myDataColorLength]
        		}
        	},
			name: item.name,
			type: 'line',
			smooth: true,
			//stack: '总量',
			data: item.data
		}
	});
	console.log(seriesData);
	
	var app = {};
	option = null;
	
	option = {
	    tooltip: {
	        trigger: 'axis',
	        formatter: function(item){
	        	return item[0].axisValue + '<br/>' + item[0].marker + item[0].seriesName + '：' + item[0].value + '%';
	        }
	   	},
	    legend: {
	        
	        type: 'scroll',
	        bottom: 10,
	        
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 12,
	        	color: '#7e7e7e',
	        },
	        
	        data: legendData,
			selected: legendSelectedData,
	        
	   },
	    grid: {
	    	top: 50,
	        left: '2%',
	        right: '2%',
	        bottom: 60,
	        containLabel: true
	    },
		
	    xAxis: {
        	axisLine: {
        		lineStyle: {
        			color: '#ccc'
        		}
        	},
        	axisTick: {
        		show: false,
        	},
        	axisLabel: {
        		color: '#666'
        	},
	    	
	        type: 'category',
	        boundaryGap : false,
	        data: xAxisData
	    },
	    yAxis: {
        	axisLine: {
        		lineStyle: {
        			color: '#ccc'
        		}
        	},
        	axisTick: {
        		show: false,
        	},
        	axisLabel: {
        		color: '#999',
        		formatter: '{value}%'
        	},
        	
        	splitLine: {
        		lineStyle: {
        			type: 'dashed',
        			color: '#ebebeb'
        		}
        	},
	        type: 'value',
	        max: 100
	    },
	    series: seriesData
	};

	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};


//echart堆叠区域线图（绩效管理->报表统计）
function echartStackLine(myId, xAxisData, yAxisData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);

	var myDataColorLength = myDataColor.length;
	
	var legendData = yAxisData.map( function(item){
		return item.name
	});
	console.log( legendData );
	
	var legendSelectedData = {};
	legendData.slice(10).map( function(item){
		legendSelectedData[item] = false;
	});
	console.log( legendSelectedData );
	
	var seriesData = yAxisData.map( function(item, index){
		return {
        	itemStyle: {
        		normal: {
        			color: myDataColor[index % myDataColorLength]
        		}
        	},
			name: item.name,
			type: 'line',
			smooth: true,
			//stack: '总量',
			areaStyle: {normal: {}},
			data: item.data
		}
	});
	console.log(seriesData);
	
	var app = {};
	option = null;
	
	option = {
	    tooltip: {
	        trigger: 'axis',
//	        axisPointer: {
//	            type: 'cross'
//	        }
	   },
	    legend: {
	        
	        type: 'scroll',
	        bottom: 10,
	        
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 12,
	        	color: '#7e7e7e',
	        },
	        
	        data: legendData,
//	        data:[
//	        '资产1','资产2','资产3','资产4','资产5'
//	        ],
			selected: legendSelectedData
//	        selected: {
//			    '资产1': true,
//			    '资产2': true
//			}

//	        data: (function (){
//	            var list = [];
//	            for (var i = 1; i <=28; i++) {
//	                list.push(i + 2000 + '');
//	            }
//	            return list;
//	        })()
	        
	   },
	    grid: {
	    	top: 50,
	        left: '2%',
	        right: '2%',
	        bottom: 60,
	        containLabel: true
	    },
		
	    xAxis: {
        	axisLine: {
        		lineStyle: {
        			color: '#ccc'
        		}
        	},
        	axisTick: {
        		show: false,
        	},
        	axisLabel: {
        		color: '#666'
        	},
	    	
	        type: 'category',
	        boundaryGap : false,
	        data: xAxisData
	        //data: ['03月01日','03月02日','03月03日','03月04日','03月05日','03月06日','03月07日']
	    },
	    yAxis: {
        	axisLine: {
        		lineStyle: {
        			color: '#ccc'
        		}
        	},
        	axisTick: {
        		show: false,
        	},
        	axisLabel: {
        		color: '#999'
        	},
        	splitLine: {
        		lineStyle: {
        			type: 'dashed',
        			color: '#ebebeb'
        		}
        	},
	    	
	        type: 'value'
	    },
	    series: seriesData
	    
//	    [
//      {
//          name:'资产1',
//          type:'line',
////          smooth: true,
//          stack: '总量',
//          areaStyle: {normal: {}},
//          data:[120, 132, 101, 134, 90, 230, 210]
//      },
//      {
//          name:'资产2',
//          type:'line',
////          smooth: true,
//          stack: '总量',
//          areaStyle: {normal: {}},
//          data:[220, 182, 191, 234, 290, 330, 310]
//      },
//      {
//          name:'资产3',
//          type:'line',
////          smooth: true,
//          stack: '总量',
//          areaStyle: {normal: {}},
//          data:[150, 232, 201, 154, 190, 330, 410]
//      },
//      {
//          name:'资产4',
//          type:'line',
////          smooth: true,
//          stack: '总量',
//          areaStyle: {normal: {}},
//          data:[320, 332, 301, 334, 390, 330, 320]
//      },
//      {
//          name:'资产5',
//          type:'line',
////          smooth: true,
//          stack: '总量',
//          areaStyle: {normal: {}},
//          data:[820, 932, 901, 934, 1290, 1330, 1320]
//      }
//	    ]
	    
	};

	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};

//echart堆叠区域线图（绩效管理->报表统计）
function echartStackBar(myId, xAxisData, yAxisData, myDataColor){
	var dom = document.getElementById(myId);
	var myChart = echarts.init(dom);

	
	var myDataColorLength = myDataColor.length;	
	var legendData = yAxisData.map( function(item){
		return item.name
	});
	console.log( legendData );

	var seriesData = yAxisData.map( function(item, index){
		return {
        	itemStyle: {
        		normal: {
        			color: myDataColor[index % myDataColorLength]
        		}
        	},
			name: item.name,
			type: 'bar',

			data: item.data,
			animationDelay: function (idx) {
				return idx * 10;
			}
		}
	});
	console.log(seriesData);
	
	var app = {};
	option = null;
	
	option = {
	    tooltip: {
	        trigger: 'axis',
//	        axisPointer: {
//	            type: 'cross'
//	        }
	   },
	    legend: {
	        
	        type: 'scroll',
	        bottom: 10,
	        
	        itemWidth: 15,
	        itemHeight: 15,
	        icon: 'rect',
	        textStyle: {
	        	fontSize: 12,
	        	color: '#7e7e7e',
	        },
	        
	        data: legendData,
	    },
	    grid: {
	    	top: 50,
	        left: '2%',
	        right: '2%',
	        bottom: 60,
	        containLabel: true
	    },
	    xAxis: {
	    	axisLine: {
	    		lineStyle: {
	    			color: '#ccc'
	    		}
	    	},
	    	axisTick: {
	    		show: false,
	    	},
	    	axisLabel: {
	    		color: '#666'
	    	},
	    	
	    	
	        data: xAxisData,
	        silent: false,
	        splitLine: {
	            show: false
	        }
	    },
	    yAxis: {
	    	axisLine: {
	    		lineStyle: {
	    			color: '#ccc'
	    		}
	    	},
	    	axisTick: {
	    		show: false,
	    	},
	    	axisLabel: {
	    		color: '#999'
	    	},
	    	splitLine: {
	    		lineStyle: {
	    			type: 'dashed',
	    			color: '#ebebeb'
	    		}
	    	},
	    },
	    series: seriesData,
	    animationEasing: 'elasticOut',
	    animationDelayUpdate: function (idx) {
	        return idx * 5;
	    }
		
	};

	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
};