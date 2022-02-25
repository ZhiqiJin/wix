const os = require('os')
const fs = require('fs')
const filepath = './data/wix-data.json'

/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * uuid
 * @returns {string}
 */
function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

function getDateTime() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
}


function getIPAddress() {
  let interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

function getMac() {
  let interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.mac
      }
    }
  }
}

function getHostname() {
  return os.hostname()
}

function getWixData() {
  let result = []
  let data = fs.readFileSync(filepath, {'encoding': 'utf8'})
  if (data) {
    result = JSON.parse(data)
  }

  return result
}

function setWixData(data) {
  setTableBody(data)
  fs.writeFileSync(filepath, JSON.stringify(data), {'encoding': 'utf8'})
}
function setTableBody(rows){
  var body = '';
  // if(rows){
  //   rows.forEach(function (item,index){
  //     var link = item.wixLink.indexOf("http") != -1 ? "<a href='" + item.wixLink + "' target='view_window'>" + item.wixLink + "</a>" : item.wixLink;
  //     body += '      <tr data="' + JSON.stringify(item).replace(/\"/g, "'") + '"> \n' +
  //             '        <td class="sorting_1">'+item.wixTitle+'</td> \n'+
  //             '        <td>'+item.wixAuthor+'</td> \n'+
  //             '        <td>'+item.wixTypesetting+'</td> \n'+
  //             '        <td>'+item.wixPublishing+'</td> \n'+
  //             '        <td>'+link+'</td> \n'+
  //             '        <td>'+item.wixReleaseDate+'</td> \n'+
  //             '        <td>'+item.wixSummary+'</td> \n'+
  //             '      </tr> \n';
  //   })
  // }

  var html = '<!DOCTYPE html> \n'+
      '<!-- last update time: ' + new Date().toISOString().slice(0, 20) + '--> \n' +
      '<html> \n'+
      '<head> \n'+
      '  <meta charset="utf-8"> \n'+
      '  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"> \n'+
      '  <title>wix</title> \n'+
      '  <meta http-equiv="cache-control" content="no-cache"> \n'+
      '  <meta http-equiv="expires" content="0"> \n'+
      '  <meta http-equiv="pragma" content="no-cache"> \n'+
      '  <link rel="stylesheet" href="static/layui/css/layui.css"> \n'+
      '  <link rel="stylesheet" type="text/css" href="static/DataTables/datatables.min.css"/> \n'+
      '  <script src="static/DataTables/jQuery-3.6.0/jquery-3.6.0.js"></script> \n'+
      '  <script type="text/javascript" src="static/DataTables/datatables.min.js"></script> \n'+
      '  <style> \n'+
      '    .pull-left{float:left!important;} \n'+
      '    .pull-right{float:right!important;} \n'+
      '    .layui-row label{font-weight: bold;} \n'+
      '    .toolbar{ display: contents;} \n'+
      '    #example_filter input {width: 500px;} \n'+
      '  </style> \n'+
      '</head> \n'+
      '<body> \n'+
      '<table id="example" class="display" style="width:100%"> \n'+
      '  <thead> \n'+
      '    <tr> \n'+
      '      <th>Title</th> \n'+
      '      <th>Author</th> \n'+
      '      <th>Editor</th> \n'+
      '      <th>Publisher</th> \n'+
      '      <th>Source Type</th> \n'+
      '      <th>Date</th> \n'+
      '      <th>Abstract</th> \n'+
      '    </tr> \n'+
      '  </thead> \n'+
      '  <tbody> \n'+
      '' + body +
      '  </tbody> \n'+
      '</table> \n'+
      '<div class="layui-form" id="dialog" hidden>\n' +
      '  <div class="layui-row">\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Title：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixTitle"></div>\n' +
      '    </div>\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Author：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixAuthor"></div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '  <div class="layui-row">\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Source Type：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixType"></div>\n' +
      '    </div>\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Editor：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixTypesetting"></div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '  <div class="layui-row">\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Publisher：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixPublishing"></div>\n' +
      '    </div>\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Date：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixReleaseDate"></div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '  <div class="layui-row">\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Link：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixLink"></div>\n' +
      '    </div>\n' +
      '    <div class="layui-col-md6">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Abstract：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixSummary"></div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '  <div class="layui-row">\n' +
      '    <div class="layui-col-md12">\n' +
      '      <label class="layui-form-label" style="width: 120px;" >Content：</label>\n' +
      '      <div class="layui-form-mid layui-word-aux" id="wixContent"></div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div> \n '+
      '<!-- 引入 layui.js 的 <script> 标签最好放置在 html 末尾 --> \n'+
      '<script src="static/layui/layui.js"></script> \n'+
      '<script src="static/index.js"></script> \n'+
      '<script type="text/javascript">var tableList = '+JSON.stringify(rows)+'</script> \n'+
      '</body> \n'+
      '</html> \n';

  fs.writeFileSync("./index.html", html, {'encoding': 'utf8'})
}

module.exports = {
  param2Obj,
  deepClone,
  uuid,
  getDateTime,
  getIPAddress,
  getHostname,
  getMac,
  setWixData,
  getWixData
}
