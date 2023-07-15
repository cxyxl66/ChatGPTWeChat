// pages/index/index.js
const { login } = require("../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roles:[],
    activeType: '1001',
    page: 1,
    pageSize: 10,
    roleType:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // if (!app.globalData.userId) {
    //   login();
    // }
    this.loadType();
    this.loadData();
  },

  async loadType() {
    wx.showLoading({
      title: '',
    })

    let res = null;
    wx.request({
      url: app.gBaseUrl + 'role_desc/getAllType',
      success:(result)=>{
        wx.hideLoading()
        res = result.data;
        if (res.code === 200) {
          this.setData({
            roleType: res.data
          })       
        }
      }
    })
  },

  changeType: function(option) {
    var indexId = option.detail.index;
    var that = this,
        data = that.data,
        id = data.roleType[indexId].id;
    if (id !== data.activeType) {
      that.setData({
        activeType: id,
        page: 1,
        pageSize: 10,
        roles:[]
      })
      that.loadData();
    }
  
  },

  tabClick(e) {

    let role = e.currentTarget.dataset.role;
    app.globalData.role = role;
    wx.switchTab({
      url: '/pages/chat/chat',
    })
    
  },

  loadData() {
    wx.showLoading()
    let categoryId = this.data.activeType;
    wx.request({
      url: app.gBaseUrl + 'role_desc/list',
      data: {
        "categoryId": categoryId,
        "pageNum": this.data.page,
        "pageSize": this.data.pageSize,
        "postStatus": 0
      },
      method: "POST",
      success:(res)=>{
        if (res.data.code == 200 && res.data.data.list.length === 0) {
          wx.hideLoading();
          if (this.data.page == 1) {
            this.setData({
              roles: null
            });
          } else {
            wx.showToast({
              title: '没有更多了',
              icon: 'none'
            })
          }
          return
        }
        if (res.data.code == 200) {
          wx.hideLoading();
          this.setData({
            roles: this.data.roles.concat(res.data.data.list)
          })
        }
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
  onReachBottom: function() {
    this.data.page++
    this.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})