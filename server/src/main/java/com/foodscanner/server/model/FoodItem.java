package com.foodscanner.server.model;

import jakarta.persistence.*;

@Entity
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Name is required")
    private String name;

    @Min(value = 0, message = "Calories must be positive")
    private int calories;


    // ✅ Getters and Setters required
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }
}
