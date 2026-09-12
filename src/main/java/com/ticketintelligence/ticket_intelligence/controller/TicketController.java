package com.ticketintelligence.ticket_intelligence.controller;

import com.ticketintelligence.ticket_intelligence.dto.TicketIntelligenceResult;
import com.ticketintelligence.ticket_intelligence.dto.TicketStats;
import com.ticketintelligence.ticket_intelligence.entity.Ticket;
import com.ticketintelligence.ticket_intelligence.service.TicketIntelligenceService;
import com.ticketintelligence.ticket_intelligence.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final TicketIntelligenceService ticketIntelligenceService;

    public TicketController(
            TicketService ticketService,
            TicketIntelligenceService ticketIntelligenceService) {

        this.ticketService = ticketService;
        this.ticketIntelligenceService = ticketIntelligenceService;
    }

    // Create a new ticket
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // Get all tickets
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // Get ticket by ID
    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    // Update ticket
    @PutMapping("/{id}")
    public Ticket updateTicket(
            @PathVariable Long id,
            @RequestBody Ticket ticket) {

        return ticketService.updateTicket(id, ticket);
    }

    // Delete ticket
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }

    // Search and filter tickets
    @GetMapping("/search")
    public List<Ticket> searchTickets(
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {

        return ticketService.searchTickets(
                priority,
                status,
                category
        );
    }

    // Get ticket statistics
    @GetMapping("/stats")
    public TicketStats getTicketStats() {
        return ticketService.getTicketStats();
    }

    // Analyze ticket using intelligence service
    @PostMapping("/analyze")
    public TicketIntelligenceResult analyzeTicket(
            @RequestBody Ticket ticket) {

        return ticketIntelligenceService.analyzeTicket(
                ticket.getDescription()
        );
    }
}