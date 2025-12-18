package server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import server.entity.PostEntity;

import java.util.List;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

    Page<PostEntity> findAllByAuthorId(Long authorId, Pageable pageable);
    Page<PostEntity> findAllByCategoryId(Long categoryId, Pageable pageable);

}
