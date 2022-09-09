// 缓存所有hook，并在click事件触发时依次运行
let hooks = []

// 为document.body绑定事件，获取spm值
export function init(params) {
  // 支持自定义监听点击的元素
  const element = params.element ?? document.body
  // 初始化传入的hook
  const hookArray = params.hooks ?? []
  // 初始化时存储所有hook
  hooks.push(...hookArray)

  element.addEventListener('click', function (event) {
    let spmTextArray = [] // 存储每个元素的spm值
    getSpmText(event.target, event.currentTarget, spmTextArray)
    // 生成spm字符串
    const spmText = spmTextArray.reverse().join('.')

    // 依次运行hook，并将spm字符串传入
    hooks.forEach(hook => {
      hook(spmText)
    })
  })
}

// 添加hook
export function addHook(hook) {
  hooks.push(hook)
}

// 移除hook
export function removeHook(removeHookItem) {
  const removeIndex = hooks.findIndex(hook => hook === removeHookItem)
  hooks.splice(removeIndex, 1)
}

// 不断向父级元素查找，直到查找到绑定事件的元素
function getSpmText(target, currentTarget, arr) {
  // 早点当前元素的spm
  const targetSpmText = findSpmText(target)

  // 如果有spm则存入数组
  if (targetSpmText) {
    arr.push(targetSpmText)
  }

  // 如果查找到绑定事件的元素，就将结果存储并退出循环
  if (target === currentTarget) {
    return
    /* 
为什么使用arr.push再arr.reverse().join('.')？
一、实际测试了以下几段代码：


1. 使用arr.unshift，再arr.join('.')

console.time('array unshift')
let arr = []

for (let i = 0; i < 100000000; i++) {
arr.unshift('aa')
}

let str = arr.join('.')
console.timeEnd('array unshift')

循环100W次
耗时: 1:55.289 (m:ss.mmm)

2. 使用arr.push再arr.reverse().join('.')

console.time('array push')
let arr = []

for (let i = 0; i < 100000000; i++) {
arr.push('aa')
}

let str = arr.reverse().join('.')
console.timeEnd('array push')

测试环境：Node.js v16.14.1
循环100W次
耗时: 61.79ms
循环1000W次
耗时: 672.56ms
循环1亿次
耗时: 8.396s

测试环境：Chrome 104.0.5112.101（正式版本） (arm64)
循环100W次
耗时: 52.5791015625 ms
循环1000W次
耗时: 392.364990234375 ms
循环1亿次
耗时: 3324.813232421875 ms

3. 使用String

console.time('string')
let str = ''

for (let i = 0; i < 100000000; i++) {
str = 'aa' + '.' + str
}
console.timeEnd('string')

测试环境：Node.js v16.14.1
循环100W次
耗时: 84.646ms
循环1000W次
耗时: 790.097ms
循环1亿次
耗时: 12.251s

测试环境：Chrome 104.0.5112.101（正式版本） (arm64)
循环100W次
耗时: 72.958984375 ms
循环1000W次
耗时: 751.48486328125 ms
循环1亿次
耗时: 6852.30615234375 ms

二、选用Array的原因
1. 从实际效果来看使用arr.push再arr.reverse().join('.')，和直接用字符串拼接性能差异不大。
2. 但考虑到用Array性能较高
3. 使用Array代码逻辑简单，不需要处理字符串拼接结果为aa.bb.cc. ，最后会多一个'.'的问题
*/
  }

  getSpmText(target.parentNode, currentTarget, arr)
}
// 查找当前元素是否有data-spmx属性，并且其有值
// 将data-spmx属性的值返回，无值返回''
function findSpmText(target) {
  const dataset = target.dataset
  const spmKey = Object.keys(dataset).find(key => key.startsWith('spm'))

  if (spmKey && dataset[spmKey]) {
    return dataset[spmKey]
  }

  return ''
}
