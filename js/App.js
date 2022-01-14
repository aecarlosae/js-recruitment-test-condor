/**
 * By Carlos Espinoza | Recruitment test | Condor Digital Agency
 * 
 * Designed to demonstrate skills in JavaScript.
 **/

import Todo from './Todo.js';

class App {
    constructor() {
        this.todo = new Todo();
        this.addTaskListener();
        this.renderTodoList();
        this.addSearchListener();
        this.addListSwitcherListener();
    }

    addSearchListener() {
        let self = this;

        document.querySelector('.rt-todo-search').addEventListener('keyup', (event) => {
            let todos = self.todo.findBy(event.target.value);
            document.querySelector('#todo-list').innerHTML = '';
            self.renderTodoList(todos);
        });
    }

    addListSwitcherListener() {
        let self = this;
        document.querySelector('.rt-done-list').addEventListener('click', (event) => {
            let showDefaultItem = true;

            self.todo.todos.forEach((o, i) => {
                if (o.status == self.todo.DONE) {
                    showDefaultItem = false;
                    return;
                }
            });

            if (showDefaultItem) {
                document.querySelector('.rt-no-tasks-yet').classList.remove('hidden');
            }

            if (self.todo.todos.length == 0) {
                return;
            }

            document.querySelector('#todo-list').innerHTML = '';
            self.renderTodoList(self.todo.todos, true);
            document.querySelector('.rt-all-list').classList.remove('hidden');
            document.querySelector('.rt-done-list').classList.add('hidden')
        });

        document.querySelector('.rt-all-list').addEventListener('click', (event) => {
            if (self.todo.todos.length == 0) {
                return;
            }

            document.querySelector('.rt-no-tasks-yet').classList.add('hidden');

            document.querySelector('#todo-list').innerHTML = '';
            self.renderTodoList(self.todo.todos);
            document.querySelector('.rt-all-list').classList.add('hidden');
            document.querySelector('.rt-done-list').classList.remove('hidden')
        });
    }

    addTaskListener() {
        let self = this;
        document.querySelector('#rt-add-task-btn').addEventListener('click', () => {
            if (self.todo.CREATING) {
                return;
            }

            document.querySelector('.rt-no-tasks-yet').classList.add('hidden');

            var tplContent = document.querySelector('template').content;
            let itemTpl = tplContent.querySelector('.rt-todo-app-editing-item-tpl').cloneNode(true);
            let list = document.querySelector('#todo-list');
            let li = document.createElement('li');

            li.appendChild(itemTpl);
            list.insertBefore(li, list.querySelectorAll('li')[0]);

            self.todo.CREATING = true;
            itemTpl.querySelector('.rt-content-field').focus();

            itemTpl.querySelector('.rt-delete-link').addEventListener('click', (event) => {
                event.target.closest('ul').removeChild(
                    event.target.closest('.rt-todo-app-editing-item-tpl').parentNode
                );
                self.todo.CREATING = false;
            });

            itemTpl.querySelector('.rt-reset-link').addEventListener('click', (event) => {
                itemTpl.querySelector('.rt-content-field').value = '';
            });

            // Add listener
            itemTpl.querySelector('.rt-add-link').addEventListener('click', () => {
                self.saveTodo(itemTpl, li);
            });

            itemTpl.querySelector('.rt-content-field').addEventListener('keyup', (event) => {
                if (event.key === 'Enter' || event.keyCode === 13) {
                    self.saveTodo(itemTpl, li);
                }
            });
        });
    }

    saveTodo(itemTpl, li, id = null) {
        if (/^\s*$/.test(itemTpl.querySelector('.rt-content-field').value.trim())) {
            itemTpl.querySelector('.rt-content-field').focus();
            return;
        }

        let self = this;
        let todo = {
            id: id != null ? id : self.todo.todos.length + 1,
            content: itemTpl.querySelector('.rt-content-field').value,
            editing: false,
            status: itemTpl.querySelector('.rt-mark-as-done').checked ? self.todo.DONE : self.todo.PENDING,
            created_at: new Date()
        };

        if (id == null) {
            self.todo.add(todo);
        } else {
            self.todo.edit(todo, self.todo.getIndexById(id));
        }

        li.innerHTML = '';

        var tplContent = document.querySelector('template').content;
        let newItemTpl = tplContent.querySelector('.rt-todo-app-item-tpl').cloneNode(true);

        newItemTpl.querySelector('.rt-todo-app-todo-content').appendChild(
            document.createTextNode(todo.content)
        );
        if (itemTpl.querySelector('.rt-mark-as-done').checked) {
            newItemTpl.querySelector('.rt-todo-app-todo-content').classList.add('text-gray-600');
        }

        newItemTpl.querySelector('.rt-delete-link').setAttribute('data-id', todo.id);
        newItemTpl.querySelector('.rt-mark-as-done').setAttribute('data-id', todo.id);
        newItemTpl.querySelector('.rt-edit-link').setAttribute('data-id', todo.id);
        newItemTpl.querySelector('.rt-mark-as-done').checked = itemTpl.querySelector('.rt-mark-as-done').checked;

        newItemTpl.querySelector('.rt-delete-link').addEventListener('click', (event) => {
            self.todo.deleteBy(newItemTpl.querySelector('.rt-delete-link').dataset.id);
            li.parentNode.removeChild(li);
        });
        newItemTpl.querySelector('.rt-edit-link').addEventListener('click', (event) => {
            self.editTodo(newItemTpl.querySelector('.rt-edit-link').dataset.id, itemTpl, li);
        });
        newItemTpl.querySelector('.rt-mark-as-done').addEventListener('change', (event) => {
            if (event.target.checked) {
                self.todo.markAsDone(event.target.dataset.id);
                newItemTpl.querySelector('.rt-todo-app-todo-content').classList.add('text-gray-600');
            } else {
                newItemTpl.querySelector('.rt-todo-app-todo-content').classList.remove('text-gray-600');
                self.todo.markAsPending(event.target.dataset.id);
            }
        });

        li.appendChild(newItemTpl);
    }

