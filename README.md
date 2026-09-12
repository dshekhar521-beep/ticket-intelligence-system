# 🎫 Ticket Intelligence System

An intelligent customer support ticket management system built with **Java Spring Boot, MySQL, and a web-based frontend**.

The system analyzes customer support tickets using rule-based NLP/keyword analysis to identify **category, sentiment, urgency, escalation risk, and priority score**, helping support teams focus on high-impact tickets first.

---

## 📌 Problem Statement

Customer support teams receive a large number of tickets every day. Traditional ticket systems often prioritize tickets based mainly on arrival time or manually assigned priority.

As a result, critical issues such as:

- Payment failures
- Duplicate charges
- Service outages
- Repeated complaints
- Escalation threats
- Highly dissatisfied customers

may not receive immediate attention.

The goal of this project is to automatically analyze incoming tickets and determine which tickets deserve the highest priority.

---

## 💡 Solution

The **Ticket Intelligence System** combines ticket management with an intelligent analysis layer.

When a ticket is created, the system analyzes its description and automatically determines:

- 🏷️ Ticket Category
- 🎯 Priority
- 😊 Sentiment
- ⚡ Urgency
- 🚨 Escalation Risk
- 📊 Explainable Priority Score
- 💬 Priority Reason
- 🤖 Suggested Support Response

This allows support agents to quickly identify the tickets that require immediate attention.

### Example

A simple password-reset request may receive a low priority score.

A complaint such as:

> "I was charged twice for a ₹20,000 payment. This is my third complaint and I will escalate this issue if it is not resolved immediately."

can be identified as:

```text
Category          : PAYMENT
Sentiment         : NEGATIVE
Urgency           : HIGH
Escalation Risk   : HIGH
Priority Score    : 100/100
Priority          : CRITICAL
