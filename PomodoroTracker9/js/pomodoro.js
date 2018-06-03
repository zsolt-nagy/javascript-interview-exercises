import Timer from './Timer';

var columns = [
    'Done',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Later'
];

var kanbanBoard = document.querySelector( '.js-kanban-board' );
var pomodoroForm = document.querySelector( '.js-add-task' );
var modalAddTaskCancel = 
    document.querySelector( '.js-add-task-cancel' ); 

var cardTemplate = ( { task, id, columnIndex } ) => `
    <div class="task  js-task ${ task.selected ? 'selected' : '' }" 
         data-id="${id}" 
         draggable="${ task.selected ? "true" : "false" }"
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

var columnTemplate = ( { header } ) => `
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

var getEmptyBoard = columnNames => columnNames.map( header => {
    return {
        header,
        tasks: []
    };
} );  

let board = loadState();
renderTable();

var updateTime = newTime => {
    document.querySelector( '.js-time-remaining' ).innerHTML = newTime;
    if ( newTime == '0:00' ) {
        timer.reset();
        timer.start();
        increaseSelectedTaskPomodoroDone();
        saveAndRenderState();
    }
}
const timer = new Timer(/* 25 * 60*/5, updateTime );
document.querySelector( '.js-start-timer' )
        .addEventListener( 'click', () => timer.start() );
document.querySelector( '.js-pause-timer' )
        .addEventListener( 'click', () => timer.pause() );
document.querySelector( '.js-stop-timer' )
        .addEventListener( 'click', () => timer.reset() );
setupTimer();

var addCardModal = new RModal(
    document.getElementById('form-modal'), {}
);

function openCreateTaskModal( columnLabel ) {
    const columnIndex = columns.indexOf( columnLabel );
    document.querySelector( '.js-column-chooser' ).value = columnIndex;
    addCardModal.open();
}

modalAddTaskCancel.addEventListener( 'click', e => {
    e.preventDefault();
    addCardModal.close();
} );

function renderEmptyBoard( board ) {
    kanbanBoard.innerHTML =
        board.map( columnTemplate ).join( '' );
    addColumnDropListeners();    
}

function getDroppedColumnName( e ) {
    for ( let node of e.path ) { 
        if ( typeof node.classList === 'undefined' ) break;
        const match = 
            node.classList.value.match( /.*-(.+?)-column-body/ );
        if ( match && typeof match[1] === 'string' ) {
            return match[1]; 
        }
    }
}

function moveSelectedCard( toColumn ) {
    for ( let { header, tasks } of board ) {
        if ( header === toColumn ) continue;
        for ( let i = 0; i < tasks.length; ++i ) {
            if ( tasks[i].selected ) {
                const selectedTask = tasks[i];
                tasks.splice( i, 1 );
                let columnIndex = columns.indexOf( toColumn ); 
                board[ columnIndex ].tasks.push( selectedTask );
                saveAndRenderState();
            }
        }
    }
}

function dropCard( e ) {
    const newColumn = getDroppedColumnName( e );
    if ( typeof newColumn === 'string' ) {
        moveSelectedCard( newColumn );
    }
}

function addColumnDropListeners() {
    const columns = document.querySelectorAll( '.task-column' );
    for ( let column of columns ) {
        column.addEventListener( 'dragover', e => {
            e.preventDefault();
        });
        column.addEventListener( 'dragenter', e => {
            e.preventDefault();
        });  
        column.addEventListener( 'drop', dropCard );          
    }
}


function saveState( tasks ) {
    localStorage.setItem( 'board', JSON.stringify( board ) );
}

function loadState() {
    return JSON.parse( localStorage.getItem( 'board' ) ) || getEmptyBoard( columns ); 
}

var addTask = function( event ) {
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


function finishTask(taskId, columnIndex) {
    board[ columnIndex ].tasks[ taskId ].finished = true;
}

function increaseSelectedTaskPomodoroDone() {
    let { taskId, columnIndex } = getSelectedTaskInfo() || {}; 
    if ( typeof taskId === 'number' && typeof columnIndex === 'number' ) {
        increasePomodoroDone( taskId, columnIndex );
    }
}

function increasePomodoroDone(taskId, columnIndex) {
    board[ columnIndex ].tasks[ taskId ].pomodoroDone += 1;
}

function deleteTask(taskId, columnIndex) {
    board[ columnIndex ].tasks.splice( taskId, 1 );
}

function getSelectedTaskInfo() {
    for ( let columnIndex = 0; 
          columnIndex < board.length; 
          ++columnIndex ) {
        let { tasks } = board[ columnIndex ];
        for ( let taskId = 0; taskId < tasks.length; ++taskId ) {
            if ( tasks[taskId].selected ) {
                return { 
                    columnIndex,
                    taskName: tasks[taskId].taskName,
                    taskId 
                };  
            }
        }
    }

    return null;
}

function getSelectedTaskName() {
    const info = getSelectedTaskInfo();
    if ( info == null ) return '';
    return info.taskName;
}

function setupTimer() {
    timer.reset();
    document.querySelector( '.js-selected-task-label' )
            .innerHTML = getSelectedTaskName();
}


var deselectAllTasks = () => {
    for ( let column of board ) {
        for ( let task of column.tasks ) {
            delete task.selected;
        }
    }   
}


var selectTask = (taskId, columnIndex, target) => { 
    deselectAllTasks();
    board[ columnIndex ].tasks[ taskId ].selected = true;
    setupTimer();
}


var handleTaskButtonClick = function( { target } ) { 
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
    /js-task/.test( classList ) ? selectTask( taskId, columnIndex, target ) :
    null;

    saveAndRenderState();
}

kanbanBoard.addEventListener( 'click', handleTaskButtonClick );


