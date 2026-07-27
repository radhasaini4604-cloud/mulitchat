export function GoogleSection() {
  return (
    <section id="google" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">Google Gemini Key</h3>
        <a 
          href="https://aistudio.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open Google AI Studio ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        Google provides the Gemini models which power our deep logic reasoning and document parsing features. Getting a key is free and takes less than a minute.
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to go to <strong>Google AI Studio</strong>.
        </li>
        <li>
          Log in using your standard <strong>Google Account</strong> (like your Gmail address).
        </li>
        <li>
          Look at the top-left corner of the screen and click the blue button that says <strong>"Get API key"</strong>.
        </li>
        <li>
          Click the button that says <strong>"Create API key"</strong>.
        </li>
        <li>
          Select <strong>"Create API key in new project"</strong>.
        </li>
        <li>
          Wait a moment for the key to generate. A box will pop up showing a long string of letters and numbers starting with <code>AIzaSy</code>. Click the <strong>Copy</strong> button.
        </li>
        <li>
          Go back to Nothric, open <strong>Settings</strong>, choose the <strong>API Keys</strong> tab, and paste it into the <strong>Gemini API Key</strong> box.
        </li>
      </ol>
    </section>
  )
}

export function GroqSection() {
  return (
    <section id="groq" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">Groq Key</h3>
        <a 
          href="https://console.groq.com/keys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open Groq Console ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        Groq is an ultra-fast hardware service that powers our lightning-fast open source models (like Llama 3.1).
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to go to the <strong>Groq Console</strong>.
        </li>
        <li>
          Sign up for a free account or log in if you already have one.
        </li>
        <li>
          In the sidebar menu on the left side, click on <strong>"API Keys"</strong>.
        </li>
        <li>
          Click the button that says <strong>"Create API Key"</strong>.
        </li>
        <li>
          Enter a name for your key (for example, "My Nothric App") so you know what it's for, and click <strong>"Submit"</strong>.
        </li>
        <li>
          A window will pop up showing your key (starting with <code>gsk_</code>). Click the <strong>Copy</strong> icon next to it. <em>(Note: Make sure to copy it now, as you won't be able to see it again!)</em>
        </li>
        <li>
          Open Nothric <strong>Settings</strong>, select the <strong>API Keys</strong> tab, and paste it into the <strong>Groq API Key</strong> input.
        </li>
      </ol>
    </section>
  )
}

export function MistralSection() {
  return (
    <section id="mistral" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">Mistral Key</h3>
        <a 
          href="https://console.mistral.ai/api-keys/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open Mistral Console ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        Mistral provides powerful European open-source models, including Codestral (great for code reviews) and Mistral Large.
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to open the <strong>Mistral Console</strong>.
        </li>
        <li>
          Register a free account or sign in.
        </li>
        <li>
          On the left navigation menu, click on <strong>"API Keys"</strong>.
        </li>
        <li>
          Click the <strong>"Create New Key"</strong> button.
        </li>
        <li>
          Give it a name and click <strong>"Create Key"</strong>.
        </li>
        <li>
          Copy the generated API Key.
        </li>
        <li>
          Open Nothric <strong>Settings</strong>, select the <strong>API Keys</strong> tab, and paste it into the <strong>Mistral API Key</strong> field.
        </li>
      </ol>
    </section>
  )
}

export function CohereSection() {
  return (
    <section id="cohere" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">Cohere Key</h3>
        <a 
          href="https://dashboard.cohere.com/api-keys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open Cohere Dashboard ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        Cohere offers Command R+ models that excel at long-form summaries and structured text writing.
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to go to the <strong>Cohere Dashboard</strong>.
        </li>
        <li>
          Sign up or log in.
        </li>
        <li>
          Navigate to the <strong>"API Keys"</strong> page from the left-side navigation menu.
        </li>
        <li>
          Look for the section titled <strong>"Trial Keys"</strong>. Cohere automatically generates a free trial key for you when you sign up!
        </li>
        <li>
          Copy the Trial Key value. If you don't see one, click <strong>"Create API Key"</strong>.
        </li>
        <li>
          Open Nothric <strong>Settings</strong>, select the <strong>API Keys</strong> tab, and paste it into the <strong>Cohere API Key</strong> input.
        </li>
      </ol>
    </section>
  )
}

export function NvidiaSection() {
  return (
    <section id="nvidia" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">NVIDIA Key</h3>
        <a 
          href="https://build.nvidia.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open NVIDIA Build ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        NVIDIA hosts high-fidelity image models (like Flux) and fast reasoning models on their GPU servers. Getting an API key is free for developers and personal users.
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to go to the <strong>NVIDIA Build Portal</strong>.
        </li>
        <li>
          Log in or create a developer account using your email or social log in.
        </li>
        <li>
          Click on any available model in the catalog (for example, search for "Flux" or "Nemotron").
        </li>
        <li>
          On the model description page, locate the button that says <strong>"Get API Key"</strong> or <strong>"Generate Key"</strong>.
        </li>
        <li>
          Copy the generated key (starts with <code>nvapi-</code>).
        </li>
        <li>
          Open Nothric <strong>Settings</strong>, choose the <strong>API Keys</strong> tab, and paste it into the <strong>NVIDIA API Key</strong> field.
        </li>
      </ol>
    </section>
  )
}

export function CloudflareSection() {
  return (
    <section id="cloudflare" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">Cloudflare Accounts</h3>
        <a 
          href="https://dash.cloudflare.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open Cloudflare Dashboard ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        Cloudflare provides fast, lightweight open-source models. Configuring Cloudflare requires two inputs: your Account ID and an API Token.
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to open the <strong>Cloudflare Dashboard</strong>.
        </li>
        <li>
          Sign up or log in.
        </li>
        <li>
          <strong>Find Account ID</strong>: On your main dashboard overview page, select your account. Look at the right-side panel under the "API" heading to find your <strong>Account ID</strong> (a 32-character string). Copy it and paste it into the <strong>Account ID</strong> input in Nothric settings.
        </li>
        <li>
          <strong>Get API Token</strong>: In the top right corner, click your profile icon and select <strong>"My Profile"</strong>.
        </li>
        <li>
          Click on <strong>"API Tokens"</strong> in the left menu, then click <strong>"Create Token"</strong>.
        </li>
        <li>
          Find the <strong>"Workers AI"</strong> template in the list and click <strong>"Use template"</strong>.
        </li>
        <li>
          Scroll to the bottom, click <strong>"Continue to summary"</strong>, then click <strong>"Create Token"</strong>.
        </li>
        <li>
          Copy the generated token, return to Nothric settings, and paste it into the <strong>API Token</strong> input under the Cloudflare section.
        </li>
      </ol>
    </section>
  )
}

export function TavilySection() {
  return (
    <section id="tavily" className="api-guide-text-section">
      <div className="api-guide-provider-header">
        <h3 className="api-guide-section-heading">Tavily Key</h3>
        <a 
          href="https://tavily.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-guide-portal-btn"
        >
          Open Tavily Console ↗
        </a>
      </div>
      
      <p className="api-guide-paragraph">
        Tavily is a specialized search engine for AI models, allowing Nothric to search the live web for up-to-date facts.
      </p>

      <ol className="api-guide-steps-list">
        <li>
          Click the button above to open the <strong>Tavily Website</strong>.
        </li>
        <li>
          Click <strong>"Get Started"</strong> or log in to create a free account.
        </li>
        <li>
          You will be redirected straight to your home dashboard page. Your API Key is displayed directly on the screen (it starts with <code>tvly-</code>).
        </li>
        <li>
          Click the <strong>"Copy"</strong> button next to the key.
        </li>
        <li>
          Open Nothric <strong>Settings</strong>, select the <strong>API Keys</strong> tab, and paste it into the <strong>Tavily API Key</strong> box.
        </li>
      </ol>
    </section>
  )
}
