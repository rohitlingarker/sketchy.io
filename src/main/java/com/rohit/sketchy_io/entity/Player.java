package com.rohit.sketchy_io.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Player {
    private String username;
    private boolean hasGuessed;

    public Player(String username){
        this.username = username;
    }
}
