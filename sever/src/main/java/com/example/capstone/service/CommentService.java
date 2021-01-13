package com.example.capstone.service;

import com.example.capstone.entities.Comment;
import com.example.capstone.entities.Committee;
import com.example.capstone.entities.User;
import com.example.capstone.projections.CommentInterface;
import com.example.capstone.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;

    public CommentInterface getCommentByCommitteeAndUser(User u, Committee c){
       return this.commentRepo.findByCommitteeAndUser(c, u);
    }

    public void save(Comment comment){
        Comment c= this.commentRepo.findByCommitteeEqualsAndUserEquals(comment.getCommittee(), comment.getUser());
        if (c == null) {
            this.commentRepo.save(comment);
        } else {
            c.setComment(comment.getComment());
            this.commentRepo.save(c);
        }
    };

}
