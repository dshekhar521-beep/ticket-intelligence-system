const API_BASE = "/api/tickets";

let allTickets = [];
let currentTickets = [];


// =========================================================
// COMMON HELPERS
// =========================================================

function setElementText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}


function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


function escapeAttribute(value) {

    return escapeHtml(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getPriorityClass(priority) {

    if (!priority) {
        return "badge-low";
    }

    return `badge-${priority.toLowerCase()}`;
}


function getSentimentClass(sentiment) {

    if (sentiment === "NEGATIVE") {
        return "badge-negative";
    }

    return "badge-neutral";
}


function getScore(ticket) {

    const score = Number(ticket?.priorityScore);

    if (Number.isFinite(score)) {
        return score;
    }

    return 0;
}


function scrollToTickets() {

    const tickets = document.getElementById("tickets");

    if (tickets) {

        tickets.scrollIntoView({
            behavior: "smooth"
        });

    }
}


// =========================================================
// DASHBOARD
// =========================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API_BASE}/stats`);

        if (!response.ok) {
            throw new Error("Failed to load statistics");
        }

        const stats =
            await response.json();


        setElementText(
            "totalTickets",
            stats.totalTickets ?? 0
        );


        setElementText(
            "openTickets",
            stats.openTickets ?? 0
        );


        setElementText(
            "criticalTickets",
            stats.criticalTickets ?? 0
        );


        setElementText(
            "highPriorityTickets",
            stats.highPriorityTickets ?? 0
        );


        setElementText(
            "negativeSentimentTickets",
            stats.negativeSentimentTickets ?? 0
        );


        setElementText(
            "highEscalationRiskTickets",
            stats.highEscalationRiskTickets ?? 0
        );


        const average =
            Number(stats.averagePriorityScore);


        setElementText(
            "averagePriorityScore",
            Number.isFinite(average)
                ? average.toFixed(1)
                : "0.0"
        );


        setElementText(
            "centerCritical",
            stats.criticalTickets ?? 0
        );


        setElementText(
            "centerHigh",
            stats.highPriorityTickets ?? 0
        );


        setElementText(
            "centerEscalation",
            stats.highEscalationRiskTickets ?? 0
        );


        setElementText(
            "centerNegative",
            stats.negativeSentimentTickets ?? 0
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// =========================================================
// LOAD TICKETS
// =========================================================

async function loadTickets() {

    const tableBody =
        document.getElementById("ticketTableBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="10" class="loading">
                Loading tickets...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(API_BASE);


        if (!response.ok) {

            throw new Error(
                "Failed to load tickets"
            );

        }


        const tickets =
            await response.json();


        allTickets =
            Array.isArray(tickets)
                ? tickets
                : [];


        currentTickets =
            [...allTickets];


        displayTickets(
            currentTickets
        );


        displayHighRiskTickets(
            allTickets
        );


    } catch (error) {

        console.error(
            "Ticket loading error:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    Unable to load tickets.
                    Please refresh.
                </td>
            </tr>
        `;


        displayHighRiskTickets([]);

    }

}


// =========================================================
// DISPLAY TICKETS
// =========================================================

function displayTickets(tickets) {

    const tableBody =
        document.getElementById(
            "ticketTableBody"
        );


    if (!tableBody) {
        return;
    }


    currentTickets =
        Array.isArray(tickets)
            ? tickets
            : [];


    tableBody.innerHTML = "";


    if (currentTickets.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    No tickets found.
                </td>
            </tr>
        `;

        return;
    }


    currentTickets.forEach(ticket => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                #${escapeHtml(ticket.id)}
            </td>


            <td>

                <div class="ticket-title">

                    ${escapeHtml(
                        ticket.title ||
                        "Untitled ticket"
                    )}

                </div>

            </td>


            <td>
                ${escapeHtml(
                    ticket.category ||
                    "GENERAL"
                )}
            </td>


            <td>

                <span
                    class="badge ${getPriorityClass(
                        ticket.priority
                    )}">

                    ${escapeHtml(
                        ticket.priority ||
                        "LOW"
                    )}

                </span>

            </td>


            <td>

                <span
                    class="badge ${getSentimentClass(
                        ticket.sentiment
                    )}">

                    ${escapeHtml(
                        ticket.sentiment ||
                        "NEUTRAL"
                    )}

                </span>

            </td>


            <td>
                ${escapeHtml(
                    ticket.urgency ||
                    "LOW"
                )}
            </td>


            <td>
                ${escapeHtml(
                    ticket.escalationRisk ||
                    "LOW"
                )}
            </td>


            <td>

                <span class="score">

                    ${getScore(ticket)}

                </span>

            </td>


            <td>

                <span class="status-text">

                    ${escapeHtml(
                        ticket.status ||
                        "OPEN"
                    )}

                </span>

            </td>


            <td>

                <div class="ticket-actions">

                    <button
                        class="action-btn"
                        data-action="view"
                        data-id="${ticket.id}">

                        View

                    </button>


                    <button
                        class="action-btn"
                        data-action="edit"
                        data-id="${ticket.id}">

                        Edit

                    </button>


                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${ticket.id}">

                        Delete

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// =========================================================
// HIGH RISK TICKETS
// =========================================================

function displayHighRiskTickets(tickets) {

    const container =
        document.getElementById(
            "highRiskTickets"
        );


    if (!container) {
        return;
    }


    const ranked =
        [...tickets]
            .sort(
                (a, b) =>
                    getScore(b) -
                    getScore(a)
            )
            .slice(0, 5);


    if (ranked.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                No tickets available
                for intelligence analysis.

            </div>
        `;

        return;
    }


    container.innerHTML =
        ranked.map(ticket => {

            return `

                <div class="risk-ticket">


                    <div class="risk-ticket-main">


                        <div class="risk-ticket-title">

                            <span class="risk-id">

                                #${escapeHtml(
                                    ticket.id
                                )}

                            </span>


                            ${escapeHtml(
                                ticket.title ||
                                "Untitled ticket"
                            )}

                        </div>



                        <div class="risk-signals">


                            <span
                                class="badge ${getPriorityClass(
                                    ticket.priority
                                )}">

                                ${escapeHtml(
                                    ticket.priority ||
                                    "LOW"
                                )}

                            </span>


                            <span class="signal">

                                Category:
                                ${escapeHtml(
                                    ticket.category ||
                                    "GENERAL"
                                )}

                            </span>


                            <span class="signal">

                                Urgency:
                                ${escapeHtml(
                                    ticket.urgency ||
                                    "LOW"
                                )}

                            </span>


                            <span class="signal">

                                Escalation:
                                ${escapeHtml(
                                    ticket.escalationRisk ||
                                    "LOW"
                                )}

                            </span>


                        </div>



                        <p class="risk-reason">

                            ${escapeHtml(
                                ticket.priorityReason ||
                                "No priority explanation available."
                            )}

                        </p>


                    </div>



                    <div class="risk-score">

                        <strong>

                            ${getScore(ticket)}

                        </strong>


                        <span>
                            / 100
                        </span>


                        <button
                            class="mini-view-btn"
                            data-action="view"
                            data-id="${ticket.id}">

                            View

                        </button>

                    </div>


                </div>

            `;

        }).join("");

}


// =========================================================
// CREATE TICKET
// =========================================================

const ticketForm =
    document.getElementById(
        "ticketForm"
    );


if (ticketForm) {

    ticketForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const title =
                document
                    .getElementById(
                        "ticketTitle"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "ticketDescription"
                    )
                    .value
                    .trim();


            const status =
                document
                    .getElementById(
                        "ticketStatus"
                    )
                    .value;


            if (!title || !description) {

                alert(
                    "Ticket title and description are required."
                );

                return;
            }


            const submitButton =
                ticketForm.querySelector(
                    "button[type='submit']"
                );


            const originalText =
                submitButton.textContent;


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Analyzing...";


            try {

                const response =
                    await fetch(
                        API_BASE,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    title,
                                    description,
                                    status
                                })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to create ticket"
                    );

                }


                const ticket =
                    await response.json();


                showIntelligenceResult(
                    ticket
                );


                ticketForm.reset();


                await Promise.all([
                    loadDashboard(),
                    loadTickets()
                ]);


                document
                    .getElementById(
                        "intelligenceResult"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });


            } catch (error) {

                console.error(
                    "Create ticket error:",
                    error
                );


                alert(
                    "Unable to create ticket. Please check the server."
                );


            } finally {

                submitButton.disabled =
                    false;


                submitButton.textContent =
                    originalText;

            }

        }
    );

}


// =========================================================
// INTELLIGENCE RESULT
// =========================================================

function showIntelligenceResult(ticket) {

    const result =
        document.getElementById(
            "intelligenceResult"
        );


    if (!result) {
        return;
    }


    result.style.display =
        "block";


    setElementText(
        "resultCategory",
        ticket.category || "GENERAL"
    );


    setElementText(
        "resultPriority",
        ticket.priority || "LOW"
    );


    setElementText(
        "resultSentiment",
        ticket.sentiment || "NEUTRAL"
    );


    setElementText(
        "resultUrgency",
        ticket.urgency || "LOW"
    );


    setElementText(
        "resultEscalation",
        ticket.escalationRisk || "LOW"
    );


    setElementText(
        "resultScore",
        getScore(ticket)
    );


    setElementText(
        "resultReason",
        ticket.priorityReason ||
        "No priority explanation available."
    );


    setElementText(
        "resultResponse",
        ticket.suggestedResponse ||
        "No response suggestion available."
    );

}


// =========================================================
// FILTERS
// =========================================================

async function applyFilters() {

    const priority =
        document.getElementById(
            "priorityFilter"
        ).value;


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const params =
        new URLSearchParams();


    if (priority) {

        params.append(
            "priority",
            priority
        );

    }


    if (category) {

        params.append(
            "category",
            category
        );

    }


    if (status) {

        params.append(
            "status",
            status
        );

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/search${
                    params.toString()
                        ? "?" + params.toString()
                        : ""
                }`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to search tickets"
            );

        }


        const tickets =
            await response.json();


        displayTickets(tickets);


    } catch (error) {

        console.error(
            "Filter error:",
            error
        );


        alert(
            "Unable to apply filters."
        );

    }

}


