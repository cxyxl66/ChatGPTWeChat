// pages/user.js
const app = getApp()
const { login } = require("../../utils/util")
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userId:'',
    integral: 0,

  },
  clickAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  clickIntegral() {
    wx.navigateTo({
      url: '/pages/integral/integral',
    })
  },

  addIntegral() {
    wx.navigateTo({
      url: '/pages/create-integral/create-integral',
    })
  },

  onLoad: function (options) {
    if (!app.globalData.userId) {
      login();
    }
    this.setData({
      userId: app.globalData.userId
    })
  },

  onShow: function () {
    console.log("user show")
    if (this.data.userId == '') {
      this.setData({
        userId: app.globalData.userId
      })
    }
    wx.request({
      url: app.gBaseUrl + 'integral/sub',
      data: {
        userId: this.data.userId,
        integral: 0
      },
      success:(result) => {
        if (result.data.code === 200) {
          this.setData({
            integral: result.data.data
          })
        } 
      }
    })
  },

})
