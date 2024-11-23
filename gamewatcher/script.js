const apiUrl = "https://games.roproxy.com/v1/games?universeIds=6585982530"; // Updated to roproxy.com
const votesApiUrl = "https://games.roproxy.com/v1/games/votes?universeIds=6585982530"; // API for votes
const refreshInterval = 30000; // 1 second

const gameNameElement = document.getElementById("game-name");
const concurrentUsersElement = document.getElementById("concurrent-users");
const totalVisitsElement = document.getElementById("total-visits");
const favoritedCountElement = document.getElementById("favorited-count");
const lastUpdatedElement = document.getElementById("last-updated");
const upvotesElement = document.getElementById("upvotes");
const downvotesElement = document.getElementById("downvotes");
const upvotePercentageElement = document.getElementById("upvote-percentage");
const apiErrorElement = document.getElementById("api-error"); // For showing API error messages

let currentStats = { concurrentUsers: 0, totalVisits: 0, favoritedCount: 0, gameName: "", lastUpdated: 0, upvotes: 0, downvotes: 0 };

async function fetchStats() {
  try {
    // Fetch game stats (concurrent users, visits, favorited count, game name, last updated)
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the response contains "Blocked"
    if (data && data.message && data.message.includes("Blocked")) {
      displayApiError("Stats API blocked us temporarily. Please try again later.");
      return;
    }

    const gameData = data.data[0];
    const newStats = {
      concurrentUsers: gameData.playing || 0,
      totalVisits: gameData.visits || 0,
      favoritedCount: gameData.favoritedCount || 0,
      gameName: gameData.name || "Unknown Game",
      lastUpdated: new Date(gameData.updated).getTime(), // Convert the "updated" timestamp to a timestamp (milliseconds)
    };

    // Fetch upvotes and downvotes
    const votesResponse = await fetch(votesApiUrl);
    const votesData = await votesResponse.json();

    if (votesData.message && votesData.message.includes("Blocked")) {
      displayApiError("Votes API blocked us temporarily. Please try again later.");
      return;
    }

    const votes = votesData.data[0];
    newStats.upvotes = votes.upVotes || 0;
    newStats.downvotes = votes.downVotes || 0;

    // Calculate upvote percentage
    const totalVotes = newStats.upvotes + newStats.downvotes;
    newStats.upvotePercentage = totalVotes > 0 ? (newStats.upvotes / totalVotes) * 100 : 0;

    // Update the game name and counters
    gameNameElement.textContent = newStats.gameName;
    updateCounter(concurrentUsersElement, currentStats.concurrentUsers, newStats.concurrentUsers);
    updateCounter(totalVisitsElement, currentStats.totalVisits, newStats.totalVisits);
    updateCounter(favoritedCountElement, currentStats.favoritedCount, newStats.favoritedCount);

    // Update the upvotes, downvotes, and upvote percentage
    upvotesElement.textContent = newStats.upvotes;
    downvotesElement.textContent = newStats.downvotes;
    upvotePercentageElement.textContent = `${newStats.upvotePercentage.toFixed(2)}%`;

    // Update the last updated time
    updateLastUpdated(newStats.lastUpdated);

    // Save current stats
    currentStats = newStats;

    // Clear any previous error message
    clearApiError();
  } catch (error) {
    console.error("Error fetching stats:", error);
    displayApiError("Error fetching stats. Please try again later.");
  }
}

function displayApiError(message) {
  apiErrorElement.textContent = message;
  apiErrorElement.style.display = "block";
}

function clearApiError() {
  apiErrorElement.style.display = "none";
}

function updateCounter(element, oldValue, newValue) {
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

    element.textContent = Math.round(currentValue);

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
    timeAgo = `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    timeAgo = `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    timeAgo = `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days < 365) {
    timeAgo = `${days} day${days !== 1 ? "s" : ""} ago`;
  } else {
    timeAgo = `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  lastUpdatedElement.textContent = `${timeAgo}`;
}

// Fetch stats every second
setInterval(fetchStats, refreshInterval);

// Initial fetch
fetchStats();
