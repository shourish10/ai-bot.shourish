from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Check if API key is set
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set in the environment.")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

# Choose the Gemini model
MODEL_NAME = "models/gemini-1.5-flash-latest"

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (for frontend communication)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "").strip()

        if not user_input:
            return jsonify({"response": "Please enter a message."})

        # Initialize Gemini model
        model = genai.GenerativeModel(model_name=MODEL_NAME)
        response = model.generate_content(user_input)

        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    # Render injects PORT env var dynamically
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)
