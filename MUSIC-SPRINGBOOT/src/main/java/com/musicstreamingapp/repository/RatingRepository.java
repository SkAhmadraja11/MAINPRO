package com.musicstreamingapp.repository;

import com.musicstreamingapp.entity.Rating;
import com.musicstreamingapp.entity.Song;
import com.musicstreamingapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findBySong(Song song);
    List<Rating> findByUser(User user);
}