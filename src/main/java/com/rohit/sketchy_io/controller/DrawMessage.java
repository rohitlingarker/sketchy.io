package com.rohit.sketchy_io.controller;

import java.util.List;

import com.rohit.sketchy_io.entity.Player;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DrawMessage {
    private int x;
    private int y;
    private Player player;
    private DrawMessageType type;
    private String color;
    private int lineWidth;
    private List<String> words;
}
