

class HTTP{
    request({url,data={},method='GET'}){
        return new Promise((resolve,reject)=>{
            this._request(url,resolve,reject,data,method)
        })
    }
    _request(url,resolve,reject,data={},method='GET'){
        wx.request({
          url: url,
          method:method,
          data:data,
          header:{
            'content-type':'application/json' 
          },
          success:(res)=>{
            const statusCode = res.statusCode.toString()
            if(statusCode.startsWith('2')){
                resolve(res)
            }
            else{
            reject()
              wx.showToast({
                title: '错误',
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail:(err)=>{
            reject()
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