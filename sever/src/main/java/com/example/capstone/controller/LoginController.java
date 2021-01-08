package com.example.capstone.controller;

import com.example.capstone.entities.*;
import com.example.capstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping( "" )
@Validated
public class LoginController {

    @Autowired
    private UserRepository userRepo;

    @RequestMapping( value="/login", method= RequestMethod.POST )
    public com.example.capstone.entities.User login(@RequestBody(required=true) User reauestUser) {
        com.example.capstone.entities.User user;
        System.out.println("email:"+reauestUser.getEmail());
        List<User> users;
        users = userRepo.findByEmailEquals(reauestUser.getEmail());
        user = users.get(users.size() - 1);
        return user;
    }
}

