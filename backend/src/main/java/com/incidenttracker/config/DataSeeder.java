package com.incidenttracker.config;

import com.incidenttracker.model.Incident;
import com.incidenttracker.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    
    private final IncidentRepository incidentRepository;
    
    private static final String[] SERVICES = {
        "API Gateway", "Auth Service", "Payment Service", "User Service",
        "Notification Service", "Database", "Cache Layer", "Load Balancer",
        "CDN", "Search Service", "Analytics Service", "Email Service"
    };
    
    private static final String[] TITLES = {
        "High latency in API responses",
        "Database connection pool exhausted",
        "Memory leak detected",
        "Service unavailable",
        "Timeout errors increasing",
        "CPU usage spike",
        "Disk space running low",
        "Authentication failures",
        "Payment processing errors",
        "Email delivery failures",
        "Cache invalidation issues",
        "Rate limiting triggered",
        "SSL certificate expiring",
        "Network connectivity issues",
        "Data inconsistency detected"
    };
    
    private static final String[] OWNERS = {
        "alice@company.com", "bob@company.com", "charlie@company.com",
        "diana@company.com", "eve@company.com", null
    };
    
    private static final String[] SUMMARIES = {
        "Users experiencing slow response times during peak hours",
        "Connection pool reached maximum capacity causing request failures",
        "Memory consumption gradually increasing over time",
        "Service returning 503 errors intermittently",
        "Multiple timeout errors reported by monitoring system",
        "CPU utilization reached 95% causing performance degradation",
        "Disk usage at 85% and growing, cleanup required",
        "Users unable to login, authentication service returning errors",
        "Payment transactions failing with gateway timeout errors",
        "Email notifications not being delivered to users",
        "Stale data being served from cache after updates",
        "API rate limits being hit by several clients",
        "SSL certificate expires in 7 days, renewal needed",
        "Intermittent network packet loss detected",
        "Data mismatch between primary and replica databases"
    };
    
    @Override
    public void run(String... args) {
        if (incidentRepository.count() == 0) {
            List<Incident> incidents = new ArrayList<>();
            Random random = new Random();
            
            for (int i = 0; i < 200; i++) {
                Incident incident = new Incident();
                incident.setTitle(TITLES[random.nextInt(TITLES.length)] + " #" + (i + 1));
                incident.setService(SERVICES[random.nextInt(SERVICES.length)]);
                incident.setSeverity(Incident.Severity.values()[random.nextInt(Incident.Severity.values().length)]);
                incident.setStatus(Incident.Status.values()[random.nextInt(Incident.Status.values().length)]);
                incident.setOwner(OWNERS[random.nextInt(OWNERS.length)]);
                incident.setSummary(SUMMARIES[random.nextInt(SUMMARIES.length)]);
                
                incidents.add(incident);
            }
            
            incidentRepository.saveAll(incidents);
            System.out.println("Seeded 200 incidents into database");
        }
    }
}
