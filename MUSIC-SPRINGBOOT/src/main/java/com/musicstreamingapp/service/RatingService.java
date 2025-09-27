package com.musicstreamingapp.service;

import com.musicstreamingapp.entity.Rating;
import com.musicstreamingapp.entity.Song;
import com.musicstreamingapp.entity.User;
import com.musicstreamingapp.repository.RatingRepository;
import com.musicstreamingapp.repository.SongRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.util.List;

@Service
@Validated
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private SongRepository songRepository;

    public Rating addRating(@Valid Rating rating) {
        return ratingRepository.save(rating);
    }

    public List<Rating> getSongRatings(Long songId) {
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new IllegalArgumentException("Song not found"));
        return ratingRepository.findBySong(song);
    }

    public List<Rating> getUserRatings(User user) {
        return ratingRepository.findByUser(user);
    }
}