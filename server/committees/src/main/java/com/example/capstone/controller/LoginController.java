package com.example.capstone.controller;

import com.example.capstone.entities.*;
import com.example.capstone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Pattern;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping( "" )
@Validated
public class LoginController {

    @Autowired
    private UserService userService;
    @RequestMapping( value="/login", method= RequestMethod.POST )
    public User login(@RequestBody(required=true) User reauestUser) {
        User user;
        System.out.println("email:"+reauestUser.getEmail());
        user = userService.searchUserByEmail(reauestUser.getEmail());
        return user;
    }

}

