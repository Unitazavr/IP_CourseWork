package server.infrustructure.pagination;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public record PageRs<D>(
        List<D> items,
        int itemsCount,
        int currentPage,
        int currentSize,
        int totalPages,
        long totalItems,
        boolean isFirst,
        boolean isLast,
        boolean hasNext,
        boolean hasPrevious
) {
    public static <D, E> PageRs<D> from(Page<E> page, Function<E, D> mapper) {
        List<D> items = page.stream()
                .map(mapper)
                .collect(Collectors.toList());

        return new PageRs<>(
                items,
                page.getNumberOfElements(),
                page.getNumber() + 1,           // делаем 1-based для API
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.isFirst(),
                page.isLast(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
