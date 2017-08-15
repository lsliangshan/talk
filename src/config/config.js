/**
 * Config
 * @return
 */

module.exports = {
    /*app config*/
    app_port: 3002,
    encoding: 'utf-8', //输出数据的编码
    language: 'zh-cn', //默认语言设置 zh-cn en
      static: {//静态资源,如果配置了Nginx代理,请设置为 static: false
        dir: '/static', //resource path
        prefix: '/', //resource prefix
        gzip: true, //enable gzip
        filter: null, //function or array['jpg', 'gif']
        maxAge: 3600 * 24, //cache maxAge seconds
        buffer: false, //enable buffer
        alias: {},  //alias files {key: path}
        preload: false, //preload files
        cache: true //files cache
      }
};