package server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import server.api.DTOs.RQ.PostRq;
import server.api.DTOs.RS.PostRs;
import server.entity.CategoryEntity;
import server.entity.PostEntity;
import server.entity.UserEntity;
import server.entity.UserRole;
import server.infrustructure.mapper.PostMapper;
import server.infrustructure.pagination.PageRs;
import server.repository.CategoryRepository;
import server.repository.PostRepository;
import server.repository.UserRepository;
import server.security.UserPrincipal;

import javax.swing.text.html.parser.Entity;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private final PostMapper mapper;

    public PostService(PostRepository postRepository,
                       CategoryRepository categoryRepository,
                       UserRepository userRepository, PostMapper mapper) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public PostRs create(UserPrincipal principal, PostRq rq) {
        UserEntity user = userRepository.findById(principal.getId()).orElseThrow();
        CategoryEntity category = categoryRepository.findById(rq.getCategoryId()).orElseThrow();
        PostEntity post = mapper.toEntity(rq, user, category);
        return mapper.toRS(postRepository.save(post));
    }

    public PostRs update(UserPrincipal principal, PostRq rq, Long postId) {
        PostEntity post = postRepository.findById(postId).orElseThrow();

        if (!post.getAuthor().getId().equals(principal.getId())) {
            throw new AccessDeniedException("Not author");
        }

        post.setTitle(rq.getTitle());
        post.setContent(rq.getContent());
        post.setCategory(
                categoryRepository.findById(rq.getCategoryId()).orElseThrow()
        );

        return mapper.toRS(postRepository.save(post));
    }

    public PostRs getById(Long id) {
        return mapper.toRS(
                postRepository.findById(id).orElseThrow()
        );
    }

    public PageRs<PostRs> getAll(Pageable pageable) {
        Page<PostEntity> page = postRepository.findAll(pageable);

        return PageRs.from(page, mapper::toRS);
    }

    public Page<PostRs> getByFilter(Long categoryId, Long userId, Pageable pageable) {
        Page<PostEntity> page;

        boolean hasCategory = categoryId != null;
        boolean hasUser = userId != null;

        if (hasCategory && hasUser) {
            page = postRepository.findByCategoryAndFeedForUser(
                    categoryId,
                    userId,
                    pageable
            );
        } else if (hasCategory) {
            page = postRepository.findAllByCategoryId(categoryId, pageable);

        } else if (hasUser) {
            page = postRepository.findFeedForUser(userId, pageable);

        } else {
            page = postRepository.findAll(pageable);
        }
        return page.map(mapper::toRS);
    }


    public void delete(UserPrincipal principal, Long id) {
        PostEntity post = postRepository.findById(id).orElseThrow();
        if (post.getAuthor().getId().equals(principal.getId())
                || principal.getAuthorities().contains(UserRole.ADMIN)) {
            postRepository.delete(post);
        } else throw new AccessDeniedException("Not author");
    }
}
