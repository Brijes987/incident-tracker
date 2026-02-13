package com.incidenttracker.dto;

import com.incidenttracker.model.Incident;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidentResponse {
    private Long id;
    private String title;
    private String service;
    private Incident.Severity severity;
    private Incident.Status status;
    private String owner;
    private String summary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static IncidentResponse from(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setTitle(incident.getTitle());
        response.setService(incident.getService());
        response.setSeverity(incident.getSeverity());
        response.setStatus(incident.getStatus());
        response.setOwner(incident.getOwner());
        response.setSummary(incident.getSummary());
        response.setCreatedAt(incident.getCreatedAt());
        response.setUpdatedAt(incident.getUpdatedAt());
        return response;
    }
}
