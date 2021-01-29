const wrap = document.querySelector('.wrap')
const changeStyleBtn = document.querySelectorAll('.changeStyleBtn')
const btnCircle = document.querySelectorAll('.btnCircle')
const tableTitle = document.querySelector('.tableTitle')
const quoteTable = document.querySelector('.quoteTable')
const barInner = document.querySelector('.barInner')
const addQuote = document.querySelector('.addQuote')
const inputNewQuote = document.querySelector('.inputNewQuote')
const add = document.querySelector('.add')
const sentence = document.querySelector('.sentence')
const saveBtn = document.querySelector('.saveBtn')
const cancleBtn = document.querySelector('.cancleBtn')
const confirmBlock = document.querySelector('.confirmBlock')
let editInput = document.getElementsByClassName('editInput')
let deleteBtn = document.querySelectorAll('.deleteBtn')
let tableItem = document.querySelectorAll('.tableItem')
let style = 'light'

let fnbar;

//設定、取得日間或夜間模式的狀態
chrome.storage.sync.get('styleState', data => {
    let styleState = data.styleState || 'light';
    for(i=0;i<changeStyleBtn.length;i++){
        changeStyleBtn[i].addEventListener('click', () => {
            if(styleState == 'light'){
                chrome.storage.sync.set({styleState: 'dark'}, ()=>{})
            }else{
                chrome.storage.sync.set({styleState: 'light' }, ()=>{})
            }
        });
    }
    //設定按下按鈕後，根據主題變換顏色、圖片
    chrome.storage.onChanged.addListener(changes => {
        if (changes.hasOwnProperty('styleState')) {
            tableItem = document.querySelectorAll('.tableItem')
            editBtn = document.getElementsByClassName('editBtn')
            deleteBtn = document.querySelectorAll('.deleteBtn')
            styleState = changes.styleState.newValue;
            let bgc;
            let fc;
            if(styleState == 'light'){
                bgc = `#fff`
                fc = `#000`
                for(i=0;i<changeStyleBtn.length;i++){
                    changeStyleBtn[i].className = `changeStyleBtn`
                    changeStyleBtn[i].style.backgroundColor = `rgb(237, 237, 237, 0.7)`
                    btnCircle[i].style.backgroundColor = bgc
                }
            }else{
                bgc = `#000`
                fc = `#fff`
                for(i=0;i<changeStyleBtn.length;i++){
                    changeStyleBtn[i].className = `changeStyleBtn dark`
                    changeStyleBtn[i].style.backgroundColor = `rgb(87, 87, 87, 0.7)`
                    btnCircle[i].style.backgroundColor = `#000`
                }
            }
            wrap.style.backgroundColor = bgc
            wrap.style.color = fc
            tableTitle.style.borderBottomColor = fc
            barInner.style.color = fc
            for(i=0;i<tableItem.length;i++){
                tableItem[i].style.color = fc
                tableItem[i].style.borderBottom = `2px solid ${fc}`
            }
            for(i=0;i<editBtn.length;i++){
                editBtn[i].style.color = fc
            }
            for(i=0;i<deleteBtn.length;i++){
            deleteBtn[i].style.color= fc
            }
            style = styleState
            changeStyle(style)
        }
    });
});



//設定、取得名言佳句的資料
chrome.storage.sync.get('quoteLis', data => {
    let quoteLis = data.quoteLis || ['Stay hungry; stay foolish.', 'Bravery is the solution to regret.', 'What worries you masters you.', 'You are what you do, not what you say you’ll do.', 'Failure is just practice for success.']
    let color
    let preText;

    let styleColor = () =>{
        if(style == 'light'){
            color = `#000`
        }else{
            color = `#fff`
        }
        fnbar =`
        <a href="#" class="editBtn" style="color: ${color}"><i class="fas fa-pen"></i></a>
        <a href="#" class="deleteBtn" style="color: ${color}"><i class="fas fa-trash"></i></a>
        `
    }
    
    let deleteQuote = () =>{
        deleteBtn = document.querySelectorAll('.deleteBtn')
        for (i = 0; i < deleteBtn.length; i++) {
            deleteBtn[i].addEventListener('click', (e) =>{
                let deleteItem = e.target.parentNode.parentNode.parentNode.children[0].innerHTML
                for(i=0;i<quoteLis.length;i++){
                    if(quoteLis[i] == deleteItem){
                        quoteLis.splice(i, 1)
                        break
                    }
                }
                chrome.storage.sync.set({quoteLis: quoteLis}, ()=>{})
            })
        }
    }

    //監聽button按下後可對內容進行編輯
    let editQuote = () =>{
        editBtn = document.querySelectorAll('.editBtn')
        for(i=0; i<editBtn.length; i++){
            editBtn[i].addEventListener('click', (e) =>{
                let editItem = e.target.parentNode.parentNode.parentNode
                let p = editItem.children[0]
                let input = document.createElement('input')
                preText = p.innerHTML
                styleColor()
                input.type = `text`
                input.value = preText
                input.style.color = color
                p.innerHTML = ``
                input.onblur = () =>{
                    afterEdit = input.value
                    p.innerHTML = input.value == "" ? preText : afterEdit
                    for(i=0;i<quoteLis.length;i++){
                        if(quoteLis[i] == preText){
                            quoteLis[i] = afterEdit
                            break
                        }
                    }
                    chrome.storage.sync.set({quoteLis: quoteLis}, ()=>{})
                }
                p.appendChild(input)
                input.setSelectionRange(0, preText.length)
                input.focus()
            })
        }
    }
    //按下按鈕後將input的內容新增到storage當中
    add.addEventListener('click', () =>{
        newQuote = inputNewQuote.value
        let item = document.createElement('li')
        item.classList.add('tableItem')
        if(newQuote == ''){
          return
        }
        item.innerHTML = `
        <p>${newQuote}</p>
        <div class="fnLis">${fnbar}</div>
        `
        quoteTable.appendChild(item)
        quoteLis.unshift(newQuote)
        inputNewQuote.value = ''
        inputNewQuote.focus()
        chrome.storage.sync.set({quoteLis: quoteLis}, ()=>{})
        deleteQuote()
        editQuote()
        
        
    })
    //將資料載入名言佳句的表格中
    for(i=0;i<quoteLis.length;i++){
        let item = document.createElement('li')
        item.classList.add('tableItem')
        styleColor()
        item.innerHTML = `
        <p>${quoteLis[i]}</p>
        <div class="fnLis">${fnbar}</div>
        `
        quoteTable.appendChild(item)
    }
    deleteQuote()
    editQuote()
    
    //當資料改變，表格就重新載入
    chrome.storage.onChanged.addListener(changes => {
        if (changes.hasOwnProperty('quoteLis')) {
            quoteTable.innerHTML = ``
            for(i=0;i<quoteLis.length;i++){
                let item = document.createElement('li')
                item.classList.add('tableItem')
                styleColor()
                console.log(fnbar)
                item.innerHTML = `
                <p>${quoteLis[i]}</p>
                <div class="fnLis">${fnbar}</div>
                `
                quoteTable.appendChild(item)
                if(style == 'light'){
                    item.style.borderBottom = `2px solid #000`
                }else{
                    item.style.borderBottom = `2px solid #fff`
                }
            }
            deleteQuote()     
            editQuote()
        }
        
    })
})










  
  
  





