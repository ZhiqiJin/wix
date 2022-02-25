$(document).ready(function () {
  var wixTypeMap = [{key:100,value:'Online Sources'}, {key:200,value:'Printed Sources'}]
  var tableData = tableList;

  var table = $("#example").DataTable({
    bLengthChange: false,
    iDisplayLength: 15,
    bAutoWidth: true,
    dom: '<"toolbar">frtip',
    data: tableData,
    createdRow: function (row, data, dataIndex) {
      $(row).attr('data', JSON.stringify(data).replace(/\"/g, "'"))
    },
    columns: [
      {
        data: 'wixTitle', render: function (data, type, row) {
          var text = data.length > 20 ? data.substr(0, 20) + '...' : data
          if (row.wixLink.indexOf('http') != -1) {
            return '<a href="' + row.wixLink + '" target="view_window" style="color:#409eff;">' + text + '</a>'
          } else {
            return text
          }
        }
      },
      {"data": "wixAuthor"},
      {"data": "wixTypesetting"},
      {"data": "wixPublishing"},
      {
        data: 'wixType', render: function (value, type, row) {
          var result = ''
          wixTypeMap.forEach(item => {
            if(item.key === value){
              result = item.value
            }
          })
          return result;
        }
      },
      {"data": "wixReleaseDate"},
      {
        data: 'wixSummary', render: function (data, type, row) {
          return data.length > 30 ? data.substr(0, 30) + '...' : data
        }
      }
    ],
  });

  function reloadDataTable(val) {
    tableData = tableList;
    if (val != null && val != 0) {
      tableData = []
      tableList.forEach(item => {
        if (item.wixType == val) {
          tableData.push(item);
        }
      });
    }

    table.clear();
    table.rows.add(tableData);
    table.draw();
  }

  var html =  '  <label><input type="radio" name="wixType" id="wixType-0" value="0" checked="checked"/>ALL</label>\n' +
              '  <label><input type="radio" name="wixType" id="wixType-100" value="100"/>Online Sources</label>\n' +
              '  <label><input type="radio" name="wixType" id="wixType-200" value="200"/>Printed Sources</label>\n';
  $("div.toolbar").html(html)

  $('.toolbar input[type="radio"]').on('click', function(e) {
    reloadDataTable($(this).val())
  })

  //对行双击添加监听事件
  $("#example tbody").on("dblclick", "tr", function () {
    var row = JSON.parse($(this).attr("data").replace(/\'/g,"\""));

    var wixType = ''
    wixTypeMap.forEach(item => {
      if(item.key === row.wixType){
        wixType = item.value
      }
    })

    $("#wixTitle").html(row.wixTitle ? row.wixTitle: "");
    $("#wixAuthor").html(row.wixAuthor ? row.wixAuthor: "");
    $("#wixType").html(wixType ? wixType: "");
    $("#wixTypesetting").html(row.wixTypesetting ? row.wixTypesetting: "");
    $("#wixPublishing").html(row.wixPublishing ? row.wixPublishing: "");
    $("#wixLink").html(row.wixLink ? row.wixLink: "");
    $("#wixReleaseDate").html(row.wixReleaseDate ? row.wixReleaseDate: "");
    $("#wixSummary").html(row.wixSummary ? row.wixSummary: "");
    $("#wixContent").html(row.wixContent ? row.wixContent: "");
    layer.open({type: 1, title: "Data details", shadeClose: true, skin: "layui-layer-rim", area: ["800px", "600px"], content: $("#dialog").html()});
  });

  var url = new URL(window.location.href);
  var wixType = url.searchParams.get("wixType");
  reloadDataTable(wixType)
  if(wixType != null){
    $("#wixType-" + wixType).attr('checked', 'checked');
  }

});

