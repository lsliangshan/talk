/**
 * Middleware config
 * @return
 */
module.exports = {
  list: ['model'], //加载的中间件列表
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
    }
  }
};