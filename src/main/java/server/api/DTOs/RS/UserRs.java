package server.api.DTOs.RS;

import server.entity.UserEntity;

import java.util.List;
import java.util.stream.StreamSupport;

public record UserRs(
        Long id,
        String login,
        String role) {

    public static UserRs from(UserEntity entity) {
        return new UserRs(
                entity.getId(),
                entity.getLogin(),
                entity.getRole().name());
    }

    public static List<UserRs> fromList(Iterable<UserEntity> entities) {
        return StreamSupport.stream(entities.spliterator(), false)
                .map(UserRs::from)
                .toList();
    }
}
