package com.musicstreamingapp.controller;

import com.musicstreamingapp.entity.Rating;
import com.musicstreamingapp.entity.User;
import com.musicstreamingapp.service.RatingService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> addRating(@Valid @RequestBody Rating rating) {
        return ResponseEntity.ok(ratingService.addRating(rating));
    }

    @GetMapping("/song/{songId}")
    public ResponseEntity<List<Rating>> getSongRatings(@PathVariable Long songId) {
        return ResponseEntity.ok(ratingService.getSongRatings(songId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getUserRatings(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return ResponseEntity.ok(ratingService.getUserRatings(user));
    }
}
