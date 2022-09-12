export interface IRecord {
  type: string
  spm: string
}

export interface IIntersectionObserverOption extends IntersectionObserverInit {
  target?: HTMLElement
  duration?: number
}

export interface IClickHook {
  (event: Event, spm: string): void
}

export interface IIntersectionHook {
  (
    target: HTMLElement,
    observerTarget: HTMLElement | Document,
    spm: string
  ): void
}

export interface IOption {
  element?: HTMLElement
  clickHooks?: IClickHook[]
  intersectionHooks?: Array<IIntersectionHook>
  intersectionOption?: IIntersectionObserverOption
}

// 缓存所有hook，并在click事件触发时依次运行
let clickHooks: IClickHook[] = []
let intersectionHooks = []

// 为document.body绑定事件，获取spm值
export function init(options: IOption) {
  // 支持自定义监听点击的元素
  const element = options.element ?? document.body
  // 初始化传入的hook
  const clickHookArray = options.clickHooks ?? []
  const intersectionHookArray = options.intersectionHooks ?? []
  // 初始化时存储所有hook
  clickHooks.push(...clickHookArray)
  intersectionHooks.push(...intersectionHookArray)

  element.addEventListener('click', function (event) {
    // 生成spm字符串
    const spm = getSpm(
      event.target as HTMLElement,
      event.currentTarget as HTMLElement
    )

    // 依次运行hook，并将spm字符串传入
    if (spm) {
      clickHooks.forEach(hook => {
        hook(event, spm)
      })
    }
  })

  const elements = document.querySelectorAll('[data-spm-visible]')
  // intersection(elements[1] as HTMLElement, options.intersectionOption)

  for (const element of elements) {
    intersection(element as HTMLElement, options.intersectionOption)
  }

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true }

  // Callback function to execute when mutations are observed
  const callback = mutationList => {
    for (const mutation of mutationList) {
      if (mutation.addedNodes?.length) {
        mutation.addedNodes.forEach((element: Element): void => {
          intersection(element as HTMLElement, options.intersectionOption)
        })
      }
    }
  }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)

  // Start observing the target node for configured mutations
  observer.observe(options.intersectionOption?.target ?? document, config)
}

function intersection(
  element: HTMLElement,
  intersectionOption: IIntersectionObserverOption = {}
): void {
  const { duration, ...intersectionInit } = intersectionOption
  let options = {
    root: document,
    threshold: 0.3,
    ...intersectionInit
  }
  const observerTarget = intersectionOption.target ?? document
  let timer = 0

  let observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      const entry = entries?.[0]

      if (entry?.isIntersecting) {
        timer = window.setTimeout(() => {
          const spm = getSpm(
            entry.target as HTMLElement,
            observerTarget as HTMLElement
          )

          if (spm) {
            intersectionHooks.forEach((hook: IIntersectionHook): void => {
              hook(entry.target as HTMLElement, observerTarget, spm)
            })
          }
        }, duration ?? 3000)
      } else {
        clearTimeout(timer)
      }
    },
    options
  )

  observer.observe(element)
}

// 添加hook
export function addClickHook(hook: IClickHook) {
  clickHooks.push(hook)
}

// 移除hook
export function removeClickHook(removeHookItem: IClickHook) {
  const removeIndex = clickHooks.findIndex(hook => hook === removeHookItem)
  clickHooks.splice(removeIndex, 1)
}

// 添加hook
export function addIntersectionHook(hook: IIntersectionHook) {
  intersectionHooks.push(hook)
}

// 移除hook
export function removeIntersectionHook(
  intersectionHookItem: IIntersectionHook
) {
  const removeIndex = intersectionHooks.findIndex(
    hook => hook === intersectionHookItem
  )
  intersectionHooks.splice(removeIndex, 1)
}

function getSpm(target: HTMLElement, currentTarget: HTMLElement): string {
  let spmTextArray: string[] = [] // 存储每个元素的spm值
  getSpmText(target, currentTarget, spmTextArray)
  // 生成spm字符串
  const spm = spmTextArray.reverse().join('.')

  return spm
}

// 不断向父级元素查找，直到查找到绑定事件的元素
function getSpmText(
  target: HTMLElement,
  currentTarget: HTMLElement,
  arr: string[]
) {
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

  getSpmText(target.parentNode as HTMLElement, currentTarget, arr)
}
// 查找当前元素是否有data-spmx属性，并且其有值
// 将data-spmx属性的值返回，无值返回''
function findSpmText(target: HTMLElement) {
  const dataset = target.dataset ?? []
  const spmKey = Object.keys(dataset).find(key => /spm[a-z]/.test(key))

  if (spmKey && dataset[spmKey]) {
    return dataset[spmKey]
  }

  return ''
}

export async function record(data: IRecord | IRecord[]) {
  await fetch('http://localhost:9000/log', {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  })
}
