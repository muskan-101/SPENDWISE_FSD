import { useEffect, useRef } from 'react';
import './Story.css';
import story1 from '../assets/story1.png';
import story2 from '../assets/story2.png';
import story3 from '../assets/story3.png';
import admin1 from '../assets/admin1.png';
import admin2 from '../assets/admin2.png';
import admin3 from '../assets/admin3.png';

const studentChapters = [
  {
    num: '01',
    color: '#3B70F7',
    title: 'Buying for Events — No Budget in Sight',
    desc: 'Art supplies, trophies, banners — clubs spend on the go with no real system to track what\'s left.',
    pill: '😅 No plan, no control',
    img: story1,
  },
  {
    num: '02',
    color: '#e74c3c',
    title: 'Drowning in Receipts & Chaos',
    desc: 'Post-event, the team stares at a board that reads "COST TRACKING FAIL" surrounded by scattered bills.',
    pill: '😵 Spreadsheet nightmare',
    img: story2,
  },
  {
    num: '03',
    color: '#27ae60',
    title: 'SpendWise Makes It Easy',
    desc: 'Smart bill uploads, instant approvals, and a real-time dashboard. Students breathe easy again.',
    pill: '🎉 Finally — clarity!',
    img: story3,
  },
];

const adminChapters = [
  {
    num: '01',
    color: '#7C5CBF',
    title: 'Flooded With Approval Requests',
    desc: 'Admins receive dozens of expense claims over email and chat — impossible to track or prioritize.',
    pill: '📬 Inbox overload',
    img: admin1,
  },
  {
    num: '02',
    color: '#e67e22',
    title: 'No Visibility Into Club Spending',
    desc: 'Without a central system, admins can\'t see who spent what, or whether they stayed within budget.',
    pill: '🕵️ Zero transparency',
    img: admin2,
  },
  {
    num: '03',
    color: '#3B70F7',
    title: 'SpendWise Puts Admins in Control',
    desc: 'A clean review queue, one-click approvals, analytics, and full audit trails — all in one place.',
    pill: '✅ Total control',
    img: admin3,
  },
];

function StoryCard({ chapter, delay }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="story-card" style={{ transitionDelay: `${delay}s` }}>
      <img src={chapter.img} alt={chapter.title} className="story-card-img" />
      <div className="story-card-body">
        <div className="story-card-num" style={{ background: chapter.color }}>{chapter.num}</div>
        <h4>{chapter.title}</h4>
        <p>{chapter.desc}</p>
        <span className="story-pill" style={{ background: `${chapter.color}18`, color: chapter.color }}>
          {chapter.pill}
        </span>
      </div>
    </div>
  );
}

function StoryBlock({ tag, title, subtitle, chapters }) {
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.2 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={headerRef} className="story-header">
        <span className="story-tag">{tag}</span>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        <p>{subtitle}</p>
      </div>
      <div className="story-grid">
        {chapters.map((ch, i) => (
          <StoryCard key={i} chapter={ch} delay={i * 0.12} />
        ))}
      </div>
    </>
  );
}

function Story() {
  return (
    <section className="story-section" id="about-us">
      {/* Student Story */}
      <StoryBlock
        tag="🎓 Student Story"
        title='From <span>Chaos</span> to Clarity'
        subtitle="Every club has been here. Here's how SpendWise fixes it."
        chapters={studentChapters}
      />

      {/* Divider */}
      <div className="story-divider">
        <span>⚡ AND FOR ADMINS...</span>
      </div>

      {/* Admin Story */}
      <StoryBlock
        tag="🛡️ Admin Story"
        title='Full <span>Control</span>, Zero Guesswork'
        subtitle="SpendWise gives admins the oversight they've always needed."
        chapters={adminChapters}
      />
    </section>
  );
}

export default Story;
