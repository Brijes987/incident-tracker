package com.incidenttracker.dto;

import com.incidenttracker.model.Incident;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateIncidentRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Service is required")
    private String service;
    
    @NotNull(message = "Severity is required")
    private Incident.Severity severity;
    
    @NotNull(message = "Status is required")
    private Incident.Status status;
    
    private String owner;
    
    private String summary;
}
