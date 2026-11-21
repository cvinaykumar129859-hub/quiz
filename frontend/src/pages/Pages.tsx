import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Brain, Check, ChevronLeft, ChevronRight, CircleHelp, Clock3, Code2, Database, Globe2, Layers3, LockKeyhole, Network, ShieldCheck, Sparkles, Target, Trophy, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api, errorMessage } from '../services/api';
import type { DashboardData, Quiz, QuizResult } from '../types';

const categoryInfo = [
  { name: 'Programming', icon: Code2, hue: 'mint', note: 'Think in functions, structures and algorithms.' },
  { name: 'Web Development', icon: Globe2, hue: 'blue', note: 'Explore the systems behind the modern web.' },
  { name: 'Cybersecurity', icon: ShieldCheck, hue: 'coral', note: 'Build sharper instincts for digital defense.' },
  { name: 'Database Management', icon: Database, hue: 'amber', note: 'Turn data into reliable, useful systems.' },
  { name: 'General Knowledge', icon: Brain, hue: 'violet', note: 'Connect ideas across the wider world.' },
  { name: 'Aptitude and Reasoning', icon: Target, hue: 'pink', note: 'Make logic and numbers work for you.' },
  { name: 'Operating Systems', icon: Layers3, hue: 'lime', note: 'Understand the engine under every app.' },
  { name: 'Computer Networks', icon: Network, hue: 'sky', note: 'Trace how information travels.' }
];
const levelInfo = [
  { name: 'Easy', time: '15 min', detail: 'Start with the fundamentals and build confidence.', color: 'easy' },
  { name: 'Moderate', time: '15 min', detail: 'Apply what you know to practical scenarios.', color: 'moderate' },
  { name: 'Difficult', time: '15 min', detail: 'Take on advanced ideas and sharper problems.', color: 'difficult' }
];
function PageTitle({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy?: string; action?: ReactNode }) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>;
}
function StatTile({ label, value, suffix, icon: Icon, tone }: { label: string; value: string | number; suffix?: string; icon: typeof Activity; tone: string }) {
  return <div className="stat-tile"><span className={`stat-icon ${tone}`}><Icon size={18} /></span><span className="stat-label">{label}</span><strong>{value}{suffix && <small>{suffix}</small>}</strong></div>;
}
function EmptyState({ title, text, to, action }: { title: string; text: string; to?: string; action?: string }) {
  return <div className="empty-state"><span className="empty-icon"><BookOpen size={22} /></span><h3>{title}</h3><p>{text}</p>{to && <Link className="button button-quiet" to={to}>{action || 'Explore quizzes'} <ArrowRight size={16} /></Link>}</div>;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (user) api.get('/users/dashboard-stats').then(response => setData(response.data)).catch(err => setError(errorMessage(err))); }, [user]);
  return <div className="page-wrap dashboard-page">
    {user ? <>
      <PageTitle eyebrow="YOUR LEARNING SPACE" title={<>Welcome back, <span className="text-accent">{user.username.split(' ')[0]}.</span></>} copy="A little progress, repeated often, adds up to a lot." action={<Link className="button" to="/categories">Find a quiz <ArrowUpRight size={16} /></Link>} />
      {error && <div className="alert alert-error">{error}</div>}
      <div className="stat-grid">{[
        ['Available quizzes', data?.stats.totalAvailable ?? '—', '', BookOpen, 'tone-violet'], ['Completed', data?.stats.totalCompleted ?? '—', '', BadgeCheck, 'tone-mint'], ['Average score', data?.stats.averageScore ?? '—', '%', Activity, 'tone-blue'], ['Personal best', data?.stats.highestScore ?? '—', '%', Trophy, 'tone-amber']
      ].map(([label, value, suffix, icon, tone]) => <StatTile key={String(label)} label={String(label)} value={value as string | number} suffix={String(suffix)} icon={icon as typeof Activity} tone={String(tone)} />)}</div>
      <div className="section-heading"><div><div className="eyebrow">PICK UP A THREAD</div><h2>Explore by category</h2></div><Link className="text-link" to="/categories">All categories <ArrowRight size={15} /></Link></div>
      <CategoryGrid limit={4} />
      <div className="dashboard-lower"><section className="content-panel activity-panel"><div className="panel-heading"><div><div className="eyebrow">YOUR LATEST</div><h2>Recent activity</h2></div><Link className="icon-button" to="/history" aria-label="See all history"><ArrowUpRight size={17} /></Link></div>
        {data?.recent.length ? <div className="activity-list">{data.recent.map((result, index) => <ActivityRow key={result._id || result.id || index} result={result} />)}</div> : <EmptyState title="Your first result is waiting" text="Choose a subject and take a short quiz to start your record." to="/categories" />}</section>
        <section className="focus-panel"><div className="focus-orbit orbit-one"/><div className="focus-orbit orbit-two"/><span className="focus-tag"><Sparkles size={14} /> A good next step</span><h2>Make curiosity<br />a daily habit.</h2><p>Ten focused questions. One clearer picture of what you know.</p><Link className="button button-light" to="/categories">Choose a challenge <ArrowRight size={16} /></Link><span className="focus-index">01 / 08</span></section></div>
    </> : <>
      <section className="hero-panel"><div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="signal-dot" /> A sharper way to learn</span><h1>Knowledge looks<br />good <span>on you.</span></h1><p>Short, focused quizzes for the things you want to understand better. Track the progress. Keep the curiosity.</p><div className="hero-actions"><Link className="button" to="/register">Start learning <ArrowUpRight size={16} /></Link><Link className="button button-outline" to="/about">Meet QuizMaster <ArrowRight size={16} /></Link></div><div className="hero-proof"><div className="proof-avatars"><span>Q</span><span>M</span><span>+</span></div><span><b>8 knowledge tracks</b><br />ready for your next session</span></div></div><div className="hero-art" aria-label="Quiz progress illustration"><div className="art-grid"/><div className="art-card card-back"><span className="art-card-top"><span className="signal-dot"/> QUESTION 04</span><span className="art-question">What makes a<br />great answer?</span><span className="art-option selected"><span className="option-check"><Check size={12}/></span> Understanding the why</span><span className="art-option">Memorizing every word</span></div><div className="art-card card-front"><div className="art-score-ring"><span>86<small>%</small></span></div><div><strong>Nice work.</strong><span>You're finding your rhythm.</span></div><ArrowUpRight size={18}/></div><div className="art-stamp"><Sparkles size={18}/></div><div className="art-caption">A LITTLE<br/>BETTER, DAILY</div></div><div className="hero-decoration">QM / 01</div></section>
      <div className="home-categories"><div className="section-heading"><div><div className="eyebrow">FIND YOUR SUBJECT</div><h2>Curiosity has a lot of lanes.</h2></div><Link className="text-link" to="/register">See all 8 <ArrowRight size={15}/></Link></div><CategoryGrid limit={4} publicMode /></div>
    </>}
  </div>;
}

