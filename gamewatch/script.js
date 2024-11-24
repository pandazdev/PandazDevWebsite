const apiUrl = "https://games.roproxy.com/v1/games?universeIds=6585982530"; // Updated to roproxy.com
const VotesAPIurl = "https://games.roproxy.com/v1/games/votes?universeIds=6585982530"
const refreshInterval = 5000; // 1 second

const gameNameElement = document.getElementById("game-name");
const concurrentUsersElement = document.getElementById("concurrent-users");
const totalVisitsElement = document.getElementById("total-visits");
const favoritedCountElement = document.getElementById("favorited-count");
const lastUpdatedElement = document.getElementById("last-updated");
const upvotesElement = document.getElementById("upvotes");
const downvotesElement = document.getElementById("downvotes");
const upvotePercentageElement = document.getElementById("upvote-percentage");

let currentStats = { concurrentUsers: 0, totalVisits: 0, favoritedCount: 0, gameName: "", lastUpdated: 0, likes: 0, dislikes: 0, ratio: 0 };

async function fetchStats() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extracting stats from the API response
    const gameData = data.data[0];
    const newStats = {
      concurrentUsers: gameData.playing || 0,
      totalVisits: gameData.visits || 0,
      favoritedCount: gameData.favoritedCount || 0,
      gameName: gameData.name || "Unknown Game",
      lastUpdated: new Date(gameData.updated) // Store the time of this update
    };

    // const votesResponse = await fetch(VotesAPIurl);
    // const votesData = await votesResponse.json();
    // const votes = votesData.data[0];

    // newStats.likes = votes.upVotes || 0;
    // newStats.dislikes = votes.downVotes || 0;

    // const totalVotes = newStats.likes + newStats.dislikes;
    // newStats.ratio = totalVotes > 0 ? (newStats.likes / totalVotes) * 100 : 0;
    // updateCounter(upvotesElement, currentStats.likes, newStats.likes)
    // updateCounter(downvotesElement, currentStats.dislikes, newStats.dislikes, "")

    // updateCounter(upvotePercentageElement, currentStats.ratio, newStats.ratio, "%")


    // Update the game name and counters
    gameNameElement.textContent = newStats.gameName; // Set the game name
    updateCounter(concurrentUsersElement, currentStats.concurrentUsers, newStats.concurrentUsers, "");
    updateCounter(totalVisitsElement, currentStats.totalVisits, newStats.totalVisits, "");
    updateCounter(favoritedCountElement, currentStats.favoritedCount, newStats.favoritedCount, "");

 
    // Update the last updated time
    updateLastUpdated(newStats.lastUpdated);

    // Save current stats
    currentStats = newStats;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

function updateCounter(element, oldValue, newValue, add) {
  if (oldValue === newValue) {
    return;
  }

  let currentValue = oldValue;
  const calculateStep = (remaining) => {
    if (remaining < 10) return 0.1;
    if (remaining < 25) return 0.25;
    if (remaining < 50) return 0.5;
    if (remaining < 100) return Math.ceil(remaining / 5); // Medium jump
    if (remaining > 100) return Math.floor(remaining / 2.5); // Large jump
    return 1; // Slow final approach
  };

  element.classList.add("updating");

  const interval = setInterval(() => {
    const remaining = Math.abs(newValue - currentValue);
    const step = calculateStep(remaining);

    if (currentValue < newValue) {
      currentValue += step;
      if (currentValue > newValue) currentValue = newValue; // Prevent overshooting
    } else {
      currentValue -= step;
      if (currentValue < newValue) currentValue = newValue; // Prevent overshooting
    }

    element.textContent = `${Math.round(currentValue)}${add}`;

    if (currentValue === newValue) {
      clearInterval(interval);
      element.classList.remove("updating");
    }
  }, 10); // Interval speed
}

function updateLastUpdated(lastUpdated) {
  const now = Date.now();
  const diff = now - lastUpdated;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  let timeAgo = "";

  if (seconds < 60) {
    timeAgo = `${seconds} seconds ago`;
  } else if (minutes < 60) {
    timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days < 365) {
    timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    timeAgo = `${years} year${years > 1 ? "s" : ""} ago`;
  }

  lastUpdatedElement.textContent = `Last Updated: ${timeAgo}`;
}

setInterval(fetchStats, refreshInterval);
fetchStats(); // Initial fetch
