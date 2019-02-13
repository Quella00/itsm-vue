<template>
    <div class="itsm-tabs-main">
        <div class="tabs-main">
            <div class="tabs-panel-wrap border" v-autoHeight="vv">
                <div class="panel-header">
                    <span>查询条件</span>
                </div>  

                <div class="panel-body" style="padding:40px;">
                        查询条件：
                    <el-select v-model="calendarNum" @change="changeNum" placeholder="请选择" style="margin-top: 10px;margin-bottom: 40px;" @focus="selectOnFocus">
                        <el-option key="10" label="最近10条" value="10"></el-option>
                        <el-option key="20" label="最近20条" value="20"></el-option>
                        <el-option key="50" label="最近50条" value="50"></el-option>
                    </el-select>
                    <el-table class="calendar-table" :data="calendarFlags" :span-method="spanMethod" :max-height="vv - 138">
                        <el-table-column v-for='(item, index) in calendars' :key="index" :label="item" align='center'>
                            <template slot-scope="scope">
                                <div @click="openPage(scope.row)" v-if="scope.row && scope.row.start == item" style="color: white; cursor: pointer;" :class="['step-item', 'item-color'+index % 5]">
                                    {{ scope.row.theme }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
    
    <script>
    export default {
        data() {
            const validator = this.$ies.validator;
            return {
                vv: 0,
                calendarNum: '10',
                calendarColor:['#2ac0f8','#6088ff','#9d91f8','#dc91f8','#f891c1','#91a9f8','#91a9f8','#ffbf7a'],
                calendars: [],
                calendarFlags: []
            };
        },
        mounted(){
            this.$nextTick(this.init)
        },
        methods: {
            init() {
                const self = this;

                self.getTableFun();
            },
            dateFormat(v, format) {
                v = new Date(v.replace(/-/g, '/'));
                const o = {
                    "M+": v.getMonth() + 1, //month
                    "d+": v.getDate(), //day
                    "h+": v.getHours(), //hour
                    "week": v.getDay(), //week
                    "am/pm": v.getHours(), //am/pm
                    "m+": v.getMinutes(), //minute
                    "s+": v.getSeconds(), //second
                    "q+": Math.floor((v.getMonth() + 3) / 3), //quarter
                    "S": v.getMilliseconds() //millisecond
                }
                if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (v.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (const k in o){
                    if (new RegExp("(" + k + ")").test(format)){
                        
                        let kk = '';
                        
                        k == 'week' && (kk = '0' + (o[k] == '00' && '周日' || o[k] == '01' && '周一' || o[k] == '02' && '周二' || o[k] == '03' && '周三' || o[k] == '04' && '周四' || o[k] == '05' && '周五' || o[k] == '06' && '周六'));     
                        
                        k == 'am/pm' && (kk = (o[k] <= 12 ? '0上午 ' : '00下午'));
                        
                        k != 'week' && k != 'am/pm' && (kk = '00' + o[k]);

                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : kk.substr(("" + o[k]).length));
                    }
                }

                return format;
            },
            // 求2个日期之间的所有日期
            getDiffAllDate(start, end) {
                var startTime = new Date(start);
                var endTime = new Date(end);
                var dateArr = [];
                while ((endTime.getTime() - startTime.getTime()) >= 0) {
                    var year = startTime.getFullYear();
                    var month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(),10) + 1) : (startTime.getMonth() + 1);
                    var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
                    dateArr.push(year + "-" + month + "-" + day);
                    startTime.setDate(startTime.getDate() + 1);
                }
                return dateArr;
            },
            // 求2个日期之间相差的天数
            getDiffDayDate($time1, $time2)
            {
                var time1 = arguments[0], time2 = arguments[1];
                time1 = Date.parse(time1.replace(/-/g, '/'))/1000;
                time2 = Date.parse(time2.replace(/-/g, '/'))/1000;
                var time_ = time1 - time2;
                return (time_/(3600*24));
            },
            //获取建筑表格
            getTableFun(params) {
                const self = this;

                self.$axios.post('/work/order/calendar', { recentRecordNumber: self.calendarNum }).then(res => {
                    if (res.status == 200){
                        const data = res.data ? res.data.filter(v => v.planTime) : [];
                        const planTimeData = data.map(v => v.planTime).join().split(',').map(v => Date.parse(v.replace(/-/g, '/')));
						
                        const min = Math.min.apply({}, planTimeData);
                        const max = Math.max.apply({}, planTimeData);
                        
                        let ds = [];
                        data.map(v => {
                            v.start = self.dateFormat(v.planTime.split(',')[0], 'yyyy-MM-dd');
                            v.end = self.dateFormat(v.planTime.split(',')[1], 'yyyy-MM-dd');
                            v.differ = self.getDiffDayDate(v.end, v.start) + 1;
                            return v;
                        }).forEach(v => {
                           ds.push({}, v);
                        });
                        self.calendars = self.getDiffAllDate(min, max);
                        self.calendarFlags = ds;
                    } else {
                        self.$message(res.message);
                    }
                });
            },
            spanMethod({ row, column, rowIndex, columnIndex }){
                if(row && row.start == this.calendars[columnIndex]) {
                	console.log( [1, row.differ] );
                    return [1, row.differ];
                }  
            },
            changeNum(v) {
                const self = this;
                
                self.calendarNum = v;
                self.getTableFun();
            },
            openPage(row) {
                const self = this;

                const workOrderType = (row.type == 1 && 'event') || (row.type == 2 && 'question') || (row.type == 3 && 'change') || (row.type == 4 && 'publish') || (row.type == 5 && 'spare');

                self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/workOrder/orderDatail/${workOrderType}?orderId=${row.id}&instanceId=${row.instanceId}`);
            },
            selectOnFocus(e) {
                e.target.blur();
            }
        }
    }
    </script>
    
    <style lang="less">
        .step-item.item-color0 {
            background-color:#25a4ff;
        }
        .step-item.item-color1 {
            background-color:#2ac0f8;
        }
        .step-item.item-color2 {
            background-color:#6088ff;
        }
        .step-item.item-color3 {
            background-color:#9d91f8;
        }
        .step-item.item-color4 {
            background-color:#dc91f8;
        }
        .rest-label{
            width: 70px;display: inline-block;text-align: end;
        }
    </style>


