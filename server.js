const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "responses.json");

app.use(cors());
app.use(express.json());

// Make sure responses.json exists
function ensureDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify({ responses: [] }, null, 2)
        );
    }
}

ensureDataFile();

// Read saved responses
function getResponses() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        const parsed = JSON.parse(data);

        if (!parsed.responses) {
            parsed.responses = [];
        }

        return parsed.responses;
    } catch (error) {
        console.error("Could not read responses:", error);
        return [];
    }
}

// Save responses
function saveResponses(responses) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({ responses }, null, 2)
    );
}


// ========================================
// SAVE A RESPONSE
// ========================================

app.post("/api/response", (req, res) => {

    const { sessionId, question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({
            success: false,
            message: "Question and answer are required."
        });
    }

    const responses = getResponses();

    const newResponse = {
        id: Date.now().toString(),
        sessionId: sessionId || "unknown",
        question: String(question),
        answer: String(answer),
        timestamp: new Date().toISOString()
    };

    responses.push(newResponse);

    saveResponses(responses);

    console.log(
        `💌 New response: ${newResponse.question} → ${newResponse.answer}`
    );

    res.json({
        success: true,
        response: newResponse
    });
});


// ========================================
// GET ALL RESPONSES
// ========================================

app.get("/api/responses", (req, res) => {

    const responses = getResponses();

    // Newest first
    responses.reverse();

    res.json({
        success: true,
        responses
    });
});


// ========================================
// CLEAR RESPONSES
// ========================================

app.delete("/api/responses", (req, res) => {

    saveResponses([]);

    console.log("🗑️ All responses cleared.");

    res.json({
        success: true,
        message: "All responses cleared."
    });
});


// ========================================
// SERVE WEBSITE FILES
// ========================================

app.use(express.static(__dirname));


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("💗 Flirty Website Backend");
    console.log("=================================");
    console.log(`🌐 Website:   http://localhost:${PORT}`);
    console.log(`📊 API:       http://localhost:${PORT}/api/responses`);
    console.log("=================================");
    console.log("");
});