package server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import server.api.DTOs.RQ.UserRq;
import server.api.DTOs.RQ.UserUpdateRq;
import server.api.DTOs.RS.UserRs;
import server.entity.UserEntity;
import server.entity.UserRole;
import server.infrustructure.error.AlreadyExistsException;
import server.infrustructure.error.PasswordConfirmationException;
import server.infrustructure.pagination.PageRs;
import server.repository.UserRepository;
import server.security.UserPrincipal;

import java.util.Objects;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===== Spring Security =====

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        UserEntity user = userRepository.findByLogin(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username));

        return new UserPrincipal(user);
    }

    // ===== Business logic =====

    public UserRs register(UserRq rq) {
        if (userRepository.findByLogin(rq.getLogin()).isPresent()) {
            throw new AlreadyExistsException(UserEntity.class, rq.getLogin());
        }
        if (!Objects.equals(rq.getPassword(), rq.getPasswordConfirm())) {
            throw new PasswordConfirmationException();
        }
        UserEntity user = new UserEntity();
        user.setLogin(rq.getLogin());
        user.setPassword(passwordEncoder.encode(rq.getPassword()));
        user.setRole(UserRole.USER);
        userRepository.save(user);
        return UserRs.from(user);
    }

    public UserRs getById(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        return UserRs.from(user);
    }

    public PageRs<UserRs> getAll(Pageable pageable) {
        Page<UserEntity> page = userRepository.findAll(pageable);
        return PageRs.from(page, UserRs::from);
    }

    //Метод для обновления логина
    public UserRs update(Long id, UserRq rq) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        if (!Objects.equals(rq.getPassword(), user.getPassword())) {
            throw new PasswordConfirmationException();
        }
        user.setLogin(rq.getLogin());
        userRepository.save(user);
        return UserRs.from(user);
    }
    //Метод для обновления пароля
    public UserRs update(Long id, UserUpdateRq rq) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        if (!Objects.equals(rq.oldPassword(), user.getPassword())) {
            throw new PasswordConfirmationException();
        }
        user.setPassword(rq.newPassword());
        user = userRepository.save(user);
        return UserRs.from(user);
    }

    public UserRs delete(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        userRepository.delete(user);
        return UserRs.from(user);
    }

    public void subscribe(Long fromId, Long toId) {
        UserEntity from = userRepository.findById(fromId).orElseThrow();
        UserEntity to = userRepository.findById(toId).orElseThrow();

        from.getSubscriptions().add(to);
        userRepository.save(from);
    }

    public void unsubscribe(Long fromId, Long toId) {
        UserEntity from = userRepository.findById(fromId).orElseThrow();
        UserEntity to = userRepository.findById(toId).orElseThrow();

        from.getSubscriptions().remove(to);
        userRepository.save(from);
    }
}
