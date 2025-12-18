package server.api.Controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import server.api.DTOs.RQ.CommentRq;
import server.api.DTOs.RS.CommentRs;
import server.infrustructure.Constants;
import server.infrustructure.pagination.PageRs;
import server.security.UserPrincipal;
import server.service.CommentService;

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
                                       Pageable pageable) {
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
