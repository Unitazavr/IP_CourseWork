package server.infrustructure.mapper;

import org.springframework.stereotype.Component;
import server.api.DTOs.RQ.CategoryRq;
import server.api.DTOs.RQ.CommentRq;
import server.api.DTOs.RS.CategoryRs;
import server.api.DTOs.RS.CommentRs;
import server.entity.CategoryEntity;
import server.entity.CommentEntity;
import server.entity.PostEntity;
import server.entity.UserEntity;

import java.time.LocalDateTime;
@Component
public class CommentMapper {

    public CommentEntity toEntity(CommentRq rq, UserEntity user, PostEntity post) {
        CommentEntity comment = new CommentEntity();
        comment.setContent(rq.getContent());
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        return comment;
    }

    public CommentRs toRS(CommentEntity entity) {
        CommentRs rs = new CommentRs();
        rs.setId(entity.getId());
        rs.setContent(entity.getContent());
        rs.setUserId(entity.getUser().getId());
        rs.setUserLogin(entity.getUser().getLogin());
        rs.setCreatedAt(entity.getCreatedAt());
        return rs;
    }
}

