package server.infrustructure.mapper;

import org.springframework.stereotype.Component;
import server.api.DTOs.RQ.CategoryRq;
import server.api.DTOs.RS.CategoryRs;
import server.entity.CategoryEntity;
@Component
public class CategoryMapper {

    public CategoryEntity toEntity(CategoryRq rq) {
        CategoryEntity category = new CategoryEntity();
        category.setName(rq.getName());
        return category;
    }

    public CategoryRs toRS(CategoryEntity entity) {
        CategoryRs rs = new CategoryRs();
        rs.setId(entity.getId());
        rs.setName(entity.getName());
        return rs;
    }
}