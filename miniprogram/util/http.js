
class HTTP{
  request(params){
    if(!params.method)
      params.method='GET'
    wx.request({
      url: params.url,
      method:params.method,
      data:params.data,
      header:{
        'content-type':'application/json' 
      },
      success:(res)=>{
        let statusCode = res.statusCode.toString()
        if(statusCode.startsWith('2')){
          params.success(res.data)
        }
        else{
          wx.showToast({
            title: '错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail:(err)=>{
        wx.showToast({
          title: '错误',
          icon: 'none',
          duration: 2000
        })
      }
    })

  }
}

export {HTTP}