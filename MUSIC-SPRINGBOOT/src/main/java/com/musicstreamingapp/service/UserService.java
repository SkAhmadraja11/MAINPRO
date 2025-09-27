package com.musicstreamingapp.service;

import com.musicstreamingapp.entity.User;
import com.musicstreamingapp.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.util.List;

@Service
@Validated
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(@Valid User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
    User user = userRepository.findByUsername(username);
    if (user == null) {
        throw new RuntimeException("User not found");
    }
    if (!user.getPassword().equals(password)) {
        throw new RuntimeException("Invalid credentials");
    }
    return user;
}


    public User updateProfile(Long id, @Valid User updatedUser) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        if (!updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}