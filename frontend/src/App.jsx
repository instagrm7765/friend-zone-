
import { useState } from "react";
import {
  Home, Compass, MessageCircle, Bell, User, Settings,
  Search, Heart, MessageSquare, Share2, Image,
  Send, LogOut, Menu, X, Plus, Sparkles
} from "lucide-react";
import "./index.css";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const initialPosts = [
  {
    id: 1,
    name: "Alex Morgan",
    username: "@alexm",
    time: "2 hours ago",
    avatar: "A",
    color: "blue",
    text: "Building something amazing today! 🚀 Excited to share my latest project with everyone.",
    likes: 128,
    comments: 24
  },
  {
    id: 2,
    name: "Sophia Williams",
    username: "@sophia",
    time: "4 hours ago",
    avatar: "S",
    color: "pink",
    text: "Never stop learning. Every small step takes you closer to your dreams. ✨",
    likes: 86,
    comments: 12
  }
];

function App() {
  const [token, setToken] = useState(localStorage.getItem("social_token"));
  const [user, setUser] = useState(
    localStorage.getItem("social_user") || ""
  );
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("Home");
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState([]);

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      const body = mode === "login"
        ? { email, password }
        : { username, email, password };

      const response = await fetch(API + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      if (mode === "register") {
        setMode("login");
        setError("Account created! Please log in.");
        setPassword("");
      } else {
        localStorage.setItem("social_token", data.access_token);
        localStorage.setItem("social_user", email);
        setToken(data.access_token);
        setUser(email);
      }
    } catch (err) {
      setError(err.message || "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("social_token");
    localStorage.removeItem("social_user");
    setToken(null);
    setUser("");
    setActive("Home");
  }

  function addPost() {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      name: user.split("@")[0] || "You",
      username: "@" + (user.split("@")[0] || "you"),
      time: "Just now",
      avatar: (user[0] || "Y").toUpperCase(),
      color: "purple",
      text: newPost,
      likes: 0,
      comments: 0
    };

    setPosts([post, ...posts]);
    setNewPost("");
  }

  function toggleLike(id) {
    setLiked((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  }

  if (!token) {
    return (
      <main className="auth-page">
        <div className="auth-glow glow-one"></div>
        <div className="auth-glow glow-two"></div>

        <section className="auth-card">
          <div className="brand">
            <div className="brand-icon"><Sparkles /></div>
            <span>VIBENET</span>
          </div>

          <div className="auth-heading">
            <p className="eyebrow">YOUR WORLD. YOUR PEOPLE.</p>
            <h1>{mode === "login" ? "Welcome back." : "Join the community."}</h1>
            <p>
              {mode === "login"
                ? "Connect with people and share your world."
                : "Create your account and start connecting."}
            </p>
          </div>

          <form onSubmit={handleAuth}>
            {mode === "register" && (
              <label>
                Username
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  minLength={3}
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={mode === "register" ? 8 : undefined}
                required
              />
            </label>

            {error && <div className="auth-message">{error}</div>}

            <button className="primary-button auth-submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "New to VibeNet?" : "Already have an account?"}
            <button onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>

          <p className="auth-footer">A place to connect, create and belong.</p>
        </section>
      </main>
    );
  }

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Compass },
    { name: "Messages", icon: MessageCircle },
    { name: "Notifications", icon: Bell },
    { name: "Profile", icon: User }
  ];

  const filteredPosts = posts.filter((post) =>
    (post.name + post.text).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <div className="brand-icon"><Sparkles /></div>
          <span>VIBENET</span>
        </div>

        <div className="nav-label">MENU</div>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`nav-item ${active === item.name ? "active" : ""}`}
                onClick={() => setActive(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "Notifications" && <i className="notification-dot"></i>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setActive("Settings")}>
            <Settings size={19} /> Settings
          </button>
          <div className="sidebar-user">
            <div className="avatar purple">{(user[0] || "Y").toUpperCase()}</div>
            <div className="user-info">
              <strong>{user.split("@")[0]}</strong>
              <small>{user}</small>
            </div>
            <button className="icon-button" onClick={logout} title="Log out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setActive("Home")}>
            <Menu />
          </button>
          <div className="page-title">
            <h2>{active}</h2>
            <p>Your community, your space.</p>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="icon-button top-bell" onClick={() => setActive("Notifications")}>
              <Bell size={19} />
            </button>
          </div>
        </header>

        <div className="content-layout">
          <section className="feed-column">
            {active === "Home" || active === "Explore" ? (
              <>
                <div className="welcome-banner">
                  <div>
                    <span className="eyebrow">YOUR COMMUNITY IS WAITING</span>
                    <h1>Make your moment <span>matter.</span></h1>
                    <p>Share ideas, discover people and stay connected.</p>
                  </div>
                  <Sparkles className="banner-sparkle" size={48} />
                </div>

                <div className="create-post card">
                  <div className="avatar purple">{(user[0] || "Y").toUpperCase()}</div>
                  <div className="post-input-area">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="What's happening in your world?"
                    />
                    <div className="post-tools">
                      <span><Image size={17} /> Photo</span>
                      <button className="primary-button post-button" onClick={addPost}>
                        <Plus size={17} /> Share Post
                      </button>
                    </div>
                  </div>
                </div>

                <div className="feed-heading">
                  <div>
                    <h2>Your Feed</h2>
                    <p>Latest updates from the community</p>
                  </div>
                  <span className="live-label"><i></i> LIVE FEED</span>
                </div>

                {filteredPosts.map((post) => (
                  <article className="post-card card" key={post.id}>
                    <div className="post-author">
                      <div className={`avatar ${post.color}`}>{post.avatar}</div>
                      <div className="author-details">
                        <strong>{post.name}</strong>
                        <small>{post.username} · {post.time}</small>
                      </div>
                      <button className="icon-button more-button">···</button>
                    </div>

                    <p className="post-text">{post.text}</p>

                    <div className="post-stats">
                      <span>{post.likes + (liked.includes(post.id) ? 1 : 0)} likes</span>
                      <span>{post.comments} comments</span>
                    </div>

                    <div className="post-actions">
                      <button
                        className={liked.includes(post.id) ? "liked" : ""}
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart size={18} fill={liked.includes(post.id) ? "currentColor" : "none"} />
                        Like
                      </button>
                      <button><MessageSquare size={18} /> Comment</button>
                      <button><Share2 size={18} /> Share</button>
                    </div>
                  </article>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="empty-state">No posts found. Try another search.</div>
                )}
              </>
            ) : (
              <div className="section-placeholder card">
                <div className="placeholder-icon">
                  {active === "Messages" ? <MessageCircle /> :
                    active === "Notifications" ? <Bell /> :
                    active === "Profile" ? <User /> : <Settings />}
                </div>
                <h2>{active}</h2>
                <p>
                  {active === "Profile"
                    ? `Signed in as ${user}. Profile features are coming next.`
                    : `${active} workspace is ready for the next development step.`}
                </p>
                <button className="primary-button" onClick={() => setActive("Home")}>
                  Back to Home
                </button>
              </div>
            )}
          </section>

          <aside className="right-column">
            <div className="profile-card card">
              <div className="profile-cover"></div>
              <div className="profile-card-body">
                <div className="avatar purple profile-avatar">
                  {(user[0] || "Y").toUpperCase()}
                </div>
                <strong>{user.split("@")[0]}</strong>
                <small>{user}</small>
                <div className="profile-stats">
                  <div><strong>{posts.length}</strong><span>Posts</span></div>
                  <div><strong>0</strong><span>Followers</span></div>
                  <div><strong>0</strong><span>Following</span></div>
                </div>
              </div>
            </div>

            <div className="suggestions card">
              <div className="side-heading">
                <h3>Trending Topics</h3>
                <Sparkles size={17} />
              </div>
              <div className="trend"><span>#</span><div><strong>#Technology</strong><small>2.4k posts</small></div></div>
              <div className="trend"><span>#</span><div><strong>#Design</strong><small>1.8k posts</small></div></div>
              <div className="trend"><span>#</span><div><strong>#Innovation</strong><small>980 posts</small></div></div>
            </div>

            <div className="side-footer">
              About · Privacy · Terms · Help
              <br />© 2026 VibeNet
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;

