/**
 * Controller
 * @return
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

const decodeHtml = function decodeHtml (str) {
  return str.replace(/&#(x)?([^&]{1,5});?/g, function ($, $1, $2) {
    return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
  })
}

export default class extends think.controller.base {
  //构造方法
  init (http) {
    //调用父类构造方法
    super.init(http);

    this.lettersModel = think.model('letters', {});
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
    return this.ok('success');
  }

  downloadAction () {
    console.log(path.resolve(__dirname, './'))
    return this.success('成功');
  }

  async fetchPageAction () {
    const that = this;
    let url = this.get('from') || 'http://mp3.sogou.com';
    let _callback = this.get('callback');
    if (!!_callback) {
      let html = '';
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
        html = autoParsedBody;
        // html = autoParsedBody.substring(autoParsedBody.indexOf(_start), autoParsedBody.indexOf(_end));
        // html = html.match(new RegExp('http.*?\.(m4a)|(mp3)', 'g'))
        html = html.match(new RegExp('http.*?\.m4a\?.*?#,#.*?#,#.*?#,#.*?#,#', 'g'))
        let i = 0;
        let temp;
        let tempObj = {};
        let tempUrl;
        for (i; i < html.length; i++) {
          tempObj = {};
          temp = html[i].replace(/#,#$/, '').split('#,#');
          tempUrl = decodeURIComponent(temp[0].replace(/\?.*$/, ''));
          if (JSON.stringify(out).indexOf(tempUrl) < 0) {
            tempObj = {
              name: (i + 1) + '. ' + temp[1],
              author: temp[3],
              url: tempUrl,
              poster: 'http://talkapi.dei2.com/Static/img/default_cover.jpeg'
            }
            out.push(tempObj)
          }
        }
      }).catch(function (err) {
        console.log('ERROR: ', err)
      });

      // if (_callback) {
      //   this.header('Content-Type', 'text/javascript')
      //   return this.json(_callback + "(" + JSON.stringify(out) + ")");
      // } else {
      //   return this.jsonp(out)
      // }
      // this.header('Content-Type', 'text/javascript')
      return this.echo(_callback + "(" + JSON.stringify(out) + ")", 'text/javascript');
    } else {
      return this.fail('请求姿势不正确')
    }
  }

  async getJokesAction () {
    let _callback = this.get('callback');
    if (!_callback) {
      return this.fail('请求姿势不正确');
    } else {
      let out = [];
      let _url = 'http://xiaominggunchuqu.com/';
      let html = '';
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
      let options = {
        uri: _url,
        transform: function (body) {
          return cheerio.load(body)
        }
      }
      await rp(options).then(function ($) {
        let tempStr = '';
        for (let i = 0; i < $('.smallcontent').length; i++) {
          tempStr = decodeHtml($('.smallcontent').eq(i).html().trim());
          if (tempStr.indexOf('<br>') > 0 || tempStr.indexOf('<br/>') > 0) {
            out.push(tempStr.replace(/^\d+、/, '').split('<br>'))
          }
        }
        html = decodeHtml($('.smallcontent').html())
      }).catch(function (err) {
        console.log('ERROR: ', err)
      });
      // return this.json(out)
      // this.header('Content-Type', 'text/javascript')
      return this.echo(_callback + '(' + JSON.stringify(out) + ')', 'text/javascript');
    }
  }

  async getLettersAction () {
    let _callback = this.get('callback');
    let out = await this.lettersModel.where({id: {'>=': 1}}).select();
    return this.echo(_callback + '(' + JSON.stringify({'code': 200, 'errmsg': '获取成功', 'data': out}) + ')', 'text/javascript');
  }

  async saveLetterAction () {
    let _callback = this.get('callback');
    let _param = {
      'title': this.get('title') || '',
      'content': this.get('content') || '',
      'status': this.get('status') || 1,
      'create_time': (+new Date) / 1000,
      'image': this.get('image') || 'http://static.dei2.com/imgs/default.jpg',
      'update_time': (+new Date) / 1000
    }
    await this.lettersModel.add(_param);
    return this.echo(_callback + '(' + JSON.stringify({'code': 200, 'errmsg': '成功', 'data': _param}) + ')', 'text/javascript');
  }
}