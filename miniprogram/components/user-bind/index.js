// components/user-bind/index.js
Component({
  /**
   * 组件的属性列表
   */
  pageLifetimes: {
    show() {
      // 页面被展示
      let eduUser = wx.getStorageSync('eduUser');
      console.log(eduUser)
      if (eduUser){
        this.setData({
          username:eduUser.username,
          password:eduUser.password
        })
      }
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    username:'',
    password:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit(e){
      this.triggerEvent('submit',{
        username:e.detail.value.username,
        password: e.detail.value.password
      })
    },
  }
})
