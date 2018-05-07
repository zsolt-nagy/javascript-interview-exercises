const kanbanBoard = document.querySelector( '.js-kanban-board' );
const pomodoroForm = document.querySelector( '.js-add-task' );
const modalAddTaskCancel = 
    document.querySelector( '.js-add-task-cancel' ); 

const addCardModal = new RModal(
    document.getElementById('form-modal'), {}
);

const columnTemplate = ( { header } ) => `
    <div class="task-column">
        <div class="task-column__header">
            ${ header }
            <span class="task-controls__icon  js-task-create"
                  data-column-index="${header}">\u{2795}</span>            
        </div>
        <div class="task-column__body  js-${ header }-column-body"
             data-name="${ header }">             
        </div>
    </div>
`;

const openCreateTaskModal = columnLabel => {
    const columnIndex = columns.indexOf( columnLabel );
    document.querySelector( '.js-column-chooser' ).value = columnIndex;
    addCardModal.open();
}

modalAddTaskCancel.addEventListener( 'click', e => {
    e.preventDefault();
    addCardModal.close();
} );

const cardTemplate = ( { task, id, columnIndex } ) => `
    <div class="task  js-task ${ task.selected ? 'selected' : '' }" 
         data-id="${id}" 
         data-column-index="${columnIndex}">
        <span class="task__name  js-task-child">
            ${task.taskName}
        </span>
        <span class="task__pomodori  js-task-child">
            ${task.pomodoroDone} / ${task.pomodoroCount} pomodori
        </span>
        <div class="task__controls  js-task-child">
        ${ task.finished ? 'Finished' : `
            <span class="task-controls__icon  js-task-done"
                  data-id="${id}"
                  data-column-index="${columnIndex}">\u{2714}</span>
            <span class="task-controls__icon  js-increase-pomodoro"
                  data-id="${id}"
                  data-column-index="${columnIndex}">\u{2795}</span>`
        }
            <span class="task-controls__icon  js-delete-task"
                  data-id="${id}"
                  data-column-index="${columnIndex}">\u{1f5d1}</span>
        </div>
    </div>
`;

let columns = [
    'Done',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Later'
];

const getEmptyBoard = columnNames => columnNames.map( header => {
    return {
        header,
        tasks: []
    };
} );  

const renderEmptyBoard = board => {
    kanbanBoard.innerHTML =
        board.map( columnTemplate ).join( '' );
}


let board = loadState();
renderTable();


function saveState( tasks ) {
    localStorage.setItem( 'board', JSON.stringify( board ) );
}

function loadState() {
    return JSON.parse( localStorage.getItem( 'board' ) ) || getEmptyBoard( columns ); 
}

const addTask = function( event ) {
    event.preventDefault();
    addCardModal.close();
    const taskName = this.querySelector( '.js-task-name' ).value;
    const pomodoroCount = this.querySelector( '.js-pomodoro-count' ).value;
    const dayIndex = this.querySelector( '.js-column-chooser' ).value;
    this.reset();
    board[ dayIndex ].tasks.push( { 
        taskName, 
        pomodoroDone: 0,
        pomodoroCount, 
        finished: false 
    } );
    saveAndRenderState();
}

pomodoroForm.addEventListener( 'submit', addTask );

function saveAndRenderState() {
    renderTable();
    saveState();
}

function renderTable() {
    renderEmptyBoard( board );
    for ( let i = 0; i < board.length; ++i ) {
        let column = board[i];
        renderTasks(  
            document.querySelector( `.js-${ column.header }-column-body` ),
            column.tasks,
            i
        );        
    }
}


function renderTasks( tBodyNode, tasks = [], columnIndex ) {
    tBodyNode.innerHTML = tasks.map( ( task, id ) => 
        cardTemplate( { task, id, columnIndex } )
    ).join( '' );
}


const finishTask = (taskId, columnIndex) => {
    board[ columnIndex ].tasks[ taskId ].finished = true;
}

const increasePomodoroDone = (taskId, columnIndex) => {
    board[ columnIndex ].tasks[ taskId ].pomodoroDone += 1;
}

const deleteTask = (taskId, columnIndex) => {
    board[ columnIndex ].tasks.splice( taskId, 1 );
}


const deselectAllTasks = () => {
    for ( let column of board ) {
        for ( let task of column.tasks ) {
            delete task.selected;
        }
    }   
}

const selectTask = (taskId, columnIndex) => { 
    deselectAllTasks();
    board[ columnIndex ].tasks[ taskId ].selected = true;
}

const handleTaskButtonClick = function( { target } ) { 
    if ( /js-task-child/.test( target.className ) ) {
        target = target.parentNode;
    }
    const classList = target.className;
    const taskId = target.dataset.id;
    const columnIndex = target.dataset.columnIndex;

    /js-task-done/.test( classList ) ? finishTask( taskId, columnIndex ) :
    /js-increase-pomodoro/.test( classList ) ? increasePomodoroDone( taskId, columnIndex ) :
    /js-delete-task/.test( classList ) ? deleteTask( taskId, columnIndex ) : 
    /js-task-create/.test( classList ) ? openCreateTaskModal( columnIndex ) :
    /js-task/.test( classList ) ? selectTask( taskId, columnIndex ) :
    null;

    saveAndRenderState();
}

kanbanBoard.addEventListener( 'click', handleTaskButtonClick );




