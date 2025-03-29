package com.rohit.sketchy_io.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Service;

@Service
public class WordService {
    private List<String> words;

    public WordService() {
        try {
            InputStream inputStream = WordService.class.getClassLoader().getResourceAsStream("words.txt");

            if (inputStream != null) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                words = new ArrayList<>();
                String line;

                while ((line = reader.readLine()) != null) {
                    if (!line.isBlank()) {
                        words.add(line);
                    }
                }
            }
            // System.out.println(words);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<String> get3Words() {
        if (words.size() >= 3) {
            Random random = new Random();
            List<String> randomWords = new ArrayList<>();

            while (randomWords.size() < 3) {
                int randomIndex = random.nextInt(words.size());
                randomWords.add(words.get(randomIndex));
            }

            return randomWords;
        } else {
            System.out.println("Not enough words in the list!");
            return new ArrayList<>();
        }

    }
}
