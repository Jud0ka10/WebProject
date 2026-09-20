//document=вся страница, getElementById= ищет элемент по айди//

const input = document.getElementById('task-input') //полк для задач//
const addBtn = document.getElementById('add-btn') //"добавить"
const list = document.getElementById('task-list') //куда попадут задачи//
const search = document.getElementById('search-input')//полк поиска//
const filterBtns = document.querySelectorAll('.filter-btn')//все кнопки фильтры по классу//
const themeBtn = document.getElementById('theme-toggle')//кнопка смены темы//
const statTotal = document.getElementById('stat-total')//счетчик всего//
const statDone = document.getElementById('stat-done')//счетчик выполнено//
const statActive = document.getElementById('stat-active') 

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

   if (shown.length === 0) {
    list.innerHTML = '<li class="empty">Нет миссий</li>' //если после фильрации ничего не осталось то показываем соо//
   } else {
    list.innerHTML = ""; //очищаем список//
    shown.forEach(t => {
        const li = document.createElement('li'); 
        li.className = t.done ? 'task-item done': 'task-item' //done eсли задача выполнена
        li.dataset.id = t.id //записываем айди зпдпчи в атрибут
        li.innerHTML = `<input type="checkbox" class="task-checkbox" ${t.done ?'checked': ""}>` +
        `<span class="task-text">${safe(t.text)}</span>` +
        `<button class="task-btn edit" title="Изменить">✏️</button>` +
        `<button class="task-btn delete" title="Удалить">🗑️</button>` //наполняем штмл элемент чекбокс+текст+кнопки
        //safe text экранирует текст пользователя чтобы он не выполнился как джс или штмл
        list.appendChild(li)  //прикрепляем готовый элемент к <ul>
    })
   }
   const done = tasks.filter(t=> t.done).length //считаем сколько задач выолнено и фльтр оставит только выполненые
   statTotal.textContent = `Всего:${tasks.length}`
   statActive.textContent = `Активных:${tasks.length-done}`//всего минус выолненные
   statDone.textContent = `Выполнено:${done}`
   //меняем текст в счетчиках
}


function add(){
    const text = input.value.trim() //value=что сейчас в поле, trim=убирает пробелы по краям

    if (!text) return //если после trim получилась пусьая строка = вызодим из функции
    // returnбез значения просто прерывает выполнение

    tasks.push({id: Date.now(), text, done: false})
    //push добавляет новый объект в конец массива
    //Date.now текущее время в млсек
    //{...} короткая запись когла имя переменной совпадает с ключом

    input.value = ""//очищаем поле ввода
    save() // сохранем в locflstorage
    render() //перерисовываем список
}
//addeventlestener полдписыввается нв событиеи вызывает функцию когда оно случтся
addBtn.addEventListener('click', add) //клик по кнопке add

input.addEventListener('keydown', e => {
    if (e.key === 'Enter') add()
}) //нажатие клавишщ псоле ввода
//е = объект события, e.key = название нажатой клавиши
// если enter то вызвваем add()


list.addEventListener('click', e => {
    const li = e.target.closest('task-item') //ищем жлеемнты по айди
    if (!li) return

    const id = +li.dataset.id

    const task = tasks.find(t => t.id === id) //возвращает первый элемент масива подходящий под услловие

    if(e.target.classList.contains('delete')) {
        tasks = tasks.filter(t => t.id !== id)
    } //classlist.contains проверяет есть ли элемента такой класс
    //filter оставляет все задачи, кроме той, чей id совпал

    else if(e.target.classList.contains('edit')) {
        const newText = prompt('Изменить задачу:', task.text) //promptпоказывает окошко с полем ввода, возвращает строку или нул если пользователь нажал отмена
        if(!newText || !newText.trim()) return //пусто или отмена = выходим
        task.text = newText.trim() // меняем текст прямо в объекте зхадач
    }
    else if(e.target.classList.contains('task-checkbox')) {
        task.done = !task.done
    }
    else {
        return;
    }

    save()
    render()
})

filterBtns.ForEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        filter = btn.datatest.filter
        render()
    }) //фильтры
})


search.addEventListener('input', e => {
    query = e.target.value
    render()
}) //поиск

themeBtn.addEventListener('click', ()=> {
    const dark = document.body.style.background === 'rgb(28, 28, 30)' //смена темы на темную и проверка если она уже темная
    document.body.style.background = dark ? '#f5f5f7': '#1c1c1e'
    document.body.style.color = dark ? '#1d1d1f': '#f5f5f7' //тернарный оператор, переключаем фон и цвет в противоположные значение

    themeBtn.textContent = dark ? '☀️':'🌙'

    themeBtn.title = dark ?'Вкючить светлую тему': 'Включить тёмную тему'
})

render();


