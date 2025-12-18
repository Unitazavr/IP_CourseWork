package server.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class UserEntity extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String login;
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PostEntity> posts = new HashSet<>();
    // Подписки: на кого я подписан
    @ManyToMany
    @JoinTable(
            name = "user_subscriptions",
            joinColumns = @JoinColumn(name = "subscriber_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<UserEntity> subscriptions = new HashSet<>();
    // Подписчики: кто подписан на меня
    @ManyToMany(mappedBy = "subscriptions")
    private Set<UserEntity> subscribers = new HashSet<>();

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Set<PostEntity> getPosts() {
        return posts;
    }

    public void setPosts(Set<PostEntity> posts) {
        this.posts = posts;
    }

    public Set<UserEntity> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(Set<UserEntity> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public Set<UserEntity> getSubscribers() {
        return subscribers;
    }

    public void setSubscribers(Set<UserEntity> subscribers) {
        this.subscribers = subscribers;
    }
}