function CategoryGrid({ limit, publicMode = false }: { limit?: number; publicMode?: boolean }) {
  const items = categoryInfo.slice(0, limit || categoryInfo.length);
  return <div className="category-grid">{items.map(({ name, icon: Icon, hue, note }, index) => <Link key={name} to={publicMode ? '/register' : `/categories/${encodeURIComponent(name)}`} className={`category-card hue-${hue}`}><div className="category-top"><span className="category-icon"><Icon size={19}/></span><span className="category-number">0{index + 1}</span></div><h3>{name}</h3><p>{note}</p><span className="category-arrow"><ArrowUpRight size={16}/></span></Link>)}</div>;
}
function ActivityRow({ result }: { result: QuizResult }) {
  return <div className="activity-row"><span className="activity-bullet"/><div className="activity-copy"><strong>{result.category}</strong><span>{result.difficulty} · {new Date(result.completedAt).toLocaleDateString()}</span></div><div className="activity-score"><b>{result.percentage}%</b><span>{result.score}/{result.totalQuestions}</span></div></div>;
}

export function CategoriesPage() {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : undefined;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { setLoading(true); api.get('/quizzes').then(response => setQuizzes(response.data.quizzes)).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, []);
  if (decodedCategory) {
    const matching = quizzes.filter(quiz => quiz.category === decodedCategory);
    return <div className="page-wrap"><PageTitle eyebrow="CHOOSE YOUR PACE" title={decodedCategory} copy="Three ways to test what you know. Each round is ten questions, with fifteen minutes on the clock." action={<Link className="button button-outline" to="/categories"><ArrowLeft size={16}/> All categories</Link>} />
      {loading ? <Loading /> : error ? <div className="alert alert-error">{error}</div> : <div className="level-grid">{levelInfo.map(level => { const quiz = matching.find(item => item.difficulty === level.name); return <article className={`level-card level-${level.color}`} key={level.name}><div className="level-top"><span className="level-kicker">{level.name === 'Easy' ? '01' : level.name === 'Moderate' ? '02' : '03'} / 03</span><span className="level-time"><Clock3 size={14}/>{level.time}</span></div><div className="level-dial"><span>{level.name === 'Easy' ? '01' : level.name === 'Moderate' ? '02' : '03'}</span></div><h2>{level.name}</h2><p>{level.detail}</p><div className="level-bottom"><span>10 questions</span>{quiz ? <Link className="level-start" to={`/quiz/${quiz._id}`} aria-label={`Start ${level.name} quiz`}><ArrowRight size={18}/></Link> : <span className="muted">Not seeded</span>}</div></article>; })}</div>}
    </div>;
  }
  return <div className="page-wrap"><PageTitle eyebrow="THE QUIZ LIBRARY" title="Pick a subject." copy="Choose a track, then find the level that feels right today." /><div className="category-toolbar"><span><span className="signal-dot"/> 8 knowledge tracks</span><span>24 quizzes · 10 questions each</span></div>{loading ? <Loading /> : error ? <div className="alert alert-error">{error}</div> : <CategoryGrid />}</div>;
}

