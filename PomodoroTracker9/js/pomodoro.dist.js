/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/pomodoro.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/Timer.js":
/*!*********************!*\
  !*** ./js/Timer.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Timer = function () {\n    function Timer(countdownInitialValue, displayTimeCallback) {\n        _classCallCheck(this, Timer);\n\n        this.countdownInitialValue = countdownInitialValue;\n        this.secondsLeft = countdownInitialValue;\n        this.interval = null;\n        this.displayTimeCallback = displayTimeCallback;\n        this.displayTimeCallback(this.toString());\n    }\n\n    _createClass(Timer, [{\n        key: 'toString',\n        value: function toString() {\n            var minutes = Math.floor(this.secondsLeft / 60);\n            var seconds = ('' + this.secondsLeft % 60).padStart(2, '0');\n            return minutes + ':' + seconds;\n        }\n    }, {\n        key: 'start',\n        value: function start() {\n            var _this = this;\n\n            if (typeof this.interval === 'number') {\n                return;\n            }\n            var startTimestamp = Date.now();\n            var startSeconds = this.secondsLeft;\n            this.interval = setInterval(function () {\n                var oldSecondsLeft = _this.secondsLeft;\n                var secondsPassed = Math.floor((Date.now() - startTimestamp) / 1000);\n                _this.secondsLeft = Math.max(0, startSeconds - secondsPassed);\n                if (_this.secondsLeft < oldSecondsLeft) {\n                    _this.displayTimeCallback(_this.toString());\n                }\n                if (_this.secondsLeft == 0) {\n                    clearInterval(_this.interval);\n                }\n            }, 100);\n        }\n    }, {\n        key: 'pause',\n        value: function pause() {\n            if (typeof this.interval === 'number') {\n                clearInterval(this.interval);\n                this.interval = null;\n            }\n        }\n    }, {\n        key: 'reset',\n        value: function reset() {\n            this.pause();\n            this.secondsLeft = this.countdownInitialValue;\n            this.displayTimeCallback(this.toString());\n        }\n    }]);\n\n    return Timer;\n}();\n\nexports.default = Timer;\n\n//# sourceURL=webpack:///./js/Timer.js?");

/***/ }),

