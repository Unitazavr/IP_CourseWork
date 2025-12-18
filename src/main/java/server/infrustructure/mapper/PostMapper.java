package server.infrustructure.mapper;

import org.hibernate.annotations.Comment;
import org.springframework.stereotype.Component;
import server.api.DTOs.RQ.PostRq;
import server.api.DTOs.RS.PostRs;
import server.entity.CategoryEntity;
import server.entity.PostEntity;
import server.entity.UserEntity;
@Component
public class PostMapper {
    public PostEntity toEntity(PostRq rq, UserEntity author, CategoryEntity category) {
        PostEntity post = new PostEntity();
        post.setTitle(rq.getTitle());
        post.setContent(rq.getContent());
        post.setAuthor(author);
        post.setCategory(category);
        return post;
    }

    public PostRs toRS(PostEntity entity) {
        PostRs rs = new PostRs();
        rs.setId(entity.getId());
        rs.setTitle(entity.getTitle());
        rs.setContent(entity.getContent());

        rs.setAuthorId(entity.getAuthor().getId());
        rs.setAuthorLogin(entity.getAuthor().getLogin());

        rs.setCategoryId(entity.getCategory().getId());
        rs.setCategoryName(entity.getCategory().getName());

        return rs;
    }
}
