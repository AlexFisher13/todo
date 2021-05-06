var noteApi = Vue.resource('/notes{/id}');

Vue.component('note-row', {
    props: ['note'],
    template: '<div><i>({{ note.id }})</i> {{ note.text }}</div>'
});

Vue.component('notes-list', {
    props: ['notes'],
    template: '<div><note-row v-for="note in notes" :key="note.id" :note="note"></note-row></div>',
    created: function () {
        noteApi.get().then(result =>
            result.json().then(data =>
                data.forEach(note => this.notes.push(note))
            )
        )
    }
});

var app = new Vue({
    el: '#app',
    template: '<notes-list :notes="notes" />',
    data: {
        notes: []
    }
})