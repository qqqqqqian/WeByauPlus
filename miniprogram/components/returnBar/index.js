// components/returnBar/index.js
let app = getApp();
Component({

  lifetimes:{
    attached(){
      this.setData({
        capsule:app.globalData.capsule*2+'rpx',
        statusbar: app.globalData.statusbar*2+'rpx'
      })
    }
  }
  /**
   * 组件的属性列表
   */
,
  properties: {
    name:{
      type:String,
      value:'',
      observer(newVal) {
        console.log(newVal);
      }
    },
    returnSwitch:{
      type:Boolean,
      value:true,
      observer(newVal){
        console.log(newVal);
      }

    }

  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onreturn(){
      if (this.data.returnSwitch){
      console.log(getCurrentPages());
      let pages = getCurrentPages();
      wx.navigateBack({
        delta: pages[pages.length - 2]
      })
    }
    }
  }
})
