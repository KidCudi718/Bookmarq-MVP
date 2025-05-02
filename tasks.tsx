import useSWR from 'swr';

const fetcher = (url:string)=>fetch(url).then(r=>r.json());

export default function Tasks() {
  const {data,mutate}=useSWR('/api/tasks',fetcher);
  if(!data) return <p>Loading…</p>;
  return (
    <main>
      <h1>Your Tasks</h1>
      {data.map((t:any)=>(
        <div key={t.id} style={{border:'1px solid #ccc',padding:'1rem',margin:'1rem'}}>
          <p>{t.draft}</p>
          {t.approved? <span>✅ Logged</span>:
          <button onClick={async()=>{
            await fetch('/api/tasks/approve?id='+t.id,{method:'POST'});
            mutate();
          }}>Approve &amp; Log</button>}
        </div>
      ))}
    </main>
  );
}
