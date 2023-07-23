const taskForm = document.querySelector('#taskForm');
const taskTitle = document.querySelector('#taskTitle');
const taskContent = document.querySelector('#taskContent');
const deadlineInput = document.querySelector('#deadlineInput');
const taskPriority = document.querySelector('#taskPriority');
const taskList = document.querySelector('#taskList');


window.addEventListener('load', () =>{
    const tasks = JSON.parse(localStorage.getItem('taskList')) || []
    renderTasks(tasks)
})

const renderTasks = (tasks) => {
    taskList.innerHTML = ''

    const formatDate = (dataString) =>{
        const date = new Date(dataString)
        return date.toLocaleDateString('uk-UA')
    }

    const statusFilter = document.querySelector('#statusFilter').value;

    tasks.forEach((task, index) =>{
        const taskItem = document.createElement('li');
        taskItem.className = 'nav-item'
        const taskA = document.createElement('a');
        taskA.className = 'nav-link active'

        taskA.innerHTML = `Пріоритет: ${task.priority}; <br> Завдання: ${task.title}; <br> Опис завдання: ${task.content}; <br> Дата виконання: ${formatDate(task.date)}`
        taskItem.appendChild(taskA);

        const currentDate = new Date()
        const deadLine = new Date(task.date)
        if(currentDate>deadLine){
            taskA.classList.add('expired');
        }

        const deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-danger'
        deleteButton.innerText = 'Delete task'
        deleteButton.addEventListener('click', ()=>{
            const tasks = JSON.parse(localStorage.getItem('taskList'));
            tasks.splice(index, 1)
            localStorage.setItem('taskList', JSON.stringify(tasks))
            renderTasks(tasks)
        })

        const updateButton = document.createElement('button')
        updateButton.innerText = 'Update'
        updateButton.className = 'btn btn-primary'
        updateButton.addEventListener('click', ()=>{
            taskTitle.value = task.title
            taskContent.value = task.content
            taskPriority.value = task.priority;

            const dateObject = new Date(task.date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
            const day = String(dateObject.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            deadlineInput.value = formattedDate;

            const index = tasks.indexOf(task)

            tasks.splice(index, 1)
            localStorage.setItem('taskList', JSON.stringify(tasks))
            renderTasks(tasks)
        })

        const completeButton = document.createElement('button')
        completeButton.innerText = 'Виконано'
        if (task.completed) {
            completeButton.className = 'btn btn-success'
            taskA.classList.add('ready');
        } else {
            completeButton.className = 'btn btn-warning'
        }
        completeButton.addEventListener('click', () => {
            task.completed = !task.completed;
            localStorage.setItem('taskList', JSON.stringify(tasks));
            renderTasks(tasks);
        });

        if (statusFilter === 'all' || (statusFilter === 'completed' && task.completed) || (statusFilter === 'not-completed' && !task.completed)) {
            taskItem.insertAdjacentElement('beforeend', deleteButton)
            taskItem.insertAdjacentElement('beforeend', updateButton)
            taskItem.insertAdjacentElement('beforeend', completeButton)
            taskList.insertAdjacentElement('beforeend', taskItem)
        }
    })
}

document.querySelector('#statusFilter').addEventListener('change', () => {
    const tasks = JSON.parse(localStorage.getItem('taskList')) || []
    renderTasks(tasks)
})

taskForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const title = taskTitle.value;
    const content = taskContent.value;
    const date = new Date(deadlineInput.value);
    const priority = taskPriority.value;
    const newTask =
        {
            title,
            content,
            date,
            priority,
            completed: false,
        }
    const tasks = JSON.parse(localStorage.getItem('taskList')) || []
    tasks.push(newTask)
    localStorage.setItem('taskList', JSON.stringify(tasks))
    renderTasks(tasks)
    taskTitle.value = ''
    taskContent.value = ''
    deadlineInput.value = ''
    taskPriority.value = 'Низький';
})


