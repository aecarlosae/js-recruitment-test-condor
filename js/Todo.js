/**
 * By Carlos Espinoza | Recruitment test | Condor Digital Agency
 * 
 * Designed to demonstrate skills in JavaScript.
 **/

class Todo {
    constructor() {
        this.CREATING = false;
        this.DONE = 1;
        this.PENDING = 0;
        
        if (typeof(Storage) !== "undefined") {
            let todos = window.localStorage.getItem('app-todos');
            this.todos = todos !== null ? JSON.parse(todos) : [];
        } else {
            this.todos = [];
        }
    }

    add(task) {
        this.todos.unshift(task);
        this.store();
        this.CREATING = false;
    }

    edit(task, index) {
        this.todos[index].content = task.content;
        this.todos[index].created_at = task.created_at;
        this.todos[index].editing = task.editing;
        this.todos[index].id = parseInt(task.id);
        this.todos[index].status = task.status;
        this.store();
    }

    setAsEditing(index, editing) {
        this.todos[index].editing = editing;
    }

    markAsDone(id) {
        this.markAs(this.getIndexById(id));
    }

    markAsPending(id) {
        this.markAs(this.getIndexById(id), this.PENDING);
    }

    markAs(index, status = this.DONE) {
        this.todos[index].status = status;
        this.store();
    }

    delete(index) {
        this.todos.splice(index, 1);
        this.store();
    }

    deleteBy(id) {
        this.todos.splice(this.getIndexById(id), 1);
        this.store();
    }

    getIndexById(id) {
        let index;
        this.todos.forEach((o, i) => {
            if (parseInt(o.id) === parseInt(id)) {
                index = i;
            }
        });

        return index;
    }

    findBy(content) {
        let indexes = [];
        this.todos.forEach((o, i) => {
            if (o.content.includes(content)) {
                indexes.push(o);
            }
        });

        return indexes.length > 0 ? indexes : null;
    }

    store() {
        if (typeof(Storage) !== "undefined") {
            window.localStorage.setItem('app-todos', JSON.stringify(this.todos));
        }
    }
}


export default Todo;