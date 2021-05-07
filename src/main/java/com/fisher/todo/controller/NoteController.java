package com.fisher.todo.controller;

import com.fisher.todo.domain.Note;
import com.fisher.todo.repository.NoteRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("notes")
public class NoteController {

    private final NoteRepository noteRepo;

    @Autowired
    public NoteController(NoteRepository noteRepo) {
        this.noteRepo = noteRepo;
    }

    @GetMapping
    public List<Note> list() {
        return noteRepo.findAll();
    }

    @GetMapping("{id}")
    public Note getNote(@PathVariable("id") Note note) {
        return note;
    }

    @PostMapping
    public Note addNote(@RequestBody Note note) {
        note.setCreationDate(LocalDateTime.now());
        return noteRepo.save(note);
    }

    @PutMapping("{id}")
    public Note updateNote(@PathVariable("id") Note noteFromDb,
                                          @RequestBody  Note note) {
        BeanUtils.copyProperties(note, noteFromDb, "id");
        return noteRepo.save(noteFromDb);
    }

    @DeleteMapping("{id}")
    public void deleteDote(@PathVariable("id") Note note) {
        noteRepo.delete(note);
    }
}
