//import {HTTP} from '../util/http.js'
import {config} from '../config.js'
import {
  HTTP
} from '../util/http-p.js'

class Classic extends HTTP{
  getDailySentence(){
    return this.request({
      url:config.dailyImageAndContent
    })
  }
  


}


 //回调函数写法
// class Classic extends HTTP{

//   getDailySentence(callback){
//     this.request({
//       url: config.dailySentenceUrl,
//       success: (res) => {
//         callback(res.note)
//       }
//     })
//   }
// }
export {Classic}