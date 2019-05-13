// miniprogram/pages/classSchedule/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let StorageWeeks = wx.getStorageSync('weeks');
    if (StorageWeeks && StorageWeeks.result) {
      this.setData({
        weeks: StorageWeeks
      })
    } else {
      wx.cloud.callFunction({
        name: 'getWEEKS',
        data: {
          cookie: wx.getStorageSync('JSESSIONID')
        }
      }).then(res => {
        let oRes = JSON.parse(res.result);
        if (!oRes.errorMsg){
          console.log(res)
          wx.setStorageSync('weeks', oRes);
          this.setData({
            weeks: wx.getStorageSync('weeks')
          })
        }else{
          wx.showToast({
            title: '绑定信息失效，请重新绑定~',
            icon:'none',
            duration:2000
          })
        }
      })
    }

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