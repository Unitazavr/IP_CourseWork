package server.api.Controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import server.api.DTOs.RQ.CategoryRq;
import server.api.DTOs.RS.CategoryRs;
import server.infrustructure.Constants;
import server.infrustructure.pagination.PageRs;
import server.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping(Constants.API_URL + "/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public CategoryRs create(@Valid @RequestBody CategoryRq rq) {
        return categoryService.create(rq);
    }

    @GetMapping
    public PageRs<CategoryRs> getAll(Pageable pageable) {
        return categoryService.getAll(pageable);
    }

    @PutMapping("/{id}")
    public CategoryRs update(@Valid @RequestBody CategoryRq rq,
                             @PathVariable Long id) {
        return categoryService.update(id, rq);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
