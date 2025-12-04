package com.example.PFE.Controller;


import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsChatMessage {

    private String sender;
    private String content;
    private WsChatMessageType type;

}
