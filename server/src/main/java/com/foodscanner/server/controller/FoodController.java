package com.foodscanner.server;

import com.foodscanner.server.model.FoodItem;
import com.foodscanner.server.repository.FoodItemRepository;

import org.springframework.web.bind.annotation.*;


@RestController
public class FoodController {
    private final FoodItemRepository repo;

    public FoodController(FoodItemRepository repo) {
        this.repo = repo;
    }
}

