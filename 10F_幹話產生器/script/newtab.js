const burgerBtn = document.querySelector('.burgerBtn')
const banner = document.querySelector('.banner')
const main = document.querySelector('main')
const edit = document.querySelector('.edit')
const returnBtn = document.querySelector('.returnBtn')
const quote = document.querySelector('.quote')
const readMoreBtn = document.querySelector('.readMoreBtn')
const sidebar = document.querySelector('.sidebar')
let bg;
let fc;

//按下漢堡選單出現編輯畫面
let editPage = () =>{
    banner.className = 'banner withSidebar'
    main.className = 'main hide'
    edit.className = 'edit'
    sidebar.className = 'sidebar'
    main.style.zIndex = '0'
    edit.style.zIndex = '0'
    inputNewQuote.focus()
}

//按下箭頭返回至主畫面
let returnFn = () =>{
    banner.className = 'banner'
    main.className = 'main'
    edit.className = 'edit hide'
    sidebar.className = "sidebar hide"
    sidebar.style.zIndex = '2'
    main.style.zIndex = '1'
    edit.style.zIndex = '0'
}

//根據style改變顏色
let changeStyle = (style) =>{
  if(style == 'light'){
    bg = `#fff`
    fc = `#000`
    banner.children[0].style.backgroundImage = `url('https://images.unsplash.com/photo-1552057008-518700a52ad0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=701&q=80')`
    edit.style.backgroundColor = `rgb(0, 0, 0, 0.6)`
  }else{
    bg = `#000`
    fc = `#fff`
    banner.children[0].style.backgroundImage = `url('https://images.unsplash.com/photo-1493710282585-ce6a89fbc821?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')`
    edit.style.backgroundColor = `rgb(255, 255, 255, 0.6)`
  }
  burgerBtn.children[0].style.color = bg
  returnBtn.style.color = fc
  sidebar.style.backgroundColor = bg
  addQuote.children[0].style.color = bg
  addQuote.children[1].style.borderBottom = `1px solid ${bg}`
  add.children[0].style.color = bg
  quote.style.color = `#000`
  quote.style.webkitTextStroke = `1px ${fc}`
  saveBtn.style.color = bg
  cancleBtn.style.color = fc
  saveBtn.style.backgroundColor = fc
  cancleBtn.style.backgroundColor = bg
  inputNewQuote.style.color = bg
  readMoreBtn.style.color = fc
  for(i=0;i<sentence.children.length;i++){
      if(sentence.children[i].nodeName == "P"){
        sentence.children[i].style.backgroundColor = bg
        sentence.children[i].style.color = fc
      }
  }
}

chrome.storage.sync.get('quoteLis', data => {
  let quoteLis = data.quoteLis
  //設定主畫面句子根據逗號分行
  let sentenceProcess = (str) =>{
    let sentenceLis = []
    let dotLis = []
    let content = ``
    sentenceLis = str.split(/,|，/)
    for(i=0;i<str.length;i++){
      if((str[i] == ',') | (str[i] == '，')){
        dotLis.push(str[i])
      }
    }
    for(i=0;i<sentenceLis.length;i++){
      if(i < sentenceLis.length-1){
        content += `<p>${sentenceLis[i]}${dotLis[i]}</p><br>`
      }else{
        content += `<p>${sentenceLis[i]}</p>`
      }
    }
    return content
  }
  //修改完畢後根據主題變色
  let sentenceColor = () =>{
    for(i=0;i<sentence.children.length;i++){
      if(sentence.children[i].nodeName == 'P'){
        if(style == 'dark'){
          sentence.children[i].style.color = '#fff'
          sentence.children[i].style.backgroundColor = '#000'
        }else{
          sentence.children[i].style.color = '#000'
          sentence.children[i].style.backgroundColor = '#fff'
        }
      }
    }
  }
  //如果Table當中佳句超過五句，第五句後的句子均先隱藏，並且出現LOAD MORE按鈕
  let detectLen = () =>{
    tableItem = tableItem = document.querySelectorAll('.tableItem')
    if(tableItem.length > 5){
      readMoreBtn.style.display = 'block'
    }
  }

  add.addEventListener('click', () =>{
    detectLen()
  })
  
  //雙擊主畫面句子可進行編輯
  sentence.addEventListener('dblclick', (e)=>{
    if(e.target.nodeName == "INPUT"){
      return
    }
    preText = ''
    for(i=0;i<sentence.children.length;i++){
        if(sentence.children[i].nodeName == "P"){
            preText += `${sentence.children[i].innerHTML}`
        }
    }
    sentence.innerHTML = `
    <input class="sentenceInput" type="text" value="${preText}">
    `
    confirmBlock.style.display = `flex`
    editState = true
    sentenceInput = document.querySelector('.sentenceInput')
    strLen = preText.length
    sentenceInput.focus()
    sentenceInput.setSelectionRange(strLen, strLen)
  })
  //按下取消鍵後內容回復至未被編輯的時候
  cancleBtn.addEventListener('click', ()=>{
    sentence.innerHTML = sentenceProcess(preText)
    confirmBlock.style.display = `none`
    sentenceColor()
  })
  //按下儲存後將sotrage內原本的佳句更新為新的佳句
  saveBtn.addEventListener('click', ()=>{
    afterEdit = sentenceInput.value
    sentence.innerHTML = sentenceProcess(afterEdit)
    confirmBlock.style.display = `none`
    for(i=0;i<quoteLis.length;i++){
        if(quoteLis[i] == preText){
            quoteLis[i] = afterEdit
        }
    }
    chrome.storage.sync.set({quoteLis: quoteLis}, ()=>{})
    sentenceColor()
  })

  detectLen()
  let quoteNum = parseInt(Math.random()*quoteLis.length)
  sentence.innerHTML = sentenceProcess(quoteLis[quoteNum])

})


//按下LOAD MORE按鈕後，其餘佳句顯示
let readMore = () =>{
  tableItem = document.getElementsByClassName('tableItem')
  quoteTable.style.overflow = `auto`
  readMoreBtn.style.display = 'none'
}

burgerBtn.addEventListener('click', editPage)
returnBtn.addEventListener('click', returnFn)
readMoreBtn.addEventListener('click', readMore)

