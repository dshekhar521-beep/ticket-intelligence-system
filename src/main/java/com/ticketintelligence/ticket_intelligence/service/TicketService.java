package com.ticketintelligence.ticket_intelligence.service;

import com.ticketintelligence.ticket_intelligence.dto.TicketIntelligenceResult;
import com.ticketintelligence.ticket_intelligence.dto.TicketStats;
import com.ticketintelligence.ticket_intelligence.entity.Ticket;
import com.ticketintelligence.ticket_intelligence.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketIntelligenceService ticketIntelligenceService;

    public TicketService(
            TicketRepository ticketRepository,
            TicketIntelligenceService ticketIntelligenceService) {

        this.ticketRepository = ticketRepository;
        this.ticketIntelligenceService = ticketIntelligenceService;
    }


    // =========================================================
    // CREATE TICKET
    // =========================================================

    public Ticket createTicket(Ticket ticket) {

        analyzeAndSetIntelligence(ticket);

        return ticketRepository.save(ticket);
    }


    // =========================================================
    // GET ALL TICKETS
    // =========================================================

    public List<Ticket> getAllTickets() {

        return ticketRepository.findAll();
    }


    // =========================================================
    // GET TICKET BY ID
    // =========================================================

    public Ticket getTicketById(Long id) {

        return ticketRepository.findById(id)
                .orElse(null);
    }


    // =========================================================
    // UPDATE TICKET
    // =========================================================

    public Ticket updateTicket(
            Long id,
            Ticket updatedTicket) {

        Ticket existingTicket =
                ticketRepository.findById(id)
                        .orElse(null);

        if (existingTicket == null) {
            return null;
        }


        // Update basic information
        existingTicket.setTitle(
                updatedTicket.getTitle()
        );

        existingTicket.setDescription(
                updatedTicket.getDescription()
        );

        existingTicket.setStatus(
                updatedTicket.getStatus()
        );


        // Re-analyze the ticket after editing
        analyzeAndSetIntelligence(existingTicket);


        return ticketRepository.save(existingTicket);
    }


    // =========================================================
    // DELETE TICKET
    // =========================================================

    public void deleteTicket(Long id) {

        ticketRepository.deleteById(id);
    }


    // =========================================================
    // SEARCH / FILTER
    // =========================================================

    public List<Ticket> searchTickets(
            String priority,
            String status,
            String category) {

        return ticketRepository.searchTickets(
                priority,
                status,
                category
        );
    }


    // =========================================================
    // TICKET STATISTICS
    // =========================================================

    public TicketStats getTicketStats() {

        List<Ticket> tickets =
                ticketRepository.findAll();


        long totalTickets =
                tickets.size();


        long openTickets =
                tickets.stream()
                        .filter(ticket ->
                                "OPEN".equalsIgnoreCase(
                                        ticket.getStatus()
                                ))
                        .count();


        long inProgressTickets =
                tickets.stream()
                        .filter(ticket ->
                                "IN_PROGRESS".equalsIgnoreCase(
                                        ticket.getStatus()
                                ))
                        .count();


        long criticalTickets =
                tickets.stream()
                        .filter(ticket ->
                                "CRITICAL".equalsIgnoreCase(
                                        ticket.getPriority()
                                ))
                        .count();


        long highPriorityTickets =
                tickets.stream()
                        .filter(ticket ->
                                "HIGH".equalsIgnoreCase(
                                        ticket.getPriority()
                                ))
                        .count();


        long negativeSentimentTickets =
                tickets.stream()
                        .filter(ticket ->
                                "NEGATIVE".equalsIgnoreCase(
                                        ticket.getSentiment()
                                ))
                        .count();


        long highEscalationRiskTickets =
                tickets.stream()
                        .filter(ticket ->
                                "HIGH".equalsIgnoreCase(
                                        ticket.getEscalationRisk()
                                ))
                        .count();


        double averagePriorityScore =
                tickets.stream()
                        .mapToInt(Ticket::getPriorityScore)
                        .average()
                        .orElse(0.0);


        return new TicketStats(
                totalTickets,
                openTickets,
                inProgressTickets,
                criticalTickets,
                highPriorityTickets,
                negativeSentimentTickets,
                highEscalationRiskTickets,
                averagePriorityScore
        );
    }


    // =========================================================
    // AI / INTELLIGENCE HELPER
    // =========================================================

    private void analyzeAndSetIntelligence(Ticket ticket) {

        TicketIntelligenceResult result =
                ticketIntelligenceService.analyzeTicket(
                        ticket.getDescription()
                );


        ticket.setCategory(
                result.getSuggestedCategory()
        );

        ticket.setPriority(
                result.getSuggestedPriority()
        );

        ticket.setSentiment(
                result.getSentiment()
        );

        ticket.setUrgency(
                result.getUrgency()
        );

        ticket.setEscalationRisk(
                result.getEscalationRisk()
        );

        ticket.setPriorityScore(
                result.getPriorityScore()
        );

        ticket.setPriorityReason(
                result.getPriorityReason()
        );

        ticket.setSuggestedResponse(
                result.getSuggestedResponse()
        );
    }
}