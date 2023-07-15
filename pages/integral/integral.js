// pages/integral/integral.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixin: "https://www.jingyoushui.cn/image/42e20ccc-d334-4fba-92f3-e31d67e32cc9.jpeg",
    userId: '',
    integral: ''

  },

  clickImg: function(e){
    var imgUrl = this.data.weixin;
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userId: app.globalData.userId
    })
  },
  onchange(e) {
    this.setData({
      integral : e.detail
    })
  },

  exchange() {
    wx.request({
      url: app.gBaseUrl + 'integral/change',
      data: {
        userId: this.data.userId,
        integralId: this.data.integral
      },
      method: 'POST',
      success:(res)=>{
          wx.showModal({  
            title: '提示',  
            content: res.data.msg,
          })
      }
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})