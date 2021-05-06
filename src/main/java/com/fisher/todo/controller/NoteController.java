package com.fisher.todo.controller;

import com.fisher.todo.exceptions.NotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("notes")
public class NoteController {
    private int counter = 4;

    private ArrayList<Map<String, String>> notes = new ArrayList<>() {{
        add(new HashMap<>() {{
            put("id", "1");
            put("note", "first note");
        }});
        add(new HashMap<>() {{
            put("id", "2");
            put("note", "second note");
        }});
        add(new HashMap<>() {{
            put("id", "3");
            put("note", "third note");
        }});
    }};

    @GetMapping
    public List<Map<String, String>> list() {
        return notes;
    }

    private Map<String, String> findNote(String id) {
        return notes.stream()
                .filter(note -> note.get("id").equals(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);
    }

    @GetMapping("{id}")
    public Map<String, String> getNote(@PathVariable String id) {
        return findNote(id);
    }

    @PostMapping
    public Map<String, String> addNote(@RequestBody Map<String, String> note) {
        note.put("id", String.valueOf(counter++));
        notes.add(note);
        return note;
    }

    @PutMapping("{id}")
    public Map<String, String> updateNote(@PathVariable String id,
                                          @RequestBody Map<String, String> note) {
        Map<String, String> noteFromDb = findNote(id);
        noteFromDb.putAll(note);
        noteFromDb.put("id", id);
        return noteFromDb;
    }

    @DeleteMapping("{id}")
    public void deleteDote(@PathVariable String id) {
        Map<String, String> note = findNote(id);
        notes.remove(note);
    }
}
