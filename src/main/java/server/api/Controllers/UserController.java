package server.api.Controllers;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import server.api.DTOs.RQ.UserRq;
import server.api.DTOs.RQ.UserUpdateRq;
import server.api.DTOs.RS.UserRs;
import server.infrustructure.Constants;
import server.infrustructure.pagination.PageHelper;
import server.infrustructure.pagination.PageRs;
import server.security.UserPrincipal;
import server.service.UserService;

import static server.infrustructure.Constants.DEFAULT_PAGE;
import static server.infrustructure.Constants.DEFAULT_SIZE;

@RestController
@RequestMapping(Constants.API_URL + "/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public UserRs getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    

    @GetMapping
    public PageRs<UserRs> getAll(@RequestParam(value = "page", defaultValue = "1") int page,
                                 @RequestParam(value = "size", defaultValue = "20") int size) {
        if (page < 1) page = DEFAULT_PAGE;
        if (size < 1) size = DEFAULT_SIZE;
        var pageable = PageHelper.toPageable(page, size);
        return userService.getAll(pageable);
    }

    // Регистрация
    @PostMapping("/register")
    public UserRs register(@Valid @RequestBody UserRq rq) {
        return userService.register(rq);
    }

    @PutMapping("/{id}")
    public UserRs update(@Valid @RequestBody UserRq rq,
                         @PathVariable Long id) {
        return userService.update(id, rq);
    }
    @PutMapping("/password")
    public UserRs updatePassword(@Valid @RequestBody UserUpdateRq rq,
                                 @AuthenticationPrincipal UserPrincipal user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth.getPrincipal().getClass());
        return userService.update(user.getId(), rq);
    }


    @DeleteMapping("/{id}")
    public UserRs delete(@PathVariable Long id) {
        return userService.delete(id);
    }

    // Текущий пользователь
    @GetMapping("/me")
    public UserRs getMe(@AuthenticationPrincipal UserPrincipal user) {
        return getById(user.getId());
    }

    // Подписаться
    @PostMapping("/{id}/subscribe")
    public void subscribe(@AuthenticationPrincipal UserPrincipal user,
                          @PathVariable Long id) {
        userService.subscribe(user.getId(), id);
    }

    // Отписаться
    @PostMapping("/{id}/unsubscribe")
    public void unsubscribe(@AuthenticationPrincipal UserPrincipal user,
                            @PathVariable Long id) {
        userService.unsubscribe(user.getId(), id);
    }
}

