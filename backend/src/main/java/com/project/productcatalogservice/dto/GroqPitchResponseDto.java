package com.project.productcatalogservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GroqPitchResponseDto {
    private List<Choice> choices;
}
