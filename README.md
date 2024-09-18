# Kaiban LLM Proxy

This repository provides a proxy implementation for multiple Large Language Model (LLM) providers (OpenAI, Anthropic, Google Gemini, and Mistral) to securely forward API requests. The proxy is designed to help developers avoid exposing API keys directly on the frontend while maintaining flexible control over API interactions.

## Project Structure

The project is built with Next.js and includes separate proxy implementations for the following providers:

```plaintext
kaiban-llm-proxy
├── app
│   ├── proxy
│   │   ├── anthropic
│   │   ├── gemini
│   │   ├── mistral
│   │   └── openai
├── favicon.ico
├── globals.css
├── layout.js
└── page.js
```

Each directory under `/proxy` corresponds to a provider-specific proxy that securely forwards requests to the respective API.

## Features

- **CORS Support**: Pre-configured CORS headers to allow cross-origin requests.
- **Support for Bring Your Own Key (BYOAK)**: Users can pass their own API keys, or you can define them in the environment variables.
- **Common Headers**: Each proxy implementation standardizes common headers like content type, authorization, and CORS controls.
- **Secure API Key Management**: API keys are hidden from the client-side to avoid exposure.
- **Error Handling**: Graceful error handling for invalid requests and API call failures.
- **POST and OPTIONS Methods**: `POST` method to handle API requests and `OPTIONS` for preflight CORS support.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/kaiban-llm-proxy.git
cd kaiban-llm-proxy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

You need to set up API keys for each provider in your environment variables:

```bash
# .env.local

OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key
MISTRAL_API_KEY=your-mistral-api-key
```

### 4. Running Locally

To run the proxy server locally:

```bash
npm run dev
```

The proxy will be available at `http://localhost:3000`.

## Usage Example with KaibanJS

Here’s an example of how you can use the proxy with **KaibanJS**:

```javascript
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const profileAnalyst = new Agent({
    name: 'Mary', 
    role: 'Profile Analyst', 
    goal: 'Extract structured information from conversational user input.', 
    background: 'Data Processor',
    tools: [],
    llmConfig: {
      provider: "openai",
      apiBaseUrl: "http://localhost:3000/proxy/openai",
      // apiBaseUrl: "https://your_custom_url.com",      
    }
});

const resumeWriter = new Agent({
    name: 'Alex Mercer', 
    role: 'Resume Writer', 
    goal: `Craft compelling, well-structured resumes 
    that effectively showcase job seekers' qualifications and achievements.`,
    background: `Extensive experience in recruiting, 
    copywriting, and human resources, enabling 
    effective resume design that stands out to employers.`,
    tools: [],
    llmConfig: {
      provider: "openai",
      apiBaseUrl: "http://localhost:3000/proxy/openai",
      // apiBaseUrl: "https://your_custom_url.com",
    }     
});

// Define tasks
const processingTask = new Task({ 
  description: `Extract relevant details such as name, 
  experience, skills, and job history from the user's 'aboutMe' input. 
  aboutMe: {aboutMe}`,
  expectedOutput: 'Structured data ready to be used for a resume creation.', 
  agent: profileAnalyst
});

const resumeCreationTask = new Task({ 
    description: `Utilize the structured data to create 
    a detailed and attractive resume. 
    Enrich the resume content by inferring additional details from the provided information.
    Include sections such as a personal summary, detailed work experience, skills, and educational background.`,
    expectedOutput: `A professionally formatted resume in markdown format, 
    ready for submission to potential employers.`, 
    agent: resumeWriter 
});

// Create a team
const team = new Team({
  name: 'Resume Creation Team',
  agents: [profileAnalyst, resumeWriter],
  tasks: [processingTask, resumeCreationTask],
  inputs: { aboutMe: `My name is David Llaca. 
    JavaScript Developer for 5 years. 
    I worked for three years at Disney, 
    where I developed user interfaces for their primary landing pages
     using React, NextJS, and Redux. Before Disney, 
     I was a Junior Front-End Developer at American Airlines, 
     where I worked with Vue and Tailwind. 
     I earned a Bachelor of Science in Computer Science from FIU in 2018, 
     and I completed a JavaScript bootcamp that same year.` },  // Initial input for the first task
  env: {OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY, ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY}
});

export default team;
```

### Run Example

1. Make sure the proxy is running on `http://localhost:3000`.
2. Use KaibanJS to define your agents, tasks, and team, and integrate the proxy URLs for each respective LLM provider.
3. Pass your API keys via environment variables or within the proxy itself (as shown in the example above).

## Proxy Directories

Each LLM provider has its own directory under `/app/proxy`:

1. **`/proxy/openai`**: Proxy for OpenAI APIs
2. **`/proxy/anthropic`**: Proxy for Anthropic APIs
3. **`/proxy/gemini`**: Proxy for Google's Gemini APIs
4. **`/proxy/mistral`**: Proxy for Mistral APIs

Each proxy includes:
- **POST Handler**: For sending requests to the provider's API.
- **OPTIONS Handler**: For CORS preflight requests.
  
## Contributing

We welcome contributions! If you have improvements or bug fixes, feel free to submit a pull request.

### Steps for Contributing:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.