package com.foodscanner.server;

import com.foodscanner.server.model.FoodItem;
import com.foodscanner.server.repository.FoodItemRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FoodScannerController {

    @Autowired
    private FoodItemRepository repository;

    // Add a food item
    @PostMapping("/fooditems")
    public ResponseEntity<FoodItem> addFoodItem(@Valid @RequestBody FoodItem item) {
        FoodItem saved = repository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Get all food items
    @GetMapping("/fooditems")
    public ResponseEntity<List<FoodItem>> getAllItems() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Get food item by barcode
    @GetMapping("/fooditems/barcode/{barcode}")
    public ResponseEntity<FoodItem> getByBarcode(@PathVariable String barcode) {
        Optional<FoodItem> item = repository.findByBarcode(barcode);
        return item.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
