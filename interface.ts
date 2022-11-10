const input = document.getElementById('addInput') as HTMLInputElement
// const input1 = document.getElementById('addInput1') as HTMLInputElement
const addBtn = document.getElementById('addBtn') as HTMLButtonElement
const list = document.getElementById('list') as HTMLOListElement
const restoreBtn = document.getElementById('restoreBtn') as HTMLButtonElement

type User = {
  name: string
  id: number
  date: Date
}
let todos: User[] = []
let finishedTodos: User[] = []

var deletedEl: User

function loadTodos() {
  let newTodos = localStorage.getItem('todos')
  if (newTodos) {
    todos = JSON.parse(newTodos)
    redrawList()
  }
}
window.addEventListener('load', loadTodos)

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

//Function for redrawing the todo list using the "todos" array.
function redrawList() {
  list.innerHTML = ''
  todos.forEach((el) => {
    let li = document.createElement('li')
    let deleteBtn = document.createElement('button')
    let finishBtn = document.createElement('button')
    finishBtn.setAttribute('class', 'finishBtn')

    finishBtn.addEventListener('click', () => {
      todos.splice(el.id, 1)
      let finishedEl: User = el
      finishedTodos.push(finishedEl)
      redrawList()
      fixId(todos)
      localStorage.setItem('todos', JSON.stringify(todos))
    })
    deleteBtn.setAttribute('class', 'deleteBtn')

    deleteBtn.addEventListener('click', (): void => {
      todos.splice(el.id, 1)
      deletedEl = el
      fixId(todos)
      redrawList()
      localStorage.setItem('todos', JSON.stringify(todos))
      restoreBtn.disabled = false
    })
    li.innerText = `${el.name}`
    let liDiv = document.createElement('div')
    let checkImg = document.createElement('img')
    let deleteImg = document.createElement('img')
    checkImg.setAttribute('src', './Images/done.png')
    deleteImg.setAttribute('src', './Images/delete.png')
    finishBtn.append(checkImg)
    deleteBtn.append(deleteImg)
    li.append(liDiv)
    liDiv.append(deleteBtn, finishBtn)
    list.append(li)
  })
  console.log(todos)
}

restoreBtn.addEventListener('click', (e): void => {
  e.preventDefault()
  todos.splice(deletedEl.id, 0, deletedEl)
  redrawList()
  fixId(todos)
  restoreBtn.disabled = true
})
addBtn.addEventListener('click', (e): void => {
  // let num: number = parseInt(input1.value)
  e.preventDefault()
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
    redrawList()
    input.value = ''
  }
})
