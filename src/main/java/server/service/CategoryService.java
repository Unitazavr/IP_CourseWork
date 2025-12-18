package server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import server.api.DTOs.RQ.CategoryRq;
import server.api.DTOs.RS.CategoryRs;
import server.entity.CategoryEntity;
import server.infrustructure.mapper.CategoryMapper;
import server.infrustructure.pagination.PageRs;
import server.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper mapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper mapper) {
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    public CategoryRs create(CategoryRq rq) {
        CategoryEntity category = mapper.toEntity(rq);
        return mapper.toRS(categoryRepository.save(category));
    }

    public PageRs<CategoryRs> getAll(Pageable pageable) {
        Page<CategoryEntity> page =  categoryRepository.findAll(pageable);
        return PageRs.from(page, mapper::toRS);
    }

    public CategoryRs update(Long id, CategoryRq rq) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow();
        category.setName(rq.getName());
        return mapper.toRS(categoryRepository.save(category));
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
