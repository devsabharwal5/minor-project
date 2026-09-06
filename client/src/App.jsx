import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const studyMaterials = {
  "Data Structures": {
    intro: "Data structures organize data so it can be stored and used efficiently.",
    sections: [
      ["Arrays", "An array stores items in ordered positions, accessed using indexes.", ["Indexes usually start at 0.", "Reading an item by index is fast.", "Example: marks = [82, 91, 76]; marks[1] is 91."]],
      ["Linked Lists", "A linked list stores data in nodes; each node links to the next node.", ["Nodes do not need adjacent memory locations.", "Insertion and deletion are convenient when the node is known.", "Example: 10 → 20 → 30 → null."]],
      ["Stacks", "A stack follows LIFO: Last In, First Out.", ["push adds an item to the top.", "pop removes the top item.", "Used for undo actions and browser history."], "stack.push('A');\nstack.push('B');\nstack.pop(); // removes B"],
      ["Queues", "A queue follows FIFO: First In, First Out.", ["enqueue adds at the rear.", "dequeue removes from the front.", "Used in printer queues and task scheduling."]],
      ["Trees", "A tree organizes data as parent and child nodes, beginning with a root.", ["A binary tree gives each node at most two children.", "In a binary search tree, smaller values go left.", "Used for folders, menus, and searching."]],
    ],
  },
  "Computer Networks": {
    intro: "A computer network connects devices so they can exchange data and share resources.",
    sections: [
      ["What is a Computer Network?", "It is a group of connected devices that communicate using agreed rules called protocols.", ["Networks can share files, printers, and internet access.", "A college Wi-Fi network is a common example."]],
      ["LAN, MAN, and WAN", "Networks are classified by the area they cover.", ["LAN covers a home, lab, or building.", "MAN connects locations across a city.", "WAN connects distant locations; the internet is the largest example."]],
      ["OSI Model", "The OSI model explains networking in seven layers.", ["Physical, Data Link, Network, Transport, Session, Presentation, Application.", "The Network layer handles routing.", "The Transport layer handles delivery between applications."]],
      ["TCP/IP Model", "TCP/IP is the practical internet model with Application, Transport, Internet, and Network Access layers.", ["HTTP belongs at the Application layer.", "IP provides addressing and routing.", "Wi-Fi and Ethernet operate at Network Access."]],
      ["IP Address and TCP vs UDP", "An IP address identifies a device, while TCP and UDP are delivery protocols.", ["IPv4 example: 192.168.1.10.", "TCP is reliable and ordered, useful for web pages and downloads.", "UDP is lightweight and fast, useful for live games and calls."], "TCP: reliable file download\nUDP: fast live video update"],
    ],
  },
  "Database Management": {
    intro: "Database management organizes, retrieves, and protects data using a DBMS.",
    sections: [
      ["What is DBMS?", "A Database Management System is software for creating and managing databases.", ["It organizes data for applications and users.", "It supports permissions, backups, and concurrent access.", "Examples include MySQL, PostgreSQL, and SQLite."]],
      ["Database Basics and Tables", "Relational databases store data in tables made of rows and columns.", ["A row is one record; a column is one property.", "Example: a Students table can have student_id and name."]],
      ["Primary Key and Foreign Key", "A primary key uniquely identifies a row; a foreign key connects related tables.", ["student_id can be the primary key in Students.", "An Enrollments table can use student_id as a foreign key."]],
      ["SQL Basics", "SQL is used to read and change relational data.", ["SELECT reads data; INSERT adds it.", "UPDATE changes data; DELETE removes it.", "WHERE filters records."], "SELECT name, course\nFROM students\nWHERE course = 'DBMS';"],
      ["Normalization and Transactions", "Normalization reduces duplicate data; a transaction treats related actions as one unit.", ["Normal forms help place each fact in the right table.", "Transactions follow ACID: Atomicity, Consistency, Isolation, Durability.", "A money transfer should debit and credit together, or roll back."]],
    ],
  },
  "Operating Systems": {
    intro: "An operating system manages hardware and provides services to applications and users.",
    sections: [
      ["What is an Operating System?", "An OS is core software that manages a computer's resources.", ["It manages the CPU, memory, files, and devices.", "Examples include Windows, Linux, and Android."]],
      ["Processes and Threads", "A process is a running program; a thread is a path of execution inside a process.", ["Processes have separate memory spaces.", "Threads in one process share resources.", "A music player can use separate threads for playback and the interface."]],
      ["CPU Scheduling", "CPU scheduling decides which ready process gets CPU time next.", ["FCFS runs jobs in arrival order.", "Shortest Job First favors shorter work.", "Round Robin gives each task a small time slice."]],
      ["Memory Management", "Memory management allocates RAM and prevents programs from interfering with each other.", ["Virtual memory uses disk as an extension of RAM.", "Paging divides memory into fixed-size blocks.", "The OS reclaims memory when a process finishes."]],
      ["File Management and Deadlocks", "File systems organize files and directories; deadlocks are permanent waits for resources.", ["Files have names, locations, and permissions.", "A deadlock can occur when two processes each wait for a resource held by the other.", "OSs can prevent, avoid, detect, or recover from deadlocks."]],
    ],
  },
};

