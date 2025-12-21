package server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import server.entity.PostEntity;

import java.util.List;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

    @Query("""
    SELECT p FROM PostEntity p
    WHERE p.author IN (
        SELECT s FROM UserEntity u
        JOIN u.subscriptions s
        WHERE u.id = :userId
    )
    """)
    Page<PostEntity> findFeedForUser(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
    SELECT p FROM PostEntity p
    WHERE p.category.id = :categoryId
      AND p.author IN (
          SELECT s FROM UserEntity u
          JOIN u.subscriptions s
          WHERE u.id = :userId
      )
    """)
    Page<PostEntity> findByCategoryAndFeedForUser(
            @Param("categoryId") Long categoryId,
            @Param("userId") Long userId,
            Pageable pageable
    );

    Page<PostEntity> findAllByAuthorId(Long authorId, Pageable pageable);
    Page<PostEntity> findAllByCategoryId(Long categoryId, Pageable pageable);

}