    renderTodoList(todos = null, onlyDone = false) {
        var tplContent = document.querySelector('template').content;
        let self = this;

        if (todos == null) {
            todos = self.todo.todos;

            if (todos.length == 0) {
                document.querySelector('.rt-no-tasks-yet').classList.remove('hidden');
            }
        }

        todos.forEach((todo, index) => {
            if (onlyDone && todo.status != self.todo.DONE) {
                return;
            }

            let itemTpl = tplContent.querySelector('.rt-todo-app-item-tpl').cloneNode(true);
            let li = document.createElement('li');

            if (todo.status == self.todo.DONE) {
                itemTpl.querySelector('.rt-todo-app-todo-content').classList.add('text-gray-600');
                itemTpl.querySelector('.rt-mark-as-done').checked = true;
            }

            itemTpl.querySelector('.rt-todo-app-todo-content').appendChild(document.createTextNode(todo.content));
            itemTpl.querySelector('.rt-delete-link').setAttribute('data-id', todo.id);
            itemTpl.querySelector('.rt-mark-as-done').setAttribute('data-id', todo.id);
            itemTpl.querySelector('.rt-edit-link').setAttribute('data-id', todo.id);
            itemTpl.querySelector('.rt-delete-link').addEventListener('click', (event) => {
                self.todo.deleteBy(itemTpl.querySelector('.rt-delete-link').dataset.id);
                li.parentNode.removeChild(li);
            });
            itemTpl.querySelector('.rt-edit-link').addEventListener('click', (event) => {
                self.editTodo(itemTpl.querySelector('.rt-edit-link').dataset.id, itemTpl, li);
            });
            itemTpl.querySelector('.rt-mark-as-done').addEventListener('change', (event) => {
                if (event.target.checked) {
                    self.todo.markAsDone(event.target.dataset.id);
                    itemTpl.querySelector('.rt-todo-app-todo-content').classList.add('text-gray-600');
                } else {
                    itemTpl.querySelector('.rt-todo-app-todo-content').classList.remove('text-gray-600');
                    self.todo.markAsPending(event.target.dataset.id);
                }
            });
            li.appendChild(itemTpl);
            document.querySelector('#todo-list').appendChild(li);
        });
    }

    editTodo(id, itemTpl, li) {
        let tplContent = document.querySelector('template').content;
        let newItemTpl = tplContent.querySelector('.rt-todo-app-editing-item-tpl').cloneNode(true);
        let self = this;

        li.innerHTML = '';

        newItemTpl.querySelector('.rt-content-field').value = this.todo.todos[this.todo.getIndexById(id)].content;
        newItemTpl.querySelector('.rt-delete-link').setAttribute(
            'data-id',
            this.todo.todos[this.todo.getIndexById(id)].id
        );
        newItemTpl.querySelector('.rt-add-link').setAttribute(
            'data-id',
            this.todo.todos[this.todo.getIndexById(id)].id
        );
        newItemTpl.querySelector('.rt-reset-link').addEventListener('click', (event) => {
            newItemTpl.querySelector('.rt-content-field').value = '';
        });
        newItemTpl.querySelector('.rt-delete-link').addEventListener('click', (event) => {
            event.target.closest('ul').removeChild(
                event.target.closest('.rt-todo-app-editing-item-tpl').parentNode
            );
            self.todo.deleteBy(newItemTpl.querySelector('.rt-delete-link').dataset.id);
            self.todo.CREATING = false;
        });
        newItemTpl.querySelector('.rt-add-link').addEventListener('click', () => {
            self.saveTodo(newItemTpl, li, newItemTpl.querySelector('.rt-add-link').dataset.id);
        });
        newItemTpl.querySelector('.rt-content-field').addEventListener('keyup', (event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                self.saveTodo(newItemTpl, li, newItemTpl.querySelector('.rt-add-link').dataset.id);
            }
        });

        li.appendChild(newItemTpl);
    }
}

(new App());