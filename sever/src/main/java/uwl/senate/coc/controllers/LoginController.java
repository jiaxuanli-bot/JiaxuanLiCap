package uwl.senate.coc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import uwl.senate.coc.entities.*;
import uwl.senate.coc.repositories.UserRepository;

import java.util.List;

@RestController
@RequestMapping( "" )
@Validated
public class LoginController {

    @Autowired
    private UserRepository userRepo;

    @RequestMapping( value="/login", method= RequestMethod.POST )
    public uwl.senate.coc.entities.User login(@RequestBody(required=true) User reauestUser) {
        uwl.senate.coc.entities.User user;
        System.out.println("email:"+reauestUser.getEmail());
        List<User> users;
        users = userRepo.findByEmailEquals(reauestUser.getEmail());
        user = users.get(users.size() - 1);
        return user;
    }
}

