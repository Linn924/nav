<template>
    <div id="weather">
        <i :class="className" @mouseenter="showWeather = true" 
            @mouseleave="showWeather = false"></i>

        <div v-show="showWeather" @mouseenter="showWeather = true" 
            @mouseleave="showWeather = false" :style="{'backgroundImage':`url(${backgroundImage})`}">

            <header><label>{{now.city}}</label><span>简约天气</span></header>

            <main><span>{{now.wendu}}</span><span>{{now.type}}</span></main>

            <footer>
                <table>
                    <tr v-for="(item,index) in weatherList" :key="index">
                        <td align="left">{{item.date}}</td>
                        <td align="left">
                            <i :class="item.className" :style="{'color':'#2468F2','fontSize':'18px'}"></i>
                        </td>
                        <td align="center">{{item.wendu}}</td>
                        <td align="right">{{item.fengxiang}}</td>
                    </tr>
                </table>
            </footer>
        </div>

        <span @mouseenter="showWeather = true" @mouseleave="showWeather = false">{{now.wendu}}</span>
    </div>
</template>

<script>
export default {
    props:['flag'],
    data(){
        return {
            weatherList:[],//最近三天天气数据
            now:{//当天天气信息
                city:'',//当前城市
                wendu:'',//当天平均温度
                type:'',//当天天气状态
            },
            showWeather:false,//切换天气模式 显示or隐藏
        }
    },
    created(){
        this.getLoactionCity()
    },
    methods:{
        //获取当前城市名称
        async getLoactionCity(){
            const data = await this.$jsonp('https://restapi.amap.com/v3/ip?key=b30eb9c64b4094a062fa5cce3b26496e')
            this.now.city = data.city
            this.getWeather(data.city)
        },
        //根据城市获取天气信息
        async getWeather(location){
            const {data:res} = await this.$axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${location}`)
            if(res.status !== 1000) 
            return this.$message.error('获取天气数据失败')
            const value = res.data.forecast.slice(0,3)
            this.dealWeather(value)
        },
        //处理天气数据
        dealWeather(value){
            value.map((item,index) => {
                index == 0 && (item.date = '今天')
                index == 1 && (item.date = '明天')
                index == 2 && (item.date = '后天')
                item.type == '晴' && (item.className = 'el-icon-sunny')
                item.type == '多云' && (item.className = 'el-icon-cloudy')
                item.type != '晴' && item.type != '多云' && (item.className = 'el-icon-heavy-rain')
                item.wendu = item.low.split(' ')[1] + '/' + item.high.split(' ')[1]
            })
            this.weatherList = value
            let high = Number(value[0].high.split(' ')[1].split('').filter(item => item !== '℃' && item).join(''))
            this.now.wendu = high + '℃'
            this.now.type = value[0].type
        }
    },
    computed:{
        className(){
            let className = ''
            if(!this.flag){
                if(this.now.type == '晴'){
                    className = 'el-icon-sunny ' + 'backtopWhite'
                }else if(this.now.type == '多云'){
                    className = 'el-icon-cloudy ' + 'backtopWhite'
                }else{
                    className = 'el-icon-heavy-rain ' + 'backtopWhite'
                }
            }else{
                if(this.now.type == '晴'){
                    className = 'el-icon-sunny ' + 'backtopBlack'
                }else if(this.now.type == '多云'){
                    className = 'el-icon-cloudy ' + 'backtopBlack'
                }else{
                    className = 'el-icon-heavy-rain ' + 'backtopBlack'
                }
            }
            return className
        },
        backgroundImage(){
            let bgImage = ''
            if(this.now.type == '晴'){
                bgImage = 'https://s3.ax1x.com/2021/01/31/yEVgQs.png'
            }else if(this.now.type == '多云'){
                bgImage = 'https://s3.ax1x.com/2021/01/31/yEVTW4.jpg'
            }else{
                bgImage = 'https://s3.ax1x.com/2021/01/31/yEV6zj.jpg'
            }
            return bgImage
        }
    }
}
</script>

<style lang="less" scoped>
#weather{
    position: relative;
    cursor: pointer;
    >i{
        padding: 12px 12px;
        background-color: #eee;
        border-radius: 50%;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        transition: color .25s;
        margin: 10px 0;
    }
    >div{
        position: absolute;
        top: 50px;
        left: -1px;
        transform: translate(-100%,-100%);
        width: 270px;
        height: 270px;
        border-radius: 5px;
        padding: 10px 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: rgba(0,0,0, .2);
        backdrop-filter: blur(2px);
        background: no-repeat center;
        background-size: cover;
        z-index: 999;
        header{
            display: flex;
            justify-content: space-between;
            color: #fff;
            font-size: 14px;
        }
        main{
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            padding-bottom:10px ;
            span:first-child{font-size: 50px;}
            span:last-child{
                font-size: 14px;
                background-color: #2468F2;
                border-radius: 5px;
                padding: 2px 5px;
            }
            border-bottom: 1px solid #fff;
        }
        footer{
            color: #fff;
            font-size: 14px;
            td{width: 25%;}
        }
    }
    >span{
        position: absolute;
        top: 4px;
        left: 20px;
        width: 30px;
        text-align: center;
        background-color: #F1404B;
        border-radius: 8px;
        color: #fff;
        font-size: 12px;
    }
}

.backtopBlack{
    background-color: #363738!important;
    color: #AAA!important;
    &:hover{color: #fff!important;}

}
.backtopWhite{
    background-color: #fff!important;
    color: #777!important;
    &:hover{color: #000!important;}
}
</style>