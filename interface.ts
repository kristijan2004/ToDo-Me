const input = document.getElementById('addInput') as HTMLInputElement
// const input1 = document.getElementById('addInput1') as HTMLInputElement
const addBtn = document.getElementById('addBtn') as HTMLButtonElement
let list = document.getElementById('list') as HTMLOListElement
let finishedList = document.getElementById('finishedList') as HTMLOListElement
const restoreBtn = document.getElementById('restoreBtn') as HTMLButtonElement
let paginationDiv = document.getElementById('pagination') as HTMLDivElement

type User = {
  name: string
  id: number
  date: Date
}

let todos: User[] = []
let finishedTodos: User[] = [
  { name: 'Become succesful', id: 0, date: new Date() },
  { name: 'Buy Milk', id: 1, date: new Date() },
  { name: 'Take the laundry', id: 2, date: new Date() }
]
var editEl: User
var deletedEl: User

function loadTodos() {
  let newTodos = localStorage.getItem('todos')
  let newFinishedTodos = localStorage.getItem('finishedTodos')
  if (newTodos) {
    todos = JSON.parse(newTodos)
    redrawList(todos)
  }
  if (newFinishedTodos) {
    finishedTodos = JSON.parse(newFinishedTodos)
    drawFinished()
  }
}
window.addEventListener('load', () => {
  loadTodos()
  drawFinished()
})

function nameCheck(inputName: string) {
  let item = todos.find((el) => el.name === inputName)
  if (item) {
    console.log('go ima')
  } else {
    console.log('go nema')
  }
}
// Function for matching the id with the element index.
function fixId(array: User[]): void {
  array.map((el) => (el.id = array.map((ele) => ele.name).indexOf(el.name)))
}
function drawFinished(): void {
  finishedList.innerHTML = ''
  finishedTodos.forEach((ele) => {
    let li = document.createElement('span')
    li.innerText = ele.name
    finishedList.append(li)
  })
}
//Function for redrawing the todo list using the "todos" array.
function redrawList(array: User[]) {
  list.innerHTML = ''
  array.forEach((el: User) => {
    let li = document.createElement('li')
    let deleteBtn = document.createElement('button')
    let finishBtn = document.createElement('button')
    let editBtn = document.createElement('button')
    // ------------------------------------------------------------
    finishBtn.setAttribute('class', 'finishBtn')
    finishBtn.addEventListener('click', (): void => {
      array.splice(el.id, 1)
      let finishedEl: User = el
      finishedTodos.push(finishedEl)
      if (finishedTodos.length == 10) {
        finishedTodos.splice(0, 1)
      }
      drawFinished()
      redrawList(array)
      fixId(array)
      localStorage.setItem('todos', JSON.stringify(array))
      localStorage.setItem('finishedTodos', JSON.stringify(finishedTodos))
    })
    // ---------------------------------------------------------------
    deleteBtn.setAttribute('class', 'deleteBtn')
    deleteBtn.addEventListener('click', (): void => {
      array.splice(el.id, 1)
      deletedEl = el
      fixId(array)
      redrawList(array)
      localStorage.setItem('todos', JSON.stringify(array))
      restoreBtn.disabled = false
    })
    li.innerHTML = `<p class="testP">${el.name}</p>`
    let liDiv = document.createElement('div')
    let checkImg = document.createElement('img')
    let deleteImg = document.createElement('img')
    checkImg.setAttribute('src', './Images/done.png')
    deleteImg.setAttribute('src', './Images/delete.png')
    finishBtn.append(checkImg)
    deleteBtn.append(deleteImg)
    li.append(liDiv)
    liDiv.append(deleteBtn, finishBtn, editBtn)
    list.append(li)
    li.setAttribute('class', 'toDoLi')
  })
}
function toDoPagination() {
  let pages = Math.ceil(todos.length / 5)
  paginationDiv.innerHTML = ''
  for (let i = 1; i <= pages; i++) {
    let pagiSpan = document.createElement('span')
    pagiSpan.setAttribute('id', i.toString())
    pagiSpan.innerText = i.toString()
    paginationDiv.append(pagiSpan)
  }
}
restoreBtn.addEventListener('click', (e): void => {
  e.preventDefault()
  todos.splice(deletedEl.id, 0, deletedEl)
  redrawList(todos)
  fixId(todos)
  restoreBtn.disabled = true
})
addBtn.addEventListener('click', (e): void => {
  // let num: number = parseInt(input1.value)
  e.preventDefault()
  if (input.value !== '') {
    let nam: string = input.value
    let date = new Date()
    let user1: User = {
      name: nam,
      id: todos.length,
      date: date
    }

    let item = todos.find((el) => el.name === nam)
    if (item) {
      console.log('go ima')
    } else {
      todos.push(user1)
      localStorage.setItem('todos', JSON.stringify(todos))
      redrawList(todos)
      input.value = ''
    }
  }
  toDoPagination()
  fixId(todos)
})
