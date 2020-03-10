// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    orderListArr: [],
    focus: false,
    inputValue:'',
    orderList:[]

  },
  bindButtonTap:function() {
    this.setData({
      focus: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 计算中间高度
    var height = wx.getSystemInfoSync().windowHeight - 66 - 50;

    // 发送请求数据
    wx.request({
      url:'https://localhost:3001/data/list.json',
      success: (res)  => {
        var data = res.data.data;
        for (var i = 0; i < data.length;i++) {
          for (var j = 0; j < data[i].data.length;j++){
            data[i].data[j].num = +data[i].data[j].num;
          }
        }
        this.setData({
          list: res.data.data,
          height: height
        })


      }
    })

  },
  chooseCategory: function(e) {
    this.setData({
      target:e.currentTarget.dataset.target
    })
  },
  plus: function(e) {
    // 获取数组 装载用户所选餐品信息
    var orderListArr = this.data.orderListArr;
    // 获取组件上的自定义数据
    var obj = e.currentTarget.dataset;
    // 定义变量接收id
    var categoryID = obj.category;
    // 定义变量 接收餐品id
    var productid = obj.productid;
    // 根据id找到具体分类信息
    var categoryObj = this.data.list.find(function(value,index){
      return value.id === categoryID;
    })
    // 根据id分类的数组中查询该餐品信息
    var productObj  =categoryObj.data.find(function(value){
      return value.id === productid;
    })
    // 判断是否购买过该商品
    var hasOrdered = orderListArr.some(function(value) {
      return value.id === productid;
    });
    if (hasOrdered) {
      orderListArr.find(function(value){
        return value.id === productid;
      }).num += 1;
    } else {
      productObj.num++;
      orderListArr.push(productObj)
    }
    console.log(orderListArr);
    // 计算总价格
    var amount = 0;
    orderListArr.forEach(function(value) {
      amount += value.price * value.num
    })
    // 重置list数据保证一致
    this.setData({
      list: this.data.list,
      amount: amount
    })
      },
      minus: function(e) {
        // 获取数组 装载用户所选餐品信息
        var orderListArr = this.data.orderListArr;
        // 获取组件上的自定义数据
        var obj = e.currentTarget.dataset;
        // 定义变量 接收分类
        var categoryID = obj.category;
        // 定义变量 接收餐品id
        var productid = obj.productid;
        // 根据分类id找到具体分类信息
        var categoryObj = this.data.list.find(function(value,index) {
          return value.id === categoryID;
        })
        // 根据id去该分类的数组中查询该商品的信息
        var productObj = categoryObj.data.find(function(value) {
          return  value.id === productid;
        })
        // 确定餐品信息 定单减1
        orderListArr.find(function(value) {
          return value.id === productid;
        }).num -= 1;
        // 计算总价格
        var amount = 0;
        orderListArr.forEach(function(value) {
          amount += value.price * value.num
        })
        // 重新设置list保持数据一致
        this.setData({
          list: this.data.list,
          amount: amount
        })

      },
      ok: function() {
        // 当用户点击当前按钮时 用户已经选择完毕
        if (this.data.amount === 0) {
          return;
        }
        // 将数据存储到本地对象
        wx.setStorage({
          key: 'orderList',
          data: this.data.orderListArr.filter(function(value) {
            return value.num != 0
          }),
          success: function(){
            // 跳转配送页面
            wx.navigateTo({
              url:"/pages/deliver/deliver"
            })
          }
        })
      },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})