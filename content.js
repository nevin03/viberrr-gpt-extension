document.addEventListener("DOMContentLoaded", initializeBulletinButtons);

const observer = new MutationObserver(() => {
  initializeBulletinButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

function trimLabelText(label) {
  const maxChars = 10;
  const maxWords = 3;

  if (label.length <= maxChars) return label;

  const words = label.split(" ");
  if (words.length <= maxWords) {
    return label.length > maxChars ? label.slice(0, maxChars) + "..." : label;
  }

  return words.slice(0, maxWords).join(" ") + "...";
}

function initializeBulletinButtons() {
  const userMessages = document.querySelectorAll(
    'div[class*="user"], div[data-message-author-role="user"], article'
  );

  userMessages.forEach((message, index) => {
    const msgId = `message-${index}`;

    if (message.querySelector(".bulletin-button")) return;

    const button = document.createElement("button");
    button.className = "bulletin-button";
    button.innerHTML = "📌";
    button.title = "Pin this prompt";
    button.dataset.messageId = msgId;
    message.style.position = "relative";
    message.appendChild(button);

    button.addEventListener("click", () => {
      let floatContainer = document.querySelector(`#floating-bulletin-${msgId}`);

      if (!floatContainer) {
        floatContainer = document.createElement("div");
        floatContainer.className = "floating-bulletin-container";
        floatContainer.id = `floating-bulletin-${msgId}`;
        document.body.appendChild(floatContainer);
      }

      const label = prompt("Enter a label for this pin:", "My Pin");
      if (!label) return;

      const trimmed = label.trim();
      if (!trimmed) return;

      // Check duplicates (case-insensitive)
      const existingLabels = Array.from(
        floatContainer.querySelectorAll(".floating-bulletin-button")
      ).map(btn => btn.title.toLowerCase());

      if (existingLabels.includes(trimmed.toLowerCase())) {
        alert("This label already exists for this message.");
        return;
      }

      // Label button with trimmed text and full text in title for tooltip
      const floatButton = document.createElement("button");
      floatButton.className = "floating-bulletin-button";
      floatButton.textContent = trimLabelText(trimmed);
      floatButton.title = trimmed;

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "floating-bulletin-delete";
      deleteBtn.textContent = "🧹";
      deleteBtn.title = "Remove this pin";

      // Container for label + delete
      const pinWrapper = document.createElement("div");
      pinWrapper.style.display = "flex";
      pinWrapper.style.alignItems = "center";
      pinWrapper.style.gap = "4px";

      pinWrapper.appendChild(floatButton);
      pinWrapper.appendChild(deleteBtn);
      floatContainer.insertBefore(pinWrapper, floatContainer.firstChild);

      updateFloatingButtonPositions();

      // Scroll to message on label click
      floatButton.addEventListener("click", () => {
        message.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      // Delete pin on click
      deleteBtn.addEventListener("click", () => {
        pinWrapper.remove();
        if (floatContainer.children.length === 0) {
          floatContainer.remove();
        }
        updateFloatingButtonPositions();
      });
    });
  });
}

function updateFloatingButtonPositions() {
  const allContainers = document.querySelectorAll(".floating-bulletin-container");
  const gap = 50;
  const baseBottom = 20;

  allContainers.forEach((container, idx) => {
    container.style.bottom = `${baseBottom + idx * gap}px`;
    container.style.right = "20px";
  });
}
