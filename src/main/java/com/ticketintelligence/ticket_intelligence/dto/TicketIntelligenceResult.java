package com.ticketintelligence.ticket_intelligence.dto;

public class TicketIntelligenceResult {

    private String suggestedCategory;
    private String suggestedPriority;
    private String sentiment;
    private String urgency;
    private String escalationRisk;
    private int priorityScore;
    private String priorityReason;
    private String suggestedResponse;

    public TicketIntelligenceResult(
            String suggestedCategory,
            String suggestedPriority,
            String sentiment,
            String urgency,
            String escalationRisk,
            int priorityScore,
            String priorityReason,
            String suggestedResponse) {

        this.suggestedCategory = suggestedCategory;
        this.suggestedPriority = suggestedPriority;
        this.sentiment = sentiment;
        this.urgency = urgency;
        this.escalationRisk = escalationRisk;
        this.priorityScore = priorityScore;
        this.priorityReason = priorityReason;
        this.suggestedResponse = suggestedResponse;
    }

    public String getSuggestedCategory() {
        return suggestedCategory;
    }

    public String getSuggestedPriority() {
        return suggestedPriority;
    }

    public String getSentiment() {
        return sentiment;
    }

    public String getUrgency() {
        return urgency;
    }

    public String getEscalationRisk() {
        return escalationRisk;
    }

    public int getPriorityScore() {
        return priorityScore;
    }

    public String getPriorityReason() {
        return priorityReason;
    }

    public String getSuggestedResponse() {
        return suggestedResponse;
    }
}