/***/ "./js/pomodoro.js":
/*!************************!*\
  !*** ./js/pomodoro.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _Timer = __webpack_require__(/*! ./Timer */ \"./js/Timer.js\");\n\nvar _Timer2 = _interopRequireDefault(_Timer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar columns = ['Done', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Later'];\n\nvar kanbanBoard = document.querySelector('.js-kanban-board');\nvar pomodoroForm = document.querySelector('.js-add-task');\nvar modalAddTaskCancel = document.querySelector('.js-add-task-cancel');\n\nvar cardTemplate = function cardTemplate(_ref) {\n    var task = _ref.task,\n        id = _ref.id,\n        columnIndex = _ref.columnIndex;\n    return '\\n    <div class=\"task  js-task ' + (task.selected ? 'selected' : '') + '\" \\n         data-id=\"' + id + '\" \\n         draggable=\"' + (task.selected ? \"true\" : \"false\") + '\"\\n         data-column-index=\"' + columnIndex + '\">\\n        <span class=\"task__name  js-task-child\">\\n            ' + task.taskName + '\\n        </span>\\n        <span class=\"task__pomodori  js-task-child\">\\n            ' + task.pomodoroDone + ' / ' + task.pomodoroCount + ' pomodori\\n        </span>\\n        <div class=\"task__controls  js-task-child\">\\n        ' + (task.finished ? 'Finished' : '\\n            <span class=\"task-controls__icon  js-task-done\"\\n                  data-id=\"' + id + '\"\\n                  data-column-index=\"' + columnIndex + '\">\\u2714</span>\\n            <span class=\"task-controls__icon  js-increase-pomodoro\"\\n                  data-id=\"' + id + '\"\\n                  data-column-index=\"' + columnIndex + '\">\\u2795</span>') + '\\n            <span class=\"task-controls__icon  js-delete-task\"\\n                  data-id=\"' + id + '\"\\n                  data-column-index=\"' + columnIndex + '\">\\uD83D\\uDDD1</span>\\n        </div>\\n    </div>\\n';\n};\n\nvar columnTemplate = function columnTemplate(_ref2) {\n    var header = _ref2.header;\n    return '\\n    <div class=\"task-column\">\\n        <div class=\"task-column__header\">\\n            ' + header + '\\n            <span class=\"task-controls__icon  js-task-create\"\\n                  data-column-index=\"' + header + '\">\\u2795</span>            \\n        </div>\\n        <div class=\"task-column__body  js-' + header + '-column-body\"\\n             data-name=\"' + header + '\">             \\n        </div>\\n    </div>\\n';\n};\n\nvar getEmptyBoard = function getEmptyBoard(columnNames) {\n    return columnNames.map(function (header) {\n        return {\n            header: header,\n            tasks: []\n        };\n    });\n};\n\nvar board = loadState();\nrenderTable();\n\nvar updateTime = function updateTime(newTime) {\n    document.querySelector('.js-time-remaining').innerHTML = newTime;\n    if (newTime == '0:00') {\n        timer.reset();\n        timer.start();\n        increaseSelectedTaskPomodoroDone();\n        saveAndRenderState();\n    }\n};\nvar timer = new _Timer2.default( /* 25 * 60*/5, updateTime);\ndocument.querySelector('.js-start-timer').addEventListener('click', function () {\n    return timer.start();\n});\ndocument.querySelector('.js-pause-timer').addEventListener('click', function () {\n    return timer.pause();\n});\ndocument.querySelector('.js-stop-timer').addEventListener('click', function () {\n    return timer.reset();\n});\nsetupTimer();\n\nvar addCardModal = new RModal(document.getElementById('form-modal'), {});\n\nfunction openCreateTaskModal(columnLabel) {\n    var columnIndex = columns.indexOf(columnLabel);\n    document.querySelector('.js-column-chooser').value = columnIndex;\n    addCardModal.open();\n}\n\nmodalAddTaskCancel.addEventListener('click', function (e) {\n    e.preventDefault();\n    addCardModal.close();\n});\n\nfunction renderEmptyBoard(board) {\n    kanbanBoard.innerHTML = board.map(columnTemplate).join('');\n    addColumnDropListeners();\n}\n\nfunction getDroppedColumnName(e) {\n    var _iteratorNormalCompletion = true;\n    var _didIteratorError = false;\n    var _iteratorError = undefined;\n\n    try {\n        for (var _iterator = e.path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n            var node = _step.value;\n\n            if (typeof node.classList === 'undefined') break;\n            var match = node.classList.value.match(/.*-(.+?)-column-body/);\n            if (match && typeof match[1] === 'string') {\n                return match[1];\n            }\n        }\n    } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n    } finally {\n        try {\n            if (!_iteratorNormalCompletion && _iterator.return) {\n                _iterator.return();\n            }\n        } finally {\n            if (_didIteratorError) {\n                throw _iteratorError;\n            }\n        }\n    }\n}\n\nfunction moveSelectedCard(toColumn) {\n    var _iteratorNormalCompletion2 = true;\n    var _didIteratorError2 = false;\n    var _iteratorError2 = undefined;\n\n    try {\n        for (var _iterator2 = board[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n            var _ref4 = _step2.value;\n            var header = _ref4.header,\n                tasks = _ref4.tasks;\n\n            if (header === toColumn) continue;\n            for (var i = 0; i < tasks.length; ++i) {\n                if (tasks[i].selected) {\n                    var selectedTask = tasks[i];\n                    tasks.splice(i, 1);\n                    var columnIndex = columns.indexOf(toColumn);\n                    board[columnIndex].tasks.push(selectedTask);\n                    saveAndRenderState();\n                }\n            }\n        }\n    } catch (err) {\n        _didIteratorError2 = true;\n        _iteratorError2 = err;\n    } finally {\n        try {\n            if (!_iteratorNormalCompletion2 && _iterator2.return) {\n                _iterator2.return();\n            }\n        } finally {\n            if (_didIteratorError2) {\n                throw _iteratorError2;\n            }\n        }\n    }\n}\n\nfunction dropCard(e) {\n    var newColumn = getDroppedColumnName(e);\n    if (typeof newColumn === 'string') {\n        moveSelectedCard(newColumn);\n    }\n}\n\nfunction addColumnDropListeners() {\n    var columns = document.querySelectorAll('.task-column');\n    var _iteratorNormalCompletion3 = true;\n    var _didIteratorError3 = false;\n    var _iteratorError3 = undefined;\n\n    try {\n        for (var _iterator3 = columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n            var column = _step3.value;\n\n            column.addEventListener('dragover', function (e) {\n                e.preventDefault();\n            });\n            column.addEventListener('dragenter', function (e) {\n                e.preventDefault();\n            });\n            column.addEventListener('drop', dropCard);\n        }\n    } catch (err) {\n        _didIteratorError3 = true;\n        _iteratorError3 = err;\n    } finally {\n        try {\n            if (!_iteratorNormalCompletion3 && _iterator3.return) {\n                _iterator3.return();\n            }\n        } finally {\n            if (_didIteratorError3) {\n                throw _iteratorError3;\n            }\n        }\n    }\n}\n\nfunction saveState(tasks) {\n    localStorage.setItem('board', JSON.stringify(board));\n}\n\nfunction loadState() {\n    return JSON.parse(localStorage.getItem('board')) || getEmptyBoard(columns);\n}\n\nvar addTask = function addTask(event) {\n    event.preventDefault();\n    addCardModal.close();\n    var taskName = this.querySelector('.js-task-name').value;\n    var pomodoroCount = this.querySelector('.js-pomodoro-count').value;\n    var dayIndex = this.querySelector('.js-column-chooser').value;\n    this.reset();\n    board[dayIndex].tasks.push({\n        taskName: taskName,\n        pomodoroDone: 0,\n        pomodoroCount: pomodoroCount,\n        finished: false\n    });\n    saveAndRenderState();\n};\n\npomodoroForm.addEventListener('submit', addTask);\n\nfunction saveAndRenderState() {\n    renderTable();\n    saveState();\n}\n\nfunction renderTable() {\n    renderEmptyBoard(board);\n    for (var i = 0; i < board.length; ++i) {\n        var column = board[i];\n        renderTasks(document.querySelector('.js-' + column.header + '-column-body'), column.tasks, i);\n    }\n}\n\nfunction renderTasks(tBodyNode) {\n    var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n    var columnIndex = arguments[2];\n\n    tBodyNode.innerHTML = tasks.map(function (task, id) {\n        return cardTemplate({ task: task, id: id, columnIndex: columnIndex });\n    }).join('');\n}\n\nfunction finishTask(taskId, columnIndex) {\n    board[columnIndex].tasks[taskId].finished = true;\n}\n\nfunction increaseSelectedTaskPomodoroDone() {\n    var _ref5 = getSelectedTaskInfo() || {},\n        taskId = _ref5.taskId,\n        columnIndex = _ref5.columnIndex;\n\n    if (typeof taskId === 'number' && typeof columnIndex === 'number') {\n        increasePomodoroDone(taskId, columnIndex);\n    }\n}\n\nfunction increasePomodoroDone(taskId, columnIndex) {\n    board[columnIndex].tasks[taskId].pomodoroDone += 1;\n}\n\nfunction deleteTask(taskId, columnIndex) {\n    board[columnIndex].tasks.splice(taskId, 1);\n}\n\nfunction getSelectedTaskInfo() {\n    for (var columnIndex = 0; columnIndex < board.length; ++columnIndex) {\n        var tasks = board[columnIndex].tasks;\n\n        for (var taskId = 0; taskId < tasks.length; ++taskId) {\n            if (tasks[taskId].selected) {\n                return {\n                    columnIndex: columnIndex,\n                    taskName: tasks[taskId].taskName,\n                    taskId: taskId\n                };\n            }\n        }\n    }\n\n    return null;\n}\n\nfunction getSelectedTaskName() {\n    var info = getSelectedTaskInfo();\n    if (info == null) return '';\n    return info.taskName;\n}\n\nfunction setupTimer() {\n    timer.reset();\n    document.querySelector('.js-selected-task-label').innerHTML = getSelectedTaskName();\n}\n\nvar deselectAllTasks = function deselectAllTasks() {\n    var _iteratorNormalCompletion4 = true;\n    var _didIteratorError4 = false;\n    var _iteratorError4 = undefined;\n\n    try {\n        for (var _iterator4 = board[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {\n            var column = _step4.value;\n            var _iteratorNormalCompletion5 = true;\n            var _didIteratorError5 = false;\n            var _iteratorError5 = undefined;\n\n            try {\n                for (var _iterator5 = column.tasks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {\n                    var task = _step5.value;\n\n                    delete task.selected;\n                }\n            } catch (err) {\n                _didIteratorError5 = true;\n                _iteratorError5 = err;\n            } finally {\n                try {\n                    if (!_iteratorNormalCompletion5 && _iterator5.return) {\n                        _iterator5.return();\n                    }\n                } finally {\n                    if (_didIteratorError5) {\n                        throw _iteratorError5;\n                    }\n                }\n            }\n        }\n    } catch (err) {\n        _didIteratorError4 = true;\n        _iteratorError4 = err;\n    } finally {\n        try {\n            if (!_iteratorNormalCompletion4 && _iterator4.return) {\n                _iterator4.return();\n            }\n        } finally {\n            if (_didIteratorError4) {\n                throw _iteratorError4;\n            }\n        }\n    }\n};\n\nvar selectTask = function selectTask(taskId, columnIndex, target) {\n    deselectAllTasks();\n    board[columnIndex].tasks[taskId].selected = true;\n    setupTimer();\n};\n\nvar handleTaskButtonClick = function handleTaskButtonClick(_ref6) {\n    var target = _ref6.target;\n\n    if (/js-task-child/.test(target.className)) {\n        target = target.parentNode;\n    }\n    var classList = target.className;\n    var taskId = target.dataset.id;\n    var columnIndex = target.dataset.columnIndex;\n\n    /js-task-done/.test(classList) ? finishTask(taskId, columnIndex) : /js-increase-pomodoro/.test(classList) ? increasePomodoroDone(taskId, columnIndex) : /js-delete-task/.test(classList) ? deleteTask(taskId, columnIndex) : /js-task-create/.test(classList) ? openCreateTaskModal(columnIndex) : /js-task/.test(classList) ? selectTask(taskId, columnIndex, target) : null;\n\n    saveAndRenderState();\n};\n\nkanbanBoard.addEventListener('click', handleTaskButtonClick);\n\n//# sourceURL=webpack:///./js/pomodoro.js?");

/***/ })

/******/ });