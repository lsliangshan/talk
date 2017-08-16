/**
 * Middleware config
 * @return
 */
module.exports = {
  list: ['model', 'session'], //加载的中间件列表
  config: { //中间件配置
    // logger: {
    //     log: true, //是否存储日志
    //     level: ['warn', 'error'], //日志存储级别, info, warn, error, console类型日志有效
    // }
    model: {
      db_type: 'mysql', // 数据库类型,支持mysql,mongo,postgressql
      db_host: '123.57.148.237', // 服务器地址
      db_port: 3306, // 端口
      db_name: 'talk', // 数据库名
      db_user: 'talk', // 用户名
      db_pwd: 'fdd1a001-70da-4c9f-b7a8-e06837f7f054', // 密码
      db_prefix: '', // 数据库表前缀
      db_charset: '', // 数据库编码默认采用utf8
      db_nums_per_page: 20, //查询分页每页显示的条数
      db_ext_config: { //数据库连接时候额外的参数
        db_log_sql: true, //打印sql
        read_write: false, //读写分离(mysql, postgresql)
        db_pool_size: 10, //连接池大小
        db_replicaset: '', //mongodb replicaset
        db_conn_url: '', //数据链接
      }
    },
    session: {
      session_type: 'file', //数据缓存类型 file,redis,memcache
      session_name: 'thinkkoa', //session对应的cookie名称
      session_key_prefix: 'ThinkKoa:', //session名称前缀
      session_options: {}, //session对应的cookie选项
      session_sign: '', //session对应的cookie使用签名
      session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒

      //session_type=file
      file_suffix: '.json', //File缓存方式下文件后缀名
      file_path: think.root_path + '/cache',

      //session_type=redis
      //redis_host: '127.0.0.1',
      //redis_port: 6379,
      //redis_password: '',
      //redis_db: '0',
      //redis_timeout: 10, //try connection timeout

      //session_type=memcache
      //memcache_host: '127.0.0.1',
      //memcache_port: 11211,
      //memcache_poolsize: 10, //memcache pool size
      //memcache_timeout: 10, //try connection timeout,
    },
    static: false
  }
};