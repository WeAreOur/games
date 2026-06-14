import{s as i}from"./useStatsEngine.CrDSq79f.js";import"./hoisted.DN2p_v7o.js";import"./indexeddb.w3rfYzSH.js";async function n(){await i.init();const t=await i.getStats(),e=document.getElementById("stats-content");if(!e)return;if(t.length===0){e.innerHTML=`
        <div class="no-data">
          <p>No gaming data yet. Start playing to see your stats! 🎮</p>
        </div>
      `;return}const c=t.reduce((s,a)=>s+a.totalExercises,0),d=t.reduce((s,a)=>s+a.successfulExercises,0),r=c>0?Math.round(d/c*100):0,o=Math.round(t.reduce((s,a)=>s+a.totalTimeSeconds,0)/60);let l=`
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-value">${c}</div>
          <div class="card-label">Total Exercises</div>
        </div>
        <div class="summary-card">
          <div class="card-value">${r}%</div>
          <div class="card-label">Success Rate</div>
        </div>
        <div class="summary-card">
          <div class="card-value">${o}m</div>
          <div class="card-label">Time Played</div>
        </div>
      </div>

      <div class="games-stats">
        <h2>Per Game Stats</h2>
    `;t.forEach(s=>{const a=s.totalExercises>0?Math.round(s.successfulExercises/s.totalExercises*100):0,v=Math.round(s.totalTimeSeconds/60);l+=`
        <div class="game-stat-card">
          <div class="game-stat-header">
            <h3>${s.gameName}</h3>
            <span class="success-badge ${a>=80?"excellent":a>=60?"good":"fair"}">
              ${a}%
            </span>
          </div>
          <div class="game-stat-content">
            <div class="stat-row">
              <span class="stat-label">Exercises:</span>
              <span class="stat-value">${s.totalExercises}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Correct:</span>
              <span class="stat-value correct">${s.successfulExercises}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Incorrect:</span>
              <span class="stat-value incorrect">${s.failedExercises}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Time:</span>
              <span class="stat-value">${v}m</span>
            </div>
          </div>
        </div>
      `}),l+=`
      </div>
      <button id="clear-stats-btn" class="clear-button">🗑️ Clear All Stats</button>
    `,e.innerHTML=l,document.getElementById("clear-stats-btn")?.addEventListener("click",async()=>{confirm("Are you sure you want to clear all stats? This cannot be undone.")&&(await i.clearStats(),n())})}n();
