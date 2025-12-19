package server.api.DTOs.RS;

import server.entity.UserEntity;

import java.util.List;
import java.util.Set;
import java.util.stream.StreamSupport;

public record UserRs(
        Long id,
        String login,
        String role,
        List<UserRs> subscriptions,
        List<UserRs> subscribers
) {

    /** Полный маппинг (для корневого пользователя) */
    public static UserRs from(UserEntity entity) {
        return new UserRs(
                entity.getId(),
                entity.getLogin(),
                entity.getRole().name(),
                entity.getSubscriptions().stream()
                        .map(UserRs::fromNested)
                        .toList(),
                entity.getSubscribers().stream()
                        .map(UserRs::fromNested)
                        .toList()
        );
    }

    /** Урезанный маппинг (для вложенных пользователей) */
    private static UserRs fromNested(UserEntity entity) {
        return new UserRs(
                entity.getId(),
                entity.getLogin(),
                entity.getRole().name(),
                List.of(),
                List.of()
        );
    }

    public static List<UserRs> fromList(Iterable<UserEntity> entities) {
        return StreamSupport.stream(entities.spliterator(), false)
                .map(UserRs::from)
                .toList();
    }
}