const quizQuestions = [
  { subject: "Data Structures", question: "Which data structure follows LIFO?", options: ["Queue", "Stack", "Array", "Tree"], answer: "Stack", explanation: "A stack removes the most recently added item first." },
  { subject: "Computer Networks", question: "Which OSI layer handles routing?", options: ["Physical", "Transport", "Network", "Session"], answer: "Network", explanation: "The Network layer handles logical addressing and routing." },
  { subject: "Database Management", question: "Which key uniquely identifies a table row?", options: ["Foreign key", "Primary key", "Candidate value", "Index page"], answer: "Primary key", explanation: "A primary key uniquely identifies each record in a relation." },
  { subject: "Operating Systems", question: "What does Round Robin scheduling use?", options: ["Priority only", "A time quantum", "A stack", "Disk sectors"], answer: "A time quantum", explanation: "Round Robin gives each ready process a fixed time slice." },
];

const readStoredPreferences = () => {
  try {
    return JSON.parse(localStorage.getItem("studentPreferences") || "{}");
  } catch {
    return {};
  }
};

function App() {
  const [showAssistant, setShowAssistant] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const [showPlanner, setShowPlanner] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => localStorage.getItem("theme") === "dark");
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("authToken") ? localStorage.getItem("studyUser") || "" : "");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

 const [subject, setSubject] = useState("");
 const [topic, setTopic] = useState("");
 const [studyDate, setStudyDate] = useState("");
 const [priority, setPriority] = useState("Medium");
 const [studyPlan, setStudyPlan] = useState(() => {
   const savedStudyPlan = localStorage.getItem("studyPlan");
   return savedStudyPlan ? JSON.parse(savedStudyPlan) : [];
 });
 const [completedTopics, setCompletedTopics] = useState(() => JSON.parse(localStorage.getItem("completedTopics") || "[]"));
 const [materialSearch, setMaterialSearch] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assistantError, setAssistantError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [assistantSubject, setAssistantSubject] = useState(() => readStoredPreferences().preferredSubjects?.[0] || "General");
  const [assistantLevel, setAssistantLevel] = useState(() => readStoredPreferences().preferredDifficulty || "Intermediate");
  const [answerType, setAnswerType] = useState(() => readStoredPreferences().preferredAnswerStyle || "Detailed Explanation");
  const [examMarks, setExamMarks] = useState("Not specified");
  const [assistantTopic, setAssistantTopic] = useState("");
  const [conversation, setConversation] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentQuestions") || "[]");
    } catch {
      return [];
    }
  });
  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentPreferences") || "{}")
    } catch {
      return {};
    }
  });

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizResult, setQuizResult] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(() => Number(localStorage.getItem("quizScore") || 0));
  const [quizAttempted, setQuizAttempted] = useState(() => Number(localStorage.getItem("quizAttempted") || 0));
  const [answeredQuizIndexes, setAnsweredQuizIndexes] = useState(() => JSON.parse(localStorage.getItem("answeredQuizIndexes") || "[]"));

  useEffect(() => {
    localStorage.setItem("studyPlan", JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem("completedTopics", JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem("quizScore", String(quizScore));
    localStorage.setItem("quizAttempted", String(quizAttempted));
  }, [quizScore, quizAttempted]);

  useEffect(() => {
    localStorage.setItem("answeredQuizIndexes", JSON.stringify(answeredQuizIndexes));
  }, [answeredQuizIndexes]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  useEffect(() => {
    localStorage.setItem("recentQuestions", JSON.stringify(recentQuestions.slice(0, 10)));
  }, [recentQuestions]);

  useEffect(() => {
    if (!showAssistant) {
      window.speechSynthesis?.cancel();
    }

    return () => window.speechSynthesis?.cancel();
  }, [showAssistant]);

const askAssistant = async (questionOverride = question) => {
  if (isLoading) return;

  if (!questionOverride.trim()) {
    setAssistantError(true);
    setAnswer("Please enter a question before asking the assistant.");
    return;
  }

  window.speechSynthesis?.cancel();
  setIsSpeaking(false);
  setIsLoading(true);
  setAssistantError(false);
  setAnswer("");

  try {
    const response = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        question: questionOverride,
        subject: assistantSubject,
        topic: assistantTopic,
        level: assistantLevel,
        answerType,
        marks: examMarks,
        history: conversation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) handleLogout();
      throw new Error(data.error || "Unable to get an answer.");
    }

    setAnswer(data.answer);
    setConversation((current) => [
      ...current,
      { role: "student", content: questionOverride },
      { role: "assistant", content: data.answer },
    ].slice(-8));
    setRecentQuestions((current) => [questionOverride, ...current.filter((item) => item !== questionOverride)].slice(0, 10));
  } catch {
    setAssistantError(true);
    setAnswer("I could not get a response from the AI Assistant. Check that the server is running and that you are signed in, then try again.");
  } finally {
    setIsLoading(false);
  }
};

  const clearConversation = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setQuestion("");
    setAnswer("");
    setConversation([]);
    setAssistantError(false);
  };

  const copyAnswer = async () => {
    if (!answer) return;
    await navigator.clipboard?.writeText(answer);
  };

  const updatePreferences = (field, value) => {
    setPreferences((current) => {
      const nextPreferences = { ...current, [field]: value };
      localStorage.setItem("studentPreferences", JSON.stringify(nextPreferences));
      return nextPreferences;
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${isRegistering ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Unable to authenticate.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("studyUser", data.user.email);
      setAuthToken(data.token);
      setUserEmail(data.user.email);
      setLoginEmail("");
      setLoginPassword("");
    } catch {
      setLoginError("The server is unavailable. Please try again shortly.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studyUser");
    localStorage.removeItem("authToken");
    setAuthToken("");
    setUserEmail("");
    setShowAssistant(false);
    setShowMaterials(false);
    setShowPlanner(false);
    setShowQuiz(false);
  };

  const speakAnswer = () => {
    if (!answer || !window.speechSynthesis) return;

    const readableAnswer = answer
      .replace(/```[^\n]*\n?/g, "")
      .replace(/\|/g, ", ")
      .replace(/[#*_>`~-]/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    const utterance = new SpeechSynthesisUtterance(readableAnswer);

    window.speechSynthesis.cancel();
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      setQuizResult("Please select an answer first.");
      return;
    }

    const currentQuestion = quizQuestions[quizIndex];
    if (answeredQuizIndexes.includes(quizIndex)) {
      setQuizResult("This question has already been scored. Use Next or Restart to continue.");
      return;
    }
    setAnsweredQuizIndexes((current) => [...current, quizIndex]);
    setQuizAttempted((current) => current + 1);
    if (selectedAnswer === currentQuestion.answer) {
      setQuizScore((current) => current + 1);
      setQuizResult(`Correct. ${currentQuestion.explanation}`);
    } else {
      setQuizResult(`Incorrect. The correct answer is ${currentQuestion.answer}. ${currentQuestion.explanation}`);
    }
  };

  const toggleTopicComplete = (topicName) => {
    setCompletedTopics((current) => current.includes(topicName) ? current.filter((topicItem) => topicItem !== topicName) : [...current, topicName]);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer("");
    setQuizResult("");
    setQuizScore(0);
    setQuizAttempted(0);
    setAnsweredQuizIndexes([]);
  };

  const addStudyPlan = () => {
  if (!subject || !topic || !studyDate) {
    alert("Please fill all the fields.");
    return;
  }

  const newPlan = {
    subject,
    topic,
    studyDate,
    priority,
    completed: false,
  };

  setStudyPlan([...studyPlan, newPlan]);

  setSubject("");
  setTopic("");
  setStudyDate("");
  setPriority("Medium");
};

  const togglePlanComplete = (index) => {
    setStudyPlan((current) => current.map((plan, planIndex) => planIndex === index ? { ...plan, completed: !plan.completed } : plan));
  };

  const deletePlan = (index) => {
    setStudyPlan((current) => current.filter((_, planIndex) => planIndex !== index));
  };

  const themeToggle = (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setIsDarkTheme((currentTheme) => !currentTheme)}
      aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
      title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span aria-hidden="true">{isDarkTheme ? "○" : "◐"}</span>
      <span>{isDarkTheme ? "Light theme" : "Dark theme"}</span>
    </button>
  );

  if (!userEmail) {
    return (
      <div className={`login-page ${isDarkTheme ? "theme-dark" : ""}`}>
        {themeToggle}
        <main className="login-shell">
          <section className="login-card">
            <div className="login-mark" aria-hidden="true">✦</div>
            <p className="login-eyebrow">Personal learning workspace</p>
            <h1>{isRegistering ? "Create your account" : "Welcome back"}</h1>
            <p className="login-subtitle">{isRegistering ? "Create an account to save your personalized study space." : "Sign in to continue your focused study session."}</p>

            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="At least 6 characters"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
              />

              {loginError && <p className="login-error" role="alert">{loginError}</p>}
              <button className="login-submit" type="submit">{isRegistering ? "Create account" : "Enter workspace"} <span aria-hidden="true">→</span></button>
            </form>
            <button
              className="auth-mode-toggle"
              type="button"
              onClick={() => { setIsRegistering((currentMode) => !currentMode); setLoginError(""); }}
            >
              {isRegistering ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </section>
        </main>
      </div>
    );
  }

  // AI Assistant
  if (showAssistant) {
    return (
      <div className={`assistant-page ${isDarkTheme ? "theme-dark" : ""}`}>
        {themeToggle}
        <header className="assistant-header">
          <div className="assistant-avatar" aria-hidden="true">
            <span>AI</span>
          </div>
          <div>
            <p className="assistant-eyebrow">AI-powered learning</p>
            <h1>AI Study Assistant</h1>
            <p>Your personal academic learning companion</p>
          </div>
        </header>
        <h1>AI Study Assistant</h1>

        <p>Ask a question and get a simple explanation.</p>

        <div className="assistant-input-card">
          <label htmlFor="assistant-question">What would you like to learn today?</label>
          <div className="assistant-context-grid">
            <label>Subject
              <select value={assistantSubject} onChange={(event) => setAssistantSubject(event.target.value)}>
                {['General', 'Data Structures', 'Computer Networks', 'Database Management', 'Operating Systems'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>Level
              <select value={assistantLevel} onChange={(event) => setAssistantLevel(event.target.value)}>
                {['Beginner', 'Intermediate', 'Advanced'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>Answer type
              <select value={answerType} onChange={(event) => setAnswerType(event.target.value)}>
                {['Detailed Explanation', 'Exam Answer', 'Simple Explanation', 'Step-by-Step', 'Summary', 'Example', 'Practice Questions', 'Revision Notes'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>Marks
              <select value={examMarks} onChange={(event) => setExamMarks(event.target.value)}>
                {['Not specified', '2 marks', '5 marks', '10 marks'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <label htmlFor="assistant-topic">Topic</label>
          <input
            id="assistant-topic"
            className="assistant-topic-input"
            value={assistantTopic}
            onChange={(event) => setAssistantTopic(event.target.value)}
            placeholder="Optional topic, such as deadlocks or OSI model"
          />
        <textarea
          id="assistant-question"
          className="assistant-textarea"
          rows="5"
          placeholder="Ask me anything about your studies..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
          <div className="quick-prompts">
            <span>Quick prompts</span>
            <div>
              <button type="button" onClick={() => setQuestion("Explain binary search in simple terms.")}>Explain a topic</button>
              <button type="button" onClick={() => setQuestion("Give me a simple example of a stack data structure.")}>Give me an example</button>
              <button type="button" onClick={() => setQuestion("Summarize the OSI model in simple points.")}>Summarize a concept</button>
              <button type="button" onClick={() => setQuestion("Create five beginner practice questions about DBMS.")}>Create practice questions</button>
            </div>
          </div>
          {recentQuestions.length > 0 && (
            <div className="recent-questions">
              <span>Recent questions</span>
              <div>{recentQuestions.slice(0, 5).map((recentQuestion) => <button type="button" key={recentQuestion} onClick={() => setQuestion(recentQuestion)}>{recentQuestion}</button>)}</div>
            </div>
          )}
        </div>

        <br />
        <br />

        <button className="ask-assistant-button" onClick={() => askAssistant()} disabled={isLoading}>
          <span aria-hidden="true">{isLoading ? "◌" : "→"}</span>
          <span>{isLoading ? "Thinking..." : "Ask Assistant"}</span>
          Ask Assistant
        </button>

        <br />
        <br />

        {!answer && !isLoading && (
          <div className="assistant-empty-state">
            <span aria-hidden="true">i</span>
            <p>Ask me a question and I'll help you understand it.</p>
          </div>
        )}

        {answer && (
          <div className={`assistant-response ${assistantError ? "assistant-response-error" : ""}`}>
            <div className="assistant-response-heading">
              <span aria-hidden="true">✦</span>
              <h2>{assistantError ? "Unable to get an answer" : "Explanation"}</h2>
            </div>
            {!assistantError && (
              <div className="voice-controls" aria-label="Voice controls">
                <button
                  className="voice-button"
                  type="button"
                  onClick={isSpeaking ? stopSpeaking : speakAnswer}
                  disabled={!window.speechSynthesis}
                  aria-label={isSpeaking ? "Stop reading response" : "Read response aloud"}
                  title={!window.speechSynthesis ? "Text-to-speech is not supported in this browser" : undefined}
                >
                  <span aria-hidden="true">{isSpeaking ? "■" : "◉"}</span>
                  {isSpeaking ? "Stop reading" : "Read aloud"}
                </button>
                <button className="voice-button" type="button" onClick={copyAnswer}>Copy</button>
                <button className="voice-button" type="button" onClick={() => askAssistant()}>Regenerate</button>
                <button className="voice-button" type="button" onClick={clearConversation}>Clear</button>
              </div>
            )}
            <div className="assistant-answer">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="assistant-markdown-table">
                      <table>{children}</table>
                    </div>
                  ),
                }}
              >
                {answer}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <br />

        <button className="assistant-back-button" onClick={() => { stopSpeaking(); setShowAssistant(false); }}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // Study Materials
  if (showMaterials) {
    const material = selectedMaterial ? studyMaterials[selectedMaterial] : null;

    if (material) {
      return (
        <div className={isDarkTheme ? "theme-dark" : ""}>
          {themeToggle}
          <h1>{selectedMaterial}</h1>
          <p>{material.intro}</p>

          {material.sections.map(([heading, definition, points, code]) => (
            <section key={heading}>
              <div className="topic-heading">
                <h2>{heading}</h2>
                <label className="completion-toggle">
                  <input type="checkbox" checked={completedTopics.includes(`${selectedMaterial}:${heading}`)} onChange={() => toggleTopicComplete(`${selectedMaterial}:${heading}`)} />
                  Completed
                </label>
              </div>
              <p><strong>Definition:</strong> {definition}</p>
              <h3>Important points</h3>
              <ul>
                {points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              {code && <pre><code>{code}</code></pre>}
              <p className="exam-tip"><strong>Exam tip:</strong> Define the concept, explain its key property, and include a short example.</p>
            </section>
          ))}

          <button onClick={() => setSelectedMaterial("")}>
            ← Back to Study Materials
          </button>
        </div>
      );
    }

    return (
      <div className={isDarkTheme ? "theme-dark" : ""}>
        {themeToggle}
        <h1>Study Materials</h1>

        <p>Choose a subject to start learning.</p>

        <input className="material-search" type="search" placeholder="Search subjects and topics" value={materialSearch} onChange={(event) => setMaterialSearch(event.target.value)} />

        <div className="materials-grid">
          {Object.entries(studyMaterials).filter(([name, material]) => {
            const searchTerm = materialSearch.toLowerCase();
            return !searchTerm || name.toLowerCase().includes(searchTerm) || material.sections.some(([heading, definition]) => `${heading} ${definition}`.toLowerCase().includes(searchTerm));
          }).map(([name, material]) => (
          <div className="material-card" key={name}>
          <h2>{name}</h2>
          <p>{material.intro}</p>
          <p className="material-progress">{material.sections.filter(([heading]) => completedTopics.includes(`${name}:${heading}`)).length}/{material.sections.length} topics completed</p>
          <button onClick={() => setSelectedMaterial(name)}>Open Material</button>
          </div>
          ))}
          {Object.entries(studyMaterials).filter(([name, material]) => {
            const searchTerm = materialSearch.toLowerCase();
            return !searchTerm || name.toLowerCase().includes(searchTerm) || material.sections.some(([heading, definition]) => `${heading} ${definition}`.toLowerCase().includes(searchTerm));
          }).length === 0 && <p className="empty-state">No matching study topics found.</p>}
        </div>

        <br />

        <button onClick={() => { setSelectedMaterial(""); setShowMaterials(false); }}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // Study Planner
if (showPlanner) {
  return (
    <div className={isDarkTheme ? "theme-dark" : ""}>
      {themeToggle}
      <h1>Study Planner</h1>

      <p>Create your personalized study plan.</p>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <br />
      <br />

      <input
        type="date"
        value={studyDate}
        onChange={(e) => setStudyDate(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Task priority">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <br />
      <br />

      <button onClick={addStudyPlan}>
        Add to Study Plan
      </button>

      <h2>My Study Plan</h2>

      {studyPlan.length === 0 ? (
        <p>No study tasks added yet.</p>
      ) : (
        studyPlan.map((plan, index) => (
          <div className={`planner-task ${plan.completed ? "planner-task-complete" : ""}`} key={`${plan.subject}-${plan.topic}-${index}`}>
            <label><input type="checkbox" checked={Boolean(plan.completed)} onChange={() => togglePlanComplete(index)} /> Completed</label>
            <h3>{plan.subject}</h3>
            <p>Topic: {plan.topic}</p>
            <p>Date: {plan.studyDate}</p>
            <p>Priority: {plan.priority || "Medium"}</p>
            <button type="button" onClick={() => deletePlan(index)}>Delete</button>
            <hr />
          </div>
        ))
      )}

      <button onClick={() => setShowPlanner(false)}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
 // Practice Questions
 if (showQuiz) {
    const currentQuestion = quizQuestions[quizIndex];
    return (
      <div className={isDarkTheme ? "theme-dark" : ""}>
        {themeToggle}
        <h1>Practice Questions</h1>
        <p>Question {quizIndex + 1} of {quizQuestions.length} · Score {quizScore}/{quizAttempted}</p>
        <p className="quiz-progress"><span style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} /></p>
        <p className="quiz-subject">{currentQuestion.subject}</p>
        <h2>{currentQuestion.question}</h2>
        <div className="quiz-options">
          {currentQuestion.options.map((option) => (
            <label key={option}>
              <input type="radio" name="answer" value={option} checked={selectedAnswer === option} onChange={(e) => setSelectedAnswer(e.target.value)} />
              {option}
            </label>
          ))}
        </div>
        <button onClick={checkAnswer}>Submit Answer</button>
        {quizResult && <p className="quiz-result">{quizResult}</p>}
        <div className="quiz-navigation">
          <button type="button" onClick={() => { setQuizIndex((current) => Math.max(0, current - 1)); setSelectedAnswer(""); setQuizResult(""); }} disabled={quizIndex === 0}>Previous</button>
          <button type="button" onClick={() => { setQuizIndex((current) => Math.min(quizQuestions.length - 1, current + 1)); setSelectedAnswer(""); setQuizResult(""); }} disabled={quizIndex === quizQuestions.length - 1}>Next</button>
          <button type="button" onClick={resetQuiz}>Restart</button>
        </div>

        <button onClick={() => setShowQuiz(false)}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const totalTopics = Object.values(studyMaterials).reduce((total, material) => total + material.sections.length, 0);
  const completedMaterialCount = completedTopics.length;
  const materialProgress = totalTopics ? Math.round((completedMaterialCount / totalTopics) * 100) : 0;
  const plannerProgress = studyPlan.length ? Math.round((studyPlan.filter((plan) => plan.completed).length / studyPlan.length) * 100) : 0;
  const quizProgress = quizAttempted ? Math.round((quizScore / quizAttempted) * 100) : 0;
  const overallProgress = Math.round((materialProgress + plannerProgress + quizProgress) / 3);
  const nextPlan = studyPlan.find((plan) => !plan.completed);
  const recommendation = nextPlan ? `Continue ${nextPlan.subject}: ${nextPlan.topic}` : quizProgress < 60 && quizAttempted ? "Practice more questions to strengthen your score" : "Start with a study material topic and mark it complete when finished";

  // Dashboard
  return (
    <div className={`dashboard-page ${isDarkTheme ? "theme-dark" : ""}`}>
      <header className="dashboard-header">
        {themeToggle}
        <div className="dashboard-welcome">
          <div className="user-avatar" aria-hidden="true">ST</div>
          <div className="avatar-constellation" aria-hidden="true">
            <span className="mini-avatar mini-avatar-teal">A</span>
            <span className="mini-avatar mini-avatar-coral">K</span>
            <span className="mini-avatar mini-avatar-blue">R</span>
            <span className="mini-avatar mini-avatar-gold">M</span>
            <span className="avatar-count">+12</span>
          </div>
          <p className="dashboard-eyebrow">AI-Based Personalized Student Study Assistant</p>
          <h1>Good to see you, {preferences.studentName || "Student"}</h1>
          <p>Your personalized study space · {userEmail}</p>
        </div>
        <button className="logout-button" type="button" onClick={handleLogout}>Sign out</button>
        <h1>AI Study Assistant</h1>
        <p>Your personalized learning companion</p>
      </header>

      <main className="dashboard-main">
        <h2>Welcome, Student</h2>

        <p>What would you like to do today?</p>

        <div className="dashboard-features">
          <button className="feature-card feature-assistant" aria-label="Open AI Assistant" onClick={() => setShowAssistant(true)}>
            <span className="feature-icon" aria-hidden="true">✦</span>
            <span className="feature-copy"><strong>AI Assistant</strong><small>Get personalized explanations and study help.</small></span>
            Ask AI Assistant
          </button>

          <button className="feature-card feature-materials" aria-label="Open Study Materials" onClick={() => setShowMaterials(true)}>
            <span className="feature-icon" aria-hidden="true">▤</span>
            <span className="feature-copy"><strong>Study Materials</strong><small>Explore organized material for your subjects.</small></span>
            Study Materials
          </button>

          <button className="feature-card feature-quiz" aria-label="Open Practice Questions" onClick={() => setShowQuiz(true)}>
            <span className="feature-icon" aria-hidden="true">✓</span>
            <span className="feature-copy"><strong>Practice Questions</strong><small>Test your knowledge and improve your understanding.</small></span>
            Practice Questions
          </button>

          <button className="feature-card feature-planner" aria-label="Open Study Planner" onClick={() => setShowPlanner(true)}>
            <span className="feature-icon" aria-hidden="true">◷</span>
            <span className="feature-copy"><strong>Study Planner</strong><small>Plan your topics and stay on track.</small></span>
          Study Planner
         </button>
        </div>

        <section className="progress-section">
          <div className="progress-dashboard-content">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Learning overview</p>
                <h2>Your Progress</h2>
              </div>
              <span className="demo-badge">Demo display</span>
            </div>
            <p className="progress-note">Calculated from completed topics, quiz attempts, and completed planner tasks.</p>

            <div className="progress-grid">
              <div className="progress-card">
                <div><span>Study Materials</span><strong>{materialProgress}%</strong></div>
                <div className="progress-track"><span className="progress-fill study-fill" style={{ width: `${materialProgress}%` }} /></div>
              </div>
              <div className="progress-card">
                <div><span>Practice Questions</span><strong>{quizProgress}%</strong></div>
                <div className="progress-track"><span className="progress-fill quiz-fill" style={{ width: `${quizProgress}%` }} /></div>
              </div>
              <div className="progress-card">
                <div><span>Study Planning</span><strong>{plannerProgress}%</strong></div>
                <div className="progress-track"><span className="progress-fill planner-fill" style={{ width: `${plannerProgress}%` }} /></div>
              </div>
            </div>

            <div className="quick-stats">
              <div><span>Subjects</span><strong>{Object.keys(studyMaterials).length}</strong><small>Available materials</small></div>
              <div><span>Study Tasks</span><strong>{studyPlan.length}</strong><small>From your planner</small></div>
              <div><span>Questions Practiced</span><strong>{quizAttempted}</strong><small>{quizAttempted ? `${quizScore} correct` : "Not started"}</small></div>
            </div>
            <div className="dashboard-insights">
              <div><span>Overall learning progress</span><strong>{overallProgress}%</strong></div>
              <div><span>Recommended for you</span><strong>{recommendation}</strong></div>
              <div><span>Upcoming task</span><strong>{nextPlan ? `${nextPlan.topic} · ${nextPlan.studyDate}` : "No upcoming tasks yet"}</strong></div>
            </div>
            <div className="preferences-panel">
              <div>
                <p className="section-eyebrow">Student preferences</p>
                <h3>Personalize your study experience</h3>
              </div>
              <div className="preferences-grid">
                <input aria-label="Student name" placeholder="Your name" value={preferences.studentName || ""} onChange={(event) => updatePreferences("studentName", event.target.value)} />
                <select aria-label="Preferred difficulty" value={preferences.preferredDifficulty || "Intermediate"} onChange={(event) => updatePreferences("preferredDifficulty", event.target.value)}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <select aria-label="Preferred answer style" value={preferences.preferredAnswerStyle || "Detailed Explanation"} onChange={(event) => updatePreferences("preferredAnswerStyle", event.target.value)}>
                  <option>Detailed Explanation</option><option>Simple Explanation</option><option>Exam Answer</option><option>Revision Notes</option>
                </select>
                <select aria-label="Preferred subject" value={preferences.preferredSubjects?.[0] || "General"} onChange={(event) => updatePreferences("preferredSubjects", [event.target.value])}>
                  <option>General</option><option>Data Structures</option><option>Computer Networks</option><option>Database Management</option><option>Operating Systems</option>
                </select>
              </div>
            </div>
          </div>
          <h2>Today's Study Progress</h2>

          <p>Study sessions completed: 0</p>

          <p>Practice questions completed: 0</p>
        </section>
      </main>
    </div>
  );
}

export default App;