function clearFilters() {

    document.getElementById(
        "priorityFilter"
    ).value = "";


    document.getElementById(
        "categoryFilter"
    ).value = "";


    document.getElementById(
        "statusFilter"
    ).value = "";


    loadTickets();

}


// =========================================================
// REFRESH EVERYTHING
// =========================================================

async function refreshEverything() {

    await Promise.all([
        loadDashboard(),
        loadTickets()
    ]);

}


// =========================================================
// VIEW TICKET
// =========================================================

async function viewTicket(id) {

    try {

        const response =
            await fetch(
                `${API_BASE}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Ticket not found"
            );

        }


        const ticket =
            await response.json();


        showTicketDetails(ticket);


    } catch (error) {

        console.error(
            "View ticket error:",
            error
        );


        alert(
            "Unable to load ticket."
        );

    }

}


// =========================================================
// SHOW TICKET DETAILS
// =========================================================

function showTicketDetails(ticket) {

    createModalIfNeeded();


    const modal =
        document.getElementById(
            "ticketModal"
        );


    const content =
        document.getElementById(
            "ticketModalContent"
        );


    content.innerHTML = `

        <div class="modal-header">

            <div>

                <p class="eyebrow">
                    TICKET DETAILS
                </p>

                <h2>
                    Ticket #${escapeHtml(ticket.id)}
                </h2>

            </div>


            <button
                class="modal-close"
                type="button"
                onclick="closeTicketModal()">

                ×

            </button>

        </div>



        <div class="ticket-detail">


            <h3>
                ${escapeHtml(
                    ticket.title ||
                    "Untitled ticket"
                )}
            </h3>



            <div class="detail-block">

                <span class="detail-label">
                    Customer Description
                </span>

                <p>
                    ${escapeHtml(
                        ticket.description ||
                        "No description available."
                    )}
                </p>

            </div>



            <div class="detail-grid">


                <div>

                    <span>
                        Category
                    </span>

                    <strong>
                        ${escapeHtml(
                            ticket.category ||
                            "GENERAL"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Priority
                    </span>

                    <strong>
                        ${escapeHtml(
                            ticket.priority ||
                            "LOW"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Sentiment
                    </span>

                    <strong>
                        ${escapeHtml(
                            ticket.sentiment ||
                            "NEUTRAL"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Urgency
                    </span>

                    <strong>
                        ${escapeHtml(
                            ticket.urgency ||
                            "LOW"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Escalation Risk
                    </span>

                    <strong>
                        ${escapeHtml(
                            ticket.escalationRisk ||
                            "LOW"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Priority Score
                    </span>

                    <strong>
                        ${getScore(ticket)}/100
                    </strong>

                </div>


                <div>

                    <span>
                        Status
                    </span>

                    <strong>
                        ${escapeHtml(
                            ticket.status ||
                            "OPEN"
                        )}
                    </strong>

                </div>


            </div>



            <div class="detail-callout">

                <span class="detail-label">
                    Why this priority?
                </span>

                <p>
                    ${escapeHtml(
                        ticket.priorityReason ||
                        "No explanation available."
                    )}
                </p>

            </div>



            <div class="detail-response">

                <span class="detail-label">
                    Suggested Customer Response
                </span>

                <p>
                    ${escapeHtml(
                        ticket.suggestedResponse ||
                        "No response suggestion available."
                    )}
                </p>

            </div>


        </div>

    `;


    modal.style.display =
        "flex";

}


// =========================================================
// EDIT TICKET
// =========================================================

async function editTicket(id) {

    try {

        const response =
            await fetch(
                `${API_BASE}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Ticket not found"
            );

        }


        const ticket =
            await response.json();


        showEditModal(ticket);


    } catch (error) {

        console.error(
            "Edit ticket error:",
            error
        );


        alert(
            "Unable to load ticket."
        );

    }

}


// =========================================================
// EDIT MODAL
// =========================================================

function showEditModal(ticket) {

    createModalIfNeeded();


    const modal =
        document.getElementById(
            "ticketModal"
        );


    const content =
        document.getElementById(
            "ticketModalContent"
        );


    content.innerHTML = `

        <div class="modal-header">

            <div>

                <p class="eyebrow">
                    UPDATE CASE
                </p>

                <h2>
                    Edit Ticket #${escapeHtml(
                        ticket.id
                    )}
                </h2>

            </div>


            <button
                class="modal-close"
                type="button"
                onclick="closeTicketModal()">

                ×

            </button>

        </div>



        <div class="edit-form">


            <label for="editTitle">
                Ticket Title
            </label>

            <input
                id="editTitle"
                type="text"
                maxlength="150"
                value="${escapeAttribute(
                    ticket.title || ""
                )}">



            <label for="editDescription">
                Customer Description
            </label>

            <textarea
                id="editDescription"
                rows="7"
                maxlength="5000">${escapeHtml(
                    ticket.description || ""
                )}</textarea>



            <label for="editStatus">
                Status
            </label>

            <select id="editStatus">

                <option value="OPEN"
                    ${ticket.status === "OPEN"
                        ? "selected"
                        : ""}>
                    OPEN
                </option>

                <option value="IN_PROGRESS"
                    ${ticket.status === "IN_PROGRESS"
                        ? "selected"
                        : ""}>
                    IN_PROGRESS
                </option>

                <option value="RESOLVED"
                    ${ticket.status === "RESOLVED"
                        ? "selected"
                        : ""}>
                    RESOLVED
                </option>

                <option value="CLOSED"
                    ${ticket.status === "CLOSED"
                        ? "selected"
                        : ""}>
                    CLOSED
                </option>

            </select>



            <p class="edit-note">

                Changing the description will trigger
                fresh ticket intelligence analysis.

            </p>



            <button
                class="save-edit-btn"
                type="button"
                onclick="saveTicket(${ticket.id})">

                Save Changes

            </button>

        </div>

    `;


    modal.style.display =
        "flex";

}


// =========================================================
// SAVE TICKET
// =========================================================

async function saveTicket(id) {

    const title =
        document
            .getElementById(
                "editTitle"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "editDescription"
            )
            .value
            .trim();


    const status =
        document.getElementById(
            "editStatus"
        ).value;


    if (!title || !description) {

        alert(
            "Title and description cannot be empty."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            title,
                            description,
                            status
                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update ticket"
            );

        }


        closeTicketModal();


        await Promise.all([
            loadDashboard(),
            loadTickets()
        ]);


        alert(
            "Ticket updated successfully."
        );


    } catch (error) {

        console.error(
            "Update ticket error:",
            error
        );


        alert(
            "Unable to update ticket."
        );

    }

}


// =========================================================
// DELETE TICKET
// =========================================================

async function deleteTicket(id) {

    const confirmed =
        confirm(
            `Are you sure you want to delete ticket #${id}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete ticket"
            );

        }


        await Promise.all([
            loadDashboard(),
            loadTickets()
        ]);


        alert(
            "Ticket deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete ticket error:",
            error
        );


        alert(
            "Unable to delete ticket."
        );

    }

}


// =========================================================
// MODAL CREATION
// =========================================================

function createModalIfNeeded() {

    if (
        document.getElementById(
            "ticketModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "ticketModal";


    modal.className =
        "ticket-modal";


    modal.innerHTML = `

        <div
            class="ticket-modal-box"
            id="ticketModalContent">
        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeTicketModal();

            }

        }
    );

}


function closeTicketModal() {

    const modal =
        document.getElementById(
            "ticketModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// =========================================================
// SIDEBAR
// =========================================================

const sidebar =
    document.getElementById(
        "sidebar"
    );


const sidebarToggle =
    document.getElementById(
        "sidebarToggle"
    );


if (
    sidebar &&
    sidebarToggle
) {

    sidebarToggle.addEventListener(
        "click",
        function() {

            sidebar.classList.toggle(
                "collapsed"
            );


            sidebarToggle.textContent =
                sidebar.classList.contains(
                    "collapsed"
                )
                    ? "›"
                    : "‹";

        }
    );

}


// =========================================================
// NAVIGATION
// =========================================================

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(nav =>
                        nav.classList.remove(
                            "active"
                        )
                    );


                this.classList.add(
                    "active"
                );

            }
        );

    });


// =========================================================
// ACTION BUTTONS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        if (action === "view") {

            viewTicket(id);

        }


        else if (action === "edit") {

            editTicket(id);

        }


        else if (action === "delete") {

            deleteTicket(id);

        }

    }
);


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeTicketModal();

        }

    }
);


// =========================================================
// INITIAL LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

        loadTickets();

    }
);