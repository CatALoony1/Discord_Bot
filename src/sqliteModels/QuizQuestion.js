class QuizQuestion {
    constructor(id, question, right, wrong, started, participants, asked, rightChar, answerA, answerB, answerC, answerD, guildId) {
        if (id && question && right && wrong && guildId) { // Required fields
            // Full constructor
            this._id = id;
            this.question = question;
            this.right = right;
            this.wrong = wrong;
            // Speichere started als ISO 8601 String
            this.started = (started instanceof Date) ? started.toISOString() : started;
            this.participants = participants !== undefined ? participants : [];
            this.asked = asked !== undefined ? asked : 'N';
            this.rightChar = rightChar !== undefined ? rightChar : null;
            this.answerA = answerA !== undefined ? answerA : 0;
            this.answerB = answerB !== undefined ? answerB : 0;
            this.answerC = answerC !== undefined ? answerC : 0;
            this.answerD = answerD !== undefined ? answerD : 0;
            this.guildId = guildId;
        } else if (question && right && wrong && guildId) {
            // Constructor with required fields
            this._id = null;
            this.question = question;
            this.right = right;
            this.wrong = wrong;
            this.started = null;
            this.participants = [];
            this.asked = 'N';
            this.rightChar = null;
            this.answerA = 0;
            this.answerB = 0;
            this.answerC = 0;
            this.answerD = 0;
            this.guildId = guildId;
        } else {
            // Empty constructor
            this._id = null;
            this.question = null;
            this.right = null;
            this.wrong = null;
            this.started = null;
            this.participants = [];
            this.asked = 'N';
            this.rightChar = null;
            this.answerA = 0;
            this.answerB = 0;
            this.answerC = 0;
            this.answerD = 0;
            this.guildId = null;
        }
    }

    // Getter und Setter für _id
    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    // Getter und Setter für question
    getQuestion() {
        return this.question;
    }

    setQuestion(question) {
        this.question = question;
    }

    // Getter und Setter für right
    getRight() {
        return this.right;
    }

    setRight(right) {
        this.right = right;
    }

    // Getter und Setter für wrong
    getWrong() {
        return this.wrong;
    }

    setWrong(wrong) {
        this.wrong = wrong;
    }

    // Getter für started (gibt Date-Objekt zurück)
    getStarted() {
        return this.started ? new Date(this.started) : null;
    }

    // Setter für started (speichert als ISO 8601 String)
    setStarted(started) {
        this.started = (started instanceof Date) ? started.toISOString() : started;
    }

    // Getter und Setter für participants
    getParticipants() {
        return this.participants;
    }

    setParticipants(participants) {
        this.participants = participants;
    }

    // Getter und Setter für asked
    getAsked() {
        return this.asked;
    }

    setAsked(asked) {
        this.asked = asked;
    }

    // Getter und Setter für rightChar
    getRightChar() {
        return this.rightChar;
    }

    setRightChar(rightChar) {
        this.rightChar = rightChar;
    }

    // Getter und Setter für answerA
    getAnswerA() {
        return this.answerA;
    }

    setAnswerA(answerA) {
        this.answerA = answerA;
    }

    // Getter und Setter für answerB
    getAnswerB() {
        return this.answerB;
    }

    setAnswerB(answerB) {
        this.answerB = answerB;
    }

    // Getter und Setter für answerC
    getAnswerC() {
        return this.answerC;
    }

    setAnswerC(answerC) {
        this.answerC = answerC;
    }

    // Getter und Setter für answerD
    getAnswerD() {
        return this.answerD;
    }

    setAnswerD(answerD) {
        this.answerD = answerD;
    }

    // Getter und Setter für guildId
    getGuildId() {
        return this.guildId;
    }

    setGuildId(guildId) {
        this.guildId = guildId;
    }

    toString() {
        return `QuizQuestion{id=${this._id}, question='${this.question}', right='${this.right}', wrong='${this.wrong}', started=${this.started}, participants=[${this.participants.join(', ')}], asked='${this.asked}', rightChar='${this.rightChar}', answerA=${this.answerA}, answerB=${this.answerB}, answerC=${this.answerC}, answerD=${this.answerD}, guildId='${this.guildId}'}`;
    }
}

module.exports = QuizQuestion;