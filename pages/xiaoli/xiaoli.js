//Page Object
Page({
    data: {
        
    },
    preview:function(){
        wx.previewImage({
            urls: ['https://image.devmeteor.cn/whs/img/xiaoli.jpg?rnd='+Math.random()],
            success: (result)=>{
                
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    },
    //options(Object)
    onLoad: function(options){
        
    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },
    onUnload: function(){

    },
    onPullDownRefresh: function(){

    },
    onReachBottom: function(){

    },
    onShareAppMessage: function(){

    },
    onPageScroll: function(){

    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    }
});