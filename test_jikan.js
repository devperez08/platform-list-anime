const query = "Naruto";
const JIKAN_API_BASE = "https://api.jikan.moe/v4";

async function testSearch() {
  try {
    const response = await fetch(
      `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&page=1`,
    );
    if (!response.ok) {
      console.error("Response not ok:", response.status, response.statusText);
      return;
    }
    const data = await response.json();
    console.log("Results count:", data.data?.length);
    if (data.data?.length > 0) {
      console.log("First result:", data.data[0].title);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testSearch();
