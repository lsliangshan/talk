/**
 * Model
 * @return
 */
const thinkorm = require('thinkorm');

export default class extends thinkorm {
    init(name, config){
        super.init(name, config);

        // 是否开启迁移(migrate方法可用)
        this.safe = false;
        // 数据表字段信息
        this.fields = {
          id: {
            primaryKey: true,
            type: 'integer',
            index: true,
            unique: true
          },
          title: {
            type: 'string',
            index: true,
            size: 30
          },
          content: {
            type: 'text'
          },
          image: {
            type: 'string',
            index: true,
            size: 200
          },
          create_time: {
            type: 'integer'
          },
          update_time: {
            type: 'integer'
          },
          status: {
            type: 'integer',
            defaultsTo: 0,
            index: true
          }
        };
        // 数据验证
        this.validations = {};
        // 关联关系
        this.relation = {};
    }
}