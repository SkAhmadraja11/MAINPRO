package com.musicstreamingapp.controller;

import com.musicstreamingapp.entity.Song;
import com.musicstreamingapp.entity.User;
import com.musicstreamingapp.service.SongService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {
    @Autowired
    private SongService songService;

    @PostMapping
    public ResponseEntity<Song> addSong(@Valid @RequestBody Song song) {
        return ResponseEntity.ok(songService.addSong(song));
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Long id, @Valid @RequestBody Song song) {
        return ResponseEntity.ok(songService.updateSong(id, song));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Song>> searchSongs(@RequestParam String query, @RequestParam String type) {
        return ResponseEntity.ok(songService.searchSongs(query, type));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Song>> getSongsByArtist(@PathVariable Long artistId) {
        User artist = new User();
        artist.setId(artistId);
        return ResponseEntity.ok(songService.getSongsByArtist(artist));
    }

    @GetMapping("/recommend")
    public ResponseEntity<List<Song>> getRecommendedSongs(@RequestParam String genre) {
        return ResponseEntity.ok(songService.getRecommendedSongs(genre));
    }
    @GetMapping
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
}

}