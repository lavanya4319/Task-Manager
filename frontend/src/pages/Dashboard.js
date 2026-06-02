import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: token,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err?.response?.data || err.message || err);
        setError(err?.response?.data?.msg || "Unable to load tasks.");
      }
    };

    fetchTasks();
  }, [token, navigate]);

  const addTask = async () => {
    if (!token) {
      alert("Login required to add tasks.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTitle("");
      setError("");

      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: token,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err?.response?.data || err.message || err);
      alert(err?.response?.data?.msg || "Unable to add task.");
    }
  };

  return (
    <div className="page-container dashboard-page">
      <div className="card dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="subtitle">Add a task and keep your day organized.</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="task-input-row">
          <input
            className="input-field"
            value={title}
            placeholder="New task title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="button task-button" onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one to get started.</div>
          ) : (
            tasks.map((task) => (
              <div className="task-item" key={task._id}>
                <h3>{task.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;