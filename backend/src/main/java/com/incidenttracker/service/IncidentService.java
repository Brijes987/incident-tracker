package com.incidenttracker.service;

import com.incidenttracker.dto.CreateIncidentRequest;
import com.incidenttracker.dto.IncidentResponse;
import com.incidenttracker.dto.PageResponse;
import com.incidenttracker.dto.UpdateIncidentRequest;
import com.incidenttracker.exception.ResourceNotFoundException;
import com.incidenttracker.model.Incident;
import com.incidenttracker.repository.IncidentRepository;
import com.incidenttracker.repository.IncidentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IncidentService {
    
    private final IncidentRepository incidentRepository;
    
    @Transactional
    public IncidentResponse createIncident(CreateIncidentRequest request) {
        Incident incident = new Incident();
        incident.setTitle(request.getTitle());
        incident.setService(request.getService());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setOwner(request.getOwner());
        incident.setSummary(request.getSummary());
        
        Incident saved = incidentRepository.save(incident);
        return IncidentResponse.from(saved);
    }
    
    public PageResponse<IncidentResponse> getIncidents(
            String search,
            Incident.Severity severity,
            Incident.Status status,
            String service,
            Pageable pageable) {
        
        Page<Incident> incidents = incidentRepository.findAll(
            IncidentSpecification.withFilters(search, severity, status, service),
            pageable
        );
        
        Page<IncidentResponse> responsePage = incidents.map(IncidentResponse::from);
        return PageResponse.from(responsePage);
    }
    
    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
        return IncidentResponse.from(incident);
    }
    
    @Transactional
    public IncidentResponse updateIncident(Long id, UpdateIncidentRequest request) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
        
        if (request.getTitle() != null) {
            incident.setTitle(request.getTitle());
        }
        if (request.getService() != null) {
            incident.setService(request.getService());
        }
        if (request.getSeverity() != null) {
            incident.setSeverity(request.getSeverity());
        }
        if (request.getStatus() != null) {
            incident.setStatus(request.getStatus());
        }
        if (request.getOwner() != null) {
            incident.setOwner(request.getOwner());
        }
        if (request.getSummary() != null) {
            incident.setSummary(request.getSummary());
        }
        
        Incident updated = incidentRepository.save(incident);
        return IncidentResponse.from(updated);
    }
}
