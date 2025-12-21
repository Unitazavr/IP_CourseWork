package server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import server.entity.UserEntity;
import server.entity.UserRole;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByLogin(String login);
    Page<UserEntity> findByRole(UserRole role, Pageable pageable);

    @Query("""
    SELECT u FROM UserEntity u
    LEFT JOIN u.subscribers s
    GROUP BY u
    HAVING COUNT(s) >= :minCount
""")
    Page<UserEntity> findWithSubscribersMoreThan(
            @Param("minCount") long minCount,
            Pageable pageable
    );

    @Query("""
    SELECT u FROM UserEntity u
    LEFT JOIN u.subscribers s
    WHERE u.role = :role
    GROUP BY u
    HAVING COUNT(s) >= :minCount
""")
    Page<UserEntity> findByRoleAndSubscribersMoreThan(
            @Param("role") UserRole role,
            @Param("minCount") long minCount,
            Pageable pageable
    );


    boolean existsByLogin(String login);
}
