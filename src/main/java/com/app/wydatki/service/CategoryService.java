package com.app.wydatki.service;

import com.app.wydatki.model.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(Category category, Long userId);
    
    Category getCategoryById(Long id, Long userId);
    
    List<Category> getAllCategories(Long userId);
    
    List<Category> getAllCategoriesIncludingSystem(Long userId);
    
    Category getCategoryByName(String name, Long userId);
    
    Category updateCategory(Long id, Category category, Long userId);
    
    void deleteCategory(Long id, Long userId);
    
    List<Category> getSystemCategories();
    
    void initializeDefaultCategories();
}
