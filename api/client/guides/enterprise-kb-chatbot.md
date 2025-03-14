# Enterprise Knowledge Base Chatbot

This article demonstrates how you can build a chatbot application by integrating NVIDIA's NIM microservices with a customized LLM and Glean's internal knowledge search capabilities. By following the provided instructions, you can set up and run the demo application, modify it to use different LLMs, and deploy it within your organization's private network.

![chat_interface_1](../../../images/enterprise-kb-chatbot/chat_interface_1.png)

## Architecture

The chatbot uses NVIDIA NIM microservices, which can be hosted either on-premise or in a company's private cloud. Combined with the Glean "cloud-prem" offering, this allows organizations to create internal knowledge search, chat, and retrieval applications without any data leaving their environment.

![sample_architecture](../../../images/enterprise-kb-chatbot/glean_example_architecture.png)

This implementation includes the following components:

- Gradio chat interface
- LangGraph agent
- NVIDIA NIM microservices
- Chroma DB for a lightweight vector database
- Internal knowledge base stored in Glean, accessible via the Glean Search API

<!-- The example architecture and possible extensions are represented in the repository. <-- Not really sure what the purpose of this sentence is. -->

## Prerequisites

Before you begin, ensure that you have the required API keys, and have exported them as environment variables:

### NVIDIA API Key

This example utilizes hosted NVIDIA NIMs for the foundational Language Learning Models (LLMs). To use these hosted LLMs, you will need an NVIDIA API key, available at [NVIDIA Developer](https://build.nvidia.com).

```bash
export NVIDIA_API_KEY="nvapi-YOUR-KEY"
```

### Glean Instance and API Key

A Glean instance and API key are also required. Glean recommends using a development sandbox for initial testing.

```bash
export GLEAN_API_KEY="YOUR-GLEAN-API-KEY"
export GLEAN_API_BASE_URL="https://your-org.glean.com/rest/api/v1"
```

## Run the demo application

Before building your own chatbot application, you can clone and run an example chatbot web application from the "GenerativeAIExamples" NVIDIA repository:

1. Clone the repository and navigate to this example:

   ```bash
   git clone https://github.com/NVIDIA/GenerativeAIExamples
   cd GenerativeAIExamples/community/chat-and-rag-glean
   ```

2. Install the necessary dependencies. It is recommended to use `uv` as the Python installation and package manager:

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh # install uv
   uv python install                               # install python
   uv sync                                         # install the dependencies for this project
   ```

3. Run the chat app:

   ```bash
   uv run glean_example/src/app/app.py
   ```

4. Open your browser to `http://127.0.0.1:7860`.

This web application allows you to enter a prompt. The logs show the main steps the application takes to answer the prompt, with full logs displayed in the terminal.

## Customize the LLMs

The specific LLMs used for the agent and embeddings are specified in the file `glean_example/src/agent.py`. You can modify the values in these files to change which LLM the agent uses:

```python
model = ChatNVIDIA(
    model="meta/llama-3.3-70b-instruct", api_key=os.getenv("NVIDIA_API_KEY")
)
embeddings = NVIDIAEmbeddings(
    model="nvidia/llama-3.2-nv-embedqa-1b-v2",
    api_key=os.getenv("NVIDIA_API_KEY"),
    truncate="NONE",
)
```

- The main LLM used is `meta/llama-3.3-70b-instruct`. Update this model name to use a different LLM.
- The main embedding model used is `meta/llama-3.2-nv-embedqa-1b-v2`. Update this model name to use a different embedding model.

## Use in a Private Network

If you want to build an application similar to this demo that is hosted in your private environment to ensure no internal data leaves your systems:

1. Ensure you are using the [Glean "Cloud-prem" option](https://help.glean.com/en/articles/10093412-glean-deployment-options). Update the `GLEAN_API_BASE_URL` to your cloud-prem Glean installation.
2. Follow the appropriate [NVIDIA NIM deployment guide](https://docs.nvidia.com/nim/large-language-models/latest/deployment-guide.html) for your environment. Deploy at least one NVIDIA NIM foundational LLM and one NVIDIA NIM embedding model.
3. Update the file `glean_example/src/agent.py` to use the private endpoints:

   ```python
   model = ChatNVIDIA(
       model="meta/llama-3.3-70b-instruct",
       base_url="http://localhost:8000/v1", # Update to the URL where your NVIDIA NIM is running
       api_key=os.getenv("NVIDIA_API_KEY")
   )
   embeddings = NVIDIAEmbeddings(
       model="nvidia/llama-3.2-nv-embedqa-1b-v2",
       base_url="http://localhost:8000/v1", # Update to the URL where your NVIDIA NIM is running
       api_key=os.getenv("NVIDIA_API_KEY"),
       truncate="NONE",
   )
   ```

## Run the Jupyter Notebook

Further details about the code, and an example that calls a chatbot without a web application, is available in the Jupyter Notebook `nvidia_nim_langgraph_glean_example.ipynb`. To explore and run the notebook, you must download an run it:

<!-- prerequisites: brew install uv, brew install jupyterlab  -->

1. Download the notebook:

   ```
   wget? curl?
   ```

2. Run the notebook with the following command:

   ```
   uv run jupyter lab
   ```

<!-- Presumably, they should download it first? Where should we point them? my latest link looks like it's from a specific commit. -->
