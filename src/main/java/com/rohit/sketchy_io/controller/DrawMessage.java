package com.rohit.sketchy_io.controller;

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
    private DrawMessageType type;
    private String color;
    private int lineWidth;
}
