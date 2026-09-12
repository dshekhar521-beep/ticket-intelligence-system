package com.ticketintelligence.ticket_intelligence.service;

import com.ticketintelligence.ticket_intelligence.dto.TicketIntelligenceResult;
import org.springframework.stereotype.Service;

@Service
public class TicketIntelligenceService {

    public TicketIntelligenceResult analyzeTicket(String description) {

        // Prevent errors if description is empty
        if (description == null || description.isBlank()) {
            description = "general customer issue";
        }

        String text = description.toLowerCase();

        // Default values
        String category = "GENERAL";
        String priority = "LOW";
        String sentiment = "NEUTRAL";
        String urgency = "LOW";
        String escalationRisk = "LOW";

        int score = 0;

        String priorityReason;
        String suggestedResponse;

        // =========================================================
        // 1. CATEGORY DETECTION
        // =========================================================

        // Payment related issues
        if (text.contains("payment")
                || text.contains("charged")
                || text.contains("refund")
                || text.contains("transaction")
                || text.contains("billing")
                || text.contains("money")) {

            category = "PAYMENT";
        }

        // Technical related issues
        else if (text.contains("login")
                || text.contains("password")
                || text.contains("error")
                || text.contains("crash")
                || text.contains("application")
                || text.contains("app")
                || text.contains("technical")
                || text.contains("not working")
                || text.contains("down")) {

            category = "TECHNICAL";
        }

        // Account related issues
        else if (text.contains("account")
                || text.contains("profile")
                || text.contains("username")
                || text.contains("sign up")
                || text.contains("register")) {

            category = "ACCOUNT";
        }

        // Delivery related issues
        else if (text.contains("delivery")
                || text.contains("shipping")
                || text.contains("package")
                || text.contains("order")
                || text.contains("shipment")) {

            category = "DELIVERY";
        }


        // =========================================================
        // 2. SENTIMENT DETECTION
        // =========================================================

        if (text.contains("angry")
                || text.contains("frustrated")
                || text.contains("terrible")
                || text.contains("worst")
                || text.contains("unhappy")
                || text.contains("disappointed")
                || text.contains("hate")
                || text.contains("ridiculous")
                || text.contains("useless")) {

            sentiment = "NEGATIVE";
            score += 20;
        }


        // =========================================================
        // 3. URGENCY DETECTION
        // =========================================================

        if (text.contains("urgent")
                || text.contains("immediately")
                || text.contains("as soon as possible")
                || text.contains("right now")
                || text.contains("emergency")
                || text.contains("critical")
                || text.contains("immediate")) {

            urgency = "HIGH";
            score += 30;
        }


        // =========================================================
        // 4. ESCALATION RISK DETECTION
        // =========================================================

        if (text.contains("legal")
                || text.contains("lawyer")
                || text.contains("lawsuit")
                || text.contains("court")
                || text.contains("complaint")
                || text.contains("consumer forum")
                || text.contains("report you")
                || text.contains("escalate")) {

            escalationRisk = "HIGH";
            score += 30;
        }


        // =========================================================
        // 5. BUSINESS IMPACT
        // =========================================================

        // Duplicate payment / financial loss
        if (text.contains("charged twice")
                || text.contains("charged two times")
                || text.contains("duplicate")
                || text.contains("double charged")) {

            score += 40;
        }

        // Payment problems are generally higher impact
        else if (category.equals("PAYMENT")) {

            score += 20;
        }

        // Major technical outage
        if (text.contains("completely down")
                || text.contains("system is down")
                || text.contains("application is down")
                || text.contains("not working at all")) {

            score += 20;
        }


        // =========================================================
        // 6. REPEATED COMPLAINT
        // =========================================================

        if (text.contains("third time")
                || text.contains("second time")
                || text.contains("again")
                || text.contains("repeated")
                || text.contains("multiple times")
                || text.contains("already complained")) {

            score += 20;
        }


        // =========================================================
        // 7. LIMIT SCORE TO 100
        // =========================================================

        if (score > 100) {
            score = 100;
        }


        // =========================================================
        // 8. DETERMINE FINAL PRIORITY
        // =========================================================

        if (score >= 80) {

            priority = "CRITICAL";

        } else if (score >= 50) {

            priority = "HIGH";

        } else if (score >= 25) {

            priority = "MEDIUM";

        } else {

            priority = "LOW";
        }


        // =========================================================
        // 9. PRIORITY EXPLANATION
        // =========================================================

        if (score >= 80) {

            priorityReason =
                    "High business impact with strong urgency, customer dissatisfaction, or escalation signals.";

        } else if (score >= 50) {

            priorityReason =
                    "Significant customer impact or risk signals detected.";

        } else if (score >= 25) {

            priorityReason =
                    "Moderate customer impact or urgency detected.";

        } else {

            priorityReason =
                    "Low urgency and limited customer risk detected.";
        }


        // =========================================================
        // 10. SUGGESTED CUSTOMER RESPONSE
        // =========================================================

        if (category.equals("PAYMENT")) {

            suggestedResponse =
                    "We sincerely apologize for the payment issue and understand the urgency of your concern. "
                            + "Our support team is reviewing the transaction and will work to resolve this as quickly as possible.";

        } else if (category.equals("TECHNICAL")) {

            suggestedResponse =
                    "We are sorry for the inconvenience caused by this technical issue. "
                            + "Our team is reviewing the problem and will work to restore the service as soon as possible.";

        } else if (category.equals("ACCOUNT")) {

            suggestedResponse =
                    "We understand the difficulty you are experiencing with your account. "
                            + "Our support team will review the issue and help you resolve it as quickly as possible.";

        } else if (category.equals("DELIVERY")) {

            suggestedResponse =
                    "We apologize for the inconvenience with your order or delivery. "
                            + "Our support team is checking the shipment details and will help resolve the issue as soon as possible.";

        } else {

            suggestedResponse =
                    "We are sorry for the inconvenience. "
                            + "Our support team is reviewing your request and will work to resolve your issue as quickly as possible.";
        }


        // =========================================================
        // 11. RETURN COMPLETE AI RESULT
        // =========================================================

        return new TicketIntelligenceResult(
                category,
                priority,
                sentiment,
                urgency,
                escalationRisk,
                score,
                priorityReason,
                suggestedResponse
        );
    }
}