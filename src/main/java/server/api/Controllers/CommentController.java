package server.api.Controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import server.api.DTOs.RQ.CommentRq;
import server.api.DTOs.RS.CommentRs;
import server.api.DTOs.RS.UserRs;
import server.infrustructure.Constants;
import server.infrustructure.pagination.PageHelper;
import server.infrustructure.pagination.PageRs;
import server.security.UserPrincipal;
import server.service.CommentService;

import static server.infrustructure.Constants.DEFAULT_PAGE;
import static server.infrustructure.Constants.DEFAULT_SIZE;

@RestController
@RequestMapping(Constants.API_URL + "/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentRs create(@AuthenticationPrincipal UserPrincipal user,
                            @Valid @RequestBody CommentRq rq) {
        return commentService.create(user, rq);
    }

    @GetMapping("/post/{postId}")
    public PageRs<CommentRs> getByPost(@PathVariable Long postId,
                                       @RequestParam(value = "page", defaultValue = "1") int page,
                                       @RequestParam(value = "size", defaultValue = "20") int size) {
        if (page < 1) page = DEFAULT_PAGE;
        if (size < 1) size = DEFAULT_SIZE;
        var pageable = PageHelper.toPageable(page, size);
        return commentService.getByPost(postId, pageable);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commentService.delete(id);
    }

    @PutMapping("/{id}")
    public CommentRs update(@AuthenticationPrincipal UserPrincipal user,
                            @PathVariable Long id,
                            @Valid @RequestBody CommentRq rq) {
        return commentService.update(user, id, rq);
    }
}
