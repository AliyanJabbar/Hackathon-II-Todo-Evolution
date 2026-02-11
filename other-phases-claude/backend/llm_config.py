from dotenv import load_dotenv
import os
from agents import AsyncOpenAI, OpenAIChatCompletionsModel, RunConfig


load_dotenv()

# gemini config
# gemini_key = os.getenv("GEMINI_API_KEY")

# external_client = AsyncOpenAI(
#     api_key=gemini_key,
#     base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
# )

# external_model = OpenAIChatCompletionsModel(
#     model="gemini-2.0-flash", openai_client=external_client
# )

# config = RunConfig(
#     model=external_model,
#     model_provider=external_client,
# )

# ------------------------------ openrouter config ------------------------------ 

# openrouter_key = os.getenv("OPENROUTER_API_KEY")

# if not openrouter_key:
#     raise ValueError("OPENROUTER_API_KEY not found in environment variables")

# openrouter_client = AsyncOpenAI(
#     api_key=openrouter_key,
#     base_url="https://openrouter.ai/api/v1",
# )

# openrouter_model = OpenAIChatCompletionsModel(
#     # model="meta-llama/llama-3.3-70b-instruct:free",  # Better free model
#     model="openai/gpt-oss-20b:free",  # Better free model
#     openai_client=openrouter_client
# )

# open_router_config = RunConfig(
#     model=openrouter_model,
#     model_provider=openrouter_client,
#     tracing_disabled=True
# )


# ------------------------------ groq config ------------------------------ 


groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

groq_client = AsyncOpenAI(
    api_key=groq_key,
    base_url="https://api.groq.com/openai/v1",
)

groq_model = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b", 
    openai_client=groq_client
)

groq_config = RunConfig(
    model=groq_model,
    model_provider=groq_client, 
    tracing_disabled=True
)