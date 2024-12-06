async function fetchStreamUrls() {
    const videoUrl = document.getElementById("videoUrl").value;
    const apiUrl = "/stream-url?url=" + encodeURIComponent(videoUrl);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        if (data.streamUrls && data.streamUrls.length > 0) {
            data.streamUrls.forEach(stream => {
                const link = document.createElement("a");
                link.href = stream.url;
                link.textContent = `${stream.quality} - ${stream.url}`;
                link.target = "_blank";
                resultsDiv.appendChild(link);
                resultsDiv.appendChild(document.createElement("br"));
            });
        } else {
            resultsDiv.textContent = "No stream URLs found.";
        }
    } catch (error) {
        console.error("Error fetching stream URLs:", error);
    }
}
