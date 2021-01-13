package com.example.capstone.repositories;

import com.example.capstone.entities.Comment;
import com.example.capstone.entities.Committee;
import com.example.capstone.entities.User;
import com.example.capstone.projections.CommentInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
   CommentInterface findByCommitteeAndUser(Committee committee, User user);
   Comment findByCommitteeEqualsAndUserEquals(Committee committee, User user);
}

