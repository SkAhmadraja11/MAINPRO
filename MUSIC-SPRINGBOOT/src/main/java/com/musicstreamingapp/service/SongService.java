package com.musicstreamingapp.service;

import com.musicstreamingapp.entity.Song;
import com.musicstreamingapp.entity.User;
import com.musicstreamingapp.repository.SongRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.util.List;

@Service
@Validated
public class SongService {
    @Autowired
    private SongRepository songRepository;

    public Song addSong(@Valid Song song) {
        return songRepository.save(song);
    }
    

    public Song updateSong(Long id, @Valid Song updatedSong) {
        Song song = songRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Song not found"));
        song.setTitle(updatedSong.getTitle());
        song.setArtist(updatedSong.getArtist());
        song.setGenre(updatedSong.getGenre());
        song.setAlbum(updatedSong.getAlbum());
        song.setUrl(updatedSong.getUrl());
        return songRepository.save(song);
    }

    public void deleteSong(Long id) {
        if (!songRepository.existsById(id)) {
            throw new IllegalArgumentException("Song not found");
        }
        songRepository.deleteById(id);
    }

    public List<Song> searchSongs(String query, String type) {
        switch (type.toLowerCase()) {
            case "artist":
                return songRepository.findByArtist(query);
            case "genre":
                return songRepository.findByGenre(query);
            case "album":
                return songRepository.findByAlbum(query);
            default:
                throw new IllegalArgumentException("Invalid search type");
        }
    }

    public List<Song> getSongsByArtist(User artist) {
        return songRepository.findByArtistUser(artist);
    }

    public List<Song> getRecommendedSongs(String genre) {
        return songRepository.findByGenre(genre);
    }
    public List<Song> getAllSongs() {
    return songRepository.findAll();
}

}
