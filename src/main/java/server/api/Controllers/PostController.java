package server.api.Controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import server.api.DTOs.RQ.PostRq;
import server.api.DTOs.RS.PostRs;
import server.api.DTOs.RS.UserRs;
import server.infrustructure.Constants;
import server.infrustructure.pagination.PageHelper;
import server.infrustructure.pagination.PageRs;
import server.security.UserPrincipal;
import server.service.PostService;

import static server.infrustructure.Constants.DEFAULT_PAGE;
import static server.infrustructure.Constants.DEFAULT_SIZE;

@RestController
@RequestMapping(Constants.API_URL + "/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public PostRs create(@AuthenticationPrincipal UserPrincipal user,
                         @Valid @RequestBody PostRq rq) {
        return postService.create(user, rq);
    }

    @GetMapping("/{id}")
    public PostRs get(@PathVariable Long id) {
        return postService.getById(id);
    }

    @GetMapping
    public PageRs<PostRs> getAll(@RequestParam(value = "page", defaultValue = "1") int page,
                                 @RequestParam(value = "size", defaultValue = "20") int size) {
        if (page < 1) page = DEFAULT_PAGE;
        if (size < 1) size = DEFAULT_SIZE;
        var pageable = PageHelper.toPageable(page, size);
        return postService.getAll(pageable);
    }

    @GetMapping("/category/{categoryId}")
    public Page<PostRs> getByCategory(@PathVariable Long categoryId,
                                      @RequestParam(value = "page", defaultValue = "1") int page,
                                      @RequestParam(value = "size", defaultValue = "20") int size) {
        if (page < 1) page = DEFAULT_PAGE;
        if (size < 1) size = DEFAULT_SIZE;
        var pageable = PageHelper.toPageable(page, size);
        return postService.getByCategory(categoryId, pageable);
    }

    @PutMapping("/{postId}")
    public PostRs update(@AuthenticationPrincipal UserPrincipal user,
                         @Valid @RequestBody PostRq rq,
                         @PathVariable Long postId) {
        return postService.update(user, rq, postId);
    }

    @DeleteMapping("/{id}")
    public void delete(@AuthenticationPrincipal UserPrincipal user,
                       @PathVariable Long id) {
        postService.delete(user, id);
    }
}
