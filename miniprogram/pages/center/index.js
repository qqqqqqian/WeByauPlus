// miniprogram/pages/center/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBind:false
  },
  oneduTap:function(event){
    wx.navigateTo({
      url: '../edubind/index',
    })
  },
  onCanceTap:function(){
    wx.removeStorageSync('JSESSIONID');
    // wx.removeStorageSync('eduUser');
    wx.removeStorageSync('weeks');
    wx.removeStorageSync('oShedule');
    wx.removeStorageSync('terms');
    wx.removeStorageSync('oScore');
    this.setData({
      isBind: !this.data.isBind
    })
    wx.showToast({
      title: '取消成功',
      icon: 'none',
      duration: 2000,
    })
}
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      isBind: wx.getStorageSync('JSESSIONID') ? true : false
    })
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