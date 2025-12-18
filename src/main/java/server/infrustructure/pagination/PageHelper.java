package server.infrustructure.pagination;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageHelper {
    private PageHelper() {}

    /**
     * Переводит 1-based page в Pageable (0-based)
     * Сортировка по id по умолчанию.
     */
    public static Pageable toPageable(int page, int size) {
        int pageIndex = Math.max(page - 1, 0);
        return PageRequest.of(pageIndex, size, Sort.by("id"));
    }
}
