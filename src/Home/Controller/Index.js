/**
 * Controller
 * @return
 */
let jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise')
let i = 0;
let url = 'http://mp3.sogou.com';
// let url = 'http://mp3.sogou.com/list/song?type=%C3%C0%B9%FA%B9%AB%B8%E6%B0%F1&ie=gbk';
// (function(window){
//   window.htmlentities = {
//     /**
//      * Converts a string to its html characters completely.
//      *
//      * @param {String} str String with unescaped HTML characters
//      **/
//     encode : function(str) {
//       var buf = [];
//
//       for (var i=str.length-1;i>=0;i--) {
//         buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
//       }
//
//       return buf.join('');
//     },
//     /**
//      * Converts an html characterSet into its original character.
//      *
//      * @param {String} str htmlSet entities
//      **/
//     decode : function(str) {
//       return str.replace(/&#(\d+);/g, function(match, dec) {
//         return String.fromCharCode(dec);
//       });
//     }
//   };
// })(window);

export default class extends THINK.Controller {
  //构造方法
  init (http) {
    //调用父类构造方法
    super.init(http);
    this.UserModel = THINK.model('Home/User', {});
  }

  //所有该控制器(含子类)方法前置方法
  __before () {
    console.log('__before');
  }

  //URI定位到该控制器,如果该控制器不存在某个方法时自动调用
  __empty () {
    return this.json('can\'t find action');
  }

  //indexAction前置方法
  _before_index () {
    console.log('_before_index');
  }

  //控制器默认方法
  indexAction () {
    return this.display()
  }

  getipAction () {
    return this.json({
      ip: this.http.req.connection.remoteAddress.split(':')[3]
    })
  }

  async fetchPageAction () {
    const that = this;
    if (!this.isPost()) {
      let html = '';
      let _callback = this.get('callback');
      function autoParse(body, response, resolveWithFullResponse) {
        // FIXME: The content type string could contain additional values like the charset.
        // Consider using the `content-type` library for a robust comparison.
        if (response.headers['content-type'] === 'application/json') {
          return JSON.parse(body);
        } else if (response.headers['content-type'] === 'text/html') {
          return cheerio.load(body);
        } else {
          return body;
        }
      }

      let _start = decodeURIComponent(this.post('start')) || '<div class="bang_box bang_03">';
      let _end = decodeURIComponent(this.post('end')) || '<div class="bang_box bang_04">';
      // let _start = '<div id="list_div" class="r_con_800">';
      // let _end = '<div id="footer">';

      let options = {
        uri: url,
        transform: autoParse
      }
      let out = [];
      await rp(options).then(function (autoParsedBody) {
        html = autoParsedBody.substring(autoParsedBody.indexOf(_start), autoParsedBody.indexOf(_end));
        // html = html.match(new RegExp('http.*?\.(m4a)|(mp3)', 'g'))
        html = html.match(new RegExp('http.*?\.m4a\?.*?#,#.*?#,#.*?#,#.*?#,#', 'g'))
        let i = 0;
        let temp;
        let tempObj = {};
        for (i; i < html.length; i++) {
          tempObj = {};
          temp = html[i].replace(/#,#$/, '').split('#,#');
          tempObj = {
            name: (i + 1) + '. ' + temp[1],
            author: temp[3],
            url: decodeURIComponent(temp[0].replace(/\?.*$/, '')),
            poster: 'http://talkapi.dei2.com/Static/img/default_cover.jpeg'
          }
          out.push(tempObj)
        }
      }).catch(function (err) {
        console.log('ERROR: ', err)
      });

      if (_callback) {
        this.header('Content-Type', 'text/javascript')
        return this.json(_callback + "(" + JSON.stringify(out) + ")");
      } else {
        return this.jsonp(out)
      }
    } else {
      return this.fail('请求姿势不正确')
    }
  }

  // 登录
  async loginAction () {
    if (this.isPost()) {
      let phonenum = this.post('phonenum')
      let password = this.post('password')
      let userInfo = await this.UserModel.where({phonenum, phonenum, password: THINK.md5(password)}).find();
      userInfo.hasOwnProperty('password') && (delete userInfo.password)
      if (THINK.isEmpty(userInfo)) {
        return this.error('手机号或密码输入有误')
      } else {
        this.header('app-token', jwt.sign({
          phonenum: phonenum,
          nickname: userInfo.nickname
        }, 'shhhhh'))
        return this.success('登录成功', userInfo)
      }
    } else {
      return this.error('请求姿势不正确~');
    }
  }
}