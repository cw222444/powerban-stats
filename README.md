# PowerBAN Statistics Worker

A simple Cloudflare Worker that fetches PowerBAN lottery data and provides statistics on the latest draw and historical trends.  

---

## Features

- Displays the **latest winning numbers** from PowerBAN.
- Shows **jackpot amount** and **number of winners**.
- Computes **historical stats** using past draws, including:
  - Most and least common numbers
  - Top 5 most frequent numbers
  - Numbers that have never appeared
  - Frequency percentages and visual bar graph
- Fully rendered as a **clean HTML dashboard** with responsive styling.
- Works entirely serverless on Cloudflare Workers.

---

## How It Works

1. The Worker fetches the latest draw data from [PowerBAN API](https://api.powerban.win/draw/previous).
2. Combines the latest numbers with a local array of **past draws**.
3. Computes statistics:
   - Count of each number
   - Percentage occurrence
   - Most/least common numbers
   - Top 5 numbers
   - Numbers that have never appeared
4. Generates an **HTML page** with:
   - Latest draw numbers
   - Jackpot and winners info
   - Stats summary
   - Frequency table with visual bars

---

NOT ADVICE THIS WEBSITE MAY NOT WORK ANYMORE
