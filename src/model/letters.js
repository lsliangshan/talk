/**
 * Model
 * @return
 */
const thinkorm = require('thinkorm');

export default class extends thinkorm {
    init(name, config){
        super.init(name, config);

        // 是否开启迁移(migrate方法可用)
        //this.safe = false;
        // 数据表字段信息
      this.fields = {
        id: {
          primaryKey: true,
          index: true,
          type: 'integer'
        },
        title: {
          type: 'string',
          index: true,
          size: 30
        },
        content: {
          type: 'string',
          size: 32
        },
        image: {
          type: 'text',
          size: 50
        },
        password: {
          type: 'string',
          index: true,
          size: 32
        },
        create_time: {
          type: 'integer'
        },
        update_time: {
          type: 'integer'
        },
        end_time: {
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