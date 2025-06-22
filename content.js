document.addEventListener("DOMContentLoaded", initializeBulletinButtons);

const observer = new MutationObserver((mutations) => {
  initializeBulletinButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

// Array of colors for floating buttons
const colors = ["#4CAF50", "#2196F3", "#F44336", "#FF9800", "#9C27B0"]; // Green, Blue, Red, Orange, Purple

function initializeBulletinButtons() {
  const userMessages = document.querySelectorAll(
    'div[class*="user"], div[data-message-author-role="user"], article'
  );

  userMessages.forEach((message, index) => {
    if (message.querySelector(".bulletin-button")) return;

    const button = document.createElement("button");
    button.className = "bulletin-button";
    button.innerHTML = "📌";
    button.title = "Pin this prompt";
    button.dataset.messageId = `message-${index}`;
    message.style.position = "relative";
    message.appendChild(button);

    button.addEventListener("click", () => {
      // Check if this message is already pinned
      const existingFloatButton = document.querySelector(
        `#floating-bulletin-${button.dataset.messageId}`
      );
      if (existingFloatButton) return; // Prevent duplicate pins

      // Get the next color in the cycle
      const colorIndex =
        document.querySelectorAll(".floating-bulletin-button").length %
        colors.length;
      const buttonColor = colors[colorIndex];

      // Create floating button on left side
      const floatButton = document.createElement("button");
      floatButton.id = `floating-bulletin-${button.dataset.messageId}`;
      floatButton.className = "floating-bulletin-button";
      floatButton.style.backgroundColor = buttonColor;
      floatButton.innerHTML = "📌";
      floatButton.title = "Return to pinned prompt";
      document.body.appendChild(floatButton);

      // Position floating buttons vertically (stacked)
      const allFloatButtons = document.querySelectorAll(
        ".floating-bulletin-button"
      );
      allFloatButtons.forEach((btn, idx) => {
        btn.style.top = `${50 + idx * 50}px`; // Stack buttons 50px apart
      });

      // Add click event to scroll back to pinned message
      floatButton.addEventListener("click", () => {
        message.scrollIntoView({ behavior: "smooth" });
      });
    });
  });
}
