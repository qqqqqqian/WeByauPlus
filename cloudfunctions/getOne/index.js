// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()
// 云函数入口函数
const one = () => {
  return new Promise((resolve, reject) => {
    request({
      url: 'http://v3.wufazhuce.com:8000/api/channel/one/0/0',
      method: 'get',
      headers: {
        host: 'v3.wufazhuce.com:8000',
        Connection: 'Keep-Alive',
        'User-Agent': 'android-async-http/2.0 (http://loopj.com/android-async-http)',
        'Accept-Encoding': 'gzip',
        'Accept-Encoding': 'gzipz'

      }
    }, (error, response, body) => {
      resolve(JSON.parse(body));
    })
  }).then((res) => {
    const db = cloud.database();
    const ones = db.collection('one');
    ones.doc('XKwG08DR1TiNUtxZ').set({
      // data 字段表示需新增的 JSON 数据
      data: {
        description: 'one',
        date: new Date(),
        tags: [
          'cloud',
          'database'
        ],
        word: res.data.content_list[0].forward,
        img_url: res.data.content_list[0].img_url,
        word_info: res.data.content_list[0].words_info
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  });
};
exports.main  = one;