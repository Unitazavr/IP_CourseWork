package server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import server.api.DTOs.RQ.CommentRq;
import server.api.DTOs.RS.CommentRs;
import server.entity.CommentEntity;
import server.entity.PostEntity;
import server.entity.UserEntity;
import server.entity.UserRole;
import server.infrustructure.mapper.CommentMapper;
import server.infrustructure.pagination.PageRs;
import server.repository.CommentRepository;
import server.repository.PostRepository;
import server.repository.UserRepository;
import server.security.UserPrincipal;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper mapper;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository, CommentMapper mapper) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public CommentRs create(UserPrincipal principal, CommentRq rq) {
        UserEntity user = userRepository.findById(principal.getId()).orElseThrow();
        PostEntity post = postRepository.findById(rq.getPostId()).orElseThrow();

        CommentEntity comment = mapper.toEntity(rq, user, post);
        return mapper.toRS(commentRepository.save(comment));
    }

    public PageRs<CommentRs> getByPost(Long postId, Pageable pageable) {
        Page<CommentEntity> page = commentRepository.findAllByPostId(postId, pageable);
        return PageRs.from(page, mapper::toRS);

    }

    public CommentRs update(UserPrincipal principal, Long id, CommentRq rq) {
        CommentEntity comment = commentRepository.findById(id).orElseThrow();

        if (comment.getUser().getId().equals(principal.getId())
                || principal.getAuthorities().contains(UserRole.ADMIN)) {
            comment.setContent(rq.getContent());
            return mapper.toRS(commentRepository.save(comment));
        }
        throw new AccessDeniedException("Not author");
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }
}
