import { useState } from "react";
import ReactMarkdown from "react-markdown";
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

function App() {
  const [showAssistant, setShowAssistant] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const [showPlanner, setShowPlanner] = useState(false);

 const [subject, setSubject] = useState("");
 const [topic, setTopic] = useState("");
 const [studyDate, setStudyDate] = useState("");
 const [studyPlan, setStudyPlan] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assistantError, setAssistantError] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizResult, setQuizResult] = useState("");

const askAssistant = async () => {
  if (!question.trim() || isLoading) return;

  setIsLoading(true);
  setAssistantError(false);
  setAnswer("");

  try {
    const response = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    const data = await response.json();

    setAnswer(data.answer);
  } catch (error) {
    setAssistantError(true);
    setAnswer("I could not connect to the AI Assistant right now. Please try again in a moment.");
  } finally {
    setIsLoading(false);
  }
};

  const checkAnswer = () => {
    if (!selectedAnswer) {
      setQuizResult("Please select an answer first.");
      return;
    }

    if (selectedAnswer === "Stack") {
      setQuizResult("✅ Correct! A stack follows the LIFO principle.");
    } else {
      setQuizResult("❌ Incorrect. The correct answer is Stack.");
    }
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
  };

  setStudyPlan([...studyPlan, newPlan]);

  setSubject("");
  setTopic("");
  setStudyDate("");
};

  // AI Assistant
  if (showAssistant) {
    return (
      <div className="assistant-page">
        <header className="assistant-header">
          <div className="assistant-brand-icon" aria-hidden="true">🤖</div>
          <div>
            <p className="assistant-eyebrow">AI-powered learning</p>
            <h1>AI Study Assistant</h1>
            <p>Your personal academic learning companion</p>
          </div>
        </header>
        <h1>🤖 AI Study Assistant</h1>

        <p>Ask a question and get a simple explanation.</p>

        <div className="assistant-input-card">
          <label htmlFor="assistant-question">What would you like to learn today?</label>
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
        </div>

        <br />
        <br />

        <button className="ask-assistant-button" onClick={askAssistant} disabled={isLoading}>
          <span aria-hidden="true">{isLoading ? "◌" : "✨"}</span>
          <span>{isLoading ? "Thinking..." : "Ask Assistant"}</span>
          Ask Assistant
        </button>

        <br />
        <br />

        {!answer && !isLoading && (
          <div className="assistant-empty-state">
            <span aria-hidden="true">💡</span>
            <p>Ask me a question and I'll help you understand it.</p>
          </div>
        )}

        {answer && (
          <div className={`assistant-response ${assistantError ? "assistant-response-error" : ""}`}>
            <div className="assistant-response-heading">
              <span aria-hidden="true">🤖</span>
              <h2>{assistantError ? "Unable to get an answer" : "Explanation"}</h2>
            </div>
            <h2>📖 Explanation</h2>
            <div className="assistant-answer">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}

        <br />

        <button className="assistant-back-button" onClick={() => setShowAssistant(false)}>
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
        <div>
          <h1>{selectedMaterial}</h1>
          <p>{material.intro}</p>

          {material.sections.map(([heading, definition, points, code]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p><strong>Definition:</strong> {definition}</p>
              <h3>Important points</h3>
              <ul>
                {points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              {code && <pre><code>{code}</code></pre>}
            </section>
          ))}

          <button onClick={() => setSelectedMaterial("")}>
            ← Back to Study Materials
          </button>
        </div>
      );
    }

    return (
      <div>
        <h1>📚 Study Materials</h1>

        <p>Choose a subject to start learning.</p>

        <div>
          <h2>💻 Data Structures</h2>
          <p>Arrays, Linked Lists, Stacks, Queues and Trees</p>
          <button onClick={() => setSelectedMaterial("Data Structures")}>Open Material</button>
        </div>

        <div>
          <h2>🌐 Computer Networks</h2>
          <p>Networking basics, protocols and network models</p>
          <button onClick={() => setSelectedMaterial("Computer Networks")}>Open Material</button>
        </div>

        <div>
          <h2>🗄️ Database Management</h2>
          <p>SQL, databases, normalization and transactions</p>
          <button onClick={() => setSelectedMaterial("Database Management")}>Open Material</button>
        </div>

        <div>
          <h2>⚙️ Operating Systems</h2>
          <p>Processes, memory management, scheduling and files</p>
          <button onClick={() => setSelectedMaterial("Operating Systems")}>Open Material</button>
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
    <div>
      <h1>📅 Study Planner</h1>

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

      <br />
      <br />

      <button onClick={addStudyPlan}>
        Add to Study Plan
      </button>

      <h2>📋 My Study Plan</h2>

      {studyPlan.length === 0 ? (
        <p>No study tasks added yet.</p>
      ) : (
        studyPlan.map((plan, index) => (
          <div key={index}>
            <h3>{plan.subject}</h3>
            <p>Topic: {plan.topic}</p>
            <p>Date: {plan.studyDate}</p>
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
    return (
      <div>
        <h1>📝 Practice Questions</h1>

        <h2>Question 1</h2>

        <p>
          Which data structure follows the LIFO principle?
        </p>

        <label>
          <input
            type="radio"
            name="answer"
            value="Queue"
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          Queue
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="answer"
            value="Stack"
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          Stack
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="answer"
            value="Array"
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          Array
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="answer"
            value="Tree"
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          Tree
        </label>

        <br />
        <br />

        <button onClick={checkAnswer}>
          Submit Answer
        </button>

        {quizResult && (
          <h3>{quizResult}</h3>
        )}

        <br />
        <br />

        <button onClick={() => setShowQuiz(false)}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-welcome">
          <p className="dashboard-eyebrow">AI-Based Personalized Student Study Assistant</p>
          <h1>Good to see you <span aria-hidden="true">👋</span></h1>
          <p>Your personalized study space</p>
        </div>
        <h1>🤖 AI Study Assistant</h1>
        <p>Your personalized learning companion</p>
      </header>

      <main className="dashboard-main">
        <h2>Welcome, Student 👋</h2>

        <p>What would you like to do today?</p>

        <div className="dashboard-features">
          <button className="feature-card feature-assistant" aria-label="Open AI Assistant" onClick={() => setShowAssistant(true)}>
            <span className="feature-icon" aria-hidden="true">🤖</span>
            <span className="feature-copy"><strong>AI Assistant</strong><small>Get personalized explanations and study help.</small></span>
            🤖 Ask AI Assistant
          </button>

          <button className="feature-card feature-materials" aria-label="Open Study Materials" onClick={() => setShowMaterials(true)}>
            <span className="feature-icon" aria-hidden="true">📚</span>
            <span className="feature-copy"><strong>Study Materials</strong><small>Explore organized material for your subjects.</small></span>
            📚 Study Materials
          </button>

          <button className="feature-card feature-quiz" aria-label="Open Practice Questions" onClick={() => setShowQuiz(true)}>
            <span className="feature-icon" aria-hidden="true">✓</span>
            <span className="feature-copy"><strong>Practice Questions</strong><small>Test your knowledge and improve your understanding.</small></span>
            📝 Practice Questions
          </button>

          <button className="feature-card feature-planner" aria-label="Open Study Planner" onClick={() => setShowPlanner(true)}>
            <span className="feature-icon" aria-hidden="true">🗓</span>
            <span className="feature-copy"><strong>Study Planner</strong><small>Plan your topics and stay on track.</small></span>
          📅 Study Planner
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
            <p className="progress-note">These visual progress indicators are placeholders until progress tracking is enabled.</p>

            <div className="progress-grid">
              <div className="progress-card">
                <div><span>Study Progress</span><strong>Demo · 35%</strong></div>
                <div className="progress-track"><span className="progress-fill study-fill" /></div>
              </div>
              <div className="progress-card">
                <div><span>Practice Questions</span><strong>Demo · 20%</strong></div>
                <div className="progress-track"><span className="progress-fill quiz-fill" /></div>
              </div>
              <div className="progress-card">
                <div><span>Study Planning</span><strong>Demo · 45%</strong></div>
                <div className="progress-track"><span className="progress-fill planner-fill" /></div>
              </div>
            </div>

            <div className="quick-stats">
              <div><span>Subjects</span><strong>{Object.keys(studyMaterials).length}</strong><small>Available materials</small></div>
              <div><span>Study Tasks</span><strong>{studyPlan.length}</strong><small>From your planner</small></div>
              <div><span>Questions Practiced</span><strong>—</strong><small>Not tracked yet</small></div>
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
