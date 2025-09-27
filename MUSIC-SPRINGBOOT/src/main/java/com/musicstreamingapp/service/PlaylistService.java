package com.musicstreamingapp.service;

import com.musicstreamingapp.entity.Playlist;
import com.musicstreamingapp.entity.Song;
import com.musicstreamingapp.entity.User;
import com.musicstreamingapp.repository.PlaylistRepository;
import com.musicstreamingapp.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlaylistService {
    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private SongRepository songRepository;

    public Playlist createPlaylist(String name, User user) {
        Playlist playlist = new Playlist(name, user);
        return playlistRepository.save(playlist);
    }

    public Playlist addSongToPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalArgumentException("Playlist not found"));
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new IllegalArgumentException("Song not found"));
        playlist.getSongs().add(song);
        return playlistRepository.save(playlist);
    }

    public List<Playlist> getUserPlaylists(User user) {
        return playlistRepository.findByUser(user);
    }

    public void deletePlaylist(Long id) {
        if (!playlistRepository.existsById(id)) {
            throw new IllegalArgumentException("Playlist not found");
        }
        playlistRepository.deleteById(id);
    }
}