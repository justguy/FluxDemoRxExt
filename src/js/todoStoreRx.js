import { MyBehaviorSubject } from './rx/myBehaviorSubject';

let TodoStore = function(dispatcher) {
    //let _emitter = new Dispatcher();
    let _nextId = 0;
    let _todos = new MyBehaviorSubject({});

    dispatcher.register((payload) => {
        let todos = null;

        switch (payload.type) {
            case 'SEED_TODOS':
                _todos.next(payload.todos);
                // go through the seed and set _nextId
                // appropriately so that creating new todos
                // doesn't override ones from the seed
                for (let i in payload.todos) {
                    _nextId = Math.max(_nextId + 1, payload.todos[i].id)
                }
                break;
            case 'CREATE_TODO':
                payload.todo.id = _nextId++;
                todos = _todos.getValue();
                todos[payload.todo.id] = payload.todo;
                _todos.next(todos);
                break;
            case 'REMOVE_TODO':
                todos = _todos.getValue();
                delete todos[payload.todo.id];
                _todos.next(todos);
                break;
            case 'UPDATE_TODO':
                todos = _todos.getValue();
                $.extend(todos[payload.todo.id], payload.todo);
                _todos.next(todos);
                break;
            default:
                return // avoid emitting a change
        }
    });

    return {
        getTodos: () => {
            return _todos.getValue();
        },
        getTodo: (id) => {
            return _todos.getValue()[id];
        },
        subscribe: (observer, selector) => {
            return _todos.subscribe(observer, selector);
        },
        unsubscribe: (observer) => {
            return _todos.unsubscribe(observer);
        },
        undo: () => {
            _todos.undo();
        }
    }
};

export { TodoStore };