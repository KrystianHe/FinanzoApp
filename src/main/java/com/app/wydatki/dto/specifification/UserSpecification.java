package com.app.wydatki.dto.specifification;

import com.app.wydatki.dto.fiilter.UserFilterDTO;
import com.app.wydatki.model.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class UserSpecification {

    public static Specification<User> filter(UserFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("id"), filter.getId()));
            }
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
            }
            if (filter.getLastname() != null && !filter.getLastname().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("lastname")), "%" + filter.getLastname().toLowerCase() + "%"));
            }
            if (filter.getEmail() != null && !filter.getEmail().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + filter.getEmail().toLowerCase() + "%"));
            }
            if (filter.getLogin() != null && !filter.getLogin().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("login")), "%" + filter.getLogin().toLowerCase() + "%"));
            }
            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getUserType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("userType"), filter.getUserType()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
