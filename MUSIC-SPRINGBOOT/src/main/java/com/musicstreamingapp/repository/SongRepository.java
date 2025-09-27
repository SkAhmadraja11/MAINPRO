
package com.musicstreamingapp.repository;

import com.musicstreamingapp.entity.Song;
import com.musicstreamingapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByArtist(String artist);
    List<Song> findByGenre(String genre);
    List<Song> findByAlbum(String album);
    List<Song> findByArtistUser(User artistUser);
}
