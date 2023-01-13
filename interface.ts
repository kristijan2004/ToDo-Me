const input = document.getElementById('addInput') as HTMLInputElement
const addBtn = document.getElementById('addBtn') as HTMLButtonElement
const list = document.getElementById('list') as HTMLOListElement
const finishedList = document.getElementById('finishedList') as HTMLOListElement
const restoreBtn = document.getElementById('restoreBtn') as HTMLButtonElement
const paginationDiv = document.getElementById('pagination') as HTMLDivElement

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

//----------FUNCTION FOR FETHCING THE TODO LIST FROM THE LOCAL STORAGE AND DRAWING THEM INTO THE LIST------------
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

//------------- ON LOAD FUNCTION FOR DRAWING BOTH ACTIVE AND FINISHED ITEMS-----------------------------
window.addEventListener('load', () => {
  loadTodos()
  drawFinished()
})

// -------------------------Function for matching the id with the element index.----------------------------
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

//----------------Function for redrawing the todo list using the "todos" array.-------------------------------
function redrawList(array: User[]) {
  list.innerHTML = ''
  array.forEach((el: User) => {
    const li = document.createElement('li')
    li.innerHTML = `<p class="testP">${el.name}</p>`
    li.append(createButtons(el, array))
    list.append(li)
    li.setAttribute('class', 'toDoLi')
  })
}

// ------------------------FUNCTION FOR CREATING THE DELETE AND FINISH BUTTONS ON THE LI ELEMENT-------------------
function createButtons(el: User, array: User[]): HTMLDivElement {
  const deleteBtn = document.createElement('button')
  const finishBtn = document.createElement('button')
  deleteBtn.setAttribute('class', 'deleteBtn')
  finishBtn.setAttribute('class', 'finishBtn')
  let checkImg = document.createElement('img')
  let deleteImg = document.createElement('img')
  checkImg.setAttribute('src', './Images/done.png')
  deleteImg.setAttribute('src', './Images/delete.png')
  finishBtn.append(checkImg)
  deleteBtn.append(deleteImg)
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
  deleteBtn.addEventListener('click', (): void => {
    array.splice(el.id, 1)
    deletedEl = el
    fixId(array)
    redrawList(array)
    localStorage.setItem('todos', JSON.stringify(array))
    restoreBtn.disabled = false
  })
  const liDiv = document.createElement('div')
  liDiv.append(deleteBtn, finishBtn)
  return liDiv
}

//--------EVENT LISTENER ON THE RESTORE BUTTON FOR RESTORING THE DELETED ELEMENT INTO THE ACTIVE LIST---------
restoreBtn.addEventListener('click', (e): void => {
  e.preventDefault()
  todos.splice(deletedEl.id, 0, deletedEl)
  redrawList(todos)
  fixId(todos)
  restoreBtn.disabled = true
})

//-------- EVENT LISTENER ON THE ADD BUTTON FOR ADDING TODOS INTO THE ACTIVE LIST USING THE INPUT VALUE------------
addBtn.addEventListener('click', (e): void => {
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
      console.log('The item is already in the list.')
    } else {
      todos.push(user1)
      localStorage.setItem('todos', JSON.stringify(todos))
      redrawList(todos)
      input.value = ''
    }
  }
  fixId(todos)
})
