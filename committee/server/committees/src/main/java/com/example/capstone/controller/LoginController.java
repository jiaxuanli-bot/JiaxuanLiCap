package com.example.capstone.controller;

import com.example.capstone.entities.*;
import com.example.capstone.repositories.UserRepository;
import com.example.capstone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping( "" )
@Validated
public class LoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepo;

    @RequestMapping( value="/login", method= RequestMethod.POST )
    public com.example.capstone.entitiesNew.User login(@RequestBody(required=true) User reauestUser) {
        com.example.capstone.entitiesNew.User user;
        System.out.println("email:"+reauestUser.getEmail());
        user = userRepo.findByEmailEquals(reauestUser.getEmail());
        System.out.println(11);
        return user;
    }
}

