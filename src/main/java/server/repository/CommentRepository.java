package server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import server.entity.CommentEntity;
import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    Page<CommentEntity> findAllByPostId(Long postId, Pageable pageable);
}
