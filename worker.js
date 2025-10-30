addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const pastStats = [
  [2,7,17,27,34],
  [2,9,16,25,29],
  [5,16,22,23,31],
  [9,14,26,27,34],
  [7,8,21,25,28],
  [13,14,20,33,35],
  [5,10,13,20,21],
  [5,7,18,23,31],
  [6,7,19,23,35]
];

async function handleRequest(request) {
  try {
    const response = await fetch('https://api.powerban.win/draw/previous');
    const data = await response.json();

    if (!data.success || !data.winningNumbers) throw new Error("Could not fetch latest numbers.");

    const latestNumbers = data.winningNumbers;
    const allStats = [...pastStats, latestNumbers];
    const flatStats = allStats.flat();

    const counts = {};
    flatStats.forEach(num => counts[num] = (counts[num] || 0) + 1);

    const totalDraws = allStats.length;

    const percentages = {};
    Object.entries(counts).forEach(([num, count]) => {
      percentages[num] = ((count / totalDraws) * 100).toFixed(2);
    });

    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const mostCommon = sorted[0][0];
    const leastCommon = sorted[sorted.length-1][0];
    const top5 = sorted.slice(0,5).map(([num]) => num);

    const neverAppeared = [];
    for(let i=1;i<=35;i++){
      if(!counts[i]) neverAppeared.push(i);
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PowerBAN Stats</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin:0; padding:0; }
          header { background: #4CAF50; color: #fff; padding: 20px; text-align:center; }
          h1 { margin:0; }
          .container { max-width: 900px; margin: 20px auto; }
          .section { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
          h2 { color: #333; margin-top:0; }
          p { font-size: 16px; }
          .numbers { display:flex; flex-wrap:wrap; gap:10px; margin-top:10px; }
          .number { background:#e0e0e0; padding:10px 15px; border-radius:50%; font-weight:bold; color:#333; transition: all 0.3s; }
          .number.latest { background:#4CAF50; color:#fff; transform:scale(1.2); }
          table { width:100%; border-collapse: collapse; margin-top:10px; }
          th, td { padding:8px; text-align:center; border-bottom:1px solid #ddd; }
          .bar { height:20px; border-radius:10px; display:inline-block; }
        </style>
      </head>
      <body>
        <header>
          <h1>PowerBAN Statistics</h1>
        </header>
        <div class="container">
          <div class="section">
            <h2>Latest Draw (${data.drawDate})</h2>
            <div class="numbers">
              ${latestNumbers.map(n => `<div class="number latest">${n}</div>`).join('')}
            </div>
            <p><strong>Jackpot:</strong> ${data.jackpot}</p>
            <p><strong>Winners:</strong> ${data.winners.winners}</p>
          </div>

          <div class="section">
            <h2>Top Stats</h2>
            <p><strong>Most Common:</strong> ${mostCommon}</p>
            <p><strong>Least Common:</strong> ${leastCommon}</p>
            <p><strong>Top 5 Most Common:</strong> ${top5.join(', ')}</p>
            <p><strong>Numbers Never Appeared:</strong> ${neverAppeared.join(', ') || 'None'}</p>
            <p><strong>Total Draws Counted:</strong> ${totalDraws}</p>
          </div>

          <div class="section">
            <h2>Frequency Table</h2>
            <table>
              <tr><th>Number</th><th>Count</th><th>Percentage</th><th>Graph</th></tr>
              ${Object.entries(counts).map(([num,count]) => `
                <tr>
                  <td>${num}</td>
                  <td>${count}</td>
                  <td>${percentages[num]}%</td>
                  <td>
                    <div class="bar" style="
                      width:${percentages[num]}%; 
                      background: linear-gradient(to right, #a8e6cf, #4CAF50);
                    "></div>
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
      </body>
      </html>
    `;

    return new Response(html, { headers: { "Content-Type": "text/html" } });

  } catch(err) {
    return new Response(`<h1>Error</h1><p>${err.message}</p>`, { status: 500, headers: { "Content-Type": "text/html" } });
  }
}
