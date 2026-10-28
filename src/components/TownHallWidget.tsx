import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, User, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface TownHallTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  commentsCount: number;
  status: 'Open' | 'Under Review' | 'Scheduled for Debate';
  comments: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
    isVerifiedConstituent?: boolean;
  }>;
}

interface Props {
  currentLang: string;
}

export const TownHallWidget: React.FC<Props> = ({ currentLang }) => {
  const [topics, setTopics] = useState<TownHallTopic[]>(() => {
    const saved = localStorage.getItem('danmaje_townhall_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'th-1',
        title: 'Expansion of Solar Powered Water Boreholes in Yabo Rural Wards',
        category: 'Water & Infrastructure',
        description: 'Proposal to prioritize solar borehole installations across Birnin Tudu, Gandi, and Yabo rural farming settlements for dry-season irrigation and clean domestic water supply.',
        author: 'Alhaji Bello Yabo',
        date: '2026-10-18',
        votes: 342,
        commentsCount: 14,
        status: 'Scheduled for Debate',
        comments: [
          { id: 'c-1', author: 'Mallam Shehu Shagari', text: 'This will greatly assist dry season farmers in our ward. Full support!', date: '2026-10-19', isVerifiedConstituent: true },
          { id: 'c-2', author: 'Dr. Zaynab Aliyu', text: 'Clean water access reduces waterborne diseases significantly. Excellent priority.', date: '2026-10-19', isVerifiedConstituent: true }
        ]
      },
      {
        id: 'th-2',
        title: 'Establishment of ICT & Digital Skills Hub for Youth in Shagari',
        category: 'Youth Empowerment',
        description: 'Creation of a dedicated computer training and computer-based test (CBT) center to prepare secondary school graduates for JAMB and remote tech careers.',
        author: 'Ibrahim Dan-Shagari',
        date: '2026-10-19',
        votes: 289,
        commentsCount: 9,
        status: 'Open',
        comments: [
          { id: 'c-3', author: 'Mustapha Yabo', text: 'Youth empowerment in technology is urgently needed in our constituency.', date: '2026-10-20', isVerifiedConstituent: true }
        ]
      }
    ];
  });

  const [votedTopics, setVotedTopics] = useState<Record<string, boolean>>({});
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Infrastructure');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const [activeCommentTopicId, setActiveCommentTopicId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const handleVote = (topicId: string) => {
    if (votedTopics[topicId]) return;
    const updated = topics.map(t => {
      if (t.id === topicId) {
        return { ...t, votes: t.votes + 1 };
      }
      return t;
    });
    setTopics(updated);
    setVotedTopics({ ...votedTopics, [topicId]: true });
    localStorage.setItem('danmaje_townhall_topics', JSON.stringify(updated));
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newDesc.trim()) return;

    const newTp: TownHallTopic = {
      id: `th-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim(),
      author: newAuthor.trim(),
      date: new Date().toISOString().split('T')[0],
      votes: 1,
      commentsCount: 0,
      status: 'Open',
      comments: []
    };

    const updated = [newTp, ...topics];
    setTopics(updated);
    localStorage.setItem('danmaje_townhall_topics', JSON.stringify(updated));
    setShowNewTopicModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewAuthor('');
  };

  const handleAddComment = (topicId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim()) return;

    const updated = topics.map(t => {
      if (t.id === topicId) {
        const newC = {
          id: `c-${Date.now()}`,
          author: commentAuthor.trim(),
          text: commentText.trim(),
          date: new Date().toLocaleDateString(),
          isVerifiedConstituent: true
        };
        return {
          ...t,
          commentsCount: t.commentsCount + 1,
          comments: [newC, ...t.comments]
        };
      }
      return t;
    });

    setTopics(updated);
    localStorage.setItem('danmaje_townhall_topics', JSON.stringify(updated));
    setCommentText('');
    setCommentAuthor('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-4 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-200 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/40">
            Constituency Town Hall & Civic Debate
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-white">
          COMMUNITY PRIORITY VOTING & TOWN HALL FORUM
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
          Participate directly in legislative priority setting. Vote on constituency projects, submit town hall discussion topics, and deliberate with fellow citizens of Yabo and Shagari.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setShowNewTopicModal(true)}
            className="bg-white hover:bg-emerald-50 text-[#09291F] font-bold px-6 py-3.5 rounded-xl text-xs uppercase shadow-lg transition cursor-pointer flex items-center gap-2 border border-emerald-400"
          >
            <MessageSquare className="w-4 h-4 text-[#103C2E]" />
            <span>SUBMIT NEW TOWN HALL PROPOSAL</span>
          </button>
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#103C2E]">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-['Manrope'] font-extrabold text-[#103C2E] text-lg uppercase">
                Submit Town Hall Proposal
              </h3>
              <button onClick={() => setShowNewTopicModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malam Aminu Yabo"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Proposal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Construction of Primary Healthcare Center"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="Water & Infrastructure">Water & Infrastructure</option>
                  <option value="Youth Empowerment">Youth Empowerment</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the community benefit and urgency of this proposal..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold uppercase shadow cursor-pointer"
                >
                  Publish Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topics List */}
      <div className="grid grid-cols-1 gap-6">
        {topics.map(topic => (
          <div key={topic.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-300">
                  {topic.category}
                </span>
                <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-3 py-1 rounded-full">
                  Status: {topic.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <User className="w-3.5 h-3.5 text-[#103C2E]" />
                <span>{topic.author}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{topic.date}</span>
              </div>
            </div>

            <h3 className="font-['Manrope'] font-extrabold text-xl sm:text-2xl text-[#103C2E]">
              {topic.title}
            </h3>

            <p className="text-stone-700 text-sm leading-relaxed font-light">
              {topic.description}
            </p>

            {/* Vote and Comments Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote(topic.id)}
                  disabled={votedTopics[topic.id]}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 transition cursor-pointer shadow-sm ${
                    votedTopics[topic.id]
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#103C2E] hover:bg-[#09291F] text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-[#D4AF37]" />
                  <span>{votedTopics[topic.id] ? 'Voted!' : 'Support / Vote'} ({topic.votes})</span>
                </button>

                <button
                  onClick={() => setActiveCommentTopicId(activeCommentTopicId === topic.id ? null : topic.id)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                  <span>Discussion ({topic.commentsCount})</span>
                </button>
              </div>
            </div>

            {/* Comments Section Drawer */}
            {activeCommentTopicId === topic.id && (
              <div className="pt-4 border-t border-stone-200 space-y-4 animate-fadeIn">
                <h4 className="font-bold text-xs text-[#103C2E] uppercase">Constituent Deliberations & Comments</h4>

                <form onSubmit={(e) => handleAddComment(topic.id, e)} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name (e.g. Ibrahim Yabo)"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Write your contribution or feedback..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase shadow cursor-pointer"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {topic.comments.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">No comments yet. Be the first constituent to contribute to this discussion.</p>
                  ) : (
                    topic.comments.map(c => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-[#103C2E] font-bold">{c.author}</strong>
                            {c.isVerifiedConstituent && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Verified Constituent
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">{c.date}</span>
                        </div>
                        <p className="text-stone-700">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
