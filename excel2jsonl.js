var xlsx = require('node-xlsx');
var fs = require('fs');
var filename = xlsx.parse('./test.xlsx')[0].name;
var list = xlsx.parse('./test.xlsx')[0].data;
var arr = list.shift();
var newArray = [];
list.forEach((itm, idx) => {
  var obj1 = {};
  var obj2 = {};
  var obj3 = {};
  // 根据每层嵌套的元素个数区分
  arr.forEach((item, index) => {
    if (index < 4) {
      isChildren(obj1, item, itm, index);
    } else if (index < 8) {
      isChildren(obj2, item, itm, index);
    } else {
      obj3[item] = itm[index] ? itm[index] : "";
    }
  })
  obj2.children.push(obj3);
  obj1.children.push(obj2);
  newArray.push(obj1);
})
// 比较一级标题
compareItem(newArray);
// 比较二级标题
newArray.forEach(item => {
  compareItem(item.children)
})

// 比较查重去重
function compareItem(item) {
  for (var i = 0, len = item.length - 1; i < len; i++) {
    for (var j = item.length - 1; j > i; j--) {
      // 如果一级标题的title 相同,再将后者的children push 到前者的children上,并将后者去除
      if (item[i].title === item[j].title) {
        item[j].children.forEach(n => {
          item[i].children.push(n);
          item.splice(j, 1);
        })
      }
    }
  }
}

// 给对象赋默认值
function isChildren(obj, item, itm, index) {
  if (item === "children") {
    obj[item] = [];
  } else {
    obj[item] = itm[index] ? itm[index] : "";
  }
  return obj;
}
// children为空时,赋值为[]
newArray.forEach(item => {
  if (item.children[0].title === "") {
    item.children = [];
  } else {
    item.children.forEach(itm => {
      if (itm.children[0].title === "") {
        itm.children = [];
      }
    })
  }
})


writeFile(`${filename}.json`, JSON.stringify(newArray));

function writeFile(filename, data) {
  fs.writeFileSync(filename, data, 'utf-8', complete);

  function complete(err) {
    if (!err) {
      console.log('文件生成成功')
    }
  }
}