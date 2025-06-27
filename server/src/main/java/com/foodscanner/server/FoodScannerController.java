package com.foodscanner.server;

import com.foodscanner.server.model.FoodItem;
import com.foodscanner.server.repository.FoodItemRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodScannerController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @PostMapping("/fooditems")
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody @Valid FoodItem foodItem) {
        FoodItem saved = foodItemRepository.save(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/fooditems")
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    @GetMapping("/fooditems/barcode/{barcode}")
    public ResponseEntity<FoodItem> getByBarcode(@PathVariable String barcode) {
        return foodItemRepository.findByBarcode(barcode)
                .map(item -> ResponseEntity.ok().body(item))
                .orElse(ResponseEntity.notFound().build());
    }
}
