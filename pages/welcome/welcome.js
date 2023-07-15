const { login } = require("../../utils/util")

// pages/welcome/welcome.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onTap:function(params) {
    wx.switchTab({
      url:"/pages/index/index"
    })
  },

  onViewTap:function(params) {
    console.log("on tap View")
  },

  onTextTap:function (params) {
    console.log("on tap Text")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.userId) {
      login();
    }
    setTimeout(function () {
      wx.switchTab({
        url:"/pages/index/index"
      })
    }, 2000)
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