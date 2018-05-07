let tasks = [];
const pomodoroForm = document.querySelector( '.js-add-task' );
const pomodoroColumn = document.querySelector( '.js-task-column-body' );

const addTask = function( event ) {
    event.preventDefault();
    const taskName = this.querySelector( '.js-task-name' ).value;
    const pomodoroCount = this.querySelector( '.js-pomodoro-count' ).value;
    this.reset();
    tasks.push( { 
        taskName, 
        pomodoroDone: 0,
        pomodoroCount, 
        finished: false 
    } );
    renderTasks( pomodoroColumn, tasks );
}

pomodoroForm.addEventListener( 'submit', addTask );


const renderTasks = function( tBodyNode, tasks = [] ) {
    tBodyNode.innerHTML = tasks.map( ( task, id ) => `
        <div class="task  js-task" data-id="0">
            <span class="task__name">${task.taskName}</span>
            <span class="task__pomodori">${task.pomodoroDone} / ${task.pomodoroCount} pomodori</span>
            <div class="task__controls">
            ${ task.finished ? 'Finished' : `
                <span class="task-controls__icon  js-task-done"
                      data-id="${id}">\u{2714}</span>
                <span class="task-controls__icon  js-increase-pomodoro"
                      data-id="${id}">\u{2795}</span>`
            }
                <span class="task-controls__icon  js-delete-task"
                      data-id="${id}">\u{1f5d1}</span>
            </div>
        </div>
    ` ).join( '' );
}


const finishTask = ( tasks, taskId ) => {
    tasks[ taskId ].finished = true;
}

const increasePomodoroDone = ( tasks, taskId ) => {
    tasks[ taskId ].pomodoroDone += 1;
}

const deleteTask = ( tasks, taskId ) => {
    tasks.splice( taskId, 1 );
}

const handleTaskButtonClick = function( event ) {
    const classList = event.target.className;
    const taskId = event.target.dataset.id;

    /js-task-done/.test( classList ) ? finishTask( tasks, taskId ) :
    /js-increase-pomodoro/.test( classList ) ? increasePomodoroDone( tasks, taskId ) :
    /js-delete-task/.test( classList ) ? deleteTask( tasks, taskId ) : 
    null;

    renderTasks( pomodoroColumn, tasks );
}

pomodoroColumn.addEventListener( 'click', handleTaskButtonClick );

