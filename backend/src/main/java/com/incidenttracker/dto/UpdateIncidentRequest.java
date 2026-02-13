package com.incidenttracker.dto;

import com.incidenttracker.model.Incident;
import lombok.Data;

@Data
public class UpdateIncidentRequest {
    private String title;
    private String service;
    private Incident.Severity severity;
    private Incident.Status status;
    private String owner;
    private String summary;
}
