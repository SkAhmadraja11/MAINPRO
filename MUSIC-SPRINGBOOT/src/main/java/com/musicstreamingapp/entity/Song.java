package com.musicstreamingapp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "songs")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Artist is required")
    private String artist;

    private String genre;

    private String album;

    @NotBlank(message = "URL is required")
    private String url; // Cloud storage URL for streaming

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private User artistUser;

    public Song() {}

    public Song(String title, String artist, String genre, String album, String url, User artistUser) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.album = album;
        this.url = url;
        this.artistUser = artistUser;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public User getArtistUser() { return artistUser; }
    public void setArtistUser(User artistUser) { this.artistUser = artistUser; }
}
