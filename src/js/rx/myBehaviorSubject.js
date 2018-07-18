import { MyObservable } from "./myObservable";
import deepEqual from 'deep-equal';

class MyBehaviorSubject extends MyObservable {
    constructor(initialValue) {
        super();
        this.observers = [];

        if (typeof initialValue === 'undefined') {
            throw new Error('You need to provide initial value');
        }

        this.lastValue = initialValue;
        this.history = [];
    }

    subscribe(observer, selector) {
        this.observers.push({
            observer,
            selector
        });
    }

    next(value, dontAddToHistory) {
        if (!dontAddToHistory) {
            this.history.push(Object.assign({}, this.lastValue));
        }

        let lastValue = this.lastValue;
        this.lastValue = value;

        this.observers.forEach(observer => {
            if (observer.selector) {
                let oldVal = this.getTodo(lastValue, observer.selector);
                let newVal = this.getTodo(value, observer.selector);

                if (!deepEqual(oldVal, newVal)){
                    observer.observer(newVal);
                }
            } else {
                observer.observer(value);
            }
        });
    }

    getValue() {
        return jQuery.extend(true, {}, this.lastValue);
    }

    getTodo(todos, predicate) {
        let result = [];
        for (let key in todos) {
            if (todos[key].completed) {
                result.push(todos[key]);
            }
        }

        return result;
    }

    undo() {
        if (this.history.length) {
            let value = this.history.pop();
            this.next(value, true);
        }
    }
}

export { MyBehaviorSubject };