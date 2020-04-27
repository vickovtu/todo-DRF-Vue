const app = new Vue({
    el: '#app',
    data: {
        login: false,
        btn: 'add new',
        message: null,
        editTodo: null,
        formNote: {
            title: '',
            body: '',
        },
        user: {
            username: '',
            password: '',
        },
        conf: {
            headers: {
                Authorization: null
            }
        },
        toDoList: [],
        divClass: '',
        selected: []
    },
    methods: {
        addNote() {
            let { title, body } = this.formNote;
            if (title === '' || body === "") {
                this.message = 'заполните поля формы';
                return false;
            }
            else if (this.editTodo) {
                this.editTodo.title = title;
                this.editTodo.body = body;

                axios.put(`http://127.0.0.1:8000/api/v1/${this.editTodo.id}/`, this.editTodo, this.conf)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            else {
                // newTodo = {
                //     title,
                //     body,
                // };
                axios.post(`http://127.0.0.1:8000/api/v1/`, this.formNote, this.conf)
                    .then(res => {this.toDoList.push(res.data);});
            }
            this.setNone();
        },
        setNone() {
            this.formNote.body = "";
            this.formNote.title = "";
            this.message = null;
            this.btn = 'add new';
            this.editTodo = null;
        },
        editNote(index) {
            this.editTodo = this.toDoList[index];
            this.formNote = {
                title: this.editTodo.title,
                body: this.editTodo.body,
            };
            this.btn = "edit";
        },
        deleteNote(index) {
            todo = this.toDoList[index];
            axios.delete(`http://127.0.0.1:8000/api/v1/${todo.id}/`, this.conf)
                .then(res => {
                    if (res.status === 204) {
                        this.toDoList.splice(index, 1);
                    }
                });
        },
        doneNote(index) {
            let todo = this.toDoList[index];
            todo.done = !todo.done;
            axios.put(`http://127.0.0.1:8000/api/v1/${todo.id}/`, todo, this.conf);
        },
        loginTodo() {
            axios.post(`http://127.0.0.1:8000/auth/jwt/create/`, this.user)
                .then(res => res.data.access)
                .then(access => {
                    this.login = !this.login;
                    this.conf.headers.Authorization = `Bearer ${access}`;
                    axios.get('http://127.0.0.1:8000/api/v1/', this.conf)
                        .then(res => { this.toDoList = res.data.results; });
                });

        }

    }
});