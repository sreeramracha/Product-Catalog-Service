package com.project.productcatalogservice.services;

import com.project.productcatalogservice.clients.GroqClient;
import com.project.productcatalogservice.dto.Choice;
import com.project.productcatalogservice.dto.GroqPitchResponseDto;
import com.project.productcatalogservice.dto.Message;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.service.PitchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PitchServiceTests {

    @Mock // object/mock without any code
    private GroqClient groqClient;

    @InjectMocks
    private PitchService pitchService;

    private GroqPitchResponseDto replyWith(String text) {
        GroqPitchResponseDto response = new GroqPitchResponseDto();
        List<Choice> choices = new ArrayList<>();

        Message message = new Message();
        message.setContent(text);
        choices.add(new Choice(message));
        response.setChoices(choices);
        return response;
    }

    private Product mascara() {
        Category category = new Category();
        category.setName("beauty");
        Product product = new Product();
        product.setName("Mascara");
        product.setPrice(new BigDecimal("9.99"));
        product.setCategory(category);
        return product;
    }

    @Test
    void generatePitch_groqAnswers_returnsTheTrimmedText() {
        when(groqClient.chat(anyMap()))
                .thenReturn(replyWith("Glow up for $9.99!"));

        String pitch = pitchService.generatePitch(mascara());

        assertThat(pitch).isEqualTo("Glow up for $9.99!");
    }

    // Test 2 - Assume grok is down
    // expect a fallback response
    @Test
    void generatePitch_groqFails_returnsTheTemplateSentence() {
        when(groqClient.chat(anyMap())).thenThrow(new RuntimeException("Groq is down"));

        String pitch = pitchService.generatePitch(mascara());

        assertThat(pitch).isEqualTo("New arrival: Mascara for just $9.99. Check it out!");
    }

}