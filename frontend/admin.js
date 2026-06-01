const API_BASE_CANDIDATES = [
  window.API_BASE,
  'http://127.0.0.1:5000/api',
  'http://localhost:5000/api',
  `${location.protocol}//${location.hostname}:5000/api`
].filter(Boolean);

const statusDiv = document.getElementById('adminStatus');
const messagesList = document.getElementById('messagesList');

async function fetchFromApi(path, options) {
  let lastError = null;
  for (const base of API_BASE_CANDIDATES) {
    try {
      console.log('Trying admin API base:', base);
      const response = await fetch(`${base}${path}`, options);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      return { response, base };
    } catch (error) {
      lastError = error;
      console.warn(`API base failed: ${base}`, error);
    }
  }
  throw lastError;
}

async function loadMessages() {
  statusDiv.textContent = 'Loading messages...';
  try {
    const { response, base } = await fetchFromApi('/contact/all');
    const data = await response.json();
    statusDiv.textContent = `Loaded ${data.count} message(s) from ${base}`;
    statusDiv.style.color = 'green';

    if (data.count === 0) {
      messagesList.innerHTML = '<p>No messages have been received yet.</p>';
      return;
    }

    messagesList.innerHTML = data.contacts.map(contact => {
      return `
        <div class="project-card" style="margin-bottom: 20px; padding: 18px; border: 1px solid #ccc; border-radius: 8px;">
          <h3>${contact.name}</h3>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Message:</strong> ${contact.message}</p>
          <p><strong>Received:</strong> ${contact.timestamp}</p>
          <p><strong>Reply:</strong> ${contact.reply ? contact.reply : '<em>No reply yet</em>'}</p>
          <p><strong>Reply sent:</strong> ${contact.reply_timestamp ? contact.reply_timestamp : '<em>Not sent</em>'}</p>
          <form class="reply-form" data-id="${contact.id}">
            <textarea name="reply" placeholder="Write your reply here" required style="width:100%; min-height:90px; margin-top:10px; padding:8px;"></textarea>
            <button type="submit" style="margin-top:10px;">Send Reply</button>
            <div class="reply-status" style="margin-top:10px;"></div>
          </form>
        </div>
      `;
    }).join('');
  } catch (error) {
    statusDiv.textContent = `Connection error: ${error.message}`;
    statusDiv.style.color = 'red';
  }
}

document.addEventListener('submit', async function (event) {
  if (!event.target.matches('.reply-form')) {
    return;
  }

  event.preventDefault();
  const form = event.target;
  const contactId = parseInt(form.dataset.id, 10);
  const reply = form.reply.value.trim();
  const status = form.querySelector('.reply-status');

  if (!reply) {
    status.style.color = 'red';
    status.textContent = 'Reply text is required.';
    return;
  }

  status.style.color = 'blue';
  status.textContent = 'Sending reply...';

  try {
    const { response, base } = await fetchFromApi('/contact/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: contactId,
        reply
      })
    });
    const data = await response.json();
    console.log('Reply sent using', base);
    status.style.color = 'green';
    status.textContent = data.email_status || 'Reply saved successfully.';
    form.reset();
    loadMessages();
  } catch (error) {
    status.style.color = 'red';
    status.textContent = `Connection error: ${error.message}`;
  }
});

loadMessages();