package server.api.Controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import server.api.DTOs.RQ.CategoryRq;
import server.api.DTOs.RS.CategoryRs;
import server.infrustructure.Constants;
import server.infrustructure.pagination.PageHelper;
import server.infrustructure.pagination.PageRs;
import server.service.CategoryService;

import java.util.List;

import static server.infrustructure.Constants.DEFAULT_PAGE;
import static server.infrustructure.Constants.DEFAULT_SIZE;

@RestController
@RequestMapping(Constants.API_URL + "/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public CategoryRs create(@Valid @RequestBody CategoryRq rq) {
        return categoryService.create(rq);
    }

    @GetMapping
    public PageRs<CategoryRs> getAll(@RequestParam(value = "page", defaultValue = "1") int page,
                                     @RequestParam(value = "size", defaultValue = "20") int size) {
        if (page < 1) page = DEFAULT_PAGE;
        if (size < 1) size = DEFAULT_SIZE;
        var pageable = PageHelper.toPageable(page, size);
        return categoryService.getAll(pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public CategoryRs update(@Valid @RequestBody CategoryRq rq,
                             @PathVariable Long id) {
        return categoryService.update(id, rq);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
