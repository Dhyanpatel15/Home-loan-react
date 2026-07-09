const posts = [
  { title: 'First home buyer checklist', tag: 'Guide', text: 'Key finance steps before choosing your first property.' },
  { title: 'Fixed vs variable loans', tag: 'Education', text: 'Understand different rate types before comparing lenders.' },
  { title: 'Refinancing signals', tag: 'Refinance', text: 'When it may be time to review your current home loan.' },
  { title: 'Offset account basics', tag: 'Features', text: 'How offset balances can reduce interest over time.' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14">
      <div className="container-shell max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">Insights</p>
          <h1 className="mt-3 text-5xl font-black text-slate-950">Financial Blog</h1>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.title} className="rounded-[2rem] bg-white p-7 shadow-soft">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{post.tag}</span>
              <h2 className="mt-4 text-2xl font-black text-slate-950">{post.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{post.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