export function AuthPage({ register = false }: { register?: boolean }) {
  const navigate = useNavigate();
  const { refresh, user } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { await api.post(register ? '/auth/register' : '/auth/login', register ? form : { email: form.email, password: form.password }); await refresh(); navigate('/'); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  return <div className="page-wrap auth-wrap"><div className="auth-aside"><span className="eyebrow">QUIZMASTER / ACCOUNT</span><h1>{register ? <>Start with<br/>a question.</> : <>Good to<br/>see you.</>}</h1><p>{register ? 'Build a record of what you learn, one focused session at a time.' : 'Your next small win is only a few questions away.'}</p><div className="auth-aside-mark"><span>Q</span><span>·</span><span>M</span><small>LEARN IN PUBLIC.<br/>GROW IN PRIVATE.</small></div></div><form className="auth-form" onSubmit={submit}><div className="auth-form-heading"><span className="eyebrow">{register ? 'CREATE YOUR ACCOUNT' : 'YOUR LEARNING SPACE'}</span><h2>{register ? 'Join QuizMaster' : 'Welcome back'}</h2><p>{register ? 'A few details, then you’re in.' : 'Sign in to pick up where you left off.'}</p></div>
    {register && <label>Username<input autoComplete="username" required minLength={2} maxLength={40} value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} placeholder="What should we call you?" /></label>}
    <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
    <label>Password<input type="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 8 : 1} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder={register ? 'At least 8 characters' : 'Enter your password'} /></label>
    {register && <label>Confirm password<input type="password" autoComplete="new-password" required minLength={8} value={form.confirmPassword} onChange={event => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Type it again" /></label>}
    {error && <div className="alert alert-error">{error}</div>}<button className="button auth-submit" disabled={busy}>{busy ? <><span className="spinner spinner-small"/> One moment</> : <>{register ? 'Create account' : 'Sign in'} <ArrowRight size={16}/></>}</button><p className="auth-switch">{register ? 'Already have an account?' : 'New to QuizMaster?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p><span className="auth-privacy"><LockKeyhole size={13}/> Your account stays yours. Passwords are securely hashed.</span>
  </form></div>;
}

export function QuizPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(900);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { api.get(`/quizzes/${id}/questions`).then(response => { setQuiz(response.data.quiz); setAnswers(Array(response.data.quiz.questions.length).fill(null)); }).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, [id]);
  async function submit() {
    if (!quiz || busy) return;
    setBusy(true); setError('');
    try { const { data } = await api.post(`/quizzes/${id}/submit`, { answers: answers.map((selectedAnswer, questionIndex) => ({ questionIndex, selectedAnswer })) }); navigate(`/results/${data.result.id}`, { state: { result: data.result } }); }
    catch (err) { setError(errorMessage(err)); setBusy(false); }
  }
  useEffect(() => { if (!quiz || busy) return; const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [quiz, busy]);
  useEffect(() => { if (seconds === 0 && quiz && !busy) void submit(); }, [seconds, quiz, busy]);
  const question = quiz?.questions?.[current];
  const answeredCount = answers.filter(answer => answer !== null).length;
  const timeLabel = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  if (loading) return <div className="page-wrap"><Loading /></div>;
  if (!quiz || !question) return <div className="page-wrap"><div className="alert alert-error">{error || 'Quiz unavailable.'}</div><Link to="/categories" className="button button-outline">Back to quizzes</Link></div>;
  return <div className="page-wrap quiz-wrap"><div className="quiz-topline"><Link to={`/categories/${encodeURIComponent(quiz.category)}`} className="back-link"><ArrowLeft size={16}/>{quiz.category}</Link><span className={`timer ${seconds < 60 ? 'timer-danger' : ''}`}><Clock3 size={16}/>{timeLabel}</span></div><div className="quiz-heading"><div><div className="eyebrow">{quiz.difficulty.toUpperCase()} SESSION</div><h1>{quiz.title}</h1></div><div className="quiz-progress-label"><strong>{answeredCount}</strong> of {quiz.questions?.length} answered</div></div><div className="progress-track"><span style={{ width: `${(answeredCount / (quiz.questions?.length || 10)) * 100}%` }}/></div>
    <div className="quiz-layout"><section className="question-panel"><div className="question-meta"><span>QUESTION {String(current + 1).padStart(2, '0')}</span><span>{quiz.questions?.length} TOTAL</span></div><h2>{question.text}</h2><div className="option-list">{question.options.map((option, index) => <button key={option} className={`answer-option ${answers[current] === index ? 'selected' : ''}`} onClick={() => setAnswers(values => values.map((value, questionIndex) => questionIndex === current ? index : value))}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{answers[current] === index && <Check size={17} className="answer-check"/>}</button>)}</div><div className="quiz-controls"><button className="button button-outline" disabled={current === 0} onClick={() => setCurrent(value => value - 1)}><ChevronLeft size={17}/> Previous</button><span>{current + 1} / {quiz.questions?.length}</span>{current < (quiz.questions?.length || 10) - 1 ? <button className="button" onClick={() => setCurrent(value => value + 1)}>Next <ChevronRight size={17}/></button> : <button className="button button-submit" disabled={busy} onClick={() => void submit()}>{busy ? 'Submitting…' : 'Submit quiz'} <ArrowRight size={17}/></button>}</div>{error && <div className="alert alert-error">{error}</div>}</section>
      <aside className="question-nav"><div className="question-nav-title"><h3>Question map</h3><span>{answeredCount}/10</span></div><div className="question-dots">{answers.map((answer, index) => <button key={index} aria-label={`Go to question ${index + 1}`} className={`${answer !== null ? 'is-answered' : ''} ${current === index ? 'is-current' : ''}`} onClick={() => setCurrent(index)}>{index + 1}</button>)}</div><div className="question-legend"><span><i className="legend-current"/>Current</span><span><i className="legend-answered"/>Answered</span><span><i className="legend-empty"/>Unanswered</span></div><div className="question-nav-tip"><CircleHelp size={15}/>You can move between questions any time.</div>{current !== (quiz.questions?.length || 10) - 1 && <button className="text-link nav-submit" onClick={() => void submit()} disabled={busy}>Submit quiz <ArrowRight size={15}/></button>}</aside></div>
  </div>;
}

export function ResultPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const [result, setResult] = useState<QuizResult | null>(location.state?.result ?? null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');
  useEffect(() => { if (!result) api.get(`/results/${id}`).then(response => setResult(response.data.result)).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, [id, result]);
  const questions = result?.quizId?.questions;
  if (loading) return <div className="page-wrap"><Loading /></div>;
  if (!result) return <div className="page-wrap"><div className="alert alert-error">{error || 'Result not found.'}</div><Link to="/history" className="button button-outline">Go to history</Link></div>;
  const passed = result.passed ?? result.percentage >= 60;
  return <div className="page-wrap result-wrap"><div className="result-banner"><div className="result-confetti confetti-one"/><div className="result-confetti confetti-two"/><div className="result-label"><span className={passed ? 'result-status passed' : 'result-status failed'}>{passed ? <Check size={14}/> : <X size={14}/>} {passed ? 'PASSED' : 'KEEP PRACTICING'}</span><span className="eyebrow">SESSION COMPLETE</span></div><h1>{passed ? 'That knowledge is sticking.' : 'Every try builds the picture.'}</h1><p>{result.category} <span>·</span> {result.difficulty} <span>·</span> {new Date(result.completedAt).toLocaleDateString()}</p><div className="result-score-line"><div className="result-score">{result.percentage}<small>%</small></div><div className="result-score-detail"><strong>{result.score} / {result.totalQuestions}</strong><span>correct answers</span></div><div className="result-score-detail"><strong>{result.totalQuestions - result.score}</strong><span>to revisit</span></div><Link className="button button-light" to="/categories">Try another <ArrowRight size={16}/></Link></div></div><div className="section-heading review-heading"><div><div className="eyebrow">LEARN FROM THE ROUND</div><h2>Answer review</h2></div><Link to="/history" className="text-link">View history <ArrowRight size={15}/></Link></div><div className="review-list">{result.answers.map((answer, index) => { const q = questions?.[answer.questionIndex]; const text = answer.question || q?.text || `Question ${index + 1}`; const options = answer.options || q?.options || []; return <article className={`review-item ${answer.isCorrect ? 'review-correct' : 'review-incorrect'}`} key={answer.questionIndex}><div className="review-mark">{answer.isCorrect ? <Check size={17}/> : <X size={17}/>}</div><div className="review-content"><span className="eyebrow">QUESTION {String(index + 1).padStart(2, '0')} · {answer.isCorrect ? 'CORRECT' : 'INCORRECT'}</span><h3>{text}</h3><p><b>Your answer:</b> {answer.selectedAnswer === null ? 'No answer selected' : options[answer.selectedAnswer] || 'Selected option'}</p>{!answer.isCorrect && <p><b>Correct answer:</b> {options[answer.correctAnswer] || 'Correct option'}</p>}<div className="explanation"><Sparkles size={14}/>{answer.explanation}</div></div></article>; })}</div></div>;
}

export function HistoryPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/results/my-results').then(response => setResults(response.data.results)).catch(err => setError(errorMessage(err))).finally(() => setLoading(false)); }, []);
  return <div className="page-wrap"><PageTitle eyebrow="YOUR TIMELINE" title="Quiz history" copy="Every session, one place. See what’s clicking and where to go next." action={<Link className="button" to="/categories">New quiz <ArrowUpRight size={16}/></Link>} />{error && <div className="alert alert-error">{error}</div>}{loading ? <Loading/> : results.length ? <div className="history-table-wrap"><table className="history-table"><thead><tr><th>SUBJECT</th><th>LEVEL</th><th>RESULT</th><th>DATE</th><th></th></tr></thead><tbody>{results.map(result => <tr key={result._id || result.id}><td><strong>{result.category}</strong><span>{(result.quizId as { title?: string } | undefined)?.title || 'Practice quiz'}</span></td><td><span className={`difficulty-pill ${result.difficulty.toLowerCase()}`}>{result.difficulty}</span></td><td><strong className={result.percentage >= 60 ? 'score-positive' : 'score-neutral'}>{result.percentage}%</strong><span>{result.score}/{result.totalQuestions} correct</span></td><td>{new Date(result.completedAt).toLocaleDateString()}</td><td><Link className="icon-button" to={`/results/${result._id || result.id}`} aria-label="Review result"><ArrowUpRight size={16}/></Link></td></tr>)}</tbody></table></div> : <EmptyState title="Nothing on the timeline yet" text="Your completed sessions will show up here." to="/categories" action="Take your first quiz"/>}</div>;
}

export function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [name, setName] = useState(user?.username || '');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { api.get('/users/profile').then(response => { setData(response.data); setName(response.data.user.username); }).catch(err => setError(errorMessage(err))); }, []);
  async function saveProfile(event: React.FormEvent) { event.preventDefault(); setNotice(''); setError(''); try { await api.put('/users/profile', { username: name }); setNotice('Profile updated.'); } catch (err) { setError(errorMessage(err)); } }
  const levels = data?.stats?.levels || [];
  return <div className="page-wrap"><PageTitle eyebrow="YOUR ACCOUNT" title="Profile & progress" copy="A snapshot of your learning, measured one session at a time." />{error && <div className="alert alert-error">{error}</div>}{data && <><div className="profile-top"><div className="profile-person"><div className="profile-avatar">{data.user.username.slice(0, 1).toUpperCase()}</div><div><h2>{data.user.username}</h2><span>{data.user.email}</span><small>Member since {new Date(data.user.createdAt).toLocaleDateString()}</small></div></div><form className="profile-edit" onSubmit={saveProfile}><label htmlFor="profile-name">Display name</label><div><input id="profile-name" value={name} onChange={event => setName(event.target.value)} minLength={2} maxLength={40}/><button className="button button-small">Save</button></div>{notice && <span className="success-message">{notice}</span>}</form></div><div className="stat-grid profile-stats"><StatTile label="Quizzes attempted" value={data.stats.totalAttempted} icon={BookOpen} tone="tone-violet"/><StatTile label="Completed" value={data.stats.totalCompleted} icon={BadgeCheck} tone="tone-mint"/><StatTile label="Average score" value={data.stats.averageScore} suffix="%" icon={Activity} tone="tone-blue"/><StatTile label="Personal best" value={data.stats.highestScore} suffix="%" icon={Trophy} tone="tone-amber"/></div><div className="profile-lower"><section className="content-panel performance-panel"><div className="panel-heading"><div><div className="eyebrow">BY DIFFICULTY</div><h2>Performance</h2></div></div>{levels.length ? <div className="chart-wrap"><ResponsiveContainer width="100%" height="245"><BarChart data={levels} margin={{ top: 16, right: 12, bottom: 4, left: -16 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#292a3c"/><XAxis dataKey="difficulty" tick={{ fill: '#9b9bad', fontSize: 12 }} axisLine={false} tickLine={false}/><YAxis domain={[0, 100]} tick={{ fill: '#77788b', fontSize: 11 }} axisLine={false} tickLine={false}/><Tooltip cursor={{ fill: '#ffffff08' }} contentStyle={{ background: '#191a2a', border: '1px solid #35364a', borderRadius: 8 }} formatter={(value: number) => [`${value}%`, 'Average score']}/><Bar dataKey="average" fill="#9d8aff" radius={[4, 4, 0, 0]} maxBarSize={44}/></BarChart></ResponsiveContainer></div> : <EmptyState title="Your chart starts with a quiz" text="Try a few levels to compare your scores." to="/categories"/>}</section><section className="content-panel"><div className="panel-heading"><div><div className="eyebrow">LATEST SESSIONS</div><h2>Recent activity</h2></div><Link className="text-link" to="/history">All history <ArrowRight size={15}/></Link></div>{data.recent.length ? <div className="activity-list">{data.recent.map((result: QuizResult, index: number) => <ActivityRow key={result._id || index} result={result}/>)}</div> : <EmptyState title="Ready when you are" text="Complete a quiz to see your progress here." to="/categories"/>}</section></div></>}</div>;
}

export function AboutPage() {
  const tech = ['React + TypeScript', 'Node.js + Express', 'MongoDB Atlas', 'JWT + bcrypt', 'Zod validation', 'Recharts analytics'];
  return <div className="page-wrap about-page"><section className="about-hero"><div className="eyebrow">WHY QUIZMASTER EXISTS</div><h1>Curiosity is a<br/><span>practice.</span></h1><p>QuizMaster turns the urge to know a little more into a habit you can see, measure, and keep.</p><div className="about-hero-side"><span className="about-mark">Q<span>.</span>M</span><span>BUILT FOR THE<br/>NEXT QUESTION</span></div></section><section className="about-intro"><span className="section-number">01 / THE IDEA</span><div><h2>What if learning felt less like a test and more like a trail?</h2><p>QuizMaster is a focused quiz platform for learners who want to check their understanding, find a gap, and come back stronger. Each session is short by design: ten questions, three levels, and a clear review that shows not just what was right, but why.</p></div></section><section className="about-values"><article><span className="value-index">A</span><h3>Small steps, real signal.</h3><p>Short rounds make it easier to practice consistently and spot progress over time.</p></article><article><span className="value-index">B</span><h3>Feedback with a reason.</h3><p>Every answer review includes an explanation, so mistakes become useful clues.</p></article><article><span className="value-index">C</span><h3>Progress that belongs to you.</h3><p>Your profile and results are private, tied to your account, and saved securely.</p></article></section><section className="about-categories"><div><span className="section-number">02 / EIGHT TRACKS</span><h2>Room to roam.</h2></div><div className="about-track-list">{categoryInfo.map((item, index) => <div key={item.name}><span>0{index + 1}</span><strong>{item.name}</strong><ArrowUpRight size={15}/></div>)}</div></section><section className="about-levels"><span className="section-number">03 / FIND YOUR PACE</span><div className="about-level-grid">{levelInfo.map((level, index) => <div key={level.name}><span>0{index + 1}</span><h3>{level.name}</h3><p>{level.detail}</p></div>)}</div></section><section className="about-tech"><div><span className="section-number">04 / THE TOOLKIT</span><h2>Built to be dependable.</h2></div><div className="tech-tags">{tech.map(item => <span key={item}><Check size={14}/>{item}</span>)}</div></section><section className="mission-panel"><div className="mission-stamp"><Sparkles size={20}/></div><span className="section-number">05 / OUR NORTH STAR</span><h2>Make learning<br/>feel <em>possible.</em></h2><p>Our mission is to make self-directed learning more approachable and more honest. Our vision is a place where every learner can turn a question into a next step.</p><Link to="/register" className="button button-light">Find your first quiz <ArrowRight size={16}/></Link></section></div>;
}

function Loading() { return <div className="page-loader"><span className="spinner"/>Loading QuizMaster</div>; }
