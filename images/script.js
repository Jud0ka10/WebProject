//document=вся страница, getElementById= ищет элемент по айди//

const input = document.getElementById('task-input') //полк для задач//
const addBtn = document.getElementById('add-btn') //"добавить"
const list = document.getElementById('task-list') //куда попадут задачи//
const search = document.getElementById('search-input')//полк поиска//
const filterBtns = document.querySelectorAll('.filter-btn')//все кнопки фильтры по классу//
const themeBtn = document.getElementById('theme-toggle')//кнопка смены темы//
const statTotal = document.getElementById('stat-total')//счетчик всего//
const statDone = document.getElementById('stat-done')//счетчик выполнено//

//берем задачи из locflStorage (локальное хранилище браузера)//
//getitem возвращает строку или null если там ничего нет//
//json parse превращает строку обратно в массив. если null то берем пустой массив//
let tasks = JSON.parse(localStorage.getItem('tasks')) || []

let filter = 'all'//какой фильтр включен сейчас//
let query = ''//текст который ввел пользователь//

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
} //сохранение от json//

//защита от XSS//

function safe(str) {
    const d = document.createElement('div')
    d.textContent = str
    return d.innerHTML
} 



function render() {
    const shown = tasks.filter(t => {  //создает  новый массив оставляя только элементы с true//
        const byFilter = 
        filter === 'all' ||
        (filter === "active" && !t.done) ||
        (filter === 'done' && t.done) //условие 1: подхдит ли задача под фильтр?//
        //filter === all то берем все//
        //filter === active то берем где done === false//
        ///filter === done то берем где done === true//
        const bySearch = t.text.toLowerCase().includes(query.toLowerCase())
        //условие 2: содержит ли текст задачи то что введено в поиск?//
        //toLowerCase() приводит обе строки в нижний регистр чтобы было незавиисмо от больших букв//
        ///includes() проверяет есть ли подстрока внутри строки//
        return byFilter && bySearch
    })

    //if(shown.length === 0){
       // list.innerHTML = '<li class="empty"> Задач нет</li>'
    //}else{
       /// list.innerHTML = shown.map(t=>
       //     <li class="task-item ${t.done ? 'done' : "}" data-id="${t.id}">
      //  )
   // }
}