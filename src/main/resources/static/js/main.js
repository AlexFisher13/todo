function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}


var noteApi = Vue.resource('/notes{/id}');

Vue.component('note-form', {
    props: ['notes', 'noteAttr'],
    data: function() {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        noteAttr: function(newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<input type="text" placeholder="Write something" v-model="text" />' +
        '<input type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var note = { text: this.text };

            if (this.id) {
                noteApi.update({id: this.id}, note).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.notes, data.id);
                        this.notes.splice(index, 1, data);
                        this.text = ''
                        this.id = ''
                    })
                )
            } else {
                noteApi.save({}, note).then(result =>
                    result.json().then(data => {
                        this.notes.push(data);
                        this.text = ''
                    })
                )
            }
        }
    }
});

Vue.component('note-row', {
    props: ['note', 'editMethod', 'notes'],
    template: '<div>' +
        '<i>({{ note.id }})</i> {{ note.text }}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Edit" @click="edit" />' +
        '<input type="button" value="X" @click="del" />' +
        '</span>' +
        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.note);
        },
        del: function() {
            noteApi.remove({id: this.note.id}).then(result => {
                if (result.ok) {
                    this.notes.splice(this.notes.indexOf(this.note), 1)
                }
            })
        }
    }
});

Vue.component('notes-list', {
    props: ['notes'],
    data: function() {
        return {
            note: null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
        '<note-form :notes="notes" :noteAttr="note" />' +
        '<note-row v-for="note in notes" :key="note.id" :note="note" ' +
        ':editMethod="editMethod" :notes="notes" />' +
        '</div>',
    created: function() {
        noteApi.get().then(result =>
            result.json().then(data =>
                data.forEach(note => this.notes.push(note))
            )
        )
    },
    methods: {
        editMethod: function(note) {
            this.note = note;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<notes-list :notes="notes" />',
    data: {
        notes: []
    }
});