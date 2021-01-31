<template>
    <div id="search">
        <nav id="navTop">
            <li v-for="item in navTop" :key="item.id" 
                :class="item.id == 0 ? 'currentLi':''" @click="switchUl(item.id)">
                {{item.title}}
            </li>
        </nav>

        <div class="line"></div>

        <div class="search">
            <input type="text" :placeholder="value" ref="input" 
                v-model="searchValue" @keyup.enter="search">
            <button @click="search"><i class="el-icon-search"></i></button>
        </div>

        <nav id="navBottom" v-for="(father,fId) in navBottom" :key="fId" 
            v-show="fId == searchIndex">
            <li v-for="(son,sId) in father.children" :key="sId" 
                :class="son.id == 0 ? 'currentLi':''" @click="switchLi(son.id,son.path)">
                {{son.title}}
            </li>
        </nav>
    </div>
</template>

<script>
export default {
    data(){
        return {
            navTop:[
                {id:0,title:'搜索'},
                {id:1,title:'网盘'},
                {id:2,title:'软件'},
                {id:3,title:'书籍'},
                {id:4,title:'菜谱'}
            ],
            navBottom:[
                {
                    children:[
                        {id:0,title:'百度',path:'https://www.baidu.com/s?wd='},
                        {id:1,title:'Google',path:'http://www.google.com/search?q='},
                        {id:2,title:'秘迹',path:'https://www.mijisou.com/?q='},
                        {id:3,title:'多吉',path:'https://www.dogedoge.com/results?q='},
                        {id:4,title:'Magi',path:'https://magi.com/search?q='},
                        {id:5,title:'Bing',path:'https://cn.bing.com/search?q='}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'云盘精灵',path:'https://www.yunpanjingling.com/search/'},
                        {id:1,title:'大力盘',path:'https://www.dalipan.com/search?keyword='},
                        {id:2,title:'如风搜',path:'http://www.rufengso.net/s/name/'},
                        {id:3,title:'小可搜搜',path:'https://www.xiaokesoso.com/s/search?q='},
                        {id:4,title:'小昭来了',path:'https://www.xiaozhaolaila.com/s/search?q='},
                        {id:5,title:'史莱姆',path:'http://www.slimego.cn/search.html?q='}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'胡萝卜周',path:'http://www.carrotchou.blog/?s='},
                        {id:1,title:'ZD423',path:'https://www.zdfans.com/search.asp?keyword='},
                        {id:2,title:'机锋论坛',path:'http://bbs.gfan.com/search?q='},
                        {id:3,title:'果壳剥壳',path:'https://www.ghpym.com/?s='}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'i-BOOK',path:'https://book.tstrs.me/find?q='},
                        {id:1,title:'熊猫搜书',path:'https://ebook.huzerui.com/#/result?keyword='},
                        {id:2,title:'LoreFree',path:'https://ebook2.lorefree.com/site/index?s='},
                        {id:3,title:'SoBook',path:'https://sobooks.cc/search/'}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'下厨房',path:'http://www.xiachufang.com/search/?keyword='},
                        {id:1,title:'香哈菜谱',path:'https://www.xiangha.com/so/?q=caipu&s='}
                    ]    
                },
                
            ],
            searchIndex:0,//当前指向navTop的下标
            value:'百度',//搜索框中的提示信息
            searchValue:'',//用户输入的内容
            searchUrl:'https://www.baidu.com/s?wd=',//初始搜索框的地址值
        }
    },
    mounted() {
        this.$refs.input.focus()
    },
    methods:{
        //点击切换navTop的值
        switchUl(index){
            var lis = document.querySelectorAll('#navTop>li')
            var uls = document.querySelectorAll('#navBottom')
            var line = document.querySelector('.line')
            this.removeClass(lis,index)
            line.style.marginLeft = -273 + 136 * index + 'px'
            this.searchIndex = index
            this.value = uls[index].children[0].innerHTML
            this.navBottom.some( (item,i) => {
                if(i == index){
                    this.switchLi(0,item.children[0].path)//重置回最初始的状态
                    return true
                }
            })
            this.$refs.input.focus()
        },
        //点击切换navGBottom的li
        switchLi(index,path){
            var lis = document.querySelectorAll('#navBottom')[this.searchIndex].children
            this.removeClass(lis,index)
            this.value = lis[index].innerHTML
            this.searchUrl = path
            this.$refs.input.focus()
        },
        //搜索
        search(){
            if((this.searchValue.trim()) == '') 
            return this.$message({type:'error',duration:1000,message:'请输入内容'})
            window.open(this.searchUrl + this.searchValue)
            this.searchValue = ''
        },
        //清除样式
        removeClass(dom,i){
            dom.forEach( item => item.classList.remove('currentLi'))
            dom[i].className = 'currentLi'
        }
    }
}
</script>

<style lang="less" scoped>
#search{
    height: 450px;
    background-color: rgb(7,7,27);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    nav{
        list-style: none;
        display: flex;
        li{
            margin-right: 40px;
            color: #84848E;
            font-size: 14px;
            cursor: pointer;
            transition: color .4s;
            &:hover{color: #fff;}
            &:last-child{margin-right: 0;}
        }
    }
    .line{
        width: 32px;
        height: 4px;
        transition: all .4s;
        margin-left: -273px;
        border-radius: 2px;
        background-color: #fff;
    }
    .search{
        display: flex;
        justify-content: center;
        margin: 20px 0;
        position: relative;
        input{
            width: 800px;
            height: 50px;
            border: 0;
            border-radius: 25px;
            background-color: #000;
            color: #fff;
            padding-left: 20px;
            margin: 0 auto;
            &:focus{outline: none;}
            &::placeholder{font-size: 16px;}
        }
        button{
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background-color: #000;
            border: 0;
            cursor: pointer;
            i{color: #fff;font-size: 20px;}
            &:focus{outline: none;}
        }
    } 
}
@media screen and (min-width: 760px) and (max-width: 960px) {
    .search input{
        width: 600px!important;
    }
}
@media screen and (max-width: 760px) {
    .search input{
        width: 500px!important;
    }
}
@media screen and (max-width: 600px) { 
    #search{
        height: 7.5vh!important;
    }
    #search nav,#search .line,#search .search{
        display: none!important;
    }
}
</style>