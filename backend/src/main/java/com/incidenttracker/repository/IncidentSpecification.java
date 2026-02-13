package com.incidenttracker.repository;

import com.incidenttracker.model.Incident;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class IncidentSpecification {
    
    public static Specification<Incident> withFilters(
            String search,
            Incident.Severity severity,
            Incident.Status status,
            String service) {
        
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (search != null && !search.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + search.toLowerCase() + "%"
                ));
            }
            
            if (severity != null) {
                predicates.add(criteriaBuilder.equal(root.get("severity"), severity));
            }
            
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            
            if (service != null && !service.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("service"), service));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
