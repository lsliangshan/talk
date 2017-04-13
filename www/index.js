/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2014- <richenlin(at)gmail.com>
 * @license    MIT
 * @version    15/1/15
 */
var path = require('path');
require('shelljs/global');
exec('cd www/Static && node build/dev-server.js', {async:true});
var thinknode = require('thinknode');
//root path
var rootPath = path.dirname(__dirname);
//thinknode instantiation
var instance = new thinknode({
    ROOT_PATH: rootPath,
    APP_PATH: rootPath + path.sep + 'App',
    RESOURCE_PATH: __dirname,
    RUNTIME_PATH: rootPath + path.sep + 'Runtime',
    APP_DEBUG: true //线上环境切记要将debug模式关闭，即：APP_DEBUG:false
});
//app run
instance.run();
