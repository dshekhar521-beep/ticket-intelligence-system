package com.ticketintelligence.ticket_intelligence.repository;

import com.ticketintelligence.ticket_intelligence.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("""
            SELECT t FROM Ticket t
            WHERE (:priority IS NULL OR t.priority = :priority)
            AND (:status IS NULL OR t.status = :status)
            AND (:category IS NULL OR t.category = :category)
            """)
    List<Ticket> searchTickets(
            @Param("priority") String priority,
            @Param("status") String status,
            @Param("category") String category
    );
}